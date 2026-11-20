// Voice on the phone: speech to text by the phone's own recognizer
// (expo-speech-recognition: Android SpeechRecognizer / iOS Speech; Web Speech
// API on the web) and text to speech by the phone's voice (expo-speech).
// The audio never leaves the phone here; only the text goes to the agent.
// Daniel plans to plug a voice AI later: this is the place to swap.
import * as Speech from 'expo-speech';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { useRef, useState } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';

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

/** Speak in Brazilian Portuguese with the phone's voice. */
export function falar(texto: string, eventos: { onInicio?: () => void; onFim?: () => void }) {
  Speech.stop();
  Speech.speak(texto, {
    language: 'pt-BR', rate: 1.02,
    onStart: eventos.onInicio, onDone: eventos.onFim, onStopped: eventos.onFim, onError: eventos.onFim,
  });
}

export function pararDeFalar() {
  Speech.stop();
}
