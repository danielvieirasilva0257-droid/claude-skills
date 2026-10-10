"""Check a narration (or a final mix) against the known script with automatic transcription (faster-whisper).
The Claude cannot listen: this is the objective check that every word is there and intelligible.

Usage: python conferir_voz.py audio.wav falas.txt [--modelo small | <path to a CTranslate2 model, e.g. large-v3-turbo>]
Prints: word accuracy against the script, the differences, the mean/min word probability and the transcription.
Reference (Rotina v2, 2026-10-09, large-v3-turbo): Gemini voice 97.1%, the same at 1.6x with atempo 97.1%,
final mix with music and SFX 97.8%. Dropped articles ("a sua" -> "sua") are normal for Whisper; worry below ~95%.
Install: pip install faster-whisper soundfile numpy (same venv as kokoro_tts.py works).
"""
import argparse
import difflib
import re
import unicodedata

import numpy as np
import soundfile as sf
from faster_whisper import WhisperModel


def norm(w):
    w = unicodedata.normalize('NFC', w.lower())
    return re.sub(r"[^\wà-ú]", "", w)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('audio')
    ap.add_argument('falas')
    ap.add_argument('--modelo', default='small')
    a = ap.parse_args()
    ref_txt = open(a.falas, encoding='utf-8').read()
    x, sr = sf.read(a.audio, dtype='float32')
    if x.ndim > 1:
        x = x.mean(1)
    if sr != 16000:
        t = np.linspace(0, len(x) - 1, int(len(x) * 16000 / sr))
        x = np.interp(t, np.arange(len(x)), x).astype('float32')
    m = WhisperModel(a.modelo, device='cpu', compute_type='int8', cpu_threads=4)
    segs, _ = m.transcribe(x, language='pt', beam_size=5, condition_on_previous_text=False, word_timestamps=True)
    segs = list(segs)
    hyp = ' '.join(s.text.strip() for s in segs)
    probs = [w.probability for s in segs for w in (s.words or [])] or [0.0]
    ref = [norm(w) for w in ref_txt.split() if norm(w)]
    h = [norm(w) for w in hyp.split() if norm(w)]
    sm = difflib.SequenceMatcher(a=ref, b=h, autojunk=False)
    diffs = [f"{' '.join(ref[i1:i2])} -> {' '.join(h[j1:j2])}" for op, i1, i2, j1, j2 in sm.get_opcodes() if op != 'equal']
    acc = sum(b.size for b in sm.get_matching_blocks()) / max(1, len(ref))
    print(f'acerto de palavras: {acc:.1%}  ({len(ref)} no roteiro, {len(h)} transcritas)')
    print(f'probabilidade média por palavra: {np.mean(probs):.3f}  (mínima {np.min(probs):.3f})')
    print('diferenças:', diffs if diffs else 'nenhuma')
    print('transcrição:', hyp)


if __name__ == '__main__':
    main()
