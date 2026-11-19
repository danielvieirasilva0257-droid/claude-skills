// Change vs the previous period, from the database (fraction). Arrow + text,
// never color alone.
import { formatPorcentagem } from '@/lib/format';

import { Texto } from './Texto';

export function Variacao({ valor, sufixo = 'vs mês anterior' }: { valor: number | string | null | undefined; sufixo?: string }) {
  if (valor === null || valor === undefined) return <Texto variante="caption" cor="textMuted">sem comparação</Texto>;
  const n = Number(valor);
  const seta = n > 0 ? '▲' : n < 0 ? '▼' : '=';
  return (
    <Texto variante="caption" peso="semibold" cor={n > 0 ? 'brandLip' : n < 0 ? 'danger' : 'textMuted'} numero>
      {seta} {formatPorcentagem(Math.abs(n))} {sufixo}
    </Texto>
  );
}
