# Origem das partes da skill `button-animation` (versão de 11/10/2026)

Esta skill é **nossa**, escrita em português. A versão de 11/10/2026 junta a nossa base com partes de skills e bibliotecas abertas. Textos literais só foram copiados de fontes MIT, Apache-2.0 ou CC BY. Fontes sem licença ou com restrição só foram parafraseadas (ideias, não texto) ou ficaram de fora.

Datas de download: 11/10/2026 (pesquisas A e B do caçador de skills). Os clones ficaram no scratchpad da sessão e não entram no repositório.

## Base nossa

| Parte | Origem |
|---|---|
| Receitas do `Compose` (anel de gradiente com `@property`, popover com mola, destaque deslizante, anel de progresso, pop, barra de rolagem) e `assets/compose.tsx` / `compose-demo.tsx` | Prompt de integração de componente salvo em `original/GRADIENT-BUTTON.txt` (sem autor ou licença declarados; adaptado por nós para `motion/react` e com o bug do `{"\n"}` corrigido) |
| Motion 14: instalação, imports, recursos novos, boas práticas | Skill oficial `/motion` (pacote `motion-ai` 14.1.0, MIT, Matt Perry; github.com/motiondivision/ai-kit), já em `skills/design/motion-oficial/` |
| Conversões para o Remotion e as 4 regras do editor | Nossas (vídeo Rotina v2; `skills/video/remotion-video/SKILL.md`) |
| `assets/status-button.tsx`, `assets/hold-to-confirm.tsx` | Escritos por nós em 11/10/2026 a partir das ideias abaixo; testados no TypeScript estrito com `motion@14.0.0`, React 18.3.1 e TypeScript 5 |

## Fontes externas aproveitadas

