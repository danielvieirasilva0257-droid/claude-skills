# Rotina v6: etapa 2, humanizado (skill `humanizer`)

Combo seguido: `skills/combos/combo-copy-humanizada/SKILL.md`, passos 4 e 5. A entrada é o roteiro v1 de `1-copy.md` (108 palavras).

## Parâmetros

- **Chamadas equivalentes:**
  1. `/humanizer "<roteiro v1>" --mode detect`;
  2. `/humanizer "<roteiro v1>" --mode rewrite --voice casual --purpose marketing --score`.
- **Por que esses parâmetros:**
  - `casual`: a tabela do combo indica essa voz para "anúncio ou Reels com energia", e a Leda é a voz animada.
  - `marketing`: frases curtas, benefício concreto e **uma só** CTA no fim.
  - O `detect` veio antes, como o combo pede, para mexer só no que de fato soa como IA, trava na voz ou passa do tamanho.
- **Leitura da voz (passo 3 da skill):** "Leio isto como: narração de Reels vertical de ~36 s, para quem treina musculação (20 a 40 anos), registro casual, falado."
- **`humanizer-context.md`:** não existe. Seguiu-se sem ele.
- **Adaptação ao português e à narração:**
  - A skill é escrita para inglês. Usei a lista pt-BR do combo ("Português do Brasil: o que procurar").
  - A voz `casual` entra pela escolha das palavras da academia ("fechou doze", "subir a carga", "bateu recorde"), não pela grafia ("cê", "tá"), que sai pior na Leda.
  - O texto tem mais de 40 palavras, então a nota vale como sinal (a skill avisa que a nota feita pelo próprio modelo infla).

## Detect na v1 (relatório)

- **Padrões encontrados:** 4 (gravidade baixa a média).
- **Ritmo:** falas de 8, 11, 7, 5, 14, 11, 14, 9, 10, 11, 4 e 4 palavras (CoV 0,37, variado).
- **Chance de soar como IA:** baixa a média. O problema maior é outro: o texto lê a tela em vez de falar com quem treina, e está longo demais.

| Padrão | Trecho | Por que pega | Correção |
|---|---|---|---|
| **P18 Registro formal** (e *Customer language* da `copywriting`) | "Fez doze repetições em todas as séries, o app avisa para aumentar a carga" | É o aviso do app ("Você chegou em 12 repetições em todas as séries. Aumente a carga") lido como frase. Na academia ninguém fala "aumentar a carga". | "Fechou doze em todas, o app manda subir a carga." |
| **P50 Construção sem agente** | "aparece novo recorde" | O recorde "aparece" sozinho; não se sabe quem faz o quê. | O app vira o sujeito: "ele calcula...". |
| **P36 Mudança de registro** (e regra *marketing*: uma CTA só) | "Defina a meta de cardio e veja quanto falta." | Ordem de manual no meio de um texto que conta o que acontece. Dois imperativos no meio soam como uma CTA a mais antes da CTA. | "E a meta de cardio mostra quanto falta." |
| **Frase de propaganda "all-in-one"** (`ai-tells.md`, *Marketing Phrases*) | "Tudo num app só." | Sozinha, qualquer app diria isso. | **Mantida** de propósito (ver "Antes e depois"). |

**Outros pontos corrigidos.** Não são tiques de IA; vêm da voz, do gancho e do pedido:

| Ponto | Trecho | Problema | Correção |
|---|---|---|---|
| Sigla que trava na voz (combo: "sem siglas confusas") | "o seu 1RM estimado" | A Leda vai ler "um erre eme". Quem não treina não sabe o que é. | Dizer o que a sigla quer dizer: "quanto você pegaria numa repetição". O "1RM estimado" fica no cartão da tela. |
| Abstração (*Concretizer pass*) e laço aberto (alma nº 9, *callbacks*) | "a evolução de cada exercício" | "Evolução" é rótulo. E o gancho pergunta pelo **supino**, mas a resposta fala de "cada exercício". | "o supino semana a semana, mês a mês". Fecha o laço do gancho. |
| Palavra do cliente | "Você ajusta" | O Daniel disse "mudar repetições, séries". | "Você muda séries e repetições." |
| Tamanho (*marketing*: curto) | 108 palavras | Pela regra de 2,5 palavras/s, 43 s. O teto é 38 s. | Cortes onde a tela já mostra: "de exercícios" (fala 3), "de dias" (fala 9), mais o que as correções acima encurtaram. |

**Placar da v1:** 4 × 4 padrões = 16, mais 6,5 de ritmo, mais 0 de vocabulário = **22,5/100** (faixa "Mostly human"). A conta está no fim deste arquivo.

## Reescrita (versão final, 94 palavras)

