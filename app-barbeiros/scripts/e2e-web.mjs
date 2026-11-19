// End-to-end flows in the browser (web build of the app + local Supabase).
// Run on a fresh database: npm run db:reset && npm run web:export && npm run e2e
// Usage: node scripts/e2e-web.mjs [prints-dir] [flow-name ...]
import { mkdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';

import { servir } from './servidor-estatico.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = resolve(import.meta.dirname, '..');
const saida = resolve(process.argv[2] ?? join(root, 'dist', 'e2e'));
const so = process.argv.slice(3);
const PORTA = 8083;
const BASE = `http://127.0.0.1:${PORTA}`;
const SENHA = 'senha-teste-123';
mkdirSync(saida, { recursive: true });

const env = Object.fromEntries(readFileSync(join(root, '.env'), 'utf8').split('\n')
  .map((l) => l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)).filter(Boolean).map((m) => [m[1], m[2]]));
export const normalizar = (t) => t.replace(/\s+/g, ' ').trim();

async function entrar(page, email) {
  await page.goto(`${BASE}/`);
  await page.getByTestId('entrar-email').waitFor({ timeout: 30_000 });
  await page.getByTestId('entrar-email').fill(email);
  await page.getByTestId('entrar-senha').fill(SENHA);
  await page.getByTestId('entrar-botao').click();
}

async function print(page, nome) {
  await page.waitForTimeout(350);
  await page.screenshot({ path: join(saida, `${nome}.png`) });
}

async function aba(page, nome) {
  await page.getByRole('tab', { name: nome }).click();
}

function esperar(condicao, msg) {
  if (!condicao) throw new Error(msg);
}

export const fluxos = {
  // Fase 2: primeiro uso no Grátis.
  async onboarding_e_bloqueios(page) {
    await entrar(page, 'gratis.teste@example.com');
    await page.getByTestId('onb-preco').waitFor({ timeout: 20_000 });
    await print(page, 'f2-01-onboarding-preco');
    await page.getByTestId('onb-preco').fill('50');
    await page.getByTestId('onb-continuar').click();
    await page.getByTestId('onb-publico-C').waitFor();
    await print(page, 'f2-02-onboarding-publico');
    await page.getByTestId('onb-continuar').click();
    await page.getByTestId('onb-modelo-aluguel_cadeira').click();
    await page.getByTestId('onb-continuar').click();
    await page.getByTestId('onb-estrategia-volume').click();
    await page.getByTestId('onb-continuar').click();
    await page.getByTestId('hoje-valor').waitFor({ timeout: 20_000 });
    await print(page, 'f2-03-inicio-novo');
    await aba(page, 'Clientes');
    await page.getByTestId('tela-bloqueada').waitFor();
    await print(page, 'f2-04-clientes-bloqueado');
    await aba(page, 'Mais');
    await page.getByTestId('mais-exportar').click();
    await page.getByText('Serviços', { exact: true }).last().click();
    const download = page.waitForEvent('download');
    await page.getByTestId('exportar-botao').click();
    const arquivo = await download;
    esperar(arquivo.suggestedFilename().startsWith('app-barbeiros-servicos-'), 'nome do CSV');
    await page.getByTestId('exportar-aviso').waitFor();
    esperar((await page.getByTestId('exportar-aviso').innerText()).includes('7 linha'), 'onboarding deveria criar 7 serviços');
    await print(page, 'f2-05-exportar');
    await page.keyboard.press('Escape'); // closes the sheet (Android back / Esc)
    await page.getByTestId('exportar-sheet').waitFor({ state: 'detached' });
    await page.getByTestId('mais-cancelar').click();
    await page.getByText('Você está no plano Grátis').waitFor();
    await print(page, 'f2-06-cancelar-gratis');
  },

  // Fase 2: lançar em 2 toques, "Ofereceu algo?", fechar o caixa.
  async lancar_e_fechar_caixa(page) {
    await entrar(page, 'barbeiro.teste@example.com');
    await page.getByTestId('hoje-valor').waitFor({ timeout: 20_000 });
    await print(page, 'f2-10-inicio');
    await page.getByTestId('inicio-atendimento').click();
    await page.getByTestId('atalho-Corte').waitFor();
    await print(page, 'f2-11-lancar');
    await page.getByTestId('atalho-Corte').click();
    await page.getByTestId('lancado-ok').waitFor();
    await page.getByTestId('aceitou-Hidratação').click();
    await page.getByTestId('oferta-Hidratação').getByText('✓ Aceitou').waitFor();
    await print(page, 'f2-12-ofereceu-algo');
    await page.getByTestId('oferta-pronto').click();
    await page.waitForTimeout(600);
    const valor = normalizar(await page.getByTestId('hoje-valor').innerText());
    esperar(valor === 'R$ 70,00', `Início deveria mostrar R$ 70,00 (corte + hidratação), mostrou ${valor}`);
    await print(page, 'f2-13-inicio-depois');
    await aba(page, 'Agenda');
    await page.getByTestId('agenda-item').first().waitFor();
    await print(page, 'f2-14-agenda');
    await page.getByTestId('fechar-caixa').click();
    await page.getByTestId('caixa-fechado').waitFor({ timeout: 10_000 });
    await print(page, 'f2-15-caixa-fechado');
  },
};

async function main() {
  const server = await servir(join(root, 'dist'), PORTA);
  const browser = await chromium.launch();
  let falhas = 0;
  try {
    for (const [nome, fluxo] of Object.entries(fluxos)) {
      if (so.length && !so.includes(nome)) continue;
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, acceptDownloads: true });
      const page = await ctx.newPage();
      const erros = [];
      page.on('pageerror', (e) => erros.push(e.message));
      try {
        await fluxo(page);
        if (erros.length) throw new Error(`erros na página: ${erros.join(' | ')}`);
        console.log(`ok   ${nome}`);
      } catch (e) {
        falhas++;
        console.log(`FALHOU ${nome}: ${e.message.split('\n')[0]}`);
        await page.screenshot({ path: join(saida, `falha-${nome}.png`) }).catch(() => undefined);
      }
      await ctx.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
  console.log(falhas ? `E2E: ${falhas} fluxo(s) falharam · prints em ${saida}` : `E2E OK · prints em ${saida}`);
  process.exit(falhas ? 1 : 0);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
void env;
