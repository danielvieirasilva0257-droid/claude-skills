# Pesquisa B: button-animation (fontes fora do skills.sh)

Data: 11/10/2026. Agente B. Os downloads estão em `scratchpad/hunter/downloads/*-B/`. Nada foi executado nem instalado, e nada foi alterado em `/home/user/claude-skills-main`.

## 1. Tabela de fontes

| # | Fonte | Link | Licença | Atualizado | Nota | Por quê |
|---|---|---|---|---|---|---|
| 1 | **Emil Kowalski: skills** (`animate`, `review-animations`, `emil-design-eng`) | github.com/emilkowalski/skills | MIT | 02/10/2026 | **10** | É a melhor fonte de todas. Traz um portão de decisão ("deve animar?"), tabelas de duração e curva, receitas (press, hold-to-confirm, tooltip, abas com clip-path) e uma lista do que nunca enviar. |
| 2 | **Magic UI** (shimmer, ripple, shine-border, rainbow, subscribe) | github.com/magicuidesign/magicui | MIT | 2026 | **9** | Receitas premium prontas, já com `motion/react` e Tailwind v4. Tem uma skill própria (`skills/magic-ui`). |
| 3 | **Vercel Web Interface Guidelines** | github.com/vercel-labs/web-interface-guidelines | MIT | 2025–26 | **9** | Regras de foco, alvo de toque, botão de loading (tempo mínimo e atraso) e "nunca `transition: all`". |
| 4 | **design-motion-principles** (Emil + Jakub Krehel + Jhey Tompkins) | github.com/kylezantos/design-motion-principles | MIT | 2026 | **8** | Troca de ícone com blur, "saída mais sutil que entrada", lista de erros típicos de IA ao criar motion, `linear()` e `@property`. |
| 5 | **Material 3 / AndroidX tokens** | github.com/androidx/androidx (`compose/material3/.../tokens`) | Apache-2.0 | main | **8** | Números oficiais: opacidade das camadas de estado e molas "Expressive" e "Standard". |
| 6 | **Motion Primitives** (Magnetic, BorderTrail, GlowEffect, TextMorph) | github.com/ibelick/motion-primitives | MIT | 2025–26 | **8** | Botão magnético, borda com rastro (`offset-path`) e texto que se transforma. |
| 7 | **Animata** (status-button, duolingo, swipe, shining) | github.com/codse/animata | MIT | 2026 | **7** | Loading→sucesso pronto, botão 3D "Duolingo" e troca de texto no hover. |
| 8 | **motion-lexicon** (skill) | github.com/Ryan-yang125/motion-lexicon | MIT | 19/08/2026 | **7** | Primitivas de feedback com duração e alternativa para reduced motion, mais tokens CSS. |
| 9 | **wshobson/agents: interaction-design** | github.com/wshobson/agents (plugins/ui-design) | MIT | set/2026 | **6** | Loading button, sucesso/erro, shake e atualização otimista. Ainda importa de `framer-motion`, então precisa adaptar. |
| 10 | **dylantarre/animation-principles: buttons-ctas** | github.com/dylantarre/animation-principles | MIT | 2026 | **5** | Os 12 princípios da Disney aplicados a botões, com tempos e shake. Alguns conselhos **conflitam** com o Emil (veja a seção 5). |
| 11 | **Rauno Freiberg: interfaces** | github.com/raunofreiberg/interfaces | **sem licença** (só ideias) | 2023 | **6** | Regras clássicas: interação ≤ 200 ms, escala proporcional ao gatilho e loops pausam fora da tela. |
| 12 | **React Bits** (ClickSpark, StarBorder, Magnet) | github.com/DavidHDev/react-bits | MIT + **Commons Clause** | 2026 | **5** | Pode usar em apps, mas não pode revender o código. O StarBorder agora é canvas pesado. Vale pelo ClickSpark (faíscas no clique). |
| 13 | **anthropics/skills: frontend-design** | github.com/anthropics/skills | Apache-2.0 | 2026 | **5** | Pouca coisa de botão, mas traz uma regra boa sobre motion "genérico de IA". |
| 14 | shadcn/ui Button (via Magic UI) | ui.shadcn.com | MIT | 2026 | 5 | Padrão de foco `focus-visible:ring-[3px] ring-ring/50` e `aria-invalid`. |

