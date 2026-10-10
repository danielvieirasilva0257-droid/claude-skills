"""Generate music with Lyria 3 through the Gemini Interactions API (POST /v1beta/interactions).
Usage: python lyria.py --prompt prompt.txt --saida out.mp3 [--modelo lyria-3-clip-preview | lyria-3.5]
Key: env GEMINI_API_KEY (never commit it). Prints any text parts (structure/lyrics) and the audio mime type.
IMPORTANT (tested 2026-10-09): the free tier allows 0 requests per day for lyria-3-clip-preview, lyria-3-pro-preview
and lyria-3.5 (HTTP 429 "limit: 0"): it needs a paid API tier. Clip = always 30 s, MP3, 44.1 kHz stereo, SynthID.
Prompt tips (docs): instruments, BPM, key, mood; "Instrumental only, no vocals."; timestamped lines like
"[0:00 - 0:05] Intro: ..." to place the build, the drop and the ending."""
import argparse, base64, json, os, ssl, sys, urllib.request
ap = argparse.ArgumentParser()
ap.add_argument('--prompt', required=True); ap.add_argument('--saida', required=True)
ap.add_argument('--modelo', default='lyria-3-clip-preview')
a = ap.parse_args()
key = os.environ['GEMINI_API_KEY']
body = {'model': a.modelo, 'input': open(a.prompt, encoding='utf-8').read().strip()}
req = urllib.request.Request('https://generativelanguage.googleapis.com/v1beta/interactions',
                             data=json.dumps(body).encode(), headers={'x-goog-api-key': key, 'Content-Type': 'application/json'})
ctx = ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
try:
    with urllib.request.urlopen(req, context=ctx, timeout=300) as r:
        d = json.load(r)
except urllib.error.HTTPError as e:
    sys.exit(f'HTTP {e.code}: {e.read().decode()[:600]}')
n = 0
for step in d.get('steps', []):
    if step.get('type') != 'model_output':
        continue
    for c in step.get('content', []):
        if c.get('type') == 'audio':
            raw = base64.b64decode(c['data']); n += 1
            out = a.saida if n == 1 else a.saida.replace('.', f'_{n}.', 1)
            open(out, 'wb').write(raw)
            print('audio:', out, c.get('mime_type') or c.get('mimeType'), len(raw), 'bytes')
        elif c.get('type') == 'text':
            print('text:', c.get('text', '')[:1500])
if not n:
    print('no audio; keys:', list(d.keys()), json.dumps(d)[:800])
