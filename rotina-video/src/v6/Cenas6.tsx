import React from 'react';
import {Img, staticFile} from 'remotion';
import {ArrowDownRight, ArrowUpRight, Dumbbell, Flame, ListChecks, Minus, Plus, TrendingUp, Trophy, Wallet} from 'lucide-react';
import {C, E, F, FD, Grande, brl, sp, tw} from '../v5/theme';
import {Cursor, Logo, Pilula, larguraLogo} from '../v5/pecas';
import {bbox, bodyQuad, screenPoint} from '../v3/camera';
import {ALT6, Borrao6, Frase6, LARG6} from './base6';
import {FIM_CELULAR, RE, Rect, T6} from './plano6';
import {desfoque, poseV6} from './rig6';
import {ESTILOS, MESES, SEMANAS, CARGAS} from './Tela6';
import {W6} from './tempo6';

// Cenas 2D do v6 (1080 x 1920). Camadas em Video6: fundo -> CenasAbaixo (frases, CTA, marca) -> celular do Blender
// -> CenasAcima (os elementos que sobem da tela com o celular desfocado atras) -> granulacao.

const pad4 = (n: number) => String(n).padStart(4, '0');
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// ============================================================ celular (Blender), desfocado no 2D durante os mergulhos
const usaB = (f: number) => Number(desfoque(f).toFixed(3)) >= 0.6;
export const Celular6: React.FC<{f: number; silhueta?: boolean}> = ({f, silhueta}) => {
	// fora do quadro (saindo por baixo) o Blender nao gera o PNG
	if (f > FIM_CELULAR || bbox(poseV6(f)).y0 > ALT6) return null;
	const d = desfoque(f);
	const filtro = d > 0.01 ? `blur(${(18 * d).toFixed(1)}px) brightness(${(1 - 0.38 * d).toFixed(3)})` : undefined;
	if (silhueta) {
		const p = poseV6(f);
		const q = bodyQuad(p);
		const t = [screenPoint(p, 0, 0), screenPoint(p, 1, 0), screenPoint(p, 1, 1), screenPoint(p, 0, 1)];
		const pts = (v: {x: number; y: number}[]) => v.map((a) => `${a.x.toFixed(1)},${a.y.toFixed(1)}`).join(' ');
		return (
			<svg width={LARG6} height={ALT6} style={{position: 'absolute', inset: 0, filter: filtro}}>
				<polygon points={pts(q)} fill="#2A2A30" />
				<polygon points={pts(t)} fill="#121214" />
			</svg>
		);
	}
	// os quadros desfocados foram renderizados a 40% e so nos pares (o desfoque esconde a diferenca)
	const b = usaB(f);
	const g = !b || f % 2 === 0 || !usaB(f - 1) ? f : f - 1;
	const src = b ? `v6/celular_b/c_${pad4(g)}.png` : `v6/celular/c_${pad4(f)}.png`;
	return <Img src={staticFile(src)} style={{position: 'absolute', left: 0, top: 0, width: LARG6, height: ALT6, filter: filtro}} />;
};

