// Calls to the AI Edge Functions. EXPO_PUBLIC_FUNCTIONS_URL overrides the
// default (<supabase>/functions/v1), e.g. the local Deno server in tests.
import { fetch as expoFetch } from 'expo/fetch';

import { MODO_DEMO, URL_DEMO } from '@/features/demo/config';

import { supabase } from './supabase';

// Same build-time switch as in supabase.ts (the recording only ships in demo builds).
const demo = process.env.EXPO_PUBLIC_DEMO === '1'
  ? (require('@/features/demo/fetchDemo') as typeof import('@/features/demo/fetchDemo'))
  : null;

const base = MODO_DEMO
  ? `${URL_DEMO}/functions/v1`
  : process.env.EXPO_PUBLIC_FUNCTIONS_URL || `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1`;

const MENSAGEM: Record<string, string> = {
  plano: 'A IA faz parte do plano Pago.',
  limite: 'Você usou todas as perguntas de hoje. Amanhã tem mais.',
  saida_invalida: 'A IA não conseguiu responder direito agora. Tente de novo.',
  login: 'Entre de novo na sua conta.',
};

async function cabecalhos() {
  const { data } = await supabase.auth.getSession();
  return { Authorization: `Bearer ${data.session?.access_token ?? ''}`, 'Content-Type': 'application/json' };
}

/** POST to an AI function; throws an Error with a Portuguese message. */
export async function chamarFuncao<T>(nome: string, corpo: unknown = {}): Promise<T> {
  let resposta: Response;
  try {
    resposta = await (demo ? demo.fetchDemo : fetch)(`${base}/${nome}`, { method: 'POST', headers: await cabecalhos(), body: JSON.stringify(corpo) });
  } catch {
    throw new Error('Sem conexão. Tente de novo.');
  }
  const dados = (await resposta.json().catch(() => ({}))) as { ok?: boolean; erro?: string } & T;
  if (!resposta.ok || dados.ok === false) throw new Error(MENSAGEM[dados.erro ?? ''] ?? 'Não deu certo. Tente de novo.');
  return dados;
}

/** Chat in streaming (Server-Sent Events). Calls onTexto for each piece. */
export async function perguntarIA(
  pergunta: string,
  historico: { role: 'user' | 'assistant'; content: string }[],
  onTexto: (pedaco: string) => void,
): Promise<void> {
  if (demo) {
    // Recorded answer, delivered in pieces like the real stream.
    for (const pedaco of demo.respostaDoChat(pergunta).match(/\S+\s*/g) ?? []) {
      onTexto(pedaco);
      await new Promise((r) => setTimeout(r, 25));
    }
    return;
  }
  const resposta = await expoFetch(`${base}/ia-chat`, {
    method: 'POST',
    headers: await cabecalhos(),
    body: JSON.stringify({ pergunta, historico }),
  });
  if (!resposta.ok || !resposta.body) {
    const dados = (await resposta.json().catch(() => ({}))) as { erro?: string };
    throw new Error(MENSAGEM[dados.erro ?? ''] ?? 'Não deu para perguntar agora.');
  }
  const leitor = resposta.body.getReader();
  const decodificar = new TextDecoder();
  let resto = '';
  for (;;) {
    const { value, done } = await leitor.read();
    if (done) break;
    resto += decodificar.decode(value, { stream: true });
    const eventos = resto.split('\n\n');
    resto = eventos.pop() ?? '';
    for (const e of eventos) {
      const linha = e.replace(/^data: /, '').trim();
      if (!linha) continue;
      const msg = JSON.parse(linha) as { texto?: string; fim?: boolean; erro?: string };
      if (msg.erro) throw new Error(msg.erro);
      if (msg.texto) onTexto(msg.texto);
    }
  }
}
