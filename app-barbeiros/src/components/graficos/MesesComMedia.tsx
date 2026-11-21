// Revenue of the last months, each one only up to the same day of the month
// (day 1 to today), with the dashed average line of the 3 previous months.
// One series: this month in lime, past months in the darker step. Every bar
// says where it stands ("acima", "abaixo", "na média"): never color alone.
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { formatMesCurto, formatMoeda, formatMoedaCurta, formatPorcentagem } from '@/lib/format';
import { grafico } from '@/theme/grafico';
import { color, radius, space } from '@/theme/tokens';

import { Texto } from '../Texto';
import { posicaoNaMedia } from '../Variacao';
import { BlocoGrafico } from './BlocoGrafico';

export type MesComparado = {
  mes: string;
  atual: boolean;
  faturamento: number | string;
  atendimentos: number;
  vs_media: number | string | null;
};

const ALTURA = 150;

function situacao(m: MesComparado) {
  const p = posicaoNaMedia(m.vs_media);
  if (p === null) return 'sem dados';
  const n = Math.abs(Number(m.vs_media));
  if (p === 'na_media') return 'na média';
  return `${formatPorcentagem(n)} ${p === 'acima' ? 'acima' : 'abaixo'}`;
}

export function MesesComMedia({ meses, media, ateDia, testID }: {
  meses: MesComparado[]; media: number | string | null | undefined; ateDia: number | null; testID?: string;
}) {
  const [tocado, setTocado] = useState<number | null>(null);
  const valores = meses.map((m) => Number(m.faturamento));
  const nMedia = media === null || media === undefined ? null : Number(media);
  const max = Math.max(1, ...valores, nMedia ?? 0) * 1.12;
  const m = tocado !== null ? meses[tocado] : null;
  const periodo = ateDia ? `do dia 1 ao dia ${ateDia}` : 'mês inteiro';
  return (
    <BlocoGrafico
      testID={testID}
      titulo={ateDia ? `Faturamento até o dia ${ateDia}` : 'Faturamento por mês'}
      legenda={[{ rotulo: 'Este mês', cor: grafico.atual }, { rotulo: 'Meses anteriores', cor: grafico.anterior }]}
      destaque={m ? `${formatMesCurto(m.mes)} (${periodo}): ${formatMoeda(m.faturamento)} · ${m.atendimentos} atendimentos · ${situacao(m)}${posicaoNaMedia(m.vs_media) && posicaoNaMedia(m.vs_media) !== 'na_media' ? ' da média' : ''}`
        : nMedia !== null ? `Média dos 3 meses (${periodo}): ${formatMoeda(nMedia)}` : null}
      tabela={{
        colunas: ['Mês', 'Faturamento', 'Atendimentos', 'vs média'],
        linhas: meses.map((x) => [formatMesCurto(x.mes), formatMoeda(x.faturamento), x.atendimentos, situacao(x)]),
      }}
    >
      <View style={[styles.area, { height: ALTURA }]}>
        {nMedia !== null ? (
          <View pointerEvents="none" style={[styles.media, { bottom: (nMedia / max) * ALTURA }]}
            accessibilityRole="image" accessibilityLabel={`Linha da média: ${formatMoeda(nMedia)}`}>
            <Texto variante="tiny" cor="textMuted" style={styles.mediaRotulo}>média</Texto>
          </View>
        ) : null}
        {meses.map((x, i) => {
          const v = Number(x.faturamento);
          return (
            <Pressable key={x.mes} style={styles.coluna} onPress={() => setTocado(i)} onHoverIn={() => setTocado(i)}
              accessibilityRole="button"
              accessibilityLabel={`${formatMesCurto(x.mes)}${x.atual ? ', este mês' : ''}: ${formatMoeda(v)}, ${situacao(x)}${posicaoNaMedia(x.vs_media) && posicaoNaMedia(x.vs_media) !== 'na_media' ? ' da média' : ''}`}>
              <Texto variante="tiny" cor={x.atual ? 'text' : 'textMuted'} numero style={styles.valor}>{formatMoedaCurta(v)}</Texto>
              <View style={[styles.barra, { height: Math.max(2, (v / max) * (ALTURA - 18)),
                backgroundColor: x.atual ? grafico.atual : grafico.anterior }, tocado === i ? styles.tocada : null]} />
            </Pressable>
          );
        })}
      </View>
      <View style={styles.eixo}>
        {meses.map((x) => (
          <View key={x.mes} style={styles.rotulo}>
            <Texto variante="caption" peso={x.atual ? 'semibold' : 'regular'} cor={x.atual ? 'text' : 'textMuted'}>
              {x.atual ? 'este mês' : formatMesCurto(x.mes)}
            </Texto>
            <Texto variante="tiny" cor={posicaoNaMedia(x.vs_media) === 'acima' ? 'brandLip' : 'textMuted'} numero>
              {posicaoNaMedia(x.vs_media) === 'acima' ? '▲ ' : posicaoNaMedia(x.vs_media) === 'abaixo' ? '▼ ' : ''}{situacao(x)}
            </Texto>
          </View>
        ))}
      </View>
    </BlocoGrafico>
  );
}

const styles = StyleSheet.create({
  area: { flexDirection: 'row', alignItems: 'flex-end', gap: space[3] },
  coluna: { flex: 1, height: '100%', justifyContent: 'flex-end', alignItems: 'stretch' },
  valor: { textAlign: 'center', marginBottom: 2 },
  barra: { borderTopLeftRadius: radius.sm, borderTopRightRadius: radius.sm },
  tocada: { opacity: 0.75 },
  media: { position: 'absolute', left: 0, right: 0, borderTopWidth: 1, borderStyle: 'dashed', borderColor: color.textMuted, zIndex: 1 },
  mediaRotulo: { position: 'absolute', right: 0, top: -16 },
  eixo: { flexDirection: 'row', gap: space[3], marginTop: space[1] },
  rotulo: { flex: 1, alignItems: 'center' },
});
