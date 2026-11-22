import { describe, expect, it } from '@jest/globals';

import { falaDeEspera } from '../espera';

describe('fala de espera (enquanto a IA consulta)', () => {
  it('diz o que está fazendo, em uma frase curta', () => {
    expect(falaDeEspera('agenda_do_dia')).toBe('Vou olhar sua agenda.');
    expect(falaDeEspera('analisar')).toBe('Deixa eu calcular.');
    expect(falaDeEspera('criar_relatorio')).toBe('Vou montar o relatório.');
    expect(falaDeEspera('editar_atendimento')).toBe('Vou preparar isso.');
  });
  it('não fala nada no que é instantâneo ou desconhecido', () => {
    expect(falaDeEspera('abrir_tela')).toBeNull();
    expect(falaDeEspera('outra')).toBeNull();
  });
});
