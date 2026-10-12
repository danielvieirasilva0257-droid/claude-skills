# Modelagem: celular genérico premium (bpy + bmesh)

Detalhe do `SKILL.md`. Implementado em `scripts/premium.py` (a função `placa()`, os furos, botões, antenas, ilha e lentes). Testado no Blender 5.2.2.
**Nenhuma forma de marca real:** sem logo, sem Dynamic Island nem notch, sem ilha quadrada com 3 lentes em diagonal (iPhone Pro), sem lentes soltas em coluna sem ilha (Galaxy S), sem barra horizontal de ponta a ponta (Pixel). O furo central da câmera frontal é genérico (a maioria dos Android).

## 1. Medidas (metros)

| Item | Valor |
|---|---|
| Largura × altura × espessura | 0,0716 × 0,1490 × **0,0082** (a faixa real de 2024–26 é 7,2–8,9 mm; 7,8–8,5 mm fica bem em anúncio) |
| Raio do canto (planta) | 0,0105 |
| Quina lateral do aro (2.5D) | 0,0012 |
| Vidro frontal e traseiro | 70,6 × 148 mm, recuo de 0,5 mm da borda do aro, 0,9 mm de espessura, encaixados 0,3 mm abaixo da face do aro |
| Quina do vidro | 0,45 mm (6 segmentos) |
| Área ativa da tela | 68 × 145,4 mm (borda preta 1,3 mm), raio 9,2 mm |

## 2. Peças (nesta ordem)

1. **Contorno:** retângulo arredondado gerado ponto a ponto (`contorno(w, h, r, seg=24)`, 4 arcos de 90°). O raio é real e não depende do Bevel modifier.
2. **Aro:** prisma desse contorno; `bmesh.ops.bevel` nos dois anéis (offset 1,2 mm, 8 segmentos, `profile=0.5`, `clamp_overlap=True`).
3. **Vidro frontal:** placa recuada, quina superior arredondada, **UV planar** para a UI. O vidro afunda no aro: a quina do aro e a parede do vidro criam o "vinco" brilhante entre vidro e metal.
4. **Vidro traseiro:** espelho do frontal, fosco.
5. **Furos (borda de baixo):** um cortador só, com USB-C em estádio (8,4 × 2,6 mm) + 2 × 6 furos de 1,1 mm a cada 2,1 mm; Boolean `DIFFERENCE`, solver **`EXACT`** (o aro passou de 1.702 para 1.932 faces). Uma placa preta 1,9 mm para dentro faz o fundo do furo.
6. **Botões (lado +X):** volume de 22 mm e liga de 12 mm, 2,4 mm de altura, saltados 0,5 mm, quinas de 0,4 mm; girados pela matriz `((0,0,1),(1,0,0),(0,1,0))` (comprimento → Y, altura → Z, saliência → X).
7. **Antenas:** 4 faixas de plástico de 0,6 mm cruzando o aro, a 16 mm do topo e da base, salientes 0,05 mm.
8. **Ilha da câmera** (traseira, canto superior; vista de trás fica à esquerda): retângulo arredondado 26 × 36 mm, raio 7,5 mm, 1,1 mm de altura, quina de 0,5 mm. **2 lentes em coluna:** anel de metal grafite Ø 11,2 mm saltado 0,9 mm, vidro Ø 9,2 mm, elemento interno Ø 4,2 mm. Flash Ø 4,2 mm ao lado.
9. **Normais:** `WEIGHTED_NORMAL` (FACE_AREA, peso 50, `keep_sharp`) **como último modificador** de cada peça, depois do Boolean; shade smooth em tudo. As faces planas grandes mandam na normal e somem as manchas nos n-gons.

## 3. Regras de hard surface (scenario-labs, MIT)

- **Ordem da pilha:** forma → corte (Boolean) → bevel/microbevel → Weighted Normal por último.
- **Dois bevels:** o de desenho (8–12 segmentos) e o microbevel (30°, Harden Normals).
- **Largura:** toda parede ou ranhura deve ter mais que 2× a largura do bevel.
- **`bmesh.ops.bevel` tem como padrão `segments=0, profile=0`:** passe sempre os dois.
- **Não use Subdivision:** o bmesh com bevel circular dá a mesma leitura com bem menos polígonos.

## 4. Detalhamento: o que vale o custo (do mais ao menos visível)

1. quina do vidro + vinco vidro/aro;
2. botões;
3. anel e vidro das lentes;
4. linhas de antena;
5. furos (só em close da borda de baixo);
6. rugosidade variável do metal.

Riscos e impressões digitais (textura de rugosidade no vidro) só em close extremo. Para close macro, suba os segmentos do bevel e a resolução da textura da UI (≥ 16 px/mm).

## 5. Por que o corpo parecia fino (e a correção)

O `logo_e_celular.py` mostrava o celular quase de frente, com aro escuro (base 0,015) e sem luz de contorno; o `produto.py` tem 8,3 mm, mas a lateral recebia pouca luz e tinha um único bevel. Correção: pose 3/4 (−28° Z, −6° X; câmera 3,6° acima), aro de metal claro com faixa de rim, quina lateral de 1,2 mm (uma linha de brilho e uma de sombra), vidro com borda própria (segunda linha) e botões/antenas para dar escala.

## 6. Conferir a forma antes do material

Rode `--clay` (cinza 18% fosco): só luz e forma. Se o clay já mostra a espessura e as quinas, os materiais só completam. Teste: `teste-B/comparativo_clay_tras_rgba.png`.

## 7. Objetos de cena (moedas, ícones 3D, halteres)

Procedural quando for simples (cilindro + bevel + Weighted Normal). Para formas complexas, gere o GLB por IA, importe, limpe (decimate, apague faces soltas) e aplique materiais próprios; as licenças estão no `SKILL.md`. O celular-herói é sempre procedural (malha de IA sai densa, triangulada, às vezes com furos).
