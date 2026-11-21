// End-to-end flows in the browser (web build of the app + local Supabase).
// Each flow resets the database to the seed first (E2E_SEM_RESET=1 skips it).
// Needs: npm run web:export, and npm run funcoes:dev running (AI functions, mock).
// Usage: node scripts/e2e-web.mjs [prints-dir] [flow-name ...]
import { execSync } from 'node:child_process';
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

// Celebrations pop up once per achievement; close any that is pending.
async function fecharCelebracoes(page) {
  for (let i = 0; i < 4; i++) {
    const sheet = page.getByTestId('celebracao');
    if (!(await sheet.isVisible().catch(() => false))) {
      await page.waitForTimeout(800);
      if (!(await sheet.isVisible().catch(() => false))) return;
    }
    await page.getByTestId('comemorar').click();
    await sheet.waitFor({ state: 'detached', timeout: 10_000 });
  }
}

function esperar(condicao, msg) {
  if (!condicao) throw new Error(msg);
}

// Reads a value straight from the local database (the seed's history is generated relative to today).
function sql(consulta) {
  return execSync('docker exec -i supabase_db_app-barbeiros psql -U postgres -tA', { input: consulta }).toString().trim();
}
const SEED = 'b0b0b0b0-0000-4000-8000-000000000001';
const faturamentoDoMes = () => Number(sql(`select coalesce((select faturamento from v_metricas_mes where barbeiro_id = '${SEED}'
  and mes = date_trunc('month', hoje_br())::date), 0)`));
const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const paraNumero = (t) => Number(normalizar(t).replace(/[^\d,]/g, '').replace(',', '.'));

