---
name: motion-oficial
description: "Animação de interface na web, do jeito certo: decide SE e COMO animar (frequência, propósito, ferramenta mais barata), dá os números (durações, curvas cubic-bezier, molas), escreve com Motion 14 (o antigo Framer Motion: motion/react, motion-v) ou CSS puro, cuida de acessibilidade (prefers-reduced-motion), revisa e audita desempenho de graça, e aplica as regras de composição do editor. Use ao animar um botão, menu, modal, gaveta, toast, lista, aba, página ou tela de app; ao dizer 'deixa mais fluido', 'está travando', 'está com cara de IA', 'parece barato', 'revisa essa animação'; ao escrever molas CSS linear(); ao buscar na documentação do Motion; ao migrar de framer-motion; e ao montar telas de app para vídeo promocional."
argument-hint: "[pedido, ex.: 'anima esse modal', 'revisa src/Menu.tsx', 'mola com bounce 0.3', 'upgrade', 'por que está travando']"
---

# Animação de UI (Motion + CSS)

Base: a skill oficial do Motion (`motion-ai` 14.1.0, MIT), costurada com as melhores partes de Emil Kowalski, Matthew Blode, Kyle Zantos, ibelick, Raphael Salaja, Motion Lexicon, Material 3 e Vercel. A origem de cada parte está marcada ao lado e listada em `ORIGEM.md`.

**Postura:** você é o design engineer que constrói a animação. Decida, explique em uma linha, escreva o código. Não ofereça um cardápio de opções. Às vezes a resposta certa é **"isso não deve animar"**, e isso é um acerto. *(Emil, MIT)*

## Arquivos de apoio: quando ler cada um

| Arquivo | Leia quando |
|---|---|
| `references/api-motion.md` | For escrever código com Motion: imports, `transform` × `x/y`, MotionValues, `AnimatePresence`, `layout`, React, Vue, JS puro, Base UI, Radix, armadilhas. |
| `references/receitas.md` | O pedido for um componente comum: clique, dropdown, tooltip, modal, gaveta, toast, acordeão, lista, troca de ícone, aba, scroll reveal, arrastar para dispensar, segurar para confirmar. **Comece da receita**, não do zero. |
| `references/molas-e-curvas.md` | Precisar de números finos: presets de mola, molas Apple e Material 3, mola assimétrica, molas em CSS `linear()`, tabela de curvas. |
| `references/gestos.md` | Houver arrastar, deslizar, soltar com impulso, snap, elástico na borda. |
| `references/coreografia.md` | Várias peças se mexerem juntas (sequência, stagger, beats), ou for uma **tela de app para vídeo** / landing page. |
| `references/revisao.md` | Pedirem revisão, auditoria, "está travando", "está estranho", "cara de IA", ou antes de entregar algo grande. |
| `references/codex-mcp.md` | Precisar consultar a documentação oficial, exemplos, Motion UI, migrar versão, ou o usuário falar de Motion+ / MotionScore / editor visual. |
| `agents/motion-reviewer.md` | A revisão for de uma **pasta ou projeto inteiro** (um subagente por área). Um arquivo só: revise direto, sem subagente. |

## Ordem de trabalho (siga em ordem)

Os passos 1 e 2 decidem tudo. Não escolha curva antes de saber se vai animar. *(sequência do Emil, MIT)*

### 1. Deve animar? (frequência)

| Quantas vezes o usuário vê | Decisão |
|---|---|
| 100+ por dia (atalho de teclado, abrir paleta de comandos) | **Não anima. Nunca.** Pare aqui. |
| Dezenas por dia (hover, navegar numa lista) | Quase imperceptível: rápido e sutil, ou nada. |
| Ocasional (modal, gaveta, toast) | Animação padrão. |
| Raro ou primeira vez (onboarding, sucesso, comemoração) | Aqui mora o "encanto". |

Ação disparada pelo teclado é desclassificada. Se o pedido não passa, diga isso e ofereça a alternativa sem movimento (troca instantânea).

### 2. Para quê? (nomeie em uma palavra)

**Feedback** (o sistema ouviu) · **Consistência espacial** (de onde veio, para onde foi) · **Estado** (deixar a mudança legível) · **Evitar salto** (conteúdo que "teletransportaria") · **Explicação** (marketing, onboarding) · **Encanto** (só no nível raro).

Não consegue nomear? Não construa. Dado que o usuário está lendo ou usando não se mexe por estilo.

### 3. Ferramenta mais barata que resolve

