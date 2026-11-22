// Extrato do mês: cascade from commission to what is left, next tier, cash
// advances (vales); PDF and WhatsApp share. Numbers from extrato_completo().
import * as Print from 'expo-print';
import { Stack } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Platform, Share, StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Campo } from '@/components/Campo';
import { Cartao } from '@/components/Cartao';
import { Dinheiro } from '@/components/Dinheiro';
import { Carregando, EstadoErro } from '@/components/Estado';
import { Cascata, type Degrau } from '@/components/graficos/Cascata';
import { SecondaryButton } from '@/components/SecondaryButton';
import { StatusButton } from '@/components/StatusButton';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { useApagarVale, useExtrato, useSalvarVale, type Extrato } from '@/features/pago/api';
import { PortaPlano } from '@/features/planos/PortaPlano';
import { diaISO, formatDiaLongo, formatMes, formatMoeda, formatPorcentagem } from '@/lib/format';
import { space } from '@/theme/tokens';

function degraus(e: Extrato): Degrau[] {
  const d = (rotulo: string, valor: unknown, tipo: Degrau['tipo']): Degrau => ({ rotulo, valor: Number(valor), texto: formatMoeda(valor as number), tipo });
  if (!e.regra) {
    return [d('Serviços', e.faturamento_servicos, 'total'), d('Produtos', e.faturamento_produtos, 'mais'),
      d('Taxas', e.taxas, 'menos'), d('Aluguel', e.aluguel, 'menos'), d('Sobra', e.liquido, 'total')];
  }
  return [d('Comissão serviços', e.comissao_servicos, 'total'), d('Comissão produtos', e.comissao_produtos, 'mais'),
    d('Vales', e.vales, 'menos'), d('Aluguel', e.aluguel, 'menos'), d('Você recebe', e.liquido, 'total')];
}

function linhasTexto(e: Extrato): [string, string][] {
  return [
    ['Serviços', formatMoeda(e.faturamento_servicos)], ['Produtos', formatMoeda(e.faturamento_produtos)],
    ['Taxas da maquininha', `− ${formatMoeda(e.taxas)}`], ['Produtos usados', `− ${formatMoeda(e.insumos)}`],
    ['Base da comissão', formatMoeda(e.base_servicos)], ['Comissão nos serviços', formatMoeda(e.comissao_servicos)],
    ['Comissão nos produtos', formatMoeda(e.comissao_produtos)], ['Vales', `− ${formatMoeda(e.vales)}`],
    ['Aluguel da cadeira', `− ${formatMoeda(e.aluguel)}`], ['Você recebe', formatMoeda(e.liquido)],
  ];
}

const esc = (t: string) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

async function exportarPDF(e: Extrato) {
  const linhas = linhasTexto(e).map(([a, b]) => `<tr><td>${esc(a)}</td><td style="text-align:right">${esc(b)}</td></tr>`).join('');
  const html = `<html><head><meta charset="utf-8"><style>body{font-family:Inter,Arial,sans-serif;color:#0F1A14;padding:24px}
    h1{font-size:22px}table{width:100%;border-collapse:collapse}td{padding:8px 0;border-bottom:1px solid #E2E8E5}
    tr:last-child td{font-weight:600}</style></head><body><h1>Extrato de ${esc(formatMes(e.mes))}</h1>
    <table>${linhas}</table><p style="color:#5B6B63;font-size:12px">Calculado pelo App Barbeiros em ${esc(formatDiaLongo(diaISO()))}.</p></body></html>`;
  if (Platform.OS === 'web') {
    await Print.printAsync({ html });
    return;
  }
  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: 'Extrato em PDF' });
}

