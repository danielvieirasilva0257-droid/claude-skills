// Data of the paid screens. Every number comes ready from the database
// (migration 0004); the app formats and draws.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useUsuarioId } from '@/features/conta/barbeiro';
import { chamarFuncao } from '@/lib/funcoes';
import { supabase } from '@/lib/supabase';

type N = number | string;

async function rpc<T>(nome: string, args?: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.rpc(nome, args);
  if (error) throw new Error(error.message);
  return data as T;
}

function useUid() {
  return useUsuarioId();
}

// ---------- Clientes ----------
export type ClienteLista = {
  id: string; nome: string; apelido: string | null; telefone: string | null; status: string; origem: string | null;
  pode_receber_oferta: boolean; aceita_contato: boolean; visitas: number; ultima_visita: string | null;
  intervalo_medio_dias: N | null; ticket_medio: N | null; pct_visitas_com_extra: N | null; dias_sem_vir: number | null;
  sumido: boolean; proximo_horario: string | null; servicos_na_hora: number;
};

export function useClientesLista() {
  const uid = useUid();
  return useQuery({
    queryKey: ['clientes_lista', uid],
    enabled: uid !== null,
    queryFn: async () => {
      const { data, error } = await supabase.from('v_clientes_lista').select('*').eq('barbeiro_id', uid!).order('nome');
      if (error) throw error;
      return (data ?? []) as ClienteLista[];
    },
  });
}

export type Ficha = {
  cliente: ClienteLista & Record<string, unknown>;
  servicos: { servico: string; ultima_vez: string; vezes: number; intervalo_dias: number | null; dias_desde: number; na_hora: boolean }[];
  historico: { id: string; inicio: string; status: string; itens: { valor: N; servico: { nome: string } | null; produto: { nome: string } | null }[] }[];
};

export function useFicha(id: string) {
  const uid = useUid();
  return useQuery({
    queryKey: ['ficha', uid, id],
    enabled: uid !== null,
    queryFn: async (): Promise<Ficha> => {
      const [lista, base, servicos, historico] = await Promise.all([
        supabase.from('v_clientes_lista').select('*').eq('id', id).single(),
        supabase.from('clientes').select('*').eq('id', id).single(),
        supabase.from('v_cliente_servico_status').select('*').eq('cliente_id', id).order('ultima_vez', { ascending: false }),
        supabase.from('atendimentos').select('id, inicio, status, itens:atendimento_itens(valor, servico:servicos(nome), produto:produtos(nome))')
          .eq('cliente_id', id).order('inicio', { ascending: false }).limit(20),
      ]);
      const erro = lista.error ?? base.error ?? servicos.error ?? historico.error;
      if (erro) throw erro;
      return {
        cliente: { ...(base.data as Record<string, unknown>), ...(lista.data as ClienteLista) },
        servicos: (servicos.data ?? []) as Ficha['servicos'],
        historico: (historico.data ?? []) as unknown as Ficha['historico'],
      };
    },
  });
}

export function useSalvarCliente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (c: { id: string } & Record<string, unknown>) => {
      const { id, ...campos } = c;
      const { error } = await supabase.from('clientes').update(campos).eq('id', id);
      if (error) throw new Error('Não salvou');
    },
    onSuccess: () => Promise.all([qc.invalidateQueries({ queryKey: ['ficha'] }), qc.invalidateQueries({ queryKey: ['clientes_lista'] })]),
  });
}

// ---------- Gastos ----------
export type Gasto = { id: string; data: string; categoria: string; valor: N; recorrente: boolean; descricao: string | null };

export function useGastos(inicio: string, fim: string) {
  const uid = useUid();
  return useQuery({
    queryKey: ['gastos', uid, inicio, fim],
    enabled: uid !== null,
    queryFn: async () => {
      const { data, error } = await supabase.from('gastos').select('*').eq('barbeiro_id', uid!)
        .gte('data', inicio).lte('data', fim).order('data', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Gasto[];
    },
  });
}

export function useSalvarGasto() {
  const uid = useUid();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (g: Omit<Gasto, 'id' | 'valor'> & { id?: string; valor: number }) => {
      const linha = { ...g, barbeiro_id: uid! };
      const { error } = g.id ? await supabase.from('gastos').update(linha).eq('id', g.id) : await supabase.from('gastos').insert(linha);
      if (error) throw new Error('Não salvou');
    },
    onSuccess: () => Promise.all(['gastos', 'financeiro', 'resumo_dia'].map((k) => qc.invalidateQueries({ queryKey: [k] }))),
  });
}

