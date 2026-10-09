// ============================================================
// motion-studio · ENGINE (genérico — não editar por projeto)
// Ordem de carga: project.js → style.js → engine.js → scenes.js
// Tudo é função pura do frame. API documentada em SKILL.md.
// ============================================================
const P = window.PROJECT, S = window.STYLE;
const W = P.w || S.w || 1920, H = P.h || S.h || 1080, FPS = P.fps || S.fps || 60, N = P.frames;
const K = S.colors.dark, WH = S.colors.light, O = S.colors.accent, B = S.colors.contrast, CARD = S.colors.card;
const DISPLAY = S.fonts.display, MONO = S.fonts.mono;
const TAU = Math.PI * 2;
let BS = 1;          // escala do blur (miniaturas / preview em escala reduzida)
let THUMB = false;   // true enquanto renderiza miniaturas (evita recursão)

// ---------- utilidades ----------
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const E = {
  lin: t => t,
  inC: t => t * t * t,
  outC: t => 1 - Math.pow(1 - t, 3),
  inOutC: t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  inOutQ: t => (t < .5 ? 16 * t ** 5 : 1 - Math.pow(-2 * t + 2, 5) / 2),
};
const cb = (x1, y1, x2, y2) => t => cubicY(t, x1, y1, x2, y2);
E.out5 = t => 1 - Math.pow(1 - t, 5);
E.smooth = cb(.45, 0, .12, 1);   // arranque suave, chegada longa
E.push = cb(.72, 0, .1, 1);      // acelera forte, desacelera devagar (whip)
E.cam = cb(.33, 0, .67, 1);      // deriva de câmera quase constante
const prog = (f, a, b, e = E.inOutC) => e(clamp((f - a) / (b - a)));
// câmera contínua: zoom lento em torno do centro → nunca há quadro parado
function cam(ctx, f, a, b, s0, s1) {
  const s = lerp(s0, s1, E.cam(clamp((f - a) / (b - a))));
  ctx.translate(W / 2, H / 2); ctx.scale(s, s); ctx.translate(-W / 2, -H / 2);
}
function spring(f, start, { k = 170, c = 20, m = 1 } = {}) {
  const t = (f - start) / FPS;
  if (t <= 0) return 0;
  const w0 = Math.sqrt(k / m), z = c / (2 * Math.sqrt(k * m));
  if (z < 1) {
    const wd = w0 * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + (z * w0 / wd) * Math.sin(wd * t));
  }
  return 1 - Math.exp(-w0 * t) * (1 + w0 * t);
}
const blur = px => (px > 0.05 ? `blur(${(px * BS).toFixed(2)}px)` : 'none');
const font = (w, s, fam = DISPLAY) => `${w} ${s}px "${fam}"`;
const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function circle(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, TAU); }

// bezier p/ curva de easing
const bz = (t, a, b) => 3 * a * (1 - t) ** 2 * t + 3 * b * (1 - t) * t * t + t ** 3;
function cubicY(x, x1, y1, x2, y2) {
  let t = x;
  for (let i = 0; i < 10; i++) {
    const d = 3 * (1 - t) ** 2 * x1 + 6 * (1 - t) * t * (x2 - x1) + 3 * t * t * (1 - x2);
    if (Math.abs(d) < 1e-6) break;
    t = clamp(t - (bz(t, x1, x2) - x) / d);
  }
  return bz(t, y1, y2);
}

// ---------- camadas (alpha / blur de grupo) ----------
const pool = {}; let depth = 0;
function layer(ctx, alpha, bl, draw) {
  if (alpha <= 0.002) return;
  if (alpha >= 0.999 && bl < 0.3) { draw(ctx); return; }
  const w = ctx.canvas.width, h = ctx.canvas.height, key = `${w}x${h}_${depth}`;
  const c = pool[key] || (pool[key] = mk(w, h));
  const l = c.getContext('2d');
  l.setTransform(1, 0, 0, 1, 0, 0); l.clearRect(0, 0, w, h);
  l.setTransform(ctx.getTransform()); l.globalAlpha = 1; l.filter = 'none';
  depth++; draw(l); depth--;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha *= alpha; ctx.filter = blur(bl); ctx.drawImage(c, 0, 0);
  ctx.restore();
}

