// Choice chip (services, payment): selected = soft green + green border + "✓".
// Pop 0.96 → 1 when it becomes selected.
import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { useFocoVisivel } from '@/lib/useFocoVisivel';
import { curva, useMovimentoReduzido } from '@/theme/motion';
import { color, radius, space } from '@/theme/tokens';

import { Texto } from './Texto';

type Props = {
  rotulo: string;
  detalhe?: string;
  selecionado: boolean;
  onPress: () => void;
  desativado?: boolean;
  testID?: string;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Chip({ rotulo, detalhe, selecionado, onPress, desativado = false, testID }: Props) {
  const reduzido = useMovimentoReduzido();
  const { foco, onFocus, onBlur } = useFocoVisivel();
  const escala = useSharedValue(1);
  const anterior = useRef(selecionado);
  const animado = useAnimatedStyle(() => ({ transform: [{ scale: escala.value }] }));

  useEffect(() => {
    if (selecionado && !anterior.current && !reduzido) {
      escala.value = withSequence(
        withTiming(0.96, { duration: 60, easing: curva('easeOut') }),
        withTiming(1, { duration: 140, easing: curva('easeOut') }),
      );
    }
    anterior.current = selecionado;
  }, [selecionado, reduzido, escala]);

  return (
    <AnimatedPressable
      testID={testID}
      onPress={desativado ? undefined : onPress}
      disabled={desativado}
      onFocus={onFocus}
      onBlur={onBlur}
      accessibilityRole="checkbox"
      accessibilityLabel={detalhe ? `${rotulo}, ${detalhe}` : rotulo}
      accessibilityState={{ checked: selecionado, disabled: desativado }}
      style={[
        styles.base,
        selecionado ? styles.selecionado : null,
        desativado ? styles.desativado : null,
        foco ? styles.foco : null,
        animado,
      ]}
    >
      <Texto variante="bodySm" peso={selecionado ? 'semibold' : 'medium'} cor={selecionado ? 'onLight' : desativado ? 'textMuted' : 'text'}>
        {selecionado ? '✓ ' : ''}
        {rotulo}
      </Texto>
      {detalhe ? (
        <Texto variante="caption" cor={selecionado ? 'onLight' : 'textMuted'} numero>
          {detalhe}
        </Texto>
      ) : null}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    paddingHorizontal: space[4],
    paddingVertical: space[2],
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.border,
    backgroundColor: color.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  selecionado: { backgroundColor: color.text, borderColor: color.text },
  desativado: { opacity: 0.5 },
  foco: { outlineColor: color.brand, outlineStyle: 'solid', outlineWidth: 2, outlineOffset: 2 },
});
