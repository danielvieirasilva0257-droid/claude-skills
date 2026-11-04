// Rotina v8: v7 redesign. Animated blurred-gradient wallpaper, fluid shape layers (organic SVG blobs and ribbons, no flat
// splits), the phone leaves the screen in half of the scenes, big app pieces with Lucide icons, animated buttons
// (button-animation + motion-oficial values), many more effects. Deterministic renderFrame(t); editor rules kept.
(() => {
const D = window.DATA, FPS = 30, DUR = 49.6;
const $ = (id) => document.getElementById(id);
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, u) => a + (b - a) * u;
const E = {
  lin: u => u, oc: u => 1 - Math.pow(1 - u, 3), ic: u => u * u * u, ioc: u => u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2,
  oe: u => u >= 1 ? 1 : 1 - Math.pow(2, -10 * u), ie: u => u <= 0 ? 0 : Math.pow(2, 10 * u - 10),
  ob: u => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); },
  oq: u => 1 - Math.pow(1 - u, 5),
};
const tw = (t, t0, t1, a, b, e = E.oc) => lerp(a, b, e(clamp((t - t0) / (t1 - t0))));
const prog = (t, t0, t1, e = E.lin) => e(clamp((t - t0) / (t1 - t0)));
let seed = 1; const rnd = (s) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ---------- words (VO timing drives everything)
const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
const Wd = (w, n = 0) => { let k = 0; for (const x of D.words) if (norm(x[0]) === norm(w)) { if (k++ === n) return x[1]; } throw new Error('word ' + w); };
const L = D.lines;

// ---------- directional motion-blur filters (feGaussianBlur x or y)
(() => { let s = ''; for (let i = 2; i <= 48; i += 2) { s += `<filter id="bx${i}" x="-50%" y="-20%" width="200%" height="140%"><feGaussianBlur stdDeviation="${i} 0"/></filter>`; s += `<filter id="by${i}" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="0 ${i}"/></filter>`; } $('filters').innerHTML = s; })();
const mblur = (dx, dy, extra = '') => { const ax = Math.abs(dx), ay = Math.abs(dy); const q = v => Math.min(48, Math.round(v / 2) * 2); if (ax < 2 && ay < 2) return extra || 'none'; return (ax >= ay ? `url(#bx${q(ax)})` : `url(#by${q(ay)})`) + (extra ? ' ' + extra : ''); };

