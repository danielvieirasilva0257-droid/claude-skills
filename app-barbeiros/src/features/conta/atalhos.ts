// Screens reached from "Mais" (the rest are tabs), with the feature that
// unlocks each one.
import type { Href } from 'expo-router';

import type { Recurso } from '@/lib/plano';

export type Atalho = { rotulo: string; detalhe: string; rota: Href; recurso: Recurso; testID?: string };

export const ATALHOS: Atalho[] = [
  { rotulo: 'Insights da IA', detalhe: 'Até 3 dicas por dia com os seus números', rota: '/insights', recurso: 'insights', testID: 'atalho-insights' },
  { rotulo: 'Chat com a IA', detalhe: 'Pergunte sobre o seu resultado', rota: '/ia/chat', recurso: 'chat', testID: 'atalho-chat' },
  { rotulo: 'Relatórios da IA', detalhe: 'Páginas que a IA montou para você, com PDF', rota: '/ia/relatorios', recurso: 'chat', testID: 'atalho-relatorios-ia' },
  { rotulo: 'Coach de vendas', detalhe: 'Narrativas e mensagens prontas', rota: '/coach', recurso: 'coach', testID: 'atalho-coach' },
  { rotulo: 'Meta do mês', detalhe: 'Quanto falta e quantos cortes', rota: '/meta', recurso: 'meta', testID: 'atalho-meta' },
  { rotulo: 'Financeiro', detalhe: 'Faturamento, gastos e lucro', rota: '/financeiro', recurso: 'financeiro', testID: 'atalho-financeiro' },
  { rotulo: 'Gastos', detalhe: 'Aluguel, produtos, transporte', rota: '/gastos', recurso: 'gastos', testID: 'atalho-gastos' },
  { rotulo: 'Comissão', detalhe: 'Fixa ou escalonada', rota: '/comissao', recurso: 'comissao', testID: 'atalho-comissao' },
  { rotulo: 'Extrato do mês', detalhe: 'Do faturamento ao seu bolso, com PDF', rota: '/extrato', recurso: 'comissao', testID: 'atalho-extrato' },
  { rotulo: 'MEI', detalhe: 'Limite do ano e DAS', rota: '/mei', recurso: 'mei', testID: 'atalho-mei' },
  { rotulo: 'WhatsApp com IA', detalhe: 'A IA responde e agenda', rota: '/whatsapp', recurso: 'whatsapp', testID: 'atalho-whatsapp' },
  { rotulo: 'Horários e lista de espera', detalhe: 'Expediente e quem espera vaga', rota: '/expediente', recurso: 'expediente', testID: 'atalho-expediente' },
  { rotulo: 'Automações', detalhe: 'Mensagens que saem sozinhas', rota: '/automacoes', recurso: 'automacoes', testID: 'atalho-automacoes' },
  { rotulo: 'Mensagens e permissões', detalhe: '100 por mês e LGPD', rota: '/mensagens', recurso: 'mensagens', testID: 'atalho-mensagens' },
  { rotulo: 'Instagram com IA', detalhe: 'Comentários e direct', rota: '/instagram', recurso: 'instagram', testID: 'atalho-instagram' },
  { rotulo: 'Prospecção', detalhe: 'Funil por palavra-código', rota: '/prospeccao', recurso: 'prospeccao', testID: 'atalho-prospeccao' },
  { rotulo: 'Personalidade da IA', detalhe: 'Tom, emoji e assinatura', rota: '/ia/personalidade', recurso: 'personalidade', testID: 'atalho-personalidade' },
];
