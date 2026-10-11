# Pesquisa A: o que costurar na skill `button-animation`

Data: 11/10/2026. Agente de pesquisa A. Fonte: catálogo skills.sh, consultado com `npx -y skills@1.7.2 find`.
Nada foi instalado e o repositório não foi alterado. Conteúdo baixado foi tratado só como dado.
Os clones estão em `scratchpad/hunter/downloads/A-*` (veja "Origem" de cada item).

## 1. Buscas feitas

Consultas: `button`, `micro interaction`, `ui animation`, `shadcn`, `tailwind components`, `interaction design`, `hover effects`, `loading states`, `ui polish`, `framer motion`, `animation`, `accessibility`.

Achados relevantes (instalações no dia da busca):

| Skill | Autor | Instalações |
|---|---|---|
| emil-design-eng | emilkowalski/skills | 340,6 mil |
| review-animations | emilkowalski/skills | 215,3 mil |
| apple-design | emilkowalski/skills | 201 mil |
| find-animation-opportunities | emilkowalski/skills | 171 mil |
| impeccable / animate / delight | pbakaus/impeccable | 324,4 mil / 81,7 mil / 79,8 mil |
| better-ui / better-interface / better-accessibility | jakubkrehel/skills | 34,1 mil / 26,2 mil / 25,7 mil |
| fixing-motion-performance / baseline-ui | ibelick/ui-skills | 24,6 mil / 22 mil |
| interaction-design | wshobson/agents | 15,5 mil |
| design-motion-principles | kylezantos | 11,4 mil (não baixada) |
| framer-motion-animator | patricio0312rev | 10,7 mil (não baixada; autor pouco conhecido) |
| microinteractions | wondelai/skills | 6,1 mil (não baixada) |
| web-design-guidelines | vercel-labs/agent-skills | 719,9 mil (geral demais, não baixada) |
| shadcn | shadcn-ui/ui | 370,4 mil (componentes, não animação) |

A busca por `hover effects` só trouxe skills pequenas (menos de 2 mil), exceto a `impeccable@animate`.

## 2. Candidatas avaliadas (baixadas e lidas)

| # | Skill(s) | Repositório | Instalações | Licença | Link | Nota |
|---|---|---|---|---|---|---|
| 1 | emil-design-eng + animate (RECIPES.md) + review-animations (STANDARDS.md) + find-animation-opportunities + apple-design | `emilkowalski/skills` (commit e8a175d, 02/10/2026) | 340,6 mil (a principal) | **MIT** (Emil Kowalski, 2026) | https://skills.sh/emilkowalski/skills/emil-design-eng | **10** |
| 2 | better-ui (animations.md, icon-transitions.md) + better-accessibility (hit-areas.md, motion-and-zoom.md, focus-and-keyboard.md) | `jakubkrehel/skills` (c0588bb, 10/10/2026) | 34,1 mil | **MIT** (Jakub Krehel, 2026) | https://skills.sh/jakubkrehel/skills/better-ui | **9** |
| 3 | interaction-design (references/microinteraction-patterns.md) | `wshobson/agents` (46891e7) | 15,5 mil | **MIT** (Seth Hobson, 2024) | https://skills.sh/wshobson/agents/interaction-design | **6,5** |
| 4 | fixing-motion-performance + baseline-ui | `ibelick/ui-skills` (d036a68) | 24,6 mil / 22 mil | **MIT** (Julien Thibeaut, 2026) | https://skills.sh/ibelick/ui-skills/fixing-motion-performance | **6** |
| 5 | impeccable (reference/animate.md, delight.md, polish.md, craft-floor.md) | `pbakaus/impeccable` (c63b8dd) | 81,7 mil (animate) | **Apache-2.0** (pede NOTICE se copiar texto) | https://skills.sh/pbakaus/impeccable/animate | **5** |

