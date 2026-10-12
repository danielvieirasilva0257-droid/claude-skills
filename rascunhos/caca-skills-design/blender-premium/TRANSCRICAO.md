# Transcrição: pesquisas "Blender premium" (11–12/10/2026)

Registro fiel do que os dois agentes de pesquisa acharam. Os textos completos, com todos os links, estão em `pesquisa-A.md` (27 KB) e `pesquisa-B.md` (26 KB), nesta pasta; os testes estão em `teste-A/` e `teste-B/`. Aqui ficam os achados, números e fontes, sem opinião minha; minhas observações estão marcadas como **[transcrição]**.
Pedido do usuário: adicionar à skill `blender-ia` (estilo Frankenstein, pode modificar livremente) direção de animação, fluidez, suavização de keyframes, visual premium (luz, materiais, render) e modelagem 3D.
Base usada: skill `blender-ia` de 11/10/2026, regras de composição do editor (`remotion-video`), `motion-oficial/references/molas-e-curvas.md`, `guia/LEIA-ANTES-DE-USAR.md` seções 3–4.
Legenda do agente A: **MEDIDO** = rodou no container; **FONTE** = está na fonte; **INFERÊNCIA** = conclusão do agente, a validar com o olho do Daniel.

---

## Pesquisa A: direção de animação, fluidez e suavização de keyframes

Blender 5.2.2 LTS, 4 CPUs, sem GPU. Teste em `teste-A/` (`curvas_premium.py`, `sonda.py`, `sonda_modificadores.py`, `curvas_v1.csv`, `curvas_v2.csv`, `resumo_v1.json`, `resumo_v2.json`, `folha_v1_mb.png`, `folha_v2_mb.png`, quadros e logs).

### Resumo em 6 pontos (do agente)

1. **Curva do Remotion no Blender:** handles Bezier de um `cubic-bezier(x1,y1,x2,y2)` reproduzem a curva-alvo com erro máximo de **0,00005%** do curso (float32), em quadros e subquadros, 7 canais.
2. **O que deixa o movimento premium é a direção, não a curva.** Na v1 (expo-out na órbita + mola rápida no produto) o reflexo cruzou o vidro em **8 quadros** (0,27 s), rápido demais. Na v2 (curvas mais longas, canais defasados em 6 quadros) levou **22 quadros**, e a folha ficou legível.
3. **Overshoot premium é pequeno:** mola ζ 0,8 passa 1,5%; BACK com `back = 0.5` passa 0,8%; o BACK padrão (1,70158) passa 10% (desenho animado); handle `(0.2, 1.2, 0.3, 1)` passa 1,25%.
4. **Caminho com 3+ chaves:** com um ease por trecho a câmera para na chave do meio (velocidade 0). Com `AUTO_CLAMPED` + `auto_smoothing = 'CONT_ACCEL'` passa direto e o salto de aceleração cai 6,4×.
5. **Armadilhas novas no 5.x:** o modificador `CYCLES` no modo padrão volta 358° por ciclo (o motion blur borra esse quadro): use `REPEAT_OFFSET`; a lente fica no dado da câmera (action e slot próprios); `Action.fcurve_ensure_for_datablock` cria camada, faixa, slot e channelbag de uma vez.
6. **Custo:** prévia a 25% com Cycles 4 amostras + OIDN: 0,68–0,74 s por quadro (30 quadros em ~26 s de processo); motion blur de obturador 0,5 acrescentou ~3%.

### Fontes (A)

**Catálogo de skills** (`npx skills@1.7.2 find`, 6 buscas):

| Skill / repo | Licença | Nota do agente |
|---|---|---|
| `roble3/cc-blender-skill` (`blender-animation`, `animation-quality-gate`, `knowledge/09-animation`, `08-cameras-composition`), ~900 instalações | MIT (2026) | Genérica. Helper 4.x/5.x que percorre `layers → strips → channelbags`. **A receita 4 tem um bug:** põe `BOUNCE` na última chave, onde não tem efeito. O `quality-gate` exige folha de contato antes de aceitar uma animação. Tabela de lentes: 50 mm neutra, 85 mm íntima, 100–135 mm herói de produto com DOF raso. **[transcrição]** o repositório é `RobLe3/cc-blender-skill` (a pesquisa A grafou `roble3`). |
| `dylantarre/animation-principles` (`3d-spatial`, `10-by-time-scale/dramatic-2000ms-plus`) | MIT (2024) | Os 12 princípios no 3D, genérico. "Dramático" (≥ 2 s): antecipação de 400–600 ms; "câmera recua antes do push-in". Curvas: `(0.22,0.61,0.36,1)`, `(0.25,1,0.5,1)`. |
| `affaan-m/ecc@blender-motion-state-inspection`, 6 mil instalações | MIT (2026) | Para personagens e rigs (fora do escopo). Ideia aproveitada: extrair os fatos quadro a quadro antes de julgar pelo print (virou o CSV). |
| `kevinbadi/blender-skills` (`slow-zoom`, `crane-shot`, `dolly-rotate`, `perfect-loop`, `product-polish`) | **sem licença** (todos os direitos reservados) | Lido só como dado. O `slow-zoom`: push-in de 5 s, lente 35→65 mm, distância 4,0→1,8; usa 24 fps e o Bezier padrão do Blender. **Não copiar.** |
| `emilkowalski/skills@apple-design` | MIT | Mola Apple: mover ζ 1,0, response 0,4; girar ζ 0,8, response 0,4. Usou ζ 0,8–0,85 na rotação. |
| `hyperframes-*`, `gsap-timeline`, `threejs-animation`, `ue-sequencer-cinematics` | várias | Fora da fatia. |