| Fonte | Link | Licença | Commit / data | O que foi aproveitado | Texto literal? |
|---|---|---|---|---|---|
| Emil Kowalski, skills (`emil-design-eng`, `animate/RECIPES.md`, `review-animations/STANDARDS.md`, `apple-design`, `performance-cheatsheet.md`) | https://github.com/emilkowalski/skills | MIT (c) 2026 Emil Kowalski | `e8a175d`, 02/10/2026 | Porteiro de frequência e propósito; tabela de durações; tokens de curva `--ease-out/--ease-in-out/--ease-drawer`; nunca `ease-in`, `transition: all` ou `scale(0)`; popover a partir do gatilho; segurar para confirmar (CSS); tooltip instantâneo; responder no pressionar; desempenho (CSS sob carga, variável herdada, `ref.style`); formato Antes/Depois/Por quê | Sim (CSS do "Hold to confirm", tokens, frases curtas) |
| Jakub Krehel, skills (`better-ui/animations.md`, `icon-transitions.md`; `better-accessibility/hit-areas.md`, `motion-and-zoom.md`, `focus-and-keyboard.md`) | https://github.com/jakubkrehel/skills | MIT (c) 2026 Jakub Krehel | `c0588bb`, 10/10/2026 | `enabled:active:scale-[0.96]`; prop `static`; hover só com ponteiro fino; tap-highlight; troca de ícone (0,25 + blur 4 px, mola 0,3 s sem quique); tabela de movimento reduzido e armadilha do blur no `MotionConfig`; área de toque com `::after`; `outline-offset`; `forced-colors`; desligar transições ao trocar tema; "movimento nunca é o único sinal" | Sim (snippet da troca de ícone, snippet da área de toque) |
| Vercel Web Interface Guidelines | https://github.com/vercel-labs/web-interface-guidelines | MIT (c) 2025 Vercel Labs | `434b7f9`, 05/10/2026 | Spinner com atraso 150–300 ms e mínimo 300–500 ms; rótulo com reticências; alvos de toque; `touch-action: manipulation`; interação aumenta contraste; `aria-label` em botão de ícone; `translateZ(0)` para texto escalado | Não (parafraseado) |
| Magic UI (`shimmer-button`, `shine-border`, `ripple-button`, `rainbow-button`) | https://github.com/magicuidesign/magicui | MIT (c) Magic UI | `cdb348c`, 05/10/2026 | Keyframes do shimmer e valores (`--spread`, `--speed`, `--cut`, sombras internas); borda com `mask-composite: exclude`; cálculo do ripple | Sim (keyframes e trechos de CSS) |
| Motion Primitives (`BorderTrail`, `Magnetic`, `TextMorph`) | https://github.com/ibelick/motion-primitives | MIT (c) 2024 ibelick | `120f64f`, 28/09/2026 | Cometa na borda com `offset-path`; números do magnético; mola do TextMorph | Sim (JSX do BorderTrail, constante da mola) |
| Animata (`status-button`, `duolingo`, `swipe-button`, `shining-button`) | https://github.com/codse/animata | MIT (c) Animata | `36674e4`, 14/09/2026 | Ideia do botão de estados; botão 3D que afunda; troca de texto deslizando; faixa de brilho no hover | Não (reescrito) |
| Material 3 / AndroidX (`StateTokens.kt`, `StandardMotionTokens.kt`, `ExpressiveMotionTokens.kt`) | https://github.com/androidx/androidx (compose/material3/.../tokens) | Apache-2.0 | branch `main`, baixado em 11/10/2026 | Opacidades da camada de estado (0,08/0,10/0,10/0,16) e molas, convertidas para `damping` do Motion (ζ·2√k) | Só números (fatos), conferidos nos arquivos |
| design-motion-principles (`creation-gotchas.md`) | https://github.com/kylezantos/design-motion-principles | MIT (c) 2026 Kyle Zantos | `4a9ca87`, 30/05/2026 | Erros típicos de IA: loops chamativos, `scale(0)`, duração única, respeitar o ritmo do projeto, estilo do designer conforme o produto | Não (parafraseado) |
| motion-lexicon | https://github.com/Ryan-yang125/motion-lexicon | código MIT; conteúdo CC BY 4.0 | `88f979a`, 19/08/2026 | Tempos de entrada/saída/feedback (240/150/150 ms); geometria estável do controle; tremor de erro | Não. Atribuição: "Based on Motion Lexicon content, licensed under CC BY 4.0" (adaptado) |
| ibelick, ui-skills (`fixing-motion-performance`, `baseline-ui`) | https://github.com/ibelick/ui-skills | MIT (c) 2026 Julien Thibeaut | `d036a68`, 11/10/2026 | Blur ≤ 8 px e sem loop; não animar variável herdada; pausar loops fora da tela; feedback ≤ 200 ms | Não |
| wshobson/agents (`interaction-design`, `microinteraction-patterns.md`) | https://github.com/wshobson/agents | MIT (c) 2024 Seth Hobson | `46891e7`, 04/10/2026 | Ideia do botão carregando/sucesso/erro e do tremor | Não (o código importa de `framer-motion` e entra de `scale: 0`) |
| dylantarre, animation-principles (`buttons-ctas`) | https://github.com/dylantarre/animation-principles | MIT | `8359713`, 30/12/2025 | Só os tempos do tremor de erro | Não (curvas dele conflitam com Emil e foram descartadas) |
| shadcn/ui Button | https://ui.shadcn.com | MIT | 2026 | Padrão de foco `focus-visible:ring-[3px] ring-ring/50` | Sim (classes) |
| Impeccable (`animate.md`, `harden.md`) | https://github.com/pbakaus/impeccable | Apache-2.0 | `c63b8dd`, 11/10/2026 | Ideias: "movimento reduzido é menos, não zero"; evitar duplo envio | **Não** (só parafraseado, para dispensar o NOTICE) |
| Anthropic `frontend-design` | https://github.com/anthropics/skills | Apache-2.0 | `dbd4588`, 09/10/2026 | Ideia: hover em todo card e fade-up em toda seção parecem gerados por IA | Não (parafraseado) |
| Rauno Freiberg, interfaces | https://github.com/raunofreiberg/interfaces | **sem licença** | `81f523a`, 06/06/2023 | Ideias: escala proporcional ao gatilho; botão desativado sem tooltip; desligar transição ao trocar tema | **Não** (só ideias) |

## O que ficou de fora

- **React Bits** (github.com/DavidHDev/react-bits): MIT + **Commons Clause** (não pode revender o código); o StarBorder virou canvas pesado. Nada copiado.
- **Código do wshobson:** importa de `framer-motion`, entra de `scale: 0`, sem movimento reduzido.
- **Conselhos do dylantarre** de usar `ease-in` no hover-out e `cubic-bezier(0.4,0,0.2,1)`: conflitam com Emil.
- **Regra do ibelick** "nunca curvas customizadas": conflita com Emil (ficamos com Emil).
- **Skills inteiras** que mereciam entrar na base por conta própria (sugestão, não feito): `emilkowalski/skills@review-animations` e `@animation-vocabulary`.
- **Pulsating/rainbow da Magic UI como receita própria:** são loops chamativos; ficaram só como menção.

## Como atualizar

```bash
git clone --depth 1 https://github.com/emilkowalski/skills /tmp/emil && git -C /tmp/emil log -1 --format='%h %cs'
git clone --depth 1 https://github.com/jakubkrehel/skills /tmp/jakub && git -C /tmp/jakub log -1 --format='%h %cs'
git clone --depth 1 https://github.com/magicuidesign/magicui /tmp/magicui
```

Compare com os commits da tabela; se houver novidade útil, registre no `APRENDIZADOS.md` e proponha a mudança ao Daniel antes de mexer no `SKILL.md`.
