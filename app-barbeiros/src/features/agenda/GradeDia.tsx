// Day grid of the agenda (salon style): hours down the side from the barber's
// start to end time, the pause shaded, each booking as a block placed by its
// start and the end the database computed, a "now" line on today, and every
// free half hour tappable to book. Overlapping bookings share the width.
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Dinheiro } from '@/components/Dinheiro';
import { Texto } from '@/components/Texto';
import { diaISO, formatHora, formatMoeda } from '@/lib/format';
import { color, radius, space } from '@/theme/tokens';

import type { GradeDia as Grade, ItemAgenda } from './api';
import { NOME_STATUS } from './AtendimentoSheet';

const PX_MIN = 1.2;          // 72 px per hour
const COLUNA_HORA = 52;
const MIN_BLOCO = 34;

type Item = Grade['itens'][number];
type Props = { grade: Grade; onItem: (item: ItemAgenda) => void; onVazio: (hhmm: string) => void };

const paraMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
};
const paraHora = (min: number) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

/** Column of each booking inside groups of overlapping bookings. */
function colunas(itens: { ini: number; fim: number }[]): { col: number; total: number }[] {
  const res = itens.map(() => ({ col: 0, total: 1 }));
  let grupo: number[] = [];
  let fimGrupo = -1;
  const fechar = () => {
    const total = Math.max(1, ...grupo.map((i) => res[i]!.col + 1));
    for (const i of grupo) res[i]!.total = total;
  };
  itens.forEach((it, i) => {
    if (it.ini >= fimGrupo && grupo.length) { fechar(); grupo = []; }
    const ocupadas = new Set(grupo.filter((j) => itens[j]!.fim > it.ini).map((j) => res[j]!.col));
    let c = 0;
    while (ocupadas.has(c)) c++;
    res[i]!.col = c;
    grupo.push(i);
    fimGrupo = Math.max(fimGrupo, it.fim);
  });
  if (grupo.length) fechar();
  return res;
}

function useAgoraMin(): number {
  const calcular = () => paraMin(formatHora(new Date()));
  const [agora, setAgora] = useState(calcular);
  useEffect(() => {
    const t = setInterval(() => setAgora(calcular()), 60_000);
    return () => clearInterval(t);
  }, []);
  return agora;
}