// ---------- fundo ----------
function blob(ctx, x, y, rx, ry, rgb, a) {
  ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
  g.addColorStop(0, `rgba(${rgb},${a})`);
  g.addColorStop(.45, `rgba(${rgb},${a * .5})`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g; ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
  ctx.restore();
}
// fundo do estilo: blobs periódicos em N frames → loop perfeito
function bg(ctx, f, dark) {
  const p = (f / N) * TAU, cfg = dark ? S.bg.dark : S.bg.light;
  ctx.fillStyle = dark ? K : WH; ctx.fillRect(0, 0, W, H);
  for (const b of cfg.blobs)
    blob(ctx, b.x + Math.sin(p * b.fx + (b.px || 0)) * b.ax, b.y + Math.sin(p * b.fy + (b.py || 0)) * b.ay, b.rx, b.ry, b.rgb, b.a);
  const gr = S.bg.grid;   // papel quadriculado opcional (style.bg.grid = {light, dark, step}), desliza devagar e fecha o loop
  if (gr && (dark ? gr.dark : gr.light)) {
    const st = gr.step || 54, off = (f / N) * st;
    ctx.save(); ctx.strokeStyle = dark ? gr.dark : gr.light; ctx.lineWidth = 1.5; ctx.beginPath();
    for (let x = -st + off % st; x < W + st; x += st) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
    for (let y = -st + off % st; y < H + st; y += st) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
    ctx.stroke(); ctx.restore();
  }
}

// ---------- tipografia ----------
// parts: [[texto, cor?], ...] — anima palavra por palavra (blur-in + sobe)
function words(ctx, f, parts, o = {}) {
  const { x = 960, y = 540, size = 80, weight = 600, start = 0, stagger = 4, dur = 34,
    align = 'center', color = WH, exit = 0, am = 1, ls = -1.5, drift = 0, fam = DISPLAY } = o;
  ctx.save();
  ctx.font = font(weight, size, fam); ctx.letterSpacing = `${ls}px`; ctx.textBaseline = 'middle';
  const ws = [];
  parts.forEach(([t, c]) => t.split(' ').filter(Boolean).forEach(w => ws.push([w, c || color])));
  const sp = ctx.measureText(' ').width;
  const widths = ws.map(w => ctx.measureText(w[0]).width);
  const total = widths.reduce((a, b) => a + b, 0) + sp * (ws.length - 1);
  let cx = align === 'center' ? x - total / 2 : x;
  ws.forEach(([w, c], i) => {
    const p = E.out5(clamp((f - start - i * stagger) / dur));
    const a = p * (1 - exit) * am;
    if (a > 0.003) {
      ctx.globalAlpha = a;
      ctx.filter = blur((1 - p) * 18 + exit * 26);
      ctx.fillStyle = c;
      ctx.fillText(w, cx + (i - (ws.length - 1) / 2) * drift, y + (1 - p) * 26 - exit * 14);
    }
    cx += widths[i] + sp;
  });
  ctx.restore();
  return total;
}
// motion blur horizontal (várias cópias deslocadas)
function smear(ctx, amt, draw) {
  const n = Math.abs(amt) < 1.5 ? 1 : Math.min(48, Math.ceil(Math.abs(amt) / 4) + 2);
  const a = n > 1 ? 1 - Math.pow(.06, 1 / n) : 1;
  for (let i = 0; i < n; i++) {
    ctx.save();
    if (n > 1) { ctx.translate((i / (n - 1) - .5) * amt, 0); ctx.filter = blur(2.5); }
    draw(a);
    ctx.restore();
  }
}
// logo: ponto na cor de acento + texto da marca (PROJECT.brand)
function logo(ctx, f, { x = 960, y = 540, start = 0, exit = 0, am = 1, offset = 0, text = P.brand || '' } = {}) {
  ctx.save();
  ctx.font = font(600, 64); ctx.letterSpacing = `${-1.5 + E.smooth(clamp((f - start) / 110)) * 5}px`; ctx.textBaseline = 'middle';
  const tw = ctx.measureText(text).width, gw = 52 + 22 + tw, x0 = x - gw / 2 + offset;
  const ps = spring(f, start, { k: 180, c: 13 });
  const pt = E.out5(clamp((f - start - 8) / 44));
  const a = (1 - exit) * am;
  ctx.globalAlpha = a; ctx.filter = blur(exit * 22);
  ctx.fillStyle = O; circle(ctx, x0 + 26, y, 26 * ps); ctx.fill();
  ctx.globalAlpha = a * pt; ctx.filter = blur((1 - pt) * 22 + exit * 22);
  ctx.fillStyle = WH; ctx.fillText(text, x0 + 74 + (1 - pt) * 34, y + 2);
  ctx.restore();
}
// sublinhado "caneta" azul
function penLine(ctx, x, y, w, p, seed = 1, lw = 7) {
  if (p <= 0) return;
  ctx.save(); ctx.strokeStyle = B; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  const n = 48, m = Math.max(1, Math.floor(n * p));
  for (let i = 0; i <= m; i++) {
    const t = i / n, px = x + t * w;
    const py = y + Math.sin(t * 7 + seed) * 3 + Math.sin(t * 19 + seed * 2) * 1.4 + t * 5;
    i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
  }
  ctx.stroke(); ctx.restore();
}

// ---------- perspectiva 3D (rotateY por fatias) ----------
function persp(ctx, src, cx, cy, { ry = 0, rz = 0, s = 1, light = false, shadow = true } = {}) {
  // com alpha < 1 as fatias sobrepostas criam listras → desenha opaco numa camada e aplica o alpha no grupo
  if (ctx.globalAlpha < .999) {
    const ga = ctx.globalAlpha; ctx.globalAlpha = 1;
    layer(ctx, ga, 0, L => persp(L, src, cx, cy, { ry, rz, s, light, shadow }));
    ctx.globalAlpha = ga; return;
  }
  const w = src.width, h = src.height, F = 2200, sw = 3, sn = Math.sin(ry), cs = Math.cos(ry);
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rz); ctx.scale(s, s);
  if (shadow) {
    ctx.save(); ctx.filter = blur(48);
    ctx.fillStyle = light ? 'rgba(10,10,10,.16)' : 'rgba(0,0,0,.62)';
    rr(ctx, (-w / 2) * cs * .94, -h / 2 + 56, w * cs * .94, h * .96, 40); ctx.fill();
    ctx.restore();
  }
  ctx.filter = 'none';
  for (let x = 0; x < w; x += sw) {
    const a = x - w / 2, b = Math.min(x + sw, w) - w / 2;
    const pa = F / (F + a * sn), pb = F / (F + b * sn);
    const xa = a * cs * pa, xb = b * cs * pb, dh = h * (pa + pb) / 2;
    ctx.drawImage(src, x, 0, Math.min(sw, w - x), h, xa, -dh / 2, xb - xa + .7, dh);
  }
  ctx.restore();
}


