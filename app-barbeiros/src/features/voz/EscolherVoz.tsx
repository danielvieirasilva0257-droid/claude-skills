// "Voz da IA": the phone's own voice (default) or Supertonic F2 / M1 (on the
// phone, one-time download of ~144 MB). The voice is AI-generated and says so
// (OpenRAIL-M asks for it). On the web only the phone's voice exists.
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Cartao } from '@/components/Cartao';
import { Chip } from '@/components/Chip';
import { DuoButton } from '@/components/DuoButton';
import { SecondaryButton } from '@/components/SecondaryButton';
import { Texto } from '@/components/Texto';
import { falar, pararDeFalar } from '@/features/ia/voz';
import { color, radius, space } from '@/theme/tokens';

import { escolherVoz, useVozDaIA, type VozDaIA } from './preferencia';
import { baixarVoz, disponivel, TAMANHO_MB, VOZES_SUPERTONIC, vozBaixada } from './supertonic';

export const NOME_DA_VOZ: Record<VozDaIA, string> = {
  celular: 'Voz do celular',
  F2: `Supertonic · ${VOZES_SUPERTONIC.F2}`,
  M1: `Supertonic · ${VOZES_SUPERTONIC.M1}`,
};

const EXEMPLO = 'Oi! Eu sou a voz da IA do seu app. Hoje você tem 5 clientes, e o primeiro é às 10:30.';

export function EscolherVoz({ aberto, onFechar }: { aberto: boolean; onFechar: () => void }) {
  const voz = useVozDaIA();
  const [baixada, setBaixada] = useState<boolean | null>(null);
  const [progresso, setProgresso] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [ouvindo, setOuvindo] = useState(false);
  const cancelar = useRef<AbortController | null>(null);

  useEffect(() => {
    if (aberto) void vozBaixada().then(setBaixada);
    else pararDeFalar();
  }, [aberto]);

  async function baixar() {
    setErro(null);
    setProgresso(0);
    const c = new AbortController();
    cancelar.current = c;
    try {
      await baixarVoz((p) => setProgresso(p), c.signal);
      setBaixada(true);
    } catch {
      if (!c.signal.aborted) setErro('Não deu para baixar agora. Confira a internet e tente de novo: o download continua de onde parou.');
    } finally {
      setProgresso(null);
      cancelar.current = null;
    }
  }

  function ouvir() {
    if (ouvindo) { pararDeFalar(); setOuvindo(false); return; }
    falar(EXEMPLO, { onInicio: () => setOuvindo(true), onFim: () => setOuvindo(false) });
  }

  const precisaBaixar = voz !== 'celular' && disponivel && baixada === false;

  return (
    <BottomSheet aberto={aberto} onFechar={onFechar} titulo="Voz da IA" testID="sheet-voz">
      <View style={styles.opcoes}>
        <Chip rotulo={NOME_DA_VOZ.celular} detalhe="Funciona sempre, sem baixar nada" selecionado={voz === 'celular'}
          onPress={() => escolherVoz('celular')} testID="voz-opcao-celular" />
        {(['F2', 'M1'] as const).map((v) => (
          <Chip key={v} rotulo={NOME_DA_VOZ[v]} detalhe={disponivel ? 'Mais natural, gerada no celular' : 'Só no app do celular'}
            desativado={!disponivel} selecionado={voz === v} onPress={() => escolherVoz(v)} testID={`voz-opcao-${v}`} />
        ))}
      </View>

      {precisaBaixar ? (
        <Cartao testID="voz-baixar">
          <Texto peso="semibold">Baixar a voz Supertonic ({TAMANHO_MB} MB)</Texto>
          <Texto variante="caption" cor="textMuted">
            Uma vez só, de preferência no Wi-Fi. Ela fica guardada no celular e a fala é gerada aqui mesmo, sem internet.
          </Texto>
          {progresso === null ? (
            <DuoButton rotulo="Baixar a voz" testID="voz-baixar-botao" onPress={() => void baixar()} />
          ) : (
            <View style={styles.progresso}>
              <View style={styles.trilho} accessibilityRole="progressbar"
                accessibilityValue={{ min: 0, max: 100, now: Math.round(progresso * 100) }} accessibilityLabel="Baixando a voz">
                <View style={[styles.preenchido, { width: `${Math.round(progresso * 100)}%` }]} />
              </View>
              <Texto variante="caption" numero>Baixando… {Math.round(progresso * 100)}%</Texto>
              <SecondaryButton compacto rotulo="Pausar" onPress={() => cancelar.current?.abort()} />
            </View>
          )}
        </Cartao>
      ) : null}
      {erro ? <Texto cor="warning" peso="medium" accessibilityRole="alert">⚠ {erro}</Texto> : null}

      <SecondaryButton rotulo={ouvindo ? 'Parar' : 'Ouvir a voz'} testID="voz-ouvir" onPress={ouvir} />
      <Texto variante="caption" cor="textMuted">
        {voz !== 'celular' && !baixada ? 'Até a voz baixar, a IA fala com a voz do celular. ' : ''}A voz da IA é gerada por inteligência artificial.
      </Texto>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  opcoes: { gap: space[2] },
  progresso: { gap: space[2] },
  trilho: { height: 10, borderRadius: radius.pill, backgroundColor: color.surface, borderWidth: 1, borderColor: color.border, overflow: 'hidden' },
  preenchido: { height: '100%', backgroundColor: color.brand, borderRadius: radius.pill },
});
