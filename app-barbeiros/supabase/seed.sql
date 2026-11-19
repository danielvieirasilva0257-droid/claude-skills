-- =====================================================================
-- Seed de desenvolvimento do App Barbeiros (Fase 0)
-- Roda depois das migrations em `npx supabase db reset`.
--
-- 1 barbeiro (com login de teste), 7 serviços, 2 produtos, combos padrão,
-- 6 narrativas, 3 clientes, 3 meses de atendimentos e ofertas, comissão
-- escalonada, vale, gastos, permissões e 1 mensagem enviada.
--
-- As datas são relativas a HOJE (horário de Brasília): o seed sempre tem
-- "este mês" e "3 meses para trás", não importa quando rodar.
--
-- Logins de teste (só no banco local, nunca em produção), senha senha-teste-123:
--   barbeiro.teste@example.com  (Premium Plus, com 3 meses de dados)
--   gratis.teste@example.com    (Grátis, sem onboarding)
--
-- Histórias que os dados contam (úteis para os testes da Fase 8):
--   Rafael (C1): volta a cada 10 dias, faz corte; hidratação é recorrente
--                para ele (20 dias). Próximo horário daqui a 2 dias.
--   Bruno  (C2): volta a cada 21 dias, corte + barba. Agendado amanhã só
--                para barba: sugerir_ofertas deve trazer sobrancelha
--                (cliente deitado + recorrente), hidratação e depilação
--                (recorrentes "na hora").
--   Carlos (C3): veio 3 vezes, faltou e sumiu: aparece em v_clientes_sumidos.
--   Narrativa "Mesmo tempo" (hidratação): 6 ofertas, 4 aceitas (67%).
--   Comissão escalonada 25% / 27% / 29%: R$ 16 mil = R$ 4.640 (total)
--   e R$ 4.140 (marginal).
-- =====================================================================

-- ---------- Atalhos só desta sessão (pg_temp some no fim) ----------

-- Hoje no horário de Brasília (não depende do fuso da sessão).
create function pg_temp.hoje() returns date
language sql stable as $$ select (now() at time zone 'America/Sao_Paulo')::date $$;

-- Data/hora relativa a hoje, no horário de Brasília.
create function pg_temp.quando(dias int, hora time) returns timestamptz
language sql stable as $$
  select ((pg_temp.hoje() + dias) + hora) at time zone 'America/Sao_Paulo'
$$;

-- Lança um atendimento com seus itens e as ofertas feitas nele.
--   servicos: o que o cliente veio fazer (nomes dos serviços)
--   ofertas:  [{"item": "Hidratação", "narrativa": "Mesmo tempo", "aceitou": true}]
--             item aceito entra como atendimento_itens.veio_de_oferta = true
--   agendou_dias_antes: quando o horário foi marcado (conta para reagendamento)
create function pg_temp.atendimento(
  p_cliente uuid, p_dias int, p_hora time, p_servicos text[],
  p_ofertas jsonb default '[]',
  p_pagamento forma_pagamento default 'pix',
  p_status status_atendimento default 'concluido',
  p_agendou_dias_antes int default 2
) returns uuid language plpgsql as $$
declare
  v_barbeiro constant uuid := 'b0b0b0b0-0000-4000-8000-000000000001';
  v_id uuid := gen_random_uuid();
  v_inicio timestamptz := pg_temp.quando(p_dias, p_hora);
  v_nome text;
  v_oferta jsonb;
  v_servico servicos%rowtype;
  v_produto produtos%rowtype;
  v_narrativa narrativas%rowtype;
  v_simultaneo boolean;
  v_minutos int := 0;
  v_total numeric := 0;
