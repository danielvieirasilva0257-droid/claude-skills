---
name: button-animation
description: "Animação de botões e micro-interações em React com Motion 14 (ex-Framer Motion), Tailwind e CSS: toque e hover, todos os estados (repouso, hover, foco, pressionado, desativado, carregando, sucesso, erro), troca de ícone, segurar para confirmar, tremor de erro, anel e borda de gradiente, shimmer, ripple, popover com mola, números de duração, curvas e molas, acessibilidade e movimento reduzido, e como levar tudo para vídeo no Remotion. Use ao criar, polir ou revisar animação de botão, CTA, campo, menu, toggle ou qualquer componente interativo, ou quando pedirem 'botão bonito', 'efeito no botão', 'micro-interação', 'hover', 'clique', 'loading no botão'."
---

# Animação de botões e micro-interações

Versão "Frankenstein" de 11/10/2026: a nossa skill (receitas do `Compose`, Motion 14) mais as melhores partes de skills e bibliotecas abertas. Cada parte de fora diz a origem entre parênteses; a lista completa, com links, licenças e commits, está em `ORIGEM.md`. O que não tem origem indicada é nosso.

**Arquivos prontos em `assets/`** (todos passam no TypeScript estrito com `motion@14.0.0` e React 18):

| Arquivo | O que é |
|---|---|
| `status-button.tsx` | Botão com 4 estados: repouso, carregando, sucesso e erro (receita 3) |
| `hold-to-confirm.tsx` | Segurar para confirmar uma ação destrutiva (receita 5) |
| `compose.tsx` | Caixa de mensagem completa com `@menções`, `/comandos`, anel de gradiente e popover |
| `compose-demo.tsx` | Exemplo de uso do `compose.tsx` |

O arquivo de onde o `Compose` veio fica em `original/GRADIENT-BUTTON.txt`. Os aprendizados novos vão para `APRENDIZADOS.md`.

---

## 0. Versão e instalação (out/2026)

- **Pacote:** o Framer Motion agora se chama **Motion**. Versão estável: **14.0.0** (02/10/2026). Funciona com React 18 e 19.
- **Instalação:** `npm install motion`. **Desinstale o `framer-motion`**: os dois nunca ficam instalados juntos.
- **Imports:**
  - componentes de cliente (`"use client"`): `import { motion, AnimatePresence } from "motion/react"`;
  - server components: `import * as motion from "motion/react-client"`;
  - `animate` solto: de `"motion/react"` em React e de `"motion"` no resto.
  - **Nunca** importe de `"framer-motion"`. Código achado na internet que importa de lá (por exemplo, wshobson) precisa ser adaptado.
- **Migrar projeto antigo:** troque os imports. Da 12 à 14 só mudaram APIs internas e a dependência opcional `@emotion/is-prop-valid` (saiu na 13.0; use `<MotionConfig isValidProp={...}>`).
- **Tailwind:** as receitas supõem **Tailwind 4**. Diferenças do 3 estão marcadas onde importam (hover e escala).
- Componentes em `components/ui` (estrutura shadcn), em TypeScript.

---

## 1. Antes de animar: deve mesmo animar?

(Emil Kowalski, `emil-design-eng` e `animate`, MIT)

**Porteiro de frequência.** Quanto mais vezes por dia a pessoa vê a animação, menor ela deve ser.

| Quantas vezes a pessoa vê | Decisão |
|---|---|
| 100+ por dia (atalho de teclado, paleta de comandos) | **Nenhuma animação** |
| Dezenas por dia (hover, navegar numa lista) | Quase imperceptível, ou nada |
| Ocasional (modal, gaveta, toast) | Animação padrão |
| Rara ou primeira vez (onboarding, sucesso, comemoração) | Aqui cabe o "encanto" |

- **Ação disparada pelo teclado não anima.**
- **Diga o propósito numa palavra** antes de animar: feedback, consistência espacial, estado, evitar salto, explicação ou encanto (este, só no nível "raro").
- **Um momento bem orquestrado vale mais** que hover em todo card e fade-up em toda seção, que "parecem gerados por IA" (Anthropic `frontend-design`, Apache-2.0, ideia parafraseada).
- **Combine com o produto:** app sério (finanças, saúde, ferramenta) = contido e sem quique; app lúdico = pode quicar. Respeite o ritmo que o projeto já tem: um componente de 150 ms num app de molas de 500 ms parece estranho (design-motion-principles, MIT).

---

## 2. Números

### 2.1 Durações por elemento

(Emil, `review-animations/STANDARDS.md`, MIT; confirmado por Vercel, Impeccable, wshobson e Rauno)

| Elemento | Duração |
|---|---|
| Feedback de toque no botão | **100–160 ms** |
| Tooltip, popover pequeno | 125–200 ms |
| Dropdown, select | 150–250 ms |
| Modal, gaveta | 200–500 ms |
| Marketing, explicação, vídeo | pode ser mais longo |

