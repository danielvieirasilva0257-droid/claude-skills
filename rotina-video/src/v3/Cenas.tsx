import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ArrowDownRight, ArrowUpRight, Dumbbell, PiggyBank, TrendingUp, Utensils} from 'lucide-react';
import {body, display, E, K, M, sp, tw, kf} from './theme';
import {W} from './tempo';
import {phonePose} from './rig';
import {bbox} from './camera';

// Camada 2D do Rotina v3 (fica ENTRE o fundo e o celular do Blender: regra 3).
// Regras do editor: texto nunca sobre texto; nada de mascara no meio da tela; texto entra da borda do quadro ou de tras
// do celular. Titulos so na faixa de cima (y 290-460), cartoes na coluna livre ao lado do celular, tudo na zona segura.

const MARGEM = 72;
const TOPO = 292;
const TAM = 176; // titulo: Barlow Condensed 600, caixa alta

let ctx: CanvasRenderingContext2D | null = null;
export const largura = (txt: string, size: number, weight = 600, font = display) => {
	if (typeof document === 'undefined') return txt.length * size * 0.5;
	if (!ctx) ctx = document.createElement('canvas').getContext('2d');
	(ctx as CanvasRenderingContext2D).font = `${weight} ${size}px "${font}"`;
	return (ctx as CanvasRenderingContext2D).measureText(txt).width * 1.01 + size * 0.02 * txt.length;
};

const centro = (f: number) => {
	const b = bbox(phonePose(f));
	return {x: (b.x0 + b.x1) / 2, y: (b.y0 + b.y1) / 2, b};
};

// desfoque direcional proporcional a velocidade (alvo 8 px, teto 24 px; motion-oficial)
const Borrao: React.FC<{id: string; dx: number; dy: number; children: React.ReactNode}> = ({id, dx, dy, children}) => {
	const sx = Math.min(24, Math.abs(dx) * 0.38);
	const sy = Math.min(24, Math.abs(dy) * 0.38);
	if (sx < 0.5 && sy < 0.5) return <>{children}</>;
	return (
		<div style={{position: 'absolute', inset: 0, filter: `url(#${id})`}}>
			<svg width={0} height={0} style={{position: 'absolute'}}>
				<filter id={id} filterUnits="userSpaceOnUse" x={-3000} y={-3000} width={7080} height={7920}>
					<feGaussianBlur stdDeviation={`${sx.toFixed(2)} ${sy.toFixed(2)}`} />
				</filter>
			</svg>
			{children}
		</div>
	);
};

// ---------------------------------------------------------------- titulo que entra pela borda (e sai por onde entrou)
type Lado = 'esq' | 'dir';
const deslocTitulo = (f: number, at: number, out: number | undefined, lado: Lado, w: number) => {
	const fora = lado === 'esq' ? -(MARGEM + w + 60) : MARGEM + w + 60;
	const e = tw(f, [at, at + 16], [1, 0], E.out);
	const s = out === undefined ? 0 : tw(f, [out, out + 10], [0, 1], E.exit);
	return fora * e + fora * s;
};

export const Titulo: React.FC<{f: number; txt: string; at: number; out?: number; lado: Lado; y?: number; size?: number; cor?: string; id: string}> = ({
	f,
	txt,
	at,
	out,
	lado,
	y = TOPO,
	size = TAM,
	cor = K.text,
	id,
}) => {
	if (f < at - 1 || (out !== undefined && f > out + 11)) return null;
	const w = largura(txt, size);
	const dx = deslocTitulo(f, at, out, lado, w);
	const v = dx - deslocTitulo(f - 1, at, out, lado, w);
	const x = lado === 'esq' ? MARGEM : 1080 - MARGEM - w;
	const deriva = 2.5 * Math.sin(f / 23); // nada parado (alguns px)
	return (
		<Borrao id={id} dx={v} dy={0}>
			<div style={{position: 'absolute', left: x + dx + deriva, top: y, fontFamily: display, fontWeight: 600, fontSize: size, lineHeight: 0.95, letterSpacing: '0.01em', color: cor, whiteSpace: 'nowrap', textTransform: 'uppercase'}}>{txt}</div>
		</Borrao>
	);
};

