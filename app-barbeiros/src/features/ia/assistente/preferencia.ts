// Where the one AI thinks: Gemma 4 on the phone (Daniel's choice, 21/11; used
// once it is downloaded) or the cloud model. Until Gemma is on the phone, or
// if it fails, the cloud answers: the conversation never stops.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

export type CerebroDaIA = 'celular' | 'nuvem';
const CHAVE = 'cerebro-da-ia';

let atual: CerebroDaIA = 'celular';
const ouvintes = new Set<() => void>();

void AsyncStorage.getItem(CHAVE).then((v) => {
  if (v === 'celular' || v === 'nuvem') { atual = v; ouvintes.forEach((f) => f()); }
}).catch(() => undefined);

export function cerebroDaIA(): CerebroDaIA {
  return atual;
}

export function escolherCerebro(c: CerebroDaIA) {
  atual = c;
  ouvintes.forEach((f) => f());
  void AsyncStorage.setItem(CHAVE, c).catch(() => undefined);
}

export function useCerebroDaIA(): CerebroDaIA {
  return useSyncExternalStore((f) => { ouvintes.add(f); return () => { ouvintes.delete(f); }; }, cerebroDaIA, cerebroDaIA);
}
