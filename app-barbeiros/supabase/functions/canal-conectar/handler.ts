// Connects the barber's WhatsApp number or Instagram account. The token is
// stored server-side only (canais_segredos). In production the token comes
// from Meta's Embedded Signup; here it can also be pasted (or omitted in the
// simulated mode).
import { simulado } from '../_shared/canais.ts';
import { clienteAdmin, clienteDoUsuario, cors, json, usuarioId } from '../_shared/http.ts';

export async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const id = await usuarioId(req);
  if (!id) return json({ ok: false, erro: 'login' }, 401);
  const { tipo, conta_externa, nome_exibicao, token, desconectar } = (await req.json().catch(() => ({}))) as
    { tipo?: 'whatsapp' | 'instagram'; conta_externa?: string; nome_exibicao?: string; token?: string; desconectar?: boolean };
  if (tipo !== 'whatsapp' && tipo !== 'instagram') return json({ ok: false, erro: 'tipo' }, 400);
  const admin = clienteAdmin();
  const db = clienteDoUsuario(req);
  if (desconectar) {
    await db.from('canais').delete().eq('barbeiro_id', id).eq('tipo', tipo);
    await admin.from('canais_segredos').delete().eq('barbeiro_id', id).eq('tipo', tipo);
    return json({ ok: true });
  }
  if (!conta_externa?.trim()) return json({ ok: false, erro: 'conta' }, 400);
  if (!token && !simulado()) return json({ ok: false, erro: 'token' }, 400);
  const { error } = await db.from('canais').upsert({ barbeiro_id: id, tipo, conta_externa: conta_externa.trim(),
    nome_exibicao: nome_exibicao ?? null, status: 'conectado' }, { onConflict: 'barbeiro_id,tipo' });
  if (error) return json({ ok: false, erro: /duplicate|unique/.test(error.message) ? 'conta_em_uso' : 'gravar' }, 409);
  if (token) await admin.from('canais_segredos').upsert({ barbeiro_id: id, tipo, token }, { onConflict: 'barbeiro_id,tipo' });
  return json({ ok: true });
}
