# Pesquisa B: fontes fora do skills.sh para melhorar a `motion-oficial`

Data: 11/10/2026. Agente B (GitHub, listas "awesome", repositórios de empresas e guias na web).
Downloads ficam em `scratchpad/hunter/downloads/<nome>-B/`. Nada foi executado nem instalado.
Os repositórios locais não foram alterados.

## 1. Diagnóstico rápido da nossa skill

A `motion-oficial` (Motion 14, MIT) é forte em **API**: imports corretos, `transform` versus `x/y/scale`, `will-change`, MotionValues, Radix, Base UI, Vue, busca na documentação, molas CSS `linear()` e auditoria paga.

Ela é fraca em **direção de movimento**:
- **Faltam:**
  - tabela de durações;
  - curvas de easing com valores exatos;
  - regra de quando NÃO animar;
  - coreografia e stagger;
  - interrupção e gestos;
  - checklist de acessibilidade.
- **`prefers-reduced-motion` não aparece em nenhum arquivo.** Só existe na nossa `button-animation`.
- A única regra de design é: "trading sem overshoot, casamento pode ser mais suave".

É exatamente essa lacuna que as fontes abaixo preenchem.

## 2. Tabela de fontes

| # | Fonte | Link | Licença | Data (último commit/versão) | Nota 0–10 |
|---|---|---|---|---|---|
| 1 | **Emil Kowalski: skills `animate`, `review-animations`, `improve-animations`, `apple-design`** | https://github.com/emilkowalski/skills | MIT (2026) | 02/10/2026 | **10** |
| 2 | **ibelick/ui-skills: `fixing-motion-performance` + `baseline-ui`** | https://github.com/ibelick/ui-skills | MIT (2026) | 11/10/2026 | **8** |
| 3 | **Motion Lexicon** (Ryan-yang125): beats, atores, rubrica de revisão | https://github.com/Ryan-yang125/motion-lexicon | MIT (2026) | 19/08/2026 | **8** |
| 4 | **Material Design 3: tokens de movimento** (material-web) | https://github.com/material-components/material-web/blob/main/tokens/versions/latest/sass/_md-sys-motion.scss | Apache-2.0 | 07/10/2026 | **7** |
| 5 | **Vercel Web Interface Guidelines** (seção Animation) | https://github.com/vercel-labs/web-interface-guidelines | MIT (2025) | 05/10/2026 | **7** |
| 6 | Documentação Motion: acessibilidade (`MotionConfig reducedMotion`, `useReducedMotion`) | https://motion.dev/docs/react-accessibility | Docs (mesmo autor da skill; citar, não colar) | 2026 | **7** |
| 7 | Josh Comeau: "Springs and Bounces in Native CSS" (`linear()`) | https://www.joshwcomeau.com/animation/linear-timing-function/ | **Sem licença aberta**: só ideias | atualizado 10/2025 | 6 |
| 8 | GSAP official skills (`gsap-performance`, `gsap-timeline`, `gsap-core`) | https://github.com/greensock/gsap-skills | MIT (2026) | 21/04/2026 | 5 (outro motor; só ideias de coreografia) |
| 9 | Remotion official skills (`remotion-markup`, `remotion-create`) | https://github.com/remotion-dev/skills | sem arquivo LICENSE (licença Remotion): só ideias | 07/10/2026 | 6 (importa para os vídeos do Daniel) |
| 10 | Rauno Freiberg: "Web Interface Guidelines" | https://github.com/raunofreiberg/interfaces | **sem licença**: só ideias | 06/06/2023 | 5 |
| 11 | taste-skill (Leonxlnx): "MOTION_INTENSITY dial" | https://github.com/Leonxlnx/taste-skill | MIT (2026) | 09/10/2026 | 4 (tem `transition: all`, uma armadilha) |
| 12 | anthropics/skills `frontend-design` | https://github.com/anthropics/skills/tree/main/skills/frontend-design | Apache-2.0 | 09/10/2026 | 4 (só 2 frases sobre motion) |
| 13 | pproenca/dot-skills `emilkowal-animations` (43 regras) | https://github.com/pproenca/dot-skills | MIT (2025) | 2026 | 3 (derivado da fonte 1; redundante) |

Também olhei as listas ComposioHQ/awesome-claude-skills, travisvn/awesome-claude-skills e VoltAgent/awesome-agent-skills. Delas saíram as fontes 2, 3 e 11.

