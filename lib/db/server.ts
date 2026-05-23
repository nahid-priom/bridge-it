import { createServerSupabaseClient } from '@/lib/supabase/server';

/** Shared server-side Supabase accessor for db helpers. */
export async function getDbClient() {
  return createServerSupabaseClient();
}
