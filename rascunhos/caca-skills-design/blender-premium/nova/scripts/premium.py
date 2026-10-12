# SPDX-License-Identifier: GPL-3.0-or-later
# Skill blender-ia (claude-skills). Codigo proprio, escrito e testado no Blender 5.2.2 LTS em 11 e 12/10/2026.
# Scripts que usam a API do Blender, quando publicados, precisam de licenca compativel com a GPL
# (https://www.blender.org/about/license/). Texto da licenca: LICENSE nesta pasta.
#
# PLANO-HEROI PREMIUM. Junta tres pecas testadas:
#   - celular generico detalhado + estudio de anuncio + materiais (pesquisa B, celular_premium.py);
#   - direcao de animacao medida: orbita em arco, push-in, mola defasada (pesquisa A, curvas_premium.py);
#   - integracao com o Remotion: PNG RGBA, sombra em camada, caixas.json (produto.py da skill).
# Sai tambem <prefixo>qa.json: vmax, overshoot, paradas e varredura do reflexo (QA das curvas antes da folha).
#
# Uso: blender -b --factory-startup -P premium.py -- --out /abs/frames/heroi_ [opcoes]
#   --anim heroi|turntable|parado  heroi = revelacao (padrao); turntable = giro em loop; parado = still
#   --frames 1-90  --so 1,45,90  --pct 100  --spp 16  --oidn BALANCED|HIGH|FAST  --mb  --fstop 8 (0 = sem DOF)
#   --tela ui.png [--tela_seq 90]  UI na proporcao da area ativa (1080x2309); borda, cantos e furo vem do shader
#   --hdri studio_small_09_1k.hdr  --fundo transparente|escuro  --sombra  --so_sombra  --comp  --clay
#   --salvar (grava a cena .blend)  --vista frente|tras  --view "Khronos PBR Neutral"  --exp 0  --sheen 12  --volta 210  --resposta 0  --fps 30
import bpy, bmesh, sys, os, math, json, time, argparse
from mathutils import Vector, Matrix
from bpy_extras.object_utils import world_to_camera_view

a = argparse.ArgumentParser()
a.add_argument('--out', required=True)
a.add_argument('--anim', default='heroi', choices=['heroi', 'turntable', 'parado'])
a.add_argument('--frames', default='1-90'); a.add_argument('--so', help='so estes quadros, ex. 1,45,90 (rascunho)')
a.add_argument('--pct', type=int, default=100); a.add_argument('--spp', type=int, default=16)
a.add_argument('--oidn', default='BALANCED'); a.add_argument('--mb', action='store_true')
a.add_argument('--fstop', type=float, default=8.0, help='0 = sem desfoque')
a.add_argument('--tela'); a.add_argument('--tela_seq', type=int, default=0)
a.add_argument('--brilho_tela', type=float, default=1.0)
a.add_argument('--hdri'); a.add_argument('--fundo', default='transparente', choices=['transparente', 'escuro'])
a.add_argument('--sombra', action='store_true'); a.add_argument('--so_sombra', action='store_true')
a.add_argument('--comp', action='store_true', help='glare + aberracao cromatica (+ vinheta com fundo escuro)')
a.add_argument('--clay', action='store_true', help='tudo cinza fosco: confere so a luz e a forma')
a.add_argument('--vista', default='frente', choices=['frente', 'tras'])
a.add_argument('--view', default='Khronos PBR Neutral'); a.add_argument('--exp', type=float, default=0.0)
a.add_argument('--sheen', type=float, default=12.0)
a.add_argument('--volta', type=int, default=210, help='turntable: quadros por volta (210 = 7 s)')
a.add_argument('--resposta', type=float, default=0.0, help='heroi: response da mola em s (0 = automatico)')
a.add_argument('--fps', type=int, default=30)
a.add_argument('--salvar', action='store_true', help='grava <out>cena.blend (para o verifica_curvas.py)')
args = a.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else [])
os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
T0 = time.time()
def log(m): print(f'[premium +{time.time() - T0:6.1f}s] {m}', flush=True)
R = math.radians

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene; col = sc.collection
f0, f1 = map(int, args.frames.split('-'))
sc.frame_start, sc.frame_end = f0, f1

