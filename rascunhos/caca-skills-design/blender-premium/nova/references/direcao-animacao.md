# Direção de animação premium (Blender, 30 fps)

Detalhe do `SKILL.md`. Medido no Blender 5.2.2 (12/10/2026) com `scripts/verifica_curvas.py` e `scripts/premium.py`.
Legenda: **MEDIDO** = rodado aqui; **FONTE** = vem da fonte citada; **INFERÊNCIA** = conclusão nossa, a validar com o olho do Daniel (não achamos fonte de 2025–26 com durações de animadores de filme de produto).

## 1. A ideia

O que deixa o movimento "premium" é a **direção**, não a curva: poucas chaves, curvas longas, canais defasados, reflexo que leva tempo para cruzar o vidro, câmera que nunca passa do ponto. A curva do Remotion (`Easing.bezier`) vira handles do Blender com erro de 0,00005% do curso (só o float32), então o 2D e o 3D podem ter a mesma assinatura de movimento.

Teste que provou: na versão 1, expo-out na órbita + mola rápida no produto fizeram o reflexo cruzar o vidro em **8 quadros** (0,27 s), rápido demais. Na versão 2 (curvas longas, canais defasados em 6 quadros), a mesma varredura levou **22–24 quadros** e a folha ficou legível. Veja `folha_v1_mb.png` x `folha_v2_mb.png`.

## 2. Planos: duração, quanto mover, curva

| Plano | Duração | Quadros | Quanto mover | Curva | Tipo |
|---|---|---|---|---|---|
| **Revelação-herói** (produto gira, reflexo varre o vidro) | 3–5 s | 90–150 | rotação relativa produto–câmera de 25–40°; a varredura (10→90%) dura **≥ 20–30 quadros** | mola ζ 0,85, response 2–2,5 s, defasada 6 quadros | MEDIDO + INFERÊNCIA |
| **Push-in lento** (dolly) | 3–5 s | 90–150 | 15–30% da distância. **Dolly, não zoom** | `(0.65,0,0.35,1)` se parte parado; `(0.3,0.15,0.2,1)` se entra no corte já andando | FONTE (cc-blender: push-in por movimento físico) + INFERÊNCIA |
| **Órbita / arco** | 3–6 s | 90–180 | 20–40° (7–13°/s), câmera filha de um pivô no centro do produto | `(0.3,0.15,0.2,1)` | MEDIDO |
| **Crane** (sobe/desce) | 3–5 s | 90–150 | 0,5–1× a altura do produto, sem cruzar a linha do olho no meio | in-out | INFERÊNCIA |
| **Turntable / loop** | 6–8 s por volta | 180–240 | 45–60°/s constante | LINEAR + `CYCLES` com `REPEAT_OFFSET` | MEDIDO |
| **Entrada e pouso** (objeto, logo) | 0,5–0,8 s | 15–25 | da borda do quadro (regra 4 do editor) | expo-out `(0.16,1,0.3,1)` ou mola ζ 0,8 | FONTE (`remotion-video`, `molas-e-curvas`) |
| **Detalhe macro** | 1,5–2,5 s | 45–75 | deslize de 2–5% do quadro por segundo | quase linear `(0.33,0,0.67,1)` | INFERÊNCIA |
| **Pausa** antes do corte ou de um texto | ≥ 8–10 quadros | — | deriva residual, nunca congelado | — | FONTE (regras do editor) |

Contexto de ritmo: o plano médio de comercial de TV já era menor que 2 s em 1991 (MacLachlan & Logan, WARC, só o resumo). O plano 3D longo precisa "merecer" a duração. O movimento lento e controlado é a assinatura de filmes de produto (a Apple "performa" o plano em câmera lenta e acelera na pós).

## 3. Escolher a curva pelo "espaçamento" (MEDIDO, plano de 90 quadros)

`vmax` = pico de velocidade ÷ velocidade média. `passo1` = quanto do curso anda do quadro 1 para o 2.

| Curva | passo1 | 50% em | 90% em | vmax | Uso |
|---|---|---|---|---|---|
| expo-out `(0.16,1,0.3,1)` | 6,9% | q11 | q31 | **6,1×** | só chegadas curtas (≤ 25 q); em plano longo gasta o movimento no 1º terço |
| ease-out forte `(0.23,1,0.32,1)` | 4,9% | q13 | q34 | 4,3× | entradas de UI e objeto |
| move `(0.25,1,0.5,1)` | 4,4% | q15 | q41 | 3,9× | deslizes |
| **drift** `(0.3,0.15,0.2,1)` | 0,6% | q27 | q55 | **2,5×** | **câmera entrando no corte em movimento** (velocidade inicial 0,5× a média) |
| Easy Ease do AE `(0.33,0,0.67,1)` | 0,04% | q46 | q73 | 1,5× | o mais calmo; câmera de detalhe |
| **dolly** `(0.65,0,0.35,1)` | 0,01% | q46 | q65 | 2,9× | push-in que começa e termina parado |
| in-out forte `(0.77,0,0.175,1)` | 0,01% | q44 | q60 | 4,9× | mover rápido na tela (UI); evitar na câmera |

