// Prospecção: funnel by code word (contatos → agendaram → vieram → voltaram),
// cost per client, clients by channel, and the code words.
import { Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Campo } from '@/components/Campo';
import { Cartao } from '@/components/Cartao';
import { Carregando, EstadoVazio } from '@/components/Estado';
import { StatusButton } from '@/components/StatusButton';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { PortaPlano } from '@/features/planos/PortaPlano';
import { useFunil, useSalvarCodigo, type LinhaFunil } from '@/features/premium/api';
import { formatMoeda } from '@/lib/format';
import { grafico } from '@/theme/grafico';
import { color, radius, space } from '@/theme/tokens';

const ETAPAS: { chave: keyof LinhaFunil; rotulo: string }[] = [
  { chave: 'contatos', rotulo: 'Chamaram' }, { chave: 'agendaram', rotulo: 'Agendaram' },
  { chave: 'vieram', rotulo: 'Vieram' }, { chave: 'voltaram', rotulo: 'Voltaram' },
];

function Funil({ l }: { l: LinhaFunil }) {
  return (
    <Cartao testID={`funil-${l.codigo}`}>
      <View style={styles.linha}>
        <Texto peso="semibold" style={styles.flex}>{l.codigo}</Texto>
        <Texto variante="caption" cor="textMuted">{l.canal ?? 'sem canal'}{l.parceiro ? ` · ${l.parceiro}` : ''}</Texto>
      </View>
      {ETAPAS.map((e) => {
        const n = Number(l[e.chave]);
        return (
          <View key={e.chave} style={styles.etapa} accessibilityLabel={`${e.rotulo}: ${n}`}>
            <Texto variante="caption" cor="textMuted" style={styles.rotulo}>{e.rotulo}</Texto>
            <View style={styles.trilho}><View style={[styles.barra, { width: `${l.contatos ? (n / l.contatos) * 100 : 0}%` }]} /></View>
            <Texto variante="caption" numero style={styles.numero}>{n}</Texto>
          </View>
        );
      })}
      <Texto variante="caption" cor="textMuted" numero>
        Custo {formatMoeda(l.custo_mensal)}/mês{l.custo_por_cliente !== null ? ` · ${formatMoeda(l.custo_por_cliente)} por cliente que veio` : ''}
      </Texto>
    </Cartao>
  );
}

function Prospeccao() {
  const funil = useFunil();
  const salvar = useSalvarCodigo();
  const [codigo, setCodigo] = useState('');
  const [canal, setCanal] = useState('');
  const [custo, setCusto] = useState('');
  if (funil.isPending) return <Carregando />;
  const d = funil.data!;
  return (
    <TelaBase titulo="Prospecção" semTitulo onAtualizar={() => funil.refetch()}>
      <Stack.Screen options={{ title: 'Prospecção' }} />
      <Texto cor="textMuted">Cada canal com sua palavra-código. Quem manda "REELS" no WhatsApp ou no direct conta para o Reels.</Texto>
      {d.funil.length === 0 ? <EstadoVazio titulo="Ninguém chegou por código ainda" /> : d.funil.map((l) => <Funil key={l.codigo} l={l} />)}
      <Texto variante="h3" accessibilityRole="header">Clientes por origem</Texto>
      <Cartao>
        {d.origens.map((o) => (
          <View key={o.origem} style={styles.linha}>
            <Texto variante="bodySm" style={styles.flex}>{o.origem}</Texto>
            <Texto variante="bodySm" numero>{o.clientes} cliente(s) · {o.fieis} fiel(is)</Texto>
          </View>
        ))}
      </Cartao>
      <Texto variante="h3" accessibilityRole="header">Palavras-código</Texto>
      {d.codigos.map((c) => (
        <Texto key={c.codigo} variante="bodySm" numero>{c.codigo} · {c.canal}{c.parceiro ? ` · ${c.parceiro}` : ''} · {formatMoeda(c.custo_mensal)}/mês</Texto>
      ))}
      <View style={styles.linha}>
        <View style={styles.flex}><Campo testID="codigo-novo" rotulo="Código" value={codigo} onChangeText={setCodigo} autoCapitalize="characters" placeholder="ACADEMIA" /></View>
        <View style={styles.flex}><Campo rotulo="Canal" value={canal} onChangeText={setCanal} placeholder="Parceria" /></View>
      </View>
      <Campo rotulo="Custo por mês (opcional)" prefixo="R$" value={custo} onChangeText={setCusto} keyboardType="decimal-pad" />
      <StatusButton testID="codigo-salvar" rotulo="Adicionar código" acao={async () => {
        if (!/^[A-Za-z0-9-]{2,20}$/.test(codigo.trim())) throw new Error('Use letras e números');
        await salvar.mutateAsync({ codigo: codigo.trim(), canal: canal.trim() || 'Outro', parceiro: null, custo_mensal: Number(custo.replace(',', '.') || 0) });
        setCodigo(''); setCanal(''); setCusto('');
      }} />
    </TelaBase>
  );
}

export default function TelaProspeccao() {
  return (
    <PortaPlano recurso="prospeccao" titulo="Prospecção" descricao="De onde vêm os clientes novos e quanto custa cada um."
      previa={<Texto variante="title">Prospecção</Texto>}>
      <Prospeccao />
    </PortaPlano>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  flex: { flex: 1 },
  etapa: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  rotulo: { width: 76 },
  numero: { width: 28, textAlign: 'right' },
  trilho: { flex: 1, height: 10, borderRadius: radius.pill, backgroundColor: color.surface, overflow: 'hidden' },
  barra: { height: '100%', borderRadius: radius.pill, backgroundColor: grafico.atual },
});
