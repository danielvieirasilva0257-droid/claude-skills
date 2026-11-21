// Comparisons from the database, never computed on screen. Arrow + text,
// never color alone. Two lines under a number:
//   ▲ 8,2% vs mês passado      (same period: day 1 to today)
//   ▲ 9% acima da média        (average of the last 3 months, same period)
// Within ±3% of the average reads "na média" in the neutral color.
import { StyleSheet, View } from 'react-native';

import { formatDecimal, formatPorcentagem } from '@/lib/format';

import { Texto } from './Texto';

type Valor = number | string | null | undefined;
/** fracao: 0.082 = 8,2% (money, counts) · diferenca: 0.32 more services per client (ratio). */
type Formato = 'fracao' | 'diferenca';

/** Below this distance from the average, the month is "na média". */
export const FAIXA_NA_MEDIA = 0.03;

function numero(valor: Valor): number | null {
  if (valor === null || valor === undefined || valor === '') return null;
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
}

function quanto(n: number, formato: Formato) {
  return formato === 'fracao' ? formatPorcentagem(Math.abs(n)) : formatDecimal(Math.abs(n));
}

/** "▲ 8,2% vs mês passado" · "sem comparação" when there is no base. */
export function Variacao({ valor, sufixo = 'vs mês passado', formato = 'fracao', testID }: { valor: Valor; sufixo?: string; formato?: Formato; testID?: string }) {
  const n = numero(valor);
  if (n === null) return <Texto variante="caption" cor="textMuted" testID={testID}>sem comparação</Texto>;
  const seta = n > 0 ? '▲' : n < 0 ? '▼' : '=';
  return (
    <Texto variante="caption" peso="semibold" cor={n > 0 ? 'brandLip' : n < 0 ? 'danger' : 'textMuted'} numero testID={testID}>
      {seta} {quanto(n, formato)} {sufixo}
    </Texto>
  );
}

/** Where a value stands against the average: acima, abaixo or na média. */
export function posicaoNaMedia(valor: Valor, formato: Formato = 'fracao'): 'acima' | 'abaixo' | 'na_media' | null {
  const n = numero(valor);
  if (n === null) return null;
  const faixa = formato === 'fracao' ? FAIXA_NA_MEDIA : 0.05;
  return Math.abs(n) < faixa ? 'na_media' : n > 0 ? 'acima' : 'abaixo';
}

/** "▲ 9% acima da média" · "≈ na média (1,1% acima)" · nothing when there is no average yet. */
export function VariacaoMedia({ valor, formato = 'fracao', testID }: { valor: Valor; formato?: Formato; testID?: string }) {
  const n = numero(valor);
  const posicao = posicaoNaMedia(valor, formato);
  if (n === null || posicao === null) return null;
  if (posicao === 'na_media') {
    const detalhe = n === 0 ? '' : ` (${quanto(n, formato)} ${n > 0 ? 'acima' : 'abaixo'})`;
    return <Texto variante="caption" peso="semibold" cor="textMuted" numero testID={testID}>≈ na média{detalhe}</Texto>;
  }
  return (
    <Texto variante="caption" peso="semibold" cor={posicao === 'acima' ? 'brandLip' : 'danger'} numero testID={testID}>
      {posicao === 'acima' ? '▲' : '▼'} {quanto(n, formato)} {posicao === 'acima' ? 'acima' : 'abaixo'} da média
    </Texto>
  );
}

/** The two lines together: vs the previous period, then vs the average. */
export function Comparacoes({ anterior, media, sufixo, formato = 'fracao', testID }: {
  anterior: Valor; media: Valor; sufixo?: string; formato?: Formato; testID?: string;
}) {
  return (
    <View style={styles.linhas} testID={testID}>
      <Variacao valor={anterior} sufixo={sufixo} formato={formato} />
      <VariacaoMedia valor={media} formato={formato} />
    </View>
  );
}

const styles = StyleSheet.create({
  linhas: { gap: 1 },
});
