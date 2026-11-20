// RevenueCat webhook against the local database (seed). Run: npm run test:funcoes
import { assert, assertEquals } from 'jsr:@std/assert@1.0.13';

import { createClient } from '../_shared/deps.ts';
import { handler } from '../assinatura-webhook/handler.ts';

const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
const GRATIS = 'b0b0b0b0-0000-4000-8000-000000000002';
const AUTH = Deno.env.get('REVENUECAT_WEBHOOK_AUTH')!;
const daqui = (dias: number) => Date.now() + dias * 86_400_000;

const evento = (id: string, type: string, extra: Record<string, unknown> = {}) => ({
  api_version: '1.0',
  event: { id, type, app_user_id: GRATIS, entitlement_ids: ['pago'], product_id: 'barbeiros_pago_mensal', store: 'APP_STORE',
    period_type: 'NORMAL', expiration_at_ms: daqui(30), original_transaction_id: 'tx-1', ...extra },
});
const postar = (corpo: unknown, auth = AUTH) =>
  handler(new Request('http://x/', { method: 'POST', headers: { Authorization: auth, 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) }));
const assinatura = async () => (await admin.from('app_assinatura').select('*').eq('barbeiro_id', GRATIS).single()).data!;

Deno.test('webhook da assinatura recusa quem não tem a chave', async () => {
  const r = await postar(evento('ev-x', 'INITIAL_PURCHASE'), 'errada');
  assertEquals(r.status, 401);
  await r.body?.cancel();
});

Deno.test('teste grátis, cancelamento e fim: o plano segue a loja', async () => {
  const r1 = await (await postar(evento('ev-1', 'INITIAL_PURCHASE', { period_type: 'TRIAL', expiration_at_ms: daqui(7) }))).json();
  assertEquals(r1.plano, 'pago');
  let s = await assinatura();
  assertEquals([s.status, s.loja, s.provedor], ['teste', 'app_store', 'revenuecat']);
  assert(s.teste_ate, 'guarda o fim do teste grátis');

  const repetido = await (await postar(evento('ev-1', 'INITIAL_PURCHASE', { period_type: 'TRIAL' }))).json();
  assertEquals(repetido.repetido, true);

  await (await postar(evento('ev-2', 'CANCELLATION'))).json();
  s = await assinatura();
  assertEquals([s.plano, s.cancela_no_fim], ['pago', true]);

  await (await postar(evento('ev-3', 'EXPIRATION'))).json();
  s = await assinatura();
  assertEquals([s.plano, s.status], ['gratis', 'expirada']);
});

Deno.test('id que não é de barbeiro fica de fora', async () => {
  const r = await (await postar({ event: { id: 'ev-anon', type: 'INITIAL_PURCHASE', app_user_id: '$RCAnonymousID:abc', entitlement_ids: ['plus'] } })).json();
  assertEquals(r.ignorado, 'usuario');
});
