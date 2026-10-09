import React from 'react';
import {DISPLAY, P} from './theme';

// v2 app mark: a loop (routine) closing around a check (done)
const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
	const rad = (a: number) => (a * Math.PI) / 180;
	const x0 = cx + r * Math.cos(rad(a0));
	const y0 = cy + r * Math.sin(rad(a0));
	const x1 = cx + r * Math.cos(rad(a1));
	const y1 = cy + r * Math.sin(rad(a1));
	const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
	return {d: `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`, x1, y1, a1};
};

export const AppMark: React.FC<{
	size: number;
	bg?: string;
	fg?: string;
	draw?: number; // 0..1 stroke drawing of the loop + check
	style?: React.CSSProperties;
}> = ({size, bg = P.red, fg = P.white, draw = 1, style}) => {
	const a = arc(50, 50, 25, -35, 255);
	const ah = (a.a1 * Math.PI) / 180;
	// arrow head tangent to the loop end (clockwise direction)
	const tx = -Math.sin(ah);
	const ty = Math.cos(ah);
	const nx = Math.cos(ah);
	const ny = Math.sin(ah);
	const tip = [a.x1 + tx * 9, a.y1 + ty * 9];
	const head = `M ${(a.x1 + nx * 8).toFixed(2)} ${(a.y1 + ny * 8).toFixed(2)} L ${tip[0].toFixed(2)} ${tip[1].toFixed(2)} L ${(a.x1 - nx * 8).toFixed(2)} ${(a.y1 - ny * 8).toFixed(2)} Z`;
	const loop = Math.min(1, draw / 0.7);
	const check = Math.max(0, (draw - 0.55) / 0.45);
	return (
		<svg width={size} height={size} viewBox="0 0 100 100" style={style}>
			<rect x={0} y={0} width={100} height={100} rx={26} fill={bg} />
			<path d={a.d} fill="none" stroke={fg} strokeWidth={8.5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - loop} />
			<path d={head} fill={fg} opacity={loop >= 0.98 ? 1 : 0} />
			<path d="M 37 51 L 46.5 60.5 L 64 42" fill="none" stroke={fg} strokeWidth={8.5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - check} />
		</svg>
	);
};

export const Wordmark: React.FC<{size: number; color?: string; style?: React.CSSProperties; letters?: (i: number) => React.CSSProperties}> = ({
	size,
	color = P.white,
	style,
	letters,
}) => (
	<div style={{display: 'flex', fontFamily: DISPLAY, fontSize: size, lineHeight: 0.92, letterSpacing: '0.01em', color, ...style}}>
		{'ROTINA'.split('').map((ch, i) => (
			<span key={i} style={{display: 'inline-block', ...(letters ? letters(i) : {})}}>
				{ch}
			</span>
		))}
	</div>
);
