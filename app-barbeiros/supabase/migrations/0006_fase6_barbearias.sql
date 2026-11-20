-- =====================================================================
-- Fase 6 — Barbearias (telas 24 a 27)
--
-- Uma barbearia tem um dono e uma equipe de barbeiros. Cada barbeiro
-- continua com o próprio app e os próprios dados; o dono vê os NÚMEROS e a
-- AGENDA da equipe pelas funções abaixo, nunca o telefone do cliente, os
-- gastos pessoais nem as conversas de cada barbeiro.
--
-- Papéis com RLS próprio:
--   · barbearias, barbearia_membros: a equipe lê a própria barbearia;
--   · barbearia_convites: só o dono lê;
--   · entrar, sair, convidar e remover só pelas funções (sem insert direto).
-- As tabelas de cada barbeiro não ganham política nova: o dono lê a equipe
-- só por funções que conferem o papel (painel, agenda, relatório).
--
-- Plano: quem está numa equipe cujo dono tem o plano Barbearias usa o app
-- como Premium (se o plano próprio for menor). plano_efetivo() é a única
-- fonte do plano a partir daqui.
-- =====================================================================

create type papel_barbearia as enum ('dono', 'barbeiro');

create table barbearias (
  id        uuid primary key default gen_random_uuid(),
  nome      text not null check (char_length(btrim(nome)) between 2 and 60),
  criado_em timestamptz not null default now()
);

create table barbearia_membros (
  barbearia_id uuid not null references barbearias(id) on delete cascade,
  barbeiro_id  uuid not null references barbeiros(id) on delete cascade,
  papel        papel_barbearia not null default 'barbeiro',
  ativo        boolean not null default true,
  entrou_em    timestamptz not null default now(),
  saiu_em      timestamptz,
  primary key (barbearia_id, barbeiro_id)
);
-- Cada barbeiro está em no máximo uma barbearia por vez; cada barbearia tem um dono ativo.
create unique index barbearia_membros_um_vinculo on barbearia_membros (barbeiro_id) where ativo;
create unique index barbearia_membros_um_dono on barbearia_membros (barbearia_id) where ativo and papel = 'dono';

-- Convite de uso único, 6 letras sem as que confundem (I, O, 0, 1), vale 7 dias.
create table barbearia_convites (
  codigo       text primary key check (codigo ~ '^[A-HJ-NP-Z2-9]{6}$'),
  barbearia_id uuid not null references barbearias(id) on delete cascade,
  criado_por   uuid not null references barbeiros(id) on delete cascade,
  criado_em    timestamptz not null default now(),
  expira_em    timestamptz not null default now() + interval '7 days',
  usado_por    uuid references barbeiros(id) on delete set null,
  usado_em     timestamptz
);
create index barbearia_convites_barbearia on barbearia_convites (barbearia_id);

insert into parametros values
  ('barbearias_base',         '2026-01-01', 179.00, 'Plano Barbearias: valor mensal com até 2 barbeiros (o dono conta)'),
  ('barbearias_por_barbeiro', '2026-01-01',  39.00, 'Plano Barbearias: valor por barbeiro a partir do 3º'),
  ('barbearias_inclusos',     '2026-01-01',   2.00, 'Plano Barbearias: barbeiros incluídos no valor base');

-- ---------- Papéis (security definer: as políticas leem sem recursão) ----------
create or replace function minha_barbearia_id() returns uuid
language sql stable security definer set search_path = public as $$
  select barbearia_id from barbearia_membros where barbeiro_id = auth.uid() and ativo
$$;

create or replace function sou_dono(p_barbearia uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from barbearia_membros
                  where barbearia_id = p_barbearia and barbeiro_id = auth.uid() and ativo and papel = 'dono')
$$;

alter table barbearias enable row level security;
alter table barbearia_membros enable row level security;
alter table barbearia_convites enable row level security;

