---
name: blender-ia
description: "Faz animação 3D premium com o Blender escrita pelo Claude em Python (bpy), sem interface: plano-herói de celular ou produto com cara de comercial (luz de estúdio, reflexo varrendo o vidro, aro com espessura, tela com a UI do app), direção de animação (duração, curva, câmera, suavização de keyframes), turntable, revelação, logo 3D, modelagem de celular genérico detalhado, render com fundo transparente para virar camada no Remotion. Também explica o Blender MCP no computador do usuário. Use quando o pedido falar em Blender, bpy, render 3D realista ou premium, plano-herói, celular ou produto 3D \"de verdade\", animação 3D suave, curvas e keyframes, luz e material 3D, modelar celular, turntable, logo 3D, MCP do Blender, ou quando o 3D do Remotion/three.js não tiver qualidade suficiente."
---

# Animação 3D premium com IA no Blender

O Claude escreve um script `bpy` (a API Python do Blender) e roda `blender -b -P script.py`. O script é a fonte da verdade: entra no Git, roda de novo igual e funciona no container e no computador do Daniel.
A pesquisa e os testes por trás desta skill (11 e 12/10/2026) estão em `APRENDIZADOS.md` e `ORIGEM.md`. O detalhe longo está em `references/`: `direcao-animacao.md`, `visual-premium.md`, `modelagem.md`. Os números de 3D do Remotion estão em `skills/video/remotion-video/SKILL.md`, seção "3D de verdade".

## Quando usar o Blender (e quando não)

| Situação | Ferramenta |
|---|---|
| Celular 3D como fio condutor do vídeo, muitos segundos, UI legível | `@remotion/three` (R3F) na skill `remotion-video`: ~0,7 s por quadro |
| Movimento 2D/2,5D, cartões, textos, legendas | Remotion puro (ou CSS 3D) |
| **1–2 planos-herói** de produto com reflexo e luz realistas (3–5 s cada) | **Blender, Cycles na CPU** (esta skill): ~18–25 s por quadro aqui |
| Montar a cena olhando ao vivo, no computador com placa de vídeo | Blender com MCP (seção "No computador do Daniel") |
| Ambiência fotorrealista sem UI exata | vídeo por IA (Higgsfield, Kling etc.); não reproduz a tela do app |

Regra prática: **o Blender é ~20 vezes mais lento que o R3F neste container.** Só vale onde o realismo aparece (reflexo varrendo o vidro e o metal).

## Regras de ouro

1. **Script `bpy` parametrizado, rodado sem interface:** `blender -b --factory-startup -P cena.py -- <parâmetros>`. Nada de cliques.
2. **Diga a versão.** Esta skill foi testada no **Blender 5.2.2 LTS**. A API mudou no 5.0 e muito código de IA (treinado em 3.x/4.x) quebra (veja "Armadilhas da API 5.x").
3. **Cycles na CPU no container.** O Eevee não roda com `-b` aqui (falta `libEGL`) e, com `xvfb-run`, não sai mais barato.
4. **30 fps** (`scene.render.fps = 30`; o padrão do Blender é 24) e 1080×1920, iguais à composição do Remotion. Defina o fps **antes** de assar molas.
5. **View transform `Khronos PBR Neutral`** quando a tela do app aparece: cor da UI fiel e brilho comprimido sem lavar (erro de cor de marca 3,8 contra 33 do Standard e 27–42 do AgX). `Standard` só se a UI precisar sair idêntica pixel a pixel; o AgX (padrão do Blender) desbota. Brilho geral: `view_settings.exposure`, nunca escalando as lâmpadas.
6. **Fundo transparente** (`film_transparent`) e **PNG RGBA**: o fundo, a vinheta, os textos e a sombra vêm do Remotion.
7. **Celular genérico procedural**, sem logo e sem forma de marca (sem ilha de 3 lentes em diagonal, sem Dynamic Island): as regras da Apple desencorajam render de produto Apple em anúncio.
8. **Escala real em metros** (celular 0,0716 × 0,149 × 0,0082 m). Sem isso, o f-stop do desfoque não corresponde.
9. **Nada de texto no Blender.** Toda tipografia fica no Remotion. Exceção: o logo 3D, que segue as regras do editor.
10. **Fluxo de custo:** rascunho a 25% → `verifica_curvas.py` → folha de quadros → **1 quadro de aprovação** em 1080×1920 → render final em segundo plano.
11. **As regras de composição do editor são obrigatórias** (seção própria, abaixo).
12. **Luzes paradas, produto gira.** O reflexo que varre o vidro é o que vende. Câmera sem overshoot, com pico de velocidade ≤ 3× a média; 2 chaves por movimento (seção "Direção de animação premium").

