// Comissão: fixed or tiered (on the total or marginal), base (gross, minus fees,
// minus fees and supplies), products %, chair rent. Saved from this month on.
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Campo } from '@/components/Campo';
import { Chip } from '@/components/Chip';
import { Carregando, EstadoErro } from '@/components/Estado';
import { SecondaryButton } from '@/components/SecondaryButton';
import { StatusButton } from '@/components/StatusButton';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { useExtrato, useSalvarRegra, type Regra } from '@/features/pago/api';
import { PortaPlano } from '@/features/planos/PortaPlano';
import { space } from '@/theme/tokens';

type FaixaForm = { de: string; ate: string; pct: string };
const num = (t: string) => Number(t.replace(/\./g, '').replace(',', '.'));
const pctTexto = (v: unknown) => (v === null || v === undefined ? '' : String(Math.round(Number(v) * 10000) / 100).replace('.', ','));
const valorTexto = (v: unknown) => (v === null || v === undefined ? '' : String(Number(v)).replace('.', ','));

const BASES: Record<Regra['base'], string> = {
  bruto: 'Valor cheio',
  liquido_taxa: 'Menos a taxa da maquininha',
  liquido_taxa_insumo: 'Menos taxa e produtos usados',
};

function Comissao() {
  const extrato = useExtrato();
  const salvar = useSalvarRegra();
  const [tipo, setTipo] = useState<Regra['tipo']>('fixa');
  const [metodo, setMetodo] = useState<Regra['metodo_faixa']>('total');
  const [base, setBase] = useState<Regra['base']>('bruto');
  const [pctFixo, setPctFixo] = useState('40');
  const [pctProduto, setPctProduto] = useState('10');
  const [aluguel, setAluguel] = useState('0');
  const [faixas, setFaixas] = useState<FaixaForm[]>([{ de: '0', ate: '10000', pct: '25' }, { de: '10000', ate: '', pct: '27' }]);

  useEffect(() => {
    const r = extrato.data?.regra;
    if (!r) return;
    setTipo(r.tipo);
    setMetodo(r.metodo_faixa);
    setBase(r.base);
    setPctFixo(pctTexto(r.pct_servico_fixo));
    setPctProduto(pctTexto(r.pct_produto));
    setAluguel(valorTexto(r.aluguel_cadeira_mensal));
    if (r.faixas.length) setFaixas(r.faixas.map((f) => ({ de: valorTexto(f.de), ate: valorTexto(f.ate), pct: pctTexto(f.pct) })));
  }, [extrato.data]);

  async function gravar() {
    await salvar.mutateAsync({
      tipo, metodo, base,
      pctFixo: tipo === 'fixa' ? num(pctFixo) / 100 : null,
      pctProduto: num(pctProduto || '0') / 100,
      aluguel: num(aluguel || '0'),
      faixas: tipo === 'escalonada' ? faixas.map((f) => ({ de: num(f.de), ate: f.ate.trim() ? num(f.ate) : null, pct: num(f.pct) / 100 })) : [],
    }).catch((e: Error) => {
      throw new Error(e.message.replace(/^.*?: /, '').slice(0, 60));
    });
  }

  if (extrato.isPending) return <Carregando />;
  if (extrato.isError) return <EstadoErro onTentar={() => extrato.refetch()} />;

  return (
    <TelaBase titulo="Comissão" semTitulo>
      <Stack.Screen options={{ title: 'Comissão' }} />
      <Texto cor="textMuted">Como a barbearia calcula o que é seu. Vale a partir deste mês.</Texto>
      <View style={styles.chips}>
        <Chip testID="tipo-fixa" rotulo="Percentual fixo" selecionado={tipo === 'fixa'} onPress={() => setTipo('fixa')} />
        <Chip testID="tipo-escalonada" rotulo="Escalonada (por faixa)" selecionado={tipo === 'escalonada'} onPress={() => setTipo('escalonada')} />
      </View>
      {tipo === 'fixa' ? (
        <Campo testID="pct-fixo" rotulo="Seu percentual nos serviços (%)" value={pctFixo} onChangeText={setPctFixo} keyboardType="decimal-pad" inputMode="decimal" />
      ) : (
        <>
          <Texto variante="bodySm" peso="medium">Como a faixa vale</Texto>
          <View style={styles.chips}>
            <Chip rotulo="Sobre o total" selecionado={metodo === 'total'} onPress={() => setMetodo('total')} />
            <Chip rotulo="Só na parte da faixa" selecionado={metodo === 'marginal'} onPress={() => setMetodo('marginal')} />
          </View>
          <Texto variante="caption" cor="textMuted">
            "Sobre o total": passou de faixa, o novo percentual vale para o mês inteiro. "Só na parte": cada percentual vale só no trecho dele.
          </Texto>
          {faixas.map((f, i) => (
            <View key={i} style={styles.faixa}>
              <View style={styles.flex}><Campo rotulo="De (R$)" value={f.de} editable={i > 0}
                onChangeText={(t) => setFaixas((fs) => fs.map((x, j) => (j === i ? { ...x, de: t } : j === i - 1 ? { ...x, ate: t } : x)))} keyboardType="decimal-pad" /></View>
              <View style={styles.flex}><Campo rotulo="Até (R$)" value={f.ate} placeholder="sem teto" editable={i < faixas.length - 1}
                onChangeText={(t) => setFaixas((fs) => fs.map((x, j) => (j === i ? { ...x, ate: t } : j === i + 1 ? { ...x, de: t } : x)))} keyboardType="decimal-pad" /></View>
              <View style={styles.pct}><Campo rotulo="%" value={f.pct}
                onChangeText={(t) => setFaixas((fs) => fs.map((x, j) => (j === i ? { ...x, pct: t } : x)))} keyboardType="decimal-pad" /></View>
            </View>
          ))}
          <View style={styles.chips}>
            <SecondaryButton compacto rotulo="+ Faixa" onPress={() => setFaixas((fs) => {
              const ultima = fs[fs.length - 1]!;
              const novoTeto = ultima.de ? String(num(ultima.de) + 5000) : '';
              return [...fs.slice(0, -1), { ...ultima, ate: novoTeto }, { de: novoTeto, ate: '', pct: ultima.pct }];
            })} />
            {faixas.length > 2 ? <SecondaryButton compacto rotulo="− Faixa" onPress={() => setFaixas((fs) => {
              const menos = fs.slice(0, -1);
              return menos.map((x, j) => (j === menos.length - 1 ? { ...x, ate: '' } : x));
            })} /> : null}
          </View>
        </>
      )}
      <Texto variante="bodySm" peso="medium">Base do cálculo</Texto>
      <View style={styles.chips}>
        {(Object.keys(BASES) as Regra['base'][]).map((b) => <Chip key={b} rotulo={BASES[b]} selecionado={base === b} onPress={() => setBase(b)} />)}
      </View>
      <View style={styles.faixa}>
        <View style={styles.flex}><Campo rotulo="Nos produtos (%)" value={pctProduto} onChangeText={setPctProduto} keyboardType="decimal-pad" /></View>
        <View style={styles.flex}><Campo rotulo="Aluguel da cadeira (R$/mês)" value={aluguel} onChangeText={setAluguel} keyboardType="decimal-pad" /></View>
      </View>
      <StatusButton testID="comissao-salvar" acao={gravar} />
      <SecondaryButton rotulo="Ver extrato do mês" onPress={() => router.push('/extrato')} />
    </TelaBase>
  );
}

export default function TelaComissao() {
  return (
    <PortaPlano recurso="comissao" titulo="Comissão" descricao="Comissão fixa ou escalonada, com extrato do mês em cascata e PDF."
      previa={<Texto variante="title">Comissão</Texto>}>
      <Comissao />
    </PortaPlano>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  faixa: { flexDirection: 'row', gap: space[2] },
  flex: { flex: 1 },
  pct: { width: 72 },
});
