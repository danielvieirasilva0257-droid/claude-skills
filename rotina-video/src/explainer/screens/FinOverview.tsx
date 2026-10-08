import React from 'react';
import {ArrowDownRight, ArrowUpRight} from 'lucide-react';
import {brl, c, display, tween} from '../../theme';
import {Card, Header, Label, Pills, rise, Screen} from '../../screens/ui';

const MONTHS = [
	['Mai', 5200, 3400],
	['Jun', 5450, 3100],
	['Jul', 5100, 3600],
	['Ago', 5900, 3300],
	['Set', 6200, 3500],
	['Out', 6550, 3310],
] as const;

export const FinOverview: React.FC<{f: number}> = ({f}) => {
	const k = tween(f, [8, 40], [0, 1]);
	return (
		<Screen tab={2}>
			<Header kicker="Outubro 2026" title="Financeiro" f={f} />
			<Pills items={['Visão', 'Transações', 'Cartões', 'Rendas', 'Investimentos']} active={0} f={f} />
			<Card style={{marginBottom: 10, ...rise(f, 4)}}>
				<Label>Saldo do mês</Label>
				<div style={{fontFamily: display, fontSize: 46, fontWeight: 800, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums'}}>{brl(3240 * k)}</div>
				<div style={{display: 'flex', gap: 10, marginTop: 10}}>
					{[
						['Entradas', 6550, c.green, ArrowUpRight],
						['Saídas', 3310, c.redHi, ArrowDownRight],
					].map(([label, v, color, Icon]) => {
						const I = Icon as typeof ArrowUpRight;
						return (
							<div key={label as string} style={{flex: 1, background: c.s3, borderRadius: 10, padding: '8px 10px'}}>
								<div style={{display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: color as string, fontWeight: 700}}>
									<I size={14} /> {label as string}
								</div>
								<div style={{fontFamily: display, fontSize: 22, fontWeight: 700, fontVariantNumeric: 'tabular-nums'}}>{brl((v as number) * k)}</div>
							</div>
						);
					})}
				</div>
			</Card>
			<Card style={rise(f, 12)}>
				<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 10}}>
					<Label>Entradas × saídas · 6 meses</Label>
				</div>
				<div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 150}}>
					{MONTHS.map(([m, inn, out], i) => {
						const g = tween(f, [16 + i * 3, 40 + i * 3], [0, 1]);
						return (
							<div key={m} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
								<div style={{display: 'flex', alignItems: 'flex-end', gap: 4, height: 124}}>
									<div style={{width: 14, height: (inn / 6600) * 124 * g, borderRadius: 4, background: c.green}} />
									<div style={{width: 14, height: (out / 6600) * 124 * g, borderRadius: 4, background: c.redHi}} />
								</div>
								<span style={{fontSize: 11, color: i === 5 ? c.text : c.faint, fontWeight: 600}}>{m}</span>
							</div>
						);
					})}
				</div>
			</Card>
		</Screen>
	);
};
