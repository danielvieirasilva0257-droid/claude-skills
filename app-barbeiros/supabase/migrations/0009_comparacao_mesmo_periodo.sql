-- =====================================================================
-- Comparações justas (pedido do Daniel, 20/11/2026)
--
-- O mês que está correndo é comparado com o mesmo pedaço dos outros meses:
-- do dia 1 até o dia de hoje. Se hoje é dia 10, o mês passado conta do dia 1
-- ao dia 10 (e não o mês inteiro). Assim o começo do mês não fica sempre no
-- vermelho, e o barbeiro vê os números crescendo aos poucos.
--
--   vs mês passado: o mesmo pedaço do mês anterior
--   vs média:       a média dos 3 meses anteriores, no mesmo pedaço, só com
--                   os meses que tiveram atendimento nesse pedaço
--
-- Mês fechado compara o mês inteiro. A semana segue a mesma regra: segunda
-- até hoje x segunda até o mesmo dia da semana passada (e a média das 4
-- semanas anteriores). O banco calcula, a IA e as telas só mostram.
-- =====================================================================

-- Até que dia do mês comparar: hoje, no mês corrente; null = mês inteiro.
create or replace function dia_comparavel(p_mes date) returns int
language sql stable as $$
  select case when date_trunc('month', p_mes)::date = date_trunc('month', hoje_br())::date
              then extract(day from hoje_br())::int end
$$;

-- Último dia da janela de um mês: o dia N (ou o fim do mês, se o mês for mais curto).
create or replace function fim_janela_mes(p_mes date, p_ate_dia int) returns date
language sql immutable as $$
  select case when p_ate_dia is null then (date_trunc('month', p_mes) + interval '1 month - 1 day')::date
              else least(date_trunc('month', p_mes)::date + (p_ate_dia - 1),
                         (date_trunc('month', p_mes) + interval '1 month - 1 day')::date) end
$$;

-- Variação de a sobre b (fração com 3 casas); null quando não há base.
create or replace function variacao_sobre(a numeric, b numeric) returns numeric
language sql immutable as $$
  select round((a - b) / nullif(b, 0), 3)
$$;

-- Números de um período (datas no horário de Brasília), com as permissões de
-- quem chama. Sem atendimento concluído no período: null.
create or replace function metricas_periodo(p_barbeiro uuid, p_inicio date, p_fim date)
returns jsonb language sql stable as $$
  select case when count(*) = 0 then null else jsonb_build_object(
    'inicio', p_inicio,
    'fim', p_fim,
    'atendimentos', count(*),
    'faturamento', sum(valor_total),
    'ticket_medio', round(avg(valor_total), 2),
    'ratio_servicos_por_cliente', round(sum(qtd_servicos)::numeric / count(*), 2)) end
  from v_atendimento_resumo
  where barbeiro_id = p_barbeiro
    and (inicio at time zone 'America/Sao_Paulo')::date between p_inicio and p_fim
$$;

-- A comparação do mês: o mesmo pedaço do mês passado, a média dos 3 meses
-- anteriores e os 4 meses lado a lado (para o gráfico).
create or replace function comparacao_mes(p_barbeiro uuid, p_mes date default date_trunc('month', hoje_br())::date)
returns jsonb language sql stable as $$
  with p as (select date_trunc('month', p_mes)::date as m, dia_comparavel(p_mes) as n),
  met as (
    select k, mes, fim_janela_mes(mes, p.n) as fim, metricas_periodo(p_barbeiro, mes, fim_janela_mes(mes, p.n)) as v
    from p, generate_series(0, 3) k, lateral (select (p.m - make_interval(months => k))::date as mes) x
  ),
  media as (
    select count(*) as meses,
           round(avg((v->>'faturamento')::numeric), 2) as faturamento,
           round(avg((v->>'atendimentos')::numeric), 1) as atendimentos,
           round(avg((v->>'ticket_medio')::numeric), 2) as ticket_medio,
           round(avg((v->>'ratio_servicos_por_cliente')::numeric), 2) as ratio_servicos_por_cliente
    from met where k between 1 and 3 and v is not null
  )
  select jsonb_build_object(
    'ate_dia', (select n from p),
    'atual', (select v from met where k = 0),
    'anterior', (select v from met where k = 1),
    'media', (select case when meses = 0 then null else to_jsonb(media) end from media),
    'variacao_faturamento', (select variacao_sobre((a.v->>'faturamento')::numeric, (b.v->>'faturamento')::numeric)
                               from met a, met b where a.k = 0 and b.k = 1),
    'vs_media_faturamento', (select variacao_sobre((a.v->>'faturamento')::numeric, media.faturamento) from met a, media where a.k = 0),
    'meses', (select jsonb_agg(jsonb_build_object(
                'mes', mes, 'fim', fim, 'atual', k = 0,
                'faturamento', coalesce((v->>'faturamento')::numeric, 0),
                'atendimentos', coalesce((v->>'atendimentos')::int, 0),
                'vs_media', case when v is not null then variacao_sobre((v->>'faturamento')::numeric, media.faturamento) end) order by mes)
              from met, media)
  )
