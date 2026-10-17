# Rotina v6: etapa 1, copy (skill `copywriting`)

Combo seguido: `skills/combos/combo-copy-humanizada/SKILL.md`, passos 1 a 3 (briefing, escrever com a `copywriting`, autoconferência). A humanização (passo 4) e a reconferência (passo 5) estão em `2-humanizado.md`. O texto final está em `ROTEIRO-FINAL.md` e `falas-v6.txt`.

## 1. Briefing (passo 1 do combo)

- `.agents/product-marketing.md`, `.claude/product-marketing.md` e `humanizer-context.md` não existem em nenhum dos dois repositórios. O contexto veio:
  - do pedido do Daniel (as palavras dele, repassadas pelo agente principal);
  - da lista de funções **confirmadas no código** que veio com o pedido (nada fora dela entrou no texto);
  - dos roteiros aprovados v2, v3 e v5 (tom e formato);
  - do `src/v5/voz.json`, para medir a velocidade real da Leda.
- **Peça:** Reels vertical (1080×1920), mesmo visual do v5. Voz Leda, 1,0x a 1,1x, entre 30 e 38 s. **Meta: 80 a 95 palavras, 8 a 12 falas.**
- **Ação única:** baixar o app.
- **Tráfego:** frio, no feed, muitas vezes sem som. Cada fala precisa de uma coisa concreta para mostrar na tela (um aviso, um cartão, um gráfico que sobe do celular).
- **Provas reais:** nenhuma (sem número de usuários, nota ou depoimento) e sem preço confirmado. Nada de "grátis".
- **Público:** quem treina musculação e quer ver se está evoluindo; o mesmo público do v2 a v5 (20 a 40 anos, organiza treino, hábitos e dinheiro em vários lugares).
  - Como falam (julgamento nosso, gíria de academia): "quanto você pega no supino", "fechei doze em todas", "subir a carga", "bati recorde", "semana de deload".
  - Objeções prováveis: "mais um app de treino?" (resposta: ele também tem hábitos e dinheiro) e "dá trabalho anotar?".

### O pedido do Daniel, item por item (onde cada um entrou)

| O Daniel pediu | Onde está na v1 |
|---|---|
| explicação extensa do treino | falas 2 a 8 (7 de 12) |
| "várias checklists" | fala 3 (o treino do dia) e fala 9 (os hábitos, "outro checklist") |
| ver semana a semana o tipo de treino (força, hipertrofia e os outros) | fala 2 |
| mudar repetições e séries | fala 4 |
| ver quanto melhorou nas semanas e nos meses, com gráfico | fala 7 |
| metas e quanto falta | fala 8 |
| "quais cargas você conseguiria pegar" | falas 5 (o app manda subir a carga) e 6 (recorde e carga estimada para uma repetição) |
| "quantas cargas você fez" | só na tela, na fala 7 (cartão "Carga total no mês"); não coube na voz (ver alternativas) |
| passada rápida no financeiro, como no v5 | fala 10 |
| mesmo estilo do v5, vertical, um pouco maior | 12 falas em ~36 s (o v5 tinha 6 falas em ~18 s) |

### Teste "Now you can" e Human Action Model (`references/copy-frameworks.md`)

- "Agora você pode ver o seu supino semana a semana, mês a mês." **Verdadeiro e convincente**: o app tem o gráfico de evolução de cada exercício por semanas e meses.
- "Agora você sabe quando subir a carga." **Verdadeiro**: o app avisa quando você bate o máximo de repetições em todas as séries.
- **Desconforto:** você treina, mas não sabe quanto pegava três meses atrás (fala 1).
- **Visão:** cada semana com um estilo, o app dizendo quando subir, o recorde, o gráfico (falas 2 a 8).
- **Caminho:** o Rotina junta isso com hábitos e dinheiro, e a CTA (falas 9 a 12).

## 2. Ângulo: quatro ganchos

| | Gancho | Palavras | A favor | Contra |
|---|---|---|---|---|
| **A** (escolhido) | Quanto você pegava no supino três meses atrás? | 8 | Pergunta um **número** que quase ninguém sabe (como o "quanto sobra?" do v5), e a tela pode repetir o chip do v5 ("?? kg"). A fala 7 devolve a resposta (o gráfico do supino, mês a mês). "Pegava" é a palavra da academia. | Fala só com quem treina. Aqui é o que se quer: o vídeo é sobre treino. |
| B | Você sabe se o seu supino subiu esse mês? | 9 | Claro. | Pergunta de sim ou não, mais fraca. Muita gente acha que sabe. |
| C | Novo recorde no supino, e foi o app que avisou. | 10 | Abre no momento mais visual (o cartão de recorde). | Gasta o clímax na primeira fala e deixa a fala 6 repetida. |
| D | Você treina toda semana, mas está evoluindo? | 7 | É a sugestão do pedido. | Repete o molde do v5 ("Você sabe X, mas sabe Y?") e é genérico: serviria para qualquer app de treino. |

