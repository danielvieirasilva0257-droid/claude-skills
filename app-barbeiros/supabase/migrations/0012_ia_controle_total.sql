-- IA com controle total (pedido do Daniel, 22/11/2026): números sob medida
-- de qualquer período e filtro (o banco calcula, a IA só interpreta), a lista
-- de comandas para achar a do "dia X", editar e apagar uma comanda (sempre com
-- confirmação no app) e relatórios em HTML guardados para abrir depois.
-- Tudo com as permissões de quem está logado (auth.uid()).

-- ---------- Período em horário de Brasília ----------
create or replace function inicio_dia_br(p_dia date) returns timestamptz
language sql immutable as $$ select (p_dia::timestamp at time zone 'America/Sao_Paulo') $$;

-- ---------- Números sob medida ----------
-- Comandas concluídas de [p_de, p_ate] (dias inteiros, Brasília), com filtros
-- opcionais, e um agrupamento opcional. Faturamento = soma dos itens; lucro
-- igual ao da tela Início (faturamento - taxas - insumos - gastos do período).
create or replace function analisar_periodo(
  p_de date,
  p_ate date,
  p_agrupar text default null,          -- dia, semana, mes, dia_da_semana, hora, servico, cliente, forma_pagamento
  p_cliente uuid default null,
  p_servico uuid default null,
  p_forma forma_pagamento default null
) returns jsonb
language plpgsql as $$   -- volatile: it fills a temporary table
declare
  v_eu uuid := auth.uid();
  v_total jsonb;
  v_grupos jsonb;
  v_dias int;
  v_gastos numeric;
begin
  if v_eu is null then raise exception 'sem login'; end if;
  if p_de is null or p_ate is null or p_ate < p_de then raise exception 'período inválido'; end if;
  if p_ate - p_de > 731 then raise exception 'período maior que 2 anos'; end if;
  if p_agrupar is not null and p_agrupar not in ('dia', 'semana', 'mes', 'dia_da_semana', 'hora', 'servico', 'cliente', 'forma_pagamento') then
    raise exception 'agrupamento desconhecido: %', p_agrupar;
  end if;
  v_dias := p_ate - p_de + 1;

  if to_regclass('pg_temp.t_analise') is null then
  create temp table t_analise (
    id uuid, cliente_id uuid, cliente text, inicio timestamptz, forma forma_pagamento,
    total numeric, taxa numeric, insumo numeric, qtd_servicos int
  ) on commit drop;
  end if;
  truncate t_analise;
  insert into t_analise
  select r.atendimento_id, r.cliente_id, c.nome, r.inicio, a.forma_pagamento,
         r.valor_total, r.taxa_cartao, r.custo_insumo, r.qtd_servicos
  from v_atendimento_resumo r
  join atendimentos a on a.id = r.atendimento_id
  left join clientes c on c.id = r.cliente_id
  where r.barbeiro_id = v_eu
    and r.inicio >= inicio_dia_br(p_de) and r.inicio < inicio_dia_br(p_ate + 1)
    and (p_cliente is null or r.cliente_id = p_cliente)
    and (p_forma is null or a.forma_pagamento = p_forma)
    and (p_servico is null or exists (select 1 from atendimento_itens i where i.atendimento_id = r.atendimento_id and i.servico_id = p_servico));

  -- Gastos só entram quando o recorte é o negócio inteiro (sem filtro de cliente, serviço ou pagamento).
  v_gastos := case when p_cliente is null and p_servico is null and p_forma is null then
    (select coalesce(sum(valor), 0) from gastos where barbeiro_id = v_eu and data between p_de and p_ate) end;

  select jsonb_build_object(
    'atendimentos', count(*),
    'faturamento', coalesce(sum(total), 0),
    'ticket_medio', case when count(*) > 0 then round(avg(total), 2) end,
    'clientes_unicos', count(distinct cliente_id),
    'servicos_por_atendimento', case when count(*) > 0 then round(sum(qtd_servicos)::numeric / count(*), 2) end,
    'dias_no_periodo', v_dias,
    'dias_com_atendimento', count(distinct (inicio at time zone 'America/Sao_Paulo')::date),
    'faturamento_medio_por_dia_trabalhado', case when count(*) > 0 then
      round(sum(total) / count(distinct (inicio at time zone 'America/Sao_Paulo')::date), 2) end,
    'taxas_cartao', coalesce(sum(taxa), 0),
    'gastos', v_gastos,
    'lucro', case when v_gastos is not null then coalesce(sum(total) - sum(taxa) - sum(insumo), 0) - v_gastos end,
    'valor_do_servico_filtrado', case when p_servico is not null then
      (select coalesce(sum(i.valor), 0) from atendimento_itens i where i.servico_id = p_servico and i.atendimento_id in (select id from t_analise)) end
  ) into v_total from t_analise;

  if p_agrupar in ('dia', 'semana', 'mes', 'dia_da_semana', 'hora', 'cliente', 'forma_pagamento') then
    select coalesce(jsonb_agg(g order by g.ordem), '[]'::jsonb) into v_grupos from (
      select case p_agrupar
               when 'dia' then to_char(inicio at time zone 'America/Sao_Paulo', 'YYYY-MM-DD')
               when 'semana' then to_char(date_trunc('week', inicio at time zone 'America/Sao_Paulo'), 'YYYY-MM-DD')
               when 'mes' then to_char(inicio at time zone 'America/Sao_Paulo', 'YYYY-MM')
               when 'dia_da_semana' then (array['domingo','segunda','terça','quarta','quinta','sexta','sábado'])[extract(dow from inicio at time zone 'America/Sao_Paulo')::int + 1]
               when 'hora' then to_char(inicio at time zone 'America/Sao_Paulo', 'HH24') || 'h'
               when 'cliente' then coalesce(cliente, 'sem cliente')
               else coalesce(forma::text, 'sem forma')
             end as grupo,
             count(*) as atendimentos,
             sum(total) as faturamento,
             round(avg(total), 2) as ticket_medio,
             case p_agrupar
               when 'dia_da_semana' then min(extract(dow from inicio at time zone 'America/Sao_Paulo'))::numeric
               when 'hora' then min(extract(hour from inicio at time zone 'America/Sao_Paulo'))::numeric
               when 'cliente' then -sum(total)
               when 'forma_pagamento' then -sum(total)
               else extract(epoch from min(inicio))::numeric
             end as ordem
      from t_analise group by 1
    ) g;
  elsif p_agrupar = 'servico' then
    select coalesce(jsonb_agg(g order by g.faturamento desc), '[]'::jsonb) into v_grupos from (
      select coalesce(s.nome, p.nome) as grupo, sum(i.quantidade)::int as quantidade, sum(i.valor) as faturamento,
             round(sum(i.valor) / nullif(sum(i.quantidade), 0), 2) as preco_medio
      from t_analise t join atendimento_itens i on i.atendimento_id = t.id
      left join servicos s on s.id = i.servico_id left join produtos p on p.id = i.produto_id
      group by 1
    ) g;
  end if;

  return jsonb_build_object('de', p_de, 'ate', p_ate, 'total', v_total, 'agrupado_por', p_agrupar, 'grupos', v_grupos);
