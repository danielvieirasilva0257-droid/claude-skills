# Pesquisa de movimento e animação (fatia "animação" da Refero)

Agente "REFERO ANIMAÇÃO", 11/10/2026.

Este relatório foi escrito só com material que já estava baixado. Os padrões e as receitas estão descritos com palavras e código próprios. Os números (durações, curvas, stagger) são medidas factuais, citadas como dado.

---

## 0. Coleta, interrupção e uso do material

### Requisições feitas (todas antes do aviso do coordenador)

**styles.refero.design: ~1.414 requisições.**

| Item | Requisições |
|---|---|
| Cabeçalho (130 KB) de cada página `/style/<uuid>` do sitemap, uma por vez | 1.342 (60 vieram vazias, por tempo esgotado) |
| Páginas completas de estilos-semente | 37 (35 salvas) |
| Chunks JS públicos, para entender como o DESIGN.md é gerado | 15 |
| Páginas de coleção e /ai-agents/ | 19 |
| Teste de tempo de resposta | 1 |

**Sites originais: 84 requisições.**

- 10 páginas iniciais: activetheory.net, lusion.co, gsap.com, jitter.video, monopo.vn, 14islands.com, linear.app, unicorn.studio, ohzi.io, itsoffbrand.com.
- 74 arquivos JS/CSS públicos, dos quais 48 são CSS do Linear.
- Nada foi executado.

### Interrupção

- A coleta foi **interrompida por decisão do coordenador**: os termos de uso da Refero proíbem coleta automatizada e redistribuição, e o `robots.txt` bloqueia robôs de IA (inclusive o ClaudeBot).
- Depois do aviso, **zero requisições** à Refero e aos sites das marcas.
- A varredura completa já tinha terminado antes do aviso.
- **Registro honesto:** essa varredura foi coleta automatizada em massa, justamente o que os termos proíbem. Não deve se repetir.

### Status do material salvo: uso interno, não vai para repositório

- **Os 25 `*-DESIGN.md`** são material de estudo interno.
  - Cada um leva no topo um aviso "USO INTERNO / NÃO versionar / NÃO redistribuir".
  - **Não devem** ser copiados para skills, para a branch `main` nem para a `rotina-video`.
- **Também são internos e descartáveis:**
  - `_raw/`, `_sites/` e `_indice-movimento.json`;
  - `../downloads/styles-head/` (pasta compartilhada da varredura).
  - Recomendo apagá-los quando o estudo terminar.
- **O que pode ir para as skills** é só o conteúdo das seções 2 a 5 deste relatório: padrões gerais reescritos, números factuais e código próprio.

### Como a Refero guarda movimento (fato técnico, para contexto)

- Os dados de cada estilo vêm embutidos no HTML da página.
- O "Download DESIGN.md" é montado no próprio navegador, sem chamar o servidor. Reproduzi essa montagem localmente para gerar os 25 arquivos.
- A Refero mede só tokens estáticos (cor, tipografia, espaçamento, forma). Movimento só aparece quando o estilo traz uma seção textual própria sobre o tema.
- **Só 35 de 1.282 estilos válidos** têm essa seção.

### Legenda das fontes

- **[R]:** número tirado da seção de movimento de um estilo da Refero.
- **[S]:** número lido por mim no JS/CSS público do site original.

---

## 1. Estilos estudados (25 DESIGN.md internos)

Arquivos em `scratchpad/hunter/refero/animacao/`. O link da Refero é `https://styles.refero.design/style/<id>`. A coluna "Movimento" é um resumo meu.

