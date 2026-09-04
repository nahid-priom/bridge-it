/**
 * Backfill software_product_features from catalog modules.
 * Idempotent: skips if project already has features.
 * Run: npx tsx scripts/backfill-software-features.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { SOFTWARE_SEED_PRODUCTS } from '../src/features/software-showcase/seed/catalog';

config({ path: '.env.local' });
config({ path: '.env' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
if (!url || !key) {
  console.error('Missing Supabase env');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function main() {
  const { error: probeError } = await supabase.from('software_product_features').select('id').limit(1);
  if (probeError && /does not exist|Could not find/i.test(probeError.message)) {
    console.error('Run migration first: 20260912120000_showcase_taxonomy_features.sql');
    console.error(probeError.message);
    process.exit(1);
  }

  const { data: projects, error } = await supabase
    .from('software_projects')
    .select('id, slug, modules')
    .is('deleted_at', null);
  if (error) throw error;

  const bySlug = new Map((projects ?? []).map((p) => [String(p.slug), p]));
  let inserted = 0;

  for (const seed of SOFTWARE_SEED_PRODUCTS) {
    const project = bySlug.get(seed.slug);
    if (!project) {
      console.warn('skip missing project', seed.slug);
      continue;
    }

    const { count } = await supabase
      .from('software_product_features')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', project.id)
      .is('deleted_at', null);

    if ((count ?? 0) > 0) {
      console.log('features exist', seed.slug);
      continue;
    }

    const modules = seed.modules.slice(0, 8);
    const rows = modules.map((title, index) => ({
      project_id: project.id,
      title,
      short_description: null as string | null,
      icon_key: null as string | null,
      sort_order: (index + 1) * 10,
      is_primary: index < 3,
      published: true,
    }));

    const { error: insertError } = await supabase.from('software_product_features').insert(rows);
    if (insertError) {
      console.error(seed.slug, insertError.message);
      continue;
    }
    inserted += rows.length;
    console.log('inserted', seed.slug, rows.length);
  }

  // Strip prices from public SEO strings
  const { data: seoRows } = await supabase
    .from('software_projects')
    .select('id, seo_title, seo_description')
    .is('deleted_at', null);

  for (const row of seoRows ?? []) {
    const title = String(row.seo_title ?? '');
    const desc = String(row.seo_description ?? '');
    const cleanTitle = title.replace(/Starting\s*৳[\d,]+[+]?/gi, '').replace(/৳[\d,]+[+]?/g, '').replace(/\s{2,}/g, ' ').trim();
    const cleanDesc = desc.replace(/Starting\s*৳[\d,]+[+]?/gi, '').replace(/৳[\d,]+[+]?/g, '').replace(/\s{2,}/g, ' ').trim();
    if (cleanTitle !== title || cleanDesc !== desc) {
      await supabase
        .from('software_projects')
        .update({
          seo_title: cleanTitle || null,
          seo_description: cleanDesc || null,
        })
        .eq('id', row.id);
    }
  }

  console.log('Done. Features inserted rows:', inserted);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
