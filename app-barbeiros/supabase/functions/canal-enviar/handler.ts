// The barber answers a conversation himself ("assumir conversa"). Free text
// only inside the 24 h window; outside it WhatsApp requires an approved template.
import { instagramMensagem, whatsappTexto } from '../_shared/canais.ts';
import { clienteAdmin, clienteDoUsuario, cors, json, usuarioId } from '../_shared/http.ts';

export async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const id = await usuarioId(req);
  if (!id) return json({ ok: false, erro: 'login' }, 401);
  const { conversa_id, texto } = (await req.json().catch(() => ({}))) as { conversa_id?: string; texto?: string };
  if (!conversa_id || !texto?.trim()) return json({ ok: false, erro: 'texto' }, 400);

  const db = clienteDoUsuario(req);
  const { data: conversa } = await db.from('conversas').select('*').eq('id', conversa_id).maybeSingle(); // RLS: só as dele
  if (!conversa) return json({ ok: false, erro: 'conversa' }, 404);
  if (!conversa.janela_ate || Date.parse(conversa.janela_ate) < Date.now()) return json({ ok: false, erro: 'fora_da_janela' }, 409);

  const admin = clienteAdmin();
  const { data: canal } = await admin.from('canais').select('conta_externa').eq('barbeiro_id', id).eq('tipo', conversa.canal).single();
  const envio = conversa.canal === 'whatsapp'
    ? await whatsappTexto(admin, id, canal!.conta_externa, conversa.contato_externo, texto.trim())
    : await instagramMensagem(admin, id, canal!.conta_externa, { id: conversa.contato_externo }, texto.trim());
  await db.from('conversas').update({ ia_ativa: false, nao_lidas: 0 }).eq('id', conversa_id);
  await db.from('mensagens').insert({ conversa_id, barbeiro_id: id, direcao: 'saida', autor: 'barbeiro', texto: texto.trim(), status_envio: envio.status });
  return envio.status === 'erro' ? json({ ok: false, erro: 'envio' }, 502) : json({ ok: true, status: envio.status });
}
