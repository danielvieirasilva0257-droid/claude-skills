// Renders assets/marca/*.svg to the PNG files the app uses (icon, Android
// adaptive icon, splash, favicon) and a preview sheet. Run after gerar_marca.py.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = resolve(import.meta.dirname, '..');
const marca = (f) => readFileSync(join(root, 'assets', 'marca', f), 'utf8');
const saidaPrevia = process.argv[2] ?? join(root, 'dist', 'marca-previa.png');

const ARQUIVOS = [
  ['icone.svg', 'assets/images/icon.png', 1024, false],
  ['android-frente.svg', 'assets/images/android-icon-foreground.png', 512, true],
  ['android-mono.svg', 'assets/images/android-icon-monochrome.png', 432, true],
  ['splash.svg', 'assets/images/splash-icon.png', 1024, true],
  ['icone.svg', 'assets/images/favicon.png', 48, false],
  ['logo-horizontal-fundo.svg', 'assets/marca/logo-horizontal.png', 1600, false],
  ['marca.svg', 'assets/marca/marca.png', 1024, true],
];

const browser = await chromium.launch();
const page = await browser.newPage();
for (const [svg, png, lado, transparente] of ARQUIVOS) {
  const conteudo = marca(svg);
  const [, w, h] = conteudo.match(/width="(\d+)" height="(\d+)"/);
  const escala = lado / Number(w);
  await page.setViewportSize({ width: Math.round(Number(w) * escala), height: Math.round(Number(h) * escala) });
  await page.setContent(`<html><body style="margin:0;background:transparent">${conteudo.replace(/width="\d+" height="\d+"/, `width="${Math.round(Number(w) * escala)}" height="${Math.round(Number(h) * escala)}"`)}</body></html>`);
  await page.screenshot({ path: join(root, png), omitBackground: transparente });
}
// Android adaptive background: solid bg colour.
await page.setViewportSize({ width: 512, height: 512 });
await page.setContent('<html><body style="margin:0;background:#050506"></body></html>');
await page.screenshot({ path: join(root, 'assets/images/android-icon-background.png') });

// Preview sheet: icon (rounded), adaptive circle, small sizes, horizontal logo.
const b64 = (f) => `data:image/svg+xml;base64,${Buffer.from(marca(f)).toString('base64')}`;
await page.setViewportSize({ width: 1500, height: 900 });
await page.setContent(`<html><body style="margin:0;background:#1c1c1f;font-family:sans-serif;color:#ddd">
<div style="display:flex;gap:56px;padding:56px;align-items:flex-end">
  <figure style="margin:0;text-align:center"><img src="${b64('icone.svg')}" width="300" style="border-radius:68px"><figcaption>Ícone (iPhone)</figcaption></figure>
  <figure style="margin:0;text-align:center"><div style="width:300px;height:300px;border-radius:50%;background:#050506;overflow:hidden;display:flex;align-items:center;justify-content:center"><img src="${b64('android-frente.svg')}" width="440"></div><figcaption>Ícone adaptável (Android)</figcaption></figure>
  <figure style="margin:0;text-align:center"><img src="${b64('icone.svg')}" width="96" style="border-radius:22px"><img src="${b64('icone.svg')}" width="60" style="border-radius:14px;margin-left:20px"><figcaption>Tamanhos pequenos</figcaption></figure>
</div>
<div style="padding:0 56px"><img src="${b64('logo-horizontal-fundo.svg')}" height="200" style="border-radius:24px"></div>
</body></html>`);
await page.screenshot({ path: saidaPrevia });
await browser.close();
console.log('ok', saidaPrevia);
