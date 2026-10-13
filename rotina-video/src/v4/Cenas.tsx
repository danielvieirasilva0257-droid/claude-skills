import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {ArrowDown, Check, Download, Dumbbell, Flame, PiggyBank, TrendingUp, Trophy, Utensils} from 'lucide-react';
import {c, display as BARLOW_C} from '../theme';
import {DISPLAY, P, SANS, SERIF, ease, sp, tw} from '../v2/theme';
import {DirBlur, Entra, PalavraDividida, Pill, UiCard, textWidth} from '../v2/parts';
import {W} from '../v3/tempo';
import {Atras, T, centro, fitSize, mix} from './base';

// Camada 2D do v4 (abaixo do celular). Cada bloco diz de onde entra e para onde sai.

const clampF = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const Big: React.FC<{children: React.ReactNode; size: number; color?: string; font?: string; italic?: boolean}> = ({children, size, color = P.ink, font = DISPLAY, italic}) => (
	<div style={{fontFamily: font, fontStyle: italic ? 'italic' : 'normal', fontSize: size, lineHeight: 1, color, whiteSpace: 'nowrap'}}>{children}</div>
);
const Lbl: React.FC<{children: React.ReactNode; color?: string; size?: number}> = ({children, color = P.mute, size = 26}) => (
	<div style={{fontFamily: SANS, fontWeight: 700, fontSize: size, letterSpacing: '0.08em', textTransform: 'uppercase', color, whiteSpace: 'nowrap'}}>{children}</div>
);
const serifW = (t: string, size: number) => textWidth(t, size, SERIF, true);
const pulo = (f: number, at: number) => sp(f, at, {stiffness: 400, damping: 18});

// ============================================================ GANCHO (papel): SEGUNDA / eu começo. / 3 adesivos que viram 3 apps / QUARTA
const APPS = [
	{txt: 'DIETA', Icon: Utensils, cor: '#16A34A', at: W(2, 'Dieta') - 1, y: 820, rot: -3, p1: {x: 70, y: 760, r: -10}, badge: '3', bAt: W(3, 'num'), vx: -90, spin: -220, back: W(5, 'junta'), bx: -150},
	{txt: 'ACADEMIA', Icon: Dumbbell, cor: '#2563EB', at: W(2, 'academia') - 1, y: 975, rot: 2, p1: {x: 330, y: 880, r: 9}, badge: '7', bAt: W(3, 'app'), vx: 140, spin: 260, back: W(5, 'as'), bx: 0},
	{txt: 'DINHEIRO', Icon: PiggyBank, cor: '#D97706', at: W(2, 'dinheiro') - 2, y: 1130, rot: -2, p1: {x: 110, y: 1060, r: -5}, badge: '12', bAt: W(3, 'diferente'), vx: -40, spin: -160, back: W(5, 'três'), bx: 150},
];
const ST = {size: 112, pad: 24, x: 60};
const ICON = 170;
const VIRA = W(3, 'Aí');
const ESPALHA = W(3, 'fica');
const QUEDA = W(4, 'perdeu');
const pull = ease.inOut;

type AppSt = {x: number; y: number; w: number; h: number; rot: number; m: number; vis: boolean};
const appEm = (i: number, f: number): AppSt => {
	const a = APPS[i];
	const wS = textWidth(a.txt, ST.size) + 2 * ST.pad + 6;
	const hS = ST.size * 1.02 + 10;
	if (f < a.at) return {x: 0, y: 0, w: 0, h: 0, rot: 0, m: 0, vis: false};
	// 1) adesivo entra pela borda esquerda (mola do Entra do v2)
	const s = sp(f, a.at, {stiffness: 300, damping: 26});
	let x = ST.x - (ST.x + wS + 80) * (1 - s);
	let y = a.y;
	let rot = a.rot;
	// 2) vira icone de app (quadrado na cor do app); o texto some enquanto a forma ja muda
	const m = tw(f, [VIRA + 1 + 2 * i, VIRA + 11 + 2 * i], [0, 1], ease.out);
	const w = wS + (ICON - wS) * m;
	const h = hS + (ICON - hS) * m;
	// 3) se espalha (cada coisa num app diferente)
	const k = tw(f, [ESPALHA + 3 * i, ESPALHA + 18 + 3 * i], [0, 1], ease.out);
	x += (a.p1.x - x) * k;
	y += (a.p1.y - y) * k;
	rot += (a.p1.r - rot) * k;
	// 4) cai para fora do quadro ("perdeu a conta"): gravidade
	const t = (f - (QUEDA + 3 * i)) / 30;
	if (t > 0) {
		x += a.vx * t;
		y += -260 * t + 0.5 * 3600 * t * t;
		rot += a.spin * t;
	}
	// 5) volta da borda de baixo e entra atras do celular ("junta as tres")
	const r0 = a.back - 16;
	if (f >= r0) {
		const c0 = centro(a.back);
		const cf = centro(f);
		const u = tw(f, [r0, a.back + 2], [0, 1], pull);
		const sx = c0.x + a.bx - ICON / 2;
		x = sx + (cf.x - ICON / 2 - sx) * u;
		y = 2060 + (cf.y - ICON / 2 - 2060) * u;
		rot = a.p1.r * (1 - u);
		if (f > a.back + 3) return {x, y, w, h, rot, m, vis: false};
	} else if (t > 1.2) return {x, y, w, h, rot, m, vis: false};
	return {x, y, w, h, rot, m, vis: true};
};

