# SPDX-License-Identifier: GPL-3.0-or-later
# Sonda: lente animada (dado da camera = outro ID), Noise e Cycles como modificadores de f-curve no 5.2.2
import bpy, math
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene; sc.render.fps = 30
cd = bpy.data.cameras.new('C'); cam = bpy.data.objects.new('C', cd); sc.collection.objects.link(cam)
def fcurve_de(idb, path, idx=0):
    ad = idb.animation_data_create()
    if ad.action is None: ad.action = bpy.data.actions.new(idb.name + 'Acao')
    return ad.action.fcurve_ensure_for_datablock(idb, path, index=idx)
# 1) lente 50 -> 65 mm no dado da camera
fl = fcurve_de(cd, 'lens'); fl.keyframe_points.add(2)
fl.keyframe_points[0].co = (1, 50); fl.keyframe_points[1].co = (90, 65)
for k in fl.keyframe_points: k.interpolation = 'BEZIER'
fl.update(); sc.frame_set(45); print('lente q45', round(cd.lens, 3), 'slot', cd.animation_data.action_slot.identifier, 'acao', cd.animation_data.action.name)
# 2) micro-deriva de camera "na mao": Noise em rotacao X, amplitude pequena
fr = fcurve_de(cam, 'rotation_euler', 0); fr.keyframe_points.add(1); fr.keyframe_points[0].co = (1, math.radians(90))
n = fr.modifiers.new('NOISE'); n.scale = 40; n.strength = math.radians(0.3); n.phase = 7; n.depth = 0; n.blend_type = 'REPLACE'
vals = [fr.evaluate(f) - math.radians(90) for f in range(1, 301)]
print('noise: amplitude pico-a-pico (graus)', round(math.degrees(max(vals) - min(vals)), 3), 'maior passo por quadro (graus)', round(max(abs(math.degrees(vals[i+1]-vals[i])) for i in range(299)), 4))
print('noise props', [p.identifier for p in n.bl_rna.properties if not p.is_readonly][:20])
# 3) turntable sem soluco: 2 chaves LINEAR + modificador Cycles
ft = fcurve_de(cam, 'rotation_euler', 2); ft.keyframe_points.add(2)
ft.keyframe_points[0].co = (1, 0); ft.keyframe_points[1].co = (181, 2 * math.pi)
for k in ft.keyframe_points: k.interpolation = 'LINEAR'
ft.modifiers.new('CYCLES'); ft.update()
d = [ft.evaluate(f + 1) - ft.evaluate(f) for f in range(1, 400)]
print('turntable: passo min/max por quadro (graus)', round(math.degrees(min(d)), 4), round(math.degrees(max(d)), 4), 'q181=', round(ft.evaluate(181), 4), 'q361=', round(ft.evaluate(361), 4))
# 3b) correcao: Repeat with Offset (sem salto de -360 graus, que o motion blur borraria)
m = ft.modifiers[0]; m.mode_before = m.mode_after = 'REPEAT_OFFSET'; ft.update()
d = [ft.evaluate(f + 1) - ft.evaluate(f) for f in range(1, 400)]
print('turntable offset: passo min/max (graus)', round(math.degrees(min(d)), 4), round(math.degrees(max(d)), 4), 'q361=', round(math.degrees(ft.evaluate(361)), 2))
