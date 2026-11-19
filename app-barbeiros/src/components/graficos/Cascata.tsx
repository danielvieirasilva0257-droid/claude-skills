// Waterfall of the monthly statement: totals in green, deductions in neutral
// with "−", a negative result in the loss color with "▼".
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { grafico } from '@/theme/grafico';
import { color, space } from '@/theme/tokens';

import { Texto } from '../Texto';
import { BlocoGrafico } from './BlocoGrafico';

export type Degrau = { rotulo: string; valor: number; texto: string; tipo: 'total' | 'mais' | 'menos' };

const ALTURA = 160;

export function Cascata({ titulo, degraus, testID }: { titulo: string; degraus: Degrau[]; testID?: string }) {
  const [tocado, setTocado] = useState<number | null>(null);
  // Geometry only: running level of each step (the numbers shown come from the database).
  let nivel = 0;
  const barras = degraus.map((d) => {
    const de = d.tipo === 'total' ? 0 : nivel;
    const ate = d.tipo === 'total' ? d.valor : d.tipo === 'mais' ? nivel + d.valor : nivel - d.valor;
    nivel = ate;
    return { ...d, de, ate };
  });
  const max = Math.max(1, ...barras.flatMap((b) => [b.de, b.ate]));
  const min = Math.min(0, ...barras.flatMap((b) => [b.de, b.ate]));
  const escala = ALTURA / (max - min);
  const y = (v: number) => (max - v) * escala;
  const t = tocado !== null ? degraus[tocado] : null;
  const sinal = (d: Degrau) => (d.tipo === 'menos' ? '− ' : d.tipo === 'mais' ? '+ ' : d.valor < 0 ? '▼ ' : '');
  return (
    <BlocoGrafico
      testID={testID}
      titulo={titulo}
      destaque={t ? `${t.rotulo}: ${sinal(t)}${t.texto}` : null}
      tabela={{ colunas: ['Etapa', 'Valor'], linhas: degraus.map((d) => [d.rotulo, `${sinal(d)}${d.texto}`]) }}
    >
      <View style={[styles.area, { height: ALTURA }]}>
        <View style={[styles.base, { top: y(0) }]} />
        {barras.map((b, i) => {
          const topo = y(Math.max(b.de, b.ate));
          const altura = Math.max(2, Math.abs(b.ate - b.de) * escala);
          const cor = b.tipo === 'menos' ? grafico.deducao : b.tipo === 'total' && b.valor < 0 ? grafico.negativo : grafico.atual;
          return (
            <Pressable key={b.rotulo} style={styles.coluna} onPress={() => setTocado(i)} onHoverIn={() => setTocado(i)}
              accessibilityLabel={`${b.rotulo}: ${sinal(b)}${b.texto}`}>
              <View style={[styles.barra, { top: topo, height: altura, backgroundColor: cor }]} />
            </Pressable>
          );
        })}
      </View>
      <View style={styles.rotulos}>
        {degraus.map((d) => (
          <Texto key={d.rotulo} variante="tiny" cor="textMuted" centro style={styles.rotulo} numberOfLines={2}>{d.rotulo}</Texto>
        ))}
      </View>
    </BlocoGrafico>
  );
}

const styles = StyleSheet.create({
  area: { flexDirection: 'row', gap: space[2] },
  base: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: color.border },
  coluna: { flex: 1, height: '100%' },
  barra: { position: 'absolute', left: 0, right: 0, borderRadius: 4 },
  rotulos: { flexDirection: 'row', gap: space[2], marginTop: space[1] },
  rotulo: { flex: 1 },
});