**Escolha: A.** O Y é um número (como no v5), a pergunta é na voz do leitor sobre a dor dele (*Use Rhetorical Questions*) e o roteiro fecha o laço sem responder com uma frase pronta.

## 3. Roteiro v1 (saída da `copywriting`, antes de humanizar)

| # | Batida | Fala | Palavras |
|---|---|---|---|
| 1 | Gancho | Quanto você pegava no supino três meses atrás? | 8 |
| 2 | Produto + semanas | No Rotina, cada semana tem um estilo: hipertrofia, força, potência, deload. | 11 |
| 3 | Checklist do treino | Cada treino vira um checklist de exercícios. | 7 |
| 4 | Ajustar | Você ajusta séries e repetições. | 5 |
| 5 | Subir a carga | Fez doze repetições em todas as séries, o app avisa para aumentar a carga. | 14 |
| 6 | Recorde | Bateu a marca, aparece novo recorde e o seu 1RM estimado. | 11 |
| 7 | Gráfico | O gráfico mostra a evolução de cada exercício, semana a semana, mês a mês. | 14 |
| 8 | Meta | Defina a meta de cardio e veja quanto falta. | 9 |
| 9 | Hábitos | Nos hábitos, outro checklist, e a sequência de dias cresce. | 10 |
| 10 | Financeiro | No financeiro, o que entra, o que sai e quanto sobra. | 11 |
| 11 | Fecho | Tudo num app só. | 4 |
| 12 | CTA | Baixe o Rotina agora. | 4 |
| | **Total** | | **108** (13 acima do teto de 95) |

### Anotações (por que cada parte está ali)

- **Fala 1:** ver o ângulo A acima. Três meses é tempo bastante para a pessoa não lembrar e para o gráfico mostrar diferença.
- **Fala 2:**
  - O nome do app entra cedo, para quem pula o fim.
  - Quatro estilos, um por semana do mês (semana 1 a 4), o que dá um cartão por palavra na tela.
  - A ordem **hipertrofia, força, potência, deload** é a de um bloco de treino de verdade (volume, carga, explosão, descanso). Quem treina reconhece. Ela também afasta a fala do v2 ("força, hipertrofia, resistência ou deload").
  - São quatro, e não três (*Reflexive threes*).
- **Fala 3:** primeira checklist. "Checklist" é a palavra do Daniel e fica repetida de propósito na fala 9 (P11: repetir o termo em vez de trocar por sinônimo).
- **Fala 4:** o pedido literal do Daniel ("mudar repetições, séries").
- **Fala 5:** o momento mais útil do app para quem treina. O 12 é o topo da faixa da hipertrofia (8 a 12), o estilo da semana 1.
- **Fala 6:** o recorde. É a resposta para "quais cargas você conseguiria pegar".
- **Fala 7:** a evolução nas semanas e nos meses, com o gráfico.
- **Fala 8:** a meta com "quanto falta". Cardio, porque é a meta de treino confirmada com "Faltam 30 min".
- **Fala 9:** segunda checklist, a da rotina.
- **Fala 10:** a passada rápida no dinheiro, com as palavras que o Daniel aprovou no v5.
- **Fala 11:** o diferencial contra apps só de treino. Sozinho, "num app só" é genérico; depois de ouvir treino, hábitos e dinheiro, vira um fato.
- **Fala 12:** a CTA aprovada nos vídeos anteriores, sem o "link na bio" (fica só na tela).

### Alternativas (formato de saída da `copywriting`)

**Gancho:** A (escolhido), B e C da tabela acima.

**Fecho (fala 11):**
- **A:** "Tudo num app só." (4). A favor: é a sugestão do pedido e deixa claro que é tudo junto. Contra: perto do "Num app só." do v5.
- **B:** "Treino, hábitos e dinheiro, num app só." (7). A favor: diz o diferencial com fatos, como o "Treino e hábitos também." que o Daniel escolheu no v5. Contra: +3 palavras e um trio (aqui são três áreas reais).
- **C:** "Num app só." (3). A favor: mais curto. Contra: logo depois do financeiro, pode soar como "o dinheiro fica num app só".

