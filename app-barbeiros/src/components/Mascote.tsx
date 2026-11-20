// Mascot: a R$ bill with little wings. SVG + Reanimated until the final Rive
// art exists (pending decision 4); the props stay the same when it swaps.
// Only appears on goals, achievements, AI thinking and a light warning.
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Ellipse, G, Path, Rect, Text as SvgText } from 'react-native-svg';

import { curva, useMovimentoReduzido } from '@/theme/motion';
import { mascote as arte } from '@/theme/tokens';

export type EstadoMascote = 'parado' | 'comemorando' | 'pensando' | 'preocupado';

type Props = {
  estado?: EstadoMascote;
  tamanho?: number;
  accessibilityLabel?: string;
};

const ROTULO: Record<EstadoMascote, string> = {
  parado: 'Mascote: nota de dinheiro com asinhas',
  comemorando: 'Mascote comemorando',
  pensando: 'Mascote pensando',
  preocupado: 'Mascote um pouco preocupado',
};

function Asa({ lado }: { lado: 'esq' | 'dir' }) {
  const d = lado === 'esq' ? 'M30 4 C12 0 0 14 4 26 C12 22 22 22 30 18 Z' : 'M2 4 C20 0 32 14 28 26 C20 22 10 22 2 18 Z';
  return (
    <Svg width={32} height={30} viewBox="0 0 32 30">
      <Path d={d} fill={arte.asa} stroke={arte.borda} strokeWidth={2} strokeLinejoin="round" />
      <Path d={lado === 'esq' ? 'M26 10 C18 9 11 13 8 19' : 'M6 10 C14 9 21 13 24 19'} stroke={arte.rosto} strokeWidth={2} fill="none" />
    </Svg>
  );
}

function Rosto({ estado }: { estado: EstadoMascote }) {
  const olho = arte.olho;
  switch (estado) {
    case 'comemorando':
      return (
        <G>
          <Path d="M38 34 q4 -5 8 0" stroke={olho} strokeWidth={2.5} fill="none" strokeLinecap="round" />
          <Path d="M58 34 q4 -5 8 0" stroke={olho} strokeWidth={2.5} fill="none" strokeLinecap="round" />
          <Path d="M42 44 q10 10 20 0 Z" fill={olho} />
        </G>
      );
    case 'pensando':
      return (
        <G>
          <Circle cx={43} cy={31} r={2.6} fill={olho} />
          <Circle cx={61} cy={31} r={2.6} fill={olho} />
          <Circle cx={56} cy={46} r={2.6} fill="none" stroke={olho} strokeWidth={2} />
        </G>
      );
    case 'preocupado':
      return (
        <G>
          <Path d="M38 28 l8 2" stroke={olho} strokeWidth={2} strokeLinecap="round" />
          <Path d="M66 28 l-8 2" stroke={olho} strokeWidth={2} strokeLinecap="round" />
          <Circle cx={43} cy={35} r={2.6} fill={olho} />
          <Circle cx={61} cy={35} r={2.6} fill={olho} />
          <Path d="M45 48 q7 -5 14 0" stroke={olho} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        </G>
      );
    default:
      return (
        <G>
          <Circle cx={43} cy={33} r={2.6} fill={olho} />
          <Circle cx={61} cy={33} r={2.6} fill={olho} />
          <Path d="M45 43 q7 6 14 0" stroke={olho} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        </G>
      );
  }
}

export function Mascote({ estado = 'parado', tamanho = 120, accessibilityLabel }: Props) {
  const reduzido = useMovimentoReduzido();
  const escala = tamanho / 120;
  const pulo = useSharedValue(0);
  const asa = useSharedValue(0);
  const inclinacao = useSharedValue(0);

  useEffect(() => {
    pulo.value = 0;
    asa.value = 0;
    inclinacao.value = 0;
    if (reduzido) return; // static pose per state
    if (estado === 'comemorando') {
      // One-shot: hop twice with wings flapping, then rest (no endless loop).
      pulo.value = withSequence(
        withTiming(-14, { duration: 220, easing: curva('easeOut') }),
        withTiming(0, { duration: 220, easing: curva('easeInOut') }),
        withTiming(-8, { duration: 180, easing: curva('easeOut') }),
        withTiming(0, { duration: 180, easing: curva('easeInOut') }),
      );
      asa.value = withRepeat(withSequence(withTiming(-24, { duration: 110 }), withTiming(0, { duration: 110 })), 4, false);
    } else if (estado === 'pensando') {
      inclinacao.value = withSequence(
        withTiming(-6, { duration: 300, easing: curva('easeInOut') }),
        withDelay(400, withTiming(0, { duration: 300, easing: curva('easeInOut') })),
      );
    } else if (estado === 'preocupado') {
      pulo.value = withSequence(withTiming(4, { duration: 240, easing: curva('easeOut') }), withTiming(2, { duration: 240 }));
    }
  }, [estado, reduzido, pulo, asa, inclinacao]);

  const corpo = useAnimatedStyle(() => ({
    transform: [{ translateY: pulo.value * escala }, { rotate: `${inclinacao.value}deg` }],
  }));
  // Static scale lives in the animated style: an animated `transform`
  // replaces a static one instead of merging with it.
  const asaEsq = useAnimatedStyle(() => ({ transform: [{ scale: escala }, { rotate: `${asa.value}deg` }] }));
  const asaDir = useAnimatedStyle(() => ({ transform: [{ scale: escala }, { rotate: `${-asa.value}deg` }] }));

  return (
    <View
      style={{ width: tamanho * 1.4, height: tamanho * 0.85 }}
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? ROTULO[estado]}
      testID={`mascote-${estado}`}
    >
      <Animated.View style={[StyleSheet.absoluteFill, corpo]}>
        <Animated.View style={[styles.asa, { left: 0, top: tamanho * 0.12 }, asaEsq]}>
          <Asa lado="esq" />
        </Animated.View>
        <Animated.View style={[styles.asa, { right: 0, top: tamanho * 0.12 }, asaDir]}>
          <Asa lado="dir" />
        </Animated.View>
        <View style={{ position: 'absolute', left: tamanho * 0.2, top: tamanho * 0.08 }}>
          <Svg width={tamanho} height={tamanho * 0.6} viewBox="0 0 104 62">
            <Rect x={2} y={2} width={100} height={58} rx={10} fill={arte.nota} stroke={arte.borda} strokeWidth={3} />
            <Rect x={10} y={10} width={84} height={42} rx={6} fill="none" stroke={arte.borda} strokeWidth={1.5} strokeDasharray="3 3" />
            <Ellipse cx={52} cy={38} rx={22} ry={18} fill={arte.rosto} />
            <Rosto estado={estado} />
            <SvgText x={14} y={22} fontSize={10} fontWeight="700" fill={arte.borda}>
              R$
            </SvgText>
            {estado === 'pensando' ? (
              <G>
                <Circle cx={86} cy={14} r={2} fill={arte.pensando} />
                <Circle cx={92} cy={10} r={2} fill={arte.pensando} />
                <Circle cx={98} cy={6} r={2} fill={arte.pensando} />
              </G>
            ) : null}
          </Svg>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  asa: { position: 'absolute', width: 32, height: 30 },
});
