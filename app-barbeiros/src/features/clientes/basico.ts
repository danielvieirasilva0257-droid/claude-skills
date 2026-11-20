// Minimal client lookup used by the free plan (name only, for scheduling).
// The full client file (ficha) is a paid feature (Phase 3).
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useUsuarioId } from '@/features/conta/barbeiro';
import { supabase } from '@/lib/supabase';

export type ClienteResumo = { id: string; nome: string };

export function useClientesResumo() {
  const uid = useUsuarioId();
  return useQuery({
    queryKey: ['clientes_resumo', uid],
    enabled: uid !== null,
    queryFn: async () => {
      const { data, error } = await supabase.from('clientes').select('id, nome').eq('barbeiro_id', uid!).order('nome');
      if (error) throw error;
      return (data ?? []) as ClienteResumo[];
    },
  });
}

export function useCriarCliente() {
  const uid = useUsuarioId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (nome: string) => {
      const { data, error } = await supabase.from('clientes').insert({ barbeiro_id: uid!, nome: nome.trim() })
        .select('id, nome').single<ClienteResumo>();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clientes_resumo'] }),
  });
}
