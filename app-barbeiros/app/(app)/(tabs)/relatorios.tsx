// Relatórios: ratio, ticket, services and products vs last month, offer
// acceptance, occupancy, no-shows, return, heatmap. All from relatorio_mes().
import { StyleSheet, View } from 'react-native';

import { Cartao } from '@/components/Cartao';
import { Dinheiro } from '@/components/Dinheiro';
import { Carregando, EstadoErro, EstadoVazio } from '@/components/Estado';
import { BarrasComparadas } from '@/components/graficos/BarrasComparadas';
import { BlocoGrafico } from '@/components/graficos/BlocoGrafico';
import { MapaCalor } from '@/components/graficos/MapaCalor';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { Variacao } from '@/components/Variacao';
import { useRelatorio } from '@/features/pago/api';
import { PortaPlano } from '@/features/planos/PortaPlano';
import { useMetricasMes } from '@/features/relatorios/metricasMes';
import { formatDecimal, formatMes, formatPorcentagem } from '@/lib/format';
import { grafico } from '@/theme/grafico';
import { color, radius, space } from '@/theme/tokens';

function Previa() {
  const m = useMetricasMes();
  return (
    <>
      <Texto variante="title">Relatórios</Texto>
      <Cartao><Texto variante="caption" cor="textMuted">Faturamento do mês</Texto><Dinheiro variante="display" valor={m.data?.faturamento ?? 0} /></Cartao>
      <Cartao><Texto variante="caption" cor="textMuted">Serviços por cliente</Texto><Texto variante="h2" numero>{formatDecimal(m.data?.ratio_servicos_por_cliente)}</Texto></Cartao>
    </>
  );
}

function Indicador({ rotulo, children, detalhe }: { rotulo: string; children: React.ReactNode; detalhe?: React.ReactNode }) {
  return (
    <View style={styles.indicador}>
      <Texto variante="caption" cor="textMuted">{rotulo}</Texto>
      {children}
      {detalhe}
    </View>
  );
}

function Relatorio() {
  const r = useRelatorio();
  if (r.isPending) return <TelaBase titulo="Relatórios"><Carregando /></TelaBase>;
  if (r.isError) return <TelaBase titulo="Relatórios"><EstadoErro onTentar={() => r.refetch()} /></TelaBase>;
  const d = r.data;
  const a = d.atual;
  const s = d.saude;
  return (
    <TelaBase titulo="Relatórios" subtitulo={formatMes(d.mes)} onAtualizar={() => r.refetch()}>
      {!a ? <EstadoVazio titulo="Ainda sem atendimentos neste mês" /> : (
        <Cartao testID="indicadores">
          <View style={styles.grade}>
            <Indicador rotulo="Faturamento" detalhe={<Variacao valor={d.variacao.faturamento} />}>
              <Dinheiro variante="h3" valor={a.faturamento} />
            </Indicador>
            <Indicador rotulo="Ticket médio" detalhe={<Variacao valor={d.variacao.ticket_medio} />}>
              <Dinheiro variante="h3" valor={a.ticket_medio} />
            </Indicador>
            <Indicador rotulo="Serviços por cliente (ratio)"
              detalhe={<Texto variante="caption" cor="textMuted" numero>{d.variacao.ratio !== null ? `${Number(d.variacao.ratio) >= 0 ? '▲' : '▼'} ${formatDecimal(Math.abs(Number(d.variacao.ratio)))} vs mês anterior` : 'sem comparação'}</Texto>}>
              <Texto variante="h3" numero>{formatDecimal(a.ratio_servicos_por_cliente)}</Texto>
            </Indicador>
            <Indicador rotulo="Atendimentos" detalhe={<Variacao valor={d.variacao.atendimentos} />}>
              <Texto variante="h3" numero>{a.atendimentos}</Texto>
            </Indicador>
          </View>
        </Cartao>
      )}

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
        <BarrasComparadas testID="grafico-servicos" titulo="Serviços feitos"
          itens={d.mix_servicos.map((x) => ({ nome: x.nome, atual: x.qtd, anterior: x.qtd_mes_anterior }))} />
      ) : null}
      {d.mix_produtos.length ? (
        <BarrasComparadas titulo="Produtos vendidos"
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
    </TelaBase>
  );
}

export default function Relatorios() {
  return (
    <PortaPlano recurso="relatorios" titulo="Relatórios da sua cadeira" previa={<Previa />}
      descricao="Ratio, ticket, aceitação das ofertas, ocupação e mapa de calor com os seus números.">
      <Relatorio />
    </PortaPlano>
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
