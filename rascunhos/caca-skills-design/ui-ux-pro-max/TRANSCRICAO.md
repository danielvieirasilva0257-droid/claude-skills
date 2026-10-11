# Transcrição: pesquisas A e B para a nova `ui-ux-pro-max`

Data: 11/10/2026. Agente de transcrição.

Este arquivo é o **registro fiel** das duas pesquisas feitas em paralelo. As duas aparecem abaixo **na íntegra, sem edição**, na ordem:

1. **Pesquisa A** (`pesquisa-A.md`, 31.114 bytes): catálogo skills.sh (`npx skills find`), 6 skills lidas por inteiro.
2. **Pesquisa B** (`pesquisa-B.md`, 32.462 bytes): GitHub, web, Apple HIG, Material 3, spec DESIGN.md do Google e os relatórios locais do Refero.

Material de apoio também lido (não transcrito aqui, porque já está salvo no scratchpad):
- `refero/premium/RELATORIO-premium.md` (27 estilos premium, termos de uso do Refero, Samsung).
- `refero/minimal/RELATORIO-minimal.md` e `refero/minimal/MODELO-DESIGN.md` (20 estilos minimalistas, formato DESIGN.md).
- `refero/minimal/skill-oficial/` (skill `refero-design`, MIT): `SKILL.md` e `references/anti-ai-slop.md`.
- `google-labs-code/design.md` (Apache-2.0): formato do front matter YAML e ordem das seções.
- Da `main` (sem alterar): `skills/design/ui-ux-pro-max/`, `guia/LEIA-ANTES-DE-USAR.md` (seções 3, 4 e 9) e `skills/video/remotion-video/SKILL.md` (regras de composição do editor).

## Como as duas pesquisas foram costuradas (decisões do transcritor)

| Ponto | Pesquisa A | Pesquisa B | Decisão na `nova/` |
|---|---|---|---|
| Estrutura | SKILL.md roteador + `referencias/01..10` + `modelos/DESIGN.md` + `LICENCAS/` | SKILL.md + `references/` + `assets/MODELO-DESIGN.md` + `original/` com cópias MIT | SKILL.md roteador (padrão do repositório: `references/`) + 5 referências. Sem cópia de skills de terceiros (ver `nova/ORIGEM.md`). |
| Fluxo | Design Read → controles → plano de tokens revisado → DESIGN.md → build → 1 rodada de prints | briefing → referência (lock) → DESIGN.md → tokens → componentes → revisão, com 2 aprovações | Fluxo de 6 etapas da B, com o Design Read, os controles e a revisão do plano da A dentro das etapas 1 a 4. |
| DESIGN.md | MASTER.md + páginas (nextlevelbuilder) | spec aberta do Google + `lint`/`export` | Modelo compatível com a spec do Google, com seções extras nossas (Movimento, Acessibilidade, Composição, Decision ledger, Decisões em aberto) e sobreposição por página opcional. |
| Eyebrow | taste: no máximo 1 a cada 3 seções | (sem posição) | No máximo 1 a cada 3 seções; de preferência nenhum. |
| Entrada em tudo | Um momento forte | Uma coreografia por página | Um momento forte + movimento com motivo. |
| Fontes | Lista de "fontes de IA" (impeccable) | Inter/Geist como livres | Inter só como substituta da SF ou por motivo escrito; a lista vira alerta, não proibição. |
| Pílula x quina | Depende do mundo + trava de forma | Escola macia x precisa | Escolher 1 escola; até 3 raios. |
| Escuro | Cena física decide | Escuro só se o briefing pedir | Frase de cena decide; sem informação, claro. |
| Travessão | Evitar só como enfeite | (sem posição) | Evitar como enfeite na interface; uso gramatical normal em pt-BR. |
| Samsung | Lacuna | Princípios One UI + medidas de samsung.com (terceiros) | Receita "tipo Samsung" escrita por nós em `estilos-premium.md`. |
| Refero | Relatórios internos como base de números | Só a skill oficial MIT pode entrar | **Instrução do coordenador (11/10):** nada do Refero além da skill oficial MIT. Fatos de marca passaram a vir do awesome-design-md (MIT); `DESIGN.md` → tokens pelo padrão aberto do Google (`npx @google/design.md lint/export`, testado: 0 erros, 0 avisos). |

---

# >>> PESQUISA A (íntegra)

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

---

# >>> PESQUISA B (íntegra)

# Pesquisa B: `ui-ux-pro-max` (GitHub, web e material local)

Data: 11/10/2026. Agente B. O agente A cobre o catálogo `npx skills`. Aqui ficam GitHub, web e os relatórios do Refero que já tínhamos.
Clones novos estão em `scratchpad/hunter/downloads/*-B2/`: `ui-ux-pro-max-skill-B2`, `google-design-md-B2`, `VoltAgent_awesome-design-md-B2`, `bergside_awesome-design-skills-B2` e `apple-hig-B2`, este com o JSON e o texto da HIG. Também reaproveitei clones `*-B` de pesquisas anteriores: `vercel-wig-B`, `anthropic-skills-B`, `material-web-B`, `Leonxlnx_taste-skill-B`, `A-pbakaus-impeccable`, `A-ibelick-ui-skills` e `raintree-technology_hig-doctor-B`.
Nada foi alterado em `/home/user/claude-skills-main`.

