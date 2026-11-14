#!/usr/bin/env python3
"""Rastrear um objeto: marque a caixa dele num quadro e receba a posição em todos os quadros seguintes,
para "grudar" uma etiqueta, uma seta ou um destaque nele (OpenCV, local).

Uso:
  1) achar a caixa:  python rastrear.py VIDEO --de 400 --grade grade.jpg [--zoom x,y,l,a]
     (salva o quadro com régua em pixels; olhe a imagem e anote x,y,largura,altura do objeto)
  2) rastrear:       python rastrear.py VIDEO --caixa x,y,l,a --de 400 [--ate 700] -o rastreio.json
                       [--folha rastreio.jpg] [--previa rastreio.mp4] [--nome inseto]

Saída (pixels do vídeo original):
  {"video","fps","largura","altura","metodo","caixa_inicial":{"q","x","y","w","h"},
   "quadros":[{"q","t","x","y","w","h","cx","cy","conf","perdido"}], "perdas":[{"de","ate"}], "resumo":{...}}
  x,y,w,h = caixa bruta · cx,cy = centro suavizado (use este para prender a etiqueta)
  conf = parecido com o objeto marcado (0 a 1) · perdido = true quando o objeto sumiu (a caixa fica na última posição)

Métodos (--metodo): auto = CSRT se este OpenCV tiver, senão fluxo · csrt · kcf · fluxo (Lucas-Kanade, sem contrib)
· modelo (casamento de modelo, bom para objeto pequeno e rígido).
Depois de perder o objeto, o script procura no quadro inteiro e retoma sozinho (desligue com --sem-retomar).
"""
import argparse
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _comum import (H264, EscritorFFmpeg, abrir_video, amostras_uniformes, aviso, folha, ler_quadro,  # noqa: E402
                    quadros, rotulo, salvar_json)


def _caixa(texto):
    try:
        v = [float(p) for p in texto.replace(";", ",").split(",")]
        assert len(v) == 4 and v[2] > 1 and v[3] > 1
        return v
    except Exception:  # noqa: BLE001
        raise argparse.ArgumentTypeError("use x,y,largura,altura em pixels, por exemplo 604,180,40,48")


