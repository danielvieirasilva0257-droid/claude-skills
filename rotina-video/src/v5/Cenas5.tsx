import React from 'react';
import {Img, staticFile} from 'remotion';
import {ArrowDownRight, ArrowUpRight, CreditCard, Dumbbell, Home, ListChecks, PiggyBank, Plus, ShoppingBag, TrendingUp, Wallet} from 'lucide-react';
import {Borrao5, C, E, F, FD, Frase, Grande, W5 as LARG, H5 as ALT, brl, larg, sp, tw} from './theme';
import {Cartao, Cursor, Logo, Pilula, SeloDia, larguraLogo} from './pecas';
import {LARG_LISTA, Lista, Resumo, SecaoDados, Topo, entradaLista, posicaoLista} from './blocos';
import {Aviso5, AVISO_UI, AvisoDados, UI5} from './Tela5';
import {poseIntro} from './intro';
import {tela5} from './camera';
import {INTRO5, W5} from './tempo5';

// Cenas 2D do v5 (1920 x 1080), na ordem do roteiro. Todos os tempos saem da voz (W5 = quadro da palavra).
// Camadas em Video5: fundo -> CenasAbaixo (textos e cartoes) -> celular do Blender -> CenasAcima (notificacao que salta do celular).

const pad4 = (n: number) => String(n).padStart(4, '0');

export const DADOS_TELA: {data: string; hora: string; aviso: AvisoDados} = {
	data: 'segunda-feira, 6 de outubro',
	hora: '08:12',
	aviso: {app: 'Banco', titulo: 'Salário recebido', valor: 'R$ 4.800,00', quando: 'agora'},
};

// ============================================================ 1) GANCHO: celular do Blender + notificacao do salario que salta
const SALTA = INTRO5.salta - 2; // a copia 2D comeca colada na notificacao da tela
const ALVO_AVISO = {cx: LARG / 2, cy: 652, escala: 2.5};
const SAI_AVISO = W5(1, 'mas') - 9;

export const Celular5: React.FC<{f: number}> = ({f}) => {
	if (f > INTRO5.some) return null;
	const blur = tw(f, [INTRO5.salta + 2, INTRO5.salta + 12], [0, 14], E.soft);
	const o = 1 - tw(f, [INTRO5.salta + 10, INTRO5.some], [0, 1], E.soft);
	return <Img src={staticFile(`v5/celular/c_${pad4(f)}.png`)} style={{position: 'absolute', left: 0, top: 0, width: LARG, height: ALT, opacity: o, filter: blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : undefined}} />;
};

const AvisoSalta: React.FC<{f: number}> = ({f}) => {
	if (f < SALTA || f > SAI_AVISO + 10) return null;
	// retangulo da notificacao na tela do celular neste quadro (ela continua colada enquanto a mola nao andou)
	const p = poseIntro(f, INTRO5);
	const a = tela5(p, AVISO_UI.x / UI5.w, AVISO_UI.y / UI5.h);
	const b = tela5(p, (AVISO_UI.x + AVISO_UI.w) / UI5.w, AVISO_UI.y / UI5.h);
	const d = tela5(p, AVISO_UI.x / UI5.w, (AVISO_UI.y + AVISO_UI.h) / UI5.h);
	const e0 = Math.hypot(b.x - a.x, b.y - a.y) / AVISO_UI.w;
	const cx0 = (a.x + b.x) / 2 + (d.x - a.x) / 2;
	const cy0 = (a.y + d.y) / 2;
	const rot0 = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
	const k = sp(f, SALTA + 2, {stiffness: 170, damping: 17});
	const esc = e0 + (ALVO_AVISO.escala - e0) * k;
	const cx = cx0 + (ALVO_AVISO.cx - cx0) * k;
	const cy = cy0 + (ALVO_AVISO.cy - cy0) * k;
	const rot = rot0 * (1 - Math.min(1, k));
	const out = tw(f, [SAI_AVISO, SAI_AVISO + 9], [0, 1], E.in);
	const wv = AVISO_UI.w * esc;
	const hv = AVISO_UI.h * esc;
	return (
		<div
			style={{
				position: 'absolute',
				left: cx - wv / 2,
				top: cy - hv / 2 - out * 60,
				transform: `rotate(${rot.toFixed(2)}deg) scale(${1 + 0.06 * out})`,
				opacity: 1 - out,
				filter: out > 0 ? `blur(${(out * 14).toFixed(1)}px)` : undefined,
			}}
		>
			<Aviso5 d={DADOS_TELA.aviso} escala={esc} opaco={Math.min(1, k * 1.6)} />
		</div>
	);
};

