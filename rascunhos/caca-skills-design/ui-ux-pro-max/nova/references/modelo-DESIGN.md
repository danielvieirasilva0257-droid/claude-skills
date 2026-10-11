---
version: alpha
name: "[Nome do projeto]"
description: "[Estrela-guia em 1 linha: uma metáfora visual do sistema]"
# COMO USAR ESTE MODELO
# 1. Copie para a raiz do projeto como DESIGN.md.
# 2. Troque cada valor de exemplo (arquétipo Galeria clara) e cada [colchete] por uma regra observada
#    na referência travada ou por uma decisão deliberada. O que não souber vai em "Decisões em aberto".
# 3. Confira: npx -y @google/design.md lint DESIGN.md
# 4. Exporte: npx -y @google/design.md export --format css-tailwind DESIGN.md > app/theme.css
# Formato: spec aberta do Google (github.com/google-labs-code/design.md, Apache-2.0).
# Seções ## em inglês na ordem da spec (para o lint); texto em português. Seções extras no fim são preservadas.
# fontFamily: só UM nome de família. O export põe o valor inteiro entre aspas; complete a pilha
# (ex.: Inter, system-ui, sans-serif) à mão no theme.css. Visual Apple: troque Inter por system-ui no CSS.
colors:
  canvas: "#f5f5f7"
  surface: "#ffffff"
  border: "#d2d2d7"
  text: "#1d1d1f"
  text-muted: "#6e6e73"
  primary: "#0a66d8"
  primary-hover: "#0858bb"
  on-primary: "#ffffff"
  focus: "#0a66d8"
  danger: "#c62828"
  success: "#1b7f3b"
typography:
  display:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -0.03em
  heading:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.02em
  body:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
  label:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.01em
rounded:
  sm: 8px
  card: 24px
  pill: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  section: 96px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: 12px 22px
    height: 44px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    padding: 12px 22px
    height: 44px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    padding: 24px
  page:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text}"
  caption-text:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text-muted}"
    typography: "{typography.caption}"
  divider:
    backgroundColor: "{colors.border}"
    height: 1px
  focus-ring:
    backgroundColor: "{colors.focus}"
    width: 2px
  alert-danger:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.danger}"
  alert-success:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.success}"
---

## Overview

**Tema:** [claro | escuro] · **Arquétipo:** [Galeria clara | Palco escuro | Instrumento de precisão | Minimalista editorial]
**Referência principal:** [link + data] · **Público e tarefa:** [quem usa e para quê] · **Modo de visita:** [Persuadir | Operar | Ler | Experiência]
**Frase de cena:** [quem usa, onde, sob que luz]

[Tese visual em 4 a 6 frases: canvas, voz tipográfica (display x texto), papel do acento, profundidade (linhas x sombras), raios, ritmo de espaço. O que torna este sistema reconhecível? Qual é o único detalhe memorável?]

**Trava da referência**
- Principal: [...]
- Preservar: [3 a 5 traços]
- Emprestar só: [1 a 2 detalhes, cada um com seu trabalho]
- Rejeitar: [padrões genéricos que matariam a direção]

## Colors

Todo valor tem **papel**: onde usar e onde nunca usar.

| Token | Valor | Papel |
|---|---|---|
| `canvas` | `#f5f5f7` | Fundo da página. Nunca `#fff` puro aqui. |
| `surface` | `#ffffff` | Cards e faixas, 1 degrau acima do canvas. |
| `border` | `#d2d2d7` | Linhas e contornos de 1px. |
| `text` | `#1d1d1f` | Títulos e corpo (≥ 7:1 no canvas). |
| `text-muted` | `#6e6e73` | Descrições (≥ 4,5:1). |
| `primary` | `#0a66d8` | Cor de ação: **só** o botão primário (1 por tela) e o estado ativo. `primary-hover` só no hover dele. |
| `focus` | `#0a66d8` | Anel `:focus-visible`. |
| `danger` / `success` | `#c62828` / `#1b7f3b` | Só estados. Nunca decoração. |

## Typography

| Papel | Família | Peso | Tamanho | Entrelinha | Tracking | Uso |
|---|---|---|---|---|---|---|
| display | [...] | 600 | 64px (celular: `clamp(2.5rem, 8vw, 4rem)`) | 1.05 | −0.03em | só títulos ≥ 32px |
| heading | [...] | 600 | 32px | 1.15 | −0.02em | títulos de seção |
| body | [...] | 400 | 17px | 1.5 | 0 | corpo |
| label | [...] | 500 | 15px | 1.2 | 0 | botões |
| caption | [...] | 400 | 12px | 1.4 | +0.01em | legendas |

