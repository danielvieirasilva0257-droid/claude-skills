// ia-agente: "Fale com a IA", one AI for voice and text. Modes:
//   { mensagem, historico }  the cloud model answers (text to speak, pending change, screen, refresh)
//   { ..., stream: true }    the same, as Server-Sent Events: {t:'ferramenta',nome} while a tool runs,
//                            {t:'texto',d} as the answer is written, then {t:'fim',...answer} (or {t:'erro'})
//   { confirmar }            runs a pending change the barber confirmed
//   { contexto: true }       rules, tools, today and profile for the model on the phone (Gemma 4)
//   { ferramenta, entrada }  runs one tool for the model on the phone (same tools, same rules)
// The phone modes call no model here, so they do not spend AI uses; they only need the plan.
import {
  executarConfirmado, executarFerramenta, ferramentasParaCelular, rodarAgente, rodarAgenteStream, sistemaDoBarbeiro,
  type Contexto, type Mensagem, type Pendente,
} from '../_shared/agente.ts';
import { clienteAdmin, clienteDoUsuario, consumir, cors, json, usuarioId } from '../_shared/http.ts';

type Pedido = {
  mensagem?: string; historico?: Mensagem[]; confirmar?: Pendente;
  contexto?: boolean; ferramenta?: string; entrada?: Record<string, unknown>; stream?: boolean;
};

const hojeBr = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

export async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const id = await usuarioId(req);
  if (!id) return json({ ok: false, erro: 'login' }, 401);
  const { mensagem, historico = [], confirmar, contexto, ferramenta, entrada, stream } = (await req.json().catch(() => ({}))) as Pedido;
  const doCelular = contexto === true || typeof ferramenta === 'string';
  if (!confirmar && !doCelular && (!mensagem || mensagem.trim().length < 2)) return json({ ok: false, erro: 'mensagem' }, 400);

  // The plan or quota check and the context load go together (one round trip less).
  const db = clienteDoUsuario(req);
  const verificar = async (): Promise<Response | null> => {
    if (doCelular) {
      // The model runs on the phone: check the plan only (no AI use spent).
      const { data: plano } = await clienteAdmin().rpc('plano_efetivo', { p_barbeiro: id });
      return !plano || plano === 'gratis' ? json({ ok: false, erro: 'plano' }, 403) : null;
    }
    if (confirmar) return null;   // confirming does not spend an AI use (no model call)
    const bloqueio = await consumir(clienteAdmin(), id, 'chat');
    return bloqueio ? json({ ok: false, erro: bloqueio }, bloqueio === 'plano' ? 403 : 429) : null;
  };
  const [negado, clientes, servicos] = await Promise.all([
    verificar(),
    db.from('clientes').select('id, nome').eq('barbeiro_id', id),
    db.from('servicos').select('id, nome, preco, duracao_min').eq('barbeiro_id', id).eq('ativo', true),
  ]);
  if (negado) return negado;
  const ctx: Contexto = { db, barbeiro: id, hoje: hojeBr(), clientes: clientes.data ?? [], servicos: (servicos.data ?? []) as Contexto['servicos'] };

  if (stream && mensagem && !confirmar && !doCelular) return responderEmStream(ctx, mensagem, historico);

  try {
    if (contexto) {
      return json({ ok: true, hoje: ctx.hoje, sistema: await sistemaDoBarbeiro(ctx), ferramentas: ferramentasParaCelular(), clientes: ctx.clientes });
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

/** The answer as Server-Sent Events: tools being used, the text as it is written, then the full answer. */
function responderEmStream(ctx: Contexto, mensagem: string, historico: Mensagem[]): Response {
  const cod = new TextEncoder();
  const corpo = new ReadableStream<Uint8Array>({
    async start(c) {
      const enviar = (o: unknown) => c.enqueue(cod.encode(`data: ${JSON.stringify(o)}\n\n`));
      try {
        const r = await rodarAgenteStream(ctx, mensagem, historico, {
          onTexto: (d) => enviar({ t: 'texto', d }),
          onFerramenta: (nome) => enviar({ t: 'ferramenta', nome }),
        });
        enviar({ t: 'fim', ok: true, ...r });
      } catch (e) {
        console.error('ia-agente (stream)', e);
        enviar({ t: 'erro', erro: 'saida_invalida' });
      }
      c.close();
    },
  });
  return new Response(corpo, { headers: { ...cors, 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache' } });
}

