# SPDX-License-Identifier: GPL-3.0-or-later
# Teste A (blender-premium): curvas controladas por codigo no Blender 5.2.2.
# - camera em orbita (pivo) + dolly, produto girando com mola "Apple" (assado quadro a quadro)
# - handles Bezier calculados a partir de cubic-bezier (x1,y1,x2,y2), igual ao Remotion/CSS
# - mede o erro da f-curve contra a curva-alvo (quadros inteiros e subquadros)
# - mede overshoot de BACK e de handles com y > 1, e a suavidade de caminhos com 3 chaves
# Uso: blender -b --factory-startup -P curvas_premium.py -- --out /abs/dir [--render] [--mb] [--spp 4] [--pct 25]
import bpy, bmesh, sys, math, csv, json, time, argparse

ap = argparse.ArgumentParser()
ap.add_argument('--out', required=True); ap.add_argument('--render', action='store_true')
ap.add_argument('--mb', action='store_true'); ap.add_argument('--spp', type=int, default=4)
ap.add_argument('--pct', type=int, default=25); ap.add_argument('--tag', default='mb')
ap.add_argument('--v2', action='store_true', help='direcao corrigida: varredura do reflexo mais lenta e canais defasados')
args = ap.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else [])

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.fps, sc.render.fps_base = 30, 1.0
F0, F1 = 1, 90                                   # plano de 3 s a 30 fps
sc.frame_start, sc.frame_end = F0, F1

# ---------------- matematica de referencia ----------------
def cubic_bezier(x1, y1, x2, y2):
    """Mesma funcao do CSS cubic-bezier / Remotion Easing.bezier: u (0..1 do tempo) -> progresso."""
    bx = lambda t: 3 * (1 - t) ** 2 * t * x1 + 3 * (1 - t) * t * t * x2 + t ** 3
    by = lambda t: 3 * (1 - t) ** 2 * t * y1 + 3 * (1 - t) * t * t * y2 + t ** 3
    def f(u):
        lo, hi = 0.0, 1.0
        for _ in range(60):                       # bissecao: x(t) e monotona para x1,x2 em [0,1]
            mid = (lo + hi) / 2
            if bx(mid) < u: lo = mid
            else: hi = mid
        return by((lo + hi) / 2)
    return f

def mola(zeta, resposta):
    """Mola amortecida (massa 1), parametros do padrao Apple: razao de amortecimento e response (s)."""
    w0 = 2 * math.pi / resposta
    def f(t):
        if zeta >= 1:  # critica
            return 1 - math.exp(-w0 * t) * (1 + w0 * t)
        wd = w0 * math.sqrt(1 - zeta * zeta)
        return 1 - math.exp(-zeta * w0 * t) * (math.cos(wd * t) + zeta * w0 / wd * math.sin(wd * t))
    return f

# ---------------- API de animacao (4.x e 5.x) ----------------
def fcurve_de(idb, path, idx=0):
    """Cria/acha a f-curve. 5.x: Action.fcurve_ensure_for_datablock cria camada, faixa, slot e channelbag."""
    ad = idb.animation_data_create()
    if ad.action is None:
        ad.action = bpy.data.actions.new(idb.name + 'Acao')
    act = ad.action
    if hasattr(act, 'fcurve_ensure_for_datablock'):            # 4.4+/5.x
        return act.fcurve_ensure_for_datablock(idb, path, index=idx)
    return act.fcurves.find(path, index=idx) or act.fcurves.new(path, index=idx)  # <= 4.3

def curva(idb, path, idx, pts, bez=(0.16, 1, 0.3, 1)):
    """pts = [(quadro, valor), ...]; bez = um cubic-bezier para todos os trechos, ou lista (um por trecho).
    Escreve as chaves direto (sem keyframe_insert): handles FREE nos dois lados de cada trecho."""
    fc = fcurve_de(idb, path, idx)
    fc.keyframe_points.clear()
    fc.keyframe_points.add(len(pts))
    kps = fc.keyframe_points
    for kp, (f, v) in zip(kps, pts):
        kp.co = (f, v); kp.interpolation = 'BEZIER'
        kp.handle_left_type = kp.handle_right_type = 'FREE'
        kp.handle_left = (f - 1, v); kp.handle_right = (f + 1, v)   # pontas: tangente plana
    for i, (p, q) in enumerate(zip(kps[:-1], kps[1:])):
        x1, y1, x2, y2 = bez[i] if isinstance(bez[0], (tuple, list)) else bez
        dt, dv = q.co.x - p.co.x, q.co.y - p.co.y
        p.handle_right = (p.co.x + x1 * dt, p.co.y + y1 * dv)
        q.handle_left = (p.co.x + x2 * dt, p.co.y + y2 * dv)
    fc.update()
    return fc

