// Rotina v7: deterministic composition. window.renderFrame(t) sets every element from t alone (no timers, seeded random).
// Layers: bg (studio) < panels (colour blocks / floor / dark) < back (all text and cards: always BEHIND the phone)
//         < phone < front (only end card). Editor rules: no text over text, no masks mid-screen, phone above text,
//         text enters from outside the frame or from behind the phone.
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

// ---------- phone rig: position over time (centre x, centre y, scale, rotY, rotX)
const PH = { w: 520, h: 1139 };
const keys = [];
const K = (t, x, y, s, ry = 0, rx = 0, e = E.ioc) => keys.push({ t, x, y, s, ry, rx, e });
// timeline of phone poses (hold between keys, move with ease over [prev.t, key.t])
const PX = 540, PY = 1085;
K(0, PX, 2900, .95, 0, 22); K(L[1][0] - .25, PX, 2900, .95, 0, 22);
K(L[1][0] + .35, PX, PY, .95, 0, 6, E.oc); K(4.9, PX, PY, .95, 0, 0);
K(5.0, PX, PY, .95); K(5.42, 700, 1040, .9, -8, 3, E.oc); K(8.6, 700, 1040, .9, -8, 3);
K(9.05, 655, 1110, .94, -6, 4, E.oc); K(12.55, 655, 1110, .94, -6, 4);
K(13.0, 765, 1060, .86, -10, 3, E.oc); K(17.45, 765, 1060, .86, -10, 3);
K(17.85, 715, 1060, .9, -6, 2, E.oc); K(21.5, 715, 1060, .9, -6, 2);
K(21.95, 330, 1060, .88, 10, 3, E.oc); K(25.7, 330, 1060, .88, 10, 3);
K(26.15, PX, 1120, .92, 0, 4, E.oc); K(29.2, PX, 1120, .92, 0, 4);
K(29.6, PX, 1060, .9, 0, 2, E.oc); K(32.5, PX, 1060, .9, 0, 2);
K(32.9, 780, 1040, .84, -8, 2, E.oc); K(35.55, 780, 1040, .84, -8, 2);
K(36.05, PX, 1110, .92, -360, 4, E.ioc); K(37.9, PX, 1110, .92, -360, 4);
K(38.25, 720, 1060, .88, -368, 3, E.oc); K(40.3, 720, 1060, .88, -368, 3);
K(40.7, 350, 1060, .88, -352, 3, E.oc); K(42.6, 350, 1060, .88, -352, 3);
K(43.0, PX, 1120, .9, -360, 4, E.oc); K(44.85, PX, 1120, .9, -360, 4);
K(45.25, PX, 1190, .96, -360, 0, E.oc); K(46.3, PX, 1190, .99, -360, 0, E.lin); K(46.6, PX, 2900, .9, -360, 25, E.ic); K(DUR, PX, 2900, .9, -360, 25);
const pose = (t) => { let i = 0; while (i < keys.length - 1 && keys[i + 1].t <= t) i++; const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)]; if (b === a || t <= a.t) return a; const u = b.e(clamp((t - a.t) / (b.t - a.t))); return { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), s: lerp(a.s, b.s, u), ry: lerp(a.ry, b.ry, u), rx: lerp(a.rx, b.rx, u) }; };
// punch zooms (camera on phone) at given times
const punches = [[Wd('sabe'), .06], [Wd('saem'), .04], [Wd('unica'), .04], [Wd('gasta'), .03], [Wd('faltam'), .03], [Wd('real'), .04], [Wd('agora'), .05]];
const punch = (t) => punches.reduce((s, [t0, a]) => s + (t >= t0 && t < t0 + .5 ? a * Math.sin(Math.PI * clamp((t - t0) / .5)) : 0), 0);

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

// ================= SCENE ELEMENTS =================
const C = { red: '#CC0000', green: '#0F7A55', ink: '#232323', grey: '#6B6B6B', white: '#FFFFFF' };
const T = (parent, cls, txt, css, letters) => mk(parent, cls, letters ? span(txt) : txt, css);

// --- panels
const greenL = mk('panels', '', '', { width: '620px', height: '1920px', background: 'linear-gradient(160deg,#13905F,#0B6345)', boxShadow: '30px 0 60px rgba(0,0,0,.18)' });
const greenR = mk('panels', '', '', { width: '640px', height: '1920px', background: 'linear-gradient(200deg,#13905F,#0B6345)', boxShadow: '-30px 0 60px rgba(0,0,0,.18)' });
const dark = mk('panels', '', '<div style="position:absolute;inset:0;background:radial-gradient(60% 45% at 50% 52%,#1A8C5E 0%,#0A3B29 45%,#04140E 100%)"></div>', { width: '1080px', height: '1920px' });
const floor = mk('panels', '', '<div style="position:absolute;inset:0;background:linear-gradient(180deg,#169A69 0%,#0E7A53 40%,#0A5E40 100%)"></div><div style="position:absolute;left:0;right:0;top:0;height:3px;background:rgba(255,255,255,.35)"></div>', { width: '1080px', height: '700px' });
const barsBg = mk('panels', '', '', { width: '1080px', height: '700px' });
const barH = [0.30, 0.66, 0.66, 0.52, 0.52, 0.30, 0.80, 0.58];
barsBg.innerHTML = barH.map((h, i) => `<i style="position:absolute;bottom:0;left:${18 + i * 133}px;width:96px;height:${h * 620}px;background:linear-gradient(180deg,#E3262B,#A30000);border-radius:14px 14px 0 0;transform-origin:50% 100%"></i>`).join('');

