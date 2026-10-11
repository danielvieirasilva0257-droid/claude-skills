# Receita B: celular generico + luz de estudio + camera com easing igual ao Remotion
# + render PNG RGBA (fundo transparente) + JSON com a caixa 2D do celular por quadro.
# Uso: blender -b --factory-startup -P receita_produto.py -- \
#        --out /abs/frames/phone_ --pct 50 --spp 16 --frames 1-90 [--mb] [--dof] \
#        [--hdri studio.hdr] [--screen tela.png] [--sombra] [--turntable] [--view Standard] [--so 1,30,60]
import bpy, bmesh, sys, math, json, argparse
from mathutils import Vector

a = argparse.ArgumentParser()
a.add_argument('--out', required=True); a.add_argument('--pct', type=int, default=100)
a.add_argument('--spp', type=int, default=16); a.add_argument('--frames', default='1-90')
a.add_argument('--mb', action='store_true'); a.add_argument('--dof', action='store_true')
a.add_argument('--hdri'); a.add_argument('--screen'); a.add_argument('--sombra', action='store_true')
a.add_argument('--turntable', action='store_true'); a.add_argument('--view', default='Standard')
a.add_argument('--so', help='so estes quadros, ex. 1,30,60 (rascunho)')
a.add_argument('--so_sombra', action='store_true', help='camada so com a sombra (vai abaixo dos textos)')
args = a.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else [])

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
f0, f1 = map(int, args.frames.split('-'))

# ---------- render: Cycles CPU, 30 fps, 1080x1920, PNG RGBA ----------
r = sc.render
r.engine = 'CYCLES'; sc.cycles.device = 'CPU'
sc.cycles.samples = args.spp; sc.cycles.use_adaptive_sampling = True
sc.cycles.adaptive_threshold = 0.02
sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'
sc.cycles.max_bounces = 6; sc.cycles.transmission_bounces = 6
r.use_persistent_data = True
r.fps, r.fps_base = 30, 1.0                      # igual a composicao do Remotion
r.resolution_x, r.resolution_y, r.resolution_percentage = 1080, 1920, args.pct
r.film_transparent = True                       # fundo vem do Remotion
im = r.image_settings
im.media_type = 'IMAGE'                         # 5.x: antes de file_format
im.file_format = 'PNG'; im.color_mode = 'RGBA'; im.color_depth = '8'; im.compression = 15
sc.view_settings.view_transform = args.view     # Standard = cores da UI exatas
sc.view_settings.look = 'None'
r.use_motion_blur = args.mb; r.motion_blur_shutter = 0.5   # 180 graus
sc.frame_start, sc.frame_end = f0, f1
r.filepath = args.out                           # Blender acrescenta 0001.png

# ---------- mundo: HDRI de estudio (Poly Haven CC0) so para reflexos ----------
w = bpy.data.worlds.new('W'); sc.world = w
nt = w.node_tree; bg = nt.nodes['Background']
if args.hdri:
    env = nt.nodes.new('ShaderNodeTexEnvironment'); env.image = bpy.data.images.load(args.hdri)
    nt.links.new(env.outputs['Color'], bg.inputs['Color']); bg.inputs['Strength'].default_value = 0.25
else:
    bg.inputs['Color'].default_value = (0.02, 0.02, 0.025, 1)

# ---------- celular generico em escala real (metros) ----------
W, H, D, R = 0.0716, 0.1466, 0.0083, 0.011     # largura, altura, espessura, raio do canto
def caixa_redonda(nome, w, h, d, raio):          # retangulo arredondado extrudado
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=(w, h, d), verts=bm.verts)
    vert = [e for e in bm.edges if abs(e.verts[0].co.z - e.verts[1].co.z) > d / 2]
    bmesh.ops.bevel(bm, geom=vert, offset=raio, segments=12, affect='EDGES', profile=0.5)
    me = bpy.data.meshes.new(nome); bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth = True
    ob = bpy.data.objects.new(nome, me); sc.collection.objects.link(ob); return ob
