// "IA e voz": one AI, two settings. The brain (the cloud, the default, or
// Gemma 4 on the phone: experimental, only with enough memory) and its voice (the phone's own voice
// or Supertonic F2 / M1). The voice is only how the AI speaks: it never writes
// anything itself. Downloads happen once, with progress and pause. The voice is
// AI-generated and says so (OpenRAIL-M asks for it). On the web only the cloud
// brain and the phone's voice exist.
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Cartao } from '@/components/Cartao';
import { Chip } from '@/components/Chip';
import { DuoButton } from '@/components/DuoButton';
import { SecondaryButton } from '@/components/SecondaryButton';
import { Texto } from '@/components/Texto';
import { baixarGemma, gemmaBaixado, TAMANHO_GEMMA_GB } from '@/features/ia/assistente/cerebro';
import { escolherCerebro, useCerebroDaIA, useDisponibilidadeGemma, type CerebroDaIA } from '@/features/ia/assistente/preferencia';
import { falar, pararDeFalar } from '@/features/ia/voz';
import { color, radius, space } from '@/theme/tokens';

import { escolherVoz, useVozDaIA, type VozDaIA } from './preferencia';
import { baixarVoz, disponivel, TAMANHO_MB, VOZES_SUPERTONIC, vozBaixada } from './supertonic';

export const NOME_DA_VOZ: Record<VozDaIA, string> = {
  celular: 'Voz do celular',
  F2: `Supertonic · ${VOZES_SUPERTONIC.F2}`,
  M1: `Supertonic · ${VOZES_SUPERTONIC.M1}`,
};
export const NOME_DO_CEREBRO: Record<CerebroDaIA, string> = { celular: 'Gemma 4 no celular', nuvem: 'IA na nuvem' };

const EXEMPLO = 'Oi! Eu sou a voz da IA do seu app. Hoje você tem 5 clientes, e o primeiro é às 10:30.';

/** One-time download with progress and pause (it resumes where it stopped). */
function Baixar({ titulo, texto, baixar, testID }: {
  titulo: string; texto: string; baixar: (p: (x: number) => void, s: AbortSignal) => Promise<void>; testID: string;
}) {
  const [progresso, setProgresso] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const cancelar = useRef<AbortController | null>(null);
  async function iniciar() {
    setErro(null);
    setProgresso(0);
    const c = new AbortController();
    cancelar.current = c;
    try {
      await baixar((p) => setProgresso(p), c.signal);
    } catch {
      if (!c.signal.aborted) setErro('Não deu para baixar agora. Confira a internet e tente de novo: o download continua de onde parou.');
    } finally {
      setProgresso(null);
      cancelar.current = null;
    }
  }
  return (
    <Cartao testID={testID}>
      <Texto peso="semibold">{titulo}</Texto>
      <Texto variante="caption" cor="textMuted">{texto}</Texto>
      {progresso === null ? (
        <DuoButton rotulo="Baixar" testID={`${testID}-botao`} onPress={() => void iniciar()} />
      ) : (
        <View style={styles.progresso}>
          <View style={styles.trilho} accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: 100, now: Math.round(progresso * 100) }} accessibilityLabel={titulo}>
            <View style={[styles.preenchido, { width: `${Math.round(progresso * 100)}%` }]} />
          </View>
          <Texto variante="caption" numero>Baixando… {Math.round(progresso * 100)}%</Texto>
          <SecondaryButton compacto rotulo="Pausar" onPress={() => cancelar.current?.abort()} />
        </View>
      )}
      {erro ? <Texto cor="warning" peso="medium" accessibilityRole="alert">⚠ {erro}</Texto> : null}
    </Cartao>
  );
}

