// Runs the app's own parser and anonymizer (TypeScript, type-stripped by Node)
// for scripts/gemma/validar.py. Input on stdin: { clientes, texto_usuario?, saida? }.
import { copyFileSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// The app's files, copied with a .mts name so Node strips the types.
const raiz = new URL('../../src/features/ia/assistente/', import.meta.url);
const pasta = mkdtempSync(join(tmpdir(), 'gemma-'));
for (const f of ['gemma4', 'anonimizar']) copyFileSync(new URL(`${f}.ts`, raiz), join(pasta, `${f}.mts`));
const g = await import(join(pasta, 'gemma4.mts'));
const a = await import(join(pasta, 'anonimizar.mts'));

const p = JSON.parse(readFileSync(0, 'utf8'));
const anon = a.criarAnonimizador(p.clientes ?? []);
process.stdout.write(JSON.stringify({
  anon: p.texto_usuario ? anon.anonimizar(p.texto_usuario) : null,
  chamadas: p.saida ? g.lerChamadasGemma4(p.saida) ?? null : null,
  visivel: p.saida ? anon.revelar(g.textoVisivel(p.saida)) : null,
}));