- **Animação de UI fica abaixo de 300 ms.** Feedback de interação, de preferência até 200 ms (ibelick, Rauno).
- **Elemento menor anima mais rápido.** Uma duração única para tudo está errado.
- **A saída é mais rápida e mais sutil que a entrada.** Referência: entrar 240 ms, sair 150 ms, feedback 150 ms (motion-lexicon, CC BY 4.0).

### 2.2 Curvas

(Emil, MIT)

```css
:root {
  --ease-out:    cubic-bezier(0.23, 1, 0.32, 1);   /* entrar e sair: o padrão de UI */
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);  /* mover algo que já está na tela */
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);   /* gaveta estilo iOS */
}
```

| Situação | Curva |
|---|---|
| Entrando ou saindo | `--ease-out` |
| Movendo na tela, morph | `--ease-in-out` |
| Hover, troca de cor | `ease` |
| Progresso constante (barra, "segurar para confirmar") | `linear` |

- **Nunca `ease-in` em UI:** começa devagar justo quando a pessoa está olhando.
- **As curvas nativas do CSS são fracas:** use os tokens acima.
- Alternativas testadas: `cubic-bezier(0.2, 0, 0, 1)` para troca de ícone (Jakub Krehel, MIT; é também o "emphasized" do Material 3).
- No Motion, curvas em camelCase (`easeOut`, `circOut`) ou array: `ease: [0.23, 1, 0.32, 1]`.
- No Remotion: `Easing.bezier(0.23, 1, 0.32, 1)`.

### 2.3 Molas

**Padrão de UI: mola sem quique.** `{ type: "spring", visualDuration: 0.3, bounce: 0 }` (Jakub Krehel; Emil `apple-design`, MIT). O quique (`bounce ≈ 0.2`) fica para gestos com impulso e apps lúdicos.

- **`visualDuration` + `bounce`** é a forma recomendada no Motion 14: quanto tempo o movimento "parece" durar e quanto quica. (Fontes antigas escrevem `duration`; prefira `visualDuration`.)
- **`bounce: 0`** não passa do ponto. Desde a 13.5, `bounce` negativo (até −1) amortece ainda mais.

Molas nossas, testadas:

| Sensação | stiffness / damping / mass | ou |
|---|---|---|
| Popover rápido | 620 / 36 / 0,6 | `visualDuration: 0.25, bounce: 0.1` |
| Destaque deslizante | 650 / 40 / 0,5 | `visualDuration: 0.25, bounce: 0` |
| Pesado, tipo carrossel | 400 / 50 / 3 (veja `thumbnail-carousel`) | `visualDuration: 0.6, bounce: 0` |

Molas do **Material 3** (AndroidX `StandardMotionTokens.kt` e `ExpressiveMotionTokens.kt`, Apache-2.0), convertidas para o Motion e o Remotion. No Android, `damping` é a razão ζ com massa 1; no Motion e no Remotion é o coeficiente: **`damping = ζ × 2 × √stiffness`**.

| Token M3 | stiffness | ζ | `damping` no Motion/Remotion | Uso |
|---|---|---|---|---|
| Standard fastSpatial | 1400 | 0,9 | **67** | app sério: rápido e sem quique visível |
| Standard defaultSpatial | 700 | 0,9 | **48** | padrão sério |
| Standard slowSpatial | 300 | 0,9 | **31** | elemento grande, sério |
| Expressive fastSpatial | 800 | 0,6 | **34** | toque "divertido", quica |
| Expressive defaultSpatial | 380 | 0,8 | **31** | movimento médio com leve quique |
| Expressive slowSpatial | 200 | 0,8 | **23** | elemento grande, lúdico |
| Effects (cor, opacidade) | 1600 | 1,0 | **80** | sem overshoot |

### 2.4 Escala e deslocamento

| Ação | Valor |
|---|---|
| Toque (pressionar) | **0,96–0,97** (aceitável 0,95–0,98). Abaixo de 0,96 é defeito (Jakub) |
| Hover | no máximo 1,03–1,05, ou subir `translateY(-1px)` |
| Entrada de elemento | começar de **0,9–0,97** + `opacity: 0`. **Nunca de `scale(0)`** (Emil) |
| Troca de ícone pequeno | 0,25 + blur 4 px (exceção testada do Jakub; o blur "cola" os estados) |
| Troca de rótulo inteiro | 0,8 + blur 4 px |
| Tremor de erro | 3–5 px, 2–3 ciclos, 160–200 ms, uma vez |
| Escalonar itens | 30–80 ms entre itens (Emil); 100 ms entre blocos (Jakub) |

**A escala acompanha o tamanho:** um botão grande encolhe menos que um ícone (Rauno, ideia parafraseada).

---

## 3. Estados completos de um botão

Todo botão precisa destes estados. **O movimento nunca é o único sinal**: cada mudança também deixa uma pista estática de cor, ícone ou texto (Jakub, MIT).

