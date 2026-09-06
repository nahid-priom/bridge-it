/**
 * Idempotent ensure for Garments + Feed Mill maturity ladder products.
 *
 * - Upserts 8 new products + retitles/reprices Standards from catalog seeds
 * - Sets industry_id + canonical_path
 * - Upserts primary features from modules
 * - Ensures one package row matching starting_price (tier = product maturity)
 * - Publishes only when cover + min screens exist
 *
 * Run: npx tsx scripts/ensure-garments-feed-mill-ladder.ts
 * Optional: --publish-force (skip asset gate)
 */
import { access } from 'node:fs/promises';
import path from 'node:path';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import {
  FEED_MILL_LADDER_SLUGS,
  GARMENTS_LADDER_SLUGS,
  SOFTWARE_SEED_PRODUCTS,
  GARMENTS_SPECIALIZED_SLUGS,
  FEED_MILL_SPECIALIZED_SLUGS,
} from '../src/features/software-showcase/seed/catalog';
import { SOFTWARE_PRODUCT_INDUSTRY_MAP } from '../src/features/catalog/config/software-industry-map';

config({ path: '.env.local' });
config({ path: '.env' });

const ASSETS_ROOT = path.join(process.cwd(), 'seed-assets/software');
const publishForce = process.argv.includes('--publish-force');
const MIN_SCREENS = 6;

/** Soft-deleted maturity ladder SKUs — never re-insert. */
const LEGACY_LADDER_ONLY_SLUGS = new Set([
  'garments-starter-software',
  'garments-production-management',
  'garments-erp-professional',
  'garments-enterprise-erp',
  'feed-mill-mini',
  'feed-mill-basic',
  'feed-mill-erp-professional',
  'feed-mill-enterprise-erp',
]);

const LADDER_SLUGS = new Set<string>([
  ...GARMENTS_LADDER_SLUGS,
  ...FEED_MILL_LADDER_SLUGS,
  ...GARMENTS_SPECIALIZED_SLUGS,
  ...FEED_MILL_SPECIALIZED_SLUGS,
]);