// chip "R$ ?,??" dentro da frase (o "R$ ?,??" do modelo), no vermelho do app
const CHIP_SIZE = 44;
// larguras medidas so na hora de desenhar (o modulo tambem e lido pelo exportador de efeitos, no node, sem canvas)
const chipW = () => 26 + 40 + 12 + larg('R$ ?,??', CHIP_SIZE, 600) + 30;
const ChipSobra: React.FC = () => (
	<div style={{height: 80, width: chipW(), boxSizing: 'border-box', borderRadius: 40, padding: '0 26px', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(204,0,0,0.20)', border: '2px solid rgba(255,90,90,0.55)', boxShadow: '0 0 30px rgba(255,60,60,0.25)', fontFamily: F, fontWeight: 600, fontSize: CHIP_SIZE, color: C.text}}>
		<PiggyBank size={40} color={C.red} strokeWidth={2.4} />
		R$ ?,??
	</div>
);

const Gancho: React.FC<{f: number}> = ({f}) => (
	<Frase
		f={f}
		id="g"
		size={84}
		y={540}
		sai={W5(1, 'sobra') + 12}
		palavras={[
			{t: 'Mas', at: W5(1, 'mas')},
			{t: 'sabe', at: W5(1, 'sabe', 1)},
			{t: 'quanto', at: W5(1, 'quanto', 1)},
			{t: '', at: W5(1, 'quanto', 1) + 3, chip: <ChipSobra />, chipW: chipW()},
			{t: 'sobra?', at: W5(1, 'sobra'), titulo: true, cor: C.red},
		]}
	/>
);

// ============================================================ 2) LISTA: as saidas do mes, secao por secao (como "Combustivel / Manutencao" do modelo)
const SECOES: SecaoDados[] = [
	{
		titulo: 'Contas fixas',
		total: '− R$ 1.300',
		at: W5(2, 'conta'),
		icone: Home,
		cor: C.purple,
		itens: [
			{selo: <SeloDia dia="02" mes="OUT" />, titulo: 'Aluguel', sub: 'Fixa · todo mês', valor: '− R$ 1.200'},
			{selo: <SeloDia dia="15" mes="OUT" />, titulo: 'Internet', sub: 'Fixa · todo mês', valor: '− R$ 100'},
		],
	},
	{
		titulo: 'Cartão',
		total: '− R$ 1.890',
		at: W5(2, 'cartão'),
		icone: CreditCard,
		cor: C.pink,
		itens: [{selo: <SeloDia dia="05" mes="OUT" />, titulo: 'Fatura de outubro', sub: 'Cartão · vence dia 5', valor: '− R$ 1.890'}],
	},
	{
		titulo: 'Gastos pontuais',
		total: '− R$ 120',
		at: W5(2, 'gasto'),
		icone: ShoppingBag,
		cor: C.blue,
		itens: [{selo: <SeloDia dia="26" mes="OUT" />, titulo: 'Presente', sub: 'Pontual · uma vez', valor: '− R$ 120'}],
	},
	{
		titulo: 'Investimentos',
		total: '− R$ 500',
		at: W5(2, 'investimento'),
		icone: TrendingUp,
		cor: C.green,
		itens: [{selo: <SeloDia dia="20" mes="OUT" />, titulo: 'Reserva de emergência', sub: 'Aplicação mensal', valor: '− R$ 500'}],
	},
];
const LISTA_X = (LARG - LARG_LISTA) / 2;
const LISTA_TOPO = 210;
const ENTRA_LISTA = W5(2, 'conta') - 5;
const SAI_LISTA = W5(3, 'tudo') - 6;
// o numero do topo desconta cada secao no quadro dela
const SOBRAS = [4800, 3500, 1610, 1490, 990];
const sobraEm = (f: number) => {
	let v = SOBRAS[0];
	for (let i = 0; i < SECOES.length; i++) v += (SOBRAS[i + 1] - SOBRAS[i]) * tw(f, [SECOES[i].at + 4, SECOES[i].at + 12], [0, 1], E.out);
	return v;
};
const saidaLista = (f: number) => tw(f, [SAI_LISTA, SAI_LISTA + 10], [0, 1], E.whip) * -1150;
const yLista = (f: number) => posicaoLista(f, SECOES, LISTA_TOPO) + entradaLista(f, ENTRA_LISTA) + saidaLista(f);

const ListaSaidas: React.FC<{f: number}> = ({f}) => {
	if (f < ENTRA_LISTA - 6 || f > SAI_LISTA + 12) return null;
	// secao em foco acesa; a proxima, apagada; a que sai some enquanto a coluna rola (nada passa por cima do topo)
	const opac = (i: number) => {
		const s = SECOES[i];
		const foco = i === 0 ? 1 : 0.32 + 0.68 * tw(f, [s.at - 3, s.at + 6], [0, 1]);
		const sai = i < SECOES.length - 1 ? 1 - tw(f, [SECOES[i + 1].at - 3, SECOES[i + 1].at + 4], [0, 1], E.out) : 1;
		return foco * sai;
	};
	const vy = yLista(f) - yLista(f - 1);
	// topo: desce da borda de cima, sai junto com a lista
	const kt = sp(f, ENTRA_LISTA - 6, {stiffness: 240, damping: 26});
	const yt = 60 - (1 - Math.min(1, kt)) * 180 + saidaLista(f);
	return (
		<Borrao5 id="lista" dx={0} dy={vy} k={0.3} max={30}>
			<div style={{position: 'absolute', left: LISTA_X, top: yt, opacity: Math.min(1, kt * 1.5)}}>
				<Topo esquerda="Outubro · entrou R$ 4.800" rotulo="sobra" valor={`R$ ${brl(sobraEm(f), 0)}`} w={LARG_LISTA} />
			</div>
			<div style={{position: 'absolute', left: 0, top: saidaLista(f), width: LARG, height: ALT}}>
				<Lista f={f} secoes={SECOES} x={LISTA_X} topo={LISTA_TOPO} opac={opac} entra={ENTRA_LISTA} />
			</div>
		</Borrao5>
	);
};

// ============================================================ 3) RESUMO: "tudo isso sai do mesmo salario"
const RES = {w: 900, h: 520, at: W5(3, 'tudo') - 2, cresce: W5(3, 'isso'), acende: W5(3, 'salário')};
const RES_X = (LARG - RES.w) / 2;
const RES_Y = (ALT - RES.h) / 2;
const MORPH = W5(4, 'no') - 13; // o cartao vira o icone do app
const ICONE = 170;

const ResumoMes: React.FC<{f: number}> = ({f}) => {
	if (f < RES.at - 2 || f >= MORPH + 2) return null;
	const k = tw(f, [RES.at - 2, RES.at + 10], [0, 1], E.out);
	const y = RES_Y + (1 - k) * 900;
	const vy = (1 - tw(f - 1, [RES.at - 2, RES.at + 10], [0, 1], E.out)) * 900 - (1 - k) * 900;
	return (
		<Borrao5 id="resumo" dx={0} dy={vy} k={0.3} max={30}>
			<div style={{position: 'absolute', left: RES_X, top: y}}>
				<Resumo
					f={f}
					at={RES.at - 6}
					w={RES.w}
					h={RES.h}
					linhas={[
						{rotulo: 'Salário de outubro', valor: 'R$ 4.800,00'},
						{rotulo: 'Saiu no mês', valor: '− R$ 3.810,00'},
					]}
					segmentos={[1300, 1890, 120, 500, 990]}
					cores={[C.purple, C.pink, C.blue, C.green, '']}
					aceso={4}
					cresce={RES.cresce}
					titulo="Sobra no mês"
					grande="R$ 990,00"
					acende={RES.acende}
				/>
			</div>
		</Borrao5>
	);
};

// ============================================================ 4) O CARTAO VIRA O ICONE, O ICONE VIRA A MARCA ("No Rotina")
const LOGO_AT = MORPH + 12;
const LOGO_SAI = W5(4, 'você') - 8;

const Morph: React.FC<{f: number}> = ({f}) => {
	if (f < MORPH - 4 || f >= LOGO_AT) return null;
	// 1) um retangulo igual ao cartao cobre o conteudo; 2) encolhe ate o quadrado do icone e fica vermelho
	const cobre = tw(f, [MORPH - 4, MORPH + 2], [0, 1], E.soft);
	const m = tw(f, [MORPH + 1, MORPH + 12], [0, 1], E.inOut);
	const cor = tw(f, [MORPH + 4, MORPH + 12], [0, 1], E.soft);
	const w = RES.w + (ICONE - RES.w) * m;
	const h = RES.h + (ICONE - RES.h) * m;
	const r = 30 + (ICONE * 0.26 - 30) * m;
	const mix = (a: number[], b: number[]) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * cor)).join(',')})`;
	return (
		<div
			style={{
				position: 'absolute',
				left: LARG / 2 - w / 2,
				top: ALT / 2 - h / 2,
				width: w,
				height: h,
				borderRadius: r,
				opacity: cobre,
				background: mix([30, 30, 36], [204, 0, 0]),
				border: `1.5px solid rgba(255,255,255,${0.07 * (1 - cor)})`,
				boxShadow: `0 40px 90px rgba(0,0,0,${0.55 * (1 - cor)}), 0 18px 40px rgba(224,30,38,${0.35 * cor})`,
			}}
		/>
	);
};

const MarcaRotina: React.FC<{f: number}> = ({f}) => {
	if (f < LOGO_AT || f > LOGO_SAI + 12) return null;
	// o icone nasce no centro; o nome sai de tras dele e o conjunto desliza ate ficar centralizado
	const c = tw(f, [LOGO_AT + 6, LOGO_AT + 22], [0, 1], E.inOut);
	const x0 = LARG / 2 - ICONE / 2;
	const x1 = LARG / 2 - larguraLogo(ICONE) / 2;
	const x = x0 + (x1 - x0) * c;
	// saida: o logo cresce na direcao da camera (passa por ela) e da lugar ao app
	const z = tw(f, [LOGO_SAI, LOGO_SAI + 10], [0, 1], E.in);
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: ALT / 2 - ICONE / 2,
				transform: `scale(${1 + 2.2 * z})`,
				transformOrigin: `${LARG / 2 - x}px ${ICONE / 2}px`,
				opacity: 1 - z,
				filter: z > 0 ? `blur(${(z * 16).toFixed(1)}px)` : undefined,
			}}
		>
			<Logo f={f} at={LOGO_AT - 2} size={ICONE} pop={false} />
		</div>
	);
};

// ============================================================ 5) O APP: "voce anota o que entra e o que sai" (formulario com a camera passeando)
const PAINEL = {x: 360, y: 140, w: 1200, h: 800, pad: 48};
const CAMPO = {y: PAINEL.y + 196, h: 156};
const DESC = {x: PAINEL.x + PAINEL.pad, w: 650};
const VAL = {x: DESC.x + DESC.w + 22, w: PAINEL.w - 2 * PAINEL.pad - DESC.w - 22};
const BOTAO = {y: CAMPO.y + CAMPO.h + 28, h: 100};
const TOG = {w: 470, h: 88};
const TOG_X = PAINEL.x + PAINEL.w - PAINEL.pad - TOG.w;
const TOG_Y = PAINEL.y + PAINEL.pad - 6;
// focos da camera (pontos do "mundo" do painel)
const P_DESC = {x: DESC.x + DESC.w / 2, y: CAMPO.y + CAMPO.h / 2};
const P_VAL = {x: VAL.x + VAL.w / 2, y: CAMPO.y + CAMPO.h / 2};
const P_TOG = {x: TOG_X + TOG.w / 2, y: TOG_Y + TOG.h / 2 + 20};
const P_CEN = {x: LARG / 2, y: ALT / 2};

const APP = {
	entra: W5(4, 'você') + 2,
	digita1: W5(4, 'anota'),
	valor1: W5(4, 'que') - 1,
	aperta1: W5(4, 'entra') + 2,
	alterna: W5(4, 'sai') - 3,
	digita2: W5(4, 'sai') + 1,
	valor2: W5(4, 'sai') + 7,
	aperta2: W5(4, 'sai') + 10,
	sai: W5(4, 'e', 1),
};
type Cam = {f: number; p: {x: number; y: number}; s: number};
const CAMS: Cam[] = [
	{f: APP.entra, p: P_DESC, s: 1.12},
	{f: APP.digita1, p: P_DESC, s: 1.5},
	{f: APP.valor1 - 3, p: P_DESC, s: 1.5},
	{f: APP.valor1 + 1, p: P_VAL, s: 1.5},
	{f: APP.aperta1 - 3, p: P_VAL, s: 1.5},
	{f: APP.aperta1 + 4, p: P_CEN, s: 1.0},
	{f: APP.alterna - 5, p: P_CEN, s: 1.0},
	{f: APP.alterna + 1, p: P_TOG, s: 1.4},
	{f: APP.alterna + 3, p: P_TOG, s: 1.4},
	{f: APP.digita2 + 2, p: P_DESC, s: 1.25},
	{f: APP.valor2 - 1, p: P_DESC, s: 1.25},
	{f: APP.valor2 + 1, p: P_VAL, s: 1.25},
	{f: APP.aperta2 - 1, p: P_VAL, s: 1.25},
	{f: APP.aperta2 + 5, p: P_CEN, s: 1.0},
];
const camEm = (f: number) => {
	if (f <= CAMS[0].f) return CAMS[0];
	for (let i = 1; i < CAMS.length; i++) {
		const a = CAMS[i - 1];
		const b = CAMS[i];
		if (f <= b.f) {
			const k = tw(f, [a.f, b.f], [0, 1], E.inOut);
			return {f, p: {x: a.p.x + (b.p.x - a.p.x) * k, y: a.p.y + (b.p.y - a.p.y) * k}, s: a.s + (b.s - a.s) * k};
		}
	}
	return CAMS[CAMS.length - 1];
};
const digitado = (f: number, txt: string, ini: number, fim: number) => txt.slice(0, Math.round(tw(f, [ini, fim], [0, txt.length], E.lin)));

const Campo: React.FC<{f: number; x: number; w: number; rotulo: string; texto: string; foco: boolean; valor?: boolean}> = ({f, x, w, rotulo, texto, foco, valor}) => {
	const pisca = Math.floor(f / 8) % 2 === 0;
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: CAMPO.y,
				width: w,
				height: CAMPO.h,
				boxSizing: 'border-box',
				borderRadius: 26,
				background: C.card2,
				border: `2px solid ${foco ? C.red : C.line}`,
				boxShadow: foco ? '0 0 0 6px rgba(255,90,90,0.14), 0 0 40px rgba(255,60,60,0.18)' : undefined,
				padding: '22px 30px',
			}}
		>
			<div style={{fontFamily: FD, fontWeight: 600, fontSize: 26, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.gray}}>{rotulo}</div>
			<div style={{display: 'flex', alignItems: 'center', marginTop: 6, height: 66, whiteSpace: 'nowrap'}}>
				{valor ? <span style={{fontFamily: FD, fontWeight: 700, fontSize: 40, color: C.gray, marginRight: 12}}>R$</span> : null}
				<span style={{fontFamily: valor ? FD : F, fontWeight: valor ? 800 : 600, fontSize: valor ? 64 : 52, color: C.text, fontVariantNumeric: 'tabular-nums'}}>{texto}</span>
				{foco && pisca ? <span style={{width: 4, height: 58, marginLeft: 4, borderRadius: 2, background: C.red}} /> : null}
			</div>
		</div>
	);
};

const Alterna: React.FC<{f: number}> = ({f}) => {
	const kn = tw(f, [APP.alterna - 2, APP.alterna + 4], [0, 1], E.inOut);
	const saida = kn >= 0.5;
	const itens: [string, typeof ArrowUpRight][] = [
		['Entrada', ArrowUpRight],
		['Saída', ArrowDownRight],
	];
	return (
		<div style={{position: 'absolute', left: TOG_X, top: TOG_Y, width: TOG.w, height: TOG.h, boxSizing: 'border-box', borderRadius: 20, background: '#1D1D1D', padding: 5, display: 'flex'}}>
			<div style={{position: 'absolute', top: 5, bottom: 5, left: 5 + kn * (TOG.w / 2 - 5), width: TOG.w / 2 - 5, borderRadius: 16, background: saida ? C.redFill : '#0E7A57'}} />
			{itens.map(([t, Ic], i) => {
				const ativo = (i === 1) === saida;
				return (
					<div key={t} style={{position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: FD, fontWeight: 800, fontSize: 36, letterSpacing: '0.04em', textTransform: 'uppercase', color: ativo ? '#FFFFFF' : C.gray}}>
						<Ic size={32} strokeWidth={2.6} />
						{t}
					</div>
				);
			})}
		</div>
	);
};

const LinhaLanc: React.FC<{f: number; at: number; y: number; entrada: boolean; desc: string; valor: string}> = ({f, at, y, entrada, desc, valor}) => {
	if (f < at) return null;
	const k = sp(f, at, {stiffness: 320, damping: 24});
	const cor = entrada ? C.green : C.red;
	const Ic = entrada ? ArrowUpRight : ArrowDownRight;
	return (
		<div style={{position: 'absolute', left: PAINEL.x + PAINEL.pad, top: y, width: PAINEL.w - 2 * PAINEL.pad, height: 86, display: 'flex', alignItems: 'center', gap: 22, opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - Math.min(1, k)) * -30}px)`, borderTop: `1.5px solid ${C.line}`}}>
			<div style={{width: 58, height: 58, borderRadius: 29, background: entrada ? 'rgba(52,211,153,0.14)' : 'rgba(255,90,90,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<Ic size={34} color={cor} strokeWidth={2.6} />
			</div>
			<div style={{flex: 1, fontFamily: F, fontWeight: 600, fontSize: 36, color: C.text}}>{desc}</div>
			<div style={{fontFamily: FD, fontWeight: 800, fontSize: 46, color: cor, fontVariantNumeric: 'tabular-nums'}}>{valor}</div>
		</div>
	);
};

