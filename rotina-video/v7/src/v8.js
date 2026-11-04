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

// =====================================================================================================
// v8 body
// =====================================================================================================
const I = window.ICONS;
const ico = (name, size, color, sw = 2) => `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${I[name]}</svg>`;
const C = { red: '#CC0000', red2: '#FF5A5A', green: '#0F7A55', green2: '#34D399', ink: '#1E1E1E', grey: '#5E5E5E' };
const T = (parent, cls, txt, css, letters) => mk(parent, cls, letters ? span(txt) : txt, css);
const ss = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
// spring (motion-oficial / button-animation numbers): critically damped-ish response, deterministic
const spring = (t, t0, k = 650, c = 40, m = .5) => { if (t <= t0) return 0; const dt = t - t0, w0 = Math.sqrt(k / m), z = c / (2 * Math.sqrt(k * m)); if (z >= 1) return 1 - Math.exp(-w0 * dt) * (1 + w0 * dt); const wd = w0 * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w0 * dt) * (Math.cos(wd * dt) + z * w0 / wd * Math.sin(wd * dt)); };

// ---------------- section timeline (words drive everything)
const S = {
  hook: 0, rot: L[1][0], sal: L[2][0], ifd: L[3][0], fix: L[4][0], orc: L[5][0], car: L[6][0], ass: L[7][0], inv: L[8][0],
  rel: L[9][0], res: L[10][0], hab: L[11][0], tre: L[12][0], gra: L[13][0], cta: L[14][0],
};

// ---------------- 1) WALLPAPER: animated blurred gradient (soft radial blobs drifting, palette per section)
const PAL = [ // 6 blob colours per section (light, saturated, airy)
  [0, ['#FF9C8F', '#FFD1B8', '#FFE9DE', '#F7B3C2', '#FFF4EC', '#FFC4A8']],
  [S.sal - .3, ['#9EE8C6', '#D8F7E8', '#FFF6E6', '#7DD3B0', '#EAFBF3', '#C3F0DA']],
  [S.ifd - .3, ['#FFC08A', '#FFE0C2', '#FFF4E8', '#FFA97A', '#FFEBD9', '#F9D3A8']],
  [S.fix - .3, ['#8FE3BD', '#CFF6E4', '#F4FFF9', '#6FD1A6', '#E3FAF0', '#B7EED3']],
  [S.orc - .3, ['#FFD36E', '#FFE9B8', '#FFF8E6', '#FFB86B', '#FFF1CF', '#FCDCA0']],
  [S.car - .3, ['#C9B0FF', '#E9DEFF', '#FFE6D2', '#B391F7', '#F6F0FF', '#FFC9A3']],
  [S.ass - .3, ['#1C7A54', '#0E4A33', '#13583D', '#2A9B6C', '#0B3A28', '#1E6B4A']],
  [S.inv - .3, ['#A8DCFF', '#D5F0FF', '#EFFFF7', '#8FE3BD', '#E8F7FF', '#C1EBDD']],
  [S.rel - .3, ['#B9EBD5', '#FFD1C8', '#F7FFF9', '#9EE0C1', '#FFF0EC', '#FFB8AB']],
  [S.res - .3, ['#FF9C8F', '#FFD1B8', '#FFF1EA', '#F7B3C2', '#FFF4EC', '#FFC4A8']],
  [S.tre - .3, ['#8FE3BD', '#CFF6E4', '#F4FFF9', '#6FD1A6', '#E3FAF0', '#B7EED3']],
  [S.gra - .3, ['#FFA6A0', '#FFD9D4', '#FFF4F2', '#FF8C85', '#FFECEA', '#FFC1BB']],
  [S.cta - .3, ['#FF7A70', '#FFC0B5', '#FFE8E2', '#FF5A5A', '#FFF0EC', '#FF9B8C']],
];
const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const palAt = (t, i) => { let k = 0; while (k < PAL.length - 1 && PAL[k + 1][0] <= t) k++; const a = hex(PAL[k][1][i]); if (k === PAL.length - 1) return a; const nx = PAL[k + 1]; const u = ss(nx[0] - .6, nx[0] + .1, t); const b = hex(nx[1][i]); return [0, 1, 2].map(j => Math.round(lerp(a[j], b[j], u))); };
const blobs = [0, 1, 2, 3, 4, 5].map(i => { const e = document.createElement('div'); e.className = 'blob'; e.style.width = e.style.height = (900 + i * 90) + 'px'; $('wall').appendChild(e); return e; });
const BP = [[260, 380], [860, 520], [480, 1050], [180, 1550], [900, 1500], [560, 260]];
const drawWall = (t) => blobs.forEach((e, i) => {
  const [r, g, b] = palAt(t, i); const sz = 900 + i * 90;
  const x = BP[i][0] + 170 * Math.sin(t * .33 + i * 1.7) + 90 * Math.sin(t * .71 + i), y = BP[i][1] + 160 * Math.cos(t * .29 + i * 2.1) + 70 * Math.sin(t * .63 + i * .5);
  const sc = 1 + .12 * Math.sin(t * .4 + i * 1.3);
  e.style.background = `radial-gradient(closest-side,rgba(${r},${g},${b},.95),rgba(${r},${g},${b},.55) 45%,rgba(${r},${g},${b},0) 100%)`;
  e.style.transform = `translate3d(${(x - sz / 2).toFixed(1)}px,${(y - sz / 2).toFixed(1)}px,0) scale(${sc.toFixed(3)})`;
});
// dark scene: a soft dark blob that grows from the centre (no hard edge)
$('darkL').innerHTML = '<div id="darkB" class="blob" style="width:3200px;height:3200px;background:radial-gradient(closest-side,#06281C 0%,#05201A 55%,rgba(4,20,14,.97) 75%,rgba(4,20,14,0) 100%)"></div>';

// ---------------- 2) FLUID SHAPE LAYERS (organic SVG blobs + ribbons)
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent = $('shapes')) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };
svgEl('defs', {}).innerHTML = `
  <linearGradient id="gGreen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1BAA72"/><stop offset="1" stop-color="#0B6345"/></linearGradient>
  <linearGradient id="gPurple" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A78BFA"/><stop offset="1" stop-color="#5B21B6"/></linearGradient>
  <linearGradient id="gOrange" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFB25A"/><stop offset="1" stop-color="#F0662A"/></linearGradient>
  <linearGradient id="gRed" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF5A5A"/><stop offset="1" stop-color="#A30000"/></linearGradient>
  <linearGradient id="gRib1" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FF5A5A" stop-opacity="0"/><stop offset=".25" stop-color="#FF5A5A"/><stop offset=".75" stop-color="#FFB25A"/><stop offset="1" stop-color="#FFB25A" stop-opacity="0"/></linearGradient>
  <linearGradient id="gRib2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#34D399" stop-opacity="0"/><stop offset=".3" stop-color="#34D399"/><stop offset=".7" stop-color="#0F7A55"/><stop offset="1" stop-color="#0F7A55" stop-opacity="0"/></linearGradient>
  <linearGradient id="gRib3" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A78BFA" stop-opacity="0"/><stop offset=".3" stop-color="#A78BFA"/><stop offset=".7" stop-color="#60A5FA"/><stop offset="1" stop-color="#60A5FA" stop-opacity="0"/></linearGradient>
  <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2"/></filter>`;
