-- =====================================================================
-- 0004 · Fase 3 (plano Pago e IA): clientes, financeiro, meta, conquistas,
-- relatórios, comissão, MEI, sinais para a IA e uso da IA.
-- O banco calcula, a IA interpreta: toda conta e todo número que a IA cita
-- sai daqui pronto.
-- =====================================================================

-- ---------- Parâmetros que mudam por ano (MEI, limites da IA) ----------
create table parametros (
  chave         text not null,
  vigente_desde date not null,
  valor         numeric(12,2) not null,
  descricao     text not null,
  primary key (chave, vigente_desde)
);
alter table parametros enable row level security;
create policy leitura_parametros on parametros for select using (true);

insert into parametros values
  ('mei_limite_anual',  '2018-01-01', 81000.00, 'Teto de faturamento do MEI por ano (LC 155/2016)'),
  ('das_mei_servicos',  '2026-01-01',    86.05, 'DAS MEI serviços 2026: 5% do salário mínimo (R$ 1.621) + R$ 5 de ISS'),
  ('ia_chat_dia_pago',       '2026-01-01', 20, 'Perguntas ao chat da IA por dia, plano Pago'),
  ('ia_chat_dia_premium',    '2026-01-01', 40, 'Perguntas ao chat da IA por dia, plano Premium'),
  ('ia_chat_dia_plus',       '2026-01-01', 80, 'Perguntas ao chat da IA por dia, plano Premium Plus'),
  ('ia_chat_dia_barbearias', '2026-01-01', 40, 'Perguntas ao chat da IA por dia, plano Barbearias'),
  ('ia_narrativa_dia',       '2026-01-01', 10, 'Narrativas pedidas à IA por dia'),
  ('ia_insights_dia',        '2026-01-01',  3, 'Gerações de insights por dia (cron + fechar o caixa)');

create or replace function parametro(p_chave text, p_data date default (now() at time zone 'America/Sao_Paulo')::date)
returns numeric language sql stable as $$
  select valor from parametros where chave = p_chave and vigente_desde <= p_data
   order by vigente_desde desc limit 1
$$;

-- Hoje e mês corrente no horário de Brasília (o banco já está nesse fuso
-- desde a 0002; as funções abaixo não dependem disso).
create or replace function hoje_br() returns date
language sql stable as $$ select (now() at time zone 'America/Sao_Paulo')::date $$;

-- ---------- Clientes ----------
create view v_clientes_lista as
select c.id, c.barbeiro_id, c.nome, c.apelido, c.telefone, c.status, c.origem, c.pode_receber_oferta,
       c.aceita_contato, c.criado_em,
       coalesce(f.visitas, 0) as visitas, f.ultima_visita, f.intervalo_medio_dias, f.ticket_medio,
       f.pct_visitas_com_extra,
       (hoje_br() - f.ultima_visita) as dias_sem_vir,
       (s.cliente_id is not null) as sumido,
       (select min(a.inicio) from atendimentos a
         where a.cliente_id = c.id and a.status = 'agendado' and a.inicio > now()) as proximo_horario,
       (select count(*) from v_cliente_servico_status st where st.cliente_id = c.id and st.na_hora)::int as servicos_na_hora
from clientes c
left join v_cliente_frequencia f on f.cliente_id = c.id
left join v_clientes_sumidos s on s.cliente_id = c.id;
alter view v_clientes_lista set (security_invoker = on);

-- ---------- Financeiro: faturamento, gastos e lucro por dia, semana ou mês ----------
create or replace function financeiro(p_inicio date, p_fim date, p_agrupar text default 'day')
returns table (periodo date, atendimentos int, faturamento numeric, taxas numeric, insumos numeric,
               gastos numeric, lucro numeric)
