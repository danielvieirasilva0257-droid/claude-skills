// Client of the ia-agente function ("Fale com a IA"). The function answers
// with the text to speak, an optional pending change (confirmed here, never
// applied by the AI on its own), a screen to open and the data to refresh.
import { chamarFuncao } from '@/lib/funcoes';

export type Pendente = { ferramenta: string; entrada: Record<string, unknown>; resumo: string };
export type RespostaAgente = { texto: string; pendente?: Pendente; navegar?: string; atualizar?: string[] };
export type Turno = { role: 'user' | 'assistant'; content: string };

export function falarComAgente(mensagem: string, historico: Turno[]): Promise<RespostaAgente> {
  return chamarFuncao<RespostaAgente>('ia-agente', { mensagem, historico: historico.slice(-8) });
}

export function confirmarAcao(pendente: Pendente): Promise<RespostaAgente> {
  return chamarFuncao<RespostaAgente>('ia-agente', { confirmar: pendente });
}

export { respostaDeConfirmacao } from './confirmacao';
