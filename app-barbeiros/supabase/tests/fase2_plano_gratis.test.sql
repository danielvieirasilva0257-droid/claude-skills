-- Fase 2: cadastro, plano, onboarding, lançamento, ofertas e caixa (pgTAP).
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;
select plan(16);

-- ---------- Cadastro cria barbeiro e plano Grátis ----------
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, raw_user_meta_data,
                        created_at, updated_at, confirmation_token, recovery_token, email_change, email_change_token_new)
values ('00000000-0000-0000-0000-000000000000', 'b0b0b0b0-0000-4000-8000-0000000000aa', 'authenticated', 'authenticated',
        'novo@example.com', '', '{"nome": "Zé da Navalha"}', now(), now(), '', '', '', '');
select is((select nome from barbeiros where id = 'b0b0b0b0-0000-4000-8000-0000000000aa'), 'Zé da Navalha',
          'cadastro cria a linha em barbeiros com o nome');
select is((select plano from app_assinatura where barbeiro_id = 'b0b0b0b0-0000-4000-8000-0000000000aa'), 'gratis'::app_plano,
          'cadastro começa no plano Grátis');

-- ---------- Plano ----------
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "b0b0b0b0-0000-4000-8000-000000000001", "role": "authenticated"}', true);
select is(meu_plano(), 'plus'::app_plano, 'barbeiro do seed está no Premium Plus');
update app_assinatura set plano = 'gratis' where barbeiro_id = auth.uid();
select is(meu_plano(), 'plus'::app_plano, 'o barbeiro não consegue mudar o próprio plano');

select set_config('request.jwt.claims', '{"sub": "b0b0b0b0-0000-4000-8000-000000000002", "role": "authenticated"}', true);
select is(meu_plano(), 'gratis'::app_plano, 'barbeiro novo está no Grátis');
update app_assinatura set plano = 'plus' where barbeiro_id = auth.uid();
select is(meu_plano(), 'gratis'::app_plano, 'nem para subir de plano por conta própria');

-- ---------- Onboarding ----------
select is(publico_por_preco(45), 'C'::publico_tipo, 'corte de R$ 45 sugere público C');
select is(publico_por_preco(120), 'A'::publico_tipo, 'corte de R$ 120 sugere público A');
select is(configurar_inicio(50, 'C', 'aluguel_cadeira', 'volume'), 7, 'onboarding cria os 7 serviços padrão');
select results_eq($$ select preco from servicos where barbeiro_id = auth.uid() and nome in ('Corte', 'Barba') order by nome $$,
                  $$ values (40.00::numeric(10,2)), (50.00::numeric(10,2)) $$,
                  'preços proporcionais ao corte (barba = 80%)');
select is((select count(*)::int from combinacoes_servico where barbeiro_id = auth.uid()), 7, 'combos padrão copiados');

-- ---------- Lançar em 2 toques, ofertar, fechar caixa ----------
update barbeiros set taxa_credito = 0.03 where id = auth.uid();
create temp table t_at as
  select lancar_atendimento(array[(select id from servicos where barbeiro_id = auth.uid() and nome = 'Corte')],
                            null, 'credito') as id;
select is((select taxa_cartao from atendimentos where id = (select id from t_at)), 1.50::numeric(10,2),
          'taxa do crédito calculada pelo banco (3% de R$ 50)');
select lives_ok($$ select registrar_oferta((select id from t_at), true,
                     (select id from servicos where barbeiro_id = auth.uid() and nome = 'Hidratação')) $$,
                'oferta aceita entra no atendimento');
select is((select simultaneo from atendimento_itens i join servicos s on s.id = i.servico_id
            where i.atendimento_id = (select id from t_at) and s.nome = 'Hidratação'), true,
          'hidratação junto do corte é marcada como simultânea (combo padrão)');
select is((select faturamento from resumo_dia()), 78.00::numeric, 'resumo do dia: R$ 50 + R$ 28');
select fechar_caixa();
select throws_ok($$ select lancar_atendimento(array[(select id from servicos where barbeiro_id = auth.uid() and nome = 'Corte')]) $$,
                 'P0001', 'o caixa deste dia já foi fechado', 'depois de fechar o caixa, não lança no mesmo dia');

select * from finish();
rollback;
