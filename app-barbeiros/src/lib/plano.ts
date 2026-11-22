// Which screens each plan unlocks (ESPECIFICACAO.md sections 1 and 8).
// The barber's plan itself is read from the database (app_assinatura);
// the app never decides the plan, only what to show.

// 'dev': developer account (Daniel, 22/11/2026), everything unlocked, never sold.
export type Plano = 'gratis' | 'pago' | 'premium' | 'plus' | 'barbearias' | 'dev';

export type Recurso =
  // Grátis
  | 'agenda'
  | 'lancamentos'
  | 'servicos'
  | 'perfil'
  // Pago
  | 'clientes'
  | 'gastos'
  | 'financeiro'
  | 'meta'
  | 'relatorios'
  | 'insights'
  | 'chat'
  | 'coach'
  | 'comissao'
  | 'mei'
  // Premium
  | 'expediente'
  | 'whatsapp'
  | 'automacoes'
  | 'mensagens'
  // Premium Plus
  | 'instagram'
  | 'prospeccao'
  | 'personalidade'
  // Barbearias
  | 'barbearia';

export const NOME_PLANO: Record<Plano, string> = {
  gratis: 'Grátis',
  pago: 'Pago',
  premium: 'Premium',
  plus: 'Premium Plus',
  barbearias: 'Barbearias',
  dev: 'Desenvolvedor',
};

export const PRECO_PLANO: Record<Plano, string> = {
  gratis: 'R$ 0',
  pago: 'R$ 19,90/mês (anual R$ 179)',
  premium: 'R$ 59,90/mês',
  plus: 'R$ 119,90/mês',
  barbearias: 'R$ 179/mês + R$ 39 por barbeiro a partir do 3º',
  dev: 'Conta de desenvolvedor: tudo liberado',
};

const GRATIS: readonly Recurso[] = ['agenda', 'lancamentos', 'servicos', 'perfil'];
const PAGO: readonly Recurso[] = [
  ...GRATIS,
  'clientes',
  'gastos',
  'financeiro',
  'meta',
  'relatorios',
  'insights',
  'chat',
  'coach',
  'comissao',
  'mei',
];
const PREMIUM: readonly Recurso[] = [...PAGO, 'expediente', 'whatsapp', 'automacoes', 'mensagens'];
const PLUS: readonly Recurso[] = [...PREMIUM, 'instagram', 'prospeccao', 'personalidade'];
// Barbearias: everything up to Premium for the team, plus the owner's panel.
const BARBEARIAS: readonly Recurso[] = [...PREMIUM, 'barbearia'];
// Developer: everything (Premium Plus and the owner's panel).
const DEV: readonly Recurso[] = [...PLUS, 'barbearia'];

const LIBERA: Record<Plano, ReadonlySet<Recurso>> = {
  gratis: new Set(GRATIS),
  pago: new Set(PAGO),
  premium: new Set(PREMIUM),
  plus: new Set(PLUS),
  barbearias: new Set(BARBEARIAS),
  dev: new Set(DEV),
};

/** true when the plan unlocks the feature. */
export function libera(plano: Plano, recurso: Recurso): boolean {
  // A plan this version does not know (a newer server) unlocks nothing instead of crashing.
  return LIBERA[plano]?.has(recurso) ?? false;
}

/** Cheapest plan that unlocks the feature (shown on the lock). */
export function planoNecessario(recurso: Recurso): Exclude<Plano, 'gratis' | 'dev'> {
  if (recurso === 'barbearia') return 'barbearias';
  for (const p of ['pago', 'premium', 'plus'] as const) {
    if (LIBERA[p].has(recurso)) return p;
  }
  return 'plus';
}

/** Monthly marketing message allowance (Premium: 100). */
export function limiteMensagensMarketing(plano: Plano): number {
  return plano === 'premium' || plano === 'plus' || plano === 'barbearias' || plano === 'dev' ? 100 : 0;
}
