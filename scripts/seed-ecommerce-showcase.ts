/**
 * Idempotent ecommerce showcase seed.
 * Uploads prepared local assets to Supabase Storage. Does not generate images.
 *
 * Run: npm run seed:ecommerce-showcase
 * Alias: npm run seed:ecommerce-projects
 * Force re-upload pages: npm run seed:ecommerce-showcase -- --force
 * Refresh covers only: npm run seed:ecommerce-showcase -- --covers
 */
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import {
  assertSeedBrandForm,
  BITP_ECOMMERCE_SOLUTIONS_SLUG,
  DEFAULT_PACKAGES,
  SEED_BRANDS,
} from '../src/features/ecommerce-showcase/seed/brands';
import {
  getSeedAssetEntry,
  resolveSeedCoverPath,
  resolveSeedPagePath,
} from '../src/features/ecommerce-showcase/seed/asset-map';
import { encodeCover, processShowcaseImage } from '../src/features/ecommerce-showcase/utils/image-pipeline';
import { coverObjectPath } from '../src/features/ecommerce-showcase/utils/storage-paths';
import { SHOWCASE_BUCKET } from '../src/features/ecommerce-showcase/config/constants';

config({ path: '.env.local' });
config({ path: '.env' });

const force = process.argv.includes('--force');
const coversOnly = process.argv.includes('--covers');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

function seedPageObjectPath(projectId: string, pageSlug: string, ext: 'avif' | 'webp') {
  return `projects/${projectId}/pages/${pageSlug}.${ext}`;
}

