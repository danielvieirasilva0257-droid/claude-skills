# Movimento em sites premium, minimalistas e animados

Síntese nossa, feita a partir de 11/10/2026:
- das **35 seções de movimento** que o Refero escreveu (só 35 dos 1.342 estilos têm uma);
- da leitura, sem executar, do CSS e do JS público de 10 sites de estúdios.

Legenda: **[R]** = medido no CSS e interpretado pelo Refero; **[S]** = lido no código do próprio site.

O código testado (TypeScript estrito, `motion@14.0.0`, React 18) está em `../assets/receitas-movimento.tsx`. Para a técnica do Motion (molas, gestos, desempenho), use a skill `motion-oficial`; para botões, a `button-animation`.

## 1. Escolha a personalidade antes de animar

| Personalidade | Sites | O que anima | Números |
|---|---|---|---|
| **Utilidade quieta** | Linear, Dia, Granola, Factory, GitHub | Só cor e opacidade. Nada entra ao rolar. Granola, Arc, Relate e Nakedcityfilms **proíbem** revelação ao rolar | Toque 100 ms; hover 150 a 200 ms; estado 250 ms |
| **Premium com peso** | Apple, Sequel, Vivid+Co, Retool, Dylanbrouwer | Cor no hover; seções entram uma vez; produto com escala ou paralaxe leve | Hover 0,15 a 0,25 s; seção 0,5 a 0,75 s; curvas `(.19,1,.22,1)`, `(.52,.01,0,1)` ou `(.72,0,.12,1)`; **sem mola** |
| **Estúdio cinematográfico** | monopo, OFF+BRAND, Lusion, Active Theory, 14islands | Hero montado em camadas, letras em cascata, 3D ou vídeo carregando a cor; a interface fica "fantasma" | Hero de 1 a 1,5 s; cascata de letras de 30 a 40 ms; de linhas, 75 ms; de blocos, 100 a 175 ms |
| **Lúdico** | Jitter, LottieFiles, PostHog | O conteúdo (prévias, ilustrações) se mexe; a interface fica contida | Interface em 100, 150 e 300 ms; flutuação de 3 a 6,7 s |

**Regra premium** (Dia, Apple, Samsung): **"muda de cor, não de posição".** Botão sem escala no hover, sem bounce e sem elástico.

## 2. Durações por camada (consenso dos 35)

| Camada | Faixa | Exemplos reais |
|---|---|---|
| Toque e retorno imediato | 100–120 ms | LottieFiles 100 ms; Linear `--speed-quickTransition .1s` [S] |
| Hover e cor | 150–200 ms | Granola, Lovable, PostHog e Base44 0,15 s; Linear 0,16 s; GitHub, Dia e Origin 0,2 s [R] |
| Estado e componente | 250–450 ms | Linear 0,25 s; Modal e LottieFiles 300 ms; GitHub e Warp 0,4 s; Slack 0,42 s; ClickUp 0,45 s |
| Entrada ao rolar | 600–750 ms | Antimetal 0,6–0,7 s; Dylanbrouwer 0,6–0,75 s; mymind 0,7 s; Framer 0,75 s |
| Frase do hero | 0,8–1,5 s | monopo 0,8, 1,2 e 1,25 s; OFF+BRAND 1–1,5 s; GSAP 1 s |
| Atmosfera | 2–9 s | Origin 2,5 s; Slack 4 e 8 s; PostHog 3–6,7 s; Vivid+Co 6,65 s |
| Loop ambiente | 27–80 s | Amrit 27 s; Sequel 45 s; Granola 75 s; cubo do Modal 80 s |

- **App ou ferramenta:** fique nas 3 primeiras linhas. A partir de 500 ms, a interface de produto parece lenta.
- **Página de marketing:** pode usar as de baixo.

## 3. Dicionário de curvas