create policy equipe_le_barbearia on barbearias for select using (id = minha_barbearia_id());
create policy dono_renomeia_barbearia on barbearias for update using (sou_dono(id)) with check (sou_dono(id));
create policy equipe_le_membros on barbearia_membros for select using (barbearia_id = minha_barbearia_id());
create policy dono_le_convites on barbearia_convites for select using (sou_dono(barbearia_id));

-- ---------- Plano em vigor (fonte única) ----------
create or replace function plano_efetivo(p_barbeiro uuid) returns app_plano
language sql stable security definer set search_path = public as $$
  with proprio as (
    select coalesce((select plano from app_assinatura
                      where barbeiro_id = p_barbeiro and status in ('ativa', 'teste')
                        and (renova_em is null or renova_em > now())), 'gratis'::app_plano) as p
  ),
  equipe as (
    select exists (
      select 1 from barbearia_membros m
      join barbearia_membros d on d.barbearia_id = m.barbearia_id and d.ativo and d.papel = 'dono'
      join app_assinatura s on s.barbeiro_id = d.barbeiro_id
      where m.barbeiro_id = p_barbeiro and m.ativo and m.papel = 'barbeiro'
        and s.plano = 'barbearias' and s.status in ('ativa', 'teste') and (s.renova_em is null or s.renova_em > now())
    ) as e
  )
  select case when equipe.e and proprio.p in ('gratis', 'pago') then 'premium'::app_plano else proprio.p end
  from proprio, equipe
$$;
revoke execute on function plano_efetivo(uuid) from public, anon, authenticated;
grant execute on function plano_efetivo(uuid) to service_role;

-- Plano de quem está logado (o app só mostra; quem decide é o banco).
create or replace function meu_plano() returns app_plano
language sql stable security definer set search_path = public as $$
  select plano_efetivo(auth.uid())
$$;

-- Barbeiros com um destes planos em vigor (para o cron e a função de insights).
create or replace function barbeiros_por_plano(p_planos app_plano[]) returns setof uuid
language sql stable security definer set search_path = public as $$
  select id from barbeiros where plano_efetivo(id) = any (p_planos)
$$;
revoke execute on function barbeiros_por_plano(app_plano[]) from public, anon, authenticated;
grant execute on function barbeiros_por_plano(app_plano[]) to service_role;

-- O limite da IA passa a vir do plano em vigor (inclui quem está numa equipe).
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
  v_plano := plano_efetivo(p_barbeiro);
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
revoke execute on function consumir_ia(uuid, text) from public, anon;

-- Uso de mensagens: agora lê o plano em vigor, então roda como dono da função
-- e confere quem pede (o próprio barbeiro, o servidor ou o cron).
create or replace function uso_mensagens_mes(p_barbeiro uuid default auth.uid()) returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  if auth.uid() is not null and p_barbeiro is distinct from auth.uid() then raise exception 'sem permissão'; end if;
  return jsonb_build_object(
    'usadas', (select count(*) from contatos_enviados where barbeiro_id = p_barbeiro
                and categoria in ('marketing', 'aniversario', 'produto', 'reativacao')
                and date_trunc('month', enviado_em at time zone 'America/Sao_Paulo') = date_trunc('month', now() at time zone 'America/Sao_Paulo')),
    'limite', case plano_efetivo(p_barbeiro) when 'premium' then 100 when 'plus' then 100 when 'barbearias' then 100 else 0 end,
    'transacionais', (select count(*) from contatos_enviados where barbeiro_id = p_barbeiro
                and categoria not in ('marketing', 'aniversario', 'produto', 'reativacao')
                and date_trunc('month', enviado_em at time zone 'America/Sao_Paulo') = date_trunc('month', now() at time zone 'America/Sao_Paulo')));
end $$;
revoke execute on function uso_mensagens_mes(uuid) from public, anon;

