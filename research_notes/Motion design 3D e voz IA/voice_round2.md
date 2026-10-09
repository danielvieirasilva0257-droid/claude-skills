# Round 2: local pt-BR TTS on CPU + word-level forced alignment for Remotion captions (2026-10-08)

> STATUS: IN PROGRESS (this file is updated after each result).
> Machine: Linux, 4 vCPU, 15 GB RAM, no GPU; system Python 3.13.16; uv 0.11.32; Node 22.22.0; ffmpeg 6.1.1.
> Labels: **[MEASURED]** = run in this container (command + versions given). **[ONLINE]** = claim from a web page / model card (linked). **[INFERENCE]** = my reasoning.
> Source audio for alignment tests: `/home/user/claude-skills/rotina-video/public/vo/NN.wav` (edge-tts `pt-BR-AntonioNeural`, 48 kHz mono s16), texts from `src/explainer/timeline.ts` (VO array). Project files were NOT modified.

## Q1. Kokoro-82M (kokoro-onnx) — pt-BR voices, CPU speed, pronunciation, license

### Takeaway
Kokoro v1.0 has 3 Brazilian Portuguese voices (`pf_dora`, `pm_alex`, `pm_santa`). It runs easily on this 4-CPU box: **RTF ≈ 0.29 with the fp32 ONNX model**, so the whole 13-line Rotina script (50 s of audio) took 14.7 s. The **int8 model was 4–6x slower** here (RTF 1.2–1.8), so use fp32. Weights and voices are Apache-2.0, which allows commercial use. The weak point is pronunciation of loanwords: the espeak-ng `pt-br` front end turns "Excel" into /esˈɛʊ/ ("esséu") and "deload" into /deloˈad/ ("de-lo-ÁD"). Respell those words in the script.

### Cited Findings
**[MEASURED] Setup** (2026-10-08):
- Install: `uv venv -p 3.13 venv_a && uv pip install kokoro-onnx soundfile piper-tts faster-whisper` took 21 s. Installed kokoro-onnx 0.6.1, onnxruntime 1.30.0, phonemizer 3.4.0, espeakng-loader 0.2.4 (bundles **espeak-ng 1.52.0**, so no system espeak is needed).
- Model files came from the kokoro-onnx GitHub release `model-files-v1.0`: `kokoro-v1.0.onnx` (325.5 MB, fp32), `kokoro-v1.0.int8.onnx` (92.4 MB) and `voices-v1.0.bin` (28.2 MB).
- API: `Kokoro(model, voices).create(text, voice='pm_alex', speed=1.0, lang='pt-br')`.
- Script: `scratchpad/r2/scripts/kokoro_bench.py`.

**[MEASURED] Speed** (4 vCPU, onnxruntime default threads, warm model, one call per line):

| Model | Voice | Line | Audio (s) | Synth (s) | RTF |
|---|---|---|---|---|---|
| fp32 | pm_alex | 01 "Controle da sua rotina..." | 3.50 | 1.71 | 0.49 (first calls after warm-up) |
| fp32 | pm_alex | 03 "Com o app Rotina, você tem." | 1.81 | 1.07 | 0.59 |
| fp32 | pm_alex | 07 "...força, hipertrofia, resistência ou deload." | 4.71 | 2.63 | 0.56 |
| fp32 | pf_dora | 01 / 03 / 07 / test | 3.46 / 1.86 / 4.63 / 3.73 | 1.06 / 0.60 / 1.37 / 1.01 | 0.27–0.32 |
| fp32 | pm_santa | 01 / 03 / 07 / test | 3.65 / 1.86 / 4.69 / 3.90 | 1.01 / 0.60 / 1.34 / 1.09 | 0.28–0.32 |
| **fp32** | **pm_alex** | **full script (13 lines, one call)** | **50.25** | **14.73** | **0.293** |
| int8 | 3 voices | 07 | 4.67 | 5.5–6.1 | 1.18–1.30 |
| int8 | pm_alex | full script | 49.93 | 89.55 | 1.79 |