| Curva | Nome | Para quê | Quem usa |
|---|---|---|---|
| `cubic-bezier(.4,0,.2,1)` | standard (Material/Tailwind) | Hover, cor, componente | Dia (141×), LottieFiles, Factory, Antimetal |
| `cubic-bezier(.22,1,.36,1)` | easeOutQuint | Entrada de bloco ao rolar | Base44, Antimetal |
| `cubic-bezier(.19,1,.22,1)` | easeOutExpo | Hero, chegada "pousada" | monopo (38×), mymind, Dylanbrouwer; token `--ease-out-expo` do Linear |
| `cubic-bezier(.16,1,.3,1)` | easeOutExpo (variante) | Revelação ao rolar | GitHub, Geniestudio |
| `cubic-bezier(.33,1,.68,1)` | easeOutCubic | Componente | ClickUp (1.000×) |
| `cubic-bezier(.165,.84,.44,1)` | easeOutQuart (= GSAP `power3.out`) | Revelação | Slack (40×) |
| `cubic-bezier(.25,.46,.45,.94)` | easeOutQuad (= `power1.out`) | Hover curto, diálogo | Linear (0,16 s) |
| `cubic-bezier(.32,.72,0,1)` | Folha do iOS | Gaveta, painel de baixo | Linear (0,5 s), Dylanbrouwer |
| `cubic-bezier(.52,.01,0,1)` | "Puxada de foco" | Premium com peso | Vivid+Co (150×) |
| `cubic-bezier(.72,0,.12,1)` | "Encaixe de precisão" | Premium com peso | Retool |
| `cubic-bezier(.625,.05,0,1)` | "Zoom lento" | Imagem | Sequel |
| `cubic-bezier(.86,0,.07,1)` | easeInOutQuint (= `power4.inOut`) | Texto que rola, troca | OFF+BRAND (49×), GSAP |
| `cubic-bezier(.645,.045,.355,1)` | easeInOutCubic (= `power2.inOut`) | Mover na tela | OFF+BRAND (173×) |
| `cubic-bezier(.35,0,.36,1)` | — | Borda de campo, foco | Samsung (busca) |
| `cubic-bezier(.34,1.56,.64,1)` | easeOutBack (**passa do ponto**) | **Só** objeto de marca | Modal (só no cubo 3D) |

**GSAP → curva:**

| GSAP | Família | Valor de `.out` |
|---|---|---|
| `power1` | Quad | — |
| `power2` | Cubic | `[.215,.61,.355,1]` |
| `power3` | Quart | `[.165,.84,.44,1]` |
| `power4` | Quint | `[.23,1,.32,1]` |
| `expo.out` | Expo | `[.19,1,.22,1]` |

No Motion, use o array: `ease: [0.19, 1, 0.22, 1]`. No Remotion: `Easing.bezier(.19, 1, .22, 1)`.

## 4. Tokens de movimento para o DESIGN.md

```css
@theme {                                   /* Tailwind v4: gera as classes ease-standard, ease-out-expo... */
  --ease-standard: cubic-bezier(.4,0,.2,1);
  --ease-out-quint: cubic-bezier(.22,1,.36,1);
  --ease-out-expo: cubic-bezier(.19,1,.22,1);
  --ease-drawer: cubic-bezier(.32,.72,0,1);
  --ease-weighted: cubic-bezier(.52,.01,0,1);
}
:root {
  --dur-tap: 100ms; --dur-hover: 150ms; --dur-state: 300ms;
  --dur-reveal: 700ms; --dur-hero: 1200ms;
}
```

A seção **Movimento** do `DESIGN.md` diz:
1. as durações por camada;
2. 1 ou 2 curvas de assinatura;
3. as propriedades que podem animar (de preferência `opacity`, `transform`/`scale`, `color`, `background-color` e `border-color`);
4. o que **nunca** anima: sombra, fundo de área grande, largura e altura;
5. o **único** movimento contínuo da página.

## 5. Receitas (todas seguem as regras do editor)

