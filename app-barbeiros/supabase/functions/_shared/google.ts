// Google AI Studio (Gemini API): the free cloud brain. Gemma 4 (the same model
// family Daniel chose for the phone, the bigger 26B version) answers for free
// with a daily limit; LLM_MODEL changes the model.
// Plain REST with fetch (no SDK): generateContent with function calling, JSON
// output and an SSE stream. Measured on 22/11/2026: Gemma 4 26B calls the
// tools natively; with thinkingLevel "minimal" it answers in ~1-2 s (6 s with
// its default thinking). But the free tier is often busy: "high demand" (503),
// the per-minute limit (429) or a request that waits 30-50 s in line. So a busy
// model is tried again quickly, a slow one is dropped after LLM_TEMPO_MAX_MS
// (10 s), and then the backup answers (LLM_MODELOS_RESERVA, default Gemini
// Flash-Lite, also free and fast; Gemma 4 31B took 20-30 s and was left out).
// A model that refuses a system instruction, a JSON mode or
// a thinking level gets the request again without it (rules at the top of the
// first message, JSON asked for in words).
const BASE = 'https://generativelanguage.googleapis.com/v1beta';
export const MODELO_GOOGLE = 'gemma-4-26b-a4b-it';
const RESERVAS = ['gemini-flash-lite-latest'];
const TEMPO_MAX_MS = () => Number(Deno.env.get('LLM_TEMPO_MAX_MS') ?? 10_000);

function cadeia(modelo: string): string[] {
  const env = Deno.env.get('LLM_MODELOS_RESERVA');
  const reservas = env !== undefined ? env.split(',').map((x) => x.trim()).filter(Boolean) : RESERVAS;
  return [...new Set([modelo, ...reservas])];
}
const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

const chave = () => Deno.env.get('LLM_API_KEY') || Deno.env.get('GOOGLE_API_KEY') || Deno.env.get('GEMINI_API_KEY') || '';

export type Parte = {
  text?: string;
  thought?: boolean;
  thoughtSignature?: string;
  functionCall?: { id?: string; name: string; args?: Record<string, unknown> };
  functionResponse?: { id?: string; name: string; response: Record<string, unknown> };
};
export type Conteudo = { role: 'user' | 'model'; parts: Parte[] };
export type Declaracao = { name: string; description: string; parameters?: Record<string, unknown> };
export type Pedido = {
  system: string;
  contents: Conteudo[];
  ferramentas?: Declaracao[];
  json?: Record<string, unknown>;
  maxTokens?: number;
  temperatura?: number;
};

export class ErroGoogle extends Error {
  constructor(public status: number, mensagem: string) {
    super(mensagem);
  }
}

type Ajustes = { sistemaNaMensagem: boolean; semJson: boolean; semNivel: boolean };

function corpo(p: Pedido, a: Ajustes) {
  let contents = p.contents;
  if (a.sistemaNaMensagem) {
    const [primeira, ...resto] = contents;
    const regras = { text: `${p.system}${a.semJson && p.json ? `\n\nResponda só com um JSON válido neste formato (JSON Schema): ${JSON.stringify(p.json)}` : ''}\n\n---\n\n` };
    contents = primeira ? [{ ...primeira, parts: [regras, ...primeira.parts] }, ...resto] : [{ role: 'user', parts: [regras] }];
  }
  const json = p.json && !a.semJson ? { responseMimeType: 'application/json', responseJsonSchema: p.json } : {};
  return {
    ...(a.sistemaNaMensagem ? {} : { systemInstruction: { parts: [{ text: p.json && a.semJson ? `${p.system}\n\nResponda só com um JSON válido neste formato (JSON Schema): ${JSON.stringify(p.json)}` : p.system }] } }),
    contents,
    ...(p.ferramentas?.length ? { tools: [{ functionDeclarations: p.ferramentas }] } : {}),
    generationConfig: {
      temperature: p.temperatura ?? 0.3, maxOutputTokens: p.maxTokens ?? 1024, ...json,
      ...(a.semNivel ? {} : { thinkingConfig: { thinkingLevel: 'minimal' } }),
    },
  };
}

