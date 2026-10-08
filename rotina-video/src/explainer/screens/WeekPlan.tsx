import React from 'react';
import {Plus} from 'lucide-react';
import {c, display, tween} from '../../theme';
import {Card, Header, Label, Pills, rise, Screen} from '../../screens/ui';
import {Tap} from './common';

const WEEK = [
	['Seg', 'Peito', c.redHi],
	['Ter', 'Costas', c.blue],
	['Qua', 'Perna', c.green],
	['Qui', 'Ombro', c.amber],
	['Sex', 'Braço', c.pink],
	['Sáb', 'Descanso', c.faint],
	['Dom', 'Descanso', c.faint],
] as const;

const DAY_EX = ['Supino Reto', 'Supino Inclinado', 'Crucifixo Máquina', 'Crossover'];
export const ADD_TAP = 70; // local frame of the "+ Adicionar exercício" tap

export const WeekPlan: React.FC<{f: number}> = ({f}) => {
	const shown = DAY_EX.filter((_, i) => f >= 34 + i * 10 || (i === 3 && f >= ADD_TAP + 6));
	return (
		<Screen tab={1}>
			<Header kicker="Treinos · Outubro" title="Planejar" f={f} />
			<Pills items={['Treino', 'Planejar', 'Progresso', 'Cardio']} active={1} f={f} />
			<Card style={{marginBottom: 10, padding: '10px 12px', ...rise(f, 4)}}>
				<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
					<Label>Sistema da semana</Label>
					<span style={{fontSize: 12, fontWeight: 700, color: c.orange}}>ABCDE · Hipertrofia</span>
				</div>
				<div style={{display: 'flex', gap: 5}}>
					{WEEK.map(([d, name, color], i) => (
						<div
							key={d}
							style={{
								flex: 1,
								borderRadius: 9,
								padding: '7px 0',
								textAlign: 'center',
								background: name === 'Descanso' ? c.s3 : color + '26',
								border: `1px solid ${i === 0 ? color : 'transparent'}`,
								opacity: tween(f, [8 + i * 2, 16 + i * 2], [0, 1]),
								transform: `translateY(${tween(f, [8 + i * 2, 20 + i * 2], [18, 0])}px)`,
							}}
						>
							<div style={{fontSize: 11, color: c.muted, fontWeight: 600}}>{d}</div>
							<div style={{fontFamily: display, fontSize: 13, fontWeight: 700, color: name === 'Descanso' ? c.faint : color}}>
								{name === 'Descanso' ? '—' : name}
							</div>
						</div>
					))}
				</div>
			</Card>
			<Card style={{...rise(f, 22)}}>
				<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
					<div>
						<Label>Segunda</Label>
						<div style={{fontFamily: display, fontSize: 24, fontWeight: 700, textTransform: 'uppercase'}}>Treino de Peito</div>
					</div>
					<span style={{fontSize: 12, color: c.muted}}>{shown.length} exercícios</span>
				</div>
				<div style={{display: 'flex', flexDirection: 'column', gap: 7}}>
					{DAY_EX.map((ex, i) => {
						const at = i === 3 ? ADD_TAP + 6 : 34 + i * 10;
						return (
							<div
								key={ex}
								style={{
									display: shown.includes(ex) ? 'flex' : 'none',
									alignItems: 'center',
									justifyContent: 'space-between',
									padding: '10px 12px',
									borderRadius: 10,
									background: c.s3,
									fontSize: 14,
									fontWeight: 600,
									opacity: tween(f, [at, at + 8], [0, 1]),
									transform: `translateX(${tween(f, [at, at + 14], [40, 0])}px)`,
								}}
							>
								<span>
									<span style={{color: c.faint, marginRight: 8}}>{i + 1}</span>
									{ex}
								</span>
								<span style={{color: c.muted, fontSize: 12}}>3 × 10</span>
							</div>
						);
					})}
					<div
						style={{
							position: 'relative',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 6,
							height: 42,
							borderRadius: 10,
							border: `1px dashed ${c.border}`,
							color: c.redHi,
							fontSize: 14,
							fontWeight: 600,
							opacity: tween(f, [40, 50], [0, 1]),
							background: f >= ADD_TAP && f < ADD_TAP + 8 ? c.redBg : 'transparent',
						}}
					>
						<Plus size={16} /> Adicionar exercício
						<Tap f={f} at={ADD_TAP} />
					</div>
				</div>
			</Card>
		</Screen>
	);
};