## No container (sem interface, sem placa de vídeo)

```bash
# 1. instalar (383 MB; ~9 s de download + ~24 s para extrair; confere o SHA-256)
bash skills/video/blender-ia/scripts/instalar_blender.sh "$SCRATCHPAD/blender"   # última linha = caminho do executável
BL=$SCRATCHPAD/blender/blender-5.2.2-linux-x64/blender
HDR=$(bash skills/video/blender-ia/scripts/baixar_hdri.sh "$SCRATCHPAD/hdri")      # studio_small_09 1k, CC0, 1,6 MB

# 2. rascunho do plano-herói premium: 25%, 8 amostras, 4 quadros soltos (~1,5 s por quadro depois do 1º)
$BL -b --factory-startup -P skills/video/blender-ia/scripts/premium.py -- \
  --out /abs/rascunho/h_ --pct 25 --spp 8 --so 1,30,60,90 --mb --hdri $HDR --tela /abs/ui/tela_0001.png --salvar
$BL -b /abs/rascunho/h_cena.blend -P skills/video/blender-ia/scripts/verifica_curvas.py -- --csv /abs/rascunho/curvas.csv

# 3. quadro de aprovação (1080×1920, ~25–33 s) e depois o final (~36 min para 90 quadros) em segundo plano (Bash com run_in_background)
$BL -b --factory-startup -P skills/video/blender-ia/scripts/premium.py -- \
  --out /abs/public/blender/plano1/h_ --pct 100 --spp 16 --frames 1-90 --mb --comp --hdri $HDR \
  --tela /abs/ui/tela_0001.png --tela_seq 90
```

- O Blender **não fica no PATH** e não vai para o repositório: instale no scratchpad.
- O aviso `CUEW initialization failed` é normal (não há placa NVIDIA).
- A primeira execução leva ~10 s a mais (cache frio do Cycles); as seguintes, ~1 s.
- No modo `-b` não há barra de progresso: o `premium.py` imprime o tempo de cada quadro (`render_pre/render_post`).
- `use_persistent_data = True` reaproveita a cena entre quadros (o 1º quadro custa ~20 s a mais).
- Render longo: rode em segundo plano e confira o log; nunca bloqueie a conversa.

## No computador do Daniel (com placa de vídeo e MCP)

O MCP liga o Claude a um Blender **aberto, com interface**. Serve para montar a cena olhando ao vivo. **Não roda com `blender -b`** (o código do MCP recusa).

| MCP | Licença | Observação |
|---|---|---|
| **MCP for Blender** (`ahujasid/mcp-for-blender`, antigo blender-mcp) | MIT | ~30 mil estrelas, v2.1.9 (out/2026). Roda Python livre, "olha" a viewport, busca assets (Poly Haven, Sketchfab, Poly Pizza) e gera 3D por IA (Tripo, Hunyuan3D, Rodin). **Telemetria ligada por padrão.** |
| **blenderwright** (`HoldMyBeer-gg/blenderwright`) | MIT | 191 ferramentas, **zero telemetria**, Python livre desligado até você ligar. |
| **Blender Lab MCP** (oficial do Blender, conector do Claude desde 28/04/2026) | GPL-3.0 | Blender 5.1+. Bom para analisar e depurar um `.blend`; não gera 3D. A página pede rodar numa VM. |

Instalação (só depois da aprovação do Daniel, pela receita de instalação do `guia/LEIA-ANTES-DE-USAR.md`):

```bash
claude mcp add blender -e DISABLE_TELEMETRY=true -e BLENDER_MCP_SAFE_MODE=1 -- uvx mcp-for-blender
uvx mcp-for-blender install-addon   # Blender > Preferences > Add-ons > ativar "MCP for Blender"
# no Blender: painel N > "MCP for Blender" > Start MCP Server (porta 9876)
```

- **Segurança:** o socket da porta 9876 não tem senha e o Claude roda qualquer Python. Use `BLENDER_MCP_SAFE_MODE=1` (bloqueia arquivos, rede e subprocessos). Não use o instalador `curl … | sh`. Os MCPs usam a mesma porta: um de cada vez.
- **Como usar bem** (relatos de quem testou): dê assets prontos em vez de pedir modelagem do zero; peça mudanças pontuais; salve o `.blend` a cada etapa e abra conversa nova (contexto longo degrada: um teste gastou 2 h num donut com erros).
- **Fluxo híbrido:** monte e aprove a cena no MCP, salve o `.blend` e renderize em lote: `blender -b cena.blend -P render.py`.
- No container, o MCP até roda com `xvfb-run -a blender` (testado: o Blender com interface sobe em ~19 s a frio), mas não traz vantagem sobre o script.

