// Floating glass capsule with the 5 tabs + the round green "+ Atendimento"
// beside it (DESIGN.md v2, from the references). Active tab: bubble, green
// icon and bold label (never color alone).
import type { BottomTabBarProps } from 'expo-router/tabs';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { vibrar } from '@/lib/haptics';
import { color, radius, space } from '@/theme/tokens';

import { Texto } from './Texto';
import { Vidro } from './Vidro';

export type IconeAba = SymbolViewProps['name'];

type Props = BottomTabBarProps & { icones: Record<string, IconeAba>; onMais: () => void };

export function BarraAbas({ state, descriptors, emitter, navigateToTab, icones, onMais }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.raiz, { bottom: insets.bottom + space[2] }]} pointerEvents="box-none">
      <Vidro tom="forte" raio={radius.pill} style={styles.capsula} accessibilityRole="tablist">
        {state.routes.map((rota, i) => {
          const ativo = state.index === i;
          const rotulo = String(descriptors[rota.key]?.options.title ?? rota.name);
          return (
            <Pressable key={rota.key} accessibilityRole="tab" accessibilityState={{ selected: ativo }} accessibilityLabel={rotulo}
              testID={`aba-${rota.name}`}
              onPress={() => {
                const evento = emitter.emit({ type: 'tabPress', target: rota.key, canPreventDefault: true });
                if (!ativo && !evento.defaultPrevented) navigateToTab(rota.key);
              }}
              style={[styles.aba, ativo ? styles.ativa : null]}>
              <SymbolView name={icones[rota.name]!} tintColor={ativo ? color.brand : color.textMuted} size={22} />
              {/* Active tab shows its name (bubble + name + green icon: never color alone). */}
              {ativo ? <Texto variante="tiny" peso="semibold" numberOfLines={1}>{rotulo}</Texto> : null}
            </Pressable>
          );
        })}
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
  capsula: { flex: 1, height: 64, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6 },
  aba: { flex: 1, height: 52, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', gap: 2 },
  ativa: { flex: 1.9, backgroundColor: color.surfaceStrong },
  mais: { width: 64, height: 64, borderRadius: radius.pill, backgroundColor: color.brand, alignItems: 'center', justifyContent: 'center',
    borderBottomWidth: 4, borderBottomColor: color.brandLip },
  maisPressionado: { transform: [{ translateY: 2 }], borderBottomWidth: 2 },
});
