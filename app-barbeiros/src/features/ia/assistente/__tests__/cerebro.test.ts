// The phone brain end to end, with a fake Gemma session that behaves like
// react-native-executorch's chat session: it streams tokens, writes a Gemma 4
// tool call, runs the tool through toolOpts and then writes the answer.
import { describe, expect, it, jest } from '@jest/globals';

import * as cerebro from '../cerebro.native';

type Opcoes = {
  toolOpts: { tools: { function: { name: string }; execute: (a: Record<string, unknown>) => Promise<string> }[]; parseToolCalls: (t: string) => { toolCalls: { function: { name: string; arguments: Record<string, unknown> } }[] } | undefined };
  initialMessages: { role: string; content: string }[];
};
const mockRecebido: { mensagem?: string; sistema?: string; resultados: string[] } = { resultados: [] };

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('react-native-executorch', () => ({
  setTelemetryEnabled: () => undefined,
  models: { llm: { GEMMA4_E2B: { XNNPACK_8DA4W: { modelPath: 'https://x/m.pte', tokenizerPath: 'https://x/t.json', tokenizerConfigPath: 'https://x/c.json' } } } },
  download: async (c: unknown) => c,
  createLLMChatSession: async (_c: unknown, opcoes: Opcoes) => {
    mockRecebido.sistema = opcoes.initialMessages[0]?.content;
    return {
      getKVCacheState: () => ({ usageRatio: 0.1 }),
      dispose: () => undefined,
      stop: () => undefined,
      sendMessage: async (mensagem: string, onToken: (t: string) => void) => {
        mockRecebido.mensagem = mensagem;
        // Turn 1: a tool call, token by token.
        const chamada = ['<|tool', '_call>call:agendar_horario{cliente:<|"|>Cliente 2<|"|>,', 'dia:<|"|>2026-11-22<|"|>,hora:<|"|>10:00<|"|>,servicos:[<|"|>Corte<|"|>]}<tool_call|>'];
        chamada.forEach(onToken);
        const lida = opcoes.toolOpts.parseToolCalls(chamada.join(''))!;
        for (const c of lida.toolCalls) {
          const tool = opcoes.toolOpts.tools.find((t) => t.function.name === c.function.name)!;
          mockRecebido.resultados.push(await tool.execute(c.function.arguments));
        }
        // Turn 2: the answer.
        ['Vou marcar o Cli', 'ente 2 amanhã às 10:00', ' para corte. ', 'Confirma?'].forEach(onToken);
        return { messages: [], stats: [], finishReason: 'stop' };
      },
    };
  },
}));
const mockChamadas: Record<string, unknown>[] = [];
jest.mock('@/lib/funcoes', () => ({
  chamarFuncao: async (_nome: string, corpo: Record<string, unknown>) => {
    mockChamadas.push(corpo);
    if (corpo.contexto) {
      return { ok: true, hoje: new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date()), sistema: 'Regras do servidor',
        clientes: [{ id: 'a', nome: 'Rafael Souza' }, { id: 'b', nome: 'Bruno Lima' }],
        ferramentas: [{ name: 'agendar_horario', description: 'Prepara um agendamento', parameters: { type: 'object', properties: { cliente: {}, servicos: {}, dia: {}, hora: {}, obs: {} }, required: ['dia', 'hora'] } }] };
    }
    return { ok: true, conteudo: 'Ação preparada, aguardando a confirmação do barbeiro no app.', pendente: { ferramenta: 'agendar_horario', entrada: { dia: '2026-11-22' }, resumo: 'Agendar Bruno · domingo, 22/11 às 10:00' } };
  },
}));

describe('cérebro no celular (Gemma 4 simulado)', () => {
  it('uma IA só: "Cliente N" para o modelo, texto e frases revelados, mudança pendente', async () => {
    await cerebro.baixarGemma(() => undefined);
    const textos: string[] = [];
    const frases: string[] = [];
    const r = await cerebro.responderComGemma('Marca o Bruno amanhã às 10 pra corte', { onTexto: (t) => textos.push(t), onFrase: (f) => frases.push(f) });

    expect(mockRecebido.sistema).toBe('Regras do servidor');
    expect(mockRecebido.mensagem).toBe('Marca o Cliente 2 amanhã às 10 pra corte');
    // Tool through the server, missing optional fields as null.
    expect(mockChamadas.find((c) => c.ferramenta)).toEqual({ ferramenta: 'agendar_horario', entrada: { cliente: 'Cliente 2', dia: '2026-11-22', hora: '10:00', servicos: ['Corte'], obs: null } });
    expect(mockRecebido.resultados[0]).toMatch(/Ação preparada/);
    // Screen and voice: names back, no tool markup, sentence by sentence.
    expect(frases).toEqual(['Vou marcar o Bruno amanhã às 10:00 para corte.', 'Confirma?']);
    expect(textos.at(-1)).toBe('Vou marcar o Bruno amanhã às 10:00 para corte. Confirma?');
    expect(textos.join(' ')).not.toMatch(/tool|Cliente/);
    expect(r).toEqual({ texto: 'Vou marcar o Bruno amanhã às 10:00 para corte. Confirma?', pendente: expect.objectContaining({ ferramenta: 'agendar_horario' }), navegar: undefined });
    // The crash guard is erased once the turn ends.
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    expect(await AsyncStorage.getItem('gemma4-em-uso')).toBeNull();
  });
});
