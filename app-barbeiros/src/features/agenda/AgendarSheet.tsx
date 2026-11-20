// Schedule a time: day, hour, client (existing or new by name) and services.
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Campo } from '@/components/Campo';
import { Chip } from '@/components/Chip';
import { DuoButton } from '@/components/DuoButton';
import { Texto } from '@/components/Texto';
import { useClientesResumo, useCriarCliente } from '@/features/clientes/basico';
import { useServicos } from '@/features/servicos/api';
import { diaISO, formatDiaLongo, formatMoeda, horarioEm, somarDias } from '@/lib/format';
import { space } from '@/theme/tokens';

import { useLancar } from './api';

type Props = { aberto: boolean; onFechar: () => void; diaInicial: string; /** Tapped free slot on the day grid (HH:MM). */ horaInicial?: string };

const HORA = /^([01]?\d|2[0-3])[:h]?([0-5]\d)$/;

export function AgendarSheet({ aberto, onFechar, diaInicial, horaInicial }: Props) {
  const servicos = useServicos();
  const clientes = useClientesResumo();
  const criarCliente = useCriarCliente();
  const lancar = useLancar();
  const hoje = diaISO();
  const [dia, setDia] = useState(diaInicial < hoje ? hoje : diaInicial);
  const [hora, setHora] = useState(horaInicial ?? '');
  const [busca, setBusca] = useState('');
  const [cliente, setCliente] = useState<{ id: string | null; nome: string } | null>(null);
  const [escolhidos, setEscolhidos] = useState<string[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  const proximos = [hoje, somarDias(hoje, 1), somarDias(hoje, 2), somarDias(hoje, 3)];
  // The day chosen on the calendar shows up even when it is further ahead.
  const dias = diaInicial > proximos[3]! ? [...proximos, diaInicial] : proximos;
  const sugestoes = useMemo(() => {
    const t = busca.trim().toLowerCase();
    if (!t) return [];
    return (clientes.data ?? []).filter((c) => c.nome.toLowerCase().includes(t)).slice(0, 6);
  }, [busca, clientes.data]);

  function fechar() {
    setHora(horaInicial ?? '');
    setBusca('');
    setCliente(null);
    setEscolhidos([]);
    setErro(null);
    onFechar();
  }

  async function agendar() {
    setErro(null);
    const m = hora.trim().match(HORA);
    if (!m) {
      setErro('Digite a hora assim: 14:30');
      return;
    }
    if (escolhidos.length === 0) {
      setErro('Escolha pelo menos um serviço.');
      return;
    }
    const hhmm = `${m[1]!.padStart(2, '0')}:${m[2]}`;
    try {
      let clienteId = cliente?.id ?? null;
      if (!clienteId && cliente?.nome) clienteId = (await criarCliente.mutateAsync(cliente.nome)).id;
      await lancar.mutateAsync({ servicos: escolhidos, cliente: clienteId, inicio: horarioEm(dia, hhmm), status: 'agendado' });
      fechar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não deu para agendar.');
    }
  }

  return (
    <BottomSheet aberto={aberto} onFechar={fechar} titulo="Agendar horário" testID="agendar-sheet">
      <Texto variante="bodySm" peso="medium">Dia</Texto>
      <View style={styles.chips}>
        {dias.map((d, i) => (
          <Chip key={d} rotulo={i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : i < 4 ? formatDiaLongo(d).split(',')[0]! : formatDiaLongo(d).split(', ')[1]!} selecionado={dia === d} onPress={() => setDia(d)} />
        ))}
      </View>
      <Campo testID="agendar-hora" rotulo="Hora" value={hora} onChangeText={setHora} placeholder="14:30"
        keyboardType="numbers-and-punctuation" inputMode="numeric" />
      <Campo testID="agendar-cliente" rotulo="Cliente (opcional)" value={cliente ? cliente.nome : busca}
        onChangeText={(t) => {
          setCliente(null);
          setBusca(t);
        }}
        placeholder="Nome do cliente" ajuda={cliente ? (cliente.id ? '✓ Cliente cadastrado' : '✓ Cliente novo') : undefined} />
      {!cliente && busca.trim().length > 1 ? (
        <View style={styles.chips}>
          {sugestoes.map((c) => (
            <Chip key={c.id} rotulo={c.nome} selecionado={false} onPress={() => setCliente(c)} />
          ))}
          {sugestoes.some((c) => c.nome.toLowerCase() === busca.trim().toLowerCase()) ? null : (
            <Chip rotulo={`+ Novo: ${busca.trim()}`} selecionado={false} onPress={() => setCliente({ id: null, nome: busca.trim() })} />
          )}
        </View>
      ) : null}
      <Texto variante="bodySm" peso="medium">Serviços</Texto>
      <View style={styles.chips}>
        {(servicos.data ?? []).filter((s) => s.ativo).map((s) => (
          <Chip key={s.id} testID={`agendar-${s.nome}`} rotulo={s.nome} detalhe={formatMoeda(s.preco)} selecionado={escolhidos.includes(s.id)}
            onPress={() => setEscolhidos((e) => (e.includes(s.id) ? e.filter((x) => x !== s.id) : [...e, s.id]))} />
        ))}
      </View>
      {erro ? <Texto cor="danger" peso="medium" accessibilityRole="alert">⚠ {erro}</Texto> : null}
      <DuoButton testID="agendar-confirmar" rotulo="Agendar" onPress={agendar} carregando={lancar.isPending || criarCliente.isPending} />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
});
