// One appointment of the agenda: the booking "CRM" on top (client, date, time,
// professional, services with price, total; tapping the client opens their
// profile) and the actions below.
//   agendado:  conclude (with payment), no-show, cancel (hold 2 s)
//   concluído: payment, "Ofereceu algo?", delete (hold 2 s)
import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Chip } from '@/components/Chip';
import { Dinheiro } from '@/components/Dinheiro';
import { DuoButton } from '@/components/DuoButton';
import { HoldToConfirm } from '@/components/HoldToConfirm';
import { SecondaryButton } from '@/components/SecondaryButton';
import { Texto } from '@/components/Texto';
import { NOME_PAGAMENTO, type FormaPagamento } from '@/features/conta/barbeiro';
import { diaISO, formatDiaLongo, formatHora } from '@/lib/format';
import { color, radius, space } from '@/theme/tokens';

import { useApagarAtendimento, useConcluir, useMudarStatus, type ItemAgenda } from './api';
import { OfertaPainel } from './OfertaPainel';

type Props = {
  item: ItemAgenda | null;
  caixaFechado: boolean;
  onFechar: () => void;
  /** Extra block for a scheduled client (Phase 3: offers when the client sits). */
  extraAgendado?: (item: ItemAgenda) => ReactNode;
  /** Who does the service (the barber; on a team, each barber). */
  profissional?: string;
};

function Linha({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <View style={styles.linhaCrm}>
      <Texto variante="caption" cor="textMuted" style={styles.rotulo}>{rotulo}</Texto>
      <View style={styles.flex}>{children}</View>
    </View>
  );
}

export const NOME_STATUS = { agendado: 'Agendado', concluido: '✓ Concluído', falta: 'Faltou', cancelado: 'Cancelado' } as const;

