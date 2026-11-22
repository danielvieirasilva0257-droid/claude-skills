// Tela 25 · Equipe: who is on the team, invite with a one-time code (7 days),
// remove a barber (their data stays theirs), the plan price for the current
// team size (computed by the database) and closing the barbershop.
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Share, StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Cartao } from '@/components/Cartao';
import { Dinheiro } from '@/components/Dinheiro';
import { Carregando, EstadoErro } from '@/components/Estado';
import { HoldToConfirm } from '@/components/HoldToConfirm';
import { SecondaryButton } from '@/components/SecondaryButton';
import { StatusButton } from '@/components/StatusButton';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import {
  useCancelarConvite, useEncerrarBarbearia, useEquipe, useGerarConvite, useRemoverDaEquipe, type Membro,
} from '@/features/barbearia/api';
import { formatDiaLongo, formatMoeda } from '@/lib/format';
import { color, radius, space } from '@/theme/tokens';

export default function TelaEquipe() {
  const equipe = useEquipe();
  const gerar = useGerarConvite();
  const cancelar = useCancelarConvite();
  const remover = useRemoverDaEquipe();
  const encerrar = useEncerrarBarbearia();
  const [saindo, setSaindo] = useState<Membro | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  if (equipe.isPending) return <Carregando />;
  if (equipe.isError || !equipe.data) return <EstadoErro onTentar={() => equipe.refetch()} />;
  const e = equipe.data;
  const novo = gerar.data;

  function compartilhar(codigo: string) {
    Share.share({ message: `Entre na equipe da ${e.barbearia.nome} no App Barbeiros: Mais › Barbearia › código ${codigo} (vale 7 dias).` })
      .catch(() => undefined);
  }

  return (
    <TelaBase titulo="Equipe" semTitulo>
      <Stack.Screen options={{ title: 'Equipe' }} />
      <Texto variante="h2">{e.barbearia.nome}</Texto>

      <View testID="lista-equipe">
        {e.membros.map((m) => (
          <View key={m.barbeiro_id} style={styles.membro} testID="membro">
            <View style={styles.flex}>
              <Texto peso="semibold">{m.nome}</Texto>
              <Texto variante="caption" cor="textMuted" numero>
                {m.papel === 'dono' ? 'Dono' : 'Barbeiro'} · desde {formatDiaLongo(m.entrou_em.slice(0, 10))}
                {m.atendimentos_mes !== null ? ` · ${m.atendimentos_mes} atendimento(s) no mês` : ''}
              </Texto>
            </View>
            {e.sou_dono && m.papel === 'barbeiro' ? (
              <SecondaryButton compacto rotulo="Remover" testID={`remover-${m.nome}`} onPress={() => { setErro(null); setSaindo(m); }} />
            ) : null}
          </View>
        ))}
      </View>

      {e.sou_dono ? (
        <>
          <Cartao testID="convidar">
            <Texto variante="h3" accessibilityRole="header">Convidar barbeiro</Texto>
            <Texto variante="bodySm" cor="textMuted">Cada código serve para 1 barbeiro e vale 7 dias. Ele entra pelo app dele, em Mais › Barbearia.</Texto>
            {novo ? (
              <View style={styles.codigo} accessibilityLabel={`Código ${novo.codigo.split('').join(' ')}`}>
                <Texto variante="display" cor="brand" numero testID="codigo-gerado" style={styles.letras}>{novo.codigo}</Texto>
                <SecondaryButton compacto rotulo="Compartilhar" onPress={() => compartilhar(novo.codigo)} />
              </View>
            ) : null}
            <StatusButton testID="gerar-convite" rotulo={novo ? 'Gerar outro código' : 'Gerar código'} rotuloCarregando="Gerando…" rotuloSucesso="Pronto"
              acao={async () => { await gerar.mutateAsync(); }} />
            {(e.convites ?? []).filter((c) => c.codigo !== novo?.codigo).map((c) => (
              <View key={c.codigo} style={styles.linha}>
                <Texto numero style={styles.flex}>{c.codigo} · vale até {formatDiaLongo(c.expira_em.slice(0, 10))}</Texto>
                <SecondaryButton compacto rotulo="Cancelar" onPress={() => cancelar.mutate(c.codigo)} />
              </View>
            ))}
          </Cartao>

          {e.assentos ? (
            <Cartao testID="assentos">
              <Texto variante="caption" cor="textMuted">Plano Barbearias com {e.assentos.barbeiros} barbeiro(s)</Texto>
              <View style={styles.linha}>
                <Dinheiro variante="h2" valor={e.assentos.valor_mensal} testID="valor-mensal" />
                <Texto cor="textMuted">/mês</Texto>
              </View>
              <Texto variante="caption" cor="textMuted" numero>
                {formatMoeda(e.assentos.valor_base)} com até {e.assentos.inclusos} barbeiros (você conta) · {formatMoeda(e.assentos.valor_por_extra)} por barbeiro a mais
                {e.assentos.extras > 0 ? ` · ${e.assentos.extras} a mais agora` : ''}
              </Texto>
            </Cartao>
          ) : null}

          <View style={styles.perigo}>
            <Texto variante="caption" cor="textMuted">Encerrar a barbearia tira todos da equipe. Cada barbeiro continua com os próprios dados e o próprio plano.</Texto>
            <HoldToConfirm testID="encerrar-barbearia" rotulo="Encerrar a barbearia"
              onConfirmar={() => encerrar.mutate(undefined, { onSuccess: () => router.replace('/barbearia') })} />
          </View>
        </>
      ) : null}

      <BottomSheet aberto={saindo !== null} onFechar={() => setSaindo(null)} titulo={`Remover ${saindo?.nome ?? ''}?`} testID="folha-remover">
        <Texto>Ele sai da equipe e você deixa de ver os números e a agenda dele. Os clientes e o histórico continuam com ele.</Texto>
        <HoldToConfirm testID="confirmar-remover" rotulo="Remover da equipe"
          onConfirmar={() => {
            if (!saindo) return;
            remover.mutate(saindo.barbeiro_id, { onSuccess: () => setSaindo(null), onError: (x) => setErro(x.message) });
          }} />
        {erro ? <Texto cor="danger">⚠ {erro}</Texto> : null}
      </BottomSheet>
    </TelaBase>
  );
}

const styles = StyleSheet.create({
  membro: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[3],
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: color.border },
  flex: { flex: 1 },
  linha: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  codigo: { alignItems: 'center', gap: space[3], paddingVertical: space[4], borderRadius: radius.lg, backgroundColor: color.brandSoft },
  letras: { letterSpacing: 6 },
  perigo: { gap: space[2], paddingTop: space[6] },
});
