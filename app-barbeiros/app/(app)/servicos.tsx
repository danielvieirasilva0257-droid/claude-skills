// Serviços: price, duration, main/extra, recurrence interval, and which
// extras combine with each service (and whether they are done at the same time).
import { Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Campo } from '@/components/Campo';
import { Cartao } from '@/components/Cartao';
import { Chip } from '@/components/Chip';
import { DuoButton } from '@/components/DuoButton';
import { Carregando, EstadoErro, EstadoVazio } from '@/components/Estado';
import { StatusButton } from '@/components/StatusButton';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import {
  NOME_CATEGORIA,
  useCombos,
  useSalvarCombo,
  useSalvarServico,
  useServicos,
  type Categoria,
  type Servico,
} from '@/features/servicos/api';
import { formatMoeda } from '@/lib/format';
import { space } from '@/theme/tokens';

type Edicao = { servico: Servico | null } | null;

function numero(t: string) {
  const n = Number(t.replace(',', '.'));
  return Number.isFinite(n) ? n : NaN;
}

function Editor({ edicao, onFechar }: { edicao: Edicao; onFechar: () => void }) {
  const s = edicao?.servico ?? null;
  const servicos = useServicos();
  const combos = useCombos();
  const salvar = useSalvarServico();
  const salvarCombo = useSalvarCombo();
  const [nome, setNome] = useState(s?.nome ?? '');
  const [preco, setPreco] = useState(s ? String(s.preco).replace('.', ',') : '');
  const [duracao, setDuracao] = useState(s ? String(s.duracao_min) : '');
  const [categoria, setCategoria] = useState<Categoria>(s?.categoria ?? 'principal');
  const [intervalo, setIntervalo] = useState(s?.intervalo_recomendado_dias ? String(s.intervalo_recomendado_dias) : '');
  const [ativo, setAtivo] = useState(s?.ativo ?? true);
  const [erro, setErro] = useState<string | null>(null);

  async function gravar() {
    setErro(null);
    const p = numero(preco);
    const d = Number(duracao);
    const iv = intervalo.trim() ? Number(intervalo) : null;
    if (nome.trim().length < 2) throw new Error('Dê um nome ao serviço');
    if (!(p >= 0)) throw new Error('Preço inválido');
    if (!(d > 0)) throw new Error('Duração em minutos');
    if (iv !== null && !(iv > 0)) throw new Error('Intervalo em dias');
    await salvar.mutateAsync({ id: s?.id, nome: nome.trim(), categoria, preco: p, duracao_min: d, intervalo_recomendado_dias: iv, ativo });
    if (!s) onFechar();
  }

  const outros = (servicos.data ?? []).filter((x) => x.id !== s?.id && x.ativo);

  return (
    <BottomSheet aberto={edicao !== null} onFechar={onFechar} titulo={s ? s.nome : 'Novo serviço'} testID="servico-sheet">
      <Campo testID="servico-nome" rotulo="Nome" value={nome} onChangeText={setNome} />
      <View style={styles.dupla}>
        <View style={styles.flex}>
          <Campo testID="servico-preco" rotulo="Preço" prefixo="R$" value={preco} onChangeText={setPreco} keyboardType="decimal-pad" inputMode="decimal" />
        </View>
        <View style={styles.flex}>
          <Campo testID="servico-duracao" rotulo="Duração (min)" value={duracao} onChangeText={setDuracao} keyboardType="number-pad" inputMode="numeric" />
        </View>
      </View>
      <Texto variante="bodySm" peso="medium">Tipo</Texto>
      <View style={styles.chips}>
        {(Object.keys(NOME_CATEGORIA) as Categoria[]).map((c) => (
          <Chip key={c} rotulo={NOME_CATEGORIA[c]} selecionado={categoria === c} onPress={() => setCategoria(c)} />
        ))}
      </View>
      <Campo rotulo="Volta a cada (dias)" value={intervalo} onChangeText={setIntervalo} keyboardType="number-pad" inputMode="numeric"
        ajuda="Ex.: hidratação a cada 21 dias. O app lembra de oferecer quando chegar a hora. Deixe vazio se não repete." />
      <View style={styles.chips}>
        <Chip rotulo="Ativo" selecionado={ativo} onPress={() => setAtivo(true)} />
        <Chip rotulo="Pausado" selecionado={!ativo} onPress={() => setAtivo(false)} />
      </View>
      {erro ? <Texto cor="danger">⚠ {erro}</Texto> : null}
      <StatusButton testID="servico-salvar" acao={gravar} />

      {s ? (
        <>
          <Texto variante="h3" accessibilityRole="header">Extras que combinam</Texto>
          <Texto variante="bodySm" cor="textMuted">
            Marque o que dá para oferecer junto de {s.nome}. "Ao mesmo tempo" = feito sem aumentar o atendimento.
          </Texto>
          {combos.isPending ? <Carregando /> : outros.map((o) => {
            const combo = (combos.data ?? []).find((c) => c.servico_base_id === s.id && c.servico_extra_id === o.id);
            return (
              <View key={o.id} style={styles.combo}>
                <Chip rotulo={o.nome} selecionado={Boolean(combo)}
                  onPress={() => salvarCombo.mutate({ base: s.id, extra: o.id, ligado: !combo, simultaneo: false, tempo_extra_min: o.duracao_min })} />
                {combo ? (
                  <Chip rotulo="Ao mesmo tempo" selecionado={combo.simultaneo}
                    onPress={() => salvarCombo.mutate({ base: s.id, extra: o.id, ligado: true, simultaneo: !combo.simultaneo, tempo_extra_min: o.duracao_min })} />
                ) : null}
              </View>
            );
          })}
        </>
      ) : null}
    </BottomSheet>
  );
}

