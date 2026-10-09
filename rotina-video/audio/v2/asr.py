# ASR check: transcribe a WAV with faster-whisper and compare with the known script (word accuracy)
import sys, re, difflib, unicodedata
import soundfile as sf, numpy as np
from faster_whisper import WhisperModel
def norm(w):
    w = unicodedata.normalize('NFC', w.lower())
    return re.sub(r"[^\wà-ú]", "", w)
wav, ref_txt, model = sys.argv[1], open(sys.argv[2], encoding='utf-8').read(), (sys.argv[3] if len(sys.argv) > 3 else 'small')
a, sr = sf.read(wav, dtype='float32')
if a.ndim > 1: a = a.mean(1)
if sr != 16000:
    x = np.linspace(0, len(a) - 1, int(len(a) * 16000 / sr)); a = np.interp(x, np.arange(len(a)), a).astype('float32')
m = WhisperModel(model, device='cpu', compute_type='int8', cpu_threads=4)
segs, _ = m.transcribe(a, language='pt', beam_size=5, condition_on_previous_text=False, word_timestamps=True)
segs = list(segs)
hyp = ' '.join(s.text.strip() for s in segs)
probs = [w.probability for s in segs for w in (s.words or [])]
ref = [norm(w) for w in ref_txt.split() if norm(w)]; h = [norm(w) for w in hyp.split() if norm(w)]
sm = difflib.SequenceMatcher(a=ref, b=h, autojunk=False)
errs = [f"{' '.join(ref[i1:i2])} -> {' '.join(h[j1:j2])}" for op, i1, i2, j1, j2 in sm.get_opcodes() if op != 'equal']
acc = sum(b.size for b in sm.get_matching_blocks()) / len(ref)
print(f'{wav}: word_acc={acc:.3f} n_ref={len(ref)} n_hyp={len(h)} mean_word_prob={np.mean(probs):.3f} min_prob={np.min(probs):.3f}')
print('diffs:', errs)
print('ASR:', hyp)
