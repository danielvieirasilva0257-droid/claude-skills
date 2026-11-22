// Floating glass capsule with the 5 tabs + the round green "+ Atendimento"
// beside it (DESIGN.md v2, from the references). Active tab: bubble, green
// icon and bold label (never color alone).
//
// The bubble is one view that slides from the tab you were on to the tab you
// tapped (Daniel, 20/11/2026): a single position value goes from the old
// index to the new one, and every tab width, the bubble and the labels are
// derived from it, so the tabs widen and narrow as the bubble passes.
// Fast and without bounce (tens of times a day): 220 ms + 40 ms per tab of
// distance, strong ease-out, interruptible; "reduce motion" jumps.
import type { BottomTabBarProps } from 'expo-router/tabs';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { vibrar } from '@/lib/haptics';
import { curva, useMovimentoReduzido } from '@/theme/motion';
import { color, radius, space } from '@/theme/tokens';

import { Texto } from './Texto';
import { Vidro } from './Vidro';

export type IconeAba = SymbolViewProps['name'];

type Props = BottomTabBarProps & { icones: Record<string, IconeAba>; onMais: () => void };

const EXTRA = 0.9;   // the active tab is 1.9 × as wide as the others
const PressableAnimado = Animated.createAnimatedComponent(Pressable);

function peso(i: number, pos: number): number {
  'worklet';
  return 1 + EXTRA * Math.max(0, 1 - Math.abs(i - pos));
}

function larguraAba(i: number, pos: number, total: number, largura: number): number {
  'worklet';
  return (largura * peso(i, pos)) / (total + EXTRA);
}

function Aba({ i, total, pos, largura, ativo, rotulo, icone, testID, onPress }: {
  i: number; total: number; pos: SharedValue<number>; largura: SharedValue<number>; ativo: boolean;
  rotulo: string; icone: IconeAba; testID: string; onPress: () => void;
}) {
  const estiloAba = useAnimatedStyle(() => (largura.value > 0 ? { width: larguraAba(i, pos.value, total, largura.value) } : { flex: 1 }));
  // pos.value read directly in each style (through a helper, Reanimated on the web does not see the dependency).
  const estiloIcone = useAnimatedStyle(() => ({ transform: [{ translateY: -7 * Math.max(0, 1 - Math.abs(i - pos.value) * 2) }] }));
  const estiloRotulo = useAnimatedStyle(() => ({ opacity: Math.max(0, 1 - Math.abs(i - pos.value) * 2) }));
  return (
    <PressableAnimado accessibilityRole="tab" accessibilityState={{ selected: ativo }} accessibilityLabel={rotulo} testID={testID} onPress={onPress}
      style={estiloAba}>
      {/* Static layout on its own element: mixed with the animated width, the web dropped the 52 px height. */}
      <View style={styles.aba}>
        <Animated.View style={estiloIcone}>
          <SymbolView name={icone} tintColor={ativo ? color.brand : color.textMuted} size={22} />
        </Animated.View>
        {/* Name under the icon while the bubble is on the tab (bubble + name + green icon: never color alone). */}
        <View style={styles.rotulo} pointerEvents="none">
          <Animated.View style={estiloRotulo}>
            <Texto variante="tiny" peso="semibold" numberOfLines={1}>{rotulo}</Texto>
          </Animated.View>
        </View>
      </View>
    </PressableAnimado>
  );
}

export function BarraAbas({ state, descriptors, emitter, navigateToTab, icones, onMais }: Props) {
  const insets = useSafeAreaInsets();
  const reduzido = useMovimentoReduzido();
  const total = state.routes.length;
  const pos = useSharedValue(state.index);
  const largura = useSharedValue(0);

  useEffect(() => {
    const distancia = Math.abs(state.index - pos.value);
    pos.value = reduzido
      ? state.index
      : withTiming(state.index, { duration: Math.min(380, 220 + 40 * distancia), easing: curva('easeOut') });
  }, [state.index, reduzido, pos]);

  const estiloBolha = useAnimatedStyle(() => {
    if (largura.value <= 0) return { opacity: 0 };
    const k = Math.min(Math.floor(pos.value), total - 1);
    const t = pos.value - k;
    let x = 0;
    for (let j = 0; j < k; j++) x += larguraAba(j, pos.value, total, largura.value);
    const wk = larguraAba(k, pos.value, total, largura.value);
    const wProx = k + 1 < total ? larguraAba(k + 1, pos.value, total, largura.value) : wk;
    return { opacity: 1, left: x + t * wk, width: (1 - t) * wk + t * wProx };
  });

  return (
    <View style={[styles.raiz, { bottom: insets.bottom + space[2] }]} pointerEvents="box-none">
      <Vidro tom="forte" raio={radius.pill} style={styles.capsula} accessibilityRole="tablist">
        <View style={styles.trilho} onLayout={(e) => { largura.value = e.nativeEvent.layout.width; }}>
          <Animated.View style={[styles.bolha, estiloBolha]} pointerEvents="none" testID="aba-bolha" />
          {state.routes.map((rota, i) => {
            const ativo = state.index === i;
            const rotulo = String(descriptors[rota.key]?.options.title ?? rota.name);
            return (
              <Aba key={rota.key} i={i} total={total} pos={pos} largura={largura} ativo={ativo} rotulo={rotulo}
                icone={icones[rota.name]!} testID={`aba-${rota.name}`}
                onPress={() => {
                  const evento = emitter.emit({ type: 'tabPress', target: rota.key, canPreventDefault: true });
                  if (!ativo && !evento.defaultPrevented) navigateToTab(rota.key);
                }} />
            );
          })}
        </View>
      </Vidro>
      <Pressable testID="mais-atendimento" accessibilityRole="button" accessibilityLabel="Novo atendimento"
        onPress={() => { vibrar.leve(); onMais(); }}
        style={({ pressed }) => [styles.mais, pressed ? styles.maisPressionado : null]}>
        <SymbolView name={{ ios: 'plus', android: 'add', web: 'add' }} tintColor={color.onBrand} size={28} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: { position: 'absolute', left: space[3], right: space[3], flexDirection: 'row', alignItems: 'center', gap: space[2] },
  capsula: { flex: 1, height: 64, justifyContent: 'center', paddingHorizontal: 6 },
  trilho: { flexDirection: 'row', alignItems: 'center', height: 52 },
  bolha: { position: 'absolute', top: 0, height: 52, borderRadius: radius.pill, backgroundColor: color.surfaceStrong },
  aba: { height: 52, alignItems: 'center', justifyContent: 'center' },
  rotulo: { position: 'absolute', bottom: 6, left: 2, right: 2, alignItems: 'center' },
  mais: { width: 64, height: 64, borderRadius: radius.pill, backgroundColor: color.brand, alignItems: 'center', justifyContent: 'center',
    borderBottomWidth: 4, borderBottomColor: color.brandLip },
  maisPressionado: { transform: [{ translateY: 2 }], borderBottomWidth: 2 },
});
