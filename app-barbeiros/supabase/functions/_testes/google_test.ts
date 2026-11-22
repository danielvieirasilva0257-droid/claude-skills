// Google AI Studio client (Gemma 4 in the cloud) with a fake fetch: tool loop,
// the retry without a system instruction, JSON and the SSE stream.
// Run: npm run test:funcoes (needs no database for these).
import { assert, assertEquals } from 'jsr:@std/assert@1.0.13';

import { declaracoes, gerarStream, lerJSON, rodarComFerramentas, type Conteudo } from '../_shared/google.ts';

type Corpo = { systemInstruction?: { parts: { text: string }[] }; contents: Conteudo[]; tools?: { functionDeclarations: Record<string, unknown>[] }[] };

function falsoFetch(respostas: ((corpo: Corpo, url: string) => Response)[]) {
  const pedidos: { url: string; corpo: Corpo; chave: string | null }[] = [];
  const original = globalThis.fetch;
  globalThis.fetch = ((url: string, init: RequestInit) => {
    const corpo = JSON.parse(String(init.body)) as Corpo;
    pedidos.push({ url, corpo, chave: new Headers(init.headers).get('x-goog-api-key') });
    const proxima = respostas.shift();
    if (!proxima) throw new Error('pedido a mais');
    return Promise.resolve(proxima(corpo, url));
  }) as typeof fetch;
  return { pedidos, restaurar: () => { globalThis.fetch = original; } };
}
const ok = (j: unknown) => new Response(JSON.stringify(j), { status: 200 });

Deno.test('ferramentas: chama, recebe o resultado e responde', async () => {
  Deno.env.set('LLM_API_KEY', 'chave-teste');
  const f = falsoFetch([
    () => ok({ candidates: [{ content: { role: 'model', parts: [{ functionCall: { id: 'c1', name: 'resumo_do_dia', args: { dia: null } }, thoughtSignature: 'sig' }] }, finishReason: 'STOP' }] }),
    () => ok({ candidates: [{ content: { role: 'model', parts: [{ text: 'Hoje você fez ', thought: false }, { text: 'R$ 450,00.' }] }, finishReason: 'STOP' }] }),
  ]);
  try {
    const executadas: [string, Record<string, unknown>][] = [];
    const texto = await rodarComFerramentas({
      modelo: 'gemma-4-26b-a4b-it', system: 'Regras', contents: [{ role: 'user', parts: [{ text: 'Quanto fiz hoje?' }] }],
      ferramentas: declaracoes([{ name: 'resumo_do_dia', description: 'x', parameters: { properties: { dia: {} } } }, { name: 'listar_servicos', description: 'y', parameters: { properties: {} } }]),
      executar: (nome, args) => { executadas.push([nome, args]); return Promise.resolve('{"faturamento":450}'); },
    });
    assertEquals(texto, 'Hoje você fez R$ 450,00.');
    assertEquals(executadas, [['resumo_do_dia', { dia: null }]]);
    assert(f.pedidos[0]!.url.endsWith('/models/gemma-4-26b-a4b-it:generateContent'));
    assertEquals(f.pedidos[0]!.chave, 'chave-teste');
    assertEquals(f.pedidos[0]!.corpo.systemInstruction?.parts[0]?.text, 'Regras');
    // A tool with no fields goes without "parameters".
    assertEquals(f.pedidos[0]!.corpo.tools?.[0]?.functionDeclarations, [{ name: 'resumo_do_dia', description: 'x', parameters: { properties: { dia: {} } } }, { name: 'listar_servicos', description: 'y' }]);
    // The second request carries the call (with its signature) and the result.
    const c = f.pedidos[1]!.corpo.contents;
    assertEquals(c[1], { role: 'model', parts: [{ functionCall: { id: 'c1', name: 'resumo_do_dia', args: { dia: null } }, thoughtSignature: 'sig' }] });
    assertEquals(c[2], { role: 'user', parts: [{ functionResponse: { id: 'c1', name: 'resumo_do_dia', response: { resultado: '{"faturamento":450}' } } }] });
  } finally {
    f.restaurar();
  }
});

Deno.test('modelo que não aceita instrução de sistema: as regras vão no começo da mensagem', async () => {
  const f = falsoFetch([
    () => new Response(JSON.stringify({ error: { code: 400, message: 'Developer instruction is not enabled for models/gemma' } }), { status: 400 }),
    () => ok({ candidates: [{ content: { parts: [{ text: 'Oi!' }] }, finishReason: 'STOP' }] }),
  ]);
  try {
    const texto = await rodarComFerramentas({ modelo: 'm', system: 'Regras', contents: [{ role: 'user', parts: [{ text: 'Oi' }] }], ferramentas: [], executar: () => Promise.resolve('') });
    assertEquals(texto, 'Oi!');
    assertEquals(f.pedidos[1]!.corpo.systemInstruction, undefined);
    assertEquals(f.pedidos[1]!.corpo.contents[0]!.parts.map((p) => p.text), ['Regras\n\n---\n\n', 'Oi']);
  } finally {
    f.restaurar();
  }
});

