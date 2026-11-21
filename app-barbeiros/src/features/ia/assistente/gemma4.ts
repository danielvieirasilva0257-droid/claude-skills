// Gemma 4 output on the phone: tool calls and what is shown and spoken.
// Pure functions (no native code), tested in Jest.
//
// Gemma 4 writes a tool call as
//   <|tool_call>call:agenda_do_dia{dia:<|"|>2026-11-22<|"|>}<tool_call|>
// (strings between <|"|>, keys without quotes, numbers, true/false, [..], {..}).
// The thinking channel is <|channel>…<channel|> (thinking is off here, but it is
// hidden anyway). Nothing of this may reach the screen or the voice.

export type ChamadaGemma = { id?: string; type: 'function'; function: { name: string; arguments: Record<string, unknown> } };

const ASPAS = '<|"|>';

/** Reads one value of Gemma 4's argument syntax starting at `i`. */
function lerValor(s: string, i: number): [unknown, number] {
  const pular = (k: number) => { while (k < s.length && /\s/.test(s[k]!)) k++; return k; };
  i = pular(i);
  if (s.startsWith(ASPAS, i)) {
    const fim = s.indexOf(ASPAS, i + ASPAS.length);
    if (fim < 0) return [s.slice(i + ASPAS.length), s.length];
    return [s.slice(i + ASPAS.length, fim), fim + ASPAS.length];
  }
  if (s[i] === '"') {
    let k = i + 1;
    let out = '';
    while (k < s.length && s[k] !== '"') { if (s[k] === '\\' && k + 1 < s.length) k++; out += s[k]; k++; }
    return [out, k + 1];
  }
  if (s[i] === '{') return lerObjeto(s, i);
  if (s[i] === '[') {
    const lista: unknown[] = [];
    let k = pular(i + 1);
    while (k < s.length && s[k] !== ']') {
      const [v, j] = lerValor(s, k);
      lista.push(v);
      k = pular(j);
      if (s[k] === ',') k = pular(k + 1);
      else if (s[k] !== ']') break;
    }
    return [lista, k + 1];
  }
  const m = /^[^,}\]]*/.exec(s.slice(i))![0];
  const bruto = m.trim();
  const fim = i + m.length;
  if (bruto === 'true') return [true, fim];
  if (bruto === 'false') return [false, fim];
  if (bruto === 'null' || bruto === 'None' || bruto === '') return [null, fim];
  const n = Number(bruto);
  return [Number.isFinite(n) ? n : bruto, fim];
}

function lerObjeto(s: string, i: number): [Record<string, unknown>, number] {
  const obj: Record<string, unknown> = {};
  let k = i + 1;
  const pular = () => { while (k < s.length && /\s/.test(s[k]!)) k++; };
  pular();
  while (k < s.length && s[k] !== '}') {
    let chave: string;
    if (s.startsWith(ASPAS, k)) {
      const fim = s.indexOf(ASPAS, k + ASPAS.length);
      chave = s.slice(k + ASPAS.length, fim);
      k = fim + ASPAS.length;
    } else if (s[k] === '"') {
      const fim = s.indexOf('"', k + 1);
      chave = s.slice(k + 1, fim);
      k = fim + 1;
    } else {
      const m = /^[A-Za-z0-9_]+/.exec(s.slice(k));
      if (!m) break;
      chave = m[0];
      k += chave.length;
    }
    pular();
    if (s[k] !== ':') break;
    const [v, j] = lerValor(s, k + 1);
    obj[chave] = v;
    k = j;
    pular();
    if (s[k] === ',') { k++; pular(); }
  }
  return [obj, k + 1];
}

/** Parser for react-native-executorch's chat session (ToolParser). */
export function lerChamadasGemma4(texto: string): { toolCalls: ChamadaGemma[]; textContent?: string } | undefined {
  const chamadas: ChamadaGemma[] = [];
  const re = /<\|tool_call>\s*call:([A-Za-z0-9_]+)\s*(\{[\s\S]*?)<tool_call\|>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(texto))) {
    const [argumentos] = m[2]!.trim().startsWith('{') ? lerObjeto(m[2]!.trim(), 0) : [{}];
    chamadas.push({ id: `chamada-${chamadas.length + 1}`, type: 'function', function: { name: m[1]!, arguments: argumentos } });
  }
  // A small model sometimes forgets the closing tag at the very end.
  if (!chamadas.length) {
    const solto = /<\|tool_call>\s*call:([A-Za-z0-9_]+)\s*(\{[\s\S]*)$/.exec(texto);
    if (solto) chamadas.push({ id: 'chamada-1', type: 'function', function: { name: solto[1]!, arguments: lerObjeto(solto[2]!, 0)[0] } });
  }
  if (!chamadas.length) return undefined;
  return { toolCalls: chamadas, textContent: textoVisivel(texto) };
}

/** Removes tool calls, thinking and special tokens: what the barber may see and hear. */
export function textoVisivel(texto: string): string {
  return texto
    .replace(/<\|tool_call>[\s\S]*?(<tool_call\|>|$)/g, ' ')
    .replace(/<\|tool_response>[\s\S]*?(<tool_response\|>|$)/g, ' ')
    .replace(/<\|channel>[\s\S]*?(<channel\|>|$)/g, ' ')
    .replace(/<\|?[a-z_"]+\|?>/g, ' ')
    .replace(/<\/?(bos|eos|s|pad)>/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

/**
 * Streaming version: tokens in, new visible text out. Holds back what could
 * still become a tag ("<|tool_c…") or a client marker ("Cliente 1" vs "Cliente 12").
 */
export function criarFiltroDeFala() {
  let bruto = '';
  let entregue = 0;
  const seguro = (t: string) => {
    // Inside an open tool call / thinking block: nothing more is safe.
    const aberto = /<\|(tool_call|tool_response|channel)>(?![\s\S]*<(tool_call|tool_response|channel)\|>)/.exec(t);
    let fim = aberto ? aberto.index : t.length;
    // A '<' that may still be the start of a tag.
    const menor = t.lastIndexOf('<', fim - 1);
    if (menor >= 0 && t.indexOf('>', menor) < 0 && fim - menor < 24) fim = menor;
    return t.slice(0, fim);
  };
  // "Cliente 1" may still become "Cliente 12": hold the marker (or its start) at the end.
  const segurarMarcador = (t: string) => t.replace(/\s*C(?:l(?:i(?:e(?:n(?:t(?:e(?:\s+\d*)?)?)?)?)?)?)?$/, '');
  return {
    empurrar(token: string): string {
      bruto += token;
      const visivel = segurarMarcador(textoVisivel(seguro(bruto)));
      if (visivel.length <= entregue) return '';
      const novo = visivel.slice(entregue);
      entregue = visivel.length;
      return novo;
    },
    terminar(): string {
      const visivel = textoVisivel(bruto);
      const novo = visivel.length > entregue ? visivel.slice(entregue) : '';
      entregue = visivel.length;
      return novo;
    },
    /** A new model turn (after a tool result) starts with a fresh buffer. */
    reiniciar() {
      bruto = '';
      entregue = 0;
    },
  };
}