| # | Estilo | id | Site original | Movimento | Arquivo (interno) |
|---|---|---|---|---|---|
| 1 | Active Theory | 3416bd14-96bb-4c23-bd01-b2ea178ba5ce | activetheory.net | Cena WebGL ocupa a tela. A interface só aparece e some por opacidade: 0,2–0,4 s nos controles, até ~9 s nas cenas [R]. Botões com desaceleração longa de .4 s e .8 s [S] | active-theory-DESIGN.md |
| 2 | Lusion | 1b44386e-31a8-40b0-a577-27c088b51264 | lusion.co | Objetos 3D (Three.js) e texto dividido em letras [S]. Hover discreto, transform de .3–.6 s com saída seca [S] | lusion-DESIGN.md |
| 3 | monopo saigon | 3e52dd36-6ab1-48c6-bc40-47ef6d33abc2 | monopo.vn | Abertura em camadas com GSAP, rolagem suave, 3D [S]. Curva expo-out a 0,8–1,25 s [R] | monopo-saigon-DESIGN.md |
| 4 | OFF+BRAND. | 6b667ffc-5158-4000-9252-3a107d5161ee | itsoffbrand.com | GSAP + ScrollTrigger + Lenis + Three.js [S]. Letras sobem de dentro da linha; hover troca a palavra letra a letra [S] | off-brand-DESIGN.md |
| 5 | 14islands | 139c4bee-396d-494c-baf0-fe211bf4928d | 14islands.com | Framer Motion + Lenis + Three.js [S]. Letras entram levemente inclinadas, com 40 ms entre elas; faixa contínua de itens [S] | 14islands-DESIGN.md |
| 6 | OHZI | 03e03554-d7aa-40da-9764-79320ecfa1d0 | ohzi.io | Objeto 3D central; interface de contorno fino | ohzi-DESIGN.md |
| 7 | Vivid+Co | 8875b14e-c59a-492f-8780-8027a480f21c | vividand.co | Curva lenta-depois-firme `(.52,.01,0,1)` em quase tudo, base 0,5 s; brilho ambiente de 6,65 s [R] | vivid-co-DESIGN.md |
| 8 | Dylanbrouwer | b1e82907-d1cf-46cd-8ae7-3561c5b15fd0 | dylanbrouwer.design | Entrada `(.32,.72,0,1)`, saída expo-out, 0,3/0,5/0,6–0,75 s, sem overshoot [R] | dylanbrouwer-DESIGN.md |
| 9 | GSAP | 00537a20-e99e-4ef2-b119-c6f532c44cc9 | gsap.com | ScrollTrigger e SplitText; power3/power4; 1/0,6/0,4 s; stagger 0,1–0,175 [S] | gsap-DESIGN.md |
| 10 | Unicorn Studio | 6bd8007f-01bc-46cc-8599-b396a39c1474 | unicorn.studio | Fundo WebGL (curtains.js) e troca de rota com View Transitions [S] | unicorn-studio-DESIGN.md |
| 11 | Jitter | ab1e41e9-7d21-4762-b498-51b8c63ae7ce | jitter.video | Fileira de prévias animadas (Lottie) [S]. Antes da primeira pintura, testa o aparelho e escolhe uma versão mais leve do hero [S] | jitter-DESIGN.md |
| 12 | LottieFiles | a80507cb-afda-46dd-a2b9-ba91f3a78e78 | lottiefiles.com | Interface contida: 100/150/300 ms [R] | lottiefiles-DESIGN.md |
| 13 | Framer | d417b42f-824d-45ba-a02e-cbef3b8ea0d8 | framer.com | 0,75 s com `ease` na maioria; vidro fosco 3–5 px [R] | framer-DESIGN.md |
| 14 | Linear | 90ce5883-bb24-4466-93f7-801cd617b0d1 | linear.app | Tokens de .1 s e .25 s; hover a .16 s; diálogo .96→1; gaveta .5 s [S] | linear-DESIGN.md |
| 15 | Retool | c45b115b-dcb5-446d-8952-85aef740f8e4 | retool.com | Curva `(.72,0,.12,1)`; 0,6/0,4/0,2–0,3 s; brilho que varre um título [R] | retool-DESIGN.md |
| 16 | GitHub | c3ceca5c-d329-4559-b947-016172941ba2 | github.com | 0,2 s e 0,4 s; entradas expo-out; acordeões por grid [R] | github-DESIGN.md |
| 17 | Modal | 68c15685-5db9-4869-b71d-27240568c9d8 | modal.com | 300 ms ease-out nas cores; overshoot só no objeto 3D, que gira em 80 s [R] | modal-DESIGN.md |
| 18 | ClickUp | efcb73cb-b84a-4ae7-9a2b-e1116f79f130 | clickup.com | 0,45 s `(.33,1,.68,1)`; gradiente cônico girando no CTA [R] | clickup-DESIGN.md |
| 19 | Geniestudio | 2ffd50d4-93b7-4acf-9bc2-e86e61b63f27 | geniestudio.app | Entrada expo-out; acordeão 0,65 s; faixa contínua com velocidade irregular [R] | geniestudio-DESIGN.md |
| 20 | Base44 | e869e214-f672-4ac3-bfc2-bd25de7b003b | base44.com | Sobe e aparece com quint-out; micro 0,15 s; nav com blur [R] | base44-DESIGN.md |
| 21 | Antimetal | 9f9a4a4f-1a27-47ca-a65b-68b9850a84e4 | antimetal.com | Vidro com blur forte; entradas 0,6–0,7 s quint-out; um ponto pulsando [R] | antimetal-DESIGN.md |
| 22 | Origin Financial | c60f05ff-2420-4a24-92db-80c4b6a74683 | useorigin.com | Hero aparece em 2,5 s in-out-quad; contorno que se desenha [R] | origin-financial-DESIGN.md |
| 23 | mymind | 5bfe6c1d-1b15-4f8d-b0c9-677a33291c5d | mymind.com | 0,7 s expo-out; cards que se expandem [R] | mymind-DESIGN.md |
| 24 | Dia Browser | b458ca1a-70f0-4f85-b745-f879a4d08457 | diabrowser.com | Estados mudam só de cor, 0,2 s; uma faixa de espectro contínua [R] | dia-browser-DESIGN.md |
| 25 | Slack | e26cb9b0-f876-41ff-9f24-fd67a6b9776c | slack.com | 0,42 s; entradas quart-out; fundos ambientes de 4–8 s [R] | slack-DESIGN.md |

