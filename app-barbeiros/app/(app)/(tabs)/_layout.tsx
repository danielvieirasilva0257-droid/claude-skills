import { Tabs } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { StyleSheet, Text, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { inter } from '@/theme/fonts';
import { color, size } from '@/theme/tokens';

type IconeProps = { color: ColorValue; focused: boolean };

function icone(name: SymbolViewProps['name']) {
  return function TabIcon({ color: tint }: IconeProps) {
    return <SymbolView name={name} tintColor={tint} size={24} />;
  };
}

// Active tab = brand color AND semibold label (never color alone).
function RotuloAba({ focused, color: tint, children }: { focused: boolean; color: ColorValue; children: string }) {
  return <Text style={[styles.rotulo, focused ? styles.rotuloAtivo : null, { color: tint }]}>{children}</Text>;
}

const icones = {
  inicio: icone({ ios: 'house', android: 'home', web: 'home' }),
  agenda: icone({ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }),
  relatorios: icone({ ios: 'chart.bar', android: 'bar_chart', web: 'bar_chart' }),
  clientes: icone({ ios: 'person.2', android: 'group', web: 'group' }),
  mais: icone({ ios: 'line.3.horizontal', android: 'menu', web: 'menu' }),
};

// The default bar (49 px) is sized for 10 px labels; ours are 12 px Inter.
const ALTURA_ABAS = 58;

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color.brand,
        tabBarInactiveTintColor: color.textMuted,
        tabBarStyle: {
          backgroundColor: color.bg,
          borderTopColor: color.border,
          borderTopWidth: 1,
          height: ALTURA_ABAS + insets.bottom,
        },
        tabBarLabel: RotuloAba,
        sceneStyle: { backgroundColor: color.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Início', tabBarIcon: icones.inicio }} />
      <Tabs.Screen name="agenda" options={{ title: 'Agenda', tabBarIcon: icones.agenda }} />
      <Tabs.Screen name="relatorios" options={{ title: 'Relatórios', tabBarIcon: icones.relatorios }} />
      <Tabs.Screen name="clientes" options={{ title: 'Clientes', tabBarIcon: icones.clientes }} />
      <Tabs.Screen name="mais" options={{ title: 'Mais', tabBarIcon: icones.mais }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  rotulo: { ...inter('regular'), fontSize: size.tiny },
  rotuloAtivo: { ...inter('semibold') },
});
