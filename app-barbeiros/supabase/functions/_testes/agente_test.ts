// "Fale com a IA" (simulated agent, LLM_PROVIDER=mock) against the local seed.
// Run: npm run db:reset && npm run test:funcoes
import { assert, assertEquals, assertMatch } from 'jsr:@std/assert@1.0.13';

import { criarAnonimizador } from '../_shared/anonimizar.ts';
import { createClient } from '../_shared/deps.ts';
import { handler } from '../ia-agente/handler.ts';

const URL_SB = Deno.env.get('SUPABASE_URL')!;
const admin = createClient(URL_SB, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });

async function token() {
  const sb = createClient(URL_SB, Deno.env.get('SUPABASE_ANON_KEY')!, { auth: { persistSession: false } });
  const { data, error } = await sb.auth.signInWithPassword({ email: 'barbeiro.teste@example.com', password: 'senha-teste-123' });
  if (error) throw error;
  return data.session!.access_token;
}

async function falar(corpo: unknown) {
  const r = await handler(new Request('http://x/', { method: 'POST', headers: { Authorization: `Bearer ${await token()}`, 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) }));
  return await r.json() as { ok: boolean; texto: string; pendente?: { ferramenta: string; entrada: Record<string, unknown>; resumo: string }; navegar?: string; atualizar?: string[] };
}

const amanha = () => new Date(Date.now() + 86_400_000).toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });

Deno.test('o nome do cliente sai como "Cliente N" e volta só com o primeiro nome', () => {
  const anon = criarAnonimizador([{ id: 'b', nome: 'Bruno Lima' }, { id: 'a', nome: 'Rafael Souza' }]);
  assertEquals(anon.anonimizar('Marca o Bruno Lima e o Rafael'), 'Marca o Cliente 2 e o Cliente 1');
  assertEquals(anon.revelar('Cliente 2 às 10h'), 'Bruno às 10h');
});

Deno.test('pergunta de número responde com o número do banco', async () => {
  const r = await falar({ mensagem: 'Quanto eu faturei no mês?' });
  assertEquals(r.ok, true);
  assertMatch(r.texto, /R\$ [\d.]+,\d{2}/);
});

Deno.test('marcar horário prepara a ação; só a confirmação grava', async () => {
  const r = await falar({ mensagem: 'Marca o Bruno amanhã às 10 pra corte' });
  assertEquals(r.pendente?.ferramenta, 'agendar_horario');
  assertMatch(r.pendente!.resumo, /Bruno/);
  assertMatch(r.pendente!.resumo, /10:00/);
  const antes = await admin.from('atendimentos').select('id', { count: 'exact', head: true }).eq('cliente_id', 'c0000000-0000-4000-8000-000000000002').eq('status', 'agendado');
  const c = await falar({ confirmar: r.pendente });
  assertMatch(c.texto, /agendado/);
  assert(c.atualizar?.includes('agenda_grade'));
  const { data } = await admin.from('atendimentos').select('inicio').eq('cliente_id', 'c0000000-0000-4000-8000-000000000002').eq('status', 'agendado');
  assertEquals((data ?? []).length, (antes.count ?? 0) + 1);
  assert((data ?? []).some((a) => new Date(a.inicio).toLocaleString('en-CA', { timeZone: 'America/Sao_Paulo', hour12: false }).startsWith(`${amanha()}, 10:00`)));
});

Deno.test('anotar na ficha do cliente pelo nome falado', async () => {
  const r = await falar({ mensagem: 'Anota no Rafael que agora prefere degradê baixo' });
  assertEquals(r.pendente?.ferramenta, 'anotar_no_cliente');
  await falar({ confirmar: r.pendente });
  const { data } = await admin.from('clientes').select('observacoes').eq('id', 'c0000000-0000-4000-8000-000000000001').single();
  assertMatch(String(data!.observacoes), /prefere degradê baixo/);
});

Deno.test('abrir uma tela do app', async () => {
  const r = await falar({ mensagem: 'Abre os relatórios' });
  assertEquals(r.navegar, '/relatorios');
});

Deno.test('números do mês: compara só até o mesmo dia, com o mês passado e a média', async () => {
  const r = await falar({ mensagem: 'Quanto eu faturei esse mês?' });
  assertMatch(r.texto, /No mês você faturou R\$ [\d.,]+ em \d+ atendimento/);
  const dia = Number(new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }).slice(8));
  assertMatch(r.texto, new RegExp(`Até o dia ${dia}: [\\d,]+% (acima|abaixo) do mês passado e ([\\d,]+% (acima|abaixo) da média|na média)`));
});

// ---------- The same AI on the phone (Gemma 4): context and tools from here ----------
Deno.test('celular: contexto traz regras, ferramentas, hoje e a lista para o "Cliente N"', async () => {
  const r = await falar({ contexto: true }) as unknown as {
    ok: boolean; hoje: string; sistema: string; clientes: { id: string; nome: string }[];
    ferramentas: { name: string; parameters: { properties: Record<string, { nullable?: boolean; type: string }>; required: string[] } }[];
  };
  assertEquals(r.ok, true);
  assertMatch(r.sistema, /Hoje é .*\(\d{4}-\d{2}-\d{2}\)/);
  assertMatch(r.sistema, /Cliente 1/);
  const agendar = r.ferramentas.find((f) => f.name === 'agendar_horario')!;
  assertEquals(agendar.parameters.properties.cliente!.nullable, true);
  assert(agendar.parameters.required.includes('dia') && !agendar.parameters.required.includes('cliente'));
  assert(r.clientes.some((c) => c.nome === 'Bruno Lima'), 'a lista vem para o celular montar o mesmo "Cliente N"');
});

Deno.test('celular: ferramenta de leitura devolve dados com "Cliente N"; mudança volta pendente', async () => {
  const leitura = await falar({ ferramenta: 'agenda_do_dia', entrada: { dia: amanha() } }) as unknown as { ok: boolean; conteudo: string };
  assertEquals(leitura.ok, true);
  assertMatch(leitura.conteudo, /Cliente 2/);
  assert(!/Bruno/.test(leitura.conteudo), 'nome real não vai para o modelo');
  const mudanca = await falar({ ferramenta: 'agendar_horario', entrada: { cliente: 'Cliente 1', servicos: ['Corte'], dia: amanha(), hora: '11:00' } });
  assertEquals(mudanca.pendente?.ferramenta, 'agendar_horario');
});
