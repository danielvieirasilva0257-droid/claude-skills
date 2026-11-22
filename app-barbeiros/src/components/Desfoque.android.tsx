// Android: dark veil instead of blur (see Desfoque.tsx). Stronger intensity,
// stronger veil, so a locked preview stays unreadable.
import { View } from 'react-native';

import { color } from '@/theme/tokens';

import type { DesfoqueProps } from './Desfoque';

export function Desfoque({ intensidade, style, pointerEvents }: DesfoqueProps) {
  return <View style={[style, { backgroundColor: color.bg, opacity: Math.min(0.92, 0.5 + intensidade / 60) }]} pointerEvents={pointerEvents} />;
}
