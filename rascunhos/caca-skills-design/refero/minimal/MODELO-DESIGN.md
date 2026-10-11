# [Nome do projeto] — DESIGN.md

<!--
Modelo em branco. Copie para a raiz do projeto como DESIGN.md e, no CLAUDE.md do projeto, adicione:
  "Antes de mudar qualquer UI, leia @DESIGN.md. Use cores, tipografia e espaçamento dele;
   campos, textos, estados e comportamento vêm do projeto."
Regras de preenchimento:
- Troque cada [colchete] por uma regra observada ou uma decisão deliberada. O que não souber, deixe em "Decisões em aberto".
- Todo valor precisa de um PAPEL (onde usar e onde NÃO usar). Hex sem papel não serve para o agente.
- Seções na mesma ordem do formato Refero (Extended), para o agente achar tudo.
-->

> [Estrela-guia em 1 linha: uma metáfora visual. Ex.: "caderno de estúdio em papel casca de ovo, tinta preta, uma faísca de cor só para a ação"]

**Tema:** [light | dark]
**Referência:** [URL da referência + data em que foi revisada] · **Público e tarefa:** [quem usa e para quê]

[Tese visual em 1 parágrafo (4–6 frases): canvas, voz tipográfica (display x texto), papel do acento, profundidade (bordas x sombras), raios, ritmo de espaço. Diga o que torna este sistema reconhecível.]

## Tokens — Cores (Tokens — Colors)

