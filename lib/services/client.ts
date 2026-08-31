import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import type { SupabaseClient } from '@supabase/supabase-js';

/** Untyped client for Bridge IT Park tables not yet in generated Database types */
export type BitpDb = SupabaseClient;

export async function getServerClient(): Promise<BitpDb | null> {
  const client = await createServerSupabaseClient();
  return client as unknown as BitpDb | null;
}

export async function getAdminClient(): Promise<BitpDb | null> {
  const client = createAdminSupabaseClient();
  return client as unknown as BitpDb | null;
}

export { formatBdt } from '@/lib/format/currency';
