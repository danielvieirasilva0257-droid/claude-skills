// While a change waits for confirmation, what the barber says can confirm or
// cancel it: "sim", "pode", "confirma"… / "não", "cancela"…
export function respostaDeConfirmacao(frase: string): 'sim' | 'nao' | null {
  const t = frase.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
  if (/^(sim|pode|confirma|confirmo|isso|ok|beleza|fechado|manda|pode ser|pode sim|claro)\b/.test(t)) return 'sim';
  if (/^(nao|cancela|cancelar|deixa|esquece|para|nem)\b/.test(t)) return 'nao';
  return null;
}