def fcurves(idb):  # helper da skill atual (para o metodo keyframe_insert)
    ad = idb.animation_data; act = ad.action
    if hasattr(act, 'fcurves'): return act.fcurves
    from bpy_extras import anim_utils
    return anim_utils.action_get_channelbag_for_slot(act, ad.action_slot).fcurves

def anima_skill(obj, path, idx, pts, bez):  # copia do metodo do SKILL.md atual (keyframe_insert + FREE)
    for f, v in pts:
        getattr(obj, path)[idx] = v; obj.keyframe_insert(path, index=idx, frame=f)
    fc = next(c for c in fcurves(obj) if c.data_path == path and c.array_index == idx)
    x1, y1, x2, y2 = bez
    for p, q in zip(fc.keyframe_points[:-1], fc.keyframe_points[1:]):
        p.interpolation = 'BEZIER'; dt, dv = q.co.x - p.co.x, q.co.y - p.co.y
        p.handle_right_type = q.handle_left_type = 'FREE'
        p.handle_right = (p.co.x + x1 * dt, p.co.y + y1 * dv)
        q.handle_left = (p.co.x + x2 * dt, p.co.y + y2 * dv)
    fc.update(); return fc

def assa_mola(idb, path, idx, f0, f1, v0, v1, zeta, resposta, passo=1):
    """Mola assada: uma chave por quadro (Bezier AUTO_CLAMPED). Para overshoot fisico e suave."""
    fn = mola(zeta, resposta); fps = sc.render.fps
    fc = fcurve_de(idb, path, idx); fc.keyframe_points.clear()
    fr = list(range(f0, f1 + 1, passo))
    fc.keyframe_points.add(len(fr))
    for kp, f in zip(fc.keyframe_points, fr):
        kp.co = (f, v0 + (v1 - v0) * fn((f - f0) / fps)); kp.interpolation = 'BEZIER'
        kp.handle_left_type = kp.handle_right_type = 'AUTO_CLAMPED'
    fc.update(); return fc, fn

# ---------------- cena ----------------
def mat(nome, cor, metal, rug, coat=0.0):
    m = bpy.data.materials.new(nome); b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*cor, 1); b.inputs['Metallic'].default_value = metal
    b.inputs['Roughness'].default_value = rug; b.inputs['Coat Weight'].default_value = coat
    b.inputs['Coat Roughness'].default_value = 0.04
    return m

me = bpy.data.meshes.new('Corpo'); bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
for v in bm.verts: v.co.x *= 0.0716; v.co.y *= 0.0083; v.co.z *= 0.1466   # escala real, em pe
for f in bm.faces: f.material_index = 1 if abs(f.normal.y) > 0.9 else 0
bm.to_mesh(me); bm.free()
prod = bpy.data.objects.new('Produto', me); sc.collection.objects.link(prod)
me.materials.append(mat('Aro', (0.55, 0.55, 0.56), 1.0, 0.28))
me.materials.append(mat('Vidro', (0.01, 0.01, 0.012), 0.0, 0.08, coat=1.0))
bv = prod.modifiers.new('Bevel', 'BEVEL'); bv.width = 0.004; bv.segments = 4
for p in me.polygons: p.use_smooth = True

foco = bpy.data.objects.new('Foco', None); sc.collection.objects.link(foco)
pivo = bpy.data.objects.new('Pivo', None); sc.collection.objects.link(pivo)   # orbita = arco, nao reta
camd = bpy.data.cameras.new('Cam'); camd.lens = 85
cam = bpy.data.objects.new('Cam', camd); sc.collection.objects.link(cam); sc.camera = cam
cam.parent = pivo; cam.location = (0, -0.62, 0.03)
tt = cam.constraints.new('TRACK_TO'); tt.target = foco; tt.track_axis = 'TRACK_NEGATIVE_Z'; tt.up_axis = 'UP_Y'

