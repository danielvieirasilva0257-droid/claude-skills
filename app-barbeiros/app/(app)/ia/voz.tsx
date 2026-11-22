// "Fale com a IA" (final name by Daniel): one AI for voice and text. The
// brain is the cloud model (or Gemma 4 on the phone, experimental): it writes the answer token by token, the text shows up here as it is
// written and the voice (a tool, never a second AI) speaks each sentence as
// soon as it is complete. The AI reads and changes the app through the same
// tools; every change shows up as a card to confirm (button or saying "sim").
// Typing works too: ?modo=texto opens with the keyboard and the voice off.
// Hands-free conversation (Daniel, 22/11/2026): one tap on the microphone and
// the talk goes on by itself. When the AI finishes speaking the microphone
// opens again; tapping while she speaks interrupts her and listens; silence or
// "Encerrar" ends it.
import { useQueryClient } from '@tanstack/react-query';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Aurora } from '@/components/Aurora';
import { Campo } from '@/components/Campo';
import { Cartao } from '@/components/Cartao';
import { DuoButton } from '@/components/DuoButton';
import { SecondaryButton } from '@/components/SecondaryButton';
import { Texto } from '@/components/Texto';
import { confirmarAcao, falarComAgenteStream, respostaDeConfirmacao, type Pendente, type Turno } from '@/features/ia/agente';
import { disponibilidadeGemma, gemmaBaixado, pararGemma, responderComGemma } from '@/features/ia/assistente/cerebro';
import { falaDeEspera } from '@/features/ia/assistente/espera';
import { criarDivisorDeFrases } from '@/features/ia/assistente/frases';
import { cerebroDaIA, useCerebroDaIA, useDisponibilidadeGemma } from '@/features/ia/assistente/preferencia';
import { NOME_IA } from '@/features/ia/FaleComIA';
import { OrbeIA, type EstadoOrbe } from '@/features/ia/OrbeIA';
import { criarFala, falar, pararDeFalar, reconhecimentoDisponivel, useOuvir } from '@/features/ia/voz';
import { PortaPlano } from '@/features/planos/PortaPlano';
import { EscolherVoz, NOME_DA_VOZ, NOME_DO_CEREBRO } from '@/features/voz/EscolherVoz';
import { useVozDaIA } from '@/features/voz/preferencia';
import { vibrar } from '@/lib/haptics';
import { color, radius, space } from '@/theme/tokens';

const ROTULO: Record<EstadoOrbe, string> = { parado: 'Toque no microfone e converse', ouvindo: 'Pode falar…', pensando: 'Pensando…', falando: 'Falando…' };

