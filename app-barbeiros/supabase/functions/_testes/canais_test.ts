// Channel functions in simulated mode (CANAIS_MODO=simulado, LLM mock) against
// the local database seed. Run: npm run test:funcoes (after npm run db:reset)
import { assert, assertEquals } from 'jsr:@std/assert@1.0.13';

import { createClient } from '../_shared/deps.ts';
import { handler as canalEnviar } from '../canal-enviar/handler.ts';
import { handler as enviarFila } from '../enviar-fila/handler.ts';
import { handler as instagram } from '../instagram-webhook/handler.ts';
import { handler as whatsapp } from '../whatsapp-webhook/handler.ts';

const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
const NUMERO = '5511988887777';

const postar = (h: (r: Request) => Promise<Response>, corpo: unknown, auth?: string) =>
  h(new Request('http://x/', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(auth ? { Authorization: auth } : {}) },
    body: JSON.stringify(corpo) }));

const mensagemWa = (texto: string, id: string) => ({ entry: [{ changes: [{ value: {
  metadata: { phone_number_id: 'wa-teste-001' },
  contacts: [{ wa_id: NUMERO, profile: { name: 'Pedro Novo' } }],
  messages: [{ from: NUMERO, id, type: 'text', text: { body: texto } }],
} }] }] });

Deno.test('webhook do WhatsApp responde à verificação da Meta', async () => {
  const r = await whatsapp(new Request('http://x/?hub.mode=subscribe&hub.verify_token=teste-local&hub.challenge=42'));
  assertEquals(await r.text(), '42');
});

Deno.test('cliente novo pede horário, a IA oferece horários livres e marca quando ele confirma', async () => {
  const r1 = await (await postar(whatsapp, mensagemWa('Oi, quero marcar um horário pra cortar REELS', 'm1'))).json();
  assertEquals(r1.resultados[0].respondeu, true);
  const { data: conv } = await admin.from('conversas').select('id, cliente_id, origem_codigo').eq('contato_externo', NUMERO).single();
  assertEquals(conv!.origem_codigo, 'REELS');
  const r2 = await (await postar(whatsapp, mensagemWa('Sim, pode ser esse', 'm2'))).json();
  assert(r2.resultados[0].agendado, JSON.stringify(r2));
  const { data: at } = await admin.from('atendimentos').select('status, inicio').eq('cliente_id', conv!.cliente_id).single();
  assertEquals(at!.status, 'agendado');
});

Deno.test('o barbeiro assume a conversa e responde; a IA para', async () => {
  const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { auth: { persistSession: false } });
  const { data: s } = await sb.auth.signInWithPassword({ email: 'barbeiro.teste@example.com', password: 'senha-teste-123' });
  const { data: conv } = await admin.from('conversas').select('id').eq('contato_externo', NUMERO).single();
  const r = await postar(canalEnviar, { conversa_id: conv!.id, texto: 'Fechado, te espero!' }, `Bearer ${s.session!.access_token}`);
  assertEquals((await r.json()).status, 'simulado');
  const { data: c } = await admin.from('conversas').select('ia_ativa').eq('id', conv!.id).single();
  assertEquals(c!.ia_ativa, false);
  const r3 = await (await postar(whatsapp, mensagemWa('Valeu!', 'm3'))).json();
  assertEquals(r3.resultados[0].respondeu, false);
});

Deno.test('Instagram: um comentário recebe uma resposta privada, nunca duas', async () => {
  const comentario = { entry: [{ id: 'ig-teste-001', changes: [{ field: 'comments',
    value: { id: 'c-99', text: 'Quero esse corte! REELS', from: { id: 'ig-u-1', username: 'ana' }, media: { id: 'm-9' } } }] }] };
  const r1 = await (await postar(instagram, comentario)).json();
  assertEquals(r1.resultados[0].respondeu, true);
  const r2 = await (await postar(instagram, comentario)).json();
  assertEquals(r2.resultados[0].repetido, true);
  const { count } = await admin.from('instagram_eventos').select('*', { count: 'exact', head: true }).eq('comentario_id', 'c-99');
  assertEquals(count, 1);
});

Deno.test('fila de automações: só o servidor envia, e cada envio vira contato registrado', async () => {
  assertEquals((await postar(enviarFila, {})).status, 403);
  await admin.rpc('planejar_automacoes', { p_barbeiro: 'b0b0b0b0-0000-4000-8000-000000000001' });
  const r = await (await postar(enviarFila, {}, `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`)).json();
  assert(r.ok);
  const { count } = await admin.from('mensagens_fila').select('*', { count: 'exact', head: true }).eq('status', 'pendente')
    .lte('agendado_para', new Date().toISOString());
  assertEquals(count, 0);
});
