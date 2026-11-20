// Relatórios: ratio, ticket, services and products vs last month, offer
// acceptance, occupancy, no-shows, return, heatmap. All from relatorio_mes().
import { Cartao } from '@/components/Cartao';
import { Dinheiro } from '@/components/Dinheiro';
import { Carregando, EstadoErro } from '@/components/Estado';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { useRelatorio } from '@/features/pago/api';
import { PortaPlano } from '@/features/planos/PortaPlano';
import { ConteudoRelatorio } from '@/features/relatorios/ConteudoRelatorio';
import { useMetricasMes } from '@/features/relatorios/metricasMes';
import { formatDecimal, formatMes } from '@/lib/format';

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

function Relatorio() {
  const r = useRelatorio();
  if (r.isPending) return <TelaBase titulo="Relatórios"><Carregando /></TelaBase>;
  if (r.isError) return <TelaBase titulo="Relatórios"><EstadoErro onTentar={() => r.refetch()} /></TelaBase>;
  return (
    <TelaBase titulo="Relatórios" subtitulo={formatMes(r.data.mes)} onAtualizar={() => r.refetch()}>
      <ConteudoRelatorio d={r.data} />
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
