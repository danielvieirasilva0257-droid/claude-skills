// Store bridge on the web: there is no App Store or Google Play here, so the
// plans screen shows the prices and says where to subscribe. The phone
// version is loja.native.ts (RevenueCat).
import type { Loja, Oferta, ResultadoCompra } from './loja-tipos';
import { abrirGerenciamentoDaLoja } from './loja-links';

export const lojaDisponivel = false;

export async function iniciarLoja(_uid: string): Promise<void> {}
export async function sairDaLoja(): Promise<void> {}
export async function carregarOfertas(): Promise<Oferta[]> {
  return [];
}
export async function comprar(_oferta: Oferta): Promise<ResultadoCompra> {
  throw new Error('Assine pelo app instalado da App Store ou do Google Play');
}
export async function restaurarCompras(): Promise<void> {
  throw new Error('Abra o app no celular para restaurar');
}
export async function gerenciarAssinatura(loja: Loja): Promise<void> {
  await abrirGerenciamentoDaLoja(loja);
}