| Necessidade | Ferramenta |
|---|---|
| Hover, clique, cor, estado por classe/atributo | **CSS transition** |
| Entrada ao montar, sem estado em JS | **CSS `@starting-style`** |
| Movimento predeterminado que precisa ficar liso com a página carregando | **CSS animation** (fora da thread principal) |
| Controle por código sem biblioteca | **WAAPI** (`element.animate()`) |
| Molas, `layout`, saída de elemento, gestos, valores ligados ao ponteiro | **Motion** |

Não instale Motion para um fade. Se o projeto já usa Motion, use-o. Se a tarefa pede um **componente** (dropdown, gaveta, toast, command menu), use uma biblioteca acessível (Base UI, Radix, Vaul, Sonner) e anime por cima, em vez de montar `<div>` na mão. *(Emil, MIT; Vercel WIG, MIT)*

### 4. Quais propriedades

- **Só `transform` e `opacity`** para movimento: pulam layout e pintura. `clip-path` é a quarta aceita; `filter` com moderação; `height` só em acordeão.
- **Nunca `scale(0)`.** Comece de `scale(0.9–0.97)` com `opacity: 0`. Popover pequeno no lado baixo (0,9–0,95), diálogo grande no alto (0,96).
- **`transform-origin` no gatilho** em popover, dropdown, menu, tooltip (`var(--transform-origin)` no Base UI; `--radix-…-transform-origin` no Radix). **Modal é exceção:** fica centralizado.
- **Porcentagem em `translate()`** é relativa ao próprio elemento: `translateY(100%)` move a altura dele.
- **Nunca `transition: all`.** Liste as propriedades.
- **Nunca** mova o transform de um filho por variável CSS no pai: recalcula todos os filhos.
- **SVG:** transforme um `<g>` com `transform-box: fill-box; transform-origin: center`. *(Vercel WIG, MIT)*

### 5. Curva e duração (ou mola)

**Curva, por situação:** entrar/sair → ease-out · mover na tela → ease-in-out · hover/cor → `ease` · movimento constante (marquee, progresso, scroll ligado à rolagem) → `linear`. **Nunca `ease-in` em UI:** começa devagar justo quando o usuário está olhando.

As curvas nativas do CSS são fracas. Use estas *(Emil e Blode, MIT)*:

```css
:root {
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);      /* entrada/saída forte de UI */
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);  /* mover na tela */
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);   /* gaveta estilo iOS */
  --ease-expo: cubic-bezier(0.19, 1, 0.22, 1);     /* revelação dramática, marketing */
}
```

No Motion, a curva vira array: `ease: [0.23, 1, 0.32, 1]`. Nomes do Motion são camelCase (`easeOut`, `circOut`), nunca `ease-out`. **Se o projeto já tem tokens de curva e duração, use os dele.** Mais curvas: `references/molas-e-curvas.md`.

**Duração** *(Emil, Blode, Salaja, Lexicon, M3)*:

| Elemento | Duração |
|---|---|
| Resposta ao clique | 100–160 ms |
| Hover (cor/opacidade) / hover com transform | ~200 ms / 100–150 ms |
| Tooltip, popover pequeno | 125–200 ms |
| Dropdown, select | 150–250 ms |
| Modal, gaveta | 200–350 ms (gaveta estilo iOS até 500 ms com `--ease-drawer`) |
| Transição de página | 250–400 ms |
| Saída | ~20% mais curta e mais simples que a entrada |
| Intervalo do stagger | 30–80 ms por item, total abaixo de ~300 ms |
| Marketing, explicativo, vídeo promo | 500–1000 ms |

- **Feedback de interação ≤ 200 ms; UI de rotina ≤ 300 ms.** Um dropdown de 180 ms parece mais rápido que um de 400 ms.
- Escale com a distância: tooltip que anda 6 px fica abaixo de 150 ms; um painel de tela cheia pode passar de 300 ms.

**Use mola em vez de duração** quando há arrasto com impulso, gesto que pode ser interrompido ou revertido, algo que deve parecer "vivo", ou movimento seguindo o mouse. Forma oficial do Motion:

```js
{ type: "spring", visualDuration: 0.3, bounce: 0 }   // padrão: sem passar do ponto
```

- **Comece com `bounce: 0`** (amortecimento crítico). Ponha bounce (0,1–0,3) só quando o **gesto trouxe impulso**: passar do ponto num menu que só apareceu parece errado; num cartão que você arremessou, parece certo. *(Apple via Emil, MIT)*
- Se o elemento "merece" bounce, ele vai na **abertura**; o fechamento fica amortecido. *(Blode, MIT)*
- Opacidade e cor não usam física de mola: use `visualDuration` + `bounce` previsíveis ou uma curva.
- Peso do produto: app de banco ou painel não passa do ponto; app lúdico ou infantil pode.

