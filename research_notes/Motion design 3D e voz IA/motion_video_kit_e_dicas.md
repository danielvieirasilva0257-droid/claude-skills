# Kit motion-video (enviado pelo usuário) e dicas pendentes

Data: 09/10/2026. Fonte: zip `motion-video-kit.zip` enviado pelo usuário. Foi revisado e instalado neste repositório:
- `.claude/skills/motion-video/SKILL.md`: a skill, que o Claude Code carrega sozinho ao abrir o repositório;
- `motion-studio/`: o motor, os estilos, os projetos e as ferramentas, mais `LEIA-ME.txt` e o guia em PDF.

## O que é

- **Motor próprio:** um "estúdio" de motion design 100% em código que **não usa Remotion**.
  - Desenha em canvas 2D quadro a quadro (`engine/engine.core.js`, `engine.runtime.js`, `player.html`).
  - Renderiza com Puppeteer sem tela (`tools/render.mjs`) e monta o MP4 com ffmpeg.
  - Sintetiza os efeitos sonoros em Python (`engine/sfx.py`) e mixa com música e loudnorm (−14 LUFS por padrão).
- **Plataformas:** feito para Mac e Windows (Git Bash), e também roda em Linux.
- **Estilo incluído:** `tech-premium` (produto e UI em 3D, 60 fps). Há um projeto de exemplo de 15 s com 5 cenas.
- **Revisão de segurança:** o servidor local escuta só em 127.0.0.1 e só grava dentro de `projects/`. Os scripts só instalam numpy, scipy e Puppeteer. Não há downloads escondidos.
- **Licença:** o zip não traz arquivo de licença. A pesquisa do ecossistema citou o "motion-video-kit" como MIT; falta confirmar se é o mesmo projeto.

## Regras de movimento da skill

Estas regras valem acima de qualquer estilo e combinam com a pesquisa de motion:

1. **Zero "dead holds".** Nada fica 100% parado. Toda cena tem zoom contínuo de câmera de 1,00 a 1,05–1,12. Elementos que chegaram continuam em leve deriva: posição, rotação pequena e crescimento de 3–7%.
2. **Chegadas com cauda longa** (`out5`, `smooth`, `push`), durando até perto do próximo evento. As curvas in-out ficam só para movimentos curtos de câmera.
3. **A saída continua o embalo da deriva**, acelerando (`inC`) com blur. Nunca sumir parado.
4. **Os eventos se sobrepõem:** a próxima animação começa 4–12 frames antes de a anterior acabar.
5. **Movimento rápido tem motion blur** (`smear`, proporcional à velocidade).
6. **As transições nascem de um elemento da cena** (círculo, wipe, zoomblur, whip com direção). Fade genérico só se o estilo pedir.
7. **Molas macias** em cards (`k:80, c:14`); molas firmes (`k:200, c:15`) só em pops pequenos.
8. **Fundo periódico** (loop).
9. **Checagem com dados:** `tools/check.py` aponta "DEAD HOLD — corrigir".

### Fluxo econômico em tokens

1. Briefing numa mensagem só.
2. Storyboard em tabela de texto, aprovado pelo usuário.
3. `preview.jpg`: 1 quadro a cada 30 frames, em 1/3 da resolução.
4. `board.png`: quadros-chave.
5. Render final.
6. Ajustes de som sem re-render (`render.sh <proj> audio`).

### Novo estilo a partir de uma referência

1. `tools/ref.sh` gera grades de quadros do vídeo de referência.
2. Daí se extraem paleta, tipografia, gramática de cenas, duração por beat e easing.
3. Copia-se `styles/tech-premium` com o novo nome e ajustam-se os tokens e o STYLE.md.

### API útil para o Rotina

- `phone()`: iPhone realista com tela desenhada por função, entrada pela borda e luz.
- `persp()`: cards de UI em 3D com perspectiva e luz.
- `words()`: entrada palavra por palavra com blur.
- `promptPill()`: campo digitando.
- `assemble()`: peças soltas formam uma fileira e entram no objeto.
- `SFX`: whoosh, pop, click, tick, chime, boom, shimmer e rajadas de digitação.
- `tools/music.py`: detecta BPM e drops da música para alinhar o momento-chave.