function Extrato_() {
  const extrato = useExtrato();
  const salvarVale = useSalvarVale();
  const apagarVale = useApagarVale();
  const [vale, setVale] = useState(false);
  const [valor, setValor] = useState('');
  const [motivo, setMotivo] = useState('');

  if (extrato.isPending) return <Carregando />;
  if (extrato.isError) return <EstadoErro onTentar={() => extrato.refetch()} />;
  const e = extrato.data;
  const negativo = Number(e.liquido) < 0;

  return (
    <TelaBase titulo="Extrato" semTitulo onAtualizar={() => extrato.refetch()}>
      <Stack.Screen options={{ title: `Extrato · ${formatMes(e.mes)}` }} />
      <Cartao testID="extrato-liquido">
        <Texto variante="caption" cor="textMuted">{e.regra ? 'Você recebe neste mês' : 'Sobra neste mês'}</Texto>
        <Dinheiro variante="display" valor={negativo ? Math.abs(Number(e.liquido)) : e.liquido} sinal={negativo ? '−' : undefined} cor={negativo ? 'danger' : 'text'} />
        {negativo ? <Texto variante="bodySm" cor="danger" peso="medium">▼ Os vales e o aluguel passaram da comissão.</Texto> : null}
        {e.pct_proxima !== null && e.falta_proxima !== null ? (
          <Texto variante="bodySm" peso="medium" cor="brandLip" testID="proxima-faixa">
            Faltam {formatMoeda(e.falta_proxima)} em serviços para a comissão subir de {formatPorcentagem(e.pct_atual)} para {formatPorcentagem(e.pct_proxima)}.
          </Texto>
        ) : null}
      </Cartao>
      <Cascata testID="cascata" titulo="Do faturamento ao seu bolso" degraus={degraus(e)} />
      <Cartao>
        {linhasTexto(e).map(([a, b]) => (
          <View key={a} style={styles.linha}>
            <Texto variante="bodySm" style={styles.flex}>{a}</Texto>
            <Texto variante="bodySm" peso={a === 'Você recebe' ? 'semibold' : 'regular'} numero>{b}</Texto>
          </View>
        ))}
      </Cartao>
      <Texto variante="h3" accessibilityRole="header">Vales</Texto>
      {e.vales_lista.length === 0 ? <Texto cor="textMuted">Nenhum vale neste mês.</Texto> : e.vales_lista.map((v) => (
        <View key={v.id} style={styles.linha}>
          <Texto variante="bodySm" style={styles.flex}>{formatDiaLongo(v.data)}{v.motivo ? ` · ${v.motivo}` : ''}</Texto>
          <Dinheiro variante="bodySm" valor={v.valor} sinal="−" />
          <SecondaryButton compacto rotulo="Apagar" tom="perigo" onPress={() => apagarVale.mutate(v.id)} />
        </View>
      ))}
      <SecondaryButton testID="novo-vale" rotulo="+ Vale" onPress={() => setVale(true)} />
      <View style={styles.acoes}>
        <SecondaryButton testID="extrato-pdf" rotulo="PDF" style={styles.flex} onPress={() => exportarPDF(e)} />
        <SecondaryButton testID="extrato-whatsapp" rotulo="WhatsApp" style={styles.flex}
          onPress={() => Share.share({ message: `Extrato de ${formatMes(e.mes)}\n${linhasTexto(e).map(([a, b]) => `${a}: ${b}`).join('\n')}` })} />
      </View>
      <BottomSheet aberto={vale} onFechar={() => setVale(false)} titulo="Novo vale">
        <Campo rotulo="Valor" prefixo="R$" value={valor} onChangeText={setValor} keyboardType="decimal-pad" inputMode="decimal" />
        <Campo rotulo="Motivo (opcional)" value={motivo} onChangeText={setMotivo} />
        <StatusButton acao={async () => {
          const v = Number(valor.replace(',', '.'));
          if (!(v > 0)) throw new Error('Valor inválido');
          await salvarVale.mutateAsync({ data: diaISO(), valor: v, motivo: motivo.trim() || null });
          setVale(false);
          setValor('');
          setMotivo('');
        }} />
      </BottomSheet>
    </TelaBase>
  );
}

export default function TelaExtrato() {
  return (
    <PortaPlano recurso="comissao" titulo="Extrato do mês" descricao="Do faturamento ao que você recebe, com PDF para mandar."
      previa={<Texto variante="title">Extrato</Texto>}>
      <Extrato_ />
    </PortaPlano>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: space[2], minHeight: 32 },
  flex: { flex: 1 },
  acoes: { flexDirection: 'row', gap: space[3] },
});
