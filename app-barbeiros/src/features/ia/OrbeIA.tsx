// The voice orb ("the little ball that moves when it talks"): a lavender blob
// (the AI colour) drawn as one SVG path rebuilt every frame on the UI thread.
//   parado:   slow breathing
//   ouvindo:  the edge follows the microphone level
//   pensando: a soft ripple that turns
//   falando:  pulses in the rhythm of speech (the phone's voice gives no level)
// "Reduce motion": a still circle; the state is always written next to it.
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedProps, useFrameCallback, useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';
import Svg, { Circle, Defs, Path, RadialGradient, Stop } from 'react-native-svg';

import { curva, useMovimentoReduzido } from '@/theme/motion';
import { aurora, color } from '@/theme/tokens';

export type EstadoOrbe = 'parado' | 'ouvindo' | 'pensando' | 'falando';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const PONTOS = 12;
const CODIGO: Record<EstadoOrbe, number> = { parado: 0, ouvindo: 1, pensando: 2, falando: 3 };

function caminho(cx: number, cy: number, r: number, amp: number, t: number, giro: number): string {
  'worklet';
  const pts: [number, number][] = [];
  for (let k = 0; k < PONTOS; k++) {
    const a = (k / PONTOS) * Math.PI * 2 + giro;
    const ruido = Math.sin(a * 3 + t * 1.7) * 0.5 + Math.sin(a * 5 - t * 2.3) * 0.3 + Math.sin(a * 2 + t * 0.9) * 0.2;
    const raio = r * (1 + amp * ruido);
    pts.push([cx + raio * Math.cos(a), cy + raio * Math.sin(a)]);
  }
  // Closed Catmull-Rom spline as cubic Béziers.
  let d = `M${pts[0]![0].toFixed(1)},${pts[0]![1].toFixed(1)}`;
  for (let k = 0; k < PONTOS; k++) {
    const p0 = pts[(k - 1 + PONTOS) % PONTOS]!;
    const p1 = pts[k]!;
    const p2 = pts[(k + 1) % PONTOS]!;
    const p3 = pts[(k + 2) % PONTOS]!;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return `${d} Z`;
}

export function OrbeIA({ estado, nivel, tamanho = 220 }: { estado: EstadoOrbe; nivel: SharedValue<number>; tamanho?: number }) {
  const reduzido = useMovimentoReduzido();
  const t = useSharedValue(0);
  const codigo = useSharedValue(CODIGO[estado]);
  const brilho = useSharedValue(estado === 'parado' ? 0.25 : 0.55);
  const c = tamanho / 2;
  const r = tamanho * 0.3;

  useEffect(() => {
    codigo.value = CODIGO[estado];
    brilho.value = withTiming(estado === 'parado' ? 0.25 : estado === 'pensando' ? 0.4 : 0.6, { duration: 250, easing: curva('easeOut') });
  }, [estado, codigo, brilho]);

  const quadro = useFrameCallback((f) => {
    t.value = (f.timeSinceFirstFrame ?? 0) / 1000;
  }, false);
  useEffect(() => {
    quadro.setActive(!reduzido);
  }, [reduzido, quadro]);

  const propsBlob = useAnimatedProps(() => {
    const tempo = t.value;
    let amp = 0.025 + 0.012 * Math.sin(tempo * 1.4);
    let giro = 0;
    let escala = 1 + 0.015 * Math.sin(tempo * 1.4);
    if (codigo.value === 1) { amp = 0.035 + nivel.value * 0.2; escala = 1 + nivel.value * 0.08; }
    else if (codigo.value === 2) { amp = 0.05; giro = tempo * 1.2; }
    else if (codigo.value === 3) {
      const pulso = (0.5 + 0.5 * Math.sin(tempo * 9)) * (0.6 + 0.4 * Math.sin(tempo * 3.1));
      amp = 0.05 + 0.09 * pulso;
      escala = 1 + 0.05 * pulso;
    }
    return { d: caminho(c, c, r * escala, amp, tempo * (codigo.value === 2 ? 2 : 1), giro) };
  });
  const propsHalo = useAnimatedProps(() => ({
    r: r * (1.35 + (codigo.value === 1 ? nivel.value * 0.25 : 0.05 * Math.sin(t.value * 2))),
    opacity: brilho.value * 0.5,
  }));

  return (
    <View style={[styles.raiz, { width: tamanho, height: tamanho }]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" testID="orbe-ia">
      <Svg width={tamanho} height={tamanho}>
        <Defs>
          <RadialGradient id="orbe-nucleo" cx="42%" cy="38%" r="65%">
            <Stop offset="0" stopColor={color.text} stopOpacity={0.95} />
            <Stop offset="0.35" stopColor={color.ai} stopOpacity={1} />
            <Stop offset="1" stopColor={aurora.lavanda} stopOpacity={1} />
          </RadialGradient>
          <RadialGradient id="orbe-halo" cx="50%" cy="50%" r="50%">
            <Stop offset="0.6" stopColor={color.ai} stopOpacity={0.5} />
            <Stop offset="1" stopColor={color.ai} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <AnimatedCircle cx={c} cy={c} fill="url(#orbe-halo)" animatedProps={propsHalo} />
        {reduzido ? <Circle cx={c} cy={c} r={r} fill="url(#orbe-nucleo)" /> : <AnimatedPath fill="url(#orbe-nucleo)" animatedProps={propsBlob} />}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: { alignItems: 'center', justifyContent: 'center' },
});
