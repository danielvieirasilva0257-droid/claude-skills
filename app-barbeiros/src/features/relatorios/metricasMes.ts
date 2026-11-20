import { useQuery } from '@tanstack/react-query';

import { useUsuarioId } from '@/features/conta/barbeiro';
import { inicioDoMes } from '@/lib/format';
import { supabase } from '@/lib/supabase';

/** One row of the `v_metricas_mes` view (numeric columns may arrive as strings). */
export type MetricasMes = {
  barbeiro_id: string;
  mes: string;
  atendimentos: number;
  clientes_unicos: number;
  clientes_novos: number;
  faturamento: number | string;
  faturamento_servicos: number | string;
  faturamento_produtos: number | string;
  ticket_medio: number | string;
  ratio_servicos_por_cliente: number | string;
  servicos_feitos: number;
  extras_feitos: number;
  produtos_vendidos: number;
  produtos_por_cliente: number | string;
  pct_atendimentos_com_extra: number | string;
  pct_atendimentos_com_produto: number | string;
};

/**
 * Month metrics straight from the database (the database calculates, the app
 * only shows). RLS limits the rows to the signed-in barber.
 */
export function useMetricasMes(mes: string = inicioDoMes()) {
  const uid = useUsuarioId();
  return useQuery({
    queryKey: ['v_metricas_mes', uid, mes],
    enabled: uid !== null,
    queryFn: async (): Promise<MetricasMes | null> => {
      const { data, error } = await supabase
        .from('v_metricas_mes')
        .select('*')
        .eq('barbeiro_id', uid!)
        .eq('mes', mes)
        .maybeSingle<MetricasMes>();
      if (error) throw error;
      return data;
    },
  });
}
