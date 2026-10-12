# Pesquisa B: Blender premium (visual e modelagem 3D)

**Data:** 11/10/2026. **Agente:** B (visual e modelagem). O agente A cuida da direção de animação e das curvas.
**Pergunta:** como fazer o render do Blender ter cara de comercial premium (luz de estúdio, materiais realistas, modelagem caprichada)?
**Problemas do teste anterior:** o brilho do fundo enchia o quadro, o corpo do celular parecia fino e a tela era um degradê liso.
**Material de trabalho:** `/tmp/claude-0/-home-user-claude-skills/a0fff76b-036f-52aa-aae0-78ee08fe2860/scratchpad/hunter/blender-premium/teste-B/`
**Nada foi alterado** em `/home/user/claude-skills-main`. Não houve commit nem push.

---

## 1. Resumo

1. **O teste melhorou os três problemas.**
   - **Fundo:** degradê radial contido. Os cantos ficam em 2–4/255 de luminância (antes, 51/255) e o halo atrás do celular, em ~35/255.
   - **Espessura:** o celular tem 8,2 mm. Aparece de 3/4, com aro de metal, quina arredondada de 1,2 mm, botões e linhas de antena.
   - **Tela:** UI de app real no vidro, emissão 1,0 sob vidro preto brilhante, e um "sheen" (brilho) diagonal sutil.
2. **Custo igual ao de antes.** O quadro 1080×1920 levou **18,5 s** (16 amostras, OIDN Balanced) contra 19,6 s do `produto.py`. Com 32 amostras + OIDN High + compositor, levou **26,7 s**.
3. **A maior mudança de cor é o view transform: `Khronos PBR Neutral` no lugar de `Standard`.**
   - Com ele, a cor da UI sai fiel e saturada e o brilho é comprimido sem lavar.
   - O AgX desbota a UI e o Standard deixa o fundo acinzentado (comparativo no teste).
4. **O que dá a cara de anúncio é a luz:**
   - **Key (luz principal) grande e ALTA**, para o reflexo dela não lavar a tela;
   - **duas faixas de rim** (luz de contorno) finas atrás;
   - **um "cartão de sheen"**: plano emissivo com degradê que só aparece em reflexos, posicionado por cálculo de reflexão;
   - **HDRI de estúdio CC0 fraco**, só para os reflexos.
5. **Modelagem:** perfil de retângulo arredondado em bmesh, que dá raio real e topologia limpa (detalhes na seção 5):
   - vidros frontal e traseiro encaixados no aro;
   - Weighted Normal por último;
   - furos de alto-falante e USB-C feitos com boolean EXACT (conferido: o aro passou de 1.702 para 1.932 faces).
6. **Pegadinha da API do 5.2:** com o compositor ligado, o `-b` tentou GPU e falhou (`libEGL`). A correção é `scene.render.compositor_device = 'CPU'`.
7. **Recomendação:** levar as receitas para a skill `blender-ia` como `--estilo premium` no `produto.py`, ou como script irmão. Precisa da aprovação do Daniel (seção 8).

---

## 2. Fontes

### 2.1 Catálogo de skills (`npx skills@1.7.2 find`)

Buscas feitas: "blender", "3d modeling", "product render", "lighting", "materials", "procedural modeling", "blender lighting", "blender materials", "product visualization" e "cycles render".
Clones rasos estão em `scratchpad/hunter/downloads/<nome>-BB/`. Tudo foi lido como dado, e nenhum script de terceiros foi executado.

