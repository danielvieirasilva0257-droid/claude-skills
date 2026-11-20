// Where each store manages (and cancels) a subscription: always the same
// channel where it was bought.
import { Linking } from 'react-native';

import type { Loja } from './loja-tipos';

export const ONDE_CANCELAR: Record<Exclude<Loja, null>, string> = {
  app_store: 'Ajustes do iPhone › seu nome › Assinaturas',
  play_store: 'Google Play › foto do perfil › Pagamentos e assinaturas › Assinaturas',
  stripe: 'link de gerenciamento enviado no e-mail da compra',
  manual: 'sem cobrança (plano de teste)',
};

const URL: Partial<Record<Exclude<Loja, null>, string>> = {
  app_store: 'https://apps.apple.com/account/subscriptions',
  play_store: 'https://play.google.com/store/account/subscriptions',
};

export async function abrirGerenciamentoDaLoja(loja: Loja): Promise<void> {
  const url = loja ? URL[loja] : undefined;
  if (!url) throw new Error('Esta assinatura não é de loja');
  await Linking.openURL(url);
}