Medida: parágrafos com `max-width: 65ch`. Títulos com `text-wrap: balance`. Números com `tabular-nums`. Substituta livre de fonte de marca: [...].

## Layout

- Base 4px. Escala: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128.
- 8px dentro do grupo; 16 a 24px entre grupos; [96px] entre seções no desktop e [64px] no celular.
- Conteúdo de [1200px]; texto até [680px]; margem lateral de [24px] no celular e [64px] no desktop.
- Hero: [a tipografia é o hero | pilha centralizada | assimétrico]. 1 foco visual por seção. Seções separadas por [respiro | faixa alternada | linha de 1px] (só um).
- Breakpoints: 375 · 768 · 1024 · 1440.

## Elevation & Depth

- Profundidade por troca de superfície (`canvas` → `surface`) e linha de 1px.
- Anel no lugar de borda: `0 0 0 1px rgba(0,0,0,.08)`.
- Sombra só no elemento flutuante [menu | modal | mockup]: `[0 8px 30px rgba(0,0,0,.12)]`.
- Vidro só na nav ao rolar: fundo com 72% de opacidade + `backdrop-filter: saturate(180%) blur(20px)`.

## Shapes

Escola: [macia | precisa]. Raios: `sm` 8px (inputs, chips), `card` 24px, `pill` 9999px (botões). Raio interno = externo − padding. Ícones: [uma família, traço de 1,5px].

## Components

- **Botão primário:** 1 por tela. Valores no front matter. Hover só escurece (`primary-hover`) em 150 a 200ms. Foco: anel de 2px, afastamento de 2px. Desabilitado: [...].
- **Botão secundário:** contorno de 1px em `border`, mesma altura e raio, ao lado do primário.
- **Link:** cor [...], sublinhado [no hover | sempre].
- **Card:** só quando o contêiner é clicável.
- **Input:** altura [44px], label acima, ajuda abaixo, erro com texto e ícone.
- **Nav:** [52 a 64px], até 5 links, CTA à direita, vidro e linha só depois de rolar. Celular: barra inferior com até 5 itens.
- **[Outro componente do projeto]:** [...]

Estados obrigatórios: normal, hover, foco, ativo, desabilitado, carregando, vazio, erro.

## Do's and Don'ts

**Faça**
- [Regra com valor exato. Ex.: "Use `primary` só no botão primário, 1 por tela."]
- [...]

**Não faça**
- [Ex.: "Não use sombra para separar cards; use linha de 1px."]
- [Ex.: "Não crie uma segunda cor de acento."]
- [Ex.: "Não use peso 700 no display."]

## Motion

| Camada | Duração | Curva |
|---|---|---|
| hover e cor | 150–200ms | `cubic-bezier(0.4, 0, 0.2, 1)` |
| estado (abas, acordeão) | 200–300ms | `cubic-bezier(0.2, 0, 0, 1)` |
| modal e gaveta | 250–400ms entrada, 150–200ms saída | `cubic-bezier(0.32, 0.72, 0, 1)` |
| revelação no scroll | 500–750ms, deslocamento de 16–32px | `cubic-bezier(0.16, 1, 0.3, 1)` |

Personalidade: [utilidade quieta | premium com peso | cinematográfico | lúdico]. Momento-assinatura: [qual e onde]. Só `transform` e `opacity`. `prefers-reduced-motion`: crossfade. Skills: `motion-oficial`, `button-animation`. O vídeo do app (`remotion-video`) usa estas mesmas curvas.

## Composição

As 4 regras do editor: nada de texto sobre texto ou logo sobre texto; nenhum recorte no meio da tela; elemento principal por cima do texto (fundo → texto → produto); texto entra da borda ou de trás do elemento principal. [Notas específicas deste projeto.]

## Accessibility

- Texto principal ≥ 7:1; corpo ≥ 4,5:1; texto grande, ícones e bordas de controle ≥ 3:1.
- Alvo de toque ≥ 44 × 44px, com 8px entre alvos. Foco visível em todo elemento interativo.
- Erro com texto e ícone, não só cor. Teste com zoom de texto de 200%.

## Decision ledger

| Decisão | Fonte | Regra de papel | Por quê |
|---|---|---|---|
| [paleta, tipo, layout, mídia, conteúdo] | [referência, pedido do Daniel, regra da skill] | [token ou papel preservado] | [motivo específico deste projeto] |

Decisão grande sem fonte não entra.

## Decisões em aberto

- [O que a referência não diz sobre o nosso produto: estados vazio, carregando e erro; responsivo; tema escuro; conteúdo real.]
