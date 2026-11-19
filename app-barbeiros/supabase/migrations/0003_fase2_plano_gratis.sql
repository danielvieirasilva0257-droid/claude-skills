-- =====================================================================
-- 0003 · Fase 2 (plano Grátis): plano do app, cadastro, onboarding,
-- lançamento em 2 toques, "Ofereceu algo?", caixa do dia.
-- O banco calcula: valor, taxa, insumo e lucro saem daqui.
-- =====================================================================

-- ---------- Plano do app (assinatura do barbeiro) ----------
-- `assinaturas` (0001) é o clube de assinatura dos CLIENTES do barbeiro.
-- Esta tabela é o plano do BARBEIRO no app. Só o servidor escreve
-- (webhook de assinatura, com a service_role); o barbeiro só lê.
create type app_plano as enum ('gratis', 'pago', 'premium', 'plus', 'barbearias');
create type app_status_assinatura as enum ('ativa', 'teste', 'cancelada', 'expirada');

create table app_assinatura (
  barbeiro_id   uuid primary key references barbeiros(id) on delete cascade,
  plano         app_plano not null default 'gratis',
  status        app_status_assinatura not null default 'ativa',
  periodo       text check (periodo in ('mensal', 'anual')),
  renova_em     timestamptz,                -- null = sem vencimento (Grátis)
  cancela_no_fim boolean not null default false,
  provedor      text,                       -- revenuecat, manual
  id_externo    text,
  atualizado_em timestamptz not null default now()
);
alter table app_assinatura enable row level security;
create policy leitura_app_assinatura on app_assinatura for select using (barbeiro_id = auth.uid());
-- sem policy de escrita: só service_role (que ignora RLS) muda o plano

-- Plano em vigor de quem está logado (ou de outro barbeiro, para o dono da barbearia na Fase 6).
create or replace function meu_plano() returns app_plano
language sql stable as $$
  select coalesce((
    select plano from app_assinatura
     where barbeiro_id = auth.uid()
       and status in ('ativa', 'teste')
       and (renova_em is null or renova_em > now())
  ), 'gratis'::app_plano)
$$;

-- ---------- Barbeiro: onboarding e taxas da maquininha ----------
alter table barbeiros
  add column onboarding_concluido boolean not null default false,
  add column taxa_debito  numeric(5,4) not null default 0 check (taxa_debito between 0 and 0.2),
  add column taxa_credito numeric(5,4) not null default 0 check (taxa_credito between 0 and 0.2),
  add column pagamento_padrao forma_pagamento not null default 'pix';

-- A linha do barbeiro nasce junto com o usuário (e-mail ou Google).
create or replace function criar_barbeiro_do_usuario() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.barbeiros (id, nome)
  values (new.id, coalesce(nullif(new.raw_user_meta_data->>'nome', ''),
                           nullif(new.raw_user_meta_data->>'full_name', ''),
                           nullif(new.raw_user_meta_data->>'name', ''),
                           split_part(new.email, '@', 1), 'Barbeiro'))
  on conflict (id) do nothing;
  insert into public.app_assinatura (barbeiro_id) values (new.id) on conflict (barbeiro_id) do nothing;
  return new;
end $$;
create trigger trg_criar_barbeiro after insert on auth.users
  for each row execute function criar_barbeiro_do_usuario();

-- Público sugerido pelo preço do corte (faixas de perfis_publico).
create or replace function publico_por_preco(p_preco numeric) returns publico_tipo
language sql stable as $$
  select coalesce((select publico from perfis_publico
                    where (preco_corte_min is null or p_preco >= preco_corte_min)
                      and (preco_corte_max is null or p_preco <= preco_corte_max)
                    order by publico limit 1), 'C')
$$;

-- Fim do onboarding: grava o perfil e, se ainda não houver serviços, cria os
-- 7 serviços padrão com preço proporcional ao corte e copia os combos padrão.
create or replace function configurar_inicio(
  p_preco_corte numeric, p_publico publico_tipo, p_modelo modelo_trabalho, p_estrategia estrategia_tipo
) returns int language plpgsql as $$
declare
  v_id uuid := auth.uid();
  v_criados int := 0;
