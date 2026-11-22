// Report pages the AI creates (criar_relatorio). The numbers come from the
// database (analisar_periodo / listar_atendimentos); the AI only picks the
// period, the sections and writes a short reading of the numbers. Real names
// appear here (this page is for the barber); the AI never saw them.
// Pure function: data in, a self-contained HTML page out (opens in the app,
// prints to PDF). Same look as the app: dark, lime on money, lavender on AI.

export const SECOES = ['resumo', 'comparacao', 'por_dia', 'por_semana', 'por_mes', 'por_dia_da_semana', 'por_hora',
  'por_servico', 'por_cliente', 'por_pagamento', 'comandas'] as const;
export type Secao = (typeof SECOES)[number];

type Total = {
  atendimentos: number; faturamento: number; ticket_medio: number | null; clientes_unicos: number;
  servicos_por_atendimento: number | null; dias_com_atendimento: number; faturamento_medio_por_dia_trabalhado: number | null;
  gastos: number | null; lucro: number | null; taxas_cartao: number;
};
type Grupo = { grupo: string; atendimentos?: number; faturamento: number; ticket_medio?: number; quantidade?: number; preco_medio?: number };
type Comanda = { dia: string; hora: string; cliente: string | null; itens: { item: string; valor: number }[]; total: number; forma_pagamento: string | null; status: string };

export type DadosRelatorio = {
  titulo: string;
  barbeiro: string | null;
  de: string;
  ate: string;
  filtro: string | null;            // "Cliente: Bruno" / "Serviço: Barba"
  secoes: Secao[];
  total: Total;
  anterior: Total | null;           // same number of days right before
  grupos: Partial<Record<Secao, Grupo[]>>;
  comandas: Comanda[] | null;
  analise: string | null;
  geradoEm: Date;
};

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const moeda = (v: number | null | undefined) => (v === null || v === undefined ? '—' : brl.format(Number(v)).replace(/\s/g, ' '));
const num = (v: number | null | undefined, casas = 0) =>
  v === null || v === undefined ? '—' : Number(v).toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });
const data = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;
const esc = (t: unknown) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const FORMA: Record<string, string> = { pix: 'Pix', dinheiro: 'Dinheiro', debito: 'Débito', credito: 'Crédito', outro: 'Outro' };
const STATUS: Record<string, string> = { concluido: 'Concluído', agendado: 'Agendado', falta: 'Faltou', cancelado: 'Cancelado' };

function rotuloGrupo(secao: Secao, g: string): string {
  if (secao === 'por_dia' && /^\d{4}-\d{2}-\d{2}$/.test(g)) return data(g).slice(0, 5);
  if (secao === 'por_semana' && /^\d{4}-\d{2}-\d{2}$/.test(g)) return `semana de ${data(g).slice(0, 5)}`;
  if (secao === 'por_mes' && /^\d{4}-\d{2}$/.test(g)) {
    return new Date(`${g}-15T12:00:00Z`).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric', timeZone: 'UTC' }).replace('.', '');
  }
  if (secao === 'por_pagamento') return FORMA[g] ?? g;
  return g;
}

const TITULOS: Record<Secao, string> = {
  resumo: 'Resumo', comparacao: 'Comparação com o período anterior', por_dia: 'Faturamento por dia', por_semana: 'Por semana',
  por_mes: 'Por mês', por_dia_da_semana: 'Por dia da semana', por_hora: 'Por horário', por_servico: 'Serviços e produtos',
  por_cliente: 'Clientes que mais gastaram', por_pagamento: 'Formas de pagamento', comandas: 'Comandas',
};

function cartao(rotulo: string, valor: string, dinheiro = false) {
  return `<div class="cartao"><div class="rotulo">${esc(rotulo)}</div><div class="valor${dinheiro ? ' dinheiro' : ''}">${valor}</div></div>`;
}

function variacao(atual: number | null, antes: number | null): string {
  if (atual === null || antes === null || !antes) return '<span class="neutro">sem base</span>';
  const v = (atual - antes) / antes;
  if (Math.abs(v) < 0.005) return '<span class="neutro">= igual</span>';
  const pct = `${(Math.abs(v) * 100).toFixed(1).replace('.', ',')}%`;
  return v > 0 ? `<span class="sobe">▲ ${pct} acima</span>` : `<span class="desce">▼ ${pct} abaixo</span>`;
}