end $$;

-- ---------- Comandas de um período ----------
create or replace function listar_atendimentos(
  p_de date,
  p_ate date,
  p_cliente uuid default null,
  p_status status_atendimento default null,
  p_limite int default 60
) returns jsonb
language sql stable as $$
  select coalesce(jsonb_agg(x order by x.inicio), '[]'::jsonb) from (
    select a.id, a.inicio,
           to_char(a.inicio at time zone 'America/Sao_Paulo', 'YYYY-MM-DD') as dia,
           to_char(a.inicio at time zone 'America/Sao_Paulo', 'HH24:MI') as hora,
           c.nome as cliente, a.status, a.forma_pagamento,
           coalesce((select jsonb_agg(jsonb_build_object('item', coalesce(s.nome, p.nome), 'valor', i.valor) order by i.valor desc)
                       from atendimento_itens i left join servicos s on s.id = i.servico_id left join produtos p on p.id = i.produto_id
                      where i.atendimento_id = a.id), '[]'::jsonb) as itens,
           (select coalesce(sum(valor), 0) from atendimento_itens where atendimento_id = a.id) as total,
           a.observacao
    from atendimentos a left join clientes c on c.id = a.cliente_id
    where a.barbeiro_id = auth.uid()
      and a.inicio >= inicio_dia_br(p_de) and a.inicio < inicio_dia_br(p_ate + 1)
      and (p_cliente is null or a.cliente_id = p_cliente)
      and (p_status is null or a.status = p_status)
    order by a.inicio
    limit greatest(1, least(coalesce(p_limite, 60), 200))
  ) x
$$;

-- ---------- Editar uma comanda ----------
-- Só muda o que vier preenchido. Serviços: troca os serviços (os produtos ficam).
-- Valor total: reparte o novo total entre os itens na proporção de antes.
-- Dia de caixa fechado não muda (reabra o caixa antes).
create or replace function editar_atendimento(
  p_atendimento uuid,
  p_servicos uuid[] default null,
  p_valor_total numeric default null,
  p_forma forma_pagamento default null,
  p_inicio timestamptz default null,
  p_cliente uuid default null,
  p_sem_cliente boolean default false,
  p_observacao text default null
) returns jsonb
language plpgsql as $$
declare
  v_eu uuid := auth.uid();
  a atendimentos%rowtype;
  v_antes numeric;
  v_fator numeric;
  v_dif numeric;
