/**
 * Idempotent admin / business software showcase seed.
 * Uploads prepared local AVIF assets to Supabase Storage (admin-showcase bucket).
 *
 * Run: npm run seed:admin-showcase
 * Force re-upload: npm run seed:admin-showcase -- --force
 */
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import {
  SOFTWARE_CATEGORIES,
  SOFTWARE_SEED_PRODUCTS,
} from '../src/features/software-showcase/seed/catalog';
import { SOFTWARE_BUCKET } from '../src/features/software-showcase/config/constants';
import type { SoftwareHomepageSectionKey } from '../src/features/software-showcase/config/constants';
import {
  coverCardPath,
  coverDetailPath,
  screenPreviewPath,
  screenThumbPath,
} from '../src/features/software-showcase/utils/storage-paths';

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
const ASSETS_ROOT = path.join(process.cwd(), 'seed-assets/admin-systems');

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

async function upload(objectPath: string, buffer: Buffer, contentType: string) {
  if (!force) {
    const folder = objectPath.split('/').slice(0, -1).join('/');
    const name = objectPath.split('/').at(-1);
    const { data } = await supabase.storage.from(SOFTWARE_BUCKET).list(folder);
    if (data?.some((item) => item.name === name)) {
      return supabase.storage.from(SOFTWARE_BUCKET).getPublicUrl(objectPath).data.publicUrl;
    }
  }

  let lastError: unknown;
  for (let attempt = 1; attempt <= 4; attempt++) {
    const { error } = await supabase.storage.from(SOFTWARE_BUCKET).upload(objectPath, buffer, {
      contentType,
      upsert: true,
      cacheControl: '31536000',
    });
    if (!error) {
      return supabase.storage.from(SOFTWARE_BUCKET).getPublicUrl(objectPath).data.publicUrl;
    }
    lastError = error;
    const retryable = /timeout|504|503|429/i.test(error.message + String(error.statusCode ?? ''));
    if (!retryable || attempt === 4) break;
    await sleep(1500 * attempt);
  }
  throw lastError;
}

function packageRows(projectId: string, startingPrice: number) {
  const starter = Math.round(startingPrice * 0.7);
  const business = Math.round(startingPrice);
  const enterprise = Math.round(startingPrice * 1.4);
  return [
    {
      project_id: projectId,
      name: 'Starter',
      price: starter,
      currency: 'BDT',
      short_description: 'Core modules for a single branch or small team.',
      features: ['Core modules', 'Basic reports', 'Email support'],
      is_popular: false,
      sort_order: 10,
      active: true,
      deleted_at: null,
    },
    {
      project_id: projectId,
      name: 'Business',
      price: business,
      currency: 'BDT',
      short_description: 'Full operational suite for growing businesses.',
      features: ['All Starter features', 'Advanced reports', 'Role-based access', 'Priority support'],
      is_popular: true,
      sort_order: 20,
      active: true,
      deleted_at: null,
    },
    {
      project_id: projectId,
      name: 'Enterprise',
      price: enterprise,
      currency: 'BDT',
      short_description: 'Multi-branch / custom integrations — pricing from listed amount+',
      features: [
        'All Business features',
        'Custom modules',
        'Multi-branch',
        'Dedicated onboarding',
        'SLA support',
      ],
      is_popular: false,
      sort_order: 30,
      active: true,
      deleted_at: null,
    },
  ];
}

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

    if (existing?.id) {
      await supabase.from('software_categories').update(row).eq('id', existing.id);
    } else {
      const { error } = await supabase.from('software_categories').insert(row);
      if (error) console.warn(`Category ${cat.slug} insert warning:`, error.message);
    }
  }
}

