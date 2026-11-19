// Design tokens: copied verbatim from ESPECIFICACAO.md section 6.
// Components never receive hex directly: always import from here.

export const color = {
  bg: '#FFFFFF', surface: '#F4F8F6', border: '#E2E8E5',
  text: '#0F1A14',        // 17,8:1
  textMuted: '#5B6B63',   // 5,6:1
  brand: '#15803D', brandLip: '#0F5F2D', brandSoft: '#DCFCE7', onBrand: '#FFFFFF', // 5,0:1
  ai: '#1D4ED8', aiSoft: '#EFF6FF',                                               // 6,7:1
  warning: '#B45309',     // meta em risco
  danger: '#C62828',      // prejuízo, erro (nunca para gasto comum)
  gold: '#E3B341', goldText: '#8A6A12', onGold: '#0F1A14',                         // Premium Plus, conquista
  wave: '#FACC15',        // onda do botão de conquista
  bill: '#22C55E',        // notinhas
} as const;

export const plano = { gratis: '#8A8F98', pago: '#15803D', premium: '#1D4ED8', plus: '#E3B341', barbearias: '#0A0A0B' } as const;

export const font = { family: 'Inter', weight: { regular: '400', medium: '500', semibold: '600' } } as const;
export const size = { display: 34, title: 28, h2: 22, h3: 20, body: 17, bodySm: 15, caption: 13, tiny: 12 } as const;
export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48 } as const;
export const radius = { sm: 8, md: 12, lg: 16, pill: 999 } as const;

export const motion = {
  easeOut: [0.23, 1, 0.32, 1],      // padrão
  easeInOut: [0.45, 0, 0.55, 1],    // subida e descida suaves
  easeSoftOut: [0.33, 1, 0.68, 1],
  celebrate: [0.34, 1.56, 0.64, 1], // com overshoot
  press: { duration: 60 },
  springBack: { stiffness: 500, damping: 18, mass: 0.6 },   // botão Duolingo
  springCalm: { stiffness: 620, damping: 36, mass: 0.6 },   // sheet, modal, abas (sem quique)
  screen: 300, stagger: 40, countUp: 800,
} as const;
