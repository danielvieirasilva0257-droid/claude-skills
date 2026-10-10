"""Align the KNOWN script (one voice line per line of falas.txt) to ONE audio file with the whole narration
(WhisperX forced alignment, wav2vec2 pt). Use it after generating the whole script in one request.

Usage:
  python alinhar_roteiro.py roteiro.wav falas.txt alinhamento.json [--legendas legendas.json] [--inicio 0.0]
Output alinhamento.json:
  {"duration": s, "lines": [{"n", "text", "start", "end", "words": [{"word", "start", "end", "score"}]}]}  (seconds)
--legendas also writes the words as @remotion/captions Caption[] (ms), shifted by --inicio seconds.
Line ends are capped at the last non-silent 10 ms of the line (CTC tends to stretch the last word into the pause).
Install and NLTK data: see alinhar_legendas.py (same venv). Measured: a 32 s and a 52 s file aligned in one segment
without problems (Rotina v2, 2026-10-09).
"""
import argparse
import json

import numpy as np
import torch
from whisperx.alignment import align, load_align_model
from whisperx.audio import load_audio

torch.set_num_threads(4)
SR = 16000


def speech_end(audio, t0, t1, thr_db=-42.0):
    """Last time in [t0, t1] whose 10 ms RMS is above thr_db (falls back to t1)."""
    a, b = int(t0 * SR), int(t1 * SR)
    seg = audio[a:b]
    hop = int(0.01 * SR)
    last = None
    for i in range(0, max(0, len(seg) - hop), hop):
        r = 20 * np.log10(np.sqrt(np.mean(seg[i:i + hop] ** 2)) + 1e-9)
        if r > thr_db:
            last = i + hop
    return t1 if last is None else t0 + last / SR


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('audio')
    ap.add_argument('falas')
    ap.add_argument('saida')
    ap.add_argument('--legendas')
    ap.add_argument('--inicio', type=float, default=0.0, help='seconds added to the captions (where the audio starts in the video)')
    a = ap.parse_args()
    lines = [l.strip() for l in open(a.falas, encoding='utf-8') if l.strip()]
    audio = load_audio(a.audio)
    dur = len(audio) / SR
    model, meta = load_align_model(language_code='pt', device='cpu')
    res = align([{'start': 0.0, 'end': dur, 'text': ' '.join(lines)}], model, meta, audio, 'cpu', return_char_alignments=False)
    ws = res['word_segments']
    counts = [len(l.split()) for l in lines]
    if sum(counts) != len(ws):
        raise SystemExit(f'word count mismatch: script {sum(counts)} vs aligned {len(ws)} (check punctuation/numbers)')
    out, k, prev = [], 0, 0.0
    for n, (text, c) in enumerate(zip(lines, counts), 1):
        words = []
        for w in ws[k:k + c]:
            s = w.get('start', prev)  # words the aligner cannot time inherit the previous end
            e = w.get('end', s)
            prev = e
            words.append({'word': w['word'], 'start': round(s, 3), 'end': round(e, 3), 'score': None if w.get('score') is None else round(float(w['score']), 3)})
        k += c
        words[-1]['end'] = round(min(words[-1]['end'], speech_end(audio, words[-1]['start'], words[-1]['end']) + 0.03), 3)
        out.append({'n': n, 'text': text, 'start': words[0]['start'], 'end': words[-1]['end'], 'words': words})
    json.dump({'duration': round(dur, 3), 'lines': out}, open(a.saida, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    for L in out:
        low = [w['word'] for w in L['words'] if w['score'] is not None and w['score'] < 0.3]
        print(f"{L['n']:02d} {L['start']:7.3f}-{L['end']:7.3f}  {L['text'][:48]}" + (f"  (baixa confiança: {low})" if low else ''))
    if a.legendas:
        caps = []
        for L in out:
            for w in L['words']:
                caps.append({
                    'text': ('' if not caps else ' ') + w['word'],
                    'startMs': round((a.inicio + w['start']) * 1000),
                    'endMs': round((a.inicio + w['end']) * 1000),
                    'timestampMs': round((a.inicio + (w['start'] + w['end']) / 2) * 1000),
                    'confidence': w['score'],
                })
        json.dump(caps, open(a.legendas, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        print(len(caps), 'captions ->', a.legendas)


if __name__ == '__main__':
    main()
