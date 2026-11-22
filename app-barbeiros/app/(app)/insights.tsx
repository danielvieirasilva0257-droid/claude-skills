// Insights da IA: up to 3 cards (database signals, AI wording) + this
// week's summary as a carousel. The numbers in the cards are the database's.
import { Stack, router, type Href } from 'expo-router';
import { Platform, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { Cartao } from '@/components/Cartao';
import { Dinheiro } from '@/components/Dinheiro';
import { Carregando, EstadoErro, EstadoVazio } from '@/components/Estado';
import { InsightCard } from '@/components/InsightCard';
import { SecondaryButton } from '@/components/SecondaryButton';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { Comparacoes } from '@/components/Variacao';
import { useGerarInsights, useInsights, useResumoSemana } from '@/features/pago/api';
import { PortaPlano } from '@/features/planos/PortaPlano';
import { formatDiaLongo } from '@/lib/format';
import { space } from '@/theme/tokens';

const DESTINO: Record<string, Href> = {
  'Ver narrativas': '/coach', 'Ver coach': '/coach', 'Ver clientes': '/clientes', 'Ver extrato': '/extrato',
  'Ver meta': '/meta', 'Ver relatórios': '/relatorios',
};

const DIAS_SEMANA = ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo'];

function Semana() {
  const s = useResumoSemana();
  const { width } = useWindowDimensions();
  const largura = Math.min(width, 520) - 32;
  if (!s.data) return null;
  const d = s.data;
  // Monday to today vs Monday to the same weekday of last week (from the database).
  const ateDia = d.ate_dia_semana && d.ate_dia_semana > 1 ? DIAS_SEMANA[d.ate_dia_semana - 1] : null;
  const cartoes = [
    <Cartao key="fat" style={{ width: largura }}>
      <Texto variante="caption" cor="textMuted">Faturamento da semana{ateDia ? `, de segunda até ${ateDia}` : ''}</Texto>
      <Dinheiro variante="h2" valor={d.faturamento} />
      <Comparacoes anterior={d.variacao} media={d.vs_media} sufixo="vs semana passada" />
    </Cartao>,
    <Cartao key="atend" style={{ width: largura }}>
      <Texto variante="caption" cor="textMuted">Atendimentos</Texto>
      <Texto variante="h2" numero>{d.atendimentos}</Texto>
      <Texto variante="caption" cor="textMuted" numero>{d.atendimentos_anterior} na semana passada, até o mesmo dia</Texto>
    </Cartao>,
    <Cartao key="ofertas" style={{ width: largura }}>
      <Texto variante="caption" cor="textMuted">Ofertas</Texto>
      <Texto variante="h2" numero>{d.ofertas_aceitas} de {d.ofertas}</Texto>
      <Texto variante="caption" cor="textMuted">aceitas nesta semana</Texto>
    </Cartao>,
    ...(d.melhor_dia ? [
      <Cartao key="dia" style={{ width: largura }}>
        <Texto variante="caption" cor="textMuted">Melhor dia (2 semanas)</Texto>
        <Texto variante="h3">{formatDiaLongo(d.melhor_dia.dia)}</Texto>
        <Dinheiro variante="body" valor={d.melhor_dia.faturamento} />
      </Cartao>,
    ] : []),
  ];
  return (
    <View style={styles.bloco}>
      <Texto variante="h3" accessibilityRole="header">Resumo da semana</Texto>
      <ScrollView tabIndex={Platform.OS === 'web' ? 0 : undefined} accessibilityLabel="Resumo da semana" horizontal snapToInterval={largura + space[3]} decelerationRate="fast" showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carrossel} testID="carrossel-semana">
        {cartoes}
      </ScrollView>
    </View>
  );
}

function Insights() {
  const insights = useInsights();
  const gerar = useGerarInsights();
  return (
    <TelaBase titulo="Insights" semTitulo onAtualizar={() => insights.refetch()}>
      <Stack.Screen options={{ title: 'Insights da IA' }} />
      <Texto variante="bodySm" cor="textMuted">Os números vêm do app. A IA só explica e sugere o que fazer hoje.</Texto>
      {insights.isPending ? <Carregando /> : insights.isError ? <EstadoErro onTentar={() => insights.refetch()} /> :
        insights.data.length === 0 ? (
          <EstadoVazio titulo="Nenhum insight hoje ainda" texto="Eles chegam toda manhã e quando você fecha o caixa." />
        ) : insights.data.map((i) => (
          <InsightCard key={i.id} testID="insight" titulo={i.titulo} numero={i.numero} porque={i.porque} acao={i.acao} botao={i.botao}
            onPress={i.botao && DESTINO[i.botao] ? () => router.push(DESTINO[i.botao!]!) : undefined} />
        ))}
      <SecondaryButton testID="gerar-insights" rotulo="Gerar agora" tom="ia" carregando={gerar.isPending} onPress={() => gerar.mutate()} />
      {gerar.isError ? <Texto cor="danger" peso="medium">⚠ {gerar.error.message}</Texto> : null}
      <Semana />
    </TelaBase>
  );
}

export default function TelaInsights() {
  return (
    <PortaPlano recurso="insights" titulo="Insights da IA" descricao="Até 3 dicas por dia com os seus números: o que está perdendo e o que fazer hoje."
      previa={<Texto variante="title">Insights</Texto>}>
      <Insights />
    </PortaPlano>
  );
}

const styles = StyleSheet.create({
  bloco: { gap: space[2] },
  carrossel: { gap: space[3] },
});