---

## 0. Resumo em 10 linhas

1. O `nextlevelbuilder/ui-ux-pro-max-skill` é **MIT** (v2.13.0 no repositório, CLI `ui-ux-pro-max-cli` 2.15.0). É um **catálogo genérico**: CSVs mais busca BM25 em Python. Não tem foco premium, e a versão paga (uupm.cc) fica com marca, logo e assets.
2. **Achado-chave: o DESIGN.md virou um padrão aberto.** O Google publicou a spec `google-labs-code/design.md` (**Apache-2.0**, alpha) e o CLI `npx @google/design.md` (0.4.0). O CLI faz `lint`, que confere o contraste WCAG, faz `diff` e faz `export`, que gera o `@theme` do **Tailwind v4** e tokens DTCG.
3. O **VoltAgent/awesome-design-md** é **MIT** e reúne 74 DESIGN.md de marcas, entre elas Apple, BMW, Ferrari, Lamborghini, Nike, SpaceX, Tesla, Linear, Vercel e Stripe. É uma alternativa **licenciável** ao Refero, que não podemos republicar. Mesmo assim, recomendo usar por link ou download sob demanda, não copiar para o repositório.
4. A skill oficial do Refero (MIT) é o melhor "método" que encontrei: brief, reference lock, decision ledger, anti-média, papel dos tokens, quality gate e anti-AI-slop. Dá para aproveitar quase tudo **sem o MCP pago**.
5. O **Vercel Web Interface Guidelines** (MIT) é o melhor checklist de revisão de código de UI (acessibilidade, foco, formulários, animação, tipografia e desempenho). Pode entrar quase literal, com a atribuição.
6. O `frontend-design` da Anthropic (Apache-2.0) avisa que também viraram "cara de IA" o fundo quase preto com 1 acento ácido e o broadsheet com hairline e raio 0. Ou seja, premium **não pode virar receita fixa**: a direção sai do briefing.
7. Os números da Apple HIG foram conferidos na página oficial. O texto da HIG é © Apple, então usamos só ideias e números. Do Samsung One UI só há princípios públicos, sem números. Os números do Material 3 vêm dos tokens do `material-web` (Apache-2.0).
8. As regras numéricas próprias estão na seção 2. Elas consolidam Refero premium e minimal, Apple, Material, Practical Typography e Refactoring UI, estes dois só como ideias.
9. O fluxo recomendado tem 6 etapas e 2 pontos de aprovação do Daniel: briefing → referência (reference lock) → DESIGN.md → tokens → componentes → revisão.
10. Estrutura proposta: a `ui-ux-pro-max` vira uma skill **nossa**, em pt-BR, com `references/` (regras numéricas, premium, revisão, mobile e fluxo), `assets/MODELO-DESIGN.md` compatível com a spec do Google e `original/` com as licenças MIT (Refero e Vercel). O catálogo externo continua opcional.

---

## 1. Fontes

Legenda da licença:
- **L**: pode copiar texto literal, com atribuição.
- **I**: só ideias e números, escritos com nossas palavras.
- **X**: não pode entrar no repositório.