$$;

-- ---------- Relatório do mês (redefinido) ----------
create or replace function relatorio_mes_de(p_barbeiro uuid, p_mes date default date_trunc('month', hoje_br())::date)
returns jsonb language sql stable as $$
  with mes as (select date_trunc('month', p_mes)::date as m, dia_comparavel(p_mes) as n),
  atual as (select v.* from v_metricas_mes v, mes where v.barbeiro_id = p_barbeiro and v.mes = mes.m),
  c as (select comparacao_mes(p_barbeiro, (select m from mes)) as j),
  ant as (select (c.j->'anterior') as v from c),
  med as (select (c.j->'media') as v from c),
  -- janela do mês anterior para o mix (o mesmo pedaço)
  ja as (select (m - interval '1 month')::date as ini, fim_janela_mes((m - interval '1 month')::date, n) as fim from mes),
  mix_ant as (
    select i.servico_id, i.produto_id,
           sum(case when i.servico_id is not null then 1 else i.quantidade end) as qtd  -- como v_mix_*_mes
    from atendimentos a join atendimento_itens i on i.atendimento_id = a.id, ja
    where a.barbeiro_id = p_barbeiro and a.status = 'concluido'
      and (a.inicio at time zone 'America/Sao_Paulo')::date between ja.ini and ja.fim
    group by 1, 2
  )
  select jsonb_build_object(
    'mes', (select m from mes),
    'atual', (select to_jsonb(atual) from atual),
    'anterior', (select v from ant),
    'variacao', jsonb_build_object(
      'faturamento', (select variacao_sobre(atual.faturamento, (ant.v->>'faturamento')::numeric) from atual, ant),
      'ticket_medio', (select variacao_sobre(atual.ticket_medio, (ant.v->>'ticket_medio')::numeric) from atual, ant),
      'atendimentos', (select variacao_sobre(atual.atendimentos, (ant.v->>'atendimentos')::numeric) from atual, ant),
      'ratio', (select atual.ratio_servicos_por_cliente - (ant.v->>'ratio_servicos_por_cliente')::numeric from atual, ant)
    ),
    'media', (select v from med),
    'vs_media', jsonb_build_object(
      'faturamento', (select variacao_sobre(atual.faturamento, (med.v->>'faturamento')::numeric) from atual, med),
      'ticket_medio', (select variacao_sobre(atual.ticket_medio, (med.v->>'ticket_medio')::numeric) from atual, med),
      'atendimentos', (select variacao_sobre(atual.atendimentos, (med.v->>'atendimentos')::numeric) from atual, med),
      'ratio', (select atual.ratio_servicos_por_cliente - (med.v->>'ratio_servicos_por_cliente')::numeric from atual, med)
    ),
    'comparacao', jsonb_build_object(
      'ate_dia', (select n from mes),
      'meses_media', (select coalesce((v->>'meses')::int, 0) from med)
    ),
    'meses', (select j->'meses' from c),
    'saude', (select to_jsonb(s) from v_saude_cadeira s where s.barbeiro_id = p_barbeiro),
    'mix_servicos', coalesce((select jsonb_agg(jsonb_build_object('nome', x.nome, 'qtd', x.qtd,
                                'qtd_mes_anterior', coalesce((select qtd from mix_ant where mix_ant.servico_id = x.servico_id), 0),
                                'faturamento', x.faturamento) order by x.qtd desc)
                              from v_mix_servicos_mes x, mes where x.barbeiro_id = p_barbeiro and x.mes = mes.m), '[]'),
    'mix_produtos', coalesce((select jsonb_agg(jsonb_build_object('nome', x.nome, 'qtd', x.qtd,
                                'qtd_mes_anterior', coalesce((select qtd from mix_ant where mix_ant.produto_id = x.produto_id), 0),
                                'faturamento', x.faturamento) order by x.qtd desc)
                              from v_mix_produtos_mes x, mes where x.barbeiro_id = p_barbeiro and x.mes = mes.m), '[]'),
    'aceitacao', coalesce((select jsonb_agg(jsonb_build_object('item', a.item, 'ofertas', a.ofertas, 'aceitas', a.aceitas, 'taxa', a.taxa,
                              'poucos_dados', a.poucos_dados) order by a.ofertas desc)
                           from v_aceitacao_item a where a.barbeiro_id = p_barbeiro), '[]'),
    'mapa_calor', coalesce((select jsonb_agg(jsonb_build_object('dia_semana', h.dia_semana, 'hora', h.hora, 'atendimentos', h.atendimentos))
                            from v_mapa_calor h where h.barbeiro_id = p_barbeiro), '[]'),
    'mapa_max', (select max(atendimentos) from v_mapa_calor h where h.barbeiro_id = p_barbeiro)
  )
