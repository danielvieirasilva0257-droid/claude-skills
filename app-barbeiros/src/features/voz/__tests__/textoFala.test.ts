import { describe, expect, it } from '@jest/globals';

import { porExtenso, textoParaFala } from '../textoFala';
import { wavPcm16 } from '../wav';

describe('números por extenso (pt-BR)', () => {
  it('regras do "e" e das centenas', () => {
    expect(porExtenso(0)).toBe('zero');
    expect(porExtenso(100)).toBe('cem');
    expect(porExtenso(101)).toBe('cento e um');
    expect(porExtenso(1500)).toBe('mil e quinhentos');
    expect(porExtenso(2050)).toBe('dois mil e cinquenta');
    expect(porExtenso(7466)).toBe('sete mil quatrocentos e sessenta e seis');
    expect(porExtenso(1_000_000)).toBe('um milhão');
    expect(porExtenso(2_300_000)).toBe('dois milhões e trezentos mil');
  });
  it('feminino para horas', () => {
    expect(porExtenso(1, 'f')).toBe('uma');
    expect(porExtenso(22, 'f')).toBe('vinte e duas');
  });
});

describe('texto para a voz', () => {
  it('dinheiro, porcentagem e plural', () => {
    expect(textoParaFala('No mês você faturou R$ 7.466,39 em 37 atendimento(s).'))
      .toBe('No mês você faturou sete mil quatrocentos e sessenta e seis reais e trinta e nove centavos em trinta e sete atendimentos.');
    expect(textoParaFala('Até o dia 21: 8,2% acima do mês passado e 9% acima da média.'))
      .toBe('Até o dia vinte e um: oito vírgula dois por cento acima do mês passado e nove por cento acima da média.');
    expect(textoParaFala('Corte R$ 45,00 · Barba R$ 1,00')).toBe('Corte quarenta e cinco reais, Barba um real');
    expect(textoParaFala('Seu faturamento no mês foi de 7563.38 reais.'))
      .toBe('Seu faturamento no mês foi de sete mil quinhentos e sessenta e três reais e trinta e oito centavos.');
  });
  it('horas e datas', () => {
    expect(textoParaFala('Amanhã você tem 18:30 Bruno (Barba).')).toBe('Amanhã você tem dezoito e trinta Bruno (Barba).');
    expect(textoParaFala('Agendar Bruno · domingo, 22/11 às 10:00')).toBe('Agendar Bruno, domingo, vinte e dois de novembro às dez horas');
    expect(textoParaFala('às 1h e no dia 1/12')).toBe('às uma hora e no dia primeiro de dezembro');
  });
  it('decimal e "Cliente N"', () => {
    expect(textoParaFala('Ratio 3,08 · Cliente 2')).toBe('Ratio três vírgula zero oito, Cliente dois');
  });
});

describe('WAV', () => {
  it('cabeçalho de 44 bytes e amostras em 16 bits', () => {
    const w = wavPcm16(new Float32Array([0, 1, -1]), 44100);
    expect(w.length).toBe(44 + 6);
    expect(String.fromCharCode(...w.slice(0, 4))).toBe('RIFF');
    const v = new DataView(w.buffer);
    expect(v.getUint32(24, true)).toBe(44100);
    expect(v.getInt16(46, true)).toBe(32767);
    expect(v.getInt16(48, true)).toBe(-32768);
  });
});
