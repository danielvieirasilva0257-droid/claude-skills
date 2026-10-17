# Rotina v6: roteiro final

- **Formato:** Reels vertical 1080×1920, mesmo visual do v5 (fundo escuro com luzes, interface do app em destaque, frases que se montam palavra por palavra). O celular aparece várias vezes: a câmera foca na tela e um elemento (aviso, cartão, gráfico) sobe para fora, com o celular desfocado atrás.
- **Pedido do Daniel:** explicação longa do treino e das checklists, passada rápida no financeiro, vídeo um pouco maior que o v5.
- **Ângulo: "quanto você pegava no supino três meses atrás?"**
  - O gancho pergunta um número que a pessoa não sabe (como o "quanto sobra?" do v5).
  - O roteiro desce pelo app como quem usa: a semana, o treino do dia, as séries, o aviso de subir carga, o recorde, o gráfico (que responde o gancho), a meta, os hábitos e o dinheiro.
- **Texto para a voz:** `falas-v6.txt` (12 linhas, só o texto).
- **Como o texto foi feito:** `1-copy.md` (copywriting e autoconferência) e `2-humanizado.md` (detect, rewrite e reconferência).

## As 12 falas

| # | Batida | Fala | Palavras | Começa em ≈ (1,0x) |
|---|---|---|---|---|
| 1 | Gancho | Quanto você pegava no supino três meses atrás? | 8 | 0,1 s |
| 2 | Semanas e estilos | No Rotina, cada semana tem um estilo: hipertrofia, força, potência, deload. | 11 | 3,1 s |
| 3 | Checklist do treino | Cada treino vira um checklist. | 5 | 8,7 s |
| 4 | Séries e repetições | Você muda séries e repetições. | 5 | 10,7 s |
| 5 | Subir a carga | Fechou doze em todas, o app manda subir a carga. | 10 | 12,7 s |
| 6 | Recorde e 1RM | Bateu recorde, ele calcula quanto você pegaria numa repetição. | 9 | 16,3 s |
| 7 | Gráfico (responde o gancho) | O gráfico mostra o supino semana a semana, mês a mês. | 11 | 19,5 s |
| 8 | Meta | E a meta de cardio mostra quanto falta. | 8 | 23,3 s |
| 9 | Checklist dos hábitos | Nos hábitos, outro checklist, e a sequência sobe. | 8 | 26,2 s |
| 10 | Financeiro | No financeiro, o que entra, o que sai e quanto sobra. | 11 | 29,2 s |
| 11 | Fecho | Tudo num app só. | 4 | 33,0 s |
| 12 | CTA | Baixe o Rotina agora. | 4 | 34,7 s |
| | **Total** | | **94** | fim da voz ≈ 35,9 s |

## Duração estimada

| Caso | Conta | Resultado |
|---|---|---|
| Regra do pedido | 94 ÷ 2,5 palavras/s | **37,6 s** |
| Modelo por fala, Leda a 1,0x (recomendado) | ~3,3 palavras/s dentro da fala, 0,5 s entre falas, ~0,75 s por item na lista da fala 2 | **≈ 35,9 s** |
| O mesmo modelo a 1,1x (`atempo`) | a fala encolhe 10%, as pausas ficam | **≈ 33,2 s** |

- **De onde vem o modelo:** `src/v5/voz.json` (Leda, 1,0x): 45 palavras em 17,8 s, com 3,05 a 3,71 palavras/s dentro das falas e 0,5 s entre elas. A lista do v5 andou a 1,7 palavras/s.
- **Faixa pedida (30 a 38 s):** cabe a 1,0x e a 1,1x. Com as pausas soltas do v3 (2,2 palavras/s) passaria de 42 s; aperte as pausas entre falas para ~0,5 s, como no v5.
- **Os tempos reais** virão do `voz.json` do v6 (alinhamento da voz gerada).

## Mapa de cenas (o que aparece na tela, fala por fala)

| # | Na tela |
|---|---|
| 1 | O celular entra; na tela, o cartão "Supino reto" com a carga trocada por um chip "?? kg", que sobe para fora; a pergunta se monta palavra por palavra. |
| 2 | Aba Planejar: os cartões Semana 1 a 4 sobem um a um, cada um com o chip do estilo (Hipertrofia, Força, Potência, Deload) na sua palavra. |
| 3 | O "Treino de Peito" do dia: a lista de exercícios sobe para fora e os checks vão marcando. |
| 4 | Editor do estilo Hipertrofia: a faixa "8–12 repetições" e as séries mudam no seletor. |
| 5 | As séries do supino ficam verdes em 12, 12, 12; sobe o aviso "Aumente a carga (+2,5 kg)". |
| 6 | O cartão "Novo recorde! 1RM estimado 92,5 kg" sobe com o troféu, o celular desfocado atrás. |
| 7 | Aba Progresso: o gráfico do supino se desenha semana a semana; o chip "?? kg" da abertura pousa no ponto de três meses atrás (e o chip "Carga total no mês" aparece ao lado). |
| 8 | O cartão da meta de cardio: o anel enche até 120 de 150 min e "Faltam 30 min" sobe. |
| 9 | Aba Hábitos: os hábitos do dia são marcados um a um; o cartão "Sequência: 12 → 13 dias seguidos" sobe. |
| 10 | Financeiro: entradas em verde, saídas em vermelho, e o cartão "Sobra no mês" conta até R$ 990. |
| 11 | Os ícones das três abas (Hábitos, Treinos, Financeiro) se juntam no celular; "TUDO NUM APP SÓ." no centro. |
| 12 | Botão vermelho "BAIXE AGORA" com o clique; "LINK NA BIO" só na tela. |

