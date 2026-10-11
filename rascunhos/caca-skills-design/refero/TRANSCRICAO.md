# Transcrição: pesquisa no Refero Styles (11/10/2026)

Registro organizado do que os três agentes de pesquisa acharam em https://styles.refero.design. O texto é transcrito com fidelidade, reorganizado por tema.

**Relatórios originais:**
- `premium/RELATORIO-premium.md`: marcas premium, 27 estilos salvos;
- `animacao/RELATORIO-animacao.md`: sites com movimento, 25 estilos salvos e 35 seções de movimento;
- `minimal/RELATORIO-minimal.md`: minimalistas e guias `/ai-agents/`, 20 estilos salvos, a skill oficial e o modelo.

> **Material interno.** Esta transcrição tem resumos por marca e valores pontuais (hex, px). Ela **não contém** cópia dos DESIGN.md do Refero. Os 72 arquivos baixados (64 estilos diferentes) e as páginas brutas ficam **só no scratchpad**: os termos do Refero proíbem redistribuir ou criar "repositório" com eles (seção 2). Antes de salvar esta transcrição em `research_notes/` (o repositório é público), veja a nota do fim.

---

## 1. Como o site funciona

- **Tamanho:** cerca de 1.342 estilos no sitemap e cerca de 50 coleções.
- **Página de cada estilo:** `/style/<uuid>`. As coleções ficam em `/design-styles/<categoria>`, com 24 estilos cada: minimal, ecommerce, dark-mode, editorial, fintech, devtools, ai-startup, agency, productivity, clean-saas e font-pairings. Há ainda guias em `/ai-agents/`, `/design-md/` e `/examples/`.
- **Como o DESIGN.md é entregue:**
  - O HTML da página (250 a 330 KB) já traz o **DESIGN.md "Extended" completo** dentro de `<pre><code>`.
  - O botão "Download" só gera um arquivo no navegador (`generateDesignMd(result, "extended"|"compact")`, no chunk `16z6d4c3-y9-o.js`). **Não existe rota de download.**
  - O JSON `result` vem embutido no payload do Next.js e tem `meta.url`, `raw` (medições, com `colorfulness`) e `designSystem`. Dentro de `designSystem` ficam `northStar`, `colors[{name,hex,role}]`, `typography`, `typeScale`, `spacing`, `components`, `dos`, `donts`, `imagery`, `layout`, `elevationPhilosophy` e `customSections`.
  - As abas Tailwind v4, CSS Variables, Design Tokens (W3C) e Design JSON são geradas no navegador.
- **API interna** (`/api/styles`, `/search`, `/<id>`): responde 403 fora do navegador, tem proteção anti-robô (BotID) e o robots.txt a proíbe.
- **Os arquivos são interpretações automáticas, não guias oficiais.** O próprio arquivo avisa que as medições são normalizadas, os papéis são interpretados e o HTML é reconstruído. Os agentes acharam erros:
  - tracking positivo no display da Apple numa captura;
  - uma "fonte" chamada `object-fit: cover;` no B&O;
  - cards da Apple com 8 px numa captura e 28 px noutra.
- **Movimento:** o extrator mede só valores parados. Movimento aparece apenas quando o Refero escreveu uma seção própria ("Motion Philosophy" e parecidas): **35 de 1.282** estilos com dados válidos têm uma. Cada estilo tem vídeos de prévia em mp4, que não foram baixados.

### 1.1 As 13 seções do DESIGN.md "Extended" (agente minimal)

1. Título, estrela-guia em 1 linha, tema, aviso de método e tese visual.
2. Tokens de cor: tabela com Nome, Valor, Token e Papel.
3. Tipografia: um bloco por família e a escala tipográfica.
4. Espaço e formas: base, escala, raios por elemento, sombras e layout.
5. Componentes: papel e especificação de cada um.
6. Faça e não faça: cerca de 7 regras cada, com valores exatos.
7. Superfícies.
8. Elevação.
9. Imagens.
10. Layout.
11. Guia para o agente: referência rápida de cores e 3 a 5 prompts de componente.
12. Marcas parecidas.
13. Início rápido: CSS `:root` e Tailwind v4 `@theme`.

A variante "Compact" traz o mesmo sem o Início rápido. O modelo mínimo do Refero (`/design-md/design-md-template`) tem só Design direction, Typography, Color roles, Layout e **Open decisions**.

---

## 2. Termos de uso, robots e como a coleta foi feita

### 2.1 Termos

Fonte: https://doc.refero.design/legal/terms-of-use, atualizados em 03/08/2026. Cópias em `minimal/_docs/` e `downloads/legal/`.

- **Permitido (§10, §13):**
  - "lawful design research, inspiration, internal reference, and ordinary product design work";
  - usar **os aprendizados** ("insights") para projetar e construir os próprios produtos, inclusive em trabalho comercial;
  - pôr o conteúdo em moodboards, Figma, apresentações e trabalho para clientes.
- **Proibido (§10, §13, §14):**
  - "resell, redistribute, sublicense";
  - "scraping, crawling, automation, or systematic extraction… outside documented download features";
  - "publish the content as a standalone library or dataset";
  - transformar em "a competing dataset, **repository**, or AI/ML asset";
  - treinar ou avaliar modelos;
  - burlar controles técnicos.
- **Direitos de cópia:** remoção por support@refero.design; há também agente DMCA.

### 2.2 robots.txt

- styles.refero.design bloqueia `/` inteiro para robôs de IA: anthropic-ai, ClaudeBot, Claude-Web, GPTBot, CCBot, PerplexityBot, Google-Extended e outros.
- Para todos os robôs, bloqueia `/api/`, `/admin/`, `/extract/` e `/playground/`.
- O doc.refero.design não bloqueia.