function barras(secao: Secao, grupos: Grupo[]): string {
  if (!grupos.length) return '<p class="vazio">Sem atendimentos neste recorte.</p>';
  const max = Math.max(...grupos.map((g) => Number(g.faturamento) || 0), 1);
  const linhas = grupos.slice(0, 40).map((g) => {
    const largura = Math.max(2, Math.round((Number(g.faturamento) / max) * 100));
    const extra = g.quantidade !== undefined ? `${num(g.quantidade)}×` : `${num(g.atendimentos)} atend.`;
    return `<div class="barra"><div class="nome">${esc(rotuloGrupo(secao, g.grupo))}</div>
      <div class="trilho"><div class="cheio" style="width:${largura}%"></div></div>
      <div class="num"><b>${moeda(g.faturamento)}</b><small>${extra}</small></div></div>`;
  }).join('');
  return `<div class="barras">${linhas}</div>`;
}

function tabelaServicos(grupos: Grupo[]): string {
  if (!grupos.length) return '<p class="vazio">Nenhum item vendido neste recorte.</p>';
  return `<table><thead><tr><th>Item</th><th>Qtd.</th><th>Faturamento</th><th>Preço médio</th></tr></thead><tbody>${
    grupos.slice(0, 40).map((g) => `<tr><td>${esc(g.grupo)}</td><td>${num(g.quantidade)}</td><td class="dinheiro">${moeda(g.faturamento)}</td><td class="preco">${moeda(g.preco_medio)}</td></tr>`).join('')
  }</tbody></table>`;
}

function tabelaComandas(cs: Comanda[]): string {
  if (!cs.length) return '<p class="vazio">Nenhuma comanda neste período.</p>';
  return `<table><thead><tr><th>Dia</th><th>Cliente</th><th>Itens</th><th>Total</th><th>Pagamento</th></tr></thead><tbody>${
    cs.slice(0, 150).map((c) => `<tr${c.status !== 'concluido' ? ' class="apagado"' : ''}><td>${data(c.dia).slice(0, 5)} ${esc(c.hora)}</td><td>${esc(c.cliente ?? 'sem cliente')}</td>
      <td>${esc(c.itens.map((i) => i.item).join(' + '))}</td><td class="dinheiro">${moeda(c.total)}</td>
      <td>${esc(c.status === 'concluido' ? FORMA[c.forma_pagamento ?? ''] ?? '—' : STATUS[c.status] ?? c.status)}</td></tr>`).join('')
  }</tbody></table>${cs.length > 150 ? `<p class="vazio">Mostrando 150 de ${cs.length} comandas.</p>` : ''}`;
}

export function montarRelatorio(d: DadosRelatorio): string {
  const t = d.total;
  const partes: string[] = [];
  for (const s of d.secoes) {
    let corpo = '';
    if (s === 'resumo') {
      corpo = `<div class="cartoes">${[
        cartao('Faturamento', moeda(t.faturamento), true),
        cartao('Atendimentos', num(t.atendimentos)),
        cartao('Ticket médio', moeda(t.ticket_medio), true),
        cartao('Clientes', num(t.clientes_unicos)),
        cartao('Serviços por atendimento', num(t.servicos_por_atendimento, 2)),
        cartao('Média por dia trabalhado', moeda(t.faturamento_medio_por_dia_trabalhado), true),
        ...(t.gastos !== null ? [cartao('Gastos', moeda(t.gastos))] : []),
        ...(t.lucro !== null ? [cartao('Lucro', moeda(t.lucro), true)] : []),
      ].join('')}</div>`;
    } else if (s === 'comparacao') {
      const a = d.anterior;
      corpo = a ? `<table><thead><tr><th></th><th>Este período</th><th>Anterior</th><th>Variação</th></tr></thead><tbody>
        <tr><td>Faturamento</td><td class="dinheiro">${moeda(t.faturamento)}</td><td>${moeda(a.faturamento)}</td><td>${variacao(t.faturamento, a.faturamento)}</td></tr>
        <tr><td>Atendimentos</td><td>${num(t.atendimentos)}</td><td>${num(a.atendimentos)}</td><td>${variacao(t.atendimentos, a.atendimentos)}</td></tr>
        <tr><td>Ticket médio</td><td class="dinheiro">${moeda(t.ticket_medio)}</td><td>${moeda(a.ticket_medio)}</td><td>${variacao(t.ticket_medio, a.ticket_medio)}</td></tr>
        </tbody></table><p class="nota">O período anterior tem o mesmo número de dias, logo antes deste.</p>` : '<p class="vazio">Sem dados do período anterior.</p>';
    } else if (s === 'por_servico') {
      corpo = tabelaServicos(d.grupos.por_servico ?? []);
    } else if (s === 'comandas') {
      corpo = tabelaComandas(d.comandas ?? []);
    } else {
      corpo = barras(s, d.grupos[s] ?? []);
    }
    partes.push(`<section><h2>${TITULOS[s]}</h2>${corpo}</section>`);
  }

  const analise = d.analise
    ? `<section class="ia"><h2>Leitura da IA</h2>${d.analise.split(/\n+/).filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join('')}
       <p class="nota">Texto escrito pela IA. Os números deste relatório vêm do app.</p></section>`
    : '';
  const quando = d.geradoEm.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' });

  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(d.titulo)}</title>
