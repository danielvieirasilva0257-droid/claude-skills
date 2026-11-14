#!/usr/bin/env python3
"""Person cutout (MediaPipe selfie segmenter, local): the person becomes a layer with alpha,
so a title can sit BEHIND the person (editor rule 3: main element above the text).

Uso: python recorte.py VIDEO [-o pessoa_png/] [--webm pessoa.webm] [--largura 640] [--folha recorte.jpg]
Saída: sequência PNG RGBA (pessoa opaca, fundo transparente) e, opcional, um .webm VP9 com alfa.
"""
import argparse
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _comum import abrir_video, folha, modelo, reduzir  # noqa: E402


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("video")
    ap.add_argument("-o", "--saida", default="pessoa_png")
    ap.add_argument("--webm", help="também gerar .webm com alfa (Remotion <OffthreadVideo transparent>, HyperFrames <video>)")
    ap.add_argument("--largura", type=int, default=640, help="largura da análise; a máscara volta ao tamanho original")
    ap.add_argument("--suavizar", type=int, default=5, help="desfoque da borda da máscara, em pixels (0 = dura)")
    ap.add_argument("--folha", help="folha de quadros: pessoa sobre fundo xadrez")
    a = ap.parse_args()

    import cv2
    import mediapipe as mp
    import numpy as np
    from mediapipe.tasks.python import BaseOptions, vision

    seg = vision.ImageSegmenter.create_from_options(vision.ImageSegmenterOptions(
        base_options=BaseOptions(model_asset_path=modelo("pessoa")),
        running_mode=vision.RunningMode.VIDEO, output_confidence_masks=True, output_category_mask=False))
    cap, fps, W, H, n = abrir_video(a.video)
    os.makedirs(a.saida, exist_ok=True)
    amostras, q, area = [], 0, []
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        pequeno, _ = reduzir(frame, a.largura)
        img = mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(pequeno, cv2.COLOR_BGR2RGB))
        res = seg.segment_for_video(img, int(q * 1000 / fps))
        m = res.confidence_masks[0].numpy_view()
        m = cv2.resize(m.astype(np.float32), (W, H), interpolation=cv2.INTER_LINEAR)
        if a.suavizar:
            m = cv2.GaussianBlur(m, (0, 0), a.suavizar / 2)
        alfa = np.clip(m * 255, 0, 255).astype(np.uint8)
        area.append(float((alfa > 127).mean()))
        rgba = np.dstack([frame, alfa])
        cv2.imwrite(os.path.join(a.saida, f"{q:05d}.png"), rgba)
        if a.folha and len(amostras) < 8 and q % max(1, n // 8) == 0:
            xadrez = ((np.indices((H, W)).sum(0) // 24) % 2 * 60 + 120).astype(np.uint8)
            fundo = np.dstack([xadrez] * 3)
            k = (alfa[..., None] / 255.0)
            amostras.append((frame * k + fundo * (1 - k)).astype(np.uint8))
        q += 1
    seg.close()
    print(f"{q} quadros em {a.saida}/ · pessoa ocupa em média {100 * sum(area) / max(1, len(area)):.1f}% do quadro")
    if a.webm:
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", f"{fps}", "-i", os.path.join(a.saida, "%05d.png"),
                        "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "30", a.webm], check=True)
        print(f"webm com alfa: {a.webm}")
    if a.folha:
        folha(amostras, a.folha)


if __name__ == "__main__":
    main()
