// Testa uma página de scroll cinematográfico no Chromium headless (Playwright).
// Uso: node testar-scroll.js <pagina.html | URL> [pasta-screenshots] [posições, ex.: 0.28,0.62,0.83,0.97]
//
// Contrato da página (o assets/scroll-sequencia.html já cumpre):
//   - seção .cine com data-frames="N"; textos com a classe .txt; pôster <img class="poster">;
//   - window.__scroll = {p, frame, loaded, settled} atualizado a cada quadro;
//   - classe .rm na seção quando "reduzir movimento" está ligado.
// Confere: quadro desenhado = esperado em cada posição; nenhum par de textos visíveis se cruza (regra 1);
// "reduzir movimento" vira versão parada de 1 tela com pôster; sem JS mostra o pôster. Sai com código 1 se falhar.
const path = require('path');
const fs = require('fs');
const req = m => { try { return require(m); } catch { return require(path.join('/opt/node-tools/node_modules', m)); } };
const { chromium } = req('playwright');

const alvo = process.argv[2];
if (!alvo) { console.error('uso: node testar-scroll.js <pagina.html|URL> [pasta-shots] [posições]'); process.exit(2); }
const URL = /^https?:|^file:/.test(alvo) ? alvo : 'file://' + path.resolve(alvo);
const SHOTS = path.resolve(process.argv[3] || 'shots'); fs.mkdirSync(SHOTS, { recursive: true });
const POS = (process.argv[4] || '0.28,0.62,0.83,0.97').split(',').map(Number);
const VW = 1280, VH = 720;

const lancar = async () => {
  if (process.env.CHROMIUM_PATH) return chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
  try { return await chromium.launch(); }
  catch { return chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); } // container
};
const inter = (a, b) => !(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y);

(async () => {
  const browser = await lancar();
  const falhas = [];
  const page = await browser.newPage({ viewport: { width: VW, height: VH } });
  await page.goto(URL);
  const N = await page.evaluate(() => +document.querySelector('.cine').dataset.frames);
  await page.waitForFunction(n => window.__scroll && window.__scroll.loaded === n, N, { timeout: 30000 });
  const geo = await page.evaluate(() => { const s = document.querySelector('.cine'); return { top: s.offsetTop, len: s.offsetHeight - innerHeight }; });
  const out = [];
  for (const p of POS) {
    await page.evaluate(y => window.scrollTo(0, y), Math.round(geo.top + p * geo.len));
    // Com inércia, o estado logo depois do scrollTo é o antigo: espere o progresso chegar ao alvo.
    await page.waitForFunction(p => window.__scroll.settled && Math.abs(window.__scroll.p - p) < 0.002, p, { timeout: 5000 });
    await page.waitForTimeout(100);
    const r = await page.evaluate(() => ({ s: window.__scroll, t: [...document.querySelectorAll('.txt')].map(e => {
      const b = e.getBoundingClientRect(); return { id: e.id, x: b.x, y: b.y, w: b.width, h: b.height, op: +getComputedStyle(e).opacity }; }) }));
    const vis = r.t.filter(t => t.op > 0.01 && t.x < VW && t.x + t.w > 0 && t.y < VH && t.y + t.h > 0);
    let sobre = false;
    for (let i = 0; i < vis.length; i++) for (let j = i + 1; j < vis.length; j++) if (inter(vis[i], vis[j])) sobre = true;
    const esperado = Math.round(p * (N - 1)) + 1;
    out.push({ p, quadro: r.s.frame, esperado, visiveis: vis.map(t => t.id).join('+') || 'nenhum', sobreposicao: sobre ? 'SIM' : 'não' });
    if (r.s.frame !== esperado) falhas.push(`p=${p}: quadro ${r.s.frame}, esperado ${esperado}`);
    if (sobre) falhas.push(`p=${p}: texto sobre texto`);
    await page.screenshot({ path: path.join(SHOTS, `pos-${p}.png`) });
  }
  // Rolagem contínua de 1,5 s: rAF/s no headless (renderização por software; não vale como medida de celular).
  await page.evaluate(() => window.scrollTo(0, 0));
  const fps = await page.evaluate(async ({ top, len }) => {
    let n = 0; const t0 = performance.now();
    return await new Promise(res => { const step = now => { n++; const k = (now - t0) / 1500;
      window.scrollTo(0, top + len * Math.min(1, k)); if (k < 1) requestAnimationFrame(step); else res(n / 1.5); };
      requestAnimationFrame(step); });
  }, geo);
  await page.close();
  // Reduzir movimento: versão parada, sem pin, com pôster.
  const c2 = await browser.newContext({ viewport: { width: VW, height: VH }, reducedMotion: 'reduce' });
  const p2 = await c2.newPage(); await p2.goto(URL);
  await p2.evaluate(() => document.querySelector('.cine').scrollIntoView()); await p2.waitForTimeout(300);
  const rm = await p2.evaluate(() => { const s = document.querySelector('.cine'), po = s.querySelector('.poster');
    return { rm: s.classList.contains('rm'), altura: s.offsetHeight, poster: !!po && po.getBoundingClientRect().width > 0 }; });
  if (!rm.rm || !rm.poster || rm.altura > 1.5 * VH) falhas.push('reduzir movimento: ' + JSON.stringify(rm));
  await p2.screenshot({ path: path.join(SHOTS, 'reduzir-movimento.png') }); await c2.close();
  // Sem JS: o pôster aparece e o canvas some.
  const c3 = await browser.newContext({ viewport: { width: VW, height: VH }, javaScriptEnabled: false });
  const p3 = await c3.newPage(); await p3.goto(URL);
  const semJs = await p3.locator('.cine .poster').isVisible();
  if (!semJs) falhas.push('sem JS: pôster invisível');
  await p3.locator('.cine').scrollIntoViewIfNeeded(); await p3.screenshot({ path: path.join(SHOTS, 'sem-js.png') });
  await browser.close();
  console.log(JSON.stringify({ quadros: N, resultados: out, fps_rAF_scrub: Math.round(fps), reduzirMovimento: rm, posterSemJs: semJs, falhas }, null, 1));
  process.exit(falhas.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
