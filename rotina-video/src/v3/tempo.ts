import voz from './voz.json';

// Linha do tempo do Rotina v3 (30 fps, 900 quadros = 30 s), pelos tempos reais da voz (WhisperX na faixa final, 1,1x)
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
	if (!w) throw new Error(`palavra "${word}" nao achada na fala ${ln}`);
	return w;
};
// quadro em que a palavra comeca / termina (fala de 1 a 13, nth = qual ocorrencia)
export const W = (ln: number, word: string, nth = 0) => Math.round(find(ln, word, nth).start * FPS);
export const WE = (ln: number, word: string, nth = 0) => Math.round(find(ln, word, nth).end * FPS);
export const LINE = (ln: number) => ({start: Math.round(LINES[ln - 1].start * FPS), end: Math.round(LINES[ln - 1].end * FPS)});
