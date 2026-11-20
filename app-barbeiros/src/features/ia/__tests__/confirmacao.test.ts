import { describe, expect, it } from '@jest/globals';

import { respostaDeConfirmacao } from '../confirmacao';

describe('confirmação falada', () => {
  it('"sim", "pode", "confirma" confirmam (com ou sem acento e pontuação)', () => {
    for (const f of ['Sim', 'pode sim!', 'Confirma', 'beleza, pode', 'Fechado.']) expect(respostaDeConfirmacao(f)).toBe('sim');
  });
  it('"não", "cancela", "esquece" cancelam', () => {
    for (const f of ['Não', 'nao, deixa', 'Cancela', 'esquece isso']) expect(respostaDeConfirmacao(f)).toBe('nao');
  });
  it('outra frase não confirma nem cancela (vira um novo pedido)', () => {
    expect(respostaDeConfirmacao('marca o Rafael sábado às 9')).toBeNull();
    expect(respostaDeConfirmacao('simplesmente me diz a agenda')).toBeNull();
  });
});