# ================= RENDER: Cycles CPU, 30 fps, 1080x1920 =================
r = sc.render; cy = sc.cycles
r.engine = 'CYCLES'; cy.device = 'CPU'
cy.samples = args.spp; cy.use_adaptive_sampling = True
cy.adaptive_threshold = 0.015; cy.adaptive_min_samples = min(8, args.spp)
cy.use_denoising = True; cy.denoiser = 'OPENIMAGEDENOISE'
cy.denoising_input_passes = 'RGB_ALBEDO_NORMAL'; cy.denoising_prefilter = 'ACCURATE'
cy.denoising_quality = args.oidn                     # BALANCED: ~6 s/quadro a menos que HIGH, diferenca invisivel
cy.max_bounces = 8; cy.diffuse_bounces = 2; cy.glossy_bounces = 4; cy.transmission_bounces = 4
cy.transparent_max_bounces = 4; cy.volume_bounces = 0
cy.caustics_reflective = cy.caustics_refractive = False
cy.sample_clamp_indirect = 5.0; cy.blur_glossy = 0.5  # corta vaga-lumes sem matar o brilho direto
r.use_persistent_data = True
r.fps, r.fps_base = args.fps, 1.0                    # igual a composicao do Remotion (defina ANTES de assar molas)
r.resolution_x, r.resolution_y, r.resolution_percentage = 1080, 1920, args.pct
if hasattr(r, 'compositor_device'): r.compositor_device = 'CPU'   # sem isso o -b tenta GPU (libEGL)
r.film_transparent = (args.fundo == 'transparente')
im = r.image_settings
im.media_type = 'IMAGE'                              # 5.x: antes de file_format
im.file_format = 'PNG'; im.color_mode = 'RGBA' if r.film_transparent else 'RGB'
im.color_depth = '8'; im.compression = 15
vs = sc.view_settings; vs.view_transform = args.view; vs.look = 'None'
vs.exposure = args.exp                               # brilho geral aqui, nunca escalando as lampadas
r.use_motion_blur = args.mb; r.motion_blur_shutter = 0.5    # 0,5 quadro = 180 graus

# ================= MEDIDAS (metros, celular generico) =================
W, H, D, RAIO = 0.0716, 0.1490, 0.0082, 0.0105   # largura, altura, espessura 8,2 mm, raio do canto
EB = 0.0012                                       # quina lateral do aro (2.5D)
GI = 0.0005                                       # recuo do vidro em relacao a borda do aro
GW, GH = W - 2 * GI, H - 2 * GI                   # vidro frontal 70,6 x 148 mm
BZ, RC = 0.0013, 0.0092                           # borda preta e raio da area ativa da tela
AX, AY = GW / 2 - BZ, GH / 2 - BZ                 # meia largura/altura da area ativa (68 x 145,4 mm)
log(f'UI da tela: proporcao {AX / AY:.4f} -> 1080x{round(1080 * AY / AX)} px')

def contorno(w, h, r_, seg=20):
    """Retangulo arredondado (canto circular de raio r_), sentido anti-horario."""
    pts = []
    for cx, cy_, a0 in ((w/2 - r_, h/2 - r_, 0), (-w/2 + r_, h/2 - r_, 90), (-w/2 + r_, -h/2 + r_, 180), (w/2 - r_, -h/2 + r_, 270)):
        for i in range(seg + 1):
            t = R(a0 + 90 * i / seg); pts.append((cx + r_ * math.cos(t), cy_ + r_ * math.sin(t)))
    return pts

def placa(nome, w, h, r_, z0, z1, bev_cima=0.0, bev_baixo=0.0, seg=20, segb=6, uv=False):
    """Prisma de retangulo arredondado com quinas arredondadas (bevel circular) em cima/embaixo."""
    bm = bmesh.new(); p = contorno(w, h, r_, seg)
    vb = [bm.verts.new((x, y, z0)) for x, y in p]; vt = [bm.verts.new((x, y, z1)) for x, y in p]
    n = len(p)
    bm.faces.new(list(reversed(vb))); bm.faces.new(vt)
    for i in range(n):
        j = (i + 1) % n; bm.faces.new((vb[i], vb[j], vt[j], vt[i]))
    bm.normal_update()
    def anel(z): return [e for e in bm.edges if all(abs(v.co.z - z) < 1e-7 for v in e.verts) and len(e.link_faces) == 2
                         and any(len(f.verts) > 4 for f in e.link_faces)]
    # bmesh.ops.bevel: passe SEMPRE segments e profile (o padrao e 0/0)
    if bev_cima: bmesh.ops.bevel(bm, geom=anel(z1), offset=bev_cima, segments=segb, profile=0.5, affect='EDGES', clamp_overlap=True)
    if bev_baixo: bmesh.ops.bevel(bm, geom=anel(z0), offset=bev_baixo, segments=segb, profile=0.5, affect='EDGES', clamp_overlap=True)
    if uv:                                         # UV planar em metros: a UI cobre o vidro sem esticar
        lay = bm.loops.layers.uv.new('UV')
        for f in bm.faces:
            for l in f.loops: l[lay].uv = (l.vert.co.x / w + 0.5, l.vert.co.y / h + 0.5)
    me = bpy.data.meshes.new(nome); bm.to_mesh(me); bm.free()
    for f in me.polygons: f.use_smooth = True
    ob = bpy.data.objects.new(nome, me); col.objects.link(ob); return ob

def normais(ob):                                   # ULTIMO modificador: faces grandes mandam na normal
    wn = ob.modifiers.new('WN', 'WEIGHTED_NORMAL'); wn.keep_sharp = True; wn.weight = 50; wn.mode = 'FACE_AREA'

def cilindro(nome, raio, z0, z1, x, y, seg=48, bev=0.0, segb=3):
    """Disco ao longo de Z; a quina arredondada fica em z0 (o lado de fora, na traseira)."""
    bm = bmesh.new()
    vb = [bm.verts.new((x + raio * math.cos(2 * math.pi * i / seg), y + raio * math.sin(2 * math.pi * i / seg), z0)) for i in range(seg)]
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

