---
name: voz-pt-br
description: Gera narração em português do Brasil para vídeos (Gemini TTS, Kokoro local, edge-tts para rascunho), escolhe a voz pela licença e pela qualidade, acelera e encaixa a fala na duração do vídeo, cria legendas sincronizadas palavra por palavra (WhisperX → Caption[] do Remotion) e confere o texto por transcrição automática. Use quando precisar de locução, voz de IA, narração de anúncio ou legendas sincronizadas com a fala.
---

# Voz em pt-BR + legendas sincronizadas

Scripts prontos em `scripts/`. Os aprendizados novos ficam em `APRENDIZADOS.md` (leia depois deste arquivo).

## 1. Escolha a voz pela licença primeiro

| Opção | Qualidade pt-BR | Pode em anúncio pago? | Custo | Quando usar |
|---|---|---|---|---|
| **Gemini TTS** (`scripts/gemini_tts.py`) | boa. Femininas, pelo ouvido do usuário: **Leda** (animada), **Laomedeia** (sensata), **Zephyr** (calma e direta). Masculinas: Puck, Fenrir, Orus, Charon | sim (termos do Google; no gratuito o Google usa o conteúdo) | grátis: **10 pedidos/dia por modelo** e por conta | narração final (a Leda foi a voz do Rotina v2) |
| **Kokoro-82M** (`scripts/kokoro_tts.py`) | boa; pm_alex, pm_santa, pf_dora | **sim** (Apache-2.0) | grátis, roda aqui na CPU | sem chave e sem limite |
| **ElevenLabs v4** | a melhor candidata (ranking em inglês) | só em plano pago | ~US$6+/mês | quando o usuário pagar |
| **Azure Speech** (camada gratuita) | vozes neurais da Microsoft | sim | 0,5 M caracteres/mês grátis | alternativa oficial ao edge-tts |
| **edge-tts** | boa (pt-BR-AntonioNeural) | **não**: sem termos de uso comercial | grátis | só rascunho |
| Piper / Chatterbox | fraca / lenta | Piper: risco de licença | grátis | evitar |

Não existe teste cego de vozes em pt-BR. Faça um A/B com o roteiro real e deixe o usuário escolher de ouvido. Amostras prontas: `research_notes/Motion design 3D e voz IA/samples/`.

## 2. Gerar a narração

1. Escreva o roteiro com **uma fala por linha** num `falas.txt`. Uma fala = um momento do vídeo.
2. **Gemini** (recomendado: o roteiro inteiro num pedido só, porque a cota é de 10 pedidos por dia):
   ```bash
   python scripts/gemini_tts.py --voz Leda --falas falas.txt --juntar --saida roteiro.wav
   ```
   - **Chaves:** o script lê `GEMINI_API_KEY` e depois todos os arquivos `/root/.config/rotina/gemini*.key`, em ordem, **nunca do repositório**.
     - Se uma chave for recusada (401/403) ou acabar a cota do dia, ele tenta a próxima.
     - Num limite por minuto (429) ou em demanda alta (503), espera 25 s e tenta de novo uma vez.
     - Se der erro, nenhum arquivo é criado.
   - Mande **só o texto**. Qualquer instrução de estilo é lida em voz alta; o estilo vem da escolha da voz.
   - Uma fala por arquivo também funciona: `--falas falas.txt --pasta vo/`. Cada fala gasta um pedido.
   - Os modelos `gemini-3.8-flash-tts`, `gemini-3.8-flash-lite-tts` e `gemini-3.1-flash-tts-preview` têm cotas separadas.
3. **Kokoro:** `python scripts/kokoro_tts.py --voz pm_alex --falas falas.txt --pasta vo/ --modelos <pasta>`
   - Estrangeirismos precisam ser escritos como se falam. O dicionário `RESPELL` do script já troca "Excel" por "Éksel", "app" por "ép" e "deload" por "dilôudi".
4. **Falas separadas:** corte os silêncios das pontas e meça a duração. A linha do tempo do vídeo é montada com as durações reais.
   ```bash
   ffmpeg -i in.wav -af "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,apad=pad_dur=0.05" -ar 48000 -ac 1 out.wav
   ```

## 3. Acelerar e encaixar na duração do vídeo

Quando o vídeo tem uma duração fixa (por exemplo, 30 s), faça nesta ordem:

1. **Alinhe o roteiro na voz normal:**
   ```bash
   python scripts/alinhar_roteiro.py roteiro.wav falas.txt alinhamento_1x.json
   ```
