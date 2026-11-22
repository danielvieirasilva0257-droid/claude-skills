// Channel status + connection (WhatsApp or Instagram), shared by both screens.
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Campo } from '@/components/Campo';
import { Cartao } from '@/components/Cartao';
import { Chip } from '@/components/Chip';
import { DuoButton } from '@/components/DuoButton';
import { SecondaryButton } from '@/components/SecondaryButton';
import { Texto } from '@/components/Texto';
import { space } from '@/theme/tokens';

import { useCanal, useConectarCanal, useIaNoCanal, type Canal } from './api';

const NOME = { whatsapp: 'WhatsApp', instagram: 'Instagram' } as const;

export function PainelCanal({ tipo }: { tipo: Canal['tipo'] }) {
  const canal = useCanal(tipo);
  const conectar = useConectarCanal();
  const ia = useIaNoCanal();
  const [conta, setConta] = useState('');
  const [token, setToken] = useState('');
  const c = canal.data;

  if (c) {
    return (
      <Cartao testID={`canal-${tipo}`}>
        <Texto peso="semibold">✓ {NOME[tipo]} conectado</Texto>
        <Texto variante="bodySm" cor="textMuted">{c.nome_exibicao ?? c.conta_externa}</Texto>
        <View style={styles.linha}>
          <Texto variante="bodySm" style={styles.flex}>A IA responde os clientes</Texto>
          <Chip testID={`ia-${tipo}`} rotulo={c.ia_ativa ? 'Ligada' : 'Desligada'} selecionado={c.ia_ativa}
            onPress={() => ia.mutate({ tipo, ia_ativa: !c.ia_ativa })} />
        </View>
        <SecondaryButton compacto tom="perigo" rotulo="Desconectar" onPress={() => conectar.mutate({ tipo, desconectar: true })} />
      </Cartao>
    );
  }
  return (
    <Cartao testID={`conectar-${tipo}`}>
      <Texto peso="semibold">Conectar o {NOME[tipo]}</Texto>
      <Texto variante="bodySm" cor="textMuted">
        {tipo === 'whatsapp'
          ? 'Usa a API oficial do WhatsApp Business (Meta). Você precisa de um número de WhatsApp Business verificado.'
          : 'Usa a API oficial do Instagram (Meta). A conta precisa ser profissional e ligada a uma página do Facebook.'}
      </Texto>
      <Campo rotulo={tipo === 'whatsapp' ? 'ID do número (phone_number_id)' : 'ID da conta do Instagram'} value={conta} onChangeText={setConta} />
      <Campo rotulo="Token de acesso" value={token} onChangeText={setToken} secureTextEntry ajuda="Fica guardado só no servidor, nunca no celular." />
      {conectar.isError ? <Texto cor="danger">⚠ {conectar.error.message}</Texto> : null}
      <DuoButton rotulo="Conectar" carregando={conectar.isPending} desativado={!conta.trim()}
        onPress={() => conectar.mutate({ tipo, conta_externa: conta.trim(), token: token.trim() || undefined })} />
    </Cartao>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  flex: { flex: 1 },
});
