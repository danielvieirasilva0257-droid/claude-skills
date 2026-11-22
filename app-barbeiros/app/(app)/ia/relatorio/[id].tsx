// A report the AI made: the HTML page (numbers from the database at the time
// it was made) and "Compartilhar PDF". Opened by the AI itself (criar_relatorio)
// or from "Relatórios da IA".
import * as Print from 'expo-print';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Carregando, EstadoErro } from '@/components/Estado';
import { PaginaHtml } from '@/components/PaginaHtml';
import { SecondaryButton } from '@/components/SecondaryButton';
import { Texto } from '@/components/Texto';
import { useRelatorioIA } from '@/features/ia/relatorios/api';
import { color, space } from '@/theme/tokens';

async function compartilharPDF(html: string, titulo: string) {
  if (Platform.OS === 'web') {
    await Print.printAsync({ html });
    return;
  }
  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: titulo });
}

export default function TelaRelatorioIA() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const r = useRelatorioIA(id);
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.raiz} edges={['bottom']}>
      <Stack.Screen options={{ title: r.data?.titulo ?? 'Relatório' }} />
      {r.isPending ? <Carregando rotulo="Abrindo o relatório…" /> : r.isError || !r.data ? (
        <EstadoErro texto="Não deu para abrir o relatório." onTentar={() => void r.refetch()} testID="relatorio-erro" />
      ) : (
        <>
          <PaginaHtml html={r.data.html} titulo={r.data.titulo} />
          <View style={styles.rodape}>
            {erro ? <Texto cor="warning" peso="medium" accessibilityRole="alert">⚠ {erro}</Texto> : null}
            <SecondaryButton rotulo={Platform.OS === 'web' ? 'Imprimir ou salvar PDF' : 'Compartilhar PDF'} carregando={gerando} testID="relatorio-pdf"
              onPress={() => {
                setErro(null);
                setGerando(true);
                compartilharPDF(r.data.html, r.data.titulo)
                  .catch(() => setErro('Não deu para gerar o PDF agora.'))
                  .finally(() => setGerando(false));
              }} />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: color.bg },
  rodape: { padding: space[4], gap: space[2], borderTopWidth: 1, borderTopColor: color.border },
});