- **Regras do Daniel em todos os quadros** (vindas do v5): nada de texto sobre texto; nenhum recorte no meio da tela; o celular fica por cima do texto; o texto entra pela borda ou de trás do celular.
- **Palavra em vermelho da marca** (sugestão, uma por frase): "ATRÁS?", "DELOAD", "CHECKLIST", "CARGA", "RECORDE", "MÊS A MÊS", "FALTA", "SOBE", "SOBRA", "SÓ".

## Números de exemplo das telas (nenhum é dito na voz)

| Onde | Valor | Origem |
|---|---|---|
| Planos das semanas (fala 2) | Semana 1 "ABCDE (Hipertrofia)", 2 "ABCDE (Força)", 3 "Upper/Lower (Potência)", 4 "Upper/Lower (Deload)" | modelos e estilos confirmados; a combinação é exemplo |
| Hábitos (fala 9) | Beber 3L de água, Dieta, Ler 10 páginas, Treinar, Meditar 10 min | exemplos confirmados |
| Aviso de carga (fala 5) | "Você chegou em 12 repetições em todas as séries. Aumente a carga (+2,5 kg)." | texto confirmado |
| Recorde (fala 6) | "Novo recorde! 1RM estimado 92,5 kg" | texto confirmado |
| Gráfico do supino (fala 7) | de ~80 kg (julho) até 92,5 kg (outubro), se o gráfico for de 1RM estimado | exemplo; ver `[NEED]` |
| Meta de cardio (fala 8) | 120 de 150 min, "Faltam 30 min" | confirmado |
| Financeiro (fala 10) | Entradas R$ 4.800, Saídas R$ 3.810, Sobra R$ 990 | os mesmos números do v5 |

## `[NEED]`

1. `[NEED: fórmula do 1RM estimado no app]` A carga das séries da fala 5 e o 92,5 kg da fala 6 precisam fechar entre si. Exemplo: na fórmula de Epley, 65 kg × 12 dá 91 kg e 75 kg × 7 dá 92,5 kg. Se o app usar outra fórmula, os números mudam. A fala não muda.
2. `[NEED: o gráfico do exercício mostra o 1RM estimado ou a carga?]` Define o rótulo e os números da fala 7. A fala não muda.
3. `[NEED: a pessoa muda o número de séries de cada exercício, ou só pelo modo de volume do estilo?]` A fala 4 vale nos dois casos; muda só a tela.
4. `[NEED: preço]` (opcional) Se for grátis, dá para trocar o fecho por "É grátis." e manter a CTA.

## Alternativas prontas

- **Fecho com o diferencial dito com fatos** (como o "Treino e hábitos também." que o Daniel escolheu no v5): "Treino, hábitos e dinheiro, num app só." com a CTA "Baixe agora.". Total de 95 palavras, o teto.
- **CTA mais curta:** "Baixe agora." (2). Total de 92.
- **Fala 5 mais explícita** para quem não treina: "Fez doze em todas as séries, o app manda subir a carga." (12). Total de 96: corte a CTA para "Baixe agora." (94).
- **"Quantas cargas você fez" dito na voz:** fala 7 como "O gráfico mostra o supino mês a mês, e quanto você levantou no total." (14). Troca o "semana a semana" pela carga total do mês. Total de 97: corte a CTA para "Baixe agora." (95, o teto).
- **Fala 9 com o foguinho do v3**, se a tela tiver a chama: "Nos hábitos, outro checklist, e o foguinho sobe." (8).
- **Outro gancho:** "Você sabe se o seu supino subiu esse mês?" (9). Mais fraco: é pergunta de sim ou não.

## Notas para a voz (`voz-pt-br`)

- Gere o `falas-v6.txt` inteiro num pedido só (`--juntar`), só com o texto. A Leda lê em voz alta qualquer instrução.
- Velocidade natural (1,0x; até 1,1x com `atempo`). Pausas de ~0,5 s entre falas, como no v5.
- **Não aperte as vírgulas da fala 2:** ~0,7 s por item, para cada cartão de semana subir na sua palavra.
- Confira na transcrição: "deload", "checklist", "Rotina" (o Whisper já escreveu "rutina"), "app", "pegaria numa" e "doze em todas".