async function seedHomepagePlacements(
  seeded: Array<{ id: string; slug: string; categorySlug: string; featured: boolean; popular: boolean; sortOrder: number }>
) {
  const bySort = [...seeded].sort((a, b) => a.sortOrder - b.sortOrder);

  const popularOrder = [
    'dealership-management',
    'retail-pos',
    'hr-payroll',
    'crm-system',
    'pharmacy-management',
    'clinic-management',
  ];
  const industryOrder = [
    'garments-erp',
    'feed-mill-erp',
    'brick-tiles-erp',
    'manufacturing-erp',
    'poultry-management-erp',
    'rice-mill-erp',
  ];
  const bySlug = new Map(seeded.map((p) => [p.slug, p]));
  const pickByOrder = (order: string[]) =>
    order
      .map((slug) => bySlug.get(slug))
      .filter((p): p is (typeof seeded)[number] => Boolean(p))
      .slice(0, 6);

  const popularPicks = pickByOrder(popularOrder);
  const industryPicks = pickByOrder(industryOrder);

  const fallbackPopular = bySort.filter((p) => p.popular || p.featured).slice(0, 6);
  const fallbackIndustry = bySort
    .filter((p) =>
      ['manufacturing', 'agro', 'garments', 'factory', 'mill', 'erp'].some((token) =>
        p.slug.includes(token) || p.categorySlug.includes(token)
      )
    )
    .slice(0, 6);

  const sectionPicks: Record<SoftwareHomepageSectionKey, typeof seeded> = {
    popular: popularPicks.length ? popularPicks : fallbackPopular,
    manufacturing_erp: industryPicks.length ? industryPicks : fallbackIndustry,
  };

  // Clear retired homepage section keys
  for (const legacy of ['agro_distribution', 'services_ops'] as const) {
    await supabase.from('software_homepage_placements').delete().eq('section_key', legacy);
  }

  for (const [sectionKey, projects] of Object.entries(sectionPicks) as Array<
    [SoftwareHomepageSectionKey, typeof seeded]
  >) {
    await supabase.from('software_homepage_placements').delete().eq('section_key', sectionKey);

    if (!projects.length) {
      console.warn(`Homepage section ${sectionKey}: no projects`);
      continue;
    }

    const rows = projects.map((project, index) => ({
      section_key: sectionKey,
      project_id: project.id,
      sort_order: (index + 1) * 10,
    }));

    const { error } = await supabase.from('software_homepage_placements').insert(rows);
    if (error) {
      console.warn(`Homepage section ${sectionKey} warning:`, error.message);
    } else {
      console.log(`Homepage ${sectionKey}: ${projects.map((p) => p.slug).join(', ')}`);
    }
  }
}

