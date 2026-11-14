#!/usr/bin/env python3
"""Autorrevisão das regras do editor num vídeo: acusa os quadros em que um TEXTO fica na frente do ROSTO
ou em cima de OUTRO TEXTO (regra 1: nada de texto sobre texto; nada passa na frente do rosto).

Dois jeitos de informar os textos:
  --textos textos.json   lista exportada pelo motor do vídeo (Remotion, HyperFrames, script próprio):
                         [{"id","inicio","fim","x","y","w","h","atras":false}]  (segundos e pixels)
                         "atras": true = camada ATRÁS da pessoa (o rosto cobre o texto: permitido, regra 3)
  --auto                 acha as regiões de texto no vídeo RENDERIZADO (detector PP-OCR, sem exportar nada);
                         só confere texto x rosto (um título visto em pedaços não conta como texto sobre texto)

Uso:
  python conferir_regras.py VIDEO --textos textos.json [--rosto rosto.json] [-o regras.json] [--folha regras.jpg]
  python conferir_regras.py VIDEO --auto [--passo 10] [...]
Sem --rosto, o rosto é medido na hora (rosto.py). Sai com código 1 quando acha problema (bom para automação).
"""
import argparse
import os
import subprocess
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _comum import abrir_video, folha, ler_json, modelo, quadros, rotulo, salvar_json  # noqa: E402

AQUI = os.path.dirname(os.path.abspath(__file__))


def cruza(a, b):
    """Overlap area of two boxes (x, y, w, h)."""
    w = min(a[0] + a[2], b[0] + b[2]) - max(a[0], b[0])
    h = min(a[1] + a[3], b[1] + b[3]) - max(a[1], b[1])
    return max(0, w) * max(0, h)


def agrupar(eventos, fps, folga=2):
    """{(tipo, ids): [q,...]} -> intervals of frames closer than `folga`."""
    saida = []
    for (tipo, ids), qs in eventos.items():
        qs = sorted(qs)
        ini = ant = qs[0]
        for q in qs[1:] + [None]:
            if q is not None and q - ant <= folga:
                ant = q
                continue
            saida.append({"tipo": tipo, "ids": list(ids), "de": ini, "ate": ant,
                          "inicio": round(ini / fps, 3), "fim": round(ant / fps, 3)})
            if q is not None:
                ini = ant = q
    return sorted(saida, key=lambda p: (p["de"], p["tipo"]))


_DETECTOR = None


