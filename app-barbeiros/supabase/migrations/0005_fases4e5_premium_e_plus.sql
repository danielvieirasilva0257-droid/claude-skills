-- =====================================================================
-- 0005 · Fases 4 e 5 (Premium e Premium Plus): expediente, lista de espera,
-- WhatsApp e Instagram (conversas, eventos), automações com fila de
-- mensagens (sempre por pode_enviar), uso de mensagens, funil de
-- prospecção, personalidade da IA e agendamentos diários (pg_cron).
-- =====================================================================

-- ---------- Expediente e horários livres ----------
create table expediente (
  barbeiro_id     uuid not null references barbeiros(id) on delete cascade,
  dia_semana      int not null check (dia_semana between 1 and 7),   -- 1 = segunda (isodow)
  inicio          time not null,
  fim             time not null,
  pausa_inicio    time,
  pausa_fim       time,
  primary key (barbeiro_id, dia_semana),
  check (fim > inicio),
  check ((pausa_inicio is null) = (pausa_fim is null)),
  check (pausa_inicio is null or (pausa_inicio >= inicio and pausa_fim <= fim and pausa_fim > pausa_inicio))
);
alter table expediente enable row level security;
create policy dono_expediente on expediente for all using (barbeiro_id = auth.uid()) with check (barbeiro_id = auth.uid());

-- Horários livres de um dia para um serviço de p_duracao minutos (passo de 15 min).
-- p_barbeiro explícito (WhatsApp/IA com service_role); com login comum, RLS limita ao próprio.
create or replace function horarios_livres(p_barbeiro uuid, p_dia date, p_duracao int default 40)
returns table (inicio timestamptz) language sql stable as $$
  with e as (select * from expediente where barbeiro_id = p_barbeiro and dia_semana = extract(isodow from p_dia)::int),
  slots as (
    select t at time zone 'America/Sao_Paulo' as ini
    from e, generate_series(p_dia + e.inicio, p_dia + e.fim - make_interval(mins => p_duracao), interval '15 minutes') t
    where e.pausa_inicio is null or not ((t, t + make_interval(mins => p_duracao))
                                          overlaps (p_dia + e.pausa_inicio, p_dia + e.pausa_fim))
  )
  select s.ini from slots s
  where s.ini > now()
    and not exists (select 1 from atendimentos a
                     where a.barbeiro_id = p_barbeiro and a.status in ('agendado', 'concluido')
                       and (a.inicio, coalesce(a.fim, a.inicio + interval '40 minutes'))
                           overlaps (s.ini, s.ini + make_interval(mins => p_duracao)))
  order by s.ini
$$;

-- ---------- Canais (WhatsApp e Instagram), conversas e mensagens ----------
create type tipo_canal as enum ('whatsapp', 'instagram');

create table canais (
  barbeiro_id    uuid not null references barbeiros(id) on delete cascade,
  tipo           tipo_canal not null,
  conta_externa  text not null,              -- phone_number_id (WhatsApp) ou id da conta (Instagram)
  nome_exibicao  text,
  status         text not null default 'conectado' check (status in ('conectado', 'desconectado', 'erro')),
  ia_ativa       boolean not null default true,  -- IA responde por padrão neste canal
  conectado_em   timestamptz not null default now(),
  primary key (barbeiro_id, tipo),
  unique (tipo, conta_externa)
);
alter table canais enable row level security;
create policy dono_canais on canais for all using (barbeiro_id = auth.uid()) with check (barbeiro_id = auth.uid());

-- Tokens dos canais: nenhuma policy (só service_role, nas Edge Functions).
create table canais_segredos (
  barbeiro_id uuid not null references barbeiros(id) on delete cascade,
  tipo        tipo_canal not null,
  token       text not null,
  primary key (barbeiro_id, tipo)
);
alter table canais_segredos enable row level security;

create table conversas (
  id               uuid primary key default gen_random_uuid(),
  barbeiro_id      uuid not null references barbeiros(id) on delete cascade,
  canal            tipo_canal not null,
  contato_externo  text not null,            -- wa_id ou id do Instagram (nunca vai para a IA)
  nome_contato     text,
  cliente_id       uuid references clientes(id) on delete set null,
  ia_ativa         boolean not null default true,   -- false = o barbeiro assumiu
  origem_codigo    text,                     -- palavra-código detectada (funil)
  janela_ate       timestamptz,              -- fim da janela de 24 h de atendimento
  ultima_mensagem_em timestamptz not null default now(),
  nao_lidas        int not null default 0,
  unique (barbeiro_id, canal, contato_externo)
);
alter table conversas enable row level security;
create policy dono_conversas on conversas for all using (barbeiro_id = auth.uid()) with check (barbeiro_id = auth.uid());

