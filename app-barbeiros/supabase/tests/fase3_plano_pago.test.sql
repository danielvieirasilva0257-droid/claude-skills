-- Fase 3: financeiro, meta, conquistas, comissão, MEI, sinais e uso da IA (pgTAP).
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;
select plan(15);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "b0b0b0b0-0000-4000-8000-000000000001", "role": "authenticated"}', true);

-- Financeiro: o total bate com v_metricas_mes (mesmo cálculo, dois caminhos).
select is((select faturamento from financeiro(date_trunc('month', hoje_br())::date, hoje_br(), 'total')),
          (select faturamento from v_metricas_mes where barbeiro_id = auth.uid() and mes = date_trunc('month', hoje_br())::date),
          'financeiro do mês = v_metricas_mes');
select is((select count(*)::int from financeiro(hoje_br() - 6, hoje_br(), 'day')), 7, 'financeiro por dia devolve os 7 dias, mesmo sem movimento');

-- Meta: o faturamento do mês é 62,5% de uma meta 1,6 vez maior; o que falta,
-- em cortes de R$ 45, é arredondado para cima.
create temp table fat as select coalesce((select faturamento from v_metricas_mes where barbeiro_id = auth.uid()
                                           and mes = date_trunc('month', hoje_br())::date), 0) as v;
select definir_meta(date_trunc('month', hoje_br())::date, (select v * 1.6 from fat));
select is((progresso_meta()->>'pct')::numeric, 0.625, 'meta: 62,5% feita');
select is((progresso_meta()->>'cortes_faltando')::int, (select ceil((round(v * 1.6, 2) - v) / 45)::int from fat), 'meta: cortes que faltam');
select ok(exists (select 1 from verificar_conquistas() where tipo = 'meta_50'), 'passou de 50%: conquista meta_50');
select celebrar_conquista('meta_50', to_char(hoje_br(), 'YYYY-MM'));
select ok(not exists (select 1 from verificar_conquistas() where tipo = 'meta_50'), 'depois de comemorar, não aparece de novo');

-- Comissão: faixas precisam emendar; regra fixa de 40% sobre R$ 1.000 = R$ 400.
select throws_ok($$ select salvar_regra_comissao('escalonada', 'total', 'bruto', null, 0, 0,
                    '[{"de": 0, "ate": 1000, "pct": 0.3}, {"de": 2000, "ate": null, "pct": 0.4}]') $$,
                 'P0001', 'as faixas precisam emendar uma na outra', 'faixas com buraco são recusadas');
select lives_ok($$ select salvar_regra_comissao('fixa', 'total', 'bruto', 0.40, 0.10, 0) $$, 'regra fixa salva');
select is(calcular_comissao(auth.uid(), 1000), 400.00::numeric, 'fixa 40% de R$ 1.000 = R$ 400');

-- MEI: limite e DAS vêm da tabela de parâmetros.
select is((mei_ano(2026)->>'limite')::numeric, 81000.00::numeric, 'MEI: limite de R$ 81 mil');
select is((mei_ano(2026)->>'das_mensal')::numeric, 86.05::numeric, 'MEI: DAS de serviços 2026 = R$ 86,05');

-- Sinais para a IA: números prontos e nenhum nome de cliente.
select ok(sinais_insights(auth.uid())::text like '%clientes_sumidos%', 'sinal de clientes sumidos (Carlos)');
select ok(sinais_insights(auth.uid())::text !~ '(Rafael|Bruno|Carlos|1190000)' and contexto_ia(auth.uid())::text !~ '(Rafael|Bruno|Carlos|1190000)',
          'sinais e contexto da IA sem nome nem telefone de cliente');

-- Uso da IA: o Grátis não usa; ninguém gasta o saldo de outro.
select set_config('request.jwt.claims', '{"sub": "b0b0b0b0-0000-4000-8000-000000000002", "role": "authenticated"}', true);
select is(consumir_ia(auth.uid(), 'chat')->>'motivo', 'plano', 'plano Grátis não usa a IA');
select throws_ok($$ select consumir_ia('b0b0b0b0-0000-4000-8000-000000000001', 'chat') $$, 'P0001', 'sem permissão',
                 'não dá para gastar o saldo de IA de outro barbeiro');

select * from finish();
rollback;
