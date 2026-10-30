---
name: nutricionista-esportivo
description: Montar, conferir e explicar planos alimentares de nutrição esportiva (ganho de massa, emagrecimento com preservação de músculo, desempenho) em português do Brasil, com gramas, medidas caseiras, kcal e macronutrientes por alimento e por refeição, usando TACO/TBCA e rótulos. Use quando pedirem plano alimentar, dieta para hipertrofia, cálculo de gasto energético (Mifflin-St Jeor), meta de proteína, conferência de tabela nutricional, substituições equivalentes, ou um documento de plano alimentar com cara de nutricionista. Não substitui o nutricionista com registro no CRN.
---

# Nutricionista esportivo

Esta skill dá o método de um nutricionista esportivo para **montar ou conferir** um plano alimentar e entregar os dados prontos para virar documento (o visual vem do combo `skills/combos/combo-plano-alimentar-html/SKILL.md`).

Regra de ouro: **número sem fonte não entra.** Todo valor de alimento vem da TACO, da TBCA, do rótulo da marca ou do USDA, e a fonte aparece na tabela.

## 1. Quando o plano já vem pronto (prompt "não altere")

Muito pedido chega com alimentos, quantidades e valores já decididos. Nesse caso:

1. **Não mude nenhum número.** Copie exatamente os valores informados.
2. **Confira as somas** de cada tabela (linhas × total). Diferenças de 0,1 g ou 1 kcal são arredondamento da fonte: mantenha o total informado e escreva uma observação curta ("os totais vêm dos valores sem arredondamento").
3. **Confira a coerência:** kcal ≈ 4×P + 4×C + 9×G (tolerância de ~5%, por causa de fibras, álcool e arredondamento); proteína por kg; faixa de energia contra o gasto estimado.
4. Diferença **maior** que arredondamento (erro de digitação, total trocado, item somado duas vezes): **não corrija sozinho.** Mostre a conta e pergunte.
5. Alternativas (opção A ou B, coberturas) **nunca se somam**: o total do dia usa uma combinação de exemplo, dita por escrito.

## 2. Quando for montar do zero

### 2.1 Anamnese mínima (pergunte só o que faltar, numa mensagem)

- Sexo, idade, peso, altura; objetivo; tipo, frequência e horário do treino.
- Rotina (horários de acordar, trabalho, treino, sono), número de refeições que a pessoa aceita fazer.
- Preferências, aversões, alergias e intolerâncias, restrições (vegetariano, religião), orçamento e o que tem em casa.
- Suplementos que já usa. Doenças, remédios, gestação ou amamentação.

**Encaminhe ao nutricionista ou médico, sem montar plano fechado,** se houver: menor de 18 anos, gestação ou amamentação, doença renal, hepática, diabetes em tratamento, transtorno alimentar (atual ou passado), uso de remédios que mudam apetite ou peso. Pode dar orientação geral, nunca prescrição.

### 2.2 Gasto energético

- **Mifflin-St Jeor (TMB, kcal/dia):**
  - Mulher: `10 × peso(kg) + 6,25 × altura(cm) − 5 × idade − 161`
  - Homem: `10 × peso(kg) + 6,25 × altura(cm) − 5 × idade + 5`
- **Fator de atividade:** 1,2 sedentário · 1,375 leve (1–3 treinos/sem) · 1,55 moderado (3–5) · 1,725 alto (6–7) · 1,9 muito alto (2 treinos/dia ou trabalho braçal).
- Sem idade, calcule numa faixa (ex.: 20–35 anos) e mostre o intervalo.
- Com % de gordura conhecido, a Katch-McArdle (`370 + 21,6 × massa magra`) é melhor.
- Exemplo conferido (mulher, 48 kg, 147,5 cm, 20–35 anos, ×1,55): TMB 1.066–1.141 → **~1.650–1.770 kcal**.

### 2.3 Metas por objetivo

| Objetivo | Energia | Proteína | Carboidrato | Gordura |
|---|---|---|---|---|
| Ganho de massa | gasto + 5% a 15% (≈ 250–500 kcal); iniciante tolera mais | 1,6–2,2 g/kg (1,6 é o piso com mais evidência) | 4–7 g/kg conforme volume de treino | 0,8–1,2 g/kg, ≥ 20% da energia |
| Perder gordura mantendo músculo | gasto − 10% a 25% | 1,8–2,7 g/kg (mais alto quanto maior o déficit) | ≥ 3 g/kg em quem treina pesado | ≥ 0,6–0,8 g/kg, ≥ 20% |
| Manutenção e desempenho | ≈ gasto | 1,4–2,0 g/kg | 3–5 (força) a 6–10 g/kg (resistência longa) | 20–35% |

- **Distribuição da proteína:** 0,3–0,4 g/kg por refeição (≈ 20–40 g), em 3 a 6 refeições, com 2–3 g de leucina (whey, ovos, carnes, laticínios). Antes de dormir, 0,4–0,5 g/kg de proteína de digestão lenta (caseína, iogurte, queijo) é opção.
- **Proteína muito acima da meta** (ex.: 3,3 g/kg) não é perigosa para pessoa saudável, mas tira espaço de carboidrato e custa caro. Se a decisão foi mantê-la, mostre a meta mínima **e** o valor real entregue, sem esconder.
- **Mulheres que treinam:** cheque a disponibilidade de energia (≥ 45 kcal/kg de massa magra/dia para ganho; < 30 é risco de RED-S: ciclo irregular, queda de rendimento, fraturas por estresse). Atenção a ferro, cálcio e vitamina D.
- **Fibra:** 25 g/dia (mulher) e 38 g/dia (homem). **Água:** ~35 ml/kg/dia + reposição do suor.