begin
  if v_id is null then raise exception 'sem login'; end if;
  if p_preco_corte is null or p_preco_corte <= 0 then raise exception 'preço do corte inválido'; end if;

  update barbeiros set preco_corte = round(p_preco_corte, 2), publico = p_publico,
         modelo_trabalho = p_modelo, estrategia = p_estrategia, onboarding_concluido = true
   where id = v_id;

  if not exists (select 1 from servicos where barbeiro_id = v_id) then
    insert into servicos (barbeiro_id, nome, categoria, preco, duracao_min, custo_insumo, intervalo_recomendado_dias)
    select v_id, s.nome, s.categoria::categoria_servico,
           greatest(5, round(p_preco_corte * s.fator)), s.duracao, s.insumo, s.intervalo
    from (values
      ('Corte', 'principal', 1.00, (select tempo_alvo_corte_min from perfis_publico where publico = p_publico), 1.50, null::int),
      ('Barba', 'principal', 0.80, 30, 2.00, null),
      ('Hidratação', 'adicional', 0.55, 15, 4.00, 21),
      ('Sobrancelha', 'adicional', 0.35, 10, 0.50, 15),
      ('Depilação', 'adicional', 0.35, 5, 1.00, 14),
      ('Barboterapia', 'adicional', 0.55, 15, 3.00, null),
      ('Limpeza de pele', 'adicional', 0.65, 20, 5.00, 30)
    ) as s(nome, categoria, fator, duracao, insumo, intervalo);
    get diagnostics v_criados = row_count;

    insert into combinacoes_servico (barbeiro_id, servico_base_id, servico_extra_id, momento, simultaneo,
                                     tempo_extra_min, facilidade, como_executar)
    select v_id, sb.id, se.id, cp.momento, cp.simultaneo, cp.tempo_extra_min, cp.facilidade, cp.como_executar
    from combos_padrao cp
    join servicos sb on sb.barbeiro_id = v_id and sb.nome = cp.servico_base
    join servicos se on se.barbeiro_id = v_id and se.nome = cp.servico_extra
    on conflict do nothing;
  end if;
  return v_criados;
end $$;

-- ---------- Lançamento e ofertas ----------
-- Recalcula fim, taxa da maquininha a partir dos itens (chamado após mudar itens).
create or replace function recalcular_atendimento(p_atendimento uuid) returns void
language plpgsql as $$
begin
  update atendimentos a
     set fim = a.inicio + make_interval(mins => coalesce((
               select sum(case when i.simultaneo then 0 else s.duracao_min * i.quantidade end)
                 from atendimento_itens i join servicos s on s.id = i.servico_id
                where i.atendimento_id = a.id), 0)::int),
         taxa_cartao = case when a.status = 'concluido' then round(coalesce((
               select sum(valor) from atendimento_itens where atendimento_id = a.id), 0)
               * case a.forma_pagamento when 'debito' then b.taxa_debito
                                        when 'credito' then b.taxa_credito else 0 end, 2)
                       else 0 end
    from barbeiros b
   where a.id = p_atendimento and b.id = a.barbeiro_id;
end $$;

-- Lança um atendimento (por padrão: concluído agora, sem cliente, pagamento padrão).
-- Os valores vêm do preço cadastrado de cada serviço.
create or replace function lancar_atendimento(
  p_servicos uuid[],
  p_cliente uuid default null,
  p_forma forma_pagamento default null,
  p_inicio timestamptz default now(),
  p_status status_atendimento default 'concluido'
) returns uuid language plpgsql as $$
declare
  v_id uuid;
  v_barbeiro uuid := auth.uid();
begin
  if v_barbeiro is null then raise exception 'sem login'; end if;
  if coalesce(array_length(p_servicos, 1), 0) = 0 then raise exception 'escolha pelo menos um serviço'; end if;
  if exists (select 1 from caixas where barbeiro_id = v_barbeiro and dia = (p_inicio at time zone 'America/Sao_Paulo')::date)
     and p_status = 'concluido' then
    raise exception 'o caixa deste dia já foi fechado';
  end if;

  insert into atendimentos (barbeiro_id, cliente_id, inicio, status, forma_pagamento)
  values (v_barbeiro, p_cliente, p_inicio, p_status,
          case when p_status = 'concluido'
               then coalesce(p_forma, (select pagamento_padrao from barbeiros where id = v_barbeiro)) end)
  returning id into v_id;

  insert into atendimento_itens (atendimento_id, servico_id, valor)
  select v_id, s.id, s.preco
  from unnest(p_servicos) as x(servico_id)
  join servicos s on s.id = x.servico_id and s.barbeiro_id = v_barbeiro;

  perform recalcular_atendimento(v_id);
  return v_id;
