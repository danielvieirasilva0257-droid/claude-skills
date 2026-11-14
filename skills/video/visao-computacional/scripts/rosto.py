#!/usr/bin/env python3
"""Face box on every frame (MediaPipe BlazeFace, local).

Uso: python rosto.py VIDEO [-o rosto.json] [--largura 640] [--passo 1] [--folha rosto.jpg]
Saída: {"fps", "largura", "altura", "quadros": [{"q", "t", "rostos": [{"x","y","w","h","conf"}]}]}
(coordenadas em pixels do vídeo original; "q" = número do quadro, "t" = segundos)
"""
import argparse
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _comum import abrir_video, folha, modelo, reduzir, salvar_json  # noqa: E402


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("video")
    ap.add_argument("-o", "--saida", default="rosto.json")
    ap.add_argument("--largura", type=int, default=640, help="largura de análise (menor = mais rápido)")
    ap.add_argument("--passo", type=int, default=1, help="analisar 1 a cada N quadros")
    ap.add_argument("--conf", type=float, default=0.5)
    ap.add_argument("--folha", help="salvar folha de quadros com as caixas desenhadas")
    a = ap.parse_args()

    import cv2
    import mediapipe as mp
    from mediapipe.tasks.python import BaseOptions, vision

    det = vision.FaceDetector.create_from_options(vision.FaceDetectorOptions(
        base_options=BaseOptions(model_asset_path=modelo("rosto")),
        running_mode=vision.RunningMode.VIDEO, min_detection_confidence=a.conf))
    cap, fps, W, H, n = abrir_video(a.video)
    quadros, amostras, q = [], [], 0
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        if q % a.passo == 0:
            pequeno, k = reduzir(frame, a.largura)
            img = mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(pequeno, cv2.COLOR_BGR2RGB))
            res = det.detect_for_video(img, int(q * 1000 / fps))
            rostos = []
            for d in res.detections:
                b = d.bounding_box
                rostos.append({"x": round(b.origin_x * k), "y": round(b.origin_y * k), "w": round(b.width * k),
                               "h": round(b.height * k), "conf": round(d.categories[0].score, 3)})
            quadros.append({"q": q, "t": round(q / fps, 3), "rostos": rostos})
            if a.folha and len(amostras) < 8 and q % max(1, n // 8) < a.passo:
                vis = frame.copy()
                for r in rostos:
                    cv2.rectangle(vis, (r["x"], r["y"]), (r["x"] + r["w"], r["y"] + r["h"]), (0, 200, 255), 3)
                amostras.append(vis)
        q += 1
    det.close()
    salvar_json({"fps": fps, "largura": W, "altura": H, "quadros": quadros}, a.saida)
    com = sum(1 for x in quadros if x["rostos"])
    print(f"{len(quadros)} quadros analisados, rosto em {com}")
    if a.folha:
        folha(amostras, a.folha)


if __name__ == "__main__":
    main()
