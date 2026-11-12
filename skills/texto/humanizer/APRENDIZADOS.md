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

## 17/10/2026: roteiro de vídeo com falas curtas (Rotina v6)

- O aviso de "três falas seguidas com tamanho parecido" dispara fácil com falas de 8 a 11 palavras. Julgue pela forma das frases e pelo CoV do roteiro todo, como a guarda da skill manda.
- Em roteiro que passeia pelas abas do app, as falas tendem a começar todas com "No X," ("No Rotina", "Nos hábitos", "No financeiro"). Confira as aberturas seguidas. Detalhes: `projetos/rotina/PASSO-A-PASSO.md` (item 9).
