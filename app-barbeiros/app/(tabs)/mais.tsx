// Mais (perfil e configurações). Phase 2 adds plano, exportar dados e cancelar
// plano; Phase 0 only shows who is signed in and lets them sign out.
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BotaoProvisorio } from '@/components/BotaoProvisorio';
import { EmBreve, TelaBase } from '@/components/TelaBase';
import { sair, useSessao } from '@/features/auth/sessao';
import { queryClient } from '@/lib/queryClient';
import { inter } from '@/theme/fonts';
import { color, size, space } from '@/theme/tokens';

export default function Mais() {
  const email = useSessao((s) => s.session?.user.email ?? null);
  const [saindo, setSaindo] = useState(false);

  async function aoSair() {
    setSaindo(true);
    await sair();
    queryClient.clear();
  }

  return (
    <TelaBase titulo="Mais">
      <View style={styles.bloco}>
        <Text style={styles.rotulo}>Conta</Text>
        <Text style={styles.valor} testID="mais-email">
          {email ?? '—'}
        </Text>
      </View>
      <EmBreve fase="Fase 2 (plano, exportar dados e cancelar plano)" />
      <BotaoProvisorio testID="mais-sair" rotulo="Sair" variante="secundario" onPress={aoSair} carregando={saindo} />
    </TelaBase>
  );
}

const styles = StyleSheet.create({
  bloco: { gap: space[1] },
  rotulo: { ...inter('regular'), fontSize: size.bodySm, color: color.textMuted },
  valor: { ...inter('medium'), fontSize: size.body, color: color.text },
});
