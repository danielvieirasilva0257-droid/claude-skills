import type { ReactNode } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { color, space } from '@/theme/tokens';

import { Texto } from './Texto';

type Props = {
  titulo: string;
  subtitulo?: string;
  /** Small action at the right of the title (e.g. the eye). */
  direita?: ReactNode;
  /** Fixed at the bottom right, within thumb reach (e.g. "+ Atendimento"). */
  flutuante?: ReactNode;
  onAtualizar?: () => void;
  atualizando?: boolean;
  /** Stack screens already have a header with the title. */
  semTitulo?: boolean;
  children?: ReactNode;
};

/** Screen shell: safe area, white background, title, pull to refresh. */
export function TelaBase({ titulo, subtitulo, direita, flutuante, onAtualizar, atualizando = false, semTitulo = false, children }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={semTitulo ? [] : ['top']}>
      <ScrollView
        contentContainerStyle={[styles.conteudo, flutuante ? styles.espacoFlutuante : null]}
        keyboardShouldPersistTaps="handled"
        refreshControl={onAtualizar ? <RefreshControl refreshing={atualizando} onRefresh={onAtualizar} tintColor={color.brand} /> : undefined}
      >
        {semTitulo ? null : (
          <View style={styles.topo}>
            <View style={styles.titulos}>
              <Texto variante="title" accessibilityRole="header">
                {titulo}
              </Texto>
              {subtitulo ? (
                <Texto variante="bodySm" cor="textMuted">
                  {subtitulo}
                </Texto>
              ) : null}
            </View>
            {direita}
          </View>
        )}
        {children}
      </ScrollView>
      {flutuante ? <View style={styles.flutuante}>{flutuante}</View> : null}
    </SafeAreaView>
  );
}

/** Placeholder text for screens that are built in later phases. */
export function EmBreve({ fase }: { fase: string }) {
  return (
    <Texto variante="body" cor="textMuted">
      Esta tela é construída na {fase}.
    </Texto>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  conteudo: { padding: space[4], gap: space[4] },
  espacoFlutuante: { paddingBottom: 96 },
  topo: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  titulos: { flex: 1, gap: space[1] },
  flutuante: { position: 'absolute', right: space[4], bottom: space[4] },
});