language plpgsql stable as $$
begin
  if p_agrupar not in ('day', 'week', 'month', 'total') then raise exception 'agrupar: day, week, month ou total'; end if;
  return query
  with per as (
    select case when p_agrupar = 'total' then p_inicio
                else date_trunc(p_agrupar, g)::date end as periodo
    from generate_series(p_inicio, p_fim, interval '1 day') g
    group by 1
  ),
  at as (
    select case when p_agrupar = 'total' then p_inicio
                else date_trunc(p_agrupar, (r.inicio at time zone 'America/Sao_Paulo')::date)::date end as periodo,
           count(*) as n, sum(r.valor_total) as fat, sum(r.taxa_cartao) as tx, sum(r.custo_insumo) as ins
    from v_atendimento_resumo r
    where r.barbeiro_id = auth.uid()
      and (r.inicio at time zone 'America/Sao_Paulo')::date between p_inicio and p_fim
    group by 1
  ),
  prod as (
    select case when p_agrupar = 'total' then p_inicio
                else date_trunc(p_agrupar, (a.inicio at time zone 'America/Sao_Paulo')::date)::date end as periodo,
           sum(p.custo * i.quantidade) as custo
    from atendimentos a
    join atendimento_itens i on i.atendimento_id = a.id
    join produtos p on p.id = i.produto_id
    where a.barbeiro_id = auth.uid() and a.status = 'concluido'
      and (a.inicio at time zone 'America/Sao_Paulo')::date between p_inicio and p_fim
    group by 1
  ),
  gs as (
    select case when p_agrupar = 'total' then p_inicio else date_trunc(p_agrupar, g.data)::date end as periodo,
           sum(g.valor) as total
    from gastos g
    where g.barbeiro_id = auth.uid() and g.data between p_inicio and p_fim
    group by 1
  )
  select per.periodo,
         coalesce(at.n, 0)::int,
         coalesce(at.fat, 0),
         coalesce(at.tx, 0),
         coalesce(at.ins, 0) + coalesce(prod.custo, 0),
         coalesce(gs.total, 0),
         coalesce(at.fat, 0) - coalesce(at.tx, 0) - coalesce(at.ins, 0) - coalesce(prod.custo, 0) - coalesce(gs.total, 0)
  from per
  left join at on at.periodo = per.periodo
  left join prod on prod.periodo = per.periodo
  left join gs on gs.periodo = per.periodo
  order by per.periodo;
end $$;

-- ---------- Meta do mês ----------
create or replace function definir_meta(p_mes date, p_valor numeric, p_sugerida boolean default false)
returns void language plpgsql as $$
begin
  if p_valor is null or p_valor <= 0 then raise exception 'meta inválida'; end if;
  delete from metas where barbeiro_id = auth.uid() and mes = date_trunc('month', p_mes)::date
                      and tipo = 'faturamento' and servico_id is null;
  insert into metas (barbeiro_id, mes, tipo, valor_alvo, sugerida_pela_ia, aceita, base_calculo)
  values (auth.uid(), date_trunc('month', p_mes)::date, 'faturamento', round(p_valor, 2), p_sugerida, true,
          case when p_sugerida then sugerir_metas(auth.uid(), date_trunc('month', p_mes)::date) end);
end $$;

-- Progresso da meta de faturamento: tudo que a tela de Meta mostra.
-- Recebe o barbeiro de forma explícita e roda com as permissões de quem
-- chama: um barbeiro que pede o de outro recebe tudo vazio (RLS).
create or replace function progresso_meta_barbeiro(p_barbeiro uuid, p_mes date default date_trunc('month', hoje_br())::date)
returns jsonb language plpgsql stable as $$
declare
  v_mes date := date_trunc('month', p_mes)::date;
  v_meta numeric;
  v_real numeric;
  v_sug jsonb;
  v_preco numeric;
  v_dias_mes int := extract(day from (v_mes + interval '1 month - 1 day'))::int;
  v_dia int;
  v_proj numeric;
  v_falta numeric;
  v_dias_trab numeric;