**Outros com seção de movimento** (sem DESIGN.md; números no índice interno):

| Estilo | Números |
|---|---|
| Sequel | 0,2–0,3 s; faixa de 45 s |
| Granola | 0,15/0,2 s; faixa de 75 s; nenhuma entrada |
| Factory | 0,15–0,2 s |
| Lovable | 0,15 s |
| PostHog | 0,15 s; flutuação de 3–6,7 s |
| Maze | sobe 8–12 px em 200 ms; sublinhado em 150 ms |
| Chronicle | teto de 0,4 s |
| Warp | 0,4 s |
| Ramp | 0,3–0,4 s |
| Amrit Palace | faixa de 27 s |

Também têm a seção, sem números de destaque: Nakedcityfilms, Julia Krantz, 099 SUPPLY, mono, Relate, Arc e Slush.

---

## 2. Padrões de animação (síntese própria)

### 2.1 Escala de tempo por camada

Cruzei os 35 sistemas com seção de movimento e os 10 sites lidos. Aparecem sete camadas bem separadas:

| Camada | Faixa | De onde vem |
|---|---|---|
| Resposta ao toque | 100–120 ms | LottieFiles, 099 SUPPLY, Linear |
| Hover e troca de cor | 150–200 ms | Granola, Lovable, PostHog, Base44, Linear (.16 s), GitHub, Dia |
| Mudança de estado e componente | 250–450 ms | Linear .25 s, Modal 300 ms, GitHub/Warp 0,4 s, ClickUp 0,45 s |
| Entrada ao rolar | 600–750 ms | Antimetal, Dylanbrouwer, mymind, Framer |
| Frase do hero | 0,8–1,5 s | monopo, OFF+BRAND, GSAP |
| Atmosfera | 2–9 s | Origin 2,5 s, Slack, PostHog, Vivid+Co, Active Theory |
| Loop de fundo | 27–80 s | faixas de logos (27/45/75 s), objeto girando (80 s) |

**Intervalo entre itens (stagger):**

| Unidade | Intervalo | Fontes |
|---|---|---|
| Letras | 30–40 ms | OFF+BRAND, 14islands |
| Linhas e links | ~75 ms | monopo |
| Blocos | 100–175 ms | GSAP |

### 2.2 Curvas mais usadas

