import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Cartao } from '@/components/Cartao';
import { Carregando, EstadoVazio } from '@/components/Estado';
import { Texto } from '@/components/Texto';
import { formatHora } from '@/lib/format';
import { color, radius, space } from '@/theme/tokens';

import { useConversas, type Canal } from './api';

export function ListaConversas({ canal }: { canal: Canal['tipo'] }) {
  const conversas = useConversas(canal);
  if (conversas.isPending) return <Carregando />;
  if (!conversas.data?.length) return <EstadoVazio titulo="Nenhuma conversa ainda" texto="Quando um cliente mandar mensagem, ela aparece aqui." />;
  return (
    <View style={styles.lista}>
      {conversas.data.map((c) => (
        <Cartao key={c.id} onPress={() => router.push(`/conversa/${c.id}`)} accessibilityLabel={`Conversa com ${c.cliente?.nome ?? c.nome_contato ?? 'cliente'}`} testID="conversa-linha">
          <View style={styles.linha}>
            <Texto peso="semibold" style={styles.flex}>{c.cliente?.nome ?? c.nome_contato ?? 'Cliente'}</Texto>
            {c.nao_lidas > 0 ? <View style={styles.badge}><Texto variante="tiny" cor="onBrand" numero>{c.nao_lidas}</Texto></View> : null}
            <Texto variante="caption" cor="textMuted">{formatHora(c.ultima_mensagem_em)}</Texto>
          </View>
          <Texto variante="bodySm" cor="textMuted" numberOfLines={1}>{c.ultima[0] ? `${c.ultima[0].autor === 'cliente' ? '' : c.ultima[0].autor === 'ia' ? 'IA: ' : 'Você: '}${c.ultima[0].texto}` : ''}</Texto>
          <Texto variante="caption" cor={c.ia_ativa ? 'ai' : 'textMuted'}>{c.ia_ativa ? 'IA atendendo' : 'Você assumiu'}{c.origem_codigo ? ` · veio por ${c.origem_codigo}` : ''}</Texto>
        </Cartao>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  lista: { gap: space[2] },
  linha: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  flex: { flex: 1 },
  badge: { minWidth: 22, height: 22, borderRadius: radius.pill, backgroundColor: color.brand, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
});
