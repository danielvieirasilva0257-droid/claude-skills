// Premium and Premium Plus data (migration 0005 and the channel functions).
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useUsuarioId } from '@/features/conta/barbeiro';
import { chamarFuncao } from '@/lib/funcoes';
import { supabase } from '@/lib/supabase';

const invalidar = (qc: ReturnType<typeof useQueryClient>, ...chaves: string[]) =>
  Promise.all(chaves.map((k) => qc.invalidateQueries({ queryKey: [k] })));

async function tabela<T>(consulta: PromiseLike<{ data: unknown; error: { message: string } | null }>): Promise<T> {
  const { data, error } = await consulta;
  if (error) throw new Error(error.message);
  return data as T;
}

// ---------- Expediente e lista de espera ----------
export type DiaExpediente = { dia_semana: number; inicio: string; fim: string; pausa_inicio: string | null; pausa_fim: string | null };

export function useExpediente() {
  const uid = useUsuarioId();
  return useQuery({
    queryKey: ['expediente', uid],
    enabled: uid !== null,
    queryFn: () => tabela<DiaExpediente[]>(supabase.from('expediente').select('*').eq('barbeiro_id', uid!).order('dia_semana')),
  });
}

export function useSalvarExpediente() {
  const uid = useUsuarioId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dias: DiaExpediente[]) => {
      await tabela(supabase.from('expediente').delete().eq('barbeiro_id', uid!));
      if (dias.length) await tabela(supabase.from('expediente').insert(dias.map((d) => ({ ...d, barbeiro_id: uid! }))));
    },
    onSuccess: () => invalidar(qc, 'expediente'),
  });
}

export type Espera = { id: string; status: string; preferencia: string | null; criado_em: string;
  cliente: { nome: string } | null; servico: { nome: string } | null };

export function useListaEspera() {
  const uid = useUsuarioId();
  return useQuery({
    queryKey: ['lista_espera', uid],
    enabled: uid !== null,
    queryFn: () => tabela<Espera[]>(supabase.from('lista_espera')
      .select('id, status, preferencia, criado_em, cliente:clientes(nome), servico:servicos(nome)')
      .eq('barbeiro_id', uid!).in('status', ['aguardando', 'avisado']).order('criado_em')),
  });
}

export function useEntrarEspera() {
  const uid = useUsuarioId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { cliente_id: string; preferencia: string | null }) =>
      tabela(supabase.from('lista_espera').insert({ ...v, barbeiro_id: uid! })),
    onSuccess: () => invalidar(qc, 'lista_espera'),
  });
}

export function useSairEspera() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tabela(supabase.from('lista_espera').update({ status: 'desistiu' }).eq('id', id)),
    onSuccess: () => invalidar(qc, 'lista_espera'),
  });
}

// ---------- Canais e conversas ----------
export type Canal = { tipo: 'whatsapp' | 'instagram'; conta_externa: string; nome_exibicao: string | null; status: string; ia_ativa: boolean };

export function useCanal(tipo: Canal['tipo']) {
  const uid = useUsuarioId();
  return useQuery({
    queryKey: ['canal', uid, tipo],
    enabled: uid !== null,
    queryFn: async () => (await tabela<Canal[]>(supabase.from('canais').select('*').eq('barbeiro_id', uid!).eq('tipo', tipo)))[0] ?? null,
  });
}

export function useConectarCanal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { tipo: Canal['tipo']; conta_externa?: string; nome_exibicao?: string; token?: string; desconectar?: boolean }) =>
      chamarFuncao('canal-conectar', v),
    onSuccess: () => invalidar(qc, 'canal'),
  });
}

export function useIaNoCanal() {
  const uid = useUsuarioId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { tipo: Canal['tipo']; ia_ativa: boolean }) =>
      tabela(supabase.from('canais').update({ ia_ativa: v.ia_ativa }).eq('barbeiro_id', uid!).eq('tipo', v.tipo)),
    onSuccess: () => invalidar(qc, 'canal'),
  });
}

export type Conversa = { id: string; canal: Canal['tipo']; nome_contato: string | null; ia_ativa: boolean; janela_ate: string | null;
  ultima_mensagem_em: string; nao_lidas: number; origem_codigo: string | null; cliente: { nome: string } | null;
  ultima: { texto: string; autor: string }[] };

