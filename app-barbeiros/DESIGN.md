---
version: alpha
name: "App Barbeiros"
description: "Vidro líquido sobre o escuro: o caixa da cadeira em cartões de vidro, verde-limão no dinheiro e na ação, lavanda quando a IA fala, festa só na meta batida."
colors:
  bg: "#050506"
  text: "#F4F4F0"
  text-muted: "#A1A19A"
  brand: "#C5F23A"
  brand-lip: "#9DC42A"
  on-brand: "#0B0F02"
  on-light: "#0B0B0C"
  ai: "#9AA8FF"
  warning: "#FFB020"
  danger: "#FF6464"
  gold: "#F5C451"
  on-gold: "#0B0F02"
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
  sm: 10px
  md: 16px
  lg: 24px
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
    rounded: "{rounded.pill}"
    height: 52px
  page:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text}"
  caption-text:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text-muted}"
    typography: "{typography.caption}"
---

## Overview

**Tema:** escuro (único) · **Arquétipo:** palco escuro com **vidro líquido** (Liquid Glass) · versão 2, pedida pelo Daniel em 20/11/2026 com 6 referências de um app financeiro (cartões de vidro sobre ilustração colorida, verde-limão, chat com a IA, barra de abas flutuante).
**Público e tarefa:** barbeiro individual, entre um cliente e outro, com o celular numa mão. Lança um atendimento em 2 toques e, no fim do dia, vê quanto ganhou.
**Frase de cena:** barbearia à noite, espelho iluminado, o celular em cima da bancada mostrando o dia como um painel de vidro.

Tese visual: fundo quase preto com uma **aurora** de cor (limão, lavanda, laranja) no topo das telas, por trás de tudo. Os cartões são **vidro**: translúcidos, com desfoque do que está atrás, borda de 1 px clara e um brilho no alto, raio 24. No iOS 26 o vidro é o Liquid Glass nativo (`GlassView`); no Android e na web, desfoque + véu + brilho (`Vidro`). O **verde-limão** é o dinheiro e a ação (botão principal, número positivo, aba ativa); a **lavanda** é só da IA; o branco é o "selecionado" (pílula branca com texto escuro, como nas referências). A barra de abas é uma **cápsula de vidro flutuante** e, ao lado dela, o botão redondo verde de **"+ Atendimento"**, em todas as abas.

**Trava da referência** (6 telas do app financeiro enviadas pelo Daniel, 20/11)
- Preservar: fundo preto; cartões de vidro com raio grande; números grandes em branco; pílulas de filtro com a selecionada branca; verde-limão como acento; barra inferior em cápsula flutuante + botão redondo separado; campo "Pergunte à IA" em pílula; gráfico com barras e marcadores verdes.
- Emprestar só: a aurora colorida atrás do topo (no lugar da ilustração) e o chat com a IA em balões.
- Rejeitar: a marca, os textos e as ilustrações do app de referência; gradiente dentro de texto; brilho neon; vidro sobre vidro.

## Colors

| Token | Valor | Papel |
|---|---|---|
| `bg` | `#050506` | Fundo de todas as telas. |
| `surface` | branco 6% | Preenchimento do vidro e de áreas agrupadas. |
| `surfaceStrong` | branco 12% | Item ativo (bolha da aba ativa, linha pressionada). |
| `surfaceSolid`, `surfaceStrongSolid` | `#141415`, `#232324` | As mesmas superfícies, opacas: face de botão que fica sobre um lábio colorido (`DuoButton` de erro e de sucesso, botão desativado). Com a face translúcida, o lábio vermelho ou verde aparecia através e escondia o texto (achado na Fase 7). |
| `border` | branco 10% | Borda de 1 px do vidro, divisórias. |
| `highlight` | branco 22% | Brilho da borda de cima do vidro. |
| `overlay` | preto 62% | Véu atrás de gaveta e de tela bloqueada. |
| `text` | `#F4F4F0` | Títulos, números, corpo (18,5:1 no fundo; 16:1 no vidro). |
| `textMuted` | `#A1A19A` | Rótulos e ajuda (7,8:1; 6,8:1 no vidro). |
| `brand` | `#C5F23A` | Ação principal, número positivo, aba ativa, anel de meta (15,7:1). |
| `brandLip` | `#9DC42A` | Lábio do botão principal e texto de "✓ salvo" (10:1). |
| `onBrand` | `#0B0F02` | Texto sobre o limão (14,9:1). |
| `onLight` | `#0B0B0C` | Texto sobre a pílula branca de selecionado. |
| `ai` / `aiSoft` | `#9AA8FF` / lavanda 14% | **Só a IA**: título do insight, balão da IA, coach (9:1). |
| `warning` | `#FFB020` | Meta em risco, MEI em 80% — sempre com "⚠" e texto. |
| `danger` | `#FF6464` | Prejuízo, erro, ação destrutiva (7:1). Nunca para gasto comum. |
| `gold` | `#F5C451` | Premium Plus, moedas da conquista. |
| `wave` / `bill` | `#FACC15` / `#22C55E` | Só a onda do `ConquistaButton` e as notinhas. |

