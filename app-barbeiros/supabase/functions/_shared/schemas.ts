// What the LLM may return. Everything is validated before it is saved;
// on failure nothing is shown (never a broken text).
import { z } from './deps.ts';

const curto = (max: number) => z.string().trim().min(1).max(max);
const ateCincoPalavras = curto(48).refine((t) => t.split(/\s+/).length <= 5, 'título com até 5 palavras');

export const InsightsSaida = z.object({
  insights: z
    .array(
      z.object({
        sinal_id: z.number().int().min(0),
        titulo: ateCincoPalavras,
        porque: curto(160),
        acao: curto(200),
        botao: curto(28),
      }),
    )
    .max(3),
});
export type InsightsSaida = z.infer<typeof InsightsSaida>;

export const NarrativaSaida = z.object({
  titulo: ateCincoPalavras,
  texto: curto(280),
});
export type NarrativaSaida = z.infer<typeof NarrativaSaida>;

export const ETAPAS = ['chegada', 'recepcao', 'diagnostico', 'servico', 'oferta', 'finalizacao', 'pagamento',
  'reagendamento', 'pos_venda', 'follow_up'] as const;

export const EntrevistaSaida = z.object({
  resumo: curto(400),
  etapas: z
    .array(
      z.object({
        etapa: z.enum(ETAPAS),
        aplica_a: z.enum(['primeira_vez', 'recorrente', 'todos']),
        como_faz_hoje: curto(240),
        sugestao_ia: curto(240),
      }),
    )
    .min(3)
    .max(10),
});
export type EntrevistaSaida = z.infer<typeof EntrevistaSaida>;
