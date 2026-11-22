// Shared shape of the store bridge (loja.native.ts on phones, loja.ts on web).
import type { Plano } from './plano';

export type PlanoPago = Exclude<Plano, 'gratis' | 'dev'>;   // 'dev' is never sold
export type Periodo = 'mensal' | 'anual';

/** One subscription option as the store sells it (prices in the store's own words). */
export type Oferta = {
  id: string;
  plano: PlanoPago;
  periodo: Periodo;
  /** Store price string, e.g. "R$ 19,90". Renewal price is the same. */
  preco: string;
  /** Free trial length in days, when the store offers one. */
  testeDias: number | null;
};

export type ResultadoCompra = 'comprou' | 'desistiu';

export type Loja = 'app_store' | 'play_store' | 'stripe' | 'manual' | null;
