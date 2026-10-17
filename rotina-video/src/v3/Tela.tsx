import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ArrowDownRight, ArrowUpRight, Award, Banknote, CalendarDays, Dumbbell, Flame, Home, ListChecks, Percent, PiggyBank, Plus, Repeat, Settings, TrendingUp, Utensils, Wallet} from 'lucide-react';
import {brl, c, display, body} from '../theme';
import {Card, Label} from '../screens/ui';
import {AppMark} from '../v2/Marca';
import {E, M, sp, tw} from './theme';
import {W} from './tempo';

// Telas do app Rotina para a tela do celular do Blender (sequencia JPEG 1080 x 2309 = area ativa do premium.py).
// Mesmo visual do app real (fundo #080808, vermelho, Barlow). Cada toque e cada troca de tela esta presa a uma palavra.
// Micro-interacoes pela button-animation (valores, nao o codigo): toque 1 -> 0,96 -> 1; check desenhado; rotulo em
// sequencia "Salvar -> Salvando... -> Salvo"; seletor deslizante com mola {650,40,0.5}.

export const UI_W = 390;
export const UI_H = 834; // 390 x 834 pt -> 1080 x 2309 px
export const S = 1080 / UI_W;
export const TAB_H = 84;

// ---------------------------------------------------------------- pecas
export const press = (f: number, at: number) => (f < at - 4 || f > at + 8 ? 1 : f < at ? tw(f, [at - 4, at], [1, 0.96], E.press) : tw(f, [at, at + 6], [0.96, 1], E.ui));

export const Toque: React.FC<{f: number; at: number; x: number | string; y: number | string}> = ({f, at, x, y}) => {
	const l = f - at;
	if (l < -5 || l > 18) return null;
	const dot = tw(l, [-5, 0], [0, 1], E.press) * (1 - tw(l, [3, 10], [0, 1], E.ui));
	const rip = tw(l, [0, 18], [0, 1], E.ui);
	return (
		<div style={{position: 'absolute', left: x, top: y, width: 0, height: 0, zIndex: 9, pointerEvents: 'none'}}>
			<div style={{position: 'absolute', left: -17, top: -17, width: 34, height: 34, borderRadius: 17, background: 'rgba(255,255,255,0.5)', opacity: dot, transform: `scale(${0.7 + 0.3 * dot})`}} />
			<div style={{position: 'absolute', left: -30, top: -30, width: 60, height: 60, borderRadius: 30, border: '2px solid rgba(255,255,255,0.6)', opacity: l >= 0 ? 0.3 * (1 - rip) * 3 : 0, transform: `scale(${0.35 + 0.75 * rip})`}} />
		</div>
	);
};

export const CheckDesenhado: React.FC<{k: number; size?: number}> = ({k, size = 18}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'block'}}>
		<path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
	</svg>
);

const TABS = [
	{label: 'Hábitos', Icon: ListChecks},
	{label: 'Treinos', Icon: Dumbbell},
	{label: 'Financeiro', Icon: Wallet},
	{label: 'Ajustes', Icon: Settings},
];
export const tabX = (i: number) => (UI_W * (i + 0.5)) / 4;
export const TAB_Y = UI_H - TAB_H + 30;

export const Tela: React.FC<{tab: number; f: number; tapTab?: number; children: React.ReactNode}> = ({tab, f, tapTab, children}) => (
	<div style={{width: UI_W, height: UI_H, background: c.bg, color: c.text, fontFamily: body, position: 'relative', overflow: 'hidden'}}>
		<div style={{padding: '54px 18px 0'}}>{children}</div>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: TAB_H, paddingBottom: 22, background: 'rgba(8,8,8,0.96)', borderTop: `1px solid ${c.border}`, display: 'flex'}}>
			{TABS.map(({label, Icon}, i) => {
				const on = i === tab;
				const k = tapTab !== undefined && on ? press(f, tapTab) : 1;
				return (
					<div key={label} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, color: on ? c.redHi : c.faint, fontSize: 11, fontWeight: on ? 700 : 500, transform: `scale(${k})`}}>
						<Icon size={22} strokeWidth={on ? 2.4 : 2} />
						{label}
					</div>
				);
			})}
		</div>
		{tapTab !== undefined ? <Toque f={f} at={tapTab} x={tabX(tab)} y={TAB_Y} /> : null}
	</div>
);

export const Cabeca: React.FC<{kicker: string; title: string}> = ({kicker, title}) => (
	<div style={{marginBottom: 14}}>
		<div style={{fontFamily: display, fontSize: 13, fontWeight: 600, color: c.muted, textTransform: 'uppercase', letterSpacing: '0.12em'}}>{kicker}</div>
		<div style={{fontFamily: display, fontSize: 34, fontWeight: 700, textTransform: 'uppercase', lineHeight: 1.05}}>{title}</div>
	</div>
);

export const Pilulas: React.FC<{items: string[]; active: number; f?: number; tapAt?: number; slideAt?: number; from?: number}> = ({items, active, f = 0, tapAt, slideAt, from}) => (
	<div style={{position: 'relative', display: 'flex', gap: 7, marginBottom: 14}}>
		{items.map((it, i) => {
			const was = from !== undefined && slideAt !== undefined && f < slideAt ? from : active;
			const on = i === was;
			const k = tapAt !== undefined && i === active ? press(f, tapAt) : 1;
			return (
				<div key={it} style={{position: 'relative', flexShrink: 0, height: 34, padding: '0 13px', borderRadius: 17, display: 'flex', alignItems: 'center', fontSize: 13, fontWeight: on ? 600 : 500, border: `1px solid ${on ? c.red : c.border}`, background: on ? c.redBg : 'transparent', color: on ? c.text : c.muted, transform: `scale(${k})`}}>
					{it}
					{tapAt !== undefined && i === active ? <Toque f={f} at={tapAt} x="50%" y="50%" /> : null}
				</div>
			);
		})}
	</div>
);

