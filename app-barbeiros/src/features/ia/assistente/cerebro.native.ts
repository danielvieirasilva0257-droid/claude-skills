// The AI's brain on the phone: Gemma 4 E2B (react-native-executorch, XNNPACK
// 8da4w, ~3.2 GB downloaded once). One AI for voice and text: the rules, the
// tools and their execution come from the server (ia-agente {contexto} and
// {ferramenta}), the same ones the cloud AI uses. The model writes token by
// token; the screen shows the text and the voice speaks each sentence as soon
// as it is complete. Client names go in as "Cliente N" and come back as the
// first name only on the screen and in the voice.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createLLMChatSession, download, models, setTelemetryEnabled, type LLMChatSession, type LLMToolOpts } from 'react-native-executorch';

import type { Pendente } from '@/features/ia/agente';
import { chamarFuncao } from '@/lib/funcoes';

import { criarAnonimizador, type ClienteNome } from './anonimizar';
import { criarDivisorDeFrases } from './frases';
import { criarFiltroDeFala, lerChamadasGemma4, textoVisivel } from './gemma4';

export const cerebroLocalDisponivel = true;
export const TAMANHO_GEMMA_GB = 3.2;

setTelemetryEnabled(false);

const CONFIG = models.llm.GEMMA4_E2B.XNNPACK_8DA4W;
type Config = typeof CONFIG;
const CHAVE_LOCAL = 'gemma4-e2b-local-v1';

type Ferramenta = { name: string; description: string; parameters: { type: string; properties: Record<string, unknown>; required: string[] } };
type Contexto = { ok: boolean; hoje: string; sistema: string; ferramentas: Ferramenta[]; clientes: ClienteNome[] };
type SaidaFerramenta = { ok: boolean; conteudo?: string; erro?: boolean; pendente?: Pendente; navegar?: string };
type Sessao = { s: LLMChatSession; hoje: string; anon: ReturnType<typeof criarAnonimizador> };

let local: Config | null = null;
let sessao: Promise<Sessao> | null = null;
// What the tools prepared in the current turn (a change waits for the barber's confirmation).
let turno: { pendente?: Pendente; navegar?: string } = {};

export async function gemmaBaixado(): Promise<boolean> {
  if (local) return true;
  try {
    const salvo = await AsyncStorage.getItem(CHAVE_LOCAL);
    if (salvo) local = JSON.parse(salvo) as Config;
  } catch {
    local = null;
  }
  return local !== null;
}

/** Downloads Gemma 4 once (resumes if interrupted). onProgresso receives 0 to 1. */
export async function baixarGemma(onProgresso: (p: number) => void, sinal?: AbortSignal): Promise<void> {
  local = await download(CONFIG, { onProgress: onProgresso, signal: sinal });
  await AsyncStorage.setItem(CHAVE_LOCAL, JSON.stringify(local));
}

async function executar(f: Ferramenta, args: Record<string, unknown>): Promise<string> {
  // Optional fields the model left out go as null (the server treats null as "not given").
  const entrada: Record<string, unknown> = { ...args };
  for (const k of Object.keys(f.parameters.properties)) if (!(k in entrada)) entrada[k] = null;
  const r = await chamarFuncao<SaidaFerramenta>('ia-agente', { ferramenta: f.name, entrada });
  if (r.pendente) {
    if (turno.pendente) return 'Já existe uma mudança esperando confirmação. Uma por vez.';
    turno.pendente = r.pendente;
  }
  if (r.navegar) turno.navegar = r.navegar;
  return r.conteudo ?? 'Sem resposta.';
}

async function abrirSessao(): Promise<Sessao> {
  if (!local) throw new Error('O Gemma 4 ainda não foi baixado.');
  const ctx = await chamarFuncao<Contexto>('ia-agente', { contexto: true });
  const tools: LLMToolOpts['tools'] = ctx.ferramentas.map((f) => ({
    type: 'function',
    function: { name: f.name, description: f.description, parameters: f.parameters },
    execute: (args: Record<string, unknown>) => executar(f, args),
  }));
  const s = await createLLMChatSession(local, {
    initialMessages: [{ role: 'system', content: ctx.sistema }],
    toolOpts: { tools, parseToolCalls: lerChamadasGemma4, maxToolTurns: 4 },
    // Stop as soon as a tool call is closed: after it Gemma would start writing a made-up
    // tool response, and nothing invented may reach the screen or the voice.
    stopRegex: /<tool_call\|>|<\|tool_response>/,
    // Short spoken answers, no thinking channel (answer fast).
    generationConfig: { enableThinking: false, maxNewTokens: 320, temperature: 0.3 },
  });
  return { s, hoje: ctx.hoje, anon: criarAnonimizador(ctx.clientes) };
}

/** The same session for the whole day; a new one when the day changes or the memory is almost full. */
async function obterSessao(): Promise<Sessao> {
  const hoje = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date());
  if (sessao) {
    try {
      const atual = await sessao;
      if (atual.hoje === hoje && atual.s.getKVCacheState().usageRatio < 0.75) return atual;
      atual.s.dispose();
    } catch {
      // the previous load failed: open again below
    }
    sessao = null;
  }
  sessao = abrirSessao().catch(async (e) => {
    sessao = null;
    throw e;
  });
  return sessao;
}

export type RespostaLocal = { texto: string; pendente?: Pendente; navegar?: string; cancelado?: boolean };

/** One turn: streams the visible text (onTexto, the whole text so far) and each complete sentence (onFrase). */
export async function responderComGemma(mensagem: string, eventos: { onTexto: (texto: string) => void; onFrase: (frase: string) => void }): Promise<RespostaLocal> {
  const ss = await obterSessao();
  turno = {};
  const filtro = criarFiltroDeFala();
  const divisor = criarDivisorDeFrases((f) => eventos.onFrase(ss.anon.revelar(f)));
  let escrito = '';
  const receber = (novo: string) => {
    if (!novo) return;
    escrito += novo;
    eventos.onTexto(ss.anon.revelar(escrito));
    divisor.empurrar(novo);
  };
  const r = await ss.s.sendMessage(ss.anon.anonimizar(mensagem.trim().slice(0, 1000)), (token) => receber(filtro.empurrar(token)));
  receber(filtro.terminar());
  divisor.terminar();
  if (r.finishReason === 'cancelled') return { texto: ss.anon.revelar(escrito), cancelado: true };
  if (!escrito.trim()) {
    // Nothing streamed (e.g. the answer came only after tools): use the last assistant message.
    const ultima = [...r.messages].reverse().find((m) => m.role === 'assistant' && typeof m.content === 'string' && m.content.trim());
    const texto = ultima && typeof ultima.content === 'string' ? textoVisivel(ultima.content) : '';
    if (texto) { eventos.onTexto(ss.anon.revelar(texto)); eventos.onFrase(ss.anon.revelar(texto)); }
    escrito = texto;
  }
  return { texto: ss.anon.revelar(escrito.trim() || 'Pronto.'), pendente: turno.pendente, navegar: turno.navegar };
}

export function pararGemma() {
  void sessao?.then((x) => x.s.stop()).catch(() => undefined);
}
