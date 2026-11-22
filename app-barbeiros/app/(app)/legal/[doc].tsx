// Terms of use and privacy policy, rendered from legal/*.md (generated into
// documentos.gerado.ts). A light renderer: "#" title, "##" section, "> " note,
// "- " bullet, blank line between paragraphs.
import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Cartao } from '@/components/Cartao';
import { EstadoVazio } from '@/components/Estado';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { DOCUMENTOS, type Documento } from '@/features/legal/documentos.gerado';
import { space } from '@/theme/tokens';

function Bloco({ texto }: { texto: string }) {
  if (texto.startsWith('## ')) return <Texto variante="h3" accessibilityRole="header" style={styles.secao}>{texto.slice(3)}</Texto>;
  if (texto.startsWith('# ')) return null; // the title goes in the header
  if (texto.startsWith('> ')) {
    return <Cartao testID="legal-rascunho"><Texto variante="bodySm" cor="warning">⚠ {texto.slice(2)}</Texto></Cartao>;
  }
  if (texto.startsWith('- ')) {
    return (
      <View style={styles.lista}>
        {texto.split('\n').map((l) => <Texto key={l} variante="bodySm">• {l.replace(/^- /, '')}</Texto>)}
      </View>
    );
  }
  return <Texto variante="bodySm">{texto.replace(/\n/g, ' ')}</Texto>;
}

export default function TelaLegal() {
  const { doc } = useLocalSearchParams<{ doc: string }>();
  const texto = doc && doc in DOCUMENTOS ? DOCUMENTOS[doc as Documento] : null;
  const titulo = texto?.match(/^# (.+)$/m)?.[1] ?? 'Documento';
  return (
    <TelaBase titulo={titulo} semTitulo>
      <Stack.Screen options={{ title: titulo }} />
      {texto ? texto.trim().split(/\n\s*\n/).map((b, i) => <Bloco key={i} texto={b.trim()} />) : <EstadoVazio titulo="Documento não encontrado" />}
    </TelaBase>
  );
}

const styles = StyleSheet.create({
  secao: { paddingTop: space[2] },
  lista: { gap: space[1] },
});
