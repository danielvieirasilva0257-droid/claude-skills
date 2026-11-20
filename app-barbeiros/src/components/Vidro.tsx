// Liquid Glass surface. iOS 26: Apple's native glass (expo-glass-effect).
// Elsewhere: blur of what is behind (web, older iOS) or a translucent veil
// (Android, cheaper), plus a soft top sheen and a 1 px light border.
// Never put Vidro inside Vidro (glass on glass).
import { BlurView } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';

import { color, radius } from '@/theme/tokens';

type Props = ViewProps & {
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[];
  /** "forte" = darker glass for sheets and the tab bar. */
  tom?: 'normal' | 'forte' | 'ia';
  raio?: number;
};

const nativo = Platform.OS === 'ios' && isLiquidGlassAvailable();

export function Vidro({ children, style, tom = 'normal', raio = radius.lg, ...props }: Props) {
  const forma = { borderRadius: raio };
  if (nativo) {
    return (
      <GlassView glassEffectStyle="regular" colorScheme="dark" tintColor={tom === 'ia' ? color.aiSoft : undefined}
        style={[styles.base, forma, style]} {...props}>
        {children}
      </GlassView>
    );
  }
  return (
    <View style={[styles.base, styles.borda, forma, tom === 'forte' ? styles.forte : tom === 'ia' ? styles.ia : styles.normal, style]} {...props}>
      {Platform.OS !== 'android' ? (
        <BlurView intensity={tom === 'forte' ? 40 : 24} tint="dark" style={[StyleSheet.absoluteFill, forma]} pointerEvents="none" />
      ) : null}
      <LinearGradient pointerEvents="none" colors={[color.highlight, 'transparent']} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 0.45 }}
        style={[StyleSheet.absoluteFill, forma, styles.brilho]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { overflow: 'hidden' },
  borda: { borderWidth: 1, borderColor: color.border, borderTopColor: color.highlight },
  normal: { backgroundColor: color.surface },
  forte: { backgroundColor: 'rgba(20,20,22,0.82)' },
  ia: { backgroundColor: color.aiSoft },
  brilho: { opacity: 0.35 },
});
