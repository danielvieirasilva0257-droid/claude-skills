import React from 'react';
import {c, tween} from '../../theme';

// Finger-tap indicator: a white dot that presses in and leaves a ripple
export const Tap: React.FC<{f: number; at: number; x?: number | string; y?: number | string; size?: number}> = ({
	f,
	at,
	x = '50%',
	y = '50%',
	size = 44,
}) => {
	const l = f - at;
	if (l < -6 || l > 22) return null;
	const press = tween(l, [-6, 0], [0, 1]);
	const ripple = tween(l, [0, 18], [0, 1]);
	return (
		<div style={{position: 'absolute', left: x, top: y, width: 0, height: 0, pointerEvents: 'none', zIndex: 5}}>
			<div
				style={{
					position: 'absolute',
					left: -size / 2,
					top: -size / 2,
					width: size,
					height: size,
					borderRadius: '50%',
					background: 'rgba(255,255,255,0.55)',
					opacity: press * (1 - tween(l, [4, 14], [0, 1])),
					transform: `scale(${0.6 + 0.4 * press - 0.15 * tween(l, [0, 4], [0, 1])})`,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: -size,
					top: -size,
					width: size * 2,
					height: size * 2,
					borderRadius: '50%',
					border: '2px solid rgba(255,255,255,0.7)',
					opacity: l >= 0 ? 1 - ripple : 0,
					transform: `scale(${0.3 + 0.9 * ripple})`,
				}}
			/>
		</div>
	);
};

// Small colored status chip
export const Chip: React.FC<{color: string; children: React.ReactNode; style?: React.CSSProperties}> = ({
	color,
	children,
	style,
}) => (
	<span
		style={{
			display: 'inline-flex',
			alignItems: 'center',
			height: 22,
			padding: '0 8px',
			borderRadius: 11,
			fontSize: 11,
			fontWeight: 700,
			color,
			background: color + '22',
			border: `1px solid ${color}55`,
			...style,
		}}
	>
		{children}
	</span>
);

export const Ring: React.FC<{pct: number; size: number; stroke: number; color: string; children?: React.ReactNode}> = ({
	pct,
	size,
	stroke,
	color,
	children,
}) => {
	const r = (size - stroke) / 2;
	const circ = 2 * Math.PI * r;
	return (
		<div style={{position: 'relative', width: size, height: size, flexShrink: 0}}>
			<svg width={size} height={size} style={{transform: 'rotate(-90deg)'}}>
				<circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={c.track} strokeWidth={stroke} />
				<circle
					cx={size / 2}
					cy={size / 2}
					r={r}
					fill="none"
					stroke={color}
					strokeWidth={stroke}
					strokeLinecap="round"
					strokeDasharray={circ}
					strokeDashoffset={circ * (1 - Math.max(0, Math.min(1, pct)))}
				/>
			</svg>
			<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
				{children}
			</div>
		</div>
	);
};
