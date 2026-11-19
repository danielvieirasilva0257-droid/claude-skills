---
version: alpha
name: "App Barbeiros"
description: "O caixa limpo de uma barbearia boa: branco, verde de dinheiro, azul só quando a IA fala, e a festa guardada para a meta batida."
colors:
  bg: "#FFFFFF"
  surface: "#F4F8F6"
  border: "#E2E8E5"
  text: "#0F1A14"
  text-muted: "#5B6B63"
  brand: "#15803D"
  brand-lip: "#0F5F2D"
  brand-soft: "#DCFCE7"
  on-brand: "#FFFFFF"
  ai: "#1D4ED8"
  ai-soft: "#EFF6FF"
  warning: "#B45309"
  danger: "#C62828"
  gold: "#E3B341"
  gold-text: "#8A6A12"
  on-gold: "#0F1A14"
  wave: "#FACC15"
  bill: "#22C55E"
typography:
  display:
    fontFamily: Inter
    fontSize: 34px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.02em
  title:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.01em
  h2:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: 0em
  body:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0em
  label:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0em
  caption:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: 0em
rounded:
  sm: 8px
  md: 12px
  lg: 16px
  pill: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-brand}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    height: 52px
  button-secondary:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    height: 52px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: 16px
  insight-card:
    backgroundColor: "{colors.ai-soft}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: 16px
  page:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text}"
  caption-text:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text-muted}"
    typography: "{typography.caption}"
  divider:
    backgroundColor: "{colors.border}"
    height: 1px
  alert-danger:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.danger}"
---

## Overview

**Tema:** claro · **Arquétipo:** instrumento de precisão (o app é uma ferramenta de trabalho) com um momento lúdico guardado para as conquistas.
**Público e tarefa:** barbeiro individual (comissionado, aluga cadeira ou MEI), entre um cliente e outro, com o celular numa mão. Lança um atendimento em 2 toques e, no fim do dia, olha quanto ganhou.
**Modo de visita:** Operar (dezenas de vezes por dia) e Ler (relatórios à noite).
**Frase de cena:** o barbeiro em pé ao lado da cadeira, luz forte de espelho, mão com pó de talco, 10 segundos entre um cliente e o próximo.

Tese visual: fundo branco puro, que some atrás dos números. Inter em três pesos, com números tabulares em tudo que é dinheiro. O verde é o dinheiro e a ação: aparece no botão principal (um por tela), no valor positivo e na aba ativa. O azul só aparece quando a IA fala (cartão de insight, chat, coach), e por isso o barbeiro aprende a confiar nele. Profundidade por troca de superfície (`bg` → `surface`) e borda de 1 px, sem sombra borrada. O detalhe memorável é o **lábio sólido** do botão principal, que afunda no toque e, nas conquistas, pula soltando notas de R$.

**Trava da referência**
- Principal: estilo Duolingo só nos momentos de meta e conquista (pedido do Daniel, 18/11) sobre uma base de app financeiro calmo (Nubank e Stripe na sobriedade dos números).
- Preservar: botão com lábio sólido; números grandes e tabulares; fundo branco; um botão principal por tela; azul exclusivo da IA.
- Emprestar só: a celebração com pulo e partículas (Duolingo) e o anel de progresso de meta (Apple Fitness), cada um num lugar só.
- Rejeitar: sombra borrada, gradiente, vidro de enfeite, escuro por padrão, ícone com emoji, qualquer coisa do Rotina.

## Colors