begin
  select valor_alvo into v_meta from metas
   where barbeiro_id = p_barbeiro and mes = v_mes and tipo = 'faturamento' and servico_id is null and aceita;
  select coalesce(faturamento, 0) into v_real from v_metricas_mes where barbeiro_id = p_barbeiro and mes = v_mes;
  v_real := coalesce(v_real, 0);
  v_sug := sugerir_metas(p_barbeiro, v_mes);
  select preco_corte, dias_trabalho_semana into v_preco, v_dias_trab from barbeiros where id = p_barbeiro;
  v_dia := case when v_mes = date_trunc('month', hoje_br())::date then extract(day from hoje_br())::int
                when v_mes < date_trunc('month', hoje_br())::date then v_dias_mes else 0 end;
  v_proj := case when v_dia > 0 then round(v_real / v_dia * v_dias_mes, 2) end;
  v_falta := greatest(0, coalesce(v_meta, 0) - v_real);
  return jsonb_build_object(
    'mes', v_mes,
    'meta', v_meta,
    'sugerida', (v_sug->'metas'->>'faturamento')::numeric,
    'aviso_sugestao', v_sug->>'aviso',
    'realizado', v_real,
    'pct', case when v_meta > 0 then round(v_real / v_meta, 3) end,
    'falta', case when v_meta > 0 then v_falta end,
    'cortes_faltando', case when v_meta > 0 and v_preco > 0 then ceil(v_falta / v_preco)::int end,
    'dias_restantes', greatest(0, v_dias_mes - v_dia),
    'por_dia_trabalhado', case when v_meta > 0 and v_dias_mes - v_dia > 0
                               then round(v_falta / greatest(1, round((v_dias_mes - v_dia) * coalesce(v_dias_trab, 6) / 7.0)), 2) end,
    'projecao', v_proj,
    'em_risco', coalesce(v_meta > 0 and v_real < v_meta and v_dia >= 5 and v_proj < v_meta * 0.95, false),
    'base_sugestao', v_sug
  );
end $$;

create or replace function progresso_meta(p_mes date default date_trunc('month', hoje_br())::date)
returns jsonb language sql stable as $$ select progresso_meta_barbeiro(auth.uid(), p_mes) $$;

-- ---------- Conquistas (celebradas uma vez) ----------
create table conquistas (
  barbeiro_id  uuid not null references barbeiros(id) on delete cascade,
  tipo         text not null check (tipo in ('meta_50', 'meta_100', 'recorde_mes', 'primeiro_caixa')),
  referencia   text not null,                 -- ex.: '2026-11'
  valor        numeric(12,2),
  alcancada_em timestamptz not null default now(),
  celebrada_em timestamptz,
  primary key (barbeiro_id, tipo, referencia)
);
alter table conquistas enable row level security;
create policy dono_conquistas on conquistas for all using (barbeiro_id = auth.uid()) with check (barbeiro_id = auth.uid());

-- Registra o que foi alcançado e devolve o que ainda não foi comemorado.
create or replace function verificar_conquistas()
returns table (tipo text, referencia text, valor numeric)
language plpgsql as $$
declare
  v_mes date := date_trunc('month', hoje_br())::date;
  v_ref text := to_char(v_mes, 'YYYY-MM');
  p jsonb := progresso_meta(v_mes);
  v_real numeric := (p->>'realizado')::numeric;
  v_recorde numeric;
  v_meses int;
begin
  if (p->>'pct')::numeric >= 0.5 then
    insert into conquistas (barbeiro_id, tipo, referencia, valor) values (auth.uid(), 'meta_50', v_ref, v_real) on conflict do nothing;
  end if;
  if (p->>'pct')::numeric >= 1 then
    insert into conquistas (barbeiro_id, tipo, referencia, valor) values (auth.uid(), 'meta_100', v_ref, v_real) on conflict do nothing;
  end if;
  select max(faturamento), count(*) into v_recorde, v_meses from v_metricas_mes
   where barbeiro_id = auth.uid() and mes < v_mes;
  if v_meses >= 2 and v_real > v_recorde then
    insert into conquistas (barbeiro_id, tipo, referencia, valor) values (auth.uid(), 'recorde_mes', v_ref, v_real) on conflict do nothing;
  end if;
  if exists (select 1 from caixas where barbeiro_id = auth.uid()) then
    insert into conquistas (barbeiro_id, tipo, referencia, valor) values (auth.uid(), 'primeiro_caixa', 'sempre', null) on conflict do nothing;
  end if;
  return query select c.tipo, c.referencia, c.valor from conquistas c
    where c.barbeiro_id = auth.uid() and c.celebrada_em is null order by c.alcancada_em;
end $$;

create or replace function celebrar_conquista(p_tipo text, p_referencia text) returns void
language sql as $$
  update conquistas set celebrada_em = now()
   where barbeiro_id = auth.uid() and tipo = p_tipo and referencia = p_referencia
$$;