# ================= MATERIAIS (Principled BSDF; Metallic e 0 ou 1) =================
def pb(nome, **kw):
    m = bpy.data.materials.new(nome); b = m.node_tree.nodes['Principled BSDF']
    for k, v in kw.items(): b.inputs[k].default_value = v
    return m, b

def liga(t, v, sock):                              # valor fixo ou ligacao de no
    if isinstance(v, bpy.types.NodeSocket): t.links.new(v, sock)
    elif v is not None: sock.default_value = v

aro, b_aro = pb('AluminioAnodizado', **{'Base Color': (0.80, 0.81, 0.83, 1), 'Metallic': 1.0, 'Roughness': 0.20})
nt = aro.node_tree                                 # rugosidade 0,16-0,26 com riscos ao longo do comprimento
tc = nt.nodes.new('ShaderNodeTexCoord'); mp = nt.nodes.new('ShaderNodeMapping')
mp.inputs['Scale'].default_value = (900, 6, 900)
nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 1.0; nz.inputs['Detail'].default_value = 4
mr = nt.nodes.new('ShaderNodeMapRange'); mr.inputs['To Min'].default_value = 0.16; mr.inputs['To Max'].default_value = 0.26
nt.links.new(tc.outputs['Object'], mp.inputs['Vector']); nt.links.new(mp.outputs['Vector'], nz.inputs['Vector'])
nt.links.new(nz.outputs['Fac'], mr.inputs['Value']); nt.links.new(mr.outputs['Result'], b_aro.inputs['Roughness'])

vidro_tras, _ = pb('VidroFosco', **{'Base Color': (0.012, 0.017, 0.028, 1), 'Roughness': 0.30, 'IOR': 1.52})
ilha_m, _ = pb('VidroIlha', **{'Base Color': (0.012, 0.017, 0.028, 1), 'Roughness': 0.06, 'IOR': 1.52})
anel_m, _ = pb('AnelLente', **{'Base Color': (0.30, 0.31, 0.33, 1), 'Metallic': 1.0, 'Roughness': 0.18})   # grafite
lente_m, _ = pb('Lente', **{'Base Color': (0.004, 0.005, 0.009, 1), 'Roughness': 0.02, 'IOR': 1.5,
                           'Thin Film Thickness': 120.0, 'Thin Film IOR': 1.38})   # 380 nm deixa a lente ciano
interno_m, _ = pb('LenteInterna', **{'Base Color': (0.02, 0.02, 0.025, 1), 'Metallic': 1.0, 'Roughness': 0.35})
flash_m, _ = pb('Flash', **{'Base Color': (0.85, 0.80, 0.62, 1), 'Roughness': 0.35})
plastico_m, _ = pb('PlasticoAntena', **{'Base Color': (0.36, 0.37, 0.39, 1), 'Roughness': 0.55})
furo_m, _ = pb('Furo', **{'Base Color': (0.005, 0.005, 0.005, 1), 'Roughness': 0.7})

# tela: vidro preto brilhante + emissao da UI; borda preta, cantos e furo da camera sao do shader
tela_m, b_t = pb('VidroTela', **{'Base Color': (0, 0, 0, 1), 'Roughness': 0.035, 'IOR': 1.52,
                                 'Emission Strength': args.brilho_tela})
if args.tela:
    t = tela_m.node_tree; N = t.nodes.new
    def vmat(op, *ent):
        n = N('ShaderNodeVectorMath'); n.operation = op
        for i, v in enumerate(ent): liga(t, v, n.inputs[3 if op == 'SCALE' and i == 1 else i])
        return n
    def fmat(op, x, y):
        n = N('ShaderNodeMath'); n.operation = op; liga(t, x, n.inputs[0]); liga(t, y, n.inputs[1]); return n.outputs[0]
    def degrau(d, a0, a1):                         # 0 em d=a0, 1 em d=a1 (borda antisserrilhada de ~0,06 mm)
        n = N('ShaderNodeMapRange'); n.clamp = True; liga(t, d, n.inputs['Value'])
        n.inputs['From Min'].default_value, n.inputs['From Max'].default_value = a0, a1
        return n.outputs['Result']
    uvn = N('ShaderNodeUVMap'); uvn.uv_map = 'UV'
    p = vmat('MULTIPLY', vmat('SUBTRACT', uvn.outputs['UV'], (0.5, 0.5, 0)).outputs[0], (GW, GH, 0)).outputs[0]  # metros
    tx = N('ShaderNodeTexImage'); tx.image = bpy.data.images.load(args.tela)
    tx.interpolation = 'Cubic'; tx.extension = 'EXTEND'
    t.links.new(vmat('MULTIPLY_ADD', p, (0.5 / AX, 0.5 / AY, 0), (0.5, 0.5, 0)).outputs[0], tx.inputs['Vector'])  # area ativa = 0..1
    q = vmat('SUBTRACT', vmat('ABSOLUTE', p).outputs[0], (AX - RC, AY - RC, 0)).outputs[0]   # distancia ao ret. arredondado
    fora = vmat('LENGTH', vmat('MAXIMUM', q, (0, 0, 0)).outputs[0]).outputs['Value']
    s = N('ShaderNodeSeparateXYZ'); t.links.new(q, s.inputs[0])
    dist = fmat('SUBTRACT', fmat('ADD', fora, fmat('MINIMUM', fmat('MAXIMUM', s.outputs['X'], s.outputs['Y']), 0.0)), RC)
    furo = fmat('SUBTRACT', vmat('LENGTH', vmat('SUBTRACT', p, (0, GH / 2 - 0.0046, 0)).outputs[0]).outputs['Value'], 0.0016)
    mask = fmat('MULTIPLY', degrau(dist, 0.0, -0.00006), degrau(furo, 0.0, 0.00006))
    t.links.new(vmat('SCALE', tx.outputs['Color'], mask).outputs[0], b_t.inputs['Emission Color'])
    if args.tela_seq:                              # UI do Remotion quadro a quadro (tela_0001.png ...)
        tx.image.source = 'SEQUENCE'; iu = tx.image_user
        iu.frame_duration, iu.frame_start, iu.frame_offset = args.tela_seq, f0, 0
        iu.use_auto_refresh = True
    iw, ih = tx.image.size
    if ih and abs(iw / ih - AX / AY) > 0.02 * AX / AY:
        log(f'AVISO: a UI tem {iw}x{ih} (proporcao {iw / ih:.3f}); o ideal e {AX / AY:.3f} (1080x{round(1080 * AY / AX)})')
