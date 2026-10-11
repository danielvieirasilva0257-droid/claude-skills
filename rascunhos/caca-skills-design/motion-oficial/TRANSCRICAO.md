# Transcrição: pesquisas A e B para a nova `motion-oficial`

Data: 11/10/2026. Agente de transcrição.
Entradas: `pesquisa-A.md` (catálogo skills.sh, 27 KB) e `pesquisa-B.md` (GitHub e web, 19 KB). Os dois arquivos chegaram completos e com tamanho estável.
Conferência: os trechos principais foram checados nos repositórios que os agentes baixaram em `scratchpad/hunter/downloads/` (só leitura; nada foi executado).

> **Observação importante:** as duas pesquisas recomendam "não mexer nos arquivos oficiais" e criar pastas nossas ao lado. Essa recomendação vinha da regra antiga. Desta vez o Daniel **autorizou reescrever a skill livremente**, então a nova versão junta tudo num só corpo, em português, sem manter o original intacto.

---

## 1. Diagnóstico da skill atual (as duas pesquisas concordam)

- **Forte em API do Motion:** imports certos (`motion/react`, nunca `framer-motion`), `transform` versus `x/y/scale`, `will-change`, MotionValues, `useTransform`, Radix, Base UI, Vue, busca na documentação via servidor MCP, molas CSS com `linear()`.
- **Fraca em direção de movimento:**
  - não diz **quando não animar**;
  - não tem tabela de durações nem curvas com valores;
  - não trata coreografia, stagger, interrupção, gestos;
  - **não fala de `prefers-reduced-motion` em nenhum arquivo**;
  - a única regra de design é "site de bolsa sem overshoot, site de casamento pode ser mais suave".
- **Partes pagas (Motion+):** auditoria MotionScore, código-fonte de exemplos e Motion UI, editor visual. Sem isso, a skill não tinha nenhuma revisão grátis.

## 2. Fontes encontradas

Commits conferidos com `git log -1` nos clones.