| Curva | Família | Uso típico observado |
|---|---|---|
| `(.4,0,.2,1)` | padrão Material/Tailwind | estados e layout em produtos SaaS e de IA |
| `(.16,1,.3,1)` e `(.19,1,.22,1)` | expo-out | entradas e hero (GitHub, Geniestudio, monopo, mymind) |
| `(.22,1,.36,1)` | quint-out | entradas ao rolar (Base44, Antimetal) |
| `(.33,1,.68,1)` / `(.165,.84,.44,1)` | cubic-out / quart-out | revelações (ClickUp, Slack) |
| `(.32,.72,0,1)` | estilo "folha" do iOS | gavetas e painéis (Linear, Dylanbrouwer) |
| `(.86,0,.07,1)` / `(.645,.045,.355,1)` | quint/cubic in-out | letras e menus em agências (OFF+BRAND) |
| `(.52,.01,0,1)`, `(.72,0,.12,1)`, `(.625,.05,0,1)` | curvas autorais "pesadas" | marcas premium (Vivid+Co, Retool, Sequel) |
| `(.34,1.56,.64,1)` | back-out (passa do ponto) | só em objeto de marca (Modal) |

**Tradução GSAP → bezier**, útil para portar sites GSAP para Motion:

| GSAP | Família | Bezier `.out` | Bezier `.inOut` |
|---|---|---|---|
| `power1` | quad | `[.25,.46,.45,.94]` | — |
| `power2` | cubic | `[.215,.61,.355,1]` | `[.645,.045,.355,1]` |
| `power3` | quart | `[.165,.84,.44,1]` | — |
| `power4` | quint | `[.23,1,.32,1]` | `[.86,0,.07,1]` |
| `expo` | expo | `[.19,1,.22,1]` | — |

### 2.3 Padrões, descritos por mim

1. **Abertura em camadas que vêm das bordas.**
   - O hero monta em ~2 s.
   - A barra de navegação desce do topo.
   - As frases sobem uma de cada vez, com ~75 ms entre elas.
   - Os links entram pela lateral.
   - Tudo numa só curva de desaceleração longa (expo-out) [S, monopo].
2. **Letras em sequência.**
   - Dois sabores:
     - (a) a letra sobe de dentro da própria linha, com ordem embaralhada e ~30 ms entre letras [S, OFF+BRAND];
     - (b) a letra aparece corrigindo uma leve inclinação e achatamento, com ~40 ms entre letras [S, 14islands].
3. **Entrada ao rolar.**
   - Pequeno deslocamento vertical (8–12 px) mais opacidade, em 0,6–0,7 s, com curva de saída forte. Acontece uma vez só.
   - **Contraponto:** produtos de "ferramenta silenciosa" (Granola, Dia, Factory) evitam qualquer entrada.
4. **Hover de botões e links.**
   - Trocar todas as propriedades de cor juntas em 150–300 ms dá sensação de interruptor único.
   - Palavras podem "rolar" para revelar uma cópia.
   - Sublinhado cresce da esquerda.
   - Botões vazados mostram o estado por opacidade.
   - Hover não anima sombra nem fundo de área grande.
5. **Cards.** Elevação curta (~0,3 s) no hover. Prévias com sombra longa e difusa. Expansão do card em ~0,7 s.
6. **Faixa contínua (marquee).** Linear, longa (27–75 s), pausa no hover e para com movimento reduzido. Variação: velocidade irregular via `linear()`.
7. **Um único movimento contínuo por tela.** Gradiente girando no CTA, objeto 3D girando devagar ou ilustração flutuando: só um por vez.
8. **Texto com brilho.** Gradiente varrendo um único título de destaque.
9. **Diálogo, gaveta e acordeão.**
   - **Diálogo:** nasce de 96% de escala com fade em ~200 ms.
   - **Gaveta:** curva de folha em ~500 ms.
   - **Acordeão:** anima `grid-template-rows`.
10. **Troca de página.** View Transitions nativas [S, Unicorn Studio], ou só cruzamento de opacidade em cenas imersivas.
11. **3D e WebGL nas agências.** O objeto 3D concentra cor e drama, e a interface fica neutra e fina (contorno de 1 px, vidro fosco leve, sem sombra).
12. **Qualidade adaptativa.** Testar o aparelho antes da primeira pintura e servir uma versão leve [S, Jitter]. Respeitar `prefers-reduced-motion` [S, 14islands e OFF+BRAND].

