// ia-agente: "Fale com a IA", one AI for voice and text. Modes:
//   { mensagem, historico }  the cloud model answers (text to speak, pending change, screen, refresh)
//   { confirmar }            runs a pending change the barber confirmed
//   { contexto: true }       rules, tools, today and profile for the model on the phone (Gemma 4)
//   { ferramenta, entrada }  runs one tool for the model on the phone (same tools, same rules)
// The phone modes call no model here, so they do not spend AI uses; they only need the plan.
import {
  executarConfirmado, executarFerramenta, ferramentasParaCelular, rodarAgente, sistemaCelular,
  type Contexto, type Mensagem, type Pendente,
} from '../_shared/agente.ts';
import { clienteAdmin, clienteDoUsuario, consumir, cors, json, usuarioId } from '../_shared/http.ts';

type Pedido = {
  mensagem?: string; historico?: Mensagem[]; confirmar?: Pendente;
  contexto?: boolean; ferramenta?: string; entrada?: Record<string, unknown>;
};

const hojeBr = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

export async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const id = await usuarioId(req);
  if (!id) return json({ ok: false, erro: 'login' }, 401);
  const { mensagem, historico = [], confirmar, contexto, ferramenta, entrada } = (await req.json().catch(() => ({}))) as Pedido;
  const doCelular = contexto === true || typeof ferramenta === 'string';
  if (!confirmar && !doCelular && (!mensagem || mensagem.trim().length < 2)) return json({ ok: false, erro: 'mensagem' }, 400);

  if (doCelular) {
    // The model runs on the phone: check the plan only (no AI use spent).
    const { data: plano } = await clienteAdmin().rpc('plano_efetivo', { p_barbeiro: id });
    if (!plano || plano === 'gratis') return json({ ok: false, erro: 'plano' }, 403);
  } else if (!confirmar) {
    // Confirming does not spend an AI use (no model call).
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
    if (contexto) {
      const { data: b } = await db.from('barbeiros').select('nome, ia_perfil').eq('id', id).maybeSingle();
      const perfil = b?.ia_perfil && typeof b.ia_perfil === 'object' ? { ...(b.ia_perfil as Record<string, unknown>), respostas: undefined } : null;
      return json({ ok: true, hoje: ctx.hoje, sistema: sistemaCelular(ctx, { nome: b?.nome, perfil }), ferramentas: ferramentasParaCelular(), clientes: ctx.clientes });
    }
    if (ferramenta) {
      const saida = await executarFerramenta(ctx, ferramenta, entrada ?? {});
      return json({ ok: true, ...saida });
    }
    const r = confirmar ? await executarConfirmado(ctx, confirmar) : await rodarAgente(ctx, mensagem!, historico);
    return json({ ok: true, ...r });
  } catch (e) {
    console.error('ia-agente', e);
    return json({ ok: false, erro: 'saida_invalida' }, 500);
  }
}
