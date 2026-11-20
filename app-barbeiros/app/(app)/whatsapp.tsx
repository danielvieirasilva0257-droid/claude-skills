// WhatsApp: connection, AI on/off, conversations. In development builds a
// button simulates a client message (local functions, simulated mode).
import { Stack } from 'expo-router';
import { useState } from 'react';

import { Campo } from '@/components/Campo';
import { SecondaryButton } from '@/components/SecondaryButton';
import { TelaBase } from '@/components/TelaBase';
import { Texto } from '@/components/Texto';
import { useQueryClient } from '@tanstack/react-query';
import { PortaPlano } from '@/features/planos/PortaPlano';
import { useCanal } from '@/features/premium/api';
import { ListaConversas } from '@/features/premium/ListaConversas';
import { PainelCanal } from '@/features/premium/PainelCanal';

const FUNCOES = process.env.EXPO_PUBLIC_FUNCTIONS_URL;

function Simulador() {
  const canal = useCanal('whatsapp');
  const qc = useQueryClient();
  const [texto, setTexto] = useState('Oi, quero marcar um horário pra cortar');
  if (process.env.EXPO_PUBLIC_GALERIA !== '1' || !FUNCOES || !canal.data) return null;
  async function simular() {
    const id = `sim-${texto.length}-${texto.slice(0, 8)}`;
    await fetch(`${FUNCOES}/whatsapp-webhook`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ entry: [{ changes: [{ value: {
      metadata: { phone_number_id: canal.data!.conta_externa }, contacts: [{ wa_id: '5511977776666', profile: { name: 'Cliente de teste' } }],
      messages: [{ from: '5511977776666', id, type: 'text', text: { body: texto } }] } }] }] }) });
    await qc.invalidateQueries({ queryKey: ['conversas'] });
  }
  return (
    <>
      <Texto variante="caption" cor="textMuted">Teste (só no ambiente de desenvolvimento)</Texto>
      <Campo testID="simular-texto" rotulo="Mensagem de um cliente" value={texto} onChangeText={setTexto} />
      <SecondaryButton testID="simular-enviar" compacto rotulo="Simular mensagem recebida" onPress={simular} />
    </>
  );
}

export default function TelaWhatsapp() {
  return (
    <PortaPlano recurso="whatsapp" titulo="WhatsApp com IA" descricao="A IA responde, oferece horários livres e agenda. Você assume quando quiser."
      previa={<Texto variante="title">WhatsApp</Texto>}>
      <TelaBase titulo="WhatsApp" semTitulo>
        <Stack.Screen options={{ title: 'WhatsApp' }} />
        <PainelCanal tipo="whatsapp" />
        <Texto variante="h3" accessibilityRole="header">Conversas</Texto>
        <ListaConversas canal="whatsapp" />
        <Simulador />
      </TelaBase>
    </PortaPlano>
  );
}
