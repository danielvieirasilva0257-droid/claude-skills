#!/usr/bin/env python3
"""Recorte da pessoa (MediaPipe, local): a pessoa vira uma camada com transparência,
para um título ficar ATRÁS dela (regra 3 do editor: o elemento principal fica por cima do texto).

Uso:
  python recorte.py VIDEO --webm pessoa.webm [--folha recorte.jpg]
  python recorte.py VIDEO -o pessoa_png/            (sequência PNG RGBA, pesada: ~1 MB por quadro em 720x1280)
  python recorte.py VIDEO --mascara mascara.mp4     (só a máscara, branco = pessoa, para o alphamerge do ffmpeg)
  python recorte.py VIDEO --de 400 --ate 700 --webm trecho.webm   (só um trecho; o .webm começa no quadro --de)

Saídas: .webm VP9 com alfa (Remotion <OffthreadVideo transparent>, HyperFrames <video>),
sequência PNG RGBA (nome = número do quadro do vídeo original) e/ou vídeo da máscara.
"""
import argparse
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _comum import (EscritorFFmpeg, abrir_video, amostras_uniformes, aviso, folha, modelo, quadros,  # noqa: E402
                    reduzir)

# VP9 with alpha, tagged BT.709 so browsers and ffmpeg read the same colours as the original plate
VP9 = ["-vf", "scale=out_color_matrix=bt709:out_range=tv", "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p",
       "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
       "-b:v", "0", "-row-mt", "1", "-threads", "4", "-deadline", "good", "-cpu-used", "4", "-auto-alt-ref", "0"]
