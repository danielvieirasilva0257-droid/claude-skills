// Bottom sheet: rises from the bottom edge with springCalm (no bounce), the
// veil fades. Closes on the veil, on Android back and on "Fechar".
// "Reduzir movimento": fade only.
import { useEffect, useState, type ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { curva, useMovimentoReduzido } from '@/theme/motion';
import { color, motion, radius, space } from '@/theme/tokens';

import { Texto } from './Texto';
import { Vidro } from './Vidro';

type Props = {
  aberto: boolean;
  onFechar: () => void;
  titulo: string;
  children: ReactNode;
  testID?: string;
};

const DESLOCAMENTO = 480;

export function BottomSheet({ aberto, onFechar, titulo, children, testID }: Props) {
  const reduzido = useMovimentoReduzido();
  const insets = useSafeAreaInsets();
  const [montado, setMontado] = useState(aberto);
  const y = useSharedValue(DESLOCAMENTO);
  const veu = useSharedValue(0);

  useEffect(() => {
    if (aberto) {
      setMontado(true);
      veu.value = withTiming(1, { duration: 200, easing: curva('easeOut') });
      y.value = reduzido ? 0 : withSpring(0, motion.springCalm);
    } else if (montado) {
      veu.value = withTiming(0, { duration: 180, easing: curva('easeOut') }, (fim) => {
        if (fim) runOnJS(setMontado)(false);
      });
      y.value = reduzido ? DESLOCAMENTO : withTiming(DESLOCAMENTO, { duration: 200, easing: curva('easeOut') });
    }
  }, [aberto, reduzido, montado, veu, y]);

  const estiloVeu = useAnimatedStyle(() => ({ opacity: veu.value }));
  const estiloGaveta = useAnimatedStyle(() => ({
    opacity: reduzido ? veu.value : 1,
    transform: [{ translateY: y.value }],
  }));

  return (
    <Modal visible={montado} transparent animationType="none" onRequestClose={onFechar} statusBarTranslucent>
      <KeyboardAvoidingView style={styles.raiz} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.veu, estiloVeu]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onFechar} accessibilityRole="button" accessibilityLabel="Fechar" />
        </Animated.View>
        <Animated.View
          testID={testID}
          accessibilityViewIsModal
          style={[styles.gaveta, { paddingBottom: space[4] + insets.bottom }, estiloGaveta]}
        >
          <Vidro tom="forte" raio={0} style={StyleSheet.absoluteFill as never} />
          <View style={styles.alca} />
          <View style={styles.cabecalho}>
            <Texto variante="h2" accessibilityRole="header" style={styles.titulo}>
              {titulo}
            </Texto>
            <Pressable onPress={onFechar} accessibilityRole="button" accessibilityLabel="Fechar" hitSlop={8} style={styles.fechar}>
              <Texto variante="bodySm" peso="semibold" cor="textMuted">
                Fechar
              </Texto>
            </Pressable>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.conteudo}>
            {children}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1, justifyContent: 'flex-end' },
  veu: { backgroundColor: color.overlay },
  gaveta: {
    overflow: 'hidden',
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.border,
    maxHeight: '88%',
    paddingTop: space[2],
  },
  alca: { alignSelf: 'center', width: 40, height: 4, borderRadius: radius.pill, backgroundColor: color.border },
  cabecalho: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: space[4], paddingTop: space[3] },
  titulo: { flex: 1 },
  fechar: { minHeight: 44, minWidth: 44, alignItems: 'flex-end', justifyContent: 'center' },
  conteudo: { padding: space[4], gap: space[4] },
});
