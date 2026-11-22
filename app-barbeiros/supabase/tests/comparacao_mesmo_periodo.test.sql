-- Comparações justas (0009): o mês corrente x o mesmo pedaço (dia e hora) do
-- mês passado e a média dos 3 meses anteriores; mês fechado x mês inteiro;
-- semana até o mesmo momento; e o histórico de teste do seed (pgTAP).
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;
select plan(16);

-- Referências calculadas direto em v_atendimento_resumo (como postgres, sem RLS).
create temp table ref as
with p as (select date_trunc('month', hoje_br())::date as m0,
                  (now() at time zone 'America/Sao_Paulo') - (date_trunc('month', hoje_br())::date)::timestamp as decorrido),
jan as (
  select k, ((p.m0 - make_interval(months => k))::date)::timestamp at time zone 'America/Sao_Paulo' as ini,
         least((((p.m0 - make_interval(months => k))::date)::timestamp + p.decorrido) at time zone 'America/Sao_Paulo',
               (((p.m0 - make_interval(months => k))::date + interval '1 month')::timestamp) at time zone 'America/Sao_Paulo') as fim
  from p, generate_series(0, 3) k
)
select k, ini, fim,
       (select sum(valor_total) from v_atendimento_resumo r
         where r.barbeiro_id = 'b0b0b0b0-0000-4000-8000-000000000001' and r.inicio >= jan.ini and r.inicio < jan.fim) as fat,
       (select count(*) from atendimento_itens i join atendimentos a on a.id = i.atendimento_id join servicos s on s.id = i.servico_id
         where a.barbeiro_id = 'b0b0b0b0-0000-4000-8000-000000000001' and a.status = 'concluido' and s.nome = 'Corte'
           and a.inicio >= jan.ini and a.inicio < jan.fim) as cortes
from jan;
-- Semana passada de segunda até o mesmo dia e hora.
create temp table ref_semana as
select (select coalesce(sum(valor_total), 0) from v_atendimento_resumo r
         where r.barbeiro_id = 'b0b0b0b0-0000-4000-8000-000000000001'
           and r.inicio >= ((date_trunc('week', hoje_br())::date - 7)::timestamp at time zone 'America/Sao_Paulo')
           and r.inicio < (now() - interval '7 days')) as fat;
create temp table mensal as
select mes, faturamento, atendimentos, ticket_medio from v_metricas_mes
 where barbeiro_id = 'b0b0b0b0-0000-4000-8000-000000000001';
grant select on ref, ref_semana, mensal to authenticated;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "b0b0b0b0-0000-4000-8000-000000000001", "role": "authenticated"}', true);
create temp table r as select relatorio_mes() as j;
create temp table r_fechado as select relatorio_mes((date_trunc('month', hoje_br()) - interval '1 month')::date) as j;

-- ---------- Mês corrente: até o mesmo dia ----------
select is((select (j->'comparacao'->>'ate_dia')::int from r), extract(day from hoje_br())::int, 'compara até o dia de hoje');
select is((select (j->'anterior'->>'fim')::timestamptz from r), (select fim from ref where k = 1), 'mês passado só até o mesmo dia e hora');
select is((select (j->'anterior'->>'faturamento')::numeric from r), (select fat from ref where k = 1),
          'faturamento do mês passado até o mesmo dia');
select is((select (j->'variacao'->>'faturamento')::numeric from r),
          (select round(((select fat from ref where k = 0) - fat) / fat, 3) from ref where k = 1),
          'variação = mês até hoje x mês passado até o mesmo dia');
select is((select (j->'media'->>'faturamento')::numeric from r), (select round(avg(fat), 2) from ref where k between 1 and 3),
          'média dos 3 meses, cada um até o mesmo dia');
select is((select (j->'vs_media'->>'faturamento')::numeric from r),
          (select round(((select fat from ref where k = 0) - avg(fat)) / avg(fat), 3) from ref where k between 1 and 3),
          'vs média = mês até hoje x média até o mesmo dia');
select is((select (x->>'qtd_mes_anterior')::int from r, jsonb_array_elements(j->'mix_servicos') x where x->>'nome' = 'Corte'),
          (select cortes::int from ref where k = 1), 'mix: cortes do mês passado até o mesmo dia');
select is((select jsonb_array_length(j->'meses') from r), 4, 'gráfico: os 4 meses lado a lado');

-- ---------- Mês fechado: o mês inteiro ----------
select ok((select j->'comparacao'->'ate_dia' = 'null'::jsonb from r_fechado), 'mês fechado compara o mês inteiro');
select is((select (j->'anterior'->>'fim')::timestamptz from r_fechado),
          ((date_trunc('month', hoje_br()) - interval '1 month')::date)::timestamp at time zone 'America/Sao_Paulo',
          'mês fechado: o anterior vai até o fim do mês');

-- ---------- Histórico de teste do seed ----------
select results_eq(
  $$ select faturamento, atendimentos::int, ticket_medio from mensal
      where mes = (date_trunc('month', hoje_br()) - interval '1 month')::date $$,
  $$ values (10150.82::numeric, 51, 199.04::numeric) $$,
  'mês passado: R$ 10.150,82 em 51 atendimentos (ticket ≈ R$ 200)');
select ok((select (select faturamento from mensal where mes = (date_trunc('month', hoje_br()) - interval '3 month')::date) < avg(faturamento)
              and (select faturamento from mensal where mes = (date_trunc('month', hoje_br()) - interval '2 month')::date) > avg(faturamento)
              and abs((select faturamento from mensal where mes = (date_trunc('month', hoje_br()) - interval '1 month')::date) / avg(faturamento) - 1) < 0.03
             from mensal where mes < date_trunc('month', hoje_br())::date),
          'um mês abaixo, um acima e um na média');
select ok((select (j->'variacao'->>'faturamento')::numeric > 0 and (j->'vs_media'->>'faturamento')::numeric > 0 from r)
          or extract(day from hoje_br()) < 3,
          'este mês está no verde nas duas comparações');

-- ---------- Semana até o mesmo dia ----------
select is((resumo_semana()->>'faturamento_anterior')::numeric, (select fat from ref_semana),
          'semana passada só até o mesmo dia e hora');

-- ---------- IA recebe a comparação pronta, sem nomes ----------
select ok(contexto_ia(auth.uid())->'comparacao_mes' ? 'vs_media_faturamento'
          and contexto_ia(auth.uid())::text !~ '(Rafael|Bruno|Carlos|Thiago|1190000)',
          'contexto da IA traz a comparação justa e nenhum nome');

-- ---------- Painel do dono: mesmo pedaço ----------
select set_config('request.jwt.claims', '{"sub": "b0b0b0b0-0000-4000-8000-000000000003", "role": "authenticated"}', true);
select ok((painel_barbearia()->'total'->>'faturamento_anterior')::numeric >= (select fat from ref where k = 1)
          and (painel_barbearia()->'comparacao'->>'ate_dia')::int = extract(day from hoje_br())::int,
          'painel do dono: mês passado da equipe até o mesmo dia');

select * from finish();
rollback;
