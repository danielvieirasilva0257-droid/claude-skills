import { describe, expect, it } from '@jest/globals';

import { diaISO, formatDecimal, formatDiaLongo, formatHora, formatInteiro, formatMes, formatMoeda, formatPorcentagem, horarioEm, inicioDoMes, somarDias } from '../format';

// Intl uses a non-breaking space between "R$" and the number.
const semNbsp = (t: string) => t.replace(/ /g, ' ');

describe('format', () => {
  it('moeda em reais, aceitando o numeric do Postgres como texto', () => {
    expect(semNbsp(formatMoeda('1234.5'))).toBe('R$ 1.234,50');
    expect(semNbsp(formatMoeda(90))).toBe('R$ 90,00');
    expect(formatMoeda(null)).toBe('—');
    expect(formatMoeda('abc')).toBe('—');
  });

  it('porcentagem a partir da fração do banco', () => {
    expect(semNbsp(formatPorcentagem('0.667'))).toBe('66,7%');
    expect(semNbsp(formatPorcentagem(0))).toBe('0%');
  });

  it('inteiro e decimal no padrão brasileiro', () => {
    expect(formatInteiro(16000)).toBe('16.000');
    expect(formatDecimal('2.4')).toBe('2,4');
    expect(formatDecimal(undefined)).toBe('—');
  });

  it('início do mês no horário de Brasília (o dia 1 às 01h UTC ainda é o mês anterior lá)', () => {
    expect(inicioDoMes(new Date('2026-11-01T01:00:00Z'))).toBe('2026-10-01');
    expect(inicioDoMes(new Date('2026-11-01T03:00:00Z'))).toBe('2026-11-01');
  });

  it('nome do mês por extenso', () => {
    expect(formatMes('2026-11-01')).toBe('novembro de 2026');
    expect(formatMes('2026-01-01')).toBe('janeiro de 2026');
  });

  it('dia e hora no fuso do barbeiro (23h em Brasília já é o dia seguinte em UTC)', () => {
    expect(diaISO(new Date('2026-11-21T01:30:00Z'))).toBe('2026-11-20');
    expect(formatHora('2026-11-21T01:30:00Z')).toBe('22:30');
  });

  it('somar dias atravessa o mês e o ano sem depender do fuso', () => {
    expect(somarDias('2026-11-30', 1)).toBe('2026-12-01');
    expect(somarDias('2026-12-31', 1)).toBe('2027-01-01');
    expect(somarDias('2026-03-01', -1)).toBe('2026-02-28');
  });

  it('dia por extenso sem "-feira" e horário marcado em −03:00', () => {
    expect(formatDiaLongo('2026-11-20')).toBe('sexta, 20 de novembro');
    expect(horarioEm('2026-11-20', '09:30')).toBe('2026-11-20T09:30:00-03:00');
  });
});
