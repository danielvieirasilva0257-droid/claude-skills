// Subscription state (minha_assinatura, from the database) and the store
// offers (prices as the store sells them). After a purchase the plan only
// changes when the RevenueCat webhook reaches the database, so we poll a
// few times instead of trusting the phone.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useUsuarioId } from '@/features/conta/barbeiro';
import { carregarOfertas, comprar, lojaDisponivel, restaurarCompras } from '@/lib/loja';
import type { Loja, Oferta } from '@/lib/loja-tipos';
import type { Plano } from '@/lib/plano';
import { supabase } from '@/lib/supabase';

export type MinhaAssinatura = {
  plano: Plano;
  plano_efetivo: Plano;
  status: 'ativa' | 'teste' | 'cancelada' | 'expirada';
  periodo: 'mensal' | 'anual' | null;
  renova_em: string | null;
  cancela_no_fim: boolean;
  provedor: string | null;
  loja: Loja;
  teste_ate: string | null;
  problema_cobranca: boolean;
  pela_equipe: boolean;
};

export function useMinhaAssinatura() {
  const uid = useUsuarioId();
  return useQuery({
    queryKey: ['assinatura', uid],
    enabled: uid !== null,
    queryFn: async () => {
      const { data, error } = await supabase.rpc('minha_assinatura');
      if (error) throw new Error(error.message);
      return data as MinhaAssinatura | null;
    },
  });
}

export function useOfertas() {
  const uid = useUsuarioId();
  return useQuery({
    queryKey: ['ofertas', uid],
    enabled: uid !== null && lojaDisponivel,
    staleTime: 10 * 60_000,
    queryFn: carregarOfertas,
  });
}

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useComprar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (oferta: Oferta) => {
      const r = await comprar(oferta);
      if (r === 'desistiu') return r;
      // Webhook usually lands in a few seconds; read the database again until the plan changes.
      for (let i = 0; i < 6; i++) {
        await qc.invalidateQueries({ queryKey: ['plano'] });
        await qc.invalidateQueries({ queryKey: ['assinatura'] });
        const plano = qc.getQueriesData<Plano>({ queryKey: ['plano'] })[0]?.[1];
        if (plano === oferta.plano) break;
        await esperar(1500);
      }
      return r;
    },
  });
}

export function useRestaurar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await restaurarCompras();
      await esperar(1500);
      await Promise.all(['plano', 'assinatura'].map((k) => qc.invalidateQueries({ queryKey: [k] })));
    },
  });
}

/** Date written as "20/12" (trial end, renewal). */
export function diaCurto(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'America/Sao_Paulo' }).format(new Date(iso));
}