// ---------- element helpers
const mk = (parent, cls, html, css) => { const e = document.createElement('div'); e.className = 'abs ' + (cls || ''); if (html != null) e.innerHTML = html; if (css) Object.assign(e.style, css); $(parent).appendChild(e); e._w = null; return e; };
const size = (e) => { if (!e._w) { e._w = e.offsetWidth; e._h = e.offsetHeight; } return [e._w, e._h]; };
// place element by its centre (cx, cy) with optional scale/rotation and blur from velocity function
const put = (e, o) => {
  if (!o || o.op <= 0.001) { e.style.display = 'none'; return; }
  e.style.display = 'block';
  const [w, h] = size(e);
  const x = o.x - (o.ax == null ? .5 : o.ax) * w, y = o.y - (o.ay == null ? .5 : o.ay) * h;
  e.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0)` + (o.r ? ` rotate(${o.r}deg)` : '') + (o.s != null && o.s !== 1 ? ` scale(${o.s})` : '') + (o.t3 || '');
  e.style.opacity = o.op == null ? 1 : o.op;
  e.style.filter = mblur(o.bx || 0, o.by || 0, o.f || '');
};
// generic motion: pos(t) -> {x,y,...}; blur from 1/60 s derivative
const mv = (e, t, f) => { const a = f(t); if (!a) return put(e, null); const b = f(t - 1 / 60); if (b && a.blur !== false) { a.bx = (a.bx || 0) + (a.x - b.x) * 0.55; a.by = (a.by || 0) + (a.y - b.y) * 0.55; } put(e, a); };
const span = (txt) => txt.split('').map(c => `<span style="display:inline-block;white-space:pre">${c}</span>`).join('');

// whip in from an edge then hold; whip out to an edge. dir: 'L','R','U','D'
const offs = { L: [-1400, 0], R: [1400, 0], U: [0, -1500], D: [0, 1500] };
const whip = (t, x, y, tin, din, dirIn, tout, dout, dirOut, extra = {}) => {
  if (t < tin || (tout != null && t > tout + dout)) return null;
  let px = x, py = y;
  if (t < tin + din) { const u = E.oe(clamp((t - tin) / din)); px = x + offs[dirIn][0] * (1 - u); py = y + offs[dirIn][1] * (1 - u); }
  if (tout != null && t > tout) { const u = E.ie(clamp((t - tout) / dout)); px = x + offs[dirOut][0] * u; py = y + offs[dirOut][1] * u; }
  return Object.assign({ x: px, y: py, op: 1 }, extra);
};
// letters scatter -> assemble (reference: "sua mente?")
const assemble = (e, t, t0, dur = .5, spread = 220, s0 = 3) => {
  const ch = e.children; for (let i = 0; i < ch.length; i++) {
    const d = i * .035, u = E.oc(clamp((t - t0 - d) / dur)); const r1 = rnd(i + s0) - .5, r2 = rnd(i * 3 + s0) - .5;
    ch[i].style.transform = `translate(${(r1 * spread * (1 - u)).toFixed(1)}px,${(r2 * spread * (1 - u)).toFixed(1)}px) rotate(${(r1 * 40 * (1 - u)).toFixed(1)}deg)`;
    ch[i].style.opacity = clamp(u * 1.6); ch[i].style.filter = u < 1 ? `blur(${((1 - u) * 10).toFixed(1)}px)` : 'none';
  }
};
// letters fade-stagger (reference: "V i s u a i s")
const stagger = (e, t, t0, step = .03, dur = .28) => { const ch = e.children; for (let i = 0; i < ch.length; i++) { const u = E.oc(clamp((t - t0 - i * step) / dur)); ch[i].style.opacity = u; ch[i].style.transform = `translateY(${(1 - u) * 26}px)`; ch[i].style.filter = u < 1 ? `blur(${((1 - u) * 8).toFixed(1)}px)` : 'none'; } };
const fmtBRL = (v, dec = 0) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec });

// ---------- app frames inside the phone
const appT = D.app.map(a => a[0]);
const appFile = (t) => { const rt = t - D.T0; if (rt < 0) return null; let lo = 0, hi = appT.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (appT[m] <= rt) lo = m; else hi = m - 1; } return D.app[lo][1]; };
let curSrc = '';
// touch indicators (taps from the recording)
const touchEls = D.taps.map(() => { const g = document.createElement('div'); g.className = 'abs'; g.innerHTML = '<div class="ring"></div><div class="touch"></div>'; $('touches').appendChild(g); return g; });
const drawTouches = (t) => D.taps.forEach((tp, i) => { const g = touchEls[i], dt = t - tp[0] + .04; if (dt < -0.12 || dt > .55) { g.style.display = 'none'; return; } g.style.display = 'block'; const x = tp[1] / 1170 * 492, y = tp[2] / 2532 * 1065 + 46; g.style.transform = `translate(${x}px,${y}px)`; const dot = g.children[1], ring = g.children[0]; const press = dt < 0 ? 1 + dt / .12 : 1; const rel = clamp((dt - .12) / .3); dot.style.opacity = (press * (1 - rel)).toFixed(3); dot.style.transform = `scale(${(.7 + .3 * press - .15 * rel).toFixed(3)})`; const ru = clamp((dt - .05) / .45); ring.style.opacity = dt < .05 ? 0 : (1 - ru).toFixed(3); ring.style.transform = `scale(${(1 + ru * 1.6).toFixed(3)})`; });
// boot screen: covers the browser's blank frames until the app paints its own boot screen
$('boot').innerHTML = '<div class="bc" style="position:absolute;left:0;right:0;top:470px;text-align:center;color:#fff;font-size:72px;font-weight:700;text-transform:none">Rotina</div><div class="pp" style="position:absolute;left:0;right:0;top:560px;text-align:center;color:#A3A3A3;font-size:30px">Abrindo o app…</div>';

// ---------- background + grain
const grainCtx = $('grain').getContext('2d'); const gImg = grainCtx.createImageData(540, 960);
const drawGrain = (f) => { const d = gImg.data; let s = (f * 9301 + 49297) % 233280; for (let i = 0; i < d.length; i += 4) { s = (s * 9301 + 49297) % 233280; const v = (s / 233280) * 255; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; } grainCtx.putImageData(gImg, 0, 0); };