**Web:**

| Fonte | Licença | Nota |
|---|---|---|
| Blender Manual 5.2: F-Curves, Introduction | CC-BY-SA 4.0 (paráfrase) | A f-curve nunca volta no tempo; arrastar uma chave para trás de outra inverte a ordem. |
| Manual 5.2: F-Curve Properties | CC-BY-SA 4.0 | Handles: Automatic (suave, pode passar do ponto); Auto Clamped (sem overshoot e sem "S"); Vector (reta); Aligned (manual, colinear); Free (manual, independente). Handle Smoothing "Continuous Acceleration" minimiza saltos de aceleração; a propagação para em chaves Free, Aligned, Vector e nos extremos Auto Clamped. O manual recomenda Auto Clamped por padrão. Easings Penner: Back, Elastic, Bounce. |
| Manual 5.2: F-Curve Modifiers | CC-BY-SA 4.0 | **Noise:** Scale (horizontal), Strength (vertical), Phase (semente), Offset, Depth, Lacunarity, Roughness; no modo Replace o ruído fica em [−0,5; 0,5]. **Cycles:** Repeat, Repeat with Offset, Repeat Mirrored, Count; **precisa ser o primeiro da pilha**; incompatível com Smooth (Gaussian). Todos aceitam Influence e Restrict Frame Range com Blend In/Out. |
| Manual 5.2: Graph Editor, Editing | CC-BY-SA 4.0 | Decimate (razão ou erro máximo), Bake Keyframes, Smooth (Gaussian: Factor, Sigma, Filter Width), Butterworth (dados densos; preserva picos, pode ondular), Blend to Ease. |
| Manual 5.2: Cycles, Motion Blur | CC-BY-SA 4.0 | Shutter em **quadros**: 1,0 borra o quadro inteiro, 0,5 = 180°. Position: Start/Center/End on Frame. Luzes em movimento não borram; câmera ortográfica não borra. |
| API 5.x: `anim_utils`, `Action` 5.0, `ActionKeyframeStrip` | docs | `action_ensure_channelbag_for_slot`, `Action.fcurve_ensure_for_datablock`, `strip.channelbag(slot, ensure=...)`, `strip.key_insert(...)`. |
| WARC, MacLachlan & Logan (shot length em comerciais) | paywall (resumo) | Em 1991 o plano médio de comercial de TV já era < 2 s. |
| LBB: bastidores "Shot on iPhone" Ano-Novo Chinês | artigo | Na Apple cada plano é "performado" em câmera lenta e acelerado na pós. |
| Cannes Lions: Sarofsky, iMac Pro | página de prêmio | Phantom a 270 fps + CG; o desafio declarado é fazer o CG parecer fotografado. |
| Manfrotto, "How to shoot cinematic tech videos like Apple" | não lido (HTTP 429) | Pelo resumo da busca: 3 partes (herói, detalhes, produto em contexto). Não verificado. |

**Lacuna declarada pelo agente:** nenhuma fonte 2025–2026 com números de animadores de filmes de produto; os números de direção são inferência ancorada nas molas e curvas da base e nas medições.

### Regras de direção (A), a 30 fps

**Durações por tipo de plano:**

