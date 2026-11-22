// "Fale com a IA": the app agent. Claude with tools that read and change the
// barber's data through the database with the barber's own permissions (RLS,
// clienteDoUsuario). Reads and navigation run at once; every change comes back
// as a PENDING action that the barber confirms in the app (button or "sim").
// Numbers always come from tools (the database calculates, the AI interprets).
// Client names go out as "Cliente N" and come back as the first name only.
// LLM_PROVIDER=mock: a small rule-based agent that calls the same tools.
import { criarAnonimizador } from './anonimizar.ts';
import { Anthropic, type SupabaseClient } from './deps.ts';
import { type Conteudo, declaracoes, ErroGoogle, rodarComFerramentas, rodarComFerramentasStream } from './google.ts';
import { modelo, provedor } from './llm.ts';
import { montarRelatorio, SECOES, type DadosRelatorio, type Secao } from './relatorio.ts';

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
const AGRUPAMENTOS = ['dia', 'semana', 'mes', 'dia_da_semana', 'hora', 'servico', 'cliente', 'forma_pagamento'] as const;
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
    input_schema: obj({ cliente: s(CLIENTE),
      observacao: sOuNulo('Texto a acrescentar nas observações (preferências, gostos, conversa). Na dúvida, use este campo. null = nada'),
      tecnica_cabelo: sOuNulo('Técnica do CORTE DE CABELO (ex.: degradê, low fade, social na tesoura, máquina 2). null = manter'),
      tecnica_barba: sOuNulo('Técnica da BARBA (ex.: barba desenhada, contorno na navalha, lenhador). null = manter') }) },
  { name: 'mudar_preco_servico', description: 'Prepara a troca do preço de um serviço.', strict: true,
    input_schema: obj({ servico: s('Nome do serviço'), preco: { type: 'number', description: 'Novo preço em reais' } }) },
  { name: 'registrar_gasto', description: 'Prepara o registro de um gasto de hoje.', strict: true,
    input_schema: obj({ categoria: { type: 'string', enum: [...CATEGORIAS_GASTO] }, valor: { type: 'number' }, descricao: sOuNulo('Descrição curta') }) },
  { name: 'definir_meta', description: 'Prepara a meta de faturamento do mês atual.', strict: true,
    input_schema: obj({ valor: { type: 'number', description: 'Meta em reais' } }) },
  { name: 'fechar_caixa', description: 'Prepara o fechamento do caixa de um dia.', strict: true,
    input_schema: obj({ dia: sOuNulo(`${DIA}; null = hoje`) }) },
  // Full control (22/11/2026): any number of any period, any comanda, reports.
  { name: 'analisar', description: 'Números de QUALQUER período, calculados pelo app: faturamento, atendimentos, ticket médio, clientes, lucro e gastos, com filtro opcional (cliente, serviço, forma de pagamento) e agrupamento opcional. Use para "ticket médio dos últimos 4 dias", "qual dia da semana fatura mais", "quanto o Cliente 3 gastou no ano", "serviço que mais vendeu em outubro". Calcule de e ate a partir das datas do contexto.', strict: true,
    input_schema: obj({ de: s('Primeiro dia, AAAA-MM-DD'), ate: s('Último dia, AAAA-MM-DD (inclusive)'),
      agrupar_por: { type: ['string', 'null'], enum: [...AGRUPAMENTOS, null], description: 'null = só o total' },
      cliente: sOuNulo(`${CLIENTE}; null = todos`), servico: sOuNulo('Nome do serviço; null = todos'),
      forma_pagamento: { type: ['string', 'null'], enum: [...FORMAS, null] } }) },
  { name: 'listar_atendimentos', description: 'Comandas (atendimentos) de um período com id, dia, hora, cliente, itens, total, pagamento e status. Use para achar a comanda certa antes de editar ou apagar.', strict: true,
    input_schema: obj({ de: s('Primeiro dia, AAAA-MM-DD'), ate: s('Último dia, AAAA-MM-DD'), cliente: sOuNulo(`${CLIENTE}; null = todos`),
      status: { type: ['string', 'null'], enum: ['concluido', 'agendado', 'falta', 'cancelado', null] } }) },
  { name: 'editar_atendimento', description: 'Prepara a mudança de uma comanda (id da listar_atendimentos ou da agenda_do_dia): serviços, valor total cobrado, forma de pagamento, dia e hora, cliente ou observação. Preencha só o que muda; o resto null. O barbeiro confirma no app.', strict: true,
    input_schema: obj({ atendimento_id: s('id da comanda'),
      servicos: { type: ['array', 'null'], items: { type: 'string' }, description: 'Nova lista de serviços (troca todos); null = manter' },
      valor_total: { type: ['number', 'null'], description: 'Novo total cobrado em reais (ex.: desconto); null = manter' },
      forma_pagamento: { type: ['string', 'null'], enum: [...FORMAS, null] },
      dia: sOuNulo(`${DIA}; null = manter`), hora: sOuNulo('Hora HH:MM; null = manter'),
      cliente: sOuNulo(`${CLIENTE}; null = manter`), observacao: sOuNulo('Nova observação da comanda; null = manter') }) },
  { name: 'apagar_atendimento', description: 'Prepara apagar uma comanda lançada por engano (id da listar_atendimentos). O barbeiro confirma no app.', strict: true,
    input_schema: obj({ atendimento_id: s('id da comanda') }) },
  { name: 'reabrir_caixa', description: 'Prepara reabrir o caixa de um dia (para poder mudar comandas desse dia).', strict: true,
    input_schema: obj({ dia: s(DIA) }) },
  { name: 'criar_relatorio', description: 'Cria um relatório em página com os números do app e abre na tela do barbeiro (dá para compartilhar em PDF). Escolha o período e as seções. Em "analise" escreva de 2 a 4 frases curtas com a sua leitura, usando só números que vieram das ferramentas.', strict: true,
    input_schema: obj({ titulo: s('Título curto, ex.: "Relatório de novembro"'), de: s('Primeiro dia, AAAA-MM-DD'), ate: s('Último dia, AAAA-MM-DD'),
      secoes: { type: 'array', items: { type: 'string', enum: [...SECOES] }, description: 'Seções na ordem; use "resumo" primeiro' },
      cliente: sOuNulo(`${CLIENTE}; null = todos`), servico: sOuNulo('Nome do serviço; null = todos'),
      analise: sOuNulo('Sua leitura dos números, 2 a 4 frases; null = sem texto') }) },
] as Anthropic.Beta.BetaTool[];

