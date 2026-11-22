// ia-chat: answers with the barber's numbers (already calculated), streaming
// Server-Sent Events: data: {"texto": "..."} … data: {"fim": true}.
// Client names are masked on the way out and shown back only on screen.
import { criarAnonimizador, pontoSeguro } from '../_shared/anonimizar.ts';
import { clienteAdmin, clienteDoUsuario, consumir, cors, json, usuarioId } from '../_shared/http.ts';
import { gerarTextoStream, type Mensagem } from '../_shared/llm.ts';
import { mockChat } from '../_shared/mock.ts';
import { CHAT } from '../_shared/prompts.ts';

type Pedido = { pergunta?: string; historico?: Mensagem[] };

export async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const id = await usuarioId(req);
  if (!id) return json({ ok: false, erro: 'login' }, 401);
  const { pergunta, historico = [] } = (await req.json().catch(() => ({}))) as Pedido;
  if (!pergunta || pergunta.trim().length < 2) return json({ ok: false, erro: 'pergunta' }, 400);

  const bloqueio = await consumir(clienteAdmin(), id, 'chat');
  if (bloqueio) return json({ ok: false, erro: bloqueio }, bloqueio === 'plano' ? 403 : 429);

  const db = clienteDoUsuario(req);
  const [contexto, meta, semana, clientes] = await Promise.all([
    db.rpc('contexto_ia', { p_barbeiro: id }),
    db.rpc('progresso_meta'),
    db.rpc('resumo_semana'),
    db.from('clientes').select('id, nome').eq('barbeiro_id', id),
  ]);
  const anon = criarAnonimizador(clientes.data ?? []);
  const dados = { ...(contexto.data ?? {}), meta: meta.data, semana: semana.data };
  const { base_sugestao: _ignorar, ...metaCurta } = (meta.data ?? {}) as Record<string, unknown>;
  dados.meta = metaCurta;

  const mensagens: Mensagem[] = [
    ...historico.slice(-6).map((m) => ({ role: m.role, content: anon.anonimizar(String(m.content).slice(0, 2000)) })),
    { role: 'user', content: `Dados do app (já calculados): ${JSON.stringify(dados)}\n\nPergunta: ${anon.anonimizar(pergunta.trim().slice(0, 1000))}` },
  ];

  const codificar = new TextEncoder();
  const corpo = new ReadableStream<Uint8Array>({
    async start(controle) {
      const enviar = (o: unknown) => controle.enqueue(codificar.encode(`data: ${JSON.stringify(o)}\n\n`));
      let pendente = '';
      try {
        for await (const pedaco of gerarTextoStream(CHAT, mensagens, { esforco: 'low', mock: () => mockChat(anon.anonimizar(pergunta), dados) })) {
          pendente += pedaco;
          const corte = pontoSeguro(pendente);
          if (corte > 0) {
            enviar({ texto: anon.revelar(pendente.slice(0, corte)) });
            pendente = pendente.slice(corte);
          }
        }
        if (pendente) enviar({ texto: anon.revelar(pendente) });
        enviar({ fim: true });
      } catch (e) {
        console.error('ia-chat', e);
        enviar({ erro: 'Não deu para responder agora. Tente de novo.' });
      }
      controle.close();
    },
  });
  return new Response(corpo, { headers: { ...cors, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } });
}
