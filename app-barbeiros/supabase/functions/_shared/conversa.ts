// An incoming message from a client (WhatsApp DM or Instagram DM): record it,
// open the 24 h window, link or create the client, and let the AI answer
// unless the barber took over the conversation or the plan has no channels.
import { atender, codigoNoTexto } from './atendente.ts';
import type { SupabaseClient } from './deps.ts';

const PLANOS_COM_CANAIS = ['premium', 'plus', 'barbearias'];

type Entrada = {
  barbeiro: string;
  canal: 'whatsapp' | 'instagram';
  contato: string;
  nome: string | null;
  texto: string;
  idExterno?: string;
  enviar: (texto: string) => Promise<{ status: 'ok' | 'simulado' | 'erro' }>;
};

export async function receber(admin: SupabaseClient, e: Entrada) {
  const agora = new Date();
  const codigo = await codigoNoTexto(admin, e.barbeiro, e.texto);

  // client: by phone (WhatsApp) or create one (name only, origin from the channel)
  let { data: conversa } = await admin.from('conversas').select('*')
    .eq('barbeiro_id', e.barbeiro).eq('canal', e.canal).eq('contato_externo', e.contato).maybeSingle();
  let clienteId: string | null = conversa?.cliente_id ?? null;
  if (!clienteId && e.canal === 'whatsapp') {
    const { data: lista } = await admin.from('clientes').select('id, telefone').eq('barbeiro_id', e.barbeiro);
    clienteId = (lista ?? []).find((c: { telefone: string | null }) =>
      c.telefone && e.contato.endsWith(c.telefone.replace(/\D/g, '').slice(-9)))?.id ?? null;
  }
  if (!clienteId) {
    const { data: novo } = await admin.from('clientes').insert({
      barbeiro_id: e.barbeiro, nome: e.nome ?? 'Cliente novo', telefone: e.canal === 'whatsapp' ? e.contato : null,
      origem: e.canal, origem_codigo: codigo, status: 'prospect',
    }).select('id').single();
    clienteId = novo?.id ?? null;
  }

  const janela = new Date(agora.getTime() + 24 * 3600_000).toISOString();
  if (!conversa) {
    const { data } = await admin.from('conversas').insert({
      barbeiro_id: e.barbeiro, canal: e.canal, contato_externo: e.contato, nome_contato: e.nome, cliente_id: clienteId,
      origem_codigo: codigo, janela_ate: janela, ultima_mensagem_em: agora.toISOString(), nao_lidas: 1,
    }).select('*').single();
    conversa = data;
  } else {
    await admin.from('conversas').update({
      janela_ate: janela, ultima_mensagem_em: agora.toISOString(), nao_lidas: (conversa.nao_lidas ?? 0) + 1,
      cliente_id: clienteId, origem_codigo: conversa.origem_codigo ?? codigo,
    }).eq('id', conversa.id);
  }
  if (!conversa) return { ok: false };
  await admin.from('mensagens').insert({ conversa_id: conversa.id, barbeiro_id: e.barbeiro, direcao: 'entrada', autor: 'cliente',
    texto: e.texto.slice(0, 4000), id_externo: e.idExterno ?? null });

  // AI only when allowed: plan with channels, channel with AI on, conversation not taken over.
  const [{ data: plano }, { data: canal }] = await Promise.all([
    admin.rpc('plano_efetivo', { p_barbeiro: e.barbeiro }),
    admin.from('canais').select('ia_ativa').eq('barbeiro_id', e.barbeiro).eq('tipo', e.canal).maybeSingle(),
  ]);
  // plano_efetivo already accounts for status, renewal and team membership (0006).
  const permitido = typeof plano === 'string' && PLANOS_COM_CANAIS.includes(plano) && (e.canal === 'whatsapp' || plano === 'plus');
  if (!permitido || !canal?.ia_ativa || !conversa.ia_ativa) return { ok: true, conversa: conversa.id, respondeu: false };

  const { data: historico } = await admin.from('mensagens').select('autor, texto').eq('conversa_id', conversa.id)
    .order('criado_em', { ascending: false }).limit(10);
  const decisao = await atender(admin, e.barbeiro, clienteId, ((historico ?? []) as { autor: string; texto: string }[]).reverse());
  if (!decisao) return { ok: true, conversa: conversa.id, respondeu: false };

  const envio = await e.enviar(decisao.texto);
  await admin.from('mensagens').insert({ conversa_id: conversa.id, barbeiro_id: e.barbeiro, direcao: 'saida', autor: 'ia',
    texto: decisao.texto, status_envio: envio.status });
  if (decisao.chamarBarbeiro) await admin.from('conversas').update({ ia_ativa: false }).eq('id', conversa.id);
  return { ok: true, conversa: conversa.id, respondeu: true, agendado: decisao.agendado };
}
