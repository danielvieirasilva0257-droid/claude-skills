import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {ArrowDown, BatteryCharging, Check, Download, Dumbbell, Flame, Footprints, TrendingUp, Trophy, X} from 'lucide-react';
import {c, display as BARLOW_C} from '../theme';
import {DISPLAY, P, SANS, SERIF, drift, ease, sp, tw} from './theme';
import {SEC, W} from './tempo';
import {phonePose, screenPoint} from './rig';
import {Atras, DirBlur, Entra, PalavraDividida, Pill, UiCard, textMetrics, textWidth} from './parts';
import {AppMark, Wordmark} from './Marca';
import {IRIS, questionDot} from './Gancho';

// Every scene below follows the editor's rules:
// - final positions never overlap each other, the logo or the phone;
// - texts and cards live BELOW the phone layer (background -> text -> phone);
// - entrances come from outside the frame (Entra) or from behind the phone (Atras); no masks.

const clampF = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const sc = (f: number, u: number, v: number) => {
	const p = phonePose(f);
	return p.visible ? screenPoint(p, u, v) : {x: 540, y: 960, depth: 0};
};
const Big: React.FC<{children: React.ReactNode; size: number; color?: string; font?: string; italic?: boolean}> = ({children, size, color = P.ink, font = DISPLAY, italic}) => (
	<div style={{fontFamily: font, fontStyle: italic ? 'italic' : 'normal', fontSize: size, lineHeight: 1, color, whiteSpace: 'nowrap'}}>{children}</div>
);
const Lbl: React.FC<{children: React.ReactNode; color?: string; size?: number}> = ({children, color = P.mute, size = 26}) => (
	<div style={{fontFamily: SANS, fontWeight: 700, fontSize: size, letterSpacing: '0.08em', textTransform: 'uppercase', color, whiteSpace: 'nowrap'}}>{children}</div>
);

// ============================================================ S2: red reveal (logo, wordmark from the bottom edge, "você tem." from the left edge)
export const Revelacao: React.FC<{f: number}> = ({f}) => {
	if (f < SEC.drop - 2 || f > 200) return null;
	const pop = sp(f, SEC.drop, {stiffness: 220, damping: 14});
	const draw = tw(f, [SEC.drop + 2, SEC.drop + 16], [0, 1], ease.ae);
	const burst = tw(f, [182, 192], [0, 1], ease.in);
	const exit = tw(f, [187, 197], [0, 1], ease.in);
	const voce = W(3, 'você');
	const under = tw(f, [voce + 7, voce + 15], [0, 1], ease.out);
	const wmSize = 230;
	const wmW = textWidth('ROTINA', wmSize);
	const wVoce = textWidth('você tem.', 120, SERIF, true);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 540 - 125, top: 760 - 125, width: 250, height: 250, transform: `scale(${pop * (1 + 0.5 * burst)}) rotate(${(1 - pop) * -28}deg)`, opacity: 1 - burst}}>
				<AppMark size={250} bg={P.white} fg={P.red} draw={draw} />
			</div>
			{/* wordmark: each letter rises from below the frame */}
			<DirBlur id="wmblur" amount={0} angle={90}>
				{Array.from('ROTINA').map((ch, i) => {
					const at = W(3, 'app') + i * 2;
					if (f < at) return null;
					const s = sp(f, at, {stiffness: 300, damping: 26});
					const s1 = sp(f - 1, at, {stiffness: 300, damping: 26});
					const dy = (1 - s) * 1100 + exit * 1100;
					const v = Math.abs((1 - s) - (1 - s1)) * 1100;
					const x = 540 - wmW / 2 + textWidth('ROTINA'.slice(0, i), wmSize);
					return (
						<div key={i} style={{position: 'absolute', left: x, top: 915 + dy, fontFamily: DISPLAY, fontSize: wmSize, lineHeight: 1, color: P.white, filter: v > 2 ? `blur(${Math.min(14, v * 0.04)}px)` : undefined}}>
							{ch}
						</div>
					);
				})}
			</DirBlur>
			<Entra f={f} at={voce} from="left" x={540 - wVoce / 2} y={1170} w={wVoce} h={130} exitAt={188} exitTo="bottom" exitLen={10} id="voce">
				<Big size={120} font={SERIF} italic color={P.white}>
					você tem.
				</Big>
				<svg width={wVoce} height={40} style={{display: 'block', marginTop: -6}}>
					<path d={`M 8 26 C ${wVoce * 0.25} 6, ${wVoce * 0.55} 36, ${wVoce - 8} 14`} fill="none" stroke={P.white} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - under} />
				</svg>
			</Entra>
		</AbsoluteFill>
	);
};