async function main() {
  await upsertCategories();

  const { data: categories, error: catError } = await supabase
    .from('software_categories')
    .select('id, slug');
  if (catError) {
    console.error(
      'Software showcase tables are missing. Apply supabase/migrations/20260909120000_software_showcase.sql first.'
    );
    throw catError;
  }
  const categoryBySlug = new Map((categories ?? []).map((row) => [String(row.slug), String(row.id)]));

  const seeded: Array<{
    id: string;
    slug: string;
    title: string;
    categorySlug: string;
    featured: boolean;
    popular: boolean;
    sortOrder: number;
    screens: number;
  }> = [];
  const assetWarnings: string[] = [];

  for (const product of SOFTWARE_SEED_PRODUCTS) {
    const categoryId = categoryBySlug.get(product.categorySlug);
    if (!categoryId) {
      console.warn(`Skipping ${product.slug}: category ${product.categorySlug} missing`);
      continue;
    }

    const { data: existing } = await supabase
      .from('software_projects')
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

    if (projectId) {
      const { error } = await supabase.from('software_projects').update(payload).eq('id', projectId);
      if (error) throw error;
    } else {
      const { data, error } = await supabase
        .from('software_projects')
        .insert(payload)
        .select('id')
        .single();
      if (error) throw error;
      projectId = data.id as string;
    }

    console.log(`Project ${product.title} → ${product.slug} (${projectId})`);

    const assetDir = path.join(ASSETS_ROOT, product.slug);
    const coverCardLocal = path.join(assetDir, 'cover-card.avif');
    const coverDetailLocal = path.join(assetDir, 'cover-detail.avif');

    const coverUpdate: Record<string, string | null> = {};
    if (await exists(coverCardLocal)) {
      const shouldUpload = force || !existing?.cover_card_url;
      if (shouldUpload) {
        const buf = await readFile(coverCardLocal);
        const objectPath = coverCardPath(projectId);
        const publicUrl = await upload(objectPath, buf, 'image/avif');
        coverUpdate.cover_card_url = publicUrl;
        coverUpdate.cover_card_path = objectPath;
        console.log('  Cover card uploaded');
      }
    } else {
      assetWarnings.push(`${product.slug}: missing cover-card.avif`);
      console.warn(`  Missing cover-card.avif`);
    }

    if (await exists(coverDetailLocal)) {
      const shouldUpload = force || !existing?.cover_detail_url;
      if (shouldUpload) {
        const buf = await readFile(coverDetailLocal);
        const objectPath = coverDetailPath(projectId);
        const publicUrl = await upload(objectPath, buf, 'image/avif');
        coverUpdate.cover_detail_url = publicUrl;
        coverUpdate.cover_detail_path = objectPath;
        coverUpdate.og_image_url = publicUrl;
        console.log('  Cover detail uploaded');
      }
    } else {
      assetWarnings.push(`${product.slug}: missing cover-detail.avif`);
      console.warn(`  Missing cover-detail.avif`);
    }

    if (Object.keys(coverUpdate).length) {
      await supabase.from('software_projects').update(coverUpdate).eq('id', projectId);
    }

    let screensSeeded = 0;
    for (const [index, screen] of product.screens.entries()) {
      const { data: existingScreen } = await supabase
        .from('software_project_screens')
        .select('id, image_url, thumbnail_url')
        .eq('project_id', projectId)
        .eq('screen_key', screen.key)
        .is('deleted_at', null)
        .maybeSingle();

      const previewLocal = path.join(assetDir, `${screen.key}.avif`);
      const thumbLocal = path.join(assetDir, `${screen.key}-thumb.avif`);
      const row: Record<string, unknown> = {
        project_id: projectId,
        screen_key: screen.key,
        screen_name: screen.name,
        sort_order: index,
        is_featured: index === 0,
        published: true,
        deleted_at: null,
      };

      const hasPreview = await exists(previewLocal);
      const hasThumb = await exists(thumbLocal);

      if (!hasPreview) {
        assetWarnings.push(`${product.slug}: missing ${screen.key}.avif`);
        console.warn(`  Missing screen: ${screen.key}.avif`);
      }
      if (!hasThumb) {
        assetWarnings.push(`${product.slug}: missing ${screen.key}-thumb.avif`);
        console.warn(`  Missing thumb: ${screen.key}-thumb.avif`);
      }

      const shouldUploadPreview = hasPreview && (force || !existingScreen?.image_url);
      const shouldUploadThumb = hasThumb && (force || !existingScreen?.thumbnail_url);

      if (shouldUploadPreview) {
        const buf = await readFile(previewLocal);
        const objectPath = screenPreviewPath(projectId, screen.key);
        const publicUrl = await upload(objectPath, buf, 'image/avif');
        row.image_url = publicUrl;
        row.image_path = objectPath;
      }
      if (shouldUploadThumb) {
        const buf = await readFile(thumbLocal);
        const objectPath = screenThumbPath(projectId, screen.key);
        const publicUrl = await upload(objectPath, buf, 'image/avif');
        row.thumbnail_url = publicUrl;
        row.thumbnail_path = objectPath;
      }

      if (existingScreen?.id) {
        const { error } = await supabase
          .from('software_project_screens')
          .update(row)
          .eq('id', existingScreen.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('software_project_screens').insert(row);
        if (error) throw error;
      }

      if (row.image_url || existingScreen?.image_url) screensSeeded += 1;
    }

    const packages = packageRows(projectId, product.startingPrice);
    for (const pkg of packages) {
      const { data: existingPkg } = await supabase
        .from('software_packages')
        .select('id')
        .eq('project_id', projectId)
        .eq('name', pkg.name)
        .is('deleted_at', null)
        .maybeSingle();
      if (existingPkg?.id) {
        await supabase.from('software_packages').update(pkg).eq('id', existingPkg.id);
      } else {
        await supabase.from('software_packages').insert(pkg);
      }
    }

    seeded.push({
      id: projectId,
      slug: product.slug,
      title: product.title,
      categorySlug: product.categorySlug,
      featured: product.featured,
      popular: product.popular,
      sortOrder: product.sortOrder,
      screens: screensSeeded,
    });
  }

  await seedHomepagePlacements(seeded);

  console.log('\nSeed summary');
  for (const item of seeded) {
    console.log(`- ${item.title} | ${item.slug} | screens=${item.screens}`);
  }
  if (assetWarnings.length) {
    console.warn(`\nAsset warnings (${assetWarnings.length}):`);
    for (const item of [...new Set(assetWarnings)].slice(0, 40)) console.warn(`- ${item}`);
    if (assetWarnings.length > 40) console.warn(`… and ${assetWarnings.length - 40} more`);
  }
  console.log('Admin showcase seed complete.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
