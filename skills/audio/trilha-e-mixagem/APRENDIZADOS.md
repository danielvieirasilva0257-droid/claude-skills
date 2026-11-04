# Aprendizados: trilha-e-mixagem

Adendos datados. O mais novo fica embaixo.

## 08/10/2026: vídeo explicativo do Rotina (60 s)

- **A trilha numpy de 120 BPM ficou pronta em cerca de 8 s** de processamento. A estrutura foi conferida no espectrograma: intro com tique-taque, subida de 8 a 10 s, drop aos 10 s e impactos em 22, 36, 50 e 58 s.
- **Mixagem com `sidechaincompress` + `loudnorm=I=-14`:** o resultado mediu −13,8 LUFS integrado. Bom para Instagram.
- **Ajuste fino:** os cortes de seção foram encaixados nos compassos (a cada 2 s), e o fim de cada fala foi ajustado para não atravessar um impacto.
- **A falha principal foi a percepção, não a técnica.** O usuário achou a trilha sintetizada "básica". Para a próxima, prefira música licenciada para anúncio ou o Lyria, e deixe a trilha por código para rascunho ou para quando não houver orçamento.
- **Pesquisa completa** (licenças, números, cadeia ffmpeg): `research_notes/Motion design 3D e voz IA/music_sound_design.md`.

## 09/10/2026: trilha e efeitos do Rotina v2 (30 s)

- **Lyria:** a cota grátis é **zero**. A API respondeu "limit: 0 requests per day on Free Tier" para `lyria-3-clip-preview`, `lyria-3-pro-preview` e `lyria-3.5`, então é preciso um plano pago.
  - A chamada é pela Interactions API: `POST /v1beta/interactions` com `{"model": ..., "input": "prompt"}`. O áudio vem em `steps[].content[]` com `type: "audio"` (MP3, 44,1 kHz, 30 s no clip).
  - Script pronto: `audio/v2/lyria.py` na branch `rotina-video`.
- **Trilha em código melhorada** (`trilha_v2.py`, numpy + pedalboard): supersaw com polyBLEP, bumbo com envelope de pitch, palmas com 3 rajadas, sidechain "pumping", reverb e delay por envio, abertura de filtro na intro, rolos de caixa, risers e impactos.
  - Tudo travado na grade do vídeo: a virada cai no quadro em que a voz diz "Com o app Rotina".
  - Gera em 17 s.
- **Masterização:**
  - O `Limiter` do pedalboard tem um clipper em 0 dB e deixou o pico em 1,0.
  - Use `alimiter` + `loudnorm` em duas passadas no ffmpeg. Resultado: −14 LUFS e −1,2 dBTP.
- **ffmpeg:**
  - `amix=duration=first` cortou o fim da música, porque a primeira entrada (já com sidechain) era mais curta.
  - Use `duration=longest` + `apad=whole_dur=30` e `-t 30`. Confira que o arquivo tem exatamente 1.440.000 amostras.
- **Medir a voz contra o fundo:** mixe uma versão sem voz, mas com a voz ainda abaixando a música (`VOICE_DB=-120`), e compare as energias em cada fala.
  - A primeira mixagem deixou a chamada final só 3 dB acima do fundo.
  - **Correção:** música −8 dB, ducking com ratio 10, efeitos também abaixando sob a voz (ratio 3) e efeitos mais baixos nas palavras-chave.
  - **Resultado:** 12,2 dB no mínimo e 14,8 dB na mediana.
- **Efeitos no início de palavra mascaram a palavra:** um "slam" forte no mesmo quadro do início da fala cobre a consoante. Deixe esses efeitos 3–4 dB mais baixos que os efeitos das pausas.
- **Lista de efeitos no código do vídeo:** os efeitos ficam em `src/v2/sons.ts`, calculados pelas mesmas palavras (`W(fala, palavra)`) que movem a animação. São exportados para JSON e sintetizados em Python. Se a voz mudar, os efeitos acompanham.

## 11/10/2026: proposta aprovada e salva no SKILL.md

- O Daniel aprovou a proposta com os aprendizados do Rotina v2. O `SKILL.md` agora incorpora tudo até 11/10/2026, já com os caminhos das pastas por categoria.

## 12/10/2026: Rotina v3 (trilha de 100 BPM)

- **Mudar o BPM do `exemplo_trilha_v2.py`:** além de `beat_t(k) = (fase + 18·k)/30` (100 BPM = 18 quadros por batida), há tempos fixos em segundos pensados para 120 BPM que precisam ser multiplicados por 1,2: o deslocamento dos chimbais (0,125 → 0,15), o contratempo (0,25 → 0,3), o 2º tom da virada (0,375 → 0,45), o passo do rufar e o delay. Procure por números decimais no script.
- **Grade travada na voz:** virada no quadro 250 ("junta"), seções em 430 e 574, pausa em 772 e golpe final em 862, logo depois de "bio".
- **Efeitos:** 96, todos em `src/v3/sons.ts` com os quadros da animação. Novo: o "plim" de notificação = `chime` com `n1 1760, n2 2349,3, gap 0,05, dur 0,35`, ganho 0,1.
- **Resultado:** −14,0 LUFS e −1,6 dBTP no vídeo final; voz no mínimo 12,8 dB acima do fundo (mediana 17,1 dB). A transcrição do áudio final (95,6%) ficou acima da voz sozinha (93,4%): a trilha não cobre a fala.
- Detalhes: `projetos/rotina/PASSO-A-PASSO.md` (item 6) e `reports/Vídeo Rotina v3, skills e combos usados (2026-10-12).md`.

## 04/11/2026: Rotina v7 (49,6 s)

- **Reaproveitar a trilha de outro vídeo trocando só a grade:** `trilha_v6.py` virou `trilha_v7.py` mudando `DUR`, a fase da batida (`beat_t(k) = (8 + 18k)/30`) e as constantes `T_*` para as batidas que caem nas palavras-chave (virada em "Rotina", seções nas trocas de fundo, silêncio sob "Baixe", golpe final no fecho). Gera em ~20 s.
- **Vídeo mais longo e com muitos efeitos pede música mais baixa:** com música −9 dB, as falas do meio ficaram de 8,7 a 10,4 dB acima do fundo. Com música −13 dB e efeitos −5 dB: mínimo 12,6 dB, mediana 15,8 dB, −14,0 LUFS e −1,5 dBTP.
- 120 efeitos calculados das mesmas palavras e dos toques gravados no app (`v7/audio/sons_v7.py` na branch `rotina-video`), com um clique baixo (ganho 0,06) em cada toque do dedo.