MASCARA = ["-c:v", "libx264", "-preset", "veryfast", "-crf", "14", "-pix_fmt", "yuv420p",
           "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2:out_range=pc", "-color_range", "pc"]


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("video")
    ap.add_argument("-o", "--saida", help="pasta da sequência PNG RGBA (padrão: pessoa_png/, se não pedir --webm nem --mascara)")
    ap.add_argument("--webm", help="gerar .webm VP9 com alfa (leve; é o que o Remotion e o HyperFrames usam)")
    ap.add_argument("--mascara", help="gerar vídeo só da máscara (branco = pessoa), H.264")
    ap.add_argument("--de", type=int, default=0, help="primeiro quadro (padrão 0)")
    ap.add_argument("--ate", type=int, help="último quadro, incluído (padrão: fim do vídeo)")
    ap.add_argument("--largura", type=int, default=640, help="largura da análise; a máscara volta ao tamanho original")
    ap.add_argument("--modelo", choices=["selfie", "multiclasse"], default="selfie",
                    help="selfie = rápido (padrão); multiclasse = mãos e cabelo melhores, ~7x mais lento")
    ap.add_argument("--tempo", type=float, default=0.6,
                    help="suavização entre quadros, 0 a 1 (tira o pisca-pisca da borda; 0 = desligada)")
    ap.add_argument("--refino", choices=["guiado", "simples"], default="guiado",
                    help="guiado = a borda acompanha o contorno real da imagem; simples = só desfoque")
    ap.add_argument("--niveis", default="0.4,0.9",
                    help="corte da máscara 'min,max' de 0 a 1; subir o min aperta a borda e tira o halo")
    ap.add_argument("--encolher", type=float, default=0.5, help="apertar a borda mais N pixels para dentro")
    ap.add_argument("--suavizar", type=float, default=1.0, help="desfoque final da borda, em pixels (0 = nítida)")
    ap.add_argument("--ilha", type=float, default=0.3, help="apagar manchas soltas menores que N%% do quadro (0 = não apagar)")
    ap.add_argument("--crf", type=int, default=24, help="qualidade do .webm (menor = melhor e mais pesado)")
    ap.add_argument("--folha", help="folha de quadros para conferir: pessoa sobre xadrez")
    a = ap.parse_args()
    if not (a.saida or a.webm or a.mascara):
        a.saida = "pessoa_png"
    try:
        lo, hi = [float(v) for v in a.niveis.split(",")]
        assert 0 <= lo < hi <= 1
    except Exception:  # noqa: BLE001
        sys.exit("erro: --niveis deve ser 'min,max' entre 0 e 1, por exemplo 0.4,0.9")

    import cv2
    import mediapipe as mp
    import numpy as np
    from mediapipe.tasks.python import BaseOptions, vision

    multi = a.modelo == "multiclasse"
    seg = vision.ImageSegmenter.create_from_options(vision.ImageSegmenterOptions(
        base_options=BaseOptions(model_asset_path=modelo("pessoa_multiclasse" if multi else "pessoa")),
        running_mode=vision.RunningMode.VIDEO, output_confidence_masks=True, output_category_mask=False))
    guiado = a.refino == "guiado"
    if guiado and not hasattr(cv2, "ximgproc"):
        aviso("este OpenCV não tem o filtro guiado (falta o opencv-contrib): usando o refino simples")
        guiado = False

    cap, fps, W, H, n = abrir_video(a.video)
    ate = n - 1 if a.ate is None else min(a.ate, n - 1)
    if a.de > ate:
        sys.exit(f"erro: --de {a.de} passa do fim do vídeo ({n} quadros)")
    if a.saida:
        os.makedirs(a.saida, exist_ok=True)
    w_webm = EscritorFFmpeg(a.webm, W, H, fps, "bgra", VP9 + ["-crf", str(a.crf)]) if a.webm else None
    w_masc = EscritorFFmpeg(a.mascara, W, H, fps, "gray", MASCARA) if a.mascara else None
    quais = set(amostras_uniformes(a.de, ate, 8)) if a.folha else set()
    yy, xx = np.indices((H, W))
    xadrez = np.dstack([(((xx // 32 + yy // 32) % 2) * 70 + 110).astype(np.uint8)] * 3)
    raio = max(4, int(round(W * 0.022)))            # guided-filter radius, ~16 px at 720 wide
    borda_rgb = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * raio + 1, 2 * raio + 1))
    amostras, legendas, area, feitos = [], [], [], 0

    def finalizar(q, frame, m):
        """Small temporal-filtered mask -> full-resolution alpha -> outputs."""
        nonlocal feitos
        if a.ilha > 0:                               # drop small loose blobs (false positives)
            nb, rot, st, _ = cv2.connectedComponentsWithStats((m > 0.5).astype(np.uint8), 8)
            minimo = a.ilha / 100.0 * m.size
            pequenas = [i for i in range(1, nb) if st[i, cv2.CC_STAT_AREA] < minimo]
            if pequenas:
                apagar = cv2.dilate(np.isin(rot, pequenas).astype(np.uint8), np.ones((9, 9), np.uint8))
                m = np.where(apagar > 0, 0.0, m).astype(np.float32)
        m = cv2.resize(m, (W, H), interpolation=cv2.INTER_LINEAR)
        if guiado:                                   # snap the soft 256-px mask to the real image edges
            m = cv2.ximgproc.guidedFilter(frame.astype(np.float32) / 255.0, m, raio, 0.02, scale=0.5)
        else:
            m = cv2.GaussianBlur(m, (0, 0), max(1.0, W / 360.0))
        m = np.clip((m - lo) / (hi - lo), 0.0, 1.0)  # levels: tighter edge, no halo
        if a.encolher > 0:
            k = int(a.encolher)
            base = cv2.erode(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * k + 1, 2 * k + 1))) if k else m
            resto = a.encolher - k
            if resto > 0:
                mais = cv2.erode(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * k + 3, 2 * k + 3)))
                base = base * (1 - resto) + mais * resto
            m = base
        if a.suavizar > 0:
            m = cv2.GaussianBlur(m, (0, 0), a.suavizar / 2.0)
        alfa = np.clip(m * 255.0 + 0.5, 0, 255).astype(np.uint8)
        area.append(float((alfa > 127).mean()))
        if a.saida or w_webm:
            # keep the real colours only near the person: small files, and no dark fringe from the codec
            perto = cv2.dilate(alfa, borda_rgb) > 0
            rgba = np.dstack([np.where(perto[..., None], frame, 0).astype(np.uint8), alfa])
            if a.saida:
                cv2.imwrite(os.path.join(a.saida, f"{q:05d}.png"), rgba)
            if w_webm:
                w_webm.escrever(rgba)
        if w_masc:
            w_masc.escrever(alfa)
        if q in quais:
            k = alfa[..., None] / 255.0
            amostras.append((frame * k + xadrez * (1 - k)).astype(np.uint8))
            legendas.append(f"q {q}  {q / fps:.2f}s")
        feitos += 1

    def misturar(ant, cur, prox):
        """Symmetric temporal filter; a neighbour only counts where the picture did not change."""
        _, _, cinza, m = cur
        if a.tempo <= 0:
            return m
        soma, peso = m.copy(), np.ones_like(m)
        for viz in (ant, prox):
            if viz is None:
                continue
            p = a.tempo * np.clip(1.0 - cv2.absdiff(cinza, viz[2]) / 24.0, 0.0, 1.0)
            soma += p * viz[3]
            peso += p
        return soma / peso

    fila = []                                        # (q, frame, small blurred gray, small mask)
    for q, frame in quadros(cap, a.de, ate):
        pequeno, _ = reduzir(frame, a.largura)
        img = mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(pequeno, cv2.COLOR_BGR2RGB))
        res = seg.segment_for_video(img, int(q * 1000 / fps))
        if multi:                                    # class 0 = background
            m = 1.0 - res.confidence_masks[0].numpy_view().astype(np.float32).squeeze()
        else:
            m = res.confidence_masks[0].numpy_view().astype(np.float32).squeeze().copy()
        cinza = cv2.blur(cv2.cvtColor(pequeno, cv2.COLOR_BGR2GRAY), (5, 5)).astype(np.float32)
        fila.append((q, frame, cinza, m))
        if len(fila) == 3:
            finalizar(fila[1][0], fila[1][1], misturar(fila[0], fila[1], fila[2]))
            fila.pop(0)
        elif len(fila) == 2:                         # first frame of the stretch
            finalizar(fila[0][0], fila[0][1], misturar(None, fila[0], fila[1]))
    if len(fila) == 2:                               # last frame
        finalizar(fila[1][0], fila[1][1], misturar(fila[0], fila[1], None))
    elif len(fila) == 1:                             # single-frame stretch
        finalizar(fila[0][0], fila[0][1], fila[0][3])
    seg.close()
    cap.release()

    print(f"{feitos} quadros (do {a.de} ao {a.de + feitos - 1}) · a pessoa ocupa em média "
          f"{100 * sum(area) / max(1, len(area)):.1f}% do quadro")
    if a.saida:
        print(f"PNG RGBA: {a.saida}/ (nome = número do quadro; no ffmpeg use -start_number {a.de})")
    if w_webm:
        w_webm.fechar()
        print(f"webm com alfa: {a.webm} (para ler o alfa no ffmpeg: -c:v libvpx-vp9 ANTES do -i)")
    if w_masc:
        w_masc.fechar()
        print(f"máscara: {a.mascara}")
    if a.folha:
        folha(amostras, a.folha, legendas=legendas)


if __name__ == "__main__":
    main()
