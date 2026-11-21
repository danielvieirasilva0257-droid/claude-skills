// "Fale com a IA": the app agent. Claude with tools that read and change the
// barber's data through the database with the barber's own permissions (RLS,
// clienteDoUsuario). Reads and navigation run at once; every change comes back
// as a PENDING action that the barber confirms in the app (button or "sim").
// Numbers always come from tools (the database calculates, the AI interprets).
// Client names go out as "Cliente N" and come back as the first name only.
// LLM_PROVIDER=mock: a small rule-based agent that calls the same tools.
import { criarAnonimizador } from './anonimizar.ts';
import { Anthropic, type SupabaseClient } from './deps.ts';
import { modelo, provedor } from './llm.ts';

export type Mensagem = { role: 'user' | 'assistant'; content: string };
export type Pendente = { ferramenta: string; entrada: Record<string, unknown>; resumo: string };
export type Resposta = { texto: string; pendente?: Pendente; navegar?: string; atualizar?: string[] };

type Servico = { id: string; nome: string; preco: number; duracao_min: number };
type Cliente = { id: string; nome: string };
export type Contexto = {
  db: SupabaseClient;
  barbeiro: string;
  hoje: string;
  clientes: Cliente[];
  servicos: Servico[];
};

const FORMAS = ['pix', 'dinheiro', 'debito', 'credito'] as const;
const CATEGORIAS_GASTO = ['aluguel', 'produtos', 'transporte', 'alimentacao', 'equipamento', 'marketing', 'outros'] as const;
const TELAS = ['inicio', 'agenda', 'relatorios', 'clientes', 'mais', 'financeiro', 'meta', 'extrato', 'comissao', 'gastos',
  'servicos', 'insights', 'mei', 'expediente', 'whatsapp', 'planos', 'cliente'] as const;
const ROTA: Record<(typeof TELAS)[number], string> = {
  inicio: '/', agenda: '/agenda', relatorios: '/relatorios', clientes: '/clientes', mais: '/mais', financeiro: '/financeiro',
  meta: '/meta', extrato: '/extrato', comissao: '/comissao', gastos: '/gastos', servicos: '/servicos', insights: '/insights',
  mei: '/mei', expediente: '/expediente', whatsapp: '/whatsapp', planos: '/planos', cliente: '/cliente',
};
const ATUALIZA_AGENDA = ['agenda_grade', 'agenda_mes', 'agenda_dia', 'resumo_dia', 'proximos', 'v_metricas_mes', 'financeiro', 'meta'];

// ---------- Tool definitions (strict: every field required, null when not given) ----------
const s = (description: string) => ({ type: 'string', description });
const sOuNulo = (description: string) => ({ type: ['string', 'null'], description });
const obj = (properties: Record<string, unknown>) => ({
  type: 'object' as const, properties, required: Object.keys(properties), additionalProperties: false,
});
const DIA = 'Data AAAA-MM-DD (use a data de hoje do contexto para "hoje", "amanhã"…)';
const CLIENTE = 'Cliente no formato "Cliente N", exatamente como aparece na conversa ou nos resultados';

