# Pesquisa A: skills para costurar na `motion-oficial`

Data: 11/10/2026. Agente de pesquisa A.
Ferramenta: `npx -y skills@1.7.2 find`, rodada numa pasta vazia, com 13 consultas: framer motion, motion animation, react animation, gsap, css animation, micro interactions, spring animation, web animation, animation performance, reduced motion, easing, layout animation e animation review.
Repositórios baixados com `git clone --depth 1` em `scratchpad/hunter/downloads/A-*/repo`. Nenhum script foi executado, nada foi instalado e o repositório `claude-skills-main` não foi alterado.

> **Restrição importante:** o `ORIGEM.md` e o `APRENDIZADOS.md` da `motion-oficial` dizem que os arquivos oficiais **ficam intactos**. Toda costura vai para arquivos **nossos**, ao lado deles: `APRENDIZADOS.md` e uma pasta nova sugerida mais abaixo. Nunca vai dentro de `SKILL.md`, `best-practices/` etc.

---

## 1. Tabela das candidatas

As instalações são as de skills.sh em 11/10/2026. A nota mede a utilidade para **nós**: animação de UI em React/Next/Tailwind com Motion 14 e interfaces premium para vídeos de apps.

| # | Skill | Autor / repo | Instalações | Licença | Link | Nota |
|---|---|---|---|---|---|---|
| 1 | `animate` + `review-animations` (+ `RECIPES.md`, `STANDARDS.md`) | Emil Kowalski, `emilkowalski/skills` | 132,5 mil / 215,3 mil | **MIT** | https://skills.sh/emilkowalski/skills/animate | **10** |
| 2 | `apple-design` | Emil Kowalski, `emilkowalski/skills` | 201 mil | **MIT** | https://skills.sh/emilkowalski/skills/apple-design | **8** |
| 3 | `ui-animation` | Matthew Blode, `mblode/agent-skills` | 9,9 mil | **MIT** | https://skills.sh/mblode/agent-skills/ui-animation | **9** |
| 4 | `design-motion-principles` | Kyle Zantos, `kylezantos/design-motion-principles` | 11,4 mil | **MIT** | https://skills.sh/kylezantos/design-motion-principles/design-motion-principles | **8** |
| 5 | `fixing-motion-performance` | Julien Thibeaut (ibelick), `ibelick/ui-skills` | 24,6 mil | **MIT** | https://skills.sh/ibelick/ui-skills/fixing-motion-performance | **7** |
| 6 | `userinterface-wiki` (regras `exit-`, `presence-`, `mode-`, `container-`) | Raphael Salaja, `raphaelsalaja/userinterface-wiki` | 4,4 mil | **MIT** | https://skills.sh/raphaelsalaja/userinterface-wiki/userinterface-wiki | **7** |
| 7 | `animate` (referência dentro de `impeccable`) | Paul Bakaus, `pbakaus/impeccable` | 81,7 mil | **Apache 2.0** (tem `NOTICE.md`) | https://skills.sh/pbakaus/impeccable/animate | **5** |
| 8 | `transitions-polish` / `transitions-dev` | Jakub Antalik, `jakubantalik/transitions.dev` | 8,9 mil | **Licença própria.** Pode usar em projetos, mas **não pode redistribuir a coleção** | https://skills.sh/jakubantalik/transitions.dev/transitions-polish | **3**: só ideias, não copiar para a base |

**Vistas e descartadas sem clonar** (fora do foco "UI com Motion" ou de pouca confiança):
- `heygen-com/hyperframes@*` (780 mil): vídeo HTML com GSAP. É assunto do vídeo, não da UI. Vale para o agente que cuida do Remotion/vídeo.
- `greensock/gsap-skills@*` (oficial do GSAP, 60 mil+): é outra biblioteca. O nosso caminho é Motion. Só serviria para migração (a codex oficial já cobre "migrate from gsap").
- `vercel-labs/agent-skills@vercel-react-view-transitions` (148,7 mil): é sobre a View Transitions API do React. Pode virar estudo próprio, mas não é Motion.
- `patricio0312rev/skills@framer-motion-animator` (10,7 mil), `freshtechbro/claudedesignskills@motion-framer` (5,2 mil) e `mindrally/skills@framer-motion` (2,9 mil): autores pouco conhecidos e conteúdo genérico, que a skill oficial já cobre melhor.
- `pproenca/dot-skills@emilkowal-animations` (2,8 mil): cópia derivada do Emil. Melhor usar a original.
- `leonxlnx/taste-skill`, `pbakaus/impeccable@impeccable`, `ui-ux-pro-max`: são de design geral. Já temos a `ui-ux-pro-max`.

