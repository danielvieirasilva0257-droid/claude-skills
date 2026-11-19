// Reanimated helpers built on the motion tokens (ESPECIFICACAO.md section 6).
import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { Easing, useReducedMotion } from 'react-native-reanimated';

import { motion } from './tokens';

type Curva = 'easeOut' | 'easeInOut' | 'easeSoftOut' | 'celebrate';

/** Easing.bezier from a motion token, e.g. `curva('easeOut')`. */
export function curva(nome: Curva) {
  const [x1, y1, x2, y2] = motion[nome];
  return Easing.bezier(x1, y1, x2, y2);
}

/**
 * "Reduzir movimento": reads the system setting and follows changes while the
 * app is open (Reanimated's hook only reads it once, at start).
 */
export function useMovimentoReduzido(): boolean {
  const inicial = useReducedMotion();
  const [reduzido, setReduzido] = useState(inicial);
  useEffect(() => {
    let ativo = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (ativo) setReduzido(v);
    });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduzido);
    return () => {
      ativo = false;
      sub.remove();
    };
  }, []);
  return reduzido;
}
