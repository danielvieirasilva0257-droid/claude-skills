// Horários de trabalho (base dos horários livres que a IA oferece) e lista de
// espera (V1: quando alguém cancela, quem espera é avisado).
import { Stack } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Campo } from '@/components/Campo';
import { Cartao } from '@/components/Cartao';
import { Chip } from '@/components/Chip';
import { Carregando } from '@/components/Estado';
import { SecondaryButton } from '@/components/SecondaryButton';
import { StatusButton } from '@/components/StatusButton';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { useClientesResumo } from '@/features/clientes/basico';
import { PortaPlano } from '@/features/planos/PortaPlano';
import { useEntrarEspera, useExpediente, useListaEspera, useSairEspera, useSalvarExpediente, type DiaExpediente } from '@/features/premium/api';
import { space } from '@/theme/tokens';

const DIAS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
const HORA = /^([01]\d|2[0-3]):[0-5]\d$/;
type Linha = { aberto: boolean; inicio: string; fim: string; pausaInicio: string; pausaFim: string };

function Expediente() {
  const exp = useExpediente();
  const salvar = useSalvarExpediente();
  const espera = useListaEspera();
  const entrar = useEntrarEspera();
  const sair = useSairEspera();
  const clientes = useClientesResumo();
  const [dias, setDias] = useState<Linha[]>(DIAS.map(() => ({ aberto: false, inicio: '09:00', fim: '19:00', pausaInicio: '', pausaFim: '' })));
  const [busca, setBusca] = useState('');
  const [preferencia, setPreferencia] = useState('');

  useEffect(() => {
    if (!exp.data) return;
    setDias(DIAS.map((_, i) => {
      const d = exp.data.find((x) => x.dia_semana === i + 1);
      return d ? { aberto: true, inicio: d.inicio.slice(0, 5), fim: d.fim.slice(0, 5), pausaInicio: d.pausa_inicio?.slice(0, 5) ?? '', pausaFim: d.pausa_fim?.slice(0, 5) ?? '' }
        : { aberto: false, inicio: '09:00', fim: '19:00', pausaInicio: '', pausaFim: '' };
    }));
  }, [exp.data]);

  const sugestoes = useMemo(() => {
    const t = busca.trim().toLowerCase();
    return t.length < 2 ? [] : (clientes.data ?? []).filter((c) => c.nome.toLowerCase().includes(t)).slice(0, 5);
  }, [busca, clientes.data]);

  async function gravar() {
    const linhas: DiaExpediente[] = [];
    dias.forEach((d, i) => {
      if (!d.aberto) return;
      for (const h of [d.inicio, d.fim, ...(d.pausaInicio || d.pausaFim ? [d.pausaInicio, d.pausaFim] : [])]) {
        if (!HORA.test(h)) throw new Error(`${DIAS[i]}: hora assim 09:00`);
      }
      linhas.push({ dia_semana: i + 1, inicio: d.inicio, fim: d.fim, pausa_inicio: d.pausaInicio || null, pausa_fim: d.pausaFim || null });
    });
    await salvar.mutateAsync(linhas).catch(() => { throw new Error('Confira os horários'); });
  }

  const muda = (i: number, campo: keyof Linha, valor: string | boolean) => setDias((ds) => ds.map((d, j) => (j === i ? { ...d, [campo]: valor } : d)));

  if (exp.isPending) return <Carregando />;
  return (
    <TelaBase titulo="Expediente" semTitulo>
      <Stack.Screen options={{ title: 'Horários e lista de espera' }} />
      <Texto cor="textMuted">A IA do WhatsApp só oferece horários dentro do seu expediente e livres na agenda.</Texto>
      {dias.map((d, i) => (
        <Cartao key={DIAS[i]} testID={`dia-${i + 1}`}>
          <View style={styles.linha}>
            <Texto peso="semibold" style={styles.flex}>{DIAS[i]}</Texto>
            <Chip rotulo={d.aberto ? 'Aberto' : 'Fechado'} selecionado={d.aberto} onPress={() => muda(i, 'aberto', !d.aberto)} />
          </View>
          {d.aberto ? (
            <View style={styles.linha}>
              <View style={styles.flex}><Campo rotulo="Das" value={d.inicio} onChangeText={(t) => muda(i, 'inicio', t)} /></View>
              <View style={styles.flex}><Campo rotulo="Até" value={d.fim} onChangeText={(t) => muda(i, 'fim', t)} /></View>
              <View style={styles.flex}><Campo rotulo="Pausa" value={d.pausaInicio} placeholder="12:00" onChangeText={(t) => muda(i, 'pausaInicio', t)} /></View>
              <View style={styles.flex}><Campo rotulo="até" value={d.pausaFim} placeholder="13:00" onChangeText={(t) => muda(i, 'pausaFim', t)} /></View>
            </View>
          ) : null}
        </Cartao>
      ))}
      <StatusButton testID="expediente-salvar" acao={gravar} />

      <Texto variante="h3" accessibilityRole="header">Lista de espera</Texto>
      <Texto variante="bodySm" cor="textMuted">Quando alguém cancela, as 3 primeiras pessoas recebem o aviso (se a automação V1 estiver ligada).</Texto>
      {(espera.data ?? []).map((e) => (
        <View key={e.id} style={styles.linha}>
          <Texto style={styles.flex}>{e.cliente?.nome ?? '—'}{e.preferencia ? ` · ${e.preferencia}` : ''}</Texto>
          <Texto variante="caption" cor={e.status === 'avisado' ? 'brandLip' : 'textMuted'}>{e.status === 'avisado' ? '✓ avisado' : 'aguardando'}</Texto>
          <SecondaryButton compacto rotulo="Tirar" onPress={() => sair.mutate(e.id)} />
        </View>
      ))}
      <Campo rotulo="Colocar cliente na lista" value={busca} onChangeText={setBusca} placeholder="Nome" />
      <View style={styles.chips}>
        {sugestoes.map((c) => <Chip key={c.id} rotulo={c.nome} selecionado={false}
          onPress={() => entrar.mutate({ cliente_id: c.id, preferencia: preferencia.trim() || null }, { onSuccess: () => setBusca('') })} />)}
      </View>
      <Campo rotulo="Preferência (opcional)" value={preferencia} onChangeText={setPreferencia} placeholder="sábado de manhã" />
    </TelaBase>
  );
}

export default function TelaExpediente() {
  return (
    <PortaPlano recurso="expediente" titulo="Horários e lista de espera" descricao="Seu expediente para a IA marcar horários e a lista de espera que avisa quando abre vaga."
      previa={<Texto variante="title">Expediente</Texto>}>
      <Expediente />
    </PortaPlano>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  flex: { flex: 1 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
});
