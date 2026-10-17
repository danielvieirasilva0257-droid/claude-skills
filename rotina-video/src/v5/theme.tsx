import React from 'react';
import type {LucideIcon} from 'lucide-react';
import {AbsoluteFill, Easing, interpolate, spring} from 'remotion';
import {body, c, display} from '../theme';
import {textWidth} from '../v2/parts';

// Rotina v5 (16:9, 1920 x 1080): no estilo do video-modelo do Daniel (promo de app "UI premium").
// Fundo quase preto com manchas de luz desfocadas, cartoes escuros de interface, frases que se montam palavra
// por palavra no centro, camera passeando pela interface com borrao de movimento.
// Pedido do Daniel: a TIPOGRAFIA, os ICONES e as CORES sao os do proprio app (Barlow, Barlow Condensed em caixa alta,
// icones lucide do app, cor de cada categoria), como no v2. No modelo as manchas sao verde e laranja; aqui, vermelho e ambar.

export const W5 = 1920;
export const H5 = 1080;

export const C = {
	bg: '#0A0A0E',
	text: '#F5F5F7',
	gray: '#8E8E93',
	dim: '#5C5C63',
	card: '#17171C',
	card2: '#1E1E24',
	line: 'rgba(255,255,255,0.07)',
	red: c.redHi, // acento em texto (o verde do modelo) = vermelho claro do app
	redFill: c.red, // botoes e preenchimentos = vermelho do app
	redDeep: '#7A0A0E',
	redGlow: 'rgba(255,60,60,0.35)',
	amber: c.amber,
	green: c.green,
	blue: c.blue,
	purple: c.purple,
	orange: c.orange,
	pink: c.pink,
};
export const F = body; // Barlow (texto do app)
export const FD = display; // Barlow Condensed (titulos e numeros do app, em caixa alta)

export const E = {
	out: Easing.bezier(0.16, 1, 0.3, 1),
	inOut: Easing.bezier(0.65, 0, 0.35, 1),
	in: Easing.bezier(0.55, 0, 0.75, 0.2),
	soft: Easing.bezier(0.45, 0, 0.55, 1),
	whip: Easing.bezier(0.83, 0, 0.17, 1),
	lin: (t: number) => t,
};
export const tw = (f: number, r: [number, number], o: [number, number], e: (t: number) => number = E.out) =>
	interpolate(f, r, o, {easing: e, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
export const sp = (f: number, at: number, cfg: {stiffness: number; damping: number; mass?: number} = {stiffness: 260, damping: 24}) =>
	f < at ? 0 : spring({frame: f - at, fps: 30, config: cfg});
export const SPR = {
	pop: {stiffness: 300, damping: 22}, // cartoes que saltam (pequeno overshoot)
	card: {stiffness: 200, damping: 24},
	ui: {stiffness: 380, damping: 32},
};

// largura de texto (Barlow ou Barlow Condensed), com o mesmo espacamento usado no desenho
export const larg = (t: string, size: number, peso = 600, fonte = F, track = -0.01) => textWidth(t, size, fonte, false, peso) + t.length * size * track;

// numero em reais no formato brasileiro
export const brl = (v: number, casas = 2) => v.toLocaleString('pt-BR', {minimumFractionDigits: casas, maximumFractionDigits: casas});

// ---------------------------------------------------------------- fundo: quase preto + duas manchas de luz que derivam devagar
export const Fundo5: React.FC<{f: number; forca?: number}> = ({f, forca = 1}) => {
	const t = f / 30;
	const ax = -160 + 60 * Math.sin(t * 0.21);
	const ay = -220 + 50 * Math.cos(t * 0.17);
	const bx = 2080 + 70 * Math.sin(t * 0.19 + 1.3);
	const by = 1240 + 60 * Math.cos(t * 0.23 + 0.4);
	return (
		<AbsoluteFill style={{background: C.bg}}>
			<AbsoluteFill style={{opacity: forca, background: `radial-gradient(circle 1150px at ${ax}px ${ay}px, rgba(214,24,30,0.78) 0%, rgba(160,14,20,0.40) 36%, rgba(10,10,14,0) 74%)`}} />
			<AbsoluteFill style={{opacity: forca, background: `radial-gradient(circle 1050px at ${bx}px ${by}px, rgba(245,140,20,0.70) 0%, rgba(205,95,12,0.30) 38%, rgba(10,10,14,0) 76%)`}} />
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.45) 100%)'}} />
		</AbsoluteFill>
	);
};

export const Grao5: React.FC<{f: number}> = ({f}) => (
	<AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.06}}>
		<svg width="100%" height="100%">
			<filter id="v5grain">
				<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={Math.floor(f / 2) % 9} stitchTiles="stitch" />
				<feColorMatrix type="saturate" values="0" />
			</filter>
			<rect width="100%" height="100%" filter="url(#v5grain)" />
		</svg>
	</AbsoluteFill>
);

