// Sends the automation queue (cron every hour). Each message is checked again
// with pode_enviar at sending time, then goes as an approved WhatsApp template
// (outside the 24 h window free text is not allowed).
import { whatsappModelo } from '../_shared/canais.ts';
import { clienteAdmin, ehServico, json } from '../_shared/http.ts';

// Template names to be approved in the barber's WhatsApp Business account.
export const MODELO_POR_CATEGORIA: Record<string, string> = {
  transacional: 'lembrete_horario', pos_venda: 'pos_venda', reagendamento: 'reagendar',
  reativacao: 'sentimos_sua_falta', aniversario: 'aniversario', marketing: 'novidade', produto: 'produto', recuperacao: 'recuperacao',
};

export async function handler(req: Request): Promise<Response> {
  if (!ehServico(req)) return json({ ok: false, erro: 'somente o servidor' }, 403);
  const admin = clienteAdmin();
  const { data: fila } = await admin.from('mensagens_fila').select('id, barbeiro_id, cliente_id, categoria, texto')
    .eq('status', 'pendente').lte('agendado_para', new Date().toISOString()).limit(200);
  let enviadas = 0;
  let bloqueadas = 0;
  for (const m of fila ?? []) {
    const { data: pode } = await admin.rpc('pode_enviar', { p_cliente: m.cliente_id, p_categoria: m.categoria });
    const decisao = (pode as { pode: boolean; motivo: string }[])?.[0];
    if (!decisao?.pode) {
      await admin.from('mensagens_fila').update({ status: 'bloqueada', motivo: decisao?.motivo ?? 'bloqueada' }).eq('id', m.id);
      bloqueadas++;
      continue;
    }
    const [{ data: canal }, { data: cliente }] = await Promise.all([
      admin.from('canais').select('conta_externa').eq('barbeiro_id', m.barbeiro_id).eq('tipo', 'whatsapp').maybeSingle(),
      admin.from('clientes').select('telefone').eq('id', m.cliente_id).single(),
    ]);
    if (!canal || !cliente?.telefone) {
      await admin.rpc('registrar_envio', { p_fila: m.id, p_ok: false, p_motivo: !canal ? 'WhatsApp não conectado' : 'cliente sem telefone' });
      continue;
    }
    const envio = await whatsappModelo(admin, m.barbeiro_id, canal.conta_externa, cliente.telefone.replace(/\D/g, ''),
      MODELO_POR_CATEGORIA[m.categoria] ?? 'novidade', [m.texto]);
    await admin.rpc('registrar_envio', { p_fila: m.id, p_ok: envio.status !== 'erro', p_motivo: envio.erro ?? null });
    if (envio.status !== 'erro') enviadas++;
  }
  return json({ ok: true, enviadas, bloqueadas });
}
