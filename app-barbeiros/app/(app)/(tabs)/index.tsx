// Início (v2, from Daniel's references): greeting on the aurora with the plan,
// Hoje/Mês pills, two glass cards side by side, the month card with one square
// per day, "Pergunte à IA", insight and next appointments. Numbers from
// resumo_dia / financeiro (the database calculates).
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { BotaoIcone } from '@/components/BotaoIcone';
import { Cartao } from '@/components/Cartao';
import { Chip } from '@/components/Chip';
import { Dinheiro } from '@/components/Dinheiro';
import { Carregando, EstadoErro, EstadoVazio } from '@/components/Estado';
import { InsightCard } from '@/components/InsightCard';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { Vidro } from '@/components/Vidro';
import { useProximos, useResumoDia } from '@/features/agenda/api';
import { useBarbeiro, usePlano } from '@/features/conta/barbeiro';
import { alternarOcultarValores, usePreferencias } from '@/features/conta/preferencias';
import { Celebracao } from '@/features/conquistas/Celebracao';
import { useFinanceiro, useInsights } from '@/features/pago/api';
import { diaISO, formatDiaLongo, formatHora, formatMes, formatMoeda, inicioDoMes } from '@/lib/format';
import { libera, NOME_PLANO } from '@/lib/plano';
import { grafico } from '@/theme/grafico';
import { color, radius, space } from '@/theme/tokens';

type Visao = 'hoje' | 'mes';

function DiasDoMes({ inicio, fim }: { inicio: string; fim: string }) {
  const dias = useFinanceiro(inicio, fim, 'day');
  const lista = dias.data ?? [];
  const max = Math.max(0, ...lista.map((d) => Number(d.faturamento)));
  return (
    <View style={styles.dias} accessibilityLabel={`Faturamento por dia em ${formatMes(inicio)}`}>
      {lista.map((d) => {
        const v = Number(d.faturamento);
        const nivel = v === 0 || max === 0 ? -1 : Math.min(4, Math.floor((v / max) * 4.999));
        return (
          <View key={d.periodo} accessibilityLabel={`${d.periodo.slice(8)}: ${formatMoeda(d.faturamento)}`}
            style={[styles.dia, { backgroundColor: nivel < 0 ? color.surface : grafico.calor[nivel] }]} />
        );
      })}
    </View>
  );
}