-- ---------- Relatórios ----------
-- Mapa de calor: atendimentos concluídos por dia da semana e hora (90 dias).
create view v_mapa_calor as
select a.barbeiro_id,
       extract(isodow from a.inicio at time zone 'America/Sao_Paulo')::int as dia_semana,
       extract(hour from a.inicio at time zone 'America/Sao_Paulo')::int as hora,
       count(*)::int as atendimentos
from atendimentos a
where a.status = 'concluido' and a.inicio >= now() - interval '90 days'
group by 1, 2, 3;
alter view v_mapa_calor set (security_invoker = on);

-- Tudo do relatório do mês num pedido só, com as variações já calculadas.
create or replace function relatorio_mes(p_mes date default date_trunc('month', hoje_br())::date)
returns jsonb language sql stable as $$
  with mes as (select date_trunc('month', p_mes)::date as m),
  atual as (select v.* from v_metricas_mes v, mes where v.barbeiro_id = auth.uid() and v.mes = mes.m),
  ant as (select v.* from v_metricas_mes v, mes where v.barbeiro_id = auth.uid() and v.mes = (mes.m - interval '1 month')::date)
  select jsonb_build_object(
    'mes', (select m from mes),
    'atual', (select to_jsonb(atual) from atual),
    'anterior', (select to_jsonb(ant) from ant),
    'variacao', jsonb_build_object(
      'faturamento', (select round((atual.faturamento - ant.faturamento) / nullif(ant.faturamento, 0), 3) from atual, ant),
      'ticket_medio', (select round((atual.ticket_medio - ant.ticket_medio) / nullif(ant.ticket_medio, 0), 3) from atual, ant),
      'atendimentos', (select round((atual.atendimentos - ant.atendimentos)::numeric / nullif(ant.atendimentos, 0), 3) from atual, ant),
      'ratio', (select atual.ratio_servicos_por_cliente - ant.ratio_servicos_por_cliente from atual, ant)
    ),
    'saude', (select to_jsonb(s) from v_saude_cadeira s where s.barbeiro_id = auth.uid()),
    'mix_servicos', coalesce((select jsonb_agg(jsonb_build_object('nome', x.nome, 'qtd', x.qtd, 'qtd_mes_anterior', coalesce(x.qtd_mes_anterior, 0),
                                'faturamento', x.faturamento) order by x.qtd desc)
                              from v_mix_servicos_mes x, mes where x.barbeiro_id = auth.uid() and x.mes = mes.m), '[]'),
    'mix_produtos', coalesce((select jsonb_agg(jsonb_build_object('nome', x.nome, 'qtd', x.qtd, 'qtd_mes_anterior', coalesce(x.qtd_mes_anterior, 0),
                                'faturamento', x.faturamento) order by x.qtd desc)
                              from v_mix_produtos_mes x, mes where x.barbeiro_id = auth.uid() and x.mes = mes.m), '[]'),
    'aceitacao', coalesce((select jsonb_agg(jsonb_build_object('item', a.item, 'ofertas', a.ofertas, 'aceitas', a.aceitas, 'taxa', a.taxa,
                              'poucos_dados', a.poucos_dados) order by a.ofertas desc)
                           from v_aceitacao_item a where a.barbeiro_id = auth.uid()), '[]'),
    'mapa_calor', coalesce((select jsonb_agg(jsonb_build_object('dia_semana', h.dia_semana, 'hora', h.hora, 'atendimentos', h.atendimentos))
                            from v_mapa_calor h where h.barbeiro_id = auth.uid()), '[]'),
    'mapa_max', (select max(atendimentos) from v_mapa_calor h where h.barbeiro_id = auth.uid())
  )
$$;

-- Resumo da semana (carrossel dos insights): esta semana x a anterior.
create or replace function resumo_semana() returns jsonb
language sql stable as $$
  with s as (select date_trunc('week', hoje_br())::date as ini),
  esta as (select * from financeiro((select ini from s), hoje_br(), 'total')),
  ant  as (select * from financeiro((select ini from s) - 7, (select ini from s) - 1, 'total')),
  dias as (select * from financeiro((select ini from s) - 7, hoje_br(), 'day'))
  select jsonb_build_object(
    'inicio', (select ini from s),
    'faturamento', (select faturamento from esta),
    'faturamento_anterior', (select faturamento from ant),
    'variacao', (select round((esta.faturamento - ant.faturamento) / nullif(ant.faturamento, 0), 3) from esta, ant),
    'atendimentos', (select atendimentos from esta),
    'atendimentos_anterior', (select atendimentos from ant),
    'lucro', (select lucro from esta),
    'melhor_dia', (select jsonb_build_object('dia', periodo, 'faturamento', faturamento) from dias
                    where faturamento > 0 order by faturamento desc limit 1),
    'ofertas', (select count(*) from ofertas where barbeiro_id = auth.uid()
                   and (criado_em at time zone 'America/Sao_Paulo')::date >= (select ini from s)),
    'ofertas_aceitas', (select count(*) from ofertas where barbeiro_id = auth.uid() and aceitou
                   and (criado_em at time zone 'America/Sao_Paulo')::date >= (select ini from s))
  )
