// Phase 0: e-mail + password sign-in only (enough for the smoke test).
// Phase 2 adds Google, sign-up, the `barbeiros` row on first login and onboarding.
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { BotaoProvisorio } from '@/components/BotaoProvisorio';
import { entrarComEmail } from '@/features/auth/sessao';
import { inter } from '@/theme/fonts';
import { color, radius, size, space } from '@/theme/tokens';

const schema = z.object({
  email: z.email('Digite um e-mail válido.'),
  senha: z.string().min(6, 'A senha tem pelo menos 6 caracteres.'),
});

type Campos = z.infer<typeof schema>;

export default function Entrar() {
  const [erro, setErro] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Campos>({ resolver: zodResolver(schema), defaultValues: { email: '', senha: '' } });

  const enviar = handleSubmit(async ({ email, senha }) => {
    setErro(null);
    const mensagem = await entrarComEmail(email.trim(), senha);
    if (mensagem) setErro(mensagem);
  });

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.conteudo}>
          <Text style={styles.titulo} accessibilityRole="header">
            Entrar
          </Text>
          <Text style={styles.subtitulo}>Acompanhe o resultado da sua cadeira.</Text>

          <View style={styles.campo}>
            <Text style={styles.rotulo} nativeID="rotulo-email">
              E-mail
            </Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  testID="entrar-email"
                  aria-labelledby="rotulo-email"
                  accessibilityLabel="E-mail"
                  style={[styles.input, errors.email ? styles.inputErro : null]}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  placeholder="voce@email.com"
                  placeholderTextColor={color.textMuted}
                />
              )}
            />
            {errors.email ? <Text style={styles.erro}>⚠ {errors.email.message}</Text> : null}
          </View>

          <View style={styles.campo}>
            <Text style={styles.rotulo} nativeID="rotulo-senha">
              Senha
            </Text>
            <Controller
              control={control}
              name="senha"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  testID="entrar-senha"
                  aria-labelledby="rotulo-senha"
                  accessibilityLabel="Senha"
                  style={[styles.input, errors.senha ? styles.inputErro : null]}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  autoComplete="current-password"
                  textContentType="password"
                  onSubmitEditing={() => enviar()}
                />
              )}
            />
            {errors.senha ? <Text style={styles.erro}>⚠ {errors.senha.message}</Text> : null}
          </View>

          {erro ? (
            <Text style={styles.erro} accessibilityRole="alert" testID="entrar-erro">
              ⚠ {erro}
            </Text>
          ) : null}

          <BotaoProvisorio testID="entrar-botao" rotulo="Entrar" onPress={enviar} carregando={isSubmitting} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  flex: { flex: 1 },
  conteudo: { flex: 1, justifyContent: 'center', padding: space[5], gap: space[4] },
  titulo: { ...inter('semibold'), fontSize: size.display, color: color.text },
  subtitulo: { ...inter('regular'), fontSize: size.body, color: color.textMuted, marginBottom: space[2] },
  campo: { gap: space[2] },
  rotulo: { ...inter('medium'), fontSize: size.bodySm, color: color.text },
  input: {
    ...inter('regular'),
    minHeight: 52,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.md,
    paddingHorizontal: space[4],
    fontSize: size.body,
    color: color.text,
    backgroundColor: color.bg,
  },
  inputErro: { borderColor: color.danger, borderWidth: 2 },
  erro: { ...inter('medium'), fontSize: size.bodySm, color: color.danger },
});