**CTA (fala 12):**
- **A:** "Baixe o Rotina agora." (4). O nome fica no fim.
- **B:** "Baixe agora." (2). É a do v5 final; tira 2 palavras.
- **C:** "Baixe o Rotina e monte sua semana." (7). Liga com a fala 2, mas é mais longa.

## 4. Autoconferência da `copywriting` (passo 3 do combo; `references/ai-tells.md`, "The Self-Check")

| Checagem | Resultado na v1 |
|---|---|
| Proibidos: "não", "sem", "?", ":", travessão, exclamação | Uma pergunta só, no gancho (pergunta do leitor, permitida). Um dois-pontos na fala 2, como rótulo de lista (permitido). Sem negação, travessão ou exclamação. |
| Contraste "Não é X, é Y", lista de negação, pergunta respondida | Nenhum. |
| Frases com mais de 20 palavras | Nenhuma. As maiores são as falas 5 e 7 (14). |
| Limites (fragmentos, trios, vocabulário) | Um fragmento ("Tudo num app só."). Um trio (fala 10), com três coisas reais. Nenhuma palavra da lista proibida. |
| Jargão (*Quick Quality Check*) | **Atenção** na fala 6: "1RM estimado" é sigla de tela. Quem não treina não entende, e a voz vai ler "um erre eme". Marcado para a etapa 2. |
| Linguagem do cliente | **Atenção** nas falas 5 e 7: "fez doze repetições em todas as séries... avisa para aumentar a carga" é o aviso do app lido em voz alta, e "a evolução de cada exercício" é rótulo. Na academia se diz "fechou doze em todas", "subir a carga". Marcado para a etapa 2. |
| Sujeito concreto (*Abstract subjects*) | **Atenção** na fala 6: "aparece novo recorde" não diz quem faz. Marcado para a etapa 2. |
| Ler em voz alta | **Atenção** na fala 8: "Defina... e veja..." é ordem de manual no meio de uma conversa, e soa como uma segunda CTA. Marcado para a etapa 2. |
| Laço do gancho | **Atenção:** o gancho pergunta pelo supino, mas a fala 7 responde com "cada exercício". O laço não fecha de ouvido. Marcado para a etapa 2. |
| Teste de troca | As falas 1 a 8 sozinhas serviriam para outro app de treino. O que passa no teste são as falas 9 a 11 (hábitos e dinheiro no mesmo app). Fica assim de propósito: o Daniel pediu o treino em detalhe. |
| Tamanho | **108 palavras, 13 acima do teto.** Pela regra de 2,5 palavras/s dá 43 s (o teto é 38 s). Cortes marcados para a etapa 2: "de exercícios" (fala 3, a tela mostra), "de dias" (fala 9) e o que sobrar dos ajustes de linguagem nas falas 5 a 8. |
| Honestidade | Nenhum número dito além de "doze" e "três meses" (exemplo e pergunta). Nenhuma promessa fora da lista confirmada. |

## 5. `[NEED]` (nada foi inventado no lugar)

- `[NEED: preço]` Não sabemos se o app é grátis; por isso nenhuma fala fala de preço.
- `[NEED: a pessoa muda o número de séries de cada exercício, ou só pelo modo de volume do estilo?]` A fala 4 vale nos dois casos (é o pedido do Daniel); muda só a tela da fala 4.
- `[NEED: fórmula do 1RM estimado no app]` Para os números de exemplo das telas 5 e 6 fecharem entre si (ver `ROTEIRO-FINAL.md`).
- `[NEED: o gráfico do exercício mostra o 1RM estimado ou a carga?]` Define o rótulo e os números da tela 7. A fala não muda.

## Partes da `copywriting` usadas

- **`SKILL.md`:** *Before Writing*, *Clarity over cleverness*, *Specificity*, *Customer language*, *One idea per section* (uma ideia por fala), *No AI Tells*, *Use Rhetorical Questions*, *CTA Copy Guidelines* e *Output Format* (anotações e alternativas).
- **`references/copy-frameworks.md`:** o teste "Now you can", o *Human Action Model* e a fórmula *Problem-Focused* (pergunta sobre a dor).
- **`references/ai-tells.md`:** os padrões estruturais 1 a 13 (sobretudo 7, *Reflexive threes*, e 11, *Abstract subjects*), *Marketing Phrases* ("all-in-one"), *Rewrite Rules* e *The Self-Check*.
- **`references/natural-transitions.md`:** só para conferir que não há conectores de IA ("Além disso", "Vale ressaltar"). Os únicos conectores são "E" (fala 8 da versão final) e os nomes das abas ("Nos hábitos", "No financeiro").
- **`APRENDIZADOS.md`** da copywriting e a lista pt-BR do combo.