else:
    b_t.inputs['Emission Color'].default_value = (0.05, 0.08, 0.2, 1)

# ================= MODELAGEM: forma -> corte -> bevel -> Weighted Normal por ultimo =================
zf = D / 2 - 0.0003                                # vidros encaixados 0,3 mm abaixo da face do aro
corpo = placa('Aro', W, H, RAIO, -zf, zf, EB, EB, seg=24, segb=8); corpo.data.materials.append(aro)
bm = bmesh.new()                                   # cortador: USB-C (estadio 8,4 x 2,6 mm) + 2 x 6 furos de 1,1 mm
def furo_bm(x, z, rr, comp, prof=0.004, seg=24):
    pts = []
    for i in range(seg):
        tt = 2 * math.pi * i / seg; dx = (comp / 2 if math.cos(tt) >= 0 else -comp / 2)
        pts.append((x + dx + rr * math.cos(tt), z + rr * math.sin(tt)))
    y0, y1 = -H / 2 - 0.001, -H / 2 + prof
    v0 = [bm.verts.new((px, y0, pz)) for px, pz in pts]; v1 = [bm.verts.new((px, y1, pz)) for px, pz in pts]
    bm.faces.new(v0); bm.faces.new(list(reversed(v1)))
    for i in range(seg):
        j = (i + 1) % seg; bm.faces.new((v0[j], v0[i], v1[i], v1[j]))
furo_bm(0, 0, 0.0013, 0.0058, prof=0.0035)
for k in range(6):
    furo_bm(0.009 + k * 0.0021, 0, 0.00055, 0, prof=0.002, seg=16)
    furo_bm(-0.009 - k * 0.0021, 0, 0.00055, 0, prof=0.002, seg=16)
bm.normal_update(); bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
me = bpy.data.meshes.new('Cortador'); bm.to_mesh(me); bm.free()
cort = bpy.data.objects.new('Cortador', me); col.objects.link(cort)
cort.hide_render = True; cort.display_type = 'WIRE'; cort.parent = corpo
bo = corpo.modifiers.new('Furos', 'BOOLEAN'); bo.operation = 'DIFFERENCE'; bo.solver = 'EXACT'; bo.object = cort
normais(corpo)
pecas = [corpo]
def peca(ob, m):
    ob.data.materials.append(m); ob.parent = corpo; pecas.append(ob); return ob
tampa = peca(placa('FundoFuros', 0.04, 0.0006, 0.0002, -0.0016, 0.0016), furo_m); tampa.location.y = -H / 2 + 0.0019
tela = peca(placa('Tela', GW, GH, RAIO - GI, D / 2 - 0.0009, D / 2, 0.00045, 0.0, seg=24, segb=6, uv=True), tela_m); normais(tela)
tras = peca(placa('Traseira', GW, GH, RAIO - GI, -D / 2, -D / 2 + 0.0009, 0.0, 0.00045, seg=24, segb=6), vidro_tras); normais(tras)
for sy in (1, -1):                                 # antenas: 4 faixas de 0,6 mm cortando o aro
    for sx in (1, -1):
        f = peca(placa('Antena', 0.0008, 0.0006, 0.0001, -0.0024, 0.0024), plastico_m)
        f.location = (sx * (W / 2 - 0.00035), sy * (H / 2 - 0.016), 0)
def botao(y, comp):                                # lado +X: comprimento -> Y, altura -> Z, saliencia -> X
    b = peca(placa('Botao', comp, 0.0024, 0.0011, -0.0007, 0.0007, 0.0004, 0.0004, seg=10, segb=4), aro)
    b.rotation_euler = Matrix(((0, 0, 1), (1, 0, 0), (0, 1, 0))).to_euler()
    b.location = (W / 2 - 0.0002, y, 0); normais(b)
