# Pesquisa A: skills de UI/UX para a nova `ui-ux-pro-max`

Agente de pesquisa A, 11/10/2026. Objetivo: achar no catálogo público (skills.sh, via `npx -y skills@1.7.2 find`) as melhores skills de design de interface e extrair as partes que valem ser "costuradas" numa versão nova da nossa `skills/design/ui-ux-pro-max`. O foco é o que o Daniel prioriza: visual premium (Apple, Samsung), minimalista e sites com animação, em React/Next.js/Tailwind/Motion 14.

Regras seguidas: nada foi instalado (só `find` e um `--list`), nenhum script baixado foi executado, nada mudou em `/home/user/claude-skills-main`, e styles.refero.design não foi acessado. O conteúdo baixado foi tratado como dado.

Cópias baixadas (uma pasta nova para cada, `git clone --depth 1`) em `scratchpad/hunter/downloads/`:

| Pasta | Repositório | Commit |
|---|---|---|
| `anthropics-skills-A2` | anthropics/skills | `dbd4588`, 09/10/2026 |
| `ui-ux-pro-max-A2` | nextlevelbuilder/ui-ux-pro-max-skill | `67803ea`, 11/10/2026 |
| `taste-skill-A2` | leonxlnx/taste-skill | `717446e`, 09/10/2026 |
| `impeccable-A2` | pbakaus/impeccable | `c63b8dd`, 11/10/2026 |
| `vercel-agent-skills-A2` | vercel-labs/agent-skills | `063bee9`, 28/08/2026 |
| `web-interface-guidelines-A2` | vercel-labs/web-interface-guidelines | `434b7f9`, 05/10/2026 (onde ficam as regras de fato) |
| `emilkowalski-skills-A2` | emilkowalski/skills | `e8a175d`, 02/10/2026 |

---

## 1. O que a busca encontrou

Termos usados: "ui ux", "frontend design", "design system", "landing page", "web design", "typography", "color palette", "premium design", "minimal design", "ui-ux-pro-max" e "refero". Os números são as instalações em 11/10/2026.

**As mais instaladas e relevantes**

| Skill | Instalações | Observação |
|---|---|---|
| anthropics/skills@frontend-design | 972,7 mil | oficial da Anthropic |
| vercel-labs/agent-skills@web-design-guidelines | 720,9 mil | revisão de interface; puxa as regras de outro repositório |
| leonxlnx/taste-skill@design-taste-frontend | 589,5 mil | a skill "anti-slop", contra o visual genérico de IA |
| uizze.sh@ui-taste | 517,2 mil | **a fonte não é do GitHub.** O comando `add uizze.sh --list` falhou com "repository 'uizze.sh' does not exist", então não deu para verificar |
| leonxlnx/taste-skill@high-end-visual-design | 427,6 mil | estilo de agência premium |
| leonxlnx/taste-skill@redesign-existing-projects | 425,4 mil | auditoria e redesign |
| leonxlnx/taste-skill@minimalist-ui | 394,5 mil | minimalismo editorial |
| nextlevelbuilder/ui-ux-pro-max-skill@ui-ux-pro-max | 390,7 mil | o projeto para o qual a nossa skill aponta hoje |
| shadcn-ui/ui@shadcn | 370,4 mil | biblioteca de componentes; fora do foco |
| pbakaus/impeccable@impeccable | 324,4 mil | também `@colorize` (80,9 mil) e `@typeset` (64,7 mil) |
| uizze.sh@ios-design | 277,3 mil | mesma fonte não verificável |
| emilkowalski/skills@apple-design | 201 mil | também `@animation-vocabulary` (201,5 mil) |
| arvindrk/extract-design-system | 130 mil | extrai um design system de um site |
| anthropics/skills@theme-factory | 90,5 mil | fraco: 10 temas prontos com DejaVu Sans |
| wshobson/agents@tailwind-design-system | 68 mil | tokens no Tailwind |
| google-labs-code/stitch-skills@design-md | 63,4 mil | formato DESIGN.md (Google Stitch) |

**Nichos com poucas instalações (menos de 30 mil)**

- jakubkrehel/skills@better-colors: 28,5 mil.
- jakubkrehel/oklch-skill: 4,3 mil.
- devmartinese/awwwards-animations: 2,7 mil.
- bergside/awesome-design-skills (@premium, @minimal, @refined e outras): cerca de 2 mil cada.
- kv0906/cc-skills@premium-frontend-design: 1,4 mil.
- ericzakariasson/scandinavian-design: 1,6 mil.
- Cópias da ui-ux-pro-max por outros autores (kimny1143, sickn33, davila7 e outros): de 1,2 mil a 4,7 mil. São repostagens; vale a original.