// ============================================================ frases (terco de cima, com o celular em foco embaixo)
const FR = {y: 250, size: 86};
const Frases: React.FC<{f: number}> = ({f}) => (
	<>
		<Frase6
			f={f}
			id="f1"
			y={FR.y}
			size={FR.size}
			sai={T6.sai1}
			linhas={[
				[
					{t: 'Quanto', at: W6(1, 'quanto')},
					{t: 'você', at: W6(1, 'você')},
					{t: 'pegava', at: W6(1, 'pegava')},
				],
				[
					{t: 'no', at: W6(1, 'no')},
					{t: 'supino?', at: W6(1, 'supino'), titulo: true, icone: Dumbbell, cor: C.red},
				],
			]}
		/>
		<Frase6
			f={f}
			id="f2"
			y={FR.y - 40}
			size={FR.size}
			sai={T6.sai2}
			linhas={[
				[
					{t: 'No', at: W6(2, 'no')},
					{t: 'Rotina,', at: W6(2, 'rotina'), titulo: true, cor: C.red},
				],
				[
					{t: 'cada', at: W6(2, 'cada')},
					{t: 'semana', at: W6(2, 'semana')},
					{t: 'tem', at: W6(2, 'tem')},
				],
				[
					{t: 'um', at: W6(2, 'um')},
					{t: 'estilo', at: W6(2, 'estilo'), titulo: true, cor: ESTILOS.hiper.cor},
				],
			]}
		/>
		<Frase6
			f={f}
			id="f3"
			y={FR.y}
			size={FR.size}
			sai={T6.sai3}
			linhas={[
				[
					{t: 'Cada', at: W6(3, 'cada')},
					{t: 'treino', at: W6(3, 'treino')},
					{t: 'vira', at: W6(3, 'vira')},
					{t: 'um', at: W6(3, 'um')},
				],
				[{t: 'checklist', at: W6(3, 'checklist'), titulo: true, icone: ListChecks, cor: C.red}],
			]}
		/>
		<Frase6
			f={f}
			id="f5"
			y={FR.y}
			size={FR.size}
			sai={T6.sai5}
			linhas={[
				[
					{t: 'Fechou', at: W6(5, 'fechou')},
					{t: 'doze', at: W6(5, 'doze'), titulo: true, cor: C.green},
				],
				[
					{t: 'em', at: W6(5, 'em')},
					{t: 'todas,', at: W6(5, 'todas')},
				],
			]}
		/>
		<Frase6
			f={f}
			id="f7"
			y={FR.y}
			size={FR.size}
			sai={T6.sai7}
			linhas={[
				[
					{t: 'O', at: W6(7, 'o')},
					{t: 'gráfico', at: W6(7, 'gráfico'), titulo: true, icone: TrendingUp, cor: C.red},
				],
				[
					{t: 'mostra', at: W6(7, 'mostra')},
					{t: 'o', at: W6(7, 'o', 1)},
					{t: 'supino', at: W6(7, 'supino')},
				],
			]}
		/>
		<Frase6
			f={f}
			id="f9"
			y={FR.y}
			size={FR.size}
			sai={T6.sai9}
			linhas={[
				[
					{t: 'Nos', at: W6(9, 'nos')},
					{t: 'hábitos,', at: W6(9, 'hábitos'), titulo: true, icone: ListChecks, cor: C.red},
				],
				[
					{t: 'outro', at: W6(9, 'outro')},
					{t: 'checklist', at: W6(9, 'checklist')},
				],
			]}
		/>
		<Frase6 f={f} id="f10" y={FR.y + 60} size={FR.size} sai={T6.sai10} linhas={[[{t: 'No', at: W6(10, 'no')}, {t: 'financeiro', at: W6(10, 'financeiro'), titulo: true, icone: Wallet, cor: C.red}]]} />
		<Frase6
			f={f}
			id="f11"
			y={FR.y}
			size={96}
			sai={T6.sai11}
			linhas={[
				[
					{t: 'Tudo', at: W6(11, 'tudo')},
					{t: 'num', at: W6(11, 'num')},
				],
				[
					{t: 'app', at: W6(11, 'app'), titulo: true, cor: C.red},
					{t: 'só.', at: W6(11, 'só'), titulo: true, cor: C.red},
				],
			]}
		/>
	</>
);

// ============================================================ elementos que sobem da tela (com o celular desfocado atras)
// Comecam exatamente sobre o elemento da tela do celular (projecao do retangulo da UI no quadro do salto)
// e vao com mola para o lugar deles; saem subindo pela borda de cima.
type Mov = [number, number]; // [quadro, deslocamento vertical]
const projeta = (f: number, r: Rect) => {
	const p = poseV6(f);
	const a = screenPoint(p, r.x / 390, r.y / 834);
	const b = screenPoint(p, (r.x + r.w) / 390, r.y / 834);
	const d = screenPoint(p, r.x / 390, (r.y + r.h) / 834);
	return {cx: (a.x + b.x) / 2 + (d.x - a.x) / 2, cy: (a.y + d.y) / 2, w: Math.hypot(b.x - a.x, b.y - a.y)};
};
const Salto: React.FC<{f: number; at: number; de: Rect; cx: number; cy: number; w: number; h: number; sai: number; mov?: Mov[]; id: string; children: React.ReactNode}> = ({f, at, de, cx, cy, w, h, sai, mov = [], id, children}) => {
	if (f < at - 1 || f > sai + 10) return null;
	const k = sp(f, at, {stiffness: 190, damping: 19});
	const o = projeta(Math.max(at, Math.min(f, at + 2)), de);
	const e0 = o.w / w;
	const esc = lerp(e0, 1, k);
	const dy = mov.reduce((acc, [m, v]) => acc + tw(f, [m, m + 10], [0, v], E.inOut), 0);
	const dy0 = mov.reduce((acc, [m, v]) => acc + tw(f - 1, [m, m + 10], [0, v], E.inOut), 0);
	const s = tw(f, [sai, sai + 9], [0, 1], E.in);
	const s0 = tw(f - 1, [sai, sai + 9], [0, 1], E.in);
	const x = lerp(o.cx, cx, k);
	const y = lerp(o.cy, cy, k) + dy - 1500 * s;
	const vy = y - (lerp(o.cy, cy, sp(f - 1, at, {stiffness: 190, damping: 19})) + dy0 - 1500 * s0);
	return (
		<Borrao6 id={id} dx={0} dy={vy} k={0.2} max={s > 0 ? 14 : 30}>
			<div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `scale(${esc})`, transformOrigin: '50% 50%', opacity: Math.min(1, (f - at + 2) / 3) * (1 - s)}}>
				{children}
			</div>
		</Borrao6>
	);
};

