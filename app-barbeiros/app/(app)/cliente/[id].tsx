// Ficha do cliente: atender sempre como se fosse a primeira vez.
// Técnica, bebida, assunto, datas, recorrência por serviço e se pode receber oferta.
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Campo } from '@/components/Campo';
import { Cartao } from '@/components/Cartao';
import { Chip } from '@/components/Chip';
import { Carregando, EstadoErro } from '@/components/Estado';
import { StatusButton } from '@/components/StatusButton';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { useFicha, useSalvarCliente } from '@/features/pago/api';
import { PortaPlano } from '@/features/planos/PortaPlano';
import { formatDiaLongo, formatMoeda, formatPorcentagem } from '@/lib/format';
import { space } from '@/theme/tokens';

const CAMPOS = [
  ['apelido', 'Como gosta de ser chamado'],
  ['tecnica_ultimo_corte', 'Técnica do último corte'],
  ['bebida_preferida', 'Bebida preferida'],
  ['ultimo_assunto', 'Último assunto'],
  ['preferencias', 'Preferências'],
  ['telefone', 'Telefone'],
] as const;

function Ficha({ id }: { id: string }) {
  const ficha = useFicha(id);
  const salvar = useSalvarCliente();
  const [form, setForm] = useState<Record<string, string>>({});
  const [podeOferta, setPodeOferta] = useState(false);

  useEffect(() => {
    if (!ficha.data) return;
    const c = ficha.data.cliente;
    setForm(Object.fromEntries(CAMPOS.map(([k]) => [k, String(c[k] ?? '')])));
    setPodeOferta(Boolean(c.pode_receber_oferta));
  }, [ficha.data]);

  if (ficha.isPending) return <Carregando />;
  if (ficha.isError) return <EstadoErro onTentar={() => ficha.refetch()} />;
  const { cliente: c, servicos, historico } = ficha.data;

  return (
    <TelaBase titulo={c.nome} semTitulo onAtualizar={() => ficha.refetch()}>
      <Stack.Screen options={{ title: c.nome }} />
      <Cartao>
        <Texto variante="h3">{c.nome}</Texto>
        <Texto variante="bodySm" cor="textMuted" numero>
          {c.visitas} visita(s) · intervalo {c.intervalo_medio_dias ? `${c.intervalo_medio_dias} dias` : '—'} · ticket {formatMoeda(c.ticket_medio)}
          · extras em {formatPorcentagem(c.pct_visitas_com_extra)} das visitas
        </Texto>
        {c.sumido ? <Texto peso="semibold" cor="warning">⚠ Sumido há {c.dias_sem_vir} dias</Texto> : null}
      </Cartao>

      <Texto variante="h3" accessibilityRole="header">Serviços e recorrência</Texto>
      {servicos.length === 0 ? <Texto cor="textMuted">Ainda sem atendimentos concluídos.</Texto> : servicos.map((s) => (
        <View key={s.servico} style={styles.linha}>
          <Texto peso="medium" style={styles.flex}>{s.servico}</Texto>
          <Texto variante="caption" cor={s.na_hora ? 'brandLip' : 'textMuted'} peso={s.na_hora ? 'semibold' : 'regular'} numero>
            {s.na_hora ? '● na hora de oferecer · ' : ''}há {s.dias_desde} dias{s.intervalo_dias ? ` (a cada ${s.intervalo_dias})` : ''}
          </Texto>
        </View>
      ))}

      <Texto variante="h3" accessibilityRole="header">Ficha</Texto>
      {CAMPOS.map(([k, rotulo]) => (
        <Campo key={k} rotulo={rotulo} value={form[k] ?? ''} onChangeText={(t) => setForm((f) => ({ ...f, [k]: t }))}
          keyboardType={k === 'telefone' ? 'phone-pad' : 'default'} />
      ))}
      <Texto variante="bodySm" peso="medium">Pode receber oferta de extra?</Texto>
      <View style={styles.chips}>
        <Chip rotulo="Sim" selecionado={podeOferta} onPress={() => setPodeOferta(true)} />
        <Chip rotulo="Ainda não" selecionado={!podeOferta} onPress={() => setPodeOferta(false)} />
      </View>
      <StatusButton testID="ficha-salvar" acao={() => salvar.mutateAsync({ id, ...Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, v.trim() || null])), pode_receber_oferta: podeOferta })} />

      <Texto variante="h3" accessibilityRole="header">Histórico</Texto>
      {historico.map((h) => (
        <View key={h.id} style={styles.linha}>
          <Texto variante="bodySm" style={styles.flex}>{formatDiaLongo(h.inicio.slice(0, 10))}</Texto>
          <Texto variante="caption" cor="textMuted" style={styles.flex}>
            {h.itens.map((i) => i.servico?.nome ?? i.produto?.nome).filter(Boolean).join(' + ')}
          </Texto>
          <Texto variante="caption" cor="textMuted">{h.status === 'concluido' ? '' : h.status}</Texto>
        </View>
      ))}
    </TelaBase>
  );
}

export default function FichaCliente() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <PortaPlano recurso="clientes" titulo="Ficha do cliente" descricao="Técnica, preferências e o que oferecer na próxima visita."
      previa={<Texto variante="title">Ficha</Texto>}>
      <Ficha id={id} />
    </PortaPlano>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: space[2], minHeight: 32 },
  flex: { flex: 1 },
  chips: { flexDirection: 'row', gap: space[2] },
});