$$;

-- ---------- Painel do dono (redefinido): mesmo pedaço do mês passado e média ----------
create or replace function painel_barbearia(p_mes date default date_trunc('month', hoje_br())::date) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_bar uuid := exigir_dono();
  v_mes date := date_trunc('month', p_mes)::date;
  v_n int := dia_comparavel(p_mes);
  v_ant date := (date_trunc('month', p_mes) - interval '1 month')::date;
begin
  return (
    with membros as (
      select m.barbeiro_id, b.nome, m.papel
      from barbearia_membros m join barbeiros b on b.id = m.barbeiro_id
      where m.barbearia_id = v_bar and m.ativo
    ),
    atual as (select v.* from v_metricas_mes v join membros using (barbeiro_id) where v.mes = v_mes),
    -- cada um dos 3 meses anteriores, no mesmo pedaço
    meses as (
      select k, mb.barbeiro_id,
             metricas_periodo(mb.barbeiro_id, (v_mes - make_interval(months => k))::date,
                              fim_janela_mes((v_mes - make_interval(months => k))::date, v_n)) as v
      from membros mb, generate_series(1, 3) k
    ),
    ant as (select barbeiro_id, (v->>'faturamento')::numeric as faturamento from meses where k = 1),
    equipe_meses as (
      select k, sum((v->>'faturamento')::numeric) as faturamento from meses group by k having count(v) > 0
    ),
    hoje_conc as (
      select r.barbeiro_id, count(*) as atendimentos, sum(r.valor_total) as faturamento
      from v_atendimento_resumo r join membros using (barbeiro_id)
      where (r.inicio at time zone 'America/Sao_Paulo')::date = hoje_br()
      group by 1
    ),
    hoje_agend as (
      select a.barbeiro_id, count(*) as agendados
      from atendimentos a join membros using (barbeiro_id)
      where a.status = 'agendado' and (a.inicio at time zone 'America/Sao_Paulo')::date = hoje_br()
      group by 1
    ),
    linhas as (
      select m.barbeiro_id, m.nome, m.papel,
             coalesce(a.faturamento, 0) as faturamento,
             coalesce(a.atendimentos, 0) as atendimentos,
             a.ticket_medio, a.ratio_servicos_por_cliente as ratio,
             variacao_sobre(a.faturamento, p.faturamento) as variacao_faturamento,
             coalesce(p.faturamento, 0) as faturamento_anterior,
             coalesce(h.atendimentos, 0) as hoje_atendimentos,
             coalesce(h.faturamento, 0) as hoje_faturamento,
             coalesce(g.agendados, 0) as hoje_agendados,
             s.ocupacao, s.taxa_faltas
      from membros m
      left join atual a using (barbeiro_id)
      left join ant p using (barbeiro_id)
      left join hoje_conc h using (barbeiro_id)
      left join hoje_agend g using (barbeiro_id)
      left join v_saude_cadeira s using (barbeiro_id)
    ),
    tot as (
      select coalesce(sum(faturamento), 0) as faturamento, coalesce(sum(faturamento_anterior), 0) as faturamento_anterior,
             coalesce(sum(atendimentos), 0) as atendimentos,
             round(sum(faturamento) / nullif(sum(atendimentos), 0), 2) as ticket_medio
      from linhas
    ),
    med as (select round(avg(faturamento), 2) as faturamento, count(*) as meses from equipe_meses)
    select jsonb_build_object(
      'barbearia', (select jsonb_build_object('id', id, 'nome', nome) from barbearias where id = v_bar),
      'mes', v_mes,
      'comparacao', jsonb_build_object('ate_dia', v_n, 'meses_media', (select meses from med)),
      'hoje', jsonb_build_object(
        'faturamento', (select coalesce(sum(hoje_faturamento), 0) from linhas),
        'atendimentos', (select coalesce(sum(hoje_atendimentos), 0) from linhas),
        'agendados', (select coalesce(sum(hoje_agendados), 0) from linhas)),
      'total', (select jsonb_build_object(
        'faturamento', tot.faturamento,
        'faturamento_anterior', tot.faturamento_anterior,
        'atendimentos', tot.atendimentos,
        'ticket_medio', tot.ticket_medio,
        'variacao_faturamento', variacao_sobre(tot.faturamento, nullif(tot.faturamento_anterior, 0)),
        'media_faturamento', med.faturamento,
        'vs_media_faturamento', variacao_sobre(tot.faturamento, med.faturamento)) from tot, med),
      'equipe', coalesce((select jsonb_agg(to_jsonb(l) order by l.faturamento desc, l.nome) from linhas l), '[]'::jsonb)
    )
  );