**"refero"**: a busca não trouxe nenhuma skill ligada ao Refero, só resultados sem relação (prisma, ai-video…).

**Lacuna**: nenhuma skill cobre a linguagem visual da **Samsung (One UI)**. A Apple está bem coberta pela `apple-design` e pelo apêndice de Liquid Glass da taste-skill.

---

## 2. Tabela das candidatas avaliadas (lidas por inteiro)

| # | Skill (nome no catálogo) | Repositório | Instalações | Licença | Link | Nota |
|---|---|---|---|---|---|---|
| 1 | frontend-design | anthropics/skills | 972,7 mil | **Apache 2.0** (arquivo `LICENSE.txt` na pasta da skill) | https://skills.sh/anthropics/skills/frontend-design | **9** |
| 2 | design-taste-frontend, high-end-visual-design, minimalist-ui e redesign-existing-projects | leonxlnx/taste-skill | 589,5 mil, 427,6 mil, 394,5 mil e 425,4 mil | **MIT** (© 2026 Leonxlnx) | https://skills.sh/leonxlnx/taste-skill/design-taste-frontend | **9** |
| 3 | apple-design, mais emil-design-eng e pick-ui-library | emilkowalski/skills | 201 mil | **MIT** (© 2026 Emil Kowalski) | https://skills.sh/emilkowalski/skills/apple-design | **9** |
| 4 | web-design-guidelines (regras em `command.md`) | vercel-labs/agent-skills e vercel-labs/web-interface-guidelines | 720,9 mil | **MIT** (© 2025 Vercel Labs; o agent-skills declara MIT no README, sem arquivo próprio) | https://skills.sh/vercel-labs/agent-skills/web-design-guidelines | **8** |
| 5 | impeccable | pbakaus/impeccable | 324,4 mil | **Apache 2.0**, com `NOTICE.md` (ios.md e android.md derivam de ehmo/platform-design-skills, MIT) | https://skills.sh/pbakaus/impeccable/impeccable | **7** |
| 6 | ui-ux-pro-max | nextlevelbuilder/ui-ux-pro-max-skill | 390,7 mil | **MIT** (© 2024 Next Level Builder). Os dados de fontes trazem a licença de cada família | https://skills.sh/nextlevelbuilder/ui-ux-pro-max-skill/ui-ux-pro-max | **7** |

Por que cada uma recebeu essa nota:

1. **frontend-design (Anthropic), nota 9.** É curta (cerca de 1.500 palavras) e tem o melhor **processo**: planejar os tokens, revisar o plano contra o briefing, construir e criticar com screenshot. Traz também a melhor **calibração das "caras de IA"**, com valores hex. Não traz tabelas de números nem receitas de código.
2. **taste-skill, nota 9.** É a mais concreta contra o visual genérico. Tem três controles de 1 a 10 (variação, movimento e densidade) com presets, regras rígidas de hero, navegação, bento e eyebrow, paletas banidas com hex e arquétipos premium prontos em Tailwind. Contra ela: é longa (12,8 mil palavras na principal), dogmática e em alguns pontos se contradiz entre as sub-skills (ver a seção 4).
3. **apple-design (Emil Kowalski), nota 9.** É exatamente o "premium Apple" que o Daniel quer: molas com amortecimento e resposta, projeção de momento, elástico nas bordas, materiais translúcidos, tipografia por tamanho, os 8 princípios da Apple e o modo de movimento reduzido. O autor é muito conhecido (criou Sonner e Vaul).
4. **Web Interface Guidelines (Vercel), nota 8.** É o melhor checklist técnico de revisão, com regras curtas que se verificam no código e saída no formato `arquivo:linha`. Não ajuda na estética.
5. **impeccable, nota 7.** As ideias são ótimas: quatro modos de visita, quatro estratégias de cor, o "piso de qualidade" e as superfícies do navegador. O problema é que tudo depende de um **binário próprio** (`scripts/impeccable`), que "é baixado na primeira execução", além de vários arquivos de contexto. Pesado demais para copiar; vale extrair as ideias. A licença Apache exige manter o NOTICE e dizer o que mudou.
6. **ui-ux-pro-max (nextlevelbuilder), nota 7.** Tem o maior **banco de dados**: 88 estilos, 192 paletas, 74 pares de fontes, 1.934 Google Fonts, 119 regras de UX e 22 stacks, com um script Python de busca. O checklist de UX é bom. Mas as **fontes que ela recomenda batem de frente com as regras anti-IA**: Inter, Playfair, DM Sans e Space Grotesk são justamente as que a impeccable e a taste chamam de "padrão de quem parou de procurar". O pacote é pesado (cerca de 2,5 MB de dados mais scripts).