Por que essas notas:
- **Emil Kowalski** é o autor do Sonner e do Vaul e trabalhou na Vercel e no Linear. A skill é a mais específica sobre botões e micro-interações: tem números exatos, curvas, tabela de durações, receitas e lista de "nunca faça". É a melhor fonte, de longe.
- **Jakub Krehel** traz valores exatos e receitas Tailwind e Motion prontas (escala 0,96, troca de ícone, tema, área de toque). É a mais próxima do nosso estilo (Tailwind + `motion/react`).
- **wshobson** é o único com o **botão de estados completo** (ocioso, carregando, sucesso, erro). Só que o código tem vícios (importa de `framer-motion`, entra de `scale: 0`, sem movimento reduzido), então vale a ideia e não o código.
- **ibelick** tem regras de desempenho curtas e boas (blur no máximo 8 px, nada de animar variável CSS herdada).
- **Impeccable** é filosófica, com poucos números para botões. Serve para a "tese" de movimento e para a lista de estados obrigatórios.

## 3. Partes a aproveitar (com trechos e origem)

### 3.1 Porteiro de frequência: "isso deve animar?" (NOVO)

Origem: `emilkowalski/skills`, `skills/emil-design-eng/SKILL.md` e `skills/animate/SKILL.md`.

| Frequência | Decisão |
|---|---|
| 100+ vezes por dia (atalho de teclado, paleta de comandos) | Nenhuma animação |
| Dezenas por dia (hover, navegar em lista) | Quase imperceptível ou nada |
| Ocasional (modal, gaveta, toast) | Animação padrão |
| Raro ou primeira vez (onboarding, sucesso, comemoração) | Aqui cabe o "encanto" |

> "Never animate keyboard-initiated actions." (emil-design-eng)

Também propõe nomear o **propósito** antes de animar: feedback, consistência espacial, indicação de estado, evitar mudança brusca, explicação ou encanto.

### 3.2 Tabela de durações por elemento (NOVO; a nossa só diz "120 a 250 ms")

Origem: Emil, `review-animations/STANDARDS.md`.

| Elemento | Duração |
|---|---|
| Feedback de toque no botão | 100–160 ms |
| Tooltip, popover pequeno | 125–200 ms |
| Dropdown, select | 150–250 ms |
| Modal, gaveta | 200–500 ms |
| Marketing ou explicativo | pode ser mais longo |

> "UI animations stay under 300ms." Concorda com Impeccable (100–150 ms para feedback imediato) e wshobson.
> ibelick (`baseline-ui`) é mais rígido: "NEVER exceed `200ms` for interaction feedback".

### 3.3 Curvas fortes como tokens (NOVO)

