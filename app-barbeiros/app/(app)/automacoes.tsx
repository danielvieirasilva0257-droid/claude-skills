// Automações (Premium): strategies the app can send by itself. Every message
// goes through pode_enviar; blocked ones show why.
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Cartao } from '@/components/Cartao';
import { Chip } from '@/components/Chip';
import { Carregando } from '@/components/Estado';
import { SecondaryButton } from '@/components/SecondaryButton';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { PortaPlano } from '@/features/planos/PortaPlano';
import { COM_MOTOR, useAutomacoes, useCancelarFila, useFila, useLigarAutomacao, usePlanejar } from '@/features/premium/api';
import { formatDiaLongo, formatHora } from '@/lib/format';
import { space } from '@/theme/tokens';

const STATUS: Record<string, string> = { pendente: 'vai sair', enviada: '✓ enviada', bloqueada: 'bloqueada', cancelada: 'cancelada', erro: '⚠ erro' };

function Automacoes() {
  const lista = useAutomacoes();
  const ligar = useLigarAutomacao();
  const fila = useFila();
  const planejar = usePlanejar();
  const cancelar = useCancelarFila();
  if (lista.isPending) return <Carregando />;
  return (
    <TelaBase titulo="Automações" semTitulo onAtualizar={() => { lista.refetch(); fila.refetch(); }}>
      <Stack.Screen options={{ title: 'Automações' }} />
      <Texto cor="textMuted">O app manda sozinho, sempre respeitando permissão, limite por semana e horário (ter–sáb, 9h–12h ou 18h–20h).</Texto>

      <Texto variante="h3" accessibilityRole="header">Próximas mensagens</Texto>
      <SecondaryButton testID="planejar" compacto rotulo="Planejar as de hoje agora" carregando={planejar.isPending} onPress={() => planejar.mutate()} />
      {(fila.data ?? []).length === 0 ? <Texto cor="textMuted">Nada na fila. As de cada dia são planejadas às 8h.</Texto> : (fila.data ?? []).map((f) => (
        <Cartao key={f.id} testID={`fila-${f.estrategia}`}>
          <View style={styles.linha}>
            <Texto peso="semibold" style={styles.flex}>{f.cliente?.nome ?? 'Cliente'} · {f.estrategia}</Texto>
            <Texto variante="caption" peso="semibold" cor={f.status === 'bloqueada' ? 'warning' : f.status === 'enviada' ? 'brand' : 'textMuted'}>
              {f.status === 'bloqueada' ? '⚠ ' : ''}{STATUS[f.status] ?? f.status}
            </Texto>
          </View>
          <Texto variante="bodySm">"{f.texto}"</Texto>
          <Texto variante="caption" cor="textMuted">
            {f.status === 'bloqueada' ? `Motivo: ${f.motivo}` : `${formatDiaLongo(f.agendado_para.slice(0, 10))} às ${formatHora(f.agendado_para)}`}
          </Texto>
          {f.status === 'pendente' ? <SecondaryButton compacto rotulo="Não mandar" onPress={() => cancelar.mutate(f.id)} /> : null}
        </Cartao>
      ))}

      <Texto variante="h3" accessibilityRole="header">Estratégias automáticas</Texto>
      {(lista.data ?? []).map((e) => {
        const pronta = COM_MOTOR.includes(e.codigo);
        return (
          <Cartao key={e.codigo} testID={`auto-${e.codigo}`}>
            <View style={styles.linha}>
              <Texto peso="semibold" style={styles.flex}>{e.codigo} · {e.nome}</Texto>
              {pronta ? <Chip rotulo={e.ativa ? 'Ligada' : 'Desligada'} selecionado={e.ativa} onPress={() => ligar.mutate({ codigo: e.codigo, ativa: !e.ativa })} />
                : <Texto variante="caption" cor="textMuted">em breve</Texto>}
            </View>
            <Texto variante="caption" cor="textMuted">{e.momento}</Texto>
            {e.frase ? <Texto variante="bodySm">"{e.frase}"</Texto> : null}
          </Cartao>
        );
      })}
    </TelaBase>
  );
}

export default function TelaAutomacoes() {
  return (
    <PortaPlano recurso="automacoes" titulo="Automações" descricao="Confirmação de horário, pós-visita, reativação e aniversário, sem você digitar nada."
      previa={<Texto variante="title">Automações</Texto>}>
      <Automacoes />
    </PortaPlano>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  flex: { flex: 1 },
});
