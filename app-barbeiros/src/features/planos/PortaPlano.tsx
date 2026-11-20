// Shows the screen when the barber's plan unlocks it; otherwise the
// LockedScreen with a blurred preview of their own data.
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Carregando } from '@/components/Estado';
import { LockedScreen } from '@/components/LockedScreen';
import { usePlano } from '@/features/conta/barbeiro';
import { libera, planoNecessario, type Recurso } from '@/lib/plano';
import { color } from '@/theme/tokens';

type Props = {
  recurso: Recurso;
  titulo: string;
  descricao: string;
  previa: ReactNode;
  children: ReactNode;
};

export function PortaPlano({ recurso, titulo, descricao, previa, children }: Props) {
  const plano = usePlano();
  if (plano.isPending) {
    return (
      <View style={styles.centro}>
        <Carregando />
      </View>
    );
  }
  if (libera(plano.data ?? 'gratis', recurso)) return <>{children}</>;
  const necessario = planoNecessario(recurso);
  return (
    <LockedScreen plano={necessario} titulo={titulo} descricao={descricao} previa={previa}
      onConhecer={() => router.push({ pathname: '/planos', params: { destaque: necessario } })} />
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: color.bg },
});