Cores dos planos (cadeado e selo): Grátis `#8A8F98`, Pago `#C5F23A`, Premium `#9AA8FF`, Plus `#F5C451`, Barbearias `#F4F4F0`.

## Typography

Inter por peso (`Inter_400Regular`, `Inter_500Medium`, `Inter_600SemiBold`), sem `fontWeight` em cima. Todo número com `tabularNums`. Tamanhos: display 34 (número principal), title 28, h2 22, h3 20, body 17, bodySm 15, caption 13, tiny 12. Sem peso 700, sem caixa alta.

## Layout

- Base 4 px; margem lateral 16 px; 8 px dentro do grupo, 16–24 px entre grupos.
- **Leitura em cima, ação embaixo.** Barra de abas flutuante (cápsula de vidro, 64 px) a 8 px da borda de baixo + área segura; "+ Atendimento" redondo, verde, à direita dela. As telas das abas deixam 112 px livres embaixo.
- Início como painel: saudação na aurora, pílulas Hoje/Mês, dois cartões lado a lado, cartão grande do mês com quadradinhos dos dias, "Pergunte à IA".

## Elevation & Depth

- Profundidade **só por vidro**: preenchimento translúcido, desfoque, borda clara e brilho no alto. Sem sombra borrada.
- Nunca vidro sobre vidro: dentro de um cartão de vidro, os itens usam `surface` simples.
- O único elemento flutuante acima do conteúdo é a barra de abas; a gaveta (`BottomSheet`) é vidro escuro sobre o véu `overlay`.

## Shapes

Raios: `sm` 10 (barras de gráfico), `md` 16 (inputs, itens), `lg` 24 (cartões, gaveta), `pill` (botões, chips, barra de abas). Ícones: SF Symbols / Material Symbols (`expo-symbols`), traço regular.

## Components

Estados obrigatórios: normal, foco, pressionado, desativado, carregando, vazio, erro.

| Componente | Comportamento |
|---|---|
| `Vidro` | Base de todo vidro: `GlassView` (iOS 26) ou desfoque + véu + brilho; raio 24, borda 1 px. |
| `DuoButton` | Cápsula verde-limão com lábio sólido de 4 px (`brandLip`), texto escuro, altura 52; desce 4 px no toque e volta com `springBack`. |
| `SecondaryButton` | Cápsula de vidro, borda clara; escala 0,97 no toque. |
| `ConquistaButton` | "Pulo com dinheiro" (tabela abaixo), agora em cápsula limão. |
| `Chip` | Pílula de vidro; selecionado = pílula branca, texto escuro e "✓". |
| `Cartao` | Vidro com padding 16. |
| `BottomSheet` | Vidro escuro, raio 24 no alto, sobe com `springCalm`, véu `overlay`. |
| `InsightCard` | Vidro com tom lavanda, selo "IA". |
| `MetaRing` | Trilho translúcido, arco limão (âmbar em risco, com "⚠ Em risco"). |
| `LockedScreen` | Prévia real borrada + véu + cartão de vidro com cadeado na cor do plano. |
| `Aurora` | Manchas de cor desfocadas atrás do topo da tela (atmosfera, não decoração de conteúdo). |
| Barra de abas | Cápsula de vidro com 5 abas; a ativa ganha bolha `surfaceStrong`, ícone limão e rótulo em negrito. **A bolha desliza** da aba anterior até a tocada (20/11): 220 ms + 40 ms por aba de distância (máx. 380 ms), `easeOut` forte, sem quique, interrompível; as abas alargam e estreitam enquanto ela passa; o rótulo aparece quando a bolha chega. "Reduzir movimento": pula direto. |
| Calendário (Agenda) | Mês com domingo primeiro; dia escolhido na pílula branca (`text`/`onLight`), hoje com anel limão, ponto embaixo do dia com horário (limão: agendado; cinza: só feitos ou faltas). Células de 44 px com rótulo falado ("sexta, 21 de novembro, 1 horário"). |
| Grade do dia (Agenda) | Do horário de entrada ao de saída (expediente do dia; sem cadastro, 9h às 19h), 72 px por hora, pausa em faixa `surface`, fora do expediente com véu. Horário = bloco com borda esquerda de 4 px (limão: agendado; `brandLip`: feito; `warning`: faltou), hora, cliente, serviços e valor. Linha "agora" limão. Meia hora vazia é tocável e abre "Agendar" com a hora preenchida. Horários juntos dividem a largura. |
| CRM do agendamento | No topo da gaveta do horário: cliente (link limão com "›" para o cadastro), data, horário, profissional, serviços com preço e duração, e o valor; as ações (concluir, faltou, cancelar, ofertas) ficam embaixo. |
| Orbe da IA ("Fale com a IA") | Bolha lavanda (cor da IA) desenhada como um caminho SVG que se move: parado = respira; ouvindo = a borda segue o volume do microfone; pensando = ondula girando; falando = pulsa no ritmo da fala. Sempre com o estado escrito embaixo. "Reduzir movimento": círculo parado. Microfone lavanda redondo de 80 px; teclado e som em botões de 52 px. |

