import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {AppMark} from '../v2/Marca';
import {C, F} from './theme';

// Tela de bloqueio do celular da abertura do v5 (textura do Blender, 1080 x 2309 = area ativa do premium.py).
// Papel de parede com bokeh quente (como o do modelo, em vermelho e ambar), relogio e o widget do Rotina,
// que depois salta para fora do celular em 2D (o mesmo componente, maior).

export const UI5 = {w: 390, h: 834};
const S = 1080 / UI5.w;

export type WidgetDados = {rotulo: string; meta: string; valor: string; progresso: number};

// widget do Rotina (mesmo desenho na tela de bloqueio e no 2D)
export const Widget5: React.FC<{d: WidgetDados; escala?: number; prog?: number}> = ({d, escala = 1, prog}) => {
	const k = escala;
	const p = prog ?? d.progresso;
	return (
		<div style={{width: 350 * k, boxSizing: 'border-box', borderRadius: 22 * k, padding: `${14 * k}px ${16 * k}px ${16 * k}px`, background: 'rgba(24,22,26,0.78)', border: `${Math.max(1, 0.8 * k)}px solid rgba(255,255,255,0.08)`, fontFamily: F, color: C.text, boxShadow: k > 1.5 ? '0 40px 90px rgba(0,0,0,0.6), 0 10px 30px rgba(0,0,0,0.4)' : undefined}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 8 * k}}>
				<AppMark size={20 * k} bg={C.redFill} fg="#fff" />
				<span style={{fontWeight: 600, fontSize: 13.5 * k}}>{d.rotulo}</span>
				<span style={{marginLeft: 'auto', fontWeight: 500, fontSize: 11 * k, color: 'rgba(245,245,247,0.55)'}}>{d.meta}</span>
			</div>
			<div style={{fontWeight: 700, fontSize: 34 * k, letterSpacing: '-0.03em', marginTop: 6 * k, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>{d.valor}</div>
			<div style={{height: 5 * k, borderRadius: 3 * k, background: 'rgba(255,255,255,0.12)', marginTop: 10 * k, overflow: 'hidden'}}>
				<div style={{width: `${p * 100}%`, height: '100%', borderRadius: 3 * k, background: C.red}} />
			</div>
		</div>
	);
};

const Bokeh: React.FC = () => (
	<>
		{Array.from({length: 26}).map((_, i) => {
			const r = 8 + random('br' + i) * 38;
			const x = random('bx' + i) * UI5.w;
			const y = UI5.h * 0.45 + random('by' + i) * UI5.h * 0.55;
			const quente = random('bc' + i);
			const cor = quente < 0.45 ? '255,90,40' : quente < 0.8 ? '255,170,60' : '255,60,70';
			const a = 0.18 + random('ba' + i) * 0.4;
			return <div key={i} style={{position: 'absolute', left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: '50%', background: `radial-gradient(circle, rgba(${cor},${a}) 0%, rgba(${cor},${a * 0.55}) 55%, rgba(${cor},0) 72%)`}} />;
		})}
	</>
);

export const Bloqueio5: React.FC<{data: string; hora: string; widget: WidgetDados; notifs?: {app: string; msg: string; quando: string}[]}> = ({data, hora, widget, notifs = []}) => (
	<div style={{position: 'relative', width: UI5.w, height: UI5.h, overflow: 'hidden', background: 'radial-gradient(130% 80% at 50% 100%, #3B1206 0%, #1A0A08 45%, #0B0A0C 75%)', fontFamily: F}}>
		<Bokeh />
		<div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', color: C.text}}>
			<div style={{fontWeight: 600, fontSize: 17, color: 'rgba(245,245,247,0.82)'}}>{data}</div>
			<div style={{fontWeight: 700, fontSize: 92, lineHeight: 1.0, letterSpacing: '-0.04em', marginTop: 2}}>{hora}</div>
		</div>
		{/* widget no centro do terco de cima (v ~ 0,27: e o ponto que a camera do Blender centraliza no avanco) */}
		<div style={{position: 'absolute', left: 20, top: 186}}>
			<Widget5 d={widget} />
		</div>
		<div style={{position: 'absolute', left: 14, right: 14, top: 318, display: 'flex', flexDirection: 'column', gap: 8}}>
			{notifs.map((n) => (
				<div key={n.msg} style={{height: 64, borderRadius: 20, background: 'rgba(30,28,32,0.72)', border: '0.8px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 11, padding: '0 13px'}}>
					<AppMark size={34} bg={C.redFill} fg="#fff" />
					<div style={{flex: 1, minWidth: 0, color: C.text}}>
						<div style={{display: 'flex', justifyContent: 'space-between', fontSize: 13.5, fontWeight: 600}}>
							<span>{n.app}</span>
							<span style={{fontWeight: 500, fontSize: 11.5, color: 'rgba(245,245,247,0.5)'}}>{n.quando}</span>
						</div>
						<div style={{fontSize: 13, fontWeight: 500, color: 'rgba(245,245,247,0.78)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{n.msg}</div>
					</div>
				</div>
			))}
		</div>
		<div style={{position: 'absolute', left: (UI5.w - 134) / 2, bottom: 9, width: 134, height: 5, borderRadius: 3, background: 'rgba(245,245,247,0.6)'}} />
	</div>
);

// composicao da textura (1080 x 2309); o conteudo e definido em Cenas5 (DADOS_TELA)
export const TelaV5: React.FC<{data: string; hora: string; widget: WidgetDados; notifs?: {app: string; msg: string; quando: string}[]}> = (props) => {
	useCurrentFrame();
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<div style={{position: 'absolute', left: 0, top: 0, width: UI5.w, height: UI5.h, transform: `scale(${S})`, transformOrigin: '0 0'}}>
				<Bloqueio5 {...props} />
			</div>
		</AbsoluteFill>
	);
};
