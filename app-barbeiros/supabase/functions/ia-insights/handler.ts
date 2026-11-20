// ia-insights: the database detects signals (sinais_insights), the LLM only
// writes title, why and action. Up to 3 per barber per day, saved in ia_insights.
// Called by the app (barber's token) or by the daily cron (service role, {"todos": true}).
import { clienteAdmin, consumir, cors, ehServico, json, usuarioId } from '../_shared/http.ts';
import { gerarJSON } from '../_shared/llm.ts';
import { mockInsights, type Sinal } from '../_shared/mock.ts';
import { INSIGHTS } from '../_shared/prompts.ts';
import { InsightsSaida } from '../_shared/schemas.ts';
import type { SupabaseClient } from '../_shared/deps.ts';

type Sinais = { poucos_dados: boolean; total_ofertas: number; sinais: Sinal[] };

export async function gerarInsights(admin: SupabaseClient, barbeiro: string) {
  const [s, c] = await Promise.all([
    admin.rpc('sinais_insights', { p_barbeiro: barbeiro }),
    admin.rpc('contexto_ia', { p_barbeiro: barbeiro }),
  ]);
  if (s.error || c.error) return { barbeiro, gerados: 0, erro: 'dados' };
  const dados = s.data as Sinais;
  if (dados.sinais.length === 0) return { barbeiro, gerados: 0 };

  const contexto = c.data as Record<string, unknown>;
  const entrada = {
    publico: contexto.publico,
    estrategia: contexto.estrategia,
    poucos_dados: dados.poucos_dados,
    sinais: dados.sinais.map((sinal, id) => ({ id, ...sinal })),
    contexto,
  };
  const saida = await gerarJSON(InsightsSaida, INSIGHTS, entrada, {
    esforco: 'low',
    mock: () => mockInsights(dados.sinais, dados.poucos_dados),
  });
  if (!saida) return { barbeiro, gerados: 0, erro: 'saida_invalida' };

  const vistos = new Set<number>();
  const linhas = saida.insights
    .filter((i) => i.sinal_id < dados.sinais.length && !vistos.has(i.sinal_id) && vistos.add(i.sinal_id))
    .map((i) => {
      const sinal = dados.sinais[i.sinal_id]!;
      // The number is the database's, never the LLM's.
      return { barbeiro_id: barbeiro, tipo: sinal.tipo, titulo: i.titulo, numero: sinal.numero, porque: i.porque,
        acao: i.acao, botao: i.botao, sinal: sinal.sinal };
    });

  const hoje = new Date(Date.now() - 3 * 3600_000).toISOString().slice(0, 10);
  await admin.from('ia_insights').delete().eq('barbeiro_id', barbeiro).gte('gerado_em', `${hoje}T03:00:00Z`);
  const { error } = await admin.from('ia_insights').insert(linhas);
  return error ? { barbeiro, gerados: 0, erro: 'gravar' } : { barbeiro, gerados: linhas.length };
}

export async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const admin = clienteAdmin();
  const corpo = await req.json().catch(() => ({})) as { todos?: boolean };

  if (ehServico(req) && corpo.todos) {
    // Paid plans in force, including barbers on a Barbearias team (0006).
    const { data } = await admin.rpc('barbeiros_por_plano', { p_planos: ['pago', 'premium', 'plus', 'barbearias'] });
    const resultados = [];
    for (const barbeiro_id of (data ?? []) as string[]) resultados.push(await gerarInsights(admin, barbeiro_id));
    return json({ ok: true, resultados });
  }

  const id = await usuarioId(req);
  if (!id) return json({ ok: false, erro: 'login' }, 401);
  const bloqueio = await consumir(admin, id, 'insights');
  if (bloqueio) return json({ ok: false, erro: bloqueio }, bloqueio === 'plano' ? 403 : 429);
  return json({ ok: true, ...(await gerarInsights(admin, id)) });
}
