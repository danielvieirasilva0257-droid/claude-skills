// Gastos do mês: common expense in neutral text with "−" (never red).
import { Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Campo } from '@/components/Campo';
import { Cartao } from '@/components/Cartao';
import { Chip } from '@/components/Chip';
import { Dinheiro } from '@/components/Dinheiro';
import { DuoButton } from '@/components/DuoButton';
import { Carregando, EstadoErro, EstadoVazio } from '@/components/Estado';
import { HoldToConfirm } from '@/components/HoldToConfirm';
import { StatusButton } from '@/components/StatusButton';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { useApagarGasto, useFinanceiro, useGastos, useSalvarGasto, type Gasto } from '@/features/pago/api';
import { PortaPlano } from '@/features/planos/PortaPlano';
import { diaISO, formatDiaLongo, inicioDoMes } from '@/lib/format';
import { space } from '@/theme/tokens';

const CATEGORIAS = ['aluguel', 'produtos', 'transporte', 'alimentação', 'equipamento', 'curso', 'outros'];

function Editor({ gasto, onFechar }: { gasto: Gasto | null | 'novo'; onFechar: () => void }) {
  const g = gasto === 'novo' ? null : gasto;
  const salvar = useSalvarGasto();
  const apagar = useApagarGasto();
  const [valor, setValor] = useState(g ? String(g.valor).replace('.', ',') : '');
  const [categoria, setCategoria] = useState(g?.categoria ?? 'produtos');
  const [descricao, setDescricao] = useState(g?.descricao ?? '');
  const [data, setData] = useState(g?.data ?? diaISO());
  const [recorrente, setRecorrente] = useState(g?.recorrente ?? false);

  async function gravar() {
    const v = Number(valor.replace(',', '.'));
    if (!(v > 0)) throw new Error('Valor inválido');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) throw new Error('Data assim: 2026-11-19');
    await salvar.mutateAsync({ id: g?.id, valor: v, categoria, descricao: descricao.trim() || null, data, recorrente });
    onFechar();
  }

  return (
    <BottomSheet aberto={gasto !== null} onFechar={onFechar} titulo={g ? 'Editar gasto' : 'Novo gasto'} testID="gasto-sheet">
      <Campo testID="gasto-valor" rotulo="Valor" prefixo="R$" value={valor} onChangeText={setValor} keyboardType="decimal-pad" inputMode="decimal" />
      <View style={styles.chips}>
        {CATEGORIAS.map((c) => <Chip key={c} rotulo={c} selecionado={categoria === c} onPress={() => setCategoria(c)} />)}
      </View>
      <Campo rotulo="Descrição (opcional)" value={descricao} onChangeText={setDescricao} />
      <Campo rotulo="Data" value={data} onChangeText={setData} ajuda="Ano-mês-dia" />
      <View style={styles.chips}>
        <Chip rotulo="Todo mês" selecionado={recorrente} onPress={() => setRecorrente(!recorrente)} />
      </View>
      <StatusButton testID="gasto-salvar" acao={gravar} />
      {g ? <HoldToConfirm rotulo="Apagar gasto" onConfirmar={() => apagar.mutate(g.id, { onSuccess: onFechar })} /> : null}
    </BottomSheet>
  );
}

function Gastos() {
  const inicio = inicioDoMes();
  const hoje = diaISO();
  const gastos = useGastos(inicio, hoje);
  const total = useFinanceiro(inicio, hoje, 'total');
  const [editando, setEditando] = useState<Gasto | null | 'novo'>(null);
  return (
    <TelaBase titulo="Gastos" semTitulo onAtualizar={() => gastos.refetch()}
      flutuante={<DuoButton testID="novo-gasto" rotulo="+ Gasto" onPress={() => setEditando('novo')} />}>
      <Stack.Screen options={{ title: 'Gastos' }} />
      <Cartao>
        <Texto variante="caption" cor="textMuted">Gastos deste mês</Texto>
        <Dinheiro variante="display" valor={total.data?.[0]?.gastos ?? 0} sinal="−" testID="gastos-total" />
      </Cartao>
      {gastos.isPending ? <Carregando /> : gastos.isError ? <EstadoErro onTentar={() => gastos.refetch()} /> :
        gastos.data.length === 0 ? <EstadoVazio titulo="Nenhum gasto neste mês" texto="Registre aluguel, produtos e transporte para ver o lucro de verdade." /> :
        gastos.data.map((g) => (
          <Cartao key={g.id} onPress={() => setEditando(g)} accessibilityLabel={`Editar gasto ${g.categoria}`}>
            <View style={styles.linha}>
              <View style={styles.flex}>
                <Texto peso="medium">{g.descricao || g.categoria}{g.recorrente ? ' · todo mês' : ''}</Texto>
                <Texto variante="caption" cor="textMuted">{formatDiaLongo(g.data)} · {g.categoria}</Texto>
              </View>
              <Dinheiro valor={g.valor} sinal="−" peso="semibold" />
            </View>
          </Cartao>
        ))}
      {editando ? <Editor key={editando === 'novo' ? 'novo' : editando.id} gasto={editando} onFechar={() => setEditando(null)} /> : null}
    </TelaBase>
  );
}

export default function TelaGastos() {
  return (
    <PortaPlano recurso="gastos" titulo="Gastos" descricao="Aluguel, produtos e transporte: o que sai, para ver o lucro de verdade."
      previa={<Texto variante="title">Gastos</Texto>}>
      <Gastos />
    </PortaPlano>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  linha: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  flex: { flex: 1 },
});
