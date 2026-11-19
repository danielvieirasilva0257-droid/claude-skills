// Plans: what each one unlocks, price with renewal stated, no countdown.
// Phase 7 connects the purchase (RevenueCat) to "Assinar".
import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Cartao } from '@/components/Cartao';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { usePlano } from '@/features/conta/barbeiro';
import { NOME_PLANO, PRECO_PLANO, type Plano } from '@/lib/plano';
import { color, plano as corPlano, radius, space } from '@/theme/tokens';

const O_QUE_LIBERA: Record<Plano, string[]> = {
  gratis: ['Agenda e lançamento em 2 toques', 'Serviços e combos', 'Exportar seus dados'],
  pago: ['Clientes com ficha e sumidos', 'Gastos, financeiro e meta do mês', 'Relatórios e gráficos', 'IA: insights, chat e coach de vendas', 'Comissão, extrato e MEI'],
  premium: ['Tudo do Pago', 'WhatsApp com IA (responde e agenda)', 'Automações e lista de espera', '100 mensagens de marketing por mês'],
  plus: ['Tudo do Premium', 'Instagram com IA (comentários e direct)', 'Prospecção com origem por canal', 'Personalidade da IA'],
  barbearias: ['Tudo do Premium para a equipe', 'Painel do dono e agenda da equipe', 'Relatório por barbeiro'],
};

export default function Planos() {
  const atual = usePlano();
  const { destaque } = useLocalSearchParams<{ destaque?: Plano }>();
  return (
    <TelaBase titulo="Planos" semTitulo>
      <Stack.Screen options={{ title: 'Planos' }} />
      <Texto cor="textMuted">Preço de renovação igual ao da assinatura. Cancele quando quiser, pelo mesmo lugar onde assinou.</Texto>
      {(Object.keys(NOME_PLANO) as Plano[]).map((p) => (
        <Cartao key={p} testID={`plano-${p}`} style={p === destaque ? styles.destaque : undefined}>
          <View style={styles.topo}>
            <View style={[styles.selo, { borderColor: corPlano[p] }]} />
            <Texto variante="h3" style={styles.flex}>{NOME_PLANO[p]}</Texto>
            {atual.data === p ? <Texto variante="caption" peso="semibold" cor="brandLip">✓ Seu plano</Texto> : null}
          </View>
          <Texto peso="semibold" numero>{PRECO_PLANO[p]}</Texto>
          {O_QUE_LIBERA[p].map((l) => (
            <Texto key={l} variante="bodySm" cor="textMuted">• {l}</Texto>
          ))}
        </Cartao>
      ))}
    </TelaBase>
  );
}

const styles = StyleSheet.create({
  topo: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  flex: { flex: 1 },
  selo: { width: 14, height: 14, borderRadius: radius.pill, borderWidth: 4 },
  destaque: { borderColor: color.brand, borderWidth: 2 },
});
