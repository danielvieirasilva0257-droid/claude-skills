// Agenda data. Every value (price, fee, total, profit) comes from the
// database functions in migration 0003; the app only sends choices.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { FormaPagamento } from '@/features/conta/barbeiro';
import { useUsuarioId } from '@/features/conta/barbeiro';
import { diaISO } from '@/lib/format';
import { supabase } from '@/lib/supabase';

export type StatusAtendimento = 'agendado' | 'concluido' | 'falta' | 'cancelado';

export type ItemAgenda = {
  id: string;
  inicio: string;
  fim: string | null;
  status: StatusAtendimento;
  cliente_id: string | null;
  cliente: string | null;
  servicos: string | null;
  servico_ids: string[];
  valor: number | string;
  forma_pagamento: FormaPagamento | null;
  ofertas: number;
};

export type ResumoDia = {
  dia: string;
  atendimentos: number;
  faturamento: number | string;
  taxas: number | string;
  insumos: number | string;
  gastos: number | string;
  lucro: number | string;
  agendados: number;
  caixa_fechado: boolean;
};

export type Motivo = 'tempo' | 'preco' | 'nao_precisa' | 'outra_vez' | 'outro';

export const NOME_MOTIVO: Record<Motivo, string> = {
  tempo: 'Sem tempo',
  preco: 'Preço',
  nao_precisa: 'Não precisa',
  outra_vez: 'Outra vez',
  outro: 'Outro',
};

async function rpc<T>(nome: string, args?: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.rpc(nome, args);
  if (error) throw new Error(traduzir(error.message));
  return data as T;
}

function traduzir(msg: string): string {
  if (/caixa deste dia/.test(msg)) return 'O caixa deste dia já foi fechado.';
  if (/pelo menos um serviço/.test(msg)) return 'Escolha pelo menos um serviço.';
  if (/fetch|network/i.test(msg)) return 'Sem conexão. Tente de novo.';
  return msg;
}

export function useResumoDia(dia: string = diaISO()) {
  const uid = useUsuarioId();
  return useQuery({
    queryKey: ['resumo_dia', uid, dia],
    enabled: uid !== null,
    queryFn: async () => (await rpc<ResumoDia[]>('resumo_dia', { p_dia: dia }))[0] ?? null,
  });
}

export function useAgendaDia(dia: string) {
  const uid = useUsuarioId();
  return useQuery({
    queryKey: ['agenda_dia', uid, dia],
    enabled: uid !== null,
    queryFn: () => rpc<ItemAgenda[]>('agenda_dia', { p_dia: dia }),
  });
}

/** Refresh everything that depends on appointments. */
export function useInvalidarAgenda() {
  const qc = useQueryClient();
  return () =>
    Promise.all(
      ['agenda_dia', 'resumo_dia', 'v_metricas_mes', 'proximos', 'metricas', 'financeiro', 'meta'].map((k) =>
        qc.invalidateQueries({ queryKey: [k] }),
      ),
    );
}

export function useLancar() {
  const invalidar = useInvalidarAgenda();
  return useMutation({
    mutationFn: (v: { servicos: string[]; cliente?: string | null; forma?: FormaPagamento | null;
      inicio?: string; status?: StatusAtendimento }) =>
      rpc<string>('lancar_atendimento', {
        p_servicos: v.servicos,
        p_cliente: v.cliente ?? null,
        p_forma: v.forma ?? null,
        ...(v.inicio ? { p_inicio: v.inicio } : {}),
        ...(v.status ? { p_status: v.status } : {}),
      }),
    onSuccess: invalidar,
  });
}

export function useRegistrarOferta() {
  const invalidar = useInvalidarAgenda();
  return useMutation({
    mutationFn: (v: { atendimento: string; aceitou: boolean; servico?: string; produto?: string;
      narrativa?: string | null; motivo?: Motivo | null; momento?: string }) =>
      rpc<string>('registrar_oferta', {
        p_atendimento: v.atendimento,
        p_aceitou: v.aceitou,
        p_servico: v.servico ?? null,
        p_produto: v.produto ?? null,
        p_narrativa: v.narrativa ?? null,
        p_motivo: v.motivo ?? null,
        ...(v.momento ? { p_momento: v.momento } : {}),
      }),
    onSuccess: invalidar,
  });
}

export function useMudarPagamento() {
  const invalidar = useInvalidarAgenda();
  return useMutation({
    mutationFn: (v: { atendimento: string; forma: FormaPagamento }) =>
      rpc<void>('mudar_pagamento', { p_atendimento: v.atendimento, p_forma: v.forma }),
    onSuccess: invalidar,
  });
}

export function useConcluir() {
  const invalidar = useInvalidarAgenda();
  return useMutation({
    mutationFn: (v: { atendimento: string; forma?: FormaPagamento | null }) =>
      rpc<void>('concluir_atendimento', { p_atendimento: v.atendimento, p_forma: v.forma ?? null }),
    onSuccess: invalidar,
  });
}

export function useMudarStatus() {
  const invalidar = useInvalidarAgenda();
  return useMutation({
    mutationFn: async (v: { atendimento: string; status: 'falta' | 'cancelado' }) => {
      const { error } = await supabase.from('atendimentos').update({ status: v.status }).eq('id', v.atendimento);
      if (error) throw new Error(traduzir(error.message));
    },
    onSuccess: invalidar,
  });
}

export function useApagarAtendimento() {
  const invalidar = useInvalidarAgenda();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('atendimentos').delete().eq('id', id);
      if (error) throw new Error(traduzir(error.message));
    },
    onSuccess: invalidar,
  });
}

export function useFecharCaixa() {
  const invalidar = useInvalidarAgenda();
  return useMutation({
    mutationFn: (dia: string) => rpc<{ faturamento: number; atendimentos: number }[]>('fechar_caixa', { p_dia: dia }),
    onSuccess: invalidar,
  });
}

export function useReabrirCaixa() {
  const invalidar = useInvalidarAgenda();
  return useMutation({
    mutationFn: (dia: string) => rpc<void>('reabrir_caixa', { p_dia: dia }),
    onSuccess: invalidar,
  });
}

/** Next scheduled appointments (today onward) for the home screen. */
export function useProximos(limite = 3) {
  const uid = useUsuarioId();
  return useQuery({
    queryKey: ['proximos', uid, limite],
    enabled: uid !== null,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('atendimentos')
        .select('id, inicio, cliente:clientes(nome), itens:atendimento_itens(servico:servicos(nome))')
        .eq('barbeiro_id', uid!)
        .eq('status', 'agendado')
        .gte('inicio', new Date().toISOString())
        .order('inicio')
        .limit(limite);
      if (error) throw error;
      return (data ?? []) as unknown as {
        id: string;
        inicio: string;
        cliente: { nome: string } | null;
        itens: { servico: { nome: string } | null }[];
      }[];
    },
  });
}