create table mensagens (
  id           uuid primary key default gen_random_uuid(),
  conversa_id  uuid not null references conversas(id) on delete cascade,
  barbeiro_id  uuid not null references barbeiros(id) on delete cascade,
  direcao      text not null check (direcao in ('entrada', 'saida')),
  autor        text not null check (autor in ('cliente', 'ia', 'barbeiro', 'automacao')),
  texto        text not null,
  id_externo   text,
  status_envio text not null default 'ok' check (status_envio in ('ok', 'simulado', 'erro', 'fora_da_janela')),
  criado_em    timestamptz not null default now()
);
create index on mensagens (conversa_id, criado_em);
alter table mensagens enable row level security;
create policy dono_mensagens on mensagens for all using (barbeiro_id = auth.uid()) with check (barbeiro_id = auth.uid());

-- Eventos do Instagram: só quem levantou a mão (comentou, respondeu story,
-- mencionou ou mandou direct). Curtida não gera evento e nunca gera mensagem.
create table instagram_eventos (
  id               uuid primary key default gen_random_uuid(),
  barbeiro_id      uuid not null references barbeiros(id) on delete cascade,
  tipo             text not null check (tipo in ('comentario', 'direct', 'mencao', 'resposta_story')),
  autor_externo    text not null,
  autor_nome       text,
  texto            text,
  comentario_id    text,                     -- para a resposta privada
  midia_id         text,
  recebido_em      timestamptz not null default now(),
  resposta_privada_em timestamptz,           -- no máximo 1 por comentário
  codigo_detectado text,
  conversa_id      uuid references conversas(id) on delete set null
);
alter table instagram_eventos enable row level security;
create policy dono_ig on instagram_eventos for all using (barbeiro_id = auth.uid()) with check (barbeiro_id = auth.uid());

-- Pode responder no Instagram? Comentário: 1 resposta privada em até 7 dias.
-- Direct / story / menção: só dentro de 24 h da última mensagem da pessoa.
create or replace function pode_responder_instagram(p_evento uuid, p_quando timestamptz default now())
returns table (pode boolean, motivo text) language plpgsql stable as $$
declare e instagram_eventos%rowtype; v_janela timestamptz;
begin
  select * into e from instagram_eventos where id = p_evento;
  if not found then return query select false, 'evento não encontrado'; return; end if;
  if e.tipo = 'comentario' then
    if e.resposta_privada_em is not null then return query select false, 'já respondeu este comentário'; return; end if;
    if e.recebido_em < p_quando - interval '7 days' then return query select false, 'comentário com mais de 7 dias'; return; end if;
    return query select true, 'ok'; return;
  end if;
  select janela_ate into v_janela from conversas where id = e.conversa_id;
  if v_janela is null or v_janela < p_quando then return query select false, 'fora da janela de 24 h'; return; end if;
  return query select true, 'ok';
end $$;

-- ---------- Personalidade da IA (Premium Plus) ----------
alter table barbeiros add column ia_personalidade jsonb not null default
  '{"tom": "parceiro", "emojis": false, "assinatura": "", "evitar": []}'::jsonb;

-- ---------- Fila de mensagens automáticas ----------
create table mensagens_fila (
  id            uuid primary key default gen_random_uuid(),
  barbeiro_id   uuid not null references barbeiros(id) on delete cascade,
  cliente_id    uuid not null references clientes(id) on delete cascade,
  estrategia    text references estrategias(codigo),
  categoria     categoria_contato not null,
  texto         text not null,
  agendado_para timestamptz not null default now(),
  status        text not null default 'pendente' check (status in ('pendente', 'enviada', 'bloqueada', 'cancelada', 'erro')),
  motivo        text,                       -- por que foi bloqueada (pode_enviar)
  criado_em     timestamptz not null default now(),
  enviado_em    timestamptz
);
create index on mensagens_fila (barbeiro_id, status, agendado_para);
-- uma por cliente, estratégia e dia
create unique index on mensagens_fila (cliente_id, estrategia, ((criado_em at time zone 'America/Sao_Paulo')::date));
alter table mensagens_fila enable row level security;
create policy dono_fila on mensagens_fila for all using (barbeiro_id = auth.uid()) with check (barbeiro_id = auth.uid());

