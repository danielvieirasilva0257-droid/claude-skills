-- =====================================================================
-- Banco de dados do App Barbeiros para IA (Supabase / PostgreSQL 15+)
-- Versão 2 · 18/11/2026
--
-- Regra principal: o banco calcula, a IA interpreta.
-- Todas as métricas, sugestões de oferta, metas e comissões saem
-- daqui prontas. A IA recebe esses números e só explica e sugere texto.
--
-- Blocos:
--  1. Tipos (enums)
--  2. Perfil do barbeiro, público A/B/C/D e estratégia
--  3. Serviços, combos simultâneos, experiências premium, produtos
--  4. Clientes e recorrência por serviço
--  5. Atendimentos, itens e ofertas (aceitação)
--  6. Narrativas por serviço e por público
--  7. Jornada do atendimento e follow-up / pós-venda / prospecção
--  8. Comissão (fixa ou escalonada), vales, gastos
--  9. Metas sugeridas e insights da IA
-- 10. Views de métricas
-- 11. Funções: sugerir ofertas, sugerir meta, calcular comissão
-- 12. Segurança (RLS) — cada barbeiro só vê os próprios dados
-- 13. Dados padrão (públicos e combos)
-- 14. Estratégias e motor de contato: catálogo de 67 estratégias, ficha,
--     permissões (LGPD), limites de mensagem, lista de espera, datas,
--     fidelidade, assinaturas, origem por canal
-- =====================================================================

-- gen_random_uuid() já vem no Postgres 13+ (sem extensão).

-- =====================================================================
-- 1. TIPOS
-- =====================================================================
create type publico_tipo        as enum ('A','B','C','D');
create type estrategia_tipo     as enum ('volume','ticket','equilibrado');
create type modelo_trabalho     as enum ('comissionado','aluguel_cadeira','autonomo','dono','salao_parceiro');
create type categoria_servico   as enum ('principal','adicional','experiencia');
create type momento_oferta      as enum ('agendamento','chegada','durante','finalizacao','reagendamento','pos_venda');
create type estilo_narrativa    as enum ('rapida','experiencia');
create type status_atendimento  as enum ('agendado','concluido','falta','cancelado');
create type forma_pagamento     as enum ('pix','dinheiro','debito','credito','outro');
create type motivo_recusa       as enum ('tempo','preco','nao_precisa','outra_vez','outro');
create type status_cliente      as enum ('prospect','ativo','inativo');
create type origem_cliente      as enum ('indicacao','instagram','whatsapp','passante','google','outro');
create type etapa_jornada       as enum ('chegada','recepcao','diagnostico','servico','oferta','finalizacao','pagamento','reagendamento','pos_venda','follow_up');
create type aplica_a            as enum ('primeira_vez','recorrente','todos');
create type tipo_followup       as enum ('pos_venda','lembrete_retorno','servico_recorrente','reativacao','aniversario','prospeccao');
create type status_followup     as enum ('pendente','enviado','respondido','agendou','ignorado','cancelado');
create type tipo_comissao       as enum ('fixa','escalonada');
create type metodo_faixa        as enum ('total','marginal');
create type base_comissao       as enum ('bruto','liquido_taxa','liquido_taxa_insumo');
create type tipo_meta           as enum ('faturamento','ticket_medio','ratio','atendimentos','clientes_novos','servico');
create type tipo_insight        as enum ('oportunidade','alerta','elogio','meta','comissao','clientes');

-- =====================================================================
-- 2. PERFIL DO BARBEIRO, PÚBLICO E ESTRATÉGIA
-- =====================================================================

-- Referência dos públicos A/B/C/D (o que cada um exige).
-- Faixas de preço são ponto de partida e podem ser editadas.
create table perfis_publico (
  publico              publico_tipo primary key,
  nome                 text not null,
  preco_corte_min      numeric(10,2),
  preco_corte_max      numeric(10,2),
  foco                 text not null,           -- o que esse público valoriza
  estilo_narrativa     estilo_narrativa not null,
  estrategia_sugerida  estrategia_tipo not null,
  tempo_alvo_corte_min int,                      -- tempo médio esperado de um corte
  regra_oferta         text not null            -- como oferecer para esse público
);

create table barbeiros (
  id                      uuid primary key,      -- = auth.users.id
  nome                    text not null,
  cidade                  text,
  modelo_trabalho         modelo_trabalho not null default 'comissionado',
  publico                 publico_tipo not null default 'C',
  estrategia              estrategia_tipo not null default 'equilibrado',
  preco_corte             numeric(10,2),
  dias_trabalho_semana    int  not null default 6 check (dias_trabalho_semana between 1 and 7),
  horas_dia               numeric(4,1) not null default 9,
  intervalo_retorno_padrao_dias int not null default 21,
  pct_visitas_com_extra_alvo numeric(4,3) not null default 0.5 check (pct_visitas_com_extra_alvo between 0 and 1),
  filosofia_atendimento   text,                  -- ex.: "atender sempre como se fosse a primeira vez"
  ia_perfil               jsonb not null default '{}'::jsonb, -- respostas da entrevista inicial da IA
  criado_em               timestamptz not null default now()
);

-- =====================================================================
-- 3. SERVIÇOS, COMBOS, EXPERIÊNCIAS, PRODUTOS
-- =====================================================================
create table servicos (
  id                          uuid primary key default gen_random_uuid(),
  barbeiro_id                 uuid not null references barbeiros(id) on delete cascade,
  nome                        text not null,
  categoria                   categoria_servico not null default 'principal',
  preco                       numeric(10,2) not null check (preco >= 0),
  duracao_min                 int not null check (duracao_min > 0),
  custo_insumo                numeric(10,2) not null default 0,
  intervalo_recomendado_dias  int,              -- ex.: hidratação 14, depilação 14, sobrancelha 15
  ativo                       boolean not null default true,
  unique (barbeiro_id, nome)
);

-- Como um serviço extra entra junto de um serviço base.
-- "simultaneo" = feito ao mesmo tempo (ex.: hidratação enquanto corta a lateral).
-- tempo_extra_min = quanto aumenta o atendimento (0 quando é simultâneo de verdade).
-- facilidade 1–5 = quão natural é oferecer (barba -> sobrancelha = 5, cliente já deitado).
create table combinacoes_servico (
  id                uuid primary key default gen_random_uuid(),
  barbeiro_id       uuid not null references barbeiros(id) on delete cascade,
  servico_base_id   uuid not null references servicos(id) on delete cascade,
  servico_extra_id  uuid not null references servicos(id) on delete cascade,
  momento           momento_oferta not null default 'durante',
  simultaneo        boolean not null default false,
  tempo_extra_min   int not null default 0 check (tempo_extra_min >= 0),
  facilidade        int not null default 3 check (facilidade between 1 and 5),
  como_executar     text,                         -- passo a passo rápido
  check (servico_base_id <> servico_extra_id),
  unique (servico_base_id, servico_extra_id)
);

-- Itens de experiência para público de ticket alto (cerveja, amendoim, toalha quente...).
create table experiencias_premium (
  id            uuid primary key default gen_random_uuid(),
  barbeiro_id   uuid not null references barbeiros(id) on delete cascade,
  nome          text not null,
  custo         numeric(10,2) not null default 0,
  servico_id    uuid references servicos(id) on delete set null, -- incluso em qual serviço (null = todos)
  publico_min   publico_tipo,                                      -- a partir de qual público faz sentido
  descricao     text,
  ativo         boolean not null default true
);

create table produtos (
  id           uuid primary key default gen_random_uuid(),
  barbeiro_id  uuid not null references barbeiros(id) on delete cascade,
  nome         text not null,
  preco        numeric(10,2) not null check (preco >= 0),
  custo        numeric(10,2) not null default 0,
  ativo        boolean not null default true,
  unique (barbeiro_id, nome)
);

-- =====================================================================
-- 4. CLIENTES E RECORRÊNCIA
-- =====================================================================
create table clientes (
  id                  uuid primary key default gen_random_uuid(),
  barbeiro_id         uuid not null references barbeiros(id) on delete cascade,
  nome                text not null,
  telefone            text,                       -- nunca enviado para a IA
  status              status_cliente not null default 'ativo',
  origem              origem_cliente,
  publico             publico_tipo,               -- se diferente do público geral do barbeiro
  aceita_contato      boolean not null default true,
  aniversario         date,
  preferencias        text,                       -- ex.: "gosta de conversar", "sempre com pressa"
  criado_em           timestamptz not null default now()
);

-- Intervalo próprio por cliente e serviço (sobrepõe o intervalo do serviço).
-- Ex.: este cliente faz hidratação a cada 14 dias e depilação a cada 14 dias.
create table cliente_recorrencia (
  cliente_id     uuid not null references clientes(id) on delete cascade,
  servico_id     uuid not null references servicos(id) on delete cascade,
  intervalo_dias int not null check (intervalo_dias > 0),
  primary key (cliente_id, servico_id)
);

-- =====================================================================
-- 5. ATENDIMENTOS, ITENS E OFERTAS
-- =====================================================================
create table atendimentos (
  id               uuid primary key default gen_random_uuid(),
  barbeiro_id      uuid not null references barbeiros(id) on delete cascade,
  cliente_id       uuid references clientes(id) on delete set null,
  inicio           timestamptz not null,
  fim              timestamptz,
  status           status_atendimento not null default 'concluido',
  forma_pagamento  forma_pagamento,
  taxa_cartao      numeric(10,2) not null default 0,
  observacao       text,
  criado_em        timestamptz not null default now()
);
create index on atendimentos (barbeiro_id, inicio);
create index on atendimentos (cliente_id, inicio);

create table atendimento_itens (
  id               uuid primary key default gen_random_uuid(),
  atendimento_id   uuid not null references atendimentos(id) on delete cascade,
  servico_id       uuid references servicos(id) on delete set null,
  produto_id       uuid references produtos(id) on delete set null,
  quantidade       int not null default 1 check (quantidade > 0),
  valor            numeric(10,2) not null check (valor >= 0), -- valor cobrado (total da linha)
  simultaneo       boolean not null default false,           -- feito junto de outro serviço
  veio_de_oferta   boolean not null default false,           -- entrou porque o barbeiro ofereceu
  check ((servico_id is not null) <> (produto_id is not null))
);
create index on atendimento_itens (atendimento_id);

-- Cada oferta feita: o que foi oferecido, com qual narrativa, se aceitou.
create table ofertas (
  id               uuid primary key default gen_random_uuid(),
  barbeiro_id      uuid not null references barbeiros(id) on delete cascade,
  atendimento_id   uuid references atendimentos(id) on delete cascade,
  cliente_id       uuid references clientes(id) on delete set null,
  servico_id       uuid references servicos(id) on delete set null,
  produto_id       uuid references produtos(id) on delete set null,
  narrativa_id     uuid,                                     -- FK abaixo (tabela criada depois)
  momento          momento_oferta not null default 'durante',
  simultaneo       boolean not null default false,
  aceitou          boolean not null,
  motivo_recusa    motivo_recusa,
  criado_em        timestamptz not null default now(),
  check ((servico_id is not null) <> (produto_id is not null))
);
create index on ofertas (barbeiro_id, criado_em);

-- =====================================================================
-- 6. NARRATIVAS
-- =====================================================================
create table narrativas (
  id             uuid primary key default gen_random_uuid(),
  barbeiro_id    uuid not null references barbeiros(id) on delete cascade,
  servico_id     uuid references servicos(id) on delete cascade,
  produto_id     uuid references produtos(id) on delete cascade,
  publico        publico_tipo,                 -- null = serve para todos
  estilo         estilo_narrativa not null default 'rapida',
  momento        momento_oferta not null default 'durante',
  primeira_vez   boolean,                      -- null = qualquer visita
  titulo         text not null,
  texto          text not null,
  criada_pela_ia boolean not null default false,
  ativa          boolean not null default true,
  criado_em      timestamptz not null default now(),
  check ((servico_id is not null) <> (produto_id is not null))
);

alter table ofertas
  add constraint ofertas_narrativa_fk foreign key (narrativa_id)
  references narrativas(id) on delete set null;

-- No máximo 4 narrativas ativas por serviço/produto e público.
create or replace function limite_narrativas() returns trigger language plpgsql as $$
begin
  if new.ativa and (
    select count(*) from narrativas n
    where n.barbeiro_id = new.barbeiro_id
      and n.ativa
      and n.id <> new.id
      and coalesce(n.servico_id::text, n.produto_id::text) = coalesce(new.servico_id::text, new.produto_id::text)
      and n.publico is not distinct from new.publico
  ) >= 4 then
    raise exception 'Limite de 4 narrativas ativas por serviço e público';
  end if;
  return new;
end $$;
create trigger trg_limite_narrativas before insert or update on narrativas
  for each row execute function limite_narrativas();

-- =====================================================================
-- 7. JORNADA, FOLLOW-UP, PÓS-VENDA, PROSPECÇÃO
-- =====================================================================

-- Processo do barbeiro da chegada até o retorno, levantado na entrevista da IA.
create table jornada_etapas (
  id            uuid primary key default gen_random_uuid(),
  barbeiro_id   uuid not null references barbeiros(id) on delete cascade,
  ordem         int not null,
  etapa         etapa_jornada not null,
  aplica_a      aplica_a not null default 'todos',
  como_faz_hoje text,                         -- o que o barbeiro respondeu
  sugestao_ia   text,                         -- melhoria sugerida
  unique (barbeiro_id, aplica_a, ordem)
);

create table followups (
  id             uuid primary key default gen_random_uuid(),
  barbeiro_id    uuid not null references barbeiros(id) on delete cascade,
  cliente_id     uuid not null references clientes(id) on delete cascade,
  tipo           tipo_followup not null,
  servico_id     uuid references servicos(id) on delete set null, -- quando é lembrete de serviço recorrente
  agendado_para  date not null,
  mensagem       text,
  narrativa_id   uuid references narrativas(id) on delete set null,
  status         status_followup not null default 'pendente',
  criado_em      timestamptz not null default now(),
  concluido_em   timestamptz
);
create index on followups (barbeiro_id, status, agendado_para);

