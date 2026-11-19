// MEI: revenue of the year vs the R$ 81 mil ceiling, alert at 80% and 100%,
// monthly DAS. Values (ceiling, DAS) from the database parameters.
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Cartao } from '@/components/Cartao';
import { Dinheiro } from '@/components/Dinheiro';
import { Carregando, EstadoErro } from '@/components/Estado';
import { MetaRing } from '@/components/MetaRing';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { useMei } from '@/features/pago/api';
import { PortaPlano } from '@/features/planos/PortaPlano';
import { formatMoeda, formatPorcentagem } from '@/lib/format';
import { color, radius, space } from '@/theme/tokens';

function Mei() {
  const mei = useMei();
  if (mei.isPending) return <Carregando />;
  if (mei.isError) return <EstadoErro onTentar={() => mei.refetch()} />;
  const m = mei.data;
  return (
    <TelaBase titulo="MEI" semTitulo onAtualizar={() => mei.refetch()}>
      <Stack.Screen options={{ title: `MEI ${m.ano}` }} />
      {m.alerta !== 'ok' ? (
        <View style={[styles.alerta, { borderColor: m.alerta === '100' ? color.danger : color.warning }]} testID="mei-alerta">
          <Texto peso="semibold" cor={m.alerta === '100' ? 'danger' : 'warning'}>
            ⚠ {m.alerta === '100' ? 'Você passou do limite do MEI.' : 'Você já usou 80% do limite do MEI.'}
          </Texto>
          <Texto variante="bodySm">
            {m.alerta === '100'
              ? 'Converse com um contador: passar até 20% do limite muda a cobrança; mais que isso tira você do MEI.'
              : 'Fique de olho e converse com um contador antes de passar do limite.'}
          </Texto>
        </View>
      ) : null}
      <View style={styles.centro}>
        <MetaRing progresso={Number(m.pct)} emRisco={m.alerta !== 'ok'} accessibilityLabel={`${formatPorcentagem(m.pct)} do limite do MEI`}>
          <Texto variante="h2" numero>{formatPorcentagem(m.pct)}</Texto>
          <Texto variante="caption" cor="textMuted">do limite</Texto>
        </MetaRing>
      </View>
      <Cartao>
        <Texto numero><Dinheiro valor={m.faturamento} peso="semibold" /> de {formatMoeda(m.limite)} em {m.ano}</Texto>
        <Texto variante="bodySm" cor="textMuted" numero>
          Faltam {formatMoeda(m.falta)} · média de {formatMoeda(m.media_mensal)} por mês · no ritmo atual, {formatMoeda(m.projecao_ano)} no ano
        </Texto>
      </Cartao>
      <Cartao>
        <Texto variante="caption" cor="textMuted">DAS do MEI (serviços)</Texto>
        <Texto variante="h2" numero>{formatMoeda(m.das_mensal)} por mês</Texto>
        <Texto variante="bodySm" cor="textMuted" numero>{formatMoeda(m.das_ano)} no ano · vence todo dia 20.</Texto>
      </Cartao>
      <Texto variante="caption" cor="textMuted">O app considera tudo que você lançou como concluído. Confira com o seu contador.</Texto>
    </TelaBase>
  );
}

export default function TelaMei() {
  return (
    <PortaPlano recurso="mei" titulo="MEI" descricao="Quanto você já faturou no ano frente ao limite, com aviso em 80% e 100%."
      previa={<Texto variante="title">MEI</Texto>}>
      <Mei />
    </PortaPlano>
  );
}

const styles = StyleSheet.create({
  centro: { alignItems: 'center' },
  alerta: { borderWidth: 2, borderRadius: radius.lg, padding: space[3], gap: space[1] },
});
