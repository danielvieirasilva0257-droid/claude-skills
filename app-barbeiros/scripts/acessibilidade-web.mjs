// Accessibility check (axe-core, WCAG 2.2 A/AA) on the main screens of the
// web build, signed in as the seed barbers. Usage (after web:export, with the
// local Supabase and functions running):
//   node scripts/acessibilidade-web.mjs [output dir]
// Prints one line per rule broken and writes the full report as JSON.
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { servir } from './servidor-estatico.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const axe = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const root = resolve(import.meta.dirname, '..');
const saida = resolve(process.argv[2] ?? join(root, 'dist', 'a11y'));
mkdirSync(saida, { recursive: true });
const PORTA = 8084;
const BASE = `http://127.0.0.1:${PORTA}`;

const TELAS = {
  'barbeiro.teste@example.com': ['/', '/agenda', '/relatorios', '/clientes', '/mais', '/meta', '/extrato', '/insights', '/ia/chat', '/whatsapp', '/automacoes', '/planos', '/legal/termos', '/ia/voz', '/cliente/c0000000-0000-4000-8000-000000000002'],
  'dono.teste@example.com': ['/barbearia', '/barbearia/equipe', '/barbearia/agenda'],
};

async function entrar(page, email) {
  await page.goto(`${BASE}/`);
  await page.getByTestId('entrar-email').waitFor({ timeout: 30_000 });
  await page.getByTestId('entrar-email').fill(email);
  await page.getByTestId('entrar-senha').fill('senha-teste-123');
  await page.getByTestId('entrar-botao').click();
  await page.getByTestId('hoje-valor').waitFor({ timeout: 20_000 });
}

const server = await servir(join(root, 'dist'), PORTA);
const browser = await chromium.launch();
const relatorio = {};
let problemas = 0;
try {
  for (const [email, rotas] of Object.entries(TELAS)) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await entrar(page, email);
    for (const rota of rotas) {
      await page.goto(`${BASE}${rota}`);
      await page.waitForLoadState('networkidle').catch(() => undefined);
      await page.waitForTimeout(1200);
      // Pending celebrations are a modal on top; close them so the screen itself is checked.
      for (let i = 0; i < 3 && (await page.getByTestId('comemorar').isVisible().catch(() => false)); i++) {
        await page.getByTestId('comemorar').click();
        await page.waitForTimeout(500);
      }
      await page.addScriptTag({ content: axe });
      const r = await page.evaluate(async () => {
        // eslint-disable-next-line no-undef
        const res = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } });
        return res.violations.map((v) => ({ id: v.id, impacto: v.impact, ajuda: v.help, n: v.nodes.length,
          exemplos: v.nodes.slice(0, 3).map((n) => n.target.join(' ')) }));
      });
      relatorio[rota] = r;
      problemas += r.length;
      console.log(`${r.length ? '✕' : 'ok'} ${rota}${r.length ? ' · ' + r.map((v) => `${v.id} (${v.impacto}, ${v.n})`).join(', ') : ''}`);
    }
    await ctx.close();
  }
} finally {
  await browser.close();
  server.close();
}
writeFileSync(join(saida, 'axe.json'), JSON.stringify(relatorio, null, 2));
console.log(problemas ? `Acessibilidade: ${problemas} regra(s) com problema · ${join(saida, 'axe.json')}` : 'Acessibilidade OK');
process.exit(problemas ? 1 : 0);