## 3. Partes a aproveitar, com trechos e origem

### 3.1 Portão "deve animar?" (Emil, `animate/SKILL.md`, MIT): **NOVO**

> "100+ times/day (keyboard shortcuts, command palette toggle) | **No animation. Ever.**"
> "Tens of times/day (hover effects, list navigation) | Near-imperceptible only"
> "Occasional (modals, drawers, toasts) | Standard animation"
> "Rare / first-time (onboarding, success, celebration) | The delight budget lives here"

Há também uma lista de propósitos válidos: Feedback, Spatial consistency, State indication, Preventing a jarring change, Explanation e Delight. Delight só vale no nível raro.

> "Can't name it? Don't build it."

O Rauno (só a ideia) dá o exemplo: o menu de clique direito do macOS só anima a saída, não a entrada.

### 3.2 Escolher a ferramenta mais barata (Emil): **NOVO**

| Necessidade | Ferramenta |
|---|---|
| hover, press, troca de estado por classe | CSS transition |
| entrada ao montar, sem JS | CSS `@starting-style` |
| movimento predeterminado com a página carregando | CSS animation (fora da main thread) |
| controle por código sem biblioteca | WAAPI `element.animate()` |
| springs, layout, saída, gestos | **Motion** |

A Vercel (MIT) diz o mesmo: "Preference: CSS > Web Animations API > JavaScript libraries".

Isso complementa a regra oficial "prefira `transform` (WAAPI)". Hoje a skill nunca diz quando **não** usar o Motion.

### 3.3 Easing com valores exatos (Emil): **NOVO**

Ordem de decisão:
- entrada ou saída → `ease-out`;
- movimento na tela → `ease-in-out`;
- hover ou cor → `ease`;
- movimento constante → `linear`.