---

## 3. Partes a aproveitar (trechos curtos e origem)

### 3.1 Fluxo de trabalho de design

- **Ler o briefing e escrever uma linha de "Design Read"** antes de qualquer código (taste-skill, §0.B):
  > "Reading this as: \<page kind> for \<audience>, with a \<vibe> language, leaning toward \<design system or aesthetic family>."

  Se o briefing for ambíguo, a regra é fazer **uma única pergunta**; se der para deduzir, não perguntar (§0.C).
- **Plano de tokens em duas passadas** (Anthropic): primeiro um plano compacto com cor ("4–6 named hex values"), tipo (as famílias e seus papéis), layout (frase mais wireframe ASCII e o alinhamento) e princípios. Depois vem a revisão do plano contra o briefing:
  > "if any part of it reads like the generic default you would produce for any similar page … revise that part, say what you changed and why."

  Só então se escreve o código.
- **Contenção e autocrítica** (Anthropic):
  > "Spend your boldness in one place."

  Fazer screenshot e revisar, e "remove one accessory" (o conselho da Chanel).
- **Verificar em rodadas limitadas, sem loop infinito** (impeccable): uma rodada de screenshots com desktop e celular juntos, corrigir tudo de uma vez, confirmar no máximo mais uma vez e parar.
- **Modos de visita** (impeccable) definem o que significa sucesso em cada tela:
  - **Persuadir:** landing, preços.
  - **Operar:** app, dashboard.
  - **Ler:** docs, artigos.
  - **Experiência:** portfólio, galeria.

  Uma landing de ferramenta continua sendo Persuadir.
- **Contrato de direção** (impeccable, new-work §5): seis blocos curtos, cerca de 150 palavras, que registram a direção antes do código. Os blocos são THESIS (a ideia da tela e o padrão que ela recusa), OWN-WORLD (paleta e linguagem de componentes reconhecíveis mesmo sem conteúdo), STORY, FIRST VIEWPORT (o que fica onde e em que escala), FORM e FINISH. É uma boa base para uma "ficha de direção" nossa.
- **Persistir o design system** (nextlevelbuilder): `design-system/<projeto>/MASTER.md` como fonte da verdade, com `pages/<pagina>.md` sobrepondo o MASTER. Antes de regerar, ler o que existe e nunca sobrescrever sem autorização.
- **Formato de revisão** (Emil, emil-design-eng): uma tabela "Antes | Depois | Por quê". A Vercel usa `arquivo:linha - problema`.

### 3.2 Como escolher o estilo

- **Três controles com presets** (taste-skill §1.A e §1.B): `DESIGN_VARIANCE`, `MOTION_INTENSITY` e `VISUAL_DENSITY`, de 1 a 10.

  | Briefing | Variação | Movimento | Densidade |
  |---|---|---|---|
  | "minimalist / calm / Linear-style" | 5–6 | 3–4 | 2–3 |
  | "premium consumer / Apple-y / luxury" | 7–8 | 5–7 | 3–4 |
  | "trust-first / regulated" | 3–4 | 2–3 | 4–5 |

  A nextlevelbuilder tem os mesmos três controles no script (`--variance`, `--motion` e `--density`). Densidade baixa dá uma escala de espaço de 24–96px; densidade alta, de 8–32px.
- **Arquétipos premium prontos** (high-end-visual-design §3), cada um com tokens:
  - **"Ethereal Glass"** (SaaS, IA e tech): fundo `#050505`, gradientes em malha suaves, cartões com `backdrop-blur-2xl` e bordas finas `white/10`.
  - **"Editorial Luxury"**: tons quentes, serifa variável e grão a `opacity-[0.03]`.
  - **"Soft Structuralism"**: branco ou prata, grotesca grande e sombras muito difusas.

  Os layouts dele são "Asymmetrical Bento", "Z-Axis Cascade" e "Editorial Split", **cada um com a regra de colapso no celular**.
