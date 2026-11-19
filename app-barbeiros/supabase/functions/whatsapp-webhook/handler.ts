// WhatsApp Cloud API webhook (one URL for every barber; the phone_number_id
// tells whose number it is). GET = verification; POST = messages.
import { assinaturaValida, verificarWebhook, whatsappTexto } from '../_shared/canais.ts';
import { receber } from '../_shared/conversa.ts';
import { clienteAdmin, json } from '../_shared/http.ts';

type Valor = {
  metadata?: { phone_number_id?: string };
  contacts?: { wa_id: string; profile?: { name?: string } }[];
  messages?: { from: string; id: string; type: string; text?: { body?: string } }[];
};

export async function handler(req: Request): Promise<Response> {
  const verificacao = verificarWebhook(req, 'WHATSAPP_VERIFY_TOKEN');
  if (verificacao) return verificacao;
  const corpo = await req.text();
  if (!(await assinaturaValida(req, corpo, 'WHATSAPP_APP_SECRET'))) return new Response('assinatura inválida', { status: 401 });
  const dados = JSON.parse(corpo || '{}') as { entry?: { changes?: { value?: Valor }[] }[] };
  const admin = clienteAdmin();
  const resultados = [];
  for (const entrada of dados.entry ?? []) {
    for (const mudanca of entrada.changes ?? []) {
      const v = mudanca.value ?? {};
      const conta = v.metadata?.phone_number_id;
      if (!conta) continue;
      const { data: canal } = await admin.from('canais').select('barbeiro_id').eq('tipo', 'whatsapp').eq('conta_externa', conta).maybeSingle();
      if (!canal) continue;
      for (const m of v.messages ?? []) {
        if (m.type !== 'text' || !m.text?.body) continue; // audio, image… stay for the barber
        const nome = v.contacts?.find((c) => c.wa_id === m.from)?.profile?.name ?? null;
        resultados.push(await receber(admin, {
          barbeiro: canal.barbeiro_id, canal: 'whatsapp', contato: m.from, nome, texto: m.text.body, idExterno: m.id,
          enviar: (texto) => whatsappTexto(admin, canal.barbeiro_id, conta, m.from, texto),
        }));
      }
    }
  }
  // Meta needs a fast 200; errors are logged, not retried forever.
  return json({ ok: true, resultados });
}