### ConquistaButton ("pulo com dinheiro", aprovado em 19/11)

Mesma tabela da versão 1: toque 0–60 ms (desce 4 px, 0,97); 2 ondas amarelas dentro do botão (0–630 ms); 12 peças (8 notas, 4 moedas) em leque de 150° (60 ms → ~1,2 s); sobe 48 px (60–300 ms); desce e achata 1,04 × 0,94 (300–540 ms); assenta (540–720 ms); vibração leve, média e de sucesso. Reduzir movimento: só troca de cor de 150 ms.

## Do's and Don'ts

**Faça:** um botão verde por tela; dinheiro só por `formatMoeda`; todo estado com texto ou sinal além da cor ("✓", "⚠", "▲", "▼"); gasto comum em texto neutro com "−"; prévia real borrada no lugar de tela vazia quando o plano não libera.
**Não faça:** sombra borrada; vidro sobre vidro; texto em degradê; lavanda fora da IA; confete ou pulo em ação do dia a dia; contagem regressiva, culpa ou cancelamento escondido; hex direto em componente (sempre `color.*`).

## Motion

Toque 60–100 ms (`easeOut`, volta com `springBack`); troca de estado 150–200 ms; gaveta ~300 ms com `springCalm`; número contando 800 ms; conquista ~1,2 s. Só `transform` e `opacity` (Reanimated 4). Reduzir movimento: sem onda, dinheiro e pulo; gaveta só com fade; anel e barras continuam (são informação). A aurora não se mexe (sem loop decorativo).

## Composição

As 4 regras do editor: nada de texto sobre texto (a aurora fica atrás e nunca atrás de número pequeno sem vidro); nenhum recorte no meio da tela (a onda é cortada só pela borda do próprio botão); o elemento principal por cima (o botão sobe à frente das notas; o vidro fica à frente da aurora); o que entra, entra de fora (a gaveta sobe da borda de baixo).

## Accessibility

Contrastes conferidos acima (todos ≥ 6:1). Toque ≥ 44 × 44 (botões 52, abas 56), 8 px entre alvos. Nada só por cor: aba ativa com bolha + negrito; chip com "✓"; risco com "⚠". Rótulos e estados para leitor de tela; "Salvo" e erros anunciados. Fonte grande: o layout empilha.

## Decision ledger

| Decisão | Fonte | Regra de papel | Por quê |
|---|---|---|---|
| Escuro + vidro líquido | Pedido do Daniel com 6 referências (20/11) | `Vidro` em cartões, gaveta e abas | visual premium de app financeiro moderno |
| Verde-limão `#C5F23A` como dinheiro e ação | Referências (acento limão) + regra "verde = dinheiro" do plano | só ação, positivo e aba ativa | mantém o significado do verde, no tom das referências |
| Lavanda `#9AA8FF` só para a IA | Regra do plano (IA com cor própria), ajustada ao escuro | título e balão da IA | separa "o que eu fiz" de "o que a IA sugere" |
| Pílula branca = selecionado | Referências (filtros "Conexões / Cartão") | `Chip` selecionado | contraste máximo e leitura imediata |
| Barra de abas em cápsula + "+" redondo | Referências | "+ Atendimento" em todas as abas | ação principal sempre ao alcance do polegar |
| Bolha que desliza na barra de abas | Daniel (20/11) | troca de aba sem animação | ele quer ver a seleção ir até a aba tocada; fica rápida e sem quique porque é usada dezenas de vezes por dia |
| Agenda com calendário e grade do dia | Daniel (20/11), estilo Booksy/AVEC | lista simples do dia | barbeiro pensa em horários; o expediente desenha a grade |
| Ficha com "Observações" livres | Daniel (20/11) | uma pergunta por assunto (bebida, assunto, preferências) | cada barbeiro anota do seu jeito; técnicas do cabelo e da barba ficam em campos próprios |
| Sem mascote | Daniel (20/11) | nota de dinheiro com asinhas | conquista mostra o ícone dela (bandeira, troféu, seta, selo) |
| Liquid Glass nativo no iOS 26 | `expo-glass-effect` (SDK 58) | `Vidro` | efeito real da Apple; desfoque no resto |
| Aurora em vez de ilustração | `ui-ux-pro-max` (gradiente só como atmosfera de hero) | atrás do topo | dá cor para o vidro refratar sem foto de terceiro |
| Paleta dos gráficos no escuro | Validador da skill `dataviz` (20/11): par `#6E8F1F` + `#C5F23A` ALL PASS | `src/theme/grafico.ts` | verde em dois tons, legível para daltônicos |
| Lábio do botão e "pulo com dinheiro" mantidos | Aprovados em 19/11 | `DuoButton`, `ConquistaButton` | o encanto continua só nas conquistas |

## Decisões em aberto

- Nome do app e logo (seção 12 da especificação).
- ~~Arte final do mascote no Rive.~~ Sem mascote (decisão do Daniel, 20/11/2026): a celebração mostra o ícone da conquista (bandeira, troféu, seta subindo, selo).
- Tema claro: fora do escopo (o app é escuro, como nas referências).