- **Minimalismo editorial** (minimalist-ui): canvas `#FFFFFF`, `#F7F6F3` ou `#FBFBFA`; bordas `#EAEAEA` ou `rgba(0,0,0,.06)`; texto `#111111` ou `#2F3437` com leading 1.6; secundário `#787774`; cartões de 8–12px de raio; CTA sólido `#111` com raio de 4–6px e sem sombra. Os acentos são só pastéis apagados, cada um com sua cor de texto (por exemplo, `#E1F3FE` com `#1F6C9F`).
- **Estratégia de cor antes de escolher as cores** (impeccable, new-work §4):
  - **Restrained:** neutros mais um acento.
  - **Committed:** uma cor saturada ocupa 30–60% da superfície.
  - **Full palette:** 3 ou 4 papéis de cor.
  - **Drenched:** a superfície é a própria cor.

  Claro ou escuro **nunca é padrão**. A regra é escrever uma frase de cena física ("quem usa, onde, sob que luz") e deixar que ela decida.
- **Usar um design system oficial** quando o briefing é um sistema (Material, Fluent, Carbon, Radix, shadcn e outros), com os comandos de instalação (taste-skill §2 e Apêndice A).
- **Banco de estilos** (nextlevelbuilder, `styles.csv`): 88 estilos com cores, efeitos, quando usar e quando não usar, além de um checklist de implementação. Os relevantes para o Daniel são Minimalism & Swiss, Liquid Glass, Spatial UI (VisionOS), Motion-Driven, Bento Box Grid, Exaggerated Minimalism, Kinetic Typography, Modern Dark (Cinema Mobile) e SaaS Mobile (High-Tech Boutique). Vale extrair só essas linhas.

### 3.3 Tipografia (com números)

- **Tracking por tamanho, nunca um valor fixo** (apple-design §15): display negativo e corpo perto de 0.

  ```css
  .display { font-size: clamp(2rem, 5vw, 4rem); line-height: 1.05; letter-spacing: -0.02em; font-optical-sizing: auto; }
  ```

  A hierarquia vem de peso, tamanho e leading juntos. Espaços em `rem` respeitam o tamanho de texto escolhido pelo usuário. A fonte do sistema (`system-ui`, que no Apple é a SF) é o padrão legítimo para o visual Apple.
- **Limites** (impeccable, craft-floor): medida do corpo de 65–75ch, display de no máximo 6rem, tracking mínimo de -0.04em, mais espaço acima do título do que abaixo e corpo de 16px no mínimo. Texto claro sobre fundo escuro pede um pouco mais de leading, de tracking e de peso.
- **Padrões em Tailwind** (taste-skill §4.1): display `text-4xl md:text-6xl tracking-tighter leading-none` e corpo `text-base leading-relaxed max-w-[65ch]`. Hero: `text-4xl md:text-5xl lg:text-6xl`; `text-6xl md:text-7xl` só para títulos de 3 a 5 palavras.
- **Itálico com descendente** (taste-skill): com `leading-none`, letras como "y g j p q" ficam cortadas. Usar `leading-[1.1]` ou mais, com `pb-1`.
- **Fontes que denunciam o "padrão de IA"** (impeccable): Fraunces, Playfair Display, Cormorant, Lora, Crimson, Newsreader, Syne, Space Grotesk, Space Mono, IBM Plex, Inter como display, DM Sans, DM Serif, Outfit, Plus Jakarta Sans e Instrument Sans.
  - A taste-skill desencoraja Inter como padrão e sugere Geist, Satoshi, Cabinet Grotesk e PP Neue Montreal.
  - A Anthropic recomenda "uma ou duas famílias, e se forem duas, claramente distintas".
- **Detalhes de texto** (Vercel): `…` em vez de `...`, aspas curvas, `&nbsp;` em "10&nbsp;MB", `tabular-nums` em colunas de números e `text-wrap: balance` ou `pretty` nos títulos.

### 3.4 Cor (com números)

- **Um acento só, saturação abaixo de 80%** (taste-skill §4.2), com uma "trava de cor": o acento escolhido vale para a página inteira. Uma paleta por projeto, sem misturar cinzas quentes e frios.
- **OKLCH em paletas novas** (impeccable, colorize): nas rampas, reduzir o croma perto do branco e do preto. Preferir cores explícitas a camadas translúcidas, que deixam o contraste dependente do contexto.
- **Contraste**: corpo 4,5:1, texto grande 3:1, e controles, ícones e foco 3:1. O modo escuro usa variantes tonais próprias, não a inversão do claro (nextlevelbuilder, impeccable e Vercel).
- **Sombras**: com deslocamento e desfoque suave, tingidas com a cor do fundo. Nada de sombra preta pura. Um halo colorido sem deslocamento é decoração (impeccable e taste-skill).
- **Tokens em três camadas** (nextlevelbuilder, design-system): `--color-blue-600` (primitivo) → `--color-primary` (semântico) → `--button-bg` (componente). Os componentes nunca recebem hex direto.

