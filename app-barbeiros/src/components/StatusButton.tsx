// Save button with states: Salvar → (spinner only after 200 ms, at least
// 400 ms) → "✓ Salvo" for 2 s; error "✕ motivo" with one 4 px shake.
// Fixed width (stretches), blocks double submit, announces the result.
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { vibrar } from '@/lib/haptics';
import { useMovimentoReduzido } from '@/theme/motion';
import { color, space } from '@/theme/tokens';

import { DuoButton } from './DuoButton';
import { Texto } from './Texto';

type Estado = 'parado' | 'enviando' | 'carregando' | 'sucesso' | 'erro';

type Props = {
  rotulo?: string;
  rotuloCarregando?: string;
  rotuloSucesso?: string;
  /** Throw an Error with a short Portuguese message to show it on the button. */
  acao: () => Promise<void>;
  desativado?: boolean;
  testID?: string;
  style?: ViewStyle;
};

const ATRASO_SPINNER = 200;
const MINIMO_SPINNER = 400;
const TEMPO_SUCESSO = 2000;

export function StatusButton({
  rotulo = 'Salvar',
  rotuloCarregando = 'Salvando…',
  rotuloSucesso = 'Salvo',
  acao,
  desativado = false,
  testID,
  style,
}: Props) {
  const reduzido = useMovimentoReduzido();
  const [estado, setEstado] = useState<Estado>('parado');
  const [erro, setErro] = useState('');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const x = useSharedValue(0);
  const tremor = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  async function executar() {
    if (estado === 'enviando' || estado === 'carregando') return; // no double submit
    setEstado('enviando');
    let spinnerDesde = 0;
    const t = setTimeout(() => {
      spinnerDesde = Date.now();
      setEstado('carregando');
    }, ATRASO_SPINNER);
    timers.current.push(t);
    let falha: unknown = null;
    try {
      await acao();
    } catch (e) {
      falha = e;
    }
    clearTimeout(t);
    if (spinnerDesde) {
      const falta = MINIMO_SPINNER - (Date.now() - spinnerDesde);
      if (falta > 0) await new Promise((ok) => timers.current.push(setTimeout(ok, falta)));
    }
    if (falha) {
      setErro(falha instanceof Error && falha.message ? falha.message : 'Não salvou');
      setEstado('erro');
      vibrar.aviso();
      if (!reduzido) {
        x.value = withSequence(
          withTiming(-4, { duration: 40 }),
          withTiming(4, { duration: 40 }),
          withTiming(-4, { duration: 40 }),
          withTiming(4, { duration: 40 }),
          withTiming(0, { duration: 40 }),
        );
      }
      return;
    }
    setEstado('sucesso');
    vibrar.sucesso();
    timers.current.push(setTimeout(() => setEstado('parado'), TEMPO_SUCESSO));
  }

  const ocupado = estado === 'enviando' || estado === 'carregando';
  const anuncio = estado === 'sucesso' ? rotuloSucesso : estado === 'erro' ? erro : '';

  const conteudo =
    estado === 'carregando' ? (
      <View style={styles.linha}>
        <ActivityIndicator color={color.onBrand} />
        <Texto peso="semibold" cor="onBrand">
          {rotuloCarregando}
        </Texto>
      </View>
    ) : estado === 'sucesso' ? (
      <Texto peso="semibold" cor="brandLip">
        ✓ {rotuloSucesso}
      </Texto>
    ) : estado === 'erro' ? (
      <Texto peso="semibold" cor="danger" numberOfLines={1}>
        ✕ {erro}
      </Texto>
    ) : undefined;

  return (
    <Animated.View style={[tremor, style]}>
      <DuoButton
        testID={testID}
        rotulo={ocupado ? rotuloCarregando : rotulo}
        onPress={executar}
        desativado={desativado}
        aparencia={estado === 'sucesso' ? 'sucesso' : estado === 'erro' ? 'erro' : 'normal'}
        conteudo={conteudo}
      />
      {/* Screen readers hear the result without moving focus. */}
      <Texto variante="tiny" accessibilityLiveRegion="polite" aria-live="polite" style={styles.somenteLeitor}>
        {anuncio}
      </Texto>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  somenteLeitor: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0 },
});
