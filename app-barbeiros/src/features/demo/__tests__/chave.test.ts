import { describe, expect, it } from '@jest/globals';

import { chaveDaRequisicao, datasRelativas, deslocarDatas } from '../chave';

describe('demo: chaves e datas', () => {
  it('datas da requisição viram relativas a hoje (dia, mês e sem a hora)', () => {
    expect(datasRelativas('p_dia=2026-11-21', '2026-11-20')).toBe('p_dia={D1}');
    expect(datasRelativas('mes=2026-10-01', '2026-11-20')).toBe('mes={M-1}');
    expect(datasRelativas('inicio=gte.2026-11-20T16:30:12.123Z', '2026-11-20')).toBe('inicio=gte.{D0}T*');
  });

  it('a mesma pergunta feita em outro dia dá a mesma chave', () => {
    const gravada = chaveDaRequisicao('POST', 'https://x/rest/v1/rpc/resumo_dia', '{"p_dia":"2026-11-20"}', '2026-11-20');
    const depois = chaveDaRequisicao('POST', 'https://y/rest/v1/rpc/resumo_dia', '{"p_dia":"2026-12-03"}', '2026-12-03');
    expect(depois).toBe(gravada);
  });

  it('ordem dos parâmetros e das chaves do corpo não muda a chave', () => {
    expect(chaveDaRequisicao('get', 'https://x/rest/v1/t?b=2&a=1', null, '2026-11-20'))
      .toBe(chaveDaRequisicao('GET', 'https://x/rest/v1/t?a=1&b=2', '', '2026-11-20'));
    expect(chaveDaRequisicao('POST', 'https://x/rpc/f', '{"b":1,"a":2}', '2026-11-20'))
      .toBe(chaveDaRequisicao('POST', 'https://x/rpc/f', '{"a":2,"b":1}', '2026-11-20'));
  });

  it('respostas andam com o calendário: dias por dias, início de mês por meses', () => {
    const texto = '{"dia":"2026-11-20","inicio":"2026-11-21T18:30:00+00:00","mes":"2026-11-01"}';
    expect(deslocarDatas(texto, '2026-11-20', '2026-12-03'))
      .toBe('{"dia":"2026-12-03","inicio":"2026-12-04T18:30:00+00:00","mes":"2026-12-01"}');
    expect(deslocarDatas(texto, '2026-11-20', '2026-11-20')).toBe(texto);
    expect(deslocarDatas('"2026-12-01"', '2026-11-20', '2027-01-05')).toBe('"2027-02-01"');
  });
});