function ConversaPorVoz() {
  const qc = useQueryClient();
  const { modo } = useLocalSearchParams<{ modo?: string }>();
  const modoTexto = modo === 'texto';
  const [estado, setEstado] = useState<EstadoOrbe>('parado');
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [pendente, setPendente] = useState<Pendente | null>(null);
  const [digitando, setDigitando] = useState(modoTexto || !reconhecimentoDisponivel());
  const [texto, setTexto] = useState('');
  const [som, setSom] = useState(!modoTexto);
  const [erro, setErro] = useState<string | null>(null);
  const [vozAberta, setVozAberta] = useState(false);
  // What the AI is doing while the answer has no words yet ("Vou olhar sua agenda.").
  const [fazendo, setFazendo] = useState<string | null>(null);
  const voz = useVozDaIA();
  const cerebroEscolhido = useCerebroDaIA();
  const gemma = useDisponibilidadeGemma();
  const cerebro = gemma?.ok ? cerebroEscolhido : 'nuvem';
  const semNivel = useSharedValue(0);
  const rolagem = useRef<ComponentRef<typeof ScrollView>>(null);
  // Hands-free conversation: on after the first tap on the microphone, off on silence or "Encerrar".
  const [conversando, setConversando] = useState(false);
  const conversa = useRef(false);
  const ouviuAlgo = useRef(false);
  const ouvir = useOuvir((frase) => { ouviuAlgo.current = true; void enviar(frase); });
  const nivel = estado === 'ouvindo' ? ouvir.nivel : semNivel;

  function encerrarConversa() {
    conversa.current = false;
    setConversando(false);
  }

  function escutar() {
    ouviuAlgo.current = false;
    setEstado('ouvindo');
    ouvir.iniciar().catch(() => { setEstado('parado'); encerrarConversa(); });
  }

  /** After the AI's turn: in a hands-free conversation the microphone opens again by itself. */
  function proximaVez() {
    setEstado('parado');
    // A short pause so the microphone does not catch the end of her voice.
    if (conversa.current) setTimeout(() => { if (conversa.current) escutar(); }, 350);
  }

  // Listening ended with nothing said (or an error): the hands-free conversation ends.
  const ouvia = useRef(false);
  useEffect(() => {
    if (ouvia.current && !ouvir.ouvindo && !ouviuAlgo.current && conversa.current) {
      encerrarConversa();
      setEstado('parado');
    }
    ouvia.current = ouvir.ouvindo;
  }, [ouvir.ouvindo]);
  useEffect(() => { if (ouvir.erro) encerrarConversa(); }, [ouvir.erro]);
  // Leaving the screen ends everything (no microphone or voice in the background).
  useEffect(() => () => { conversa.current = false; ouvir.parar(); pararDeFalar(); pararGemma(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function responder(fala: string) {
    setTurnos((t) => [...t, { role: 'assistant', content: fala }]);
    if (!som) { proximaVez(); return; }
    falar(fala, { onInicio: () => setEstado('falando'), onFim: proximaVez });
  }

  async function aplicar(r: { texto: string; pendente?: Pendente; navegar?: string; atualizar?: string[] }) {
    if (r.atualizar?.length) await Promise.all(r.atualizar.map((k) => qc.invalidateQueries({ queryKey: [k] })));
    setPendente(r.pendente ?? null);
    if (r.navegar) encerrarConversa();
    responder(r.texto);
    if (r.navegar) router.navigate(r.navegar as never);
  }

  async function confirmar(p: Pendente) {
    setErro(null);
    setPendente(null);
    setEstado('pensando');
    try {
      vibrar.sucesso();
      await aplicar(await confirmarAcao(p));
    } catch (e) {
      setEstado('parado');
      encerrarConversa();
      setErro(e instanceof Error ? e.message : 'Não deu certo.');
    }
  }

  function cancelar() {
    setPendente(null);
    responder('Tudo bem, não mudei nada.');
  }

  async function enviar(frase: string) {
    const limpo = frase.trim();
    if (limpo.length < 2) return;
    setErro(null);
    setTexto('');
    // A change is waiting: "sim" confirms, "não" cancels.
    if (pendente) {
      const r = respostaDeConfirmacao(limpo);
      if (r === 'sim') { setTurnos((t) => [...t, { role: 'user', content: limpo }]); return confirmar(pendente); }
      if (r === 'nao') { setTurnos((t) => [...t, { role: 'user', content: limpo }]); return cancelar(); }
    }
    const historico = turnos;
    setTurnos((t) => [...t, { role: 'user', content: limpo }]);
    setEstado('pensando');
    // The brain on the phone: the text streams in and the voice speaks each sentence meanwhile.
    if (cerebroDaIA() === 'celular' && (await disponibilidadeGemma()).ok && (await gemmaBaixado())) {
      const fala = som ? criarFala({ onInicio: () => setEstado('falando'), onFim: proximaVez }) : null;
      setTurnos((t) => [...t, { role: 'assistant', content: '' }]);
      const escrever = (conteudo: string) => setTurnos((t) => t.map((x, k) => (k === t.length - 1 ? { ...x, content: conteudo } : x)));
      try {
        const r = await responderComGemma(limpo, { onTexto: escrever, onFrase: (f) => fala?.frase(f) });
        if (r.cancelado) { fala?.parar(); setEstado('parado'); return; }
        escrever(r.texto);
        if (r.navegar) encerrarConversa();
        fala?.terminar();
        if (!fala) proximaVez();
        setPendente(r.pendente ?? null);
        if (r.navegar) router.navigate(r.navegar as never);
        return;
      } catch {
        // Gemma could not answer: the cloud AI answers this turn (same tools, same rules).
        fala?.parar();
        setTurnos((t) => (t[t.length - 1]?.role === 'assistant' && !t[t.length - 1]?.content ? t.slice(0, -1) : t));
      }
    }
    // The cloud brain, streaming: the text shows up as it is written and the voice speaks each
    // sentence as soon as it is complete. While it looks something up, it says what it is doing.
    const fala = som ? criarFala({ onInicio: () => setEstado('falando'), onFim: proximaVez }) : null;
    const divisor = criarDivisorDeFrases((f) => fala?.frase(f));
    let escrito = '';
    let avisou = false;
    setTurnos((t) => [...t, { role: 'assistant', content: '' }]);
    const escrever = (conteudo: string) => setTurnos((t) => t.map((x, k) => (k === t.length - 1 ? { ...x, content: conteudo } : x)));
    try {
      const r = await falarComAgenteStream(limpo, historico, {
        onTexto: (pedaco) => {
          escrito += pedaco;
          setFazendo(null);
          escrever(escrito);
          divisor.empurrar(pedaco);
        },
        onFerramenta: (nome) => {
          if (escrito.trim() || avisou) return;
          const aviso = falaDeEspera(nome);
          if (!aviso) return;
          avisou = true;
          setFazendo(aviso);
          fala?.frase(aviso);
        },
      });
      setFazendo(null);
      divisor.terminar();
      // Nothing streamed (demo or a short answer): speak the whole answer now.
      if (!escrito.trim()) fala?.frase(r.texto);
      escrever(r.texto);
      if (r.navegar) encerrarConversa();
      fala?.terminar();
      if (!fala) proximaVez();
      if (r.atualizar?.length) await Promise.all(r.atualizar.map((k) => qc.invalidateQueries({ queryKey: [k] })));
      setPendente(r.pendente ?? null);
      if (r.navegar) router.navigate(r.navegar as never);
    } catch (e) {
      setFazendo(null);
      fala?.parar();
      setEstado('parado');
      encerrarConversa();
      setTurnos((t) => (t[t.length - 1]?.role === 'assistant' && !t[t.length - 1]?.content ? t.slice(0, -1) : t));
      setErro(e instanceof Error ? e.message : 'A IA não respondeu agora.');
    }
  }

  function tocarMicrofone() {
    vibrar.leve();
    // While she speaks: interrupt her and listen (the conversation goes on).
    if (estado === 'falando') { pararDeFalar(); pararGemma(); escutar(); return; }
    // While listening: stop and end the hands-free conversation.
    if (ouvir.ouvindo) { encerrarConversa(); ouvir.parar(); return; }
    conversa.current = true;
    setConversando(true);
    escutar();
  }

  const status = ouvir.ouvindo ? 'ouvindo' : estado === 'ouvindo' ? 'parado' : estado;

  return (
    <SafeAreaView style={styles.raiz} edges={['bottom']}>
      <Stack.Screen options={{ title: NOME_IA }} />
      <Aurora />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.palco}>
          <OrbeIA estado={status} nivel={nivel} />
          <Texto peso="semibold" centro accessibilityLiveRegion="polite" testID="voz-estado">{ROTULO[status]}</Texto>
          {conversando ? (
            <View style={styles.conversaAtiva}>
              <Texto variante="caption" cor="textMuted">Conversa contínua · toque no microfone para interromper</Texto>
              <SecondaryButton compacto rotulo="Encerrar" testID="voz-encerrar"
                onPress={() => { encerrarConversa(); ouvir.parar(); pararDeFalar(); pararGemma(); setEstado('parado'); }} />
            </View>
          ) : null}
          {ouvir.ouvindo && ouvir.parcial ? <Texto centro cor="textMuted" numberOfLines={2}>{ouvir.parcial}</Texto> : (
            <Pressable onPress={() => setVozAberta(true)} accessibilityRole="button"
              accessibilityLabel={`IA e voz: ${NOME_DO_CEREBRO[cerebro]}, ${NOME_DA_VOZ[voz]}. Trocar`}
              style={styles.trocarVoz} testID="voz-escolher" hitSlop={4}>
              <Texto variante="caption" cor="textMuted">{NOME_DO_CEREBRO[cerebro]} · {voz === 'celular' ? 'voz do celular' : NOME_DA_VOZ[voz]} ›</Texto>
            </Pressable>
          )}
        </View>
        <EscolherVoz aberto={vozAberta} onFechar={() => setVozAberta(false)} />

        <ScrollView ref={rolagem} style={styles.conversa} contentContainerStyle={styles.conversaConteudo}
          onContentSizeChange={() => rolagem.current?.scrollToEnd({ animated: false })}>
          {turnos.length === 0 ? (
            <Texto variante="bodySm" cor="textMuted" centro>
              Experimente: "quanto eu faturei hoje?", "marca o Bruno amanhã às 10 pra corte", "anota no Rafael que prefere degradê baixo", "abre o financeiro".
            </Texto>
          ) : turnos.slice(-6).map((t, k) => (
            <View key={k} style={[styles.bolha, t.role === 'user' ? styles.minha : styles.dela]} testID={t.role === 'user' ? 'voz-eu' : 'voz-ia'}>
              {t.role === 'assistant' && !t.content
                ? <Texto variante="bodySm" cor="textMuted" testID="voz-fazendo">{fazendo ?? 'Pensando…'}</Texto>
                : <Texto variante="bodySm" cor={t.role === 'user' ? 'onLight' : 'text'}>{t.content}</Texto>}
            </View>
          ))}
          {pendente ? (
            <Cartao tom="ia" testID="voz-pendente">
              <Texto variante="caption" cor="ai" peso="semibold">Confirma esta mudança?</Texto>
              <Texto peso="medium">{pendente.resumo}</Texto>
              <View style={styles.linha}>
                <SecondaryButton compacto rotulo="Cancelar" testID="voz-cancelar" onPress={cancelar} style={styles.flex} />
                <DuoButton rotulo="Confirmar" testID="voz-confirmar" onPress={() => void confirmar(pendente)} style={styles.flex} />
              </View>
              <Texto variante="caption" cor="textMuted">Ou diga "sim" ou "não".</Texto>
            </Cartao>
          ) : null}
          {erro || ouvir.erro ? <Texto cor="warning" peso="medium" accessibilityRole="alert">⚠ {erro ?? ouvir.erro}</Texto> : null}
        </ScrollView>

        {digitando ? (
          <View style={styles.digitar}>
            <View style={styles.flex}>
              <Campo rotulo="Escreva para a IA" testID="voz-texto" value={texto} onChangeText={setTexto} onSubmitEditing={() => void enviar(texto)}
                returnKeyType="send" placeholder="Ex.: marca o Bruno amanhã às 10" />
            </View>
            <DuoButton rotulo="Enviar" testID="voz-enviar" desativado={texto.trim().length < 2 || estado === 'pensando'} onPress={() => void enviar(texto)} />
          </View>
        ) : null}

        <View style={styles.controles}>
          <Pressable onPress={() => { if (!digitando) { encerrarConversa(); ouvir.parar(); } setDigitando((d) => !d); }} accessibilityRole="button" accessibilityLabel={digitando ? 'Esconder o teclado' : 'Escrever em vez de falar'}
            style={styles.redondo} testID="voz-teclado">
            <SymbolView name={{ ios: 'keyboard', android: 'keyboard', web: 'keyboard' }} tintColor={color.text} size={22} />
          </Pressable>
          <Pressable onPress={tocarMicrofone} disabled={estado === 'pensando' || !reconhecimentoDisponivel()} testID="voz-microfone"
            accessibilityRole="button" accessibilityLabel={ouvir.ouvindo ? 'Parar de ouvir e encerrar a conversa' : estado === 'falando' ? 'Interromper e falar' : 'Começar a conversa por voz'}
            style={({ pressed }) => [styles.microfone, ouvir.ouvindo ? styles.microfoneAtivo : null, pressed ? styles.pressionado : null,
              !reconhecimentoDisponivel() ? styles.desativado : null]}>
            <SymbolView name={ouvir.ouvindo || estado === 'falando' ? { ios: 'stop.fill', android: 'stop', web: 'stop' } : { ios: 'mic.fill', android: 'mic', web: 'mic' }}
              tintColor={color.onLight} size={32} />
          </Pressable>
          <Pressable onPress={() => { if (som) pararDeFalar(); setSom((v) => !v); }} accessibilityRole="switch" aria-checked={som}
            accessibilityLabel="Resposta em voz" style={styles.redondo} testID="voz-som">
            <SymbolView name={som ? { ios: 'speaker.wave.2.fill', android: 'volume_up', web: 'volume_up' } : { ios: 'speaker.slash.fill', android: 'volume_off', web: 'volume_off' }}
              tintColor={som ? color.text : color.textMuted} size={22} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default function TelaVoz() {
  return (
    <PortaPlano recurso="chat" titulo={NOME_IA} descricao="Fale com a IA: ela responde em voz, consulta seus números e mexe no app para você."
      previa={<Texto variante="title">{NOME_IA}</Texto>}>
      <ConversaPorVoz />
    </PortaPlano>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: color.bg },
  flex: { flex: 1 },
  palco: { alignItems: 'center', gap: space[2], paddingTop: space[4] },
  trocarVoz: { minHeight: 44, justifyContent: 'center', paddingHorizontal: space[3] },
  conversaAtiva: { alignItems: 'center', gap: space[1] },
  conversa: { flex: 1 },
  conversaConteudo: { padding: space[4], gap: space[2] },
  bolha: { maxWidth: '85%', paddingHorizontal: space[3], paddingVertical: space[2], borderRadius: radius.lg },
  minha: { alignSelf: 'flex-end', backgroundColor: color.text },
  dela: { alignSelf: 'flex-start', backgroundColor: color.aiSoft, borderWidth: 1, borderColor: color.border },
  linha: { flexDirection: 'row', gap: space[2] },
  digitar: { flexDirection: 'row', alignItems: 'flex-end', gap: space[2], paddingHorizontal: space[4] },
  controles: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space[6], paddingVertical: space[4] },
  redondo: { width: 52, height: 52, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: color.surface, borderWidth: 1, borderColor: color.border },
  microfone: { width: 80, height: 80, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: color.ai },
  microfoneAtivo: { backgroundColor: color.text },
  pressionado: { opacity: 0.85 },
  desativado: { opacity: 0.4 },
});
