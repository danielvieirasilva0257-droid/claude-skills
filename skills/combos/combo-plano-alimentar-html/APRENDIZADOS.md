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

## 30/10/2026: versão app (checklist diário)

- O Daniel pediu: emojis, tema **preto, vermelho, roxo e lilás com fundo em gradiente**, botões com animação de "pop", **opções com o nome do prato** (não "opção 1, 2, 3") e **checklist por alimento**, com os totais do dia (kcal, P, C, G) ao vivo no topo, em gráfico.
- Arquivo: `assets/app-plano-alimentar.html` (HTML único, JS puro, sem biblioteca). Publicado: https://claude.ai/artifact/V3cMiwpprb9UeoJQsdXAgA
- **Como as contas funcionam:**
  - cada alimento marcado soma; desmarcado não soma;
  - refeição inteira marcada (sem troca) mostra o **total oficial** do plano (evita a diferença de 0,1 do arredondamento);
  - troca brócolis ↔ couve-flor: total vira a soma dos itens;
  - "plano do dia" = soma das opções escolhidas; a proteína mostra a marca do mínimo (76,8 g).
- **Onde salva:** `localStorage` na hora (rápido, só no aparelho) + documento privado `data/users/<id>/<AAAA-MM-DD>` no banco do artifact (capacidades `db` e `user`), que vale em qualquer aparelho logado. Nem o dono lê `data/users/<id>/` pelo `ArtifactData`, então a conferência é pela própria página.
- **Animações (button-animation):** toque com escala 0,94 e volta com mola `cubic-bezier(.34,1.56,.64,1)`; check desenhado (stroke-dashoffset) com "pop"; janela de detalhes sobe da borda de baixo (regra 4 do editor: entra de fora do quadro); aviso (toast) também entra pela borda; `prefers-reduced-motion` desliga tudo.
- **Pegadinhas:**
  - barra fixa no topo cobre o item focado/rolado: `html { scroll-padding-top: 110px }`;
  - `background-attachment: fixed` falha no iOS: gradiente numa camada `position: fixed` com `z-index: -1`;
  - no celular a barra fixa quebrava em 2 linhas: `nowrap` e emojis escondidos abaixo de 640 px;
  - o script `scripts/montar-artifact.py` agora embute também fotos que estão em strings do JavaScript (e não repete a mesma foto).
- **Café e lanche têm uma opção só** (é o que o plano tem). Opções novas precisam de valores da TACO/rótulo pela skill `nutricionista-esportivo` e aprovação do Daniel.