As listas "awesome" (ComposioHQ, travisvn, VoltAgent) só serviram para descobrir o motion-lexicon. O resto delas é genérico.

---

## 2. Partes a aproveitar (com trechos e origem)

### 2.1 Portão de decisão: "deve animar?" (Emil, `animate/SKILL.md`, MIT): NOVO

| Frequência | Decisão |
|---|---|
| 100+ vezes/dia (atalho de teclado, paleta de comandos) | **Sem animação** |
| Dezenas/dia (hover, navegação em lista) | Quase imperceptível, ou nada |
| Ocasional (modal, drawer, toast) | Animação padrão |
| Raro ou primeira vez (onboarding, sucesso, celebração) | Aqui entra o "orçamento de encanto" |

O propósito tem que caber numa palavra: feedback, consistência espacial, estado, evitar salto, explicação ou encanto (este, só no nível raro). Ações iniciadas pelo teclado não animam.

### 2.2 Tabela de duração e curvas fortes (Emil): PARCIALMENTE NOVO

```css
--ease-out:    cubic-bezier(0.23, 1, 0.32, 1);    /* UI forte */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);   /* mover/morph na tela */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);    /* drawer estilo iOS */
```

| Elemento | Duração |
|---|---|
| Feedback de toque no botão | 100–160 ms |
| Tooltip, popover pequeno | 125–200 ms |
| Dropdown, select | 150–250 ms |
| Modal, drawer | 200–500 ms |

- **Nunca use `ease-in` em UI.** Ele começa devagar justamente no momento em que o usuário está olhando.
- **Curvas nativas são fracas.** Use as curvas acima.
- **Saída mais rápida que entrada.** O motion-lexicon usa `--motion-arrive: 240ms`, `--motion-leave: 150ms` e `--motion-feedback: 150ms`.

Já temos a faixa de 120–250 ms. As curvas cúbicas nomeadas e a tabela por elemento são novas.

### 2.3 Hover só em mouse de verdade (Emil e Vercel): NOVO

```css
@media (hover: hover) and (pointer: fine) {
  .btn:hover { transform: translateY(-1px); }
}
```

No toque, o hover dispara falso ao tocar. **No Tailwind v4, a variante `hover:` já vem dentro de `@media (hover: hover)`**. No v3, é preciso configurar isso. No Motion, `whileHover` já ignora eventos de toque, mas convém documentar.

### 2.4 Botão de loading → sucesso (Animata `status-button` + Jakub + Vercel + motion-lexicon): NOVO

Receita costurada:

```tsx
"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type S = "idle" | "loading" | "success";
const swap = { initial: { opacity: 0, scale: 0.8, filter: "blur(4px)" },
               animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
               exit:    { opacity: 0, scale: 0.8, filter: "blur(4px)" } };

export function ActionButton({ state, label, onClick }: { state: S; label: string; onClick: () => void }) {
  const reduce = useReducedMotion();
  return (
    <button onClick={onClick} disabled={state !== "idle"} aria-busy={state === "loading"}
      className="relative inline-flex h-10 min-w-40 items-center justify-center rounded-lg bg-zinc-900 px-5 text-sm font-semibold text-white transition-transform duration-150 active:scale-[0.97] disabled:cursor-default dark:bg-white dark:text-zinc-900">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={state} {...(reduce ? {} : swap)}
          transition={{ type: "spring", visualDuration: 0.2, bounce: 0 }}
          className="inline-flex items-center gap-2">
          {state === "loading" ? <>Salvando…</> : state === "success" ? <>✓ Salvo</> : label}
        </motion.span>
      </AnimatePresence>
      <span role="status" aria-live="polite" className="sr-only">{state === "success" ? "Salvo" : ""}</span>
    </button>
  );
}
```

Regras que vêm junto:
- **Largura fixa** (`min-w-*`) para a geometria não pular (motion-lexicon: "keep the initiating control's geometry stable").
- **Mantenha o rótulo original** e use reticências: "Salvando…" (Vercel).
- **Spinner com atraso de 150–300 ms e tempo mínimo de 300–500 ms**, para não piscar quando a resposta é rápida (Vercel).
- **Desabilite durante o envio** para evitar duplo envio (Rauno).
- **Troca de ícone com opacidade, escala 0,8 e blur de 4 px** (Jakub). O blur "cola" os dois estados e evita parecer dois objetos se cruzando (Emil: blur < 20 px).
- **Spinner rápido** dá sensação de carregamento mais rápido (Emil, "perceived performance").

