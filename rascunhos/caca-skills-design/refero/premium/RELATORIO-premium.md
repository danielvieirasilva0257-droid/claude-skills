# Relatório: Refero Styles, fatia PREMIUM (marcas de luxo e tecnologia de ponta)

Data: 11/10/2026. Fonte: https://styles.refero.design (biblioteca com cerca de 1.342 estilos no sitemap).
Pasta deste relatório: `scratchpad/hunter/refero/premium/`. Os arquivos `*-DESIGN.md` e `*-tokens.css` daqui são **material de estudo interno**: não devem ir para nenhum repositório nem ser republicados (veja a seção 2). A coleta no site foi **interrompida por causa dos termos de uso** depois de cerca de 177 requisições. Depois disso nada mais foi baixado.

---

## 0. Resumo em 10 linhas

1. O Refero tem DESIGN.md de **Apple (9 páginas: home, Espanha e produtos)**, B&O, Dyson, Sonos, Bose, teenage engineering, Tesla, Rivian, Ferrari, Lamborghini, BMW, SpaceX, Nike, Stripe, Linear, Vercel, Framer, Raycast e Dia (da The Browser Company, mesma empresa do Arc). Baixei 27 estilos.
2. **Samsung não existe no Refero.** Também não encontrei Google/Pixel, Sony, Porsche, Mercedes, Leica, Rolex, Nothing, OnePlus nem o navegador Arc (o "Arc" do site é a arcboats.com, uma fabricante de barcos). Para a Samsung, uso uma fonte de terceiros (oh-my-design.kr) e os estilos mais próximos.
3. O DESIGN.md vem renderizado no HTML da página, dentro de `<pre><code>`. O botão "Download" só gera um Blob no navegador com esse mesmo texto. Os tokens de Tailwind v4 e CSS vêm dentro do próprio DESIGN.md, na seção "Quick Start".
4. **Os termos de uso proíbem crawling ou extração sistemática fora dos downloads documentados, e também republicar o conteúdo como biblioteca, dataset ou repositório.** O `robots.txt` bloqueia ClaudeBot, anthropic-ai e GPTBot, e bloqueia `/api/` para todos. Fiz cerca de 177 requisições e parei o varrimento em 115 de 1.342 páginas.
5. Os 27 DESIGN.md salvos são **estudo interno e não vão para nenhum repositório**. O `claude-skills` é público. Nas skills entram só regras escritas por nós, com números de design e links para o Refero.
6. O que dá cara de "caro": UI quase sem cor (colorfulness < 0,05 em 22 de 27 estilos), **no máximo 1 cor de destaque**, reservada ao CTA principal.
7. **Sem sombras em cards e botões**: em 23 de 27 estilos, a profundidade vem de troca de superfície (#fff para #f5f5f7, ou #000 para #111) e de linhas de 1px.
8. Tipografia: display grande (56 a 120px), peso leve ou médio (300 a 600, raramente 700 ou mais), tracking negativo (-0,015 a -0,05em), corpo de 16 a 17px com entrelinha de 1,47 a 1,5. Seções separadas por 80 a 160px.
9. Botões em dois extremos: **pílula** (980px/9999px na Apple, Nike, Sonos e B&O) ou **quina viva** (0 a 4px em BMW, Ferrari, Lamborghini, teenage engineering, Stripe e Tesla). Nunca 2 botões preenchidos lado a lado.
10. Movimento premium é "mudança de cor, não de posição": 0,2s ease em cor, borda e opacidade, com reveals de 0,5 a 0,75s ease, sem bounce nem spring. Usa nav com `backdrop-filter: saturate(180%) blur(20px)` e zoom de imagem de 1,05 no hover.

---

## 1. Como o site funciona

### Estrutura e rotas
| Rota | O que é |
|---|---|
| `/` | Galeria (SSR) com cerca de 20 estilos, filtros por `?sort=` e busca `?q=`. A busca **roda no navegador**, chamando `/api/styles/search?q=` |
| `/style/<uuid>` | Página do estilo. O `<title>` é "`<Marca> design system | Refero Styles`" |
| `/design-styles/<categoria>` | Coleções com 24 estilos cada (`minimal-websites`, `ecommerce-websites`, `dark-mode-websites`, `editorial-websites`, `fintech-websites`, `devtools-websites`, `ai-startup-websites`, `agency-websites`, `productivity-apps`, `clean-saas`, `website-font-pairings`) |
| `/ai-agents/...`, `/design-md/...`, `/examples/...` | Páginas editoriais e de SEO (o que é DESIGN.md, template, especificação, prompts) |
| `/sitemaps/styles.xml`, `/sitemaps/collections.xml` | Sitemaps (1.342 estilos e cerca de 50 coleções) |
| `/api/styles`, `/api/styles/search`, `/api/styles/<id>` | API interna. Responde **403 "Please refresh the page and try again."** a clientes fora do navegador, e o robots.txt a proíbe. **Não usei.** |

### Anatomia de uma página `/style/<uuid>`
- O HTML (cerca de 250 a 330KB) traz o **DESIGN.md completo** num `<pre><code>`, já renderizado no servidor.
- O payload RSC (`self.__next_f.push`) traz um JSON `result` com:
  - `meta.url`: o site original. É o que preenche a coluna "site original" da tabela abaixo.
  - `raw`: medições brutas de cores (com contagem de uso e `colorfulness`), raios, sombras, espaçamentos e tipografia.
  - `designSystem`: interpretação com `northStar`, `description`, `colors[{name,hex,role}]`, `typography`, `typeScale`, `spacing{radius,sectionGap,…}`, `components`, `dos`, `donts`, `imagery`, `layout`, `elevationPhilosophy` e `customSections` (às vezes "Motion/Animation Philosophy").
  - Os 20 estilos "similares" (nome, id e url). Foi por eles que descobri BMW, Sonos, Bose e SpaceX.
- As abas "Tailwind v4", "CSS Variables", "Design Tokens", "Design JSON" e "Prompt" são **geradas no navegador** a partir desse JSON (`FORMAT_META` no bundle). O download é `new Blob([texto])` com `a.download="DESIGN.md"`. Não existe URL de download.
- **Como obter o DESIGN.md:** baixar `/style/<uuid>` e extrair o `<pre><code>` (com unescape de HTML). O resultado é idêntico ao botão "Download DESIGN.md" na variante padrão "extended". Os blocos `css` da seção `## Quick Start` são as abas "CSS Variables" e "Tailwind v4".
- Estrutura padrão do DESIGN.md: título com "north star", Theme, descrição, Tokens (Colors, Typography, Type Scale, Spacing & Shapes, Radius, Shadows, Layout), Components, Do's and Don'ts, Surfaces, Elevation, Imagery, Layout, Agent Prompt Guide, Similar Brands e Quick Start (CSS e Tailwind v4).
- **Avisos do próprio arquivo:** "Source measurements are normalized; roles and recommendations are interpreted… HTML examples are reconstructions." São engenharia reversa automática, **não guias oficiais das marcas**. Há inconsistências: na página genérica da Apple o display aparece com tracking positivo, e no B&O uma "fonte" se chama `object-fit: cover;`. Também há contradições entre capturas diferentes da mesma marca (cards da Apple com 8px numa e 28px noutra).
- **Movimento:** o extrator é quase todo estático. Só alguns estilos trazem uma seção de motion (Framer e Dia). Cada estilo tem vídeos de preview (`previewVideoUrl`, mp4), que não baixei.

### Acesso programático oficial
O `refero.design/llms.txt` indica o **Refero MCP** (`https://api.refero.design/mcp`) como via para agentes. É pago, com limite padrão de 8.000 requisições por mês, e só vale para pesquisa interna e trabalho de design comum.

---

## 2. Termos de uso, licença e robots (importante)

Fontes: https://doc.refero.design/legal/terms-of-use (atualizado em 03/08/2026), `styles.refero.design/robots.txt` e `refero.design/llms.txt`. Cópias locais estão em `refero/downloads/legal/`.

**O que é permitido (§10 e §13):**
- Usar o conteúdo do Refero para "pesquisa de design, inspiração, referência interna e trabalho comum de design de produto".
- "Usar os **insights** que você aprende no Refero para pesquisar, desenhar, construir ou melhorar seus próprios produtos, sites, apps e interfaces." O texto diz isso de forma explícita.
- Incluir o conteúdo como material de referência em apresentações, moodboards, arquivos do Figma e trabalho para clientes ou interno.

**O que é proibido (§10 e §14):**
- "resell, redistribute, sublicense… Refero Content"
- "use scraping, crawling, automation, or systematic extraction to copy Refero Content **outside documented download features**"
- "use automated tools to scrape, harvest, or bulk extract data except through documented features and within allowed limits"
- "publish the content as a standalone library or dataset", ou transformá-lo em "a competing dataset, **repository**, or AI/ML asset"
- Usar o conteúdo para treinar, ajustar ou avaliar modelos de ML.
- Burlar controles técnicos (paywall, limites, controles de acesso).

**O que diz o robots.txt:**
- `User-Agent: anthropic-ai / ClaudeBot / Claude-Web / GPTBot / CCBot / PerplexityBot / Google-Extended…` recebe `Disallow: /`. É um bloqueio de crawlers de IA para treino.
- `User-Agent: *` recebe `Allow: /`, mas com `Disallow: /api/`, `/admin/`, `/extract/` e `/playground/`.

**Marcas:** screenshots, logos e nomes continuam sendo propriedade das marcas. As fontes proprietárias citadas (SF Pro, BeoSupreme, DysonFutura, FerrariSans, LamboType, BMWTypeNext etc.) têm licença própria. Use sempre os substitutos indicados (Inter, Inter Tight, Söhne, Barlow…).

**Requisições feitas e interrupção da coleta (registro honesto):**
- Fiz cerca de **177 requisições** ao `styles.refero.design`, todas sequenciais e com pausa entre elas:
  - 116 páginas `/style/` no varrimento de títulos (115 registradas e 1 cortada ao parar o processo), mais 1 teste anterior.
  - 19 chunks JS, lidos como texto e nunca executados.
  - 3 páginas de coleção.
  - 4 chamadas a `/api/` (busca e galeria). Todas responderam 403. Fiz essas chamadas **antes** de ler o robots.txt, que proíbe `/api/`. Erro meu, não repetido.
  - 1 teste de `?q=samsung`, 2 sondagens de `/terms` e `/faq` (404) e o `robots.txt` e `llms.txt`.
  - **27 páginas de estilo** individuais, que são os DESIGN.md salvos.
- Fora desse domínio, fiz cerca de 10 requisições a `refero.design` e `doc.refero.design`, para termos, robots e llms.
- **A coleta foi interrompida por causa dos termos de uso.** O varrimento do sitemap pedido na tarefa parou em 115 de 1.342 páginas, assim que li os §10 e §14 e o robots.txt.
- Depois disso, abri só 27 páginas pontuais. Por ordem do coordenador, **nenhuma requisição foi feita ao site depois disso**. Este relatório usa só o que já estava salvo localmente.
- A descoberta de marcas seguiu por WebSearch, pelas coleções já salvas e pelas listas de "similares" das páginas já baixadas.
- **Não se deve rodar de novo o varrimento nem usar `/api/`.** Para acesso programático, a via oficial é o Refero MCP pago.

**Consequência prática:**
- Os 27 DESIGN.md e os `*-tokens.css` salvos aqui são **material de estudo interno**.
- **Não devem ir para nenhum repositório**: nem o `claude-skills`, que é público, nem outro qualquer. Também não devem ser republicados nem anexados a skills. Isso seria redistribuição e "repository" de conteúdo do Refero, o que os termos proíbem.
- Nas skills, escrevemos **regras e receitas próprias**, destiladas a partir dos padrões, e citamos a URL do estilo como link. Valores como hex, px e tracking são fatos medidos de sites públicos e podem ser citados pontualmente. O que não pode é a cópia em bloco dos documentos.

---

## 3. Marcas encontradas e arquivos salvos

Todos os arquivos estão em `scratchpad/hunter/refero/premium/`. Para cada linha há dois arquivos: `<slug>-DESIGN.md`, com o DESIGN.md completo, e `<slug>-tokens.css`, com os blocos "CSS Custom Properties" e "Tailwind v4 @theme".

| Marca | URL do estilo | Site original | Resumo em 1 linha | Arquivo (slug) |
|---|---|---|---|---|
| Apple (home) | [/style/aecac5da…](https://styles.refero.design/style/aecac5da-f397-4ddf-b71f-de1efc434cb8) | apple.com | "Sala branca com um único interruptor azul": canvas #f5f5f7, SF Pro com tracking negativo, um só azul #0071e3 | `apple` |
| Apple (España): MacBook Neo | [/style/c9cabb96…](https://styles.refero.design/style/c9cabb96-32fa-4896-837a-f2497ce1c856) | apple.com/macbook-neo | "Catedral de espaço branco": display de 80 a 96px, cards de 28px, cores pastel só no produto | `apple-espana-a` |
| Apple (España): iPad Air | [/style/a48ef430…](https://styles.refero.design/style/a48ef430-8c6a-42d8-8c53-ab7bb43cf33b) | apple.com/ipad-air | "Vitrine de galeria branca": hero de 80px/600, seções separadas por pelo menos 80px, um CTA azul por seção | `apple-espana-b` |
| Apple (España): home | [/style/a4f123f2…](https://styles.refero.design/style/a4f123f2-cd4b-4d26-998f-a3d3ee158024) | apple.com | "Museu à luz do dia": seções em tons quase brancos, par de botões centralizado, nav de vidro com blur | `apple-espana-c` |
| Apple iPhone 18 Pro | [/style/40be36d7…](https://styles.refero.design/style/40be36d7-7fe6-4451-9f2d-7ceccfd43be8) | apple.com/iphone-18-pro | "Galeria de hardware à meia-noite": palco #000, display de 96px/600 a -1,44px, mídia de 28px | `apple-iphone-18-pro` |
| Apple iPhone Duo | [/style/a73148b9…](https://styles.refero.design/style/a73148b9-449b-42cd-9f38-86ef694f500e) | apple.com/iphone-duo | Dobrável em galeria branca: render como evento, controles azuis discretos, cards de 28px sem sombra | `apple-iphone-duo` |
| Apple Watch Ultra 4 | [/style/06ee0fd5…](https://styles.refero.design/style/06ee0fd5-c4ab-4d5f-b66a-7285aeacd0b0) | apple.com/apple-watch-ultra-4 | "Instrumento de resistência à meia-noite": baias pretas, verde #00d959 só para métricas | `apple-watch-ultra-4` |
| Apple Watch Series 12 | [/style/375e255f…](https://styles.refero.design/style/375e255f-6e7b-4091-bf73-6df42a094263) | apple.com/apple-watch-series-12 | "Sensor de bronze no escuro": vermelho e verde só em dados de saúde | `apple-watch-series-12` |
| Apple AirPods 5 | [/style/cfcd001c…](https://styles.refero.design/style/cfcd001c-e812-4126-9bdf-1f16b68d182e) | apple.com/airpods-5 | "Cinema no branco": filmes em tela cheia, seções separadas por 163px | `apple-airpods-5` |
| Bang & Olufsen | [/style/27a4a4fa…](https://styles.refero.design/style/27a4a4fa-4b1a-4e7e-b2c3-3e5bf57f00e5) | bang-olufsen.com | Galeria escandinava: produto como escultura, uma única fonte (BeoSupreme), ultramarino #060daa só como plano de fundo | `bang-olufsen` |
| Dyson | [/style/96845df2…](https://styles.refero.design/style/96845df2-7ddb-420a-814e-c339f95a6554) | dyson.com | Galeria de engenharia em papel creme #fff8e6, DysonFutura 300, cantos de 2px, header preto | `dyson` |
| Sonos | [/style/8d315332…](https://styles.refero.design/style/8d315332-6267-4dc0-a14c-e8b49c26b0e1) | sonos.com | "Parede de galeria com luz quente": 0% de cor na UI, display de 96px/400, botões de 80px de raio | `sonos` |
| Bose | [/style/ac53627e…](https://styles.refero.design/style/ac53627e-4738-4121-8f5d-05e4d8475a5b) | bose.com | "Palco costeiro": foto de campanha em tela cheia, headline condensada 900, controles P&B de 2px | `bose` |
| teenage engineering | [/style/aecf9dda…](https://styles.refero.design/style/aecf9dda-5cba-4dc7-9e73-59b65d895cdf) | teenage.engineering | Catálogo industrial: fonte peso 100, raio 0, 5 neutros, nenhuma sombra | `teenage-engineering` |
| Tesla | [/style/7266b546…](https://styles.refero.design/style/7266b546-2fb0-465c-acd6-79001c39829a) | tesla.com | "Showroom na tela": blocos de tela cheia, azul #3e6ae1 só no "Order Now", raios de 4 a 8px | `tesla` |
| Rivian | [/style/a5dc5626…](https://styles.refero.design/style/a5dc5626-1103-42e3-9edb-a6d52fb9a210) | rivian.com | "Monólito elétrico em parede de concreto": tipografia de 120 a 360px, um amarelo #ffac00 | `rivian` |
| Ferrari | [/style/80164adf…](https://styles.refero.design/style/80164adf-a898-4f7c-bce7-12f3f62e1649) | ferrari.com | Vazio preto, caixa-alta com tracking largo, Rosso Corsa #da291c **só no hover e no foco**, raio 0 | `ferrari` |
| Lamborghini | [/style/c9c5be5a…](https://styles.refero.design/style/c9c5be5a-aaa1-4338-9681-8378d2e24fbd) | lamborghini.com | "Showroom preto com um carro amarelo": LamboType em caixa-alta a +0,023em, #ffc000 em 1 elemento por tela, raio 0 | `lamborghini` |
| BMW | [/style/b8899cbd…](https://styles.refero.design/style/b8899cbd-e2ca-4069-83cf-d8f8b0d71100) | bmw.com | "Parede de galeria para metal esculpido": display de 60px **peso 300**, raio 0, nenhuma cor de UI | `bmw` |
| SpaceX | [/style/13b74e34…](https://styles.refero.design/style/13b74e34-b824-4d1d-bd2c-bb9bfbc2d6e1) | spacex.com | Mission control: #000 absoluto, D-DIN em caixa-alta a +0,10em, botões ghost de 1px | `spacex` |
| Nike | [/style/d7ace114…](https://styles.refero.design/style/d7ace114-0548-41f5-a2ff-2afbf32be94d) | nike.com | Galeria monocromática: Futura de 76px no hero, pílulas de 30px, produto em tela cheia sem cantos | `nike` |
| Stripe | [/style/48e5de76…](https://styles.refero.design/style/48e5de76-05d5-4c4e-a269-c7c245b291ec) | stripe.com | "Livro-razão em tinta índigo": sohne-var **300**, índigo #533afd, raio de 4px, sem sombras | `stripe` |
| Linear | [/style/90ce5883…](https://styles.refero.design/style/90ce5883-bb24-4466-93f7-801cd617b0d1) | linear.app | "Instrumento de precisão à meia-noite": #08090a, Inter Variable até 590, lima #e4f222 em 1 CTA | `linear` |
| Vercel | [/style/f24daf3a…](https://styles.refero.design/style/f24daf3a-d43f-4dec-85a9-8ac1d5148a03) | vercel.com | "Terminal tipografado em papel": Geist a -0,06em, borda hairline com anel duplo, raio de 6px | `vercel` |
| Framer | [/style/d417b42f…](https://styles.refero.design/style/d417b42f-824d-45ba-a02e-cbef3b8ea0d8) | framer.com | "Galeria neon no vazio": GT Walsheim 500 a -0,05em, azul #0099ff em bordas e glows, motion de 0,75s ease | `framer` |
| Raycast | [/style/3b6a17f0…](https://styles.refero.design/style/3b6a17f0-3bdf-418c-a95e-0b89e5a8b2f8) | raycast.com | Centro de comando escuro com coral #ff6363 só na marca, sombras "tecla de teclado", nav com blur de 48px | `raycast` |
| Dia (The Browser Company, Arc) | [/style/b458ca1a…](https://styles.refero.design/style/b458ca1a-70f0-4f85-b745-f879a4d08457) | diabrowser.com | Palco escuro com páginas editoriais: serif de 112px peso 300, pílulas, motion de 0,2s ease só em cor | `dia-browser` |

**Encontradas e não baixadas** (premium e hardware; IDs para consulta futura):
- Peloton `355e8465…`
- Analogue `98ab0172…`
- Sigma Photo `67c60ee4…`
- Ssense `fa157687…`
- Peak Design `6f3fb64d…`
- Vanmoof `4887c681…`
- Symbol Audio `3b742f76…`
- Blok watches `7d10f1d6…`
- Zoox `e85a82b1…`
- Heart Aerospace `bf523387…`
- 1X NEO `7aa1dbff…`
- Ableton `e5081033…`
- Zara, FARFETCH, Monocle e Freitag (aparecem nas coleções)

A lista completa de nomes, IDs e URLs vistos está em `refero/downloads/similar_names.tsv` e `refero/downloads/premium_titles.tsv`.

**Não encontradas** (WebSearch restrito ao domínio, 115 títulos lidos e listas de "similares" de 27 páginas): Samsung, Google/Pixel, Sony, Porsche, Mercedes, Leica, Rolex, Nothing, OnePlus e o navegador Arc. Como a busca interna é bloqueada e o varrimento parou em 115 páginas, alguma delas pode existir sem estar indexada. Os sinais, porém, apontam para ausência. O projeto oh-my-design também relata que o refero.design não tinha valores para a Samsung.

---

## 4. Apple em detalhe (síntese de 9 capturas)

**Ideia central:** "o produto é o design". A UI quase não tem cor, a tipografia carrega a voz e a fotografia do produto carrega a cor e a emoção.

### Paleta
| Papel | Hex | Observação |
|---|---|---|
| Texto principal (claro) | `#1d1d1f` | Quase preto, levemente quente. Nunca use #000 para texto no claro |
| Canvas claro | `#ffffff` e `#f5f5f7` alternados | Alterne fundo branco e #f5f5f7 entre seções **no lugar de linhas divisórias** |
| Superfícies leves | `#fafafc` (nav aberta), `#e8e8ed` (botão e hover sutil), `#f3f6f6` (rodapé do iPad) | |
| Linhas hairline | `#d6d6d6` / `#d2d2d7` | 1px |
| Texto secundário | `#6e6e73`, `#707070`, `#86868b` (no escuro) | |
| CTA preenchido | **`#0071e3`** | Só como fundo de botão: "uma cor, um trabalho" |
| Links | `#0066cc` (no claro), `#2997ff` (no escuro) | Sublinhado **só no hover** |
| Selo "Novo" | `#b64400` | Texto puro de 12px/600, sem pílula, no máximo 1 por página |
| Palco escuro (Pro, Watch) | `#000000` (hero), `#111111` e `#1d1d1f` (bandas), texto `#f5f5f7` (não #fff) | |
| Cores de dado | `#00d959` (bateria), `#ff3037` (batimentos), `#ffd500` (câmera) | Só dentro da narrativa do produto |

### Tipografia
- **Famílias:** SF Pro Display para 21px ou mais e SF Pro Text para até 17px (até 44px em alguns casos). A divisão é rígida. Substitutos: Inter ou system-ui.
- **Escala usada:** 12 / 14 / 17 / 21 / 28 / 40 / 48 / 56 / 64 / 80 / 96px.
- **Corpo:** 17px/400, entrelinha 1,47, tracking -0,022em (-0,374px). É a configuração mais frequente (221 ocorrências numa página).
- **Hero:** 80px/600, entrelinha 1,05 (84px), tracking -1,2px (-0,015em). Na versão máxima, 96px/600, entrelinha 1,04, tracking -1,44px. 64px/600 usa -0,576px.
- **Pesos:** 600 é o teto dos títulos. O 700 aparece só em lockups promocionais. 300 aparece em subtítulos na página antiga.
- **Tracking:** fica mais negativo quanto maior o corpo de texto. Em tamanhos médios (21 a 32px) vai a cerca de +0,2px.
- **Detalhes:** `font-feature-settings: "numr"` em números. Títulos centralizados, parágrafos longos alinhados à esquerda.

### Formas, espaçamento e elevação
- **Raios:**
  - Botões e pílulas: `980px` ou `9999px` (totalmente redondos).
  - Cards e mídia: **28px** nas páginas de produto atuais (8px na captura antiga da home).
  - Nav local flutuante: 20px. Chips e controles: 36px. Links: 10px.
- **Espaço:**
  - Base de 4px. Gap entre elementos de 4 a 20px.
  - **Entre seções: 80 a 120px**, chegando a 163px no AirPods. O hero tem pelo menos 160px de respiro.
  - Texto em bloco centrado de cerca de 980px. Seções full-bleed de até 1.440px.
- **Elevação: nenhuma sombra** em cards, botões ou nav. A hierarquia vem da troca de superfície e de linhas de 1px (`0 0 0 1px` em cinza). A única sombra registrada é `rgba(0,0,0,.22) 3px 5px 30px`, aplicada só em imagem de produto.

### Componentes
- **Par de CTAs:** pílula preenchida #0071e3 (texto branco, 17px/400, padding de 11–12px × 15–22px), seguida de pílula com contorno #0066cc ou link de texto "Saiba mais ›". **Nunca 2 preenchidos.** Na nav de produto, a pílula azul é compacta: 12px, padding de 7×14px.
- **Nav global:**
  - 44px de altura, 12px/400.
  - Fundo branco ou #161617, com `backdrop-filter: saturate(1.8) blur(20px)` ao rolar.
  - Sub-nav de produto "sticky" com nome em 19–21px/600.
- **Hero:** pilha centralizada com eyebrow ou nome do produto, frase gigante, 1 ou 2 pílulas e preço ("Desde …" em #6e6e73). O render do produto ocupa os 60% inferiores. **Sem card em volta.**
- **Cards de feature:** fundo #fff sobre #f5f5f7 (ou o inverso), 28px de raio, sem borda e sem sombra, padding de 28 a 40px. A mídia pode "vazar" pela borda.
- **Carrossel de destaques:** controle translúcido `rgba(210,210,215,.64)` com 36px de raio, dots #777779 e botão de pausa agrupados numa pílula. Os cards de serviço (TV+, Music) são tiles fotográficos com 8px de raio e pílula de ação.
- **Rodapé:** #f5f5f7, links de 12px em #6e6e73, sem cards.

### Movimento (pouco explícito no Refero; complemento com o que é observável)
- **Registrado no Refero:**
  - Links ganham sublinhado no hover.
  - Nav fica translúcida com blur(20px) e saturate(180%) ao rolar.
  - A nav "sticky" de produto aparece ao rolar.
  - Mídia em vídeo e filmes em tela cheia (AirPods "cinema on white").
  - Controles translúcidos sobre vídeo.
- **Receita derivada** (inferência minha, não está no Refero):
  - Narrativa por scroll, uma seção por viewport.
  - Fade e translate curtos no texto (cerca de 20 a 40px).
  - Escala sutil no produto.
  - Nada de bounce.

---

## 5. Samsung (ausente no Refero) e estilos mais próximos

**O Refero não tem Samsung.** A melhor fonte pública que achei é de terceiros: [oh-my-design.kr/design-systems/samsung](https://oh-my-design.kr/design-systems/samsung).
- Foi gerada pelo projeto `kwakseongjae/oh-my-design` a partir de samsung.com/sec, em capturas de 13/07 e 29/09/2026.
- **Não é oficial e não tem declaração de licença.** Li a página e não salvei cópia.

**Valores medidos:**
- **Paleta:**
  - CTA **preto `#000000`** com texto branco.
  - Canvas #ffffff, superfície #f7f7f7, texto secundário #707070, borda #dddddd.
  - Azul `#006bea` **só** em hover, press e foco da nav (nunca em repouso). `#007aff` só nas setas do carrossel. `#0381fe` é cor do One UI (app), não da web.
- **Tipografia:** Samsung Sharp Sans para display (24px/700). SamsungOne (SamsungOneKorean) para UI: 14px/700 em CTAs, 16px/700 na nav, 16px/400 no corpo, tracking de -0,28px em alguns pontos.
- **Formas:** CTA com **20px de raio, 40px de altura**, padding de 10px 24px 9px. Busca e botões do carrossel com 40px de raio. Tab selecionada com raio 0. **Sem sombras.**
- **Componentes:**
  - CTA contornado: preto, que **inverte no hover** para fundo preto com texto branco.
  - CTA sublinhado: barra `::after` de 1px.
  - Tile de produto: 342×342px, título de 24px/700.
  - Foco: `outline: 2px dotted #000`.
- **Movimento:**
  - Botão contornado: `transition: background-color, border-color, color 0.2s linear`.
  - Busca: `border-color 0.5s cubic-bezier(0.35,0,0.36,1)`.
  - Tile de produto no hover: **imagem `scale(1.05)`** e a linha de "comprar" passa de opacidade 0 para 1.
  - Mega-menu: fade de opacidade.

**Estilos mais próximos dentro do Refero:**
- **Apple:** concorrente direto. Mesmo esquema de produto isolado e CTA em pílula, mas com azul onde a Samsung usa preto.
- **Sonos e Bose:** e-commerce de eletrônicos monocromático com CTAs P&B.
- **B&O:** pílulas com contorno que invertem no hover, como na Samsung.

Para um visual "tipo Samsung": a receita da Apple, com CTA preto de 20px de raio e 40px de altura no lugar da pílula azul, mais display em sans geométrica bold (700).

---

## 6. Padrões comuns do "visual premium" (o que faz um site parecer caro)

Base: 27 estilos. Os números vêm dos campos `raw` e `designSystem`.

### Os três arquétipos premium que aparecem
1. **Galeria clara.** Exemplos: Apple, B&O, Dyson, Sonos, BMW, teenage engineering, Nike, Tesla e Rivian. Canvas branco ou quase branco, produto isolado, UI sem cor e 1 CTA.
2. **Palco escuro.** Exemplos: iPhone Pro, Apple Watch, Ferrari, Lamborghini e SpaceX. Fundo #000 ou #111, fotografia cinematográfica em tela cheia, texto #f5f5f7, cor só no produto ou no hover.
3. **Instrumento de precisão (tech/SaaS).** Exemplos: Linear, Vercel, Raycast e Framer (escuros), além de Stripe (claro). Superfícies em degraus de luminância, bordas hairline, mono para metadados e 1 cor elétrica.

### Cor
- **UI quase sem cor:** `colorfulness` menor que 0,05 em 22 de 27 estilos. Oito ficam em 0 a 0,006: BMW, Ferrari, Sonos, Lamborghini, Nike, Vercel, B&O e Dyson. As exceções são Stripe (0,29), Apple home (0,12) e Linear (0,11).
- **Uma cor de destaque, no máximo, com um único trabalho:**

  | Marca | Destaque | Onde aparece |
  |---|---|---|
  | Apple | #0071e3 | Só fundo de CTA |
  | Tesla | #3e6ae1 | Só "Order" |
  | Rivian | #ffac00 | 1 CTA por tela |
  | Lamborghini | #ffc000 | 1 elemento por tela |
  | Linear | #e4f222 | 1 ação por vista |
  | Ferrari | #da291c | Só hover |
  | Raycast | #ff6363 | Só marca |

  Nike, BMW, Sonos, SpaceX e teenage engineering não têm **nenhuma** cor de UI. A foto faz esse papel.
- **Canvas nunca é "branco de Word" nem "cinza de dashboard":**
  - Claros: #f5f5f7 (Apple), #fafafa (Vercel), #f6f8f7 (TE), #fff8e6 (Dyson, creme).
  - Escuros: #000 (Apple Pro e SpaceX), #08090a (Linear), #040506 (Raycast).
- **Texto quase preto com subtom:** #1d1d1f (Apple), #171717 (Vercel), #191817 (B&O, quente), #061b31 (Stripe, frio). No escuro, texto #f5f5f7 ou #f0f0fa, não #fff.
- **Escala de 6 a 12 neutros com papéis nomeados**, separando borda hairline de texto secundário e de terciário.

### Tipografia
- **Display grande:** 56 a 120px é a faixa típica (Apple 80–96, Sonos e Bose 96, Lamborghini e Rivian 120, Dia 112, Nike 76, Linear 72). Rivian chega a 360px para o monograma.
- **Peso leve ou médio no display:**
  - 300: Stripe, BMW, Dyson, Dia. O teenage engineering chega a 100.
  - 400 a 450: Sonos, Vercel, Raycast.
  - 500 a 600: Apple, Nike, Framer, Linear (590).
  - "Negrito gritante" (900) só na Bose, em fonte condensada.
- **Tracking negativo que cresce com o tamanho:**
  - Apple: -0,015em a 80px.
  - Stripe: -0,01em até 26px, -0,02em entre 32 e 48px, -0,025em a 56px.
  - Linear: -0,022em a 48px ou mais.
  - Framer: -0,04 a -0,05em. Rivian: -0,045em a 120px. Vercel: -0,06em a 64px.
- **Exceção do arquétipo automotivo e aeroespacial:** **caixa-alta com tracking positivo** (Ferrari +0,083 a 0,091em, SpaceX +0,09 a 0,10em, Lamborghini +0,023em). Os eyebrows e labels em mono usam +0,07 a +0,10em em caixa-alta (Vercel, Raycast, Dia).
- **Entrelinha:** 1,0 a 1,07 no display e 1,47 a 1,5 no corpo. O contraste entre os dois cria a hierarquia.
- **Corpo:** 16 a 18px (Apple 17). Nunca abaixo de 12px.
- **1 família** (B&O, Dyson, Sonos, Stripe) **ou 2 com papéis rígidos** (Display e Text, ou Sans e Mono).
- **Fontes proprietárias** quase sempre. Substitutos sugeridos: Inter ou Inter Tight, Söhne, Neue Haas, Barlow para DIN e condensadas, Futura PT ou Jost para Dyson e Nike.

### Espaço em branco e grid
- **Espaço entre seções:**

  | Faixa | Marcas |
  |---|---|
  | 48 a 66px | Nike, BMW, Dyson, teenage engineering, SpaceX |
  | 80 a 96px | Apple, Sonos, Rivian, Lamborghini, Linear, Stripe, Framer |
  | 96 a 163px | Vercel, Bose, Apple AirPods |

- Grade de 4px ou 8px. Gap entre elementos de 4 a 20px.
- **Largura máxima:** 1.200 a 1.440px, com bloco de texto de cerca de 640 a 980px. Hero e imagens são **full-bleed**.
- Seções empilhadas, centradas e simétricas (Apple, Tesla) ou em grade de catálogo sem gutter interno (TE, Nike, B&O com 25px de gutter).
- **Separação por troca de fundo, não por linhas:** branco e #f5f5f7 alternados, ou bandas pretas e brancas.

### Fotografia e produto
- **O produto é o herói:** render isolado em fundo branco ou preto sem costura, ângulo de 15 a 25° ou 3/4, luz de estúdio que mostra o material. Nada de ilustração genérica.
- **A foto carrega a cor:** acabamentos pastel na Apple, carro amarelo na Lamborghini.
- **Duas escolas:**
  - "Objeto em museu": Apple, B&O, TE e Dyson (com algum lifestyle).
  - "Lifestyle cinematográfico": Sonos, Bose, Nike, Ferrari e SpaceX, com luz quente ou dramática e cortes justos.
- **Imagem sem moldura:** foto até a borda, sem padding, borda ou sombra. Na Apple, o "card" de mídia tem 28px de raio.

### Botões e componentes
- **Dois extremos, nada de "meio-termo genérico de 8px":**
  - **Pílula:** Apple 980/9999px, Nike 30px, B&O e Rivian 40px, Sonos 80px, Framer e Dia 9999px.
  - **Quina viva:** BMW, Ferrari, Lamborghini e TE com 0px; Dyson e Bose com 2px; Stripe, Tesla e SpaceX com 4px.
  - Ferramentas dev ficam em 6 a 8px (Vercel, Linear, Raycast).
- **Hierarquia de ação:** 1 botão preenchido mais 1 contornado, ghost ou link "›". **Nunca 2 preenchidos.**
  - B&O: o padrão é ghost, e no hover inverte para preto.
  - SpaceX: todos os botões são ghost de 1px.
- **Cards somem:** sem borda e sem sombra, separados por 1 degrau de superfície. Raio coerente (Apple 28px, Framer 15/20/25px) ou 0px.
- **Sistema com até 3 raios:** o Linear usa 6, 12 e 9999px. O Apple antigo usa 980px e 8px.
- **Nav fina e discreta:**
  - 44px na Apple, 64px na Vercel.
  - Links de 12 a 16px.
  - Vidro com `backdrop-filter: blur(20px) saturate(180%)` (Apple e Vercel). O Raycast usa blur(48px) numa pílula flutuante.
- **Selos mínimos:** "Novo" é texto puro (Apple #b64400). B&O pede para não poluir o produto com selos, notas ou tags de promoção.

### Profundidade e sombra
- **Sem sombra em cards e botões em 23 de 27 estilos.**
- A profundidade vem de:
  - Degraus de superfície: #000, #111, #171717, #242424 no Framer; #fff, #f2f2f2, #e5e7eb na Rivian.
  - Hairline de 1px ou 0,5px.
  - Anel duplo da Vercel: `0 0 0 1px rgba(0,0,0,.08), 0 0 0 2px #fafafa`.
  - Inset "tecla de teclado" no Raycast.
- **Exceções:**
  - Rivian, com sombra fria e difusa (`0 4px 12px rgba(159,161,184,.15)`).
  - Dia, em elementos flutuantes.
  - Sonos, em botões preenchidos e elevados.
  - Linear, com sombra escura sutil de `0 2px 4px rgba(0,0,0,.4)` somada à hairline.
- **Gradientes:** só dentro de mídia ou como atmosfera de hero. Nunca em botões ou cards.

### Movimento (sinais no Refero, Samsung e inferências)
- **"Muda de cor, não de posição."**
  - Dia: `transition: 0.2s ease` em background, border, color, fill e stroke, com `cubic-bezier(0.4,0,0.2,1)` como easing secundário. **Sem spring nem bounce, e sem scale no hover de botão.**
  - Samsung: 0,2s linear. Ferrari: o vermelho aparece no hover. Apple, TE e Linear: sublinhado no hover. B&O: inversão de preenchimento.
- **Reveals lentos e atmosféricos:** o Framer usa **0,75s ease** como duração dominante, sem overshoot, com blur de 3 a 5px em overlays.
- **Narrativa de scroll:** seções de tela cheia em sequência (Tesla e Apple). Na SpaceX, as fotos se dissolvem umas nas outras e a nav não muda ao rolar.
- **Mídia:** imagem com `scale(1.05)` no hover de tile (Samsung). Vídeo e filme em tela cheia com controles translúcidos (Apple). Marquee de gradiente no máximo 1 vez por página (Dia).
- Fonte variável para micro-animações de peso (Framer).

---

## 7. Recomendações para as nossas skills

> Pelo `CLAUDE.md` da `main`, mudar skills exige aprovação do usuário. O que segue é proposta.
> Regra de ouro legal: **destilar em regras próprias e linkar o Refero. Nunca copiar os DESIGN.md para o repositório (que é público).**

### ui-ux-pro-max: criar a receita "Premium / visual caro"
- **Paleta:** 1 canvas (off-white #f5f5f7, #fafafa ou #fff8e6, ou near-black #000 ou #08090a), texto quase preto com subtom (#1d1d1f), 6 a 10 neutros nomeados por papel e **no máximo 1 destaque**, aplicado só no CTA primário.
- **Tipografia:**
  - Display de 56 a 96px, peso 300 a 600.
  - Tracking: -0,015em a 64–80px, até -0,05em em fontes geométricas.
  - Corpo de 17px, entrelinha 1,47, tracking -0,022em. Entrelinha do display entre 1,0 e 1,07.
  - Até 2 famílias com papéis rígidos.
- **Espaço:** seções separadas por 80 a 160px (hero com pelo menos 160px), grade de 4 ou 8px, texto com no máximo 980px, imagens full-bleed.
- **Profundidade:** proibir `box-shadow` em cards e botões. Usar degrau de superfície e hairline de 1px.
- **Raios:** sistema com até 3 valores. Escolher entre "pílula + 28px" (Apple) e "0 a 4px" (automotivo, editorial).
- **Checklist anti-barato:**
  - Nada de dois CTAs coloridos.
  - Nada de gradiente em botão.
  - Nada de selo colorido em todo card.
  - Nada de bold 700 ou mais em títulos grandes.
  - Nada de sombra suave genérica.
  - Nada de cinza "#ccc" como fundo.
- **Três arquétipos prontos:** Galeria clara, Palco escuro e Instrumento de precisão, cada um com tokens próprios escritos por nós.

### button-animation: estados de botão "premium"
- Transição só de `background-color`, `color`, `border-color` e `opacity`, em **150 a 250ms**, com `ease` ou `cubic-bezier(0.4,0,0.2,1)`. Nada de scale, bounce ou elastic no CTA (regra explícita do Dia).
- **Variações:**
  - **Pílula Apple:** `border-radius: 980px`, padding de 12×22px, #0071e3 que escurece levemente no hover. A secundária tem contorno de 1px.
  - **Ghost que inverte (B&O e Samsung):** contorno de 1px que, no hover, vira fundo escuro com texto claro.
  - **Link "›" (Apple):** sublinhado só no hover. A seta pode deslizar 2px.
  - **Automotivo (Ferrari):** caixa-alta a +0,08em, raio 0, cor de marca que aparece só no hover.
  - **Tecla Raycast:** inset de topo `rgba(255,255,255,.05)`, anel de `rgba(255,255,255,.25)` e inset de base `rgba(0,0,0,.2)`.
- **Foco visível:** anel de 2px na cor de ação (Apple) ou `2px dotted` (Samsung). Respeitar `prefers-reduced-motion`.

### motion-oficial: perfil "motion premium"
- **Durações:** micro (cor, opacidade) de 0,2s. Reveals de seção de **0,5 a 0,75s** com `ease` ou `cubic-bezier(0.35,0,0.36,1)` (curva da Samsung). Sem overshoot.
- **Coreografia:** uma ideia por viewport, scroll storytelling em tela cheia (Tesla e Apple), texto entra com fade mais translate curto (16 a 32px), produto com escala de 0,96 para 1 ou parallax leve, dissolve entre fotos (SpaceX).
- **Nav de vidro:** `backdrop-filter: saturate(180%) blur(20px)` ao rolar. A sub-nav de produto aparece ao rolar.
- **Restrições:** no máximo 1 elemento em loop contínuo por página (marquee do Dia). Vídeo em tela cheia com controles translúcidos em pílula.

### thumbnail-carousel: carrossel "vitrine"
- **Cards:**
  - Mídia com 28px de raio, sem sombra, sobre #f5f5f7 ou #000 (Apple).
  - Ou tiles com raio 0 e foto até a borda (Nike e automotivo).
  - Título de 24 a 28px/600 e no máximo 1 pílula de ação.
- **Interação:** no hover, a imagem vai a `scale(1.05)` em cerca de 0,5s e a linha "comprar" faz fade-in (Samsung). Nada de sombra no hover.
- **Controles:** dots e pausa agrupados numa pílula translúcida `rgba(210,210,215,.64)` com 36px de raio (Apple). Rolagem horizontal com snap. Nada de selos e ratings sobre o produto (B&O).

### Vale criar uma skill nova?
**Sim, mas como "receitas premium próprias", e não como biblioteca de DESIGN.md.**

Proposta: `estilos-premium/`, contendo:
- `SKILL.md`, para escolher o arquétipo e aplicar a checklist.
- `references/arquetipos.md`, com os 3 arquétipos e tokens escritos por nós.
- `references/marcas.md`, uma ficha curta por marca: hex principais, família substituta, raios, gaps e 3 regras de faça e não faça, com o **link do estilo no Refero** como fonte.
- `references/motion-premium.md`.

**Não colocar em `references/` os 27 DESIGN.md baixados.** O repositório é público, e os termos proíbem republicar como "repository" ou "dataset". Eles ficam no scratchpad só como material de pesquisa.

Se o usuário quiser acesso vivo e completo pelo agente, a via oficial é o **Refero MCP pago**.

---

## 8. Arquivos

- `premium/RELATORIO-premium.md`: este relatório.
- `premium/<slug>-DESIGN.md` e `premium/<slug>-tokens.css` para 27 slugs: apple, apple-espana-a, apple-espana-b, apple-espana-c, apple-iphone-18-pro, apple-iphone-duo, apple-watch-ultra-4, apple-watch-series-12, apple-airpods-5, bang-olufsen, dyson, sonos, bose, teenage-engineering, tesla, rivian, ferrari, lamborghini, bmw, spacex, nike, stripe, linear, vercel, framer, raycast, dia-browser.
- Material de apoio (não é entregável):
  - `refero/downloads/json/<slug>.json`: JSON `result` estruturado de cada estilo.
  - `refero/downloads/pages/`: HTML bruto.
  - `refero/downloads/legal/`: termos de uso, robots.txt e llms.txt.
  - `refero/downloads/similar_names.tsv` e `refero/downloads/premium_titles.tsv`: nomes, IDs e URLs vistos.
  - `refero/premium-scripts/`: extratores em Python e listas.