-- Rotina diária: todos os barbeiros com plano em vigor Premium em diante.
create or replace function rotina_diaria() returns jsonb
language plpgsql security definer set search_path = public as $$
declare b uuid; v_follow int := 0; v_auto int := 0;
begin
  for b in select barbeiros_por_plano(array['premium', 'plus', 'barbearias']::app_plano[]) loop
    v_follow := v_follow + gerar_followups(b);
    v_auto := v_auto + planejar_automacoes(b);
  end loop;
  return jsonb_build_object('followups', v_follow, 'automacoes', v_auto);
end $$;
revoke execute on function rotina_diaria() from public, anon, authenticated;

-- ---------- Situação de quem está logado ----------
-- null = sem barbearia; senão o nome, o papel e o tamanho da equipe.
create or replace function minha_barbearia() returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'id', b.id, 'nome', b.nome, 'papel', m.papel, 'entrou_em', m.entrou_em,
    'dono', (select x.nome from barbearia_membros d join barbeiros x on x.id = d.barbeiro_id
              where d.barbearia_id = b.id and d.ativo and d.papel = 'dono'),
    'barbeiros', (select count(*) from barbearia_membros e where e.barbearia_id = b.id and e.ativo))
  from barbearia_membros m join barbearias b on b.id = m.barbearia_id
  where m.barbeiro_id = auth.uid() and m.ativo
$$;

-- Confere que quem chama é o dono, com o plano Barbearias em vigor; devolve a barbearia.
create or replace function exigir_dono() returns uuid
language plpgsql stable security definer set search_path = public as $$
declare v uuid := minha_barbearia_id();
begin
  if v is null or not sou_dono(v) then raise exception 'só o dono da barbearia'; end if;
  if plano_efetivo(auth.uid()) <> 'barbearias' then raise exception 'disponível no plano Barbearias'; end if;
  return v;
end $$;

