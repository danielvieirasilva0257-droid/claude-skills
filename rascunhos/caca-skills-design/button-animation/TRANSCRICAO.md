# Transcrição: pesquisa para a skill `button-animation`

Data: 11/10/2026. Agente de transcrição. Registro consolidado das pesquisas:
- **A** (`pesquisa-A.md`, 22 278 bytes, pronta às 09:50): catálogo skills.sh, via `npx -y skills@1.7.2 find`.
- **B** (`pesquisa-B.md`, 22 393 bytes, pronta às 09:51): GitHub e web, fora do skills.sh.

Os dois arquivos ficaram prontos; nenhum faltou. Os clones estão em `scratchpad/hunter/downloads/`. Conferi nos clones as licenças (arquivos `LICENSE`), os commits e alguns números (molas e camadas do Material 3, valores da troca de ícone do Jakub, receita "Hold to confirm" do Emil, atraso do spinner da Vercel). Conteúdo baixado foi tratado só como dado.

## 1. Buscas feitas

- **A:** `button`, `micro interaction`, `ui animation`, `shadcn`, `tailwind components`, `interaction design`, `hover effects`, `loading states`, `ui polish`, `framer motion`, `animation`, `accessibility`.
- **B:** GitHub e listas "awesome" (ComposioHQ, travisvn, VoltAgent), que só serviram para descobrir o motion-lexicon.

## 2. Fontes e notas

| Fonte | Achada por | Licença (conferida) | Commit | Nota A | Nota B | Para que serve |
|---|---|---|---|---|---|---|
| emilkowalski/skills (emil-design-eng 340,6 mil instalações; review-animations 215 mil; apple-design; find-animation-opportunities; animate) | A e B | MIT (c) 2026 Emil Kowalski | e8a175d (02/10/2026) | 10 | 10 | A melhor: porteiro "deve animar?", durações, curvas, receitas, "nunca entregue" |
| jakubkrehel/skills (better-ui 34 mil, better-accessibility) | A | MIT (c) 2026 Jakub Krehel | c0588bb (10/10/2026) | 9 | — | Valores exatos em Tailwind e Motion, acessibilidade |
| magicuidesign/magicui | B | MIT (c) Magic UI | cdb348c | — | 9 | Shimmer, shine-border, ripple, rainbow |
| vercel-labs/web-interface-guidelines | B | MIT (c) 2025 Vercel Labs | 434b7f9 | — | 9 | Foco, alvos de toque, spinner com atraso e mínimo, nunca `transition: all` |
| kylezantos/design-motion-principles | A (não baixada) e B | MIT (c) 2026 Kyle Zantos | 4a9ca87 | — | 8 | Erros típicos de IA ao criar motion |
| AndroidX Material 3 tokens | B | Apache-2.0 | main | — | 8 | Opacidades de estado e molas |
| ibelick/motion-primitives | B | MIT (c) 2024 ibelick | 120f64f | — | 8 | Magnético, BorderTrail, TextMorph |
| codse/animata | B | MIT (c) Animata | 36674e4 | — | 7 | status-button, duolingo, swipe, shining |
| Ryan-yang125/motion-lexicon | B | código MIT; conteúdo CC BY 4.0 | 88f979a | — | 7 | Tempos de entrada/saída, alternativas reduzidas |
| wshobson/agents (interaction-design 15,5 mil) | A e B | MIT (c) 2024 Seth Hobson | 46891e7 | 6,5 | 6 | Botão de estados (a ideia; o código importa de `framer-motion`) |
| ibelick/ui-skills (fixing-motion-performance 24,6 mil, baseline-ui 22 mil) | A | MIT (c) 2026 Julien Thibeaut | d036a68 | 6 | — | Regras de desempenho |
| raunofreiberg/interfaces | B | **sem licença** | 81f523a (2023) | — | 6 | Ideias clássicas; só parafrasear |
| pbakaus/impeccable (animate 81,7 mil, delight, polish) | A | Apache-2.0 (pede NOTICE) | c63b8dd | 5 | — | Filosofia; só parafrasear |
| dylantarre/animation-principles (buttons-ctas) | B | MIT | 8359713 | — | 5 | Tempos e tremor; curvas conflitam com Emil |
| DavidHDev/react-bits | B | MIT + **Commons Clause** | 90b2750 | — | 5 | Não copiar |
| anthropics/skills frontend-design | B | Apache-2.0 | dbd4588 | — | 5 | Regra sobre motion "genérico de IA" |
| shadcn/ui Button | B | MIT | — | — | 5 | Padrão de foco |

Achadas por A e não baixadas: `framer-motion-animator` (patricio0312rev, autor pouco conhecido), `microinteractions` (wondelai), `web-design-guidelines` (vercel-labs, geral demais), `shadcn` (componentes, não animação).

## 3. Partes úteis, agrupadas por tema

### 3.1 Decidir se anima (A 3.1, B 2.1; Emil)
Tabela de frequência (100+/dia: nada; dezenas: quase nada; ocasional: padrão; raro: encanto). Ação de teclado não anima. Propósito numa palavra.

### 3.2 Durações e curvas (A 3.2–3.3, B 2.2; Emil, ibelick, motion-lexicon)
Toque 100–160 ms; tooltip 125–200; dropdown 150–250; modal 200–500; UI < 300 ms; ibelick: feedback ≤ 200 ms. Tokens `--ease-out (0.23,1,0.32,1)`, `--ease-in-out (0.77,0,0.175,1)`, `--ease-drawer (0.32,0.72,0,1)`. Nunca `ease-in`. Saída mais rápida que a entrada (240/150/150 ms, motion-lexicon). Alternativas: `(0.2,0,0,1)` Jakub; `(0.16,1,0.3,1)` Impeccable.

