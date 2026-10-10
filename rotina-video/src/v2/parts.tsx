import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {DISPLAY, P, SANS, ease, sp, tw} from './theme';
import {bodyQuad, phonePose} from './rig';

// Composition rules (from the editor, Daniel, 2026-10-10):
// 1. Nothing overlaps: no text over text, no logo over text, no text over the phone screen.
// 2. Layer order: background -> text -> main element (the phone) on top.
// 3. No masks that cut an element in the middle of the frame; no animation touching the bounds of its own layer.
// 4. Motivated entrances: text comes from OUTSIDE the frame or from BEHIND the phone.

// ---------- film grain (on top of everything), animated with a stepped seed
export const Grain: React.FC<{f: number; opacity?: number}> = ({f, opacity = 0.075}) => (
	<AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'overlay', opacity}}>
		<svg width="100%" height="100%">
			<filter id="v2grain">
				<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={Math.floor(f / 2) % 9} stitchTiles="stitch" />
				<feColorMatrix type="saturate" values="0" />
			</filter>
			<rect width="100%" height="100%" filter="url(#v2grain)" />
		</svg>
	</AbsoluteFill>
);

export const Vignette: React.FC<{amt?: number}> = ({amt = 0.16}) => (
	<AbsoluteFill style={{pointerEvents: 'none', background: `radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 55%, rgba(0,0,0,${amt}) 100%)`}} />
);

// ---------- editorial grid (12 columns + baseline rows), drifting slowly
export const Grid: React.FC<{f: number; color: string; opacity?: number}> = ({f, color, opacity = 1}) => {
	const off = (f * 0.35) % 90;
	return (
		<AbsoluteFill style={{opacity, pointerEvents: 'none'}}>
			<svg width={1080} height={1920}>
				{Array.from({length: 13}).map((_, i) => (
					<line key={'v' + i} x1={i * 90} y1={0} x2={i * 90} y2={1920} stroke={color} strokeWidth={1} />
				))}
				{Array.from({length: 23}).map((_, i) => (
					<line key={'h' + i} x1={0} y1={i * 90 - off} x2={1080} y2={i * 90 - off} stroke={color} strokeWidth={1} />
				))}
			</svg>
		</AbsoluteFill>
	);
};

// ---------- directional motion blur on a full-frame layer (the filter region covers far beyond the frame: never clips)
export const DirBlur: React.FC<{id: string; amount: number; angle?: number; children: React.ReactNode}> = ({id, amount, angle = 0, children}) => {
	const frame: React.CSSProperties = {position: 'absolute', left: 0, top: 0, width: 1080, height: 1920};
	if (amount < 0.6) return <div style={frame}>{children}</div>;
	const a = (angle * Math.PI) / 180;
	const sx = Math.abs(Math.cos(a)) * amount;
	const sy = Math.abs(Math.sin(a)) * amount;
	return (
		<div style={{...frame, filter: `url(#${id})`}}>
			<svg width={0} height={0} style={{position: 'absolute'}}>
				<filter id={id} filterUnits="userSpaceOnUse" x={-3000} y={-3000} width={7080} height={7920}>
					<feGaussianBlur stdDeviation={`${sx.toFixed(2)} ${sy.toFixed(2)}`} />
				</filter>
			</svg>
			{children}
		</div>
	);
};

// ---------- text measurement with the loaded fonts (fonts are ready before any frame renders)
let measureCtx: CanvasRenderingContext2D | null = null;
const ctx2d = () => {
	if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d');
	return measureCtx as CanvasRenderingContext2D;
};
export const textWidth = (text: string, size: number, font = DISPLAY, italic = false, weight = 400) => {
	const c = ctx2d();
	c.font = `${italic ? 'italic ' : ''}${weight} ${size}px "${font}"`;
	return c.measureText(text).width;
};
// baseline and cap height inside a CSS line box of height lineHeight*size (half-leading model)
export const textMetrics = (size: number, lineHeight = 1, font = DISPLAY) => {
	const c = ctx2d();
	c.font = `400 ${size}px "${font}"`;
	const m = c.measureText('HÁ');
	const fa = m.fontBoundingBoxAscent;
	const fd = m.fontBoundingBoxDescent;
	const baseline = (size * lineHeight - (fa + fd)) / 2 + fa;
	const cap = c.measureText('H').actualBoundingBoxAscent;
	return {baseline, cap};
};

