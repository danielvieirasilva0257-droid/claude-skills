import { Tabs } from 'expo-router';
import { useState } from 'react';

import { BarraAbas, type IconeAba } from '@/components/BarraAbas';
import { LancarSheet } from '@/features/agenda/LancarSheet';
import { color } from '@/theme/tokens';

const ICONES: Record<string, IconeAba> = {
  index: { ios: 'house', android: 'home', web: 'home' },
  agenda: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
  relatorios: { ios: 'chart.bar', android: 'bar_chart', web: 'bar_chart' },
  clientes: { ios: 'person.2', android: 'group', web: 'group' },
  mais: { ios: 'line.3.horizontal', android: 'menu', web: 'menu' },
};

export default function TabsLayout() {
  const [lancando, setLancando] = useState(false);
  return (
    <>
      <Tabs
        tabBar={(props) => <BarraAbas {...props} icones={ICONES} onMais={() => setLancando(true)} />}
        screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: color.bg } }}
      >
        <Tabs.Screen name="index" options={{ title: 'Início' }} />
        <Tabs.Screen name="agenda" options={{ title: 'Agenda' }} />
        <Tabs.Screen name="relatorios" options={{ title: 'Relatórios' }} />
        <Tabs.Screen name="clientes" options={{ title: 'Clientes' }} />
        <Tabs.Screen name="mais" options={{ title: 'Mais' }} />
      </Tabs>
      <LancarSheet aberto={lancando} onFechar={() => setLancando(false)} />
    </>
  );
}
