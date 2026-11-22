// Where the one AI thinks: the cloud model (the default) or Gemma 4 on the
// phone (experimental, only on phones with enough memory, once downloaded).
// Gemma on the phone froze Daniel's phone on 21/11/2026, so the default moved
// to the cloud and the stored key changed (an old "celular" no longer applies).
// If Gemma is not available or fails, the cloud answers: the talk never stops.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState, useSyncExternalStore } from 'react';

import { disponibilidadeGemma, type DisponibilidadeGemma } from './cerebro';

export type CerebroDaIA = 'celular' | 'nuvem';
const CHAVE = 'cerebro-da-ia-v2';

let atual: CerebroDaIA = 'nuvem';
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

/** Whether Gemma 4 can run on this phone (null while checking). */
export function useDisponibilidadeGemma(): DisponibilidadeGemma | null {
  const [d, setD] = useState<DisponibilidadeGemma | null>(null);
  useEffect(() => {
    let vivo = true;
    void disponibilidadeGemma().then((x) => { if (vivo) setD(x); });
    return () => { vivo = false; };
  }, []);
  return d;
}
