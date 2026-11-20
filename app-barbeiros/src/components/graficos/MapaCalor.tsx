// Busiest days and hours (last 90 days): sequential green, empty cells as
// surface. Touch shows "Sex 18h: 4 atendimentos".
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { grafico } from '@/theme/grafico';
import { color, space } from '@/theme/tokens';

import { Texto } from '../Texto';
import { BlocoGrafico } from './BlocoGrafico';

export type CelulaCalor = { dia_semana: number; hora: number; atendimentos: number };

const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export function MapaCalor({ celulas, max, testID }: { celulas: CelulaCalor[]; max: number | null; testID?: string }) {
  const [tocado, setTocado] = useState<CelulaCalor | null>(null);
  const horas = celulas.length
    ? Array.from({ length: Math.max(...celulas.map((c) => c.hora)) - Math.min(...celulas.map((c) => c.hora)) + 1 },
        (_, i) => Math.min(...celulas.map((c) => c.hora)) + i)
    : [];
  const valor = (d: number, h: number) => celulas.find((c) => c.dia_semana === d && c.hora === h)?.atendimentos ?? 0;
  const cor = (v: number) => (v === 0 || !max ? grafico.vazio : grafico.calor[Math.min(4, Math.floor((v / max) * 4.999))]!);
  return (
    <BlocoGrafico
      testID={testID}
      titulo="Dias e horários mais cheios"
      destaque={tocado ? `${DIAS[tocado.dia_semana - 1]} ${tocado.hora}h: ${tocado.atendimentos} atendimento(s)` : null}
      tabela={{ colunas: ['Dia e hora', 'Atendimentos'],
        linhas: [...celulas].sort((a, b) => b.atendimentos - a.atendimentos).map((c) => [`${DIAS[c.dia_semana - 1]} ${c.hora}h`, c.atendimentos]) }}
    >
      {horas.length === 0 ? (
        <Texto variante="bodySm" cor="textMuted">Ainda sem atendimentos nos últimos 90 dias.</Texto>
      ) : (
        <View style={styles.grade}>
          {DIAS.map((dia, i) => (
            <View key={dia} style={styles.linha}>
              <Texto variante="tiny" cor="textMuted" style={styles.dia}>{dia}</Texto>
              {horas.map((h) => {
                const v = valor(i + 1, h);
                return (
                  <Pressable key={h} style={[styles.celula, { backgroundColor: cor(v) }, v === 0 ? styles.vazia : null]}
                    onPress={() => setTocado({ dia_semana: i + 1, hora: h, atendimentos: v })}
                    onHoverIn={() => setTocado({ dia_semana: i + 1, hora: h, atendimentos: v })}
                    accessibilityRole="button" accessibilityLabel={`${dia} ${h} horas: ${v} atendimentos`} />
                );
              })}
            </View>
          ))}
          <View style={styles.linha}>
            <View style={styles.dia} />
            {horas.map((h, i) => (
              <Texto key={h} variante="tiny" cor="textMuted" centro style={styles.hora}>{i % 2 === 0 ? `${h}` : ''}</Texto>
            ))}
          </View>
          <View style={styles.escala}>
            <Texto variante="tiny" cor="textMuted">menos</Texto>
            {grafico.calor.map((c) => <View key={c} style={[styles.amostra, { backgroundColor: c }]} />)}
            <Texto variante="tiny" cor="textMuted">mais</Texto>
          </View>
        </View>
      )}
    </BlocoGrafico>
  );
}

const styles = StyleSheet.create({
  grade: { gap: 2 },
  linha: { flexDirection: 'row', gap: 2, alignItems: 'center' },
  dia: { width: 30 },
  celula: { flex: 1, aspectRatio: 1, borderRadius: 3, maxHeight: 28 },
  vazia: { borderWidth: 1, borderColor: color.border },
  hora: { flex: 1 },
  escala: { flexDirection: 'row', alignItems: 'center', gap: space[1], marginTop: space[2] },
  amostra: { width: 14, height: 14, borderRadius: 3 },
});
