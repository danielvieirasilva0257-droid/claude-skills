# Visual premium: luz, materiais, render e compositor

Detalhe do `SKILL.md`. Testado no Blender 5.2.2 (11–12/10/2026), escala real em metros, tudo implementado em `scripts/premium.py`.
Problemas do teste antigo (`logo_e_celular.py`): brilho do fundo enchendo o quadro (51/255 nos cantos), corpo parecendo fino, tela em degradê liso.

## 1. Resultado medido

- **Fundo:** cantos em 2–4/255 (antes 51/255), halo atrás do celular ~35/255 (antes 69).
- **Espessura:** celular de 8,2 mm em pose 3/4, com aro de metal, quina de 1,2 mm, botões e antenas; a lateral ocupa ~16 px em 1080.
- **Tela:** UI real no vidro (emissão 1,0 sob vidro preto brilhante) e um "sheen" diagonal sutil, no lugar do reflexo de janela chapado.
- **Custo igual ao antigo:** 1080×1920 a 16 amostras + OIDN Balanced: 18,5 s por quadro (antes 19,6 s no `produto.py`). Com compositor + motion blur: 26,7–32,6 s no 1º quadro.

## 2. Luz de estúdio (celular em pé na origem; câmera em −Y a 0,56 m; produto girado −28° em Z e −6° em X)

| Luz | Tipo e tamanho | Posição (m) | Potência | Papel |
|---|---|---|---|---|
| **Key** | área 0,9 × 0,6 | (−0,50, −0,35, **0,65**) | 26 W, 5000–5500 K (1,0/0,98/0,95) | Modela o aro e a traseira. **Alta de propósito:** a 0,40 m de altura o reflexo dela lavava metade da tela |
| **Fill** | área 1,0 × 1,0 | (0,65, −0,35, 0) | 2,5 W, levemente fria | Razão ~1:6 a 1:10 com a key; segura as sombras |
| **Rim E / Rim D** | faixas 0,06 × 1,1 | (∓0,32, 0,30, 0,05) | 10 W (lado escuro), 4 W (lado da câmera) | Linhas de brilho nas quinas: mostram a espessura. A 6–10 W do lado da câmera, a lateral estourou em branco |
| **Topo** | área 0,8 × 0,25 | (0, 0,05, 0,55) | 5 W | Quina de cima e ilha da câmera |
| **Cartão de sheen** | plano emissivo 0,22 × 0,60, degradê quadrático, girado 30° | por cálculo (abaixo) | força 12 (8–12) | Reflexo diagonal na tela. `visible_camera/diffuse/shadow/transmission` desligados: só o glossy vê |
| **Mundo** | HDRI `studio_small_09` 1k (Poly Haven, CC0) | — | 0,18 | Só reflexos ricos no metal; a câmera vê o fundo, não o HDRI |

Referência (cc-blender-skill, MIT): luz de produto key:fill:rim ≈ 5:1:1,5 a ~5000 K.

**Posicionar o sheen** (reflexão do raio da câmera no canto superior esquerdo da tela, na pose de pouso):
```python
p = corpo.matrix_world @ Vector((-W*0.22, H*0.28, D/2))      # ponto na tela
n = (corpo.matrix_world.to_3x3() @ Vector((0, 0, 1))).normalized()
d = (p - cam.matrix_world.translation).normalized(); r = d - 2*d.dot(n)*n   # direção refletida
cartao('Sheen', p + r*0.45, 0.22, 0.60, 12.0, giro=math.radians(30), alvo=p)
```
Força 3 não aparece; 60 lava; **12** dá um degradê sutil.
**Na animação, luzes e cartão ficam PARADOS no mundo; o produto gira.** É o reflexo "varrendo" o vidro que vende o anúncio.

**Fundo:**
- Para camada do Remotion: `film_transparent` + degradê em CSS (`radial-gradient`), mais barato e editável. Vinheta e aberração cromática também no Remotion.
- Para um still com fundo do Blender: plano a 0,55 m atrás com Emission = degradê esférico (ColorRamp EASE), centro (0,085, 0,095, 0,125) linear, borda (0,004, 0,0045, 0,006), elipse ~0,22 × 0,30 m, centro 3 cm acima do celular. `--fundo escuro` no `premium.py`.
- **Regra: halo atrás do produto ≤ 40/255, cantos ≤ 5/255.** Nunca um plano iluminado que encha o quadro.

