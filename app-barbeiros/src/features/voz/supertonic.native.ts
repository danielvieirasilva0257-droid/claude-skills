// Supertonic 3 voice on the phone (Android/iOS), via react-native-executorch
// (XNNPACK int8, ~144 MB, downloaded once from Hugging Face and cached; the
// audio never leaves the phone). Daniel chose the voices F2 and M1 (21/11).
// Model license: OpenRAIL-M (commercial use allowed; the app says the voice
// is AI and the Terms pass the use restrictions on to the users).
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { File, Paths } from 'expo-file-system';
import { createSupertonicTextToSpeech, download, models, setTelemetryEnabled, type SupertonicTextToSpeech } from 'react-native-executorch';

import { textoParaFala } from './textoFala';
import { wavPcm16 } from './wav';

export type VozSupertonic = 'F2' | 'M1';
export const VOZES_SUPERTONIC: Record<VozSupertonic, string> = { F2: 'Feminina (F2)', M1: 'Masculina (M1)' };
export const TAMANHO_MB = 144;
export const disponivel = true;

// No anonymous download events to the library's servers.
setTelemetryEnabled(false);

const BASE = models.textToSpeech.SUPERTONIC.XNNPACK_INT8;
// Only the two chosen voices are downloaded.
const CONFIG = { ...BASE, voiceStyles: { F2: BASE.voiceStyles.F2, M1: BASE.voiceStyles.M1 } };
type Config = typeof CONFIG;
const CHAVE_LOCAL = 'supertonic3-local-v1';

let local: Config | null = null;
let motor: Promise<SupertonicTextToSpeech<VozSupertonic>> | null = null;

/** The files are on the phone (the local paths are remembered after the first download). */
export async function vozBaixada(): Promise<boolean> {
  if (local) return true;
  try {
    const salvo = await AsyncStorage.getItem(CHAVE_LOCAL);
    if (salvo) local = JSON.parse(salvo) as Config;
  } catch {
    local = null;
  }
  return local !== null;
}

/** Downloads the model once (resumes if interrupted). onProgresso receives 0 to 1. */
export async function baixarVoz(onProgresso: (p: number) => void, sinal?: AbortSignal): Promise<void> {
  local = await download(CONFIG, { onProgress: onProgresso, signal: sinal });
  await AsyncStorage.setItem(CHAVE_LOCAL, JSON.stringify(local));
}

function carregar() {
  if (!motor) {
    if (!local) throw new Error('A voz ainda não foi baixada.');
    motor = createSupertonicTextToSpeech(local).catch(async (e) => {
      // A broken or missing file: forget it so the next tap downloads again.
      motor = null;
      local = null;
      await AsyncStorage.removeItem(CHAVE_LOCAL);
      throw e;
    });
  }
  return motor;
}

// ---------- Playback: one WAV per text chunk, played in order ----------
let geracao = 0;
let tocando: AudioPlayer | null = null;

function tocar(arquivo: File, eu: number): Promise<void> {
  return new Promise((resolve) => {
    if (eu !== geracao) return resolve();
    const player = createAudioPlayer({ uri: arquivo.uri });
    tocando = player;
    const fim = () => {
      sub.remove();
      player.remove();
      if (tocando === player) tocando = null;
      try { arquivo.delete(); } catch { /* cache */ }
      resolve();
    };
    const sub = player.addListener('playbackStatusUpdate', (s) => { if (s.didJustFinish) fim(); });
    player.play();
  });
}

export type FilaDeFala = { frase: (texto: string) => void; terminar: () => void; parar: () => void };

/**
 * Speaks sentence by sentence as they arrive (the AI is still writing): each
 * sentence is generated after the previous one, and each generated chunk is
 * played in order while the next one is generated. onErro gets a sentence the
 * voice could not generate (the caller speaks it with the phone's voice).
 */
export function criarFilaSupertonic(
  voz: VozSupertonic,
  eventos: { onInicio?: () => void; onFim?: () => void; onErro?: (frase: string) => void },
): FilaDeFala {
  pararSupertonic();
  const eu = ++geracao;
  let comecou = false;
  let encerrada = false;
  let n = 0;
  let sintese: Promise<void> = setAudioModeAsync({ playsInSilentMode: true }).catch(() => undefined);
  let toque: Promise<void> = Promise.resolve();
  const frase = (texto: string) => {
    sintese = sintese.then(async () => {
      if (eu !== geracao) return;
      try {
        const tts = await carregar();
        for await (const pedaco of tts.synthesize(textoParaFala(texto), { voiceStyle: voz, lang: 'pt', speed: 1.05 })) {
          if (eu !== geracao) break;
          const arquivo = new File(Paths.cache, `voz-${eu}-${n++}.wav`);
          arquivo.create({ overwrite: true });
          arquivo.writeSync(wavPcm16(pedaco.audio, pedaco.sampleRate));
          if (!comecou) { comecou = true; eventos.onInicio?.(); }
          toque = toque.then(() => tocar(arquivo, eu));
        }
      } catch {
        if (eu === geracao) eventos.onErro?.(texto);
      }
    });
  };
  const terminar = () => {
    if (encerrada) return;
    encerrada = true;
    void sintese.then(() => toque).then(() => { if (eu === geracao) eventos.onFim?.(); });
  };
  return { frase, terminar, parar: pararSupertonic };
}

/** Speaks a whole text with the Supertonic voice (the same queue, one text). */
export async function falarSupertonic(texto: string, voz: VozSupertonic, eventos: { onInicio?: () => void; onFim?: () => void }) {
  await new Promise<void>((resolve, reject) => {
    let falhou = false;
    const fila = criarFilaSupertonic(voz, {
      onInicio: eventos.onInicio,
      onFim: () => { eventos.onFim?.(); if (falhou) reject(new Error('voz')); else resolve(); },
      onErro: () => { falhou = true; },
    });
    fila.frase(texto);
    fila.terminar();
  });
}

export function pararSupertonic() {
  geracao++;
  tocando?.pause();
  tocando?.remove();
  tocando = null;
  motor?.then((t) => t.synthesizeStop()).catch(() => undefined);
}
