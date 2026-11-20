// Agenda do dia: launch in 2 taps, schedule, act on each appointment,
// close the day's cash (ConquistaButton). Ticks: ✓ salvo (still sending),
// ✓✓ sincronizado (in the database), cadeado = caixa fechado.
import { useIsMutating } from '@tanstack/react-query';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { BotaoIcone } from '@/components/BotaoIcone';
import { ConquistaButton } from '@/components/ConquistaButton';
import { Dinheiro } from '@/components/Dinheiro';
import { DuoButton } from '@/components/DuoButton';
import { Carregando, EstadoErro, EstadoVazio } from '@/components/Estado';
import { SecondaryButton } from '@/components/SecondaryButton';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { AgendarSheet } from '@/features/agenda/AgendarSheet';
import { useAgendaDia, useFecharCaixa, useReabrirCaixa, useResumoDia, type ItemAgenda } from '@/features/agenda/api';
import { AtendimentoSheet, NOME_STATUS } from '@/features/agenda/AtendimentoSheet';
import { LancarSheet } from '@/features/agenda/LancarSheet';
import { OfertasNaCadeira } from '@/features/agenda/OfertasNaCadeira';
import { diaISO, formatDiaLongo, formatHora, somarDias } from '@/lib/format';
import { color, radius, space } from '@/theme/tokens';

