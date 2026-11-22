-- IA com controle total (22/11/2026): números sob medida, lista de comandas,
-- editar e apagar comanda, relatórios guardados (pgTAP).
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;
select plan(20);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "b0b0b0b0-0000-4000-8000-000000000001", "role": "authenticated"}', true);

-- ---------- Números sob medida ----------
create temp table a as select analisar_periodo(hoje_br() - 3, hoje_br()) as j;
select is((select (j->'total'->>'atendimentos')::int from a),
          (select count(*)::int from atendimentos where barbeiro_id = auth.uid() and status = 'concluido'
             and inicio >= inicio_dia_br(hoje_br() - 3) and inicio < inicio_dia_br(hoje_br() + 1)),
          'análise: atendimentos dos últimos 4 dias batem com as comandas');
select is((select (j->'total'->>'faturamento')::numeric from a),
          (select coalesce(sum(i.valor), 0) from atendimentos t join atendimento_itens i on i.atendimento_id = t.id
            where t.barbeiro_id = auth.uid() and t.status = 'concluido'
              and t.inicio >= inicio_dia_br(hoje_br() - 3) and t.inicio < inicio_dia_br(hoje_br() + 1)),
          'análise: faturamento = soma dos itens');
select is((select (j->'total'->>'ticket_medio')::numeric from a),
          (select round((j->'total'->>'faturamento')::numeric / (j->'total'->>'atendimentos')::int, 2) from a),
          'análise: ticket médio = faturamento / atendimentos');
select is((select (analisar_periodo(date_trunc('month', hoje_br())::date, hoje_br())->'total'->>'faturamento')::numeric),
          (select faturamento from v_metricas_mes where barbeiro_id = auth.uid() and mes = date_trunc('month', hoje_br())::date),
          'análise: o mês até hoje bate com as métricas do mês');
select is((select sum((g->>'faturamento')::numeric) from jsonb_array_elements(analisar_periodo(hoje_br() - 30, hoje_br(), 'dia_da_semana')->'grupos') g),
          (select (analisar_periodo(hoje_br() - 30, hoje_br())->'total'->>'faturamento')::numeric),
          'análise por dia da semana: os grupos somam o total');
select ok((select jsonb_array_length(analisar_periodo(hoje_br() - 30, hoje_br(), 'servico')->'grupos') > 0),
          'análise por serviço: tem linhas');
select is((select (analisar_periodo(hoje_br() - 120, hoje_br(), null, 'c0000000-0000-4000-8000-000000000002')->'total'->>'gastos')),
          null, 'análise com filtro de cliente: gastos não entram');
select throws_ok($$ select analisar_periodo(hoje_br(), hoje_br() - 1) $$, 'P0001', 'período inválido', 'análise: período ao contrário é recusado');
select throws_ok($$ select analisar_periodo(hoje_br() - 1, hoje_br(), 'qualquer') $$, 'P0001', 'agrupamento desconhecido: qualquer', 'análise: agrupamento desconhecido é recusado');

-- ---------- Comandas ----------
create temp table c as
  select (x->>'id')::uuid as id, (x->>'total')::numeric as total
  from jsonb_array_elements(listar_atendimentos(hoje_br() - 30, hoje_br(), null, 'concluido')) x
  where jsonb_array_length(x->'itens') >= 2 limit 1;
select ok((select count(*) = 1 from c), 'lista: acha uma comanda com 2 itens ou mais');

-- Valor total novo: repartido na proporção, centavos no item mais caro.
select lives_ok($$ select editar_atendimento((select id from c), p_valor_total => 199.99) $$, 'editar: novo valor total');
select is((select sum(valor) from atendimento_itens where atendimento_id = (select id from c)), 199.99::numeric, 'editar: itens somam o novo total');

-- Serviços trocados pelo preço cadastrado; forma de pagamento e observação.
select lives_ok($$ select editar_atendimento((select id from c),
  p_servicos => array[(select id from servicos where barbeiro_id = auth.uid() and nome = 'Corte')],
  p_forma => 'credito', p_observacao => 'Ajustado pela IA') $$, 'editar: troca serviços, pagamento e observação');
select is((select sum(valor) from atendimento_itens where atendimento_id = (select id from c) and servico_id is not null), 45.00::numeric,
          'editar: só o corte, pelo preço cadastrado');
select is((select forma_pagamento::text || ' · ' || observacao from atendimentos where id = (select id from c)), 'credito · Ajustado pela IA',
          'editar: pagamento e observação gravados');
select ok((select taxa_cartao > 0 from atendimentos where id = (select id from c)), 'editar: taxa do cartão recalculada');

-- Caixa fechado trava a mudança.
insert into caixas (barbeiro_id, dia, faturamento, atendimentos)
select auth.uid(), (inicio at time zone 'America/Sao_Paulo')::date, 0, 0 from atendimentos where id = (select id from c);
select throws_ok($$ select editar_atendimento((select id from c), p_forma => 'pix') $$, 'P0001',
                 'o caixa desse dia está fechado: reabra o caixa antes de mudar', 'editar: dia com caixa fechado é recusado');
delete from caixas where barbeiro_id = auth.uid();

-- Outro barbeiro não mexe na comanda de ninguém.
select set_config('request.jwt.claims', '{"sub": "b0b0b0b0-0000-4000-8000-000000000002", "role": "authenticated"}', true);
select throws_ok($$ select editar_atendimento((select id from c), p_forma => 'pix') $$, 'P0001', 'comanda não encontrada', 'editar: só as comandas próprias');
select set_config('request.jwt.claims', '{"sub": "b0b0b0b0-0000-4000-8000-000000000001", "role": "authenticated"}', true);

select lives_ok($$ select apagar_atendimento((select id from c)) $$, 'apagar: comanda lançada por engano');

-- ---------- Relatórios guardados (só o dono vê) ----------
insert into relatorios_ia (titulo, periodo, html) values ('Teste', 'novembro', '<html></html>');
select set_config('request.jwt.claims', '{"sub": "b0b0b0b0-0000-4000-8000-000000000002", "role": "authenticated"}', true);
select is((select count(*)::int from relatorios_ia), 0, 'relatórios: outro barbeiro não vê');

reset role;
select * from finish();
rollback;