// --- S0 hook
const h1 = T('back', 'bc', 'QUANTO', { fontSize: '330px', color: C.red });
const h2 = T('back', 'bc', 'SOBROU', { fontSize: '330px', color: C.red });
const h3 = T('back', 'pp', 'do seu salário', { fontSize: '74px', fontWeight: 500, color: '#4A4A4A' }, true);
const h4 = T('back', 'pp', 'esse mês?', { fontSize: '104px', fontWeight: 700, color: C.green }, true);
const orbit = mk('back', '', `<svg width="760" height="760" viewBox="0 0 760 760"><ellipse cx="380" cy="380" rx="350" ry="350" fill="none" stroke="#3A3A3A" stroke-width="2.5" opacity=".55"/><ellipse cx="380" cy="380" rx="270" ry="270" fill="none" stroke="#3A3A3A" stroke-width="1.5" opacity=".25"/></svg>`, {});
const dots = [0, 1, 2, 3].map(() => mk('back', '', '', { width: '30px', height: '30px', borderRadius: '50%', background: '#1E1E1E' }));
const coinDisc = mk('back', '', `<div style="width:420px;height:420px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#1BA672,#0F7A55 60%,#0A5A3F);box-shadow:0 40px 80px rgba(15,122,85,.35)"></div>`, {});
const coin = mk('back', '', `<div style="width:250px;height:250px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFF6C8,#F4C542 35%,#C8901A 75%,#8E5F0C);box-shadow:inset 0 0 0 10px rgba(255,255,255,.25),inset 0 -12px 20px rgba(0,0,0,.25),0 20px 40px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center"><span class="bc" style="font-size:120px;color:#7A4E06;text-shadow:0 2px 0 rgba(255,255,255,.5)">R$</span></div>`, {});
// --- S1
const rot = T('back', 'bc', 'ROTINA', { fontSize: '250px', color: C.red });
const jaSabe = T('back', 'pp', 'você abre e já sabe.', { fontSize: '50px', fontWeight: 500, color: '#3A3A3A' }, true);
// --- S2 money pills (emerge from behind the phone)
const pill = (lab, val, col) => mk('back', '', `<div class="pill" style="background:#fff;width:400px"><div class="lab" style="color:${col}">${lab}</div><div class="bc" style="font-size:96px;color:${col};margin-top:6px">${val}</div></div>`);
const pSal = pill('Salário', '+ R$ 4.800', C.green);
const pFix = pill('Contas fixas', '− R$ 1.890', C.red);
const pSaldo = mk('back', '', `<div class="pill" style="background:#1E1E1E;width:400px"><div class="lab" style="color:#A3A3A3">Saldo do mês</div><div class="bc" id="saldoN" style="font-size:112px;color:#fff;margin-top:6px">R$ 3.480</div></div>`);
// --- S3 iFood
const g1 = T('back', 'bc', 'GASTOU NO iFOOD?', { fontSize: '150px', color: C.red, textTransform: 'none' });
const g2 = T('back', 'bc', 'ANOTA NA HORA.', { fontSize: '150px', color: C.ink });
const chip = (txt, col, bg) => mk('back', '', `<div class="pp" style="font-size:46px;font-weight:700;color:${col};background:${bg};padding:24px 32px 20px;border-radius:40px;box-shadow:0 16px 32px rgba(0,0,0,.16)">${txt}</div>`);
const cCat = chip('🍴 Categoria', '#fff', '#FB923C'.replace('🍴 ', ''));
cCat.innerHTML = `<div class="pp" style="font-size:46px;font-weight:700;color:#fff;background:#E07A24;padding:24px 32px 20px;border-radius:40px;box-shadow:0 16px 32px rgba(0,0,0,.16)">Alimentação</div>`;
const cCard = chip('Crédito', '#fff', '#7C3AED');
const cVal = chip('R$ 58', '#fff', '#1E1E1E');
// --- S4 agendar (on green panel, left)
const a1 = T('back', 'bc', 'CONTA FIXA', { fontSize: '122px', color: '#fff' });
const a2 = T('back', 'pp', 'você agenda uma vez só', { fontSize: '38px', fontWeight: 500, color: '#E8FFF4' }, true);
const opt = (txt) => T('back', 'bc', txt, { fontSize: '108px', color: '#fff' });
const o1 = opt('MENSAL'), o2 = opt('PARCELADA'), o3 = opt('ÚNICA');
const dot1 = mk('back', '', '', { width: '26px', height: '26px', borderRadius: '50%', background: '#fff' });
// --- S5 orçamentos
const b1 = T('back', 'bc', 'CADA', { fontSize: '130px', color: C.ink });
const b2 = T('back', 'bc', 'CATEGORIA', { fontSize: '102px', color: C.ink });
const b3 = T('back', 'bc', 'UM LIMITE.', { fontSize: '102px', color: C.red });
const budget = (name, vtxt, col) => mk('back', '', `<div style="width:400px"><div class="pp" style="font-size:44px;font-weight:700;color:#232323">${name}</div><div class="pp" style="font-size:32px;font-weight:500;color:#6B6B6B">${vtxt}</div><div class="bar" style="margin-top:12px;height:36px"><i style="background:${col};width:0%"></i></div></div>`);
const bA = budget('Alimentação', 'R$ 58 / R$ 400', '#FB923C');
const bO = budget('Outros', 'R$ 1.890 / R$ 200', '#CC0000');
const estourou = mk('back', '', `<div class="bc" style="font-size:64px;color:#fff;background:#CC0000;padding:12px 22px 6px;border-radius:14px;transform:rotate(-6deg)">ESTOUROU</div>`);
// --- S6 cartões (3D cards)
const ccard = (name, last, grad, fat, pct) => mk('back', '', `<div class="card" style="background:${grad}"><div style="display:flex;justify-content:space-between"><div><div class="pp" style="font-size:34px;font-weight:700">${name}</div><div class="pp" style="font-size:26px;opacity:.75;letter-spacing:.2em">•••• ${last}</div></div><div style="width:64px;height:46px;border-radius:10px;background:linear-gradient(135deg,#F5D77A,#B8892A)"></div></div><div class="pp" style="font-size:22px;opacity:.75;margin-top:30px">Fatura atual</div><div class="bc" style="font-size:72px;text-transform:none">${fat}</div><div style="height:10px;border-radius:5px;background:rgba(255,255,255,.25);margin-top:10px;position:relative"><i class="cbar" style="position:absolute;left:0;top:0;bottom:0;width:0;border-radius:5px;background:#fff" data-p="${pct}"></i></div></div>`);
const card1 = ccard('Nubank Ultravioleta', '4831', 'linear-gradient(135deg,#7C3AED 0%,#4C1D95 55%,#2E1065 100%)', 'R$ 1.890', 24);
const card2 = ccard('Inter Black', '2266', 'linear-gradient(135deg,#F97316 0%,#C2410C 55%,#7C2D12 100%)', 'R$ 620', 12);
const k1 = T('back', 'bc', 'FATURA', { fontSize: '120px', color: C.ink });
const k2 = mk('back', '', `<div class="pp" style="font-size:40px;font-weight:700;color:#fff;background:#232323;padding:20px 28px 16px;border-radius:40px">24% do limite</div>`);
const k3 = mk('back', '', `<div style="background:#fff;border-radius:26px;padding:22px 28px;width:440px;box-shadow:0 18px 40px rgba(0,0,0,.18)"><div class="lab" style="color:#6B6B6B;font-size:26px">Parcelas que faltam</div><div style="display:flex;justify-content:space-between;margin-top:10px"><span class="pp" style="font-size:34px;font-weight:700;color:#232323">Monitor 4K</span><span class="bc" style="font-size:44px;color:#7C3AED">6/10</span></div><div style="display:flex;justify-content:space-between"><span class="pp" style="font-size:34px;font-weight:700;color:#232323">iPhone 15</span><span class="bc" style="font-size:44px;color:#7C3AED">9/12</span></div></div>`);
// --- S7 assinaturas (dark scene)
const s1 = T('back', 'bc', 'ASSINATURAS', { fontSize: '150px', color: '#fff' });
const s2 = mk('back', '', `<div class="bc" id="subN" style="font-size:190px;color:#fff;text-shadow:0 0 40px rgba(124,255,178,.45)">R$ 365,60</div>`);
const s3 = T('back', 'sc', 'todo mês', { fontSize: '150px', color: '#C9FFE0', textShadow: '0 0 12px #7CFFB2,0 0 34px #2BE38A,0 0 70px #19B56C' });
// --- S8 investimentos
const i1 = T('back', 'bc', 'INVESTIMENTOS', { fontSize: '132px', color: C.ink });
const i2 = mk('back', '', `<div style="display:flex;align-items:baseline;gap:18px"><span class="bc" id="rendN" style="font-size:230px;color:#CC0000">R$ 224</span><span class="pp" style="font-size:56px;font-weight:700;color:#232323">/mês</span></div>`);
const i3 = T('back', 'pp', 'que a sua reserva rende', { fontSize: '52px', fontWeight: 500, color: '#3A3A3A' }, true);
const donut = mk('back', '', (() => { const seg = [[30, '#34D399'], [39, '#60A5FA'], [14, '#FB923C'], [17, '#A78BFA']]; let a = 0, s = ''; const R = 120, c = 2 * Math.PI * R; seg.forEach(([p, col]) => { s += `<circle cx="160" cy="160" r="${R}" fill="none" stroke="${col}" stroke-width="56" stroke-dasharray="${(p / 100 * c).toFixed(1)} ${c.toFixed(1)}" stroke-dashoffset="${(-a / 100 * c).toFixed(1)}" class="dseg"/>`; a += p; }); return `<svg width="320" height="320" viewBox="0 0 320 320" style="transform:rotate(-90deg);filter:drop-shadow(0 20px 30px rgba(0,0,0,.25))">${s}</svg>`; })());
// --- S9 relatório
const r1 = T('back', 'bc', 'RELATÓRIO', { fontSize: '116px', color: C.ink });
const r2 = T('back', 'pp', 'pra onde foi', { fontSize: '66px', fontWeight: 500, color: '#3A3A3A' }, true);
const r3 = T('back', 'bc', 'CADA', { fontSize: '200px', color: C.red });
const r4 = T('back', 'bc', 'REAL', { fontSize: '200px', color: C.red });
const r4r = T('back', 'bc', 'REAL', { fontSize: '200px', color: C.red, transform: 'scaleY(-1)' });
r4r.style.webkitMaskImage = 'linear-gradient(0deg,rgba(0,0,0,.55),rgba(0,0,0,0) 75%)';
// --- S10 o resto
const z1 = T('back', 'bc', 'O RESTO DA ROTINA', { fontSize: '124px', color: C.ink }, true);
const z2 = T('back', 'pp', 'também mora aqui.', { fontSize: '56px', fontWeight: 500, color: C.red }, true);
// --- S11 hábitos
const hb1 = T('back', 'bc', 'CHECKLIST', { fontSize: '150px', color: C.red });
const hb2 = T('back', 'pp', 'de hábitos', { fontSize: '60px', fontWeight: 500, color: '#3A3A3A' }, true);
const habit = (txt) => mk('back', '', `<div style="display:flex;align-items:center;gap:26px"><div class="chk"><b></b><svg width="44" height="40" viewBox="0 0 44 40"><path d="M4 21 L16 33 L40 6" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="60" stroke-dashoffset="60"/></svg></div><span class="pp" style="font-size:42px;font-weight:700;color:#232323">${txt}</span></div>`);
const hbs = ['Beber 3L de água', 'Dieta', 'Ler 10 páginas', 'Treinar'].map(habit);
// --- S12 treino (green right)
const tr1 = T('back', 'bc', 'TREINO', { fontSize: '150px', color: '#fff' });
const tr2 = mk('back', '', `<div><div class="lab" style="color:#CFFFE6">Carga sugerida</div><div style="display:flex;align-items:baseline;gap:12px"><span class="bc" id="kgN" style="font-size:190px;color:#fff">47,5</span><span class="bc" style="font-size:90px;color:#fff">KG</span></div><div class="pp" style="font-size:36px;font-weight:500;color:#E8FFF4">Desenvolvimento</div></div>`);
const tr3 = T('back', 'pp', 'série a série', { fontSize: '52px', fontWeight: 700, color: '#fff' }, true);
// --- S13 gráficos
const gr1 = T('back', 'bc', 'GRÁFICOS', { fontSize: '190px', color: C.ink });
const gr2 = T('back', 'bc', 'SEMANA', { fontSize: '170px', color: C.red });
const gr3 = T('back', 'bc', '+ MÊS', { fontSize: '170px', color: C.ink });
// --- S14 CTA
const c1 = T('back', 'bc', 'BAIXE O ROTINA', { fontSize: '150px', color: C.ink });
const c2 = T('back', 'bc', 'AGORA.', { fontSize: '200px', color: C.red });
const endBg = mk('end', '', '', { width: '1080px', height: '1920px', background: '#0D0F16' });
const endLogo = mk('end', '', `<div style="display:flex;align-items:center;gap:26px"><div style="width:150px;height:150px;border-radius:38px;background:#CC0000;display:flex;align-items:center;justify-content:center;box-shadow:0 0 60px rgba(204,0,0,.45)"><svg width="92" height="80" viewBox="0 0 92 80"><path d="M8 42 L34 68 L84 10" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/></svg></div><span class="bc" style="font-size:170px;color:#fff;letter-spacing:.01em">ROTINA</span></div>`);
const endBar = mk('end', '', `<div style="position:relative;width:760px;height:110px"><div class="eb" style="position:absolute;inset:0;border-radius:24px;background:#E3262B;transform:translate(-9px,-7px)"></div><div class="eb" style="position:absolute;inset:0;border-radius:24px;background:#22E1E8;transform:translate(9px,7px)"></div><div style="position:absolute;inset:0;border-radius:24px;background:#fff;display:flex;align-items:center;padding:0 34px;gap:22px"><svg width="44" height="44" viewBox="0 0 44 44"><circle cx="19" cy="19" r="13" fill="none" stroke="#111" stroke-width="5"/><path d="M29 29 L40 40" stroke="#111" stroke-width="5" stroke-linecap="round"/></svg><span class="pp" id="typed" style="font-size:50px;font-weight:700;color:#111"></span><span id="caret" style="width:4px;height:56px;background:#111"></span></div></div>`);
const endLink = T('end', 'bc', 'LINK NA BIO', { fontSize: '120px', color: '#fff' }, true);
const scan = mk('fx', '', '', { width: '1080px', height: '1920px' });
const statC = document.createElement('canvas'); statC.width = 270; statC.height = 480; Object.assign(statC.style, { position: 'absolute', left: 0, top: 0, width: '1080px', height: '1920px', imageRendering: 'pixelated', display: 'none', opacity: .5 }); $('fx').appendChild(statC); const statX = statC.getContext('2d');

