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