## Scripts prontos (`scripts/`, testados no 5.2.2)

| Arquivo | O que faz |
|---|---|
| **`premium.py`** | **Receita principal (plano-herói).** Celular genérico detalhado (8,2 mm, aro, botões, antenas, USB-C, ilha de câmera), materiais físicos, estúdio de anúncio com sheen, Khronos, câmera 85 mm em órbita com pivô, animação `--anim heroi\|turntable\|parado`, UI na tela (imagem ou sequência do Remotion, `--tela_seq`), PNG RGBA, sombra em camada (`--sombra`, `--so_sombra`), motion blur (`--mb`), desfoque (`--fstop`), HDRI, compositor (`--comp`), passe clay (`--clay`), vista de trás, `<prefixo>caixas.json` (caixa 2D do celular por quadro) e `<prefixo>qa.json` (vmax, overshoot, paradas, varredura). `--salvar` grava o `.blend`. |
| `verifica_curvas.py` | **QA das curvas** antes do render: por canal, vmax/média, velocidade de entrada, overshoot, paradas no meio, CSV quadro a quadro, avisos. `--selftest` confere que os handles reproduzem o cubic-bezier do Remotion (erro ~0,00005%). |
| `produto.py` | Versão **leve** (celular simples, 1 corpo, luz de estúdio básica, mesma integração com o Remotion). Boa para rascunho rápido ou quando a cena é só um objeto girando. Para o plano-herói, prefira o `premium.py`. |
| `logo_e_celular.py` | **Só para teste de logo**: celular simples, logo 3D que **entra pela borda de baixo** com overshoot, fundo com brilho opaco. Para camada transparente, use o `premium.py`. |
| `tela_teste.py` | Gera uma UI genérica (sem texto) na proporção da área ativa (1080×2309), para testes. Precisa do Pillow. |
| `baixar_hdri.sh` | Baixa um HDRI de estúdio da Poly Haven (CC0). |
| `folha.sh` | Folha de quadros sobre cor sólida (1 a cada 6), para revisar as regras do editor e o alpha. |
| `png_para_video.sh` | PNG RGBA → ProRes 4444 (`.mov`) e WebM VP9 com alpha (`.webm`). |
| `instalar_blender.sh` | Baixa o 5.2.2 oficial, confere o SHA-256 e extrai. |
| `../assets/CamadaBlender.tsx` | Componente do Remotion que mostra a sequência PNG como camada, mais `caixaNoQuadro()`. |

Os scripts `.py` são GPL-3.0-or-later (scripts publicados que usam a API do Blender precisam de licença compatível com a GPL). O texto está em `scripts/LICENSE`.

## Direção de animação premium

O que deixa o movimento premium é a **direção**, não a curva. Detalhe, medidas e fontes: `references/direcao-animacao.md`.

**Planos (30 fps):**

| Plano | Duração | Quanto mover | Curva |
|---|---|---|---|
| **Revelação-herói** | 3–5 s (90–150 q) | rotação relativa produto–câmera de 25–40°; a varredura do reflexo (10→90%) dura **≥ 20–30 quadros** | mola ζ 0,85, response 2–2,5 s, defasada 6 quadros |
| **Push-in lento** (dolly, nunca zoom) | 3–5 s | 15–30% da distância | `(0.65,0,0.35,1)` se parte parado; `(0.3,0.15,0.2,1)` se entra no corte já andando |
| **Órbita** | 3–6 s | 20–40° (7–13°/s), câmera filha de um pivô | `(0.3,0.15,0.2,1)` |
| **Turntable / loop** | 6–8 s por volta | 45–60°/s | LINEAR + `CYCLES` com `REPEAT_OFFSET` |
| **Entrada e pouso** (logo, objeto) | 0,5–0,8 s | da borda do quadro (regra 4 do editor) | expo-out `(0.16,1,0.3,1)` ou mola ζ 0,8 |
| **Detalhe macro** | 1,5–2,5 s | 2–5% do quadro por segundo | quase linear `(0.33,0,0.67,1)` |
| **Pausa** antes do corte ou do texto | ≥ 8–10 quadros | deriva residual, nunca congelado | — |

