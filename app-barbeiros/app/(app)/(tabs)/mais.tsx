// Mais: account, plan, work settings, export data (every plan), cancel
// plan (always visible, no guilt), sign out.
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Campo } from '@/components/Campo';
import { Chip } from '@/components/Chip';
import { DuoButton } from '@/components/DuoButton';
import { LinhaMenu } from '@/components/LinhaMenu';
import { SecondaryButton } from '@/components/SecondaryButton';
import { StatusButton } from '@/components/StatusButton';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { sair, useSessao } from '@/features/auth/sessao';
import { useMinhaBarbearia } from '@/features/barbearia/api';
import { diaCurto, useMinhaAssinatura } from '@/features/planos/assinatura';
import { gerenciarAssinatura } from '@/lib/loja';
import { ONDE_CANCELAR } from '@/lib/loja-links';
import { NOME_PAGAMENTO, useBarbeiro, usePlano, type FormaPagamento } from '@/features/conta/barbeiro';
import { ATALHOS } from '@/features/conta/atalhos';
import { exportarCSV, NOME_EXPORTACAO, type TipoExportacao } from '@/features/conta/exportar';
import { libera, NOME_PLANO } from '@/lib/plano';
import { queryClient } from '@/lib/queryClient';
import { supabase } from '@/lib/supabase';
import { space } from '@/theme/tokens';

type Folha = 'exportar' | 'cancelar' | 'taxas' | null;

function pct(v: number | string | undefined) {
  return v === undefined ? '' : String(Math.round(Number(v) * 10000) / 100).replace('.', ',');
}

