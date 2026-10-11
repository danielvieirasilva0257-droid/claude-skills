# Padrões do visual premium, minimalista e animado (com números)

Síntese nossa, feita a partir de 64 estilos do Refero Styles estudados em 11/10/2026. A lista com links está em `indice-estilos.md`.

- **Contagens** como "22 de 27" referem-se aos 27 estilos premium ou aos 20 minimalistas estudados.
- **Marcas citadas** aparecem como exemplo pontual, não como cópia do sistema delas.
- **Fontes comerciais:** use sempre as substitutas livres.

## 1. Tipografia

| Item | Regra | Exemplos |
|---|---|---|
| Famílias | **1 ou 2** com papéis rígidos (título e texto, ou sans e mono). A mono serve só para código e metadados | Uma família: B&O, Dyson, Sonos, Stripe, Minimal Collective. Serifa com sans: Anthropic, Medium, Monocle, Steep |
| Título do hero (desktop) | **56 a 96 px** (mediana de 66, padrão de 64 a 72). Editorial chega a 100 ou 120 px; o monograma da Rivian, a 360 px | Apple 80 a 96, Sonos e Bose 96, Linear 72, Nike 76, Dia 112 |
| Título no celular | Cerca de 0,55 do desktop (regra nossa): `font-size: clamp(2.5rem, 5vw + 1rem, 4.5rem)` | — |
| Peso do título | **300 a 600.** 300 é o "sussurro" (Stripe, BMW, ElevenLabs, Dyson, Dia); 400 a 460 é o neutro (Sonos, Vercel, Superhuman); 500 a 600 é o firme (Apple, Nike, Framer, Linear até 590) | 700 ou mais só por identidade: Bose (900, condensada) e Samsung (700) |
| Entrelinha do título | **0,95 a 1,1**; editorial de 0,75 a 0,9 | Vercel ≤ 1,0; Medium 0,83; Apple 1,04 a 1,05 |
| Tracking do título | Cresce para o negativo com o tamanho: **−0,01 em** (24–28 px), **−0,02 em** (32–48), **−0,03 em** (56–64), **−0,04 a −0,06 em** (72+) | Stripe −0,01 → −0,025 em; Notion −0,048 em a 96 px; Vercel −0,06 em a 64 px |
| Exceção automotiva e espacial | **CAIXA ALTA com tracking positivo:** +0,02 a +0,10 em | Ferrari +0,08 a 0,09 em; SpaceX +0,09 a 0,10 em; Lamborghini +0,023 em |
| Corpo | **16 a 18 px**, entrelinha **1,47 a 1,6**, tracking 0. Leitura longa: 17 a 20 px | Apple 17/1,47 (−0,022 em); Things 17–18/1,6 |
| Texto pequeno (11–13 px) | Tracking de **+0,01 a +0,02 em** | — |
| Rótulo em CAIXA ALTA | 11 a 13 px, peso 500, **+0,06 a +0,10 em** | Exhibition, Monocle, Vercel (mono) |
| Pesos no sistema | **2 ou 3** (ex.: 400 no corpo, 500 no botão, 300 ou 400 no título) | Stripe usa só 300 e 400; Minimal Collective, só 400 |
| Largura do texto | Parágrafo com **540 a 680 px** (60 a 68 caracteres); bloco centralizado até 980 px | Things 540; Apple ~980 |
| Números | `font-variant-numeric: tabular-nums` em preços e métricas | — |
| Quebra | `text-wrap: balance` nos títulos; `pretty` na prosa | — |

**Substitutas livres:**

| Fonte comercial | Substituta livre |
|---|---|
| SF Pro | Inter ou system-ui |
| Söhne | Inter ou Inter Tight |
| Waldenburg | Inter 300 |
| GT Super, Signifier | Instrument Serif ou EB Garamond |
| DIN, D-DIN | Barlow |
| DysonFutura, Futura | Jost ou Futura PT |

A Geist é livre.

