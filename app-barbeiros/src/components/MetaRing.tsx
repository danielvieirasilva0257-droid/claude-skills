// Goal ring: green on track, amber at risk (always with "⚠ Em risco").
// Spring with ~0.65 damping. It is information, so it still fills with
// "reduzir movimento" (instantly).
import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { useMovimentoReduzido } from '@/theme/motion';
import { color, space } from '@/theme/tokens';

import { Texto } from './Texto';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  /** 0–1 (above 1 shows full). Comes ready from the database. */
  progresso: number;
  emRisco?: boolean;
  tamanho?: number;
  espessura?: number;
  /** Center content (e.g. "62%" and "da meta"). */
  children?: ReactNode;
  accessibilityLabel: string;
};

export function MetaRing({ progresso, emRisco = false, tamanho = 168, espessura = 14, children, accessibilityLabel }: Props) {
  const reduzido = useMovimentoReduzido();
  const raio = (tamanho - espessura) / 2;
  const circ = 2 * Math.PI * raio;
  const alvo = Math.max(0, Math.min(1, progresso));
  const p = useSharedValue(reduzido ? alvo : 0);

  useEffect(() => {
    p.value = reduzido ? alvo : withSpring(alvo, { dampingRatio: 0.65, duration: 900 });
  }, [alvo, reduzido, p]);

  const arco = useAnimatedProps(() => ({ strokeDashoffset: circ * (1 - Math.max(0, Math.min(1, p.value))) }));
  const cor = emRisco ? color.warning : color.brand;

  return (
    <View style={styles.coluna} accessible accessibilityRole="progressbar" accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(alvo * 100) }}>
      <View style={{ width: tamanho, height: tamanho }}>
        <Svg width={tamanho} height={tamanho}>
          <Circle cx={tamanho / 2} cy={tamanho / 2} r={raio} stroke={color.border} strokeWidth={espessura} fill="none" />
          <AnimatedCircle
            cx={tamanho / 2}
            cy={tamanho / 2}
            r={raio}
            stroke={cor}
            strokeWidth={espessura}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circ} ${circ}`}
            animatedProps={arco}
            transform={`rotate(-90 ${tamanho / 2} ${tamanho / 2})`}
          />
        </Svg>
        <View style={[StyleSheet.absoluteFill, styles.centro]}>{children}</View>
      </View>
      {emRisco ? (
        <Texto variante="bodySm" peso="semibold" cor="warning">
          ⚠ Em risco
        </Texto>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  coluna: { alignItems: 'center', gap: space[2] },
  centro: { alignItems: 'center', justifyContent: 'center' },
});
