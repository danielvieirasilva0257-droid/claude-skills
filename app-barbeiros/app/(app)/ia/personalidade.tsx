// Personalidade da IA (Premium Plus): tone, emojis, signature and words to
// avoid. Used by the WhatsApp/Instagram attendant and the chat.
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Campo } from '@/components/Campo';
import { Cartao } from '@/components/Cartao';
import { Chip } from '@/components/Chip';
import { StatusButton } from '@/components/StatusButton';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { useBarbeiro } from '@/features/conta/barbeiro';
import { PortaPlano } from '@/features/planos/PortaPlano';
import { useSalvarPersonalidade, type Personalidade } from '@/features/premium/api';
import { space } from '@/theme/tokens';

const TONS: Record<Personalidade['tom'], { nome: string; exemplo: string }> = {
  parceiro: { nome: 'Parceiro', exemplo: 'Fala, beleza? Sábado tenho às 10h e às 10h45. Qual fica melhor pra você?' },
  formal: { nome: 'Cordial', exemplo: 'Olá, tudo bem? No sábado tenho horários às 10h e às 10h45. Qual prefere?' },
  descontraido: { nome: 'Descontraído', exemplo: 'Opa! Sábado tem 10h e 10h45 livres. Bora?' },
};

function Editor() {
  const barbeiro = useBarbeiro();
  const salvar = useSalvarPersonalidade();
  const [tom, setTom] = useState<Personalidade['tom']>('parceiro');
  const [emojis, setEmojis] = useState(false);
  const [assinatura, setAssinatura] = useState('');
  const [evitar, setEvitar] = useState('');

  useEffect(() => {
    const p = barbeiro.data?.ia_personalidade;
    if (!p) return;
    setTom(p.tom); setEmojis(p.emojis); setAssinatura(p.assinatura); setEvitar(p.evitar.join(', '));
  }, [barbeiro.data]);

  const exemplo = `${TONS[tom].exemplo}${emojis ? ' 💈' : ''}${assinatura ? `\n${assinatura}` : ''}`;
  return (
    <TelaBase titulo="Personalidade" semTitulo>
      <Stack.Screen options={{ title: 'Personalidade da IA' }} />
      <Texto cor="textMuted">Como a IA fala com os seus clientes no WhatsApp e no Instagram.</Texto>
      <Texto variante="bodySm" peso="medium">Tom</Texto>
      <View style={styles.chips}>
        {(Object.keys(TONS) as Personalidade['tom'][]).map((t) => <Chip key={t} testID={`tom-${t}`} rotulo={TONS[t].nome} selecionado={tom === t} onPress={() => setTom(t)} />)}
      </View>
      <View style={styles.chips}>
        <Chip rotulo="Usa emoji" selecionado={emojis} onPress={() => setEmojis(!emojis)} />
      </View>
      <Campo rotulo="Assinatura (opcional)" value={assinatura} onChangeText={setAssinatura} placeholder="Barbearia do Zé" />
      <Campo rotulo="Palavras para evitar" value={evitar} onChangeText={setEvitar} placeholder="promoção, desconto" ajuda="Separe por vírgula." />
      <Cartao tom="ia" testID="exemplo-personalidade">
        <Texto variante="caption" cor="ai" peso="semibold">Exemplo de resposta</Texto>
        <Texto variante="bodySm">{exemplo}</Texto>
      </Cartao>
      <StatusButton testID="personalidade-salvar" acao={async () => { await salvar.mutateAsync({ tom, emojis, assinatura: assinatura.trim(),
        evitar: evitar.split(',').map((x) => x.trim()).filter(Boolean) }); }} />
    </TelaBase>
  );
}

export default function TelaPersonalidade() {
  return (
    <PortaPlano recurso="personalidade" titulo="Personalidade da IA" descricao="O jeito de falar da IA com os seus clientes."
      previa={<Texto variante="title">Personalidade</Texto>}>
      <Editor />
    </PortaPlano>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
});
