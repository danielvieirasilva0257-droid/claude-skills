# [Nome do projeto] — DESIGN.md

<!--
MODELO EM BRANCO (skill estilos-premium). Copie para a raiz do projeto como DESIGN.md.
No CLAUDE.md do projeto, acrescente:
  ## Visual
  Antes de mudar qualquer interface, leia @DESIGN.md.
  Use as cores, a tipografia, o espaço e o movimento dele.
  Campos, textos, estados e comportamento vêm do projeto, não da referência.

Como preencher:
- Troque cada [colchete] por uma REGRA OBSERVADA na referência ou por uma DECISÃO DE PROPÓSITO.
  O que não souber vai em "Decisões em aberto". Não invente.
- Todo valor precisa de um PAPEL: onde usar e onde NUNCA usar. Hex sem papel não serve.
- Escreva com as nossas palavras. Nunca cole aqui um DESIGN.md baixado do Refero ou de outra biblioteca
  (os termos proíbem republicar). Valores pontuais medidos ("corpo de 17 px") podem ser anotados.
- Fontes comerciais: anote a substituta livre que vamos usar.
- A ordem das seções segue o formato DESIGN.md comum (tokens → componentes → regras → guia para o agente),
  para o agente achar tudo.
-->

> [Estrela-guia em 1 linha: uma metáfora visual. Ex.: "vitrine branca, um único interruptor azul para comprar"]

**Tema:** [claro | escuro] · **Arquétipo:** [Galeria clara | Palco escuro | Instrumento de precisão | Editorial | Estúdio animado]
**Referência principal:** [nome + link + data em que foi vista] · **Secundárias (só detalhes):** [1–2]
**Público e tarefa:** [quem usa e para quê]

[Tese visual em 1 parágrafo (4 a 6 frases): fundo, voz da tipografia (título × texto), papel da cor de ação, profundidade (linhas × sombras), raios, ritmo de espaço e movimento. O que torna este sistema reconhecível?]

## Trava da referência

- **Preservar (3 a 5 traços):** [ex.: título de 80 px peso 600; um só azul no CTA; fundo alternado sem linhas]
- **Pegar emprestado (1 a 2 detalhes):** [ex.: barra de vidro ao rolar]
- **Mídia:** [foto do produto isolada | cinema em tela cheia | screenshot real | só tipografia]
- **Rejeitar:** [ex.: sombras em cards; segunda cor; serifa decorativa]

## Tokens — Cores

