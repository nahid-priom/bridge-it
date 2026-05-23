import 'server-only';

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import {
  getSupabasePublicEnv,
  isSupabaseServiceRoleConfigured,
} from '@/lib/supabase/env';

export { isSupabaseServiceRoleConfigured };

/**
 * Service-role client — server-only, bypasses RLS.
 * Never import this module from Client Components.
 */
export function createAdminSupabaseClient() {
  const env = getSupabasePublicEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!env || !serviceRoleKey) return null;

  return createClient<Database>(env.url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
