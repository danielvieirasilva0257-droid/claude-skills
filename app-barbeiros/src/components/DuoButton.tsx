// Primary button (one per screen): solid 4 px lip, sinks on touch and springs
// back. ESPECIFICACAO.md section 7 / DESIGN.md.
import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { vibrar } from '@/lib/haptics';
import { useFocoVisivel } from '@/lib/useFocoVisivel';
import { curva, useMovimentoReduzido } from '@/theme/motion';
import { color, motion, radius, space } from '@/theme/tokens';

import { Texto } from './Texto';

export type Aparencia = 'normal' | 'sucesso' | 'erro';

export type DuoButtonProps = {
  rotulo: string;
  onPress?: () => void;
  desativado?: boolean;
  carregando?: boolean;
  /** Visual state used by StatusButton. */
  aparencia?: Aparencia;
  /** Replaces the label (StatusButton, ConquistaButton). */
  conteudo?: ReactNode;
  /** Extra layers drawn inside the face, under the label (ConquistaButton waves). */
  camadas?: ReactNode;
  accessibilityHint?: string;
  testID?: string;
  style?: ViewStyle;
};

const ALTURA = 52;
const LABIO = 4;

const faces: Record<Aparencia, { face: string; labio: string; texto: keyof typeof color; borda?: string }> = {
  normal: { face: color.brand, labio: color.brandLip, texto: 'onBrand' },
  sucesso: { face: color.surfaceStrong, labio: color.brandLip, texto: 'brand' },
  erro: { face: color.surface, labio: color.danger, texto: 'danger', borda: color.danger },
};

export function DuoButton({
  rotulo,
  onPress,
  desativado = false,
  carregando = false,
  aparencia = 'normal',
  conteudo,
  camadas,
  accessibilityHint,
  testID,
  style,
}: DuoButtonProps) {
  const reduzido = useMovimentoReduzido();
  const { foco, onFocus, onBlur } = useFocoVisivel();
  const y = useSharedValue(0);
  const inativo = desativado || carregando;
  const visual = faces[aparencia];

  const faceAnimada = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));

  function aoApertar() {
    if (inativo) return;
    vibrar.leve();
    y.value = reduzido ? LABIO : withTiming(LABIO, { duration: motion.press.duration, easing: curva('easeSoftOut') });
  }

  function aoSoltar() {
    y.value = reduzido ? 0 : withSpring(0, motion.springBack);
  }

  return (
    <Pressable
      testID={testID}
      onPress={inativo ? undefined : onPress}
      onPressIn={aoApertar}
      onPressOut={aoSoltar}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={inativo}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: desativado, busy: carregando }}
      style={[styles.raiz, foco ? styles.foco : null, style]}
    >
      <View style={[styles.labio, { backgroundColor: desativado ? color.border : visual.labio }]} />
      <Animated.View
        style={[
          styles.face,
          { backgroundColor: desativado ? color.surface : visual.face },
          visual.borda && !desativado ? { borderWidth: 1, borderColor: visual.borda } : null,
          desativado ? styles.faceDesativada : null,
          faceAnimada,
        ]}
      >
        {camadas}
        {carregando ? (
          <ActivityIndicator color={color[visual.texto]} accessibilityLabel="Carregando" />
        ) : (
          conteudo ?? (
            <Texto variante="body" peso="semibold" cor={desativado ? 'textMuted' : visual.texto} numberOfLines={1}>
              {rotulo}
            </Texto>
          )
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  raiz: { height: ALTURA, borderRadius: radius.pill },
  foco: { outlineColor: color.brand, outlineStyle: 'solid', outlineWidth: 2, outlineOffset: 2 },
  labio: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: LABIO,
    height: ALTURA - LABIO,
    borderRadius: radius.pill,
  },
  face: {
    height: ALTURA - LABIO,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space[5],
    overflow: 'hidden',
  },
  faceDesativada: { borderWidth: 1, borderColor: color.border },
});
