// Prints of the component gallery and frame-exact frames of ConquistaButton
// (Playwright fake clock). Needs a web build with EXPO_PUBLIC_GALERIA=1.
// Usage: node scripts/galeria-prints.mjs <output-dir>
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';

import { servir } from './servidor-estatico.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = resolve(import.meta.dirname, '..');
const saida = resolve(process.argv[2] ?? join(root, 'dist', 'galeria'));
const PORTA = 8082;
mkdirSync(saida, { recursive: true });

const server = await servir(join(root, 'dist'), PORTA);
const browser = await chromium.launch();
const erros = [];
try {
  // 1) Whole gallery, tall viewport (the ScrollView lives inside the page).
  const ctx = await browser.newContext({ viewport: { width: 390, height: 3900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => erros.push(e.message));
  await page.goto(`http://127.0.0.1:${PORTA}/dev/componentes`);
  await page.getByTestId('conquista').waitFor();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: join(saida, 'galeria.png') });

  // StatusButton: before spinner, spinner, success, error.
  await page.getByTestId('status-ok').click();
  await page.waitForTimeout(80);
  const statusBox = await page.getByTestId('status-ok').boundingBox();
  const recorte = (b, extra = 8) => ({ x: 0, y: Math.max(0, b.y - extra), width: 390, height: b.height + extra * 2 });
  await page.screenshot({ path: join(saida, 'status-1-enviando.png'), clip: recorte(statusBox) });
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(saida, 'status-2-carregando.png'), clip: recorte(statusBox) });
  await page.waitForTimeout(700);
  await page.screenshot({ path: join(saida, 'status-3-salvo.png'), clip: recorte(statusBox) });
  await page.getByTestId('status-erro').click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: join(saida, 'status-4-erro.png'), clip: recorte(await page.getByTestId('status-erro').boundingBox()) });

  // HoldToConfirm: half way, then confirmed.
  const segurar = await page.getByTestId('segurar').boundingBox();
  await page.mouse.move(segurar.x + segurar.width / 2, segurar.y + segurar.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: join(saida, 'segurar-1-metade.png'), clip: recorte(segurar, 30) });
  await page.waitForTimeout(1300);
  await page.mouse.up();
  const resultado = await page.getByTestId('segurar-resultado').innerText();
  if (!resultado.includes('Apagado')) throw new Error(`HoldToConfirm não confirmou: ${resultado}`);

  // Mascot celebrating, bottom sheet open.
  await page.getByTestId('mascote-btn-comemorando').click();
  await page.waitForTimeout(1200);
  await page.getByTestId('abrir-gaveta').click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: join(saida, 'gaveta.png'), clip: { x: 0, y: 0, width: 390, height: 844 } });
  await ctx.close();

  // 2) ConquistaButton frames with a paused clock.
  for (const [nome, reduzir] of [['conquista', 'no-preference'], ['conquista-reduzido', 'reduce']]) {
    const c = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: reduzir });
    const p = await c.newPage();
    p.on('pageerror', (e) => erros.push(e.message));
    await p.clock.install({ time: new Date('2026-11-19T12:00:00-03:00') });
    await p.goto(`http://127.0.0.1:${PORTA}/dev/componentes`);
    const botao = p.getByTestId('conquista');
    await botao.waitFor();
    await p.waitForTimeout(800);
    await p.clock.pauseAt(new Date('2026-11-19T12:10:00-03:00'));
    const b = await botao.boundingBox();
    const clip = { x: 0, y: b.y - 120, width: 390, height: b.height + 150 };
    const tempos = reduzir === 'reduce' ? [0, 75, 150, 900] : [0, 30, 60, 180, 300, 420, 540, 630, 720, 900, 1210];
    await p.screenshot({ path: join(saida, `${nome}-0000ms.png`), clip });
    await botao.click();
    let agora = 0;
    for (const t of tempos.slice(1)) {
      await p.clock.runFor(t - agora);
      agora = t;
      await p.screenshot({ path: join(saida, `${nome}-${String(t).padStart(4, '0')}ms.png`), clip });
    }
    await c.close();
  }
  if (erros.length) throw new Error(`erros na página:\n${erros.join('\n')}`);
  console.log(`ok: prints em ${saida}`);
} finally {
  await browser.close();
  server.close();
}
