// Chat com a IA (streaming) + first-use interview (8 questions). Answers use
// only the numbers the app calculated; client names never leave the phone.
import { Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useRef, useState, type ComponentRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Campo } from '@/components/Campo';
import { Cartao } from '@/components/Cartao';
import { DuoButton } from '@/components/DuoButton';
import { SecondaryButton } from '@/components/SecondaryButton';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { useBarbeiro } from '@/features/conta/barbeiro';
import { useEntrevista, useJornada } from '@/features/pago/api';
import { PortaPlano } from '@/features/planos/PortaPlano';
import { perguntarIA } from '@/lib/funcoes';
import { color, radius, space } from '@/theme/tokens';

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

const SUGESTOES = ['Por que meu faturamento caiu?', 'O que oferecer mais?', 'Quanto falta para a meta?'];

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

type Msg = { role: 'user' | 'assistant'; content: string };

function Chat() {
  const barbeiro = useBarbeiro();
  const jornada = useJornada();
  const [mensagens, setMensagens] = useState<Msg[]>([]);
  const [texto, setTexto] = useState('');
  const [pensando, setPensando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [pulouEntrevista, setPulou] = useState(false);
  const rolagem = useRef<ComponentRef<typeof ScrollView>>(null);
  const entrevistado = Boolean(barbeiro.data?.ia_perfil && 'resumo' in barbeiro.data.ia_perfil);

  async function enviar(pergunta: string) {
    if (!pergunta.trim() || pensando) return;
    setErro(null);
    setTexto('');
    const historico = mensagens.slice(-6);
    setMensagens((m) => [...m, { role: 'user', content: pergunta }, { role: 'assistant', content: '' }]);
    setPensando(true);
    try {
      await perguntarIA(pergunta, historico, (pedaco) =>
        setMensagens((m) => m.map((x, k) => (k === m.length - 1 ? { ...x, content: x.content + pedaco } : x))));
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não deu para perguntar agora.');
      setMensagens((m) => m.slice(0, -1));
    }
    setPensando(false);
  }

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

  return (
    <View style={styles.raiz}>
      <Stack.Screen options={{ title: 'Chat com a IA' }} />
      <ScrollView ref={rolagem} contentContainerStyle={styles.lista} onContentSizeChange={() => rolagem.current?.scrollToEnd({ animated: false })}>
        {mensagens.length === 0 ? (
          <View style={styles.inicio}>
            <SymbolView name={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }} tintColor={color.ai} size={40} />
            <Texto centro cor="textMuted">Pergunte sobre os seus números. Eu respondo com o que o app calculou.</Texto>
            {(jornada.data ?? []).slice(0, 2).map((j) => (
              <Cartao key={j.id}><Texto variante="caption" cor="ai" peso="semibold">Dica da sua jornada · {j.etapa}</Texto><Texto variante="bodySm">{j.sugestao_ia}</Texto></Cartao>
            ))}
          </View>
        ) : mensagens.map((m, k) => (
          <View key={k} style={[styles.bolha, m.role === 'user' ? styles.minha : styles.dela]} testID={m.role === 'user' ? 'msg-eu' : 'msg-ia'}>
            {m.role === 'assistant' ? <Texto variante="caption" cor="ai" peso="semibold">IA</Texto> : null}
            <Texto variante="bodySm">{m.content || '…'}</Texto>
          </View>
        ))}
        {erro ? <Texto cor="danger" peso="medium">⚠ {erro}</Texto> : null}
      </ScrollView>
      <View style={styles.rodape}>
        {mensagens.length === 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sugestoes}>
            {SUGESTOES.map((s) => <SecondaryButton key={s} rotulo={s} compacto tom="ia" onPress={() => enviar(s)} />)}
          </ScrollView>
        ) : null}
        <Campo testID="chat-pergunta" rotulo="Sua pergunta" value={texto} onChangeText={setTexto} onSubmitEditing={() => enviar(texto)} />
        <DuoButton testID="chat-enviar" rotulo="Perguntar" carregando={pensando} desativado={!texto.trim()} onPress={() => enviar(texto)} />
      </View>
    </View>
  );
}

export default function TelaChat() {
  return (
    <PortaPlano recurso="chat" titulo="Chat com a IA" descricao="Pergunte sobre os seus números e receba o próximo passo."
      previa={<Texto variante="title">Chat</Texto>}>
      <Chat />
    </PortaPlano>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: color.bg },
  lista: { padding: space[4], gap: space[3] },
  inicio: { alignItems: 'center', gap: space[3] },
  bolha: { padding: space[3], borderRadius: radius.lg, maxWidth: '88%', gap: 2 },
  minha: { alignSelf: 'flex-end', backgroundColor: color.surface, borderWidth: 1, borderColor: color.border },
  dela: { alignSelf: 'flex-start', backgroundColor: color.aiSoft },
  rodape: { padding: space[4], gap: space[2], borderTopWidth: 1, borderTopColor: color.border },
  sugestoes: { gap: space[2] },
});