export function GradeDia({ grade, onItem, onVazio }: Props) {
  const agora = useAgoraMin();
  const e = grade.expediente;
  const itens = grade.itens.map((i) => ({ item: i, ini: paraMin(formatHora(i.inicio)), fim: Math.max(paraMin(formatHora(i.fim)), paraMin(formatHora(i.inicio)) + 15) }));
  const expIni = paraMin(e.inicio);
  const expFim = paraMin(e.fim);
  const inicio = Math.floor(Math.min(expIni, ...itens.map((i) => i.ini)) / 60) * 60;
  const fim = Math.ceil(Math.max(expFim, ...itens.map((i) => i.fim)) / 60) * 60;
  const altura = (fim - inicio) * PX_MIN;
  const y = (min: number) => (min - inicio) * PX_MIN;
  const cols = colunas(itens);
  const pausa = e.pausa_inicio && e.pausa_fim ? [paraMin(e.pausa_inicio), paraMin(e.pausa_fim)] as const : null;
  const ehHoje = grade.dia === diaISO();
  const meiasHoras = Array.from({ length: (fim - inicio) / 30 }, (_, k) => inicio + k * 30);
  const ocupado = (min: number) => itens.some((i) => min < i.fim && min + 30 > i.ini);

  return (
    <View testID="grade-dia">
      {grade.folga ? (
        <Texto variante="bodySm" cor="warning" style={styles.aviso}>⚠ Folga neste dia (fora do seu expediente). Dá para agendar mesmo assim.</Texto>
      ) : !e.definido ? (
        <Texto variante="caption" cor="textMuted" style={styles.aviso}>Horário padrão das 9h às 19h. Cadastre o seu em Mais › Horários.</Texto>
      ) : null}
      <View style={[styles.grade, { height: altura }]}>
        {/* hour labels and lines */}
        {Array.from({ length: (fim - inicio) / 60 + 1 }, (_, k) => inicio + k * 60).map((min) => (
          <View key={min} style={[styles.hora, { top: y(min) }]} pointerEvents="none">
            <Texto variante="caption" cor="textMuted" numero style={styles.rotuloHora}>{paraHora(min)}</Texto>
            <View style={styles.linhaHora} />
          </View>
        ))}
        <View style={styles.trilho}>
          {/* outside working hours and the pause */}
          {expIni > inicio ? <View pointerEvents="none" style={[styles.fora, { top: 0, height: y(expIni) }]} /> : null}
          {expFim < fim ? <View pointerEvents="none" style={[styles.fora, { top: y(expFim), height: altura - y(expFim) }]} /> : null}
          {pausa ? (
            <View pointerEvents="none" style={[styles.pausa, { top: y(pausa[0]), height: (pausa[1] - pausa[0]) * PX_MIN }]}>
              <Texto variante="caption" cor="textMuted">Pausa</Texto>
            </View>
          ) : null}
          {/* free half hours: tap to book */}
          {meiasHoras.filter((min) => !ocupado(min)).map((min) => (
            <Pressable key={min} onPress={() => onVazio(paraHora(min))} accessibilityRole="button"
              accessibilityLabel={`Agendar às ${paraHora(min)}`} testID={`vazio-${paraHora(min)}`}
              style={({ pressed }) => [styles.vazio, { top: y(min), height: 30 * PX_MIN }, pressed ? styles.vazioPressionado : null]} />
          ))}
          {/* bookings */}
          {itens.map(({ item, ini, fim: f }, k) => {
            const { col, total } = cols[k]!;
            const h = Math.max((f - ini) * PX_MIN - 2, MIN_BLOCO);
            const baixo = h < 56;
            return (
              <Pressable key={item.id} testID="agenda-item" onPress={() => onItem(item)} accessibilityRole="button"
                accessibilityLabel={`${formatHora(item.inicio)} a ${formatHora(item.fim)}, ${item.cliente ?? 'sem cliente'}, ${item.servicos ?? ''}, ${formatMoeda(item.valor)}, ${NOME_STATUS[item.status]}`}
                style={({ pressed }) => [styles.bloco, ESTILO[item.status], {
                  top: y(ini) + 1, height: h, left: `${(col / total) * 100}%`, width: `${100 / total}%`,
                }, pressed ? styles.blocoPressionado : null]}>
                {baixo ? (
                  <Texto variante="caption" numberOfLines={1} peso="medium">
                    {formatHora(item.inicio)} {item.cliente ?? 'Sem cliente'} · {item.servicos ?? '—'}
                  </Texto>
                ) : (
                  <>
                    <View style={styles.blocoTopo}>
                      <Texto variante="caption" cor="textMuted" numero style={styles.flex}>
                        {formatHora(item.inicio)} – {formatHora(item.fim)}{item.status !== 'agendado' ? ` · ${NOME_STATUS[item.status]}` : ''}
                      </Texto>
                      <Dinheiro variante="caption" peso="semibold" valor={item.valor} />
                    </View>
                    <Texto peso="semibold" numberOfLines={1}>{item.cliente ?? 'Sem cliente'}</Texto>
                    <Texto variante="caption" cor="textMuted" numberOfLines={1}>{item.servicos ?? '—'}</Texto>
                  </>
                )}
              </Pressable>
            );
          })}
          {ehHoje && agora >= inicio && agora <= fim ? (
            <View pointerEvents="none" style={[styles.agora, { top: y(agora) }]} accessibilityRole="image" accessibilityLabel={`Agora, ${paraHora(agora)}`}>
              <View style={styles.agoraPonto} />
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const ESTILO: Record<Item['status'], object> = {
  agendado: { backgroundColor: color.surfaceStrongSolid, borderLeftColor: color.brand },
  concluido: { backgroundColor: color.brandSoft, borderLeftColor: color.brandLip },
  falta: { backgroundColor: color.surfaceSolid, borderLeftColor: color.warning },
  cancelado: { backgroundColor: color.surfaceSolid, borderLeftColor: color.textMuted },
};

const styles = StyleSheet.create({
  aviso: { marginBottom: space[2] },
  grade: { position: 'relative' },
  hora: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', alignItems: 'flex-start', height: 1 },
  rotuloHora: { width: COLUNA_HORA, marginTop: -8 },
  linhaHora: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: color.border },
  trilho: { position: 'absolute', top: 0, bottom: 0, left: COLUNA_HORA, right: 0 },
  fora: { position: 'absolute', left: 0, right: 0, backgroundColor: color.overlay, opacity: 0.5 },
  pausa: { position: 'absolute', left: 0, right: 0, backgroundColor: color.surface, alignItems: 'center', justifyContent: 'center' },
  vazio: { position: 'absolute', left: 0, right: 0 },
  vazioPressionado: { backgroundColor: color.brandSoft },
  bloco: { position: 'absolute', borderRadius: radius.sm, borderLeftWidth: 4, paddingHorizontal: space[2], paddingVertical: 4, gap: 1, overflow: 'hidden' },
  blocoPressionado: { opacity: 0.8 },
  blocoTopo: { flexDirection: 'row', alignItems: 'center', gap: space[1] },
  flex: { flex: 1 },
  agora: { position: 'absolute', left: -6, right: 0, height: 2, backgroundColor: color.brand, justifyContent: 'center' },
  agoraPonto: { width: 10, height: 10, borderRadius: 5, backgroundColor: color.brand, marginTop: 0 },
});