export default function Servicos() {
  const servicos = useServicos();
  const [edicao, setEdicao] = useState<Edicao>(null);

  return (
    <TelaBase titulo="Serviços" semTitulo onAtualizar={() => servicos.refetch()}
      flutuante={<DuoButton testID="novo-servico" rotulo="+ Serviço" onPress={() => setEdicao({ servico: null })} />}>
      <Stack.Screen options={{ title: 'Serviços' }} />
      {servicos.isPending ? (
        <Carregando />
      ) : servicos.isError ? (
        <EstadoErro onTentar={() => servicos.refetch()} />
      ) : servicos.data.length === 0 ? (
        <EstadoVazio titulo="Nenhum serviço ainda" texto='Toque em "+ Serviço" para cadastrar.' />
      ) : (
        (['principal', 'adicional', 'experiencia'] as Categoria[]).map((cat) => {
          const lista = servicos.data.filter((s) => s.categoria === cat);
          if (lista.length === 0) return null;
          return (
            <View key={cat} style={styles.grupo}>
              <Texto variante="h3" accessibilityRole="header">{cat === 'principal' ? 'Principais' : cat === 'adicional' ? 'Adicionais' : 'Experiências'}</Texto>
              {lista.map((s) => (
                <Cartao key={s.id} onPress={() => setEdicao({ servico: s })} accessibilityLabel={`Editar ${s.nome}`} testID={`servico-${s.nome}`}>
                  <View style={styles.linha}>
                    <Texto peso="medium" style={styles.flex} cor={s.ativo ? 'text' : 'textMuted'}>
                      {s.nome}{s.ativo ? '' : ' (pausado)'}
                    </Texto>
                    <Texto peso="semibold" numero>{formatMoeda(s.preco)}</Texto>
                  </View>
                  <Texto variante="caption" cor="textMuted" numero>
                    {s.duracao_min} min{s.intervalo_recomendado_dias ? ` · volta a cada ${s.intervalo_recomendado_dias} dias` : ''}
                  </Texto>
                </Cartao>
              ))}
            </View>
          );
        })
      )}
      {edicao ? <Editor key={edicao.servico?.id ?? 'novo'} edicao={edicao} onFechar={() => setEdicao(null)} /> : null}
    </TelaBase>
  );
}

const styles = StyleSheet.create({
  grupo: { gap: space[2] },
  linha: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  flex: { flex: 1 },
  dupla: { flexDirection: 'row', gap: space[3] },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  combo: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2], alignItems: 'center' },
});
