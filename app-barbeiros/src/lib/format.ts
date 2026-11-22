// Formatting only. The database does the math (numeric(10,2)); the app never
// sums money on screen. Values from Postgres `numeric` arrive as strings or
// numbers, so every formatter accepts both.

export const FUSO = 'America/Sao_Paulo';

type Numeric = number | string | null | undefined;

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const porcento = new Intl.NumberFormat('pt-BR', { style: 'percent', maximumFractionDigits: 1 });
const inteiro = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 });

function toNumber(value: Numeric): number | null {
  if (value === null || value === undefined || value === '') return null;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

/** R$ 1.234,50 · "—" when there is no value. */
export function formatMoeda(value: Numeric): string {
  const n = toNumber(value);
  return n === null ? '—' : moeda.format(n);
}

/** 0.333 → "33,3%" (the database stores rates as fractions). */
export function formatPorcentagem(value: Numeric): string {
  const n = toNumber(value);
  return n === null ? '—' : porcento.format(n);
}

/** 1234 → "1.234". */
export function formatInteiro(value: Numeric): string {
  const n = toNumber(value);
  return n === null ? '—' : inteiro.format(n);
}

/** 1.5 → "1,5" (ratio, produtos por cliente). */
export function formatDecimal(value: Numeric): string {
  const n = toNumber(value);
  return n === null ? '—' : decimal.format(n);
}

/** First day of the month in the barber's time zone, as the views use it: "2026-11-01". */
export function inicioDoMes(date: Date = new Date(), timeZone: string = FUSO): string {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit' })
    .formatToParts(date);
  const year = parts.find((p) => p.type === 'year')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;
  return `${year}-${month}-01`;
}

/** "2026-11-01" → "novembro de 2026". */
export function formatMes(mes: string): string {
  const [year, month] = mes.split('-').map(Number);
  if (!year || !month) return mes;
  // Noon UTC avoids the date jumping to the previous month in any time zone.
  const date = new Date(Date.UTC(year, month - 1, 1, 12));
  return new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
}

const MESES_CURTOS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

/** "2026-08-01" → "ago". */
export function formatMesCurto(mes: string): string {
  const month = Number(mes.split('-')[1]);
  return MESES_CURTOS[month - 1] ?? mes;
}

/** Short money for chart labels: 7105.57 → "R$ 7,1 mil" · 850 → "R$ 850". */
export function formatMoedaCurta(value: Numeric): string {
  const n = toNumber(value);
  if (n === null) return '—';
  if (Math.abs(n) < 1000) return `R$ ${inteiro.format(n)}`;
  return `R$ ${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(n / 1000)} mil`;
}

/** "2026-11-19" for a date in the barber's time zone. */
export function diaISO(date: Date = new Date(), timeZone: string = FUSO): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

/** "2026-11-19" + 1 → "2026-11-20" (calendar math, no time zone involved). */
export function somarDias(iso: string, dias: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const data = new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, (d ?? 1) + dias, 12));
  return data.toISOString().slice(0, 10);
}

/** "14:30" in the barber's time zone. */
export function formatHora(valor: string | Date, timeZone: string = FUSO): string {
  const data = typeof valor === 'string' ? new Date(valor) : valor;
  return new Intl.DateTimeFormat('pt-BR', { timeZone, hour: '2-digit', minute: '2-digit' }).format(data);
}

/** "2026-11-19" → "quinta, 19 de novembro". */
export function formatDiaLongo(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const data = new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1, 12));
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
    .format(data)
    .replace('-feira', '');
}

/** ISO timestamp for "day at HH:MM" in São Paulo (fixed −03:00; Brazil has no DST since 2019). */
export function horarioEm(dia: string, hhmm: string): string {
  return `${dia}T${hhmm}:00-03:00`;
}

/** Hidden money for the "eye" toggle. */
export const VALOR_OCULTO = 'R$ •••••';
