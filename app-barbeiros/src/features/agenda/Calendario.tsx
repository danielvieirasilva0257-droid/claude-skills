// Month calendar of the agenda: Sunday first (as in Brazil), the selected day
// as the white pill (DESIGN.md), today in lime, and a dot under days with
// bookings (lime: scheduled; grey: only done or no-show). Counts come from
// agenda_mes (database). Every cell is a 44 px button with a spoken label.
import { Pressable, StyleSheet, View } from 'react-native';

import { BotaoIcone } from '@/components/BotaoIcone';
import { Texto } from '@/components/Texto';
import { diaISO, formatDiaLongo, formatMes } from '@/lib/format';
import { color, radius, space } from '@/theme/tokens';

import type { DiaDoMes } from './api';

const SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const SEMANA_LONGA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

type Props = {
  mes: string;                       // yyyy-mm-01
  selecionado: string;               // yyyy-mm-dd
  dias: DiaDoMes[];
  onSelecionar: (dia: string) => void;
  onMudarMes: (mes: string) => void;
};

function mesSeguinte(mes: string, passo: number): string {
  const [a, m] = mes.split('-').map(Number);
  const d = new Date(Date.UTC(a ?? 1970, (m ?? 1) - 1 + passo, 1));
  return d.toISOString().slice(0, 10);
}

export function Calendario({ mes, selecionado, dias, onSelecionar, onMudarMes }: Props) {
  const hoje = diaISO();
  const [a, m] = mes.split('-').map(Number);
  const primeiro = new Date(Date.UTC(a ?? 1970, (m ?? 1) - 1, 1));
  const total = new Date(Date.UTC(a ?? 1970, m ?? 1, 0)).getUTCDate();
  const vazios = primeiro.getUTCDay();
  const porDia = new Map(dias.map((d) => [d.dia, d]));
  const celulas: (string | null)[] = [
    ...Array.from({ length: vazios }, () => null),
    ...Array.from({ length: total }, (_, i) => `${mes.slice(0, 8)}${String(i + 1).padStart(2, '0')}`),
  ];
  while (celulas.length % 7) celulas.push(null);

  return (
    <View style={styles.raiz} testID="calendario">
      <View style={styles.topo}>
        <BotaoIcone icone={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }} rotulo="Mês anterior" onPress={() => onMudarMes(mesSeguinte(mes, -1))} />
        <Texto peso="semibold" centro style={styles.flex} accessibilityRole="header" testID="calendario-mes">
          {formatMes(mes).replace(/^./, (c) => c.toUpperCase())}
        </Texto>
        <BotaoIcone icone={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }} rotulo="Próximo mês" onPress={() => onMudarMes(mesSeguinte(mes, 1))} />
      </View>
      <View style={styles.linha} importantForAccessibility="no-hide-descendants" aria-hidden>
        {SEMANA.map((d, i) => <Texto key={`${d}${i}`} variante="caption" cor="textMuted" centro style={styles.celula}>{d}</Texto>)}
      </View>
      {Array.from({ length: celulas.length / 7 }, (_, s) => (
        <View key={s} style={styles.linha}>
          {celulas.slice(s * 7, s * 7 + 7).map((dia, i) => {
            if (!dia) return <View key={`v${s}${i}`} style={styles.celula} />;
            const info = porDia.get(dia);
            const n = (info?.agendados ?? 0) + (info?.concluidos ?? 0) + (info?.faltas ?? 0);
            const ativo = dia === selecionado;
            const ehHoje = dia === hoje;
            const rotulo = `${SEMANA_LONGA[new Date(`${dia}T12:00:00Z`).getUTCDay()]}, ${formatDiaLongo(dia).split(', ')[1]}`
              + (n ? `, ${n} horário(s)` : ', sem horários') + (ehHoje ? ', hoje' : '') + (ativo ? ', selecionado' : '');
            return (
              <Pressable key={dia} onPress={() => onSelecionar(dia)} accessibilityRole="button" accessibilityLabel={rotulo}
                testID={`dia-${dia}`} style={styles.celula} hitSlop={2}>
                <View style={[styles.numero, ativo ? styles.ativo : ehHoje ? styles.hoje : null]}>
                  <Texto variante="bodySm" numero peso={ativo || ehHoje ? 'semibold' : 'regular'}
                    cor={ativo ? 'onLight' : ehHoje ? 'brand' : 'text'}>
                    {Number(dia.slice(8))}
                  </Texto>
                </View>
                <View style={[styles.ponto, n ? { backgroundColor: info?.agendados ? color.brand : color.textMuted } : null]} />
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: { gap: space[1] },
  topo: { flexDirection: 'row', alignItems: 'center', gap: space[2], marginBottom: space[1] },
  flex: { flex: 1 },
  linha: { flexDirection: 'row' },
  celula: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', gap: 2 },
  numero: { width: 34, height: 34, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  ativo: { backgroundColor: color.text },
  hoje: { borderWidth: 1.5, borderColor: color.brand },
  ponto: { width: 5, height: 5, borderRadius: 3 },
});
