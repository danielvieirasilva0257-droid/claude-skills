import React from 'react';
import {body, c, display, easeIn, tween} from '../theme';

// Kinetic caption: words appear in sync with the narration (spread between `from` and `to`),
// kicker on top, optional chips that pop at given frames, blur-out exit at `out`.
export const Headline: React.FC<{
	f: number;
	text: string;
	from: number;
	to: number;
	out: number;
	kicker?: string;
	accent?: Record<string, string>;
	chips?: {label: string; at: number; color?: string}[];
	size?: number;
	top?: number;
}> = ({f, text, from, to, out, kicker, accent = {}, chips = [], size = 104, top = 120}) => {
	if (f < from - 12 || f > out + 14) return null;
	const words = text.split(' ');
	let offset = 0;
	const timed = words.map((w) => {
		const t = from + (offset / text.length) * (to - from);
		offset += w.length + 1;
		return {w, t};
	});
	const exit = tween(f, [out, out + 10], [0, 1], easeIn);
	return (
		<div
			style={{
				position: 'absolute',
				left: 70,
				right: 70,
				top,
				opacity: 1 - exit,
				transform: `translateY(${-50 * exit}px)`,
				filter: `blur(${12 * exit}px)`,
			}}
		>
			{kicker && (
				<div style={{display: 'flex', alignItems: 'center', gap: 16, fontFamily: display, fontSize: 38, fontWeight: 700, color: c.redHi, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: tween(f, [from - 10, from - 2], [0, 1])}}>
					{kicker}
					<div style={{height: 3, width: tween(f, [from - 10, from + 8], [0, 110]), background: c.red, borderRadius: 2}} />
				</div>
			)}
			<div style={{display: 'flex', flexWrap: 'wrap', columnGap: size * 0.24, fontFamily: display, fontSize: size, fontWeight: 800, lineHeight: 0.98, textTransform: 'uppercase'}}>
				{timed.map(({w, t}, i) => {
					const key = w.toLowerCase().replace(/[.,?!:]/g, '');
					const color = accent[key] ?? c.text;
					const d = t - 3;
					return (
						<span
							key={i}
							style={{
								display: 'inline-block',
								color,
								opacity: tween(f, [d, d + 6], [0, 1]),
								transform: `translateY(${tween(f, [d, d + 12], [size * 0.55, 0])}px) scale(${tween(f, [d, d + 12], [1.15, 1])})`,
								filter: `blur(${tween(f, [d, d + 9], [14, 0])}px)`,
							}}
						>
							{w}
						</span>
					);
				})}
			</div>
			{chips.length > 0 && (
				<div style={{display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 22}}>
					{chips.map(({label, at, color = c.redHi}) => (
						<div
							key={label}
							style={{
								fontFamily: body,
								fontSize: 30,
								fontWeight: 700,
								padding: '8px 22px',
								borderRadius: 40,
								border: `2px solid ${color}`,
								background: color + '24',
								color: c.text,
								opacity: tween(f, [at, at + 6], [0, 1]),
								transform: `scale(${tween(f, [at, at + 12], [0.5, 1])})`,
							}}
						>
							{label}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

// Floating badge that pops out of the phone toward the camera (rendered inside the PhoneRig)
export const PopOut: React.FC<{
	f: number;
	from: number;
	to: number;
	x: number;
	y: number;
	z?: number;
	children: React.ReactNode;
}> = ({f, from, to, x, y, z = 160, children}) => {
	if (f < from || f > to + 12) return null;
	const inP = tween(f, [from, from + 14], [0, 1]);
	const outP = tween(f, [to, to + 10], [0, 1], easeIn);
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				transform: `translate(-50%, -50%) translateZ(${z * inP}px) scale(${(0.4 + 0.6 * inP) * (1 - 0.3 * outP)})`,
				opacity: inP * (1 - outP),
			}}
		>
			{children}
		</div>
	);
};

export const Badge: React.FC<{color: string; children: React.ReactNode}> = ({color, children}) => (
	<div
		style={{
			display: 'flex',
			alignItems: 'center',
			gap: 10,
			padding: '16px 26px',
			borderRadius: 22,
			background: 'rgba(16,16,16,0.92)',
			border: `2px solid ${color}`,
			boxShadow: `0 24px 60px rgba(0,0,0,0.6), 0 0 40px ${color}55`,
			fontFamily: display,
			fontSize: 44,
			fontWeight: 800,
			color,
			whiteSpace: 'nowrap',
		}}
	>
		{children}
	</div>
);