### 2.5 Shimmer (Magic UI `shimmer-button`, MIT): NOVO

Um feixe cônico gira dentro de um container que desliza. Os keyframes que faltam no componente estão no `globals.css`:

```css
--animate-shimmer-slide: shimmer-slide var(--speed) ease-in-out infinite alternate;
--animate-spin-around: spin-around calc(var(--speed) * 2) infinite linear;
@keyframes shimmer-slide { to { transform: translate(calc(100cqw - 100%), 0); } }
@keyframes spin-around {
  0% { transform: translateZ(0) rotate(0) }
  15%,35% { transform: translateZ(0) rotate(90deg) }
  65%,85% { transform: translateZ(0) rotate(270deg) }
  100% { transform: translateZ(0) rotate(360deg) } }
```

O feixe é `conic-gradient(from calc(270deg - var(--spread)*.5), transparent 0, var(--shimmer-color) var(--spread), transparent var(--spread))` com `--spread: 90deg`, `--speed: 3s` e `blur-[2px]`. O fundo interno fica em `inset: var(--cut)` (0,05em), e por isso só a borda brilha.

O brilho interno é `shadow-[inset_0_-8px_10px_#ffffff1f]`, que passa para `-6px …3f` no hover e `-10px …3f` no active.

**Armadilha:** o original não respeita reduced motion. Adicione `motion-safe:` às classes `animate-*`.

**Variante só com Tailwind** (Animata `shining-button`): uma faixa `bg-white/10 rotate-[30deg]` vai de `-left-16` até `left-[calc(100%+1rem)]` em 700 ms só no hover. Não usa loop, o que é melhor para apps.

### 2.6 Borda de gradiente "de verdade" com máscara (Magic UI `shine-border`): NOVO

Complementa o nosso anel cônico. Pinta **só a borda**, sem camada maior atrás:

```css
padding: var(--border-width);
mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
mask-composite: exclude;            /* -webkit-mask-composite: xor; */
background-image: radial-gradient(transparent, transparent, <cores>, transparent, transparent);
background-size: 300% 300%;
animation: shine 14s linear infinite; /* background-position 0%→100%→0% */
```

Também traz `motion-safe:animate-shine` e `will-change-[background-position]`. Uma alternativa é o **Rainbow button**: uma borda em `background-clip: padding-box, border-box` com 3 camadas e um brilho borrado (`before:` com `blur(0.75rem)`) embaixo do botão.

### 2.7 Rastro na borda com `offset-path` (Motion Primitives `BorderTrail`, MIT): NOVO

```tsx
<div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent
  [mask-clip:padding-box,border-box] [mask-composite:intersect]
  [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]">
  <motion.div className="absolute aspect-square bg-zinc-500" style={{ width: 60, offsetPath: "rect(0 auto auto 0 round 60px)" }}
    animate={{ offsetDistance: ["0%", "100%"] }} transition={{ repeat: Infinity, duration: 5, ease: "linear" }} />
</div>
```

Um "cometa" percorre o contorno. Fica ótimo em vídeo de produto. No Remotion, use `offsetDistance = interpolate(frame, …)`.

### 2.8 Botão magnético (Motion Primitives `Magnetic`): NOVO

```ts
const SPRING = { stiffness: 26.7, damping: 4.1, mass: 0.2 }; // intensity 0.6, range 100px
// x.set(dx * intensity * (1 - dist/range)) dentro do raio; volta a 0 ao sair
```

Envolva o botão (`<Magnetic><button/></Magnetic>`). Os valores passam por `useSpring` de `useMotionValue`.

**Armadilhas:**
- O original escuta `mousemove` no `document` o tempo todo. É melhor ligar o listener só durante o hover.
- Desligue com `useReducedMotion()` e com `(pointer: coarse)`.
- Emil: é decorativo, então serve para landing page e não para app financeiro.

O React Bits `Magnet` é parecido (Commons Clause).

