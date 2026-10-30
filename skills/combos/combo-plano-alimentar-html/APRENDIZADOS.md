# Aprendizados: combo-plano-alimentar-html

Adendos datados. O mais novo fica embaixo.

## 30/10/2026: o Daniel não gostou da serifa

- A Cormorant Garamond (pedida no prompt original) foi recusada: "não está interessante". Ele quer **sans serif, bold e composição tipográfica** forte.
- Trocado para **Archivo** (uma família só, peso 400–900, largura 100–125%). Display em 800–900 expandido, com tracking negativo; títulos 700–800; corpo 16 px. Base: `research_notes/Tipografia 2026-10/skills-de-tipografia.md` (skills `typeset` e `web-typography`).
- **Para próximos planos:** comece com sans bold. Serifa só se o Daniel pedir de novo.
- Cuidados com fonte larga e pesada:
  - tabela fica mais larga: `th` com tracking +0,04em, padding 10 px, coluna "Alimento" com `min-width` de 150 px e "Fonte" com 92 px; medir `scrollWidth - clientWidth` de cada `.tbl-wrap` (tem que dar 0 no desktop);
  - números de cartão pequeno: largura normal (100%) e 22 px, só o kcal fica expandido;
  - impressão: tamanhos em `pt` só no `@media print` (título 64pt, número da refeição 64pt, macros 24pt), senão a linha do tempo e os cartões vão para a página seguinte.
