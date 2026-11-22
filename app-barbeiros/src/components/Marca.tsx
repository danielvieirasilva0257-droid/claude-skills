// The App Barbeiros mark: a barber pole in lime whose stripes rise to the
// right. Same geometry as scripts/gerar_marca.py (assets/marca/marca.svg).
import Svg, { Circle, ClipPath, Defs, G, Polygon, Rect } from 'react-native-svg';

import { color } from '@/theme/tokens';

const X = 382, Y = 282, W = 260, H = 496;          // striped body
const TX = 352, TW = 320, TH = 52, FOLGA = 12;       // caps
const SUBIDA = 180, PERIODO = 170, FAIXA = 70;      // stripes (dark) and bands (lime) in between
const INCLINACAO = (SUBIDA * (W + 40)) / W;

function faixa(a: number, b: number): string {
  return `${X - 20},${a} ${X + W + 20},${a - INCLINACAO} ${X + W + 20},${b - INCLINACAO} ${X - 20},${b}`;
}

const BANDAS = [116, 286, 456, 626, 796].map((a) => faixa(a, a + PERIODO - FAIXA));

export function Marca({ altura = 72, rotulo = 'App Barbeiros' }: { altura?: number; rotulo?: string }) {
  return (
    <Svg width={(altura * 340) / 730} height={altura} viewBox="342 134 340 730" accessibilityRole="image" accessibilityLabel={rotulo}>
      <Defs>
        <ClipPath id="corpo-poste">
          <Rect x={X} y={Y} width={W} height={H} rx={14} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#corpo-poste)">
        {BANDAS.map((p) => <Polygon key={p} points={p} fill={color.brand} />)}
      </G>
      <Circle cx={512} cy={178} r={34} fill={color.brand} />
      <Rect x={TX} y={Y - FOLGA - TH} width={TW} height={TH} rx={TH / 2} fill={color.brand} />
      <Rect x={TX} y={Y + H + FOLGA} width={TW} height={TH} rx={TH / 2} fill={color.brand} />
    </Svg>
  );
}