| Plano | Duração | Quadros | Quanto mover | Curva | Tipo |
|---|---|---|---|---|---|
| Revelação-herói | 3–5 s | 90–150 | rotação relativa 25–40°; varredura 10→90% ≥ 20–30 quadros | mola ζ 0,85, response 2–2,5 s, defasada 6 q; ou in-out | MEDIDO (8 q rápido; 22 q legível) + INFERÊNCIA |
| Push-in lento (dolly) | 3–5 s | 90–150 | 15–30% da distância (teste 0,62→0,46 m = 26%); dolly, não zoom | `(0.65,0,0.35,1)` se parte parado; `(0.3,0.15,0.2,1)` se entra no corte andando | FONTE (cc-blender) + INFERÊNCIA |
| Órbita / arco | 3–6 s | 90–180 | 20–40° (7–13°/s), câmera filha de pivô | `(0.3,0.15,0.2,1)` | MEDIDO (v2) |
| Crane | 3–5 s | 90–150 | 0,5–1× a altura do produto, sem cruzar a linha do olho | in-out | INFERÊNCIA |
| Turntable / loop | 6–8 s por volta | 180–240 | 45–60°/s | LINEAR + extrapolação linear, ou Cycles `REPEAT_OFFSET` | skill atual + MEDIDO |
| Entrada e pouso | 0,5–0,8 s | 15–25 | da borda (regra 4) | expo-out `(0.16,1,0.3,1)` ou mola ζ 0,8 | FONTE |
| Detalhe macro | 1,5–2,5 s | 45–75 | 2–5% do quadro por segundo | `(0.33,0,0.67,1)` | INFERÊNCIA |
| Pausa antes do corte/texto | ≥ 8–10 q | — | deriva residual | — | FONTE + INFERÊNCIA |

**Curva pelo espaçamento (MEDIDO, 90 quadros):** expo-out `(0.16,1,0.3,1)`: passo1 6,9%, 50% em q11, 90% em q31, vmax 6,1×; ease-out forte `(0.23,1,0.32,1)`: 4,9%, q13, q34, 4,3×; move `(0.25,1,0.5,1)`: 4,4%, q15, q41, 3,9×; **drift `(0.3,0.15,0.2,1)`**: 0,6%, q27, q55, **2,5×** (velocidade inicial 0,54× a média); Easy Ease `(0.33,0,0.67,1)`: 0,04%, q46, q73, 1,5×; **dolly `(0.65,0,0.35,1)`**: 0,01%, q46, q65, 2,9×; in-out forte `(0.77,0,0.175,1)`: 0,01%, q44, q60, 4,9×. Regra (INFERÊNCIA): câmera de plano-herói com **vmax ≤ 3×**.

**Overshoot (MEDIDO):** handle `(0.16,1.05,0.3,1)` 0,04%; `(0.16,1.1,0.3,1)` 0,24%; `(0.2,1.2,0.3,1)` 1,25%; `(0.34,1.56,0.64,1)` 9,8%. BACK (chave de partida): `back=0.5` 0,82%; 1,0 → 3,7%; 1,70158 → 10%. Mola (pico teórico e^(−πζ/√(1−ζ²))): ζ 0,9 → 0,15%; 0,8 → 1,5%; 0,7 → 4,6%; 0,6 → 9,5%.
Regras: câmera 0%; rotação do produto 1–2% (num giro de 65°, 1,5% ≈ 1°; medido: pico de 15,98° para alvo de 15°); logo/objeto pequeno 2–4%; opacidade e cor nunca. Mola ζ 0,8 com response R: pico em ~0,9 R, assenta (< 0,02%) em ~2 R (R = 1,1 s: pico no quadro 30, 99,98% no quadro 60).

**Quantos keyframes:** 1 movimento = 2 chaves por canal. Passar por um ponto: `AUTO_CLAMPED` + `CONT_ACCEL`, nunca ease por trecho. Medido na chave do meio (média 0,0112 por quadro): ease por trecho: vel 0, salto 9,6e-4; `AUTO_CLAMPED` sem suavização: 0,012, 1,08e-3; `AUTO_CLAMPED` + `CONT_ACCEL`: 0,018, 1,7e-4 (6,4× menor); `AUTO` + `CONT_ACCEL`: 0,019, 2,6e-5 (41× menor, passa 0,018% do fim). Mola: 1 chave por quadro assada (`assa_mola`; erro entre quadros 0,0066%). Defasar canais em 4–8 quadros. Arcos: câmera filha de empty-pivô girando em Z.

**Como suavizar:** (1) entrada no corte já em movimento (drift), ou in-out se o plano começa parado; (2) saída com 5–15% do movimento ainda acontecendo, ou hold ≥ 8–10 quadros com deriva; (3) micro-deriva: `Noise` na rotação da câmera, Scale 40, Strength 0,3°, Depth 0 (medido: 0,15° pico a pico em 10 s, passo máximo 0,005° por quadro; nunca na posição do produto); (4) motion blur sempre, shutter 0,5, ~3–4% de CPU, luzes paradas; (5) dados densos: Butterworth ou Gaussian; Decimate por erro máximo; (6) conferência objetiva por CSV e folha.

**Câmera premium:** 85 mm (100 mm no detalhe); lente constante, ou mudança de no máximo 10–20% junto com o dolly; `TRACK_TO` num empty que é também o `dof.focus_object`; pivô no centro do produto; varredura do reflexo = momento-herói (rotação relativa 25–40°, ≥ 20–30 quadros em 10→90%); não empilhar dois ease-out rápidos no mesmo sentido.

