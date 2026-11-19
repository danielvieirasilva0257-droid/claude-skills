// Chart colors, validated with the dataviz skill's validate_palette.js (19/11/2026):
//   anterior + atual: one green in two steps, ordinal check ALL PASS on white
//   (light end 2.32:1). Heatmap: sequential, one hue, light → dark (monotone PASS).
// Status colors (warning, danger) stay reserved and always come with a sign.
import { color } from './tokens';

export const grafico = {
  atual: color.brand,
  anterior: '#74B98A',
  deducao: color.textMuted,
  negativo: color.danger,
  grade: color.border,
  calor: ['#DCFCE7', '#9CCFAB', '#4FA56B', color.brand, color.brandLip] as const,
  vazio: color.surface,
} as const;