| # | Fonte | Achada por | Link | Licença (conferida) | Commit / data | Nota A | Nota B |
|---|---|---|---|---|---|---|---|
| 1 | Emil Kowalski: `animate`, `RECIPES.md`, `review-animations`, `STANDARDS.md`, `apple-design` | A e B | https://github.com/emilkowalski/skills | MIT (2026) | `e8a175d`, 02/10/2026 | 10 | 10 |
| 2 | Matthew Blode: `ui-animation` (+ 18 referências e 3 scripts Python) | A | https://github.com/mblode/agent-skills | MIT (2026) | `872bc83`, 11/10/2026 | 9 | — |
| 3 | Kyle Zantos: `design-motion-principles` (anti-checklist, cookbook, gotchas) | A e B | https://github.com/kylezantos/design-motion-principles | MIT (2026) | `4a9ca87`, 30/05/2026 | 8 | — |
| 4 | Julien Thibeaut (ibelick): `fixing-motion-performance`, `baseline-ui` | A e B | https://github.com/ibelick/ui-skills | MIT (2026) | `d036a68`, 11/10/2026 | 7 | 8 |
| 5 | Raphael Salaja: `userinterface-wiki` (152 regras atômicas) | A | https://github.com/raphaelsalaja/userinterface-wiki | MIT (2026) | `256a954`, 17/03/2026 | 7 | — |
| 6 | Motion Lexicon (Ryan-yang125): beats, atores, rubrica | B | https://github.com/Ryan-yang125/motion-lexicon | código MIT; **texto e dados CC BY 4.0** (arquivo `CONTENT-LICENSE`) | `88f979a`, 19/08/2026 | — | 8 |
| 7 | Material Design 3: tokens de movimento (material-web) | B | https://github.com/material-components/material-web | Apache-2.0 | `47adb65`, 07/10/2026 | — | 7 |
| 8 | Vercel Web Interface Guidelines (seção Animation) | B | https://github.com/vercel-labs/web-interface-guidelines | MIT (2025) | `434b7f9`, 05/10/2026 | — | 7 |
| 9 | Documentação do Motion: acessibilidade | B | https://motion.dev/docs/react-accessibility | documentação (só citar) | 2026 | — | 7 |
| 10 | Paul Bakaus: `impeccable` / `animate` ("motion thesis") | A | https://github.com/pbakaus/impeccable | Apache-2.0 (com NOTICE) | `c63b8dd`, 11/10/2026 | 5 | — |
| 11 | Josh Comeau: "Springs and Bounces in Native CSS" | B | https://www.joshwcomeau.com/animation/linear-timing-function/ | **sem licença aberta** | 10/2025 | — | 6 |
| 12 | Remotion: skills oficiais | B | https://github.com/remotion-dev/skills | **sem LICENSE** (licença Remotion) | `32b241b`, 07/10/2026 | — | 6 |
| 13 | Rauno Freiberg: "Web Interface Guidelines" | B | https://github.com/raunofreiberg/interfaces | **sem licença** | `81f523a`, 06/06/2023 | — | 5 |
| 14 | GSAP: skills oficiais | A e B | https://github.com/greensock/gsap-skills | MIT | `aed9cfd`, 21/04/2026 | descartada | 5 (só ideia) |
| 15 | taste-skill (Leonxlnx): "dial de intensidade" | A e B | https://github.com/Leonxlnx/taste-skill | MIT | `717446e`, 09/10/2026 | descartada | 4 |
| 16 | anthropics/skills `frontend-design` | B | https://github.com/anthropics/skills | Apache-2.0 | `dbd4588`, 09/10/2026 | — | 4 |
| 17 | transitions.dev (Jakub Antalik) | A | https://github.com/jakubantalik/transitions.dev | **licença própria, proíbe redistribuir** | `2773886`, 10/10/2026 | 3 (só ideias) | — |
| 18 | pproenca `emilkowal-animations` | A e B | https://github.com/pproenca/dot-skills | MIT | `cf93c57` | descartada (cópia do Emil) | 3 |

**Correção da transcrição:** a pesquisa B listou o Motion Lexicon como "MIT". O repositório tem dois arquivos de licença: o código é MIT, mas o **texto e os dados são CC BY 4.0**. CC BY também permite adaptar, desde que cite a fonte, aponte a licença e diga o que mudou. Isso foi feito no `ORIGEM.md` novo.

**Descartadas sem clonar (pesquisa A):** `heygen-com/hyperframes` (vídeo HTML com GSAP, outro assunto), `vercel-labs/agent-skills@vercel-react-view-transitions` (View Transitions do React, não é Motion), `patricio0312rev/framer-motion-animator`, `freshtechbro/motion-framer`, `mindrally/framer-motion` (genéricas e de autores pouco conhecidos), `taste-skill`, `impeccable@impeccable` e `ui-ux-pro-max` (design geral; já temos a `ui-ux-pro-max`).

## 3. O que cada fonte oferece de útil