| Nome | Valor | Token | Papel (onde usar / onde nunca usar) |
|------|-------|-------|-------------------------------------|
| Canvas | `#[...]` | `--color-canvas` | Fundo da página. [Ex.: off-white, nunca #ffffff puro] |
| Superfície | `#[...]` | `--color-surface` | Cards e faixas, 1 degrau acima do canvas |
| Borda (hairline) | `#[...]` | `--color-border` | Divisórias e contornos de 1px |
| Texto principal | `#[...]` | `--color-text` | Títulos e corpo. Contraste ≥ 7:1 no canvas |
| Texto secundário | `#[...]` | `--color-text-muted` | Descrições. Contraste ≥ 4,5:1 |
| Texto terciário | `#[...]` | `--color-text-subtle` | Legendas/metadados. ≥ 3:1 e só em texto não essencial |
| Ação primária | `#[...]` | `--color-action` | SÓ o botão primário (1 por tela) e estado ativo |
| Acento (opcional) | `#[...]` | `--color-accent` | [Papel único. Ex.: só ilustração / só dados] |
| Foco | `#[...]` | `--color-focus` | Anel de foco `:focus-visible` |
| Erro / sucesso | `#[...]` / `#[...]` | `--color-danger` / `--color-success` | Só estados. Nunca decoração |

## Tokens — Tipografia (Tokens — Typography)

### [Fonte display] — títulos · `--font-display`
- **Substituta gratuita:** [ex.: Inter 300 / Instrument Serif]
- **Pesos:** [ex.: 300 ou 400 — 1 peso só]
- **Tamanhos:** [ex.: 40, 56, 72px]
- **Line height:** [0.95–1.1]
- **Letter spacing:** [−0.02em a 40px · −0.03em a 56px · −0.04em a 72px+]
- **Recursos OpenType:** [ex.: "ss01", "tnum" em números]
- **Papel:** [só ≥ 32px; nunca em botões, labels ou corpo]

### [Fonte de texto] — corpo e interface · `--font-text`
- **Substituta gratuita:** [ex.: Inter / system-ui]
- **Pesos:** [400 corpo, 500 botões e ênfase]
- **Tamanhos:** [12, 14, 16, 18, 20px]
- **Line height:** [1.5–1.6 no corpo; 1.2–1.3 em labels]
- **Letter spacing:** [0 no corpo; +0.01em a 12–14px; +0.06–0.08em em CAIXA ALTA]
- **Papel:** [tudo abaixo de 24px]

### [Fonte mono] (opcional) · `--font-mono`
- **Papel:** [só código, caminhos, IDs, metadados técnicos; 11–13px]

### Escala tipográfica (Type Scale)

| Papel | Família | Peso | Tamanho | Line height | Letter spacing | Token |
|-------|---------|------|---------|-------------|----------------|-------|
| caption | texto | 400 | [12px] | [1.4] | [+0.01em] | `--text-caption` |
| label / eyebrow (CAIXA ALTA) | texto ou mono | 500 | [12px] | [1.2] | [+0.08em] | `--text-eyebrow` |
| body-sm | texto | 400 | [14px] | [1.5] | [0] | `--text-body-sm` |
| body | texto | 400 | [16px] | [1.5–1.6] | [0] | `--text-body` |
| body-lg / lead | texto | 400 | [18–20px] | [1.5] | [0] | `--text-body-lg` |
| heading-sm | display | [400] | [24–28px] | [1.2] | [−0.01em] | `--text-heading-sm` |
| heading | display | [400] | [32–40px] | [1.1] | [−0.02em] | `--text-heading` |
| display | display | [300–400] | [56–72px] | [1.0–1.05] | [−0.03em] | `--text-display` |

**Largura de leitura:** parágrafos com `max-width: [60–68ch]` (≈ 540–680px). Títulos com `text-wrap: balance`.

## Tokens — Espaço e formas (Tokens — Spacing & Shapes)

**Unidade base:** [4px] · **Densidade:** [comfortable | compact | spacious]

### Escala de espaçamento (Spacing Scale)
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

### Raios (Border Radius) — no máximo 3 valores
| Elemento | Valor |
|----------|-------|
| botões e tags | [9999px (pílula) OU 4–6px (preciso)] |
| inputs | [igual aos botões ou 6–8px] |
| cards | [0 / 12 / 20–24px] |

### Sombras (Shadows)
| Nome | Valor | Token | Uso |
|------|-------|-------|-----|
| ring | `0 0 0 1px rgba(0,0,0,0.08)` | `--shadow-ring` | Contorno de card (no lugar de borda) |
| subtle | `[0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06)]` | `--shadow-subtle` | Só elementos flutuantes (menu, popover) |

### Layout
- **Largura máxima da página:** [1200–1280px]
- **Coluna de texto:** [540–680px]
- **Respiro entre seções:** [96px desktop / 64px mobile]
- **Padding de card:** [24–32px]
- **Gap entre elementos:** [8px; 16–24px entre grupos]
- **Margem lateral:** [24px mobile · 48–64px desktop]

## Componentes (Components)

### Botão primário
**Papel:** a única ação principal da tela.
[Fundo #..., texto #..., raio ..., padding 10–12px × 16–24px, altura 40–48px, fonte 14–16px peso 500. Sem sombra, sem gradiente. Hover: ... (150–200ms). Foco: anel 2px em --color-focus com offset 2px. Desabilitado: ...]

### Botão secundário (ghost/outline)
**Papel:** alternativa de menor compromisso, ao lado do primário.
[Fundo transparente, borda 1px --color-border, mesmo raio e altura do primário.]

### Link de texto
**Papel:** ação terciária e navegação.
[Cor do texto, seta → no fim OU sublinhado. Sublinhado no hover ou sempre (editorial).]

### Card
**Papel:** só quando o usuário interage com o contêiner. Se tirar borda/fundo/raio não atrapalhar, não é card.
[Fundo, raio, borda/ring, padding.]

### Campo de formulário (input)
[Altura, borda, raio, label acima, texto de ajuda, estado de erro com texto (não só cor).]

### Navegação (top bar)
[Altura 52–64px, transparente, logo à esquerda, até 5 links, CTA à direita. Comportamento no scroll.]

### [Outro componente do projeto]
[...]

## Faça e não faça (Do's and Don'ts)

### Faça
- [Regra com valor exato. Ex.: "Use --color-action só no botão primário, 1 por tela."]
- [...]
- [...]

### Não faça
- [Ex.: "Não use sombra para separar cards; use borda de 1px."]
- [Ex.: "Não crie uma segunda cor de acento."]
- [Ex.: "Não use negrito (700) na fonte display."]

## Superfícies (Surfaces)

| Nível | Nome | Valor | Para quê |
|-------|------|-------|----------|
| 1 | Canvas | `#[...]` | Fundo da página |
| 2 | Superfície | `#[...]` | Faixas e cards |
| 3 | Placa | `#[...]` | Pequenos elementos isolados (ícones, chips) |

## Elevação (Elevation)
- **[Nome]:** `[valor]` — [quando usar]

## Imagens (Imagery)
[Papel da mídia: screenshot do produto, foto, ilustração ou só tipografia. Proporção, recorte, raio, moldura, legenda. Se não houver imagem real: placeholder com proporção fixa e nota de direção de arte — nunca imagem falsa feita de CSS.]

## Layout (página)
[Modelo da página: hero (centralizado, assimétrico ou "a tipografia é o hero"), ritmo das seções, 1 foco visual por seção, como as seções se separam (respiro OU faixa de cor OU hairline — escolha um), rodapé.]

## Movimento (Motion)
[Durações 150–200ms em hover/focus; 250–400ms em entrada de seção; easing `cubic-bezier(0.4, 0, 0.2, 1)`; mola só no momento-assinatura; respeitar `prefers-reduced-motion`. Skills: motion-oficial, button-animation.]

## Acessibilidade
- Texto principal ≥ 7:1; corpo ≥ 4,5:1; texto grande (≥ 24px) e ícones ≥ 3:1.
- Alvo de toque ≥ 44 × 44px. Foco visível em todo elemento interativo.
- Erro com texto e ícone, não só cor.

## Guia para o agente (Agent Prompt Guide)

**Referência rápida de cores**
- texto: [#...] (principal), [#...] (corpo), [#...] (legenda)
- fundo: [#...] (canvas), [#...] (superfície)
- borda: [#...]
- ação primária: [#...]

**Exemplos de prompts de componente (3–5)**
1. [Ex.: "Crie o título do hero: 'Texto' em 64px [fonte] peso 400, #..., letter-spacing −0.03em, line-height 1.05, alinhado à esquerda no canvas #...".]
2. [Botão primário com todos os valores.]
3. [Card com todos os valores.]

## Marcas parecidas (Similar Brands)
- **[Marca]** — [o que compartilha com este sistema]

## Decisões em aberto
- [O que a referência não diz sobre o nosso produto: estados vazios/carregando/erro, comportamento responsivo, dark mode, conteúdo real...]

## Início rápido (Quick Start)

### CSS Custom Properties
```css
:root {
  /* Cores */
  --color-canvas: #[...];
  --color-surface: #[...];
  --color-border: #[...];
  --color-text: #[...];
  --color-text-muted: #[...];
  --color-action: #[...];
  /* Tipografia */
  --font-display: '[...]', ui-serif, Georgia, serif;
  --font-text: '[...]', ui-sans-serif, system-ui, sans-serif;
  --text-body: 16px;  --leading-body: 1.5;
  --text-display: 64px; --leading-display: 1.05; --tracking-display: -0.03em;
  /* Espaço e formas */
  --space-unit: 4px;
  --radius-button: [...];
  --radius-card: [...];
  --shadow-ring: 0 0 0 1px rgba(0,0,0,0.08);
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
  --font-display: '[...]', ui-serif, Georgia, serif;
  --font-text: '[...]', ui-sans-serif, system-ui, sans-serif;
  --radius-button: [...];
  --radius-card: [...];
}
```