-- =====================================================================
-- 8. COMISSÃO, VALES, GASTOS
-- =====================================================================
create table regras_comissao (
  id                 uuid primary key default gen_random_uuid(),
  barbeiro_id        uuid not null references barbeiros(id) on delete cascade,
  vigente_desde      date not null default current_date,
  tipo               tipo_comissao not null default 'fixa',
  metodo_faixa       metodo_faixa not null default 'total',    -- só para escalonada
  base               base_comissao not null default 'bruto',
  pct_servico_fixo   numeric(5,4),                              -- ex.: 0.40
  pct_produto        numeric(5,4) not null default 0,
  aluguel_cadeira_mensal numeric(10,2) not null default 0,
  unique (barbeiro_id, vigente_desde)
);

-- Faixas da comissão escalonada. "ate" null = sem teto.
-- Ex.: 0–10.000 25% · 10.000–15.000 27% · 15.000+ 29%
create table faixas_comissao (
  regra_id  uuid not null references regras_comissao(id) on delete cascade,
  de        numeric(12,2) not null check (de >= 0),
  ate       numeric(12,2),
  pct       numeric(5,4) not null check (pct between 0 and 1),
  primary key (regra_id, de),
  check (ate is null or ate > de)
);

create table vales (
  id           uuid primary key default gen_random_uuid(),
  barbeiro_id  uuid not null references barbeiros(id) on delete cascade,
  data         date not null default current_date,
  valor        numeric(10,2) not null check (valor > 0),
  motivo       text
);

create table gastos (
  id           uuid primary key default gen_random_uuid(),
  barbeiro_id  uuid not null references barbeiros(id) on delete cascade,
  data         date not null default current_date,
  categoria    text not null,                -- aluguel, produtos, comissão, transporte...
  valor        numeric(10,2) not null check (valor > 0),
  recorrente   boolean not null default false,
  descricao    text
);

-- =====================================================================
-- 9. METAS E INSIGHTS
-- =====================================================================
create table metas (
  id               uuid primary key default gen_random_uuid(),
  barbeiro_id      uuid not null references barbeiros(id) on delete cascade,
  mes              date not null,             -- primeiro dia do mês
  tipo             tipo_meta not null,
  servico_id       uuid references servicos(id) on delete cascade, -- quando tipo = 'servico'
  valor_alvo       numeric(12,2) not null,
  sugerida_pela_ia boolean not null default false,
  base_calculo     jsonb,                     -- números usados na sugestão
  aceita           boolean not null default false,
  unique (barbeiro_id, mes, tipo, servico_id)
);

create table ia_insights (
  id           uuid primary key default gen_random_uuid(),
  barbeiro_id  uuid not null references barbeiros(id) on delete cascade,
  gerado_em    timestamptz not null default now(),
  tipo         tipo_insight not null,
  titulo       text not null,
  numero       text,
  porque       text,
  acao         text,
  botao        text,
  sinal        text,                          -- regra que disparou (ex.: queda_servico)
  visto        boolean not null default false,
  feito        boolean not null default false
);

-- =====================================================================
-- 10. VIEWS DE MÉTRICAS
-- =====================================================================

-- Visitas concluídas com número da visita do cliente (1 = primeira vez).
create view v_visitas as
select a.*,
       row_number() over (partition by a.cliente_id order by a.inicio) as n_visita,
       lag(a.inicio) over (partition by a.cliente_id order by a.inicio) as visita_anterior
from atendimentos a
where a.status = 'concluido';

-- Resumo por atendimento: serviços, extras, produtos, valores.
create view v_atendimento_resumo as
select v.id as atendimento_id, v.barbeiro_id, v.cliente_id, v.inicio, v.n_visita,
       (v.n_visita = 1) as primeira_vez,
       count(i.servico_id)                                              as qtd_servicos,
       count(i.servico_id) filter (where s.categoria <> 'principal')    as qtd_extras,
       coalesce(sum(i.quantidade) filter (where i.produto_id is not null),0) as qtd_produtos,
       coalesce(sum(i.valor) filter (where i.servico_id is not null),0) as valor_servicos,
       coalesce(sum(i.valor) filter (where i.produto_id is not null),0) as valor_produtos,
       coalesce(sum(i.valor),0)                                         as valor_total,
       coalesce(sum(s.custo_insumo),0)                                  as custo_insumo,
       v.taxa_cartao
from v_visitas v
left join atendimento_itens i on i.atendimento_id = v.id
left join servicos s on s.id = i.servico_id
group by v.id, v.barbeiro_id, v.cliente_id, v.inicio, v.n_visita, v.taxa_cartao;

-- Métricas do mês: faturamento, ticket médio, ratio, produtos, % visitas com extra.
create view v_metricas_mes as
select barbeiro_id,
       date_trunc('month', inicio)::date                          as mes,
       count(*)                                                   as atendimentos,
       count(distinct cliente_id)                                 as clientes_unicos,
       count(*) filter (where primeira_vez)                       as clientes_novos,
       sum(valor_total)                                           as faturamento,
       sum(valor_servicos)                                        as faturamento_servicos,
       sum(valor_produtos)                                        as faturamento_produtos,
       round(avg(valor_total),2)                                  as ticket_medio,
       -- Ratio: serviços feitos ÷ clientes atendidos (cada atendimento = 1 cliente na cadeira)
       round(sum(qtd_servicos)::numeric / nullif(count(*),0), 2)  as ratio_servicos_por_cliente,
       sum(qtd_servicos)                                          as servicos_feitos,
       sum(qtd_extras)                                            as extras_feitos,
       sum(qtd_produtos)                                          as produtos_vendidos,
       round(sum(qtd_produtos)::numeric / nullif(count(*),0), 2)  as produtos_por_cliente,
       round(avg((qtd_extras > 0)::int)::numeric, 3)              as pct_atendimentos_com_extra,
       round(avg((qtd_produtos > 0)::int)::numeric, 3)            as pct_atendimentos_com_produto
from v_atendimento_resumo
group by barbeiro_id, date_trunc('month', inicio);

-- Mix de serviços por mês com comparação ao mês anterior (gráfico de barras verticais).
create view v_mix_servicos_mes as
with base as (
  select a.barbeiro_id, date_trunc('month', a.inicio)::date as mes,
         s.id as servico_id, s.nome, s.categoria,
         count(*) as qtd, sum(i.valor) as faturamento
  from atendimentos a
  join atendimento_itens i on i.atendimento_id = a.id
  join servicos s on s.id = i.servico_id
  where a.status = 'concluido'
  group by 1,2,3,4,5
)
select b.*,
       lag(b.qtd) over (partition by b.servico_id order by b.mes) as qtd_mes_anterior,
       round(avg(b.qtd) over (partition by b.servico_id order by b.mes
             rows between 3 preceding and 1 preceding), 1)       as media_3_meses_anteriores
from base b;

-- Mesmo para produtos.
create view v_mix_produtos_mes as
with base as (
  select a.barbeiro_id, date_trunc('month', a.inicio)::date as mes,
         p.id as produto_id, p.nome,
         sum(i.quantidade) as qtd, sum(i.valor) as faturamento
  from atendimentos a
  join atendimento_itens i on i.atendimento_id = a.id
  join produtos p on p.id = i.produto_id
  where a.status = 'concluido'
  group by 1,2,3,4
)
select b.*, lag(b.qtd) over (partition by b.produto_id order by b.mes) as qtd_mes_anterior
from base b;

-- Aceitação por serviço/produto.
create view v_aceitacao_item as
select o.barbeiro_id,
       coalesce(s.nome, p.nome)           as item,
       o.servico_id, o.produto_id,
       count(*)                           as ofertas,
       count(*) filter (where o.aceitou)  as aceitas,
       round(avg(o.aceitou::int)::numeric, 3) as taxa,
       (count(*) < 10)                    as poucos_dados,
       mode() within group (order by o.motivo_recusa) filter (where not o.aceitou) as motivo_recusa_mais_comum
from ofertas o
left join servicos s on s.id = o.servico_id
left join produtos p on p.id = o.produto_id
group by o.barbeiro_id, coalesce(s.nome, p.nome), o.servico_id, o.produto_id;

-- Aceitação por narrativa, separada por tipo de cliente (novo x recorrente).
create view v_aceitacao_narrativa as
select o.barbeiro_id, n.id as narrativa_id, n.titulo, n.servico_id, n.produto_id,
       n.publico, n.estilo,
       case when r.primeira_vez then 'novo' else 'recorrente' end as tipo_cliente,
       count(*)                           as ofertas,
       count(*) filter (where o.aceitou)  as aceitas,
       round(avg(o.aceitou::int)::numeric, 3) as taxa,
       (count(*) < 10)                    as poucos_dados
from ofertas o
join narrativas n on n.id = o.narrativa_id
left join v_atendimento_resumo r on r.atendimento_id = o.atendimento_id
group by o.barbeiro_id, n.id, n.titulo, n.servico_id, n.produto_id, n.publico, n.estilo,
         case when r.primeira_vez then 'novo' else 'recorrente' end;

-- Última vez que cada cliente fez cada serviço + se está "na hora" de oferecer de novo.
create view v_cliente_servico_status as
with ult as (
  select a.cliente_id, i.servico_id, max(a.inicio)::date as ultima_vez, count(*) as vezes
  from atendimentos a
  join atendimento_itens i on i.atendimento_id = a.id
  where a.status = 'concluido' and i.servico_id is not null and a.cliente_id is not null
  group by 1,2
)
select c.barbeiro_id, u.cliente_id, c.nome as cliente, u.servico_id, s.nome as servico,
       s.categoria, u.ultima_vez, u.vezes,
       coalesce(cr.intervalo_dias, s.intervalo_recomendado_dias) as intervalo_dias,
       (current_date - u.ultima_vez) as dias_desde,
       (current_date - u.ultima_vez) >= coalesce(cr.intervalo_dias, s.intervalo_recomendado_dias, 999999) as na_hora
from ult u
join clientes c on c.id = u.cliente_id
join servicos s on s.id = u.servico_id
left join cliente_recorrencia cr on cr.cliente_id = u.cliente_id and cr.servico_id = u.servico_id;

-- Frequência do cliente e % das visitas com extra (alvo do barbeiro, ex.: 50%).
create view v_cliente_frequencia as
select r.barbeiro_id, r.cliente_id, c.nome as cliente,
       count(*)                                   as visitas,
       max(r.inicio)::date                        as ultima_visita,
       round(extract(epoch from (max(r.inicio) - min(r.inicio))) / 86400
             / nullif(count(*) - 1, 0), 1)        as intervalo_medio_dias,
       round(avg((r.qtd_extras > 0)::int)::numeric, 3) as pct_visitas_com_extra,
       round(avg(r.valor_total), 2)               as ticket_medio
from v_atendimento_resumo r
join clientes c on c.id = r.cliente_id
group by r.barbeiro_id, r.cliente_id, c.nome;

-- Clientes sumidos: sem voltar há mais de 2x o intervalo normal dele (ou do padrão do barbeiro).
create view v_clientes_sumidos as
select f.*, b.intervalo_retorno_padrao_dias,
       (current_date - f.ultima_visita) as dias_sem_vir
from v_cliente_frequencia f
join barbeiros b on b.id = f.barbeiro_id
join clientes c on c.id = f.cliente_id
where c.aceita_contato
  and (current_date - f.ultima_visita) > 2 * coalesce(f.intervalo_medio_dias, b.intervalo_retorno_padrao_dias)
  and not exists (select 1 from atendimentos a              -- já tem horário marcado: não está sumido
                  where a.cliente_id = f.cliente_id and a.status = 'agendado' and a.inicio > now());

-- =====================================================================
-- 11. FUNÇÕES
-- =====================================================================

-- 11.1 Sugerir ofertas para um atendimento (agendado ou em andamento).
-- Ordem de prioridade:
--  1) serviço recorrente "na hora" para este cliente (ex.: depilação há 14+ dias)
--  2) combo fácil com o que ele já vai fazer (barba -> sobrancelha)
--  3) para estratégia 'volume', combos simultâneos (sem tempo extra) sobem no ranking
--  4) se o cliente está abaixo do alvo de visitas com extra, a sugestão ganha força
-- Retorna também a melhor narrativa para o público e tipo de cliente.
create or replace function sugerir_ofertas(p_atendimento uuid)
returns table (
  servico_id uuid, servico text, motivo text, simultaneo boolean,
  tempo_extra_min int, preco numeric, pontuacao numeric,
  narrativa_id uuid, narrativa_titulo text, narrativa_texto text,
  narrativa_taxa numeric, narrativa_poucos_dados boolean
)
language sql stable as $$
with at as (
  select a.id, a.barbeiro_id, a.cliente_id,
         b.estrategia, coalesce(c.publico, b.publico) as publico,
         b.pct_visitas_com_extra_alvo,
         (select count(*) = 0 from atendimentos x
           where x.cliente_id = a.cliente_id and x.status = 'concluido' and x.inicio < a.inicio) as primeira_vez
  from atendimentos a
  join barbeiros b on b.id = a.barbeiro_id
  left join clientes c on c.id = a.cliente_id
  where a.id = p_atendimento
),
ja_tem as (
  select i.servico_id from atendimento_itens i where i.atendimento_id = p_atendimento and i.servico_id is not null
),
freq as (
  select coalesce(f.pct_visitas_com_extra, 0) as pct_extra from at
  left join v_cliente_frequencia f on f.cliente_id = at.cliente_id
),
candidatos as (
  -- recorrência na hora
  select st.servico_id, 'recorrente: faz ' || st.servico || ' a cada ' || st.intervalo_dias
           || ' dias, última há ' || st.dias_desde || ' dias' as motivo,
         false as simultaneo, null::int as tempo_extra, 50::numeric as pontos
  from at join v_cliente_servico_status st on st.cliente_id = at.cliente_id
  where st.na_hora and st.servico_id not in (select servico_id from ja_tem)
  union all
  -- combos com o que já está no atendimento
  select cb.servico_extra_id,
         'combina com ' || sb.nome || coalesce(' — ' || cb.como_executar, ''),
         cb.simultaneo, cb.tempo_extra_min,
         (cb.facilidade * 6)::numeric
           + case when (select estrategia from at) = 'volume' and cb.simultaneo then 15 else 0 end
           + case when (select estrategia from at) = 'volume' then greatest(0, 10 - cb.tempo_extra_min) else 0 end
  from combinacoes_servico cb
  join ja_tem j on j.servico_id = cb.servico_base_id
  join servicos sb on sb.id = cb.servico_base_id
  where cb.barbeiro_id = (select barbeiro_id from at)
    and cb.servico_extra_id not in (select servico_id from ja_tem)
),
agrupado as (
  select c.servico_id,
         string_agg(c.motivo, ' · ') as motivo,
         bool_or(c.simultaneo) as simultaneo,
         min(c.tempo_extra) as tempo_extra,
         sum(c.pontos)
           + case when (select pct_extra from freq) < (select pct_visitas_com_extra_alvo from at) then 10 else 0 end
           as pontos
  from candidatos c
  group by c.servico_id
),
melhor_narrativa as (
  select distinct on (n.servico_id)
         n.servico_id, n.id, n.titulo, n.texto,
         coalesce(an.taxa, 0) as taxa, coalesce(an.poucos_dados, true) as poucos_dados
  from narrativas n
  cross join at
  left join v_aceitacao_narrativa an
         on an.narrativa_id = n.id
        and an.tipo_cliente = case when at.primeira_vez then 'novo' else 'recorrente' end
  where n.barbeiro_id = at.barbeiro_id and n.ativa and n.servico_id is not null
    and (n.publico is null or n.publico = at.publico)
    and (n.primeira_vez is null or n.primeira_vez = at.primeira_vez)
  order by n.servico_id,
           (n.publico = at.publico) desc nulls last,
           coalesce(an.poucos_dados, true),            -- com dados suficientes primeiro
           coalesce(an.taxa, 0) desc,
           n.criado_em desc
)
select g.servico_id, s.nome, g.motivo, g.simultaneo, g.tempo_extra, s.preco,
       g.pontos, mn.id, mn.titulo, mn.texto, mn.taxa, mn.poucos_dados