### 3.5 Espaço e layout (com números)

- **Escala de 4/8 pontos**; breakpoints 375, 768, 1024 e 1440; `max-w-6xl` ou `7xl`; z-index em escala (0, 10, 20, 40, 100, 1000); `min-h-dvh` em vez de `100vh` (nextlevelbuilder, quick-reference §5).
- **Seções com espaço de sobra**: `py-24` a `py-40` no premium (high-end-visual-design) e `py-24`/`py-32` com conteúdo em `max-w-4xl`/`5xl` (minimalist-ui).
- **Regras de hero** (taste-skill §4.7):
  - O hero cabe na primeira tela.
  - Título de no máximo 2 linhas e subtítulo de **no máximo 20 palavras**.
  - Padding superior de no máximo `pt-24`.
  - No máximo 4 elementos de texto.
  - A faixa de logos de clientes vai para baixo do hero.
- **Navegação** em uma linha só, com 64–72px de altura (máximo de 80px).
- **Bento**: tantas células quanto houver conteúdo, sem célula vazia, e 2 ou 3 células com variação visual.
- **Repetição de layout**: cada família de layout aparece uma vez por página, e no máximo 2 zigue-zagues seguidos.
- **Trava de forma** (taste-skill §4.4): uma escala de raio só (tudo reto, tudo suave de 12–16px ou tudo pílula), ou uma regra escrita e seguida em todo lugar.
- **Bisel duplo** (high-end-visual-design §4.A): um invólucro externo `p-1.5`, `ring-1 ring-black/5`, `rounded-[2rem]`, e o núcleo interno com `rounded-[calc(2rem-0.375rem)]` e brilho `inset`. É o acabamento de "hardware usinado", com cara de Apple.

### 3.6 Movimento na web (complementa motion-oficial e button-animation)

- **Molas da Apple** (apple-design §4):

  | Uso | Amortecimento | Resposta |
  |---|---|---|
  | Mover | 1.0 | 0.4 s |
  | Rotação | 0.8 | 0.4 s |
  | Gaveta ou folha | 0.8 | 0.3 s |

  No Motion, o padrão é `{type:'spring', bounce:0, duration:0.4}`. Quique (bounce) só quando o gesto teve impulso.
- **Projeção de momento** (apple-design §6): `current + (v/1000)*d/(1-d)` com `d ≈ 0.998`.
- **Elástico nas bordas** (§9): `(o*dim*0.55)/(dim+0.55*|o|)`.
- **Interromper sempre a partir do valor atual na tela.**
- **Durações**:

  | Elemento | Duração (Emil) |
  |---|---|
  | Clique em botão | 100–160ms |
  | Tooltip | 125–200ms |
  | Dropdown | 150–250ms |
  | Modal ou gaveta | 200–500ms |

  A impeccable dá faixas parecidas: 100–150 feedback, 150–300 mudança de estado, 300–500 transição de tela e 500–800 a entrada de destaque. Elementos de UI ficam abaixo de 300ms, e a saída é mais rápida que a entrada.
- **Curvas** (Emil): `--ease-out: cubic-bezier(0.23,1,0.32,1)`, `--ease-in-out: cubic-bezier(0.77,0,0.175,1)` e `--ease-drawer: cubic-bezier(0.32,0.72,0,1)`. Nunca `ease-in` em UI e nunca começar em `scale(0)` (usar `0.95` com opacity 0).
- **Frequência decide se anima** (Emil): ação feita mais de 100 vezes por dia não anima nunca. Ação disparada pelo teclado também não.
- **Um momento orquestrado** (Anthropic e impeccable):
  > "fade-and-slide-up entrances on each section and hover transitions on every card are the generic default and read as AI-generated."

  Para "sites com animação", isso quer dizer: um momento forte no hero mais movimentos com motivo (hierarquia, narrativa, feedback ou estado), não o mesmo fade em tudo.
