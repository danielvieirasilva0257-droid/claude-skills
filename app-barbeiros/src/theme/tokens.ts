// Design tokens, version 2 (20/11/2026): dark + Liquid Glass, from Daniel's
// references. Mirrors ESPECIFICACAO.md section 6 and DESIGN.md.
// Components never receive hex directly: always import from here.

export const color = {
  bg: '#050506',
  surface: 'rgba(255,255,255,0.06)',        // glass fill / grouped areas
  surfaceStrong: 'rgba(255,255,255,0.12)',  // active item (tab bubble, pressed row)
  // Opaque twins of surface/surfaceStrong over bg: for faces that sit on a
  // coloured lip (DuoButton), where a translucent face would show the lip.
  surfaceSolid: '#141415',
  surfaceStrongSolid: '#232324',
  border: 'rgba(255,255,255,0.10)',         // 1 px glass border
  highlight: 'rgba(255,255,255,0.22)',      // top edge shine of the glass
  overlay: 'rgba(0,0,0,0.62)',              // veil behind sheets and locks
  text: '#F4F4F0',        // 18,5:1 on bg · 16,1:1 on glass
  textMuted: '#A1A19A',   // 7,8:1 · 6,8:1
  brand: '#C5F23A', brandLip: '#9DC42A', brandSoft: 'rgba(197,242,58,0.14)', onBrand: '#0B0F02', // 15,7:1 · 14,9:1
  onLight: '#0B0B0C',     // text on the white "selected" pill
  ai: '#9AA8FF', aiSoft: 'rgba(154,168,255,0.14)',                                               // 9,1:1
  warning: '#FFB020',     // meta em risco (11:1)
  danger: '#FF6464',      // prejuízo, erro (7:1) — nunca para gasto comum
  gold: '#F5C451', goldText: '#F5C451', onGold: '#0B0F02',                                         // Premium Plus, conquista
  wave: '#FACC15',        // onda do botão de conquista
  bill: '#22C55E',        // notinhas
} as const;

export const plano = { gratis: '#8A8F98', pago: '#C5F23A', premium: '#9AA8FF', plus: '#F5C451', barbearias: '#F4F4F0' } as const;

// Mascot art colors: the same in any theme (art, not UI).
export const mascote = { nota: '#22C55E', borda: '#0F5F2D', rosto: '#DCFCE7', olho: '#0F1A14', asa: '#FFFFFF', pensando: '#1D4ED8' } as const;

// Aurora behind the top of the screens (atmosphere for the glass to refract).
export const aurora = { lima: '#C5F23A', lavanda: '#7C6CFF', laranja: '#FF6A3D' } as const;

export const font = { family: 'Inter', weight: { regular: '400', medium: '500', semibold: '600' } } as const;
export const size = { display: 34, title: 28, h2: 22, h3: 20, body: 17, bodySm: 15, caption: 13, tiny: 12 } as const;
export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48 } as const;
export const radius = { sm: 10, md: 16, lg: 24, pill: 999 } as const;

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
