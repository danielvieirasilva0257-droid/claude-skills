// RevenueCat webhook → app_assinatura. RevenueCat sends the Authorization
// header value configured in its dashboard; we compare it with the secret
// REVENUECAT_WEBHOOK_AUTH (never accepted when the secret is missing).
// The database applies the event (aplicar_evento_assinatura) and ignores
// repeats, so RevenueCat retries are safe. Any 5xx makes RevenueCat retry.
import { clienteAdmin, json } from '../_shared/http.ts';

function mesmoTexto(a: string, b: string): boolean {
  const ea = new TextEncoder().encode(a);
  const eb = new TextEncoder().encode(b);
  let dif = ea.length ^ eb.length;
  for (let i = 0; i < Math.max(ea.length, eb.length); i++) dif |= (ea[i] ?? 0) ^ (eb[i] ?? 0);
  return dif === 0;
}

export async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ ok: false }, 405);
  const segredo = Deno.env.get('REVENUECAT_WEBHOOK_AUTH');
  if (!segredo || !mesmoTexto(req.headers.get('Authorization') ?? '', segredo)) return json({ ok: false, erro: 'nao_autorizado' }, 401);

  const corpo = await req.json().catch(() => null) as { event?: { id?: string; type?: string } } | null;
  const evento = corpo?.event;
  if (!evento?.id || !evento.type) return json({ ok: false, erro: 'evento' }, 400);

  const { data, error } = await clienteAdmin().rpc('aplicar_evento_assinatura', { p_evento: evento });
  if (error) {
    console.error('assinatura-webhook', evento.type, error.message);
    return json({ ok: false, erro: 'banco' }, 500);
  }
  return json(data);
}
