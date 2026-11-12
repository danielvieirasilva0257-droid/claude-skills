# Aprendizados: voz-pt-br

Adendos datados. O mais novo fica embaixo. A skill original continua no `SKILL.md`.

## 09/10/2026: Gemini TTS (Google AI Studio)

- **A chave do AI Studio funciona deste container.**
  - A chamada que funciona é `POST /v1beta/models/gemini-3.8-flash-tts:generateContent`, com `responseModalities: ["AUDIO"]` e `prebuiltVoiceConfig.voiceName`.
  - A resposta vem em `audio/wav`, 24 kHz mono. Leia como WAV, não como PCM cru.
- **O modelo lê em voz alta as instruções de estilo** ("Fale como locutor…", "Say in an energetic voice:"), e o `systemInstruction` é recusado. Mande só o roteiro.
- **Cota gratuita:** `GenerateRequestsPerDayPerProjectPerModel-FreeTier = 10`, ou seja, 10 pedidos por dia por modelo. Ao estourar, a API devolve HTTP 429 com `retryDelay` de várias horas.
- **Abertura do Rotina (linhas 01–03), duração por voz:** Puck 12,0 s, Orus 13,6 s, Charon 14,8 s, Fenrir 16,8 s. A transcrição automática confirmou o texto em todas.
- **A mesma chave dá acesso à música Lyria** (`lyria-3.5`, `lyria-3-clip-preview`, `lyria-3-pro-preview`, `lyria-realtime-exp`), que ainda não foi testada.

## 09/10/2026: vozes locais e legendas (rodada 2 da pesquisa)

- **Kokoro fp32** (CPU): o roteiro de 50 s saiu em cerca de 15 s com a máquina livre. O modelo int8 é 4–6 vezes mais lento aqui.
- **Inteligibilidade** medida por transcrição automática: Kokoro 0,86–0,90, edge-tts 0,91, Chatterbox 0,91, Piper 0,49–0,81.
- **Piper:** as vozes pt_BR derivam de vozes com dados só para pesquisa ou não comerciais. Evite em anúncio.
- **Chatterbox pt-BR** (MIT): cerca de 15 min de CPU por 60 s de fala. Só tem voz oficial feminina e põe marca d'água no áudio.
- **WhisperX alinhando o roteiro conhecido** é muito melhor que transcrever: 17 ms de erro mediano, contra 57–78 ms dos modelos Whisper.
- **Detalhes e números completos:** `research_notes/Motion design 3D e voz IA/voice_round2.md` e `gemini_tts_teste.md`.

## 09/10/2026: vozes femininas do Gemini e nome dos arquivos

- **Preferência do usuário:** voz **feminina**.
- **Testadas** no `gemini-3.8-flash-tts`, todas com o texto certo segundo a transcrição: Zephyr, Despina, Autonoe, Pulcherrima, Leda, Aoede e Laomedeia. As amostras ficam em `research_notes/Motion design 3D e voz IA/samples/`.
- **Regra do usuário para os arquivos:** sempre `<modelo>_<voz>_<trecho>.<ext>`, por exemplo `gemini-3.8-flash-tts_Zephyr_abertura.mp3`.
- **Cota e limites:**
  - A cota grátis é **por conta ou projeto e por modelo**. Uma segunda chave, de outra conta, ganha mais 10 pedidos por dia em cada modelo.
  - Pedidos seguidos esbarram num limite por minuto (HTTP 429 depois de ~5) e às vezes em HTTP 503 por demanda alta. Espere 20–30 s entre os pedidos e tente de novo uma vez.
- **Chaves:** guarde em `/root/.config/rotina/gemini.key` e `gemini2.key`, com permissão 600 e **nunca no repositório**. Passe a chave com `GEMINI_API_KEY=$(cat ...)`.

## 09/10/2026: avaliação de ouvido do usuário (vozes femininas, `gemini-3.8-flash-tts`)

O Claude não ouve áudio, então esta é a referência para escolher a voz:

| Voz | Como o usuário ouviu | Melhor uso |
|---|---|---|
| **Leda** | animada | anúncio e Reels com energia: gancho e chamada para ação |
| **Laomedeia** | sensata | explicação e tutorial, quando o tom precisa passar confiança |
| **Zephyr** | calma e direta | institucional, instruções e passo a passo |

