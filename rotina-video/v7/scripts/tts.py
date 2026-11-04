# ElevenLabs TTS with character timestamps. Usage: python tts.py falas.txt out_prefix [speed]
import json, sys, base64, urllib.request, pathlib
key = pathlib.Path('/root/.config/rotina/elevenlabs.key').read_text().strip()
text = pathlib.Path(sys.argv[1]).read_text().strip()
speed = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
voice = 'TX3LPaxmHKxFdv7VOQHJ'  # Liam (premade)
body = {'text': text, 'model_id': 'eleven_v4', 'language_code': 'pt',
        'voice_settings': {'stability': 0.45, 'similarity_boost': 0.75, 'style': 0.25, 'use_speaker_boost': True, 'speed': speed}}
req = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps?output_format=mp3_44100_128',
        data=json.dumps(body).encode(), headers={'xi-api-key': key, 'Content-Type': 'application/json'})
d = json.load(urllib.request.urlopen(req, timeout=180))
out = sys.argv[2]
pathlib.Path(out + '.mp3').write_bytes(base64.b64decode(d['audio_base64']))
json.dump(d.get('normalized_alignment') or d['alignment'], open(out + '_align.json', 'w'), ensure_ascii=False)
print('ok', out)