export default function Agenda() {
  const hoje = diaISO();
  const [dia, setDia] = useState(hoje);
  const agenda = useAgendaDia(dia);
  const resumo = useResumoDia(dia);
  const fechar = useFecharCaixa();
  const reabrir = useReabrirCaixa();
  const enviando = useIsMutating() > 0;
  const [lancando, setLancando] = useState(false);
  const [agendando, setAgendando] = useState(false);
  const [aberto, setAberto] = useState<ItemAgenda | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const caixaFechado = resumo.data?.caixa_fechado ?? false;
  const concluidos = (agenda.data ?? []).filter((a) => a.status === 'concluido').length;
  const ehHoje = dia === hoje;

  async function fecharCaixa() {
    setErro(null);
    try {
      await fechar.mutateAsync(dia);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não deu para fechar o caixa.');
    }
  }

  return (
    <TelaBase
      titulo="Agenda"
      onAtualizar={() => {
        agenda.refetch();
        resumo.refetch();
      }}
    >
      <View style={styles.dia}>
        <BotaoIcone icone={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }} rotulo="Dia anterior" onPress={() => setDia(somarDias(dia, -1))} />
        <View style={styles.diaTexto}>
          <Texto peso="semibold" centro testID="agenda-dia">{ehHoje ? `Hoje, ${formatDiaLongo(dia).split(', ')[1]}` : formatDiaLongo(dia)}</Texto>
          {resumo.data ? (
            <View style={styles.resumo}>
              <Texto variante="caption" cor="textMuted" numero>{resumo.data.atendimentos} atendimento(s) · </Texto>
              <Dinheiro variante="caption" cor="textMuted" valor={resumo.data.faturamento} testID="agenda-faturamento" />
            </View>
          ) : null}
        </View>
        <BotaoIcone icone={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }} rotulo="Próximo dia" onPress={() => setDia(somarDias(dia, 1))} />
      </View>
      {ehHoje ? null : <SecondaryButton rotulo="Voltar para hoje" compacto onPress={() => setDia(hoje)} />}

      {agenda.isPending ? (
        <Carregando />
      ) : agenda.isError ? (
        <EstadoErro onTentar={() => agenda.refetch()} />
      ) : agenda.data.length === 0 ? (
        <EstadoVazio titulo={ehHoje ? 'Nenhum atendimento hoje ainda' : 'Nada neste dia'}
          texto={ehHoje ? 'Toque em "+ Atendimento" quando terminar um cliente.' : undefined} />
      ) : (
        <View style={styles.lista} testID="agenda-lista">
          {enviando ? (
            <View style={[styles.linha, styles.enviando]}>
              <Texto variante="bodySm" cor="textMuted">✓ Salvo no celular, enviando…</Texto>
            </View>
          ) : null}
          {agenda.data.map((a) => (
            <Pressable key={a.id} onPress={() => setAberto(a)} accessibilityRole="button"
              accessibilityLabel={`${formatHora(a.inicio)}, ${a.cliente ?? 'sem cliente'}, ${a.servicos ?? ''}, ${NOME_STATUS[a.status]}`}
              style={({ pressed }) => [styles.linha, pressed ? styles.pressionado : null]} testID="agenda-item">
              <Texto variante="h3" numero style={styles.hora}>{formatHora(a.inicio)}</Texto>
              <View style={styles.meio}>
                <Texto peso="medium" numberOfLines={1}>{a.cliente ?? 'Sem cliente'}</Texto>
                <Texto variante="bodySm" cor="textMuted" numberOfLines={1}>{a.servicos ?? '—'}</Texto>
                <View style={styles.ticks}>
                  {caixaFechado ? (
                    <SymbolView name={{ ios: 'lock.fill', android: 'lock', web: 'lock' }} tintColor={color.textMuted} size={12} />
                  ) : null}
                  <Texto variante="caption" numberOfLines={1} style={styles.flex}
                    cor={a.status === 'concluido' ? 'brandLip' : a.status === 'agendado' ? 'text' : 'textMuted'}>
                    {NOME_STATUS[a.status]}
                    <Texto variante="caption" cor="textMuted">{caixaFechado ? ' · caixa fechado' : ' · ✓✓'}</Texto>
                  </Texto>
                </View>
              </View>
              <Dinheiro valor={a.valor} variante="body" peso="semibold" cor={a.status === 'concluido' ? 'text' : 'textMuted'} />
            </Pressable>
          ))}
        </View>
      )}

      <SecondaryButton testID="agendar" rotulo="+ Agendar horário" onPress={() => setAgendando(true)} />

      {dia <= hoje && concluidos > 0 ? (
        caixaFechado ? (
          <View style={styles.fechado} testID="caixa-fechado">
            <Texto peso="semibold">Caixa fechado</Texto>
            <SecondaryButton rotulo="Reabrir o caixa" compacto onPress={() => reabrir.mutate(dia)} />
          </View>
        ) : (
          <View style={styles.palco}>
            <ConquistaButton testID="fechar-caixa" rotulo="Fechar o caixa" onPress={fecharCaixa} />
          </View>
        )
      ) : null}
      {erro ? <Texto cor="danger" peso="medium">⚠ {erro}</Texto> : null}

      <LancarSheet aberto={lancando} onFechar={() => setLancando(false)} />
      <AgendarSheet key={dia} aberto={agendando} onFechar={() => setAgendando(false)} diaInicial={dia} />
      <AtendimentoSheet item={aberto} caixaFechado={caixaFechado} onFechar={() => setAberto(null)}
        extraAgendado={(item) => <OfertasNaCadeira atendimentoId={item.id} />} />
    </TelaBase>
  );
}

const styles = StyleSheet.create({
  dia: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  diaTexto: { flex: 1, alignItems: 'center', gap: space[1] },
  resumo: { flexDirection: 'row', alignItems: 'center' },
  lista: { gap: space[2] },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    padding: space[3],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.border,
    backgroundColor: color.bg,
    minHeight: 64,
  },
  enviando: { backgroundColor: color.surface },
  pressionado: { backgroundColor: color.surface },
  hora: { width: 58 },
  meio: { flex: 1, gap: 2 },
  ticks: { flexDirection: 'row', gap: 4, alignItems: 'center' },
  flex: { flex: 1 },
  fechado: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: space[3],
    borderRadius: radius.md, backgroundColor: color.surface, borderWidth: 1, borderColor: color.border },
  palco: { paddingTop: space[6] },
});
