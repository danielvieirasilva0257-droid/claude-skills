"""Generate pt-BR narration with Gemini TTS (Google AI Studio API).

Usage:
  python gemini_tts.py --voz Leda --texto "Com o app Rotina, você tem." --saida 03.wav
  python gemini_tts.py --voz Leda --falas falas.txt --juntar --saida roteiro.wav   # whole script, ONE request (recommended)
  python gemini_tts.py --voz Leda --falas falas.txt --pasta vo/                     # one request per line -> vo/01.wav, vo/02.wav...

Keys (NEVER commit them): env GEMINI_API_KEY first, then every /root/.config/rotina/gemini*.key file in name order.
If a key is rejected (HTTP 401/403) or its daily quota is gone (HTTP 429 "PerDay"), the next key is tried.
A per-minute 429 or a 503 (high demand) waits 25 s and retries once with the same key.

Notes (measured 2026-10-09/10):
  - Send ONLY the script text. gemini-3.8-flash-tts reads any style instruction aloud
    ("Fale como locutor..." or "Say in an energetic voice:"), and systemInstruction is rejected.
  - Pick the style through the voice (user's ear test: Leda = upbeat, Laomedeia = sensible, Zephyr = calm and direct).
  - Free quota: 10 requests per day per model and per Google account/project.
  - Output: WAV, PCM 16-bit, 24 kHz, mono. ~7-8 s per short request; a 13-line script (139 words) = 52 s of audio.
  - The output file is written only after a successful response (an error never leaves an empty .wav behind).
"""
import argparse
import base64
import glob
import io
import json
import os
import ssl
import sys
import time
import urllib.error
import urllib.request
import wave

MODEL = "gemini-3.8-flash-tts"
URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
KEY_GLOB = "/root/.config/rotina/gemini*.key"


def api_keys():
    keys = []
    if os.environ.get("GEMINI_API_KEY"):
        keys.append(("env GEMINI_API_KEY", os.environ["GEMINI_API_KEY"].strip()))
    for path in sorted(glob.glob(KEY_GLOB)):
        k = open(path).read().strip()
        if k and all(k != v for _, v in keys):
            keys.append((os.path.basename(path), k))
    if not keys:
        sys.exit("No key: set GEMINI_API_KEY or create /root/.config/rotina/gemini.key")
    return keys


def ssl_context():
    ca = os.environ.get("SSL_CERT_FILE") or ("/root/.ccr/ca-bundle.crt" if os.path.exists("/root/.ccr/ca-bundle.crt") else None)
    return ssl.create_default_context(cafile=ca) if ca else ssl.create_default_context()


class KeyProblem(Exception):
    """This key cannot be used now (rejected or daily quota exhausted): try the next one."""


def _request(text, voice, model, key):
    body = {
        "contents": [{"parts": [{"text": text}]}],
        "generationConfig": {
            "responseModalities": ["AUDIO"],
            "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}},
        },
    }
    req = urllib.request.Request(
        URL.format(model=model),
        data=json.dumps(body).encode(),
        headers={"x-goog-api-key": key, "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, context=ssl_context(), timeout=180) as r:
        return json.load(r)


def synthesize(text, voice, model=MODEL):
    """Return WAV bytes. Tries every key; retries once on per-minute 429 / 503."""
    last = ""
    for name, key in api_keys():
        data = None
        for attempt in (1, 2):
            try:
                data = _request(text, voice, model, key)
                break
            except urllib.error.HTTPError as e:
                msg = e.read().decode(errors="replace")[:600]
                last = f"HTTP {e.code} ({name}): {msg}"
                if e.code in (401, 403) or (e.code == 429 and "PerDay" in msg):
                    print(f"  key {name} unusable ({e.code}), trying the next key", file=sys.stderr)
                    break
                if e.code in (429, 503):
                    if attempt == 1:
                        print(f"  HTTP {e.code} with {name}: waiting 25 s and retrying once", file=sys.stderr)
                        time.sleep(25)
                        continue
                    print(f"  still HTTP {e.code} with {name}, trying the next key", file=sys.stderr)
                    break
                sys.exit(last)  # other errors (bad request, unknown model...): stop here
            except urllib.error.URLError as e:
                sys.exit(f"Network error: {e}")
        if data is None:
            continue
        part = data["candidates"][0]["content"]["parts"][0]["inlineData"]
        audio = base64.b64decode(part["data"])
        print(f"  ok with {name}", file=sys.stderr)
        if "wav" in part["mimeType"]:
            return audio
        # raw PCM (audio/L16) -> wrap in a WAV header
        buf = io.BytesIO()
        with wave.open(buf, "wb") as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(24000)
            w.writeframes(audio)
        return buf.getvalue()
    sys.exit("No key worked. Last error: " + last)


def write(path, data):
    d = os.path.dirname(path)
    if d:
        os.makedirs(d, exist_ok=True)
    with open(path, "wb") as fh:
        fh.write(data)
    print("ok:", path)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--voz", default="Leda")
    ap.add_argument("--modelo", default=MODEL)
    ap.add_argument("--texto")
    ap.add_argument("--saida")
    ap.add_argument("--falas", help="text file, one voice line per line")
    ap.add_argument("--juntar", action="store_true", help="with --falas: the whole script in ONE request, saved to --saida")
    ap.add_argument("--pasta", default=".")
    a = ap.parse_args()
    if a.texto:
        write(a.saida or "fala.wav", synthesize(a.texto, a.voz, a.modelo))
    elif a.falas:
        lines = [l.strip() for l in open(a.falas, encoding="utf-8") if l.strip()]
        if a.juntar:
            write(a.saida or "roteiro.wav", synthesize("\n".join(lines), a.voz, a.modelo))
        else:
            for i, line in enumerate(lines, 1):
                write(os.path.join(a.pasta, f"{i:02d}.wav"), synthesize(line, a.voz, a.modelo))
    else:
        ap.error("use --texto or --falas")


if __name__ == "__main__":
    main()