- **Rolagem** (taste-skill §5.D): `window.addEventListener('scroll')` é proibido. Usar `useScroll`, ScrollTrigger, IntersectionObserver ou `animation-timeline: view()`. Há esqueletos prontos de sticky-stack e horizontal-pan com GSAP (§5.A e §5.B). No máximo uma marquee por página.
- **Acessibilidade de movimento** (apple-design §14): respeitar `prefers-reduced-motion` (trocar por crossfade), `prefers-reduced-transparency` (vidro vira sólido) e `prefers-contrast: more`.
- **Materiais** (apple-design §12):

  ```css
  background: rgba(255,255,255,.6); backdrop-filter: blur(20px) saturate(180%); border-top: 1px solid rgba(255,255,255,.4);
  ```

  Nunca sobrepor duas camadas claras translúcidas. A borda de rolagem vira desfoque ou máscara, não uma linha de 1px. O vidro "materializa" animando o desfoque junto com a escala.
- **Desempenho** (high-end-visual-design §6): `backdrop-blur` só em elementos fixos ou sticky. Grão e ruído só em pseudo-elementos `fixed` com `pointer-events-none`.

### 3.7 Checklists de qualidade

- **Web Interface Guidelines (Vercel, `command.md`)**: cerca de 100 regras de uma linha, verificáveis no código. É o melhor candidato para o nosso "checklist de revisão". Exemplos:
  - nunca `transition: all`;
  - `outline-none` só com substituto em `focus-visible`;
  - `<img>` com `width` e `height`;
  - `color-scheme: dark` em temas escuros;
  - `<meta name="theme-color">`;
  - `overscroll-behavior: contain` em modais;
  - `touch-action: manipulation`;
  - `Intl.*` para datas e números;
  - nunca bloquear colar;
  - estado da tela refletido na URL.
- **Piso de qualidade** (impeccable, `craft-floor.md`): contraste, profundidade, espaço, tipo, movimento e estados (hover, desativado, carregando, erro, vazio). Há também o item **"superfícies do navegador"**:
  > "Text selection, the caret, custom scrollbars, focus rings, underline offset, and the numerals in tabular data all ship with browser defaults … Theme them from the palette."
- **Checklist final da high-end-visual-design (§8)** e o "pre-flight" da taste-skill (§14). Os dois são mecânicos, como contar eyebrows e conferir o colapso no celular.
- **Checklist de entrega da nextlevelbuilder** (`pro-rules.md`): testar em 375px e na horizontal, com movimento reduzido e Dynamic Type, revisar o contraste do modo escuro separadamente, alvos de toque de 44pt ou mais, sem emoji como ícone e uma família só de ícones.

### 3.8 Anti-padrões ("cara de IA genérica"), lista consolidada

- **Os cinco visuais típicos de IA** (Anthropic):
  1. Creme `#F4F1EA` com serifa e acento terracota `#D97757`.
  2. Quase preto com um acento verde-ácido ou vermelhão.
  3. Estilo jornal, com linhas finas e raio 0.
  4. O "kit de cartões SaaS": cartões iguais, um raio só, sombra `rgba(0,0,0,.1)` e gradientes.
  5. Eyebrow em CAIXA ALTA espaçada, "A · B · C", "WORD — fragment", `#0B0B0B` no lugar de preto, mono em rótulos e "→" nos botões.
- **Paleta premium banida** (taste-skill §4.2):
  - fundos `#f5f1ea`, `#fbf8f1`, `#efeae0`;
  - acentos latão, argila e oxblood (`#b08947`, `#b6553a`, `#9a2436`);
  - texto expresso `#1a1714`.

  No lugar, alternar entre: "Cold Luxury" (prata, cromo e fumaça), Forest, Black and Tan, Cobalt + Cream e monocromático com um acento forte.
- **Outras**:
  - roxo e azul com brilho de IA;
  - texto em gradiente;
  - vidro como decoração;
  - borda lateral colorida maior que 1px em cartões;
  - três cartões iguais lado a lado;
  - métrica gigante com rótulo pequeno (a Anthropic e a impeccable chamam de "hero-metric template");
  - números de seção 01/02/03 sem sequência real;
  - UI de produto falsa feita de `<div>`;
  - indicador de rolagem ("scroll cue");
  - pontinhos de status decorativos;
  - faixas de cidade, hora e clima;
  - rótulos de versão no hero;
  - cursor personalizado;
  - emoji como ícone;
  - nomes como "John Doe" e "Acme";
  - números perfeitos demais (99,99%);
  - verbos como "Elevate", "Seamless" e "Unleash";
  - CTA quebrando em duas linhas;
  - dois CTAs com a mesma intenção.
