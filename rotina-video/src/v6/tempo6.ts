import voz from './voz.json';

// Tempos do v6 (30 fps): tudo sai do voz.json (voz Leda a 1,0x, pausas de 0,5 s entre as falas).
export const FPS = 30;
export const END6 = 1150; // 38,33 s (a trilha tem a mesma duracao)

type Word = {word: string; start: number; end: number};
type Line = {n: number; text: string; start: number; end: number; words: Word[]};
export const LINES6 = (voz as unknown as {lines: Line[]}).lines;

const norm = (s: string) => s.toLowerCase().replace(/[.,!?;:]/g, '');
const find = (ln: number, word: string, nth = 0) => {
	const ws = LINES6[ln - 1].words.filter((w) => norm(w.word) === norm(word));
	if (!ws[nth]) throw new Error(`palavra nao encontrada: fala ${ln} "${word}" #${nth}`);
	return ws[nth];
};
// quadro em que a palavra comeca / termina
export const W6 = (ln: number, word: string, nth = 0) => Math.round(find(ln, word, nth).start * FPS);
export const WE6 = (ln: number, word: string, nth = 0) => Math.round(find(ln, word, nth).end * FPS);
export const LINE6 = (ln: number) => ({start: Math.round(LINES6[ln - 1].start * FPS), end: Math.round(LINES6[ln - 1].end * FPS)});
