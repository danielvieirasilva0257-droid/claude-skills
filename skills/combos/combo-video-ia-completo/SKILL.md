---
name: combo-video-ia-completo
description: Mapa completo para fazer um vídeo com IA da ideia ao arquivo pronto, juntando a arquitetura de roteiro (gancho, começo, meio, fim), as skills de vídeo do repositório (remotion-video, hyperframes, gsap, video-use, motion-video, blender-ia), de áudio (voz-pt-br, trilha-e-mixagem) e de entrega (ffmpeg, watch), com cronograma por etapa, escolha do motor, pontos de aprovação do Daniel e autorrevisão antes de entregar. Use quando o pedido for um vídeo inteiro (explicativo, promo, vídeo de YouTube, edição de gravação, short) e não uma peça isolada.
---

# Combo: vídeo com IA, da ideia ao vídeo pronto

Este combo **não repete** o conteúdo das skills: ele diz qual usar em cada etapa, em que ordem e onde o Daniel aprova. Abra cada skill só quando chegar à etapa dela. Ele nasceu da análise do vídeo "skill vídeo claude" (`reports/Skills de vídeo com IA - análise do vídeo skill vídeo claude (2026-11-14).md`) e se apoia na arquitetura de roteiro de `reports/analise-video-LK1GKHCdNAA/` (mapa navegável: https://claude.ai/artifact/5ebHrHCQQM6h7L2S57SyN7).

## Skills ligadas

| Papel | Skill | Caminho |
|---|---|---|
| Estudar vídeo de referência e revisar o nosso | watch | `skills/video/watch/SKILL.md` (+ `APRENDIZADOS.md`) |
| Roteiro que convence e não parece de IA | combo-copy-humanizada | `skills/combos/combo-copy-humanizada/SKILL.md` |
| Direção, aprovações e prévias | motion-video-director | `skills/video/motion-video-director/SKILL.md` |
| Narração e tempo de cada palavra | voz-pt-br | `skills/audio/voz-pt-br/SKILL.md` |
| Motor A: React, celular 3D, projetos que já são Remotion | remotion-video (+ referência oficial) | `skills/video/remotion-video/SKILL.md` e `skills/video/remotion-oficial/SKILL.md` |
| Motor B: HTML com blocos prontos, tipografia, explicativo, refazer referência | hyperframes (+ gsap, + comunidade) | `skills/video/hyperframes/hyperframes/SKILL.md`, `skills/video/gsap/gsap-core/SKILL.md`, `skills/video/hyperframes-comunidade/` |
| Motor C: canvas próprio, estilo premium tech | motion-video | `skills/video/motion-video/.claude/skills/motion-video/SKILL.md` |
| 3D com cara de comercial | blender-ia | `skills/video/blender-ia/SKILL.md` |
| Editar gravação real (cortes pela transcrição) | video-use | `skills/video/video-use/SKILL.md` |
| Música, efeitos, ducking, −14 LUFS | trilha-e-mixagem | `skills/audio/trilha-e-mixagem/SKILL.md` |
| Exportar e conferir por plataforma | ffmpeg | `skills/video/ffmpeg/SKILL.md` |
| Visual e paleta | ui-ux-pro-max | `skills/design/ui-ux-pro-max/SKILL.md` |
| Plataformas pagas (só se o Daniel pedir e passar a chave) | heygen (avatar), elevenlabs (voz clonada, efeitos, trilha, transcrição) | `skills/video/heygen/` e `skills/audio/elevenlabs/` |

## Escolha do caminho (antes de tudo)

| O que o Daniel tem | Caminho | Motor principal |
|---|---|---|
| Só a ideia ou um texto (explicativo, promo, abertura de canal) | **A. Do zero** | Remotion (se já existe projeto Remotion ou precisa de celular 3D) ou HyperFrames (blocos prontos, tipografia, refazer referência) |
| Uma gravação dele (talking head, tutorial, aula, live) | **B. Editar gravação** | video-use (cortes, cor, legendas) + animações em HyperFrames ou Remotion |
| Gravação + muito motion por cima | **C. Híbrido** | video-use para os cortes → motion por cima em HyperFrames ou Remotion → ffmpeg para montar |
| Um vídeo de referência para copiar o estilo | **A, com referência** | watch para estudar → `hyperframes/reverse-any-video` ou `style-sampling` |

## Cronograma (etapas na ordem, com aprovações ✋)

| # | Etapa | O que fazer | Skill | Sai daqui |
|---|---|---|---|---|
| 0 | Referência (opcional) | Assistir à referência: quadros, transcrição, estrutura e técnicas | watch | notas em `research_notes/` |
| 1 | Ideia e embalagem | Tema com interesse, público, **contradição central**, promessa em 1 frase, 3 títulos e 3 thumbs | arquitetura (ramos 1 e 2) | `briefing.md` ✋ |
| 2 | Pedido estruturado | Preencher o modelo `assets/modelo-pedido.md` (objetivo, público, técnicas como sugestão, limite, gancho, meta) | este combo | `pedido.md` ✋ |
| 3 | Roteiro | Começo (gancho → quebra → prova → diferencial → promessa), meio (blocos com loop, troca de estímulo, respiro), fim (ponte → CTA → revelação → próximo vídeo); passar pelo copy humanizado | arquitetura (ramos 4 a 6) + combo-copy-humanizada | `roteiro.md` ✋ |
| 4 | Voz e tempos | Narração; o **tempo de cada palavra** vira a fonte de todos os tempos (cortes, entradas, efeitos) | voz-pt-br | `voz.mp3` + `voz.json` |
| 5 | Material | Gravação (caminho B ou C), banco de vídeos, prints, recorte da pessoa, 3D | video-use, hyperframes/media-use, blender-ia | `assets/` |
| 6 | Estilo e quadros-chave | Paleta, fonte, 3 a 5 quadros de estilo **parados** antes de animar | ui-ux-pro-max + motion-video-director | quadros ✋ |
| 7 | Animação e montagem | Cenas no motor escolhido, cada entrada presa a uma palavra, curvas do padrão premium, as 4 regras do editor | remotion-video **ou** hyperframes + gsap **ou** motion-video | projeto do vídeo |
| 8 | Som | Trilha com o tamanho dos capítulos, efeitos ligados a algo visível, ducking, −14 LUFS | trilha-e-mixagem | `mix.wav` |
| 9 | Prévia | Render rápido (720p) e folha de quadros | motor + ffmpeg (`look.py`) | `preview.mp4` ✋ |
| 10 | **Autorrevisão** (antes de mostrar) | Ver os quadros de cada cena; texto sobre rosto ou sobre texto; recorte no meio da tela; **transcrever o áudio final e comparar com o roteiro**; medir o volume. No máximo 3 passadas, depois avisar o que sobrou | watch + ffmpeg + `hyperframes check/snapshot` | `REVISAO.md` |
| 11 | Render final e conferência | Um render por vez; `check.py --platform` (YouTube, Reels, TikTok) | motor + ffmpeg | `final.mp4` ✋ |
| 12 | Publicação e aprendizado | Teste A/B de título e thumb, tela final para outro vídeo; anotar o que funcionou | arquitetura (ramo 9) | `PASSO-A-PASSO.md` do projeto e `APRENDIZADOS.md` das skills |

## Avisos aprendidos

- **O tempo de cada palavra manda.** Cortes, entradas de texto e efeitos caem numa palavra (`voz.json` da voz-pt-br, ou transcrição local com faster-whisper na gravação).
- **Visão computacional a serviço das regras do editor:** com o rosto localizado, nenhum texto passa na frente dele; com a pessoa recortada, o título pode ficar atrás dela sem máscara no meio da tela. Recorte: `hyperframes remove-background` ou o matting do Remotion oficial. Rastreamento e OCR: skill nossa proposta (`video/visao-computacional`, aguardando aprovação).
- **Reaproveite o motor do projeto anterior.** Cada projeto deixa componentes e funções que o próximo usa (no vídeo analisado, 419 linhas do motor anterior entraram de base).
- **Telemetria desligada** nas skills do HyperFrames (`HYPERFRAMES_NO_TELEMETRY=1 DO_NOT_TRACK=1`).
- **Container:** 4 CPUs, sem GPU, um render por vez; o YouTube não baixa daqui (vídeos de referência pelo Google Drive).
- **Ainda não testado de ponta a ponta** (14/11/2026): o primeiro vídeo feito com este combo deve registrar aqui o que mudou.

## Histórico

- 14/11/2026: combo criado depois da análise do vídeo "skill vídeo claude" e da aprovação das skills hyperframes, hyperframes-comunidade, gsap, video-use, ffmpeg, remotion-oficial e watch.
