// Início. In Phase 0 it only proves the chain app → login → Supabase → view:
// it reads this month's row of `v_metricas_mes`. The real screen is Phase 2.
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { BotaoProvisorio } from '@/components/BotaoProvisorio';
import { TelaBase } from '@/components/TelaBase';
import { useMetricasMes } from '@/features/relatorios/metricasMes';
import { formatDecimal, formatInteiro, formatMes, formatMoeda, inicioDoMes } from '@/lib/format';
import { inter, tabularNums } from '@/theme/fonts';
import { color, radius, size, space } from '@/theme/tokens';

export default function Inicio() {
  const mes = inicioDoMes();
  const { data, isPending, isError, refetch } = useMetricasMes(mes);

  return (
    <TelaBase titulo="Início">
      <View style={styles.cartao} testID="metricas-mes">
        <Text style={styles.legenda}>Este mês · {formatMes(mes)}</Text>
        {isPending ? (
          <ActivityIndicator color={color.brand} accessibilityLabel="Carregando" />
        ) : isError ? (
          <View style={styles.bloco}>
            <Text style={styles.erro}>⚠ Não deu para carregar os números.</Text>
            <BotaoProvisorio rotulo="Tentar de novo" variante="secundario" onPress={() => refetch()} />
          </View>
        ) : data ? (
          <View style={styles.bloco}>
            <Text style={styles.rotulo}>Faturamento</Text>
            <Text style={styles.valor} testID="metricas-faturamento">
              {formatMoeda(data.faturamento)}
            </Text>
            <View style={styles.linha}>
              <Numero rotulo="Atendimentos" valor={formatInteiro(data.atendimentos)} testID="metricas-atendimentos" />
              <Numero rotulo="Ticket médio" valor={formatMoeda(data.ticket_medio)} />
              <Numero rotulo="Ratio" valor={formatDecimal(data.ratio_servicos_por_cliente)} />
            </View>
          </View>
        ) : (
          <Text style={styles.vazio} testID="metricas-vazio">
            Nenhum atendimento neste mês ainda.
          </Text>
        )}
      </View>
    </TelaBase>
  );
}

function Numero({ rotulo, valor, testID }: { rotulo: string; valor: string; testID?: string }) {
  return (
    <View style={styles.numero}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <Text style={styles.numeroValor} testID={testID}>
        {valor}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cartao: {
    backgroundColor: color.surface,
    borderColor: color.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space[4],
    gap: space[3],
  },
  bloco: { gap: space[2] },
  legenda: { ...inter('medium'), fontSize: size.caption, color: color.textMuted },
  rotulo: { ...inter('regular'), fontSize: size.bodySm, color: color.textMuted },
  valor: { ...inter('semibold'), ...tabularNums, fontSize: size.display, color: color.text },
  linha: { flexDirection: 'row', flexWrap: 'wrap', columnGap: space[4], rowGap: space[3], marginTop: space[2] },
  numero: { flexGrow: 1, minWidth: 104, gap: space[1] },
  numeroValor: { ...inter('semibold'), ...tabularNums, fontSize: size.h3, color: color.text },
  vazio: { ...inter('regular'), fontSize: size.body, color: color.textMuted },
  erro: { ...inter('medium'), fontSize: size.body, color: color.danger },
});