Origem: Emil.

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);      /* entrar e sair: UI */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);  /* mover na tela */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);   /* gaveta estilo iOS */
```

Árvore de decisão: entrando ou saindo usa `ease-out`; movendo na tela, `ease-in-out`; hover ou cor, `ease`; movimento constante (barra de progresso), `linear`. **Nunca `ease-in` em UI.**
Alternativas: Jakub usa `cubic-bezier(0.2, 0, 0, 1)` para trocas de ícone; Impeccable usa `cubic-bezier(0.16, 1, 0.3, 1)` para chegadas.
Para o Daniel no Remotion: `Easing.bezier(0.23, 1, 0.32, 1)` reproduz o mesmo toque.

### 3.4 Escala do toque: 0,96–0,97 e nunca no botão desativado (PARCIALMENTE NOVO)

- Emil (`animate/RECIPES.md`): `.button:active { transform: scale(0.97) }` com `transition: transform 160ms var(--ease-out)`. Faixa aceitável: 0,95–0,98.
- Jakub (`better-ui/animations.md`): valor exato **0,96**, 150 ms, `ease-out`, e "a disabled one never scales":

```tsx
<button className="transition-transform duration-150 ease-out enabled:active:scale-[0.96]">…</button>
<motion.button whileTap={disabled ? undefined : { scale: 0.96 }} disabled={disabled}>…</motion.button>
```

- Jakub também sugere um prop `static` para desligar a escala onde ela distrai.
- Jakub marca como defeito: `active:scale-95`, `scale-90` ou `whileTap` abaixo de 0,96.

**Já temos:** `active:scale-[0.97]` e "toque com escala de pelo menos 0,95".
**Novo:** `enabled:active:` (não encolher quando desativado), o prop `static` e a faixa 0,96–0,97 como padrão.

### 3.5 Hover só em ponteiro que tem hover (NOVO)

Origem: Emil e Jakub.

```css
@media (hover: hover) and (pointer: fine) {
  .element:hover { transform: scale(1.05); }
}
```

> Jakub: "On touch, `:hover` latches after a tap and reads as a stuck selected state. Tailwind 4's `hover:` variant already compiles under that query, and Tailwind 3's does not."

Também de Jakub: `-webkit-tap-highlight-color: transparent` quando o controle desenha o próprio estado pressionado.

### 3.6 Nunca `transition: all` (NOVO; e a nossa receita 1 viola isso)

Emil e Jakub: nomeie as propriedades (`transition-property: scale, opacity`).
**Atenção:** a nossa receita 1 usa `transition-all duration-150`. A troca seria por `transition-[background-color,scale]` (Tailwind 4) ou `transition-[background-color,transform]` (Tailwind 3).

### 3.7 Popover nasce do gatilho (NOVO)

Emil:

> "Popovers should scale in from their trigger, not from center. … Exception: modals."

```css
.popover { transform-origin: var(--transform-origin); } /* Base UI fornece a variável; no Radix é --radix-popover-content-transform-origin */
```

Nossa receita 3 (popover com mola) não define `transform-origin`. Nota: a variável do Radix vem do meu conhecimento, não da fonte, e precisa ser conferida.
Ainda de Emil: **nunca entrar de `scale(0)`**. Comece de 0,9–0,97 junto com `opacity: 0`. A nossa receita já usa 0,98, então está certa.

### 3.8 Botão com estados: ocioso, carregando, sucesso, erro (NOVO)

Origem da ideia: wshobson, `references/microinteraction-patterns.md` ("Loading Button", "Success/Error State").

```tsx
const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
// loading: disabled, spinner + "Enviando…"; success/error: volta para idle em 2 s
```

O código original tem falhas: importa de `framer-motion`, o ícone entra com `scale: 0, rotate: -180` (o que Emil proíbe) e não tem movimento reduzido. Para costurar, corrija com a troca de ícone de Jakub (3.9) e com a regra de Impeccable (`harden.md`):

> "Prevent double-submission (disable button while loading)".

Do Jakub vem uma regra importante:

> "Every animated state change also leaves a static cue in the form of a color, icon or label. Motion is never the only feedback channel."

Sugestão nossa (não está nas fontes, conferir): `aria-busy` e um texto em `aria-live="polite"` para leitores de tela anunciarem "Enviado".

### 3.9 Troca de ícone com valores exatos (NOVO)

Origem: Jakub, `better-ui/icon-transitions.md`. Exemplos: copiar e copiado, play e pause, curtir e curtido, carregando e sucesso.

```tsx
<AnimatePresence initial={false} mode="popLayout">
  <motion.span key={isActive ? "active" : "inactive"}
    initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
    exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
    transition={{ type: "spring", duration: 0.3, bounce: 0 }} />
