"""Shared helpers for the visao-computacional scripts (local, no GPU, no API keys).

Models are downloaded once from Google's public MediaPipe model bucket into
~/.cache/visao-computacional/ (override with VC_CACHE). Nothing is uploaded.
"""
import json
import os
import shutil
import ssl
import subprocess
import sys
import urllib.request
from fractions import Fraction

_BASE = "https://storage.googleapis.com/mediapipe-models/"
MODELOS = {
    "rosto": _BASE + "face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite",
    "pessoa": _BASE + "image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite",
    "pessoa_multiclasse": _BASE + "image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite",
}


def aviso(msg: str):
    print(f"aviso: {msg}", file=sys.stderr)


def modelo(nome: str) -> str:
    """Path of a cached model file; downloads it on first use."""
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
        try:
            with urllib.request.urlopen(url, context=ctx, timeout=120) as r, open(caminho + ".part", "wb") as f:
                shutil.copyfileobj(r, f)
        except Exception as e:  # noqa: BLE001
            sys.exit(f"erro: não consegui baixar o modelo '{nome}' ({e}).\n"
                     f"Baixe à mão {url}\ne salve em {caminho}")
        os.replace(caminho + ".part", caminho)
    return caminho


def _taxa(texto: str) -> float:
    try:
        return float(Fraction(texto.strip()))
    except (ValueError, ZeroDivisionError):
        return 0.0


def taxa_variavel(caminho: str):
    """True when the file has a variable frame rate (phone recordings). None if ffprobe is missing."""
    if not shutil.which("ffprobe"):
        return None
    try:
        r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                            "stream=r_frame_rate,avg_frame_rate", "-of", "csv=p=0", caminho],
                           capture_output=True, text=True, timeout=30)
        partes = r.stdout.strip().split(",")
        a, b = _taxa(partes[0]), _taxa(partes[1])
        return bool(a and b and abs(a - b) / max(a, b) > 0.01)
    except Exception:  # noqa: BLE001
        return None


def abrir_video(caminho: str):
    """Open a video. Returns (cap, fps, width, height, n_frames). Frames come already rotated upright."""
    import cv2
    if not os.path.exists(caminho):
        sys.exit(f"erro: arquivo não encontrado: {caminho}")
    cap = cv2.VideoCapture(caminho)
    if not cap.isOpened():
        sys.exit(f"erro: não consegui abrir {caminho}")
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if taxa_variavel(caminho):
        aviso("este vídeo tem taxa de quadros variável (comum em gravação de celular): o número do quadro "
              "não bate com o tempo. Converta antes:\n"
              f"       ffmpeg -i \"{caminho}\" -vf fps=30 -c:v libx264 -crf 16 -c:a copy constante.mp4")
    return cap, fps, w, h, n


def quadros(cap, de: int = 0, ate=None, passo: int = 1):
    """Yield (q, frame) reading sequentially (frame-exact; seeking is not exact in every file)."""
    q = 0
    while q < de:
        if not cap.grab():
            return
        q += 1
    while ate is None or q <= ate:
        if (q - de) % passo:
            if not cap.grab():
                return
        else:
            ok, frame = cap.read()
            if not ok:
                return
            yield q, frame
        q += 1


def ler_quadro(caminho: str, q=None, tempo=None):
    """One frame of a video, by frame number or by time in seconds. Returns (frame, q, fps)."""
    cap, fps, _, _, n = abrir_video(caminho)
    if q is None:
        q = int(round((tempo or 0.0) * fps))
    for i, frame in quadros(cap, q, q):
        cap.release()
        return frame, i, fps
    sys.exit(f"erro: o vídeo não tem o quadro {q} (ele tem {n} quadros)")


def reduzir(frame, largura_max: int):
    """Resize for speed (4 CPUs); returns (small_frame, scale_back)."""
    import cv2
    h, w = frame.shape[:2]
    if not largura_max or w <= largura_max:
        return frame, 1.0
    s = largura_max / w
    return cv2.resize(frame, (largura_max, int(round(h * s))), interpolation=cv2.INTER_AREA), 1.0 / s


