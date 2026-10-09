import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {DISPLAY, P, SANS, SERIF, ease, sp, tw} from './theme';

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

// ---------- directional motion blur (SVG), amount in px along an angle (deg)
export const DirBlur: React.FC<{id: string; amount: number; angle?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
	id,
	amount,
	angle = 0,
	children,
	style,
}) => {
	if (amount < 0.6) return <div style={style}>{children}</div>;
	const a = (angle * Math.PI) / 180;
	const sx = Math.abs(Math.cos(a)) * amount;
	const sy = Math.abs(Math.sin(a)) * amount;
	return (
		<div style={{...style, filter: `url(#${id})`}}>
			<svg width={0} height={0} style={{position: 'absolute'}}>
				<filter id={id} x="-20%" y="-20%" width="140%" height="140%">
					<feGaussianBlur stdDeviation={`${sx.toFixed(2)} ${sy.toFixed(2)}`} />
				</filter>
			</svg>
			{children}
		</div>
	);
};

// ---------- kinetic type: a word that slams in (mask reveal from below + blur), with drift and exit
export const Slam: React.FC<{
	f: number;
	at: number;
	children: React.ReactNode;
	size: number;
	color?: string;
	font?: string;
	italic?: boolean;
	exitAt?: number;
	exitDir?: number; // -1 up, 1 down
	from?: 'below' | 'left' | 'right';
	style?: React.CSSProperties;
	tracking?: string;
}> = ({f, at, children, size, color = P.ink, font = DISPLAY, italic = false, exitAt = 1e9, exitDir = -1, from = 'below', style, tracking = '0'}) => {
	if (f < at - 1) return null;
	const s = sp(f, at, {stiffness: 300, damping: 24});
	const e = tw(f, [exitAt, exitAt + 9], [0, 1], ease.in);
	if (e >= 1) return null;
	const d = (1 - s) * size * 0.9;
	const tx = from === 'left' ? -d * 1.4 : from === 'right' ? d * 1.4 : 0;
	const ty = from === 'below' ? d : 0;
	const blur = Math.max(0, (1 - s) * 14) + e * 18;
	return (
		<div style={{overflow: 'hidden', paddingTop: size * 0.06, paddingBottom: size * 0.04, ...style}}>
			<div
				style={{
					fontFamily: font,
					fontStyle: italic ? 'italic' : 'normal',
					fontSize: size,
					lineHeight: 0.98,
					color,
					letterSpacing: tracking,
					whiteSpace: 'nowrap',
					transform: `translate(${tx}px, ${ty + e * exitDir * size * 0.8}px)`,
					filter: blur > 0.5 ? `blur(${blur.toFixed(1)}px)` : undefined,
					opacity: 1 - e,
				}}
			>
				{children}
			</div>
		</div>
	);
};

// ---------- small ink pill label (Inter Tight caps)
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

// ---------- dark UI card (same tokens as the app) used for "lifted" cards
export const UiCard: React.FC<{children: React.ReactNode; style?: React.CSSProperties; light?: boolean}> = ({children, style, light}) => (
	<div
		style={{
			background: light ? P.paperHi : '#151515',
			border: `2px solid ${light ? 'rgba(17,17,17,0.12)' : '#262626'}`,
			borderRadius: 34,
			padding: 30,
			color: light ? P.ink : '#fff',
			boxShadow: light ? '0 30px 60px rgba(0,0,0,0.35)' : '0 40px 80px rgba(0,0,0,0.28), 0 12px 24px rgba(0,0,0,0.18)',
			...style,
		}}
	>
		{children}
	</div>
);

// ---------- pop/lift helper: element flies from a source point to its spot (spring), then drifts
export const lift = (f: number, at: number, from: {x: number; y: number}, to: {x: number; y: number}, cfg = {stiffness: 170, damping: 19}) => {
	const s = sp(f, at, cfg);
	return {
		s,
		x: from.x + (to.x - from.x) * s,
		y: from.y + (to.y - from.y) * s,
		scale: 0.35 + 0.65 * Math.min(1.08, s),
		show: f >= at,
	};
};

// deterministic jitter
export const jit = (seed: string, amp: number) => (random(seed) - 0.5) * 2 * amp;

export {SERIF};