</AnimatePresence>
```

- Também há uma versão só CSS: os dois ícones ficam no mesmo `grid-area`, com 300 ms e `cubic-bezier(0.2,0,0,1)`.
- **Não anime:** ícones de aba ou navegação, nem ações que aparecem no hover de linhas (alta frequência).
- **`initial={false}`:** evita que o estado padrão anime ao carregar a página. Não use em entradas intencionais.

### 3.10 Segurar para confirmar, com tempo assimétrico (NOVO)

Origem: Emil, `animate/RECIPES.md` ("Hold to confirm").

```css
.overlay { clip-path: inset(0 100% 0 0); transition: clip-path 200ms var(--ease-out); } /* soltar: rápido */
.button:active .overlay { clip-path: inset(0 0 0 0); transition: clip-path 2s linear; } /* segurar: lento */
.button:active { transform: scale(0.97); }
```

> "slow where the user is deciding, fast where the system is responding."

Serve para "excluir" e outras ações destrutivas. Também é ótimo em vídeo promocional: o preenchimento é uma barra de progresso legível.

### 3.11 Desfoque para disfarçar crossfade (NOVO)

Emil: `filter: blur(2px)` com `opacity: 0.7` durante a troca de conteúdo do botão (por exemplo, trocar o rótulo). "Keep blur under 20px". O ibelick é mais rígido: animar blur no máximo até 8 px e só uma vez, nunca em loop.

### 3.12 Movimento reduzido: "menos, não zero" (PARCIALMENTE NOVO)

- Emil e Impeccable: "Reduced motion means fewer and gentler animations, not zero".
- Jakub (`motion-and-zoom.md`), o que fazer com cada tipo de animação:

| Desligar | Trocar | Manter |
|---|---|---|
| Parallax, loops decorativos | Deslizar ou escalar vira crossfade de opacidade | Spinner e progresso, feedback curto de toque |

- **Armadilha:** "`<MotionConfig reducedMotion="user">` … turns off transform and layout animations … Blur still runs there". Onde houver `filter`, use `useReducedMotion()`.
- **Tailwind:** prefixos `motion-safe:` e `motion-reduce:`.

**Já temos:** `useReducedMotion`, `MotionConfig` e a media query.
**Novo:** a tabela acima, a regra de crossfade e a armadilha do blur.

### 3.13 Área de toque mínima sem mudar o visual (NOVO)

Origem: Jakub, `better-accessibility/hit-areas.md`. Os mínimos: WCAG AA 24×24 px, AAA e Apple 44×44, Material 48×48.

```tsx
<button aria-label="Concluir" className="relative size-5 after:absolute after:top-1/2 after:left-1/2 after:size-11 after:-translate-1/2">…</button>
```

E para camadas decorativas sobre o botão (como o nosso anel de gradiente, se ficar por cima): `pointer-events: none` mais `aria-hidden="true"`.

### 3.14 Foco visível bem feito (PARCIALMENTE NOVO)

Origem: Jakub, `focus-and-keyboard.md`. "Best: keep the browser ring, just give it breathing room":

```css
:focus-visible { outline-offset: 2px; }
```

Ou use um anel customizado com um token de cor verificado. Confira o contraste em todo o contorno e no modo `forced-colors`. Para sombras, Jakub manda manter `border: 1px solid transparent`, porque o modo de alto contraste remove `box-shadow`.
**Já temos:** "tenha `:focus-visible`". **Novo:** os detalhes acima.

### 3.15 Desligar transições ao trocar de tema (NOVO)

Origem: Jakub, `better-ui/animations.md`. Ao trocar claro e escuro, todas as transições de cor disparam juntas e borram a tela. No `next-themes`, use `disableTransitionOnChange`. Também há uma receita manual: injetar `*{transition:none!important}`, forçar o reflow e remover depois de dois `requestAnimationFrame`. Relevante porque a nossa regra 4 exige tema claro e escuro.

### 3.16 Transição em vez de keyframes para estado interativo (NOVO como regra)

Emil e Jakub: transições podem ser interrompidas e revertidas, e keyframes recomeçam do zero. Keyframes ficam só para efeitos de uma vez, como o nosso "pop" (receita 5, que está correta). Jakub marca como defeito um `animation:` disparado em `:hover` ou numa classe que liga e desliga.

### 3.17 Desempenho (ibelick, Emil) (PARCIALMENTE NOVO)

- "do not animate inherited CSS variables". Emil diz o mesmo: mudar uma variável no pai recalcula todos os filhos.
  - **Atenção:** a nossa receita 2 anima `--ring-a`. Ela é registrada com `inherits: false` e fica numa camada isolada, então está OK. Vale registrar o porquê.
- "pause looping animations when off-screen". O nosso anel gira em loop só com o foco ativo, então está OK.
- **Já temos (Motion oficial):** preferir `transform` em string às abreviações `x`/`scale`. Emil confirma: "Framer Motion shorthands are NOT hardware-accelerated".

### 3.18 Outras ideias úteis

- **Tooltip instantâneo depois do primeiro (Emil):** use `.tooltip[data-instant] { transition-duration: 0ms }`.
- **Escalonar entradas:** Emil indica 30–80 ms entre itens. Jakub indica 100 ms entre blocos semânticos, com blur de 4 px e `translateY` de 12 px em 300 ms. A saída é menor e mais curta (150 ms, −12 px).
- **Responder no pressionar, não no soltar (Emil, `apple-design`):** "Respond on pointer-down, not on release."
- **Mola padrão "criticamente amortecida" (apple-design):** `bounce: 0`, `duration 0.3–0.4`. A mola com quique (`bounce ≈ 0.2`) fica para gestos com impulso.
- **Formato de revisão (Emil):** tabela "Antes | Depois | Por quê", útil para um modo "revisar animação" na nossa skill.
- **`animation-vocabulary` (Emil):** glossário que converte uma descrição vaga no nome técnico do efeito (Pop in, Rubber-banding, Origin-aware). É útil para o Daniel pedir efeitos com o nome certo, tanto para a IA quanto em vídeo.

## 4. "Já temos" vs "Novo"

| Tema | Já temos | Novo (fonte) |
|---|---|---|
| Escala no toque | `active:scale-[0.97]`, mínimo 0,95 | 0,96–0,97 padrão; `enabled:active:`; prop `static` (Jakub, Emil) |
| Hover | `hover:`, `whileHover` 1,03 | Restringir a `(hover: hover) and (pointer: fine)`; tap-highlight (Emil, Jakub) |
| Durações | "120 a 250 ms" | Tabela por elemento; feedback 100–160 ms; UI < 300 ms (Emil) |
| Curvas | `easeOut`, `circOut` | Tokens `--ease-out` / `--ease-in-out` / `--ease-drawer`; nunca `ease-in` (Emil) |
| Molas | tabela de molas, `visualDuration` + `bounce` | Padrão `bounce: 0` (Jakub, apple-design); quique só em gesto |
| Popover | mola + AnimatePresence | `transform-origin` no gatilho; modal fica no centro (Emil) |
| Estados do botão | hover, toque, disabled, foco | carregando, sucesso, erro; bloquear duplo envio; pista estática além do movimento (wshobson, Impeccable, Jakub) |
| Troca de ícone | não temos | valores exatos 0,25 + blur 4 px + mola 0,3 s sem quique (Jakub) |
| Ações destrutivas | não temos | segurar para confirmar com `clip-path`, 2 s linear e 200 ms na volta (Emil) |
| Movimento reduzido | desligar | "menos, não zero"; crossfade; tabela; armadilha do blur no `MotionConfig` (Emil, Jakub) |
| Acessibilidade | foco visível | área de toque de 44 px por pseudo-elemento; `pointer-events: none` em camadas decorativas; `outline-offset` (Jakub) |
| Tema | variantes `dark:` | desligar transições na troca de tema (Jakub) |
| Quando animar | não temos | porteiro de frequência e propósito (Emil) |
| Revisão | não temos | checklist "nunca entregue" e tabela Antes / Depois / Por quê (Emil, Jakub) |
| Desempenho | só `transform` e `opacity`; `will-change` com moderação | blur ≤ 8 px e só uma vez; não animar variável herdada; pausar loops fora da tela (ibelick) |

### Conflitos a resolver com o Daniel

1. **`transition-all`:** a nossa receita 1 usa, e Emil e Jakub proíbem. Recomendo corrigir.
2. **Quique no toque:** usamos `bounce: 0.2` no `whileTap`, e Jakub manda `bounce: 0` sempre. Proposta: `bounce: 0` como padrão e 0,2 só em app "divertido", o que já casa com a nossa regra "escolha pelo tipo de produto".
3. **Gradientes e anéis:** `ibelick/baseline-ui` diz "NEVER use gradients unless explicitly requested", e a Impeccable lista "progress rings" como muleta visual. Não muda nada para nós, porque o anel é um efeito pedido e intencional, mas vale uma nota: use o anel como foco ou destaque, não como enfeite em todo botão.
4. **Curvas customizadas:** ibelick diz "NEVER introduce custom easing curves unless explicitly requested", e Emil diz o contrário ("built-in CSS easings are too weak"). Fico com Emil, que é mais especializado em movimento.
5. **Ícone entrando de 0,25:** Jakub usa `scale 0.25` com blur, e Emil diz para começar de 0,9 ou mais. Para ícones pequenos com blur, o 0,25 do Jakub funciona e é um valor testado. Registrar a exceção.

## 5. Recomendação: onde costurar

Respeitando a regra de não mudar skills sem aprovação do Daniel:

1. **`SKILL.md`, nova seção "Antes de animar"** (curta): porteiro de frequência e propósito, mais a tabela de durações (Emil, MIT).
2. **`SKILL.md`, "Receitas":**
   - **receita 1:** trocar `transition-all` por propriedades nomeadas, `active:` por `enabled:active:`, escala 0,96–0,97, hover restrito e tap-highlight;
   - **receita 3:** adicionar `transform-origin` do gatilho;
   - **receitas novas:** 7 "Botão com estados (carregando, sucesso, erro)", 8 "Troca de ícone", 9 "Segurar para confirmar" e 10 "Tooltip instantâneo".
3. **`SKILL.md`, "Molas":** linha "padrão de UI: `bounce: 0`, `visualDuration 0.3`", mais os tokens de curva CSS.
4. **`SKILL.md`, "Regras ao animar botões":** acrescentar "nunca `transition: all`", "nunca `ease-in`", "hover só com `(hover: hover)`", "área de toque ≥ 44 px", "movimento nunca é o único sinal", "movimento reduzido = crossfade, não zero" e "desligar transições na troca de tema".
5. **Novo `references/checklist-revisao.md`:** a tabela "nunca entregue" e o formato Antes / Depois / Por quê, para revisar animações.
6. **Novo `assets/status-button.tsx`:** componente pronto com `motion/react`, os quatro estados, troca de ícone, `enabled:active:scale-[0.96]` e movimento reduzido. Precisa ser escrito e testado no TypeScript estrito, como os outros assets.
7. **Seção "Em vídeos do Remotion":** levar `Easing.bezier(0.23, 1, 0.32, 1)`, o "segurar para confirmar" e a troca de ícone com blur como batidas de vídeo.
8. **Créditos:** na seção de origem ou num `ORIGEM.md`, citar Emil Kowalski (MIT), Jakub Krehel (MIT), Seth Hobson (MIT) e Julien Thibeaut (MIT), com links. Se for copiar texto literal da Impeccable (Apache-2.0), incluir o aviso. Recomendo só parafrasear as ideias dela.
9. **Opcional, como skills inteiras de terceiros** (pela receita "Instalar uma skill de terceiros"): `emilkowalski/skills@review-animations` e `@animation-vocabulary` merecem entrar na base por conta própria. Antes, leia o `SKILL.md` completo; as duas começam com uma "Initial Response" fixa, que talvez convenha remover num adendo.

## 6. Resumo em 10 linhas

1. Busquei 12 termos no skills.sh e baixei e li 5 repositórios. Todos têm licença (4 MIT e 1 Apache-2.0).
2. A melhor fonte é `emilkowalski/skills` (emil-design-eng, 340 mil instalações; autor do Sonner e do Vaul), com nota 10.
3. Em segundo vem `jakubkrehel/skills@better-ui`/`better-accessibility` (34 mil, MIT), com valores exatos em Tailwind e Motion, nota 9.
4. As outras: `wshobson@interaction-design` (botão com estados, nota 6,5), `ibelick` (desempenho, nota 6) e `impeccable` (filosofia, nota 5).
5. Novidades principais: o porteiro "isso deve animar?" por frequência e a tabela de durações por elemento.
6. Curvas fortes como tokens (`cubic-bezier(0.23,1,0.32,1)`), nunca `ease-in` e nunca `transition: all`.
7. Toque a 0,96–0,97 só quando o botão está ativo (`enabled:active:`), e hover só em `(hover: hover) and (pointer: fine)`.
8. Receitas novas: botão carregando / sucesso / erro, troca de ícone (0,25 + blur 4 px, mola 0,3 s sem quique), segurar para confirmar e tooltip instantâneo.
9. Acessibilidade nova: área de toque de 44 px, movimento reduzido como crossfade (não zero), armadilha do blur no `MotionConfig` e desligar transições ao trocar de tema.
10. Achei um conflito: a nossa receita 1 usa `transition-all`. Recomendo costurar em `SKILL.md`, num checklist novo e num asset `status-button.tsx`, com aprovação do Daniel.

Arquivo: `/tmp/claude-0/-home-user-claude-skills/a0fff76b-036f-52aa-aae0-78ee08fe2860/scratchpad/hunter/button-animation/pesquisa-A.md`