2. **Estime a velocidade** antes de mexer no áudio:
   ```bash
   python scripts/apertar_pausas.py --estimar alinhamento_1x.json --alvo 30
   ```
   - Mostra a duração para cada velocidade, de 1,3x a 1,8x.
   - Referência: 139 palavras em 30 s exigiram 1,6x. Para uma fala mais calma, use umas 100 palavras a 1,3x.
   - Se o pedido trouxer duração e velocidade e as duas não couberem juntas, diga ao usuário qual foi a escolha.
3. **Acelere com `atempo`** (não com `rubberband`):
   ```bash
   ffmpeg -i roteiro.wav -af "aresample=48000:resampler=soxr,atempo=1.6" voz_1.6x.wav
   ```
   O `atempo` manteve 97% de acerto na transcrição; o `rubberband` caiu para 93–94% e trocou palavras.
4. **Alinhe de novo, agora na voz acelerada:**
   ```bash
   python scripts/alinhar_roteiro.py voz_1.6x.wav falas.txt alinhamento.json
   ```
5. **Aperte as pausas** e gere a faixa final mais o `voz.json`, com o tempo de cada palavra no vídeo:
   ```bash
   python scripts/apertar_pausas.py voz_1.6x.wav alinhamento.json voz_final.wav voz.json --inicio 0.10 --depois "3=0.26,5=0.24"
   ```
   - **Pausas padrão:** 0,18 s entre falas, 0,13 s entre frases e no máximo 0,10 s nas vírgulas.
   - Use `--depois` para pausas maiores nas trocas de seção.
   - Os cortes só acontecem no silêncio.
   - O `voz.json` vira a fonte de **todos** os tempos do vídeo: animação, música e efeitos sonoros.

## 4. Conferir sem ouvir

O Claude não ouve áudio. Confira cada etapa com transcrição automática:
```bash
python scripts/conferir_voz.py voz_final.wav falas.txt --modelo <large-v3-turbo ou small>
```
- **Referência** (Rotina v2): voz original 97,1%, voz a 1,6x 97,1% e mixagem final com música e efeitos 97,8%.
- **Normal:** o Whisper às vezes some com artigos ("a sua" vira "sua"). Preocupe-se abaixo de ~95%.
- **Rode também no áudio final do vídeo.** É o teste de que a música não está cobrindo a voz.

## 5. Mixagem

A voz vai por cima da música, com a música e os efeitos abaixando sozinhos (ducking). Veja a skill `trilha-e-mixagem` (`skills/trilha-e-mixagem/SKILL.md`, script `mixar_com_efeitos.py`).

## 6. Legendas sincronizadas (palavra por palavra)

- **Narração num arquivo só:** `alinhar_roteiro.py ... --legendas legendas.json --inicio <segundo em que a voz começa no vídeo>`.
- **Falas em arquivos separados:**
  1. Monte um `falas.json`: `[{"arquivo": "vo/01.wav", "texto": "Fala 1", "inicio_s": 0.3}, ...]`. O `inicio_s` é o momento em que a fala começa no vídeo.
  2. Rode `python scripts/alinhar_legendas.py falas.json legendas.json`.
- O resultado já sai no formato `Caption[]` do `@remotion/captions`.
- **Medido:**
  - erro mediano de 17 ms, com 79% das palavras dentro de 1 quadro;
  - estimar pela posição das letras erra cerca de 174 ms;
  - um arquivo de 32 s e outro de 52 s alinharam num segmento só.
- **Instalação** (está no topo de `alinhar_legendas.py`): torch CPU e `whisperx==3.8.6` com `--no-deps`, mais `nltk` e `pandas`.
- **Dados do NLTK:** neste container, baixe o `punkt_tab` com `NLTK_ALLOW_PROXIED_URLOPEN=1 python -c "import nltk; nltk.download('punkt_tab', download_dir='nltk_data')"` e rode com `NLTK_DATA=nltk_data`.
- No Remotion, agrupe as legendas com `createTikTokStyleCaptions`. Monte as páginas por fala, para nenhuma página atravessar duas falas.
- **Em Reels muito rápidos** (fala a 1,6x), em vez da transcrição inteira, mostre só palavras-chave, entrando no quadro em que são ditas.

## 7. Acabamento da voz

- Volume final do vídeo: −14 LUFS, com pico em −1 a −1,5 dBTP. Isso é feito na mixagem.
- Para comparar vozes de forma justa, normalize as amostras no mesmo volume, por exemplo `loudnorm=I=-16`.
