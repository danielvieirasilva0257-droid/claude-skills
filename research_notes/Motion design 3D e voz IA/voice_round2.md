# Round 2: local pt-BR TTS on CPU + word-level forced alignment for Remotion captions (2026-10-08)

> STATUS: COMPLETE for this round (2026-10-09). Open items are listed in "PENDENTE / NÃO PESQUISADO" at the end.
>
> **3-line summary:**
> 1. **Local TTS on CPU.**
>    - Kokoro-82M (Apache-2.0; pt-BR voices pm_alex, pf_dora, pm_santa) runs at RTF 0.29–0.75 and is about as intelligible as the current edge voice once loanwords are respelled ("Éksel", "ép", "dilôudi").
>    - Chatterbox pt-BR (MIT) runs on CPU but at RTF 14–18 (about 15 min per 60 s take).
>    - Piper pt_BR is the fastest (RTF 0.07) but less intelligible, and all 4 voices are fine-tuned from non-commercial English base data.
> 2. **Captions.** Forced alignment of the known script with WhisperX (wav2vec2-pt, Apache-2.0) hit a median error of 17 ms at pause edges (79% within 1 frame at 30 fps). The current `wordAt()` heuristic is off by 209 ms on average (max 710 ms). The output type-checks as `@remotion/captions@4.0.250` `Caption[]`.
> 3. **Samples.** 28 loudness-matched MP3s plus `rotina_captions_alinhadas_whisperx.json` (1.1 MB) are in `samples/`. Gemini TTS (AI Studio) still needs a free API key created by the user; the API host is reachable from this container.
> Machine: Linux, 4 vCPU, 15 GB RAM, no GPU; system Python 3.13.16; uv 0.11.32; Node 22.22.0; ffmpeg 6.1.1.
> Labels: **[MEASURED]** = run in this container (command + versions given). **[ONLINE]** = claim from a web page / model card (linked). **[INFERENCE]** = my reasoning.
> Source audio for alignment tests: `/home/user/claude-skills/rotina-video/public/vo/NN.wav` (edge-tts `pt-BR-AntonioNeural`, 48 kHz mono s16), texts from `src/explainer/timeline.ts` (VO array). Project files were NOT modified.

## Q1. Kokoro-82M (kokoro-onnx) — pt-BR voices, CPU speed, pronunciation, license

### Takeaway
Kokoro v1.0 has 3 Brazilian Portuguese voices: `pf_dora`, `pm_alex` and `pm_santa`.

**Speed on this 4-CPU box:**
- **RTF ≈ 0.29 with the fp32 ONNX model** when the machine was not saturated. The whole 13-line Rotina script (50 s of audio) took 14.7 s.
- With other sessions' renders running (load 5–8), RTF was 0.70–0.75 with onnxruntime thread spinning disabled, and 1.1–1.3 with default settings.
- The **int8 model was 4–6x slower** (RTF 1.2–1.8), so use fp32.

**License:** weights and voices are Apache-2.0, which allows commercial use.

**Intelligibility:** in the ASR check, intelligibility was close to the current edge-tts voice (word accuracy 0.86–0.90, versus 0.91 for edge).