**Curva pelo espaçamento (`vmax` = pico de velocidade ÷ média, medido num plano de 90 quadros):** expo-out 6,1× (só chegadas curtas ≤ 25 q); ease-out forte 4,3×; **drift `(0.3,0.15,0.2,1)` 2,5×** (câmera entrando no corte em movimento); Easy Ease do AE 1,5× (câmera de detalhe); **dolly `(0.65,0,0.35,1)` 2,9×** (push-in que começa e termina parado); in-out forte 4,9× (só UI). **Câmera de plano-herói: vmax ≤ 3×.** 4–6× parece UI ou trailer de ação.

**Overshoot (medido):**

| Onde | Passa do ponto | Como |
|---|---|---|
| **Câmera** | **0%** | Auto Clamped ou curvas com y entre 0 e 1 |
| Rotação do produto | 1–2% | mola ζ 0,8 (1,5%), `back = 0.5` (0,8%) ou handle `(0.2,1.2,0.3,1)` (1,25%) |
| Logo e objeto pequeno pousando | 2–4% | ζ 0,7 (4,6%) ou `back = 1.0` (3,7%) |
| Opacidade e cor | nunca | — |
| **Cuidado** | o `BACK` padrão (1,70158) passa **10%** e o `easeOutBack` do CSS 9,8%: é desenho animado | a interpolação vale para o trecho **depois** da chave: o overshoot de chegada vai na chave de **partida** |

**Como suavizar cada keyframe:**
1. **1 movimento = 2 chaves por canal**, com a forma toda nos handles. Mais chaves só se o caminho precisa **passar** por um ponto.
2. **Passar por um ponto (3+ chaves):** `AUTO_CLAMPED` + `fc.auto_smoothing = 'CONT_ACCEL'` (salto de aceleração 6,4× menor). **Nunca** um ease por trecho: a câmera para na chave do meio.
3. **Defase os canais em 4–8 quadros** (a câmera começa, o produto responde 6 depois). Chaves de todos os canais no mesmo quadro denunciam o computador.
4. **Entrada no corte:** comece já em movimento (drift, velocidade inicial ≈ 0,5× a média). Ease-in do zero no 1º quadro parece câmera "ligando". **Saída:** corte com 5–15% do movimento ainda acontecendo; ou chegue parado e segure ≥ 8–10 quadros com deriva.
5. **Micro-deriva no hold:** modificador `NOISE` na rotação da câmera (scale 40, strength 0,3°, depth 0). Nunca na posição do produto.
6. **Arcos, não retas:** órbita = câmera filha de um empty-pivô girando em Z.
7. **Motion blur** `motion_blur_shutter = 0.5` (180°) no final (~+3–4% de CPU). O blur ignora luz em movimento: luzes paradas.
8. **Câmera:** 85 mm (100 mm no detalhe), `TRACK_TO` num empty de foco que também é o `dof.focus_object`; lente constante.
9. **Conferência:** `verifica_curvas.py` (vmax, paradas, overshoot) e a varredura 10→90% no `qa.json` do `premium.py`.

**Helpers** (os mesmos do `premium.py`; escrevem as chaves direto, funcionam também em `cam.data`; `assa_mola` está em `references/direcao-animacao.md`):

```python
def fcurve_de(idb, path, idx=0):
    ad = idb.animation_data_create()
    if ad.action is None: ad.action = bpy.data.actions.new(idb.name + 'Acao')   # atribuída ANTES
    act = ad.action
    if hasattr(act, 'fcurve_ensure_for_datablock'):                              # 4.4+ / 5.x: cria camada, faixa, slot
        return act.fcurve_ensure_for_datablock(idb, path, index=idx)
    return act.fcurves.find(path, index=idx) or act.fcurves.new(path, index=idx)

def curva(idb, path, idx, pts, bez=(0.16, 1, 0.3, 1)):      # pts = [(quadro, valor), ...]; bez = cubic-bezier do Remotion
    fc = fcurve_de(idb, path, idx); kps = fc.keyframe_points; kps.clear(); kps.add(len(pts))
    for kp, (f, v) in zip(kps, pts):
        kp.co = (f, v); kp.interpolation = 'BEZIER'
        kp.handle_left_type = kp.handle_right_type = 'FREE'  # tipo ANTES da posição
        kp.handle_left, kp.handle_right = (f - 1, v), (f + 1, v)
    for i, (p, q) in enumerate(zip(kps[:-1], kps[1:])):
        x1, y1, x2, y2 = bez[i] if isinstance(bez[0], (tuple, list)) else bez
        dt, dv = q.co.x - p.co.x, q.co.y - p.co.y
        p.handle_right = (p.co.x + x1 * dt, p.co.y + y1 * dv); q.handle_left = (p.co.x + x2 * dt, p.co.y + y2 * dv)
    fc.update(); return fc                                   # update() preserva os FREE
```

