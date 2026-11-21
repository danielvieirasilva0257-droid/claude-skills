-- =====================================================================
-- Seed de desenvolvimento do App Barbeiros (Fase 0)
-- Roda depois das migrations em `npx supabase db reset`.
--
-- 1 barbeiro (com login de teste), 7 serviços, 2 produtos, combos padrão,
-- 6 narrativas, 3 clientes, 3 meses de atendimentos e ofertas, comissão
-- escalonada, vale, gastos, permissões e 1 mensagem enviada. No fim, o
-- histórico de teste: 24 clientes e 4 meses de atendimentos (out = R$ 10.150,82).
--
-- As datas são relativas a HOJE (horário de Brasília): o seed sempre tem
-- "este mês" e "3 meses para trás", não importa quando rodar.
--
-- Logins de teste (só no banco local, nunca em produção), senha senha-teste-123:
--   barbeiro.teste@example.com  (Premium Plus, com 3 meses de dados)
--   gratis.teste@example.com    (Grátis, sem onboarding)
--   dono.teste@example.com      (Barbearias: dono da "Barbearia Navalha", com o
--                                Barbeiro Teste na equipe)
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

-- ---------- Premium e Premium Plus (Fases 4 e 5) ----------
-- Expediente: terça a sábado, 9h às 19h, pausa 12h–13h; domingo e segunda fechado.
insert into expediente (barbeiro_id, dia_semana, inicio, fim, pausa_inicio, pausa_fim)
select 'b0b0b0b0-0000-4000-8000-000000000001', d, '09:00', '19:00', '12:00', '13:00' from generate_series(2, 6) d;
insert into expediente (barbeiro_id, dia_semana, inicio, fim)
values ('b0b0b0b0-0000-4000-8000-000000000001', 7, '09:00', '13:00');

-- Automações ligadas: confirmação D-1, pós-visita, reagendamento, reativação, aniversário, lista de espera.
insert into barbeiro_estrategias (barbeiro_id, codigo)
select 'b0b0b0b0-0000-4000-8000-000000000001', c from unnest(array['R4', 'A15', 'R6', 'R9', 'R12', 'V1']) c;

-- Carlos está na lista de espera de sábado de manhã.
insert into lista_espera (barbeiro_id, cliente_id, servico_id, preferencia)
select 'b0b0b0b0-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000003', id, 'sábado de manhã'
from servicos where barbeiro_id = 'b0b0b0b0-0000-4000-8000-000000000001' and nome = 'Corte';

-- Canais em modo de teste (contas fictícias; tokens nunca no seed).
insert into canais (barbeiro_id, tipo, conta_externa, nome_exibicao) values
  ('b0b0b0b0-0000-4000-8000-000000000001', 'whatsapp', 'wa-teste-001', '(11) 90000-0000 · teste'),
  ('b0b0b0b0-0000-4000-8000-000000000001', 'instagram', 'ig-teste-001', '@barbeiro.teste');

-- Palavras-código do funil e a origem do Bruno.
insert into origens (barbeiro_id, codigo, canal, parceiro, custo_mensal) values
  ('b0b0b0b0-0000-4000-8000-000000000001', 'REELS', 'Instagram', null, 0),
  ('b0b0b0b0-0000-4000-8000-000000000001', 'GOOGLE', 'Google', null, 0),
  ('b0b0b0b0-0000-4000-8000-000000000001', 'ACADEMIA', 'Parceria', 'Academia do bairro', 50);
update clientes set origem_codigo = 'REELS' where id = 'c0000000-0000-4000-8000-000000000002';

-- Uma conversa de WhatsApp e um comentário no Instagram (fictícios).
insert into conversas (id, barbeiro_id, canal, contato_externo, nome_contato, cliente_id, janela_ate, ultima_mensagem_em, nao_lidas)
values ('d0000000-0000-4000-8000-000000000001', 'b0b0b0b0-0000-4000-8000-000000000001', 'whatsapp', '5511900000001',
        'Rafa', 'c0000000-0000-4000-8000-000000000001', now() + interval '20 hours', now() - interval '4 hours', 0);
insert into mensagens (conversa_id, barbeiro_id, direcao, autor, texto, criado_em) values
  ('d0000000-0000-4000-8000-000000000001', 'b0b0b0b0-0000-4000-8000-000000000001', 'entrada', 'cliente', 'Fala! Tem horário sábado?', now() - interval '4 hours'),
  ('d0000000-0000-4000-8000-000000000001', 'b0b0b0b0-0000-4000-8000-000000000001', 'saida', 'ia', 'Oi, Rafa! Sábado tenho às 10h e às 10h45. Qual fica melhor?', now() - interval '4 hours' + interval '20 seconds');
