import bpy
sc = bpy.context.scene
t = bpy.data.node_groups.new("C", "CompositorNodeTree")
for typ in ["CompositorNodeGlare", "CompositorNodeLensdist", "CompositorNodeEllipseMask", "CompositorNodeBlur", "CompositorNodeMixRGB", "CompositorNodeMix"]:
    try:
        n = t.nodes.new(typ)
        print(typ, "IN:", [(i.name, getattr(i,'default_value',None) if not hasattr(getattr(i,'default_value',None),'__len__') or isinstance(getattr(i,'default_value',None),str) else 'vec') for i in n.inputs])
        print("   OUT:", [o.name for o in n.outputs])
        for p in n.bl_rna.properties:
            if p.identifier not in ('rna_type','name','label','location','width','height','dimensions','inputs','outputs','internal_links','parent','select','show_options','show_preview','hide','mute','show_texture','bl_idname','bl_label','bl_description','bl_icon','bl_static_type','bl_width_default','bl_width_min','bl_width_max','bl_height_default','bl_height_min','bl_height_max','type','color','use_custom_color','location_absolute','warning_propagation','color_tag','width_hidden'):
                print("   prop", p.identifier, getattr(n, p.identifier, None))
    except Exception as e: print(typ, "ERR", e)
gl = t.nodes.new("CompositorNodeGlare")
for i in gl.inputs:
    if i.bl_idname.endswith('Menu') or i.type=='MENU':
        print('menu', i.name, [e for e in i.bl_rna.properties['default_value'].enum_items.keys()] if hasattr(i.bl_rna.properties['default_value'],'enum_items') else '')
print("views:", [v for v in sc.view_settings.bl_rna.properties['view_transform'].enum_items.keys()])
print("cycles denoise props:", [p for p in dir(sc.cycles) if 'denois' in p])
print("prefilter:", sc.cycles.bl_rna.properties['denoising_prefilter'].enum_items.keys() if 'denoising_prefilter' in sc.cycles.bl_rna.properties else None)
m = bpy.data.materials.new("x"); m.use_nodes=True
print("principled:", [i.name for i in m.node_tree.nodes['Principled BSDF'].inputs])
print("has compositing_node_group:", hasattr(sc,'compositing_node_group'))
