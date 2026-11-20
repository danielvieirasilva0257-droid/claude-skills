// LLM provider. LLM_PROVIDER = "anthropic" (official SDK) or "mock"
// (deterministic text built from the database numbers; for development and
// tests, costs nothing). LLM_MODEL defaults to claude-opus-5-5.
import { Anthropic, type z, zodOutputFormat } from './deps.ts';

export type Mensagem = { role: 'user' | 'assistant'; content: string };
type Esforco = 'low' | 'medium' | 'high';

export const provedor = () => Deno.env.get('LLM_PROVIDER') ?? 'mock';
export const modelo = () => Deno.env.get('LLM_MODEL') ?? 'claude-opus-5-5';

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
