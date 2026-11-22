import type { ReactNode } from 'react';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';

import { color, space } from '@/theme/tokens';

import { Vidro } from './Vidro';

type Props = {
  children: ReactNode;
  /** Only when the whole card is tappable. */
  onPress?: () => void;
  accessibilityLabel?: string;
  testID?: string;
  style?: ViewStyle;
  tom?: 'normal' | 'ia';
};

/** Glass card (DESIGN.md v2). Inside it, use plain surfaces, never another Vidro. */
export function Cartao({ children, onPress, accessibilityLabel, testID, style, tom = 'normal' }: Props) {
  const corpo = <Vidro tom={tom} style={[styles.cartao, style ?? {}]}>{children}</Vidro>;
  if (!onPress) return <Vidro tom={tom} style={[styles.cartao, style ?? {}]} testID={testID}>{children}</Vidro>;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel} testID={testID}
      style={({ pressed }) => (pressed ? styles.pressionado : null)}>
      {corpo}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cartao: { padding: space[4], gap: space[2] },
  pressionado: { opacity: 0.8, transform: [{ scale: 0.99 }] },
});

void color;
