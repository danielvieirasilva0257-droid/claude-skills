---
name: design-premium
description: "Cria sites, landing pages, páginas de produto e telas de app com visual premium (tipo Apple, Samsung, Stripe, Linear), minimalista ou animado, com números medidos de tipografia, cor, espaço, raios, sombras e movimento, e com um DESIGN.md por projeto (modelo incluído). Use quando pedirem site, landing page, página de produto, tela de app ou redesign com cara de 'premium', 'caro', 'luxo', 'sofisticado', 'tipo Apple', 'tipo Samsung', 'minimalista', 'clean', 'elegante', 'com animação' ou 'com movimento', e quando for escrever, ler ou usar um DESIGN.md."
---

# Design premium: sites e telas com cara de caro

Esta skill ensina a montar interfaces com visual **premium**, **minimalista** ou **animado**. Ela traz:

- os números que se repetem nos sites caros;
- como escolher **uma** referência;
- como escrever o `DESIGN.md` do projeto;
- as regras de composição do Daniel aplicadas a sites;
- a checklist final.

**De onde vêm os números:** da pesquisa de 11/10/2026 na biblioteca Refero Styles (64 estilos diferentes estudados: Apple, B&O, Tesla, Ferrari, Stripe, Linear, Vercel, Notion e outros). Os números foram agregados e reescritos por nós. **Não guardamos nenhum DESIGN.md do Refero**, porque os termos de uso proíbem republicar o conteúdo (veja `ORIGEM.md`).

## Arquivos

| Arquivo | Quando ler |
|---|---|
| `references/padroes-premium.md` | Ao definir tokens: as tabelas completas de tipografia, cor, espaço, formas, botões, navegação e imagem, os arquétipos com paletas iniciais e a receita "tipo Samsung" |
| `references/movimento-sites.md` | Ao animar um site: as 4 personalidades de movimento, durações por camada, dicionário de curvas e receitas em Motion 14 e CSS, já ajustadas às regras do editor |
| `references/indice-estilos.md` | Ao escolher a referência: 64 estilos, com tipo, resumo nosso e link do Refero |
| `references/modelo-DESIGN.md` | Ao criar o `DESIGN.md` de um projeto (modelo em branco) |
| `assets/receitas-movimento.tsx` | Código pronto das receitas M1 a M8 (Motion 14, Tailwind v4), testado no TypeScript estrito |
| `ORIGEM.md` | Fontes, data e o que os termos do Refero permitem |
| `LICENSE-refero-skill-MIT.txt` | Licença da skill oficial do Refero, da qual adaptamos a checklist "anti-cara de IA" e o método de travar a referência |
| `APRENDIZADOS.md` | Sempre, logo depois deste arquivo |

## Regras de ouro

1. **Primeiro o `DESIGN.md`, depois a interface.** Sem ele, o agente inventa valores.
2. **Uma referência principal.** Mais 1 ou 2 secundárias, só para detalhes. **Nunca tire a média** de várias: o resultado vira genérico.
3. **A interface quase não tem cor.**
   - 6 a 10 neutros com papel definido, mais **1 cor de ação**.
   - Essa cor tem um único trabalho, como o botão principal.
   - A cor e a emoção ficam na **foto do produto**.
4. **A tipografia é a voz.** Título grande, peso leve ou médio (300 a 600) e espaçamento entre letras negativo.
5. **Respiro.** São **96 px entre seções** no desktop e 56 a 64 px no celular.
6. **Profundidade sem sombra.** Use um degrau de cor de fundo e linhas de 1 px. Sombra forte, só no único elemento que flutua.
7. **Raios: uma escola, até 3 valores.** Pílula com cards de 12 a 28 px, **ou** cantos quase retos (0 a 6 px). Não misture.
8. **Um botão preenchido por tela.** Ao lado dele vai um contornado ou um link com seta. Nunca dois preenchidos.
9. **Movimento: primeiro muda a cor, depois a posição.**
   - No máximo 1 movimento contínuo por tela.
   - Sempre respeite o "reduzir movimento" do sistema.
10. **As 4 regras de composição do editor valem no site** (seção própria abaixo).

## Passo a passo