const TIER_BY_SLUG: Record<string, string> = {
  'garments-starter-software': 'starter',
  'garments-production-management': 'basic',
  'garments-erp': 'standard',
  'garments-erp-professional': 'professional',
  'garments-enterprise-erp': 'enterprise',
  'feed-mill-mini': 'starter',
  'feed-mill-basic': 'basic',
  'feed-mill-erp': 'standard',
  'feed-mill-erp-professional': 'professional',
  'feed-mill-enterprise-erp': 'enterprise',
  'garments-accessories-erp': 'standard',
  'garments-merchandising-management': 'standard',
  'garments-cutting-sewing-management': 'standard',
  'garments-inventory-warehouse': 'standard',
  'garments-hr-payroll': 'standard',
  'garments-commercial-export-management': 'professional',
  'feed-production-management': 'basic',
  'feed-formula-costing-software': 'standard',
  'feed-dealer-distribution-management': 'professional',
  'feed-mill-inventory-warehouse': 'standard',
  'feed-mill-accounts-finance': 'professional',
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function assetGate(slug: string, screenCount: number) {
  if (publishForce) return true;
  const dir = path.join(ASSETS_ROOT, slug);
  const card = await exists(path.join(dir, 'cover', 'card.avif'));
  const detail = await exists(path.join(dir, 'cover', 'detail.avif'));
  const screensOk = screenCount >= MIN_SCREENS;
  return card && detail && screensOk;
}

async function main() {
  const seeds = SOFTWARE_SEED_PRODUCTS.filter((p) => LADDER_SLUGS.has(p.slug));
  console.log(`Ensuring ${seeds.length} garments/feed-mill ladder products…`);

  const { data: categories } = await supabase.from('software_categories').select('id, slug');
  const categoryBySlug = new Map((categories ?? []).map((r) => [String(r.slug), String(r.id)]));

  const { data: industries } = await supabase
    .from('catalog_industries')
    .select('id, slug')
    .eq('category_root', 'software')
    .is('deleted_at', null);
  const industryBySlug = new Map((industries ?? []).map((r) => [String(r.slug), String(r.id)]));

  for (const product of seeds) {
    const categoryId = categoryBySlug.get(product.categorySlug);
    if (!categoryId) {
      console.warn('skip — missing category', product.slug, product.categorySlug);
      continue;
    }

    const industrySlug =
      SOFTWARE_PRODUCT_INDUSTRY_MAP[product.slug as keyof typeof SOFTWARE_PRODUCT_INDUSTRY_MAP];
    const industryId = industrySlug ? industryBySlug.get(industrySlug) : null;
    if (!industryId) {
      console.warn('skip — missing industry', product.slug, industrySlug);
      continue;
    }

    if (LEGACY_LADDER_ONLY_SLUGS.has(product.slug)) {
      console.log('skip — legacy ladder SKU (redirect-only)', product.slug);
      continue;
    }

    const canPublish = await assetGate(product.slug, product.screens.length);

    // Include soft-deleted rows so we never INSERT a duplicate resurrection.
    const { data: existingAny } = await supabase
      .from('software_projects')
      .select('id, cover_card_url, cover_detail_url, deleted_at')
      .eq('slug', product.slug)
      .maybeSingle();

    if (existingAny?.deleted_at) {
      console.log('skip — soft-deleted (will not resurrect)', product.slug);
      continue;
    }

    const existing = existingAny?.deleted_at ? null : existingAny;
    const hasRemoteCovers = Boolean(existing?.cover_card_url && existing?.cover_detail_url);
    const published = canPublish || hasRemoteCovers;

    const payload = {
      title: product.title,
      slug: product.slug,
      short_description: product.shortDescription,
      full_description: product.fullDescription,
      category_id: categoryId,
      industry: product.industry,
      industry_id: industryId,
      canonical_path: `/software/${industrySlug}/${product.slug}`,
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
      published,
      seo_title: product.seoTitle,
      seo_description: product.seoDescription,
      seo_keywords: product.seoKeywords,
      sort_order: product.sortOrder,
      deleted_at: null,
    };

    let projectId = existing?.id as string | undefined;
    if (projectId) {
      const { error } = await supabase.from('software_projects').update(payload).eq('id', projectId);
      if (error) {
        console.error('update failed', product.slug, error.message);
        continue;
      }
      console.log('updated', product.slug, published ? '(published)' : '(draft — awaiting assets)');
    } else {
      const { data: inserted, error } = await supabase
        .from('software_projects')
        .insert(payload)
        .select('id')
        .single();
      if (error || !inserted?.id) {
        console.error('insert failed', product.slug, error?.message);
        continue;
      }
      projectId = inserted.id;
      console.log('inserted', product.slug, published ? '(published)' : '(draft — awaiting assets)');
    }

    // Features: replace primary set from modules when empty or force refresh for ladder
    const { count: featureCount } = await supabase
      .from('software_product_features')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', projectId)
      .is('deleted_at', null);

    if ((featureCount ?? 0) === 0) {
      const rows = product.modules.slice(0, 10).map((title, index) => ({
        project_id: projectId,
        title,
        short_description: null as string | null,
        icon_key: null as string | null,
        sort_order: (index + 1) * 10,
        is_primary: index < 4,
        published: true,
      }));
      const { error: featErr } = await supabase.from('software_product_features').insert(rows);
      if (featErr) console.warn('features', product.slug, featErr.message);
      else console.log('  features', rows.length);
    }

    // One commercial package matching starting_price
    const tier = TIER_BY_SLUG[product.slug] ?? 'standard';
    const { data: existingPkg } = await supabase
      .from('software_packages')
      .select('id')
      .eq('project_id', projectId)
      .eq('tier', tier)
      .is('deleted_at', null)
      .maybeSingle();

    const pkgPayload = {
      project_id: projectId,
      name: product.title,
      tier,
      price: product.startingPrice,
      currency: 'BDT',
      payment_type: 'one_time',
      short_description: product.shortDescription,
      features: product.modules.slice(0, 8),
      is_popular: product.popular,
      is_recommended: product.featured,
      badge: product.featured ? 'Popular' : null,
      sort_order: product.sortOrder,
      active: true,
      deleted_at: null,
    };

    if (existingPkg?.id) {
      await supabase.from('software_packages').update(pkgPayload).eq('id', existingPkg.id);
      console.log('  package', tier, product.startingPrice);
    } else {
      const { error: pkgErr } = await supabase.from('software_packages').insert(pkgPayload);
      if (pkgErr) console.warn('package', product.slug, pkgErr.message);
      else console.log('  package inserted', tier, product.startingPrice);
    }

    // Align Standard flagship package tier price when multiple packages exist
    if (product.slug === 'garments-erp' || product.slug === 'feed-mill-erp') {
      await supabase
        .from('software_packages')
        .update({ price: product.startingPrice })
        .eq('project_id', projectId)
        .eq('tier', 'standard')
        .is('deleted_at', null);
    }
  }

  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