| Estado | Visual | Movimento |
|---|---|---|
| Repouso | cor base, `shadow-sm` | nenhum |
| Hover (só mouse) | +contraste, ou camada 8% | cor com `ease` 150 ms; ícone pode andar 2 px |
| Foco (`:focus-visible`) | anel de 2–3 px com folga | sem animação, ou o anel de gradiente (receita 7) |
| Pressionado | camada 10% | `scale(0.96–0.97)`, 100–160 ms, `--ease-out` |
| Desativado | `opacity: 0.4` (M3: conteúdo 38%, fundo 12%) | **nunca encolhe**, `pointer-events: none` |
| Carregando | spinner + rótulo com reticências ("Salvando…"), largura fixa | troca com blur; spinner só depois de 150–300 ms e por no mínimo 300–500 ms (Vercel) |
| Sucesso | verde + ✓ + "Salvo" | troca com blur; volta ao repouso em ~2 s |
| Erro | vermelho + ✕ + mensagem | tremor de 4 px, uma vez |

**Interação aumenta o contraste:** hover, foco e pressionado ficam mais contrastados que o repouso (Vercel, MIT).

**Camada de estado do Material 3** (AndroidX `StateTokens.kt`, Apache-2.0): em vez de trocar a cor de fundo, ponha uma camada da cor do texto por cima. Funciona com qualquer cor de marca.

| Hover | Foco | Pressionado | Arrastando |
|---|---|---|---|
| 0,08 | 0,10 | 0,10 | 0,16 |

```tsx
<button className="relative overflow-hidden rounded-xl bg-violet-600 px-4 py-2 text-white
  before:absolute before:inset-0 before:bg-current before:opacity-0
  before:transition-opacity before:duration-150
  hover:before:opacity-[.08] focus-visible:before:opacity-10 active:before:opacity-10">
  <span className="relative">Continuar</span>
</button>
```

---

## 4. Receitas

### Receita 1. Toque e hover (só Tailwind)

Corrigida em 11/10/2026: sem `transition-all`, escala só quando ativo, curva forte e área de toque.

```tsx
<button className="group inline-flex h-10 items-center gap-2 rounded-xl bg-zinc-900 px-3.5 text-[13px] font-semibold text-white shadow-sm
  touch-manipulation [-webkit-tap-highlight-color:transparent]
  transition-[background-color,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]
  hover:bg-zinc-800 enabled:active:scale-[0.96]
  outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2
  disabled:pointer-events-none disabled:opacity-40
  dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
  <svg aria-hidden="true" className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" … />
  Enviar
</button>
```

- **`transition-[background-color,scale]`**: nunca `transition: all` (Emil, Jakub, Vercel). No Tailwind 3, a escala mora em `transform`: use `transition-[background-color,transform]`.
- **`enabled:active:`**: o botão desativado não encolhe (Jakub).
- **`touch-manipulation`** tira o atraso do toque duplo; **`-webkit-tap-highlight-color: transparent`** tira o flash azul no celular quando o botão desenha o próprio pressionado (Vercel, Jakub).
- **Hover só com mouse:** no celular, o hover "gruda" depois do toque. O `hover:` do Tailwind 4 já vem dentro de `@media (hover: hover)`; no Tailwind 3 e no CSS puro, escreva `@media (hover: hover) and (pointer: fine) { … }` (Emil, Jakub). O `whileHover` do Motion já ignora toque.
- **Transição, não keyframes,** para estados que ligam e desligam: transição pode ser interrompida e volta do ponto onde está; keyframes recomeçam do zero (Emil, Jakub).
- **Responda no pressionar, não no soltar** (Emil, `apple-design`).
- Prop opcional **`static`** para desligar a escala onde ela distrai (Jakub).

**Com Motion** (mola interrompível, melhor quando tocam rápido várias vezes):

```tsx
<motion.button
  disabled={disabled}
  whileHover={{ scale: 1.03 }}
  whileTap={disabled ? undefined : { scale: 0.96 }}
  transition={{ type: "spring", visualDuration: 0.2, bounce: 0 }} />
```

Num app lúdico, `bounce: 0.2`. Card clicável com botão dentro: `propagate={{ tap: false }}` no botão para o toque nele não disparar o `whileTap` do card (Motion 12.33).

### Receita 2. Troca de ícone

(Jakub Krehel, `better-ui/icon-transitions.md`, MIT) Para copiar→copiado, play→pause, curtir→curtido.

```tsx
<AnimatePresence initial={false} mode="popLayout">
  <motion.span key={copied ? "check" : "copy"}
    initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
    exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
    transition={{ type: "spring", duration: 0.3, bounce: 0 }}>
    {copied ? <CheckIcon /> : <CopyIcon />}
  </motion.span>
</AnimatePresence>
```

- **`initial={false}`** impede que o estado inicial anime ao carregar a página. Não use em entradas intencionais.
- **Só CSS:** os dois ícones no mesmo `grid-area`, alternando `scale-[0.25] opacity-0 blur-[4px]`, 300 ms, `cubic-bezier(0.2,0,0,1)`.
- **Não anime** ícones de aba e navegação, nem ações que aparecem no hover de linhas (alta frequência).
- O blur disfarça o crossfade: os dois estados parecem um objeto se transformando, e não dois objetos se cruzando. Mantenha o blur pequeno (≤ 8 px no ibelick; < 20 px no Emil).
- **Movimento reduzido:** troque por fade puro (veja a armadilha do blur na seção 5).