// ============================================================ section titles: halves fly in from both edges and meet (behind the phone layer)
export const Titulos: React.FC<{f: number}> = ({f}) => {
	const whip = tw(f, [326, 334], [0, 1], ease.in);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', inset: 0, transform: `translateX(${-whip * 1600}px)`}}>
				{f < 336 && <PalavraDividida f={f} at={197} text="HÁBITOS" size={300} color={P.ink} cx={540} top={290} shiftX={interpolate(f, [262, 282], [0, -70], {...clampF, easing: ease.ae})} id="tHab" />}
			</div>
			{f < 540 && (
				<PalavraDividida f={f} at={W(6, 'treino')} text="TREINO" size={300} color={P.paperHi} cx={540} top={372} toHeaderAt={356} headerScale={0.36} headerTop={290} exitAt={W(8, 'veja') - 4} exitTo="top" id="tTre" />
			)}
			{f < 800 && (
				<PalavraDividida f={f} at={585} text="FINANCEIRO" size={200} color={P.ink} cx={540} top={378} toHeaderAt={600} headerScale={0.5} headerTop={290} exitAt={786} exitTo="top" id="tFin" />
			)}
		</AbsoluteFill>
	);
};

// ============================================================ Hábitos (phone on the right; chips and the streak card come out from behind it)
const Habitos: React.FC<{f: number}> = ({f}) => {
	if (f < 195 || f > 280) return null;
	const marque = W(4, 'Marque');
	const desm = W(4, 'desmarque');
	const seq = W(4, 'sequência');
	const count = f >= seq + 3 ? 13 : 12;
	const bump = sp(f, seq + 3, {stiffness: 220, damping: 12});
	return (
		<>
			<Atras f={f} at={marque} side="left" x={65} y={760} w={290} h={84} exitAt={260} exitTo="left" id="hMar">
				<Pill size={32} style={{boxShadow: '0 16px 32px rgba(0,0,0,0.2)'}}>
					<span style={{width: 44, height: 44, borderRadius: 12, background: P.red, display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>
						<Check size={30} strokeWidth={4} color="#fff" />
					</span>
					Marque
				</Pill>
			</Atras>
			<Atras f={f} at={desm} side="left" x={65} y={866} w={300} h={84} exitAt={262} exitTo="left" id="hDes">
				<Pill size={30} bg={P.paperHi} color={P.ink} style={{boxShadow: '0 16px 32px rgba(0,0,0,0.16)', border: `3px solid ${P.ink}`}}>
					<span style={{width: 42, height: 42, borderRadius: 12, border: `4px solid ${P.ink}`, boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>
						<X size={26} strokeWidth={4} color={P.ink} />
					</span>
					Desmarque
				</Pill>
			</Atras>
			<Atras f={f} at={seq - 6} side="left" x={65} y={990} w={300} h={196} exitAt={264} exitTo="left" id="hSeq">
				<UiCard style={{width: 300, height: 196, padding: '20px 22px'}}>
					<div style={{fontFamily: BARLOW_C, fontWeight: 600, fontSize: 24, letterSpacing: '0.12em', color: c.muted}}>SEQUÊNCIA</div>
					<div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 4}}>
						<Flame size={50} color={c.amber} fill={c.amber} style={{transform: `scale(${1 + 0.3 * Math.sin(Math.PI * Math.min(1, bump))})`}} />
						<span style={{fontFamily: BARLOW_C, fontWeight: 800, fontSize: 92, lineHeight: 1, color: c.amber, display: 'inline-block', transform: `translateY(${f >= seq + 3 ? (1 - Math.min(1, bump)) * 22 : 0}px)`}}>{count}</span>
						<span style={{fontFamily: 'Barlow', fontSize: 24, color: c.muted, lineHeight: 1.1}}>
							dias
							<br />
							seguidos
						</span>
					</div>
				</UiCard>
			</Atras>
		</>
	);
};

// ============================================================ Métricas (phone on the left; the chart card comes out from behind it, the number from the right edge)
const WEEK = [100, 80, 100, 60, 100, 80, 100];
const Metricas: React.FC<{f: number}> = ({f}) => {
	if (f < 266 || f > 336) return null;
	const at = W(5, 'gráficos') - 2;
	const sem = W(5, 'semana', 0);
	const ev = W(5, 'evoluiu') - 1;
	const whip = tw(f, [326, 334], [0, 1], ease.in);
	const w34 = textWidth('+34 PTS', 110);
	return (
		<div style={{position: 'absolute', inset: 0, transform: `translateX(${-whip * 1600}px)`}}>
			<Atras f={f} at={at} side="right" x={662} y={640} w={350} h={320} id="mCard">
				<UiCard style={{width: 350, height: 320, padding: '22px 22px'}}>
					<div style={{fontFamily: BARLOW_C, fontWeight: 600, fontSize: 24, letterSpacing: '0.12em', color: c.muted, marginBottom: 14}}>ESTA SEMANA</div>
					<div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 220}}>
						{WEEK.map((v, i) => {
							const g = sp(f, sem - 6 + i * 3, {stiffness: 200, damping: 16});
							return (
								<div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
									<div style={{width: 30, height: 180, borderRadius: 10, background: '#1D1D1D', display: 'flex', alignItems: 'flex-end'}}>
										<div style={{width: '100%', height: `${v * Math.min(1.06, g)}%`, borderRadius: 10, background: v === 100 ? c.redHi : 'rgba(255,90,90,0.55)'}} />
									</div>
									<span style={{fontFamily: 'Barlow', fontWeight: 600, fontSize: 22, color: c.faint}}>{'STQQSSD'[i]}</span>
								</div>
							);
						})}
					</div>
				</UiCard>
			</Atras>
			<Entra f={f} at={ev} from="right" x={662} y={990} w={w34} h={112} id="m34">
				<Big size={110} color={P.red}>
					+34 PTS
				</Big>
			</Entra>
			<Entra f={f} at={ev + 3} from="right" x={666} y={1112} w={360} h={34} id="m34l">
				<Lbl>Conclusão em 12 semanas</Lbl>
			</Entra>
		</div>
	);
};

