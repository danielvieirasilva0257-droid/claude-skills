// Color atmosphere behind the top of the screen, so the glass has something
// to refract (instead of a photo). Static: no decorative loop.
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { aurora, color } from '@/theme/tokens';

type Props = { forte?: boolean };

function Mancha({ id, cx, cy, r, cor, opacidade }: { id: string; cx: string; cy: string; r: string; cor: string; opacidade: number }) {
  return (
    <>
      <Defs>
        <RadialGradient id={id} cx={cx} cy={cy} r={r} gradientUnits="objectBoundingBox">
          <Stop offset="0" stopColor={cor} stopOpacity={opacidade} />
          <Stop offset="1" stopColor={cor} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
    </>
  );
}

export function Aurora({ forte = false }: Props) {
  const { width } = useWindowDimensions();
  const altura = forte ? 420 : 260;
  const k = forte ? 1 : 0.55;
  return (
    <View pointerEvents="none" style={[styles.raiz, { height: altura }]} importantForAccessibility="no-hide-descendants" aria-hidden>
      <Svg width={width} height={altura}>
        <Mancha id="a1" cx="0.15" cy="0.05" r="0.75" cor={aurora.laranja} opacidade={0.55 * k} />
        <Mancha id="a2" cx="0.85" cy="0.0" r="0.8" cor={aurora.lavanda} opacidade={0.6 * k} />
        <Mancha id="a3" cx="0.55" cy="0.45" r="0.55" cor={aurora.lima} opacidade={0.22 * k} />
        <Defs>
          <RadialGradient id="fade" cx="0.5" cy="0" r="1.1">
            <Stop offset="0.55" stopColor={color.bg} stopOpacity={0} />
            <Stop offset="1" stopColor={color.bg} stopOpacity={1} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#fade)" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: { position: 'absolute', top: 0, left: 0, right: 0 },
});