### Receitas (A)

Código completo em `pesquisa-A.md` seção 4 e `teste-A/curvas_premium.py`: `fcurve_de()` (usa `Action.fcurve_ensure_for_datablock`), `curva()` (handles FREE a partir do cubic-bezier, um bezier por trecho), `assa_mola()` (mola Apple assada), plano-herói v2 (`pivo` com `(0.3,0.15,0.2,1)` de −30° a 0; dolly −0,62→−0,46 com `(0.65,0,0.35,1)`; mola ζ 0,85, response 2,4 s, quadros 7→90, −40°→15°; motion blur 0,5), caminho por 3 chaves, BACK discreto na chave de partida, lente em `cam.data`, Noise com faixa restrita e blend, turntable com `CYCLES`/`REPEAT_OFFSET`, conferência de erro por canal.

### Resultado do teste (A)

Erro da curva: órbita 0,00002%/0,00003% (quadros/subquadros); dolly 0,00004%/0,00005%; entrada `(0.22,1,0.36,1)` em 20 q 0,00002%; método `keyframe_insert` da skill atual 0,00002–0,00003%; 4 curvas com overshoot até 0,00005%; mola ζ 0,8 R 1,1 s: 0 / 0,0066%; mola v2: 0 / 0,0037%. O depsgraph (`frame_set`) bate com `fcurve.evaluate` (0,0 rad); o handle FREE ficou no lugar após `fc.update()`.
Render (Cycles 4 amostras + OIDN, 270×480, 30 quadros): v1 com motion blur 25,2 s (mediana 0,70; 1º 4,60); v1 sem 20,6 s (0,68; 0,78); v2 com 26,7 s (0,74; 0,77). Medidas sem render: ~1,8 s de processo.
Folhas: v1: o brilho do key cruza o vidro em ~12 quadros reais (10→90% em 8 q); depois 2,5 s só de push-in. v2: ~27 quadros reais na folha (10→90% em 22 q), depois o lado iluminado e o push-in contínuo.
Limite declarado: o visual do teste é sem UI, HDRI nem DOF.

### Armadilhas da API 5.x (A)

(1) `Action.fcurve_ensure_for_datablock(datablock, data_path, index, group_name)`: a action tem de estar atribuída antes. (2) Chaves direto: `FREE` antes de posicionar os handles; `fc.update()` no fim preserva os FREE. (3) A interpolação vale para o trecho depois da chave (o `cc-blender-skill` erra; a skill atual já registrava). (4) f-curve é float32: derivada com passo ≥ 0,5 quadro. (5) Lente, DOF e foco em `cam.data` (slot começa com `CA`). (6) `CYCLES`: `REPEAT_OFFSET`, 1º da pilha, não combina com Smooth. (7) `Noise` Replace: ±0,5 × strength; Strength 0,3° deu 0,15° pico a pico em 300 quadros. (8) `fc.auto_smoothing` por f-curve, só age em `AUTO` e `AUTO_CLAMPED`. (9) `motion_blur_shutter` em quadros; luzes e ortográfica não borram. (10) `render.fps = 30` antes de assar molas (o padrão é 24).

### Recomendação (A) para a skill

Entra: seção "Direção de animação premium" (tabelas 3.1, 3.2, 3.3 e regras 3.4–3.5); trocar `anima()` por `fcurve_de()` + `curva()` (manter `fcurves()` para leitura); `assa_mola()`; `verifica_curvas.py`; armadilhas 1, 2, 5, 6, 7 e 10; itens de checklist (vmax ≤ 3×, varredura ≥ 20 q, nenhuma parada no meio, motion blur 0,5, canais defasados). Não entra: skills de terceiros como dependência; números de "comercial Apple" como se fossem fonte. Próximo passo sugerido: renderizar a v2 com o `produto.py` real e mostrar as duas folhas ao Daniel (calibrar varredura 20/30/40 quadros e overshoot 0,8%/1,5%).

---

## Pesquisa B: visual premium (luz, materiais, render) e modelagem 3D

Pergunta: como fazer o render ter cara de comercial premium. Problemas do teste anterior: brilho do fundo enchendo o quadro, corpo fino, tela em degradê liso. Teste em `teste-B/` (`celular_premium.py`, `gera_tela.py`, `introspect.py`, `tela_app.png`, `depois_frente_1080x1920.png`, `depois_tras_540x960.png`, `comparativo_antes_depois.png`, `comparativo_view_transform.png`, `comparativo_clay_tras_rgba.png`, `r25_v1..v3.png`, `antes/`, `variantes/`).

### Resumo em 7 pontos (do agente)

