"""Animacao minima de promo de app (celular generico + logo) em Blender headless.

Uso:
  blender -b --factory-startup -P promo_min.py -- <CYCLES|EEVEE|WORKBENCH> <amostras> <pasta_saida> <quadro_ini> <quadro_fim> [res_pct] [alpha]

Exemplo (1 quadro de teste):  ... -- CYCLES 16 out 30 30
Exemplo (animacao 2 s/30fps): ... -- CYCLES 16 out 1 60

Cena: celular procedural (caixa com bevel, tela emissiva em degrade), logo 3D "Rotina"
que entra com "overshoot", luzes de estudio (chave + 2 recortes), camera 50 mm, 1080x1920.
"""
import bpy, sys, math, time, os

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
ENGINE = (argv[0] if len(argv) > 0 else "CYCLES").upper()
SAMPLES = int(argv[1]) if len(argv) > 1 else 16
OUT = os.path.abspath(argv[2] if len(argv) > 2 else "out")
F0 = int(argv[3]) if len(argv) > 3 else 1
F1 = int(argv[4]) if len(argv) > 4 else 60
RES_PCT = int(argv[5]) if len(argv) > 5 else 100
ALPHA = (argv[6] == "alpha") if len(argv) > 6 else False

T0 = time.time()
def log(msg):
    print(f"[promo_min +{time.time()-T0:7.2f}s] {msg}", flush=True)

# ---------- cena limpa ----------
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.resolution_x, scene.render.resolution_y = 1080, 1920
scene.render.resolution_percentage = RES_PCT
scene.render.fps = 30
scene.frame_start, scene.frame_end = 1, 60
scene.render.film_transparent = ALPHA
scene.view_settings.view_transform = "Standard"   # AgX desbota a cor da UI
scene.render.use_persistent_data = True

def mat_principled(name, base, metallic=0.0, rough=0.4, coat=0.0, emis=None, emis_str=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*base, 1)
    b.inputs["Metallic"].default_value = metallic
    b.inputs["Roughness"].default_value = rough
    if "Coat Weight" in b.inputs:
        b.inputs["Coat Weight"].default_value = coat
    if emis is not None:
        b.inputs["Emission Color"].default_value = (*emis, 1)
        b.inputs["Emission Strength"].default_value = emis_str
    return m

# ---------- celular generico (nada de marca Apple) ----------
PH_W, PH_D, PH_H = 1.36, 0.16, 2.80
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0))
body = bpy.context.object
body.name = "Phone"
body.scale = (PH_W, PH_D, PH_H)
bpy.ops.object.transform_apply(scale=True)
bev = body.modifiers.new("Bevel", "BEVEL")
bev.width, bev.segments, bev.limit_method = 0.075, 8, "ANGLE"
bpy.ops.object.shade_smooth()
body.data.materials.append(mat_principled("Corpo", (0.015, 0.015, 0.02), metallic=0.7, rough=0.22, coat=0.6))

# tela: plano com degrade emissivo (vermelho Rotina -> escuro)
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, -PH_D / 2 - 0.002, 0), rotation=(math.radians(90), 0, 0))
screen = bpy.context.object
screen.name = "Screen"
screen.scale = (PH_W - 0.10, PH_H - 0.10, 1)
sm = bpy.data.materials.new("Tela")
sm.use_nodes = True
nt = sm.node_tree
nt.nodes.clear()
tc = nt.nodes.new("ShaderNodeTexCoord")
sep = nt.nodes.new("ShaderNodeSeparateXYZ")   # degrade vertical = coordenada V do UV
ramp = nt.nodes.new("ShaderNodeValToRGB")
ramp.color_ramp.elements[0].color = (0.05, 0.01, 0.02, 1)
ramp.color_ramp.elements[1].color = (0.90, 0.20, 0.24, 1)
em = nt.nodes.new("ShaderNodeEmission")
em.inputs["Strength"].default_value = 0.85
outn = nt.nodes.new("ShaderNodeOutputMaterial")
nt.links.new(tc.outputs["UV"], sep.inputs["Vector"])
nt.links.new(sep.outputs["Y"], ramp.inputs["Fac"])
nt.links.new(ramp.outputs["Color"], em.inputs["Color"])
nt.links.new(em.outputs["Emission"], outn.inputs["Surface"])
screen.data.materials.append(sm)
sb = screen.modifiers.new("Cantos", "BEVEL")       # cantos arredondados da tela
sb.affect, sb.width, sb.segments = "VERTICES", 0.11, 8
screen.parent = body

# rig do celular: um Empty que gira (o mesmo "rig" pode alimentar o 2D)
bpy.ops.object.empty_add(location=(0, 0, 0.35))
rig = bpy.context.object
rig.name = "PhoneRig"
body.parent = rig

def key(obj, path, frame, value, interp="BEZIER", easing="AUTO"):
    setattr(obj, path, value)
    obj.keyframe_insert(data_path=path, frame=frame)
    fc = None
    ad = obj.animation_data
    if ad and ad.action:
        # API de 4.4+/5.x: fcurves ficam em camadas/slots; procura de forma tolerante
        try:
            fcs = ad.action.fcurves
        except AttributeError:
            fcs = [fc for layer in ad.action.layers for strip in layer.strips
                   for cb in strip.channelbags for fc in cb.fcurves]
        for fc in fcs:
            if fc.data_path == path:
                for kp in fc.keyframe_points:
                    if int(kp.co[0]) == frame:
                        kp.interpolation, kp.easing = interp, easing

# giro de produto: -40 graus -> +25 graus com "ease in-out", flutuacao leve
key(rig, "rotation_euler", 1, (math.radians(8), 0, math.radians(-55)))
key(rig, "rotation_euler", 60, (math.radians(-4), 0, math.radians(30)))
key(rig, "location", 1, (0, 0, 0.25))
key(rig, "location", 60, (0, 0, 0.45))