// HoldToConfirm: press and hold for 2 s.
async function segurar(page, testID) {
  const caixa = await page.getByTestId(testID).boundingBox();
  await page.mouse.move(caixa.x + caixa.width / 2, caixa.y + caixa.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(2400);
  await page.mouse.up();
}

async function sairDaConta(page) {
  await page.evaluate(() => localStorage.clear());
}

// Server-side stand-in for RevenueCat: posts a webhook event with the local secret.
let eventoN = 0;
async function eventoDaLoja(tipo, extra = {}) {
  const url = `${env.EXPO_PUBLIC_FUNCTIONS_URL}/assinatura-webhook`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { Authorization: process.env.REVENUECAT_WEBHOOK_AUTH ?? 'teste-local-rc', 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: { id: `e2e-${Date.now()}-${eventoN++}`, type: tipo, app_user_id: 'b0b0b0b0-0000-4000-8000-000000000002',
      entitlement_ids: ['pago'], product_id: 'barbeiros_pago_mensal', store: 'APP_STORE', period_type: 'NORMAL',
      expiration_at_ms: Date.now() + 30 * 86_400_000, ...extra } }),
  });
  if (!r.ok) throw new Error(`webhook ${tipo}: ${r.status}`);
  return r.json();
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
    await page.getByTestId('exportar-sheet').getByText('Serviços', { exact: true }).click();
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
    await page.waitForTimeout(600);
    const antes = paraNumero(await page.getByTestId('hoje-valor').innerText());
    await print(page, 'f2-10-inicio');
    await page.getByTestId('mais-atendimento').click();
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
    const esperado = normalizar(brl.format(antes + 70));
    esperar(valor === esperado, `Início deveria mostrar ${esperado} (o de antes + corte + hidratação), mostrou ${valor}`);
    await print(page, 'f2-13-inicio-depois');
    await aba(page, 'Agenda');
    await page.getByTestId('agenda-item').first().waitFor();
    await print(page, 'f2-14-agenda');
    await page.getByTestId('fechar-caixa').click();
    await page.getByTestId('caixa-fechado').waitFor({ timeout: 10_000 });
    await print(page, 'f2-15-caixa-fechado');
  },
  // Fase 3: plano Pago e IA (barbeiro do seed, Premium Plus; funções de IA locais em modo simulado).
  async plano_pago_e_ia(page) {
    await entrar(page, 'barbeiro.teste@example.com');
    await page.getByTestId('hoje-valor').waitFor({ timeout: 20_000 });
    await fecharCelebracoes(page);

    await page.goto(`${BASE}/insights`);
    await page.getByTestId('gerar-insights').click();
    await page.getByTestId('insight').first().waitFor({ timeout: 20_000 });
    const n = await page.getByTestId('insight').count();
    esperar(n >= 1 && n <= 3, `insights: esperava 1 a 3, veio ${n}`);
    await print(page, 'f3-01-insights');

    await page.goto(`${BASE}/relatorios`);
    await page.getByTestId('indicadores').waitFor({ timeout: 20_000 });
    await page.getByTestId('grafico-servicos').waitFor();
    await print(page, 'f3-02-relatorios');
    await page.getByTestId('mapa-calor').scrollIntoViewIfNeeded();
    await print(page, 'f3-03-mapa-calor');

    await page.goto(`${BASE}/meta`);
    await page.getByTestId('meta-sugerida').waitFor({ timeout: 20_000 });
    await print(page, 'f3-04-meta-sugerida');
    // Meta 1,6 vez o faturamento do mês: passa da metade, mas não bate.
    const fat = faturamentoDoMes();
    const metaValor = Math.ceil(fat * 1.6);
    await page.getByTestId('meta-valor').fill(String(metaValor));
    await page.getByText('Salvar minha meta').click();
    await page.getByTestId('meta-anel').waitFor();
    await page.getByText('Metade da meta!').waitFor({ timeout: 10_000 });
    await print(page, 'f3-05-meta-50-celebracao');
    await page.getByTestId('comemorar').click();
    await page.getByTestId('celebracao').waitFor({ state: 'detached', timeout: 10_000 });
    const falta = normalizar(await page.getByTestId('meta-falta').innerText());
    const faltaValor = Math.round((metaValor - fat) * 100) / 100;
    esperar(falta.includes(normalizar(brl.format(faltaValor))) && falta.includes(`${Math.ceil(faltaValor / 45)} cortes`), `meta: ${falta}`);

    // Relatórios: o mês até hoje x o mesmo pedaço do mês passado e da média.
    await page.goto(`${BASE}/relatorios`);
    await page.getByTestId('periodo-comparado').waitFor({ timeout: 20_000 });
    const periodo = normalizar(await page.getByTestId('periodo-comparado').innerText());
    esperar(/Do dia 1 ao dia \d+, comparado ao mesmo período do mês passado e à média de 3 meses/.test(periodo), `período: ${periodo}`);
    const comp = normalizar(await page.getByTestId('comparacao-faturamento').innerText());
    esperar(/vs mês passado/.test(comp) && /(acima|abaixo) da média|na média/.test(comp), `comparação: ${comp}`);
    await page.getByTestId('grafico-meses').scrollIntoViewIfNeeded();
    await print(page, 'f3-08-relatorio-meses-media');
    await print(page, 'f3-06-meta');

    await page.goto(`${BASE}/comissao`);
    await page.getByTestId('tipo-escalonada').click();
    await page.getByTestId('comissao-salvar').click();
    await page.getByText('✓ Salvo').waitFor({ timeout: 10_000 });
    await print(page, 'f3-07-comissao');
    await page.goto(`${BASE}/extrato`);
    await page.getByTestId('cascata').waitFor({ timeout: 20_000 });
    await page.getByTestId('proxima-faixa').waitFor();
    await print(page, 'f3-08-extrato');

    await page.goto(`${BASE}/clientes`);
    await page.getByTestId('faixa-sumidos').waitFor({ timeout: 20_000 });
    await print(page, 'f3-09-clientes');
    await page.getByTestId('cliente-linha').first().click();
    await page.getByTestId('ficha-salvar').waitFor({ timeout: 20_000 });
    await print(page, 'f3-10-ficha');

    await page.goto(`${BASE}/ia/chat`);
    await page.getByTestId('entrevista').waitFor({ timeout: 20_000 });
    await print(page, 'f3-11-entrevista');
    for (let i = 0; i < 8; i++) {
      await page.getByTestId('entrevista-resposta').fill(i === 6 ? 'O Rafael eu chamo no WhatsApp' : `Resposta ${i + 1}`);
      await page.getByTestId('entrevista-continuar').click();
    }
    await page.getByTestId('chat-pergunta').waitFor({ timeout: 20_000 });
    await page.getByTestId('chat-pergunta').fill('Como faço o Rafael voltar mais vezes?');
    await page.getByTestId('chat-enviar').click();
    await page.getByTestId('msg-ia').getByText(/faturou/).waitFor({ timeout: 20_000 });
    const resposta = await page.getByTestId('msg-ia').innerText();
    esperar(resposta.includes('Rafael'), 'o nome do cliente volta só na tela');
    await print(page, 'f3-12-chat');

    await page.goto(`${BASE}/coach`);
    await page.getByTestId('pedir-narrativa').click();
    await page.getByTestId('narrativa-sheet').waitFor({ timeout: 20_000 });
    await print(page, 'f3-13-coach-rascunho-ia');
    await page.getByTestId('narrativa-salvar').click();
    await page.getByTestId('narrativa-sheet').waitFor({ state: 'detached', timeout: 10_000 });

    await page.goto(`${BASE}/mei`);
    await page.getByText('DAS do MEI').waitFor({ timeout: 20_000 });
    await print(page, 'f3-14-mei');
    await page.goto(`${BASE}/financeiro`);
    await page.getByTestId('grafico-financeiro').waitFor({ timeout: 20_000 });
    await print(page, 'f3-15-financeiro');

    await page.goto(`${BASE}/agenda`);
    await page.getByTestId(`dia-${new Date(Date.now() + 86_400_000).toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })}`).click();
    await page.getByTestId('agenda-item').first().click();
    await page.getByTestId('ofertas-cadeira').waitFor({ timeout: 20_000 });
    await page.getByTestId('cadeira-aceitou-Sobrancelha').click();
    await page.getByText('✓ Aceitou: entrou no atendimento').waitFor({ timeout: 10_000 });
    await print(page, 'f3-16-ofertas-na-cadeira');
  },

  // Fase 3: no Grátis, as telas pagas abrem bloqueadas com prévia.
  async gratis_bloqueado(page) {
    await entrar(page, 'gratis.teste@example.com');
    await page.getByTestId('onb-preco').or(page.getByTestId('hoje-valor')).first().waitFor({ timeout: 20_000 });
    if (await page.getByTestId('onb-preco').isVisible()) {
      await page.getByTestId('onb-preco').fill('40');
      for (let i = 0; i < 4; i++) await page.getByTestId('onb-continuar').click();
    }
    await page.getByTestId('hoje-valor').waitFor({ timeout: 20_000 });
    for (const rota of ['/financeiro', '/insights', '/extrato', '/relatorios']) {
      await page.goto(`${BASE}${rota}`);
      await page.getByTestId('tela-bloqueada').waitFor({ timeout: 20_000 });
    }
    await print(page, 'f3-20-relatorios-bloqueado');
  },
  // Fases 4 e 5: Premium e Premium Plus (canais em modo simulado, IA simulada).
  async premium_e_plus(page) {
    await entrar(page, 'barbeiro.teste@example.com');
    await page.getByTestId('hoje-valor').waitFor({ timeout: 20_000 });
    await fecharCelebracoes(page);

    await page.goto(`${BASE}/expediente`);
    await page.getByTestId('dia-2').waitFor({ timeout: 20_000 });
    await page.getByTestId('expediente-salvar').click();
    await page.getByText('✓ Salvo').waitFor({ timeout: 10_000 });
    await print(page, 'f4-01-expediente');

    await page.goto(`${BASE}/whatsapp`);
    await page.getByTestId('canal-whatsapp').waitFor({ timeout: 20_000 });
    await page.getByTestId('simular-enviar').click();
    await page.waitForTimeout(1500);
    await page.getByTestId('simular-texto').fill('Sim, pode ser esse');
    await page.getByTestId('simular-enviar').click();
    await page.waitForTimeout(1500);
    await print(page, 'f4-02-whatsapp');
    await page.getByText('Cliente de teste').first().click();
    await page.getByText(/Marquei/).waitFor({ timeout: 20_000 });
    await print(page, 'f4-03-conversa-ia-marcou');
    await page.getByTestId('assumir').click();
    await page.getByText('Você está atendendo').waitFor({ timeout: 10_000 });
    await page.getByTestId('resposta').fill('Te espero, abraço!');
    await page.getByTestId('responder').click();
    await page.getByTestId('msg-barbeiro').first().waitFor({ timeout: 10_000 });
    await print(page, 'f4-04-barbeiro-assumiu');

    await page.goto(`${BASE}/automacoes`);
    await page.getByTestId('planejar').click();
    await page.getByTestId('fila-R4').first().waitFor({ timeout: 20_000 });
    await print(page, 'f4-05-automacoes');

    await page.goto(`${BASE}/mensagens`);
    await page.getByTestId('uso-mensagens').waitFor({ timeout: 20_000 });
    await print(page, 'f4-06-mensagens');

    await page.goto(`${BASE}/instagram`);
    await page.getByTestId('canal-instagram').waitFor({ timeout: 20_000 });
    await page.getByTestId('ig-caixa').click();
    await page.getByTestId('evento-ig').first().waitFor({ timeout: 20_000 });
    await print(page, 'f5-01-instagram-caixa');

    await page.goto(`${BASE}/prospeccao`);
    await page.getByTestId('funil-REELS').waitFor({ timeout: 20_000 });
    await print(page, 'f5-02-prospeccao');

    await page.goto(`${BASE}/ia/personalidade`);
    await page.getByTestId('tom-descontraido').click();
    await page.getByTestId('personalidade-salvar').click();
    await page.getByText('✓ Salvo').waitFor({ timeout: 10_000 });
    await print(page, 'f5-03-personalidade');
  },
  // Fase 6: dono do plano Barbearias, convite e barbeiro novo na equipe.
  async barbearias(page) {
    await entrar(page, 'dono.teste@example.com');
    await page.getByTestId('inicio-barbearia').waitFor({ timeout: 20_000 });
    await print(page, 'f6-01-inicio-dono');
    await page.getByTestId('inicio-barbearia').click();
    await page.getByTestId('painel-hoje-valor').waitFor({ timeout: 20_000 });
    esperar(await page.getByTestId('painel-barbeiro').count() === 2, 'painel deveria mostrar 2 barbeiros');
    await print(page, 'f6-02-painel');

    await page.getByTestId('ir-agenda-equipe').click();
    await page.getByTestId('agenda-equipe-grupo').first().waitFor({ timeout: 20_000 });
    await page.getByRole('button', { name: 'Próximo dia' }).click();
    await page.getByTestId('agenda-equipe-grupo').filter({ hasText: 'Barbeiro Teste' }).waitFor({ timeout: 20_000 });
    await print(page, 'f6-03-agenda-equipe');

    await page.goto(`${BASE}/barbearia/barbeiro/b0b0b0b0-0000-4000-8000-000000000001`);
    await page.getByTestId('relatorio-barbeiro-nome').waitFor({ timeout: 20_000 });
    await page.getByTestId('relatorio-comissao').waitFor();
    await print(page, 'f6-04-relatorio-barbeiro');

    await page.goto(`${BASE}/barbearia/equipe`);
    await page.getByTestId('gerar-convite').waitFor({ timeout: 20_000 });
    esperar((await page.getByTestId('valor-mensal').innerText()).includes('179'), 'com 2 barbeiros: R$ 179');
    await page.getByTestId('gerar-convite').click();
    await page.getByTestId('codigo-gerado').waitFor({ timeout: 10_000 });
    const codigo = normalizar(await page.getByTestId('codigo-gerado').innerText());
    esperar(/^[A-HJ-NP-Z2-9]{6}$/.test(codigo), `código estranho: ${codigo}`);
    await print(page, 'f6-05-convite');

    // O barbeiro novo (Grátis) entra com o código e passa a usar o app como Premium.
    await sairDaConta(page);
    await entrar(page, 'gratis.teste@example.com');
    await page.getByTestId('onb-preco').waitFor({ timeout: 20_000 });
    await page.getByTestId('onb-preco').fill('40');
    for (let i = 0; i < 4; i++) await page.getByTestId('onb-continuar').click();
    await page.getByTestId('hoje-valor').waitFor({ timeout: 20_000 });
    await aba(page, 'Mais');
    await page.getByTestId('mais-barbearia').click();
    await page.getByTestId('codigo-convite').fill(codigo.toLowerCase());
    await page.getByTestId('barbearia-entrar').click();
    await page.getByTestId('na-equipe').waitFor({ timeout: 20_000 });
    await page.getByText('Seu plano agora: Premium').waitFor({ timeout: 10_000 });
    await print(page, 'f6-06-barbeiro-entrou');
    await page.goto(`${BASE}/relatorios`);
    await page.getByText('Ainda sem atendimentos neste mês').waitFor({ timeout: 20_000 });
    esperar(!(await page.getByTestId('tela-bloqueada').isVisible().catch(() => false)), 'na equipe os relatórios abrem');

    // O dono vê 3 barbeiros (R$ 179 + R$ 39) e remove o novo.
    await sairDaConta(page);
    await entrar(page, 'dono.teste@example.com');
    await page.getByTestId('hoje-valor').waitFor({ timeout: 20_000 });
    await page.goto(`${BASE}/barbearia/equipe`);
    await page.getByTestId('valor-mensal').waitFor({ timeout: 20_000 });
    esperar((await page.getByTestId('valor-mensal').innerText()).includes('218'), 'com 3 barbeiros: R$ 218');
    esperar(await page.getByTestId('membro').count() === 3, 'equipe com 3');
    await print(page, 'f6-07-equipe-3');
    await page.getByTestId('remover-Novo Barbeiro').click();
    await page.getByTestId('confirmar-remover').waitFor();
    await print(page, 'f6-08-remover');
    await segurar(page, 'confirmar-remover');
    await page.getByTestId('folha-remover').waitFor({ state: 'detached', timeout: 10_000 });
    await page.waitForFunction(() => document.querySelectorAll('[data-testid="membro"]').length === 2, null, { timeout: 10_000 });
  },
  // Fase 7: a loja avisa (webhook do RevenueCat simulado) e o app segue o banco.
  async assinaturas(page) {
    await entrar(page, 'gratis.teste@example.com');
    await page.getByTestId('onb-preco').waitFor({ timeout: 20_000 });
    await page.getByTestId('onb-preco').fill('40');
    for (let i = 0; i < 4; i++) await page.getByTestId('onb-continuar').click();
    await page.getByTestId('hoje-valor').waitFor({ timeout: 20_000 });

    await page.goto(`${BASE}/planos`);
    await page.getByTestId('sem-loja').waitFor({ timeout: 20_000 });
    await print(page, 'f7-01-planos-web');

    // Teste grátis de 7 dias do Pago.
    await eventoDaLoja('INITIAL_PURCHASE', { period_type: 'TRIAL', expiration_at_ms: Date.now() + 7 * 86_400_000 });
    await page.goto(`${BASE}/`);
    await page.getByTestId('aviso-teste').waitFor({ timeout: 20_000 });
    await print(page, 'f7-02-inicio-teste');
    await page.goto(`${BASE}/relatorios`);
    await page.getByText('Ainda sem atendimentos neste mês').waitFor({ timeout: 20_000 });
    await page.goto(`${BASE}/planos`);
    await page.getByTestId('situacao-assinatura').getByText(/Teste grátis até/).waitFor({ timeout: 20_000 });
    await print(page, 'f7-03-planos-teste');

    await page.goto(`${BASE}/`);
    await aba(page, 'Mais');
    await page.getByTestId('mais-cancelar').click();
    await page.getByTestId('cancelar-na-loja').waitFor({ timeout: 10_000 });
    await page.getByText(/Ajustes do iPhone/).waitFor();
    await print(page, 'f7-04-cancelar-na-loja');

    // Desligou a renovação na loja: o plano vale até o fim do período.
    await eventoDaLoja('CANCELLATION', { period_type: 'TRIAL', expiration_at_ms: Date.now() + 7 * 86_400_000 });
    await page.goto(`${BASE}/planos`);
    await page.getByTestId('situacao-assinatura').getByText(/Renovação desligada/).waitFor({ timeout: 20_000 });

    // Fim do período: volta para o Grátis, dados continuam.
    await eventoDaLoja('EXPIRATION');
    await page.goto(`${BASE}/relatorios`);
    await page.getByTestId('tela-bloqueada').waitFor({ timeout: 20_000 });

    await page.goto(`${BASE}/legal/privacidade`);
    await page.getByTestId('legal-rascunho').waitFor({ timeout: 20_000 });
    await print(page, 'f7-05-privacidade');
  },
  // Fase 8: bater a meta do mês (100%) e ver a celebração.
  async bater_meta(page) {
    await entrar(page, 'barbeiro.teste@example.com');
    await page.getByTestId('hoje-valor').waitFor({ timeout: 20_000 });
    await fecharCelebracoes(page);
    await page.goto(`${BASE}/meta`);
    await page.getByTestId('meta-valor').waitFor({ timeout: 20_000 });
    await page.getByTestId('meta-valor').fill(String(Math.floor(faturamentoDoMes())));
    await page.getByText('Salvar minha meta').click();
    // 50% and 100% may follow each other in the same sheet: tap through until "Meta batida!".
    let batida = false;
    for (let i = 0; i < 5 && !batida; i++) {
      await page.getByTestId('comemorar').waitFor({ timeout: 10_000 });
      batida = await page.getByText('Meta batida!').isVisible();
      if (batida) break;
      await page.getByTestId('comemorar').click();
      await page.waitForTimeout(900);
    }
    esperar(batida, 'faltou a celebração de meta batida');
    await print(page, 'f8-01-meta-batida');
    await fecharCelebracoes(page);
    const anel = normalizar(await page.getByTestId('meta-anel').innerText());
    esperar(anel.includes('100%'), `anel da meta: ${anel}`);
    await print(page, 'f8-02-meta-100');
  },
  // Melhorias de 20/11: calendário e grade, CRM do agendamento, cadastro com observações, Mais e Fale com a IA.
  async agenda_e_voz(page) {
    const amanha = new Date(Date.now() + 86_400_000).toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
    await entrar(page, 'barbeiro.teste@example.com');
    await page.getByTestId('hoje-valor').waitFor({ timeout: 20_000 });
    await fecharCelebracoes(page);
    await aba(page, 'Agenda');
    await page.getByTestId('calendario').waitFor({ timeout: 20_000 });
    await page.getByTestId(`dia-${amanha}`).click();
    await page.getByTestId('agenda-item').filter({ hasText: 'Bruno' }).click();
    await page.getByTestId('crm-agendamento').waitFor({ timeout: 10_000 });
    const crm = normalizar(await page.getByTestId('crm-agendamento').innerText());
    esperar(crm.includes('Barbeiro Teste') && crm.includes('18:30') && crm.includes('R$ 35,00'), `CRM: ${crm}`);
    await print(page, 'm-01-crm-agendamento');
    await page.getByTestId('crm-cliente').click();
    await page.getByTestId('ficha-observacoes').waitFor({ timeout: 20_000 });
    esperar((await page.getByTestId('ficha-observacoes').inputValue()).includes('pressa'), 'observações do Bruno');
    await page.getByTestId('ficha-tecnica_barba').fill('Desenhada, contorno na navalha, pezinho reto');
    await page.getByTestId('ficha-salvar').click();
    await page.getByText('✓ Salvo').waitFor({ timeout: 10_000 });
    await print(page, 'm-02-cadastro');

    // Free half hour on the grid: the booking sheet comes with the time.
    await page.goto(`${BASE}/agenda`);
    await page.getByTestId(`dia-${amanha}`).click();
    await page.getByTestId('vazio-10:00').click();
    await page.getByTestId('agendar-sheet').waitFor({ timeout: 10_000 });
    esperar((await page.getByTestId('agendar-hora').inputValue()) === '10:00', 'hora do horário vazio');
    await page.keyboard.press('Escape');
    await page.getByTestId('agendar-sheet').waitFor({ state: 'detached', timeout: 10_000 });

    // Mais: today's clients and "Fale com a IA"; the AI books, the barber says "sim".
    await page.goto(`${BASE}/mais`);
    await page.getByTestId('mais-hoje').waitFor({ timeout: 20_000 });
    await page.getByTestId('fale-com-ia').click();
    await page.getByTestId('orbe-ia').waitFor({ timeout: 20_000 });
    if (!(await page.getByTestId('voz-texto').isVisible().catch(() => false))) await page.getByTestId('voz-teclado').click();
    await page.getByTestId('voz-texto').fill('Marca o Rafael amanhã às 15 pra corte');
    await page.getByTestId('voz-enviar').click();
    await page.getByTestId('voz-pendente').waitFor({ timeout: 20_000 });
    esperar((await page.getByTestId('voz-pendente').innerText()).includes('15:00'), 'resumo com a hora');
    await print(page, 'm-03-voz-pendente');
    await page.getByTestId('voz-texto').fill('sim');
    await page.getByTestId('voz-enviar').click();
    await page.getByText('Pronto, horário agendado.').waitFor({ timeout: 20_000 });
    await page.goto(`${BASE}/agenda`);
    await page.getByTestId(`dia-${amanha}`).click();
    await page.getByTestId('agenda-item').filter({ hasText: 'Rafael' }).waitFor({ timeout: 20_000 });
    await print(page, 'm-04-agenda-com-o-horario-da-ia');
  },
};

async function main() {
  const server = await servir(join(root, 'dist'), PORTA);
  const browser = await chromium.launch();
  let falhas = 0;
  try {
    for (const [nome, fluxo] of Object.entries(fluxos)) {
      if (so.length && !so.includes(nome)) continue;
      // Each flow starts from the seed (independent and repeatable).
      if (process.env.E2E_SEM_RESET !== '1') execSync('bash scripts/supabase-local.sh db reset', { cwd: root, stdio: 'ignore' });
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