- Model load: 2.77 s for fp32 and 0.77 s for int8.
- The ONNX v1.0 file exposes **no duration output** (`Kokoro.has_timings == False`), so `create_timed()` returns no timings with this file. Word timing for Kokoro audio still needs forced alignment (Q4).

**[MEASURED] Pronunciation front end.** espeak-ng 1.52 `pt-br` output from `k.tokenizer.phonemize(..., 'pt-br')`:

| Word | Phonemes | Assessment |
|---|---|---|
| app | ˈap | Read as Portuguese "áp"; Brazilians usually say "ép" |
| Excel | esˈɛʊ | **Wrong**: the /ks/ is lost, so it sounds like "esséu" |
| PIX | pˈiks | OK |
| deload | dˌeloˈad | **Wrong**: "de-lo-ÁD"; should be "di-LOUD" |
| checklist | ʃeklˈistʃ | Acceptable |
| Brasil | brazˈiʊ | OK (final L vocalised) |
| tia | tʃˈiæ | OK (palatalised t) |
| Rotina | xˌotʃˈinæ | OK |
| hipertrofia | ˌipeɾətrofˈiæ | Epenthetic ə in "per-tro" |

- Every phoneme symbol produced for the full script is in the model's 114-symbol vocab, so nothing is silently dropped.

**[ONLINE] License and voices**
- `hexgrad/Kokoro-82M` is tagged `license:apache-2.0` (HF API). The voices are part of the same repo. — [HF Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M)
- The ONNX conversion `onnx-community/Kokoro-82M-v1.0-ONNX` is also Apache-2.0. It ships per-voice files `voices/pf_dora.bin`, `pm_alex.bin` and `pm_santa.bin`. — [HF onnx-community](https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX)
- The pt-BR voices, `lang_code='p'` and the espeak-ng `pt-br` G2P are documented in VOICES.md, with a warning that non-English support "may be absent or thin". — [Kokoro VOICES.md](https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md) (from round 1)
- The kokoro-onnx package is MIT (from its installed dist-info LICENSE, "Copyright (c) 2025 github.com/thewh1teagle"). Its phonemizer dependency is GPL-3.0+ (dist-info METADATA) and espeak-ng is GPL-3.0.

### Inferences
- **[INFERENCE] Licensing.** The GPL on phonemizer and espeak-ng covers the *software* if you redistribute it, not the audio you generate. Commercial use of Kokoro audio in ads is fine under Apache-2.0. Keep a copy of the license with the project.
- **[INFERENCE] Speed.** A 60 s Reel takes about 15–20 s to synthesise on this machine, so speed is not a constraint. Do not use the int8 model on this CPU: it is slower here, probably because dynamic-quantisation kernels lack fast paths on this vCPU type.
- **[INFERENCE] Script prep.** Write loanwords phonetically in the TTS input only, for example "éksel" or "ékiçél" for Excel, "dilôud" for deload, and "ép" for app. Captions should still use the original spelling; see Q4, where alignment runs on the respelled text and then maps back to the display words.

### Gaps
- I cannot listen to audio. Quality impressions here come from phoneme inspection and an ASR intelligibility check (see Q5). Naturalness and prosody must be judged by ear from the samples.
- The PyTorch `kokoro` package (misaki G2P, Python < 3.13) was not tested. Its pt-br phonemes could differ slightly from kokoro-onnx's.

## Q2. Piper pt_BR voices — CPU speed, quality, license per voice

### Takeaway
(pending)

### Cited Findings
(pending)

### Inferences
(pending)

### Gaps
(pending)

## Q3. Chatterbox Multilingual (Portuguese) on CPU

### Takeaway
(pending)

### Cited Findings
(pending)

### Inferences
(pending)

### Gaps
(pending)

## Q4. Word timestamps / forced alignment on CPU for pt-BR → Remotion `Caption`

### Takeaway
(pending)

### Cited Findings
(pending)

### Inferences
(pending)

### Gaps
(pending)

## Q5. Listenable samples

### Takeaway
(pending)

### Cited Findings
(pending)

### Inferences
(pending)

### Gaps
(pending)

## PENDENTE / NÃO PESQUISADO
(pending)