**Regra (INFERÊNCIA):** na câmera de um plano-herói, **vmax ≤ 3×**. Um vmax de 4–6× parece "UI" ou "trailer de ação". Não empilhe dois ease-out rápidos no mesmo sentido (órbita + produto): as velocidades somam.

## 4. Overshoot: quanto e como (MEDIDO)

| Recurso | Parâmetro | Passa do ponto |
|---|---|---|
| Handle com y > 1 | `(0.16, 1.05, 0.3, 1)` | 0,04% (invisível) |
| | `(0.16, 1.1, 0.3, 1)` | 0,24% |
| | `(0.2, 1.2, 0.3, 1)` | **1,25%** |
| | `(0.34, 1.56, 0.64, 1)` (easeOutBack do CSS) | 9,8% (desenho animado) |
| `interpolation='BACK'`, `easing='EASE_OUT'` (na chave de **partida**) | `back = 0.5` | **0,82%** |
| | `back = 1.0` | 3,7% |
| | `back = 1.70158` (padrão) | 10% |
| Mola amortecida (pico teórico = e^(−πζ/√(1−ζ²))) | ζ 0,9 / 0,8 / 0,7 / 0,6 | 0,15% / **1,5%** / 4,6% / 9,5% |

Regras:
- **Câmera: 0%** (Auto Clamped, ou curvas com y entre 0 e 1). Câmera que passa do ponto parece operador errando.
- **Rotação do produto:** 1–2% (ζ 0,8, `back = 0.5` ou o handle `(0.2,1.2,0.3,1)`). Num giro de 65°, 1,5% dá ~1°.
- **Logo e objeto pequeno pousando:** 2–4% (ζ 0,7 ou `back = 1.0`).
- **Opacidade e cor: nunca.**
- Mola ζ 0,8 e response R: pico em ~0,9 R, assenta (< 0,02%) em ~2 R.
- **A interpolação de uma chave vale para o trecho DEPOIS dela:** BACK, ELASTIC e BOUNCE de chegada vão na chave de **partida**. (O `cc-blender-skill`, receita 4, põe na última chave e não tem efeito.)

## 5. Quantos keyframes, e como passar por um ponto

- **1 movimento = 2 chaves por canal**, com a forma toda nos handles. Mais chaves só se o caminho precisa **passar** por um ponto.
- **Passar por um ponto** (3 ou mais chaves): `AUTO_CLAMPED` + `fc.auto_smoothing = 'CONT_ACCEL'`. **Nunca** um ease por trecho: a câmera para na chave do meio. Medido na chave do meio (velocidade média 0,0112 por quadro):

  | Método | Velocidade na chave do meio | Salto de aceleração |
  |---|---|---|
  | ease por trecho | 0 (para) | 9,6e-4 |
  | `AUTO_CLAMPED` sem suavização | 0,012 | 1,08e-3 |
  | `AUTO_CLAMPED` + `CONT_ACCEL` | 0,018 | 1,7e-4 (6,4× menor) |
  | `AUTO` + `CONT_ACCEL` | 0,019 | 2,6e-5 (41× menor), passa 0,018% do fim: só onde um leve "passar" é aceitável |

- **Mola:** 1 chave por quadro, assada por código (`assa_mola`). Não se edita à mão; ajuste ζ e response e asse de novo. Erro entre os quadros: 0,0066%.
- **Defase os canais em 4–8 quadros** (sobreposição e follow-through): a câmera começa, o produto responde 6 quadros depois. Chaves de todos os canais no mesmo quadro denunciam o "feito no computador".
- **Arcos:** órbita com a câmera filha de um empty-pivô girando em Z, não `location` em linha reta.

## 6. Como suavizar cada keyframe (passo a passo)

