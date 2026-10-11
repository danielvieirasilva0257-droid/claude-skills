"""Cliente 2: testa as duas formas de 'olhar' a cena sob Xvfb (screenshot com redraw e render OpenGL do viewport)."""
import sys, json
sys.argv = sys.argv[:2]
exec(open(__file__.replace("client2", "client")).read().split("t0 = time.time()")[0])
OUT = sys.argv[1]
send("bpy.ops.mesh.primitive_monkey_add(location=(0,0,0)); print('ok')")
send(f"""
import time; t = time.time()
bpy.ops.wm.redraw_timer(type='DRAW_WIN_SWAP', iterations=3)
bpy.ops.screen.screenshot(filepath='{OUT}/screenshot_redraw.png')
print('screenshot apos redraw:', round(time.time()-t, 2), 's')
""")
send(f"""
import time; t = time.time()
sc = bpy.context.scene
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = 1080, 1920, 50
sc.render.filepath = '{OUT}/viewport_opengl.png'
area = next(a for a in bpy.context.screen.areas if a.type == 'VIEW_3D')
with bpy.context.temp_override(area=area, region=next(r for r in area.regions if r.type == 'WINDOW')):
    bpy.ops.render.opengl(write_still=True)
print('render OpenGL do viewport 540x960:', round(time.time()-t, 2), 's')
""", quit=True)