| Token | Valor | Papel |
|---|---|---|
| `bg` | `#FFFFFF` | Fundo de todas as telas. |
| `surface` | `#F4F8F6` | Cartões, faixas e áreas agrupadas: 1 degrau acima do fundo. |
| `border` | `#E2E8E5` | Bordas de 1 px de cartões, inputs, barra de abas e divisórias. |
| `text` | `#0F1A14` | Títulos, números e corpo (17,8:1). |
| `textMuted` | `#5B6B63` | Rótulos, legendas e ajuda (5,6:1). Nunca para número principal. |
| `brand` | `#15803D` | Ação principal (1 por tela), aba ativa, valor positivo, anel de meta no caminho (5,0:1 com branco). |
| `brandLip` | `#0F5F2D` | Só o lábio do botão principal e o texto verde sobre `brandSoft`. |
| `brandSoft` | `#DCFCE7` | Fundo de chip selecionado e de "salvo". |
| `ai` | `#1D4ED8` | **Só a IA:** título e ícone do insight, chat e coach (6,7:1). Nunca em botão comum. |
| `aiSoft` | `#EFF6FF` | Fundo do cartão de insight e das bolhas da IA. |
| `warning` | `#B45309` | Meta em risco (anel e texto), aviso de MEI em 80%. Sempre com "⚠" e texto. |
| `danger` | `#C62828` | Prejuízo, erro, ação destrutiva. **Nunca para gasto comum** (gasto é texto neutro com "−"). |
| `gold` / `goldText` / `onGold` | `#E3B341` / `#8A6A12` / `#0F1A14` | Premium Plus e conquistas (moedas, selo de recorde). `goldText` quando o dourado é texto. |
| `wave` | `#FACC15` | Só a onda dentro do `ConquistaButton`. |
| `bill` | `#22C55E` | Só as notinhas de R$ da celebração e do mascote. |

Cores dos planos (cadeado e selo): Grátis `#8A8F98`, Pago `#15803D`, Premium `#1D4ED8`, Plus `#E3B341`, Barbearias `#0A0A0B`.

## Typography

| Papel | Token | Peso | Tamanho | Uso |
|---|---|---|---|---|
| display | `size.display` | 600 | 34 | Número principal da tela (faturamento de hoje, lucro). |
| title | `size.title` | 600 | 28 | Título da tela. |
| h2 / h3 | `size.h2` / `size.h3` | 600 | 22 / 20 | Seções e números secundários. |
| body | `size.body` | 400 | 17 | Corpo e inputs. |
| bodySm | `size.bodySm` | 400/500 | 15 | Rótulos de campo, linhas de lista. |
| caption / tiny | `size.caption` / `size.tiny` | 500 | 13 / 12 | Legendas, rótulos das abas. |

- Fonte: Inter, carregada **por peso** (`Inter_400Regular`, `Inter_500Medium`, `Inter_600SemiBold`); nunca `fontWeight` em cima dela (vira negrito falso). Helper: `inter('semibold')` em `src/theme/fonts.ts`.
- **Todo número** usa `tabularNums` (`fontVariant: ['tabular-nums']`).
- Sem peso 700. Sem caixa alta em títulos.

## Layout

- Base 4 px: `space` 4 · 8 · 12 · 16 · 24 · 32 · 48.
- Margem lateral 16 px. 8 px dentro do grupo, 16–24 px entre grupos.
- **Leitura em cima, ação embaixo:** o botão principal fica ao alcance do polegar; "+ Atendimento" é fixo embaixo à direita no Início e na Agenda.
- Barra de abas com 5 itens: Início, Agenda, Relatórios, Clientes, Mais (58 px + área segura).

## Elevation & Depth

- Profundidade só por `surface` + borda `border` de 1 px.
- **Sem sombra borrada.** O lábio do botão é sólido (`brandLip`, 4 px), não sombra.
- Único elemento flutuante: a gaveta (`BottomSheet`), separada por um véu `text` a 40% de opacidade.
- Desfoque só na prévia da `LockedScreen` (dados reais borrados atrás do cadeado).

## Shapes

Escola macia. Raios: `sm` 8 (chips pequenos, barras), `md` 12 (inputs), `lg` 16 (botões e cartões), `pill` (chips e selos). Ícones: SF Symbols no iOS e Material Symbols no Android e na web (`expo-symbols`), traço regular.

## Components

Código em `src/components/`. Estados obrigatórios: normal, foco, pressionado, desativado, carregando, vazio, erro.

