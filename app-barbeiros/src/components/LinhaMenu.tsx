// Menu row: label, optional detail and lock, chevron. 52 px tall.
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { color, space } from '@/theme/tokens';

import { Texto } from './Texto';

type Props = { rotulo: string; detalhe?: string; bloqueado?: boolean; onPress: () => void; perigo?: boolean; testID?: string };

export function LinhaMenu({ rotulo, detalhe, bloqueado = false, onPress, perigo = false, testID }: Props) {
  return (
    <Pressable onPress={onPress} testID={testID} accessibilityRole="button"
      accessibilityLabel={`${rotulo}${detalhe ? `, ${detalhe}` : ''}${bloqueado ? ', plano superior' : ''}`}
      style={({ pressed }) => [styles.linha, pressed ? styles.pressionado : null]}>
      <View style={styles.textos}>
        <Texto peso="medium" cor={perigo ? 'danger' : 'text'}>{rotulo}</Texto>
        {detalhe ? <Texto variante="caption" cor="textMuted">{detalhe}</Texto> : null}
      </View>
      {bloqueado ? <SymbolView name={{ ios: 'lock.fill', android: 'lock', web: 'lock' }} tintColor={color.textMuted} size={16} /> : null}
      <SymbolView name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }} tintColor={color.textMuted} size={18} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  linha: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[2],
    borderBottomWidth: 1, borderBottomColor: color.border },
  pressionado: { backgroundColor: color.surface },
  textos: { flex: 1, gap: 2 },
});