As outras (Despina, Autonoe, Pulcherrima e Aoede) não foram destacadas. As três acima são as favoritas.

## 09/10/2026: narração completa do Rotina v2 (Leda, 1,6x)

- **Chave que parou:** uma chave `AQ.` do AI Studio que funcionava começou a responder HTTP 401 `ACCESS_TOKEN_TYPE_UNSUPPORTED`. A outra chave seguiu funcionando.
  - Teste a chave antes com `GET /v1beta/models?pageSize=1` (header `x-goog-api-key`).
- **Aviso sobre o `gemini_tts.py`:** quando a API dá erro, o script deixa um arquivo `.wav` vazio, porque abre o arquivo antes de chamar a API. Apague o arquivo vazio antes de tentar de novo. (Uma correção no script é proposta de mudança da skill.)
- **Roteiro inteiro num pedido:** 13 falas, 139 palavras, saíram em 52,0 s (Leda). A transcrição automática (large-v3-turbo) confirmou o texto com 97% de acerto.
- **Acelerar sem perder clareza:**
  - O `atempo` do ffmpeg a 1,6x manteve 97,1% de acerto, igual à voz original.
  - O `rubberband` (várias configurações) caiu para 93,5–94,2% e trocou palavras ("deload" virou "download").
  - Use `atempo` para fala.
- **Encaixar no tempo:** a 1,5x, só a fala já passava de 31 s.
  - Para 30 s, foi preciso 1,6x e apertar as pausas por código (`compose_vo.py` na branch `rotina-video`):
    - 0,15–0,26 s entre falas;
    - 0,13 s entre frases da mesma fala;
    - no máximo 0,10 s nas vírgulas.
  - O corte é feito no silêncio, medido pela energia (−42 dB), com fade de 6 ms.
- **Alinhamento:** o WhisperX alinhou o arquivo de 32 s num segmento só, sem problemas. O tempo calculado pelas pausas e o alinhamento direto da faixa final diferiram 4 ms na mediana.
- **"bio" virou "Bill"** na transcrição do modelo grande. É só a pronúncia brasileira normal ("bíu"); o modelo pequeno e o modelo grande com o roteiro como dica ouviram "bio".
- **Conferir a mixagem final:** a transcrição do áudio final, com voz, trilha e efeitos, deu 97,8% de acerto. É um bom teste de que a música não está cobrindo a voz.

## 11/10/2026: proposta aprovada e salva no SKILL.md

- O Daniel aprovou a proposta com os aprendizados do Rotina v2. O `SKILL.md` agora incorpora tudo até 11/10/2026, já com os caminhos das pastas por categoria.

## 12/10/2026: Rotina v3 (Leda, 91 palavras)

- **Velocidade da Leda:** 91 palavras em 13 falas deram **41 s a 1,0x** (2,2 palavras por segundo). A estimativa de 2,67 da v2 errou para menos. Com `atempo` 1,1x e pausas apertadas: 28,3 s.
- **Chave:** a primeira chave do Gemini respondeu 401; o script passou sozinho para a segunda. Nenhuma chave entrou no repositório.
- **Transcrição (`conferir_voz.py`, modelo small):** 93,4% na voz sozinha e 95,6% no áudio final. Erros: "eu começo" virou "o começo", "Rotina" virou "rutina" e "anotou peso" saiu colado ("anotopeza"). O modelo `large-v3-turbo` quebrou no alinhamento de palavras do faster-whisper (`IndexError` em `find_alignment`); fique no small ou passe sem marcação de palavras.
- Detalhes: `projetos/rotina/PASSO-A-PASSO.md` (item 6) e `reports/Vídeo Rotina v3, skills e combos usados (2026-10-12).md`.

## 17/10/2026: ritmo da Leda a 1,0x e conferência de palavras curtas (Rotina v5 e v6)

- A Leda a 1,0x fala ~3,3 palavras/s dentro da fala; com 0,5 s entre falas, dá ~2,5 a 2,6 palavras/s no total (v5: 45 palavras em 17,8 s; v6: 94 palavras em 35,6 s).
- O Whisper small ouviu "Tudo num app só" como "Tudo não é piçó". O large-v3-turbo, num trecho curto (2 s), ouviu certo. Use o small para a passada geral e o turbo nos trechos com diferença. Detalhes: `projetos/rotina/PASSO-A-PASSO.md` (item 9).
