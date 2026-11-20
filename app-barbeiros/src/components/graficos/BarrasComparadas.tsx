// Horizontal bars, this month vs last month per item (service or product).
// Ordinal pair (same green, two steps). Value of this month labeled at the
// bar end; the rest on touch and in the table.
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { grafico } from '@/theme/grafico';
import { space } from '@/theme/tokens';

import { Texto } from '../Texto';
import { BlocoGrafico } from './BlocoGrafico';

export type ItemComparado = { nome: string; atual: number; anterior: number };

type Props = {
  titulo: string;
  itens: ItemComparado[];
  /** How a value is written (quantities by default; money on the owner's panel). */
  formatar?: (v: number) => string;
  testID?: string;
};

export function BarrasComparadas({ titulo, itens, formatar = String, testID }: Props) {
  const [tocado, setTocado] = useState<number | null>(null);
  const max = Math.max(1, ...itens.flatMap((i) => [i.atual, i.anterior]));
  const item = tocado !== null ? itens[tocado] : null;
  return (
    <BlocoGrafico
      testID={testID}
      titulo={titulo}
      legenda={[{ rotulo: 'Este mês', cor: grafico.atual }, { rotulo: 'Mês anterior', cor: grafico.anterior }]}
      destaque={item ? `${item.nome}: ${formatar(item.atual)} este mês · ${formatar(item.anterior)} no anterior` : null}
      tabela={{ colunas: ['Item', 'Este mês', 'Anterior'], linhas: itens.map((i) => [i.nome, formatar(i.atual), formatar(i.anterior)]) }}
    >
      <View style={styles.lista}>
        {itens.map((i, idx) => (
          <Pressable key={i.nome} onPress={() => setTocado(idx)} onHoverIn={() => setTocado(idx)}
            accessibilityLabel={`${i.nome}: ${formatar(i.atual)} este mês, ${formatar(i.anterior)} no mês anterior`} style={styles.linha}>
            <Texto variante="bodySm" peso="medium">{i.nome}</Texto>
            <View style={styles.barraLinha}>
              <View style={[styles.barra, { width: `${(i.atual / max) * 88}%`, backgroundColor: grafico.atual }]} />
              <Texto variante="caption" numero>{formatar(i.atual)}</Texto>
            </View>
            <View style={[styles.barra, { width: `${(i.anterior / max) * 88}%`, backgroundColor: grafico.anterior }]} />
          </Pressable>
        ))}
      </View>
    </BlocoGrafico>
  );
}

const styles = StyleSheet.create({
  lista: { gap: space[3] },
  linha: { gap: 2, paddingVertical: 2 },
  barraLinha: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  barra: { height: 10, minWidth: 2, borderTopRightRadius: 4, borderBottomRightRadius: 4 },
});