const Apps: React.FC<{f: number}> = ({f}) => (
	<>
		{APPS.map((a, i) => {
			const st = appEm(i, f);
			if (!st.vis) return null;
			const pv = appEm(i, f - 1);
			const vx = pv.vis ? st.x - pv.x : 0;
			const vy = pv.vis ? st.y - pv.y : 0;
			const txtOp = 1 - tw(f, [VIRA - 1 + 2 * i, VIRA + 4 + 2 * i], [0, 1]);
			const iconOp = tw(f, [VIRA + 5 + 2 * i, VIRA + 11 + 2 * i], [0, 1]);
			const b = f >= a.bAt ? pulo(f, a.bAt) : 0;
			return (
				<DirBlur key={a.txt} id={'app' + i} amount={Math.min(36, Math.hypot(vx, vy) * 0.3)} angle={Math.abs(vx) >= Math.abs(vy) ? 0 : 90}>
					<div style={{position: 'absolute', left: st.x, top: st.y, width: st.w, height: st.h, transform: `rotate(${st.rot}deg)`, transformOrigin: '50% 50%'}}>
						<div
							style={{
								position: 'absolute',
								inset: 0,
								background: mix(P.paperHi, a.cor, st.m),
								border: `4px solid ${a.cor}`,
								borderRadius: 40 * st.m,
								boxShadow: `0 ${18 + 8 * st.m}px ${40 + 10 * st.m}px rgba(0,0,0,${0.18 + 0.08 * st.m})`,
								boxSizing: 'border-box',
							}}
						/>
						<div style={{position: 'absolute', left: ST.pad, top: 6, fontFamily: DISPLAY, fontSize: ST.size, lineHeight: 1.02, color: P.ink, whiteSpace: 'nowrap', opacity: txtOp}}>{a.txt}</div>
						<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: iconOp}}>
							<a.Icon size={96} color="#FFFFFF" strokeWidth={2.2} />
						</div>
						{b > 0 && (
							<div
								style={{
									position: 'absolute',
									right: -30,
									top: -30,
									minWidth: 74,
									height: 74,
									padding: '0 14px',
									boxSizing: 'border-box',
									borderRadius: 37,
									background: P.red,
									border: `5px solid ${P.paperHi}`,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontFamily: SANS,
									fontWeight: 800,
									fontSize: 36,
									color: '#fff',
									transform: `scale(${b})`,
								}}
							>
								{a.badge}
							</div>
						)}
					</div>
				</DirBlur>
			);
		})}
	</>
);

