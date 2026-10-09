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
- Raw espeak-ng 1.52 (`EspeakBackend('pt-br')`) gives the same output as the kokoro-onnx tokenizer, so kokoro-onnx adds no post-processing. Some vowel choices look off: final unstressed "a" becomes `æ` ("rotina" → xˌotʃˈinæ), final "e" in "Controle" becomes `y` (kˌoŋtrˈɔly), and "de" becomes `dʒj`. Piper's bundled espeak data gives `ɐ` and `i` for the same words. Whether this is audible depends on what Kokoro was trained on; judge by ear.
- **[MEASURED] Respelling fixes the loanwords** in the TTS input:

| Respelling | Phonemes | Sounds like |
|---|---|---|
| "Éksel" | ˈɛksɛʊ | "ÉK-séu" |
| "ép" | ˈɛp | "ép" |
| "dilôudi" | dʒˌilˈoudʒi | "dji-LÔU-dji" |

  Samples were made with pm_alex and pf_dora (`*_respell`, script `kokoro_respell.py`).

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
Piper has 4 pt_BR voices: faber, cadu and jeff (medium, 22.05 kHz) and edresson (low, 16 kHz). All run at **RTF ≈ 0.2–0.33 on CPU**, so the full script takes 13–19 s. The licenses are the catch:
- **faber, cadu and jeff** were trained on CC0 Brazilian data, but each model card says they were **"Finetuned from U.S. English lessac voice"**. Lessac's Blizzard-2013 data is licensed for **research only**, excluding "commercialisation ... of voice synthesis".
- **edresson** is fine-tuned from `ryan`, whose dataset is **CC BY-NC-SA 4.0**. In this runtime it also drops the nasal tilde (see below).

So no Piper pt_BR voice is cleanly commercial. Treat them as legally grey and get a legal opinion before using them in paid ads. Piper's front end did pronounce "app" ("ép") and "Excel" ("ekséu") better than kokoro-onnx's.

### Cited Findings
**[MEASURED] Setup**:
- piper-tts **1.8.0** (OHF-Voice piper1-gpl; PyPI license GPL-3.0-or-later), in the same venv as Kokoro, with onnxruntime 1.30.0.
- Voices downloaded from `huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/<voice>/<quality>/` (`.onnx` about 63 MB each, plus `.onnx.json` and `MODEL_CARD`). The HF tree lists exactly 4 pt_BR voices: cadu/medium, edresson/low, faber/medium, jeff/medium.
- API: `PiperVoice.load(path).synthesize(text)`, which yields chunks (`.audio_float_array`).
- Script: `scratchpad/r2/scripts/piper_bench.py`.

