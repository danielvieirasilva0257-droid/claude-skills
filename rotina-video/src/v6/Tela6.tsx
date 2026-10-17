import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ArrowDownRight, ArrowUpRight, BatteryCharging, Bike, Dumbbell, Flame, Footprints, Minus, Plus, Trophy, Zap} from 'lucide-react';
import {c, display} from '../theme';
import {Card, Label} from '../screens/ui';
import {CheckDesenhado, Cabeca, Pilulas, S, TAB_Y, Tela, Toque, UI_H, UI_W, press, sobe, tabX} from '../v3/Tela';
import {E, M, sp, tw} from '../v3/theme';
import {RE, Rect, T6} from './plano6';

// Telas do app Rotina para a tela do celular do Blender no v6 (sequencia JPEG 1080 x 2309 = area ativa do premium.py).
// Mesmo visual do app real (fundo #080808, vermelho, Barlow, estilos de treino com a cor e o icone do app).
// Os elementos que saltam para o 2D ficam nos retangulos de plano6.ts (RE), para o salto sair do lugar certo.

// icone de forca do app (o mesmo desenho do lucide "biceps flexed", que o app usa)
export const Biceps: React.FC<{size?: number; color?: string; strokeWidth?: number}> = ({size = 24, color = 'currentColor', strokeWidth = 2}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
		<path d="M12.409 13.017A5 5 0 0 1 22 15c0 3.866-4 7-9 7-4.077 0-8.153-.82-10.371-2.462-.426-.316-.631-.832-.62-1.362C2.118 12.723 2.627 2 10 2a3 3 0 0 1 3 3 2 2 0 0 1-2 2c-1.105 0-1.64-.444-2-1" />
		<path d="M15 14a5 5 0 0 0-7.584 2" />
		<path d="M9.964 6.825C8.019 7.977 9.5 13 8 15" />
	</svg>
);

// estilos de treino do app (nome, faixa de repeticoes, cor e icone)
export const ESTILOS = {
	hiper: {nome: 'Hipertrofia', reps: '8–12', cor: '#FB923C', Icone: Dumbbell},
	forca: {nome: 'Força', reps: '6–8', cor: '#FF5A5A', Icone: Biceps},
	potencia: {nome: 'Potência', reps: '3–5', cor: '#A78BFA', Icone: Zap},
	deload: {nome: 'Deload', reps: '8–10', cor: '#60A5FA', Icone: BatteryCharging},
};
export const SEMANAS = [
	{n: 1, datas: '06–12 out', plano: 'ABCDE', e: ESTILOS.hiper},
	{n: 2, datas: '13–19 out', plano: 'ABCDE', e: ESTILOS.forca},
	{n: 3, datas: '20–26 out', plano: 'Upper/Lower', e: ESTILOS.potencia},
	{n: 4, datas: '27 out–02 nov', plano: 'Upper/Lower', e: ESTILOS.deload},
];
// historico do supino (carga por semana): 70 kg ha 3 meses -> 80 kg hoje
export const CARGAS = [70, 70, 72.5, 72.5, 72.5, 75, 75, 77.5, 77.5, 77.5, 80, 80];
export const MESES = [
	{m: 'Jul', kg: 70},
	{m: 'Ago', kg: 72.5},
	{m: 'Set', kg: 77.5},
	{m: 'Out', kg: 80},
];
const kg = (v: number) => v.toLocaleString('pt-BR', {maximumFractionDigits: 1});

const Abs: React.FC<{r: Rect; children: React.ReactNode; style?: React.CSSProperties}> = ({r, children, style}) => (
	<div style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, boxSizing: 'border-box', ...style}}>{children}</div>
);
const Chip: React.FC<{cor: string; children: React.ReactNode}> = ({cor, children}) => (
	<span style={{display: 'inline-flex', alignItems: 'center', gap: 5, height: 24, padding: '0 9px', borderRadius: 8, fontSize: 12, fontWeight: 700, color: cor, background: cor + '22', whiteSpace: 'nowrap'}}>{children}</span>
);
const caixa: React.CSSProperties = {background: c.s2, border: `1px solid ${c.border}`, borderRadius: 14};

