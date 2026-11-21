// Web (and tests): Gemma 4 runs only in the phone app (react-native-executorch
// is native). On the web the AI's brain is the cloud one (ia-agente).
import type { Pendente } from '@/features/ia/agente';

export const TAMANHO_GEMMA_GB = 3.2;

export type RespostaLocal = { texto: string; pendente?: Pendente; navegar?: string; cancelado?: boolean };

export type DisponibilidadeGemma = { ok: boolean; motivo: string };

export async function disponibilidadeGemma(): Promise<DisponibilidadeGemma> {
  return { ok: false, motivo: 'Só no app do celular' };
}

export async function gemmaBaixado(): Promise<boolean> {
  return false;
}

export async function baixarGemma(_onProgresso: (p: number) => void, _sinal?: AbortSignal): Promise<void> {
  throw new Error('O Gemma 4 funciona no app do celular.');
}

export async function responderComGemma(_mensagem: string, _eventos: { onTexto: (texto: string) => void; onFrase: (frase: string) => void }): Promise<RespostaLocal> {
  throw new Error('O Gemma 4 funciona no app do celular.');
}

export function pararGemma() {}