def luz(nome, sx, sy, w, pos):
    ld = bpy.data.lights.new(nome, 'AREA'); ld.shape = 'RECTANGLE'; ld.size, ld.size_y = sx, sy; ld.energy = w
    o = bpy.data.objects.new(nome, ld); o.location = pos; sc.collection.objects.link(o)
    c = o.constraints.new('TRACK_TO'); c.target = foco; c.track_axis = 'TRACK_NEGATIVE_Z'; c.up_axis = 'UP_Y'
luz('Key', 0.5, 0.5, 6, (-0.45, -0.55, 0.35)); luz('Fill', 0.8, 0.8, 1.5, (0.6, -0.4, 0.05))
luz('RimE', 0.04, 0.9, 6, (-0.35, 0.35, 0.10)); luz('RimD', 0.04, 0.9, 6, (0.35, 0.35, 0.10))
w = bpy.data.worlds.new('W'); sc.world = w; w.node_tree.nodes['Background'].inputs['Color'].default_value = (0.02, 0.02, 0.025, 1)

# ---------------- animacao do plano (o que vai para o render) ----------------
R = math.radians
CURVAS = {}   # nome -> (fcurve, f0, f1, v0, v1, funcao alvo de u)
def reg(nome, fc, f0, f1, v0, v1, alvo): CURVAS[nome] = (fc, f0, f1, v0, v1, alvo)

bz_exp = (0.16, 1, 0.3, 1); bz_dolly = (0.65, 0, 0.35, 1); bz_ent = (0.22, 1, 0.36, 1)
bz_drift = (0.3, 0.15, 0.2, 1)   # v2: entra no corte ja andando (vel. inicial 0,5x a media) e desacelera longo
if not args.v2:
    reg('orbita_pivo_rotZ', curva(pivo, 'rotation_euler', 2, [(1, R(-35)), (90, 0.0)], bz_exp), 1, 90, R(-35), 0.0, cubic_bezier(*bz_exp))
else:
    reg('orbita_pivo_rotZ', curva(pivo, 'rotation_euler', 2, [(1, R(-30)), (90, 0.0)], bz_drift), 1, 90, R(-30), 0.0, cubic_bezier(*bz_drift))
reg('dolly_cam_locY', curva(cam, 'location', 1, [(1, -0.62), (90, -0.46)], bz_dolly), 1, 90, -0.62, -0.46, cubic_bezier(*bz_dolly))
if not args.v2:
    fcm, fnm = assa_mola(prod, 'rotation_euler', 2, 1, 90, R(-50), R(15), zeta=0.8, resposta=1.1)
    reg('produto_rotZ_mola', fcm, 1, 90, R(-50), R(15), lambda u: fnm(u * 89 / 30))
else:   # defasado 6 quadros (sobreposicao) e mola mais lenta: a varredura do reflexo dura mais
    fcm, fnm = assa_mola(prod, 'rotation_euler', 2, 7, 90, R(-40), R(15), zeta=0.85, resposta=2.4)
    reg('produto_rotZ_mola', fcm, 7, 90, R(-40), R(15), lambda u: fnm(u * 83 / 30))

# ---------------- canais so de medida (empties fora do render) ----------------
def vazio(n):
    o = bpy.data.objects.new(n, None); sc.collection.objects.link(o); return o
m_ins = vazio('M_insert')     # metodo keyframe_insert da skill atual
reg('skill_keyframe_insert_exp', anima_skill(m_ins, 'location', 0, [(1, 0.0), (90, 1.0)], bz_exp), 1, 90, 0.0, 1.0, cubic_bezier(*bz_exp))
reg('skill_keyframe_insert_dolly', anima_skill(m_ins, 'location', 1, [(1, 0.0), (90, 1.0)], bz_dolly), 1, 90, 0.0, 1.0, cubic_bezier(*bz_dolly))
m_ent = vazio('M_entrada')
reg('entrada_22_1_36_1_em_20q', curva(m_ent, 'location', 0, [(1, 0.0), (21, 1.0)], bz_ent), 1, 21, 0.0, 1.0, cubic_bezier(*bz_ent))

