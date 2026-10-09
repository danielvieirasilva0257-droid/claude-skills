# Teste da voz Gemini (Google AI Studio), 09/10/2026

Chave fornecida pelo usuário. Ela fica guardada só no container, em `/root/.config/rotina/gemini.key` (permissão 600), **nunca no repositório**. Como o container é temporário, numa sessão nova é preciso passar a chave de novo.

## Resultados (MEDIDOS)

- **A chave funciona.** `GET https://generativelanguage.googleapis.com/v1beta/models` com o cabeçalho `x-goog-api-key` respondeu HTTP 200, com 62 modelos.
- **Modelos de voz disponíveis:**
  - `gemini-3.8-flash-tts`, `gemini-3.8-flash-lite-tts`, `gemini-3.1-flash-tts-preview`;
  - `gemini-2.5-flash-preview-tts`, `gemini-2.5-pro-preview-tts`;
  - áudio nativo: `gemini-2.5-flash-native-audio-*`.
- **Modelos de música (Lyria) disponíveis:** `lyria-3.5`, `lyria-3-clip-preview`, `lyria-3-pro-preview`, `lyria-realtime-exp`. Ainda não testados.
- **Chamada que funcionou:**
  - `POST /v1beta/models/gemini-3.8-flash-tts:generateContent`
  - corpo `{"contents":[{"parts":[{"text": ROTEIRO}]}],"generationConfig":{"responseModalities":["AUDIO"],"speechConfig":{"voiceConfig":{"prebuiltVoiceConfig":{"voiceName":"Puck"}}}}}`
  - A resposta vem em `inlineData`, base64, `audio/wav` PCM 16-bit 24 kHz mono. Leia como WAV, não como PCM cru.
  - Cerca de 7–8 s por pedido.
- **Cuidado com instruções de estilo:**
  - O `gemini-3.8-flash-tts` **lê em voz alta** qualquer instrução colocada no texto, tanto em português ("Fale em português do Brasil… :") quanto em inglês ("Say in an energetic … voice:").
  - O `systemInstruction` é recusado: "Developer instruction is not enabled for this model".
  - **Solução:** enviar só o roteiro e escolher a voz pelo estilo dela.
- **Abertura do roteiro Rotina** (linhas 01–03):

  | Voz | Estilo da voz | Duração |
  |---|---|---|
  | Puck | animada | 12,0 s |
  | Fenrir | empolgada | 16,8 s |
  | Orus | firme | 13,6 s |
  | Charon | informativa | 14,8 s |

  A transcrição automática (faster-whisper small) confirmou o texto correto nas 4. "Excel" saiu bem pronunciado. A voz edge-tts atual faz as mesmas linhas em cerca de 11 s.
- **Amostras:** `samples/gemini_<Voz>_abertura.mp3`, normalizadas em −16 LUFS.

## Termos

Na camada gratuita, o conteúdo enviado é usado para melhorar os produtos do Google. Na camada paga, não.

## PENDENTE / NÃO PESQUISADO

- **Estilo:** testar como controlar o estilo sem a voz ler a instrução. Opções:
  - a rota `/v1beta/interactions` da documentação;
  - tags no texto;
  - o modelo `gemini-2.5-pro-preview-tts`, que é pago.
- **Vozes:** testar outras, como Sadachbia ("animada") e Algenib ("rouca").
- **Roteiro completo:** gerar as 13 falas com a voz escolhida pelo usuário e alinhar as palavras com WhisperX (`align_wx.py` da rodada 2).
- **Música:** testar o Lyria (`lyria-3.5` / `lyria-3-clip-preview`) para a trilha, com BPM definido.
- **Comparação:** fazer o A/B com Kokoro, ElevenLabs v4 e Azure usando as mesmas falas.
