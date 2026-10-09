import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame} from 'remotion';
import {
	ArrowDownRight,
	ArrowUpRight,
	Award,
	Banknote,
	Briefcase,
	CalendarDays,
	Car,
	Check,
	Dumbbell,
	Film,
	Flame,
	Home,
	Percent,
	Plus,
	Repeat,
	ShoppingCart,
	TrendingUp,
	Trophy,
	Utensils,
} from 'lucide-react';
import {brl, c, display, tween} from '../theme';
import {Card, Header, Label, Pills, rise, Screen} from '../screens/ui';
import {Chip, Ring, Tap} from '../explainer/screens/common';
import {STYLES} from '../explainer/screens/Styles';
import {W} from './tempo';
import {AppMark, Wordmark} from './Marca';
import {P} from './theme';

// The app screens shown on the 3D phone (rendered as a 1080x2340 JPEG sequence, then used as a texture).
// Same design tokens as the real Rotina app (dark UI, red accent, Barlow). Every event is tied to a spoken word.

const S = 1080 / 390; // 390 pt logical width -> 1080 px texture
const sprPop = (f: number, at: number) => (f < at ? 0 : spring({frame: f - at, fps: 30, config: {damping: 12, stiffness: 220}}));

// ---------------------------------------------------------------- Hábitos
const HABITS = ['Beber 3L de água', 'Dieta', 'Ler 10 páginas', 'Treinar', 'Meditar 10 min'];
const H_EVENTS: [number, number, boolean][] = [
	[W(4, 'Marque') + 2, 0, true],
	[W(4, 'desmarque') + 2, 2, false],
	[W(4, 'hábitos') + 1, 1, true],
	[W(4, 'dia') - 2, 3, true],
	[W(4, 'dia') + 5, 4, true],
	[W(4, 'veja') + 2, 2, true],
];
const H_START = 182;
const STREAK_UP = W(4, 'sequência') + 2;
const hState = (f: number, i: number) => {
	let on = i === 2; // "Ler 10 páginas" starts checked, so it can be unchecked on "desmarque"
	let at = -999;
	for (const [t, h, v] of H_EVENTS) if (h === i && f >= t) [on, at] = [v, t];
	return {on, at};
};

