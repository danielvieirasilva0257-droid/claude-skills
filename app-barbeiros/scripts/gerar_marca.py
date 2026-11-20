"""App Barbeiros brand: a barber pole in lime whose stripes rise to the right
(the result going up), the app icon, the horizontal logo and an alternative
(the winged banknote mascot).
Writes SVGs to assets/marca/. Colours from src/theme/tokens.ts.
Run: python3 scripts/gerar_marca.py   (then node scripts/renderizar-marca.mjs)
"""
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

RAIZ = Path(__file__).resolve().parent.parent
SAIDA = RAIZ / "assets" / "marca"
FONTE = RAIZ / "node_modules/@expo-google-fonts/inter/800ExtraBold/Inter_800ExtraBold.ttf"

BG = "#050506"      # color.bg
LIMA = "#C5F23A"    # color.brand
TEXTO = "#F4F4F0"   # color.text
ESCURO = "#0B0F02"  # color.onBrand

# ---- Mark: a barber pole drawn in lime, its stripes rising to the right
# (the result going up). On a 1024 grid; the stripes are cut-outs, so the
# background shows through them.
CORPO = (382, 282, 260, 496)   # x, y, width, height of the striped body
TAMPA = (352, 320, 52)         # caps: x, width, height (top above the body, bottom below)
FOLGA = 12                     # dark gap between the body and the caps
PINO = (512, 178, 34)          # knob on top: cx, cy, r
FAIXA = 70                     # stripe thickness
SUBIDA = 180                   # how much a stripe rises across the body
FAIXAS_Y = [216, 386, 556, 726, 896]  # left-edge y of each stripe


def barras(cor: str, uid: str = "p") -> str:
    x, y, w, h = CORPO
    tx, tw, th = TAMPA
    faixas = "".join(
        f'<path d="M{x - 20} {fy} L{x + w + 20} {fy - SUBIDA * (w + 40) / w} '
        f'L{x + w + 20} {fy - SUBIDA * (w + 40) / w + FAIXA} L{x - 20} {fy + FAIXA} Z" fill="#000"/>'
        for fy in FAIXAS_Y)
    cx, cy, r = PINO
    topo_y = y - FOLGA - th
    base_y = y + h + FOLGA
    return (f'<defs><mask id="faixas-{uid}"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" fill="#fff"/>{faixas}</mask></defs>'
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" fill="{cor}" mask="url(#faixas-{uid})"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{cor}"/>'
            f'<rect x="{tx}" y="{topo_y}" width="{tw}" height="{th}" rx="{th / 2}" fill="{cor}"/>'
            f'<rect x="{tx}" y="{base_y}" width="{tw}" height="{th}" rx="{th / 2}" fill="{cor}"/>')


def svg(conteudo: str, largura: int, altura: int, viewbox: str | None = None) -> str:
    vb = viewbox or f"0 0 {largura} {altura}"
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{largura}" height="{altura}" viewBox="{vb}">'
            f"{conteudo}</svg>\n")


def texto_em_curvas(texto: str, tamanho: float, x: float, y_base: float, cor: str, espacamento: float = -0.02) -> tuple[str, float]:
    """Text as outlined paths (no font needed to open the SVG). Returns (svg, width)."""
    fonte = TTFont(FONTE)
    glifos = fonte.getGlyphSet()
    cmap = fonte.getBestCmap()
    upm = fonte["head"].unitsPerEm
    escala = tamanho / upm
    cursor = 0.0
    caminhos = []
    for ch in texto:
        nome = cmap[ord(ch)]
        caneta = SVGPathPen(glifos)
        glifos[nome].draw(TransformPen(caneta, (escala, 0, 0, -escala, x + cursor, y_base)))
        caminhos.append(caneta.getCommands())
        cursor += glifos[nome].width * escala + espacamento * tamanho
    largura = cursor - espacamento * tamanho
    return f'<path d="{" ".join(caminhos)}" fill="{cor}"/>', largura


