// Table view of a chart (accessibility: identity and value never by color alone).
import { StyleSheet, View } from 'react-native';

import { color, space } from '@/theme/tokens';

import { Texto } from '../Texto';

export function Tabela({ colunas, linhas }: { colunas: string[]; linhas: (string | number)[][] }) {
  return (
    <View accessibilityRole="list" style={styles.tabela}>
      <View style={[styles.linha, styles.cabecalho]}>
        {colunas.map((c, i) => (
          <Texto key={c} variante="caption" cor="textMuted" style={i === 0 ? styles.primeira : styles.celula}>{c}</Texto>
        ))}
      </View>
      {linhas.map((l, j) => (
        <View key={j} style={styles.linha}>
          {l.map((v, i) => (
            <Texto key={i} variante="bodySm" numero style={i === 0 ? styles.primeira : styles.celula}>{String(v)}</Texto>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabela: { borderTopWidth: 1, borderTopColor: color.border },
  linha: { flexDirection: 'row', paddingVertical: space[2], borderBottomWidth: 1, borderBottomColor: color.border, gap: space[2] },
  cabecalho: { paddingVertical: space[1] },
  primeira: { flex: 1.4 },
  celula: { flex: 1, textAlign: 'right' },
});