### Receita 3. Botão com estados: carregando, sucesso, erro

Pronto em **`assets/status-button.tsx`**. Ideia do botão de estados: Animata `status-button` e wshobson `interaction-design` (MIT); números: Vercel e Jakub (MIT); código nosso.

```tsx
<StatusButton action={() => salvar(dados)} loadingLabel="Salvando…" successLabel="Salvo">
  Salvar
</StatusButton>
```

O que ele faz e por quê:

- **Largura fixa** (`min-w-40`): a geometria não pula quando o texto muda (motion-lexicon).
- **Spinner só depois de 200 ms e por no mínimo 400 ms:** resposta rápida não pisca (Vercel: atraso 150–300 ms, mínimo 300–500 ms).
- **Bloqueia duplo envio** enquanto trabalha (Rauno, Impeccable).
- **Troca de rótulo** com `opacity + scale 0.8 + blur 4px`, mola `visualDuration 0.25, bounce 0`, `mode="popLayout"`.
- **Pista estática:** cor (verde/vermelho), ícone (✓/✕) e texto, não só movimento.
- **Leitor de tela:** `aria-busy` durante o envio e um `role="status" aria-live="polite"` que anuncia "Salvo" ou o erro.
- **Erro:** tremor de 4 px, uma vez (receita 4).
- **Movimento reduzido:** só fade de 120 ms, sem tremor, spinner parado.

### Receita 4. Tremor de erro

(Números: dylantarre `buttons-ctas`, wshobson, motion-lexicon; MIT/CC BY)

```tsx
<motion.div animate={error && !reduce ? { x: [0, -4, 4, -4, 4, 0] } : { x: 0 }}
  transition={{ duration: 0.2, ease: "easeOut" }} />
```

3–5 px, 2–3 ciclos, 160–200 ms, **uma vez só**. Em movimento reduzido, nada de deslocamento: mostre só a cor e a mensagem.

### Receita 5. Segurar para confirmar (ações destrutivas)

(Emil, `animate/RECIPES.md`, "Hold to confirm", MIT) Pronto em **`assets/hold-to-confirm.tsx`**, que acrescenta o timer que dispara a ação e o suporte a teclado.

```css
.overlay { clip-path: inset(0 100% 0 0); transition: clip-path 200ms var(--ease-out); } /* soltar: rápido */
.button:active .overlay { clip-path: inset(0 0 0 0); transition: clip-path 2s linear; } /* segurar: lento */
.button:active { transform: scale(0.97); }
```

- **Tempo assimétrico:** "lento onde a pessoa decide, rápido onde o sistema responde".
- **`linear` está certo aqui:** é uma barra de progresso, e progresso não suaviza.
- O CSS sozinho só desenha; a ação precisa de um `setTimeout` de 2 s que é cancelado ao soltar (o asset já faz).

### Receita 6. Popover com mola, nascendo do gatilho

```tsx
const reduce = useReducedMotion();
<AnimatePresence>
  {open && (
    <motion.ul
      style={{ transformOrigin: "var(--radix-popover-content-transform-origin)" }}
      initial={{ opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.98 }}
      transition={reduce ? { duration: 0.12 } : { type: "spring", stiffness: 620, damping: 36, mass: 0.6 }} />
  )}
</AnimatePresence>
```

- **O popover cresce a partir do gatilho, não do centro.** Exceção: modal, que fica no centro (Emil). No Base UI, a variável é `--transform-origin`; no Radix, `--radix-popover-content-transform-origin` (ou `--radix-dropdown-menu-content-transform-origin`); sem biblioteca, calcule a origem pelo lado onde o popover abre.
- **Radix:** anime via `asChild` com um filho `motion.*`; para a saída, eleve o estado (`open`/`onOpenChange`) e use `forceMount` dentro do `AnimatePresence`.
- **Tooltip instantâneo depois do primeiro** (Emil): o primeiro tooltip espera e anima; enquanto a pessoa passa de um para outro, os seguintes aparecem sem atraso nem animação (`.tooltip[data-instant] { transition-duration: 0ms }`).
- **Botão desativado não tem tooltip:** ele sai da ordem de tabulação, e quem usa teclado nunca o vê (Rauno, ideia parafraseada).

### Receita 7. Anel de gradiente girando no foco (o efeito "gradient")

Anime uma propriedade CSS registrada para o gradiente cônico girar, e mostre o anel só no `:focus-within`.

```css
@property --ring-a { syntax: "<angle>"; initial-value: 0deg; inherits: false; }
@keyframes ring-spin { to { --ring-a: 360deg; } }
.ring { opacity: 0; transition: opacity .5s ease; pointer-events: none;
  background: conic-gradient(from var(--ring-a),
    rgba(161,161,170,0) 0deg, rgba(161,161,170,.42) 60deg,
    rgba(212,212,216,.62) 108deg, rgba(161,161,170,0) 168deg, rgba(161,161,170,0) 360deg); }
.root:focus-within .ring { opacity: 1; animation: ring-spin 5s linear infinite; }
@media (prefers-reduced-motion: reduce) { .root:focus-within .ring { animation: none; } }
```

