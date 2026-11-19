import type { Session } from '@supabase/supabase-js';
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

export async function sair() {
  await supabase.auth.signOut();
}

function traduzirErro(mensagem: string): string {
  if (/invalid login credentials/i.test(mensagem)) return 'E-mail ou senha não conferem.';
  if (/email not confirmed/i.test(mensagem)) return 'Confirme o e-mail antes de entrar.';
  if (/network|fetch/i.test(mensagem)) return 'Sem conexão com o servidor. Tente de novo.';
  return 'Não deu para entrar agora. Tente de novo.';
}