const Card6: React.FC<{w: number; h: number; borda?: string; brilho?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({w, h, borda, brilho, children, style}) => (
	<div
		style={{
			width: w,
			height: h,
			boxSizing: 'border-box',
			borderRadius: 36,
			background: 'rgba(26,26,32,0.96)',
			border: `2px solid ${borda ?? 'rgba(255,255,255,0.08)'}`,
			boxShadow: `0 50px 110px rgba(0,0,0,0.6), 0 12px 30px rgba(0,0,0,0.4)${brilho ? `, 0 0 70px ${brilho}` : ''}`,
			padding: '34px 44px',
			fontFamily: F,
			color: C.text,
			...style,
		}}
	>
		{children}
	</div>
);
const Rot: React.FC<{children: React.ReactNode; cor?: string; size?: number}> = ({children, cor = C.gray, size = 32}) => (
	<div style={{fontFamily: FD, fontWeight: 700, fontSize: size, letterSpacing: '0.1em', textTransform: 'uppercase', color: cor, whiteSpace: 'nowrap'}}>{children}</div>
);
const IconeCaixa: React.FC<{cor: string; size: number; children: React.ReactNode}> = ({cor, size, children}) => (
	<div style={{width: size, height: size, borderRadius: size * 0.27, background: cor + '26', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{children}</div>
);
// numero que troca rolando (o velho sobe e sai, o novo sobe e entra)
const Troca: React.FC<{f: number; at: number; de: string; para: string; size: number; cor: string}> = ({f, at, de, para, size, cor}) => {
	const k = tw(f, [at, at + 7], [0, 1], E.out);
	const st: React.CSSProperties = {position: 'absolute', left: 0, right: 0, textAlign: 'center', fontFamily: FD, fontWeight: 800, fontSize: size, lineHeight: 1, color: cor, fontVariantNumeric: 'tabular-nums'};
	return (
		<div style={{position: 'relative', width: size * 1.25, height: size}}>
			{k < 1 ? <div style={{...st, top: -k * size * 0.7, opacity: 1 - k, filter: k > 0 ? `blur(${(k * 6).toFixed(1)}px)` : undefined}}>{de}</div> : null}
			{k > 0 ? <div style={{...st, top: (1 - k) * size * 0.7, opacity: k, filter: k < 1 ? `blur(${((1 - k) * 6).toFixed(1)}px)` : undefined}}>{para}</div> : null}
		</div>
	);
};
const Botao: React.FC<{f: number; at?: number; children: React.ReactNode; size?: number}> = ({f, at, children, size = 84}) => {
	const ap = at !== undefined && f >= at ? Math.sin(Math.PI * Math.min(1, (f - at) / 7)) : 0;
	return (
		<div style={{width: size, height: size, borderRadius: size * 0.28, background: '#26262D', border: `2px solid ${ap > 0 ? ESTILOS.hiper.cor : 'rgba(255,255,255,0.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.text, transform: `scale(${1 - 0.12 * ap})`}}>{children}</div>
	);
};

// ---------------------------------------------------------------- 1) gancho: "?? kg" de 3 meses atras
const CartaoGancho: React.FC = () => (
	<Card6 w={900} h={360}>
		<div style={{display: 'flex', alignItems: 'center', gap: 24}}>
			<IconeCaixa cor={C.red} size={96}>
				<Dumbbell size={54} color={C.red} strokeWidth={2.4} />
			</IconeCaixa>
			<div style={{flex: 1}}>
				<div style={{fontFamily: FD, fontWeight: 800, fontSize: 54, textTransform: 'uppercase', lineHeight: 1}}>Supino reto</div>
				<div style={{fontWeight: 500, fontSize: 28, color: C.gray, marginTop: 6}}>Treinos · Progresso</div>
			</div>
			<Rot>Há 3 meses</Rot>
		</div>
		<div style={{marginTop: 16, fontFamily: FD, fontWeight: 800, fontSize: 190, lineHeight: 1, whiteSpace: 'nowrap'}}>
			<span style={{color: C.red}}>??</span>
			<span style={{fontSize: 110, color: C.gray}}> kg</span>
		</div>
	</Card6>
);

// ---------------------------------------------------------------- 2) um estilo por semana
const CartaoSemana: React.FC<{i: number}> = ({i}) => {
	const s = SEMANAS[i];
	return (
		<Card6 w={940} h={190} borda={s.e.cor + '66'} style={{display: 'flex', alignItems: 'center', gap: 28, padding: '0 40px'}}>
			<IconeCaixa cor={s.e.cor} size={118}>
				<s.e.Icone size={66} color={s.e.cor} strokeWidth={2.2} />
			</IconeCaixa>
			<div style={{flex: 1, minWidth: 0}}>
				<Rot size={30}>
					Semana {s.n} · {s.datas}
				</Rot>
				<div style={{fontFamily: FD, fontWeight: 800, fontSize: 80, lineHeight: 1.02, textTransform: 'uppercase', color: s.e.cor, whiteSpace: 'nowrap'}}>{s.e.nome}</div>
			</div>
			<div style={{textAlign: 'right'}}>
				<div style={{fontFamily: FD, fontWeight: 800, fontSize: 66, lineHeight: 1}}>{s.e.reps}</div>
				<Rot size={28}>reps</Rot>
			</div>
		</Card6>
	);
};

// ---------------------------------------------------------------- 3) series e repeticoes
const CartaoSeries: React.FC<{f: number}> = ({f}) => (
	<Card6 w={900} h={250} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
		<div>
			<div style={{fontFamily: FD, fontWeight: 800, fontSize: 70, lineHeight: 1, textTransform: 'uppercase'}}>Séries</div>
			<div style={{fontWeight: 500, fontSize: 30, color: C.gray, marginTop: 8}}>por exercício</div>
		</div>
		<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
			<Botao f={f}>
				<Minus size={40} />
			</Botao>
			<Troca f={f} at={T6.maisSerie} de="3" para="4" size={130} cor={ESTILOS.hiper.cor} />
			<Botao f={f} at={T6.maisSerie - 1}>
				<Plus size={40} />
			</Botao>
		</div>
	</Card6>
);
const CartaoReps: React.FC<{f: number}> = ({f}) => (
	<Card6 w={900} h={330}>
		<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
			<div style={{fontFamily: FD, fontWeight: 800, fontSize: 70, lineHeight: 1, textTransform: 'uppercase'}}>Repetições</div>
			<div style={{display: 'flex', alignItems: 'center', gap: 10, height: 52, padding: '0 20px', borderRadius: 26, background: ESTILOS.hiper.cor + '26', color: ESTILOS.hiper.cor, fontFamily: FD, fontWeight: 700, fontSize: 30, textTransform: 'uppercase'}}>
				<Dumbbell size={30} /> Hipertrofia
			</div>
		</div>
		<div style={{display: 'flex', justifyContent: 'space-between', marginTop: 30}}>
			{[
				['Mínimo', '8', '10', T6.maisReps],
				['Máximo', '12', '12', -1],
			].map(([r, a, b, at]) => (
				<div key={r as string}>
					<Rot size={28}>{r}</Rot>
					<div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 10}}>
						<Botao f={f} size={70}>
							<Minus size={34} />
						</Botao>
						<Troca f={f} at={(at as number) > 0 ? (at as number) : 1e9} de={a as string} para={b as string} size={104} cor={ESTILOS.hiper.cor} />
						<Botao f={f} size={70} at={(at as number) > 0 ? (at as number) - 1 : undefined}>
							<Plus size={34} />
						</Botao>
					</div>
				</div>
			))}
		</div>
	</Card6>
);

// ---------------------------------------------------------------- 4) "aumente a carga", recorde e 1RM
const CartaoAviso: React.FC = () => (
	<Card6 w={940} h={330} borda="rgba(52,211,153,0.55)" brilho="rgba(52,211,153,0.18)">
		<div style={{fontWeight: 500, fontSize: 34, lineHeight: 1.3, color: 'rgba(245,245,247,0.85)'}}>Você chegou em 12 repetições em todas as séries.</div>
		<div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 14, fontFamily: FD, fontWeight: 800, fontSize: 80, lineHeight: 1, color: C.green, textTransform: 'uppercase', whiteSpace: 'nowrap'}}>
			<ArrowUpRight size={76} strokeWidth={3} /> Aumente a carga
		</div>
		<div style={{fontFamily: FD, fontWeight: 800, fontSize: 64, marginTop: 8}}>+2,5 kg</div>
	</Card6>
);
const CartaoRecorde: React.FC = () => (
	<Card6 w={940} h={180} borda="rgba(251,191,36,0.6)" brilho="rgba(251,191,36,0.16)" style={{display: 'flex', alignItems: 'center', gap: 28, padding: '0 40px'}}>
		<IconeCaixa cor={C.amber} size={112}>
			<Trophy size={62} color={C.amber} strokeWidth={2.2} />
		</IconeCaixa>
		<div>
			<div style={{fontFamily: FD, fontWeight: 800, fontSize: 70, lineHeight: 1, color: C.amber, textTransform: 'uppercase'}}>Novo recorde!</div>
			<div style={{fontWeight: 600, fontSize: 34, marginTop: 8}}>1RM estimado 112 kg</div>
		</div>
	</Card6>
);
const CartaoRM: React.FC<{f: number}> = ({f}) => {
	const v = 112 * tw(f, [T6.popRM + 2, T6.popRM + 30], [0, 1], E.out);
	const luz = tw(f, [T6.popRM + 24, T6.popRM + 32], [0, 1]);
	return (
		<Card6 w={940} h={470}>
			<Rot size={36}>1RM estimado</Rot>
			<div style={{fontWeight: 500, fontSize: 34, color: C.gray, marginTop: 6}}>quanto você pegaria numa repetição</div>
			<div style={{marginTop: 10, fontFamily: FD, fontWeight: 800, fontSize: 220, lineHeight: 1, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums', textShadow: luz > 0 ? `0 0 ${50 * luz}px rgba(251,191,36,${0.5 * luz})` : undefined}}>
				{Math.round(v)}
				<span style={{fontSize: 110, color: C.gray}}> kg</span>
			</div>
			<div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 6, fontFamily: FD, fontWeight: 700, fontSize: 34, color: C.gray, textTransform: 'uppercase'}}>
				<span style={{padding: '6px 18px', borderRadius: 22, background: '#26262D', color: C.text}}>80 kg × 12</span>→
				<span style={{padding: '6px 18px', borderRadius: 22, background: 'rgba(251,191,36,0.16)', color: C.amber}}>1 repetição</span>
			</div>
		</Card6>
	);
};

// ---------------------------------------------------------------- 5) grafico do supino: semana a semana, mes a mes
const CartaoGrafico: React.FC<{f: number}> = ({f}) => {
	const CW = 820;
	const CH = 360;
	const meses = f >= T6.meses;
	const vals = meses ? MESES.map((m) => m.kg) : CARGAS;
	const pts = vals.map((v, i) => [(i / (vals.length - 1)) * CW, CH - ((v - 66) / 16) * CH] as [number, number]);
	const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
	const area = `${d} L ${CW} ${CH} L 0 ${CH} Z`;
	const draw = meses ? tw(f, [T6.meses, T6.meses + 12], [0, 1], E.out) : tw(f, [T6.popGrafico + 2, T6.popGrafico + 22], [0, 1], E.out);
	const troca = tw(f, [T6.meses - 4, T6.meses + 4], [0, 1], E.inOut);
	const total = tw(f, [T6.meses + 10, T6.meses + 18], [0, 1], E.out);
	// ponta da linha (desenho sem mascara: a area vai ate a ponta)
	const n = pts.length - 1;
	const pos = draw * n;
	const i0 = Math.min(n - 1, Math.floor(pos));
	const fr = pos - i0;
	const ponta = [lerp(pts[i0][0], pts[i0 + 1][0], fr), lerp(pts[i0][1], pts[i0 + 1][1], fr)];
	const vis = pts.slice(0, i0 + 1).concat([ponta as [number, number]]);
	const dv = vis.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
	const av = `${dv} L ${ponta[0].toFixed(1)} ${CH} L 0 ${CH} Z`;
	return (
		<Card6 w={960} h={780} style={{padding: '36px 46px'}}>
			<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
				<div>
					<div style={{fontFamily: FD, fontWeight: 800, fontSize: 60, lineHeight: 1, textTransform: 'uppercase'}}>Supino reto</div>
					<Rot size={28}>Carga · {meses ? 'mês a mês' : 'semana a semana'}</Rot>
				</div>
				<div style={{position: 'relative', display: 'flex', background: '#26262D', borderRadius: 22, padding: 6}}>
					<div style={{position: 'absolute', top: 6, bottom: 6, left: 6 + troca * 150, width: 150, borderRadius: 16, background: C.redFill}} />
					{['Semanas', 'Meses'].map((t, i) => (
						<div key={t} style={{position: 'relative', width: 150, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FD, fontWeight: 700, fontSize: 30, textTransform: 'uppercase', color: (i === 1) === troca > 0.5 ? '#fff' : C.gray}}>
							{t}
						</div>
					))}
				</div>
			</div>
			<svg width={CW} height={CH + 60} style={{marginTop: 40, overflow: 'visible'}}>
				<defs>
					<linearGradient id="g6area" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="rgba(255,90,90,0.35)" />
						<stop offset="100%" stopColor="rgba(255,90,90,0)" />
					</linearGradient>
				</defs>
				{[0, 0.25, 0.5, 0.75, 1].map((g) => (
					<line key={g} x1={0} x2={CW} y1={CH * g} y2={CH * g} stroke="rgba(255,255,255,0.07)" strokeWidth={2} />
				))}
				{draw > 0 ? <path d={av} fill="url(#g6area)" /> : null}
				{draw > 0 ? <path d={dv} fill="none" stroke={C.red} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" /> : null}
				{pts.map((p, i) => (draw * n >= i - 0.01 ? <circle key={i} cx={p[0]} cy={p[1]} r={meses ? 12 : 8} fill={C.red} stroke="#1A1A20" strokeWidth={4} /> : null))}
				{meses
					? MESES.map((m, i) => (
							<text key={m.m} x={pts[i][0]} y={CH + 50} textAnchor="middle" fill={C.gray} style={{fontFamily: FD, fontWeight: 700, fontSize: 32, textTransform: 'uppercase'}}>
								{m.m.toUpperCase()}
							</text>
						))
					: null}
				{/* a resposta do gancho: 70 kg ha 3 meses, 80 kg hoje */}
				{draw > 0.05 ? (
					<>
						<text x={pts[0][0]} y={pts[0][1] - 84} fill={C.gray} style={{fontFamily: FD, fontWeight: 700, fontSize: 30, letterSpacing: '0.08em'}}>
							{meses ? 'JULHO' : 'HÁ 3 MESES'}
						</text>
						<text x={pts[0][0]} y={pts[0][1] - 36} fill={C.text} style={{fontFamily: FD, fontWeight: 800, fontSize: 48}}>
							70 kg
						</text>
					</>
				) : null}
				{draw > 0.97 ? (
					<text x={pts[n][0]} y={pts[n][1] - 30} textAnchor="end" fill={C.text} style={{fontFamily: FD, fontWeight: 800, fontSize: 52}}>
						80 kg
					</text>
				) : null}
			</svg>
			<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 26, opacity: total, transform: `translateY(${(1 - total) * 20}px)`}}>
				<div>
					<Rot size={28}>Carga total no mês</Rot>
					<div style={{fontFamily: FD, fontWeight: 800, fontSize: 70, lineHeight: 1}}>18,4 t</div>
				</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 10, height: 70, padding: '0 26px', borderRadius: 35, background: 'rgba(52,211,153,0.14)', color: C.green, fontFamily: FD, fontWeight: 800, fontSize: 44}}>
					<TrendingUp size={40} /> +14%
				</div>
			</div>
		</Card6>
	);
};

// ---------------------------------------------------------------- 6) meta de cardio: quanto falta
const CartaoCardio: React.FC<{f: number}> = ({f}) => {
	const R = 120;
	const circ = 2 * Math.PI * R;
	const k = tw(f, [T6.popCardio + 2, T6.falta - 2], [0, 0.8], E.out);
	const falta = sp(f, T6.falta, {stiffness: 300, damping: 20});
	return (
		<Card6 w={920} h={560}>
			<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
				<div style={{fontFamily: FD, fontWeight: 800, fontSize: 64, lineHeight: 1, textTransform: 'uppercase'}}>Meta de cardio</div>
				<Rot size={28}>Semana 3</Rot>
			</div>
			<div style={{display: 'flex', alignItems: 'center', gap: 44, marginTop: 34}}>
				<div style={{position: 'relative', width: 2 * R + 40, height: 2 * R + 40}}>
					<svg width={2 * R + 40} height={2 * R + 40} style={{transform: 'rotate(-90deg)'}}>
						<circle cx={R + 20} cy={R + 20} r={R} fill="none" stroke="#2A2A30" strokeWidth={30} />
						<circle cx={R + 20} cy={R + 20} r={R} fill="none" stroke={C.blue} strokeWidth={30} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - k)} />
					</svg>
					<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
						<span style={{fontFamily: FD, fontWeight: 800, fontSize: 104, lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>{Math.round(150 * k)}</span>
						<span style={{fontFamily: FD, fontWeight: 700, fontSize: 30, color: C.gray, textTransform: 'uppercase'}}>de 150 min</span>
					</div>
				</div>
				<div style={{flex: 1, opacity: Math.min(1, falta * 2)}}>
					<Rot size={30}>Faltam</Rot>
					<div style={{fontFamily: FD, fontWeight: 800, fontSize: 130, lineHeight: 1, color: C.blue, transform: `scale(${0.7 + 0.3 * Math.min(1.05, falta)})`, transformOrigin: '0 50%', opacity: Math.min(1, falta * 2)}}>30 min</div>
					<div style={{fontWeight: 500, fontSize: 30, color: C.gray, marginTop: 8}}>4 sessões nesta semana</div>
				</div>
			</div>
		</Card6>
	);
};

// ---------------------------------------------------------------- 7) habitos: a sequencia sobe
const CartaoSequencia: React.FC<{f: number}> = ({f}) => {
	const pop = sp(f, T6.sobe, {stiffness: 400, damping: 18});
	const pk = Math.sin(Math.PI * Math.min(1, pop));
	return (
		<Card6 w={920} h={320} borda="rgba(251,191,36,0.45)" style={{display: 'flex', alignItems: 'center', gap: 34}}>
			<Flame size={150} color={C.amber} fill={C.amber} style={{transform: `scale(${1 + 0.25 * pk})`, transformOrigin: '50% 90%', flexShrink: 0}} />
			<div>
				<Rot size={34}>Sequência</Rot>
				<div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
					<Troca f={f} at={T6.sobe} de="12" para="13" size={170} cor={C.amber} />
					<div style={{fontFamily: FD, fontWeight: 700, fontSize: 46, lineHeight: 1.05, textTransform: 'uppercase'}}>
						dias
						<br />
						seguidos
					</div>
				</div>
			</div>
		</Card6>
	);
};

// ---------------------------------------------------------------- 8) financeiro: entra, sai, sobra
const CartaoMov: React.FC<{entrada: boolean}> = ({entrada}) => {
	const cor = entrada ? C.green : C.red;
	const Ic = entrada ? ArrowUpRight : ArrowDownRight;
	return (
		<Card6 w={900} h={200} style={{display: 'flex', alignItems: 'center', gap: 28, padding: '0 40px'}}>
			<div style={{width: 104, height: 104, borderRadius: 52, background: cor + '24', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
				<Ic size={60} color={cor} strokeWidth={2.6} />
			</div>
			<div style={{flex: 1}}>
				<Rot size={34}>{entrada ? 'Entrou' : 'Saiu'}</Rot>
				<div style={{fontWeight: 500, fontSize: 28, color: C.gray}}>{entrada ? 'Salário de outubro' : 'Contas, cartão e investimento'}</div>
			</div>
			<div style={{fontFamily: FD, fontWeight: 800, fontSize: 76, color: cor, whiteSpace: 'nowrap'}}>{entrada ? '+ R$ 4.800' : '− R$ 3.810'}</div>
		</Card6>
	);
};
const CartaoSobra: React.FC<{f: number}> = ({f}) => {
	const v = 990 * tw(f, [T6.popSobra + 2, T6.popSobra + 10], [0, 1], E.out);
	const luz = tw(f, [T6.popSobra + 6, T6.popSobra + 12], [0, 1]);
	return (
		<Card6 w={900} h={300}>
			<Rot cor={C.red} size={36}>
				Sobra no mês
			</Rot>
			<div style={{marginTop: 6, textShadow: luz > 0 ? `0 0 ${40 * luz}px rgba(255,77,77,${0.45 * luz})` : undefined}}>
				<Grande valor={`R$ ${brl(v)}`} size={170} />
			</div>
		</Card6>
	);
};

const sub = (r: Rect, x: number, y: number, w: number, h: number): Rect => ({x: r.x + x, y: r.y + y, w, h});
export const CenasAcima: React.FC<{f: number}> = ({f}) => (
	<>
		<Salto f={f} id="s1" at={T6.pop1} de={RE.historico3m} cx={540} cy={900} w={900} h={360} sai={T6.p1 - 10}>
			<CartaoGancho />
		</Salto>
		{SEMANAS.map((_, i) => (
			<Salto key={i} f={f} id={`s2${i}`} at={T6.semanas[i]} de={RE.semanas[i]} cx={540} cy={560 + i * 220} w={940} h={190} sai={T6.p2 - 16 + i * 2}>
				<CartaoSemana i={i} />
			</Salto>
		))}
		<Salto f={f} id="s3a" at={T6.popSeries} de={RE.series} cx={540} cy={760} w={900} h={250} sai={T6.p3 - 12}>
			<CartaoSeries f={f} />
		</Salto>
		<Salto f={f} id="s3b" at={T6.popReps} de={RE.reps} cx={540} cy={1090} w={900} h={330} sai={T6.p3 - 10}>
			<CartaoReps f={f} />
		</Salto>
		<Salto f={f} id="s4a" at={T6.popAviso} de={RE.aviso} cx={540} cy={720} w={940} h={330} sai={T6.popRM - 8}>
			<CartaoAviso />
		</Salto>
		<Salto f={f} id="s4b" at={T6.popRecorde} de={RE.recorde} cx={540} cy={1080} w={940} h={180} sai={T6.p4 - 12} mov={[[T6.popRM - 5, -500]]}>
			<CartaoRecorde />
		</Salto>
		<Salto f={f} id="s4c" at={T6.popRM} de={RE.rm} cx={540} cy={1060} w={940} h={470} sai={T6.p4 - 10}>
			<CartaoRM f={f} />
		</Salto>
		<Salto f={f} id="s5" at={T6.popGrafico} de={RE.grafico} cx={540} cy={940} w={960} h={780} sai={T6.tela6 - 4}>
			<CartaoGrafico f={f} />
		</Salto>
		<Salto f={f} id="s6" at={T6.popCardio} de={RE.cardio} cx={540} cy={960} w={920} h={560} sai={T6.p5 - 10}>
			<CartaoCardio f={f} />
		</Salto>
		<Salto f={f} id="s7" at={T6.popSeq} de={RE.sequencia} cx={540} cy={960} w={920} h={320} sai={T6.p6 - 10}>
			<CartaoSequencia f={f} />
		</Salto>
		<Salto f={f} id="s8a" at={T6.popEntra} de={sub(RE.resumo, 16, 14, 160, 70)} cx={540} cy={620} w={900} h={200} sai={T6.p7 - 9}>
			<CartaoMov entrada />
		</Salto>
		<Salto f={f} id="s8b" at={T6.popSai} de={sub(RE.resumo, 178, 14, 160, 70)} cx={540} cy={860} w={900} h={200} sai={T6.p7 - 7}>
			<CartaoMov entrada={false} />
		</Salto>
		<Salto f={f} id="s8c" at={T6.popSobra} de={sub(RE.resumo, 16, 124, 320, 64)} cx={540} cy={1160} w={900} h={300} sai={T6.p7 - 5}>
			<CartaoSobra f={f} />
		</Salto>
	</>
);

// ============================================================ CTA e marca (depois que o celular sai)
const CTA = {w: 760, h: 170};
const ALVO_CURSOR = {x: 540 + 270, y: 960 + 30};
const BotaoCta: React.FC<{f: number}> = ({f}) => {
	if (f < T6.cta || f > T6.ctaSai + 8) return null;
	const k = tw(f, [T6.cta, T6.cta + 9], [0, 1], E.out);
	const k0 = tw(f - 1, [T6.cta, T6.cta + 9], [0, 1], E.out);
	const x = (1 - k) * 1100;
	const out = tw(f, [T6.ctaSai, T6.ctaSai + 7], [0, 1], E.in);
	const afunda = f >= T6.clica ? Math.sin(Math.PI * Math.min(1, (f - T6.clica) / 8)) : 0;
	const brilho = tw(f, [T6.clica, T6.clica + 4], [0, 1]) * (1 - tw(f, [T6.clica + 8, T6.clica + 22], [0, 1]));
	const onda = f >= T6.clica ? (f - T6.clica) / 16 : -1;
	return (
		<>
			<Borrao6 id="cta" dx={(k - k0) * -1100} dy={0} k={0.3} max={40}>
				<div style={{position: 'absolute', left: (LARG6 - CTA.w) / 2 + x, top: (ALT6 - CTA.h) / 2, transform: `scale(${1 - 0.6 * out})`, opacity: 1 - out}}>
					<Pilula w={CTA.w} h={CTA.h} texto="Baixe agora" size={84} afunda={afunda} brilho={brilho} />
				</div>
			</Borrao6>
			{onda >= 0 && onda <= 1 && out < 1 ? (
				<div style={{position: 'absolute', left: ALVO_CURSOR.x - 20 - 120 * onda, top: ALVO_CURSOR.y - 20 - 120 * onda, width: 40 + 240 * onda, height: 40 + 240 * onda, borderRadius: '50%', border: `${4 * (1 - onda) + 1}px solid rgba(255,255,255,${0.7 * (1 - onda)})`}} />
			) : null}
			{out < 1 ? (
				<div style={{opacity: 1 - out}}>
					<Cursor f={f} de={{x: LARG6 + 140, y: ALT6 + 140}} para={ALVO_CURSOR} chega={T6.clica - 4} clica={T6.clica} size={104} />
				</div>
			) : null}
		</>
	);
};

const Final: React.FC<{f: number}> = ({f}) => {
	if (f < T6.logo) return null;
	const size = 118;
	const wl = larguraLogo(size);
	const pulso = f >= T6.batida ? Math.sin(Math.PI * Math.min(1, (f - T6.batida) / 10)) * Math.exp(-(f - T6.batida) / 12) : 0;
	const ks = tw(f, [T6.bio, T6.bio + 12], [0, 1], E.out);
	return (
		<>
			<div style={{position: 'absolute', left: (LARG6 - wl) / 2, top: ALT6 / 2 - size / 2 - 40, transform: `scale(${1 + 0.05 * pulso + 0.03 * tw(f, [T6.logo + 20, 1150], [0, 1], E.soft)})`, transformOrigin: '50% 50%'}}>
				<Logo f={f} at={T6.logo} size={size} />
			</div>
			{ks > 0 ? (
				<div style={{position: 'absolute', left: 0, width: LARG6, top: 1080 + (1 - ks) * 860, textAlign: 'center', fontFamily: F, fontWeight: 500, fontSize: 42, color: C.gray, opacity: ks}}>
					Baixe pelo link na bio
				</div>
			) : null}
		</>
	);
};

export const CenasAbaixo: React.FC<{f: number}> = ({f}) => (
	<>
		<Frases f={f} />
		<BotaoCta f={f} />
		<Final f={f} />
	</>
);