// entrada dos blocos dentro da tela (UI: ease-out forte, 6 a 9 q, deslocamento curto)
export const sobe = (f: number, at: number): React.CSSProperties => ({opacity: tw(f, [at, at + 6], [0, 1], E.ui), transform: `translateY(${tw(f, [at, at + 9], [14, 0], E.ui)}px)`});

// ---------------------------------------------------------------- Hábitos de hoje
const HABITOS = ['Dieta', 'Beber 3L de água', 'Ler 10 páginas', 'Treinar', 'Meditar 10 min'];
const H_TAPS: [number, number][] = [
	[W(6, 'cumprido') - 1, 0],
	[W(6, 'soma'), 1],
	[W(6, 'um'), 2],
	[W(6, 'no'), 3],
];
const FOGUINHO = W(6, 'foguinho') + 2;

const Habitos: React.FC<{f: number; desde: number; tapTab?: number; final?: boolean}> = ({f, desde, tapTab, final}) => {
	const tapOf = (i: number) => H_TAPS.find(([, h]) => h === i)?.[0];
	const feitos = final ? 4 : H_TAPS.filter(([t]) => f >= t + 2).length;
	const subiu = final || f >= FOGUINHO;
	const pop = final ? 0 : sp(f, FOGUINHO, M.pop);
	const popK = Math.sin(Math.PI * Math.min(1, pop));
	return (
		<Tela tab={0} f={f} tapTab={tapTab}>
			<Cabeca kicker="Quarta · 8 de outubro" title="Hábitos de hoje" />
			<Card style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, ...sobe(f, desde + 2)}}>
				<div style={{position: 'relative', width: 72, height: 72}}>
					<svg width={72} height={72} style={{transform: 'rotate(-90deg)'}}>
						<circle cx={36} cy={36} r={32.5} fill="none" stroke={c.track} strokeWidth={7} />
						<circle cx={36} cy={36} r={32.5} fill="none" stroke={c.redHi} strokeWidth={7} strokeLinecap="round" strokeDasharray={2 * Math.PI * 32.5} strokeDashoffset={2 * Math.PI * 32.5 * (1 - tw(f, [desde, desde + 1], [feitos / 5, feitos / 5]))} />
					</svg>
					<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display, fontSize: 22, fontWeight: 700, fontVariantNumeric: 'tabular-nums'}}>{feitos}/5</div>
				</div>
				<div>
					<Label>Sequência</Label>
					<div style={{display: 'flex', alignItems: 'center', gap: 6}}>
						<Flame size={24} color={c.amber} fill={c.amber} style={{transform: `scale(${1 + 0.3 * popK})`, transformOrigin: '50% 90%'}} />
						<span style={{display: 'inline-block', fontFamily: display, fontSize: 32, fontWeight: 800, color: c.amber, fontVariantNumeric: 'tabular-nums', transform: `scale(${1 + 0.18 * popK})`}}>{subiu ? 12 : 11}</span>
						<span style={{fontSize: 14, color: c.muted}}>dias seguidos</span>
					</div>
				</div>
			</Card>
			<div style={{display: 'flex', flexDirection: 'column', gap: 9}}>
				{HABITOS.map((h, i) => {
					const t = tapOf(i);
					const on = final ? i < 4 : t !== undefined && f >= t;
					const fill = final ? (i < 4 ? 1 : 0) : t === undefined ? 0 : tw(f, [t, t + 6], [0, 1], E.ui);
					const chk = final ? (i < 4 ? 1 : 0) : t === undefined ? 0 : tw(f, [t + 3, t + 12], [0, 1], E.ui);
					const k = t !== undefined && !final ? press(f, t) : 1;
					return (
						<Card key={h} style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', borderColor: fill > 0.5 ? 'rgba(204,0,0,0.55)' : c.border, ...sobe(f, desde + 5 + i * 2)}}>
							<div style={{position: 'relative', width: 28, height: 28, borderRadius: 9, border: `2px solid ${fill > 0.3 ? c.red : c.border}`, background: `rgba(204,0,0,${fill})`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${k})`}}>
								{chk > 0 ? <CheckDesenhado k={chk} /> : null}
								{t !== undefined && !final ? <Toque f={f} at={t} x="50%" y="50%" /> : null}
							</div>
							<span style={{fontSize: 16, fontWeight: 600, color: on ? c.muted : c.text}}>{h}</span>
						</Card>
					);
				})}
			</div>
			<Card style={{marginTop: 12, padding: '11px 14px', ...sobe(f, desde + 16)}}>
				<Label style={{marginBottom: 8}}>Esta semana</Label>
				<div style={{display: 'flex', justifyContent: 'space-between'}}>
					{['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => {
						const hoje = i === 2;
						const cheio = i < 2;
						return (
							<div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5}}>
								<div style={{width: 30, height: 30, borderRadius: 15, background: cheio ? c.red : 'transparent', border: `2px solid ${cheio ? c.red : hoje ? c.redHi : c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
									{cheio ? <CheckDesenhado k={1} size={15} /> : null}
								</div>
								<span style={{fontSize: 11, fontWeight: 600, color: hoje ? c.text : c.faint}}>{d}</span>
							</div>
						);
					})}
				</div>
			</Card>
		</Tela>
	);
};

// ---------------------------------------------------------------- Métricas ("em qual dia você furou")
const DIAS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
const SEMANA = [100, 80, 35, 80, 100, 60, 100]; // dado de exemplo: quarta e o dia mais baixo
const TREND = [52, 55, 61, 58, 66, 70, 68, 74, 79, 77, 83, 86];
const FUROU = W(7, 'furou');

