#!/usr/bin/env python3
"""Exemplo completo (sem Remotion): título ATRÁS da pessoa + etiqueta que segue um objeto rastreado.
Serve de receita e de teste das outras ferramentas. Respeita as 4 regras do editor:
o título entra de fora do quadro (regra 4) e fica atrás da pessoa (regra 3); a etiqueta desce do alto,
não cruza o título nem o rosto (regra 1); nenhum recorte no meio da tela (regra 2: só o contorno da pessoa).

Uso:
  python exemplo_texto_atras.py VIDEO --mascara mascara.mp4 --de 400 --ate 700 \
      [--rastreio rastreio.json --etiqueta INSETO] [--titulo VISÃO] -o demo.mp4 --textos textos.json
  --errado   versão ERRADA de propósito: título na frente do rosto (para testar o conferir_regras.py)

--mascara: saída de  recorte.py VIDEO --de A --ate B --mascara mascara.mp4  (o mesmo trecho).
--textos: caixas de texto por quadro, no formato que o conferir_regras.py lê (tempo relativo ao demo.mp4).
"""
import argparse
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _comum import H264, EscritorFFmpeg, abrir_video, ler_json, quadros, salvar_json  # noqa: E402

FONTE_TITULO = "/usr/share/fonts/opentype/inter/InterDisplay-Black.otf"
FONTE_ETIQUETA = "/usr/share/fonts/opentype/inter/Inter-SemiBold.otf"


def ease_out_cubic(x):
    x = min(1.0, max(0.0, x))
    return 1 - (1 - x) ** 3


def camada_texto(texto, fonte, tamanho, cor, largura_max=None):
    """RGBA numpy layer with the text, tightly cropped."""
    import numpy as np
    from PIL import Image, ImageDraw, ImageFont
    f = ImageFont.truetype(fonte, tamanho)
    if largura_max:
        while f.getbbox(texto)[2] > largura_max and tamanho > 20:
            tamanho -= 4
            f = ImageFont.truetype(fonte, tamanho)
    x0, y0, x1, y1 = f.getbbox(texto)
    img = Image.new("RGBA", (x1 - x0 + 4, y1 - y0 + 4), (0, 0, 0, 0))
    ImageDraw.Draw(img).text((2 - x0, 2 - y0), texto, font=f, fill=cor)
    return np.array(img)[:, :, [2, 1, 0, 3]]          # RGBA -> BGRA for OpenCV frames