botao(0.040, 0.022); botao(0.014, 0.012)
iw_, ih_, ir_ = 0.026, 0.036, 0.0075               # ilha da camera: 26 x 36 mm, raio 7,5 mm (nada de layout de marca)
ix, iy = W / 2 - 0.0065 - iw_ / 2, H / 2 - 0.0065 - ih_ / 2
ilha = peca(placa('Ilha', iw_, ih_, ir_, -D / 2 - 0.0011, -D / 2 + 0.0002, 0.0, 0.0005, seg=16, segb=5), ilha_m)
ilha.location = (ix, iy, 0); normais(ilha)
zi = -D / 2 - 0.0011
for ly in (iy + 0.0085, iy - 0.0085):              # 2 lentes em coluna, dentro da ilha
    lx = ix - 0.0028
    peca(cilindro('AnelLente', 0.0056, zi - 0.0009, zi + 0.0002, lx, ly, bev=0.0003), anel_m)
    peca(cilindro('Lente', 0.0046, zi - 0.00105, zi - 0.0008, lx, ly, bev=0.00012), lente_m)
    peca(cilindro('LenteInterna', 0.0021, zi - 0.00115, zi - 0.0010, lx, ly, seg=32, bev=0.00005), interno_m)
peca(cilindro('Flash', 0.0021, zi - 0.0002, zi + 0.0001, ix + 0.0075, iy + 0.0085, seg=32, bev=0.0001), flash_m)
if args.clay:
    cm, _ = pb('Clay', **{'Base Color': (0.18, 0.18, 0.18, 1), 'Roughness': 0.5})   # cinza 18%: nao estoura
    for o in pecas: o.data.materials.clear(); o.data.materials.append(cm)

prod = bpy.data.objects.new('Produto', None); col.objects.link(prod)
corpo.parent = prod; corpo.rotation_euler = (R(90), 0, 0)          # em pe, tela para -Y (camera)
POSE = {'frente': (R(-6), 0, R(-28)), 'tras': (R(-4), 0, R(180 - 32))}   # 3/4: a espessura aparece
prod.rotation_euler = POSE[args.vista]

# ================= LUZ DE ESTUDIO (parada no mundo: o produto gira e o reflexo varre) =================
def area(nome, loc, sx, sy, watts, alvo=(0, 0, 0), cor=(1, 1, 1)):
    L = bpy.data.lights.new(nome, 'AREA'); L.shape = 'RECTANGLE'; L.size, L.size_y = sx, sy
    L.energy = watts; L.color = cor
    o = bpy.data.objects.new(nome, L); o.location = loc; col.objects.link(o)
    o.rotation_euler = (Vector(alvo) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler(); return o
area('Key', (-0.50, -0.35, 0.65), 0.9, 0.6, 26, cor=(1.0, 0.98, 0.95))   # ALTA: o reflexo dela nao lava a tela
area('Fill', (0.65, -0.35, 0.0), 1.0, 1.0, 2.5, cor=(0.95, 0.97, 1.0))   # ~1:6 a 1:10 com a key
area('RimE', (-0.32, 0.30, 0.05), 0.06, 1.1, 10)                         # faixas finas: linhas de brilho nas quinas
area('RimD', (0.32, 0.30, 0.05), 0.06, 1.1, 4)                           # lado da camera: 4 W (10 W estoura)
area('Topo', (0.0, 0.05, 0.55), 0.8, 0.25, 5)

w = bpy.data.worlds.new('W'); sc.world = w; wt = w.node_tree; bg = wt.nodes['Background']
if args.hdri:                                      # HDRI de estudio (Poly Haven, CC0) so para reflexos
    env = wt.nodes.new('ShaderNodeTexEnvironment'); env.image = bpy.data.images.load(args.hdri)
    wt.links.new(env.outputs['Color'], bg.inputs['Color']); bg.inputs['Strength'].default_value = 0.18
else:
    bg.inputs['Color'].default_value = (0.01, 0.01, 0.012, 1)

if args.fundo == 'escuro':                         # still: degrade radial CONTIDO (cantos <= 5/255, halo <= 40/255)
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0.55, 0.0), rotation=(R(90), 0, 0))
    fd = bpy.context.object; fd.scale = (1.6, 2.4, 1)
    fm = bpy.data.materials.new('Fundo'); fnt = fm.node_tree; fnt.nodes.clear()
    tco = fnt.nodes.new('ShaderNodeTexCoord'); mpp = fnt.nodes.new('ShaderNodeMapping')
    mpp.inputs['Location'].default_value = (0, 0.03, 0)
    mpp.inputs['Scale'].default_value = (1.6 / 0.22, 2.4 / 0.30, 1)
    grd = fnt.nodes.new('ShaderNodeTexGradient'); grd.gradient_type = 'SPHERICAL'
    rmp = fnt.nodes.new('ShaderNodeValToRGB'); rmp.color_ramp.interpolation = 'EASE'
    rmp.color_ramp.elements[0].color = (0.004, 0.0045, 0.006, 1)
    rmp.color_ramp.elements[1].color = (0.085, 0.095, 0.125, 1)
    em = fnt.nodes.new('ShaderNodeEmission'); outm = fnt.nodes.new('ShaderNodeOutputMaterial')
    fnt.links.new(tco.outputs['Object'], mpp.inputs['Vector']); fnt.links.new(mpp.outputs['Vector'], grd.inputs['Vector'])
    fnt.links.new(grd.outputs['Fac'], rmp.inputs['Fac']); fnt.links.new(rmp.outputs['Color'], em.inputs['Color'])
    fnt.links.new(em.outputs['Emission'], outm.inputs['Surface'])
    fd.data.materials.append(fm)