// ============================================================ Treino: plano da semana (one paper card from the left edge; the days light up in place)
const DAYS = [
	['SEG', 'PEITO', c.redHi],
	['TER', 'COSTAS', c.blue],
	['QUA', 'PERNA', c.green],
	['QUI', 'OMBRO', '#B7791F'],
	['SEX', 'BRAÇO', c.pink],
	['SÁB', 'CARDIO', c.orange],
	['DOM', '—', P.mute],
] as const;
const Plano: React.FC<{f: number}> = ({f}) => {
	if (f < 355 || f > 404) return null;
	const whole = W(6, 'inteira');
	const glow = tw(f, [whole - 2, whole + 4], [0, 1]);
	const br = tw(f, [W(6, 'semana') - 2, whole + 6], [0, 1], ease.ae);
	return (
		<Entra f={f} at={362} from="left" x={65} y={440} w={950} h={200} exitAt={392} exitTo="left" id="plano">
			<div style={{width: 950, height: 170, borderRadius: 26, background: P.paperHi, boxShadow: '0 22px 44px rgba(0,0,0,0.4)', display: 'flex', padding: 12, gap: 8, boxSizing: 'border-box'}}>
				{DAYS.map(([d, m, col], i) => {
					const on = sp(f, 366 + i * 2, {stiffness: 260, damping: 18});
					return (
						<div
							key={d}
							style={{
								flex: 1,
								borderRadius: 18,
								background: `rgba(17,17,17,${0.04 + 0.04 * on})`,
								border: `4px solid ${glow > 0.5 || (on > 0.5 && i === 0) ? col : 'transparent'}`,
								boxShadow: glow > 0 ? `0 0 ${24 * glow}px ${col}` : undefined,
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 4,
								transform: `scale(${0.92 + 0.08 * Math.min(1, on)})`,
							}}
						>
							<div style={{fontFamily: SANS, fontWeight: 800, fontSize: 24, letterSpacing: '0.06em', color: P.mute}}>{d}</div>
							<div style={{fontFamily: DISPLAY, fontSize: m.length > 5 ? 30 : 36, color: col, opacity: 0.25 + 0.75 * Math.min(1, on)}}>{m}</div>
						</div>
					);
				})}
			</div>
			<svg width={950} height={30} style={{display: 'block'}}>
				<path d="M 6 4 L 6 18 L 944 18 L 944 4" fill="none" stroke={P.paperHi} strokeWidth={5} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - br} />
			</svg>
		</Entra>
	);
};