const ALTERACOES = new Set(['agendar_horario', 'lancar_atendimento', 'concluir_atendimento', 'marcar_falta', 'cancelar_horario',
  'anotar_no_cliente', 'mudar_preco_servico', 'registrar_gasto', 'definir_meta', 'fechar_caixa',
  'editar_atendimento', 'apagar_atendimento', 'reabrir_caixa']);

export const SISTEMA = `Você é a assistente de voz dentro de um app para barbeiros brasileiros. O barbeiro fala com você e você ouve e responde em voz.
Você pode consultar e mexer no app usando as ferramentas. Regras:
- Números (faturamento, lucro, preços, metas) só os que vierem das ferramentas, escritos do mesmo jeito. Nunca calcule nem invente.
- Para comparar o mês, use só a "comparacao" de numeros_do_mes (o mês passado e a média, só até o mesmo dia). Nunca compare o mês pela metade com um mês inteiro.
- Para números de qualquer período ou recorte (últimos dias, semana, mês passado, por dia da semana, por serviço, de um cliente), use analisar. Para relatório, criar_relatorio.
- Para mudar uma comanda já lançada, ache o id com listar_atendimentos e use editar_atendimento ou apagar_atendimento.
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

// ---------- The same AI on the phone (Gemma 4, on the device) ----------
// The phone runs the model; the rules, the tools and their execution stay
// here, so the cloud agent and the phone agent are the same AI.

/** Tool list for the phone model: plain JSON Schema, optional fields marked nullable. */
export function ferramentasParaCelular() {
  const simplificar = (schema: Record<string, unknown>): Record<string, unknown> => {
    const props = (schema.properties ?? {}) as Record<string, Record<string, unknown>>;
    const properties: Record<string, unknown> = {};
    const required: string[] = [];
    for (const [k, v] of Object.entries(props)) {
      const tipos = Array.isArray(v.type) ? (v.type as string[]) : [v.type as string];
      const nulo = tipos.includes('null');
      const { type: _t, enum: _e, ...resto } = v;
      const en = Array.isArray(v.enum) ? (v.enum as unknown[]).filter((x) => x !== null) : undefined;
      properties[k] = { ...resto, type: tipos.find((t) => t !== 'null') ?? 'string', ...(en ? { enum: en } : {}), ...(nulo ? { nullable: true } : {}) };
      if (!nulo) required.push(k);
    }
    return { type: 'object', properties, required };
  };
  return FERRAMENTAS.map((f) => {
    const t = f as unknown as { name: string; description: string; input_schema: Record<string, unknown> };
    return { name: t.name, description: t.description, parameters: simplificar(t.input_schema) };
  });
}

/** Dates a small model gets wrong when it has to count: yesterday, this week, this and last month. */
export function datasUteis(hoje: string): string {
  const d = new Date(`${hoje}T12:00:00Z`);
  const dow = (d.getUTCDay() + 6) % 7;   // monday = 0
  const mes = hoje.slice(0, 8) + '01';
  const anterior = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - 1, 1)).toISOString().slice(0, 10);
  const fimAnterior = somarDias(mes, -1);
  return `Datas: ontem ${somarDias(hoje, -1)}; últimos 7 dias ${somarDias(hoje, -6)} a ${hoje}; esta semana ${somarDias(hoje, -dow)} a ${hoje}; semana passada ${somarDias(hoje, -dow - 7)} a ${somarDias(hoje, -dow - 1)}; este mês ${mes} a ${hoje}; mês passado ${anterior} a ${fimAnterior}; este ano ${hoje.slice(0, 4)}-01-01 a ${hoje}.`;
}

/** System prompt for the phone model: short rules for a small model, plus today and the barber's profile. */
export function sistemaCelular(ctx: Contexto, barbeiro: { nome?: string | null; perfil?: unknown }): string {
  const perfil = barbeiro.perfil && typeof barbeiro.perfil === 'object' ? JSON.stringify(barbeiro.perfil).slice(0, 1200) : '';
  const nome = barbeiro.nome ? ` do barbeiro ${barbeiro.nome.split(' ')[0]}` : '';
  return [
    `Você é a IA do app de barbearia${nome}. Ele fala ou escreve com você: é a mesma conversa, e a sua resposta aparece na tela e é lida em voz alta.`,
    `Hoje é ${diaCurto(ctx.hoje)} (${ctx.hoje}), horário de Brasília. Amanhã é ${somarDias(ctx.hoje, 1)}.`,
    datasUteis(ctx.hoje),
    `Serviços: ${ctx.servicos.map((x) => x.nome).join(', ') || 'nenhum cadastrado'}.`,
    'Regras:',
    '1. Para números, agenda, clientes, horários ou serviços, chame uma ferramenta antes de responder. Nunca invente nem calcule números: repita os que a ferramenta mandar. Se ela mandar um "resumo", responda com as palavras dele. Dinheiro sempre como R$ 1.234,56.',
    '2. Para comparar o mês, use só a "comparacao" de numeros_do_mes (mês passado e média, até o mesmo dia). Para qualquer outro período ou recorte (últimos dias, uma semana, um mês, por dia da semana, por serviço, de um cliente), use analisar com as datas certas. Para relatório, use criar_relatorio e depois diga em uma frase o principal.',
    '3. Para mudar algo (agendar, lançar, concluir, falta, cancelar, anotar, preço, gasto, meta, fechar ou reabrir caixa, editar ou apagar comanda), chame primeiro a ferramenta da mudança. Para mudar uma comanda já lançada, ache o id com listar_atendimentos e use editar_atendimento: ela só prepara e mostra o botão de confirmar no app. Só depois diga em uma frase o que vai acontecer e pergunte se confirma. Nunca pergunte se confirma sem ter chamado a ferramenta. Uma mudança por vez.',
    '4. Se faltar cliente, serviço, dia ou hora, pergunte em uma frase curta.',
    '5. Clientes aparecem como "Cliente 1", "Cliente 2"... Use esse formato nas ferramentas. Nunca peça telefone nem dados pessoais.',
    '6. Responda em português do Brasil simples, em no máximo 2 frases curtas, sem listas, sem markdown e sem emojis.',
    ...(perfil ? [`Perfil do barbeiro (da entrevista): ${perfil}`] : []),
  ].join('\n');
}

/** The phone rules with the barber's first name and interview profile (used by Gemma, on the phone or in the cloud). */
export async function sistemaDoBarbeiro(ctx: Contexto): Promise<string> {
  const { data: b } = await ctx.db.from('barbeiros').select('nome, ia_perfil').eq('id', ctx.barbeiro).maybeSingle();
  const perfil = b?.ia_perfil && typeof b.ia_perfil === 'object' ? { ...(b.ia_perfil as Record<string, unknown>), respostas: undefined } : null;
  return sistemaCelular(ctx, { nome: b?.nome as string | null | undefined, perfil });
}

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
  const diaOuNulo = (v: unknown) => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null);
  // Optional filters of analisar / criar_relatorio: client, service, payment.
  const filtros = async (e: Record<string, unknown>): Promise<{ rpc: { p_cliente: string | null; p_servico: string | null; p_forma: string | null }; texto: string } | string> => {
    const c = e.cliente ? cliente(e.cliente as string) : null;
    if (e.cliente && !c) return 'Cliente não encontrado. Use o formato "Cliente N".';
    const sv = e.servico ? servicos([String(e.servico)]).ok[0] ?? null : null;
    if (e.servico && !sv) return `Serviço não encontrado. Serviços: ${ctx.servicos.map((x) => x.nome).join(', ')}.`;
    const forma = FORMAS.includes(e.forma_pagamento as never) ? String(e.forma_pagamento) : null;
    const partes = [c ? `cliente ${anon.anonimizar(c.nome)}` : null, sv ? `serviço ${sv.nome}` : null, forma ? `pagamento ${forma}` : null].filter(Boolean);
    return { rpc: { p_cliente: c?.id ?? null, p_servico: sv?.id ?? null, p_forma: forma }, texto: partes.length ? ` (${partes.join(', ')})` : '' };
  };

  switch (nome) {
    case 'resumo_do_dia': {
      const { data, error } = await db.rpc('resumo_dia', { p_dia: dia(entrada.dia) });
      if (error) return erro('Não deu para ler o resumo.');
      const r = (Array.isArray(data) ? data[0] ?? null : data) as Record<string, unknown> | null;
      // A ready sentence in pt-BR (money as "R$ 1.234,56"): the model repeats it instead of formatting numbers.
      const quando = dia(entrada.dia) === ctx.hoje ? 'Hoje' : `Em ${diaCurto(dia(entrada.dia))}`;
      const resumo = r ? `${quando}: ${moeda(Number(r.faturamento ?? 0))} em ${Number(r.atendimentos ?? 0)} atendimento(s), lucro de ${moeda(Number(r.lucro ?? 0))}.` : `${quando}: nenhum atendimento.`;
      return dados({ resumo, ...(r ?? {}) });
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
      const mesDados = (fin.data as Record<string, unknown>[] | null)?.[0] ?? null;
      const resumo = `No mês, até hoje: ${moeda(Number(mesDados?.faturamento ?? 0))} em ${Number(mesDados?.atendimentos ?? 0)} atendimento(s).${frasesComparacao({
        ate_dia: (c.ate_dia as number | null) ?? null, variacao_vs_mes_passado: (c.variacao_faturamento as number | null) ?? null,
        variacao_vs_media_3_meses: (c.vs_media_faturamento as number | null) ?? null })}`;
      return dados({ resumo, mes: mesDados,
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
    case 'analisar': {
      const de = diaOuNulo(entrada.de);
      const ate = diaOuNulo(entrada.ate) ?? ctx.hoje;
      if (!de) return erro('Informe o primeiro dia (de) no formato AAAA-MM-DD.');
      const filtro = await filtros(entrada);
      if (typeof filtro === 'string') return erro(filtro);
      const agrupar = AGRUPAMENTOS.includes(entrada.agrupar_por as never) ? String(entrada.agrupar_por) : null;
      const { data, error } = await db.rpc('analisar_periodo', { p_de: de, p_ate: ate, p_agrupar: agrupar, ...filtro.rpc });
      if (error) return erro(`Não deu para analisar: ${error.message}`);
      const r = data as { total: Record<string, number | null>; grupos: Record<string, unknown>[] | null };
      const t = r.total;
      const periodo = de === ate ? `Em ${diaCurto(de)}` : `De ${diaCurto(de)} a ${diaCurto(ate)}`;
      const resumo = Number(t.atendimentos) === 0 ? `${periodo}${filtro.texto}: nenhum atendimento.`
        : `${periodo}${filtro.texto}: ${moeda(Number(t.faturamento))} em ${t.atendimentos} atendimento(s), ticket médio de ${moeda(Number(t.ticket_medio))}, ${t.clientes_unicos} cliente(s).${t.lucro !== null ? ` Lucro de ${moeda(Number(t.lucro))}, com ${moeda(Number(t.gastos))} de gastos.` : ''}`;
      // Money as "R$ 1.234,56" strings: the model repeats them instead of formatting numbers.
      const grupos = (r.grupos ?? []).slice(0, 40).map((g) => Object.fromEntries(Object.entries(g).filter(([k]) => k !== 'ordem')
        .map(([k, v]) => [k, ['faturamento', 'ticket_medio', 'preco_medio'].includes(k) ? moeda(Number(v)) : v])));
      return dados({ resumo, de, ate, total: { ...t, faturamento: moeda(Number(t.faturamento)), ticket_medio: t.ticket_medio === null ? null : moeda(Number(t.ticket_medio)),
        lucro: t.lucro === null ? null : moeda(Number(t.lucro)), gastos: t.gastos === null ? null : moeda(Number(t.gastos)),
        faturamento_medio_por_dia_trabalhado: t.faturamento_medio_por_dia_trabalhado === null ? null : moeda(Number(t.faturamento_medio_por_dia_trabalhado)),
        valor_do_servico_filtrado: t.valor_do_servico_filtrado === null ? null : moeda(Number(t.valor_do_servico_filtrado)), taxas_cartao: moeda(Number(t.taxas_cartao)) },
        ...(agrupar ? { agrupado_por: agrupar, grupos } : {}) });
    }
    case 'listar_atendimentos': {
      const de = diaOuNulo(entrada.de);
      const ate = diaOuNulo(entrada.ate) ?? de;
      if (!de || !ate) return erro('Informe o período (de e ate) no formato AAAA-MM-DD.');
      const c = entrada.cliente ? cliente(entrada.cliente as string) : null;
      if (entrada.cliente && !c) return erro('Cliente não encontrado. Use o formato "Cliente N".');
      const status = ['concluido', 'agendado', 'falta', 'cancelado'].includes(entrada.status as string) ? entrada.status : null;
      const { data, error } = await db.rpc('listar_atendimentos', { p_de: de, p_ate: ate, p_cliente: c?.id ?? null, p_status: status, p_limite: 41 });
      if (error) return erro(`Não deu para listar: ${error.message}`);
      const lista = (data ?? []) as { id: string; dia: string; hora: string; cliente: string | null; status: string; forma_pagamento: string | null; itens: { item: string; valor: number }[]; total: number; observacao: string | null }[];
      return dados({ de, ate, ...(lista.length > 40 ? { aviso: 'Mais de 40 comandas: diminua o período para ver todas.' } : {}),
        comandas: lista.slice(0, 40).map((a) => ({ id: a.id, dia: a.dia, hora: a.hora, cliente: a.cliente, itens: a.itens.map((i) => i.item).join(' + '),
          total: moeda(a.total), pagamento: a.forma_pagamento, status: a.status, ...(a.observacao ? { observacao: a.observacao } : {}) })) });
    }
    case 'criar_relatorio': {
      const de = diaOuNulo(entrada.de);
      const ate = diaOuNulo(entrada.ate) ?? ctx.hoje;
      if (!de) return erro('Informe o primeiro dia (de) no formato AAAA-MM-DD.');
      if (ate < de) return erro('O último dia vem depois do primeiro.');
      const filtro = await filtros(entrada);
      if (typeof filtro === 'string') return erro(filtro);
      const pedidas = ((entrada.secoes as string[] | null) ?? []).filter((x): x is Secao => SECOES.includes(x as Secao));
      const secoes: Secao[] = [...new Set<Secao>(pedidas.length ? (pedidas[0] === 'resumo' ? pedidas : ['resumo', ...pedidas]) : ['resumo', 'comparacao', 'por_dia', 'por_servico', 'por_pagamento'])];
      const AGRUPA: Partial<Record<Secao, string>> = { por_dia: 'dia', por_semana: 'semana', por_mes: 'mes', por_dia_da_semana: 'dia_da_semana',
        por_hora: 'hora', por_servico: 'servico', por_cliente: 'cliente', por_pagamento: 'forma_pagamento' };
      const dias = Math.round((Date.parse(`${ate}T12:00:00Z`) - Date.parse(`${de}T12:00:00Z`)) / 86_400_000) + 1;
      const analisar = (p_de: string, p_ate: string, p_agrupar: string | null) =>
        db.rpc('analisar_periodo', { p_de, p_ate, p_agrupar, ...filtro.rpc }).then((x) => {
          if (x.error) throw new Error(x.error.message);
          return x.data as { total: DadosRelatorio['total']; grupos: never[] | null };
        });
      try {
        const [total, anterior, comandas, barbeiro, ...grupos] = await Promise.all([
          analisar(de, ate, null),
          secoes.includes('comparacao') ? analisar(somarDias(de, -dias), somarDias(de, -1), null) : Promise.resolve(null),
          secoes.includes('comandas')
            ? db.rpc('listar_atendimentos', { p_de: de, p_ate: ate, p_cliente: filtro.rpc.p_cliente, p_status: null, p_limite: 200 }).then((x) => x.data as DadosRelatorio['comandas'])
            : Promise.resolve(null),
          db.from('barbeiros').select('nome').eq('id', ctx.barbeiro).maybeSingle().then((x) => (x.data?.nome as string | undefined) ?? null),
          ...secoes.filter((x) => AGRUPA[x]).map((x) => analisar(de, ate, AGRUPA[x]!).then((g) => [x, g.grupos ?? []] as const)),
        ]);
        const titulo = anon.revelar(String(entrada.titulo ?? 'Relatório').slice(0, 100)).trim() || 'Relatório';
        const html = montarRelatorio({
          titulo, barbeiro, de, ate, filtro: filtro.texto ? anon.revelar(filtro.texto.replace(/^ \(|\)$/g, '')) : null, secoes,
          total: total.total, anterior: anterior?.total ?? null, grupos: Object.fromEntries(grupos), comandas,
          analise: entrada.analise ? anon.revelar(String(entrada.analise).slice(0, 1500)) : null, geradoEm: new Date(),
        });
        const periodo = de === ate ? diaCurto(de) : `${diaCurto(de)} a ${diaCurto(ate)}`;
        const { data: salvo, error } = await db.from('relatorios_ia').insert({ barbeiro_id: ctx.barbeiro, titulo, periodo, html }).select('id').single();
        if (error || !salvo) return erro('Não deu para guardar o relatório.');
        const t = total.total;
        return { conteudo: anon.anonimizar(`Relatório "${titulo}" pronto e aberto na tela (${periodo}). Números principais: ${moeda(Number(t.faturamento))} em ${t.atendimentos} atendimento(s), ticket médio ${t.ticket_medio === null ? '—' : moeda(Number(t.ticket_medio))}. Diga em uma frase que o relatório abriu e o principal.`),
          navegar: `/ia/relatorio/${salvo.id}` };
      } catch (e) {
        return erro(`Não deu para montar o relatório: ${e instanceof Error ? e.message : 'erro'}`);
      }
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
    case 'reabrir_caixa': {
      const d = dia(entrada.dia);
      const resumo = `Reabrir o caixa de ${diaCurto(d)}`;
      return pendente({ ferramenta: nome, entrada: { dia: d }, resumo }, resumo);
    }
    case 'editar_atendimento':
    case 'apagar_atendimento': {
      const { data } = await db.from('atendimentos')
        .select('id, inicio, status, forma_pagamento, observacao, cliente:clientes(nome), itens:atendimento_itens(valor, servico:servicos(nome), produto:produtos(nome))')
        .eq('id', String(entrada.atendimento_id ?? '')).maybeSingle();
      const a = data as { id: string; inicio: string; status: string; forma_pagamento: string | null; observacao: string | null; cliente: { nome: string } | null;
        itens: { valor: number; servico: { nome: string } | null; produto: { nome: string } | null }[] } | null;
      if (!a) return erro('Comanda não encontrada. Use listar_atendimentos para pegar o id.');
      const diaA = new Date(a.inicio).toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
      const totalA = a.itens.reduce((x, i) => x + Number(i.valor), 0);
      const quem = a.cliente?.nome.split(' ')[0] ?? 'sem cliente';
      const desc = `Comanda de ${quem} · ${diaCurto(diaA)} às ${horaBr(a.inicio)} · ${a.itens.map((i) => i.servico?.nome ?? i.produto?.nome).join(' + ')} ${moeda(totalA)}`;
      if (nome === 'apagar_atendimento') {
        const resumo = `Apagar a ${desc.charAt(0).toLowerCase()}${desc.slice(1)}`;
        return pendente({ ferramenta: nome, entrada: { atendimento_id: a.id }, resumo }, anon.anonimizar(resumo));
      }
      const mudancas: string[] = [];
      const real: Record<string, unknown> = { atendimento_id: a.id };
      if (Array.isArray(entrada.servicos) && entrada.servicos.length) {
        const { ok, faltando } = servicos(entrada.servicos as string[]);
        if (faltando.length || !ok.length) return erro(`Serviço não encontrado: ${faltando.join(', ')}. Serviços: ${ctx.servicos.map((x) => x.nome).join(', ')}.`);
        real.servico_ids = ok.map((x) => x.id);
        mudancas.push(`serviços: ${ok.map((x) => `${x.nome} ${moeda(Number(x.preco))}`).join(' + ')}`);
      }
      if (entrada.valor_total !== null && entrada.valor_total !== undefined) {
        const v = Number(entrada.valor_total);
        if (!(v >= 0 && v < 100000)) return erro('Valor inválido.');
        real.valor_total = v;
        mudancas.push(`total cobrado: ${moeda(v)}`);
      }
      if (FORMAS.includes(entrada.forma_pagamento as never)) {
        real.forma = entrada.forma_pagamento;
        mudancas.push(`pagamento: ${entrada.forma_pagamento}`);
      }
      const novoDia = diaOuNulo(entrada.dia);
      const novaHora = typeof entrada.hora === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(entrada.hora) ? entrada.hora : null;
      if (entrada.hora && !novaHora) return erro('Hora inválida: use HH:MM.');
      if (novoDia || novaHora) {
        const d = novoDia ?? diaA;
        const h = novaHora ?? horaBr(a.inicio);
        real.inicio = `${d}T${h}:00-03:00`;
        mudancas.push(`para ${diaCurto(d)} às ${h}`);
      }
      if (entrada.cliente) {
        const c = cliente(entrada.cliente as string);
        if (!c) return erro('Cliente não encontrado. Use o formato "Cliente N".');
        real.cliente_id = c.id;
        mudancas.push(`cliente: ${c.nome.split(' ')[0]}`);
      }
      if (typeof entrada.observacao === 'string' && entrada.observacao.trim()) {
        real.observacao = anon.revelar(entrada.observacao).slice(0, 300);
        mudancas.push(`observação: "${String(real.observacao)}"`);
      }
      if (!mudancas.length) return erro('Diga o que mudar na comanda (serviços, valor, pagamento, dia, hora, cliente ou observação).');
      const resumo = `${desc} → ${mudancas.join(' · ')}`;
      return pendente({ ferramenta: nome, entrada: real, resumo }, anon.anonimizar(resumo));
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
    case 'reabrir_caixa': {
      const { error } = await db.rpc('reabrir_caixa', { p_dia: e.dia });
      return error ? falhou(error.message) : ok('Pronto, caixa reaberto.', ['agenda_grade', 'resumo_dia', 'caixas']);
    }
    case 'editar_atendimento': {
      const { error } = await db.rpc('editar_atendimento', {
        p_atendimento: e.atendimento_id, p_servicos: e.servico_ids ?? null, p_valor_total: e.valor_total ?? null, p_forma: e.forma ?? null,
        p_inicio: e.inicio ?? null, p_cliente: e.cliente_id ?? null, p_observacao: e.observacao ?? null,
      });
      return error ? falhou(error.message) : ok('Pronto, comanda alterada.', [...ATUALIZA_AGENDA, 'atendimentos', 'relatorio']);
    }
    case 'apagar_atendimento': {
      const { error } = await db.rpc('apagar_atendimento', { p_atendimento: e.atendimento_id });
      return error ? falhou(error.message) : ok('Pronto, comanda apagada.', [...ATUALIZA_AGENDA, 'atendimentos', 'relatorio']);
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
  if (provedor() === 'google') return agenteGoogle(ctx, mensagem, historico);

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

// ---------- The loop with Gemma 4 in the cloud (LLM_PROVIDER=google) ----------
// Same rules and tools as Gemma on the phone: one AI, wherever it runs.
export type EventosStream = { onTexto: (pedaco: string) => void; onFerramenta: (nome: string) => void };

/**
 * Streamed text with the real first names back, never cut in the middle of a
 * "Cliente 12": a piece that may still grow into a client marker waits for the next one.
 * Also drops the stray word "thought" Gemma sometimes writes before the answer.
 */
export function criarRevelador(revelar: (t: string) => string, onTexto: (pedaco: string) => void) {
  let guardado = '';
  let inicio = true;
  const PARCIAL = /C(?:l(?:i(?:e(?:n(?:t(?:e(?: \d*)?)?)?)?)?)?)?$/;
  const soltar = (t: string) => { if (t) onTexto(revelar(t)); };
  return {
    empurrar(pedaco: string) {
      guardado += pedaco;
      if (inicio) {
        if (guardado.trim().length < 8 && /^\s*t?h?o?u?g?h?t?\s*$/i.test(guardado)) return;
        guardado = guardado.replace(/^\s*thought\s*/i, '');
        inicio = false;
      }
      const m = guardado.match(PARCIAL);
      const corte = m ? guardado.length - m[0].length : guardado.length;
      soltar(guardado.slice(0, corte));
      guardado = guardado.slice(corte);
    },
    terminar() {
      soltar(inicio ? guardado.replace(/^\s*thought\s*/i, '') : guardado);
      guardado = '';
    },
  };
}

async function agenteGoogle(ctx: Contexto, mensagem: string, historico: Mensagem[], eventos?: EventosStream): Promise<Resposta> {
  const { anon } = preparar(ctx);
  const contents: Conteudo[] = [
    ...historico.slice(-8).filter((m) => String(m.content).trim())
      .map((m): Conteudo => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: anon.anonimizar(String(m.content).slice(0, 2000)) }] })),
    { role: 'user', parts: [{ text: anon.anonimizar(mensagem.trim().slice(0, 1000)) }] },
  ];
  const ferramentas = ferramentasParaCelular();
  let pendenteFinal: Pendente | undefined;
  let navegar: string | undefined;
  const opcoes = {
    modelo: modelo(),
    system: await sistemaDoBarbeiro(ctx),
    contents,
    ferramentas: declaracoes(ferramentas),
    executar: async (nome: string, args: Record<string, unknown>) => {
      if (ALTERACOES.has(nome) && pendenteFinal) return 'Já existe uma mudança esperando confirmação. Uma por vez.';
      // Optional fields the model left out go as null (null = "not given").
      const entrada: Record<string, unknown> = { ...args };
      for (const k of Object.keys(ferramentas.find((f) => f.name === nome)?.parameters.properties ?? {})) if (!(k in entrada)) entrada[k] = null;
      const saida = await executarFerramenta(ctx, nome, entrada);
      if (saida.pendente) pendenteFinal = saida.pendente;
      if (saida.navegar) navegar = saida.navegar;
      return saida.conteudo;
    },
  };
  try {
    let texto: string | null;
    if (eventos) {
      const revelador = criarRevelador((t) => anon.revelar(t), eventos.onTexto);
      texto = await rodarComFerramentasStream({ ...opcoes, onTexto: (p) => revelador.empurrar(p), onFerramenta: eventos.onFerramenta });
      revelador.terminar();
      if (texto !== null) texto = texto.replace(/^\s*thought\s*/i, '');
    } else {
      texto = await rodarComFerramentas(opcoes);
    }
    if (texto === null) return { texto: 'Não consegui terminar agora. Pode repetir de outro jeito?', pendente: pendenteFinal, navegar };
    return { texto: anon.revelar(texto), pendente: pendenteFinal, navegar };
  } catch (e) {
    if (!(e instanceof ErroGoogle)) throw e;
    console.error('agente: erro da API do Google', e.status, e.message);
    return { texto: e.status === 429 ? 'A IA grátis chegou no limite de agora. Tente de novo em um minuto.' : 'A IA não respondeu agora. Tente de novo em instantes.' };
  }
}

/**
 * The agent, streaming. With Gemma in the cloud the text arrives as it is
 * written; with the other providers the whole answer arrives at the end.
 */
export async function rodarAgenteStream(ctx: Contexto, mensagem: string, historico: Mensagem[], eventos: EventosStream): Promise<Resposta> {
  if (provedor() === 'google') return agenteGoogle(ctx, mensagem, historico, eventos);
  const r = await rodarAgente(ctx, mensagem, historico);
  eventos.onTexto(r.texto);
  return r;
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