export const FERRAMENTAS: Anthropic.Beta.BetaTool[] = [
  { name: 'resumo_do_dia', description: 'Faturamento, lucro, atendimentos e agendados de um dia (calculados pelo app).', strict: true,
    input_schema: obj({ dia: sOuNulo(`${DIA}; null = hoje`) }) },
  { name: 'agenda_do_dia', description: 'Horários de um dia com id, hora, cliente, serviços, valor e status. Use os ids para concluir, cancelar ou marcar falta.', strict: true,
    input_schema: obj({ dia: sOuNulo(`${DIA}; null = hoje`) }) },
  { name: 'horarios_livres', description: 'Horários livres de um dia dentro do expediente do barbeiro.', strict: true,
    input_schema: obj({ dia: s(DIA), duracao_min: { type: ['integer', 'null'], description: 'Duração em minutos; null = 40' } }) },
  { name: 'ficha_cliente', description: 'Observações, técnica do cabelo e da barba e últimas visitas de um cliente.', strict: true,
    input_schema: obj({ cliente: s(CLIENTE) }) },
  { name: 'numeros_do_mes', description: 'Faturamento, lucro e atendimentos do mês até hoje, a comparação justa (mês passado e média dos 3 meses, só até o mesmo dia) e o progresso da meta.', strict: true,
    input_schema: obj({}) },
  { name: 'listar_servicos', description: 'Serviços do barbeiro com preço e duração.', strict: true, input_schema: obj({}) },
  { name: 'abrir_tela', description: 'Abre uma tela do app para o barbeiro. Para a ficha de um cliente use tela "cliente" e informe o cliente.', strict: true,
    input_schema: obj({ tela: { type: 'string', enum: [...TELAS] }, cliente: sOuNulo(`${CLIENTE}; só para a tela "cliente"`) }) },
  // Changes: they only PREPARE the action; the barber confirms in the app.
  { name: 'agendar_horario', description: 'Prepara um agendamento (o barbeiro confirma no app).', strict: true,
    input_schema: obj({ cliente: sOuNulo(`${CLIENTE}; null = sem cliente`), servicos: { type: 'array', items: { type: 'string' }, description: 'Nomes dos serviços' },
      dia: s(DIA), hora: s('Hora HH:MM, 24 h') }) },
  { name: 'lancar_atendimento', description: 'Prepara o lançamento de um atendimento feito agora (o barbeiro confirma no app).', strict: true,
    input_schema: obj({ cliente: sOuNulo(`${CLIENTE}; null = sem cliente`), servicos: { type: 'array', items: { type: 'string' } },
      forma_pagamento: { type: ['string', 'null'], enum: [...FORMAS, null] } }) },
  { name: 'concluir_atendimento', description: 'Prepara a conclusão de um horário agendado (id da agenda_do_dia).', strict: true,
    input_schema: obj({ atendimento_id: s('id do horário'), forma_pagamento: { type: ['string', 'null'], enum: [...FORMAS, null] } }) },
  { name: 'marcar_falta', description: 'Prepara marcar que o cliente faltou (id da agenda_do_dia).', strict: true,
    input_schema: obj({ atendimento_id: s('id do horário') }) },
  { name: 'cancelar_horario', description: 'Prepara o cancelamento de um horário (id da agenda_do_dia).', strict: true,
    input_schema: obj({ atendimento_id: s('id do horário') }) },
  { name: 'anotar_no_cliente', description: 'Prepara uma anotação nas observações do cliente e/ou a troca da técnica do cabelo ou da barba.', strict: true,
    input_schema: obj({ cliente: s(CLIENTE), observacao: sOuNulo('Texto a acrescentar nas observações; null = nada'),
      tecnica_cabelo: sOuNulo('Nova técnica do cabelo; null = manter'), tecnica_barba: sOuNulo('Nova técnica da barba; null = manter') }) },
  { name: 'mudar_preco_servico', description: 'Prepara a troca do preço de um serviço.', strict: true,
    input_schema: obj({ servico: s('Nome do serviço'), preco: { type: 'number', description: 'Novo preço em reais' } }) },
  { name: 'registrar_gasto', description: 'Prepara o registro de um gasto de hoje.', strict: true,
    input_schema: obj({ categoria: { type: 'string', enum: [...CATEGORIAS_GASTO] }, valor: { type: 'number' }, descricao: sOuNulo('Descrição curta') }) },
  { name: 'definir_meta', description: 'Prepara a meta de faturamento do mês atual.', strict: true,
    input_schema: obj({ valor: { type: 'number', description: 'Meta em reais' } }) },
  { name: 'fechar_caixa', description: 'Prepara o fechamento do caixa de um dia.', strict: true,
    input_schema: obj({ dia: sOuNulo(`${DIA}; null = hoje`) }) },
] as Anthropic.Beta.BetaTool[];

const ALTERACOES = new Set(['agendar_horario', 'lancar_atendimento', 'concluir_atendimento', 'marcar_falta', 'cancelar_horario',
  'anotar_no_cliente', 'mudar_preco_servico', 'registrar_gasto', 'definir_meta', 'fechar_caixa']);

export const SISTEMA = `Você é a assistente de voz dentro de um app para barbeiros brasileiros. O barbeiro fala com você e você ouve e responde em voz.
Você pode consultar e mexer no app usando as ferramentas. Regras:
- Números (faturamento, lucro, preços, metas) só os que vierem das ferramentas, escritos do mesmo jeito. Nunca calcule nem invente.
- Para comparar o mês, use só a "comparacao" de numeros_do_mes (o mês passado e a média, só até o mesmo dia). Nunca compare o mês pela metade com um mês inteiro.
- Para mudar qualquer coisa, chame a ferramenta da mudança: ela só prepara a ação, e o barbeiro confirma no app. Diga em uma frase o que vai acontecer e peça para ele confirmar. Uma mudança por vez.
- Se faltar informação (cliente, serviço, dia ou hora), pergunte em uma frase curta antes de preparar.
- Clientes aparecem como "Cliente 1", "Cliente 2"... Use sempre esse formato. Nunca peça telefone nem dados pessoais.
- Responda em português do Brasil simples, em no máximo 2 frases curtas, para ser lido em voz alta: sem listas, sem markdown, sem emojis.`;