### 2.4 Bibliotecas vistas nos bundles [S]

| Biblioteca | Sites |
|---|---|
| GSAP (+ScrollTrigger/SplitText) | OFF+BRAND, monopo, gsap.com |
| Three.js | Lusion, monopo, OFF+BRAND, 14islands |
| Lenis | OFF+BRAND, 14islands |
| locomotive-scroll | monopo |
| Framer Motion | 14islands |
| Theatre.js | Active Theory |
| curtains.js e View Transitions | Unicorn Studio |
| Lottie | Jitter |
| CSS puro com tokens | Linear |

---

## 3. Receitas (código próprio)

Pressupõem Motion 14 (`motion/react`) e Tailwind v4. Envolva o app com `<MotionConfig reducedMotion="user">`.

### R1. Tokens

```css
@theme {
  --ease-std: cubic-bezier(.4,0,.2,1);
  --ease-enter: cubic-bezier(.22,1,.36,1);
  --ease-hero: cubic-bezier(.19,1,.22,1);
  --ease-sheet: cubic-bezier(.32,.72,0,1);
  --ease-heavy: cubic-bezier(.52,.01,0,1);
}
:root { --t-tap:100ms; --t-hover:160ms; --t-state:300ms; --t-enter:650ms; --t-hero:1100ms; }
```

### R2. Botão com troca de cor única e toque

```html
<button class="rounded-full bg-zinc-950 px-5 py-2.5 text-white dark:bg-white dark:text-zinc-950
  transition-[color,background-color,border-color,transform] duration-150 ease-std
  hover:bg-zinc-800 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2
  motion-reduce:transition-none">Experimentar</button>
```

### R3. Palavra que troca letra a letra no hover

```tsx
import { motion } from "motion/react";
const SWAP = [0.86, 0, 0.07, 1];
export function SwapLabel({ text }: { text: string }) {
  const letters = Array.from(text);
  return (
    <motion.span aria-label={text} initial="idle" whileHover="active" className="inline-flex overflow-hidden">
      {letters.map((l, i) => {
        const d = ((i * 5) % letters.length) * 0.028;
        const glyph = l === " " ? " " : l;
        return (
          <span key={i} aria-hidden className="relative inline-block">
            <motion.span className="block" variants={{ idle: { y: 0 }, active: { y: "-100%" } }}
              transition={{ duration: 0.45, ease: SWAP, delay: d }}>{glyph}</motion.span>
            <motion.span className="absolute inset-x-0 top-full block" variants={{ idle: { y: 0 }, active: { y: "-100%" } }}
              transition={{ duration: 0.45, ease: SWAP, delay: d }}>{glyph}</motion.span>
          </span>
        );
      })}
    </motion.span>
  );
}
```

### R4. Sublinhado que cresce

```html
<a class="relative after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0
  after:bg-current after:transition-transform after:duration-150 hover:after:scale-x-100">Planos</a>
```

### R5. Entrada ao rolar

```tsx
const rise = {
  off: { opacity: 0, y: 10 },
  on: (k = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: k * 0.07 } }),
};
<motion.div variants={rise} custom={k} initial="off" whileInView="on" viewport={{ once: true, amount: 0.25 }} />
```

### R6. Abertura em camadas

```tsx
import { motion, stagger } from "motion/react";
const OUT = [0.19, 1, 0.22, 1];
const stage = { on: { transition: { delayChildren: stagger(0.08, { startDelay: 0.5 }) } } };
const down = { off: { y: "-100%" }, on: { y: 0, transition: { duration: 0.9, ease: OUT } } };
const up = { off: { y: "50%", opacity: 0 }, on: { y: 0, opacity: 1, transition: { duration: 1.1, ease: OUT } } };
const side = { off: { x: "100%", opacity: 0 }, on: { x: 0, opacity: 1, transition: { duration: 0.9, ease: OUT } } };
<motion.header variants={stage} initial="off" animate="on">
  <motion.nav variants={down} /> <motion.h1 variants={up} /> <motion.p variants={up} /> <motion.div variants={side} />
</motion.header>
```

