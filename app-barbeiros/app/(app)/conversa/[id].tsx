// One conversation: messages, take over / give back to the AI, reply inside
// the 24 h window (outside it WhatsApp only allows approved templates).
import { Stack, useLocalSearchParams } from 'expo-router';
import { useRef, useState, type ComponentRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Campo } from '@/components/Campo';
import { Chip } from '@/components/Chip';
import { DuoButton } from '@/components/DuoButton';
import { Carregando, EstadoErro } from '@/components/Estado';
import { Texto } from '@/components/Texto';
import { useAssumir, useConversa, useResponder } from '@/features/premium/api';
import { formatHora } from '@/lib/format';
import { color, radius, space } from '@/theme/tokens';

const ERRO: Record<string, string> = { fora_da_janela: 'Passou de 24 h da última mensagem do cliente. Agora só com mensagem aprovada.' };

export default function TelaConversa() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversa = useConversa(id);
  const assumir = useAssumir();
  const responder = useResponder();
  const [texto, setTexto] = useState('');
  const rolagem = useRef<ComponentRef<typeof ScrollView>>(null);

  if (conversa.isPending) return <Carregando />;
  if (conversa.isError) return <EstadoErro onTentar={() => conversa.refetch()} />;
  const { conversa: c, mensagens } = conversa.data;
  const nome = c.cliente?.nome ?? c.nome_contato ?? 'Cliente';
  const abertaAte = c.janela_ate ? new Date(c.janela_ate) : null;
  const naJanela = abertaAte !== null && abertaAte.getTime() > Date.now();

  return (
    <View style={styles.raiz}>
      <Stack.Screen options={{ title: nome }} />
      <View style={styles.topo}>
        <Texto variante="bodySm" style={styles.flex} cor={c.ia_ativa ? 'ai' : 'text'}>
          {c.ia_ativa ? 'A IA está atendendo' : 'Você está atendendo'}
        </Texto>
        <Chip testID="assumir" rotulo={c.ia_ativa ? 'Assumir conversa' : 'Devolver para a IA'} selecionado={!c.ia_ativa}
          onPress={() => assumir.mutate({ id, ia_ativa: !c.ia_ativa })} />
      </View>
      <ScrollView ref={rolagem} contentContainerStyle={styles.lista} onContentSizeChange={() => rolagem.current?.scrollToEnd({ animated: false })}>
        {mensagens.map((m) => (
          <View key={m.id} style={[styles.bolha, m.direcao === 'entrada' ? styles.dele : m.autor === 'ia' ? styles.ia : styles.minha]} testID={`msg-${m.autor}`}>
            {m.direcao === 'saida' ? <Texto variante="caption" cor={m.autor === 'ia' ? 'ai' : 'textMuted'} peso="semibold">{m.autor === 'ia' ? 'IA' : m.autor === 'automacao' ? 'Automação' : 'Você'}</Texto> : null}
            <Texto variante="bodySm">{m.texto}</Texto>
            <Texto variante="tiny" cor="textMuted">{formatHora(m.criado_em)}{m.status_envio === 'simulado' ? ' · simulado' : m.status_envio === 'erro' ? ' · ⚠ não enviada' : ''}</Texto>
          </View>
        ))}
      </ScrollView>
      <View style={styles.rodape}>
        <Texto variante="caption" cor={naJanela ? 'textMuted' : 'warning'}>
          {naJanela ? `Pode responder livre até ${formatHora(abertaAte!)}` : '⚠ Janela de 24 h fechada'}
        </Texto>
        <Campo testID="resposta" rotulo="Sua resposta" value={texto} onChangeText={setTexto} editable={naJanela} />
        {responder.isError ? <Texto cor="danger">⚠ {ERRO[responder.error.message] ?? responder.error.message}</Texto> : null}
        <DuoButton testID="responder" rotulo="Enviar" carregando={responder.isPending} desativado={!texto.trim() || !naJanela}
          onPress={() => responder.mutate({ conversa_id: id, texto: texto.trim() }, { onSuccess: () => setTexto('') })} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: color.bg },
  topo: { flexDirection: 'row', alignItems: 'center', gap: space[2], padding: space[3], borderBottomWidth: 1, borderBottomColor: color.border },
  flex: { flex: 1 },
  lista: { padding: space[4], gap: space[2] },
  bolha: { padding: space[3], borderRadius: radius.lg, maxWidth: '85%', gap: 2 },
  dele: { alignSelf: 'flex-start', backgroundColor: color.surface, borderWidth: 1, borderColor: color.border },
  ia: { alignSelf: 'flex-end', backgroundColor: color.aiSoft },
  minha: { alignSelf: 'flex-end', backgroundColor: color.brandSoft },
  rodape: { padding: space[4], gap: space[2], borderTopWidth: 1, borderTopColor: color.border },
});
