/**
 * Promote codebondhuit@gmail.com to admin.
 * Usage: npm run admin:promote
 *
 * 1. Create the user in Supabase Auth first (Dashboard → Authentication).
 * 2. Ensure profile row exists (signup trigger).
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

const SUPER_ADMIN_EMAIL = 'codebondhuit@gmail.com';

config({ path: '.env.local' });
config({ path: '.env' });

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: profile, error } = await supabase
    .from('profiles')
    .update({ role: 'admin', updated_at: new Date().toISOString() })
    .eq('email', SUPER_ADMIN_EMAIL)
    .select('id, email, role')
    .maybeSingle();

  if (error) {
    console.error('Update failed:', error.message);
    process.exit(1);
  }

  if (!profile) {
    console.error(
      `No profile found for ${SUPER_ADMIN_EMAIL}. Create the Auth user first, then re-run.`
    );
    process.exit(1);
  }

  console.log('Super admin promoted:', profile);
}

main();
