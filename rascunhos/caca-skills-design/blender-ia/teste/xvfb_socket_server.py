"""Prova de conceito (codigo proprio, nao de terceiros) da arquitetura dos MCPs de Blender:
um servidor TCP numa thread + fila drenada por bpy.app.timers na thread principal.
E exatamente o mecanismo que o mcp-for-blender e o blenderwright usam, e que NAO roda em `blender -b`.

Uso: xvfb-run -a -s "-screen 0 1920x1080x24" blender --factory-startup --python xvfb_socket_server.py
Cliente: python3 xvfb_socket_client.py
"""
import bpy, socket, threading, queue, json, time, traceback, io, contextlib

PORT = 9877
T0 = time.time()
jobs, results = queue.Queue(), queue.Queue()

def serve():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.bind(("127.0.0.1", PORT))
    s.listen(1)
    print(f"[srv +{time.time()-T0:.1f}s] ouvindo em {PORT} (background={bpy.app.background})", flush=True)
    while True:
        c, _ = s.accept()
        buf = b""
        while not buf.endswith(b"\n"):
            chunk = c.recv(65536)
            if not chunk:
                break
            buf += chunk
        jobs.put(json.loads(buf.decode()))
        c.sendall((json.dumps(results.get()) + "\n").encode())
        c.close()

def drain():
    try:
        job = jobs.get_nowait()
    except queue.Empty:
        return 0.1
    out = io.StringIO()
    t = time.time()
    try:
        with contextlib.redirect_stdout(out):
            exec(job["code"], {"bpy": bpy})
        res = {"ok": True, "stdout": out.getvalue(), "s": round(time.time() - t, 2)}
    except Exception:
        res = {"ok": False, "error": traceback.format_exc()}
    results.put(res)
    if job.get("quit"):
        bpy.app.timers.register(lambda: bpy.ops.wm.quit_blender() and None, first_interval=0.5)
    return 0.05

threading.Thread(target=serve, daemon=True).start()
bpy.app.timers.register(drain, first_interval=0.5, persistent=True)
print(f"[srv +{time.time()-T0:.1f}s] timer registrado", flush=True)