# ================= CAMERA: 85 mm, filha de um pivo (orbita = arco), mira e foco num empty =================
foco = bpy.data.objects.new('Foco', None); foco.location = (0, 0, 0.002); col.objects.link(foco)
pivo = bpy.data.objects.new('Pivo', None); col.objects.link(pivo)
cd = bpy.data.cameras.new('Cam'); cd.lens = 85; cd.sensor_width = 36
cam = bpy.data.objects.new('Cam', cd); col.objects.link(cam); sc.camera = cam
cam.parent = pivo; cam.location = (0, -0.56, 0.035)
tt_ = cam.constraints.new('TRACK_TO'); tt_.target = foco; tt_.track_axis = 'TRACK_NEGATIVE_Z'; tt_.up_axis = 'UP_Y'
cd.dof.use_dof = args.fstop > 0; cd.dof.focus_object = foco; cd.dof.aperture_fstop = args.fstop or 8.0

# ================= CURVAS: cubic-bezier do Remotion -> handles; mola Apple assada =================
def fcurve_de(idb, path, idx=0):
    """Acha ou cria a f-curve. 5.x: cria camada, faixa, slot e channelbag de uma vez."""
    ad = idb.animation_data_create()
    if ad.action is None: ad.action = bpy.data.actions.new(idb.name + 'Acao')   # atribuida ANTES
    act = ad.action
    if hasattr(act, 'fcurve_ensure_for_datablock'): return act.fcurve_ensure_for_datablock(idb, path, index=idx)
    return act.fcurves.find(path, index=idx) or act.fcurves.new(path, index=idx)   # <= 4.3

def curva(idb, path, idx, pts, bez=(0.16, 1, 0.3, 1)):
    """pts = [(quadro, valor), ...]; bez = um cubic-bezier (CSS/Remotion) ou lista, um por trecho."""
    fc = fcurve_de(idb, path, idx); kps = fc.keyframe_points
    kps.clear(); kps.add(len(pts))
    for kp, (f, v) in zip(kps, pts):
        kp.co = (f, v); kp.interpolation = 'BEZIER'
        kp.handle_left_type = kp.handle_right_type = 'FREE'          # tipo ANTES da posicao
        kp.handle_left, kp.handle_right = (f - 1, v), (f + 1, v)     # pontas planas
    for i, (p_, q_) in enumerate(zip(kps[:-1], kps[1:])):
        x1, y1, x2, y2 = bez[i] if isinstance(bez[0], (tuple, list)) else bez
        dt, dv = q_.co.x - p_.co.x, q_.co.y - p_.co.y
        p_.handle_right = (p_.co.x + x1 * dt, p_.co.y + y1 * dv)
        q_.handle_left = (p_.co.x + x2 * dt, p_.co.y + y2 * dv)
    fc.update(); return fc                                           # update() preserva os FREE

def assa_mola(idb, path, idx, fa, fb, v0, v1, zeta=0.8, resposta=1.0):
    """Mola Apple (zeta, response em s) assada: 1 chave por quadro. Pico em ~0,9 R; assenta em ~2 R."""
    w0 = 2 * math.pi / resposta; wd = w0 * math.sqrt(1 - zeta * zeta); fps = sc.render.fps
    m = lambda t: 1 - math.exp(-zeta * w0 * t) * (math.cos(wd * t) + zeta * w0 / wd * math.sin(wd * t))
    fc = fcurve_de(idb, path, idx); kps = fc.keyframe_points; kps.clear(); kps.add(fb - fa + 1)
    for kp, f in zip(kps, range(fa, fb + 1)):
        kp.co = (f, v0 + (v1 - v0) * m((f - fa) / fps)); kp.interpolation = 'BEZIER'
        kp.handle_left_type = kp.handle_right_type = 'AUTO_CLAMPED'
    fc.update(); return fc

DRIFT = (0.3, 0.15, 0.2, 1)     # entra no corte ja andando (0,5x a velocidade media); vmax 2,5x
DOLLY = (0.65, 0, 0.35, 1)      # push-in que sai e chega parado; vmax 2,9x
canais = []                     # (nome, fcurve, quadro ini, quadro fim, valor ini, valor alvo)
rz = prod.rotation_euler[2]
if args.anim == 'heroi':        # revelacao: orbita 20 graus + push-in 18% + produto 45 graus em mola, defasado 6 q
    d0 = 6
    resp = args.resposta or round(0.85 * (f1 - f0 - d0) / args.fps, 2)
    canais.append(('orbita', curva(pivo, 'rotation_euler', 2, [(f0, R(-20)), (f1, 0.0)], DRIFT), f0, f1, R(-20), 0.0))
    canais.append(('dolly', curva(cam, 'location', 1, [(f0, -0.68), (f1, -0.56)], DOLLY), f0, f1, -0.68, -0.56))
    canais.append(('produto', assa_mola(prod, 'rotation_euler', 2, f0 + d0, f1, rz - R(45), rz, zeta=0.85, resposta=resp),
                   f0 + d0, f1, rz - R(45), rz))
    log(f'heroi: mola zeta 0,85, response {resp} s, defasada {d0} quadros')