// ============================================================
// ASSETS (fotos, PNGs recortados, footage) — pré-carregados antes do render
// project.js:  assets: ['tenis.png', ...]  → projects/<p>/assets/<arquivo>
//              footage: { jogo: 90, ... }  → projects/<p>/assets/jogo/0001.jpg.. (gerado por tools/footage.sh)
const ASSETS = {};
function loadAssets() {
  const base = '../' + P.dir + '/assets/', jobs = [];
  const one = (key, src) => jobs.push(new Promise(r => { const i = new Image(); i.onload = () => { ASSETS[key] = i; r(); }; i.onerror = () => { console.error('asset faltando: ' + src); r(); }; i.src = src; }));
  (P.assets || []).forEach(a => one(a, base + a));
  // footage NÃO é pré-carregado (1000+ quadros full HD estouram a memória): FOOT carrega sob demanda
  return Promise.all(jobs);
}
const IMG = k => ASSETS[k];
// quadro do footage no frame local lf (loop se passar do fim; speed 1 = tempo real)
// footage sob demanda: FOOT pede o quadro; se ainda não chegou, marca FOOT_MISS e devolve o último quadro carregado
// do mesmo clipe. renderReady(f) (runtime) espera os pedidos e re-renderiza; quadros não usados há 45f são liberados.
const FOOT_PENDING = new Map(), FOOT_USED = new Map(), FOOT_LAST = {};
let FOOT_MISS = false, FOOT_NOW = 0;
function FOOT(name, lf, speed = 1) {
  const c = (P.footage || {})[name] || 1, ff = P.footageFps || 30;
  const i = Math.floor(Math.max(0, lf) * speed * ff / FPS) % c, key = name + '#' + (i + 1);
  FOOT_USED.set(key, FOOT_NOW);
  if (ASSETS[key]) return (FOOT_LAST[name] = ASSETS[key]);
  FOOT_MISS = true;
  if (!FOOT_PENDING.has(key)) FOOT_PENDING.set(key, new Promise(r => {
    const im = new Image();
    im.onload = () => im.decode().catch(() => {}).then(() => { ASSETS[key] = im; FOOT_PENDING.delete(key); r(); });
    im.onerror = () => { console.error('footage faltando: ' + key); ASSETS[key] = FOOT_LAST[name] || null; FOOT_PENDING.delete(key); r(); };
    im.src = '../' + P.dir + '/assets/' + name + '/' + String(i + 1).padStart(4, '0') + '.jpg';
  }));
  return FOOT_LAST[name];
}
function footEvict(f) {
  for (const [k, u] of FOOT_USED) if (Math.abs(f - u) > 45) { const im = ASSETS[k]; if (im && /\/assets\/[^/]+\/\d+\.jpg$/.test(im.src)) { im.onload = im.onerror = null; im.src = ''; } delete ASSETS[k]; FOOT_USED.delete(k); }
}
// desenha imagem em "cover" num retângulo (zoom s em torno do centro, ox/oy = foco 0..1)
function cover(ctx, img, x, y, w, h, { s = 1, ox = .5, oy = .5 } = {}) {
  if (!img) return;
  const k = Math.max(w / img.width, h / img.height) * s, iw = img.width * k, ih = img.height * k;
  ctx.drawImage(img, x + (w - iw) * ox, y + (h - ih) * oy, iw, ih);
}
const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// footage em tela cheia: zoom contínuo, P&B opcional, borda com blur radial (look "lente")
function footage(ctx, f, img, { s0 = 1.04, s1 = 1.14, a = 0, b = N, bw = false, contrast = 1.15, edgeBlur = 14, dim = 0 } = {}) {
  const s = lerp(s0, s1, prog(f, a, b, E.lin));
  const flt = (bw ? 'grayscale(1) ' : '') + `contrast(${contrast})`;
  if (edgeBlur <= 0) { ctx.save(); ctx.filter = flt; cover(ctx, img, 0, 0, W, H, { s }); ctx.restore(); }
  else {
    ctx.save(); ctx.filter = flt + ' ' + blur(edgeBlur); cover(ctx, img, 0, 0, W, H, { s: s * 1.03 }); ctx.restore();
    layer(ctx, .998, 0, L => {                           // (.998 força camada própria) centro nítido, sumindo para as bordas
      L.save(); L.filter = flt; cover(L, img, 0, 0, W, H, { s }); L.restore();
      L.globalCompositeOperation = 'destination-in';
      const g = L.createRadialGradient(W / 2, H / 2, H * .25, W / 2, H / 2, H * .7);
      g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      L.fillStyle = g; L.fillRect(0, 0, W, H);
    });
  }
  if (dim > 0) { ctx.fillStyle = `rgba(0,0,0,${dim})`; ctx.fillRect(0, 0, W, H); }
}
// vinheta de borda (estilo editorial: cinza sobre o branco)
function vignette(ctx, amt = .5, rgb = '0,0,0', inner = .42) {
  if (amt <= 0) return;
  const cw = ctx.canvas.width, ch = ctx.canvas.height;
  const g = ctx.createRadialGradient(cw / 2, ch / 2, ch * inner, cw / 2, ch / 2, Math.hypot(cw, ch) / 2);
  g.addColorStop(0, `rgba(${rgb},0)`); g.addColorStop(1, `rgba(${rgb},${amt})`);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = g; ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height); ctx.restore();
}

