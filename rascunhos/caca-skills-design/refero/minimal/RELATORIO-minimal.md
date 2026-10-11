# Relatório — Refero Styles: minimalismo premium + guias para agentes de IA

Data: 11/10/2026 · Fonte: https://styles.refero.design (1.342 estilos no sitemap) e https://doc.refero.design (documentação oficial).
Pasta deste relatório: `scratchpad/hunter/refero/minimal/`.

> **Resumo em 5 pontos**
> 1. Salvei **20 DESIGN.md** de sites minimalistas/editoriais premium (Apple, Stripe, Vercel, Linear, Notion, Anthropic, Cursor, ElevenLabs, Monocle, Medium etc.).
> 2. O padrão "premium" se repete com números claros: título 56–96px com peso 300–460 e tracking −0,02 a −0,06em; corpo 16–17px/1,5; 1 cor de ação; 0 ou quase 0 sombra; 96px entre seções; base de 4px.
> 3. O formato DESIGN.md do Refero tem 13 seções fixas. Fiz um **modelo em branco em português** (`MODELO-DESIGN.md`).
> 4. **Existe skill oficial (licença MIT)** e um **MCP oficial (pago)**. A skill foi salva em `skill-oficial/`.
> 5. **Licença:** os DESIGN.md do Refero podem ser usados como referência interna, mas **não podem ser republicados** num repositório ou biblioteca. O robots.txt também bloqueia robôs de IA. Conclusão: os 20 arquivos ficam só no scratchpad. No repositório entram nossas regras próprias, o modelo e a skill MIT.

---

## 1. Como o site entrega o DESIGN.md (rota do download)

- Cada estilo fica em `https://styles.refero.design/style/<uuid>`. Há abas **DESIGN.md / Tailwind v4 / CSS Variables / Design Tokens** e duas variantes, **Compact** e **Extended**, com os botões **Copy** e **Download .md**.
- **Não existe uma rota de download no servidor.** O botão gera o arquivo no navegador com a função `generateDesignMd(result, "extended" | "compact")`, que está no chunk JS `16z6d4c3-y9-o.js`. Eu só li o JS como texto, não o executei. Ela monta o arquivo a partir do JSON do estilo, que vem embutido na página (payload RSC do Next.js). Os formatos de exportação são `design-md` (DESIGN.md), `design-json` (design-system.json), `raw-result`, Tailwind v4, CSS Variables e Design Tokens (estilo W3C, com `$value`/`$type`).
- A página já vem renderizada com o DESIGN.md **Extended** completo dentro de `<pre><code>`. Extraí esse bloco, que é idêntico ao arquivo do botão Download. Não usei a API `/api/styles/<id>` porque o robots.txt a bloqueia (`Disallow: /api/`).
- Cada arquivo salvo começa com um comentário que registra a origem e o aviso de licença.

## 2. Tabela dos estilos minimalistas salvos (20)

Critério: visual caro, muito espaço em branco e tipografia forte. Os estilos vêm das coleções minimal, editorial, clean-saas, productivity e font-pairings, mais alguns citados nos guias. A data é a da captura feita pelo Refero.