### 3.1 Emil Kowalski (MIT): a espinha da nova skill
- **Portão "deve animar?" por frequência:** 100+ vezes/dia = nunca anima; dezenas = quase imperceptível; ocasional = animação padrão; raro = onde mora o "encanto".
- **Propósito obrigatório:** Feedback, Consistência espacial, Indicação de estado, Evitar mudança brusca, Explicação, Encanto (só no nível raro). "Can't name it? Don't build it."
- **Ferramenta mais barata:** CSS transition → `@starting-style` → CSS animation → WAAPI → Motion.
- **Propriedades:** só `transform` e `opacity` (`clip-path` é a quarta aceita; `height` só em acordeão). Nunca `scale(0)`; começar de 0,9–0,97 com opacidade 0. `transform-origin` no gatilho, exceto modal.
- **Curvas:** `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`, `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`, `--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)`. "Never `ease-in` on UI."
- **Durações:** clique 100–160 ms; tooltip 125–200; dropdown 150–250; modal/gaveta 200–500; marketing pode ser maior. "UI animations stay under 300ms."
- **Interrupção:** transições (não keyframes) no que dispara rápido; molas em gestos; sair pelo mesmo caminho; tempo assimétrico (segurar 2 s linear, soltar 200 ms).
- **Reduced motion:** "fewer and gentler, not zero"; hover só com `@media (hover: hover) and (pointer: fine)`.
- **Tabela "Never Ship"** (13 linhas) e **receitas** (`RECIPES.md`): clique, dropdown, tooltip com `data-instant`, modal, gaveta, toast com `@starting-style`, acordeão, stagger, hold-to-confirm, indicador de aba com `clip-path`, scroll reveal `once`, arrastar para dispensar (`velocity > 0.11`, pointer capture, proteção multi-toque, amortecimento na borda), blur de 2 px para crossfade, WAAPI sem biblioteca.
- **`apple-design`:** molas Apple (mover 1.0/0.4; rotação 0.8/0.4; gaveta 0.8/0.3), passagem de velocidade, projeção de momento (`decelerationRate = 0.998`), rubber-band (`constant = 0.55`), animar a partir do valor atual na tela, X e Y em molas separadas, `prefers-reduced-transparency`, `prefers-contrast: more`, evitar oscilação perto de 0,2 Hz, "materialize, don't just fade".
- **Revisão:** tabela Before / After / Why, veredito em camadas e Block/Approve; primeira correção possível é "apagar a animação".
- **Depuração de sensação:** rodar a 2–5× a duração, quadro a quadro no DevTools, aparelho real, olhar de novo no dia seguinte.

### 3.2 Matthew Blode `ui-animation` (MIT)
- **Curvas nomeadas extras:** enter `(0.22, 1, 0.36, 1)`, move `(0.25, 1, 0.5, 1)`, expo out `(0.19, 1, 0.22, 1)`, press `(0.25, 0.46, 0.45, 0.94)`, on-screen `(0.645, 0.045, 0.355, 1)`.
- **Tabela de durações com curva** (inclui página 250–400 ms, hover 100–200 ms, marketing até 1000 ms) e "escale a duração com a distância".
- **Molas:** presets Snappy 500/40, Bouncy 300/20, Gentle 200/30, Stiff 700/50; **mola assimétrica medida**: abrir 155/11 (ζ 0,44), fechar 620/36 (ζ ~0,75). "O bounce é da abertura; o fechamento fica amortecido."
- **Armadilhas do Motion:** reduced motion só em CSS não afeta o Motion (use `MotionConfig reducedMotion="user"`); `border-radius` em `style` inline com `layout`/`layoutId`; `AnimatePresence` sem `key` ou dentro do condicional não anima a saída; atalhos `x/y` travam com a página ocupada.
- **Tarefas longas:** trava "só às vezes" = trabalho pesado no mesmo tick; comece o movimento, deixe um quadro passar, depois faça o trabalho.
- **Depuração por sintoma:** lento, robótico, barato, travando, pulando, disparando à toa; ciclo "câmera lenta → classificar → mudar uma variável; curva primeiro, depois duração".
- **Outras:** regra dos pares (modal e overlay com a mesma curva e duração), confirmar no próprio botão, desligar transições na troca de tema, `touch-action: manipulation`, pausar loops fora da tela, scroll ligado à rolagem com `linear` e sem duração, SVG com `transform-box: fill-box`.
- **Engenharia reversa de vídeo** (ffmpeg + 3 scripts Python): só o **método** entra; os scripts não foram lidos linha a linha nem executados, então ficam de fora.