export default function Inicio() {
  const barbeiro = useBarbeiro();
  const plano = usePlano();
  const resumo = useResumoDia();
  const proximos = useProximos();
  const oculto = usePreferencias((s) => s.ocultarValores);
  const [visao, setVisao] = useState<Visao>('hoje');
  const hoje = diaISO();
  const mes = inicioDoMes();
  const meuPlano = plano.data ?? 'gratis';
  const pago = libera(meuPlano, 'financeiro');
  const comIA = libera(meuPlano, 'insights');
  const insights = useInsights();
  const totalMes = useFinanceiro(mes, hoje, 'total');
  const primeiro = comIA ? insights.data?.[0] : undefined;
  const primeiroNome = barbeiro.data?.nome.split(' ')[0] ?? '';
  const r = resumo.data;
  const m = totalMes.data?.[0];
  const negativo = (v: unknown) => Number(v) < 0;

  return (
    <TelaBase titulo={primeiroNome ? `Olá, ${primeiroNome}` : 'Início'} subtitulo={`Plano ${NOME_PLANO[meuPlano]} · ${formatDiaLongo(hoje)}`}
      auroraForte
      onAtualizar={() => { resumo.refetch(); proximos.refetch(); totalMes.refetch(); }}
      direita={
        <BotaoIcone testID="olho" rotulo={oculto ? 'Mostrar valores' : 'Esconder valores'} onPress={alternarOcultarValores}
          icone={oculto ? { ios: 'eye.slash', android: 'visibility_off', web: 'visibility_off' } : { ios: 'eye', android: 'visibility', web: 'visibility' }} />
      }>
      <View style={styles.pilulas}>
        <Chip testID="ver-hoje" rotulo="Hoje" selecionado={visao === 'hoje'} onPress={() => setVisao('hoje')} />
        <Chip testID="ver-mes" rotulo={formatMes(mes).split(' ')[0]!.replace(/^./, (c) => c.toUpperCase())} selecionado={visao === 'mes'}
          onPress={() => setVisao('mes')} desativado={!pago} />
      </View>

      {resumo.isPending ? <Carregando /> : resumo.isError || !r ? <EstadoErro onTentar={() => resumo.refetch()} /> : (
        <View style={styles.dupla}>
          <Cartao style={styles.meio} testID="hoje">
            <Texto variante="caption" cor="textMuted">{visao === 'hoje' ? 'Faturamento hoje' : 'Faturamento no mês'}</Texto>
            <Dinheiro testID="hoje-valor" variante="h2" valor={visao === 'hoje' ? r.faturamento : m?.faturamento ?? 0} />
            <Texto variante="caption" cor="textMuted" numero testID="hoje-detalhe">
              {visao === 'hoje' ? `${r.atendimentos} atendimento(s) · ${r.agendados} agendado(s)` : `${m?.atendimentos ?? 0} atendimento(s)`}
            </Texto>
          </Cartao>
          <Cartao style={styles.meio} testID="lucro">
            <Texto variante="caption" cor="textMuted">{visao === 'hoje' ? 'Lucro hoje' : 'Lucro no mês'}</Texto>
            {(() => {
              const v = visao === 'hoje' ? r.lucro : m?.lucro ?? 0;
              return <Dinheiro variante="h2" valor={v} cor={negativo(v) ? 'danger' : 'text'} sinal={negativo(v) ? '−' : undefined} />;
            })()}
            <Texto variante="caption" cor="textMuted" numero>
              {visao === 'hoje' ? `gastos ${formatMoeda(r.gastos)}${r.caixa_fechado ? ' · caixa fechado' : ''}` : `gastos ${formatMoeda(m?.gastos ?? 0)}`}
            </Texto>
          </Cartao>
        </View>
      )}

      {pago ? (
        <Cartao onPress={() => router.push('/financeiro')} accessibilityLabel="Abrir financeiro" testID="cartao-mes">
          <View style={styles.linha}>
            <Texto variante="caption" cor="textMuted" style={styles.flex}>Faturamento em {formatMes(mes)}</Texto>
            <SymbolView name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }} tintColor={color.textMuted} size={16} />
          </View>
          <Dinheiro variante="display" valor={m?.faturamento ?? 0} />
          <DiasDoMes inicio={mes} fim={hoje} />
        </Cartao>
      ) : null}

      {comIA ? (
        <Pressable onPress={() => router.push('/ia/chat')} accessibilityRole="button" accessibilityLabel="Perguntar para a IA" testID="pergunte-ia">
          <Vidro tom="ia" raio={radius.pill} style={styles.pergunte}>
            <Texto cor="textMuted" style={styles.flex}>Pergunte à IA</Texto>
            <SymbolView name={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }} tintColor={color.ai} size={20} />
          </Vidro>
        </Pressable>
      ) : null}

      {primeiro ? (
        <InsightCard testID="inicio-insight" titulo={primeiro.titulo} numero={primeiro.numero} porque={primeiro.porque}
          acao={primeiro.acao} botao="Ver insights" onPress={() => router.push('/insights')} />
      ) : null}

      <Texto variante="h3" accessibilityRole="header">Próximos horários</Texto>
      {proximos.isPending ? <Carregando /> : proximos.isError ? <EstadoErro onTentar={() => proximos.refetch()} /> :
        proximos.data.length === 0 ? <EstadoVazio titulo="Nenhum horário marcado" acao="Abrir a agenda" onAcao={() => router.push('/agenda')} /> :
        proximos.data.map((p) => {
          const dia = diaISO(new Date(p.inicio));
          return (
            <Cartao key={p.id} onPress={() => router.push('/agenda')} accessibilityLabel={`${formatHora(p.inicio)}, ${p.cliente?.nome ?? 'sem cliente'}`}>
              <View style={styles.linha}>
                <Texto variante="h3" numero>{formatHora(p.inicio)}</Texto>
                <View style={styles.flex}>
                  <Texto peso="medium">{p.cliente?.nome ?? 'Sem cliente'}</Texto>
                  <Texto variante="bodySm" cor="textMuted">
                    {dia === hoje ? 'Hoje' : formatDiaLongo(dia)} · {p.itens.map((i) => i.servico?.nome).filter(Boolean).join(' + ')}
                  </Texto>
                </View>
              </View>
            </Cartao>
          );
        })}
      <Celebracao />
    </TelaBase>
  );
}

const styles = StyleSheet.create({
  pilulas: { flexDirection: 'row', gap: space[2] },
  dupla: { flexDirection: 'row', gap: space[3] },
  meio: { flex: 1, minHeight: 132, justifyContent: 'flex-end' },
  linha: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  flex: { flex: 1 },
  dias: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: space[2] },
  dia: { width: 20, height: 20, borderRadius: 5 },
  pergunte: { height: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: space[5], gap: space[2] },
});
