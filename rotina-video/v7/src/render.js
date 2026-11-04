// Render CLI contract (motion-video-director): node src/render.js --from <s> --to <s> --fps <n> --scale <0-1> --out <dir> [--jpg] [--workers n]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const a = process.argv.slice(2); const opt = (k, d) => { const i = a.indexOf('--' + k); return i >= 0 ? a[i + 1] : d; };
const from = +opt('from', 0), to = +opt('to', 49.6), fps = +opt('fps', 30), scale = +opt('scale', 1), out = opt('out', 'cache/frames'), workers = +opt('workers', 1);
const q = +opt('quality', 92); const port = opt('port', '8770');
fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--disable-web-security', '--font-render-hinting=none'] });
  const n = Math.floor((to - from) * fps + 1e-6); const idx = [...Array(n).keys()];
  const run = async (w) => {
    const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: scale });
    p.on('pageerror', e => console.log('PAGEERR', e.message));
    await p.goto(`http://localhost:${port}/src/${opt('page', 'comp')}.html`, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    for (let k = w; k < n; k += workers) {
      const t = from + k / fps; await p.evaluate(t => window.renderFrame(t), t);
      await p.screenshot({ path: path.join(out, String(k).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: q });
    }
  };
  const t0 = Date.now(); await Promise.all([...Array(workers).keys()].map(run));
  console.log(`rendered ${n} frames in ${((Date.now() - t0) / 1000).toFixed(1)} s`); await b.close();
})();