### 2.3 Como cada agente coletou (registro honesto)

| Agente | O que fez |
|---|---|
| **Minimal** | Cerca de 75 requisições ao styles.refero.design e 17 ao doc.refero.design, a menos de 2 por segundo. Extraiu o `<pre><code>` de 22 páginas de estilo e leu 22 guias `/ai-agents/`, 13 `/design-md/` e 4 `/examples/`. Usou um **user-agent genérico** (não o de robô de IA), mesmo com o robots.txt bloqueando robôs de IA. **Isso não deve se repetir.** |
| **Premium** | Cerca de 177 requisições, todas em sequência: 116 páginas no varrimento de títulos, 19 chunks JS lidos como texto, 3 coleções e 27 páginas de estilo. Também fez **4 chamadas à `/api/` antes de ler o robots.txt** (todas deram 403; o agente registrou o erro e não repetiu). **Parou o varrimento em 115 de 1.342** quando leu os termos. Depois disso, não fez nenhuma requisição ao site. |
| **Animação** | **Leu os primeiros 130 KB de todas as 1.342 páginas `/style/`**, uma por vez, com pausa. O material ficou em `downloads/styles-head/`. Portou a função `generateDesignMd` para Python, para gerar os DESIGN.md a partir do JSON. Leu o CSS e o JS de 10 sites originais, sem executar. Não tentou contornar a API. |

**Conclusão:**
- A varredura completa e a extração em lote são o tipo de coleta que os termos proíbem (§10, §14). **Não repetir.**
- O material bruto (`downloads/styles-head/`, `*/_raw/`, `downloads/json/`, `downloads/pages/` e os 72 DESIGN.md) deve ficar fora de qualquer repositório e pode ser apagado ao fim da sessão.
- Para acesso automático, a via oficial é o **Refero MCP** (pago).

---

## 3. Marcas premium (agente premium)

### 3.1 Estilos encontrados e salvos (27)

Arquivos `premium/<slug>-DESIGN.md` e `-tokens.css`.