insert into instagram_eventos (barbeiro_id, tipo, autor_externo, autor_nome, texto, comentario_id, midia_id, recebido_em, codigo_detectado)
values ('b0b0b0b0-0000-4000-8000-000000000001', 'comentario', 'ig-user-77', 'joao.silva', 'REELS quero esse corte!', 'c-1', 'm-1',
        now() - interval '1 day', 'REELS');

-- ---------- Barbearias (Fase 6) ----------
-- Dono no plano Barbearias, com 2 serviços, 1 cliente e um dia de trabalho;
-- o Barbeiro Teste está na equipe (continua com o próprio plano, Premium Plus).
select pg_temp.criar_usuario('b0b0b0b0-0000-4000-8000-000000000003', 'dono.teste@example.com', 'senha-teste-123', 'Dono Teste');
update barbeiros set nome = 'Dono Teste', cidade = 'São Paulo', modelo_trabalho = 'dono', preco_corte = 50.00,
       onboarding_concluido = true, criado_em = now() - interval '120 days'
 where id = 'b0b0b0b0-0000-4000-8000-000000000003';
update app_assinatura set plano = 'barbearias', status = 'ativa', periodo = 'mensal', provedor = 'manual',
       renova_em = now() + interval '30 days'
 where barbeiro_id = 'b0b0b0b0-0000-4000-8000-000000000003';

insert into servicos (id, barbeiro_id, nome, categoria, preco, duracao_min, custo_insumo) values
  ('5e000000-0000-4000-8000-000000000001', 'b0b0b0b0-0000-4000-8000-000000000003', 'Corte', 'principal', 50.00, 40, 1.50),
  ('5e000000-0000-4000-8000-000000000002', 'b0b0b0b0-0000-4000-8000-000000000003', 'Barba', 'principal', 40.00, 30, 2.00);
insert into clientes (id, barbeiro_id, nome, telefone, status, criado_em) values
  ('c0000000-0000-4000-8000-000000000031', 'b0b0b0b0-0000-4000-8000-000000000003', 'Diego Alves', '5511911110031', 'ativo', now() - interval '60 days');

-- Hoje: um corte feito às 9h e uma barba marcada às 18h; no começo do mês, corte + barba.
insert into atendimentos (id, barbeiro_id, cliente_id, inicio, fim, status, forma_pagamento, criado_em) values
  ('a0000000-0000-4000-8000-000000000031', 'b0b0b0b0-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000031',
   pg_temp.quando(0, '09:00'), pg_temp.quando(0, '09:40'), 'concluido', 'pix', pg_temp.quando(-2, '10:00')),
  ('a0000000-0000-4000-8000-000000000032', 'b0b0b0b0-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000031',
   pg_temp.quando(0, '18:00'), null, 'agendado', null, pg_temp.quando(-1, '10:00')),
  ('a0000000-0000-4000-8000-000000000033', 'b0b0b0b0-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000031',
   (date_trunc('month', pg_temp.hoje())::date + time '10:00') at time zone 'America/Sao_Paulo',
   (date_trunc('month', pg_temp.hoje())::date + time '11:10') at time zone 'America/Sao_Paulo', 'concluido', 'pix',
   (date_trunc('month', pg_temp.hoje())::date - 2 + time '10:00') at time zone 'America/Sao_Paulo');
insert into atendimento_itens (atendimento_id, servico_id, valor) values
  ('a0000000-0000-4000-8000-000000000031', '5e000000-0000-4000-8000-000000000001', 50.00),
  ('a0000000-0000-4000-8000-000000000032', '5e000000-0000-4000-8000-000000000002', 40.00),
  ('a0000000-0000-4000-8000-000000000033', '5e000000-0000-4000-8000-000000000001', 50.00),
  ('a0000000-0000-4000-8000-000000000033', '5e000000-0000-4000-8000-000000000002', 40.00);

insert into barbearias (id, nome) values ('ba000000-0000-4000-8000-000000000001', 'Barbearia Navalha');
insert into barbearia_membros (barbearia_id, barbeiro_id, papel, entrou_em) values
  ('ba000000-0000-4000-8000-000000000001', 'b0b0b0b0-0000-4000-8000-000000000003', 'dono', now() - interval '90 days'),
  ('ba000000-0000-4000-8000-000000000001', 'b0b0b0b0-0000-4000-8000-000000000001', 'barbeiro', now() - interval '90 days');