-- Uso de mensagens de marketing no mês (Premium: 100).
create or replace function uso_mensagens_mes(p_barbeiro uuid default auth.uid()) returns jsonb
language sql stable as $$
  select jsonb_build_object(
    'usadas', (select count(*) from contatos_enviados where barbeiro_id = p_barbeiro
                and categoria in ('marketing', 'aniversario', 'produto', 'reativacao')
                and date_trunc('month', enviado_em at time zone 'America/Sao_Paulo') = date_trunc('month', now() at time zone 'America/Sao_Paulo')),
    'limite', case (select plano from app_assinatura where barbeiro_id = p_barbeiro and status in ('ativa', 'teste')
                     and (renova_em is null or renova_em > now()))
                when 'premium' then 100 when 'plus' then 100 when 'barbearias' then 100 else 0 end,
    'transacionais', (select count(*) from contatos_enviados where barbeiro_id = p_barbeiro
                and categoria not in ('marketing', 'aniversario', 'produto', 'reativacao')
                and date_trunc('month', enviado_em at time zone 'America/Sao_Paulo') = date_trunc('month', now() at time zone 'America/Sao_Paulo')))
$$;

-- Texto da estratégia para o cliente ({nome} vira o apelido ou o primeiro nome).
create or replace function texto_estrategia(p_codigo text, p_cliente uuid) returns text
language sql stable as $$
  select replace(coalesce(case when b.publico in ('A', 'B') then e.frase_a end, e.frase, e.nome),
                 '{nome}', coalesce(c.apelido, split_part(c.nome, ' ', 1)))
  from estrategias e, clientes c join barbeiros b on b.id = c.barbeiro_id
  where e.codigo = p_codigo and c.id = p_cliente
$$;

-- Planeja as automações ligadas do barbeiro para hoje. Toda mensagem passa
-- por pode_enviar no horário em que vai sair; o que não pode fica
-- registrado como "bloqueada" com o motivo (o barbeiro vê o porquê).
-- Gatilhos com motor: R4 (confirmação D-1), A15 (pós-visita), R9 (reativação),
-- R12 (aniversário), R6 (reagendamento a quente). V1 (lista de espera) dispara
-- ao cancelar um horário (gatilho abaixo).
create or replace function planejar_automacoes(p_barbeiro uuid) returns int
language plpgsql as $$
declare
  r record;
  v_n int := 0;
  v_quando timestamptz;
  v_ok record;
  v_uso jsonb := uso_mensagens_mes(p_barbeiro);
  v_marketing int := (v_uso->>'usadas')::int;
  v_limite int := (v_uso->>'limite')::int;
  v_hoje date := (now() at time zone 'America/Sao_Paulo')::date;
