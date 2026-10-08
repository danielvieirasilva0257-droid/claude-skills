import React from 'react';
import {Repeat, CalendarDays} from 'lucide-react';
import {c, display, tween} from '../../theme';
import {Card, Header, Label, rise, Screen} from '../../screens/ui';
import {Chip, Tap} from './common';

const SCHEDULE = [
	{day: '02', desc: 'Aluguel', v: 1200, kind: 'Fixa', color: c.purple},
	{day: '05', desc: 'Fatura Nubank', v: 1890, kind: 'Fixa', color: c.purple},
	{day: '12', desc: 'Curso de motion', v: 350, kind: 'Parcela 2/3', color: c.amber},
	{day: '15', desc: 'Internet', v: 99, kind: 'Fixa', color: c.purple},
	{day: '26', desc: 'Presente', v: 120, kind: 'Pontual', color: c.blue},
];

const CATS = [
	{name: 'Moradia', v: 1500, color: c.purple},
	{name: 'Mercado', v: 600, color: '#A3E635'},
	{name: 'Saúde & Fitness', v: 450, color: c.green},
	{name: 'Alimentação', v: 320, color: c.orange},
	{name: 'Lazer', v: 250, color: c.pink},
];
const TOTAL = CATS.reduce((a, b) => a + b.v, 0);

export const TOGGLE_TAPS = [50, 72]; // local frames: Pontual, then back to Fixa

export const Expenses: React.FC<{f: number}> = ({f}) => {
	const fixa = f < TOGGLE_TAPS[0] || f >= TOGGLE_TAPS[1];
	const knob = fixa ? (f >= TOGGLE_TAPS[1] ? tween(f, [TOGGLE_TAPS[1], TOGGLE_TAPS[1] + 8], [1, 0]) : 0) : tween(f, [TOGGLE_TAPS[0], TOGGLE_TAPS[0] + 8], [0, 1]);
	// donut
	const R = 46;
	const circ = 2 * Math.PI * R;
	const grow = tween(f, [96, 130], [0, 1]);
	let acc = 0;
	return (
		<Screen tab={2}>
			<Header kicker="Financeiro · Despesas" title="Agendar pagamento" f={f} />
			<Card style={{marginBottom: 10, padding: 12, ...rise(f, 3)}}>
				<div style={{position: 'relative', display: 'flex', background: c.s3, borderRadius: 12, padding: 3}}>
					<div
						style={{
							position: 'absolute',
							top: 3,
							bottom: 3,
							left: `calc(3px + ${knob} * (50% - 3px))`,
							width: 'calc(50% - 3px)',
							borderRadius: 10,
							background: c.red,
						}}
					/>
					{['Fixa · todo mês', 'Pontual · uma vez'].map((t, i) => (
						<div key={t} style={{position: 'relative', flex: 1, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: (i === 0) === fixa ? '#fff' : c.muted}}>
							{i === 0 ? <Repeat size={15} /> : <CalendarDays size={15} />}
							{t}
							{i === 1 && <Tap f={f} at={TOGGLE_TAPS[0]} />}
							{i === 0 && <Tap f={f} at={TOGGLE_TAPS[1]} />}
						</div>
					))}
				</div>
			</Card>
			<Card style={{marginBottom: 10, ...rise(f, 8)}}>
				<Label style={{marginBottom: 8}}>Cronograma de outubro</Label>
				{SCHEDULE.map((x, i) => {
					const at = 22 + i * 6;
					return (
						<div
							key={x.desc}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 10,
								padding: '7px 0',
								borderTop: i ? `1px solid ${c.border}` : 'none',
								opacity: tween(f, [at, at + 8], [0, 1]),
								transform: `translateX(${tween(f, [at, at + 14], [30, 0])}px)`,
							}}
						>
							<div style={{width: 38, textAlign: 'center', fontFamily: display, fontSize: 20, fontWeight: 700, color: c.muted}}>{x.day}</div>
							<div style={{flex: 1, fontSize: 14, fontWeight: 600}}>{x.desc}</div>
							<Chip color={x.color}>{x.kind}</Chip>
							<div style={{width: 74, textAlign: 'right', fontFamily: display, fontSize: 17, fontWeight: 700, color: c.redHi}}>R$ {x.v.toLocaleString('pt-BR')}</div>
						</div>
					);
				})}
			</Card>
			<Card style={{display: 'flex', alignItems: 'center', gap: 14, ...rise(f, 88)}}>
				<svg width={110} height={110} style={{transform: 'rotate(-90deg)', flexShrink: 0}}>
					<circle cx={55} cy={55} r={R} fill="none" stroke={c.track} strokeWidth={14} />
					{CATS.map((cat) => {
						const len = (cat.v / TOTAL) * circ * grow;
						const off = acc * grow;
						acc += (cat.v / TOTAL) * circ;
						return <circle key={cat.name} cx={55} cy={55} r={R} fill="none" stroke={cat.color} strokeWidth={14} strokeDasharray={`${Math.max(0, len - 2)} ${circ}`} strokeDashoffset={-off} />;
					})}
				</svg>
				<div style={{flex: 1}}>
					<Label style={{marginBottom: 4}}>Por categoria</Label>
					{CATS.map((cat, i) => (
						<div key={cat.name} style={{display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, marginTop: 3, opacity: tween(f, [100 + i * 4, 108 + i * 4], [0, 1])}}>
							<span style={{width: 8, height: 8, borderRadius: 4, background: cat.color}} />
							<span style={{flex: 1, color: c.muted}}>{cat.name}</span>
							<span style={{fontWeight: 700}}>{Math.round((cat.v / TOTAL) * 100)}%</span>
						</div>
					))}
				</div>
			</Card>
		</Screen>
	);
};
