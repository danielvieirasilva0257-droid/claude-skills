// Money on screen: formatted only (the database calculates), tabular figures,
// and hidden when the barber taps the eye.
import { usePreferencias } from '@/features/conta/preferencias';
import { formatMoeda, VALOR_OCULTO } from '@/lib/format';

import { Texto, type TextoProps } from './Texto';

type Props = Omit<TextoProps, 'children'> & { valor: number | string | null | undefined; sinal?: '+' | '−' };

export function Dinheiro({ valor, sinal, ...props }: Props) {
  const oculto = usePreferencias((s) => s.ocultarValores);
  // With an explicit sign, show the absolute value ("− R$ 19,40", never "− -R$ 19,40").
  const mostrar = sinal && valor !== null && valor !== undefined ? Math.abs(Number(valor)) : valor;
  const texto = oculto ? VALOR_OCULTO : formatMoeda(mostrar);
  return (
    <Texto numero {...props} accessibilityLabel={oculto ? 'Valor escondido' : undefined}>
      {sinal && !oculto ? `${sinal} ` : ''}
      {texto}
    </Texto>
  );
}
