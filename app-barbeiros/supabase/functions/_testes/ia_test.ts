// Tests of the AI functions against the local database (seed), mock provider.
// Run: npm run test:funcoes  (needs npm run db:reset first)
import { assert, assertEquals, assertMatch } from 'jsr:@std/assert@1.0.13';

import { criarAnonimizador, pontoSeguro } from '../_shared/anonimizar.ts';
import { createClient } from '../_shared/deps.ts';
import { handler as chat } from '../ia-chat/handler.ts';
import { handler as entrevista } from '../ia-entrevista/handler.ts';
import { handler as insights } from '../ia-insights/handler.ts';
import { handler as narrativa } from '../ia-narrativa/handler.ts';

const URL_SB = Deno.env.get('SUPABASE_URL')!;
const ANON = Deno.env.get('SUPABASE_ANON_KEY')!;

async function token(email: string) {
  const sb = createClient(URL_SB, ANON, { auth: { persistSession: false } });
  const { data, error } = await sb.auth.signInWithPassword({ email, password: 'senha-teste-123' });
  if (error) throw error;
  return { token: data.session!.access_token, sb };
}

const pedir = (h: (r: Request) => Promise<Response>, tk: string, corpo: unknown) =>
  h(new Request('http://x/', { method: 'POST', headers: { Authorization: `Bearer ${tk}`, 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) }));

Deno.test('anonimizador troca nomes por "Cliente N" e devolve só o primeiro nome', () => {
  const a = criarAnonimizador([{ id: 'b', nome: 'Bruno Lima' }, { id: 'a', nome: 'Rafael Souza' }]);
  const t = a.anonimizar('O Rafael Souza e o bruno vieram; rafaela não é cliente.');
  assertEquals(t, 'O Cliente 1 e o Cliente 2 vieram; rafaela não é cliente.');
  assertEquals(a.revelar('Chame o Cliente 1 hoje.'), 'Chame o Rafael hoje.');
  const corte = pontoSeguro('fale com o Cliente 1');
  assert(corte > 0 && !'fale com o Cliente 1'.slice(0, corte).includes('Cliente'), 'não corta no meio de "Cliente N"');
});

Deno.test('ia-insights: até 3 insights com o número do banco, sem nome de cliente', async () => {
  const { token: tk, sb } = await token('barbeiro.teste@example.com');
  const r = await pedir(insights, tk, {});
  const corpo = await r.json();
  assertEquals(r.status, 200, JSON.stringify(corpo));
  assert(corpo.gerados >= 1 && corpo.gerados <= 3);
  const { data: linhas } = await sb.from('ia_insights').select('*');
  const { data: sinais } = await sb.rpc('sinais_insights', { p_barbeiro: (await sb.auth.getUser()).data.user!.id });
  for (const l of linhas!) {
    assert(sinais.sinais.some((s: { numero: string }) => s.numero === l.numero), `número inventado: ${l.numero}`);
    assert(l.titulo.split(/\s+/).length <= 5);
    assert(!/Rafael|Bruno|Carlos/.test(JSON.stringify(l)));
  }
});

Deno.test('ia-insights: plano Grátis não usa a IA', async () => {
  const { token: tk } = await token('gratis.teste@example.com');
  const r = await pedir(insights, tk, {});
  assertEquals(r.status, 403);
  assertEquals((await r.json()).erro, 'plano');
});

Deno.test('ia-narrativa: rascunho inativo criado pela IA', async () => {
  const { token: tk, sb } = await token('barbeiro.teste@example.com');
  const { data: s } = await sb.from('servicos').select('id').eq('nome', 'Sobrancelha').single();
  const r = await pedir(narrativa, tk, { servico_id: s!.id });
  const corpo = await r.json();
  assertEquals(r.status, 200, JSON.stringify(corpo));
  assertEquals(corpo.narrativa.criada_pela_ia, true);
  assertEquals(corpo.narrativa.ativa, false);
});

Deno.test('ia-entrevista: guarda o perfil e a jornada, com nomes mascarados', async () => {
  const { token: tk, sb } = await token('barbeiro.teste@example.com');
  const respostas = ['R$ 45, uns 12 por dia', 'Agenda cheia', 'Recebo com café', 'Na primeira pergunto do cabelo',
    'Hidratação junto do corte', 'Café e conversa', 'O Rafael eu chamo no WhatsApp', 'Indicação e Instagram'];
  const r = await pedir(entrevista, tk, { respostas });
  assertEquals(r.status, 200);
  const { data: b } = await sb.from('barbeiros').select('ia_perfil').single();
  assert(!JSON.stringify(b!.ia_perfil).includes('Rafael'), 'nome do cliente não pode ir para a IA');
  const { count } = await sb.from('jornada_etapas').select('*', { count: 'exact', head: true });
  assert((count ?? 0) >= 3);
});

Deno.test('ia-chat: responde em streaming e mostra o nome só na tela', async () => {
  const { token: tk } = await token('barbeiro.teste@example.com');
  const r = await pedir(chat, tk, { pergunta: 'Como faço o Rafael voltar mais vezes?' });
  assertEquals(r.headers.get('Content-Type'), 'text/event-stream');
  const texto = await r.text();
  const eventos = texto.split('\n\n').filter(Boolean).map((l) => JSON.parse(l.replace(/^data: /, '')));
  assert(eventos.at(-1).fim === true, texto);
  const resposta = eventos.filter((e) => e.texto).map((e) => e.texto).join('');
  assertMatch(resposta, /faturou R\$/);
  assertMatch(resposta, /Rafael/); // "Cliente N" went out, "Rafael" came back on screen
});
