// How much memory the phone has, the way the box says it (8 GB, 12 GB...).
// Gemma 4 E2B loads ~3.2 GB and grows while it writes: on Daniel's phone it
// froze the screen (21/11/2026), so it is offered only from 8 GB up and stays
// experimental. Android reports a bit less than the box (the system keeps
// part), so the number is rounded up to the nominal size.
import * as Device from 'expo-device';

export const MEMORIA_MINIMA_GB = 8;
const NOMINAIS = [1, 2, 3, 4, 6, 8, 12, 16, 18, 24, 32];

/** Bytes reported by the system -> nominal size in GB (7.4 GiB -> 8). */
export function memoriaNominalGB(bytes: number): number {
  const gib = bytes / 2 ** 30;
  return NOMINAIS.find((n) => n >= gib - 0.05) ?? Math.ceil(gib);
}

/** The phone's memory in GB, or null when the system does not say (web, tests). */
export function memoriaDoCelularGB(): number | null {
  const b = Device.totalMemory;
  return typeof b === 'number' && b > 0 ? memoriaNominalGB(b) : null;
}