// ============================================================ Treino: estilos (each word whips in from the right edge, stacked above the phone)
const ESTILOS = [
	{w: 'força', t: 'FORÇA', col: '#FF5A5A', Icon: Flame},
	{w: 'hipertrofia', t: 'HIPERTROFIA', col: '#FB923C', Icon: Dumbbell},
	{w: 'resistência', t: 'RESISTÊNCIA', col: '#34D399', Icon: Footprints},
	{w: 'deload', t: 'DELOAD', col: '#60A5FA', Icon: BatteryCharging},
];
const Estilos: React.FC<{f: number}> = ({f}) => {
	if (f < W(7, 'Defina') - 1 || f > 494) return null;
	const ats = ESTILOS.map((e) => W(7, e.w));
	const cur = ats.filter((a) => f >= a).length - 1;
	const wSub = textWidth('o estilo de cada semana', 78, SERIF, true);
	return (
		<>
			<div style={{position: 'absolute', inset: 0, opacity: cur >= 0 ? 0.55 : 1}}>
				<Entra f={f} at={W(7, 'Defina')} from="left" x={540 - wSub / 2} y={384} w={wSub} h={90} exitAt={479} exitTo="left" id="eSub">
					<Big size={78} font={SERIF} italic color={P.paperHi}>
						o estilo de cada semana
					</Big>
				</Entra>
			</div>
			{ESTILOS.map((e, i) => {
				const ww = 72 + 18 + textWidth(e.t, 100);
				return (
					<div key={e.t} style={{position: 'absolute', inset: 0, opacity: cur > i ? 0.32 : 1}}>
						<Entra f={f} at={ats[i]} from="right" x={540 - ww / 2} y={484 + i * 110} w={ww} h={104} exitAt={480 + i} exitTo="left" id={'e' + i}>
							<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
								<e.Icon size={72} color={e.col} strokeWidth={2.6} />
								<Big size={100} color={e.col}>
									{e.t}
								</Big>
							</div>
						</Entra>
					</div>
				);
			})}
		</>
	);
};

// ============================================================ Treino: séries (cards from behind the phone) + gráfico (behind the phone, texts from the left edge)
const DATA = [
	{w: 'carga', lbl: 'Carga', val: '82,5 kg'},
	{w: 'repetições', lbl: 'Repetições', val: '10'},
	{w: 'séries', lbl: 'Séries', val: '3'},
];
const PTS = [92, 93, 95, 95, 98, 101, 104, 107, 110];
const Series: React.FC<{f: number}> = ({f}) => {
	if (f < 480 || f > 590) return null;
	const veja = W(8, 'veja');
	const g0 = W(8, 'gráfico') - 1;
	const ev = W(8, 'evoluiu');
	const ex = W(8, 'exercício');
	const draw = tw(f, [g0, ev], [0, 1], ease.ae);
	const X0 = 80;
	const X1 = 1000;
	const Y0 = 560;
	const Y1 = 330;
	const pts = PTS.map((v, i) => [X0 + (i / (PTS.length - 1)) * (X1 - X0), Y0 - ((v - 90) / 22) * (Y0 - Y1)]);
	const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
	const last = pts[pts.length - 1];
	const dot = sp(f, ev, {stiffness: 220, damping: 12});
	const out = tw(f, [572, 581], [0, 1], ease.in);
	const w19 = textWidth('+19%', 110);
	return (
		<>
			{DATA.map((dd, i) => {
				const at = W(8, dd.w) - 1;
				return (
					<Atras key={dd.w} f={f} at={at} side="left" x={65} y={520 + i * 170} w={310} h={150} exitAt={veja - 2 + i * 2} exitTo="left" id={'sd' + i}>
						<div style={{width: 310, height: 150, boxSizing: 'border-box', background: P.paperHi, borderRadius: 24, padding: '16px 24px 8px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)'}}>
							<Lbl size={24}>{dd.lbl}</Lbl>
							<Big size={84}>{dd.val}</Big>
						</div>
					</Atras>
				);
			})}
			{f >= g0 - 2 && (
				<div style={{position: 'absolute', inset: 0, transform: `translateX(${-out * 1500}px)`}}>
					<svg width={1080} height={700} style={{position: 'absolute', left: 0, top: 0}}>
						<defs>
							<linearGradient id="v2area" x1="0" x2="0" y1="0" y2="1">
								<stop offset="0" stopColor={P.red} stopOpacity={0.55} />
								<stop offset="1" stopColor={P.red} stopOpacity={0} />
							</linearGradient>
							<clipPath id="v2areaclip">
								<rect x={0} y={0} width={X0 + (X1 - X0) * draw} height={700} />
							</clipPath>
						</defs>
						<path d={d + ` L ${X1} ${Y0} L ${X0} ${Y0} Z`} fill="url(#v2area)" clipPath="url(#v2areaclip)" />
						<path d={d} fill="none" stroke={P.paperHi} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
						{f >= ev && <circle cx={last[0]} cy={last[1]} r={22 * dot} fill={P.red} stroke={P.paperHi} strokeWidth={6} />}
					</svg>
				</div>
			)}
			<Entra f={f} at={ex} from="left" x={80} y={286} w={90 + w19} h={112} exitAt={573} exitTo="left" id="s19">
				<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
					<TrendingUp size={74} color={c.green} strokeWidth={3} />
					<Big size={110} color={c.green}>
						+19%
					</Big>
				</div>
			</Entra>
			<Entra f={f} at={ex + 3} from="left" x={84} y={404} w={420} h={40} exitAt={574} exitTo="left" id="s19l">
				<div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
					<Trophy size={30} color={c.amber} />
					<Lbl color={P.paperHi}>Novo recorde · 110 kg</Lbl>
				</div>
			</Entra>
		</>
	);
};