1. **Brief em 3 camadas.** Se faltar uma, o agente chuta.
   - **Produto:** o que precisa existir na tela (conteúdo, provas, ações).
   - **Referência:** como deve parecer.
   - **Restrições:** stack, prazo e o que dá para entregar.

   Fórmula do pedido:
   > "[Tela] para [público] fazer [tarefa]. Use o DESIGN.md para tipografia, papéis de cor e superfícies. Use nosso texto, dados e comportamento reais. Inclua [seções e estados]. Diga quais decisões vieram da referência e quais mudaram."
2. **Escolha o arquétipo e a referência principal** (tabela abaixo e `references/indice-estilos.md`). Abra a página do estilo no navegador e veja o site original.
3. **Trave a referência** ("reference lock") em 6 linhas, antes de codar:
   - Referência principal: [nome e link].
   - Preservar: [3 a 5 traços que tornam a referência reconhecível].
   - Pegar emprestado: [1 ou 2 detalhes das secundárias].
   - Papéis: [qual cor, fonte ou raio serve para quê].
   - Mídia: [foto do produto, screenshot, ilustração ou só tipografia].
   - Rejeitar: [o que não entra].
4. **Escreva o `DESIGN.md`** a partir de `references/modelo-DESIGN.md` (seção "DESIGN.md" abaixo).
5. **Registre as decisões** numa tabela com as colunas Decisão, Fonte, Regra ou papel e Por quê. **Decisão grande sem fonte não entra.**
6. **Implemente nesta ordem:**
   1. tokens (variáveis CSS ou `@theme` do Tailwind v4);
   2. componentes, com todos os estados;
   3. páginas.
7. **Escolha a personalidade de movimento** e anime (`references/movimento-sites.md`, `motion-oficial`, `button-animation`).
8. **Revise:**
   - aplique a checklist do fim deste arquivo;
   - tire prints em 1440 px e 390 px;
   - monte as folhas de quadros das animações.
9. **Entregue:** os prints, mais 3 a 5 linhas dizendo o que veio da referência e o que foi decidido para o produto.

## Escolher o estilo: 5 arquétipos