$$;

-- ---------- Comissão ----------
create or replace function minha_regra_comissao() returns jsonb
language sql stable as $$
  select (select to_jsonb(r) || jsonb_build_object('faixas', coalesce((
            select jsonb_agg(jsonb_build_object('de', f.de, 'ate', f.ate, 'pct', f.pct) order by f.de)
            from faixas_comissao f where f.regra_id = r.id), '[]'))
          from regras_comissao r
          where r.barbeiro_id = auth.uid() and r.vigente_desde <= hoje_br()
          order by r.vigente_desde desc limit 1)
$$;

-- Salva a regra (vale do 1º dia do mês corrente em diante) e as faixas.
create or replace function salvar_regra_comissao(
  p_tipo tipo_comissao, p_metodo metodo_faixa, p_base base_comissao,
  p_pct_fixo numeric, p_pct_produto numeric, p_aluguel numeric, p_faixas jsonb default '[]'
) returns uuid language plpgsql as $$
declare
  v_id uuid;
  v_desde date := date_trunc('month', hoje_br())::date;
  f jsonb;
  v_anterior numeric := null;
begin
  if p_tipo = 'fixa' and (p_pct_fixo is null or p_pct_fixo < 0 or p_pct_fixo > 1) then
    raise exception 'percentual da comissão entre 0 e 100%%';
  end if;
  if p_tipo = 'escalonada' then
    if jsonb_array_length(coalesce(p_faixas, '[]')) < 2 then raise exception 'escalonada precisa de pelo menos 2 faixas'; end if;
    for f in select * from jsonb_array_elements(p_faixas) order by (value->>'de')::numeric loop
      if v_anterior is null and (f->>'de')::numeric <> 0 then raise exception 'a primeira faixa começa em zero'; end if;
      if v_anterior is not null and (f->>'de')::numeric <> v_anterior then raise exception 'as faixas precisam emendar uma na outra'; end if;
      v_anterior := (f->>'ate')::numeric;
    end loop;
    if v_anterior is not null then raise exception 'a última faixa não tem teto (deixe "até" vazio)'; end if;
  end if;

  insert into regras_comissao (barbeiro_id, vigente_desde, tipo, metodo_faixa, base, pct_servico_fixo, pct_produto, aluguel_cadeira_mensal)
  values (auth.uid(), v_desde, p_tipo, p_metodo, p_base, p_pct_fixo, coalesce(p_pct_produto, 0), coalesce(p_aluguel, 0))
  on conflict (barbeiro_id, vigente_desde) do update
    set tipo = excluded.tipo, metodo_faixa = excluded.metodo_faixa, base = excluded.base,
        pct_servico_fixo = excluded.pct_servico_fixo, pct_produto = excluded.pct_produto,
        aluguel_cadeira_mensal = excluded.aluguel_cadeira_mensal
  returning id into v_id;

  delete from faixas_comissao where regra_id = v_id;
  if p_tipo = 'escalonada' then
    insert into faixas_comissao (regra_id, de, ate, pct)
    select v_id, (value->>'de')::numeric, (value->>'ate')::numeric, (value->>'pct')::numeric
    from jsonb_array_elements(p_faixas);
  end if;
  return v_id;
end $$;

-- Extrato completo do mês: cascata, próxima faixa e a regra usada.
create or replace function extrato_completo(p_mes date default date_trunc('month', hoje_br())::date)
returns jsonb language plpgsql stable as $$
declare
  e record;
  pf record;
  v_mes date := date_trunc('month', p_mes)::date;
