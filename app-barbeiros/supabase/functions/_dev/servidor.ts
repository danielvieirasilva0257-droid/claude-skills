// Local stand-in for the Edge Runtime: serves every function at
// http://127.0.0.1:54329/functions/v1/<name>. Used in development and in the
// browser E2E tests (the cloud container cannot run the edge-runtime image).
import { handler as chat } from '../ia-chat/handler.ts';
import { handler as entrevista } from '../ia-entrevista/handler.ts';
import { handler as insights } from '../ia-insights/handler.ts';
import { handler as narrativa } from '../ia-narrativa/handler.ts';
import { handler as canalConectar } from '../canal-conectar/handler.ts';
import { handler as canalEnviar } from '../canal-enviar/handler.ts';
import { handler as enviarFila } from '../enviar-fila/handler.ts';
import { handler as instagram } from '../instagram-webhook/handler.ts';
import { handler as whatsapp } from '../whatsapp-webhook/handler.ts';
import { handler as assinatura } from '../assinatura-webhook/handler.ts';

const rotas: Record<string, (req: Request) => Promise<Response>> = {
  'ia-chat': chat,
  'ia-entrevista': entrevista,
  'ia-insights': insights,
  'ia-narrativa': narrativa,
  'canal-conectar': canalConectar,
  'canal-enviar': canalEnviar,
  'enviar-fila': enviarFila,
  'instagram-webhook': instagram,
  'whatsapp-webhook': whatsapp,
  'assinatura-webhook': assinatura,
};

const porta = Number(Deno.env.get('PORTA_FUNCOES') ?? 54329);
Deno.serve({ port: porta, hostname: '127.0.0.1' }, (req) => {
  const nome = new URL(req.url).pathname.replace(/^\/functions\/v1\//, '');
  const rota = rotas[nome];
  return rota ? rota(req) : new Response('não encontrada', { status: 404 });
});