### 3.3 Molas (A 3.18, B 2.13)
Padrão `bounce: 0`, 0,3–0,4 s (apple-design, Jakub). Material 3 convertido para o `damping` do Motion: Standard 1400/67, 700/48; Expressive 800/34, 380/31, 200/23; Effects 1600/80. (Conferi: os números batem com `ζ·2√k`. Acrescentei Standard slowSpatial 300/31, que está no arquivo.)

### 3.4 Toque e hover (A 3.4–3.6, B 2.3, 2.16)
Escala 0,96–0,97; `enabled:active:`; prop `static`; abaixo de 0,96 é defeito. Hover só com `(hover: hover) and (pointer: fine)`; Tailwind 4 já faz isso. `-webkit-tap-highlight-color: transparent`, `touch-action: manipulation`. Nunca `transition: all` (**a nossa receita 1 usava**: as duas pesquisas apontaram).

### 3.5 Estados do botão (A 3.8, B 2.4, 2.11, 2.12)
Repouso, carregando, sucesso, erro. Largura fixa; rótulo com reticências; spinner com atraso 150–300 ms e mínimo 300–500 ms (Vercel); bloquear duplo envio; `aria-busy` + `aria-live`; pista estática além do movimento (Jakub). Tremor de erro 3–5 px, 2–3 ciclos, 160–200 ms, uma vez. Camadas do Material 3: hover 0,08, foco 0,10, pressionado 0,10, arrastando 0,16; desativado 0,38/0,12.

### 3.6 Troca de ícone (A 3.9, B 2.4)
Jakub: `opacity 0, scale 0.25, blur(4px)` → normal, mola 0,3 s sem quique, `AnimatePresence initial={false} mode="popLayout"`. Para o rótulo inteiro, B propõe escala 0,8.

### 3.7 Receitas novas
- Segurar para confirmar (A 3.10, B 2.10; Emil): `clip-path` 2 s linear ao segurar, 200 ms ao soltar.
- Popover a partir do gatilho (A 3.7; Emil): `transform-origin` do gatilho; modal no centro.
- Tooltip instantâneo depois do primeiro (A 3.18; Emil).
- Shimmer (B 2.5; Magic UI), shine-border (B 2.6), BorderTrail (B 2.7), magnético (B 2.8), ripple (B 2.9), botão 3D Duolingo (B 2.14), troca de texto e TextMorph (B 2.15).
- Desfoque disfarçando crossfade (A 3.11): blur ≤ 8 px (ibelick) ou < 20 px (Emil).

### 3.8 Acessibilidade (A 3.12–3.15, B 2.16)
Movimento reduzido = menos, não zero (tabela desligar/trocar/manter). Armadilha: `MotionConfig reducedMotion="user"` não desliga blur. Área de toque 24/44/48 px com `::after`. `outline-offset: 2px`; `forced-colors` apaga sombras. Desligar transições ao trocar tema. Botão desativado sem tooltip. Loop > 5 s com pausa.

### 3.9 Desempenho (A 3.17, B 2.17)
Não animar variável herdada (o nosso `--ring-a` é `inherits: false`: ok). Pausar loops fora da tela. Abreviações `x`/`scale` não são aceleradas. CSS fica liso sob carga; rAF do Motion perde quadros. Escrever em `ref.style`, não em state. Depurar a 2–5× mais lento.

### 3.10 Erros típicos de IA (B 2.18)
Loops chamativos, `scale(0)`, duração única, ignorar o ritmo do projeto, aplicar o estilo de um designer a tudo, hover em todo card.

## 4. Conflitos e como resolvi

| Conflito | Decisão |
|---|---|
| `transition-all` na nossa receita 1 vs Emil/Jakub/Vercel | Corrigido para `transition-[background-color,scale]` |
| `bounce: 0.2` no nosso `whileTap` vs Jakub (`bounce: 0`) | Padrão `bounce: 0`; 0,2 só em app lúdico |
| Emil "comece de 0,9+" vs Jakub "ícone de 0,25" | 0,25 vale para ícone pequeno com blur (exceção registrada) |
| ibelick "sem curvas customizadas" vs Emil | Seguimos Emil |
| dylantarre `ease-in` e curva antiga do Material vs Emil | Seguimos Emil; do dylantarre só os tempos do tremor |
| Emil `duration` nas molas vs Motion 14 `visualDuration` | `visualDuration` na nossa prosa; o snippet do Jakub ficou literal |
| Shimmer, rainbow, anel: loops | Só landing page e vídeo; com `motion-safe:` |
| Gradientes/anéis vistos como muleta (ibelick, Impeccable) | Ficam como efeito intencional de foco/CTA |

## 5. O que não foi aproveitado e por quê

- React Bits: Commons Clause.
- Rauno: sem licença (só ideias, parafraseadas).
- Impeccable e Anthropic `frontend-design`: Apache-2.0; só ideias, para não precisar do NOTICE.
- Código do wshobson: `framer-motion`, `scale: 0`, sem movimento reduzido.
- Instalar `review-animations` e `animation-vocabulary` do Emil como skills próprias: sugestão das duas pesquisas, fica para o Daniel decidir.

## 6. Observação sobre o bug do `compose.tsx`

O `APRENDIZADOS.md` registra o `{"\n"}` que tinha virado quebra de linha real (linha ~369). Na `main` atual ele **já está corrigido** (adendo "atualização aplicada" de 09/10/2026). Confirmei: a linha 369 tem `{"\n"}` válido, e o arquivo copiado para `nova/assets/compose.tsx` passa no `tsc --strict` com `motion@14.0.0`, React 18.3.1 e TypeScript 5, junto com `compose-demo.tsx`, `status-button.tsx` e `hold-to-confirm.tsx`.