// texto condensado EMPILHADO, palavra a palavra com glitch (pop de escala + jitter + blur)
// lines: [[texto, frameInicio?, cor?], ...] — sem frame, segue o stagger da linha anterior
function stackText(ctx, f, lines, o = {}) {
  const { x = 120, y = 200, size = 96, lh = .98, color = O, start = 0, stagger = 5, gap = 6, align = 'left',
    fam = DISPLAY, weight = 400, exit = 0, drift = 0, glitch = 1, ls = 0 } = o;
  ctx.save(); ctx.font = font(weight, size, fam); ctx.textBaseline = 'top'; ctx.letterSpacing = `${ls}px`;
  let t0 = start, k = 0;
  lines.forEach((ln, li) => {
    const [txt, st, col] = ln; if (st != null) t0 = st;
    const ws = txt.split(' ').filter(Boolean), sp = ctx.measureText(' ').width;
    const wd = ws.map(w => ctx.measureText(w).width), tot = wd.reduce((a, b) => a + b, 0) + sp * (ws.length - 1);
    let cx = align === 'center' ? x - tot / 2 : align === 'right' ? x - tot : x;
    const ly = y + li * size * lh - drift * prog(f, start, start + 600, E.lin);
    ws.forEach((w, i) => {
      const ws0 = t0 + i * stagger, p = clamp((f - ws0) / 16);
      if (p > 0) {
        const e = E.out5(p), ph = spring(f, ws0, { k: 260, c: 18 });
        const jit = glitch * (1 - clamp((f - ws0) / 7)), sd = ++k * 7.3 + Math.floor(f / 2);
        const a = clamp(p * 3) * (1 - exit);
        ctx.save();
        ctx.translate(cx + wd[i] / 2 + (hash(sd) - .5) * 40 * jit, ly + size / 2 + (hash(sd + 1) - .5) * 24 * jit);
        const sc = lerp(1.6, 1, ph) * (1 + exit * .3);
        ctx.scale(sc, sc * lerp(1, 1.0, ph)); ctx.rotate((hash(sd + 2) - .5) * .25 * jit);
        ctx.globalAlpha = a; ctx.filter = blur((1 - e) * 14 + exit * 24);
        ctx.fillStyle = col || color; ctx.fillText(w, -wd[i] / 2, -size / 2);
        if (jit > .2) { ctx.globalAlpha = a * .5; ctx.fillText(w, -wd[i] / 2 + 14 * jit, -size / 2 - 6 * jit); }
        ctx.restore();
      }
      cx += wd[i] + sp;
    });
    t0 += ws.length * stagger + gap;
  });
  ctx.restore();
}
// legenda pequena (Helvetica) — palavra por palavra, sem glitch
function caption(ctx, f, text, { x = 960, y = 540, size = 30, color = '#111', start = 0, stagger = 3, exit = 0, weight = 400, fam = S.fonts.caption || 'Helvetica', shadow = false } = {}) {
  ctx.save(); if (shadow) { ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 12; }
  words(ctx, f, [[text, color]], { x, y, size, weight, start, stagger, dur: 14, exit, ls: 0, fam });
  ctx.restore();
}
// PNG recortado / logo flutuando: pop com mola + rotação, órbita contínua, sombra suave
function cutout(ctx, f, img, { x = 960, y = 540, w = 300, start = 0, exit = 0, rot = 0, orbit = 14, seed = 1, shadow = .25, k = 170, c = 15, from = null } = {}) {
  if (!img) return;
  const p = spring(f, start, { k, c }); if (p <= 0.001) return;
  const h = w * img.height / img.width, t = (f - start) / FPS;
  let px = x + Math.sin(t * 1.3 + seed) * orbit, py = y + Math.cos(t * 1.1 + seed * 2) * orbit;
  if (from) { px = lerp(from[0], px, E.out5(clamp((f - start) / 24))); py = lerp(from[1], py, E.out5(clamp((f - start) / 24))); }
  const s = p * (1 + (f - start) * .0007) * (1 + exit * .6);
  ctx.save(); ctx.translate(px, py); ctx.rotate(rot + (1 - p) * .5 + Math.sin(t * .9 + seed) * .03); ctx.scale(s, s);
  ctx.globalAlpha = clamp(p * 2) * (1 - exit); ctx.filter = blur(exit * 30);
  if (shadow) { ctx.shadowColor = `rgba(0,0,0,${shadow})`; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18; }
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  ctx.restore();
}
// card de foto (retângulo com raio, cor de fundo opcional) — base dos cards vermelhos e da colagem
function photoCard(ctx, img, cx, cy, w, h, { r = 18, fill = null, rot = 0, s = 1, shadow = .3, inset = 0, foc = [.5, .5], zoom = 1 } = {}) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(s, s);
  if (shadow) { ctx.save(); ctx.shadowColor = `rgba(0,0,0,${shadow})`; ctx.shadowBlur = 50; ctx.shadowOffsetY = 20; ctx.fillStyle = fill || '#000'; rr(ctx, -w / 2, -h / 2, w, h, r); ctx.fill(); ctx.restore(); }
  rr(ctx, -w / 2, -h / 2, w, h, r); ctx.clip();
  if (fill) { ctx.fillStyle = fill; ctx.fillRect(-w / 2, -h / 2, w, h); }
  cover(ctx, img, -w / 2 + inset, -h / 2 + inset, w - inset * 2, h - inset * 2, { s: zoom, ox: foc[0], oy: foc[1] });
  ctx.restore();
}


