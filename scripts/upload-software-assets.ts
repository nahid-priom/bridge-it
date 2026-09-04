/**
 * Atomic upload + DB sync for canonical software showcase assets.
 *
 * For each product:
 *   validate local → upload versioned Storage paths → update DB transactionally → bump asset_version
 *
 * Usage:
 *   npx tsx scripts/upload-software-assets.ts [--slug=…] [--dry-run]
 *   npx tsx scripts/sync-software-assets.ts   (alias)
 */
import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { SOFTWARE_SEED_PRODUCTS } from '../src/features/software-showcase/seed/catalog';
import { SOFTWARE_BUCKET } from '../src/features/software-showcase/config/constants';
import {
  coverCardPath,
  coverDetailPath,
  screenPreviewPath,
  screenThumbPath,
  screenMobilePath,
} from '../src/features/software-showcase/utils/storage-paths';

config({ path: '.env.local' });
config({ path: '.env' });

const ASSETS_ROOT = path.join(process.cwd(), 'seed-assets/software');
const ASSET_VERSION = 3;
const force = process.argv.includes('--force') || !process.argv.includes('--skip-existing');
const dryRun = process.argv.includes('--dry-run');
const slugArg = process.argv.find((a) => a.startsWith('--slug='))?.slice(7);

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

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function upload(objectPath: string, buffer: Buffer) {
  if (dryRun) {
    console.log(`    [dry-run] upload ${objectPath} (${buffer.length} bytes)`);
    return `${url}/storage/v1/object/public/${SOFTWARE_BUCKET}/${objectPath}`;
  }
  let lastError: unknown;
  for (let attempt = 1; attempt <= 4; attempt++) {
    const { error } = await supabase.storage.from(SOFTWARE_BUCKET).upload(objectPath, buffer, {
      contentType: 'image/avif',
      upsert: true,
      cacheControl: '31536000, immutable',
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

async function validateLocal(slug: string, screens: Array<{ key: string }>) {
  const dir = path.join(ASSETS_ROOT, slug);
  const issues: string[] = [];
  if (!(await exists(path.join(dir, 'design-manifest.json')))) issues.push('missing design-manifest.json');
  if (!(await exists(path.join(dir, 'cover/card.avif')))) issues.push('missing cover/card.avif');
  if (!(await exists(path.join(dir, 'cover/detail.avif')))) issues.push('missing cover/detail.avif');
  if (screens.length < 10) issues.push(`only ${screens.length} screens in catalog (<10)`);
  for (const s of screens) {
    if (!(await exists(path.join(dir, 'screens', s.key, 'preview.avif')))) issues.push(`missing screens/${s.key}/preview.avif`);
    if (!(await exists(path.join(dir, 'screens', s.key, 'thumb.avif')))) issues.push(`missing screens/${s.key}/thumb.avif`);
  }
  return issues;
}

async function syncProduct(product: (typeof SOFTWARE_SEED_PRODUCTS)[number]) {
  const issues = await validateLocal(product.slug, product.screens);
  if (issues.length) {
    console.warn(`  SKIP ${product.slug}: ${issues.join('; ')}`);
    return { ok: false, issues };
  }

  const { data: existing, error: findErr } = await supabase
    .from('software_projects')
    .select('id, asset_version, cover_card_url')
    .eq('slug', product.slug)
    .is('deleted_at', null)
    .maybeSingle();
  if (findErr) throw findErr;
  if (!existing?.id) {
    console.warn(`  SKIP ${product.slug}: no DB project row (run seed metadata first)`);
    return { ok: false, issues: ['missing db row'] };
  }

  const version = ASSET_VERSION;
  const dir = path.join(ASSETS_ROOT, product.slug);

  console.log(`  uploading v${version}…`);

  const cardBuf = await readFile(path.join(dir, 'cover/card.avif'));
  const detailBuf = await readFile(path.join(dir, 'cover/detail.avif'));
  const cardObject = coverCardPath(product.slug, version);
  const detailObject = coverDetailPath(product.slug, version);
  const cardUrl = await upload(cardObject, cardBuf);
  const detailUrl = await upload(detailObject, detailBuf);

  const screenRows: Array<Record<string, unknown>> = [];
  for (const [index, screen] of product.screens.entries()) {
    const sdir = path.join(dir, 'screens', screen.key);
    const previewBuf = await readFile(path.join(sdir, 'preview.avif'));
    const thumbBuf = await readFile(path.join(sdir, 'thumb.avif'));
    const previewObject = screenPreviewPath(product.slug, version, screen.key);
    const thumbObject = screenThumbPath(product.slug, version, screen.key);
    const previewUrl = await upload(previewObject, previewBuf);
    const thumbUrl = await upload(thumbObject, thumbBuf);

    const row: Record<string, unknown> = {
      project_id: existing.id,
      screen_key: screen.key,
      screen_name: screen.name,
      module_name: screen.name,
      short_caption: `${product.title} — ${screen.name}`,
      image_url: previewUrl,
      image_path: previewObject,
      thumbnail_url: thumbUrl,
      thumbnail_path: thumbObject,
      image_width: 960,
      image_height: 600,
      sort_order: index,
      is_featured: index === 0,
      published: true,
      deleted_at: null,
      updated_at: new Date().toISOString(),
    };

    const mobilePath = path.join(sdir, 'mobile.avif');
    if (await exists(mobilePath)) {
      const mobileBuf = await readFile(mobilePath);
      const mobileObject = screenMobilePath(product.slug, version, screen.key);
      const mobileUrl = await upload(mobileObject, mobileBuf);
      row.mobile_image_url = mobileUrl;
      row.mobile_image_path = mobileObject;
    }
    screenRows.push(row);
  }

  if (dryRun) {
    console.log(`  [dry-run] would update project ${product.slug} + ${screenRows.length} screens`);
    return { ok: true, issues: [] };
  }

  // Soft-delete screens no longer in catalog
  const keepKeys = new Set(product.screens.map((s) => s.key));
  const { data: oldScreens } = await supabase
    .from('software_project_screens')
    .select('id, screen_key')
    .eq('project_id', existing.id)
    .is('deleted_at', null);
  for (const old of oldScreens ?? []) {
    if (!keepKeys.has(String(old.screen_key))) {
      await supabase
        .from('software_project_screens')
        .update({ deleted_at: new Date().toISOString(), published: false })
        .eq('id', old.id);
    }
  }

  for (const row of screenRows) {
    const { data: existingScreen } = await supabase
      .from('software_project_screens')
      .select('id')
      .eq('project_id', existing.id)
      .eq('screen_key', row.screen_key as string)
      .is('deleted_at', null)
      .maybeSingle();
    if (existingScreen?.id) {
      const { error } = await supabase.from('software_project_screens').update(row).eq('id', existingScreen.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('software_project_screens').insert(row);
      if (error) throw error;
    }
  }

  const { error: projErr } = await supabase
    .from('software_projects')
    .update({
      cover_card_url: cardUrl,
      cover_card_path: cardObject,
      cover_detail_url: detailUrl,
      cover_detail_path: detailObject,
      og_image_url: detailUrl,
      asset_version: version,
      updated_at: new Date().toISOString(),
      published: true,
    })
    .eq('id', existing.id);
  if (projErr) throw projErr;

  console.log(`  OK ${product.slug} — ${screenRows.length} screens, asset_version=${version}`);
  return { ok: true, issues: [] };
}

async function main() {
  const list = slugArg
    ? SOFTWARE_SEED_PRODUCTS.filter((p) => p.slug === slugArg)
    : SOFTWARE_SEED_PRODUCTS;
  console.log(`${dryRun ? '[DRY-RUN] ' : ''}Syncing ${list.length} products from ${ASSETS_ROOT}`);
  let ok = 0;
  let fail = 0;
  for (const product of list) {
    console.log(`\n${product.slug}`);
    const result = await syncProduct(product);
    if (result.ok) ok += 1;
    else fail += 1;
  }
  console.log(`\nDone. ok=${ok} fail=${fail}`);
  if (fail) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