from agrupado g
join servicos s on s.id = g.servico_id and s.ativo
left join melhor_narrativa mn on mn.servico_id = g.servico_id
order by g.pontos desc, s.preco desc
limit 3;
$$;

-- 11.2 Calcular comissão de um valor-base conforme a regra vigente.
create or replace function calcular_comissao(p_barbeiro uuid, p_base numeric, p_data date default current_date)
returns numeric language plpgsql stable as $$
declare
  r regras_comissao%rowtype;
  total numeric := 0;
  f record;
begin
  select * into r from regras_comissao
   where barbeiro_id = p_barbeiro and vigente_desde <= p_data
   order by vigente_desde desc limit 1;
  if not found then return 0; end if;

  if r.tipo = 'fixa' then
    return round(p_base * coalesce(r.pct_servico_fixo, 0), 2);
  end if;

  if r.metodo_faixa = 'total' then
    -- a faixa atingida vale sobre o valor inteiro
    select pct into total from faixas_comissao
     where regra_id = r.id and p_base >= de
     order by de desc limit 1;
    return round(p_base * coalesce(total, 0), 2);
  end if;

  -- marginal: cada faixa só sobre a parte que cai nela
  for f in select de, ate, pct from faixas_comissao where regra_id = r.id order by de loop
    total := total + greatest(0, least(p_base, coalesce(f.ate, p_base)) - f.de) * f.pct;
  end loop;
  return round(total, 2);
end $$;

-- 11.3 Quanto falta para a próxima faixa.
create or replace function proxima_faixa(p_barbeiro uuid, p_base numeric)
returns table (pct_atual numeric, pct_proxima numeric, falta numeric)
language sql stable as $$
  with r as (
    select id from regras_comissao
     where barbeiro_id = p_barbeiro and vigente_desde <= current_date and tipo = 'escalonada'
     order by vigente_desde desc limit 1
  )
  select (select pct from faixas_comissao f, r where f.regra_id = r.id and p_base >= f.de order by f.de desc limit 1),
         f.pct, f.de - p_base
  from faixas_comissao f, r
  where f.regra_id = r.id and f.de > p_base
  order by f.de limit 1;
$$;

-- 11.4 Extrato do mês (base de cálculo, comissão, vales, líquido).
create or replace function extrato_mes(p_barbeiro uuid, p_mes date)
returns table (faturamento_servicos numeric, faturamento_produtos numeric,
               taxas numeric, insumos numeric, base_servicos numeric,
               comissao_servicos numeric, comissao_produtos numeric,
               vales numeric, aluguel numeric, liquido numeric)
language plpgsql stable as $$
declare
  r regras_comissao%rowtype;
  fs numeric; fp numeric; tx numeric; ins numeric; base numeric; vl numeric;
begin
  select * into r from regras_comissao
   where barbeiro_id = p_barbeiro and vigente_desde <= (p_mes + interval '1 month - 1 day')::date
   order by vigente_desde desc limit 1;

  select coalesce(sum(valor_servicos),0), coalesce(sum(valor_produtos),0),
         coalesce(sum(taxa_cartao),0), coalesce(sum(custo_insumo),0)
    into fs, fp, tx, ins
  from v_atendimento_resumo
  where barbeiro_id = p_barbeiro and date_trunc('month', inicio)::date = p_mes;

  base := case coalesce(r.base, 'bruto')
            when 'bruto' then fs
            when 'liquido_taxa' then fs - tx
            else fs - tx - ins end;

  select coalesce(sum(v.valor),0) into vl from vales v
   where v.barbeiro_id = p_barbeiro and date_trunc('month', v.data)::date = p_mes;

  faturamento_servicos := fs; faturamento_produtos := fp; taxas := tx; insumos := ins;
  base_servicos := base;
  comissao_servicos := calcular_comissao(p_barbeiro, base, p_mes);
  comissao_produtos := round(fp * coalesce(r.pct_produto, 0), 2);
  vales := vl;
  aluguel := coalesce(r.aluguel_cadeira_mensal, 0);
  liquido := case when r.tipo is null
                  then fs + fp - tx - aluguel          -- autônomo sem regra: fica com tudo
                  else comissao_servicos + comissao_produtos - vl - aluguel end;
  return next;
end $$;

-- 11.5 Sugerir metas do mês a partir da base de clientes, do público e da estratégia.
-- Usa a média dos últimos 3 meses fechados e a quantidade de clientes ativos.
--   volume:      +atendimentos (agenda cheia), +ratio com extras simultâneos, ticket estável
--   ticket:      atendimentos estáveis, +ticket médio (experiência e serviços premium)
--   equilibrado: crescimento moderado nos dois
create or replace function sugerir_metas(p_barbeiro uuid, p_mes date)
returns jsonb language plpgsql stable as $$
declare
  b barbeiros%rowtype;
  m record;
  ativos int;
  capacidade int;
  meta_atend numeric; meta_ticket numeric; meta_ratio numeric; meta_fat numeric;
begin
  select * into b from barbeiros where id = p_barbeiro;

  select avg(atendimentos) as atend, avg(ticket_medio) as ticket,
         avg(ratio_servicos_por_cliente) as ratio, avg(faturamento) as fat,
         avg(pct_atendimentos_com_extra) as pct_extra
    into m
  from v_metricas_mes
  where barbeiro_id = p_barbeiro and mes >= (p_mes - interval '3 months') and mes < p_mes;

  select count(*) into ativos from v_cliente_frequencia
   where barbeiro_id = p_barbeiro and ultima_visita >= current_date - 60;

  -- capacidade aproximada: horas do mês / tempo médio do corte do público
  capacidade := floor(b.dias_trabalho_semana * 4.3 * b.horas_dia * 60
                / coalesce((select tempo_alvo_corte_min from perfis_publico where publico = b.publico), 40));

  if m.atend is null then
    return jsonb_build_object('aviso', 'Sem histórico de 3 meses: a IA pergunta o faturamento atual antes de sugerir metas.',
                              'clientes_ativos', ativos, 'capacidade_mes', capacidade);
  end if;

  meta_atend  := case b.estrategia when 'volume' then least(capacidade, m.atend * 1.10)
                                   when 'ticket' then m.atend
                                   else least(capacidade, m.atend * 1.05) end;
  meta_ticket := case b.estrategia when 'ticket' then m.ticket * 1.10
                                   when 'volume' then m.ticket * 1.02
                                   else m.ticket * 1.05 end;
  meta_ratio  := case b.estrategia when 'volume' then m.ratio + 0.2
                                   when 'ticket' then m.ratio + 0.1
                                   else m.ratio + 0.15 end;
  meta_fat    := meta_atend * meta_ticket;

  return jsonb_build_object(
    'estrategia', b.estrategia, 'publico', b.publico,
    'clientes_ativos', ativos, 'capacidade_mes', capacidade,
    'media_3_meses', jsonb_build_object('atendimentos', round(m.atend), 'ticket_medio', round(m.ticket,2),
                                        'ratio', round(m.ratio,2), 'faturamento', round(m.fat,2),
                                        'pct_com_extra', round(m.pct_extra,3)),
    'metas', jsonb_build_object('atendimentos', round(meta_atend), 'ticket_medio', round(meta_ticket,2),
                                'ratio', round(meta_ratio,2), 'faturamento', round(meta_fat,2),
                                'pct_atendimentos_com_extra', b.pct_visitas_com_extra_alvo)
  );
end $$;

-- 11.6 Gerar follow-ups automáticos (rodar 1x por dia).
--  - pós-venda 3 dias depois da primeira visita
--  - lembrete de serviço recorrente quando estiver "na hora"
--  - reativação de cliente sumido
create or replace function gerar_followups(p_barbeiro uuid)
returns int language plpgsql as $$
declare n int := 0; k int;
begin
  insert into followups (barbeiro_id, cliente_id, tipo, agendado_para)
  select r.barbeiro_id, r.cliente_id, 'pos_venda', (r.inicio + interval '3 days')::date
  from v_atendimento_resumo r
  join clientes c on c.id = r.cliente_id and c.aceita_contato
  where r.barbeiro_id = p_barbeiro and r.primeira_vez
    and r.inicio >= now() - interval '7 days'
    and not exists (select 1 from followups f where f.cliente_id = r.cliente_id and f.tipo = 'pos_venda');
  get diagnostics k = row_count; n := n + k;

  insert into followups (barbeiro_id, cliente_id, tipo, servico_id, agendado_para)
  select st.barbeiro_id, st.cliente_id, 'servico_recorrente', st.servico_id, current_date
  from v_cliente_servico_status st
  join clientes c on c.id = st.cliente_id and c.aceita_contato
  where st.barbeiro_id = p_barbeiro and st.na_hora
    and not exists (select 1 from atendimentos a where a.cliente_id = st.cliente_id
                    and a.status = 'agendado' and a.inicio > now())
    and not exists (select 1 from followups f where f.cliente_id = st.cliente_id
                    and f.servico_id = st.servico_id and f.status = 'pendente');
  get diagnostics k = row_count; n := n + k;

  insert into followups (barbeiro_id, cliente_id, tipo, agendado_para)
  select s.barbeiro_id, s.cliente_id, 'reativacao', current_date
  from v_clientes_sumidos s
  where s.barbeiro_id = p_barbeiro
    and not exists (select 1 from followups f where f.cliente_id = s.cliente_id
                    and f.tipo = 'reativacao' and f.criado_em > now() - interval '30 days');
  get diagnostics k = row_count; n := n + k;
  return n;
end $$;

-- =====================================================================
-- 12. SEGURANÇA (Supabase RLS): cada barbeiro só acessa os próprios dados
-- =====================================================================
do $$
declare t text;
begin
  foreach t in array array['servicos','combinacoes_servico','experiencias_premium','produtos',
    'clientes','atendimentos','ofertas','narrativas','jornada_etapas','followups',
    'regras_comissao','vales','gastos','metas','ia_insights']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy dono_%1$s on %1$I for all using (barbeiro_id = auth.uid()) with check (barbeiro_id = auth.uid())', t);
  end loop;
end $$;

alter table barbeiros enable row level security;
create policy dono_barbeiros on barbeiros for all using (id = auth.uid()) with check (id = auth.uid());

alter table atendimento_itens enable row level security;
create policy dono_itens on atendimento_itens for all
  using (exists (select 1 from atendimentos a where a.id = atendimento_id and a.barbeiro_id = auth.uid()))
  with check (exists (select 1 from atendimentos a where a.id = atendimento_id and a.barbeiro_id = auth.uid()));

alter table cliente_recorrencia enable row level security;
create policy dono_recorrencia on cliente_recorrencia for all
  using (exists (select 1 from clientes c where c.id = cliente_id and c.barbeiro_id = auth.uid()))
  with check (exists (select 1 from clientes c where c.id = cliente_id and c.barbeiro_id = auth.uid()));

alter table faixas_comissao enable row level security;
create policy dono_faixas on faixas_comissao for all
  using (exists (select 1 from regras_comissao r where r.id = regra_id and r.barbeiro_id = auth.uid()))
  with check (exists (select 1 from regras_comissao r where r.id = regra_id and r.barbeiro_id = auth.uid()));

alter table perfis_publico enable row level security;
create policy leitura_publico on perfis_publico for select using (true);

-- As views herdam a segurança das tabelas (Postgres 15+).
alter view v_visitas               set (security_invoker = on);
alter view v_atendimento_resumo    set (security_invoker = on);
alter view v_metricas_mes          set (security_invoker = on);
alter view v_mix_servicos_mes      set (security_invoker = on);
alter view v_mix_produtos_mes      set (security_invoker = on);
alter view v_aceitacao_item        set (security_invoker = on);
alter view v_aceitacao_narrativa   set (security_invoker = on);
alter view v_cliente_servico_status set (security_invoker = on);
alter view v_cliente_frequencia    set (security_invoker = on);
alter view v_clientes_sumidos      set (security_invoker = on);

-- =====================================================================
-- 13. DADOS PADRÃO
-- =====================================================================
insert into perfis_publico values
 ('A','Alto padrão',        90, null, 'Experiência, exclusividade, atenção total, tempo sem pressa',
  'experiencia','ticket', 60,
  'Oferecer como parte da experiência: diagnóstico, valor percebido, mimos (bebida, toalha quente). Menos clientes, ticket alto.'),
 ('B','Premium',            60,  89.99, 'Qualidade e bom atendimento, aceita pagar por adicionais',
  'experiencia','equilibrado', 45,
  'Oferecer com explicação curta do benefício e um diferencial de experiência.'),
 ('C','Intermediário',      40,  59.99, 'Bom corte, preço justo, tempo razoável',
  'rapida','equilibrado', 40,
  'Oferecer de forma direta, priorizando extras que cabem no mesmo tempo.'),
 ('D','Popular / volume',   null, 39.99, 'Rapidez e preço; agenda cheia',
  'rapida','volume', 30,
  'Oferecer em uma frase, só extras simultâneos ou de 5 minutos. Máximo de serviço no menor tempo.');