create or replace function criar_barbearia(p_nome text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if auth.uid() is null then raise exception 'entre na sua conta'; end if;
  if plano_efetivo(auth.uid()) <> 'barbearias' then raise exception 'disponível no plano Barbearias'; end if;
  if minha_barbearia_id() is not null then raise exception 'você já faz parte de uma barbearia'; end if;
  insert into barbearias (nome) values (btrim(p_nome)) returning id into v_id;
  insert into barbearia_membros (barbearia_id, barbeiro_id, papel) values (v_id, auth.uid(), 'dono');
  return minha_barbearia();
end $$;

create or replace function renomear_barbearia(p_nome text) returns jsonb
language plpgsql security definer set search_path = public as $$
begin
  update barbearias set nome = btrim(p_nome) where id = exigir_dono();
  return minha_barbearia();
end $$;

create or replace function gerar_convite() returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare
  v_bar uuid := exigir_dono();
  v_alfabeto constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';   -- 32 letras: byte % 32 é uniforme
  v_bytes bytea;
  v_cod text;
  v_conv barbearia_convites%rowtype;
begin
  loop
    v_bytes := extensions.gen_random_bytes(6);
    select string_agg(substr(v_alfabeto, 1 + get_byte(v_bytes, i) % 32, 1), '' order by i) into v_cod
      from generate_series(0, 5) i;
    exit when not exists (select 1 from barbearia_convites where codigo = v_cod);
  end loop;
  insert into barbearia_convites (codigo, barbearia_id, criado_por) values (v_cod, v_bar, auth.uid())
  returning * into v_conv;
  return jsonb_build_object('codigo', v_conv.codigo, 'expira_em', v_conv.expira_em);
end $$;

create or replace function cancelar_convite(p_codigo text) returns void
language plpgsql security definer set search_path = public as $$
begin
  update barbearia_convites set expira_em = now()
   where codigo = upper(btrim(p_codigo)) and barbearia_id = exigir_dono() and usado_por is null;
end $$;

-- Qualquer barbeiro logado entra com o código (o plano dele não importa).
create or replace function entrar_na_barbearia(p_codigo text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare c barbearia_convites%rowtype;
begin
  if auth.uid() is null then raise exception 'entre na sua conta'; end if;
  if minha_barbearia_id() is not null then raise exception 'você já faz parte de uma barbearia'; end if;
  select * into c from barbearia_convites where codigo = upper(btrim(p_codigo)) for update;
  if not found or c.usado_por is not null or c.expira_em <= now() then raise exception 'código inválido ou vencido'; end if;
  insert into barbearia_membros (barbearia_id, barbeiro_id, papel) values (c.barbearia_id, auth.uid(), 'barbeiro')
  on conflict (barbearia_id, barbeiro_id) do update set ativo = true, papel = 'barbeiro', entrou_em = now(), saiu_em = null;
  update barbearia_convites set usado_por = auth.uid(), usado_em = now() where codigo = c.codigo;
  return minha_barbearia();
end $$;

-- O barbeiro sai quando quiser; os dados dele continuam dele.
create or replace function sair_da_barbearia() returns void
language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from barbearia_membros where barbeiro_id = auth.uid() and ativo and papel = 'dono') then
    raise exception 'o dono não sai da própria barbearia: encerre a barbearia';
  end if;
  update barbearia_membros set ativo = false, saiu_em = now() where barbeiro_id = auth.uid() and ativo;
end $$;

create or replace function remover_da_equipe(p_barbeiro uuid) returns void
language plpgsql security definer set search_path = public as $$
declare v_bar uuid := exigir_dono();
begin
  if p_barbeiro = auth.uid() then raise exception 'o dono não sai da própria barbearia: encerre a barbearia'; end if;
  update barbearia_membros set ativo = false, saiu_em = now()
   where barbearia_id = v_bar and barbeiro_id = p_barbeiro and ativo;
  if not found then raise exception 'barbeiro fora da equipe'; end if;
end $$;

-- Encerrar: todos saem (cada um fica com os próprios dados) e os convites vencem.
create or replace function encerrar_barbearia() returns void
language plpgsql security definer set search_path = public as $$
declare v_bar uuid := minha_barbearia_id();
begin
  if v_bar is null or not sou_dono(v_bar) then raise exception 'só o dono da barbearia'; end if;
  update barbearia_convites set expira_em = now() where barbearia_id = v_bar and usado_por is null and expira_em > now();
  update barbearia_membros set ativo = false, saiu_em = now() where barbearia_id = v_bar and ativo;
end $$;

-- ---------- Equipe (tela 25) ----------
-- Todos da equipe veem os nomes; números, convites e valor do plano só o dono.
create or replace function equipe_barbearia() returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_bar uuid := minha_barbearia_id();
  v_dono boolean;
  v_n int;
  v_inclusos int := parametro('barbearias_inclusos')::int;
  v_extras int;
begin
  if v_bar is null then return null; end if;
  v_dono := sou_dono(v_bar);
  select count(*) into v_n from barbearia_membros where barbearia_id = v_bar and ativo;
  v_extras := greatest(0, v_n - v_inclusos);
  return jsonb_build_object(
    'barbearia', (select jsonb_build_object('id', id, 'nome', nome) from barbearias where id = v_bar),
    'sou_dono', v_dono,
    'membros', (select jsonb_agg(jsonb_build_object(
                  'barbeiro_id', m.barbeiro_id, 'nome', b.nome, 'papel', m.papel, 'entrou_em', m.entrou_em,
                  'atendimentos_mes', case when v_dono then coalesce(v.atendimentos, 0) end)
                  order by m.papel, b.nome)
                from barbearia_membros m join barbeiros b on b.id = m.barbeiro_id
                left join v_metricas_mes v on v.barbeiro_id = m.barbeiro_id and v.mes = date_trunc('month', hoje_br())::date
                where m.barbearia_id = v_bar and m.ativo),
    'convites', case when v_dono then coalesce((
                  select jsonb_agg(jsonb_build_object('codigo', codigo, 'expira_em', expira_em) order by criado_em desc)
                  from barbearia_convites where barbearia_id = v_bar and usado_por is null and expira_em > now()), '[]'::jsonb) end,
    'assentos', case when v_dono then jsonb_build_object(
                  'barbeiros', v_n, 'inclusos', v_inclusos, 'extras', v_extras,
                  'valor_base', parametro('barbearias_base'), 'valor_por_extra', parametro('barbearias_por_barbeiro'),
                  'valor_mensal', parametro('barbearias_base') + v_extras * parametro('barbearias_por_barbeiro')) end
  );
end $$;

-- ---------- Painel do dono (tela 24) ----------
-- Hoje e o mês de cada barbeiro e da equipe, com as somas e variações já feitas.
create or replace function painel_barbearia(p_mes date default date_trunc('month', hoje_br())::date) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_bar uuid := exigir_dono();
  v_mes date := date_trunc('month', p_mes)::date;
  v_ant date := (date_trunc('month', p_mes) - interval '1 month')::date;
begin
  return (
    with membros as (
      select m.barbeiro_id, b.nome, m.papel
      from barbearia_membros m join barbeiros b on b.id = m.barbeiro_id
      where m.barbearia_id = v_bar and m.ativo
    ),
    atual as (select v.* from v_metricas_mes v join membros using (barbeiro_id) where v.mes = v_mes),
    ant as (select v.* from v_metricas_mes v join membros using (barbeiro_id) where v.mes = v_ant),
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
             round((a.faturamento - p.faturamento) / nullif(p.faturamento, 0), 3) as variacao_faturamento,
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
    )
    select jsonb_build_object(
      'barbearia', (select jsonb_build_object('id', id, 'nome', nome) from barbearias where id = v_bar),
      'mes', v_mes,
      'hoje', jsonb_build_object(
        'faturamento', (select coalesce(sum(hoje_faturamento), 0) from linhas),
        'atendimentos', (select coalesce(sum(hoje_atendimentos), 0) from linhas),
        'agendados', (select coalesce(sum(hoje_agendados), 0) from linhas)),
      'total', jsonb_build_object(
        'faturamento', (select coalesce(sum(faturamento), 0) from linhas),
        'faturamento_anterior', (select coalesce(sum(faturamento_anterior), 0) from linhas),
        'atendimentos', (select coalesce(sum(atendimentos), 0) from linhas),
        'ticket_medio', (select round(sum(faturamento) / nullif(sum(atendimentos), 0), 2) from linhas),
        'variacao_faturamento', (select round((sum(faturamento) - sum(faturamento_anterior)) / nullif(sum(faturamento_anterior), 0), 3) from linhas)),
      'equipe', coalesce((select jsonb_agg(to_jsonb(l) order by l.faturamento desc, l.nome) from linhas l), '[]'::jsonb)
    )
  );