---

## 2. O que aproveitar de cada candidata

### 2.1 Emil Kowalski: `animate`, `review-animations`, `RECIPES.md`, `STANDARDS.md` (MIT, nota 10)

É a fonte mais citada do ecossistema: Kyle Zantos e Matthew Blode derivam dela. Ela ocupa o espaço que a nossa skill oficial deixa vazio, o **design** do movimento. A oficial tem só 3 linhas de "Design" em `best-practices/index.md`.

**a) A porta "deve animar?", por frequência** (`skills/animate/SKILL.md`):
> | 100+ times/day (keyboard shortcuts, command palette toggle) | **No animation. Ever.** Stop here. |
> | Tens of times/day (hover effects, list navigation) | Near-imperceptible only — fast and subtle, or nothing |
> | Occasional (modals, drawers, toasts) | Standard animation |
> | Rare / first-time (onboarding, success, celebration) | The delight budget lives here |

Motivo: a oficial não diz **quando não animar**, e esse é o erro número 1 da IA.

**b) Propósito obrigatório.** Cada animação precisa ter um destes motivos: Feedback, Spatial consistency, State indication, Preventing a jarring change, Explanation ou Delight (este só no nível raro). Regra citada: "Can't name it? Don't build it."

**c) A ferramenta mais barata que resolve** (tabela na seção 3 do `animate`): CSS transition → `@starting-style` → CSS animation → WAAPI → Motion. A oficial só fala de Motion. Esta tabela evita instalar Motion para um simples fade.

**d) Curvas fortes nomeadas** (novas para nós):
```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);        /* strong ease-out for UI */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);    /* strong ease-in-out for on-screen movement */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);     /* iOS-like drawer curve (Ionic) */
```
Regra: "**Never `ease-in` on UI.**" e "`ease-out` at 200ms *feels* faster than `ease-in` at 200ms."

**e) Durações por elemento** (`STANDARDS.md`):
| Elemento | Duração |
|---|---|
| Resposta ao clique no botão | 100–160 ms |
| Tooltip, popover pequeno | 125–200 ms |
| Dropdown, select | 150–250 ms |
| Modal, gaveta | 200–500 ms |
| Marketing e explicativo | pode ser mais longo |

Mais a regra: "UI animations stay under 300ms."

**f) Física:**
- nunca `scale(0)`, comece de `scale(0.9–0.97)` com `opacity: 0`;
- `transform-origin` no gatilho para popover/dropdown/tooltip (`var(--transform-origin)` no Base UI). **Modais ficam fora da regra** e continuam centralizados;
- clique com `scale(0.97)` em `:active` e `160ms`.

**g) Interrupção:** transições (não keyframes) para o que dispara várias vezes seguidas (toasts, toggles), porque "keyframes restart from zero". Molas para gestos.

**h) Tempo assimétrico:** a fase deliberada é lenta e a resposta é rápida. Exemplo literal do *hold-to-confirm*: `clip-path 2s linear` ao segurar e `200ms ease-out` ao soltar.

**i) Tabela "Never Ship"** (`animate/SKILL.md`): 13 linhas de "nunca → em vez disso". É ótima como **checklist final**. Exemplos: `transition: all`, `scale(0)`, `ease-in`, hover sem `@media (hover: hover) and (pointer: fine)`, falta de `prefers-reduced-motion`, tudo entrando de uma vez (use um intervalo de 30–80 ms entre itens).

**j) `RECIPES.md`:** receitas curtas de botão, dropdown, tooltip (com `data-instant`: "Once one tooltip is open, neighbours open instantly"), modal, gaveta (`500ms var(--ease-drawer)`), toast (`@starting-style`), accordion, entrada em cascata, hold-to-confirm, indicador de aba com `clip-path` (lista duplicada e recortada), scroll reveal (`useInView` com `{ once: true, margin: "-100px" }`) e arrastar para dispensar (`velocity > 0.11`, *pointer capture*, proteção multi-toque, amortecimento na borda).

