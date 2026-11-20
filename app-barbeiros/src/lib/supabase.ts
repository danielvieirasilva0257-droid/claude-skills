import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

import { MODO_DEMO, URL_DEMO } from '@/features/demo/config';

// Demo mode answers from a recording (no server); see src/features/demo.
// The env var is inlined at build time, so a normal build drops this require
// (and the recording) through Metro's constant folding.
const demo = process.env.EXPO_PUBLIC_DEMO === '1'
  ? (require('@/features/demo/fetchDemo') as typeof import('@/features/demo/fetchDemo'))
  : null;
const url = MODO_DEMO ? URL_DEMO : process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = MODO_DEMO ? 'demonstracao' : process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    'Faltam EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY no .env (veja .env.example).',
  );
}

export const supabase = createClient(url, anonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
    flowType: 'pkce',
  },
  ...(demo ? { global: { fetch: demo.fetchDemo } } : {}),
});

// On native, refresh the session only while the app is in the foreground.
// https://supabase.com/docs/reference/javascript/auth-startautorefresh
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