-- ---------- Ficha do cliente (0008): observações livres e técnicas ----------
update clientes set observacoes = E'Gosta de conversar sobre futebol.\nCafé sem açúcar.\nÚltimo assunto: viagem para a praia.',
       tecnica_cabelo = 'Degradê na 1, tesoura em cima', tecnica_barba = null
 where id = 'c0000000-0000-4000-8000-000000000001';
update clientes set observacoes = E'Sempre com pressa no fim do dia.\nPrefere água.\nO filho começou na escola.',
       tecnica_cabelo = 'Social na tesoura', tecnica_barba = 'Barba desenhada, contorno na navalha'
 where id = 'c0000000-0000-4000-8000-000000000002';
update clientes set observacoes = 'Faltou no último horário; mandar lembrete na véspera.',
       tecnica_cabelo = 'Máquina 2 nas laterais', tecnica_barba = null
 where id = 'c0000000-0000-4000-8000-000000000003';

-- =====================================================================
-- Histórico de teste: 4 meses para conferir as comparações (pedido do
-- Daniel, 20/11/2026). Números do mês inteiro:
--   3 meses atrás: R$ 8.432,40 em 44 atendimentos   → abaixo da média
--   2 meses atrás: R$ 11.650,00 em 57 atendimentos  → acima da média
--   mês passado:   R$ 10.150,82 em 51 atendimentos  → na média (ticket ≈ R$ 199)
--   este mês:      até hoje, 9% acima da média do mesmo pedaço (verde)
-- Cada mês fechado é dividido em "até este momento do mês" e "o resto", na
-- mesma proporção, para a comparação até o mesmo momento contar a mesma história.
-- As visitas do Rafael, do Bruno e do Carlos entram na conta. Os 24 clientes
-- de teste e os serviços de cada visita são sorteados com semente fixa.
-- =====================================================================

-- Serviços de química, para o ticket chegar perto de R$ 200.
insert into servicos (barbeiro_id, nome, categoria, preco, duracao_min, custo_insumo) values
  ('b0b0b0b0-0000-4000-8000-000000000001', 'Luzes',       'adicional', 150.00, 90, 18.00),
  ('b0b0b0b0-0000-4000-8000-000000000001', 'Platinado',   'adicional', 220.00, 120, 30.00),
  ('b0b0b0b0-0000-4000-8000-000000000001', 'Selagem',     'adicional', 120.00, 60, 15.00),
  ('b0b0b0b0-0000-4000-8000-000000000001', 'Pigmentação', 'adicional', 60.00, 30, 6.00);

-- 24 clientes de teste (nomes e telefones fictícios; ids depois dos 3 da história).
insert into clientes (id, barbeiro_id, nome, telefone, status, origem, aceita_contato, criado_em, observacoes, tecnica_cabelo)
select ('c0000000-0000-4000-8000-0000000001' || lpad(n::text, 2, '0'))::uuid, 'b0b0b0b0-0000-4000-8000-000000000001',
       nome, '119000001' || lpad(n::text, 2, '0'), 'ativo',
       (array['indicacao', 'instagram', 'whatsapp', 'passante', 'google']::origem_cliente[])[1 + n % 5],
       true, now() - interval '130 days', 'Cliente de teste (histórico gerado).',
       (array['Degradê navalhado', 'Social na tesoura', 'Low fade', 'Corte americano'])[1 + n % 4]
from unnest(array['Thiago Ramos', 'Lucas Ferreira', 'Gustavo Almeida', 'Felipe Costa', 'Matheus Rocha', 'André Barbosa',
                  'Vinícius Prado', 'Eduardo Nunes', 'Leonardo Dias', 'Henrique Moura', 'Caio Barros', 'Igor Teixeira',
                  'Marcelo Pinto', 'Ricardo Azevedo', 'Fernando Gomes', 'Rodrigo Campos', 'Gabriel Freitas', 'Otávio Cardoso',
                  'Renato Vieira', 'Samuel Duarte', 'Wesley Martins', 'Júlio Lopes', 'Murilo Santana', 'Paulo Reis'])
     with ordinality as t(nome, n);