// smooth closed blob through N wobbling points (Catmull-Rom -> cubic Bezier)
const blobD = (cx, cy, r, t, sd, amp = .12, n = 9) => {
  const p = []; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; const rr = r * (1 + amp * Math.sin(t * 1.1 + i * 2.3 + sd) + amp * .6 * Math.sin(t * .7 + i * 1.3 + sd * 2)); p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
  let d = `M${p[0][0].toFixed(1)},${p[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) { const p0 = p[(i - 1 + n) % n], p1 = p[i], p2 = p[(i + 1) % n], p3 = p[(i + 2) % n]; d += `C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`; }
  return d + 'Z';
};
// liquid shape: enters from an edge, lives, leaves to an edge. path(t) gives centre/radius.
const liquids = [];
const LQ = (fill, tin, tout, from, at, to, r, sd, op = 1, amp = .12) => { const e = svgEl('path', { fill, opacity: op }); liquids.push({ e, tin, tout, from, at, to, r, sd, op, amp }); return e; };
const drawLiquids = (t) => liquids.forEach(q => {
  if (t < q.tin || t > q.tout + .6) { q.e.setAttribute('d', ''); return; }
  const ui = E.oq(clamp((t - q.tin) / .7)), uo = E.ic(clamp((t - q.tout) / .6));
  const cx = lerp(lerp(q.from[0], q.at[0], ui), q.to[0], uo), cy = lerp(lerp(q.from[1], q.at[1], ui), q.to[1], uo);
  const r = q.r * lerp(.6, 1, ui) * lerp(1, .8, uo);
  q.e.setAttribute('d', blobD(cx + 20 * Math.sin(t * .8 + q.sd), cy + 24 * Math.cos(t * .6 + q.sd), r, t, q.sd, q.amp));
});
// ribbons: thick wavy strokes sweeping across behind the content (transitions)
const ribbons = [];
const RB = (grad, t0, dur, y0, y1, w, amp, freq, sd) => { const e = svgEl('path', { fill: 'none', stroke: `url(#${grad})`, 'stroke-width': w, 'stroke-linecap': 'round', opacity: .95 }); ribbons.push({ e, t0, dur, y0, y1, w, amp, freq, sd }); };
const drawRibbons = (t) => ribbons.forEach(b => {
  const u = (t - b.t0) / b.dur; if (u < 0 || u > 1) { b.e.setAttribute('d', ''); return; }
  const head = lerp(-300, 1500, E.ioc(clamp(u * 1.25))), tail = lerp(-300, 1500, E.ioc(clamp(u * 1.25 - .25)));
  let d = ''; for (let k = 0; k <= 40; k++) { const x = lerp(tail, head, k / 40); const yy = lerp(b.y0, b.y1, x / 1080) + b.amp * Math.sin(x * b.freq + t * 3 + b.sd); d += (k ? 'L' : 'M') + x.toFixed(1) + ',' + yy.toFixed(1); }
  b.e.setAttribute('d', d); b.e.setAttribute('stroke-width', (b.w * Math.sin(Math.PI * clamp(u))).toFixed(1));
});
// shockwave rings + sparkle bursts (impacts)
const rings = [];
const RG = (t0, x, y, col, r1 = 420, w = 10) => { const e = svgEl('circle', { cx: x, cy: y, r: 0, fill: 'none', stroke: col, 'stroke-width': w }); rings.push({ e, t0, r1, w }); };
const drawRings = (t) => rings.forEach(g => { const u = (t - g.t0) / .55; if (u < 0 || u > 1) { g.e.setAttribute('opacity', 0); return; } g.e.setAttribute('r', (g.r1 * E.oc(u)).toFixed(1)); g.e.setAttribute('opacity', (1 - u).toFixed(3)); g.e.setAttribute('stroke-width', (g.w * (1 - u) + 1).toFixed(1)); });
const sparks = [];
const SP = (t0, x, y, cols, n = 14, dist = 260, layer = 'back') => { for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + rnd(i + t0) * .5, d = dist * (.6 + .6 * rnd(i * 7 + t0)); const sz = 10 + 16 * rnd(i * 3 + t0); const shape = i % 3 === 0 ? 'border-radius:50%' : i % 3 === 1 ? 'border-radius:4px;transform:rotate(45deg)' : 'border-radius:50%;background:none!important;border:5px solid ' + cols[i % cols.length]; const e = mk(layer, '', `<div style="width:${sz}px;height:${sz}px;background:${cols[i % cols.length]};${shape}"></div>`); sparks.push({ e, t0, x, y, a, d }); } };
const drawSparks = (t) => sparks.forEach(s => { const u = (t - s.t0) / .7; if (u < 0 || u > 1) return put(s.e, null); const k = E.oq(u); put(s.e, { x: s.x + Math.cos(s.a) * s.d * k, y: s.y + Math.sin(s.a) * s.d * k + 120 * u * u, op: 1 - u * u, s: 1 - .5 * u, blur: false }); });
// shine sweep across an element (light band) - lives inside the element (its own real border)
const shine = (parent) => { if (!parent.style.position) parent.style.position = 'relative'; parent.style.overflow = 'hidden'; const e = document.createElement('div'); e.style.cssText = 'position:absolute;top:-20%;bottom:-20%;width:38%;left:-60%;background:linear-gradient(100deg,rgba(255,255,255,0),rgba(255,255,255,.55),rgba(255,255,255,0));transform:skewX(-18deg);pointer-events:none'; parent.appendChild(e); return e; };
const drawShine = (e, t, t0, dur = .7) => { const u = clamp((t - t0) / dur); e.style.left = (lerp(-60, 130, E.ioc(u))).toFixed(1) + '%'; e.style.opacity = u > 0 && u < 1 ? 1 : 0; };
// echo trail (directional colour echo, reference D): copies of a word lagging behind
const echo = (src, n, col) => [...Array(n)].map((_, i) => { const e = mk('back', src.className.replace('abs', '').trim(), src.innerHTML, { fontSize: src.style.fontSize, color: col }); e.style.opacity = 0; return e; });
// tap indicator for code-drawn buttons (ripple at the tap point; button-animation receita 11)
const tapFx = mk('back', '', '<div style="position:absolute;left:-60px;top:-60px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.55);box-shadow:0 0 0 3px rgba(255,255,255,.8)"></div>', { width: '0px', height: '0px' });
const drawTap = (t, t0, x, y) => { const dt = t - t0; if (dt < -.12 || dt > .6) return false; const press = dt < 0 ? 1 + dt / .12 : 1, rel = clamp((dt - .12) / .3), rip = clamp(dt / .6); put(tapFx, { x, y, op: press * (1 - rel) + .001, s: (.7 + .3 * press) * (1 + rip * .8), blur: false }); return true; };

// ================= PHONE RIG v8 (leaves the screen in half of the scenes) =================
const PH = { w: 520, h: 1139 };
const keys = []; const K = (t, x, y, s, ry = 0, rx = 0, e = E.ioc) => keys.push({ t, x, y, s, ry, rx, e });
const PX = 540, PY = 1085, OFFL = -1000, OFFR = 2080, OFFD = 3000;
K(0, PX, OFFD, .95, 0, 22); K(S.rot - .25, PX, OFFD, .95, 0, 22);
K(S.rot + .35, PX, PY, .95, 0, 6, E.oc); K(4.95, PX, PY, .95, 0, 0);
K(5.4, OFFL, PY - 60, .9, 28, 0, E.ic); K(5.41, OFFR, 1110, .94, -28, 4); K(S.ifd - .15, OFFR, 1110, .94, -28, 4);
K(S.ifd + .3, 655, 1110, .94, -6, 4, E.oc); K(S.fix - .25, 655, 1110, .94, -6, 4);
K(S.fix + .15, OFFR, 1060, .9, -28, 3, E.ic); K(S.fix + .16, OFFL, 1060, .88, 28, 3); K(S.car - .2, OFFL, 1060, .88, 28, 3);
K(S.car + .25, 330, 1060, .88, 10, 3, E.oc); K(S.ass - .25, 330, 1060, .88, 10, 3);
K(S.ass + .15, OFFL, 1060, .88, 28, 3, E.ic); K(S.ass + .16, PX, OFFD, .9, 0, 20); K(S.inv - .2, PX, OFFD, .9, 0, 20);
K(S.inv + .25, PX, 1060, .9, 0, 2, E.oc); K(S.rel - .25, PX, 1060, .9, 0, 2);
K(S.rel + .15, PX, -1400, .9, 0, 0, E.ic); K(S.rel + .16, PX, OFFD, .92, -360, 20); K(S.res - .1, PX, OFFD, .92, -360, 20);
K(S.res + .45, PX, 1110, .92, -720, 4, E.oc); K(S.hab - .1, PX, 1110, .92, -720, 4);
K(S.hab + .25, 720, 1060, .88, -728, 3, E.oc); K(S.tre - .25, 720, 1060, .88, -728, 3);
K(S.tre + .15, OFFR, 1060, .88, -750, 3, E.ic); K(S.tre + .16, PX, OFFD, .9, -720, 20); K(S.gra - .15, PX, OFFD, .9, -720, 20);
K(S.gra + .25, PX, 1120, .9, -720, 4, E.oc); K(S.cta - .2, PX, 1120, .9, -720, 4);
K(S.cta + .25, PX, OFFD, .9, -720, 20, E.ic); K(DUR, PX, OFFD, .9, -720, 20);
const pose = (t) => { let i = 0; while (i < keys.length - 1 && keys[i + 1].t <= t) i++; const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)]; if (b === a || t <= a.t) return a; const u = b.e(clamp((t - a.t) / (b.t - a.t))); return { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), s: lerp(a.s, b.s, u), ry: lerp(a.ry, b.ry, u), rx: lerp(a.rx, b.rx, u) }; };
const phoneOn = (t) => { const P = pose(t); return P.x > -700 && P.x < 1780 && P.y < 2550 && P.y > -1100; };
const punches = [[Wd('sabe'), .06], [Wd('hora'), .03], [Wd('faltam'), .03], [Wd('mes', 2), .04], [Wd('aqui'), .04], [Wd('dia'), .03], [Wd('mes', 3), .04]];
const punch = (t) => punches.reduce((s, [t0, a]) => s + (t >= t0 && t < t0 + .5 ? a * Math.sin(Math.PI * clamp((t - t0) / .5)) : 0), 0);
// camera punch on the whole stage for no-phone beats
const camPunch = [[Wd('saem') + .02, .035], [Wd('unica') + .05, .03], [Wd('gasta') + .05, .03], [Wd('mes', 1) + .05, .03], [Wd('real') + .05, .035], [Wd('carga') + .5, .03], [Wd('agora') + .05, .045]];
const cam = (t) => 1 + camPunch.reduce((s, [t0, a]) => s + (t >= t0 && t < t0 + .45 ? a * Math.sin(Math.PI * clamp((t - t0) / .45)) : 0), 0);

