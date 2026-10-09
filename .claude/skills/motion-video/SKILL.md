---
name: motion-video
description: Cria vídeos de motion design 100% em código com o motion-studio (canvas frame a frame + render headless + sons sintetizados + mixagem com música). Use quando o usuário pedir um vídeo em motion, anúncio animado, vinheta, motion graphics, "um vídeo como aquele", para treinar/criar um novo ESTILO de vídeo a partir de uma referência, ou para ajustar/re-renderizar um projeto em motion-studio/projects. Não usa Remotion.
---

# motion-video

Estúdio na pasta `motion-studio/`, dentro da pasta aberta no Claude Code (a raiz do projeto, onde fica `.claude/`). Todos os comandos abaixo rodam de dentro de `motion-studio/`.

## 0. Instalação (primeira vez)
Se `motion-studio/.venv` ou `motion-studio/node_modules` não existirem, ou se o usuário pedir para "preparar/instalar":
1. Rode `bash motion-studio/tools/setup.sh`. Ele confere Node, FFmpeg e Python 3, cria `.venv` com numpy/scipy, instala o Puppeteer e faz um preview de teste.
2. Se faltar Node, FFmpeg ou Python, o setup mostra o comando de instalação para o sistema (Mac: `brew`, Windows: `winget`, Linux: `apt`). **Peça permissão** antes de instalar qualquer coisa. No Windows, depois do `winget` é preciso reabrir o terminal.

**Multiplataforma:** os scripts rodam em bash, ou seja, no Terminal do Mac/Linux e no **Git Bash** do Windows (que o Claude Code no Windows já usa). Chame sempre com `bash tools/<script>.sh`. `tools/env.sh` detecta o sistema, o Python (`python3`/`python`) e a `.venv` (`bin/` ou `Scripts/`). Só no Mac: `cutout.swift` e o vigia de RAM do `render-chunks.sh`.
3. Confirme com o usuário mostrando `projects/exemplo/out/preview.jpg`.


```
engine/   engine.core.js (helpers) · engine.runtime.js (montagem/export) · player.html · sfx.py
styles/<estilo>/   style.js (tokens: cores, fontes, fundo, transição, sons) · STYLE.md (gramática visual)
projects/<nome>/   project.js · scenes.js · audio.json · out/ (frames, video.mp4, final.mp4, sheet.jpg)
templates/project/ ponto de partida de projeto novo
tools/    render.sh · render.mjs · check.py · music.py · ref.sh · server.py
```

## 1. REGRAS DE MOVIMENTO — valem para TODO estilo e formato
Estas regras ficam acima do estilo. O STYLE.md muda a aparência, nunca estas regras.

1. **Zero dead holds.** Nenhum elemento fica 100% parado esperando o próximo evento.
   - Toda cena tem `cam(ctx, f, a, b, 1, 1.05–1.12)`.
   - Todo elemento que chegou continua em *drift*: `drift` em `words`, `- prog(...,E.lin)*N` na posição, uma leve rotação nos cards e um crescimento de 3–7% em pílulas/ícones.
2. **Uma chegada dura até perto do próximo evento.** Use `E.out5` / `E.smooth` / `E.push` (cauda longa). Evite `inOutQ`/`inOutC` em chegadas, porque travam no fim; eles servem só para movimentos de câmera curtos e decididos.
3. **A saída continua o momentum da deriva**, na mesma direção e acelerando com `E.inC` + blur. Nunca sumir parado.
4. **Os eventos se sobrepõem.** A próxima animação começa 4 a 12 frames antes da anterior terminar.
5. **Movimento rápido tem motion blur** (`smear` com a velocidade).
6. **Transições nascem de um elemento em cena** (x/y no `TR`). Nada de fade genérico, a não ser que o estilo peça.
7. **Molas macias** em cards: `spring({k:80,c:14})`. Molas firmes (`k:200,c:15`) só em pops pequenos.
8. **Loop:** o fundo é periódico em N frames, então o frame final pode emendar no frame 0.
9. **Verificar com dados:** o `check.py` precisa sair sem nenhum "DEAD HOLD — corrigir". "DRIFT LENTO" é aceitável se for intencional.

