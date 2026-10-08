import React from 'react';
import {ArrowUpRight, Trophy, TrendingUp} from 'lucide-react';
import {c, display, tween} from '../../theme';
import {Card, Label, rise, Screen} from '../../screens/ui';
import {Tap} from './common';

const SETS = [
	{kg: '82,5', reps: '10'},
	{kg: '82,5', reps: '10'},
	{kg: '82,5', reps: '9'},
];
const POINTS = [92, 93, 95, 95, 98, 101, 104, 107, 110];
export const SAVE_TAP = 64;

// Types a value one character at a time starting at `at`
const typed = (f: number, at: number, v: string) => v.slice(0, Math.max(0, Math.min(v.length, Math.floor((f - at) / 3) + 1)));

export const LogSets: React.FC<{f: number}> = ({f}) => {
	const CW = 322;
	const CH = 80;
	const pts = POINTS.map((v, i) => [(i / (POINTS.length - 1)) * CW, CH - ((v - 88) / 24) * CH]);
	const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
	const draw = tween(f, [SAVE_TAP + 10, SAVE_TAP + 44], [0, 1]);
	const last = pts[pts.length - 1];
	const saved = f >= SAVE_TAP;
	return (
		<Screen tab={1}>
			<div style={{marginBottom: 12, ...rise(f, 0)}}>
				<div style={{fontFamily: display, fontSize: 13, fontWeight: 600, color: c.muted, letterSpacing: '0.12em', textTransform: 'uppercase'}}>
					Treino de Peito · Exercício 1/4
				</div>
				<div style={{fontFamily: display, fontSize: 34, fontWeight: 700, textTransform: 'uppercase', lineHeight: 1.05}}>Supino Reto</div>
				<div style={{display: 'flex', gap: 6, marginTop: 6}}>
					<span style={{fontSize: 12, fontWeight: 700, color: c.orange, background: 'rgba(251,146,60,0.15)', padding: '3px 8px', borderRadius: 8}}>Hipertrofia · 8–12</span>
					<span style={{fontSize: 12, fontWeight: 700, color: c.muted, background: c.s3, padding: '3px 8px', borderRadius: 8}}>Última: 80 kg × 10</span>
				</div>
			</div>
			<Card style={{marginBottom: 10, ...rise(f, 4)}}>
				<div style={{display: 'grid', gridTemplateColumns: '50px 1fr 1fr', fontSize: 12, color: c.muted, fontWeight: 600, marginBottom: 6}}>
					<span>Série</span>
					<span>Carga</span>
					<span>Reps</span>
				</div>
				{SETS.map((st, i) => {
					const at = 10 + i * 14;
					return (
						<div key={i} style={{display: 'grid', gridTemplateColumns: '50px 1fr 1fr', gap: 8, marginBottom: 7, ...rise(f, 6 + i * 3)}}>
							<div style={{fontFamily: display, fontSize: 20, fontWeight: 700, color: c.faint, alignSelf: 'center'}}>{i + 1}</div>
							{[
								[st.kg + ' kg', at],
								[st.reps, at + 7],
							].map(([v, t], k) => {
								const txt = typed(f, t as number, v as string);
								const active = f >= (t as number) && f < (t as number) + 9;
								return (
									<div
										key={k}
										style={{
											height: 40,
											borderRadius: 10,
											background: c.s3,
											border: `1px solid ${active ? c.redHi : c.border}`,
											display: 'flex',
											alignItems: 'center',
											padding: '0 12px',
											fontFamily: display,
											fontSize: 20,
											fontWeight: 700,
										}}
									>
										{txt}
										{active && <span style={{width: 2, height: 20, background: c.redHi, marginLeft: 2}} />}
									</div>
								);
							})}
						</div>
					);
				})}
				<div
					style={{
						position: 'relative',
						marginTop: 4,
						height: 44,
						borderRadius: 12,
						background: saved ? c.greenBg : c.red,
						border: saved ? '1px solid rgba(52,211,153,0.4)' : 'none',
						color: saved ? c.green : '#fff',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 8,
						fontWeight: 700,
						fontSize: 15,
					}}
				>
					{saved ? (
						<>
							<ArrowUpRight size={18} /> Próximo treino: 85 kg
						</>
					) : (
						'Salvar séries'
					)}
					<Tap f={f} at={SAVE_TAP} />
				</div>
			</Card>
			<Card style={{opacity: tween(f, [SAVE_TAP + 4, SAVE_TAP + 14], [0, 1]), transform: `translateY(${tween(f, [SAVE_TAP + 4, SAVE_TAP + 20], [30, 0])}px)`}}>
				<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
					<Label>Evolução · 1RM estimado</Label>
					<span style={{display: 'flex', alignItems: 'center', gap: 4, color: c.green, fontSize: 13, fontWeight: 700}}>
						<TrendingUp size={15} /> +19%
					</span>
				</div>
				<svg width={CW} height={CH + 6} style={{overflow: 'visible'}}>
					<defs>
						<linearGradient id="lsgrad" x1="0" x2="0" y1="0" y2="1">
							<stop offset="0" stopColor={c.redHi} stopOpacity={0.35} />
							<stop offset="1" stopColor={c.redHi} stopOpacity={0} />
						</linearGradient>
						<clipPath id="lsclip">
							<rect x={0} y={-10} width={CW * draw} height={CH + 20} />
						</clipPath>
					</defs>
					<path d={line + ` L ${CW} ${CH} L 0 ${CH} Z`} fill="url(#lsgrad)" clipPath="url(#lsclip)" />
					<path d={line} fill="none" stroke={c.redHi} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
					<circle cx={last[0]} cy={last[1]} r={6 * tween(f, [SAVE_TAP + 42, SAVE_TAP + 50], [0, 1])} fill={c.redHi} stroke={c.bg} strokeWidth={2} />
				</svg>
				<div style={{display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 13, color: c.amber, fontWeight: 600, opacity: tween(f, [SAVE_TAP + 46, SAVE_TAP + 56], [0, 1])}}>
					<Trophy size={15} /> Novo recorde: 110 kg
				</div>
			</Card>
		</Screen>
	);
};
