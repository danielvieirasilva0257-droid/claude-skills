// Client of the ia-agente function ("Fale com a IA"). The function answers
// with the text to speak, an optional pending change (confirmed here, never
// applied by the AI on its own), a screen to open and the data to refresh.
import { MODO_DEMO } from '@/features/demo/config';
import { chamarFuncao, chamarFuncaoStream } from '@/lib/funcoes';

export type Pendente = { ferramenta: string; entrada: Record<string, unknown>; resumo: string };
export type RespostaAgente = { texto: string; pendente?: Pendente; navegar?: string; atualizar?: string[] };
export type Turno = { role: 'user' | 'assistant'; content: string };

export function falarComAgente(mensagem: string, historico: Turno[]): Promise<RespostaAgente> {
  return chamarFuncao<RespostaAgente>('ia-agente', { mensagem, historico: historico.slice(-8) });
}

/**
 * The same, streaming: onTexto gets each piece of the answer as the AI writes
 * it, onFerramenta the tool it is using (to say "let me look" meanwhile).
 * Demo builds have no stream: the recorded answer arrives whole.
 */
export async function falarComAgenteStream(mensagem: string, historico: Turno[],
  eventos: { onTexto: (pedaco: string) => void; onFerramenta: (nome: string) => void }): Promise<RespostaAgente> {
  if (MODO_DEMO) {
    const r = await falarComAgente(mensagem, historico);
    eventos.onTexto(r.texto);
    return r;
  }
  return chamarFuncaoStream<RespostaAgente>('ia-agente', { mensagem, historico: historico.slice(-8) }, (m) => {
    if (m.t === 'texto' && typeof m.d === 'string') eventos.onTexto(m.d);
    if (m.t === 'ferramenta' && typeof m.nome === 'string') eventos.onFerramenta(m.nome);
  });
}

export function confirmarAcao(pendente: Pendente): Promise<RespostaAgente> {
  return chamarFuncao<RespostaAgente>('ia-agente', { confirmar: pendente });
}

export { respostaDeConfirmacao } from './confirmacao';