// ---------------------------------------------------------------- 1) historico do supino (gancho)
const Historico: React.FC<{f: number; desde: number}> = ({f, desde}) => {
	const rows = [
		['Há 1 semana', '77,5 kg × 12'],
		['Há 1 mês', '75 kg × 12'],
		['Há 2 meses', '72,5 kg × 10'],
		['Há 3 meses', '70 kg × 10'],
	];
	const marca = tw(f, [T6.pop1 - 10, T6.pop1 - 4], [0, 1], E.ui);
	return (
		<Tela tab={1} f={f}>
			<Cabeca kicker="Treinos · Progresso" title="Supino Reto" />
			<Pilulas items={['Treino', 'Planejar', 'Progresso', 'Cardio']} active={2} />
			<Abs r={{x: 18, y: 172, w: 354, h: 92}} style={{...caixa, padding: '12px 14px', ...sobe(f, desde + 2)}}>
				<Label style={{marginBottom: 4}}>Última sessão</Label>
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
					<span style={{fontFamily: display, fontSize: 30, fontWeight: 700, fontVariantNumeric: 'tabular-nums'}}>77,5 kg × 12</span>
					<Chip cor={ESTILOS.hiper.cor}>Hipertrofia · 8–12</Chip>
				</div>
			</Abs>
			<div style={{position: 'absolute', left: 18, top: 284}}>
				<Label>Histórico</Label>
			</div>
			{rows.map(([q, v], i) => (
				<Abs key={q} r={{x: 18, y: 306 + i * 70, w: 354, h: 60}} style={{...caixa, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', borderColor: i === 3 && marca > 0 ? `rgba(255,90,90,${0.3 + 0.5 * marca})` : c.border, ...sobe(f, desde + 4 + i * 2)}}>
					<span style={{fontSize: 15, fontWeight: 600, color: c.muted}}>{q}</span>
					<span style={{fontFamily: display, fontSize: 22, fontWeight: 700, fontVariantNumeric: 'tabular-nums'}}>{v}</span>
				</Abs>
			))}
		</Tela>
	);
};

// ---------------------------------------------------------------- 2) planejar: um estilo por semana
const Planejar: React.FC<{f: number; desde: number}> = ({f, desde}) => (
	<Tela tab={1} f={f}>
		<Cabeca kicker="Treinos · Outubro" title="Planejar" />
		<Pilulas items={['Treino', 'Planejar', 'Progresso', 'Cardio']} active={1} />
		{SEMANAS.map((s, i) => {
			const acende = sp(f, T6.semanas[i] - 2, M.pop);
			return (
				<Abs key={s.n} r={RE.semanas[i]} style={{...caixa, display: 'flex', alignItems: 'center', gap: 12, padding: '0 12px', borderColor: f >= T6.semanas[i] - 2 ? s.e.cor + 'AA' : c.border, ...sobe(f, desde + 3 + i * 2)}}>
					<div style={{width: 46, height: 46, borderRadius: 12, background: s.e.cor + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + 0.1 * Math.sin(Math.PI * Math.min(1, acende))})`}}>
						<s.e.Icone size={24} color={s.e.cor} strokeWidth={2.2} />
					</div>
					<div style={{flex: 1, minWidth: 0}}>
						<div style={{fontSize: 12, fontWeight: 600, color: c.muted}}>
							Semana {s.n} · {s.datas}
						</div>
						<div style={{fontFamily: display, fontSize: 21, fontWeight: 700, textTransform: 'uppercase', color: s.e.cor}}>{s.e.nome}</div>
					</div>
					<div style={{textAlign: 'right'}}>
						<div style={{fontSize: 12, color: c.muted}}>{s.plano}</div>
						<div style={{fontFamily: display, fontSize: 17, fontWeight: 700}}>{s.e.reps} reps</div>
					</div>
				</Abs>
			);
		})}
		<Abs r={{x: 18, y: 518, w: 354, h: 92}} style={{...caixa, padding: '10px 12px', ...sobe(f, desde + 12)}}>
			<Label style={{marginBottom: 8}}>Esta semana · ABCDE</Label>
			<div style={{display: 'flex', gap: 5}}>
				{[
					['Seg', 'Peito'],
					['Ter', 'Costas'],
					['Qua', 'Perna'],
					['Qui', 'Ombro'],
					['Sex', 'Braço'],
					['Sáb', '·'],
					['Dom', '·'],
				].map(([d, t], i) => (
					<div key={d} style={{flex: 1, borderRadius: 9, padding: '6px 0', textAlign: 'center', background: t === '·' ? c.s3 : 'rgba(251,146,60,0.15)', border: `1.5px solid ${i === 0 ? ESTILOS.hiper.cor : 'transparent'}`}}>
						<div style={{fontSize: 11, color: c.muted, fontWeight: 600}}>{d}</div>
						<div style={{fontFamily: display, fontSize: 12, fontWeight: 700, color: t === '·' ? c.faint : ESTILOS.hiper.cor}}>{t}</div>
					</div>
				))}
			</div>
		</Abs>
	</Tela>
);

// ---------------------------------------------------------------- 3) treino do dia: checklist dos exercicios
const EXERCICIOS = ['Supino Reto', 'Supino Inclinado Halteres', 'Crucifixo Máquina', 'Crossover'];
const Treino: React.FC<{f: number; desde: number; tudo?: boolean; tapTab?: number}> = ({f, desde, tudo, tapTab}) => {
	const feitos = tudo ? 4 : T6.checks.filter((t) => f >= t + 2).length;
	const tocaChip = tudo ? 1 : press(f, T6.tocaEstilo);
	return (
		<Tela tab={1} f={f} tapTab={tapTab}>
			<Cabeca kicker="Segunda · Semana 1" title="Treino de Peito" />
			<Pilulas items={['Treino', 'Planejar', 'Progresso', 'Cardio']} active={0} />
			<div style={{position: 'absolute', left: 18, top: 172, right: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
				<span style={{position: 'relative', transform: `scale(${tocaChip})`}}>
					<Chip cor={ESTILOS.hiper.cor}>
						<Dumbbell size={13} /> Hipertrofia · 8–12
					</Chip>
					{!tudo ? <Toque f={f} at={T6.tocaEstilo} x="50%" y="50%" /> : null}
				</span>
				<span style={{fontFamily: display, fontSize: 18, fontWeight: 700, color: feitos === 4 ? c.green : c.muted, fontVariantNumeric: 'tabular-nums'}}>{feitos}/4 feitos</span>
			</div>
			{EXERCICIOS.map((e, i) => {
				const t = T6.checks[i];
				const fill = tudo ? 1 : tw(f, [t, t + 6], [0, 1], E.ui);
				const chk = tudo ? 1 : tw(f, [t + 3, t + 12], [0, 1], E.ui);
				const k = tudo ? 1 : press(f, t);
				return (
					<Abs key={e} r={{x: 18, y: 214 + i * 72, w: 354, h: 62}} style={{...caixa, display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px', borderColor: fill > 0.5 ? 'rgba(204,0,0,0.55)' : c.border, ...sobe(f, desde + 3 + i * 2)}}>
						<div style={{position: 'relative', width: 28, height: 28, borderRadius: 9, border: `2px solid ${fill > 0.3 ? c.red : c.border}`, background: `rgba(204,0,0,${fill})`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${k})`}}>
							{chk > 0 ? <CheckDesenhado k={chk} /> : null}
							{!tudo ? <Toque f={f} at={t} x="50%" y="50%" /> : null}
						</div>
						<span style={{flex: 1, fontSize: 15, fontWeight: 600, color: fill > 0.5 ? c.muted : c.text}}>{e}</span>
						<span style={{fontSize: 13, color: c.muted}}>3 × 8–12</span>
					</Abs>
				);
			})}
			<Abs r={{x: 18, y: 512, w: 354, h: 48}} style={{borderRadius: 12, background: feitos === 4 ? c.greenBg : c.red, border: feitos === 4 ? '1px solid rgba(52,211,153,0.4)' : 'none', color: feitos === 4 ? c.green : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15}}>
				{feitos === 4 ? 'Treino concluído' : 'Concluir treino'}
			</Abs>
		</Tela>
	);
};

