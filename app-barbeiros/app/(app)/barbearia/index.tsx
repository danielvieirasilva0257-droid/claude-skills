// Tela 24 · Barbearia. One route, three situations (from minha_barbearia()):
//   · no barbershop: join with the owner's code (any plan); create one (plan Barbearias);
//   · barber on a team: what the owner sees and what stays private; leave any time;
//   · owner: today and the month of the team, per-barber cards, links to team and schedule.
// Every number, sum and variation comes from painel_barbearia().
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Campo } from '@/components/Campo';
import { Cartao } from '@/components/Cartao';
import { Dinheiro } from '@/components/Dinheiro';
import { Carregando, EstadoErro } from '@/components/Estado';
import { BarrasComparadas } from '@/components/graficos/BarrasComparadas';
import { HoldToConfirm } from '@/components/HoldToConfirm';
import { LinhaMenu } from '@/components/LinhaMenu';
import { SecondaryButton } from '@/components/SecondaryButton';
import { StatusButton } from '@/components/StatusButton';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { Comparacoes } from '@/components/Variacao';
import {
  useCriarBarbearia, useEntrarNaBarbearia, useEquipe, useMinhaBarbearia, usePainel, useSairDaBarbearia,
  type MinhaBarbearia,
} from '@/features/barbearia/api';
import { usePlano, useUsuarioId } from '@/features/conta/barbeiro';
import { PortaPlano } from '@/features/planos/PortaPlano';
import { formatDecimal, formatDiaLongo, formatMes, formatMoeda, formatPorcentagem } from '@/lib/format';
import { NOME_PLANO, PRECO_PLANO } from '@/lib/plano';
import { space } from '@/theme/tokens';

const CODIGO = /^[A-HJ-NP-Z2-9]{6}$/;

