// Chart frame: title, legend (always for 2+ series), the chart, the touched
// value, and "Ver em tabela".
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { color, radius, space } from '@/theme/tokens';

import { Cartao } from '../Cartao';
import { Texto } from '../Texto';
import { Tabela } from './Tabela';

export type ItemLegenda = { rotulo: string; cor: string };

type Props = {
  titulo: string;
  legenda?: ItemLegenda[];
  destaque?: string | null;
  tabela: { colunas: string[]; linhas: (string | number)[][] };
  children: ReactNode;
  testID?: string;
};

export function BlocoGrafico({ titulo, legenda, destaque, tabela, children, testID }: Props) {
  const [verTabela, setVerTabela] = useState(false);
  return (
    <Cartao testID={testID}>
      <Texto variante="h3" accessibilityRole="header">{titulo}</Texto>
      {legenda && legenda.length > 1 ? (
        <View style={styles.legenda}>
          {legenda.map((l) => (
            <View key={l.rotulo} style={styles.itemLegenda}>
              <View style={[styles.amostra, { backgroundColor: l.cor }]} />
              <Texto variante="caption" cor="textMuted">{l.rotulo}</Texto>
            </View>
          ))}
        </View>
      ) : null}
      <Texto variante="bodySm" cor="text" numero accessibilityLiveRegion="polite" style={styles.destaque}>
        {destaque ?? 'Toque numa barra para ver o valor.'}
      </Texto>
      {verTabela ? <Tabela {...tabela} /> : children}
      <Pressable onPress={() => setVerTabela((v) => !v)} accessibilityRole="button" style={styles.alternar} hitSlop={6}>
        <Texto variante="caption" peso="semibold" cor="brandLip">{verTabela ? 'Ver gráfico' : 'Ver em tabela'}</Texto>
      </Pressable>
    </Cartao>
  );
}

const styles = StyleSheet.create({
  legenda: { flexDirection: 'row', gap: space[4], flexWrap: 'wrap' },
  itemLegenda: { flexDirection: 'row', alignItems: 'center', gap: space[1] },
  amostra: { width: 12, height: 12, borderRadius: radius.sm / 2 },
  destaque: { minHeight: 20 },
  alternar: { alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center' },
});