- Coloque o `.ring` (com `aria-hidden="true"`) como camada absoluta atrás do controle, um pouco maior e arredondada, para sobrar só uma borda fina. Para botão colorido, troque os cinzas pelas cores da marca.
- **Por que animar a variável aqui é seguro:** ela é registrada com `inherits: false` e vive numa camada isolada. Animar variável CSS **herdada** no pai recalcula todos os filhos (ibelick, Emil).
- O loop só roda com foco, o que é aceitável. Use como destaque de foco ou de um CTA, não em todo botão.

**Variação: só a borda, com máscara** (Magic UI `shine-border`, MIT). Pinta só a borda, sem camada maior atrás:

```css
.shine { position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  padding: var(--border-width, 1px);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  background-image: radial-gradient(transparent, transparent, #a78bfa, #f472b6, transparent, transparent);
  background-size: 300% 300%; }
@media (prefers-reduced-motion: no-preference) { .shine { animation: shine 14s linear infinite; } }
@keyframes shine { 0% { background-position: 0% 0% } 50% { background-position: 100% 100% } to { background-position: 0% 0% } }
```

**Variação: "cometa" percorrendo a borda** (Motion Primitives `BorderTrail`, MIT):

```tsx
<div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent
  [mask-clip:padding-box,border-box] [mask-composite:intersect]
  [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]">
  <motion.div className="absolute aspect-square bg-zinc-500"
    style={{ width: 60, offsetPath: "rect(0 auto auto 0 round 60px)" }}
    animate={{ offsetDistance: ["0%", "100%"] }}
    transition={{ repeat: Infinity, duration: 5, ease: "linear" }} />
</div>
```

### Receita 8. Destaque deslizante (abas, segmentado "Fixa | Pontual")

Um `motion.div` com `layoutId` atrás do item ativo, com `transition={{ type: "spring", stiffness: 650, damping: 40, mass: 0.5 }}`. Desde a 12.36, `layout="x"` ou `layout="y"` anima o layout só num eixo. Usado no vídeo do Rotina v2: desliza em ~8 quadros, sem passar do ponto.

### Receita 9. Anel de progresso ou contador (SVG)

Um círculo com `strokeDasharray = 2πr` e `strokeDashoffset = circ * (1 - pct)`, com `transition: stroke-dashoffset .25s ease, stroke .25s ease`. Cor: cinza, âmbar a partir de 80% e vermelho quando passa do limite. É progresso: mantenha mesmo com movimento reduzido.

### Receita 10. "Pop" de confirmação

`@keyframes pop { 0% { box-shadow: 0 0 0 3px rgba(113,113,122,.16) } 100% { box-shadow: 0 0 0 0 transparent } }`, por 0,5 s com ease-out quando uma ação acontece (por exemplo, uma menção inserida). Aqui keyframes estão certos: é um efeito de uma vez só.

### Receita 11. Ripple na posição do clique

(Magic UI `ripple-button`, MIT) Bom para app com cara de Material ou para vídeo.

```ts
const rect = e.currentTarget.getBoundingClientRect();
const size = Math.max(rect.width, rect.height);
const x = e.clientX - rect.left - size / 2;
const y = e.clientY - rect.top - size / 2;
// span absoluto rounded-full bg-current opacity-30, com keyframes 600 ms ease-out:
// scale(0) → scale(2) e opacity 1 → 0; remova o span depois de 600 ms.
```

O ripple é a exceção ao "nunca de `scale(0)`": é uma onda, não um elemento entrando. Em movimento reduzido, troque por um flash de opacidade da camada de estado (seção 3).

### Receita 12. Botão 3D que afunda (estilo Duolingo)

(Animata `duolingo`, MIT) Ótimo para apps de hábito, como o Rotina, e em vídeo.

```tsx
<button className="h-11 touch-manipulation rounded-2xl border-b-4 border-green-700 bg-green-500 px-6 font-bold text-white
  transition-[border-width,translate] duration-100 active:translate-y-[2px] active:border-b-2">
  Continuar
</button>
```

O original troca `border-b-4` por `border-t-4` no `active:`, e o botão "afunda" 4 px. A versão acima afunda 2 px e não desloca o texto para baixo bruscamente.

### Receita 13. Troca de texto no hover (CTA de landing)

(Animata `swipe-button`, MIT; Motion Primitives `TextMorph`, MIT)

- **Só Tailwind:** dois `span` empilhados dentro de um `overflow-hidden`; no hover, um sobe (`-translate-y-full`) e o outro entra (`translate-y-0`), 300 ms, `--ease-out`.
- **`TextMorph`** ("Seguir" → "Seguindo"): cada letra é um `motion.span` com `layoutId`, `AnimatePresence mode="popLayout"`, mola `stiffness 280, damping 18, mass 0.3`; `aria-label` com o texto inteiro e `aria-hidden` nas letras.