elif args.anim == 'turntable':  # giro constante; CYCLES com REPEAT_OFFSET (o REPEAT volta 358 graus e o blur borra)
    ft = curva(prod, 'rotation_euler', 2, [(f0, rz), (f0 + args.volta, rz + 2 * math.pi)])
    for kp in ft.keyframe_points: kp.interpolation = 'LINEAR'
    cyc = ft.modifiers.new('CYCLES'); cyc.mode_before = cyc.mode_after = 'REPEAT_OFFSET'
    canais.append(('turntable', ft, f0, f0 + args.volta, rz, rz + 2 * math.pi))

# ================= SHEEN: cartao emissivo visto SO em reflexos, posicionado por reflexao no pouso =================
def cartao(nome, loc, sx, sy, forca, giro=0.0, alvo=(0, 0, 0)):
    bpy.ops.mesh.primitive_plane_add(size=1, location=loc); c = bpy.context.object; c.name = nome
    c.scale = (sx, sy, 1)
    q = (Vector(alvo) - Vector(loc)).to_track_quat('Z', 'Y')
    c.rotation_euler = (q.to_matrix().to_4x4() @ Matrix.Rotation(giro, 4, 'Z')).to_euler()
    m = bpy.data.materials.new(nome); t = m.node_tree; t.nodes.clear()
    tc_ = t.nodes.new('ShaderNodeTexCoord'); g = t.nodes.new('ShaderNodeTexGradient')
    mp_ = t.nodes.new('ShaderNodeMapping'); mp_.inputs['Location'].default_value = (0.5, 0, 0)
    pw = t.nodes.new('ShaderNodeMath'); pw.operation = 'POWER'; pw.inputs[1].default_value = 2.0
    mu = t.nodes.new('ShaderNodeMath'); mu.operation = 'MULTIPLY'; mu.inputs[1].default_value = forca
    e = t.nodes.new('ShaderNodeEmission'); o = t.nodes.new('ShaderNodeOutputMaterial')
    t.links.new(tc_.outputs['Object'], mp_.inputs['Vector']); t.links.new(mp_.outputs['Vector'], g.inputs['Vector'])
    t.links.new(g.outputs['Fac'], pw.inputs[0]); t.links.new(pw.outputs['Value'], mu.inputs[0])
    t.links.new(mu.outputs['Value'], e.inputs['Strength']); t.links.new(e.outputs['Emission'], o.inputs['Surface'])
    c.data.materials.append(m)
    c.visible_camera = c.visible_diffuse = c.visible_shadow = c.visible_transmission = False
    return c
sc.frame_set(f1 if args.anim == 'heroi' else f0); bpy.context.view_layer.update()
mw = corpo.matrix_world; olho = cam.matrix_world.translation.copy()
p_tela = mw @ Vector((-W * 0.22, H * 0.28, D / 2))                 # canto superior esquerdo da tela
n_tela = (mw.to_3x3() @ Vector((0, 0, 1))).normalized()
dv = (p_tela - olho).normalized(); rv = dv - 2 * dv.dot(n_tela) * n_tela   # raio da camera refletido
cartao('Sheen', tuple(p_tela + rv * 0.45), 0.22, 0.60, args.sheen, giro=R(30), alvo=tuple(p_tela))

# ================= SOMBRA EM CAMADA PROPRIA (vai abaixo dos textos no Remotion) =================
if args.sombra or args.so_sombra:
    zmin = min((o.matrix_world @ Vector(c)).z for o in pecas for c in o.bound_box)
    bpy.ops.mesh.primitive_plane_add(size=2, location=(0, 0, zmin - 0.0005))
    bpy.context.object.is_shadow_catcher = True
if args.so_sombra:                                 # celular invisivel para a camera, mas faz sombra
    for o in pecas: o.visible_camera = False

