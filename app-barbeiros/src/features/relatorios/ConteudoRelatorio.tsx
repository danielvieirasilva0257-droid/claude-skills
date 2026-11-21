// Body of a month report (relatorio_mes / relatorio_barbeiro): indicators
// vs the same period of last month and vs the 3-month average, the months
// chart with the average line, chair health, services and products vs last
// month (same period), offer acceptance and the heatmap. Shared by the Relatórios tab and the owner's per-barber report.
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Cartao } from '@/components/Cartao';
import { Dinheiro } from '@/components/Dinheiro';
import { EstadoVazio } from '@/components/Estado';
import { BarrasComparadas } from '@/components/graficos/BarrasComparadas';
import { BlocoGrafico } from '@/components/graficos/BlocoGrafico';
import { MapaCalor } from '@/components/graficos/MapaCalor';
import { MesesComMedia } from '@/components/graficos/MesesComMedia';
import { Texto } from '@/components/Texto';
import { Comparacoes } from '@/components/Variacao';
import type { Relatorio } from '@/features/pago/api';
import { formatDecimal, formatPorcentagem } from '@/lib/format';
import { grafico } from '@/theme/grafico';
import { color, radius, space } from '@/theme/tokens';

export function Indicador({ rotulo, children, detalhe }: { rotulo: string; children: ReactNode; detalhe?: ReactNode }) {
  return (
    <View style={styles.indicador}>
      <Texto variante="caption" cor="textMuted">{rotulo}</Texto>
      {children}
      {detalhe}
    </View>
  );
}

/** "Do dia 1 ao dia 21, comparado ao mesmo período" (current month) or the whole month (closed month). */
export function textoPeriodo(ateDia: number | null | undefined, mesesMedia: number) {
  const media = mesesMedia > 0 ? ` e à média de ${mesesMedia === 1 ? '1 mês' : `${mesesMedia} meses`}` : '';
  return ateDia
    ? `Do dia 1 ao dia ${ateDia}, comparado ao mesmo período do mês passado${media}.`
    : `Mês inteiro, comparado ao mês passado${media}.`;
}

export function ConteudoRelatorio({ d }: { d: Relatorio }) {
  const a = d.atual;
  const s = d.saude;
  const ateDia = d.comparacao?.ate_dia ?? null;
  const comDados = (d.meses ?? []).filter((m) => Number(m.faturamento) > 0).length;
  return (
    <>
      {!a ? <EstadoVazio titulo="Ainda sem atendimentos neste mês" /> : (
        <Cartao testID="indicadores">
          <Texto variante="caption" cor="textMuted" testID="periodo-comparado">{textoPeriodo(ateDia, d.comparacao?.meses_media ?? 0)}</Texto>
          <View style={styles.grade}>
            <Indicador rotulo="Faturamento" detalhe={<Comparacoes testID="comparacao-faturamento" anterior={d.variacao.faturamento} media={d.vs_media?.faturamento} />}>
              <Dinheiro variante="h3" valor={a.faturamento} />
            </Indicador>
            <Indicador rotulo="Ticket médio" detalhe={<Comparacoes anterior={d.variacao.ticket_medio} media={d.vs_media?.ticket_medio} />}>
              <Dinheiro variante="h3" valor={a.ticket_medio} />
            </Indicador>
            <Indicador rotulo="Serviços por cliente (ratio)"
              detalhe={<Comparacoes formato="diferenca" anterior={d.variacao.ratio} media={d.vs_media?.ratio} />}>
              <Texto variante="h3" numero>{formatDecimal(a.ratio_servicos_por_cliente)}</Texto>
            </Indicador>
            <Indicador rotulo="Atendimentos" detalhe={<Comparacoes anterior={d.variacao.atendimentos} media={d.vs_media?.atendimentos} />}>
              <Texto variante="h3" numero>{a.atendimentos}</Texto>
            </Indicador>
          </View>
        </Cartao>
      )}

      {a && comDados >= 2 ? (
        <MesesComMedia testID="grafico-meses" meses={d.meses} media={d.media?.faturamento} ateDia={ateDia} />
      ) : null}

      {s ? (
        <Cartao testID="saude">
          <Texto variante="h3" accessibilityRole="header">Saúde da cadeira (90 dias)</Texto>
          <View style={styles.grade}>
            <Indicador rotulo="Ocupação"><Texto variante="h3" numero>{formatPorcentagem(s.ocupacao)}</Texto></Indicador>
            <Indicador rotulo="Faltas"><Texto variante="h3" numero>{formatPorcentagem(s.taxa_faltas)}</Texto></Indicador>
            <Indicador rotulo="Voltaram na 2ª visita"><Texto variante="h3" numero>{formatPorcentagem(s.taxa_segunda_visita)}</Texto></Indicador>
            <Indicador rotulo="Marcaram o próximo"><Texto variante="h3" numero>{formatPorcentagem(s.taxa_reagendamento)}</Texto></Indicador>
          </View>
        </Cartao>
      ) : null}

      {d.mix_servicos.length ? (
        <BarrasComparadas testID="grafico-servicos" titulo="Serviços feitos" rotuloAnterior={ateDia ? `Mês passado até o dia ${ateDia}` : 'Mês passado'}
          itens={d.mix_servicos.map((x) => ({ nome: x.nome, atual: x.qtd, anterior: x.qtd_mes_anterior }))} />
      ) : null}
      {d.mix_produtos.length ? (
        <BarrasComparadas titulo="Produtos vendidos" rotuloAnterior={ateDia ? `Mês passado até o dia ${ateDia}` : 'Mês passado'}
          itens={d.mix_produtos.map((x) => ({ nome: x.nome, atual: x.qtd, anterior: x.qtd_mes_anterior }))} />
      ) : null}

      {d.aceitacao.length ? (
        <BlocoGrafico titulo="Aceitação das ofertas" testID="aceitacao"
          tabela={{ colunas: ['Item', 'Aceitas', 'Ofertas', 'Taxa'], linhas: d.aceitacao.map((x) => [x.item, x.aceitas, x.ofertas, formatPorcentagem(x.taxa)]) }}>
          {d.aceitacao.map((x) => (
            <View key={x.item} style={styles.aceitacao}>
              <View style={styles.linha}>
                <Texto variante="bodySm" peso="medium" style={styles.flex}>{x.item}</Texto>
                <Texto variante="caption" numero>{x.aceitas} de {x.ofertas} · {formatPorcentagem(x.taxa)}{x.poucos_dados ? ' · poucos dados' : ''}</Texto>
              </View>
              <View style={styles.trilho}>
                <View style={[styles.preenchido, { width: `${Number(x.taxa) * 100}%` }]} />
              </View>
            </View>
          ))}
        </BlocoGrafico>
      ) : null}

      <MapaCalor testID="mapa-calor" celulas={d.mapa_calor} max={d.mapa_max} />
    </>
  );
}

const styles = StyleSheet.create({
  grade: { flexDirection: 'row', flexWrap: 'wrap', rowGap: space[3], columnGap: space[4] },
  indicador: { flexGrow: 1, minWidth: 130, gap: 2 },
  aceitacao: { gap: space[1] },
  linha: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  flex: { flex: 1 },
  trilho: { height: 8, borderRadius: radius.pill, backgroundColor: color.surface, borderWidth: 1, borderColor: color.border, overflow: 'hidden' },
  preenchido: { height: '100%', backgroundColor: grafico.atual, borderRadius: radius.pill },
});
