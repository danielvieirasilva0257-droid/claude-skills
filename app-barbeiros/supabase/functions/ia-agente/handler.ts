// ia-agente: "Fale com a IA". Receives what the barber said (already turned
// into text on the phone) or the confirmation of a pending change, and answers
// with the text to speak, an optional pending change to confirm, a screen to
// open and the data the app must refresh. JSON (not a stream): the phone
// speaks the whole answer at once.
import { executarConfirmado, rodarAgente, type Contexto, type Mensagem, type Pendente } from '../_shared/agente.ts';
import { clienteAdmin, clienteDoUsuario, consumir, cors, json, usuarioId } from '../_shared/http.ts';

type Pedido = { mensagem?: string; historico?: Mensagem[]; confirmar?: Pendente };

const hojeBr = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

export async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const id = await usuarioId(req);
  if (!id) return json({ ok: false, erro: 'login' }, 401);
  const { mensagem, historico = [], confirmar } = (await req.json().catch(() => ({}))) as Pedido;
  if (!confirmar && (!mensagem || mensagem.trim().length < 2)) return json({ ok: false, erro: 'mensagem' }, 400);

  // Confirming does not spend an AI use (no model call).
  if (!confirmar) {
    const bloqueio = await consumir(clienteAdmin(), id, 'chat');
    if (bloqueio) return json({ ok: false, erro: bloqueio }, bloqueio === 'plano' ? 403 : 429);
  }

  const db = clienteDoUsuario(req);
  const [clientes, servicos] = await Promise.all([
    db.from('clientes').select('id, nome').eq('barbeiro_id', id),
    db.from('servicos').select('id, nome, preco, duracao_min').eq('barbeiro_id', id).eq('ativo', true),
  ]);
  const ctx: Contexto = { db, barbeiro: id, hoje: hojeBr(), clientes: clientes.data ?? [], servicos: (servicos.data ?? []) as Contexto['servicos'] };

  try {
    const r = confirmar ? await executarConfirmado(ctx, confirmar) : await rodarAgente(ctx, mensagem!, historico);
    return json({ ok: true, ...r });
  } catch (e) {
    console.error('ia-agente', e);
    return json({ ok: false, erro: 'saida_invalida' }, 500);
  }
}