| Fonte | Link | Licença | Uso | Nota |
|---|---|---|---|---|
| UI/UX Pro Max (nextlevelbuilder) | github.com/nextlevelbuilder/ui-ux-pro-max-skill | MIT (© 2024 Next Level Builder) | L | Commit `67803ea` (11/10/2026). Traz 7 skills (`ui-ux-pro-max`, `design`, `design-system`, `brand`, `banner-design`, `slides`, `ui-styling`) e os CSVs: `styles` (79 estilos, 50 ativos), `colors` e `ui-reasoning` (192 cada), `typography` (74 pares), `ux-guidelines` (119), `motion` (17 presets GSAP), `charts` (25), `landing` (34), `icons` (105), `react-performance` (44) e `google-fonts` (1.934). Também traz `search.py` (BM25), o gerador `--design-system` com `MASTER.md` mais overrides por página e os "dials" `--variance`, `--motion` e `--density` (1–10). Exige Python 3. **Ponto fraco:** é catálogo médio, então tende ao "genérico", e o estilo "Minimalism" usa #000 e #fff puros. **Ponto forte:** a tabela de prioridades (acessibilidade → toque → desempenho → estilo → layout → tipo/cor → animação → formulários → navegação → gráficos) e o checklist pré-entrega. |
| Skill oficial Refero (`refero-design`) | github.com/referodesign/refero_skill | MIT (© 2026 Refero) | L | v1.0.2, commit `a9b54a3`. Cópia local em `refero/minimal/skill-oficial/`. Detalhes na seção 5. |
| DESIGN.md do Refero Styles | styles.refero.design | Termos proíbem | X | Os termos proíbem republicar e montar "repository" ou dataset, e o robots.txt bloqueia robôs de IA. Ficam só como estudo no scratchpad. No repositório entra apenas o link do estilo. |
| Spec DESIGN.md do Google (Stitch) | github.com/google-labs-code/design.md · npm `@google/design.md` | Apache-2.0 | L | Commit `9bf8eae` (27/07/2026). Front matter YAML (`colors`, `typography`, `rounded`, `spacing`, `components`, com referências `{colors.primary}`) seguido de 8 seções `##` em ordem fixa: Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts. Seções desconhecidas são **preservadas**, então podemos acrescentar Movimento e Acessibilidade. CLI: `lint` (contraste WCAG, referências quebradas), `diff` e `export --format css-tailwind\|dtcg`. |
| awesome-design-md (VoltAgent) | github.com/VoltAgent/awesome-design-md · getdesign.md | MIT (© 2026 VoltAgent) | L com cautela | 74 DESIGN.md no formato do Google: apple, bmw, bmw-m, bugatti, ferrari, lamborghini, nike, spacex, tesla, playstation, nvidia, linear.app, vercel, stripe, raycast, framer, notion, superhuman, airbnb e outras. **Não há Samsung.** São análises de terceiros, e nomes e fontes continuam pertencendo às marcas. Recomendo baixar sob demanda no projeto, não copiar para o `claude-skills`. |
| awesome-design-skills (bergside / typeui.sh) | github.com/bergside/awesome-design-skills | MIT | I | 67 skills de estilo geradas por template. A "premium" usa azul padrão do Tailwind #3B82F6 com violeta #8B5CF6 e os 9 pesos, ou seja, é **anti-exemplo**. Não usar. |
| Vercel Web Interface Guidelines | github.com/vercel-labs/web-interface-guidelines · vercel.com/design/guidelines | MIT (© 2025 Vercel Labs) | L | O `command.md` é um checklist de revisão de código de UI. Base da seção 4.3. |
| `frontend-design` (Anthropic) | github.com/anthropics/skills/tree/main/skills/frontend-design | Apache-2.0 | L | Lista os "clusters" de design de IA: creme com serif e terracota; quase-preto com 1 acento ácido; broadsheet com hairline e raio 0; kit de cards SaaS; eyebrow em caixa alta em todo título; "→" em todo link. Também recomenda planejar, revisar contra o brief e só então construir, "gastar a ousadia num lugar só" e "tirar um acessório". |
| Apple HIG (Typography, Layout, Color, Accessibility, Buttons, Motion) | developer.apple.com/design/human-interface-guidelines/ | © Apple | I | Números conferidos via JSON oficial (`apple-hig-B2/*.txt`): tamanho padrão e mínimo de texto (iOS 17/11 pt, macOS 13/10, visionOS 17/12, watchOS 16/12); alvo mínimo de 44×44 pt (60×60 no visionOS); contraste de 4,5:1 até 17 pt e 3:1 a partir de 18 pt ou bold; "1 ou 2 botões proeminentes por vista"; botões de 28/32/44/52/64 pt; "evite pesos Ultralight, Thin e Light em texto pequeno"; "não use a mesma cor para significados diferentes"; "evite movimento em interações frequentes". |
| hig-doctor (raintree) | github.com/raintree-technology/hig-doctor | MIT o código, HIG © Apple | I | O próprio `THIRD_PARTY_NOTICES` diz que o material da HIG continua sob os termos da Apple. |
| Samsung One UI | developer.samsung.com/one-ui | © Samsung | I | Quatro princípios: focar na tarefa; interagir naturalmente (**área de visualização em cima, área de interação embaixo**, ao alcance do polegar); conforto visual (modo escuro, alto contraste, fonte variável); responsivo. A página de layout não publica números (dp, raios), que ficam só nas imagens. One UI Sans tem pesos 200/300/400/600. As medidas da web samsung.com estão no relatório premium (fonte oh-my-design.kr, de terceiros). |
| Material 3 (tokens) | github.com/material-components/material-web (`tokens/versions/v0_192`) | Apache-2.0 | L | Formas 0/4/8/12/16/28/9999px. Durações de 50 a 1.000 ms (short 50–200, medium 250–400, long 450–600). Curva standard e emphasized `cubic-bezier(.2,0,0,1)`, decelerate `(.05,.7,.1,1)` e legacy `(.4,0,.2,1)`. State layers: hover 8%, focus e press 12%, drag 16%. Display-large 57/64px, body-large 16/24px. Não confirmei a licença do **texto** do site m3.material.io, então ele fica como I. |
| Refactoring UI (Wathan e Schoger) | refactoringui.com | Comercial | I | Ideias: escala de espaço não linear; mais espaço entre grupos do que dentro deles; hierarquia por peso e cor antes de tamanho; tirar ênfase do secundário; 8 a 10 cinzas; sombra em 2 camadas; começar com espaço demais. |
| Practical Typography (Butterick) | practicaltypography.com | © autor | I | Corpo de 15–25px na web; entrelinha de 120–145%; linha de 45–90 caracteres; acertar o corpo de texto primeiro. |
| taste-skill (Leonxlnx) | github.com/Leonxlnx/taste-skill | MIT | L, com cautela | Tem `minimalist-skill`, `soft-skill`, `redesign-skill` e outras. As opiniões são duras: proíbe Inter, Lucide e pílula em CTA, o que **conflita com Apple e Samsung**. Vale como lista de clichês de texto ("Elevate", "Seamless") e como regra "sem emoji". |
| impeccable (pbakaus) | github.com/pbakaus/impeccable | Apache-2.0 | L | Comandos de design (audit, critique, distill, polish, layout, animate) e o par PRODUCT.md + DESIGN.md. Boa fonte de ideias para a etapa de revisão. |
| ui-skills (ibelick) | github.com/ibelick/ui-skills | MIT | L | `baseline-ui`, `create-design-md`, `fixing-accessibility` e `fixing-motion-performance`. |
| Listas awesome | travisvn/awesome-claude-skills, ComposioHQ/awesome-claude-skills, VoltAgent/awesome-agent-skills | MIT (VoltAgent); as outras não conferi | Só links | Citações úteis: `frontend-design`; skills do shadcn/ui (ui.shadcn.com/docs/skills); `anydesign` (uxKero), que gera design.md a partir de imagem, URL ou Figma; e `VoltAgent/awesome-claude-design`. |
| Relatórios locais | `refero/premium/RELATORIO-premium.md`, `refero/minimal/RELATORIO-minimal.md` e `MODELO-DESIGN.md`, `refero/animacao/RELATORIO-animacao.md` | Nossos | Base | Números medidos em 27 estilos premium, 20 minimal e 35 com seção de movimento. |

