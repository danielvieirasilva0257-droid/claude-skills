# Minimalismo premium

Texto nosso. Regras que funcionam como padrão quando o projeto quer "limpo, calmo, caro". Ideias cruzadas de: Practical Typography (Butterick) e Refactoring UI (só ideias), Apple HIG e Material 3 (números), `minimalist-ui` da taste-skill (MIT) e a skill oficial do Refero (MIT). Exemplos de marca vêm do awesome-design-md (MIT).

**Minimalismo não é página vazia.** Ele falha quando tira a prova, o contexto ou a ação de que o usuário precisa. Antes de simplificar, liste o que **tem que ficar**: conteúdo, ações, provas, navegação.

## Escolha a escola (e não misture)

| Escola | Raios | Botões | Clima | Exemplos (awesome-design-md) |
|---|---|---|---|---|
| **Precisa** | 0 a 6px em tudo | retângulo de 4 a 6px, quase preto | técnico, financeiro, ferramenta | Vercel, Stripe, Linear |
| **Macia** | pílula 9999px nos botões, 12 a 28px nos cards | pílula preta ou na cor da marca | consumo, produto, app pessoal | Apple, Nike, Superhuman |

Em produto técnico ou financeiro, prefira a escola precisa. A dupla "creme + serifa grande" fica para produto editorial de verdade (ver `anti-padroes-ia.md`).

## Tipografia

- **1 família** (com 2 ou 3 pesos) já basta. Se forem 2, papéis rígidos: display e texto. Mono só em código e metadados.
- **Display leve:** peso 300 a 500 é o "sussurro" do minimalismo (Stripe usa 300; Superhuman, 460 a 540). Nunca 700.
- **Display:** 56 a 72px no desktop, entrelinha 0,95 a 1,1, tracking −0,03 a −0,05em. Editorial extremo pode ir a 100px+ com entrelinha 0,8 a 0,9.
- **Corpo:** 16 a 17px, entrelinha 1,5 a 1,6, tracking 0. Leitura longa: 17 a 20px.
- **Rótulos em caixa alta:** 11 a 13px, peso 500, +0,06 a +0,08em. Raros.
- **Medida:** 60 a 68 caracteres (540 a 680px).
- **Contraste de voz:** display e texto devem ser opostos em peso e tracking (display leve e apertado; texto normal e solto).

## Cor

- **5 a 8 neutros + 1 cor de ação.** Algumas marcas minimalistas não usam nenhuma cor (o botão é quase preto).
- **Canvas levemente tingido**, não `#fff` puro: `#fafafa`, `#fafaf9`, `#f7f7f4`, `#f5f5f7`. Cards brancos por cima.
- **Texto quase preto:** `#171717`, `#1a1a1a`, `#1d1d1f`, `#26251e`.
- **3 níveis de superfície** (canvas → superfície → placa), com 2 a 5% de diferença de luminosidade.
- **Hierarquia de texto por opacidade ou cinza:** 100% / 60 a 70% / 40 a 50%, sempre respeitando 4,5:1 no corpo e 3:1 em legenda não essencial.
- **Proibido:** gradiente e glow em superfície; segunda cor "por enfeite"; misturar cinzas quentes e frios.
- Acentos pastéis (se houver) sempre em par com sua cor de texto escura, nunca texto branco em pastel.

## Espaço e layout

- Base 4px. **8px dentro do grupo, 16 a 24px entre grupos, 96px entre seções** (56 a 64px no celular). Minimalismo extremo: 144 a 160px.
- Padding de card: 24px.
- Largura: 1200px (960px para produto focado). Margem lateral: 24px no celular, 48 a 64px no desktop.
- **1 foco visual por seção.** Separe seções com **um** recurso só: respiro, faixa alternada ou linha de 1px.
- **Menos padrões:** poucos tipos de seção, de card e de botão. Nada de grade de 3 cards "por padrão".
- Modelos de hero: **a tipografia é o hero** (Stripe, Vercel); **pilha centralizada** com título, frase, 2 botões e imagem do produto; ou **assimétrico à esquerda**.
- Nav transparente, 44 a 64px, até 5 links, CTA à direita. `backdrop-filter: blur(12px)` e borda de 1px só depois de rolar.

## Raios, bordas e sombras

- No máximo 3 raios (exemplo: 6 / 12 / 9999).
- **Linha de 1px** (ou 0,5px) em `rgba(0,0,0,.06)` a `.08` como separador principal.
- Sombra: zero, ou "sussurro" de 4 a 10% de opacidade com anel de 1px. Sombra forte só no único elemento flutuante.

## Botões

1. **Primário:** 1 por tela; quase preto ou cor da marca; texto de 14 a 16px, peso 500; padding 8 a 12 × 16 a 24px; altura de 36 a 48px (alvo de toque ≥ 44px). Sem sombra e sem gradiente.
2. **Secundário:** contornado de 1px na cor da linha, mesmo raio e altura, ao lado do primário.
3. **Terciário:** link de texto com sublinhado ou seta no fim (seta só aqui, não em todo link).

Transições: 150 a 200ms com `cubic-bezier(0.4, 0, 0.2, 1)`. Sublinhado do link aparece em 0,2s.

## Movimento

O movimento minimalista é silencioso: hover e foco em 150 a 200ms; entrada de seção em 250 a 400ms sem quique; mola só no momento-assinatura; header com blur aparecendo ao rolar; sempre `prefers-reduced-motion`. Nada de anel de gradiente girando nem sombra no botão (o anel da `button-animation` é para momento expressivo).

## Imagem

Papel definido: screenshot real do produto, foto em tela cheia ou nenhuma. Faltou imagem: placeholder com proporção fixa e nota de direção de arte. Nunca "foto falsa" em CSS nem interface de produto falsa feita de `<div>`.

## Faça e não faça

**Faça:** papéis antes de valores; 1 acento com 1 papel; display e texto opostos; linhas em vez de sombras; 96px entre seções; poucos tipos de componente; `tabular-nums` em números; `text-wrap: balance` em títulos.

**Não faça:** negrito 700 no display; segundo acento; gradiente ou glow; sombra pesada; `#fff` no canvas e `#000` no texto (salvo decisão escrita); raio médio misturado com pílula; parágrafo centralizado com mais de 2 linhas; card sem interação.