| Marca | Resumo do agente | Link |
|---|---|---|
| Apple (home) | Fundo #f5f5f7, SF Pro com tracking negativo, um só azul #0071e3 | [aecac5da](https://styles.refero.design/style/aecac5da-f397-4ddf-b71f-de1efc434cb8) |
| Apple España: MacBook Neo | Display de 80 a 96 px, cards de 28 px, cor pastel só no produto | [c9cabb96](https://styles.refero.design/style/c9cabb96-32fa-4896-837a-f2497ce1c856) |
| Apple España: iPad Air | Hero de 80 px peso 600, ≥ 80 px entre seções, um CTA azul por seção | [a48ef430](https://styles.refero.design/style/a48ef430-8c6a-42d8-8c53-ab7bb43cf33b) |
| Apple España: home | Seções quase brancas, par de botões centralizado, nav de vidro | [a4f123f2](https://styles.refero.design/style/a4f123f2-cd4b-4d26-998f-a3d3ee158024) |
| Apple iPhone 18 Pro | Palco #000, display de 96 px peso 600 a −1,44 px, mídia de 28 px | [40be36d7](https://styles.refero.design/style/40be36d7-7fe6-4451-9f2d-7ceccfd43be8) |
| Apple iPhone Duo | Render como evento, controles azuis discretos, cards de 28 px sem sombra | [a73148b9](https://styles.refero.design/style/a73148b9-449b-42cd-9f38-86ef694f500e) |
| Apple Watch Ultra 4 | Baias pretas, verde #00d959 só em métricas | [06ee0fd5](https://styles.refero.design/style/06ee0fd5-c4ab-4d5f-b66a-7285aeacd0b0) |
| Apple Watch Series 12 | Escuro bronze, vermelho e verde só em saúde | [375e255f](https://styles.refero.design/style/375e255f-6e7b-4091-bf73-6df42a094263) |
| Apple AirPods 5 | Filmes em tela cheia, 163 px entre seções | [cfcd001c](https://styles.refero.design/style/cfcd001c-e812-4126-9bdf-1f16b68d182e) |
| Bang & Olufsen | Produto-escultura, uma fonte, ultramarino #060daa só de fundo | [27a4a4fa](https://styles.refero.design/style/27a4a4fa-4b1a-4e7e-b2c3-3e5bf57f00e5) |
| Dyson | Creme #fff8e6, DysonFutura 300, cantos de 2 px, header preto | [96845df2](https://styles.refero.design/style/96845df2-7ddb-420a-814e-c339f95a6554) |
| Sonos | 0% de cor na UI, display de 96 px peso 400, raio de 80 px nos botões | [8d315332](https://styles.refero.design/style/8d315332-6267-4dc0-a14c-e8b49c26b0e1) |
| Bose | Foto de campanha, headline condensada 900, controles de 2 px | [ac53627e](https://styles.refero.design/style/ac53627e-4738-4121-8f5d-05e4d8475a5b) |
| teenage engineering | Fonte peso 100, raio 0, 5 neutros, sem sombra | [aecf9dda](https://styles.refero.design/style/aecf9dda-5cba-4dc7-9e73-59b65d895cdf) |
| Tesla | Blocos de tela cheia, azul #3e6ae1 só no "Order", raios de 4 a 8 px | [7266b546](https://styles.refero.design/style/7266b546-2fb0-465c-acd6-79001c39829a) |
| Rivian | Tipografia de 120 a 360 px, um amarelo #ffac00 | [a5dc5626](https://styles.refero.design/style/a5dc5626-1103-42e3-9edb-a6d52fb9a210) |
| Ferrari | Preto, caixa-alta espaçada, #da291c só no hover e no foco, raio 0 | [80164adf](https://styles.refero.design/style/80164adf-a898-4f7c-bce7-12f3f62e1649) |
| Lamborghini | Caixa-alta a +0,023 em, #ffc000 em 1 elemento por tela, raio 0 | [c9c5be5a](https://styles.refero.design/style/c9c5be5a-aaa1-4338-9681-8378d2e24fbd) |
| BMW | Display de 60 px peso 300, raio 0, sem cor de UI | [b8899cbd](https://styles.refero.design/style/b8899cbd-e2ca-4069-83cf-d8f8b0d71100) |
| SpaceX | #000, D-DIN em caixa-alta a +0,10 em, botões ghost de 1 px | [13b74e34](https://styles.refero.design/style/13b74e34-b824-4d1d-bd2c-bb9bfbc2d6e1) |
| Nike | Futura de 76 px, pílulas de 30 px, produto em tela cheia | [d7ace114](https://styles.refero.design/style/d7ace114-0548-41f5-a2ff-2afbf32be94d) |
| Stripe | sohne-var 300, índigo #533afd, raio de 4 px, sem sombra | [48e5de76](https://styles.refero.design/style/48e5de76-05d5-4c4e-a269-c7c245b291ec) |
| Linear | #08090a, Inter Variable até 590, lima #e4f222 num CTA | [90ce5883](https://styles.refero.design/style/90ce5883-bb24-4466-93f7-801cd617b0d1) |
| Vercel | Geist a −0,06 em, borda com anel duplo, raio de 6 px | [f24daf3a](https://styles.refero.design/style/f24daf3a-d43f-4dec-85a9-8ac1d5148a03) |
| Framer | GT Walsheim 500 a −0,05 em, azul #0099ff em bordas, motion de 0,75 s | [d417b42f](https://styles.refero.design/style/d417b42f-824d-45ba-a02e-cbef3b8ea0d8) |
| Raycast | Coral #ff6363 só na marca, sombras "tecla", nav com blur de 48 px | [3b6a17f0](https://styles.refero.design/style/3b6a17f0-3bdf-418c-a95e-0b89e5a8b2f8) |
| Dia Browser | Serif de 112 px peso 300, pílulas, motion de 0,2 s só em cor | [b458ca1a](https://styles.refero.design/style/b458ca1a-70f0-4f85-b745-f879a4d08457) |

- **Encontradas e não baixadas:** Peloton, Analogue, Sigma Photo, Ssense, Peak Design, Vanmoof, Symbol Audio, Blok, Zoox, Heart Aerospace, 1X NEO e Ableton. Também aparecem nas coleções Zara, FARFETCH, Monocle e Freitag. Listas em `downloads/similar_names.tsv` e `premium_titles.tsv`.
- **Não encontradas:** Samsung, Google/Pixel, Sony, Porsche, Mercedes, Leica, Rolex, Nothing, OnePlus e o navegador Arc (o "Arc" do Refero é a arcboats.com). Ressalva do agente: como a busca é bloqueada e o varrimento parou em 115 páginas, alguma pode existir; os sinais apontam para ausência.

### 3.2 Apple em detalhe (síntese de 9 capturas)

- **Ideia:** "o produto é o design".
- **Cores:**
  - texto #1d1d1f;
  - fundo alternando #fff e #f5f5f7 **no lugar de divisórias**;
  - linhas #d6d6d6 e #d2d2d7;
  - secundário #6e6e73;
  - CTA **#0071e3**, só como fundo de botão;
  - links #0066cc (claro) e #2997ff (escuro), sublinhados só no hover;
  - selo "Novo" #b64400 em texto puro de 12 px com peso 600, no máximo 1 por página;
  - palco escuro #000, #111 e #1d1d1f, com texto #f5f5f7;
  - cores de dado #00d959, #ff3037 e #ffd500, só na narrativa do produto.
- **Tipografia:**
  - SF Pro Display a partir de 21 px e SF Pro Text até 17 px;
  - escala: 12, 14, 17, 21, 28, 40, 48, 56, 64, 80 e 96 px;
  - corpo 17 px, peso 400, entrelinha 1,47, tracking −0,022 em;
  - hero 80 px, peso 600, entrelinha 1,05, tracking −1,2 px; na versão máxima, 96 px a −1,44 px;
  - 600 é o teto;
  - `"numr"` nos números.
- **Formas:**
  - pílula de 980 ou 9999 px;
  - cards e mídia de 28 px (8 px na captura antiga);
  - nav local de 20 px, chips de 36 px.
- **Espaço:**
  - base de 4 px;
  - seções separadas por 80 a 120 px (até 163 px; hero com ≥ 160);
  - texto em bloco de cerca de 980 px; full-bleed até 1440 px.
- **Elevação:** nenhuma sombra. A única é `rgba(0,0,0,.22) 3px 5px 30px`, na imagem do produto.
- **Componentes:**
  - par de CTAs: pílula azul com 17 px peso 400 e padding de 11–12 × 15–22 px, seguida de contornada ou "Saiba mais ›". Nunca 2 preenchidas;
  - nav de 44 px, com texto de 12 px, que vira `saturate(1.8) blur(20px)` ao rolar;
  - sub-nav de produto fixa;
  - hero em pilha centralizada, com render nos 60% de baixo e sem card;
  - controles do carrossel em pílula `rgba(210,210,215,.64)` com raio de 36 px.
- **Movimento:**
  - **registrado:** sublinhado no hover, nav que vira vidro, sub-nav ao rolar, filmes em tela cheia;
  - **inferido pelo agente:** scroll em narrativa, fade com translate de 20 a 40 px, escala sutil, nada de bounce.

### 3.3 Samsung (ausente; fonte de terceiros)

Fonte: oh-my-design.kr, de samsung.com/sec, capturas de 13/07 e 29/09/2026. Não é oficial e não tem licença; não foi salva.

- **Cores:**
  - CTA preto #000;
  - fundo #fff, superfície #f7f7f7;
  - secundário #707070, borda #ddd;
  - azul #006bea só no hover, no toque e no foco da nav; #007aff só nas setas.
- **Tipografia:** Samsung Sharp Sans no display (24 px, peso 700); SamsungOne na UI (14 px peso 700 nos CTAs, 16 px peso 700 na nav, 16 px peso 400 no corpo).
- **Formas:**
  - CTA com raio de 20 px e altura de 40 px, padding de 10 × 24 × 9 px;
  - busca e setas com raio de 40 px;
  - aba com raio 0;
  - sem sombras.
- **Componentes e foco:** contornado que inverte no hover; CTA com sublinhado `::after` de 1 px; tile de 342 px; foco `2px dotted #000`.
- **Movimento:**
  - botão em 0,2 s linear;
  - busca em 0,5 s `cubic-bezier(.35,0,.36,1)`;
  - tile com imagem a `scale(1.05)` e a linha "comprar" de 0 para 1;
  - mega-menu com fade.
- **No Refero, as mais próximas:** Apple, Sonos, Bose e B&O.

### 3.4 Padrões premium (27 estilos)

- **Arquétipos:**
  - **galeria clara:** Apple, B&O, Dyson, Sonos, BMW, TE, Nike, Tesla, Rivian;
  - **palco escuro:** iPhone Pro, Watch, Ferrari, Lamborghini, SpaceX;
  - **instrumento de precisão:** Linear, Vercel, Raycast, Framer e Stripe (claro).
- **Cor:**
  - `colorfulness` < 0,05 em **22 de 27**. Oito ficam em 0 a 0,006. As exceções são Stripe 0,29, Apple 0,12 e Linear 0,11;
  - 1 destaque com 1 trabalho (tabela Apple, Tesla, Rivian, Lamborghini, Linear, Ferrari, Raycast). Nike, BMW, Sonos, SpaceX e TE não têm nenhum;
  - fundos claros #f5f5f7, #fafafa, #f6f8f7, #fff8e6; escuros #000, #08090a, #040506;
  - texto com subtom; no escuro, #f5f5f7 ou #f0f0fa;
  - de 6 a 12 neutros com papel.
- **Tipografia:**
  - display de 56 a 120 px;
  - peso 300 (Stripe, BMW, Dyson, Dia; TE com 100), 400 a 450, 500 a 600; 900 só na Bose;
  - tracking negativo crescendo com o tamanho;
  - automotivo e espacial em caixa-alta positiva;
  - entrelinha de 1,0 a 1,07 no display e de 1,47 a 1,5 no corpo;
  - corpo de 16 a 18 px;
  - 1 família ou 2 com papéis rígidos.
- **Espaço:**
  - 48 a 66 px: Nike, BMW, Dyson, TE, SpaceX;
  - 80 a 96 px: Apple, Sonos, Rivian, Lamborghini, Linear, Stripe, Framer;
  - 96 a 163 px: Vercel, Bose, AirPods;
  - largura de 1200 a 1440 px, texto de 640 a 980 px;
  - separação por troca de fundo.
- **Foto:** o produto é o herói, em "museu" ou "cinema", sem moldura.
- **Botões:**
  - pílula: Apple, Nike, B&O, Rivian, Sonos, Framer, Dia;
  - quina viva: BMW, Ferrari, Lamborghini, TE com 0 px; Dyson e Bose com 2 px; Stripe, Tesla e SpaceX com 4 px;
  - ferramentas dev de 6 a 8 px;
  - nunca 2 preenchidos;
  - nav de 44 a 64 px, com vidro;
  - selos mínimos.
- **Profundidade:**
  - **23 de 27 sem sombra** em cards e botões;
  - degraus de superfície, hairline e anel duplo;
  - exceções: Rivian, Dia, Sonos e Linear;
  - gradiente só em mídia ou atmosfera.
- **Movimento:**
  - "muda de cor, não de posição": Dia em 0,2 s ease, sem scale no hover; Samsung em 0,2 s linear;
  - reveals de 0,75 s no Framer;
  - narrativa em tela cheia (Tesla, Apple);
  - dissolve na SpaceX;
  - `scale(1.05)` em tile;
  - marquee no máximo 1 vez (Dia).

---

## 4. Minimalistas (agente minimal)

### 4.1 Estilos salvos (20)

Arquivos `minimal/<slug>-DESIGN.md`.

| Marca | Resumo do agente | Link |
|---|---|---|
| Anthropic | Anthropic Serif 68 px com Sans, marfim #f0eee6, argila #d97757 só no CTA mais importante, zero sombra, raio de 8 px só embaixo | [d469cba4](https://styles.refero.design/style/d469cba4-c448-4a43-a033-883f8bfcdc42) |
| Apple | Corpo de 17 px a −0,016 em, azul #0071e3 só no botão, pílula de 980 px, cards de 8 px | [aecac5da](https://styles.refero.design/style/aecac5da-f397-4ddf-b71f-de1efc434cb8) |
| Apple (España) | Títulos de 80 a 96 px, faixas #fff e #f5f5f7, raio de 28 px, 100 a 120 px entre seções | [c9cabb96](https://styles.refero.design/style/c9cabb96-32fa-4896-837a-f2497ce1c856) |
| Attio | InterDisplay 600 de 40 a 64 px, Inter 500, cobalto #266df0, raio de 10 px, sombras azuladas de 4 a 10% | [08c8700c](https://styles.refero.design/style/08c8700c-f278-42bc-812e-f60dc6ce996e) |
| Cursor | Títulos em peso 400 com tracking progressivo, raio de 4 px, sem branco ou preto puros, EB Garamond na prosa | [4e3b4717](https://styles.refero.design/style/4e3b4717-84c8-4599-baaf-a343c3d619b6) |
| ElevenLabs | Waldenburg 300 a −0,02 em com Inter 400/500, 97% acromático, pílulas pretas | [031056ff](https://styles.refero.design/style/031056ff-7af1-46db-8daa-115f731c5d26) |
| Exhibition Magazine | DIN 400 de 90 a 100 px com entrelinha de 0,75 a 0,8, Cochin, raio 0, CTAs sublinhados em caixa-alta | [597355de](https://styles.refero.design/style/597355de-6167-4f37-8f14-b3897919a94c) |
| Linear (dark) | Inter Variable até 590, −0,022 em a partir de 48 px, lima #e4f222, raios 6/12/9999, hairlines de 0,5 px | [90ce5883](https://styles.refero.design/style/90ce5883-bb24-4466-93f7-801cd617b0d1) |
| Medium | GT Super de 120 px, entrelinha 0,83, −0,055 em, nenhuma cor de UI | [9c92c3d1](https://styles.refero.design/style/9c92c3d1-a2fe-4a27-a324-826b19501774) |
| Midday | Hedvig Serif de 72 px, sans com tracking positivo, fundo #dbdad7, tudo em pílula | [3f2b79c1](https://styles.refero.design/style/3f2b79c1-d980-4380-a903-29856975fc37) |
| Minimal Collective | 3 cores, PolySans 400 a −0,056 em, 144 a 173 px entre blocos, fotos com raio 0 | [94c15607](https://styles.refero.design/style/94c15607-2f19-4dc4-9aec-2b40f28b754f) |
| Monocle | Plantin, 3 colunas com regras de 1 px, raio 0, amarelo #ffc500 só em Subscribe | [9165ecb1](https://styles.refero.design/style/9165ecb1-f068-4093-8783-1f3c98898b8a) |
| Notion | −0,048 em a 96 px, fundo #f6f5f4, azul #0075de só no CTA, opacidade de 100/95/60/40%, transições de 200 ms | [2bf4c61f](https://styles.refero.design/style/2bf4c61f-de10-4614-ba1b-20c0453bd2a9) |
| Seline Analytics | Roobert 400 e Inter 14 px com entrelinha 1,64, ciano só no CTA, 1 destaque por título | [7967c6d9](https://styles.refero.design/style/7967c6d9-e50c-42b5-b4d1-74003ba41781) |
| shadcn/ui | Geist 600 de 48 px a −0,05 em, monocromático, raio de 18 e 24 px | [0fd67ec5](https://styles.refero.design/style/0fd67ec5-7e9c-4ca9-b368-5d9c7388477a) |
| Steep | Signifier 400, Söhne 430/450/480, pílula preta com ghost, no máximo 1 card pêssego | [75fdb89f](https://styles.refero.design/style/75fdb89f-ca64-41b3-af36-7a78bd09448e) |
| Stripe | sohne-var 300, raio de 4 px, hairline #e5edf5 com 96 px, sem sombra, índigo só nas ações | [48e5de76](https://styles.refero.design/style/48e5de76-05d5-4c4e-a269-c7c245b291ec) |
| Superhuman | Peso 460, vinho #421d24 como único botão, violeta só em links, blur de 12 px ao rolar | [418b374a](https://styles.refero.design/style/418b374a-be64-44f0-b17e-1d45308c7e62) |
| Things | Fonte do sistema, 960/540 px, corpo de 17 a 18 px com entrelinha 1,6, mockups de −4° a +3°, sem botões preenchidos | [ec0f5bca](https://styles.refero.design/style/ec0f5bca-8367-49e7-b8aa-73b3fa09a4a0) |
| Vercel | Geist 400 a 450 a −0,06 em, entrelinha ≤ 1,0, sem cor, raio de 6 px, anéis de 1 px | [f24daf3a](https://styles.refero.design/style/f24daf3a-d43f-4dec-85a9-8ac1d5148a03) |

- **Descartados:** Augen Pro e Cosmos.
- **Citados pelos guias para ver depois:** Krepling, CLOU, Airbnb, Scale, Mobbin, WRITER, Pirsch, Slite, Officevibe, Fable e Family.

### 4.2 Regras medidas nos 20

- **Tipografia:**
  - no máximo 2 famílias (mais mono);
  - hero de 56 a 96 px (mediana de 66);
  - display com peso de 300 a 460, nunca 700 ou mais (13 de 20 usam ≤ 460);
  - entrelinha de 0,95 a 1,1;
  - tracking de −0,01 em (24–28 px), −0,02 em (32–48), −0,03 em (56–64), −0,04 a −0,06 em (72+);
  - corpo de 16 a 17 px com entrelinha de 1,5 a 1,6;
  - texto pequeno com +0,01 a +0,02 em; caixa-alta com +0,06 a +0,08 em;
  - 2 ou 3 pesos;
  - medida de 540 a 680 px.
- **Cor:**
  - 5 a 8 neutros + 1 ação (10 de 20 com ≤ 2 cores vivas; 3 com zero);
  - fundo tingido (13 de 20);
  - texto quase preto (15 de 20);
  - 3 níveis de superfície;
  - 1 botão preenchido (8 em quase preto, 8 na cor da marca);
  - **contraste:** alguns ficam abaixo do AA (Things 3,4:1, Cursor 3,5:1, ciano da Seline 2,65:1, Stone do Notion 4,23:1). Regra proposta: corpo ≥ 4,5:1, legenda ≥ 3:1.
- **Espaço:**
  - base de 4 px (16 de 20);
  - 96 px entre seções (de 80 a 128; extremo de 144 a 173), 56 a 64 px no celular;
  - gap de 8 px (13 de 20);
  - padding de card de 24 px (10 de 20);
  - largura de 1200 px (8 de 20);
  - margem de 24 px no celular e de 48 a 64 px no desktop;
  - 1 foco por seção e 1 recurso de separação.
- **Raios e sombra:**
  - escola precisa de 0 a 6 px (9 de 20) **ou** macia, com pílula e 12 a 28 px (7 de 20);
  - ≤ 3 raios;
  - hairline de 1 px;
  - **9 de 20 com zero sombra**; o resto usa sombra "sussurro" de 4 a 10% com anel.
- **Botões:**
  - 1 primário com padding de 8 a 12 × 16 a 24 px e altura de 36 a 48 px;
  - secundário ghost ao lado;
  - terciário como link com →;
  - transições de 150 ms `cubic-bezier(0.4,0,0.2,1)` (Cursor) e 200 ms (Notion);
  - sublinhado de 0,2 s (Superhuman).
- **Layout:**
  - hero tipográfico, em pilha centralizada ou assimétrico;
  - nav de 44 a 64 px com até 5 links e blur de 12 px ao rolar;
  - imagem com papel definido ou placeholder;
  - **minimalismo não é página vazia.**
- **Alerta da skill oficial:** "calm editorial on autopilot" (creme, serifa, itálico, terracota).

### 4.3 Guias `/ai-agents/` (resumo)

- **3 camadas de contexto:** brief do produto, referência e restrições. "If one is missing, the agent will guess."
- **Fórmula dos briefs:** [tela] para [público] fazer [tarefa], DESIGN.md X para tipo e cores, conteúdo real, [seções e estados], e explicar o que veio da referência.
- **Variações do brief:** landing (prova ao lado da afirmação, um próximo passo), dashboard (estados de carregando, vazio e erro), onboarding, pricing ("marque fatos comerciais que faltam"), settings, minimal ("menos padrões").
- **Checklists:**
  - **qualidade em 3 camadas:** hierarquia, consistência, estados e telas reais, sempre com 1 viewport de celular;
  - **Tailwind:** "utility drift";
  - **CSS:** variáveis nomeadas pelo propósito;
  - **semantic:** papéis por estado;
  - **brand matching:** combinar não é copiar;
  - **Claude Code, Cursor e v0:** typecheck, lint, screenshot e "compliance pass".
- **Trecho para o CLAUDE.md:** "Before changing UI, read @DESIGN.md…"

---

## 5. Sites com animação (agente animação)

### 5.1 Estilos salvos (25) e outros com seção de movimento

Os 25 salvos (links na proposta, `references/indice-estilos.md`):
- **estúdios:** Active Theory, Lusion, monopo saigon, OFF+BRAND, 14islands, OHZI;
- **premium com peso:** Vivid+Co, Dylanbrouwer, Retool;
- **outros:** GSAP, Unicorn Studio, Jitter, LottieFiles, Framer, Linear, GitHub, Modal, ClickUp, Geniestudio, Base44, Antimetal, Origin Financial, mymind, Dia Browser e Slack.

Outros com seção de movimento, em `_indice-movimento.json`:
- Sequel: 0,2 a 0,3 s `(.625,.05,0,1)`, marquee de 45 s;
- Granola: 0,15 e 0,2 s, marquee de 75 s, "blink" de 0,9 s, sem entradas;
- Factory: 0,15 a 0,2 s;
- Lovable: 0,15 s;
- PostHog: flutuação de 3 a 6,7 s;
- Maze: fade-and-rise de 200 ms com 8 a 12 px;
- Chronicle: nunca passa de 0,4 s;
- Warp: 0,4 s `(.44,0,.56,1)`;
- Ramp: 0,3 a 0,4 s;
- Amrit Palace: marquee de 27 s;
- Nakedcityfilms: cortes secos;
- também Julia Krantz, 099 SUPPLY, mono, Relate, Arc e Slush.

### 5.2 Durações por camada (consenso de 35)

| Camada | Duração |
|---|---|
| Toque | 100–120 ms |
| Hover | 150–200 ms |
| Estado | 250–450 ms |
| Entrada ao rolar | 600–750 ms |
| Hero | 0,8–1,5 s |
| Atmosfera | 2–9 s |
| Loop | 27–80 s |

**Stagger:** letras de 30 ms (OFF+BRAND, aleatório) ou 40 ms (14islands); linhas de 75 ms (monopo); blocos de 100 a 175 ms (GSAP).

### 5.3 Curvas

| Curva | Nome | Quem usa |
|---|---|---|
| `(.4,0,.2,1)` | standard | Dia 141× |
| `(.16,1,.3,1)` | expo | GitHub, Geniestudio |
| `(.19,1,.22,1)` | expo | monopo 38×, mymind, Linear |
| `(.22,1,.36,1)` | quint | Base44, Antimetal |
| `(.33,1,.68,1)` | cubic | ClickUp 1.000× |
| `(.165,.84,.44,1)` | quart | Slack 40× |
| `(.25,.46,.45,.94)` | quad | Linear |
| `(.32,.72,0,1)` | iOS sheet | Linear, Dylanbrouwer |
| `(.86,0,.07,1)` | power4.inOut | OFF+BRAND 49× |
| `(.645,.045,.355,1)` | power2.inOut | OFF+BRAND 173× |
| `(.455,.03,.515,.955)` | — | Origin |
| `(.755,.05,.855,.06)` | saída rápida | OFF+BRAND |
| `(.72,0,.12,1)` | — | Retool |
| `(.52,.01,0,1)` | — | Vivid+Co 150× |
| `(.625,.05,0,1)` | — | Sequel |
| `(.35,0,0,1)` / `(.4,0,.1,1)` | — | Lusion |
| `(.17,.4,.02,.99)` | — | Active Theory |
| `(.34,1.56,.64,1)` | back | Modal, só no cubo |

Tabela GSAP → bezier: `power2.out` `[.215,.61,.355,1]`, `power3.out` `[.165,.84,.44,1]`, `power4.out` `[.23,1,.32,1]`, `expo.out` `[.19,1,.22,1]`.

### 5.4 Padrões (A a L)

- **A. Hero coreografado** (monopo): header de `y:-100%` em t = 0,6 s por 1 s; links com stagger de 75 ms vindo de `x:100%`; frases de `y:60%` em t = 0,91 s por 1,2 s. Monta em cerca de 2 s.
- **B. Letras:**
  - OFF+BRAND: `y:-101%` → 0, 1 s, power4.inOut, cada 0,03 em ordem aleatória, com máscara;
  - 14islands: começa em `{opacity:0, skewX:-2, rotate:2, scaleY:.92}`, 0,3 s (opacidade em 0,75 s), atraso de i × 0,04 s.
- **C. Revelação ao rolar:** Maze, GitHub, Antimetal, Base44 e Dylanbrouwer. **Contra-padrão:** Granola, Arc, Relate e Nakedcityfilms proíbem.
- **D. Hover:**
  - cor unificada em 150 a 300 ms;
  - texto que rola (OFF+BRAND, 0,5 s);
  - sublinhado de 150 ms (Maze);
  - botão fantasma por opacidade;
  - peso no lugar de cor;
  - **nunca animar box-shadow, border-color nem fundo grande** (GitHub).
- **E. Cards:** elevação de 0,3 s (Chronicle), sombra de 150 px ou mais (Jitter), sombra da nav ao rolar (Slack), pop-out (mymind).
- **F. Marquee:** 27, 45 e 75 s; velocidade irregular com `linear()` (Geniestudio); ticker 14islands `{loop:3.75, offset:.5, stagger:.04}`.
- **G. Um contínuo por tela:** gradiente cônico (ClickUp), cubo de 80 s (Modal), flutuação de 3 a 6,7 s (PostHog), prisma de 6,65 s, borderTurn (Origin), ponto pulsando, blink.
- **H. Texto:** shimmer coral #e8765e → azul #518dd2 (Retool) e gradiente de espectro (PostHog).
- **I. Diálogo, gaveta e acordeão:** scaleIn de .96 com "bounce" de .98 ao clicar fora; gaveta de 0,5 s `(.32,.72,0,1)`; acordeão por grid-rows em 0,65 s.
- **J. Página:** `document.startViewTransition` (Unicorn); troca por opacidade de 0,8 a 9 s (Active Theory).
- **K. 3D:** Three.js (Lusion, monopo, OFF+BRAND, 14islands), Theatre.js (Active Theory), curtains.js (Unicorn). O 3D tem a cor; a interface é acromática e "fantasma".
- **L. Rolagem e desempenho:** Lenis; locomotive-scroll com `lerp:.1`; `prefers-reduced-motion` em 14islands e OFF+BRAND; benchmark de aparelho na Jitter.

**Bibliotecas:**

| Site | Bibliotecas |
|---|---|
| OFF+BRAND | GSAP, ScrollTrigger, ScrollSmoother, Lenis, Three |
| monopo | GSAP, ScrollTrigger, Three, locomotive |
| 14islands | Framer Motion, Lenis, Three |
| Lusion | Three, SplitText |
| Active Theory | Motor próprio + Theatre |
| Unicorn | curtains + View Transitions + Vue |
| gsap.com | GSAP, ScrollTrigger, SplitText |
| Jitter | Lottie |
| Linear | CSS com tokens (Vaul) |

### 5.5 Receitas do agente (R1 a R12) e conversão para vídeo

- **R1 a R12:**
  - R1 tokens; R2 botão de cor unificada; R3 texto que rola; R4 sublinhado; R5 revelação ao rolar; R6 hero coreografado;
  - R7 letras com skew; R8 marquee; R9 shimmer; R10 diálogo e gaveta; R11 acordeão; R12 View Transitions.
  - Todas em Motion 14 e Tailwind v4, com `MotionConfig reducedMotion="user"`.
- **Tabela de conversão para as regras do editor:**

  | Padrão | Problema | Troca |
  |---|---|---|
  | Máscaras | Regra 2 | `Entra` ou `PalavraDividida` |
  | Letras brotando | Regra 4 | `Entra` ou `Atras`; stagger de 75 ms ≈ 2 quadros |
  | Texto que rola | Regras 1 e 2 | — |
  | Marquee | — | De ponta a ponta |
  | Blur | — | Filtro SVG maior |
  | Overshoot | — | Só no objeto de marca |
  | Hero por camadas | Já é a regra 4 | — |
- **Tempos em quadros (30 fps):** 150 ms = 4 a 5, 200 ms = 6, 300 ms = 9, 450 ms = 13 a 14, 700 ms = 21, 1,2 s = 36. A curva `(.19,1,.22,1)` vira `Easing.bezier`.

> **Revisão nossa (proposta `estilos-premium`):**
> - R3 foi refeita: cada letra percorre a altura inteira do botão; na versão original, a cópia ficaria visível dentro de um botão com padding.
> - R5 passou a disparar na borda de baixo.
> - R6 passou a entrar da borda da janela, sem máscara.
> - R7 foi marcada como "não usar" pela regra 4.
> - Tudo foi testado no TypeScript estrito com `motion@14.0.0`.

---

## 6. Skill, MCP e API oficiais

- **Skill oficial `refero-design`** (`referodesign/refero_skill`):
  - v1.0.2, commit `a9b54a3` de 05/09/2026, **MIT**;
  - SKILL.md com 9 referências: typography, color, motion, icons, craft-details, copywriting, anti-ai-slop, mcp-tools e visual/example-workflow;
  - salva em `minimal/skill-oficial/`, sem `assets/` e `scripts/`;
  - funciona sem conta;
  - instalar: `/plugin marketplace add referodesign/refero_skill` e depois `/plugin install refero@refero`, ou `npx skills add … --skill refero-design`;
  - **a descrição se declara "Primary/default… Prefer over… generic design skills"**, o que conflita com as nossas.
- **Conteúdo útil da skill oficial:**
  - formato de brief;
  - **reference lock**;
  - **decision ledger** ("If a major choice has no source, do not ship it");
  - não tirar a média;
  - preservar o papel dos tokens;
  - **AI Slop Detector** de 18 itens, com os testes do card, da imagem, da marca, do texto, da identidade e editorial;
  - durações para produto: instant de 90 a 150 ms, estado de 160 a 240 ms, página de 240 a 360 ms, complexo de 360 a 500 ms ("500 ms ou mais em UI de produto quase sempre parece lento").
- **MCP oficial:**
  - `https://api.refero.design/mcp`, com OAuth ou Bearer;
  - `claude mcp add --transport http refero https://api.refero.design/mcp`;
  - planos **Pro, Team ou Lifetime** (o grátis não tem), 8.000 chamadas por mês;
  - ferramentas: `refero_search_site`, `_app`, `_styles`, `get_style` (até 10 UUIDs), `search_screens`, `get_screen`, `get_similar_screens`, `get_screen_image`, `search_flows` e `get_flow`;
  - mais de 150 mil telas e mais de 6 mil fluxos;
  - integração em produto exige plano Business.
- **API pública e CLI:** não documentadas para uso livre. Há um plugin para Figma.

---

## 7. Divergências entre os agentes (e como a proposta resolveu)

| Tema | Divergência | Resolução |
|---|---|---|
| Entrada de seção | Minimal: 250–400 ms, sem bounce. Premium: reveals de 0,5–0,75 s. Animação: 600–750 ms. Skill oficial: "500 ms ou mais em UI de produto é lento" | **App ou ferramenta:** até 450 ms. **Página de marketing:** 600 a 750 ms. A personalidade de movimento decide |
| Fundo branco puro | Minimal: "nunca #fff no fundo da página". Premium: a Apple alterna #fff e #f5f5f7 | Evitar #fff **na página inteira**; vale como faixa alternada ou card sobre fundo tingido |
| Cards da Apple | 8 px (captura antiga) contra 28 px (páginas novas) | Anotar a data da referência; padrão atual: 28 px |
| Peso do display | Minimal: 300 a 460. Premium: 300 a 600 (a Apple usa 600) | Faixa de 300 a 600; ≤ 460 para o "sussurro" minimalista |
| Máscaras de texto | Animação: "legítimas na web" | Pelas regras do Daniel (que valem para toda animação), só em borda real |
| Fichas por marca | Premium: sugeria `references/marcas.md` escrito por nós. Coordenador: proibido copiar o Refero | Usamos as **fichas MIT da VoltAgent** e só um índice de 1 linha para o Refero |
| Acento do Linear | Refero: lima #e4f222. VoltAgent: lavanda #5e6ad2 | Capturas de datas diferentes; conferir no site |

---

## 8. Recomendações dos agentes (consolidadas)

As três propostas de "skill nova" foram juntadas na proposta `PROPOSTA-skill-nova/` (nome `estilos-premium`):
- minimal sugeria `design-md`;
- premium sugeria `estilos-premium`, como receitas próprias e sem os DESIGN.md;
- animação sugeria uma seção "Motion Philosophy" obrigatória.

Os itens por skill estão em `PARA-AS-OUTRAS-SKILLS.md`.

---

## 9. Arquivos da pesquisa (scratchpad, uso interno)

- **premium/:** relatório, 27 DESIGN.md e 27 `-tokens.css`. Scripts em `refero/premium-scripts/`.
- **animacao/:** relatório, 25 DESIGN.md, `_indice-movimento.json` (60 estilos), `_raw/` (35 páginas) e `_sites/` (10 sites). Scripts em `scratchpad/anim-scripts/`.
- **minimal/:** relatório, `MODELO-DESIGN.md`, 20 DESIGN.md, `skill-oficial/` (MIT), `_docs/` (termos, MCP, planos), `_txt/`, `_raw/`, `_ai_agents_*.txt` e `_buttons_layout.txt`.
- **downloads/:** `styles-head/` (1.342 cabeçalhos), `json/`, `pages/`, `legal/` e listas `.tsv`.

**Nota sobre salvar no repositório:**
- Esta transcrição pode ir para `research_notes/Refero Styles 2026/` como anotação de pesquisa.
- **Nenhum** dos arquivos das pastas acima vai junto.
- As tabelas por marca (seções 3.1 e 4.1) trazem valores pontuais escritos pelos agentes. Para prudência máxima, publique só as seções 1, 2, 5.2, 5.3, 6 e 7, com os links.
