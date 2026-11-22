// Times the streamed answer of ia-agente (stream: true) with the REAL model:
// when the first tool shows up, when the first words arrive, when it ends.
// Run: LLM_PROVIDER=google LLM_API_KEY=... bash scripts/funcoes-env.sh deno run --config supabase/functions/deno.json -A supabase/functions/_dev/medir-stream.ts "pergunta"
import { createClient } from '../_shared/deps.ts';
import { handler } from '../ia-agente/handler.ts';

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { auth: { persistSession: false } });
const { data, error } = await sb.auth.signInWithPassword({ email: 'barbeiro.teste@example.com', password: 'senha-teste-123' });
if (error) throw error;
const pergunta = Deno.args[0] ?? 'Quanto eu faturei nos últimos 7 dias?';
const t0 = Date.now();
const ms = () => `${((Date.now() - t0) / 1000).toFixed(1)} s`;
const res = await handler(new Request('http://x/', {
  method: 'POST', headers: { Authorization: `Bearer ${data.session!.access_token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ mensagem: pergunta, historico: [], stream: true }),
}));
const leitor = res.body!.pipeThrough(new TextDecoderStream()).getReader();
let resto = '';
let primeiro = true;
for (;;) {
  const { value, done } = await leitor.read();
  if (done) break;
  resto += value;
  const eventos = resto.split('\n\n');
  resto = eventos.pop() ?? '';
  for (const e of eventos) {
    const m = JSON.parse(e.replace(/^data: /, '')) as { t: string; nome?: string; d?: string; texto?: string; pendente?: { resumo: string }; navegar?: string };
    if (m.t === 'ferramenta') console.log(`${ms()}  ferramenta: ${m.nome}`);
    if (m.t === 'texto') { if (primeiro) console.log(`${ms()}  primeiras palavras`); primeiro = false; console.log(`        "${m.d}"`); }
    if (m.t === 'fim') console.log(`${ms()}  fim: ${m.texto}${m.pendente ? ` [pendente: ${m.pendente.resumo}]` : ''}${m.navegar ? ` [tela: ${m.navegar}]` : ''}`);
    if (m.t === 'erro') console.log(`${ms()}  erro`);
  }
}