## 2. Fluxo (barato em tokens)
1. **Briefing numa mensagem só.** Se faltar algo essencial, pergunte tudo de uma vez: formato, duração, estilo (`ls styles/`), marca, textos e cenas, música (caminho e trecho), referência.
2. **Storyboard em texto:** uma tabela com cena, frames, headline, demo e transição. Não faça storyboard em HTML. Espere o usuário aprovar.
3. **Projeto:** `cp -r templates/project projects/<nome>`. Edite `project.js` e escreva `scenes.js` reutilizando a API (seção 4). Leia **só** o `STYLE.md` do estilo escolhido. Não leia o `engine.core.js` inteiro: a API está abaixo.
4. **Preview barato:** `tools/render.sh <nome> preview`. Ele gera `out/preview.jpg` (1 quadro a cada 30 frames, em 1/3 da resolução). Veja essa única imagem e corrija layout e timing.
4b. **Storyboard em imagem** (sempre mostre antes de renderizar o vídeo final): defina `BOARD=[[frame,'título','nota'],...]` no scenes.js e rode `tools/render.sh <nome> board` → `out/board.png` (uma imagem só). SEMPRE abra a imagem antes de enviar.
5. **Render final:** `tools/render.sh <nome>`. Ele faz os frames, o MP4, os sons, a mixagem e o relatório de dead holds em texto. Só abra o `out/sheet.jpg` se o relatório ou o usuário indicarem problema.
6. **Música:** primeiro `python tools/music.py <mp3>` (dá o BPM e os drops em texto). Depois, no `audio.json`, use `align: {musicTime: <drop>, frame: <clique/momento-chave>}`.
7. **Ajustes de som** não precisam de re-render: `tools/render.sh <nome> audio` leva segundos.
8. **Entregar:** `out/final.mp4` com SendUserFile.

**Robustez:**
- Fontes ficam locais em `motion-studio/fonts/` (`fonts.files` no style.js); o render FALHA se uma fonte cair no fallback.
- Footage é carregado sob demanda (não pré-carregar milhares de quadros → estoura memória).
- Render longo: rode em background. Se cair no meio, re-renderize só a faixa: `FROM=a TO=b node tools/render.mjs projects/<nome> full 8777`, depois ffmpeg + `render.sh <nome> audio`.
- Recorte de fundo (PNG sem fundo): `swift tools/cutout.swift <entrada> <saida.png>` (só macOS; no Windows/Linux peça ao usuário um PNG já sem fundo).
- Confira os trechos de footage: cortes de B-roll dentro do clipe aparecem na grade; limite a contagem/`speed` do FOOT.

**Regras de economia:**
- Edite com `Edit`, nunca reescreva o `scenes.js` inteiro.
- Agrupe os ajustes do usuário numa rodada só.
- Peça e use números de frame.
- Nada de screenshots do player: use `preview.jpg`, `sheet.jpg` e o texto do `check.py`.
- Para Python use o da `.venv` (`source tools/env.sh` → `$PY`).

## 3. Novo ESTILO a partir de referência ("treinar estilo")
1. Rode `tools/ref.sh <video> <dir> 4` e olhe só as grades `sheet_*.png` (no máximo 2 imagens).
2. Extraia:
   - **Paleta** (hex), **tipografia** e **fundo**
   - **Gramática:** como as cenas se encadeiam, o tipo de transição, a câmera
   - **Duração por beat** e o **tipo de easing**
3. Faça `cp -r styles/tech-premium styles/<novo>` e edite:
   - `style.js`: tokens; os blobs podem ficar com `a: 0` se o fundo for chapado
   - `STYLE.md`: gramática e durações, no mesmo formato do tech-premium
4. Se o estilo precisar de um componente que não existe na engine (ex.: kinetic type 3D, máscaras de forma), **adicione ao `engine.core.js` como função genérica** e documente na seção 4. Assim todos os estilos ganham o componente.
5. A seção 1 continua valendo, sempre.

## 4. API da engine (globais)
- **Constantes:** `W H FPS N` · cores `K` (escuro) `WH` (claro) `O` (acento) `B` (contraste) `CARD` · fontes `DISPLAY` e `MONO`
- **Tempo:**
  - `prog(f,a,b,ease)` → 0..1
  - `spring(f,start,{k,c})`
  - easings em `E`: `lin inC outC inOutC inOutQ out5 smooth push cam`
  - `cb(x1,y1,x2,y2)` cria uma curva bezier
  - `lerp clamp`
