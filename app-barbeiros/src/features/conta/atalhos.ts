// Screens reached from "Mais" (the rest are tabs), with the feature that
// unlocks each one.
import type { Href } from 'expo-router';

import type { Recurso } from '@/lib/plano';

export type Atalho = { rotulo: string; detalhe: string; rota: Href; recurso: Recurso; testID?: string };

export const ATALHOS: Atalho[] = [
  { rotulo: 'Insights da IA', detalhe: 'Até 3 dicas por dia com os seus números', rota: '/insights', recurso: 'insights', testID: 'atalho-insights' },
  { rotulo: 'Chat com a IA', detalhe: 'Pergunte sobre o seu resultado', rota: '/ia/chat', recurso: 'chat', testID: 'atalho-chat' },
  { rotulo: 'Coach de vendas', detalhe: 'Narrativas e mensagens prontas', rota: '/coach', recurso: 'coach', testID: 'atalho-coach' },
  { rotulo: 'Meta do mês', detalhe: 'Quanto falta e quantos cortes', rota: '/meta', recurso: 'meta', testID: 'atalho-meta' },
  { rotulo: 'Financeiro', detalhe: 'Faturamento, gastos e lucro', rota: '/financeiro', recurso: 'financeiro', testID: 'atalho-financeiro' },
  { rotulo: 'Gastos', detalhe: 'Aluguel, produtos, transporte', rota: '/gastos', recurso: 'gastos', testID: 'atalho-gastos' },
  { rotulo: 'Comissão', detalhe: 'Fixa ou escalonada', rota: '/comissao', recurso: 'comissao', testID: 'atalho-comissao' },
  { rotulo: 'Extrato do mês', detalhe: 'Do faturamento ao seu bolso, com PDF', rota: '/extrato', recurso: 'comissao', testID: 'atalho-extrato' },
  { rotulo: 'MEI', detalhe: 'Limite do ano e DAS', rota: '/mei', recurso: 'mei', testID: 'atalho-mei' },
];
