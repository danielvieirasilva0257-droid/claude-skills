// Tela 26 · Agenda da equipe: one day of everyone, grouped by barber, with a
// filter per barber. Only the client's first name (agenda_equipe); each barber
// keeps managing their own appointments in their own app.
import { Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BotaoIcone } from '@/components/BotaoIcone';
import { Cartao } from '@/components/Cartao';
import { Chip } from '@/components/Chip';
import { Carregando, EstadoErro, EstadoVazio } from '@/components/Estado';
import { SecondaryButton } from '@/components/SecondaryButton';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { useAgendaEquipe, useEquipe, type ItemAgendaEquipe } from '@/features/barbearia/api';
import { NOME_STATUS } from '@/features/agenda/AtendimentoSheet';
import { PortaPlano } from '@/features/planos/PortaPlano';
import { diaISO, formatDiaLongo, formatHora, somarDias } from '@/lib/format';
import { space } from '@/theme/tokens';

function AgendaEquipe() {
  const hoje = diaISO();
  const [dia, setDia] = useState(hoje);
  const [filtro, setFiltro] = useState<string | null>(null);
  const agenda = useAgendaEquipe(dia);
  const equipe = useEquipe();
  const membros = equipe.data?.membros ?? [];

  const itens = (agenda.data ?? []).filter((a) => filtro === null || a.barbeiro_id === filtro);
  const grupos = membros
    .map((m) => ({ ...m, itens: itens.filter((a) => a.barbeiro_id === m.barbeiro_id) }))
    .filter((g) => g.itens.length > 0);

  return (
    <TelaBase titulo="Agenda da equipe" semTitulo onAtualizar={() => agenda.refetch()}>
      <Stack.Screen options={{ title: 'Agenda da equipe' }} />
      <View style={styles.dia}>
        <BotaoIcone icone={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }} rotulo="Dia anterior" onPress={() => setDia(somarDias(dia, -1))} />
        <Texto peso="semibold" centro style={styles.flex} testID="agenda-equipe-dia">
          {dia === hoje ? `Hoje, ${formatDiaLongo(dia).split(', ')[1]}` : formatDiaLongo(dia)}
        </Texto>
        <BotaoIcone icone={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }} rotulo="Próximo dia" onPress={() => setDia(somarDias(dia, 1))} />
      </View>
      {dia === hoje ? null : <SecondaryButton rotulo="Voltar para hoje" compacto onPress={() => setDia(hoje)} />}

      {membros.length > 1 ? (
        <View style={styles.chips}>
          <Chip rotulo="Todos" selecionado={filtro === null} onPress={() => setFiltro(null)} />
          {membros.map((m) => (
            <Chip key={m.barbeiro_id} rotulo={m.nome.split(' ')[0] ?? m.nome} selecionado={filtro === m.barbeiro_id}
              onPress={() => setFiltro(filtro === m.barbeiro_id ? null : m.barbeiro_id)} />
          ))}
        </View>
      ) : null}

      {agenda.isPending ? <Carregando /> : agenda.isError ? <EstadoErro onTentar={() => agenda.refetch()} /> :
        grupos.length === 0 ? <EstadoVazio titulo="Ninguém marcado neste dia" /> :
        grupos.map((g) => (
          <View key={g.barbeiro_id} style={styles.grupo} testID="agenda-equipe-grupo">
            <Texto variante="h3" accessibilityRole="header">{g.nome} <Texto variante="bodySm" cor="textMuted" numero>· {g.itens.length}</Texto></Texto>
            {g.itens.map((a) => <Linha key={a.id} a={a} />)}
          </View>
        ))}
    </TelaBase>
  );
}

function Linha({ a }: { a: ItemAgendaEquipe }) {
  return (
    <Cartao accessibilityLabel={`${formatHora(a.inicio)}, ${a.cliente ?? 'sem cliente'}, ${a.servicos ?? ''}, ${NOME_STATUS[a.status]}`}>
      <View style={styles.linha}>
        <Texto variante="h3" numero style={styles.hora}>{formatHora(a.inicio)}</Texto>
        <View style={styles.flex}>
          <Texto peso="medium" numberOfLines={1}>{a.cliente ?? 'Sem cliente'}</Texto>
          <Texto variante="bodySm" cor="textMuted" numberOfLines={1}>{a.servicos ?? '—'}</Texto>
        </View>
        <Texto variante="caption" cor={a.status === 'concluido' ? 'brand' : a.status === 'falta' ? 'warning' : 'textMuted'}>{NOME_STATUS[a.status]}</Texto>
      </View>
    </Cartao>
  );
}

export default function TelaAgendaEquipe() {
  return (
    <PortaPlano recurso="barbearia" titulo="Agenda da equipe" descricao="A agenda de todos os barbeiros num lugar só, no plano Barbearias."
      previa={<Texto variante="title">Agenda da equipe</Texto>}>
      <AgendaEquipe />
    </PortaPlano>
  );
}

const styles = StyleSheet.create({
  dia: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  flex: { flex: 1 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  grupo: { gap: space[2] },
  linha: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  hora: { width: 58 },
});