| Componente | Comportamento |
|---|---|
| `DuoButton` | Principal. Verde, lábio de 4 px, raio 16, altura 52. Toque: desce 4 px em 60 ms + vibração leve; solta com `springBack`. Desativado: cinza (`border`/`textMuted`), sem lábio e sem movimento. Carregando: spinner + `aria-busy`. Foco: anel `brand` de 2 px com 2 px de folga. |
| `SecondaryButton` | Contorno de 1 px, mesma altura e raio; escala 0,97 no toque (100 ms `easeOut`). |
| `ConquistaButton` | Variante do `DuoButton` para fechar o caixa, 50%/100% da meta, recorde, sequência e upgrade. Tabela de tempos abaixo. |
| `StatusButton` | Salvar → spinner só após 200 ms (mínimo 400 ms) → "✓ Salvo" por 2 s; erro "✕ + motivo" com tremor de 4 px uma vez; largura fixa; trava duplo envio; anuncia o resultado. |
| `HoldToConfirm` | Segurar 2 s (barra `linear`) para apagar lançamento, cancelar horário ou excluir cliente. Soltar antes volta em 200 ms. Leitor de tela: ação "ativar" abre confirmação. |
| `MetaRing` | Anel SVG; verde no caminho, âmbar em risco com "⚠ Em risco"; mola com amortecimento ~0,65. |
| `InsightCard` | `aiSoft`, selo "IA", título até 5 palavras, número, por quê, ação e botão. |
| `Chip` | Serviços e pagamentos. Selecionado: `brandSoft` + borda `brand` + "✓". Pop 0,96 → 1. |
| `BottomSheet` | Sobe com `springCalm` (sem quique); véu com fade; fecha no véu e no voltar. |
| `LockedScreen` | Prévia borrada com dados reais + cadeado na cor do plano + "Conhecer o plano". |
| `Mascote` | Nota de R$ com asinhas. Estados: parado, comemorando, pensando, preocupado leve. Só aparece em meta, conquista, IA pensando e alerta leve. |

### ConquistaButton ("pulo com dinheiro", aprovado em 19/11)

| Fase | Tempo | O que faz |
|---|---|---|
| Toque | 0–60 ms | desce 4 px, escala 0,97, lábio some · vibração leve |
| Onda | 0–630 ms | 2 círculos `wave` (opacidade 0,55 e 0,35) crescem do centro **dentro do botão**, texto por cima · 520 ms cada, o 2º com 110 ms de atraso, `easeOut` |
| Dinheiro | 60 ms → ~1,2 s | 12 peças (8 notas "R$" `bill`, 4 moedas `gold`) em leque de 150° para cima, giram, caem com gravidade e somem no último terço |
| Subida | 60–300 ms | sobe 48 px, escala 1,03, `easeInOut` |
| Descida e pouso | 300–540 ms | desce, achata 1,04 × 0,94 · vibração média no pouso |
| Assentar | 540–720 ms | mini quique de 4 px · vibração de sucesso no fim |
| Giro 3D | opcional | 360° em Y com `perspective: 800` (primeiro item do transform) |

## Do's and Don'ts

**Faça**
- Um `DuoButton` por tela; o resto é `SecondaryButton` ou link.
- Dinheiro sempre formatado por `formatMoeda` (o banco calcula, a tela só formata).
- Todo estado com texto ou sinal além da cor: "✓ Salvo", "⚠ Em risco", "▲ 12%", "▼ 8%".
- Gasto comum em `text` com "−"; prejuízo em `danger` com "▼".
- Prévia real e borrada no lugar de tela vazia quando o plano não libera.

**Não faça**
- Não use sombra borrada, gradiente ou vidro de enfeite.
- Não use `ai` fora do que a IA escreveu.
- Não ponha confete, pulo ou mascote em ação do dia a dia (lançar, salvar, navegar).
- Não use contagem regressiva, culpa ou cancelamento escondido.
- Não passe hex direto para componente: sempre `color.*`.

## Motion

