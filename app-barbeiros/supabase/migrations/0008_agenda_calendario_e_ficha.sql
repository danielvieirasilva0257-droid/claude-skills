-- =====================================================================
-- Melhorias pedidas pelo Daniel (20/11/2026)
--
-- 1. Agenda com calendário: quantos horários por dia do mês (agenda_mes) e a
--    grade do dia (agenda_grade) com o expediente (entrada, saída, pausa) e
--    cada horário com o fim previsto, serviços com preço, profissional e
--    valor: o "CRM do agendamento". O banco calcula o fim e os valores.
-- 2. Ficha do cliente: um campo livre de observações no lugar das perguntas
--    (bebida, assunto, preferências), e as técnicas do cabelo e da barba.
-- =====================================================================

alter table clientes
  add column observacoes    text,
  add column tecnica_cabelo text,
  add column tecnica_barba  text;

-- O que já estava escrito nas perguntas antigas vai para as observações.
update clientes set
  observacoes = nullif(concat_ws(E'\n',
    nullif(btrim(preferencias), ''),
    case when nullif(btrim(bebida_preferida), '') is not null then 'Bebida: ' || btrim(bebida_preferida) end,
    case when nullif(btrim(ultimo_assunto), '') is not null then 'Último assunto: ' || btrim(ultimo_assunto) end), ''),
  tecnica_cabelo = nullif(btrim(tecnica_ultimo_corte), '')
where observacoes is null and tecnica_cabelo is null;

comment on column clientes.preferencias is 'Antiga (até 0008): o texto foi para observacoes';
comment on column clientes.bebida_preferida is 'Antiga (até 0008): o texto foi para observacoes';
comment on column clientes.ultimo_assunto is 'Antiga (até 0008): o texto foi para observacoes';
comment on column clientes.tecnica_ultimo_corte is 'Antiga (até 0008): o texto foi para tecnica_cabelo';

-- ---------- Calendário: horários de cada dia do mês ----------
create or replace function agenda_mes(p_mes date default date_trunc('month', hoje_br())::date)
returns table (dia date, agendados int, concluidos int, faltas int)
language sql stable as $$
  select (a.inicio at time zone 'America/Sao_Paulo')::date,
         count(*) filter (where a.status = 'agendado')::int,
         count(*) filter (where a.status = 'concluido')::int,
         count(*) filter (where a.status = 'falta')::int
  from atendimentos a
  where a.barbeiro_id = auth.uid() and a.status <> 'cancelado'
    and (a.inicio at time zone 'America/Sao_Paulo')::date >= date_trunc('month', p_mes)::date
    and (a.inicio at time zone 'America/Sao_Paulo')::date < (date_trunc('month', p_mes) + interval '1 month')::date
  group by 1
  order by 1
$$;

-- ---------- Grade do dia (estilo agenda de salão) ----------
-- expediente: o do dia da semana; sem expediente cadastrado, 9h às 19h;
-- folga: o barbeiro cadastrou expediente, mas não neste dia da semana.
create or replace function agenda_grade(p_dia date default hoje_br())
returns jsonb language sql stable as $$
  with e as (
    select inicio, fim, pausa_inicio, pausa_fim from expediente
     where barbeiro_id = auth.uid() and dia_semana = extract(isodow from p_dia)::int
  ),
  itens as (
    select a.id, a.inicio, a.status, a.forma_pagamento, a.cliente_id, c.nome as cliente,
           coalesce(nullif(a.fim, a.inicio), a.inicio + make_interval(mins => greatest(coalesce((
             select sum(case when i.simultaneo then 0 else s.duracao_min * i.quantidade end)
               from atendimento_itens i join servicos s on s.id = i.servico_id
              where i.atendimento_id = a.id), 0), 30)::int)) as fim,
           coalesce((select jsonb_agg(jsonb_build_object('nome', coalesce(s.nome, p.nome), 'valor', i.valor,
                       'duracao', s.duracao_min, 'extra', i.veio_de_oferta)
                       order by i.veio_de_oferta, s.categoria, coalesce(s.nome, p.nome))
                     from atendimento_itens i
                     left join servicos s on s.id = i.servico_id
                     left join produtos p on p.id = i.produto_id
                    where i.atendimento_id = a.id), '[]'::jsonb) as itens,
           (select string_agg(coalesce(s.nome, p.nome), ' + ' order by i.veio_de_oferta, s.categoria, coalesce(s.nome, p.nome))
              from atendimento_itens i
              left join servicos s on s.id = i.servico_id
              left join produtos p on p.id = i.produto_id
             where i.atendimento_id = a.id) as servicos,
           coalesce((select array_agg(i.servico_id) from atendimento_itens i
                      where i.atendimento_id = a.id and i.servico_id is not null), '{}') as servico_ids,
           coalesce((select sum(valor) from atendimento_itens where atendimento_id = a.id), 0) as valor,
           (select count(*) from ofertas o where o.atendimento_id = a.id)::int as ofertas
    from atendimentos a
    left join clientes c on c.id = a.cliente_id
    where a.barbeiro_id = auth.uid() and a.status <> 'cancelado'
      and (a.inicio at time zone 'America/Sao_Paulo')::date = p_dia
  )
  select jsonb_build_object(
    'dia', p_dia,
    'profissional', (select nome from barbeiros where id = auth.uid()),
    'expediente', coalesce(
      (select jsonb_build_object('inicio', to_char(e.inicio, 'HH24:MI'), 'fim', to_char(e.fim, 'HH24:MI'),
              'pausa_inicio', to_char(e.pausa_inicio, 'HH24:MI'), 'pausa_fim', to_char(e.pausa_fim, 'HH24:MI'), 'definido', true) from e),
      jsonb_build_object('inicio', '09:00', 'fim', '19:00', 'pausa_inicio', null, 'pausa_fim', null, 'definido', false)),
    'folga', not exists (select 1 from e) and exists (select 1 from expediente where barbeiro_id = auth.uid()),
    'caixa_fechado', exists (select 1 from caixas where barbeiro_id = auth.uid() and dia = p_dia),
    'itens', coalesce((select jsonb_agg(jsonb_build_object(
               'id', id, 'inicio', inicio, 'fim', fim, 'status', status, 'forma_pagamento', forma_pagamento,
               'cliente_id', cliente_id, 'cliente', cliente, 'itens', itens, 'servicos', servicos,
               'servico_ids', servico_ids, 'valor', valor, 'ofertas', ofertas) order by inicio) from itens), '[]'::jsonb)
  )
$$;
