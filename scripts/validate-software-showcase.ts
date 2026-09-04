/**
 * Validate canonical Software showcase assets for all 50 products.
 * Exit non-zero if any published product fails.
 *
 * Usage: npx tsx scripts/validate-software-showcase.ts [--local-only] [--remote]
 */
import { access, readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { SOFTWARE_SEED_PRODUCTS } from '../src/features/software-showcase/seed/catalog';
import { SOFTWARE_BUCKET } from '../src/features/software-showcase/config/constants';

config({ path: '.env.local' });
config({ path: '.env' });

const ROOT = path.join(process.cwd(), 'seed-assets/software');
const localOnly = process.argv.includes('--local-only');
const remote = process.argv.includes('--remote') || !localOnly;

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function fileHash(p: string) {
  const buf = await readFile(p);
  return createHash('sha256').update(buf).digest('hex').slice(0, 16);
}

type Issue = { slug: string; level: 'error' | 'warn'; message: string };

async function main() {
  const issues: Issue[] = [];
  const hashes = new Map<string, string[]>();
  let covers = 0;
  let screens = 0;
  let mobileScreens = 0;
  let cardBytes = 0;
  let previewBytes = 0;
  let largestPreview = { slug: '', key: '', bytes: 0 };

  for (const product of SOFTWARE_SEED_PRODUCTS) {
    const dir = path.join(ROOT, product.slug);
    const manifest = path.join(dir, 'design-manifest.json');
    if (!(await exists(manifest))) {
      issues.push({ slug: product.slug, level: 'error', message: 'missing design-manifest.json' });
    }
    const card = path.join(dir, 'cover/card.avif');
    const detail = path.join(dir, 'cover/detail.avif');
    if (!(await exists(card))) issues.push({ slug: product.slug, level: 'error', message: 'missing cover/card.avif' });
    else {
      covers += 1;
      cardBytes += (await stat(card)).size;
      const h = await fileHash(card);
      hashes.set(h, [...(hashes.get(h) ?? []), `${product.slug}:cover`]);
    }
    if (!(await exists(detail))) issues.push({ slug: product.slug, level: 'error', message: 'missing cover/detail.avif' });

    if (product.screens.length < 10) {
      issues.push({
        slug: product.slug,
        level: 'error',
        message: `catalog has ${product.screens.length} screens (<10)`,
      });
    }

    const keys = new Set<string>();
    for (const screen of product.screens) {
      if (keys.has(screen.key)) {
        issues.push({ slug: product.slug, level: 'error', message: `duplicate screen_key ${screen.key}` });
      }
      keys.add(screen.key);
      const preview = path.join(dir, 'screens', screen.key, 'preview.avif');
      const thumb = path.join(dir, 'screens', screen.key, 'thumb.avif');
      const mobile = path.join(dir, 'screens', screen.key, 'mobile.avif');
      if (!(await exists(preview))) {
        issues.push({ slug: product.slug, level: 'error', message: `missing screens/${screen.key}/preview.avif` });
      } else {
        screens += 1;
        const sz = (await stat(preview)).size;
        previewBytes += sz;
        if (sz > largestPreview.bytes) largestPreview = { slug: product.slug, key: screen.key, bytes: sz };
        const h = await fileHash(preview);
        hashes.set(h, [...(hashes.get(h) ?? []), `${product.slug}:${screen.key}`]);
      }
      if (!(await exists(thumb))) {
        issues.push({ slug: product.slug, level: 'error', message: `missing screens/${screen.key}/thumb.avif` });
      }
      if (await exists(mobile)) mobileScreens += 1;
    }
  }

  for (const [hash, refs] of hashes) {
    if (refs.length > 1) {
      issues.push({
        slug: refs[0].split(':')[0],
        level: 'warn',
        message: `duplicate asset hash ${hash}: ${refs.join(', ')}`,
      });
    }
  }

  if (remote) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    if (!url || !key) {
      issues.push({ slug: '*', level: 'error', message: 'missing supabase env for remote validation' });
    } else {
      const supabase = createClient(url, key, { auth: { persistSession: false } });
      for (const product of SOFTWARE_SEED_PRODUCTS) {
        const { data: row } = await supabase
          .from('software_projects')
          .select(
            'id, published, cover_card_url, cover_detail_url, cover_card_path, cover_detail_path, asset_version'
          )
          .eq('slug', product.slug)
          .is('deleted_at', null)
          .maybeSingle();
        if (!row) {
          issues.push({ slug: product.slug, level: 'error', message: 'missing DB row' });
          continue;
        }
        if (row.published) {
          if (!row.cover_card_url || !row.cover_detail_url) {
            issues.push({ slug: product.slug, level: 'error', message: 'published but missing cover URLs' });
          }
          if (row.cover_card_path && !String(row.cover_card_path).includes('software-showcase/')) {
            issues.push({
              slug: product.slug,
              level: 'error',
              message: `legacy cover path still active: ${row.cover_card_path}`,
            });
          }
          if (Number(row.asset_version ?? 0) < 4) {
            issues.push({
              slug: product.slug,
              level: 'warn',
              message: `asset_version=${row.asset_version} (expected >=4 after premium screen rebuild)`,
            });
          }
          const { data: screensRows } = await supabase
            .from('software_project_screens')
            .select('screen_key, image_url, thumbnail_url, image_path')
            .eq('project_id', row.id)
            .eq('published', true)
            .is('deleted_at', null);
          const count = screensRows?.length ?? 0;
          if (count < 10) {
            issues.push({
              slug: product.slug,
              level: 'error',
              message: `published product has ${count} screens (<10)`,
            });
          }
          for (const s of screensRows ?? []) {
            if (!s.image_url || !s.thumbnail_url) {
              issues.push({
                slug: product.slug,
                level: 'error',
                message: `screen ${s.screen_key} missing image/thumb URL`,
              });
            }
            if (s.image_path && !String(s.image_path).includes('software-showcase/')) {
              issues.push({
                slug: product.slug,
                level: 'error',
                message: `legacy screen path: ${s.image_path}`,
              });
            }
          }
        }
      }
      void SOFTWARE_BUCKET;
    }
  }

  const errors = issues.filter((i) => i.level === 'error');
  const warns = issues.filter((i) => i.level === 'warn');
  const pass = SOFTWARE_SEED_PRODUCTS.length - new Set(errors.map((e) => e.slug)).size;

  console.log(
    JSON.stringify(
      {
        total: SOFTWARE_SEED_PRODUCTS.length,
        pass,
        fail: SOFTWARE_SEED_PRODUCTS.length - pass,
        covers,
        screens,
        avgScreens: screens / SOFTWARE_SEED_PRODUCTS.length,
        mobileScreens,
        avgCardKB: covers ? +(cardBytes / covers / 1024).toFixed(1) : 0,
        avgPreviewKB: screens ? +(previewBytes / screens / 1024).toFixed(1) : 0,
        largestPreview,
        errors: errors.length,
        warnings: warns.length,
        issueSample: issues.slice(0, 40),
      },
      null,
      2
    )
  );

  if (errors.length) process.exit(1);
  console.log(`\nFinal validation: ${pass} / ${SOFTWARE_SEED_PRODUCTS.length} PASS`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
