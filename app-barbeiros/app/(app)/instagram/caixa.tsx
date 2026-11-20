// Comentários e direct: what arrived on Instagram and what the AI answered.
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Cartao } from '@/components/Cartao';
import { Carregando, EstadoVazio } from '@/components/Estado';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { PortaPlano } from '@/features/planos/PortaPlano';
import { useEventosInstagram } from '@/features/premium/api';
import { ListaConversas } from '@/features/premium/ListaConversas';
import { formatDiaLongo, formatHora } from '@/lib/format';
import { space } from '@/theme/tokens';

const TIPO: Record<string, string> = { comentario: 'Comentário', direct: 'Direct', mencao: 'Menção', resposta_story: 'Resposta ao story' };

function Caixa() {
  const eventos = useEventosInstagram();
  return (
    <TelaBase titulo="Comentários e direct" semTitulo onAtualizar={() => eventos.refetch()}>
      <Stack.Screen options={{ title: 'Comentários e direct' }} />
      <Texto variante="h3" accessibilityRole="header">Conversas no direct</Texto>
      <ListaConversas canal="instagram" />
      <Texto variante="h3" accessibilityRole="header">O que chegou</Texto>
      {eventos.isPending ? <Carregando /> : !eventos.data?.length ? <EstadoVazio titulo="Nada por aqui ainda" /> : eventos.data.map((e) => {
        const prazo = Date.now() - Date.parse(e.recebido_em) > 7 * 86400_000;
        return (
          <Cartao key={e.id} testID="evento-ig">
            <View style={styles.linha}>
              <Texto peso="semibold" style={styles.flex}>{TIPO[e.tipo]} · @{e.autor_nome ?? 'perfil'}</Texto>
              <Texto variante="caption" cor="textMuted">{formatDiaLongo(e.recebido_em.slice(0, 10)).split(',')[0]} {formatHora(e.recebido_em)}</Texto>
            </View>
            {e.texto ? <Texto variante="bodySm">"{e.texto}"</Texto> : null}
            <Texto variante="caption" peso="semibold" cor={e.resposta_privada_em ? 'brand' : prazo ? 'textMuted' : 'ai'}>
              {e.tipo !== 'comentario' ? 'Respondido no direct' : e.resposta_privada_em ? '✓ Resposta privada enviada' : prazo ? 'Passou de 7 dias: não dá mais para responder no privado' : 'A IA pode responder no privado'}
              {e.codigo_detectado ? ` · código ${e.codigo_detectado}` : ''}
            </Texto>
          </Cartao>
        );
      })}
    </TelaBase>
  );
}

export default function TelaCaixa() {
  return (
    <PortaPlano recurso="instagram" titulo="Comentários e direct" descricao="Comentários, menções e direct com a resposta da IA."
      previa={<Texto variante="title">Instagram</Texto>}>
      <Caixa />
    </PortaPlano>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  flex: { flex: 1 },
});
