---
name: trilha-e-mixagem
description: Trilha sonora e mixagem para vídeos curtos (Reels/anúncios). Cobre licença de música para anúncio pago, trilha original gerada em Python e travada na grade do vídeo, efeitos sonoros sintetizados a partir de uma lista de quadros, voz por cima com música e efeitos abaixando sozinhos, volume final em −14 LUFS e a medição da voz contra o fundo. Use ao montar o áudio de qualquer vídeo.
---

# Trilha sonora e mixagem

Scripts em `scripts/`, todos usados de verdade nos vídeos do Rotina. Os aprendizados novos ficam em `APRENDIZADOS.md`.

## 1. De onde vem a música (a licença decide)

- **Anúncio pago na Meta** exige uma licença que cite anúncios pagos. Exemplos:
  - Artlist Music & SFX Pro (~US$16,58/mês, anual);
  - Epidemic Pro (~US$17/mês);
  - o plano mais alto do Uppbeat.
  - Os planos de entrada **não** cobrem anúncio pago.
- **A música do Instagram** é para uso pessoal e não vale para anúncio.
- **Música por IA:**
  - ElevenLabs Music (`music_v2_5`, uso comercial nos planos pagos);
  - **Google Lyria: só com o plano pago da API.** No plano grátis, o limite é **0 pedidos por dia** nos três modelos (testado em 10/2026).
    - O pedido vai pela Interactions API: `POST /v1beta/interactions`.
    - O clipe tem sempre 30 s, em MP3.
    - Script pronto: `scripts/lyria.py`.
  - Evite o Suno, que tem processos e não tem API, e o Udio, que não deixa mais baixar.
- **Trilha original por código** (sem licença de terceiros, pode ir para anúncio):
  - `scripts/exemplo_trilha_v2.py` (**recomendado**): numpy + pedalboard, com supersaw, bumbo com envelope, palmas, chimbal com swing, baixo, "pumping" de sidechain, risers, rolos de caixa, impactos, reverb e delay. A grade é configurável no topo do arquivo, e gera 30 s em ~17 s.
  - `scripts/exemplo_trilha_rotina.py`: versão simples, a 120 BPM. O usuário achou "básica".

## 2. Casar a música com o vídeo

- **Quadros por batida a 30 fps** = 1800 / BPM. Em 120 BPM, uma batida = 15 quadros e um compasso = 2 s.
- **A música nasce da voz.** Gere a voz primeiro, depois escolha o BPM e a **fase** da grade para a virada cair numa palavra-chave.
  - No Rotina v2, as batidas caem nos quadros 10 + 15k, e a virada cai no quadro 160, em "Com o app Rotina".
  - As trocas de seção ficam nos compassos mais próximos das pausas entre as falas.
- **Estrutura que funcionou num anúncio de 30 s:**
  - intro baixa sob o gancho (cerca de 9 dB abaixo do resto);
  - riser e rolo de caixa até a virada;
  - uma batida de silêncio logo antes da virada;
  - seções com variações;
  - uma pausa antes da chamada final;
  - o golpe final quando a voz termina.

## 3. Efeitos sonoros por lista de quadros

- **Gere a lista de efeitos no código do vídeo**, com os mesmos tempos de palavra que movem a animação. Exporte para JSON: `[{"name", "frame", "gain", "pan", ...opções}]`.
  - Assim, se a voz mudar, os efeitos acompanham.
- **O `scripts/mixar_com_efeitos.py` sintetiza os efeitos:** whoosh, swish, pop, thump, click, tick, chime, boom, scribble, shimmer, slam, coin e glitch, mais as rajadas typing e clicks.
- **Regras:**
  - O whoosh atinge o pico no quadro em que o movimento pousa: comece em `pouso − dur × peak × 30`. O impacto cai no quadro do contato.
  - Som adiantado incomoda mais que som atrasado, então **nunca** adiante mais que ~1 quadro.
  - Efeitos que caem no início de uma palavra cobrem a consoante. Deixe esses 3–4 dB mais baixos que os efeitos das pausas.
- **Outras fontes:** ElevenLabs Sound Effects, ZapSplat, Freesound filtrado para CC0, ou os sons do kit `motion-video`.

## 4. Mixar no ffmpeg (não no Remotion)

```bash
python scripts/mixar_com_efeitos.py --voz voz_final.wav --musica trilha.wav --efeitos sons.json --saida mix.wav \
  --duracao 30 --linha-do-tempo voz.json      # voz.json vem do voz-pt-br/apertar_pausas.py
```
- **O que ele faz:**
  - a música abaixa sob a voz com `sidechaincompress` (ratio 10, ataque de 10 ms, release de 380 ms);
  - os efeitos abaixam de leve (ratio 3);
  - junta tudo com `amix` em `normalize=0`, passa por um limitador e faz `loudnorm` em duas passadas (−14 LUFS, −1,5 dBTP);
  - o arquivo sai com a duração exata.
- **No Remotion,** toque o resultado com um único `<Audio>`.
- **Cuidados medidos:**
  - `amix=duration=first` cortou o fim da música. Use `duration=longest` + `apad=whole_dur=<duração>` + `-t <duração>`.
  - O `Limiter` do pedalboard tem um clipper em 0 dB e deixou o pico em 1,0. Termine com `alimiter` + `loudnorm` no ffmpeg.
- **Falas em arquivos separados:** o `scripts/exemplo_mix_rotina.sh` posiciona cada fala no tempo certo (lista `STARTS`).

## 5. Conferir sem ouvir

O Claude não ouve áudio. Para conferir:
- **Volume:** `ffmpeg -i x.wav -af ebur128=peak=true -f null -` (linhas `I:` e `Peak:`).
- **Estrutura:** um espectrograma `ffmpeg -i x.wav -lavfi showspectrumpic=s=1600x400 spec.png`, para olhar intro, virada, seções e golpe final. Meça também o RMS em janelas de 50 ms em volta da virada.
- **Voz contra o fundo, fala por fala:** o `mixar_com_efeitos.py` com `--linha-do-tempo` mixa uma versão sem a voz e mostra a diferença em dB de cada fala.
  - **Alvo: 12 dB ou mais.**
  - A primeira mixagem do Rotina v2 deixou a chamada final com só 3 dB.
- **Texto da voz na mixagem final:** `voz-pt-br/scripts/conferir_voz.py` no áudio do vídeo pronto (≥ 95%).
