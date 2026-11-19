import { Cartao } from '@/components/Cartao';
import { EmBreve, TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { useClientesResumo } from '@/features/clientes/basico';
import { PortaPlano } from '@/features/planos/PortaPlano';

function Previa() {
  const clientes = useClientesResumo();
  const nomes = (clientes.data ?? []).slice(0, 4);
  return (
    <>
      <Texto variante="title">Clientes</Texto>
      {(nomes.length ? nomes : [{ id: '1', nome: 'Seus clientes aparecem aqui' }]).map((c) => (
        <Cartao key={c.id}>
          <Texto peso="medium">{c.nome}</Texto>
          <Texto variante="caption" cor="textMuted">Última visita, recorrência e o que oferecer</Texto>
        </Cartao>
      ))}
    </>
  );
}

export default function Clientes() {
  return (
    <PortaPlano recurso="clientes" titulo="Clientes com ficha" previa={<Previa />}
      descricao="Ficha de cada cliente, quem sumiu e quando chamar de volta.">
      <TelaBase titulo="Clientes">
        <EmBreve fase="Fase 3" />
      </TelaBase>
    </PortaPlano>
  );
}
