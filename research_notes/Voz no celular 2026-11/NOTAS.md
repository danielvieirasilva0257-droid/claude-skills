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

## Samples

`samples/kokoro-82m_<voz>_ia-do-app.mp3`: the same 3 assistant lines (agenda de hoje, números do mês com a comparação, confirmação de agendamento) in pf_dora, pm_alex, pm_santa.

## Sources

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