def desenhar_grade(frame, q, passo, zoom, caminho):
    """Frame with a pixel ruler, so the box can be read off the picture."""
    import cv2
    img = frame.copy()
    x0 = y0 = 0
    f = 1.0
    if zoom:
        x0, y0, zw, zh = [int(v) for v in zoom]
        img = img[y0:y0 + zh, x0:x0 + zw]
        f = max(1.0, min(8.0, 1400.0 / max(img.shape[:2])))
        img = cv2.resize(img, None, fx=f, fy=f, interpolation=cv2.INTER_CUBIC)
    H, W = img.shape[:2]
    if not passo:
        alvo = max(frame.shape[1] if not zoom else zoom[2], 1) / 8.0
        passo = min([5, 10, 20, 25, 50, 100, 200, 250, 500], key=lambda p: abs(p - alvo))
    esc = max(0.4, W / 1800.0)
    primeiro_x = (x0 // passo + (1 if x0 % passo else 0)) * passo
    primeiro_y = (y0 // passo + (1 if y0 % passo else 0)) * passo
    for gx in range(primeiro_x, x0 + int(W / f) + 1, passo):
        px = int(round((gx - x0) * f))
        cv2.line(img, (px, 0), (px, H - 1), (0, 0, 0), 3)
        cv2.line(img, (px, 0), (px, H - 1), (0, 255, 255), 1)
        rotulo(img, str(gx), px + 3, 3, cor=(0, 255, 255), escala=esc)
    for gy in range(primeiro_y, y0 + int(H / f) + 1, passo):
        py = int(round((gy - y0) * f))
        cv2.line(img, (0, py), (W - 1, py), (0, 0, 0), 3)
        cv2.line(img, (0, py), (W - 1, py), (0, 255, 255), 1)
        rotulo(img, str(gy), 3, py + 3, cor=(0, 255, 255), escala=esc)
    rotulo(img, f"quadro {q}  regua de {passo} em {passo} px", W // 3, H - 40, escala=esc)
    cv2.imwrite(caminho, img, [cv2.IMWRITE_JPEG_QUALITY, 92])
    print(f"quadro {q} com régua: {caminho} (linhas a cada {passo} px; números = pixels do vídeo original)")


# ---------------------------------------------------------------- tracker back-ends (analysis-scale boxes)

class _OpenCV:
    """CSRT / KCF from OpenCV (contrib build)."""

    def __init__(self, nome):
        import cv2
        self.nome = nome
        self.fabrica = None
        for dono in (cv2, getattr(cv2, "legacy", None)):
            f = getattr(dono, f"Tracker{nome.upper()}_create", None) if dono is not None else None
            if f is not None:
                self.fabrica = f
                break
        self.t = None

    def existe(self):
        return self.fabrica is not None

    def iniciar(self, bgr, cinza, caixa):
        self.t = self.fabrica()
        self.t.init(bgr, tuple(int(round(v)) for v in caixa))

    def atualizar(self, bgr, cinza):
        ok, c = self.t.update(bgr)
        return bool(ok), [float(v) for v in c]


class _Fluxo:
    """Median-flow tracker: pyramidal Lucas-Kanade on a grid of points, forward-backward check.
    Needs only the core OpenCV (no contrib)."""
    nome = "fluxo"

    def existe(self):
        return True

    def iniciar(self, bgr, cinza, caixa):
        self.ant = cinza
        self.caixa = [float(v) for v in caixa]

    def atualizar(self, bgr, cinza):
        import cv2
        import numpy as np
        x, y, w, h = self.caixa
        gx, gy = np.meshgrid(np.linspace(x + 0.1 * w, x + 0.9 * w, 10), np.linspace(y + 0.1 * h, y + 0.9 * h, 10))
        p0 = np.float32(np.c_[gx.ravel(), gy.ravel()]).reshape(-1, 1, 2)
        lk = dict(winSize=(15, 15), maxLevel=3, criteria=(cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 20, 0.03))
        p1, s1, _ = cv2.calcOpticalFlowPyrLK(self.ant, cinza, p0, None, **lk)
        p0v, s2, _ = cv2.calcOpticalFlowPyrLK(cinza, self.ant, p1, None, **lk)
        self.ant = cinza
        erro = np.linalg.norm((p0 - p0v).reshape(-1, 2), axis=1)
        ok = (s1.ravel() == 1) & (s2.ravel() == 1) & np.isfinite(erro)
        if ok.sum() < 8:
            return False, self.caixa
        bons = ok & (erro <= max(0.5, float(np.median(erro[ok]))))
        a, b = p0.reshape(-1, 2)[bons], p1.reshape(-1, 2)[bons]
        dx, dy = np.median(b - a, axis=0)
        escala = 1.0
        if len(a) >= 6:                              # scale = median ratio of point-to-point distances
            i, j = np.triu_indices(len(a), 1)
            da, db = np.linalg.norm(a[i] - a[j], axis=1), np.linalg.norm(b[i] - b[j], axis=1)
            v = da > 2
            if v.sum() >= 6:
                escala = float(np.clip(np.median(db[v] / da[v]), 0.9, 1.1))
        cx, cy = x + w / 2 + dx, y + h / 2 + dy
        w, h = w * escala, h * escala
        self.caixa = [cx - w / 2, cy - h / 2, w, h]
        return bool(np.median(erro[bons]) < 2.0), self.caixa


class _Modelo:
    """Template matching in a window around the last position (fixed size). Good for small rigid objects."""
    nome = "modelo"

    def existe(self):
        return True

    def iniciar(self, bgr, cinza, caixa):
        self.caixa = [float(v) for v in caixa]
        self.t0 = _recorte(cinza, self.caixa)
        self.t = self.t0.copy()

    def atualizar(self, bgr, cinza):
        import cv2
        import numpy as np
        x, y, w, h = self.caixa
        m = 1.5 * max(w, h)
        H, W = cinza.shape[:2]
        jx0, jy0 = int(max(0, x - m)), int(max(0, y - m))
        jx1, jy1 = int(min(W, x + w + m)), int(min(H, y + h + m))
        janela = cinza[jy0:jy1, jx0:jx1]
        melhor, pos, qual = -1.0, None, None
        for t in (self.t, self.t0):
            if janela.shape[0] < t.shape[0] or janela.shape[1] < t.shape[1]:
                continue
            r = np.nan_to_num(cv2.matchTemplate(janela, t, cv2.TM_CCOEFF_NORMED), nan=0.0, posinf=0.0, neginf=0.0)
            _, v, _, p = cv2.minMaxLoc(r)
            if v > melhor:
                melhor, pos, qual = v, p, t
        if pos is None:
            return False, self.caixa
        self.caixa = [float(jx0 + pos[0]), float(jy0 + pos[1]), float(qual.shape[1]), float(qual.shape[0])]
        if melhor > 0.8:                             # slow template update (limits drift)
            novo = _recorte(cinza, self.caixa)
            if novo.shape == self.t.shape:
                self.t = cv2.addWeighted(self.t, 0.9, novo, 0.1, 0)
        return melhor > 0.4, self.caixa


def _recorte(cinza, caixa):
    x, y, w, h = [int(round(v)) for v in caixa]
    H, W = cinza.shape[:2]
    x, y = max(0, min(x, W - 2)), max(0, min(y, H - 2))
    return cinza[y:min(H, y + max(2, h)), x:min(W, x + max(2, w))].copy()


class Aparencia:
    """Remembers what the object looks like: gives every frame a 0-1 score and finds the object again
    in the whole frame after a loss."""

    def __init__(self, cinza, caixa):
        import cv2
        t = _recorte(cinza, caixa)
        self.k = min(1.0, 96.0 / max(t.shape))       # templates are kept at <= 96 px
        if self.k < 1.0:
            t = cv2.resize(t, None, fx=self.k, fy=self.k, interpolation=cv2.INTER_AREA)
        self.inicial, self.recente = t, t.copy()
        self.contraste = float(t.std()) + 1e-6

    def _casar(self, img):
        import cv2
        import numpy as np
        melhor, pos = -1.0, (0, 0)
        for t in (self.inicial, self.recente):
            if img.shape[0] < t.shape[0] or img.shape[1] < t.shape[1]:
                continue
            r = np.nan_to_num(cv2.matchTemplate(img, t, cv2.TM_CCOEFF_NORMED), nan=0.0, posinf=0.0, neginf=0.0)
            _, v, _, p = cv2.minMaxLoc(r)
            if v > melhor:
                melhor, pos = float(v), p
        return max(0.0, min(1.0, melhor)), pos

    def nota(self, cinza, caixa):
        """How much the box content still looks like the object (tolerates a shift of 30% of the box)."""
        import cv2
        x, y, w, h = caixa
        H, W = cinza.shape[:2]
        if w < 2 or h < 2:
            return 0.0
        th, tw = self.inicial.shape[:2]
        mx, my = 0.3 * w, 0.3 * h
        x0, y0, x1, y1 = int(round(x - mx)), int(round(y - my)), int(round(x + w + mx)), int(round(y + h + my))
        px0, py0, px1, py1 = max(0, -x0), max(0, -y0), max(0, x1 - W), max(0, y1 - H)
        jan = cinza[max(0, y0):min(H, y1), max(0, x0):min(W, x1)]
        if jan.size == 0:
            return 0.0
        if px0 or py0 or px1 or py1:
            jan = cv2.copyMakeBorder(jan, py0, py1, px0, px1, cv2.BORDER_REPLICATE)
        jan = cv2.resize(jan, (max(tw + 2, int(round(tw * 1.6))), max(th + 2, int(round(th * 1.6)))),
                         interpolation=cv2.INTER_AREA)
        if float(jan.std()) < 0.25 * self.contraste:  # flat patch (plain wall, sky): the object is not there
            return 0.0
        return self._casar(jan)[0]

    def lembrar(self, cinza, caixa):
        import cv2
        t = _recorte(cinza, caixa)
        if min(t.shape) >= 2:
            self.recente = cv2.resize(t, (self.inicial.shape[1], self.inicial.shape[0]), interpolation=cv2.INTER_AREA)

    def procurar(self, cinza, tamanho):
        """Search the whole frame at 3 sizes. Returns (score, box) in analysis pixels."""
        import cv2
        w, h = tamanho
        melhor, caixa = 0.0, None
        for e in (1.0, 0.8, 1.25):
            f = self.k / e                           # frame scale at which the object matches the template
            img = cv2.resize(cinza, None, fx=f, fy=f, interpolation=cv2.INTER_AREA) if abs(f - 1) > 1e-3 else cinza
            v, p = self._casar(img)
            if v > melhor:
                melhor, caixa = v, [p[0] / f, p[1] / f, w * e, h * e]
        return melhor, caixa


def suavizar_centros(reg, janela):
    """Gaussian smoothing of the centre inside each stretch where the object is visible."""
    import numpy as np
    for r in reg:
        r["cx"], r["cy"] = round(r["x"] + r["w"] / 2.0, 1), round(r["y"] + r["h"] / 2.0, 1)
    if janela < 2:
        return
    sigma = janela / 2.5
    raio = int(max(1, round(janela)))
    pesos = np.exp(-0.5 * (np.arange(-raio, raio + 1) / sigma) ** 2)
    i = 0
    while i < len(reg):
        if reg[i]["perdido"]:
            i += 1
            continue
        j = i
        while j + 1 < len(reg) and not reg[j + 1]["perdido"]:
            j += 1
        for eixo in ("cx", "cy"):
            v = np.array([reg[k][eixo] for k in range(i, j + 1)], dtype=np.float64)
            vp = np.pad(v, raio, mode="edge")
            s = np.convolve(vp, pesos / pesos.sum(), mode="valid")
            for k in range(i, j + 1):
                reg[k][eixo] = round(float(s[k - i]), 1)
        i = j + 1


def desenhar(frame, r, nome, zoom_canto=True):
    """Box + label (+ magnified corner view, because tracked objects are often tiny)."""
    import cv2
    vis = frame.copy()
    H, W = vis.shape[:2]
    cor = (0, 0, 255) if r["perdido"] else (80, 220, 60)
    x, y, w, h = int(r["x"]), int(r["y"]), int(r["w"]), int(r["h"])
    esp = max(2, W // 360)
    cv2.rectangle(vis, (x, y), (x + w, y + h), cor, esp)
    if not r["perdido"]:
        cv2.circle(vis, (int(round(r["cx"])), int(round(r["cy"]))), max(3, esp + 1), (0, 255, 255), -1)
    texto = "PERDIDO" if r["perdido"] else f"{nome} {r['conf']:.2f}"
    rotulo(vis, texto, x, y + h + 6 if y + h + 40 < H else y - 34, cor=(255, 255, 255), fundo=cor)
    if zoom_canto and not r["perdido"]:
        m = int(max(w, h) * 1.5)
        cx, cy = x + w // 2, y + h // 2
        rec = frame[max(0, cy - m):min(H, cy + m), max(0, cx - m):min(W, cx + m)]
        if rec.size:
            lado = W // 3
            rec = cv2.resize(rec, (lado, int(rec.shape[0] * lado / rec.shape[1])), interpolation=cv2.INTER_CUBIC)
            rec = rec[:min(rec.shape[0], H // 3)]
            px = 0 if cx > W // 2 else W - rec.shape[1]   # corner away from the object
            py = H - rec.shape[0]
            vis[py:py + rec.shape[0], px:px + rec.shape[1]] = rec
            cv2.rectangle(vis, (px, py), (px + rec.shape[1] - 1, py + rec.shape[0] - 1), cor, 2)
    return vis


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("video")
    ap.add_argument("--caixa", type=_caixa, help="caixa inicial x,y,largura,altura (pixels do vídeo original)")
    ap.add_argument("--de", type=int, default=0, help="quadro em que a caixa foi marcada; o rastreio começa nele")
    ap.add_argument("--ate", type=int, help="último quadro (padrão: fim do vídeo)")
    ap.add_argument("-o", "--saida", default="rastreio.json")
    ap.add_argument("--metodo", choices=["auto", "csrt", "kcf", "fluxo", "modelo"], default="auto")
    ap.add_argument("--largura", type=int, default=1280, help="largura máxima de análise (objeto pequeno pede mais)")
    ap.add_argument("--limite", type=float, default=0.35, help="conf abaixo disso = objeto em dúvida")
    ap.add_argument("--paciencia", type=int, default=6, help="quadros seguidos em dúvida até declarar perdido")
    ap.add_argument("--retomar", type=float, default=0.7, help="conf mínima para reencontrar o objeto no quadro inteiro")
    ap.add_argument("--sem-retomar", action="store_true", help="não procurar o objeto de novo depois de perder")
    ap.add_argument("--suavizar", type=int, default=5, help="janela (quadros) da suavização do centro cx,cy (0 = bruto)")
    ap.add_argument("--nome", default="objeto", help="nome que aparece na folha e na prévia")
    ap.add_argument("--folha", help="folha de quadros com a caixa desenhada")
    ap.add_argument("--previa", help="vídeo .mp4 de prévia com a caixa desenhada")
    ap.add_argument("--grade", help="só salvar o quadro --de com régua em pixels (para achar a caixa) e sair")
    ap.add_argument("--passo-grade", type=int, default=0, help="distância entre as linhas da régua (padrão: automática)")
    ap.add_argument("--zoom", type=_caixa, help="com --grade: ampliar só a região x,y,largura,altura")
    a = ap.parse_args()

    import cv2
    import numpy as np

    if a.grade:
        frame, q, _ = ler_quadro(a.video, a.de)
        desenhar_grade(frame, q, a.passo_grade, a.zoom, a.grade)
        return
    if not a.caixa:
        ap.error("informe --caixa x,y,largura,altura (use --grade para ver o quadro com régua)")

    ordem = {"auto": ["csrt", "fluxo"], "csrt": ["csrt"], "kcf": ["kcf"], "fluxo": ["fluxo"], "modelo": ["modelo"]}[a.metodo]
    motor = None
    for nome in ordem:
        cand = _Fluxo() if nome == "fluxo" else _Modelo() if nome == "modelo" else _OpenCV(nome)
        if cand.existe():
            motor = cand
            break
        aviso(f"este OpenCV não tem o rastreador {nome.upper()} (precisa do opencv-contrib)")
    if motor is None:
        sys.exit("erro: método indisponível neste OpenCV; use --metodo fluxo ou --metodo modelo")

    cap, fps, W, H, n = abrir_video(a.video)
    ate = n - 1 if a.ate is None else min(a.ate, n - 1)
    if a.de > ate:
        sys.exit(f"erro: --de {a.de} passa do fim do vídeo ({n} quadros)")
    x, y, w, h = a.caixa
    if x < 0 or y < 0 or x + w > W or y + h > H:
        sys.exit(f"erro: a caixa {a.caixa} sai do quadro ({W}x{H})")
    s = min(1.0, a.largura / W) if a.largura else 1.0   # analysis scale
    if min(w, h) * s < 16:                               # keep small objects big enough to track
        s = min(1.0, 16.0 / min(w, h))
    if min(w, h) < 12:
        aviso("a caixa é muito pequena (menos de 12 px): o rastreio pode falhar; marque uma caixa com folga")

    def preparar(frame):
        p = frame if s == 1.0 else cv2.resize(frame, (int(round(W * s)), int(round(H * s))), interpolation=cv2.INTER_AREA)
        return p, cv2.cvtColor(p, cv2.COLOR_BGR2GRAY)

    def fora(c):                                         # more than half of the box outside the frame
        cx, cy = c[0] + c[2] / 2, c[1] + c[3] / 2
        return not (0 <= cx < W * s and 0 <= cy < H * s) or c[2] < 4 or c[3] < 4

    quais = set(amostras_uniformes(a.de, ate, 12)) if a.folha else set()
    guardados = {}
    w_prev = EscritorFFmpeg(a.previa, W, H, fps, "bgr24", H264) if a.previa else None
    pend = []                                            # frames waiting for the final verdict (preview/sheet)
    reg, t0 = [], time.time()
    cx_an = [v * s for v in a.caixa]
    estado, duvida, cand_ant, ap_mem = "ok", 0, None, None
    ultimo_bom = list(cx_an)

    for q, frame in quadros(cap, a.de, ate):
        p, cinza = preparar(frame)
        if q == a.de:
            motor.iniciar(p, cinza, cx_an)
            ap_mem = Aparencia(cinza, cx_an)
            caixa, conf = list(cx_an), 1.0
        elif estado == "ok":
            ok, caixa = motor.atualizar(p, cinza)
            conf = ap_mem.nota(cinza, caixa) if ok and not fora(caixa) else 0.0
            if conf >= a.limite:
                duvida = 0
                ultimo_bom = list(caixa)
                if conf >= 0.75 and (q - a.de) % 5 == 0:
                    ap_mem.lembrar(cinza, caixa)
            else:
                duvida += 1
                if duvida >= a.paciencia or fora(caixa):
                    estado, cand_ant = "perdido", None
                    for r in reg[len(reg) - (duvida - 1):] if duvida > 1 else []:   # the doubtful run was a loss
                        r["perdido"] = True
                        r["x"], r["y"], r["w"], r["h"] = [int(round(v / s)) for v in ultimo_bom]
        if estado == "perdido":
            caixa, conf = list(ultimo_bom), 0.0
            if not a.sem_retomar:
                v, c = ap_mem.procurar(cinza, (ultimo_bom[2], ultimo_bom[3]))
                if c is not None and v >= a.retomar:
                    perto = cand_ant is not None and abs(c[0] - cand_ant[0]) < 2 * c[2] and abs(c[1] - cand_ant[1]) < 2 * c[3]
                    if perto:                            # same place in two frames in a row: it is back
                        motor.iniciar(p, cinza, c)
                        estado, duvida, caixa, conf, ultimo_bom = "ok", 0, list(c), v, list(c)
                    cand_ant = c
                else:
                    cand_ant = None
        reg.append({"q": q, "t": round(q / fps, 3),
                    "x": int(round(caixa[0] / s)), "y": int(round(caixa[1] / s)),
                    "w": int(round(caixa[2] / s)), "h": int(round(caixa[3] / s)),
                    "cx": 0.0, "cy": 0.0, "conf": round(float(conf), 3), "perdido": estado == "perdido"})
        if w_prev or q in quais:
            pend.append((q, frame if w_prev else frame.copy()))
            if not w_prev:
                guardados[q] = len(reg) - 1
        # the preview is written with a delay so retroactive "perdido" flags and smoothing are already final
        if w_prev and len(pend) > 4 * max(a.paciencia, a.suavizar, 1) + 4:
            pass
    cap.release()
    dt = time.time() - t0

    suavizar_centros(reg, a.suavizar)
    perdas, i = [], 0
    while i < len(reg):
        if reg[i]["perdido"]:
            j = i
            while j + 1 < len(reg) and reg[j + 1]["perdido"]:
                j += 1
            perdas.append({"de": reg[i]["q"], "ate": reg[j]["q"], "inicio": reg[i]["t"], "fim": reg[j]["t"]})
            i = j + 1
        else:
            i += 1
    achados = sum(1 for r in reg if not r["perdido"])
    resumo = {"quadros": len(reg), "achado_em": achados, "perdido_em": len(reg) - achados,
              "pct_achado": round(100.0 * achados / max(1, len(reg)), 1),
              "conf_media": round(float(np.mean([r["conf"] for r in reg if not r["perdido"]] or [0])), 3),
              "segundos": round(dt, 2)}
    salvar_json({"video": os.path.basename(a.video), "fps": fps, "largura": W, "altura": H, "metodo": motor.nome,
                 "nome": a.nome, "caixa_inicial": {"q": a.de, "x": x, "y": y, "w": w, "h": h},
                 "quadros": reg, "perdas": perdas, "resumo": resumo}, a.saida)
    print(f"método {motor.nome} · {len(reg)} quadros ({a.de} a {reg[-1]['q']}) em {dt:.1f} s · "
          f"objeto achado em {achados} ({resumo['pct_achado']}%) · conf média {resumo['conf_media']}")
    for pd in perdas:
        print(f"  perdido do quadro {pd['de']} ao {pd['ate']} ({pd['inicio']:.2f}s a {pd['fim']:.2f}s)")
    if not perdas:
        print("  o objeto não foi perdido em nenhum quadro")

    if a.folha or a.previa:                               # second pass: draw with the final data
        por_q = {r["q"]: r for r in reg}
        extras = {pd["de"] for pd in perdas[:4]} | {pd["ate"] + 1 for pd in perdas[:4] if pd["ate"] + 1 in por_q}
        quais |= extras if a.folha else set()
        cap, *_ = abrir_video(a.video)
        tiles, legs = [], []
        for q, frame in quadros(cap, a.de, reg[-1]["q"]):
            r = por_q[q]
            if w_prev:
                w_prev.escrever(desenhar(frame, r, a.nome))
            if q in quais:
                tiles.append(desenhar(frame, r, a.nome))
                legs.append(f"q {q}  {r['t']:.2f}s" + ("  PERDIDO" if r["perdido"] else ""))
        cap.release()
        if w_prev:
            w_prev.fechar()
            print(f"prévia: {a.previa}")
        if a.folha:
            folha(tiles, a.folha, colunas=6 if W < H else 4, largura=320 if W < H else 480, legendas=legs)


if __name__ == "__main__":
    main()