type Dir = 'left' | 'right' | 'top' | 'bottom';
// offset that puts a box (x, y, w, h) completely outside the frame on a side
const outside = (d: Dir, x: number, y: number, w: number, h: number) =>
	d === 'left' ? {dx: -(x + w + 80), dy: 0} : d === 'right' ? {dx: 1080 - x + 80, dy: 0} : d === 'top' ? {dx: 0, dy: -(y + h + 80)} : {dx: 0, dy: 1920 - y + 80};

export const ENTRA_CFG = {stiffness: 300, damping: 26};
export const ENTRA_POUSO = 7; // frames until an Entra lands (for sound effects)

// ---------- an element that comes in from OUTSIDE the frame and leaves to outside the frame (no masks)
export const Entra: React.FC<{
	f: number;
	at: number;
	from: Dir;
	x: number;
	y: number;
	w: number;
	h: number;
	exitAt?: number;
	exitTo?: Dir;
	exitLen?: number;
	id: string;
	children: React.ReactNode;
	style?: React.CSSProperties;
	cfg?: {stiffness: number; damping: number};
}> = ({f, at, from, x, y, w, h, exitAt = 1e9, exitTo, exitLen = 9, id, children, style, cfg = ENTRA_CFG}) => {
	if (f < at) return null;
	const e = tw(f, [exitAt, exitAt + exitLen], [0, 1], ease.in);
	if (e >= 1) return null;
	const A = outside(from, x, y, w, h);
	const B = outside(exitTo ?? from, x, y, w, h);
	const pos = (fr: number) => {
		const s = sp(fr, at, cfg);
		const ee = tw(fr, [exitAt, exitAt + exitLen], [0, 1], ease.in);
		return {dx: A.dx * (1 - s) + B.dx * ee, dy: A.dy * (1 - s) + B.dy * ee};
	};
	const p = pos(f);
	const q = pos(f - 1);
	const vx = p.dx - q.dx;
	const vy = p.dy - q.dy;
	return (
		<DirBlur id={id} amount={Math.min(42, Math.hypot(vx, vy) * 0.32)} angle={Math.abs(vx) >= Math.abs(vy) ? 0 : 90}>
			<div style={{position: 'absolute', left: x + p.dx, top: y + p.dy, width: w, height: h, ...style}}>{children}</div>
		</DirBlur>
	);
};