export const Gancho: React.FC<{f: number}> = ({f}) => {
	if (f > T.redIn + 30) return <Apps f={f} />;
	const sSeg = fitSize('SEGUNDA', 940, 300);
	const sDif = fitSize('DIFERENTE', 940, 270);
	const sQua = fitSize('QUARTA', 900, 300);
	const eu = 'eu começo.';
	const wEu = serifW(eu, 140);
	const frase = 'você já perdeu a conta.';
	const sFr = Math.min(100, (940 * 100) / serifW(frase, 100));
	return (
		<>
			<PalavraDividida f={f} at={-2} text="SEGUNDA" size={sSeg} color={P.ink} cx={540} top={300} exitAt={VIRA - 6} exitTo="left" id="g_seg" />
			<Entra f={f} at={W(1, 'eu')} from="right" x={70} y={300 + sSeg + 14} w={wEu} h={150} exitAt={VIRA - 4} exitTo="left" id="g_eu">
				<Big size={140} font={SERIF} italic color={P.red}>
					{eu}
				</Big>
			</Entra>
			<Apps f={f} />
			<PalavraDividida f={f} at={W(3, 'diferente') - 2} text="DIFERENTE" size={sDif} color={P.ink} cx={540} top={310} exitAt={W(4, 'Na') - 5} exitTo="left" id="g_dif" />
			<PalavraDividida f={f} at={W(4, 'quarta') - 2} text="QUARTA" size={sQua} color={P.red} cx={540} top={300} exitAt={T.redIn - 9} exitTo="top" id="g_qua" />
			<Entra f={f} at={W(4, 'você')} from="left" x={70} y={300 + sQua + 18} w={serifW(frase, sFr)} h={sFr * 1.15} exitAt={T.redIn - 7} exitTo="left" id="g_fr">
				<Big size={sFr} font={SERIF} italic color={P.ink}>
					{frase}
				</Big>
			</Entra>
		</>
	);
};

// ============================================================ REVELACAO (vermelho): ROTINA sobe de tras do celular; "no mesmo lugar." pela borda
const RotinaSobe: React.FC<{f: number}> = ({f}) => {
	const at = W(5, 'mesmo') - 6;
	const out = T.paperIn;
	if (f < at || f > out + 12) return null;
	const size = 230;
	const w = textWidth('ROTINA', size);
	const c0 = centro(at);
	const y0 = c0.y - 140;
	const y1 = 292;
	const pos = (g: number) => {
		const k = Math.min(1, sp(g, at, {stiffness: 170, damping: 20}));
		let y = y0 + (y1 - y0) * k;
		y -= tw(g, [out, out + 10], [0, 1], ease.in) * (y1 + 300);
		return {y, x: c0.x + (540 - c0.x) * k, s: 0.7 + 0.3 * k};
	};
	const p = pos(f);
	const q = pos(f - 1);
	return (
		<DirBlur id="r_rot" amount={Math.min(30, Math.hypot(p.x - q.x, p.y - q.y) * 0.3)} angle={90}>
			<div style={{position: 'absolute', left: p.x - w / 2, top: p.y, width: w, textAlign: 'center', transform: `scale(${p.s})`, transformOrigin: '50% 0', fontFamily: DISPLAY, fontSize: size, lineHeight: 1, color: P.white, whiteSpace: 'nowrap'}}>ROTINA</div>
		</DirBlur>
	);
};

export const Revelacao: React.FC<{f: number}> = ({f}) => {
	if (f < T.redIn || f > T.paperIn + 14) return null;
	const t = 'no mesmo lugar.';
	const wT = serifW(t, 104);
	return (
		<>
			<RotinaSobe f={f} />
			<Entra f={f} at={W(5, 'no')} from="left" x={540 - wT / 2} y={292 + 230 + 16} w={wT} h={120} exitAt={T.paperIn} exitTo="left" id="r_lugar">
				<Big size={104} font={SERIF} italic color={P.white}>
					{t}
				</Big>
			</Entra>
		</>
	);
};

