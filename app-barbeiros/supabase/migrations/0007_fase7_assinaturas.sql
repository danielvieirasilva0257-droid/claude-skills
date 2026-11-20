-- =====================================================================
-- Fase 7 — Assinaturas pela loja (App Store e Google Play, via RevenueCat)
--
-- O app nunca decide o plano. A loja cobra, o RevenueCat avisa a função
-- assinatura-webhook e ela chama aplicar_evento_assinatura() com a chave de
-- servidor. Cada evento é guardado uma vez só (o RevenueCat reenvia).
--
--   app_user_id do RevenueCat = id do barbeiro (o app faz logIn com ele)
--   entitlements com o nome do plano: pago, premium, plus, barbearias
--
-- Cancelar desliga a renovação: o plano vale até o fim do período pago e
-- depois volta para o Grátis (evento EXPIRATION). Os dados ficam.
-- =====================================================================

alter table app_assinatura
  add column loja text check (loja in ('app_store', 'play_store', 'stripe', 'manual')),
  add column teste_ate timestamptz,                 -- fim do teste grátis (quando há)
  add column problema_cobranca boolean not null default false;

create table assinatura_eventos (
  id          text primary key,                     -- id do evento no RevenueCat (idempotência)
  barbeiro_id uuid references barbeiros(id) on delete set null,
  tipo        text not null,
  recebido_em timestamptz not null default now(),
  payload     jsonb not null
);
alter table assinatura_eventos enable row level security;  -- sem política: só o servidor lê e escreve

-- Plano em vigor (redefinido): a loja pode avisar a renovação alguns minutos
-- depois do vencimento; 3 horas de tolerância para quem assina pela loja.
create or replace function plano_efetivo(p_barbeiro uuid) returns app_plano
language sql stable security definer set search_path = public as $$
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
        and s.plano = 'barbearias' and s.status in ('ativa', 'teste')
        and (s.renova_em is null
             or s.renova_em + case when s.provedor = 'revenuecat' then interval '3 hours' else interval '0' end > now())
    ) as e
  )
  select case when equipe.e and proprio.p in ('gratis', 'pago') then 'premium'::app_plano else proprio.p end
  from proprio, equipe
$$;
revoke execute on function plano_efetivo(uuid) from public, anon, authenticated;
grant execute on function plano_efetivo(uuid) to service_role;

-- Aplica um evento do webhook do RevenueCat ao plano do barbeiro.
create or replace function aplicar_evento_assinatura(p_evento jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_id text := p_evento->>'id';
  v_tipo text := p_evento->>'type';
  v_uid uuid;
  v_plano app_plano;
  v_exp timestamptz;
  v_teste boolean := coalesce(p_evento->>'period_type', '') = 'TRIAL';
  v_produto text := lower(coalesce(p_evento->>'product_id', ''));
  v_periodo text;
  v_loja text;
begin
  if v_id is null or v_tipo is null then raise exception 'evento sem id ou tipo'; end if;
  -- Só ids de barbeiro (ids anônimos do RevenueCat, antes do logIn, ficam de fora).
  begin
    v_uid := (p_evento->>'app_user_id')::uuid;
  exception when invalid_text_representation then
    v_uid := null;
  end;
  if v_uid is null or not exists (select 1 from barbeiros where id = v_uid) then
    return jsonb_build_object('ok', true, 'ignorado', 'usuario');
  end if;

  insert into assinatura_eventos (id, barbeiro_id, tipo, payload) values (v_id, v_uid, v_tipo, p_evento)
  on conflict (id) do nothing;
  if not found then return jsonb_build_object('ok', true, 'repetido', true); end if;

  -- Plano: o maior direito (entitlement) que veio no evento.
  select t.e into v_plano
    from unnest(array['barbearias', 'plus', 'premium', 'pago']::app_plano[]) with ordinality as t(e, ord)
   where t.e::text in (select jsonb_array_elements_text(coalesce(p_evento->'entitlement_ids', '[]'::jsonb)))
   order by t.ord limit 1;
  if p_evento ? 'expiration_at_ms' and p_evento->>'expiration_at_ms' is not null then
    v_exp := to_timestamp((p_evento->>'expiration_at_ms')::bigint / 1000.0);
  end if;
  v_periodo := case when v_produto ~ '(anual|annual|year|p1y)' then 'anual' else 'mensal' end;
  v_loja := case p_evento->>'store' when 'APP_STORE' then 'app_store' when 'PLAY_STORE' then 'play_store'
              when 'STRIPE' then 'stripe' when 'RC_BILLING' then 'stripe' else null end;

  if v_tipo in ('INITIAL_PURCHASE', 'RENEWAL', 'UNCANCELLATION', 'SUBSCRIPTION_EXTENDED', 'TEMPORARY_ENTITLEMENT_GRANT') then
    update app_assinatura set
      plano = coalesce(v_plano, plano),
      status = (case when v_teste then 'teste' else 'ativa' end)::app_status_assinatura,
      periodo = v_periodo, renova_em = coalesce(v_exp, renova_em), cancela_no_fim = false,
      provedor = 'revenuecat', loja = coalesce(v_loja, loja),
      id_externo = coalesce(p_evento->>'original_transaction_id', id_externo),
      teste_ate = case when v_teste then v_exp end,
      problema_cobranca = false, atualizado_em = now()
    where barbeiro_id = v_uid;
  elsif v_tipo = 'CANCELLATION' then
    -- Renovação desligada (ou reembolso; nesse caso o EXPIRATION vem logo depois).
    update app_assinatura set cancela_no_fim = true, atualizado_em = now() where barbeiro_id = v_uid;
  elsif v_tipo = 'BILLING_ISSUE' then
    update app_assinatura set problema_cobranca = true, atualizado_em = now() where barbeiro_id = v_uid;
  elsif v_tipo = 'EXPIRATION' then
    update app_assinatura set plano = 'gratis', status = 'expirada', renova_em = null, cancela_no_fim = false,
           teste_ate = null, problema_cobranca = false, atualizado_em = now()
     where barbeiro_id = v_uid;
  end if;
  -- PRODUCT_CHANGE, TRANSFER, TEST e outros: só ficam no registro (a troca vale no RENEWAL seguinte).

  return jsonb_build_object('ok', true, 'tipo', v_tipo, 'plano', (select plano from app_assinatura where barbeiro_id = v_uid));
end $$;
revoke execute on function aplicar_evento_assinatura(jsonb) from public, anon, authenticated;
grant execute on function aplicar_evento_assinatura(jsonb) to service_role;

-- O que as telas Planos e "Cancelar plano" mostram.
create or replace function minha_assinatura() returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'plano', s.plano,
    'plano_efetivo', plano_efetivo(auth.uid()),
    'status', s.status,
    'periodo', s.periodo,
    'renova_em', s.renova_em,
    'cancela_no_fim', s.cancela_no_fim,
    'provedor', s.provedor,
    'loja', s.loja,
    'teste_ate', s.teste_ate,
    'problema_cobranca', s.problema_cobranca,
    -- Premium que vem da equipe do plano Barbearias (não há cobrança dele).
    'pela_equipe', plano_efetivo(auth.uid()) = 'premium'
                   and not (s.plano = 'premium' and s.status in ('ativa', 'teste') and (s.renova_em is null or s.renova_em > now())))
  from app_assinatura s where s.barbeiro_id = auth.uid()
$$;
revoke execute on function minha_assinatura() from public, anon;
