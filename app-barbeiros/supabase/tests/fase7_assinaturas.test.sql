-- Fase 7: assinatura pela loja (eventos do RevenueCat), tolerância na
-- renovação e o que o app pode ler (pgTAP).
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;
select plan(9);

-- O app não aplica eventos: só o servidor (service_role).
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "b0b0b0b0-0000-4000-8000-000000000002", "role": "authenticated"}', true);
select throws_ok($$ select aplicar_evento_assinatura('{"id": "x", "type": "INITIAL_PURCHASE"}') $$, '42501', null,
                 'app não consegue mudar o próprio plano');
select is(minha_assinatura()->>'plano', 'gratis', 'começa no Grátis');
select is((select count(*) from assinatura_eventos), 0::bigint, 'registro de eventos fechado para o app (RLS)');
reset role;

-- Renovação venceu há 1 hora: a loja ainda pode avisar, o plano continua.
select aplicar_evento_assinatura(jsonb_build_object('id', 'ev-a', 'type', 'RENEWAL', 'app_user_id', 'b0b0b0b0-0000-4000-8000-000000000002',
  'entitlement_ids', '["premium"]'::jsonb, 'product_id', 'barbeiros_premium_anual', 'store', 'PLAY_STORE',
  'expiration_at_ms', (extract(epoch from now() - interval '1 hour') * 1000)::bigint));
select is(plano_efetivo('b0b0b0b0-0000-4000-8000-000000000002'), 'premium'::app_plano, '1 hora depois do vencimento: tolerância da loja');
select is((select periodo || ' ' || loja from app_assinatura where barbeiro_id = 'b0b0b0b0-0000-4000-8000-000000000002'),
          'anual play_store', 'guarda o período e a loja');

update app_assinatura set renova_em = now() - interval '4 hours' where barbeiro_id = 'b0b0b0b0-0000-4000-8000-000000000002';
select is(plano_efetivo('b0b0b0b0-0000-4000-8000-000000000002'), 'gratis'::app_plano, '4 horas sem renovação: volta para o Grátis');

-- Problema de cobrança e evento repetido.
select aplicar_evento_assinatura(jsonb_build_object('id', 'ev-b', 'type', 'BILLING_ISSUE', 'app_user_id', 'b0b0b0b0-0000-4000-8000-000000000002'));
select is((select problema_cobranca from app_assinatura where barbeiro_id = 'b0b0b0b0-0000-4000-8000-000000000002'), true, 'marca o problema de cobrança');
select is(aplicar_evento_assinatura(jsonb_build_object('id', 'ev-b', 'type', 'BILLING_ISSUE', 'app_user_id', 'b0b0b0b0-0000-4000-8000-000000000002'))->>'repetido',
          'true', 'o mesmo evento não é aplicado duas vezes');

-- Plano da conta manual (seed) não tem tolerância: vence na hora. O Barbeiro
-- Teste está na equipe do plano Barbearias, então continua Premium pela equipe.
update app_assinatura set renova_em = now() - interval '1 minute' where barbeiro_id = 'b0b0b0b0-0000-4000-8000-000000000001';
select is(plano_efetivo('b0b0b0b0-0000-4000-8000-000000000001'), 'premium'::app_plano,
          'Plus manual vencido: sem tolerância, mas a equipe do plano Barbearias mantém o Premium');

select * from finish();
rollback;
