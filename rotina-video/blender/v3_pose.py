# SPDX-License-Identifier: GPL-3.0-or-later
# Rotina v3/v4/v5: aplica a coreografia do video (poses.json, gerado pelo src/v3/rig.ts) ao celular da cena base
# do premium.py (skill blender-ia) e renderiza a camada 3D com fundo transparente para o Remotion.
# A camera e fixa e igual a projecao do rig.ts: os textos e cartoes do Remotion caem no lugar certo da tela.
#
# Uso: blender -b base_cena.blend -P v3_pose.py -- --poses poses.json --out /abs/celular/c_ [--frames a-b | --so 1,2]
#        [--pct 100] [--spp 12] [--mb] [--tela /abs/tela/element-001.jpeg] [--fstop 0] [--checar]
import bpy, sys, os, json, math, time, argparse
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

a = argparse.ArgumentParser()
a.add_argument('--poses', required=True); a.add_argument('--out', required=True)
a.add_argument('--frames'); a.add_argument('--so')
a.add_argument('--pct', type=int, default=100); a.add_argument('--spp', type=int, default=12)
a.add_argument('--mb', action='store_true'); a.add_argument('--fstop', type=float, default=0.0)
a.add_argument('--tela', help='primeiro arquivo da sequencia da UI (numerada pelo quadro do Remotion)')
a.add_argument('--checar', action='store_true', help='grava <out>checar.json com os cantos da tela projetados')
a.add_argument('--borda', action='store_true', help='renderiza so a regiao do celular em cada quadro (mesmo PNG cheio, fundo transparente)')
args = a.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else [])
os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
T0 = time.time()
def log(m): print(f'[v3_pose +{time.time() - T0:6.1f}s] {m}', flush=True)

P = json.load(open(args.poses))
sc = bpy.context.scene; r = sc.render; cy = sc.cycles
cy.samples = args.spp; cy.adaptive_min_samples = min(8, args.spp)
# resolucao: a do poses.json (v5: 1920 x 1080); sem ela, a da cena base (1080 x 1920, v3/v4)
W = int(P['cam'].get('w', r.resolution_x)); H = int(P['cam'].get('h', r.resolution_y))
r.resolution_x, r.resolution_y = W, H
r.resolution_percentage = args.pct
r.use_motion_blur = args.mb; r.motion_blur_shutter = 0.5

# 1) limpa a animacao e os vinculos do premium.py
for ob in bpy.data.objects:
    ob.animation_data_clear()
    for c in list(ob.constraints): ob.constraints.remove(c)
prod = bpy.data.objects['Produto']; cam = sc.camera
corpo = next(o for o in bpy.data.objects if o.parent == prod and o.type == 'MESH' and o.name.startswith('Aro'))

# 2) camera fixa: (0, -d, 0) olhando +Y, FOV vertical do rig
cam.parent = None
cam.location = (0.0, -P['cam']['d'], 0.0); cam.rotation_euler = (math.radians(90), 0.0, 0.0)
cd = cam.data; cd.sensor_fit = 'VERTICAL'; cd.sensor_height = 36.0
cd.lens = (cd.sensor_height / 2) / math.tan(math.radians(P['cam']['fovy']) / 2)
cd.shift_x = cd.shift_y = 0.0
cd.dof.use_dof = args.fstop > 0; cd.dof.focus_object = prod; cd.dof.aperture_fstop = args.fstop or 8.0

# 3) uma chave por quadro, interpolacao linear (o motion blur le os subquadros entre as chaves)
vis = {}
for p in P['frames']:
    f = p['f']; vis[f] = p.get('vis', 1)
    prod.location = (p['x'], p['y'], p['z']); prod.rotation_euler = (p['rx'], p['ry'], p['rz'])
    prod.keyframe_insert('location', frame=f); prod.keyframe_insert('rotation_euler', frame=f)
def fcurves(act):
    if getattr(act, 'layers', None):
        for L in act.layers:
            for s in L.strips:
                for cb in s.channelbags: yield from cb.fcurves
    else:
        yield from act.fcurves
for fc in fcurves(prod.animation_data.action):
    for kp in fc.keyframe_points: kp.interpolation = 'LINEAR'
