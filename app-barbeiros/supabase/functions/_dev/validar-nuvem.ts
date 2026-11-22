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
];

let falhas = 0;
for (const c of casos) {
  const { r, ms } = await falar(c.pedido);
  const problema = r.ok ? c.conferir(r) : `erro ${r.erro}`;
  if (problema) falhas++;
  console.log(`${problema ? '✗' : '✓'} ${c.pedido}  (${(ms / 1000).toFixed(1)} s)`);
  console.log(`    → ${r.texto ?? ''}${r.pendente ? `  [pendente: ${r.pendente.resumo}]` : ''}${r.navegar ? `  [tela: ${r.navegar}]` : ''}${problema ? `  ← ${problema}` : ''}`);
}
console.log(falhas ? `${falhas} de ${casos.length} falharam` : `${casos.length} de ${casos.length} ok`);
Deno.exit(falhas ? 1 : 0);
