// "Fale com a IA" button (the final name comes from Daniel): opens the voice
// conversation. Lavender is the AI colour (DESIGN.md); glass via Vidro.
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { Texto } from '@/components/Texto';
import { Vidro } from '@/components/Vidro';
import { color, radius, space } from '@/theme/tokens';

export const NOME_IA = 'Fale com a IA';

export function FaleComIA({ grande = false, testID = 'fale-com-ia' }: { grande?: boolean; testID?: string }) {
  return (
    <Pressable onPress={() => router.push('/ia/voz')} accessibilityRole="button" accessibilityLabel={NOME_IA}
      accessibilityHint="Abre a conversa por voz com a IA" testID={testID}>
      {({ pressed }) => (
        <Vidro tom="ia" raio={radius.pill} style={{ ...styles.pilula, ...(grande ? styles.grande : {}), ...(pressed ? styles.pressionado : {}) }}>
          <View style={[styles.icone, grande ? styles.iconeGrande : null]}>
            <SymbolView name={{ ios: 'waveform', android: 'graphic_eq', web: 'graphic_eq' }} tintColor={color.onLight} size={grande ? 24 : 18} />
          </View>
          <Texto peso="semibold" variante={grande ? 'h3' : 'body'} style={styles.flex}>{NOME_IA}</Texto>
          <SymbolView name={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }} tintColor={color.ai} size={grande ? 24 : 20} />
        </Vidro>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pilula: { minHeight: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: space[2], paddingRight: space[5], gap: space[3] },
  grande: { minHeight: 72, paddingHorizontal: space[3] },
  pressionado: { opacity: 0.85 },
  icone: { width: 36, height: 36, borderRadius: radius.pill, backgroundColor: color.ai, alignItems: 'center', justifyContent: 'center' },
  iconeGrande: { width: 48, height: 48 },
  flex: { flex: 1 },
});