// ---------------------------------------------------------------- 4) editor do estilo: repeticoes e series
const Passo: React.FC<{f: number; v: string; tapMais?: number; cor: string; size?: number}> = ({f, v, tapMais, cor, size = 30}) => (
	<div style={{display: 'flex', alignItems: 'center', gap: 8}}>
		<div style={{width: 34, height: 34, borderRadius: 10, background: c.s3, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.muted}}>
			<Minus size={16} />
		</div>
		<span style={{minWidth: 34, textAlign: 'center', fontFamily: display, fontSize: size, fontWeight: 700, color: cor, fontVariantNumeric: 'tabular-nums'}}>{v}</span>
		<div style={{position: 'relative', width: 34, height: 34, borderRadius: 10, background: c.s3, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.text, transform: `scale(${tapMais ? press(f, tapMais) : 1})`}}>
			<Plus size={16} />
			{tapMais ? <Toque f={f} at={tapMais} x="50%" y="50%" /> : null}
		</div>
	</div>
);
const Estilo: React.FC<{f: number; desde: number}> = ({f, desde}) => {
	const cor = ESTILOS.hiper.cor;
	const series = f >= T6.maisSerie ? '4' : '3';
	const min = f >= T6.maisReps ? '10' : '8';
	return (
		<Tela tab={1} f={f}>
			<div style={{marginBottom: 14}}>
				<div style={{fontFamily: display, fontSize: 13, fontWeight: 600, color: c.muted, textTransform: 'uppercase', letterSpacing: '0.12em'}}>Estilo de treino</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 8, fontFamily: display, fontSize: 34, fontWeight: 700, textTransform: 'uppercase', lineHeight: 1.05, color: cor}}>
					<Dumbbell size={28} strokeWidth={2.4} /> Hipertrofia
				</div>
			</div>
			<Abs r={RE.reps} style={{...caixa, padding: '12px 14px', ...sobe(f, desde + 2)}}>
				<Label style={{marginBottom: 10}}>Repetições</Label>
				<div style={{display: 'flex', justifyContent: 'space-between'}}>
					<div>
						<div style={{fontSize: 12, color: c.muted, marginBottom: 4}}>Mínimo</div>
						<Passo f={f} v={min} tapMais={T6.maisReps} cor={cor} />
					</div>
					<div>
						<div style={{fontSize: 12, color: c.muted, marginBottom: 4}}>Máximo</div>
						<Passo f={f} v="12" cor={cor} />
					</div>
				</div>
			</Abs>
			<Abs r={RE.series} style={{...caixa, padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...sobe(f, desde + 4)}}>
				<div>
					<Label style={{marginBottom: 4}}>Séries</Label>
					<div style={{fontSize: 13, color: c.muted}}>por exercício</div>
				</div>
				<Passo f={f} v={series} tapMais={T6.maisSerie} cor={cor} />
			</Abs>
			<Abs r={{x: 18, y: 370, w: 354, h: 112}} style={{...caixa, padding: '12px 14px', ...sobe(f, desde + 6)}}>
				<Label style={{marginBottom: 10}}>Volume e carga</Label>
				<div style={{display: 'flex', gap: 6}}>
					{['Normal', 'Volume reduzido', 'Deload'].map((t, i) => (
						<span key={t} style={{height: 34, padding: '0 11px', borderRadius: 17, display: 'flex', alignItems: 'center', fontSize: 13, fontWeight: i === 0 ? 600 : 500, border: `1px solid ${i === 0 ? cor : c.border}`, background: i === 0 ? cor + '22' : 'transparent', color: i === 0 ? c.text : c.muted}}>
							{t}
						</span>
					))}
				</div>
				<div style={{fontSize: 12, color: c.muted, marginTop: 8}}>Séries e carga normais.</div>
			</Abs>
			<div style={{position: 'absolute', left: 18, right: 18, top: 498, fontSize: 13, color: c.muted, lineHeight: 1.5, ...sobe(f, desde + 8)}}>Foco em ganho de massa. Descanso de 60 a 90 segundos.</div>
		</Tela>
	);
};

