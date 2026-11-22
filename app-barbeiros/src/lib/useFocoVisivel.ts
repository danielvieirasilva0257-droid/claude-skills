// Focus ring only for keyboard focus (":focus-visible" on the web). A tap or
// a mouse click focuses the element too, but must not draw the ring.
import { useState } from 'react';
import { Platform } from 'react-native';

type EventoFoco = { target?: unknown; nativeEvent?: { target?: unknown } };

function focoVisivel(e: EventoFoco): boolean {
  const alvo = (e.target ?? e.nativeEvent?.target) as { matches?: (s: string) => boolean } | undefined;
  try {
    return Boolean(alvo?.matches?.(':focus-visible'));
  } catch {
    return true; // very old browsers: show the ring rather than hide it
  }
}

export function useFocoVisivel() {
  const [foco, setFoco] = useState(false);
  return {
    foco,
    onFocus: (e: EventoFoco) => setFoco(Platform.OS === 'web' ? focoVisivel(e) : true),
    onBlur: () => setFoco(false),
  };
}