begin
  if v_limite = 0 then return 0; end if; -- plano sem automações
  -- próxima janela de envio de hoje (10h ou 18h30), ou amanhã às 10h
  v_quando := case when (now() at time zone 'America/Sao_Paulo')::time < '10:00' then (v_hoje + time '10:00')
                   when (now() at time zone 'America/Sao_Paulo')::time < '18:30' then (v_hoje + time '18:30')
                   else (v_hoje + 1 + time '10:00') end at time zone 'America/Sao_Paulo';

  for r in
    select x.* from (
      -- R4: confirmação do horário de amanhã
      select 'R4' as estrategia, a.cliente_id, 'transacional'::categoria_contato as categoria
        from atendimentos a where a.barbeiro_id = p_barbeiro and a.status = 'agendado' and a.cliente_id is not null
         and (a.inicio at time zone 'America/Sao_Paulo')::date = v_hoje + 1
      union all
      -- A15: pós-visita (visita concluída ontem)
      select 'A15', vr.cliente_id, 'pos_venda' from v_atendimento_resumo vr
       where vr.barbeiro_id = p_barbeiro and vr.cliente_id is not null
         and (vr.inicio at time zone 'America/Sao_Paulo')::date = v_hoje - 1
      union all
      -- R6: reagendamento a quente (veio há 2 dias e não marcou o próximo)
      select 'R6', vr.cliente_id, 'reagendamento' from v_atendimento_resumo vr
       where vr.barbeiro_id = p_barbeiro and vr.cliente_id is not null
         and (vr.inicio at time zone 'America/Sao_Paulo')::date = v_hoje - 2
      union all
      -- R9: reativação de quem sumiu
      select 'R9', s.cliente_id, 'reativacao' from v_clientes_sumidos s where s.barbeiro_id = p_barbeiro
      union all
      -- R12: aniversário hoje
      select 'R12', c.id, 'aniversario' from clientes c
       where c.barbeiro_id = p_barbeiro and to_char(c.aniversario, 'MM-DD') = to_char(v_hoje, 'MM-DD')
    ) x
    join barbeiro_estrategias be on be.barbeiro_id = p_barbeiro and be.codigo = x.estrategia and be.ativa
  loop
    select * into v_ok from pode_enviar(r.cliente_id, r.categoria,
      case when r.categoria = 'transacional' then now() else v_quando end);
    if v_ok.pode and r.categoria in ('marketing', 'aniversario', 'produto', 'reativacao') and v_marketing >= v_limite then
      v_ok.pode := false; v_ok.motivo := format('limite de %s mensagens do plano no mês', v_limite);
    end if;
    insert into mensagens_fila (barbeiro_id, cliente_id, estrategia, categoria, texto, agendado_para, status, motivo)
    values (p_barbeiro, r.cliente_id, r.estrategia, r.categoria, coalesce(texto_estrategia(r.estrategia, r.cliente_id), ''),
            case when r.categoria = 'transacional' then now() else v_quando end,
            case when v_ok.pode then 'pendente' else 'bloqueada' end, case when v_ok.pode then null else v_ok.motivo end)
    on conflict do nothing;
    if found then
      v_n := v_n + 1;
      if v_ok.pode and r.categoria in ('marketing', 'aniversario', 'produto', 'reativacao') then v_marketing := v_marketing + 1; end if;
    end if;
  end loop;
  return v_n;
end $$;

-- Lista de espera (V1): ao cancelar um horário, avisa até 3 pessoas na fila.
create or replace function avisar_lista_espera() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'cancelado' and old.status = 'agendado' and new.inicio > now()
     and exists (select 1 from barbeiro_estrategias where barbeiro_id = new.barbeiro_id and codigo = 'V1' and ativa) then
    -- Mesmo sendo aviso pedido pelo cliente, passa por pode_enviar.
    insert into mensagens_fila (barbeiro_id, cliente_id, estrategia, categoria, texto, status, motivo)
    select l.barbeiro_id, l.cliente_id, 'V1', 'transacional',
           format('Abriu um horário %s às %s. Quer? Responda SIM que eu marco.',
                  to_char(new.inicio at time zone 'America/Sao_Paulo', 'DD/MM'),
                  to_char(new.inicio at time zone 'America/Sao_Paulo', 'HH24:MI')),
           case when pe.pode then 'pendente' else 'bloqueada' end, case when pe.pode then null else pe.motivo end
    from lista_espera l
    cross join lateral pode_enviar(l.cliente_id, 'transacional') pe
    where l.barbeiro_id = new.barbeiro_id and l.status = 'aguardando'
    order by l.criado_em limit 3
    on conflict do nothing;
    update lista_espera set status = 'avisado'
     where id in (select id from lista_espera where barbeiro_id = new.barbeiro_id and status = 'aguardando' order by criado_em limit 3);
  end if;
  return new;
end $$;
create trigger trg_lista_espera after update of status on atendimentos
  for each row execute function avisar_lista_espera();

-- Marca como enviada e registra em contatos_enviados (chamado pela Edge Function de envio).
create or replace function registrar_envio(p_fila uuid, p_ok boolean, p_motivo text default null) returns void
language plpgsql as $$
declare f mensagens_fila%rowtype;
begin
  select * into f from mensagens_fila where id = p_fila for update;
  if not found or f.status <> 'pendente' then return; end if;
  if p_ok then
    update mensagens_fila set status = 'enviada', enviado_em = now() where id = p_fila;
    insert into contatos_enviados (barbeiro_id, cliente_id, categoria, estrategia, mensagem)
    values (f.barbeiro_id, f.cliente_id, f.categoria, f.estrategia, f.texto);
  else
    update mensagens_fila set status = 'erro', motivo = p_motivo where id = p_fila;
  end if;
end $$;