begin
  select * into e from extrato_mes(auth.uid(), v_mes);
  select * into pf from proxima_faixa(auth.uid(), e.base_servicos);
  return to_jsonb(e) || jsonb_build_object(
    'mes', v_mes,
    'regra', minha_regra_comissao(),
    'pct_atual', pf.pct_atual,
    'pct_proxima', pf.pct_proxima,
    'falta_proxima', pf.falta,
    'vales_lista', coalesce((select jsonb_agg(jsonb_build_object('id', v.id, 'data', v.data, 'valor', v.valor, 'motivo', v.motivo) order by v.data)
                    from vales v where v.barbeiro_id = auth.uid() and date_trunc('month', v.data)::date = v_mes), '[]'));
end $$;

-- ---------- MEI ----------
create or replace function mei_ano(p_ano int default extract(year from hoje_br())::int)
returns jsonb language plpgsql stable as $$
declare
  v_fat numeric;
  v_lim numeric := parametro('mei_limite_anual', make_date(p_ano, 12, 31));
  v_das numeric := parametro('das_mei_servicos', least(hoje_br(), make_date(p_ano, 12, 31)));
  v_meses int := case when p_ano = extract(year from hoje_br()) then extract(month from hoje_br())::int else 12 end;
  v_pct numeric;
begin
  select coalesce(sum(valor_total), 0) into v_fat from v_atendimento_resumo
   where barbeiro_id = auth.uid() and extract(year from inicio at time zone 'America/Sao_Paulo') = p_ano;
  v_pct := round(v_fat / v_lim, 3);
  return jsonb_build_object(
    'ano', p_ano, 'faturamento', v_fat, 'limite', v_lim, 'pct', v_pct,
    'falta', greatest(0, v_lim - v_fat),
    'alerta', case when v_pct >= 1 then '100' when v_pct >= 0.8 then '80' else 'ok' end,
    'media_mensal', round(v_fat / v_meses, 2),
    'projecao_ano', round(v_fat / v_meses * 12, 2),
    'das_mensal', v_das,
    'das_ano', round(v_das * 12, 2));
end $$;

-- ---------- IA: uso diário (limite por plano) ----------
create table ia_uso (
  barbeiro_id uuid not null references barbeiros(id) on delete cascade,
  dia         date not null,
  tipo        text not null check (tipo in ('chat', 'narrativa', 'insights', 'entrevista')),
  quantidade  int not null default 0,
  primary key (barbeiro_id, dia, tipo)
);
alter table ia_uso enable row level security;
create policy leitura_ia_uso on ia_uso for select using (barbeiro_id = auth.uid());

