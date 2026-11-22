// Secondary button: 1 px outline, same height and radius as DuoButton,
// scales to 0.97 on touch.
import { ActivityIndicator, Pressable, StyleSheet, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useFocoVisivel } from '@/lib/useFocoVisivel';
import { curva, useMovimentoReduzido } from '@/theme/motion';
import { color, radius, space } from '@/theme/tokens';

import { Texto } from './Texto';

type Tom = 'neutro' | 'ia' | 'perigo';

const tons: Record<Tom, { texto: keyof typeof color; borda: string }> = {
  neutro: { texto: 'text', borda: color.border },
  ia: { texto: 'ai', borda: color.ai },
  perigo: { texto: 'danger', borda: color.danger },
};

type Props = {
  rotulo: string;
  onPress?: () => void;
  desativado?: boolean;
  carregando?: boolean;
  tom?: Tom;
  compacto?: boolean;
  accessibilityHint?: string;
  testID?: string;
  style?: ViewStyle;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SecondaryButton({
  rotulo,
  onPress,
  desativado = false,
  carregando = false,
  tom = 'neutro',
  compacto = false,
  accessibilityHint,
  testID,
  style,
}: Props) {
  const reduzido = useMovimentoReduzido();
  const { foco, onFocus, onBlur } = useFocoVisivel();
  const escala = useSharedValue(1);
  const inativo = desativado || carregando;
  const visual = tons[tom];
  const animado = useAnimatedStyle(() => ({ transform: [{ scale: escala.value }] }));

  return (
    <AnimatedPressable
      testID={testID}
      onPress={inativo ? undefined : onPress}
      onPressIn={() => {
        if (!inativo && !reduzido) escala.value = withTiming(0.97, { duration: 100, easing: curva('easeOut') });
      }}
      onPressOut={() => {
        escala.value = reduzido ? 1 : withTiming(1, { duration: 150, easing: curva('easeOut') });
      }}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={inativo}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: desativado, busy: carregando }}
      style={[
        styles.base,
        compacto ? styles.compacto : null,
        { borderColor: desativado ? color.border : visual.borda },
        desativado ? styles.desativado : null,
        foco ? styles.foco : null,
        animado,
        style,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={color[visual.texto]} accessibilityLabel="Carregando" />
      ) : (
        <Texto variante={compacto ? 'bodySm' : 'body'} peso="semibold" cor={desativado ? 'textMuted' : visual.texto} numberOfLines={1}>
          {rotulo}
        </Texto>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.pill,
    borderWidth: 1,
    backgroundColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space[5],
  },
  compacto: { minHeight: 44, paddingHorizontal: space[4] },
  desativado: { opacity: 0.5 },
  foco: { outlineColor: color.brand, outlineStyle: 'solid', outlineWidth: 2, outlineOffset: 2 },
});