begin
  insert into atendimentos (id, barbeiro_id, cliente_id, inicio, status, forma_pagamento, criado_em)
  values (v_id, v_barbeiro, p_cliente, v_inicio, p_status,
          case when p_status = 'concluido' then p_pagamento end,
          v_inicio - make_interval(days => p_agendou_dias_antes));

  foreach v_nome in array p_servicos loop
    select * into strict v_servico from servicos where barbeiro_id = v_barbeiro and nome = v_nome;
    insert into atendimento_itens (atendimento_id, servico_id, valor)
    values (v_id, v_servico.id, v_servico.preco);
    v_minutos := v_minutos + v_servico.duracao_min;
    v_total := v_total + v_servico.preco;
  end loop;

  if p_status = 'concluido' then
    for v_oferta in select * from jsonb_array_elements(p_ofertas) loop
      select * into v_servico from servicos where barbeiro_id = v_barbeiro and nome = v_oferta->>'item';
      if not found then
        select * into strict v_produto from produtos where barbeiro_id = v_barbeiro and nome = v_oferta->>'item';
      end if;
      select * into strict v_narrativa from narrativas
       where barbeiro_id = v_barbeiro and titulo = v_oferta->>'narrativa';

      -- simultâneo = combo marcado como "ao mesmo tempo" com algo que já está no atendimento
      v_simultaneo := v_servico.id is not null and exists (
        select 1 from combinacoes_servico cb
        join servicos sb on sb.id = cb.servico_base_id
        where cb.servico_extra_id = v_servico.id and cb.simultaneo and sb.nome = any (p_servicos));

      insert into ofertas (barbeiro_id, atendimento_id, cliente_id, servico_id, produto_id, narrativa_id,
                           momento, simultaneo, aceitou, motivo_recusa, criado_em)
      values (v_barbeiro, v_id, p_cliente, v_servico.id, v_produto.id, v_narrativa.id,
              v_narrativa.momento, v_simultaneo, (v_oferta->>'aceitou')::boolean,
              (v_oferta->>'motivo')::motivo_recusa, v_inicio + interval '15 minutes');

      if (v_oferta->>'aceitou')::boolean then
        if v_servico.id is not null then
          insert into atendimento_itens (atendimento_id, servico_id, valor, simultaneo, veio_de_oferta)
          values (v_id, v_servico.id, v_servico.preco, v_simultaneo, true);
          v_minutos := v_minutos + case when v_simultaneo then 0 else v_servico.duracao_min end;
          v_total := v_total + v_servico.preco;
        else
          insert into atendimento_itens (atendimento_id, produto_id, valor, veio_de_oferta)
          values (v_id, v_produto.id, v_produto.preco, true);
          v_total := v_total + v_produto.preco;
        end if;
      end if;
      v_servico := null; v_produto := null;
    end loop;
  end if;

  update atendimentos
     set fim = case when p_status = 'concluido' then v_inicio + make_interval(mins => v_minutos) end,
         taxa_cartao = case when p_status = 'concluido' then
                         round(v_total * case p_pagamento when 'debito' then 0.0150
                                                          when 'credito' then 0.0320 else 0 end, 2)
                       else 0 end
   where id = v_id;
  return v_id;
end $$;

-- ---------- Logins de teste (auth.users + identidade de e-mail) ----------
-- O gatilho criar_barbeiro_do_usuario (0003) cria a linha em barbeiros e o
-- plano Grátis; aqui só completamos o perfil e o plano.
create function pg_temp.criar_usuario(p_id uuid, p_email text, p_senha text, p_nome text) returns void
language sql as $$
  insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change, email_change_token_new)
  values ('00000000-0000-0000-0000-000000000000', p_id, 'authenticated', 'authenticated', p_email,
    extensions.crypt(p_senha, extensions.gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}', jsonb_build_object('nome', p_nome),
    now() - interval '120 days', now(), '', '', '', '');
  insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  values (gen_random_uuid(), p_id, p_id,
    jsonb_build_object('sub', p_id, 'email', p_email, 'email_verified', true), 'email', now(), now(), now());
$$;

-- Barbeiro principal (todos os dados abaixo), no plano Premium Plus para ver todas as telas.
select pg_temp.criar_usuario('b0b0b0b0-0000-4000-8000-000000000001', 'barbeiro.teste@example.com', 'senha-teste-123', 'Barbeiro Teste');
-- Barbeiro novo no Grátis, sem onboarding: testa o primeiro uso e as telas bloqueadas.
select pg_temp.criar_usuario('b0b0b0b0-0000-4000-8000-000000000002', 'gratis.teste@example.com', 'senha-teste-123', 'Novo Barbeiro');

-- ---------- Barbeiro ----------
update barbeiros set nome = 'Barbeiro Teste', cidade = 'São Paulo', modelo_trabalho = 'comissionado', publico = 'C',
       estrategia = 'equilibrado', preco_corte = 45.00, dias_trabalho_semana = 6, horas_dia = 9,
       intervalo_retorno_padrao_dias = 21, pct_visitas_com_extra_alvo = 0.5,
       filosofia_atendimento = 'Atender sempre como se fosse a primeira vez.', criado_em = now() - interval '120 days',
       onboarding_concluido = true, taxa_debito = 0.0150, taxa_credito = 0.0320
 where id = 'b0b0b0b0-0000-4000-8000-000000000001';
update app_assinatura set plano = 'plus', status = 'ativa', periodo = 'mensal', provedor = 'manual',
       renova_em = now() + interval '30 days'
 where barbeiro_id = 'b0b0b0b0-0000-4000-8000-000000000001';