### 2.9 Ripple com posição do clique (Magic UI `ripple-button`): JÁ TEMOS EM VÍDEO, NOVO NO APP

```ts
const size = Math.max(rect.width, rect.height);
const x = e.clientX - rect.left - size / 2, y = e.clientY - rect.top - size / 2;
// span absoluto rounded-full, opacity .3, animate-rippling 600ms ease-out: scale(0→2), opacity 1→0
```

O span é removido depois de `duration`. No Material, a cor da camada de estado tem opacidade fixa (2.12).

### 2.10 Segurar para confirmar (Emil `RECIPES.md`): NOVO

```css
.overlay { clip-path: inset(0 100% 0 0); transition: clip-path 200ms var(--ease-out); } /* soltar: rápido */
.button:active .overlay { clip-path: inset(0 0 0 0); transition: clip-path 2s linear; } /* segurar: lento */
.button:active { transform: scale(0.97); }
```

Serve para ações destrutivas. O `linear` está certo aqui porque é uma barra de progresso. O tempo é **assimétrico**: lento na fase deliberada e rápido na resposta.

### 2.11 Erro: shake contido (dylantarre, wshobson, motion-lexicon): NOVO

Amplitude de 3–5 px, 2–3 ciclos, 160–200 ms, **uma vez só**. Em reduced motion, sem deslocamento: mostre só o estado e a mensagem do erro.

```tsx
animate={error ? { x: [0, -4, 4, -4, 4, 0] } : { x: 0 }} transition={{ duration: 0.2 }}
```

### 2.12 Camadas de estado do Material 3 (AndroidX `StateTokens.kt`, Apache-2.0): NOVO

| Estado | Opacidade da camada (cor do conteúdo por cima do botão) |
|---|---|
| Hover | **0,08** |
| Focus | **0,10** |
| Pressed | **0,10** |
| Dragged | **0,16** |
| Disabled | conteúdo 0,38 / container 0,12 (spec M3; não estava neste arquivo) |

Em Tailwind: `before:absolute before:inset-0 before:bg-current before:opacity-0 hover:before:opacity-[.08] focus-visible:before:opacity-10 active:before:opacity-10`. É uma alternativa elegante a trocar a cor de fundo, porque funciona com qualquer cor de marca.

### 2.13 Molas do Material 3 convertidas para o Motion (AndroidX, Apache-2.0): NOVO

No Compose, `damping` é a *razão* de amortecimento ζ com massa 1. No Motion, `damping` é o coeficiente, calculado como `c = ζ · 2√k`.

| Token M3 | stiffness | ζ | **Motion `damping`** | Uso |
|---|---|---|---|---|
| Expressive fastSpatial | 800 | 0,6 | **34** | toque/botão "divertido" (quica) |
| Expressive defaultSpatial | 380 | 0,8 | **31** | movimentos médios com leve quique |
| Expressive slowSpatial | 200 | 0,8 | **23** | elementos grandes |
| Standard fastSpatial | 1400 | 0,9 | **67** | app sério, rápido e sem quique visível |
| Standard defaultSpatial | 700 | 0,9 | **48** | padrão sério |
| Effects (cor/opacidade) | 1600 | 1,0 | **80** | sem overshoot |

Curvas do M3: emphasized `cubic-bezier(0.2,0,0,1)`, emphasized decelerate `(0.05,0.7,0.1,1)`, emphasized accelerate `(0.3,0,0.8,0.15)`. Durações: short 50/100/150/200 ms e medium 250–400 ms.

Isso mapeia direto na nossa regra "app sério = sem passar do ponto; app divertido = quica".

### 2.14 Botão 3D "Duolingo" (Animata `duolingo`): NOVO

`border-b-4` com cor mais escura e, no `active:`, `border-b-0 border-t-4`: o botão "afunda" 4 px. Leva `touch-manipulation` e `h-11` (44 px). É ótimo para apps de hábito como o Rotina e fica muito bom em vídeo.

### 2.15 Troca de texto deslizando (Animata `swipe-button`; Motion Primitives `TextMorph`): NOVO

- **Só com Tailwind:** dois spans; no hover, um sobe (`-translate-y-full`) e o outro entra (`translate-y-0`), 300 ms, dentro de um `overflow-hidden`.
- **`TextMorph`:** cada letra é um `motion.span` com `layoutId` e `AnimatePresence mode="popLayout"`, mola `stiffness 280, damping 18, mass 0.3`, com `aria-label` no texto inteiro e `aria-hidden` nas letras. Bom para "Seguir → Seguindo".

