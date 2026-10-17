import React from 'react';
import type {LucideIcon} from 'lucide-react';
import {C, E, F, FD, Grande, brl, sp, tw} from './theme';
import {Cartao, Item} from './pecas';

// Blocos maiores do v5, genericos (o conteudo vem de Cenas5).

// ---------------------------------------------------------------- lista que rola por secoes (como "Combustivel / Manutencao / ...")
export type ItemDados = {selo: React.ReactNode; titulo: string; sub: string; valor: React.ReactNode; corValor?: string};
export type SecaoDados = {titulo: string; total?: string; itens: ItemDados[]; at: number; icone?: LucideIcon; cor?: string};

// cada secao entra no quadro da palavra; a coluna rola rapido ate ela (chicote com borrao vertical)
export const LARG_LISTA = 860;
const ALT_ITEM = 112;
const GAP_ITEM = 18;
const ALT_TIT = 92;
export const alturaSecao = (s: SecaoDados) => ALT_TIT + s.itens.length * (ALT_ITEM + GAP_ITEM) + 70;

export const posicaoLista = (f: number, secoes: SecaoDados[], topo: number) => {
	// deslocamento vertical da coluna: em cada secao, a coluna vai ate o titulo dela ficar em "topo"
	let y = 0;
	let acum = 0;
	for (let i = 0; i < secoes.length; i++) {
		const alvo = -acum;
		const k = i === 0 ? 1 : tw(f, [secoes[i].at - 3, secoes[i].at + 9], [0, 1], E.whip);
		if (i === 0) y = alvo;
		else y = y + (alvo - y) * k;
		acum += alturaSecao(secoes[i]);
	}
	return y + topo;
};

// entrada da coluna inteira pela borda de baixo (quando "entra" e dado): deslocamento extra em px
export const entradaLista = (f: number, entra?: number) => (entra === undefined ? 0 : (1 - tw(f, [entra, entra + 14], [0, 1], E.out)) * 900);

