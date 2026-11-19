// Smoke test (Phase 0): the app opens, signs in with the seed's test account
// and shows this month's row of v_metricas_mes.
//
// Needs: local Supabase running with the seed (`npm run db:reset`),
// `.env` pointing to it, and a fresh web build (`npm run web:export`).
// Usage: node scripts/smoke-web.mjs [screenshot-dir]
import { createClient } from '@supabase/supabase-js';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';

import { servir } from './servidor-estatico.mjs';

const require = createRequire(import.meta.url);
const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const shots = resolve(process.argv[2] ?? join(root, 'dist', 'smoke'));
const PORT = Number(process.env.SMOKE_PORT ?? 8081);
const EMAIL = process.env.SMOKE_EMAIL ?? 'barbeiro.teste@example.com';
const SENHA = process.env.SMOKE_SENHA ?? 'senha-teste-123';

function lerEnv() {
  const env = {};
  for (const linha of readFileSync(join(root, '.env'), 'utf8').split('\n')) {
    const m = linha.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}

async function esperado(env) {
  // Same question the app asks, asked directly: the database is the source of truth.
  const sb = createClient(env.EXPO_PUBLIC_SUPABASE_URL, env.EXPO_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
  const { error: erroLogin } = await sb.auth.signInWithPassword({ email: EMAIL, password: SENHA });
  if (erroLogin) throw new Error(`login de teste falhou na API: ${erroLogin.message}`);
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit' })
    .formatToParts(new Date());
  const mes = `${parts.find((p) => p.type === 'year').value}-${parts.find((p) => p.type === 'month').value}-01`;
  const { data, error } = await sb.from('v_metricas_mes').select('faturamento, atendimentos').eq('mes', mes).maybeSingle();
  if (error) throw new Error(`v_metricas_mes falhou: ${error.message}`);
  if (!data) throw new Error(`v_metricas_mes sem linha para ${mes}: rode npm run db:reset`);
  const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(data.faturamento));
  return { mes, moeda, atendimentos: String(data.atendimentos) };
}

const normalizar = (t) => t.replace(/\s+/g, ' ').trim();

async function main() {
  if (!existsSync(join(dist, 'index.html'))) throw new Error('dist/ não existe: rode npm run web:export');
  mkdirSync(shots, { recursive: true });
  const env = lerEnv();
  const alvo = await esperado(env);
  console.log(`banco: ${alvo.mes} faturamento ${alvo.moeda}, ${alvo.atendimentos} atendimentos`);

  const server = await servir(dist, PORT);
  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  const erros = [];
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    page.on('pageerror', (e) => erros.push(`pageerror: ${e.message}`));
    page.on('console', (m) => { if (m.type() === 'error') erros.push(`console: ${m.text()}`); });

    await page.goto(`http://127.0.0.1:${PORT}/`);
    await page.getByTestId('entrar-email').waitFor({ timeout: 30_000 });
    console.log('ok: o app abriu na tela Entrar');
    await page.screenshot({ path: join(shots, '1-entrar.png') });

    // Wrong password shows a readable error (and the browser logs the expected 400).
    await page.getByTestId('entrar-email').fill(EMAIL);
    await page.getByTestId('entrar-senha').fill('senha-errada');
    await page.getByTestId('entrar-botao').click();
    await page.getByTestId('entrar-erro').waitFor({ timeout: 15_000 });
    const msgErro = normalizar(await page.getByTestId('entrar-erro').innerText());
    if (!msgErro.includes('E-mail ou senha não conferem')) throw new Error(`erro inesperado: ${msgErro}`);
    console.log(`ok: senha errada mostra "${msgErro}"`);
    erros.length = 0;

    await page.getByTestId('entrar-senha').fill(SENHA);
    await page.getByTestId('entrar-botao').click();
    await page.getByTestId('metricas-faturamento').waitFor({ timeout: 30_000 });
    const tela = normalizar(await page.getByTestId('metricas-faturamento').innerText());
    const atend = normalizar(await page.getByTestId('metricas-atendimentos').innerText());
    await page.screenshot({ path: join(shots, '2-inicio.png') });
    if (tela !== normalizar(alvo.moeda)) throw new Error(`faturamento na tela "${tela}" ≠ banco "${alvo.moeda}"`);
    if (atend !== alvo.atendimentos) throw new Error(`atendimentos na tela "${atend}" ≠ banco "${alvo.atendimentos}"`);
    console.log(`ok: login de teste e Início mostra ${tela} e ${atend} atendimentos (igual ao banco)`);

    for (const aba of ['Agenda', 'Relatórios', 'Clientes', 'Mais']) {
      await page.getByRole('tab', { name: aba }).click();
      await page.getByRole('heading', { name: aba }).waitFor({ timeout: 10_000 });
    }
    console.log('ok: as 5 abas abrem');
    await page.screenshot({ path: join(shots, '3-mais.png') });

    await page.getByTestId('mais-sair').click();
    await page.getByTestId('entrar-email').waitFor({ timeout: 15_000 });
    console.log('ok: sair volta para Entrar');

    if (erros.length) throw new Error(`erros no navegador:\n${erros.join('\n')}`);
    console.log(`SMOKE OK · prints em ${shots}`);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((e) => {
  console.error(`SMOKE FALHOU: ${e.message}`);
  process.exit(1);
});
