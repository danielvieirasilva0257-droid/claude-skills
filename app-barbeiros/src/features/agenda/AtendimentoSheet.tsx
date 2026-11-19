// Actions on one appointment of the agenda.
//   agendado:  conclude (with payment), no-show, cancel (hold 2 s)
//   concluído: payment, "Ofereceu algo?", delete (hold 2 s)
import { useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Chip } from '@/components/Chip';
import { Dinheiro } from '@/components/Dinheiro';
import { DuoButton } from '@/components/DuoButton';
import { HoldToConfirm } from '@/components/HoldToConfirm';
import { SecondaryButton } from '@/components/SecondaryButton';
import { Texto } from '@/components/Texto';
import { NOME_PAGAMENTO, type FormaPagamento } from '@/features/conta/barbeiro';
import { formatHora } from '@/lib/format';
import { space } from '@/theme/tokens';

import { useApagarAtendimento, useConcluir, useMudarStatus, type ItemAgenda } from './api';
import { OfertaPainel } from './OfertaPainel';

type Props = {
  item: ItemAgenda | null;
  caixaFechado: boolean;
  onFechar: () => void;
  /** Extra block for a scheduled client (Phase 3: offers when the client sits). */
  extraAgendado?: (item: ItemAgenda) => ReactNode;
};

export const NOME_STATUS = { agendado: 'Agendado', concluido: '✓ Concluído', falta: 'Faltou', cancelado: 'Cancelado' } as const;

export function AtendimentoSheet({ item, caixaFechado, onFechar, extraAgendado }: Props) {
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
          <View style={styles.resumo}>
            <Texto peso="medium" style={styles.flex}>{item.servicos ?? '—'}</Texto>
            <Dinheiro valor={item.valor} variante="h3" />
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
  resumo: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  flex: { flex: 1 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
});
