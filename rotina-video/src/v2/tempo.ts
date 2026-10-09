import voz from './voz.json';

// Timeline of the v2 video (30 fps, 900 frames = 30 s), driven by the real voice timings (WhisperX on the final track)
export const FPS = 30;
export const END = 900;

type Word = {word: string; start: number; end: number};
type Line = {n: number; text: string; start: number; end: number; words: Word[]};
export const LINES = (voz as unknown as {lines: Line[]}).lines;

const norm = (s: string) =>
	s
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]/g, '');

const find = (ln: number, word: string, nth: number) => {
	const hits = LINES[ln - 1].words.filter((w) => norm(w.word) === norm(word));
	const w = hits[nth];
	if (!w) throw new Error(`word "${word}" not found in line ${ln}`);
	return w;
};
// Frame where a word starts / ends (line is 1-based, nth = which occurrence)
export const W = (ln: number, word: string, nth = 0) => Math.round(find(ln, word, nth).start * FPS);
export const WE = (ln: number, word: string, nth = 0) => Math.round(find(ln, word, nth).end * FPS);
export const LINE = (ln: number) => ({start: Math.round(LINES[ln - 1].start * FPS), end: Math.round(LINES[ln - 1].end * FPS)});

// Music grid: 120 BPM, beat = 15 frames; beats at 10 + 15k, bar downbeats at 40 + 60m
export const beat = (k: number) => 10 + 15 * k;
export const bar = (m: number) => 40 + 60 * m;

// Sections (frames)
export const SEC = {
	hook: 0,
	iris: 156, // the red dot of "?" opens into the red reveal
	drop: 160, // "Com o app Rotina" + music drop (bar)
	habitos: 190, // phone enters (beat)
	metricas: 266,
	treino: 334, // whip spin, lands on the bar at 340
	estilos: 393,
	series: 478,
	financeiro: 574, // flip, lands on the bar at 580
	transacoes: 632,
	despesas: 706,
	final: 790, // "Hábitos, treino e dinheiro" (beat)
	zoom: 838, // zoom through the screen
	cta: 846, // red end card ("Baixe" at 843)
	finalHit: 880, // bar, end of "bio"
	end: END,
};
