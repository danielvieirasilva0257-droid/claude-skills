# Aprendizados: humanizer

Adendos datados. O mais novo fica embaixo. Os arquivos oficiais ficam intactos.

## 09/10/2026: entrada na base

- **Para que serve:** pega um texto com cara de IA e reescreve para soar como uma pessoa específica. Tem três modos: `detect` (só aponta os padrões e dá nota de 0 a 100), `rewrite` (o padrão) e `edit` (edita um arquivo no lugar). Tem cinco vozes: `casual`, `professional`, `technical`, `warm` e `blunt`.
- **Para texto de marketing, use `--purpose marketing`:** parágrafos curtos, benefícios concretos e **uma só** chamada para ação no final.
- **Regras que importam:**
  - **Nunca inventar fatos.** Se faltar um detalhe concreto, apontar a lacuna.
  - **Menos é mais.** Um tique isolado (um travessão, uma lista de três) não prova nada. Só um aglomerado de sinais conta. Texto que já tem "pulso" muitas vezes pede nenhuma edição.
  - Não mexer em citações, títulos, código e exemplos.
- **Ela é escrita para inglês.** Os padrões de vocabulário ("delve", "tapestry", "leverage") e as regras de pontuação são do inglês. Para o português do Brasil, valem os princípios (variar o tamanho das frases, trocar o abstrato pelo concreto, tomar posição, sem fechamento arrumadinho) e a lista de equivalentes do combo `skills/combos/combo-copy-humanizada/SKILL.md`.
- **A nota de 0 a 100 feita pelo próprio modelo infla o resultado**, como o `SKILL.md` avisa. Use como sinal, não como veredito. O teste final é o usuário ler em voz alta.
- **Quando usar:** sempre depois da `copywriting`, e também para revisar qualquer texto que soe "robótico".

## 12/10/2026: roteiro do Rotina v3

- `rewrite --purpose marketing`, voz `casual`. Tirou o tom de anúncio ("Aí cada coisa fica num app diferente", "cai direto no gráfico") sem mexer nos fatos nem na CTA. Antes e depois: `research_notes/Rotina v3 2026-10/roteiro/`.

## 04/11/2026: roteiro do Rotina v7

- Voz `casual`, `--purpose marketing`. Pouco a mexer: o roteiro já era feito de fatos do app (valores, nomes de telas). Trocou "Ah, e tem mais" (fórmula) por "O resto da rotina também mora aqui." e "Lança em dois toques" (não era verdade: o formulário tem mais passos) por "Anota na hora, com categoria e cartão."