const Habitos: React.FC<{f: number}> = ({f}) => {
	const l = f - H_START;
	const done = HABITS.filter((_, i) => hState(f, i).on).length;
	const streak = f >= STREAK_UP ? 13 : 12;
	const bump = sprPop(f, STREAK_UP);
	return (
		<Screen tab={0}>
			<Header kicker="Quinta · 9 de outubro" title="Hábitos de hoje" f={l} />
			<Card style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, ...rise(l, 3)}}>
				<Ring pct={done / 5} size={72} stroke={7} color={c.redHi}>
					<span style={{fontFamily: display, fontSize: 22, fontWeight: 700}}>{done}/5</span>
				</Ring>
				<div>
					<Label>Sequência</Label>
					<div style={{display: 'flex', alignItems: 'center', gap: 6}}>
						<Flame size={24} color={c.amber} fill={c.amber} style={{transform: `scale(${1 + 0.35 * Math.sin(Math.PI * Math.min(1, bump))})`}} />
						<span
							style={{
								display: 'inline-block',
								fontFamily: display,
								fontSize: 32,
								fontWeight: 800,
								color: c.amber,
								transform: `translateY(${(1 - Math.min(1, bump)) * (f >= STREAK_UP ? 10 : 0)}px) scale(${1 + 0.25 * Math.sin(Math.PI * Math.min(1, bump))})`,
							}}
						>
							{streak}
						</span>
						<span style={{fontSize: 14, color: c.muted}}>dias seguidos</span>
					</div>
				</div>
			</Card>
			<div style={{display: 'flex', flexDirection: 'column', gap: 9}}>
				{HABITS.map((h, i) => {
					const {on, at} = hState(f, i);
					const p = sprPop(f, at);
					const k = at < 0 ? (on ? 1 : 0) : on ? p : 1 - p;
					const taps = H_EVENTS.filter(([, hi]) => hi === i).map(([t]) => t);
					return (
						<Card
							key={h}
							style={{
								position: 'relative',
								display: 'flex',
								alignItems: 'center',
								gap: 12,
								padding: '13px 14px',
								borderColor: k > 0.5 ? 'rgba(204,0,0,0.55)' : c.border,
								...rise(l, 6 + i * 2),
							}}
						>
							<div
								style={{
									position: 'relative',
									width: 28,
									height: 28,
									borderRadius: 9,
									border: `2px solid ${k > 0.5 ? c.red : c.border}`,
									background: `rgba(204,0,0,${Math.min(1, Math.max(0, k))})`,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									transform: `scale(${at > 0 ? 1 - 0.25 * Math.sin(Math.PI * Math.min(1, p)) : 1})`,
								}}
							>
								{k > 0.05 && <Check size={18} strokeWidth={3.2} style={{transform: `scale(${Math.min(1.1, k)})`}} />}
								{taps.map((t) => (
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
			<Card style={{marginTop: 12, padding: '11px 14px', ...rise(l, 18)}}>
				<Label style={{marginBottom: 8}}>Esta semana</Label>
				<div style={{display: 'flex', justifyContent: 'space-between'}}>
					{['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => {
						const today = i === 3;
						const full = i < 3 || (today && done === 5);
						return (
							<div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5}}>
								<div
									style={{
										width: 30,
										height: 30,
										borderRadius: 15,
										background: full ? c.red : 'transparent',
										border: `2px solid ${full ? c.red : today ? c.redHi : c.border}`,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									{full && <Check size={15} strokeWidth={3.2} />}
								</div>
								<span style={{fontSize: 11, fontWeight: 600, color: today ? c.text : c.faint}}>{d}</span>
							</div>
						);
					})}
				</div>
			</Card>
			<Card style={{marginTop: 10, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10, ...rise(l, 22)}}>
				<div style={{width: 34, height: 34, borderRadius: 10, background: c.redBg, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<Dumbbell size={17} color={c.redHi} />
				</div>
				<div style={{flex: 1}}>
					<div style={{fontSize: 14, fontWeight: 600}}>Lembrete: treinar às 18:00</div>
					<div style={{fontSize: 12, color: c.muted}}>Treino de Peito · 4 exercícios</div>
				</div>
			</Card>
		</Screen>
	);
};

// ---------------------------------------------------------------- Métricas
const DAYS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
const WEEK = [100, 80, 100, 60, 100, 80, 100];
const TREND = [52, 55, 61, 58, 66, 70, 68, 74, 79, 77, 83, 86];
const M_START = 266;

const Metricas: React.FC<{f: number}> = ({f}) => {
	const l = f - M_START;
	const CW = 322;
	const CH = 70;
	const pts = TREND.map((v, i) => [(i / (TREND.length - 1)) * CW, CH - ((v - 45) / 45) * CH]);
	const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
	const w0 = W(5, 'semana', 0);
	const draw = tween(f, [W(5, 'quanto') - 6, W(5, 'evoluiu') + 2], [0, 1]);
	const tiles = [
		{label: 'Conclusão', value: Math.round(86 * tween(f, [M_START + 4, M_START + 26], [0, 1])) + '%', Icon: Percent, color: c.green},
		{label: 'Sequência', value: '13', Icon: Flame, color: c.amber},
		{label: 'Recorde', value: '21', Icon: Award, color: c.purple},
	];
	const plus = sprPop(f, W(5, 'evoluiu'));
	return (
		<Screen tab={0}>
			<Header kicker="Hábitos · Outubro" title="Sua evolução" f={l} />
			<Pills items={['Hoje', 'Métricas', 'Histórico']} active={1} f={l} />
			<div style={{display: 'flex', gap: 8, marginBottom: 10}}>
				{tiles.map(({label, value, Icon, color}, i) => (
					<Card key={label} style={{flex: 1, padding: 11, ...rise(l, 2 + i * 2)}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: c.muted}}>
							<Icon size={13} color={color} /> {label}
						</div>
						<div style={{fontFamily: display, fontSize: 28, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums'}}>{value}</div>
					</Card>
				))}
			</div>
			<Card style={{marginBottom: 10, ...rise(l, 6)}}>
				<Label style={{marginBottom: 10}}>Esta semana</Label>
				<div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 96}}>
					{WEEK.map((v, i) => {
						const at = w0 - 14 + i * 3;
						const h = tween(f, [at, at + 14], [0, v]);
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
			<Card style={{marginBottom: 10, ...rise(l, 10)}}>
				<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
					<Label>Taxa de conclusão · 12 semanas</Label>
					<span style={{fontSize: 12, color: c.green, fontWeight: 700, display: 'inline-block', transform: `scale(${1 + 0.3 * Math.sin(Math.PI * Math.min(1, plus))})`}}>+34 pts</span>
				</div>
				<svg width={CW} height={CH + 4} style={{overflow: 'visible'}}>
					<path d={d} fill="none" stroke={c.green} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
				</svg>
			</Card>
			<Card style={rise(l, 14)}>
				<Label style={{marginBottom: 8}}>Mapa do mês</Label>
				<div style={{display: 'grid', gridTemplateColumns: 'repeat(14, 1fr)', gap: 4}}>
					{Array.from({length: 28}).map((_, i) => {
						const lvl = ((i * 37) % 11) / 10;
						const on = tween(l, [14 + i * 0.6, 20 + i * 0.6], [0, 1]);
						return <div key={i} style={{aspectRatio: '1', borderRadius: 4, background: lvl > 0.25 ? `rgba(255,90,90,${(0.25 + lvl * 0.75) * on})` : c.s3}} />;
					})}
				</div>
			</Card>
		</Screen>
	);
};

// ---------------------------------------------------------------- Treino: plano da semana
const PLAN = [
	['Seg', 'Peito', c.redHi],
	['Ter', 'Costas', c.blue],
	['Qua', 'Perna', c.green],
	['Qui', 'Ombro', c.amber],
	['Sex', 'Braço', c.pink],
	['Sáb', 'Cardio', c.orange],
	['Dom', 'Descanso', c.faint],
] as const;
const DAY_EX = ['Supino Reto', 'Supino Inclinado', 'Crucifixo Máquina', 'Crossover'];
const PL_START = 335;

const Plano: React.FC<{f: number}> = ({f}) => {
	const l = f - PL_START;
	const dayAt = (i: number) => W(6, 'cada') - 4 + i * 3;
	const whole = W(6, 'semana');
	const glow = tween(f, [whole, whole + 6], [0, 1]) * (1 - tween(f, [whole + 14, whole + 26], [0, 1]));
	const addTap = W(6, 'plano') - 2;
	return (
		<Screen tab={1}>
			<Header kicker="Treinos · Outubro" title="Planejar" f={l + 6} />
			<Pills items={['Treino', 'Planejar', 'Progresso', 'Cardio']} active={1} f={l + 6} />
			<Card style={{marginBottom: 10, padding: '10px 12px', borderColor: glow > 0.05 ? `rgba(255,90,90,${0.3 + 0.7 * glow})` : c.border, ...rise(l + 6, 0)}}>
				<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
					<Label>Sistema da semana</Label>
					<span style={{fontSize: 12, fontWeight: 700, color: c.orange}}>ABCDE · Hipertrofia</span>
				</div>
				<div style={{display: 'flex', gap: 5}}>
					{PLAN.map(([d, name, color], i) => {
						const p = sprPop(f, dayAt(i));
						return (
							<div
								key={d}
								style={{
									flex: 1,
									borderRadius: 9,
									padding: '7px 0',
									textAlign: 'center',
									background: name === 'Descanso' ? c.s3 : color + '26',
									border: `1px solid ${i === 0 || glow > 0.3 ? color : 'transparent'}`,
									opacity: Math.min(1, p * 1.5),
									transform: `translateY(${(1 - Math.min(1, p)) * 16}px) scale(${0.85 + 0.15 * p})`,
								}}
							>
								<div style={{fontSize: 11, color: c.muted, fontWeight: 600}}>{d}</div>
								<div style={{fontFamily: display, fontSize: 13, fontWeight: 700, color: name === 'Descanso' ? c.faint : color}}>{name === 'Descanso' ? '—' : name}</div>
							</div>
						);
					})}
				</div>
			</Card>
			<Card style={{...rise(l + 6, 8)}}>
				<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
					<div>
						<Label>Segunda</Label>
						<div style={{fontFamily: display, fontSize: 24, fontWeight: 700, textTransform: 'uppercase'}}>Treino de Peito</div>
					</div>
					<span style={{fontSize: 12, color: c.muted}}>{f >= addTap + 6 ? 4 : 3} exercícios</span>
				</div>
				<div style={{display: 'flex', flexDirection: 'column', gap: 7}}>
					{DAY_EX.map((ex, i) => {
						const at = i === 3 ? addTap + 6 : PL_START + 14 + i * 4;
						if (f < at) return null;
						return (
							<div
								key={ex}
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									padding: '10px 12px',
									borderRadius: 10,
									background: c.s3,
									fontSize: 14,
									fontWeight: 600,
									opacity: tween(f, [at, at + 6], [0, 1]),
									transform: `translateX(${tween(f, [at, at + 12], [40, 0])}px)`,
								}}
							>
								<span>
									<span style={{color: c.faint, marginRight: 8}}>{i + 1}</span>
									{ex}
								</span>
								<span style={{color: c.muted, fontSize: 12}}>4 × 10</span>
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
							background: f >= addTap && f < addTap + 8 ? c.redBg : 'transparent',
						}}
					>
						<Plus size={16} /> Adicionar exercício
						<Tap f={f} at={addTap} />
					</div>
				</div>
			</Card>
			{[
				['Terça', 'Treino de Costas', c.blue, '5 exercícios'],
				['Quarta', 'Treino de Perna', c.green, '6 exercícios'],
			].map(([d, t, color, n], i) => (
				<Card key={d} style={{marginTop: 9, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...rise(l + 6, 14 + i * 3)}}>
					<div>
						<Label>{d}</Label>
						<div style={{fontFamily: display, fontSize: 19, fontWeight: 700, textTransform: 'uppercase', color}}>{t}</div>
					</div>
					<span style={{fontSize: 12, color: c.muted}}>{n}</span>
				</Card>
			))}
		</Screen>
	);
};

// ---------------------------------------------------------------- Treino: estilo da semana
const PICKS: [number, number][] = [
	[W(7, 'força'), 0],
	[W(7, 'hipertrofia'), 1],
	[W(7, 'resistência'), 2],
	[W(7, 'deload'), 5],
];
const E_START = 393;

const Estilos: React.FC<{f: number}> = ({f}) => {
	const l = f - E_START;
	let sel = -1;
	let selAt = -999;
	for (const [t, i] of PICKS) if (f >= t) [sel, selAt] = [i, t];
	const pop = sprPop(f, selAt);
	return (
		<Screen tab={1}>
			<Header kicker="Treinos · Planejar" title="Estilo da semana" f={l} />
			<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 12}}>
				{STYLES.map(({name, reps, color, Icon}, i) => {
					const on = i === sel;
					const r = rise(l, 3 + i * 2);
					return (
						<Card
							key={name}
							style={{
								position: 'relative',
								padding: 12,
								borderColor: on ? color : c.border,
								background: on ? color + '1F' : c.s2,
								transform: `${r.transform} scale(${on ? 1 + 0.06 * Math.sin(Math.PI * Math.min(1, pop)) : 1})`,
								opacity: r.opacity,
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
							{PICKS.filter(([, pi]) => pi === i).map(([t]) => (
								<Tap key={t} f={f} at={t - 2} x="70%" y="60%" />
							))}
						</Card>
					);
				})}
			</div>
			<Card style={rise(l, 12)}>
				<Label style={{marginBottom: 8}}>Seu mês</Label>
				<div style={{display: 'flex', gap: 6}}>
					{[0, 1, 2, 3].map((w) => {
						const pk = PICKS[w];
						const st = pk && f >= pk[0] ? STYLES[pk[1]] : null;
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
								<div style={{fontFamily: display, fontSize: 14, fontWeight: 700, color: st ? st.color : c.faint}}>{st ? st.name : '—'}</div>
							</div>
						);
					})}
				</div>
			</Card>
			{(() => {
				const st = sel >= 0 ? STYLES[sel] : STYLES[1];
				const tips: Record<string, string> = {
					Força: 'Cargas altas · descanso de 2 a 3 min',
					Hipertrofia: 'Carga moderada · descanso de 60 a 90 s',
					Resistência: 'Carga leve · descanso de 30 a 45 s',
					Deload: 'Semana leve para recuperar',
				};
				return (
					<Card style={{marginTop: 10, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10, borderColor: st.color + '66', ...rise(l, 16)}}>
						<div style={{width: 34, height: 34, borderRadius: 10, background: st.color + '26', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<st.Icon size={17} color={st.color} />
						</div>
						<div style={{flex: 1}}>
							<div style={{fontSize: 14, fontWeight: 700, color: st.color, textTransform: 'uppercase', fontFamily: display, letterSpacing: '0.04em'}}>{st.name}</div>
							<div style={{fontSize: 12, color: c.muted}}>{tips[st.name] ?? st.reps}</div>
						</div>
					</Card>
				);
			})()}
		</Screen>
	);
};

// ---------------------------------------------------------------- Treino: registrar séries
const SETS = [
	{kg: '82,5', reps: '10'},
	{kg: '82,5', reps: '10'},
	{kg: '82,5', reps: '9'},
];
const POINTS = [92, 93, 95, 95, 98, 101, 104, 107, 110];
const SR_START = 478;
const typed = (f: number, at: number, v: string) => v.slice(0, Math.max(0, Math.min(v.length, Math.floor((f - at) / 2) + 1)));

const Series: React.FC<{f: number}> = ({f}) => {
	const l = f - SR_START;
	const CW = 322;
	const CH = 80;
	const pts = POINTS.map((v, i) => [(i / (POINTS.length - 1)) * CW, CH - ((v - 88) / 24) * CH]);
	const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
	const save = W(8, 'veja') - 4;
	const draw = tween(f, [W(8, 'gráfico') - 2, W(8, 'evoluiu')], [0, 1]);
	const last = pts[pts.length - 1];
	const saved = f >= save;
	// set i: kg typed at, reps typed at
	const T = [
		[W(8, 'carga') - 2, W(8, 'repetições') - 2],
		[W(8, 'séries') - 6, W(8, 'séries') - 2],
		[W(8, 'séries') + 2, W(8, 'séries') + 5],
	];
	return (
		<Screen tab={1}>
			<div style={{marginBottom: 12, ...rise(l, 0)}}>
				<div style={{fontFamily: display, fontSize: 13, fontWeight: 600, color: c.muted, letterSpacing: '0.12em', textTransform: 'uppercase'}}>Treino de Peito · Exercício 1/4</div>
				<div style={{fontFamily: display, fontSize: 34, fontWeight: 700, textTransform: 'uppercase', lineHeight: 1.05}}>Supino Reto</div>
				<div style={{display: 'flex', gap: 6, marginTop: 6}}>
					<span style={{fontSize: 12, fontWeight: 700, color: c.orange, background: 'rgba(251,146,60,0.15)', padding: '3px 8px', borderRadius: 8}}>Hipertrofia · 8–12</span>
					<span style={{fontSize: 12, fontWeight: 700, color: c.muted, background: c.s3, padding: '3px 8px', borderRadius: 8}}>Última: 80 kg × 10</span>
				</div>
			</div>
			<Card style={{marginBottom: 10, ...rise(l, 3)}}>
				<div style={{display: 'grid', gridTemplateColumns: '50px 1fr 1fr', fontSize: 12, color: c.muted, fontWeight: 600, marginBottom: 6}}>
					<span>Série</span>
					<span>Carga</span>
					<span>Reps</span>
				</div>
				{SETS.map((st, i) => (
					<div key={i} style={{display: 'grid', gridTemplateColumns: '50px 1fr 1fr', gap: 8, marginBottom: 7, ...rise(l, 5 + i * 2)}}>
						<div style={{fontFamily: display, fontSize: 20, fontWeight: 700, color: f >= T[i][1] + 4 ? c.green : c.faint, alignSelf: 'center'}}>{i + 1}</div>
						{[
							[st.kg + ' kg', T[i][0]],
							[st.reps, T[i][1]],
						].map(([v, t], k) => {
							const txt = typed(f, t as number, v as string);
							const active = f >= (t as number) && f < (t as number) + 8;
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
				))}
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
					<Tap f={f} at={save} />
				</div>
			</Card>
			<Card style={{opacity: tween(f, [save + 2, save + 10], [0, 1]), transform: `translateY(${tween(f, [save + 2, save + 16], [30, 0])}px)`}}>
				<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
					<Label>Evolução · Supino Reto</Label>
					<span style={{display: 'flex', alignItems: 'center', gap: 4, color: c.green, fontSize: 13, fontWeight: 700}}>
						<TrendingUp size={15} /> +19%
					</span>
				</div>
				<svg width={CW} height={CH + 6} style={{overflow: 'visible'}}>
					<defs>
						<linearGradient id="v2lsgrad" x1="0" x2="0" y1="0" y2="1">
							<stop offset="0" stopColor={c.redHi} stopOpacity={0.35} />
							<stop offset="1" stopColor={c.redHi} stopOpacity={0} />
						</linearGradient>
						<clipPath id="v2lsclip">
							<rect x={0} y={-10} width={CW * draw} height={CH + 20} />
						</clipPath>
					</defs>
					<path d={line + ` L ${CW} ${CH} L 0 ${CH} Z`} fill="url(#v2lsgrad)" clipPath="url(#v2lsclip)" />
					<path d={line} fill="none" stroke={c.redHi} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
					<circle cx={last[0]} cy={last[1]} r={6 * tween(f, [W(8, 'evoluiu') - 2, W(8, 'evoluiu') + 6], [0, 1])} fill={c.redHi} stroke={c.bg} strokeWidth={2} />
				</svg>
				<div style={{display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 13, color: c.amber, fontWeight: 600, opacity: tween(f, [W(8, 'evoluiu'), W(8, 'evoluiu') + 8], [0, 1])}}>
					<Trophy size={15} /> Novo recorde: 110 kg
				</div>
			</Card>
		</Screen>
	);
};

// ---------------------------------------------------------------- Financeiro: visão
const MONTHS = [
	['Mai', 5200, 3400],
	['Jun', 5450, 3100],
	['Jul', 5100, 3600],
	['Ago', 5900, 3300],
	['Set', 6200, 3500],
	['Out', 6550, 3310],
] as const;
const V_START = 579;

const Visao: React.FC<{f: number}> = ({f}) => {
	const l = f - V_START;
	const k = tween(f, [V_START + 8, W(9, 'real') + 4], [0, 1]);
	return (
		<Screen tab={2}>
			<Header kicker="Outubro 2026" title="Financeiro" f={l} />
			<Pills items={['Visão', 'Transações', 'Cartões', 'Rendas', 'Investimentos']} active={0} f={l} />
			<Card style={{marginBottom: 10, ...rise(l, 3)}}>
				<Label>Saldo do mês</Label>
				<div style={{fontFamily: display, fontSize: 46, fontWeight: 800, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums'}}>{brl(3240 * k)}</div>
				<div style={{display: 'flex', gap: 10, marginTop: 10}}>
					{(
						[
							['Entradas', 6550, c.green, ArrowUpRight],
							['Saídas', 3310, c.redHi, ArrowDownRight],
						] as const
					).map(([label, v, color, Icon]) => (
						<div key={label} style={{flex: 1, background: c.s3, borderRadius: 10, padding: '8px 10px'}}>
							<div style={{display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color, fontWeight: 700}}>
								<Icon size={14} /> {label}
							</div>
							<div style={{fontFamily: display, fontSize: 22, fontWeight: 700, fontVariantNumeric: 'tabular-nums'}}>{brl(v * k)}</div>
						</div>
					))}
				</div>
			</Card>
			<Card style={rise(l, 8)}>
				<Label style={{marginBottom: 10}}>Entradas × saídas · 6 meses</Label>
				<div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 150}}>
					{MONTHS.map(([m, inn, out], i) => {
						const g = tween(f, [V_START + 12 + i * 3, V_START + 34 + i * 3], [0, 1]);
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

// ---------------------------------------------------------------- Financeiro: transações
const ACCOUNTS = [
	{name: 'Conta corrente', value: 'R$ 2.140', color: c.purple},
	{name: 'Cartão de crédito', value: 'R$ 1.100', color: c.orange},
];
const METHOD = {pix: ['PIX', c.green], credito: ['Crédito', c.purple], debito: ['Débito', c.blue]} as const;
const TX = [
	{d: 'Hoje', desc: 'Freela · Design', v: 900, Icon: Briefcase, color: c.green, m: 'pix'},
	{d: 'Hoje', desc: 'Delivery', v: -55, Icon: Utensils, color: c.orange, m: 'credito'},
	{d: 'Ontem', desc: 'Mercado do mês', v: -420, Icon: ShoppingCart, color: '#A3E635', m: 'credito'},
	{d: 'Ontem', desc: 'Gasolina', v: -180, Icon: Car, color: '#22D3EE', m: 'credito'},
	{d: '05/10', desc: 'Salário', v: 4800, Icon: Banknote, color: c.green, m: 'pix'},
	{d: '04/10', desc: 'Academia', v: -120, Icon: Dumbbell, color: c.green, m: 'debito'},
	{d: '02/10', desc: 'Aluguel', v: -1200, Icon: Home, color: c.purple, m: 'pix'},
	{d: '01/10', desc: 'Streaming', v: -45, Icon: Film, color: '#818CF8', m: 'credito'},
] as const;
const T_START = 632;

const Transacoes: React.FC<{f: number}> = ({f}) => {
	const l = f - T_START;
	const fa: [number, number] = [W(10, 'entrada') - 1, W(10, 'saída') - 1];
	const filter = f < fa[0] ? 0 : f < fa[1] ? 1 : 2;
	const list = TX.filter((t) => (filter === 1 ? t.v > 0 : filter === 2 ? t.v < 0 : true));
	const listStart = filter === 0 ? T_START + 6 : fa[filter - 1];
	const bankPulse = (i: number) => sprPop(f, i === 0 ? W(10, 'bancos') : W(10, 'cartões'));
	return (
		<Screen tab={2}>
			<Header kicker="Financeiro · Outubro" title="Transações" f={l} />
			<div style={{display: 'flex', gap: 8, marginBottom: 12}}>
				{ACCOUNTS.map((b, i) => (
					<Card
						key={b.name}
						style={{
							flex: 1,
							padding: '9px 11px',
							borderColor: b.color + (bankPulse(i) > 0.05 ? 'FF' : '66'),
							...rise(l, 2 + i * 2),
							transform: `${rise(l, 2 + i * 2).transform} scale(${1 + 0.06 * Math.sin(Math.PI * Math.min(1, bankPulse(i)))})`,
						}}
					>
						<div style={{fontSize: 12, color: b.color, fontWeight: 700}}>{b.name}</div>
						<div style={{fontFamily: display, fontSize: 21, fontWeight: 700}}>{b.value}</div>
					</Card>
				))}
			</div>
			<Pills items={['Todas', 'Entradas', 'Saídas']} active={filter} f={l} />
			<div style={{display: 'flex', flexDirection: 'column', gap: 7}}>
				{list.map((t, i) => {
					const [ml, mc] = METHOD[t.m];
					const at = listStart + i * 2;
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
								opacity: tween(f, [at, at + 6], [0, 1]),
								transform: `translateY(${tween(f, [at, at + 12], [22, 0])}px)`,
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

// ---------------------------------------------------------------- Financeiro: despesas
const SCHEDULE = [
	{day: '02', desc: 'Aluguel', v: 1200, kind: 'Fixa', color: c.purple},
	{day: '05', desc: 'Fatura do cartão', v: 1890, kind: 'Fixa', color: c.purple},
	{day: '12', desc: 'Curso de inglês', v: 350, kind: 'Parcela 2/3', color: c.amber},
	{day: '15', desc: 'Internet', v: 99, kind: 'Fixa', color: c.purple},
	{day: '26', desc: 'Presente', v: 120, kind: 'Pontual', color: c.blue},
];
export const CATS = [
	{name: 'Moradia', v: 1500, color: c.purple},
	{name: 'Mercado', v: 600, color: '#A3E635'},
	{name: 'Saúde & Fitness', v: 450, color: c.green},
	{name: 'Alimentação', v: 320, color: c.orange},
	{name: 'Lazer', v: 250, color: c.pink},
];
const TOTAL = CATS.reduce((a, b) => a + b.v, 0);
const D_START = 706;

const Despesas: React.FC<{f: number}> = ({f}) => {
	const l = f - D_START;
	const tapFixa = W(11, 'fixa') - 1;
	const tapPont = W(11, 'pontual') - 1;
	const knob = tween(f, [tapPont, tapPont + 8], [0, 1]);
	const fixa = knob < 0.5;
	const R = 46;
	const circ = 2 * Math.PI * R;
	const grow = tween(f, [W(11, 'categoria') - 4, W(11, 'categoria') + 14], [0, 1]);
	const sch = W(11, 'cronograma') - 6;
	let acc = 0;
	return (
		<Screen tab={2}>
			<Header kicker="Financeiro · Despesas" title="Agendar pagamento" f={l} />
			<Card style={{marginBottom: 10, padding: 12, ...rise(l, 2)}}>
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
						<div
							key={t}
							style={{
								position: 'relative',
								flex: 1,
								height: 38,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 6,
								fontSize: 14,
								fontWeight: 700,
								color: (i === 0) === fixa ? '#fff' : c.muted,
							}}
						>
							{i === 0 ? <Repeat size={15} /> : <CalendarDays size={15} />}
							{t}
							{i === 0 && <Tap f={f} at={tapFixa} />}
							{i === 1 && <Tap f={f} at={tapPont} />}
						</div>
					))}
				</div>
			</Card>
			<Card style={{marginBottom: 10, ...rise(l, 6)}}>
				<Label style={{marginBottom: 8}}>Cronograma de outubro</Label>
				{SCHEDULE.map((x, i) => {
					const at = sch + i * 3;
					return (
						<div
							key={x.desc}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 10,
								padding: '7px 0',
								borderTop: i ? `1px solid ${c.border}` : 'none',
								opacity: tween(f, [at, at + 6], [0, 1]),
								transform: `translateX(${tween(f, [at, at + 12], [30, 0])}px)`,
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
			<Card style={{display: 'flex', alignItems: 'center', gap: 14, ...rise(f - (W(11, 'categoria') - 10), 0)}}>
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
						<div key={cat.name} style={{display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, marginTop: 3, opacity: tween(f, [W(11, 'categoria') + i * 2, W(11, 'categoria') + 6 + i * 2], [0, 1])}}>
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

// ---------------------------------------------------------------- splash (red, matches the end card)
const Splash: React.FC<{f: number}> = ({f}) => (
	<div style={{width: 390, height: 845, background: P.red, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18}}>
		<AppMark size={120} bg={P.white} fg={P.red} />
		<Wordmark size={64} color={P.white} />
	</div>
);

// ---------------------------------------------------------------- timeline of screens
type Item = {at: number; el: (f: number) => React.ReactNode; slide?: number};
// "slide" = in-app transition length (frames); without it the swap is instant (used while the phone faces away)
export const TIMELINE: Item[] = [
	{at: 182, el: (f) => <Habitos f={f} />},
	{at: 266, el: (f) => <Metricas f={f} />, slide: 9},
	{at: 336, el: (f) => <Plano f={f} />},
	{at: 393, el: (f) => <Estilos f={f} />, slide: 9},
	{at: 478, el: (f) => <Series f={f} />, slide: 9},
	{at: 578, el: (f) => <Visao f={f} />},
	{at: 632, el: (f) => <Transacoes f={f} />, slide: 9},
	{at: 706, el: (f) => <Despesas f={f} />, slide: 9},
	{at: W(12, 'Hábitos') - 3, el: (f) => <Habitos f={f + 400} />, slide: 7},
	{at: W(12, 'treino') - 3, el: (f) => <Plano f={f + 200} />, slide: 7},
	{at: W(12, 'dinheiro') - 3, el: (f) => <Visao f={f + 120} />, slide: 7},
	{at: 832, el: (f) => <Splash f={f} />, slide: 6},
];

export const screenAt = (f: number) => {
	let i = 0;
	for (let k = 0; k < TIMELINE.length; k++) if (f >= TIMELINE[k].at) i = k;
	return i;
};

export const Tela: React.FC = () => {
	const f = useCurrentFrame();
	const i = screenAt(f);
	const cur = TIMELINE[i];
	const prev = i > 0 ? TIMELINE[i - 1] : null;
	const t = cur.slide ? tween(f, [cur.at, cur.at + cur.slide], [0, 1]) : 1;
	return (
		<AbsoluteFill style={{background: c.bg}}>
			<div style={{position: 'absolute', left: 0, top: 0, width: 390, height: 845, transform: `scale(${S})`, transformOrigin: '0 0', overflow: 'hidden'}}>
				{prev && t < 1 ? (
					<div style={{position: 'absolute', inset: 0, transform: `translateX(${-120 * t}px)`, opacity: 1 - t}}>{prev.el(f)}</div>
				) : null}
				<div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - t) * 160}px)`, opacity: Math.min(1, t * 1.4)}}>{cur.el(f)}</div>
			</div>
		</AbsoluteFill>
	);
};
