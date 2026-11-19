// Celebration of an achievement (once): mascot celebrating + ConquistaButton.
// Only for goals and milestones, never for everyday actions.
import { StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { ConquistaButton } from '@/components/ConquistaButton';
import { Dinheiro } from '@/components/Dinheiro';
import { Mascote } from '@/components/Mascote';
import { Texto } from '@/components/Texto';
import { useCelebrar, useConquistas, type Conquista } from '@/features/pago/api';
import { space } from '@/theme/tokens';

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
          <Mascote estado="comemorando" tamanho={110} />
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
  palco: { alignSelf: 'stretch', paddingTop: 96 },
});