### 3.3 Kyle Zantos `design-motion-principles` (MIT)
- **Peso por tipo de projeto:** Emil (contenção), Jakub Krehel (polimento), Jhey Tompkins (brincadeira). Painel SaaS não usa elástico; app infantil pode passar dos 300 ms.
- **Receita de entrada do Jakub:** opacidade + `translateY` + `blur(4px)`, mola `duration 0.45, bounce 0`; saída mais sutil; troca de ícone com `AnimatePresence mode="wait"`, scale 0,8 e blur 4 px.
- **Anti-checklist "movimento de IA":** pulsos em loop (qualquer um), blur em toda entrada (≥3 na tela), `hover:scale-105` em tudo (≥3), stagger em toda lista (≥2), bounce em ação utilitária (qualquer), fade igual em ≥4 componentes, animação ao montar em `h1/p/nav`.
- **Outras:** `animation-fill-mode: backwards` no stagger, `@property` para animar variáveis CSS, limite de `will-change` (0–3 ok; 4–10 cuidado; 10+ repensar), "não ignore o código existente".
- **Conflito:** sugere reset global de `animation-duration: 0.01ms` em reduced motion; Emil e Blode dizem que isso exagera. **Fica Emil/Blode.**

### 3.4 ibelick `fixing-motion-performance` (MIT)
- Auditoria de desempenho grátis, por prioridade: nunca intercalar leitura e escrita de layout; nunca animar a partir de `scrollY`; rAF sempre com condição de parada; não misturar sistemas que medem layout; medir uma vez e animar com transform (FLIP); Scroll/View Timelines; pausar fora da tela; não animar variáveis CSS herdadas; **blur ≤ 8 px**, curto e nunca contínuo; View Transitions só para navegação; não migrar bibliotecas sem pedido.
- Formato: citar a linha, uma frase de motivo, correção concreta.
- **Conflito:** `baseline-ui` diz "não crie curvas próprias"; Emil diz que as curvas nativas são fracas. **Fica Emil, mas usando os tokens do projeto se já existirem.**

### 3.5 Raphael Salaja `userinterface-wiki` (MIT)
- Regras de saída e presença: `key` estável (nunca índice); condicional **dentro** do `AnimatePresence`; `useIsPresent` no filho; `disabled={!isPresent}` na saída; `safeToRemove`; `propagate` nos dois níveis de `AnimatePresence` aninhado; `mode="wait"` quase dobra o tempo (corte pela metade); `mode="popLayout"` ao reordenar listas.
- **Padrão de duas divs:** nunca medir e animar o mesmo elemento.
- Durações: hover e clique 120–180 ms; pequenas mudanças de estado 180–260 ms.
- **Conflito:** "encurte a duração antes de mexer na curva" versus Blode "curva primeiro". **Solução:** se parece **lento**, encurte primeiro; se parece **robótico**, mude a curva primeiro.

### 3.6 Motion Lexicon (CC BY 4.0 no texto)
- **Coreografia:** um ator principal e até dois de apoio; papéis trigger/hero/status/record/environment; 3 a 5 beats por momento; apoio só depois que o principal assenta; "atraso só quando revela dependência, sequência ou um processo real".
- **Gramática de beat:** `at | actor | purpose | primitive | from→to | durationMs | easing`. Serve para UI **e** para roteiro de vídeo.
- **Padrões:** Confirmar e seguir; Selecionar e inspecionar; Mudar no lugar; Recuperar com controle.
- **Rubrica de revisão** (clareza de estado, ator principal, continuidade, tempo, hierarquia de material, estabilidade de layout, interrupção, desempenho, acessibilidade) e **regra da corrida assíncrona** (cada intenção ganha uma versão; resposta velha não dispara animação).
- Chegada normal 200–280 ms; saída 110–180 ms; stagger 30–70 ms.

### 3.7 Material 3 (Apache-2.0), tokens conferidos no `_md-sys-motion.scss`
- Curvas: `standard (0.2, 0, 0, 1)`, `emphasized-decelerate (0.05, 0.7, 0.1, 1)`, `emphasized-accelerate (0.3, 0, 0.8, 0.15)`.
- Molas (massa 1) convertidas para o `damping` do Motion pela fórmula `razão × 2√k`: fast-spatial 1400/67, default-spatial 700/48, slow-spatial 300/31, fast-effects 3800/123, default-effects 1600/80, slow-effects 800/57. Conta refeita aqui e confere.
- Lição: molas **espaciais** podem passar um pouco do ponto (0,9); molas de **efeito** (opacidade, cor) nunca (1,0).