export function useConversas(canal: Canal['tipo']) {
  const uid = useUsuarioId();
  return useQuery({
    queryKey: ['conversas', uid, canal],
    enabled: uid !== null,
    refetchInterval: 15_000,
    queryFn: () => tabela<Conversa[]>(supabase.from('conversas')
      .select('id, canal, nome_contato, ia_ativa, janela_ate, ultima_mensagem_em, nao_lidas, origem_codigo, cliente:clientes(nome), ultima:mensagens(texto, autor)')
      .eq('barbeiro_id', uid!).eq('canal', canal).order('ultima_mensagem_em', { ascending: false })
      .order('criado_em', { referencedTable: 'mensagens', ascending: false }).limit(1, { referencedTable: 'mensagens' })),
  });
}

export type Mensagem = { id: string; direcao: 'entrada' | 'saida'; autor: string; texto: string; status_envio: string; criado_em: string };

export function useConversa(id: string) {
  return useQuery({
    queryKey: ['conversa', id],
    refetchInterval: 5_000,
    queryFn: async () => {
      const [c, m] = await Promise.all([
        tabela<Conversa>(supabase.from('conversas').select('*, cliente:clientes(nome)').eq('id', id).single()),
        tabela<Mensagem[]>(supabase.from('mensagens').select('*').eq('conversa_id', id).order('criado_em')),
      ]);
      if (c.nao_lidas) await supabase.from('conversas').update({ nao_lidas: 0 }).eq('id', id);
      return { conversa: c, mensagens: m };
    },
  });
}

export function useAssumir() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: string; ia_ativa: boolean }) => tabela(supabase.from('conversas').update({ ia_ativa: v.ia_ativa }).eq('id', v.id)),
    onSuccess: () => invalidar(qc, 'conversa', 'conversas'),
  });
}

export function useResponder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { conversa_id: string; texto: string }) => chamarFuncao('canal-enviar', v),
    onSuccess: () => invalidar(qc, 'conversa', 'conversas'),
  });
}

// ---------- Automações e mensagens ----------
export type EstrategiaAuto = { codigo: string; nome: string; momento: string; categoria_contato: string | null; frase: string | null; ativa: boolean };
export const COM_MOTOR = ['R4', 'A15', 'R6', 'R9', 'R12', 'V1'];

export function useAutomacoes() {
  const uid = useUsuarioId();
  return useQuery({
    queryKey: ['automacoes', uid],
    enabled: uid !== null,
    queryFn: async () => {
      const [e, b] = await Promise.all([
        tabela<Omit<EstrategiaAuto, 'ativa'>[]>(supabase.from('estrategias').select('codigo, nome, momento, categoria_contato, frase').eq('automatizavel', true).order('codigo')),
        tabela<{ codigo: string; ativa: boolean }[]>(supabase.from('barbeiro_estrategias').select('codigo, ativa').eq('barbeiro_id', uid!)),
      ]);
      const ligadas = new Set(b.filter((x) => x.ativa).map((x) => x.codigo));
      return e.map((x) => ({ ...x, ativa: ligadas.has(x.codigo) }))
        .sort((x, y) => Number(COM_MOTOR.includes(y.codigo)) - Number(COM_MOTOR.includes(x.codigo)));
    },
  });
}

export function useLigarAutomacao() {
  const uid = useUsuarioId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { codigo: string; ativa: boolean }) =>
      tabela(supabase.from('barbeiro_estrategias').upsert({ barbeiro_id: uid!, codigo: v.codigo, ativa: v.ativa }, { onConflict: 'barbeiro_id,codigo' })),
    onSuccess: () => invalidar(qc, 'automacoes'),
  });
}

export type ItemFila = { id: string; estrategia: string | null; categoria: string; texto: string; status: string; motivo: string | null;
  agendado_para: string; cliente: { nome: string } | null };

export function useFila() {
  const uid = useUsuarioId();
  return useQuery({
    queryKey: ['fila', uid],
    enabled: uid !== null,
    queryFn: () => tabela<ItemFila[]>(supabase.from('mensagens_fila').select('id, estrategia, categoria, texto, status, motivo, agendado_para, cliente:clientes(nome)')
      .eq('barbeiro_id', uid!).order('criado_em', { ascending: false }).limit(30)),
  });
}

export function usePlanejar() {
  const uid = useUsuarioId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => tabela<number>(supabase.rpc('planejar_automacoes', { p_barbeiro: uid! })),
    onSuccess: () => invalidar(qc, 'fila', 'uso_mensagens'),
  });
}

export function useCancelarFila() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tabela(supabase.from('mensagens_fila').update({ status: 'cancelada' }).eq('id', id)),
    onSuccess: () => invalidar(qc, 'fila'),
  });
}

