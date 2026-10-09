# Compose the final voice track: tighten pauses on the time-stretched voice, place it on the video timeline,
# and write word/line timings in video time.
# Usage: compose_vo.py stretched.wav align.json out.wav out_timeline.json [lead_s]
import sys, json, numpy as np, soundfile as sf
src, align_p, out_wav, out_json = sys.argv[1:5]
LEAD = float(sys.argv[5]) if len(sys.argv) > 5 else 0.20
x, sr = sf.read(src, dtype='float32')
o = json.load(open(align_p, encoding='utf-8'))
W = []
for li, L in enumerate(o['lines'], 1):
    for w in L['words']:
        W.append(dict(line=li, word=w['word'], start=w['start'], end=w['end']))
# targets (seconds, final speed) for the pause AFTER a given line; default line gap
LINE_GAP = 0.18
AFTER_LINE = {1: 0.15, 2: 0.22, 3: 0.26, 5: 0.24, 8: 0.26, 11: 0.24, 12: 0.22}
SENT_GAP, COMMA_CAP, COMMA_MIN = 0.13, 0.10, 0.12
hop = int(0.005 * sr)
def rms_db(t0, t1):
    a, b = int(t0 * sr), int(t1 * sr)
    seg = x[max(a, 0):max(b, a + 1)]
    return 20 * np.log10(np.sqrt(np.mean(seg ** 2)) + 1e-9)
def quiet_after(t, limit):  # walk forward from a word end until 10 ms RMS < -42 dB
    k = 0.0
    while k < limit and rms_db(t + k, t + k + 0.01) > -42: k += 0.005
    return k
def quiet_before(t, limit):
    k = 0.0
    while k < limit and rms_db(t - k - 0.01, t - k) > -42: k += 0.005
    return k
# decide cuts: list of (cutA, cutB, new_gap_fill) in source time
cuts = []
for a, b in zip(W, W[1:]):
    g = b['start'] - a['end']
    if a['line'] != b['line']:
        target = AFTER_LINE.get(a['line'], LINE_GAP)
    elif a['word'][-1] in '.?:!':
        target = min(g, SENT_GAP)
    elif g >= COMMA_MIN:
        target = min(g, COMMA_CAP)
    else:
        continue
    ta = min(quiet_after(a['end'], 0.12) + 0.015, g)          # keep the decaying tail + guard
    tb = min(quiet_before(b['start'], 0.06) + 0.010, g - ta)   # keep the onset + guard
    cutA, cutB = a['end'] + ta, b['start'] - tb
    fill = max(target - ta - tb, 0.0)
    cuts.append((cutA, cutB, fill, a['line'], b['line']))
# assemble
first = W[0]['start'] - quiet_before(W[0]['start'], 0.06) - 0.01
last = W[-1]['end'] + quiet_after(W[-1]['end'], 0.2) + 0.03
pieces, mapping = [], []  # mapping: (src_t0, src_t1, out_t0)
cur, t_out = first, 0.0
fade = int(0.006 * sr)
def take(t0, t1):
    seg = x[int(t0 * sr):int(t1 * sr)].copy()
    if len(seg) > 2 * fade:
        seg[:fade] *= np.linspace(0, 1, fade); seg[-fade:] *= np.linspace(1, 0, fade)
    return seg
for cutA, cutB, fill, la, lb in cuts:
    seg = take(cur, cutA); mapping.append((cur, cutA, t_out)); pieces.append(seg); t_out += len(seg) / sr
    sil = np.zeros(int(round(fill * sr)), dtype='float32'); pieces.append(sil); t_out += len(sil) / sr
    cur = cutB
seg = take(cur, last); mapping.append((cur, last, t_out)); pieces.append(seg); t_out += len(seg) / sr
voice = np.concatenate(pieces)
lead = np.zeros(int(round(LEAD * sr)), dtype='float32')
y = np.concatenate([lead, voice])
sf.write(out_wav, y, sr, subtype='PCM_16')
def m(t):  # source time -> video time
    for s0, s1, o0 in mapping:
        if s0 - 1e-6 <= t <= s1 + 1e-6: return LEAD + o0 + (t - s0)
    # inside a removed gap: snap to nearest kept edge
    best = min(mapping, key=lambda r: min(abs(t - r[0]), abs(t - r[1])))
    s0, s1, o0 = best
    return LEAD + o0 + (min(max(t, s0), s1) - s0)
lines = []
for li, L in enumerate(o['lines'], 1):
    ws = [dict(word=w['word'], start=round(m(w['start']), 3), end=round(m(w['end']), 3)) for w in L['words']]
    lines.append(dict(n=li, text=L['text'], start=ws[0]['start'], end=ws[-1]['end'], words=ws))
lines[-1]['end'] = lines[-1]['words'][-1]['end'] = round(min(lines[-1]['end'], LEAD + t_out - 0.03), 3)
json.dump(dict(fps=30, lead_s=LEAD, voice_end_s=round(LEAD + t_out, 3), speed=1.6, lines=lines), open(out_json, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('voice track', round(len(y) / sr, 3), 's; last word ends', lines[-1]['end'])
for L in lines: print(f"{L['n']:02d} {L['start']:6.3f}-{L['end']:6.3f}  f{round(L['start']*30):4d}-f{round(L['end']*30):4d}  {L['text'][:50]}")