# overshoot por handle com y > 1 (como puxar o handle acima da linha no AE)
over_hand = {}
m_ov = vazio('M_overshoot')
for i, b in enumerate([(0.16, 1.05, 0.3, 1), (0.16, 1.1, 0.3, 1), (0.2, 1.2, 0.3, 1), (0.34, 1.56, 0.64, 1)]):
    fc = curva(m_ov, 'location', i, [(1, 0.0), (31, 1.0)], b)
    reg('overshoot_handle_%s' % '_'.join(str(x) for x in b), fc, 1, 31, 0.0, 1.0, cubic_bezier(*b))
    pico = max(fc.evaluate(1 + k * 0.01) for k in range(3001))
    over_hand[str(b)] = round((pico - 1) * 100, 2)

# overshoot do BACK (interpolacao pronta) para varios 'back'
over_back = {}
m_bk = vazio('M_back')
for i, s in enumerate([0.5, 1.0, 1.70158]):
    fc = fcurve_de(m_bk, 'rotation_euler', i); fc.keyframe_points.add(2)
    a, b = fc.keyframe_points
    a.co, b.co = (1, 0.0), (31, 1.0)
    a.interpolation = 'BACK'; a.easing = 'EASE_OUT'; a.back = s     # na chave de PARTIDA
    fc.update()
    pico = max(fc.evaluate(1 + k * 0.01) for k in range(3001))
    over_back[s] = round((pico - 1) * 100, 2)

# mola: overshoot teorico x razao de amortecimento
over_mola = {z: round(math.exp(-math.pi * z / math.sqrt(1 - z * z)) * 100, 2) for z in (0.6, 0.7, 0.8, 0.9)}

# caminho com 3 chaves (camera passando por um ponto sem parar)
def deriv(fc, f, h=0.5):   # h grande: a f-curve e float32
    v = (fc.evaluate(f + h) - fc.evaluate(f - h)) / (2 * h)
    al = (fc.evaluate(f) - 2 * fc.evaluate(f - h) + fc.evaluate(f - 2 * h)) / (h * h)
    ar = (fc.evaluate(f + 2 * h) - 2 * fc.evaluate(f + h) + fc.evaluate(f)) / (h * h)
    return v, al, ar
tres = {}
m3 = vazio('M_3chaves'); pts3 = [(1, 0.0), (40, 0.7), (90, 1.0)]
fc = curva(m3, 'location', 0, pts3, bz_dolly)
v, al, ar = deriv(fc, 40); tres['cubic_bezier_por_trecho'] = dict(vel_meio=round(v, 4), salto_acel=round(abs(ar - al), 6))
for j, (tipo, suav) in enumerate([('AUTO_CLAMPED', 'NONE'), ('AUTO_CLAMPED', 'CONT_ACCEL'), ('AUTO', 'CONT_ACCEL')]):
    fc = fcurve_de(m3, 'location', j + 1); fc.auto_smoothing = suav; fc.keyframe_points.add(3)
    for kp, (f, val) in zip(fc.keyframe_points, pts3):
        kp.co = (f, val); kp.interpolation = 'BEZIER'; kp.handle_left_type = kp.handle_right_type = tipo
    fc.update()
    v, al, ar = deriv(fc, 40)
    pico = max(fc.evaluate(1 + k * 0.05) for k in range(1781))
    tres['%s+%s' % (tipo, suav)] = dict(vel_meio=round(v, 4), salto_acel=round(abs(ar - al), 6), passa_do_fim=round(max(0, pico - 1) * 100, 3))

# ---------------- comparacao com o alvo ----------------
linhas, resumo = [], {}
for nome, (fc, f0, f1, v0, v1, alvo) in CURVAS.items():
    amp = abs(v1 - v0); e_int = e_sub = 0.0
    for f in range(f0, f1 + 1):
        u = (f - f0) / (f1 - f0); t = v0 + (v1 - v0) * alvo(u); b = fc.evaluate(f)
        e = abs(b - t) / amp; e_int = max(e_int, e)
        linhas.append([nome, f, round(u, 5), round(alvo(u), 6), round((b - v0) / (v1 - v0), 6), '%.2e' % e])
    n = (f1 - f0) * 20
    for k in range(n + 1):
        f = f0 + k / 20; u = (f - f0) / (f1 - f0)
        e_sub = max(e_sub, abs(fc.evaluate(f) - (v0 + (v1 - v0) * alvo(u))) / amp)
    resumo[nome] = dict(erro_max_quadros_pct=round(e_int * 100, 5), erro_max_subquadros_pct=round(e_sub * 100, 5))