// ---------- an element that slides out from BEHIND the phone (render it below the phone layer)
export const ATRAS_CFG = {stiffness: 170, damping: 20};
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
	const e = tw(f, [exitAt, exitAt + exitLen], [0, 1], ease.in);
	if (e >= 1) return null;
	// start hidden inside the phone silhouette (inner rectangle of the projected body, with margins)
	const q = bodyQuad(phonePose(at));
	const L = Math.max(q[0].x, q[3].x) + 30;
	const R = Math.min(q[1].x, q[2].x) - 30;
	const T = Math.max(q[0].y, q[1].y) + 90;
	const B = Math.min(q[2].y, q[3].y) - 40;
	// the whole box must start hidden: clamp the other axis into the silhouette too (the phone may still be moving)
	const inX = Math.min(Math.max(x, L), R - w) - x;
	const inY = Math.min(Math.max(y, T), B - h) - y;
	const d0 = side === 'left' ? {dx: L - x, dy: inY} : side === 'right' ? {dx: R - w - x, dy: inY} : {dx: inX, dy: T - y};
	const out = exitTo === 'back' ? d0 : outside(exitTo, x, y, w, h);
	const pos = (fr: number) => {
		const s = sp(fr, at, ATRAS_CFG);
		const ee = tw(fr, [exitAt, exitAt + exitLen], [0, 1], ease.in);
		return {dx: d0.dx * (1 - s) + out.dx * ee, dy: d0.dy * (1 - s) + out.dy * ee};
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

// ---------- a big word split in two halves that fly in from the two frame edges and meet (no masks, no cuts)
export const PalavraDividida: React.FC<{
	f: number;
	at: number;
	text: string;
	size: number;
	color: string;
	cx: number;
	top: number;
	split?: number;
	toHeaderAt?: number;
	headerScale?: number;
	headerTop?: number;
	exitAt?: number;
	exitTo?: Dir;
	shiftX?: number;
	id: string;
}> = ({f, at, text, size, color, cx, top, split, toHeaderAt = 1e9, headerScale = 0.38, headerTop = 285, exitAt = 1e9, exitTo = 'top', shiftX = 0, id}) => {
	if (f < at) return null;
	const total = textWidth(text, size);
	const x0 = cx - total / 2;
	const k = split ?? Math.ceil(text.length / 2);
	const pre = (i: number) => textWidth(text.slice(0, i), size);
	const D = 1250;
	// critically damped: the two halves never cross each other (no overlapping letters)
	const off = (fr: number) => D * (1 - sp(fr, at, {stiffness: 320, damping: 38}));
	const o = off(f);
	const v = Math.abs(o - off(f - 1));
	const h = sp(f, toHeaderAt, {stiffness: 170, damping: 22});
	const sc = 1 - (1 - headerScale) * h;
	const ty = (headerTop - top) * h;
	const e = tw(f, [exitAt, exitAt + 10], [0, 1], ease.in);
	if (e >= 1) return null;
	const ex = outside(exitTo, cx - (total * sc) / 2, top + ty, total * sc, size * sc);
	const group = (from: number, to: number, sign: number, gid: string) => (
		<DirBlur id={gid} amount={Math.min(44, v * 0.3)} angle={0}>
			{Array.from(text.slice(from, to)).map((ch, j) => (
				<span key={j} style={{position: 'absolute', left: x0 + pre(from + j) + sign * o, top: 0, fontFamily: DISPLAY, fontSize: size, lineHeight: 1, color, whiteSpace: 'pre'}}>
					{ch}
				</span>
			))}
		</DirBlur>
	);
	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				top,
				width: 1080,
				height: size * 1.1,
				transformOrigin: `${cx}px 0px`,
				transform: `translate(${shiftX + ex.dx * e}px, ${ty + ex.dy * e}px) scale(${sc})`,
			}}
		>
			{group(0, k, -1, id + 'a')}
			{group(k, text.length, 1, id + 'b')}
		</div>
	);
};

// ---------- small pill label (Inter Tight caps)
export const Pill: React.FC<{children: React.ReactNode; bg?: string; color?: string; size?: number; style?: React.CSSProperties}> = ({
	children,
	bg = P.ink,
	color = P.paperHi,
	size = 34,
	style,
}) => (
	<div
		style={{
			display: 'inline-flex',
			alignItems: 'center',
			gap: size * 0.4,
			padding: `${size * 0.42}px ${size * 0.7}px`,
			borderRadius: size * 2,
			background: bg,
			color,
			fontFamily: SANS,
			fontWeight: 800,
			fontSize: size,
			letterSpacing: '0.06em',
			textTransform: 'uppercase',
			whiteSpace: 'nowrap',
			...style,
		}}
	>
		{children}
	</div>
);

// ---------- dark UI card (same tokens as the app)
export const UiCard: React.FC<{children: React.ReactNode; style?: React.CSSProperties; light?: boolean}> = ({children, style, light}) => (
	<div
		style={{
			background: light ? P.paperHi : '#151515',
			border: `2px solid ${light ? 'rgba(17,17,17,0.12)' : '#262626'}`,
			borderRadius: 30,
			padding: 26,
			color: light ? P.ink : '#fff',
			boxShadow: light ? '0 26px 52px rgba(0,0,0,0.3)' : '0 34px 68px rgba(0,0,0,0.28), 0 10px 20px rgba(0,0,0,0.16)',
			boxSizing: 'border-box',
			...style,
		}}
	>
		{children}
	</div>
);

// deterministic jitter
export const jit = (seed: string, amp: number) => (random(seed) - 0.5) * 2 * amp;
