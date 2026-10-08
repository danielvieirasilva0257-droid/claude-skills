import React from 'react';
import {spring, useVideoConfig} from 'remotion';
import {Check, Flame} from 'lucide-react';
import {c, display, tween} from '../theme';
import {Card, Header, Label, rise, Screen} from './ui';

const HABITS = ['Beber 3L de água', 'Dieta', 'Ler 10 páginas', 'Treinar', 'Meditar 10 min'];
const CHECK_AT = [16, 23, 30, 37]; // first four get ticked on screen, the last stays open
const WEEK = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

export const Habits: React.FC<{f: number}> = ({f}) => {
	const {fps} = useVideoConfig();
	const done = CHECK_AT.filter((at) => f >= at).length;
	const ringPct = tween(f, [14, 44], [0, 4 / 5]);
	const streakPop = spring({frame: f - 40, fps, config: {damping: 9, stiffness: 180}});
	const streak = f >= 40 ? 12 : 11;
	const r = 30;
	const circ = 2 * Math.PI * r;

	return (
		<Screen tab={0}>
			<Header kicker="Quarta · 8 de outubro" title="Hábitos de hoje" f={f} />

			<Card style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, ...rise(f, 4)}}>
				<div style={{position: 'relative', width: 72, height: 72}}>
					<svg width={72} height={72} style={{transform: 'rotate(-90deg)'}}>
						<circle cx={36} cy={36} r={r} fill="none" stroke={c.track} strokeWidth={7} />
						<circle
							cx={36}
							cy={36}
							r={r}
							fill="none"
							stroke={c.redHi}
							strokeWidth={7}
							strokeLinecap="round"
							strokeDasharray={circ}
							strokeDashoffset={circ * (1 - ringPct)}
						/>
					</svg>
					<div
						style={{
							position: 'absolute',
							inset: 0,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontFamily: display,
							fontSize: 22,
							fontWeight: 700,
						}}
					>
						{done}/5
					</div>
				</div>
				<div style={{flex: 1}}>
					<Label>Sequência</Label>
					<div style={{display: 'flex', alignItems: 'center', gap: 6}}>
						<Flame
							size={26}
							color={c.amber}
							fill={c.amber}
							style={{transform: `scale(${1 + 0.25 * Math.sin(Math.PI * Math.min(1, streakPop))})`}}
						/>
						<span
							style={{
								fontFamily: display,
								fontSize: 34,
								fontWeight: 800,
								color: c.amber,
								display: 'inline-block',
								transform: `scale(${0.8 + 0.2 * streakPop})`,
							}}
						>
							{streak}
						</span>
						<span style={{fontSize: 14, color: c.muted}}>dias seguidos</span>
					</div>
				</div>
			</Card>

			<div style={{display: 'flex', flexDirection: 'column', gap: 9}}>
				{HABITS.map((h, i) => {
					const at = CHECK_AT[i];
					const p = at === undefined ? 0 : spring({frame: f - at, fps, config: {damping: 12, stiffness: 200}});
					const checked = p > 0.02;
					return (
						<Card
							key={h}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 12,
								padding: '12px 14px',
								borderColor: checked ? 'rgba(204,0,0,0.5)' : c.border,
								...rise(f, 8 + i * 3),
							}}
						>
							<div
								style={{
									width: 28,
									height: 28,
									borderRadius: 9,
									border: `2px solid ${checked ? c.red : c.border}`,
									background: checked ? c.red : 'transparent',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									transform: `scale(${checked ? 0.7 + 0.3 * p : 1})`,
								}}
							>
								{checked && <Check size={18} strokeWidth={3.2} style={{transform: `scale(${p})`}} />}
							</div>
							<span
								style={{
									fontSize: 16,
									fontWeight: 600,
									color: checked ? c.muted : c.text,
									textDecoration: checked ? 'line-through' : 'none',
									textDecorationColor: c.faint,
								}}
							>
								{h}
							</span>
						</Card>
					);
				})}
			</div>

			<Card style={{marginTop: 14, ...rise(f, 24)}}>
				<Label style={{marginBottom: 10}}>Esta semana</Label>
				<div style={{display: 'flex', justifyContent: 'space-between'}}>
					{WEEK.map((d, i) => {
						const full = i < 2;
						const today = i === 2;
						return (
							<div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
								<div
									style={{
										width: 32,
										height: 32,
										borderRadius: 16,
										background: full ? c.red : today ? c.redBg : c.s3,
										border: today ? `2px solid ${c.redHi}` : 'none',
									}}
								/>
								<span style={{fontSize: 12, color: today ? c.text : c.faint, fontWeight: 600}}>{d}</span>
							</div>
						);
					})}
				</div>
			</Card>
		</Screen>
	);
};
