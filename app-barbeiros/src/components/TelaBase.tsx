import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { inter } from '@/theme/fonts';
import { color, size, space } from '@/theme/tokens';

type Props = {
  titulo: string;
  children?: ReactNode;
};

/** Screen shell: safe area, white background and the screen title. */
export function TelaBase({ titulo, children }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.titulo} accessibilityRole="header">
          {titulo}
        </Text>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

/** Placeholder text for tabs that are built in later phases. */
export function EmBreve({ fase }: { fase: string }) {
  return <Text style={styles.emBreve}>Esta aba é construída na {fase}.</Text>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  conteudo: { padding: space[4], gap: space[4] },
  titulo: { ...inter('semibold'), fontSize: size.title, color: color.text },
  emBreve: { ...inter('regular'), fontSize: size.body, color: color.textMuted },
});
