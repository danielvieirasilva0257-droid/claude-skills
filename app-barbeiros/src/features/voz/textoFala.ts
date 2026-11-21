// Text written for the screen -> text the voice reads well. Supertonic reads
// letter by letter, so "R$ 7.466,39" came out as nonsense: money, percent,
// times, dates and numbers are written out in Brazilian Portuguese first.
// Pure function (no native code): used by the phone voice and tested in Jest.

const UNIDADES = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez',
  'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
const DEZENAS = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
const CENTENAS = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

type Genero = 'm' | 'f';

function feminino(t: string): string {
  return t.replace(/\bum$/, 'uma').replace(/\bdois$/, 'duas').replace(/entos\b/g, 'entas');
}

function ate999(n: number, genero: Genero = 'm'): string {
  if (n === 100) return 'cem';
  const c = Math.floor(n / 100);
  const r = n % 100;
  const partes: string[] = [];
  if (c) partes.push(CENTENAS[c]!);
  if (r) {
    if (r < 20) partes.push(UNIDADES[r]!);
    else {
      const d = Math.floor(r / 10);
      const u = r % 10;
      partes.push(u ? `${DEZENAS[d]} e ${UNIDADES[u]}` : DEZENAS[d]!);
    }
  }
  const texto = partes.join(' e ');
  return genero === 'f' ? feminino(texto) : texto;
}

/** 7466 -> "sete mil quatrocentos e sessenta e seis" (feminine: "duas", "uma"). */
export function porExtenso(n: number, genero: Genero = 'm'): string {
  if (!Number.isFinite(n) || n < 0 || n >= 1e12 || !Number.isInteger(n)) return String(n);
  if (n === 0) return 'zero';
  const grupos: [number, string, string][] = [
    [Math.floor(n / 1e9) % 1000, 'bilhão', 'bilhões'],
    [Math.floor(n / 1e6) % 1000, 'milhão', 'milhões'],
    [Math.floor(n / 1e3) % 1000, 'mil', 'mil'],
    [n % 1000, '', ''],
  ];
  const partes: { texto: string; valor: number }[] = [];
  for (const [valor, um, varios] of grupos) {
    if (!valor) continue;
    if (um === 'mil') partes.push({ texto: valor === 1 ? 'mil' : `${ate999(valor, genero)} mil`, valor });
    else if (um) partes.push({ texto: `${ate999(valor)} ${valor === 1 ? um : varios}`, valor });
    else partes.push({ texto: ate999(valor, genero), valor });
  }
  // "mil e quinhentos", "dois mil e cinquenta", but "sete mil quatrocentos e sessenta e seis".
  return partes.map((p, i) => {
    if (i === 0) return p.texto;
    const ultimo = i === partes.length - 1;
    return (ultimo && (p.valor < 100 || p.valor % 100 === 0) ? ' e ' : ' ') + p.texto;
  }).join('');
}

const inteiro = (s: string) => Number(s.replace(/\./g, ''));

function digitos(s: string): string {
  // "08" -> "zero oito"; "5" -> "cinco"; "25" -> "vinte e cinco"
  return s.startsWith('0') ? s.split('').map((d) => UNIDADES[Number(d)]).join(' ') : porExtenso(Number(s));
}

function dinheiro(reais: number, centavos: number): string {
  const r = reais === 1 ? 'um real' : reais >= 1e6 && reais % 1e6 === 0 ? `${porExtenso(reais)} de reais` : `${porExtenso(reais)} reais`;
  if (!centavos) return r;
  const c = centavos === 1 ? 'um centavo' : `${porExtenso(centavos)} centavos`;
  return reais ? `${r} e ${c}` : c;
}

function hora(h: number, m: number): string {
  if (!m) return `${porExtenso(h, 'f')} ${h === 1 ? 'hora' : 'horas'}`;
  return `${porExtenso(h, 'f')} e ${porExtenso(m)}`;
}

/** Text for the voice: numbers written out, symbols the voice would spell removed. */
export function textoParaFala(texto: string): string {
  let t = texto
    .replace(/[*_#`>]+/g, ' ')                  // markdown
    .replace(/\(s\)/g, 's')                     // "atendimento(s)"
    .replace(/\s*[·•|]\s*/g, ', ');

  // R$ 7.466,39 · R$45 · R$ 0,50
  t = t.replace(/R\$\s?(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d{1,2}))?/g, (_m, r: string, c?: string) =>
    dinheiro(inteiro(r), c ? Number(c.padEnd(2, '0')) : 0));
  // 8,2% · 9 %
  t = t.replace(/(\d+)(?:,(\d+))?\s?%/g, (_m, i: string, d?: string) =>
    `${porExtenso(Number(i))}${d ? ` vírgula ${digitos(d)}` : ''} por cento`);
  // 22/11 · 1/12/2026
  t = t.replace(/\b([0-3]?\d)\/([01]?\d)(?:\/(\d{4}))?\b/g, (m, d: string, mes: string, ano?: string) => {
    const dia = Number(d);
    const nome = MESES[Number(mes) - 1];
    if (!nome || dia < 1 || dia > 31) return m;
    return `${dia === 1 ? 'primeiro' : porExtenso(dia)} de ${nome}${ano ? ` de ${porExtenso(Number(ano))}` : ''}`;
  });
  // 18:30 · 10h30 · 10:00 · 10h
  t = t.replace(/\b([01]?\d|2[0-3])(?::|h)([0-5]\d)\b/g, (_m, h: string, m: string) => hora(Number(h), Number(m)));
  t = t.replace(/\b([01]?\d|2[0-3])h\b/g, (_m, h: string) => hora(Number(h), 0));
  // 3,08 (decimal) · 7.466 (thousands) · 37
  t = t.replace(/\b(\d+),(\d+)\b/g, (_m, i: string, d: string) => `${porExtenso(Number(i))} vírgula ${digitos(d)}`);
  t = t.replace(/\b\d{1,3}(?:\.\d{3})+\b/g, (m) => porExtenso(inteiro(m)));
  t = t.replace(/\b\d+\b/g, (m) => (m.length > 9 ? m.split('').map((d) => UNIDADES[Number(d)]).join(' ') : porExtenso(Number(m))));

  return t
    .replace(/R\$/g, 'reais')
    .replace(/%/g, ' por cento')
    .replace(/\s*&\s*/g, ' e ')
    .replace(/\s+([,.!?;:])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}