**k) Formato de revisão** (`review-animations`): tabela **Before | After | Why**, veredito por camadas e decisão **Block/Approve**, com uma hierarquia de correções que começa por "1. Delete the animation". É um revisor **grátis** que complementa o `agents/motion-reviewer.md`, o qual depende do MotionScore pago (Motion+).

**l) Depuração de "sensação":** tocar a 2–5× a duração, ver quadro a quadro no painel Animations do DevTools, testar gestos no celular real e rever "com olhos frescos no dia seguinte".

**Conferência com a oficial:** o Emil diz que "Framer Motion shorthands are NOT hardware-accelerated... Use the full transform string". Isso **bate** com a oficial ("Prefer `transform` as these animations will run via WAAPI"). Não há conflito, só reforço com o motivo prático: os atalhos travam quando a página está ocupada.

---

### 2.2 Emil Kowalski: `apple-design` (MIT, nota 8)

São as palestras da WWDC ("Designing Fluid Interfaces") traduzidas para a web, com mapeamento explícito para Motion.

- **Molas no padrão Apple** (números novos para nós):
  | Interação | Damping | Response |
  |---|---|---|
  | Mover/reposicionar (PiP) | `1.0` | `0.4` |
  | Rotação | `0.8` | `0.4` |
  | Gaveta/sheet | `0.8` | `0.3` |

  Mapeamento: `bounce` + `duration` do Motion ≈ damping + response. Regra: comece em damping 1.0 (`bounce: 0`) e só ponha bounce "only when the gesture itself carried momentum".
- **Passagem de velocidade** (*velocity handoff*): ao soltar o gesto, a mola continua com a velocidade do dedo. O Motion recebe px/s direto na opção `velocity`.
- **Projeção de momento** (código literal da Apple):
  ```js
  function project(initialVelocity /* px/s */, decelerationRate = 0.998) {
    return (initialVelocity / 1000) * decelerationRate / (1 - decelerationRate);
  }
  ```
- **Elástico na borda** (*rubber-band*): `(overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot))`, com `constant = 0.55`.
- **Interrupção:** "Always animate from the *presentation* (current) value". Decomponha o movimento 2D em molas X e Y independentes.
- **Detalhes de gesto:** responda no `pointerdown`, com ~10 px de folga antes de decidir a direção. Respeite o ponto onde o usuário pegou o elemento.
- **Acessibilidade em 3 sinais:** `prefers-reduced-motion`, `prefers-reduced-transparency` e `prefers-contrast: more`. Evite oscilação lenta perto de 0,2 Hz. Faça a transição de tema claro/escuro com easing.
- **Materiais:** "Materialize, don't just fade". Em vidro/blur, anime o raio do blur junto com a escala. Isso é útil para as **telas de app premium** dos vídeos.

---

### 2.3 Matthew Blode: `ui-animation` (MIT, nota 9)

É a mais completa e prática. Traz conteúdo do Emil e da Apple **e** muita coisa própria.