<style>
:root{--bg:#0B0B0C;--sup:#16171A;--borda:#2A2C31;--texto:#F4F4F0;--suave:#A3A7AE;--dinheiro:#C5F23A;--ia:#9AA8FF;--sobe:#7BD88F;--desce:#FF8A7A}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--texto);font:16px/1.45 -apple-system,system-ui,Roboto,"Segoe UI",sans-serif;padding:20px 16px 40px}
header{margin-bottom:20px}h1{font-size:24px;margin:0 0 4px}header p{margin:0;color:var(--suave);font-size:14px}
h2{font-size:17px;margin:0 0 12px}section{background:var(--sup);border:1px solid var(--borda);border-radius:18px;padding:16px;margin:0 0 14px}
.cartoes{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px}
.cartao{border:1px solid var(--borda);border-radius:14px;padding:12px}.rotulo{color:var(--suave);font-size:13px}.valor{font-size:20px;font-weight:700;font-variant-numeric:tabular-nums}
.dinheiro{color:var(--dinheiro);font-variant-numeric:tabular-nums}td.dinheiro,td.preco{white-space:nowrap}
.barras{display:flex;flex-direction:column;gap:10px}.barra{display:grid;grid-template-columns:minmax(70px,30%) 1fr auto;gap:10px;align-items:center}
.nome{font-size:14px;overflow-wrap:anywhere}.trilho{height:12px;border-radius:99px;background:#24262B;overflow:hidden}.cheio{height:100%;border-radius:99px;background:var(--dinheiro)}
.num{text-align:right;font-size:14px;font-variant-numeric:tabular-nums}.num b{display:block;color:var(--dinheiro)}.num small{color:var(--suave)}
table{width:100%;border-collapse:collapse;font-size:14px}th,td{text-align:left;padding:8px 6px;border-bottom:1px solid var(--borda);vertical-align:top}th{color:var(--suave);font-weight:600}
tr.apagado td{color:var(--suave)}.sobe{color:var(--sobe)}.desce{color:var(--desce)}.neutro{color:var(--suave)}
.vazio,.nota{color:var(--suave);font-size:13px;margin:8px 0 0}.ia{border-color:var(--ia)}.ia h2{color:var(--ia)}.ia p{margin:0 0 8px}
footer{color:var(--suave);font-size:12px;text-align:center;margin-top:18px}
@media print{body{background:#fff;color:#111}section,.cartao{background:#fff;border-color:#ccc}.dinheiro,.num b{color:#2f6b00}.cheio{background:#2f6b00}.trilho{background:#eee}
.rotulo,.vazio,.nota,th,header p,footer,.num small{color:#555}.ia,.ia h2{border-color:#5560c0;color:#333}}
</style></head>
<body>
<header><h1>${esc(d.titulo)}</h1>
<p>${data(d.de)}${d.ate !== d.de ? ` a ${data(d.ate)}` : ''}${d.filtro ? ` · ${esc(d.filtro)}` : ''}${d.barbeiro ? ` · ${esc(d.barbeiro)}` : ''}</p></header>
${partes.join('\n')}
${analise}
<footer>Feito pela IA do app em ${esc(quando)}.</footer>
</body></html>`;
}