function SemBarbearia() {
  const plano = usePlano();
  const entrar = useEntrarNaBarbearia();
  const criar = useCriarBarbearia();
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const podeCriar = plano.data === 'barbearias' || plano.data === 'dev';

  return (
    <TelaBase titulo="Barbearia" semTitulo>
      <Stack.Screen options={{ title: 'Barbearia' }} />
      <Cartao testID="entrar-barbearia">
        <Texto variante="h3" accessibilityRole="header">Entrar na equipe de uma barbearia</Texto>
        <Texto variante="bodySm" cor="textMuted">Peça o código de 6 letras ao dono. Seus clientes, gastos e conversas continuam só seus.</Texto>
        <Campo rotulo="Código do convite" value={codigo} onChangeText={(t) => setCodigo(t.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
          autoCapitalize="characters" autoCorrect={false} spellCheck={false} autoComplete="off" placeholder="ABC234" testID="codigo-convite" />
        <StatusButton testID="barbearia-entrar" rotulo="Entrar" rotuloCarregando="Entrando…" rotuloSucesso="Entrou"
          acao={async () => {
            if (!CODIGO.test(codigo)) throw new Error('São 6 letras e números');
            await entrar.mutateAsync(codigo).catch((e: Error) => {
              throw new Error(/inválido|vencido/i.test(e.message) ? 'Código inválido ou vencido: peça outro ao dono' : e.message);
            });
          }} />
      </Cartao>

      <Cartao testID="criar-barbearia">
        <Texto variante="h3" accessibilityRole="header">É dono de uma barbearia?</Texto>
        {podeCriar ? (
          <>
            <Campo rotulo="Nome da barbearia" value={nome} onChangeText={setNome} placeholder="Barbearia do bairro" testID="nome-barbearia" maxLength={60} />
            <StatusButton testID="barbearia-criar" rotulo="Criar minha barbearia" rotuloCarregando="Criando…" rotuloSucesso="Criada"
              acao={async () => {
                if (nome.trim().length < 2) throw new Error('Escreva o nome');
                await criar.mutateAsync(nome.trim());
              }} />
          </>
        ) : (
          <>
            <Texto variante="bodySm" cor="textMuted">
              No plano Barbearias você vê o painel da casa, a equipe, a agenda de todos e o relatório de cada barbeiro. {PRECO_PLANO.barbearias}.
            </Texto>
            <SecondaryButton rotulo="Conhecer o plano Barbearias" onPress={() => router.push({ pathname: '/planos', params: { destaque: 'barbearias' } })} />
          </>
        )}
      </Cartao>
    </TelaBase>
  );
}

function NaEquipe({ minha }: { minha: NonNullable<MinhaBarbearia> }) {
  const equipe = useEquipe();
  const plano = usePlano();
  const sair = useSairDaBarbearia();
  const [erro, setErro] = useState<string | null>(null);
  return (
    <TelaBase titulo={minha.nome} semTitulo>
      <Stack.Screen options={{ title: minha.nome }} />
      <Cartao testID="na-equipe">
        <Texto variante="caption" cor="textMuted">Você faz parte da equipe</Texto>
        <Texto variante="h2">{minha.nome}</Texto>
        <Texto variante="bodySm" cor="textMuted" numero>Dono: {minha.dono} · {minha.barbeiros} barbeiro(s) · desde {formatDiaLongo(minha.entrou_em.slice(0, 10))}</Texto>
        <Texto variante="bodySm" testID="plano-equipe">Seu plano agora: {NOME_PLANO[plano.data ?? 'gratis']}</Texto>
      </Cartao>
      <Cartao>
        <Texto variante="h3" accessibilityRole="header">O que o dono vê</Texto>
        <Texto variante="bodySm">✓ Seus números do mês e a sua agenda, com só o primeiro nome do cliente.</Texto>
        <Texto variante="bodySm">✕ Telefone dos clientes, seus gastos e suas conversas: continuam só seus.</Texto>
      </Cartao>
      {equipe.data?.membros.length ? (
        <View>
          <Texto variante="caption" cor="textMuted">Equipe</Texto>
          {equipe.data.membros.map((m) => (
            <Texto key={m.barbeiro_id} style={styles.membro}>{m.nome}{m.papel === 'dono' ? ' · dono' : ''}</Texto>
          ))}
        </View>
      ) : null}
      <HoldToConfirm testID="sair-barbearia" rotulo="Sair da barbearia"
        onConfirmar={() => { setErro(null); sair.mutate(undefined, { onError: (e) => setErro(e.message) }); }} />
      {erro ? <Texto cor="danger">⚠ {erro}</Texto> : null}
    </TelaBase>
  );
}

function PainelDono() {
  const painel = usePainel();
  const uid = useUsuarioId();
  if (painel.isPending) return <Carregando />;
  if (painel.isError) return <EstadoErro onTentar={() => painel.refetch()} />;
  const p = painel.data;
  return (
    <TelaBase titulo={p.barbearia.nome} subtitulo={`Painel do dono · ${formatMes(p.mes)}`} semTitulo onAtualizar={() => painel.refetch()}>
      <Stack.Screen options={{ title: p.barbearia.nome }} />
      <View style={styles.dupla}>
        <Cartao style={styles.meio} testID="painel-hoje">
          <Texto variante="caption" cor="textMuted">Hoje na barbearia</Texto>
          <Dinheiro variante="h2" valor={p.hoje.faturamento} testID="painel-hoje-valor" />
          <Texto variante="caption" cor="textMuted" numero>{p.hoje.atendimentos} atendimento(s) · {p.hoje.agendados} agendado(s)</Texto>
        </Cartao>
        <Cartao style={styles.meio} testID="painel-mes">
          <Texto variante="caption" cor="textMuted">{p.comparacao?.ate_dia ? `No mês, até o dia ${p.comparacao.ate_dia}` : 'No mês'}</Texto>
          <Dinheiro variante="h2" valor={p.total.faturamento} testID="painel-mes-valor" />
          <Comparacoes anterior={p.total.variacao_faturamento} media={p.total.vs_media_faturamento} />
        </Cartao>
      </View>
      <Cartao>
        <View style={styles.linha}>
          <View style={styles.flex}>
            <Texto variante="caption" cor="textMuted">Atendimentos no mês</Texto>
            <Texto variante="h3" numero>{p.total.atendimentos}</Texto>
          </View>
          <View style={styles.flex}>
            <Texto variante="caption" cor="textMuted">Ticket médio da casa</Texto>
            <Dinheiro variante="h3" valor={p.total.ticket_medio} />
          </View>
        </View>
      </Cartao>

      <View>
        <LinhaMenu testID="ir-equipe" rotulo="Equipe" detalhe={`${p.equipe.length} barbeiro(s) · convidar e remover`} onPress={() => router.push('/barbearia/equipe')} />
        <LinhaMenu testID="ir-agenda-equipe" rotulo="Agenda da equipe" detalhe="Hoje de todos, por barbeiro" onPress={() => router.push('/barbearia/agenda')} />
      </View>

      {p.equipe.length > 1 ? (
        <BarrasComparadas testID="grafico-equipe" titulo="Faturamento por barbeiro" formatar={formatMoeda}
          rotuloAnterior={p.comparacao?.ate_dia ? `Mês passado até o dia ${p.comparacao.ate_dia}` : 'Mês passado'}
          itens={p.equipe.map((l) => ({ nome: l.barbeiro_id === uid ? `${l.nome} (você)` : l.nome, atual: Number(l.faturamento), anterior: Number(l.faturamento_anterior) }))} />
      ) : null}

      <Texto variante="h3" accessibilityRole="header">Cada barbeiro no mês</Texto>
      {p.equipe.map((l) => (
        <Cartao key={l.barbeiro_id} testID="painel-barbeiro" accessibilityLabel={`Relatório de ${l.nome}`}
          onPress={() => router.push({ pathname: '/barbearia/barbeiro/[id]', params: { id: l.barbeiro_id } })}>
          <View style={styles.linha}>
            <Texto peso="semibold" style={styles.flex}>{l.nome}{l.barbeiro_id === uid ? ' (você)' : ''}</Texto>
            <Dinheiro variante="body" peso="semibold" valor={l.faturamento} />
          </View>
          <Texto variante="caption" cor="textMuted" numero>
            {l.atendimentos} atendimento(s) · ticket {l.ticket_medio !== null ? formatMoeda(l.ticket_medio) : '—'} · ratio {formatDecimal(l.ratio)}
          </Texto>
          <Texto variante="caption" cor="textMuted" numero>
            Hoje {formatMoeda(l.hoje_faturamento)} · {l.hoje_agendados} agendado(s) · ocupação {formatPorcentagem(l.ocupacao)} · faltas {formatPorcentagem(l.taxa_faltas)}
          </Texto>
        </Cartao>
      ))}
    </TelaBase>
  );
}

export default function TelaBarbearia() {
  const minha = useMinhaBarbearia();
  if (minha.isPending) return <Carregando />;
  if (minha.isError) return <EstadoErro onTentar={() => minha.refetch()} />;
  const m = minha.data;
  if (!m) return <SemBarbearia />;
  if (m.papel === 'barbeiro') return <NaEquipe minha={m} />;
  return (
    <PortaPlano recurso="barbearia" titulo="Painel do dono" previa={<Texto variante="title">{m.nome}</Texto>}
      descricao="O plano Barbearias venceu: renove para ver o painel, a equipe e a agenda de todos.">
      <PainelDono />
    </PortaPlano>
  );
}

const styles = StyleSheet.create({
  dupla: { flexDirection: 'row', gap: space[3] },
  meio: { flex: 1, minHeight: 120, justifyContent: 'flex-end' },
  linha: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  flex: { flex: 1 },
  membro: { paddingVertical: space[2] },
});
