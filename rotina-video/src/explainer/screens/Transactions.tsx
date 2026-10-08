import React from 'react';
import {Briefcase, Car, Film, Home, ShoppingCart, Utensils, Banknote, Dumbbell} from 'lucide-react';
import {c, display, tween} from '../../theme';
import {Card, Header, Pills, rise, Screen} from '../../screens/ui';
import {Chip} from './common';

const BANKS = [
	{name: 'Nubank', value: 'R$ 2.140', color: '#A78BFA'},
	{name: 'Inter', value: 'R$ 1.100', color: '#FB923C'},
];

const METHOD = {pix: ['PIX', c.green], credito: ['Crédito', c.purple], debito: ['Débito', c.blue]} as const;

const TX = [
	{d: 'Hoje', desc: 'Freela · Barbearia Elite', v: 900, Icon: Briefcase, color: c.green, m: 'pix'},
	{d: 'Hoje', desc: 'iFood', v: -55, Icon: Utensils, color: c.orange, m: 'credito'},
	{d: 'Ontem', desc: 'Mercado do mês', v: -420, Icon: ShoppingCart, color: '#A3E635', m: 'credito'},
	{d: 'Ontem', desc: 'Gasolina', v: -180, Icon: Car, color: '#22D3EE', m: 'credito'},
	{d: '05/10', desc: 'Salário', v: 4800, Icon: Banknote, color: c.green, m: 'pix'},
	{d: '04/10', desc: 'Academia', v: -120, Icon: Dumbbell, color: c.green, m: 'debito'},
	{d: '02/10', desc: 'Aluguel', v: -1200, Icon: Home, color: c.purple, m: 'pix'},
	{d: '01/10', desc: 'Netflix', v: -45, Icon: Film, color: '#818CF8', m: 'credito'},
] as const;

// filterAt: local frames where the filter switches to Entradas, then Saídas (synced to the narration)
export const Transactions: React.FC<{f: number; filterAt: [number, number]}> = ({f, filterAt}) => {
	const filter = f < filterAt[0] ? 0 : f < filterAt[1] ? 1 : 2;
	const list = TX.filter((t) => (filter === 1 ? t.v > 0 : filter === 2 ? t.v < 0 : true));
	const listStart = filter === 0 ? 10 : filterAt[filter - 1];
	return (
		<Screen tab={2}>
			<Header kicker="Financeiro · Outubro" title="Transações" f={f} />
			<div style={{display: 'flex', gap: 8, marginBottom: 12}}>
				{BANKS.map((b, i) => (
					<Card key={b.name} style={{flex: 1, padding: '9px 11px', borderColor: b.color + '66', ...rise(f, 3 + i * 3)}}>
						<div style={{fontSize: 12, color: b.color, fontWeight: 700}}>{b.name}</div>
						<div style={{fontFamily: display, fontSize: 21, fontWeight: 700}}>{b.value}</div>
					</Card>
				))}
			</div>
			<Pills items={['Todas', 'Entradas', 'Saídas']} active={filter} f={f} />
			<div style={{display: 'flex', flexDirection: 'column', gap: 7}}>
				{list.map((t, i) => {
					const [ml, mc] = METHOD[t.m];
					const at = listStart + i * 3;
					const In = t.v > 0;
					return (
						<div
							key={t.desc}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 10,
								padding: '9px 11px',
								borderRadius: 12,
								background: c.s2,
								border: `1px solid ${c.border}`,
								opacity: tween(f, [at, at + 8], [0, 1]),
								transform: `translateY(${tween(f, [at, at + 14], [22, 0])}px)`,
							}}
						>
							<div style={{width: 34, height: 34, borderRadius: 10, background: t.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
								<t.Icon size={16} color={t.color} />
							</div>
							<div style={{flex: 1, minWidth: 0}}>
								<div style={{fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{t.desc}</div>
								<div style={{display: 'flex', gap: 6, alignItems: 'center', marginTop: 2}}>
									<span style={{fontSize: 11, color: c.faint}}>{t.d}</span>
									<Chip color={mc} style={{height: 18, fontSize: 10}}>
										{ml}
									</Chip>
								</div>
							</div>
							<div style={{fontFamily: display, fontSize: 18, fontWeight: 700, color: In ? c.green : c.redHi, fontVariantNumeric: 'tabular-nums'}}>
								{In ? '+' : '−'} R$ {Math.abs(t.v).toLocaleString('pt-BR')}
							</div>
						</div>
					);
				})}
			</div>
		</Screen>
	);
};
