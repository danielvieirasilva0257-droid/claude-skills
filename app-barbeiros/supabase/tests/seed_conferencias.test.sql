-- Conferências do banco com o seed (pgTAP). Rode: npm run test:db
-- Repete as conferências da ESPECIFICACAO.md seção 5 sobre o seed.sql.
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;
select plan(13);

-- Próximo dia de envio (ter–sáb) às 10h em Brasília: fica sempre 1 a 3 dias
-- à frente, então a mensagem de 3 dias atrás ainda está na mesma semana.
create function pg_temp.proximo_envio() returns timestamptz language sql stable as $$
  select (min(d)::date + time '10:00') at time zone 'America/Sao_Paulo'
  from generate_series((now() at time zone 'America/Sao_Paulo')::date + 1,
                       (now() at time zone 'America/Sao_Paulo')::date + 7, interval '1 day') d
  where extract(isodow from d) between 2 and 6
$$;
create function pg_temp.proximo_domingo() returns timestamptz language sql stable as $$
  select (min(d)::date + time '10:00') at time zone 'America/Sao_Paulo'
  from generate_series((now() at time zone 'America/Sao_Paulo')::date + 1,
                       (now() at time zone 'America/Sao_Paulo')::date + 7, interval '1 day') d
  where extract(isodow from d) = 7
$$;

-- ---------- Comissão ----------
select is(calcular_comissao('b0b0b0b0-0000-4000-8000-000000000001', 16000), 4640.00::numeric,
          'comissão escalonada sobre o total: R$ 16 mil = R$ 4.640');
update regras_comissao set metodo_faixa = 'marginal' where barbeiro_id = 'b0b0b0b0-0000-4000-8000-000000000001';
select is(calcular_comissao('b0b0b0b0-0000-4000-8000-000000000001', 16000), 4140.00::numeric,
          'comissão escalonada marginal: R$ 16 mil = R$ 4.140');
update regras_comissao set metodo_faixa = 'total' where barbeiro_id = 'b0b0b0b0-0000-4000-8000-000000000001';
select results_eq(
  $$ select pct_proxima, falta from proxima_faixa('b0b0b0b0-0000-4000-8000-000000000001', 9000) $$,
  $$ values (0.2700::numeric(5,4), 1000.00::numeric) $$,
  'próxima faixa: faltam R$ 1.000 para 27%');

-- ---------- Ofertas ----------
select results_eq(
  $$ select servico from sugerir_ofertas((select id from atendimentos
       where cliente_id = 'c0000000-0000-4000-8000-000000000002' and status = 'agendado')) $$,
  $$ values ('Sobrancelha'), ('Hidratação'), ('Depilação') $$,
  'Bruno agendado só para barba: sobrancelha (deitado + recorrente), hidratação e depilação');
select results_eq(
  $$ select sum(ofertas)::int, sum(aceitas)::int from v_aceitacao_narrativa where titulo = 'Mesmo tempo' $$,
  $$ values (6, 4) $$,
  'narrativa "Mesmo tempo" fecha 4 de 6 (67%)');

-- ---------- Clientes sumidos ----------
select results_eq(
  $$ select cliente from v_clientes_sumidos $$,
  $$ values ('Carlos Mendes') $$,
  'só o Carlos está sumido');

-- ---------- pode_enviar (LGPD, limites, janela) ----------
select is((select motivo from pode_enviar('c0000000-0000-4000-8000-000000000002', 'marketing', pg_temp.proximo_envio())),
          'sem permissão de marketing (LGPD)', 'Bruno sem permissão de marketing é bloqueado');
select is((select motivo from pode_enviar('c0000000-0000-4000-8000-000000000001', 'marketing', pg_temp.proximo_envio())),
          'limite de marketing (1 por semana, 4 por mês)', 'Rafael já recebeu marketing nesta semana');
select is((select pode from pode_enviar('c0000000-0000-4000-8000-000000000003', 'marketing', pg_temp.proximo_envio())),
          true, 'Carlos com permissão, em dia e horário de envio: pode');
select is((select motivo from pode_enviar('c0000000-0000-4000-8000-000000000003', 'marketing', pg_temp.proximo_domingo())),
          'fora da janela de envio (ter-sáb, 9h-12h ou 18h-20h)', 'domingo é bloqueado');

-- ---------- Segurança ----------
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000ff", "role": "authenticated"}', true);
select is((select count(*) from atendimentos)::int, 0, 'outro barbeiro não vê os atendimentos do seed');
select set_config('request.jwt.claims', '{"sub": "b0b0b0b0-0000-4000-8000-000000000001", "role": "authenticated"}', true);
select is((select sum(atendimentos) from v_metricas_mes)::int, 16, 'o barbeiro do seed vê os 16 atendimentos concluídos');
reset role;

set local role anon;
select throws_ok($$ insert into combos_padrao values ('Corte', 'Pigmentação', 'durante', true, 0, 3, 'x') $$,
                 '42501', null, 'anon não escreve em combos_padrao (migration 0002)');
reset role;

select * from finish();
rollback;
