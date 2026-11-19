// Component gallery for prints, animation frames and review. Only exists in
// builds made with EXPO_PUBLIC_GALERIA=1 (never in the store build).
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomSheet } from '@/components/BottomSheet';
import { Cartao } from '@/components/Cartao';
import { Chip } from '@/components/Chip';
import { ConquistaButton } from '@/components/ConquistaButton';
import { DuoButton } from '@/components/DuoButton';
import { Carregando, EstadoErro, EstadoVazio } from '@/components/Estado';
import { HoldToConfirm } from '@/components/HoldToConfirm';
import { InsightCard } from '@/components/InsightCard';
import { LockedScreen } from '@/components/LockedScreen';
import { Mascote, type EstadoMascote } from '@/components/Mascote';
import { MetaRing } from '@/components/MetaRing';
import { SecondaryButton } from '@/components/SecondaryButton';
import { StatusButton } from '@/components/StatusButton';
import { Texto } from '@/components/Texto';
import { color, space } from '@/theme/tokens';

const espera = (ms: number) => new Promise<void>((ok) => setTimeout(ok, ms));

function Secao({ titulo, children, testID }: { titulo: string; children: React.ReactNode; testID?: string }) {
  return (
    <View style={styles.secao} testID={testID}>
      <Texto variante="h3" accessibilityRole="header">
        {titulo}
      </Texto>
      {children}
    </View>
  );
}