-- Combos padrão sugeridos na configuração inicial (o app copia para o barbeiro
-- ligando pelos nomes dos serviços que ele cadastrou).
create table combos_padrao (
  servico_base   text not null,
  servico_extra  text not null,
  momento        momento_oferta not null,
  simultaneo     boolean not null,
  tempo_extra_min int not null,
  facilidade     int not null,
  como_executar  text not null,
  primary key (servico_base, servico_extra)
);

insert into combos_padrao values
 ('Corte','Hidratação','durante', true, 0, 4,
  'Aplicar a hidratação em cima enquanto corta a lateral; lavar junto no fim. Sai cortado, limpo e hidratado no mesmo tempo.'),
 ('Barba','Sobrancelha','durante', false, 5, 5,
  'Cliente já está deitado: fazer a sobrancelha logo depois da barba.'),
 ('Hidratação','Sobrancelha','durante', true, 0, 4,
  'Fazer a sobrancelha enquanto a hidratação age.'),
 ('Barba','Barboterapia','durante', false, 10, 4,
  'Toalha quente e massagem já fazem parte da barba: transformar em barboterapia.'),
 ('Corte','Barba','durante', false, 20, 3,
  'Oferecer no diagnóstico inicial para já reservar o tempo.'),
 ('Barba','Limpeza de pele','durante', false, 10, 3,
  'Pele já preparada pela toalha quente: emendar a limpeza.'),
 ('Corte','Depilação','finalizacao', false, 5, 3,
  'Depilação de nariz/orelha no acabamento, em menos de 5 minutos.');

-- =====================================================================
-- 14. ESTRATÉGIAS E MOTOR DE CONTATO (v2)
-- Catálogo de estratégias que a IA usa para aconselhar, ficha do cliente,
-- permissões (LGPD), controle de frequência de mensagens, lista de espera,
-- datas do cliente, fidelidade, assinaturas e origem por canal.
-- =====================================================================

create type objetivo_estrategia as enum ('volume','ticket','retencao','reativacao','frequencia','indicacao','aquisicao','produto','experiencia');
create type categoria_contato  as enum ('recuperacao','transacional','pos_venda','reagendamento','aniversario','produto','marketing','reativacao');
create type tipo_consentimento as enum ('lembretes','marketing');
create type status_espera      as enum ('aguardando','avisado','agendou','desistiu');
create type tipo_evento        as enum ('aniversario','casamento','formatura','entrevista','viagem','outro');

-- Problemas que uma estratégia ajuda a resolver (o motor cruza com as métricas).
-- segunda_visita, reagendamento, ocupacao, faltas, ticket, produto, sumidos,
-- aquisicao, frequencia, experiencia, consentimento, assinatura, satisfacao
create table estrategias (
  codigo        text primary key,            -- T1, V1, A1, R1, P1...
  grupo         text not null,               -- todos, volume, alto_padrao, retencao, prospeccao
  nome          text not null,
  publicos      publico_tipo[] not null,
  objetivos     objetivo_estrategia[] not null,
  momento       text not null,               -- quando usar / gatilho
  canal         text not null,
  como_executar text not null,
  frase         text,                        -- versão geral ou público D
  frase_a       text,                        -- versão público A/B, quando muda o tom
  metrica       text not null,
  resolve       text[] not null default '{}',
  automatizavel boolean not null default false, -- o app pode disparar sozinho (Premium)
  categoria_contato categoria_contato,        -- quando gera mensagem
  fonte         text
);

-- Quais estratégias o barbeiro ligou e como estão indo.
create table barbeiro_estrategias (
  barbeiro_id  uuid not null references barbeiros(id) on delete cascade,
  codigo       text not null references estrategias(codigo),
  ativa        boolean not null default true,
  ativada_em   timestamptz not null default now(),
  observacao   text,
  primary key (barbeiro_id, codigo)
);

-- Fuso do barbeiro (janela de envio de mensagens é no horário local)
alter table barbeiros add column fuso text not null default 'America/Sao_Paulo';

-- Ficha do cliente (atender sempre como se fosse a primeira vez)
alter table clientes
  add column apelido                 text,
  add column bebida_preferida        text,
  add column tecnica_ultimo_corte    text,       -- ex.: "navalhado na 0, tesoura em cima"
  add column ultimo_assunto          text,
  add column horario_contato         text,       -- ex.: "18h-20h"
  add column origem_codigo           text,       -- palavra-código do link (GOOGLE, REELS...)
  add column indicado_por            uuid references clientes(id) on delete set null,
  add column motivo_sumico           text,       -- mudou, horario, preco, corte, esqueceu
  add column etiquetas               text[] not null default '{}',
  add column pode_receber_oferta     boolean not null default false; -- liga a partir da 2ª visita

create table mimos_recebidos (
  id          uuid primary key default gen_random_uuid(),
  cliente_id  uuid not null references clientes(id) on delete cascade,
  mimo        text not null,
  data        date not null default current_date
);

create table eventos_cliente (
  id          uuid primary key default gen_random_uuid(),
  cliente_id  uuid not null references clientes(id) on delete cascade,
  tipo        tipo_evento not null,
  data        date not null,
  descricao   text
);

-- Permissões (LGPD): lembrete e marketing separados, com o texto aceito.
create table consentimentos (
  id            uuid primary key default gen_random_uuid(),
  cliente_id    uuid not null references clientes(id) on delete cascade,
  tipo          tipo_consentimento not null,
  aceito        boolean not null,
  texto_aceito  text not null,
  canal         text not null default 'whatsapp',
  registrado_em timestamptz not null default now()
);
create index on consentimentos (cliente_id, tipo, registrado_em desc);

-- Histórico de mensagens enviadas (o motor usa para respeitar os limites).
create table contatos_enviados (
  id               uuid primary key default gen_random_uuid(),
  barbeiro_id      uuid not null references barbeiros(id) on delete cascade,
  cliente_id       uuid not null references clientes(id) on delete cascade,
  categoria        categoria_contato not null,
  estrategia       text references estrategias(codigo),
  mensagem         text,
  enviado_em       timestamptz not null default now(),
  respondeu        boolean,
  agendou          boolean
);
create index on contatos_enviados (cliente_id, enviado_em desc);

create table lista_espera (
  id           uuid primary key default gen_random_uuid(),
  barbeiro_id  uuid not null references barbeiros(id) on delete cascade,
  cliente_id   uuid not null references clientes(id) on delete cascade,
  servico_id   uuid references servicos(id) on delete set null,
  preferencia  text,                         -- ex.: "sábado de manhã"
  status       status_espera not null default 'aguardando',
  criado_em    timestamptz not null default now()
);

-- Fidelidade: carimbos (C/D) ou níveis (A/B). Prêmio é adicional, nunca o corte.
create table fidelidade (
  cliente_id  uuid primary key references clientes(id) on delete cascade,
  carimbos    int not null default 0,
  meta        int not null default 10,
  premio      text not null default 'Hidratação',
  nivel       text                           -- ex.: "Prioridade" no público A
);

-- Clube de assinatura
create table planos_assinatura (
  id               uuid primary key default gen_random_uuid(),
  barbeiro_id      uuid not null references barbeiros(id) on delete cascade,
  nome             text not null,            -- Essencial, Plus, Black, Dia fraco...
  preco_mensal     numeric(10,2) not null,
  usos_por_mes     int,                      -- null = ilimitado
  servicos         text[] not null,          -- nomes dos serviços inclusos
  dias_permitidos  int[],                    -- 1=seg ... 7=dom; null = todos
  horario_ate      time,                     -- ex.: 18:00 no plano de dia fraco
  beneficios       text,                     -- prioridade, retoque, adicionais...
  ativo            boolean not null default true
);

create table assinaturas (
  id          uuid primary key default gen_random_uuid(),
  cliente_id  uuid not null references clientes(id) on delete cascade,
  plano_id    uuid not null references planos_assinatura(id),
  inicio      date not null default current_date,
  cancelada_em date,
  motivo_cancelamento text
);

-- Origem por canal ou parceiro (palavra-código do link de WhatsApp)
create table origens (
  barbeiro_id   uuid not null references barbeiros(id) on delete cascade,
  codigo        text not null,               -- GOOGLE, REELS, ACADEMIA-X, INDICA...
  canal         text not null,
  parceiro      text,
  custo_mensal  numeric(10,2) not null default 0,
  primary key (barbeiro_id, codigo)
);

-- ---------- Views do motor ----------

-- Tempo real de cada serviço (atendimentos de um serviço só, com hora de fim)
create view v_tempo_real_servico as
select s.barbeiro_id, s.id as servico_id, s.nome, s.duracao_min as reservado_min,
       round(avg(extract(epoch from (a.fim - a.inicio)) / 60)::numeric, 1) as real_min,
       count(*) as amostras
from servicos s
join atendimento_itens i on i.servico_id = s.id
join atendimentos a on a.id = i.atendimento_id
where a.status = 'concluido' and a.fim is not null
  and (select count(*) from atendimento_itens x where x.atendimento_id = a.id and x.servico_id is not null) = 1
group by s.barbeiro_id, s.id, s.nome, s.duracao_min;

-- Indicadores de saúde da cadeira (últimos 90 dias) que o motor usa para escolher estratégias
create view v_saude_cadeira as
with at as (
  select a.*, r.primeira_vez, r.qtd_extras, r.qtd_produtos
  from atendimentos a
  left join v_atendimento_resumo r on r.atendimento_id = a.id
  where a.inicio >= now() - interval '90 days' and a.inicio <= now()
),
conc as (select * from at where status = 'concluido'),
novos as (
  select c.barbeiro_id, c.cliente_id,
         exists (select 1 from atendimentos b where b.cliente_id = c.cliente_id and b.status in ('concluido','agendado')
                 and b.inicio > c.inicio and b.inicio <= c.inicio + interval '45 days') as voltou
  from conc c where c.primeira_vez and c.inicio <= now() - interval '45 days'
),
reag as (
  select c.barbeiro_id,
         exists (select 1 from atendimentos b where b.cliente_id = c.cliente_id and b.inicio > c.inicio
                 and b.criado_em <= c.inicio + interval '1 day') as reagendou
  from conc c
)
select b.id as barbeiro_id,
  (select round(avg(voltou::int)::numeric,3) from novos n where n.barbeiro_id = b.id)            as taxa_segunda_visita,
  (select round(avg(reagendou::int)::numeric,3) from reag r where r.barbeiro_id = b.id)          as taxa_reagendamento,
  (select round(count(*) filter (where status='falta')::numeric / nullif(count(*),0),3)
     from at where at.barbeiro_id = b.id and status in ('concluido','falta'))                     as taxa_faltas,
  (select round(avg((qtd_produtos > 0)::int)::numeric,3) from conc where conc.barbeiro_id = b.id) as pct_com_produto,
  (select round(avg((qtd_extras > 0)::int)::numeric,3) from conc where conc.barbeiro_id = b.id)   as pct_com_extra,
  (select round(sum(extract(epoch from (coalesce(fim, inicio + interval '40 minutes') - inicio)))/3600
          / nullif(b.dias_trabalho_semana * (90/7.0) * b.horas_dia, 0), 3)
     from conc where conc.barbeiro_id = b.id)                                                     as ocupacao,
  (select count(*) from v_clientes_sumidos s where s.barbeiro_id = b.id)                          as clientes_sumidos,
  (select count(*) from conc where conc.barbeiro_id = b.id and primeira_vez)                      as clientes_novos_90d,
  (select round(avg(case when exists (select 1 from consentimentos k where k.cliente_id = c.id and k.tipo='marketing' and k.aceito)
                    then 1 else 0 end)::numeric,3)
     from clientes c where c.barbeiro_id = b.id)                                                  as pct_com_permissao
from barbeiros b;

-- ---------- Funções do motor ----------

-- Problemas detectados na cadeira (com limites padrão ajustáveis aqui)
create or replace function problemas_cadeira(p_barbeiro uuid)
returns text[] language sql stable as $$
  select array_remove(array[
    case when s.taxa_segunda_visita < 0.55 then 'segunda_visita' end,
    case when s.taxa_reagendamento  < 0.40 then 'reagendamento' end,
    case when s.taxa_faltas         > 0.08 then 'faltas' end,
    case when s.pct_com_produto     < 0.15 then 'produto' end,
    case when s.pct_com_extra < (select pct_visitas_com_extra_alvo from barbeiros where id = p_barbeiro) then 'ticket' end,
    case when s.ocupacao            < 0.70 then 'ocupacao' end,
    case when s.clientes_sumidos    > 0    then 'sumidos' end,
    case when s.clientes_novos_90d  < 10   then 'aquisicao' end,
    case when coalesce(s.pct_com_permissao,0) < 0.80 then 'consentimento' end
  ], null)
  from v_saude_cadeira s where s.barbeiro_id = p_barbeiro;
$$;

-- Sugere até N estratégias para o público do barbeiro, pelos problemas encontrados.
create or replace function sugerir_estrategias(p_barbeiro uuid, p_limite int default 5)
returns table (codigo text, nome text, resolve_aqui text[], como_executar text, frase text, metrica text)
language sql stable as $$
  with b as (select publico, estrategia from barbeiros where id = p_barbeiro),
       p as (select coalesce(problemas_cadeira(p_barbeiro), '{}') as probs)
  select e.codigo, e.nome,
         array(select unnest(e.resolve) intersect select unnest(p.probs)) as resolve_aqui,
         e.como_executar,
         case when (select publico from b) in ('A','B') then coalesce(e.frase_a, e.frase) else e.frase end,
         e.metrica
  from estrategias e, p, b
  where b.publico = any(e.publicos)
    and e.resolve && p.probs
    and not exists (select 1 from barbeiro_estrategias be
                    where be.barbeiro_id = p_barbeiro and be.codigo = e.codigo and be.ativa)
  order by cardinality(array(select unnest(e.resolve) intersect select unnest(p.probs))) desc,
           (case when b.estrategia = 'volume' and 'volume' = any(e.objetivos) then 1
                 when b.estrategia = 'ticket' and 'ticket' = any(e.objetivos) then 1 else 0 end) desc,
           e.codigo
  limit p_limite;
$$;

