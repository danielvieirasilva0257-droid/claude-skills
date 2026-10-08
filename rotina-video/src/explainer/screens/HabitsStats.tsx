import React from 'react';
import {random} from 'remotion';
import {Award, Flame, Percent} from 'lucide-react';
import {c, display, tween} from '../../theme';
import {Card, Header, Label, Pills, rise, Screen} from '../../screens/ui';

const DAYS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
const WEEK = [100, 80, 100, 60, 100, 80, 40];
const TREND = [52, 55, 61, 58, 66, 70, 68, 74, 79, 77, 83, 86];

export const HabitsStats: React.FC<{f: number}> = ({f}) => {
	const CW = 322;
	const CH = 70;
	const pts = TREND.map((v, i) => [(i / (TREND.length - 1)) * CW, CH - ((v - 45) / 45) * CH]);
	const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
	const draw = tween(f, [24, 54], [0, 1]);
	const tiles = [
		{label: 'Conclusão', value: Math.round(86 * tween(f, [6, 30], [0, 1])) + '%', Icon: Percent, color: c.green},
		{label: 'Sequência', value: '12', Icon: Flame, color: c.amber},
		{label: 'Recorde', value: '21', Icon: Award, color: c.purple},
	];
	return (
		<Screen tab={0}>
			<Header kicker="Hábitos · Outubro" title="Sua evolução" f={f} />
			<Pills items={['Hoje', 'Métricas', 'Histórico']} active={1} f={f} />
			<div style={{display: 'flex', gap: 8, marginBottom: 10}}>
				{tiles.map(({label, value, Icon, color}, i) => (
					<Card key={label} style={{flex: 1, padding: 11, ...rise(f, 4 + i * 3)}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: c.muted}}>
							<Icon size={13} color={color} /> {label}
						</div>
						<div style={{fontFamily: display, fontSize: 28, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums'}}>{value}</div>
					</Card>
				))}
			</div>
			<Card style={{marginBottom: 10, ...rise(f, 10)}}>
				<Label style={{marginBottom: 10}}>Esta semana</Label>
				<div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 96}}>
					{WEEK.map((v, i) => {
						const h = tween(f, [14 + i * 3, 34 + i * 3], [0, v]);
						return (
							<div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 30}}>
								<div style={{width: 22, height: 72, borderRadius: 6, background: c.s3, display: 'flex', alignItems: 'flex-end'}}>
									<div style={{width: '100%', height: `${h}%`, borderRadius: 6, background: v === 100 ? c.redHi : 'rgba(255,90,90,0.55)'}} />
								</div>
								<span style={{fontSize: 11, color: c.faint, fontWeight: 600}}>{DAYS[i]}</span>
							</div>
						);
					})}
				</div>
			</Card>
			<Card style={{marginBottom: 10, ...rise(f, 16)}}>
				<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
					<Label>Taxa de conclusão · 12 semanas</Label>
					<span style={{fontSize: 12, color: c.green, fontWeight: 700}}>+34 pts</span>
				</div>
				<svg width={CW} height={CH + 4} style={{overflow: 'visible'}}>
					<path d={d} fill="none" stroke={c.green} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
				</svg>
			</Card>
			<Card style={rise(f, 22)}>
				<Label style={{marginBottom: 8}}>Mapa do mês</Label>
				<div style={{display: 'grid', gridTemplateColumns: 'repeat(14, 1fr)', gap: 4}}>
					{Array.from({length: 28}).map((_, i) => {
						const lvl = random(`hm${i}`);
						const on = tween(f, [26 + i * 0.8, 32 + i * 0.8], [0, 1]);
						return (
							<div
								key={i}
								style={{
									aspectRatio: '1',
									borderRadius: 4,
									background: lvl > 0.25 ? `rgba(255,90,90,${(0.25 + lvl * 0.75) * on})` : c.s3,
								}}
							/>
						);
					})}
				</div>
			</Card>
		</Screen>
	);
};
