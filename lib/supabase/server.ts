import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database.types';
import { getSupabasePublicEnv, isSupabaseConfigured } from '@/lib/supabase/env';

export { isSupabaseConfigured };

/**
 * Server Component / Route Handler / Server Action client (anon key + session cookies).
 * Returns null when env vars are missing.
 */
export async function createServerSupabaseClient() {
  const env = getSupabasePublicEnv();
  if (!env) return null;

  const cookieStore = await cookies();

  return createServerClient<Database>(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // setAll can fail in Server Components; middleware may refresh the session.
        }
      },
    },
  });
}
