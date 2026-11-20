-- Melhorias de 20/11/2026: calendário (agenda_mes), grade do dia
-- (agenda_grade, o "CRM do agendamento") e a ficha com observações (pgTAP).
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;
select plan(9);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "b0b0b0b0-0000-4000-8000-000000000001", "role": "authenticated"}', true);

select ok(exists (select 1 from agenda_mes() where dia = hoje_br() + 1 and agendados = 1), 'calendário: amanhã tem 1 horário agendado (Bruno)');
select is((select coalesce(sum(concluidos), 0) from agenda_mes())::int,
          (select count(*)::int from atendimentos where barbeiro_id = auth.uid() and status = 'concluido'
             and date_trunc('month', inicio at time zone 'America/Sao_Paulo') = date_trunc('month', hoje_br())),
          'calendário: concluídos do mês batem com os atendimentos');

create temp table g as select agenda_grade(hoje_br() + 1) as j;
select is((select j->'expediente'->>'inicio' from g), '09:00', 'grade: entrada do expediente');
select is((select j->'expediente'->>'pausa_inicio' from g), '12:00', 'grade: pausa do almoço');
select is((select j->>'profissional' from g), 'Barbeiro Teste', 'grade: profissional');
select is((select (j->'itens'->0->>'valor')::numeric from g), 35.00::numeric, 'CRM: valor do horário vem do banco');
select ok((select (j->'itens'->0->>'fim')::timestamptz - (j->'itens'->0->>'inicio')::timestamptz = interval '30 minutes' from g),
          'CRM: fim previsto pela duração do serviço (barba, 30 min)');

-- Outro barbeiro não vê a grade de ninguém (RLS nas funções sem security definer).
select set_config('request.jwt.claims', '{"sub": "b0b0b0b0-0000-4000-8000-000000000002", "role": "authenticated"}', true);
select is(jsonb_array_length(agenda_grade(hoje_br() + 1)->'itens'), 0, 'grade: só os horários do próprio barbeiro');
reset role;

select is((select tecnica_barba from clientes where id = 'c0000000-0000-4000-8000-000000000002'), 'Barba desenhada, contorno na navalha',
          'ficha: técnica da barba no campo novo');

select * from finish();
rollback;
