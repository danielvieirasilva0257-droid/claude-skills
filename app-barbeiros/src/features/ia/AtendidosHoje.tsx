// Clients served today (concluded bookings of agenda_grade for today), for
// the centre of the "Mais" tab. Tapping a name opens the client's profile.
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Dinheiro } from '@/components/Dinheiro';
import { Carregando, EstadoErro } from '@/components/Estado';
import { Texto } from '@/components/Texto';
import { useAgendaGrade } from '@/features/agenda/api';
import { diaISO, formatHora } from '@/lib/format';
import { color, space } from '@/theme/tokens';

export function AtendidosHoje() {
  const grade = useAgendaGrade(diaISO());
  if (grade.isPending) return <Carregando />;
  if (grade.isError) return <EstadoErro onTentar={() => grade.refetch()} />;
  const atendidos = grade.data.itens.filter((i) => i.status === 'concluido');
  if (atendidos.length === 0) {
    return <Texto variante="bodySm" cor="textMuted" testID="atendidos-vazio">Ninguém atendido ainda hoje. Os atendimentos concluídos aparecem aqui.</Texto>;
  }
  return (
    <View testID="atendidos-hoje">
      {atendidos.map((a) => (
        <Pressable key={a.id} disabled={!a.cliente_id} accessibilityRole={a.cliente_id ? 'link' : undefined}
          accessibilityLabel={`${formatHora(a.inicio)}, ${a.cliente ?? 'sem cliente'}, ${a.servicos ?? ''}`}
          onPress={() => a.cliente_id && router.push({ pathname: '/cliente/[id]', params: { id: a.cliente_id } })}
          style={({ pressed }) => [styles.linha, pressed ? styles.pressionado : null]} testID="atendido">
          <Texto variante="bodySm" cor="textMuted" numero style={styles.hora}>{formatHora(a.inicio)}</Texto>
          <View style={styles.flex}>
            <Texto peso="semibold" numberOfLines={1}>{a.cliente ?? 'Sem cliente'}</Texto>
            <Texto variante="caption" cor="textMuted" numberOfLines={1}>{a.servicos ?? '—'}</Texto>
          </View>
          <Dinheiro variante="bodySm" peso="semibold" valor={a.valor} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: space[3], minHeight: 52, paddingVertical: space[2],
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: color.border },
  pressionado: { opacity: 0.7 },
  hora: { width: 48 },
  flex: { flex: 1 },
});