def textos_detectados(frame, conf_min):
    """Visible text regions in a rendered frame (PP-OCR DB detector: works on coloured titles over video)."""
    global _DETECTOR
    import cv2
    import numpy as np
    if _DETECTOR is None:
        _DETECTOR = cv2.dnn.TextDetectionModel_DB(modelo("texto"))
        _DETECTOR.setBinaryThreshold(0.3).setPolygonThreshold(0.5).setMaxCandidates(200).setUnclipRatio(2.0)
        _DETECTOR.setInputParams(1.0 / 255.0, (736, 736), (122.67891434, 116.66876762, 104.00698793), True)
    quads, confs = _DETECTOR.detect(frame)
    saida = []
    for k, (qd, c) in enumerate(zip(quads, confs)):
        x, y, w, h = cv2.boundingRect(np.array(qd, np.int32))
        if float(c) >= conf_min and w >= 24 and h >= 24:
            saida.append({"id": "texto (auto)", "x": x, "y": y, "w": w, "h": h, "atras": False, "auto": True})
    return saida


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("video")
    ap.add_argument("--textos", help="JSON com as caixas de texto exportadas pelo motor do vídeo")
    ap.add_argument("--auto", action="store_true", help="achar o texto no vídeo renderizado (detector de texto)")
    ap.add_argument("--rosto", help="rosto.json (do rosto.py) do MESMO vídeo; sem ele, mede na hora")
    ap.add_argument("--margem", type=float, default=0.10, help="folga em volta do rosto, fração do tamanho dele (0.10 = 10%%)")
    ap.add_argument("--passo", type=int, default=1, help="conferir 1 a cada N quadros (--auto usa 10 se não disser)")
    ap.add_argument("--conf", type=float, default=0.6, help="--auto: confiança mínima do detector de texto, 0 a 1")
    ap.add_argument("--area-min", type=float, default=0.10,
                    help="--auto: o texto precisa cobrir esta fração do rosto para contar (padrão 0.10)")
    ap.add_argument("-o", "--saida", default="regras.json")
    ap.add_argument("--folha", help="folha com o primeiro quadro de cada problema (rosto em azul, textos em vermelho)")
    a = ap.parse_args()
    if not (a.textos or a.auto):
        sys.exit("erro: diga de onde vêm os textos: --textos textos.json ou --auto")
    passo = a.passo if (a.passo != 1 or not a.auto) else 10

    cap, fps, W, H, n = abrir_video(a.video)
    if a.rosto:
        rj = ler_json(a.rosto)
    else:
        tmp = os.path.join(tempfile.mkdtemp(), "rosto.json")
        subprocess.run([sys.executable, "-I", os.path.join(AQUI, "rosto.py"), a.video, "-o", tmp,
                        "--passo", str(passo)], check=True, stdout=subprocess.DEVNULL)
        rj = ler_json(tmp)
    rostos = {f["q"]: f["rostos"] for f in rj["quadros"]}
    k = W / rj.get("largura", W)                      # rosto.json from a different resolution
    lista = ler_json(a.textos) if a.textos else []

    eventos, exemplos = {}, {}
    ultimo_rosto = []
    for q, frame in quadros(cap, 0, None, passo):
        t = q / fps
        rs = rostos.get(q, ultimo_rosto)
        ultimo_rosto = rs
        caixas_r = []
        for r in rs:
            mx, my = r["w"] * a.margem, r["h"] * a.margem
            caixas_r.append(((r["x"] - mx) * k, (r["y"] - my) * k, (r["w"] + 2 * mx) * k, (r["h"] + 2 * my) * k))
        ativos = [x for x in lista if x["inicio"] <= t < x["fim"]]
        if a.auto:
            ativos += textos_detectados(frame, a.conf)
        achou = []
        for x in ativos:
            cx = (x["x"], x["y"], x["w"], x["h"])
            minimo = (lambda r: a.area_min * r[2] * r[3]) if x.get("auto") else (lambda r: 0)
            if not x.get("atras") and any(cruza(cx, r) > minimo(r) for r in caixas_r):
                achou.append(("texto sobre o rosto", (x["id"],)))
        for i in range(len(ativos)):
            for j in range(i + 1, len(ativos)):
                A, B = ativos[i], ativos[j]
                if A.get("auto") and B.get("auto"):
                    continue                          # detector splits one title into pieces: only exported boxes count
                if cruza((A["x"], A["y"], A["w"], A["h"]), (B["x"], B["y"], B["w"], B["h"])) > 0:
                    achou.append(("texto sobre texto", tuple(sorted((str(A["id"]), str(B["id"]))))))
        for chave in achou:
            eventos.setdefault(chave, []).append(q)
            if chave not in exemplos:
                vis = frame.copy()
                import cv2
                for r in caixas_r:
                    cv2.rectangle(vis, (int(r[0]), int(r[1])), (int(r[0] + r[2]), int(r[1] + r[3])), (255, 140, 0), 3)
                for x in ativos:
                    cor = (60, 60, 255) if str(x["id"]) in chave[1] else (120, 120, 120)
                    cv2.rectangle(vis, (x["x"], x["y"]), (x["x"] + x["w"], x["y"] + x["h"]), cor, 3)
                exemplos[chave] = rotulo(vis, f"q {q} {t:.2f}s", 8, 8)
    cap.release()

    problemas = agrupar(eventos, fps, folga=max(2, int(passo * 1.5))) if eventos else []
    salvar_json({"video": a.video, "fps": fps, "passo": passo, "modo": "auto" if a.auto else "textos",
                 "problemas": problemas, "ok": not problemas}, a.saida)
    if not problemas:
        print("OK: nenhum texto na frente do rosto e nenhum texto sobre outro texto")
    for p in problemas:
        print(f"PROBLEMA: {p['tipo']} ({', '.join(p['ids'])}) de {p['inicio']:.2f}s a {p['fim']:.2f}s "
              f"(quadros {p['de']} a {p['ate']})")
    if a.folha and exemplos:
        folha(list(exemplos.values())[:8], a.folha, colunas=4 if W < H else 2,
              legendas=[f"{c[0]}: {', '.join(c[1])}"[:40] for c in list(exemplos)[:8]])
    sys.exit(1 if problemas else 0)


if __name__ == "__main__":
    main()
