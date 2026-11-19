// The AI attendant for WhatsApp and Instagram: answers in the barber's tone,
// offers only free times from the database (horarios_livres) and schedules
// only when the client confirms one of them. Phone numbers never go to the LLM.
import type { SupabaseClient } from './deps.ts';
import { z } from './deps.ts';
import { gerarJSON } from './llm.ts';
import { BASE } from './prompts.ts';

export const RespostaCanal = z.object({
  resposta: z.string().trim().min(1).max(600),
  acao: z.enum(['nenhuma', 'agendar', 'chamar_barbeiro']),
  horario: z.string().nullable(),
  servicos: z.array(z.string()).max(3),
});

const PROMPT = `${BASE}

Você atende os clientes do barbeiro no WhatsApp e no Instagram, em nome dele, em mensagens curtas (até 3 frases).
Siga a personalidade recebida (tom, emojis, assinatura, palavras a evitar).
Só ofereça horários da lista "horarios_livres" e só preços da lista "servicos". Nunca invente.
Para marcar: o cliente precisa confirmar UM horário da lista. Aí use acao "agendar", "horario" igual ao valor "inicio" da lista e "servicos" com os nomes exatos.
Se ele pedir algo que você não sabe resolver (reclamação, desconto, assunto pessoal), use acao "chamar_barbeiro" e diga que o barbeiro já responde.
Responda apenas no formato JSON combinado.`;

type Msg = { autor: string; texto: string };
type Slot = { inicio: string; rotulo: string };

function rotulo(iso: string) {
  const d = new Date(iso);
  const dia = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', weekday: 'long', day: 'numeric' }).format(d);
  const hora = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' }).format(d);
  return `${dia.replace('-feira', '')} às ${hora}`;
}

export async function horarios(admin: SupabaseClient, barbeiro: string, duracao: number): Promise<Slot[]> {
  const hoje = new Date(Date.now() - 3 * 3600_000);
  const lista: Slot[] = [];
  for (let i = 0; i < 4 && lista.length < 6; i++) {
    const dia = new Date(hoje.getTime() + i * 86400_000).toISOString().slice(0, 10);
    const { data } = await admin.rpc('horarios_livres', { p_barbeiro: barbeiro, p_dia: dia, p_duracao: duracao });
    for (const h of (data ?? []) as { inicio: string }[]) {
      // spread the offer: at most 3 per day, at least 45 min apart
      const doDia = lista.filter((s) => s.inicio.slice(0, 10) === h.inicio.slice(0, 10));
      if (doDia.length >= 3 || doDia.some((s) => Math.abs(Date.parse(s.inicio) - Date.parse(h.inicio)) < 45 * 60_000)) continue;
      lista.push({ inicio: new Date(h.inicio).toISOString(), rotulo: rotulo(h.inicio) });
      if (lista.length >= 6) break;
    }
  }
  return lista;
}

function mock(historico: Msg[], slots: Slot[], servicoPadrao: string) {
  const ultima = historico.at(-1)?.texto ?? '';
  const ofereceu = historico.slice().reverse().find((m) => m.autor !== 'cliente')?.texto ?? '';
  if (/\b(sim|pode|fechado|confirm|esse|beleza)\b/i.test(ultima) && slots[0] && ofereceu.includes(slots[0].rotulo)) {
    return { resposta: `Fechado! Marquei ${slots[0].rotulo}. Até lá!`, acao: 'agendar', horario: slots[0].inicio, servicos: [servicoPadrao] };
  }
  if (/marc|agend|hor[aá]rio|vaga|corte|cortar/i.test(ultima) && slots.length) {
    return { resposta: `Tenho ${slots.slice(0, 2).map((s) => s.rotulo).join(' ou ')}. Qual fica melhor?`, acao: 'nenhuma', horario: null, servicos: [] };
  }
  if (/desconto|reclam|problema/i.test(ultima)) {
    return { resposta: 'Vou chamar o barbeiro para falar com você, ele já responde.', acao: 'chamar_barbeiro', horario: null, servicos: [] };
  }
  return { resposta: 'Oi! Quer marcar um horário? Me diga o dia que fica melhor.', acao: 'nenhuma', horario: null, servicos: [] };
}

export type Decisao = { texto: string; agendado: string | null; chamarBarbeiro: boolean };

/** Decides the reply and, when confirmed, schedules (service-role client). */
export async function atender(admin: SupabaseClient, barbeiro: string, clienteId: string | null, historico: Msg[]): Promise<Decisao | null> {
  const [{ data: b }, { data: servicos }] = await Promise.all([
    admin.from('barbeiros').select('nome, publico, ia_personalidade').eq('id', barbeiro).single(),
    admin.from('servicos').select('id, nome, preco, duracao_min, categoria').eq('barbeiro_id', barbeiro).eq('ativo', true),
  ]);
  const lista = (servicos ?? []) as { id: string; nome: string; preco: number; duracao_min: number; categoria: string }[];
  const padrao = lista.find((s) => s.categoria === 'principal') ?? lista[0];
  const slots = await horarios(admin, barbeiro, padrao?.duracao_min ?? 40);

  const saida = await gerarJSON(RespostaCanal, PROMPT, {
    barbeiro: b?.nome?.split(' ')[0], publico: b?.publico, personalidade: b?.ia_personalidade,
    servicos: lista.map(({ nome, preco, duracao_min }) => ({ nome, preco, duracao_min })),
    horarios_livres: slots, conversa: historico.slice(-10),
  }, { esforco: 'low', mock: () => mock(historico, slots, padrao?.nome ?? 'Corte') });
  if (!saida) return null;

  if (saida.acao === 'agendar') {
    const slot = slots.find((s) => s.inicio === saida.horario);
    const escolhidos = lista.filter((s) => saida.servicos.includes(s.nome));
    if (!slot || escolhidos.length === 0 || !clienteId) {
      return { texto: 'Vou confirmar esse horário com o barbeiro e já te respondo.', agendado: null, chamarBarbeiro: true };
    }
    const { data: at, error } = await admin.from('atendimentos')
      .insert({ barbeiro_id: barbeiro, cliente_id: clienteId, inicio: slot.inicio, status: 'agendado' }).select('id').single();
    if (error || !at) return { texto: 'Vou confirmar com o barbeiro e já te respondo.', agendado: null, chamarBarbeiro: true };
    await admin.from('atendimento_itens').insert(escolhidos.map((s) => ({ atendimento_id: at.id, servico_id: s.id, valor: s.preco })));
    await admin.rpc('recalcular_atendimento', { p_atendimento: at.id });
    return { texto: saida.resposta, agendado: slot.inicio, chamarBarbeiro: false };
  }
  return { texto: saida.resposta, agendado: null, chamarBarbeiro: saida.acao === 'chamar_barbeiro' };
}

/** Palavra-código do funil (origens) contida no texto, se houver. */
export async function codigoNoTexto(admin: SupabaseClient, barbeiro: string, texto: string): Promise<string | null> {
  const { data } = await admin.from('origens').select('codigo').eq('barbeiro_id', barbeiro);
  const achado = (data ?? []).find((o: { codigo: string }) => new RegExp(`\\b${o.codigo}\\b`, 'i').test(texto));
  return achado?.codigo ?? null;
}
