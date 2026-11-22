// "Chat com a IA": the first-use interview (8 questions, it builds the profile
// the AI uses), then the same AI as "Fale com a IA" opened for typing. There is
// one AI in the app: text and voice are two ways of talking to it.
import { Redirect, Stack } from 'expo-router';
import { useState } from 'react';

import { Campo } from '@/components/Campo';
import { Cartao } from '@/components/Cartao';
import { Carregando } from '@/components/Estado';
import { DuoButton } from '@/components/DuoButton';
import { SecondaryButton } from '@/components/SecondaryButton';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { useBarbeiro } from '@/features/conta/barbeiro';
import { useEntrevista } from '@/features/pago/api';
import { PortaPlano } from '@/features/planos/PortaPlano';

const PERGUNTAS = [
  'Quanto você cobra no corte e quantos clientes atende por dia?',
  'Seu foco agora é agenda cheia ou ticket maior?',
  'Como é o atendimento, da chegada do cliente até a saída?',
  'O que muda entre a primeira visita e as seguintes?',
  'Que extras você faz e quais dá para fazer ao mesmo tempo?',
  'Que experiência você oferece (bebida, toalha quente, conversa)?',
  'Como você chama o cliente de volta depois?',
  'Como você consegue clientes novos?',
];

function Entrevista({ onFim }: { onFim: () => void }) {
  const entrevista = useEntrevista();
  const [i, setI] = useState(0);
  const [respostas, setRespostas] = useState<string[]>(Array(8).fill(''));
  const ultima = i === PERGUNTAS.length - 1;
  return (
    <Cartao testID="entrevista">
      <Texto variante="caption" cor="ai" peso="semibold">Entrevista inicial · {i + 1} de 8</Texto>
      <Texto variante="h3">{PERGUNTAS[i]}</Texto>
      <Campo testID="entrevista-resposta" rotulo="Sua resposta" value={respostas[i]} multiline
        onChangeText={(t) => setRespostas((r) => r.map((x, j) => (j === i ? t : x)))} />
      {entrevista.isError ? <Texto cor="danger">⚠ {entrevista.error.message}</Texto> : null}
      <DuoButton testID="entrevista-continuar" rotulo={ultima ? 'Terminar' : 'Continuar'} carregando={entrevista.isPending}
        desativado={!respostas[i]?.trim()}
        onPress={() => (ultima ? entrevista.mutate(respostas, { onSuccess: onFim }) : setI(i + 1))} />
      {i > 0 ? <SecondaryButton rotulo="Voltar" onPress={() => setI(i - 1)} /> : null}
    </Cartao>
  );
}

function Chat() {
  const barbeiro = useBarbeiro();
  const [pulouEntrevista, setPulou] = useState(false);
  const entrevistado = Boolean(barbeiro.data?.ia_perfil && 'resumo' in barbeiro.data.ia_perfil);

  if (barbeiro.isPending) return <TelaBase titulo="IA" semTitulo><Carregando /></TelaBase>;
  if (!entrevistado && !pulouEntrevista) {
    return (
      <TelaBase titulo="IA" semTitulo>
        <Stack.Screen options={{ title: 'Chat com a IA' }} />
        <Texto cor="textMuted">Antes, 8 perguntas rápidas para a IA entender como você trabalha.</Texto>
        <Entrevista onFim={() => barbeiro.refetch()} />
        <SecondaryButton rotulo="Pular por agora" onPress={() => setPulou(true)} />
      </TelaBase>
    );
  }
  // The same AI as "Fale com a IA", opened for typing (voice off).
  return <Redirect href={{ pathname: '/ia/voz', params: { modo: 'texto' } }} />;
}

export default function TelaChat() {
  return (
    <PortaPlano recurso="chat" titulo="Chat com a IA" descricao="Pergunte sobre os seus números e receba o próximo passo."
      previa={<Texto variante="title">Chat</Texto>}>
      <Chat />
    </PortaPlano>
  );
}
