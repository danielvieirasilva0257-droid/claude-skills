// Screen of a higher plan: the barber's real data, blurred, behind a lock in
// the plan's metal color, and "Conhecer o plano". No countdown, no guilt.
import { SymbolView } from 'expo-symbols';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { NOME_PLANO, type Plano } from '@/lib/plano';
import { color, plano as corPlano, radius, space } from '@/theme/tokens';

import { Desfoque } from './Desfoque';
import { DuoButton } from './DuoButton';
import { Texto } from './Texto';
import { Vidro } from './Vidro';

type Props = {
  plano: Exclude<Plano, 'gratis'>;
  titulo: string;
  descricao: string;
  /** Real data preview, rendered under the blur and hidden from screen readers. */
  previa: ReactNode;
  onConhecer: () => void;
};

export function LockedScreen({ plano, titulo, descricao, previa, onConhecer }: Props) {
  return (
    <View style={styles.raiz} testID="tela-bloqueada">
      <View style={styles.previa} pointerEvents="none" importantForAccessibility="no-hide-descendants" aria-hidden>
        {previa}
      </View>
      <Desfoque intensidade={28} style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, styles.veu]} />
      <Vidro tom="forte" style={styles.cartao}>
        <View style={[styles.cadeado, { borderColor: corPlano[plano] }]}>
          <SymbolView name={{ ios: 'lock.fill', android: 'lock', web: 'lock' }} tintColor={corPlano[plano]} size={28} />
        </View>
        <Texto variante="caption" cor="textMuted">
          Disponível no plano {NOME_PLANO[plano]}
        </Texto>
        <Texto variante="h2" centro accessibilityRole="header">
          {titulo}
        </Texto>
        <Texto variante="bodySm" cor="textMuted" centro>
          {descricao}
        </Texto>
        <DuoButton rotulo="Conhecer o plano" onPress={onConhecer} style={styles.botao} testID="conhecer-plano" />
      </Vidro>
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: color.bg },
  previa: { flex: 1, padding: space[4], gap: space[4] },
  veu: { backgroundColor: color.overlay, opacity: 0.5 },
  cartao: {
    position: 'absolute',
    left: space[4],
    right: space[4],
    top: '22%',
    padding: space[5],
    alignItems: 'center',
    gap: space[2],
  },
  cadeado: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.surface,
  },
  botao: { alignSelf: 'stretch', marginTop: space[2] },
});
