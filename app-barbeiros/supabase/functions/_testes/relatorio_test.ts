// Report page (criar_relatorio) and the dates the AI gets in its rules. Run: npm run test:funcoes
import { assert, assertEquals, assertMatch } from 'jsr:@std/assert@1.0.13';

import { datasUteis } from '../_shared/agente.ts';
import { montarRelatorio } from '../_shared/relatorio.ts';

const total = { atendimentos: 7, faturamento: 1234.5, ticket_medio: 176.36, clientes_unicos: 6, servicos_por_atendimento: 2.4,
  dias_com_atendimento: 3, faturamento_medio_por_dia_trabalhado: 411.5, gastos: 100, lucro: 1100, taxas_cartao: 34.5 };

Deno.test('relatório: números do banco em reais, seções pedidas e texto da IA escapado', () => {
  const html = montarRelatorio({
    titulo: 'Relatório <da semana>', barbeiro: 'Daniel', de: '2026-11-16', ate: '2026-11-22', filtro: null,
    secoes: ['resumo', 'comparacao', 'por_dia_da_semana', 'por_servico', 'comandas'], total,
    anterior: { ...total, faturamento: 1000, atendimentos: 7, ticket_medio: 142.86 },
    grupos: { por_dia_da_semana: [{ grupo: 'sábado', atendimentos: 4, faturamento: 800, ticket_medio: 200 }],
      por_servico: [{ grupo: 'Corte', quantidade: 5, faturamento: 225, preco_medio: 45 }] },
    comandas: [{ dia: '2026-11-21', hora: '10:00', cliente: 'Bruno', itens: [{ item: 'Corte', valor: 45 }], total: 45, forma_pagamento: 'pix', status: 'concluido' }],
    analise: 'Sábado foi o melhor dia. <script>x</script>', geradoEm: new Date('2026-11-22T15:00:00Z'),
  });
  assertMatch(html, /R\$ 1\.234,50/);
  assertMatch(html, /▲ 23,4% acima/);
  assertMatch(html, /sábado/);
  assertMatch(html, /16\/11\/2026 a 22\/11\/2026/);
  assert(html.includes('Relatório &lt;da semana&gt;'));
  assert(!html.includes('<script>'));
  assertMatch(html, /Leitura da IA/);
  assertMatch(html, /Bruno/);
});

Deno.test('datas úteis para a IA não errar a conta', () => {
  // Sunday, 22/11/2026: the week started on Monday 16/11.
  const t = datasUteis('2026-11-22');
  assertMatch(t, /ontem 2026-11-21/);
  assertMatch(t, /esta semana 2026-11-16 a 2026-11-22/);
  assertMatch(t, /semana passada 2026-11-09 a 2026-11-15/);
  assertMatch(t, /mês passado 2026-10-01 a 2026-10-31/);
  assertEquals(datasUteis('2026-03-01').includes('mês passado 2026-02-01 a 2026-02-28'), true);
});

Deno.test('texto em stream: nome real de volta sem cortar "Cliente 12" no meio, sem a palavra "thought"', async () => {
  const { criarRevelador } = await import('../_shared/agente.ts');
  const nomes: Record<string, string> = { 'Cliente 12': 'Rafael', 'Cliente 2': 'Bruno' };
  const saida: string[] = [];
  const r = criarRevelador((t) => t.replace(/Cliente \d+/g, (m) => nomes[m] ?? m), (p) => saida.push(p));
  for (const p of ['thou', 'ght', 'Vou marcar o Cli', 'ente 1', '2 e o Cliente 2', ' amanhã. C', 'onfirma?']) r.empurrar(p);
  r.terminar();
  assertEquals(saida.join(''), 'Vou marcar o Rafael e o Bruno amanhã. Confirma?');
  assert(!saida.some((p) => /Cliente|thought/.test(p)));
});
