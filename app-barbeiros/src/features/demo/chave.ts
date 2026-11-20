// Demo mode: request keys and date handling, shared by the app (fetchDemo)
// and by the recorder (scripts/gravar-demo.mjs runs it with Node's type
// stripping, so this file has no imports and no TypeScript-only syntax).
//
// Dates in a request are written relative to "today" (D-3, M-1…), so a
// recording made on one day answers the same question asked on another day.
// Dates in a response are shifted by the days that passed since recording
// (first-of-month dates by whole months), so "today" stays today.

const DATA_HORA = /(\d{4})-(\d{2})-(\d{2})(T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?)?/g;
const DIA_MS = 86_400_000;

function utc(a: number, m: number, d: number): number {
  return Date.UTC(a, m - 1, d);
}

function iso(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

/** "2026-11-20" → its UTC midnight in ms. */
export function diaMs(dia: string): number {
  const [a, m, d] = dia.split('-').map(Number);
  return utc(a ?? 1970, m ?? 1, d ?? 1);
}

/** Write each date relative to today: first of a month as months (M-1), others as days (D-3). */
export function datasRelativas(texto: string, hoje: string): string {
  const [ha, hm] = hoje.split('-').map(Number);
  const hojeMs = diaMs(hoje);
  // A time of day (e.g. "now" in a query) is dropped: the key keeps only the day.
  return texto.replace(DATA_HORA, (_t, a: string, m: string, d: string, hora: string | undefined) => {
    const sufixo = hora ? 'T*' : '';
    if (d === '01' && !hora) return `{M${(Number(a) - (ha ?? 0)) * 12 + (Number(m) - (hm ?? 0))}}`;
    return `{D${Math.round((utc(Number(a), Number(m), Number(d)) - hojeMs) / DIA_MS)}}${sufixo}`;
  });
}

/** Shift the dates of a recorded answer from the recording day to today. */
export function deslocarDatas(texto: string, gravadoEm: string, hoje: string): string {
  const dias = Math.round((diaMs(hoje) - diaMs(gravadoEm)) / DIA_MS);
  if (dias === 0) return texto;
  const [ga, gm] = gravadoEm.split('-').map(Number);
  const [ha, hm] = hoje.split('-').map(Number);
  const meses = ((ha ?? 0) - (ga ?? 0)) * 12 + ((hm ?? 0) - (gm ?? 0));
  return texto.replace(DATA_HORA, (_t, a: string, m: string, d: string, resto: string | undefined) => {
    if (d === '01' && !resto) {
      const total = Number(a) * 12 + (Number(m) - 1) + meses;
      return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, '0')}-01`;
    }
    return iso(utc(Number(a), Number(m), Number(d)) + dias * DIA_MS) + (resto ?? '');
  });
}

/** Stable key for a request: method, path, sorted query and body, dates relative to today. */
export function chaveDaRequisicao(metodo: string, url: string, corpo: string | null | undefined, hoje: string): string {
  const u = new URL(url);
  const busca = [...u.searchParams.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}=${v}`).join('&');
  let corpoNormal = corpo ?? '';
  if (corpoNormal) {
    try {
      corpoNormal = JSON.stringify(ordenar(JSON.parse(corpoNormal)));
    } catch {
      // not JSON: keep as is
    }
  }
  return datasRelativas(`${metodo.toUpperCase()} ${u.pathname}?${busca} ${corpoNormal}`, hoje);
}

function ordenar(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(ordenar);
  if (v && typeof v === 'object') {
    return Object.fromEntries(Object.entries(v as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([k, x]) => [k, ordenar(x)]));
  }
  return v;
}

/** Today in Brasília (yyyy-mm-dd). */
export function hojeBrasilia(agora: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(agora);
}