### 2.16 Acessibilidade e alvos (Vercel, Rauno, shadcn): PARCIALMENTE NOVO

- **Alvos de toque:** visual < 24 px exige área de toque ≥ 24 px (WCAG 2.5.8). **No celular, ≥ 44 px.**
- **`touch-action: manipulation`** evita o zoom de toque duplo.
- **Foco:** `:focus-visible` (não `:focus`), anel sem nada por cima. O padrão shadcn é `outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50`.
- **Interações aumentam o contraste:** hover, active e focus têm mais contraste que o estado de repouso.
- **Botão só com ícone** precisa de `aria-label`.
- **Botão desabilitado não tem tooltip**, porque sai da ordem de tabulação (Rauno).
- **Nunca use `transition: all`.** Liste as propriedades. Detalhe: o nosso exemplo da receita 1 usa `transition-all`, que deveria virar `transition-[transform,background-color]`.
- **Loops automáticos com mais de 5 s** exigem controle de pausa (WCAG 2.2.2). Loops pausam fora da tela.
- **Reduced motion é "menos e mais suave", não zero:** mantenha opacidade e cor e tire o deslocamento.
- **Trocar de tema não deve disparar transições** (Rauno).
- **Escalar texto muda a suavização.** Anime um wrapper. Se aparecer artefato, use `translateZ(0)` (Vercel).

### 2.17 Performance (Emil `performance-cheatsheet.md`): PARCIALMENTE NOVO

- **Ações rápidas e repetidas:** use **transição CSS e não keyframes** em toggles, toasts e qualquer coisa que o usuário dispara duas vezes por segundo. A transição recalcula o alvo a partir do valor atual.
- **Variável CSS no pai:** não mude uma variável no pai para mover filhos. Isso recalcula o estilo de todos. Use `transform` direto no elemento.
- **Sob carga:** animações CSS ficam lisas com a thread principal ocupada, e o rAF do Motion perde quadros.
- **Re-render a cada quadro:** escreva em `ref.current.style`, não em state.
- **Depuração:** rode a 2–5× a duração ou no painel Animations do DevTools, quadro a quadro, e reveja no dia seguinte.

### 2.18 Erros típicos de IA ao criar motion (design-motion-principles `creation-gotchas.md`): NOVO

- **Sem loops para chamar atenção:** nada de CTA pulsando, anel brilhando sem parar ou "respiração", a menos que o usuário peça. Isso vale para apps. Em vídeo promocional, pode.
- **Nunca parta de `scale(0)`:** comece de 0,9–0,97 com `opacity: 0`.
- **Uma duração só para tudo** está errado: elemento menor é mais rápido.
- **Respeite o projeto:** se ele já usa molas de 500 ms, um componente de 150 ms vai parecer estranho.
- **Não aplique uma regra de designer a tudo:** Emil (contido) serve para ferramentas, Jhey (brincalhão) para coisas lúdicas.
- **`frontend-design` (Anthropic):** hover em todo card e fade-up em toda seção "parecem gerados por IA". Um único momento orquestrado vale mais.

---

## 3. "Já temos" vs "Novo"

