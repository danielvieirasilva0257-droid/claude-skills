// Cuts the AI's text into pieces for the voice while it is being written, so
// the voice starts before the answer is complete. Daniel (22/11/2026): the
// voice starts as soon as the first 5 words are written. After that, the
// pieces follow the sentences (a whole sentence sounds natural); a long
// sentence is cut at a comma or every 15 words so the voice never waits long.
// Only complete words count (a word is complete when a space follows it), so a
// number still arriving ("R$ 7.4" + "66,39") is never cut, and a piece never
// ends on "R$" or "Cliente" (the phone brain splits before names come back).
// Pure function, tested in Jest.

const FIM = /[.!?…]+["')\]]*(?=\s)|\n+/g;
const PALAVRA = /\S+\s+/g;

export type OpcoesDivisor = { primeiras?: number; maxPalavras?: number };

export function criarDivisorDeFrases(onFrase: (frase: string) => void, opcoes: OpcoesDivisor = {}) {
  const primeiras = opcoes.primeiras ?? 5;
  const maxPalavras = opcoes.maxPalavras ?? 15;
  let buffer = '';
  let primeira = true;
  const emitir = (t: string) => {
    const f = t.trim();
    if (!f) return;
    primeira = false;
    onFrase(f);
  };
  /** Index right after the n-th complete word (never ending on "R$"), or -1. */
  const depoisDe = (n: number): number => {
    PALAVRA.lastIndex = 0;
    let m: RegExpExecArray | null;
    let conta = 0;
    while ((m = PALAVRA.exec(buffer))) {
      conta++;
      // Never end on "R$" (the value comes next) or on "Cliente" (its number comes next: "Cliente 12").
      if (conta >= n && !/^(R\$|cliente)$/i.test(m[0].trim())) return m.index + m[0].length;
    }
    return -1;
  };
  return {
    empurrar(texto: string) {
      buffer += texto;
      // 1. Every complete sentence goes out, one by one.
      let corte = -1;
      FIM.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = FIM.exec(buffer))) corte = m.index + m[0].length;
      if (corte > 0) {
        const pronto = buffer.slice(0, corte);
        buffer = buffer.slice(corte);
        let inicio = 0;
        FIM.lastIndex = 0;
        while ((m = FIM.exec(pronto))) { emitir(pronto.slice(inicio, m.index + m[0].length)); inicio = m.index + m[0].length; }
        emitir(pronto.slice(inicio));
      }
      // 2. The start of the answer: the voice begins after the first words.
      if (primeira) {
        const c = depoisDe(primeiras);
        if (c > 0) { emitir(buffer.slice(0, c)); buffer = buffer.slice(c); }
        return;
      }
      // 3. A long sentence: cut at a comma after a few words, or after maxPalavras words.
      const virgula = buffer.search(/,\s/);
      if (virgula > 0 && depoisDe(primeiras) > 0 && depoisDe(primeiras) <= virgula + 2) {
        emitir(buffer.slice(0, virgula + 1));
        buffer = buffer.slice(virgula + 1);
        return;
      }
      const c = depoisDe(maxPalavras);
      if (c > 0) { emitir(buffer.slice(0, c)); buffer = buffer.slice(c); }
    },
    terminar() {
      emitir(buffer);
      buffer = '';
    },
  };
}
