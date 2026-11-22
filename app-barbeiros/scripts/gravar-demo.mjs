// Records the demo mode: opens every screen of the web build with the test
// accounts (local Supabase + local functions, fresh seed) and saves each
// server reply to src/features/demo/gravacao.json, keyed like fetchDemo does.
//   npm run db:reset && npm run funcoes:dev (other terminal) && npm run web:export
//   node --experimental-strip-types scripts/gravar-demo.mjs
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { chaveDaRequisicao, chaveDaFerramenta, hojeBrasilia, somarDiasIso } from '../src/features/demo/chave.ts';
import { servir } from './servidor-estatico.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = resolve(import.meta.dirname, '..');
const env = Object.fromEntries(readFileSync(join(root, '.env'), 'utf8').split('\n')
  .map((l) => l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)).filter(Boolean).map((m) => [m[1], m[2]]));
const SERVIDORES = [env.EXPO_PUBLIC_SUPABASE_URL, env.EXPO_PUBLIC_FUNCTIONS_URL].filter(Boolean).map((u) => new URL(u).origin);
const PORTA = 8085;
const BASE = `http://127.0.0.1:${PORTA}`;
const HOJE = hojeBrasilia();

const BARBEIRO = 'b0b0b0b0-0000-4000-8000-000000000001';
const DONO = 'b0b0b0b0-0000-4000-8000-000000000003';
const cliente = (n) => `/cliente/c0000000-0000-4000-8000-0000000000${n}`;

const ROTEIRO = {
  [BARBEIRO]: {
    email: 'barbeiro.teste@example.com',
    rotas: ['/', '/agenda', '/relatorios', '/clientes', '/mais', '/servicos', '/planos', '/gastos', '/financeiro', '/meta',
      '/comissao', '/extrato', '/mei', '/insights', '/ia/chat', '/coach', '/expediente', '/whatsapp', '/automacoes',
      '/mensagens', '/instagram', '/instagram/caixa', '/prospeccao', '/ia/personalidade', '/barbearia', '/ia/voz',
      cliente('01'), cliente('02'), cliente('03'), '/conversa/d0000000-0000-4000-8000-000000000001', '/legal/termos'],
  },
  [DONO]: {
    email: 'dono.teste@example.com',
    rotas: ['/', '/agenda', '/relatorios', '/clientes', '/mais', '/servicos', '/planos', '/financeiro', '/meta', '/insights',
      '/barbearia', '/barbearia/equipe', '/barbearia/agenda', `/barbearia/barbeiro/${BARBEIRO}`, `/barbearia/barbeiro/${DONO}`,
      cliente('31')],
  },
};

const usuarios = {};
const chat = {};
let atual = null;

function guardar(req, resp, corpo) {
  const url = new URL(req.url());
  if (!SERVIDORES.includes(url.origin) || url.pathname.startsWith('/auth/') || req.method() === 'OPTIONS') return;
  const h = resp.headers();
  const chave = chaveDaRequisicao(req.method(), req.url(), req.postData(), HOJE);
  if (url.pathname.endsWith('/ia-chat')) {
    const pergunta = JSON.parse(req.postData() ?? '{}').pergunta ?? '';
    const texto = corpo.split('\n\n').map((e) => e.replace(/^data: /, '').trim()).filter(Boolean)
      .map((l) => { try { return JSON.parse(l).texto ?? ''; } catch { return ''; } }).join('');
    if (pergunta && texto) chat[pergunta.trim().toLowerCase()] = texto;
    return;
  }
  // Last reply wins: the state after the celebrations were closed.
  (usuarios[atual] ??= {})[chave] = {
    s: resp.status(), b: corpo,
    ...(h['content-type'] && !h['content-type'].startsWith('application/json') ? { t: h['content-type'] } : {}),
    ...(h['content-range'] ? { r: h['content-range'] } : {}),
  };
}

async function fecharCelebracoes(page) {
  for (let i = 0; i < 4; i++) {
    if (!(await page.getByTestId('comemorar').isVisible().catch(() => false))) return;
    await page.getByTestId('comemorar').click().catch(() => undefined);
    await page.waitForTimeout(700);
  }
}

async function esperar(page) {
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(1200);
  await fecharCelebracoes(page);
  await page.waitForLoadState('networkidle').catch(() => undefined);
}

async function tocarVarias(page, nome, vezes) {
  for (let i = 0; i < vezes; i++) {
    await page.getByRole('button', { name: nome }).last().click().catch(() => undefined);
    await page.waitForTimeout(900);
  }
}

