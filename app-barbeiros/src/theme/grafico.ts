// Chart colors (dark, v2), validated with the dataviz skill's validate_palette.js
// (20/11/2026, --mode dark, surface #111113): anterior + atual = one lime in two
// steps, ordinal ALL PASS. Heatmap: sequential, one hue, dark → bright (monotone PASS).
// Status colors (warning, danger) stay reserved and always come with a sign.
import { color } from './tokens';

export const grafico = {
  atual: color.brand,
  anterior: '#6E8F1F',
  deducao: color.textMuted,
  negativo: color.danger,
  grade: color.border,
  calor: ['#26300F', '#46601A', '#6E8F1F', '#A3CC2E', color.brand] as const,
  vazio: color.surface,
} as const;
