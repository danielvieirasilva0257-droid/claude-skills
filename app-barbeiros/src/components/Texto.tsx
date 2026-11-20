import { Text, type TextProps } from 'react-native';

import { inter, tabularNums } from '@/theme/fonts';
import { color, size } from '@/theme/tokens';

type Variante = keyof typeof size;
type Peso = 'regular' | 'medium' | 'semibold';

const pesoPadrao: Record<Variante, Peso> = {
  display: 'semibold',
  title: 'semibold',
  h2: 'semibold',
  h3: 'semibold',
  body: 'regular',
  bodySm: 'regular',
  caption: 'medium',
  tiny: 'medium',
};

export type TextoProps = TextProps & {
  variante?: Variante;
  peso?: Peso;
  cor?: keyof typeof color;
  /** Tabular figures: every number on screen uses this. */
  numero?: boolean;
  centro?: boolean;
};

/** Text in Inter with the token scale. Colors only from `color`. */
export function Texto({ variante = 'body', peso, cor = 'text', numero = false, centro = false, style, ...props }: TextoProps) {
  return (
    <Text
      {...props}
      style={[
        inter(peso ?? pesoPadrao[variante]),
        { fontSize: size[variante], color: color[cor], lineHeight: Math.round(size[variante] * 1.3) },
        numero ? tabularNums : null,
        centro ? { textAlign: 'center' } : null,
        style,
      ]}
    />
  );
}
