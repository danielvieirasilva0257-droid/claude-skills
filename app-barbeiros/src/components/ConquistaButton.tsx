// "Pulo com dinheiro" (approved 19/11). Only for: closing the day's cash,
// 50%/100% of the goal, record, streak milestone, plan upgrade.
// Timeline (ESPECIFICACAO.md section 7, t = 0 at the tap):
//   0–60 ms     press: sinks 4 px, scale 0.97, lip covered · light haptic
//   0–630 ms    2 yellow waves grow from the center INSIDE the button
//   60–~1210 ms 12 pieces (8 R$ bills, 4 coins) fan out 150° upward, spin, fall
//   60–300 ms   rise 48 px, scale 1.03 (easeInOut)
//   300–540 ms  fall and land squashed 1.04 × 0.94 · medium haptic
//   540–720 ms  4 px settle bounce · success haptic at the end
// "Reduzir movimento": only a 150 ms color change.
import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { vibrar } from '@/lib/haptics';
import { useFocoVisivel } from '@/lib/useFocoVisivel';
import { curva, useMovimentoReduzido } from '@/theme/motion';
import { color, radius, space } from '@/theme/tokens';

import { Texto } from './Texto';

type Props = {
  rotulo: string;
  onPress: () => void;
  /** Called when the celebration ends (~1.2 s). */
  onFim?: () => void;
  /** Optional 360° turn in Y during the jump. */
  giro3d?: boolean;
  desativado?: boolean;
  testID?: string;
  style?: ViewStyle;
};

const ALTURA = 52;
const LABIO = 4;
const DURACAO_DINHEIRO = 1150;
const PECAS = 12;

type Peca = { tipo: 'nota' | 'moeda'; angulo: number; velocidade: number; giro: number };

// Deterministic fan: 150° centered straight up, coins spread between bills.
const pecas: Peca[] = Array.from({ length: PECAS }, (_, i) => {
  const angulo = ((-90 - 75 + (150 * i) / (PECAS - 1)) * Math.PI) / 180;
  return {
    tipo: i % 3 === 1 ? 'moeda' : 'nota',
    angulo,
    velocidade: 300 + ((i * 37) % 5) * 22,
    giro: (i % 2 === 0 ? 1 : -1) * (360 + ((i * 53) % 4) * 90),
  };
});

const GRAVIDADE = 900; // px/s²

function Dinheiro({ peca, t }: { peca: Peca; t: SharedValue<number> }) {
  const estilo = useAnimatedStyle(() => {
    const tau = (t.value * DURACAO_DINHEIRO) / 1000;
    const x = Math.cos(peca.angulo) * peca.velocidade * tau;
    const y = Math.sin(peca.angulo) * peca.velocidade * tau + 0.5 * GRAVIDADE * tau * tau;
    const sumir = t.value < 2 / 3 ? 1 : Math.max(0, 1 - (t.value - 2 / 3) * 3);
    const crescer = Math.min(1, 0.6 + t.value * 4);
    return {
      opacity: t.value === 0 ? 0 : sumir,
      transform: [{ translateX: x }, { translateY: y }, { rotate: `${peca.giro * t.value}deg` }, { scale: crescer }],
    };
  });
  return (
    <Animated.View style={[styles.peca, estilo]}>
      {peca.tipo === 'nota' ? (
        <View style={styles.nota}>
          <Texto variante="tiny" peso="semibold" cor="brandLip" style={styles.notaTexto}>
            R$
          </Texto>
        </View>
      ) : (
        <View style={styles.moeda} />
      )}
    </Animated.View>
  );
}

function Onda({ progresso, opacidade }: { progresso: SharedValue<number>; opacidade: number }) {
  const estilo = useAnimatedStyle(() => ({
    opacity: progresso.value === 0 ? 0 : opacidade * (1 - progresso.value),
    transform: [{ scale: progresso.value }],
  }));
  return <Animated.View pointerEvents="none" style={[styles.onda, estilo]} />;
}

