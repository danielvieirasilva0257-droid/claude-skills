import {Easing, interpolate} from 'remotion';

export const FPS = 30;
export const s = (sec: number) => Math.round(sec * FPS);

// Voice lines: start (s) must match STARTS in audio/mix.sh; dur = trimmed wav length (s)
export const VO = [
	{start: 0.3, dur: 3.57, text: 'Controle da sua rotina... em planilhas de Excel, no celular?'},
	{start: 4.1, dur: 5.66, text: 'Você tem seus treinos montados e sabe quanto faturou. Mas você realmente tem controle disso?'},
	{start: 10.1, dur: 1.86, text: 'Com o app Rotina, você tem.'},
	{start: 12.4, dur: 4.18, text: 'Comece pelo checklist de hábitos: marque e desmarque seus afazeres do dia.'},
	{start: 16.9, dur: 3.71, text: 'E acompanhe gráficos completos com as suas métricas e a sua evolução.'},
	{start: 22.2, dur: 3.53, text: 'No treino, você monta seus treinos diários e o seu plano semanal.'},
	{start: 26.0, dur: 4.95, text: 'Escolha o estilo de cada semana: força, hipertrofia, resistência ou deload.'},
	{start: 31.0, dur: 4.91, text: 'Registre carga, repetições e séries, e veja o gráfico completo da sua evolução.'},
	{start: 36.5, dur: 2.79, text: 'No financeiro, o controle total está na sua mão.'},
	{start: 39.6, dur: 4.66, text: 'Veja cada entrada e cada saída, seus bancos, seus cartões e suas despesas.'},
	{start: 44.45, dur: 5.5, text: 'Configure despesas fixas ou pontuais, e tenha um cronograma completo dos seus gastos por categoria.'},
	{start: 50.4, dur: 3.67, text: 'Treino, finanças e hábitos. Tudo em um só lugar.'},
	{start: 54.5, dur: 2.68, text: 'Rotina. Sua vida no controle.'},
];

// Frame at which `word` (first match at/after `nth` occurrence) is spoken in voice line i,
// estimated from its character position in the sentence.
export const wordAt = (i: number, word: string, nth = 0) => {
	const {start, dur, text} = VO[i];
	let idx = -1;
	for (let k = 0; k <= nth; k++) idx = text.toLowerCase().indexOf(word.toLowerCase(), idx + 1);
	if (idx < 0) idx = 0;
	return s(start + (idx / text.length) * dur);
};

// Section boundaries (on the music's bars, 120 BPM)
export const SEC = {
	drop: s(10),
	habits: s(12),
	treino: s(22),
	fin: s(36),
	outro: s(50),
	finalHit: s(58),
	end: s(60),
};

// AE-like keyframes: [frame, value, easing?]; easing applies to the segment ending at that key
export const easyEase = Easing.bezier(0.65, 0, 0.35, 1);
type Key = [number, number, ((t: number) => number)?];
export const kf = (f: number, keys: Key[]) => {
	if (f <= keys[0][0]) return keys[0][1];
	for (let i = 1; i < keys.length; i++) {
		const [f1, v1, e] = keys[i];
		const [f0, v0] = keys[i - 1];
		if (f <= f1) {
			if (f1 === f0) return v1;
			return interpolate(f, [f0, f1], [v0, v1], {easing: e ?? easyEase});
		}
	}
	return keys[keys.length - 1][1];
};
