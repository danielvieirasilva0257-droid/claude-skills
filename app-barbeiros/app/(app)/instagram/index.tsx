import { Stack, router } from 'expo-router';

import { LinhaMenu } from '@/components/LinhaMenu';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { PortaPlano } from '@/features/planos/PortaPlano';
import { PainelCanal } from '@/features/premium/PainelCanal';

export default function TelaInstagram() {
  return (
    <PortaPlano recurso="instagram" titulo="Instagram com IA" descricao="Responde quem comentou, respondeu story ou mandou direct. Nunca quem só curtiu."
      previa={<Texto variante="title">Instagram</Texto>}>
      <TelaBase titulo="Instagram" semTitulo>
        <Stack.Screen options={{ title: 'Instagram' }} />
        <PainelCanal tipo="instagram" />
        <Texto variante="bodySm" cor="textMuted">
          Regras da Meta que o app segue: uma resposta privada por comentário, em até 7 dias; conversa no direct só dentro de 24 h da última mensagem da pessoa.
        </Texto>
        <LinhaMenu testID="ig-caixa" rotulo="Comentários e direct" detalhe="O que chegou e o que a IA respondeu" onPress={() => router.push('/instagram/caixa')} />
        <LinhaMenu rotulo="Prospecção" detalhe="De onde vêm os clientes novos" onPress={() => router.push('/prospeccao')} />
      </TelaBase>
    </PortaPlano>
  );
}