Deno.test('JSON com cercas ou palavras em volta', () => {
  assertEquals(lerJSON('```json\n{"a":1}\n```'), { a: 1 });
  assertEquals(lerJSON('Aqui está: {"a":[1,2]} pronto'), { a: [1, 2] });
  assertEquals(lerJSON('nada'), null);
});

Deno.test('stream: só o texto visível, linha por linha', async () => {
  const sse = [
    'data: {"candidates":[{"content":{"parts":[{"text":"pensando","thought":true}]}}]}',
    'data: {"candidates":[{"content":{"parts":[{"text":"Bom "}]}}]}',
    'data: {"candidates":[{"content":{"parts":[{"text":"dia!"}]}}]}',
  ].join('\n\n');
  const f = falsoFetch([() => new Response(sse, { status: 200 })]);
  try {
    const partes: string[] = [];
    for await (const p of gerarStream('m', { system: 'R', contents: [{ role: 'user', parts: [{ text: 'Oi' }] }] })) partes.push(p);
    assertEquals(partes, ['Bom ', 'dia!']);
    assert(f.pedidos[0]!.url.endsWith(':streamGenerateContent?alt=sse'));
  } finally {
    f.restaurar();
  }
});

Deno.test('modelo ocupado (503): tenta de novo e depois usa a reserva', async () => {
  Deno.env.set('LLM_MODELOS_RESERVA', 'reserva-a');
  const ocupado = () => new Response(JSON.stringify({ error: { code: 503, message: 'high demand' } }), { status: 503 });
  const f = falsoFetch([ocupado, ocupado, ocupado, () => ok({ candidates: [{ content: { parts: [{ text: 'Oi!' }] }, finishReason: 'STOP' }] })]);
  try {
    const texto = await rodarComFerramentas({ modelo: 'principal', system: 'R', contents: [{ role: 'user', parts: [{ text: 'Oi' }] }], ferramentas: [], executar: () => Promise.resolve('') });
    assertEquals(texto, 'Oi!');
    assertEquals(f.pedidos.map((x) => x.url.split('/models/')[1]), ['principal:generateContent', 'principal:generateContent', 'principal:generateContent', 'reserva-a:generateContent']);
  } finally {
    f.restaurar();
    Deno.env.delete('LLM_MODELOS_RESERVA');
  }
});

Deno.test('pensa o mínimo (rápido); modelo sem esse ajuste recebe o pedido sem ele', async () => {
  const f = falsoFetch([
    () => new Response(JSON.stringify({ error: { code: 400, message: 'Thinking level is not supported for this model.' } }), { status: 400 }),
    () => ok({ candidates: [{ content: { parts: [{ text: 'Oi!' }] }, finishReason: 'STOP' }] }),
  ]);
  try {
    await rodarComFerramentas({ modelo: 'm', system: 'R', contents: [{ role: 'user', parts: [{ text: 'Oi' }] }], ferramentas: [], executar: () => Promise.resolve('') });
    const config = (c: Corpo) => (c as unknown as { generationConfig: Record<string, unknown> }).generationConfig;
    assertEquals(config(f.pedidos[0]!.corpo).thinkingConfig, { thinkingLevel: 'minimal' });
    assertEquals(config(f.pedidos[1]!.corpo).thinkingConfig, undefined);
  } finally {
    f.restaurar();
  }
});

Deno.test('modelo lento: desiste depois do tempo máximo e a reserva responde', async () => {
  Deno.env.set('LLM_TEMPO_MAX_MS', '50');
  Deno.env.set('LLM_MODELOS_RESERVA', 'rapido');
  const original = globalThis.fetch;
  const usados: string[] = [];
  globalThis.fetch = ((url: string, init: RequestInit) => {
    usados.push(url.split('/models/')[1]!);
    if (url.includes('/lento:')) {
      return new Promise((_ok, falha) => init.signal!.addEventListener('abort', () => falha(new DOMException('abortado', 'AbortError'))));
    }
    return Promise.resolve(ok({ candidates: [{ content: { parts: [{ text: 'thought Pronto.' }] }, finishReason: 'STOP' }] }));
  }) as typeof fetch;
  try {
    const texto = await rodarComFerramentas({ modelo: 'lento', system: 'R', contents: [{ role: 'user', parts: [{ text: 'Oi' }] }], ferramentas: [], executar: () => Promise.resolve('') });
    assertEquals(texto, 'Pronto.');   // and without the stray "thought"
    assertEquals(usados, ['lento:generateContent', 'rapido:generateContent']);
  } finally {
    globalThis.fetch = original;
    Deno.env.delete('LLM_TEMPO_MAX_MS');
    Deno.env.delete('LLM_MODELOS_RESERVA');
  }
});