def ler_json(caminho: str):
    with open(caminho, encoding="utf-8") as f:
        return json.load(f)


def salvar_json(dados, caminho: str):
    pasta = os.path.dirname(os.path.abspath(caminho))
    os.makedirs(pasta, exist_ok=True)
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, indent=1)
    print(f"salvo: {caminho}")


def rotulo(img, texto: str, x: int = 8, y: int = 8, cor=(255, 255, 255), fundo=(0, 0, 0), escala: float = 0.0):
    """Small label with a solid background, drawn in place (ASCII only: OpenCV has no accents)."""
    import cv2
    if not escala:
        escala = max(0.5, img.shape[1] / 900.0)
    esp = max(1, int(round(escala * 2)))
    (tw, th), base = cv2.getTextSize(texto, cv2.FONT_HERSHEY_SIMPLEX, escala, esp)
    x = max(0, min(x, img.shape[1] - tw - 8))
    y = max(0, min(y, img.shape[0] - th - base - 8))
    cv2.rectangle(img, (x, y), (x + tw + 8, y + th + base + 8), fundo, -1)
    cv2.putText(img, texto, (x + 4, y + th + 4), cv2.FONT_HERSHEY_SIMPLEX, escala, cor, esp, cv2.LINE_AA)
    return img


def folha(imagens, caminho: str, colunas: int = 4, largura: int = 480, legendas=None):
    """Contact sheet of BGR images for visual review; optional caption per tile."""
    import cv2
    import numpy as np
    if not imagens:
        aviso("nenhum quadro para a folha de quadros")
        return
    colunas = max(1, min(colunas, len(imagens)))
    tiles = []
    for i, im in enumerate(imagens):
        h, w = im.shape[:2]
        t = cv2.resize(im, (largura, max(1, int(h * largura / w))), interpolation=cv2.INTER_AREA)
        if legendas and i < len(legendas) and legendas[i]:
            rotulo(t, legendas[i], 6, 6, escala=max(0.45, largura / 900.0))
        tiles.append(t)
    th = max(t.shape[0] for t in tiles)
    tiles = [cv2.copyMakeBorder(t, 0, th - t.shape[0], 0, 0, cv2.BORDER_CONSTANT) for t in tiles]
    while len(tiles) % colunas:
        tiles.append(np.zeros_like(tiles[0]))
    linhas = [np.hstack(tiles[i:i + colunas]) for i in range(0, len(tiles), colunas)]
    pasta = os.path.dirname(os.path.abspath(caminho))
    os.makedirs(pasta, exist_ok=True)
    cv2.imwrite(caminho, np.vstack(linhas), [cv2.IMWRITE_JPEG_QUALITY, 90])
    print(f"folha de quadros: {caminho}")


def amostras_uniformes(de: int, ate: int, quantas: int):
    """`quantas` frame numbers spread evenly over [de, ate]."""
    if ate <= de or quantas <= 1:
        return [de]
    return sorted({int(round(de + i * (ate - de) / (quantas - 1))) for i in range(quantas)})


class EscritorFFmpeg:
    """Pipe raw frames into ffmpeg (no giant intermediate files)."""

    def __init__(self, caminho: str, w: int, h: int, fps: float, pix_fmt: str, args_saida):
        if not shutil.which("ffmpeg"):
            sys.exit("erro: ffmpeg não encontrado (apt-get install ffmpeg)")
        pasta = os.path.dirname(os.path.abspath(caminho))
        os.makedirs(pasta, exist_ok=True)
        self.caminho = caminho
        self.p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", pix_fmt,
                                   "-s", f"{w}x{h}", "-r", f"{fps}", "-i", "-", *args_saida, caminho],
                                  stdin=subprocess.PIPE)

    def escrever(self, frame):
        try:
            self.p.stdin.write(frame.tobytes())
        except BrokenPipeError:
            sys.exit(f"erro: o ffmpeg parou ao gravar {self.caminho}")

    def fechar(self):
        self.p.stdin.close()
        if self.p.wait():
            sys.exit(f"erro: o ffmpeg falhou ao gravar {self.caminho}")


H264 = ["-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p",
        "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2", "-movflags", "+faststart"]