1. O teste melhorou os três problemas: fundo (cantos em 2–4/255 contra 51/255; halo ~35/255), espessura (8,2 mm, 3/4, aro de metal, quina de 1,2 mm, botões, antenas), tela (UI real, emissão 1,0 sob vidro preto brilhante, sheen diagonal sutil).
2. Custo igual: 1080×1920 em 18,5 s (16 amostras, OIDN Balanced) contra 19,6 s do `produto.py`; 32 amostras + OIDN High + compositor: 26,7 s.
3. **View transform `Khronos PBR Neutral` no lugar de Standard:** UI fiel e saturada, brilho comprimido sem lavar; AgX desbota a UI; Standard deixa o fundo acinzentado.
4. A cara de anúncio vem da luz: key grande e ALTA; duas faixas de rim; cartão de sheen (plano emissivo só para reflexo, por cálculo de reflexão); HDRI de estúdio CC0 fraco.
5. Modelagem: perfil de retângulo arredondado em bmesh (raio real, topologia limpa); vidros encaixados no aro; Weighted Normal por último; furos de alto-falante e USB-C com boolean EXACT (aro de 1.702 para 1.932 faces).
6. Pegadinha do 5.2: com compositor ligado, o `-b` tentou GPU e falhou (`libEGL`): `scene.render.compositor_device = 'CPU'`.
7. Recomendação: levar as receitas para a skill como `--estilo premium` no `produto.py` ou script irmão (precisa de aprovação do Daniel).

### Fontes (B)

`npx skills@1.7.2 find` com: blender, 3d modeling, product render, lighting, materials, procedural modeling, blender lighting, blender materials, product visualization, cycles render. Clones rasos em `scratchpad/hunter/downloads/<nome>-BB/`; lidos como dado, nenhum script de terceiros executado.

| Fonte | Licença | Nota do agente |
|---|---|---|
| RobLe3/cc-blender-skill (`blender-materials`, `blender-lighting`, `blender-rendering`) | MIT (conferida) | "Metallic é chave, não controle deslizante" (0 ou 1); classe `product` com key:fill:rim 5:1:1,5 a 5000 K; `transmission_bounces ≥ 16` para vidro grosso. A regra "nunca Standard" e as 256 amostras pressupõem GPU. |
| scenario-labs/skills: `scenario-blender-lighting-rendering`, `scenario-blender-hard-surface` | MIT (conferida) | A mais útil, testada no 5.2. Erro de cor de marca em passos de 8 bits: Khronos 3,8; AgX 27–42; Standard 33. Exposição no view transform. Compositor 5.x: `scene.compositing_node_group`, Glare por sockets. Hard surface: dois bevels (desenho de 8–12 segmentos + microbevel 30° com Harden Normals), Weighted Normal por último; paredes > 2× a largura do bevel; `bmesh.ops.bevel` padrão `segments=0, profile=0`. |
| arjun988/blender-skills (`lighting`, `lookdev`, `procedural-modeling`) | MIT (conferida) | Rig "Product Hero Shot": softbox de 2 m², 2 rims atrás, fundo em degradê, 85 mm. Confirma o caminho. |
| vladmdgolam/agent-skills@blender-mcp, sfkislev/flue@Blender, freshtechbro@blender-web-pipeline, ifbars/blender-agent-studio, kevinbadi@polyhaven-material-swap | não conferida | Fora do foco ou já vistas; não lidas. |
| Poly Haven (API e FAQ) | CC0 | 96 HDRIs "studio". Mais baixados: `brown_photostudio_02`, **`studio_small_09`** (octaboxes grandes, fundo infinito branco, contraste médio, 2750 K; usado, versão 1k, 1,6 MB), `studio_small_08` (contraste baixo), `studio_small_03` (alto). |
| Physically Based (API) | CC0 (conferida) | Base color linear: alumínio (0,916, 0,923, 0,924); aço inox (0,669, 0,639, 0,598); titânio (0,441, 0,400, 0,361); cromo (0,654, 0,685, 0,701). IOR: vidro 1,52; acrílico 1,49; policarbonato 1,58; safira 1,77. |
| Notas da 4.2 (Khronos PBR Neutral) e devtalk | docs | Feito para fotografia de produto (bem exposta, HDR só em pequenos brilhos). Devs: AgX melhor para cenas gerais; relato de sombra negativa com luz muito saturada. |
| Manual do Principled BSDF; API do Denoise Node; API do Lens Distortion 5.0 | CC-BY-SA / docs | Anisotropia (só Cycles) com Tangent para escovado; Coat; Thin Film; prefilter `ACCURATE`; qualidade High/Balanced/Fast; `Dispersion` = aberração cromática. |
| Vagon (02/2025), Derek Elliott/BlenderNation (2019), Superhive "Dark Luxury Studio" (pago) | artigos/produto | Confirmam três pontos + softbox + rim e fundo escuro em degradê. Sem tutorial gratuito de 2025–26 sobre reflexo em tela de celular. |