**[MEASURED] Speed** (wall clock, warm model; ⚠ another session's Remotion/Chrome render was using about 3 vCPUs during part of this run, so these are upper bounds; see the re-run note below):

| Voice | Line 01 (audio s / RTF) | Line 03 | Line 07 | Test sentence | Full script: audio s, synth s, RTF | Load (s) |
|---|---|---|---|---|---|---|
| faber-medium | 2.87 / 0.53 | 1.92 / 0.29 | 4.77 / 0.41 | 3.66 / 0.31 | 47.5 s, 15.5 s, **0.325** | 7.6 |
| cadu-medium | 4.15 / 0.38 | 2.66 / 0.34 | 5.75 / 0.38 | 5.40 / 0.48 | 63.0 s, 19.5 s, **0.309** | 7.6 |
| jeff-medium | 3.87 / 0.31 | 2.79 / 0.36 | 6.13 / 0.25 | 5.89 / 0.24 | 62.7 s, 18.1 s, **0.289** | 7.5 |
| edresson-low | 4.14 / 0.25 | 2.35 / 0.37 | 8.38 / 0.20 | 5.49 / 0.19 | 65.6 s, 13.3 s, **0.203** | 8.7 |

- At the default `length_scale=1.0`, cadu, jeff and edresson speak much slower than faber (63–66 s versus 47.5 s for the same script; the edge-tts originals total about 51 s). For an ad pace, set `SynthesisConfig(length_scale≈0.8)`.
- **edresson-low** printed `Missing phoneme from id map: ̃` 44 times. The combining nasal tilde is not in its (piper 0.2.0-era) phoneme map, so nasal vowels ("semana", "resistência", "mão") lose nasalisation.
- **No pt_BR voice exposes alignments.** `synthesize(..., include_alignments=True)` returned `phoneme_alignments=None` for all 4, so word timing needs forced alignment (Q4).
- Piper's own espeak-ng data gives: `app` → ˈɛp ("ép", good); `Excel` → ˌeksˈɛʊ ("ekséu", acceptable); `deload` → dˌeloˈadʒ ("de-lo-ÁDJI", wrong); `PIX` → pˈiks; `Brasil` → bɾazˈiʊ; `tia` → tʃˈiʲɐ. Kokoro-onnx's espeak 1.52 output was worse for "app" and "Excel" (Q1).

**[ONLINE] License per voice** (MODEL_CARD files in the HF repo, read 2026-10-09):

| Voice | Dataset and license | Base model it was fine-tuned from | Base data license |
|---|---|---|---|
| faber (medium) | OHF-Voice/voice-datasets, **CC0** | "U.S. English lessac voice (medium quality)" | Blizzard 2013 Lessac: research only |
| cadu (medium) | OHF-Voice/voice-datasets, **CC0** | lessac medium | same |
| jeff (medium) | OHF-Voice/voice-datasets, **CC0** (likely the "Jeff 1.0" CC0 dataset from round 1) | lessac medium | same |
| edresson (low) | TTS-Portuguese-Corpus, **CC BY 4.0** | "U.S. English Ryan voice (low quality)" | RyanSpeech, **CC BY-NC-SA 4.0** |

— [piper-voices pt_BR tree](https://huggingface.co/rhasspy/piper-voices/tree/main/pt/pt_BR); [lessac MODEL_CARD](https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_US/lessac/medium/MODEL_CARD); [ryan MODEL_CARD](https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_US/ryan/low/MODEL_CARD)

- **Blizzard 2013 Lessac license.** Use is limited to "Research Purposes", meaning "only those purposes associated with research and exploration". It excludes use "for any commercial purpose, including the development, marketing, commercialisation, sale or licencing of voice synthesis". The materials "ARE AND REMAIN THE PROPERTY OF VOICE FACTORY INTERNATIONAL INC. ... AND LESSAC TECHNOLOGIES INC." It does not explicitly address models trained on the data. — [CSTR Lessac Blizzard 2013 license](https://www.cstr.inf.ed.ac.uk/projects/blizzard/2013/lessac_blizzard2013/license.html)
- **Piper maintainer** (synesthesiam, 2023-11-14): Piper "does not impose any additional licenses on the checkpoints or voice models", and "it is the responsibility of the end user to make the ultimate judgement". On 2023-11-16 he noted that most voices use the GPL espeak-ng phonemizer: "I don't know if that somehow infects WAV files, but just beware." A community answer reads the Blizzard license as "restrictive and will not allow any derivative to be used commercially" (a non-lawyer's opinion). — [rhasspy/piper discussion #271](https://github.com/rhasspy/piper/discussions/271)
- piper-tts 1.8.0 itself is GPL-3.0-or-later (PyPI metadata). That matters only if you redistribute the software, not for the generated audio.

### Inferences
- **[INFERENCE]** Piper is the fastest and lightest option, but every pt_BR voice inherits weights from a non-commercial English base model. Courts have not settled whether fine-tuned weights "inherit" a dataset license. For a paid ad campaign it is a risk the user does not need to take, because Kokoro (Apache-2.0) and Chatterbox (MIT) exist.
- **[INFERENCE]** To use Piper commercially, the clean route would be a Piper voice trained **from scratch** on CC0 data (for example the Jeff 1.0 CC0 dataset). None is published for pt_BR as far as I found.

### Gaps
- Not checked: whether OHF/Nabu Casa have published a statement on the lessac-finetune issue for their 2025 voices.
- Speed numbers will be re-run with an idle CPU if time allows.

## Q3. Chatterbox Multilingual (Portuguese) on CPU

### Takeaway
(pending — test running)

### Cited Findings
**[ONLINE] What exists** (HF API and model card read 2026-10-09):
- `ResembleAI/Chatterbox-Multilingual-pt-br` (license **MIT**, updated 2026-06-10) is "a dedicated single-language finetune in the **Chatterbox Multilingual V3 Single Language Pack** ... optimized for Portuguese as spoken in Brazil" (locale `pt-BR`, language ID `pt`). Files: `t3_pt_br.safetensors` (2,143,990,296 B, float32), `s3gen_v3.pt` / `.safetensors` (about 1.06 GB) and `grapheme_mtl_merged_expanded_v1.json`. Sibling packs exist for es-es, es-mx-latam, pt-pt, zh-cmn and hi. — [HF model card](https://huggingface.co/ResembleAI/Chatterbox-Multilingual-pt-br)
- **The loader code is not in the pip package.** chatterbox-tts **0.1.7** (PyPI, 2026-03-26) ships `mtl_tts.py` for the 23-language model. The V3 single-language loader lives only in the demo Space's vendored `chatterbox/src/chatterbox/tts.py` (`REPO_ID = "ResembleAI/Chatterbox-Multilingual-pt-br"`; it also pulls `ve.pt`, `conds.pt` and the tokenizer from `ResembleAI/chatterbox`). — [HF Space Chatterbox-Multilingual-TTS-pt-br](https://huggingface.co/spaces/ResembleAI/Chatterbox-Multilingual-TTS-pt-br)
- **Space defaults**: text is cut to **300 characters** (`text_input[:300]`), `exaggeration=0.5`, `temperature=0.8`, `cfg_weight=0.5`. The reference voice is `pt_br_f2.wav`, a female pt-BR prompt (27 s, 16 kHz, from Resemble's public `chatterbox-demo-samples` bucket, which holds only that one pt-br prompt). Generation runs up to `max_new_tokens=1000` speech tokens, and every output passes through the `perth.PerthImplicitWatermarker` (inaudible watermark). — Space `app.py` / `tts.py`

**[MEASURED] Setup**:
- `uv venv -p 3.12 venv_b && uv pip install --torch-backend cpu chatterbox-tts` took **44 s**, installing chatterbox-tts 0.1.7, torch/torchaudio **2.6.0+cpu**, transformers 5.2.0, numpy 1.26.4 and gradio 6.8.0 (1.5 GB venv).
- Weights download (3.0 GB, `huggingface_hub`) took **36 s**.
- **Python 3.12 gotcha:** the run fails at `perth.PerthImplicitWatermarker()` with `TypeError: 'NoneType' object is not callable`. The cause is `ModuleNotFoundError: No module named 'pkg_resources'`, because uv venvs have no setuptools. **Fix:** `uv pip install "setuptools<81"`.
- The Space's vendored code loaded the V3 pt-BR weights fine with transformers 5.2.0, even though the Space pins 4.46.3.
- A pip-installed `chatterbox` package shadows the Space's code if you import `chatterbox.src.chatterbox`. Put `space/chatterbox/src` first on `sys.path` instead.

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
