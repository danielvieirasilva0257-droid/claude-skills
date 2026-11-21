// Which voice the AI answers with: the phone's own voice (default, works
// everywhere) or Supertonic F2 / M1 (on the phone, after the one-time download).
// Kept on the phone (AsyncStorage); read synchronously when speaking.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

import type { VozSupertonic } from './supertonic';

export type VozDaIA = 'celular' | VozSupertonic;
const CHAVE = 'voz-da-ia';

let atual: VozDaIA = 'celular';
const ouvintes = new Set<() => void>();

void AsyncStorage.getItem(CHAVE).then((v) => {
  if (v === 'F2' || v === 'M1' || v === 'celular') { atual = v; ouvintes.forEach((f) => f()); }
}).catch(() => undefined);

export function vozDaIA(): VozDaIA {
  return atual;
}

export function escolherVoz(v: VozDaIA) {
  atual = v;
  ouvintes.forEach((f) => f());
  void AsyncStorage.setItem(CHAVE, v).catch(() => undefined);
}

export function useVozDaIA(): VozDaIA {
  return useSyncExternalStore((f) => { ouvintes.add(f); return () => { ouvintes.delete(f); }; }, vozDaIA, vozDaIA);
}