// ================= SCENE ELEMENTS =================
// --- S0 hook
const h1 = T('back', 'bc', 'QUANTO', { fontSize: '330px', color: C.red });
const h2 = T('back', 'bc', 'SOBROU', { fontSize: '330px', color: C.red });
const e1 = echo(h1, 3, '#FF8A7A'), e2 = echo(h2, 3, '#FFB25A');
const h3 = T('back', 'pp', 'do seu salário', { fontSize: '74px', fontWeight: 500, color: '#3E3E3E' }, true);
const h4 = T('back', 'pp', 'esse mês?', { fontSize: '108px', fontWeight: 700, color: C.green }, true);
const orbit = mk('back', '', `<svg width="760" height="760" viewBox="0 0 760 760"><ellipse cx="380" cy="380" rx="350" ry="350" fill="none" stroke="#2A2A2A" stroke-width="2.5" opacity=".5"/><ellipse cx="380" cy="380" rx="270" ry="270" fill="none" stroke="#2A2A2A" stroke-width="1.5" opacity=".22" stroke-dasharray="6 14"/></svg>`);
const hookIcons = ['wallet', 'credit-card', 'piggy-bank', 'receipt'].map((n, i) => mk('back', '', `<div style="width:92px;height:92px;border-radius:28px;background:#fff;box-shadow:0 14px 30px rgba(0,0,0,.16);display:flex;align-items:center;justify-content:center">${ico(n, 48, ['#CC0000', '#7C3AED', '#0F7A55', '#F0662A'][i])}</div>`));
const coinDisc = mk('back', '', `<div style="width:420px;height:420px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#1BA672,#0F7A55 60%,#0A5A3F);box-shadow:0 40px 80px rgba(15,122,85,.35)"></div>`);
const coin = mk('back', '', `<div style="width:250px;height:250px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFF6C8,#F4C542 35%,#C8901A 75%,#8E5F0C);box-shadow:inset 0 0 0 10px rgba(255,255,255,.25),inset 0 -12px 20px rgba(0,0,0,.25),0 20px 40px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center"><span class="bc" style="font-size:120px;color:#7A4E06;text-shadow:0 2px 0 rgba(255,255,255,.5)">R$</span></div>`);
// --- S1
const rot = T('back', 'bc', 'ROTINA', { fontSize: '250px', color: C.red }, true);
const rotIcons = ['list-checks', 'dumbbell', 'bar-chart-2', 'wallet'].map(n => mk('back', '', `<div style="width:110px;height:110px;border-radius:34px;background:#fff;box-shadow:0 16px 34px rgba(0,0,0,.16);display:flex;align-items:center;justify-content:center">${ico(n, 56, '#CC0000')}</div>`));
// --- S2 saldo (NO phone): big app card + salary chip + bill with "Paguei" button
const salChip = mk('back', '', `<div style="display:flex;align-items:center;gap:22px;background:#fff;border-radius:34px;padding:22px 34px 22px 22px;box-shadow:0 20px 44px rgba(0,0,0,.14)"><div style="width:96px;height:96px;border-radius:28px;background:rgba(52,211,153,.18);display:flex;align-items:center;justify-content:center">${ico('arrow-up-right', 54, '#0F7A55', 2.6)}</div><div><div class="pp" style="font-size:30px;font-weight:500;color:#5E5E5E">Salário caiu</div><div class="bc" style="font-size:96px;color:#0F7A55">+ R$ 4.800</div></div></div>`);
const saldoCard = mk('back', '', `<div style="width:820px;background:#151515;border:2px solid #2A2A2A;border-radius:44px;padding:44px 50px;box-shadow:0 40px 90px rgba(0,0,0,.35)"><div class="pp" style="font-size:34px;color:#A3A3A3">Saldo do período</div><div class="bc" id="v8saldo" style="font-size:190px;color:#fff;line-height:1;margin-top:8px;text-shadow:0 0 24px rgba(255,255,255,.25)">R$ 3.480</div><div style="display:flex;gap:30px;margin-top:26px"><div style="flex:1;display:flex;gap:18px;align-items:center"><div style="width:74px;height:74px;border-radius:22px;background:rgba(52,211,153,.14);display:flex;align-items:center;justify-content:center">${ico('arrow-up-right', 40, '#34D399', 2.4)}</div><div><div class="pp" style="font-size:26px;color:#A3A3A3">Entradas</div><div class="bc" style="font-size:58px;color:#34D399">R$ 5.400</div></div></div><div style="flex:1;display:flex;gap:18px;align-items:center"><div style="width:74px;height:74px;border-radius:22px;background:rgba(204,0,0,.18);display:flex;align-items:center;justify-content:center">${ico('arrow-down-right', 40, '#FF5A5A', 2.4)}</div><div><div class="pp" style="font-size:26px;color:#A3A3A3">Saídas</div><div class="bc" id="v8saidas" style="font-size:58px;color:#FF5A5A">R$ 1.920</div></div></div></div></div>`);
const bill = mk('back', '', `<div style="width:820px;background:#FFF8E6;border:3px solid #FBBF24;border-radius:40px;padding:30px 34px;display:flex;align-items:center;gap:24px;box-shadow:0 24px 50px rgba(0,0,0,.14)"><div style="width:90px;height:90px;border-radius:26px;background:rgba(251,191,36,.25);display:flex;align-items:center;justify-content:center" id="bellW">${ico('bell', 48, '#B7791F', 2.4)}</div><div style="flex:1"><div class="pp" style="font-size:36px;font-weight:700;color:#1E1E1E">Fatura Nubank vence hoje</div><div class="pp" style="font-size:30px;color:#6B6B6B">R$ 1.890 · conta fixa</div></div><div class="btn" id="payBtn" style="width:290px;height:104px;background:#1E1E1E;border-bottom:6px solid #000"><span class="pp" id="payA" style="font-size:36px;font-weight:700;color:#fff;display:flex;align-items:center;gap:10px">${ico('check', 36, '#fff', 3)}Paguei</span><span class="pp" id="payB" style="position:absolute;font-size:36px;font-weight:700;color:#fff;display:flex;align-items:center;gap:10px;opacity:0">${ico('check', 36, '#fff', 3)}Pago</span></div></div>`);
// --- S3 iFood (phone)
const g1 = T('back', 'bc', 'GASTOU NO iFOOD?', { fontSize: '150px', color: C.red, textTransform: 'none' });
const g2 = T('back', 'bc', 'ANOTA NA HORA.', { fontSize: '150px', color: C.ink });
const chipI = (icon, txt, bg) => mk('back', '', `<div style="display:flex;align-items:center;gap:16px;background:${bg};padding:20px 30px 20px 20px;border-radius:44px;box-shadow:0 18px 36px rgba(0,0,0,.18)"><span class="iw" style="display:inline-flex;position:relative;width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,.22);align-items:center;justify-content:center"><span class="i1" style="position:absolute">${ico('sparkles', 36, '#fff', 2.4)}</span><span class="i2" style="position:absolute">${ico(icon, 36, '#fff', 2.4)}</span></span><span class="pp" style="font-size:44px;font-weight:700;color:#fff">${txt}</span></div>`);
const cVal = chipI('banknote', 'R$ 58', '#1E1E1E'), cCat = chipI('utensils', 'Alimentação', '#E07A24'), cCard = chipI('credit-card', 'Crédito', '#7C3AED');
const iconSwap = (e, t, t0) => { const u = clamp((t - t0) / .3); const a = e.querySelector('.i1'), b = e.querySelector('.i2'); a.style.opacity = 1 - clamp(u * 2); a.style.transform = `scale(${(1 - .75 * clamp(u * 2)).toFixed(3)})`; a.style.filter = `blur(${(4 * clamp(u * 2)).toFixed(1)}px)`; const v = clamp(u * 2 - 1); b.style.opacity = v; b.style.transform = `scale(${(.25 + .75 * E.oc(v)).toFixed(3)})`; b.style.filter = `blur(${(4 * (1 - v)).toFixed(1)}px)`; };
// --- S4 conta fixa (NO phone): segmented control with sliding highlight (spring 650/40/0.5)
const a1 = T('back', 'bc', 'CONTA FIXA', { fontSize: '170px', color: C.ink });
const a2 = T('back', 'pp', 'você agenda uma vez só', { fontSize: '54px', fontWeight: 500, color: '#2E2E2E' }, true);
const badge = mk('back', '', `<div style="width:250px;height:250px;border-radius:76px;background:#fff;box-shadow:0 30px 60px rgba(0,0,0,.18);display:flex;align-items:center;justify-content:center;position:relative"><span id="calI">${ico('calendar-check', 130, '#0F7A55', 2)}</span><span id="repI" style="position:absolute;right:-26px;bottom:-26px;width:110px;height:110px;border-radius:50%;background:#CC0000;display:flex;align-items:center;justify-content:center;box-shadow:0 14px 30px rgba(204,0,0,.35)">${ico('repeat', 58, '#fff', 2.6)}</span></div>`);
const seg = mk('back', '', `<div style="position:relative;width:940px;height:150px;border-radius:75px;background:#fff;box-shadow:0 26px 60px rgba(0,0,0,.18);display:flex"><div id="segHi" style="position:absolute;top:12px;left:12px;width:300px;height:126px;border-radius:63px;background:#CC0000;box-shadow:0 10px 26px rgba(204,0,0,.4)"></div>${['Único', 'Mensal', 'Parcelado'].map((s, i) => `<div class="bc sg" style="position:relative;flex:1;display:flex;align-items:center;justify-content:center;font-size:66px;color:#1E1E1E;text-transform:none">${s}</div>`).join('')}</div>`);
const aviso = mk('back', '', `<div style="display:flex;align-items:center;gap:18px;background:#1E1E1E;padding:22px 34px 22px 22px;border-radius:44px;box-shadow:0 18px 36px rgba(0,0,0,.2)"><span style="width:70px;height:70px;border-radius:50%;background:rgba(251,191,36,.2);display:inline-flex;align-items:center;justify-content:center">${ico('bell', 40, '#FBBF24', 2.4)}</span><span class="pp" style="font-size:38px;font-weight:700;color:#fff">Aviso 1 dia antes</span></div>`);
// --- S5 orçamentos (NO phone)
const b1 = T('back', 'bc', 'CADA CATEGORIA', { fontSize: '140px', color: C.ink });
const b3 = T('back', 'bc', 'UM LIMITE.', { fontSize: '150px', color: C.red });
const budRow = (icon, col, name, val, pctTxt) => mk('back', '', `<div style="width:900px;background:#fff;border-radius:40px;padding:30px 36px;box-shadow:0 22px 48px rgba(0,0,0,.13);position:relative"><div style="display:flex;align-items:center;gap:24px"><div style="width:92px;height:92px;border-radius:28px;background:${col}22;display:flex;align-items:center;justify-content:center">${ico(icon, 50, col, 2.4)}</div><div style="flex:1"><div class="pp" style="font-size:44px;font-weight:700;color:#1E1E1E">${name}</div><div class="pp vv" style="font-size:30px;color:#6B6B6B">${val}</div></div><div class="bc pc" style="font-size:72px;color:${col}">${pctTxt}</div></div><div style="height:34px;border-radius:17px;background:#E6E6E6;margin-top:22px;position:relative;overflow:hidden"><i style="position:absolute;left:0;top:0;bottom:0;width:0;border-radius:17px;background:${col}"></i></div></div>`);
const rA = budRow('utensils', '#F0662A', 'Alimentação', 'R$ 58 de R$ 400', '15%'), rM = budRow('shopping-cart', '#65A30D', 'Mercado', 'R$ 420 de R$ 650', '65%'), rO = budRow('sparkles', '#CC0000', 'Outros', 'R$ 1.890 de R$ 200', '945%');
const estourou = mk('back', '', `<div class="bc" style="font-size:70px;color:#fff;background:#CC0000;padding:14px 26px 8px;border-radius:16px;transform:rotate(-6deg);box-shadow:0 14px 30px rgba(204,0,0,.4)">ESTOUROU</div>`);
// --- S6 cartões (phone + 3D cards)
const ccard = (name, last, grad, fat, pct) => mk('back', '', `<div class="card" style="background:${grad}"><div style="display:flex;justify-content:space-between"><div><div class="pp" style="font-size:34px;font-weight:700">${name}</div><div class="pp" style="font-size:26px;opacity:.75;letter-spacing:.2em">•••• ${last}</div></div><div style="width:64px;height:46px;border-radius:10px;background:linear-gradient(135deg,#F5D77A,#B8892A)"></div></div><div class="pp" style="font-size:22px;opacity:.75;margin-top:30px">Fatura atual</div><div class="bc" style="font-size:72px;text-transform:none">${fat}</div><div style="height:10px;border-radius:5px;background:rgba(255,255,255,.25);margin-top:10px;position:relative"><i class="cbar" style="position:absolute;left:0;top:0;bottom:0;width:0;border-radius:5px;background:#fff" data-p="${pct}"></i></div></div>`);
const card1 = ccard('Nubank Ultravioleta', '4831', 'linear-gradient(135deg,#7C3AED 0%,#4C1D95 55%,#2E1065 100%)', 'R$ 1.890', 24);
const card2 = ccard('Inter Black', '2266', 'linear-gradient(135deg,#F97316 0%,#C2410C 55%,#7C2D12 100%)', 'R$ 620', 12);
const sh1 = shine(card1.firstChild), sh2 = shine(card2.firstChild);
const k1 = T('back', 'bc', 'FATURA', { fontSize: '120px', color: C.ink });
const k2 = mk('back', '', `<div class="pp" style="font-size:40px;font-weight:700;color:#fff;background:#1E1E1E;padding:20px 28px 16px;border-radius:40px;display:flex;align-items:center;gap:12px">${ico('pie-chart', 38, '#fff', 2.4)}24% do limite</div>`);
const k3 = mk('back', '', `<div style="background:#fff;border-radius:26px;padding:22px 28px;width:440px;box-shadow:0 18px 40px rgba(0,0,0,.18)"><div class="lab" style="color:#6B6B6B;font-size:26px">Parcelas que faltam</div><div style="display:flex;justify-content:space-between;margin-top:10px"><span class="pp" style="font-size:34px;font-weight:700;color:#232323">Monitor 4K</span><span class="bc" style="font-size:44px;color:#7C3AED">6/10</span></div><div style="display:flex;justify-content:space-between"><span class="pp" style="font-size:34px;font-weight:700;color:#232323">iPhone 15</span><span class="bc" style="font-size:44px;color:#7C3AED">9/12</span></div></div>`);
// --- S7 assinaturas (NO phone, dark, neon icons orbiting into the total)
const neon = (c) => `0 0 8px rgba(255,255,255,.75),0 0 24px ${c},0 0 60px ${c}`;
const s1 = T('back', 'bc', 'ASSINATURAS', { fontSize: '150px', color: '#fff', textShadow: neon('rgba(52,211,153,.8)') });
const subRing = mk('back', '', `<svg width="760" height="760" viewBox="0 0 760 760"><circle cx="380" cy="380" r="330" fill="none" stroke="#34D399" stroke-width="3" opacity=".55" style="filter:drop-shadow(0 0 10px #34D399)"/><circle cx="380" cy="380" r="250" fill="none" stroke="#34D399" stroke-width="1.5" opacity=".3" stroke-dasharray="4 12"/></svg>`);
const subs = [['palette', '#F472B6', 149], ['dumbbell', '#34D399', 120], ['film', '#FF5A5A', 44.9], ['play-circle', '#FF8A3D', 24.9], ['headphones', '#22D3EE', 21.9], ['cloud', '#A78BFA', 4.9]].map(([n, c, v]) => ({ e: mk('back', '', `<div style="width:130px;height:130px;border-radius:40px;border:3px solid ${c};background:rgba(4,20,14,.6);box-shadow:0 0 16px ${c},inset 0 0 14px ${c}55;display:flex;align-items:center;justify-content:center">${ico(n, 64, c, 2.2)}</div>`), c, v }));
const subN = mk('back', '', `<div class="bc" id="subN" style="font-size:200px;color:#fff;text-shadow:${neon('rgba(124,255,178,.9)')}">R$ 0</div>`);
const s3 = T('back', 'sc', 'todo mês', { fontSize: '150px', color: '#C9FFE0', textShadow: '0 0 12px #7CFFB2,0 0 34px #2BE38A,0 0 70px #19B56C' });
// --- S8 investimentos (phone)
const i1 = T('back', 'bc', 'INVESTIMENTOS', { fontSize: '132px', color: C.ink });
const i2 = mk('back', '', `<div style="display:flex;align-items:baseline;gap:18px"><span class="bc" id="rendN" style="font-size:230px;color:#CC0000">R$ 224</span><span class="pp" style="font-size:56px;font-weight:700;color:#232323">/mês</span></div>`);
const i3 = T('back', 'pp', 'que a sua reserva rende', { fontSize: '52px', fontWeight: 500, color: '#2E2E2E' }, true);
const donut = mk('back', '', (() => { const seg = [[30, '#34D399'], [39, '#60A5FA'], [14, '#FB923C'], [17, '#A78BFA']]; let a = 0, s = ''; const R = 120, c = 2 * Math.PI * R; seg.forEach(([p, col]) => { s += `<circle cx="160" cy="160" r="${R}" fill="none" stroke="${col}" stroke-width="56" stroke-dasharray="${(p / 100 * c).toFixed(1)} ${c.toFixed(1)}" stroke-dashoffset="${(-a / 100 * c).toFixed(1)}"/>`; a += p; }); return `<svg width="320" height="320" viewBox="0 0 320 320" style="transform:rotate(-90deg);filter:drop-shadow(0 20px 30px rgba(0,0,0,.25))">${s}</svg>`; })());
const piggy = mk('back', '', `<div style="width:210px;height:210px;border-radius:64px;background:#fff;box-shadow:0 26px 50px rgba(0,0,0,.18);display:flex;align-items:center;justify-content:center">${ico('piggy-bank', 120, '#0F7A55', 2)}</div>`);
const coinsF = [0, 1, 2, 3].map(i => mk('back', '', `<div style="width:70px;height:70px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFF6C8,#F4C542 40%,#C8901A);box-shadow:0 8px 16px rgba(0,0,0,.25)"></div>`));
// --- S9 relatório (NO phone): big chart card drawing itself
const r2 = T('back', 'pp', 'pra onde foi', { fontSize: '70px', fontWeight: 500, color: '#2E2E2E' }, true);
const r3 = T('back', 'bc', 'CADA REAL', { fontSize: '210px', color: C.red });
const r3r = T('back', 'bc', 'CADA REAL', { fontSize: '210px', color: C.red }); r3r.style.webkitMaskImage = 'linear-gradient(0deg,rgba(0,0,0,.45),rgba(0,0,0,0) 70%)';
const FL = [[6.0, 3.5], [6.3, 3.2], [5.9, 3.6], [6.5, 2.9], [6.7, 3.4], [5.4, 1.9]], MO = ['Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov'];
const chart = mk('back', '', `<div style="width:900px;height:720px;background:#151515;border:2px solid #2A2A2A;border-radius:44px;padding:40px 44px;box-shadow:0 40px 90px rgba(0,0,0,.35);position:relative"><div style="display:flex;justify-content:space-between;align-items:center"><span class="bc" style="font-size:44px;color:#A3A3A3;letter-spacing:.08em">FLUXO DE CAIXA · 6 MESES</span>${ico('bar-chart-2', 46, '#A3A3A3', 2.2)}</div><div style="position:absolute;left:44px;right:44px;bottom:110px;height:430px;display:flex;align-items:flex-end;justify-content:space-around">${FL.map(([a, b], i) => `<div style="display:flex;gap:10px;align-items:flex-end;height:100%"><i class="cb" style="display:block;width:46px;height:${a / 7 * 100}%;background:#34D399;border-radius:10px 10px 0 0;transform-origin:50% 100%"></i><i class="cb" style="display:block;width:46px;height:${b / 7 * 100}%;background:#E3262B;border-radius:10px 10px 0 0;transform-origin:50% 100%"></i></div>`).join('')}</div><svg style="position:absolute;left:44px;bottom:110px" width="812" height="430" viewBox="0 0 812 430"><path id="saldoLine" d="M20,330 C140,300 200,250 300,240 S470,170 560,120 S720,60 800,40" fill="none" stroke="#FBBF24" stroke-width="10" stroke-linecap="round" stroke-dasharray="1100" stroke-dashoffset="1100" style="filter:drop-shadow(0 0 10px rgba(251,191,36,.7))"/></svg><div style="position:absolute;left:44px;right:44px;bottom:50px;display:flex;justify-content:space-around">${MO.map(m => `<span class="pp" style="font-size:28px;color:#808080;width:102px;text-align:center">${m}</span>`).join('')}</div></div>`);
// --- S10 o resto
const z1 = T('back', 'bc', 'O RESTO DA ROTINA', { fontSize: '124px', color: C.ink }, true);
const z2 = T('back', 'pp', 'também mora aqui.', { fontSize: '60px', fontWeight: 500, color: C.red }, true);
const tabIcons = [['list-checks', '#CC0000'], ['dumbbell', '#F0662A'], ['bar-chart-2', '#2563EB'], ['wallet', '#0F7A55'], ['flame', '#E3262B'], ['target', '#7C3AED']].map(([n, c]) => mk('back', '', `<div style="width:116px;height:116px;border-radius:36px;background:#fff;box-shadow:0 16px 34px rgba(0,0,0,.16);display:flex;align-items:center;justify-content:center">${ico(n, 60, c, 2.2)}</div>`));
// --- S11 hábitos (phone)
const hb1 = T('back', 'bc', 'CHECKLIST', { fontSize: '130px', color: C.red });
const hb2 = T('back', 'pp', 'de hábitos', { fontSize: '62px', fontWeight: 500, color: '#2E2E2E' }, true);
const habit = (txt) => mk('back', '', `<div style="display:flex;align-items:center;gap:22px;background:#fff;border-radius:30px;padding:16px 26px 16px 16px;box-shadow:0 14px 30px rgba(0,0,0,.12)"><div class="chk" style="width:66px;height:66px;border-radius:18px"><b style="border-radius:18px"></b><svg width="40" height="36" viewBox="0 0 44 40" style="left:8px;top:11px"><path d="M4 21 L16 33 L40 6" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="60" stroke-dashoffset="60"/></svg></div><span class="pp" style="font-size:36px;font-weight:700;color:#232323">${txt}</span></div>`);
const hbs = ['Beber 3L de água', 'Dieta', 'Ler 10 páginas', 'Treinar'].map(habit);
const streak = mk('back', '', `<div style="display:flex;align-items:center;gap:12px;background:#CC0000;padding:16px 26px 14px 18px;border-radius:40px;box-shadow:0 14px 30px rgba(204,0,0,.35)">${ico('flame', 46, '#fff', 2.4)}<span class="bc" style="font-size:54px;color:#fff">4 DE 5 HOJE</span></div>`);
// --- S12 treino (NO phone): exercise card + 3D "feito" button (button-animation receita 12)
const tr1 = T('back', 'bc', 'TREINO', { fontSize: '200px', color: C.ink });
const exCard = mk('back', '', `<div style="width:900px;background:#151515;border:2px solid #2A2A2A;border-radius:44px;padding:40px 44px;box-shadow:0 40px 90px rgba(0,0,0,.35)"><div style="display:flex;align-items:center;gap:24px"><div style="width:110px;height:110px;border-radius:32px;background:rgba(251,191,36,.16);display:flex;align-items:center;justify-content:center">${ico('dumbbell', 64, '#FBBF24', 2.2)}</div><div><div class="pp" style="font-size:48px;font-weight:700;color:#fff">Desenvolvimento</div><div class="pp" style="font-size:30px;color:#A3A3A3">Meta 8 a 12 reps · sugestão do app</div></div></div><div style="display:flex;align-items:baseline;gap:14px;margin-top:26px"><span class="bc" id="kgN" style="font-size:230px;color:#fff;line-height:.9;text-shadow:0 0 18px rgba(255,255,255,.45),0 0 50px rgba(251,191,36,.45)">47,5</span><span class="bc" style="font-size:100px;color:#FBBF24">KG</span></div><div class="btn" id="doneBtn" style="margin-top:30px;width:100%;height:130px;background:#34D399;border-bottom:10px solid #0F7A55"><span class="bc" id="doneA" style="font-size:70px;color:#06281C;display:flex;align-items:center;gap:16px">Marcar como feito</span><span class="bc" id="doneB" style="position:absolute;font-size:70px;color:#06281C;display:flex;align-items:center;gap:16px;opacity:0">${ico('check', 70, '#06281C', 3.4)}FEITO</span></div></div>`);
const tr3 = T('back', 'pp', 'série a série', { fontSize: '60px', fontWeight: 700, color: C.green }, true);
// --- S13 gráficos (phone)
const gr1 = T('back', 'bc', 'GRÁFICOS', { fontSize: '190px', color: C.ink });
const gr2 = T('back', 'bc', 'SEMANA', { fontSize: '170px', color: C.red });
const gr3 = T('back', 'bc', '+ MÊS', { fontSize: '170px', color: C.ink });
const barsBg = mk('back', '', '', { width: '1080px', height: '700px' });
const barH = [0.30, 0.66, 0.66, 0.52, 0.52, 0.30, 0.80, 0.58];
barsBg.innerHTML = barH.map((h, i) => `<i style="position:absolute;bottom:0;left:${18 + i * 133}px;width:96px;height:${h * 620}px;background:linear-gradient(180deg,#FF5A5A,#A30000);border-radius:20px 20px 0 0;transform-origin:50% 100%"></i>`).join('');
// --- S14 CTA: big 3D button with rotating gradient ring + shimmer, pressed on "agora"
const c1 = T('back', 'bc', 'BAIXE O ROTINA', { fontSize: '150px', color: C.ink });
const ctaWrap = mk('back', '', `<div style="position:relative;width:860px;height:220px"><div style="position:absolute;inset:-12px;border-radius:72px;overflow:hidden"><div id="ctaRing" style="position:absolute;left:50%;top:50%;width:1300px;height:1300px;margin:-650px 0 0 -650px;background:conic-gradient(from 0deg,#FF5A5A,#FFB25A,#FFFFFF,#FF5A5A,#CC0000,#FF5A5A)"></div></div><div class="btn" id="ctaBtn" style="position:absolute;inset:0;border-radius:62px;background:linear-gradient(180deg,#E3262B,#B30000);border-bottom:14px solid #7A0000;box-shadow:0 30px 70px rgba(204,0,0,.45)"><span class="bc" style="font-size:118px;color:#fff;display:flex;align-items:center;gap:22px">${ico('smartphone', 96, '#fff', 2.4)}BAIXE AGORA</span></div></div>`);
const ctaShine = shine($('ctaBtn'));
// end card
const endBg = mk('end', '', '', { width: '1080px', height: '1920px', background: '#0D0F16' });
const endGlow = mk('end', '', '', { width: '1000px', height: '1000px', background: 'radial-gradient(closest-side,rgba(227,38,43,.38),rgba(227,38,43,.10) 50%,rgba(0,0,0,0))' });
const endLogo = mk('end', '', `<div style="display:flex;align-items:center;gap:26px"><div style="width:150px;height:150px;border-radius:38px;background:#CC0000;display:flex;align-items:center;justify-content:center;box-shadow:0 0 40px rgba(255,60,60,.7),0 0 110px rgba(204,0,0,.55)"><svg width="92" height="80" viewBox="0 0 92 80"><path id="logoChk" d="M8 42 L34 68 L84 10" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="120" stroke-dashoffset="120"/></svg></div><span class="bc" style="font-size:170px;color:#fff;letter-spacing:.01em">ROTINA</span></div>`);
const endBar = mk('end', '', `<div style="position:relative;width:760px;height:110px"><div class="eb" style="position:absolute;inset:0;border-radius:24px;background:#E3262B"></div><div class="eb" style="position:absolute;inset:0;border-radius:24px;background:#22E1E8"></div><div style="position:absolute;inset:0;border-radius:24px;background:#fff;display:flex;align-items:center;padding:0 34px;gap:22px"><svg width="44" height="44" viewBox="0 0 44 44"><circle cx="19" cy="19" r="13" fill="none" stroke="#111" stroke-width="5"/><path d="M29 29 L40 40" stroke="#111" stroke-width="5" stroke-linecap="round"/></svg><span class="pp" id="typed" style="font-size:50px;font-weight:700;color:#111"></span><span id="caret" style="width:4px;height:56px;background:#111"></span></div></div>`);
const endLink = T('end', 'bc', 'LINK NA BIO', { fontSize: '120px', color: '#FFE9E9', textShadow: '0 0 8px #fff,0 0 22px #FF4D4D,0 0 48px #E3262B,0 0 90px #CC0000' }, true);
const scan = mk('fx', '', '', { width: '1080px', height: '1920px' });
const statC = document.createElement('canvas'); statC.width = 270; statC.height = 480; Object.assign(statC.style, { position: 'absolute', left: 0, top: 0, width: '1080px', height: '1920px', imageRendering: 'pixelated', display: 'none', opacity: .5 }); $('fx').appendChild(statC); const statX = statC.getContext('2d');

