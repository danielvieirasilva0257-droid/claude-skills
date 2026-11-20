-- Fase 6: barbearia com dono e equipe, papéis com RLS próprio, convite,
-- plano da equipe, painel, agenda e relatório por barbeiro (pgTAP).
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;
select plan(26);

-- Números de referência calculados direto nas views (como postgres, sem RLS).
create temp table ref as
select (select coalesce(sum(faturamento), 0) from v_metricas_mes
         where barbeiro_id in ('b0b0b0b0-0000-4000-8000-000000000001', 'b0b0b0b0-0000-4000-8000-000000000003')
           and mes = date_trunc('month', hoje_br())::date) as fat_equipe,
       (select faturamento from v_metricas_mes where barbeiro_id = 'b0b0b0b0-0000-4000-8000-000000000001'
           and mes = date_trunc('month', hoje_br())::date) as fat_barbeiro;
grant select on ref to authenticated;

set local role authenticated;

-- ---------- Dono ----------
select set_config('request.jwt.claims', '{"sub": "b0b0b0b0-0000-4000-8000-000000000003", "role": "authenticated"}', true);
select is(meu_plano(), 'barbearias'::app_plano, 'dono está no plano Barbearias');
select is(minha_barbearia()->>'papel', 'dono', 'minha_barbearia diz que ele é o dono');
select is(jsonb_array_length(painel_barbearia()->'equipe'), 2, 'painel mostra os 2 da equipe');
select is((painel_barbearia()->'total'->>'faturamento')::numeric, (select fat_equipe from ref),
          'faturamento da equipe no mês = soma do v_metricas_mes de cada um');
select ok((painel_barbearia()->'hoje'->>'faturamento')::numeric >= 50, 'hoje inclui o corte de R$ 50 do dono');
select ok(exists (select 1 from agenda_equipe() where barbeiro = 'Dono Teste')
          and exists (select 1 from agenda_equipe(hoje_br() + 1) where barbeiro = 'Barbeiro Teste'),
          'agenda da equipe traz o dono (hoje) e o Barbeiro Teste (amanhã)');
select ok(not exists (select 1 from agenda_equipe(hoje_br() + 1) where cliente like '% %')
          and exists (select 1 from agenda_equipe(hoje_br() + 1) where cliente = 'Bruno'),
          'agenda da equipe mostra só o primeiro nome do cliente');
select is((relatorio_barbeiro('b0b0b0b0-0000-4000-8000-000000000001')->'atual'->>'faturamento')::numeric, (select fat_barbeiro from ref),
          'relatório por barbeiro = números do próprio barbeiro');
select ok(relatorio_barbeiro('b0b0b0b0-0000-4000-8000-000000000001')->>'comissao' is not null,
          'relatório traz a comissão pela regra que o barbeiro configurou');
select is((equipe_barbearia()->'assentos'->>'valor_mensal')::numeric, 179.00, 'com 2 barbeiros o plano fica no valor base');
select throws_ok($$ select remover_da_equipe('b0b0b0b0-0000-4000-8000-000000000003') $$, 'P0001',
                 'o dono não sai da própria barbearia: encerre a barbearia', 'dono não remove a si mesmo');
select throws_ok($$ select criar_barbearia('Outra') $$, 'P0001', 'você já faz parte de uma barbearia', 'uma barbearia por vez');
create temp table conv as select gerar_convite() as c;
select matches((select c->>'codigo' from conv), '^[A-HJ-NP-Z2-9]{6}$', 'convite com 6 letras sem I, O, 0 e 1');

-- ---------- Barbeiro da equipe ----------
select set_config('request.jwt.claims', '{"sub": "b0b0b0b0-0000-4000-8000-000000000001", "role": "authenticated"}', true);
select is(minha_barbearia()->>'papel', 'barbeiro', 'o Barbeiro Teste é da equipe');
select throws_ok($$ select painel_barbearia() $$, 'P0001', 'só o dono da barbearia', 'barbeiro não abre o painel do dono');
select throws_ok($$ select relatorio_barbeiro('b0b0b0b0-0000-4000-8000-000000000003') $$, 'P0001', 'só o dono da barbearia',
                 'barbeiro não vê o relatório de outro');
select ok(equipe_barbearia()->'assentos' = 'null'::jsonb and equipe_barbearia()->'membros'->0->'atendimentos_mes' = 'null'::jsonb,
          'barbeiro vê os nomes da equipe, mas não os números nem o valor do plano');
select is((select count(*) from barbearia_convites), 0::bigint, 'convites: só o dono lê (RLS)');
select is((select count(*) from atendimentos where barbeiro_id = 'b0b0b0b0-0000-4000-8000-000000000003'), 0::bigint,
          'as tabelas de cada barbeiro continuam só dele (RLS)');
select throws_ok($$ select plano_efetivo('b0b0b0b0-0000-4000-8000-000000000003') $$, '42501', null,
                 'plano de outro barbeiro não é consultável pelo app');

-- ---------- Barbeiro novo entra com o código ----------
select set_config('request.jwt.claims', '{"sub": "b0b0b0b0-0000-4000-8000-000000000002", "role": "authenticated"}', true);
select throws_ok($$ select criar_barbearia('Minha') $$, 'P0001', 'disponível no plano Barbearias', 'Grátis não cria barbearia');
select lives_ok(format('select entrar_na_barbearia(%L)', lower((select c->>'codigo' from conv))), 'entra com o código (minúsculas valem)');
select is(meu_plano(), 'premium'::app_plano, 'na equipe do plano Barbearias ele usa o app como Premium');

-- Dono vê 3 barbeiros: o 3º paga R$ 39.
select set_config('request.jwt.claims', '{"sub": "b0b0b0b0-0000-4000-8000-000000000003", "role": "authenticated"}', true);
select is((equipe_barbearia()->'assentos'->>'valor_mensal')::numeric, 218.00, 'com 3 barbeiros: R$ 179 + R$ 39');
select remover_da_equipe('b0b0b0b0-0000-4000-8000-000000000002');

select set_config('request.jwt.claims', '{"sub": "b0b0b0b0-0000-4000-8000-000000000002", "role": "authenticated"}', true);
select is(meu_plano(), 'gratis'::app_plano, 'fora da equipe ele volta para o próprio plano');
select throws_ok(format('select entrar_na_barbearia(%L)', (select c->>'codigo' from conv)), 'P0001', 'código inválido ou vencido',
                 'convite é de uso único');

select * from finish();
rollback;