**a) Curvas nomeadas extras** (além das do Emil):
- **Enter:** `cubic-bezier(0.22, 1, 0.36, 1)`
- **Move:** `cubic-bezier(0.25, 1, 0.5, 1)`
- **Expo out:** `cubic-bezier(0.19, 1, 0.22, 1)` ("dramatic reveals, card hovers, text reveals")
- **Press:** `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- **On-screen move:** `cubic-bezier(0.645, 0.045, 0.355, 1)`

A tabela de durações também cobre transição de página (250–400 ms) e "Illustrative/marketing: Up to 1000ms". Ela diz para escalar a duração com a distância.

**b) Molas, presets físicos** (`references/spring-animations.md`):
| Preset | stiffness | damping | Uso |
|---|---|---|---|
| Snappy | 500 | 40 | UI geral, sem bounce |
| Bouncy | 300 | 20 | lúdico, notificações |
| Gentle | 200 | 30 | transição de página, elementos grandes |
| Stiff | 700 | 50 | movimentos pequenos e precisos |

**c) Mola assimétrica medida quadro a quadro** (dado novo e valioso):
> Open: `stiffness: 155, damping: 11` (ζ 0.44) … Close: `stiffness: 620, damping: 36` (ζ ~0.75)

Regra: "when an element earns bounce, the bounce belongs to the open and the close stays critically damped". Ela explica por que um *morph* "parece barato".

**d) Armadilhas específicas do Motion** (novas para nós):
- "Reduced motion handled only in CSS: Motion's JS-driven animations ignore a `@media (prefers-reduced-motion)` block". A correção é `<MotionConfig reducedMotion="user">` ou `useReducedMotion()`;
- `layout`/`layoutId` distorcem o `border-radius` quando ele vem de className. A regra é "always `style={{ borderRadius: 12 }}`, never a className or `rem` radius";
- com `layoutId` não dá para controlar a trajetória do morph. A saída é animar o **pai**;
- a saída que não toca vem de `AnimatePresence` sem `key`, ou com o `AnimatePresence` dentro do condicional;
- `useScroll` + `useTransform` roda na thread principal e trava sob carga.

**e) Desempenho com "tarefas longas":** quando a animação trava "só às vezes", a culpa é do trabalho dividindo o mesmo *tick*. Regra: "start the motion, let a frame land, then do the work, or defer the work to `transitionend`/`onAnimationComplete`". Também traz a tabela de custo por propriedade (composite / paint / layout) e trocas como `box-shadow` → `filter: drop-shadow()` e `border-radius` → `clip-path: inset(0 round 50px)`.

**f) Depuração por sintoma** (`references/debugging-symptoms.md`): tabelas para "lento", "robótico", "barato", "travando", "pulando" e "disparando à toa", com as causas em ordem de probabilidade. Exemplos de causas: elemento sai de baixo do cursor no hover (mova o transform para um filho interno) e salto de 1 px (`will-change: transform`). Regra do ciclo: "Easing first, then duration".

**g) Outras regras curtas:**
- "Paired elements rule" (modal e overlay compartilham easing e duração);
- confirmar no próprio botão em vez de um toast no canto;
- desligar transições na troca de tema;
- `touch-action: manipulation` em controles;
- pausar loops fora da tela com `IntersectionObserver`;
- em animação ligada ao scroll, use `linear` e nenhuma duração.

**h) Engenharia reversa a partir de vídeo** (fluxo com ffmpeg + `extract_frames.py`/`track_motion.py`/`fit_curves.py`): ela mede uma animação gravada e devolve os parâmetros de mola ou bezier. É **muito alinhada ao Daniel**, que é editor de motion e recria movimentos de vídeos de referência.
- Armadilha: "`fit_curves.py` defaults to `--fps 30`... always pass the extraction fps". Meça abertura e fechamento separadamente.
- **Cuidado:** os scripts estão em Python, não foram executados e precisam ser lidos antes de qualquer uso. Primeiro leve só o **método**. Os scripts entram depois de revisados e aprovados.

---

### 2.4 Kyle Zantos: `design-motion-principles` (MIT, nota 8)

**a) Pesos por tipo de projeto** (três "lentes": Emil = contenção, Jakub Krehel = polimento de produção, Jhey Tompkins = brincadeira). Tabela "Context-to-Perspective Mapping": um app infantil não usa a regra dos 300 ms do Emil, e um painel SaaS não usa elástico. Serve para os **vídeos promocionais**, que são marketing e pedem o peso "Jakub + Jhey".

**b) Receita de entrada do Jakub** (`references/motion-cookbook.md`):
```jsx
initial={{ opacity: 0, translateY: "calc(-100% - 4px)", filter: "blur(4px)" }}
animate={{ opacity: 1, translateY: 0, filter: "blur(0px)" }}
transition={{ type: "spring", duration: 0.45, bounce: 0 }}
```
A saída é mais sutil que a entrada: `exit={{ translateY: "-12px", opacity: 0, filter: "blur(4px)" }}`. A troca de ícone (copiar → check) usa `AnimatePresence mode="wait"` com opacity, scale 0.8 e blur 4px.

**c) Anti-checklist de "movimento de IA genérica"** (`references/anti-checklist.md`), com limites numéricos para sinalizar:
- pulsos/brilhos em loop: sinalizar **qualquer** ocorrência;
- blur em toda entrada: ≥3 componentes na mesma tela;
- `hover:scale-105` em tudo: ≥3;
- cascata em toda lista: ≥2 listas na mesma tela;
- mola com bounce em ações utilitárias (dropdown, toggle, modal): qualquer uma;
- fade-in idêntico em ≥4 componentes;
- animação ao montar em `h1`/`p`/`nav`.

Motivo: é o que separa o "premium" do "feito por IA". Isso é direto o pedido do Daniel.

**d) `creation-gotchas.md`:** onde o Claude erra ao **escrever** motion. Exemplos: "Don't use one duration for everything", "Don't ignore the existing codebase" (se o projeto já usa molas de 500 ms, não invente 150 ms).

**e) Outros:**
- `animation-fill-mode: backwards` para a cascata com atraso não piscar;
- `@property` para animar variáveis CSS;
- gradiente em `oklch`;
- limite de `will-change`: "0-3 elements fine, 4-10 careful, 10+ reconsider".

**Conflito a anotar:** o `accessibility.md` sugere o reset global `animation-duration: 0.01ms !important` em reduced motion. O Blode e o Emil dizem que isso **exagera**: "reduced motion means fewer and gentler, not zero". Siga Emil/Blode.

---

### 2.5 ibelick: `fixing-motion-performance` (MIT, nota 7)

É uma **auditoria de desempenho grátis** e curta, que substitui parcialmente o MotionScore pago. Por prioridade:
- **never patterns:** não intercalar leitura e escrita de layout no mesmo frame; não animar a partir de `scrollY`/eventos de scroll; nada de loop de rAF sem condição de parada; não misturar sistemas de animação que medem layout;
- **medição:** "measure once, then animate via transform or opacity", com FLIP;
- **scroll:** prefira Scroll/View Timelines (`animation-timeline: view()`) e pause o que está fora da tela;
- **paint:** "do not animate CSS variables for transform, opacity, or position" e "do not animate inherited CSS variables";
- **blur:** "keep blur animation small (<=8px)". É mais rígido que o limite de 20 px do Emil. Use 8 px como alvo e 20 px como teto;
- **view transitions:** só para navegação, nunca em UI muito interativa;
- **limites da ferramenta:** "do not migrate or rewrite animation libraries unless explicitly requested".

Formato da revisão: citar a linha, uma frase de motivo e uma correção concreta.

---

### 2.6 Raphael Salaja: `userinterface-wiki` (MIT, nota 7)

São 152 regras atômicas no formato "Incorrect / Correct". Para nós valem as **regras do Motion sobre saída e presença**, que a oficial não detalha:
- `exit-key-required`: `key={item.id}`, nunca `key={index}` dentro de `AnimatePresence`;
- `exit-requires-wrapper`: o condicional fica **dentro** de `AnimatePresence`;
- `presence-hook-in-child`: `useIsPresent` vai no filho, não no pai;
- `presence-disable-interactions`: `disabled={!isPresent}` enquanto o elemento sai;
- `presence-safe-to-remove`: `cleanup().then(safeToRemove)`;
- `nested-propagate-required`: `<AnimatePresence propagate>` nos dois níveis para que os filhos não sumam de uma vez;
- `mode-wait-doubles-duration`: "Mode 'wait' nearly doubles animation duration". Corte a duração pela metade (ex.: 0,3 → 0,15);
- `mode-pop-layout-for-lists`: use `mode="popLayout"` ao reordenar listas;
- **padrão de duas divs** (`container-two-div-pattern`): "Never measure and animate the same element". A div de fora anima `height` e a de dentro é medida com `ResizeObserver` e *callback ref*. Some a isso `overflow: hidden`, a proteção contra medida 0 no 1º render (`bounds.width > 0 ? bounds.width : "auto"`) e um atraso de 0,05 s;
- durações: hover e clique em 120–180 ms, pequenas mudanças de estado em 180–260 ms.

**Conflito a anotar:** a regra `duration-shorten-before-curve` diz "encurte a duração antes de mexer na curva". O Blode diz "easing first, then duration". Sugestão: se parecer **lento**, encurte primeiro. Se parecer **sem vida ou robótico**, mude a curva primeiro.

---

### 2.7 Paul Bakaus: `impeccable` / `animate` (Apache 2.0, nota 5)

Para nós vale uma ideia: a **"motion thesis"**, um plano curto antes de implementar, com Focal moment, Continuity, Feedback e Budget. Ela traz duas regras: "Prefer one rehearsed focal sequence to repeated section reveals" e "A generic fade-and-rise, hover lift, parallax layer, or scroll reveal is not a thesis". A tabela de duração inclui 500–800 ms para "a deliberately authored focal entrance", com a curva `cubic-bezier(0.16, 1, 0.3, 1)`. É a mesma expo-out que a nossa `remotion-video` já usa.
- Apache 2.0 permite copiar, mas exige manter a atribuição e o NOTICE. Como o trecho útil é pequeno, o melhor é **reescrever com nossas palavras** e citar a fonte.

### 2.8 transitions.dev (licença própria, nota 3)

Tem 35 receitas de transição (número que aparece, odômetro, text morph, shimmer etc.). A licença **proíbe redistribuir a coleção**, e copiar para a nossa base seria redistribuir. **Só ideias**: o catálogo de nomes é uma boa lista de "efeitos que existem" para vídeos de app. Se o Daniel quiser, ele instala direto no projeto dele, onde o uso é permitido.

---

## 3. O que já temos e o que é novo

### Já temos (na `motion-oficial` ou na irmã `button-animation`)
- Imports corretos (`motion/react`, `motion/react-client`), nunca `framer-motion` e nunca os dois instalados juntos.
- Preferir `transform` (WAAPI) aos atalhos `x`/`y`/`scale`, e quando usar os atalhos (transforms compostos).
- `will-change` com moderação. Laços por frame sem alocação.
- Molas com `visualDuration` + `bounce`. "Interface séria sem passar do ponto, casamento pode ser mais suave."
- MotionValues: não ler no render, `on("change")`, `useTransform` com faixas.
- Radix/Base UI com `forceMount` e `AnimatePresence`.
- Molas CSS com `linear()` e as faixas de duração (0,2 / 0,3–0,4 / 1 s).
- Na `button-animation`: `prefers-reduced-motion`, `useReducedMotion`, `MotionConfig reducedMotion="user"`, `propagate={{ tap: false }}`, presets de mola (620/36, 650/40), micro-interações de 120–250 ms e `active:scale-[0.97]`.
- Na `remotion-video`: expo-out `(0.16, 1, 0.3, 1)` para chegadas em vídeo.
- Auditoria de desempenho **só paga** (MotionScore, Motion+).

### É NOVO (não existe em nenhuma skill nossa)
1. **Porta de decisão "deve animar?"** (frequência e propósito) e a **ferramenta mais barata** (CSS → `@starting-style` → WAAPI → Motion).
2. **Tabela de durações por componente** (botão, tooltip, dropdown, modal, gaveta, página, marketing) e a regra dos 300 ms **com exceção por contexto** (pesos do Kyle).
3. **Curvas cubic-bezier fortes nomeadas** (`--ease-out`, `--ease-in-out`, `--ease-drawer`, enter, move, expo, press) e a regra "nunca `ease-in` em UI".
4. **Física de entrada:** nada de `scale(0)`, `transform-origin` no gatilho com exceção do modal, saída mais sutil que a entrada, mola assimétrica (bounce só na abertura).
5. **Molas Apple** (damping/response → bounce/duration), presets físicos stiffness/damping, velocity handoff, projeção de momento, rubber-band.
6. **Armadilhas do Motion:** reduced motion só em CSS não afeta o Motion; `border-radius` em `style` com `layout`; `key` estável; `propagate` em `AnimatePresence` aninhado; `mode="wait"` dobra o tempo; `popLayout` em listas; `useIsPresent` no filho; `safeToRemove`; padrão de duas divs para altura automática.
7. **Anti-checklist "movimento de IA"** com limites numéricos (pulsos, blur em tudo, hover-scale em tudo, cascata em toda lista, bounce em utilitário).
8. **Auditoria de desempenho grátis** (never patterns, medição/FLIP, scroll timelines, blur ≤ 8 px, variáveis CSS herdadas, tarefas longas no mesmo tick).
9. **Revisão em formato Before/After/Why com Block/Approve** e hierarquia de correção ("primeiro, apagar a animação").
10. **Depuração por sintoma** (lento, robótico, barato, travando, pulando) e o ciclo "câmera lenta → classificar → mudar uma variável".
11. **Gestos:** pointer capture, folga de 10 px, `velocity > 0.11` para dispensar, proteção multi-toque, `touch-action`.
12. **Engenharia reversa de animação a partir de vídeo** (só o método; scripts pendentes de revisão).
13. **"Motion thesis"** (momento focal, continuidade, feedback, orçamento) para landing pages e vídeos promocionais.

---

## 4. Recomendação final: o que costurar e onde

Os arquivos oficiais ficam intactos. Sugestão: criar **uma pasta nossa** dentro da skill, por exemplo `skills/design/motion-oficial/craft/`, em português, com atribuição em cada arquivo. Ligar essa pasta a partir do `APRENDIZADOS.md` (adendo datado) e da linha do índice `guia/HABILIDADES.txt`. Colocar as licenças MIT dos autores em `craft/LICENSES/` (Emil, Blode, Zantos, ibelick, Salaja) e registrar tudo no `ORIGEM.md` como "costura de terceiros".

| Arquivo novo sugerido | Conteúdo | Fontes principais |
|---|---|---|
| `craft/decidir.md` | Porta por frequência e propósito, ferramenta mais barata, pesos por tipo de projeto (UI de app × vídeo promo × marketing), "motion thesis" | Emil `animate` §1–3; Kyle (mapa de contexto); impeccable (thesis, reescrita) |
| `craft/valores.md` | **Tabela única de números**: durações por componente; curvas nomeadas como tokens CSS **e** como arrays para o Motion (`ease: [0.23, 1, 0.32, 1]`); molas (Apple damping/response ↔ `bounce`/`visualDuration`, presets 500/40, 300/20, 200/30, 700/50, mola assimétrica 155/11 × 620/36); intervalo da cascata de 30–80 ms; blur ≤ 8 px (teto de 20) | Emil `STANDARDS.md`; Blode `SKILL.md` + `spring-animations.md`; Apple; ibelick |
| `craft/receitas.md` | Receitas curtas **em Motion/React + Tailwind**: clique, dropdown com origem, tooltip com `data-instant`, modal, gaveta, toast, troca de ícone (blur 4 px), entrada com blur (Jakub), altura automática em duas divs, indicador de aba com `layoutId`, scroll reveal `once`, arrastar para dispensar com velocity handoff | Emil `RECIPES.md`; Kyle cookbook; Salaja `container-*`; Blode |
| `craft/armadilhas-motion.md` | Erros específicos do Motion 14 (`AnimatePresence`: key, wrapper, propagate, `mode="wait"`, `popLayout`, `useIsPresent`, `safeToRemove`; `layout` + `borderRadius` inline; reduced motion só em CSS; atalhos `x`/`y` sob carga; não iniciar trabalho pesado no mesmo tick) | Salaja; Blode; Emil |
| `craft/revisar.md` | Checklist "Nunca entregar" + anti-checklist de movimento de IA com limites numéricos + auditoria de desempenho grátis + formato Before/After/Why com Block/Approve + depuração por sintoma | Emil `review-animations` + "Never Ship"; Kyle `anti-checklist`; ibelick; Blode `debugging-symptoms` |
| (opcional, depois) `craft/engenharia-reversa.md` | Método para medir uma animação gravada (ffmpeg a 60 fps, abertura e fechamento separados, ajuste de mola/bezier). Os scripts do Blode só entram após leitura linha a linha e aprovação | Blode `ui-animation` (reverse-engineer) |

**Adendo no `APRENDIZADOS.md`** (5 linhas):
1. "Para **decidir e dar acabamento**, leia `craft/`; para a **API**, `best-practices/`."
2. "Use reduced motion via `MotionConfig`, porque a media query CSS não afeta o Motion."
3. "Em vídeos promocionais vale o peso marketing: 500–1000 ms e expo-out; em UI de app, abaixo de 300 ms."
4. "Revisão grátis: `craft/revisar.md`; MotionScore é pago."
5. Os conflitos resolvidos: reduced motion não é zero; blur com alvo de 8 px e teto de 20; lento → duração primeiro, robótico → curva primeiro.

**Ordem de prioridade para costurar:** (1) Emil `animate` + `STANDARDS` + `RECIPES`, (2) Blode `ui-animation`, (3) armadilhas do Salaja, (4) anti-checklist do Kyle, (5) ibelick, (6) Apple (gestos), (7) a ideia da thesis.

**Não costurar:** transitions.dev (licença), GSAP/hyperframes (outro escopo) e as cópias derivadas (`pproenca/emilkowal-animations`).

Todas as mudanças na base precisam de aprovação do Daniel, conforme o `CLAUDE.md` da main.