// ---------------------------------------------------------------- 5) registro: series do supino, aviso de carga e recorde
const digita = (f: number, at: number, v: string) => (f < at ? '' : v.slice(0, Math.max(0, Math.min(v.length, Math.floor((f - at) / 2) + 1))));
const Registro: React.FC<{f: number; desde: number}> = ({f, desde}) => {
	const repsAt = [T6.doze - 9, T6.doze - 4, T6.doze + 1];
	const salva = T6.popRecorde - 6;
	const aviso = tw(f, [T6.popAviso - 10, T6.popAviso - 4], [0, 1], E.ui);
	const toast = tw(f, [T6.popRecorde - 3, T6.popRecorde + 3], [0, 1], E.ui);
	return (
		<Tela tab={1} f={f}>
			<div style={{marginBottom: 12}}>
				<div style={{fontFamily: display, fontSize: 13, fontWeight: 600, color: c.muted, letterSpacing: '0.12em', textTransform: 'uppercase'}}>Treino de Peito · Exercício 1/4</div>
				<div style={{fontFamily: display, fontSize: 34, fontWeight: 700, textTransform: 'uppercase', lineHeight: 1.05}}>Supino Reto</div>
				<div style={{display: 'flex', gap: 6, marginTop: 6}}>
					<Chip cor={ESTILOS.hiper.cor}>Hipertrofia · 8–12</Chip>
					<Chip cor={c.muted}>Última: 77,5 kg × 12</Chip>
				</div>
			</div>
			<Abs r={{x: 18, y: 150, w: 354, h: 196}} style={{...caixa, padding: '12px 14px', ...sobe(f, desde + 2)}}>
				<div style={{display: 'grid', gridTemplateColumns: '50px 1fr 1fr', fontSize: 12, color: c.muted, fontWeight: 600, marginBottom: 8}}>
					<span>Série</span>
					<span>Carga</span>
					<span>Reps</span>
				</div>
				{[0, 1, 2].map((i) => {
					const r = digita(f, repsAt[i], '12');
					const ativo = f >= repsAt[i] - 2 && f < repsAt[i] + 6;
					const ok = r === '12';
					return (
						<div key={i} style={{display: 'grid', gridTemplateColumns: '50px 1fr 1fr', gap: 8, marginBottom: 8}}>
							<div style={{fontFamily: display, fontSize: 20, fontWeight: 700, color: ok ? c.green : c.faint, alignSelf: 'center'}}>{i + 1}</div>
							<div style={{height: 40, borderRadius: 10, background: c.s3, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', padding: '0 12px', fontFamily: display, fontSize: 20, fontWeight: 700}}>80 kg</div>
							<div style={{height: 40, borderRadius: 10, background: ok ? 'rgba(52,211,153,0.14)' : c.s3, border: `1px solid ${ativo ? c.redHi : ok ? 'rgba(52,211,153,0.5)' : c.border}`, display: 'flex', alignItems: 'center', padding: '0 12px', fontFamily: display, fontSize: 20, fontWeight: 700, color: ok ? c.green : c.text}}>
								{r}
								{ativo ? <span style={{width: 2, height: 20, background: c.redHi, marginLeft: 2}} /> : null}
							</div>
						</div>
					);
				})}
			</Abs>
			{aviso > 0 ? (
				<Abs r={RE.aviso} style={{borderRadius: 14, background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.45)', padding: '10px 14px', opacity: aviso, transform: `translateY(${(1 - aviso) * 10}px)`}}>
					<div style={{fontSize: 13, color: c.text, lineHeight: 1.35}}>Você chegou em 12 repetições em todas as séries.</div>
					<div style={{display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontFamily: display, fontSize: 20, fontWeight: 700, color: c.green, textTransform: 'uppercase'}}>
						<ArrowUpRight size={18} /> Aumente a carga (+2,5 kg)
					</div>
				</Abs>
			) : null}
			<Abs r={{x: 18, y: 456, w: 354, h: 48}} style={{borderRadius: 12, background: c.red, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, transform: `scale(${press(f, salva)})`}}>
				Salvar treino
				<Toque f={f} at={salva} x="50%" y="50%" />
			</Abs>
			<Abs r={{x: 18, y: 520, w: 354, h: 96}} style={{...caixa, padding: '12px 14px'}}>
				<Label style={{marginBottom: 4}}>1RM estimado</Label>
				<span style={{fontFamily: display, fontSize: 30, fontWeight: 700}}>{f >= T6.popRecorde ? '112' : '108,5'} kg</span>
			</Abs>
			{toast > 0 ? (
				<Abs r={RE.recorde} style={{borderRadius: 14, background: c.s3, border: '1px solid rgba(251,191,36,0.6)', display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', opacity: toast, transform: `translateY(${(1 - toast) * 16}px)`}}>
					<Trophy size={22} color={c.amber} />
					<span style={{fontSize: 15, fontWeight: 600}}>
						Novo recorde! 1RM estimado <b style={{color: c.amber}}>112 kg</b>
					</span>
				</Abs>
			) : null}
		</Tela>
	);
};

// ---------------------------------------------------------------- 6) progresso: grafico do supino (semanas e meses)
export const pontosGrafico = (meses: boolean, w: number, h: number) => {
	const vals = meses ? MESES.map((m) => m.kg) : CARGAS;
	return vals.map((v, i) => [(i / (vals.length - 1)) * w, h - ((v - 66) / 16) * h] as [number, number]);
};
const Grafico: React.FC<{f: number; desde: number}> = ({f, desde}) => {
	const CW = 322;
	const CH = 150;
	const meses = f >= T6.meses;
	const pts = pontosGrafico(meses, CW, CH);
	const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
	const draw = meses ? tw(f, [T6.meses, T6.meses + 14], [0, 1], E.lin) : tw(f, [desde + 8, desde + 30], [0, 1], E.lin);
	return (
		<Tela tab={1} f={f}>
			<Cabeca kicker="Progresso · Supino Reto" title="Evolução" />
			<Pilulas items={['Treino', 'Planejar', 'Progresso', 'Cardio']} active={2} />
			<Abs r={RE.grafico} style={{...caixa, padding: '12px 16px', ...sobe(f, desde + 2)}}>
				<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
					<Label style={{marginBottom: 0}}>Carga · {meses ? 'por mês' : 'por semana'}</Label>
					<div style={{display: 'flex', background: c.s3, borderRadius: 10, padding: 2}}>
						{['Semanas', 'Meses'].map((t, i) => (
							<span key={t} style={{padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700, background: (i === 1) === meses ? c.s2 : 'transparent', color: (i === 1) === meses ? c.text : c.muted}}>
								{t}
							</span>
						))}
					</div>
				</div>
				<svg width={CW} height={CH + 8} style={{overflow: 'visible'}}>
					{[0, 0.5, 1].map((g) => (
						<line key={g} x1={0} x2={CW} y1={CH * g} y2={CH * g} stroke={c.border} strokeWidth={1} />
					))}
					<path d={d} fill="none" stroke={c.redHi} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
					{pts.map((p, i) => (draw >= i / (pts.length - 1) ? <circle key={i} cx={p[0]} cy={p[1]} r={3.5} fill={c.redHi} /> : null))}
				</svg>
			</Abs>
			<Abs r={{x: 18, y: 480, w: 354, h: 74}} style={{...caixa, display: 'flex', justifyContent: 'space-around', alignItems: 'center', ...sobe(f, desde + 6)}}>
				{[
					['Carga total', '18,4 t'],
					['Recordes', '3'],
					['RPE médio', '8'],
				].map(([a, b]) => (
					<div key={a} style={{textAlign: 'center'}}>
						<div style={{fontSize: 12, color: c.muted}}>{a}</div>
						<div style={{fontFamily: display, fontSize: 22, fontWeight: 700}}>{b}</div>
					</div>
				))}
			</Abs>
		</Tela>
	);
};

// ---------------------------------------------------------------- 7) cardio: meta da semana
const Cardio: React.FC<{f: number; desde: number}> = ({f, desde}) => {
	const R = 46;
	const circ = 2 * Math.PI * R;
	const k = tw(f, [desde + 6, T6.falta], [0, 0.8], E.out);
	return (
		<Tela tab={1} f={f}>
			<Cabeca kicker="Treinos · Cardio" title="Semana 3" />
			<Pilulas items={['Treino', 'Planejar', 'Progresso', 'Cardio']} active={3} />
			<Abs r={RE.cardio} style={{...caixa, display: 'flex', alignItems: 'center', gap: 16, padding: '0 16px'}}>
				<div style={{position: 'relative', width: 108, height: 108}}>
					<svg width={108} height={108} style={{transform: 'rotate(-90deg)'}}>
						<circle cx={54} cy={54} r={R} fill="none" stroke={c.track} strokeWidth={9} />
						<circle cx={54} cy={54} r={R} fill="none" stroke={c.blue} strokeWidth={9} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - k)} />
					</svg>
					<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
						<span style={{fontFamily: display, fontSize: 26, fontWeight: 700, lineHeight: 1}}>{Math.round(150 * k)}</span>
						<span style={{fontSize: 12, color: c.muted}}>min</span>
					</div>
				</div>
				<div>
					<div style={{fontSize: 13, color: c.muted}}>Meta: 150 min na semana</div>
					<div style={{fontFamily: display, fontSize: 26, fontWeight: 700}}>Faltam {150 - Math.round(150 * k)} min</div>
					<div style={{fontSize: 13, color: c.muted}}>4 sessões nesta semana</div>
				</div>
			</Abs>
			{[
				['Esteira', '30 min · 4,4 km', Footprints],
				['Bike', '40 min · 13,5 km', Bike],
				['Corrida', '28 min · 5 km', Footprints],
				['Esteira', '22 min · 3,2 km', Footprints],
			].map(([a, b, Ic], i) => {
				const I = Ic as typeof Bike;
				return (
					<Abs key={i} r={{x: 18, y: 336 + i * 66, w: 354, h: 56}} style={{...caixa, display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px', ...sobe(f, desde + 4 + i * 2)}}>
						<I size={20} color={c.blue} />
						<span style={{flex: 1, fontSize: 15, fontWeight: 600}}>{a as string}</span>
						<span style={{fontSize: 13, color: c.muted}}>{b as string}</span>
					</Abs>
				);
			})}
		</Tela>
	);
};

// ---------------------------------------------------------------- 8) habitos de hoje (o outro checklist) e a sequencia
const HABITOS = ['Beber 3L de água', 'Dieta', 'Ler 10 páginas', 'Treinar', 'Meditar 10 min'];
const Habitos: React.FC<{f: number; desde: number; tudo?: boolean; tapTab?: number}> = ({f, desde, tudo, tapTab}) => {
	const feitos = tudo ? 4 : T6.habTaps.filter((t) => f >= t + 2).length + 1;
	const subiu = tudo || f >= T6.sobe;
	const pop = tudo ? 0 : sp(f, T6.sobe, M.pop);
	const popK = Math.sin(Math.PI * Math.min(1, pop));
	return (
		<Tela tab={0} f={f} tapTab={tapTab}>
			<Cabeca kicker="Segunda · 6 de outubro" title="Hábitos de hoje" />
			<Abs r={RE.sequencia} style={{...caixa, display: 'flex', alignItems: 'center', gap: 14, padding: '0 14px'}}>
				<div style={{position: 'relative', width: 72, height: 72}}>
					<svg width={72} height={72} style={{transform: 'rotate(-90deg)'}}>
						<circle cx={36} cy={36} r={32.5} fill="none" stroke={c.track} strokeWidth={7} />
						<circle cx={36} cy={36} r={32.5} fill="none" stroke={c.redHi} strokeWidth={7} strokeLinecap="round" strokeDasharray={2 * Math.PI * 32.5} strokeDashoffset={2 * Math.PI * 32.5 * (1 - Math.min(5, feitos) / 5)} />
					</svg>
					<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display, fontSize: 22, fontWeight: 700}}>{Math.min(5, feitos)}/5</div>
				</div>
				<div>
					<Label>Sequência</Label>
					<div style={{display: 'flex', alignItems: 'center', gap: 6}}>
						<Flame size={24} color={c.amber} fill={c.amber} style={{transform: `scale(${1 + 0.3 * popK})`, transformOrigin: '50% 90%'}} />
						<span style={{fontFamily: display, fontSize: 32, fontWeight: 800, color: c.amber, transform: `scale(${1 + 0.18 * popK})`, display: 'inline-block'}}>{subiu ? 13 : 12}</span>
						<span style={{fontSize: 14, color: c.muted}}>dias seguidos</span>
					</div>
				</div>
			</Abs>
			{HABITOS.map((h, i) => {
				const t = i === 0 ? -99 : T6.habTaps[i - 1];
				const on = tudo || i === 0 || f >= t;
				const fill = tudo || i === 0 ? 1 : tw(f, [t, t + 6], [0, 1], E.ui);
				const chk = tudo || i === 0 ? 1 : tw(f, [t + 3, t + 12], [0, 1], E.ui);
				return (
					<Abs key={h} r={{x: 18, y: 232 + i * 62, w: 354, h: 54}} style={{...caixa, display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px', borderColor: fill > 0.5 ? 'rgba(204,0,0,0.55)' : c.border, ...sobe(f, desde + 3 + i * 2)}}>
						<div style={{position: 'relative', width: 28, height: 28, borderRadius: 9, border: `2px solid ${fill > 0.3 ? c.red : c.border}`, background: `rgba(204,0,0,${fill})`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${tudo || i === 0 ? 1 : press(f, t)})`}}>
							{chk > 0 ? <CheckDesenhado k={chk} /> : null}
							{!tudo && i > 0 ? <Toque f={f} at={t} x="50%" y="50%" /> : null}
						</div>
						<span style={{fontSize: 16, fontWeight: 600, color: on ? c.muted : c.text}}>{h}</span>
					</Abs>
				);
			})}
		</Tela>
	);
};

// ---------------------------------------------------------------- 9) financeiro: entrou, saiu, sobra
const Financeiro: React.FC<{f: number; desde: number; tapTab?: number}> = ({f, desde, tapTab}) => (
	<Tela tab={2} f={f} tapTab={tapTab}>
		<Cabeca kicker="Financeiro · Outubro" title="Visão" />
		<Pilulas items={['Visão', 'Transações', 'Cartões', 'Rendas']} active={0} />
		<Abs r={RE.resumo} style={{...caixa, padding: '14px 16px', ...sobe(f, desde + 2)}}>
			<div style={{display: 'flex', gap: 10}}>
				{[
					['Entrou', 'R$ 4.800', c.green, ArrowUpRight],
					['Saiu', 'R$ 3.810', c.redHi, ArrowDownRight],
				].map(([a, b, cor, Ic]) => {
					const I = Ic as typeof ArrowUpRight;
					return (
						<div key={a as string} style={{flex: 1, background: c.s3, borderRadius: 12, padding: '10px 12px'}}>
							<div style={{display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: c.muted}}>
								<I size={14} color={cor as string} /> {a as string}
							</div>
							<div style={{fontFamily: display, fontSize: 24, fontWeight: 700, color: cor as string}}>{b as string}</div>
						</div>
					);
				})}
			</div>
			<div style={{display: 'flex', gap: 4, height: 8, marginTop: 14}}>
				{[1300, 1890, 120, 500, 990].map((v, i) => (
					<div key={i} style={{flex: v, borderRadius: 4, background: [c.purple, c.pink, c.blue, c.green, c.redHi][i]}} />
				))}
			</div>
			<div style={{marginTop: 12, fontSize: 13, color: c.muted}}>Sobra no mês</div>
			<div style={{fontFamily: display, fontSize: 36, fontWeight: 800, lineHeight: 1.05}}>R$ 990,00</div>
		</Abs>
		{[
			['Salário', '+ R$ 4.800', c.green],
			['Aluguel', '− R$ 1.200', c.redHi],
			['Fatura do cartão', '− R$ 1.890', c.redHi],
			['Reserva de emergência', '− R$ 500', c.redHi],
		].map(([a, b, cor], i) => (
			<Abs key={a} r={{x: 18, y: 388 + i * 58, w: 354, h: 50}} style={{...caixa, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', ...sobe(f, desde + 5 + i * 2)}}>
				<span style={{fontSize: 15, fontWeight: 600}}>{a}</span>
				<span style={{fontFamily: display, fontSize: 18, fontWeight: 700, color: cor}}>{b}</span>
			</Abs>
		))}
	</Tela>
);

// ---------------------------------------------------------------- linha do tempo das telas
type Item = {at: number; el: (f: number) => React.ReactNode; slide?: number};
export const TELAS6: Item[] = [
	{at: 0, el: (f) => <Historico f={f} desde={0} />},
	{at: T6.tela1, el: (f) => <Planejar f={f} desde={T6.tela1} />},
	{at: T6.tela2, el: (f) => <Treino f={f} desde={T6.tela2} />},
	{at: T6.tela3, el: (f) => <Estilo f={f} desde={T6.tela3} />, slide: 8},
	{at: T6.tela4, el: (f) => <Registro f={f} desde={T6.tela4} />},
	{at: T6.tela5, el: (f) => <Grafico f={f} desde={T6.tela5} />},
	{at: T6.tela6, el: (f) => <Cardio f={f} desde={T6.tela6} />},
	{at: T6.tela7, el: (f) => <Habitos f={f} desde={T6.tela7} />},
	{at: T6.tela8, el: (f) => <Financeiro f={f} desde={T6.tela8} />},
	// "tudo num app so": habitos -> treinos -> financeiro pela barra de abas
	{at: T6.tela9, el: (f) => <Habitos f={f} desde={T6.tela9} tudo />},
	{at: T6.abas[0] + 2, el: (f) => <Treino f={f} desde={T6.abas[0] + 2} tudo />, slide: 8},
	{at: T6.abas[1] + 2, el: (f) => <Financeiro f={f} desde={T6.abas[1] + 2} />, slide: 8},
];
const TOQUES_ABA: [number, number][] = [
	[T6.abas[0], 1],
	[T6.abas[1], 2],
];

export const TelaApp6: React.FC<{f: number}> = ({f}) => {
	let i = 0;
	for (let k = 0; k < TELAS6.length; k++) if (f >= TELAS6[k].at) i = k;
	const cur = TELAS6[i];
	const prev = i > 0 ? TELAS6[i - 1] : null;
	const t = cur.slide ? tw(f, [cur.at, cur.at + cur.slide], [0, 1], E.uiMove) : 1;
	const aba = TOQUES_ABA.find(([at]) => f >= at - 5 && f < at + 18);
	return (
		<div style={{position: 'relative', width: UI_W, height: UI_H, overflow: 'hidden', background: c.bg}}>
			{prev && t < 1 ? <div style={{position: 'absolute', inset: 0, transform: `translateX(${-110 * t}px)`, opacity: 1 - t}}>{prev.el(f)}</div> : null}
			<div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - t) * UI_W}px)`}}>{cur.el(f)}</div>
			{aba ? <Toque f={f} at={aba[0]} x={tabX(aba[1])} y={TAB_Y} /> : null}
		</div>
	);
};

// composicao V6Tela (1080 x 2309): textura da tela do celular no Blender
export const V6Tela: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<div style={{position: 'absolute', left: 0, top: 0, width: UI_W, height: UI_H, transform: `scale(${S})`, transformOrigin: '0 0'}}>
				<TelaApp6 f={f} />
			</div>
		</AbsoluteFill>
	);
};
