"""Cliente do teste xvfb_socket_server.py: faz o papel do MCP (manda bpy, recebe JSON)."""
import socket, json, time, sys

OUT = sys.argv[1] if len(sys.argv) > 1 else "/tmp/xvfb_test"

def send(code, quit=False, timeout=600):
    t = time.time()
    while True:  # espera o Blender subir
        try:
            c = socket.create_connection(("127.0.0.1", 9877), timeout=timeout)
            break
        except OSError:
            if time.time() - t > 180:
                raise
            time.sleep(0.5)
    c.sendall((json.dumps({"code": code, "quit": quit}) + "\n").encode())
    buf = b""
    while not buf.endswith(b"\n"):
        chunk = c.recv(65536)
        if not chunk:
            break
        buf += chunk
    r = json.loads(buf.decode())
    r["ida_e_volta_s"] = round(time.time() - t, 2)
    print(json.dumps(r, ensure_ascii=False), flush=True)
    return r

t0 = time.time()
send("print(bpy.app.version_string, 'background=', bpy.app.background, 'objetos=', len(bpy.data.objects))")
print(f"[cli] Blender respondeu {time.time()-t0:.1f}s depois do inicio do cliente", flush=True)
send("bpy.ops.mesh.primitive_monkey_add(location=(0,0,0)); print('objetos=', [o.name for o in bpy.data.objects])")
# render Eevee pequeno (a GUI sob Xvfb tem contexto OpenGL via Mesa llvmpipe)
send(f"""
sc = bpy.context.scene
sc.render.engine = 'BLENDER_EEVEE'
sc.eevee.taa_render_samples = 16
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = 1080, 1920, 50
sc.render.filepath = '{OUT}/eevee_gui_50pct.png'
import time; t = time.time()
bpy.ops.render.render(write_still=True)
print('eevee 540x960 16 amostras:', round(time.time()-t, 2), 's')
""")
# "olhar" a cena: captura do viewport, o que os MCPs chamam de screenshot/look
send(f"""
import time; t = time.time()
bpy.ops.screen.screenshot(filepath='{OUT}/screenshot_gui.png')
print('screenshot:', round(time.time()-t, 2), 's')
""", quit=True)
print(f"[cli] total {time.time()-t0:.1f}s", flush=True)