Plano-herói: `curva(pivo, 'rotation_euler', 2, [(1, R(-20)), (90, 0)], (0.3,0.15,0.2,1))`, `curva(cam, 'location', 1, [(1, -0.68), (90, -0.56)], (0.65,0,0.35,1))`, `assa_mola(prod, 'rotation_euler', 2, 7, 90, rz - R(45), rz, zeta=0.85, resposta=2.35)`. Turntable: 2 chaves LINEAR + `CYCLES` com **`REPEAT_OFFSET`** (o `REPEAT` padrão volta 358° por ciclo e o motion blur borra).

## Visual premium

Detalhe, tabelas completas e fontes: `references/visual-premium.md`. Tudo isto já está no `premium.py`.

**Luz de estúdio** (escala real; celular em pé na origem, câmera em −Y a 0,56 m, produto girado −28° em Z e −6° em X):

| Luz | Tamanho | Potência | Posição (m) |
|---|---|---|---|
| **Key** (softbox grande e **ALTA**) | 0,9 × 0,6 | 26 W, ~5200 K | (−0,50, −0,35, **0,65**) |
| Fill | 1,0 × 1,0 | 2,5 W, levemente fria | (0,65, −0,35, 0) |
| **Rim E / Rim D** (faixas finas atrás: linhas de brilho nas quinas) | 0,06 × 1,1 | 10 W (lado escuro) / 4 W (lado da câmera) | (∓0,32, 0,30, 0,05) |
| Topo | 0,8 × 0,25 | 5 W | (0, 0,05, 0,55) |
| **Cartão de sheen** (plano emissivo só para reflexo, posicionado por reflexão do raio da câmera) | 0,22 × 0,60 | força 12 (8–12) | calculado |
| HDRI de estúdio Poly Haven (CC0), só para reflexos | — | força 0,18 | — |

Todas as luzes são `AREA` retangulares apontadas para o produto. **Key baixa lava a tela** (a 0,40 m o reflexo dela cobria metade da UI); rim de 10 W do lado da câmera estoura a lateral. O sheen: força 3 não aparece, 60 lava, **12** dá um degradê sutil.

**Materiais** (Principled; `Metallic` é 0 ou 1): aro de alumínio anodizado (0,80, 0,81, 0,83), metallic 1, roughness 0,16–0,26 por Noise (riscos ao longo do comprimento); **vidro da tela** preto, roughness **0,035**, IOR 1,52, emissão 1,0 com a UI; vidro traseiro fosco roughness **0,30** (0,42 vira "plástico"); anel da lente grafite (prata vira disco branco); vidro da lente com Thin Film **120 nm** (380 nm fica ciano). Sem Transmission: opaco e barato.

**Tela com a UI do app:** imagem (ou sequência do Remotion) de **1080 × 2309 px**, a área ativa de 68 × 145,4 mm, sem borda nem canto. O shader do `premium.py` faz a borda preta de 1,3 mm, os cantos de 9,2 mm e o furo da câmera frontal. Com `--tela_seq N`, o Blender troca a imagem a cada quadro (testado: vermelho, verde e azul nos quadros 1–3, sem espelhar).

**Fundo:** com alpha, o degradê e a vinheta ficam no Remotion (CSS). Para um still: `--fundo escuro` (cantos ≤ 5/255, halo atrás do produto ≤ 40/255). Nunca um plano iluminado que encha o quadro.

**Render CPU:** 16 amostras + OIDN `BALANCED` + prefilter `ACCURATE` (HIGH custa +6 s por quadro para 0,2/255 de diferença); 32 amostras só no still de aprovação; `adaptive_threshold 0.015`; `glossy_bounces 4`, `transmission_bounces 4`; `sample_clamp_indirect 5`; `blur_glossy 0.5`; `scene.render.compositor_device = 'CPU'`.

**Compositor (5.x, `--comp`):** Glare Bloom (threshold 0,85, strength 0,18, size 0,55) + Lens Distortion com `Dispersion` 0,006 (aberração cromática sutil); preservam o alpha. A vinheta (`ShaderNodeMix MULTIPLY`) só com fundo do Blender.