// ============================================================ Financeiro: para onde vai cada real (phone on the right; chips from behind it)
const FLOW = [
	{name: 'Moradia', pct: '48%', col: c.purple},
	{name: 'Mercado', pct: '19%', col: '#65A30D'},
	{name: 'Saúde', pct: '14%', col: '#059669'},
];
const CadaReal: React.FC<{f: number}> = ({f}) => {
	if (f < 600 || f > 648) return null;
	const cada = W(9, 'cada');
	return (
		<>
			<Entra f={f} at={603} from="left" x={65} y={512} w={460} h={40} exitAt={630} exitTo="left" id="fLbl">
				<Lbl color={P.ink} size={28}>
					Para onde vai cada real
				</Lbl>
			</Entra>
			{FLOW.map((fl, i) => (
				<Atras key={fl.name} f={f} at={cada - 8 + i * 4} side="left" x={65} y={640 + i * 110} w={310} h={84} exitAt={626 + i * 2} exitTo="left" id={'fl' + i}>
					<Pill size={30} bg={P.paperHi} color={P.ink} style={{border: `3px solid ${P.ink}`, boxShadow: '0 12px 24px rgba(0,0,0,0.14)'}}>
						<span style={{width: 24, height: 24, borderRadius: 12, background: fl.col}} />
						{fl.name}
						<span style={{fontFamily: DISPLAY, fontWeight: 400, fontSize: 42, letterSpacing: 0}}>{fl.pct}</span>
					</Pill>
				</Atras>
			))}
		</>
	);
};

// ============================================================ Financeiro: entradas, saídas (from the right edge), bancos e cartões (from behind the phone)
const Row: React.FC<{sign: '+' | '−'; value: string; desc: string}> = ({sign, value, desc}) => {
	const inn = sign === '+';
	return (
		<UiCard style={{width: 315, height: 110, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16}}>
			<div style={{width: 62, height: 62, borderRadius: 18, background: inn ? c.greenBg : c.redBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BARLOW_C, fontWeight: 800, fontSize: 50, color: inn ? c.green : c.redHi}}>{sign}</div>
			<div>
				<div style={{fontFamily: BARLOW_C, fontWeight: 800, fontSize: 44, lineHeight: 1, color: inn ? c.green : c.redHi}}>{value}</div>
				<div style={{fontFamily: 'Barlow', fontWeight: 600, fontSize: 22, color: c.muted, marginTop: 4, whiteSpace: 'nowrap'}}>{desc}</div>
			</div>
		</UiCard>
	);
};
const BankCard: React.FC<{name: string; digits: string; from: string; to: string}> = ({name, digits, from, to}) => (
	<div style={{width: 300, height: 186, borderRadius: 24, background: `linear-gradient(135deg, ${from}, ${to})`, boxShadow: '0 24px 48px rgba(0,0,0,0.3)', padding: 22, position: 'relative', color: '#fff', overflow: 'hidden', boxSizing: 'border-box'}}>
		<div style={{position: 'absolute', right: -50, top: -70, width: 200, height: 200, borderRadius: 100, background: 'rgba(255,255,255,0.08)'}} />
		<div style={{width: 52, height: 40, borderRadius: 8, background: 'linear-gradient(135deg, #E9C46A, #B8860B)'}} />
		<div style={{position: 'absolute', left: 22, bottom: 52, fontFamily: SANS, fontWeight: 600, fontSize: 26, letterSpacing: '0.12em'}}>•••• {digits}</div>
		<div style={{position: 'absolute', left: 22, bottom: 20, fontFamily: SANS, fontWeight: 800, fontSize: 18, letterSpacing: '0.1em', opacity: 0.85}}>{name}</div>
	</div>
);
const Transacoes: React.FC<{f: number}> = ({f}) => {
	if (f < 640 || f > 716) return null;
	return (
		<>
			<Entra f={f} at={W(10, 'entrada') - 1} from="right" x={700} y={400} w={315} h={110} exitAt={702} exitTo="right" id="tIn">
				<Row sign="+" value="R$ 4.800" desc="Salário · entrada" />
			</Entra>
			<Entra f={f} at={W(10, 'saída') - 1} from="right" x={700} y={526} w={315} h={110} exitAt={703} exitTo="right" id="tOut">
				<Row sign="−" value="R$ 420" desc="Mercado · saída" />
			</Entra>
			<Atras f={f} at={W(10, 'bancos') - 1} side="right" x={708} y={690} w={300} h={186} exitAt={704} exitTo="right" id="tB1">
				<BankCard name="CONTA CORRENTE" digits="4821" from="#6D28D9" to="#1E1B4B" />
			</Atras>
			<Atras f={f} at={W(10, 'cartões') - 1} side="right" x={708} y={896} w={300} h={186} exitAt={705} exitTo="right" id="tB2">
				<BankCard name="CARTÃO DE CRÉDITO" digits="9173" from="#CC0000" to="#2B0000" />
			</Atras>
		</>
	);
};

