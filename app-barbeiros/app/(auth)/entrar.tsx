// Entrar / Criar conta (e-mail + senha) and Google. The barber's row is
// created by the database on sign-up (trigger criar_barbeiro_do_usuario).
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { Campo } from '@/components/Campo';
import { Marca } from '@/components/Marca';
import { DuoButton } from '@/components/DuoButton';
import { SecondaryButton } from '@/components/SecondaryButton';
import { Texto } from '@/components/Texto';
import { cadastrar, entrarComEmail, entrarComGoogle } from '@/features/auth/sessao';
import { CONTAS_DEMO, MODO_DEMO } from '@/features/demo/config';
import { color, space } from '@/theme/tokens';

const schema = z.object({
  nome: z.string(),
  email: z.email('Digite um e-mail válido.'),
  senha: z.string().min(6, 'A senha tem pelo menos 6 caracteres.'),
});

type Campos = z.infer<typeof schema>;
type Modo = 'entrar' | 'criar';

// Demo build: no sign-up, one tap per test account (nothing is saved).
function EntrarDemonstracao() {
  const [entrando, setEntrando] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Marca altura={88} />
        <Texto variante="display" accessibilityRole="header">Demonstração</Texto>
        <Texto cor="textMuted">Veja o app com dados de exemplo, que acompanham a data de hoje. Nada do que você fizer aqui é salvo.</Texto>
        {CONTAS_DEMO.map((c) => (
          <View key={c.id} style={styles.conta}>
            <DuoButton testID={`demo-${c.email}`} rotulo={c.rotulo} carregando={entrando === c.id} desativado={entrando !== null}
              onPress={async () => {
                setErro(null);
                setEntrando(c.id);
                const mensagem = await entrarComEmail(c.email, 'demonstracao');
                setEntrando(null);
                if (mensagem) setErro(mensagem);
              }} />
            <Texto variante="caption" cor="textMuted" centro>{c.detalhe}</Texto>
          </View>
        ))}
        {erro ? <Texto peso="medium" cor="danger" accessibilityRole="alert">⚠ {erro}</Texto> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

export default function Entrar() {
  return MODO_DEMO ? <EntrarDemonstracao /> : <EntrarComConta />;
}

function EntrarComConta() {
  const [modo, setModo] = useState<Modo>('entrar');
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [google, setGoogle] = useState(false);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Campos>({ resolver: zodResolver(schema), defaultValues: { nome: '', email: '', senha: '' } });

  const enviar = handleSubmit(async ({ nome, email, senha }) => {
    setErro(null);
    setAviso(null);
    if (modo === 'criar') {
      if (nome.trim().length < 2) {
        setError('nome', { message: 'Como você quer ser chamado?' });
        return;
      }
      const r = await cadastrar(nome.trim(), email.trim(), senha);
      if (r.erro) setErro(r.erro);
      else if (r.confirmar) setAviso('Enviamos um link para o seu e-mail. Abra o link para entrar.');
      return;
    }
    const mensagem = await entrarComEmail(email.trim(), senha);
    if (mensagem) setErro(mensagem);
  });

  async function comGoogle() {
    setErro(null);
    setGoogle(true);
    const mensagem = await entrarComGoogle();
    setGoogle(false);
    if (mensagem) setErro(mensagem);
  }

  const criando = modo === 'criar';

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
          <Marca altura={72} />
          <Texto variante="display" accessibilityRole="header">
            {criando ? 'Criar conta' : 'Entrar'}
          </Texto>
          <Texto cor="textMuted">Acompanhe o resultado da sua cadeira.</Texto>

          <SecondaryButton testID="entrar-google" rotulo="Continuar com Google" onPress={comGoogle} carregando={google} />
          <View style={styles.ou}>
            <View style={styles.linha} />
            <Texto variante="caption" cor="textMuted">ou com e-mail</Texto>
            <View style={styles.linha} />
          </View>

          {criando ? (
            <Controller control={control} name="nome" render={({ field: { onChange, onBlur, value } }) => (
              <Campo testID="entrar-nome" rotulo="Seu nome" value={value} onChangeText={onChange} onBlur={onBlur}
                autoComplete="name" textContentType="name" erro={errors.nome?.message} />
            )} />
          ) : null}
          <Controller control={control} name="email" render={({ field: { onChange, onBlur, value } }) => (
            <Campo testID="entrar-email" rotulo="E-mail" value={value} onChangeText={onChange} onBlur={onBlur}
              autoCapitalize="none" autoComplete="email" keyboardType="email-address" textContentType="emailAddress"
              placeholder="voce@email.com" erro={errors.email?.message} />
          )} />
          <Controller control={control} name="senha" render={({ field: { onChange, onBlur, value } }) => (
            <Campo testID="entrar-senha" rotulo="Senha" value={value} onChangeText={onChange} onBlur={onBlur}
              secureTextEntry autoComplete={criando ? 'new-password' : 'current-password'}
              textContentType={criando ? 'newPassword' : 'password'} onSubmitEditing={() => enviar()}
              erro={errors.senha?.message} ajuda={criando ? 'Pelo menos 6 caracteres.' : undefined} />
          )} />

          {erro ? (
            <Texto peso="medium" cor="danger" accessibilityRole="alert" testID="entrar-erro">
              ⚠ {erro}
            </Texto>
          ) : null}
          {aviso ? (
            <Texto peso="medium" cor="brandLip" accessibilityRole="alert" testID="entrar-aviso">
              ✓ {aviso}
            </Texto>
          ) : null}

          <DuoButton testID="entrar-botao" rotulo={criando ? 'Criar conta' : 'Entrar'} onPress={() => enviar()} carregando={isSubmitting} />
          <SecondaryButton
            testID="entrar-trocar"
            rotulo={criando ? 'Já tenho conta' : 'Criar conta grátis'}
            onPress={() => {
              setErro(null);
              setAviso(null);
              setModo(criando ? 'entrar' : 'criar');
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  flex: { flex: 1 },
  conteudo: { flexGrow: 1, justifyContent: 'center', padding: space[5], gap: space[4] },
  ou: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  linha: { flex: 1, height: 1, backgroundColor: color.border },
  conta: { gap: space[2] },
});