| # | Nome | URL Refero | Site original | Resumo (o que o torna premium) | Arquivo |
|---|------|-----------|---------------|-------------------------------|---------|
| 1 | Anthropic | [d469cba4](https://styles.refero.design/style/d469cba4-c448-4a43-a033-883f8bfcdc42) | anthropic.com | Diário de campo em pergaminho: Anthropic Serif 68px/400 com a Sans, canvas marfim `#f0eee6`. Argila `#d97757` aparece só no CTA mais importante. Zero sombra. Botão com raio de 8px só embaixo. | `anthropic-DESIGN.md` |
| 2 | Apple | [aecac5da](https://styles.refero.design/style/aecac5da-f397-4ddf-b71f-de1efc434cb8) | apple.com | "Sala branca com um único interruptor azul". Corpo em 17px com −0,016em. Azul `#0071e3` só no botão preenchido. Pílula de 980px, cards com 8px, nenhuma sombra. | `apple-DESIGN.md` |
| 3 | Apple (España) | [c9cabb96](https://styles.refero.design/style/c9cabb96-32fa-4896-837a-f2497ce1c856) | apple.com/macbook-neo | "Catedral de espaço branco": títulos de 80–96px com −1,44px. Faixas alternam `#fff`/`#f5f5f7` sem divisórias. Raio de 28px e 100–120px entre seções. | `apple-espana-DESIGN.md` |
| 4 | Attio | [08c8700c](https://styles.refero.design/style/08c8700c-f278-42bc-812e-f60dc6ce996e) | attio.com | Editorial arquitetônico: InterDisplay 600 em 40–64px e Inter 500 como voz padrão. Um só cobalto `#266df0`. Raio de 10px e sombras azuladas de 4–10%. | `attio-DESIGN.md` |
| 5 | Cursor | [4e3b4717](https://styles.refero.design/style/4e3b4717-84c8-4599-baaf-a343c3d619b6) | cursor.com | Ateliê em pergaminho: títulos em peso 400 com tracking progressivo (+0,01em → −0,03em). Raio de 4px em tudo, sem branco ou preto puros. EB Garamond na prosa e mono no conteúdo técnico. | `cursor-DESIGN.md` |
| 6 | ElevenLabs | [031056ff](https://styles.refero.design/style/031056ff-7af1-46db-8daa-115f731c5d26) | elevenlabs.io | Caderno Bauhaus em papel casca de ovo: Waldenburg **300** com −0,02em e Inter 400/500. Paleta 97% acromática; as cores ficam só nas ilustrações. Botões pílula pretos. | `elevenlabs-DESIGN.md` |
| 7 | Exhibition Magazine | [597355de](https://styles.refero.design/style/597355de-6167-4f37-8f14-b3897919a94c) | exhibition-magazine.com | Monólito editorial: DIN 400 em 90–100px com line-height 0,75–0,8 e Cochin no corpo. Raio 0 em tudo, só hairlines. Os CTAs são links sublinhados em caixa alta, com 0,062em. | `exhibition-magazine-DESIGN.md` |
| 8 | Linear (dark) | [90ce5883](https://styles.refero.design/style/90ce5883-bb24-4466-93f7-801cd617b0d1) | linear.app | Instrumento de precisão: Inter Variable até o peso 590, −0,022em a partir de 48px. Um único botão lima `#e4f222`. Só 3 raios (6/12/9999) e hairlines de 0,5px. | `linear-DESIGN.md` |
| 9 | Medium | [9c92c3d1](https://styles.refero.design/style/9c92c3d1-a2fe-4a27-a324-826b19501774) | medium.com | Jornal creme: GT Super em 120px, line-height 0,83 e −0,055em. Nenhuma cor na interface. A pílula `#191919` é o único botão. A home funciona como uma capa. | `medium-DESIGN.md` |
| 10 | Midday | [3f2b79c1](https://styles.refero.design/style/3f2b79c1-d980-4380-a903-29856975fc37) | midday.ai | Broadsheet: Hedvig Serif 72px (−0,025em) com Sans de tracking **positivo** (+0,025–0,05em). Canvas `#dbdad7`, tudo em pílula, zero sombra. Verde só nos dados. | `midday-DESIGN.md` |
| 11 | Minimal Collective (dark) | [94c15607](https://styles.refero.design/style/94c15607-2f19-4dc4-9aec-2b40f28b754f) | minimalcollective.digital | Galeria à meia-noite com **3 cores**. Só PolySans 400, com −0,056em a 77px. 144–173px entre blocos. Fotos com raio 0, sobrepostas em 10–30px. | `minimal-collective-DESIGN.md` |
| 12 | Monocle | [9165ecb1](https://styles.refero.design/style/9165ecb1-f068-4093-8783-1f3c98898b8a) | monocle.com | Broadsheet de qualidade: Plantin em todo o conteúdo editorial e grid de 3 colunas com regras de 1px `#d9d9d9`. Raio 0. Amarelo `#ffc500` só no botão Subscribe. | `monocle-DESIGN.md` |
| 13 | Notion | [2bf4c61f](https://styles.refero.design/style/2bf4c61f-de10-4614-ba1b-20c0453bd2a9) | notion.so | Caderno em papel quente: −0,048em a 96px, canvas `#f6f5f4` com cards brancos. Azul `#0075de` só no CTA. Hierarquia de texto pela opacidade (100/95/60/40%). Transições de 200ms. | `notion-DESIGN.md` |
| 14 | Seline Analytics | [7967c6d9](https://styles.refero.design/style/7967c6d9-e50c-42b5-b4d1-74003ba41781) | seline.so | Mesa de analista: títulos em Roobert 400 e corpo em Inter 14px/1,64, canvas `#fafaf9`. Ciano só no CTA e no máximo **1 destaque por título**. | `seline-analytics-DESIGN.md` |
| 15 | Ui (shadcn/ui) | [0fd67ec5](https://styles.refero.design/style/0fd67ec5-7e9c-4ca9-b368-5d9c7388477a) | ui.shadcn.com | Planta clínica: Geist 600 em 48px com −0,05em. Monocromático (vermelho só para erro). Raio de 18px nos elementos interativos e 24px nos cards. Sombra de 1px + 2px. | `shadcn-ui-DESIGN.md` |
| 16 | Steep | [75fdb89f](https://styles.refero.design/style/75fdb89f-ca64-41b3-af36-7a78bd09448e) | steep.app | Analytics com serifa: Signifier 400 em 44/64/90px e Söhne com pesos intermediários (430/450/480). Pílula preta com ghost ao lado. No máximo 1 card pêssego por página. | `steep-DESIGN.md` |
| 17 | Stripe | [48e5de76](https://styles.refero.design/style/48e5de76-05d5-4c4e-a269-c7c245b291ec) | stripe.com | Livro-razão: sohne-var **300** em tudo, raio de 4px. Seções separadas por hairline `#e5edf5` e 96px. Sem sombras. Índigo só nas ações. "A tipografia é o hero." | `stripe-DESIGN.md` |
| 18 | Superhuman | [418b374a](https://styles.refero.design/style/418b374a-be64-44f0-b17e-1d45308c7e62) | superhuman.com | Editorial na hora dourada: peso **460** nos títulos. Vinho `#421d24` é a única cor de botão e o violeta fica só nos links. Canvas `#f2f0eb`. Blur de 12px no header ao rolar. | `superhuman-DESIGN.md` |
| 19 | Things | [ec0f5bca](https://styles.refero.design/style/ec0f5bca-8367-49e7-b8aa-73b3fa09a4a0) | culturedcode.com/things | "Keynote da Apple a meio volume": fonte do sistema, coluna de 960px e texto de 540px, corpo em 17–18px/1,6. Mockups inclinados de −4° a +3°. Sem botões preenchidos. | `things-DESIGN.md` |
| 20 | Vercel | [f24daf3a](https://styles.refero.design/style/f24daf3a-d43f-4dec-85a9-8ac1d5148a03) | vercel.com | Terminal tipografado: Geist 400–450 com −0,06em em 56–64px e line-height ≤ 1,0. Nenhuma cor (só o verde de sucesso). Raio de 6px. Profundidade só com anéis de 1px. | `vercel-DESIGN.md` |

Também baixei, mas descartei para ficar em 20: Augen Pro e Cosmos. As páginas brutas estão em `_raw/styles/`.
Outros estilos citados pelos guias que valem uma consulta futura: Krepling ("Quiet white atelier"), CLOU architects ("ink on cream paper"), Airbnb ("Quiet white gallery wall"), Scale ("Museum-quality darkroom gallery"), Mobbin, WRITER, Pirsch, Slite, Officevibe, Fable e Family.

## 3. Regras concretas do "minimalismo premium" (medidas nos 20 estilos)

Os números abaixo são medidos (contagens, medianas e faixas) nos 20 DESIGN.md. Use-os como padrão quando o projeto não tiver referência própria.

### 3.1 Tipografia
| Item | Regra | Evidência |
|------|-------|-----------|
| Famílias | **2 no máximo** (display + texto). Uma terceira, mono, só para código e metadados. | Cerca de metade usa uma família principal só, às vezes com mono (Apple, Linear, Stripe, Vercel, shadcn, Things, Superhuman, Minimal Collective). Uns 7 combinam serifa e sans (Anthropic, Medium, Midday, Monocle, Steep, Exhibition e, nos detalhes, Cursor). |
| Título do hero (desktop) | **56–96px**, com padrão de **64–72px** (mediana de 66px). Editorial extremo chega a 100–120px. | Faixa de 36–120px. |
| Peso do display | **300–460** é o "sussurro" premium; **nunca 700+**. | 13 de 20 usam ≤ 460 (ElevenLabs 300, Stripe 300, Cursor/Steep/Medium/Midday 400, Superhuman 460). Linear tem teto de 590. |
| Line-height do display | **0,95–1,1** (editorial: 0,75–0,9). | Vercel ≤ 1,0; Medium 0,83; Exhibition 0,75–0,8; Steep 1,3 é exceção. |
| Tracking do display | Mais negativo quanto maior a letra: **−0,01em a 24–28px · −0,02em a 32–48px · −0,03em a 56–64px · −0,04 a −0,06em a 72px+**. | Cursor: +0,01 (14px) → −0,03em (72px). Stripe: −0,01 → −0,03em. Notion −0,048em a 96px; Vercel −0,06em a 64px; Medium −0,055em a 120px. |
| Corpo | **16–17px**, line-height **1,5–1,6**, tracking **0**. Leitura longa: 17–20px. | Apple 17px/1,47; Things 17–18px/1,6; Linear 16/1,5; Anthropic usa serifa de 20px no corpo. |
| Texto pequeno (11–13px) | Tracking **+0,01 a +0,02em**. | ElevenLabs +0,01em em 14–16px; Midday +0,05em em 10–14px. |
| Rótulos em CAIXA ALTA | 11–13px, peso 500, tracking **+0,06 a +0,08em**. | Exhibition 0,062em; Monocle 0,05–0,075em; Vercel (mono) 0,071em. |
| Pesos | **2–3 no sistema todo** (ex.: 400 corpo, 500 botão, 300/400 display). | Stripe usa só 300/400; Minimal Collective usa só 400. |
| Medida (largura do texto) | Parágrafo com **540–680px (60–68ch)**. Bloco de texto centralizado com até ~980px. | Things 540px; Apple ~980px nos blocos de texto. |

### 3.2 Cor
| Item | Regra | Evidência |
|------|-------|-----------|
| Quantidade | **5–8 neutros + 1 cor de ação (no máximo 2 cores com cor)**. Cada cor tem **um único papel**. | 10 de 20 têm ≤ 2 cores cromáticas; 3 têm **zero** (Exhibition, Medium, Minimal Collective). "97% acromático" aparece em vários. |
| Canvas | Off-white levemente tingido, **não `#ffffff` puro**: `#fdfcfc`, `#faf9f5`, `#f7f7f4`, `#f6f5f4`, `#fafaf9`, `#f5f5f7`, `#f2f0eb`. Cards brancos ficam por cima. | 13 de 20 usam canvas tingido. Notion, Seline e Superhuman proíbem explicitamente branco no fundo da página. |
| Texto | Quase preto, **não `#000`**: `#171717`, `#141413`, `#1d1d1f`, `#26251e`, `#292827`, `#17191c`. | 15 de 20 evitam o preto puro. |
| Camadas de superfície | **3 níveis** (canvas → superfície → placa/borda), com 2–5% de diferença de luminosidade. | ElevenLabs `#fdfcfc → #f5f3f1 → #ebe8e4`; shadcn `#f5f5f7 → #fafafa → #fff`. |
| Ação | **1 botão preenchido por tela**, em quase preto (8 dos 20) ou na cor da marca (8 dos 20). | Apple, Notion, Seline, Linear e Stripe: "uma cor, um trabalho". |
| Contraste | Texto principal com 14–20:1. Os premium deixam o cinza secundário no limite (4,2–5,5:1) e alguns ficam abaixo: Things 3,4:1, Cursor 3,5:1, CTA ciano da Seline 2,65:1. **Nossa regra: corpo ≥ 4,5:1, legenda ≥ 3:1, nunca menos.** | Calculei no WCAG: ElevenLabs Smoke 4,71; Stripe Slate 4,75; Vercel `#666` 5,5; Notion Stone 4,23 (abaixo do AA). |
| Proibidos | Gradiente em UI, glow e segunda cor de acento "por enfeite". Índigo/violeta só se for a marca. | Do/Don't de 18 dos 20 arquivos e o anti-AI-slop da skill oficial. |

### 3.3 Espaço e grid
| Item | Regra | Evidência |
|------|-------|-----------|
| Unidade base | **4px**. | 16 de 20 (Medium e Stripe usam 8px). |
| Respiro entre seções | **96px** como padrão no desktop (faixa de 80–128px); **56–64px** no mobile. Minimalismo extremo: 144–173px. | Mediana entre 80 e 96px. Vercel 96–128; Apple ES 100–120; Minimal Collective 144–173. |
| Gap entre elementos | **8px** dentro do grupo; **16–24px** entre grupos. | 13 de 20 usam 8px. |
| Padding de card | **24px** (faixa de 16–32px). | 10 de 20 usam exatamente 24px. |
| Largura máxima | **1200px** (faixa de 1200–1320px); 1440px para SaaS com muitas telas; 960px para produto focado. | 8 de 20 usam 1200; 4 usam 1280. |
| Margem lateral | 24px no mobile; 48–64px no desktop. | ElevenLabs 64px; Vercel 24–48px; Cursor 24px. |
| Ritmo | **1 foco visual por seção**. Nada de grade de 3 cards "por padrão". Separe as seções com **um** recurso só: respiro, faixa de cor alternada ou hairline de 1px. | Linear: "nunca 3 colunas de cards"; Apple ES: "sem divisórias, alterna o canvas"; Stripe: "hairline + 96px, sem mudar o fundo". |

### 3.4 Raios, bordas e sombras
- **Escolha uma de duas escolas e não misture:**
  - **Precisa:** botões e cards com **0–6px** (Stripe 4, Cursor 4, Vercel 6, Linear 6/12, Monocle/Exhibition 0). São 9 de 20.
  - **Macia:** botões em **pílula (9999px)** e cards de **12–28px** (Apple, ElevenLabs, Steep, Seline, Midday, Medium). São 7 de 20.
- **No máximo 3 valores de raio** no sistema todo, como o Linear: 6 / 12 / 9999.
- **Bordas:** hairline de **1px** (às vezes 0,5px) em `#e5e5e5`, `#ebe8e4` ou `rgba(0,0,0,0.08)`. É o principal separador.
- **Sombras:** **9 de 20 têm zero sombra.** As outras usam sombra "sussurro", com **opacidade de 4–10%** combinada com um anel de 1px. Exemplo (ElevenLabs): `0 0 1px rgba(0,0,0,.4), 0 1px 1px rgba(0,0,0,.04), 0 2px 4px rgba(0,0,0,.04)`. Exemplo (Vercel): `0 0 0 1px rgba(0,0,0,.08), 0 0 0 2px #fafafa`. Sombra forte só no **único** elemento flutuante (mockup ou menu).

### 3.5 Botões (hierarquia premium)
1. **Primário:** 1 por tela. Preenchido (quase preto ou cor da marca), texto de 14–17px com peso 400–500, padding de **8–12px × 16–24px** e altura de **36–48px**. Sem sombra e sem gradiente.
2. **Secundário:** ghost/outline com borda de 1px na cor da hairline. Mesmo raio e mesma altura do primário, sempre **ao lado** dele.
3. **Terciário:** link de texto com **seta →** no fim ou sublinhado. No estilo editorial, o sublinhado fica sempre visível (Anthropic, Exhibition).
- Assinaturas que valem copiar como **ideia**, não como cópia: o raio só embaixo da Anthropic, o botão play circular do Things e o CTA do rodapé da Exhibition, que é um link sublinhado de 52px.
- Transições: **150ms `cubic-bezier(0.4,0,0.2,1)`** (Cursor) e **200ms ease** (Notion). O sublinhado do link aparece no hover em 0,2s (Superhuman).

### 3.6 Layout de página
- Escolha um modelo de hero:
  - "**a tipografia é o hero**" (Stripe, Vercel);
  - **pilha centralizada** com título, frase, 2 botões e imagem do produto (Apple, Midday, Things);
  - **assimétrico à esquerda** (ElevenLabs, Linear, Medium).
- A navegação é transparente, com **44–64px** de altura e até 5 links. O CTA fica à direita, sem mega-menu. Header com `backdrop-filter: blur(12px)` e borda de 1px só depois de rolar a página.
- A imagem tem papel definido: screenshot real do produto, foto em tela cheia ou nenhuma. Se a imagem faltar, use um placeholder com proporção fixa, nunca uma "foto falsa" feita em CSS.
- Minimalismo **não é página vazia**. O guia minimal-websites do Refero diz: *"Minimal design fails when it removes the proof, context, or actions users need."*

### 3.7 Faça / não faça (síntese dos 20)
**Faça:**
- defina papéis antes dos valores;
- use 1 acento com 1 papel;
- separe display e texto (peso e tracking opostos);
- use hairlines em vez de sombras;
- use 96px entre seções;
- limite os tipos de componente (o guia minimal pede "fewer patterns": menos estilos de seção, de card e de botão);
- use números tabulares (`tnum`) em preços e métricas;
- use `text-wrap: balance` nos títulos.

**Não faça:**
- negrito 700 no display;
- segunda cor de destaque;
- gradientes ou glow em superfícies;
- sombras pesadas;
- branco puro no canvas ou preto puro no texto (salvo escolha deliberada);
- raio "médio" misturado com pílula;
- corpo centralizado com mais de 2 linhas;
- grade de cards sem interação.

### 3.8 Alerta importante (da skill oficial, `anti-ai-slop.md`)
O combo **creme + serifa grande + 1 palavra em itálico + acento terracota/oliva** virou o novo padrão de IA ("calm editorial on autopilot"). Use-o só quando o produto for editorial, cultural, de hospitalidade ou de moda, e quando a referência justificar. Em ferramenta técnica ou fintech, prefira a escola precisa (Stripe, Vercel, Linear).

## 4. O formato DESIGN.md explicado

### 4.1 O que é
Segundo o Refero, o formato foi popularizado pelo **Google Stitch**. É um "README do design system para agentes": texto puro, versionável e guardado junto do código. Junta **duas camadas**:
- **tokens** (valores exatos), que impedem o agente de inventar valores;
- **prosa** (quando e por que usar cada valor), que transforma valores em decisões.

O Refero avisa que os arquivos dele são **gerados pelo Refero** a partir dos sites e **não são guias oficiais das marcas**. Os exemplos em HTML do arquivo são reconstruções.

### 4.2 Seções do DESIGN.md Extended do Refero (presentes nos 20 arquivos, nesta ordem)
1. `# <Nome> — Style Reference`, seguido de `> estrela-guia` (uma metáfora de 1 linha), `**Theme:** light|dark`, um aviso de método e **1 parágrafo de tese visual**.
2. `## Tokens — Colors`: tabela **Name | Value | Token | Role**. O papel é obrigatório.
3. `## Tokens — Typography`: um bloco `### Família — papel · --font-x` com Substitute, Weights, Sizes, Line height, Letter spacing, OpenType features e Role. Depois, `### Type Scale` (Role | Family | Weight | Size | Line Height | Letter Spacing | Token).
4. `## Tokens — Spacing & Shapes`: Base unit e Density; `### Spacing Scale`; `### Border Radius` (por elemento); `### Shadows` (11 dos 20); `### Layout` (max-width, section gap, card padding, element gap).
5. `## Components`: um `### Nome` por componente, com `**Role:**` e um parágrafo de especificação (fundo, texto, raio, padding, fonte e estados).
6. `## Do's and Don'ts`: `### Do` e `### Don't`, cerca de 7 regras cada, **sempre com valores exatos**.
7. `## Surfaces`: tabela Level | Name | Value | Purpose.
8. `## Elevation`: sombras nomeadas e quando usar (17 dos 20).
9. `## Imagery`: o papel de foto, screenshot ou ilustração.
10. `## Layout`: modelo de página, hero, ritmo de seções e navegação.
11. `## Agent Prompt Guide`: **Quick Color Reference** e **3–5 Example Component Prompts**, com prompts prontos e todos os valores. Às vezes vêm seções extras, como "Typography Philosophy" ou "Highlight Span Pattern".
12. `## Similar Brands` (19 dos 20).
13. `## Quick Start`: `### CSS Custom Properties` (`:root { ... }`) e `### Tailwind v4` (`@theme { ... }`).

A variante **Compact** traz as mesmas ideias sem o prefixo "Tokens —" e sem o Quick Start: Colors, Typography, Spacing & Layout, Border Radius, Components, Do's/Don'ts, Elevation, Surfaces, Imagery, Layout e Similar Brands.

### 4.3 Modelo mínimo do Refero (página /design-md/design-md-template)
`Design direction` (Reference: URL + data; Purpose: público e tarefa) → `Typography` (Display e Body: família, peso, tamanho, line-height, uso e largura de leitura) → `Color roles` (Canvas/surfaces; Text/actions com contraste) → `Layout` (Content width; Spacing rhythm, só gaps repetidos) → **`Open decisions`** (o que a referência não diz sobre o seu produto).
Regra de ouro do guia: *"replace each bracket with an observed rule or a deliberate project choice. Leave unknowns explicit."*

### 4.4 Nosso modelo em branco (pronto para usar)
Arquivo: **`MODELO-DESIGN.md`**, nesta pasta. Ele segue a ordem das 13 seções do Extended, com títulos em português e o nome original entre parênteses. Também acrescenta o que faltava para os nossos projetos:
- **Decisões em aberto**, vinda do modelo mínimo;
- **Movimento**, que aponta para `motion-oficial` e `button-animation`;
- **Acessibilidade** (contraste, alvo de 44px, foco);
- os estados de cada componente;
- o trecho para importar no `CLAUDE.md`.

Esqueleto resumido:

```markdown
# [Projeto] — DESIGN.md
> [estrela-guia em 1 linha]
**Tema:** light · **Referência:** [URL + data] · **Público e tarefa:** [...]
[tese visual em 1 parágrafo]
## Tokens — Cores            (Nome | Valor | Token | Papel: onde usar / onde nunca usar)
## Tokens — Tipografia       (display, texto, mono + escala tipográfica + largura de leitura)
## Tokens — Espaço e formas  (base 4px, escala, ≤ 3 raios, sombras, layout)
## Componentes               (primário, secundário, link, card, input, nav — com estados)
## Faça e não faça
## Superfícies · ## Elevação · ## Imagens · ## Layout (página)
## Movimento · ## Acessibilidade
## Guia para o agente        (referência rápida de cores + 3–5 prompts de componente)
## Marcas parecidas · ## Decisões em aberto
## Início rápido             (CSS :root + Tailwind v4 @theme)
```

Como ligar o arquivo ao projeto. O Refero recomenda este trecho, e o Claude Code aceita `@arquivo` no CLAUDE.md:

```markdown
# Project design context
Before changing UI, read @DESIGN.md.
Use its colors, typography, and spacing as visual references.
Derive fields, copy, states, and behavior from this project.
```

## 5. Prompts e checklists das páginas /ai-agents/ (resumidos)

Li 22 páginas `/ai-agents/`, 13 `/design-md/`, 4 `/examples/` e as coleções. O texto limpo está em `_ai_agents_compact.txt` e `_txt/`. Essas páginas são guias curtos (cerca de 120 linhas cada), não uma skill. O que dá para reaproveitar:

### 5.1 Princípio central: 3 camadas de contexto (design-context)
- **Brief do produto:** o que precisa existir.
- **Referência de design:** como deve parecer.
- **Restrições de implementação:** o que dá para entregar.

*"If one is missing, the agent will guess."* Palavras como "premium, clean, modern" não substituem um sistema visual real.

### 5.2 Briefs prontos (com colchetes para preencher)
Todos seguem a mesma fórmula, que vale como template:
1. **[tela] para [público] fazer [tarefa]**;
2. **use o DESIGN.md X para tipografia, papéis de cor e superfícies**;
3. **use nosso conteúdo, dados e comportamento reais**;
4. **inclua [seções e estados]**;
5. **explique quais decisões vieram da referência e o que mudou**.

- **Genérico (design-prompts):** *"Design [screen] for [audience] so they can [specific job]. Use the linked [X] DESIGN.md for its captured type and color roles. Use our real copy, content, and product behavior; the reference does not define them. Include [required sections and states]. Explain which visual decisions came from the reference and which you changed for this task."*
- **Landing (referência Webflow):** coloque um recorte real de [feature] **ao lado da afirmação que ele prova**, mais [evidência] e **um único próximo passo**. Se a imagem for conceito, rotule como conceito.
- **Dashboard (referência Steep):** *"…used by [role]. The main job is [decision or action]… Use our actual metric names and data. Include [filters and actions]. Show loading, empty, and error states…"*
- **Onboarding (referência Harvest):** peça só os campos que a etapa precisa. Mostre progresso, validação, a política de voltar/pular e o que acontece depois.
- **Pricing (referência Stripe):** compare planos, ciclo de cobrança, uso incluído, excedente e cancelamento num só caminho de leitura. *"Mark any missing commercial fact for confirmation instead of inventing it."*
- **Settings (referência Quizlet):** separe preferências do dia a dia das mudanças de conta e de risco. Mostre os valores atuais, como salvar, limites de acesso e confirmação ou desfazer.
- **Minimal (minimal-websites):**
  1. diga o que **tem que ficar** (conteúdo, ações, provas, navegação) antes de pedir para simplificar;
  2. escolha uma referência de tipografia forte;
  3. peça **menos padrões** (menos tratamentos de seção, de card e de botão).

### 5.3 Checklists de qualidade
- **Agentic UI Quality Checklist**, revisão em 3 camadas:
  1. **Hierarquia primeiro:** a mensagem, o estado e a ação principais estão óbvios?
  2. **Consistência do sistema:** escala tipográfica, papéis de cor, ritmo de espaço, peso dos componentes e padrões repetidos.
  3. **Estados e telas reais:** mobile, loading, vazio, erro, hover, selecionado, desabilitado e conteúdo longo.

  Inclua sempre pelo menos 1 viewport mobile com textos de tamanho real. Compare com o estilo escolhido em vez de pedir "make it better".
- **Tailwind tokens:** procure "utility drift", ou seja, valores arbitrários repetidos, cores de texto inconsistentes, raios aleatórios e sombras sem relação. Exija lógica de tokens reutilizável.
- **CSS variables:** nomeie pelo **propósito** (background, surface, border, muted, accent, danger, radius, shadow), não pela cor. Depois de gerar, procure exceções escritas direto no código (hardcoded).
- **Semantic design systems:** papéis para normal, hover, focus, disabled e error em botões, forms, cards, alerts e nav. Revise se os papéis foram respeitados.
- **Brand matching:** nomeie a referência, separe "combinar" de "copiar" e revise o resultado. O encaixe com a marca mora nos detalhes: peso do label, tom da borda, tamanho do ícone, raio e espaço.
- **Claude Code / Cursor / v0:** aponte os componentes existentes. Diga quais partes do DESIGN.md importam e quais cedem ao sistema local. Peça typecheck, lint, revisão responsiva, screenshot e um **"design-system compliance pass"** no final.

### 5.4 Da skill oficial (MIT, pode ser copiado com a licença)
- **Formato de brief:** `Designing [WHAT] for [WHO] on [PLATFORM]. Goal… Tone… Main objection… Must remember… Constraints… Research needed… Path…`
- **Reference lock**, antes de codar: `Primary reference / Preserve (3–5 traços) / Borrow only (1–2 detalhes) / Role rules / Media strategy / Reject / Token commitments`.
- **Decision ledger:** tabela `Decision | Source | Source rule/role | Why`. *"If a major choice has no source, do not ship it."*
- **Não tire a média das referências.** Escolha 1 direção principal e use as secundárias só para detalhes pontuais.
- **Preserve o papel dos tokens.** Cor de CTA fica só no CTA; cor de código fica só no código.
- **AI Slop Detector:** checklist de 18 itens, com o "teste do card", o "teste da imagem", o "teste da identidade" e o "teste editorial" (se a hero parecer de uma cafeteria trocando só o logo, está genérica).

## 6. Skill, MCP, API e CLI oficiais

| Item | Existe? | Detalhes |
|------|---------|----------|
| **Skill oficial** | **Sim** | `referodesign/refero_skill`, versão 1.0.2, commit `a9b54a3` de 05/09/2026, **licença MIT** ("Copyright (c) 2026 Refero"). A skill `refero-design` tem o SKILL.md e 9 referências: typography, color, motion, icons, craft-details, copywriting, anti-ai-slop, mcp-tools e visual/example-workflow. **Salva em `skill-oficial/`** com LICENSE, README, manifestos e ORIGEM.txt. Funciona **sem conta** como metodologia; a pesquisa ao vivo precisa do MCP. |
| Instalar a skill | — | Claude Code: `/plugin marketplace add referodesign/refero_skill` e depois `/plugin install refero@refero` (vem com o MCP). Só a skill: `npx skills add https://github.com/referodesign/refero_skill --skill refero-design`, ou copiar a pasta `skills/refero-design/` para `~/.claude/skills/refero-design/`. Também há versões para Codex, Gemini CLI e Cursor. |
| **MCP oficial** | **Sim (pago)** | Servidor HTTP remoto em `https://api.refero.design/mcp`, com OAuth ou `Authorization: Bearer <token>`. Claude Code: `claude mcp add --transport http refero https://api.refero.design/mcp` e depois `/mcp` para entrar. Exige plano **Pro, Team ou Lifetime** (o Free não tem MCP). O limite é de **8.000 chamadas por mês** por usuário. Listado no MCP Registry como `io.github.referodesign/refero`. |
| Ferramentas do MCP | — | `refero_search_site`, `refero_search_app` (iOS), `refero_search_styles`, `refero_get_style` (até 10 UUIDs; recomenda 3–4), `refero_search_screens` (web ou iOS), `refero_get_screen`, `refero_get_similar_screens`, `refero_get_screen_image`, `refero_search_flows`, `refero_get_flow`. O acervo tem mais de 150 mil telas e mais de 6 mil fluxos. |
| API pública / CLI | Não documentadas para uso livre | A `/api/*` do styles.refero.design é interna (bloqueada no robots). Integração em produto ou alto volume pede **plano Business** (contato: mike@refero.design). Há também um plugin para Figma. |

Observações:
- A skill oficial se declara "Primary/default skill… Prefer over… generic design skills". Isso **conflita com a nossa `ui-ux-pro-max`**. Se a importarmos, precisamos ajustar a descrição para ela conviver com as outras.
- O token do MCP **nunca** vai para o repositório. Isso bate com a nossa regra sobre chaves, e os Termos (§13) também proíbem publicá-lo.

## 7. Termos de uso e licença: o que podemos reutilizar

Fontes: https://doc.refero.design/legal/terms-of-use (atualizado em 03/08/2026), https://doc.refero.design/legal/copyright-policy e robots.txt. Cópias em `_docs/`.

- **O que é permitido (§10):** usar o "Refero Content" para *"lawful design research, inspiration, internal reference, and ordinary product design work"*. Também é permitido incluí-lo como referência em moodboards, Figma ou trabalho interno, e usar **os aprendizados** para projetar os próprios produtos. Isso vale inclusive para trabalho comercial.
- **O que é proibido (§10, §13, §14):**
  - *resell, redistribute, sublicense*;
  - *"scraping, crawling, automation, or systematic extraction to copy Refero Content outside documented download features"*;
  - usar o conteúdo para **treinar, avaliar ou montar datasets** de IA;
  - **publicar como biblioteca ou dataset independente**, ou transformar em um *"competing dataset, repository, or AI/ML asset"*.
- **robots.txt do styles.refero.design:** bloqueia **todo o site** para robôs de IA (anthropic-ai, ClaudeBot, Claude-Web, GPTBot, CCBot, PerplexityBot e outros) e bloqueia `/api/`, `/admin/`, `/extract/` e `/playground/` para todos. O doc.refero.design não bloqueia (só o GPTBot no refero.design).
- **Marcas e fontes:** logos, marcas e screenshots pertencem aos donos. Os DESIGN.md são **interpretações do Refero, não guias oficiais**. Muitas fontes são **comerciais**: Söhne, Signifier, SF Pro, Waldenburg, GT Super, Plantin, Geist (esta é livre). A página de pares de fontes pede *"check licensing before reusing a font"*. Use as substitutas listadas em cada arquivo, como Inter, Instrument Serif e EB Garamond.
- **Copyright policy:** remoção por e-mail para support@refero.design. Também há um agente DMCA.

**Transparência sobre esta coleta.** Foram cerca de 75 requisições ao styles.refero.design e 17 ao doc.refero.design, abaixo de 2 por segundo, iniciadas por pedido do usuário. Usei um user-agent genérico, e não o de robô de IA. Mesmo assim, o robots.txt mostra que o Refero **não quer robôs de IA** no site.

**O que fazer:**
1. Os **20 DESIGN.md e as páginas brutas ficam só no scratchpad**, como referência interna. **Não commitar** no `claude-skills`: seria redistribuição e "repository".
2. Nas skills entram **as nossas regras sintetizadas** (seção 3), o **nosso modelo** (`MODELO-DESIGN.md`) e, se aprovado, a **skill MIT** com a LICENSE.
3. Para buscas futuras, use o **MCP oficial** (precisa do plano pago) ou o botão Copy/Download manualmente, sem repetir a coleta automática.

## 8. Recomendação: o que costurar em cada skill

Lembrete das regras do repositório: mudar um `SKILL.md` **exige aprovação**. O `APRENDIZADOS.md` pode ser atualizado livremente.

### 8.1 `ui-ux-pro-max` (principal)
Hoje a skill é só um ponteiro para a skill externa. Proposta para aprovação:
1. **Novo arquivo de referência `minimalismo-premium.md`**, com as tabelas da seção 3 (tipografia, cor, espaço, raios/sombras, botões, layout, faça e não faça), em português e com os números.
2. **Fluxo "DESIGN.md primeiro"** no SKILL.md:
   - **(a)** procurar `DESIGN.md` na raiz do projeto;
   - **(b)** se não houver, criar a partir do `MODELO-DESIGN.md`, escolhendo **uma** direção principal (precisa ou macia);
   - **(c)** importar no `CLAUDE.md` com `@DESIGN.md`;
   - **(d)** montar o reference lock e o decision ledger antes de codar;
   - **(e)** no final, revisar em 3 camadas (hierarquia → consistência → estados/mobile) e aplicar o AI Slop Detector.
3. **Fontes de referência opcionais:** o Refero MCP, se o usuário tiver plano, junto com a `ui-ux-pro-max` externa. A seção "If it is not installed" ganha os números concretos: 2 famílias, 1 acento, base de 4px, 96px entre seções, ≤ 3 raios, contraste ≥ 4,5:1.
4. **APRENDIZADOS.md (livre, pode entrar já):** o alerta do "calm editorial on autopilot" e a lista dos 20 estilos de referência com URL, sem o conteúdo deles.

### 8.2 `button-animation`
- Acrescentar a **hierarquia premium**: 1 preenchido, um ghost ao lado e um link com →. Medidas: 36–48px de altura, padding de 8–12 × 16–24px, label de 14–16px com peso 500.
- Acrescentar as **duas escolas de raio**: pílula 9999px ou 4–6px, sem misturar.
- Regra: **em sites minimalistas, nada de anel de gradiente girando nem sombra no botão**. A animação fica em cor e opacidade, em 150–200ms com `cubic-bezier(0.4,0,0.2,1)` e sublinhado de 0,2s. O anel de gradiente da skill vale só para contextos expressivos ou momentos-assinatura.
- Os tokens do botão passam a vir do `DESIGN.md` do projeto.

### 8.3 `motion-oficial`
Só APRENDIZADOS: "no minimalismo premium, o movimento é silencioso":
- hover e focus em 150–200ms;
- entrada de seção em 250–400ms, sem bounce;
- mola só no **momento-assinatura** (como no Notion, que reserva a mola para os "character marks" do hero);
- header com `backdrop-filter: blur(12px)` e borda de 1px aparecendo ao rolar (Superhuman);
- sempre `prefers-reduced-motion`.

Os números entram no campo **Movimento** do `MODELO-DESIGN.md`.

### 8.4 `thumbnail-carousel`
Criar uma **variante "minimal"**, para aprovação. Hoje a skill escala 0,95 × 0,85 com um anel colorido. A variante teria:
- raio vindo do DESIGN.md: **0px** no editorial (Exhibition, Minimal Collective) ou **28px** no Apple;
- thumbnail ativa com **anel neutro de 1px**, sem cor de marca;
- **sem sombra** e diferença de escala sutil (1,0 × 0,96);
- legenda pequena com tracking positivo;
- carrossel em tela cheia no hero editorial (Exhibition), mockups inclinados de −4° a +3° (Things) ou fotos sobrepostas em 10–30px (Minimal Collective).

### 8.5 Criar uma skill nova? **Sim, vale.**
`skills/design/design-md/`, para aprovação:
- **SKILL.md (em português):**
  - o que é o DESIGN.md;
  - quando criar;
  - como preencher a partir de uma referência, sem copiar o conteúdo do Refero;
  - como ligar no CLAUDE.md;
  - checklist de revisão (seções 5.3 e 5.4);
  - como trocar de direção;
  - quando usar o Refero MCP.
- **`assets/MODELO-DESIGN.md`:** o modelo desta pesquisa.
- **`APRENDIZADOS.md`:** a lista dos 20 estilos (nome, URL e 1 linha de resumo) como "biblioteca de referências", **sem os arquivos**, por causa da licença.
- **Opcional:** importar a **skill oficial `refero-design` (MIT)** como `skills/design/refero-design/` ou dentro de `original/`, com a LICENSE e com a descrição ajustada para não "mandar" nas outras skills.
- Depois, considerar um **combo** `combo-ui-premium`: design-md → ui-ux-pro-max → button-animation → motion-oficial → thumbnail-carousel, com pontos de aprovação na direção visual e no DESIGN.md.
- Atualizar o `guia/HABILIDADES.txt` no mesmo commit, como manda o CLAUDE.md.

## 9. Arquivos desta pasta

- `RELATORIO-minimal.md`: este relatório.
- `MODELO-DESIGN.md`: o modelo em branco, em português.
- 20 arquivos `*-DESIGN.md`: anthropic, apple, apple-espana, attio, cursor, elevenlabs, exhibition-magazine, linear, medium, midday, minimal-collective, monocle, notion, seline-analytics, shadcn-ui, steep, stripe, superhuman, things e vercel. **Só para uso interno, não commitar.**
- `skill-oficial/`: a skill `refero-design` (MIT) com LICENSE, README, VERSION, `.mcp.json`, `server.json`, `.claude-plugin/` e ORIGEM.txt.
- Material bruto, para consulta:
  - `_ai_agents_compact.txt` e `_ai_agents_stripped.txt`: o texto das 22 páginas /ai-agents/;
  - `_txt/`: o texto de todas as páginas-guia e coleções;
  - `_docs/`: docs oficiais em markdown (termos, copyright, skill, MCP, tools, data-model, plans);
  - `_raw/`: HTML original (páginas-guia e 22 estilos);
  - `_buttons_layout.txt`: botões, layout e faça/não faça extraídos dos 20 estilos;
  - `_lista.txt`: slugs e UUIDs.