### 3.8 Vercel WIG (MIT)
- "Prefer CSS > Web Animations API > JS libraries"; honrar `prefers-reduced-motion`; transforms SVG num `<g>` com `transform-box: fill-box`; autoplay com mais de 5 s precisa de pausar (WCAG 2.2.2).

### 3.9 Fontes só de ideias (sem licença aberta ou licença restrita)
- **Josh Comeau:** `linear()` dentro de `@media (prefers-reduced-motion: no-preference)`, fallback com `@supports`, ~50 pontos convencem e ~11 parecem robóticos, `linear()` não carrega velocidade.
- **Rauno:** menu de clique direito do macOS só anima a saída; troca de tema sem transição; press ~0,96.
- **Remotion:** dentro de composições Remotion, CSS transitions, classes `animate-*` e Motion **não renderizam certo**; use `useCurrentFrame()` + `interpolate()` / `spring()`.
- **impeccable (Apache, trecho pequeno, reescrito):** "motion thesis" (momento focal, continuidade, feedback, orçamento); uma sequência focal ensaiada vale mais que reveals repetidos; entrada focal autoral 500–800 ms com `(0.16, 1, 0.3, 1)`.
- **GSAP:** sequenciar por timeline com posição relativa em vez de somar `delay`. No Motion: `animate([...sequência])` com `at`.
- **taste-skill:** ideia de um "dial de intensidade" por produto. **Não copiar:** usa `transition: all`.
- **transitions.dev:** catálogo de nomes de efeitos (odômetro, text morph, shimmer). Licença proíbe redistribuir; nada copiado.

## 4. Conflitos e como foram resolvidos na nova skill

| Conflito | Decisão |
|---|---|
| Emil usa `{ type: "spring", duration, bounce }`; a doc oficial usa `visualDuration` | Usar `visualDuration` (oficial). Anotar que `duration` do Emil é parecido. |
| Emil: "use sempre a string `transform`"; Blode: "`x/y` é o padrão para eixo e arrasto" | Seguir a regra oficial do Motion: `transform` por padrão (roda via WAAPI); `x/y/scale` quando há transforms compostos, MotionValues, gestos ou transições diferentes por eixo. |
| Reduced motion: reset global a 0,01 ms (Kyle) × "menos e mais suave" (Emil, Blode) | Menos e mais suave. Nada de reset global. |
| Blur: 8 px (ibelick) × 20 px (Emil, Blode) | Alvo 8 px, teto 20 px. |
| Teto de UI: 300 ms (Emil) × 200 ms para feedback (ibelick, Rauno) | Feedback de interação ≤ 200 ms; o resto da UI ≤ 300 ms; marketing e vídeo podem ir além. |
| Curva primeiro (Blode) × duração primeiro (Salaja) | Lento → duração primeiro. Robótico → curva primeiro. |
| Curvas próprias proibidas (`baseline-ui`) × curvas nativas fracas (Emil) | Curvas fortes nomeadas, mas os tokens do projeto vêm antes. |
| Recortes com `clip-path` nas receitas (scroll reveal, aba) × regra 2 do Daniel ("nenhum recorte no meio da tela") | Recorte só quando a borda do recorte é borda real do componente (aba, botão, barra de progresso). Em vídeo/promo, o scroll reveal com `clip-path` fica proibido; use entrada pela borda. |

## 5. O que fica de fora e por quê

- Scripts Python do Blode (engenharia reversa): não foram lidos linha a linha; entra só o método.
- Texto do transitions.dev, Josh, Rauno e Remotion: sem licença que permita copiar; só ideias reescritas.
- GSAP e hyperframes: outra biblioteca.
- `pproenca/emilkowal-animations`: cópia derivada do Emil.
- A regra `rules/motion.mdc` do pacote oficial (só para o Cursor), como já era antes.
