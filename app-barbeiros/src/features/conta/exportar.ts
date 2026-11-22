// Data export (every plan, no dark patterns): CSV with ";" and decimal comma,
// so Excel and Google Sheets in Portuguese open it right.
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import { diaISO } from '@/lib/format';
import { supabase } from '@/lib/supabase';

export type TipoExportacao = 'atendimentos' | 'clientes' | 'gastos' | 'servicos';

export const NOME_EXPORTACAO: Record<TipoExportacao, string> = {
  atendimentos: 'Atendimentos',
  clientes: 'Clientes',
  gastos: 'Gastos',
  servicos: 'Serviços',
};

type Linha = Record<string, unknown>;

const COLUNAS: Record<TipoExportacao, string[]> = {
  atendimentos: ['data', 'hora', 'status', 'cliente', 'itens', 'valor_total', 'taxa_cartao', 'forma_pagamento'],
  clientes: ['nome', 'apelido', 'telefone', 'status', 'origem', 'aniversario', 'aceita_contato', 'observacoes', 'tecnica_cabelo', 'tecnica_barba', 'criado_em'],
  gastos: ['data', 'categoria', 'valor', 'recorrente', 'descricao'],
  servicos: ['nome', 'categoria', 'preco', 'duracao_min', 'custo_insumo', 'intervalo_recomendado_dias', 'ativo'],
};

async function buscar(tipo: TipoExportacao, barbeiroId: string): Promise<Linha[]> {
  if (tipo === 'atendimentos') {
    const { data, error } = await supabase.rpc('exportar_atendimentos');
    if (error) throw error;
    return (data ?? []) as Linha[];
  }
  const ordem = tipo === 'gastos' ? 'data' : 'nome';
  const { data, error } = await supabase.from(tipo).select(COLUNAS[tipo].join(',')).eq('barbeiro_id', barbeiroId).order(ordem);
  if (error) throw error;
  return (data ?? []) as unknown as Linha[];
}

function celula(v: unknown): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'boolean') return v ? 'sim' : 'não';
  let t = String(v);
  if (/^-?\d+(\.\d+)?$/.test(t)) t = t.replace('.', ',');
  return /[;"\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
}

export function paraCSV(colunas: string[], linhas: Linha[]): string {
  const corpo = linhas.map((l) => colunas.map((c) => celula(l[c])).join(';'));
  return '﻿' + [colunas.join(';'), ...corpo].join('\r\n');
}

/** Builds the CSV and hands it to the share sheet (or downloads it on the web). */
export async function exportarCSV(tipo: TipoExportacao, barbeiroId: string): Promise<number> {
  const linhas = await buscar(tipo, barbeiroId);
  const csv = paraCSV(COLUNAS[tipo], linhas);
  const nome = `app-barbeiros-${tipo}-${diaISO()}.csv`;

  if (Platform.OS === 'web') {
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = nome;
    a.click();
    URL.revokeObjectURL(url);
    return linhas.length;
  }
  const arquivo = new File(Paths.cache, nome);
  if (arquivo.exists) arquivo.delete();
  arquivo.create();
  arquivo.write(csv);
  await Sharing.shareAsync(arquivo.uri, { mimeType: 'text/csv', dialogTitle: `Exportar ${NOME_EXPORTACAO[tipo]}`, UTI: 'public.comma-separated-values-text' });
  return linhas.length;
}