-- Conta um uso se ainda houver saldo hoje. Chamado pelas Edge Functions.
create or replace function consumir_ia(p_barbeiro uuid, p_tipo text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_plano app_plano;
  v_limite numeric;
  v_usado int;
begin
  if p_barbeiro is distinct from auth.uid() and coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'sem permissão';
  end if;
  select coalesce((select plano from app_assinatura where barbeiro_id = p_barbeiro and status in ('ativa', 'teste')
                   and (renova_em is null or renova_em > now())), 'gratis') into v_plano;
  if v_plano = 'gratis' then return jsonb_build_object('ok', false, 'motivo', 'plano'); end if;
  v_limite := case p_tipo
    when 'chat' then parametro('ia_chat_dia_' || v_plano::text)
    when 'narrativa' then parametro('ia_narrativa_dia')
    when 'insights' then parametro('ia_insights_dia')
    else 3 end;
  select quantidade into v_usado from ia_uso where barbeiro_id = p_barbeiro and dia = hoje_br() and tipo = p_tipo;
  if coalesce(v_usado, 0) >= v_limite then
    return jsonb_build_object('ok', false, 'motivo', 'limite', 'limite', v_limite);
  end if;
  insert into ia_uso (barbeiro_id, dia, tipo, quantidade) values (p_barbeiro, hoje_br(), p_tipo, 1)
  on conflict (barbeiro_id, dia, tipo) do update set quantidade = ia_uso.quantidade + 1;
  return jsonb_build_object('ok', true, 'restante', v_limite - coalesce(v_usado, 0) - 1);
end $$;
revoke execute on function consumir_ia(uuid, text) from anon;

-- ---------- IA: sinais (o banco detecta, a IA escreve) ----------
-- Cada sinal traz o número já escrito. A IA só redige título, porquê e ação.
-- Prioridade: 1 dinheiro em jogo · 2 meta · 3 oportunidade · 4 elogio.
create or replace function sinais_insights(p_barbeiro uuid) returns jsonb
language plpgsql stable as $$
declare
  r record;
  sinais jsonb := '[]';
  v_base numeric;
  pf record;
  meta jsonb;
  v_ofertas int;
begin
  -- queda de serviço: últimos 30 dias x 30 anteriores (≥ 20%, com pelo menos 3 antes)
  for r in
    with x as (
      select s.nome,
             count(*) filter (where a.inicio >= now() - interval '30 days') as agora,
             count(*) filter (where a.inicio < now() - interval '30 days' and a.inicio >= now() - interval '60 days') as antes
      from atendimentos a join atendimento_itens i on i.atendimento_id = a.id join servicos s on s.id = i.servico_id
      where a.barbeiro_id = p_barbeiro and a.status = 'concluido' and a.inicio >= now() - interval '60 days'
      group by s.nome)
    select * from x where antes >= 3 and agora <= antes * 0.8 order by (antes - agora) desc limit 2
  loop
    sinais := sinais || jsonb_build_object('sinal', 'queda_servico', 'tipo', 'oportunidade', 'prioridade', 1,
      'servico', r.nome, 'numero', format('%s nos últimos 30 dias (%s nos 30 anteriores)', r.agora, r.antes),
      'botao', 'Ver narrativas');
  end loop;

  -- clientes sumidos
  select count(*) as n into r from v_clientes_sumidos where barbeiro_id = p_barbeiro;
  if r.n > 0 then
    sinais := sinais || jsonb_build_object('sinal', 'clientes_sumidos', 'tipo', 'clientes', 'prioridade', 1,
      'numero', format('%s cliente(s) sem voltar há mais do dobro do intervalo de sempre', r.n), 'botao', 'Ver clientes');
  end if;

  -- faixa de comissão perto (até 15% da próxima)
  select coalesce(sum(valor_servicos), 0) into v_base from v_atendimento_resumo
   where barbeiro_id = p_barbeiro and date_trunc('month', inicio)::date = date_trunc('month', hoje_br())::date;
  select * into pf from proxima_faixa(p_barbeiro, v_base);
  if pf.falta is not null and pf.falta <= (v_base + pf.falta) * 0.15 then
    sinais := sinais || jsonb_build_object('sinal', 'faixa_comissao', 'tipo', 'comissao', 'prioridade', 1,
      'numero', format('faltam R$ %s para a comissão subir de %s%% para %s%%',
                       to_char(pf.falta, 'FM999G990D00'), round(pf.pct_atual * 100), round(pf.pct_proxima * 100)),
      'botao', 'Ver extrato');
  end if;

  -- meta em risco (usa o mesmo cálculo da tela de Meta)
  meta := progresso_meta_barbeiro(p_barbeiro);
  if (meta->>'em_risco')::boolean then
    sinais := sinais || jsonb_build_object('sinal', 'meta_em_risco', 'tipo', 'meta', 'prioridade', 2,
      'numero', format('R$ %s de R$ %s; no ritmo atual fecha em R$ %s',
                       to_char((meta->>'realizado')::numeric, 'FM999G990D00'), to_char((meta->>'meta')::numeric, 'FM999G990D00'),
                       to_char((meta->>'projecao')::numeric, 'FM999G990D00')),
      'botao', 'Ver meta');
  end if;

  -- aceitação baixa (< 15% com 10+ ofertas)
  for r in select item, ofertas, aceitas from v_aceitacao_item
            where barbeiro_id = p_barbeiro and ofertas >= 10 and taxa < 0.15 order by ofertas desc limit 1
  loop
    sinais := sinais || jsonb_build_object('sinal', 'aceitacao_baixa', 'tipo', 'oportunidade', 'prioridade', 3,
      'servico', r.item, 'numero', format('%s aceitaram de %s ofertas', r.aceitas, r.ofertas), 'botao', 'Ver narrativas');
  end loop;

  -- produto parado 30 dias
  for r in select p.nome from produtos p
            where p.barbeiro_id = p_barbeiro and p.ativo
              and not exists (select 1 from atendimento_itens i join atendimentos a on a.id = i.atendimento_id
                               where i.produto_id = p.id and a.status = 'concluido' and a.inicio >= now() - interval '30 days')
            order by p.nome limit 1
  loop
    sinais := sinais || jsonb_build_object('sinal', 'produto_parado', 'tipo', 'oportunidade', 'prioridade', 3,
      'servico', r.nome, 'numero', 'nenhuma venda nos últimos 30 dias', 'botao', 'Ver coach');
  end loop;

  -- ratio caindo (último mês fechado x o anterior, queda ≥ 0,2)
  for r in with m as (select mes, ratio_servicos_por_cliente as ratio from v_metricas_mes
                       where barbeiro_id = p_barbeiro and mes < date_trunc('month', hoje_br())::date order by mes desc limit 2)
           select (select ratio from m order by mes desc limit 1) as ult, (select ratio from m order by mes limit 1) as pen,
                  (select count(*) from m) as n
  loop
    if r.n = 2 and r.pen - r.ult >= 0.2 then
      sinais := sinais || jsonb_build_object('sinal', 'ratio_caindo', 'tipo', 'alerta', 'prioridade', 3,
        'numero', format('%s serviços por cliente no último mês (%s no anterior)', to_char(r.ult, 'FM0D00'), to_char(r.pen, 'FM0D00')),
        'botao', 'Ver relatórios');
    end if;
  end loop;

  -- narrativa vencedora (≥ 60% com 5+ ofertas)
  for r in select titulo, sum(ofertas)::int as o, sum(aceitas)::int as a from v_aceitacao_narrativa
            where barbeiro_id = p_barbeiro group by narrativa_id, titulo
            having sum(ofertas) >= 5 and sum(aceitas)::numeric / sum(ofertas) >= 0.6 order by sum(aceitas)::numeric / sum(ofertas) desc limit 1
  loop
    sinais := sinais || jsonb_build_object('sinal', 'narrativa_vencedora', 'tipo', 'elogio', 'prioridade', 4,
      'narrativa', r.titulo, 'numero', format('a narrativa "%s" fecha %s de %s', r.titulo, r.a, r.o), 'botao', 'Ver narrativas');
  end loop;

  select count(*) into v_ofertas from ofertas where barbeiro_id = p_barbeiro;
  return jsonb_build_object(
    'poucos_dados', v_ofertas < 10,
    'total_ofertas', v_ofertas,
    'sinais', coalesce((select jsonb_agg(s order by (s->>'prioridade')::int) from (
                select s from jsonb_array_elements(sinais) s order by (s->>'prioridade')::int limit 3) t), '[]'));
end $$;

-- Contexto anônimo para a IA: perfil e números, nunca nome, telefone ou pagamento de cliente.
create or replace function contexto_ia(p_barbeiro uuid) returns jsonb
language sql stable as $$
  select jsonb_build_object(
    'publico', b.publico, 'estrategia', b.estrategia, 'modelo_trabalho', b.modelo_trabalho,
    'preco_corte', b.preco_corte, 'pct_visitas_com_extra_alvo', b.pct_visitas_com_extra_alvo,
    'perfil', b.ia_perfil - 'respostas',
    'mes_atual', (select to_jsonb(v) - 'barbeiro_id' from v_metricas_mes v
                   where v.barbeiro_id = b.id and v.mes = date_trunc('month', hoje_br())::date),
    'mes_anterior', (select to_jsonb(v) - 'barbeiro_id' from v_metricas_mes v
                   where v.barbeiro_id = b.id and v.mes = (date_trunc('month', hoje_br()) - interval '1 month')::date),
    'saude', (select to_jsonb(s) - 'barbeiro_id' from v_saude_cadeira s where s.barbeiro_id = b.id),
    'servicos', (select jsonb_agg(jsonb_build_object('nome', nome, 'preco', preco, 'categoria', categoria, 'duracao_min', duracao_min))
                   from servicos where barbeiro_id = b.id and ativo),
    'aceitacao', (select jsonb_agg(jsonb_build_object('item', item, 'ofertas', ofertas, 'aceitas', aceitas, 'taxa', taxa))
                   from v_aceitacao_item where barbeiro_id = b.id)
  )
  from barbeiros b where b.id = p_barbeiro
$$;