function seedPageThumbPath(projectId: string, pageSlug: string) {
  return `projects/${projectId}/pages/${pageSlug}-thumb.webp`;
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function prepareSeedImage(filePath: string, maxWidth: number) {
  return sharp(await readFile(filePath), { failOn: 'none' })
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true, fit: 'inside' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}

async function upload(objectPath: string, buffer: Buffer, contentType: string) {
  if (!force) {
    const folder = objectPath.split('/').slice(0, -1).join('/');
    const name = objectPath.split('/').at(-1);
    const { data } = await supabase.storage.from(SHOWCASE_BUCKET).list(folder);
    if (data?.some((item) => item.name === name)) {
      return supabase.storage.from(SHOWCASE_BUCKET).getPublicUrl(objectPath).data.publicUrl;
    }
  }

  let lastError: unknown;
  for (let attempt = 1; attempt <= 4; attempt++) {
    const { error } = await supabase.storage.from(SHOWCASE_BUCKET).upload(objectPath, buffer, {
      contentType,
      upsert: true,
      cacheControl: '31536000',
    });
    if (!error) {
      return supabase.storage.from(SHOWCASE_BUCKET).getPublicUrl(objectPath).data.publicUrl;
    }
    lastError = error;
    const retryable = /timeout|504|503|429/i.test(error.message + String(error.statusCode ?? ''));
    if (!retryable || attempt === 4) break;
    await sleep(1500 * attempt);
  }
  throw lastError;
}

async function findExistingProjectId(slug: string, previousSlugs: string[]) {
  const candidates = [slug, ...previousSlugs];
  for (const candidate of candidates) {
    const { data } = await supabase
      .from('ecommerce_projects')
      .select('id, slug, cover_image_url, cover_image_path')
      .eq('slug', candidate)
      .is('deleted_at', null)
      .maybeSingle();
    if (data?.id) return data as { id: string; slug: string; cover_image_url: string | null; cover_image_path: string | null };
  }
  return null;
}

async function main() {
  const { data: bitpCategory } = await supabase
    .from('categories')
    .select('id, slug, name')
    .eq('slug', BITP_ECOMMERCE_SOLUTIONS_SLUG)
    .maybeSingle();

  if (bitpCategory) {
    console.log(`BITP category: ${bitpCategory.name} (${bitpCategory.slug} / ${bitpCategory.id})`);
  } else {
    console.warn(
      `BITP category "${BITP_ECOMMERCE_SOLUTIONS_SLUG}" not found. Admin Products & Services will still map showcase projects to that slug in UI.`
    );
  }

  const { data: categories, error: catError } = await supabase.from('ecommerce_categories').select('id, slug');
  if (catError) {
    console.error('Showcase tables are missing. Apply supabase/migrations/20260906120000_ecommerce_showcase.sql first.');
    throw catError;
  }
  const categoryBySlug = new Map((categories ?? []).map((row) => [String(row.slug), String(row.id)]));

  const seeded: Array<{ id: string; slug: string; title: string; pages: number; coverPath: string | null }> = [];

  for (const brand of SEED_BRANDS) {
    const categoryId = categoryBySlug.get(brand.categorySlug);
    if (!categoryId) {
      console.warn(`Skipping ${brand.slug}: ecommerce category ${brand.categorySlug} missing`);
      continue;
    }

    assertSeedBrandForm(brand, categoryId);

    const existing = await findExistingProjectId(brand.slug, brand.previousSlugs);
    let projectId = existing?.id;
    const payload = {
      title: brand.title,
      slug: brand.slug,
      short_description: brand.short_description,
      full_description: brand.full_description,
      category_id: categoryId,
      technology_stack: brand.technology_stack,
      website_type: brand.website_type,
      industry: brand.industry,
      starting_price: brand.starting_price,
      currency: brand.currency,
      featured: brand.featured,
      published: brand.published,
      seo_title: brand.seo_title,
      seo_description: brand.seo_description,
      seo_keywords: brand.seo_keywords,
      sort_order: brand.sort_order,
      deleted_at: null,
    };

    if (projectId) {
      const { error } = await supabase.from('ecommerce_projects').update(payload).eq('id', projectId);
      if (error) throw error;
    } else {
      const { data, error } = await supabase.from('ecommerce_projects').insert(payload).select('id').single();
      if (error) throw error;
      projectId = data.id as string;
    }

    console.log(`Project ${brand.title} → ${brand.slug} (${projectId})`);
    const assets = getSeedAssetEntry(brand.slug);
    let pagesSeeded = 0;

    if (!coversOnly) {
    for (const [index, page] of brand.pages.entries()) {
      const { data: existingPage } = await supabase
        .from('ecommerce_project_pages')
        .select('id, image_url')
        .eq('project_id', projectId)
        .eq('slug', page.slug)
        .is('deleted_at', null)
        .maybeSingle();

      const pageId = (existingPage?.id as string | undefined) ?? crypto.randomUUID();
      const localPage = assets ? await resolveSeedPagePath(assets, page.slug) : null;
      const pageRow: Record<string, unknown> = {
        id: pageId,
        project_id: projectId,
        page_type: page.type,
        page_name: page.name,
        slug: page.slug,
        sort_order: index,
        published: true,
        deleted_at: null,
      };

      const shouldUpload = Boolean(localPage) && (force || !existingPage?.image_url);
      if (shouldUpload && localPage) {
        const jpeg = await prepareSeedImage(localPage, 1440);
        const processed = await processShowcaseImage(jpeg, 'image/jpeg');
        const avifPath = seedPageObjectPath(projectId, page.slug, 'avif');
        const webpPath = seedPageObjectPath(projectId, page.slug, 'webp');
        const thumbPath = seedPageThumbPath(projectId, page.slug);
        const imageUrl = await upload(avifPath, processed.desktop.avif, 'image/avif');
        const fallbackUrl = await upload(webpPath, processed.desktop.webp, 'image/webp');
        const thumbUrl = await upload(thumbPath, processed.thumbnail.webp, 'image/webp');
        pageRow.image_url = imageUrl;
        pageRow.image_path = avifPath;
        pageRow.fallback_url = fallbackUrl;
        pageRow.fallback_path = webpPath;
        pageRow.thumbnail_url = thumbUrl;
        pageRow.thumbnail_path = thumbPath;
        pageRow.image_width = processed.desktop.width;
        pageRow.image_height = processed.desktop.height;
        pagesSeeded += 1;
      } else if (existingPage?.image_url) {
        pagesSeeded += 1;
      } else if (!existingPage?.image_url) {
        console.warn(`  Missing screenshot: ${brand.slug}/${page.slug}`);
      }

      if (existingPage?.id) {
        const { error } = await supabase.from('ecommerce_project_pages').update(pageRow).eq('id', pageId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('ecommerce_project_pages').insert(pageRow);
        if (error) throw error;
      }
    }
    }

    let coverPath: string | null = existing?.cover_image_path ?? null;
    const coverLocal = assets ? await resolveSeedCoverPath(assets) : null;
    if (coverLocal) {
      const jpeg = await prepareSeedImage(coverLocal, 1600);
      const encoded = await encodeCover(jpeg);
      const version = createHash('sha1').update(encoded.webp).digest('hex').slice(0, 10);
      const avifPath = coverObjectPath(projectId, 'avif', version);
      const webpPath = coverObjectPath(projectId, 'webp', version);
      const coverUrl = await upload(avifPath, encoded.avif, 'image/avif');
      const fallbackUrl = await upload(webpPath, encoded.webp, 'image/webp');
      coverPath = avifPath;
      await supabase
        .from('ecommerce_projects')
        .update({
          cover_image_url: coverUrl,
          cover_image_path: avifPath,
          cover_fallback_url: fallbackUrl,
          cover_fallback_path: webpPath,
          og_image_url: fallbackUrl,
        })
        .eq('id', projectId);
      console.log(`  Cover uploaded (${version})`);
    } else if (!existing?.cover_image_url) {
      console.warn(`  Missing cover: ${brand.slug}`);
    }

    if (coversOnly) {
      seeded.push({ id: projectId, slug: brand.slug, title: brand.title, pages: pagesSeeded, coverPath });
      continue;
    }

    const keepSlugs = new Set(brand.pages.map((page) => page.slug));
    const { data: extraPages } = await supabase
      .from('ecommerce_project_pages')
      .select('id, slug')
      .eq('project_id', projectId)
      .is('deleted_at', null);
    const stalePages = (extraPages ?? []).filter((page) => !keepSlugs.has(String(page.slug)));
    if (stalePages.length) {
      await supabase
        .from('ecommerce_project_pages')
        .update({ deleted_at: new Date().toISOString(), published: false })
        .in(
          'id',
          stalePages.map((page) => page.id)
        );
    }

    const keepPkgNames = new Set(DEFAULT_PACKAGES.map((pkg) => pkg.name));
    const { data: extraPkgs } = await supabase
      .from('ecommerce_packages')
      .select('id, name')
      .eq('project_id', projectId)
      .is('deleted_at', null);
    const stalePkgs = (extraPkgs ?? []).filter((pkg) => !keepPkgNames.has(String(pkg.name)));
    if (stalePkgs.length) {
      await supabase
        .from('ecommerce_packages')
        .update({ deleted_at: new Date().toISOString(), active: false })
        .in(
          'id',
          stalePkgs.map((pkg) => pkg.id)
        );
    }

    for (const [index, pkg] of DEFAULT_PACKAGES.entries()) {
      const price = brand.starting_price + pkg.priceOffset;
      const { data: existingPkg } = await supabase
        .from('ecommerce_packages')
        .select('id')
        .eq('project_id', projectId)
        .eq('name', pkg.name)
        .is('deleted_at', null)
        .maybeSingle();
      const row = {
        project_id: projectId,
        name: pkg.name,
        price,
        currency: 'BDT',
        short_description: pkg.short_description,
        features: pkg.features,
        is_popular: pkg.is_popular,
        sort_order: index,
        active: true,
        deleted_at: null,
      };
      if (existingPkg?.id) {
        await supabase.from('ecommerce_packages').update(row).eq('id', existingPkg.id);
      } else {
        await supabase.from('ecommerce_packages').insert(row);
      }
    }

    seeded.push({ id: projectId, slug: brand.slug, title: brand.title, pages: pagesSeeded, coverPath });
  }

  console.log('\nSeed summary');
  for (const item of seeded) {
    console.log(`- ${item.title} | ${item.slug} | ${item.id} | pages=${item.pages} | cover=${item.coverPath ?? 'none'}`);
  }
  console.log('Ecommerce showcase seed complete.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
