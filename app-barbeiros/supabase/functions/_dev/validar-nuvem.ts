// Validates the cloud brain with the REAL model (LLM_PROVIDER=google) against
// the local database: typical requests through the ia-agente handler, checking
// what must happen (tool, pending change, screen, numbers from the database).
// Run (spends a few free requests):
//   LLM_PROVIDER=google LLM_API_KEY=$(cat /root/.config/rotina/google-ai-studio.key) \
//   bash scripts/funcoes-env.sh deno run --config supabase/functions/deno.json -A supabase/functions/_dev/validar-nuvem.ts
import { createClient } from '../_shared/deps.ts';
import { handler } from '../ia-agente/handler.ts';

const URL_SB = Deno.env.get('SUPABASE_URL')!;
const sb = createClient(URL_SB, Deno.env.get('SUPABASE_ANON_KEY')!, { auth: { persistSession: false } });
const { data, error } = await sb.auth.signInWithPassword({ email: 'barbeiro.teste@example.com', password: 'senha-teste-123' });
if (error) throw error;
const token = data.session!.access_token;

// A recent comanda with a client, paid by card, to ask for a change by name and day.
const admin = createClient(URL_SB, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
const { data: alvo } = await admin.from('atendimentos').select('inicio, cliente:clientes(nome)')
  .eq('barbeiro_id', data.user!.id).eq('status', 'concluido').in('forma_pagamento', ['credito', 'debito']).not('cliente_id', 'is', null)
  .lt('inicio', new Date().toISOString()).order('inicio', { ascending: false }).limit(1).single();
const a = alvo as unknown as { inicio: string; cliente: { nome: string } };
const diaAlvo = new Date(a.inicio).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit' });
const comandaPedido = `Muda a comanda do ${a.cliente.nome.split(' ')[0]} do dia ${diaAlvo} para pagamento no pix`;

type Resposta = { ok: boolean; texto?: string; erro?: string; pendente?: { ferramenta: string; entrada: Record<string, unknown>; resumo: string }; navegar?: string };
async function falar(mensagem: string): Promise<{ r: Resposta; ms: number }> {
  const t0 = Date.now();
  const res = await handler(new Request('http://x/', {
    method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ mensagem, historico: [] }),
  }));
  return { r: await res.json() as Resposta, ms: Date.now() - t0 };
}

const casos: { pedido: string; conferir: (r: Resposta) => string | null }[] = [
  { pedido: 'Quanto eu faturei hoje?', conferir: (r) => (/R\$ ?[\d.]+,\d{2}|nada|nenhum|zero/i.test(r.texto ?? '') ? null : 'sem valor em reais') },
  { pedido: 'Quanto eu faturei no mês?', conferir: (r) => (/R\$ ?[\d.]+,\d{2}/.test(r.texto ?? '') ? (/(mês passado|média)/i.test(r.texto ?? '') ? null : 'sem a comparação') : 'sem valor em reais') },
  { pedido: 'Como tá minha agenda amanhã?', conferir: (r) => (r.texto && !/Cliente \d/.test(r.texto) ? null : 'vazia ou com "Cliente N"') },
  { pedido: 'Marca o Bruno amanhã às 15h pra corte', conferir: (r) => (r.pendente?.ferramenta === 'agendar_horario' ? null : 'não preparou o agendamento') },
  { pedido: 'Anota no Bruno que ele gosta de degradê baixo', conferir: (r) => (r.pendente?.ferramenta === 'anotar_no_cliente' ? null : 'não preparou a anotação') },
  { pedido: 'Muda o preço da barba para 40 reais', conferir: (r) => (r.pendente?.ferramenta === 'mudar_preco_servico' && Number(r.pendente.entrada.preco) === 40 ? null : 'não preparou o preço') },
  { pedido: 'Gastei 30 reais com produtos', conferir: (r) => (r.pendente?.ferramenta === 'registrar_gasto' ? null : 'não preparou o gasto') },
  { pedido: 'Abre a tela de gastos', conferir: (r) => (r.navegar === '/gastos' ? null : 'não abriu a tela') },
  // Full control (22/11/2026)
  { pedido: 'Qual foi meu ticket médio dos últimos 4 dias?', conferir: (r) => (/ticket/i.test(r.texto ?? '') && /R\$ ?[\d.]+,\d{2}/.test(r.texto ?? '') ? null : 'sem o ticket médio em reais') },
  { pedido: 'Qual dia da semana eu mais faturei nos últimos 30 dias?', conferir: (r) => (/(segunda|terça|quarta|quinta|sexta|sábado|domingo)/i.test(r.texto ?? '') ? null : 'não disse o dia da semana') },
  { pedido: 'Faz um relatório da semana passada com os serviços e as formas de pagamento', conferir: (r) => (r.navegar?.startsWith('/ia/relatorio/') ? null : 'não abriu o relatório') },
  { pedido: comandaPedido, conferir: (r) => (r.pendente?.ferramenta === 'editar_atendimento' && r.pendente.entrada.forma === 'pix' ? null : 'não preparou a mudança da comanda') },
];

// VALIDAR_SO="relatório|comanda" runs only the matching requests (the free tier allows ~15 requests a minute).
const so = Deno.env.get('VALIDAR_SO');
const escolhidos = casos.filter((c) => !so || new RegExp(so, 'i').test(c.pedido));
let falhas = 0;
for (const c of escolhidos) {
  const { r, ms } = await falar(c.pedido);
  const problema = r.ok ? c.conferir(r) : `erro ${r.erro}`;
  if (problema) falhas++;
  console.log(`${problema ? '✗' : '✓'} ${c.pedido}  (${(ms / 1000).toFixed(1)} s)`);
  console.log(`    → ${r.texto ?? ''}${r.pendente ? `  [pendente: ${r.pendente.resumo}]` : ''}${r.navegar ? `  [tela: ${r.navegar}]` : ''}${problema ? `  ← ${problema}` : ''}`);
}
console.log(falhas ? `${falhas} de ${escolhidos.length} falharam` : `${escolhidos.length} de ${escolhidos.length} ok`);
Deno.exit(falhas ? 1 : 0);
