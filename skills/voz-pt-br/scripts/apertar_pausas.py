"""Fit a narration to a target duration: tighten the pauses of an already sped-up voice (cut only inside silence)
and write the final voice track plus the word timeline in video time (the file that drives the animation).

Typical flow (Rotina v2, 2026-10-09):
  1. ffmpeg -i roteiro.wav -af "aresample=48000:resampler=soxr,atempo=1.6" voz_1.6x.wav   (atempo keeps ASR ~97%;
     rubberband dropped it to 93-94%)
  2. python alinhar_roteiro.py voz_1.6x.wav falas.txt alinhamento.json
  3. python apertar_pausas.py voz_1.6x.wav alinhamento.json voz_final.wav voz.json --inicio 0.10
Before choosing the speed, estimate the result from the 1x alignment:
  python apertar_pausas.py --estimar alinhamento_1x.json [--alvo 30]

Pause targets (seconds, at final speed): between lines --entre-falas, after a given line --depois "3=0.26,5=0.24",
inside a line after . ? ! : --entre-frases, comma-like pauses (>= --min-virgula) are capped at --virgula.
Cuts are made where the 10 ms RMS is below -42 dB, with 6 ms fades. Output voz.json:
  {"fps", "lead_s", "voice_end_s", "lines": [{"n", "text", "start", "end", "words": [{"word", "start", "end"}]}]} (seconds)
"""
import argparse
import json

import numpy as np
import soundfile as sf


def load_words(path):
    o = json.load(open(path, encoding='utf-8'))
    W = []
    for li, L in enumerate(o['lines'], 1):
        for w in L['words']:
            W.append(dict(line=li, word=w['word'], start=w['start'], end=w['end']))
    return o, W


def parse_after(s):
    out = {}
    for part in (s or '').split(','):
        if '=' in part:
            k, v = part.split('=')
            out[int(k)] = float(v)
    return out


def target_gap(a, b, g, args, after):
    if a['line'] != b['line']:
        return after.get(a['line'], args.entre_falas)
    if a['word'][-1] in '.?:!':
        return min(g, args.entre_frases)
    if g >= args.min_virgula:
        return min(g, args.virgula)
    return None  # keep as is


def estimate(args):
    o, W = load_words(args.estimar)
    after = parse_after(args.depois)
    print('velocidade  voz (s)  vídeo com --inicio e 0,7 s de cauda')
    for F in [1.3, 1.4, 1.5, 1.55, 1.6, 1.65, 1.7, 1.8]:
        t = 0.0
        for a, b in zip(W, W[1:]):
            t += (a['end'] - a['start']) / F
            g = (b['start'] - a['end']) / F
            tg = target_gap(a, b, g, args, after)
            t += g if tg is None else tg
        t += (W[-1]['end'] - W[-1]['start']) / F
        mark = '  <- cabe' if args.alvo and t + args.inicio + 0.7 <= args.alvo else ''
        print(f'{F:9.2f}  {t:7.2f}  {t + args.inicio + 0.7:7.2f}{mark}')