| Camada | Duração | Curva / mola |
|---|---|---|
| Toque (botão, chip) | 60–100 ms | `motion.easeOut` · volta com `springBack` (botão principal) |
| Troca de estado (abas, chips) | 150–200 ms | `motion.easeOut` |
| Gaveta e modal | entrada ~300 ms, saída 200 ms | `springCalm` (sem quique) |
| Número contando | 800 ms | `motion.easeOut` |
| Conquista | ~1,2 s | tabela acima (`easeInOut` + `celebrate`) |

Personalidade: utilidade quieta no dia a dia; lúdica só no momento-assinatura (`ConquistaButton` + `Mascote`). Só `transform` e `opacity` (Reanimated 4). **Reduzir movimento** (`useMovimentoReduzido`, que lê o sistema e ouve `reduceMotionChanged`): sem onda, sem dinheiro, sem pulo; troca de cor de 150 ms; gaveta só com fade; anel e barras de progresso continuam (são informação).

## Composição

As 4 regras do editor valem também nas telas: nada de texto sobre texto (o texto do `ConquistaButton` fica **por cima** da onda, e as notas voam **fora** do texto); nenhum recorte no meio da tela (a onda é cortada só pela borda do próprio botão, que é o objeto); o elemento principal por cima (o botão sobe à frente das notas); o que entra, entra de fora (a gaveta sobe da borda de baixo).

## Accessibility

- Contraste: `text` 17,8:1, `textMuted` 5,6:1, `brand` com branco 5,0:1, `ai` 6,7:1; `warning` e `danger` sempre com texto.
- Toque ≥ 44 × 44 (botões têm 52), 8 px entre alvos.
- Nada só por cor: aba ativa em verde **e** negrito; chip selecionado com "✓"; risco com "⚠".
- Leitor de tela: `accessibilityRole`, `accessibilityState` (selected, disabled, busy), `accessibilityLabel` em botão só com ícone, `accessibilityLiveRegion`/`aria-live` em "Salvo" e erros.
- Teste com fonte grande (200%): o layout empilha, nada corta.

## Decision ledger

| Decisão | Fonte | Regra de papel | Por quê |
|---|---|---|---|
| Branco + verde #15803D + azul #1D4ED8 | Plano de Negócio (18/11), CLAUDE.md do app | verde = dinheiro e ação; azul = só IA | separa "o que eu fiz" (verde) de "o que a IA sugere" (azul) |
| Botão com lábio sólido 4 px | Pedido do Daniel (estilo Duolingo), `button-animation` receita 12 | só no botão principal | dá peso ao toque sem sombra |
| Pulo com dinheiro só em conquistas | Aprovado em 19/11; `ui-ux-pro-max` (ação 100×/dia não anima) | `ConquistaButton` só em meta, caixa, recorde, upgrade | o encanto vale mais quando é raro |
| Inter por peso, números tabulares | `ui-ux-pro-max` (tipografia), ESPECIFICACAO seção 6 | `inter()` + `tabularNums` | números não "dançam" quando mudam |
| Sem sombra, profundidade por superfície | `ui-ux-pro-max` (forma e profundidade) | `surface` + `border` | visual limpo e rápido de ler na luz do espelho |
| `easeOut` (0.23, 1, 0.32, 1) | `motion-oficial` e `button-animation` | curva padrão de UI | escolhido entre as duas curvas das skills (PASSO-A-PASSO) |
| Partículas com Reanimated, não Skia | Decisão da Fase 1 | 12 peças = 12 `Animated.View` | evita Skia/wasm na web; 12 peças não pesam |
| Gráficos com `react-native-svg` | Decisão da Fase 1 | barras, linhas e mapa de calor | funciona igual no celular e na web dos testes |
| Mascote em SVG até a arte do Rive | Decisão pendente 4 (arte final) | `Mascote` com 4 estados | o app não espera a arte; troca por `.riv` sem mudar quem usa |

## Decisões em aberto

- Nome do app e logo (seção 12 da especificação): o app usa "App Barbeiros" até lá.
- Arte final do mascote no Rive: o `Mascote` em SVG mostra a forma (nota com asinhas) e os 4 estados.
- Tema escuro: fora do escopo do lançamento (barbearia é ambiente claro).