// ============================================================
// OBJETOS REAIS (ref dnyx): objeto fotográfico, ancorado e cortado pela borda; o conteúdo troca por corte seco.
// ============================================================
// deslocamento de entrada por uma borda: from 'bottom' | 'top' | 'left' | 'right'
function edgeIn(f, start, from = 'bottom', dist = 1100, k = 80, c = 14) {
  const r = spring(f, start, { k, c }), d = (1 - r) * dist;
  return { r, dx: from === 'left' ? -d : from === 'right' ? d : 0, dy: from === 'top' ? -d : from === 'bottom' ? d : 0 };
}
// iPhone realista. screen(g, w, h, f) desenha a tela (troque o conteúdo por frame = corte seco).
// x,y = centro do aparelho · w = largura · exit 0..1 continua o movimento para exitDir com blur
const PHONE_CV = {};
function phone(ctx, f, { x = W / 2, y = H * .62, w = 680, start = 0, from = 'bottom', dist = 1300, rot = 0, s = 1,
  screen = null, exit = 0, exitDir = 'top', frame = '#2b2c30', shadow = .55, light = true } = {}) {
  const h = w * 2.06, R = w * .165, bz = w * .03, sw = w - bz * 2, sh = h - bz * 2, sr = R - bz;
  const { r, dx, dy } = edgeIn(f, start, from, dist);
  if (r <= 0.001 && f < start) return;
  const drift = prog(f, start, start + 900, E.lin);
  const ex = E.inC(exit), exd = ex * H * .9;
  const ox = dx + (exitDir === 'left' ? -exd : exitDir === 'right' ? exd : 0);
  const oy = dy - drift * 26 + (exitDir === 'top' ? -exd : exitDir === 'bottom' ? exd : 0);
  const key = Math.round(sw) + 'x' + Math.round(sh);
  const cv = PHONE_CV[key] || (PHONE_CV[key] = mk(Math.round(sw), Math.round(sh)));
  const g = cv.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, cv.width, cv.height);
  g.fillStyle = '#000'; g.fillRect(0, 0, cv.width, cv.height);
  if (screen) { g.save(); screen(g, cv.width, cv.height, f); g.restore(); }
  ctx.save();
  ctx.translate(x + ox, y + oy); ctx.rotate(rot + Math.sin(f / 70) * .006 + (1 - r) * .05); ctx.scale(s * (1 + drift * .03), s * (1 + drift * .03));
  ctx.filter = blur(ex * 26);
  if (shadow > 0) {   // sombra longa e macia
    ctx.save(); ctx.filter = blur(60 + ex * 20); ctx.fillStyle = `rgba(0,0,0,${shadow * (light ? .45 : 1)})`;
    rr(ctx, -w / 2 + 30, -h / 2 + 70, w - 20, h, R); ctx.fill(); ctx.restore(); ctx.filter = blur(ex * 26);
  }
  // botões laterais
  ctx.fillStyle = frame;
  rr(ctx, -w / 2 - w * .012, -h * .28, w * .02, h * .07, 4); ctx.fill();
  rr(ctx, -w / 2 - w * .012, -h * .19, w * .02, h * .07, 4); ctx.fill();
  rr(ctx, w / 2 - w * .008, -h * .23, w * .02, h * .11, 4); ctx.fill();
  // moldura de titânio (gradiente metálico)
  const mg = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
  mg.addColorStop(0, '#6d6e73'); mg.addColorStop(.06, frame); mg.addColorStop(.5, '#3a3b40'); mg.addColorStop(.94, frame); mg.addColorStop(1, '#8a8b90');
  rr(ctx, -w / 2, -h / 2, w, h, R); ctx.fillStyle = mg; ctx.fill();
  rr(ctx, -w / 2 + bz * .35, -h / 2 + bz * .35, w - bz * .7, h - bz * .7, R - bz * .35); ctx.fillStyle = '#050505'; ctx.fill();
  // tela
  ctx.save(); rr(ctx, -sw / 2, -sh / 2, sw, sh, sr); ctx.clip();
  ctx.drawImage(cv, -sw / 2, -sh / 2, sw, sh);
  const gl = ctx.createLinearGradient(-sw / 2, -sh / 2, sw / 2, sh / 2);   // reflexo do vidro
  gl.addColorStop(0, 'rgba(255,255,255,.10)'); gl.addColorStop(.38, 'rgba(255,255,255,0)'); gl.addColorStop(1, 'rgba(255,255,255,.03)');
  ctx.fillStyle = gl; ctx.fillRect(-sw / 2, -sh / 2, sw, sh);
  ctx.restore();
  // Dynamic Island
  ctx.fillStyle = '#000'; rr(ctx, -w * .15, -sh / 2 + w * .035, w * .3, w * .085, w * .045); ctx.fill();
  ctx.restore();
}
// barra de status do iOS dentro de screen()
function statusBar(g, w, { color = '#000', time = '9:41' } = {}) {
  const u = w / 390;
  g.save(); g.fillStyle = color; g.font = font(600, 17 * u, 'Inter Tight'); g.textBaseline = 'middle';
  g.fillText(time, 34 * u, 30 * u);
  rr(g, w - 64 * u, 23 * u, 26 * u, 13 * u, 4 * u); g.strokeStyle = color; g.lineWidth = 1.4 * u; g.stroke();
  rr(g, w - 62 * u, 25 * u, 19 * u, 9 * u, 2 * u); g.fill();
  for (let i = 0; i < 4; i++) { rr(g, w - 104 * u + i * 6 * u, (34 - 3 * i) * u, 4 * u, (3 + 3 * i) * u, 1 * u); g.fill(); }
  g.restore();
}
// produto real (PNG recortado): entra por uma borda, gira devagar, sombra de contato e reflexo opcional no chão
function product(ctx, f, img, { x = W / 2, y = H / 2, w = 800, start = 0, from = 'bottom', dist = 1200, rot = 0, spin = .05,
  s = 1, exit = 0, exitDir = 'top', contact = .35, reflect = 0, k = 80, c = 14 } = {}) {
  if (!img) return;
  const { r, dx, dy } = edgeIn(f, start, from, dist, k, c);
  if (r <= 0.001 && f < start) return;
  const drift = prog(f, start, start + 900, E.lin), ex = E.inC(exit), exd = ex * H * .9;
  const h = w * img.height / img.width;
  ctx.save();
  ctx.translate(x + dx + (exitDir === 'left' ? -exd : exitDir === 'right' ? exd : 0), y + dy - drift * 18 + (exitDir === 'top' ? -exd : exitDir === 'bottom' ? exd : 0));
  const sc = s * (1 + drift * .05) * (.9 + .1 * r);
  if (contact > 0) {   // sombra de contato (elipse)
    ctx.save(); ctx.filter = blur(28 + ex * 20); ctx.globalAlpha = contact * r * (1 - ex);
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(0, h * .62 * sc, w * .38 * sc, h * .07 * sc, 0, 0, TAU); ctx.fill(); ctx.restore();
  }
  ctx.rotate(rot + (1 - r) * .12 + Math.sin(f / 80) * spin * .3 - drift * spin);
  ctx.scale(sc, sc); ctx.filter = blur(ex * 26);
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  if (reflect > 0) {
    ctx.save(); ctx.translate(0, h); ctx.scale(1, -1); ctx.globalAlpha = reflect;
    ctx.drawImage(img, -w / 2, -h / 2 - h * .02, w, h); ctx.restore();
  }
  ctx.restore();
}
// peças → fileira → para dentro do objeto. items: [{draw(ctx), sc:[x,y,rot], row:[x,y], to:[x,y,s]?}]
// t: {in, row, go} frames (início de cada fase). Entrada com mola macia, flutuação contínua.
function assemble(ctx, f, items, { t = { in: 0, row: 70, go: 150 }, stagger = 4, rowDur = 50, goDur = 30, size = 1 } = {}) {
  items.forEach((it, i) => {
    const r = spring(f, t.in + i * stagger, { k: 80, c: 14 });
    if (r <= .001) return;
    const pr = prog(f, t.row + i * 2, t.row + i * 2 + rowDur, E.smooth);
    const pg = it.to ? prog(f, t.go + i * 2, t.go + i * 2 + goDur, E.inC) : 0;
    const [sx, sy, sr = 0] = it.sc, [rx, ry] = it.row || it.sc;
    const fl = Math.sin(f / 40 + i * 1.7) * (1 - pr) * 14;
    let x = lerp(sx, rx, pr), y = lerp(sy + (1 - r) * 260, ry, pr) + fl, s = size * r * (1 - pg * .0);
    if (it.to) { x = lerp(x, it.to[0], pg); y = lerp(y, it.to[1], pg); s *= lerp(1, it.to[2] ?? .3, pg); }
    ctx.save(); ctx.globalAlpha = clamp(r * 1.5) * (1 - clamp((pg - .85) / .15)); ctx.filter = blur((1 - r) * 16 + pg * 6);
    ctx.translate(x, y); ctx.rotate(lerp(sr, 0, pr) + Math.sin(f / 55 + i) * .02 * (1 - pr)); ctx.scale(s, s);
    it.draw(ctx, f); ctx.restore();
  });
}
// campo de prompt que digita no meio de uma frase. Retorna a largura (para posicionar as palavras ao redor).
function promptPill(ctx, f, text, { x = W / 2, y = H / 2, w = 380, h = 64, start = 0, cps = .7, dark = false, am = 1 } = {}) {
  const r = spring(f, start, { k: 120, c: 15 });
  const n = Math.floor(clamp((f - start - 10) * cps, 0, text.length));
  ctx.save(); ctx.globalAlpha = am * clamp(r * 1.4); ctx.translate(x, y); ctx.scale(.85 + .15 * r, .85 + .15 * r);
  rr(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = dark ? '#1c1c1e' : '#fff'; ctx.fill();
  ctx.strokeStyle = dark ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.08)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.font = font(500, h * .36); ctx.textBaseline = 'middle'; ctx.fillStyle = dark ? '#ddd' : '#333';
  const s = text.slice(0, n); ctx.fillText(s, -w / 2 + h * .45, 1);
  if ((f >> 4) % 2 === 0) { const cw = ctx.measureText(s).width; ctx.fillRect(-w / 2 + h * .45 + cw + 3, -h * .2, 3, h * .4); }
  rr(ctx, w / 2 - h * .82, -h * .32, h * .64, h * .64, h * .32); ctx.fillStyle = O; ctx.fill();
  ctx.strokeStyle = K; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(w / 2 - h * .5, h * .1); ctx.lineTo(w / 2 - h * .5, -h * .12);
  ctx.moveTo(w / 2 - h * .59, -h * .03); ctx.lineTo(w / 2 - h * .5, -h * .13); ctx.lineTo(w / 2 - h * .41, -h * .03); ctx.stroke();
  ctx.restore();
  return w;
}
// palavra gigante (Anton) cortada pela borda, sobe com mola — "RONY" da IDV
function bigWord(ctx, f, text, { x = W / 2, y = H, size = 460, color = K, start = 0, exit = 0, ls = -4, fam = S.fonts.impact || DISPLAY } = {}) {
  const r = spring(f, start, { k: 70, c: 14 });
  ctx.save(); ctx.font = font(400, size, fam); ctx.letterSpacing = `${ls}px`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.globalAlpha = clamp(r * 2) * (1 - exit); ctx.filter = blur((1 - r) * 20 + exit * 24);
  ctx.fillStyle = color; ctx.fillText(text, x, y + (1 - r) * size * .8 - prog(f, start, start + 900, E.lin) * 20 - E.inC(exit) * 200);
  ctx.restore();
}
