import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useUsuarioId } from '@/features/conta/barbeiro';
import { supabase } from '@/lib/supabase';

export type Categoria = 'principal' | 'adicional' | 'experiencia';

export type Servico = {
  id: string;
  nome: string;
  categoria: Categoria;
  preco: number | string;
  duracao_min: number;
  custo_insumo: number | string;
  intervalo_recomendado_dias: number | null;
  ativo: boolean;
};

export type Combo = {
  id: string;
  servico_base_id: string;
  servico_extra_id: string;
  simultaneo: boolean;
  tempo_extra_min: number;
  facilidade: number;
  como_executar: string | null;
};

export type Produto = { id: string; nome: string; preco: number | string; custo: number | string; ativo: boolean };

export const NOME_CATEGORIA: Record<Categoria, string> = {
  principal: 'Principal',
  adicional: 'Adicional',
  experiencia: 'Experiência',
};

export function useServicos() {
  const uid = useUsuarioId();
  return useQuery({
    queryKey: ['servicos', uid],
    enabled: uid !== null,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('servicos')
        .select('*')
        .eq('barbeiro_id', uid!)
        .order('categoria')
        .order('preco', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Servico[];
    },
  });
}

export function useProdutos() {
  const uid = useUsuarioId();
  return useQuery({
    queryKey: ['produtos', uid],
    enabled: uid !== null,
    queryFn: async () => {
      const { data, error } = await supabase.from('produtos').select('*').eq('barbeiro_id', uid!).eq('ativo', true).order('nome');
      if (error) throw error;
      return (data ?? []) as Produto[];
    },
  });
}

export function useCombos() {
  const uid = useUsuarioId();
  return useQuery({
    queryKey: ['combos', uid],
    enabled: uid !== null,
    queryFn: async () => {
      const { data, error } = await supabase.from('combinacoes_servico').select('*').eq('barbeiro_id', uid!);
      if (error) throw error;
      return (data ?? []) as Combo[];
    },
  });
}

export type ServicoForm = {
  id?: string;
  nome: string;
  categoria: Categoria;
  preco: number;
  duracao_min: number;
  intervalo_recomendado_dias: number | null;
  ativo: boolean;
};

export function useSalvarServico() {
  const uid = useUsuarioId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (s: ServicoForm) => {
      const linha = { ...s, barbeiro_id: uid! };
      const { error } = s.id
        ? await supabase.from('servicos').update(linha).eq('id', s.id)
        : await supabase.from('servicos').insert(linha);
      if (error) throw new Error(/duplicate key/.test(error.message) ? 'Já existe um serviço com esse nome.' : error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['servicos'] }),
  });
}

export function useSalvarCombo() {
  const uid = useUsuarioId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (c: { base: string; extra: string; simultaneo: boolean; tempo_extra_min: number; ligado: boolean }) => {
      if (!c.ligado) {
        const { error } = await supabase.from('combinacoes_servico').delete()
          .eq('servico_base_id', c.base).eq('servico_extra_id', c.extra);
        if (error) throw error;
        return;
      }
      const { error } = await supabase.from('combinacoes_servico').upsert(
        { barbeiro_id: uid!, servico_base_id: c.base, servico_extra_id: c.extra, simultaneo: c.simultaneo,
          tempo_extra_min: c.simultaneo ? 0 : c.tempo_extra_min },
        { onConflict: 'servico_base_id,servico_extra_id' },
      );
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['combos'] }),
  });
}