end $$;

-- Conclui um horário agendado (cliente atendido) com a forma de pagamento.
create or replace function concluir_atendimento(p_atendimento uuid, p_forma forma_pagamento default null)
returns void language plpgsql as $$
begin
  update atendimentos
     set status = 'concluido',
         forma_pagamento = coalesce(p_forma, forma_pagamento,
                                    (select pagamento_padrao from barbeiros where id = auth.uid()))
   where id = p_atendimento and barbeiro_id = auth.uid() and status = 'agendado';
  if not found then raise exception 'horário não encontrado'; end if;
  perform recalcular_atendimento(p_atendimento);
end $$;

-- Muda a forma de pagamento (e a taxa) de um atendimento já lançado.
create or replace function mudar_pagamento(p_atendimento uuid, p_forma forma_pagamento)
returns void language plpgsql as $$
begin
  update atendimentos set forma_pagamento = p_forma
   where id = p_atendimento and barbeiro_id = auth.uid();
  update barbeiros set pagamento_padrao = p_forma where id = auth.uid();
  perform recalcular_atendimento(p_atendimento);
end $$;

-- "Ofereceu algo?": grava a oferta e, se aceitou, entra como item do atendimento.
create or replace function registrar_oferta(
  p_atendimento uuid,
  p_aceitou boolean,
  p_servico uuid default null,
  p_produto uuid default null,
  p_narrativa uuid default null,
  p_motivo motivo_recusa default null,
  p_momento momento_oferta default 'durante'
) returns uuid language plpgsql as $$
declare
  v_oferta uuid;
  v_simultaneo boolean := false;
  v_a atendimentos%rowtype;
begin
  select * into v_a from atendimentos where id = p_atendimento and barbeiro_id = auth.uid();
  if not found then raise exception 'atendimento não encontrado'; end if;
  if (p_servico is null) = (p_produto is null) then raise exception 'informe um serviço ou um produto'; end if;

  if p_servico is not null then
    v_simultaneo := exists (
      select 1 from combinacoes_servico cb
       join atendimento_itens i on i.servico_id = cb.servico_base_id and i.atendimento_id = p_atendimento
      where cb.servico_extra_id = p_servico and cb.simultaneo);
  end if;

  insert into ofertas (barbeiro_id, atendimento_id, cliente_id, servico_id, produto_id, narrativa_id,
                       momento, simultaneo, aceitou, motivo_recusa)
  values (auth.uid(), p_atendimento, v_a.cliente_id, p_servico, p_produto, p_narrativa,
          p_momento, v_simultaneo, p_aceitou, case when p_aceitou then null else p_motivo end)
  returning id into v_oferta;

  if p_aceitou then
    insert into atendimento_itens (atendimento_id, servico_id, produto_id, valor, simultaneo, veio_de_oferta)
    select p_atendimento, p_servico, p_produto,
           coalesce((select preco from servicos where id = p_servico and barbeiro_id = auth.uid()),
                    (select preco from produtos where id = p_produto and barbeiro_id = auth.uid())),
           v_simultaneo, true;
    perform recalcular_atendimento(p_atendimento);
  end if;
  return v_oferta;
end $$;

-- ---------- Caixa do dia ----------
create table caixas (
  barbeiro_id  uuid not null references barbeiros(id) on delete cascade,
  dia          date not null,
  fechado_em   timestamptz not null default now(),
  faturamento  numeric(10,2) not null,
  atendimentos int not null,
  primary key (barbeiro_id, dia)
);
alter table caixas enable row level security;
create policy dono_caixas on caixas for all using (barbeiro_id = auth.uid()) with check (barbeiro_id = auth.uid());

-- Resumo de um dia (horário de Brasília): o que a tela Início mostra.
create or replace function resumo_dia(p_dia date default (now() at time zone 'America/Sao_Paulo')::date)
returns table (dia date, atendimentos int, faturamento numeric, taxas numeric, insumos numeric,
               gastos numeric, lucro numeric, agendados int, caixa_fechado boolean)