// ================= RENDER =================
window.renderFrame = async (t) => {
  const f = Math.round(t * FPS);
  // background blinds drift
  $('blinds').style.transform = `rotate(-24deg) translateX(${(-t * 6).toFixed(1)}px)`;
  $('blinds2').style.transform = `rotate(-24deg) translateY(${(t * 4).toFixed(1)}px)`;
  drawGrain(f);

  // ---------- S0 hook 0 .. 2.35
  const out0 = L[1][0] - .32; // hook leaves upward as the phone rises
  mv(h1, t, tt => { const o = whip(tt, 540, 360, 0.0, .42, 'L', out0, .32, 'U'); return o; });
  mv(h2, t, tt => whip(tt, 540, 640, Wd('sobrou') - .05, .4, 'R', out0 + .03, .32, 'U'));
  mv(h3, t, tt => whip(tt, 540, 838, Wd('salario'), .01, 'D', out0 + .06, .32, 'U', { blur: true })); assemble(h3, t, Wd('salario') - .1, .45, 260, 5);
  mv(h4, t, tt => whip(tt, 540, 960, Wd('esse'), .01, 'D', out0 + .09, .32, 'U')); assemble(h4, t, Wd('esse') - .08, .42, 300, 9);
  {
    const t0 = .55, cy = 1430; const s = tw(t, t0, t0 + .55, 0, 1, E.ob); const up = t > out0 + .1 ? E.ie(clamp((t - out0 - .1) / .32)) * -1700 : 0;
    put(coinDisc, t < t0 || t > out0 + .45 ? null : { x: 540, y: cy + up, s, op: 1, by: up ? -40 : 0 });
    put(orbit, t < t0 || t > out0 + .45 ? null : { x: 540, y: cy + up, s: tw(t, t0 + .1, t0 + .7, .6, 1), op: tw(t, t0 + .1, t0 + .5, 0, 1), by: up ? -40 : 0 });
    const spin = tw(t, t0, t0 + 1.2, 0, 1, E.oc);
    put(coin, t < t0 + .1 || t > out0 + .45 ? null : { x: 540, y: cy + up - 6 * Math.sin(t * 3), s: tw(t, t0 + .1, t0 + .6, 0, 1, E.ob), op: 1, t3: ` rotateY(${(360 * (1 - spin)).toFixed(1)}deg)`, by: up ? -40 : 0 });
    dots.forEach((d, i) => { const a = t * 1.6 + i * Math.PI / 2, rr = 350 * tw(t, t0 + .1, t0 + .7, .6, 1); put(d, t < t0 + .15 || t > out0 + .45 ? null : { x: 540 + Math.cos(a) * rr, y: cy + up + Math.sin(a) * rr, op: tw(t, t0 + .15, t0 + .5, 0, 1), s: .6 + .4 * (Math.sin(a) * .5 + .5), by: up ? -40 : 0 }); });
  }

  // ---------- S1 ROTINA (rises from behind the phone top)
  {
    const t0 = Wd('rotina') - .05, tout = L[2][0] - .15; const P = pose(t);
    mv(rot, t, tt => { if (tt < t0 || tt > tout + .3) return null; const yIn = tw(tt, t0, t0 + .45, PY - 260, 350, E.oq); const xo = tt > tout ? E.ie(clamp((tt - tout) / .3)) * -1400 : 0; return { x: 540 + xo, y: yIn, op: 1, s: tw(tt, t0, t0 + .45, .7, 1) }; });
    put(jaSabe, null);
    if (t > L[1][0] + 1 && t < 5.0) jaSabe.style.opacity = 1;
  }

  // ---------- S2 salário / contas fixas / saldo (left column, out of the phone)
  {
    const P = pose(t), tout = L[3][0] - .2;
    const emerge = (e, tin, x, y) => mv(e, t, tt => { if (tt < tin || tt > tout + .32) return null; const u = E.oq(clamp((tt - tin) / .5)); const xo = tt > tout ? E.ie(clamp((tt - tout) / .32)) * -1400 : 0; return { x: lerp(P.x, x, u) + xo, y: lerp(P.y, y, u), op: 1, s: lerp(.7, 1, u), r: lerp(8, 0, u) }; });
    emerge(pSal, Wd('salario', 1) - .05, 235, 600);
    emerge(pFix, Wd('saem') - .1, 235, 880);
    emerge(pSaldo, Wd('saldo') - .12, 235, 1175);
    $('saldoN').textContent = fmtBRL(Math.round(tw(t, Wd('acompanha') - .2, Wd('acompanha') + .5, 3480, 1590, E.oc)));
  }

  // ---------- S3 iFood
  {
    const tA = L[3][0] - .1, tSw = Wd('anota') - .12, tout = L[4][0] - .15; const P = pose(t);
    mv(g1, t, tt => whip(tt, 540, 330, tA, .38, 'L', tSw, .22, 'R'));
    mv(g2, t, tt => whip(tt, 540, 330, tSw + .18, .38, 'L', tout, .3, 'U'));
    const em = (e, tin, x, y) => mv(e, t, tt => { if (tt < tin || tt > tout + .3) return null; const u = E.oq(clamp((tt - tin) / .45)); const yo = tt > tout ? E.ie(clamp((tt - tout) / .3)) * 1500 : 0; return { x: lerp(P.x, x, u), y: lerp(P.y + 100, y, u) + yo, op: 1, s: lerp(.6, 1, u) }; });
    em(cVal, Wd('hora') - .2, 200, 820);
    em(cCat, Wd('categoria') - .05, 200, 1010);
    em(cCard, Wd('cartao') - .08, 200, 1200);
  }

  // ---------- S4 green panel left + options
  {
    const tin = L[4][0] - .25, tout = L[5][0] - .3;
    const px = t < tin ? -700 : t < tin + .4 ? lerp(-700, 0, E.oe(clamp((t - tin) / .4))) : t > tout ? lerp(0, -760, E.ie(clamp((t - tout) / .35))) : 0;
    put(greenL, t < tin || t > tout + .35 ? null : { x: 310 + px, y: 960, op: 1 });
    const ride = px; // texts ride with the panel on exit
    mv(a1, t, tt => { const o = whip(tt, 275, 430, Wd('conta') - .05, .4, 'L', null, 0, 'L'); if (!o || tt > tout + .35) return null; if (tt > tout) o.x += lerp(0, -760, E.ie(clamp((tt - tout) / .35))); return o; });
    mv(a2, t, tt => { if (tt < Wd('agenda') - .3 || tt > tout + .35) return null; return { x: 270 + (tt > tout ? lerp(0, -760, E.ie(clamp((tt - tout) / .35))) : 0), y: 545, op: 1 }; }); stagger(a2, t, Wd('agenda') - .3, .022);
    const act = [Wd('mensal') - .1, Wd('parcelada') - .1, Wd('unica') - .1];
    [o1, o2, o3].forEach((e, i) => mv(e, t, tt => { const o = whip(tt, 290, 820 + i * 175, act[i], .38, 'L', null, 0, 'L'); if (!o || tt > tout + .35) return null; if (tt > tout) o.x += lerp(0, -760, E.ie(clamp((tt - tout) / .35))); o.op = (i < 2 && tt > act[i + 1] + .1) ? .38 : 1; return o; }));
    const cur = t < act[1] ? 0 : t < act[2] ? 1 : 2; const dy = 820 + cur * 175;
    put(dot1, t < act[0] + .2 || t > tout ? null : { x: 48, y: dy - 6, op: 1, s: 1 + .4 * Math.max(0, 1 - (t - act[cur]) / .25) });
  }

  // ---------- S5 orçamentos
  {
    const tin = L[5][0] - .1, tout = L[6][0] - .2;
    mv(b1, t, tt => whip(tt, 235, 430, tin, .38, 'L', tout, .3, 'L', { ax: .5 }));
    mv(b2, t, tt => whip(tt, 235, 545, Wd('categoria', 1) - .05, .38, 'L', tout + .02, .3, 'L'));
    mv(b3, t, tt => whip(tt, 235, 660, Wd('limite') - .1, .38, 'L', tout + .04, .3, 'L'));
    mv(bA, t, tt => whip(tt, 235, 880, Wd('barra') - .35, .4, 'L', tout + .06, .3, 'L'));
    mv(bO, t, tt => whip(tt, 235, 1060, Wd('barra') - .2, .4, 'L', tout + .08, .3, 'L'));
    bA.querySelector('i').style.width = (tw(t, Wd('enche') - .1, Wd('enche') + .7, 0, 14.5, E.oc)).toFixed(2) + '%';
    const oFill = tw(t, Wd('conforme') - .1, Wd('gasta') + .1, 0, 100, E.ioc); bO.querySelector('i').style.width = oFill + '%';
    const ov = clamp((t - Wd('gasta') - .05) / .3); bO.querySelector('.bar').style.boxShadow = ov > 0 && t < tout ? `0 0 0 ${(4 * ov).toFixed(1)}px rgba(204,0,0,.35)` : 'none';
    mv(estourou, t, tt => { if (tt < Wd('gasta') || tt > tout + .3) return null; const s = E.ob(clamp((tt - Wd('gasta')) / .3)); return { x: 300 + (tt > tout ? -1400 * E.ie(clamp((tt - tout) / .3)) : 0), y: 1250, s, op: 1 }; });
  }

  // ---------- S6 cartões
  {
    const tin = Wd('cartao', 1) - .2, tout = L[7][0] - .2; const P = pose(t);
    const cardMove = (e, tin2, x, y, ry, rz) => mv(e, t, tt => { if (tt < tin2 || tt > tout + .3) return null; const u = E.oq(clamp((tt - tin2) / .6)); const xo = tt > tout ? E.ie(clamp((tt - tout) / .3)) * 1400 : 0; const bob = Math.sin(tt * 2.2 + x) * 8; return { x: lerp(P.x, x, u) + xo, y: lerp(P.y, y, u) + bob, op: 1, s: lerp(.5, 1, u), t3: ` perspective(1200px) rotateY(${lerp(0, ry, u).toFixed(1)}deg) rotateZ(${lerp(0, rz, u).toFixed(1)}deg)` }; });
    cardMove(card1, tin, 805, 690, -24, -4);
    cardMove(card2, tin + .18, 820, 1010, -20, 5);
    [card1, card2].forEach(c => { const b = c.querySelector('.cbar'); b.style.width = (tw(t, Wd('limite', 1) - .1, Wd('limite', 1) + .6, 0, +b.dataset.p, E.oc)).toFixed(1) + '%'; });
    mv(k1, t, tt => whip(tt, 805, 370, Wd('fatura') - .1, .38, 'R', tout, .3, 'R'));
    mv(k2, t, tt => { if (tt < Wd('usado') - .25 || tt > tout + .3) return null; const u = E.ob(clamp((tt - Wd('usado') + .25) / .35)); return { x: 805 + (tt > tout ? 1400 * E.ie(clamp((tt - tout) / .3)) : 0), y: 1255, s: u, op: 1 }; });
    mv(k3, t, tt => whip(tt, 805, 1425, Wd('parcelas') - .1, .4, 'R', tout + .03, .3, 'R'));
    // card2 shifts up a bit when the parcelas card arrives? keep (no overlap: card2 bottom 1149 < k2 top 1220)
  }

  // ---------- S7 assinaturas (dark)
  {
    const tin = L[7][0] - .35, tout = L[8][0] - .3;
    const dy = t < tin ? 1920 : t < tin + .4 ? lerp(1920, 0, E.oe(clamp((t - tin) / .4))) : t > tout ? lerp(0, 1920, E.ie(clamp((t - tout) / .35))) : 0;
    put(dark, t < tin || t > tout + .35 ? null : { x: 540, y: 960 + dy, op: 1, blur: false });
    mv(s1, t, tt => whip(tt, 540, 330, Wd('assinaturas') - .05, .4, 'D', Wd('pra') - .1, .25, 'U'));
    mv(s2, t, tt => whip(tt, 540, 290, Wd('pra') + .1, .35, 'D', tout, .32, 'D'));
    $('subN').textContent = fmtBRL(tw(t, Wd('quanto', 1) - .1, Wd('sai') + .3, 0, 365.6, E.oc), 2);
    mv(s3, t, tt => { if (tt < Wd('todo') - .1 || tt > tout + .32) return null; return { x: 540, y: 455 + (tt > tout ? -1500 * E.ie(clamp((tt - tout) / .32)) : 0), op: clamp((tt - Wd('todo') + .1) / .25) * (.85 + .15 * Math.sin(tt * 40)) }; });
  }

  // ---------- S8 investimentos (green floor rises)
  {
    const tin = L[8][0] - .3, tout = L[10][0] - .35; // floor stays through S9
    const fy = t < tin ? 2300 : t < tin + .5 ? lerp(2300, 1560 + 350, E.oc(clamp((t - tin) / .5))) : t > tout ? lerp(1910, 2400, E.ic(clamp((t - tout) / .4))) : 1910;
    put(floor, t < tin || t > tout + .4 ? null : { x: 540, y: fy, op: 1, blur: false });
    const t1 = L[9][0] - .2;
    mv(i1, t, tt => whip(tt, 540, 330, Wd('investimentos') - .1, .38, 'R', Wd('rende') - .3, .22, 'L'));
    mv(i2, t, tt => whip(tt, 540, 330, Wd('rende') - .12, .38, 'R', t1, .3, 'U'));
    $('rendN').textContent = fmtBRL(Math.round(tw(t, Wd('rende') - .1, Wd('mes', 2) + .2, 0, 224, E.oc)));
    mv(i3, t, tt => { if (tt < Wd('reserva') - .2 || tt > t1 + .3) return null; return { x: 540, y: 470 + (tt > t1 ? -1500 * E.ie(clamp((tt - t1) / .3)) : 0), op: 1 }; }); stagger(i3, t, Wd('reserva') - .2, .02);
    const P = pose(t);
    mv(donut, t, tt => { const t0 = Wd('reserva') - .1; if (tt < t0 || tt > t1 + .3) return null; const u = E.oq(clamp((tt - t0) / .55)); return { x: lerp(P.x, 160, u) + (tt > t1 ? -1400 * E.ie(clamp((tt - t1) / .3)) : 0), y: lerp(P.y, 1250, u), s: lerp(.4, 1, u), r: lerp(-120, 0, u) + tt * 12, op: 1 }; });
  }

  // ---------- S9 relatório (left column; REAL sits on the floor line with a reflection)
  {
    const tin = L[9][0] - .1, tout = L[10][0] - .3;
    mv(r1, t, tt => whip(tt, 270, 420, tin, .38, 'L', tout, .3, 'L'));
    mv(r2, t, tt => whip(tt, 270, 560, Wd('pra', 1) - .2, .01, 'D', tout + .02, .3, 'L')); stagger(r2, t, Wd('pra', 1) - .2, .025);
    mv(r3, t, tt => whip(tt, 270, 1240, Wd('cada', 1) - .15, .38, 'L', tout + .04, .3, 'L'));
    mv(r4, t, tt => whip(tt, 270, 1430, Wd('real') - .12, .38, 'L', tout + .06, .3, 'L'));
    mv(r4r, t, tt => { const o = whip(tt, 270, 1430 + 176, Wd('real') - .12, .38, 'L', tout + .06, .3, 'L'); if (o) o.t3 = ' scaleY(-1)'; return o; });
  }

  // ---------- S10 o resto da rotina
  {
    const tin = Wd('resto') - .25, tout = L[11][0] - .2;
    mv(z1, t, tt => (tt < tin || tt > tout + .3) ? null : { x: 540, y: 330 + (tt > tout ? -1500 * E.ie(clamp((tt - tout) / .3)) : 0), op: 1, blur: false }); assemble(z1, t, tin, .5, 340, 21);
    mv(z2, t, tt => (tt < Wd('tambem') - .3 || tt > tout + .3) ? null : { x: 540, y: 445 + (tt > tout ? -1500 * E.ie(clamp((tt - tout) / .3)) : 0), op: 1 }); stagger(z2, t, Wd('tambem') - .3, .03);
  }

  // ---------- S11 hábitos
  {
    const tin = L[11][0] - .15, tout = L[12][0] - .25; const taps = D.taps.filter(x => x[0] > 37.8 && x[0] < 40.1).map(x => x[0]);
    mv(hb1, t, tt => whip(tt, 270, 420, tin, .38, 'L', tout, .3, 'L'));
    mv(hb2, t, tt => whip(tt, 270, 545, Wd('habitos') - .15, .01, 'D', tout + .02, .3, 'L')); stagger(hb2, t, Wd('habitos') - .15, .03);
    hbs.forEach((e, i) => {
      const ti = taps[i] || (38 + i * .6);
      mv(e, t, tt => { const o = whip(tt, 255, 760 + i * 150, tin + .1 + i * .08, .38, 'L', tout + .03 * i, .3, 'L', { ax: .5 }); return o; });
      const u = clamp((t - ti - .05) / .18); const b = e.querySelector('.chk b'); b.style.opacity = u; b.style.transform = `scale(${(u < 1 ? .5 + .5 * E.ob(u) : 1).toFixed(3)})`;
      e.querySelector('path').style.strokeDashoffset = (60 * (1 - clamp((t - ti - .1) / .2))).toFixed(1);
      e.querySelector('.chk').style.transform = `scale(${(1 + .18 * Math.sin(Math.PI * clamp((t - ti) / .3))).toFixed(3)})`;
    });
  }

  // ---------- S12 treino (green panel right)
  {
    const tin = L[12][0] - .3, tout = L[13][0] - .25;
    const px = t < tin ? 700 : t < tin + .4 ? lerp(700, 0, E.oe(clamp((t - tin) / .4))) : t > tout ? lerp(0, 760, E.ie(clamp((t - tout) / .35))) : 0;
    put(greenR, t < tin || t > tout + .35 ? null : { x: 760 + px, y: 960, op: 1 });
    const ride = (o, tt) => { if (!o || tt > tout + .35) return null; if (tt > tout) o.x += lerp(0, 760, E.ie(clamp((tt - tout) / .35))); return o; };
    mv(tr1, t, tt => ride(whip(tt, 790, 430, Wd('treino') - .08, .38, 'R', null, 0, 'R'), tt));
    mv(tr2, t, tt => ride(whip(tt, 790, 790, Wd('carga') - .15, .38, 'R', null, 0, 'R'), tt));
    $('kgN').textContent = (Math.round(tw(t, Wd('carga') - .1, Wd('carga') + .6, 20, 47.5, E.oc) * 2) / 2).toLocaleString('pt-BR', { minimumFractionDigits: 1 });
    mv(tr3, t, tt => ride(tt < Wd('cada', 2) - .2 ? null : { x: 790, y: 1065, op: 1 }, tt)); stagger(tr3, t, Wd('cada', 2) - .2, .03);
  }

  // ---------- S13 gráficos (bars rise behind the phone)
  {
    const tin = L[13][0] - .15, tout = L[14][0] - .2;
    mv(gr1, t, tt => whip(tt, 540, 330, Wd('graficos') - .1, .38, 'U', Wd('semana') - .2, .22, 'L'));
    mv(gr2, t, tt => whip(tt, 300, 330, Wd('semana') - .1, .36, 'L', tout, .3, 'U'));
    mv(gr3, t, tt => whip(tt, 790, 330, Wd('mes', 3) - .1, .36, 'R', tout + .03, .3, 'U'));
    const by = t > tout + .2 ? lerp(0, 900, E.ic(clamp((t - tout - .2) / .4))) : 0;
    put(barsBg, t < tin || t > tout + .7 ? null : { x: 540, y: 1570 + 350 - 350 + by, op: 1, blur: false });
    [...barsBg.children].forEach((b, i) => { const u = E.ob(clamp((t - tin - .1 - i * .06) / .45)); b.style.transform = `scaleY(${u.toFixed(3)})`; });
  }

  // ---------- S14 CTA
  {
    const tin = L[14][0] - .1, tG = Wd('link') - .3;
    mv(c1, t, tt => whip(tt, 540, 300, tin, .38, 'L', tG, .2, 'U'));
    mv(c2, t, tt => whip(tt, 540, 465, Wd('agora') - .12, .36, 'R', tG, .2, 'U'));
    const endOn = t >= tG + .12;
    put(endBg, endOn ? { x: 540, y: 960, op: 1, blur: false } : null);
    const typedN = Math.floor(clamp((t - tG - .35) / .45) * 6); if (endOn) $('typed').textContent = 'Rotina'.slice(0, typedN);
    $('caret').style.opacity = Math.floor(t * 2.5) % 2 ? 1 : .15;
    put(endLogo, endOn ? { x: 540, y: 760, s: tw(t, tG + .12, tG + .5, .85, 1, E.ob), op: 1 } : null);
    put(endBar, endOn ? { x: 540, y: 1000, s: tw(t, tG + .25, tG + .55, .4, 1, E.ob), op: clamp((t - tG - .2) / .1) } : null);
    endBar.querySelectorAll('.eb').forEach((e, i) => { const sp = tw(t, tG + .25, tG + .9, 1, .25, E.oc); e.style.transform = i ? `translate(${(9 * sp).toFixed(1)}px,${(7 * sp).toFixed(1)}px)` : `translate(${(-9 * sp).toFixed(1)}px,${(-7 * sp).toFixed(1)}px)`; });
    put(endLink, endOn && t > Wd('link') - .05 ? { x: 540, y: 1190, op: 1 } : null); if (endOn) stagger(endLink, t, Wd('link') - .05, .035);
    // glitch burst between tG-.1 and tG+.35: rgb split + slices + static
    const g = t > tG - .12 && t < tG + .32; const gi = g ? 1 - Math.abs((t - tG - .1) / .22) : 0;
    $('stage').style.filter = g ? `drop-shadow(${(14 * gi).toFixed(1)}px 0 0 rgba(255,0,60,.75)) drop-shadow(${(-14 * gi).toFixed(1)}px 0 0 rgba(0,240,255,.75))` : 'none';
    if (g) { let s = ''; for (let k = 0; k < 7; k++) { const yy = rnd(f * 7 + k) * 1920, hh = 8 + rnd(f * 13 + k) * 60; s += `<div style="position:absolute;left:0;top:${yy}px;width:1080px;height:${hh}px;background:rgba(${rnd(k + f) > .5 ? '255,255,255' : '0,0,0'},${(.25 + .5 * rnd(f + k * 3)).toFixed(2)});transform:translateX(${((rnd(f * 3 + k) - .5) * 120).toFixed(0)}px)"></div>`; } scan.innerHTML = s; scan.style.display = 'block'; statC.style.display = 'block'; const im = statX.createImageData(270, 480); for (let i = 0; i < im.data.length; i += 4) { const v = rnd(i * .37 + f * 11) * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; } statX.putImageData(im, 0, 0); statC.style.opacity = (.55 * gi).toFixed(2); }
    else { scan.style.display = 'none'; statC.style.display = 'none'; }
    $('stage').style.transform = g ? `translateX(${((rnd(f) - .5) * 40 * gi).toFixed(1)}px)` : 'none';
  }

  // ---------- phone
  {
    const P = pose(t); const pz = 1 + punch(t);
    const s = P.s * pz * 1.1; const yb = P.y - 6 * Math.sin(t * 1.7); // gentle float
    const prev = pose(t - 1 / 60);
    const vx = (P.x - prev.x) * .5, vy = (P.y - prev.y) * .5;
    const w = $('phoneWrap');
    w.style.transform = `translate3d(${(P.x - PH.w / 2).toFixed(2)}px,${(yb - PH.h / 2).toFixed(2)}px,0) perspective(2200px) rotateX(${P.rx.toFixed(2)}deg) rotateY(${P.ry.toFixed(2)}deg) scale(${s.toFixed(4)})`;
    w.style.filter = mblur(vx, vy);
    w.style.display = P.y > 2600 ? 'none' : 'block';
    const sh = $('pshadow'); const onFloor = 1;
    sh.style.transform = `translate3d(${(P.x - 260).toFixed(1)}px,${(yb + PH.h * s / 2 - 10).toFixed(1)}px,0) scale(${(s * 1.0).toFixed(3)},${(s).toFixed(3)})`;
    sh.style.opacity = P.y > 2000 ? 0 : (.9 * clamp(1 - Math.abs(P.ry % 360) / 120)).toFixed(2);
    // app image
    const file = appFile(t); const img = $('app');
    const bootOp = t < 2.75 ? 1 : clamp(1 - (t - 2.75) / .15);
    $('boot').style.opacity = bootOp; $('boot').style.display = bootOp <= 0 ? 'none' : 'block';
    if (file && file !== curSrc) { curSrc = file; img.src = '../frames/app/' + file; await img.decode().catch(() => {}); }
    drawTouches(t);
  }
  return true;
};
window.DUR = DUR; window.FPS = FPS;
})();
