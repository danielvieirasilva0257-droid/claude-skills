#!/usr/bin/env python3
"""Ler o texto de um print ou de um quadro de vídeo (Tesseract, local) e dizer onde está cada palavra,
para pôr um destaque, um sublinhado ou um zoom exatamente em cima dela.

Uso:
  python ocr.py IMAGEM.png [-o ocr.json] [--buscar "Remotion"] [--folha ocr.jpg]
  python ocr.py VIDEO.mp4 --quadro 120   (ou --tempo 4.0)  [...]

Saída (pixels da imagem original):
  {"fonte","largura","altura","idioma","palavras":[{"texto","x","y","w","h","conf","linha"}],
   "busca":{"texto","achados":[{"x","y","w","h","conf","palavras"}]}}
--buscar aceita uma palavra ou uma frase (as palavras precisam estar seguidas na mesma linha);
a comparação ignora maiúsculas, acentos e pontuação.
"""
import argparse
import os
import sys
import unicodedata

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _comum import folha, ler_quadro, salvar_json  # noqa: E402

VIDEO_EXT = (".mp4", ".mov", ".mkv", ".webm", ".m4v", ".avi")


def normalizar(s: str) -> str:
    s = unicodedata.normalize("NFKD", s.lower())
    return "".join(c for c in s if c.isalnum())


def ler_palavras(img, idioma: str, escala: float, conf_min: float):
    import cv2
    import pytesseract
    cinza = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    if escala != 1.0:
        cinza = cv2.resize(cinza, None, fx=escala, fy=escala, interpolation=cv2.INTER_CUBIC)
    if cinza.mean() < 110:                         # light text on dark background: invert for Tesseract
        cinza = 255 - cinza
    d = pytesseract.image_to_data(cinza, lang=idioma, config="--psm 3", output_type=pytesseract.Output.DICT)
    palavras = []
    for i, t in enumerate(d["text"]):
        t = t.strip()
        c = float(d["conf"][i])
        if not t or c < conf_min:
            continue
        palavras.append({"texto": t, "x": round(d["left"][i] / escala), "y": round(d["top"][i] / escala),
                         "w": round(d["width"][i] / escala), "h": round(d["height"][i] / escala),
                         "conf": round(c / 100.0, 3),
                         "linha": f'{d["block_num"][i]}.{d["par_num"][i]}.{d["line_num"][i]}'})
    return palavras


def buscar(palavras, frase: str):
    alvo = [normalizar(p) for p in frase.split() if normalizar(p)]
    achados = []
    if not alvo:
        return achados
    for i in range(len(palavras)):
        grupo = palavras[i:i + len(alvo)]
        if len(grupo) < len(alvo) or len({p["linha"] for p in grupo}) > 1:
            continue
        def casa(k, a, p):                         # first word may have text glued before, last word after
            t = normalizar(p["texto"])
            if len(alvo) == 1:
                return a in t
            if k == 0:
                return t.endswith(a)
            if k == len(alvo) - 1:
                return t.startswith(a)
            return t == a
        ok = all(casa(k, a, p) for k, (a, p) in enumerate(zip(alvo, grupo)))
        if ok:
            x0 = min(p["x"] for p in grupo); y0 = min(p["y"] for p in grupo)
            x1 = max(p["x"] + p["w"] for p in grupo); y1 = max(p["y"] + p["h"] for p in grupo)
            # trim glued text ("<tag>Palavra", "palavra:") by the share of characters, so the box hugs the words
            ini, fim = grupo[0], grupo[-1]
            if len(alvo) > 1:
                t0 = ini["texto"]
                idx = t0.lower().rfind(frase.split()[0].lower())
                if idx > 0:
                    x0 = ini["x"] + round(ini["w"] * idx / len(t0))
                t1 = fim["texto"]
                sobra = len(t1) - len(t1.rstrip(":;,.!?)]}>\"'"))
                if sobra:
                    x1 = fim["x"] + fim["w"] - round(fim["w"] * sobra / len(t1))
            achados.append({"x": x0, "y": y0, "w": x1 - x0, "h": y1 - y0,
                            "conf": round(min(p["conf"] for p in grupo), 3),
                            "palavras": " ".join(p["texto"] for p in grupo)})
    return achados


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("fonte", help="imagem (png/jpg) ou vídeo")
    ap.add_argument("-o", "--saida", default="ocr.json")
    ap.add_argument("--quadro", type=int, help="número do quadro (vídeo)")
    ap.add_argument("--tempo", type=float, help="tempo em segundos (vídeo)")
    ap.add_argument("--idioma", default="por+eng", help="idiomas do Tesseract (padrão por+eng)")
    ap.add_argument("--escala", type=float, default=0.0, help="ampliar antes de ler (padrão: automático, texto pequeno pede 2)")
    ap.add_argument("--conf", type=float, default=50, help="confiança mínima de 0 a 100 (padrão 50)")
    ap.add_argument("--buscar", help="palavra ou frase para achar a posição")
    ap.add_argument("--folha", help="imagem com as caixas desenhadas (achados em laranja, demais em verde)")
    a = ap.parse_args()

    import cv2
    if a.fonte.lower().endswith(VIDEO_EXT):
        img, q, _ = ler_quadro(a.fonte, a.quadro, a.tempo if a.quadro is None else None)
        origem = f"{a.fonte} (quadro {q})"
    else:
        img = cv2.imread(a.fonte)
        if img is None:
            sys.exit(f"erro: não consegui abrir a imagem {a.fonte}")
        origem = a.fonte
    H, W = img.shape[:2]
    escala = a.escala or (2.0 if W < 1600 else 1.0)
    palavras = ler_palavras(img, a.idioma, escala, a.conf)
    dados = {"fonte": origem, "largura": W, "altura": H, "idioma": a.idioma, "palavras": palavras}
    achados = []
    if a.buscar:
        achados = buscar(palavras, a.buscar)
        dados["busca"] = {"texto": a.buscar, "achados": achados}
    salvar_json(dados, a.saida)
    print(f"{len(palavras)} palavras lidas" + (f" · '{a.buscar}': {len(achados)} achado(s)" if a.buscar else ""))
    for x in achados:
        print(f"  {x['palavras']!r} em x={x['x']} y={x['y']} w={x['w']} h={x['h']} (conf {x['conf']})")
    if a.folha:
        vis = img.copy()
        for p in palavras:
            cv2.rectangle(vis, (p["x"], p["y"]), (p["x"] + p["w"], p["y"] + p["h"]), (80, 200, 80), 1)
        for x in achados:
            cv2.rectangle(vis, (x["x"] - 4, x["y"] - 4), (x["x"] + x["w"] + 4, x["y"] + x["h"] + 4), (0, 140, 255), 3)
        folha([vis], a.folha, colunas=1, largura=min(W, 1600))


if __name__ == "__main__":
    main()
