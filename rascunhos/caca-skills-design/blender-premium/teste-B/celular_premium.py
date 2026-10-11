# SPDX-License-Identifier: GPL-3.0-or-later
# Teste B (pesquisa "Blender premium"), codigo proprio, Blender 5.2.2 LTS, 11/10/2026.
# Celular GENERICO premium (nenhuma forma de marca) + estudio + materiais + compositor.
# Uso: blender -b --factory-startup -P celular_premium.py -- --out /abs/x.png [--pct 100] [--spp 32]
#        [--view "Khronos PBR Neutral"] [--exp 0] [--vista frente|tras] [--tela tela.png]
#        [--hdri studio.hdr] [--fundo escuro|transparente] [--sem_comp] [--clay]
import bpy, bmesh, sys, math, time, argparse
from mathutils import Vector

a = argparse.ArgumentParser()
a.add_argument('--out', required=True); a.add_argument('--pct', type=int, default=100)
a.add_argument('--spp', type=int, default=32); a.add_argument('--view', default='Khronos PBR Neutral')
a.add_argument('--look', default='None'); a.add_argument('--exp', type=float, default=0.0)
a.add_argument('--vista', default='frente'); a.add_argument('--tela'); a.add_argument('--hdri')
a.add_argument('--fundo', default='escuro'); a.add_argument('--sem_comp', action='store_true')
a.add_argument('--clay', action='store_true', help='tudo cinza fosco: confere so a luz e a forma')
a.add_argument('--brilho_tela', type=float, default=1.0); a.add_argument('--sheen', type=float, default=12.0); a.add_argument('--oidn', default='HIGH')
args = a.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else [])
T0 = time.time()
def log(m): print(f'[premium +{time.time()-T0:6.1f}s] {m}', flush=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene; col = sc.collection

# ================= RENDER =================
r = sc.render; cy = sc.cycles
r.engine = 'CYCLES'; cy.device = 'CPU'
cy.samples = args.spp; cy.use_adaptive_sampling = True; cy.adaptive_threshold = 0.015; cy.adaptive_min_samples = 8
cy.use_denoising = True; cy.denoiser = 'OPENIMAGEDENOISE'
cy.denoising_input_passes = 'RGB_ALBEDO_NORMAL'; cy.denoising_prefilter = 'ACCURATE'; cy.denoising_quality = args.oidn
cy.max_bounces = 8; cy.diffuse_bounces = 2; cy.glossy_bounces = 4; cy.transmission_bounces = 4
cy.transparent_max_bounces = 4; cy.volume_bounces = 0
cy.caustics_reflective = False; cy.caustics_refractive = False
cy.sample_clamp_indirect = 5.0; cy.blur_glossy = 0.5         # corta vaga-lumes sem matar o brilho direto
r.resolution_x, r.resolution_y, r.resolution_percentage = 1080, 1920, args.pct
r.fps = 30
if hasattr(r, 'compositor_device'): r.compositor_device = 'CPU'      # sem isso o -b tenta GPU (libEGL)
r.film_transparent = (args.fundo == 'transparente')
im = r.image_settings; im.media_type = 'IMAGE'; im.file_format = 'PNG'
im.color_mode = 'RGBA' if r.film_transparent else 'RGB'; im.color_depth = '8'
vs = sc.view_settings; vs.view_transform = args.view; vs.look = args.look; vs.exposure = args.exp

# ================= MEDIDAS (metros, celular generico) =================
W, H, D, R = 0.0716, 0.1490, 0.0082, 0.0105   # largura, altura, espessura 8,2 mm, raio do canto
EB = 0.0012                                    # raio da quina lateral do aro (2.5D)
GI = 0.0005                                    # recuo do vidro em relacao a borda do aro

def contorno(w, h, r, seg=20):
    """Retangulo arredondado (canto circular de raio r), sentido anti-horario."""
    pts = []
    for cx, cy_, a0 in ((w/2-r, h/2-r, 0), (-w/2+r, h/2-r, 90), (-w/2+r, -h/2+r, 180), (w/2-r, -h/2+r, 270)):
        for i in range(seg + 1):
            t = math.radians(a0 + 90 * i / seg)
            pts.append((cx + r*math.cos(t), cy_ + r*math.sin(t)))
    return pts

def placa(nome, w, h, r, z0, z1, bev_cima=0.0, bev_baixo=0.0, seg=20, segb=6, uv=False):
    """Prisma de retangulo arredondado com quinas arredondadas (bevel circular) em cima/embaixo."""
    bm = bmesh.new()
    p = contorno(w, h, r, seg)
    vb = [bm.verts.new((x, y, z0)) for x, y in p]; vt = [bm.verts.new((x, y, z1)) for x, y in p]
    n = len(p)
    bm.faces.new(list(reversed(vb))); bm.faces.new(vt)
    for i in range(n):
        j = (i + 1) % n; bm.faces.new((vb[i], vb[j], vt[j], vt[i]))
    bm.normal_update()
    def anel(z): return [e for e in bm.edges if all(abs(v.co.z - z) < 1e-7 for v in e.verts) and len(e.link_faces) == 2
                         and any(len(f.verts) > 4 for f in e.link_faces)]
    if bev_cima: bmesh.ops.bevel(bm, geom=anel(z1), offset=bev_cima, segments=segb, profile=0.5, affect='EDGES', clamp_overlap=True)
    if bev_baixo: bmesh.ops.bevel(bm, geom=anel(z0), offset=bev_baixo, segments=segb, profile=0.5, affect='EDGES', clamp_overlap=True)
    if uv:
        lay = bm.loops.layers.uv.new('UV')
        for f in bm.faces:
            for l in f.loops: l[lay].uv = (l.vert.co.x / w + 0.5, l.vert.co.y / h + 0.5)
    me = bpy.data.meshes.new(nome); bm.to_mesh(me); bm.free()
    for f in me.polygons: f.use_smooth = True
    ob = bpy.data.objects.new(nome, me); col.objects.link(ob)
    return ob

def normais(ob):                                   # faces grandes mandam na normal: sem manchas no plano
    wn = ob.modifiers.new('WN', 'WEIGHTED_NORMAL'); wn.keep_sharp = True; wn.weight = 50; wn.mode = 'FACE_AREA'

def cilindro(nome, raio, z0, z1, x, y, seg=48, bev=0.0, segb=3):
    """Disco/cilindro ao longo de Z; a quina arredondada fica em z0 (o lado de fora, na traseira)."""
    bm = bmesh.new()
    vb = [bm.verts.new((x + raio*math.cos(2*math.pi*i/seg), y + raio*math.sin(2*math.pi*i/seg), z0)) for i in range(seg)]
    vt = [bm.verts.new((v.co.x, v.co.y, z1)) for v in vb]
    bm.faces.new(list(reversed(vb))); bm.faces.new(vt)
    for i in range(seg):
        j = (i + 1) % seg; bm.faces.new((vb[i], vb[j], vt[j], vt[i]))
    bm.normal_update()
    if bev:
        ed = [e for e in bm.edges if all(abs(v.co.z - z0) < 1e-7 for v in e.verts)]
        bmesh.ops.bevel(bm, geom=ed, offset=bev, segments=segb, profile=0.5, affect='EDGES', clamp_overlap=True)
    me = bpy.data.meshes.new(nome); bm.to_mesh(me); bm.free()
    for f in me.polygons: f.use_smooth = True
    ob = bpy.data.objects.new(nome, me); col.objects.link(ob); normais(ob); return ob

# ================= MATERIAIS (Principled BSDF, valores fisicos) =================
def pb(nome, **kw):
    m = bpy.data.materials.new(nome)
    b = m.node_tree.nodes['Principled BSDF']
    for k, v in kw.items(): b.inputs[k].default_value = v
    return m, b

aro, b_aro = pb('AluminioAnodizado', **{'Base Color': (0.80, 0.81, 0.83, 1), 'Metallic': 1.0, 'Roughness': 0.20})
nt = aro.node_tree                                 # microvariacao de rugosidade (jateado/escovado leve)
tc = nt.nodes.new('ShaderNodeTexCoord'); mp = nt.nodes.new('ShaderNodeMapping')
mp.inputs['Scale'].default_value = (900, 6, 900)   # riscos ao longo do comprimento (eixo Y local)
nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 1.0; nz.inputs['Detail'].default_value = 4
mr = nt.nodes.new('ShaderNodeMapRange'); mr.inputs['To Min'].default_value = 0.16; mr.inputs['To Max'].default_value = 0.26
nt.links.new(tc.outputs['Object'], mp.inputs['Vector']); nt.links.new(mp.outputs['Vector'], nz.inputs['Vector'])
nt.links.new(nz.outputs['Fac'], mr.inputs['Value']); nt.links.new(mr.outputs['Result'], b_aro.inputs['Roughness'])

vidro_tras, _ = pb('VidroFosco', **{'Base Color': (0.012, 0.017, 0.028, 1), 'Roughness': 0.30, 'IOR': 1.52})
ilha_m, _ = pb('VidroIlha', **{'Base Color': (0.012, 0.017, 0.028, 1), 'Roughness': 0.06, 'IOR': 1.52})
anel_m, _ = pb('AnelLente', **{'Base Color': (0.30, 0.31, 0.33, 1), 'Metallic': 1.0, 'Roughness': 0.18})   # grafite
lente_m, _ = pb('Lente', **{'Base Color': (0.004, 0.005, 0.009, 1), 'Roughness': 0.02, 'IOR': 1.5,
                           'Thin Film Thickness': 120.0, 'Thin Film IOR': 1.38})   # antirreflexo: so um toque (380 nm deu ciano forte)
interno_m, _ = pb('LenteInterna', **{'Base Color': (0.02, 0.02, 0.025, 1), 'Metallic': 1.0, 'Roughness': 0.35})
flash_m, _ = pb('Flash', **{'Base Color': (0.85, 0.80, 0.62, 1), 'Roughness': 0.35})
plastico_m, _ = pb('PlasticoAntena', **{'Base Color': (0.36, 0.37, 0.39, 1), 'Roughness': 0.55})
furo_m, _ = pb('Furo', **{'Base Color': (0.005, 0.005, 0.005, 1), 'Roughness': 0.7})

tela_m, b_t = pb('VidroTela', **{'Base Color': (0, 0, 0, 1), 'Roughness': 0.035, 'IOR': 1.52,
                                 'Emission Strength': args.brilho_tela})
if args.tela:
    tx = tela_m.node_tree.nodes.new('ShaderNodeTexImage'); tx.image = bpy.data.images.load(args.tela)
    tx.interpolation = 'Cubic'
    uvn = tela_m.node_tree.nodes.new('ShaderNodeUVMap'); uvn.uv_map = 'UV'
    tela_m.node_tree.links.new(uvn.outputs['UV'], tx.inputs['Vector'])
    tela_m.node_tree.links.new(tx.outputs['Color'], b_t.inputs['Emission Color'])
else:
    b_t.inputs['Emission Color'].default_value = (0.05, 0.08, 0.2, 1)

# ================= MODELAGEM =================
log('modelando')
# aro: ocupa quase toda a espessura; vidros frente/tras ficam encaixados 0,3 mm abaixo da face
zf = D/2 - 0.0003
corpo = placa('Aro', W, H, R, -zf, zf, EB, EB, seg=24, segb=8)
corpo.data.materials.append(aro)
# furos: USB-C (estadio 8,4 x 2,6 mm) + 2 grades de alto-falante (6 furos de 1,1 mm) na borda de baixo
bm = bmesh.new()
def furo_bm(x, z, rr, comp, prof=0.004, seg=24):
    """Cilindro (ou estadio se comp>0) ao longo de Y, atravessando a borda de baixo."""
    pts = []
    for i in range(seg):
        t = 2*math.pi*i/seg; dx = (comp/2 if math.cos(t) >= 0 else -comp/2)
        pts.append((x + dx + rr*math.cos(t), z + rr*math.sin(t)))
    y0, y1 = -H/2 - 0.001, -H/2 + prof
    v0 = [bm.verts.new((px, y0, pz)) for px, pz in pts]; v1 = [bm.verts.new((px, y1, pz)) for px, pz in pts]
    bm.faces.new(v0); bm.faces.new(list(reversed(v1)))
    for i in range(seg):
        j = (i+1) % seg; bm.faces.new((v0[j], v0[i], v1[i], v1[j]))
furo_bm(0, 0, 0.0013, 0.0058, prof=0.0035)
for k in range(6):
    furo_bm(0.009 + k*0.0021, 0, 0.00055, 0, prof=0.002, seg=16)
    furo_bm(-0.009 - k*0.0021, 0, 0.00055, 0, prof=0.002, seg=16)
bm.normal_update(); bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
me = bpy.data.meshes.new('Cortador'); bm.to_mesh(me); bm.free()
cort = bpy.data.objects.new('Cortador', me); col.objects.link(cort)
cort.hide_render = True; cort.display_type = 'WIRE'; cort.parent = corpo
bo = corpo.modifiers.new('Furos', 'BOOLEAN'); bo.operation = 'DIFFERENCE'; bo.solver = 'EXACT'; bo.object = cort
normais(corpo)
# fundo escuro dentro dos furos (tampa interna)
tampa = placa('FundoFuros', 0.04, 0.0006, 0.0002, -0.0016, 0.0016); tampa.location.y = -H/2 + 0.0019
tampa.data.materials.append(furo_m); tampa.parent = corpo

# vidro frontal (tela): placa com quina superior arredondada 0,5 mm e UV para a UI
gw, gh, gr = W - 2*GI, H - 2*GI, R - GI
tela = placa('Tela', gw, gh, gr, D/2 - 0.0009, D/2, 0.00045, 0.0, seg=24, segb=6, uv=True)
tela.data.materials.append(tela_m); tela.parent = corpo; normais(tela)
# vidro traseiro fosco
tras = placa('Traseira', gw, gh, gr, -D/2, -D/2 + 0.0009, 0.0, 0.00045, seg=24, segb=6)
tras.data.materials.append(vidro_tras); tras.parent = corpo; normais(tras)

# antenas: 4 faixas de plastico de 0,6 mm que cortam o aro (detalhe de produto real)
for sy in (1, -1):
    for sx in (1, -1):
        f = placa('Antena', 0.0008, 0.0006, 0.0001, -0.0024, 0.0024)
        f.location = (sx*(W/2 - 0.00035), sy*(H/2 - 0.016), 0); f.data.materials.append(plastico_m); f.parent = corpo

# botoes laterais (lado +X): volume (longo) e liga (curto), com quinas arredondadas
def botao(y, comp):
    b = placa('Botao', comp, 0.0024, 0.0011, -0.0007, 0.0007, 0.0004, 0.0004, seg=10, segb=4)
    from mathutils import Matrix
    b.rotation_euler = Matrix(((0, 0, 1), (1, 0, 0), (0, 1, 0))).to_euler()   # comprimento->Y, altura->Z, saliencia->X
    b.location = (W/2 - 0.0002, y, 0); b.data.materials.append(aro); b.parent = corpo; normais(b)
botao(0.040, 0.022); botao(0.014, 0.012)

# ilha da camera (traseira, canto superior; vista de tras fica a esquerda): retangulo arredondado
iw, ih, ir = 0.026, 0.036, 0.0075
ix, iy = W/2 - 0.0065 - iw/2, H/2 - 0.0065 - ih/2
ilha = placa('Ilha', iw, ih, ir, -D/2 - 0.0011, -D/2 + 0.0002, 0.0, 0.0005, seg=16, segb=5)
ilha.location = (ix, iy, 0); ilha.data.materials.append(ilha_m); ilha.parent = corpo; normais(ilha)
zi = -D/2 - 0.0011                                  # face externa da ilha (z negativo = tras)
for k, ly in enumerate((iy + 0.0085, iy - 0.0085)):     # 2 lentes em coluna
    lx = ix - 0.0028
    anel = cilindro('AnelLente', 0.0056, zi - 0.0009, zi + 0.0002, lx, ly, bev=0.0003)        # aro de metal saltado 0,9 mm
    anel.data.materials.append(anel_m); anel.parent = corpo
    vid = cilindro('Lente', 0.0046, zi - 0.00105, zi - 0.0008, lx, ly, bev=0.00012)          # vidro da lente
    vid.data.materials.append(lente_m); vid.parent = corpo
    inn = cilindro('LenteInterna', 0.0021, zi - 0.00115, zi - 0.0010, lx, ly, seg=32, bev=0.00005)
    inn.data.materials.append(interno_m); inn.parent = corpo
fl = cilindro('Flash', 0.0021, zi - 0.0002, zi + 0.0001, ix + 0.0075, iy + 0.0085, seg=32, bev=0.0001)
fl.data.materials.append(flash_m); fl.parent = corpo

if args.clay:
    cm, _ = pb('Clay', **{'Base Color': (0.5, 0.5, 0.5, 1), 'Roughness': 0.5})
    for o in bpy.data.objects:
        if o.type == 'MESH':
            o.data.materials.clear(); o.data.materials.append(cm)

# pose: em pe, tela para -Y (camera), 3/4 com leve inclinacao
prod = bpy.data.objects.new('Produto', None); col.objects.link(prod)
corpo.parent = prod
corpo.rotation_euler = (math.radians(90), 0, 0)
if args.vista == 'tras':
    prod.rotation_euler = (math.radians(-4), 0, math.radians(180 - 32))
else:
    prod.rotation_euler = (math.radians(-6), 0, math.radians(-28))

# ================= LUZ DE ESTUDIO =================
log('luz')
def area(nome, loc, sx, sy, watts, alvo=(0, 0, 0), cor=(1, 1, 1), spread=180):
    L = bpy.data.lights.new(nome, 'AREA'); L.shape = 'RECTANGLE'; L.size, L.size_y = sx, sy
    L.energy = watts; L.color = cor; L.spread = math.radians(spread)
    o = bpy.data.objects.new(nome, L); o.location = loc; col.objects.link(o)
    d = Vector(alvo) - Vector(loc); o.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    return o
# key: softbox grande (0,9 x 0,6 m) a esquerda-frente-alto: desenha o degrade no vidro e no aro
area('Key', (-0.50, -0.35, 0.65), 0.9, 0.6, 26, cor=(1.0, 0.98, 0.95))   # alto: o reflexo dele NAO cai na tela
# fill: cartao grande e fraco do outro lado (razao ~1:6)
area('Fill', (0.65, -0.35, 0.0), 1.0, 1.0, 2.5, cor=(0.95, 0.97, 1.0))
# rims: duas faixas finas (6 x 110 cm) atras, nas laterais: linhas de brilho que mostram a espessura
area('RimE', (-0.32, 0.30, 0.05), 0.06, 1.1, 10, alvo=(0, 0, 0.0))
area('RimD', (0.32, 0.30, 0.05), 0.06, 1.1, 4, alvo=(0, 0, 0.0))
# topo: faixa larga acima (pega a quina de cima e o topo da ilha)
area('Topo', (0.0, 0.05, 0.55), 0.8, 0.25, 5)


# cartao de brilho: plano emissivo com degrade, visivel SO em reflexos (glossy). Faz o "sheen" diagonal na tela.
def cartao(nome, loc, sx, sy, forca, giro=0.0, alvo=(0, 0, 0)):
    bpy.ops.mesh.primitive_plane_add(size=1, location=loc); c = bpy.context.object; c.name = nome
    c.scale = (sx, sy, 1)
    d = Vector(alvo) - Vector(loc); q = d.to_track_quat('Z', 'Y')     # face +Z olhando o produto
    c.rotation_euler = (q.to_matrix().to_4x4() @ __import__('mathutils').Matrix.Rotation(giro, 4, 'Z')).to_euler()
    m = bpy.data.materials.new(nome); t = m.node_tree; t.nodes.clear()
    tc_ = t.nodes.new('ShaderNodeTexCoord'); g = t.nodes.new('ShaderNodeTexGradient')   # linear em X local (0..1)
    mp_ = t.nodes.new('ShaderNodeMapping'); mp_.inputs['Location'].default_value = (0.5, 0, 0)
    mt = t.nodes.new('ShaderNodeMath'); mt.operation = 'POWER'; mt.inputs[1].default_value = 2.0
    e = t.nodes.new('ShaderNodeEmission'); e.inputs['Color'].default_value = (1, 1, 1, 1)
    mul = t.nodes.new('ShaderNodeMath'); mul.operation = 'MULTIPLY'; mul.inputs[1].default_value = forca
    o = t.nodes.new('ShaderNodeOutputMaterial')
    t.links.new(tc_.outputs['Object'], mp_.inputs['Vector']); t.links.new(mp_.outputs['Vector'], g.inputs['Vector'])
    t.links.new(g.outputs['Fac'], mt.inputs[0]); t.links.new(mt.outputs['Value'], mul.inputs[0])
    t.links.new(mul.outputs['Value'], e.inputs['Strength']); t.links.new(e.outputs['Emission'], o.inputs['Surface'])
    c.data.materials.append(m)
    c.visible_camera = False; c.visible_diffuse = False; c.visible_shadow = False; c.visible_transmission = False
    return c

# mundo: HDRI de estudio (Poly Haven, CC0) so para reflexos; a camera ve o fundo, nao o HDRI
w = bpy.data.worlds.new('W'); sc.world = w; wt = w.node_tree; bg = wt.nodes['Background']
if args.hdri:
    env = wt.nodes.new('ShaderNodeTexEnvironment'); env.image = bpy.data.images.load(args.hdri)
    wt.links.new(env.outputs['Color'], bg.inputs['Color']); bg.inputs['Strength'].default_value = 0.18
else:
    bg.inputs['Color'].default_value = (0.01, 0.01, 0.012, 1)

# fundo: placa atras com degrade radial CONTIDO (centro 0,05, bordas ~0,004): nao enche o quadro
if args.fundo == 'escuro':
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0.55, 0.0), rotation=(math.radians(90), 0, 0))
    fd = bpy.context.object; fd.scale = (1.6, 2.4, 1)
    fm = bpy.data.materials.new('Fundo'); fnt = fm.node_tree; fnt.nodes.clear()
    tco = fnt.nodes.new('ShaderNodeTexCoord'); mpp = fnt.nodes.new('ShaderNodeMapping')
    mpp.inputs['Location'].default_value = (0, 0.03, 0)            # centro do brilho um pouco acima
    mpp.inputs['Scale'].default_value = (1/0.22, 1/0.30, 1)        # elipse ~ 0,44 x 0,60 m de raio total
    grd = fnt.nodes.new('ShaderNodeTexGradient'); grd.gradient_type = 'SPHERICAL'
    rmp = fnt.nodes.new('ShaderNodeValToRGB'); rmp.color_ramp.interpolation = 'EASE'
    rmp.color_ramp.elements[0].position = 0.0; rmp.color_ramp.elements[0].color = (0.004, 0.0045, 0.006, 1)
    rmp.color_ramp.elements[1].position = 1.0; rmp.color_ramp.elements[1].color = (0.085, 0.095, 0.125, 1)
    em = fnt.nodes.new('ShaderNodeEmission'); outm = fnt.nodes.new('ShaderNodeOutputMaterial')
    fnt.links.new(tco.outputs['Object'], mpp.inputs['Vector']); fnt.links.new(mpp.outputs['Vector'], grd.inputs['Vector'])
    fnt.links.new(grd.outputs['Fac'], rmp.inputs['Fac']); fnt.links.new(rmp.outputs['Color'], em.inputs['Color'])
    fnt.links.new(em.outputs['Emission'], outm.inputs['Surface'])
    # o Object coord do plano vai de -0,5 a 0,5: corrige a escala do objeto no mapping
    mpp.inputs['Scale'].default_value = (1.6/0.22, 2.4/0.30, 1)
    fd.data.materials.append(fm)

