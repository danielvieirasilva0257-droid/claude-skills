import React from 'react';
import {spring, useVideoConfig} from 'remotion';
import {Check, Flame} from 'lucide-react';
import {c, display} from '../../theme';
import {Card, Header, Label, rise, Screen} from '../../screens/ui';
import {Ring, Tap} from './common';

const HABITS = ['Beber 3L de água', 'Dieta', 'Ler 10 páginas', 'Treinar', 'Meditar 10 min'];
// [local frame, habit index, checked?] — tick, tick, tick, untick, tick, tick again
export const HABIT_EVENTS: [number, number, boolean][] = [
	[22, 0, true],
	[34, 1, true],
	[46, 2, true],
	[62, 3, true],
	[86, 2, false],
	[100, 4, true],
	[118, 2, true],
];

const stateAt = (f: number, i: number) => {
	let on = false;
	let at = -999;
	for (const [t, h, v] of HABIT_EVENTS) if (h === i && f >= t) [on, at] = [v, t];
	return {on, at};
};

export const HabitsList: React.FC<{f: number}> = ({f}) => {
	const {fps} = useVideoConfig();
	const done = HABITS.filter((_, i) => stateAt(f, i).on).length;
	return (
		<Screen tab={0}>
			<Header kicker="Quarta · 8 de outubro" title="Hábitos de hoje" f={f} />
			<Card style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, ...rise(f, 4)}}>
				<Ring pct={done / 5} size={72} stroke={7} color={c.redHi}>
					<span style={{fontFamily: display, fontSize: 22, fontWeight: 700}}>{done}/5</span>
				</Ring>
				<div>
					<Label>Sequência</Label>
					<div style={{display: 'flex', alignItems: 'center', gap: 6}}>
						<Flame size={24} color={c.amber} fill={c.amber} />
						<span style={{fontFamily: display, fontSize: 32, fontWeight: 800, color: c.amber}}>12</span>
						<span style={{fontSize: 14, color: c.muted}}>dias seguidos</span>
					</div>
				</div>
			</Card>
			<div style={{display: 'flex', flexDirection: 'column', gap: 9}}>
				{HABITS.map((h, i) => {
					const {on, at} = stateAt(f, i);
					const p = spring({frame: f - at, fps, config: {damping: 12, stiffness: 220}});
					const k = on ? p : 1 - p;
					const tapAt = HABIT_EVENTS.filter(([, hi]) => hi === i).map(([t]) => t);
					return (
						<Card
							key={h}
							style={{
								position: 'relative',
								display: 'flex',
								alignItems: 'center',
								gap: 12,
								padding: '13px 14px',
								borderColor: on ? 'rgba(204,0,0,0.55)' : c.border,
								...rise(f, 8 + i * 3),
							}}
						>
							<div
								style={{
									position: 'relative',
									width: 28,
									height: 28,
									borderRadius: 9,
									border: `2px solid ${k > 0.5 ? c.red : c.border}`,
									background: `rgba(204,0,0,${k})`,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									transform: `scale(${1 - 0.25 * Math.sin(Math.PI * Math.min(1, p))})`,
								}}
							>
								{k > 0.05 && <Check size={18} strokeWidth={3.2} style={{transform: `scale(${k})`}} />}
								{tapAt.map((t) => (
									<Tap key={t} f={f} at={t} />
								))}
							</div>
							<span
								style={{
									fontSize: 16,
									fontWeight: 600,
									color: on ? c.muted : c.text,
									textDecoration: on ? 'line-through' : 'none',
									textDecorationColor: c.faint,
								}}
							>
								{h}
							</span>
						</Card>
					);
				})}
			</div>
		</Screen>
	);
};
