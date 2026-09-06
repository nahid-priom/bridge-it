/**
 * QA live Garments + Feed Mill catalog (post package-merge).
 * Expects flagship ERPs + specialized tools — not soft-deleted ladder SKUs.
 *
 * Run: npx tsx scripts/qa-garments-feed-mill-ladder.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import {
  FEED_MILL_SPECIALIZED_SLUGS,
  GARMENTS_SPECIALIZED_SLUGS,
} from '../src/features/software-showcase/config/specialized-solutions';

config({ path: '.env.local' });
config({ path: '.env' });

const LIVE_SLUGS = [
  'garments-erp',
  'garments-accessories-erp',
  ...GARMENTS_SPECIALIZED_SLUGS,
  'feed-mill-erp',
  ...FEED_MILL_SPECIALIZED_SLUGS,
];

const MUST_BE_ABSENT = [
  'feed-mill-mini',
  'feed-mill-basic',
  'feed-mill-erp-professional',
  'feed-mill-enterprise-erp',
  'garments-starter-software',
  'garments-production-management',
  'garments-erp-professional',
  'garments-enterprise-erp',
];

async function main() {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });

  const { data: live, error } = await sb
    .from('software_projects')
    .select('id, slug, title, starting_price, price_suffix, sort_order, published, cover_card_url, canonical_path')
    .in('slug', LIVE_SLUGS)
    .is('deleted_at', null);
  if (error) throw error;

  console.log('── Live catalog ──');
  for (const slug of LIVE_SLUGS) {
    const row = (live ?? []).find((d) => d.slug === slug);
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

  console.log('\n── Legacy ladder (must not be live) ──');
  const { data: legacy } = await sb
    .from('software_projects')
    .select('slug, deleted_at, published')
    .in('slug', MUST_BE_ABSENT)
    .is('deleted_at', null);
  if (!legacy?.length) {
    console.log('OK — no live legacy ladder rows');
  } else {
    for (const row of legacy) {
      console.log(`FAIL live legacy: ${row.slug} published=${row.published}`);
    }
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
