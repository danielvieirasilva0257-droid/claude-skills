# SPDX-License-Identifier: GPL-3.0-or-later
# Skill blender-ia (claude-skills). Codigo proprio, escrito e testado no Blender 5.2.2 LTS em 12/10/2026.
# Scripts que usam a API do Blender, quando publicados, precisam de licenca compativel com a GPL
# (https://www.blender.org/about/license/). Texto da licenca: LICENSE nesta pasta.
#
# QA DAS CURVAS antes de renderizar: le todas as f-curves da cena e mostra, por canal,
#   vmax/media (pico de velocidade sobre a media), velocidade de entrada, overshoot, paradas no meio e erro.
# Dois modos:
#   1) cena existente:  blender -b cena.blend -P verifica_curvas.py -- [--csv /abs/curvas.csv] [--cam-vmax 3]
#      (o premium.py grava a cena com --salvar). Escreve CSV quadro a quadro: canal, quadro, valor, velocidade.
#   2) --selftest:      blender -b --factory-startup -P verifica_curvas.py -- --selftest
#      confere que os handles gerados de um cubic-bezier (x1,y1,x2,y2) reproduzem a curva do Remotion/CSS
#      (erro esperado ~0,00005% do curso: so o float32) e mede o overshoot do BACK e dos handles com y > 1.
import bpy, sys, math, csv, argparse

ap = argparse.ArgumentParser()
ap.add_argument('--csv'); ap.add_argument('--selftest', action='store_true')
ap.add_argument('--cam-vmax', type=float, default=3.0, help='limite de vmax/media nos canais da camera')
args = ap.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else [])

def fcurves_da_acao(act):
    """Todas as f-curves de uma action (4.x: act.fcurves; 5.x: layers > strips > channelbags)."""
    if hasattr(act, 'fcurves'): return list(act.fcurves)
    return [fc for ly in act.layers for st in ly.strips if hasattr(st, 'channelbags')
            for cb in st.channelbags for fc in cb.fcurves]

def analisa(fc):
    """Metricas de um canal com >= 2 chaves (do 1o ao ultimo quadro com chave)."""
    k = fc.keyframe_points
    fa, fb = int(round(k[0].co.x)), int(round(k[-1].co.x)); v0, v1 = fc.evaluate(fa), fc.evaluate(fb)
    amp = v1 - v0
    if fb - fa < 2 or abs(amp) < 1e-9: return None
    vmed = 1.0 / (fb - fa); n = fb - fa + 1
    prog = [(fc.evaluate(f) - v0) / amp for f in range(fa, fb + 1)]
    vel = [(fc.evaluate(f + 0.5) - fc.evaluate(f - 0.5)) / amp for f in range(fa, fb + 1)]   # passo >= 0,5: a curva e float32
    paradas = [fa + i for i in range(int(n * 0.15), int(n * 0.85)) if abs(vel[i]) < 0.02 * vmed and prog[i] < 0.95]
    return dict(f0=fa, f1=fb, chaves=len(k), vmax=max(abs(v) for v in vel) / vmed,
                v_ini=abs(vel[0]) / vmed, v_fim=abs(vel[-1]) / vmed,
                overshoot=max(0.0, max(prog) - 1) * 100, antes=max(0.0, -min(prog)) * 100,
                paradas=paradas, linhas=[(f, fc.evaluate(f), vel[f - fa] * amp) for f in range(fa, fb + 1)])

def cubic_bezier(x1, y1, x2, y2):
    bx = lambda t: 3 * (1 - t) ** 2 * t * x1 + 3 * (1 - t) * t * t * x2 + t ** 3
    by = lambda t: 3 * (1 - t) ** 2 * t * y1 + 3 * (1 - t) * t * t * y2 + t ** 3
    def f(u):
        lo, hi = 0.0, 1.0
        for _ in range(60):
            mid = (lo + hi) / 2
            if bx(mid) < u: lo = mid
            else: hi = mid
        return by((lo + hi) / 2)
    return f

