"""Shared helpers for the visao-computacional scripts (local, no GPU, no API keys).

Models are downloaded once from Google's public MediaPipe model bucket into
~/.cache/visao-computacional/ (override with VC_CACHE). Nothing is uploaded.
"""
import json
import os
import ssl
import sys
import urllib.request

MODELOS = {
    "rosto": "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite",
    "pessoa": "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite",
}


def modelo(nome: str) -> str:
    cache = os.environ.get("VC_CACHE", os.path.expanduser("~/.cache/visao-computacional"))
    os.makedirs(cache, exist_ok=True)
    url = MODELOS[nome]
    caminho = os.path.join(cache, os.path.basename(url))
    if not os.path.exists(caminho):
        ctx = None
        bundle = os.environ.get("SSL_CERT_FILE") or ("/root/.ccr/ca-bundle.crt" if os.path.exists("/root/.ccr/ca-bundle.crt") else None)
        if bundle:
            ctx = ssl.create_default_context(cafile=bundle)
        print(f"[modelo] baixando {nome} ...", file=sys.stderr)
        with urllib.request.urlopen(url, context=ctx, timeout=60) as r, open(caminho + ".part", "wb") as f:
            f.write(r.read())
        os.replace(caminho + ".part", caminho)
    return caminho


def abrir_video(caminho: str):
    import cv2
    cap = cv2.VideoCapture(caminho)
    if not cap.isOpened():
        sys.exit(f"erro: não consegui abrir {caminho}")
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    return cap, fps, w, h, n


def reduzir(frame, largura_max: int):
    """Resize for speed (4 CPUs); returns (small_frame, scale_back)."""
    import cv2
    h, w = frame.shape[:2]
    if w <= largura_max:
        return frame, 1.0
    s = largura_max / w
    return cv2.resize(frame, (largura_max, int(round(h * s)))), 1.0 / s


def salvar_json(dados, caminho: str):
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, indent=1)
    print(f"salvo: {caminho}")


def folha(imagens, caminho: str, colunas: int = 4, largura: int = 480):
    """Contact sheet of BGR images for visual review."""
    import cv2
    import numpy as np
    if not imagens:
        return
    tiles = []
    for im in imagens:
        h, w = im.shape[:2]
        tiles.append(cv2.resize(im, (largura, int(h * largura / w))))
    th = max(t.shape[0] for t in tiles)
    tiles = [cv2.copyMakeBorder(t, 0, th - t.shape[0], 0, 0, cv2.BORDER_CONSTANT) for t in tiles]
    while len(tiles) % colunas:
        tiles.append(np.zeros_like(tiles[0]))
    linhas = [np.hstack(tiles[i:i + colunas]) for i in range(0, len(tiles), colunas)]
    cv2.imwrite(caminho, np.vstack(linhas))
    print(f"folha de quadros: {caminho}")
