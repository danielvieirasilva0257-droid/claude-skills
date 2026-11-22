import { describe, expect, it } from '@jest/globals';

import { criarAnonimizador } from '../anonimizar';
import { criarDivisorDeFrases } from '../frases';
import { criarFiltroDeFala, lerChamadasGemma4, textoVisivel } from '../gemma4';

describe('chamadas de ferramenta do Gemma 4', () => {
  it('lê nome e argumentos (texto, número, lista, nulo)', () => {
    const r = lerChamadasGemma4('Vou marcar.<|tool_call>call:agendar_horario{cliente:<|"|>Cliente 2<|"|>,dia:<|"|>2026-11-22<|"|>,hora:<|"|>10:00<|"|>,servicos:[<|"|>Corte<|"|>,<|"|>Barba<|"|>]}<tool_call|>');
    expect(r?.toolCalls).toHaveLength(1);
    expect(r?.toolCalls[0]?.function).toEqual({
      name: 'agendar_horario',
      arguments: { cliente: 'Cliente 2', dia: '2026-11-22', hora: '10:00', servicos: ['Corte', 'Barba'] },
    });
    expect(r?.textContent).toBe('Vou marcar.');
    const n = lerChamadasGemma4('<|tool_call>call:mudar_preco_servico{preco:50.5,servico:<|"|>Corte<|"|>}<tool_call|><|tool_call>call:resumo_do_dia{dia:null}<tool_call|>');
    expect(n?.toolCalls.map((c) => c.function.arguments)).toEqual([{ preco: 50.5, servico: 'Corte' }, { dia: null }]);
  });
  it('sem chamada: undefined; sem a tag de fechamento no fim: ainda lê', () => {
    expect(lerChamadasGemma4('Amanhã você tem dois horários.')).toBeUndefined();
    expect(lerChamadasGemma4('<|tool_call>call:numeros_do_mes{}')?.toolCalls[0]?.function.name).toBe('numeros_do_mes');
  });
});

describe('o que aparece na tela e vai para a voz', () => {
  it('tira chamadas, pensamento e tokens especiais', () => {
    expect(textoVisivel('<|channel>thought\npensando<channel|>Pronto.<turn|>')).toBe('Pronto.');
    expect(textoVisivel('Vou ver.<|tool_call>call:agenda_do_dia{}<tool_call|>')).toBe('Vou ver.');
  });
  it('em tempo real: segura tag pela metade e o "Cliente 1" que ainda pode virar 12', () => {
    const f = criarFiltroDeFala();
    const saida = ['Hoje você', ' tem 2', ' horários. <|tool', '_call>call:x{}', '<tool_call|>O próximo é o Cli', 'ente 1', '2, às 10:30.']
      .map((t) => f.empurrar(t)).join('') + f.terminar();
    expect(saida.replace(/\s+/g, ' ')).toBe('Hoje você tem 2 horários. O próximo é o Cliente 12, às 10:30.');
    expect(saida).not.toContain('tool');
  });
});

describe('frases para a voz', () => {
  it('solta cada frase completa e não corta "R$ 7.466,39" nem "8,2%"', () => {
    const frases: string[] = [];
    const d = criarDivisorDeFrases((x) => frases.push(x));
    for (const t of ['No mês você faturou R$ 7.4', '66,39. Até o dia 21: 8,2% acima', ' do mês passado! E o resto']) d.empurrar(t);
    expect(frases).toEqual(['No mês você faturou R$ 7.466,39.', 'Até o dia 21: 8,2% acima do mês passado!']);
    d.empurrar(' fica aqui.');
    d.terminar();
    expect(frases).toEqual(['No mês você faturou R$ 7.466,39.', 'Até o dia 21: 8,2% acima do mês passado!', 'E o resto fica aqui.']);
  });
});

describe('a voz começa nas 5 primeiras palavras', () => {
  it('fala as 5 primeiras palavras assim que estão escritas, depois segue por frase', () => {
    const frases: string[] = [];
    const d = criarDivisorDeFrases((x) => frases.push(x));
    d.empurrar('Hoje você');
    expect(frases).toEqual([]);
    d.empurrar(' tem cinco clientes marcados');
    expect(frases).toEqual(['Hoje você tem cinco clientes']);
    d.empurrar(' e o primeiro é às 10:30. Quer que eu');
    expect(frases).toEqual(['Hoje você tem cinco clientes', 'marcados e o primeiro é às 10:30.']);
    d.empurrar(' confirme?');
    d.terminar();
    expect(frases.at(-1)).toBe('Quer que eu confirme?');
  });

  it('não corta "Cliente 12" (o número vem depois)', () => {
    const frases: string[] = [];
    const d = criarDivisorDeFrases((x) => frases.push(x));
    d.empurrar('Marquei para o Cliente 12 amanhã');
    expect(frases).toEqual(['Marquei para o Cliente 12']);
  });

  it('não começa no meio de um valor nem termina em "R$"', () => {
    const frases: string[] = [];
    const d = criarDivisorDeFrases((x) => frases.push(x));
    d.empurrar('Você faturou ontem só R$ 1.2');
    expect(frases).toEqual([]);
    d.empurrar('34,56 com 7 atendimentos e');
    expect(frases).toEqual(['Você faturou ontem só R$ 1.234,56']);
  });

  it('frase longa: corta na vírgula ou a cada 15 palavras', () => {
    const frases: string[] = [];
    const d = criarDivisorDeFrases((x) => frases.push(x));
    d.empurrar('Pronto. O melhor dia da semana foi a sexta-feira, seguida do sábado com muitos cortes e barbas feitas durante toda a tarde de ontem ');
    expect(frases).toEqual(['Pronto.', 'O melhor dia da semana foi a sexta-feira,']);
  });
});

describe('"Cliente N" no celular (igual ao servidor)', () => {
  it('mesma numeração por id, nome inteiro antes do primeiro nome, volta só o primeiro nome', () => {
    const a = criarAnonimizador([{ id: 'b', nome: 'Bruno Lima' }, { id: 'a', nome: 'Rafael Souza' }]);
    expect(a.anonimizar('Marca o Bruno Lima e o rafael; Rafaela não')).toBe('Marca o Cliente 2 e o Cliente 1; Rafaela não');
    expect(a.revelar('Cliente 2 às 10h, Cliente 9')).toBe('Bruno às 10h, Cliente 9');
  });
});
