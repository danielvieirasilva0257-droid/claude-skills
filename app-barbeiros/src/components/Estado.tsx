// Empty, loading and error states shared by every data screen.
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { color, space } from '@/theme/tokens';

import { SecondaryButton } from './SecondaryButton';
import { Texto } from './Texto';

export function Carregando({ rotulo = 'Carregando…' }: { rotulo?: string }) {
  return (
    <View style={styles.bloco} accessibilityLiveRegion="polite">
      <ActivityIndicator color={color.brand} />
      <Texto variante="bodySm" cor="textMuted">
        {rotulo}
      </Texto>
    </View>
  );
}

type VazioProps = { titulo: string; texto?: string; acao?: string; onAcao?: () => void; testID?: string };

export function EstadoVazio({ titulo, texto, acao, onAcao, testID }: VazioProps) {
  return (
    <View style={styles.bloco} testID={testID}>
      <Texto variante="body" peso="semibold" centro>
        {titulo}
      </Texto>
      {texto ? (
        <Texto variante="bodySm" cor="textMuted" centro>
          {texto}
        </Texto>
      ) : null}
      {acao && onAcao ? <SecondaryButton rotulo={acao} onPress={onAcao} compacto /> : null}
    </View>
  );
}

type ErroProps = { texto?: string; onTentar?: () => void; testID?: string };

export function EstadoErro({ texto = 'Não deu para carregar.', onTentar, testID }: ErroProps) {
  return (
    <View style={styles.bloco} accessibilityRole="alert" testID={testID}>
      <Texto variante="body" peso="semibold" cor="danger" centro>
        ⚠ {texto}
      </Texto>
      {onTentar ? <SecondaryButton rotulo="Tentar de novo" onPress={onTentar} compacto /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bloco: { alignItems: 'center', justifyContent: 'center', gap: space[2], paddingVertical: space[5] },
});
