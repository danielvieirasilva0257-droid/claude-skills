// Client names never go to the LLM: "Rafael Souza" becomes "Cliente 1" on the
// way out and goes back to the first name only on the barber's screen.
export type ClienteNome = { id: string; nome: string };

const letra = '\\p{L}';
const escapar = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function criarAnonimizador(clientes: ClienteNome[]) {
  const ordenados = [...clientes].sort((a, b) => a.id.localeCompare(b.id));
  const trocas: { re: RegExp; marcador: string }[] = [];
  const nomePorMarcador = new Map<string, string>();
  ordenados.forEach((c, i) => {
    const marcador = `Cliente ${i + 1}`;
    const primeiro = c.nome.trim().split(/\s+/)[0] ?? c.nome;
    nomePorMarcador.set(marcador, primeiro);
    for (const termo of [c.nome.trim(), primeiro]) {
      if (termo.length < 3) continue;
      trocas.push({ re: new RegExp(`(?<!${letra})${escapar(termo)}(?!${letra})`, 'giu'), marcador });
    }
  });
  // Full names first, then first names.
  trocas.sort((a, b) => b.re.source.length - a.re.source.length);

  return {
    anonimizar(texto: string): string {
      return trocas.reduce((t, { re, marcador }) => t.replace(re, marcador), texto);
    },
    revelar(texto: string): string {
      return texto.replace(/Cliente (\d+)/g, (m) => nomePorMarcador.get(m) ?? m);
    },
  };
}

/** Index where streamed text can be cut without splitting a "Cliente N" marker. */
export function pontoSeguro(texto: string, reserva = 12): number {
  for (let i = texto.length - reserva; i > 0; i--) {
    if (/\s/.test(texto[i]!) && !/Cliente$/i.test(texto.slice(0, i)) && !/Cliente \d*$/i.test(texto.slice(0, i))) return i;
  }
  return 0;
}