**Checklist "cara de comercial":**
- [ ] Fundo contido (transparente + CSS, ou cantos ≤ 5/255) e halo ≤ 40/255.
- [ ] Key grande e alta; o reflexo dela não cai na tela.
- [ ] Sheen diagonal discreto na tela; rims em faixa dos dois lados; HDRI fraco só para reflexo.
- [ ] Khronos PBR Neutral; exposição no view transform.
- [ ] Materiais da tabela (tela roughness 0,035; vidro traseiro 0,30; metal 0 ou 1).
- [ ] Pose 3/4: a espessura aparece (aro claro, linha de rim, botões, antenas).
- [ ] Passe clay conferido (luz e forma antes do material).
- [ ] Movimento: vmax da câmera ≤ 3×, 0% de overshoot na câmera, nenhuma parada no meio, varredura do reflexo ≥ 20 quadros, canais defasados.
- [ ] Motion blur 0,5 ligado no final; luzes paradas.
- [ ] UI na proporção certa (1080×2309), cores fiéis, nada de texto no Blender.

## Modelagem

Detalhe, medidas e fontes: `references/modelagem.md`. Implementado no `premium.py`; nenhuma forma de marca real.

- **Celular genérico:** 71,6 × 149 × **8,2 mm** (a faixa real de 2024–26 é 7,2–8,9 mm), raio de canto 10,5 mm.
- **Contorno** gerado ponto a ponto (retângulo arredondado com 4 arcos de 90°), não pelo Bevel modifier; aro = prisma desse contorno com `bmesh.ops.bevel` de **1,2 mm**, 8 segmentos, `profile=0.5`. **Passe sempre `segments` e `profile`** (o padrão é 0/0).
- **Vidros frontal e traseiro** encaixados no aro (0,3 mm abaixo da face, recuo de 0,5 mm), com quina de 0,45 mm: criam o vinco brilhante entre vidro e metal.
- **Detalhes:** USB-C em estádio (8,4 × 2,6 mm) + 2 × 6 furos de alto-falante com Boolean `EXACT`; botões de volume e liga (saltados 0,5 mm); 4 faixas de antena; **ilha de câmera genérica** (26 × 36 mm, 2 lentes em coluna com anel grafite, flash); furo central da câmera frontal.
- **Hard surface:** forma → corte (Boolean) → bevel → **Weighted Normal por último** (FACE_AREA, peso 50, `keep_sharp`); shade smooth em tudo; paredes maiores que 2× o bevel; sem Subdivision (1.932 faces no aro).
- **Detalhamento por prioridade:** quina do vidro e vinco > botões > lentes > antenas > furos (só em close da borda de baixo) > rugosidade variável do metal.
- **Conferir:** `--clay` mostra só luz e forma.
- **O celular-herói é sempre procedural.** IA serve para objetos de cena (veja "Assets 3D").

## Receitas `bpy` (trechos do `premium.py` e do `produto.py`)

**Render transparente para o Remotion:**
```python
r = sc.render; r.engine = 'CYCLES'; sc.cycles.device = 'CPU'
sc.cycles.samples = 16; sc.cycles.adaptive_threshold = 0.015
sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'
sc.cycles.denoising_prefilter = 'ACCURATE'; sc.cycles.denoising_quality = 'BALANCED'
r.use_persistent_data = True; r.fps = 30; r.resolution_x, r.resolution_y = 1080, 1920
r.film_transparent = True
im = r.image_settings
im.media_type = 'IMAGE'                    # 5.x: antes de file_format
im.file_format = 'PNG'; im.color_mode = 'RGBA'; im.color_depth = '8'
sc.view_settings.view_transform = 'Khronos PBR Neutral'; sc.view_settings.look = 'None'
r.use_motion_blur = True; r.motion_blur_shutter = 0.5
r.filepath = '/abs/public/blender/plano1/h_'   # vira h_0001.png ...
```

**Tela com a UI do app** (`produto.py` usa as coordenadas `Generated`; o `premium.py` usa UV em metros e a máscara de borda):
```python
tx.image = bpy.data.images.load('/abs/ui/tela_0001.png')
tx.image.source = 'SEQUENCE'                                       # UI quadro a quadro
tx.image_user.frame_duration, tx.image_user.frame_start = 90, 1
tx.image_user.use_auto_refresh = True
```

**Sombra em camada própria** (fica abaixo dos textos): um plano com `is_shadow_catcher = True` (só no Cycles) e um 2º render com o celular invisível para a câmera (`visible_camera = False`), mas ainda projetando sombra. Flags `--sombra` e `--so_sombra`.

**Caixa 2D do celular por quadro** (`world_to_camera_view` nos cantos do `bound_box` de todas as peças): sai em `<prefixo>caixas.json`, em pixels de 1080×1920 (não muda com `--pct`). Serve para ancorar no Remotion o texto que sai de trás do celular.

