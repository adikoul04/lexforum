import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: { persistSession: false, autoRefreshToken: false }
});

/* 👇 DEBUG: make it available in DevTools */
if (import.meta.env.DEV) {
  window.supabase = supabase;
  console.log('Supabase client attached to window.supabase');
}