// Inter, loaded with expo-font. One family name per weight, because Android
// does not pick a weight from `fontWeight` for custom fonts.
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';

import { font } from './tokens';

export const fontAssets = {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} as const;

type Weight = keyof typeof font.weight;

const familyByWeight: Record<Weight, keyof typeof fontAssets> = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
};

/**
 * Style fragment for text in Inter at the given weight (`font.weight` in tokens).
 * Only `fontFamily` is set: adding `fontWeight` to a single-weight file makes
 * Android and the web synthesize a fake bold.
 */
export function inter(weight: Weight = 'regular') {
  return { fontFamily: familyByWeight[weight] } as const;
}

/** Numbers always use tabular figures (ESPECIFICACAO.md section 6). */
export const tabularNums = { fontVariant: ['tabular-nums'] } as const;