### Receita 14. Shimmer (brilho passando) — só landing page e vídeo

(Magic UI `shimmer-button`, MIT; Animata `shining-button`, MIT) É loop chamativo: **não use em app de uso diário** (seção 7).

```css
/* Tailwind 4, em globals.css: o feixe cônico gira dentro de um container que desliza */
@theme inline {
  --animate-shimmer-slide: shimmer-slide var(--speed) ease-in-out infinite alternate;
  --animate-spin-around: spin-around calc(var(--speed) * 2) infinite linear;
}
@keyframes shimmer-slide { to { transform: translate(calc(100cqw - 100%), 0); } }
@keyframes spin-around {
  0% { transform: translateZ(0) rotate(0) }
  15%, 35% { transform: translateZ(0) rotate(90deg) }
  65%, 85% { transform: translateZ(0) rotate(270deg) }
  100% { transform: translateZ(0) rotate(360deg) } }
```

O feixe é `conic-gradient(from calc(270deg - var(--spread) * .5), transparent 0, var(--shimmer-color) var(--spread), transparent var(--spread))`, com `--spread: 90deg`, `--speed: 3s` e `blur-[2px]`. O fundo interno fica em `inset: var(--cut)` (0,05em), então só a borda brilha. Brilho interno: `shadow-[inset_0_-8px_10px_#ffffff1f]`, que vira `-6px …3f` no hover e `-10px …3f` no active.

- Ponha **`motion-safe:`** nas classes `animate-*` (o original não respeita movimento reduzido) e troque o `transition-all` do original por propriedades nomeadas.
- **Variante sem loop, melhor para app:** uma faixa `bg-white/10 rotate-[30deg]` atravessa de `-left-16` até `left-[calc(100%+1rem)]` em 700 ms só no hover (Animata `shining-button`).

### Receita 15. Botão magnético — só landing page

(Motion Primitives `Magnetic`, MIT) O botão é puxado na direção do cursor quando ele chega perto.

```ts
const SPRING = { stiffness: 26.7, damping: 4.1, mass: 0.2 }; // intensity 0.6, range 100 px
// dentro do raio: x.set(dx * intensity * (1 - dist / range)); ao sair, volta a 0.
// x e y são useMotionValue passados por useSpring(…, SPRING).
```

- O original escuta `mousemove` no `document` o tempo todo: ligue o listener só no `pointerenter` da área.
- Desligue com `useReducedMotion()` e em `(pointer: coarse)`. É decorativo: nunca em app sério.

### Receita 16. Barra de rolagem fina com tema

`scrollbar-width: thin` mais `::-webkit-scrollbar-thumb` com borda transparente de 4 px e `background-clip: padding-box`. Um pouco mais escura no hover e no foco, com valores próprios em `.dark`.

---

## 5. Acessibilidade

- **Movimento reduzido é "menos e mais suave", não zero** (Emil, Impeccable, Jakub). O que fazer com cada tipo (Jakub, `motion-and-zoom.md`, MIT):

| Desligar | Trocar | Manter |
|---|---|---|
| Parallax, loops decorativos (shimmer, magnético, anel girando) | Deslizar ou escalar → fade de opacidade | Spinner, progresso, feedback curto de toque, mudança de cor |

- **Como ligar:** `useReducedMotion()` ou `<MotionConfig reducedMotion="user">` no Motion; `@media (prefers-reduced-motion: reduce)` no CSS; prefixos `motion-safe:` e `motion-reduce:` no Tailwind.
- **Armadilha do blur:** o `MotionConfig reducedMotion="user"` desliga transform e layout, **mas o `filter: blur` continua rodando**. Onde houver blur, use `useReducedMotion()` e troque as variantes (Jakub).
- **Loop automático com mais de 5 s** precisa de um jeito de pausar (WCAG 2.2.2), e loops pausam fora da tela (Vercel, ibelick).
- **Área de toque:** mínimo 24×24 px (WCAG 2.5.8 AA); no celular, **44×44** (Apple; Material usa 48). Para um botão pequeno, aumente a área sem mudar o visual (Jakub, `hit-areas.md`, MIT):

```tsx
<button aria-label="Concluir" className="relative size-5 after:absolute after:top-1/2 after:left-1/2 after:size-11 after:-translate-1/2">…</button>
```

- **Foco visível:** use `:focus-visible`, não `:focus`. O melhor é manter o anel do navegador e só dar folga: `:focus-visible { outline-offset: 2px }` (Jakub). Padrão shadcn: `outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50` (MIT). Nada pode cobrir o anel.
- **Alto contraste:** o modo `forced-colors` apaga `box-shadow`; se o anel é sombra, mantenha `border: 1px solid transparent` para sobrar uma borda (Jakub).
- **Camadas decorativas** (anel, brilho, ripple): `pointer-events: none` e `aria-hidden="true"`.
- **Botão só com ícone** precisa de `aria-label` (Vercel).
- **Estado que muda sozinho** (salvo, erro): anuncie com `role="status" aria-live="polite"`; durante o envio, `aria-busy`.
- **Tema claro e escuro:** variantes `dark:`. **Ao trocar de tema, desligue as transições**, senão todas as cores animam juntas e a tela borra: no `next-themes`, `disableTransitionOnChange`; à mão, injete `*{transition:none!important}`, force o reflow e remova depois de dois `requestAnimationFrame` (Jakub, Rauno).
- **Escalar texto muda a suavização das letras:** anime um invólucro; se aparecer artefato, `translateZ(0)` (Vercel).

