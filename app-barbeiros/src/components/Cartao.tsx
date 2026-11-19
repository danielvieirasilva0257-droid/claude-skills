import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { color, radius, space } from '@/theme/tokens';

type Props = {
  children: ReactNode;
  /** Only when the whole card is tappable (DESIGN.md: card only if interactive or grouping). */
  onPress?: () => void;
  accessibilityLabel?: string;
  testID?: string;
  style?: ViewStyle;
};

/** Grouped area: surface + 1 px border, no shadow. */
export function Cartao({ children, onPress, accessibilityLabel, testID, style }: Props) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        testID={testID}
        style={({ pressed }) => [styles.cartao, pressed ? styles.pressionado : null, style]}
      >
        {children}
      </Pressable>
    );
  }
  return (
    <View style={[styles.cartao, style]} testID={testID}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  cartao: {
    backgroundColor: color.surface,
    borderColor: color.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space[4],
    gap: space[2],
  },
  pressionado: { borderColor: color.textMuted },
});
