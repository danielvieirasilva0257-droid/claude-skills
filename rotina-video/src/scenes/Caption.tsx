import React from 'react';
import {c, display, body, easeIn, tween} from '../theme';

// Feature caption above the phone: number, title (per-letter blur-in), subtitle and sub-feature chips
export const Caption: React.FC<{
	f: number; // frame relative to the caption's start
	out: number; // local frame where the exit starts
	index: string;
	title: string;
	subtitle: string;
	chips: string[];
}> = ({f, out, index, title, subtitle, chips}) => {
	const exit = tween(f, [out, out + 10], [0, 1], easeIn);
	return (
		<div
			style={{
				position: 'absolute',
				left: 80,
				right: 80,
				top: 130,
				opacity: 1 - exit,
				transform: `translateY(${-60 * exit}px)`,
				filter: `blur(${exit * 14}px)`,
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 18,
					fontFamily: display,
					fontSize: 40,
					fontWeight: 700,
					color: c.redHi,
					letterSpacing: '0.12em',
					opacity: tween(f, [0, 8], [0, 1]),
				}}
			>
				{index}
				<div style={{height: 3, width: tween(f, [0, 18], [0, 120]), background: c.red, borderRadius: 2}} />
			</div>
			<div
				style={{
					fontFamily: display,
					fontSize: 150,
					fontWeight: 800,
					lineHeight: 0.95,
					textTransform: 'uppercase',
					color: c.text,
					display: 'flex',
				}}
			>
				{title.split('').map((ch, i) => {
					const d = 2 + i * 1.5;
					return (
						<span
							key={i}
							style={{
								display: 'inline-block',
								opacity: tween(f, [d, d + 8], [0, 1]),
								transform: `translateY(${tween(f, [d, d + 16], [70, 0])}px)`,
								filter: `blur(${tween(f, [d, d + 12], [16, 0])}px)`,
							}}
						>
							{ch}
						</span>
					);
				})}
			</div>
			<div
				style={{
					fontFamily: body,
					fontSize: 40,
					fontWeight: 500,
					color: c.muted,
					marginTop: 14,
					opacity: tween(f, [10, 22], [0, 1]),
					transform: `translateY(${tween(f, [10, 26], [24, 0])}px)`,
				}}
			>
				{subtitle}
			</div>
			<div style={{display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 22}}>
				{chips.map((chip, i) => {
					const d = 16 + i * 3;
					return (
						<div
							key={chip}
							style={{
								fontFamily: body,
								fontSize: 28,
								fontWeight: 600,
								padding: '8px 22px',
								borderRadius: 40,
								border: `2px solid ${c.border}`,
								background: c.s2,
								color: c.text,
								opacity: tween(f, [d, d + 8], [0, 1]),
								transform: `scale(${tween(f, [d, d + 14], [0.6, 1])})`,
							}}
						>
							{chip}
						</div>
					);
				})}
			</div>
		</div>
	);
};
