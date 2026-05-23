import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';
import { getSupabasePublicEnv, isSupabaseConfigured } from '@/lib/supabase/env';

export { isSupabaseConfigured };

/**
 * Browser / Client Component Supabase client (anon key only).
 * Returns null when env vars are missing so the UI can keep using static data.
 */
export function createBrowserSupabaseClient() {
  const env = getSupabasePublicEnv();
  if (!env) return null;
  return createBrowserClient<Database>(env.url, env.anonKey);
}
