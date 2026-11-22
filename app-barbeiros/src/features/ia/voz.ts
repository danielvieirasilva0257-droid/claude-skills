// Voice on the phone: speech to text by the phone's own recognizer
// (expo-speech-recognition: Android SpeechRecognizer / iOS Speech; Web Speech
// API on the web) and text to speech by the Supertonic voice (F2 or M1, on the
// phone, chosen by Daniel on 21/11) or the phone's own voice (expo-speech, the
// default and the fallback). The audio never leaves the phone; only the text
// goes to the agent.
import * as Speech from 'expo-speech';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { useRef, useState } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';

import { vozDaIA } from '@/features/voz/preferencia';
import { criarFilaSupertonic, pararSupertonic, vozBaixada, type FilaDeFala } from '@/features/voz/supertonic';

export function reconhecimentoDisponivel(): boolean {
  try {
    return ExpoSpeechRecognitionModule.isRecognitionAvailable();
  } catch {
    return false;
  }
}

const ERROS: Record<string, string> = {
  'not-allowed': 'Permita o uso do microfone para falar com a IA.',
  'no-speech': 'Não ouvi nada. Toque e fale de novo.',
  'speech-timeout': 'Não ouvi nada. Toque e fale de novo.',
  network: 'O reconhecimento de voz precisa de internet neste celular.',
  'language-not-supported': 'O reconhecimento de voz em português não está disponível neste celular.',
  'service-not-allowed': 'O reconhecimento de voz não está disponível neste celular. Você pode digitar.',
};

/** Listen once: partial text while talking, onFinal with the whole phrase. */
export function useOuvir(onFinal: (texto: string) => void) {
  const [ouvindo, setOuvindo] = useState(false);
  const [parcial, setParcial] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const nivel = useSharedValue(0);
  const enviado = useRef(false);
  const ultimo = useRef('');

  useSpeechRecognitionEvent('start', () => { setOuvindo(true); setErro(null); enviado.current = false; ultimo.current = ''; });
  useSpeechRecognitionEvent('volumechange', (e) => { nivel.value = withTiming(Math.max(0, Math.min(1, (e.value + 2) / 12)), { duration: 90 }); });
  useSpeechRecognitionEvent('result', (e) => {
    const texto = e.results[0]?.transcript ?? '';
    ultimo.current = texto;
    setParcial(texto);
    if (e.isFinal && texto.trim() && !enviado.current) {
      enviado.current = true;
      onFinal(texto.trim());
    }
  });
  useSpeechRecognitionEvent('end', () => {
    setOuvindo(false);
    nivel.value = withTiming(0, { duration: 200 });
    if (!enviado.current && ultimo.current.trim()) {
      enviado.current = true;
      onFinal(ultimo.current.trim());
    }
  });
  useSpeechRecognitionEvent('error', (e) => { setOuvindo(false); setErro(ERROS[e.error] ?? 'Não deu para ouvir agora. Tente de novo.'); });

  async function iniciar() {
    setParcial('');
    setErro(null);
    const permissao = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!permissao.granted) {
      setErro(ERROS['not-allowed']!);
      return;
    }
    ExpoSpeechRecognitionModule.start({
      lang: 'pt-BR', interimResults: true, continuous: false, addsPunctuation: true,
      volumeChangeEventOptions: { enabled: true, intervalMillis: 100 },
    });
  }

  function parar() {
    ExpoSpeechRecognitionModule.stop();
  }

  return { ouvindo, parcial, erro, nivel, iniciar, parar };
}

type Eventos = { onInicio?: () => void; onFim?: () => void };
let vez = 0;

export type Fala = { frase: (texto: string) => void; terminar: () => void; parar: () => void };

/**
 * The AI's voice, a tool of the one AI (it never writes anything itself):
 * receives each sentence while the AI is still writing and speaks them in
 * order. Supertonic when it is chosen and downloaded; the phone's voice when
 * it is not, or for a sentence Supertonic could not generate.
 */
export function criarFala(eventos: Eventos): Fala {
  pararDeFalar();
  const eu = ++vez;
  const voz = vozDaIA();
  let comecou = false;
  let terminou = false;
  let decidido = false;
  let supertonicAcabou = true;
  let noCelular = 0;
  let fila: FilaDeFala | null = null;
  const espera: string[] = [];
  const inicio = () => { if (!comecou && eu === vez) { comecou = true; eventos.onInicio?.(); } };
  const talvezFim = () => { if (terminou && decidido && supertonicAcabou && noCelular === 0 && eu === vez) { vez++; eventos.onFim?.(); } };
  const pelaVozDoCelular = (t: string) => {
    noCelular++;
    const pronto = () => { noCelular = Math.max(0, noCelular - 1); talvezFim(); };
    Speech.speak(t, { language: 'pt-BR', rate: 1.02, onStart: inicio, onDone: pronto, onError: pronto, onStopped: pronto });
  };
  const enviar = (t: string) => (fila ? fila.frase(t) : pelaVozDoCelular(t));
  void (async () => {
    let baixada = false;
    if (voz !== 'celular') baixada = await vozBaixada().catch(() => false);
    if (eu !== vez) return;
    if (voz !== 'celular' && baixada) {
      supertonicAcabou = false;
      fila = criarFilaSupertonic(voz, {
        onInicio: inicio,
        onFim: () => { supertonicAcabou = true; talvezFim(); },
        onErro: (t) => pelaVozDoCelular(t),
      });
    }
    decidido = true;
    espera.splice(0).forEach(enviar);
    if (terminou) fila?.terminar();
    talvezFim();
  })();
  return {
    frase: (t) => { if (eu !== vez || !t.trim()) return; if (decidido) enviar(t); else espera.push(t); },
    terminar: () => { if (terminou) return; terminou = true; if (decidido) fila?.terminar(); talvezFim(); },
    parar: () => pararDeFalar(),
  };
}

/** Speak a whole answer (the cloud AI answers at once): the same voice tool. */
export function falar(texto: string, eventos: Eventos) {
  const fala = criarFala(eventos);
  fala.frase(texto);
  fala.terminar();
}

export function pararDeFalar() {
  vez++;
  Speech.stop();
  pararSupertonic();
}
