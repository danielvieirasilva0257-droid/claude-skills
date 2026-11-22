// "Relatórios da IA": the report pages the AI made when asked ("faz um relatório
// da semana passada"), newest first.
import { router } from 'expo-router';

import { Cartao } from '@/components/Cartao';
import { Carregando, EstadoErro, EstadoVazio } from '@/components/Estado';
import { LinhaMenu } from '@/components/LinhaMenu';
import { TelaBase } from '@/components/TelaBase';
import { useRelatoriosIA } from '@/features/ia/relatorios/api';
import { PortaPlano } from '@/features/planos/PortaPlano';
import { Texto } from '@/components/Texto';

function Lista() {
  const r = useRelatoriosIA();
  return (
    <TelaBase titulo="Relatórios da IA" subtitulo="Peça para a IA: “faz um relatório da semana passada”" onAtualizar={() => void r.refetch()} atualizando={r.isRefetching}>
      {r.isPending ? <Carregando /> : r.isError ? <EstadoErro onTentar={() => void r.refetch()} /> : !r.data?.length ? (
        <EstadoVazio titulo="Nenhum relatório ainda" texto="Fale com a IA e peça um relatório de qualquer período: ela monta a página com os seus números."
          acao="Falar com a IA" onAcao={() => router.push('/ia/voz')} testID="relatorios-vazio" />
      ) : (
        <Cartao>
          {r.data.map((x) => (
            <LinhaMenu key={x.id} rotulo={x.titulo} testID={`relatorio-${x.id}`}
              detalhe={`${x.periodo ?? ''}${x.periodo ? ' · ' : ''}feito em ${new Date(x.criado_em).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`}
              onPress={() => router.push({ pathname: '/ia/relatorio/[id]', params: { id: x.id } })} />
          ))}
        </Cartao>
      )}
    </TelaBase>
  );
}

export default function TelaRelatoriosIA() {
  return (
    <PortaPlano recurso="chat" titulo="Relatórios da IA" descricao="A IA monta relatórios de qualquer período com os seus números."
      previa={<Texto variante="title">Relatórios da IA</Texto>}>
      <Lista />
    </PortaPlano>
  );
}