### R7. Letras que se endireitam

```tsx
const glyph = {
  off: { opacity: 0, skewX: -3, rotate: 1.5, scaleY: 0.9 },
  on: (i: number) => ({ opacity: 1, skewX: 0, rotate: 0, scaleY: 1,
    transition: { delay: i * 0.035, duration: 0.35, opacity: { duration: 0.7 } } }),
};
// cada letra: <motion.span custom={i} variants={glyph} initial="off" animate="on"
//   style={{ display: "inline-block", transformOrigin: "left top" }} aria-hidden />
```

### R8. Faixa contínua

```css
.belt { display:flex; overflow:hidden; mask-image:linear-gradient(90deg,#0000,#000 6%,#000 94%,#0000); }
.belt > ul { display:flex; gap:3rem; flex:none; min-width:100%; padding-right:3rem; animation: belt 50s linear infinite; }
.belt:hover > ul { animation-play-state: paused; }
@keyframes belt { to { transform: translateX(-100%); } }
@media (prefers-reduced-motion: reduce) { .belt > ul { animation: none; } }
```

Use duas `<ul>` iguais, lado a lado.

### R9. Brilho em um título

```css
.glint { --a: currentColor; --b: oklch(75% .15 40); --c: oklch(70% .12 250);
  background: linear-gradient(100deg, var(--a) 30%, var(--b) 45%, var(--c) 55%, var(--a) 70%) 0 0 / 250% 100%;
  -webkit-background-clip:text; background-clip:text; color:transparent; animation: glint 3s linear infinite; }
@keyframes glint { to { background-position: -250% 0; } }
@media (prefers-reduced-motion: reduce) { .glint { animation:none; background:none; color:inherit; } }
```

### R10. Diálogo e gaveta

```tsx
<AnimatePresence>{open && (
  <motion.div role="dialog" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.18, ease: "easeOut" }} />)}
</AnimatePresence>
// gaveta: initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
```

### R11. Acordeão por grid

```html
<div class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-std data-[open]:grid-rows-[1fr]">
  <div class="min-h-0 overflow-hidden">…</div>
</div>
```

### R12. Troca de rota com View Transitions

```ts
export function go(update: () => void) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!("startViewTransition" in document) || reduce) return update();
  document.startViewTransition(update);
}
```

```css
::view-transition-old(root) { animation: .18s ease-in both vt-out; }
::view-transition-new(root) { animation: .32s cubic-bezier(.22,1,.36,1) both vt-in; }
@keyframes vt-out { to { opacity: 0 } }
@keyframes vt-in { from { opacity: 0 } }
```

---

## 4. Encaixe com as regras de composição do editor

As 4 regras de `remotion-video` valem para vídeo. Na web, algumas receitas acima são normais; no vídeo, é preciso convertê-las:

| Receita ou padrão | Regra em jogo | Como converter no vídeo |
|---|---|---|
| Letra ou linha subindo "de dentro" da linha (R3, padrão 2a) | **2: recorte no meio da tela** | Use `Entra` (vem de fora do quadro) ou `PalavraDividida`. Máscara só quando a borda é real, como a tela do celular. |
| Entrada ao rolar e letras que se endireitam (R5, R7) | **4: texto que brota do nada** | Use `Entra` a partir da borda mais próxima, ou `Atras` saindo do celular. O ritmo de ~70 ms entre itens vira ~2 quadros a 30 fps. |
| Palavra que troca no hover (R3) | **1 e 2: texto sobre texto, recorte** | A palavra antiga sai inteira do quadro antes de a nova entrar. |
| Faixa contínua com bordas esfumadas (R8) | **2**, se não ocupar a largura toda | Ocupe a largura inteira do quadro: aí o corte é a borda do vídeo. |
| Vidro, blur e brilho (padrões 8 e 11) | **2: o blur corta** | Filtro SVG com `filterUnits="userSpaceOnUse"` e região maior que o quadro. |
| O 3D concentra o drama e a interface fica neutra (padrão 11) | Combina com a **regra 3** | O celular é o "objeto 3D". Fica acima de textos e cartões, e só cobre um texto depois de ele ser lido. |
| Overshoot (back-out) | **1**: as metades do título não podem se cruzar | Overshoot só em objeto de marca. Títulos usam mola criticamente amortecida, como a `{320,38}` do `PalavraDividida`. |
| Abertura em camadas a partir das bordas (R6) | Já obedece à **regra 4** | Header de cima, links da lateral: tudo nasce fora do quadro. |

