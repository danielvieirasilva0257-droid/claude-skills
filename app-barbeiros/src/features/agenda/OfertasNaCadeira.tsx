// "O que oferecer" when a scheduled client sits down: sugerir_ofertas()
// (recurrent service due, easy combo, goal) with the narrative that closes most.
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Chip } from '@/components/Chip';
import { Carregando } from '@/components/Estado';
import { LinhaMenu } from '@/components/LinhaMenu';
import { Texto } from '@/components/Texto';
import { usePlano } from '@/features/conta/barbeiro';
import { useSugerirOfertas } from '@/features/pago/api';
import { formatMoeda, formatPorcentagem } from '@/lib/format';
import { libera } from '@/lib/plano';
import { color, radius, space } from '@/theme/tokens';

import { useRegistrarOferta } from './api';

export function OfertasNaCadeira({ atendimentoId }: { atendimentoId: string }) {
  const plano = usePlano();
  const liberado = libera(plano.data ?? 'gratis', 'coach');
  const sugestoes = useSugerirOfertas(liberado ? atendimentoId : null);
  const registrar = useRegistrarOferta();
  const [feitas, setFeitas] = useState<Record<string, boolean>>({});

  if (!liberado) {
    return <LinhaMenu rotulo="O que oferecer para este cliente" detalhe="Sugestões com a narrativa que mais fecha · plano Pago" bloqueado onPress={() => router.push('/planos')} />;
  }
  if (sugestoes.isPending) return <Carregando rotulo="Vendo o que oferecer…" />;
  const lista = sugestoes.data ?? [];
  if (lista.length === 0) return null;

  return (
    <View style={styles.coluna} testID="ofertas-cadeira">
      <Texto variante="h3">O que oferecer</Texto>
      {lista.map((s) => (
        <View key={s.servico_id} style={styles.cartao} testID={`sugestao-${s.servico}`}>
          <View style={styles.linha}>
            <Texto peso="semibold" style={styles.flex}>{s.servico}</Texto>
            <Texto variante="bodySm" numero>{formatMoeda(s.preco)}{s.simultaneo ? ' · mesmo tempo' : ''}</Texto>
          </View>
          <Texto variante="caption" cor="textMuted" numberOfLines={2}>{s.motivo}</Texto>
          {s.narrativa_texto ? (
            <View style={styles.citacao}>
              <Texto variante="bodySm">"{s.narrativa_texto}"</Texto>
              <Texto variante="caption" cor="textMuted">
                {s.narrativa_titulo}{s.narrativa_poucos_dados ? ' · poucos dados ainda' : ` · fecha ${formatPorcentagem(s.narrativa_taxa)}`}
              </Texto>
            </View>
          ) : null}
          {feitas[s.servico_id] !== undefined ? (
            <Texto variante="bodySm" peso="semibold" cor={feitas[s.servico_id] ? 'brandLip' : 'textMuted'}>
              {feitas[s.servico_id] ? '✓ Aceitou: entrou no atendimento' : 'Não aceitou'}
            </Texto>
          ) : (
            <View style={styles.linha}>
              {[true, false].map((aceitou) => (
                <Chip key={String(aceitou)} testID={`cadeira-${aceitou ? 'aceitou' : 'nao'}-${s.servico}`} rotulo={aceitou ? 'Ofereci: aceitou' : 'Ofereci: não'}
                  selecionado={false}
                  onPress={() => registrar.mutate({ atendimento: atendimentoId, aceitou, servico: s.servico_id, narrativa: s.narrativa_id, momento: 'chegada' },
                    { onSuccess: () => setFeitas((f) => ({ ...f, [s.servico_id]: aceitou })) })} />
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  coluna: { gap: space[2] },
  cartao: { borderWidth: 1, borderColor: color.border, borderRadius: radius.md, padding: space[3], gap: space[2] },
  linha: { flexDirection: 'row', alignItems: 'center', gap: space[2], flexWrap: 'wrap' },
  flex: { flex: 1 },
  citacao: { borderLeftWidth: 3, borderLeftColor: color.brand, paddingLeft: space[3], gap: 2 },
});
