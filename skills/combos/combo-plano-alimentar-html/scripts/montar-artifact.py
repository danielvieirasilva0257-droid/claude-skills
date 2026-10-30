import sys, re, base64, io, urllib.request
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
h = open(src).read()
def embed(m):
    url = m.group(1).replace('&amp;', '&')
    data = urllib.request.urlopen(url, timeout=60).read()
    im = Image.open(io.BytesIO(data)).convert('RGB')
    im.thumbnail((1200, 1200))
    buf = io.BytesIO(); im.save(buf, 'JPEG', quality=72, optimize=True, progressive=True)
    return 'src="data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode() + '"'
h = re.sub(r'src="(https://images\.[^"]+)"', embed, h)
# artifact skeleton supplies doctype/html/head/body
head = re.search(r'<head>(.*?)</head>', h, re.S).group(1)
body = re.search(r'<body>(.*?)</body>', h, re.S).group(1)
head = re.sub(r'\s*<meta charset[^>]*>|\s*<meta name="viewport"[^>]*>|\s*<link rel="preconnect"[^>]*>', '', head)
head = head.replace('<title>Plano alimentar · Ganho de massa muscular</title>',
                    '<title>Plano alimentar de hipertrofia</title>\n<meta name="claude:viewport-fit-sides" content="cover">')
open(out, 'w').write(head.strip() + '\n' + body.strip() + '\n')