-- ---------- 7 serviços e 2 produtos ----------
insert into servicos (barbeiro_id, nome, categoria, preco, duracao_min, custo_insumo, intervalo_recomendado_dias) values
  ('b0b0b0b0-0000-4000-8000-000000000001', 'Corte',           'principal', 45.00, 40, 1.50, null),
  ('b0b0b0b0-0000-4000-8000-000000000001', 'Barba',           'principal', 35.00, 30, 2.00, null),
  ('b0b0b0b0-0000-4000-8000-000000000001', 'Hidratação',      'adicional', 25.00, 15, 4.00, 21),
  ('b0b0b0b0-0000-4000-8000-000000000001', 'Sobrancelha',     'adicional', 15.00, 10, 0.50, 15),
  ('b0b0b0b0-0000-4000-8000-000000000001', 'Depilação',       'adicional', 15.00,  5, 1.00, 14),
  ('b0b0b0b0-0000-4000-8000-000000000001', 'Barboterapia',    'adicional', 25.00, 15, 3.00, null),
  ('b0b0b0b0-0000-4000-8000-000000000001', 'Limpeza de pele', 'adicional', 30.00, 20, 5.00, 30);

insert into produtos (barbeiro_id, nome, preco, custo) values
  ('b0b0b0b0-0000-4000-8000-000000000001', 'Pomada modeladora', 35.00, 15.00),
  ('b0b0b0b0-0000-4000-8000-000000000001', 'Óleo para barba',   30.00, 12.00);

-- ---------- Combos padrão copiados pelos nomes (como o app fará) ----------
insert into combinacoes_servico (barbeiro_id, servico_base_id, servico_extra_id, momento, simultaneo,
                                 tempo_extra_min, facilidade, como_executar)
select sb.barbeiro_id, sb.id, se.id, cp.momento, cp.simultaneo, cp.tempo_extra_min, cp.facilidade, cp.como_executar
from combos_padrao cp
join servicos sb on sb.nome = cp.servico_base  and sb.barbeiro_id = 'b0b0b0b0-0000-4000-8000-000000000001'
join servicos se on se.nome = cp.servico_extra and se.barbeiro_id = 'b0b0b0b0-0000-4000-8000-000000000001';

-- ---------- Narrativas ----------
insert into narrativas (barbeiro_id, servico_id, produto_id, publico, estilo, momento, titulo, texto, criado_em)
select 'b0b0b0b0-0000-4000-8000-000000000001', s.id, p.id, n.publico::publico_tipo, n.estilo::estilo_narrativa,
       n.momento::momento_oferta, n.titulo, n.texto, now() - interval '100 days'
from (values
  ('Hidratação', null, 'C', 'rapida', 'durante', 'Mesmo tempo',
   'Enquanto eu acerto a lateral, já deixo a hidratação agindo em cima. Não aumenta o tempo e você sai com o cabelo macio. Faço?'),
  ('Hidratação', null, 'C', 'rapida', 'durante', 'Cabelo ressecado',
   'Seu cabelo está meio ressecado nas pontas. Uma hidratação resolve e dura umas semanas. Quer fazer hoje?'),
  ('Sobrancelha', null, null, 'rapida', 'durante', 'Já está deitado',
   'Já que você está deitado, aproveito e alinho a sobrancelha em 5 minutinhos?'),
  ('Depilação', null, null, 'rapida', 'finalizacao', 'Acabamento',
   'Pra fechar o acabamento, tiro os pelinhos do nariz e da orelha rapidinho?'),
  ('Barba', null, null, 'rapida', 'chegada', 'Barba junto',
   'Quer que eu já faça a barba junto? Reservo o tempo agora e você sai pronto.'),
  (null, 'Pomada modeladora', null, 'rapida', 'finalizacao', 'Produto que usei',
   'Essa pomada que usei agora segura o dia todo sem pesar. Se quiser levar, é a mesma.')
) as n(servico, produto, publico, estilo, momento, titulo, texto)
left join servicos s on s.nome = n.servico and s.barbeiro_id = 'b0b0b0b0-0000-4000-8000-000000000001'
left join produtos p on p.nome = n.produto and p.barbeiro_id = 'b0b0b0b0-0000-4000-8000-000000000001';

