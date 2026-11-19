import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { inter } from '@/theme/fonts';
import { color, radius, size, space } from '@/theme/tokens';

type Props = {
  rotulo: string;
  onPress: () => void;
  carregando?: boolean;
  variante?: 'principal' | 'secundario';
  testID?: string;
};

/**
 * Plain button for Phase 0 only. Phase 1 replaces it with DuoButton and
 * SecondaryButton (ESPECIFICACAO.md section 7), with their animation.
 */
export function BotaoProvisorio({ rotulo, onPress, carregando = false, variante = 'principal', testID }: Props) {
  const principal = variante === 'principal';
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={carregando}
      accessibilityRole="button"
      accessibilityState={{ disabled: carregando, busy: carregando }}
      style={({ pressed }) => [
        styles.base,
        principal ? styles.principal : styles.secundario,
        pressed ? styles.pressionado : null,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={principal ? color.onBrand : color.brand} />
      ) : (
        <Text style={[styles.rotulo, principal ? styles.rotuloPrincipal : styles.rotuloSecundario]}>{rotulo}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space[5],
  },
  principal: { backgroundColor: color.brand, borderBottomWidth: 4, borderBottomColor: color.brandLip },
  secundario: { backgroundColor: color.bg, borderWidth: 1, borderColor: color.border },
  pressionado: { opacity: 0.85 },
  rotulo: { ...inter('semibold'), fontSize: size.body },
  rotuloPrincipal: { color: color.onBrand },
  rotuloSecundario: { color: color.text },
});
