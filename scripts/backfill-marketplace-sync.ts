/**
 * Repair marketplace seller activation, roles, and wallets.
 * Run: npx tsx scripts/backfill-marketplace-sync.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function main() {
  console.log('Backfilling marketplace sync…');

  const { data: approvedApps, error: appsErr } = await supabase
    .from('seller_applications')
    .select('id, user_id, display_name, business_name, status')
    .eq('status', 'approved');

  if (appsErr) throw appsErr;

  let rolesFixed = 0;
  let sellersFixed = 0;
  let walletsFixed = 0;

  for (const app of approvedApps ?? []) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, role, seller_id')
      .eq('id', app.user_id)
      .maybeSingle();

    if (profile && profile.role !== 'seller' && profile.role !== 'admin') {
      await supabase.from('profiles').update({ role: 'seller' }).eq('id', app.user_id);
      rolesFixed++;
    }

    const { data: seller } = await supabase
      .from('marketplace_sellers')
      .select('id, status')
      .eq('user_id', app.user_id)
      .maybeSingle();

    if (seller && seller.status !== 'active') {
      await supabase
        .from('marketplace_sellers')
        .update({ status: 'active' })
        .eq('id', seller.id);
      sellersFixed++;
    }

    if (seller && profile && profile.seller_id !== seller.id) {
      await supabase.from('profiles').update({ seller_id: seller.id }).eq('id', app.user_id);
    }

    const { data: buyerWallet } = await supabase
      .from('marketplace_wallets')
      .select('id')
      .eq('owner_id', app.user_id)
      .eq('owner_type', 'buyer')
      .maybeSingle();

    if (!buyerWallet) {
      await supabase.from('marketplace_wallets').insert({
        owner_id: app.user_id,
        owner_type: 'buyer',
      });
      walletsFixed++;
    }

    if (seller) {
      const { data: sellerWallet } = await supabase
        .from('marketplace_wallets')
        .select('id')
        .eq('owner_id', app.user_id)
        .eq('owner_type', 'seller')
        .maybeSingle();

      if (!sellerWallet) {
        await supabase.from('marketplace_wallets').insert({
          owner_id: app.user_id,
          owner_type: 'seller',
          seller_id: seller.id,
        });
        walletsFixed++;
      }
    }
  }

  console.log('Done.', { rolesFixed, sellersFixed, walletsFixed, approved: approvedApps?.length ?? 0 });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