| Fonte | Licença | Nota |
|---|---|---|
| [RobLe3/cc-blender-skill](https://github.com/RobLe3/cc-blender-skill) (`blender-materials`, `blender-lighting`, `blender-rendering`) | MIT (conferida no `LICENSE`) | **Útil:**<br>• "Metallic é chave, não controle deslizante" (0 ou 1).<br>• Classe de luz `product` com razão key:fill:rim de 5:1:1,5 a 5000 K.<br>• `transmission_bounces ≥ 16` para vidro grosso.<br>**Atenção:** a regra "nunca use Standard" e as 256 amostras pressupõem GPU. |
| [scenario-labs/skills](https://github.com/scenario-labs/skills): `scenario-blender-lighting-rendering` e `scenario-blender-hard-surface` | MIT (conferida) | **A mais útil**, testada no 5.2. Detalhes logo abaixo da tabela. |
| [arjun988/blender-skills](https://github.com/arjun988/blender-skills) (`lighting`, `lookdev`, `procedural-modeling`) | MIT (conferida) | Genérica. Rig "Product Hero Shot": softbox de 2 m², 2 rims atrás, fundo em degradê, 85 mm. Confirma o caminho, sem números novos. |
| vladmdgolam/agent-skills@blender-mcp, sfkislev/flue@Blender, freshtechbro@blender-web-pipeline, ifbars/blender-agent-studio, kevinbadi@polyhaven-material-swap | não conferida | Fora do foco (MCP, web, troca de material) ou já vistas pelo agente A3. Não foram lidas. |

O que a `scenario-labs/skills` traz:
- **View transform.** Mediu o erro de cor de marca (em passos de 8 bits): `Khronos PBR Neutral` 3,8; AgX 27–42; Standard 33.
- **Exposição.** Ajuste o brilho geral no view transform (`exposure`), não escalando as lâmpadas.
- **Compositor do 5.x.** É um grupo de nós (`scene.compositing_node_group`) e os ajustes do Glare são *sockets* (entradas).
- **Hard surface.** Duas regras:
  - dois bevels: o bevel de desenho (8–12 segmentos) e o microbevel (30°, Harden Normals);
  - Weighted Normal por último.
- **Regra de largura.** Toda parede ou ranhura deve ter mais que 2× a largura do bevel.
- **Armadilha do bmesh.** `bmesh.ops.bevel` tem como padrão `segments=0, profile=0`: passe sempre os dois.

### 2.2 Web e dados

| Fonte | Licença | Nota |
|---|---|---|
| [Poly Haven: API e FAQ](https://polyhaven.com/faq) | CC0 (uso comercial livre) | 96 HDRIs na categoria "studio". Os mais baixados:<br>• `brown_photostudio_02`<br>• **`studio_small_09`** (octaboxes grandes, fundo infinito branco, contraste médio, 2750 K): usado no teste, versão 1k (1,6 MB);<br>• `studio_small_08` (contraste baixo);<br>• `studio_small_03` (contraste alto). |
| [Physically Based (API)](https://api.physicallybased.info/materials) | CC0 (conferida no `LICENSE` do repositório) | Cor base linear medida:<br>• alumínio (0,916, 0,923, 0,924);<br>• aço inox (0,669, 0,639, 0,598);<br>• titânio (0,441, 0,400, 0,361);<br>• cromo (0,654, 0,685, 0,701).<br>IOR: vidro 1,52; acrílico 1,49; policarbonato 1,58; safira 1,77. |
| [Notas da versão 4.2: Khronos PBR Neutral](https://wiki.blender.org/release_notes/4.2/rendering/) e [devtalk](https://devtalk.blender.org/t/adding-pbr-neutral-tone-mapper/33602?page=2) | docs | Feito para "fotografia de produto": cena bem exposta, com HDR só em pequenos brilhos especulares. Os devs dizem que o AgX ainda é melhor para cenas gerais e que há relato de sombra negativa com luz muito saturada. |
| [Manual do Blender: Principled BSDF](https://docs.blender.org/manual/en/4.3/render/shader_nodes/shader/principled.html) | CC-BY-SA (docs) | Anisotropia (só Cycles) com Tangent para metal escovado; Coat; Thin Film. |
| [API do OIDN (Denoise Node)](https://docs.blender.org/api/4.4/bpy.types.CompositorNodeDenoise.html) | docs | Prefilter `ACCURATE` (não borra detalhe); qualidade High, Balanced ou Fast. |
| [API do Lens Distortion 5.0](https://docs.blender.org/api/5.0/bpy.types.CompositorNodeLensdist.html) | docs | `Dispersion` = aberração cromática. |
| [Vagon: product lighting (02/2025)](https://vagon.io/blog/mastering-product-lighting-in-blender-techniques-for-stunning-3d-renders), [Derek Elliott: phone animation (BlenderNation, 2019)](https://www.blendernation.com/2019/10/22/product-animation-in-blender-phone/), [Superhive "Dark Luxury Studio"](https://superhivemarket.com/products/modular-product-lighting-scene-for-blender-dark-luxury-studio) | artigos e produto pago | Confirmam três pontos + softbox + rim com alvo e fundo escuro em degradê. **Não achei tutorial gratuito de 2025–26** específico de reflexo em tela de celular; as receitas abaixo vêm do teste. |

O texto copiado das fontes MIT se limita a números e nomes de parâmetros, que são fatos. O código do teste é próprio (GPL, como a skill).

---

## 3. Receitas com números (testadas no Blender 5.2.2, escala real em metros)

### 3.1 Luz de estúdio (celular em pé na origem; câmera em −Y a 0,56 m; produto girado −28° em Z e −6° em X)

| Luz | Tipo e tamanho | Posição (m) | Potência | Papel |
|---|---|---|---|---|
| **Key** | área retangular 0,9 × 0,6 | (−0,50, −0,35, **0,65**) | 26 W, 5000–5500 K (cor 1,0/0,98/0,95) | Modela o aro e a traseira. **Alta de propósito:** a 0,40 m de altura, o reflexo dela lavava metade da tela (`r25_v1.png`). |
| **Fill** | área 1,0 × 1,0 | (0,65, −0,35, 0) | 2,5 W, levemente fria | Razão ~1:6 a 1:10 com a key; segura as sombras. |
| **Rim E e Rim D** | faixas de 0,06 × 1,1 | (∓0,32, 0,30, 0,05) | 10 W (lado escuro), 4 W (lado da câmera) | Linhas de brilho nas quinas: mostram a espessura. A 6–10 W do lado da câmera, a lateral estourou em branco. |
| **Topo** | área 0,8 × 0,25 | (0, 0,05, 0,55) | 5 W | Pega a quina de cima e a ilha da câmera. |
| **Cartão de sheen** | plano emissivo 0,22 × 0,60, degradê quadrático, girado 30° | calculado (veja abaixo) | força 12 (8–12) | Faz o reflexo diagonal na tela. `visible_camera`, `visible_diffuse` e `visible_shadow` desligados: só o glossy o vê. |
| **Mundo** | HDRI `studio_small_09` 1k | — | 0,18 | Só reflexos ricos no metal. A câmera vê o fundo, não o HDRI. |

**Como posicionar o sheen** (reflexão do raio da câmera no canto superior esquerdo da tela):
```python
p = corpo.matrix_world @ Vector((-W*0.22, H*0.28, D/2))      # ponto na tela
n = (corpo.matrix_world.to_3x3() @ Vector((0, 0, 1))).normalized()
d = (p - cam.location).normalized(); r = d - 2*d.dot(n)*n    # direção refletida
cartao('Sheen', p + r*0.45, 0.22, 0.60, 12.0, giro=math.radians(30), alvo=p)
```
- Medido: força 3 não aparece; 60 lava; **12** dá um degradê sutil.
- Na animação, deixe o cartão **parado no mundo**: quando o celular gira, o reflexo "varre" a tela (recado para o agente A).

**Fundo** (o problema do "brilho enchendo o quadro"):
- O fundo é um plano a 0,55 m atrás do celular com Emission = degradê esférico (ColorRamp EASE).
  - Centro: (0,085, 0,095, 0,125) linear.
  - Borda: (0,004, 0,0045, 0,006).
  - Elipse de ~0,22 × 0,30 m de raio, centro 3 cm acima do celular.
- Medido no PNG final (luminância de 0 a 255):

| Ponto do quadro | Agora | Antes (`logo_e_celular.py`) |
|---|---|---|
| Cantos | 4,3 e 1,7 | 51 |
| Atrás do celular | 35,5 | 69 |

- Regra: **halo atrás do produto ≤ 40/255, cantos ≤ 5/255.**
- Para a camada do Remotion, prefira `film_transparent` e faça o degradê em CSS (`radial-gradient`): é mais barato e editável.

### 3.2 Materiais (Principled BSDF; Metallic é 0 ou 1)

| Peça | Base Color (linear) | Metallic | Roughness | Outros |
|---|---|---|---|---|
| Aro de alumínio anodizado (prata) | (0,80, 0,81, 0,83) | 1 | 0,16–0,26 via Noise (escala 900/6/900 → riscos ao longo do comprimento) | Alumínio cru medido: (0,916, 0,923, 0,924). Anodizado colorido = cor do corante no Base Color. |
| Aço escovado / titânio | aço (0,67, 0,64, 0,60); titânio (0,44, 0,40, 0,36) | 1 | 0,25–0,35 | Escovado de verdade: `Anisotropic` 0,5–0,8 + `Tangent` na direção do risco (só Cycles). |
| Vidro da tela | (0, 0, 0) | 0 | **0,035** | IOR 1,52; Emission Color = textura da UI; Emission Strength **1,0** (com Khronos) |
| Vidro traseiro fosco | (0,012, 0,017, 0,028) | 0 | **0,30** | IOR 1,52. Com 0,42 e base mais clara (0,03/0,04/0,065) ficou cinza "de plástico". |
| Vidro da ilha | igual à traseira | 0 | 0,06 | brilhante, contrasta com o fosco |
| Anel da lente | (0,30, 0,31, 0,33) grafite | 1 | 0,18 | Prata (0,80) virou um anel branco chapado. |
| Vidro da lente | (0,004, 0,005, 0,009) | 0 | 0,02 | IOR 1,5. Thin Film **120 nm** / IOR 1,38. Com **380 nm**, a lente ficou ciano forte (parecia olho de desenho). |
| Plástico fosco (antena, botões de plástico) | (0,36, 0,37, 0,39) | 0 | 0,55 | IOR padrão |
| Fundo dos furos | (0,005) | 0 | 0,7 | — |
| Flash | (0,85, 0,80, 0,62) | 0 | 0,35 | — |

### 3.3 Tela emissiva com textura de app

- **UV em metros:** UV gerado direto no bmesh do vidro: `u = x/largura + 0,5`, `v = y/altura + 0,5`. Assim a imagem cobre o vidro inteiro sem esticar.
- **A textura já traz:**
  - a borda preta de 1,3 mm;
  - o canto da área ativa (raio de 9,2 mm);
  - o furo da câmera frontal.
  
  O preto não emite, então a borda sai de graça (veja `gera_tela.py`, UI genérica sem texto).
- **Interpolação `Cubic`.** A textura deve ter ~16 px/mm: 1129 × 2368 para um vidro de 70,6 × 148 mm.
- **No vídeo real:** use a sequência PNG da UI do Remotion (`--screen` + `--tela_seq` do `produto.py`).

### 3.4 View transform e exposição

| View | Resultado no teste (`comparativo_view_transform.png`) | Quando usar |
|---|---|---|
| **Khronos PBR Neutral** | UI fiel e saturada, fundo azul-noite, brilhos comprimidos | **Padrão para produto + tela de app** |
| Standard | UI certa, mas o fundo fica acinzentado e o metal estoura | Só se a cor da UI precisar ser idêntica pixel a pixel. Mesmo assim, o Khronos erra menos (3,8 contra 33). |
| AgX / AgX Punchy | UI desbotada (verde e laranja pastel) | Cenas sem UI, ambiente |

- **Exposição:** `view_settings.exposure` (+1 = dobro de tudo, mantendo as razões), nunca escalando as lâmpadas.
- Cuidado: o Khronos comprime canais acima de ~0,76 linear. Para a UI, isso equivale a Emission ≤ 1,0.

### 3.5 Render Cycles na CPU (4 núcleos)

```python
cy.samples = 16                      # 32 para still-herói; ver tempos (custo fixo domina)
cy.use_adaptive_sampling = True; cy.adaptive_threshold = 0.015; cy.adaptive_min_samples = 8
cy.use_denoising = True; cy.denoiser = 'OPENIMAGEDENOISE'
cy.denoising_input_passes = 'RGB_ALBEDO_NORMAL'; cy.denoising_prefilter = 'ACCURATE'
cy.denoising_quality = 'BALANCED'    # HIGH custa +6 s/quadro com diferença média de 0,2/255
cy.max_bounces = 8; cy.diffuse_bounces = 2; cy.glossy_bounces = 4; cy.transmission_bounces = 4
cy.caustics_reflective = cy.caustics_refractive = False
cy.sample_clamp_indirect = 5.0; cy.blur_glossy = 0.5    # sem vaga-lumes, brilho direto intacto
scene.render.compositor_device = 'CPU'                  # OBRIGATÓRIO no -b com compositor (senão libEGL)
```

- Não há material transmissivo: a tela é um Principled opaco com emissão. Por isso 4 bounces de transmissão bastam e o render fica barato.
- Para vidro de verdade (lente transparente sobre a UI), use `transmission_bounces ≥ 16` (cc-blender-skill) e conte com mais ruído.

### 3.6 Compositor no 5.x (código próprio testado)

```python
tr = bpy.data.node_groups.new('Comp', 'CompositorNodeTree'); sc.compositing_node_group = tr
tr.interface.new_socket(name='Image', in_out='OUTPUT', socket_type='NodeSocketColor')
rl = tr.nodes.new('CompositorNodeRLayers'); go = tr.nodes.new('NodeGroupOutput')
gl = tr.nodes.new('CompositorNodeGlare')                       # ajustes sao ENTRADAS (sockets)
gl.inputs['Type'].default_value = 'Bloom'; gl.inputs['Quality'].default_value = 'High'
gl.inputs['Threshold'].default_value = 0.85; gl.inputs['Strength'].default_value = 0.18; gl.inputs['Size'].default_value = 0.55
ld = tr.nodes.new('CompositorNodeLensdist'); ld.inputs['Dispersion'].default_value = 0.006   # aberracao cromatica sutil
# vinheta (so com fundo opaco): EllipseMask(0.95, 0.80) -> Blur 300 px -> MapRange(0.75..1) -> ShaderNodeMix MULTIPLY
```

- `CompositorNodeMixRGB` **não existe** no 5.2. Use `ShaderNodeMix` (`data_type='RGBA'`, `blend_type='MULTIPLY'`): ele funciona dentro da árvore do compositor.
- **Custo:** ~3 s por quadro em 1080×1920 (26,7 s com o compositor contra 23,9 s sem).
- **Com fundo transparente:**
  - o glare e a dispersão preservam o alpha (conferido: 0 no canto, 255 no celular);
  - faça a **vinheta no Remotion**, não no Blender.

---

## 4. Por que o corpo parecia fino, e a correção

- O `logo_e_celular.py` mostrava o celular **quase de frente**, com o aro escuro (base 0,015) e sem luz de contorno. A lateral não aparecia.
- O `produto.py` tem 8,3 mm, mas a lateral recebia pouca luz e tinha um único bevel.
- **Correção:**
  - **pose 3/4** (−28° em Z, −6° em X; câmera 3,6° acima);
  - **aro de metal claro** com faixa de rim;
  - **quina lateral arredondada de 1,2 mm**, que cria uma linha de brilho e uma de sombra;
  - **vidro com borda própria**, que forma uma segunda linha;
  - **botões e antenas**, que dão escala.
  
  A lateral passa a ocupar ~16 px de largura em 1080 px.

---

## 5. Guia de modelagem: celular genérico premium (bpy + bmesh)

**Medidas (metros):**
- Largura 0,0716, altura 0,149, espessura **0,0082**.
- Raio do canto (planta) **0,0105**; quina lateral (2.5D) **0,0012**.
- A faixa real dos celulares de 2024–26 é de 7,2 a 8,9 mm; 7,8–8,5 mm fica bem em anúncio.

**Peças:**
1. **Contorno:** retângulo arredondado gerado ponto a ponto (`contorno(w, h, r, seg=24)`, 4 arcos de 90°). O raio é real e não depende do Bevel modifier.
2. **Aro:**
   - prisma desse contorno, z de −D/2+0,3 mm a +D/2−0,3 mm;
   - `bmesh.ops.bevel` nos dois anéis (offset 1,2 mm, 8 segmentos, `profile=0.5`, `clamp_overlap=True`).
3. **Vidro frontal:**
   - placa recuada 0,5 mm da borda (raio 10,0 mm), 0,9 mm de espessura, topo em +D/2;
   - quina superior arredondada de 0,45 mm (6 segmentos);
   - **UV planar** para a UI;
   - o vidro afunda no aro, e a quina do aro e a parede do vidro criam o "vinco" brilhante entre vidro e metal.
4. **Vidro traseiro:** espelho do frontal, fosco.
5. **Furos (borda de baixo):**
   - um cortador só, com USB-C em estádio (8,4 × 2,6 mm) + 2 × 6 furos de 1,1 mm a cada 2,1 mm;
   - Boolean `DIFFERENCE`, solver **`EXACT`**;
   - uma placa preta 1,9 mm para dentro faz o "fundo" do furo.
6. **Botões (lado +X):**
   - volume de 22 mm e liga de 12 mm, 2,4 mm de altura, saltados 0,5 mm;
   - mesma `placa()` com quinas de 0,4 mm, girada pela matriz `((0,0,1),(1,0,0),(0,1,0))` (comprimento → Y, altura → Z, saliência → X).
7. **Antenas:** 4 faixas de plástico de 0,6 mm cruzando o aro, a 16 mm do topo e da base, salientes 0,05 mm.
8. **Ilha da câmera** (traseira, canto superior; da vista de trás fica à esquerda):
   - retângulo arredondado de 26 × 36 mm, raio 7,5 mm, 1,1 mm de altura, quina de 0,5 mm;
   - **2 lentes em coluna:** anel de metal grafite de Ø 11,2 mm saltado 0,9 mm, vidro de Ø 9,2 mm, elemento interno de Ø 4,2 mm;
   - flash de Ø 4,2 mm ao lado.
9. **Normais:**
   - `WEIGHTED_NORMAL` (FACE_AREA, peso 50, `keep_sharp`) **como último modificador** de cada peça, depois do Boolean;
   - shade smooth em tudo.
   
   As faces planas grandes mandam na normal e somem as manchas nos n-gons.
10. **Ordem de pilha** (hard surface): forma → corte (Boolean) → bevel/microbevel → Weighted Normal por último.
    - Paredes e ranhuras sempre maiores que 2× o bevel.
    - Não use Subdivision: o bmesh com bevel circular dá a mesma leitura com bem menos polígonos (1.932 faces no aro).

**Para não parecer marca:**
- Nada de ilha quadrada com 3 lentes em diagonal (iPhone Pro), lentes soltas em coluna sem ilha (Galaxy S) ou barra horizontal de ponta a ponta (Pixel).
- Nada de logo, de Dynamic Island ou de notch.
- O furo central da câmera frontal é genérico (a maioria dos Android).

**Microdetalhes que valem o custo** (do mais ao menos visível):
1. quina do vidro + vinco vidro/aro;
2. botões;
3. anel e vidro das lentes;
4. linhas de antena;
5. furos (só em close da borda de baixo);
6. rugosidade variável do metal.

Riscos e impressões digitais (textura de rugosidade no vidro) ficam para um close extremo.

---

## 6. Resultado do teste no container

**Arquivos** (pasta `teste-B/`):

| Arquivo | O que é |
|---|---|
| `celular_premium.py` | Script próprio (GPL), parametrizado: `--pct --spp --view --look --exp --vista frente/tras --tela --hdri --fundo escuro/transparente --sem_comp --clay --sheen --oidn --brilho_tela` |
| `gera_tela.py` → `tela_app.png` | UI genérica do app (PIL) |
| `depois_frente_1080x1920.png` | **Quadro final** (32 amostras, OIDN High, compositor) |
| `depois_tras_540x960.png` | Traseira com a ilha da câmera |
| `comparativo_antes_depois.png` | `logo_e_celular.py` × `produto.py` × novo |
| `comparativo_view_transform.png` | Standard × AgX × AgX Punchy × Khronos |
| `comparativo_clay_tras_rgba.png` | Clay (só luz e forma) × traseira × versão RGBA para o Remotion |
| `r25_v1..v3.png` | Rascunhos que mostram a correção da tela lavada pela key |
| `variantes/` | Testes de amostras, OIDN e view transform |

**Tempos.** Blender 5.2.2, Cycles CPU, 4 núcleos, processo a frio. Outro agente renderizava ao mesmo tempo (load average de 1,3 a 3,4), então conte ±20%.

| Render | Tempo de render |
|---|---|
| Rascunho 270×480, 8 amostras | 1,8–2,1 s (6,1 s na 1ª execução: cache frio) |
| 540×960, 16 amostras | 6,2–6,6 s |
| 540×960, 32 amostras (traseira) | 8,1 s |
| **1080×1920, 16 amostras, OIDN Balanced** | **18,5 s** |
| 1080×1920, 16 amostras, OIDN Fast | 17,7 s |
| 1080×1920, 16 amostras, OIDN High | 24,4 s |
| 1080×1920, 32 amostras, OIDN High, sem compositor | 23,9 s |
| **1080×1920, 32 amostras, OIDN High + compositor** | **26,7 s** (processo 27,6 s) |
| ANTES: `produto.py`, 1080×1920, 16 amostras | 19,6 s (processo) |
| ANTES: `logo_e_celular.py`, 1080×1920, 16 amostras | 15,4 s |

**Leituras:**
- **16 contra 32 amostras quase não muda o tempo** (24,4 s contra ~24 s). O custo fixo domina: BVH, OIDN em 2 MP e a amostragem adaptativa que para cedo.
  - A diferença média entre as duas é de 0,17/255 (invisível).
- **OIDN Balanced** economiza ~6 s por quadro em relação ao High, com diferença média de 0,16–0,21/255. Há pixels isolados com até 89/255, nos brilhos finos: confira em close.
- **Premium custou o mesmo que o antigo:** 18,5 s contra 19,6 s no mesmo tamanho e com as mesmas 16 amostras.
- **Plano de 3 s (90 quadros):** ~28 min (Balanced) a ~40 min (High + compositor) em segundo plano.

**O que melhorou** (comparativo lado a lado):
- **Fundo:** saiu do vinho/cinza chapado (51–69/255 no quadro todo) para um preto-azulado com halo só atrás do produto.
- **Corpo:**
  - a espessura aparece (aro claro, linha de rim, botões e antena);
  - o vidro tem borda própria;
  - a traseira é fosca, com ilha e lentes.
- **Tela:**
  - UI real com borda preta e furo da câmera;
  - um sheen diagonal discreto no lugar do reflexo de janela chapado do `produto.py`;
  - cores fiéis (Khronos).

**Limitações:**
- Só 1 quadro foi testado: o flicker do OIDN numa sequência não foi visto.
- A borda esquerda (silhueta contra o fundo) ainda é escura. Se o Daniel quiser contorno dos dois lados, suba a Rim E ou alargue o halo.
- Na animação, o sheen muda com a pose. Isso é o efeito desejado, mas confira os quadros de pico na folha de contato.

---

## 7. Checklist "premium" (para o SKILL.md)

1. **Fundo:**
   - camada: `film_transparent` + degradê no Remotion;
   - still: plano emissivo com degradê, cantos ≤ 5/255 e halo ≤ 40/255.
   
   Nunca use um plano iluminado que encha o quadro.
2. **Key grande e alta:** o reflexo dela não pode cair na tela. Teste num rascunho a 25%, com 8 amostras (2 s).
3. **Sheen controlado:** cartão emissivo que só aparece em reflexos, posicionado por reflexão, com força 8–12.
4. **Rims em faixa** (6 × 110 cm) atrás: 10 W do lado escuro, 4 W do lado da câmera.
5. **HDRI de estúdio Poly Haven** (CC0) a 0,15–0,2, só para reflexos.
6. **Khronos PBR Neutral**, com a exposição ajustada no view transform.
7. **Materiais** da tabela 3.2: Metallic é 0 ou 1; o vidro da tela é preto com rugosidade 0,035 e emissão 1,0.
8. **Modelagem** da seção 5, conferida por um passe **clay** (`--clay`) antes dos materiais.
9. **Render:** 16 amostras + OIDN Balanced/Accurate; `compositor_device='CPU'`. Compositor só com fundo opaco; com RGBA, vinheta e aberração cromática ficam no Remotion.

---

## 8. Recomendação para a skill `blender-ia`

**Nada foi alterado.** Pelo `CLAUDE.md` da main, mudar uma skill precisa da aprovação do Daniel.

| # | Proposta | Por quê |
|---|---|---|
| 1 | Pôr no `produto.py` a opção `--estilo premium`, que troca modelagem, materiais, luz e sheen pelos do `celular_premium.py`. Manter a animação, o `caixas.json`, a sombra em camada e o RGBA do `produto.py`. Alternativa: um `scripts/celular_premium.py` irmão. | O visual melhora sem perder a integração com o Remotion que já foi testada. |
| 2 | **Regra de ouro 5:** trocar "Standard" por "**Khronos PBR Neutral** (UI fiel e brilho comprimido); Standard só se a UI precisar sair idêntica; AgX desbota". | Medido no teste e pela scenario-labs (erro de 3,8 contra 33). |
| 3 | Seção nova "Visual premium", com a checklist da seção 7 e as tabelas 3.1 e 3.2. | Hoje a skill só tem a tabela de luz que "não estoura". |
| 4 | **Armadilhas da API 5.x:** acrescentar:<br>• `render.compositor_device='CPU'`;<br>• `CompositorNodeMixRGB` não existe (use `ShaderNodeMix`);<br>• Glare e Lens Distortion configurados por `inputs[...]`;<br>• `scene.compositing_node_group`;<br>• `Material.use_nodes` obsoleto (o material novo já vem com Principled);<br>• `bmesh.ops.bevel`: passe `segments` e `profile`. | Os quatro primeiros foram vistos neste teste. O último está documentado pela scenario-labs. |
| 5 | Padrão de render final: `--spp 16` + OIDN `BALANCED` + prefilter `ACCURATE`; 32 amostras/High só no still de aprovação. | Mesma imagem, ~25% mais rápido. |
| 6 | `logo_e_celular.py`: trocar o celular e o plano de fundo pelo modelo novo, ou marcar "só para teste de logo". | É dele o "fundo enchendo o quadro" e a "tela degradê". |
| 7 | `APRENDIZADOS.md`: entrada datada com os tempos da seção 6 e os erros vistos:<br>• key baixa lavando a tela;<br>• thin film de 380 nm = lente ciano;<br>• vidro fosco 0,42 = plástico;<br>• rim de 10 W do lado da câmera estourando. | Memória da skill. |
| 8 | Avisar o agente A: o cartão de sheen e as luzes ficam **parados no mundo**; o produto gira. É o "reflexo varrendo" que vende o anúncio. | Integração com a direção de animação. |