## Armadilhas da API 5.x

- `action.fcurves` não existe mais: para **escrever**, `fcurve_de()` (`Action.fcurve_ensure_for_datablock`); para **ler**, `anim_utils.action_get_channelbag_for_slot(...)` ou layers → strips → channelbags (veja `verifica_curvas.py`).
- Escrevendo chaves direto: `handle_*_type = 'FREE'` **antes** dos handles e `fc.update()` no fim.
- Lente, DOF e foco ficam em `cam.data` (outro ID, com action e slot próprios), não em `cam`.
- `BLENDER_EEVEE_NEXT` voltou a ser `BLENDER_EEVEE`; o Cycles é `CYCLES` (não aparece no enum, mas funciona).
- `scene.node_tree` (compositor) virou `scene.compositing_node_group`; com compositor ligado no `-b`, **`scene.render.compositor_device = 'CPU'`** (senão tenta GPU e falha por `libEGL`). O Glare e o Lens Distortion se configuram por `inputs[...]` (sockets).
- `CompositorNodeMixRGB` **não existe** no 5.2: use `ShaderNodeMix` (`data_type='RGBA'`, `blend_type='MULTIPLY'`).
- `image_settings.media_type = 'IMAGE'` antes de `file_format`.
- `Material.use_nodes` gera aviso de obsoleto (será removido no 6.0); o material novo já vem com Principled.
- `bmesh.ops.bevel`: passe `segments` e `profile` (o padrão é 0 e 0).
- Modificador de f-curve `CYCLES`: `REPEAT_OFFSET`, e tem de ser o 1º da pilha.
- A f-curve é float32: derivada numérica com passo ≥ 0,5 quadro.

## Assets 3D e geração por IA (licenças para anúncio)

O **celular-herói é sempre procedural** (malha de IA sai densa, triangulada, às vezes com furos). IA serve para **objetos de cena** (moedas, halteres, ícones 3D): gere o GLB, importe, limpe (decimate, apagar faces soltas) e aplique materiais próprios.

| Fonte | Anúncio? | Condição |
|---|---|---|
| Blender (o que ele gera) | Sim | "What you create with Blender is your sole property" |
| Poly Haven (HDRI, texturas, modelos) | Sim | CC0, sem crédito |
| Sketchfab | Depende | CC0, CC BY (com crédito) e Standard sim; **CC BY-NC e Editorial, não** |
| Poly Pizza | Em parte | ~69% CC BY, com crédito; bloqueia IPs de nuvem |
| TRELLIS.2 (imagem → 3D) | Sim | MIT; precisa de GPU NVIDIA ≥ 24 GB |
| Hunyuan3D 2.1 | Sim no Brasil | não vale em UE/Reino Unido/Coreia; > 1 mi usuários/mês pede licença |
| Meshy | Sim | grátis = CC BY 4.0 com crédito; Pro+ sem crédito |
| Tripo / Rodin | Só plano pago | termos do plano grátis contraditórios ou vagos |
| Stable Fast 3D / SPAR3D | Sim | receita anual < US$ 1 mi |
| SAM 3D Objects | Sim, com restrições | licença SAM |
| Skybox AI (HDRI por IA) | Só pago | e não é HDR de 32 bits: prefira Poly Haven |
| `generate_3d` do Higgsfield (MCP deste ambiente) | A conferir | não testado; leia os termos antes |
| Aparência de iPhone/Apple | **Evitar** | sem logo, sem layout de câmera reconhecível |

Não é parecer jurídico: confira a licença de cada modelo no dia do uso e registre no `APRENDIZADOS.md` do projeto.

## Integração com o Remotion

1. **Áudio e duração primeiro:** defina no Remotion quantos quadros o plano tem e passe `--frames 1-N` ao Blender (30 fps nos dois).
2. **Renderize** em `public/blender/<plano>/` (fora do Git: são centenas de MB; o `public/` é copiado em cada bundle).
3. **Componha** com `assets/CamadaBlender.tsx`: o quadro 0 da `<Sequence>` mostra o `0001.png` do Blender.
4. **Alternativa de arquivo único:** `scripts/png_para_video.sh` gera ProRes 4444 e WebM VP9 com alpha; no Remotion, `<OffthreadVideo transparent>` ou `<Video>` de `@remotion/media`. A sequência PNG é preferida (quadro exato).
5. **Ordem das camadas:** fundo (degradê em CSS) → sombra do Blender → textos e cartões → celular do Blender.
6. **UI na tela:** renderize a UI do app no Remotion em 1080×2309 e passe como `--tela` + `--tela_seq`.
7. **Mudou só o 2D?** Não renderize o 3D de novo. Mudou o movimento? Renderize só os quadros afetados (`--frames a-b`).

