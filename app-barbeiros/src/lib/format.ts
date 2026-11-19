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