### Receitas com números (B), no Blender 5.2.2, escala real

**Luz (celular em pé na origem; câmera em −Y a 0,56 m; produto −28° Z, −6° X):**

| Luz | Tipo e tamanho | Posição (m) | Potência | Papel |
|---|---|---|---|---|
| Key | área 0,9 × 0,6 | (−0,50, −0,35, 0,65) | 26 W, 5000–5500 K (1,0/0,98/0,95) | modela aro e traseira; alta porque a 0,40 m o reflexo lavava metade da tela (`r25_v1.png`) |
| Fill | área 1,0 × 1,0 | (0,65, −0,35, 0) | 2,5 W, levemente fria | razão ~1:6 a 1:10 |
| Rim E / D | faixas 0,06 × 1,1 | (∓0,32, 0,30, 0,05) | 10 W (lado escuro), 4 W (lado da câmera) | linhas de brilho nas quinas; 6–10 W do lado da câmera estourou a lateral |
| Topo | área 0,8 × 0,25 | (0, 0,05, 0,55) | 5 W | quina de cima e ilha |
| Cartão de sheen | plano emissivo 0,22 × 0,60, degradê quadrático, girado 30° | por cálculo | força 12 (8–12) | reflexo diagonal na tela; só glossy o vê |
| Mundo | HDRI `studio_small_09` 1k | — | 0,18 | só reflexos no metal |

Sheen: reflexão do raio da câmera no ponto (−0,22 W, 0,28 H, D/2) da tela, cartão a 0,45 m na direção refletida. Força 3 não aparece; 60 lava; 12 dá degradê sutil. Na animação, o cartão e as luzes ficam parados no mundo (o reflexo varre quando o celular gira).
Fundo: plano a 0,55 m atrás, Emission = degradê esférico (ColorRamp EASE), centro (0,085, 0,095, 0,125), borda (0,004, 0,0045, 0,006), elipse ~0,22 × 0,30 m, centro 3 cm acima. Medido (luminância 0–255): cantos 4,3 e 1,7 (antes 51); atrás do celular 35,5 (antes 69). Regra: halo ≤ 40/255, cantos ≤ 5/255. Para camada: `film_transparent` + degradê CSS.

**Materiais:** aro de alumínio anodizado (0,80, 0,81, 0,83), metallic 1, roughness 0,16–0,26 via Noise (escala 900/6/900); aço (0,67, 0,64, 0,60) / titânio (0,44, 0,40, 0,36), roughness 0,25–0,35 (escovado: Anisotropic 0,5–0,8 + Tangent); vidro da tela preto, roughness 0,035, IOR 1,52, emissão 1,0; vidro traseiro (0,012, 0,017, 0,028), roughness 0,30 (0,42 com base mais clara ficou "de plástico"); vidro da ilha roughness 0,06; anel da lente grafite (0,30, 0,31, 0,33), metallic 1, roughness 0,18 (prata virou anel branco); vidro da lente (0,004, 0,005, 0,009), roughness 0,02, IOR 1,5, Thin Film 120 nm / IOR 1,38 (380 nm ficou ciano forte); plástico (0,36, 0,37, 0,39) roughness 0,55; fundo dos furos 0,005, roughness 0,7; flash (0,85, 0,80, 0,62).

**Tela:** UV em metros no bmesh do vidro (`u = x/largura + 0,5`, `v = y/altura + 0,5`); a textura já traz a borda preta de 1,3 mm, o canto da área ativa (raio 9,2 mm) e o furo da câmera frontal; interpolação Cubic; ~16 px/mm (1129 × 2368 para vidro de 70,6 × 148 mm); no vídeo real, sequência PNG do Remotion (`--screen` + `--tela_seq`).

**View transform:** Khronos: UI fiel, fundo azul-noite; Standard: UI certa, fundo acinzentado, metal estoura (Khronos erra menos: 3,8 contra 33); AgX / AgX Punchy: UI desbotada. Exposição em `view_settings.exposure` (+1 = dobro). O Khronos comprime canais acima de ~0,76 linear: Emission ≤ 1,0.

**Render:** `samples 16` (32 para still-herói); adaptativa 0,015, min 8; OIDN com `RGB_ALBEDO_NORMAL`, prefilter `ACCURATE`, qualidade `BALANCED` (HIGH +6 s/quadro, diferença média 0,2/255); bounces 8/2/4/4; sem cáusticas; `sample_clamp_indirect 5`; `blur_glossy 0.5`; `compositor_device = 'CPU'`. Sem material transmissivo (4 bounces bastam); vidro de verdade: ≥ 16.