```
Quanto você pegava no supino três meses atrás?
No Rotina, cada semana tem um estilo: hipertrofia, força, potência, deload.
Cada treino vira um checklist.
Você muda séries e repetições.
Fechou doze em todas, o app manda subir a carga.
Bateu recorde, ele calcula quanto você pegaria numa repetição.
O gráfico mostra o supino semana a semana, mês a mês.
E a meta de cardio mostra quanto falta.
Nos hábitos, outro checklist, e a sequência sobe.
No financeiro, o que entra, o que sai e quanto sobra.
Tudo num app só.
Baixe o Rotina agora.
```

**Resumo das mudanças:**
- Sete falas mexidas (3, 4, 5, 6, 7, 8 e 9). Cinco iguais (1, 2, 10, 11 e 12).
- Saíram 14 palavras: de 108 para 94.
- A voz casual entrou pelas palavras da academia; o rótulo de tela e a sigla saíram.
- O gancho agora fecha na fala 7, e "pegaria" (fala 6) ecoa o "pegava" do gancho.
- As falas variam de 4 a 11 palavras (CoV 0,33).
- Convergiu em 1 passada.

## Autocrítica: "o que ainda faz isto soar como IA?" (passo 5 da skill)

1. **As falas 5 e 6 têm a mesma forma** ("Fechou X, o app faz Y." / "Bateu X, ele faz Y."). São só duas seguidas, a regra da skill permite, e é assim que se fala na academia. A fala 7 quebra a forma.
2. **As falas 5, 6 e 7 têm tamanhos parecidos** (10, 9 e 11). A forma das três é diferente e cada uma é um cartão diferente na tela. A guarda da skill diz que tamanho parecido, sozinho, não prova nada. Fica.
3. **"Tudo num app só." continua genérica.** Fica pelos motivos da tabela abaixo; a troca pronta está nas alternativas.

Nenhum dos três pede outra passada.

## Antes e depois

| Antes (v1) | Depois (final) | Por quê |
|---|---|---|
| Quanto você pegava no supino três meses atrás? | igual | Já soa falado ("pegava" é palavra da academia) e pergunta um número que a pessoa não sabe. A skill manda não mexer no que já tem pulso. |
| No Rotina, cada semana tem um estilo: hipertrofia, força, potência, deload. | igual | Quatro estilos reais, na ordem de um bloco de treino. O dois-pontos é rótulo de lista, não revelação. |
| Cada treino vira um checklist de exercícios. (7) | Cada treino vira um checklist. (5) | A tela mostra os exercícios. Fica mais seca e abre espaço para o "outro checklist" da fala 9. |
| Você ajusta séries e repetições. | Você muda séries e repetições. | A palavra do Daniel. |
| Fez doze repetições em todas as séries, o app avisa para aumentar a carga. (14) | Fechou doze em todas, o app manda subir a carga. (10) | Troca o aviso da tela pela fala da academia. "Todas" pega as "séries" da fala anterior. O aviso inteiro ("Aumente a carga (+2,5 kg)") fica no cartão. |
| Bateu a marca, aparece novo recorde e o seu 1RM estimado. (11) | Bateu recorde, ele calcula quanto você pegaria numa repetição. (9) | Tira a sigla e diz o que ela é. O app vira o sujeito. "Pegaria" ecoa o "pegava" do gancho e as palavras do Daniel ("quais cargas você conseguiria pegar"). "Calcula" é honesto: o 1RM é estimado. |
| O gráfico mostra a evolução de cada exercício, semana a semana, mês a mês. (14) | O gráfico mostra o supino semana a semana, mês a mês. (11) | Fecha o laço do gancho, como "sobra?" e "quanto sobra" no v5. O rótulo "evolução" sai. |
| Defina a meta de cardio e veja quanto falta. (9) | E a meta de cardio mostra quanto falta. (8) | Sai o tom de manual e a CTA a mais. O "E" liga com o gráfico e evita duas falas seguidas no molde "X mostra Y". |
| Nos hábitos, outro checklist, e a sequência de dias cresce. (10) | Nos hábitos, outro checklist, e a sequência sobe. (8) | A tela mostra "dias seguidos". "Sobe" é mais falado e afasta a frase do v2 ("veja a sua sequência crescer"). |
| No financeiro, o que entra, o que sai e quanto sobra. | igual | São as palavras do v5 aprovado, e o Daniel pediu o financeiro "assim como você fez nesse vídeo". O trio quebra o paralelo de propósito ("o que", "o que", "quanto"). |
| Tudo num app só. | igual | **Mantida de propósito**, apesar do alerta "all-in-one": (1) é verdade, porque treino, hábitos e dinheiro ficam no mesmo app; (2) chega depois das três áreas, então vira fato e passa no teste de troca contra apps só de treino; (3) é a sugestão do pedido. Se o Daniel quiser o diferencial dito com fatos, como no v5: "Treino, hábitos e dinheiro, num app só." (+3). |
| Baixe o Rotina agora. | igual | A CTA aprovada, uma só, no fim. |

