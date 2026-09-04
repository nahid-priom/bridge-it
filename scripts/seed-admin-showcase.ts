/**
 * Ensures software showcase metadata exists, then delegates asset upload
 * to the canonical pipeline (upload-software-assets.ts).
 *
 * Prefer:
 *   npm run generate:software-showcases
 *   npm run upload:software-assets
 *
 * Run: npm run seed:admin-showcase
 */
import { spawn } from 'node:child_process';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import {
  SOFTWARE_CATEGORIES,
  SOFTWARE_SEED_PRODUCTS,
} from '../src/features/software-showcase/seed/catalog';

config({ path: '.env.local' });
config({ path: '.env' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function upsertCategories() {
  for (const cat of SOFTWARE_CATEGORIES) {
    const { data: existing } = await supabase
      .from('software_categories')
      .select('id')
      .eq('slug', cat.slug)
      .maybeSingle();
    const row = {
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon,
      sort_order: cat.sortOrder,
      active: true,
      deleted_at: null,
    };
    if (existing?.id) await supabase.from('software_categories').update(row).eq('id', existing.id);
    else await supabase.from('software_categories').insert(row);
  }
}

async function ensureProjects() {
  const { data: categories } = await supabase.from('software_categories').select('id, slug');
  const categoryBySlug = new Map((categories ?? []).map((r) => [String(r.slug), String(r.id)]));
  for (const product of SOFTWARE_SEED_PRODUCTS) {
    const categoryId = categoryBySlug.get(product.categorySlug);
    if (!categoryId) continue;
    const { data: existing } = await supabase
      .from('software_projects')
      .select('id')
      .eq('slug', product.slug)
      .is('deleted_at', null)
      .maybeSingle();
    const payload = {
      title: product.title,
      slug: product.slug,
      short_description: product.shortDescription,
      full_description: product.fullDescription,
      category_id: categoryId,
      industry: product.industry,
      business_type: product.businessType,
      primary_user: product.primaryUser,
      solution_group: product.solutionGroup,
      software_type: product.softwareType,
      platform_type: product.platformType,
      modules: product.modules,
      starting_price: product.startingPrice,
      price_suffix: product.priceSuffix,
      currency: 'BDT',
      featured: product.featured,
      popular: product.popular,
      published: true,
      seo_title: product.seoTitle,
      seo_description: product.seoDescription,
      seo_keywords: product.seoKeywords,
      sort_order: product.sortOrder,
      deleted_at: null,
    };
    if (existing?.id) await supabase.from('software_projects').update(payload).eq('id', existing.id);
    else await supabase.from('software_projects').insert(payload);
  }
}

async function main() {
  console.log('Ensuring categories + project metadata…');
  await upsertCategories();
  await ensureProjects();
  console.log('Delegating asset upload to upload-software-assets.ts');
  const args = process.argv.slice(2);
  const child = spawn('npx', ['tsx', 'scripts/upload-software-assets.ts', ...args], {
    stdio: 'inherit',
    shell: true,
  });
  child.on('exit', (code) => process.exit(code ?? 1));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
