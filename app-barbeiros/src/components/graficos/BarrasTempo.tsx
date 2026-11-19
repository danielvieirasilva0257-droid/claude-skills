// Vertical bars over time (one series), negative values below the baseline in
// the loss color with "▼" in the readout. Labels only at the ends.
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { grafico } from '@/theme/grafico';
import { color, space } from '@/theme/tokens';

import { Texto } from '../Texto';
import { BlocoGrafico } from './BlocoGrafico';

export type PontoTempo = { rotulo: string; valor: number; texto: string };

const ALTURA = 140;

export function BarrasTempo({ titulo, pontos, rotuloValor, testID }: { titulo: string; pontos: PontoTempo[]; rotuloValor: string; testID?: string }) {
  const [tocado, setTocado] = useState<number | null>(null);
  const max = Math.max(0, ...pontos.map((p) => p.valor));
  const min = Math.min(0, ...pontos.map((p) => p.valor));
  const faixa = max - min || 1;
  const base = (max / faixa) * ALTURA; // baseline distance from the top
  const p = tocado !== null ? pontos[tocado] : null;
  return (
    <BlocoGrafico
      testID={testID}
      titulo={titulo}
      destaque={p ? `${p.rotulo}: ${p.valor < 0 ? '▼ ' : ''}${p.texto}` : null}
      tabela={{ colunas: ['Período', rotuloValor], linhas: pontos.map((x) => [x.rotulo, `${x.valor < 0 ? '▼ ' : ''}${x.texto}`]) }}
    >
      <View style={[styles.area, { height: ALTURA }]} accessibilityLabel={`${titulo}, ${pontos.length} períodos`}>
        <View style={[styles.linhaBase, { top: base }]} />
        {pontos.map((x, i) => {
          const altura = (Math.abs(x.valor) / faixa) * ALTURA;
          const negativo = x.valor < 0;
          return (
            <Pressable key={`${x.rotulo}-${i}`} style={styles.coluna} onPress={() => setTocado(i)} onHoverIn={() => setTocado(i)}
              accessibilityLabel={`${x.rotulo}: ${negativo ? 'negativo ' : ''}${x.texto}`}>
              <View style={[styles.barra, negativo ? styles.barraNegativa : styles.barraPositiva,
                { height: Math.max(altura, x.valor === 0 ? 0 : 2), backgroundColor: negativo ? grafico.negativo : grafico.atual },
                negativo ? { top: base } : { bottom: ALTURA - base },
                tocado === i ? styles.tocada : null]} />
            </Pressable>
          );
        })}
      </View>
      <View style={styles.eixo}>
        <Texto variante="tiny" cor="textMuted">{pontos[0]?.rotulo}</Texto>
        <Texto variante="tiny" cor="textMuted">{pontos.at(-1)?.rotulo}</Texto>
      </View>
    </BlocoGrafico>
  );
}

const styles = StyleSheet.create({
  area: { flexDirection: 'row', gap: 2 },
  linhaBase: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: color.border },
  coluna: { flex: 1, height: '100%', minWidth: 6 },
  barra: { position: 'absolute', left: 0, right: 0 },
  barraPositiva: { borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  barraNegativa: { borderBottomLeftRadius: 4, borderBottomRightRadius: 4 },
  tocada: { opacity: 0.75 },
  eixo: { flexDirection: 'row', justifyContent: 'space-between', marginTop: space[1] },
});
