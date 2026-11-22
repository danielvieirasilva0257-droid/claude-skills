// Clientes: strip of missing clients first, then everyone, with search.
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Campo } from '@/components/Campo';
import { Cartao } from '@/components/Cartao';
import { Carregando, EstadoErro, EstadoVazio } from '@/components/Estado';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { useClientesResumo } from '@/features/clientes/basico';
import { useClientesLista, type ClienteLista } from '@/features/pago/api';
import { PortaPlano } from '@/features/planos/PortaPlano';
import { formatDiaLongo, formatMoeda } from '@/lib/format';
import { color, radius, space } from '@/theme/tokens';

function Previa() {
  const clientes = useClientesResumo();
  return (
    <>
      <Texto variante="title">Clientes</Texto>
      {(clientes.data?.length ? clientes.data.slice(0, 4) : [{ id: '1', nome: 'Seus clientes aparecem aqui' }]).map((c) => (
        <Cartao key={c.id}><Texto peso="medium">{c.nome}</Texto><Texto variante="caption" cor="textMuted">Última visita e o que oferecer</Texto></Cartao>
      ))}
    </>
  );
}

function Linha({ c }: { c: ClienteLista }) {
  return (
    <Cartao onPress={() => router.push(`/cliente/${c.id}`)} accessibilityLabel={`Abrir ficha de ${c.nome}`} testID="cliente-linha">
      <View style={styles.linha}>
        <Texto peso="semibold" style={styles.flex}>{c.nome}</Texto>
        {c.servicos_na_hora > 0 ? <Texto variante="caption" peso="semibold" cor="brandLip">● {c.servicos_na_hora} na hora</Texto> : null}
      </View>
      <Texto variante="caption" cor="textMuted" numero>
        {c.visitas} visita(s)
        {c.ultima_visita ? ` · última há ${c.dias_sem_vir} dia(s)` : ' · ainda não veio'}
        {c.ticket_medio ? ` · ticket ${formatMoeda(c.ticket_medio)}` : ''}
        {c.proximo_horario ? ` · volta ${formatDiaLongo(c.proximo_horario.slice(0, 10)).split(',')[0]}` : ''}
      </Texto>
    </Cartao>
  );
}

function Lista() {
  const lista = useClientesLista();
  const [busca, setBusca] = useState('');
  const filtrados = useMemo(() => {
    const t = busca.trim().toLowerCase();
    return (lista.data ?? []).filter((c) => !t || c.nome.toLowerCase().includes(t) || (c.apelido ?? '').toLowerCase().includes(t));
  }, [lista.data, busca]);
  const sumidos = (lista.data ?? []).filter((c) => c.sumido);

  return (
    <TelaBase titulo="Clientes" onAtualizar={() => lista.refetch()}>
      {lista.isPending ? <Carregando /> : lista.isError ? <EstadoErro onTentar={() => lista.refetch()} /> : (
        <>
          {sumidos.length > 0 ? (
            <View style={styles.faixa} testID="faixa-sumidos">
              <Texto peso="semibold">⚠ {sumidos.length} cliente(s) sumido(s)</Texto>
              <Texto variante="caption" cor="textMuted">Sem voltar há mais do dobro do intervalo de sempre.</Texto>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sumidos}>
                {sumidos.map((c) => (
                  <Cartao key={c.id} onPress={() => router.push(`/cliente/${c.id}`)} accessibilityLabel={`${c.nome}, sumido`} style={styles.sumido}>
                    <Texto peso="medium" numberOfLines={1}>{c.nome}</Texto>
                    <Texto variante="caption" cor="textMuted" numero>{c.dias_sem_vir} dias sem vir</Texto>
                  </Cartao>
                ))}
              </ScrollView>
            </View>
          ) : null}
          <Campo rotulo="Buscar" value={busca} onChangeText={setBusca} placeholder="Nome ou apelido" />
          {filtrados.length === 0 ? (
            <EstadoVazio titulo={busca ? 'Ninguém com esse nome' : 'Nenhum cliente ainda'} texto={busca ? undefined : 'Clientes entram ao agendar com o nome.'} />
          ) : filtrados.map((c) => <Linha key={c.id} c={c} />)}
        </>
      )}
    </TelaBase>
  );
}

export default function Clientes() {
  return (
    <PortaPlano recurso="clientes" titulo="Clientes com ficha" previa={<Previa />}
      descricao="Ficha de cada cliente, quem sumiu e quando chamar de volta.">
      <Lista />
    </PortaPlano>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  flex: { flex: 1 },
  faixa: { gap: space[2], padding: space[3], borderRadius: radius.lg, borderWidth: 1, borderColor: color.warning, backgroundColor: color.bg },
  sumidos: { gap: space[2] },
  sumido: { width: 160 },
});