1. **Entrada no corte:** se o plano entra num corte, comece **já em movimento** (drift: velocidade inicial ≈ 0,5× a média). Ease-in do zero no 1º quadro parece câmera "ligando". Se o plano começa parado (abertura, ou depois de um texto), use o dolly in-out.
2. **Saída no corte:** corte com 5–15% do movimento ainda acontecendo. Se termina num hold, chegue com velocidade zero e segure ≥ 8–10 quadros com deriva residual.
3. **Micro-deriva "viva" no hold:** modificador **Noise** na rotação da câmera, Scale 40, Strength 0,3°, Depth 0 (medido: 0,15° pico a pico em 10 s, passo máximo de 0,005° por quadro: invisível como tremor, perceptível como vida). **Nunca** Noise na posição do produto.
4. **Motion blur ligado no final**, `motion_blur_shutter = 0.5` (180°). Custa ~3–4% de CPU. O blur ignora o movimento das luzes (deixe as luzes paradas) e a câmera ortográfica não borra.
5. **Dados densos** (mola assada, mocap): Butterworth ou Gaussian do Graph Editor para limpar; Decimate por erro máximo para reduzir chaves.
6. **Conferência objetiva:** `verifica_curvas.py` (vmax, entrada, overshoot, paradas, CSV quadro a quadro) e, na folha de contato, quantos quadros a varredura do reflexo leva.

## 7. Câmera premium: receita de plano

- Lente de **85 mm** (celular/produto pequeno) ou **100 mm** no detalhe (tabela de lentes do cc-blender-skill, MIT: 50 mm neutra, 85 mm íntima, 100–135 mm herói de produto com DOF raso). Lente constante; se mudar, no máximo 10–20% junto com o dolly (o `slow-zoom` de terceiros faz 35→65 mm, exagerado para celular).
- `TRACK_TO` num empty de foco, que também é o `dof.focus_object`. Pivô da órbita no centro do produto.
- **Varredura de reflexo = o momento-herói.** Gire o produto e/ou a câmera contra luzes **paradas**: rotação relativa de 25–40°, ≥ 20–30 quadros entre 10% e 90%.
- Fechamento na tela cheia: use afastamento de câmera, nunca recorte (regras do editor).

## 8. Receitas `bpy` (as mesmas do `premium.py`)

```python
import bpy, math

def fcurve_de(idb, path, idx=0):
    """Acha ou cria a f-curve. 5.x: cria camada, faixa, slot e channelbag de uma vez."""
    ad = idb.animation_data_create()
    if ad.action is None:
        ad.action = bpy.data.actions.new(idb.name + 'Acao')      # precisa estar atribuída antes
    act = ad.action
    if hasattr(act, 'fcurve_ensure_for_datablock'):              # 4.4+ / 5.x
        return act.fcurve_ensure_for_datablock(idb, path, index=idx)
    return act.fcurves.find(path, index=idx) or act.fcurves.new(path, index=idx)

def curva(idb, path, idx, pts, bez=(0.16, 1, 0.3, 1)):
    """pts = [(quadro, valor), ...]; bez = um cubic-bezier (CSS/Remotion) ou lista, um por trecho."""
    fc = fcurve_de(idb, path, idx); kps = fc.keyframe_points
    kps.clear(); kps.add(len(pts))
    for kp, (f, v) in zip(kps, pts):
        kp.co = (f, v); kp.interpolation = 'BEZIER'
        kp.handle_left_type = kp.handle_right_type = 'FREE'      # tipo ANTES da posição
        kp.handle_left, kp.handle_right = (f - 1, v), (f + 1, v)
    for i, (p, q) in enumerate(zip(kps[:-1], kps[1:])):
        x1, y1, x2, y2 = bez[i] if isinstance(bez[0], (tuple, list)) else bez
        dt, dv = q.co.x - p.co.x, q.co.y - p.co.y
        p.handle_right = (p.co.x + x1 * dt, p.co.y + y1 * dv)
        q.handle_left  = (p.co.x + x2 * dt, p.co.y + y2 * dv)
    fc.update(); return fc                                       # update() preserva os FREE

def assa_mola(idb, path, idx, fa, fb, v0, v1, zeta=0.8, resposta=1.0):
    """Mola Apple (zeta, response em s) assada: 1 chave por quadro. Defina scene.render.fps antes."""
    w0 = 2 * math.pi / resposta; wd = w0 * math.sqrt(1 - zeta * zeta); fps = bpy.context.scene.render.fps
    m = lambda t: 1 - math.exp(-zeta * w0 * t) * (math.cos(wd * t) + zeta * w0 / wd * math.sin(wd * t))
    fc = fcurve_de(idb, path, idx); kps = fc.keyframe_points; kps.clear(); kps.add(fb - fa + 1)
    for kp, f in zip(kps, range(fa, fb + 1)):
        kp.co = (f, v0 + (v1 - v0) * m((f - fa) / fps)); kp.interpolation = 'BEZIER'
        kp.handle_left_type = kp.handle_right_type = 'AUTO_CLAMPED'
    fc.update(); return fc
```

