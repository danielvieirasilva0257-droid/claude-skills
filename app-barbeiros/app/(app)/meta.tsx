// Meta do mês: suggested goal (database: average of 3 months, capacity and
// strategy), ring, "faltam R$ X, uns N cortes".
import { Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Campo } from '@/components/Campo';
import { Cartao } from '@/components/Cartao';
import { Dinheiro } from '@/components/Dinheiro';
import { DuoButton } from '@/components/DuoButton';
import { Carregando, EstadoErro } from '@/components/Estado';
import { MetaRing } from '@/components/MetaRing';
import { SecondaryButton } from '@/components/SecondaryButton';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { Celebracao } from '@/features/conquistas/Celebracao';
import { useDefinirMeta, useMeta } from '@/features/pago/api';
import { PortaPlano } from '@/features/planos/PortaPlano';
import { formatMes, formatMoeda, formatPorcentagem, inicioDoMes } from '@/lib/format';
import { space } from '@/theme/tokens';

function Meta() {
  const meta = useMeta();
  const definir = useDefinirMeta();
  const [editando, setEditando] = useState(false);
  const [valor, setValor] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  async function salvar(v: number, sugerida: boolean) {
    setErro(null);
    try {
      await definir.mutateAsync({ mes: inicioDoMes(), valor: v, sugerida });
      setEditando(false);
    } catch {
      setErro('Não salvou. Tente de novo.');
    }
  }

  if (meta.isPending) return <Carregando />;
  if (meta.isError) return <EstadoErro onTentar={() => meta.refetch()} />;
  const m = meta.data;
  const temMeta = m.meta !== null;

  return (
    <TelaBase titulo="Meta" semTitulo onAtualizar={() => meta.refetch()}>
      <Stack.Screen options={{ title: 'Meta do mês' }} />
      <Texto variante="caption" cor="textMuted">{formatMes(m.mes)}</Texto>
      {temMeta && !editando ? (
        <>
          <View style={styles.centro} testID="meta-anel">
            <MetaRing progresso={Number(m.pct)} emRisco={m.em_risco} accessibilityLabel={`${formatPorcentagem(m.pct)} da meta`}>
              <Texto variante="title" numero>{formatPorcentagem(m.pct)}</Texto>
              <Texto variante="caption" cor="textMuted">da meta</Texto>
            </MetaRing>
          </View>
          <Cartao>
            <Texto numero>
              <Dinheiro valor={m.realizado} peso="semibold" /> de <Dinheiro valor={m.meta} peso="semibold" />
            </Texto>
            {Number(m.falta) > 0 ? (
              <Texto variante="h3" testID="meta-falta">
                Faltam {formatMoeda(m.falta)}{m.cortes_faltando ? `, uns ${m.cortes_faltando} cortes` : ''}
              </Texto>
            ) : <Texto variante="h3" cor="brandLip">✓ Meta batida</Texto>}
            <Texto variante="bodySm" cor="textMuted" numero>
              {m.dias_restantes} dia(s) no mês
              {m.por_dia_trabalhado ? ` · ${formatMoeda(m.por_dia_trabalhado)} por dia de trabalho` : ''}
              {m.projecao ? ` · no ritmo atual: ${formatMoeda(m.projecao)}` : ''}
            </Texto>
          </Cartao>
          <SecondaryButton rotulo="Mudar a meta" onPress={() => { setValor(String(m.meta).replace('.', ',')); setEditando(true); }} />
        </>
      ) : (
        <>
          <Cartao>
            <Texto variante="h3">Meta sugerida</Texto>
            {m.sugerida !== null ? (
              <>
                <Dinheiro variante="display" valor={m.sugerida} testID="meta-sugerida" />
                <Texto variante="bodySm" cor="textMuted">Pela sua média dos últimos 3 meses, seus clientes ativos, sua capacidade e seu foco.</Texto>
                <DuoButton testID="aceitar-meta" rotulo="Usar esta meta" carregando={definir.isPending} onPress={() => salvar(Number(m.sugerida), true)} />
              </>
            ) : <Texto cor="textMuted">{m.aviso_sugestao ?? 'Ainda sem histórico para sugerir.'}</Texto>}
          </Cartao>
          <Campo testID="meta-valor" rotulo="Ou defina a sua" prefixo="R$" value={valor} onChangeText={setValor} keyboardType="decimal-pad" inputMode="decimal" erro={erro} />
          <SecondaryButton rotulo="Salvar minha meta" onPress={() => {
            const v = Number(valor.replace(',', '.'));
            if (v > 0) salvar(v, false); else setErro('Digite um valor, por exemplo 4500');
          }} />
        </>
      )}
      <Celebracao />
    </TelaBase>
  );
}

export default function TelaMeta() {
  return (
    <PortaPlano recurso="meta" titulo="Meta do mês" descricao="Meta sugerida pela sua média e quantos cortes faltam para bater."
      previa={<Texto variante="title">Meta</Texto>}>
      <Meta />
    </PortaPlano>
  );
}

const styles = StyleSheet.create({
  centro: { alignItems: 'center', paddingVertical: space[2] },
});