-- Combinações sorteadas em cada visita (preço e duração saem da tabela de serviços).
create temp table t_combo as
select c.id, c.servicos,
       (select sum(s.preco) from servicos s where s.barbeiro_id = 'b0b0b0b0-0000-4000-8000-000000000001' and s.nome = any (c.servicos)) as total,
       (select sum(s.duracao_min) from servicos s where s.barbeiro_id = 'b0b0b0b0-0000-4000-8000-000000000001' and s.nome = any (c.servicos))::int as dur
from (values (1, '{Corte,Barba}'::text[]), (2, '{Corte,Barba,Hidratação,Sobrancelha}'), (3, '{Corte,Luzes}'),
             (4, '{Corte,Platinado}'), (5, '{Corte,Barba,Selagem}'), (6, '{Corte,Selagem}'), (7, '{Corte,Barba,Pigmentação}'),
             (8, '{Corte,Barba,Luzes}'), (9, '{Corte,Barba,Barboterapia,Limpeza de pele}'), (10, '{Corte,Barba,Platinado}'),
             (11, '{Corte,Hidratação,Selagem}'), (12, '{Corte,Barba,Selagem,Sobrancelha}'),
             (13, '{Corte,Barba,Pigmentação,Barboterapia}')) as c(id, servicos);
create temp sequence t_visita;

-- Enche o período [p_ini, p_fim) até o faturamento e o número de atendimentos
-- pedidos (contando o que já existe nele). Ter a sáb, 9h às 19h, fora do
-- almoço e sem encavalar horários; hoje, só o que já terminou. A última visita
-- do período recebe o ajuste dos centavos (um desconto no serviço mais caro).
create function pg_temp.encher(p_ini timestamptz, p_fim timestamptz, p_alvo numeric, p_qtd int) returns void
language plpgsql as $$
declare
  v_bar constant uuid := 'b0b0b0b0-0000-4000-8000-000000000001';
  v_clientes uuid[] := array(select id from clientes where barbeiro_id = v_bar and nome <> all ('{Rafael Souza,Bruno Lima,Carlos Mendes}') order by id);
  v_dias date[];
  v_rest numeric;
  v_n int;
  v_c t_combo%rowtype;
  v_total numeric;
  v_need numeric;
  v_prod uuid;
  v_prod_preco numeric;
  v_ini timestamptz;
  v_fim timestamptz;
  v_h time;
  v_dia date;
  v_try int;
  v_ok boolean;
  v_id uuid;
  v_pag forma_pagamento;
  v_r float8;
  v_ajuste numeric;