-- ---------- Funil de prospecção (Premium Plus) ----------
-- Palavras-código ficam em `origens` (0001). Contato com código → conversa;
-- conversa ligada a cliente → agendou; atendimento concluído → veio; 2+ → voltou.
create view v_funil_prospeccao as
with conv as (
  select c.barbeiro_id, upper(c.origem_codigo) as codigo, c.cliente_id
  from conversas c where c.origem_codigo is not null
),
cli as (
  select c.barbeiro_id, upper(c.origem_codigo) as codigo, c.id as cliente_id
  from clientes c where c.origem_codigo is not null
),
todos as (
  select barbeiro_id, codigo, cliente_id from conv
  union
  select barbeiro_id, codigo, cliente_id from cli
)
select t.barbeiro_id, t.codigo, o.canal, o.parceiro, coalesce(o.custo_mensal, 0) as custo_mensal,
       count(*)::int as contatos,
       count(*) filter (where exists (select 1 from atendimentos a where a.cliente_id = t.cliente_id))::int as agendaram,
       count(*) filter (where exists (select 1 from atendimentos a where a.cliente_id = t.cliente_id and a.status = 'concluido'))::int as vieram,
       count(*) filter (where (select count(*) from atendimentos a where a.cliente_id = t.cliente_id and a.status = 'concluido') >= 2)::int as voltaram,
       case when count(*) filter (where exists (select 1 from atendimentos a where a.cliente_id = t.cliente_id and a.status = 'concluido')) > 0
            then round(coalesce(o.custo_mensal, 0) / count(*) filter (where exists (select 1 from atendimentos a
                   where a.cliente_id = t.cliente_id and a.status = 'concluido')), 2) end as custo_por_cliente
from todos t
left join origens o on o.barbeiro_id = t.barbeiro_id and upper(o.codigo) = t.codigo
group by t.barbeiro_id, t.codigo, o.canal, o.parceiro, o.custo_mensal;
alter view v_funil_prospeccao set (security_invoker = on);

-- Clientes por canal de origem (todos os clientes, com ou sem código).
create view v_origem_clientes as
select c.barbeiro_id, coalesce(c.origem::text, 'sem origem') as origem, count(*)::int as clientes,
       count(*) filter (where (select count(*) from atendimentos a where a.cliente_id = c.id and a.status = 'concluido') >= 2)::int as fieis
from clientes c group by 1, 2;
alter view v_origem_clientes set (security_invoker = on);

-- ---------- Rotinas diárias (pg_cron) ----------
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Para todos os barbeiros Premium em diante: follow-ups e automações do dia.
create or replace function rotina_diaria() returns jsonb
language plpgsql security definer set search_path = public as $$
declare b record; v_follow int := 0; v_auto int := 0;
begin
  for b in select barbeiro_id from app_assinatura
            where plano in ('premium', 'plus', 'barbearias') and status in ('ativa', 'teste')
              and (renova_em is null or renova_em > now())
  loop
    v_follow := v_follow + gerar_followups(b.barbeiro_id);
    v_auto := v_auto + planejar_automacoes(b.barbeiro_id);
  end loop;
  return jsonb_build_object('followups', v_follow, 'automacoes', v_auto);
end $$;
revoke execute on function rotina_diaria() from anon, authenticated;

-- Chama uma Edge Function com a chave de serviço guardada no Vault
-- (segredos 'url_funcoes' e 'chave_servico'). Sem segredos, não faz nada.
create or replace function chamar_funcao(p_nome text, p_corpo jsonb default '{}') returns bigint
language plpgsql security definer set search_path = public as $$
declare v_url text; v_chave text;
begin
  select decrypted_secret into v_url from vault.decrypted_secrets where name = 'url_funcoes';
  select decrypted_secret into v_chave from vault.decrypted_secrets where name = 'chave_servico';
  if v_url is null or v_chave is null then return null; end if;
  return net.http_post(url := v_url || '/' || p_nome, body := p_corpo,
                       headers := jsonb_build_object('Authorization', 'Bearer ' || v_chave, 'Content-Type', 'application/json'));
end $$;
revoke execute on function chamar_funcao(text, jsonb) from anon, authenticated;

-- Horários em UTC (Brasília = UTC−3): 6h insights, 8h rotina, envio a cada hora.
select cron.schedule('ia-insights-6h', '0 9 * * *', $$ select chamar_funcao('ia-insights', '{"todos": true}') $$);
select cron.schedule('rotina-diaria-8h', '0 11 * * *', $$ select rotina_diaria() $$);
select cron.schedule('enviar-fila-hora', '5 * * * *', $$ select chamar_funcao('enviar-fila') $$);
