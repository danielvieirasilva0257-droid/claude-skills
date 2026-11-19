// Icon-only button: 44×44 touch target and a spoken label.
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';

import { useFocoVisivel } from '@/lib/useFocoVisivel';
import { color, radius } from '@/theme/tokens';

type Props = { icone: SymbolViewProps['name']; rotulo: string; onPress: () => void; cor?: keyof typeof color; testID?: string };

export function BotaoIcone({ icone, rotulo, onPress, cor = 'text', testID }: Props) {
  const { foco, onFocus, onBlur } = useFocoVisivel();
  return (
    <Pressable onPress={onPress} onFocus={onFocus} onBlur={onBlur} accessibilityRole="button" accessibilityLabel={rotulo}
      testID={testID} hitSlop={4} style={({ pressed }) => [styles.base, pressed ? styles.pressionado : null, foco ? styles.foco : null]}>
      <SymbolView name={icone} tintColor={color[cor]} size={24} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { width: 44, height: 44, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  pressionado: { backgroundColor: color.surface },
  foco: { outlineColor: color.brand, outlineStyle: 'solid', outlineWidth: 2, outlineOffset: 2 },
});
