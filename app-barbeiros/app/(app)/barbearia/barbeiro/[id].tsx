// Tela 27 · Relatório por barbeiro: the same month report the barber sees in
// his own Relatórios tab (relatorio_mes_de), opened by the owner through
// relatorio_barbeiro(), which checks the role. Commission only when the
// barber configured a rule.
import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Cartao } from '@/components/Cartao';
import { Dinheiro } from '@/components/Dinheiro';
import { Carregando, EstadoErro } from '@/components/Estado';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { useRelatorioBarbeiro } from '@/features/barbearia/api';
import { useUsuarioId } from '@/features/conta/barbeiro';
import { PortaPlano } from '@/features/planos/PortaPlano';
import { ConteudoRelatorio } from '@/features/relatorios/ConteudoRelatorio';
import { formatDiaLongo, formatMes } from '@/lib/format';
import { space } from '@/theme/tokens';

function RelatorioBarbeiro({ id }: { id: string }) {
  const r = useRelatorioBarbeiro(id);
  const uid = useUsuarioId();
  if (r.isPending) return <Carregando />;
  if (r.isError) return <EstadoErro texto={r.error.message} onTentar={() => r.refetch()} />;
  const d = r.data;
  return (
    <TelaBase titulo={d.barbeiro.nome} subtitulo={formatMes(d.mes)} semTitulo onAtualizar={() => r.refetch()}>
      <Stack.Screen options={{ title: d.barbeiro.nome + (d.barbeiro.id === uid ? ' (você)' : '') }} />
      <View style={styles.cabeca}>
        <Texto variante="h2" testID="relatorio-barbeiro-nome">{d.barbeiro.nome}</Texto>
        <Texto variante="bodySm" cor="textMuted">
          {d.barbeiro.papel === 'dono' ? 'Dono' : 'Barbeiro'} · na equipe desde {formatDiaLongo(d.barbeiro.entrou_em.slice(0, 10))} · {formatMes(d.mes)}
        </Texto>
      </View>
      {d.comissao !== null ? (
        <Cartao testID="relatorio-comissao">
          <Texto variante="caption" cor="textMuted">Comissão do mês, pela regra que ele configurou</Texto>
          <Dinheiro variante="h2" valor={d.comissao} />
        </Cartao>
      ) : null}
      <ConteudoRelatorio d={d} />
    </TelaBase>
  );
}

export default function TelaRelatorioBarbeiro() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <PortaPlano recurso="barbearia" titulo="Relatório por barbeiro" descricao="O relatório de cada barbeiro da equipe, no plano Barbearias."
      previa={<Texto variante="title">Relatório</Texto>}>
      <RelatorioBarbeiro id={id ?? ''} />
    </PortaPlano>
  );
}

const styles = StyleSheet.create({
  cabeca: { gap: space[1] },
});
