import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { readdirSync, existsSync } from 'node:fs';
import path from 'node:path';

config({ path: '.env' });

const slugs = [
  'garments-starter-software',
  'garments-production-management',
  'garments-erp',
  'garments-erp-professional',
  'garments-enterprise-erp',
  'garments-accessories-erp',
  'feed-mill-mini',
  'feed-mill-basic',
  'feed-mill-erp',
  'feed-mill-erp-professional',
  'feed-mill-enterprise-erp',
];

async function main() {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
  const { data, error } = await sb
    .from('software_projects')
    .select('id, slug, title, starting_price, price_suffix, sort_order, published, cover_card_url, canonical_path')
    .in('slug', slugs)
    .is('deleted_at', null);
  if (error) throw error;

  for (const slug of slugs) {
    const row = (data ?? []).find((d) => d.slug === slug);
    if (!row) {
      console.log(`${slug}: MISSING`);
      continue;
    }
    const { count } = await sb
      .from('software_project_screens')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', row.id)
      .is('deleted_at', null);
    const localDir = path.join('seed-assets/software', slug, 'screens');
    const localScreens = existsSync(localDir) ? readdirSync(localDir).length : 0;
    console.log(
      [
        slug,
        row.title,
        `৳${row.starting_price}${row.price_suffix || ''}`,
        `sort=${row.sort_order}`,
        row.published ? 'published' : 'draft',
        `dbScreens=${count}`,
        `localScreens=${localScreens}`,
        row.canonical_path,
        row.cover_card_url ? 'cover=ok' : 'cover=MISSING',
      ].join(' | ')
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
