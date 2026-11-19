// Everything behind login. Stack screens (servicos, gastos, …) get a plain
// header; the tabs have their own titles.
import { Stack } from 'expo-router';

import { inter } from '@/theme/fonts';
import { color, size } from '@/theme/tokens';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: color.bg },
        headerTintColor: color.brand,
        headerTitleStyle: { ...inter('semibold'), fontSize: size.h3, color: color.text },
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: color.bg },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