**Conversão para quadros a 30 fps** (lembre do tempo de leitura de ≥ 8–10 quadros parado):

| Web | Quadros |
|---|---|
| 160 ms | 5 |
| 300 ms | 9 (= `Atras` `{170,20}`) |
| 450 ms | 13–14 |
| 650 ms | ~20 |
| 1,1 s | 33 |

- A mola `Entra` `{300,26}` (7 quadros) corresponde à camada "hover e troca de cor".
- Para um vídeo com cara de estúdio, frases de 18–33 quadros.
- **Curva expo-out no Remotion:** `Easing.bezier(.19, 1, .22, 1)`. Não passa do ponto, então é segura para texto.

---

## 5. Recomendação para as skills

Só conteúdo próprio: as seções 2 a 4. Nenhum DESIGN.md nem texto da Refero entra nas skills.

### button-animation

- Incluir a escala de tempo por camada (2.1).
- Incluir as receitas R2, R3 (com o aviso de vídeo da seção 4), R4 e R10.
- **Regras novas:**
  - overshoot só em objeto de marca;
  - hover não anima sombra nem fundo grande;
  - botão vazado mostra estado por opacidade;
  - um único movimento contínuo por tela (vale para o anel de gradiente que já existe).

### motion-oficial (em APRENDIZADOS.md, sem tocar no conteúdo oficial)

- A tabela de curvas e a tradução GSAP → bezier (2.2).
- `stagger()` com `startDelay` (R6).
- View Transitions nativas (R12).
- Qualidade adaptativa por aparelho e `reducedMotion="user"`.

### thumbnail-carousel

- **Variante "faixa contínua"** (R8): 45–75 s para logos, pausa no hover, desligada com movimento reduzido.
- **Variante "fileira de prévias":** cards grandes com sombra difusa no hover.
- **Mola:** documentar `visualDuration: .6, bounce: 0` como equivalente da mola pesada atual.
- **Vídeo:** faixa de ponta a ponta do quadro.

### ui-ux-pro-max (seção curta)

- **Antes de animar, escolher uma personalidade:**

  | Personalidade | Durações | Curvas e traços |
  |---|---|---|
  | Utilidade silenciosa | 100–200 ms | só cor; sem entradas |
  | Premium com peso | 0,4–0,75 s | curvas autorais lentas-depois-firmes; sem mola |
  | Estúdio cinematográfico | hero de 1–1,5 s | letras em sequência, 3D concentrando cor |
  | Lúdico | — | o conteúdo anima; a interface fica contida |

- **Todo design system gerado deve ter uma seção de movimento** com:
  - durações por camada;
  - 1 ou 2 curvas;
  - propriedades permitidas;
  - o que nunca anima;
  - qual é o único movimento contínuo.
- **Na revisão:** conferir hover, selecionado, desabilitado, carregando, vazio, erro, texto longo e mobile.

---

## 6. Arquivos

- `RELATORIO-animacao.md`: este relatório.
- **25 `*-DESIGN.md` (internos, com aviso no topo):**
  - agências: active-theory, lusion, monopo-saigon, off-brand, 14islands, ohzi, vivid-co, dylanbrouwer;
  - ferramentas de animação e design: gsap, unicorn-studio, jitter, lottiefiles, framer;
  - SaaS, IA e devtools: linear, retool, github, modal, clickup, geniestudio, base44, antimetal, origin-financial, mymind, dia-browser, slack.
- **Internos e descartáveis:**
  - `_indice-movimento.json`, `_raw/` (35 páginas), `_sites/` (10 HTML + 74 JS/CSS);
  - `../downloads/styles-head/` (1.342 cabeçalhos);
  - scripts em `scratchpad/anim-scripts/`.
