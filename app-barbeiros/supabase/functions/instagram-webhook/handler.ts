// Instagram webhook: comments (private reply once, within 7 days) and direct
// messages (24 h window). Only people who raised their hand; likes never.
import { codigoNoTexto } from '../_shared/atendente.ts';
import { assinaturaValida, instagramMensagem, verificarWebhook } from '../_shared/canais.ts';
import { receber } from '../_shared/conversa.ts';
import { clienteAdmin, json } from '../_shared/http.ts';
import { gerarJSON } from '../_shared/llm.ts';
import { BASE } from '../_shared/prompts.ts';
import { z } from '../_shared/deps.ts';

type Comentario = { id: string; text?: string; from?: { id: string; username?: string }; media?: { id: string } };
type Direct = { sender: { id: string }; recipient: { id: string }; message?: { mid: string; text?: string; is_echo?: boolean } };

const RespostaComentario = z.object({ resposta: z.string().trim().min(1).max(400) });
const PROMPT = `${BASE}
Alguém comentou num post do barbeiro. Escreva UMA resposta privada (direct) curta e simpática, convidando para marcar um horário,
sem pressão e sem desconto. Siga a personalidade recebida. Responda apenas no formato JSON combinado.`;

export async function handler(req: Request): Promise<Response> {
  const verificacao = verificarWebhook(req, 'INSTAGRAM_VERIFY_TOKEN');
  if (verificacao) return verificacao;
  const corpo = await req.text();
  if (!(await assinaturaValida(req, corpo, 'INSTAGRAM_APP_SECRET'))) return new Response('assinatura inválida', { status: 401 });
  const dados = JSON.parse(corpo || '{}') as { entry?: { id: string; changes?: { field: string; value: Comentario }[]; messaging?: Direct[] }[] };
  const admin = clienteAdmin();
  const resultados: unknown[] = [];

  for (const entrada of dados.entry ?? []) {
    const { data: canal } = await admin.from('canais').select('barbeiro_id').eq('tipo', 'instagram').eq('conta_externa', entrada.id).maybeSingle();
    if (!canal) continue;
    const barbeiro = canal.barbeiro_id as string;
    const { data: plano } = await admin.rpc('plano_efetivo', { p_barbeiro: barbeiro });
    const plus = plano === 'plus';

    for (const mudanca of entrada.changes ?? []) {
      if (mudanca.field !== 'comments' || !mudanca.value.from) continue;
      const c = mudanca.value;
      const autor = mudanca.value.from;
      const { data: ja } = await admin.from('instagram_eventos').select('id').eq('barbeiro_id', barbeiro).eq('comentario_id', c.id).maybeSingle();
      if (ja) { resultados.push({ comentario: c.id, repetido: true }); continue; }
      const codigo = await codigoNoTexto(admin, barbeiro, c.text ?? '');
      const { data: evento } = await admin.from('instagram_eventos').insert({
        barbeiro_id: barbeiro, tipo: 'comentario', autor_externo: autor.id, autor_nome: autor.username ?? null,
        texto: c.text ?? null, comentario_id: c.id, midia_id: c.media?.id ?? null, codigo_detectado: codigo,
      }).select('id').single();
      if (!evento || !plus) { resultados.push({ comentario: c.id, respondeu: false }); continue; }
      const { data: pode } = await admin.rpc('pode_responder_instagram', { p_evento: evento.id });
      if (!(pode as { pode: boolean }[])?.[0]?.pode) { resultados.push({ comentario: c.id, respondeu: false }); continue; }
      const { data: b } = await admin.from('barbeiros').select('ia_personalidade, publico').eq('id', barbeiro).single();
      const saida = await gerarJSON(RespostaComentario, PROMPT, { comentario: c.text, personalidade: b?.ia_personalidade, publico: b?.publico },
        { mock: () => ({ resposta: 'Oi! Vi seu comentário. Quer marcar um horário? Me diz o melhor dia que eu vejo aqui.' }) });
      if (!saida) continue;
      const envio = await instagramMensagem(admin, barbeiro, entrada.id, { comment_id: c.id }, saida.resposta);
      if (envio.status !== 'erro') await admin.from('instagram_eventos').update({ resposta_privada_em: new Date().toISOString() }).eq('id', evento.id);
      resultados.push({ comentario: c.id, respondeu: envio.status !== 'erro' });
    }

    for (const d of entrada.messaging ?? []) {
      if (!d.message?.text || d.message.is_echo) continue;
      const r = await receber(admin, {
        barbeiro, canal: 'instagram', contato: d.sender.id, nome: null, texto: d.message.text, idExterno: d.message.mid,
        enviar: (texto) => instagramMensagem(admin, barbeiro, entrada.id, { id: d.sender.id }, texto),
      });
      await admin.from('instagram_eventos').insert({ barbeiro_id: barbeiro, tipo: 'direct', autor_externo: d.sender.id,
        texto: d.message.text, conversa_id: (r as { conversa?: string }).conversa ?? null,
        codigo_detectado: await codigoNoTexto(admin, barbeiro, d.message.text) });
      resultados.push(r);
    }
  }
  return json({ ok: true, resultados });
}