**Plano-herói** (o que o `premium.py --anim heroi` faz, 90 quadros):
```python
R = math.radians
pivo = bpy.data.objects.new('Pivo', None); cam.parent = pivo; cam.location = (0, -0.68, 0.035)   # TRACK_TO no empty Foco
curva(pivo, 'rotation_euler', 2, [(1, R(-20)), (90, 0)], (0.3, 0.15, 0.2, 1))   # entra no corte andando
curva(cam,  'location',       1, [(1, -0.68), (90, -0.56)], (0.65, 0, 0.35, 1))  # push-in de 18%, dolly
assa_mola(prod, 'rotation_euler', 2, 7, 90, rz - R(45), rz, zeta=0.85, resposta=2.35)   # defasada 6 quadros
sc.render.use_motion_blur = True; sc.render.motion_blur_shutter = 0.5
```
Medido nele: órbita vmax 2,51× (entra a 0,26× da média), dolly vmax 2,85×, produto vmax 3,01× e passa 0,3–0,6%, varredura 10→90% em 24 quadros (25,2° relativos), nenhuma parada no meio.

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
a = fc.keyframe_points[0]; a.interpolation = 'BACK'; a.easing = 'EASE_OUT'; a.back = 0.5   # 0,8% (o padrão dá 10%)
```

**Lente** (fica no dado da câmera, outro ID, com action e slot próprios; o slot começa com `CA`):
```python
curva(cam.data, 'lens', 0, [(1, 85), (90, 95)], (0.65, 0, 0.35, 1))
```

**Micro-deriva no hold e turntable sem salto:**
```python
fr = fcurve_de(cam, 'rotation_euler', 0)               # testado com 1 chave na curva
n = fr.modifiers.new('NOISE'); n.scale = 40; n.strength = math.radians(0.3); n.depth = 0; n.phase = 7
n.use_restricted_range = True; n.frame_start, n.frame_end = 60, 150; n.blend_in = n.blend_out = 10

ft = curva(prod, 'rotation_euler', 2, [(1, 0), (211, 2 * math.pi)])      # 7 s por volta
for kp in ft.keyframe_points: kp.interpolation = 'LINEAR'
cy = ft.modifiers.new('CYCLES')                        # tem de ser o 1º modificador
cy.mode_before = cy.mode_after = 'REPEAT_OFFSET'       # o padrão REPEAT volta 358° por ciclo e o motion blur borra
```
Medido: turntable de 60 quadros a 6,0000° por quadro, sem salto.

## 9. Armadilhas de animação na API 5.x

1. `Action.fcurve_ensure_for_datablock(datablock, data_path, index, group_name)` existe no 5.2.2; a action precisa estar atribuída ao ID antes. Não precisa de `keyframe_insert` nem de `anim_utils` para escrever.
2. Escrevendo chaves direto: `handle_*_type = 'FREE'` **antes** de posicionar os handles, e `fc.update()` no fim (preserva os FREE e recalcula só os automáticos).
3. A f-curve é float32: erros de ~5e-7 são piso numérico. Derivada numérica precisa de passo ≥ 0,5 quadro.
4. Lente, DOF e foco ficam em `cam.data`, não em `cam`.
5. Modificador `CYCLES`: `REPEAT_OFFSET`; tem de ser o 1º da pilha; não combina com Smooth (Gaussian).
6. `Noise` no modo `REPLACE`: o ruído fica em ±0,5 × strength.
7. `fc.auto_smoothing` (`'NONE'` | `'CONT_ACCEL'`) é por f-curve e só age em handles `AUTO` e `AUTO_CLAMPED`.
8. `motion_blur_shutter` é em quadros (0,5 = 180°).
9. **Defina `scene.render.fps = 30` antes** de assar molas ou converter segundos em quadros (o padrão é 24, e o `slow-zoom` de terceiros usa 24).

## 10. Fontes (só leitura; texto não copiado)

- Blender Manual 5.2 (CC-BY-SA 4.0, só paráfrase): F-Curves (introdução, propriedades, modificadores, edição) e Cycles Motion Blur. API 5.x: `anim_utils`, `Action`, `ActionKeyframeStrip`.
- `RobLe3/cc-blender-skill` (MIT): tabela de lentes, helper 4.x/5.x, "gate" de folha de contato. Bug do BOUNCE na última chave: não copiado.
- `dylantarre/animation-principles` (MIT): "dramático ≥ 2 s": antecipação de 400–600 ms, câmera recua antes do push-in.
- `affaan-m/ecc@blender-motion-state-inspection` (MIT): "extraia os fatos do Blender quadro a quadro antes de julgar pelo print".
- `emilkowalski/skills@apple-design` (MIT, já em `motion-oficial/references/molas-e-curvas.md`): mola Apple ζ/response.
- `kevinbadi/blender-skills`: **sem licença**, só vocabulário de planos; nada copiado.
- WARC (MacLachlan & Logan), LBB ("Shot on iPhone" Ano-Novo Chinês), Cannes Lions (Sarofsky, iMac Pro): contexto de ritmo e de "CG que parece fotografado".