export function EscolherVoz({ aberto, onFechar }: { aberto: boolean; onFechar: () => void }) {
  const voz = useVozDaIA();
  const cerebro = useCerebroDaIA();
  const gemma = useDisponibilidadeGemma();
  const gemmaOk = gemma?.ok === true;
  const [vozPronta, setVozPronta] = useState<boolean | null>(null);
  const [gemmaPronto, setGemmaPronto] = useState<boolean | null>(null);
  const [ouvindo, setOuvindo] = useState(false);

  useEffect(() => {
    if (aberto) {
      void vozBaixada().then(setVozPronta);
      void gemmaBaixado().then(setGemmaPronto);
    } else pararDeFalar();
  }, [aberto]);

  function ouvir() {
    if (ouvindo) { pararDeFalar(); setOuvindo(false); return; }
    falar(EXEMPLO, { onInicio: () => setOuvindo(true), onFim: () => setOuvindo(false) });
  }

  return (
    <BottomSheet aberto={aberto} onFechar={onFechar} titulo="IA e voz" testID="sheet-voz">
      <Texto variante="caption" cor="textMuted">Uma IA só: ela pensa, escreve e fala. A voz é só o jeito de ela falar.</Texto>

      <Texto peso="semibold" accessibilityRole="header">Onde a IA pensa</Texto>
      <View style={styles.opcoes}>
        <Chip rotulo={NOME_DO_CEREBRO.nuvem} detalhe="Recomendada · precisa de internet" selecionado={cerebro === 'nuvem' || !gemmaOk}
          onPress={() => escolherCerebro('nuvem')} testID="cerebro-opcao-nuvem" />
        <Chip rotulo={NOME_DO_CEREBRO.celular} detalhe={gemma?.motivo ?? 'Conferindo o celular…'}
          desativado={!gemmaOk} selecionado={cerebro === 'celular' && gemmaOk}
          onPress={() => escolherCerebro('celular')} testID="cerebro-opcao-celular" />
      </View>
      {cerebro === 'celular' && gemmaOk && gemmaPronto === false ? (
        <Baixar testID="cerebro-baixar" titulo={`Baixar o Gemma 4 (${TAMANHO_GEMMA_GB.toLocaleString('pt-BR')} GB)`}
          texto="Uma vez só, no Wi-Fi. Até terminar, a IA da nuvem responde. Se o celular travar, o app volta sozinho para a nuvem."
          baixar={async (p, s) => { await baixarGemma(p, s); setGemmaPronto(true); }} />
      ) : null}

      <Texto peso="semibold" accessibilityRole="header">Voz da IA</Texto>
      <View style={styles.opcoes}>
        <Chip rotulo={NOME_DA_VOZ.celular} detalhe="Funciona sempre, sem baixar nada" selecionado={voz === 'celular'}
          onPress={() => escolherVoz('celular')} testID="voz-opcao-celular" />
        {(['F2', 'M1'] as const).map((v) => (
          <Chip key={v} rotulo={NOME_DA_VOZ[v]} detalhe={disponivel ? 'Mais natural, gerada no celular' : 'Só no app do celular'}
            desativado={!disponivel} selecionado={voz === v} onPress={() => escolherVoz(v)} testID={`voz-opcao-${v}`} />
        ))}
      </View>
      {voz !== 'celular' && disponivel && vozPronta === false ? (
        <Baixar testID="voz-baixar" titulo={`Baixar a voz Supertonic (${TAMANHO_MB} MB)`}
          texto="Uma vez só, de preferência no Wi-Fi. Ela fica guardada no celular e a fala é gerada aqui mesmo, sem internet."
          baixar={async (p, s) => { await baixarVoz(p, s); setVozPronta(true); }} />
      ) : null}

      <SecondaryButton rotulo={ouvindo ? 'Parar' : 'Ouvir a voz'} testID="voz-ouvir" onPress={ouvir} />
      <Texto variante="caption" cor="textMuted">
        {voz !== 'celular' && !vozPronta ? 'Até a voz baixar, a IA fala com a voz do celular. ' : ''}A voz da IA é gerada por inteligência artificial.
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