// ---------------- fluid shapes per scene (behind the content) + ribbons, rings, sparks
LQ('url(#gGreen)', S.sal - .1, S.ifd - .3, [1500, 2100], [930, 1650], [1500, 2400], 520, 1.1, .9);
LQ('url(#gGreen)', S.sal + .1, S.ifd - .3, [-500, -300], [60, 250], [-600, -400], 300, 2.7, .35);
LQ('url(#gOrange)', S.ifd - .1, S.fix - .3, [-600, 1100], [40, 1150], [-700, 1300], 420, 3.3, .85);
LQ('url(#gGreen)', S.fix - .15, S.orc - .3, [-700, 1100], [170, 1180], [-900, 1200], 640, .4, .95);
LQ('url(#gGreen)', S.fix, S.orc - .3, [1700, 300], [1000, 420], [1700, 200], 260, 5.1, .4);
LQ('url(#gOrange)', S.orc - .1, S.car - .3, [1700, 1900], [960, 1700], [1800, 2300], 560, 2.2, .85);
LQ('url(#gPurple)', S.car - .1, S.ass - .3, [1800, 900], [900, 900], [1900, 900], 520, 4.4, .9);
LQ('url(#gGreen)', S.inv - .1, S.rel - .3, [540, 2700], [540, 1980], [540, 2800], 780, 1.9, .95, .06);
LQ('url(#gRed)', S.rel - .1, S.res - .3, [-600, 2000], [100, 1750], [-700, 2200], 460, 3.9, .85);
LQ('url(#gGreen)', S.res + .1, S.hab - .2, [1700, -200], [1000, 160], [1800, -300], 300, .9, .5);
LQ('url(#gGreen)', S.tre - .15, S.gra - .3, [1800, 1100], [930, 1150], [1900, 1200], 640, 1.4, .95);
LQ('url(#gRed)', S.cta - .1, DUR, [540, 2700], [540, 1150], [540, 1150], 560, 2.8, .9);
[[S.rot + .1, 'gRib1', 1500, 700], [S.sal - .15, 'gRib2', 300, 1500], [S.ifd - .15, 'gRib1', 1600, 500], [S.fix - .2, 'gRib2', 400, 1700], [S.orc - .2, 'gRib1', 1700, 300], [S.car - .2, 'gRib3', 300, 1600], [S.inv - .2, 'gRib2', 1600, 400], [S.rel - .2, 'gRib1', 300, 1500], [S.res - .2, 'gRib3', 1600, 300], [S.tre - .2, 'gRib2', 300, 1600], [S.gra - .2, 'gRib1', 1600, 400], [S.cta - .2, 'gRib1', 300, 1400]]
  .forEach(([t0, g, y0, y1], i) => { RB(g, t0, .9, y0, y1, 150, 80, .006, i); RB(g, t0 + .08, .9, y0 + 120, y1 + 120, 60, 60, .008, i + 3); });
