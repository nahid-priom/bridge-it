/**
 * Idempotent creative & digital marketing showcase seed.
 * Run: npm run seed:creative-marketing
 * Force re-upload: npm run seed:creative-marketing -- --force
 */
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import {
  CREATIVE_MARKETING_POPULAR_SLUGS,
  CREATIVE_MARKETING_SEED_PRODUCTS,
} from '../src/features/creative-marketing-showcase/seed/catalog';
import { CREATIVE_MARKETING_BUCKET } from '../src/features/creative-marketing-showcase/config/constants';
import {
  creativeAssetPreviewPath,
  creativeAssetThumbPath,
  creativeCoverCardPath,
  creativeCoverDetailPath,
} from '../src/features/creative-marketing-showcase/utils/storage-paths';

config({ path: '.env.local' });
config({ path: '.env' });

const force = process.argv.includes('--force');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
const ASSETS_ROOT = path.join(process.cwd(), 'seed-assets/creative-marketing');

async function exists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function upload(objectPath: string, buffer: Buffer) {
  if (!force) {
    const folder = objectPath.split('/').slice(0, -1).join('/');
    const name = objectPath.split('/').at(-1);
    const { data } = await supabase.storage.from(CREATIVE_MARKETING_BUCKET).list(folder);
    if (data?.some((item) => item.name === name)) {
      return supabase.storage.from(CREATIVE_MARKETING_BUCKET).getPublicUrl(objectPath).data.publicUrl;
    }
  }

  let lastError: unknown;
  for (let attempt = 1; attempt <= 4; attempt++) {
    const { error } = await supabase.storage.from(CREATIVE_MARKETING_BUCKET).upload(objectPath, buffer, {
      contentType: 'image/avif',
      upsert: true,
      cacheControl: '31536000',
    });
    if (!error) {
      return supabase.storage.from(CREATIVE_MARKETING_BUCKET).getPublicUrl(objectPath).data.publicUrl;
    }
    lastError = error;
    const retryable = /timeout|504|503|429/i.test(error.message + String(error.statusCode ?? ''));
    if (!retryable || attempt === 4) break;
    await sleep(1500 * attempt);
  }
  throw lastError;
}

function packageRows(projectId: string, startingPrice: number, pricingModel: string) {
  const starter = Math.round(startingPrice * 0.7);
  const business = Math.round(startingPrice);
  const enterprise = Math.round(startingPrice * 1.5);
  return [
    {
      project_id: projectId,
      name: pricingModel === 'monthly' ? 'Monthly Starter' : 'Starter',
      price: starter,
      currency: 'BDT',
      pricing_model: pricingModel,
      short_description: 'Essential deliverables for a single campaign or brand need.',
      features: ['Core deliverables', '1 revision round', 'Email support'],
      is_popular: false,
      sort_order: 10,
      active: true,
      deleted_at: null,
    },
    {
      project_id: projectId,
      name: pricingModel === 'monthly' ? 'Monthly Growth' : 'Business',
      price: business,
      currency: 'BDT',
      pricing_model: pricingModel,
      short_description: 'Recommended package for growing brands.',
      features: ['Full deliverables', 'Priority support', 'Creative variants'],
      is_popular: true,
      sort_order: 20,
      active: true,
      deleted_at: null,
    },
    {
      project_id: projectId,
      name: pricingModel === 'custom' ? 'Custom Quote' : 'Premium',
      price: enterprise,
      currency: 'BDT',
      pricing_model: pricingModel === 'custom' ? 'custom' : pricingModel,
      short_description: 'Expanded scope or multi-brand needs.',
      features: ['Everything in Business', 'Dedicated review calls', 'Extended assets'],
      is_popular: false,
      sort_order: 30,
      active: true,
      deleted_at: null,
    },
  ];
}

