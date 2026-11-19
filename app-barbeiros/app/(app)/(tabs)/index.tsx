// Início: today's revenue or profit (from resumo_dia), next appointments,
// "+ Atendimento" fixed at the bottom right, eye to hide values.
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BotaoIcone } from '@/components/BotaoIcone';
import { Cartao } from '@/components/Cartao';
import { Chip } from '@/components/Chip';
import { Dinheiro } from '@/components/Dinheiro';
import { DuoButton } from '@/components/DuoButton';
import { Carregando, EstadoErro, EstadoVazio } from '@/components/Estado';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { useProximos, useResumoDia } from '@/features/agenda/api';
import { LancarSheet } from '@/features/agenda/LancarSheet';
import { useBarbeiro } from '@/features/conta/barbeiro';
import { alternarOcultarValores, usePreferencias } from '@/features/conta/preferencias';
import { diaISO, formatDiaLongo, formatHora } from '@/lib/format';
import { space } from '@/theme/tokens';

type Visao = 'faturamento' | 'lucro';

export default function Inicio() {
  const barbeiro = useBarbeiro();
  const resumo = useResumoDia();
  const proximos = useProximos();
  const oculto = usePreferencias((s) => s.ocultarValores);
  const [visao, setVisao] = useState<Visao>('faturamento');
  const [lancando, setLancando] = useState(false);
  const hoje = diaISO();
  const primeiroNome = barbeiro.data?.nome.split(' ')[0] ?? '';

  return (
    <TelaBase
      titulo={primeiroNome ? `Oi, ${primeiroNome}` : 'Início'}
      subtitulo={formatDiaLongo(hoje)}
      onAtualizar={() => {
        resumo.refetch();
        proximos.refetch();
      }}
      direita={
        <BotaoIcone testID="olho" rotulo={oculto ? 'Mostrar valores' : 'Esconder valores'} onPress={alternarOcultarValores}
          icone={oculto ? { ios: 'eye.slash', android: 'visibility_off', web: 'visibility_off' } : { ios: 'eye', android: 'visibility', web: 'visibility' }} />
      }
      flutuante={resumo.data?.caixa_fechado ? undefined : <DuoButton testID="inicio-atendimento" rotulo="+ Atendimento" onPress={() => setLancando(true)} />}
    >
      <Cartao testID="hoje">
        <View style={styles.linha}>
          <Texto variante="caption" cor="textMuted" style={styles.flex}>Hoje</Texto>
          <Chip testID="ver-faturamento" rotulo="Faturamento" selecionado={visao === 'faturamento'} onPress={() => setVisao('faturamento')} />
          <Chip testID="ver-lucro" rotulo="Lucro" selecionado={visao === 'lucro'} onPress={() => setVisao('lucro')} />
        </View>
        {resumo.isPending ? (
          <Carregando />
        ) : resumo.isError || !resumo.data ? (
          <EstadoErro onTentar={() => resumo.refetch()} />
        ) : (
          <>
            <Dinheiro testID="hoje-valor" variante="display" valor={visao === 'faturamento' ? resumo.data.faturamento : resumo.data.lucro}
              cor={visao === 'lucro' && Number(resumo.data.lucro) < 0 ? 'danger' : 'text'}
              sinal={visao === 'lucro' && Number(resumo.data.lucro) < 0 ? '−' : undefined} />
            <Texto variante="bodySm" cor="textMuted" numero testID="hoje-detalhe">
              {resumo.data.atendimentos} atendimento(s) · {resumo.data.agendados} agendado(s)
              {resumo.data.caixa_fechado ? ' · caixa fechado' : ''}
            </Texto>
            {visao === 'lucro' ? (
              <Texto variante="caption" cor="textMuted">
                Lucro = faturamento − taxas da maquininha − produtos usados − gastos de hoje.
              </Texto>
            ) : null}
          </>
        )}
      </Cartao>

      <Texto variante="h3" accessibilityRole="header">Próximos horários</Texto>
      {proximos.isPending ? (
        <Carregando />
      ) : proximos.isError ? (
        <EstadoErro onTentar={() => proximos.refetch()} />
      ) : proximos.data.length === 0 ? (
        <EstadoVazio titulo="Nenhum horário marcado" acao="Abrir a agenda" onAcao={() => router.push('/agenda')} />
      ) : (
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
        })
      )}
      <LancarSheet aberto={lancando} onFechar={() => setLancando(false)} />
    </TelaBase>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  flex: { flex: 1 },
});