**Weak point, loanwords:** the espeak-ng `pt-br` front end turns "Excel" into /esˈɛʊ/ ("esséu") and "deload" into /deloˈad/ ("de-lo-ÁD"). Respelling those words in the TTS input fixes them.

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
- **[MEASURED] Speed re-check under shared load** (2026-10-09; another session's Blender/Chrome renders were running; script `speed_recheck.py` / `kokoro_threads.py`). The full script is 50.2 s of audio:

| Setting | Wall (s) | CPU (s) | RTF | 1-min load avg |
|---|---|---|---|---|
| Default onnxruntime threads and spinning, run 1 | 55.4 | 104.9 | 1.10 | 6.6 |
| Default onnxruntime threads and spinning, run 2 | 64.8 | 111.7 | 1.29 | 7.8 |
| `intra_op_num_threads=2`, `session.intra_op.allow_spinning=0` | 35.2 | — | **0.70** | 5.3 |
| `intra_op_num_threads=4`, spinning off | 37.7 | — | 0.75 | 5.4 |

  The first run (RTF 0.29) was in the previous session; its load was not recorded, but it was consistent across voices. **Practical tip:** on a shared or busy machine, build the session yourself with spinning off (`Kokoro.from_session(ort.InferenceSession(path, so), voices)`).
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
- No clean idle-CPU re-measurement was possible this session, because other sessions kept the 4 vCPUs busy.
- The PyTorch `kokoro` package (misaki G2P, Python < 3.13) was not tested. Its pt-br phonemes could differ slightly from kokoro-onnx's.

## Q2. Piper pt_BR voices — CPU speed, quality, license per voice

### Takeaway
Piper has 4 pt_BR voices: faber, cadu and jeff (medium, 22.05 kHz) and edresson (low, 16 kHz). It is by far the fastest engine tested: faber synthesised the full script at **RTF 0.07** (3.4 s for 47.6 s of audio) even with the machine under load. The first, more contended run measured RTF 0.2–0.33.

Its **intelligibility was clearly worse** than Kokoro's in the ASR check (word accuracy 0.49–0.81 versus 0.86–0.90). jeff and faber garbled "Com o app Rotina" into "como web-routine" or "como é cotina". cadu was the best Piper voice.

The licenses are the catch:
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

- **[MEASURED] Re-check** (`speed_recheck.py`, load avg 7.1–7.4): faber synthesised the full script (47.6–47.8 s of audio) in **3.4–3.5 s wall, RTF 0.071–0.073**, using 13.1–13.4 s of CPU. The table above was slowed by contention and a cold first run, so treat it as an upper bound.
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
The Brazilian-Portuguese Chatterbox (MIT, "Multilingual V3 Single Language Pack, pt-BR") **does run on CPU, but slowly.**
- With 2 torch threads on this shared box it took **46.6 s for a 2.6 s line (RTF 17.9)** and **81.5 s for a 6.0 s line (RTF 13.7)**. A 60 s script would take about **14–18 minutes**.
- The first attempt with 4 threads, while other sessions' renders pushed load to 10–25, took **755 s for 2.6 s (RTF 290)**. That is thread oversubscription, not the model's real speed.

It is feasible for overnight or batch rendering of a final take, not for iterating on a script.

The ASR check found it intelligible: "app Rotina" and "deload" were heard correctly, and the only miss was "Escolha o" heard as "escolhe um". Every output carries Resemble's inaudible Perth watermark.

### Cited Findings
**[MEASURED] Runs** (Space-vendored `ChatterboxTTS`, `language_id='pt'`; reference `pt_br_f2.wav`; `exaggeration=0.5, cfg_weight=0.5, temperature=0.8`; seed 42; script `scripts/cbx_bench.py`):

| Run | Threads | 1-min load avg | Model load | Line | Audio | Synth wall | RTF |
|---|---|---|---|---|---|---|---|
| A (06:13–06:28) | 4 (+ default interop) | 10.8–25.6 (Blender/Chrome renders by other sessions) | 105.7 s (cold disk; I/O pressure "some avg10" about 53%) | 03 "Com o app Rotina, você tem." | 2.60 s | **755.4 s** | 290 |
| B (06:40–06:43) | **2** (`set_num_interop_threads(1)`) | 3.9–5.4 | 19.8 s (page-cached) | 03 | 2.60 s | **46.6 s** | **17.9** |
| B | 2 | 5.4 | — | 07 "...força, hipertrofia, resistência ou deload." | 5.96 s | **81.5 s** | **13.7** |

- **T3 (autoregressive) token rate**: about 5.5 s per token in run A versus **4.1–5.3 tokens/s** in run B. Speech runs at 25 tokens/s (S3 token rate), so T3 alone is about 5–6x slower than real time on 2 threads.
- For line 07, T3 took about 36 s (150 tokens). The rest (about 45 s) was S3Gen flow-matching plus the vocoder, so S3Gen is about half the cost.
- Run A was stopped after line 03 because it exceeded the ~8-minute budget. Run B covered 2 lines; the third ("teste") was skipped to save credits.
- Peak RSS was about 3.5 GB during loading, which fits easily in 15 GB.

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
- **[INFERENCE] Speed.** On an idle 4-vCPU machine, Chatterbox pt-BR will probably land around RTF 8–15. That is not measured: run B still shared the CPU, and 4 threads were not re-tested while idle. A 60 s Reel means roughly 10–15 minutes per full take, which works for a final render but is slow for A/B-testing deliveries.
- **[INFERENCE] Threads.** On any shared or busy CPU, set `torch.set_num_threads(2)` and `torch.set_num_interop_threads(1)`. Oversubscription made run A about 16–20x slower.
- **[INFERENCE] Choice of voice.** The only official pt-BR prompt is a female voice (`pt_br_f2.wav`). A male "locutor" needs a 6–10 s reference clip, and that clip must be one the user has rights to; their own voice with written consent works. Do NOT clone the edge-tts Antonio voice for ads. Chatterbox's MIT license covers the model, not the rights to the voice in the reference clip.
- **[INFERENCE] Licensing.** MIT weights plus the Space code mean commercial use is allowed. The watermark is not a restriction; it lets Resemble's detector flag the audio as AI-generated, which fits AI-disclosure norms.

### Gaps
- Not measured: idle-CPU speed with 4 threads, the full 3-line set, `exaggeration` / `cfg_weight` variants for an "ad" read, and male reference prompts.
- Not tested: the 23-language general checkpoint (`t3_mtl23ls_v3`, via pip `ChatterboxMultilingualTTS`) versus the pt-BR pack, and the ONNX export `ResembleAI/chatterbox-turbo-ONNX`, which is English-only per round 1 and may be faster.

## Q4. Word timestamps / forced alignment on CPU for pt-BR → Remotion `Caption`

### Takeaway
**Forced alignment of the known script with WhisperX (wav2vec2 pt model, CPU) is the method to use.**
- Accuracy on the 13 project WAVs: **median error 17 ms at acoustic pause edges, with 79% of edges within one 30 fps frame (33 ms) and 89% within two.**
- Speed: 93.7 s wall-clock for 51.7 s of audio on this overloaded box (RTF 1.8, i.e. slower than real time). CPU time was 142 s.
- It keeps the exact script spelling ("deload", "app Rotina").

The Whisper ASR word timestamps from faster-whisper are 2–3x worse at pause edges. They tend to start words 60–430 ms early, inside the preceding silence.

**The current character-position estimate (`wordAt` in timeline.ts) is the worst:** mean error 209 ms at pause edges, up to 710 ms.

The output converts directly to Remotion `Caption[]`. I verified the conversion by type-checking against `@remotion/captions@4.0.250` (the project's Remotion version) and running `createTikTokStyleCaptions`.

### Cited Findings
**[MEASURED] Ground truth used.**
- edge-tts 7.2.3 works from this container. Its WebSocket passes the proxy, despite the README's warning. I regenerated all 13 lines with the same voice and rate (`pt-BR-AntonioNeural`, `rate='+6%'`, `boundary='WordBoundary'`), which gives engine-reported word offsets: 142 words. Script: `scripts/edge_gt.py`.
- **The regenerated audio is the same as the project WAVs.** Normalised cross-correlation was 0.991–0.999. The project files are trimmed copies with the first 101–171 ms of the edge output cut off (per-file lag measured by cross-correlation), so ground truth = WordBoundary − lag.
- Second, objective reference: **acoustic pause edges**, from `ffmpeg silencedetect=noise=-40dB:d=0.08` on the project WAVs. That gives 38 boundary points: speech onset, end of speech, and both sides of each pause.
- Caveat: edge's WordBoundary values are themselves about 50 ms off the acoustic edges (mean 49.6 ms, median 46.6 ms, bias −31.6 ms, so they are early). They are a noisy reference. One "pause edge" (line 10, inside "car**t**ões") is actually a /t/ closure; it explains the 315 ms and 254 ms WhisperX maxima below.

**[MEASURED] Accuracy and speed** (scripts `align_wx.py`, `align_fw.py`, `eval_align.py`; all 13 project lines, 51.7 s of audio):

| Method | Error vs acoustic pause edges (n=38): mean / median / p90 / within 33 ms / within 67 ms | Word-start error vs edge WordBoundary (n=142): mean / median | Speed on this box (load avg 8–11 from other sessions) | Text in output |
|---|---|---|---|---|
| **WhisperX align, known text** (`jonatasgrosman/wav2vec2-large-xlsr-53-portuguese`, Apache-2.0) | **36 / 17 / 63 ms / 79% / 89%** (bias +31 ms) | 87 / 84 ms (+87 ms bias vs the early engine marks) | load 1.2 s (cached); 3.4–12.9 s wall per line; **93.7 s wall / 142 s CPU in total** | exact script |
| faster-whisper `small` int8, `word_timestamps=True` | 99 / 78 / 247 ms / 37% / 47% (bias −75 ms) | 51 / 38 ms | 5–8 s per line; about 90 s in total | ASR: "com **um** app", "**deloade**" (mapped back to script words) |
| faster-whisper `large-v3-turbo` int8 (`deepdml/faster-whisper-large-v3-turbo-ct2`, MIT) | 93 / 57 / 219 ms / 29% / 61% (bias −59 ms) | 48 / 36 ms | about 25 s per line (about 26 s CPU); **about 5.4 min in total** | ASR was word-perfect, including "deload" and "app Rotina" |
| **Current `wordAt()` heuristic** (char index / length × duration) | **209 / 174 / 438 ms / 13% / 26%**, max 710 ms | 138 / 89 ms, max 620 ms | instant | exact script |

- **Worst Whisper misses** were in the turbo model: "Mas" 434 ms early (line 02), "e" 393 ms early (line 11), "Tudo" 265 ms early (line 12), "Sua" 209 ms early (line 13). Whisper starts the word after a pause inside the silence. Excluding the /t/-closure reference error, WhisperX's worst real miss was "Sua" in line 13, 82 ms late.
- **Versions**:
  - WhisperX: whisperx 3.8.6 (installed with `--no-deps` into the Chatterbox venv: torch 2.6.0+cpu, transformers 5.2.0, plus `nltk` and `pandas`).
  - faster-whisper 1.2.1 with ctranslate2 4.8.2.
- **Gotchas found**:
  1. `whisperx.align` needs NLTK `punkt_tab`. NLTK ≥ 3.9's downloader refuses proxied fetches ("Security Violation [pathsec.urlopen]") unless you opt in with `NLTK_ALLOW_PROXIED_URLOPEN=1`. Instead I fetched `https://raw.githubusercontent.com/nltk/nltk_data/gh-pages/packages/tokenizers/punkt_tab.zip` with curl, unzipped it into `nltk_data/tokenizers/` and set `NLTK_DATA`.
  2. faster-whisper 1.2.1 cannot open files with PyAV 19.0.1 (`TypeError: open() got an unexpected keyword argument 'metadata_errors'`). Pass a 16 kHz float32 numpy array instead (`soundfile.read(path, dtype='float32')[0]`), or pin `av<16` (untested).
  3. whisperx 3.8.6's full dependency set pins torch ~= 2.8 and pulls pyannote-audio and triton. Only the alignment part is needed, so `--no-deps` plus `nltk` and `pandas` is enough.
- **Calling pattern** (WhisperX known-text alignment):
  `model, meta = whisperx.alignment.load_align_model(language_code='pt', device='cpu')`
  `r = whisperx.alignment.align([{'start': 0.0, 'end': dur, 'text': SCRIPT_LINE}], model, meta, audio16k, 'cpu')`
  `r['word_segments']` then holds `[{word, start, end, score}]`, one per script word. This held for all 13 lines (`n_wx == n_script`), and punctuation stays attached to the word ("rotina...", "Rotina,").

**[MEASURED] Remotion conversion** (`scripts/common_align.py::to_remotion_captions`, `build_captions.py`):
- In `@remotion/captions@4.0.250` (the version that matches the project's `remotion@4.0.250`; the project does not have this package installed yet), the type is exactly `type Caption = {text: string; startMs: number; endMs: number; timestampMs: number | null; confidence: number | null}`.
- In this version `TikTokPage` = `{text, startMs, tokens: {text, fromMs, toMs}[]}`. **It has no `pageBreakAfter`, no `durationMs` and no `breakOnSilenceAfterMilliseconds`**; per round 1 those arrived in 4.0.514+.
- **Conversion per word i of line L:**
  `{text: (i===0 && L===0 ? '' : ' ') + word, startMs: round(VO[L].start*1000 + start*1000), endMs: round(VO[L].start*1000 + end*1000), timestampMs: round(VO[L].start*1000 + (start+end)/2*1000), confidence: score}`
  - Offsetting by `VO[L].start` turns per-line times into video times.
  - The leading space is required by `createTikTokStyleCaptions`.
- Output: 142 captions saved to `samples/rotina_captions_alinhadas_whisperx.json` (15.6 KB). First entries: `{"text":"Controle","startMs":300,"endMs":741,"timestampMs":520,"confidence":0.786}`, then `{"text":" da","startMs":761,"endMs":861,...}`.
- **Type check:** `tsc --strict` with `resolveJsonModule` on `const caps: Caption[] = captions` (imported JSON) **passed**.
- **Runtime:** `createTikTokStyleCaptions({captions, combineTokensWithinMilliseconds: 1200})` gave 35 pages, but some pages straddle VO lines (e.g. "celular? Você tem seus"). `combineTokensWithinMilliseconds: 0` gives 142 single-word pages. **Paging each VO line separately** (filter captions by line, call `createTikTokStyleCaptions` per line, then `flatMap`) gives 40 clean pages ("Controle da sua rotina...", "em planilhas de Excel, no", "celular?", "Você tem seus treinos montados", ...). Script: `node_caps/perline.cjs`.

**[ONLINE] Licenses of the alignment and ASR models** (HF API `cardData.license`):
- `jonatasgrosman/wav2vec2-large-xlsr-53-portuguese` **apache-2.0**, 5.5M downloads. Alternatives: `Edresson/wav2vec2-large-xlsr-coraa-portuguese` apache-2.0; `lgris/wav2vec2-large-xlsr-open-brazilian-portuguese-v2` apache-2.0.
- `Systran/faster-whisper-small` mit; `deepdml/faster-whisper-large-v3-turbo-ct2` mit; `ggerganov/whisper.cpp` mit.
- whisperx is BSD-2-Clause, faster-whisper MIT, ctranslate2 MIT (PyPI metadata).

### Inferences
- **[INFERENCE] Recommended caption pipeline for any TTS** (Kokoro, Chatterbox, Gemini, ElevenLabs without timestamps):
  1. Render the VO lines.
  2. Run `align_wx.py` with the exact script text. If loanwords were respelled for the TTS ("dilôudi"), align on the respelled text and map back to the display words by index (same word count).
  3. Run `build_captions.py` to get `public/captions.json`.
  4. In Remotion, page per VO line with `createTikTokStyleCaptions` and highlight the token where `fromMs <= t < toMs`.
  
  The same alignment also gives exact frames for "word hit" animations. It replaces `wordAt()`, whose 200–700 ms errors amount to 6–21 frames at 30 fps.
- **[INFERENCE] Speed.** On an idle 4-vCPU machine, alignment should take well under a minute for a 60 s script (142 CPU-seconds spread over 4 threads). Whisper ASR is only worth it when the text is unknown. If Remotion's own `@remotion/install-whisper-cpp` route is used, fix its word text against the script and expect the same early-onset bias as faster-whisper; that route was not tested here.

### Gaps
- whisper.cpp (`@remotion/install-whisper-cpp` with `--dtw`) was **not tested**, to save credits and because the CPU was saturated by other sessions. I expect Whisper-DTW-like accuracy, similar to faster-whisper's cross-attention timings, but that is unverified.
- MFA, stable-ts (archived) and ctc-forced-aligner were not tested.
- Timings are pessimistic: during these runs Blender and Chrome renders from other sessions kept the load average at 8–25 on 4 vCPUs.

## Q5. Listenable samples

### Takeaway
The samples folder holds 28 short MP3s plus the aligned captions JSON, 1.1 MB in total. Every MP3 is loudness-normalised so the A/B comparison is fair: `loudnorm=I=-16:TP=-1.5:LRA=11`, mono, 24 kHz, libmp3lame 48 kbps. Folder: `research_notes/Motion design 3D e voz IA/samples/`.

An automatic intelligibility proxy (faster-whisper small "listening" to each clip) ranks the engines **edge original ≈ Chatterbox pt-BR ≈ Kokoro > Piper cadu > Piper edresson > Piper faber > Piper jeff**. Naturalness and the "ad energy" still need human ears.

### Cited Findings
**[MEASURED] Files**:

| Group | Files |
|---|---|
| Reference (current voice, from the project WAVs) | `edge_antonio_ORIGINAL_linha01.mp3`, `_linha03`, `_linha07` |
| Kokoro pm_alex | `kokoro_pm_alex_linha01/03/07.mp3`, `kokoro_pm_alex_teste.mp3`; respelled `kokoro_pm_alex_linha01_respell`, `_linha07_respell`, `_teste_respell`; **`kokoro_pm_alex_roteiro_completo.mp3`** (the whole 50 s script in one call, 302 KB) |
| Kokoro pf_dora | `kokoro_pf_dora_linha03`, `_linha07`, `_linha07_respell`, `_teste_respell` |
| Kokoro pm_santa | `kokoro_pm_santa_linha03`, `_linha07` |
| Piper | `piper_faber_linha01/03/07`, `piper_faber_teste`, `piper_cadu_linha07`, `piper_cadu_teste`, `piper_jeff_linha07`, `piper_jeff_teste`, `piper_edresson_linha07` |
| Chatterbox pt-BR (female reference voice `pt_br_f2`) | `chatterbox_ptbr_vozf2_linha03`, `_linha07` |
| Captions | `rotina_captions_alinhadas_whisperx.json`: Remotion `Caption[]` for the whole video, 142 words (Q4) |

- Lines used:
  - linha01 = "Controle da sua rotina... em planilhas de Excel, no celular?"
  - linha03 = "Com o app Rotina, você tem."
  - linha07 = "Escolha o estilo de cada semana: força, hipertrofia, resistência ou deload."
  - teste = "O app Rotina organiza seu dia: Brasil, tia, PIX, deload."
- Respelled TTS input: Excel → "Éksel", app → "ép", deload → "dilôudi".

**[MEASURED] ASR intelligibility proxy** (faster-whisper small int8, `language='pt'`, beam 5; word accuracy = matched words ÷ reference words; script `asr_check.py`, results `out/asr_check.json`):

| System | Mean word accuracy (lines) | Notable mishearings |
|---|---|---|
| edge-tts Antonio (original) | 0.91 (01, 03, 07) | "deload" → "deloade"; "o" → "um" |
| Chatterbox pt-BR | 0.91 (03, 07) | "Escolha o" → "escolhe um" ("deload" heard correctly) |
| Kokoro pf_dora | 0.90 | "deload" → "deluado"; "app Rotina" → "aprotine" |
| Kokoro pm_alex respelled | 0.89 | "dilôudi" heard as "de load" (the English word, intended); "app Rotina" now correct |
| Kokoro pm_alex / pm_santa | 0.86 / 0.86 | "Rotina" → "rotchina" / "hotshina" (strong palatal tʃ), "deload" → "deloado", "app Rotina" → "aprotin(o)" |
| Piper cadu | 0.81 | "hipertrofia" → "e petrofia"; test sentence 0.50 |
| Piper edresson | 0.75 | "deload" → "delight", "Rotina" → "routine" |
| Piper faber | 0.62 | "Com o app Rotina" → "como web-routine", "deload" → "the lodge", "Controle" → "conta-lhe" |
| Piper jeff | 0.49 | "Controle da" → "quanto óleo a", "deload" → "voo de luagem" |

- "Excel" in line 01 was transcribed correctly for every Kokoro voice despite the "esséu" phonemes. Whisper's language model probably filled it in, so listen to it.

### Inferences
- **[INFERENCE]** Of the local, commercially clean options, **Kokoro (pm_alex or pf_dora) with respelled loanwords** is the practical default: fast, Apache-2.0, and as intelligible as the current voice. **Chatterbox pt-BR** is the candidate for a more natural or expressive read if 10–20 minutes of CPU per 60 s take is acceptable and a licensed male reference clip is available. Piper is fast but less intelligible and has licensing doubts (Q2).
- **[INFERENCE]** The ASR proxy measures intelligibility, not naturalness. A voice can score well and still sound robotic. The user should A/B the MP3s against `edge_antonio_ORIGINAL_*` by ear before switching.

### Gaps
- No samples for a male Chatterbox voice (no licensed male pt-BR reference available) or for Gemini, ElevenLabs or Azure (no keys).

## PENDENTE / NÃO PESQUISADO

1. **Gemini TTS pt-BR in Google AI Studio (suggested by the user). Not tested: it needs an API key, and I did not create one.** What the user needs:
   - **Key.** Sign in at aistudio.google.com with a Google account and create a free Gemini API key (Get API key). Keep it private: put it in an env var `GEMINI_API_KEY`, never in the repo.
   - **[MEASURED] Reachability.** `generativelanguage.googleapis.com` is reachable from this container through the proxy. A request with a placeholder key returned HTTP 400 `API_KEY_INVALID`, so a real key should work here.
   - **[ONLINE] Models and price** ([pricing](https://ai.google.dev/gemini-api/docs/pricing)):
     - "Free of charge" Free Tier for `gemini-3.8-flash-tts`, `gemini-3.8-flash-lite-tts`, `gemini-3.1-flash-tts-preview` and `gemini-2.5-flash-preview-tts`. `gemini-2.5-pro-preview-tts` is "Not available" on Free.
     - Paid 3.8 Flash TTS: $0.50/M text in, $9.00/M audio out until 2026-12-31, doubling from 2027-01-01.
     - **Free-plan content is "used to improve our products"** (not on paid), so unreleased ad copy may be seen by Google; see round 1 terms.
   - **[ONLINE] How to call it** ([speech-generation docs](https://ai.google.dev/gemini-api/docs/speech-generation)):
     - `POST https://generativelanguage.googleapis.com/v1beta/interactions`
     - Header `x-goog-api-key: $GEMINI_API_KEY`
     - Body `{"model":"gemini-3.8-flash-tts","input":[{"type":"user_input","content":[{"type":"text","text":"..."}]}],"response_format":{"type":"audio"},"generation_config":{"speech_config":[{"voice":"Kore"}]}}`
     - Output is WAV, 24 kHz mono 16-bit.
     - "The TTS models detect the input language automatically". The language table lists "Portuguese" with **no pt-BR locale**, so add a style prompt asking for a Brazilian accent (e.g. "locutor publicitário brasileiro, sotaque paulistano, animado").
     - 30 prebuilt voices, e.g. Puck "Upbeat", Fenrir "Excitable", Charon "Informative", Kore "Firm", Orus "Firm", Algenib "Gravelly", Sadachbia "Lively".
     - The docs mention no word timestamps, so run the Q4 aligner on the audio.
   - **Test to run once the key exists:** synthesise lines 01, 03 and 07 plus the test sentence with 3–4 male voices (Puck, Fenrir, Orus, Charon), then run `align_wx.py` and the ASR check from this round on the outputs.
2. **whisper.cpp via `@remotion/install-whisper-cpp` (Remotion's official route) was not tested.** That means no build-time or `--dtw` accuracy numbers. *Next:* `npx @remotion/install-whisper-cpp@4.0.250`, then `installWhisperCpp({to, version})`, `downloadWhisperModel({model:'small'})` and `transcribe({tokenLevelTimestamps:true, language:'pt'})`, followed by `toCaptions()`. Compare against the edge ground truth with `eval_align.py`. Expect Whisper-like early onsets after pauses.
3. **Idle-CPU speed numbers.** Other sessions' Blender/Chrome renders kept the 4 vCPUs busy (load 5–25) during this round. Not measured on an idle machine: Kokoro (only the earlier RTF 0.29), Chatterbox with 4 threads, and WhisperX alignment wall time.
4. **Chatterbox pt-BR, further tests:** a male reference voice (licensed clip), ad-style settings (`exaggeration` 0.7–1.0, `cfg_weight` 0.3), the "teste" sentence, the general 23-language checkpoint versus the pt-BR pack, and long-form consistency across a 60 s script (the Space caps input at 300 characters per call).
5. **Kokoro PyTorch package** (`kokoro` 0.9.4 + misaki, Python < 3.13). Its pt-br G2P and quality were not compared with kokoro-onnx, and the `en`-style word timestamps it gives for English do not apply to pt.
6. **Piper licensing.** Find out whether OHF / Nabu Casa have published a position on lessac-finetuned voices (faber, cadu, jeff), and whether a from-scratch CC0 pt_BR voice exists or is planned.
7. **Human listening test.** None of the quality conclusions are by ear. The user should rate the samples for naturalness and "ad energy", ideally blind.
8. **Paid or online engines from round 1** (ElevenLabs v4, Azure, Cartesia) still need keys for an A/B on the same lines. They can reuse this round's alignment and ASR scripts unchanged.
9. **Remotion version note.** The project is on 4.0.250, so `@remotion/captions` must be installed at exactly `4.0.250`. Newer conveniences (`pageBreakAfter`, `breakOnSilenceAfterMilliseconds`) need a Remotion upgrade to 4.0.514+ (round 1 source), which was not attempted.

**Where everything is** (scratchpad, not in the repo): `/tmp/claude-0/-home-user-claude-skills/a0fff76b-036f-52aa-aae0-78ee08fe2860/scratchpad/r2/`.
- `scripts/` holds `kokoro_bench.py`, `kokoro_respell.py`, `piper_bench.py`, `cbx_bench.py`, `edge_gt.py`, `align_wx.py`, `align_fw.py`, `eval_align.py`, `build_captions.py`, `asr_check.py` and `common_align.py`.
- `out/` holds the raw WAVs, the JSON results and `eval_summary.json`.
- `node_caps/` holds the TypeScript and Node checks.

The scratchpad may be deleted when the session ends. The samples and the captions JSON were copied into the repo's research_notes folder.