# ================= COMPOSITOR (5.x: grupo de nos; ajustes sao entradas) =================
if args.comp:
    tr = bpy.data.node_groups.new('Comp', 'CompositorNodeTree'); sc.compositing_node_group = tr
    tr.interface.new_socket(name='Image', in_out='OUTPUT', socket_type='NodeSocketColor')
    rl = tr.nodes.new('CompositorNodeRLayers'); go = tr.nodes.new('NodeGroupOutput')
    gl = tr.nodes.new('CompositorNodeGlare')
    gl.inputs['Type'].default_value = 'Bloom'; gl.inputs['Quality'].default_value = 'High'
    gl.inputs['Threshold'].default_value = 0.85; gl.inputs['Strength'].default_value = 0.18; gl.inputs['Size'].default_value = 0.55
    ld = tr.nodes.new('CompositorNodeLensdist'); ld.inputs['Dispersion'].default_value = 0.006   # aberracao cromatica sutil
    tr.links.new(rl.outputs['Image'], gl.inputs['Image']); tr.links.new(gl.outputs['Image'], ld.inputs['Image'])
    ultimo = ld.outputs['Image']
    if not r.film_transparent:                     # vinheta so com fundo do Blender (com alpha: faca no Remotion)
        el = tr.nodes.new('CompositorNodeEllipseMask'); el.inputs['Size'].default_value = (0.95, 0.80)
        bl = tr.nodes.new('CompositorNodeBlur'); bl.inputs['Size'].default_value = (300, 300)
        tr.links.new(el.outputs['Mask'], bl.inputs['Image'])
        mr2 = tr.nodes.new('ShaderNodeMapRange'); mr2.inputs['To Min'].default_value = 0.75   # borda escurece ~25%
        tr.links.new(bl.outputs['Image'], mr2.inputs['Value'])
        mx = tr.nodes.new('ShaderNodeMix'); mx.data_type = 'RGBA'; mx.blend_type = 'MULTIPLY'   # MixRGB nao existe no 5.2
        mx.inputs['Factor'].default_value = 1.0
        tr.links.new(ultimo, mx.inputs['A']); tr.links.new(mr2.outputs['Result'], mx.inputs['B'])
        ultimo = mx.outputs['Result']
    tr.links.new(ultimo, go.inputs['Image'])

# ================= caixas.json (ancorar textos no Remotion) e qa.json (QA das curvas) =================
caixas, rel = [], []
for f in range(f0, f1 + 1):
    sc.frame_set(f)
    pts = [world_to_camera_view(sc, cam, o.matrix_world @ Vector(c)) for o in pecas for c in o.bound_box]
    xs = [p_.x * 1080 for p_ in pts]; ys = [(1 - p_.y) * 1920 for p_ in pts]
    caixas.append({'f': f - f0, 'x0': round(min(xs), 1), 'y0': round(min(ys), 1), 'x1': round(max(xs), 1), 'y1': round(max(ys), 1)})
    rel.append(prod.rotation_euler[2] - pivo.rotation_euler[2])      # angulo produto-camera (o que move o reflexo)
with open(args.out + 'caixas.json', 'w') as fh: json.dump(caixas, fh)

def qa_canal(fc, fa, fb, v0, v1):
    amp = v1 - v0; vmed = 1.0 / (fb - fa)
    prog = [(fc.evaluate(f) - v0) / amp for f in range(fa, fb + 1)]
    vel = [(fc.evaluate(f + 0.5) - fc.evaluate(f - 0.5)) / amp for f in range(fa, fb + 1)]   # passo >= 0,5 (float32)
    n = len(vel)
    paradas = [fa + i for i in range(int(n * 0.15), int(n * 0.85)) if abs(vel[i]) < 0.02 * vmed and prog[i] < 0.95]
    return {'vmax_sobre_media': round(max(abs(v) for v in vel) / vmed, 2),
            'passa_do_ponto_pct': round(max(0.0, max(prog) - 1) * 100, 2),
            'vel_inicial_sobre_media': round(abs(vel[0]) / vmed, 2), 'paradas_no_meio': paradas[:5]}
qa = {nome: qa_canal(fc, fa, fb, v0, v1) for nome, fc, fa, fb, v0, v1 in canais}
if args.anim == 'heroi' and abs(rel[-1] - rel[0]) > 1e-6:
    pr = [(x - rel[0]) / (rel[-1] - rel[0]) for x in rel]
    q10 = next(i for i, x in enumerate(pr) if x >= 0.1); q90 = next(i for i, x in enumerate(pr) if x >= 0.9)
    qa['varredura'] = {'graus': round(math.degrees(rel[-1] - rel[0]), 1), 'quadros_10_90': q90 - q10,
                       'meta': '>= 20-30 quadros; camera vmax <= 3; camera 0% de overshoot; rotacao 1-2%'}
if args.anim == 'turntable':
    fc = canais[0][1]; ps = [math.degrees(fc.evaluate(f + 1) - fc.evaluate(f)) for f in range(f0, f0 + 2 * args.volta)]
    qa['turntable'] = {'passo_min_graus': round(min(ps), 4), 'passo_max_graus': round(max(ps), 4)}
with open(args.out + 'qa.json', 'w') as fh: json.dump(qa, fh, indent=1, ensure_ascii=False)
log('QA ' + json.dumps(qa, ensure_ascii=False))

# ================= RENDER =================
if args.salvar: bpy.ops.wm.save_as_mainfile(filepath=args.out + 'cena.blend', compress=True)
t_ini = [0.0]
bpy.app.handlers.render_pre.append(lambda *_: t_ini.__setitem__(0, time.time()))
bpy.app.handlers.render_post.append(lambda *_: log(f'quadro {sc.frame_current}: {time.time() - t_ini[0]:.1f} s'))
so = args.so or (str(f0) if args.anim == 'parado' else None)
log(f'render {args.anim} {args.pct}% {args.spp} amostras, view {args.view}, mb={args.mb}')
r.filepath = args.out                              # Blender acrescenta 0001.png
if so:
    for f in map(int, so.split(',')):
        sc.frame_set(f); r.filepath = f'{args.out}{f:04d}'
        bpy.ops.render.render(write_still=True)
else:
    bpy.ops.render.render(animation=True)
log('fim')
