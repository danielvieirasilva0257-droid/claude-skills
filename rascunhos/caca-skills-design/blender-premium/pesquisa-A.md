# Pesquisa A: Blender premium, direção de animação e fluidez

**Data:** 11/10/2026. **Agente:** pesquisa A (fatia: direção de animação, curvas, câmera).
**Blender testado:** 5.2.2 LTS, container com 4 CPUs e sem GPU.
**Pasta do teste:** `scratchpad/hunter/blender-premium/teste-A/`.

Legenda: **MEDIDO** = rodei aqui; **FONTE** = está na fonte citada; **INFERÊNCIA** = conclusão minha, a validar com o olho do Daniel.

---

## 1. Resumo

1. **Curva do Remotion dentro do Blender:** os handles Bezier calculados a partir de um `cubic-bezier(x1,y1,x2,y2)` reproduzem a curva-alvo com erro máximo de **0,00005%** do curso. É a precisão do float32, nos quadros inteiros e em subquadros (MEDIDO, 7 canais). O 2D do Remotion e o 3D do Blender podem ter a mesma "assinatura" de movimento.
2. **O que deixa o movimento "premium" é a direção, não a curva.** Na versão 1 do teste, empilhei expo-out na órbita e uma mola rápida no produto. O reflexo cruzou o vidro em **8 quadros** (0,27 s) e ficou rápido demais. Na versão 2, usei curvas mais longas e defasei os canais em 6 quadros: a mesma varredura levou **22 quadros**, e a folha ficou legível (MEDIDO).
3. **Overshoot premium é pequeno:**
   - mola com ζ 0,8 passa **1,5%** do ponto;
   - BACK com `back = 0.5` passa **0,8%**;
   - o BACK padrão (1,70158) passa **10%**, o que é desenho animado;
   - o handle `(0.2, 1.2, 0.3, 1)` passa **1,25%**.

   Todos esses valores foram MEDIDOS.
4. **Caminho com 3 ou mais chaves:** com um ease por trecho, a câmera **para** na chave do meio (velocidade 0). Com `AUTO_CLAMPED` + `auto_smoothing = 'CONT_ACCEL'`, ela passa direto e o salto de aceleração cai **6,4×** (MEDIDO).
5. **Armadilhas novas no 5.x:**
   - o modificador `CYCLES` no modo padrão volta 358° por ciclo, e o motion blur borra esse quadro. Use `REPEAT_OFFSET` (MEDIDO);
   - a lente fica no dado da câmera, que tem uma action e um slot próprios (MEDIDO);
   - `Action.fcurve_ensure_for_datablock` cria camada, faixa, slot e channelbag de uma vez (MEDIDO).
6. **Custo:** prévia a 25% com Cycles a 4 amostras + OIDN custou **0,68–0,74 s por quadro**. São 30 quadros em ~26 s de processo, e o motion blur com obturador de 0,5 acrescentou ~3% (MEDIDO).

---

## 2. Fontes

### 2.1 Catálogo de skills (`npx skills@1.7.2 find`, 6 buscas)

| Skill / repo | Licença | Nota |
|---|---|---|
| `roble3/cc-blender-skill` (`blender-animation`, `animation-quality-gate`, `knowledge/09-animation`, `08-cameras-composition`), ~900 instalações | MIT (2026) | Genérica. Tem helper de compatibilidade 4.x/5.x que percorre `layers → strips → channelbags`. **A receita 4 tem um bug:** põe `BOUNCE` na **última** chave, onde não tem efeito, porque a interpolação vale para o trecho depois da chave. O `quality-gate` também exige folha de contato antes de aceitar uma animação, como a nossa skill. A tabela de lentes (50 mm neutra, 85 mm íntima, 100–135 mm herói de produto com DOF raso) é útil como referência. |
| `dylantarre/animation-principles` (`3d-spatial`, `10-by-time-scale/dramatic-2000ms-plus`) | MIT (2024) | Os 12 princípios aplicados ao 3D, em nível genérico. Números aproveitáveis: no "dramático" (≥ 2 s), antecipação de 400–600 ms e "câmera recua antes do push-in". Curvas sugeridas: `(0.22,0.61,0.36,1)` e `(0.25,1,0.5,1)`. |
| `affaan-m/ecc@blender-motion-state-inspection`, 6 mil instalações | MIT (2026) | Feita para personagens e rigs, fora do nosso escopo. Ideia aproveitada: "extraia os fatos do Blender quadro a quadro antes de julgar pelo print". Foi o que fiz com o CSV. |
| `kevinbadi/blender-skills` (`slow-zoom`, `crane-shot`, `dolly-rotate`, `perfect-loop`, `product-polish`) | **Sem licença**: todos os direitos reservados | Lido só como dado. O `slow-zoom` faz push-in de 5 s com a lente indo de 35 para 65 mm e a distância de 4,0 para 1,8, mas usa 24 fps por padrão e o Bezier padrão do Blender. **Não copiar nada.** |
| `emilkowalski/skills@apple-design` (já resumida em `motion-oficial/references/molas-e-curvas.md`) | MIT | Mola Apple: mover com ζ 1,0 e response 0,4; girar com ζ 0,8 e response 0,4. Usei ζ 0,8–0,85 na rotação do produto. |
| Outras: `hyperframes-*`, `gsap-timeline`, `threejs-animation` (web); `ue-sequencer-cinematics` (Unreal) | várias | Fora da fatia (não são Blender nem produto). |