const PainelApp: React.FC<{f: number}> = ({f}) => {
	const sai = tw(f, [APP.sai, APP.sai + 8], [0, 1], E.whip);
	if (f < APP.entra - 1 || sai >= 1) return null;
	const entra = tw(f, [APP.entra - 1, APP.entra + 7], [0, 1], E.out);
	const entra0 = tw(f - 1, [APP.entra - 1, APP.entra + 7], [0, 1], E.out);
	const cam = camEm(f);
	const cam0 = camEm(f - 1);
	// a camera: o ponto em foco fica no centro do quadro e a escala e em volta dele (na entrada, vem de um pouco mais longe)
	const esc = cam.s * (0.82 + 0.18 * entra);
	const esc0 = cam0.s * (0.82 + 0.18 * entra0);
	const tela = (c: Cam, e: number) => ({x: LARG / 2 + (P_CEN.x - c.p.x) * e, y: ALT / 2 + (P_CEN.y - c.p.y) * e});
	const t = tela(cam, esc);
	const t0 = tela(cam0, esc0);
	const dx = t.x - t0.x;
	const dy = t.y - t0.y + (esc - esc0) * 400;
	const yS = sai * -1250;
	// 1o lancamento: digita "Salario" e "4.800" e aperta adicionar; 2o: alterna para saida, "Presente", "120"
	const seg = f >= APP.aperta1 + 2;
	const desc = seg ? digitado(f, 'Presente', APP.digita2, APP.digita2 + 4) : digitado(f, 'Salário', APP.digita1, APP.digita1 + 8);
	const val = seg ? digitado(f, '120', APP.valor2, APP.valor2 + 2) : digitado(f, '4.800', APP.valor1, APP.valor1 + 6);
	const limpa = (f >= APP.aperta1 + 2 && f < APP.digita2) || f >= APP.aperta2 + 2;
	const focoDesc = (f >= APP.entra && f < APP.valor1) || (f >= APP.alterna + 3 && f < APP.valor2);
	const focoVal = (f >= APP.valor1 && f < APP.aperta1) || (f >= APP.valor2 && f < APP.aperta2);
	const ap = (at: number) => (f >= at ? Math.sin(Math.PI * Math.min(1, (f - at) / 6)) : 0);
	const aperto = Math.max(ap(APP.aperta1), ap(APP.aperta2));
	const LANC_Y = BOTAO.y + BOTAO.h + 88;
	return (
		<Borrao5 id="painel" dx={dx} dy={dy + (yS - (tw(f - 1, [APP.sai, APP.sai + 8], [0, 1], E.whip) * -1250))} k={0.3} max={34}>
			<div style={{position: 'absolute', left: 0, top: yS, width: LARG, height: ALT, opacity: entra, transform: `translate(${LARG / 2}px, ${ALT / 2}px) scale(${esc}) translate(${-cam.p.x}px, ${-cam.p.y}px)`, transformOrigin: '0 0'}}>
				<Cartao w={PAINEL.w} h={PAINEL.h} style={{position: 'absolute', left: PAINEL.x, top: PAINEL.y}}>
					<div />
				</Cartao>
				<div style={{position: 'absolute', left: PAINEL.x + PAINEL.pad, top: PAINEL.y + PAINEL.pad, height: 76, display: 'flex', alignItems: 'center', gap: 16}}>
					<Wallet size={48} color={C.red} strokeWidth={2.4} />
					<span style={{fontFamily: FD, fontWeight: 800, fontSize: 60, letterSpacing: '0.01em', textTransform: 'uppercase', color: C.text}}>Nova transação</span>
				</div>
				<Alterna f={f} />
				<Campo f={f} x={DESC.x} w={DESC.w} rotulo="Descrição" texto={limpa ? '' : desc} foco={focoDesc} />
				<Campo f={f} x={VAL.x} w={VAL.w} rotulo="Valor" texto={limpa ? '' : val} foco={focoVal} valor />
				<div style={{position: 'absolute', left: PAINEL.x + PAINEL.pad, top: BOTAO.y, width: PAINEL.w - 2 * PAINEL.pad, height: BOTAO.h, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, borderRadius: 24, background: C.redFill, fontFamily: FD, fontWeight: 800, fontSize: 44, letterSpacing: '0.04em', color: '#fff', textTransform: 'uppercase', transform: `scale(${1 - 0.04 * aperto})`, boxShadow: `0 ${18 - 10 * aperto}px 50px rgba(224,30,38,${0.3 + 0.25 * aperto})`}}>
					<Plus size={44} strokeWidth={3} />
					Adicionar
				</div>
				<div style={{position: 'absolute', left: PAINEL.x + PAINEL.pad, top: BOTAO.y + BOTAO.h + 34, fontFamily: FD, fontWeight: 600, fontSize: 28, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.gray}}>Lançamentos de outubro</div>
				<LinhaLanc f={f} at={APP.aperta1 + 2} y={LANC_Y} entrada desc="Salário" valor="+ R$ 4.800,00" />
				<LinhaLanc f={f} at={APP.aperta2 + 2} y={LANC_Y + 92} entrada={false} desc="Presente" valor="− R$ 120,00" />
			</div>
		</Borrao5>
	);
};