// ============================================================ Financeiro: fixa x pontual (from the left edge, above the phone), cronograma e categorias (from behind the phone)
const DOTS = [2, 5, 12, 15, 26];
const DONUT = [
	{name: 'Moradia', v: 48, col: c.purple},
	{name: 'Mercado', v: 19, col: '#A3E635'},
	{name: 'Saúde', v: 14, col: c.green},
	{name: 'Alimentação', v: 11, col: c.orange},
	{name: 'Lazer', v: 8, col: c.pink},
];
const Despesas: React.FC<{f: number}> = ({f}) => {
	if (f < 710 || f > 800) return null;
	const at = W(11, 'despesa') - 3;
	const fixa = W(11, 'fixa') - 1;
	const pont = W(11, 'pontual') - 1;
	const knob = sp(f, pont, {stiffness: 650, damping: 40, mass: 0.5});
	const press = (t: number) => (f >= t && f < t + 10 ? 1 - 0.035 * Math.sin((Math.PI * (f - t)) / 10) : 1);
	const cro = W(11, 'cronograma') - 3;
	const cat = W(11, 'categoria') - 3;
	const R = 86;
	const C = 2 * Math.PI * R;
	const grow = tw(f, [cat + 4, cat + 18], [0, 1], ease.ae);
	let acc = 0;
	return (
		<>
			<Entra f={f} at={at} from="left" x={65} y={398} w={950} h={130} exitAt={786} exitTo="left" id="dTog">
				<div style={{transform: `scale(${press(fixa) * press(pont)})`, position: 'relative', height: 130, borderRadius: 65, background: P.paperHi, border: `5px solid ${P.ink}`, boxShadow: '0 20px 40px rgba(0,0,0,0.16)', display: 'flex', overflow: 'hidden', boxSizing: 'border-box'}}>
					<div style={{position: 'absolute', top: 9, bottom: 9, left: 9 + knob * (470 - 9), width: 461, borderRadius: 56, background: P.red, boxShadow: '0 8px 20px rgba(204,0,0,0.35)'}} />
					{['FIXA', 'PONTUAL'].map((t, i) => (
						<div key={t} style={{position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 70, color: (i === 0 ? 1 - knob : knob) > 0.5 ? P.white : P.ink}}>
							{t}
						</div>
					))}
				</div>
			</Entra>
			<Atras f={f} at={cro} side="left" x={65} y={700} w={310} h={330} exitAt={cat - 2} exitTo="left" exitLen={6} id="dCal">
				<UiCard style={{width: 310, height: 330, padding: 20}}>
					<div style={{fontFamily: BARLOW_C, fontWeight: 700, fontSize: 30, letterSpacing: '0.1em', marginBottom: 10}}>OUTUBRO</div>
					<div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5}}>
						{Array.from({length: 31}).map((_, i) => {
							const day = i + 1;
							const has = DOTS.indexOf(day);
							const pp = has >= 0 ? sp(f, cro + 6 + has * 3, {stiffness: 260, damping: 15}) : 0;
							return (
								<div key={i} style={{height: 40, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Barlow', fontWeight: 600, fontSize: 19, color: has >= 0 ? '#fff' : c.faint, background: has >= 0 ? `rgba(204,0,0,${0.85 * Math.min(1, pp)})` : '#1D1D1D'}}>
									{day}
								</div>
							);
						})}
					</div>
				</UiCard>
			</Atras>
			<Atras f={f} at={cat + 2} side="left" x={65} y={700} w={310} h={330} exitAt={786} exitTo="left" id="dDon">
				<UiCard style={{width: 310, height: 330, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
					<svg width={200} height={200} style={{transform: 'rotate(-90deg)', flexShrink: 0}}>
						<circle cx={100} cy={100} r={R} fill="none" stroke="#2A2A2A" strokeWidth={28} />
						{DONUT.map((d) => {
							const len = (d.v / 100) * C * grow;
							const off = acc * grow;
							acc += (d.v / 100) * C;
							return <circle key={d.name} cx={100} cy={100} r={R} fill="none" stroke={d.col} strokeWidth={28} strokeDasharray={`${Math.max(0, len - 4)} ${C}`} strokeDashoffset={-off} />;
						})}
					</svg>
					<div style={{display: 'flex', gap: 14, marginTop: 14}}>
						{DONUT.slice(0, 3).map((d, i) => (
							<div key={d.name} style={{display: 'flex', alignItems: 'center', gap: 6, opacity: tw(f, [cat + 8 + i * 3, cat + 14 + i * 3], [0, 1])}}>
								<span style={{width: 12, height: 12, borderRadius: 6, background: d.col}} />
								<span style={{fontFamily: BARLOW_C, fontWeight: 800, fontSize: 26}}>{d.v}%</span>
							</div>
						))}
					</div>
				</UiCard>
			</Atras>
		</>
	);
};

export const Overlays: React.FC<{f: number}> = ({f}) => (
	<AbsoluteFill>
		<Habitos f={f} />
		<Metricas f={f} />
		<Plano f={f} />
		<Estilos f={f} />
		<Series f={f} />
		<CadaReal f={f} />
		<Transacoes f={f} />
		<Despesas f={f} />
	</AbsoluteFill>
);

// ============================================================ S6: "Hábitos, treino e dinheiro. Um app só." (words from alternating edges, above the phone; the zoom covers "um app só.")
export const Fechamento: React.FC<{f: number}> = ({f}) => {
	if (f < 790 || f > 846) return null;
	const um = W(12, 'Um');
	const words: [string, number, 'left' | 'right'][] = [
		['HÁBITOS', W(12, 'Hábitos') - 1, 'left'],
		['TREINO', W(12, 'treino') - 1, 'right'],
		['DINHEIRO', W(12, 'dinheiro') - 1, 'left'],
	];
	const wApp = textWidth('um app só.', 104, SERIF, true);
	return (
		<>
			{words.map(([t, at, from], i) => {
				const ww = textWidth(t, 128);
				return (
					<Entra key={t} f={f} at={at} from={from} x={540 - ww / 2} y={290 + i * 135} w={ww} h={128} id={'fw' + i}>
						<Big size={128} color={i === 2 ? P.red : P.ink}>
							{t}
						</Big>
					</Entra>
				);
			})}
			{/* rises from behind the phone; the zoom-through then covers everything (phone on top) */}
			<Atras f={f} at={um} side="up" x={540 - wApp / 2} y={712} w={wApp} h={116} id="fApp">
				<Big size={104} font={SERIF} italic>
					um app só.
				</Big>
			</Atras>
		</>
	);
};

// ============================================================ S7: end card (red): logo from the splash, button and "link na bio" rise from the bottom edge
export const CTA: React.FC<{f: number}> = ({f}) => {
	if (f < SEC.cta) return null;
	const s = sp(f, SEC.cta, {stiffness: 220, damping: 24});
	// start = where the splash logo was on the phone screen at f846 (the zoom ends there)
	const markSize = interpolate(s, [0, 1], [417, 230]);
	const markY = interpolate(s, [0, 1], [826, 440]);
	const wmSize = interpolate(s, [0, 1], [222, 168]);
	const wmY = interpolate(s, [0, 1], [1200, 650]);
	const btnAt = 851;
	const pressAt = 860;
	const press = sp(f, pressAt, {stiffness: 500, damping: 20});
	const pressScale = f >= pressAt ? 1 - 0.06 * Math.sin(Math.PI * Math.min(1, press)) * Math.exp(-(f - pressAt) / 10) : 1;
	const ripple = tw(f, [pressAt, pressAt + 18], [0, 1], ease.out);
	const link = W(13, 'Link') - 1;
	const hit = SEC.finalHit;
	const pulse = f >= hit ? 1 + 0.07 * Math.exp(-(f - hit) / 5) * Math.cos((f - hit) / 2.2) : 1;
	const flash = f >= hit ? Math.exp(-(f - hit) / 3) * 0.3 : 0;
	const spin = (f - SEC.cta) * 6 * (f >= hit ? 1.6 : 1);
	const {baseline, cap} = textMetrics(wmSize);
	const wLink = textWidth('LINK NA BIO', 56, SANS, false, 800) + 56 * 0.1 * 11 + 18 + 60;
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 540 - markSize / 2, top: markY - markSize / 2 + drift(f, 4, 80), transform: `scale(${pulse})`}}>
				<AppMark size={markSize} bg={P.white} fg={P.red} />
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: wmY - (baseline - cap / 2), display: 'flex', justifyContent: 'center', transform: `scale(${pulse})`}}>
				<Wordmark size={wmSize} color={P.white} style={{lineHeight: 1}} />
			</div>
			<Entra f={f} at={btnAt} from="bottom" x={160} y={846} w={760} h={160} cfg={{stiffness: 200, damping: 22}} id="cBtn">
				<div style={{position: 'relative', width: 760, height: 160, transform: `scale(${pressScale})`}}>
					{/* spinning gradient ring (button-animation recipe) */}
					<div style={{position: 'absolute', inset: -10, borderRadius: 90, overflow: 'hidden'}}>
						<div style={{position: 'absolute', left: '50%', top: '50%', width: 1000, height: 1000, marginLeft: -500, marginTop: -500, background: 'conic-gradient(from 0deg, rgba(255,255,255,0) 0deg, rgba(255,255,255,0.95) 70deg, rgba(255,180,180,0.9) 120deg, rgba(255,255,255,0) 180deg, rgba(255,255,255,0) 360deg)', transform: `rotate(${spin}deg)`}} />
					</div>
					<div style={{position: 'absolute', inset: 0, borderRadius: 80, background: P.white, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26, boxShadow: '0 30px 60px rgba(80,0,0,0.35)', overflow: 'hidden'}}>
						{f >= pressAt && <div style={{position: 'absolute', left: 380 - 400 * ripple, top: 80 - 400 * ripple, width: 800 * ripple, height: 800 * ripple, borderRadius: '50%', background: `rgba(204,0,0,${0.18 * (1 - ripple)})`}} />}
						<Download size={70} color={P.red} strokeWidth={3} />
						<span style={{fontFamily: DISPLAY, fontSize: 96, color: P.ink, letterSpacing: '0.01em'}}>BAIXE AGORA</span>
					</div>
				</div>
			</Entra>
			<Entra f={f} at={link} from="bottom" x={540 - wLink / 2} y={1062} w={wLink} h={70} id="cLink">
				<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
					<span style={{fontFamily: SANS, fontWeight: 800, fontSize: 56, letterSpacing: '0.1em', color: P.white, whiteSpace: 'nowrap'}}>LINK NA BIO</span>
					<ArrowDown size={58} color={P.white} strokeWidth={3.2} style={{transform: `translateY(${Math.abs(Math.sin((f - link) / 4.5)) * 14}px)`}} />
				</div>
			</Entra>
			<AbsoluteFill style={{background: '#fff', opacity: flash, pointerEvents: 'none'}} />
		</AbsoluteFill>
	);
};