const Metricas: React.FC<{f: number; desde: number}> = ({f, desde}) => {
	const CW = 322;
	const CH = 70;
	const pts = TREND.map((v, i) => [(i / (TREND.length - 1)) * CW, CH - ((v - 45) / 45) * CH]);
	const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
	const barAt = W(7, 'ver') - 2;
	const destaque = tw(f, [FUROU, FUROU + 6], [0, 1], E.ui);
	const draw = tw(f, [FUROU + 6, FUROU + 30], [0, 1], E.lin);
	const tiles = [
		{label: 'Conclusão', value: '86%', Icon: Percent, color: c.green},
		{label: 'Sequência', value: '12', Icon: Flame, color: c.amber},
		{label: 'Recorde', value: '21', Icon: Award, color: c.purple},
	];
	return (
		<Tela tab={0} f={f}>
			<Cabeca kicker="Hábitos · Outubro" title="Sua evolução" />
			<Pilulas items={['Hoje', 'Métricas', 'Histórico']} active={1} />
			<div style={{display: 'flex', gap: 8, marginBottom: 10}}>
				{tiles.map(({label, value, Icon, color}, i) => (
					<Card key={label} style={{flex: 1, padding: 11, ...sobe(f, desde + 2 + i * 2)}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: c.muted}}>
							<Icon size={13} color={color} /> {label}
						</div>
						<div style={{fontFamily: display, fontSize: 28, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums'}}>{value}</div>
					</Card>
				))}
			</div>
			<Card style={{marginBottom: 10, ...sobe(f, desde + 6)}}>
				<Label style={{marginBottom: 10}}>Esta semana</Label>
				<div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 104}}>
					{SEMANA.map((v, i) => {
						const at = barAt + i * 2;
						const h = tw(f, [at, at + 9], [0, v], E.ui);
						const qua = i === 2;
						return (
							<div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 34}}>
								<div style={{position: 'relative', width: 24, height: 76, borderRadius: 7, background: c.s3, display: 'flex', alignItems: 'flex-end'}}>
									<div style={{width: '100%', height: `${h}%`, borderRadius: 7, background: v === 100 ? c.redHi : 'rgba(255,90,90,0.5)'}} />
									{qua ? <div style={{position: 'absolute', inset: -4, borderRadius: 10, border: `2px solid ${c.redHi}`, opacity: destaque, transform: `scale(${1.2 - 0.2 * destaque})`}} /> : null}
								</div>
								<span style={{fontSize: 11, color: qua && destaque > 0.5 ? c.redHi : c.faint, fontWeight: 700}}>{DIAS[i]}</span>
							</div>
						);
					})}
				</div>
			</Card>
			<Card style={sobe(f, desde + 10)}>
				<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
					<Label>Taxa de conclusão · 12 semanas</Label>
					<span style={{fontSize: 12, color: c.green, fontWeight: 700}}>+34 pts</span>
				</div>
				<svg width={CW} height={CH + 4} style={{overflow: 'visible'}}>
					<path d={d} fill="none" stroke={c.green} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
				</svg>
			</Card>
		</Tela>
	);
};

// ---------------------------------------------------------------- Treinos: planejar a semana
const PLANO = [
	['Seg', 'Peito', c.redHi],
	['Ter', 'Costas', c.blue],
	['Qua', 'Perna', c.green],
	['Qui', 'Ombro', c.amber],
	['Sex', 'Braço', c.pink],
	['Sáb', 'Cardio', c.orange],
	['Dom', 'Descanso', c.faint],
] as const;
const SEG = W(8, 'segunda');
const TER = W(8, 'terça');

const Planejar: React.FC<{f: number; desde: number; tapTab: number}> = ({f, desde, tapTab}) => {
	const dia = f >= TER ? 1 : 0;
	const ex = dia === 0 ? ['Supino Reto', 'Supino Inclinado', 'Crucifixo Máquina', 'Crossover'] : ['Puxada Frontal', 'Remada Curvada', 'Remada Baixa', 'Pulldown'];
	const troca = dia === 1 ? TER : desde;
	return (
		<Tela tab={1} f={f} tapTab={tapTab}>
			<Cabeca kicker="Treinos · Outubro" title="Planejar" />
			<Pilulas items={['Treino', 'Planejar', 'Progresso', 'Cardio']} active={1} />
			<Card style={{marginBottom: 10, padding: '10px 12px', ...sobe(f, desde + 2)}}>
				<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
					<Label>Sistema da semana</Label>
					<span style={{fontSize: 12, fontWeight: 700, color: c.orange}}>ABCDE · Hipertrofia</span>
				</div>
				<div style={{display: 'flex', gap: 5}}>
					{PLANO.map(([d, nome, cor], i) => {
						const at = desde + 4 + i * 2;
						const k = sp(f, at, M.ui);
						const acende = i === 0 ? sp(f, SEG, M.pop) : i === 1 ? sp(f, TER, M.pop) : 0;
						const ativo = (i === 0 && f >= SEG && f < TER) || (i === 1 && f >= TER);
						return (
							<div key={d} style={{flex: 1, borderRadius: 9, padding: '7px 0', textAlign: 'center', background: nome === 'Descanso' ? c.s3 : cor + '26', border: `1.5px solid ${ativo ? cor : 'transparent'}`, opacity: Math.min(1, k * 1.4), transform: `translateY(${(1 - Math.min(1, k)) * 12}px) scale(${1 + 0.08 * Math.sin(Math.PI * Math.min(1, acende))})`}}>
								<div style={{fontSize: 11, color: c.muted, fontWeight: 600}}>{d}</div>
								<div style={{fontFamily: display, fontSize: 13, fontWeight: 700, color: nome === 'Descanso' ? c.faint : cor}}>{nome === 'Descanso' ? '·' : nome}</div>
							</div>
						);
					})}
				</div>
			</Card>
			<Card style={{...sobe(f, desde + 8)}}>
				<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
					<div style={{opacity: tw(f, [troca, troca + 6], [0, 1], E.ui), transform: `translateX(${tw(f, [troca, troca + 9], [dia ? 24 : 0, 0], E.ui)}px)`}}>
						<Label>{dia ? 'Terça' : 'Segunda'}</Label>
						<div style={{fontFamily: display, fontSize: 24, fontWeight: 700, textTransform: 'uppercase'}}>{dia ? 'Treino de Costas' : 'Treino de Peito'}</div>
					</div>
					<span style={{fontSize: 12, color: c.muted}}>4 exercícios</span>
				</div>
				<div style={{display: 'flex', flexDirection: 'column', gap: 7}}>
					{ex.map((e, i) => {
						const at = troca + 3 + i * 2;
						return (
							<div key={e} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 10, background: c.s3, fontSize: 14, fontWeight: 600, opacity: tw(f, [at, at + 6], [0, 1], E.ui), transform: `translateX(${tw(f, [at, at + 9], [24, 0], E.ui)}px)`}}>
								<span>
									<span style={{color: c.faint, marginRight: 8}}>{i + 1}</span>
									{e}
								</span>
								<span style={{color: c.muted, fontSize: 12}}>4 × 10</span>
							</div>
						);
					})}
					<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 42, borderRadius: 10, border: `1px dashed ${c.border}`, color: c.redHi, fontSize: 14, fontWeight: 600}}>
						<Plus size={16} /> Adicionar exercício
					</div>
				</div>
			</Card>
		</Tela>
	);
};

