import { describe, expect, it } from '@jest/globals';

import { formatDecimal, formatInteiro, formatMes, formatMoeda, formatPorcentagem, inicioDoMes } from '../format';

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
});