**Compositor 5.x:** grupo de nós (`bpy.data.node_groups.new('Comp','CompositorNodeTree')`, `scene.compositing_node_group`), socket `Image` de saída, `CompositorNodeRLayers`, `NodeGroupOutput`, Glare (`Type` Bloom, `Quality` High, Threshold 0,85, Strength 0,18, Size 0,55 por `inputs`), Lens Distortion (`Dispersion` 0,006), vinheta `EllipseMask(0.95, 0.80)` → Blur 300 px → MapRange(0,75..1) → `ShaderNodeMix` MULTIPLY. `CompositorNodeMixRGB` não existe no 5.2. Custo ~3 s por quadro (26,7 contra 23,9 s). Com alpha, glare e dispersão preservam o alpha (0 no canto, 255 no celular); vinheta no Remotion.

### Por que o corpo parecia fino (B)

O `logo_e_celular.py` mostrava o celular quase de frente, aro escuro (base 0,015), sem rim; o `produto.py` tem 8,3 mm mas a lateral recebia pouca luz e um único bevel. Correção: pose 3/4 (−28° Z, −6° X; câmera 3,6° acima); aro de metal claro com faixa de rim; quina lateral de 1,2 mm; vidro com borda própria; botões e antenas. A lateral passa a ocupar ~16 px em 1080.

### Guia de modelagem (B)

Medidas: 0,0716 × 0,149 × 0,0082 m (faixa real 7,2–8,9 mm; 7,8–8,5 fica bem em anúncio); raio de canto 0,0105; quina lateral 0,0012. Peças: (1) contorno de retângulo arredondado ponto a ponto (24 segmentos por arco); (2) aro: prisma, z de −D/2+0,3 mm a +D/2−0,3 mm, `bmesh.ops.bevel` nos dois anéis (offset 1,2 mm, 8 seg., `profile=0.5`, `clamp_overlap=True`); (3) vidro frontal: recuo 0,5 mm (raio 10,0 mm), 0,9 mm de espessura, quina superior 0,45 mm (6 seg.), UV planar; (4) vidro traseiro espelhado, fosco; (5) furos: cortador único (USB-C estádio 8,4 × 2,6 mm + 2 × 6 furos de 1,1 mm a cada 2,1 mm), Boolean DIFFERENCE EXACT, placa preta 1,9 mm para dentro; (6) botões lado +X: 22 mm e 12 mm, altura 2,4 mm, saltados 0,5 mm, quinas 0,4 mm, matriz `((0,0,1),(1,0,0),(0,1,0))`; (7) 4 antenas de 0,6 mm a 16 mm do topo e da base, salientes 0,05 mm; (8) ilha 26 × 36 mm, raio 7,5 mm, 1,1 mm de altura, quina 0,5 mm; 2 lentes em coluna: anel grafite Ø 11,2 mm saltado 0,9 mm, vidro Ø 9,2 mm, interno Ø 4,2 mm; flash Ø 4,2 mm; (9) `WEIGHTED_NORMAL` (FACE_AREA, peso 50, `keep_sharp`) como último modificador; shade smooth; (10) ordem: forma → corte → bevel/microbevel → Weighted Normal; paredes > 2× o bevel; sem Subdivision (1.932 faces no aro).
Para não parecer marca: nada de ilha quadrada com 3 lentes em diagonal (iPhone Pro), lentes soltas em coluna sem ilha (Galaxy S), barra horizontal de ponta a ponta (Pixel); sem logo, Dynamic Island ou notch; furo central da câmera frontal genérico.
Microdetalhes por visibilidade: quina do vidro + vinco; botões; anel e vidro das lentes; linhas de antena; furos (close da borda de baixo); rugosidade variável. Riscos e digitais só em close extremo.

### Resultado do teste (B)

`celular_premium.py` (GPL, parametrizado: `--pct --spp --view --look --exp --vista --tela --hdri --fundo --sem_comp --clay --sheen --oidn --brilho_tela`). Tempos (Blender 5.2.2, 4 núcleos, a frio, outro agente renderizando ao mesmo tempo, load 1,3–3,4: ±20%): 270×480 8 amostras 1,8–2,1 s (6,1 s a frio); 540×960 16 amostras 6,2–6,6 s; 540×960 32 amostras (traseira) 8,1 s; **1080×1920 16 amostras OIDN Balanced 18,5 s**; Fast 17,7 s; High 24,4 s; 32 amostras High sem compositor 23,9 s; **32 amostras High + compositor 26,7 s** (processo 27,6 s); antes: `produto.py` 19,6 s, `logo_e_celular.py` 15,4 s. Leituras: 16 contra 32 amostras quase igual (diferença média 0,17/255); Balanced vs High diferença média 0,16–0,21/255 com pixels isolados até 89/255 nos brilhos finos; plano de 3 s ≈ 28 min (Balanced) a 40 min (High + compositor).
Melhorou: fundo (de vinho/cinza chapado para preto-azulado com halo só atrás do produto); corpo (espessura, vidro com borda, traseira fosca com ilha e lentes); tela (UI real, sheen discreto, cores fiéis).
Limitações: só 1 quadro testado (flicker do OIDN não visto); borda esquerda ainda escura (subir Rim E ou alargar halo); o sheen muda com a pose (efeito desejado, conferir nos quadros de pico).

