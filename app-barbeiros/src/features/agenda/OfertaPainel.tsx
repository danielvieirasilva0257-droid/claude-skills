// "Ofereceu algo?": one row per extra the client did not do. Accepted offers
// become items of the appointment (the database adds the price); refused ones
// can carry a reason. Also lets the barber fix the payment method.
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Chip } from '@/components/Chip';
import { DuoButton } from '@/components/DuoButton';
import { Texto } from '@/components/Texto';
import { NOME_PAGAMENTO, type FormaPagamento } from '@/features/conta/barbeiro';
import { useProdutos, useServicos } from '@/features/servicos/api';
import { formatMoeda } from '@/lib/format';
import { color, radius, space } from '@/theme/tokens';

import { NOME_MOTIVO, useMudarPagamento, useRegistrarOferta, type Motivo } from './api';

type Props = {
  atendimentoId: string;
  servicoIds: string[];
  forma: FormaPagamento | null;
  onPronto: () => void;
};

type Registro = { aceitou: boolean; motivo?: Motivo | null };

export function OfertaPainel({ atendimentoId, servicoIds, forma, onPronto }: Props) {
  const servicos = useServicos();
  const produtos = useProdutos();
  const ofertar = useRegistrarOferta();
  const pagar = useMudarPagamento();
  const [registros, setRegistros] = useState<Record<string, Registro>>({});
  const [recusando, setRecusando] = useState<string | null>(null);
  const [pagamento, setPagamento] = useState<FormaPagamento | null>(forma);
  const [erro, setErro] = useState<string | null>(null);

  const extras = [
    ...(servicos.data ?? [])
      .filter((s) => s.ativo && s.categoria !== 'principal' && !servicoIds.includes(s.id))
      .map((s) => ({ chave: `s:${s.id}`, nome: s.nome, preco: s.preco, servico: s.id })),
    ...(produtos.data ?? []).map((p) => ({ chave: `p:${p.id}`, nome: p.nome, preco: p.preco, produto: p.id })),
  ];

  async function registrar(item: (typeof extras)[number], aceitou: boolean, motivo: Motivo | null = null) {
    setErro(null);
    try {
      await ofertar.mutateAsync({
        atendimento: atendimentoId,
        aceitou,
        motivo,
        ...('servico' in item ? { servico: item.servico } : { produto: item.produto }),
      });
      setRegistros((r) => ({ ...r, [item.chave]: { aceitou, motivo } }));
      setRecusando(null);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não deu para salvar.');
    }
  }

  async function trocarPagamento(f: FormaPagamento) {
    setPagamento(f);
    try {
      await pagar.mutateAsync({ atendimento: atendimentoId, forma: f });
    } catch {
      setErro('Não deu para mudar o pagamento.');
    }
  }

  return (
    <View style={styles.coluna} testID="ofereceu-algo">
      <Texto cor="textMuted">Registre o que você ofereceu. Assim o app mostra o que mais fecha.</Texto>
      {extras.map((item) => {
        const r = registros[item.chave];
        return (
          <View key={item.chave} style={styles.linha} testID={`oferta-${item.nome}`}>
            <View style={styles.nome}>
              <Texto peso="medium">{item.nome}</Texto>
              <Texto variante="caption" cor="textMuted" numero>
                {formatMoeda(item.preco)}
              </Texto>
            </View>
            {r ? (
              <Texto variante="bodySm" peso="semibold" cor={r.aceitou ? 'brandLip' : 'textMuted'}>
                {r.aceitou ? '✓ Aceitou' : `Não aceitou${r.motivo ? ` · ${NOME_MOTIVO[r.motivo]}` : ''}`}
              </Texto>
            ) : recusando === item.chave ? (
              <View style={styles.motivos}>
                {(Object.keys(NOME_MOTIVO) as Motivo[]).map((m) => (
                  <Chip key={m} rotulo={NOME_MOTIVO[m]} selecionado={false} onPress={() => registrar(item, false, m)} />
                ))}
                <Chip rotulo="Sem motivo" selecionado={false} onPress={() => registrar(item, false)} />
              </View>
            ) : (
              <View style={styles.botoes}>
                <Chip testID={`aceitou-${item.nome}`} rotulo="Aceitou" selecionado={false} onPress={() => registrar(item, true)} />
                <Chip testID={`recusou-${item.nome}`} rotulo="Não" selecionado={false} onPress={() => setRecusando(item.chave)} />
              </View>
            )}
          </View>
        );
      })}

      <Texto variante="bodySm" peso="medium">
        Pagamento
      </Texto>
      <View style={styles.motivos}>
        {(['pix', 'dinheiro', 'debito', 'credito'] as FormaPagamento[]).map((f) => (
          <Chip key={f} testID={`pagamento-${f}`} rotulo={NOME_PAGAMENTO[f]} selecionado={pagamento === f} onPress={() => trocarPagamento(f)} />
        ))}
      </View>
      {erro ? <Texto cor="danger" peso="medium">⚠ {erro}</Texto> : null}
      <DuoButton testID="oferta-pronto" rotulo="Pronto" onPress={onPronto} />
    </View>
  );
}

const styles = StyleSheet.create({
  coluna: { gap: space[3] },
  linha: {
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.md,
    padding: space[3],
    gap: space[2],
  },
  nome: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  botoes: { flexDirection: 'row', gap: space[2] },
  motivos: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
});