## Distância das versões anteriores (checagem proposta no v3, linha a linha)

| Final v6 | Mais parecido no v2, v3 ou v5 | Veredito |
|---|---|---|
| Quanto você pegava no supino três meses atrás? | v5: "Você sabe quanto ganha por mês, mas sabe quanto sobra?" | Mesma ideia (perguntar um número que a pessoa não sabe), palavras e molde diferentes. OK. |
| No Rotina, cada semana tem um estilo: hipertrofia, força, potência, deload. | v2: "Defina o estilo de cada semana: força, hipertrofia, resistência ou deload." | A mesma função (é o recurso do app). A frase é outra e a lista mudou de ordem e de item. OK. |
| Cada treino vira um checklist. | v3: "Você planeja a semana: segunda peito, terça costas." | Nova. |
| Você muda séries e repetições. | v2: "Registre carga, repetições e séries..." | Outra ação (mudar, não registrar). OK. |
| Fechou doze em todas, o app manda subir a carga. | nada parecido | Nova (o aviso de subir carga nunca foi falado). |
| Bateu recorde, ele calcula quanto você pegaria numa repetição. | nada parecido na voz (o recorde só apareceu na tela do v2 ao v4) | Nova. |
| O gráfico mostra o supino semana a semana, mês a mês. | v2: "Os gráficos mostram, semana a semana, o quanto você evoluiu." | **Parecida** no "gráfico... semana a semana", que é o recurso. O supino e o "mês a mês" são novos. OK. |
| E a meta de cardio mostra quanto falta. | nada parecido | Nova. |
| Nos hábitos, outro checklist, e a sequência sobe. | v2: "...veja a sua sequência crescer." v3: "Cada dia cumprido soma um no foguinho." | A mesma função, frase nova. OK. |
| No financeiro, o que entra, o que sai e quanto sobra. | v5: "...você anota o que entra e o que sai, e vê quanto sobra no mês." | **Quase igual, de propósito:** o Daniel pediu o financeiro como no v5. |
| Tudo num app só. | v5 (rascunho): "Num app só." v2: "Um app só." | **Quase igual.** Mantida porque é a sugestão do pedido; a troca está nas alternativas. |
| Baixe o Rotina agora. | v2 e v3: "Baixe o Rotina agora. Link na bio." | É a CTA aprovada. |

## Reconferência depois de humanizar (passo 5 do combo)

- **Os fatos continuam iguais?** Sim. Cada fala aponta para um item da lista de funções confirmadas:

  | Fala | Fato do app |
  |---|---|
  | 1 | pergunta; não afirma nada |
  | 2 | Planejar: cada semana do mês (1 a 4) recebe um plano com um estilo; Hipertrofia, Força, Potência e Deload existem |
  | 3 | cada dia tem o treino do dia, com a lista de exercícios para marcar como feito |
  | 4 | a pessoa muda a faixa de repetições e o modo de volume (séries) do estilo |
  | 5 | ao bater o máximo de repetições em todas as séries, o app avisa para subir a carga; 12 é o máximo da hipertrofia (8 a 12) |
  | 6 | "Novo recorde! 1RM estimado": a carga máxima para uma repetição, calculada pelas séries |
  | 7 | gráfico de evolução de cada exercício ao longo das semanas e dos meses |
  | 8 | meta semanal de cardio com "Faltam 30 min" |
  | 9 | checklist de hábitos do dia e sequência de dias seguidos que cresce |
  | 10 | entradas e saídas do mês e quanto sobra |
  | 11 | um app com Hábitos, Treinos e Financeiro |

  Nada de preço, relógio, outros apps, inteligência artificial, notificação no celular, personal ou dieta automática. Nenhum número dito além de "doze" (o exemplo da hipertrofia) e "três meses" (dentro da pergunta).
- **Ficou claro?** Sim. As trocas tiraram rótulo e sigla e puseram o que a pessoa fala. O "doze em todas" depende da fala 4 ("séries") e da tela; a versão mais explícita está nas alternativas.
- **A CTA continua única, clara e no fim?** Sim. O imperativo da fala 8 saiu, então "Baixe" é o único imperativo do roteiro.
- **Trocou um tique por outro?** Não.
  - "Checklist" aparece duas vezes (falas 3 e 9) de propósito: é o "várias checklists" do Daniel.
  - "Supino" aparece duas vezes (falas 1 e 7) de propósito: é o retorno do gancho.
  - "Mostra" aparece nas falas 7 e 8: o mesmo verbo para a mesma coisa (a tela mostra). A skill manda repetir o termo em vez de alternar sinônimos (P11/P31).
  - "No/Nos" abre as falas 9 e 10: são os nomes das abas e servem de placa para quem vê sem som. Duas seguidas, dentro do limite.