### 6. Interrupção e saída

- **Transição, não keyframes,** em tudo que dispara rápido (toast, toggle): a transição recalcula a partir do valor atual; keyframes recomeçam do zero.
- **Mola em gestos:** carrega a velocidade na interrupção.
- **Sai pelo mesmo caminho por onde entrou.** Toast que sobe de baixo sai por baixo.
- **Tempo assimétrico:** a fase em que o usuário decide é lenta (segurar para confirmar: 2 s `linear`); a resposta do sistema é rápida (soltar: 200 ms ease-out).
- Em UI de alta frequência (hover, popover, toggle de painel): entra na hora (0 ms) e sai com um fade breve (100–150 ms). *(Blode, MIT)*
- **Pares andam juntos:** modal e fundo, tooltip e seta usam a mesma curva e duração. Se abrir anima, fechar anima.

### 7. Acessibilidade (vai junto com a animação, nunca depois)

- **Reduced motion = menos e mais suave, não zero.** Mantenha opacidade e cor que ajudam a entender; tire deslocamento, escala, parallax, autoplay. Nada de reset global `* { animation-duration: 0.01ms }`.
- **No Motion, a media query CSS não basta:** animações em JS a ignoram. Envolva o app em `<MotionConfig reducedMotion="user">` (desliga transform e layout, mantém opacidade e cor) ou use `useReducedMotion()` para trocar `x` por `opacity`. *(Blode, MIT; doc do Motion)*
- **Hover só com ponteiro fino:** `@media (hover: hover) and (pointer: fine)`, porque o toque dispara hover falso. O Tailwind v4 já faz isso no `hover:`.
- Loops decorativos pausam fora da tela (`IntersectionObserver` / `useInView`) e em reduced motion (`animation-play-state: paused`). Autoplay de mais de 5 s precisa de pausar (WCAG 2.2.2).
- Considere também `prefers-reduced-transparency` e `prefers-contrast: more`. Evite fundos de tela inteira em movimento e oscilações lentas (~0,2 Hz).
- Foco de teclado e navegação repetida nunca esperam animação terminar.

```css
@media (prefers-reduced-motion: reduce) {
  .painel { transition: opacity 0.2s ease; transform: none; }
}
@media (hover: hover) and (pointer: fine) {
  .card:hover { transform: translateY(-2px); }
}
```

## Regras de composição do editor (obrigatórias)

O Daniel é editor de motion profissional. Estas 4 regras valem para **toda** animação, inclusive UI. Detalhe e código de vídeo: `skills/video/remotion-video/SKILL.md`, seção "Regras de composição do editor".

1. **Nada de texto sobre texto, nem logo sobre texto, nem durante o movimento.**
   - Troca de rótulo ou ícone no mesmo lugar: o velho sai antes de o novo ficar legível (`AnimatePresence mode="wait"`, lembrando que `wait` quase dobra o tempo; ou `popLayout` com saída curta e `blur(2px)` na costura).
   - Títulos que se cruzam no caminho: mola sem passar do ponto (`bounce: 0`).
2. **Nenhum recorte no meio da tela.**
   - Nada "nascendo" de uma máscara (`overflow: hidden`, `clip-path`, wipe) cuja borda fica no meio do quadro.
   - Recorte só quando a borda é **borda real**: do botão (segurar para confirmar), da barra de abas, do acordeão, da tela do celular.
   - Blur também corta: deixe espaço em volta do elemento; em SVG, `filterUnits="userSpaceOnUse"` com região maior que o elemento.
   - Por isso, o scroll reveal com `clip-path` das receitas só vale em página de marketing real, nunca em tela de vídeo.
3. **O elemento principal fica por cima do texto.** Ordem: fundo → textos e cartões → elemento principal (celular, modal, cartão em foco). Ele pode passar na frente de um texto, mas só depois que o texto foi lido.
4. **Tudo entra de um lugar que explique a entrada:** de fora do quadro (da borda), de trás do elemento principal, ou do **gatilho** que o abriu (a mesma ideia do `transform-origin` no gatilho). Nunca "brotar" do nada no meio da tela.

## Motion: o essencial (detalhe em `references/api-motion.md`)

