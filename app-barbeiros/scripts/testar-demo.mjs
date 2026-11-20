// Checks the demo build (dist-demo, EXPO_PUBLIC_DEMO=1) with every local
// server blocked: both demo accounts enter, the main screens show data and
// no screen falls into an error state. Prints go to the output dir.
//   EXPO_PUBLIC_DEMO=1 EXPO_OFFLINE=1 npx expo export --platform web --output-dir dist-demo
//   node scripts/testar-demo.mjs [output dir]
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { servir } from './servidor-estatico.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = resolve(import.meta.dirname, '..');
const saida = resolve(process.argv[2] ?? join(root, 'dist-demo-prints'));
mkdirSync(saida, { recursive: true });
const PORTA = 8086;
const BASE = `http://127.0.0.1:${PORTA}`;

const CONTAS = {
  'barbeiro.teste@example.com': ['/', '/agenda', '/relatorios', '/clientes', '/meta', '/extrato', '/insights', '/whatsapp', '/automacoes', '/prospeccao', '/mais', '/cliente/c0000000-0000-4000-8000-000000000002'],
  'dono.teste@example.com': ['/', '/barbearia', '/barbearia/equipe', '/barbearia/agenda'],
};

const server = await servir(join(root, 'dist-demo'), PORTA);
const browser = await chromium.launch();
let falhas = 0;
try {
  for (const [email, rotas] of Object.entries(CONTAS)) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    const bloqueadas = [];
    await ctx.route(/127\.0\.0\.1:(54321|54329)/, (r) => { bloqueadas.push(r.request().url()); return r.abort(); });
    const page = await ctx.newPage();
    const erros = [];
    page.on('pageerror', (e) => erros.push(e.message));
    await page.goto(`${BASE}/`);
    await page.getByTestId(`demo-${email}`).click({ timeout: 30_000 });
    await page.getByTestId('hoje-valor').waitFor({ timeout: 20_000 });
    const nome = email.split('.')[0];
    for (const rota of rotas) {
      await page.goto(`${BASE}${rota}`);
      await page.waitForTimeout(1800);
      for (let i = 0; i < 3 && (await page.getByTestId('comemorar').isVisible().catch(() => false)); i++) {
        await page.getByTestId('comemorar').click();
        await page.waitForTimeout(600);
      }
      const erro = await page.getByText('Não deu para carregar').isVisible().catch(() => false);
      if (erro) { falhas++; console.log(`✕ ${email} ${rota}: estado de erro`); } else console.log(`ok ${email} ${rota}`);
      await page.screenshot({ path: join(saida, `${nome}${rota.replace(/\//g, '_') || '_'}.png`) });
    }
    if (email.startsWith('barbeiro')) {
      // "Fale com a IA" in the demo answers the examples from the recording.
      await page.goto(`${BASE}/ia/voz`);
      await page.getByTestId('orbe-ia').waitFor({ timeout: 20_000 });
      if (!(await page.getByTestId('voz-texto').isVisible().catch(() => false))) await page.getByTestId('voz-teclado').click();
      await page.getByTestId('voz-texto').fill('Marca o Bruno amanhã às 10 pra corte');
      await page.getByTestId('voz-enviar').click();
      const ok = await page.getByTestId('voz-pendente').waitFor({ timeout: 15_000 }).then(() => true).catch(() => false);
      if (ok) console.log('ok barbeiro /ia/voz (exemplo gravado)'); else { falhas++; console.log('✕ /ia/voz: exemplo sem resposta gravada'); }
      await page.screenshot({ path: join(saida, `${nome}_ia_voz.png`) });
    }
    if (bloqueadas.length) { falhas++; console.log(`✕ tentou falar com o servidor local: ${bloqueadas.slice(0, 3).join(', ')}`); }
    if (erros.length) { falhas++; console.log(`✕ erros na página: ${erros.slice(0, 3).join(' | ')}`); }
    await ctx.close();
  }
} finally {
  await browser.close();
  server.close();
}
console.log(falhas ? `Demonstração: ${falhas} problema(s) · ${saida}` : `Demonstração OK · prints em ${saida}`);
process.exit(falhas ? 1 : 0);
