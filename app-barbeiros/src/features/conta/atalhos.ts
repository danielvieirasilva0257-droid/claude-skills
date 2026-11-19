// Screens reached from "Mais" (the rest are tabs), with the feature that
// unlocks each one. Filled phase by phase.
import type { Href } from 'expo-router';

import type { Recurso } from '@/lib/plano';

export type Atalho = { rotulo: string; detalhe: string; rota: Href; recurso: Recurso };

export const ATALHOS: Atalho[] = [];
