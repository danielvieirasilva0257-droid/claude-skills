import React from 'react';
import {interpolate, spring, useVideoConfig} from 'remotion';
import {ArrowUpRight, TrendingUp, Trophy} from 'lucide-react';
import {c, display, tween} from '../theme';
import {Card, Header, Label, Pills, rise, Screen} from './ui';

const EXERCISES = [
	{name: 'Supino Reto', meta: '3 × 10 · RPE 8', kg: 80},
	{name: 'Supino Inclinado', meta: '3 × 12 · RPE 8', kg: 30},
	{name: 'Crucifixo Máquina', meta: '3 × 12 · RPE 7', kg: 50},
];

// Estimated 1RM over the last weeks (bench press)
const POINTS = [92, 93, 95, 95, 98, 101, 104, 107];
const CW = 322;
const CH = 92;

export const Workout: React.FC<{f: number}> = ({f}) => {
	const {fps} = useVideoConfig();
	const min = 88;
	const max = 110;
	const pts = POINTS.map((v, i) => [(i / (POINTS.length - 1)) * CW, CH - ((v - min) / (max - min)) * CH]);
	const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
	const area = line + ` L ${CW} ${CH} L 0 ${CH} Z`;
	const draw = tween(f, [20, 50], [0, 1]);
	const last = pts[pts.length - 1];

	const tip = spring({frame: f - 34, fps, config: {damping: 14, stiffness: 160}});
	// swap the load in one go (a counting number smears under motion blur), with a little pop
	const bumped = f >= 38;
	const kgPop = interpolate(spring({frame: f - 38, fps, config: {damping: 8, stiffness: 220}}), [0, 0.5, 1], [1, 1.25, 1]);

	return (
		<Screen tab={1}>
			<Header kicker="Treino de hoje · Hipertrofia" title="Treino de Peito" f={f} />
			<Pills items={['Treino', 'Planejar', 'Progresso', 'Cardio']} active={0} f={f} />

			<div style={{display: 'flex', flexDirection: 'column', gap: 9}}>
				{EXERCISES.map((e, i) => (
					<Card
						key={e.name}
						style={{display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', ...rise(f, 6 + i * 3)}}
					>
						<div style={{flex: 1}}>
							<div style={{fontSize: 16, fontWeight: 600}}>{e.name}</div>
							<div style={{fontSize: 13, color: c.muted, marginTop: 2}}>{e.meta}</div>
						</div>
						<div
							style={{
								fontFamily: display,
								fontSize: 24,
								fontWeight: 700,
								fontVariantNumeric: 'tabular-nums',
								color: i === 0 && bumped ? c.green : c.text,
								transform: `scale(${i === 0 && bumped ? kgPop : 1})`,
								transformOrigin: 'right center',
							}}
						>
							{i === 0 && bumped ? '82,5' : e.kg}
							<span style={{fontSize: 14, color: c.faint}}> kg</span>
						</div>
					</Card>
				))}
			</div>

			{/* automatic progression tip, the app's signature feature */}
			<div
				style={{
					marginTop: 10,
					display: 'flex',
					alignItems: 'center',
					gap: 10,
					padding: '11px 13px',
					borderRadius: 12,
					background: c.greenBg,
					border: '1px solid rgba(52,211,153,0.35)',
					color: c.green,
					fontSize: 14,
					fontWeight: 600,
					opacity: Math.min(1, tip * 1.4),
					transform: `scale(${0.9 + 0.1 * tip}) translateY(${(1 - tip) * 12}px)`,
				}}
			>
				<ArrowUpRight size={20} strokeWidth={2.6} />
				Bateu 10 reps em todas. Aumente +2,5 kg.
			</div>

			<Card style={{marginTop: 12, ...rise(f, 16)}}>
				<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
					<Label>Evolução · Supino Reto</Label>
					<span style={{display: 'flex', alignItems: 'center', gap: 4, color: c.green, fontSize: 13, fontWeight: 700}}>
						<TrendingUp size={15} /> +16%
					</span>
				</div>
				<svg width={CW} height={CH + 6} style={{overflow: 'visible'}}>
					<defs>
						<linearGradient id="wgrad" x1="0" x2="0" y1="0" y2="1">
							<stop offset="0" stopColor={c.redHi} stopOpacity={0.35} />
							<stop offset="1" stopColor={c.redHi} stopOpacity={0} />
						</linearGradient>
						<clipPath id="wclip">
							<rect x={0} y={-10} width={CW * draw} height={CH + 20} />
						</clipPath>
					</defs>
					<g clipPath="url(#wclip)">
						<path d={area} fill="url(#wgrad)" />
					</g>
					<path
						d={line}
						fill="none"
						stroke={c.redHi}
						strokeWidth={3}
						strokeLinecap="round"
						strokeLinejoin="round"
						pathLength={1}
						strokeDasharray={1}
						strokeDashoffset={1 - draw}
					/>
					<circle cx={last[0]} cy={last[1]} r={6 * tween(f, [48, 56], [0, 1])} fill={c.redHi} stroke={c.bg} strokeWidth={2} />
				</svg>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 6,
						marginTop: 8,
						fontSize: 13,
						color: c.amber,
						fontWeight: 600,
						opacity: tween(f, [50, 60], [0, 1]),
					}}
				>
					<Trophy size={15} /> Novo recorde: 107 kg (1RM estimado)
				</div>
			</Card>
		</Screen>
	);
};