corpo = caixa_redonda('Corpo', W, H, D, R)
bv = corpo.modifiers.new('Quina', 'BEVEL'); bv.width = 0.0015; bv.segments = 4
bv.limit_method = 'ANGLE'; bv.harden_normals = True

def pbsdf(nome, **kw):
    m = bpy.data.materials.new(nome); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    for k, v in kw.items(): b.inputs[k].default_value = v
    return m, b
aro, _ = pbsdf('Titanio', **{'Base Color': (0.55, 0.55, 0.57, 1), 'Metallic': 1.0, 'Roughness': 0.28})
vidro, _ = pbsdf('VidroTraseiro', **{'Base Color': (0.015, 0.015, 0.02, 1), 'Roughness': 0.35,
                 'Coat Weight': 1.0, 'Coat Roughness': 0.04})
corpo.data.materials.append(aro); corpo.data.materials.append(vidro)
for p in corpo.data.polygons:                    # frente/tras = vidro; laterais = metal
    p.material_index = 1 if abs(p.normal.z) > 0.9 else 0

# tela: Principled preto brilhante + emissao da UI (reflexo do estudio por cima)
tela = caixa_redonda('Tela', W - 0.004, H - 0.004, 0.0002, R - 0.002)
tela.location.z = D / 2 + 0.0001; tela.parent = corpo
mt, b = pbsdf('Tela', **{'Base Color': (0, 0, 0, 1), 'Roughness': 0.05, 'Specular IOR Level': 0.3,
                         'Emission Strength': 1.0})
if args.screen:
    tx = mt.node_tree.nodes.new('ShaderNodeTexImage'); tx.image = bpy.data.images.load(args.screen)
    tc = mt.node_tree.nodes.new('ShaderNodeTexCoord')      # 'Generated' = caixa 0..1, sem UV
    mt.node_tree.links.new(tc.outputs['Generated'], tx.inputs['Vector'])
    # sequencia do Remotion: tx.image.source='SEQUENCE'; tx.image_user.frame_duration=N;
    # tx.image_user.use_auto_refresh=True
    mt.node_tree.links.new(tx.outputs['Color'], b.inputs['Emission Color'])
else:
    b.inputs['Emission Color'].default_value = (0.2, 0.35, 0.9, 1)
tela.data.materials.append(mt)

prod = bpy.data.objects.new('Produto', None); sc.collection.objects.link(prod)
corpo.parent = prod
corpo.rotation_euler = (math.radians(90), 0, 0)    # em pe, tela para -Y (camera)

# ---------- luz de estudio: key softbox, fill, dois rims em faixa, topo ----------
def area(nome, loc, size, sy, watts, alvo=(0, 0, 0)):
    L = bpy.data.lights.new(nome, 'AREA'); L.shape = 'RECTANGLE'
    L.size, L.size_y, L.energy = size, sy, watts
    o = bpy.data.objects.new(nome, L); o.location = loc; sc.collection.objects.link(o)
    t = o.constraints.new('TRACK_TO'); e = bpy.data.objects.new(nome + '_alvo', None)
    e.location = alvo; sc.collection.objects.link(e); t.target = e
    return o
area('Key', (-0.45, -0.55, 0.35), 0.5, 0.5, 6)
area('Fill', (0.6, -0.4, 0.05), 0.8, 0.8, 1.5)
area('RimE', (-0.35, 0.35, 0.10), 0.04, 0.9, 6)    # faixas finas = linhas de brilho no aro
area('RimD', (0.35, 0.35, 0.10), 0.04, 0.9, 6)
area('Topo', (0, 0, 0.7), 1.0, 1.0, 3)

if args.sombra:                                    # sombra de contato sobre o fundo do Remotion
    bpy.ops.mesh.primitive_plane_add(size=2, location=(0, 0, -H / 2 - 0.002))
    bpy.context.object.is_shadow_catcher = True