// ---------------------------------------------------------------- Treinos: registrar as séries
const PONTOS = [92, 93, 95, 95, 98, 101, 104, 107, 110];
const digita = (f: number, at: number, v: string) => (f < at ? '' : v.slice(0, Math.max(0, Math.min(v.length, Math.floor((f - at) / 2) + 1))));
const SALVA = W(9, 'cai');
const SALVO = SALVA + 12; // "Salvando..." fica 12 q (minimo de 300 a 500 ms do spinner)
const GRAF = W(9, 'gráfico');

const Series: React.FC<{f: number; desde: number}> = ({f, desde}) => {
	const CW = 322;
	const CH = 84;
	const pts = PONTOS.map((v, i) => [(i / (PONTOS.length - 1)) * CW, CH - ((v - 88) / 24) * CH]);
	const linha = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
	const draw = tw(f, [GRAF - 2, GRAF + 26], [0, 1], E.lin);
	const ult = pts[pts.length - 1];
	const kg = W(9, 'peso');
	const rep = W(9, 'repetição');
	// rotulo em sequencia: o velho sai por completo antes do novo entrar
	const estado = f < SALVA ? 0 : f < SALVO ? 1 : 2;
	const troca = estado === 1 ? SALVA : SALVO;
	const saiVelho = estado > 0 ? tw(f, [troca, troca + 5], [1, 0], E.exit) : 1;
	const entraNovo = estado > 0 ? tw(f, [troca + 5, troca + 11], [0, 1], E.ui) : 1;
	const rotulo = (e: number) =>
		e === 0 ? (
			'Salvar séries'
		) : e === 1 ? (
			<span style={{display: 'flex', alignItems: 'center', gap: 8}}>
				<span style={{width: 16, height: 16, borderRadius: 8, border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', transform: `rotate(${(f - SALVA) * 30}deg)`}} />
				Salvando…
			</span>
		) : (
			<span style={{display: 'flex', alignItems: 'center', gap: 8}}>
				<CheckDesenhado k={tw(f, [SALVO + 5, SALVO + 13], [0, 1], E.ui)} size={18} /> Séries salvas
			</span>
		);
	const k = press(f, SALVA);
	return (
		<Tela tab={1} f={f}>
			<div style={{marginBottom: 12}}>
				<div style={{fontFamily: display, fontSize: 13, fontWeight: 600, color: c.muted, letterSpacing: '0.12em', textTransform: 'uppercase'}}>Treino de Peito · Exercício 1/4</div>
				<div style={{fontFamily: display, fontSize: 34, fontWeight: 700, textTransform: 'uppercase', lineHeight: 1.05}}>Supino Reto</div>
				<div style={{display: 'flex', gap: 6, marginTop: 6}}>
					<span style={{fontSize: 12, fontWeight: 700, color: c.orange, background: 'rgba(251,146,60,0.15)', padding: '3px 8px', borderRadius: 8}}>Hipertrofia · 8–12</span>
					<span style={{fontSize: 12, fontWeight: 700, color: c.muted, background: c.s3, padding: '3px 8px', borderRadius: 8}}>Última: 80 kg × 10</span>
				</div>
			</div>
			<Card style={{marginBottom: 10, ...sobe(f, desde + 2)}}>
				<div style={{display: 'grid', gridTemplateColumns: '50px 1fr 1fr', fontSize: 12, color: c.muted, fontWeight: 600, marginBottom: 6}}>
					<span>Série</span>
					<span>Carga</span>
					<span>Reps</span>
				</div>
				{[0, 1, 2].map((i) => {
					const vals: [string, number][] = i === 0 ? [['82,5 kg', kg], ['10', rep]] : [['82,5 kg', -99], [i === 1 ? '10' : '9', -99]];
					const pronta = i > 0 || f >= rep + 4;
					return (
						<div key={i} style={{display: 'grid', gridTemplateColumns: '50px 1fr 1fr', gap: 8, marginBottom: 7}}>
							<div style={{fontFamily: display, fontSize: 20, fontWeight: 700, color: pronta && estado === 2 ? c.green : c.faint, alignSelf: 'center'}}>{i + 1}</div>
							{vals.map(([v, at], j) => {
								const txt = at < 0 ? v : digita(f, at, v);
								const ativo = at > 0 && f >= at - 2 && f < at + 10;
								return (
									<div key={j} style={{height: 40, borderRadius: 10, background: c.s3, border: `1px solid ${ativo ? c.redHi : c.border}`, display: 'flex', alignItems: 'center', padding: '0 12px', fontFamily: display, fontSize: 20, fontWeight: 700, fontVariantNumeric: 'tabular-nums'}}>
										{txt}
										{ativo ? <span style={{width: 2, height: 20, background: c.redHi, marginLeft: 2}} /> : null}
									</div>
								);
							})}
						</div>
					);
				})}
				<div style={{position: 'relative', marginTop: 4, height: 44, borderRadius: 12, background: estado === 2 ? c.greenBg : c.red, border: estado === 2 ? '1px solid rgba(52,211,153,0.4)' : '1px solid transparent', color: estado === 2 ? c.green : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, transform: `scale(${k})`}}>
					{estado > 0 && saiVelho > 0 ? <div style={{position: 'absolute', opacity: saiVelho, transform: `scale(${0.9 + 0.1 * saiVelho})`, filter: `blur(${(1 - saiVelho) * 4}px)`}}>{rotulo(estado - 1)}</div> : null}
					<div style={{position: 'absolute', opacity: estado === 0 ? 1 : entraNovo, transform: `scale(${estado === 0 ? 1 : 0.8 + 0.2 * entraNovo})`, filter: `blur(${estado === 0 ? 0 : (1 - entraNovo) * 4}px)`}}>{rotulo(estado)}</div>
					<Toque f={f} at={SALVA} x="50%" y="50%" />
				</div>
			</Card>
			<Card style={{opacity: tw(f, [SALVO, SALVO + 6], [0, 1], E.ui), transform: `translateY(${tw(f, [SALVO, SALVO + 9], [16, 0], E.ui)}px)`}}>
				<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
					<Label>Evolução · 1RM estimado</Label>
					<span style={{display: 'flex', alignItems: 'center', gap: 4, color: c.green, fontSize: 13, fontWeight: 700}}>
						<TrendingUp size={15} /> +19%
					</span>
				</div>
				<svg width={CW} height={CH + 6} style={{overflow: 'visible'}}>
					<path d={linha} fill="none" stroke={c.redHi} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
					<circle cx={ult[0]} cy={ult[1]} r={6 * Math.min(1.08, sp(f, GRAF + 24, M.pop))} fill={c.redHi} stroke={c.bg} strokeWidth={2} />
				</svg>
			</Card>
		</Tela>
	);
};

// ---------------------------------------------------------------- Financeiro: visão
const SAL = W(10, 'salário');
const PIX = W(10, 'PIX');
const ACOMP = W(10, 'acompanha');
const MESES = [
	['Mai', 5200, 3400],
	['Jun', 5450, 3100],
	['Jul', 5100, 3600],
	['Ago', 5900, 3300],
	['Set', 6200, 3500],
	['Out', 6550, 2310],
] as const;

const Numero: React.FC<{v: number; at: number; f: number; size: number; color?: string}> = ({v, at, f, size, color}) => {
	const p = sp(f, at, M.pop);
	return <span style={{display: 'inline-block', fontFamily: display, fontSize: size, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums', transform: `scale(${1 + 0.06 * Math.sin(Math.PI * Math.min(1, p))})`, transformOrigin: '0 50%'}}>{brl(v)}</span>;
};

const Visao: React.FC<{f: number; desde: number; tapTab: number}> = ({f, desde, tapTab}) => {
	const entradas = f >= SAL ? 6550 : 1750; // salario de R$ 4.800 entra por PIX
	const saidas = f >= PIX ? 2310 : 1110; // aluguel de R$ 1.200 sai por PIX
	const saldo = entradas - saidas;
	const atSaldo = f >= PIX ? PIX : f >= SAL ? SAL : -99;
	const brilho = tw(f, [ACOMP, ACOMP + 6], [0, 1], E.ui) * (1 - tw(f, [ACOMP + 14, ACOMP + 26], [0, 1], E.cam));
	return (
		<Tela tab={2} f={f} tapTab={tapTab}>
			<Cabeca kicker="Outubro 2026" title="Financeiro" />
			<Pilulas items={['Visão', 'Transações', 'Cartões', 'Rendas']} active={0} />
			<Card style={{marginBottom: 10, borderColor: brilho > 0.05 ? `rgba(255,90,90,${0.25 + 0.6 * brilho})` : c.border, ...sobe(f, desde + 2)}}>
				<Label>Saldo do mês</Label>
				<Numero v={saldo} at={atSaldo} f={f} size={46} />
				<div style={{display: 'flex', gap: 10, marginTop: 10}}>
					{(
						[
							['Entradas', entradas, c.green, ArrowUpRight, SAL],
							['Saídas', saidas, c.redHi, ArrowDownRight, PIX],
						] as const
					).map(([label, v, cor, Icon, at]) => {
						const g = sp(f, at, M.pop);
						return (
							<div key={label} style={{flex: 1, background: c.s3, borderRadius: 10, padding: '8px 10px', border: `1px solid ${f >= at && f < at + 20 ? cor : 'transparent'}`, transform: `translateY(${-4 * Math.sin(Math.PI * Math.min(1, g))}px)`}}>
								<div style={{display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: cor, fontWeight: 700}}>
									<Icon size={14} /> {label}
								</div>
								<Numero v={v} at={at} f={f} size={22} />
							</div>
						);
					})}
				</div>
			</Card>
			<Card style={{marginBottom: 10, ...sobe(f, desde + 6)}}>
				<Label style={{marginBottom: 6}}>Últimas movimentações</Label>
				{(
					[
						[SAL, 'Salário', 'PIX recebido', '+ R$ 4.800,00', c.green, Banknote],
						[PIX, 'Aluguel', 'PIX enviado', '− R$ 1.200,00', c.redHi, Home],
					] as const
				).map(([at, t, sub, v, cor, Icon], i) => (
					<div key={t} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: i ? `1px solid ${c.border}` : 'none', opacity: tw(f, [at, at + 6], [0, 1], E.ui), transform: `translateY(${tw(f, [at, at + 9], [12, 0], E.ui)}px)`}}>
						<div style={{width: 34, height: 34, borderRadius: 10, background: cor + '22', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<Icon size={17} color={cor} />
						</div>
						<div style={{flex: 1}}>
							<div style={{fontSize: 14, fontWeight: 600}}>{t}</div>
							<div style={{fontSize: 12, color: c.muted}}>{sub}</div>
						</div>
						<span style={{fontFamily: display, fontSize: 17, fontWeight: 700, color: cor, fontVariantNumeric: 'tabular-nums'}}>{v}</span>
					</div>
				))}
			</Card>
			<Card style={sobe(f, desde + 10)}>
				<Label style={{marginBottom: 10}}>Entradas × saídas · 6 meses</Label>
				<div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 120}}>
					{MESES.map(([m, inn, out], i) => {
						const g = tw(f, [desde + 12 + i * 2, desde + 24 + i * 2], [0, 1], E.ui);
						return (
							<div key={m} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
								<div style={{display: 'flex', alignItems: 'flex-end', gap: 4, height: 96}}>
									<div style={{width: 14, height: (inn / 6600) * 96 * g, borderRadius: 4, background: c.green}} />
									<div style={{width: 14, height: (out / 6600) * 96 * g, borderRadius: 4, background: c.redHi}} />
								</div>
								<span style={{fontSize: 11, color: i === 5 ? c.text : c.faint, fontWeight: 600}}>{m}</span>
							</div>
						);
					})}
				</div>
			</Card>
		</Tela>
	);
};

// ---------------------------------------------------------------- Financeiro: despesas fixas x pontuais
const FIXA = W(11, 'fixa');
const PONT = W(11, 'pontual');
const AGENDA = [
	{day: '05', desc: 'Aluguel', kind: 'Fixa', v: 1200, color: c.purple},
	{day: '10', desc: 'Academia', kind: 'Fixa', v: 120, color: c.purple},
	{day: '12', desc: 'Presente da mãe', kind: 'Pontual', v: 180, color: c.amber},
	{day: '15', desc: 'Internet', kind: 'Fixa', v: 99, color: c.purple},
	{day: '22', desc: 'Conserto do carro', kind: 'Pontual', v: 450, color: c.amber},
];
const CATS = [
	{name: 'Moradia', v: 1500, color: c.purple},
	{name: 'Mercado', v: 600, color: '#A3E635'},
	{name: 'Saúde & Fitness', v: 450, color: c.green},
	{name: 'Alimentação', v: 320, color: c.orange},
	{name: 'Lazer', v: 250, color: c.pink},
];
const TOTAL = CATS.reduce((a, b) => a + b.v, 0);

const Despesas: React.FC<{f: number; desde: number}> = ({f, desde}) => {
	const knob = sp(f, PONT, M.seletor); // ~8 q, sem quique
	const fixa = knob < 0.5;
	const R = 46;
	const circ = 2 * Math.PI * R;
	const grow = tw(f, [W(11, 'outro'), W(11, 'outro') + 20], [0, 1], E.out);
	let acc = 0;
	return (
		<Tela tab={2} f={f}>
			<Cabeca kicker="Financeiro · Despesas" title="Agendar pagamento" />
			<Card style={{marginBottom: 10, padding: 12, ...sobe(f, desde + 2)}}>
				<div style={{position: 'relative', display: 'flex', background: c.s3, borderRadius: 12, padding: 3}}>
					<div style={{position: 'absolute', top: 3, bottom: 3, left: `calc(3px + ${Math.min(1.02, knob)} * (50% - 3px))`, width: 'calc(50% - 3px)', borderRadius: 10, background: c.red, transform: `scale(${press(f, FIXA)})`}} />
					{['Fixa · todo mês', 'Pontual · uma vez'].map((t, i) => (
						<div key={t} style={{position: 'relative', flex: 1, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: (i === 0) === fixa ? '#fff' : c.muted}}>
							{i === 0 ? <Repeat size={15} /> : <CalendarDays size={15} />}
							{t}
							{i === 0 ? <Toque f={f} at={FIXA} x="50%" y="50%" /> : <Toque f={f} at={PONT - 1} x="50%" y="50%" />}
						</div>
					))}
				</div>
			</Card>
			<Card style={{marginBottom: 10, ...sobe(f, desde + 6)}}>
				<Label style={{marginBottom: 8}}>Cronograma de outubro</Label>
				{AGENDA.map((x, i) => {
					const at = desde + 8 + i * 2;
					const realce = (x.kind === 'Fixa' && f >= FIXA && f < PONT) || (x.kind === 'Pontual' && f >= PONT);
					return (
						<div key={x.desc} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '7px 6px', margin: '0 -6px', borderRadius: 8, background: realce ? 'rgba(204,0,0,0.12)' : 'transparent', borderTop: i ? `1px solid ${c.border}` : 'none', opacity: tw(f, [at, at + 6], [0, 1], E.ui), transform: `translateX(${tw(f, [at, at + 9], [20, 0], E.ui)}px)`}}>
							<div style={{width: 34, textAlign: 'center', fontFamily: display, fontSize: 20, fontWeight: 700, color: c.muted}}>{x.day}</div>
							<div style={{flex: 1, fontSize: 14, fontWeight: 600}}>{x.desc}</div>
							<span style={{display: 'inline-flex', alignItems: 'center', height: 22, padding: '0 8px', borderRadius: 11, fontSize: 11, fontWeight: 700, color: x.color, background: x.color + '22', border: `1px solid ${x.color}55`}}>{x.kind}</span>
							<div style={{width: 76, textAlign: 'right', fontFamily: display, fontSize: 17, fontWeight: 700, color: c.redHi, fontVariantNumeric: 'tabular-nums'}}>R$ {x.v.toLocaleString('pt-BR')}</div>
						</div>
					);
				})}
			</Card>
			<Card style={{display: 'flex', alignItems: 'center', gap: 14, ...sobe(f, desde + 12)}}>
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
					{CATS.map((cat) => (
						<div key={cat.name} style={{display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, marginTop: 3}}>
							<span style={{width: 8, height: 8, borderRadius: 4, background: cat.color}} />
							<span style={{flex: 1, color: c.muted}}>{cat.name}</span>
							<span style={{fontWeight: 700}}>{Math.round((cat.v / TOTAL) * 100)}%</span>
						</div>
					))}
				</div>
			</Card>
		</Tela>
	);
};

