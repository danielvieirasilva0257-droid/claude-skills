# Voz no celular para o App Barbeiros (pesquisa de 21/11/2026)

Pergunta do Daniel: dá para usar o ElevenLabs (ou um repositório de engenharia reversa dele), baixar um modelo de voz e rodar dentro do app junto com o Gemma 4? O Gemma 4 já tem voz?

## Findings (raw)

- **Gemma 4 E2B / E4B listen but do not speak.** Google docs: E2B, E4B (and 12B Unified) are trained for multilingual speech recognition, speech translation and speech understanding; audio input max 30 s; every documented output is text. So the app needs a TTS for the answer.
  - https://ai.google.dev/gemma/docs/capabilities/audio
- **ElevenLabs models are not downloadable.** They run only on ElevenLabs servers (official API, paid per use, best pt-BR quality in our earlier ranking; voice design/clone available on paid plans).
- **"Reverse engineered" repos found:**
  - `GaspardCulis/elevenlabs-unleashed` (MIT, ~193 stars): creates accounts programmatically and rotates API keys when the free limit is hit. Uses ElevenLabs servers without paying; against their terms; can be blocked anytime. Not usable in a commercial app. Not tested on purpose.
  - `gastonmorixe/elevenlabs-reader-cli`: uses the private API of the ElevenLabs Reader iOS app with Firebase tokens from the phone. Same problem.
  - Neither downloads a model.
- **On-device TTS with pt-BR:** Kokoro-82M (Apache-2.0) has Brazilian Portuguese voices `pf_dora` (female), `pm_alex`, `pm_santa` (male).
  - React Native: `react-native-executorch` 0.11.1 (Software Mansion) has a Kokoro TTS hook with a Portuguese package (~332 MB, 24 kHz) and `stream()` that yields audio chunks (lower time to first audio). Peer deps fit the app (RN >= 0.83, worklets >= 0.10 < 0.14; app has RN 0.88.1, worklets 0.13.0). Exact Portuguese voice ids in that package not confirmed yet.
  - Alternative: `react-native-sherpa-onnx` 0.4.4 (XDcobra), Kokoro multi-lang v1.0 with pf/pm speakers.
  - Measured here (container, 4 CPUs, kokoro-onnx fp32): 3 lines = ~17.4 s of audio in ~7.5 s including model load. Phone speed not measured.
- **Speech to text options:** keep the phone's own recognizer (`expo-speech-recognition`, already in the app, live transcript, on-device on recent Android/iOS); or Gemma 4 audio input directly (one model less, 30 s limit, no live transcript; check if `react-native-litert-lm` exposes audio input); or Whisper via executorch / sherpa-onnx.
- **Gemma 4 runtime:** `react-native-litert-lm` 0.8.2 (LiteRT-LM, Expo plugin, tool calling, runtime download with resume). Gemma 4 E2B file ~2.6 GB.

## Proposed pipeline

```
fala do barbeiro
  -> reconhecimento de voz do celular (texto ao vivo)
  -> Gemma 4 E2B no celular (pensa e chama as funções do app; mudança só com confirmação)
  -> Kokoro pt-BR no celular, frase por frase enquanto o Gemma escreve
  -> se o barbeiro voltar a falar, a voz para
reserva: IA da nuvem (agente atual) e a voz do próprio celular (expo-speech)
```

Total download on the phone: ~2.6 GB (Gemma 4 E2B) + ~0.33 GB (Kokoro) ≈ 3 GB, Wi-Fi only.

## Comparison of on-device TTS with Portuguese (21/11/2026, second round)