RG(Wd('rotina') + .3, 540, 360, '#CC0000', 520, 12); RG(Wd('saem') + .05, 860, 1340, '#0F7A55', 380, 10); RG(Wd('gasta') + .1, 540, 1250, '#CC0000', 480, 12);
RG(Wd('real') + .1, 540, 430, '#CC0000', 560, 12); RG(Wd('agora') + .05, 540, 1150, '#FFFFFF', 640, 14); RG(Wd('carga') + .55, 540, 1450, '#34D399', 520, 12);
SP(.95, 540, 1430, ['#F4C542', '#0F7A55', '#FF5A5A', '#fff']); SP(Wd('salario', 1) + .25, 420, 470, ['#F4C542', '#34D399', '#0F7A55'], 16, 300);
SP(Wd('saem') + .1, 880, 1330, ['#34D399', '#FBBF24', '#fff'], 12, 220); SP(Wd('carga') + .55, 540, 1450, ['#34D399', '#FBBF24', '#fff'], 16, 320);
SP(Wd('sai') - .1, 540, 1040, ['#7CFFB2', '#34D399', '#fff'], 18, 380); SP(Wd('agora') + .05, 540, 1150, ['#FFB25A', '#fff', '#FF5A5A'], 18, 420);

// ================= RENDER =================
window.renderFrame = async (t) => {
  const f = Math.round(t * FPS);
  put(tapFx, null); drawGrain(f); drawWall(t); drawLiquids(t); drawRibbons(t); drawRings(t); drawSparks(t);
  // dark scene blob
  { const tin = S.ass - .35, tout = S.inv - .35; const u = ss(tin, tin + .55, t) * (1 - ss(tout, tout + .45, t)); const db = $('darkB'); db.style.display = u > 0 ? 'block' : 'none'; db.style.transform = `translate3d(${540 - 1600}px,${1000 - 1600}px,0) scale(${(u * 1.05).toFixed(3)})`; db.style.opacity = clamp(u * 1.4); }
  $('stage').style.transform = `scale(${cam(t).toFixed(4)})`;

  // ---------- S0 hook
  const out0 = S.rot - .32;
  mv(h1, t, tt => whip(tt, 540, 360, 0.0, .42, 'L', out0, .32, 'U'));
  mv(h2, t, tt => whip(tt, 540, 640, Wd('sobrou') - .05, .4, 'R', out0 + .03, .32, 'U'));
  [[e1, h1, 0.0, 'L', 360], [e2, h2, Wd('sobrou') - .05, 'R', 640]].forEach(([es, src, tin, dir, y]) => es.forEach((e, k) => { const lag = (k + 1) * .045; const o = whip(t - lag, 540, y, tin, .42, dir, null, 0, dir); if (!o || t > tin + .6) return put(e, null); o.op = .5 - k * .14; o.x += (dir === 'L' ? -1 : 1) * (k + 1) * 8; put(e, o); }));
  mv(h3, t, tt => whip(tt, 540, 838, Wd('salario'), .01, 'D', out0 + .06, .32, 'U')); assemble(h3, t, Wd('salario') - .1, .45, 260, 5);
  mv(h4, t, tt => whip(tt, 540, 965, Wd('esse'), .01, 'D', out0 + .09, .32, 'U')); assemble(h4, t, Wd('esse') - .08, .42, 300, 9);
  {
    const t0 = .55, cy = 1430; const s = tw(t, t0, t0 + .55, 0, 1, E.ob); const up = t > out0 + .1 ? E.ie(clamp((t - out0 - .1) / .32)) * -1700 : 0; const gone = t < t0 || t > out0 + .45;
    put(coinDisc, gone ? null : { x: 540, y: cy + up, s, op: 1, by: up ? -40 : 0 });
    put(orbit, gone ? null : { x: 540, y: cy + up, s: tw(t, t0 + .1, t0 + .7, .6, 1), op: tw(t, t0 + .1, t0 + .5, 0, 1), r: t * 20, by: up ? -40 : 0 });
    const spin = tw(t, t0, t0 + 1.2, 0, 1, E.oc);
    put(coin, t < t0 + .1 || gone ? null : { x: 540, y: cy + up - 6 * Math.sin(t * 3), s: tw(t, t0 + .1, t0 + .6, 0, 1, E.ob), op: 1, t3: ` rotateY(${(360 * (1 - spin)).toFixed(1)}deg)`, by: up ? -40 : 0 });
    hookIcons.forEach((d, i) => { const a = t * 1.3 + i * Math.PI / 2, rr = 350 * tw(t, t0 + .1, t0 + .8, .2, 1); put(d, t < t0 + .15 || gone ? null : { x: 540 + Math.cos(a) * rr, y: cy + up + Math.sin(a) * rr * .92, op: tw(t, t0 + .15, t0 + .5, 0, 1), s: .8 + .2 * (Math.sin(a) * .5 + .5), r: Math.sin(a + t) * 8, by: up ? -40 : 0 }); });
  }

  // ---------- S1 ROTINA: rises from behind the phone, tracking collapse, tab icons orbit behind the phone
  {
    const t0 = Wd('rotina') - .05, tout = S.sal - .15; const P = pose(t);
    rot.style.letterSpacing = tw(t, t0, t0 + .7, .22, -.01, E.oq).toFixed(3) + 'em'; rot._w = null;
    mv(rot, t, tt => { if (tt < t0 || tt > tout + .3) return null; const yIn = tw(tt, t0, t0 + .45, PY - 260, 360, E.oq); const xo = tt > tout ? E.ie(clamp((tt - tout) / .3)) * -1400 : 0; return { x: 540 + xo, y: yIn, op: 1, s: tw(tt, t0, t0 + .45, .7, 1) }; });
    rotIcons.forEach((e, i) => { const tin = Wd('voce') + i * .06; if (t < tin || t > tout + .3) return put(e, null); const u = E.oq(clamp((t - tin) / .55)); const side = i % 2 ? 1 : -1, row = i < 2 ? 0 : 1; const xo = t > tout ? E.ie(clamp((t - tout) / .3)) * -1400 : 0; mv(e, t, tt => ({ x: lerp(P.x, 540 + side * 410, E.oq(clamp((tt - tin) / .55))) + xo, y: lerp(P.y, 760 + row * 520, E.oq(clamp((tt - tin) / .55))) + 10 * Math.sin(tt * 2 + i), op: 1, s: lerp(.6, 1, u), r: side * 6 * Math.sin(tt * 1.5 + i) })); });
  }

  // ---------- S2 saldo (no phone)
  {
    const tin = S.sal - .1, tout = S.ifd - .25;
    const exitL = (o, tt, d = 0) => { if (!o || tt > tout + d + .32) return null; if (tt > tout + d) o.x += -1400 * E.ie(clamp((tt - tout - d) / .32)); return o; };
    mv(saldoCard, t, tt => exitL(whip(tt, 540, 900, tin, .45, 'R', null, 0, 'R'), tt, .04));
    mv(salChip, t, tt => exitL(whip(tt, 540, 480, Wd('salario', 1) - .12, .42, 'L', null, 0, 'L'), tt));
    mv(bill, t, tt => exitL(whip(tt, 540, 1335, Wd('contas') - .15, .45, 'D', null, 0, 'D'), tt, .08));
    const tp = Wd('saem') - .05; const dt = t - tp;
    const pb = $('payBtn'); const press = dt > -.05 && dt < .25 ? 1 - .04 * Math.sin(Math.PI * clamp((dt + .05) / .3)) : 1; pb.style.transform = `scale(${press.toFixed(3)}) translateY(${dt > 0 && dt < .2 ? 3 : 0}px)`;
    pb.style.background = dt > .12 ? '#0F7A55' : '#1E1E1E'; pb.style.borderBottomColor = dt > .12 ? '#0A5A3F' : '#000';
    const oa = clamp(1 - (dt - .1) / .12), ob = clamp((dt - .24) / .14); // sequence: old label leaves, then new enters (no text over text)
    $('payA').style.opacity = oa; $('payA').style.filter = `blur(${(4 * (1 - oa)).toFixed(1)}px)`; $('payA').style.transform = `scale(${(.8 + .2 * oa).toFixed(3)})`;
    $('payB').style.opacity = ob; $('payB').style.filter = `blur(${(4 * (1 - ob)).toFixed(1)}px)`; $('payB').style.transform = `scale(${(.8 + .2 * E.oc(ob)).toFixed(3)})`;
    $('bellW').style.transform = `rotate(${(dt < 0 && t > Wd('contas') ? 14 * Math.sin(t * 28) * clamp((t - Wd('contas')) / .3) : 0).toFixed(1)}deg)`;
    drawTap(t, tp, 775, 1335);
    const sv = Math.round(tw(t, Wd('acompanha') - .25, Wd('acompanha') + .5, 3480, 1590, E.oc)); $('v8saldo').textContent = fmtBRL(sv);
    $('v8saidas').textContent = fmtBRL(Math.round(tw(t, Wd('acompanha') - .25, Wd('acompanha') + .5, 1920, 3810, E.oc)));
    $('v8saldo').style.color = t > Wd('acompanha') - .25 && t < Wd('acompanha') + .6 ? '#FFB0B0' : '#fff';
  }

  // ---------- S3 iFood (phone right; chips left with icon swap)
  {
    const tA = S.ifd - .1, tSw = Wd('anota') - .12, tout = S.fix - .2; const P = pose(t);
    mv(g1, t, tt => whip(tt, 540, 330, tA, .38, 'L', tSw, .22, 'R'));
    mv(g2, t, tt => whip(tt, 540, 330, tSw + .18, .38, 'L', tout, .3, 'U'));
    const em = (e, tin, x, y) => { mv(e, t, tt => { if (tt < tin || tt > tout + .3) return null; const u = E.oq(clamp((tt - tin) / .45)); const yo = tt > tout ? E.ie(clamp((tt - tout) / .3)) * 1500 : 0; return { x: lerp(P.x, x, u), y: lerp(P.y + 100, y, u) + yo, op: 1, s: lerp(.6, 1, u) }; }); iconSwap(e, t, tin + .25); };
    em(cVal, Wd('hora') - .2, 225, 820); em(cCat, Wd('categoria') - .05, 225, 1010); em(cCard, Wd('cartao') - .08, 225, 1200);
  }

  // ---------- S4 conta fixa (no phone): badge, segmented control with spring highlight, aviso chip
  {
    const tin = S.fix - .05, tout = S.orc - .3;
    const exitU = (o, tt, d = 0) => { if (!o || tt > tout + d + .32) return null; if (tt > tout + d) o.y += -1600 * E.ie(clamp((tt - tout - d) / .32)); return o; };
    mv(a1, t, tt => exitU(whip(tt, 540, 330, Wd('conta') - .08, .4, 'L', null, 0, 'L'), tt));
    mv(a2, t, tt => exitU(tt < Wd('voce', 1) - .25 ? null : { x: 540, y: 468, op: 1 }, tt)); stagger(a2, t, Wd('voce', 1) - .25, .022);
    mv(badge, t, tt => exitU(whip(tt, 540, 770, Wd('agenda') - .2, .45, 'D', null, 0, 'D', { r: 0 }), tt, .03));
    $('repI').style.transform = `rotate(${(tw(t, Wd('vez'), Wd('so') + .5, 0, 360, E.ioc)).toFixed(1)}deg)`;
    mv(seg, t, tt => exitU(whip(tt, 540, 1130, Wd('mensal') - .45, .45, 'R', null, 0, 'R'), tt, .06));
    const tm = [Wd('mensal') - .1, Wd('parcelada') - .1, Wd('unica') - .1], pos = [1, 2, 0]; const W3 = 940 / 3; const hx = i => i * W3 + (W3 - 300) / 2;
    let x = hx(0); for (let k = 0; k < 3; k++) if (t >= tm[k]) x = lerp(hx(k === 0 ? 0 : pos[k - 1]), hx(pos[k]), spring(t, tm[k]));
    $('segHi').style.left = '0px'; $('segHi').style.transform = `translateX(${x.toFixed(1)}px)`;
    const act = t < tm[0] ? 0 : t < tm[1] ? 1 : t < tm[2] ? 2 : 0; seg.querySelectorAll('.sg').forEach((e, i) => e.style.color = i === act ? '#fff' : '#1E1E1E');
    for (let k = 0; k < 3; k++) if (drawTap(t, tm[k] - .05, 540 - 470 + hx(pos[k]) + 150, 1130)) break;
    mv(aviso, t, tt => exitU(whip(tt, 540, 1340, Wd('unica') + .2, .4, 'D', null, 0, 'D'), tt, .09));
  }

  // ---------- S5 orçamentos (no phone): rows from edges, bars fill, Outros overflows + error shake
  {
    const tin = S.orc - .1, tout = S.car - .25;
    const exitR = (o, tt, d = 0) => { if (!o || tt > tout + d + .32) return null; if (tt > tout + d) o.x += 1400 * E.ie(clamp((tt - tout - d) / .32)); return o; };
    mv(b1, t, tt => exitR(whip(tt, 540, 330, tin, .38, 'L', null, 0, 'L'), tt));
    mv(b3, t, tt => exitR(whip(tt, 540, 470, Wd('limite') - .1, .38, 'R', null, 0, 'R'), tt, .02));
    const shake = (t > Wd('gasta') && t < Wd('gasta') + .2) ? [0, -6, 6, -6, 6, 0][Math.floor((t - Wd('gasta')) / .2 * 6)] || 0 : 0;
    [[rA, Wd('barra') - .5, 760, 14.5], [rM, Wd('barra') - .35, 990, 64.6], [rO, Wd('barra') - .2, 1220, 100]].forEach(([e, ti, y, p], i) => {
      mv(e, t, tt => { const o = exitR(whip(tt, 540, y, ti, .42, i % 2 ? 'R' : 'L', null, 0, 'L'), tt, .04 * (i + 1)); if (o && i === 2) o.x += shake; return o; });
      const fill = i === 2 ? tw(t, Wd('conforme') - .2, Wd('gasta'), 0, 100, E.ioc) : tw(t, Wd('enche') - .1 + i * .1, Wd('enche') + .6 + i * .1, 0, p, E.oc);
      e.querySelector('i').style.width = fill.toFixed(2) + '%';
    });
    rO.firstChild.style.boxShadow = t > Wd('gasta') ? '0 0 0 6px rgba(204,0,0,.35),0 22px 48px rgba(0,0,0,.13)' : '0 22px 48px rgba(0,0,0,.13)';
    mv(estourou, t, tt => { if (tt < Wd('gasta') || tt > tout + .3) return null; const s = .8 + .2 * E.ob(clamp((tt - Wd('gasta')) / .3)); return exitR({ x: 820, y: 1120, s, op: clamp((tt - Wd('gasta')) / .08) }, tt, .1); });
  }

  // ---------- S6 cartões (phone left, 3D cards from behind it, shine sweep)
  {
    const tin = Wd('cartao', 1) - .15, tout = S.ass - .2; const P = pose(t);
    const cardMove = (e, tin2, x, y, ry, rz) => mv(e, t, tt => { if (tt < tin2 || tt > tout + .3) return null; const u = E.oq(clamp((tt - tin2) / .6)); const xo = tt > tout ? E.ie(clamp((tt - tout) / .3)) * 1400 : 0; const bob = Math.sin(tt * 2.2 + x) * 8; return { x: lerp(P.x, x, u) + xo, y: lerp(P.y, y, u) + bob, op: 1, s: lerp(.5, 1, u), t3: ` perspective(1200px) rotateY(${(lerp(0, ry, u) + 6 * Math.sin(tt * 1.4)).toFixed(1)}deg) rotateZ(${lerp(0, rz, u).toFixed(1)}deg)` }; });
    cardMove(card1, tin, 805, 690, -24, -4); cardMove(card2, tin + .18, 820, 1010, -20, 5);
    drawShine(sh1, t, Wd('fatura') - .1, .8); drawShine(sh2, t, Wd('fatura') + .1, .8);
    [card1, card2].forEach(c => { const b = c.querySelector('.cbar'); b.style.width = (tw(t, Wd('limite', 1) - .1, Wd('limite', 1) + .6, 0, +b.dataset.p, E.oc)).toFixed(1) + '%'; });
    mv(k1, t, tt => whip(tt, 805, 370, Wd('fatura') - .1, .38, 'R', tout, .3, 'R'));
    mv(k2, t, tt => { if (tt < Wd('usado') - .25 || tt > tout + .3) return null; const u = spring(tt, Wd('usado') - .25, 380, 22, 1); return { x: 805 + (tt > tout ? 1400 * E.ie(clamp((tt - tout) / .3)) : 0), y: lerp(2300, 1255, u), op: 1 }; });
    mv(k3, t, tt => whip(tt, 805, 1425, Wd('parcelas') - .1, .4, 'R', tout + .03, .3, 'R'));
  }

  // ---------- S7 assinaturas (no phone, dark): neon icons orbit, then fly into the total
  {
    const tin = S.ass - .1, tout = S.inv - .3; const cx = 540, cy = 1040;
    mv(s1, t, tt => whip(tt, 540, 330, Wd('assinaturas') - .05, .4, 'D', tout, .3, 'U'));
    put(subRing, t < tin + .2 || t > tout + .3 ? null : { x: cx, y: cy, s: tw(t, tin + .2, tin + .7, .7, 1, E.oq) * (t > tout ? 1 - .3 * clamp((t - tout) / .3) : 1), op: clamp((t - tin - .2) / .3) * (1 - clamp((t - tout) / .3)), r: t * 15, blur: false });
    const tSum = Wd('pra') - .1, tNum = Wd('sai') - .1;
    subs.forEach((s, i) => { const t0 = tin + .25 + i * .07; const tj = tSum + i * .06; const a = i / 6 * Math.PI * 2 + t * .6; if (t < t0 || t > tj + .25) return put(s.e, null); const u = E.oq(clamp((t - t0) / .5)); const j = E.ic(clamp((t - tj) / .25)); const R = 330 * u * (1 - j); put(s.e, { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R, op: 1 - j, s: (.6 + .4 * u) * (1 - .8 * j), blur: false }); });
    $('subN').textContent = fmtBRL(tw(t, tNum, tNum + .45, 0, 365.6, E.oc), 2);
    put(subN, t < tNum || t > tout + .3 ? null : { x: cx, y: cy - 30 + (t > tout ? 1500 * E.ie(clamp((t - tout) / .3)) : 0), s: .85 + .15 * E.ob(clamp((t - tNum) / .4)) + (t > Wd('sai') && t < Wd('sai') + .3 ? .05 * Math.sin(Math.PI * (t - Wd('sai')) / .3) : 0), op: 1 });
    mv(s3, t, tt => { const u = tt - Wd('todo') + .1; if (u < 0 || tt > tout + .32) return null; const fl = u < .45 ? ([1, 0, 1, .2, 1, 0, 0, 1, .4, 1][Math.floor(u / .045)] ?? 1) : (.9 + .1 * Math.sin(tt * 9)); return { x: cx, y: cy + 150 + (tt > tout ? 1500 * E.ie(clamp((tt - tout) / .32)) : 0), op: fl, blur: false }; });
  }

  // ---------- S8 investimentos (phone centre; donut + piggy with coins dropping)
  {
    const t1 = S.rel - .2, P = pose(t);
    mv(i1, t, tt => whip(tt, 540, 330, Wd('investimentos') - .1, .38, 'R', Wd('rende') - .3, .22, 'L'));
    mv(i2, t, tt => whip(tt, 540, 330, Wd('rende') - .12, .38, 'R', t1, .3, 'U'));
    $('rendN').textContent = fmtBRL(Math.round(tw(t, Wd('rende') - .1, Wd('mes', 2) + .2, 0, 224, E.oc)));
    mv(i3, t, tt => { if (tt < Wd('reserva') - .2 || tt > t1 + .3) return null; return { x: 540, y: 470 + (tt > t1 ? -1500 * E.ie(clamp((tt - t1) / .3)) : 0), op: 1 }; }); stagger(i3, t, Wd('reserva') - .2, .02);
    mv(donut, t, tt => { const t0 = Wd('investimentos') + .3; if (tt < t0 || tt > t1 + .3) return null; const u = E.oq(clamp((tt - t0) / .55)); return { x: lerp(P.x, 905, u) + (tt > t1 ? 1400 * E.ie(clamp((tt - t1) / .3)) : 0), y: lerp(P.y, 1340, u), s: lerp(.4, .82, u), r: lerp(-120, 0, u) + tt * 14, op: 1 }; });
    mv(piggy, t, tt => { const t0 = Wd('reserva') - .25; if (tt < t0 || tt > t1 + .3) return null; const u = E.oq(clamp((tt - t0) / .5)); const bump = coinsF.reduce((s, c, i) => { const tc = Wd('reserva') + .15 + i * .14 + .32; return s + (tt > tc && tt < tc + .18 ? .06 * Math.sin(Math.PI * (tt - tc) / .18) : 0); }, 0); return { x: lerp(P.x, 160, u) + (tt > t1 ? -1400 * E.ie(clamp((tt - t1) / .3)) : 0), y: lerp(P.y, 1420, u), s: lerp(.5, 1, u) * (1 + bump), op: 1 }; });
    coinsF.forEach((c, i) => { const tc = Wd('reserva') + .15 + i * .14; const u = (t - tc) / .32; if (u < 0 || u > 1) return put(c, null); put(c, { x: 160 + (i % 2 ? 10 : -10), y: lerp(-80, 1350, u * u), op: 1, r: u * 200, s: 1 - .3 * u }); });
  }

  // ---------- S9 relatório (no phone): chart draws itself, CADA REAL with reflection
  {
    const tin = S.rel - .1, tout = S.res - .3;
    const exitD = (o, tt, d = 0) => { if (!o || tt > tout + d + .32) return null; if (tt > tout + d) o.y += 1700 * E.ie(clamp((tt - tout - d) / .32)); return o; };
    mv(chart, t, tt => exitD(whip(tt, 540, 1220, tin, .45, 'D', null, 0, 'D'), tt, .06));
    chart.querySelectorAll('.cb').forEach((b, i) => { const u = spring(t, tin + .25 + i * .05, 380, 22, 1); b.style.transform = `scaleY(${clamp(u, 0, 1.2).toFixed(3)})`; });
    $('saldoLine').style.strokeDashoffset = (1100 * (1 - E.ioc(clamp((t - Wd('mostra')) / .9)))).toFixed(1);
    mv(r2, t, tt => exitD(tt < Wd('pra', 1) - .2 ? null : { x: 540, y: 285, op: 1 }, tt)); stagger(r2, t, Wd('pra', 1) - .2, .025);
    mv(r3, t, tt => exitD(whip(tt, 540, 445, Wd('cada', 1) - .15, .38, 'L', null, 0, 'L'), tt, .02));
    mv(r3r, t, tt => { const o = exitD(whip(tt, 540, 445 + 185, Wd('cada', 1) - .15, .38, 'L', null, 0, 'L'), tt, .02); if (o) { o.t3 = ' scaleY(-1)'; o.op = .9; } return o; });
  }

  // ---------- S10 o resto (phone spins back in; tab icons orbit BEHIND the phone)
  {
    const tin = Wd('resto') - .25, tout = S.hab - .2; const P = pose(t);
    mv(z1, t, tt => (tt < tin || tt > tout + .3) ? null : { x: 540, y: 330 + (tt > tout ? -1500 * E.ie(clamp((tt - tout) / .3)) : 0), op: 1, blur: false }); assemble(z1, t, tin, .5, 340, 21);
    mv(z2, t, tt => (tt < Wd('tambem') - .3 || tt > tout + .3) ? null : { x: 540, y: 448 + (tt > tout ? -1500 * E.ie(clamp((tt - tout) / .3)) : 0), op: 1 }); stagger(z2, t, Wd('tambem') - .3, .03);
    tabIcons.forEach((e, i) => { const t0 = S.res + .35 + i * .05; if (t < t0 || t > tout + .35) return put(e, null); const u = E.oq(clamp((t - t0) / .6)), o = t > tout ? E.ic(clamp((t - tout) / .35)) : 0; const a = i / 6 * Math.PI * 2 + t * .9; const rx = 460 * u * (1 - o), ry = 600 * u * (1 - o); put(e, { x: P.x + Math.cos(a) * rx, y: P.y + 60 + Math.sin(a) * ry, s: .7 + .3 * u, op: 1, blur: false }); });
  }

  // ---------- S11 hábitos (phone right; checklist + streak chip)
  {
    const tin = S.hab - .15, tout = S.tre - .25; const taps = D.taps.filter(x => x[0] > 37.8 && x[0] < 40.1).map(x => x[0]);
    mv(hb1, t, tt => whip(tt, 290, 420, tin, .38, 'L', tout, .3, 'L'));
    mv(hb2, t, tt => whip(tt, 290, 535, Wd('habitos') - .15, .01, 'D', tout + .02, .3, 'L')); stagger(hb2, t, Wd('habitos') - .15, .03);
    hbs.forEach((e, i) => {
      const ti = taps[i] || (38 + i * .6);
      mv(e, t, tt => whip(tt, 245, 760 + i * 140, tin + .1 + i * .08, .38, 'L', tout + .03 * i, .3, 'L'));
      const u = clamp((t - ti - .05) / .18); const b = e.querySelector('.chk b'); b.style.opacity = u; b.style.transform = `scale(${(u < 1 ? .5 + .5 * E.ob(u) : 1).toFixed(3)})`;
      e.querySelector('path').style.strokeDashoffset = (60 * (1 - clamp((t - ti - .1) / .2))).toFixed(1);
      e.querySelector('.chk').style.transform = `scale(${(1 + .18 * Math.sin(Math.PI * clamp((t - ti) / .3))).toFixed(3)})`;
    });
    mv(streak, t, tt => { const t0 = (taps[3] || 39.8) + .2; if (tt < t0 || tt > tout + .3) return null; const u = spring(tt, t0, 380, 22, 1); return { x: lerp(-300, 255, u) + (tt > tout ? -1400 * E.ie(clamp((tt - tout) / .3)) : 0), y: 1340, op: 1 }; });
  }

  // ---------- S12 treino (no phone): exercise card, kg counter, 3D button press -> FEITO
  {
    const tin = S.tre - .1, tout = S.gra - .25;
    const exitL = (o, tt, d = 0) => { if (!o || tt > tout + d + .32) return null; if (tt > tout + d) o.x += -1400 * E.ie(clamp((tt - tout - d) / .32)); return o; };
    mv(tr1, t, tt => exitL(whip(tt, 540, 330, Wd('treino') - .12, .38, 'R', null, 0, 'R'), tt));
    mv(exCard, t, tt => exitL(whip(tt, 540, 1060, tin + .05, .45, 'R', null, 0, 'R'), tt, .04));
    $('kgN').textContent = (Math.round(tw(t, Wd('carga') - .1, Wd('carga') + .5, 20, 47.5, E.oc) * 2) / 2).toLocaleString('pt-BR', { minimumFractionDigits: 1 });
    const tp = Wd('cada', 2) - .1, dt = t - tp; const btn = $('doneBtn');
    btn.style.transform = `translateY(${(dt > -.03 && dt < .16 ? 6 : 0)}px)`; btn.style.borderBottomWidth = (dt > -.03 && dt < .16 ? 4 : 10) + 'px';
    const oa = clamp(1 - (dt - .08) / .12), ob = clamp((dt - .22) / .14);
    $('doneA').style.opacity = oa; $('doneA').style.filter = `blur(${(4 * (1 - oa)).toFixed(1)}px)`; $('doneB').style.opacity = ob; $('doneB').style.filter = `blur(${(4 * (1 - ob)).toFixed(1)}px)`; $('doneB').style.transform = `scale(${(.8 + .2 * E.oc(ob)).toFixed(3)})`;
    if (t > tin && t < tout) drawTap(t, tp, 540, 1230);
    mv(tr3, t, tt => exitL(tt < Wd('serie') - .1 ? null : { x: 540, y: 1455, op: 1 }, tt, .08)); stagger(tr3, t, Wd('serie') - .1, .03);
  }

  // ---------- S13 gráficos (phone centre; bars spring up behind it)
  {
    const tin = S.gra - .15, tout = S.cta - .2;
    mv(gr1, t, tt => whip(tt, 540, 330, Wd('graficos') - .1, .38, 'U', Wd('semana') - .2, .22, 'L'));
    mv(gr2, t, tt => whip(tt, 300, 330, Wd('semana') - .1, .36, 'L', tout, .3, 'U'));
    mv(gr3, t, tt => whip(tt, 790, 330, Wd('mes', 3) - .1, .36, 'R', tout + .03, .3, 'U'));
    const by = t > tout + .2 ? lerp(0, 900, E.ic(clamp((t - tout - .2) / .4))) : 0;
    put(barsBg, t < tin || t > tout + .7 ? null : { x: 540, y: 1570 + by, op: 1, blur: false });
    [...barsBg.children].forEach((b, i) => { const u = spring(t, tin + .1 + i * .06, 380, 22, 1); b.style.transform = `scaleY(${clamp(u, 0, 1.25).toFixed(3)})`; });
  }

  // ---------- S14 CTA: big button from below, ring spinning, shimmer, press + ripple on "agora"; then glitch -> end card
  {
    const tin = S.cta - .1, tG = Wd('link') - .3;
    mv(c1, t, tt => whip(tt, 540, 330, tin, .38, 'L', tG, .2, 'U'));
    mv(ctaWrap, t, tt => { if (tt < tin + .15 || tt > tG + .2) return null; const u = spring(tt, tin + .15, 300, 26, 1); return { x: 540, y: lerp(2300, 1150, u), op: 1 }; });
    $('ctaRing').style.transform = `rotate(${(t * 140 + (t > Wd('agora') ? (t - Wd('agora')) * 500 : 0)).toFixed(1)}deg)`;
    drawShine(ctaShine, t, tin + .55, .7);
    const tp = Wd('agora') - .05, dt = t - tp; const cb = $('ctaBtn');
    const pr = dt > -.04 && dt < .2; cb.style.transform = `translateY(${pr ? 8 : 0}px) scale(${pr ? .97 : 1})`; cb.style.borderBottomWidth = (pr ? 6 : 14) + 'px';
    if (t > tin && t < tG) drawTap(t, tp, 600, 1150);
    const endOn = t >= tG + .12;
    put(endBg, endOn ? { x: 540, y: 960, op: 1, blur: false } : null);
    const typedN = Math.floor(clamp((t - tG - .35) / .45) * 6); if (endOn) $('typed').textContent = 'Rotina'.slice(0, typedN);
    $('caret').style.opacity = Math.floor(t * 2.5) % 2 ? 1 : .15;
    put(endLogo, endOn ? { x: 540, y: 760, s: tw(t, tG + .12, tG + .5, .85, 1, E.ob), op: 1 } : null);
    $('logoChk').style.strokeDashoffset = (120 * (1 - E.oc(clamp((t - tG - .2) / .35)))).toFixed(1);
    put(endBar, endOn ? { x: 540, y: 1000, s: tw(t, tG + .25, tG + .55, .4, 1, E.ob), op: clamp((t - tG - .2) / .1) } : null);
    endBar.querySelectorAll('.eb').forEach((e, i) => { const sp = tw(t, tG + .25, tG + .9, 1, .25, E.oc); e.style.transform = i ? `translate(${(9 * sp).toFixed(1)}px,${(7 * sp).toFixed(1)}px)` : `translate(${(-9 * sp).toFixed(1)}px,${(-7 * sp).toFixed(1)}px)`; });
    { const u = t - Wd('link') + .05; const fl = u < .5 ? ([1, .1, 1, 0, .6, 1, .2, 1, 1, .5, 1][Math.floor(u / .045)] ?? 1) : (.92 + .08 * Math.sin(t * 7)); put(endLink, endOn && u > 0 ? { x: 540, y: 1190, op: fl, blur: false } : null); }
    put(endGlow, endOn ? { x: 540, y: 900, op: clamp((t - tG - .15) / .4) * (.85 + .15 * Math.sin(t * 3)), blur: false } : null);
    const g = t > tG - .12 && t < tG + .32; const gi = g ? 1 - Math.abs((t - tG - .1) / .22) : 0;
    $('stage').style.filter = g ? `drop-shadow(${(14 * gi).toFixed(1)}px 0 0 rgba(255,0,60,.75)) drop-shadow(${(-14 * gi).toFixed(1)}px 0 0 rgba(0,240,255,.75))` : 'none';
    if (g) { let s = ''; for (let k = 0; k < 7; k++) { const yy = rnd(f * 7 + k) * 1920, hh = 8 + rnd(f * 13 + k) * 60; s += `<div style="position:absolute;left:0;top:${yy}px;width:1080px;height:${hh}px;background:rgba(${rnd(k + f) > .5 ? '255,255,255' : '0,0,0'},${(.25 + .5 * rnd(f + k * 3)).toFixed(2)});transform:translateX(${((rnd(f * 3 + k) - .5) * 120).toFixed(0)}px)"></div>`; } scan.innerHTML = s; scan.style.display = 'block'; statC.style.display = 'block'; const im = statX.createImageData(270, 480); for (let i = 0; i < im.data.length; i += 4) { const v = rnd(i * .37 + f * 11) * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; } statX.putImageData(im, 0, 0); statC.style.opacity = (.55 * gi).toFixed(2); }
    else { scan.style.display = 'none'; statC.style.display = 'none'; }
    if (g) $('stage').style.transform = `translateX(${((rnd(f) - .5) * 40 * gi).toFixed(1)}px)`;
  }

  // ---------- phone
  {
    const P = pose(t); const pz = 1 + punch(t);
    const s = P.s * pz * 1.1; const yb = P.y - 6 * Math.sin(t * 1.7);
    const prev = pose(t - 1 / 60); const vx = (P.x - prev.x) * .5, vy = (P.y - prev.y) * .5;
    const w = $('phoneWrap'); const on = phoneOn(t);
    w.style.display = on ? 'block' : 'none';
    w.style.transform = `translate3d(${(P.x - PH.w / 2).toFixed(2)}px,${(yb - PH.h / 2).toFixed(2)}px,0) perspective(2200px) rotateX(${P.rx.toFixed(2)}deg) rotateY(${P.ry.toFixed(2)}deg) scale(${s.toFixed(4)})`;
    w.style.filter = Math.abs(vx) > 300 || Math.abs(vy) > 300 ? 'none' : mblur(vx, vy);
    const sh = $('pshadow'); sh.style.display = on ? 'block' : 'none';
    sh.style.transform = `translate3d(${(P.x - 260).toFixed(1)}px,${(yb + PH.h * s / 2 - 10).toFixed(1)}px,0) scale(${s.toFixed(3)},${s.toFixed(3)})`;
    sh.style.opacity = (.8 * clamp(1 - Math.abs(((P.ry % 360) + 360) % 360 > 180 ? 360 - ((P.ry % 360) + 360) % 360 : ((P.ry % 360) + 360) % 360) / 120)).toFixed(2);
    const file = appFile(t); const img = $('app');
    const bootOp = t < 2.75 ? 1 : clamp(1 - (t - 2.75) / .15); $('boot').style.opacity = bootOp; $('boot').style.display = bootOp <= 0 ? 'none' : 'block';
    if (on && file && file !== curSrc) { curSrc = file; img.src = '../frames/app/' + file; await img.decode().catch(() => {}); }
    drawTouches(t);
  }
  return true;
};
window.DUR = DUR; window.FPS = FPS;
})();
