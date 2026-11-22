import { describe, expect, it } from '@jest/globals';

import { ATALHOS } from '../../features/conta/atalhos';
import { libera, limiteMensagensMarketing, NOME_PLANO, planoNecessario, PRECO_PLANO, type Plano, type Recurso } from '../plano';

const PLANOS: Plano[] = ['gratis', 'pago', 'premium', 'plus', 'barbearias'];

describe('plano', () => {
  it('Grátis libera só a agenda, os lançamentos, os serviços e o perfil', () => {
    expect(libera('gratis', 'agenda')).toBe(true);
    expect(libera('gratis', 'servicos')).toBe(true);
    expect(libera('gratis', 'clientes')).toBe(false);
    expect(libera('gratis', 'relatorios')).toBe(false);
  });

  it('cada plano libera tudo do plano de baixo (Pago ⊂ Premium ⊂ Plus)', () => {
    const recursos: Recurso[] = ['agenda', 'clientes', 'relatorios', 'chat', 'mei', 'whatsapp', 'automacoes', 'instagram', 'prospeccao'];
    for (const r of recursos) {
      if (libera('pago', r)) expect(libera('premium', r)).toBe(true);
      if (libera('premium', r)) expect(libera('plus', r)).toBe(true);
    }
  });

  it('Premium tem WhatsApp, mas Instagram e prospecção só no Plus', () => {
    expect(libera('premium', 'whatsapp')).toBe(true);
    expect(libera('premium', 'instagram')).toBe(false);
    expect(libera('plus', 'instagram')).toBe(true);
    expect(libera('plus', 'prospeccao')).toBe(true);
  });

  it('Barbearias: tudo do Premium para a equipe e o painel do dono (sem o Instagram do Plus)', () => {
    expect(libera('barbearias', 'whatsapp')).toBe(true);
    expect(libera('barbearias', 'barbearia')).toBe(true);
    expect(libera('barbearias', 'instagram')).toBe(false);
    expect(libera('plus', 'barbearia')).toBe(false);
  });

  it('o cadeado mostra o plano mais barato que libera a tela', () => {
    expect(planoNecessario('clientes')).toBe('pago');
    expect(planoNecessario('whatsapp')).toBe('premium');
    expect(planoNecessario('instagram')).toBe('plus');
    expect(planoNecessario('barbearia')).toBe('barbearias');
  });

  it('100 mensagens de marketing por mês a partir do Premium; nenhuma antes', () => {
    expect(limiteMensagensMarketing('gratis')).toBe(0);
    expect(limiteMensagensMarketing('pago')).toBe(0);
    expect(limiteMensagensMarketing('premium')).toBe(100);
    expect(limiteMensagensMarketing('barbearias')).toBe(100);
  });

  it('todo plano tem nome e preço com renovação escrita', () => {
    for (const p of PLANOS) {
      expect(NOME_PLANO[p].length).toBeGreaterThan(0);
      expect(PRECO_PLANO[p]).toMatch(/^R\$ /);
    }
  });

  it('cada atalho do Mais aponta para um recurso que algum plano pago libera', () => {
    for (const a of ATALHOS) expect(PLANOS.some((p) => p !== 'gratis' && libera(p, a.recurso))).toBe(true);
  });

  it('conta de desenvolvedor libera tudo, inclusive o painel do dono, e não é vendida', () => {
    for (const a of ATALHOS) expect(libera('dev', a.recurso)).toBe(true);
    for (const r of ['instagram', 'personalidade', 'barbearia', 'whatsapp', 'clientes'] as Recurso[]) expect(libera('dev', r)).toBe(true);
    expect(NOME_PLANO.dev).toBe('Desenvolvedor');
    expect(limiteMensagensMarketing('dev')).toBe(100);
    expect(planoNecessario('barbearia')).toBe('barbearias');
  });

  it('plano desconhecido (servidor mais novo) não derruba o app: só não libera', () => {
    expect(libera('outro' as Plano, 'agenda')).toBe(false);
  });
});
