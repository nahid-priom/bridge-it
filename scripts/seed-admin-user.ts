/**
 * Seed or reset the Bridge IT Park admin account.
 * Run: npm run admin:seed
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config({ path: '.env' });
config({ path: '.env.example' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const email = process.env.ADMIN_SEED_EMAIL?.trim() ?? 'admin@bridgeitpark.com';
const password = process.env.ADMIN_SEED_PASSWORD ?? 'Bridge@2026';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? 'http://localhost:3000';

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function findUserByEmail(targetEmail: string) {
  let page = 1;
  const perPage = 200;
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const match = data.users.find((u) => u.email?.toLowerCase() === targetEmail.toLowerCase());
    if (match) return match;
    if (data.users.length < perPage) return null;
    page += 1;
  }
}

async function main() {
  console.log(`Seeding admin user: ${email}`);

  let userId: string;
  const existing = await findUserByEmail(email);

  if (existing) {
    const { data, error } = await supabase.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
      user_metadata: {
        full_name: 'Bridge IT Park Admin',
        role: 'admin',
      },
    });
    if (error) throw error;
    userId = data.user.id;
    console.log('Updated existing admin user password and metadata.');
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: 'Bridge IT Park Admin',
        role: 'admin',
      },
    });
    if (error) throw error;
    userId = data.user!.id;
    console.log('Created new admin user.');
  }

  const { error: profileError } = await supabase.from('profiles').upsert(
    {
      id: userId,
      email,
      full_name: 'Bridge IT Park Admin',
      role: 'admin',
      status: 'active',
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  );

  if (profileError) throw profileError;

  console.log('\nAdmin account ready.');
  console.log(`  Email:    ${email}`);
  console.log(`  Password: ${password === process.env.ADMIN_SEED_PASSWORD ? '(from ADMIN_SEED_PASSWORD)' : '(default Bridge@2026)'}`);
  console.log(`  Login:    ${siteUrl}/login`);
  console.log(`  Admin:    ${siteUrl}/admin`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