## Conferência final (passo 5 da skill)

1. **Leitura em voz alta, de cabeça:**
   - o gancho sobe na pergunta e fecha em "atrás?";
   - a lista da fala 2 tem uma pausa em cada vírgula (um cartão de semana por palavra);
   - as falas 3 e 4 caem secas, curtas;
   - "Fechou doze em todas" e "Bateu recorde" soam como conversa de academia;
   - a fala 7 tem duas partes no fim ("semana a semana, | mês a mês");
   - "Tudo num app só." e "Baixe o Rotina agora." fecham curto.
   - Nenhuma frase trava.
2. **Abertura:** é gancho, não visão geral.
3. **Final:** a CTA, sem fecho genérico.
4. **Lista proibida:** nenhuma palavra ("revolucione", "potencialize", "jornada", "transforme"). O rótulo "evolução" também saiu.
5. **Travessões:** zero. **Exclamações:** zero. **Perguntas:** uma, a do gancho.
6. **Tamanho das falas:** 8, 11, 5, 5, 10, 9, 11, 8, 8, 11, 4 e 4. Pares de mesmo tamanho (3 e 4; 8 e 9; 11 e 12) têm formas diferentes.
7. **Quem escreveu isto?** Alguém que treina e fala como na academia ("quanto você pega no supino", "fechou doze", "subir a carga").
8. **Cuidados para a etapa da voz** (`voz-pt-br`):
   - Mande só o texto do `falas-v6.txt`, num pedido só. A Leda lê em voz alta qualquer instrução de estilo.
   - **Lista da fala 2:** deixe ~0,7 s por item para cada cartão de semana ter tempo de subir. Não aperte essas vírgulas.
   - Confira na transcrição: "deload", "checklist", "Rotina" (o Whisper já escreveu "rutina"), "pegaria numa" e "doze em todas".

## Placar (`--score`)

| Versão | Padrões | Ritmo | Vocabulário | **Placar** | Faixa |
|---|---|---|---|---|---|
| v1 (copy) | 4 × 4 = 16 | 6,5 (CoV 0,37) | 0 | **22,5** | Mostly human |
| **Final** | 1 × 4 = 4 ("Tudo num app só.", mantida) | 8,5 (CoV 0,33) | 0 | **12,5** | Pristine |

- **Fórmula da skill:** `4 × padrões + 25 × (1 − ritmo_normalizado) + 15 × proporção_de_vocabulário`.
  - Ritmo normalizado = CoV ÷ 0,5, limitado a 1 (a mesma conta do v3 e do v5).
  - CoV = desvio-padrão ÷ média das palavras por fala.
- **O ritmo piorou um pouco** (0,37 para 0,33) porque as falas longas foram encurtadas para caber no tempo. Fica acima de 0,30, o mínimo da skill.
- **Limite honesto:** a nota que o modelo dá ao próprio texto sai inflada. O teste de verdade é o Daniel ouvir a Leda.
- As contagens foram feitas por script (`video-v6/tools/contar.py` no scratchpad), não de cabeça.

## Aprendizados para salvar (proposta, passo 7 do combo)

A pasta das skills é só leitura para este agente, então nada foi gravado. Proposta para o agente principal ou para o Daniel aprovar:

- **combo-copy-humanizada:** em roteiro de 12 falas e até 95 palavras, a conta é ~8 palavras por fala. Fazer essa grade antes de escrever: a v1 saiu com 108 porque cada recurso puxou uma frase inteira.
- **copywriting:** em roteiro que mostra muitas telas, o primeiro rascunho tende a ler a tela ("avisa para aumentar a carga", "1RM estimado", "evolução"). Escrever a partir do que a pessoa fala na academia e deixar o texto da tela no cartão.
- **humanizer:** o aviso "três falas seguidas com tamanho parecido" dispara fácil com falas de 8 a 11 palavras. Julgar pela forma das frases e pelo CoV do roteiro todo, como a guarda da skill manda.
- **humanizer:** em roteiro que passeia pelas abas do app, as falas começam todas com "No X," ("No Rotina", "Na meta", "Nos hábitos", "No financeiro"). Conferir as aberturas seguidas.
- **voz-pt-br:** o `src/v5/voz.json` mediu a Leda a 1,0x: ~3,3 palavras/s dentro da fala e 0,5 s entre falas (45 palavras em 17,8 s, ou 2,5 palavras/s no total). Bom modelo para estimar roteiro por fala.
