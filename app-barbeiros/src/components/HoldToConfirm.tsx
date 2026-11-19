// Hold for 2 s to confirm a destructive action (apagar lançamento, cancelar
// horário, excluir cliente). Linear fill while holding, quick 200 ms release.
// Screen readers get a confirmation dialog through the "activate" action.
import { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, type ViewStyle } from 'react-native';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { vibrar } from '@/lib/haptics';
import { useFocoVisivel } from '@/lib/useFocoVisivel';
import { curva } from '@/theme/motion';
import { color, radius, space } from '@/theme/tokens';

import { Texto } from './Texto';

type Props = {
  rotulo: string;
  onConfirmar: () => void;
  duracao?: number;
  testID?: string;
  style?: ViewStyle;
};

function confirmarPorDialogo(rotulo: string, onConfirmar: () => void) {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-alert
    if (globalThis.confirm?.(`${rotulo}?`)) onConfirmar();
    return;
  }
  Alert.alert(`${rotulo}?`, 'Essa ação não pode ser desfeita.', [
    { text: 'Voltar', style: 'cancel' },
    { text: rotulo, style: 'destructive', onPress: onConfirmar },
  ]);
}

export function HoldToConfirm({ rotulo, onConfirmar, duracao = 2000, testID, style }: Props) {
  const progresso = useSharedValue(0);
  const [segurando, setSegurando] = useState(false);
  const { foco, onFocus, onBlur } = useFocoVisivel();
  const barra = useAnimatedStyle(() => ({ transform: [{ scaleX: progresso.value }] }));

  useEffect(() => () => void (progresso.value = 0), [progresso]);

  function concluir() {
    setSegurando(false);
    vibrar.aviso();
    onConfirmar();
  }

  return (
    <Pressable
      testID={testID}
      onPressIn={() => {
        setSegurando(true);
        vibrar.leve();
        progresso.value = withTiming(1, { duration: duracao, easing: Easing.linear }, (fim) => {
          if (fim) runOnJS(concluir)();
        });
      }}
      onPressOut={() => {
        setSegurando(false);
        if (progresso.value < 1) progresso.value = withTiming(0, { duration: 200, easing: curva('easeOut') });
        else progresso.value = 0;
      }}
      onFocus={onFocus}
      onBlur={onBlur}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      accessibilityHint={`Segure por ${Math.round(duracao / 1000)} segundos para confirmar`}
      accessibilityActions={[{ name: 'activate', label: rotulo }]}
      onAccessibilityAction={() => confirmarPorDialogo(rotulo, onConfirmar)}
      style={[styles.base, foco ? styles.foco : null, style]}
    >
      <Animated.View style={[styles.preenchimento, barra]} pointerEvents="none" />
      <Texto peso="semibold" cor="danger">
        {segurando ? 'Continue segurando…' : rotulo}
      </Texto>
      <Texto variante="tiny" cor="textMuted">
        Segure {Math.round(duracao / 1000)} s
      </Texto>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.danger,
    backgroundColor: color.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space[5],
    paddingVertical: space[1],
    overflow: 'hidden',
  },
  preenchimento: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: color.danger,
    opacity: 0.14,
    transformOrigin: 'left',
  },
  foco: { outlineColor: color.danger, outlineStyle: 'solid', outlineWidth: 2, outlineOffset: 2 },
});
