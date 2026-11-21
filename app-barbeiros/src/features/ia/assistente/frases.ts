// Cuts the AI's text into sentences while it is being written, so the voice
// starts on the first sentence while the model writes the next one.
// Pure function, tested in Jest.

const FIM = /[.!?…]+["')\]]*(?=\s)|\n+/g;

export function criarDivisorDeFrases(onFrase: (frase: string) => void, limite = 160) {
  let buffer = '';
  const emitir = (t: string) => { const f = t.trim(); if (f) onFrase(f); };
  return {
    empurrar(texto: string) {
      buffer += texto;
      let corte = -1;
      FIM.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = FIM.exec(buffer))) corte = m.index + m[0].length;
      if (corte > 0) {
        // Every complete sentence goes out one by one.
        const pronto = buffer.slice(0, corte);
        buffer = buffer.slice(corte);
        let inicio = 0;
        FIM.lastIndex = 0;
        while ((m = FIM.exec(pronto))) { emitir(pronto.slice(inicio, m.index + m[0].length)); inicio = m.index + m[0].length; }
        emitir(pronto.slice(inicio));
      }
      // A very long sentence: cut at the last comma so the voice does not wait too long.
      if (buffer.length > limite) {
        const virgula = buffer.lastIndexOf(', ', limite);
        if (virgula > 40) { emitir(buffer.slice(0, virgula + 1)); buffer = buffer.slice(virgula + 1); }
      }
    },
    terminar() {
      emitir(buffer);
      buffer = '';
    },
  };
}