# ================= CAMERA =================
cd = bpy.data.cameras.new('Cam'); cd.lens = 85; cd.sensor_width = 36
cam = bpy.data.objects.new('Cam', cd); col.objects.link(cam); sc.camera = cam
cam.location = (0.0, -0.56, 0.035)
alvo = Vector((0, 0, 0.002)); cam.rotation_euler = (alvo - cam.location).to_track_quat('-Z', 'Y').to_euler()
cd.dof.use_dof = True; cd.dof.focus_distance = (alvo - cam.location).length; cd.dof.aperture_fstop = 8.0


# sheen: poe o cartao exatamente onde o canto superior esquerdo da tela "enxerga" (reflexo do raio da camera)
bpy.context.view_layer.update(); SHEEN = args.sheen
mw = corpo.matrix_world
p_tela = mw @ Vector((-W*0.22, H*0.28, D/2))
n_tela = (mw.to_3x3() @ Vector((0, 0, 1))).normalized()
dv = (p_tela - cam.location).normalized(); rv = dv - 2*dv.dot(n_tela)*n_tela
cartao('Sheen', tuple(p_tela + rv*0.45), 0.22, 0.60, SHEEN, giro=math.radians(30), alvo=tuple(p_tela))
log(f'sheen em {tuple(round(v,3) for v in p_tela + rv*0.45)}')