export function AtendimentoSheet({ item, caixaFechado, onFechar, extraAgendado, profissional }: Props) {
  const concluir = useConcluir();
  const mudarStatus = useMudarStatus();
  const apagar = useApagarAtendimento();
  const [forma, setForma] = useState<FormaPagamento>('pix');
  const [ofertando, setOfertando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function fechar() {
    setOfertando(false);
    setErro(null);
    onFechar();
  }

  async function acao(fn: () => Promise<unknown>, depois?: () => void) {
    setErro(null);
    try {
      await fn();
      (depois ?? fechar)();
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não deu certo. Tente de novo.');
    }
  }

  const titulo = item ? `${formatHora(item.inicio)} · ${item.cliente ?? 'Sem cliente'}` : '';

  return (
    <BottomSheet aberto={item !== null} onFechar={fechar} titulo={ofertando ? 'Ofereceu algo?' : titulo} testID="atendimento-sheet">
      {item === null ? null : ofertando ? (
        <OfertaPainel atendimentoId={item.id} servicoIds={item.servico_ids} forma={item.forma_pagamento ?? forma} onPronto={fechar} />
      ) : (
        <>
          <View style={styles.crm} testID="crm-agendamento">
            <Linha rotulo="Cliente">
              {item.cliente_id ? (
                <Pressable testID="crm-cliente" accessibilityRole="link" accessibilityLabel={`Abrir o cadastro de ${item.cliente ?? 'cliente'}`}
                  hitSlop={8} onPress={() => { fechar(); router.push({ pathname: '/cliente/[id]', params: { id: item.cliente_id! } }); }}>
                  <Texto peso="semibold" cor="brand">{item.cliente ?? 'Cliente'} ›</Texto>
                </Pressable>
              ) : <Texto peso="medium">Sem cliente</Texto>}
            </Linha>
            <Linha rotulo="Data"><Texto>{(() => { const d = diaISO(new Date(item.inicio)); return formatDiaLongo(d).replace(/^./, (c) => c.toUpperCase()); })()}</Texto></Linha>
            <Linha rotulo="Horário"><Texto numero>{formatHora(item.inicio)}{item.fim ? ` – ${formatHora(item.fim)}` : ''}</Texto></Linha>
            {profissional ? <Linha rotulo="Profissional"><Texto>{profissional}</Texto></Linha> : null}
            <Linha rotulo="Serviços">
              {item.itens?.length ? item.itens.map((s, k) => (
                <View key={`${s.nome}${k}`} style={styles.resumo}>
                  <Texto style={styles.flex}>{s.nome}{s.extra ? ' (oferta)' : ''}{s.duracao ? <Texto variante="caption" cor="textMuted"> · {s.duracao} min</Texto> : null}</Texto>
                  <Dinheiro valor={s.valor} variante="bodySm" />
                </View>
              )) : <Texto>{item.servicos ?? '—'}</Texto>}
            </Linha>
            <View style={[styles.resumo, styles.total]}>
              <Texto peso="semibold" style={styles.flex}>Valor</Texto>
              <Dinheiro valor={item.valor} variante="h3" testID="crm-valor" />
            </View>
          </View>
          <Texto variante="bodySm" cor="textMuted">
            {NOME_STATUS[item.status]}
            {item.forma_pagamento ? ` · ${NOME_PAGAMENTO[item.forma_pagamento]}` : ''}
            {item.status === 'concluido' ? ` · ${item.ofertas === 0 ? 'nenhuma oferta registrada' : `${item.ofertas} oferta(s)`}` : ''}
          </Texto>

          {item.status === 'agendado' ? (
            <>
              {extraAgendado ? extraAgendado(item) : null}
              <Texto variante="bodySm" peso="medium">Pagamento</Texto>
              <View style={styles.chips}>
                {(['pix', 'dinheiro', 'debito', 'credito'] as FormaPagamento[]).map((f) => (
                  <Chip key={f} rotulo={NOME_PAGAMENTO[f]} selecionado={forma === f} onPress={() => setForma(f)} />
                ))}
              </View>
              <DuoButton testID="concluir" rotulo="Concluir atendimento" carregando={concluir.isPending} desativado={caixaFechado}
                onPress={() => acao(() => concluir.mutateAsync({ atendimento: item.id, forma }), () => setOfertando(true))} />
              <SecondaryButton testID="faltou" rotulo="Cliente faltou" onPress={() => acao(() => mudarStatus.mutateAsync({ atendimento: item.id, status: 'falta' }))} />
              <HoldToConfirm rotulo="Cancelar horário" onConfirmar={() => acao(() => mudarStatus.mutateAsync({ atendimento: item.id, status: 'cancelado' }))} />
            </>
          ) : item.status === 'concluido' ? (
            <>
              <DuoButton testID="registrar-oferta" rotulo={item.ofertas === 0 ? 'Ofereceu algo?' : 'Registrar outra oferta'}
                desativado={caixaFechado} onPress={() => setOfertando(true)} />
              {caixaFechado ? (
                <Texto variante="bodySm" cor="textMuted">Caixa fechado: reabra o caixa para mudar este dia.</Texto>
              ) : (
                <HoldToConfirm testID="apagar" rotulo="Apagar lançamento" onConfirmar={() => acao(() => apagar.mutateAsync(item.id))} />
              )}
            </>
          ) : (
            <HoldToConfirm rotulo="Apagar da agenda" onConfirmar={() => acao(() => apagar.mutateAsync(item.id))} />
          )}
          {erro ? <Texto cor="danger" peso="medium" accessibilityRole="alert">⚠ {erro}</Texto> : null}
        </>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  crm: { gap: space[2], padding: space[3], borderRadius: radius.md, backgroundColor: color.surface, borderWidth: 1, borderColor: color.border },
  linhaCrm: { flexDirection: 'row', alignItems: 'flex-start', gap: space[3] },
  rotulo: { width: 86, paddingTop: 3 },
  total: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: color.border, paddingTop: space[2] },
  resumo: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  flex: { flex: 1 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
});
