# Skills de tipografia e composição de texto (busca de 30/10/2026)

Busca com `npx -y skills@1.7.2 find` ("typography", "typesetting", "editorial design", "type design", "font pairing", "typography hierarchy", "swiss design").

## Lidas inteiras e usadas no plano alimentar (ainda NÃO instaladas no repositório)

| Skill | Autor / licença | Instalações | O que tem de útil |
|---|---|---|---|
| `pbakaus/impeccable@typeset` | Paul Bakaus, Apache-2.0 | 64,7 mil | Método curto: avaliar papéis (título, corpo, rótulo, metadado, dado), poucas famílias, escala por papel, corpo ≥ 16 px, 45–75 caracteres, `text-wrap: balance` em título e `pretty` em texto, quebras de linha à mão só entre frases. Arquivo: `reference/typeset.md` dentro da skill `impeccable` (tem um script `detect` que não rodamos). |
| `wondelai/skills@web-typography` | Wondel.ai, MIT | 9,4 mil | Guia completo baseado em *On Web Typography* (Jason Santa Maria): ler vs. olhar ("type for a moment" × "type to live with"), escolher e combinar fontes, medidas (16–18 px, 1,5–1,7, 65ch), hierarquia com 3 alavancas (tamanho, peso, cor; nunca as três juntas), `clamp()`, carregamento de fonte, diagnóstico de 10 itens com nota. 5 arquivos de referência. |

## Outras achadas (não lidas)

- `pbakaus/impeccable@impeccable` (373 mil): skill grande de design, contém a `typeset`.
- `wondelai/skills@refactoring-ui` (9,5 mil), `wshobson/agents@visual-design-foundations` (13,8 mil), `ibelick/ui-skills@baseline-ui` (24,8 mil).
- `zeke/swiss-design-skill@swiss-design` (973): estilo suíço/grid.

## Como foi aplicado (plano alimentar, versão 2)

- Uma família só: **Archivo** (Google Fonts, variável em peso 100–900 e largura 62–125%, tem `tnum`). Papéis separados por peso e largura: display 800–900 expandido (118%) com tracking −0,035 a −0,045em; títulos 700–800; corpo 400 em 16 px / 1,6; rótulos 600 em 12 px caixa alta +0,06em; números tabulares nas tabelas.
- Escala 1,25 a partir de 16: 12 · 13 · 14 · 16 · 20 · 25 · 31 · 39 · 49 · 61 · 76 · 95 · 119.
- Título "Plano / alimentar" em duas linhas, entrelinha 0,86.
