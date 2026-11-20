// Per-device preferences (not data): hide money values on screen.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const CHAVE = 'preferencias:v1';

type Preferencias = { ocultarValores: boolean };

export const usePreferencias = create<Preferencias>(() => ({ ocultarValores: false }));

AsyncStorage.getItem(CHAVE)
  .then((v) => {
    if (v) usePreferencias.setState(JSON.parse(v) as Preferencias);
  })
  .catch(() => undefined);

export function alternarOcultarValores() {
  const novo = { ocultarValores: !usePreferencias.getState().ocultarValores };
  usePreferencias.setState(novo);
  AsyncStorage.setItem(CHAVE, JSON.stringify(novo)).catch(() => undefined);
}
