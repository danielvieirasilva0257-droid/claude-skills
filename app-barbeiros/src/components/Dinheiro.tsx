// Money on screen: formatted only (the database calculates), tabular figures,
// and hidden when the barber taps the eye.
import { usePreferencias } from '@/features/conta/preferencias';
import { formatMoeda, VALOR_OCULTO } from '@/lib/format';

import { Texto, type TextoProps } from './Texto';

type Props = Omit<TextoProps, 'children'> & { valor: number | string | null | undefined; sinal?: '+' | '−' };

export function Dinheiro({ valor, sinal, ...props }: Props) {
  const oculto = usePreferencias((s) => s.ocultarValores);
  const texto = oculto ? VALOR_OCULTO : formatMoeda(valor);
  return (
    <Texto numero {...props} accessibilityLabel={oculto ? 'Valor escondido' : undefined}>
      {sinal && !oculto ? `${sinal} ` : ''}
      {texto}
    </Texto>
  );
}
