// Everything behind login. A new barber goes to onboarding first; after it,
// the tabs and the stack screens (servicos, gastos, …) with a plain header.
import { Redirect, Stack, useSegments } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Carregando, EstadoErro } from '@/components/Estado';
import { useBarbeiro } from '@/features/conta/barbeiro';
import { inter } from '@/theme/fonts';
import { color, size } from '@/theme/tokens';

export default function AppLayout() {
  const { data: barbeiro, isPending, isError, refetch } = useBarbeiro();
  const segmentos = useSegments() as string[];

  if (isPending || isError) {
    return (
      <View style={styles.centro}>
        {isError ? <EstadoErro texto="Não deu para abrir sua conta." onTentar={() => refetch()} /> : <Carregando />}
      </View>
    );
  }

  // Explicit redirects (not Stack.Protected): with a guard, a blocked URL
  // falls back to the first unguarded screen (e.g. /planos), not to onboarding.
  const precisaOnboarding = !barbeiro.onboarding_concluido;
  const naOnboarding = segmentos.includes('onboarding');
  if (precisaOnboarding && !naOnboarding) return <Redirect href="/onboarding" />;
  if (!precisaOnboarding && naOnboarding) return <Redirect href="/" />;

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
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: color.bg },
});