| Tema | Já temos na skill | Novo nesta pesquisa |
|---|---|---|
| Escala no toque | `active:scale-[0.97]`, mola 0,2 s | Faixa 0,95–0,98 e 100–160 ms; escala proporcional ao gatilho (Rauno) |
| Hover | `whileHover scale 1.03` | Hover só com `(hover:hover) and (pointer:fine)`; Tailwind v4 já faz isso |
| Curvas | `easeOut` em camelCase; molas | Curvas nomeadas `--ease-out (0.23,1,0.32,1)`, `--ease-in-out`, `--ease-drawer`; curvas M3; nunca `ease-in` |
| Molas | 3 presets + `visualDuration`/`bounce` | Tokens M3 Expressive/Standard convertidos para o damping do Motion |
| Gradiente na borda | Anel cônico com `@property` no foco | Borda com `mask-composite: exclude` (shine), rainbow com `background-clip`, cometa com `offset-path` |
| Shimmer | não | Shimmer Magic UI (keyframes completos), shining sweep só no hover |
| Magnético | não | Magnetic do Motion Primitives (números e armadilhas) |
| Ripple | Em vídeo (Rotina v2) | Ripple na posição do clique, para app |
| Loading → sucesso | Só o "pop" com box-shadow | Botão de estados completo, troca com blur, atraso e tempo mínimo do spinner, largura fixa, `aria-live` |
| Erro | não | Shake de 3–5 px, 2–3 ciclos, 160–200 ms, alternativa sem movimento |
| Destrutivo | não | Segurar para confirmar com `clip-path` (2 s linear / 200 ms) |
| Estados | foco visível e disabled 40% | Camadas M3 (0,08/0,10/0,10/0,16; disabled 0,38/0,12); interação aumenta contraste |
| Alvos de toque | não | ≥ 24 px (WCAG), ≥ 44 px no celular, `touch-action: manipulation` |
| Decisão "animar?" | não | Portão de frequência e propósito do Emil |
| Reduced motion | sim | "Menos e mais suave, não zero"; loops > 5 s com pausa |
| `transform` vs `x/scale` | sim (do Motion oficial) | Confirmado pelo Emil. Atenção: o nosso exemplo usa `transition-all` |
| Botão 3D, troca de texto | não | Duolingo (`border-b-4`), swipe text, TextMorph |

---

## 4. Recomendação: onde costurar

1. **`SKILL.md`, nova seção "0. Antes de animar":** o portão de frequência e propósito (2.1) e a tabela de duração com as curvas nomeadas (2.2). Cerca de 20 linhas.
2. **`SKILL.md`, "Regras ao animar botões":**
   - acrescentar hover gating (2.3), alvos de toque e `touch-action` (2.16), "nunca `transition: all`" e "sem loop chamativo em app" (2.18);
   - **corrigir o exemplo da receita 1**, de `transition-all` para `transition-[transform,background-color]`.
3. **`SKILL.md`, "Molas":** acrescentar 2 linhas com os tokens M3 convertidos (2.13): "sério" 1400/67 e "divertido" 800/34.
4. **Novo arquivo `receitas-premium.md` ou `assets/`** (para o SKILL.md continuar curto):
   - loading→sucesso (2.4), escrito como `assets/action-button.tsx`;
   - shimmer (2.5), shine-border (2.6), border-trail (2.7), magnetic (2.8), ripple (2.9);
   - hold-to-confirm (2.10), shake (2.11), camada de estado M3 (2.12), Duolingo 3D (2.14), swipe/TextMorph (2.15).
   - Cada receita deve ter a origem e a licença numa linha (MIT: Magic UI, Motion Primitives, Animata, Emil; Apache-2.0: AndroidX).
5. **Seção "Em vídeos do Remotion":** shimmer, border-trail (`offsetDistance` por quadro), Duolingo afundando e o swipe de texto são ótimos para os vídeos do Rotina. Nesse caso a regra "sem loop" não vale.
6. **`APRENDIZADOS.md`:** registrar uma entrada datada com as fontes e o conflito resolvido (seção 5).
7. **Não copiar:**
   - React Bits (Commons Clause; StarBorder pesado em canvas);
   - Rauno (sem licença; só parafrasear as ideias);
   - wshobson (importa de `framer-motion`).

## 5. Conflitos encontrados (decidir antes de costurar)

- **dylantarre vs Emil:**
  - dylantarre recomenda `ease-in` no hover-out e a curva `cubic-bezier(0.4,0,0.2,1)` (que é a "legacy" do Material).
  - Emil proíbe as duas coisas.
  - **Seguir o Emil.** Do dylantarre, aproveitar só os tempos e o shake.
- **Molas do Emil vs Motion 14:** Emil escreve `{ type: "spring", duration: 0.5, bounce: 0.2 }`. A nossa skill usa `visualDuration`, que é o recomendado no Motion 14. Manter `visualDuration`.
- **Shimmer, rainbow e pulsating** são loops infinitos: bons em landing page e vídeo, ruins em app de uso diário (Emil, Jakub e o anti-checklist).
- **Magic UI:** usa `transition-all` no shimmer e no rainbow. Trocar por propriedades explícitas ao portar.