// ============================================================ HABITOS (papel; celular a esquerda)
const CheckChip: React.FC<{label: string}> = ({label}) => (
	<Pill size={40} style={{boxShadow: '0 20px 40px rgba(0,0,0,0.25)'}}>
		<span style={{width: 52, height: 52, borderRadius: 14, background: P.red, display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>
			<Check size={34} strokeWidth={4} color="#fff" />
		</span>
		{label}
	</Pill>
);
const chipW = (label: string) => 52 + 16 + textWidth(label.toUpperCase(), 40, SANS, false, 800) + label.length * 2.4 + 56 + 10;
const SEMANA = [100, 80, 35, 80, 100, 60, 100];

export const Habitos: React.FC<{f: number}> = ({f}) => {
	if (f < T.paperIn || f > T.inkIn + 12) return null;
	const sHab = fitSize('HÁBITOS', 960, 300);
	const cump = W(6, 'cumprido') - 1;
	const soma = W(6, 'soma') - 2;
	const fogo = W(6, 'foguinho') + 2;
	const sai = W(7, 'E') - 3;
	const da = W(7, 'dá') - 1;
	const ver = W(7, 'ver');
	const furou = W(7, 'furou');
	const n = f >= fogo ? 12 : 11;
	const bump = sp(f, fogo, {stiffness: 220, damping: 12});
	const mais = tw(f, [fogo, fogo + 16], [0, 1], ease.out);
	const ring = f >= furou ? pulo(f, furou) : 0;
	const wF = textWidth('FUROU', 140);
	const out = T.inkIn - 2;
	return (
		<>
			<PalavraDividida f={f} at={W(6, 'Cada')} text="HÁBITOS" size={sHab} color={P.ink} cx={540} top={300} exitAt={out} exitTo="right" id="h_tit" />
			<Atras f={f} at={cump} side="right" x={600} y={690} w={chipW('Cumprido')} h={92} exitAt={sai} exitTo="right" id="h_chip">
				<CheckChip label="Cumprido" />
			</Atras>
			<Atras f={f} at={soma} side="right" x={600} y={810} w={420} h={214} exitAt={sai + 2} exitTo="right" id="h_seq">
				<UiCard style={{width: 420, height: 214, padding: '20px 26px', position: 'relative'}}>
					<div style={{fontFamily: BARLOW_C, fontWeight: 600, fontSize: 26, letterSpacing: '0.12em', color: c.muted}}>SEQUÊNCIA</div>
					<div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 6}}>
						<Flame size={58} color={c.amber} fill={c.amber} style={{transform: `scale(${1 + 0.3 * Math.sin(Math.PI * Math.min(1, bump))})`}} />
						<span style={{fontFamily: BARLOW_C, fontWeight: 800, fontSize: 110, lineHeight: 1, color: c.amber, display: 'inline-block', transform: `translateY(${f >= fogo ? (1 - Math.min(1, bump)) * 26 : 0}px)`}}>{n}</span>
						<span style={{fontFamily: 'Barlow', fontSize: 26, color: c.muted, lineHeight: 1.1}}>
							dias
							<br />
							seguidos
						</span>
					</div>
					{f >= fogo && (
						<div style={{position: 'absolute', right: 26, top: 30 - 40 * mais, fontFamily: DISPLAY, fontSize: 84, lineHeight: 1, color: c.redHi, opacity: 1 - tw(f, [fogo + 10, fogo + 18], [0, 1])}}>+1</div>
					)}
				</UiCard>
			</Atras>
			<Atras f={f} at={da} side="right" x={600} y={690} w={420} h={340} exitAt={out} exitTo="right" id="h_sem">
				<UiCard style={{width: 420, height: 340, padding: '22px 26px'}}>
					<div style={{fontFamily: BARLOW_C, fontWeight: 600, fontSize: 26, letterSpacing: '0.12em', color: c.muted, marginBottom: 14}}>ESTA SEMANA</div>
					<div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 240}}>
						{SEMANA.map((v, i) => {
							const g = sp(f, ver - 6 + i * 3, {stiffness: 200, damping: 16});
							const q = i === 2;
							return (
								<div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
									<div style={{position: 'relative', width: 36, height: 196, borderRadius: 11, background: '#1D1D1D', display: 'flex', alignItems: 'flex-end'}}>
										<div style={{width: '100%', height: `${v * Math.min(1.06, g)}%`, borderRadius: 11, background: v === 100 ? c.redHi : 'rgba(255,90,90,0.55)'}} />
										{q && ring > 0 && <div style={{position: 'absolute', left: -9, right: -9, top: -9, bottom: -9, borderRadius: 18, border: `5px solid ${P.redHi}`, transform: `scale(${0.6 + 0.4 * ring})`, opacity: Math.min(1, ring)}} />}
									</div>
									<span style={{fontFamily: 'Barlow', fontWeight: 700, fontSize: 24, color: q && ring > 0.5 ? c.redHi : c.faint}}>{'STQQSSD'[i]}</span>
								</div>
							);
						})}
					</div>
				</UiCard>
			</Atras>
			<Entra f={f} at={furou - 2} from="right" x={1030 - wF} y={1050} w={wF} h={140} exitAt={out} exitTo="right" id="h_furou">
				<Big size={140} color={P.red}>
					FUROU
				</Big>
			</Entra>
		</>
	);
};