Same 3 assistant lines for every model. Word accuracy = faster-whisper small, with numbers in the transcript turned into pt-BR words (the skill's `conferir_voz.py` counts "R$ 7.465" vs "sete mil..." as errors; all models were 64-76% there for that reason only). Gen time = ~20 s of audio on this container (4 CPUs, model already loaded).

| Model | Size | License | Portuguese | Voices | Mobile path | Words | Gen time |
|---|---|---|---|---|---|---|---|
| Kokoro-82M | 82M params; 325 MB fp32 onnx (+28 MB voices) | Apache-2.0; pt phonemes via espeak-ng (GPL) | pt-BR | pf_dora, pm_alex, pm_santa | react-native-executorch (Portuguese pack ~332 MB, stream), sherpa-onnx | 100% | ~4 s |
| Kitten TTS 2 nano | 17M per language; 17.4 MB int8 / 8.8 MB int4 per language | Apache-2.0; pt phonemes via espeak-ng (misaki EspeakG2P) | pt-BR | Juliana, Larissa, Gustavo, Caio | ONNX Runtime; text front end must be ported | 94-100% | ~1.7 s |
| Kitten TTS 2 mini | 82M, 16 languages; 82.7 MB int8 / 47.5 MB int4 | Apache-2.0 | pt-BR | Beatriz, Camila, Rafael, Thiago (+ English voices speaking pt) | ONNX Runtime; same | 98% | ~6 s |
| Supertonic 3 | 99M; 386 MB download | code MIT, weights OpenRAIL-M (use restrictions); repo archived 09/2026 | "pt" (variant not stated) | F1-F5, M1-M5 | ONNX, character input (no phonemizer); iOS and Flutter examples | 91-100% | ~5-6 s |
| Pocket TTS (Kyutai) | 100M | code MIT, weights CC-BY-4.0 (credit); ungated repo has no voice cloning | "portuguese" (variant not stated) | 28 (rafael is the pt one) | PyTorch; community ONNX / LiteRT ports (~1x real time on Pixel 8a GPU) | 96-100% | ~13 s |
| tiny-voca-ptbr (SemFence) | 4.5M; 21.4 MB onnx | weights CC-BY-4.0 (credit SemFence, Gustavo Toledo), code Apache-2.0 | pt-BR only | F_s4, M_sm4 | ONNX; front end dizione-ptbr (Python) to port; runs in browser | official samples only | - |
| pivo-ptbr (SemFence) | 1.4M; 5.8 MB onnx | acoustic CC-BY-4.0, vocoder BSD-3, code Apache-2.0 | pt-BR only | F_s4, M_sm4 | same | official samples only | - |

Left out: Phonon 40M pt (pt-BR, ~75 MB, ~100 voices, Android/iOS guides, but CC BY-NC and gated), Piper pt-BR (non-commercial voices, GPL engine), Chatterbox multilingual (500M, slow on CPU, watermark), Qwen3-TTS (0.6B+, needs GPU), NeuTTS (no Portuguese), XTTS-v2 / MMS-TTS / F5-TTS (non-commercial).

Notes:
- Installing SemFence's front end from GitHub (pip from git) was blocked by this session's safety rule; only their published audio samples were used.
- Hugging Face downloads need `huggingface.co` plus the file CDN (`us.aws.cdn.hf.co`); both were added to the environment.
- faster-whisper 1.x with the installed `av` failed to open files (`metadata_errors`); pass a numpy array (ffmpeg to f32le 16 kHz) instead.

## Samples

`samples/<modelo>_<voz>_ia-do-app.mp3`: the same 3 assistant lines (agenda de hoje, números do mês com a comparação, confirmação de agendamento): Kokoro (pf_dora, pm_alex, pm_santa), Kitten TTS 2 mini (Beatriz, Rafael), Kitten TTS 2 nano (Larissa, Gustavo), Supertonic 3 (F2, M1), Pocket TTS pt (rafael, vera). `samples/<modelo>_F-e-M_amostra-oficial.mp3`: the authors' own samples for tiny-voca-ptbr and pivo-ptbr (other sentences).

## Sources

- https://huggingface.co/KittenML/kitten-tts-2-mini and https://huggingface.co/KittenML/kitten-tts-2-nano
- https://github.com/supertone-inc/supertonic and https://huggingface.co/Supertone/supertonic-2
- https://github.com/kyutai-labs/pocket-tts and https://huggingface.co/kyutai/pocket-tts-without-voice-cloning
- https://huggingface.co/semfence/tiny-voca-ptbr and https://huggingface.co/semfence/pivo-ptbr
- https://huggingface.co/gradium/phonon-40m-pt
- https://huggingface.co/OpenVoiceOS/pipertts_pt-BR_dii

- https://ai.google.dev/gemma/docs/capabilities/audio
- https://repos.ecosyste.ms/hosts/GitHub/repositories/GaspardCulis%2Felevenlabs-unleashed
- https://awesome.ecosyste.ms/projects/github.com%2Fgastonmorixe%2Felevenlabs-reader-cli
- https://github.com/elevenlabs/elevenlabs-python/
- https://docs.swmansion.com/react-native-executorch/docs/extensions/text-to-speech
- https://docs.swmansion.com/react-native-executorch/docs/next/hooks/natural-language-processing/useTextToSpeech
- https://github.com/XDcobra/react-native-sherpa-onnx
- https://k2-fsa.github.io/sherpa/onnx/tts/all/Chinese-English/kokoro-multi-lang-v1_0.html
- https://github.com/hung-yueh/react-native-litert-lm
- https://huggingface.co/litert-community/gemma-4-E2B-it-litert-lm
