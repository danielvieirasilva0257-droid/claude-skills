# Build offline assets: page + Archivo fonts (Google Fonts CSS rewritten to local files) + launcher icons.
import sys, re, os, io, urllib.request
from PIL import Image, ImageDraw, ImageFont
src, out, res = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(out, exist_ok=True)
h = open(src).read()
css_url = re.search(r'<link href="(https://fonts\.googleapis\.com/[^"]+)" rel="stylesheet">', h).group(1).replace('&amp;', '&')
ua = {'User-Agent': 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/124 Mobile Safari/537.36'}
css = urllib.request.urlopen(urllib.request.Request(css_url, headers=ua)).read().decode()
keep = []
for block in re.findall(r'/\* ([^*]+) \*/\s*(@font-face \{[^}]+\})', css):
    subset, face = block
    if subset.strip() not in ('latin', 'latin-ext'): continue
    url = re.search(r'url\((https://[^)]+)\)', face).group(1)
    name = 'archivo-' + subset.strip() + '.woff2'
    open(os.path.join(out, name), 'wb').write(urllib.request.urlopen(url).read())
    keep.append(face.replace(url, name))
font_css = '<style>\n' + '\n'.join(keep) + '\n</style>'
h = h.replace(re.search(r'<link href="https://fonts\.googleapis\.com/[^"]+" rel="stylesheet">', h).group(0), font_css)
h = h.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', '')
open(os.path.join(out, 'index.html'), 'w').write(h)

# Launcher icon: gradient rounded square with a heavy "M" in Archivo 900.
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
f = TTFont(os.path.join(out, 'archivo-latin.woff2'))
if 'fvar' in f:
    f = instancer.instantiateVariableFont(f, {'wght': 900, 'wdth': 118})
f.flavor = None
ttf = io.BytesIO(); f.save(ttf); ttf.seek(0)
S = 1024
grad = Image.new('RGB', (S, S))
px = grad.load()
c0, c1, c2 = (255, 59, 92), (162, 59, 235), (139, 92, 246)
for y in range(S):
    for x in range(S):
        t = (x + y) / (2 * S - 2)
        a, b, u = (c0, c1, t / .55) if t < .55 else (c1, c2, (t - .55) / .45)
        px[x, y] = tuple(int(a[i] + (b[i] - a[i]) * u) for i in range(3))
mask = Image.new('L', (S, S), 0)
ImageDraw.Draw(mask).rounded_rectangle([0, 0, S - 1, S - 1], radius=230, fill=255)
icon = Image.new('RGBA', (S, S), (0, 0, 0, 0)); icon.paste(grad, (0, 0), mask)
d = ImageDraw.Draw(icon)
font = ImageFont.truetype(ttf, 640)
bb = d.textbbox((0, 0), 'M', font=font)
d.text(((S - (bb[2] - bb[0])) / 2 - bb[0], (S - (bb[3] - bb[1])) / 2 - bb[1] - 20), 'M', font=font, fill=(255, 255, 255))
d.rounded_rectangle([300, 790, 724, 830], radius=20, fill=(255, 255, 255, 230))
for dens, size in {'mdpi': 48, 'hdpi': 72, 'xhdpi': 96, 'xxhdpi': 144, 'xxxhdpi': 192}.items():
    p = os.path.join(res, 'mipmap-' + dens); os.makedirs(p, exist_ok=True)
    icon.resize((size, size), Image.LANCZOS).save(os.path.join(p, 'ic_launcher.png'))
icon.resize((512, 512), Image.LANCZOS).save(os.path.join(out, '..', 'icon-512.png'))
print('assets ok:', sorted(os.listdir(out)))
