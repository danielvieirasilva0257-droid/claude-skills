# WhisperX forced alignment of the KNOWN script on one audio file.
# Usage: align_full.py audio.wav falas.txt out.json
# Writes: {"duration": s, "lines": [{"text", "start", "end", "words": [{"word","start","end","score"}]}], "chars_tail": [...]}
import sys, json
import torch; torch.set_num_threads(4)
from whisperx.alignment import load_align_model, align
from whisperx.audio import load_audio
wav, falas, out = sys.argv[1:4]
lines = [l.strip() for l in open(falas, encoding='utf-8') if l.strip()]
audio = load_audio(wav); dur = len(audio) / 16000
model, meta = load_align_model(language_code='pt', device='cpu')
text = ' '.join(lines)
res = align([{'start': 0.0, 'end': dur, 'text': text}], model, meta, audio, 'cpu', return_char_alignments=True)
ws = res['word_segments']
nwords = [len(l.split()) for l in lines]
assert sum(nwords) == len(ws), (sum(nwords), len(ws))
o = {'duration': dur, 'lines': []}
k = 0
for l, n in zip(lines, nwords):
    words = []
    for w in ws[k:k + n]:
        words.append({'word': w['word'], 'start': w.get('start'), 'end': w.get('end'), 'score': w.get('score')})
    k += n
    o['lines'].append({'text': l, 'start': words[0]['start'], 'end': words[-1]['end'], 'words': words})
chars = res['segments'][-1].get('chars', [])
o['chars_tail'] = chars[-40:]
json.dump(o, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for i, L in enumerate(o['lines'], 1):
    low = [(w['word'], round(w['score'], 2)) for w in L['words'] if w['score'] is not None and w['score'] < 0.5]
    none = [w['word'] for w in L['words'] if w['start'] is None]
    print(f"{i:02d} {L['start']:.3f}-{L['end']:.3f} ({L['end']-L['start']:.2f}s) low={low} untimed={none}")