def colar(frame, camada, x, y):
    """Alpha-composite a BGRA layer onto a BGR frame at (x, y), clipped to the frame. Returns the drawn box."""
    import numpy as np
    H, W = frame.shape[:2]
    h, w = camada.shape[:2]
    x, y = int(round(x)), int(round(y))
    fx0, fy0, fx1, fy1 = max(0, x), max(0, y), min(W, x + w), min(H, y + h)
    if fx1 <= fx0 or fy1 <= fy0:
        return None
    c = camada[fy0 - y:fy1 - y, fx0 - x:fx1 - x]
    a = c[:, :, 3:4].astype(np.float32) / 255.0
    roi = frame[fy0:fy1, fx0:fx1].astype(np.float32)
    frame[fy0:fy1, fx0:fx1] = (c[:, :, :3] * a + roi * (1 - a)).astype(np.uint8)
    return [fx0, fy0, fx1 - fx0, fy1 - fy0]


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("video")
    ap.add_argument("--mascara", required=True)
    ap.add_argument("--de", type=int, required=True)
    ap.add_argument("--ate", type=int, required=True)
    ap.add_argument("--titulo", default="VISÃO")
    ap.add_argument("--altura-titulo", type=float, default=0.30, help="topo do título, fração da altura do quadro")
    ap.add_argument("--rastreio", help="rastreio.json do rastrear.py (mesmo vídeo, cobrindo o trecho)")
    ap.add_argument("--etiqueta", default="INSETO")
    ap.add_argument("--errado", action="store_true", help="título NA FRENTE do rosto (teste do conferir_regras)")
    ap.add_argument("-o", "--saida", default="demo.mp4")
    ap.add_argument("--textos", default="textos.json")
    a = ap.parse_args()

    import cv2
    import numpy as np

    cap, fps, W, H, n = abrir_video(a.video)
    masc = cv2.VideoCapture(a.mascara)
    ras = {r["q"]: r for r in ler_json(a.rastreio)["quadros"]} if a.rastreio else {}

    titulo = camada_texto(a.titulo, FONTE_TITULO, int(H * 0.17), (255, 90, 31, 255), largura_max=int(W * 0.94))  # accent: reads on light and dark walls
    th, tw = titulo.shape[:2]
    alvo_x = (W - tw) / 2
    topo = H * (0.55 if a.errado else a.altura_titulo)  # wrong version: right over the face
    etiqueta = camada_texto(a.etiqueta, FONTE_ETIQUETA, int(H * 0.022), (245, 245, 247, 255))
    eh, ew = etiqueta.shape[:2]
    pad = int(H * 0.008)
    pilula = np.zeros((eh + 2 * pad, ew + 4 * pad, 4), np.uint8)
    cv2.rectangle(pilula, (0, 0), (pilula.shape[1] - 1, pilula.shape[0] - 1), (24, 21, 20, 255), -1)
    pil_rgba = pilula.copy()
    sub = pil_rgba[pad:pad + eh, 2 * pad:2 * pad + ew]
    al = etiqueta[:, :, 3:4] / 255.0
    sub[:, :, :3] = (etiqueta[:, :, :3] * al + sub[:, :, :3] * (1 - al)).astype(np.uint8)

    escritor = EscritorFFmpeg(a.saida + ".video.mp4", W, H, fps, "bgr24", H264)
    textos = []
    for q, frame in quadros(cap, a.de, a.ate):
        ok, m = masc.read()
        if not ok:
            sys.exit(f"erro: a máscara acabou no quadro {q}; gere-a com --de {a.de} --ate {a.ate}")
        alfa = (m[:, :, 0].astype(np.float32) / 255.0)[..., None]
        t = (q - a.de) / fps
        out = frame.copy()
        # title: slides in from the LEFT edge of the frame (rule 4), ease-out, then holds
        e = ease_out_cubic((t - 0.4) / 0.9)
        x = -tw + (alvo_x + tw) * e
        caixa_t = colar(out, titulo, x, topo)
        if not a.errado:
            out = (frame * alfa + out * (1 - alfa)).astype(np.uint8)   # person back on top (rule 3)
        if caixa_t:
            textos.append({"id": "titulo", "inicio": round(t, 4), "fim": round(t + 1 / fps, 4),
                           "x": caixa_t[0], "y": caixa_t[1], "w": caixa_t[2], "h": caixa_t[3],
                           "atras": not a.errado})
        # label: drops in from the TOP edge (rule 4) and then follows the tracked object
        r = ras.get(q)
        if r and not r["perdido"]:
            e2 = ease_out_cubic((t - 1.6) / 0.6)
            ph, pw = pil_rgba.shape[:2]
            lx = r["cx"] - pw - 26
            ly = r["cy"] - ph / 2 - (1 - e2) * (r["cy"] + ph + 40)
            if e2 > 0:
                cy_linha = int(round(ly + ph / 2))
                cv2.line(out, (int(lx + pw), cy_linha), (int(r["cx"] - 14), int(r["cy"])), (31, 90, 255), 3, cv2.LINE_AA)
                cv2.circle(out, (int(r["cx"]), int(r["cy"])), 16, (31, 90, 255), 3, cv2.LINE_AA)
                caixa_e = colar(out, pil_rgba, lx, ly)
                if caixa_e:
                    textos.append({"id": "etiqueta", "inicio": round(t, 4), "fim": round(t + 1 / fps, 4),
                                   "x": caixa_e[0], "y": caixa_e[1], "w": caixa_e[2], "h": caixa_e[3], "atras": False})
        escritor.escrever(out)
    escritor.fechar()
    cap.release()
    masc.release()
    ini = a.de / fps
    dur = (a.ate - a.de + 1) / fps
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.saida + ".video.mp4", "-ss", f"{ini:.4f}", "-t", f"{dur:.4f}",
                    "-i", a.video, "-map", "0:v", "-map", "1:a?", "-c:v", "copy", "-c:a", "aac", "-shortest", a.saida],
                   check=True)
    os.remove(a.saida + ".video.mp4")
    salvar_json(textos, a.textos)
    print(f"vídeo: {a.saida} ({dur:.1f} s)")


if __name__ == "__main__":
    main()