// ============================================================ TREINO (tinta; celular a direita)
const DAYS = [
	['SEG', 'PEITO', c.redHi],
	['TER', 'COSTAS', c.blue],
	['QUA', 'PERNA', c.green],
	['QUI', 'OMBRO', '#B7791F'],
	['SEX', 'BRAÇO', c.pink],
	['SÁB', 'CARDIO', c.orange],
	['DOM', '—', P.mute],
] as const;
const PTS = [92, 93, 95, 95, 98, 101, 104, 107, 110];

export const Treino: React.FC<{f: number}> = ({f}) => {
	if (f < T.inkIn || f > T.paper2In + 14) return null;
	const sTre = fitSize('TREINO', 960, 300);
	const seg = W(8, 'segunda');
	const ter = W(8, 'terça');
	const resto = W(8, 'costas') + 6;
	const cai = W(9, 'cai');
	const graf = W(9, 'gráfico');
	const out = T.paper2In;
	// grafico grande atras do celular, desenhado (sem mascara: a area e um poligono ate a ponta da linha)
	const draw = tw(f, [cai, graf + 6], [0, 1], ease.ae);
	const X0 = 70;
	const X1 = 1010;
	const Y0 = 600;
	const Y1 = 330;
	const pts = PTS.map((v, i) => [X0 + (i / (PTS.length - 1)) * (X1 - X0), Y0 - ((v - 90) / 22) * (Y0 - Y1)]);
	const segs = PTS.length - 1;
	const tip = draw * segs;
	const nFull = Math.floor(tip);
	const part = pts.slice(0, nFull + 1);
	if (nFull < segs) {
		const a = pts[nFull];
		const b = pts[nFull + 1];
		const u = tip - nFull;
		part.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]);
	}
	const line = part.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
	const lastP = part[part.length - 1];
	const area = line + ` L ${lastP[0].toFixed(1)} ${Y0} L ${X0} ${Y0} Z`;
	const dot = f >= graf + 6 ? pulo(f, graf + 6) : 0;
	const chartOut = tw(f, [out, out + 9], [0, 1], ease.in);
	const w19 = textWidth('+19%', 120);
	return (
		<>
			<PalavraDividida f={f} at={W(8, 'Você')} text="TREINO" size={sTre} color={P.paperHi} cx={540} top={320} toHeaderAt={W(8, 'semana') - 2} headerScale={0.36} headerTop={290} exitAt={cai - 6} exitTo="top" id="t_tit" />
			<Entra f={f} at={W(8, 'semana')} from="left" x={65} y={420} w={950} h={200} exitAt={W(9, 'Anotou') - 4} exitTo="left" id="t_dias">
				<div style={{width: 950, height: 176, borderRadius: 26, background: P.paperHi, boxShadow: '0 22px 44px rgba(0,0,0,0.45)', display: 'flex', padding: 12, gap: 8, boxSizing: 'border-box'}}>
					{DAYS.map(([d, mus, col], i) => {
						const at = i === 0 ? seg : i === 1 ? ter : resto + (i - 2) * 2;
						const on = f >= at ? Math.min(1, sp(f, at, {stiffness: 260, damping: 18})) : 0;
						const forte = i < 2;
						return (
							<div
								key={d}
								style={{
									flex: 1,
									borderRadius: 18,
									background: `rgba(17,17,17,${0.04 + 0.05 * on})`,
									border: `4px solid ${forte && on > 0.5 ? col : 'transparent'}`,
									boxShadow: forte && on > 0 ? `0 0 ${22 * on}px ${col}` : undefined,
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
									gap: 4,
									transform: `scale(${0.92 + 0.08 * on})`,
								}}
							>
								<div style={{fontFamily: SANS, fontWeight: 800, fontSize: 24, letterSpacing: '0.06em', color: P.mute}}>{d}</div>
								<div style={{fontFamily: DISPLAY, fontSize: mus.length > 5 ? 30 : 38, color: col, opacity: 0.22 + (forte ? 0.78 : 0.45) * on}}>{mus}</div>
							</div>
						);
					})}
				</div>
			</Entra>
			{[
				{at: W(9, 'peso') - 1, lbl: 'Carga', val: '82,5 kg', y: 690},
				{at: W(9, 'repetição') - 1, lbl: 'Repetições', val: '10', y: 860},
			].map((d, i) => (
				<Atras key={d.lbl} f={f} at={d.at} side="left" x={65} y={d.y} w={330} h={150} exitAt={cai + 2 + i * 2} exitTo="left" id={'t_c' + i}>
					<div style={{width: 330, height: 150, boxSizing: 'border-box', background: P.paperHi, borderRadius: 24, padding: '16px 26px 8px', boxShadow: '0 20px 40px rgba(0,0,0,0.45)'}}>
						<Lbl size={24}>{d.lbl}</Lbl>
						<Big size={88}>{d.val}</Big>
					</div>
				</Atras>
			))}
			{f >= cai && chartOut < 1 && (
				<DirBlur id="t_graf" amount={chartOut > 0 ? Math.min(40, chartOut * 60) : 0} angle={0}>
					<svg width={1080} height={700} style={{position: 'absolute', left: -chartOut * 1500, top: 0}}>
						<defs>
							<linearGradient id="v4area" x1="0" x2="0" y1="0" y2="1">
								<stop offset="0" stopColor={P.red} stopOpacity={0.6} />
								<stop offset="1" stopColor={P.red} stopOpacity={0} />
							</linearGradient>
						</defs>
						<path d={area} fill="url(#v4area)" />
						<path d={line} fill="none" stroke={P.paperHi} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
						{dot > 0 && <circle cx={pts[segs][0]} cy={pts[segs][1]} r={22 * dot} fill={P.red} stroke={P.paperHi} strokeWidth={6} />}
					</svg>
				</DirBlur>
			)}
			<Entra f={f} at={graf} from="left" x={70} y={660} w={100 + w19} h={124} exitAt={out} exitTo="left" id="t_19">
				<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
					<TrendingUp size={84} color={c.green} strokeWidth={3} />
					<Big size={120} color={c.green}>
						+19%
					</Big>
				</div>
			</Entra>
			<Entra f={f} at={graf + 3} from="left" x={76} y={796} w={430} h={40} exitAt={out + 1} exitTo="left" id="t_rec">
				<div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
					<Trophy size={32} color={c.amber} />
					<Lbl color={P.paperHi} size={28}>
						Novo recorde · 110 kg
					</Lbl>
				</div>
			</Entra>
		</>
	);
};