async function main() {
  const seeded: Array<{ id: string; slug: string }> = [];

  for (const product of CREATIVE_MARKETING_SEED_PRODUCTS) {
    const { data: existing } = await supabase
      .from('creative_marketing_projects')
      .select('id, cover_card_url, cover_detail_url')
      .eq('slug', product.slug)
      .is('deleted_at', null)
      .maybeSingle();

    let projectId = existing?.id as string | undefined;
    const payload = {
      title: product.title,
      slug: product.slug,
      short_description: product.shortDescription,
      full_description: product.fullDescription,
      outcome_line: product.outcomeLine,
      service_group: product.serviceGroup,
      service_type: product.serviceType,
      service_subcategory: product.serviceSubcategory,
      target_business: product.targetBusiness,
      pricing_model: product.pricingModel,
      deliverables: product.deliverables,
      related_slugs: product.relatedSlugs,
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

    if (projectId) {
      const { error } = await supabase.from('creative_marketing_projects').update(payload).eq('id', projectId);
      if (error) throw error;
    } else {
      const { data, error } = await supabase
        .from('creative_marketing_projects')
        .insert(payload)
        .select('id')
        .single();
      if (error) throw error;
      projectId = data.id as string;
    }

    console.log(`Project ${product.title} → ${product.slug}`);

    const assetDir = path.join(ASSETS_ROOT, product.slug);
    const coverUpdate: Record<string, string | null> = {};
    const coverCardLocal = path.join(assetDir, 'cover-card.avif');
    const coverDetailLocal = path.join(assetDir, 'cover-detail.avif');

    if (await exists(coverCardLocal)) {
      if (force || !existing?.cover_card_url) {
        const objectPath = creativeCoverCardPath(projectId);
        const publicUrl = await upload(objectPath, await readFile(coverCardLocal));
        coverUpdate.cover_card_url = publicUrl;
        coverUpdate.cover_card_path = objectPath;
      }
    }
    if (await exists(coverDetailLocal)) {
      if (force || !existing?.cover_detail_url) {
        const objectPath = creativeCoverDetailPath(projectId);
        const publicUrl = await upload(objectPath, await readFile(coverDetailLocal));
        coverUpdate.cover_detail_url = publicUrl;
        coverUpdate.cover_detail_path = objectPath;
        coverUpdate.og_image_url = publicUrl;
      }
    }
    if (Object.keys(coverUpdate).length) {
      await supabase.from('creative_marketing_projects').update(coverUpdate).eq('id', projectId);
    }

    for (const [index, asset] of product.assets.entries()) {
      const { data: existingAsset } = await supabase
        .from('creative_marketing_assets')
        .select('id, image_url, thumbnail_url')
        .eq('project_id', projectId)
        .eq('asset_key', asset.key)
        .is('deleted_at', null)
        .maybeSingle();

      const row: Record<string, unknown> = {
        project_id: projectId,
        asset_key: asset.key,
        asset_name: asset.name,
        asset_kind: asset.kind,
        sort_order: index,
        is_featured: index === 0,
        published: true,
        deleted_at: null,
      };

      const previewLocal = path.join(assetDir, `${asset.key}.avif`);
      const thumbLocal = path.join(assetDir, `${asset.key}-thumb.avif`);
      if (await exists(previewLocal) && (force || !existingAsset?.image_url)) {
        const objectPath = creativeAssetPreviewPath(projectId, asset.key);
        row.image_url = await upload(objectPath, await readFile(previewLocal));
        row.image_path = objectPath;
      }
      if (await exists(thumbLocal) && (force || !existingAsset?.thumbnail_url)) {
        const objectPath = creativeAssetThumbPath(projectId, asset.key);
        row.thumbnail_url = await upload(objectPath, await readFile(thumbLocal));
        row.thumbnail_path = objectPath;
      }

      if (existingAsset?.id) {
        await supabase.from('creative_marketing_assets').update(row).eq('id', existingAsset.id);
      } else {
        await supabase.from('creative_marketing_assets').insert(row);
      }
    }

    for (const pkg of packageRows(projectId, product.startingPrice, product.pricingModel)) {
      const { data: existingPkg } = await supabase
        .from('creative_marketing_packages')
        .select('id')
        .eq('project_id', projectId)
        .eq('name', pkg.name)
        .is('deleted_at', null)
        .maybeSingle();
      if (existingPkg?.id) {
        await supabase.from('creative_marketing_packages').update(pkg).eq('id', existingPkg.id);
      } else {
        await supabase.from('creative_marketing_packages').insert(pkg);
      }
    }

    seeded.push({ id: projectId, slug: product.slug });
  }

  await supabase.from('creative_marketing_homepage_placements').delete().eq('section_key', 'popular');
  const bySlug = new Map(seeded.map((p) => [p.slug, p]));
  const popularRows = CREATIVE_MARKETING_POPULAR_SLUGS.map((slug, index) => {
    const project = bySlug.get(slug);
    if (!project) return null;
    return { section_key: 'popular', project_id: project.id, sort_order: (index + 1) * 10 };
  }).filter(Boolean);

  if (popularRows.length) {
    const { error } = await supabase.from('creative_marketing_homepage_placements').insert(popularRows);
    if (error) console.warn('Homepage placements:', error.message);
    else console.log('Homepage popular:', CREATIVE_MARKETING_POPULAR_SLUGS.join(', '));
  }

  // Configurable ecommerce growth bundle
  const { data: existingBundle } = await supabase
    .from('service_bundles')
    .select('id')
    .eq('slug', 'ecommerce-growth-package')
    .is('deleted_at', null)
    .maybeSingle();

  let bundleId = existingBundle?.id as string | undefined;
  const bundlePayload = {
    title: 'E-commerce Growth Package',
    slug: 'ecommerce-growth-package',
    short_description:
      'Website + Meta ads + tracking + ad creatives for store growth. Scope confirmed per business.',
    published: true,
    sort_order: 10,
    deleted_at: null,
  };

  if (bundleId) {
    await supabase.from('service_bundles').update(bundlePayload).eq('id', bundleId);
  } else {
    const { data, error } = await supabase.from('service_bundles').insert(bundlePayload).select('id').single();
    if (error) console.warn('Bundle insert:', error.message);
    else bundleId = data.id as string;
  }

  if (bundleId) {
    await supabase.from('service_bundle_items').delete().eq('bundle_id', bundleId);
    await supabase.from('service_bundle_items').insert([
      { bundle_id: bundleId, item_kind: 'website', item_slug: 'websites', label: 'E-commerce Website', sort_order: 10 },
      {
        bundle_id: bundleId,
        item_kind: 'creative_marketing',
        item_slug: 'meta-ads-management',
        label: 'Facebook Ads',
        sort_order: 20,
      },
      {
        bundle_id: bundleId,
        item_kind: 'creative_marketing',
        item_slug: 'meta-pixel-capi-setup',
        label: 'Meta Pixel / CAPI',
        sort_order: 30,
      },
      {
        bundle_id: bundleId,
        item_kind: 'creative_marketing',
        item_slug: 'facebook-ads-creative',
        label: 'Ad Creative',
        sort_order: 40,
      },
    ]);
    console.log('Seeded ecommerce-growth-package bundle');
  }

  console.log(`Creative marketing seed complete (${seeded.length} services).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