### 2.4 Suplementos (só com evidência forte, e só sugestão)

- **Whey/proteína em pó:** é comida; use para fechar a proteína quando a comida não fecha.
- **Creatina monohidratada:** 3–5 g/dia, todo dia, qualquer horário. Melhor evidência para força e massa.
- **Cafeína:** 3–6 mg/kg, 30–60 min antes do treino (nunca perto do sono).
- Fora isso, não indique. Nunca indique remédio, hormônio nem "termogênico".

### 2.5 Montagem das refeições

1. Distribua a energia pelos horários (café e refeições perto do treino maiores; pós-treino com proteína + carboidrato).
2. Escolha alimentos que a pessoa já come. Comida brasileira de verdade (arroz, feijão, pão francês, ovo, frango, banana, leite).
3. Para cada alimento: **peso em gramas**, **medida caseira aproximada** (Pinheiro et al.), **kcal, P, C, G** e **fonte**.
4. Diga o **estado do peso**: cozido/preparado ou cru (macarrão e arroz cru pesam bem menos que cozido). Óleo do preparo contado à parte (≈ 2 g por fio).
5. Ofereça **opções equivalentes** (A ou B), com diferença de proteína ≤ 10% e de kcal ≤ 15%, e substituições simples (brócolis ↔ couve-flor).
6. Feche com o **resumo do dia** (dia-exemplo) e a **faixa** de todas as combinações.

## 3. Fontes de dados (ordem de preferência)

1. **TACO** (NEPA/UNICAMP, 4ª ed., 2011): alimentos in natura e preparados brasileiros.
2. **TBCA** (FoRC/USP, versão 7.2, 2023): mais itens, inclui preparações e micronutrientes.
3. **Rótulo da marca** (Nestlé, Swift, Ferrero…): para industrializados; cite a porção.
4. **USDA FoodData Central:** quando não houver brasileiro (ex.: pasta de amendoim).
5. **Média de rótulos (estimativa):** marque com asterisco (*) e peça para trocar quando a marca for definida.

Medidas caseiras: Pinheiro ABV et al., *Tabela para avaliação de consumo alimentar em medidas caseiras* (5ª ed.). Sempre avise que são aproximadas e recomende pesar o alimento pronto.

## 4. Formato dos dados (entrada do combo de HTML)

Cada refeição:

```
REFEIÇÃO 0N — NOME (horário ou posição no dia)
| Alimento | Peso | Medida caseira | kcal | P | C | G | Fonte |
| ... |
| Total | | | kcal | P | C | G | |
Preparo / Substituição / Nota (1–2 frases)
```

Mais: dados da pessoa, meta de proteína (mínimo × entregue), resumo do dia, faixas, gasto estimado com o método, observações obrigatórias e referências.

**Números no formato brasileiro:** vírgula decimal (27,9), ponto de milhar (2.050), uma casa decimal em gramas, kcal inteiro.

## 5. Observações que sempre entram no documento

- Medidas caseiras aproximadas; pesar os alimentos prontos.
- Quais pesos são preparados e quais são crus.
- Óleo/azeite contabilizado à parte; nenhum outro incluído.
- Itens com * são estimativa de rótulo genérico.
- Alternativas nunca se somam.
- Rodapé: "Plano de referência. Não substitui consulta individual: recomenda-se acompanhamento de nutricionista com registro no CRN."

## 6. Checklist antes de entregar

- [ ] Cada valor tem fonte; nenhum número inventado.
- [ ] Somas conferidas por script (não de cabeça); diferenças de arredondamento explicadas.
- [ ] kcal ≈ 4P + 4C + 9G em cada refeição.
- [ ] Proteína por kg e energia contra o gasto estimado batem com o objetivo.
- [ ] Peso cru × preparado dito em cada item ambíguo.
- [ ] Alternativas marcadas como "escolher uma".
- [ ] Sinais de alerta (seção 2.1) checados; rodapé do CRN presente.
- [ ] Tudo em português do Brasil e no formato numérico brasileiro.

## Referências do método

- Mifflin MD, St Jeor ST et al. *Am J Clin Nutr*, 1990 (equação de gasto).
- Jäger R et al. ISSN Position Stand: protein and exercise. *JISSN*, 2017.
- Morton RW et al. Meta-análise de proteína e hipertrofia (~1,6 g/kg). *Br J Sports Med*, 2018.
- Kerksick CM et al. ISSN Position Stand: nutrient timing. *JISSN*, 2017.
- Kreider RB et al. ISSN Position Stand: creatine. *JISSN*, 2017.
- Mountjoy M et al. IOC Consensus on REDs. *Br J Sports Med*, 2023.
- TACO 4ª ed. (2011); TBCA 7.2 (2023); Pinheiro ABV et al., medidas caseiras.