def compose(args):
    x, sr = sf.read(args.voz, dtype='float32')
    if x.ndim > 1:
        x = x.mean(1)
    o, W = load_words(args.alinhamento)
    after = parse_after(args.depois)

    def rms_db(t0, t1):
        seg = x[max(int(t0 * sr), 0):max(int(t1 * sr), int(t0 * sr) + 1)]
        return 20 * np.log10(np.sqrt(np.mean(seg ** 2)) + 1e-9)

    def quiet_after(t, limit):
        k = 0.0
        while k < limit and rms_db(t + k, t + k + 0.01) > -42:
            k += 0.005
        return k

    def quiet_before(t, limit):
        k = 0.0
        while k < limit and rms_db(t - k - 0.01, t - k) > -42:
            k += 0.005
        return k

    cuts = []
    for a, b in zip(W, W[1:]):
        g = b['start'] - a['end']
        tg = target_gap(a, b, g, args, after)
        if tg is None:
            continue
        ta = min(quiet_after(a['end'], 0.12) + 0.015, g)
        tb = min(quiet_before(b['start'], 0.06) + 0.010, max(0.0, g - ta))
        cuts.append((a['end'] + ta, b['start'] - tb, max(tg - ta - tb, 0.0)))
    first = W[0]['start'] - quiet_before(W[0]['start'], 0.06) - 0.01
    last = W[-1]['end'] + quiet_after(W[-1]['end'], 0.2) + 0.03
    fade = int(0.006 * sr)
    pieces, mapping, cur, t_out = [], [], max(0.0, first), 0.0

    def take(t0, t1):
        seg = x[int(t0 * sr):int(t1 * sr)].copy()
        if len(seg) > 2 * fade:
            seg[:fade] *= np.linspace(0, 1, fade)
            seg[-fade:] *= np.linspace(1, 0, fade)
        return seg

    for cutA, cutB, fill in cuts:
        seg = take(cur, cutA)
        mapping.append((cur, cutA, t_out))
        pieces.append(seg)
        t_out += len(seg) / sr
        sil = np.zeros(int(round(fill * sr)), dtype='float32')
        pieces.append(sil)
        t_out += len(sil) / sr
        cur = cutB
    seg = take(cur, last)
    mapping.append((cur, last, t_out))
    pieces.append(seg)
    t_out += len(seg) / sr
    y = np.concatenate([np.zeros(int(round(args.inicio * sr)), dtype='float32')] + pieces)
    sf.write(args.saida, y, sr, subtype='PCM_16')

    def m(t):
        for s0, s1, o0 in mapping:
            if s0 - 1e-6 <= t <= s1 + 1e-6:
                return args.inicio + o0 + (t - s0)
        s0, s1, o0 = min(mapping, key=lambda r: min(abs(t - r[0]), abs(t - r[1])))
        return args.inicio + o0 + (min(max(t, s0), s1) - s0)

    lines = []
    for li, L in enumerate(o['lines'], 1):
        ws = [dict(word=w['word'], start=round(m(w['start']), 3), end=round(m(w['end']), 3)) for w in L['words']]
        lines.append(dict(n=li, text=L['text'], start=ws[0]['start'], end=ws[-1]['end'], words=ws))
    json.dump(dict(fps=args.fps, lead_s=args.inicio, voice_end_s=round(args.inicio + t_out, 3), lines=lines),
              open(args.linha_do_tempo, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'voz final: {len(y) / sr:.3f} s; última palavra termina em {lines[-1]["end"]:.3f} s')
    for L in lines:
        print(f"{L['n']:02d} {L['start']:6.3f}-{L['end']:6.3f}  quadros {round(L['start'] * args.fps):4d}-{round(L['end'] * args.fps):4d}  {L['text'][:46]}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('voz', nargs='?')
    ap.add_argument('alinhamento', nargs='?')
    ap.add_argument('saida', nargs='?')
    ap.add_argument('linha_do_tempo', nargs='?')
    ap.add_argument('--estimar', help='1x alignment json: print the voice length for several speeds and exit')
    ap.add_argument('--alvo', type=float, help='with --estimar: target video length (s)')
    ap.add_argument('--inicio', type=float, default=0.10, help='silence before the first word (s)')
    ap.add_argument('--entre-falas', type=float, default=0.18)
    ap.add_argument('--entre-frases', type=float, default=0.13)
    ap.add_argument('--virgula', type=float, default=0.10)
    ap.add_argument('--min-virgula', type=float, default=0.12)
    ap.add_argument('--depois', default='', help='custom pause after given lines, e.g. "3=0.26,5=0.24"')
    ap.add_argument('--fps', type=int, default=30)
    args = ap.parse_args()
    if args.estimar:
        estimate(args)
    elif args.voz and args.alinhamento and args.saida and args.linha_do_tempo:
        compose(args)
    else:
        ap.error('use: voz alinhamento saida linha_do_tempo, or --estimar alinhamento_1x.json')


if __name__ == '__main__':
    main()