log(f"{len(P['frames'])} poses; camera d={P['cam']['d']} m, fov {P['cam']['fovy']} graus, lente {cd.lens:.2f} mm")

# 4) UI da tela: sequencia do Remotion, o numero do arquivo = quadro do video
if args.tela:
    m = bpy.data.materials['VidroTela']; tx = next(n for n in m.node_tree.nodes if n.type == 'TEX_IMAGE')
    img = bpy.data.images.load(args.tela); img.source = 'SEQUENCE'; tx.image = img
    iu = tx.image_user; iu.frame_start = 1; iu.frame_offset = 0; iu.frame_duration = 10000; iu.use_auto_refresh = True
    iu.use_cyclic = False
    log(f'UI: {args.tela} ({img.size[0]}x{img.size[1]})')

# 5) checagem: cantos da area ativa projetados pela camera do Blender
AX, AY, D = 0.0716 / 2 - 0.0005 - 0.0013, 0.1490 / 2 - 0.0005 - 0.0013, 0.0082
def cantos(f):
    sc.frame_set(f); mw = corpo.matrix_world; out = []
    for u, v in ((0, 0), (1, 0), (1, 1), (0, 1), (0.5, 0.5)):
        w = mw @ Vector(((u - 0.5) * 2 * AX, (0.5 - v) * 2 * AY, D / 2))
        c = world_to_camera_view(sc, cam, w); out.append([round(c.x * W, 1), round((1 - c.y) * H, 1)])
    return out

fr = sorted(vis)
if args.so: lista = [int(x) for x in args.so.split(',')]
elif args.frames: f0, f1 = map(int, args.frames.split('-')); lista = [f for f in fr if f0 <= f <= f1 and vis[f]]
else: lista = [f for f in fr if vis[f]]
if args.checar:
    json.dump({str(f): cantos(f) for f in lista}, open(args.out + 'checar.json', 'w'))
    log('checar.json gravado')

t_ini = [0.0]
bpy.app.handlers.render_pre.append(lambda *_: t_ini.__setitem__(0, time.time()))
bpy.app.handlers.render_post.append(lambda *_: log(f'quadro {sc.frame_current}: {time.time() - t_ini[0]:.1f} s'))
# trechos continuos renderizados como animacao (dados persistentes entre quadros)
trechos, ini = [], None
for i, f in enumerate(lista):
    if ini is None: ini = f
    if i == len(lista) - 1 or lista[i + 1] != f + 1: trechos.append((ini, f)); ini = None
log(f'render {len(lista)} quadros em {len(trechos)} trechos, {args.pct}%, {args.spp} amostras, mb={args.mb}')
pecas = [o for o in bpy.data.objects if o.type == 'MESH' and o.visible_camera and (o.parent == prod or (o.parent and o.parent.parent == prod))]
def borda(f):
    # caixa do celular projetada em f - 0,5, f e f + 0,5 (motion blur), com folga para reflexo e antisserrilhado
    xs, ys = [], []
    for sub in (-0.5, 0.0, 0.5):
        sc.frame_set(f, subframe=0.5 + sub) if sub < 0 else sc.frame_set(f, subframe=sub) if sub > 0 else sc.frame_set(f)
        if sub < 0: sc.frame_set(f - 1, subframe=0.5)
        for o in pecas:
            for c in o.bound_box:
                v = world_to_camera_view(sc, cam, o.matrix_world @ Vector(c)); xs.append(v.x); ys.append(v.y)
    sc.frame_set(f)
    pad = 0.03
    return max(0.0, min(xs) - pad), min(1.0, max(xs) + pad), max(0.0, min(ys) - pad * W / H), min(1.0, max(ys) + pad * W / H)
if args.borda:
    r.use_border = True; r.use_crop_to_border = False
    for f in lista:
        x0, x1, y0, y1 = borda(f)
        if x1 <= x0 or y1 <= y0: continue
        r.border_min_x, r.border_max_x, r.border_min_y, r.border_max_y = x0, x1, y0, y1
        sc.frame_set(f); r.filepath = f'{args.out}{f:04d}'
        bpy.ops.render.render(write_still=True)
else:
    for f0, f1 in trechos:
        sc.frame_start, sc.frame_end = f0, f1; r.filepath = args.out
        bpy.ops.render.render(animation=True)
log('fim')