export default function Galeria() {
  const [chips, setChips] = useState<Record<string, boolean>>({ Corte: true, Barba: false });
  const [gaveta, setGaveta] = useState(false);
  const [apagado, setApagado] = useState(false);
  const [mascote, setMascote] = useState<EstadoMascote>('parado');
  const [conquistas, setConquistas] = useState(0);

  if (process.env.EXPO_PUBLIC_GALERIA !== '1') {
    return (
      <SafeAreaView style={styles.safe}>
        <Texto>Galeria indisponível.</Texto>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.lista}>
        <Texto variante="title" accessibilityRole="header">
          Componentes
        </Texto>

        <Secao titulo="ConquistaButton" testID="secao-conquista">
          <View style={styles.palco}>
            <ConquistaButton testID="conquista" rotulo="Fechar o caixa" onPress={() => setConquistas((n) => n + 1)} />
          </View>
          <Texto variante="caption" cor="textMuted" testID="conquistas">
            Disparos: {conquistas}
          </Texto>
          <View style={styles.palco}>
            <ConquistaButton testID="conquista-3d" rotulo="Meta batida (giro 3D)" giro3d onPress={() => undefined} />
          </View>
          <ConquistaButton rotulo="Desativado" desativado onPress={() => undefined} />
        </Secao>

        <Secao titulo="DuoButton">
          <DuoButton testID="duo" rotulo="+ Atendimento" onPress={() => undefined} />
          <DuoButton rotulo="Desativado" desativado />
          <DuoButton rotulo="Carregando" carregando />
        </Secao>

        <Secao titulo="SecondaryButton">
          <SecondaryButton rotulo="Ver extrato" onPress={() => undefined} />
          <SecondaryButton rotulo="Ver narrativa" tom="ia" onPress={() => undefined} />
          <SecondaryButton rotulo="Sair" tom="perigo" onPress={() => undefined} />
          <SecondaryButton rotulo="Desativado" desativado />
          <SecondaryButton rotulo="Carregando" carregando />
        </Secao>

        <Secao titulo="StatusButton">
          <StatusButton testID="status-ok" acao={() => espera(700)} />
          <StatusButton
            testID="status-erro"
            rotulo="Salvar (falha)"
            acao={async () => {
              await espera(500);
              throw new Error('Sem conexão');
            }}
          />
        </Secao>

        <Secao titulo="HoldToConfirm">
          <HoldToConfirm testID="segurar" rotulo="Apagar lançamento" onConfirmar={() => setApagado(true)} />
          <Texto variante="caption" cor="textMuted" testID="segurar-resultado">
            {apagado ? '✓ Apagado' : 'Nada apagado'}
          </Texto>
        </Secao>

        <Secao titulo="Chip">
          <View style={styles.linha}>
            {Object.entries(chips).map(([nome, sel]) => (
              <Chip key={nome} rotulo={nome} detalhe={nome === 'Corte' ? 'R$ 45' : 'R$ 35'} selecionado={sel}
                onPress={() => setChips((c) => ({ ...c, [nome]: !sel }))} />
            ))}
            <Chip rotulo="Pix" selecionado={false} onPress={() => undefined} desativado />
          </View>
        </Secao>

        <Secao titulo="MetaRing">
          <View style={styles.linha}>
            <MetaRing progresso={0.62} tamanho={132} accessibilityLabel="62% da meta">
              <Texto variante="h2" numero>62%</Texto>
              <Texto variante="caption" cor="textMuted">da meta</Texto>
            </MetaRing>
            <MetaRing progresso={0.35} emRisco tamanho={132} accessibilityLabel="35% da meta, em risco">
              <Texto variante="h2" numero>35%</Texto>
              <Texto variante="caption" cor="textMuted">da meta</Texto>
            </MetaRing>
          </View>
          <EstadoVazio titulo="Sem meta neste mês" texto="A IA sugere uma meta pela sua média." acao="Definir meta" onAcao={() => undefined} />
        </Secao>

        <Secao titulo="InsightCard">
          <InsightCard
            titulo="Hidratação em baixa"
            numero="7 este mês (12 no anterior)"
            porque="Você ofereceu bastante, mas aceitaram menos."
            acao="Use a narrativa 'Mesmo tempo', que fecha 2 de cada 3."
            botao="Ver narrativa"
            onPress={() => undefined}
          />
          <EstadoVazio titulo="Ainda são poucos dados" texto="Com 10 ofertas registradas a IA começa a sugerir." />
        </Secao>

        <Secao titulo="Estados">
          <Cartao>
            <Carregando />
          </Cartao>
          <Cartao>
            <EstadoErro onTentar={() => undefined} />
          </Cartao>
        </Secao>

        <Secao titulo="BottomSheet">
          <SecondaryButton testID="abrir-gaveta" rotulo="Abrir gaveta" onPress={() => setGaveta(true)} />
          <BottomSheet testID="gaveta" aberto={gaveta} onFechar={() => setGaveta(false)} titulo="Novo atendimento">
            <Texto>Conteúdo da gaveta.</Texto>
            <DuoButton rotulo="Salvar" onPress={() => setGaveta(false)} />
          </BottomSheet>
        </Secao>

        <Secao titulo="Mascote">
          <Mascote estado={mascote} />
          <View style={styles.linha}>
            {(['parado', 'comemorando', 'pensando', 'preocupado'] as const).map((e) => (
              <Chip key={e} rotulo={e} selecionado={mascote === e} onPress={() => setMascote(e)} testID={`mascote-btn-${e}`} />
            ))}
          </View>
        </Secao>

        <Secao titulo="LockedScreen">
          <View style={styles.bloqueada}>
            <LockedScreen
              plano="pago"
              titulo="Relatórios da sua cadeira"
              descricao="Ratio, ticket, aceitação e mapa de calor com os seus números."
              onConhecer={() => undefined}
              previa={
                <>
                  <Cartao>
                    <Texto variante="caption" cor="textMuted">Faturamento do mês</Texto>
                    <Texto variante="display" numero>R$ 4.280,00</Texto>
                  </Cartao>
                  <Cartao>
                    <Texto variante="caption" cor="textMuted">Ticket médio</Texto>
                    <Texto variante="h2" numero>R$ 62,40</Texto>
                  </Cartao>
                </>
              }
            />
          </View>
        </Secao>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  lista: { padding: space[4], gap: space[6] },
  secao: { gap: space[3] },
  palco: { paddingTop: 110 },
  linha: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2], alignItems: 'center' },
  bloqueada: { height: 420, borderWidth: 1, borderColor: color.border, borderRadius: 16, overflow: 'hidden' },
});
