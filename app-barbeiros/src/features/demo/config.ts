// Demo mode (EXPO_PUBLIC_DEMO=1): the app answers from a recording of the
// local database with the test accounts, so a phone works with no server.
// Nothing is saved; the screens show the seed data, shifted to today.
export const MODO_DEMO = process.env.EXPO_PUBLIC_DEMO === '1';

/** Fake address used by the Supabase client in demo mode (never reached). */
export const URL_DEMO = 'https://demonstracao.app-barbeiros.invalid';

export const CONTAS_DEMO = [
  { id: 'b0b0b0b0-0000-4000-8000-000000000001', email: 'barbeiro.teste@example.com', nome: 'Barbeiro Teste', rotulo: 'Entrar como barbeiro', detalhe: 'Premium Plus, com 3 meses de atendimentos' },
  { id: 'b0b0b0b0-0000-4000-8000-000000000003', email: 'dono.teste@example.com', nome: 'Dono Teste', rotulo: 'Entrar como dono da barbearia', detalhe: 'Plano Barbearias, com o Barbeiro Teste na equipe' },
] as const;