if args.selftest:
    sc = bpy.context.scene; sc.render.fps = 30
    obj = bpy.data.objects.new('T', None); sc.collection.objects.link(obj)
    def fcurve_de(idb, path, idx=0):
        ad = idb.animation_data_create()
        if ad.action is None: ad.action = bpy.data.actions.new(idb.name + 'Acao')
        act = ad.action
        if hasattr(act, 'fcurve_ensure_for_datablock'): return act.fcurve_ensure_for_datablock(idb, path, index=idx)
        return act.fcurves.find(path, index=idx) or act.fcurves.new(path, index=idx)
    def curva(idx, pts, bez):
        fc = fcurve_de(obj, 'location', idx); kps = fc.keyframe_points; kps.clear(); kps.add(len(pts))
        for kp, (f, v) in zip(kps, pts):
            kp.co = (f, v); kp.interpolation = 'BEZIER'; kp.handle_left_type = kp.handle_right_type = 'FREE'
            kp.handle_left, kp.handle_right = (f - 1, v), (f + 1, v)
        x1, y1, x2, y2 = bez; p, q = kps[0], kps[1]; dt, dv = q.co.x - p.co.x, q.co.y - p.co.y
        p.handle_right = (p.co.x + x1 * dt, p.co.y + y1 * dv); q.handle_left = (p.co.x + x2 * dt, p.co.y + y2 * dv)
        fc.update(); return fc
    print('--- erro da f-curve contra o cubic-bezier (% do curso; piso do float32 ~0,00005) ---')
    ok = True
    for i, (nome, bez) in enumerate([('expo-out', (0.16, 1, 0.3, 1)), ('dolly', (0.65, 0, 0.35, 1)),
                                     ('drift', (0.3, 0.15, 0.2, 1)), ('overshoot 1,25%', (0.2, 1.2, 0.3, 1))]):
        fc = curva(i, [(1, 0.0), (91, 1.0)], bez); alvo = cubic_bezier(*bez)
        e = max(abs(fc.evaluate(1 + k / 20) - alvo(k / 20 / 90)) for k in range(90 * 20 + 1)) * 100
        m = analisa(fc); ok &= e < 0.001
        print(f'{nome:16s} erro {e:.5f}%  vmax {m["vmax"]:.2f}x  v_ini {m["v_ini"]:.2f}x  overshoot {m["overshoot"]:.2f}%')
    print('--- overshoot do BACK (na chave de PARTIDA; o padrao 1.70158 e desenho animado) ---')
    for j, bk in enumerate((0.5, 1.0, 1.70158)):
        fc = fcurve_de(obj, 'rotation_euler', j); fc.keyframe_points.add(2); a_, b_ = fc.keyframe_points
        a_.co, b_.co = (1, 0.0), (31, 1.0); a_.interpolation = 'BACK'; a_.easing = 'EASE_OUT'; a_.back = bk; fc.update()
        print(f'back = {bk:<8} passa {(max(fc.evaluate(1 + k * 0.01) for k in range(3001)) - 1) * 100:.2f}%')
    print('RESULTADO selftest:', 'OK' if ok else 'FALHOU'); sys.exit(0 if ok else 1)

# ---------- modo cena: todos os canais com >= 2 chaves ----------
linhas_csv, avisos = [], []
print(f'{"canal":46s} {"q":>9s} {"vmax":>5s} {"v_ini":>5s} {"v_fim":>5s} {"over%":>6s}  paradas')
for act in bpy.data.actions:
    for fc in fcurves_da_acao(act):
        if len(fc.keyframe_points) < 2: continue
        m = analisa(fc)
        if not m: continue
        nome = f'{act.name}:{fc.data_path}[{fc.array_index}]'
        print(f'{nome[:46]:46s} {m["f0"]:>4d}-{m["f1"]:<4d} {m["vmax"]:5.2f} {m["v_ini"]:5.2f} {m["v_fim"]:5.2f} {m["overshoot"]:6.2f}  {m["paradas"][:4] or "-"}')
        for f, v, vl in m['linhas']: linhas_csv.append([nome, f, round(v, 6), round(vl, 6)])
        cam = 'Cam' in act.name or 'Pivo' in act.name or 'lens' in fc.data_path
        if cam and m['vmax'] > args.cam_vmax: avisos.append(f'{nome}: vmax {m["vmax"]:.1f}x > {args.cam_vmax}x (parece UI ou trailer de acao)')
        if cam and m['overshoot'] > 0.05: avisos.append(f'{nome}: camera passa {m["overshoot"]:.2f}% do ponto (use 0%)')
        if m['paradas']: avisos.append(f'{nome}: para no meio do caminho (quadros {m["paradas"][:3]}); use AUTO_CLAMPED + CONT_ACCEL')
        if m['overshoot'] > 2.5 and 'rotation' in fc.data_path: avisos.append(f'{nome}: passa {m["overshoot"]:.1f}% (rotacao de produto: 1-2%)')
if args.csv:
    with open(args.csv, 'w', newline='') as fh:
        w = csv.writer(fh); w.writerow(['canal', 'quadro', 'valor', 'velocidade_por_quadro']); w.writerows(linhas_csv)
    print('CSV:', args.csv, len(linhas_csv), 'linhas')
print('\n'.join(['AVISO: ' + a for a in avisos]) if avisos else 'Sem avisos.')