begin
  select * into a from atendimentos where id = p_atendimento and barbeiro_id = v_eu for update;
  if not found then raise exception 'comanda não encontrada'; end if;
  if exists (select 1 from caixas where barbeiro_id = v_eu and dia in ((a.inicio at time zone 'America/Sao_Paulo')::date,
             (coalesce(p_inicio, a.inicio) at time zone 'America/Sao_Paulo')::date)) and a.status = 'concluido' then
    raise exception 'o caixa desse dia está fechado: reabra o caixa antes de mudar';
  end if;
  if p_valor_total is not null and p_valor_total < 0 then raise exception 'valor inválido'; end if;
  if p_cliente is not null and not exists (select 1 from clientes where id = p_cliente and barbeiro_id = v_eu) then
    raise exception 'cliente não encontrado';
  end if;

  if p_servicos is not null then
    if coalesce(array_length(p_servicos, 1), 0) = 0 then raise exception 'escolha pelo menos um serviço'; end if;
    if exists (select 1 from unnest(p_servicos) x(id) where not exists (select 1 from servicos s where s.id = x.id and s.barbeiro_id = v_eu)) then
      raise exception 'serviço não encontrado';
    end if;
    delete from atendimento_itens where atendimento_id = p_atendimento and servico_id is not null;
    insert into atendimento_itens (atendimento_id, servico_id, valor)
    select p_atendimento, s.id, s.preco from unnest(p_servicos) x(id) join servicos s on s.id = x.id;
  end if;

  if p_valor_total is not null then
    select coalesce(sum(valor), 0) into v_antes from atendimento_itens where atendimento_id = p_atendimento;
    if v_antes = 0 then raise exception 'a comanda não tem itens'; end if;
    v_fator := p_valor_total / v_antes;
    update atendimento_itens set valor = round(valor * v_fator, 2) where atendimento_id = p_atendimento;
    -- Centavos que sobraram do arredondamento vão para o item mais caro.
    select p_valor_total - sum(valor) into v_dif from atendimento_itens where atendimento_id = p_atendimento;
    if v_dif <> 0 then
      update atendimento_itens set valor = valor + v_dif
       where id = (select id from atendimento_itens where atendimento_id = p_atendimento order by valor desc, id limit 1);
    end if;
  end if;

  update atendimentos set
    forma_pagamento = case when p_forma is not null then p_forma else forma_pagamento end,
    inicio = coalesce(p_inicio, inicio),
    cliente_id = case when p_sem_cliente then null when p_cliente is not null then p_cliente else cliente_id end,
    observacao = case when p_observacao is not null then nullif(btrim(p_observacao), '') else observacao end
  where id = p_atendimento;
  perform recalcular_atendimento(p_atendimento);

  return (select x from jsonb_array_elements(listar_atendimentos(
            (coalesce(p_inicio, a.inicio) at time zone 'America/Sao_Paulo')::date,
            (coalesce(p_inicio, a.inicio) at time zone 'America/Sao_Paulo')::date, null, null, 200)) x
          where x->>'id' = p_atendimento::text);
end $$;

-- ---------- Apagar uma comanda lançada por engano ----------
create or replace function apagar_atendimento(p_atendimento uuid) returns void
language plpgsql as $$
declare a atendimentos%rowtype;
begin
  select * into a from atendimentos where id = p_atendimento and barbeiro_id = auth.uid();
  if not found then raise exception 'comanda não encontrada'; end if;
  if a.status = 'concluido' and exists (select 1 from caixas where barbeiro_id = auth.uid()
       and dia = (a.inicio at time zone 'America/Sao_Paulo')::date) then
    raise exception 'o caixa desse dia está fechado: reabra o caixa antes de apagar';
  end if;
  delete from atendimentos where id = p_atendimento;
end $$;

-- ---------- Relatórios feitos pela IA (página HTML com os números do banco) ----------
create table relatorios_ia (
  id          uuid primary key default gen_random_uuid(),
  barbeiro_id uuid not null default auth.uid() references barbeiros(id) on delete cascade,
  titulo      text not null check (char_length(btrim(titulo)) between 2 and 120),
  periodo     text,
  html        text not null check (char_length(html) <= 600000),
  criado_em   timestamptz not null default now()
);
create index relatorios_ia_barbeiro on relatorios_ia (barbeiro_id, criado_em desc);
alter table relatorios_ia enable row level security;
create policy dono_relatorios_ia on relatorios_ia for all using (barbeiro_id = auth.uid()) with check (barbeiro_id = auth.uid());
