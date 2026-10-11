// Mede tempo de carregar+decodificar 60 quadros (WebP vs AVIF) no Chromium headless.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [nome, pat] of [['webp', 'frames/f_{i}.webp'], ['avif', 'medidas/avif/f_{i}.avif']]) {
    const p = await b.newPage(); await p.goto('file://' + path.join(__dirname, 'index.html'));
    const ms = await p.evaluate(async pat => { const t0 = performance.now();
      for (let i = 1; i <= 60; i++) { const im = new Image(); im.src = pat.replace('{i}', String(i).padStart(4, '0')); await im.decode(); }
      return performance.now() - t0; }, pat);
    console.log(nome, (ms / 60).toFixed(2), 'ms/quadro (carregar+decodificar, sequencial)'); await p.close();
  }
  await b.close();
})();
