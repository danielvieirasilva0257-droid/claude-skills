// ia-entrevista: the 8 first-use answers become the barber's AI profile and
// the service journey with one suggestion per step. Client names are masked.
import { criarAnonimizador } from '../_shared/anonimizar.ts';
import { clienteAdmin, clienteDoUsuario, consumir, cors, json, usuarioId } from '../_shared/http.ts';
import { gerarJSON } from '../_shared/llm.ts';
import { mockEntrevista } from '../_shared/mock.ts';
import { ENTREVISTA } from '../_shared/prompts.ts';
import { EntrevistaSaida } from '../_shared/schemas.ts';

export const PERGUNTAS = [
  'Quanto você cobra no corte e quantos clientes atende por dia?',
  'Seu foco agora é agenda cheia ou ticket maior?',
  'Como é o atendimento, da chegada do cliente até a saída?',
  'O que muda entre a primeira visita e as seguintes?',
  'Que extras você faz e quais dá para fazer ao mesmo tempo?',
  'Que experiência você oferece (bebida, toalha quente, conversa)?',
  'Como você chama o cliente de volta depois?',
  'Como você consegue clientes novos?',
];

export async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const id = await usuarioId(req);
  if (!id) return json({ ok: false, erro: 'login' }, 401);
  const { respostas } = (await req.json().catch(() => ({}))) as { respostas?: string[] };
  if (!Array.isArray(respostas) || respostas.length !== 8 || respostas.some((r) => typeof r !== 'string')) {
    return json({ ok: false, erro: 'respostas' }, 400);
  }
  const bloqueio = await consumir(clienteAdmin(), id, 'entrevista');
  if (bloqueio) return json({ ok: false, erro: bloqueio }, bloqueio === 'plano' ? 403 : 429);

  const db = clienteDoUsuario(req);
  const { data: clientes } = await db.from('clientes').select('id, nome').eq('barbeiro_id', id);
  const anon = criarAnonimizador(clientes ?? []);
  const limpas = respostas.map((r) => anon.anonimizar(r.trim().slice(0, 600)));

  const saida = await gerarJSON(EntrevistaSaida, ENTREVISTA,
    { perguntas_e_respostas: PERGUNTAS.map((p, i) => ({ pergunta: p, resposta: limpas[i] })) },
    { esforco: 'medium', mock: () => mockEntrevista(limpas) });
  if (!saida) return json({ ok: false, erro: 'saida_invalida' }, 502);

  const perfil = { respostas: limpas, resumo: saida.resumo, entrevistado_em: new Date().toISOString() };
  const { error: e1 } = await db.from('barbeiros').update({ ia_perfil: perfil }).eq('id', id);
  await db.from('jornada_etapas').delete().eq('barbeiro_id', id);
  const { error: e2 } = await db.from('jornada_etapas').insert(saida.etapas.map((e, i) => ({
    barbeiro_id: id, ordem: i + 1, etapa: e.etapa, aplica_a: e.aplica_a, como_faz_hoje: e.como_faz_hoje, sugestao_ia: e.sugestao_ia,
  })));
  if (e1 || e2) return json({ ok: false, erro: 'gravar' }, 500);
  return json({ ok: true, resumo: saida.resumo, etapas: saida.etapas });
}