// "e ve quanto sobra no mes": o resultado conta
const RESULT = {at: APP.sai + 4, conta: W5(4, 'quanto'), ate: W5(4, 'sobra') + 8, acende: W5(4, 'sobra'), detalhe: W5(4, 'no', 1), sai: W5(5, 'treino') - 9, w: 860};
const Resultado: React.FC<{f: number}> = ({f}) => {
	if (f < RESULT.at || f > RESULT.sai + 10) return null;
	const k = tw(f, [RESULT.at, RESULT.at + 12], [0, 1], E.out);
	const k0 = tw(f - 1, [RESULT.at, RESULT.at + 12], [0, 1], E.out);
	const s = tw(f, [RESULT.sai, RESULT.sai + 9], [0, 1], E.whip);
	const s0 = tw(f - 1, [RESULT.sai, RESULT.sai + 9], [0, 1], E.whip);
	const y = (1 - k) * 900 - s * 1200;
	const vy = y - ((1 - k0) * 900 - s0 * 1200);
	const luz = tw(f, [RESULT.acende, RESULT.acende + 8], [0, 1]);
	const v = 990 * tw(f, [RESULT.conta, RESULT.ate], [0, 1], E.out);
	const chip = (at: number, cor: string, fundo: string, Ic: typeof ArrowUpRight, txt: string) => {
		const q = sp(f, at, {stiffness: 320, damping: 24});
		return (
			<div style={{display: 'flex', alignItems: 'center', gap: 10, height: 64, padding: '0 24px', borderRadius: 32, background: fundo, fontFamily: FD, fontWeight: 700, fontSize: 32, letterSpacing: '0.04em', textTransform: 'uppercase', color: cor, opacity: Math.min(1, q * 1.5), transform: `translateY(${(1 - Math.min(1, q)) * 20}px)`}}>
				<Ic size={30} strokeWidth={2.6} />
				{txt}
			</div>
		);
	};
	return (
		<Borrao5 id="result" dx={0} dy={vy} k={0.3} max={30}>
			<div style={{position: 'absolute', left: (LARG - RESULT.w) / 2, top: 250 + y}}>
				<Cartao w={RESULT.w} vidro style={{padding: '44px 52px 48px'}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
						<Wallet size={40} color={luz > 0.5 ? C.red : C.gray} strokeWidth={2.4} />
						<span style={{fontFamily: FD, fontWeight: 700, fontSize: 36, letterSpacing: '0.12em', textTransform: 'uppercase', color: luz > 0.5 ? C.red : C.gray}}>Sobra no mês</span>
					</div>
					<div style={{marginTop: 4, textShadow: luz > 0 ? `0 0 ${40 * luz}px rgba(255,77,77,${0.45 * luz})` : undefined}}>
						<Grande valor={`R$ ${brl(v)}`} size={170} />
					</div>
					<div style={{display: 'flex', gap: 16, marginTop: 14, height: 64}}>
						{f >= RESULT.detalhe ? chip(RESULT.detalhe, C.green, 'rgba(52,211,153,0.12)', ArrowUpRight, 'Entrou R$ 4.800') : null}
						{f >= RESULT.detalhe + 3 ? chip(RESULT.detalhe + 3, C.red, 'rgba(255,90,90,0.12)', ArrowDownRight, 'Saiu R$ 3.810') : null}
					</div>
				</Cartao>
			</div>
		</Borrao5>
	);
};

// ============================================================ 6) "Treino e habitos tambem" (titulos do app, com icone e cor)
const B5 = {sai: W5(6, 'baixe') - 13};
const TreinoHabitos: React.FC<{f: number}> = ({f}) => {
	if (f < W5(5, 'treino') - 1) return null;
	const s = tw(f, [B5.sai, B5.sai + 8], [0, 1], E.whip);
	const s0 = tw(f - 1, [B5.sai, B5.sai + 8], [0, 1], E.whip);
	if (s >= 1) return null;
	return (
		<Borrao5 id="b5" dx={(s - s0) * -2300} dy={0} k={0.3} max={40}>
			<div style={{position: 'absolute', left: s * -2300, top: 0, width: LARG, height: ALT}}>
				<Frase
					f={f}
					id="b5"
					size={96}
					y={540}
					palavras={[
						{t: 'Treino', at: W5(5, 'treino'), titulo: true, icone: Dumbbell, cor: C.orange},
						{t: 'e', at: W5(5, 'e')},
						{t: 'hábitos', at: W5(5, 'hábitos'), titulo: true, icone: ListChecks, cor: C.red},
						{t: 'também.', at: W5(5, 'também')},
					]}
				/>
			</div>
		</Borrao5>
	);
};

// ============================================================ 7) CTA: botao que entra pela direita e o cursor clica em "agora"
const CTA = {entra: W5(6, 'baixe') - 9, clica: W5(6, 'agora') + 1, sai: W5(6, 'agora') + 23, w: 680, h: 160};
const ALVO_CURSOR = {x: LARG / 2 + 240, y: ALT / 2 + 26};
const BotaoCta: React.FC<{f: number}> = ({f}) => {
	if (f < CTA.entra || f > CTA.sai + 8) return null;
	const k = tw(f, [CTA.entra, CTA.entra + 9], [0, 1], E.out);
	const k0 = tw(f - 1, [CTA.entra, CTA.entra + 9], [0, 1], E.out);
	const x = (1 - k) * 1500;
	const out = tw(f, [CTA.sai, CTA.sai + 7], [0, 1], E.in);
	const afunda = f >= CTA.clica ? Math.sin(Math.PI * Math.min(1, (f - CTA.clica) / 8)) : 0;
	const brilho = tw(f, [CTA.clica, CTA.clica + 4], [0, 1]) * (1 - tw(f, [CTA.clica + 8, CTA.clica + 22], [0, 1]));
	const onda = f >= CTA.clica ? (f - CTA.clica) / 16 : -1;
	return (
		<>
			<Borrao5 id="cta" dx={(k - k0) * -1500} dy={0} k={0.3} max={40}>
				<div style={{position: 'absolute', left: (LARG - CTA.w) / 2 + x, top: (ALT - CTA.h) / 2, transform: `scale(${1 - 0.6 * out})`, opacity: 1 - out}}>
					<Pilula w={CTA.w} h={CTA.h} texto="Baixe agora" size={76} afunda={afunda} brilho={brilho} />
				</div>
			</Borrao5>
			{onda >= 0 && onda <= 1 && out < 1 ? (
				<div style={{position: 'absolute', left: ALVO_CURSOR.x - 20 - 120 * onda, top: ALVO_CURSOR.y - 20 - 120 * onda, width: 40 + 240 * onda, height: 40 + 240 * onda, borderRadius: '50%', border: `${4 * (1 - onda) + 1}px solid rgba(255,255,255,${0.7 * (1 - onda)})`}} />
			) : null}
			{out < 1 ? (
				<div style={{opacity: 1 - out}}>
					<Cursor f={f} de={{x: LARG + 120, y: ALT + 120}} para={ALVO_CURSOR} chega={CTA.clica - 4} clica={CTA.clica} />
				</div>
			) : null}
		</>
	);
};

// ============================================================ 8) FINAL: marca + "baixe pelo link na bio"
const FIM = {at: CTA.sai + 7, batida: 563, sub: 575, size: 150};
const Final: React.FC<{f: number}> = ({f}) => {
	if (f < FIM.at) return null;
	const wl = larguraLogo(FIM.size);
	const pulso = f >= FIM.batida ? Math.sin(Math.PI * Math.min(1, (f - FIM.batida) / 10)) * Math.exp(-(f - FIM.batida) / 12) : 0;
	const ks = tw(f, [FIM.sub, FIM.sub + 12], [0, 1], E.out);
	return (
		<>
			<div style={{position: 'absolute', left: (LARG - wl) / 2, top: ALT / 2 - FIM.size / 2 - 30, transform: `scale(${1 + 0.05 * pulso + 0.03 * tw(f, [FIM.at + 20, 672], [0, 1], E.soft)})`, transformOrigin: '50% 50%'}}>
				<Logo f={f} at={FIM.at} size={FIM.size} />
			</div>
			{ks > 0 ? (
				<div style={{position: 'absolute', left: 0, width: LARG, top: 680 + (1 - ks) * 460, textAlign: 'center', fontFamily: F, fontWeight: 500, fontSize: 34, color: C.gray, opacity: ks}}>
					Baixe pelo link na bio
				</div>
			) : null}
		</>
	);
};

// ============================================================ montagem
export const CenasAbaixo: React.FC<{f: number}> = ({f}) => (
	<>
		<Gancho f={f} />
		<ListaSaidas f={f} />
		<ResumoMes f={f} />
		<Morph f={f} />
		<MarcaRotina f={f} />
		<PainelApp f={f} />
		<Resultado f={f} />
		<TreinoHabitos f={f} />
		<BotaoCta f={f} />
		<Final f={f} />
	</>
);

export const CenasAcima: React.FC<{f: number}> = ({f}) => <AvisoSalta f={f} />;

// marcas de tempo (para o mapa de efeitos sonoros e para a revisao)
export const TEMPOS5 = {
	salta: SALTA,
	saiAviso: SAI_AVISO,
	entraLista: ENTRA_LISTA,
	secoes: SECOES.map((s) => s.at),
	saiLista: SAI_LISTA,
	resumo: RES.at,
	acende: RES.acende,
	morph: MORPH,
	logo: LOGO_AT,
	logoSai: LOGO_SAI,
	app: APP,
	resultado: RESULT,
	b5Sai: B5.sai,
	cta: CTA,
	fim: FIM,
};