# ================= COMPOSITOR (5.x: grupo de nos) =================
if not args.sem_comp:
    tr = bpy.data.node_groups.new('Comp', 'CompositorNodeTree'); sc.compositing_node_group = tr
    tr.interface.new_socket(name='Image', in_out='OUTPUT', socket_type='NodeSocketColor')
    rl = tr.nodes.new('CompositorNodeRLayers'); go = tr.nodes.new('NodeGroupOutput')
    gl = tr.nodes.new('CompositorNodeGlare')
    gl.inputs['Type'].default_value = 'Bloom'; gl.inputs['Quality'].default_value = 'High'
    gl.inputs['Threshold'].default_value = 0.85; gl.inputs['Strength'].default_value = 0.18; gl.inputs['Size'].default_value = 0.55
    ld = tr.nodes.new('CompositorNodeLensdist'); ld.inputs['Dispersion'].default_value = 0.006
    tr.links.new(rl.outputs['Image'], gl.inputs['Image']); tr.links.new(gl.outputs['Image'], ld.inputs['Image'])
    ultimo = ld.outputs['Image']
    if not r.film_transparent:                     # vinheta so quando o fundo e do Blender
        el = tr.nodes.new('CompositorNodeEllipseMask')
        el.inputs['Size'].default_value = (0.95, 0.80)
        bl = tr.nodes.new('CompositorNodeBlur'); bl.inputs['Size'].default_value = (300, 300)
        tr.links.new(el.outputs['Mask'], bl.inputs['Image'])
        mx = tr.nodes.new('ShaderNodeMix'); mx.data_type = 'RGBA'; mx.blend_type = 'MULTIPLY'
        mx.inputs['Factor'].default_value = 1.0
        # vinheta leve: borda escurece ~25% (mapa 0,75..1)
        mr2 = tr.nodes.new('ShaderNodeMapRange'); mr2.inputs['To Min'].default_value = 0.75
        tr.links.new(bl.outputs['Image'], mr2.inputs['Value'])
        tr.links.new(ultimo, mx.inputs['A']); tr.links.new(mr2.outputs['Result'], mx.inputs['B'])
        ultimo = mx.outputs['Result']
    tr.links.new(ultimo, go.inputs['Image'])

# ================= TEMPO =================
tt = {}
bpy.app.handlers.render_pre.append(lambda *_: tt.__setitem__('a', time.time()))
bpy.app.handlers.render_post.append(lambda *_: log(f'render {time.time()-tt["a"]:.1f}s'))
r.filepath = args.out
dg = bpy.context.evaluated_depsgraph_get(); ev = corpo.evaluated_get(dg)
log(f'aro: {len(corpo.data.polygons)} faces na base -> {len(ev.data.polygons)} com furos (boolean)')
log(f'cena pronta; {args.pct}% {args.spp} spp, view={args.view}')
bpy.ops.render.render(write_still=True)
log('fim')
