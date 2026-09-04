/**
 * Sync homepage software placements to premium (featured/popular) products only.
 * Run: npx tsx scripts/sync-software-homepage-placements.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config({ path: '.env' });

const POPULAR = [
  'dealership-management',
  'retail-pos',
  'hr-payroll',
  'crm-system',
  'garments-erp',
  'hospital-management',
  'feed-mill-erp',
  'school-management',
];

const INDUSTRY = [
  'garments-erp',
  'feed-mill-erp',
  'manufacturing-erp',
  'factory-management',
  'textile-erp',
  'wholesale-erp',
  'construction-erp',
  'real-estate-erp',
];

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error('Missing supabase env');
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const { data: projects, error } = await supabase
    .from('software_projects')
    .select('id, slug, featured, popular, cover_card_url, published')
    .in('slug', [...new Set([...POPULAR, ...INDUSTRY])])
    .eq('published', true)
    .is('deleted_at', null);
  if (error) throw error;

  const bySlug = new Map((projects ?? []).map((p) => [p.slug, p]));

  for (const [sectionKey, order] of [
    ['popular', POPULAR],
    ['manufacturing_erp', INDUSTRY],
  ] as const) {
    await supabase.from('software_homepage_placements').delete().eq('section_key', sectionKey);
    const rows = [];
    for (const [index, slug] of order.entries()) {
      const project = bySlug.get(slug);
      if (!project?.id) {
        console.warn(`skip ${slug}: missing`);
        continue;
      }
      if (!project.featured && !project.popular) {
        console.warn(`skip ${slug}: not premium`);
        continue;
      }
      if (!project.cover_card_url) {
        console.warn(`skip ${slug}: no cover`);
        continue;
      }
      rows.push({
        section_key: sectionKey,
        project_id: project.id,
        sort_order: (index + 1) * 10,
      });
    }
    if (rows.length) {
      const { error: insertError } = await supabase.from('software_homepage_placements').insert(rows);
      if (insertError) throw insertError;
    }
    console.log(
      `${sectionKey}:`,
      rows.map((r) => [...bySlug.entries()].find(([, p]) => p.id === r.project_id)?.[0]).join(', ')
    );
  }
  console.log('Homepage placements synced (premium only).');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
