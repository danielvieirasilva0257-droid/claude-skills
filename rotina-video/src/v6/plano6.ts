import {W6} from './tempo6';

// Plano do v6: quando o celular fica em foco (P), quando a camera mergulha num elemento da tela e ele sobe
// para fora com o celular desfocado atras (N), e onde fica cada elemento na tela do app (pontos da UI 390 x 834).
// Usado pelo rig (Blender), pelas telas (textura) e pelas cenas 2D: tudo na mesma conta.

export type Rect = {x: number; y: number; w: number; h: number};

// ---------------------------------------------------------------- elementos que saltam (pontos da UI)
export const RE = {
	historico3m: {x: 18, y: 516, w: 354, h: 60}, // "Ha 3 meses" no historico do supino
	semanas: [0, 1, 2, 3].map((i) => ({x: 18, y: 172 + i * 84, w: 354, h: 74})), // Semana 1..4 no Planejar
	reps: {x: 18, y: 130, w: 354, h: 120}, // editor do estilo: repeticoes
	series: {x: 18, y: 262, w: 354, h: 96}, // editor do estilo: series
	aviso: {x: 18, y: 360, w: 354, h: 84}, // registro: "aumente a carga"
	recorde: {x: 18, y: 640, w: 354, h: 64}, // registro: aviso "Novo recorde!"
	grafico: {x: 18, y: 218, w: 354, h: 250}, // progresso: grafico do supino
	cardio: {x: 18, y: 172, w: 354, h: 150}, // cardio: anel da meta
	sequencia: {x: 18, y: 120, w: 354, h: 100}, // habitos: sequencia
	resumo: {x: 18, y: 172, w: 354, h: 200}, // financeiro: entrou, saiu, sobra
	rm: {x: 18, y: 520, w: 354, h: 96}, // registro: 1RM estimado
};
export const centroDe = (r: Rect) => ({u: (r.x + r.w / 2) / 390, v: (r.y + r.h / 2) / 834});

// ---------------------------------------------------------------- tempos (quadros a 30 fps)
const tit = W6(1, 'supino');
export const T6 = {
	// gancho
	pousa: 30,
	sai1: tit + 9, // frase do gancho sai
	n1: tit + 13, // mergulho no "ha 3 meses"
	pop1: tit + 25,
	// fala 2: estilos por semana
	p1: W6(2, 'no') - 6,
	tela1: W6(2, 'no') - 4,
	sai2: W6(2, 'estilo') + 6,
	n2: W6(2, 'estilo') + 6,
	semanas: [W6(2, 'hipertrofia'), W6(2, 'força'), W6(2, 'potência'), W6(2, 'deload')],
	// fala 3: checklist do treino
	p2: W6(3, 'cada') - 12,
	tela2: W6(3, 'cada') - 10,
	checks: [W6(3, 'cada') + 12, W6(3, 'vira') + 2, W6(3, 'checklist') + 3, W6(3, 'checklist') + 11],
	sai3: W6(3, 'checklist') + 19,
	tocaEstilo: W6(3, 'checklist') + 17,
	tela3: W6(3, 'checklist') + 21,
	// fala 4: series e repeticoes
	n3: W6(4, 'você') - 5,
	popSeries: W6(4, 'séries'),
	maisSerie: W6(4, 'séries') + 5,
	popReps: W6(4, 'repetições'),
	maisReps: W6(4, 'repetições') + 5,
	// fala 5: fechou doze, sobe a carga
	p3: W6(5, 'fechou') - 12,
	tela4: W6(5, 'fechou') - 10,
	doze: W6(5, 'doze'),
	sai5: W6(5, 'todas') + 9,
	n4: W6(5, 'todas') + 13,
	popAviso: W6(5, 'manda'),
	// fala 6: recorde e 1RM
	popRecorde: W6(6, 'recorde'),
	popRM: W6(6, 'quanto'),
	// fala 7: grafico
	p4: W6(7, 'o') - 11,
	tela5: W6(7, 'o') - 9,
	sai7: W6(7, 'supino') + 10,
	n5: W6(7, 'supino') + 12,
	popGrafico: W6(7, 'supino') + 26,
	meses: W6(7, 'mês'),
	// fala 8: meta de cardio (o celular continua desfocado; a tela troca por baixo)
	tela6: W6(8, 'e') - 10,
	popCardio: W6(8, 'meta'),
	falta: W6(8, 'falta'),
	// fala 9: habitos
	p5: W6(9, 'nos') - 12,
	tela7: W6(9, 'nos') - 10,
	habTaps: [W6(9, 'outro') - 1, W6(9, 'checklist') + 1, W6(9, 'checklist') + 9, W6(9, 'e') - 1],
	sai9: W6(9, 'checklist') + 11,
	n6: W6(9, 'checklist') + 15,
	popSeq: W6(9, 'sequência'),
	sobe: W6(9, 'sobe'),
	// fala 10: financeiro
	p6: W6(10, 'no') - 12,
	tela8: W6(10, 'no') - 10,
	sai10: W6(10, 'financeiro') + 11,
	n7: W6(10, 'financeiro') + 13,
	popEntra: W6(10, 'entra'),
	popSai: W6(10, 'sai'),
	popSobra: W6(10, 'sobra'),
	// fala 11: tudo num app so
	p7: W6(11, 'tudo') - 10,
	tela9: W6(11, 'tudo') - 8,
	abas: [W6(11, 'tudo') + 4, W6(11, 'app') - 2, W6(11, 'só') + 2],
	sai11: W6(11, 'só') + 8,
	fora: W6(11, 'só') + 4, // o celular sai pela borda de baixo
	// fala 12: CTA
	cta: W6(12, 'baixe') - 9,
	clica: W6(12, 'agora') + 1,
	ctaSai: W6(12, 'agora') + 22,
	logo: W6(12, 'agora') + 30,
	batida: 1094,
	bio: W6(12, 'agora') + 47,
};

// trechos da camera: P = celular em foco (pose de exibicao), N = mergulho no elemento (desfoca)
export type Trecho = {de: number; modo: 'P' | 'N'; giro?: number; foco?: {u: number; v: number}; dur?: number};
const n = (de: number, r: Rect, dur = 16): Trecho => ({de, modo: 'N', foco: centroDe(r), dur});
const p = (de: number, giro: number, dur = 14): Trecho => ({de, modo: 'P', giro, dur});
const juntos = (rs: Rect[]): Rect => {
	const x0 = Math.min(...rs.map((r) => r.x));
	const y0 = Math.min(...rs.map((r) => r.y));
	const x1 = Math.max(...rs.map((r) => r.x + r.w));
	const y1 = Math.max(...rs.map((r) => r.y + r.h));
	return {x: x0, y: y0, w: x1 - x0, h: y1 - y0};
};
export const TRECHOS: Trecho[] = [
	{de: 0, modo: 'P', giro: 0.1},
	n(T6.n1, RE.historico3m),
	p(T6.p1, -0.1),
	n(T6.n2, juntos(RE.semanas)),
	p(T6.p2, 0.12),
	n(T6.n3, juntos([RE.reps, RE.series])),
	p(T6.p3, -0.12),
	n(T6.n4, RE.aviso),
	p(T6.p4, 0.1),
	n(T6.n5, RE.grafico),
	p(T6.p5, -0.1),
	n(T6.n6, RE.sequencia),
	p(T6.p6, 0.12),
	n(T6.n7, RE.resumo),
	p(T6.p7, 0.0),
];
// o celular so existe ate sair pela borda de baixo
export const FIM_CELULAR = T6.fora + 18;