language sql stable as $$
  with conc as (
    select r.* from v_atendimento_resumo r
     where r.barbeiro_id = auth.uid() and (r.inicio at time zone 'America/Sao_Paulo')::date = p_dia
  ),
  prod as (
    select coalesce(sum(p.custo * i.quantidade), 0) as custo
      from atendimentos a
      join atendimento_itens i on i.atendimento_id = a.id
      join produtos p on p.id = i.produto_id
     where a.barbeiro_id = auth.uid() and a.status = 'concluido'
       and (a.inicio at time zone 'America/Sao_Paulo')::date = p_dia
  ),
  g as (select coalesce(sum(valor), 0) as total from gastos where barbeiro_id = auth.uid() and data = p_dia)
  select p_dia,
         (select count(*) from conc)::int,
         coalesce((select sum(valor_total) from conc), 0),
         coalesce((select sum(taxa_cartao) from conc), 0),
         coalesce((select sum(custo_insumo) from conc), 0) + (select custo from prod),
         (select total from g),
         coalesce((select sum(valor_total) - sum(taxa_cartao) - sum(custo_insumo) from conc), 0)
           - (select custo from prod) - (select total from g),
         (select count(*) from atendimentos where barbeiro_id = auth.uid() and status = 'agendado'
             and (inicio at time zone 'America/Sao_Paulo')::date = p_dia)::int,
         exists (select 1 from caixas where barbeiro_id = auth.uid() and dia = p_dia)
$$;

-- Agenda de um dia com valor de cada atendimento e quantas ofertas foram registradas.
create or replace function agenda_dia(p_dia date default (now() at time zone 'America/Sao_Paulo')::date)
returns table (id uuid, inicio timestamptz, fim timestamptz, status status_atendimento,
               cliente_id uuid, cliente text, servicos text, servico_ids uuid[], valor numeric,
               forma_pagamento forma_pagamento, ofertas int)
language sql stable as $$
  select a.id, a.inicio, a.fim, a.status, a.cliente_id, c.nome,
         string_agg(coalesce(s.nome, p.nome), ' + ' order by i.veio_de_oferta, s.categoria, coalesce(s.nome, p.nome)),
         array_remove(array_agg(i.servico_id), null),
         coalesce(sum(i.valor), 0),
         a.forma_pagamento,
         (select count(*) from ofertas o where o.atendimento_id = a.id)::int
  from atendimentos a
  left join clientes c on c.id = a.cliente_id
  left join atendimento_itens i on i.atendimento_id = a.id
  left join servicos s on s.id = i.servico_id
  left join produtos p on p.id = i.produto_id
  where a.barbeiro_id = auth.uid()
    and (a.inicio at time zone 'America/Sao_Paulo')::date = p_dia
  group by a.id, c.nome
  order by a.inicio
$$;

-- Fecha o caixa do dia (guarda o retrato do faturamento). Repetir não duplica.
create or replace function fechar_caixa(p_dia date default (now() at time zone 'America/Sao_Paulo')::date)
returns table (faturamento numeric, atendimentos int)
language plpgsql as $$
declare r record;
begin
  select * into r from resumo_dia(p_dia);
  insert into caixas (barbeiro_id, dia, faturamento, atendimentos)
  values (auth.uid(), p_dia, r.faturamento, r.atendimentos)
  on conflict (barbeiro_id, dia) do nothing;
  return query select c.faturamento, c.atendimentos from caixas c where c.barbeiro_id = auth.uid() and c.dia = p_dia;
end $$;

-- Atendimento de dia com caixa fechado não muda (a não ser reabrindo o caixa).
create or replace function reabrir_caixa(p_dia date) returns void
language sql as $$ delete from caixas where barbeiro_id = auth.uid() and dia = p_dia $$;

-- ---------- Exportar dados (todos os planos) ----------
-- Uma linha por atendimento, com o total calculado aqui.
create or replace function exportar_atendimentos()
returns table (data date, hora text, status status_atendimento, cliente text, itens text,
               valor_total numeric, taxa_cartao numeric, forma_pagamento forma_pagamento)
language sql stable as $$
  select (a.inicio at time zone 'America/Sao_Paulo')::date,
         to_char(a.inicio at time zone 'America/Sao_Paulo', 'HH24:MI'),
         a.status, c.nome,
         string_agg(coalesce(s.nome, p.nome) || case when i.quantidade > 1 then ' x' || i.quantidade else '' end, ' + '),
         coalesce(sum(i.valor), 0), a.taxa_cartao, a.forma_pagamento
  from atendimentos a
  left join clientes c on c.id = a.cliente_id
  left join atendimento_itens i on i.atendimento_id = a.id
  left join servicos s on s.id = i.servico_id
  left join produtos p on p.id = i.produto_id
  where a.barbeiro_id = auth.uid()
  group by a.id, c.nome
  order by a.inicio
$$;