## Como se compara ao pipeline atual (Remotion em `rotina-video/`)

- **O kit tem a seu favor:**
  - regras de movimento embutidas e checagem automática de dead holds;
  - sons sincronizados por frame;
  - iPhone e cards 3D prontos;
  - fluxo de preview barato.
- **O Remotion tem a seu favor:**
  - as telas do app já recriadas em React;
  - skills oficiais e transições novas na versão 4.0.534;
  - 3D real com React Three Fiber, medido em cerca de 0,6 s por frame nesta máquina;
  - ecossistema grande.
- **Caminho sugerido (a validar):**
  - Aplicar as 9 regras de movimento do kit no projeto Remotion.
  - Ou testar o kit diretamente para cenas de UI 3D e comparar o resultado com o mesmo roteiro.

## Teste no container (MEDIDO em 09/10/2026)

O kit funciona neste container sem nenhuma alteração no código dele.

- **Instalação:**
  - `python3 -m venv .venv && .venv/bin/pip install numpy scipy`;
  - `PUPPETEER_SKIP_DOWNLOAD=1 npm install` (27 pacotes, 3 s).
- **Chrome:** `PUPPETEER_EXECUTABLE_PATH` aponta para um wrapper que roda `/opt/pw-browsers/chromium-1194/chrome-linux/chrome --no-sandbox "$@"`. O container roda como root, e o `render.mjs` não passa `--no-sandbox`.
- **Preview** (`bash tools/render.sh exemplo preview`): 10 s de render, cerca de 1 min no total, contando a primeira subida do servidor.
- **Render completo do exemplo:** 900 quadros, 1920×1080, 60 fps, 15 s.
  - Cerca de 1,1 s por quadro com os 4 CPUs divididos com outros testes. Os 133 quadros finais levaram 143 s, o que dá uns 16 min estimados para os 15 s inteiros.
  - Na primeira tentativa o render **travou no quadro 767**, sem erro, enquanto outros renders disputavam a máquina. A causa não foi investigada.
  - A retomada por faixa funcionou: `FROM=767 TO=899 node tools/render.mjs projects/exemplo full 8777`, depois o ffmpeg e `bash tools/render.sh exemplo audio`.
- **Resultado:** `final.mp4` com sons sintetizados e loudness de −15,4 LUFS integrado (o alvo era −14; o áudio é só SFX, esparso). O `check.py` apontou 0 dead holds e um trecho de "DRIFT LENTO" nos quadros 21–57, aceitável.
- **Aparência:** profissional.
  - Cards de UI em perspectiva 3D, alternância de cenas escuras e claras com fundo de gradiente.
  - Transições circulares nascendo de um botão.
  - Texto entrando com blur e checklist com sublinhado à mão.
- **Atenção:** o exemplo é horizontal (1920×1080). Para Reels, defina `w/h` 1080×1920 no estilo ou no projeto.
- **Só no Mac:** o `cutout.swift` e o vigia de RAM do `render-chunks.sh`.

## Dica do usuário: Google AI Studio (PENDENTE)

- O usuário sugeriu fazer no "Google Studio", entendido como **Google AI Studio** (aistudio.google.com).
- **Para testar:**
  - a voz **Gemini TTS** em pt-BR, que a pesquisa de voz aponta como disponível e de alta qualidade;
  - a música com **Lyria**.
- A interface web é gratuita para testes, e a API exige uma chave gratuita criada pelo próprio usuário no AI Studio.
- **Próximos passos:**
  1. O usuário cria a chave e a passa como variável de ambiente.
  2. Gerar o mesmo roteiro do Rotina com 3–4 vozes Gemini.
  3. Comparar, num A/B, com ElevenLabs v4 e Azure HD.
  4. Conferir os termos de uso comercial do áudio gerado.

## Pesquisa da rodada 2 interrompida (PENDENTE)

As três frentes da rodada 2 pararam pelo limite de uso da sessão:
- **Legendas do YouTube:** parcial em `youtube_round2.md`.
- **Testes de 3D:** parcial em `3d_round2.md`.
- **Vozes locais e alinhamento de palavras:** parcial em `voice_round2.md`.

Retomar de onde pararam.