// ============================================================ FINANCEIRO (papel; celular a esquerda, depois no centro)
const Row: React.FC<{sign: '+' | '−'; value: string; desc: string}> = ({sign, value, desc}) => {
	const inn = sign === '+';
	return (
		<UiCard style={{width: 420, height: 124, padding: '14px 22px', display: 'flex', alignItems: 'center', gap: 18}}>
			<div style={{width: 70, height: 70, borderRadius: 20, background: inn ? c.greenBg : c.redBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BARLOW_C, fontWeight: 800, fontSize: 56, color: inn ? c.green : c.redHi}}>{sign}</div>
			<div>
				<div style={{fontFamily: BARLOW_C, fontWeight: 800, fontSize: 50, lineHeight: 1, color: inn ? c.green : c.redHi}}>{value}</div>
				<div style={{fontFamily: 'Barlow', fontWeight: 600, fontSize: 24, color: c.muted, marginTop: 4, whiteSpace: 'nowrap'}}>{desc}</div>
			</div>
		</UiCard>
	);
};
const brl0 = (v: number) => 'R$ ' + Math.round(v).toLocaleString('pt-BR');

export const Financeiro: React.FC<{f: number}> = ({f}) => {
	if (f < T.paper2In || f > W(12, 'Nem') + 6) return null;
	const sFin = fitSize('FINANCEIRO', 960, 220);
	const sai = W(11, 'Conta') - 10;
	const saldo = W(10, 'saldo');
	const ac = W(10, 'acompanha') - 4;
	const val = 4240 * tw(f, [saldo, saldo + 14], [0, 1], ease.out);
	const wS = textWidth('R$ 4.240', 130);
	const under = tw(f, [ac, ac + 10], [0, 1], ease.out);
	const fixa = W(11, 'fixa');
	const pont = W(11, 'pontual') - 1;
	const knob = sp(f, pont, {stiffness: 650, damping: 40, mass: 0.5});
	const press = (t: number) => (f >= t && f < t + 10 ? 1 - 0.035 * Math.sin((Math.PI * (f - t)) / 10) : 1);
	const fim = W(12, 'Nem') - 6;
	const lado = 'de um lado';
	const outro = 'do outro';
	return (
		<>
			<PalavraDividida f={f} at={W(10, 'Entrou')} text="FINANCEIRO" size={sFin} color={P.ink} cx={540} top={330} toHeaderAt={W(10, 'salário') + 6} headerScale={0.5} headerTop={290} exitAt={fim} exitTo="top" id="f_tit" />
			<Atras f={f} at={W(10, 'salário') - 1} side="right" x={600} y={690} w={420} h={124} exitAt={sai} exitTo="right" id="f_in">
				<Row sign="+" value="R$ 4.800" desc="Salário · entrada" />
			</Atras>
			<Atras f={f} at={W(10, 'PIX') - 1} side="right" x={600} y={834} w={420} h={124} exitAt={sai + 1} exitTo="right" id="f_out">
				<Row sign="−" value="R$ 1.200" desc="PIX · saída" />
			</Atras>
			<Entra f={f} at={saldo - 2} from="right" x={606} y={990} w={420} h={36} exitAt={sai + 2} exitTo="right" id="f_sl">
				<Lbl color={P.ink} size={28}>
					Saldo do mês
				</Lbl>
			</Entra>
			<Entra f={f} at={saldo} from="right" x={600} y={1030} w={wS + 20} h={160} exitAt={sai + 3} exitTo="right" id="f_sv">
				<div style={{fontFamily: DISPLAY, fontSize: 130, lineHeight: 1, color: P.ink, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums'}}>{brl0(val)}</div>
				<svg width={wS + 20} height={30} style={{display: 'block'}}>
					<path d={`M 6 16 C ${wS * 0.3} 4, ${wS * 0.6} 28, ${wS + 10} 10`} fill="none" stroke={P.red} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - under} />
				</svg>
			</Entra>
			<Entra f={f} at={W(11, 'Conta') - 3} from="left" x={65} y={420} w={950} h={130} exitAt={fim} exitTo="left" id="f_tog">
				<div style={{transform: `scale(${press(fixa) * press(pont)})`, position: 'relative', height: 130, borderRadius: 65, background: P.paperHi, border: `5px solid ${P.ink}`, boxShadow: '0 20px 40px rgba(0,0,0,0.16)', display: 'flex', overflow: 'hidden', boxSizing: 'border-box'}}>
					<div style={{position: 'absolute', top: 9, bottom: 9, left: 9 + knob * (470 - 9), width: 461, borderRadius: 56, background: P.red, boxShadow: '0 8px 20px rgba(204,0,0,0.35)'}} />
					{['FIXA', 'PONTUAL'].map((t, i) => (
						<div key={t} style={{position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 70, color: (i === 0 ? 1 - knob : knob) > 0.5 ? P.white : P.ink}}>
							{t}
						</div>
					))}
				</div>
			</Entra>
			<Entra f={f} at={W(11, 'de')} from="left" x={65 + 238 - serifW(lado, 72) / 2} y={572} w={serifW(lado, 72)} h={90} exitAt={fim} exitTo="left" id="f_lado">
				<Big size={72} font={SERIF} italic>
					{lado}
				</Big>
			</Entra>
			<Entra f={f} at={W(11, 'do')} from="right" x={65 + 712 - serifW(outro, 72) / 2} y={572} w={serifW(outro, 72)} h={90} exitAt={fim + 1} exitTo="right" id="f_outro">
				<Big size={72} font={SERIF} italic>
					{outro}
				</Big>
			</Entra>
		</>
	);
};

// ============================================================ FECHAMENTO (papel): "nem precisa esperar" + SEGUNDA riscada
export const Fechamento: React.FC<{f: number}> = ({f}) => {
	const nem = W(12, 'Nem');
	if (f < nem - 1 || f > T.redEnd + 20) return null;
	const t = 'nem precisa esperar';
	const sT = Math.min(110, (940 * 100) / serifW(t, 100));
	const wSeg = textWidth('SEGUNDA', 240);
	const segAt = W(12, 'segunda') - 4;
	const risco = tw(f, [segAt + 8, segAt + 18], [0, 1], ease.out);
	const sai = T.redEnd + 4;
	return (
		<>
			<Entra f={f} at={nem} from="left" x={70} y={300} w={serifW(t, sT)} h={sT * 1.2} exitAt={sai} exitTo="left" id="c_nem">
				<Big size={sT} font={SERIF} italic>
					{t}
				</Big>
			</Entra>
			<Entra f={f} at={segAt} from="right" x={1010 - wSeg} y={440} w={wSeg + 20} h={250} exitAt={sai + 1} exitTo="right" id="c_seg">
				<div style={{position: 'relative'}}>
					<Big size={240} color={P.ink}>
						SEGUNDA
					</Big>
					<div style={{position: 'absolute', left: -10, top: 240 * 0.47, width: (wSeg + 20) * risco, height: 24, borderRadius: 12, background: P.red}} />
				</div>
			</Entra>
		</>
	);
};

// ============================================================ CTA (vermelho; celular no centro com a abertura clara)
export const CTA: React.FC<{f: number}> = ({f}) => {
	const baixe = W(13, 'Baixe');
	if (f < baixe - 2) return null;
	const agora = W(13, 'agora');
	const link = W(13, 'Link') - 1;
	const hit = 862;
	const afunda = f < agora ? 0 : f < agora + 3 ? tw(f, [agora, agora + 3], [0, 1], ease.inOut) : 1 - tw(f, [agora + 3, agora + 10], [0, 1], ease.out);
	const ripple = tw(f, [agora, agora + 18], [0, 1], ease.out);
	const pulse = f >= hit ? 1 + 0.06 * Math.exp(-(f - hit) / 5) * Math.cos((f - hit) / 2.2) : 1;
	const wLink = textWidth('LINK NA BIO', 56, SANS, false, 800) + 56 * 0.1 * 11 + 18 + 60;
	return (
		<>
			<Entra f={f} at={baixe} from="top" x={160} y={300} w={760} h={176} cfg={{stiffness: 220, damping: 22}} id="a_btn">
				<div style={{position: 'relative', width: 760, height: 168, transform: `scale(${pulse}) translateY(${6 * afunda}px)`}}>
					<div style={{position: 'absolute', left: 0, right: 0, top: 8, height: 160, borderRadius: 80, background: '#8F0000'}} />
					<div style={{position: 'absolute', left: 0, right: 0, top: 8 * afunda, height: 160, borderRadius: 80, background: P.white, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26, boxShadow: '0 30px 60px rgba(80,0,0,0.35)', overflow: 'hidden'}}>
						{f >= agora && <div style={{position: 'absolute', left: 380 - 400 * ripple, top: 80 - 400 * ripple, width: 800 * ripple, height: 800 * ripple, borderRadius: '50%', background: `rgba(204,0,0,${0.18 * (1 - ripple)})`}} />}
						<Download size={70} color={P.red} strokeWidth={3} />
						<span style={{fontFamily: DISPLAY, fontSize: 100, color: P.ink, letterSpacing: '0.01em'}}>BAIXE AGORA</span>
					</div>
				</div>
			</Entra>
			<Atras f={f} at={link} side="up" x={540 - wLink / 2} y={512} w={wLink} h={70} id="a_link">
				<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
					<span style={{fontFamily: SANS, fontWeight: 800, fontSize: 56, letterSpacing: '0.1em', color: P.white, whiteSpace: 'nowrap'}}>LINK NA BIO</span>
					<ArrowDown size={58} color={P.white} strokeWidth={3.2} style={{transform: `translateY(${f > link + 10 ? Math.abs(Math.sin((f - link) / 4.5)) * 14 : 0}px)`}} />
				</div>
			</Atras>
		</>
	);
};

export const Cenas4: React.FC<{f: number}> = ({f}) => (
	<AbsoluteFill>
		<Gancho f={f} />
		<Revelacao f={f} />
		<Habitos f={f} />
		<Treino f={f} />
		<Financeiro f={f} />
		<Fechamento f={f} />
		<CTA f={f} />
	</AbsoluteFill>
);

export const _interp = interpolate;
export const _clamp = clampF;