> "**Never `ease-in` on UI.** It starts slow, delaying the exact moment the user is watching."

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);        /* strong ease-out for UI */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);    /* strong ease-in-out */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);     /* iOS-like drawer curve (Ionic) */
```

No Motion, isso vira `ease: [0.23, 1, 0.32, 1]`. A nossa `motion.md` só diz "use camelCase".

Alternativa oficial do Material 3 (Apache-2.0, tokens):
- `standard` = `cubic-bezier(0.2, 0, 0, 1)`;
- `emphasized-decelerate` = `cubic-bezier(0.05, 0.7, 0.1, 1)`;
- `emphasized-accelerate` = `cubic-bezier(0.3, 0, 0.8, 0.15)`.

### 3.4 Tabela de durações: **NOVO**

| Elemento | Emil | Motion Lexicon | Material 3 (tokens) |
|---|---|---|---|
| Feedback de press | 100–160 ms | 120–180 ms | short2–short3 (100–150 ms) |
| Tooltip, popover pequeno | 125–200 ms | — | short3–short4 (150–200 ms) |
| Dropdown, select | 150–250 ms | — | medium1 (250 ms) |
| Modal, drawer | 200–500 ms | chegada 200–280 ms | medium–long (250–600 ms) |
| Saída | — | **110–180 ms** (mais curta que a entrada) | — |
| Stagger entre itens | **30–80 ms** | 30–70 ms | — |
| Marketing, explicativo | pode ser maior | — | extra-long (700–1000 ms) |

Os tetos variam por fonte:
- Emil: "UI animations stay under 300ms".
- ibelick e Rauno: "NEVER exceed `200ms` for interaction feedback".

Saída mais rápida que a entrada é um padrão claro do Lexicon e coincide com o Material ("accelerate" na saída).

### 3.5 Molas: números e mapeamento: **PARCIALMENTE NOVO**

Já temos: `type: "spring", bounce: 0.2, visualDuration: 0.4` e a regra "springs para x/rotate interrompíveis".

Novo:
- **Apple (via Emil `apple-design`, MIT):** amortecimento crítico (`bounce: 0`) como padrão. Bounce só quando o gesto trouxe momento:
  > "Overshoot on a menu that just faded in feels wrong; overshoot on a card you flicked feels right."
  Valores da Apple (damping ratio / response): mover 1.0/0.4, rotação 0.8/0.4, drawer/sheet 0.8/0.3.
- **Emil:** "Keep bounce at 0.1–0.3".
- **Material 3: springs oficiais.** O Material dá damping ratio e stiffness com mass = 1. Converti para o `damping` do Motion pela fórmula `ratio × 2√k`:

| Token M3 | stiffness | ratio | Motion `{ stiffness, damping }` |
|---|---|---|---|
| fast-spatial | 1400 | 0.9 | 1400 / **67** |
| default-spatial | 700 | 0.9 | 700 / **48** |
| slow-spatial | 300 | 0.9 | 300 / **31** |
| fast-effects (opacidade/cor) | 3800 | 1.0 | 3800 / **123** |
| default-effects | 1600 | 1.0 | 1600 / **80** |
| slow-effects | 800 | 1.0 | 800 / **57** |

Lição do M3: **molas "espaciais" podem ter um leve overshoot (0.9); molas de "efeito" (opacidade, cor) nunca (1.0).** Isso casa com a regra oficial do Motion: "valores não numéricos não usam física de mola".

- **Conflito a resolver:** o Emil escreve `{ type: "spring", duration: 0.5, bounce: 0.2 }`, mas a skill oficial usa `visualDuration`. Recomendo manter `visualDuration` (documentação do Motion) e anotar a equivalência aproximada.

### 3.6 Física e origem (Emil + Vercel + Rauno): **NOVO**

- "**Never `scale(0)`.** Start from `scale(0.9–0.97)` + `opacity: 0`."
- Press: `scale(0.97)` em `:active`, 160 ms. Fique entre 0,95 e 0,98; o Rauno usa "~0.96".
- `transform-origin` no gatilho para popover, dropdown e tooltip (`var(--transform-origin)` no Base UI). **Modais são exceção** e ficam centralizados.
- Porcentagem em `translateY(100%)` move a altura do próprio elemento, como fazem o Sonner e o Vaul.
- **SVG (Vercel):** "Apply CSS transforms/animations to `<g>` wrappers & set `transform-box: fill-box; transform-origin: center;`". Corrige bugs do Safari.

O nosso `base-ui.md` usa `scale(0.9)` nos exemplos, mas não explica a regra.

### 3.7 Interrupção, gestos e momento (Emil `apple-design`, MIT): **NOVO**

- Use transitions, não keyframes, em tudo que dispara rápido (toasts, toggles), porque "Transitions retarget from the current value; keyframes restart from zero".
- **Saia pelo mesmo caminho por onde entrou.**
- **Tempo assimétrico:** a parte deliberada é lenta (hold-to-confirm: 2 s linear) e a resposta do sistema é rápida (200 ms ease-out).
- **Dispensar por velocidade:** `velocity = |distância| / ms`; dispense se `> 0.11`, não só pela distância.
- **Projeção de momento (Apple):**
  ```js
  function project(v /* px/s */, rate = 0.998) { return (v / 1000) * rate / (1 - rate); }
  ```
  Escolha o snap point mais próximo do ponto projetado. Depois passe `velocity` para a mola.
- **Rubber-band nas bordas:**
  ```js
  (overshoot * dim * 0.55) / (dim + 0.55 * Math.abs(overshoot))
  ```
- Use **pointer capture**, ignore um segundo toque e decomponha 2D em **molas X e Y independentes**.
- Uma frase que vale como regra de ouro:
  > "an interface feels alive when motion starts from the current on-screen value, inherits the user's velocity, projects momentum forward, and can be grabbed and reversed at any instant."

### 3.8 Coreografia (Motion Lexicon, MIT; GSAP só como ideia): **NOVO**

- Um **ator principal** e no máximo **dois de apoio** por beat. Cada ator tem um papel: trigger, hero, status, record ou environment.
- Um momento normal tem **3 a 5 beats perceptíveis**.
  > "Add a delay only when it reveals dependency, sequence, or a truthful process."
- Os apoios entram **depois** que o principal assenta: "Move supporting changes after the primary actor reaches a clear resting position."
- Padrões prontos: *Confirm then continue*, *Select then inspect*, *Change in place*, *Recover with agency*.
- Gramática de beat: `at | actor | purpose | primitive | from→to | durationMs | easing`. Ela serve tanto para UI quanto para roteiro de vídeo promocional.
- **Regra de corrida assíncrona:** cada intenção do usuário recebe uma versão; uma resposta antiga não pode disparar animação velha.
- **GSAP (ideia):** sequenciar com timeline e "position parameter" (`"-=0.2"`, labels) em vez de encadear `delay`. No Motion, o equivalente é `animate([...sequence])` com `at: "-0.2"` e `stagger()`, mais `delayChildren`/`staggerChildren` em variants. Confirmar a sintaxe exata no codex antes de escrever.

### 3.9 Performance além do que já temos (ibelick, MIT): **PARCIALMENTE NOVO**

Já temos: `transform` versus independentes, `will-change` temporário e alocação em callbacks de frame.

Novo:
- "do not interleave layout reads and writes in the same frame"; usar FLIP ou medir uma vez.
- "do not drive animation from scrollTop, scrollY, or scroll events". Use `useScroll` ou `animation-timeline: view()`.
- "do not animate CSS variables for transform, opacity, or position" e "do not animate inherited CSS variables". O Emil dá o caso: uma variável no pai recalcula todos os filhos.
- **Blur:** "keep blur animation small (<=8px)"; o Emil põe o limite em 20 px. Nunca use blur contínuo nem em superfícies grandes.
- Pause loops fora da tela (IntersectionObserver ou `useInView`).
- View Transitions só para mudança de navegação, não para UI interativa.
- "do not migrate or rewrite animation libraries unless explicitly requested".
- `transition: all` é sempre um achado (Emil, Vercel, ibelick).

### 3.10 Acessibilidade: **NOVO na skill (hoje está zerada)**

- **Motion (oficial):** `<MotionConfig reducedMotion="user">` desliga transform e layout e mantém opacidade e cor. `useReducedMotion()` serve para trocar `x` por `opacity`, desligar autoplay de vídeo e zerar parallax.
- **Emil:** "Reduced motion means **fewer and gentler** animations, not zero — keep transitions that aid comprehension, remove movement and position changes."
- **Apple (via Emil):** respeite também `prefers-reduced-transparency` e `prefers-contrast: more`. Evite fundos que se movem na tela inteira e oscilações lentas (cerca de 0,2 Hz).
- **Vercel / WCAG 2.2.2:** autoplay com mais de 5 s ao lado de outro conteúdo precisa de pausar, parar ou esconder.
- **Hover só em ponteiro fino:** `@media (hover: hover) and (pointer: fine)`, porque o toque dispara hover falso.
- **Troca de tema** não deve disparar transições (Rauno, só a ideia).
- **Molas `linear()` em CSS (Josh, só a ideia):**
  - coloque dentro de `@media (prefers-reduced-motion: no-preference)`;
  - use fallback com `@supports (animation-timing-function: linear(0, 1))`, trocando uma variável CSS;
  - cerca de 50 pontos ficam convincentes, cerca de 11 parecem robóticos;
  - `linear()` não carrega velocidade numa interrupção.

  Isso complementa o nosso `css-spring/`.

### 3.11 Depuração da "sensação" (Emil): **NOVO**

- Rode a 2–5× a duração ou use o painel Animations do DevTools, quadro a quadro.
- Teste gestos em aparelho real.
- Olhe de novo no dia seguinte.
- Para um crossfade "que não assenta": `filter: blur(2px)` durante a transição.

### 3.12 Contexto do Daniel: Remotion (só a ideia, sem licença aberta): **NOVO e importante**

> "Drive animations using `useCurrentFrame()` and `interpolate()`. CSS `transition` or `animation` will not render correctly" e "Don't use `transition-*` or `animate-*` classes".

Ou seja, **Motion, CSS transitions e classes Tailwind de animação não servem dentro de composições Remotion.** O que se aproveita é a direção: durações, curvas, coreografia e stagger.

Tradução prática:
- `Easing.bezier(0.23, 1, 0.32, 1)` no `interpolate()`;
- o `spring()` do Remotion usa `{ stiffness, damping, mass }`, e a tabela 3.5 serve de referência;
- converta ms para frames com `fps` de `useVideoConfig()`. Por exemplo, 250 ms a 30 fps são cerca de 8 frames.

## 4. "Já temos" versus "novo"

| Tema | Já temos (motion-oficial) | Novo (fonte) |
|---|---|---|
| Imports, MotionValues, `useTransform` | Sim | — |
| `transform` (WAAPI) versus `x/y/scale` | Sim | Reforço do Emil ("drops frames under load") |
| `will-change` temporário | Sim | Rauno/ibelick: "last resort", sem efeito preventivo |
| Springs `bounce`/`visualDuration` | Básico | Apple: crítico por padrão; M3: tokens prontos; faixa 0.1–0.3 |
| Tom por tipo de produto | 1 frase | Dial de intensidade (taste) + "cohesion" (Emil) |
| Quando NÃO animar | Não | Tabela de frequência (Emil) |
| Escolha CSS / WAAPI / Motion | Não | Emil + Vercel |
| Curvas com valores | Não | Emil + M3 |
| Tabela de durações | Não | Emil + Lexicon + M3 |
| `scale(0)`, origem, press 0,97 | Só nos exemplos do Base UI | Emil, Rauno, Vercel |
| Interrupção, gestos, momento | Não | Emil `apple-design` |
| Coreografia, beats, stagger | Não | Lexicon (+ GSAP como ideia) |
| Scroll, layout thrash, blur, variáveis CSS | Parcial (só alocação) | ibelick |
| `prefers-reduced-motion` | **Ausente** | Motion docs, Emil, Apple, Vercel |
| Revisão de "feel" e depuração | Só MotionScore (pago) | Rubrica Lexicon + depuração Emil (grátis) |
| Remotion | Não | Regra do Remotion (ideia) |

## 5. Armadilhas encontradas nas fontes (não copiar)

- **taste-skill** usa `transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1)` no nível 4–7. Isso contradiz Emil, Vercel e ibelick. Aproveite só a ideia do dial.
- **ibelick `baseline-ui`** tem "NEVER introduce custom easing curves unless explicitly requested". Isso choca com o Emil ("Built-in CSS easings are too weak"). Fica a regra do Emil, mais "use os tokens do projeto se existirem".
- **Emil** usa `duration` em vez de `visualDuration` nas molas do Motion. Normalize para a API oficial.
- **pproenca `emilkowal-animations`** é derivado do Emil. Use a fonte original.
- **Josh Comeau, Rauno e Remotion** não têm licença aberta. Não colar texto; só reescrever as ideias.

## 6. Recomendação de onde costurar

A pasta é cópia intacta do `motion-ai` 14.1.0. Então **não edite os arquivos oficiais**. Crie arquivos nossos ao lado, como fizemos com `APRENDIZADOS.md`, e aponte para eles. Precisa da aprovação do Daniel, conforme o CLAUDE.md da main.

1. **`direcao/index.md` (novo, prioridade 1):** em português, com:
   - portão de frequência e propósito (3.1);
   - ferramenta mais barata (3.2);
   - easing (3.3);
   - durações (3.4);
   - molas, incluindo a tabela M3 convertida (3.5);
   - física e origem (3.6).

   Fonte principal: Emil (MIT). Copie o texto com crédito e a nota de licença no `ORIGEM.md`.
2. **`acessibilidade/index.md` (novo, prioridade 1):** `MotionConfig reducedMotion="user"`, `useReducedMotion`, "menos e mais suave, não zero", hover só com ponteiro fino, autoplay de 5 s, transparência e contraste (3.10).
3. **`gestos/index.md` (novo, prioridade 2):** interrupção, velocidade, projeção, rubber-band, X/Y separados (3.7). Fonte: Emil `apple-design`.
4. **`coreografia/index.md` (novo, prioridade 2):** beats, atores, 3–5 beats, saída mais curta, padrões prontos, corrida assíncrona e sequência do Motion (3.8). Também serve de roteiro para os vídeos.
5. **Acrescentar ao `APRENDIZADOS.md` (prioridade 2):**
   - checklist de performance extra (3.9);
   - armadilhas (seção 5);
   - nota Remotion (3.12);
   - depuração de "feel" (3.11);
   - dica `linear()` com `@supports` e reduced-motion para o `css-spring/` (3.10).
6. **`SKILL.md`:** como é o oficial, não mexer. Anotar no `APRENDIZADOS.md` "antes de animar, leia `direcao/` e `acessibilidade/`". Se o Daniel aprovar, acrescentar uma linha de índice.
7. **Revisão grátis:** usar a rubrica do Lexicon (Critical / Important / Polish + beat plan revisado) e os "Never Ship" do Emil como alternativa ao MotionScore, que é pago.

**Licenças para o ORIGEM.md:** Emil Kowalski (MIT 2026), ibelick/ui-skills (MIT 2026), Motion Lexicon (MIT 2026), material-web tokens (Apache-2.0), Vercel WIG (MIT 2025).
