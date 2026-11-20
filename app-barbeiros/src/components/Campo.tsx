// Form field: label above, help below, error with icon and text (not only color).
import { useId, useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { inter } from '@/theme/fonts';
import { color, radius, size, space } from '@/theme/tokens';

import { Texto } from './Texto';

type Props = Omit<TextInputProps, 'style'> & {
  rotulo: string;
  erro?: string | null;
  ajuda?: string;
  prefixo?: string;
};

export function Campo({ rotulo, erro, ajuda, prefixo, testID, ...input }: Props) {
  const id = useId();
  const [foco, setFoco] = useState(false);
  return (
    <View style={styles.campo}>
      <Texto variante="bodySm" peso="medium" nativeID={`${id}-rotulo`}>
        {rotulo}
      </Texto>
      <View style={[styles.caixa, foco ? styles.caixaFoco : null, erro ? styles.caixaErro : null]}>
        {prefixo ? (
          <Texto variante="body" cor="textMuted">
            {prefixo}
          </Texto>
        ) : null}
        <TextInput
          testID={testID}
          aria-labelledby={`${id}-rotulo`}
          accessibilityLabel={rotulo}
          placeholderTextColor={color.textMuted}
          onFocus={(e) => {
            setFoco(true);
            input.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFoco(false);
            input.onBlur?.(e);
          }}
          {...input}
          style={styles.input}
        />
      </View>
      {erro ? (
        <Texto variante="bodySm" peso="medium" cor="danger" accessibilityLiveRegion="polite">
          ⚠ {erro}
        </Texto>
      ) : ajuda ? (
        <Texto variante="caption" cor="textMuted">
          {ajuda}
        </Texto>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  campo: { gap: space[2] },
  caixa: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.md,
    paddingHorizontal: space[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    backgroundColor: color.surface,
  },
  caixaFoco: { borderColor: color.brand, borderWidth: 2, paddingHorizontal: space[4] - 1 },
  caixaErro: { borderColor: color.danger, borderWidth: 2, paddingHorizontal: space[4] - 1 },
  input: { ...inter('regular'), flex: 1, fontSize: size.body, color: color.text, minHeight: 48, outlineStyle: 'none' } as never,
});