- **Cena:**
  - `bg(ctx,f,dark)`: fundo do estilo
  - `cam(ctx,f,a,b,s0,s1)`: zoom contínuo
  - `layer(ctx,alpha,blur,L=>...)`: alpha/blur de grupo
- **Texto:**
  - `words(ctx,f,[[txt,cor?],...],{x,y,size,weight,start,stagger,dur,color,exit,drift,am,ls})`: entrada palavra por palavra com blur
  - `logo(ctx,f,{start,exit,offset,text})`
  - `smear(ctx,velocidade,am=>draw(am))`: motion blur
  - `penLine(ctx,x,y,w,progresso)`: sublinhado à mão
- **UI 3D:** desenhe o card num canvas `mk(w,h)` (use `rr`, `circle`, `font(peso,tam,fam)`) e chame `persp(ctx,canvas,cx,cy,{ry,rz,s,light})`
- **Assets / editorial** (estilo editorial com fotos e vídeo):
  - `project.js`: `assets:['x.png']` (em `projects/<p>/assets/`) · `footage:{nome:N}` (gerado por `tools/footage.sh <p> <nome> <video> <ini> <dur>`)
  - `IMG('x.png')` · `FOOT(nome, frameLocal, speed)` · `cover(ctx,img,x,y,w,h,{s,ox,oy})`
  - `footage(ctx,f,img,{a,b,s0,s1,bw,edgeBlur,dim})`: tela cheia, zoom contínuo, P&B, borda borrada
  - `stackText(ctx,f,[[txt,frame?,cor?],...],{x,y,size,align,stagger,exit,drift,glitch})`: Anton empilhada com glitch
  - `caption(ctx,f,txt,{x,y,size,color,start,exit,shadow})`: legenda Helvetica
  - `cutout(ctx,f,img,{x,y,w,start,rot,orbit,seed,exit,from})`: PNG em órbita · `photoCard(ctx,img,cx,cy,w,h,{fill,inset,rot,s,r})`
  - `vignette(ctx,amt,rgb,inner)` · `hash(n)` (pseudo-aleatório determinístico)
  - estilo pode ter `vignette:{amt,rgb,inner,breathe,cycles}` global
- **Objetos reais** (ref dnyx; serve para qualquer objeto: ancorado, cortado pela borda, conteúdo troca por corte seco):
  - `phone(ctx,f,{x,y,w,start,from,dist,screen:(g,w,h,f)=>{},exit,exitDir,light})`: iPhone realista · `statusBar(g,w,{color})`
  - `product(ctx,f,img,{x,y,w,start,from,rot,spin,contact,reflect,exit})`: PNG do produto com sombra de contato
  - `assemble(ctx,f,[{draw,sc:[x,y,rot],row:[x,y],to:[x,y,s]}],{t:{in,row,go}})`: peças soltas → fileira → para dentro do objeto
  - `promptPill(ctx,f,txt,{x,y,w,h,start,cps,dark})`: campo de prompt digitando · `bigWord(ctx,f,txt,{x,y,size,color})`: Anton gigante cortada
  - `edgeIn(f,start,from,dist)` · fundo com grid via `style.bg.grid` · o estilo pode definir `w/h/fps`
- **Montagem (`scenes.js`):**
  - `SC=[{a,fn}]` · `TR=[{a,b,x,y,type?}]` (`circle` | `fade` | `wipe` | `zoomblur` | `whip` com `dir`)
  - `SFX=[[nome,frame,ganho,pan,{opts}]]`
  - `PROJECT.init` para pré-cálculos (ex.: miniaturas com `THUMB`/`BS`)
- **Sons (`sfx.py`):**
  - `whoosh{dur,f0,f1,peak,panFrom,panTo}` `pop{f0,f1,dur}` `click{freq,dur}` `tick` `chime` `boom{dur}` `scribble{dur}` `shimmer{dur}`
  - rajadas `typing{to,step}` `clicks{to,step}`
  - a transição ganha som automático (`style.sfx.transition`)
  - som novo = função em `GEN`

Estilos incluídos: `tech-premium` (produto/UI 3D, 60fps). Novos estilos são criados com a seção 3.

Exemplo completo de projeto: `projects/exemplo/` (15s, 5 cenas, sons sincronizados; para música, preencha `audio.json`).