## 3. Materiais (Principled BSDF; Metallic é 0 ou 1, nunca meio-termo)

| Peça | Base Color (linear) | Metallic | Roughness | Outros |
|---|---|---|---|---|
| Aro de alumínio anodizado (prata) | (0,80, 0,81, 0,83) | 1 | 0,16–0,26 via Noise (escala 900/6/900: riscos ao longo do comprimento) | Alumínio cru medido: (0,916, 0,923, 0,924); anodizado colorido = cor do corante no Base Color |
| Aço escovado / titânio | aço (0,67, 0,64, 0,60); titânio (0,44, 0,40, 0,36) | 1 | 0,25–0,35 | Escovado de verdade: `Anisotropic` 0,5–0,8 + `Tangent` na direção do risco (só Cycles) |
| Vidro da tela | (0, 0, 0) | 0 | **0,035** | IOR 1,52; Emission Color = textura da UI; Emission Strength **1,0** (com Khronos) |
| Vidro traseiro fosco | (0,012, 0,017, 0,028) | 0 | **0,30** | IOR 1,52. Com 0,42 e base mais clara (0,03/0,04/0,065) ficou cinza "de plástico" |
| Vidro da ilha | igual à traseira | 0 | 0,06 | brilhante, contrasta com o fosco |
| Anel da lente | (0,30, 0,31, 0,33) grafite | 1 | 0,18 | Prata (0,80) virou anel branco chapado |
| Vidro da lente | (0,004, 0,005, 0,009) | 0 | 0,02 | IOR 1,5; Thin Film **120 nm** / IOR 1,38. Com **380 nm** a lente ficou ciano forte (olho de desenho) |
| Plástico fosco (antena, botão de plástico) | (0,36, 0,37, 0,39) | 0 | 0,55 | |
| Fundo dos furos | (0,005) | 0 | 0,7 | |
| Flash | (0,85, 0,80, 0,62) | 0 | 0,35 | |

Fonte dos valores medidos de cor base linear e IOR: Physically Based (API, CC0): alumínio, aço inox, titânio, cromo (0,654, 0,685, 0,701); IOR vidro 1,52, acrílico 1,49, policarbonato 1,58, safira 1,77.
`Material.use_nodes` está obsoleto no 5.x (sai no 6.0): o material novo já vem com o Principled.

## 4. Tela emissiva com a UI do app

- **UV em metros** gerado no bmesh do vidro: `u = x/largura + 0,5`, `v = y/altura + 0,5`.
- O **shader** do `premium.py` recorta a **área ativa** (68 × 145,4 mm; raio de canto 9,2 mm; borda preta de 1,3 mm) e faz o furo da câmera frontal (Ø 3,2 mm, a 4,6 mm do topo). A UI é uma imagem **1080 × 2309 px** (proporção 0,4677) sem borda nem canto; o preto não emite.
- `Cubic` na interpolação da textura; mantenha ≥ 16 px/mm quando a tela ocupar o quadro.
- No vídeo real: sequência PNG da UI do Remotion, em 1080×2309 (`--tela quadro_0001.png --tela_seq N`). O script avisa se a proporção da imagem sair do esperado.
- `scripts/tela_teste.py` gera uma UI genérica (sem texto) para testes.

## 5. View transform e exposição

| View | Resultado | Quando usar |
|---|---|---|
| **Khronos PBR Neutral** | UI fiel e saturada, fundo azul-noite, brilhos comprimidos | **Padrão para produto + tela de app** |
| Standard | UI certa, mas o fundo fica acinzentado e o metal estoura | Só se a cor da UI precisar ser idêntica pixel a pixel (e mesmo assim o Khronos erra menos) |
| AgX / AgX Punchy | UI desbotada (verde e laranja pastel) | Cenas sem UI, ambiente |