| Nome | Valor | Token | Papel (onde usar / onde NUNCA usar) |
|------|-------|-------|-------------------------------------|
| Fundo | `#[...]` | `--color-canvas` | Fundo da página. [Ex.: quase branco; nunca #ffffff na página toda] |
| Superfície | `#[...]` | `--color-surface` | Cards e faixas, 1 degrau acima do fundo |
| Placa | `#[...]` | `--color-plate` | Ícones, chips e pequenos isolados |
| Linha | `#[...]` | `--color-border` | Divisórias e contornos de 1 px |
| Texto principal | `#[...]` | `--color-text` | Títulos e corpo. Contraste ≥ 7:1 no fundo |
| Texto secundário | `#[...]` | `--color-text-muted` | Descrições. ≥ 4,5:1 |
| Legenda | `#[...]` | `--color-text-subtle` | Metadados. ≥ 3:1, só texto não essencial |
| Ação | `#[...]` | `--color-action` | SÓ o botão primário (1 por tela) e o estado ativo |
| Acento (opcional) | `#[...]` | `--color-accent` | [Papel único. Ex.: só ilustração / só dados] |
| Foco | `#[...]` | `--color-focus` | Anel de `:focus-visible` |
| Erro / sucesso | `#[...]` / `#[...]` | `--color-danger` / `--color-success` | Só estados, nunca decoração |

## Tokens — Tipografia

### [Fonte do título] · `--font-display`
- **Substituta livre:** [ex.: Inter, Inter Tight, Instrument Serif]
- **Pesos:** [1 só, entre 300 e 600]
- **Tamanhos:** [ex.: 40, 56, 72, 96 px]
- **Entrelinha:** [0,95–1,1]
- **Tracking:** [−0,02 em a 40 px · −0,03 em a 56–64 px · −0,04 em a 72 px+]
- **Recursos OpenType:** [ex.: "ss01"; "tnum" em números]
- **Papel:** [só ≥ 24–32 px; nunca em botão, rótulo ou corpo]

### [Fonte do texto] · `--font-text`
- **Substituta livre:** [ex.: Inter / system-ui]
- **Pesos:** [400 no corpo, 500 em botão e ênfase]
- **Tamanhos:** [12, 14, 16 ou 17, 18, 20 px]
- **Entrelinha:** [1,5–1,6 no corpo; 1,2–1,3 em rótulos]
- **Tracking:** [0 no corpo; +0,01 em a 12–14 px; +0,06–0,10 em em CAIXA ALTA]
- **Papel:** [tudo abaixo de 24 px]

### [Fonte mono] (opcional) · `--font-mono`
- **Papel:** [só código, IDs, metadados técnicos; 11–13 px]

### Escala tipográfica

| Papel | Família | Peso | Tamanho | Entrelinha | Tracking | Token |
|-------|---------|------|---------|------------|----------|-------|
| legenda | texto | 400 | [12px] | [1,4] | [+0,01em] | `--text-caption` |
| rótulo (CAIXA ALTA) | texto ou mono | 500 | [12px] | [1,2] | [+0,08em] | `--text-eyebrow` |
| corpo pequeno | texto | 400 | [14px] | [1,5] | [0] | `--text-body-sm` |
| corpo | texto | 400 | [16–17px] | [1,47–1,6] | [0] | `--text-body` |
| destaque | texto | 400 | [18–21px] | [1,4] | [0] | `--text-lead` |
| título pequeno | título | [..] | [24–28px] | [1,2] | [−0,01em] | `--text-heading-sm` |
| título | título | [..] | [32–48px] | [1,1] | [−0,02em] | `--text-heading` |
| display | título | [300–600] | [56–96px] | [1,0–1,05] | [−0,03em] | `--text-display` |

**Largura de leitura:** parágrafos com `max-width: [60–68ch]`. Títulos com `text-wrap: balance`. No celular, o display usa `clamp([..])`.

## Tokens — Espaço e formas

**Unidade base:** [4px] · **Densidade:** [confortável | compacta | espaçosa]

| Nome | Valor | Token |
|------|-------|-------|
| 1 | 4px | `--space-1` |
| 2 | 8px | `--space-2` |
| 3 | 12px | `--space-3` |
| 4 | 16px | `--space-4` |
| 6 | 24px | `--space-6` |
| 8 | 32px | `--space-8` |
| 12 | 48px | `--space-12` |
| 16 | 64px | `--space-16` |
| 24 | 96px | `--space-24` |
| 32 | 128px | `--space-32` |

### Raios (no máximo 3 valores; escolha UMA escola)
| Elemento | Valor |
|----------|-------|
| botões e tags | [9999px (macia) OU 0–6px (precisa)] |
| campos | [igual aos botões ou 6–8px] |
| cards e mídia | [12–28px (macia) OU 0–6px (precisa)] |

### Sombras
| Nome | Valor | Token | Uso |
|------|-------|-------|-----|
| anel | `0 0 0 1px rgba(0,0,0,0.08)` | `--shadow-ring` | Contorno de card, no lugar de borda |
| flutuante | `[0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06)]` | `--shadow-float` | Só menu e popover |

### Layout
- **Largura máxima:** [1200–1280px] · **Coluna de texto:** [540–680px]
- **Entre seções:** [96px no desktop / 56–64px no celular] · **Separação:** [respiro OU faixa alternada OU linha de 1 px — só uma]
- **Padding de card:** [24–32px] · **Gaps:** [8px no grupo; 16–24px entre grupos]
- **Margem lateral:** [24px no celular · 48–64px no desktop]

## Componentes (com todos os estados)

### Botão primário
**Papel:** a única ação principal da tela.
[Fundo, texto, raio, altura de 40–48px, padding de 10–12 × 16–24px, fonte de 14–17px com peso 500. Sem sombra e sem gradiente. Hover: [cor] em 150–200ms. Toque: escala de 0,97. Foco: anel de 2px em --color-focus com afastamento de 2px. Desativado: opacidade 0,4, sem animação. Carregando: [..].]

### Botão secundário
**Papel:** alternativa ao lado do primário. [Contorno de 1px em --color-border; mesmo raio e altura.]

### Link
**Papel:** ação terciária. [Seta › ou → no fim; sublinhado no hover (ou sempre, se editorial).]

### Card
**Papel:** só quando há interação com o contêiner (teste: se tirar borda, fundo e raio não atrapalha, não é card).
[Fundo, raio, anel, padding. Hover: [..].]

### Campo
[Altura, borda, raio, rótulo acima, ajuda, erro com texto (não só cor).]

### Barra de navegação
[Altura de 44–64px; logo à esquerda; até 5 links; CTA à direita. Ao rolar: fundo com ≥ 80% de opacidade + blur + linha de 1px.]

### [Outro componente do projeto]
[..]

## Faça e não faça

### Faça
- [Regra com valor exato. Ex.: "Use --color-action só no botão primário, 1 por tela."]
- [..]

### Não faça
- [Ex.: "Não use sombra para separar cards; use linha de 1px."]
- [Ex.: "Não crie uma segunda cor de acento."]
- [Ex.: "Não use peso 700 no título."]

## Superfícies
| Nível | Nome | Valor | Para quê |
|-------|------|-------|----------|
| 1 | Fundo | `#[...]` | Página |
| 2 | Superfície | `#[...]` | Faixas e cards |
| 3 | Placa | `#[...]` | Pequenos isolados |

## Elevação
- **[Nome]:** `[valor]` — [quando usar]

## Imagens
[Papel da mídia: foto do produto, cinema, screenshot, ilustração ou só tipografia. Proporção, raio, moldura (de preferência nenhuma). Sem imagem real: placeholder de proporção fixa com nota de direção de arte; nunca imagem falsa feita em CSS.]

## Layout da página
[Modelo do hero (a tipografia é o hero | pilha centralizada | assimétrico); ordem das seções; 1 foco por seção; rodapé.]

## Movimento
- **Personalidade:** [utilidade quieta | premium com peso | estúdio cinematográfico | lúdico]
- **Durações:** toque [100ms] · hover [150ms] · estado [300ms] · entrada ao rolar [700ms] · hero [1,2s]
- **Curvas de assinatura (1–2):** [ex.: `cubic-bezier(.19,1,.22,1)` para chegadas; `cubic-bezier(.4,0,.2,1)` para hover]
- **Podem animar:** [opacity, transform/scale, color, background-color, border-color]
- **Nunca animam:** [sombra, fundo de área grande, largura/altura, texto do hero no carregamento]
- **Único movimento contínuo da página:** [ex.: marquee de logos de 60s | nenhum]
- **Mola:** [nenhuma | só no objeto de marca, sem passar do ponto no texto]
- **Movimento reduzido:** [o que desliga e o que fica (opacidade)]
- Skills: `motion-oficial`, `button-animation`, `estilos-premium/references/movimento-sites.md`.

## Composição (regras do editor)
- [ ] Nenhum texto ou logo sobre texto, inclusive durante o movimento e sob a barra fixa.
- [ ] Nenhum recorte no meio da tela; corte só em borda real (botão, card, foto, celular, janela).
- [ ] Camadas: fundo → texto e cards → produto. O produto não cobre texto antes da leitura.
- [ ] Todo texto que entra vem da borda da janela, de trás do produto ou do gatilho.

## Acessibilidade
- Texto principal ≥ 7:1; corpo ≥ 4,5:1; texto grande e ícones ≥ 3:1.
- Alvo de toque ≥ 44 × 44 px. Foco visível em todo elemento interativo.
- Erro com texto e ícone, não só cor. Carrossel e vídeo automáticos com pausa.

## Guia para o agente

**Referência rápida de cores**
- texto: [#..] (principal), [#..] (secundário), [#..] (legenda)
- fundo: [#..] (fundo), [#..] (superfície)
- linha: [#..]
- ação: [#..]

**Exemplos de pedido de componente (3 a 5)**
1. [Ex.: "Título do hero 'Texto' em 72 px [fonte] peso 600, #.., tracking −0,03 em, entrelinha 1,05, centralizado no fundo #.."]
2. [Botão primário com todos os valores.]
3. [Card com todos os valores.]

## Decisões (de onde veio cada escolha)

| Decisão | Fonte | Regra ou papel | Por quê |
|---------|-------|----------------|---------|
| [Paleta / tipo / layout / mídia] | [referência, pedido do Daniel ou regra da skill] | [..] | [..] |

## Marcas parecidas
- **[Marca]:** [o que compartilha com este sistema]

## Decisões em aberto
- [O que a referência não diz sobre o nosso produto: estados vazio, carregando e erro; celular; modo escuro; conteúdo real...]

## Início rápido

### Variáveis CSS
```css
:root {
  /* Cores */
  --color-canvas: #[...];
  --color-surface: #[...];
  --color-border: #[...];
  --color-text: #[...];
  --color-text-muted: #[...];
  --color-action: #[...];
  --color-focus: #[...];
  /* Tipografia */
  --font-display: '[...]', ui-sans-serif, system-ui, sans-serif;
  --font-text: '[...]', ui-sans-serif, system-ui, sans-serif;
  --text-body: 16px; --leading-body: 1.5;
  --text-display: 72px; --leading-display: 1.05; --tracking-display: -0.03em;
  /* Espaço e formas */
  --space-unit: 4px;
  --radius-button: [...];
  --radius-card: [...];
  --shadow-ring: 0 0 0 1px rgba(0,0,0,0.08);
  /* Movimento */
  --dur-tap: 100ms; --dur-hover: 150ms; --dur-state: 300ms; --dur-reveal: 700ms;
}
```

### Tailwind v4
```css
@theme {
  --color-canvas: #[...];
  --color-surface: #[...];
  --color-border: #[...];
  --color-ink: #[...];
  --color-muted: #[...];
  --color-action: #[...];
  --font-display: '[...]', ui-sans-serif, system-ui, sans-serif;
  --font-text: '[...]', ui-sans-serif, system-ui, sans-serif;
  --radius-button: [...];
  --radius-card: [...];
  --ease-standard: cubic-bezier(.4,0,.2,1);
  --ease-out-expo: cubic-bezier(.19,1,.22,1);
}
```