const server = await servir(join(root, 'dist'), PORTA);
const browser = await chromium.launch();
try {
  for (const [uid, roteiro] of Object.entries(ROTEIRO)) {
    atual = uid;
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    ctx.on('requestfinished', async (req) => {
      const resp = await req.response();
      if (resp) guardar(req, resp, await resp.text().catch(() => ''));
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/`);
    await page.getByTestId('entrar-email').waitFor({ timeout: 30_000 });
    await page.getByTestId('entrar-email').fill(roteiro.email);
    await page.getByTestId('entrar-senha').fill('senha-teste-123');
    await page.getByTestId('entrar-botao').click();
    await page.getByTestId('hoje-valor').waitFor({ timeout: 30_000 });
    for (const rota of roteiro.rotas) {
      await page.goto(`${BASE}${rota}`);
      await esperar(page);
      if (rota === '/') {
        await page.getByTestId('ver-mes').click().catch(() => undefined);
        await esperar(page);
        await page.getByTestId('mais-atendimento').click().catch(() => undefined);
        await esperar(page);
        await page.keyboard.press('Escape');
      }
      if (rota === '/agenda') {
        // Calendar: the days around today and the months on each side.
        for (let d = -3; d <= 7; d++) {
          const dia = new Date(Date.parse(`${HOJE}T12:00:00Z`) + d * 86_400_000).toISOString().slice(0, 10);
          if (await page.getByTestId(`dia-${dia}`).isVisible().catch(() => false)) {
            await page.getByTestId(`dia-${dia}`).click();
            await page.waitForTimeout(700);
          }
        }
        await tocarVarias(page, 'Próximo mês', 1);
        await tocarVarias(page, 'Mês anterior', 2);
        await esperar(page);
      }
      if (rota === '/barbearia/agenda') {
        await tocarVarias(page, 'Dia anterior', 3);
        await tocarVarias(page, 'Próximo dia', 7);
        await esperar(page);
      }
      console.log('ok', roteiro.email, rota);
    }
    await page.waitForTimeout(1500);
    await ctx.close();
  }
} finally {
  await browser.close();
  server.close();
}

// Chat answers: asked straight to the local function (the chat streams, so
// the browser recording does not keep its body).
const PERGUNTAS = ['Por que meu faturamento caiu?', 'O que oferecer mais?', 'Quanto falta para a meta?', 'Como faço o Rafael voltar mais vezes?'];
const login = await (await fetch(`${env.EXPO_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`, {
  method: 'POST', headers: { apikey: env.EXPO_PUBLIC_SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'barbeiro.teste@example.com', password: 'senha-teste-123' }),
})).json();
for (const pergunta of PERGUNTAS) {
  const r = await fetch(`${env.EXPO_PUBLIC_FUNCTIONS_URL}/ia-chat`, {
    method: 'POST', headers: { Authorization: `Bearer ${login.access_token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ pergunta, historico: [] }),
  });
  const texto = (await r.text()).split('\n\n').map((e) => e.replace(/^data: /, '').trim()).filter(Boolean)
    .map((l) => { try { return JSON.parse(l).texto ?? ''; } catch { return ''; } }).join('');
  if (texto) chat[pergunta.toLowerCase()] = texto;
}

// "Fale com a IA": answers of the simulated agent for the examples on the voice screen.
const EXEMPLOS = ['quanto eu faturei hoje?', 'quanto eu faturei no mês?', 'qual a minha agenda de amanhã?',
  'marca o Bruno amanhã às 10 pra corte', 'anota no Rafael que prefere degradê baixo', 'abre o financeiro'];
const normalFrase = (t) => t.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const agente = {};
for (const mensagem of EXEMPLOS) {
  const r = await fetch(`${env.EXPO_PUBLIC_FUNCTIONS_URL}/ia-agente`, {
    method: 'POST', headers: { Authorization: `Bearer ${login.access_token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ mensagem, historico: [] }),
  });
  if (r.ok) agente[normalFrase(mensagem)] = await r.json();
}

// The same AI on the phone (Gemma 4): its rules and the answers of the most common tools,
// so the demo APK can run Gemma without a server. Keys: tool + arguments, dates relative to today.
const celular = { contexto: null, ferramentas: {} };
const pedirCelular = (corpo) => fetch(`${env.EXPO_PUBLIC_FUNCTIONS_URL}/ia-agente`, {
  method: 'POST', headers: { Authorization: `Bearer ${login.access_token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(corpo),
}).then((r) => (r.ok ? r.json() : null));
celular.contexto = await pedirCelular({ contexto: true });
const AMANHA = somarDiasIso(HOJE, 1);
const ferramentasDemo = [
  ['resumo_do_dia', { dia: null }], ['resumo_do_dia', { dia: HOJE }], ['resumo_do_dia', { dia: AMANHA }],
  ['agenda_do_dia', { dia: null }], ['agenda_do_dia', { dia: HOJE }], ['agenda_do_dia', { dia: AMANHA }],
  ['horarios_livres', { dia: AMANHA, duracao_min: null }], ['horarios_livres', { dia: HOJE, duracao_min: null }],
  ['numeros_do_mes', {}], ['listar_servicos', {}],
  ['ficha_cliente', { cliente: 'Cliente 1' }], ['ficha_cliente', { cliente: 'Cliente 2' }], ['ficha_cliente', { cliente: 'Cliente 3' }],
  ['agendar_horario', { cliente: 'Cliente 2', servicos: ['Corte'], dia: AMANHA, hora: '10:00' }],
  ['agendar_horario', { cliente: 'Cliente 1', servicos: ['Corte'], dia: AMANHA, hora: '15:00' }],
  ['anotar_no_cliente', { cliente: 'Cliente 1', observacao: 'prefere degradê baixo', tecnica_cabelo: null, tecnica_barba: null }],
  ['abrir_tela', { tela: 'financeiro', cliente: null }], ['abrir_tela', { tela: 'agenda', cliente: null }],
];
for (const [ferramenta, entrada] of ferramentasDemo) {
  const r = await pedirCelular({ ferramenta, entrada });
  if (r) celular.ferramentas[chaveDaFerramenta(ferramenta, entrada, HOJE)] = r;
}

const saida = join(root, 'src', 'features', 'demo', 'gravacao.json');
writeFileSync(saida, `${JSON.stringify({ gravadoEm: HOJE, usuarios, chat, agente, celular })}\n`);
const n = Object.values(usuarios).reduce((t, u) => t + Object.keys(u).length, 0);
console.log(`gravação: ${n} respostas, ${Object.keys(chat).length} perguntas do chat, ${Object.keys(agente).length} exemplos da IA, ${Object.keys(celular.ferramentas).length} ferramentas do Gemma · ${saida}`);
