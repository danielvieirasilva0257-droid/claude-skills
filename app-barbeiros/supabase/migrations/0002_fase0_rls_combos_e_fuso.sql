-- =====================================================================
-- 0002 · Ajustes encontrados na Fase 0 (19/11/2026)
-- A 0001 fica como está; mudanças no banco entram sempre em migration nova.
-- =====================================================================

-- 1) combos_padrao era a única tabela sem RLS. No Supabase, isso deixava
--    qualquer pessoa com a chave pública (anon) inserir, mudar ou apagar os
--    combos padrão. Agora: leitura para todos, escrita só por migration.
alter table combos_padrao enable row level security;
create policy leitura_combos_padrao on combos_padrao for select using (true);

-- 2) Fuso do banco. As views agrupam por date_trunc('month', inicio) e usam
--    current_date; em UTC (padrão do Supabase), um corte às 22h do dia 31 em
--    São Paulo cairia no mês seguinte e "hoje" viraria às 21h. O app é
--    brasileiro: o banco passa a pensar no horário de Brasília.
--    (A janela de mensagens continua usando barbeiros.fuso, por barbeiro.)
--    Vale para as conexões novas; no Supabase hospedado é o comando indicado
--    na documentação ("alter database postgres set timezone").
do $$
begin
  execute format('alter database %I set timezone to %L', current_database(), 'America/Sao_Paulo');
end $$;