-- ---------- 3 clientes (nomes e telefones fictícios) ----------
insert into clientes (id, barbeiro_id, nome, telefone, status, origem, aceita_contato, aniversario, preferencias,
                      apelido, bebida_preferida, tecnica_ultimo_corte, ultimo_assunto, horario_contato,
                      pode_receber_oferta, criado_em) values
  ('c0000000-0000-4000-8000-000000000001', 'b0b0b0b0-0000-4000-8000-000000000001', 'Rafael Souza', '11900000001',
   'ativo', 'indicacao', true, '1994-03-12', 'Gosta de conversar sobre futebol',
   'Rafa', 'Café sem açúcar', 'Degradê na 1, tesoura em cima', 'Viagem para a praia', '18h-20h',
   true, now() - interval '95 days'),
  ('c0000000-0000-4000-8000-000000000002', 'b0b0b0b0-0000-4000-8000-000000000001', 'Bruno Lima', '11900000002',
   'ativo', 'instagram', true, '1988-08-30', 'Sempre com pressa no fim do dia',
   null, 'Água', 'Social na tesoura, barba desenhada', 'Filho começou na escola', '9h-12h',
   true, now() - interval '90 days'),
  ('c0000000-0000-4000-8000-000000000003', 'b0b0b0b0-0000-4000-8000-000000000001', 'Carlos Mendes', '11900000003',
   'ativo', 'passante', true, null, null,
   null, null, 'Máquina 2 nas laterais', 'Procurando emprego', null,
   true, now() - interval '92 days');

-- Rafael faz hidratação a cada 20 dias (sobrepõe os 21 do serviço).
insert into cliente_recorrencia (cliente_id, servico_id, intervalo_dias)
select 'c0000000-0000-4000-8000-000000000001', id, 20 from servicos
 where barbeiro_id = 'b0b0b0b0-0000-4000-8000-000000000001' and nome = 'Hidratação';

-- ---------- 3 meses de atendimentos e ofertas ----------
-- Rafael: a cada 10 dias, marca o próximo na saída (agendou 10 dias antes).
select pg_temp.atendimento('c0000000-0000-4000-8000-000000000001', -88, '10:00', '{Corte}',
  '[{"item": "Hidratação", "narrativa": "Mesmo tempo", "aceitou": true}]', 'pix', 'concluido', 3);
select pg_temp.atendimento('c0000000-0000-4000-8000-000000000001', -78, '10:00', '{Corte}',
  '[{"item": "Pomada modeladora", "narrativa": "Produto que usei", "aceitou": false, "motivo": "preco"}]', 'pix', 'concluido', 10);
select pg_temp.atendimento('c0000000-0000-4000-8000-000000000001', -68, '10:00', '{Corte}',
  '[{"item": "Hidratação", "narrativa": "Cabelo ressecado", "aceitou": false, "motivo": "outra_vez"}]', 'debito', 'concluido', 10);
select pg_temp.atendimento('c0000000-0000-4000-8000-000000000001', -58, '10:00', '{Corte}',
  '[{"item": "Hidratação", "narrativa": "Mesmo tempo", "aceitou": true}]', 'pix', 'concluido', 10);
select pg_temp.atendimento('c0000000-0000-4000-8000-000000000001', -48, '10:00', '{Corte}',
  '[{"item": "Pomada modeladora", "narrativa": "Produto que usei", "aceitou": true}]', 'credito', 'concluido', 10);
select pg_temp.atendimento('c0000000-0000-4000-8000-000000000001', -38, '10:00', '{Corte}',
  '[{"item": "Hidratação", "narrativa": "Mesmo tempo", "aceitou": true}]', 'pix', 'concluido', 10);
select pg_temp.atendimento('c0000000-0000-4000-8000-000000000001', -28, '10:00', '{Corte}',
  '[{"item": "Depilação", "narrativa": "Acabamento", "aceitou": true}]', 'dinheiro', 'concluido', 10);
select pg_temp.atendimento('c0000000-0000-4000-8000-000000000001', -18, '10:00', '{Corte}',
  '[{"item": "Hidratação", "narrativa": "Mesmo tempo", "aceitou": false, "motivo": "tempo"}]', 'pix', 'concluido', 10);
select pg_temp.atendimento('c0000000-0000-4000-8000-000000000001', -8, '10:00', '{Corte}',
  '[{"item": "Hidratação", "narrativa": "Cabelo ressecado", "aceitou": false, "motivo": "tempo"}]', 'pix', 'concluido', 10);
select pg_temp.atendimento('c0000000-0000-4000-8000-000000000001', 2, '10:00', '{Corte}',
  '[]', 'pix', 'agendado', 10);

-- Bruno: a cada 21 dias, corte + barba no fim do dia. Amanhã: só barba.
select pg_temp.atendimento('c0000000-0000-4000-8000-000000000002', -85, '18:30', '{Corte,Barba}',
  '[{"item": "Sobrancelha", "narrativa": "Já está deitado", "aceitou": true}]', 'credito', 'concluido', 2);