- **Nunca importe de `framer-motion`.** React: `motion/react` (`"use client"`); server components: `import * as motion from "motion/react-client"`; JS puro: `motion`; Vue: `motion-v`. Os dois pacotes nunca ficam instalados juntos.
- **Prefira `transform`** (`animate={{ transform: "translateX(100px)" }}`): roda via WAAPI e não trava com a página ocupada. Use `x`, `y`, `scale` quando houver transforms que se compõem (ex.: `x` animado + `whileHover` com `scale`), MotionValues, arrasto ou transições diferentes por eixo.
- **Nunca leia um MotionValue no render.** Use `value.on("change", fn)`, nunca `onChange`. `useTransform(valor, [entrada], [saída])` é a forma preferida.
- **`AnimatePresence`:** o condicional fica **dentro** dele, cada filho tem `key` estável (nunca o índice).
- **`layout` / `layoutId`:** `borderRadius` em `style` inline e em px, nunca por className.
- **Não comece trabalho pesado no mesmo tick** que a animação: comece o movimento, deixe um quadro passar, depois faça o trabalho (ou use `onAnimationComplete`).
- Em quadro a quadro (`onUpdate`, `useTransform`, rAF): sem criar objetos, `for` em vez de `forEach`/`map`.
- `will-change` só durante o movimento e em poucos elementos (0–3 tranquilo; 10+ repense). Com CSS `animation` ou Motion via `transform`, não precisa.
- Antes de qualquer animação não trivial (arrasto, scroll, layout, carrossel), **busque na documentação oficial** (`references/codex-mcp.md`) e construa a partir do resultado.

## Vídeo (Remotion)

Motion, CSS transitions e classes `animate-*` do Tailwind **não renderizam certo dentro do Remotion**. Lá, use `useCurrentFrame()` + `interpolate()` com `Easing.bezier(0.23, 1, 0.32, 1)` ou o `spring()` do Remotion (`{ stiffness, damping, mass }`). Desta skill, leve a **direção**: curvas, durações (ms → quadros: `ms / 1000 * fps`; 250 ms a 30 fps ≈ 8 quadros), molas e coreografia. Detalhe em `references/coreografia.md`. *(ideia das skills do Remotion, reescrita)*

## Nunca entregar (checagem final)

| Nunca | Em vez disso |
|---|---|
| Animação em atalho de teclado ou ação 100+/dia | Sem animação |
| `transition: all` | Liste as propriedades |
| Entrada com `scale(0)` | `scale(0.95)` + `opacity: 0` |
| `ease-in` em UI, ou ease-out nativo numa animação caprichada | `--ease-out` forte |
| UI com mais de 300 ms sem motivo | 150–250 ms |
| `transform-origin: center` em popover preso ao gatilho | `var(--transform-origin)` (modal é exceção) |
| Keyframes em toast, toggle, coisa que dispara rápido | CSS transition ou mola |
| Animar `width`/`height`/`margin`/`top`/`left` | `transform` / `opacity` |
| `:hover` com movimento sem trava | `@media (hover: hover) and (pointer: fine)` |
| Sem `prefers-reduced-motion` (ou só em CSS com Motion) | Variante mais suave + `MotionConfig reducedMotion="user"` |
| Tudo entrando de uma vez, ou stagger em toda lista | Um momento com stagger de 30–80 ms |
| Bounce em dropdown, toggle, modal | `bounce: 0` |
| Pulso/brilho em loop, blur em toda entrada, `hover:scale-105` em tudo | Contenção: é a marca de "movimento feito por IA" |
| Texto sobre texto, recorte no meio, texto brotando do nada | As 4 regras do editor |
| Import de `framer-motion` | `motion/react` |

*(tabela adaptada de Emil Kowalski "Never Ship", MIT, e Kyle Zantos anti-checklist, MIT, mais as regras do Daniel)*

## Como responder

Escreva o código. Depois, em poucas linhas:
- **Portão:** nível de frequência e propósito. Se algo do pedido foi recusado, diga o quê e por quê.
- **Ingredientes:** ferramenta, propriedades, curva, duração ou mola, uma linha cada.
- **O que conferir no olho:** se a sensação não dá para julgar pelo código (crossfade, bounce de mola), diga e indique como: rodar a 2–5× a duração ou no painel Animations do DevTools, quadro a quadro, testar gesto no celular real, olhar de novo no dia seguinte.

Sem relatório longo. O código é a entrega.

## Partes pagas e servidores

- **Grátis, sem servidor:** tudo deste arquivo e de `references/` (exceto o que depende de MCP).
- **Servidor MCP `motion`** (grátis, `https://mcp.motion.dev`): busca na documentação e exemplos (`search-motion-docs`).
- **Motion+** (pago): código-fonte de exemplos e Motion UI, auditoria MotionScore, editor visual de transições. Quando pedirem, diga com clareza que é pago, mostre o link da demo pública, cite https://motion.dev/plus uma vez e **não reconstrua o código pago de memória**. Detalhes em `references/codex-mcp.md`.
- A revisão grátis desta skill (`references/revisao.md`) substitui o MotionScore na maior parte dos casos.
