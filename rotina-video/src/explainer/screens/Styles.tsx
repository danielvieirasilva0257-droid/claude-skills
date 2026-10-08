import React from 'react';
import {spring, useVideoConfig} from 'remotion';
import {BatteryCharging, Check, Dumbbell, Feather, Footprints, Zap, Flame} from 'lucide-react';
import {c, display} from '../../theme';
import {Card, Header, Label, rise, Screen} from '../../screens/ui';
import {Tap} from './common';

export const STYLES = [
	{id: 'forca', name: 'Força', reps: '6–8 reps', color: '#FF5A5A', Icon: Flame},
	{id: 'hiper', name: 'Hipertrofia', reps: '8–12 reps', color: '#FB923C', Icon: Dumbbell},
	{id: 'resist', name: 'Resistência', reps: '15–20 reps', color: '#34D399', Icon: Footprints},
	{id: 'potencia', name: 'Potência', reps: '3–5 reps', color: '#A78BFA', Icon: Zap},
	{id: 'lowvol', name: 'Low volume', reps: '½ das séries', color: '#22D3EE', Icon: Feather},
	{id: 'deload', name: 'Deload', reps: '~60% da carga', color: '#60A5FA', Icon: BatteryCharging},
];

// picks: [local frame, style index] — the selection follows the narration
export const StylesScreen: React.FC<{f: number; picks: [number, number][]}> = ({f, picks}) => {
	const {fps} = useVideoConfig();
	let sel = -1;
	let selAt = -999;
	for (const [t, i] of picks) if (f >= t) [sel, selAt] = [i, t];
	const pop = spring({frame: f - selAt, fps, config: {damping: 10, stiffness: 220}});
	const weeks = picks.map(([t, i]) => (f >= t ? i : -1));
	return (
		<Screen tab={1}>
			<Header kicker="Treinos · Planejar" title="Estilo da semana" f={f} />
			<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 12}}>
				{STYLES.map(({name, reps, color, Icon}, i) => {
					const on = i === sel;
					return (
						<Card
							key={name}
							style={{
								position: 'relative',
								padding: 12,
								borderColor: on ? color : c.border,
								background: on ? color + '1F' : c.s2,
								transform: `${rise(f, 4 + i * 2).transform} scale(${on ? 1 + 0.06 * Math.sin(Math.PI * Math.min(1, pop)) : 1})`,
								opacity: rise(f, 4 + i * 2).opacity,
							}}
						>
							<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
								<div style={{width: 34, height: 34, borderRadius: 10, background: color + '26', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
									<Icon size={18} color={color} />
								</div>
								{on && (
									<div style={{width: 22, height: 22, borderRadius: 11, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop})`}}>
										<Check size={14} strokeWidth={3.4} color="#080808" />
									</div>
								)}
							</div>
							<div style={{fontFamily: display, fontSize: 21, fontWeight: 700, marginTop: 8, textTransform: 'uppercase'}}>{name}</div>
							<div style={{fontSize: 12, color: c.muted}}>{reps}</div>
							{picks.filter(([, pi]) => pi === i).map(([t]) => (
								<Tap key={t} f={f} at={t - 2} x="70%" y="60%" />
							))}
						</Card>
					);
				})}
			</div>
			<Card style={rise(f, 16)}>
				<Label style={{marginBottom: 8}}>Seu mês</Label>
				<div style={{display: 'flex', gap: 6}}>
					{[0, 1, 2, 3].map((w) => {
						const st = weeks[w] !== undefined && weeks[w] >= 0 ? STYLES[weeks[w]] : null;
						return (
							<div
								key={w}
								style={{
									flex: 1,
									borderRadius: 10,
									padding: '8px 0',
									textAlign: 'center',
									background: st ? st.color + '26' : c.s3,
									border: `1px solid ${st ? st.color : 'transparent'}`,
								}}
							>
								<div style={{fontSize: 11, color: c.muted}}>Semana {w + 1}</div>
								<div style={{fontFamily: display, fontSize: 14, fontWeight: 700, color: st ? st.color : c.faint}}>
									{st ? st.name : '—'}
								</div>
							</div>
						);
					})}
				</div>
			</Card>
		</Screen>
	);
};