export function useUsoMensagens() {
  const uid = useUsuarioId();
  return useQuery({
    queryKey: ['uso_mensagens', uid],
    enabled: uid !== null,
    queryFn: () => tabela<{ usadas: number; limite: number; transacionais: number }>(supabase.rpc('uso_mensagens_mes')),
  });
}

export type Permissao = { id: string; nome: string; lembretes: boolean | null; marketing: boolean | null };

export function usePermissoes() {
  const uid = useUsuarioId();
  return useQuery({
    queryKey: ['permissoes', uid],
    enabled: uid !== null,
    queryFn: async () => {
      const [c, k] = await Promise.all([
        tabela<{ id: string; nome: string }[]>(supabase.from('clientes').select('id, nome').eq('barbeiro_id', uid!).order('nome')),
        tabela<{ cliente_id: string; tipo: string; aceito: boolean; registrado_em: string }[]>(
          supabase.from('consentimentos').select('cliente_id, tipo, aceito, registrado_em').order('registrado_em', { ascending: false })),
      ]);
      const ultimo = (id: string, tipo: string) => k.find((x) => x.cliente_id === id && x.tipo === tipo)?.aceito ?? null;
      return c.map((x) => ({ ...x, lembretes: ultimo(x.id, 'lembretes'), marketing: ultimo(x.id, 'marketing') })) as Permissao[];
    },
  });
}

export function useRegistrarPermissao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { cliente_id: string; tipo: 'lembretes' | 'marketing'; aceito: boolean }) =>
      tabela(supabase.from('consentimentos').insert({ ...v, canal: 'presencial',
        texto_aceito: v.aceito ? `Cliente aceitou pessoalmente receber ${v.tipo === 'marketing' ? 'novidades e ofertas' : 'lembretes do horário'}.`
          : `Cliente pediu para não receber ${v.tipo === 'marketing' ? 'novidades e ofertas' : 'lembretes'}.` })),
    onSuccess: () => invalidar(qc, 'permissoes'),
  });
}

// ---------- Instagram, funil e personalidade ----------
export type EventoIg = { id: string; tipo: string; autor_nome: string | null; texto: string | null; recebido_em: string;
  resposta_privada_em: string | null; codigo_detectado: string | null };

export function useEventosInstagram() {
  const uid = useUsuarioId();
  return useQuery({
    queryKey: ['eventos_ig', uid],
    enabled: uid !== null,
    queryFn: () => tabela<EventoIg[]>(supabase.from('instagram_eventos').select('*').eq('barbeiro_id', uid!).order('recebido_em', { ascending: false }).limit(40)),
  });
}

export type LinhaFunil = { codigo: string; canal: string | null; parceiro: string | null; custo_mensal: number | string; contatos: number;
  agendaram: number; vieram: number; voltaram: number; custo_por_cliente: number | string | null };

export function useFunil() {
  const uid = useUsuarioId();
  return useQuery({
    queryKey: ['funil', uid],
    enabled: uid !== null,
    queryFn: async () => {
      const [f, o, c] = await Promise.all([
        tabela<LinhaFunil[]>(supabase.from('v_funil_prospeccao').select('*').eq('barbeiro_id', uid!).order('contatos', { ascending: false })),
        tabela<{ origem: string; clientes: number; fieis: number }[]>(supabase.from('v_origem_clientes').select('*').eq('barbeiro_id', uid!).order('clientes', { ascending: false })),
        tabela<{ codigo: string; canal: string; parceiro: string | null; custo_mensal: number | string }[]>(supabase.from('origens').select('*').eq('barbeiro_id', uid!).order('codigo')),
      ]);
      return { funil: f, origens: o, codigos: c };
    },
  });
}

export function useSalvarCodigo() {
  const uid = useUsuarioId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { codigo: string; canal: string; parceiro: string | null; custo_mensal: number }) =>
      tabela(supabase.from('origens').upsert({ ...v, codigo: v.codigo.toUpperCase(), barbeiro_id: uid! }, { onConflict: 'barbeiro_id,codigo' })),
    onSuccess: () => invalidar(qc, 'funil'),
  });
}

export type Personalidade = { tom: 'parceiro' | 'formal' | 'descontraido'; emojis: boolean; assinatura: string; evitar: string[] };

export function useSalvarPersonalidade() {
  const uid = useUsuarioId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: Personalidade) => tabela(supabase.from('barbeiros').update({ ia_personalidade: p }).eq('id', uid!)),
    onSuccess: () => invalidar(qc, 'barbeiro'),
  });
}