# o depsgraph usa mesmo a curva? (frame_set + valor no objeto)
dg = 0.0
fco = CURVAS['orbita_pivo_rotZ'][0]
for f in range(1, 91, 7):
    sc.frame_set(f); dg = max(dg, abs(pivo.rotation_euler[2] - fco.evaluate(f)))
resumo['_depsgraph_vs_evaluate_rad'] = dg
# handles FREE continuam onde foram postos depois do update()?
k0 = fco.keyframe_points[0]
resumo['_handle_free_preservado'] = (k0.handle_right_type, tuple(round(x, 4) for x in k0.handle_right))
resumo['_overshoot_handle_pct'] = over_hand
resumo['_overshoot_BACK_pct'] = over_back
resumo['_overshoot_mola_teorico_pct'] = over_mola
resumo['_mola_produto_pico_graus'] = round(math.degrees(max(fcm.evaluate(1 + k * 0.1) for k in range(891))), 3)
resumo['_tres_chaves_no_quadro_40'] = tres
# varredura: quadros para o angulo relativo produto-camera ir de 10% a 90% da variacao total
rel = [fcm.evaluate(f) - fco.evaluate(f) for f in range(1, 91)]
ini, fim = rel[0], rel[-1]; prog = [(x - ini) / (fim - ini) for x in rel]
q10 = next(i for i, x in enumerate(prog) if x >= 0.1) + 1; q90 = next(i for i, x in enumerate(prog) if x >= 0.9) + 1
resumo['_varredura_rel_graus'] = round(math.degrees(fim - ini), 1)
resumo['_varredura_10_90_quadros'] = [q10, q90, q90 - q10]

with open(args.out + '/curvas.csv', 'w', newline='') as fh:
    wr = csv.writer(fh); wr.writerow(['canal', 'quadro', 'u_tempo', 'alvo_progresso', 'blender_progresso', 'erro_rel'])
    wr.writerows(linhas)
with open(args.out + '/resumo.json', 'w') as fh: json.dump(resumo, fh, indent=1, ensure_ascii=False)
print(json.dumps(resumo, indent=1, ensure_ascii=False))

# ---------------- render de previa ----------------
if args.render:
    for o in list(sc.objects):
        if o.name.startswith('M_'): bpy.data.objects.remove(o)
    r = sc.render; r.engine = 'CYCLES'; sc.cycles.device = 'CPU'
    sc.cycles.samples = args.spp; sc.cycles.use_adaptive_sampling = False
    sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'
    r.use_persistent_data = True
    r.resolution_x, r.resolution_y, r.resolution_percentage = 1080, 1920, args.pct
    r.film_transparent = True
    im = r.image_settings; im.media_type = 'IMAGE'; im.file_format = 'PNG'; im.color_mode = 'RGBA'
    sc.view_settings.view_transform = 'Standard'
    r.use_motion_blur = args.mb; r.motion_blur_shutter = 0.5      # 0,5 quadro = obturador de 180 graus
    sc.frame_step = 3; sc.frame_end = 88                           # 1,4,...,88 = 30 quadros
    r.filepath = '%s/quadros_%s/q_' % (args.out, args.tag)
    tempos = []; t0 = [0]
    bpy.app.handlers.render_pre.append(lambda *_: t0.__setitem__(0, time.perf_counter()))
    bpy.app.handlers.render_post.append(lambda *_: tempos.append(time.perf_counter() - t0[0]))
    ti = time.perf_counter(); bpy.ops.render.render(animation=True); tt = time.perf_counter() - ti
    s = sorted(tempos)
    print('RENDER %s: %d quadros, total %.1f s, mediana %.2f s/quadro, 1o %.2f s' % (args.tag, len(tempos), tt, s[len(s) // 2], tempos[0]))
