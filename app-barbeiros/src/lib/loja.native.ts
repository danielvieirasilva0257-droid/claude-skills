// Store bridge on phones: App Store and Google Play through RevenueCat.
// The app never decides the plan: after a purchase the RevenueCat webhook
// updates app_assinatura (assinatura-webhook) and the app reads meu_plano().
//
// RevenueCat setup (dashboard): app_user_id = barber id (logIn below);
// entitlements named pago, premium, plus, barbearias; one offering per plan
// with the same name and the $rc_monthly / $rc_annual packages.
import { Platform } from 'react-native';
import Purchases, { type PurchasesPackage } from 'react-native-purchases';

import { abrirGerenciamentoDaLoja } from './loja-links';
import type { Loja, Oferta, PlanoPago, ResultadoCompra } from './loja-tipos';

const CHAVE = Platform.select({
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS,
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID,
  default: undefined,
});

/** false in Expo Go / dev builds without the RevenueCat key: the screen explains instead of selling. */
export const lojaDisponivel = Boolean(CHAVE);

const PLANOS: PlanoPago[] = ['pago', 'premium', 'plus', 'barbearias'];
const pacotes = new Map<string, PurchasesPackage>();
let configurada = false;

export async function iniciarLoja(uid: string): Promise<void> {
  if (!lojaDisponivel) return;
  if (!configurada) {
    Purchases.configure({ apiKey: CHAVE!, appUserID: uid });
    configurada = true;
    return;
  }
  await Purchases.logIn(uid);
}

export async function sairDaLoja(): Promise<void> {
  if (!configurada) return;
  await Purchases.logOut().catch(() => undefined);
}

function diasDoTeste(p: PurchasesPackage): number | null {
  const intro = p.product.introPrice;
  if (!intro || intro.price > 0) return null;
  const porUnidade: Record<string, number> = { DAY: 1, WEEK: 7, MONTH: 30, YEAR: 365 };
  return intro.periodNumberOfUnits * (porUnidade[intro.periodUnit] ?? 1);
}

export async function carregarOfertas(): Promise<Oferta[]> {
  if (!configurada) return [];
  const todas = await Purchases.getOfferings();
  const ofertas: Oferta[] = [];
  for (const plano of PLANOS) {
    for (const p of todas.all[plano]?.availablePackages ?? []) {
      const periodo = p.packageType === 'ANNUAL' ? 'anual' : p.packageType === 'MONTHLY' ? 'mensal' : null;
      if (!periodo) continue;
      const id = `${plano}:${periodo}`;
      pacotes.set(id, p);
      ofertas.push({ id, plano, periodo, preco: p.product.priceString, testeDias: diasDoTeste(p) });
    }
  }
  return ofertas;
}

export async function comprar(oferta: Oferta): Promise<ResultadoCompra> {
  const pacote = pacotes.get(oferta.id);
  if (!pacote) throw new Error('Oferta indisponível, tente de novo');
  try {
    await Purchases.purchasePackage(pacote);
    return 'comprou';
  } catch (e) {
    if ((e as { userCancelled?: boolean }).userCancelled) return 'desistiu';
    throw new Error('A loja não concluiu a compra');
  }
}

export async function restaurarCompras(): Promise<void> {
  if (!configurada) throw new Error('Loja indisponível neste app');
  await Purchases.restorePurchases();
}

export async function gerenciarAssinatura(loja: Loja): Promise<void> {
  const daqui = (Platform.OS === 'ios' && loja === 'app_store') || (Platform.OS === 'android' && loja === 'play_store');
  if (configurada && daqui) {
    await Purchases.showManageSubscriptions();
    return;
  }
  await abrirGerenciamentoDaLoja(loja);
}