### Checklist premium (B) e recomendação

Checklist: fundo (camada: `film_transparent` + degradê no Remotion; still: cantos ≤ 5/255, halo ≤ 40/255); key grande e alta; sheen controlado (força 8–12); rims em faixa (6 × 110 cm; 10 W escuro / 4 W câmera); HDRI Poly Haven a 0,15–0,2; Khronos + exposição no view transform; materiais da tabela; modelagem conferida em clay; render 16 amostras + OIDN Balanced/Accurate + `compositor_device='CPU'`, compositor só com fundo opaco.
Recomendação (8 itens): `--estilo premium` no `produto.py` ou script irmão; regra de ouro 5 trocar Standard por Khronos; seção "Visual premium"; armadilhas da API (`compositor_device`, `MixRGB`, Glare/Lensdist por `inputs`, `compositing_node_group`, `use_nodes` obsoleto, `bmesh.ops.bevel`); padrão de render 16 amostras + Balanced + ACCURATE (32/High só no still); `logo_e_celular.py` trocar celular e fundo ou marcar "só para teste de logo"; `APRENDIZADOS.md` com tempos e erros (key baixa, thin film 380 nm, vidro fosco 0,42, rim 10 W do lado da câmera); avisar o agente A do sheen e luzes parados no mundo.

---

## **[transcrição]** O que foi feito com isso (teste de integração, 12/10/2026)

Não é achado das pesquisas: é o que o agente de transcrição fez e mediu para montar a skill nova (`nova/`). Imagens e logs em `teste-T/`.

- **`scripts/premium.py`:** junta o `celular_premium.py` (B), as curvas do `curvas_premium.py` (A) e a integração do `produto.py`. Acrescentado: shader da tela (área ativa 68 × 145,4 mm recortada por UV em metros, cantos de 9,2 mm e furo da câmera frontal no shader), `--anim heroi|turntable|parado`, `qa.json`, `--salvar`, `--so`, `--fstop`, `--sombra`/`--so_sombra` com plano na base do celular, clay cinza 18%.
- **Testes:** rascunho 25% de 4 quadros (1,4–1,5 s cada; 9,5 s o 1º); QA do heroi: órbita vmax 2,51× (entra a 0,26×), dolly 2,85×, produto 3,02× (0,63% de overshoot), varredura 10→90% em 24 quadros (25,2°); `--tela_seq` (vermelho, verde, azul nos quadros 1–3; canto alpha 0); `--so_sombra` (alpha até 241, celular invisível); turntable 60 quadros (passo 6,0000° constante); `--vista tras --fundo escuro --comp`; `--clay`; `--salvar` + `verifica_curvas.py` (3 canais, sem avisos); `verifica_curvas.py --selftest` (erro 0,00002–0,00005%; BACK 0,82/3,7/10%).
- **Tempo cheio no `premium.py`** (1080×1920, 16 amostras, Balanced, motion blur, compositor, HDRI): 32,6 s o 1º quadro (a frio) e 23,5–24,7 s nos quadros 20, 50 e 80; ~8 s de preparo antes do 1º quadro.
- **`baixar_hdri.sh`:** baixa `studio_small_09_1k.hdr` da Poly Haven (1.615.248 bytes, igual ao da pesquisa B).
- **Ajuste:** clay de cinza 0,5 saiu estourado em branco; passou a 0,18. `tela_teste.py` saiu 1080×2311 e foi forçado a 1080×2309.
- **Divergências entre as duas pesquisas, resolvidas assim:** A usa a câmera a 0,62→0,46 m e B a 0,56 m fixa; o `premium.py` usa dolly de 0,68→0,56 m (18%), dentro da faixa de 15–30% de A e terminando na distância de B. A sugeriu mola response 2,4 s para 90 quadros; o `premium.py` calcula 0,85 × (quadros − 6) / fps (2,35 s para 90). B pediu o sheen "parado no mundo"; o `premium.py` posiciona o cartão pela reflexão **no quadro de pouso** e o deixa parado.
- **Não feito:** render final de 90 quadros; teste com a UI real do Rotina; flicker do OIDN em sequência longa; `Noise` de micro-deriva ligado no `premium.py` (só documentado).