-- Pode enviar esta mensagem agora? Aplica as regras de frequência, LGPD e prioridade.
create or replace function pode_enviar(p_cliente uuid, p_categoria categoria_contato, p_quando timestamptz default now())
returns table (pode boolean, motivo text)
language plpgsql stable as $$
declare
  ultima_visita timestamptz;
  tem_horario boolean;
  marketing_7d int; marketing_30d int; reativ_90d int; hoje int;
  perm_marketing boolean; perm_lembrete boolean;
  local_ts timestamp;   -- horário no fuso do barbeiro
  dow int; hora int;
  promocional boolean := p_categoria in ('marketing','reativacao','aniversario','produto');
begin
  select p_quando at time zone b.fuso into local_ts
  from clientes c join barbeiros b on b.id = c.barbeiro_id where c.id = p_cliente;
  dow  := extract(isodow from local_ts);
  hora := extract(hour from local_ts);

  select coalesce((select aceito from consentimentos where cliente_id = p_cliente and tipo = 'marketing'
                   order by registrado_em desc limit 1), false),
         coalesce((select aceito from consentimentos where cliente_id = p_cliente and tipo = 'lembretes'
                   order by registrado_em desc limit 1), true)
    into perm_marketing, perm_lembrete;

  select max(inicio) into ultima_visita from atendimentos where cliente_id = p_cliente and status = 'concluido';
  select exists (select 1 from atendimentos where cliente_id = p_cliente and status = 'agendado' and inicio > p_quando)
    into tem_horario;
  select count(*) filter (where categoria in ('marketing','aniversario','produto') and enviado_em > p_quando - interval '7 days'),
         count(*) filter (where categoria in ('marketing','aniversario','produto') and enviado_em > p_quando - interval '30 days'),
         count(*) filter (where categoria = 'reativacao' and enviado_em > p_quando - interval '90 days'),
         count(*) filter (where (enviado_em at time zone (select b.fuso from barbeiros b where b.id = ce.barbeiro_id))::date = local_ts::date)
    into marketing_7d, marketing_30d, reativ_90d, hoje
  from contatos_enviados ce where ce.cliente_id = p_cliente;

  if p_categoria = 'recuperacao' then return query select true, 'recuperação tem prioridade máxima'; return; end if;
  if p_categoria = 'transacional' and not perm_lembrete then return query select false, 'cliente desligou lembretes'; return; end if;
  if promocional and not perm_marketing then return query select false, 'sem permissão de marketing (LGPD)'; return; end if;
  if hoje > 0 then return query select false, 'já recebeu mensagem hoje'; return; end if;
  if p_categoria in ('reagendamento','reativacao') and tem_horario then
    return query select false, 'já tem horário marcado'; return; end if;
  if promocional and ultima_visita > p_quando - interval '7 days' then
    return query select false, 'menos de 7 dias desde a visita'; return; end if;
  if p_categoria in ('marketing','aniversario','produto') and (marketing_7d >= 1 or marketing_30d >= 4) then
    return query select false, 'limite de marketing (1 por semana, 4 por mês)'; return; end if;
  if p_categoria = 'reativacao' and reativ_90d >= 3 then
    return query select false, 'limite de 3 tentativas de reativação'; return; end if;
  if p_categoria <> 'transacional' and (dow = 7 or dow = 1 or not (hora between 9 and 11 or hora between 18 and 19)) then
    return query select false, 'fora da janela de envio (ter-sáb, 9h-12h ou 18h-20h)'; return; end if;
  return query select true, 'ok';
end $$;

-- Uso do plano de assinatura no mês (para o anti-cancelamento R16)
create view v_assinaturas_uso as
select s.id as assinatura_id, c.barbeiro_id, s.cliente_id, c.nome as cliente, p.nome as plano,
       p.usos_por_mes,
       (select count(*) from atendimentos a where a.cliente_id = s.cliente_id and a.status = 'concluido'
          and date_trunc('month', a.inicio) = date_trunc('month', now())) as usos_mes,
       (select max(a.inicio)::date from atendimentos a where a.cliente_id = s.cliente_id and a.status = 'concluido') as ultimo_uso
from assinaturas s
join planos_assinatura p on p.id = s.plano_id
join clientes c on c.id = s.cliente_id
where s.cancelada_em is null;

-- Segurança das tabelas novas
do $$
declare t text;
begin
  foreach t in array array['barbeiro_estrategias','contatos_enviados','lista_espera','planos_assinatura','origens']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy dono_%1$s on %1$I for all using (barbeiro_id = auth.uid()) with check (barbeiro_id = auth.uid())', t);
  end loop;
  foreach t in array array['mimos_recebidos','eventos_cliente','consentimentos','fidelidade','assinaturas']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy dono_%1$s on %1$I for all using (exists (select 1 from clientes c where c.id = cliente_id and c.barbeiro_id = auth.uid())) with check (exists (select 1 from clientes c where c.id = cliente_id and c.barbeiro_id = auth.uid()))', t);
  end loop;
end $$;
alter table estrategias enable row level security;
create policy leitura_estrategias on estrategias for select using (true);
alter view v_tempo_real_servico set (security_invoker = on);
alter view v_saude_cadeira      set (security_invoker = on);
alter view v_assinaturas_uso    set (security_invoker = on);