end $$;

-- ---------- Resumo da semana (redefinido): até o mesmo dia da semana ----------
create or replace function resumo_semana() returns jsonb
language sql stable as $$
  with s as (select date_trunc('week', hoje_br())::date as ini, hoje_br() - date_trunc('week', hoje_br())::date as d),
  esta as (select * from financeiro((select ini from s), hoje_br(), 'total')),
  ant  as (select * from financeiro((select ini from s) - 7, (select ini + d from s) - 7, 'total')),
  semanas as (
    select k, f.faturamento, f.atendimentos
    from s, generate_series(1, 4) k, lateral financeiro(s.ini - 7 * k, s.ini + s.d - 7 * k, 'total') f
  ),
  med as (select round(avg(faturamento), 2) as faturamento, count(*) as semanas from semanas where faturamento > 0),
  dias as (select * from financeiro((select ini from s) - 7, hoje_br(), 'day'))
  select jsonb_build_object(
    'inicio', (select ini from s),
    'ate_dia_semana', (select extract(isodow from hoje_br())::int),
    'faturamento', (select faturamento from esta),
    'faturamento_anterior', (select faturamento from ant),
    'variacao', (select variacao_sobre(esta.faturamento, nullif(ant.faturamento, 0)) from esta, ant),
    'media', (select case when semanas = 0 then null else faturamento end from med),
    'semanas_media', (select semanas from med),
    'vs_media', (select variacao_sobre(esta.faturamento, med.faturamento) from esta, med),
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

-- ---------- Contexto da IA (redefinido): a IA recebe a comparação já feita ----------
create or replace function contexto_ia(p_barbeiro uuid) returns jsonb
language sql stable as $$
  select jsonb_build_object(
    'publico', b.publico, 'estrategia', b.estrategia, 'modelo_trabalho', b.modelo_trabalho,
    'preco_corte', b.preco_corte, 'pct_visitas_com_extra_alvo', b.pct_visitas_com_extra_alvo,
    'perfil', b.ia_perfil - 'respostas',
    'mes_atual', (select to_jsonb(v) - 'barbeiro_id' from v_metricas_mes v
                   where v.barbeiro_id = b.id and v.mes = date_trunc('month', hoje_br())::date),
    -- Compare sempre com o mesmo pedaço: do dia 1 até o dia de hoje.
    'comparacao_mes', (select jsonb_build_object(
                         'regra', 'mês atual do dia 1 até hoje x o mesmo pedaço dos meses anteriores',
                         'ate_dia', c->'ate_dia',
                         'mes_passado_mesmo_periodo', c->'anterior',
                         'media_3_meses_mesmo_periodo', c->'media',
                         'variacao_faturamento', c->'variacao_faturamento',
                         'vs_media_faturamento', c->'vs_media_faturamento')
                       from (select comparacao_mes(b.id) as c) x),
    'saude', (select to_jsonb(s) - 'barbeiro_id' from v_saude_cadeira s where s.barbeiro_id = b.id),
    'servicos', (select jsonb_agg(jsonb_build_object('nome', nome, 'preco', preco, 'categoria', categoria, 'duracao_min', duracao_min))
                   from servicos where barbeiro_id = b.id and ativo),
    'aceitacao', (select jsonb_agg(jsonb_build_object('item', item, 'ofertas', ofertas, 'aceitas', aceitas, 'taxa', taxa))
                   from v_aceitacao_item where barbeiro_id = b.id)
  )
  from barbeiros b where b.id = p_barbeiro
$$;