export function useApagarGasto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('gastos').delete().eq('id', id);
      if (error) throw new Error('Não apagou');
    },
    onSuccess: () => Promise.all(['gastos', 'financeiro', 'resumo_dia'].map((k) => qc.invalidateQueries({ queryKey: [k] }))),
  });
}

// ---------- Financeiro ----------
export type LinhaFinanceiro = { periodo: string; atendimentos: number; faturamento: N; taxas: N; insumos: N; gastos: N; lucro: N };
export type Agrupar = 'day' | 'week' | 'month' | 'total';

export function useFinanceiro(inicio: string, fim: string, agrupar: Agrupar) {
  const uid = useUid();
  return useQuery({
    queryKey: ['financeiro', uid, inicio, fim, agrupar],
    enabled: uid !== null,
    queryFn: () => rpc<LinhaFinanceiro[]>('financeiro', { p_inicio: inicio, p_fim: fim, p_agrupar: agrupar }),
  });
}

// ---------- Meta e conquistas ----------
export type ProgressoMeta = {
  mes: string; meta: N | null; sugerida: N | null; aviso_sugestao: string | null; realizado: N; pct: N | null;
  falta: N | null; cortes_faltando: number | null; dias_restantes: number; por_dia_trabalhado: N | null;
  projecao: N | null; em_risco: boolean;
};

export function useMeta(mes?: string) {
  const uid = useUid();
  return useQuery({
    queryKey: ['meta', uid, mes ?? 'atual'],
    enabled: uid !== null,
    queryFn: () => rpc<ProgressoMeta>('progresso_meta', mes ? { p_mes: mes } : {}),
  });
}

export function useDefinirMeta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { mes: string; valor: number; sugerida: boolean }) =>
      rpc<void>('definir_meta', { p_mes: v.mes, p_valor: v.valor, p_sugerida: v.sugerida }),
    onSuccess: () => Promise.all([qc.invalidateQueries({ queryKey: ['meta'] }), qc.invalidateQueries({ queryKey: ['conquistas'] })]),
  });
}

export type Conquista = { tipo: 'meta_50' | 'meta_100' | 'recorde_mes' | 'primeiro_caixa'; referencia: string; valor: N | null };

export function useConquistas() {
  const uid = useUid();
  return useQuery({
    queryKey: ['conquistas', uid],
    enabled: uid !== null,
    queryFn: () => rpc<Conquista[]>('verificar_conquistas'),
  });
}

export function useCelebrar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (c: Conquista) => rpc<void>('celebrar_conquista', { p_tipo: c.tipo, p_referencia: c.referencia }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['conquistas'] }),
  });
}

// ---------- Relatórios ----------
export type Relatorio = {
  mes: string;
  atual: Record<string, N> | null;
  anterior: Record<string, N> | null;
  /** vs the same period of last month (day 1 to today; whole month for closed months). */
  variacao: { faturamento: N | null; ticket_medio: N | null; atendimentos: N | null; ratio: N | null };
  /** Average of the 3 previous months, each in the same period. */
  media: { meses: number; faturamento: N; atendimentos: N; ticket_medio: N; ratio_servicos_por_cliente: N } | null;
  vs_media: { faturamento: N | null; ticket_medio: N | null; atendimentos: N | null; ratio: N | null };
  comparacao: { ate_dia: number | null; meses_media: number };
  /** The 4 months side by side (3 before + this one), same period, for the chart. */
  meses: { mes: string; fim: string; atual: boolean; faturamento: N; atendimentos: number; vs_media: N | null }[];
  saude: { taxa_segunda_visita: N | null; taxa_reagendamento: N | null; taxa_faltas: N | null; ocupacao: N | null;
    clientes_sumidos: number; pct_com_extra: N | null; pct_com_produto: N | null } | null;
  mix_servicos: { nome: string; qtd: number; qtd_mes_anterior: number; faturamento: N }[];
  mix_produtos: { nome: string; qtd: number; qtd_mes_anterior: number; faturamento: N }[];
  aceitacao: { item: string; ofertas: number; aceitas: number; taxa: N; poucos_dados: boolean }[];
  mapa_calor: { dia_semana: number; hora: number; atendimentos: number }[];
  mapa_max: number | null;
};