| # | Receita | Onde está | Regras do editor atendidas |
|---|---|---|---|
| M1 | `MotionConfig reducedMotion="user"` em volta do app | `assets` | — |
| M2 | Lista que sobe ao rolar: 24 px, 0,7 s, `easeOutQuint`, cascata de 75 ms (até 4 itens). Dispara assim que **encosta na borda de baixo** (`viewport={{ once: true }}`) | `assets` | 4: o texto chega junto com a rolagem, da borda |
| M3 | **Hero calmo:** o texto está parado; o produto sobe da borda de baixo da janela (`y: "60vh"` → 0, 1,2 s, `easeOutExpo`). Seção com `min-h-svh` e `overflow-x-clip` | `assets` | 3: produto em z 20, sem cobrir o título; 4 |
| M4 | **Hero coreografado:** barra de cima desce de `y: "-100%"`, linhas do título entram da esquerda (`x: "-100vw"`) e o CTA da direita (`x: "100vw"`), com `stagger(0.075, { startDelay: 0.6 })` e `easeOutExpo` | `assets` | 4: tudo nasce fora da janela; 1: as linhas andam em faixas separadas, sem se cruzar; 2: `overflow-x: clip` na seção (a borda é a da janela) |
| M5 | **Texto que rola** num botão em pílula **com fundo visível**: cada letra sobe a altura inteira do botão (44 px) e a cópia vem de baixo; 0,5 s, `power4.inOut`, cascata de 30 ms em ordem embaralhada | `assets` | 2: o corte é a borda do botão; 1: as cópias ficam a 44 px de distância e não se encostam |
| M6 | **Barra de vidro:** depois de 8 px de rolagem, fundo branco com 85% de opacidade, `backdrop-blur-xl`, `backdrop-saturate-[1.8]` e linha de 1 px | `assets` | 1: o menu nunca fica transparente sobre um título |
| M7 | **Diálogo** de `scale(.96)` com opacidade 0 → 1 em 0,2 s (sai em 0,15 s); **gaveta** de `y: "100%"` em 0,5 s com a curva da folha do iOS | `assets` | 3: o diálogo fica acima de tudo; 4: a gaveta vem da borda |
| M8 | Troca de página com `document.startViewTransition` (sai em 200 ms, entra em 300 ms), desligada com movimento reduzido | `assets` | — |

**Receitas só de CSS:**

```html
<!-- Botão premium: troca a cor inteira de uma vez; escala só no toque (Tailwind v4: scale é propriedade própria) -->
<button class="h-11 rounded-full bg-neutral-950 px-6 text-[15px] font-medium text-white
  transition-[color,background-color,border-color,opacity,scale] duration-150 ease-standard
  hover:bg-neutral-800 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2
  motion-reduce:transition-none">Comprar</button>

<!-- Link com sublinhado que cresce da esquerda (150 ms) -->
<a class="relative after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0
  after:bg-current after:transition-transform after:duration-150 after:ease-out hover:after:scale-x-100
  motion-reduce:after:transition-none">Saiba mais ›</a>

<!-- Card de produto: a foto cresce 5% dentro da borda do card (borda real) -->
<a class="group block overflow-hidden rounded-[28px] bg-white">
  <img class="transition-[scale] duration-500 ease-out-expo group-hover:scale-105 motion-reduce:transition-none" src="…" alt="…">
</a>

<!-- Acordeão sem medir altura (o corte é a borda do próprio painel, que tem linha de 1 px) -->
<div class="grid grid-rows-[0fr] border-b border-black/10 transition-[grid-template-rows] duration-500 ease-standard data-[open=true]:grid-rows-[1fr]">
  <div class="overflow-hidden">…</div>
</div>
```

