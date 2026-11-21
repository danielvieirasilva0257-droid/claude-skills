// Gemma 4 on the phone only where it fits, and never again after it froze the phone.
import { describe, expect, it, jest } from '@jest/globals';

import { memoriaNominalGB } from '../memoria';

const mockDevice: { totalMemory: number | null } = { totalMemory: null };
jest.mock('expo-device', () => ({ __esModule: true, get totalMemory() { return mockDevice.totalMemory; } }));
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('react-native-executorch', () => ({
  setTelemetryEnabled: () => undefined,
  models: { llm: { GEMMA4_E2B: { XNNPACK_8DA4W: {} } } },
}));
jest.mock('@/lib/funcoes', () => ({ chamarFuncao: async () => ({}) }));

const GIB = 2 ** 30;

async function carregar() {
  let m!: typeof import('../cerebro.native');
  jest.isolateModules(() => { m = require('../cerebro.native'); });
  return m;
}

describe('memória do celular', () => {
  it('arredonda para o tamanho da caixa', () => {
    expect(memoriaNominalGB(7.4 * GIB)).toBe(8);
    expect(memoriaNominalGB(5.6 * GIB)).toBe(6);
    expect(memoriaNominalGB(11.3 * GIB)).toBe(12);
    expect(memoriaNominalGB(3.7 * GIB)).toBe(4);
    expect(memoriaNominalGB(8 * GIB)).toBe(8);
  });
});

describe('Gemma 4 no celular', () => {
  it('não é oferecido com menos de 8 GB', async () => {
    mockDevice.totalMemory = 5.6 * GIB;
    const d = await (await carregar()).disponibilidadeGemma();
    expect(d).toEqual({ ok: false, motivo: 'Precisa de 8 GB de memória. Este celular tem 6 GB.' });
  });

  it('com 8 GB ou mais é oferecido como experimental', async () => {
    mockDevice.totalMemory = 7.5 * GIB;
    const d = await (await carregar()).disponibilidadeGemma();
    expect(d.ok).toBe(true);
    expect(d.motivo).toMatch(/Experimental/);
  });

  it('se o app fechou com o Gemma rodando, desliga o Gemma neste celular', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    mockDevice.totalMemory = 12 * GIB;
    await AsyncStorage.setItem('gemma4-em-uso', '1');   // the previous run never finished
    const d = await (await carregar()).disponibilidadeGemma();
    expect(d).toEqual({ ok: false, motivo: 'Travou neste celular. A IA pensa na nuvem.' });
    expect(await AsyncStorage.getItem('gemma4-em-uso')).toBeNull();
    // ...and it stays off on the next start too.
    expect((await (await carregar()).disponibilidadeGemma()).ok).toBe(false);
  });
});
