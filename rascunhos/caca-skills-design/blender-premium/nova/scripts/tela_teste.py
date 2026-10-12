# Skill blender-ia (claude-skills). Codigo proprio (pesquisa B, 11/10/2026), adaptado para o premium.py.
# Gera uma tela de app GENERICA para testes (modo escuro, sem texto: barras no lugar das palavras).
# Sai so a AREA ATIVA (68 x 145,4 mm -> 1080 x 2309 px): a borda preta, os cantos e o furo da camera
# vem do shader do premium.py. No video real, use a UI renderizada pelo Remotion nesse mesmo tamanho.
# Uso: python3 tela_teste.py saida.png      (precisa do Pillow)
import sys
from PIL import Image, ImageDraw, ImageFilter
out = sys.argv[1]
GW, GH = 70.6, 148.0                 # mm do vidro
PX = 16                              # px por mm (final 1130 x 2368)
S = 2                                # supersampling
w, h = int(GW*PX), int(GH*PX)
W, H = w*S, h*S
mm = lambda v: int(round(v*PX*S))
img = Image.new('RGB', (W, H), (0, 0, 0))
# area ativa da tela: bezel 1,3 mm, canto 9,2 mm
bz, rc = 1.3, 9.2
x0, y0, x1, y1 = mm(bz), mm(bz), W-mm(bz), H-mm(bz)
# fundo: degrade vertical azul-noite -> quase preto, com um brilho suave no topo
bg = Image.new('RGB', (W, H))
d = ImageDraw.Draw(bg)
for y in range(H):
    t = y/H
    c = (int(18+20*(1-t)**2), int(20+26*(1-t)**2), int(34+48*(1-t)**2))
    d.line([(0, y), (W, y)], fill=c)
glow = Image.new('L', (W, H), 0); ImageDraw.Draw(glow).ellipse([W*0.1, -H*0.12, W*0.9, H*0.22], fill=90)
glow = glow.filter(ImageFilter.GaussianBlur(mm(10)))
bg = Image.composite(Image.new('RGB', (W, H), (90, 120, 255)), bg, glow)
d = ImageDraw.Draw(bg)
def rr(box, r, fill): d.rounded_rectangle([mm(box[0]), mm(box[1]), mm(box[2]), mm(box[3])], radius=mm(r), fill=fill)
# barra de status (hora e icones como formas)
rr((6, 3.6, 13, 5.4), 0.9, (235, 238, 245)); rr((52, 3.8, 58, 5.2), 0.7, (235, 238, 245)); rr((59.5, 3.6, 64.5, 5.4), 0.9, (235, 238, 245))
# titulo + subtitulo (barras)
rr((6, 14, 40, 18.5), 2.2, (245, 246, 250)); rr((6, 21, 30, 23), 1, (120, 130, 160))
# anel de progresso
cx, cy, R = 35.3, 46, 15
d.ellipse([mm(cx-R), mm(cy-R), mm(cx+R), mm(cy+R)], outline=(45, 52, 80), width=mm(3.2))
d.arc([mm(cx-R), mm(cy-R), mm(cx+R), mm(cy+R)], start=-90, end=170, fill=(64, 210, 160), width=mm(3.2))
rr((cx-7, cy-2.2, cx+7, cy+2.2), 2, (245, 246, 250))
# cartoes de habitos
cores = [(255, 120, 90), (110, 160, 255), (64, 210, 160), (255, 200, 80), (190, 120, 255)]
for i, c in enumerate(cores):
    y = 70 + i*13.5
    rr((5, y, 65.6, y+11.2), 3.2, (30, 34, 52))
    d.ellipse([mm(8), mm(y+2.6), mm(14), mm(y+8.6)], fill=c)
    rr((17, y+3, 44, y+5), 1, (225, 228, 238)); rr((17, y+6.6, 34, y+8.2), 0.8, (110, 118, 145))
    done = i < 3
    if done:
        d.ellipse([mm(55.5), mm(y+2.8), mm(61.5), mm(y+8.8)], fill=c)
        d.line([(mm(57), mm(y+5.9)), (mm(58.2), mm(y+7.1)), (mm(60.2), mm(y+4.6))], fill=(20, 22, 30), width=mm(0.7))
    else:
        d.ellipse([mm(55.5), mm(y+2.8), mm(61.5), mm(y+8.8)], outline=(80, 88, 115), width=mm(0.5))
# barra de abas + indicador home
rr((5, 136, 65.6, 143.3), 3.6, (26, 30, 46))
for k, x in enumerate((13, 26.5, 44, 57.5)): d.ellipse([mm(x-1.6), mm(137.9), mm(x+1.6), mm(141.1)], fill=(64, 210, 160) if k == 0 else (110, 118, 145))
rr((25, 144.8, 45.6, 145.6), 0.4, (220, 222, 230))
# recorta a area ativa (sem a borda de 1,3 mm) e reduz para 1080 px de largura
img = bg.crop((x0, y0, x1, y1))
img = img.resize((1080, 2309), Image.LANCZOS)   # 68 x 145,4 mm -> 1080 x 2309 (o premium.py espera esta proporcao)
img.save(out); print(out, img.size)
