// First use: 4 short questions (one per screen, suggestions pre-selected).
// The database stores the profile and creates the 7 standard services with
// prices proportional to the haircut (configurar_inicio).
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Campo } from '@/components/Campo';
import { Cartao } from '@/components/Cartao';
import { Chip } from '@/components/Chip';
import { DuoButton } from '@/components/DuoButton';
import { SecondaryButton } from '@/components/SecondaryButton';
import { Texto } from '@/components/Texto';
import {
  NOME_ESTRATEGIA,
  NOME_MODELO,
  type Estrategia,
  type ModeloTrabalho,
  type Publico,
} from '@/features/conta/barbeiro';
import { formatMoeda } from '@/lib/format';
import { supabase } from '@/lib/supabase';
import { color, radius, space } from '@/theme/tokens';

type PerfilPublico = {
  publico: Publico;
  nome: string;
  preco_corte_min: string | null;
  preco_corte_max: string | null;
  foco: string;
  estrategia_sugerida: Estrategia;
};

const EXPLICA_ESTRATEGIA: Record<Estrategia, string> = {
  volume: 'Mais clientes por dia, com extras que cabem no mesmo tempo.',
  ticket: 'Menos clientes, atendimento mais completo e de valor maior.',
  equilibrado: 'Um pouco dos dois, crescendo sem apertar a agenda.',
};

function faixa(p: PerfilPublico) {
  if (p.preco_corte_min && p.preco_corte_max) return `${formatMoeda(p.preco_corte_min)} a ${formatMoeda(p.preco_corte_max)}`;
  if (p.preco_corte_min) return `a partir de ${formatMoeda(p.preco_corte_min)}`;
  return `até ${formatMoeda(p.preco_corte_max)}`;
}

export default function Onboarding() {
  const qc = useQueryClient();
  const [passo, setPasso] = useState(0);
  const [preco, setPreco] = useState('');
  const [publico, setPublico] = useState<Publico>('C');
  const [modelo, setModelo] = useState<ModeloTrabalho>('comissionado');
  const [estrategia, setEstrategia] = useState<Estrategia>('equilibrado');
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const perfis = useQuery({
    queryKey: ['perfis_publico'],
    queryFn: async () => {
      const { data, error } = await supabase.from('perfis_publico').select('*').order('publico');
      if (error) throw error;
      return data as PerfilPublico[];
    },
  });

  const valorPreco = Number(preco.replace(',', '.'));

  async function avancar() {
    setErro(null);
    if (passo === 0) {
      if (!Number.isFinite(valorPreco) || valorPreco <= 0) {
        setErro('Digite o preço do seu corte, por exemplo 45.');
        return;
      }
      const { data } = await supabase.rpc('publico_por_preco', { p_preco: valorPreco });
      const sugerido = (data as Publico | null) ?? 'C';
      setPublico(sugerido);
      setEstrategia(perfis.data?.find((p) => p.publico === sugerido)?.estrategia_sugerida ?? 'equilibrado');
    }
    if (passo < 3) {
      setPasso(passo + 1);
      return;
    }
    setSalvando(true);
    const { error } = await supabase.rpc('configurar_inicio', {
      p_preco_corte: valorPreco,
      p_publico: publico,
      p_modelo: modelo,
      p_estrategia: estrategia,
    });
    setSalvando(false);
    if (error) {
      setErro('Não deu para salvar. Tente de novo.');
      return;
    }
    await qc.invalidateQueries({ queryKey: ['barbeiro'] });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <View style={styles.progresso} accessibilityRole="progressbar" accessibilityLabel={`Passo ${passo + 1} de 4`}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[styles.barra, i <= passo ? styles.barraFeita : null]} />
          ))}
        </View>
        <Texto variante="caption" cor="textMuted">
          Passo {passo + 1} de 4
        </Texto>

        {passo === 0 ? (
          <>
            <Texto variante="title" accessibilityRole="header">Quanto você cobra no corte?</Texto>
            <Texto cor="textMuted">Com esse valor o app monta seus serviços. Dá para mudar tudo depois.</Texto>
            <Campo testID="onb-preco" rotulo="Preço do corte" prefixo="R$" value={preco} onChangeText={setPreco}
              keyboardType="decimal-pad" inputMode="decimal" placeholder="45" erro={erro} onSubmitEditing={avancar} />
          </>
        ) : passo === 1 ? (
          <>
            <Texto variante="title" accessibilityRole="header">Quem é o seu público?</Texto>
            <Texto cor="textMuted">Sugerimos pelo preço do corte. A IA fala do jeito desse público.</Texto>
            {(perfis.data ?? []).map((p) => (
              <Cartao key={p.publico} onPress={() => setPublico(p.publico)} testID={`onb-publico-${p.publico}`}
                accessibilityLabel={`${p.nome}, ${faixa(p)}`}
                style={publico === p.publico ? styles.escolhido : undefined}>
                <Texto peso="semibold" cor={publico === p.publico ? 'brandLip' : 'text'}>
                  {publico === p.publico ? '✓ ' : ''}
                  {p.nome} · {faixa(p)}
                </Texto>
                <Texto variante="bodySm" cor="textMuted">{p.foco}</Texto>
              </Cartao>
            ))}
          </>
        ) : passo === 2 ? (
          <>
            <Texto variante="title" accessibilityRole="header">Como você trabalha?</Texto>
            <Texto cor="textMuted">Isso muda como o app calcula o que é seu no fim do mês.</Texto>
            <View style={styles.chips}>
              {(Object.keys(NOME_MODELO) as ModeloTrabalho[]).map((m) => (
                <Chip key={m} testID={`onb-modelo-${m}`} rotulo={NOME_MODELO[m]} selecionado={modelo === m} onPress={() => setModelo(m)} />
              ))}
            </View>
          </>
        ) : (
          <>
            <Texto variante="title" accessibilityRole="header">Qual é o seu foco agora?</Texto>
            {(Object.keys(NOME_ESTRATEGIA) as Estrategia[]).map((e) => (
              <Cartao key={e} onPress={() => setEstrategia(e)} testID={`onb-estrategia-${e}`}
                accessibilityLabel={NOME_ESTRATEGIA[e]} style={estrategia === e ? styles.escolhido : undefined}>
                <Texto peso="semibold" cor={estrategia === e ? 'brandLip' : 'text'}>
                  {estrategia === e ? '✓ ' : ''}
                  {NOME_ESTRATEGIA[e]}
                </Texto>
                <Texto variante="bodySm" cor="textMuted">{EXPLICA_ESTRATEGIA[e]}</Texto>
              </Cartao>
            ))}
            {erro ? <Texto cor="danger" peso="medium">⚠ {erro}</Texto> : null}
          </>
        )}

        <View style={styles.acoes}>
          <DuoButton testID="onb-continuar" rotulo={passo === 3 ? 'Começar' : 'Continuar'} onPress={avancar} carregando={salvando} />
          {passo > 0 ? <SecondaryButton rotulo="Voltar" onPress={() => setPasso(passo - 1)} /> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  conteudo: { flexGrow: 1, padding: space[5], gap: space[4] },
  progresso: { flexDirection: 'row', gap: space[2] },
  barra: { flex: 1, height: 6, borderRadius: radius.pill, backgroundColor: color.border },
  barraFeita: { backgroundColor: color.brand },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  escolhido: { borderColor: color.brand, backgroundColor: color.brandSoft },
  acoes: { marginTop: 'auto', gap: space[3], paddingTop: space[4] },
});