- **Travessão** (taste-skill §9.G): a taste proíbe `—` e `–` em qualquer texto visível. **Atenção ao pt-BR**: o travessão tem uso legítimo em português. Proponho adotar como "evitar como enfeite" e não como proibição total; o Daniel decide.

### 3.9 Texto da interface (Anthropic, "More on writing in design")

- Escrever do ponto de vista do usuário ("notificações", não "configuração de webhook"), em voz ativa e com CTA específico ("Salvar alterações", não "Enviar").
- A mesma palavra em todo o fluxo: botão "Publicar" gera aviso "Publicado".
- Erros explicam o que houve e como resolver, sem pedir desculpas. Uma tela vazia é um convite para agir.
- Isso conversa com as nossas skills `copywriting` e `humanizer`.

### 3.10 Bibliotecas recomendadas (Emil, pick-ui-library)

| Para quê | Biblioteca |
|---|---|
| Componentes base | base-ui |
| Menu ⌘K | cmdk |
| Avisos (toasts) | Sonner |
| Animação | Motion |
| Números animados | NumberFlow |
| Globo 3D | Cobe |
| Gráficos | recharts |
| Arrastar e soltar | dnd kit |
| Listas longas | Virtuoso |
| Estado | zustand |
| Classes condicionais | clsx |
| Variantes de componente | cva |
| Tema claro/escuro | next-themes |

Regra útil: "uma recomendação, não um menu". Antes de recomendar, olhar o `package.json`.

---

## 4. Conflitos entre as fontes (resolver antes de costurar)

| Tema | Fonte A | Fonte B | Proposta |
|---|---|---|---|
| Eyebrow (rótulo pequeno acima do título) | high-end-visual-design manda pôr em todo H1 e H2 | Anthropic evita; impeccable proíbe; taste permite no máximo 1 a cada 3 seções | **Seguir a taste**: no máximo 1 a cada 3, e de preferência nenhum |
| Animação de entrada em tudo | high-end-visual-design e minimalist-ui: "Elements never appear statically" | Anthropic e impeccable: um momento orquestrado | **Um momento forte** mais movimento com motivo; nada de fade igual em todas as seções |
| Fontes | ui-ux-pro-max sugere Inter, Playfair, DM Sans… | impeccable e taste listam essas como padrão de IA; apple-design defende `system-ui` | Visual Apple: `system-ui`/SF ou Geist. Fora disso, escolher fonte "com motivo" e evitar a lista |
| Botões em pílula | high-end-visual-design: `rounded-full` sempre | minimalist-ui: raio de 4–6px, nunca pílula | Depende do mundo escolhido, mais a "trava de forma" |
| Ícones | high-end-visual-design: Phosphor Light; minimalist-ui: Phosphor Bold, nunca Lucide | taste: Lucide só se pedirem; nextlevelbuilder: Lucide ou Heroicons | Uma família só por projeto, com traço consistente |
| Travessão | taste: proibido | uso normal em pt-BR | Evitar só como enfeite |

---

## 5. "Já temos" e "novo"

**Já temos no repositório**

- **Regras de animação com Motion 14**, molas e micro-interações de botão: `motion-oficial` e `button-animation`. O que a Emil e a nextlevelbuilder dizem sobre animação de componentes já está em boa parte lá; o certo é **apontar** para elas, não duplicar.
- **Curvas e molas "premium" para vídeo** (`remotion-video`): `bezier(0.16,1,0.3,1)` e molas com ζ≈0,8. É a mesma curva que a impeccable e a minimalist-ui usam, então está consistente.
- **O básico da ui-ux-pro-max atual**: um estilo, 3 a 5 cores, WCAG AA, no máximo 2 fontes, escala de espaço e foco visível.
- **Texto sem clichê**: as skills `copywriting` e `humanizer` cobrem o lado do texto.

**Novo (nada disso existe hoje na base)**