export function useRelatorio(mes?: string) {
  const uid = useUid();
  return useQuery({
    queryKey: ['relatorio', uid, mes ?? 'atual'],
    enabled: uid !== null,
    queryFn: () => rpc<Relatorio>('relatorio_mes', mes ? { p_mes: mes } : {}),
  });
}

export type ResumoSemana = {
  /** Monday to today vs Monday to the same weekday of last week; average of the 4 weeks before. */
  inicio: string; ate_dia_semana: number; faturamento: N; faturamento_anterior: N; variacao: N | null;
  media: N | null; semanas_media: number; vs_media: N | null; atendimentos: number;
  atendimentos_anterior: number; lucro: N; melhor_dia: { dia: string; faturamento: N } | null; ofertas: number; ofertas_aceitas: number;
};

export function useResumoSemana() {
  const uid = useUid();
  return useQuery({ queryKey: ['semana', uid], enabled: uid !== null, queryFn: () => rpc<ResumoSemana>('resumo_semana') });
}

// ---------- Comissão e extrato ----------
export type Faixa = { de: N; ate: N | null; pct: N };
export type Regra = {
  id: string; tipo: 'fixa' | 'escalonada'; metodo_faixa: 'total' | 'marginal'; base: 'bruto' | 'liquido_taxa' | 'liquido_taxa_insumo';
  pct_servico_fixo: N | null; pct_produto: N; aluguel_cadeira_mensal: N; vigente_desde: string; faixas: Faixa[];
};
export type Extrato = {
  mes: string; faturamento_servicos: N; faturamento_produtos: N; taxas: N; insumos: N; base_servicos: N;
  comissao_servicos: N; comissao_produtos: N; vales: N; aluguel: N; liquido: N; regra: Regra | null;
  pct_atual: N | null; pct_proxima: N | null; falta_proxima: N | null;
  vales_lista: { id: string; data: string; valor: N; motivo: string | null }[];
};

export function useExtrato(mes?: string) {
  const uid = useUid();
  return useQuery({
    queryKey: ['extrato', uid, mes ?? 'atual'],
    enabled: uid !== null,
    queryFn: () => rpc<Extrato>('extrato_completo', mes ? { p_mes: mes } : {}),
  });
}

export function useSalvarRegra() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (r: { tipo: Regra['tipo']; metodo: Regra['metodo_faixa']; base: Regra['base']; pctFixo: number | null;
      pctProduto: number; aluguel: number; faixas: { de: number; ate: number | null; pct: number }[] }) =>
      rpc<string>('salvar_regra_comissao', {
        p_tipo: r.tipo, p_metodo: r.metodo, p_base: r.base, p_pct_fixo: r.pctFixo, p_pct_produto: r.pctProduto,
        p_aluguel: r.aluguel, p_faixas: r.faixas,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['extrato'] }),
  });
}

export function useSalvarVale() {
  const uid = useUid();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (v: { data: string; valor: number; motivo: string | null }) => {
      const { error } = await supabase.from('vales').insert({ ...v, barbeiro_id: uid! });
      if (error) throw new Error('Não salvou');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['extrato'] }),
  });
}

export function useApagarVale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('vales').delete().eq('id', id);
      if (error) throw new Error('Não apagou');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['extrato'] }),
  });
}

// ---------- MEI ----------
export type Mei = { ano: number; faturamento: N; limite: N; pct: N; falta: N; alerta: 'ok' | '80' | '100';
  media_mensal: N; projecao_ano: N; das_mensal: N; das_ano: N };

export function useMei() {
  const uid = useUid();
  return useQuery({ queryKey: ['mei', uid], enabled: uid !== null, queryFn: () => rpc<Mei>('mei_ano') });
}

// ---------- IA ----------
export type InsightLinha = { id: string; gerado_em: string; tipo: string; titulo: string; numero: string | null; porque: string | null;
  acao: string | null; botao: string | null; sinal: string | null; visto: boolean; feito: boolean };