---

## 2. Regras de design premium e minimalista (escrita própria, com números)

Valem como **padrão** quando o projeto não tem DESIGN.md. O DESIGN.md do projeto sempre vence.

### 2.0 Primeiro escolha a direção (nunca use uma receita fixa)

**Arquétipo**, com 1 por projeto:

| Arquétipo | Exemplos | Canvas | Assinatura |
|---|---|---|---|
| Galeria clara | Apple, B&O, Sonos, Dyson, Samsung | off-white #f5f5f7, #fafafa ou creme #fff8e6 | produto isolado, UI sem cor, 1 CTA |
| Palco escuro | iPhone Pro, Ferrari, Lamborghini, SpaceX | #000 ou #0a0a0a; texto #f5f5f7 | foto cinematográfica em tela cheia; a cor fica só no produto ou no hover |
| Instrumento de precisão | Linear, Vercel, Raycast, Stripe | degraus de luminância | hairlines, mono só em metadados, 1 cor elétrica |
| Editorial (com cuidado) | Medium, Monocle, Anthropic | papel tingido | serif no display. **Só** se o produto for editorial, cultural, de moda ou de hospitalidade |

**Escola de raio**, sem misturar:
- **Macia:** pílula 9999px nos botões e 12–28px nos cards (Apple, Samsung, Nike).
- **Precisa:** 0–6px em tudo (Stripe, BMW, Ferrari, Vercel).

**Personalidade de movimento:**
1. utilidade quieta;
2. premium com peso;
3. estúdio cinematográfico;
4. lúdico.

**Trava anti-default:** se o mesmo plano sairia para qualquer outro briefing parecido, refaça. O briefing decide. O "Palco escuro com acento lima" e o "broadsheet com raio 0" também viraram cara de IA.

### 2.1 Tipografia

| Item | Regra |
|---|---|
| Famílias | 1, ou no máximo 2 com papéis rígidos (display e texto). Mono só para código e metadados. |
| Pesos | 2 ou 3 no sistema todo. Display com **300–600, nunca 700+** em título grande. Corpo 400, botão 500. |
| Corpo | **16–17px** (Apple 17), entrelinha **1,47–1,6**, tracking 0 (Apple -0,022em). Nunca abaixo de 12px. O padrão mínimo da Apple é 11 pt. |
| Display (hero desktop) | **56–96px**, com padrão de 64–72px. Entrelinha **0,95–1,1**. Em mobile: `clamp(40px, 8vw, 96px)`. |
| Tracking por tamanho | 24–28px: -0,01em · 32–48px: -0,02em · 56–64px: -0,03em · 72px+: -0,04 a -0,05em. Caixa alta em 11–13px: **+0,06 a +0,08em**. |
| Escala | Razão 1,2 em UI e app; 1,25–1,333 em marketing. Escala de app (Apple): 34/28/22/20/17/16/15/13/12/11. |
| Medida | **60–70 caracteres**, cerca de 540–680px (a faixa aceitável é 45–90). Título centralizado; parágrafo com mais de 2 linhas alinhado à esquerda. |
| Detalhes | `text-wrap: balance` nos títulos e `pretty` na prosa; `font-variant-numeric: tabular-nums` em preço e métrica; "…" em vez de "..."; aspas curvas. |
| Fontes livres | Inter ou Inter Tight, Geist, Instrument Sans e Manrope (sans); Instrument Serif e Newsreader (serif); Geist Mono e JetBrains Mono. SF Pro e SamsungOne têm licença restrita: use substitutas. |

### 2.2 Cor