end $$;

-- ---------- Agenda da equipe (tela 26) ----------
-- Só o primeiro nome (ou apelido) do cliente: o dono organiza a casa, o
-- contato continua de cada barbeiro.
create or replace function agenda_equipe(p_dia date default hoje_br())
returns table (barbeiro_id uuid, barbeiro text, id uuid, inicio timestamptz, fim timestamptz,
               status status_atendimento, cliente text, servicos text)
language plpgsql stable security definer set search_path = public as $$
declare v_bar uuid := exigir_dono();
begin
  return query
  select m.barbeiro_id, b.nome, a.id, a.inicio, a.fim, a.status,
         split_part(coalesce(nullif(btrim(c.apelido), ''), c.nome), ' ', 1),
         string_agg(coalesce(s.nome, p.nome), ' + ' order by s.categoria, coalesce(s.nome, p.nome))
  from barbearia_membros m
  join barbeiros b on b.id = m.barbeiro_id
  join atendimentos a on a.barbeiro_id = m.barbeiro_id and a.status <> 'cancelado'
                     and (a.inicio at time zone 'America/Sao_Paulo')::date = p_dia
  left join clientes c on c.id = a.cliente_id
  left join atendimento_itens i on i.atendimento_id = a.id
  left join servicos s on s.id = i.servico_id
  left join produtos p on p.id = i.produto_id
  where m.barbearia_id = v_bar and m.ativo
  group by m.barbeiro_id, b.nome, a.id, a.inicio, a.fim, a.status, c.apelido, c.nome
  order by a.inicio, b.nome;