export default function Mais() {
  const email = useSessao((s) => s.session?.user.email ?? null);
  const barbeiro = useBarbeiro();
  const plano = usePlano();
  const qc = useQueryClient();
  const [folha, setFolha] = useState<Folha>(null);
  const [tipo, setTipo] = useState<TipoExportacao>('atendimentos');
  const [aviso, setAviso] = useState<string | null>(null);
  const [debito, setDebito] = useState('');
  const [credito, setCredito] = useState('');
  const [padrao, setPadrao] = useState<FormaPagamento>('pix');
  const [saindo, setSaindo] = useState(false);
  const meuPlano = plano.data ?? 'gratis';
  const minha = useMinhaBarbearia();
  const assinatura = useMinhaAssinatura();

  function abrirTaxas() {
    setDebito(pct(barbeiro.data?.taxa_debito));
    setCredito(pct(barbeiro.data?.taxa_credito));
    setPadrao(barbeiro.data?.pagamento_padrao ?? 'pix');
    setFolha('taxas');
  }

  async function salvarTaxas() {
    const d = Number(debito.replace(',', '.') || 0);
    const c = Number(credito.replace(',', '.') || 0);
    if (!(d >= 0 && d <= 20 && c >= 0 && c <= 20)) throw new Error('Use um número de 0 a 20');
    const { error } = await supabase.from('barbeiros')
      .update({ taxa_debito: d / 100, taxa_credito: c / 100, pagamento_padrao: padrao }).eq('id', barbeiro.data!.id);
    if (error) throw new Error('Não salvou');
    await qc.invalidateQueries({ queryKey: ['barbeiro'] });
  }

  async function exportar() {
    setAviso(null);
    const n = await exportarCSV(tipo, barbeiro.data!.id);
    setAviso(`✓ ${n} linha(s) exportada(s)`);
  }

  return (
    <TelaBase titulo="Mais">
      <View style={styles.bloco}>
        <Texto variante="caption" cor="textMuted">Conta</Texto>
        <Texto peso="semibold">{barbeiro.data?.nome ?? '—'}</Texto>
        <Texto variante="bodySm" cor="textMuted" testID="mais-email">{email ?? '—'}</Texto>
      </View>

      <View>
        <LinhaMenu testID="mais-plano" rotulo={`Plano ${NOME_PLANO[meuPlano]}`} detalhe="Ver o que cada plano libera" onPress={() => router.push('/planos')} />
        <LinhaMenu testID="mais-servicos" rotulo="Serviços" detalhe="Preços, duração, recorrência e combos" onPress={() => router.push('/servicos')} />
        <LinhaMenu testID="mais-taxas" rotulo="Maquininha e pagamento"
          detalhe={`Débito ${pct(barbeiro.data?.taxa_debito)}% · Crédito ${pct(barbeiro.data?.taxa_credito)}%`} onPress={abrirTaxas} />
        <LinhaMenu testID="mais-barbearia" rotulo={minha.data ? minha.data.nome : 'Barbearia'}
          detalhe={minha.data ? (minha.data.papel === 'dono' ? 'Você é o dono · painel, equipe e agenda' : `Equipe de ${minha.data.dono}`)
            : 'Entrar com o código do dono ou criar a sua'}
          onPress={() => router.push('/barbearia')} />
        {ATALHOS.map((a) => (
          <LinhaMenu key={a.rotulo} testID={a.testID} rotulo={a.rotulo} detalhe={a.detalhe} bloqueado={!libera(meuPlano, a.recurso)} onPress={() => router.push(a.rota)} />
        ))}
      </View>

      <View>
        <Texto variante="caption" cor="textMuted">Seus dados</Texto>
        <LinhaMenu testID="mais-exportar" rotulo="Exportar meus dados" detalhe="Planilha CSV, em qualquer plano" onPress={() => setFolha('exportar')} />
        <LinhaMenu testID="mais-cancelar" rotulo="Cancelar plano" detalhe={meuPlano === 'gratis' ? 'Você está no Grátis' : `Plano ${NOME_PLANO[meuPlano]}`}
          onPress={() => setFolha('cancelar')} />
        <LinhaMenu testID="mais-termos" rotulo="Termos de uso" onPress={() => router.push({ pathname: '/legal/[doc]', params: { doc: 'termos' } })} />
        <LinhaMenu testID="mais-privacidade" rotulo="Política de privacidade" onPress={() => router.push({ pathname: '/legal/[doc]', params: { doc: 'privacidade' } })} />
      </View>

      <SecondaryButton testID="mais-sair" rotulo="Sair" tom="perigo" carregando={saindo}
        onPress={async () => {
          setSaindo(true);
          await sair();
          queryClient.clear();
        }} />

      <BottomSheet aberto={folha === 'exportar'} onFechar={() => setFolha(null)} titulo="Exportar meus dados" testID="exportar-sheet">
        <Texto cor="textMuted">Gera uma planilha que abre no Excel ou no Google Planilhas. Seus dados são seus.</Texto>
        <View style={styles.chips}>
          {(Object.keys(NOME_EXPORTACAO) as TipoExportacao[]).map((t) => (
            <Chip key={t} rotulo={NOME_EXPORTACAO[t]} selecionado={tipo === t} onPress={() => setTipo(t)} />
          ))}
        </View>
        <StatusButton testID="exportar-botao" rotulo="Exportar" rotuloCarregando="Gerando…" rotuloSucesso="Pronto" acao={exportar} />
        {aviso ? <Texto variante="bodySm" cor="brandLip" testID="exportar-aviso">{aviso}</Texto> : null}
      </BottomSheet>

      <BottomSheet aberto={folha === 'cancelar'} onFechar={() => setFolha(null)} titulo="Cancelar plano" testID="cancelar-sheet">
        {meuPlano === 'gratis' ? (
          <Texto>Você está no plano Grátis. Não há nada para cancelar nem cobrança nenhuma.</Texto>
        ) : assinatura.data?.pela_equipe ? (
          <Texto testID="cancelar-equipe">
            Seu Premium vem da equipe da barbearia: não há cobrança sua. Para sair da equipe, vá em Mais › {minha.data?.nome ?? 'Barbearia'}.
          </Texto>
        ) : assinatura.data?.provedor === 'revenuecat' && assinatura.data.loja ? (
          <>
            <Texto>
              {assinatura.data.cancela_no_fim && assinatura.data.renova_em
                ? `A renovação já está desligada: o plano vale até ${diaCurto(assinatura.data.renova_em)} e depois volta para o Grátis.`
                : `Você assinou pela ${assinatura.data.loja === 'app_store' ? 'App Store' : assinatura.data.loja === 'play_store' ? 'Google Play' : 'loja'}. `
                  + 'Cancelando, o plano continua até o fim do período já pago e depois volta para o Grátis. Seus dados continuam aqui.'}
            </Texto>
            <Texto variante="bodySm" cor="textMuted">Onde cancelar: {ONDE_CANCELAR[assinatura.data.loja]}.</Texto>
            {assinatura.data.cancela_no_fim ? null : (
              <DuoButton testID="cancelar-na-loja" rotulo="Cancelar na loja" aparencia="erro"
                onPress={() => gerenciarAssinatura(assinatura.data!.loja).catch((e: Error) => setAviso(e.message))} />
            )}
          </>
        ) : (
          <Texto testID="cancelar-manual">
            Este plano foi liberado sem cobrança (conta de teste). Não há nada para cancelar na loja; se quiser voltar para o Grátis, fale com o suporte.
          </Texto>
        )}
        <SecondaryButton rotulo="Fechar" onPress={() => setFolha(null)} />
      </BottomSheet>

      <BottomSheet aberto={folha === 'taxas'} onFechar={() => setFolha(null)} titulo="Maquininha e pagamento" testID="taxas-sheet">
        <View style={styles.dupla}>
          <View style={styles.flex}>
            <Campo testID="taxa-debito" rotulo="Taxa no débito (%)" value={debito} onChangeText={setDebito} keyboardType="decimal-pad" inputMode="decimal" />
          </View>
          <View style={styles.flex}>
            <Campo testID="taxa-credito" rotulo="Taxa no crédito (%)" value={credito} onChangeText={setCredito} keyboardType="decimal-pad" inputMode="decimal" />
          </View>
        </View>
        <Texto variante="bodySm" peso="medium">Pagamento mais comum</Texto>
        <View style={styles.chips}>
          {(['pix', 'dinheiro', 'debito', 'credito'] as FormaPagamento[]).map((f) => (
            <Chip key={f} rotulo={NOME_PAGAMENTO[f]} selecionado={padrao === f} onPress={() => setPadrao(f)} />
          ))}
        </View>
        <StatusButton testID="taxas-salvar" acao={salvarTaxas} />
      </BottomSheet>
    </TelaBase>
  );
}

const styles = StyleSheet.create({
  bloco: { gap: space[1] },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  dupla: { flexDirection: 'row', gap: space[3] },
  flex: { flex: 1 },
});
