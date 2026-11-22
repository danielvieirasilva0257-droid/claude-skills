-- Conta de desenvolvedor (pedido do Daniel, 22/11/2026): o nível mais alto do
-- app, com tudo liberado ao mesmo tempo (o que o Premium Plus libera e o painel
-- do dono do plano Barbearias). Não é vendido: só o servidor coloca uma conta
-- nele (app_assinatura com provedor 'manual'). O valor 'dev' do tipo app_plano
-- vem da migration 0010 (um valor novo de enum não pode ser usado na mesma
-- transação em que foi criado).

insert into parametros values
  ('ia_chat_dia_dev', '2026-01-01', 500, 'Perguntas ao chat da IA por dia, conta de desenvolvedor')
on conflict do nothing;

-- Funções que conferem o plano pelo nome: 'dev' entra onde entram Barbearias e Premium Plus.

CREATE OR REPLACE FUNCTION public.plano_efetivo(p_barbeiro uuid)
 RETURNS app_plano
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with proprio as (
    select coalesce((select plano from app_assinatura
                      where barbeiro_id = p_barbeiro and status in ('ativa', 'teste')
                        and (renova_em is null
                             or renova_em + case when provedor = 'revenuecat' then interval '3 hours' else interval '0' end > now())),
                    'gratis'::app_plano) as p
  ),
  equipe as (
    select exists (
      select 1 from barbearia_membros m
      join barbearia_membros d on d.barbearia_id = m.barbearia_id and d.ativo and d.papel = 'dono'
      join app_assinatura s on s.barbeiro_id = d.barbeiro_id
      where m.barbeiro_id = p_barbeiro and m.ativo and m.papel = 'barbeiro'
        and s.plano in ('barbearias', 'dev') and s.status in ('ativa', 'teste')
        and (s.renova_em is null
             or s.renova_em + case when s.provedor = 'revenuecat' then interval '3 hours' else interval '0' end > now())
    ) as e
  )
  select case when equipe.e and proprio.p in ('gratis', 'pago') then 'premium'::app_plano else proprio.p end
  from proprio, equipe
$function$;

CREATE OR REPLACE FUNCTION public.criar_barbearia(p_nome text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_id uuid;
begin
  if auth.uid() is null then raise exception 'entre na sua conta'; end if;
  if plano_efetivo(auth.uid()) not in ('barbearias', 'dev') then raise exception 'disponível no plano Barbearias'; end if;
  if minha_barbearia_id() is not null then raise exception 'você já faz parte de uma barbearia'; end if;
  insert into barbearias (nome) values (btrim(p_nome)) returning id into v_id;
  insert into barbearia_membros (barbearia_id, barbeiro_id, papel) values (v_id, auth.uid(), 'dono');
  return minha_barbearia();
end $function$;

CREATE OR REPLACE FUNCTION public.exigir_dono()
 RETURNS uuid
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v uuid := minha_barbearia_id();
begin
  if v is null or not sou_dono(v) then raise exception 'só o dono da barbearia'; end if;
  if plano_efetivo(auth.uid()) not in ('barbearias', 'dev') then raise exception 'disponível no plano Barbearias'; end if;
  return v;
end $function$;

CREATE OR REPLACE FUNCTION public.rotina_diaria()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare b uuid; v_follow int := 0; v_auto int := 0;
begin
  for b in select barbeiros_por_plano(array['premium', 'plus', 'barbearias', 'dev']::app_plano[]) loop
    v_follow := v_follow + gerar_followups(b);
    v_auto := v_auto + planejar_automacoes(b);
  end loop;
  return jsonb_build_object('followups', v_follow, 'automacoes', v_auto);
end $function$;

CREATE OR REPLACE FUNCTION public.uso_mensagens_mes(p_barbeiro uuid DEFAULT auth.uid())
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if auth.uid() is not null and p_barbeiro is distinct from auth.uid() then raise exception 'sem permissão'; end if;
  return jsonb_build_object(
    'usadas', (select count(*) from contatos_enviados where barbeiro_id = p_barbeiro
                and categoria in ('marketing', 'aniversario', 'produto', 'reativacao')
                and date_trunc('month', enviado_em at time zone 'America/Sao_Paulo') = date_trunc('month', now() at time zone 'America/Sao_Paulo')),
    'limite', case plano_efetivo(p_barbeiro) when 'premium' then 100 when 'plus' then 100 when 'barbearias' then 100 when 'dev' then 100 else 0 end,
    'transacionais', (select count(*) from contatos_enviados where barbeiro_id = p_barbeiro
                and categoria not in ('marketing', 'aniversario', 'produto', 'reativacao')
                and date_trunc('month', enviado_em at time zone 'America/Sao_Paulo') = date_trunc('month', now() at time zone 'America/Sao_Paulo')));
end $function$;
