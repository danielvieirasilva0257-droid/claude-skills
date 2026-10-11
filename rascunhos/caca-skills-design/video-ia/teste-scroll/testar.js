// Testa o scrub no Chromium headless: 3 posições + modo "reduzir movimento".
// Uso: node testar.js   (Playwright em /opt/node-tools)
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const path = require('path');
const URL = 'file://' + path.join(__dirname, 'index.html');
const SHOTS = path.join(__dirname, 'shots');

const rects = () => {
  const r = id => { const e = document.getElementById(id); const b = e.getBoundingClientRect();
    return { x: b.x, y: b.y, w: b.width, h: b.height, op: +getComputedStyle(e).opacity }; };
  return { A: r('tA'), B: r('tB'), s: window.__scroll };
};
const inter = (a, b) => !(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y);

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).catch(() => chromium.launch());
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const longTasks = [];
  await page.goto(URL);
  await page.waitForFunction(() => window.__scroll && window.__scroll.loaded === 60, null, { timeout: 15000 });
  const geo = await page.evaluate(() => { const s = document.getElementById('cine'); return { top: s.offsetTop, len: s.offsetHeight - innerHeight }; });
  const out = [];
  for (const [nome, p] of [['1-texto-A', 0.28], ['2-entre-textos', 0.62], ['2b-B-saindo-de-tras', 0.83], ['3-texto-B', 0.97]]) {
    await page.evaluate(y => window.scrollTo(0, y), Math.round(geo.top + p * geo.len));
    await page.waitForFunction(p => window.__scroll.settled && Math.abs(window.__scroll.p - p) < 0.002, p, { timeout: 5000 });
    await page.waitForTimeout(100);
    const r = await page.evaluate(rects);
    const vis = ['A', 'B'].filter(k => r[k].op > 0.01 && r[k].x < 1280 && r[k].x + r[k].w > 0);
    out.push({ nome, p, frame: r.s.frame, esperado: Math.round(p * 59) + 1, visiveis: vis.join('+') || 'nenhum',
      sobreposicao: vis.length === 2 && inter(r.A, r.B) ? 'SIM (falha)' : 'não' });
    await page.screenshot({ path: path.join(SHOTS, `${nome}.png`) });
  }
  // Rolagem contínua: mede quadros por segundo do navegador durante o scrub.
  await page.evaluate(() => window.scrollTo(0, 0));
  const fps = await page.evaluate(async ({ top, len }) => {
    let n = 0, t0 = performance.now(); const y0 = top, y1 = top + len;
    return await new Promise(res => { const step = now => { n++; const k = (now - t0) / 1500;
      window.scrollTo(0, y0 + (y1 - y0) * Math.min(1, k)); if (k < 1) requestAnimationFrame(step); else res(n / 1.5); };
      requestAnimationFrame(step); });
  }, geo);
  await page.close();
  // Reduzir movimento.
  const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' });
  const p2 = await ctx2.newPage(); await p2.goto(URL);
  await p2.evaluate(() => document.getElementById('cine').scrollIntoView());
  await p2.waitForTimeout(300);
  const rm = await p2.evaluate(() => ({ rm: document.getElementById('cine').classList.contains('rm'),
    altura: document.getElementById('cine').offsetHeight }));
  await p2.screenshot({ path: path.join(SHOTS, '4-reduzir-movimento.png') });
  await browser.close();
  console.log(JSON.stringify({ resultados: out, fps_rAF_scrub: Math.round(fps), reduzirMovimento: rm }, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