// ============================================================ backgrounds (paper / red / ink / paper / red)
export const Fundo: React.FC<{f: number}> = ({f}) => {
	const q = questionDot();
	// red iris from the "?" dot
	const irisR = interpolate(f, [IRIS.start, IRIS.end], [q.r, 2300], {...clampF, easing: ease.in});
	// paper opens again from the phone center (as it bursts out of the logo)
	const ph = sc(Math.max(188, Math.min(200, f)), 0.5, 0.5);
	const paperR = interpolate(f, [187, 200], [0, 2300], {...clampF, easing: ease.in});
	// ink wipe during the whip (right -> left), paper wipe during the flip (top -> bottom)
	const ink = tw(f, [329, 340], [0, 1], ease.inOut);
	const paper2 = tw(f, [571, 582], [0, 1], ease.inOut);
	return (
		<AbsoluteFill style={{background: P.paper}}>
			{f >= IRIS.start && f < 202 && <AbsoluteFill style={{background: P.red, clipPath: f >= IRIS.end ? undefined : `circle(${irisR}px at ${q.x}px ${q.y}px)`}} />}
			{f >= 187 && f < 202 && <AbsoluteFill style={{background: P.paper, clipPath: `circle(${paperR}px at ${ph.x}px ${ph.y}px)`}} />}
			{f >= 329 && f < 584 && (
				<AbsoluteFill style={{background: P.ink, clipPath: f >= 340 ? undefined : `polygon(${1080 - ink * 1500}px 0, 1080px 0, 1080px 1920px, ${1080 - ink * 1500 + 260}px 1920px)`}} />
			)}
			{f >= 571 && f < 584 && <AbsoluteFill style={{background: P.paper, clipPath: `polygon(0 0, 1080px 0, 1080px ${paper2 * 2300 - 300}px, 0 ${paper2 * 2300}px)`}} />}
			{f >= SEC.cta && <AbsoluteFill style={{background: P.red}} />}
		</AbsoluteFill>
	);
};

export const isInk = (f: number) => f >= 336 && f < 578;
export const isRed = (f: number) => (f >= IRIS.end && f < 190) || f >= SEC.cta;
