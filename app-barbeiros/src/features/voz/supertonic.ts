// Web (and tests): the Supertonic voice runs only in the phone app
// (react-native-executorch is native). The phone's own voice is used here.
export type VozSupertonic = 'F2' | 'M1';
export const VOZES_SUPERTONIC: Record<VozSupertonic, string> = { F2: 'Feminina (F2)', M1: 'Masculina (M1)' };
export const TAMANHO_MB = 144;
export const disponivel = false;

export async function vozBaixada(): Promise<boolean> {
  return false;
}

export async function baixarVoz(_onProgresso: (p: number) => void, _sinal?: AbortSignal): Promise<void> {
  throw new Error('A voz Supertonic funciona no app do celular.');
}

export async function falarSupertonic(_texto: string, _voz: VozSupertonic, eventos: { onInicio?: () => void; onFim?: () => void }) {
  eventos.onFim?.();
}

export function pararSupertonic() {}
