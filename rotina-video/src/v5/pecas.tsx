import React from 'react';
import {Pointer} from 'lucide-react';
import {AppMark} from '../v2/Marca';
import {C, E, F, FD, larg, sp, tw} from './theme';

// Pecas de interface do v5, no desenho do video-modelo: cartoes escuros com borda fina, titulos fortes,
// valores alinhados a direita, numeros tabulares.

export const Cartao: React.FC<{w: number; h?: number; children: React.ReactNode; style?: React.CSSProperties; vidro?: boolean}> = ({w, h, children, style, vidro}) => (
	<div
		style={{
			width: w,
			height: h,
			boxSizing: 'border-box',
			borderRadius: 30,
			background: vidro ? 'rgba(28,28,34,0.86)' : C.card,
			border: `1.5px solid ${C.line}`,
			boxShadow: '0 40px 90px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)',
			backdropFilter: vidro ? 'blur(24px)' : undefined,
			fontFamily: F,
			color: C.text,
			...style,
		}}
	>
		{children}
	</div>
);

// item de lista: selo a esquerda (dia + mes, ou icone), titulo, subtitulo e valor a direita
export const Item: React.FC<{
	w: number;
	selo: React.ReactNode;
	titulo: string;
	sub: string;
	valor: React.ReactNode;
	corValor?: string;
	marcado?: number; // 0..1: aparece um check vermelho no selo (habitos)
}> = ({w, selo, titulo, sub, valor, corValor = C.text}) => (
	<div style={{width: w, height: 112, boxSizing: 'border-box', borderRadius: 24, background: C.card, border: `1.5px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: 22, padding: '0 30px 0 18px', fontFamily: F}}>
		<div style={{width: 76, height: 76, borderRadius: 18, background: C.card2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{selo}</div>
		<div style={{flex: 1, minWidth: 0}}>
			<div style={{fontWeight: 600, fontSize: 32, color: C.text, letterSpacing: '-0.01em', whiteSpace: 'nowrap'}}>{titulo}</div>
			<div style={{fontWeight: 500, fontSize: 23, color: C.gray, marginTop: 2, whiteSpace: 'nowrap'}}>{sub}</div>
		</div>
		<div style={{fontFamily: FD, fontWeight: 800, fontSize: 40, color: corValor, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums'}}>{valor}</div>
	</div>
);

export const SeloDia: React.FC<{dia: string; mes: string}> = ({dia, mes}) => (
	<>
		<div style={{fontFamily: FD, fontWeight: 800, fontSize: 36, lineHeight: 1, color: C.text}}>{dia}</div>
		<div style={{fontFamily: FD, fontWeight: 600, fontSize: 16, letterSpacing: '0.12em', color: C.gray, marginTop: 3}}>{mes}</div>
	</>
);

// check desenhado (o traco vai de 0 a 1)
export const Check: React.FC<{k: number; size?: number; cor?: string}> = ({k, size = 30, cor = '#fff'}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'block'}}>
		<path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke={cor} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
	</svg>
);

// botao em pilula (CTA e "Calcular" do modelo)
export const Pilula: React.FC<{w: number; h: number; texto: string; size: number; afunda?: number; brilho?: number}> = ({w, h, texto, size, afunda = 0, brilho = 0}) => (
	<div
		style={{
			width: w,
			height: h,
			borderRadius: h / 2,
			background: C.redFill,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			fontFamily: FD,
			fontWeight: 800,
			fontSize: size,
			letterSpacing: '0.02em',
			textTransform: 'uppercase',
			color: '#FFFFFF',
			transform: `scale(${1 - 0.05 * afunda})`,
			boxShadow: `0 ${24 - 12 * afunda}px ${60 - 20 * afunda}px rgba(224,30,38,${0.35 + 0.25 * brilho}), inset 0 1px 0 rgba(255,255,255,0.25)`,
		}}
	>
		{texto}
	</div>
);

// cursor de mao: entra, para em cima do alvo e clica (aperta e solta)
export const Cursor: React.FC<{f: number; de: {x: number; y: number}; para: {x: number; y: number}; chega: number; clica: number; size?: number}> = ({f, de, para, chega, clica, size = 92}) => {
	if (f < chega - 14) return null;
	const k = tw(f, [chega - 14, chega], [0, 1], E.out);
	const x = de.x + (para.x - de.x) * k;
	const y = de.y + (para.y - de.y) * k;
	const aperto = f >= clica ? Math.sin(Math.PI * Math.min(1, (f - clica) / 7)) : 0;
	return (
		<div style={{position: 'absolute', left: x - size * 0.32, top: y - size * 0.06, transform: `scale(${1 - 0.14 * aperto})`, transformOrigin: '30% 10%', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.45))'}}>
			<Pointer size={size} color="#111" fill="#FFFFFF" strokeWidth={1.6} />
		</div>
	);
};

// logo do Rotina no desenho do modelo: icone + nome + subtitulo pequeno na cor do acento
// pop = false: o icone ja esta no lugar (veio do cartao que virou icone) e so o nome e o subtitulo aparecem
export const Logo: React.FC<{f: number; at: number; size?: number; sub?: string; desenha?: boolean; pop?: boolean}> = ({f, at, size = 132, sub = 'hábitos · treino · dinheiro', desenha = true, pop = true}) => {
	const nome = 'ROTINA';
	const sNome = size * 0.82;
	const wNome = larg(nome, sNome, 700, FD, 0.02);
	const sSub = size * 0.24;
	const wSub = larg(sub, sSub, 600);
	const icon = pop ? sp(f, at, {stiffness: 260, damping: 18}) : 1;
	const draw = desenha ? tw(f, [at + 2, at + 18], [0, 1], E.soft) : 1;
	// o nome e o subtitulo aparecem da esquerda para a direita, saindo de tras do icone
	const rev = tw(f, [at + 6, at + 22], [0, 1], E.out);
	const revSub = tw(f, [at + 14, at + 28], [0, 1], E.out);
	const total = size + 24 + wNome + 14 + wSub;
	return (
		<div style={{position: 'relative', width: total, height: size, display: 'flex', alignItems: 'center'}}>
			<div style={{position: 'relative', zIndex: 2, width: size, height: size, transform: `scale(${Math.min(1.08, icon)})`, filter: 'drop-shadow(0 18px 40px rgba(224,30,38,0.35))'}}>
				<AppMark size={size} bg={C.redFill} fg="#FFFFFF" draw={draw} />
			</div>
			<div style={{position: 'relative', zIndex: 1, marginLeft: 24, display: 'flex', alignItems: 'baseline', gap: 14, transform: `translateX(${(1 - rev) * -(wNome * 0.5)}px)`, opacity: rev, filter: rev < 1 ? `blur(${(1 - rev) * 10}px)` : undefined}}>
				<span style={{fontFamily: FD, fontWeight: 700, fontSize: sNome, letterSpacing: '0.02em', color: C.text, whiteSpace: 'nowrap'}}>{nome}</span>
				<span style={{fontFamily: F, fontWeight: 600, fontSize: sSub, color: C.red, whiteSpace: 'nowrap', opacity: revSub, transform: `translateX(${(1 - revSub) * -20}px)`}}>{sub}</span>
			</div>
		</div>
	);
};
export const larguraLogo = (size = 132, sub = 'hábitos · treino · dinheiro') => size + 24 + larg('ROTINA', size * 0.82, 700, FD, 0.02) + 14 + larg(sub, size * 0.24, 600);