-- ---------- Catálogo: 67 estratégias aprovadas ----------
insert into estrategias
select * from jsonb_populate_recordset(null::estrategias, $estrategias$[
{"codigo": "T1", "grupo": "todos", "nome": "Cardápio em 3 níveis com âncora", "publicos": ["A", "B", "C", "D"], "objetivos": ["ticket"], "momento": "agendamento e balcão", "canal": "app e presencial", "como_executar": "Três opções lado a lado (Essencial, Completo, Premium/Ritual) com o preço avulso ao lado do pacote. No A/B, mostrar o nível de cima primeiro como âncora. O degrau entre níveis precisa ser claro e a margem calculada.", "frase": "Separado dá R$ 70, no combo completo fica R$ 60.", "frase_a": "O Executivo é o que a maioria escolhe: tem lavagem e acabamento na navalha, a nuca fica limpa por mais tempo.", "metrica": "% de vendas em cada nível; ticket médio antes e depois", "resolve": ["ticket"], "automatizavel": false, "categoria_contato": null, "fonte": "https://sebraepr.com.br/?p=481632"},
{"codigo": "T2", "grupo": "todos", "nome": "Adicional sugerido na confirmação", "publicos": ["A", "B", "C", "D"], "objetivos": ["ticket"], "momento": "agendamento", "canal": "app e WhatsApp", "como_executar": "Quando o cliente confirma o horário, o app sugere um único adicional com preço e tempo, aceito com um toque. Até 7 opções no app, nenhuma acima de 15 min.", "frase": "Confirmado às 16h! Quer incluir a sobrancelha? +R$ 15, quase não muda o tempo.", "frase_a": null, "metrica": "% de agendamentos com adicional antes da visita", "resolve": ["ticket"], "automatizavel": true, "categoria_contato": "transacional", "fonte": "https://www.zenoti.com/thecheckin/salon-upselling-strategies"},
{"codigo": "T3", "grupo": "todos", "nome": "Produto narrado durante o uso", "publicos": ["A", "B", "C", "D"], "objetivos": ["produto"], "momento": "durante e finalização", "canal": "presencial", "como_executar": "Escolher um único produto ligado ao problema do cliente, dizer o nome enquanto aplica e só falar o preço no espelho. Uma recomendação por visita; aceitar o não.", "frase": "Teu fio é grosso, por isso usei essa pomada de base água: segura sem resíduo. Se quiser repetir em casa, ela custa R$ 69.", "frase_a": null, "metrica": "% de atendimentos com produto; recompra", "resolve": ["produto"], "automatizavel": false, "categoria_contato": null, "fonte": "https://www.zenoti.com/thecheckin/salon-upselling-strategies"},
{"codigo": "V1", "grupo": "volume", "nome": "Lista de espera com disparo de vaga", "publicos": ["B", "C", "D"], "objetivos": ["volume"], "momento": "agendamento", "canal": "app e WhatsApp", "como_executar": "Quem não achou horário entra na lista; quando alguém cancela, o app avisa a lista em ordem e o primeiro que responder leva a vaga.", "frase": "Sábado tá lotado, mas te coloco na lista. Abriu vaga, te chamo na hora.", "frase_a": null, "metrica": "vagas canceladas reaproveitadas ÷ vagas canceladas", "resolve": ["ocupacao"], "automatizavel": true, "categoria_contato": "transacional", "fonte": "https://biz.booksy.com/blog/the-barber-chair-turnaround-minimizing-idle-time-between-appointments"},
{"codigo": "V2", "grupo": "volume", "nome": "Agenda em bloco (sem buracos)", "publicos": ["A", "B", "C", "D"], "objetivos": ["volume"], "momento": "agendamento", "canal": "app", "como_executar": "No agendamento online, mostrar primeiro os horários colados em atendimentos já marcados ou no começo e fim do turno, evitando buracos de 15-20 min.", "frase": "Tenho 14h20 logo depois de um cliente, encaixa pra você?", "frase_a": null, "metrica": "minutos ociosos por dia; ocupação", "resolve": ["ocupacao"], "automatizavel": true, "categoria_contato": null, "fonte": "https://biz.booksy.com/blog/the-barber-chair-turnaround-minimizing-idle-time-between-appointments"},
{"codigo": "V3", "grupo": "volume", "nome": "Duração real por serviço", "publicos": ["A", "B", "C", "D"], "objetivos": ["volume"], "momento": "agendamento", "canal": "app", "como_executar": "O app mede início e fim de cada serviço e sugere ajustar o tamanho do horário todo mês.", "frase": "Teu corte social leva 28 min em média e a agenda reserva 40. Dá pra abrir mais 3 horários por dia.", "frase_a": null, "metrica": "tempo real vs reservado; faturamento por hora", "resolve": ["ocupacao"], "automatizavel": true, "categoria_contato": null, "fonte": "https://getsquire.com/blog/top-ways-barbers-waste-time-and-money-when-not-cutting-hair"},
{"codigo": "V4", "grupo": "volume", "nome": "Bancada em 3 minutos", "publicos": ["A", "B", "C", "D"], "objetivos": ["volume"], "momento": "finalização", "canal": "presencial", "como_executar": "Sequência fixa de limpeza com spray, pentes e lâminas sempre no mesmo lugar, numa bandeja com divisórias.", "frase": null, "frase_a": null, "metrica": "intervalo entre o fim de um atendimento e o começo do próximo", "resolve": ["ocupacao"], "automatizavel": false, "categoria_contato": null, "fonte": "https://biz.booksy.com/blog/the-barber-chair-turnaround-minimizing-idle-time-between-appointments"},
{"codigo": "V5", "grupo": "volume", "nome": "Ficha rápida + perguntas fechadas", "publicos": ["A", "B", "C", "D"], "objetivos": ["volume", "retencao"], "momento": "chegada", "canal": "presencial", "como_executar": "Abrir a ficha (foto e técnica do último corte) e perguntar com opções, em vez de 'o que vai ser hoje?'. Economiza uns 3 min (estimativa).", "frase": "Mesmo do mês passado, navalhado na 0 e tesoura em cima, ou quer baixar mais?", "frase_a": null, "metrica": "% de atendimentos com ficha preenchida", "resolve": ["ocupacao", "segunda_visita"], "automatizavel": false, "categoria_contato": null, "fonte": "https://biz.booksy.com/blog/the-barber-chair-turnaround-minimizing-idle-time-between-appointments"},
{"codigo": "V6", "grupo": "volume", "nome": "Tolerância de atraso com lembrete", "publicos": ["B", "C", "D"], "objetivos": ["volume"], "momento": "agendamento", "canal": "WhatsApp", "como_executar": "Lembrete no dia com a regra escrita (10 min de tolerância); passou disso, o horário vira encaixe para a lista de espera.", "frase": "Te espero às 15h! Tolerância de 10 min, depois preciso passar a vez, beleza?", "frase_a": null, "metrica": "faltas e atrasos; minutos perdidos por semana", "resolve": ["faltas"], "automatizavel": true, "categoria_contato": "transacional", "fonte": "https://biz.booksy.com/blog/the-barber-chair-turnaround-minimizing-idle-time-between-appointments"},
{"codigo": "V7", "grupo": "volume", "nome": "Tirar a capa e entregar o produto", "publicos": ["A", "B", "C", "D"], "objetivos": ["volume", "produto"], "momento": "finalização", "canal": "presencial", "como_executar": "Depois do espelho, tirar a capa (sinal de que acabou) e entregar na mão o produto que usou. Libera a cadeira mais rápido.", "frase": "Usei essa pomada de efeito seco, segura o dia todo. Fica com ela se quiser, tá R$ 45.", "frase_a": null, "metrica": "% de atendimentos com produto; intervalo entre clientes", "resolve": ["produto", "ocupacao"], "automatizavel": false, "categoria_contato": null, "fonte": "https://biz.booksy.com/blog/the-barber-chair-turnaround-minimizing-idle-time-between-appointments"},
{"codigo": "V8", "grupo": "volume", "nome": "Kit de manutenção no balcão", "publicos": ["C", "D"], "objetivos": ["produto", "ticket"], "momento": "pagamento", "canal": "presencial", "como_executar": "1 ou 2 kits baratos (pomada pequena + pente, ou óleo + balm) mais em conta que os itens separados, ao lado do Pix.", "frase": "Pra manter em casa até voltar, o kit sai mais barato que separado.", "frase_a": null, "metrica": "kits vendidos por semana", "resolve": ["produto"], "automatizavel": false, "categoria_contato": null, "fonte": "https://blog.cielo.com.br/dicas-e-historias-de-sucesso/o-que-vender-na-barbearia/"},
{"codigo": "V9", "grupo": "volume", "nome": "Assinatura de dia fraco", "publicos": ["C", "D"], "objetivos": ["retencao", "volume"], "momento": "pagamento", "canal": "presencial e WhatsApp", "como_executar": "Plano mensal só de segunda a quarta, 1 serviço por semana, sem fidelidade e cobrança recorrente. Exemplo real: R$ 79/mês.", "frase": "Você vem toda semana. No plano de segunda a quarta fica bem mais em conta e não tem fidelidade.", "frase_a": null, "metrica": "assinantes; ocupação de segunda a quarta; cancelamentos", "resolve": ["ocupacao", "assinatura"], "automatizavel": false, "categoria_contato": null, "fonte": "https://ohoje.com/2026/08/31/barbearia-por-assinatura-cresce-e-muda-habitos-de-consumo-dos-homens/"},
{"codigo": "V10", "grupo": "volume", "nome": "Combo pai e filho", "publicos": ["B", "C", "D"], "objetivos": ["ticket", "aquisicao"], "momento": "agendamento", "canal": "presencial e Instagram", "como_executar": "Pacote família em horários seguidos, mais barato que separado. Reforço na volta às aulas e no Dia dos Pais.", "frase": "Traz o moleque junto? Marco os dois em sequência e faço preço de combo.", "frase_a": null, "metrica": "% de agendamentos com 2+ pessoas", "resolve": ["ticket", "aquisicao"], "automatizavel": false, "categoria_contato": null, "fonte": "https://www.mangomint.com/blog/barbershop-menu-ideas/"},
{"codigo": "V11", "grupo": "volume", "nome": "Limite de encaixes por turno", "publicos": ["C", "D"], "objetivos": ["volume"], "momento": "agendamento", "canal": "app", "como_executar": "No máximo 1-2 encaixes por turno, para não atrasar quem marcou.", "frase": null, "frase_a": null, "metrica": "atraso médio da agenda", "resolve": ["ocupacao"], "automatizavel": true, "categoria_contato": null, "fonte": "https://www.socialhub.pro/blog/encaixe-agenda-emergencia-whatsapp/"},
{"codigo": "V12", "grupo": "volume", "nome": "Pix fixo na bancada", "publicos": ["C", "D"], "objetivos": ["volume"], "momento": "pagamento", "canal": "presencial", "como_executar": "QR do Pix na bancada para cobrar sem levantar, quando não há recepção.", "frase": null, "frase_a": null, "metrica": "tempo de pagamento", "resolve": ["ocupacao"], "automatizavel": false, "categoria_contato": null, "fonte": null},
{"codigo": "V13", "grupo": "volume", "nome": "'Vou pensar': separar o produto", "publicos": ["A", "B", "C", "D"], "objetivos": ["produto"], "momento": "pagamento", "canal": "presencial", "como_executar": "Quando o cliente diz que vai pensar, anotar na ficha e deixar o produto separado para a próxima visita.", "frase": "Tranquilo, deixo uma separada pra quando você voltar.", "frase_a": null, "metrica": "conversão do 'vou pensar' na visita seguinte", "resolve": ["produto"], "automatizavel": false, "categoria_contato": null, "fonte": "https://www.zenoti.com/thecheckin/salon-upselling-strategies"},
{"codigo": "A1", "grupo": "alto_padrao", "nome": "Ficha do cliente + pré-briefing de 30 s", "publicos": ["A", "B"], "objetivos": ["retencao", "experiencia"], "momento": "chegada", "canal": "presencial", "como_executar": "Depois de cada atendimento, anotar corte e máquina, bebida preferida, assunto da conversa e evento que vem aí. Antes de ele chegar, ler por 30 s e começar a conversa dali.", "frase": null, "frase_a": "E aí, Rafael, como foi a viagem pra Floripa? Mantive o 2 na lateral, ou quer testar mais baixo?", "metrica": "% de atendimentos com ficha; retorno de quem tem ficha vs quem não tem", "resolve": ["segunda_visita", "experiencia"], "automatizavel": false, "categoria_contato": null, "fonte": "https://vinci-26-website.pages.dev/blog/create-vip-experience-clients-pay-premium"},
{"codigo": "A2", "grupo": "alto_padrao", "nome": "Consulta com foto na primeira visita", "publicos": ["A", "B", "C"], "objetivos": ["retencao"], "momento": "chegada (1ª visita)", "canal": "presencial", "como_executar": "Antes da máquina, perguntar o que gostou e o que não gostou nos cortes anteriores, mostrar 2-3 fotos e repetir o combinado em voz alta.", "frase": "Do último corte, o que você gostou e o que te incomodou? Quero acertar de primeira.", "frase_a": null, "metrica": "taxa de 2ª visita em 45 dias", "resolve": ["segunda_visita"], "automatizavel": false, "categoria_contato": null, "fonte": "https://vinci-26-website.pages.dev/blog/turn-first-time-clients-into-regulars"},
{"codigo": "A3", "grupo": "alto_padrao", "nome": "Visagismo como serviço pago", "publicos": ["A", "B"], "objetivos": ["ticket"], "momento": "agendamento", "canal": "presencial", "como_executar": "Consultoria de imagem com análise de rosto, fio e rotina, entregando o corte e um plano de manutenção. Cobrar à parte, nunca de graça (referência: R$ 150 a R$ 1.000+ em Belém).", "frase": null, "frase_a": "Você comentou que vai mudar de cargo. Tenho uma consultoria que monta corte e barba pra imagem que você quer passar. Te explico?", "metrica": "consultorias por mês; ticket de quem fez", "resolve": ["ticket"], "automatizavel": false, "categoria_contato": null, "fonte": "https://www.oliberal.com/empreendamais/visagismo-conheca-o-metodo-que-impulsiona-barbearias-em-belem-com-servicos-de-ate-r-1-mil-1.1154507"},
{"codigo": "A4", "grupo": "alto_padrao", "nome": "Lavagem com massagem antes do corte", "publicos": ["A", "B"], "objetivos": ["ticket", "experiencia"], "momento": "chegada", "canal": "presencial", "como_executar": "Oferecer como upgrade justificado pela técnica, não só pelo conforto. 3-5 min.", "frase": null, "frase_a": "Lavando antes, vejo o caimento natural do fio e o corte fica mais preciso. Faço com uma massagem rápida, quer?", "metrica": "% de cortes com lavagem", "resolve": ["ticket"], "automatizavel": false, "categoria_contato": null, "fonte": "https://hji.co.uk/five-top-tips-for-upselling-to-men"},
{"codigo": "A5", "grupo": "alto_padrao", "nome": "Não vender produto na primeira visita", "publicos": ["A", "B", "C"], "objetivos": ["retencao", "produto"], "momento": "durante (1ª visita)", "canal": "presencial", "como_executar": "Na 1ª visita, só educar. Venda de produto e clube a partir da 2ª; o app liga 'pode receber oferta' na ficha (só 13% das vendas de produto acontecem na 1ª visita, segundo a Boulevard).", "frase": "Hoje é pra você conhecer o trabalho. Na próxima te mostro o que usar em casa.", "frase_a": null, "metrica": "taxa de 2ª visita; conversão de produto a partir da 2ª", "resolve": ["segunda_visita", "produto"], "automatizavel": true, "categoria_contato": null, "fonte": "https://www.gcimagazine.com/home/article/22878708/boulevard-boulevard-report-reveals-topperforming-salons-retain-56-percent-more-firsttime-visitors-than-average"},
{"codigo": "A6", "grupo": "alto_padrao", "nome": "Retoque de pezinho grátis no Ritual", "publicos": ["A", "B"], "objetivos": ["retencao", "ticket"], "momento": "pós-venda", "canal": "presencial", "como_executar": "Incluir no pacote de cima um retoque de 10 min em até 10-14 dias, encaixado em buracos da agenda.", "frase": null, "frase_a": "No Ritual já tem um retoque do pezinho em até 10 dias, é só marcar 10 minutinhos.", "metrica": "uso do retoque; upgrade para o Ritual", "resolve": ["ticket", "frequencia"], "automatizavel": false, "categoria_contato": null, "fonte": "https://vinci-26-website.pages.dev/blog/create-vip-experience-clients-pay-premium"},
{"codigo": "A7", "grupo": "alto_padrao", "nome": "Clube em 3 níveis vendendo acesso", "publicos": ["A", "B"], "objetivos": ["retencao", "ticket"], "momento": "pagamento", "canal": "presencial", "como_executar": "Essencial, Plus e Black; o nível de cima vende prioridade (horário nobre garantido, retoque, adicionais), não desconto. Mostrar o Black primeiro.", "frase": null, "frase_a": "Pelo seu ritmo de 15 em 15 dias, o Plus sai mais em conta e garante seu sábado, que costuma lotar.", "metrica": "assinantes; receita recorrente; cancelamentos", "resolve": ["assinatura", "frequencia"], "automatizavel": false, "categoria_contato": null, "fonte": "https://diariodonordeste.verdesmares.com.br/negocios/barbearias-por-assinatura-se-tornam-tendencia-e-garantem-seguranca-financeira-para-empreendedores-1.3719458"},
{"codigo": "A8", "grupo": "alto_padrao", "nome": "Surpresa rotativa registrada", "publicos": ["A", "B"], "objetivos": ["experiencia", "retencao"], "momento": "durante", "canal": "presencial", "como_executar": "6-8 mimos pequenos em rodízio (massagem de 5 min, amostra de pós-barba, café especial); o app registra o que cada cliente já recebeu para nunca repetir. Custo de R$ 0 a 5 (estimativa).", "frase": null, "frase_a": "Chegou um pós-barba novo que estou testando. Quer experimentar e me dizer o que achou?", "metrica": "% de visitas com surpresa; nota de satisfação", "resolve": ["experiencia"], "automatizavel": false, "categoria_contato": null, "fonte": "https://vinci-26-website.pages.dev/blog/create-vip-experience-clients-pay-premium"},
{"codigo": "A9", "grupo": "alto_padrao", "nome": "Ritual da estação", "publicos": ["A", "B"], "objetivos": ["experiencia"], "momento": "chegada", "canal": "presencial", "como_executar": "No verão, toalha gelada com óleo essencial; aroma fixo da casa e playlist curada. Perguntar antes sobre sensibilidade a cheiro.", "frase": null, "frase_a": "Tá calor hoje, toma uma toalha gelada pra nuca enquanto preparo aqui.", "metrica": "menções a 'experiência' nas avaliações", "resolve": ["experiencia"], "automatizavel": false, "categoria_contato": null, "fonte": "https://thecut.co/blog/how-to-enhance-barbershop-experience-for-clients-improve-reviews-referrals"},
{"codigo": "A10", "grupo": "alto_padrao", "nome": "Pacote Evento e Noivo", "publicos": ["A", "B"], "objetivos": ["ticket", "aquisicao"], "momento": "agendamento", "canal": "presencial e parcerias", "como_executar": "Teste de corte 2-3 semanas antes, corte e barba na véspera, retoque no dia, versão para padrinhos. Parceria com cerimonialistas e fotógrafos.", "frase": null, "frase_a": "Seu casamento é em março, né? Faço um teste três semanas antes e na véspera deixo tudo no ponto. Levo os padrinhos junto?", "metrica": "pacotes por mês; clientes novos vindos dos padrinhos", "resolve": ["ticket", "aquisicao"], "automatizavel": false, "categoria_contato": null, "fonte": null},
{"codigo": "A11", "grupo": "alto_padrao", "nome": "Vale-experiência para presentear", "publicos": ["A", "B"], "objetivos": ["aquisicao", "ticket"], "momento": "pagamento", "canal": "app", "como_executar": "Vender o Ritual ou a Consultoria como vale digital 30-45 dias antes do Dia dos Pais e do Natal.", "frase": null, "frase_a": "Se quiser presentear alguém, o Ritual vira vale-presente. Mando o cartão digital pronto.", "metrica": "vales vendidos e resgatados", "resolve": ["aquisicao", "ticket"], "automatizavel": false, "categoria_contato": null, "fonte": null},
{"codigo": "A12", "grupo": "alto_padrao", "nome": "Horário nobre com preço diferenciado", "publicos": ["A"], "objetivos": ["ticket"], "momento": "agendamento", "canal": "app", "como_executar": "Adicional nos horários mais disputados (sábado de manhã, depois das 19h) e taxa fixa fora do expediente (+R$ 40 a 80, estimativa).", "frase": null, "frase_a": "Às 20h abro só pra você. Tem um adicional por ser fora do expediente, mas a casa fica toda sua.", "metrica": "ocupação e faturamento por hora nesses horários", "resolve": ["ticket"], "automatizavel": false, "categoria_contato": null, "fonte": "https://getsquire.com/business-edge/pricing-by-experience"},
{"codigo": "A13", "grupo": "alto_padrao", "nome": "Reajuste de preço guiado pela taxa de retorno", "publicos": ["A", "B"], "objetivos": ["ticket"], "momento": "pagamento", "canal": "app", "como_executar": "A IA olha o reagendamento dos últimos 12 meses. 65% ou mais: subir 5-10%. De 50 a 65%: subir 5-7% num serviço. Abaixo de 50%: resolver retenção antes. Avisar com 30-60 dias.", "frase": null, "frase_a": "A partir de março o Executivo passa a R$ 125. Quem já está agendado fica no valor de hoje.", "metrica": "faturamento por cadeira e retorno nos 30 dias seguintes", "resolve": ["ticket"], "automatizavel": false, "categoria_contato": null, "fonte": "https://getsquire.com/business-edge/pricing-by-experience"},
{"codigo": "A14", "grupo": "alto_padrao", "nome": "Tratamento de couro cabeludo (head spa)", "publicos": ["A", "B"], "objetivos": ["ticket", "experiencia"], "momento": "durante", "canal": "presencial", "como_executar": "Serviço de 15-25 min com esfoliação, massagem e máscara, vendido como bem-estar ou cuidado com caspa e queda.", "frase": null, "frase_a": "Seu couro cabeludo está um pouco irritado. Tenho um tratamento de 20 min que limpa e acalma. Quer incluir?", "metrica": "tratamentos por mês; recompra", "resolve": ["ticket"], "automatizavel": false, "categoria_contato": null, "fonte": null},
{"codigo": "A15", "grupo": "alto_padrao", "nome": "Mensagem pós-visita com dica do corte", "publicos": ["A", "B", "C"], "objetivos": ["retencao", "produto"], "momento": "24-48 h depois da visita", "canal": "WhatsApp", "como_executar": "Agradecer, dar uma dica de manutenção daquele corte e o link para reagendar. Sem desconto.", "frase": "Pra manter o volume, passa a pomada com o cabelo quase seco, de trás pra frente. Teu corte segura até o dia 3. Já reservo?", "frase_a": null, "metrica": "respostas; reagendamentos vindos da mensagem", "resolve": ["reagendamento", "segunda_visita"], "automatizavel": true, "categoria_contato": "pos_venda", "fonte": "https://bookedin.com/blog/upselling-in-barbershops/"},
{"codigo": "A16", "grupo": "alto_padrao", "nome": "Convite pessoal numerado", "publicos": ["A", "B"], "objetivos": ["indicacao", "aquisicao"], "momento": "pós-venda", "canal": "presencial", "como_executar": "3 cartões numerados de papel especial só para os clientes mais fiéis entregarem a quem quiserem. O valor está na exclusividade.", "frase": null, "frase_a": "Você é dos clientes que eu mais gosto de atender. Tenho só 3 desses, entrega pra quem vai curtir.", "metrica": "convites resgatados; ticket dos indicados", "resolve": ["aquisicao"], "automatizavel": false, "categoria_contato": null, "fonte": null},
{"codigo": "R1", "grupo": "retencao", "nome": "Reagendar na cadeira com data recomendada", "publicos": ["A", "B", "C", "D"], "objetivos": ["frequencia", "retencao"], "momento": "saindo da cadeira", "canal": "presencial + confirmação WhatsApp", "como_executar": "Não perguntar 'quando quer voltar?'. Propor dia e hora pelo tipo de corte (degradê 15-21 dias, social 28-35) e mandar a confirmação na hora. Quem não marcar recebe a etiqueta 'sem próximo horário'.", "frase": "Esse degradê aguenta umas 2 semanas e meia. Já deixo teu horário dia 9?", "frase_a": "Pra esse acabamento ficar sempre alinhado, o ideal é voltar em 3 semanas. Te deixo reservado dia 9, mesmo horário?", "metrica": "% de atendimentos que saem com o próximo horário", "resolve": ["reagendamento", "frequencia"], "automatizavel": false, "categoria_contato": null, "fonte": "https://www.kitomba.com/blog/how-to-rebook-clients-before-they-leave-the-chair/"},
{"codigo": "R2", "grupo": "retencao", "nome": "Checagem do espelho + garantia de 7 dias", "publicos": ["A", "B", "C", "D"], "objetivos": ["retencao"], "momento": "fim do serviço", "canal": "presencial", "como_executar": "Mostrar nuca e laterais, perguntar o que ajustar e avisar que ajuste em até 7 dias é grátis. A maioria vai embora sem reclamar e só não volta.", "frase": "Olha aí atrás. Tá do jeito que você queria? Se em casa achar algo torto, volta em até 7 dias que eu arrumo na faixa.", "frase_a": "Dá uma olhada na nuca e na lateral. Quer mais baixo em algum ponto? Se em casa notar algo, você tem 7 dias pra eu ajustar sem custo.", "metrica": "ajustes pedidos; retorno de quem pediu ajuste", "resolve": ["segunda_visita", "satisfacao"], "automatizavel": false, "categoria_contato": null, "fonte": "https://biz.booksy.com/blog/why-your-regulars-are-ghosting-you"},
{"codigo": "R3", "grupo": "retencao", "nome": "Ponte da 1ª para a 2ª visita", "publicos": ["B", "C", "D"], "objetivos": ["retencao"], "momento": "cliente novo sem reagendar, dia 10-12", "canal": "WhatsApp", "como_executar": "A 2ª visita é onde mais se perde cliente (48% a 70% dos novos não voltam, segundo Squire e Booksy). Oferecer um pezinho grátis de 10 min antes do próximo corte, uma vez por cliente. No A: revisão de acabamento.", "frase": "Primeira vez aqui, o pezinho é por minha conta até o próximo corte. Passa quinta que eu deixo na régua, 10 minutinhos.", "frase_a": "Pra quem está vindo pela primeira vez, ofereço uma revisão de acabamento sem custo antes do próximo corte. Reservo quinta às 18h?", "metrica": "taxa de 2ª visita em 45 dias", "resolve": ["segunda_visita"], "automatizavel": true, "categoria_contato": "pos_venda", "fonte": "https://getsquire.com/business-edge/why-barbershop-clients-dont-come-back"},
{"codigo": "R4", "grupo": "retencao", "nome": "Confirmação D-1 sem dar saída", "publicos": ["A", "B", "C", "D"], "objetivos": ["retencao"], "momento": "véspera 18h-20h", "canal": "WhatsApp", "como_executar": "Dizer que o horário está guardado e pedir só para avisar se tiver imprevisto. No dia, 'tô te esperando' só para quem não confirmou. Máximo de 2 lembretes.", "frase": "Amanhã às 15h tá guardado pra você. Se der ruim, me chama que a gente troca.", "frase_a": "Seu horário de amanhã às 15h está reservado. Qualquer imprevisto, me avisa que eu remarco.", "metrica": "taxa de faltas", "resolve": ["faltas"], "automatizavel": true, "categoria_contato": "transacional", "fonte": "https://getsquire.com/business-edge/what-to-say-when-a-client-no-shows"},
{"codigo": "R5", "grupo": "retencao", "nome": "Recuperação de falta + sinal na 2ª falta", "publicos": ["A", "B", "C", "D"], "objetivos": ["retencao"], "momento": "1-2 h depois da falta", "canal": "WhatsApp", "como_executar": "Primeira falta: mensagem leve já oferecendo horário. Segunda falta: pedir sinal no Pix (25-50%) para reservar, descontado no serviço.", "frase": "E aí, deu algum B.O. hoje? Sem estresse. Tenho quinta às 18h, quer?", "frase_a": "Senti sua falta hoje às 15h. Espero que esteja tudo bem. Quer que eu encaixe você quinta?", "metrica": "faltosos que remarcam; reincidência", "resolve": ["faltas"], "automatizavel": true, "categoria_contato": "transacional", "fonte": "https://getsquire.com/business-edge/what-to-say-when-a-client-no-shows"},
{"codigo": "R6", "grupo": "retencao", "nome": "Reagendamento a quente", "publicos": ["B", "C", "D"], "objetivos": ["frequencia"], "momento": "intervalo médio do cliente menos 3 dias", "canal": "WhatsApp", "como_executar": "Para quem não tem horário marcado, oferecer 2 horários concretos um pouco antes do lembrete 'na hora'. Sem desconto.", "frase": "Semana que vem teu corte já pede manutenção. Tenho terça 19h ou quinta 18h, qual?", "frase_a": null, "metrica": "agendamentos em 48 h; intervalo médio", "resolve": ["reagendamento", "frequencia"], "automatizavel": true, "categoria_contato": "reagendamento", "fonte": "https://heygoldie.com/blog/rebooking-reminder-templates"},
{"codigo": "R7", "grupo": "retencao", "nome": "Escassez real de sábado", "publicos": ["A", "B", "C", "D"], "objetivos": ["frequencia"], "momento": "quarta de manhã, com 3 vagas ou menos", "canal": "WhatsApp", "como_executar": "Só para quem costuma vir no sábado e não marcou, e só quando a agenda mostra que é verdade.", "frase": "Sábado só tem 2 vagas: 9h e 14h. Tu sempre vem sábado, quer garantir a tua?", "frase_a": "Restam 2 horários neste sábado: 10h e 15h. Sei que você prefere sábado, quer que eu reserve um?", "metrica": "ocupação do sábado", "resolve": ["ocupacao"], "automatizavel": true, "categoria_contato": "marketing", "fonte": null},
{"codigo": "R8", "grupo": "retencao", "nome": "Boletim semanal de vagas", "publicos": ["B", "C", "D"], "objetivos": ["frequencia"], "momento": "1 vez por semana", "canal": "WhatsApp e story", "como_executar": "3-5 horários livres, só para quem deu permissão e não tem horário marcado.", "frase": "Agenda da semana com vaga: ter 19h, qui 11h, sáb 13h. Responde com o horário que eu anoto teu nome.", "frase_a": null, "metrica": "vagas preenchidas; descadastros", "resolve": ["ocupacao"], "automatizavel": true, "categoria_contato": "marketing", "fonte": "https://getsquire.com/business-edge/3-automated-campaigns-to-prevent-clients-from-slipping-through-the-cracks"},
{"codigo": "R9", "grupo": "retencao", "nome": "Escada de reativação em 3 degraus", "publicos": ["A", "B", "C", "D"], "objetivos": ["reativacao"], "momento": "intervalo + 7 dias; 2× o intervalo; 90 dias", "canal": "WhatsApp", "como_executar": "Degrau 1 sem oferta, degrau 2 é o lembrete de 2× o intervalo, degrau 3 aos 90 dias com benefício. Desconto só no degrau 3. Depois de 3 tentativas sem resposta, arquivar.", "frase": "Tô com saudade da freguesia! Volta até dia 30 e a sobrancelha é por minha conta.", "frase_a": "Faz um tempo que você não vem. Pra sua volta, a barboterapia é por minha conta junto com o corte.", "metrica": "% reativado por degrau", "resolve": ["sumidos"], "automatizavel": true, "categoria_contato": "reativacao", "fonte": "https://www.infinitepay.io/blog/whatsapp-mensagem-clientes-sumidos"},
{"codigo": "R10", "grupo": "retencao", "nome": "Pesquisa do motivo do sumiço", "publicos": ["A", "B", "C", "D"], "objetivos": ["reativacao"], "momento": "depois do degrau 3", "canal": "WhatsApp", "como_executar": "Uma pergunta respondida com um número. A resposta vira etiqueta no cliente e define o próximo passo (outro horário, plano mais barato ou arquivar).", "frase": "Pergunta rápida, responde só o número: 1) mudei 2) horário ruim 3) tá caro 4) não curti o corte 5) esqueci mesmo.", "frase_a": null, "metrica": "distribuição dos motivos; % recuperado por motivo", "resolve": ["sumidos"], "automatizavel": true, "categoria_contato": "reativacao", "fonte": "https://biz.booksy.com/blog/why-your-regulars-are-ghosting-you"},
{"codigo": "R11", "grupo": "retencao", "nome": "Recuperação após experiência ruim", "publicos": ["A", "B", "C", "D"], "objetivos": ["retencao"], "momento": "em até 2 h da reclamação", "canal": "áudio ou ligação", "como_executar": "Nota baixa ou reclamação vira áudio ou ligação, nunca texto frio. Ouvir sem se defender, oferecer ajuste antes de reembolso e anotar a preferência.", "frase": "Valeu por falar. Não ficou do jeito que tu queria e isso é comigo. Passa quinta que eu arrumo na faixa.", "frase_a": null, "metrica": "insatisfeitos que voltam em 60 dias", "resolve": ["satisfacao"], "automatizavel": false, "categoria_contato": "recuperacao", "fonte": "https://www.retently.com/blog/service-recovery-paradox/"},
{"codigo": "R12", "grupo": "retencao", "nome": "Aniversário em 2 tempos", "publicos": ["A", "B", "C", "D"], "objetivos": ["frequencia"], "momento": "7 dias antes e no dia", "canal": "WhatsApp", "como_executar": "7 dias antes, um mimo válido no mês (dá tempo de agendar); no dia, só parabéns, sem venda.", "frase": "Semana que vem é teu niver! Vem ficar na régua: a sobrancelha é presente meu este mês.", "frase_a": "Seu aniversário está chegando. Este mês a barboterapia é cortesia da casa no seu corte. Reservo antes da data?", "metrica": "aniversariantes que agendam no mês", "resolve": ["frequencia"], "automatizavel": true, "categoria_contato": "aniversario", "fonte": null},
{"codigo": "R13", "grupo": "retencao", "nome": "Datas do cliente e dezembro", "publicos": ["A", "B", "C", "D"], "objetivos": ["frequencia"], "momento": "3-4 semanas antes do evento; fim de novembro", "canal": "presencial e WhatsApp", "como_executar": "Perguntar na cadeira 'tem algum evento vindo?' e registrar; a IA agenda o corte de véspera. No fim de novembro, abrir a pré-reserva de dezembro para quem não marcou.", "frase": "Dezembro lota rápido. Já quer garantir teu horário pro Natal e pro Ano Novo?", "frase_a": null, "metrica": "eventos que viram agendamento; ocupação de dezembro", "resolve": ["frequencia", "ocupacao"], "automatizavel": true, "categoria_contato": "marketing", "fonte": null},
{"codigo": "R14", "grupo": "retencao", "nome": "Fidelidade com progresso visível", "publicos": ["A", "B", "C", "D"], "objetivos": ["frequencia"], "momento": "toda visita", "canal": "WhatsApp e presencial", "como_executar": "O prêmio é um extra barato com valor alto (sobrancelha, hidratação, pomada), nunca o corte grátis. No A, níveis com prioridade de agenda.", "frase": "Carimbo 8 de 10! Faltam 2 cortes pra ganhar a pomada.", "frase_a": "Você chegou ao nível Prioridade: acesso antecipado à agenda de sábado e de dezembro.", "metrica": "intervalo médio de quem participa vs quem não participa", "resolve": ["frequencia"], "automatizavel": true, "categoria_contato": "transacional", "fonte": "https://koalendar.com/pt-br/blog/marketing-para-barbearia"},
{"codigo": "R15", "grupo": "retencao", "nome": "Convite ao clube com a conta real", "publicos": ["A", "B", "C", "D"], "objetivos": ["frequencia", "retencao"], "momento": "3+ visitas em 60 dias", "canal": "presencial e WhatsApp", "como_executar": "A IA mostra quanto o cliente gastou nos últimos 2 meses e compara com o plano.", "frase": "Tu vem toda quinzena e gasta uns R$ 90. No plano de R$ 79 tu faz 2 cortes e ainda sobra. Quer?", "frase_a": "Nos últimos 2 meses você investiu R$ 360 aqui. No Premium, por R$ 290/mês, tem corte e barba e prioridade de agenda. Quer que eu ative?", "metrica": "conversão por convite; cancelamento do clube", "resolve": ["assinatura"], "automatizavel": true, "categoria_contato": "marketing", "fonte": null},
{"codigo": "R16", "grupo": "retencao", "nome": "Assinante parado", "publicos": ["A", "B", "C", "D"], "objetivos": ["retencao"], "momento": "14 dias sem usar o plano", "canal": "WhatsApp", "como_executar": "Reativar o uso antes da próxima cobrança; se continuar baixo, sugerir plano menor em vez de perder o assinante.", "frase": "Tu ainda tem 2 cortes no plano este mês, não deixa perder! Tenho quinta às 18h.", "frase_a": null, "metrica": "uso médio do plano; troca de plano em vez de cancelamento", "resolve": ["assinatura"], "automatizavel": true, "categoria_contato": "transacional", "fonte": null},
{"codigo": "R17", "grupo": "retencao", "nome": "Pezinho entre cortes", "publicos": ["C", "D"], "objetivos": ["frequencia"], "momento": "dia 12-15 após degradê", "canal": "WhatsApp", "como_executar": "Serviço de 10-15 min, barato, que encaixa em buracos da agenda e encurta o ciclo. No A, 'manutenção de contorno' dentro do pacote.", "frase": "O pezinho já tá crescendo, né? Tenho encaixe rápido quinta às 14h, 10 minutinhos.", "frase_a": null, "metrica": "visitas por cliente por ano", "resolve": ["frequencia", "ocupacao"], "automatizavel": true, "categoria_contato": "reagendamento", "fonte": "https://getsquire.com/business-edge/why-barbershop-clients-dont-come-back"},
{"codigo": "R18", "grupo": "retencao", "nome": "Recompra de produto", "publicos": ["A", "B", "C", "D"], "objetivos": ["produto"], "momento": "25-30 dias após a compra", "canal": "WhatsApp e presencial", "como_executar": "Perguntar como está o produto e oferecer separar outro para o próximo horário. Juntar com o lembrete de corte quando cair na mesma semana.", "frase": "A pomada já tá acabando? Deixo uma separada pra quando tu vier.", "frase_a": "A pomada que você levou deve estar no fim. Quer que eu separe outra pro seu horário de quinta?", "metrica": "taxa de recompra", "resolve": ["produto"], "automatizavel": true, "categoria_contato": "produto", "fonte": null},
{"codigo": "R19", "grupo": "retencao", "nome": "Permissão e preferências na 1ª visita", "publicos": ["A", "B", "C", "D"], "objetivos": ["retencao"], "momento": "primeiro agendamento", "canal": "WhatsApp", "como_executar": "Pedir permissão separada para lembretes e para novidades, sem caixa pré-marcada, e já colher apelido, aniversário e melhor horário. É a base legal das mensagens.", "frase": "Posso te avisar por aqui quando teu corte estiver vencendo e quando abrir vaga? No máximo 1 recado por semana. Responde SIM. Quiser parar, manda SAIR.", "frase_a": null, "metrica": "% de clientes com permissão; descadastros por mês", "resolve": ["consentimento"], "automatizavel": true, "categoria_contato": "transacional", "fonte": "https://www.messagecentral.com/pt-br/blog/lgpd-whatsapp-business"},
{"codigo": "P1", "grupo": "prospeccao", "nome": "Reels 'antes e depois' com palavra-chave", "publicos": ["A", "B", "C", "D"], "objetivos": ["aquisicao"], "momento": "conteúdo semanal", "canal": "Instagram", "como_executar": "Reel de 15-25 s com problema, processo e revelação, terminando com 'comenta CORTE'. A IA do Premium Plus manda 1 resposta privada por comentário, com botão para o WhatsApp. No A/B, luz quente e áudio ambiente.", "frase": "Degradê navalhado + barba desenhada. Quer esse resultado? Comenta CORTE que te mando os horários da semana.", "frase_a": null, "metrica": "comentários → conversas → agendamentos", "resolve": ["aquisicao"], "automatizavel": true, "categoria_contato": null, "fonte": "https://developers.facebook.com/docs/instagram-platform/private-replies/"},
{"codigo": "P2", "grupo": "prospeccao", "nome": "Série TikTok 'Corte para quem tem...'", "publicos": ["C", "D"], "objetivos": ["aquisicao"], "momento": "conteúdo semanal", "canal": "TikTok", "como_executar": "Um problema por vídeo (entradas, crespo que levanta, rosto redondo, barba falhada), com cliente real e hashtag do bairro. Ficar no orgânico.", "frase": "Se você tem entrada, PARA de pedir esse corte.", "frase_a": null, "metrica": "conversas com código TIKTOK", "resolve": ["aquisicao"], "automatizavel": false, "categoria_contato": null, "fonte": "https://ads.tiktok.com/business/pt-BR/guides/salon-advertising-marketing-guide"},
{"codigo": "P3", "grupo": "prospeccao", "nome": "Google Perfil da Empresa vivo", "publicos": ["A", "B", "C", "D"], "objetivos": ["aquisicao"], "momento": "semanal", "canal": "Google", "como_executar": "Perfil completo, 20+ fotos reais, serviços com preço, botão para o WhatsApp com código GOOGLE, 1 post por semana e resposta a todas as avaliações em até 48 h.", "frase": "Valeu, Rafael! Esse low fade com risca ficou top. Te espero daqui 3 semanas.", "frase_a": null, "metrica": "conversas com código GOOGLE; ligações e rotas", "resolve": ["aquisicao"], "automatizavel": false, "categoria_contato": null, "fonte": "https://metricool.com/pt/como-otimizar-perfil-da-empresa-no-google/"},
{"codigo": "P4", "grupo": "prospeccao", "nome": "Pedido de avaliação para todos", "publicos": ["A", "B", "C", "D"], "objetivos": ["aquisicao"], "momento": "2-3 h depois do corte", "canal": "WhatsApp", "como_executar": "Link direto da avaliação para todos os clientes, sem brinde em troca e sem pedir 5 estrelas (as duas coisas são proibidas pelo Google).", "frase": "Obrigado pela visita hoje! Se puder, conta como foi no Google, me ajuda muito. Qualquer ajuste no corte, me chama aqui.", "frase_a": null, "metrica": "avaliações novas ÷ atendimentos; nota média", "resolve": ["aquisicao"], "automatizavel": true, "categoria_contato": "pos_venda", "fonte": "https://support.google.com/contributionpolicy/answer/7400114?hl=pt-br"},
{"codigo": "P5", "grupo": "prospeccao", "nome": "Indicação com recompensa dupla", "publicos": ["B", "C", "D"], "objetivos": ["indicacao", "aquisicao"], "momento": "3ª visita ou nota 9-10; campanha no mês fraco", "canal": "WhatsApp e presencial", "como_executar": "Quem indica e o indicado ganham; o crédito só libera quando o indicado comparece. No A/B, o prêmio é experiência, não desconto.", "frase": "Indica um parceiro: ele ganha R$ 10 no 1º corte e tu ganha R$ 10 no próximo. Encaminha esta mensagem pra ele.", "frase_a": "Quem você indicar ganha a barboterapia na 1ª visita, e você ganha a próxima hidratação. Te mando um texto pronto pra encaminhar?", "metrica": "indicações por cliente ativo; retorno dos indicados", "resolve": ["aquisicao"], "automatizavel": true, "categoria_contato": "marketing", "fonte": "https://modernbarber.co.uk/tips-for-boosting-barbershop-referrals"},
{"codigo": "P6", "grupo": "prospeccao", "nome": "Academia com personal como embaixador", "publicos": ["B", "C", "D"], "objetivos": ["aquisicao"], "momento": "parceria contínua", "canal": "parceria", "como_executar": "Corte grátis para 2-3 professores em troca de indicação e um display com QR na recepção; Dia do Corte na academia a cada trimestre.", "frase": "Aluno da academia tem 20% no 1º corte. Aponte a câmera.", "frase_a": null, "metrica": "clientes novos por parceiro", "resolve": ["aquisicao"], "automatizavel": false, "categoria_contato": null, "fonte": "https://bibliotecas.sebrae.com.br/chronus/ARQUIVOS_CHRONUS/IDEIAS_DE_NEGOCIO/PDFS/ideia-de-negocio_mei--barbeiro.pdf"},
{"codigo": "P7", "grupo": "prospeccao", "nome": "Rede com comércio masculino", "publicos": ["A", "B"], "objetivos": ["aquisicao"], "momento": "parceria contínua", "canal": "parceria", "como_executar": "Troca de cortesias com alfaiataria, loja de roupa, ótica, estúdio de tatuagem, adega. Cartão de cortesia dentro da sacola, com código do parceiro.", "frase": null, "frase_a": "Cortesia da loja: acabamento de barba com toalha quente na sua primeira visita.", "metrica": "resgates por parceiro", "resolve": ["aquisicao"], "automatizavel": false, "categoria_contato": null, "fonte": null},
{"codigo": "P8", "grupo": "prospeccao", "nome": "Barbeiro na empresa", "publicos": ["A", "B"], "objetivos": ["aquisicao"], "momento": "1 dia por mês", "canal": "parceria", "como_executar": "Um dia por mês dentro de escritórios ou coworkings, com cadeira portátil; depois do 1º dia, o app convida quem cortou a continuar no seu espaço.", "frase": null, "frase_a": "Levo cortes pra dentro da empresa uma vez por mês: 8 a 10 colaboradores numa tarde, sem ninguém sair do escritório.", "metrica": "empresas ativas; % que vira cliente individual", "resolve": ["aquisicao"], "automatizavel": false, "categoria_contato": null, "fonte": null},
{"codigo": "P9", "grupo": "prospeccao", "nome": "Horário universitário + atlética", "publicos": ["C", "D"], "objetivos": ["aquisicao", "volume"], "momento": "horários vazios", "canal": "parceria e Instagram", "como_executar": "Preço fixo para estudante nos horários vazios e pacote do time antes de jogos e festas, divulgado pela atlética.", "frase": "Estudante com carteirinha paga R$ 30 de terça a quarta até 15h.", "frase_a": null, "metrica": "ocupação dos horários antes vazios", "resolve": ["aquisicao", "ocupacao"], "automatizavel": false, "categoria_contato": null, "fonte": null},
{"codigo": "P10", "grupo": "prospeccao", "nome": "Primeira visita com a oferta certa", "publicos": ["A", "B", "C", "D"], "objetivos": ["aquisicao"], "momento": "primeira visita", "canal": "Instagram e WhatsApp", "como_executar": "No C/D, desconto só na 1ª visita e só em dia fraco. No A/B, sem desconto: a 1ª visita é uma consulta de estilo com 10 min a mais.", "frase": "Primeiro corte comigo: R$ 30 de segunda a quarta. Fala PRIMEIRA no Whats.", "frase_a": "Na primeira visita eu reservo 1 h com você: entendo sua rotina e seu rosto e monto o corte que funciona até no dia que você não arruma o cabelo.", "metrica": "retorno em 45 dias de quem veio pela oferta", "resolve": ["aquisicao", "segunda_visita"], "automatizavel": false, "categoria_contato": null, "fonte": null},
{"codigo": "P11", "grupo": "prospeccao", "nome": "Lousa 'horário livre hoje' + QR", "publicos": ["C", "D"], "objetivos": ["aquisicao", "volume"], "momento": "diário", "canal": "presencial", "como_executar": "Placa na porta com os horários vagos do dia e QR para o WhatsApp. Quem entra e não pode esperar sai com horário marcado.", "frase": "Agora tô com cliente, mas te encaixo às 16h30. Te mando a confirmação no Whats?", "frase_a": null, "metrica": "conversas com código QR", "resolve": ["aquisicao", "ocupacao"], "automatizavel": false, "categoria_contato": null, "fonte": null},
{"codigo": "P12", "grupo": "prospeccao", "nome": "Atendimento a domicílio premium", "publicos": ["A", "B"], "objetivos": ["ticket", "aquisicao"], "momento": "janela própria na agenda", "canal": "WhatsApp e parcerias", "como_executar": "Nicho de quem não pode ou não quer sair (executivo, idoso, pai de recém-nascido), preço 1,8 a 2,5× o do balcão.", "frase": null, "frase_a": "Corte em casa, no seu horário. Levo cadeira, capa e aspirador: não fica um fio no chão.", "metrica": "atendimentos a domicílio; faturamento por hora contando o deslocamento", "resolve": ["ticket", "aquisicao"], "automatizavel": false, "categoria_contato": null, "fonte": null},
{"codigo": "P13", "grupo": "prospeccao", "nome": "Grupos do bairro sem spam", "publicos": ["C", "D"], "objetivos": ["aquisicao"], "momento": "quando alguém pede indicação", "canal": "WhatsApp e Facebook", "como_executar": "Responder pedidos de 'alguém indica barbeiro?' com foto de trabalho real, e postar só onde a regra do grupo permite.", "frase": "Sou barbeiro aqui no bairro, trabalho com degradê e barba. Deixo umas fotos dos últimos cortes. Me chama no Whats que vejo um horário pra você.", "frase_a": null, "metrica": "conversas com código GRUPO", "resolve": ["aquisicao"], "automatizavel": false, "categoria_contato": null, "fonte": "https://thecut.co/blog/how-barbers-attract-new-clients"},
{"codigo": "P14", "grupo": "prospeccao", "nome": "Story 'abriu horário hoje'", "publicos": ["A", "B", "C", "D"], "objetivos": ["volume", "aquisicao"], "momento": "quando abre vaga", "canal": "Instagram e status do WhatsApp", "como_executar": "Horário vago vira story com caixinha; quem responde abre a conversa e a IA leva ao WhatsApp.", "frase": "Abriu horário HOJE 17h. Responde EU que é seu.", "frase_a": null, "metrica": "vagas do dia preenchidas", "resolve": ["ocupacao"], "automatizavel": true, "categoria_contato": null, "fonte": "https://www.planoly.com/blog/instagram-24-hour-messaging-window-explained"},
{"codigo": "P15", "grupo": "prospeccao", "nome": "Impulsionar o Reel campeão", "publicos": ["B", "C", "D"], "objetivos": ["aquisicao"], "momento": "teste de 7 dias", "canal": "Meta Ads", "como_executar": "Só impulsionar o Reel que já foi bem no orgânico, com destino WhatsApp, raio de 3-5 km. R$ 15 a 25 por dia por 7 dias (estimativa). Pausar se o custo por cliente passar do valor de 1 corte.", "frase": "Fala! Que bom que curtiu. Prefere manhã ou tarde? Tenho quinta 10h e 15h, e sexta 18h.", "frase_a": null, "metrica": "custo por cliente novo; retorno em 45 dias", "resolve": ["aquisicao"], "automatizavel": false, "categoria_contato": null, "fonte": null},
{"codigo": "P16", "grupo": "prospeccao", "nome": "Direct só para quem levantou a mão", "publicos": ["A", "B", "C", "D"], "objetivos": ["aquisicao"], "momento": "comentário, resposta a story, menção ou DM", "canal": "Instagram", "como_executar": "A IA só inicia conversa com quem comentou, respondeu story, mencionou ou mandou mensagem. Primeiro pergunta ou ajuda, depois oferece horário. Sem resposta, não insiste.", "frase": "O corte sai R$ 45 e corte + barba R$ 70. Você usa mais curto nas laterais ou com volume? Assim te indico o horário certo.", "frase_a": null, "metrica": "tempo da 1ª resposta (meta: menos de 5 min); conversas que viram agendamento", "resolve": ["aquisicao"], "automatizavel": true, "categoria_contato": null, "fonte": "https://developers.facebook.com/docs/instagram-platform/private-replies/"}
]$estrategias$::jsonb);

