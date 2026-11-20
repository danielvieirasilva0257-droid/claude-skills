// Mensagens: monthly marketing allowance (Premium: 100) and permissions per
// client (LGPD). Marketing only with consent; "SAIR" ends it at once.
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Cartao } from '@/components/Cartao';
import { Chip } from '@/components/Chip';
import { Carregando } from '@/components/Estado';
import { MetaRing } from '@/components/MetaRing';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { PortaPlano } from '@/features/planos/PortaPlano';
import { usePermissoes, useRegistrarPermissao, useUsoMensagens } from '@/features/premium/api';
import { space } from '@/theme/tokens';

function Mensagens() {
  const uso = useUsoMensagens();
  const permissoes = usePermissoes();
  const registrar = useRegistrarPermissao();
  if (uso.isPending || permissoes.isPending) return <Carregando />;
  const u = uso.data!;
  return (
    <TelaBase titulo="Mensagens" semTitulo onAtualizar={() => { uso.refetch(); permissoes.refetch(); }}>
      <Stack.Screen options={{ title: 'Mensagens e permissões' }} />
      <Cartao testID="uso-mensagens">
        <View style={styles.linha}>
          <MetaRing progresso={u.limite ? u.usadas / u.limite : 0} emRisco={u.limite > 0 && u.usadas / u.limite >= 0.9} tamanho={96} espessura={10}
            accessibilityLabel={`${u.usadas} de ${u.limite} mensagens de marketing usadas`}>
            <Texto variante="h3" numero>{u.usadas}</Texto>
          </MetaRing>
          <View style={styles.flex}>
            <Texto peso="semibold" numero>{u.usadas} de {u.limite} mensagens de marketing</Texto>
            <Texto variante="caption" cor="textMuted" numero>neste mês · {u.transacionais} lembretes e confirmações (não contam)</Texto>
          </View>
        </View>
      </Cartao>
      <Texto variante="h3" accessibilityRole="header">Permissões (LGPD)</Texto>
      <Texto variante="bodySm" cor="textMuted">Marketing só para quem aceitou. Quem responder SAIR para de receber na hora.</Texto>
      {(permissoes.data ?? []).map((p) => (
        <Cartao key={p.id} testID="permissao">
          <Texto peso="semibold">{p.nome}</Texto>
          <View style={styles.linha}>
            <Texto variante="bodySm" style={styles.flex}>Lembretes do horário</Texto>
            <Chip rotulo={p.lembretes === false ? 'Não quer' : 'Pode'} selecionado={p.lembretes !== false}
              onPress={() => registrar.mutate({ cliente_id: p.id, tipo: 'lembretes', aceito: p.lembretes === false })} />
          </View>
          <View style={styles.linha}>
            <Texto variante="bodySm" style={styles.flex}>Novidades e ofertas</Texto>
            <Chip testID={`marketing-${p.nome}`} rotulo={p.marketing ? 'Aceitou' : 'Sem permissão'} selecionado={Boolean(p.marketing)}
              onPress={() => registrar.mutate({ cliente_id: p.id, tipo: 'marketing', aceito: !p.marketing })} />
          </View>
        </Cartao>
      ))}
    </TelaBase>
  );
}

export default function TelaMensagens() {
  return (
    <PortaPlano recurso="mensagens" titulo="Mensagens e permissões" descricao="100 mensagens de marketing por mês e o controle de quem aceitou receber."
      previa={<Texto variante="title">Mensagens</Texto>}>
      <Mensagens />
    </PortaPlano>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  flex: { flex: 1, gap: 2 },
});