// ---------- Helpers ----------
const normal = (t: string) => t.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const moeda = (v: number) => brl.format(v).replace(/\s/g, ' ');
const pct = (v: number) => `${(Math.abs(v) * 100).toFixed(1).replace('.', ',').replace(',0', '')}%`;

/** " Até o dia 21: 8,2% acima do mês passado e 9% acima da média." (numbers from the database). */
function frasesComparacao(c?: { ate_dia: number | null; variacao_vs_mes_passado: number | null; variacao_vs_media_3_meses: number | null }) {
  if (!c) return '';
  const partes: string[] = [];
  if (c.variacao_vs_mes_passado !== null) {
    const v = Number(c.variacao_vs_mes_passado);
    partes.push(v === 0 ? 'igual ao mês passado' : `${pct(v)} ${v > 0 ? 'acima' : 'abaixo'} do mês passado`);
  }
  if (c.variacao_vs_media_3_meses !== null) {
    const v = Number(c.variacao_vs_media_3_meses);
    partes.push(Math.abs(v) < 0.03 ? 'na média dos últimos meses' : `${pct(v)} ${v > 0 ? 'acima' : 'abaixo'} da média`);
  }
  if (!partes.length) return '';
  return ` ${c.ate_dia ? `Até o dia ${c.ate_dia}` : 'No mês inteiro'}: ${partes.join(' e ')}.`;
}
const DIAS_SEMANA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const diaCurto = (d: string) => `${DIAS_SEMANA[new Date(`${d}T12:00:00Z`).getUTCDay()]}, ${d.slice(8)}/${d.slice(5, 7)}`;
const somarDias = (d: string, n: number) => new Date(Date.parse(`${d}T12:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);
const horaBr = (iso: string) => new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

export function preparar(ctx: Contexto) {
  const anon = criarAnonimizador(ctx.clientes);
  // Same numbering as criarAnonimizador (sorted by id).
  const porMarcador = new Map([...ctx.clientes].sort((a, b) => a.id.localeCompare(b.id)).map((c, i) => [`cliente ${i + 1}`, c]));
  const cliente = (marcador: string | null | undefined): Cliente | null => (marcador ? porMarcador.get(normal(marcador)) ?? null : null);
  const servicos = (nomes: string[]): { ok: Servico[]; faltando: string[] } => {
    const ok: Servico[] = [];
    const faltando: string[] = [];
    for (const n of nomes) {
      const alvo = normal(n);
      const s = ctx.servicos.find((x) => normal(x.nome) === alvo) ?? ctx.servicos.find((x) => normal(x.nome).startsWith(alvo) || alvo.startsWith(normal(x.nome)));
      if (s) ok.push(s); else faltando.push(n);
    }
    return { ok, faltando };
  };
  return { anon, cliente, servicos };
}

type Saida = { conteudo: string; erro?: boolean; pendente?: Pendente; navegar?: string };

/** Runs one tool. Reads return data (names already masked); changes return a pending action. */
export async function executarFerramenta(ctx: Contexto, nome: string, entrada: Record<string, unknown>): Promise<Saida> {
  const { anon, cliente, servicos } = preparar(ctx);
  const dia = (v: unknown) => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : ctx.hoje);
  const dados = (o: unknown) => ({ conteudo: anon.anonimizar(JSON.stringify(o)) });
  const erro = (texto: string) => ({ conteudo: texto, erro: true });
  const pendente = (p: Pendente, mascarado: string): Saida => ({
    conteudo: `Ação preparada, aguardando a confirmação do barbeiro no app: ${mascarado}. Diga em uma frase o que vai acontecer e peça para confirmar.`,
    pendente: p,
  });
  const { db } = ctx;

  switch (nome) {
    case 'resumo_do_dia': {
      const { data, error } = await db.rpc('resumo_dia', { p_dia: dia(entrada.dia) });
      return error ? erro('Não deu para ler o resumo.') : dados(Array.isArray(data) ? data[0] ?? null : data);
    }
    case 'agenda_do_dia': {
      const { data, error } = await db.rpc('agenda_grade', { p_dia: dia(entrada.dia) });
      if (error) return erro('Não deu para ler a agenda.');
      const g = data as { itens: { id: string; inicio: string; fim: string; status: string; cliente: string | null; servicos: string | null; valor: number }[]; expediente: unknown; folga: boolean };
      return dados({ dia: dia(entrada.dia), expediente: g.expediente, folga: g.folga,
        horarios: g.itens.map((i) => ({ id: i.id, hora: horaBr(i.inicio), ate: horaBr(i.fim), status: i.status, cliente: i.cliente, servicos: i.servicos, valor: i.valor })) });
    }
    case 'horarios_livres': {
      const { data, error } = await db.rpc('horarios_livres', { p_barbeiro: ctx.barbeiro, p_dia: dia(entrada.dia), p_duracao: Number(entrada.duracao_min) || 40 });
      return error ? erro('Não deu para ver os horários livres.') : dados({ dia: dia(entrada.dia), livres: ((data ?? []) as { inicio: string }[]).map((h) => horaBr(h.inicio)) });
    }
    case 'ficha_cliente': {
      const c = cliente(entrada.cliente as string);
      if (!c) return erro('Cliente não encontrado. Use o formato "Cliente N".');
      const [ficha, visitas] = await Promise.all([
        db.from('clientes').select('nome, apelido, observacoes, tecnica_cabelo, tecnica_barba').eq('id', c.id).single(),
        db.from('atendimentos').select('inicio, status, itens:atendimento_itens(servico:servicos(nome))').eq('cliente_id', c.id).order('inicio', { ascending: false }).limit(3),
      ]);
      return dados({ cliente: c.nome, ...(ficha.data ?? {}), ultimas_visitas: visitas.data ?? [] });
    }
    case 'numeros_do_mes': {
      const inicio = `${ctx.hoje.slice(0, 8)}01`;
      const [fin, meta, comp] = await Promise.all([
        db.rpc('financeiro', { p_inicio: inicio, p_fim: ctx.hoje, p_agrupar: 'total' }),
        db.rpc('progresso_meta'),
        db.rpc('comparacao_mes', { p_barbeiro: ctx.barbeiro, p_mes: inicio }),
      ]);
      const m = (meta.data ?? {}) as Record<string, unknown>;
      const c = (comp.data ?? {}) as Record<string, unknown>;
      return dados({ mes: (fin.data as unknown[] | null)?.[0] ?? null,
        // Always the same period: day 1 to today, this month and the months before.
        comparacao: { ate_dia: c.ate_dia ?? null, variacao_vs_mes_passado: c.variacao_faturamento ?? null,
          variacao_vs_media_3_meses: c.vs_media_faturamento ?? null,
          mes_passado_ate_o_mesmo_dia: (c.anterior as Record<string, unknown> | null)?.faturamento ?? null,
          media_ate_o_mesmo_dia: (c.media as Record<string, unknown> | null)?.faturamento ?? null },
        meta: { valor: m.meta, realizado: m.realizado, pct: m.pct, falta: m.falta, cortes_faltando: m.cortes_faltando, em_risco: m.em_risco } });
    }
    case 'listar_servicos':
      return dados(ctx.servicos.map((s) => ({ nome: s.nome, preco: s.preco, duracao_min: s.duracao_min })));
    case 'abrir_tela': {
      const tela = entrada.tela as (typeof TELAS)[number];
      if (!TELAS.includes(tela)) return erro('Tela desconhecida.');
      if (tela === 'cliente') {
        const c = cliente(entrada.cliente as string);
        if (!c) return erro('Cliente não encontrado.');
        return { conteudo: 'Tela aberta.', navegar: `/cliente/${c.id}` };
      }
      return { conteudo: 'Tela aberta.', navegar: ROTA[tela] };
    }
  }

  if (!ALTERACOES.has(nome)) return erro('Ferramenta desconhecida.');
  // ---------- Changes: resolve, validate, summarize; the barber confirms ----------
  switch (nome) {
    case 'agendar_horario':
    case 'lancar_atendimento': {
      const c = entrada.cliente ? cliente(entrada.cliente as string) : null;
      if (entrada.cliente && !c) return erro('Cliente não encontrado. Use o formato "Cliente N" ou pergunte o nome.');
      const { ok, faltando } = servicos((entrada.servicos as string[]) ?? []);
      if (faltando.length || !ok.length) return erro(`Serviço não encontrado: ${faltando.join(', ') || 'nenhum'}. Serviços: ${ctx.servicos.map((s) => s.nome).join(', ')}.`);
      const precos = ok.map((s) => `${s.nome} ${moeda(Number(s.preco))}`).join(' + ');
      if (nome === 'agendar_horario') {
        const d = dia(entrada.dia);
        const hora = String(entrada.hora ?? '');
        if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)) return erro('Hora inválida: use HH:MM.');
        const resumo = `Agendar ${c ? c.nome.split(' ')[0] : 'sem cliente'} · ${diaCurto(d)} às ${hora} · ${precos}`;
        return pendente({ ferramenta: nome, entrada: { cliente_id: c?.id ?? null, servico_ids: ok.map((s) => s.id), dia: d, hora }, resumo }, anon.anonimizar(resumo));
      }
      const forma = FORMAS.includes(entrada.forma_pagamento as never) ? entrada.forma_pagamento : null;
      const resumo = `Lançar atendimento agora · ${c ? c.nome.split(' ')[0] : 'sem cliente'} · ${precos}${forma ? ` · ${forma}` : ''}`;
      return pendente({ ferramenta: nome, entrada: { cliente_id: c?.id ?? null, servico_ids: ok.map((s) => s.id), forma }, resumo }, anon.anonimizar(resumo));
    }
    case 'concluir_atendimento':
    case 'marcar_falta':
    case 'cancelar_horario': {
      const { data } = await ctx.db.from('atendimentos').select('id, inicio, status, cliente:clientes(nome)').eq('id', String(entrada.atendimento_id ?? '')).maybeSingle();
      const a = data as { id: string; inicio: string; status: string; cliente: { nome: string } | null } | null;
      if (!a) return erro('Horário não encontrado. Consulte a agenda_do_dia para pegar o id.');
      const quem = a.cliente?.nome.split(' ')[0] ?? 'sem cliente';
      const forma = FORMAS.includes(entrada.forma_pagamento as never) ? entrada.forma_pagamento : null;
      const acao = nome === 'concluir_atendimento' ? `Concluir o horário${forma ? ` (${forma})` : ''}` : nome === 'marcar_falta' ? 'Marcar falta no horário' : 'Cancelar o horário';
      const resumo = `${acao} das ${horaBr(a.inicio)} de ${diaCurto(new Date(a.inicio).toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }))} · ${quem}`;
      return pendente({ ferramenta: nome, entrada: { atendimento_id: a.id, forma }, resumo }, anon.anonimizar(resumo));
    }
    case 'anotar_no_cliente': {
      const c = cliente(entrada.cliente as string);
      if (!c) return erro('Cliente não encontrado. Use o formato "Cliente N".');
      const partes = [
        entrada.observacao ? `anotar "${String(entrada.observacao).slice(0, 300)}"` : null,
        entrada.tecnica_cabelo ? `técnica do cabelo: ${String(entrada.tecnica_cabelo).slice(0, 120)}` : null,
        entrada.tecnica_barba ? `técnica da barba: ${String(entrada.tecnica_barba).slice(0, 120)}` : null,
      ].filter(Boolean);
      if (!partes.length) return erro('Diga o que anotar.');
      const nomeC = c.nome.split(' ')[0];
      const entradaReal = {
        cliente_id: c.id,
        observacao: entrada.observacao ? anon.revelar(String(entrada.observacao)).slice(0, 300) : null,
        tecnica_cabelo: entrada.tecnica_cabelo ? anon.revelar(String(entrada.tecnica_cabelo)).slice(0, 120) : null,
        tecnica_barba: entrada.tecnica_barba ? anon.revelar(String(entrada.tecnica_barba)).slice(0, 120) : null,
      };
      return pendente({ ferramenta: nome, entrada: entradaReal, resumo: anon.revelar(`Na ficha de ${nomeC}: ${partes.join(' · ')}`) },
        anon.anonimizar(`Na ficha de ${nomeC}: ${partes.join(' · ')}`));
    }
    case 'mudar_preco_servico': {
      const { ok } = servicos([String(entrada.servico ?? '')]);
      const preco = Number(entrada.preco);
      if (!ok[0]) return erro(`Serviço não encontrado. Serviços: ${ctx.servicos.map((s) => s.nome).join(', ')}.`);
      if (!(preco > 0 && preco < 10000)) return erro('Preço inválido.');
      const resumo = `${ok[0].nome}: de ${moeda(Number(ok[0].preco))} para ${moeda(preco)}`;
      return pendente({ ferramenta: nome, entrada: { servico_id: ok[0].id, preco }, resumo }, resumo);
    }
    case 'registrar_gasto': {
      const valor = Number(entrada.valor);
      const categoria = CATEGORIAS_GASTO.includes(entrada.categoria as never) ? String(entrada.categoria) : 'outros';
      if (!(valor > 0 && valor < 100000)) return erro('Valor inválido.');
      const descricao = entrada.descricao ? String(entrada.descricao).slice(0, 120) : null;
      const resumo = `Gasto de hoje: ${moeda(valor)} em ${categoria}${descricao ? ` (${descricao})` : ''}`;
      return pendente({ ferramenta: nome, entrada: { categoria, valor, descricao }, resumo }, resumo);
    }
    case 'definir_meta': {
      const valor = Number(entrada.valor);
      if (!(valor > 0 && valor < 10_000_000)) return erro('Meta inválida.');
      const resumo = `Meta de faturamento do mês: ${moeda(valor)}`;
      return pendente({ ferramenta: nome, entrada: { valor }, resumo }, resumo);
    }
    case 'fechar_caixa': {
      const d = dia(entrada.dia);
      const resumo = `Fechar o caixa de ${diaCurto(d)}`;
      return pendente({ ferramenta: nome, entrada: { dia: d }, resumo }, resumo);
    }
  }
  return erro('Ferramenta desconhecida.');
}

/** Runs a pending action the barber confirmed. */
export async function executarConfirmado(ctx: Contexto, p: Pendente): Promise<Resposta> {
  const e = p.entrada;
  const { db } = ctx;
  const falhou = (msg: string) => ({ texto: `Não deu certo: ${msg}` });
  const ok = (texto: string, atualizar: string[]) => ({ texto, atualizar });
  switch (p.ferramenta) {
    case 'agendar_horario': {
      const { error } = await db.rpc('lancar_atendimento', { p_servicos: e.servico_ids, p_cliente: e.cliente_id, p_inicio: `${e.dia}T${e.hora}:00-03:00`, p_status: 'agendado' });
      return error ? falhou(error.message) : ok('Pronto, horário agendado.', ATUALIZA_AGENDA);
    }
    case 'lancar_atendimento': {
      const { error } = await db.rpc('lancar_atendimento', { p_servicos: e.servico_ids, p_cliente: e.cliente_id, p_forma: e.forma });
      return error ? falhou(error.message) : ok('Pronto, atendimento lançado.', ATUALIZA_AGENDA);
    }
    case 'concluir_atendimento': {
      const { error } = await db.rpc('concluir_atendimento', { p_atendimento: e.atendimento_id, p_forma: e.forma });
      return error ? falhou(error.message) : ok('Pronto, atendimento concluído.', ATUALIZA_AGENDA);
    }
    case 'marcar_falta':
    case 'cancelar_horario': {
      const status = p.ferramenta === 'marcar_falta' ? 'falta' : 'cancelado';
      const { error } = await db.from('atendimentos').update({ status }).eq('id', String(e.atendimento_id));
      return error ? falhou('o horário não mudou') : ok(status === 'falta' ? 'Pronto, marquei a falta.' : 'Pronto, horário cancelado.', ATUALIZA_AGENDA);
    }
    case 'anotar_no_cliente': {
      const { data } = await db.from('clientes').select('observacoes').eq('id', String(e.cliente_id)).single();
      const campos: Record<string, unknown> = {};
      if (e.observacao) {
        const data_ = ctx.hoje.slice(8) + '/' + ctx.hoje.slice(5, 7);
        campos.observacoes = [(data as { observacoes: string | null } | null)?.observacoes, `${data_}: ${e.observacao}`].filter(Boolean).join('\n');
      }
      if (e.tecnica_cabelo) campos.tecnica_cabelo = e.tecnica_cabelo;
      if (e.tecnica_barba) campos.tecnica_barba = e.tecnica_barba;
      const { error } = await db.from('clientes').update(campos).eq('id', String(e.cliente_id));
      return error ? falhou('a ficha não mudou') : ok('Pronto, anotei na ficha.', ['ficha', 'clientes_lista']);
    }
    case 'mudar_preco_servico': {
      const { error } = await db.from('servicos').update({ preco: e.preco }).eq('id', String(e.servico_id));
      return error ? falhou('o preço não mudou') : ok('Pronto, preço atualizado.', ['servicos']);
    }
    case 'registrar_gasto': {
      const { error } = await db.from('gastos').insert({ barbeiro_id: ctx.barbeiro, data: ctx.hoje, categoria: e.categoria, valor: e.valor, descricao: e.descricao });
      return error ? falhou('o gasto não foi salvo') : ok('Pronto, gasto registrado.', ['gastos', 'financeiro', 'resumo_dia']);
    }
    case 'definir_meta': {
      const { error } = await db.rpc('definir_meta', { p_mes: `${ctx.hoje.slice(0, 8)}01`, p_valor: e.valor });
      return error ? falhou(error.message) : ok('Pronto, meta definida.', ['meta']);
    }
    case 'fechar_caixa': {
      const { error } = await db.rpc('fechar_caixa', { p_dia: e.dia });
      return error ? falhou(error.message) : ok('Pronto, caixa fechado.', ['agenda_grade', 'resumo_dia', 'caixas']);
    }
  }
  return falhou('ação desconhecida');
}

// ---------- The loop (Claude) ----------
let cliente: Anthropic | null = null;
function anthropic(): Anthropic {
  cliente ??= new Anthropic({ apiKey: Deno.env.get('LLM_API_KEY') || undefined });
  return cliente;
}

function contextoDoDia(ctx: Contexto): string {
  return `Contexto do app: hoje é ${diaCurto(ctx.hoje)} (${ctx.hoje}), horário de Brasília. Amanhã é ${somarDias(ctx.hoje, 1)}.`;
}

export async function rodarAgente(ctx: Contexto, mensagem: string, historico: Mensagem[]): Promise<Resposta> {
  const { anon } = preparar(ctx);
  if (provedor() === 'mock') return agenteSimulado(ctx, anon.anonimizar(mensagem));

  const mensagens: Anthropic.Beta.BetaMessageParam[] = [
    ...historico.slice(-8).map((m) => ({ role: m.role, content: anon.anonimizar(String(m.content).slice(0, 2000)) })),
    { role: 'user', content: `${contextoDoDia(ctx)}\n\n${anon.anonimizar(mensagem.trim().slice(0, 1000))}` },
  ];
  let pendenteFinal: Pendente | undefined;
  let navegar: string | undefined;
  try {
    for (let volta = 0; volta < 6; volta++) {
      const resposta = await anthropic().beta.messages.create({
        model: modelo(),
        max_tokens: 16000,
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        output_config: { effort: 'low' },   // voice: short turns, answer fast
        system: SISTEMA,
        tools: FERRAMENTAS,
        messages: mensagens,
      });
      if (resposta.stop_reason === 'refusal') return { texto: 'Não consigo ajudar com isso. Posso ver sua agenda, seus números ou marcar um horário.' };
      mensagens.push({ role: 'assistant', content: resposta.content });
      const usos = resposta.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === 'tool_use');
      if (resposta.stop_reason !== 'tool_use' || usos.length === 0) {
        const texto = resposta.content.filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text').map((b) => b.text).join(' ').trim();
        return { texto: anon.revelar(texto || 'Pronto.'), pendente: pendenteFinal, navegar };
      }
      const resultados: Anthropic.Beta.BetaToolResultBlockParam[] = [];
      for (const uso of usos) {
        let saida: Saida;
        if (ALTERACOES.has(uso.name) && pendenteFinal) saida = { conteudo: 'Já existe uma mudança esperando confirmação. Uma por vez.', erro: true };
        else saida = await executarFerramenta(ctx, uso.name, (uso.input ?? {}) as Record<string, unknown>);
        if (saida.pendente) pendenteFinal = saida.pendente;
        if (saida.navegar) navegar = saida.navegar;
        resultados.push({ type: 'tool_result', tool_use_id: uso.id, content: saida.conteudo, ...(saida.erro ? { is_error: true } : {}) });
      }
      mensagens.push({ role: 'user', content: resultados });
    }
    return { texto: 'Não consegui terminar agora. Pode repetir de outro jeito?', pendente: pendenteFinal, navegar };
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) console.error('agente: limite de uso da API', e.message);
    else if (e instanceof Anthropic.APIError) console.error('agente: erro da API', e.status, e.message);
    else throw e;
    return { texto: 'A IA não respondeu agora. Tente de novo em instantes.' };
  }
}

// ---------- Simulated agent (LLM_PROVIDER=mock): rules that call the same tools ----------
async function agenteSimulado(ctx: Contexto, frase: string): Promise<Resposta> {
  const { anon } = preparar(ctx);
  const t = normal(frase);
  const semCliente = normal(frase.replace(/Cliente \d+/gi, ' '));   // so "Cliente 2" is not read as 2 o'clock
  const dia = /amanha/.test(t) ? somarDias(ctx.hoje, 1) : ctx.hoje;
  const rodar = (nome: string, entrada: Record<string, unknown>) => executarFerramenta(ctx, nome, entrada);
  const marcador = frase.match(/Cliente \d+/i)?.[0] ?? null;
  const nomesServicos = ctx.servicos.filter((s) => t.includes(normal(s.nome))).map((s) => s.nome);

  const tela = TELAS.find((x) => x !== 'cliente' && x !== 'inicio' && new RegExp(`\\b(abre|abrir|mostra|ir para|vai para)\\b.*\\b${x}`).test(t));
  if (tela) {
    const r = await rodar('abrir_tela', { tela, cliente: null });
    return { texto: `Abrindo ${tela}.`, navegar: r.navegar };
  }
  if (/\b(abre|abrir|mostra)\b.*\bficha\b/.test(t) && marcador) {
    const r = await rodar('abrir_tela', { tela: 'cliente', cliente: marcador });
    return { texto: r.erro ? r.conteudo : anon.revelar(`Abrindo a ficha de ${marcador}.`), navegar: r.navegar };
  }
  if (/\b(marca|marcar|agenda|agendar)\b/.test(t) && nomesServicos.length) {
    const hora = semCliente.match(/\b(\d{1,2})(?:[:h](\d{2}))?\s*(?:h|horas)?\b/);
    const hh = hora ? `${hora[1]!.padStart(2, '0')}:${hora[2] ?? '00'}` : null;
    if (!hh) return { texto: 'Que horas?' };
    const r = await rodar('agendar_horario', { cliente: marcador, servicos: nomesServicos, dia, hora: hh });
    return r.pendente ? { texto: `${r.pendente.resumo}. Confirma?`, pendente: r.pendente } : { texto: r.conteudo };
  }
  if (/\b(anota|anotar|anote)\b/.test(t) && marcador) {
    const texto = frase.replace(/.*?Cliente \d+\s*(que|:|,)?\s*/i, '').trim();
    const r = await rodar('anotar_no_cliente', { cliente: marcador, observacao: texto || null, tecnica_cabelo: null, tecnica_barba: null });
    return r.pendente ? { texto: `${r.pendente.resumo}. Confirma?`, pendente: r.pendente } : { texto: r.conteudo };
  }
  if (/\b(preco|valor)\b/.test(t) && nomesServicos.length && /\d/.test(semCliente)) {
    const preco = Number((semCliente.match(/(\d+(?:[.,]\d{1,2})?)\s*(?:reais)?\s*$/) ?? semCliente.match(/(\d+(?:[.,]\d{1,2})?)/))![1]!.replace(',', '.'));
    const r = await rodar('mudar_preco_servico', { servico: nomesServicos[0], preco });
    return r.pendente ? { texto: `${r.pendente.resumo}. Confirma?`, pendente: r.pendente } : { texto: r.conteudo };
  }
  if (/\bgastei\b/.test(t)) {
    const valor = Number(t.match(/(\d+(?:[.,]\d{1,2})?)/)?.[1]?.replace(',', '.') ?? 0);
    const categoria = CATEGORIAS_GASTO.find((c) => t.includes(c)) ?? 'outros';
    const r = await rodar('registrar_gasto', { categoria, valor, descricao: null });
    return r.pendente ? { texto: `${r.pendente.resumo}. Confirma?`, pendente: r.pendente } : { texto: r.conteudo };
  }
  if (/\bagenda\b|\bhorarios?\b/.test(t)) {
    const r = await rodar('agenda_do_dia', { dia });
    const a = JSON.parse(r.conteudo) as { horarios: { hora: string; cliente: string | null; servicos: string | null; status: string }[] };
    const marcados = a.horarios.filter((h) => h.status !== 'cancelado');
    if (!marcados.length) return { texto: `Nada marcado ${dia === ctx.hoje ? 'hoje' : 'amanhã'}.` };
    return { texto: anon.revelar(`${dia === ctx.hoje ? 'Hoje' : 'Amanhã'} você tem ${marcados.map((h) => `${h.hora} ${h.cliente ?? 'sem cliente'} (${h.servicos ?? '—'})`).join(', ')}.`) };
  }
  if (/\b(faturei|faturamento|fiz|ganhei|lucro)\b/.test(t)) {
    if (/\bmes\b/.test(t)) {
      const r = JSON.parse((await rodar('numeros_do_mes', {})).conteudo) as {
        mes: { faturamento: number; atendimentos: number } | null;
        comparacao?: { ate_dia: number | null; variacao_vs_mes_passado: number | null; variacao_vs_media_3_meses: number | null };
      };
      return { texto: `No mês você faturou ${moeda(Number(r.mes?.faturamento ?? 0))} em ${r.mes?.atendimentos ?? 0} atendimento(s).${frasesComparacao(r.comparacao)}` };
    }
    const r = JSON.parse((await rodar('resumo_do_dia', { dia })).conteudo) as { faturamento: number; lucro: number; atendimentos: number } | null;
    return { texto: `${dia === ctx.hoje ? 'Hoje' : 'Nesse dia'} você faturou ${moeda(Number(r?.faturamento ?? 0))} em ${r?.atendimentos ?? 0} atendimento(s), com lucro de ${moeda(Number(r?.lucro ?? 0))}.` };
  }
  return { texto: 'Posso ver sua agenda e seus números, marcar horários, anotar na ficha do cliente, mudar preços e registrar gastos. O que você quer?' };
}
