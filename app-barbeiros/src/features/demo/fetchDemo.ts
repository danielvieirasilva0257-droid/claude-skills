// fetch() for demo mode: answers the Supabase client (auth, REST, RPC) and
// the Edge Functions from gravacao.json. Unknown reads come back empty and
// writes "succeed" without saving.
import { CONTAS_DEMO } from './config';
import { chaveDaRequisicao, deslocarDatas, hojeBrasilia } from './chave';
import gravacao from './gravacao.json';

type Gravada = { s: number; t?: string; r?: string; b: string };
type Gravacao = { gravadoEm: string; usuarios: Record<string, Record<string, Gravada>>; chat: Record<string, string>; agente?: Record<string, unknown> };
const G = gravacao as unknown as Gravacao;

const ANO = 365 * 24 * 3600;

function base64url(texto: string): string {
  return btoa(texto).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function jwt(id: string, email: string): string {
  const agora = Math.floor(Date.now() / 1000);
  return [
    base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' })),
    base64url(JSON.stringify({ sub: id, email, role: 'authenticated', aud: 'authenticated', iat: agora, exp: agora + ANO })),
    'demonstracao',
  ].join('.');
}

function usuario(conta: (typeof CONTAS_DEMO)[number]) {
  return {
    id: conta.id, aud: 'authenticated', role: 'authenticated', email: conta.email,
    email_confirmed_at: '2026-01-01T00:00:00Z', app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: { nome: conta.nome }, identities: [], created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z',
  };
}

function sessao(conta: (typeof CONTAS_DEMO)[number]) {
  return {
    access_token: jwt(conta.id, conta.email), token_type: 'bearer', expires_in: ANO,
    expires_at: Math.floor(Date.now() / 1000) + ANO, refresh_token: `demo-${conta.id}`, user: usuario(conta),
  };
}

function resposta(corpo: string, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(status === 204 ? null : corpo, { status, headers: { 'Content-Type': 'application/json', ...extra } });
}

function contaDoToken(cabecalho: string | null): (typeof CONTAS_DEMO)[number] | undefined {
  const token = (cabecalho ?? '').replace(/^Bearer\s+/i, '');
  const meio = token.split('.')[1];
  if (!meio) return undefined;
  try {
    const { sub } = JSON.parse(atob(meio.replace(/-/g, '+').replace(/_/g, '/'))) as { sub?: string };
    return CONTAS_DEMO.find((c) => c.id === sub);
  } catch {
    return undefined;
  }
}

function cabecalho(init: RequestInit | undefined, nome: string): string | null {
  const h = init?.headers;
  if (!h) return null;
  if (h instanceof Headers) return h.get(nome);
  if (Array.isArray(h)) return h.find(([k]) => k.toLowerCase() === nome.toLowerCase())?.[1] ?? null;
  const achado = Object.entries(h).find(([k]) => k.toLowerCase() === nome.toLowerCase());
  return achado ? String(achado[1]) : null;
}

function autenticacao(url: URL, metodo: string, corpo: string): Response {
  const caminho = url.pathname;
  if (caminho.endsWith('/token')) {
    const dados = JSON.parse(corpo || '{}') as { email?: string; refresh_token?: string };
    const conta = url.searchParams.get('grant_type') === 'refresh_token'
      ? CONTAS_DEMO.find((c) => `demo-${c.id}` === dados.refresh_token)
      : CONTAS_DEMO.find((c) => c.email === dados.email?.trim().toLowerCase());
    if (!conta) return resposta(JSON.stringify({ error: 'invalid_grant', error_description: 'Invalid login credentials' }), 400);
    return resposta(JSON.stringify(sessao(conta)));
  }
  if (caminho.endsWith('/logout')) return resposta('', 204);
  if (caminho.endsWith('/signup')) {
    return resposta(JSON.stringify({ error: 'signup_disabled', error_description: 'Na demonstração, entre com uma das contas de teste.' }), 400);
  }
  return resposta(JSON.stringify({ error: 'not_found', metodo }), 404);
}

/** Recorded chat answer for a question, or a short explanation. */
export function respostaDoChat(pergunta: string): string {
  const hoje = hojeBrasilia();
  const gravada = G.chat[pergunta.trim().toLowerCase()];
  if (gravada) return deslocarDatas(gravada, G.gravadoEm, hoje);
  const exemplo = Object.keys(G.chat)[0];
  return `Na demonstração, a IA responde às perguntas de exemplo${exemplo ? ` (como "${exemplo}")` : ''}. Com o app ligado ao servidor, ela responde qualquer pergunta com os seus números.`;
}

const normalFrase = (t: string) => t.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

/** "Fale com a IA" in the demo: recorded answers for the examples; changes are never saved. */
function agenteDemo(corpo: string): Response {
  const pedido = JSON.parse(corpo || '{}') as { mensagem?: string; confirmar?: unknown };
  if (pedido.confirmar) return resposta(JSON.stringify({ ok: true, texto: 'Pronto! Na demonstração nada é salvo de verdade.' }));
  const gravada = G.agente?.[normalFrase(pedido.mensagem ?? '')];
  if (gravada) return resposta(deslocarDatas(JSON.stringify(gravada), G.gravadoEm, hojeBrasilia()));
  return resposta(JSON.stringify({ ok: true, texto: 'Na demonstração eu respondo aos exemplos, como "quanto eu faturei hoje?" ou "marca o Bruno amanhã às 10 pra corte". Com o servidor ligado, eu entendo qualquer pedido e mexo no app.' }));
}

export async function fetchDemo(entrada: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = new URL(typeof entrada === 'string' ? entrada : entrada instanceof URL ? entrada.href : entrada.url);
  const metodo = (init?.method ?? 'GET').toUpperCase();
  const corpo = typeof init?.body === 'string' ? init.body : '';
  if (url.pathname.startsWith('/auth/v1/')) {
    if (url.pathname.endsWith('/user')) {
      const conta = contaDoToken(cabecalho(init, 'Authorization'));
      return conta ? resposta(JSON.stringify(usuario(conta))) : resposta(JSON.stringify({ error: 'not_authenticated' }), 401);
    }
    return autenticacao(url, metodo, corpo);
  }

  const conta = contaDoToken(cabecalho(init, 'Authorization'));
  const hoje = hojeBrasilia();
  const gravada = conta ? G.usuarios[conta.id]?.[chaveDaRequisicao(metodo, url.href, corpo, hoje)] : undefined;
  if (gravada) {
    const extra: Record<string, string> = {};
    if (gravada.t) extra['Content-Type'] = gravada.t;
    if (gravada.r) extra['Content-Range'] = gravada.r;
    return resposta(deslocarDatas(gravada.b, G.gravadoEm, hoje), gravada.s, extra);
  }

  if (url.pathname.endsWith('/functions/v1/ia-agente')) return agenteDemo(corpo);

  // Not recorded: reads come back empty, writes "work" without saving.
  if (url.pathname.startsWith('/functions/v1/')) return resposta(JSON.stringify({ ok: true, demonstracao: true }));
  if (url.pathname.startsWith('/rest/v1/rpc/')) return resposta('null');
  if (metodo === 'GET' || metodo === 'HEAD') {
    const objeto = (cabecalho(init, 'Accept') ?? '').includes('vnd.pgrst.object');
    return objeto
      ? resposta(JSON.stringify({ code: 'PGRST116', message: 'demonstração: sem dados', details: null, hint: null }), 406)
      : resposta('[]', 200, { 'Content-Range': '*/0' });
  }
  return resposta(metodo === 'DELETE' ? '' : '[]', metodo === 'DELETE' ? 204 : 201);
}
