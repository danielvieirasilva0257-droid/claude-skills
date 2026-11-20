// Background blur. iOS and web: expo-blur. Android has its own file
// (Desfoque.android.tsx): a dark veil, because expo-blur's Android library
// comes from jitpack.io and is left out of the Android build.
import { BlurView } from 'expo-blur';
import type { StyleProp, ViewStyle } from 'react-native';

export type DesfoqueProps = { intensidade: number; style?: StyleProp<ViewStyle>; pointerEvents?: 'none' | 'auto' };

export function Desfoque({ intensidade, style, pointerEvents }: DesfoqueProps) {
  return <BlurView intensity={intensidade} tint="dark" style={style} pointerEvents={pointerEvents} />;
}