# ---------- logo 3D ----------
bpy.ops.object.text_add(location=(0, -0.3, -1.62), rotation=(math.radians(90), 0, 0))
logo = bpy.context.object
logo.name = "Logo"
logo.data.body = "Rotina"
logo.data.align_x, logo.data.align_y = "CENTER", "CENTER"
logo.data.size = 0.55
logo.data.extrude, logo.data.bevel_depth = 0.04, 0.008
logo.data.materials.append(mat_principled("Logo", (0.95, 0.95, 0.97), metallic=0.0, rough=0.25, coat=0.5))
key(logo, "scale", 1, (0.001, 0.001, 0.001))
key(logo, "scale", 12, (0.001, 0.001, 0.001))
key(logo, "scale", 30, (1, 1, 1), interp="BACK", easing="EASE_OUT")

# ---------- luzes de estudio ----------
def area(name, loc, power, size, color=(1, 1, 1)):
    l = bpy.data.lights.new(name, "AREA")
    l.energy, l.size, l.color = power, size, color
    o = bpy.data.objects.new(name, l)
    o.location = loc
    scene.collection.objects.link(o)
    t = o.constraints.new("TRACK_TO")          # mira sempre no celular
    t.target, t.track_axis, t.up_axis = rig, "TRACK_NEGATIVE_Z", "UP_Y"
area("Chave", (-3.0, -4.0, 3.0), 700, 3.0)
area("RecorteA", (3.0, 2.5, 2.2), 1500, 1.0, (0.70, 0.82, 1.0))
area("RecorteB", (-3.0, 2.5, -0.5), 1200, 1.0, (1.0, 0.70, 0.72))
area("Topo", (0.0, 0.5, 4.5), 400, 4.0)

# brilho de fundo (plano emissivo com degrade radial): barato e "premium"
bpy.ops.mesh.primitive_plane_add(size=12, location=(0, 4.0, 0.3), rotation=(math.radians(90), 0, 0))
glow = bpy.context.object
gm = bpy.data.materials.new("Brilho")
gm.use_nodes = True
g = gm.node_tree
g.nodes.clear()
gtc = g.nodes.new("ShaderNodeTexCoord")
gmp = g.nodes.new("ShaderNodeMapping")
gmp.inputs["Location"].default_value = (-1.1, -1.1, 0)   # centro do UV (0,5 x escala 2,2)
ggr = g.nodes.new("ShaderNodeTexGradient")
ggr.gradient_type = "SPHERICAL"
gmp.inputs["Scale"].default_value = (2.2, 2.2, 1)
gramp = g.nodes.new("ShaderNodeValToRGB")
gramp.color_ramp.elements[0].color = (0.010, 0.010, 0.016, 1)
gramp.color_ramp.elements[1].color = (0.22, 0.04, 0.07, 1)
gem = g.nodes.new("ShaderNodeEmission")
gout = g.nodes.new("ShaderNodeOutputMaterial")
g.links.new(gtc.outputs["UV"], gmp.inputs["Vector"])
g.links.new(gmp.outputs["Vector"], ggr.inputs["Vector"])
g.links.new(ggr.outputs["Fac"], gramp.inputs["Fac"])
g.links.new(gramp.outputs["Color"], gem.inputs["Color"])
g.links.new(gem.outputs["Emission"], gout.inputs["Surface"])
glow.data.materials.append(gm)
glow.visible_shadow = False

world = bpy.data.worlds.new("Mundo")
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.012, 0.012, 0.018, 1)
scene.world = world

# ---------- camera ----------
cam_data = bpy.data.cameras.new("Cam")
cam_data.lens = 50
cam = bpy.data.objects.new("Cam", cam_data)
cam.location, cam.rotation_euler = (0, -6.2, 0.15), (math.radians(90), 0, 0)
scene.collection.objects.link(cam)
scene.camera = cam

# ---------- motor ----------
if ENGINE == "CYCLES":
    scene.render.engine = "CYCLES"
    c = scene.cycles
    c.device = "CPU"
    c.samples = SAMPLES
    c.use_adaptive_sampling = True
    c.adaptive_threshold = 0.02
    c.use_denoising = True
    c.denoiser = "OPENIMAGEDENOISE"
    c.max_bounces, c.diffuse_bounces, c.glossy_bounces, c.transmission_bounces = 6, 2, 3, 2
    c.caustics_reflective = c.caustics_refractive = False
elif ENGINE == "EEVEE":
    scene.render.engine = "BLENDER_EEVEE"
    scene.eevee.taa_render_samples = SAMPLES
else:
    scene.render.engine = "BLENDER_WORKBENCH"
    scene.display.shading.light = "STUDIO"
    scene.display.render_aa = "8"

scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA" if ALPHA else "RGB"
scene.render.filepath = os.path.join(OUT, "q_####")
os.makedirs(OUT, exist_ok=True)
scene.frame_start, scene.frame_end = F0, F1

times = {}
def pre(sc, *a):
    times["t"] = time.time()
def post(sc, *a):
    log(f"quadro {sc.frame_current} pronto em {time.time()-times['t']:.2f}s")
bpy.app.handlers.render_pre.append(pre)
bpy.app.handlers.render_post.append(post)

log(f"motor={ENGINE} amostras={SAMPLES} quadros={F0}-{F1} res={RES_PCT}% alpha={ALPHA} threads={scene.render.threads}")
tr = time.time()
bpy.ops.render.render(animation=True)
log(f"TOTAL render {F1-F0+1} quadros: {time.time()-tr:.1f}s ({(time.time()-tr)/(F1-F0+1):.2f}s/quadro)")