// ---------------------------------------------------------------- cartao que sai de tras do celular
const Pilula: React.FC<{icon?: React.ReactNode; txt: string; cor?: string; fundo?: string; borda?: string}> = ({icon, txt, cor = K.text, fundo = K.s2, borda = K.line}) => (
	<div style={{display: 'inline-flex', alignItems: 'center', gap: 22, height: 132, padding: icon ? '0 46px 0 24px' : '0 46px', borderRadius: 66, background: fundo, border: `2px solid ${borda}`, fontFamily: body, fontWeight: 500, fontSize: 56, color: cor, whiteSpace: 'nowrap'}}>
		{icon ? <div style={{width: 86, height: 86, borderRadius: 43, background: K.s3, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{icon}</div> : null}
		{txt}
	</div>
);
const largPilula = (txt: string, icon: boolean) => largura(txt, 56, 500, body) + (icon ? 24 + 86 + 22 + 46 : 92) + 4;

const posCartao = (f: number, at: number, out: number | undefined, alvo: {x: number; y: number}, w: number, saida: Lado) => {
	const o = centro(at);
	const ox = o.x - w / 2;
	const oy = o.y - 66;
	const k = sp(f, at, M.atras); // ~9 q, ~2%
	let x = ox + (alvo.x - ox) * k;
	let y = oy + (alvo.y - oy) * k;
	if (out !== undefined) {
		const s = tw(f, [out, out + 10], [0, 1], E.exit);
		x += (saida === 'esq' ? -(alvo.x + w + 80) : 1080 - alvo.x + 80) * s;
	}
	return {x, y};
};

export const Cartao: React.FC<{f: number; at: number; out?: number; alvo: {x: number; y: number}; txt: string; icon?: React.ReactNode; saida: Lado; id: string; cor?: string}> = ({
	f,
	at,
	out,
	alvo,
	txt,
	icon,
	saida,
	id,
	cor,
}) => {
	if (f < at || (out !== undefined && f > out + 11)) return null;
	const w = largPilula(txt, !!icon);
	const p = posCartao(f, at, out, alvo, w, saida);
	const q = posCartao(f - 1, at, out, alvo, w, saida);
	return (
		<Borrao id={id} dx={p.x - q.x} dy={p.y - q.y}>
			<div style={{position: 'absolute', left: p.x, top: p.y + 2 * Math.sin(f / 29 + at)}}>
				<Pilula txt={txt} icon={icon} cor={cor} />
			</div>
		</Borrao>
	);
};

// ---------------------------------------------------------------- os 3 selos do gancho (dieta, academia, dinheiro)
const SELOS = [
	{txt: 'Dieta', Icon: Utensils, at: W(2, 'Dieta'), y: 660, canto: {x: 110, y: 640}, sai: -260, volta: W(5, 'junta'), tom: K.s3},
	{txt: 'Academia', Icon: Dumbbell, at: W(2, 'academia'), y: 820, canto: {x: 812, y: 540}, sai: 1300, volta: W(5, 'as'), tom: '#242424'},
	{txt: 'Dinheiro', Icon: PiggyBank, at: W(2, 'dinheiro'), y: 980, canto: {x: 150, y: 1030}, sai: -260, volta: W(5, 'três'), tom: '#2C2C2C'},
];
const VIRA = W(3, 'Aí'); // a pilula vira "app" (so o icone)
const ESPALHA = W(3, 'fica');
const SAEM = W(4, 'quarta') - 2;
const VOLTAM = W(5, 'Rotina') + 2;

const Selos: React.FC<{f: number}> = ({f}) => (
	<>
		{SELOS.map((s, i) => {
			if (f < s.at || f > s.volta + 6) return null;
			const wFull = largPilula(s.txt, true);
			const quad = 196;
			const o = centro(s.at);
			const k = sp(f, s.at, M.atras);
			// 1) sai de tras do celular para a coluna da esquerda
			let x = o.x - wFull / 2 + (MARGEM - (o.x - wFull / 2)) * k;
			let y = o.y - 66 + (s.y - (o.y - 66)) * k;
			// 2) vira icone de app e 3) se espalha para os cantos
			const m = tw(f, [VIRA + 2, VIRA + 12], [0, 1], E.uiMove);
			const w = wFull + (quad - wFull) * m;
			const h = 132 + (quad - 132) * m;
			const txtOp = 1 - tw(f, [VIRA - 3, VIRA + 3], [0, 1], E.ui);
			const sp1 = tw(f, [ESPALHA, ESPALHA + 18], [0, 1], E.out);
			x += (s.canto.x - x) * sp1;
			y += (s.canto.y - y) * sp1;
			// 4) saem pela borda mais proxima (quarta) ...
			const fora = tw(f, [SAEM + i * 2, SAEM + i * 2 + 12], [0, 1], E.exit);
			x += (s.sai - x) * fora;
			// 5) ... e voltam para tras do celular (a revelacao junta as tres)
			if (f >= VOLTAM - 24) {
				const c = centro(f);
				const t = tw(f, [s.volta - 16, s.volta + 2], [0, 1], E.pull);
				const sx = s.sai;
				const sy = s.canto.y;
				x = sx + (c.x - quad / 2 - sx) * t;
				y = sy + (c.y - quad / 2 - sy) * t;
			}
			const a = f >= VOLTAM - 24 ? 1 - tw(f, [s.volta + 2, s.volta + 6], [0, 1], E.lin) : 1;
			const xp = f - 1 >= s.at ? x : x;
			return (
				<div key={s.txt} style={{position: 'absolute', left: x, top: y + 2 * Math.sin(f / 31 + i), width: w, height: h, opacity: a}}>
					<div style={{position: 'absolute', inset: 0, borderRadius: 66 - 18 * m, background: m > 0 ? s.tom : K.s2, border: `2px solid ${K.line}`, display: 'flex', alignItems: 'center', gap: 22, padding: `0 ${46 * (1 - m)}px 0 ${24 + 31 * m}px`, overflow: 'hidden', fontFamily: body, fontWeight: 500, fontSize: 56, color: K.text, whiteSpace: 'nowrap'}}>
						<div style={{width: 86, height: 86, flexShrink: 0, borderRadius: 43, background: m > 0 ? 'transparent' : K.s3, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<s.Icon size={46 + 40 * m} color={K.text} strokeWidth={2} />
						</div>
						<span style={{opacity: txtOp}}>{s.txt}</span>
					</div>
					{xp === x ? null : null}
				</div>
			);
		})}
	</>
);

// ---------------------------------------------------------------- ROTINA sai de tras do celular, para cima
const RotinaTitulo: React.FC<{f: number}> = ({f}) => {
	const at = W(5, 'mesmo') - 6;
	const out = W(6, 'Cada') - 8;
	if (f < at || f > out + 12) return null;
	const size = 210;
	const w = largura('ROTINA', size);
	const c = centro(at);
	const y0 = c.y - 120;
	const y1 = TOPO - 6;
	// nasce centrado no celular e 20% menor (a caixa inteira cabe atras dele, que esta girando), cresce subindo
	const pos = (g: number) => {
		const k = sp(g, at, M.atras);
		let y = y0 + (y1 - y0) * k;
		y -= tw(g, [out, out + 10], [0, 1], E.exit) * (y1 + 260);
		return {y, x: c.x + (540 - c.x) * Math.min(1, k), s: 0.8 + 0.2 * Math.min(1, k)};
	};
	const p = pos(f);
	const q = pos(f - 1);
	return (
		<Borrao id="v3rotina" dx={p.x - q.x} dy={p.y - q.y}>
			<div style={{position: 'absolute', left: p.x - w / 2, top: p.y, width: w, textAlign: 'center', transform: `scale(${p.s})`, transformOrigin: '50% 0', fontFamily: display, fontWeight: 600, fontSize: size, lineHeight: 0.95, letterSpacing: '0.02em', color: K.text, whiteSpace: 'nowrap'}}>ROTINA</div>
		</Borrao>
	);
};

// ---------------------------------------------------------------- "+1" sai de tras do celular, ao lado da chama
const MaisUm: React.FC<{f: number}> = ({f}) => {
	const at = W(6, 'foguinho') + 2;
	const back = W(7, 'E') - 2;
	if (f < at || f > back + 12) return null;
	const size = 230;
	const w = largura('+1', size);
	const c = centro(at);
	const alvo = {x: 660, y: 640};
	const pos = (g: number) => {
		const k = sp(g, at, M.atras) - tw(g, [back, back + 10], [0, 1], E.exit);
		return {x: c.x - w / 2 + (alvo.x - (c.x - w / 2)) * k, y: c.y - 120 + (alvo.y - (c.y - 120)) * k};
	};
	const p = pos(f);
	const q = pos(f - 1);
	return (
		<Borrao id="v3mais1" dx={p.x - q.x} dy={p.y - q.y}>
			<div style={{position: 'absolute', left: p.x, top: p.y, fontFamily: display, fontWeight: 600, fontSize: size, lineHeight: 0.95, color: K.redHi}}>+1</div>
		</Borrao>
	);
};

// ---------------------------------------------------------------- SEGUNDA riscada (traco desenhado, sem mascara)
const SegundaRiscada: React.FC<{f: number}> = ({f}) => {
	const at = W(12, 'segunda') - 4;
	const out = W(13, 'Baixe') - 4;
	if (f < at - 1 || f > out + 11) return null;
	const w = largura('SEGUNDA', TAM);
	const dx = deslocTitulo(f, at, out, 'esq', w);
	const v = dx - deslocTitulo(f - 1, at, out, 'esq', w);
	const risco = tw(f, [W(12, 'segunda') + 8, W(12, 'segunda') + 20], [0, 1], E.out);
	return (
		<Borrao id="v3seg2" dx={v} dy={0}>
			<div style={{position: 'absolute', left: MARGEM + dx, top: TOPO}}>
				<div style={{fontFamily: display, fontWeight: 600, fontSize: TAM, lineHeight: 0.95, letterSpacing: '0.01em', color: K.text2, whiteSpace: 'nowrap'}}>SEGUNDA</div>
				<div style={{position: 'absolute', left: -8, top: TAM * 0.43, width: (w + 16) * risco, height: 14, borderRadius: 7, background: K.red}} />
			</div>
		</Borrao>
	);
};

// ---------------------------------------------------------------- LINK NA BIO: botao que sai de tras do celular e afunda
const LinkNaBio: React.FC<{f: number}> = ({f}) => {
	const at = W(13, 'Link') - 3;
	if (f < at) return null;
	const txt = 'LINK NA BIO';
	const w = largura(txt, 76, 600) + 140;
	const c = centro(at);
	const alvoY = 500;
	const k = sp(f, at, M.atras);
	const y = c.y - 80 + (alvoY - (c.y - 80)) * k;
	const toque = W(13, 'bio') + 2;
	const afunda = f < toque ? 0 : f < toque + 3 ? tw(f, [toque, toque + 3], [0, 1], E.press) : 1 - tw(f, [toque + 3, toque + 8], [0, 1], E.ui);
	return (
		<div style={{position: 'absolute', left: 540 - w / 2, top: y + 4 * afunda, width: w, height: 132, borderRadius: 66, background: K.red, borderBottom: `${6 - 3 * afunda}px solid #8F0000`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display, fontWeight: 600, fontSize: 76, letterSpacing: '0.03em', color: '#FFFFFF'}}>
			{txt}
		</div>
	);
};

// ---------------------------------------------------------------- a cena inteira (camada do meio)
export const Cenas: React.FC<{f: number}> = ({f}) => {
	const C = (n: number, w: string, k = 0) => W(n, w, k);
	return (
		<AbsoluteFill>
			{/* gancho */}
			<Titulo f={f} id="t1" txt="Segunda" at={C(1, 'Segunda') - 2} out={C(3, 'Aí') - 6} lado="esq" />
			<Titulo f={f} id="t2" txt="eu começo." at={C(1, 'eu')} out={C(3, 'Aí') - 4} lado="esq" y={TOPO + 182} size={104} cor={K.text2} />
			<Selos f={f} />
			<Titulo f={f} id="t3" txt="Diferente" at={C(3, 'diferente') - 2} out={C(4, 'Na') - 6} lado="esq" size={150} />
			<Titulo f={f} id="t4" txt="Quarta" at={C(4, 'quarta') - 2} out={C(5, 'O') - 6} lado="dir" cor={K.redHi} />
			<Titulo f={f} id="t5" txt="já perdeu a conta." at={C(4, 'perdeu') - 4} out={C(5, 'O') - 4} lado="dir" y={TOPO + 182} size={88} cor={K.text2} />
			{/* revelacao */}
			<RotinaTitulo f={f} />
			{/* habitos */}
			<MaisUm f={f} />
			<Titulo f={f} id="t6" txt="Furou" at={C(7, 'furou') - 2} out={C(8, 'semana') - 12} lado="dir" cor={K.redHi} />
			{/* treino */}
			<Titulo f={f} id="t7" txt="Semana" at={C(8, 'semana') - 2} out={C(9, 'Anotou') - 6} lado="esq" />
			<Cartao f={f} id="c1" txt="Seg · Peito" at={C(8, 'segunda')} out={C(9, 'Anotou') - 4} alvo={{x: MARGEM, y: 680}} saida="esq" />
			<Cartao f={f} id="c2" txt="Ter · Costas" at={C(8, 'terça')} out={C(9, 'Anotou') - 2} alvo={{x: MARGEM, y: 840}} saida="esq" />
			<Cartao f={f} id="c3" txt="82,5 kg" icon={<Dumbbell size={46} color={K.text} />} at={C(9, 'peso')} out={C(10, 'Entrou') - 10} alvo={{x: MARGEM, y: 680}} saida="esq" />
			<Cartao f={f} id="c4" txt="10 repetições" at={C(9, 'repetição')} out={C(10, 'Entrou') - 8} alvo={{x: MARGEM, y: 840}} saida="esq" />
			<Cartao f={f} id="c5" txt="+19%" icon={<TrendingUp size={46} color={K.redHi} />} at={C(9, 'gráfico')} out={C(10, 'Entrou') - 6} alvo={{x: MARGEM, y: 1000}} saida="esq" cor={K.redHi} />
			{/* financeiro */}
			<Cartao f={f} id="c6" txt="Salário" icon={<ArrowUpRight size={48} color={K.text} />} at={C(10, 'salário')} out={C(11, 'Conta') - 10} alvo={{x: 620, y: 680}} saida="dir" />
			<Cartao f={f} id="c7" txt="PIX" icon={<ArrowDownRight size={48} color={K.text} />} at={C(10, 'PIX')} out={C(11, 'Conta') - 8} alvo={{x: 620, y: 840}} saida="dir" />
			<Titulo f={f} id="t8" txt="Saldo" at={C(10, 'saldo') - 2} out={C(11, 'Conta') - 8} lado="dir" cor={K.redHi} />
			<Titulo f={f} id="t9" txt="Fixa" at={C(11, 'fixa') - 2} out={C(12, 'Nem') - 6} lado="esq" />
			<Titulo f={f} id="t10" txt="Pontual" at={C(11, 'pontual') - 2} out={C(12, 'Nem') - 6} lado="dir" cor={K.redHi} />
			{/* fechamento */}
			<SegundaRiscada f={f} />
			<Titulo f={f} id="t11" txt="Baixe" at={C(13, 'Baixe') + 6} lado="esq" />
			<Titulo f={f} id="t12" txt="Agora" at={C(13, 'agora') - 2} lado="dir" cor={K.redHi} />
			<LinkNaBio f={f} />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- fundo: palco escuro com halo neutro atras do celular
export const Fundo: React.FC<{f: number}> = ({f}) => {
	const c = centro(f);
	const r = 820;
	return (
		<AbsoluteFill style={{background: K.bg}}>
			<AbsoluteFill style={{background: `radial-gradient(circle ${r}px at ${c.x.toFixed(1)}px ${(c.y - 60).toFixed(1)}px, ${K.halo} 0%, rgba(20,20,20,0.55) 45%, rgba(8,8,8,0) 100%)`}} />
		</AbsoluteFill>
	);
};

export const _kf = kf; // (reservado para ajustes finos de coreografia)