| Arquétipo | Serve para | Referências (no índice) | Assinatura em números |
|---|---|---|---|
| **Galeria clara** | Produto físico, app de consumo, loja premium | Apple, B&O, Dyson, Sonos, BMW, Tesla, Nike | Fundo quase branco (#f5f5f7) alternado com branco; título de 56 a 96 px com peso 500 a 600; 1 CTA colorido; pílula com cards de 28 px; zero sombra |
| **Palco escuro** | Lançamento, produto "Pro", carro, esporte, tecnologia de ponta | Apple iPhone Pro e Watch, Ferrari, Lamborghini, SpaceX | Fundo #000 ou #111; texto #f5f5f7 (nunca #fff); foto cinematográfica em tela cheia; cor só no produto ou no hover; caixa-alta com +0,08 a +0,10 em no automotivo |
| **Instrumento de precisão** | SaaS, fintech, ferramenta técnica, dashboard | Stripe, Linear, Vercel, Raycast, shadcn/ui | Degraus de cinza; linhas de 0,5 a 1 px; mono nos metadados; raio de 4 a 8 px; 1 cor elétrica numa ação por vista |
| **Editorial** | Conteúdo, revista, cultura, moda, hotelaria | Monocle, Medium, Exhibition, Anthropic | Serifa grande com entrelinha de 0,8 a 1,0; raio 0; linhas finas; links sublinhados. **Cuidado:** fundo creme com serifa e acento terracota virou o "padrão de IA". Só use se o produto for de conteúdo |
| **Estúdio animado** | Agência, portfólio, lançamento com impacto | monopo, OFF+BRAND, Lusion, Active Theory, Framer | A cena 3D ou o vídeo carrega a cor; interface "fantasma" (borda fina, sem sombra); hero que se monta em 1 a 2 s |

**"Tipo Samsung":** o Refero não tem a Samsung. Use a Galeria clara com estes ajustes, medidos em samsung.com por um site de terceiros:
- CTA **preto**, com 20 px de raio e 40 px de altura;
- título em sans geométrica bold (700);
- azul só no hover e no foco;
- botão contornado que inverte no hover;
- foto do card com zoom de 1,05 no hover.

Detalhes em `references/padroes-premium.md`.

**Para o Rotina (app de rotina, mostrado em celular):** o ponto de partida natural é a Galeria clara, com o celular como "produto" e a personalidade de movimento "premium com peso".

## Os números do visual premium (resumo)

As tabelas completas, com as marcas de cada número, estão em `references/padroes-premium.md`.

| Tema | Regra |
|---|---|
| Famílias de fonte | 1 ou 2 (título e texto), mais mono opcional para código e metadados |
| Título do hero (desktop) | **56 a 96 px**, padrão de 64 a 72; editorial até 120. No celular, cerca de 0,55 do tamanho: `clamp(2.5rem, 5vw + 1rem, 4.5rem)` |
| Peso do título | **300 a 600**; nunca 700 ou mais (as exceções são de propósito: Bose 900 condensada, Samsung 700) |
| Entrelinha | Título 0,95 a 1,1 · corpo 1,47 a 1,6 |
| Espaço entre letras | −0,01 em (24 a 28 px) · −0,02 em (32 a 48) · −0,03 em (56 a 64) · −0,04 a −0,06 em (72+) · corpo 0 · CAIXA ALTA de +0,06 a +0,10 em |
| Corpo | 16 a 18 px (Apple usa 17) |
| Largura do texto | 540 a 680 px (60 a 68 caracteres); bloco centralizado de até 980 px |
| Pesos no sistema | 2 ou 3 |
| Cores | 6 a 10 neutros com papel + 1 cor de ação (no máximo 2 cores vivas). Em 22 de 27 sites premium, a interface é praticamente cinza |
| Fundo | Nunca "branco de Word" em tudo: quase branco tingido (#f5f5f7, #fafafa, #fdfcfc) ou quase preto (#000, #08090a) |
| Texto | Quase preto com subtom (#1d1d1f, #171717); no escuro, #f5f5f7 |
| Superfícies | 3 níveis (fundo, superfície, placa), com 2 a 5% de diferença de luz |
| Contraste | Texto principal ≥ 7:1, corpo ≥ 4,5:1, legenda ≥ 3:1. Alguns sites premium ficam abaixo disso; nós não |
| Base de espaço | 4 px |
| Entre seções | 96 px (faixa de 80 a 160; hero com ≥ 160 na Apple); celular de 56 a 64 |
| Gaps | 8 px dentro do grupo, 16 a 24 px entre grupos |
| Padding de card | 24 px (de 16 a 40) |
| Largura máxima | 1200 a 1280 px; imagens em tela cheia até 1440 |
| Margem lateral | 24 px no celular, 48 a 64 px no desktop |
| Sombra | Zero em cards e botões (23 de 27 premium). Se houver, uso "sussurro" (4 a 10% de opacidade) com anel de 1 px |
| Separar seções | Escolha **um** recurso: respiro, faixa de cor alternada ou linha de 1 px |
| Botão | Altura de 36 a 48 px, padding de 8 a 12 × 16 a 24 px, texto de 14 a 17 px com peso 400 a 500, sem sombra e sem gradiente |
| Navegação | 44 a 64 px de altura, até 5 links, CTA à direita, vidro (`backdrop-filter: saturate(180%) blur(20px)`) só depois de rolar |
| Imagem | O produto é o herói: foto isolada em fundo sem emenda, ou cinema em tela cheia. Sem moldura nem sombra. Sem foto real, use um placeholder de proporção fixa, nunca uma imagem falsa feita em CSS |

## Movimento (resumo)

Escolha **uma** personalidade antes de animar. Detalhes e código em `references/movimento-sites.md`.

| Personalidade | Para | Números |
|---|---|---|
| **Utilidade quieta** | App, ferramenta, documento (Linear, Dia, GitHub) | 100 a 200 ms, só cor e opacidade, nada entra animado |
| **Premium com peso** | Produto caro, marca séria (Apple, Vivid+Co, Retool) | Hover em 150 a 250 ms só de cor; seções em 0,5 a 0,75 s com curva sem passar do ponto, como `cubic-bezier(.19,1,.22,1)` ou `(.52,.01,0,1)`; nada de mola |
| **Estúdio cinematográfico** | Agência, lançamento (monopo, Lusion) | Hero de 1 a 1,5 s em camadas; cascata de 75 ms; 3D ou vídeo carregando a cor |
| **Lúdico** | Produto criativo (Jitter, LottieFiles) | O conteúdo anima; a interface fica em 100, 150 e 300 ms |

**Durações por camada** (consenso de 35 sites com seção de movimento):

| Camada | Duração |
|---|---|
| Toque | 100–120 ms |
| Hover e cor | 150–200 ms |
| Estado e componente | 250–450 ms |
| Entrada ao rolar | 600–750 ms |
| Frase do hero | 0,8–1,5 s |
| Atmosfera | 2–9 s |
| Loop ambiente | 27–80 s |

**Regras:**
- Hover de botão muda **cor, não tamanho**. Escala só no toque (0,97).
- Mola que passa do ponto só no objeto de marca (o cubo 3D, o celular), nunca no texto.
- Não anime sombra nem fundos grandes no hover.
- No máximo **1 movimento contínuo por tela**: marquee, gradiente girando ou objeto flutuando.
- Use `MotionConfig reducedMotion="user"` e `@media (prefers-reduced-motion: reduce)`.

## DESIGN.md: como escrever e usar

**O que é:** um arquivo de texto na raiz do projeto, como um "README do visual" para o agente. Ele junta duas coisas:
- **tokens** (valores exatos), para o agente não inventar;
- **papéis** (onde usar e onde **nunca** usar cada valor), para os valores virarem decisões.

**Como criar:**
1. Copie `references/modelo-DESIGN.md` para a raiz do projeto como `DESIGN.md`.
2. Preencha na ordem:
   - estrela-guia (1 linha com uma metáfora visual);
   - tese visual (1 parágrafo);
   - cores, tipografia e espaço;
   - componentes com estados;
   - faça e não faça;
   - superfícies, elevação, imagens e layout;
   - **movimento**, **acessibilidade** e **composição**;
   - guia para o agente, decisões em aberto e início rápido (CSS e Tailwind).
3. Troque cada `[colchete]` por uma **regra observada** ou por uma **decisão de propósito**. O que não souber vai em "Decisões em aberto". Não invente.
4. **Todo valor precisa de um papel.** Hex sem papel não serve.
5. **Faça e não faça sempre com valores exatos.** Exemplo: "use #0a5fd1 só no botão primário, 1 por tela".
6. A seção **Movimento** é obrigatória. Ela diz:
   - a duração de cada camada;
   - 1 ou 2 curvas de assinatura;
   - as propriedades que podem animar;
   - o que nunca anima;
   - qual é o único movimento contínuo.

**Como ligar ao projeto.** No `CLAUDE.md` do projeto:

```markdown
## Visual
Antes de mudar qualquer interface, leia @DESIGN.md.
Use as cores, a tipografia, o espaço e o movimento dele.
Campos, textos, estados e comportamento vêm do projeto, não da referência.
```

**Como tirar dados de uma referência sem quebrar regras:**
- Abra a página do estilo no Refero **no navegador, como pessoa**, e o site original. Escreva o `DESIGN.md` **com as nossas palavras e decisões**. Valores pontuais podem ser anotados, como "a Apple usa 17 px no corpo"; copiar o documento inteiro, não.
- Também dá para medir no próprio site: DevTools, aba Computed.
- **Nunca faça commit de um DESIGN.md baixado do Refero** num repositório. Isso conta como redistribuição. Se o Daniel baixar um pelo botão do site, para consulta, guarde numa pasta ignorada pelo git (por exemplo, `referencias-locais/`, listada no `.gitignore`).
- **Nunca rode robô ou extração automática no Refero.** Para pesquisa automática, use o MCP oficial (pago; seção abaixo).
- **Fontes comerciais** (SF Pro, Söhne, Waldenburg, GT Super e outras) têm licença própria. Use as substitutas livres, como Inter, Inter Tight, Geist, Instrument Serif e EB Garamond, e anote isso no `DESIGN.md`.

**Ao mudar de direção:** mude primeiro o `DESIGN.md`, depois o código.

## Regras de composição do editor aplicadas a sites

As 4 regras do Daniel (detalhe em `skills/video/remotion-video/SKILL.md`) valem também em sites e telas. Em site, ficam assim:

1. **Nada de texto sobre texto, nem logo sobre texto, nem durante o movimento.**
   - **Header fixo:** se for transparente, ganha fundo (vidro com ≥ 80% de opacidade, ou cor sólida) **antes** de o conteúdo passar por baixo. Se não, o menu fica por cima dos títulos.
   - **Texto sobre foto:** só em área lisa da foto, com contraste ≥ 4,5:1. Se não, o texto vai para fora da foto.
   - **Palavra que troca no título** ("rápido / simples / seu"): evite, porque ela brota no lugar (regra 4). Se o Daniel quiser mesmo assim, a velha sai antes de a nova aparecer (`AnimatePresence mode="wait"`) e cada palavra fica parada ≥ 2 s.
   - **Linhas que entram em cascata** não se cruzam no caminho (mola sem passar do ponto, `bounce: 0`).
   - **Marquee de logos** nunca passa atrás de um título. **Legenda de carrossel** nunca fica sobre outra legenda.
2. **Nenhum recorte no meio da tela.**
   - Nada de texto "nascendo" de uma máscara (`overflow: hidden`, `clip-path`, wipe) cuja borda fica invisível no meio da página. Esse é o efeito comum de "linha que sobe de dentro de uma fenda".
   - **Recorte só em borda real:** a borda do botão, do card, da foto, da tela do celular ou da janela do navegador. Exemplo: o texto que "rola" dentro de um botão com fundo visível pode.
   - Blur também corta: deixe espaço em volta do elemento com `filter: blur`. Em SVG, use `filterUnits="userSpaceOnUse"` com região maior que o elemento.
   - Marquee com bordas esfumadas só ocupando a largura toda da janela.
3. **O elemento principal fica por cima do texto.**
   - Camadas: fundo (z 0), depois textos e cards (z 10), depois produto, celular ou modal (z 20).
   - Em repouso, o produto **não cobre** o título.
   - Se o produto passa na frente ao rolar, isso só acontece depois de o título ter ficado inteiro na tela por um tempo de leitura (≥ 1 s de rolagem normal).
4. **O texto entra de um lugar que explique a entrada:**
   - da borda da janela (header de cima, `y: "-100%"`; bloco da esquerda, com `overflow-x: clip` na seção, que é borda real);
   - de trás do produto ou do celular;
   - do gatilho que o abriu (popover nasce do botão).
   - **Ao rolar:** dispare a entrada **quando o elemento encosta na borda de baixo** da janela, para ele "subir junto" com a rolagem. Nunca dispare com ele já no meio da tela.
   - **Na dúvida, o texto do hero já está lá e quem se move é o produto.** Texto parado sempre cumpre a regra.

**Revisão por quadros:**
- Grave ou capture a animação do hero a cada 100 ms (cerca de 3 quadros), em 1440 px e em 390 px.
- Capture também 3 posições de rolagem.
- Monte uma folha de quadros e procure as 4 falhas:
  - texto sobre texto;
  - linha de corte;
  - produto cobrindo texto não lido;
  - texto que brota do nada.
- Se houver Playwright ou o navegador do Claude, use `page.screenshot` em sequência.

## Checklist de qualidade (antes de entregar)

**1. Hierarquia**
- [ ] A mensagem, o estado e a ação principal ficam óbvios em 3 segundos?
- [ ] Há 1 foco por seção?

**2. Consistência**
- [ ] Tudo vem dos tokens do `DESIGN.md`. Procure valores soltos no código (cores em hex, `text-[13px]`, raios aleatórios).
- [ ] Há no máximo 3 raios, 1 cor de ação, 2 famílias e 2 ou 3 pesos?
- [ ] As variáveis têm nome de **papel** (`--color-action`), não de cor (`--blue`)?

**3. Estados e telas reais**
- [ ] Celular em 390 px, com texto do tamanho real.
- [ ] Estados de carregando, vazio, erro, hover, foco, selecionado e desativado.
- [ ] Texto longo e número grande (use `tnum` em preço e métrica).

**4. Anti-barato**
- [ ] Sem 2 CTAs coloridos, sem gradiente em botão e sem selo colorido em todo card.
- [ ] Sem título em 700 ou mais, sem sombra suave genérica e sem cinza #ccc de fundo.

**5. Anti-"cara de IA"** (da skill oficial do Refero, MIT)
- [ ] O acento **não** é índigo ou violeta por padrão.
- [ ] Cards só onde há interação. **Teste do card:** se tirar borda, fundo, sombra e raio não atrapalha, não era card.
- [ ] Não é escuro por padrão. Sem emoji como ícone e sem faixa colorida na lateral do card.
- [ ] Creme com serifa e palavra em itálico só se o produto for editorial.
- [ ] **Teste da identidade:** a primeira tela poderia ser de outra empresa? Então falta o detalhe da marca.
- [ ] **Teste do texto:** apagar 30% do texto melhora? Então apague.
- [ ] Tem **um** detalhe memorável (um movimento, um layout ou uma frase).

**6. Tipografia**
- [ ] `text-wrap: balance` nos títulos.
- [ ] CAIXA ALTA sempre com tracking positivo.
- [ ] Sem palavra sozinha na última linha nos tamanhos principais.

**7. Movimento**
- [ ] Durações por camada; nada de `transition: all`.
- [ ] No máximo 1 loop por tela.
- [ ] Movimento reduzido testado.
- [ ] Nada anima no carregamento sem motivo.

**8. Composição do editor**
- [ ] Folha de quadros revisada; nenhuma das 4 falhas.

**9. Acessibilidade**
- [ ] Contraste conferido.
- [ ] Alvo de toque ≥ 44 × 44 px.
- [ ] Foco visível (anel de 2 px, com 2 px de afastamento).
- [ ] Erro com texto, não só cor.
- [ ] Carrossel automático com botão de pausa.

**10. Rastreabilidade**
- [ ] Toda decisão grande está na tabela de decisões, com fonte.
- [ ] O print está lado a lado com a referência, na mesma largura.

## Caminho oficial do Refero (opcional)

- **Skill oficial `refero-design`:**
  - origem: `referodesign/refero_skill`, versão 1.0.2, licença MIT;
  - é uma metodologia de pesquisa antes de desenhar, com referências de tipografia, cor, movimento, ícones, texto e "anti-AI-slop";
  - funciona **sem conta**.
  - Instalar no Claude Code: `/plugin marketplace add referodesign/refero_skill` e depois `/plugin install refero@refero`. O plugin já traz o MCP.
  - Só a skill: `npx skills add https://github.com/referodesign/refero_skill --skill refero-design`.
  - **Atenção:** a descrição dela se declara a skill "principal" de design e manda preferi-la às outras. Se for instalada aqui, combine com o Daniel qual manda. A sugestão é que esta skill decida o visual e a oficial sirva de método de pesquisa.
- **MCP oficial** (pesquisa ao vivo em mais de 150 mil telas e 6 mil fluxos):
  - Claude Code: `claude mcp add --transport http refero https://api.refero.design/mcp`, depois `/mcp` para entrar.
  - Exige plano **Pro, Team ou Lifetime** (o grátis não tem MCP), com limite de 8.000 chamadas por mês.
  - Ferramentas principais: `refero_search_styles`, `refero_get_style`, `refero_search_screens` e `refero_search_flows`.
  - O token **nunca** vai para o repositório: fica em `/root/.config/`, como as outras chaves.
- **Sem plano:** use o índice desta skill e abra as páginas no navegador.

## Junto com as outras skills

| Skill | Papel |
|---|---|
| `ui-ux-pro-max` | Busca de paletas, pares de fontes e regras por setor. Use depois de escolher o arquétipo, para não "tirar a média" |
| `button-animation` | Estados e animação de botões. Os valores vêm do `DESIGN.md` |
| `motion-oficial` | Como animar (Motion 14 e CSS), curvas, molas e revisão |
| `thumbnail-carousel` | Galerias e vitrines. No premium: sem sombra, anel neutro e botão de pausa |
| `copywriting` e `humanizer` | O texto da página (o teste do texto apaga 30%) |
| `remotion-video` | Vídeo do site ou do app: as mesmas cores e curvas, convertidas em quadros (`references/movimento-sites.md`, última seção) |