| Item | Regra |
|---|---|
| Proporção | 60–80% neutros, 10–20% hierarquia de texto, **5–10% acento**. No máximo 2 cores por componente. |
| Acento | **1 cor com 1 papel** (ex.: só o fundo do CTA primário). No máximo 1–2 botões proeminentes por vista (Apple). **Nunca 2 preenchidos lado a lado.** |
| Neutros | 6 a 10 neutros nomeados por papel (canvas, superfície, borda, texto 1/2/3), com degraus de **2–5% de luminosidade** entre camadas. |
| Canvas | Tingido em vez de #fff puro (#f5f5f7, #fafaf9 ou #f6f5f4). No escuro, #000 a #0a0a0a e superfícies +3–6%. |
| Texto | Quase preto (#1d1d1f, #171717). No escuro, #f5f5f7 em vez de #fff. |
| Contraste | Corpo **≥ 4,5:1**; texto ≥ 18–24px ou bold e componentes **≥ 3:1**. Texto principal deve passar de 7:1. Confira com `npx @google/design.md lint`. |
| Significado | A mesma cor nunca tem 2 significados. Cor nunca é a única pista: acompanhe com texto ou ícone. Faça variantes clara, escura e de alto contraste. |
| Proibido por padrão | Índigo e violeta (#6366f1, #8b5cf6), a menos que sejam da marca; gradiente em botão ou card; glow; segundo acento "decorativo"; cinza #ccc como fundo. |
| Estados | Hover e active só escurecem ou clareiam a mesma cor (algo como 8–12%, igual ao state layer do Material), nunca trocam de cor. |

### 2.3 Espaço e grid

| Item | Regra |
|---|---|
| Base | **4px**. Escala: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 160. |
| Proximidade | Dentro do grupo, **8px**; entre grupos, **16–24px**. O espaço entre grupos é sempre maior que o espaço dentro deles. |
| Seções | **96px** no desktop (faixa de 80–160px; hero com ≥ 120–160px de respiro) e **56–64px** no mobile. |
| Card | Padding de **24px** (16–32). Raio interno = raio externo − padding. |
| Largura | Conteúdo com **1200–1280px** (1440px para full-bleed); texto com ≤ 680px; margem lateral de 16–24px no mobile e 48–64px no desktop. |
| Ritmo | 1 foco visual por seção. Separe seções com **1** recurso só: respiro, faixa alternada (#fff/#f5f5f7) ou hairline de 1px. Nada de grade de 3 cards "por padrão". |

### 2.4 Forma e profundidade

- **No máximo 3 raios** no sistema (ex.: 6/12/9999 ou 9999/28/8). A escala do Material (0/4/8/12/16/28/full) serve como menu de opções.
- **Sombras:** zero em cards e botões (23 dos 27 premium). A profundidade vem de troca de superfície e hairline de 1px (`rgba(0,0,0,.08)`).
  - Se precisar de sombra, use uma "sussurro" de 4–10% de opacidade, em 2 camadas, mais um anel de 1px.
  - Sombra forte só no **único** elemento flutuante: menu, modal ou mockup.
- **Vidro:** só na nav ao rolar, com `backdrop-filter: saturate(180%) blur(20px)` sobre fundo com 70–80% de opacidade.

### 2.5 Componentes

- **Botão primário:**
  - altura de **40–48px** e alvo de toque **≥ 44×44px** (Apple 44 pt, Material 48dp);
  - padding de 8–12 × 16–24px e label de 14–17px com peso 500;
  - sem sombra e sem gradiente.
- **Hierarquia de ações:** 1 preenchido, 1 ghost ou outline de 1px ao lado (mesma altura e raio) e 1 link de texto. Use o estilo, não o tamanho, para indicar o preferido (Apple). Ação destrutiva nunca recebe o papel primário.
- **Variante Samsung:** CTA preto, raio de 20px, altura de 40px, contorno que inverte no hover, foco `2px dotted`.
- **Nav:**
  - altura de 44–64px, até 5 links e CTA à direita;
  - vidro e borda só depois de rolar.
  - Mobile: tab bar com ≤ 5 itens.
- **Foco:** `:focus-visible` com anel de 2px e offset de 2px na cor de ação. Nunca `outline: none` sem substituto.
- **Selos:** texto puro de 12px, no máximo 1 por tela. Nada de selo colorido em todo card.

### 2.6 Movimento (resumo; o detalhe fica em `motion-oficial` e `button-animation`)

| Camada | Duração | Curva |
|---|---|---|
| Toque e feedback | 100–120 ms | `ease-out` |
| Hover e cor | 150–200 ms | `(.4,0,.2,1)` ou `ease` |
| Estado de componente (tabs, acordeão) | 200–300 ms | `(.2,0,0,1)` (Material standard) |
| Modal e gaveta | 250–400 ms (entrada) e 150–200 ms (saída) | `(.32,.72,0,1)` (folha do iOS) |
| Revelação no scroll | 500–750 ms; translate de 16–32px; stagger de 60–100 ms | `(.16,1,.3,1)` ou `(.19,1,.22,1)` |
| Frase do hero (só sites "cinematográficos") | 0,8–1,5 s | expo/quint out |
| Loop ambiente | 27–80 s, **no máximo 1 por página** | linear |

Regras:
- Anime só `transform` e `opacity`. Nunca use `transition: all`.
- Sem bounce nem overshoot no chrome. Mola só no momento-assinatura.
- Premium é "muda a cor, não a posição". O zoom de imagem no hover é de 1,03–1,05.
- Evite movimento em interações muito frequentes (Apple).
- Autoplay com mais de 5 s precisa de pausa (Vercel). `prefers-reduced-motion` é obrigatório.
- Uma coreografia só por página é melhor que fade-up em toda seção, que o `frontend-design` aponta como cara de IA.

### 2.7 Imagem e conteúdo

- O produto ou a foto real é o herói: full-bleed, sem moldura. Se a imagem faltar, use um placeholder honesto com proporção fixa, `alt` e uma nota de direção de arte. Nunca uma "foto falsa" em CSS.
- Use texto real do produto, em voz ativa, com CTA específico ("Salvar alterações" em vez de "Continuar"). Sem clichês ("Eleve", "Revolucione") e **sem emoji como ícone**.
- Minimalismo não é página vazia: mantenha a prova, o contexto e a ação.

### 2.8 Mobile (Apple + Samsung One UI)

- **Zona de visualização em cima** (título grande que encolhe ao rolar) e **zona de interação embaixo**, com as ações principais ao alcance do polegar.
- Alvo de 44×44px e 8px entre alvos. Use `env(safe-area-inset-*)`.
- Tipo em `rem` com `clamp()` para respeitar o zoom de texto, e layout que empilha quando a fonte cresce.
- Bottom nav com ≤ 5 itens. Sem scroll horizontal acidental.

---

## 3. Fluxo de trabalho recomendado

Os pontos de aprovação do Daniel aparecem como ✋.

| # | Etapa | O que fazer | Saída |
|---|---|---|---|
| 1 | **Briefing** | Preencher o formato do Refero (MIT): `Desenhando [O QUÊ] para [QUEM] em [PLATAFORMA]. Objetivo… Tom… Objeção principal… Precisa lembrar… Restrições… Caminho (build direto / 3 direções / auditoria)`. Perguntar só o que muda o resultado. Escolher o arquétipo, a escola de raio e a personalidade de movimento (seção 2.0). | Brief de 8 linhas |
| 2 | **Referência** | Juntar 3–5 referências: links do Refero (só visualizar), getdesign.md / awesome-design-md (MIT), sites reais e prints do Daniel. Escolher **1 principal** e pegar no máximo 1–2 detalhes das secundárias (**não tirar a média**). Montar o **reference lock**: Principal / Preservar (3–5 traços) / Emprestar só / Regras de papel / Mídia / Rejeitar / Compromissos de token. Para telas grandes, propor **3 direções**. ✋ | Reference lock e, se for o caso, escolha entre 3 direções |
| 3 | **DESIGN.md** | Criar `DESIGN.md` na raiz do projeto a partir do `assets/MODELO-DESIGN.md`. O front matter YAML segue a spec do Google e as seções `##` usam os nomes em inglês da spec, com texto em pt-BR, mais Movimento, Acessibilidade e Decisões em aberto. Todo valor tem **papel** (onde usar e onde nunca usar). Incluir o **decision ledger** (Decisão / Fonte / Regra de papel / Por quê). Adicionar ao `CLAUDE.md` do projeto: "Antes de mudar UI, leia @DESIGN.md". ✋ | DESIGN.md aprovado |
| 4 | **Tokens** | `npx @google/design.md lint DESIGN.md` (contraste e referências) e depois `npx @google/design.md export --format css-tailwind DESIGN.md > app/theme.css`, que gera o `@theme` do Tailwind v4. Nomear pelo **propósito** (`--color-canvas`, `--color-action`), nunca pela cor. Adicionar os tokens de movimento (duração e curva). | `theme.css` e tokens de movimento |
| 5 | **Componentes** | Montar primeiro os primitivos: botão em 3 níveis, link, input, card (só se for clicável), nav, seção e rodapé. Usar shadcn/ui ou Radix quando houver. Animação via `button-animation` e `motion-oficial`; carrossel via `thumbnail-carousel`. Nada de valor solto no código: procurar "utility drift" (`[#…]`, `p-[13px]`). Só depois montar as páginas. | Componentes e páginas |
| 6 | **Revisão** | Checklists da seção 4 com screenshots em **375px e 1440px**, claro e escuro, e `prefers-reduced-motion`. Comparar com o reference lock e corrigir o "drift", em vez de pedir um vago "melhore". Registrar o aprendido no `APRENDIZADOS.md`. | Entrega com prints |

Atalho para tarefas pequenas (ajuste de UI num projeto que já tem DESIGN.md): pular as etapas 1–3, ler o DESIGN.md, aplicar e fazer a etapa 6.

---

## 4. Checklists

### 4.1 Briefing (antes de desenhar)
- [ ] O que é, para quem, em qual plataforma e qual a tarefa principal.
- [ ] O que **precisa ficar**: conteúdo, prova, ação e navegação.
- [ ] Marca existente (cores, fonte, logo) ou liberdade total.
- [ ] Arquétipo, escola de raio e personalidade de movimento escolhidos e justificados pelo briefing.
- [ ] Mídia disponível (fotos e renders reais?) ou plano de placeholder.

### 4.2 Anti-barato e anti-AI-slop (premium)
- [ ] 1 acento com 1 papel; nada de 2 CTAs preenchidos; nada de índigo ou violeta por padrão.
- [ ] Display com peso ≤ 600 e tracking negativo; corpo de 16–17px; no máximo 2 famílias e 3 pesos.
- [ ] Sem sombra genérica (`shadow-md`/`lg`), sem gradiente em botão ou card, sem glow.
- [ ] No máximo 3 raios e uma escola só (pílula ou quina viva).
- [ ] Seções com 96px ou mais (desktop) e 1 foco por seção. Nada de "hero → grade de 3 cards → preços → FAQ" automático.
- [ ] **Teste do card:** se tirar borda, fundo e raio não atrapalha, não é card.
- [ ] **Teste da troca de logo:** se o hero serviria para uma cafeteria trocando só o logo, está genérico.
- [ ] Nada de: 1 palavra do título em itálico ou outra cor; eyebrow em caixa alta em todo título; "01 / 02 / 03" sem sequência real; "→" em todo link; emoji como ícone.
- [ ] Escuro só se o briefing pedir. Creme com serif e terracota só se for editorial.
- [ ] Existe **1** detalhe memorável, e o resto está quieto ("tire um acessório").

### 4.3 Revisão de código de UI (Vercel WIG, MIT, resumido)
- **Acessibilidade:**
  - `aria-label` em botão só com ícone;
  - label em todo input;
  - `<button>` para ação e `<a>` para navegação;
  - `alt` em imagens;
  - `aria-live` em toast e validação;
  - títulos h1–h6 em ordem;
  - skip link.
- **Foco:** `:focus-visible` visível, nunca `outline:none` sem substituto, `:focus-within` em controles compostos, header sticky que não cobre o foco.
- **Formulários:**
  - `autocomplete`, `type` e `inputmode` corretos;
  - nunca bloquear colar;
  - erro ao lado do campo, com foco no primeiro erro;
  - botão ativo até a requisição começar;
  - aviso de mudanças não salvas.
- **Animação:**
  - respeitar `prefers-reduced-motion`;
  - animar só `transform` e `opacity`;
  - nunca `transition: all`;
  - animações interrompíveis;
  - `transform-origin` correto.
- **Tipografia:** "…", aspas curvas, `tabular-nums`, `text-wrap: balance`, espaço não separável em "10 MB".
- **Conteúdo:** `min-w-0` em filhos flex, truncate ou line-clamp, estados vazios, textos curto, médio e muito longo.
- **Imagens:** `width` e `height` explícitos (evita CLS); `loading="lazy"` abaixo da dobra; `priority` no hero.
- **Desempenho:** virtualizar listas com mais de 50 itens; preload da fonte crítica com `font-display: swap`; vídeo `muted loop playsinline` em vez de GIF.
- **Estado:** filtros e abas na URL; ação destrutiva com confirmação ou desfazer.
- **Toque:** `touch-action: manipulation`; `overscroll-behavior: contain` em modais; `env(safe-area-inset-*)`.
- **Tema:** `color-scheme: dark` no `<html>` do tema escuro; `<meta name="theme-color">`.

### 4.4 Pré-entrega
- [ ] Revisão em 3 camadas (Refero):
  1. hierarquia: a mensagem e a ação principais estão óbvias?
  2. consistência: escala, papéis de cor, ritmo e raios.
  3. estados: hover, foco, ativo, desabilitado, loading, vazio, erro e conteúdo longo.
- [ ] Prints em 375px e 1440px, claro e escuro.
- [ ] Contraste conferido: corpo ≥ 4,5:1 e componentes ≥ 3:1.
- [ ] Alvos ≥ 44px.
- [ ] Movimento reduzido testado.
- [ ] Toda decisão grande aparece no decision ledger. Se não tem fonte, sai.
- [ ] `lint` e `typecheck` do projeto passando.

---

## 5. O que aproveitar da skill oficial do Refero (MIT)

Para copiar, basta manter o arquivo `LICENSE` ("Copyright (c) 2026 Refero") junto da cópia ou dos trechos, como pede a MIT.

| Parte | Decisão | Como |
|---|---|---|
| Formato do brief (Discovery) | **Usar** | Traduzir para pt-BR na etapa 1. |
| Reference lock e regra de "não tirar média" | **Usar** | É o coração da etapa 2. |
| Decision ledger | **Usar** | Vira uma seção do DESIGN.md. |
| Preservar o papel dos tokens (cor de CTA só no CTA etc.) | **Usar** | Vira regra do MODELO-DESIGN.md (coluna "Papel"). |
| Quality gate (cerca de 15 perguntas) | **Usar, adaptado** | Trocar "usou Refero styles?" por "usou referência travada?". |
| `anti-ai-slop.md` (9 sinais e checklist) | **Usar** | Combinar com os clusters do `frontend-design` na seção 4.2. |
| `typography.md`, `color.md`, `motion.md`, `craft-details.md`, `icons.md`, `copywriting.md` | **Usar como referências opcionais** | Copiar em `original/refero-design/` (MIT). Nossas regras numéricas, em pt-BR, ficam por cima e mandam quando houver conflito. Exemplo: o preset de SaaS do Refero usa #111 e Inter, o que não conflita. |
| `visual-workflow.md` (3 direções, visual QA) | **Usar** | Etapas 2 e 6. |
| `mcp-tools.md` e o roteamento styles/screens/flows | **Opcional** | Só se o Daniel assinar o plano Pro (8 mil chamadas por mês). Sem o MCP, a pesquisa usa links, prints e awesome-design-md. |
| Descrição "Primary/default… Prefer over…" | **Descartar** | Ela tenta mandar nas outras skills. A nossa descrição convive com `button-animation`, `motion-oficial` e `thumbnail-carousel`. |
| `example-workflow.md` | Opcional | É um bom exemplo de pricing page, mas é longo. |

---

## 6. "Já temos" e "novo"

| Tema | Já temos | Novo (desta pesquisa) |
|---|---|---|
| Skill `ui-ux-pro-max` | Ponteiro para o projeto externo, com instalação e uso, mais uma seção "se não estiver instalado" com básicos genéricos | A skill passa a ser **nossa**, em pt-BR, com regras numéricas próprias e o fluxo de 6 etapas. O externo fica opcional, como catálogo. |
| Números premium e minimal | Nos relatórios `refero/premium` e `refero/minimal` (scratchpad) | Consolidados e reescritos na seção 2, cruzados com Apple HIG, Material 3, Practical Typography e Refactoring UI. |
| Formato DESIGN.md | `MODELO-DESIGN.md` (no estilo Refero, em pt-BR, no scratchpad) | Alinhar ao **padrão aberto do Google** (YAML e 8 seções), com lint de contraste e export para o Tailwind v4 via `npx @google/design.md`. |
| Referências de marca | 27 + 20 + 25 DESIGN.md do Refero (só estudo, não podem ir ao repositório) | **awesome-design-md (MIT, 74 marcas)** para uso legal no projeto, por download sob demanda. Fichas curtas nossas com links. |
| Método | Nada formal | Brief, reference lock, decision ledger e quality gate (Refero MIT); plano → revisão → build (`frontend-design`). |
| Revisão de código de UI | Nada | Checklist do Vercel WIG (MIT) mais itens nossos. |
| Anti-AI-slop | Nada (só o alerta "calm editorial" no relatório) | Lista unificada de Refero e `frontend-design`, incluindo os clusters "escuro com acento ácido" e "broadsheet". |
| Movimento | `motion-oficial` (MIT), `button-animation`, `thumbnail-carousel` e as regras de motion premium do `remotion-video` | Tabela de camadas e curvas da seção 2.6 (Material, Refero, animação), como resumo que aponta para essas skills. |
| Mobile | Nada | Seção 2.8 (Apple e One UI: zona de polegar, 44px, safe areas). |
| Samsung | Medidas da web via oh-my-design (relatório premium) | Princípios oficiais do One UI; confirmado que não há números públicos nem DESIGN.md (nem no Refero nem no awesome-design-md). |

---

## 7. Recomendação de estrutura (Frankenstein)

Lembrete: pelo `CLAUDE.md` da main, mudar o `SKILL.md` **exige aprovação**. O que segue é proposta.

```
skills/design/ui-ux-pro-max/
  SKILL.md                    # NOSSO, pt-BR, ~150–200 linhas: quando usar, fluxo de 6 etapas,
                              # pontos de aprovação, roteamento para references/ e para as outras skills
  APRENDIZADOS.md             # adendos datados (livre)
  references/
    regras-numericas.md       # seção 2 inteira: tipo, cor, espaço, forma, componentes, movimento-resumo
    premium.md                # 3+1 arquétipos, escolas de raio, receita Apple e Samsung, anti-barato
    revisao.md                # checklists 4.1–4.4 (o 4.3 cita o Vercel WIG, MIT)
    mobile.md                 # Apple HIG e One UI (só números e ideias, com links)
    referencias-marcas.md     # fichas curtas nossas: marca → links (Refero, getdesign.md), 3 traços,
                              # substituta de fonte. SEM conteúdo do Refero
  assets/
    MODELO-DESIGN.md          # modelo pt-BR compatível com a spec do Google (YAML + ## seções em inglês)
    theme-exemplo.css         # @theme do Tailwind v4 escrito por nós (galeria clara, como exemplo)
  original/
    ux-ui-disign-link         # mantém o ponteiro para o nextlevelbuilder (catálogo opcional)
    refero-design/            # skill oficial MIT intacta + LICENSE + ORIGEM.md (sem mcp, se preferir)
    vercel-web-interface-guidelines/  # command.md + LICENSE (MIT)
```

- **Não vendorizar** o nextlevelbuilder: são cerca de 3 mil linhas de CSV, 22 stacks e Python, e o conteúdo é genérico. Basta manter as instruções de instalação numa seção "Catálogo opcional".
- **Não colocar** nenhum DESIGN.md do Refero. Do awesome-design-md, só o link e o comando para baixar a marca escolhida para dentro do projeto do Daniel, com a atribuição MIT.
- O `MODELO-DESIGN.md` deve usar os nomes de seção em inglês da spec (`## Colors` etc.) para o `lint` reconhecer. O texto fica em pt-BR, e as seções extras (`## Movimento`, `## Acessibilidade`, `## Decisões em aberto`, `## Decision ledger`) são preservadas pelo parser.
- Ao salvar, atualizar no mesmo commit o `guia/HABILIDADES.txt`, porque a linha da `ui-ux-pro-max` muda de "indica como instalar" para "design premium e minimalista: fluxo DESIGN.md e regras".
- Um combo futuro pode se chamar `combo-ui-premium`: ui-ux-pro-max (etapas 1–4) → button-animation, motion-oficial e thumbnail-carousel (etapa 5) → revisão (etapa 6), com os 2 pontos ✋.