if args.so_sombra:                                 # celular invisivel a camera, mas faz sombra
    for o in (corpo, tela): o.visible_camera = False

# ---------- camera 85 mm, DOF fisico, alvo comum ----------
cd = bpy.data.cameras.new('Cam'); cd.lens = 85; cd.sensor_width = 36
cam = bpy.data.objects.new('Cam', cd); sc.collection.objects.link(cam); sc.camera = cam
foco = bpy.data.objects.new('Foco', None); sc.collection.objects.link(foco)
tt = cam.constraints.new('TRACK_TO'); tt.target = foco
cd.dof.use_dof = args.dof; cd.dof.focus_object = foco; cd.dof.aperture_fstop = 2.8

# ---------- easing: mesma curva cubic-bezier do Remotion (Easing.bezier) ----------
def fcurves(idb):
    ad = idb.animation_data; act = ad.action
    if hasattr(act, 'fcurves'): return act.fcurves      # Blender <= 4.x
    from bpy_extras import anim_utils                   # 5.x: action em camadas/slots
    return anim_utils.action_get_channelbag_for_slot(act, ad.action_slot).fcurves

def anima(obj, path, idx, pts, bez=(0.16, 1, 0.3, 1)):
    """pts = [(quadro, valor), ...]; bez = (x1,y1,x2,y2) como no CSS/Remotion."""
    for f, v in pts:
        getattr(obj, path)[idx] = v; obj.keyframe_insert(path, index=idx, frame=f)
    fc = next(c for c in fcurves(obj) if c.data_path == path and c.array_index == idx)
    k = fc.keyframe_points; x1, y1, x2, y2 = bez
    for p, q in zip(k[:-1], k[1:]):
        p.interpolation = 'BEZIER'; dt, dv = q.co.x - p.co.x, q.co.y - p.co.y
        p.handle_right_type = q.handle_left_type = 'FREE'
        p.handle_right = (p.co.x + x1 * dt, p.co.y + y1 * dv)
        q.handle_left = (p.co.x + x2 * dt, p.co.y + y2 * dv)
    fc.update(); return fc

cam.location = (0, -0.75, 0.05)
if args.turntable:                                   # giro continuo, loop perfeito
    fc = anima(prod, 'rotation_euler', 2, [(f0, 0), (f1 + 1, 2 * math.pi)])
    for kp in fc.keyframe_points: kp.interpolation = 'LINEAR'
    fc.extrapolation = 'LINEAR'
else:                                                # revelacao: gira e para, camera aproxima
    anima(prod, 'rotation_euler', 2, [(f0, math.radians(-40)), (f0 + 54, math.radians(18))])
    anima(prod, 'rotation_euler', 0, [(f0, math.radians(12)), (f0 + 54, 0)])
    anima(cam, 'location', 1, [(f0, -0.80), (f1, -0.55)], bez=(0.65, 0, 0.35, 1))

# ---------- JSON: caixa 2D do celular por quadro (ancorar textos no Remotion) ----------
from bpy_extras.object_utils import world_to_camera_view
rx, ry = r.resolution_x, r.resolution_y
caixas = []
for f in range(f0, f1 + 1):
    sc.frame_set(f)
    pts = [world_to_camera_view(sc, cam, corpo.matrix_world @ Vector(c)) for c in corpo.bound_box]
    xs = [p.x * rx for p in pts]; ys = [(1 - p.y) * ry for p in pts]
    caixas.append({'f': f - f0, 'x0': min(xs), 'y0': min(ys), 'x1': max(xs), 'y1': max(ys)})
with open(args.out + 'caixas.json', 'w') as fh: json.dump(caixas, fh)

if args.so:                                          # rascunho: quadros soltos
    for f in map(int, args.so.split(',')):
        sc.frame_set(f); r.filepath = f'{args.out}{f:04d}'
        bpy.ops.render.render(write_still=True)
else:
    bpy.ops.render.render(animation=True)