- Erro de cor de marca medido pela scenario-labs (MIT), em passos de 8 bits: Khronos **3,8**; AgX 27–42; Standard 33.
- O Khronos foi feito para fotografia de produto (cena bem exposta, HDR só em pequenos brilhos). Os devs dizem que o AgX ainda é melhor para cenas gerais; há relato de sombra negativa com luz muito saturada.
- O Khronos comprime canais acima de ~0,76 linear: para a UI, **Emission ≤ 1,0**.
- **Exposição:** `view_settings.exposure` (+1 = dobro de tudo, mantendo as razões), nunca escalando as lâmpadas.

## 6. Render Cycles na CPU (4 núcleos)

```python
cy.samples = 16                      # 32 só para o still de aprovação (o custo fixo domina)
cy.use_adaptive_sampling = True; cy.adaptive_threshold = 0.015; cy.adaptive_min_samples = 8
cy.use_denoising = True; cy.denoiser = 'OPENIMAGEDENOISE'
cy.denoising_input_passes = 'RGB_ALBEDO_NORMAL'; cy.denoising_prefilter = 'ACCURATE'   # ACCURATE não borra detalhe
cy.denoising_quality = 'BALANCED'    # HIGH custa +6 s/quadro com diferença média de 0,2/255
cy.max_bounces = 8; cy.diffuse_bounces = 2; cy.glossy_bounces = 4; cy.transmission_bounces = 4
cy.caustics_reflective = cy.caustics_refractive = False
cy.sample_clamp_indirect = 5.0; cy.blur_glossy = 0.5    # sem vaga-lumes, brilho direto intacto
scene.render.compositor_device = 'CPU'                  # OBRIGATÓRIO no -b com compositor (senão libEGL)
```
- A tela é Principled opaco com emissão: 4 bounces de transmissão bastam. Para vidro de verdade (lente transparente sobre a UI), `transmission_bounces ≥ 16` (cc-blender-skill) e mais ruído.
- 16 contra 32 amostras quase não muda o tempo (custo fixo: BVH, OIDN em 2 MP, adaptativa que para cedo) e a diferença média é 0,17/255.
- OIDN Balanced economiza ~6 s/quadro contra High; há pixels isolados com até 89/255 nos brilhos finos: confira em close.

| Render (4 CPUs, a frio) | Tempo |
|---|---|
| Rascunho 270×480, 8 amostras | 1,4–2,1 s (9,5 s no 1º quadro) |
| 540×960, 16 amostras | 6,2–6,6 s |
| **1080×1920, 16 amostras, OIDN Balanced** | **18,5 s** |
| 1080×1920, 16 amostras, OIDN High | 24,4 s |
| 1080×1920, 32 amostras, High + compositor | 26,7 s |
| `premium.py` 1080×1920, 16 amostras, Balanced, motion blur + compositor | 23,5–24,7 s (quadros 20, 50, 80); 32,6 s o 1º, a frio |
| Plano de 3 s (90 quadros) | ~36 min com tudo ligado no `premium.py`; ~28 min (Balanced, sem compositor); ~40 min (High + compositor); em segundo plano |

## 7. Compositor no 5.x (código próprio testado; `premium.py --comp`)

```python
tr = bpy.data.node_groups.new('Comp', 'CompositorNodeTree'); sc.compositing_node_group = tr
tr.interface.new_socket(name='Image', in_out='OUTPUT', socket_type='NodeSocketColor')
rl = tr.nodes.new('CompositorNodeRLayers'); go = tr.nodes.new('NodeGroupOutput')
gl = tr.nodes.new('CompositorNodeGlare')                       # ajustes são ENTRADAS (sockets)
gl.inputs['Type'].default_value = 'Bloom'; gl.inputs['Quality'].default_value = 'High'
gl.inputs['Threshold'].default_value = 0.85; gl.inputs['Strength'].default_value = 0.18; gl.inputs['Size'].default_value = 0.55
ld = tr.nodes.new('CompositorNodeLensdist'); ld.inputs['Dispersion'].default_value = 0.006   # aberração cromática sutil
```
- `CompositorNodeMixRGB` **não existe** no 5.2: use `ShaderNodeMix` (`data_type='RGBA'`, `blend_type='MULTIPLY'`), que funciona na árvore do compositor.
- Vinheta (só com fundo opaco): `EllipseMask(0.95, 0.80)` → `Blur 300 px` → `MapRange(0.75..1)` → `ShaderNodeMix MULTIPLY`.
- Custo: ~3 s por quadro em 1080×1920. Com fundo transparente, glare e dispersão preservam o alpha (conferido: 0 no canto, 255 no celular).

