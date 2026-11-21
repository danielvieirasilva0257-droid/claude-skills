-- Fases 4 e 5: horários livres, automações por pode_enviar, lista de espera,
-- envio, Instagram e funil (pgTAP).
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;
select plan(12);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "b0b0b0b0-0000-4000-8000-000000000001", "role": "authenticated"}', true);

-- Horários livres: amanhã às 18h30 o Bruno já ocupa a cadeira.
select ok(not exists (select 1 from horarios_livres(auth.uid(), (now() at time zone 'America/Sao_Paulo')::date + 1, 30) h
                      where (h.inicio at time zone 'America/Sao_Paulo')::time = '18:30'),
          'horário do Bruno (amanhã 18h30) não aparece como livre');
-- A pausa é de terça a sábado (domingo é só de manhã): o próximo dia útil.
select ok(not exists (select 1 from horarios_livres(auth.uid(), (select min(d)::date from generate_series(hoje_br() + 1, hoje_br() + 7, interval '1 day') d where extract(isodow from d) between 2 and 6), 30) h
                      where (h.inicio at time zone 'America/Sao_Paulo')::time between '12:00' and '12:45'),
          'a pausa do almoço não vira horário');

-- Automações: R4 para o Bruno (amanhã), R9 para o Carlos (sumido); tudo por pode_enviar.
reset role;
select ok(planejar_automacoes('b0b0b0b0-0000-4000-8000-000000000001') >= 2, 'planejou as automações do dia');
select is((select status from mensagens_fila where estrategia = 'R4' and cliente_id = 'c0000000-0000-4000-8000-000000000002'),
          'pendente', 'confirmação D-1 do Bruno pronta para sair');
select ok(exists (select 1 from mensagens_fila where estrategia = 'R9' and cliente_id = 'c0000000-0000-4000-8000-000000000003'),
          'reativação do Carlos planejada (pendente ou bloqueada com motivo)');
select ok(not exists (select 1 from mensagens_fila where status = 'bloqueada' and motivo is null), 'toda mensagem bloqueada diz o porquê');
select is(planejar_automacoes('b0b0b0b0-0000-4000-8000-000000000001'), 0, 'rodar de novo no mesmo dia não duplica');

-- Lista de espera (V1): cancelar o horário do Rafael avisa o Carlos.
update atendimentos set status = 'cancelado'
 where cliente_id = 'c0000000-0000-4000-8000-000000000001' and status = 'agendado';
select is((select status from lista_espera where cliente_id = 'c0000000-0000-4000-8000-000000000003'), 'avisado'::status_espera,
          'quem estava na lista de espera foi avisado');

-- Envio: registra em contatos_enviados.
select registrar_envio((select id from mensagens_fila where estrategia = 'R4' limit 1), true);
select ok(exists (select 1 from contatos_enviados where estrategia = 'R4'), 'envio registrado em contatos_enviados');

-- Instagram: 1 resposta privada por comentário.
select is((select pode from pode_responder_instagram((select id from instagram_eventos limit 1))), true, 'comentário de ontem pode receber resposta privada');
update instagram_eventos set resposta_privada_em = now();
select is((select motivo from pode_responder_instagram((select id from instagram_eventos limit 1))), 'já respondeu este comentário',
          'segunda resposta ao mesmo comentário é bloqueada');

-- Segredos dos canais nunca chegam ao app.
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "b0b0b0b0-0000-4000-8000-000000000001", "role": "authenticated"}', true);
select is((select count(*)::int from canais_segredos), 0, 'tokens dos canais não são lidos pelo app');

select * from finish();
rollback;