end $$;

-- ---------- Relatório por barbeiro (tela 27) ----------
-- O relatório do mês passa a receber o barbeiro de forma explícita e roda com
-- as permissões de quem chama (um barbeiro que pede o de outro recebe vazio).
-- O dono chega nele por relatorio_barbeiro, que confere o papel.
create or replace function relatorio_mes_de(p_barbeiro uuid, p_mes date default date_trunc('month', hoje_br())::date)
returns jsonb language sql stable as $$
  with mes as (select date_trunc('month', p_mes)::date as m),
  atual as (select v.* from v_metricas_mes v, mes where v.barbeiro_id = p_barbeiro and v.mes = mes.m),
  ant as (select v.* from v_metricas_mes v, mes where v.barbeiro_id = p_barbeiro and v.mes = (mes.m - interval '1 month')::date)
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
    'saude', (select to_jsonb(s) from v_saude_cadeira s where s.barbeiro_id = p_barbeiro),
    'mix_servicos', coalesce((select jsonb_agg(jsonb_build_object('nome', x.nome, 'qtd', x.qtd, 'qtd_mes_anterior', coalesce(x.qtd_mes_anterior, 0),
                                'faturamento', x.faturamento) order by x.qtd desc)
                              from v_mix_servicos_mes x, mes where x.barbeiro_id = p_barbeiro and x.mes = mes.m), '[]'),
    'mix_produtos', coalesce((select jsonb_agg(jsonb_build_object('nome', x.nome, 'qtd', x.qtd, 'qtd_mes_anterior', coalesce(x.qtd_mes_anterior, 0),
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

create or replace function relatorio_mes(p_mes date default date_trunc('month', hoje_br())::date)
returns jsonb language sql stable as $$
  select relatorio_mes_de(auth.uid(), p_mes)
$$;

create or replace function relatorio_barbeiro(p_barbeiro uuid, p_mes date default date_trunc('month', hoje_br())::date)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_bar uuid := exigir_dono();
  v_mes date := date_trunc('month', p_mes)::date;
  e record;
begin
  if not exists (select 1 from barbearia_membros where barbearia_id = v_bar and barbeiro_id = p_barbeiro and ativo) then
    raise exception 'barbeiro fora da equipe';
  end if;
  select * into e from extrato_mes(p_barbeiro, v_mes);
  return relatorio_mes_de(p_barbeiro, v_mes) || jsonb_build_object(
    'barbeiro', (select jsonb_build_object('id', b.id, 'nome', b.nome, 'papel', m.papel, 'entrou_em', m.entrou_em)
                   from barbeiros b join barbearia_membros m on m.barbeiro_id = b.id and m.barbearia_id = v_bar where b.id = p_barbeiro),
    -- Comissão pela regra que o próprio barbeiro configurou (null se ele não configurou).
    'comissao', case when exists (select 1 from regras_comissao r where r.barbeiro_id = p_barbeiro and r.vigente_desde <= (v_mes + interval '1 month - 1 day')::date)
                     then e.comissao_servicos + e.comissao_produtos end
  );
end $$;

revoke execute on function minha_barbearia_id(), sou_dono(uuid), minha_barbearia(), exigir_dono(), criar_barbearia(text),
  renomear_barbearia(text), gerar_convite(), cancelar_convite(text), entrar_na_barbearia(text), sair_da_barbearia(),
  remover_da_equipe(uuid), encerrar_barbearia(), equipe_barbearia(), painel_barbearia(date), agenda_equipe(date),
  relatorio_barbeiro(uuid, date) from public, anon;
