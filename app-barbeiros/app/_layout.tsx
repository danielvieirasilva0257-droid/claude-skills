import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { iniciarSessao, useSessao } from '@/features/auth/sessao';
import { queryClient } from '@/lib/queryClient';
import { fontAssets } from '@/theme/fonts';
import { color } from '@/theme/tokens';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();
iniciarSessao();

export default function RootLayout() {
  const [fontesProntas, erroFonte] = useFonts(fontAssets);
  const sessaoPronta = useSessao((s) => s.pronto);
  const logado = useSessao((s) => s.session !== null);

  useEffect(() => {
    if (erroFonte) throw erroFonte;
  }, [erroFonte]);

  const pronto = fontesProntas && sessaoPronta;

  useEffect(() => {
    if (pronto) SplashScreen.hideAsync();
  }, [pronto]);

  if (!pronto) return null;

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: styles.root }}>
            <Stack.Protected guard={logado}>
              <Stack.Screen name="(tabs)" />
            </Stack.Protected>
            <Stack.Protected guard={!logado}>
              <Stack.Screen name="(auth)/entrar" />
            </Stack.Protected>
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
});
