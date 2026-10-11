import bpy
s=bpy.context.scene
print('VT', s.view_settings.view_transform, 'look', s.view_settings.look, 'display', s.display_settings.display_device)
for vt in ('Standard','AgX','Khronos PBR Neutral','Filmic','ACES 2.0','Raw'):
    try:
        s.view_settings.view_transform=vt; print('ok',vt)
    except Exception as e: print('no',vt,e)
r=s.render
print([p.identifier for p in r.bl_rna.properties if 'motion' in p.identifier or 'shutter' in p.identifier])
print([p.identifier for p in s.cycles.bl_rna.properties if 'denois' in p.identifier])
