// LLM provider. LLM_PROVIDER = "google" (Google AI Studio: Gemma 4 for free,
// the cloud choice of 22/11/2026), "anthropic" (official SDK) or "mock"
// (deterministic text built from the database numbers; for development and
// tests, costs nothing). LLM_MODEL defaults to gemma-4-26b-a4b-it (google) or
// claude-opus-5-5 (anthropic).
import { Anthropic, z, zodOutputFormat } from './deps.ts';
import { ErroGoogle, gerar, gerarStream, lerJSON, MODELO_GOOGLE, textoDe } from './google.ts';

export type Mensagem = { role: 'user' | 'assistant'; content: string };
type Esforco = 'low' | 'medium' | 'high';

export const provedor = () => Deno.env.get('LLM_PROVIDER') ?? 'mock';
export const modelo = () => Deno.env.get('LLM_MODEL') || (provedor() === 'google' ? MODELO_GOOGLE : 'claude-opus-5-5');

/** JSON Schema of a zod schema, without the "$schema" key the Gemini API does not take. */
function esquema(schema: z.ZodType): Record<string, unknown> {
  const { $schema: _s, ...resto } = z.toJSONSchema(schema) as Record<string, unknown>;
  return resto;
}

let cliente: Anthropic | null = null;
function anthropic(): Anthropic {
  // LLM_API_KEY (secret of the function); the SDK falls back to ANTHROPIC_API_KEY.
  cliente ??= new Anthropic({ apiKey: Deno.env.get('LLM_API_KEY') || undefined });
  return cliente;
}

// Server-side fallback on a policy decline (opt-in, recommended for this model family).
function fallback() {
  return { betas: ['server-side-fallback-2026-07-01'] as Anthropic.Beta.AnthropicBeta[], fallbacks: 'default' as const };
}

/** Structured output validated by `schema`. Returns null when anything is off. */
export async function gerarJSON<S extends z.ZodType>(
  schema: S,
  system: string,
  entrada: unknown,
  opcoes: { esforco?: Esforco; mock: () => unknown },
): Promise<z.infer<S> | null> {
  if (provedor() === 'mock') {
    const r = schema.safeParse(opcoes.mock());
    return r.success ? r.data : null;
  }
  if (provedor() === 'google') {
    try {
      const r = await gerar(modelo(), {
        system, contents: [{ role: 'user', parts: [{ text: JSON.stringify(entrada) }] }], json: esquema(schema), maxTokens: 4096,
      });
      const v = schema.safeParse(lerJSON(textoDe(r.partes)));
      if (!v.success) console.warn('llm: saída fora do formato', r.fim, v.error.message);
      return v.success ? v.data : null;
    } catch (e) {
      if (e instanceof ErroGoogle) { console.error('llm: erro da API do Google', e.status, e.message); return null; }
      throw e;
    }
  }
  if (provedor() !== 'anthropic') throw new Error(`LLM_PROVIDER desconhecido: ${provedor()}`);
  try {
    const resposta = await anthropic().beta.messages.parse({
      model: modelo(),
      max_tokens: 16000,
      ...fallback(),
      output_config: { effort: opcoes.esforco ?? 'low', format: zodOutputFormat(schema) },
      system,
      messages: [{ role: 'user', content: JSON.stringify(entrada) }],
    });
    if (resposta.stop_reason !== 'end_turn') {
      console.warn('llm: resposta sem fim normal', resposta.stop_reason, resposta.stop_details ?? '');
      return null;
    }
    const r = schema.safeParse(resposta.parsed_output);
    if (!r.success) console.warn('llm: saída fora do formato', r.error.message);
    return r.success ? r.data : null;
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) console.error('llm: limite de uso da API', e.message);
    else if (e instanceof Anthropic.APIError) console.error('llm: erro da API', e.status, e.message);
    else throw e;
    return null;
  }
}

/** Streams plain text. */
export async function* gerarTextoStream(
  system: string,
  mensagens: Mensagem[],
  opcoes: { esforco?: Esforco; mock: () => string },
): AsyncGenerator<string> {
  if (provedor() === 'mock') {
    for (const palavra of opcoes.mock().split(/(?<=\s)/)) yield palavra;
    return;
  }
  if (provedor() === 'google') {
    try {
      yield* gerarStream(modelo(), {
        system, contents: mensagens.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })), maxTokens: 2048,
      });
    } catch (e) {
      if (!(e instanceof ErroGoogle)) throw e;
      console.error('llm: erro da API do Google', e.status, e.message);
      yield e.status === 429 ? 'A IA grátis chegou no limite de agora. Tente de novo em um minuto.' : 'A IA não respondeu agora. Tente de novo em instantes.';
    }
    return;
  }
  const stream = anthropic().beta.messages.stream({
    model: modelo(),
    max_tokens: 16000,
    ...fallback(),
    output_config: { effort: opcoes.esforco ?? 'low' },
    system,
    messages: mensagens,
  });
  for await (const evento of stream) {
    if (evento.type === 'content_block_delta' && evento.delta.type === 'text_delta') yield evento.delta.text;
  }
  const final = await stream.finalMessage();
  if (final.stop_reason === 'refusal') yield '\n\nNão consigo responder isso. Tente perguntar de outro jeito.';
}
