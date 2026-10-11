import bpy
a = bpy.types.Action.bl_rna.functions
print('fcurve_ensure_for_datablock' in a, [p.identifier for p in a['fcurve_ensure_for_datablock'].parameters] if 'fcurve_ensure_for_datablock' in a else None)
fc = bpy.types.FCurve.bl_rna
print('auto_smoothing', [e.identifier for e in fc.properties['auto_smoothing'].enum_items])
kp = bpy.types.Keyframe.bl_rna.properties
print('handle types', [e.identifier for e in kp['handle_left_type'].enum_items])
print('interp', [e.identifier for e in kp['interpolation'].enum_items])
print('kp props', [p.identifier for p in kp])
print('fc funcs', [f.identifier for f in fc.functions])
