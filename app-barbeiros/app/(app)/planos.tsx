// Plans (paywall): what each plan unlocks and the store price, with the
// renewal stated right above the button, the free trial with its end date,
// restore purchases and the terms/privacy links. No countdown, nothing
// pre-selected, cancel shown before buying. The plan itself comes from the
// database (minha_assinatura / meu_plano), never from the phone.
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Cartao } from '@/components/Cartao';
import { Chip } from '@/components/Chip';
import { DuoButton } from '@/components/DuoButton';
import { SecondaryButton } from '@/components/SecondaryButton';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { usePlano } from '@/features/conta/barbeiro';
import { diaCurto, useComprar, useMinhaAssinatura, useOfertas, useRestaurar } from '@/features/planos/assinatura';
import { lojaDisponivel } from '@/lib/loja';
import type { Oferta, Periodo, PlanoPago } from '@/lib/loja-tipos';
import { NOME_PLANO, PRECO_PLANO, type Plano } from '@/lib/plano';
import { color, plano as corPlano, radius, space } from '@/theme/tokens';

const O_QUE_LIBERA: Record<Plano, string[]> = {
  gratis: ['Agenda e lançamento em 2 toques', 'Serviços e combos', 'Exportar seus dados'],
  pago: ['Clientes com ficha e sumidos', 'Gastos, financeiro e meta do mês', 'Relatórios e gráficos', 'IA: insights, chat e coach de vendas', 'Comissão, extrato e MEI'],
  premium: ['Tudo do Pago', 'WhatsApp com IA (responde e agenda)', 'Automações e lista de espera', '100 mensagens de marketing por mês'],
  plus: ['Tudo do Premium', 'Instagram com IA (comentários e direct)', 'Prospecção com origem por canal', 'Personalidade da IA'],
  barbearias: ['Tudo do Premium para a equipe', 'Painel do dono e agenda da equipe', 'Relatório por barbeiro'],
  dev: ['Tudo liberado: o que o Premium Plus libera e o painel do dono', 'Conta de quem desenvolve o app (não é vendida)'],
};

const POR: Record<Periodo, string> = { mensal: 'mês', anual: 'ano' };

function fimDoTeste(dias: number): string {
  return diaCurto(new Date(Date.now() + dias * 86_400_000).toISOString());
}

function Situacao() {
  const a = useMinhaAssinatura().data;
  if (!a) return null;
  const linhas: string[] = [];
  if (a.pela_equipe) linhas.push('Seu Premium vem da equipe da barbearia: não há cobrança sua.');
  if (a.status === 'teste' && a.teste_ate) linhas.push(`Teste grátis até ${diaCurto(a.teste_ate)}. Se cancelar até lá, não paga nada.`);
  if (a.cancela_no_fim && a.renova_em) linhas.push(`Renovação desligada: o plano vale até ${diaCurto(a.renova_em)} e depois volta para o Grátis.`);
  else if (a.provedor === 'revenuecat' && a.renova_em && a.status === 'ativa') linhas.push(`Renova em ${diaCurto(a.renova_em)}, pelo mesmo preço.`);
  if (a.problema_cobranca) linhas.push('⚠ A loja não conseguiu cobrar. Confira a forma de pagamento na loja para não perder o plano.');
  if (!linhas.length) return null;
  return (
    <Cartao testID="situacao-assinatura">
      {linhas.map((l) => <Texto key={l} variante="bodySm" cor={l.startsWith('⚠') ? 'warning' : 'text'}>{l}</Texto>)}
    </Cartao>
  );
}

