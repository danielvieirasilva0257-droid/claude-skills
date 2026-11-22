// "+ Atendimento" in 2 taps: tap 1 opens this sheet, tap 2 on a shortcut
// launches it (now, default payment, no client). Then "Ofereceu algo?".
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Cartao } from '@/components/Cartao';
import { Chip } from '@/components/Chip';
import { DuoButton } from '@/components/DuoButton';
import { Carregando, EstadoVazio } from '@/components/Estado';
import { SecondaryButton } from '@/components/SecondaryButton';
import { Texto } from '@/components/Texto';
import { useBarbeiro } from '@/features/conta/barbeiro';
import { useCombos, useServicos, type Servico } from '@/features/servicos/api';
import { formatMoeda } from '@/lib/format';
import { space } from '@/theme/tokens';

import { useLancar } from './api';
import { OfertaPainel } from './OfertaPainel';

type Props = { aberto: boolean; onFechar: () => void };
type Atalho = { chave: string; nome: string; ids: string[]; servicos: Servico[] };

export function LancarSheet({ aberto, onFechar }: Props) {
  const servicos = useServicos();
  const combos = useCombos();
  const barbeiro = useBarbeiro();
  const lancar = useLancar();
  const [montando, setMontando] = useState(false);
  const [escolhidos, setEscolhidos] = useState<string[]>([]);
  const [lancado, setLancado] = useState<{ id: string; servicos: string[] } | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const ativos = useMemo(() => (servicos.data ?? []).filter((s) => s.ativo), [servicos.data]);

  // Shortcuts: each main service, plus main+main combos (e.g. Corte + Barba).
  const atalhos = useMemo<Atalho[]>(() => {
    const principais = ativos.filter((s) => s.categoria === 'principal');
    const lista: Atalho[] = principais.map((s) => ({ chave: s.id, nome: s.nome, ids: [s.id], servicos: [s] }));
    for (const c of combos.data ?? []) {
      const base = principais.find((s) => s.id === c.servico_base_id);
      const extra = principais.find((s) => s.id === c.servico_extra_id);
      if (base && extra) lista.push({ chave: c.id, nome: `${base.nome} + ${extra.nome}`, ids: [base.id, extra.id], servicos: [base, extra] });
    }
    return lista;
  }, [ativos, combos.data]);

  function fechar() {
    setMontando(false);
    setEscolhidos([]);
    setLancado(null);
    setErro(null);
    onFechar();
  }

  async function lancarIds(ids: string[]) {
    setErro(null);
    try {
      const id = await lancar.mutateAsync({ servicos: ids });
      setLancado({ id, servicos: ids });
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não deu para lançar.');
    }
  }

  return (
    <BottomSheet aberto={aberto} onFechar={fechar} titulo={lancado ? 'Ofereceu algo?' : 'Novo atendimento'} testID="lancar-sheet">
      {lancado ? (
        <>
          <Texto peso="semibold" cor="brandLip" accessibilityLiveRegion="polite" testID="lancado-ok">
            ✓ Lançado
          </Texto>
          <OfertaPainel atendimentoId={lancado.id} servicoIds={lancado.servicos}
            forma={barbeiro.data?.pagamento_padrao ?? 'pix'} onPronto={fechar} />
        </>
      ) : servicos.isPending ? (
        <Carregando />
      ) : ativos.length === 0 ? (
        <EstadoVazio titulo="Nenhum serviço cadastrado" acao="Cadastrar serviços" onAcao={() => { fechar(); router.push('/servicos'); }} />
      ) : montando ? (
        <>
          <Texto cor="textMuted">Toque nos serviços feitos agora.</Texto>
          <View style={styles.chips}>
            {ativos.map((s) => (
              <Chip key={s.id} testID={`montar-${s.nome}`} rotulo={s.nome} detalhe={formatMoeda(s.preco)}
                selecionado={escolhidos.includes(s.id)}
                onPress={() => setEscolhidos((e) => (e.includes(s.id) ? e.filter((x) => x !== s.id) : [...e, s.id]))} />
            ))}
          </View>
          {erro ? <Texto cor="danger" peso="medium">⚠ {erro}</Texto> : null}
          <DuoButton testID="montar-lancar" rotulo="Lançar" desativado={escolhidos.length === 0}
            carregando={lancar.isPending} onPress={() => lancarIds(escolhidos)} />
          <SecondaryButton rotulo="Voltar" onPress={() => setMontando(false)} />
        </>
      ) : (
        <>
          <Texto cor="textMuted">Toque no que você fez. Já entra agora, no pagamento de sempre.</Texto>
          {atalhos.map((a) => (
            <Cartao key={a.chave} testID={`atalho-${a.nome}`} onPress={lancar.isPending ? undefined : () => lancarIds(a.ids)}
              accessibilityLabel={`Lançar ${a.nome}`}>
              <View style={styles.atalho}>
                <Texto variante="h3">{a.nome}</Texto>
                <Texto variante="bodySm" numero cor="brandLip" peso="semibold">
                  {a.servicos.map((s) => formatMoeda(s.preco)).join(' + ')}
                </Texto>
              </View>
            </Cartao>
          ))}
          {erro ? <Texto cor="danger" peso="medium">⚠ {erro}</Texto> : null}
          <SecondaryButton testID="montar" rotulo="Outros serviços" onPress={() => setMontando(true)} />
        </>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  atalho: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 36 },
});
