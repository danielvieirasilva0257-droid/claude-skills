// Financeiro: revenue, expenses and profit by day, week or month.
import { Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Cartao } from '@/components/Cartao';
import { Chip } from '@/components/Chip';
import { Dinheiro } from '@/components/Dinheiro';
import { Carregando, EstadoErro } from '@/components/Estado';
import { BarrasTempo } from '@/components/graficos/BarrasTempo';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { useFinanceiro, type Agrupar } from '@/features/pago/api';
import { PortaPlano } from '@/features/planos/PortaPlano';
import { diaISO, formatMoeda, somarDias } from '@/lib/format';
import { space } from '@/theme/tokens';

const PERIODOS: Record<Exclude<Agrupar, 'total'>, { rotulo: string; dias: number }> = {
  day: { rotulo: 'Dia', dias: 13 },
  week: { rotulo: 'Semana', dias: 7 * 8 - 1 },
  month: { rotulo: 'Mês', dias: 31 * 6 },
};

function rotuloPeriodo(iso: string, agrupar: Agrupar) {
  const [y, m, d] = iso.split('-');
  return agrupar === 'month' ? `${m}/${y?.slice(2)}` : `${d}/${m}`;
}

function Financeiro() {
  const [agrupar, setAgrupar] = useState<Exclude<Agrupar, 'total'>>('day');
  const [medida, setMedida] = useState<'faturamento' | 'lucro'>('faturamento');
  const fim = diaISO();
  const inicio = somarDias(fim, -PERIODOS[agrupar].dias);
  const serie = useFinanceiro(inicio, fim, agrupar);
  const total = useFinanceiro(inicio, fim, 'total');
  const t = total.data?.[0];

  return (
    <TelaBase titulo="Financeiro" semTitulo onAtualizar={() => { serie.refetch(); total.refetch(); }}>
      <Stack.Screen options={{ title: 'Financeiro' }} />
      <View style={styles.chips}>
        {(Object.keys(PERIODOS) as (keyof typeof PERIODOS)[]).map((p) => (
          <Chip key={p} rotulo={PERIODOS[p].rotulo} selecionado={agrupar === p} onPress={() => setAgrupar(p)} />
        ))}
      </View>
      {t ? (
        <Cartao testID="financeiro-total">
          <Texto variante="caption" cor="textMuted">No período</Texto>
          <View style={styles.tiles}>
            <View style={styles.tile}><Texto variante="caption" cor="textMuted">Faturamento</Texto><Dinheiro variante="h3" valor={t.faturamento} /></View>
            <View style={styles.tile}><Texto variante="caption" cor="textMuted">Gastos</Texto>
              <Dinheiro variante="h3" valor={t.gastos} sinal="−" /></View>
            <View style={styles.tile}><Texto variante="caption" cor="textMuted">Lucro</Texto>
              <Dinheiro variante="h3" valor={t.lucro} cor={Number(t.lucro) < 0 ? 'danger' : 'text'} sinal={Number(t.lucro) < 0 ? '−' : undefined} /></View>
          </View>
          <Texto variante="caption" cor="textMuted" numero>
            Taxas {formatMoeda(t.taxas)} · produtos usados {formatMoeda(t.insumos)} · {t.atendimentos} atendimento(s)
          </Texto>
        </Cartao>
      ) : null}
      <View style={styles.chips}>
        <Chip testID="medida-faturamento" rotulo="Faturamento" selecionado={medida === 'faturamento'} onPress={() => setMedida('faturamento')} />
        <Chip testID="medida-lucro" rotulo="Lucro" selecionado={medida === 'lucro'} onPress={() => setMedida('lucro')} />
      </View>
      {serie.isPending ? <Carregando /> : serie.isError ? <EstadoErro onTentar={() => serie.refetch()} /> : (
        <BarrasTempo testID="grafico-financeiro" titulo={`${medida === 'faturamento' ? 'Faturamento' : 'Lucro'} por ${PERIODOS[agrupar].rotulo.toLowerCase()}`}
          rotuloValor={medida === 'faturamento' ? 'Faturamento' : 'Lucro'}
          pontos={serie.data.map((l) => ({ rotulo: rotuloPeriodo(l.periodo, agrupar), valor: Number(l[medida]), texto: formatMoeda(l[medida]) }))} />
      )}
    </TelaBase>
  );
}

export default function TelaFinanceiro() {
  return (
    <PortaPlano recurso="financeiro" titulo="Financeiro" descricao="Faturamento, gastos e lucro por dia, semana e mês."
      previa={<Texto variante="title">Financeiro</Texto>}>
      <Financeiro />
    </PortaPlano>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: space[3] },
  tile: { flexGrow: 1, minWidth: 96, gap: 2 },
});
