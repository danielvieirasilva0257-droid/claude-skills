import { Cartao } from '@/components/Cartao';
import { Dinheiro } from '@/components/Dinheiro';
import { EmBreve, TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { PortaPlano } from '@/features/planos/PortaPlano';
import { useMetricasMes } from '@/features/relatorios/metricasMes';
import { formatDecimal } from '@/lib/format';

function Previa() {
  const m = useMetricasMes();
  return (
    <>
      <Texto variante="title">Relatórios</Texto>
      <Cartao>
        <Texto variante="caption" cor="textMuted">Faturamento do mês</Texto>
        <Dinheiro variante="display" valor={m.data?.faturamento ?? 0} />
      </Cartao>
      <Cartao>
        <Texto variante="caption" cor="textMuted">Ticket médio · Ratio</Texto>
        <Texto variante="h2" numero>
          {m.data ? `${formatDecimal(m.data.ratio_servicos_por_cliente)} serviços por cliente` : '—'}
        </Texto>
      </Cartao>
    </>
  );
}

export default function Relatorios() {
  return (
    <PortaPlano recurso="relatorios" titulo="Relatórios da sua cadeira" previa={<Previa />}
      descricao="Ratio, ticket, aceitação das ofertas, ocupação e mapa de calor com os seus números.">
      <TelaBase titulo="Relatórios">
        <EmBreve fase="Fase 3" />
      </TelaBase>
    </PortaPlano>
  );
}
