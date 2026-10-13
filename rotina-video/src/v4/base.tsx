import React from 'react';
import {DirBlur, textWidth} from '../v2/parts';
import {DISPLAY, P, ease, sp, tw} from '../v2/theme';
import {W} from '../v3/tempo';
import {SEC, phonePose} from '../v3/rig';
import {bbox, bodyQuad, screenPoint} from '../v3/camera';

// Rotina v4 = o celular do Blender do v3 (mesmas poses, mesmos PNG) + o visual do v2 ("papel e tinta"):
// fundos que mudam por secao (papel, vermelho, tinta), Anton gigante, Instrument Serif italico, Inter Tight nos rotulos,
// pecas do app saindo de tras do celular. Regras do editor: nada de texto sobre texto; nenhuma mascara cortando no meio
// da tela (so formas solidas de fundo crescendo); celular por cima; texto entra pela borda ou de tras do celular;
// celular sempre reto ou inclinado para cima (as poses sao as do v3, ja conferidas).

// ---------------------------------------------------------------- tempos (voz do v3; trilha de 100 BPM do v3)
export const T = {
	redIn: W(5, 'junta') - 3, // 247: o vermelho nasce de tras do celular (virada da trilha em 250)
	paperIn: W(6, 'Cada') - 8, // 297: o papel volta, aberto do centro do celular
	inkIn: W(8, 'Você') - 4, // 421: a tinta varre da esquerda (o celular vai para a direita)
	paper2In: W(10, 'Entrou') - 8, // 576: o papel varre da direita (o celular vai para a esquerda)
	redEnd: SEC.cta - 2, // 792: vermelho do fim, de tras do celular
};
export const IRIS_LEN = 10;
export const WIPE_LEN = 12;

export type Fundo = 'paper' | 'red' | 'ink';
// fundo "dominante" em cada quadro (para cor de texto, sombra e grade)
export const fundoEm = (f: number): Fundo =>
	f < T.redIn + 5 ? 'paper' : f < T.paperIn + 6 ? 'red' : f < T.inkIn + 6 ? 'paper' : f < T.paper2In + 6 ? 'ink' : f < T.redEnd + 5 ? 'paper' : 'red';

// ---------------------------------------------------------------- celular (camera e poses do v3)
export const pose = (f: number) => phonePose(f);
export const centro = (f: number) => screenPoint(phonePose(f), 0.5, 0.5);
export const caixa = (f: number) => bbox(phonePose(f));

// ---------------------------------------------------------------- medidas
export const fitSize = (text: string, maxW: number, maxSize: number, font = DISPLAY) => Math.min(maxSize, (maxW * 100) / textWidth(text, 100, font));

// ---------------------------------------------------------------- sai de TRAS do celular do Blender (renderize abaixo da camada do celular)
type Dir = 'left' | 'right' | 'top' | 'bottom';
const fora = (d: Dir, x: number, y: number, w: number, h: number) =>
	d === 'left' ? {dx: -(x + w + 80), dy: 0} : d === 'right' ? {dx: 1080 - x + 80, dy: 0} : d === 'top' ? {dx: 0, dy: -(y + h + 80)} : {dx: 0, dy: 1920 - y + 80};

export const ATRAS = {stiffness: 170, damping: 20};
export const ATRAS_POUSO = 9;

export const Atras: React.FC<{
	f: number;
	at: number;
	side: 'left' | 'right' | 'up';
	x: number;
	y: number;
	w: number;
	h: number;
	exitAt?: number;
	exitTo?: Dir | 'back';
	exitLen?: number;
	id: string;
	children: React.ReactNode;
	style?: React.CSSProperties;
}> = ({f, at, side, x, y, w, h, exitAt = 1e9, exitTo = 'back', exitLen = 9, id, children, style}) => {
	if (f < at) return null;
	if (tw(f, [exitAt, exitAt + exitLen], [0, 1], ease.in) >= 1) return null;
	// comeca escondido dentro da silhueta do celular (retangulo interno do corpo projetado, com margens), nos dois eixos
	const q = bodyQuad(phonePose(at));
	const L = Math.max(q[0].x, q[3].x) + 30;
	const R = Math.min(q[1].x, q[2].x) - 30;
	const Tp = Math.max(q[0].y, q[1].y) + 60;
	const B = Math.min(q[2].y, q[3].y) - 40;
	const inX = Math.min(Math.max(x, L), R - w) - x;
	const inY = Math.min(Math.max(y, Tp), B - h) - y;
	const d0 = side === 'left' ? {dx: L - x, dy: inY} : side === 'right' ? {dx: R - w - x, dy: inY} : {dx: inX, dy: Tp - y};
	const out = exitTo === 'back' ? d0 : fora(exitTo, x, y, w, h);
	const pos = (fr: number) => {
		const s = sp(fr, at, ATRAS);
		const e = tw(fr, [exitAt, exitAt + exitLen], [0, 1], ease.in);
		return {dx: d0.dx * (1 - s) + out.dx * e, dy: d0.dy * (1 - s) + out.dy * e};
	};
	const p = pos(f);
	const pq = pos(f - 1);
	const vx = p.dx - pq.dx;
	const vy = p.dy - pq.dy;
	return (
		<DirBlur id={id} amount={Math.min(30, Math.hypot(vx, vy) * 0.3)} angle={Math.abs(vx) >= Math.abs(vy) ? 0 : 90}>
			<div style={{position: 'absolute', left: x + p.dx, top: y + p.dy, width: w, height: h, ...style}}>{children}</div>
		</DirBlur>
	);
};

// mistura de cores hex (para o adesivo que vira icone de app)
export const mix = (a: string, b: string, t: number) => {
	const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
	const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
	const k = Math.max(0, Math.min(1, t));
	return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * k)).join(',')})`;
};

export {P};