/** POST with the retries and backups above. Other errors come back as ErroGoogle. */
async function enviar(modelo: string, metodo: string, p: Pedido): Promise<Response> {
  let ultimo = new ErroGoogle(503, 'sem resposta');
  const modelos = cadeia(modelo);
  for (const [i, m] of modelos.entries()) {
    const a: Ajustes = { sistemaNaMensagem: false, semJson: false, semNivel: false };
    // The last model waits longer: better a slow answer than none.
    const limite = i === modelos.length - 1 ? TEMPO_MAX_MS() * 3 : TEMPO_MAX_MS();
    for (let tentativa = 0; tentativa < 6; tentativa++) {
      const t0 = Date.now();
      const c = new AbortController();
      const relogio = setTimeout(() => c.abort(), limite);
      let r: Response;
      try {
        // Only waiting for the answer to start counts (a stream keeps reading after this).
        r = await fetch(`${BASE}/models/${m}:${metodo}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': chave() },
          body: JSON.stringify(corpo(p, a)),
          signal: c.signal,
        });
      } catch (e) {
        if (!c.signal.aborted) throw e;
        if (Deno.env.get('LLM_DEBUG')) console.log(`google: ${m} demorou mais de ${limite} ms`);
        ultimo = new ErroGoogle(504, `${m}: demorou mais de ${limite} ms`);
        break;
      } finally {
        clearTimeout(relogio);
      }
      if (Deno.env.get('LLM_DEBUG')) console.log(`google: ${m} ${r.status} ${Date.now() - t0} ms`);
      if (r.ok) return r;
      const erro = (await r.text()).slice(0, 600);
      ultimo = new ErroGoogle(r.status, `${m}: ${erro}`);
      if (r.status === 400 && !a.semNivel && /thinking/i.test(erro)) { a.semNivel = true; continue; }
      if (r.status === 400 && !a.sistemaNaMensagem && /instruction|system/i.test(erro)) { a.sistemaNaMensagem = true; continue; }
      if (r.status === 400 && p.json && !a.semJson && /json|mime|schema/i.test(erro)) { a.semJson = true; continue; }
      // Busy (503/500): twice more on the same model, then the next one. Limit reached (429): next one.
      if ((r.status === 503 || r.status === 500) && tentativa < 2) { await esperar(400 * (tentativa + 1)); continue; }
      if (r.status === 503 || r.status === 500 || r.status === 429 || r.status === 404) break;
      throw ultimo;
    }
  }
  throw ultimo;
}

/** One answer: the parts (text, tool calls) and why it ended. */
export async function gerar(modelo: string, p: Pedido): Promise<{ partes: Parte[]; fim: string }> {
  const j = await (await enviar(modelo, 'generateContent', p)).json() as {
    candidates?: { content?: { parts?: Parte[] }; finishReason?: string }[];
    promptFeedback?: { blockReason?: string };
  };
  const c = j.candidates?.[0];
  return { partes: c?.content?.parts ?? [], fim: c?.finishReason ?? j.promptFeedback?.blockReason ?? 'SEM_RESPOSTA' };
}

/** Visible text of the parts (no thinking). */
// Gemma sometimes leaves the bare word "thought" (its thinking channel's name) before the answer.
export const textoDe = (partes: Parte[]) =>
  partes.filter((x) => typeof x.text === 'string' && !x.thought).map((x) => x.text).join('').replace(/^\s*thought\b\s*/i, '').trim();

/** JSON inside a text that may come wrapped in ```json fences or with words around it. */
export function lerJSON(texto: string): unknown {
  const limpo = texto.replace(/^```(?:json)?\s*|\s*```$/g, '').trim();
  try {
    return JSON.parse(limpo);
  } catch {
    const ini = limpo.search(/[{[]/);
    const fim = Math.max(limpo.lastIndexOf('}'), limpo.lastIndexOf(']'));
    if (ini < 0 || fim <= ini) return null;
    try {
      return JSON.parse(limpo.slice(ini, fim + 1));
    } catch {
      return null;
    }
  }
}

/** Streams the visible text (SSE). */
export async function* gerarStream(modelo: string, p: Pedido): AsyncGenerator<string> {
  const r = await enviar(modelo, 'streamGenerateContent?alt=sse', p);
  const leitor = r.body!.pipeThrough(new TextDecoderStream()).getReader();
  let resto = '';
  const ler = function* (linha: string) {
    if (!linha.startsWith('data:')) return;
    try {
      const j = JSON.parse(linha.slice(5)) as { candidates?: { content?: { parts?: Parte[] } }[] };
      for (const parte of j.candidates?.[0]?.content?.parts ?? []) if (parte.text && !parte.thought) yield parte.text;
    } catch {
      // a broken line: skip it
    }
  };
  for (;;) {
    const { value, done } = await leitor.read();
    if (done) break;
    resto += value;
    const linhas = resto.split('\n');
    resto = linhas.pop() ?? '';
    for (const l of linhas) yield* ler(l.trim());
  }
  yield* ler(resto.trim());
}

/** Tool list in the Gemini format: no "parameters" when the tool takes none. */
export function declaracoes(ferramentas: { name: string; description: string; parameters: { properties?: Record<string, unknown> } }[]): Declaracao[] {
  return ferramentas.map((f) => ({
    name: f.name,
    description: f.description,
    ...(f.parameters.properties && Object.keys(f.parameters.properties).length ? { parameters: f.parameters } : {}),
  }));
}

/**
 * The tool loop: the model calls tools, `executar` runs them (through the
 * database), the results go back, until it answers with text.
 * Returns the final text, or null if it did not finish.
 */
export async function rodarComFerramentas(o: {
  modelo: string;
  system: string;
  contents: Conteudo[];
  ferramentas: Declaracao[];
  executar: (nome: string, args: Record<string, unknown>) => Promise<string>;
  voltas?: number;
  maxTokens?: number;
}): Promise<string | null> {
  const contents = [...o.contents];
  for (let volta = 0; volta < (o.voltas ?? 6); volta++) {
    const r = await gerar(o.modelo, { system: o.system, contents, ferramentas: o.ferramentas, maxTokens: o.maxTokens ?? 600 });
    const chamadas = r.partes.filter((x) => x.functionCall);
    if (!chamadas.length) {
      if (r.fim !== 'STOP' && r.fim !== 'MAX_TOKENS') console.warn('google: resposta sem fim normal', r.fim);
      return textoDe(r.partes) || null;
    }
    // The model's turn goes back as it came (thought signatures included).
    contents.push({ role: 'model', parts: r.partes });
    const respostas: Parte[] = [];
    for (const c of chamadas) {
      const { id, name, args } = c.functionCall!;
      const resultado = await o.executar(name, args ?? {});
      respostas.push({ functionResponse: { ...(id ? { id } : {}), name, response: { resultado } } });
    }
    contents.push({ role: 'user', parts: respostas });
  }
  return null;
}