---

## 6. Desempenho

- **Anime só `transform` e `opacity`** (e `filter` com moderação). Nunca `width`, `height`, `top`, `left`.
- **No Motion, prefira `transform` em string** (`animate={{ transform: "scale(1.05)" }}`), que roda pelo WAAPI, acelerado. As abreviações `x` e `scale` **não** são aceleradas por hardware (Motion oficial; Emil). Use-as só quando cada uma tiver transição própria, vierem de MotionValues ou se somarem (`animate={{ x }}` + `whileHover={{ scale }}`).
- **Sob carga, CSS ganha:** animações CSS ficam lisas com a thread principal ocupada; o rAF do Motion perde quadros (Emil). Para toque e hover simples, CSS basta.
- **Ações rápidas e repetidas** (toggles, cliques seguidos): transição CSS, não keyframes (Emil).
- **Blur:** no máximo 8 px, e só em efeito de uma vez, nunca em loop (ibelick, MIT).
- **Não anime variável CSS herdada no pai** para mover filhos: use `transform` no próprio elemento (ibelick, Emil).
- **Valor que muda a cada quadro:** escreva em `ref.current.style` ou num MotionValue, nunca em state do React (Emil).
- **`will-change`:** só com transição CSS ou transformações independentes, e com moderação.
- **Dentro de funções por quadro:** não crie objetos, use `for` em vez de `forEach`/`map`, evite `Object.entries`.
- **MotionValues:** nunca leia `value.get()` no render; use `value.on("change", fn)`; encadeie `useTransform`, `useSpring`, `useVelocity`. `useTransform(value, [entrada], [saída])` ou `useTransform(() => a.get() * 2)`; a forma `useTransform(value, v => …)` está obsoleta.
- **Para depurar:** rode a animação 2–5× mais lenta, ou quadro a quadro no painel Animations do DevTools, e reveja no dia seguinte (Emil).

---

## 7. Armadilhas e "nunca entregue"

(Emil `review-animations`, Jakub, design-motion-principles `creation-gotchas.md`, ibelick; todos MIT)

- [ ] `transition: all` / `transition-all`.
- [ ] `ease-in` em qualquer coisa de UI.
- [ ] Elemento entrando de `scale(0)`.
- [ ] Popover crescendo do centro em vez do gatilho.
- [ ] Botão desativado que ainda encolhe no toque.
- [ ] `active:scale-90` / `scale-95` ou `whileTap` abaixo de 0,96.
- [ ] Hover que "gruda" no celular (sem `(hover: hover)` no Tailwind 3 ou CSS puro).
- [ ] Animação em ação de teclado ou em algo visto 100+ vezes por dia.
- [ ] Keyframes em estado que liga e desliga (deveria ser transição).
- [ ] **Loop chamativo em app:** CTA pulsando, anel brilhando sem parar, "respiração". Só se pedirem, e em landing page ou vídeo.
- [ ] Uma duração única para tudo; saída mais lenta que a entrada.
- [ ] Movimento como único sinal (sem cor, ícone ou texto).
- [ ] Spinner que pisca em resposta rápida (sem atraso e tempo mínimo).
- [ ] Rótulo que muda e faz o botão mudar de largura.
- [ ] Duplo envio possível durante o carregamento.
- [ ] Sem `prefers-reduced-motion`, ou blur que continua com movimento reduzido.
- [ ] Área de toque menor que 24 px (44 px no celular); foco invisível ou coberto.
- [ ] Import de `framer-motion`.

**Para revisar uma animação,** responda numa tabela (Emil):

| Antes | Depois | Por quê |
|---|---|---|
| `transition-all duration-300` | `transition-[background-color,scale] duration-150` | propriedades nomeadas; feedback de toque ≤ 160 ms |

**Conflitos entre as fontes, já resolvidos:** seguimos o Emil contra dylantarre (que usa `ease-in` e a curva antiga do Material) e contra ibelick (que proíbe curvas customizadas). Gradientes e anéis (que ibelick e Impeccable desaconselham como enfeite) ficam como efeito intencional de foco ou CTA, não em todo botão.

---

## 8. Recursos do Motion úteis para botões (12.24 a 14.1)

