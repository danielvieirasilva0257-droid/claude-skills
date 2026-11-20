import { useQuery } from '@tanstack/react-query';

import { useSessao } from '@/features/auth/sessao';
import type { Plano } from '@/lib/plano';
import { supabase } from '@/lib/supabase';

export type Publico = 'A' | 'B' | 'C' | 'D';
export type Estrategia = 'volume' | 'ticket' | 'equilibrado';
export type ModeloTrabalho = 'comissionado' | 'aluguel_cadeira' | 'autonomo' | 'dono' | 'salao_parceiro';
export type FormaPagamento = 'pix' | 'dinheiro' | 'debito' | 'credito' | 'outro';

export type Barbeiro = {
  id: string;
  nome: string;
  cidade: string | null;
  modelo_trabalho: ModeloTrabalho;
  publico: Publico;
  estrategia: Estrategia;
  preco_corte: number | string | null;
  onboarding_concluido: boolean;
  taxa_debito: number | string;
  taxa_credito: number | string;
  pagamento_padrao: FormaPagamento;
  ia_perfil: Record<string, unknown>;
  ia_personalidade: { tom: 'parceiro' | 'formal' | 'descontraido'; emojis: boolean; assinatura: string; evitar: string[] } | null;
  fuso: string;
};

export const NOME_MODELO: Record<ModeloTrabalho, string> = {
  comissionado: 'Comissionado',
  aluguel_cadeira: 'Alugo a cadeira',
  autonomo: 'Autônomo / MEI',
  dono: 'Dono da barbearia',
  salao_parceiro: 'Salão parceiro',
};

export const NOME_ESTRATEGIA: Record<Estrategia, string> = {
  volume: 'Agenda cheia',
  ticket: 'Ticket alto',
  equilibrado: 'Equilibrado',
};

export const NOME_PAGAMENTO: Record<FormaPagamento, string> = {
  pix: 'Pix',
  dinheiro: 'Dinheiro',
  debito: 'Débito',
  credito: 'Crédito',
  outro: 'Outro',
};

export function useUsuarioId(): string | null {
  return useSessao((s) => s.session?.user.id ?? null);
}

export function useBarbeiro() {
  const id = useUsuarioId();
  return useQuery({
    queryKey: ['barbeiro', id],
    enabled: id !== null,
    queryFn: async (): Promise<Barbeiro> => {
      const { data, error } = await supabase.from('barbeiros').select('*').eq('id', id!).single<Barbeiro>();
      if (error) throw error;
      return data;
    },
  });
}

export function usePlano() {
  const id = useUsuarioId();
  return useQuery({
    queryKey: ['plano', id],
    enabled: id !== null,
    queryFn: async (): Promise<Plano> => {
      const { data, error } = await supabase.rpc('meu_plano');
      if (error) throw error;
      return data as Plano;
    },
  });
}