## Regras de composição do editor no 3D (obrigatórias)

As 4 regras do Daniel (`skills/video/remotion-video/SKILL.md`, "Regras de composição do editor") valem aqui assim:

1. **Nada de texto sobre texto, nem logo sobre texto:** texto só no Remotion. O logo 3D pousa numa área livre do quadro.
2. **Nenhum recorte no meio da tela:** renderize sempre o quadro inteiro com alpha e nunca recorte o PNG. O motion blur e o desfoque fazem bordas semitransparentes, e o alpha as preserva. Confira no `caixas.json` que o celular só sai do quadro pela borda do vídeo. (O recorte da tela pelo shader do `premium.py` é borda real da cena.)
3. **O celular fica por cima do texto:** garantido pela ordem das camadas. A sombra separada não escurece o texto.
4. **Todo texto (e o logo) entra de fora do quadro ou de trás do celular:** nada de logo crescendo do zero no meio da tela. O `logo_e_celular.py` faz o logo subir da borda de baixo. Para texto saindo de trás, use a caixa do `caixas.json` no quadro de entrada com o componente `Atras` da `remotion-video`, com a camada do texto abaixo da do celular.

Atenção à zona segura do Reels: a faixa de baixo do 1080×1920 fica coberta pela interface do Instagram; ajuste a altura do logo.

## Tempos medidos (4 CPUs, sem GPU, Blender 5.2.2, 11–12/10/2026)

| O quê | Tempo |
|---|---|
| Instalar (383 MB) | ~9 s de download + ~24 s para extrair |
| Partida a frio / a quente | ~10–12 s / ~1 s |
| Rascunho 25% (270×480), 4 amostras | 0,7–0,9 s por quadro |
| Rascunho 25%, 8 amostras (`premium.py`, motion blur) | 1,4–1,5 s por quadro (9,5 s o 1º, cache frio) |
| **Final 1080×1920, 16 amostras + OIDN Balanced** | **~18,5 s por quadro** (sem compositor nem motion blur) |
| **`premium.py` 1080×1920, 16 amostras + Balanced + motion blur + compositor** | **23,5–24,7 s por quadro** (quadros 20, 50 e 80; o 1º, a frio, 32,6 s); ~8 s de preparo antes do 1º quadro |
| OIDN High / Fast (16 amostras) | 24,4 s / 17,7 s |
| 16 amostras + OIDN ≈ 32 ≈ 64 amostras | visualmente quase iguais (diferença média 0,17/255) |
| Motion blur + desfoque | ~+3–4% |
| Plano-herói de 3 s (90 quadros) | **~36 min** com tudo ligado (24 s × 90); ~28 min sem compositor nem motion blur; ~40 min com OIDN High; em segundo plano |
| QA das curvas (`verifica_curvas.py`) | < 2 s |
| Eevee | `-b`: aborta (falta `libEGL`); `xvfb-run`: ~85 s de CPU por quadro a 16 amostras (não compensa) |
| Comparação: R3F no Remotion | ~0,7 s por quadro |

No computador com placa de vídeo, espere segundos por quadro (não medido).

## Checklist antes do render final

- [ ] Duração em quadros vinda do Remotion; 30 fps; 1080×1920.
- [ ] Rascunho a 25%; `verifica_curvas.py` sem avisos (vmax da câmera ≤ 3×, 0% de overshoot, sem paradas no meio); varredura do reflexo ≥ 20 quadros no `qa.json`.
- [ ] `scripts/folha.sh` (1 a cada 6 quadros, sobre cor sólida).
- [ ] Nas folhas: texto sobre texto, linha de corte no meio, texto na frente do celular, texto/logo surgindo do nada.
- [ ] Checklist "cara de comercial" (seção Visual premium).
- [ ] Cores da UI conferidas (Khronos); UI em 1080×2309; sombra na camada certa; `caixas.json` coerente.
- [ ] 1 quadro de aprovação em resolução cheia, mostrado ao Daniel.
- [ ] Tempo estimado = quadros × s/quadro; render em segundo plano; quadros fora do Git.
- [ ] Licença de cada asset externo anotada (HDRI Poly Haven = CC0).
- [ ] Aprendizados novos no `APRENDIZADOS.md` desta skill.
