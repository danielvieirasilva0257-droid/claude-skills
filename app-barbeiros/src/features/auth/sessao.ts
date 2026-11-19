import type { Session } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { create } from 'zustand';

import { supabase } from '@/lib/supabase';

type SessaoState = {
  session: Session | null;
  /** false until the stored session has been read once. */
  pronto: boolean;
};

export const useSessao = create<SessaoState>(() => ({ session: null, pronto: false }));

let iniciado = false;

/** Reads the stored session once and follows auth changes for the app's lifetime. */
export function iniciarSessao() {
  if (iniciado) return;
  iniciado = true;
  supabase.auth.getSession().then(({ data }) => {
    useSessao.setState({ session: data.session, pronto: true });
  });
  supabase.auth.onAuthStateChange((_event, session) => {
    useSessao.setState({ session, pronto: true });
  });
}

export async function entrarComEmail(email: string, senha: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
  return error ? traduzirErro(error.message) : null;
}

export async function cadastrar(nome: string, email: string, senha: string) {
  const { data, error } = await supabase.auth.signUp({ email, password: senha, options: { data: { nome } } });
  if (error) return { erro: traduzirErro(error.message), confirmar: false };
  // With e-mail confirmation on (production), there is no session yet.
  return { erro: null, confirmar: data.session === null };
}

/**
 * Google sign-in through Supabase (PKCE). Needs the Google provider turned on
 * in Supabase (client id and secret from Google Cloud) — see PASSO-A-PASSO.
 */
export async function entrarComGoogle(): Promise<string | null> {
  const redirectTo = Platform.OS === 'web' ? `${globalThis.location?.origin ?? ''}/entrar` : Linking.createURL('/entrar');
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, skipBrowserRedirect: Platform.OS !== 'web' },
  });
  if (error) return traduzirErro(error.message);
  if (Platform.OS === 'web') return null; // the browser leaves to Google and comes back
  const resultado = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (resultado.type !== 'success') return null;
  const code = new URL(resultado.url).searchParams.get('code');
  if (!code) return 'O Google não devolveu o acesso. Tente de novo.';
  const { error: erroTroca } = await supabase.auth.exchangeCodeForSession(code);
  return erroTroca ? traduzirErro(erroTroca.message) : null;
}

export async function sair() {
  await supabase.auth.signOut();
}

function traduzirErro(mensagem: string): string {
  if (/invalid login credentials/i.test(mensagem)) return 'E-mail ou senha não conferem.';
  if (/email not confirmed/i.test(mensagem)) return 'Confirme o e-mail antes de entrar.';
  if (/network|fetch/i.test(mensagem)) return 'Sem conexão com o servidor. Tente de novo.';
  if (/provider is not enabled|unsupported provider/i.test(mensagem)) return 'Entrar com Google ainda não foi ligado neste servidor.';
  if (/already registered|already been registered/i.test(mensagem)) return 'Esse e-mail já tem conta. Use "Entrar".';
  if (/password should be|weak password/i.test(mensagem)) return 'Use uma senha com pelo menos 6 caracteres.';
  return 'Não deu para entrar agora. Tente de novo.';
}