// borrao direcional (filtro SVG em regiao grande: nunca corta)
// w, h: tamanho do quadro (padrao 1920 x 1080; o v6 vertical passa 1080 x 1920)
export const Borrao5: React.FC<{id: string; dx: number; dy: number; children: React.ReactNode; k?: number; max?: number; w?: number; h?: number}> = ({id, dx, dy, children, k = 0.35, max = 40, w = W5, h = H5}) => {
	const sx = Math.min(max, Math.abs(dx) * k);
	const sy = Math.min(max, Math.abs(dy) * k);
	const frame: React.CSSProperties = {position: 'absolute', left: 0, top: 0, width: w, height: h};
	if (sx < 0.5 && sy < 0.5) return <div style={frame}>{children}</div>;
	return (
		<div style={{...frame, filter: `url(#${id})`}}>
			<svg width={0} height={0} style={{position: 'absolute'}}>
				<filter id={id} filterUnits="userSpaceOnUse" x={-3000} y={-3000} width={w + 6000} height={h + 6000}>
					<feGaussianBlur stdDeviation={`${sx.toFixed(2)} ${sy.toFixed(2)}`} />
				</filter>
			</svg>
			{children}
		</div>
	);
};

// ---------------------------------------------------------------- frase palavra por palavra (como no modelo)
// Cada palavra entra no quadro da fala com desfoque saindo e uma subida curta; a linha se recentraliza sozinha
// porque a largura de cada palavra entra aos poucos. Uma "palavra" pode ser um chip de interface.
// titulo: true = palavra no estilo dos titulos do app (Barlow Condensed, caixa alta, cor e icone da categoria)
export type Palavra = {t: string; at: number; cor?: string; peso?: number; chip?: React.ReactNode; chipW?: number; titulo?: boolean; icone?: LucideIcon};
export const larguraPalavra = (p: Palavra, size: number) => {
	if (p.chip) return p.chipW ?? 0;
	if (p.titulo) return larg(p.t.toUpperCase(), size * 1.12, 800, FD, 0) + (p.icone ? size * 0.95 : 0);
	return larg(p.t, size, p.peso ?? 600);
};
// cx, fw, fh: centro da linha e tamanho do quadro (padrao: quadro 16:9 do v5)
export const Frase: React.FC<{f: number; palavras: Palavra[]; size: number; y: number; sai?: number; id: string; gap?: number; cx?: number; fw?: number; fh?: number}> = ({
	f,
	palavras,
	size,
	y,
	sai = 1e9,
	id,
	gap,
	cx = W5 / 2,
	fw = W5,
	fh = H5,
}) => {
	if (f < palavras[0].at - 1) return null;
	const out = tw(f, [sai, sai + 8], [0, 1], E.in);
	if (out >= 1) return null;
	const g = gap ?? size * 0.28;
	const ws = palavras.map((p) => larguraPalavra(p, size));
	const as = palavras.map((p) => tw(f, [p.at - 1, p.at + 8], [0, 1], E.out));
	const total = ws.reduce((acc, w, i) => acc + (w + (i ? g : 0)) * as[i], 0);
	let x = cx - total / 2;
	return (
		<div style={{position: 'absolute', left: 0, top: 0, width: fw, height: fh, opacity: 1 - out, filter: out > 0 ? `blur(${(out * 10).toFixed(1)}px)` : undefined}}>
			{palavras.map((p, i) => {
				const a = as[i];
				const left = x + (i ? g * a : 0);
				x += (ws[i] + (i ? g : 0)) * a;
				if (a <= 0) return null;
				const style: React.CSSProperties = {
					position: 'absolute',
					left,
					top: y - size * 0.62 + (1 - a) * size * 0.32,
					opacity: a,
					filter: a < 1 ? `blur(${((1 - a) * 12).toFixed(1)}px)` : undefined,
					whiteSpace: 'nowrap',
				};
				if (p.chip)
					return (
						<div key={id + i} style={{...style, top: y - 40 + (1 - a) * 14, transform: `scale(${0.9 + 0.1 * a})`, transformOrigin: '0 50%'}}>
							{p.chip}
						</div>
					);
				if (p.titulo) {
					const cor = p.cor ?? C.red;
					return (
						<div key={id + i} style={{...style, top: y - size * 0.68 + (1 - a) * size * 0.32, display: 'flex', alignItems: 'center', gap: size * 0.2}}>
							{p.icone ? <p.icone size={size * 0.75} color={cor} strokeWidth={2.4} /> : null}
							<span style={{fontFamily: FD, fontWeight: 800, fontSize: size * 1.12, lineHeight: 1.24, color: cor, textTransform: 'uppercase'}}>{p.t}</span>
						</div>
					);
				}
				return (
					<div key={id + i} style={{...style, fontFamily: F, fontWeight: p.peso ?? 600, fontSize: size, lineHeight: 1.24, letterSpacing: '-0.01em', color: p.cor ?? C.text}}>
						{p.t}
					</div>
				);
			})}
		</div>
	);
};

// numero grande com os centavos menores e cinza (como o "R$ 4.117,00" do modelo)
export const Grande: React.FC<{valor: string; size: number; cor?: string; corCent?: string}> = ({valor, size, cor = C.text, corCent = C.gray}) => {
	const i = valor.lastIndexOf(',');
	const ini = i >= 0 ? valor.slice(0, i) : valor;
	const fim = i >= 0 ? valor.slice(i) : '';
	return (
		<span style={{fontFamily: FD, fontWeight: 800, fontSize: size, letterSpacing: '-0.01em', color: cor, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums'}}>
			{ini}
			<span style={{fontSize: size * 0.48, color: corCent, letterSpacing: 0}}>{fim}</span>
		</span>
	);
};