// opac(i): opacidade de cada secao (a que sai some enquanto a coluna rola: nada passa por cima do topo)
// entra: a coluna inteira ja vem montada e sobe da borda de baixo (itens escalonados);
// sem ele, cada secao so aparece no quadro dela
export const Lista: React.FC<{f: number; secoes: SecaoDados[]; x: number; topo: number; opac?: (i: number) => number; entra?: number}> = ({f, secoes, x, topo, opac, entra}) => {
	if (entra !== undefined && f < entra - 1) return null;
	const y0 = posicaoLista(f, secoes, topo) + entradaLista(f, entra);
	let acum = 0;
	let g = 0;
	return (
		<div style={{position: 'absolute', left: x, top: y0, width: LARG_LISTA, fontFamily: F}}>
			{secoes.map((s, i) => {
				const top = acum;
				acum += alturaSecao(s);
				const g0 = g;
				g += s.itens.length + 1;
				if (entra === undefined && f < s.at - 4) return null;
				const o = opac ? opac(i) : 1;
				if (o <= 0.001) return null;
				return (
					<div key={s.titulo} style={{position: 'absolute', left: 0, top, width: LARG_LISTA, opacity: o}}>
						<div style={{height: ALT_TIT, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
							<span style={{display: 'flex', alignItems: 'center', gap: 16}}>
								{s.icone ? <s.icone size={46} color={s.cor ?? C.red} strokeWidth={2.4} /> : null}
								<span style={{fontFamily: FD, fontWeight: 800, fontSize: 62, letterSpacing: '0.01em', color: s.cor ?? C.text, textTransform: 'uppercase'}}>{s.titulo}</span>
							</span>
							{s.total ? <span style={{fontFamily: FD, fontWeight: 700, fontSize: 36, color: C.gray}}>{s.total}</span> : null}
						</div>
						{s.itens.map((it, j) => {
							const at = entra === undefined ? s.at + j * 4 : entra + (g0 + j + 1) * 2;
							const k = sp(f, at, {stiffness: 300, damping: 26});
							return (
								<div key={it.titulo} style={{marginTop: GAP_ITEM, opacity: Math.min(1, k * 1.4), transform: `translateY(${(1 - Math.min(1, k)) * 40}px)`}}>
									<Item w={LARG_LISTA} selo={it.selo} titulo={it.titulo} sub={it.sub} valor={it.valor} corValor={it.corValor} />
								</div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};

// velocidade vertical da lista (para o borrao de movimento)
export const velLista = (f: number, secoes: SecaoDados[], topo: number) => posicaoLista(f, secoes, topo) - posicaoLista(f - 1, secoes, topo);

// ---------------------------------------------------------------- linha do topo com um numero que muda a cada secao (o "sobra R$ ..." do modelo)
export const Topo: React.FC<{esquerda: string; rotulo: string; valor: string; w: number}> = ({esquerda, rotulo, valor, w}) => (
	<div style={{width: w, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', fontFamily: F}}>
		<span style={{fontFamily: FD, fontWeight: 600, fontSize: 30, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.gray}}>{esquerda}</span>
		<span style={{fontFamily: FD, fontWeight: 600, fontSize: 30, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.gray}}>
			{rotulo} <span style={{fontWeight: 800, fontSize: 58, letterSpacing: 0, color: C.text, fontVariantNumeric: 'tabular-nums'}}>{valor}</span>
		</span>
	</div>
);

// ---------------------------------------------------------------- cartao-resumo (linhas, barra segmentada, numero grande)
export type Linha = {rotulo: string; valor: string};
// cresce: quadro em que os segmentos da barra comecam a crescer, um depois do outro (sem ele, a barra ja vem cheia)
// aceso: indice do segmento que acende em vermelho (os outros usam cores[i]); h: altura fixa do cartao (para o morph)
export const Resumo: React.FC<{
	f: number;
	at: number;
	linhas: Linha[];
	segmentos: number[];
	cores?: string[];
	titulo: string;
	grande: string;
	acende: number;
	w?: number;
	h?: number;
	cresce?: number;
	aceso?: number;
}> = ({f, at, linhas, segmentos, cores, titulo, grande, acende, w = 860, h, cresce, aceso = 0}) => {
	const k = sp(f, at, {stiffness: 220, damping: 22});
	const luz = tw(f, [acende, acende + 10], [0, 1], E.out);
	const soma = segmentos.reduce((a, b) => a + b, 0);
	const cresc = segmentos.map((_, i) => (cresce === undefined ? 1 : tw(f, [cresce + i * 3, cresce + i * 3 + 9], [0, 1], E.out)));
	const vazio = segmentos.reduce((a, s, i) => a + (s / soma) * (1 - cresc[i]), 0);
	return (
		<div style={{transform: `scale(${0.86 + 0.14 * Math.min(1.02, k)})`, opacity: Math.min(1, k * 1.5), transformOrigin: '50% 50%'}}>
			<Cartao w={w} h={h} vidro style={{padding: '40px 48px 44px'}}>
				{linhas.map((l) => (
					<div key={l.rotulo} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18}}>
						<span style={{fontWeight: 500, fontSize: 32, color: C.gray}}>{l.rotulo}</span>
						<span style={{fontFamily: FD, fontWeight: 800, fontSize: 42, color: C.text, fontVariantNumeric: 'tabular-nums'}}>{l.valor}</span>
					</div>
				))}
				<div style={{display: 'flex', gap: 6, height: 14, marginTop: 10}}>
					{segmentos.map((s, i) =>
						cresc[i] <= 0.001 ? null : (
							<div
								key={i}
								style={{
									flex: (s / soma) * cresc[i],
									borderRadius: 7,
									background: i === aceso ? (luz > 0 ? `rgba(255,90,90,${0.35 + 0.65 * luz})` : 'rgba(255,255,255,0.35)') : cores?.[i] ?? 'rgba(255,255,255,0.18)',
									opacity: i === aceso ? 1 : 0.9,
								}}
							/>
						),
					)}
					{vazio > 0.001 ? <div style={{flex: vazio}} /> : null}
				</div>
				<div style={{height: 1.5, background: C.line, margin: '34px 0 26px'}} />
				<div style={{fontFamily: FD, fontWeight: 700, fontSize: 34, letterSpacing: '0.12em', textTransform: 'uppercase', color: luz > 0.5 ? C.red : C.gray}}>{titulo}</div>
				<div style={{marginTop: 6, textShadow: luz > 0 ? `0 0 ${40 * luz}px rgba(255,77,77,${0.45 * luz})` : undefined}}>
					<Grande valor={grande} size={150} />
				</div>
			</Cartao>
		</div>
	);
};

// ---------------------------------------------------------------- numero que conta (resultado)
export const Contador: React.FC<{f: number; de: number; ate: number; ini: number; fim: number; casas?: number; prefixo?: string; sufixo?: string; size: number; cor?: string}> = ({
	f,
	de,
	ate,
	ini,
	fim,
	casas = 0,
	prefixo = '',
	sufixo = '',
	size,
	cor,
}) => {
	const v = de + (ate - de) * tw(f, [ini, fim], [0, 1], E.out);
	return <Grande valor={`${prefixo}${brl(v, casas)}${sufixo}`} size={size} cor={cor} />;
};
