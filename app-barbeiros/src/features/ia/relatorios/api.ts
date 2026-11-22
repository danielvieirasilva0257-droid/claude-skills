// Reports the AI made (relatorios_ia): the list and one page. The numbers in
// them came from the database when the report was made.
import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export type ResumoRelatorio = { id: string; titulo: string; periodo: string | null; criado_em: string };
export type RelatorioIA = ResumoRelatorio & { html: string };

export function useRelatoriosIA() {
  return useQuery({
    queryKey: ['relatorios_ia'],
    queryFn: async () => {
      const { data, error } = await supabase.from('relatorios_ia').select('id, titulo, periodo, criado_em').order('criado_em', { ascending: false }).limit(30);
      if (error) throw error;
      return (data ?? []) as ResumoRelatorio[];
    },
  });
}

export function useRelatorioIA(id: string | undefined) {
  return useQuery({
    queryKey: ['relatorios_ia', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase.from('relatorios_ia').select('id, titulo, periodo, criado_em, html').eq('id', id!).single();
      if (error) throw error;
      return data as RelatorioIA;
    },
  });
}
