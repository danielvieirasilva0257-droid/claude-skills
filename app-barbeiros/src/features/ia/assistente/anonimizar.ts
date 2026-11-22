// "Cliente N" on the phone, the same numbering as the server (clients sorted
// by id): names go to the model as "Cliente 2" and come back as the first
// name only on the screen and in the voice. Same rule as the cloud AI, even
// though Gemma runs on the phone. Letter class written out (no lookbehind or
// \p{L}) to run the same on every JavaScript engine.
export type ClienteNome = { id: string; nome: string };

const LETRA = 'A-Za-zÀ-ÖØ-öø-ÿ';
const escapar = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function criarAnonimizador(clientes: ClienteNome[]) {
  const ordenados = [...clientes].sort((a, b) => a.id.localeCompare(b.id));
  const trocas: { re: RegExp; marcador: string; tamanho: number }[] = [];
  const nomePorMarcador = new Map<string, string>();
  ordenados.forEach((c, i) => {
    const marcador = `Cliente ${i + 1}`;
    const primeiro = c.nome.trim().split(/\s+/)[0] ?? c.nome;
    nomePorMarcador.set(marcador, primeiro);
    for (const termo of [c.nome.trim(), primeiro]) {
      if (termo.length < 3) continue;
      trocas.push({ re: new RegExp(`(^|[^${LETRA}])${escapar(termo)}(?![${LETRA}])`, 'gi'), marcador, tamanho: termo.length });
    }
  });
  // Full names first, then first names.
  trocas.sort((a, b) => b.tamanho - a.tamanho);
  return {
    anonimizar(texto: string): string {
      return trocas.reduce((t, { re, marcador }) => t.replace(re, (_m, antes: string) => `${antes}${marcador}`), texto);
    },
    revelar(texto: string): string {
      return texto.replace(/Cliente (\d+)/g, (m) => nomePorMarcador.get(m) ?? m);
    },
  };
}
