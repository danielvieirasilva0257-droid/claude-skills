import bpy, bpy_extras.anim_utils as au
print("VERSION", bpy.app.version_string)
print("anim_utils:", [n for n in dir(au) if 'channelbag' in n or 'action' in n])
s=bpy.context.scene
imf=s.render.image_settings
for p in ('media_type','file_format','color_mode','color_depth','compression'):
    prop=imf.bl_rna.properties[p]
    items=[i.identifier for i in prop.enum_items] if prop.type=='ENUM' else prop.type
    print(p, getattr(imf,p), items)
print("view_transform items:", [i.identifier for i in s.view_settings.bl_rna.properties['view_transform'].enum_items])
try:
    print("looks:", [i.identifier for i in s.view_settings.bl_rna.properties['look'].enum_items][:40])
except Exception as e: print(e)
r=s.render
for p in ('use_motion_blur','motion_blur_shutter','film_transparent','use_persistent_data','fps','fps_base'):
    print(p, getattr(r,p,None))
print("engine items:", [i.identifier for i in r.bl_rna.properties['engine'].enum_items])
r.engine='CYCLES'
c=s.cycles
for p in ('samples','use_adaptive_sampling','adaptive_threshold','use_denoising','denoiser','device','use_light_tree','max_bounces','glossy_bounces','transmission_bounces','use_fast_gi','motion_blur_position','rolling_shutter_type'):
    print('cycles.',p, getattr(c,p,'N/A'))
print('denoiser items', [i.identifier for i in c.bl_rna.properties['denoiser'].enum_items])
e=s.eevee
print('eevee props:', [p.identifier for p in e.bl_rna.properties if any(k in p.identifier for k in ('sample','ray','shadow','motion','bloom','fast_gi','volum'))])
cam=bpy.data.cameras.new('c'); print('dof props', [p.identifier for p in cam.dof.bl_rna.properties])
ob=bpy.data.objects.new('o',None); print('is_shadow_catcher' in ob.bl_rna.properties, 'is_holdout' in ob.bl_rna.properties)
kp=bpy.types.Keyframe.bl_rna.properties
print('interp', [i.identifier for i in kp['interpolation'].enum_items])
print('easing', [i.identifier for i in kp['easing'].enum_items])
print('handle', [i.identifier for i in kp['handle_left_type'].enum_items])
# test slotted action path
ob2=bpy.data.objects.new('t',None); s.collection.objects.link(ob2)
ob2.keyframe_insert('location',frame=1); ob2.location.x=1; ob2.keyframe_insert('location',frame=10)
ad=ob2.animation_data
print('action', ad.action, 'slot', ad.action_slot)
cb=au.action_get_channelbag_for_slot(ad.action, ad.action_slot)
print('fcurves', [(f.data_path,f.array_index) for f in cb.fcurves])
print('hasattr action.fcurves', hasattr(ad.action,'fcurves'))
print('Image source enum', [i.identifier for i in bpy.types.Image.bl_rna.properties['source'].enum_items])
print('ImageUser props', [p.identifier for p in bpy.types.ImageUser.bl_rna.properties][:20])
print('world', 'compositing_node_group' in s.bl_rna.properties)