## 8. Checklist "cara de comercial"

1. **Fundo:** transparente + degradê no Remotion, ou still com cantos ≤ 5/255 e halo ≤ 40/255. Nada de plano iluminado enchendo o quadro.
2. **Key grande e alta:** o reflexo dela não pode cair na tela. Teste num rascunho a 25%, 8 amostras (2 s).
3. **Sheen controlado:** cartão emissivo só em reflexo, posicionado por reflexão, força 8–12.
4. **Rims em faixa** (6 × 110 cm) atrás: 10 W do lado escuro, 4 W do lado da câmera.
5. **HDRI de estúdio** Poly Haven (CC0) a 0,15–0,2, só para reflexos.
6. **Khronos PBR Neutral**, exposição no view transform.
7. **Materiais** da tabela 3: Metallic 0 ou 1; vidro da tela preto com rugosidade 0,035 e emissão 1,0.
8. **Modelagem** (`modelagem.md`) conferida num passe **clay** (`--clay`) antes dos materiais.
9. **Pose 3/4** (−28° Z, −6° X): a espessura aparece; aro claro com faixa de rim.
10. **Movimento** conferido pelo `verifica_curvas.py` e a varredura do reflexo ≥ 20 quadros.
11. **Render:** 16 amostras + OIDN Balanced/Accurate; `compositor_device='CPU'`; motion blur 0,5.
12. **Aprovação:** 1 quadro em 1080×1920 mostrado ao Daniel antes do render final.

## 9. Erros vistos (para não repetir)

- Key baixa (0,40 m de altura) lavando a tela; thin film de 380 nm = lente ciano; vidro fosco com roughness 0,42 = plástico; rim de 10 W do lado da câmera estourando a lateral; anel da lente prateado = disco branco chapado.
- Com o compositor ligado, o `-b` tentou GPU e falhou (`libEGL`): `compositor_device = 'CPU'`.
- A borda esquerda (silhueta contra o fundo) ainda fica escura: se o Daniel quiser contorno dos dois lados, suba a Rim E ou alargue o halo.
- Só 1 quadro foi visto para flicker do OIDN; numa sequência longa, confira na folha.

## 10. Fontes (só leitura; texto não copiado)

- `scenario-labs/skills` (MIT; `scenario-blender-lighting-rendering`, `scenario-blender-hard-surface`): erro de cor por view transform, exposição, compositor 5.x, bevel duplo, Weighted Normal por último, regra da largura.
- `RobLe3/cc-blender-skill` (MIT; `blender-materials`, `blender-lighting`, `blender-rendering`): "Metallic é chave, não controle deslizante"; razão de luz de produto; `transmission_bounces ≥ 16` para vidro grosso. A regra "nunca use Standard" e as 256 amostras pressupõem GPU: não adotadas.
- `arjun988/blender-skills` (MIT): rig "Product Hero Shot" (softbox, 2 rims, fundo em degradê, 85 mm): confirma o caminho.
- Poly Haven (CC0): HDRIs de estúdio; Physically Based (CC0): cores e IORs medidos.
- Notas da versão 4.2 do Blender (Khronos PBR Neutral); manual do Principled BSDF (CC-BY-SA, paráfrase); API do OIDN e do Lens Distortion.
- Vagon (02/2025), Derek Elliott/BlenderNation (2019), Superhive "Dark Luxury Studio" (pago): confirmam três pontos + softbox + rim e fundo escuro em degradê. Não achamos tutorial gratuito de 2025–26 sobre reflexo em tela de celular: as receitas vêm do teste.