select pg_temp.atendimento('c0000000-0000-4000-8000-000000000002', -64, '18:30', '{Corte,Barba}',
  '[{"item": "Hidratação", "narrativa": "Mesmo tempo", "aceitou": false, "motivo": "preco"}]', 'credito', 'concluido', 2);
select pg_temp.atendimento('c0000000-0000-4000-8000-000000000002', -43, '18:30', '{Corte,Barba}',
  '[{"item": "Hidratação", "narrativa": "Mesmo tempo", "aceitou": true}]', 'credito', 'concluido', 2);
select pg_temp.atendimento('c0000000-0000-4000-8000-000000000002', -22, '18:30', '{Corte,Barba}',
  '[{"item": "Depilação", "narrativa": "Acabamento", "aceitou": true},
    {"item": "Sobrancelha", "narrativa": "Já está deitado", "aceitou": true}]', 'debito', 'concluido', 2);
select pg_temp.atendimento('c0000000-0000-4000-8000-000000000002', 1, '18:30', '{Barba}',
  '[]', 'pix', 'agendado', 1);

-- Carlos: 3 visitas a cada 18 dias, faltou no 4º horário e sumiu.
select pg_temp.atendimento('c0000000-0000-4000-8000-000000000003', -89, '14:00', '{Corte}',
  '[]', 'dinheiro', 'concluido', 0);
select pg_temp.atendimento('c0000000-0000-4000-8000-000000000003', -71, '14:00', '{Corte}',
  '[{"item": "Barba", "narrativa": "Barba junto", "aceitou": true}]', 'pix', 'concluido', 1);
select pg_temp.atendimento('c0000000-0000-4000-8000-000000000003', -53, '14:00', '{Corte}',
  '[]', 'pix', 'concluido', 1);
select pg_temp.atendimento('c0000000-0000-4000-8000-000000000003', -35, '14:00', '{Corte}',
  '[]', 'pix', 'falta', 1);

-- ---------- Comissão escalonada (0–10 mil 25% · 10–15 mil 27% · 15 mil+ 29%) ----------
with r as (
  insert into regras_comissao (barbeiro_id, vigente_desde, tipo, metodo_faixa, base, pct_produto)
  values ('b0b0b0b0-0000-4000-8000-000000000001', pg_temp.hoje() - 120, 'escalonada', 'total', 'bruto', 0.10)
  returning id
)
insert into faixas_comissao (regra_id, de, ate, pct)
select r.id, f.de, f.ate, f.pct from r,
  (values (0, 10000, 0.25), (10000, 15000, 0.27), (15000, null, 0.29)) as f(de, ate, pct);

-- ---------- Vale e gastos do mês ----------
insert into vales (barbeiro_id, data, valor, motivo) values
  ('b0b0b0b0-0000-4000-8000-000000000001', pg_temp.hoje() - 5, 100.00, 'Adiantamento');

insert into gastos (barbeiro_id, data, categoria, valor, recorrente, descricao) values
  ('b0b0b0b0-0000-4000-8000-000000000001', date_trunc('month', pg_temp.hoje())::date, 'transporte', 180.00, true, 'Passe do mês'),
  ('b0b0b0b0-0000-4000-8000-000000000001', pg_temp.hoje() - 3, 'produtos', 62.90, false, 'Lâminas e talco');

-- ---------- Permissões (LGPD) e mensagens ----------
-- Rafael: lembretes e marketing · Bruno: só lembretes · Carlos: marketing (para reativação)
insert into consentimentos (cliente_id, tipo, aceito, texto_aceito, registrado_em) values
  ('c0000000-0000-4000-8000-000000000001', 'lembretes', true, 'Aceito receber lembretes do meu horário.', now() - interval '90 days'),
  ('c0000000-0000-4000-8000-000000000001', 'marketing', true, 'Aceito receber novidades e ofertas.', now() - interval '90 days'),
  ('c0000000-0000-4000-8000-000000000002', 'lembretes', true, 'Aceito receber lembretes do meu horário.', now() - interval '85 days'),
  ('c0000000-0000-4000-8000-000000000003', 'marketing', true, 'Aceito receber novidades e ofertas.', now() - interval '89 days');

-- Rafael recebeu uma mensagem de marketing há 3 dias: o limite semanal bloqueia outra.
insert into contatos_enviados (barbeiro_id, cliente_id, categoria, mensagem, enviado_em, respondeu, agendou) values
  ('b0b0b0b0-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001', 'marketing',
   'Rafa, chegou a pomada nova que segura o dia todo. Quer que eu separe uma?', now() - interval '3 days', true, false);