export function useInsights() {
  const uid = useUid();
  return useQuery({
    queryKey: ['insights', uid],
    enabled: uid !== null,
    queryFn: async () => {
      const { data, error } = await supabase.from('ia_insights').select('*').eq('barbeiro_id', uid!)
        .order('gerado_em', { ascending: false }).limit(3);
      if (error) throw error;
      return (data ?? []) as InsightLinha[];
    },
  });
}

export function useGerarInsights() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => chamarFuncao<{ gerados: number }>('ia-insights'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['insights'] }),
  });
}

export type Narrativa = { id: string; servico_id: string | null; produto_id: string | null; titulo: string; texto: string;
  estilo: string; momento: string; ativa: boolean; criada_pela_ia: boolean; publico: string | null };

export function useNarrativas() {
  const uid = useUid();
  return useQuery({
    queryKey: ['narrativas', uid],
    enabled: uid !== null,
    queryFn: async () => {
      const [n, a] = await Promise.all([
        supabase.from('narrativas').select('*').eq('barbeiro_id', uid!).order('criado_em', { ascending: false }),
        supabase.from('v_aceitacao_narrativa').select('narrativa_id, ofertas, aceitas').eq('barbeiro_id', uid!),
      ]);
      if (n.error || a.error) throw n.error ?? a.error;
      const placar = new Map<string, { ofertas: number; aceitas: number }>();
      for (const l of (a.data ?? []) as { narrativa_id: string; ofertas: number; aceitas: number }[]) {
        const p = placar.get(l.narrativa_id) ?? { ofertas: 0, aceitas: 0 };
        // Counts per client type are added only to show "x de y" (no money math).
        placar.set(l.narrativa_id, { ofertas: p.ofertas + l.ofertas, aceitas: p.aceitas + l.aceitas });
      }
      return ((n.data ?? []) as Narrativa[]).map((x) => ({ ...x, placar: placar.get(x.id) ?? null }));
    },
  });
}

export function useSalvarNarrativa() {
  const uid = useUid();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (n: Partial<Narrativa> & { titulo: string; texto: string }) => {
      const { error } = n.id
        ? await supabase.from('narrativas').update({ titulo: n.titulo, texto: n.texto, ativa: n.ativa }).eq('id', n.id)
        : await supabase.from('narrativas').insert({ ...n, barbeiro_id: uid! });
      if (error) throw new Error(/Limite de 4/.test(error.message) ? 'Já há 4 narrativas ativas para este serviço. Desligue uma.' : 'Não salvou');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['narrativas'] }),
  });
}

export function usePedirNarrativa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { servico_id: string; estilo?: string }) => chamarFuncao<{ narrativa: Narrativa }>('ia-narrativa', v),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['narrativas'] }),
  });
}

export function useEntrevista() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (respostas: string[]) => chamarFuncao<{ resumo: string }>('ia-entrevista', { respostas }),
    onSuccess: () => Promise.all([qc.invalidateQueries({ queryKey: ['barbeiro'] }), qc.invalidateQueries({ queryKey: ['jornada'] })]),
  });
}

export function useJornada() {
  const uid = useUid();
  return useQuery({
    queryKey: ['jornada', uid],
    enabled: uid !== null,
    queryFn: async () => {
      const { data, error } = await supabase.from('jornada_etapas').select('*').eq('barbeiro_id', uid!).order('ordem');
      if (error) throw error;
      return (data ?? []) as { id: string; etapa: string; aplica_a: string; como_faz_hoje: string | null; sugestao_ia: string | null }[];
    },
  });
}

// ---------- Ofertas quando o cliente senta ----------
export type Sugestao = { servico_id: string; servico: string; motivo: string; simultaneo: boolean; tempo_extra_min: number | null;
  preco: N; narrativa_id: string | null; narrativa_titulo: string | null; narrativa_texto: string | null;
  narrativa_taxa: N | null; narrativa_poucos_dados: boolean | null };

export function useSugerirOfertas(atendimento: string | null) {
  return useQuery({
    queryKey: ['sugerir_ofertas', atendimento],
    enabled: atendimento !== null,
    queryFn: () => rpc<Sugestao[]>('sugerir_ofertas', { p_atendimento: atendimento }),
  });
}
