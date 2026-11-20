// Coach de vendas: up to 4 narratives per service, acceptance of each
// ("fecha x de y", from the database), AI drafts to edit, ready messages.
import { Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import { Share, StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Campo } from '@/components/Campo';
import { Cartao } from '@/components/Cartao';
import { Chip } from '@/components/Chip';
import { Carregando, EstadoErro } from '@/components/Estado';
import { SecondaryButton } from '@/components/SecondaryButton';
import { StatusButton } from '@/components/StatusButton';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { useNarrativas, usePedirNarrativa, useSalvarNarrativa, type Narrativa } from '@/features/pago/api';
import { PortaPlano } from '@/features/planos/PortaPlano';
import { useServicos } from '@/features/servicos/api';
import { color, radius, space } from '@/theme/tokens';

type ComPlacar = Narrativa & { placar: { ofertas: number; aceitas: number } | null };

const MENSAGENS = [
  { titulo: 'Pós-venda (3 dias depois)', texto: 'Oi! Aqui é da barbearia. Ficou bom o corte? Qualquer coisa que queira ajustar, me chama.' },
  { titulo: 'Lembrete de horário', texto: 'Oi! Passando para lembrar do seu horário amanhã. Se precisar mudar, me avisa por aqui.' },
  { titulo: 'Hora de voltar', texto: 'Oi! Já faz um tempinho do último corte. Quer que eu separe um horário essa semana?' },
  { titulo: 'Sumido (sem desconto de cara)', texto: 'Oi! Sentimos sua falta por aqui. Se algo não ficou do seu jeito, me conta. Tenho horário essa semana.' },
];

function Editor({ narrativa, onFechar }: { narrativa: ComPlacar | null; onFechar: () => void }) {
  const salvar = useSalvarNarrativa();
  const [titulo, setTitulo] = useState(narrativa?.titulo ?? '');
  const [texto, setTexto] = useState(narrativa?.texto ?? '');
  const [ativa, setAtiva] = useState(narrativa?.ativa ?? true);
  return (
    <BottomSheet aberto={narrativa !== null} onFechar={onFechar} titulo={narrativa?.criada_pela_ia && !narrativa.ativa ? 'Rascunho da IA' : 'Narrativa'} testID="narrativa-sheet">
      {narrativa?.criada_pela_ia ? <Texto variante="caption" cor="ai" peso="semibold">Escrita pela IA: ajuste do seu jeito antes de usar.</Texto> : null}
      <Campo rotulo="Título" value={titulo} onChangeText={setTitulo} />
      <Campo rotulo="O que falar" value={texto} onChangeText={setTexto} multiline />
      <View style={styles.chips}>
        <Chip rotulo="Usar nas sugestões" selecionado={ativa} onPress={() => setAtiva(true)} />
        <Chip rotulo="Guardar desligada" selecionado={!ativa} onPress={() => setAtiva(false)} />
      </View>
      <StatusButton testID="narrativa-salvar" acao={async () => {
        await salvar.mutateAsync({ id: narrativa?.id, titulo: titulo.trim(), texto: texto.trim(), ativa });
        onFechar();
      }} />
    </BottomSheet>
  );
}

function Coach() {
  const servicos = useServicos();
  const narrativas = useNarrativas();
  const pedir = usePedirNarrativa();
  const [servicoId, setServicoId] = useState<string | null>(null);
  const [editando, setEditando] = useState<ComPlacar | null>(null);
  const lista = useMemo(() => (servicos.data ?? []).filter((s) => s.ativo), [servicos.data]);
  const atual = servicoId ?? lista.find((s) => s.categoria !== 'principal')?.id ?? lista[0]?.id ?? null;
  const daqui = ((narrativas.data ?? []) as ComPlacar[]).filter((n) => n.servico_id === atual);

  if (servicos.isPending || narrativas.isPending) return <Carregando />;
  if (narrativas.isError) return <EstadoErro onTentar={() => narrativas.refetch()} />;

  return (
    <TelaBase titulo="Coach" semTitulo onAtualizar={() => narrativas.refetch()}>
      <Stack.Screen options={{ title: 'Coach de vendas' }} />
      <Texto cor="textMuted">O que falar para oferecer cada serviço. O app mede o que mais fecha.</Texto>
      <View style={styles.chips}>
        {lista.map((s) => <Chip key={s.id} testID={`coach-${s.nome}`} rotulo={s.nome} selecionado={atual === s.id} onPress={() => setServicoId(s.id)} />)}
      </View>
      {daqui.length === 0 ? <Texto cor="textMuted">Nenhuma narrativa para este serviço ainda.</Texto> : daqui.map((n) => (
        <Cartao key={n.id} onPress={() => setEditando(n)} accessibilityLabel={`Editar narrativa ${n.titulo}`} testID="narrativa"
          style={!n.ativa ? styles.desligada : undefined}>
          <View style={styles.linha}>
            <Texto peso="semibold" style={styles.flex}>{n.titulo}</Texto>
            {n.placar ? (
              <Texto variante="caption" peso="semibold" cor="brandLip" numero>fecha {n.placar.aceitas} de {n.placar.ofertas}{n.placar.ofertas < 10 ? ' · poucos dados' : ''}</Texto>
            ) : <Texto variante="caption" cor="textMuted">sem ofertas ainda</Texto>}
          </View>
          <Texto variante="bodySm">"{n.texto}"</Texto>
          <Texto variante="caption" cor={n.criada_pela_ia ? 'ai' : 'textMuted'}>
            {n.ativa ? 'Em uso' : 'Desligada'}{n.criada_pela_ia ? ' · escrita pela IA' : ''}
          </Texto>
        </Cartao>
      ))}
      {atual ? (
        <SecondaryButton testID="pedir-narrativa" rotulo="Pedir uma narrativa à IA" tom="ia" carregando={pedir.isPending}
          onPress={() => pedir.mutate({ servico_id: atual }, { onSuccess: (r) => setEditando({ ...r.narrativa, placar: null }) })} />
      ) : null}
      {pedir.isError ? <Texto cor="danger" peso="medium">⚠ {pedir.error.message}</Texto> : null}

      <Texto variante="h3" accessibilityRole="header">Mensagens prontas</Texto>
      {MENSAGENS.map((m) => (
        <Cartao key={m.titulo}>
          <Texto peso="semibold">{m.titulo}</Texto>
          <Texto variante="bodySm">{m.texto}</Texto>
          <SecondaryButton compacto rotulo="Compartilhar" onPress={() => Share.share({ message: m.texto })} />
        </Cartao>
      ))}
      {editando ? <Editor key={editando.id} narrativa={editando} onFechar={() => setEditando(null)} /> : null}
    </TelaBase>
  );
}

export default function TelaCoach() {
  return (
    <PortaPlano recurso="coach" titulo="Coach de vendas" descricao="O que falar para oferecer cada serviço e qual narrativa mais fecha."
      previa={<Texto variante="title">Coach</Texto>}>
      <Coach />
    </PortaPlano>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  linha: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  flex: { flex: 1 },
  desligada: { backgroundColor: color.bg, borderStyle: 'dashed', borderRadius: radius.lg },
});