begin
  select p_alvo - coalesce(sum(r.valor_total), 0), p_qtd - count(*) into v_rest, v_n
    from v_atendimento_resumo r
   where r.barbeiro_id = v_bar and r.inicio >= p_ini and r.inicio < p_fim;
  v_dias := array(select d::date from generate_series((p_ini at time zone 'America/Sao_Paulo')::date,
                                                      least(((p_fim - interval '1 second') at time zone 'America/Sao_Paulo')::date, pg_temp.hoje()),
                                                      interval '1 day') d
                   where extract(isodow from d) between 2 and 6 order by d);
  if v_n <= 0 or v_rest <= 0 or cardinality(v_dias) = 0 then return; end if;

  for i in 1..v_n loop
    v_need := v_rest / (v_n - i + 1);
    v_prod := null; v_prod_preco := 0;
    if i < v_n then
      select * into v_c from t_combo where total between v_need - 50 and v_need + 50 order by random() limit 1;
      if not found then select * into v_c from t_combo order by abs(total - v_need) limit 1; end if;
      if random() < 0.3 then
        select id, preco into v_prod, v_prod_preco from produtos where barbeiro_id = v_bar order by random() limit 1;
      end if;
    else
      select * into v_c from t_combo where total >= v_rest order by total limit 1;
      if not found then
        select * into v_c from t_combo order by total desc limit 1;
        select id, preco into v_prod, v_prod_preco from produtos where barbeiro_id = v_bar order by preco desc limit 1;
      end if;
    end if;
    v_total := v_c.total + v_prod_preco;
    v_ajuste := case when i = v_n then v_rest - v_total else 0 end;

    -- Horário livre: começa no dia da vez e anda para o próximo se o dia estiver cheio.
    v_ok := false; v_try := 0;
    while not v_ok and v_try < cardinality(v_dias) loop
      v_dia := v_dias[1 + ((((i - 1) * cardinality(v_dias)) / v_n + v_try) % cardinality(v_dias))];
      for v_h in select time '09:00' + make_interval(mins => 30 * g) from generate_series(0, 19) g order by random() loop
        v_ini := (v_dia + v_h) at time zone 'America/Sao_Paulo';
        v_fim := v_ini + make_interval(mins => v_c.dur);
        continue when extract(epoch from v_h) / 60 + v_c.dur > 19 * 60;
        continue when v_h < time '13:00' and extract(epoch from v_h) / 60 + v_c.dur > 12 * 60;
        continue when v_fim > now() or v_ini < p_ini or v_fim > p_fim;
        continue when exists (select 1 from atendimentos a where a.barbeiro_id = v_bar and a.status <> 'cancelado'
                                and tstzrange(a.inicio, coalesce(nullif(a.fim, a.inicio), a.inicio + interval '40 minutes')) && tstzrange(v_ini, v_fim));
        v_ok := true;
        exit;
      end loop;
      v_try := v_try + 1;
    end loop;
    continue when not v_ok;

    v_r := random();
    v_pag := case when v_r < 0.5 then 'pix' when v_r < 0.75 then 'credito' when v_r < 0.9 then 'debito' else 'dinheiro' end;
    v_id := gen_random_uuid();
    insert into atendimentos (id, barbeiro_id, cliente_id, inicio, fim, status, forma_pagamento, taxa_cartao, criado_em)
    values (v_id, v_bar, v_clientes[1 + (nextval('t_visita') % cardinality(v_clientes))], v_ini, v_fim, 'concluido', v_pag,
            round((v_total + v_ajuste) * case v_pag when 'debito' then 0.0150 when 'credito' then 0.0320 else 0 end, 2),
            v_ini - interval '2 days');
    insert into atendimento_itens (atendimento_id, servico_id, valor)
    select v_id, s.id, s.preco + case when s.nome = (select s2.nome from servicos s2 where s2.barbeiro_id = v_bar
                                                       and s2.nome = any (v_c.servicos) order by s2.preco desc limit 1)
                                      then v_ajuste else 0 end
      from servicos s where s.barbeiro_id = v_bar and s.nome = any (v_c.servicos);
    if v_prod is not null then
      insert into atendimento_itens (atendimento_id, produto_id, valor) values (v_id, v_prod, v_prod_preco);
    end if;
    v_rest := v_rest - (v_total + v_ajuste);
  end loop;
end $$;

-- Cada mês fechado é dividido no mesmo momento do mês (corte_mes, da 0009):
-- até o dia e a hora de agora, e o resto.
do $$
declare
  v_m0 date := date_trunc('month', pg_temp.hoje())::date;
  v_f numeric := least(extract(epoch from now() - inicio_mes_br(v_m0)) / 86400 / 30, 1);
  r record;
  v_mes date;
  v_fim_mes timestamptz;
  v_fim_td timestamptz;
  v_alvo numeric;
  v_qtd int;
  v_soma numeric := 0;
  v_qtd_soma int := 0;
begin
  perform setseed(0.2611);
  for r in select * from (values (3, 8432.40, 44), (2, 11650.00, 57), (1, 10150.82, 51)) v(k, total, qtd) order by k desc loop
    v_mes := (v_m0 - make_interval(months => r.k))::date;
    v_fim_mes := inicio_mes_br((v_mes + interval '1 month')::date);
    v_fim_td := corte_mes(v_mes, v_m0);
    if v_fim_td >= v_fim_mes then
      v_alvo := r.total; v_qtd := r.qtd;
      perform pg_temp.encher(inicio_mes_br(v_mes), v_fim_mes, r.total, r.qtd);
    else
      v_alvo := round(r.total * v_f, 2); v_qtd := round(r.qtd * v_f)::int;
      perform pg_temp.encher(inicio_mes_br(v_mes), v_fim_td, v_alvo, v_qtd);
      perform pg_temp.encher(v_fim_td, v_fim_mes, r.total - v_alvo, r.qtd - v_qtd);
    end if;
    v_soma := v_soma + v_alvo; v_qtd_soma := v_qtd_soma + v_qtd;
  end loop;
  -- Este mês: 9% acima da média do mesmo pedaço dos 3 meses.
  perform pg_temp.encher(inicio_mes_br(v_m0), now(), round(v_soma / 3 * 1.09, 2), round(v_qtd_soma / 3.0 * 1.06)::int);
end $$;