// ---------------------------------------------------------------- abertura do app (vermelha, com a marca)
const Abertura: React.FC<{f: number; desde: number}> = ({f, desde}) => (
	<div style={{width: UI_W, height: UI_H, background: c.red, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20}}>
		<AppMark size={128} bg="#FFFFFF" fg={c.red} draw={tw(f, [desde + 2, desde + 22], [0, 1], E.out)} />
		<div style={{fontFamily: display, fontSize: 60, fontWeight: 600, letterSpacing: '0.02em', color: '#fff', opacity: tw(f, [desde + 10, desde + 18], [0, 1], E.ui), transform: `translateY(${tw(f, [desde + 10, desde + 20], [16, 0], E.ui)}px)`}}>ROTINA</div>
	</div>
);

// v4: abertura clara (papel com a marca vermelha), para contrastar com o fundo vermelho do video
const AberturaClara: React.FC<{f: number; desde: number}> = ({f, desde}) => (
	<div style={{width: UI_W, height: UI_H, background: '#F7F3EC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20}}>
		<AppMark size={128} bg={c.red} fg="#FFFFFF" draw={tw(f, [desde + 2, desde + 22], [0, 1], E.out)} />
		<div style={{fontFamily: display, fontSize: 60, fontWeight: 600, letterSpacing: '0.02em', color: '#111111', opacity: tw(f, [desde + 10, desde + 18], [0, 1], E.ui), transform: `translateY(${tw(f, [desde + 10, desde + 20], [16, 0], E.ui)}px)`}}>ROTINA</div>
	</div>
);

// ---------------------------------------------------------------- tela de bloqueio do gancho (antes do app ligar)
// "Segunda eu comeco" -> relogio cedo; em "quarta" a data e a hora rolam; as notificacoes dos 3 apps se empilham
// em "voce ja perdeu a conta". A troca de data/hora e um cruzamento sem recorte (regra: nada de mascara cortando).
const NOTIFS = [
	{app: 'Dieta', msg: 'Você não registrou o almoço', Icon: Utensils, at: W(4, 'você')},
	{app: 'Academia', msg: 'Treino de ontem: não feito', Icon: Dumbbell, at: W(4, 'perdeu')},
	{app: 'Dinheiro', msg: '3 gastos sem anotar', Icon: PiggyBank, at: W(4, 'conta')},
];
const VIRA_DIA = W(4, 'quarta');

const Rola: React.FC<{f: number; at: number; a: string; b: string; style: React.CSSProperties}> = ({f, at, a, b, style}) => {
	const k = tw(f, [at, at + 12], [0, 1], E.uiMove);
	const lh = Number(style.lineHeight ?? 1) * Number(style.fontSize ?? 16);
	return (
		<div style={{position: 'relative', height: lh}}>
			<div style={{...style, transform: `translateY(${-0.4 * lh * k}px)`, opacity: 1 - tw(k, [0, 0.6], [0, 1], E.lin), filter: `blur(${3 * k}px)`}}>{a}</div>
			<div style={{...style, position: 'absolute', left: 0, right: 0, top: 0, transform: `translateY(${0.4 * lh * (1 - k)}px)`, opacity: tw(k, [0.3, 1], [0, 1], E.lin), filter: `blur(${3 * (1 - k)}px)`}}>{b}</div>
		</div>
	);
};

const Bloqueio: React.FC<{f: number}> = ({f}) => {
	const txt: React.CSSProperties = {textAlign: 'center', color: '#F5F5F7', whiteSpace: 'nowrap'};
	return (
		<div style={{position: 'relative', width: UI_W, height: UI_H, overflow: 'hidden', background: 'radial-gradient(120% 70% at 50% 108%, #3A0606 0%, #160505 38%, #070707 70%), #070707'}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 96}}>
				<Rola f={f} at={VIRA_DIA} a="segunda-feira, 6 de outubro" b="quarta-feira, 8 de outubro" style={{...txt, fontFamily: body, fontWeight: 500, fontSize: 18, lineHeight: 1.3, color: 'rgba(245,245,247,0.78)'}} />
				<Rola f={f} at={VIRA_DIA + 3} a="06:30" b="09:47" style={{...txt, fontFamily: display, fontWeight: 600, fontSize: 104, lineHeight: 1.0, letterSpacing: '0.01em'}} />
			</div>
			<div style={{position: 'absolute', left: 12, right: 12, top: 300, display: 'flex', flexDirection: 'column', gap: 8}}>
				{NOTIFS.map((n) => {
					if (f < n.at) return null;
					const k = sp(f, n.at, M.ui);
					return (
						<div key={n.app} style={{height: 70, borderRadius: 22, background: 'rgba(44,44,46,0.82)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px', opacity: Math.min(1, k * 1.6), transform: `translateY(${-26 * (1 - k)}px) scale(${0.94 + 0.06 * k})`}}>
							<div style={{width: 38, height: 38, borderRadius: 10, background: '#3A3A3C', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
								<n.Icon size={22} color="#F5F5F7" strokeWidth={2} />
							</div>
							<div style={{flex: 1, minWidth: 0, fontFamily: body, color: '#F5F5F7'}}>
								<div style={{display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 600}}>
									<span>{n.app}</span>
									<span style={{fontWeight: 500, fontSize: 13, color: 'rgba(245,245,247,0.55)'}}>agora</span>
								</div>
								<div style={{fontSize: 14.5, fontWeight: 500, color: 'rgba(245,245,247,0.82)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{n.msg}</div>
							</div>
						</div>
					);
				})}
			</div>
			<div style={{position: 'absolute', left: (UI_W - 134) / 2, bottom: 9, width: 134, height: 5, borderRadius: 3, background: 'rgba(245,245,247,0.6)'}} />
		</div>
	);
};

// ---------------------------------------------------------------- linha do tempo das telas
type Item = {at: number; el: (f: number) => React.ReactNode; slide?: number; dir?: 1 | -1};
const LIGA = W(5, 'junta') + 4;
const HAB = W(5, 'mesmo');
const MET = W(7, 'dá') - 1;
const TREINO = W(8, 'Você') - 3;
const SER = W(9, 'Anotou') - 5;
const FIN = W(10, 'Entrou') - 5;
const DESP = W(11, 'Conta') - 6;
const VOLTA = W(12, 'Nem') - 2;
const FIM = W(13, 'Rotina') - 8;

// clara = true no v4 (a abertura fica clara para nao sumir no fundo vermelho)
const telasCom = (clara: boolean): Item[] => {
	const Ab = clara ? AberturaClara : Abertura;
	return [
	{at: 0, el: (f) => <Bloqueio f={f} />},
	{at: LIGA, el: (f) => <Ab f={f} desde={LIGA} />},
	{at: HAB, el: (f) => <Habitos f={f} desde={HAB} />, slide: 9},
	{at: MET, el: (f) => <Metricas f={f} desde={MET} />, slide: 9},
	{at: TREINO, el: (f) => <Planejar f={f} desde={TREINO} tapTab={TREINO - 2} />, slide: 9},
	{at: SER, el: (f) => <Series f={f} desde={SER} />, slide: 9},
	{at: FIN, el: (f) => <Visao f={f} desde={FIN} tapTab={FIN - 2} />, slide: 9},
	{at: DESP, el: (f) => <Despesas f={f} desde={DESP} />, slide: 9},
	{at: VOLTA, el: (f) => <Habitos f={f} desde={VOLTA} tapTab={VOLTA - 2} final />, slide: 9, dir: -1},
	{at: FIM, el: (f) => <Ab f={f} desde={FIM} />, slide: 8},
	];
};
export const TELAS = telasCom(false);
export const TELAS_V4 = telasCom(true);

export const telaEm = (f: number, lista: Item[] = TELAS) => {
	let i = 0;
	for (let k = 0; k < lista.length; k++) if (f >= lista[k].at) i = k;
	return i;
};

// toques na barra de abas acontecem na tela anterior, 2 q antes da troca
const TAPS_ABA: [number, number][] = [
	[TREINO - 2, 1],
	[FIN - 2, 2],
	[VOLTA - 2, 0],
];

export const TelaApp: React.FC<{f: number; lista?: Item[]}> = ({f, lista = TELAS}) => {
	const i = telaEm(f, lista);
	const cur = lista[i];
	const prev = i > 0 ? lista[i - 1] : null;
	const t = cur.slide ? tw(f, [cur.at, cur.at + cur.slide], [0, 1], E.uiMove) : 1;
	const dir = cur.dir ?? 1;
	const aba = TAPS_ABA.find(([at]) => f >= at - 5 && f < at + 18);
	return (
		<div style={{position: 'relative', width: UI_W, height: UI_H, overflow: 'hidden', background: c.bg}}>
			{prev && t < 1 ? <div style={{position: 'absolute', inset: 0, transform: `translateX(${-110 * t * dir}px)`, opacity: 1 - t}}>{prev.el(f)}</div> : null}
			<div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - t) * UI_W * dir}px)`}}>{cur.el(f)}</div>
			{aba ? <Toque f={f} at={aba[0]} x={tabX(aba[1])} y={TAB_Y} /> : null}
		</div>
	);
};

// Composicao V3Tela (1080 x 2309): textura da tela do celular no Blender
export const V3Tela: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<div style={{position: 'absolute', left: 0, top: 0, width: UI_W, height: UI_H, transform: `scale(${S})`, transformOrigin: '0 0'}}>
				<TelaApp f={f} />
			</div>
		</AbsoluteFill>
	);
};

// Composicao V4Tela: igual a V3Tela, com a abertura clara
export const V4Tela: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<div style={{position: 'absolute', left: 0, top: 0, width: UI_W, height: UI_H, transform: `scale(${S})`, transformOrigin: '0 0'}}>
				<TelaApp f={f} lista={TELAS_V4} />
			</div>
		</AbsoluteFill>
	);
};
