// ia-narrativa: a draft narrative for one service (or product). Saved as
// inactive (criada_pela_ia = true); the barber edits and turns it on.
import { clienteAdmin, clienteDoUsuario, consumir, cors, json, usuarioId } from '../_shared/http.ts';
import { gerarJSON } from '../_shared/llm.ts';
import { mockNarrativa } from '../_shared/mock.ts';
import { NARRATIVA } from '../_shared/prompts.ts';
import { NarrativaSaida } from '../_shared/schemas.ts';

type Pedido = { servico_id?: string; estilo?: 'rapida' | 'experiencia'; momento?: string };

export async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const id = await usuarioId(req);
  if (!id) return json({ ok: false, erro: 'login' }, 401);
  const pedido = (await req.json().catch(() => ({}))) as Pedido;
  if (!pedido.servico_id) return json({ ok: false, erro: 'servico_id' }, 400);

  const db = clienteDoUsuario(req);
  const [servico, barbeiro, atuais] = await Promise.all([
    db.from('servicos').select('id, nome, preco, categoria').eq('id', pedido.servico_id).maybeSingle(),
    db.from('barbeiros').select('publico, estrategia').eq('id', id).single(),
    db.from('v_aceitacao_narrativa').select('titulo, ofertas, aceitas, taxa').eq('barbeiro_id', id).eq('servico_id', pedido.servico_id),
  ]);
  if (!servico.data || !barbeiro.data) return json({ ok: false, erro: 'servico' }, 404);
  const nomeServico: string = servico.data.nome;

  const admin = clienteAdmin();
  const bloqueio = await consumir(admin, id, 'narrativa');
  if (bloqueio) return json({ ok: false, erro: bloqueio }, bloqueio === 'plano' ? 403 : 429);

  const estilo = pedido.estilo ?? (['A', 'B'].includes(barbeiro.data.publico) ? 'experiencia' : 'rapida');
  const momento = pedido.momento ?? 'durante';
  const saida = await gerarJSON(NarrativaSaida, NARRATIVA, {
    servico: servico.data.nome, preco: servico.data.preco, publico: barbeiro.data.publico,
    estrategia: barbeiro.data.estrategia, estilo, momento, narrativas_atuais: atuais.data ?? [],
  }, { esforco: 'low', mock: () => mockNarrativa(nomeServico, estilo) });
  if (!saida) return json({ ok: false, erro: 'saida_invalida' }, 502);

  const { data, error } = await db.from('narrativas').insert({
    barbeiro_id: id, servico_id: servico.data.id, publico: barbeiro.data.publico, estilo, momento,
    titulo: saida.titulo, texto: saida.texto, criada_pela_ia: true, ativa: false,
  }).select().single();
  if (error) return json({ ok: false, erro: 'gravar' }, 500);
  return json({ ok: true, narrativa: data });
}
