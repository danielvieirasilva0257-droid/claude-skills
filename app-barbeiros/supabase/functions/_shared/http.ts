// CORS, JSON replies, Supabase clients and the signed-in user.
import { createClient, type SupabaseClient } from './deps.ts';

export const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export function json(corpo: unknown, status = 200): Response {
  return new Response(JSON.stringify(corpo), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
}

const env = (k: string) => {
  const v = Deno.env.get(k);
  if (!v) throw new Error(`falta a variável ${k}`);
  return v;
};

/** Service-role client: only for reading another barber's numbers in the cron and for writing insights. */
export function clienteAdmin(): SupabaseClient {
  return createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false } });
}

/** Client acting as the caller (RLS applies). */
export function clienteDoUsuario(req: Request): SupabaseClient {
  return createClient(env('SUPABASE_URL'), env('SUPABASE_ANON_KEY'), {
    auth: { persistSession: false },
    global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
  });
}

export async function usuarioId(req: Request): Promise<string | null> {
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const { data } = await clienteAdmin().auth.getUser(token);
  return data.user?.id ?? null;
}

export function ehServico(req: Request): boolean {
  const chave = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  return Boolean(chave) && req.headers.get('Authorization') === `Bearer ${chave}`;
}

/** Spends one AI use of the barber's daily allowance; null when allowed, else the reason. */
export async function consumir(admin: SupabaseClient, barbeiro: string, tipo: string): Promise<string | null> {
  const { data, error } = await admin.rpc('consumir_ia', { p_barbeiro: barbeiro, p_tipo: tipo });
  if (error) return 'erro';
  return (data as { ok: boolean; motivo?: string }).ok ? null : ((data as { motivo?: string }).motivo ?? 'limite');
}
