import React from 'react';
import {ArrowDownRight, ArrowUpRight, Home, ShoppingCart, Utensils, Gamepad2} from 'lucide-react';
import {brl, c, display, tween} from '../theme';
import {Card, Header, Label, Pills, rise, Screen} from './ui';

const CATS = [
	{name: 'Moradia', Icon: Home, color: c.purple, used: 1200, budget: 1500},
	{name: 'Mercado', Icon: ShoppingCart, color: '#A3E635', used: 600, budget: 650},
	{name: 'Alimentação', Icon: Utensils, color: c.orange, used: 203, budget: 400},
	{name: 'Lazer', Icon: Gamepad2, color: c.pink, used: 165, budget: 250},
];

export const Finance: React.FC<{f: number}> = ({f}) => {
	const count = tween(f, [6, 40], [0, 1]);
	return (
		<Screen tab={2}>
			<Header kicker="Outubro 2026" title="Financeiro" f={f} />
			<Pills items={['Visão', 'Transações', 'Cartões', 'Rendas', 'Investimentos']} active={0} f={f} />

			<Card style={{marginBottom: 10, ...rise(f, 4)}}>
				<Label>Saldo do mês</Label>
				<div
					style={{
						fontFamily: display,
						fontSize: 44,
						fontWeight: 800,
						lineHeight: 1.1,
						fontVariantNumeric: 'tabular-nums',
					}}
				>
					{brl(3240 * count)}
				</div>
				<div style={{display: 'flex', gap: 18, marginTop: 6, fontSize: 14, fontWeight: 600}}>
					<span style={{color: c.green, display: 'flex', alignItems: 'center', gap: 3}}>
						<ArrowUpRight size={16} /> {brl(6550 * count)}
					</span>
					<span style={{color: c.redHi, display: 'flex', alignItems: 'center', gap: 3}}>
						<ArrowDownRight size={16} /> {brl(3310 * count)}
					</span>
				</div>
			</Card>

			{/* credit card, slides in from the right */}
			<div
				style={{
					height: 128,
					borderRadius: 16,
					padding: 16,
					marginBottom: 10,
					background: 'linear-gradient(135deg,#7C3AED 0%,#4C1D95 55%,#2E1065 100%)',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					opacity: tween(f, [10, 20], [0, 1]),
					transform: `translateX(${tween(f, [10, 32], [140, 0])}px) rotate(${tween(f, [10, 32], [6, 0])}deg)`,
					boxShadow: '0 16px 40px rgba(76,29,149,0.45)',
				}}
			>
				<div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 15}}>
					<span>Nubank Ultravioleta</span>
					<span style={{opacity: 0.8}}>•••• 4831</span>
				</div>
				<div>
					<div style={{fontSize: 12, opacity: 0.8}}>Fatura atual · vence dia 5</div>
					<div style={{fontFamily: display, fontSize: 26, fontWeight: 700}}>R$ 1.890</div>
					<div style={{height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.25)', marginTop: 6}}>
						<div style={{height: '100%', width: `${tween(f, [24, 44], [0, 24])}%`, borderRadius: 3, background: '#fff'}} />
					</div>
				</div>
			</div>

			<Card style={rise(f, 14)}>
				<Label style={{marginBottom: 10}}>Orçamento por categoria</Label>
				<div style={{display: 'flex', flexDirection: 'column', gap: 11}}>
					{CATS.map(({name, Icon, color, used, budget}, i) => {
						const p = tween(f, [20 + i * 4, 44 + i * 4], [0, used / budget]);
						return (
							<div key={name} style={{display: 'flex', alignItems: 'center', gap: 10}}>
								<div
									style={{
										width: 30,
										height: 30,
										borderRadius: 9,
										background: color + '22',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<Icon size={15} color={color} />
								</div>
								<div style={{flex: 1}}>
									<div style={{display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4}}>
										<span style={{fontWeight: 600}}>{name}</span>
										<span style={{color: c.muted, fontVariantNumeric: 'tabular-nums'}}>
											{brl(used * (p / (used / budget) || 0))} / {brl(budget)}
										</span>
									</div>
									<div style={{height: 6, borderRadius: 4, background: c.track}}>
										<div style={{height: '100%', width: `${p * 100}%`, borderRadius: 4, background: color}} />
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</Card>
		</Screen>
	);
};