### 2.2 Web

| Fonte | Licença | Nota |
|---|---|---|
| [Blender Manual 5.2: F-Curves, Introduction](https://docs.blender.org/manual/en/latest/editors/graph_editor/fcurves/introduction.html) | CC-BY-SA 4.0 (só paráfrase) | A f-curve nunca volta no tempo; se você arrastar uma chave para trás da outra, a ordem se inverte. |
| [Blender Manual 5.2: F-Curve Properties](https://docs.blender.org/manual/en/latest/editors/graph_editor/fcurves/properties.html) | CC-BY-SA 4.0 | Handles:<br>• Automatic: suave, pode passar do ponto;<br>• Auto Clamped: sem overshoot e sem "S" entre chaves;<br>• Vector: reta;<br>• Aligned: manual, mas os dois lados ficam colineares;<br>• Free: manual e independente.<br>Handle Smoothing "Continuous Acceleration": resolve um sistema para minimizar saltos de aceleração. A propagação para em chaves Free, Aligned ou Vector e nos extremos Auto Clamped. O manual recomenda Auto Clamped por padrão. Easings Penner: Back (tamanho do overshoot), Elastic (amplitude e período), Bounce. |
| [Blender Manual 5.2: F-Curve Modifiers](https://docs.blender.org/manual/en/latest/editors/graph_editor/fcurves/modifiers.html) | CC-BY-SA 4.0 | **Noise:** Scale (horizontal, maior = mais lento), Strength (vertical), Phase (semente), Offset, Depth, Lacunarity, Roughness. No modo Replace, o ruído fica em [−0,5; 0,5].<br>**Cycles:** modos Repeat, Repeat with Offset e Repeat Mirrored, mais Count. **Precisa ser o primeiro da pilha** e é incompatível com o Smooth (Gaussian).<br>Todos os modificadores aceitam Influence e Restrict Frame Range com Blend In/Out. |
| [Blender Manual 5.2: Graph Editor, Editing](https://docs.blender.org/manual/en/latest/editors/graph_editor/fcurves/editing.html) | CC-BY-SA 4.0 | Ferramentas de limpeza:<br>• Decimate (por razão ou por erro máximo);<br>• Bake Keyframes;<br>• Smooth (Gaussian, com Factor, Sigma e Filter Width);<br>• Butterworth (bom para dados densos, como mocap ou molas assadas; preserva picos, mas pode ondular);<br>• Blend to Ease. |
| [Blender Manual 5.2: Cycles, Motion Blur](https://docs.blender.org/manual/en/latest/render/cycles/render_settings/motion_blur.html) | CC-BY-SA 4.0 | O Shutter é medido **em quadros**: 1,0 borra o quadro inteiro, então **0,5 = 180°**. Position: Start, Center ou End on Frame. Shutter Curve. **Limitações:** o movimento das luzes não entra no blur, e a câmera ortográfica não borra. |
| [Blender API 5.x: anim_utils](https://docs.blender.org/api/5.2/bpy_extras.anim_utils.html), [Action 5.0](https://docs.blender.org/api/5.0/bpy.types.Action.html), [ActionKeyframeStrip](https://docs.blender.org/api/5.0/bpy.types.ActionKeyframeStrip.html) | docs do Blender | `action_ensure_channelbag_for_slot`, `Action.fcurve_ensure_for_datablock`, `strip.channelbag(slot, ensure=...)` e `strip.key_insert(...)`. |
| [WARC: MacLachlan & Logan, shot length em comerciais](https://www.warc.com/Content/421e1376-baa5-472f-aa9d-adc58bea5146) | paywall (só o resumo) | Em 1991, o plano médio de comercial de TV já durava **menos de 2 s**. Ritmo de corte rápido é a norma, então o plano 3D longo tem de "merecer" a duração. |
| [LBB: bastidores do "Shot on iPhone" de Ano-Novo Chinês](https://lbbonline.com/news/apple-shot-on-iphone-chinese-new-year-behind-the-scenes) | artigo | Na Apple, cada plano é "performado" em câmera lenta e acelerado na pós. O movimento lento e controlado é a assinatura. |
| [Cannes Lions: Sarofsky, iMac Pro](https://www.lovethework.com/work-awards/campaigns/sarofskys-artist-series-for-apples-imac-pro-446970) | página de prêmio | Mistura de Phantom a 270 fps com CG. O desafio declarado é fazer o CG parecer fotografado. |
| Manfrotto, "How to shoot cinematic tech videos like Apple" | não li (HTTP 429) | Pelo resumo da busca: estrutura em 3 partes (revelação-herói, detalhes, produto em contexto). Não verificado. |

**Lacuna honesta:** não achei nenhuma fonte 2025–2026 com números de animadores de filmes de produto (durações e curvas). Os números de direção abaixo são inferência minha, ancorada nas molas e curvas da base e nas medições deste teste. A validação final é o olho do Daniel.

---

## 3. Regras de direção de animação (com números, a 30 fps)

### 3.1 Durações por tipo de plano

| Plano | Duração | Quadros | Quanto mover | Curva | Tipo |
|---|---|---|---|---|---|
| **Revelação-herói** (o produto gira e o reflexo varre o vidro) | 3–5 s | 90–150 | rotação relativa produto–câmera de 25–40°. **A varredura (10→90% da rotação) dura ≥ 20–30 quadros.** | mola ζ 0,85, response 2–2,5 s, defasada 6 quadros; ou in-out | MEDIDO (8 q = rápido; 22 q = legível) + INFERÊNCIA |
| **Push-in lento** (dolly) | 3–5 s | 90–150 | 15–30% da distância (teste: 0,62 → 0,46 m = 26%). **Dolly, não zoom.** | `(0.65,0,0.35,1)` se o plano começa parado; `(0.3,0.15,0.2,1)` se entra no corte já em movimento | FONTE (cc-blender: "push-in by physical movement") + INFERÊNCIA |
| **Órbita / arco** | 3–6 s | 90–180 | 20–40° (7–13°/s), com a câmera filha de um pivô no centro do produto | `(0.3,0.15,0.2,1)` | MEDIDO (v2) |
| **Crane** (sobe ou desce) | 3–5 s | 90–150 | 0,5–1× a altura do produto, sem cruzar a linha do olho no meio | in-out | INFERÊNCIA |
| **Turntable / loop** | 6–8 s por volta | 180–240 | 45–60°/s, constante | LINEAR + extrapolação linear, ou Cycles `REPEAT_OFFSET` | skill atual + MEDIDO |
| **Entrada e pouso** (objeto, logo) | 0,5–0,8 s | 15–25 | da borda do quadro (regra 4 do editor) | expo-out `(0.16,1,0.3,1)` ou mola ζ 0,8 | FONTE (`remotion-video`, `molas-e-curvas`) |
| **Detalhe macro** | 1,5–2,5 s | 45–75 | deslize de 2–5% do quadro por segundo | quase linear `(0.33,0,0.67,1)` | INFERÊNCIA |
| **Pausa** antes do corte ou de um texto | ≥ 8–10 quadros | — | deriva residual, nunca congelado | — | FONTE (regras do editor) + INFERÊNCIA |

### 3.2 Escolha da curva pelo "espaçamento" (MEDIDO, plano de 90 quadros)

`vmax` é o pico de velocidade dividido pela velocidade média; `passo1` é quanto do curso anda do quadro 1 para o 2.

| Curva | passo1 | 50% em | 90% em | vmax | Uso |
|---|---|---|---|---|---|
| expo-out `(0.16,1,0.3,1)` | 6,9% | q11 | q31 | **6,1×** | só chegadas curtas (≤ 25 q); em plano longo, gasta o movimento no 1º terço |
| ease-out forte `(0.23,1,0.32,1)` | 4,9% | q13 | q34 | 4,3× | entradas de UI e objeto |
| move `(0.25,1,0.5,1)` | 4,4% | q15 | q41 | 3,9× | deslizes |
| **drift** `(0.3,0.15,0.2,1)` | 0,6% | q27 | q55 | **2,5×** | **câmera entrando no corte em movimento** (velocidade inicial 0,54× a média) |
| Easy Ease do AE `(0.33,0,0.67,1)` | 0,04% | q46 | q73 | 1,5× | o mais "calmo"; câmera de detalhe |
| **dolly** `(0.65,0,0.35,1)` | 0,01% | q46 | q65 | 2,9× | push-in que começa e termina parado |
| in-out forte `(0.77,0,0.175,1)` | 0,01% | q44 | q60 | 4,9× | mover rápido na tela (UI); evitar na câmera |

**Regra (INFERÊNCIA):** na câmera de um plano-herói, **vmax ≤ 3×**. Um vmax de 4–6× parece "UI" ou "trailer de ação", não filme de produto.

### 3.3 Overshoot: quanto e como (MEDIDO)

| Recurso | Parâmetro | Passa do ponto |
|---|---|---|
| Handle com y > 1 | `(0.16, 1.05, 0.3, 1)` | 0,04% (invisível) |
|  | `(0.16, 1.1, 0.3, 1)` | 0,24% |
|  | `(0.2, 1.2, 0.3, 1)` | **1,25%** |
|  | `(0.34, 1.56, 0.64, 1)` (easeOutBack do CSS) | 9,8% (desenho animado) |
| `interpolation='BACK'`, `easing='EASE_OUT'` (na chave de **partida**) | `back = 0.5` | **0,82%** |
|  | `back = 1.0` | 3,7% |
|  | `back = 1.70158` (padrão) | 10% |
| Mola amortecida (pico teórico = e^(−πζ/√(1−ζ²))) | ζ 0,9 | 0,15% |
|  | ζ 0,8 | **1,5%** |
|  | ζ 0,7 | 4,6% |
|  | ζ 0,6 | 9,5% |

Regras:
- **Câmera: 0% de overshoot** (Auto Clamped ou curvas com y entre 0 e 1). Câmera que passa do ponto parece operador errando.
- **Rotação do produto:** 1–2% (ζ 0,8, `back = 0.5` ou o handle `(0.2,1.2,0.3,1)`). Num giro de 65°, 1,5% dá ~1° (medido: pico de 15,98° para um alvo de 15°).
- **Logo e objeto pequeno pousando:** 2–4% (ζ 0,7 ou `back = 1.0`).
- **Opacidade e cor: nunca** (lição do Material 3, já registrada na base).
- A mola com ζ 0,8 e response R faz o pico em ~0,9 R e assenta (< 0,02%) em ~2 R (MEDIDO com R = 1,1 s: pico no quadro 30, 99,98% no quadro 60).

### 3.4 Quantos keyframes

- **1 movimento = 2 chaves por canal**, com a forma toda nos handles. Mais chaves só se o caminho precisa **passar** por um ponto.
- **Passar por um ponto** (3 ou mais chaves): `AUTO_CLAMPED` + `fc.auto_smoothing = 'CONT_ACCEL'`. **Nunca** um ease por trecho: a câmera para na chave do meio. Medido na chave do meio, com velocidade média de 0,0112 por quadro:

  | Método | Velocidade na chave do meio | Salto de aceleração |
  |---|---|---|
  | ease por trecho | 0 (para) | 9,6e-4 |
  | `AUTO_CLAMPED` sem suavização | 0,012 | 1,08e-3 |
  | `AUTO_CLAMPED` + `CONT_ACCEL` | 0,018 | 1,7e-4 (6,4× menor) |
  | `AUTO` + `CONT_ACCEL` | 0,019 | 2,6e-5 (41× menor) |

  O `AUTO` + `CONT_ACCEL` passou 0,018% do fim: use-o só onde um leve "passar" é aceitável.
- **Mola:** 1 chave por quadro, assada por código (`assa_mola`). Essa curva não se edita à mão; para mudar, ajuste ζ e response e asse de novo. Erro entre os quadros: 0,0066% (MEDIDO).
- **Defase os canais em 4–8 quadros** (sobreposição e follow-through): a câmera começa, o produto responde 6 quadros depois. Chaves de todos os canais no mesmo quadro denunciam o "feito no computador" (INFERÊNCIA, princípio clássico de overlap).
- **Arcos:** órbita com câmera filha de um empty-pivô girando em Z, e não `location` em linha reta (MEDIDO, a folha v2 mostra o arco).

### 3.5 Como suavizar

1. **Entrada no corte:** se o plano entra num corte, comece **já em movimento** (drift, velocidade inicial ≈ 0,5× a média). Um ease-in do zero no 1º quadro de um plano parece câmera "ligando". Se o plano começa parado (abertura, ou depois de um texto), use o in-out (INFERÊNCIA).
2. **Saída no corte:** corte com 5–15% do movimento ainda acontecendo. Se o plano termina num hold, chegue com velocidade zero e segure ≥ 8–10 quadros com deriva residual.
3. **Micro-deriva "viva" no hold:** modificador **Noise** na rotação da câmera, Scale 40, Strength 0,3°, Depth 0. Medido: 0,15° pico a pico em 10 s e passo máximo de 0,005° por quadro, invisível como tremor e perceptível como "vida". **Nunca** ponha Noise na posição do produto.
4. **Motion blur sempre ligado** no final, com `motion_blur_shutter = 0.5` (180°). Custa ~3–4% de CPU (MEDIDO). O blur ignora o movimento das luzes: deixe as luzes paradas (já é a regra da skill).
5. **Dados densos** (mola assada, mocap): para limpar, use o Butterworth ou o Gaussian do Graph Editor. Para reduzir chaves, use o Decimate por erro máximo.
6. **Conferência objetiva:** exporte a curva quadro a quadro (CSV) e compare com o alvo. Na folha de contato, meça quantos quadros a varredura do reflexo leva.

### 3.6 Câmera premium, receita de plano

- Lente de **85 mm** (do celular ao produto pequeno) ou **100 mm** para o detalhe (FONTE: tabela de lentes do cc-blender-skill, MIT). A lente fica constante; se ela mudar, que seja no máximo 10–20% junto com o dolly (o `slow-zoom` faz 35 → 65 mm, mas é exagerado para o celular; INFERÊNCIA).
- `TRACK_TO` num empty de foco, que também serve de `dof.focus_object`. O pivô da órbita fica no centro do produto.
- **Varredura de reflexo = o momento-herói.** Gire o produto e/ou a câmera contra luzes paradas, com a rotação **relativa** de 25–40° e ≥ 20–30 quadros entre 10% e 90% da varredura (MEDIDO: v1 = 8 q, rápido demais; v2 = 22 q, legível).
- Não empilhe dois ease-out rápidos no mesmo sentido (órbita + produto): as velocidades somam (lição da v1).

---

## 4. Receitas bpy (código próprio, testado no 5.2.2)

Script completo: `teste-A/curvas_premium.py`. Sonda dos modificadores: `teste-A/sonda_modificadores.py`. Ambos são GPL-3.0-or-later, como os scripts da skill.

```python
import bpy, math

def fcurve_de(idb, path, idx=0):
    """Acha ou cria a f-curve. 5.x: cria camada, faixa, slot e channelbag de uma vez."""
    ad = idb.animation_data_create()
    if ad.action is None:
        ad.action = bpy.data.actions.new(idb.name + 'Acao')   # precisa estar atribuida antes
    act = ad.action
    if hasattr(act, 'fcurve_ensure_for_datablock'):          # 4.4+ / 5.x
        return act.fcurve_ensure_for_datablock(idb, path, index=idx)
    return act.fcurves.find(path, index=idx) or act.fcurves.new(path, index=idx)

def curva(idb, path, idx, pts, bez=(0.16, 1, 0.3, 1)):
    """pts = [(quadro, valor), ...]; bez = um cubic-bezier (CSS/Remotion) ou lista, um por trecho."""
    fc = fcurve_de(idb, path, idx); kps = fc.keyframe_points
    kps.clear(); kps.add(len(pts))
    for kp, (f, v) in zip(kps, pts):
        kp.co = (f, v); kp.interpolation = 'BEZIER'
        kp.handle_left_type = kp.handle_right_type = 'FREE'   # tipo ANTES da posicao
        kp.handle_left, kp.handle_right = (f - 1, v), (f + 1, v)
    for i, (p, q) in enumerate(zip(kps[:-1], kps[1:])):
        x1, y1, x2, y2 = bez[i] if isinstance(bez[0], (tuple, list)) else bez
        dt, dv = q.co.x - p.co.x, q.co.y - p.co.y
        p.handle_right = (p.co.x + x1 * dt, p.co.y + y1 * dv)
        q.handle_left  = (p.co.x + x2 * dt, p.co.y + y2 * dv)
    fc.update(); return fc                                     # update() preserva os FREE

def assa_mola(idb, path, idx, f0, f1, v0, v1, zeta=0.8, resposta=1.0):
    """Mola Apple (zeta, response em s) assada: 1 chave por quadro. Defina scene.render.fps antes."""
    w0 = 2 * math.pi / resposta; wd = w0 * math.sqrt(1 - zeta * zeta); fps = bpy.context.scene.render.fps
    m = lambda t: 1 - math.exp(-zeta * w0 * t) * (math.cos(wd * t) + zeta * w0 / wd * math.sin(wd * t))
    fc = fcurve_de(idb, path, idx); kps = fc.keyframe_points; kps.clear(); kps.add(f1 - f0 + 1)
    for kp, f in zip(kps, range(f0, f1 + 1)):
        kp.co = (f, v0 + (v1 - v0) * m((f - f0) / fps)); kp.interpolation = 'BEZIER'
        kp.handle_left_type = kp.handle_right_type = 'AUTO_CLAMPED'
    fc.update(); return fc
```

**Plano-herói v2** (o que funcionou na folha):
```python
R = math.radians
pivo = bpy.data.objects.new('Pivo', None)            # orbita em arco: camera filha do pivo
cam.parent = pivo; cam.location = (0, -0.62, 0.03)   # TRACK_TO no empty 'Foco'
curva(pivo, 'rotation_euler', 2, [(1, R(-30)), (90, 0)], (0.3, 0.15, 0.2, 1))   # entra no corte andando
curva(cam,  'location',       1, [(1, -0.62), (90, -0.46)], (0.65, 0, 0.35, 1))  # push-in de 26%, dolly
assa_mola(prod, 'rotation_euler', 2, 7, 90, R(-40), R(15), zeta=0.85, resposta=2.4)  # defasada 6 q
sc.render.use_motion_blur = True; sc.render.motion_blur_shutter = 0.5           # 180 graus
```

**Caminho que passa por um ponto sem parar:**
```python
fc = fcurve_de(cam, 'location', 2); fc.auto_smoothing = 'CONT_ACCEL'
fc.keyframe_points.add(3)
for kp, (f, v) in zip(fc.keyframe_points, [(1, 0.02), (40, 0.06), (90, 0.08)]):
    kp.co = (f, v); kp.interpolation = 'BEZIER'; kp.handle_left_type = kp.handle_right_type = 'AUTO_CLAMPED'
fc.update()
```

**Overshoot de pouso discreto** (na chave de **partida**):
```python
a, b = fc.keyframe_points[0], fc.keyframe_points[1]
a.interpolation = 'BACK'; a.easing = 'EASE_OUT'; a.back = 0.5     # 0,8% (o padrao 1.70158 da 10%)
```

**Lente** (fica no dado da câmera, que é outro ID, com action e slot próprios):
```python
curva(cam.data, 'lens', 0, [(1, 85), (90, 95)], (0.65, 0, 0.35, 1))
```

**Micro-deriva no hold e turntable sem salto:**
```python
fr = fcurve_de(cam, 'rotation_euler', 0)              # testado com 1 chave na curva
n = fr.modifiers.new('NOISE'); n.scale = 40; n.strength = math.radians(0.3); n.depth = 0; n.phase = 7
n.use_restricted_range = True; n.frame_start, n.frame_end = 60, 150; n.blend_in = n.blend_out = 10

ft = curva(prod, 'rotation_euler', 2, [(1, 0), (181, 2 * math.pi)])
for kp in ft.keyframe_points: kp.interpolation = 'LINEAR'
cy = ft.modifiers.new('CYCLES')                       # tem de ser o 1o modificador
cy.mode_before = cy.mode_after = 'REPEAT_OFFSET'      # o padrao REPEAT volta 358 graus por ciclo
```

**Conferência da curva contra o alvo** (`curvas_premium.py` faz isto para cada canal e grava o CSV):
```python
amp = abs(v1 - v0)
erro = max(abs(fc.evaluate(f0 + k / 20) - (v0 + (v1 - v0) * alvo((k / 20) / (f1 - f0)))) / amp
           for k in range((f1 - f0) * 20 + 1))
```

---

## 5. Resultado do teste (MEDIDO, 11/10/2026)

**Arquivos em `teste-A/`:**
- `curvas_premium.py`: a cena, as curvas, as medidas e o render;
- `sonda.py`: enums da API;
- `sonda_modificadores.py`: lente, Noise e Cycles;
- `curvas_v1.csv` e `curvas_v2.csv`: 595 linhas cada, com canal, quadro, u, alvo, Blender e erro;
- `resumo_v1.json` e `resumo_v2.json`;
- `folha_v1_mb.png` e `folha_v2_mb.png`: 30 quadros, 6×5;
- `quadros_v1_mb/`, `quadros_v1_semmb/` e `quadros_v2mb/`: PNGs RGBA de 270×480;
- `log_*.txt`.

### Erro da curva

| Canal | Erro máximo nos quadros | Erro máximo em subquadros (passo 0,05) |
|---|---|---|
| órbita `(0.16,1,0.3,1)`, escrita direta | 0,00002% | 0,00003% |
| dolly `(0.65,0,0.35,1)`, escrita direta | 0,00004% | 0,00005% |
| entrada `(0.22,1,0.36,1)` em 20 q | 0,00002% | 0,00002% |
| método `keyframe_insert` da skill atual, expo e dolly | 0,00002–0,00003% | 0,00003% |
| 4 curvas com overshoot por handle | 0,00002% | até 0,00005% |
| mola assada ζ 0,8, R 1,1 s | 0 | 0,0066% (entre as chaves) |
| mola v2 ζ 0,85, R 2,4 s | 0 | 0,0037% |

Conclusões:
- O erro é do float32: a conversão cubic-bezier → handles é exata.
- O depsgraph (`frame_set` + valor no objeto) bate com `fcurve.evaluate`: diferença de 0,0 rad.
- O handle `FREE` continuou no lugar depois de `fc.update()`.
- O método antigo da skill (`keyframe_insert`) e o novo (escrita direta) dão o mesmo resultado.

### Tempo de render

Cycles, 4 amostras + OIDN, 270×480 (25%), 30 quadros (1, 4, …, 88):

| Rodada | Total do render | Mediana por quadro | 1º quadro | Processo inteiro |
|---|---|---|---|---|
| v1 com motion blur 0,5 (cache frio) | 25,2 s | 0,70 s | 4,60 s | 26,2 s |
| v1 sem motion blur | 20,6 s | 0,68 s | 0,78 s | 21,5 s |
| v2 com motion blur | 26,7 s | 0,74 s | 0,77 s | 27,7 s |

As medidas sem render levam ~1,8 s de processo. O Eevee não foi tentado: a skill já registra que ele aborta no `-b` deste container (falta `libEGL`).

### Leitura das folhas

- **v1:** o brilho do key cruza o vidro nos 4 primeiros quadros da folha (~12 quadros reais). Pela métrica de varredura, 10→90% em **8 quadros**. Depois sobram 2,5 s só de push-in. Funciona, mas é "rápido e depois nada".
- **v2:** o brilho atravessa em ~9 quadros da folha (≈ 27 quadros reais); a métrica dá 10→90% em **22 quadros**. Em seguida vem a passagem para o lado iluminado e o push-in contínuo. Ficou mais "filme".

O visual ainda é de teste: sem UI na tela, sem HDRI e sem DOF. O premium do material e da luz é de outra fatia.

---

## 6. Armadilhas da API 5.x (novas ou confirmadas)

1. **`Action.fcurve_ensure_for_datablock(datablock, data_path, index, group_name)`** existe no 5.2.2. A action precisa estar atribuída ao ID antes; o método cria camada, faixa, slot e channelbag. Com ele, não é preciso `keyframe_insert` nem `anim_utils` para escrever (MEDIDO).
2. **Escrever chaves direto** (`keyframe_points.add(n)` + `kp.co`): defina `handle_*_type = 'FREE'` **antes** de posicionar os handles e chame `fc.update()` no fim. O update preserva os FREE e recalcula só os automáticos (MEDIDO).
3. **A interpolação vale para o trecho depois da chave:** o BACK, ELASTIC ou BOUNCE de chegada vai na chave de **partida**. O `cc-blender-skill` (receita 4) erra isso, e a skill atual já registrava o mesmo erro (CONFIRMADO).
4. **A f-curve é float32:** erros de ~5e-7 são piso numérico. Derivada numérica precisa de passo ≥ 0,5 quadro; com passo de 0,02, o ruído domina (MEDIDO).
5. **A lente, o DOF e o foco ficam em `cam.data`:** é outro ID, com action e slot próprios (o identificador do slot começa com `CA`). Anime em `cam.data`, não em `cam` (MEDIDO).
6. **Modificador `CYCLES`:** o modo padrão `REPEAT` faz o valor voltar (passo de −358° num quadro), e o motion blur borraria uma volta inteira para trás. Use `REPEAT_OFFSET` (MEDIDO). Ele também precisa ser o 1º modificador e não combina com o Smooth (Gaussian) (manual).
7. **`Noise` no modo `REPLACE`:** o ruído fica em ±0,5 × strength. Na prática, Strength 0,3° deu 0,15° pico a pico em 300 quadros com Depth 0 (MEDIDO).
8. **`fc.auto_smoothing`** (`'NONE'` | `'CONT_ACCEL'`) é por f-curve e só age sobre handles `AUTO` e `AUTO_CLAMPED` (MEDIDO + manual).
9. **Motion blur:** `motion_blur_shutter` é medido em quadros (0,5 = 180°). Luzes em movimento não borram e a câmera ortográfica não borra (manual).
10. **Defina `scene.render.fps = 30` antes** de assar molas ou converter segundos em quadros. O padrão é 24, e o `slow-zoom` de terceiros usa 24 fps.

---

## 7. Recomendação para a skill `blender-ia`

**Entra (por ordem de valor):**

1. **Seção nova "Direção de animação premium"** com as tabelas 3.1 (durações), 3.2 (curva por espaçamento e vmax) e 3.3 (overshoot medido), e as regras de 3.4 e 3.5:
   - 2 chaves por movimento;
   - `CONT_ACCEL` para passar por um ponto;
   - canais defasados em 4–8 quadros;
   - órbita com pivô;
   - entrar no corte já em movimento;
   - vmax da câmera ≤ 3×;
   - varredura de reflexo ≥ 20–30 quadros;
   - overshoot de câmera 0%, de rotação 1–2%.
2. **Trocar o helper `anima()` por `fcurve_de()` + `curva()`:** escrita direta, um bezier por trecho, pontas planas, e funciona em `cam.data`. Manter o `fcurves()` para leitura.
3. **Acrescentar `assa_mola()`:** mola Apple assada, com o overshoot físico de 1,5% a ζ 0,8.
4. **Script `verifica_curvas.py`**, extraído de `curvas_premium.py`: CSV quadro a quadro, erro contra o alvo, vmax, quadros de 10→90% da varredura relativa. É o "QA de curva" antes da folha.
5. **Armadilhas novas** (seção 6): itens 1, 2, 5, 6, 7 e 10.
6. **Checklist**, itens novos:
   - "vmax da câmera ≤ 3×";
   - "varredura ≥ 20 quadros";
   - "nenhuma parada no meio de um caminho";
   - "motion blur 0,5 ligado no final";
   - "canais defasados".

**Não entra:**
- skills de terceiros como dependência (o `cc-blender-skill` é genérico e tem o bug do BOUNCE; o `kevinbadi` não tem licença);
- números de duração "de comercial Apple" como se fossem fonte: deixe claro que são inferência e validação do Daniel.

**Próximo passo sugerido:** renderizar a v2 com o `produto.py` real (tela com UI, HDRI, DOF) e mostrar ao Daniel as duas folhas (v1 e v2) lado a lado, para ele calibrar a varredura (20, 30 ou 40 quadros) e o overshoot (0,8% ou 1,5%).
