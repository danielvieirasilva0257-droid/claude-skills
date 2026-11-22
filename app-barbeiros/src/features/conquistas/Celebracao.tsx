// Celebration of an achievement (once): icon of the achievement + ConquistaButton.
// No mascot (Daniel's decision, 20/11/2026).
// Only for goals and milestones, never for everyday actions.
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { ConquistaButton } from '@/components/ConquistaButton';
import { Dinheiro } from '@/components/Dinheiro';
import { Texto } from '@/components/Texto';
import { useCelebrar, useConquistas, type Conquista } from '@/features/pago/api';
import { color, radius, space } from '@/theme/tokens';

const ICONE: Record<Conquista['tipo'], SymbolViewProps['name']> = {
  meta_50: { ios: 'flag.fill', android: 'flag', web: 'flag' },
  meta_100: { ios: 'trophy.fill', android: 'emoji_events', web: 'emoji_events' },
  recorde_mes: { ios: 'chart.line.uptrend.xyaxis', android: 'trending_up', web: 'trending_up' },
  primeiro_caixa: { ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' },
};

const TEXTO: Record<Conquista['tipo'], { titulo: string; frase: string; botao: string }> = {
  meta_50: { titulo: 'Metade da meta!', frase: 'Você já passou da metade da meta do mês.', botao: 'Bora pra outra metade' },
  meta_100: { titulo: 'Meta batida!', frase: 'Você bateu a meta do mês. Mandou bem.', botao: 'Comemorar' },
  recorde_mes: { titulo: 'Recorde!', frase: 'Este é o seu melhor mês até agora.', botao: 'Comemorar' },
  primeiro_caixa: { titulo: 'Primeiro caixa fechado!', frase: 'Fechar o caixa todo dia mostra o seu resultado de verdade.', botao: 'Fechou' },
};

export function Celebracao() {
  const conquistas = useConquistas();
  const celebrar = useCelebrar();
  const atual = conquistas.data?.[0] ?? null;
  const t = atual ? TEXTO[atual.tipo] : null;
  return (
    <BottomSheet aberto={atual !== null} onFechar={() => atual && celebrar.mutate(atual)} titulo={t?.titulo ?? ''} testID="celebracao">
      {atual && t ? (
        <View style={styles.centro}>
          <View style={styles.selo} testID="celebracao-icone">
            <SymbolView name={ICONE[atual.tipo]} tintColor={color.brand} size={48} />
          </View>
          <Texto centro>{t.frase}</Texto>
          {atual.valor !== null ? <Dinheiro variante="h2" valor={atual.valor} centro /> : null}
          <View style={styles.palco}>
            <ConquistaButton testID="comemorar" rotulo={t.botao} onPress={() => undefined} onFim={() => celebrar.mutate(atual)} />
          </View>
        </View>
      ) : null}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  centro: { alignItems: 'center', gap: space[3] },
  selo: { width: 96, height: 96, borderRadius: radius.pill, backgroundColor: color.brandSoft, alignItems: 'center', justifyContent: 'center' },
  palco: { alignSelf: 'stretch', paddingTop: 96 },
});
