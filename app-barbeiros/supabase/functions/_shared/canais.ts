// Sending through Meta's official APIs (WhatsApp Cloud API and Instagram
// Messaging). CANAIS_MODO=simulado (default) never calls Meta: it only
// records the message as "simulado" (development and tests).
import type { SupabaseClient } from './deps.ts';

const versao = () => Deno.env.get('GRAPH_VERSION') ?? 'v23.0';
export const simulado = () => (Deno.env.get('CANAIS_MODO') ?? 'simulado') === 'simulado';

type Resultado = { status: 'ok' | 'simulado' | 'erro'; id?: string; erro?: string };

async function token(admin: SupabaseClient, barbeiro: string, tipo: 'whatsapp' | 'instagram') {
  const { data } = await admin.from('canais_segredos').select('token').eq('barbeiro_id', barbeiro).eq('tipo', tipo).maybeSingle();
  return (data?.token as string | undefined) ?? Deno.env.get(tipo === 'whatsapp' ? 'WHATSAPP_TOKEN' : 'INSTAGRAM_TOKEN') ?? null;
}

async function postar(url: string, chave: string, corpo: unknown): Promise<Resultado> {
  const r = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${chave}`, 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) });
  const dados = await r.json().catch(() => ({}));
  if (!r.ok) return { status: 'erro', erro: JSON.stringify(dados).slice(0, 300) };
  return { status: 'ok', id: dados.messages?.[0]?.id ?? dados.message_id };
}

/** Free text inside the 24 h window. */
export async function whatsappTexto(admin: SupabaseClient, barbeiro: string, contaExterna: string, para: string, texto: string): Promise<Resultado> {
  if (simulado()) return { status: 'simulado' };
  const chave = await token(admin, barbeiro, 'whatsapp');
  if (!chave) return { status: 'erro', erro: 'sem token do WhatsApp' };
  return postar(`https://graph.facebook.com/${versao()}/${contaExterna}/messages`, chave,
    { messaging_product: 'whatsapp', to: para, type: 'text', text: { body: texto } });
}

/** Approved template (outside the 24 h window: automations). */
export async function whatsappModelo(admin: SupabaseClient, barbeiro: string, contaExterna: string, para: string,
  modelo: string, parametros: string[]): Promise<Resultado> {
  if (simulado()) return { status: 'simulado' };
  const chave = await token(admin, barbeiro, 'whatsapp');
  if (!chave) return { status: 'erro', erro: 'sem token do WhatsApp' };
  return postar(`https://graph.facebook.com/${versao()}/${contaExterna}/messages`, chave, {
    messaging_product: 'whatsapp', to: para, type: 'template',
    template: { name: modelo, language: { code: 'pt_BR' }, components: [{ type: 'body', parameters: parametros.map((text) => ({ type: 'text', text })) }] },
  });
}

/** Instagram: private reply to a comment ({comment_id}) or DM inside 24 h ({id}). */
export async function instagramMensagem(admin: SupabaseClient, barbeiro: string, contaExterna: string,
  destino: { comment_id: string } | { id: string }, texto: string): Promise<Resultado> {
  if (simulado()) return { status: 'simulado' };
  const chave = await token(admin, barbeiro, 'instagram');
  if (!chave) return { status: 'erro', erro: 'sem token do Instagram' };
  return postar(`https://graph.facebook.com/${versao()}/${contaExterna}/messages`, chave, { recipient: destino, message: { text: texto } });
}

/** X-Hub-Signature-256 check (only when the app secret is configured). */
export async function assinaturaValida(req: Request, corpo: string, segredoEnv: string): Promise<boolean> {
  const segredo = Deno.env.get(segredoEnv);
  if (!segredo) return simulado(); // without secret only the simulated mode accepts webhooks
  const recebida = req.headers.get('X-Hub-Signature-256') ?? '';
  const chave = await crypto.subtle.importKey('raw', new TextEncoder().encode(segredo), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const assinatura = new Uint8Array(await crypto.subtle.sign('HMAC', chave, new TextEncoder().encode(corpo)));
  const esperada = 'sha256=' + Array.from(assinatura, (b) => b.toString(16).padStart(2, '0')).join('');
  // constant-time comparison
  if (recebida.length !== esperada.length) return false;
  let diferenca = 0;
  for (let i = 0; i < esperada.length; i++) diferenca |= recebida.charCodeAt(i) ^ esperada.charCodeAt(i);
  return diferenca === 0;
}

/** Webhook verification (GET hub.challenge). */
export function verificarWebhook(req: Request, tokenEnv: string): Response | null {
  const url = new URL(req.url);
  if (req.method !== 'GET') return null;
  const ok = url.searchParams.get('hub.mode') === 'subscribe' &&
    url.searchParams.get('hub.verify_token') === (Deno.env.get(tokenEnv) ?? 'teste-local');
  return new Response(ok ? url.searchParams.get('hub.challenge') ?? '' : 'token inválido', { status: ok ? 200 : 403 });
}