export default function Planos() {
  const atual = usePlano();
  const ofertas = useOfertas();
  const comprarM = useComprar();
  const restaurar = useRestaurar();
  const { destaque } = useLocalSearchParams<{ destaque?: Plano }>();
  const [periodo, setPeriodo] = useState<Periodo>('mensal');
  const [aviso, setAviso] = useState<string | null>(null);
  const lista = ofertas.data ?? [];
  const temAnual = lista.some((o) => o.periodo === 'anual');

  const ofertaDe = (p: PlanoPago): Oferta | undefined =>
    lista.find((o) => o.plano === p && o.periodo === periodo) ?? lista.find((o) => o.plano === p && o.periodo === 'mensal');

  async function assinar(o: Oferta) {
    setAviso(null);
    try {
      const r = await comprarM.mutateAsync(o);
      setAviso(r === 'desistiu' ? 'Compra não feita. Nada foi cobrado.' : `✓ Plano ${NOME_PLANO[o.plano]} ativado.`);
    } catch (e) {
      setAviso(`⚠ ${e instanceof Error ? e.message : 'A loja não concluiu a compra'}`);
    }
  }

  return (
    <TelaBase titulo="Planos" semTitulo>
      <Stack.Screen options={{ title: 'Planos' }} />
      <Texto cor="textMuted">
        A cobrança é feita pela App Store ou pelo Google Play. O preço de renovação é o mesmo da assinatura. Cancele quando quiser, pelo mesmo
        lugar onde assinou: o plano vale até o fim do período pago.
      </Texto>
      {lojaDisponivel ? null : (
        <Texto variante="bodySm" cor="textMuted" testID="sem-loja">Para assinar, use o app instalado pela App Store ou pelo Google Play.</Texto>
      )}
      <Situacao />
      {temAnual ? (
        <View style={styles.chips}>
          <Chip rotulo="Mensal" selecionado={periodo === 'mensal'} onPress={() => setPeriodo('mensal')} />
          <Chip rotulo="Anual" selecionado={periodo === 'anual'} onPress={() => setPeriodo('anual')} />
        </View>
      ) : null}
      {aviso ? <Texto peso="medium" cor={aviso.startsWith('⚠') ? 'warning' : 'text'} testID="aviso-compra">{aviso}</Texto> : null}

      {(Object.keys(NOME_PLANO) as Plano[]).filter((p) => p !== 'dev' || atual.data === 'dev').map((p) => {
        const o = p === 'gratis' || p === 'dev' ? undefined : ofertaDe(p);
        const meu = atual.data === p;
        return (
          <Cartao key={p} testID={`plano-${p}`} style={p === destaque ? styles.destaque : undefined}>
            <View style={styles.topo}>
              <View style={[styles.selo, { borderColor: corPlano[p] }]} />
              <Texto variante="h3" style={styles.flex}>{NOME_PLANO[p]}</Texto>
              {meu ? <Texto variante="caption" peso="semibold" cor="brandLip">✓ Seu plano</Texto> : null}
            </View>
            <Texto peso="semibold" numero>{o ? `${o.preco}/${POR[o.periodo]}` : PRECO_PLANO[p]}</Texto>
            {O_QUE_LIBERA[p].map((l) => (
              <Texto key={l} variante="bodySm" cor="textMuted">• {l}</Texto>
            ))}
            {o && !meu ? (
              <View style={styles.compra}>
                {o.testeDias ? (
                  <Texto variante="bodySm" testID={`teste-${p}`}>
                    {o.testeDias} dias grátis. Se cancelar até {fimDoTeste(o.testeDias)}, não paga nada; depois, {o.preco}/{POR[o.periodo]}.
                  </Texto>
                ) : null}
                <Texto variante="caption" cor="textMuted">Renova sozinho por {o.preco} por {POR[o.periodo]} até você cancelar.</Texto>
                <DuoButton testID={`assinar-${p}`} rotulo={o.testeDias ? 'Começar o teste grátis' : `Assinar o ${NOME_PLANO[p]}`}
                  carregando={comprarM.isPending && comprarM.variables?.id === o.id} desativado={comprarM.isPending}
                  onPress={() => assinar(o)} />
              </View>
            ) : null}
          </Cartao>
        );
      })}

      {lojaDisponivel ? (
        <SecondaryButton testID="restaurar" rotulo="Restaurar compras" carregando={restaurar.isPending}
          onPress={() => restaurar.mutate(undefined, {
            onSuccess: () => setAviso('✓ Compras conferidas na loja.'),
            onError: (e) => setAviso(`⚠ ${e.message}`),
          })} />
      ) : null}
      <View style={styles.links}>
        <SecondaryButton compacto rotulo="Termos de uso" testID="link-termos" onPress={() => router.push({ pathname: '/legal/[doc]', params: { doc: 'termos' } })} />
        <SecondaryButton compacto rotulo="Privacidade" testID="link-privacidade" onPress={() => router.push({ pathname: '/legal/[doc]', params: { doc: 'privacidade' } })} />
      </View>
    </TelaBase>
  );
}

const styles = StyleSheet.create({
  topo: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  flex: { flex: 1 },
  selo: { width: 14, height: 14, borderRadius: radius.pill, borderWidth: 4 },
  destaque: { borderColor: color.brand, borderWidth: 2 },
  chips: { flexDirection: 'row', gap: space[2] },
  compra: { gap: space[2], paddingTop: space[2] },
  links: { flexDirection: 'row', gap: space[2], justifyContent: 'center' },
});