1. Um fluxo de direção completo: Design Read, plano de tokens, revisão do plano contra o briefing, construção, uma rodada de screenshots e a crítica final.
2. Os controles de variação, movimento e densidade, com presets para "Apple premium", "minimalista" e "landing animada".
3. Uma lista consolidada de **anti-padrões de IA** com hex e padrões concretos.
4. Regras numéricas de tipografia (tracking por tamanho, leading, ch, clamp) e de layout (hero, nav, bento, eyebrow, trava de forma).
5. Estratégias de cor, OKLCH, a trava de um acento só, paletas banidas e as alternativas a elas.
6. **Design fluido da Apple para a web**: molas com amortecimento e resposta, transferência de velocidade, projeção, elástico, materiais e as três preferências de acessibilidade (movimento, transparência e contraste).
7. O **checklist técnico de revisão** da Vercel, as "superfícies do navegador" e o formato de saída `arquivo:linha` / Antes-Depois.
8. Tokens em três camadas, com MASTER.md e sobreposição por página, num modelo de `DESIGN.md` do projeto.
9. Os modos de visita (Persuadir, Operar, Ler, Experiência).
10. A lista de bibliotecas recomendadas.

**Continua faltando**: a linguagem da Samsung One UI. Nenhuma fonte cobre; vale uma pesquisa extra.

---

## 6. Recomendação de estrutura da skill nova

Princípio: um `SKILL.md` curto que faz papel de **roteador** (fluxo e regras de ouro), com referências carregadas só quando necessárias. O texto é nosso, em português, com código e tokens em inglês. Nada de binários nem scripts de terceiros, e nada dos 2,5 MB de CSV da nextlevelbuilder; dela, extrair só as linhas premium.

```
skills/design/ui-ux-pro-max/
  SKILL.md                      # ~250–350 linhas: quando usar, fluxo de 6 passos, regras de ouro, mapa das referências
  ORIGEM.md                     # fontes, commits, o que foi adaptado de cada uma (exigência Apache: dizer o que mudou)
  APRENDIZADOS.md
  LICENCAS/                     # MIT: nextlevelbuilder, taste-skill, emilkowalski, vercel; Apache 2.0: anthropics, impeccable (+ NOTICE)
  referencias/
    01-direcao.md               # Design Read, modos de visita, controles + presets, cena física (claro/escuro), ficha de direção
    02-estilos-premium.md       # Apple/Liquid Glass, Linear-minimal, Editorial, Soft Structuralism, Ethereal Glass, bisel duplo: tokens Tailwind prontos e colapso no celular
    03-tipografia.md            # escala, tracking por tamanho, leading, ch, fontes sugeridas × "fontes de IA", detalhes (… “ ” tabular-nums balance)
    04-cor-e-tema.md            # estratégias de cor, OKLCH, 1 acento, contraste, modo escuro, paletas banidas e alternativas
    05-espaco-e-layout.md       # escala 4/8, seções, hero/nav/bento, trava de forma, z-index, breakpoints
    06-design-system.md         # tokens em 3 camadas, Tailwind v4 @theme, modelo de DESIGN.md (MASTER + páginas)
    07-movimento-web.md         # ponte para motion-oficial/button-animation: durações, curvas, molas Apple, um momento orquestrado, rolagem, reduced-motion
    08-anti-padroes-ia.md       # lista consolidada da seção 3.8
    09-revisao.md               # checklist Vercel + piso de qualidade + pre-flight; saída arquivo:linha ou Antes/Depois
    10-texto-de-interface.md    # regras de microcopy (Anthropic) em pt-BR, ligadas a copywriting/humanizer
  modelos/
    DESIGN.md                   # ficha do design system do projeto (cores, tipo, raio, sombra, movimento, componentes)
```

**Fluxo sugerido para o SKILL.md**

1. Ler o briefing e escrever o Design Read, ou fazer uma única pergunta.
2. Escolher o modo, os controles e a estratégia de cor, usando a cena física para decidir entre claro e escuro.
3. Montar o plano de tokens e revisá-lo contra o briefing e a lista anti-IA.
4. Gravar a ficha em `DESIGN.md`.
5. Construir, usando `motion-oficial` e `button-animation` para a animação.
6. Uma rodada de screenshots (desktop e 375px), o checklist `09-revisao.md`, uma correção em lote e parar.

**Regras de ouro do topo do SKILL.md** (curtas):

- O briefing do usuário vence.
- Um acento só.
- Uma escala de raio só.
- Uma família de ícones só.
- Um momento de movimento forte.
- Só `transform` e `opacity` (exceções conscientes: blur, clip-path).
- `prefers-reduced-motion` sempre.
- Contraste de 4,5:1.
- Alvo de toque de 44px.
- Nada de `transition: all`.
- Superfícies do navegador com tema.

**Integração**: o `remotion-video` e o `motion-video` leem o mesmo `DESIGN.md` do projeto do app. Assim o vídeo promocional usa exatamente a paleta, a tipografia e as molas do site.
