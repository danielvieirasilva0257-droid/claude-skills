// AI insight: soft blue, "IA" tag, title (≤ 5 words), the number that proves
// it, why, today's action and a button. Text comes from the database
// (ia_insights); numbers inside it were calculated by the database.
import { StyleSheet, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { color, space } from '@/theme/tokens';

import { SecondaryButton } from './SecondaryButton';
import { Texto } from './Texto';
import { Vidro } from './Vidro';

export type Insight = {
  titulo: string;
  numero?: string | null;
  porque?: string | null;
  acao?: string | null;
  botao?: string | null;
};

type Props = Insight & {
  onPress?: () => void;
  testID?: string;
};

export function InsightCard({ titulo, numero, porque, acao, botao, onPress, testID }: Props) {
  return (
    <Vidro tom="ia" style={styles.cartao} testID={testID}>
      <View style={styles.topo}>
        <SymbolView name={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }} tintColor={color.ai} size={18} />
        <Texto variante="caption" cor="ai" peso="semibold">
          IA
        </Texto>
      </View>
      <Texto variante="h3" cor="ai" accessibilityRole="header">
        {titulo}
      </Texto>
      {numero ? (
        <Texto variante="body" peso="semibold" numero>
          {numero}
        </Texto>
      ) : null}
      {porque ? <Texto variante="bodySm" cor="textMuted">{porque}</Texto> : null}
      {acao ? <Texto variante="bodySm">{acao}</Texto> : null}
      {botao && onPress ? <SecondaryButton rotulo={botao} tom="ia" compacto onPress={onPress} /> : null}
    </Vidro>
  );
}

const styles = StyleSheet.create({
  cartao: { padding: space[4], gap: space[2] },
  topo: { flexDirection: 'row', alignItems: 'center', gap: space[1] },
});
