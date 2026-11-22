// Agenda (salon style, Booksy/AVEC like): the month calendar on top; tapping a
// day opens its grid from the barber's start to end time. Tap a booking for
// the booking "CRM" (client, date, time, services, professional, value; the
// client's name opens the profile); tap a free half hour to book it. The
// day's cash closes with the ConquistaButton. Numbers from the database
// (agenda_mes, agenda_grade, resumo_dia).
import { useIsMutating } from '@tanstack/react-query';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Cartao } from '@/components/Cartao';
import { ConquistaButton } from '@/components/ConquistaButton';
import { Dinheiro } from '@/components/Dinheiro';
import { Carregando, EstadoErro } from '@/components/Estado';
import { SecondaryButton } from '@/components/SecondaryButton';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { AgendarSheet } from '@/features/agenda/AgendarSheet';
import { useAgendaGrade, useAgendaMes, useFecharCaixa, useReabrirCaixa, useResumoDia, type ItemAgenda } from '@/features/agenda/api';
import { AtendimentoSheet } from '@/features/agenda/AtendimentoSheet';
import { Calendario } from '@/features/agenda/Calendario';
import { GradeDia } from '@/features/agenda/GradeDia';
import { OfertasNaCadeira } from '@/features/agenda/OfertasNaCadeira';
import { diaISO, formatDiaLongo, inicioDoMes } from '@/lib/format';
import { color, radius, space } from '@/theme/tokens';

export default function Agenda() {
  const hoje = diaISO();
  const [dia, setDia] = useState(hoje);
  const [mes, setMes] = useState(inicioDoMes());
  const grade = useAgendaGrade(dia);
  const doMes = useAgendaMes(mes);
  const resumo = useResumoDia(dia);
  const fechar = useFecharCaixa();
  const reabrir = useReabrirCaixa();
  const enviando = useIsMutating() > 0;
  const [agendando, setAgendando] = useState(false);
  const [hora, setHora] = useState<string | undefined>(undefined);
  const [aberto, setAberto] = useState<ItemAgenda | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const caixaFechado = grade.data?.caixa_fechado ?? false;
  const concluidos = (grade.data?.itens ?? []).filter((a) => a.status === 'concluido').length;
  const ehHoje = dia === hoje;

  function escolherDia(d: string) {
    setDia(d);
    if (d.slice(0, 7) !== mes.slice(0, 7)) setMes(`${d.slice(0, 8)}01`);
  }

  async function fecharCaixa() {
    setErro(null);
    try {
      await fechar.mutateAsync(dia);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não deu para fechar o caixa.');
    }
  }

  return (
    <TelaBase titulo="Agenda" onAtualizar={() => { grade.refetch(); doMes.refetch(); resumo.refetch(); }}>
      <Cartao>
        <Calendario mes={mes} selecionado={dia} dias={doMes.data ?? []} onSelecionar={escolherDia} onMudarMes={setMes} />
      </Cartao>

      <View style={styles.cabecalho}>
        <View style={styles.flex}>
          <Texto variante="h3" accessibilityRole="header" testID="agenda-dia">
            {ehHoje ? `Hoje, ${formatDiaLongo(dia).split(', ')[1]}` : formatDiaLongo(dia).replace(/^./, (c) => c.toUpperCase())}
          </Texto>
          {resumo.data ? (
            <View style={styles.resumo}>
              <Texto variante="caption" cor="textMuted" numero>
                {resumo.data.atendimentos} atendimento(s) · {resumo.data.agendados} agendado(s) ·{' '}
              </Texto>
              <Dinheiro variante="caption" cor="textMuted" valor={resumo.data.faturamento} testID="agenda-faturamento" />
            </View>
          ) : null}
        </View>
        {ehHoje ? null : <SecondaryButton rotulo="Hoje" compacto onPress={() => escolherDia(hoje)} />}
      </View>
      {enviando ? <Texto variante="caption" cor="textMuted">✓ Salvo no celular, enviando…</Texto> : null}

      {grade.isPending ? <Carregando /> : grade.isError ? <EstadoErro onTentar={() => grade.refetch()} /> : (
        <GradeDia grade={grade.data} onItem={setAberto} onVazio={(h) => { setHora(h); setAgendando(true); }} />
      )}

      <SecondaryButton testID="agendar" rotulo="+ Agendar horário" onPress={() => { setHora(undefined); setAgendando(true); }} />

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

      <AgendarSheet key={`${dia}-${hora ?? ''}`} aberto={agendando} onFechar={() => setAgendando(false)} diaInicial={dia} horaInicial={hora} />
      <AtendimentoSheet item={aberto} caixaFechado={caixaFechado} profissional={grade.data?.profissional} onFechar={() => setAberto(null)}
        extraAgendado={(item) => <OfertasNaCadeira atendimentoId={item.id} />} />
    </TelaBase>
  );
}

const styles = StyleSheet.create({
  cabecalho: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  flex: { flex: 1 },
  resumo: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  fechado: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: space[3],
    borderRadius: radius.md, backgroundColor: color.surface, borderWidth: 1, borderColor: color.border },
  palco: { paddingTop: space[6] },
});
