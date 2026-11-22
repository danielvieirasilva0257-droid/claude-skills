// While the AI looks something up, it says so (like a person: "let me look at
// your schedule") instead of going quiet for seconds. One short sentence per
// answer, only before the first words of the answer. Pure, tested in Jest.

const FALA: Record<string, string> = {
  resumo_do_dia: 'Deixa eu ver seus números.',
  numeros_do_mes: 'Deixa eu ver seus números.',
  analisar: 'Deixa eu calcular.',
  agenda_do_dia: 'Vou olhar sua agenda.',
  horarios_livres: 'Vou ver os horários livres.',
  ficha_cliente: 'Vou abrir a ficha.',
  listar_atendimentos: 'Vou procurar a comanda.',
  listar_servicos: 'Vou ver seus serviços.',
  criar_relatorio: 'Vou montar o relatório.',
};
const MUDANCA = new Set(['agendar_horario', 'lancar_atendimento', 'concluir_atendimento', 'marcar_falta', 'cancelar_horario', 'anotar_no_cliente',
  'mudar_preco_servico', 'registrar_gasto', 'definir_meta', 'fechar_caixa', 'reabrir_caixa', 'editar_atendimento', 'apagar_atendimento']);

/** The sentence the AI says while a tool runs (null: say nothing, e.g. opening a screen is instant). */
export function falaDeEspera(ferramenta: string): string | null {
  return FALA[ferramenta] ?? (MUDANCA.has(ferramenta) ? 'Vou preparar isso.' : null);
}