```css
/* Marquee de logos: SEMPRE numa faixa de largura total, sem margem lateral (a borda do esfumado é a borda da tela) */
.marquee { display:flex; overflow:hidden; width:100%;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);
  mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent); }
.marquee__trilha { display:flex; gap:48px; flex:none; min-width:100%; animation: mq 45s linear infinite; }
.marquee:hover .marquee__trilha { animation-play-state: paused; }
@keyframes mq { to { transform: translateX(-100%); } }
@media (prefers-reduced-motion: reduce) { .marquee__trilha { animation: none; } }
/* Duas trilhas iguais lado a lado (a segunda com aria-hidden="true"). Logos: 45–75 s. Frases: 20–30 s. */

/* Brilho que passa no texto: só UMA frase por página */
.brilho { background: linear-gradient(90deg, currentColor 0%, #e8765e 40%, #518dd2 60%, currentColor 100%) 0 0 / 300% 100%;
  -webkit-background-clip:text; background-clip:text; color:transparent; animation: br 2.5s linear infinite; }
@keyframes br { to { background-position: -200% 0; } }
@media (prefers-reduced-motion: reduce) { .brilho { animation:none; color:inherit; background:none; } }
```

## 6. Padrões populares que quebram as regras do editor (e a troca)

| Padrão visto nos sites | Regra quebrada | Use no lugar |
|---|---|---|
| Linha ou letra subindo de dentro de uma "fenda" (`overflow:hidden` na linha; OFF+BRAND, monopo) | 2: linha de corte invisível no meio da página | M4 (entra da borda da janela) ou texto parado com o produto se movendo (M3) |
| Letras que aparecem no lugar, com inclinação (14islands) ou fade-and-rise de 12 px no meio da tela | 4: o texto brota do nada | M2, disparada na borda de baixo, ou M4 |
| Palavra que troca no título | 4, e 1 se as palavras se cruzarem | Evite. Se o Daniel aprovar: `AnimatePresence mode="wait"` (a velha sai antes) e ≥ 2 s por palavra |
| Mola com overshoot em título | 1: as partes podem se cruzar | Mola sem passar do ponto (`bounce: 0`). Overshoot só no objeto de marca (Modal: só no cubo) |
| Header transparente fixo | 1: o menu fica sobre os títulos | M6 |
| Blur ou vidro cortado por um contêiner menor | 2 | Espaço em volta do elemento; em SVG, `filterUnits="userSpaceOnUse"` |
| Marquee esfumado dentro de uma caixa | 2 | Marquee na largura toda da janela |
| Produto grande que, no carregamento, cobre o título | 3 | Produto abaixo do título em repouso; a sobreposição só acontece ao rolar, depois da leitura |

## 7. Desempenho e cuidado

- Anime `opacity` e `transform`/`scale`. **No hover, não anime sombra nem fundo de área grande** (regra do GitHub). Nunca use `transition: all`.
- **Rolagem suave:** é opcional. Se usar, Lenis com `lerp ≈ 0,1` (monopo, 14islands, OFF+BRAND). Ela não pode quebrar o "reduzir movimento".
- **Aparelho fraco:** a Jitter mede o aparelho antes da primeira pintura e serve um hero mais leve (classe `.low-performance-device`). Para hero com 3D ou vídeo, faça o mesmo e tenha um pôster parado.
- **No máximo 1 loop contínuo por tela** (regra da ClickUp): marquee, **ou** gradiente girando, **ou** objeto flutuando.
- **Carrossel e vídeo que andam sozinhos** precisam de botão de pausa. A Apple agrupa pontos e pausa numa pílula translúcida.

## 8. Do site para o vídeo (Remotion, 30 fps)

| Web | Quadros |
|---|---|
| 150 ms | 4–5 |
| 200 ms | 6 |
| 300 ms | 9 (≈ `Atras` com mola `{170, 20}`) |
| 450 ms | 13–14 |
| 700 ms | 21 |
| 1,2 s | 36 |

- **Cascata de 75 ms** ≈ 2 quadros.
- **A mola `Entra` `{300, 26}`** pousa em 7 quadros (≈ 233 ms), que é a faixa do hover. Para um vídeo "cinema de agência", use de 18 a 36 quadros.
- **As curvas** viram `interpolate(frame, [a, b], [0, 1], { easing: Easing.bezier(.19, 1, .22, 1) })`. A `easeOutExpo` não passa do ponto e é segura para texto.
- **O texto que rola (M5) no vídeo:** a palavra sai inteira para fora do quadro antes de a nova entrar.
