// Barbearias (migration 0006): the owner's panel, team, team schedule and
// per-barber report. Every number and the plan price come from the database;
// the owner reads the team only through functions that check the role.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useUsuarioId } from '@/features/conta/barbeiro';
import type { Relatorio } from '@/features/pago/api';
import { supabase } from '@/lib/supabase';

type N = number | string;

async function rpc<T>(nome: string, args?: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.rpc(nome, args);
  if (error) throw new Error(error.message);
  return data as T;
}

export type Papel = 'dono' | 'barbeiro';
export type MinhaBarbearia = { id: string; nome: string; papel: Papel; entrou_em: string; dono: string; barbeiros: number } | null;

export type Membro = { barbeiro_id: string; nome: string; papel: Papel; entrou_em: string; atendimentos_mes: number | null };
export type Equipe = {
  barbearia: { id: string; nome: string };
  sou_dono: boolean;
  membros: Membro[];
  convites: { codigo: string; expira_em: string }[] | null;
  assentos: { barbeiros: number; inclusos: number; extras: number; valor_base: N; valor_por_extra: N; valor_mensal: N } | null;
} | null;

export type LinhaPainel = {
  barbeiro_id: string; nome: string; papel: Papel; faturamento: N; atendimentos: number; ticket_medio: N | null;
  ratio: N | null; variacao_faturamento: N | null; faturamento_anterior: N; hoje_atendimentos: number;
  hoje_faturamento: N; hoje_agendados: number; ocupacao: N | null; taxa_faltas: N | null;
};
export type Painel = {
  barbearia: { id: string; nome: string };
  mes: string;
  hoje: { faturamento: N; atendimentos: number; agendados: number };
  total: { faturamento: N; faturamento_anterior: N; atendimentos: number; ticket_medio: N | null; variacao_faturamento: N | null };
  equipe: LinhaPainel[];
};

export type ItemAgendaEquipe = {
  barbeiro_id: string; barbeiro: string; id: string; inicio: string; fim: string | null;
  status: 'agendado' | 'concluido' | 'falta' | 'cancelado'; cliente: string | null; servicos: string | null;
};

export type RelatorioBarbeiro = Relatorio & {
  barbeiro: { id: string; nome: string; papel: Papel; entrou_em: string };
  comissao: N | null;
};

const CHAVES = ['minha_barbearia', 'equipe', 'painel', 'agenda_equipe', 'relatorio_barbeiro', 'plano'];

function useInvalidarTudo() {
  const qc = useQueryClient();
  return () => Promise.all(CHAVES.map((k) => qc.invalidateQueries({ queryKey: [k] })));
}

export function useMinhaBarbearia() {
  const uid = useUsuarioId();
  return useQuery({
    queryKey: ['minha_barbearia', uid],
    enabled: uid !== null,
    queryFn: () => rpc<MinhaBarbearia>('minha_barbearia'),
  });
}

export function useEquipe(ativo = true) {
  const uid = useUsuarioId();
  return useQuery({
    queryKey: ['equipe', uid],
    enabled: uid !== null && ativo,
    queryFn: () => rpc<Equipe>('equipe_barbearia'),
  });
}

export function usePainel(ativo = true) {
  const uid = useUsuarioId();
  return useQuery({
    queryKey: ['painel', uid],
    enabled: uid !== null && ativo,
    queryFn: () => rpc<Painel>('painel_barbearia'),
  });
}

export function useAgendaEquipe(dia: string) {
  const uid = useUsuarioId();
  return useQuery({
    queryKey: ['agenda_equipe', uid, dia],
    enabled: uid !== null,
    queryFn: () => rpc<ItemAgendaEquipe[]>('agenda_equipe', { p_dia: dia }),
  });
}

export function useRelatorioBarbeiro(id: string) {
  const uid = useUsuarioId();
  return useQuery({
    queryKey: ['relatorio_barbeiro', uid, id],
    enabled: uid !== null && id.length > 0,
    queryFn: () => rpc<RelatorioBarbeiro>('relatorio_barbeiro', { p_barbeiro: id }),
  });
}

/** Short Portuguese message from the database errors (they are written for people). */
function mensagem(e: unknown, padrao: string): Error {
  const m = e instanceof Error ? e.message : '';
  return new Error(m && m.length < 80 ? m.charAt(0).toUpperCase() + m.slice(1) : padrao);
}

function useAcao<A>(nome: string, args: (a: A) => Record<string, unknown> | undefined, padrao: string) {
  const invalidar = useInvalidarTudo();
  return useMutation({
    mutationFn: (a: A) => rpc<unknown>(nome, args(a)).catch((e) => { throw mensagem(e, padrao); }),
    onSuccess: () => invalidar(),
  });
}

export const useCriarBarbearia = () => useAcao<string>('criar_barbearia', (nome) => ({ p_nome: nome }), 'Não deu para criar');
export const useRenomearBarbearia = () => useAcao<string>('renomear_barbearia', (nome) => ({ p_nome: nome }), 'Não deu para renomear');
export const useEntrarNaBarbearia = () => useAcao<string>('entrar_na_barbearia', (codigo) => ({ p_codigo: codigo }), 'Código inválido ou vencido');
export const useSairDaBarbearia = () => useAcao<void>('sair_da_barbearia', () => undefined, 'Não deu para sair');
export const useRemoverDaEquipe = () => useAcao<string>('remover_da_equipe', (id) => ({ p_barbeiro: id }), 'Não deu para remover');
export const useEncerrarBarbearia = () => useAcao<void>('encerrar_barbearia', () => undefined, 'Não deu para encerrar');
export const useCancelarConvite = () => useAcao<string>('cancelar_convite', (codigo) => ({ p_codigo: codigo }), 'Não deu para cancelar');

export function useGerarConvite() {
  const invalidar = useInvalidarTudo();
  return useMutation({
    mutationFn: () => rpc<{ codigo: string; expira_em: string }>('gerar_convite').catch((e) => { throw mensagem(e, 'Não deu para gerar'); }),
    onSuccess: () => invalidar(),
  });
}