def nota_com_asas() -> str:
    """Alternative B: the mascot as a mark (banknote with little wings)."""
    asa = (f'<path d="M232 470 C150 430 96 470 92 540 C150 520 196 540 232 590 Z" fill="{TEXTO}"/>'
           f'<path d="M792 470 C874 430 928 470 932 540 C874 520 828 540 792 590 Z" fill="{TEXTO}"/>')
    nota = (f'<rect x="232" y="352" width="560" height="320" rx="56" fill="{LIMA}"/>'
            f'<rect x="276" y="396" width="472" height="232" rx="28" fill="none" stroke="{ESCURO}" '
            f'stroke-width="10" stroke-dasharray="22 16" opacity="0.55"/>')
    rs, largura = texto_em_curvas("R$", 168, 0, 0, ESCURO, 0)
    rs = f'<g transform="translate({512 - largura / 2} {578})">{rs}</g>'
    return asa + nota + rs


def main() -> None:
    SAIDA.mkdir(parents=True, exist_ok=True)
    fundo = f'<rect width="1024" height="1024" fill="{BG}"/>'
    # Mark only (transparent), trimmed viewBox.
    (SAIDA / "marca.svg").write_text(svg(barras(LIMA), 340, 730, "342 134 340 730"))
    (SAIDA / "marca-branca.svg").write_text(svg(barras("#FFFFFF", "b"), 340, 730, "342 134 340 730"))
    # App icon: full bleed (the system rounds the corners).
    (SAIDA / "icone.svg").write_text(svg(fundo + f'<g transform="translate(0 13)">{barras(LIMA, "i")}</g>', 1024, 1024))
    # Android adaptive icon: foreground inside the 66 dp safe circle (≈ 61% of the canvas).
    menor = f'<g transform="translate(512 512) scale(0.62) translate(-512 -499)">{barras(LIMA)}</g>'
    (SAIDA / "android-frente.svg").write_text(svg(menor, 1024, 1024))
    mono = f'<g transform="translate(512 512) scale(0.62) translate(-512 -499)">{barras("#FFFFFF", "m")}</g>'
    (SAIDA / "android-mono.svg").write_text(svg(mono, 1024, 1024))
    # Splash: mark centred, transparent (background colour comes from app.json).
    (SAIDA / "splash.svg").write_text(svg(f'<g transform="translate(512 512) scale(0.5) translate(-512 -499)">{barras(LIMA, "s")}</g>', 1024, 1024))
    # Horizontal logo on dark: mark + wordmark (provisional name).
    palavra, largura = texto_em_curvas("barbeiros", 300, 0, 0, TEXTO)
    esc = 0.5
    marca = f'<g transform="scale({esc}) translate(-342 -134)">{barras(LIMA, "h")}</g>'
    altura_marca = 730 * esc
    largura_marca = 340 * esc
    texto_g = f'<g transform="translate({largura_marca + 44} {altura_marca - 104})">{palavra}</g>'
    total = largura_marca + 40 + largura
    (SAIDA / "logo-horizontal.svg").write_text(svg(marca + texto_g, round(total), round(altura_marca), f"0 0 {round(total)} {round(altura_marca)}"))
    (SAIDA / "logo-horizontal-fundo.svg").write_text(svg(
        f'<rect x="-80" y="-80" width="{round(total) + 160}" height="{round(altura_marca) + 160}" fill="{BG}"/>' + marca + texto_g,
        round(total) + 160, round(altura_marca) + 160, f"-80 -80 {round(total) + 160} {round(altura_marca) + 160}"))
    # Alternative B.
    (SAIDA / "alternativa-nota.svg").write_text(svg(fundo + nota_com_asas(), 1024, 1024))
    print("ok", sorted(p.name for p in SAIDA.glob("*.svg")))


if __name__ == "__main__":
    main()