- `propagate={{ tap: false }}` (12.33): o toque num botão interno não dispara o `whileTap` do card pai.
- `<MotionConfig reducedMotion="user">` respeita o "reduzir movimento" do sistema (cuidado com o blur, seção 5). `skipAnimations` (12.30) desliga animações em testes.
- `AnimatePresence` com `anchorY` (12.28) e `root` (shadow DOM), para `popLayout`.
- `useFollowValue` (12.28): valor que segue outro com qualquer transição.
- **Cores:** `oklch`, `oklab`, `color-mix` e `light-dark` animáveis (12.37); `backgroundColor` acelerado por hardware onde há suporte (12.43).
- `AnimateView` (13.4): transições de página com o `ViewTransition` do React 19.3.
- `Reorder` em grade, com RTL (13.1). `animateLayout` (14.1): animação de layout em JS puro.

**Skill e MCP oficiais:** `npx motion-ai` instala a skill `/motion` (MIT) e o MCP grátis `https://mcp.motion.dev`. Neste repositório ela já está em `skills/design/motion-oficial/`: leia as regras dela primeiro e use as receitas desta depois. Índice da documentação: `https://motion.dev/llms.txt`. MotionScore, código dos exemplos e editor visual são pagos (Motion+).

---

## 9. Usar o componente Compose completo

1. Copie `assets/compose.tsx` para `components/ui/compose.tsx`. Ele injeta o próprio `<style>`.
2. `npm install motion`.
3. Veja o uso em `assets/compose-demo.tsx`.

Props: `value/defaultValue`, `onChange`, `onSubmit`, `onCommand`, `mentions`, `commands`, `placeholder`, `maxLength`, `submitLabel`, `autoFocus`, `className`.

Os outros assets seguem o mesmo caminho: `status-button.tsx` e `hold-to-confirm.tsx` vão para `components/ui/`.

---

## 10. Em vídeos do Remotion

Leve **os valores**, não o código. Não há hover nem clique: tudo vira função do quadro.

**As 4 regras de composição do editor valem aqui e vêm antes de qualquer efeito** (`skills/video/remotion-video/SKILL.md`, seção "Regras de composição do editor"; resumo em `guia/LEIA-ANTES-DE-USAR.md`, seção 9). O que muda para botões:

1. **Nada de texto sobre texto.** A troca de rótulo do app ("Salvar" → "Salvando…" → "Salvo") usa crossfade com os dois textos sobrepostos: **em vídeo, faça em sequência** (o antigo sai por completo, depois o novo entra), ou troque só o ícone. O ripple e o brilho não podem passar por cima de um texto que ainda está sendo lido.
2. **Nenhum recorte no meio da tela.** A troca de texto deslizando (receita 13) e o shimmer usam `overflow: hidden`: só são aceitáveis se a borda do recorte for **exatamente a borda visível do botão**. Nunca um botão "nascendo" de uma máscara. O preenchimento do "segurar para confirmar" é um progresso dentro do próprio botão, então está ok.
3. **O elemento principal fica por cima.** Um CTA que vem de trás do celular é renderizado abaixo da camada do celular.
4. **O botão entra de um lugar que explique a entrada:** de fora do quadro ou de trás do celular (componentes `Entra` e `Atras` da branch `rotina-video`). Nunca surgir com `scale` do nada no meio da tela.

Conversões:

| Efeito no app | No Remotion |
|---|---|
| Toque (`scale 0.96`) | `spring()` em volta do quadro do clique: 1 → 0,94–0,96 → 1. Em vídeo, o toque pode ser um pouco mais forte que no app |
| Curva `--ease-out` | `interpolate(frame, [a, b], [0, 1], { easing: Easing.bezier(0.23, 1, 0.32, 1), extrapolateLeft: "clamp", extrapolateRight: "clamp" })` |
| Molas | `spring({ frame, fps, config: { stiffness, damping, mass } })` aceita os mesmos números das tabelas da seção 2.3 (inclusive os do Material 3 convertidos) |
| Destaque deslizante | `{ stiffness: 650, damping: 40, mass: 0.5 }`: pousa em ~8 quadros, sem passar do ponto |
| Anel de gradiente | `rotate = interpolate(frame, [0, 150], [0, 360])` num `conic-gradient`; no Rotina v2, `quadro × 6°`, acelerando no golpe final |
| Cometa na borda | `offsetDistance = interpolate(frame, [0, 150], [0, 100]) + "%"` |
| Ripple | círculo crescendo e sumindo a partir do ponto do toque, 18 quadros (600 ms a 30 fps) |
| Segurar para confirmar | `clipPath: inset(0 ${100 - p}% 0 0)` com `p` linear de 0 a 100 em ~60 quadros: lê como barra de progresso |
| Botão 3D | a borda de baixo some e o botão desce 2–4 px no quadro do toque |
| Troca de ícone | escala 0,25 → 1 com blur 4 → 0 px em ~9 quadros (blur por filtro SVG com `filterUnits="userSpaceOnUse"` e região maior, para não cortar) |
| Shimmer | `translateX` do feixe interpolado pelo quadro; aqui o loop é permitido |

**Som:** um "clique" no quadro do toque; um swish começa 1 quadro antes de uma entrada. **Tempo de leitura:** qualquer texto de botão fica parado por pelo menos 8–10 quadros.
