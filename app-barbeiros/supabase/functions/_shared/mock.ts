// Deterministic "AI" for development and tests (LLM_PROVIDER=mock). It only
// rephrases what the database sent; it never computes a number.
export type Sinal = { sinal: string; tipo: string; numero: string; servico?: string; narrativa?: string; botao?: string };

const brl = (v: unknown) =>
  v === null || v === undefined ? '—' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v));

const TITULO: Record<string, (s: Sinal) => string> = {
  queda_servico: (s) => `${s.servico ?? 'Serviço'} em baixa`,
  clientes_sumidos: () => 'Clientes sumidos',
  faixa_comissao: () => 'Comissão quase subindo',
  meta_em_risco: () => 'Meta em risco',
  aceitacao_baixa: (s) => `${s.servico ?? 'Oferta'} pouco aceito`,
  produto_parado: (s) => `${s.servico ?? 'Produto'} parado`,
  ratio_caindo: () => 'Menos serviços por cliente',
  narrativa_vencedora: () => 'Narrativa que funciona',
};

const PORQUE: Record<string, string> = {
  queda_servico: 'Saiu bem menos do que no mês passado.',
  clientes_sumidos: 'Quem some por muito tempo costuma ter ido para outro lugar.',
  faixa_comissao: 'Passando de faixa, o percentual sobe.',
  meta_em_risco: 'No ritmo atual, o mês fecha abaixo da meta.',
  aceitacao_baixa: 'Você oferece bastante, mas poucos aceitam.',
  produto_parado: 'Produto parado é dinheiro parado na prateleira.',
  ratio_caindo: 'Cada cliente está levando menos serviços.',
  narrativa_vencedora: 'Essa frase convence mais que as outras.',
};

const ACAO: Record<string, string> = {
  queda_servico: 'Hoje, ofereça junto do corte usando a narrativa que mais fecha.',
  clientes_sumidos: 'Mande uma mensagem curta para quem sumiu, sem desconto de cara.',
  faixa_comissao: 'Ofereça um extra rápido nos próximos atendimentos para passar de faixa.',
  meta_em_risco: 'Abra horários vagos no status do WhatsApp e ofereça um extra por cliente.',
  aceitacao_baixa: 'Troque a narrativa: fale do benefício e que cabe no mesmo tempo.',
  produto_parado: 'Use o produto no cliente e conte o que ele faz enquanto finaliza.',
  ratio_caindo: 'Em cada cliente, ofereça um extra que cabe no tempo do corte.',
  narrativa_vencedora: 'Continue usando essa narrativa e teste ela em outro serviço.',
};

export function mockInsights(sinais: Sinal[], poucosDados: boolean) {
  return {
    insights: sinais.slice(0, 3).map((s, i) => ({
      sinal_id: i,
      titulo: (TITULO[s.sinal] ?? (() => 'Olho nos números'))(s).split(/\s+/).slice(0, 5).join(' '),
      porque: i === 0 && poucosDados ? 'Ainda são poucos dados, mas o sinal já aparece.' : (PORQUE[s.sinal] ?? 'Os números mudaram.'),
      acao: ACAO[s.sinal] ?? 'Veja os detalhes no relatório.',
      botao: s.botao ?? 'Ver detalhes',
    })),
  };
}

export function mockNarrativa(servico: string, estilo: string) {
  return estilo === 'experiencia'
    ? { titulo: `${servico} com cuidado`.split(/\s+/).slice(0, 5).join(' '), texto: `Quer que eu faça a ${servico.toLowerCase()} hoje? É um cuidado a mais e cabe no seu horário.` }
    : { titulo: `${servico} no mesmo tempo`.split(/\s+/).slice(0, 5).join(' '), texto: `Dá para fazer a ${servico.toLowerCase()} agora, no mesmo tempo. Faço?` };
}

export function mockEntrevista(respostas: string[]) {
  const r = (i: number) => (respostas[i] ?? '').slice(0, 200) || 'Não respondeu';
  return {
    resumo: `Barbeiro que cobra e trabalha assim: ${r(0)}`.slice(0, 380),
    etapas: [
      { etapa: 'chegada', aplica_a: 'todos', como_faz_hoje: r(2), sugestao_ia: 'Chame o cliente pelo nome e ofereça uma água ou café.' },
      { etapa: 'diagnostico', aplica_a: 'primeira_vez', como_faz_hoje: r(3), sugestao_ia: 'Pergunte como ele arruma o cabelo no dia a dia antes de cortar.' },
      { etapa: 'oferta', aplica_a: 'todos', como_faz_hoje: r(4), sugestao_ia: 'Ofereça um extra que cabe no mesmo tempo, com uma frase.' },
      { etapa: 'reagendamento', aplica_a: 'recorrente', como_faz_hoje: r(6), sugestao_ia: 'Marque o próximo horário antes de ele levantar da cadeira.' },
    ],
  };
}

export function mockChat(pergunta: string, contexto: Record<string, unknown>) {
  const mes = (contexto.mes_atual ?? {}) as Record<string, unknown>;
  const meta = (contexto.meta ?? {}) as Record<string, unknown>;
  const partes = [
    `Sobre "${pergunta.slice(0, 80)}": pelos números deste mês, você faturou ${brl(mes.faturamento)} em ${mes.atendimentos ?? 0} atendimento(s), com ticket médio de ${brl(mes.ticket_medio)}.`,
    meta.meta ? `Da meta de ${brl(meta.meta)}, faltam ${brl(meta.falta)}.` : 'Você ainda não definiu uma meta para este mês.',
    'Próximo passo: ofereça um extra que cabe no mesmo tempo em cada cliente e registre se ele aceitou.',
  ];
  return partes.join(' ');
}