export function ConquistaButton({ rotulo, onPress, onFim, giro3d = false, desativado = false, testID, style }: Props) {
  const reduzido = useMovimentoReduzido();
  const { foco, onFocus, onBlur } = useFocoVisivel();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const face = useSharedValue(0);
  const y = useSharedValue(0);
  const sx = useSharedValue(1);
  const sy = useSharedValue(1);
  const giro = useSharedValue(0);
  const onda1 = useSharedValue(0);
  const onda2 = useSharedValue(0);
  const dinheiro = useSharedValue(0);
  const cor = useSharedValue(0);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function depois(ms: number, fn: () => void) {
    timers.current.push(setTimeout(fn, ms));
  }

  function tocar() {
    if (desativado) return;
    onPress();
    const ease = curva('easeInOut');
    if (reduzido) {
      cor.value = withSequence(withTiming(1, { duration: 150 }), withDelay(450, withTiming(0, { duration: 150 })));
      vibrar.sucesso();
      depois(750, () => onFim?.());
      return;
    }
    // reset (a second tap restarts cleanly)
    onda1.value = 0;
    onda2.value = 0;
    dinheiro.value = 0;
    giro.value = 0;

    face.value = withSequence(withTiming(LABIO, { duration: 60, easing: curva('easeSoftOut') }), withTiming(0, { duration: 1 }));
    y.value = withSequence(
      withTiming(0, { duration: 60 }),
      withTiming(-48, { duration: 240, easing: ease }),
      withTiming(2, { duration: 240, easing: ease }),
      withTiming(-4, { duration: 80, easing: curva('easeOut') }),
      withTiming(0, { duration: 100, easing: curva('easeOut') }),
    );
    sx.value = withSequence(
      withTiming(0.97, { duration: 60 }),
      withTiming(1.03, { duration: 240, easing: ease }),
      withTiming(1.04, { duration: 240, easing: ease }),
      withTiming(1, { duration: 180, easing: curva('easeOut') }),
    );
    sy.value = withSequence(
      withTiming(0.97, { duration: 60 }),
      withTiming(1.03, { duration: 240, easing: ease }),
      withTiming(0.94, { duration: 240, easing: ease }),
      withTiming(1, { duration: 180, easing: curva('easeOut') }),
    );
    if (giro3d) giro.value = withDelay(60, withTiming(360, { duration: 480, easing: ease }));
    onda1.value = withTiming(1, { duration: 520, easing: curva('easeOut') });
    onda2.value = withDelay(110, withTiming(1, { duration: 520, easing: curva('easeOut') }));
    dinheiro.value = withDelay(60, withTiming(1, { duration: DURACAO_DINHEIRO, easing: Easing.linear }));

    depois(540, vibrar.media);
    depois(720, vibrar.sucesso);
    depois(60 + DURACAO_DINHEIRO, () => onFim?.());
  }

  const pulo = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      { translateY: y.value },
      { rotateY: `${giro.value}deg` },
      { scaleX: sx.value },
      { scaleY: sy.value },
    ],
  }));
  const faceAnimada = useAnimatedStyle(() => ({
    transform: [{ translateY: face.value }],
    backgroundColor: interpolateColor(cor.value, [0, 1], [color.brand, color.goldText]),
  }));

  return (
    <View style={[styles.raiz, style]}>
      {/* Bills fly behind the button: the main element stays on top. */}
      <View pointerEvents="none" style={styles.origem}>
        {pecas.map((p, i) => (
          <Dinheiro key={i} peca={p} t={dinheiro} />
        ))}
      </View>
      <Animated.View style={pulo}>
        <Pressable
          testID={testID}
          onPress={tocar}
          onPressIn={() => !desativado && vibrar.leve()}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={desativado}
          accessibilityRole="button"
          accessibilityLabel={rotulo}
          accessibilityState={{ disabled: desativado }}
          style={[styles.botao, foco ? styles.foco : null]}
        >
          <View style={[styles.labio, desativado ? styles.labioDesativado : null]} />
          <Animated.View style={[styles.face, desativado ? styles.faceDesativada : faceAnimada]}>
            <Onda progresso={onda1} opacidade={0.55} />
            <Onda progresso={onda2} opacidade={0.35} />
            <Texto peso="semibold" cor={desativado ? 'textMuted' : 'onBrand'} numberOfLines={1}>
              {rotulo}
            </Texto>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: { height: ALTURA },
  origem: { position: 'absolute', left: '50%', top: ALTURA / 2, width: 0, height: 0 },
  botao: { height: ALTURA, borderRadius: radius.lg },
  foco: { outlineColor: color.brand, outlineStyle: 'solid', outlineWidth: 2, outlineOffset: 2 },
  labio: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: LABIO,
    height: ALTURA - LABIO,
    borderRadius: radius.lg,
    backgroundColor: color.brandLip,
  },
  labioDesativado: { backgroundColor: color.border },
  face: {
    height: ALTURA - LABIO,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space[5],
    overflow: 'hidden', // the waves never leave the button
  },
  faceDesativada: { backgroundColor: color.surface, borderWidth: 1, borderColor: color.border },
  onda: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: color.wave,
    alignSelf: 'center',
    top: (ALTURA - LABIO) / 2 - 210,
  },
  peca: { position: 'absolute', left: -11, top: -6 },
  nota: {
    width: 22,
    height: 12,
    borderRadius: 2,
    backgroundColor: color.bill,
    borderWidth: 1,
    borderColor: color.brandLip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notaTexto: { fontSize: 7, lineHeight: 8 },
  moeda: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: color.gold,
    borderWidth: 1,
    borderColor: color.goldText,
  },
});