## 2. Cor

| Item | Regra | Exemplos |
|---|---|---|
| Quantidade | **6 a 10 neutros com papel + 1 cor de ação.** No máximo 2 cores vivas | Em 22 de 27 premium, a interface é quase cinza. Em 10 de 20 minimalistas há ≤ 2 cores vivas; 3 deles têm **zero** |
| Papel único | Cada cor faz **um trabalho**: CTA, link, dado de saúde, ilustração | Apple: azul só no fundo do botão. Tesla: azul só no "Order". Ferrari: vermelho só no hover. ElevenLabs: cores só nas ilustrações |
| Sem cor nenhuma | Possível em premium: a foto faz o papel da cor | Nike, BMW, Sonos, SpaceX, teenage engineering |
| Fundo claro | Quase branco tingido, nunca branco puro em tudo: #f5f5f7, #fafafa, #fdfcfc, #f6f5f4, #fafaf9 | A Apple alterna faixas brancas e #f5f5f7 **no lugar de linhas** |
| Fundo escuro | #000 (palco de produto) ou quase preto: #08090a, #040506. Faixas em #111 e #1d1d1f | — |
| Texto | Quase preto com subtom (#1d1d1f, #171717, #141413); no escuro, #f5f5f7 (não #fff) | 15 de 20 minimalistas evitam #000 no texto |
| Superfícies | **3 níveis** (fundo, superfície, placa) com 2 a 5% de diferença de luz | Ex.: #fdfcfc → #f5f3f1 → #ebe8e4 |
| Linha fina | 1 px (às vezes 0,5 px) em #e5e5e5, #d2d2d7 ou `rgba(0,0,0,.08)` | É o separador principal |
| Contraste (nossa regra) | Texto principal ≥ 7:1; corpo ≥ 4,5:1; legenda e texto grande ≥ 3:1 | Alguns premium ficam abaixo (cinzas de 3,4:1); nós não |
| Proibido | Gradiente em botão ou card, glow, segunda cor "de enfeite", índigo ou violeta por padrão | Gradiente só dentro da foto ou como atmosfera do hero |

## 3. Espaço e grade

| Item | Regra | Exemplos |
|---|---|---|
| Base | **4 px** (alguns usam 8) | 16 de 20 minimalistas |
| Entre seções | **96 px** no desktop (faixa de 80 a 160); **56 a 64 px** no celular | Apple 80–120 (AirPods 163; hero com ≥ 160); Vercel 96–128; Nike, BMW e SpaceX 48–66 |
| Dentro do grupo e entre grupos | 8 px / 16 a 24 px | — |
| Padding de card | **24 px** (de 16 a 40) | Apple de 28 a 40 em cards grandes |
| Largura máxima | **1200 a 1280 px**; foto em tela cheia até 1440; produto focado com 960 | — |
| Margem lateral | 24 px no celular; 48 a 64 px no desktop | — |
| Ritmo | **1 foco por seção.** Nada de grade de 3 cards "por padrão" | — |
| Separação | **Um** recurso: respiro, **ou** faixa de cor alternada, **ou** linha de 1 px | Apple: alterna o fundo. Stripe: linha e 96 px. Linear: proíbe a grade de 3 colunas de cards |

## 4. Raios, linhas e sombras

- **Duas escolas. Não misture:**
  - **Macia:** botões em pílula (9999 px) e cards de 12 a 28 px. Exemplos: Apple (cards e mídia de 28), ElevenLabs, Sonos, Nike, Steep.
  - **Precisa:** de 0 a 6 px em tudo. Exemplos: BMW, Ferrari, Lamborghini, teenage engineering e Monocle (0); Dyson e Bose (2); Stripe, Tesla e Cursor (4); Vercel (6).
  - **Meio-termo genérico de 8 px em tudo** é o que mais parece template.
- **No máximo 3 raios** no sistema todo, como o Linear (6, 12 e 9999).
- **Sombra:** zero em cards e botões em 23 de 27 premium e em 9 de 20 minimalistas.
- **Quando houver sombra, use a "sussurro":**
  - opacidade de 4 a 10% com anel de 1 px. Exemplo nosso: `0 0 0 1px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)`;
  - anel duplo, sem sombra: `0 0 0 1px rgba(0,0,0,.08), 0 0 0 2px #fafafa`.
- **Sombra visível só** no único elemento flutuante (menu, popover) ou na foto do produto.
- **Escuro:** profundidade por degraus (#000 → #111 → #171717 → #242424) e linha clara de 1 px.

## 5. Botões e links

| Nível | Como é |
|---|---|
| **Primário** (1 por tela) | Preenchido em quase preto ou na cor da marca. Altura de **36 a 48 px**, padding de **8 a 12 × 16 a 24 px**, texto de 14 a 17 px com peso 400 a 500. Sem sombra e sem gradiente |
| **Secundário** | Contornado de 1 px ou ghost, com o mesmo raio e a mesma altura, **ao lado** do primário |
| **Terciário** | Link com seta "›" ou "→", sublinhado no hover (ou sempre, no editorial) |

**Variações que valem como ideia:**
- **Pílula com contorno ao lado** (Apple): primária preenchida e secundária contornada, com padding de cerca de 12 × 22 px.
- **Contornado que inverte no hover** (B&O, Samsung): o fundo vira escuro e o texto, claro.
- **Automotivo** (Ferrari): caixa-alta com +0,08 em, raio 0, cor da marca só no hover.
- **Tecla de teclado** (Raycast, escuro): brilho de 5% em cima, anel de 25% e sombra interna embaixo.
- **Link de rodapé editorial** (Exhibition): CTA final como link sublinhado grande, em vez de botão.

**Estados:**
- **Hover:** muda cor, fundo, borda ou opacidade em **150 a 250 ms** (`ease` ou `cubic-bezier(.4,0,.2,1)`). **Sem escala no hover.**
- **Toque:** escala de 0,97.
- **Foco:** anel de 2 px na cor de ação, com 2 px de afastamento. A Samsung usa `2px dotted`.
- **Desativado:** opacidade de 0,4, sem animação.

## 6. Navegação e página

- **Barra de cima:**
  - 44 a 64 px de altura;
  - links de 12 a 16 px, no máximo 5;
  - logo à esquerda e CTA compacto à direita;
  - sem mega-menu.
- **Ao rolar:** fundo de vidro com `backdrop-filter: saturate(180%) blur(20px)`, fundo de 72 a 85% de opacidade e linha de 1 px embaixo. Sub-barra do produto fixa (nome em 19 a 21 px, peso 600).
- **Modelos de hero:**
  - **"a tipografia é o hero"** (Stripe, Vercel);
  - **pilha centralizada** (Apple, Tesla): sobretítulo, frase gigante, 1 ou 2 botões, preço e a foto do produto ocupando os 60% de baixo, **sem card em volta**;
  - **assimétrico à esquerda** (ElevenLabs, Linear, Medium).
- **Cards de recurso:** branco sobre #f5f5f7 (ou o contrário), raio de 28, sem borda nem sombra, padding de 28 a 40. A foto pode "vazar" pela borda.
- **Selos:** "Novo" é texto puro de 12 px com peso 600, sem pílula, no máximo 1 por página. Não polua o produto com selos, notas ou tags.
- **Rodapé:** fundo de superfície, links de 12 px em cinza secundário, sem cards.
- **Minimalismo não é página vazia:** mantenha as provas, o contexto e a ação. Peça "menos padrões" (menos tipos de seção, card e botão), não "menos conteúdo".

## 7. Imagem

- **O produto é o herói:**
  - foto isolada em fundo sem emenda (branco ou preto);
  - ângulo de 15 a 25° ou 3/4;
  - luz de estúdio que mostra o material.
- **Duas escolas:**
  - "objeto em museu" (Apple, B&O, teenage engineering);
  - "cinema de estilo de vida" (Sonos, Bose, Nike, Ferrari), com luz quente ou dramática e cortes justos.
- **Sem moldura:** a foto vai até a borda, sem padding, borda nem sombra. Cards de mídia ficam com raio de 28 (Apple) ou 0.
- **Vídeo:** em tela cheia, com controles em pílula translúcida.
- **Sem foto real:** placeholder de proporção fixa com nota de direção de arte. Nunca "foto falsa" feita em CSS.

## 8. Arquétipos com paletas iniciais (valores nossos, contraste conferido)

Use como ponto de partida e troque a cor de ação pela da marca. Os contrastes foram medidos sobre o fundo de cada linha.

| Papel | Galeria clara | Palco escuro | Instrumento de precisão |
|---|---|---|---|
| Fundo | #f5f5f4 (alterna com #ffffff) | #000000 (faixas #161617) | #fafafa |
| Superfície | #ffffff | #1c1c1e | #ffffff |
| Linha | #dcdcd9 | #2c2c2e | `rgba(0,0,0,.08)` |
| Texto principal | #1c1c1e (15,6:1) | #f5f5f7 (19,3:1) | #171717 (17,2:1) |
| Texto secundário | #5f5f64 (5,8:1) | #a1a1a6 (8,2:1) | #5c5c5c (6,4:1) |
| Legenda | #76767b (4,1:1) | #86868b (5,8:1) | #737373 (4,5:1) |
| Ação | cor da marca, ex. #0a5fd1 (texto branco: 5,9:1) | cor da marca em **1** elemento | #171717 ou cor elétrica da marca |
| Título | 56 a 96 px, peso 600, −0,015 a −0,03 em | 64 a 96 px, peso 600, −0,015 em; ou caixa-alta com +0,08 em | 48 a 72 px, peso 400 a 590, −0,022 a −0,06 em |
| Raios | Pílula + 28 | Pílula + 28, ou 0 no automotivo | 4 a 8 (até 3 valores) |
| Sombra | Nenhuma | Nenhuma | Anel de 1 px |
| Entre seções | 96 a 120 | 96 a 160 | 96 a 128 |

**Editorial** (só se o produto for de conteúdo): fundo #f7f5f0, texto #1a1a1a (16:1), secundário #5a5752 (6,6:1), serifa no título com entrelinha de 0,8 a 1,0, raio 0 e linhas de 1 px.

## 9. Receita "tipo Samsung" (o Refero não tem a Samsung)

Valores medidos em samsung.com/sec pelo site de terceiros oh-my-design.kr (capturas de 13/07 e 29/09/2026). A fonte não é oficial nem declara licença; usamos só como medida pontual.

- **Cores:**
  - CTA preto #000 com texto branco;
  - fundo #fff, superfície #f7f7f7;
  - texto secundário #707070, borda #ddd;
  - azul (#006bea) **só** no hover, no toque e no foco da navegação, nunca em repouso.
- **Fontes:** sans geométrica bold (700) no título; sans de interface em 14 px bold nos CTAs e 16 px no corpo. Substitutas: Inter Tight 700 e Inter.
- **Formas:**
  - CTA com **20 px de raio e 40 px de altura**, padding de 10 × 24 px;
  - busca e setas do carrossel com 40 px de raio;
  - aba selecionada com raio 0;
  - **sem sombras**.
- **Movimento:**
  - botão contornado inverte o fundo no hover em 0,2 s linear;
  - borda da busca em 0,5 s `cubic-bezier(.35,0,.36,1)`;
  - card de produto: a foto vai a `scale(1.05)` e a linha "comprar" passa de opacidade 0 para 1;
  - mega-menu com fade.
- **Foco:** `outline: 2px dotted #000`.
- **No Refero, as mais próximas:** Apple (mesma lógica, com azul no lugar do preto), Sonos e Bose (CTAs em preto e branco) e B&O (contornado que inverte).
