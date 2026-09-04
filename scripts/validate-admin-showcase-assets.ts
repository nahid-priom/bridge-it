/**
 * Validate admin showcase local assets.
 * Usage: npx tsx scripts/validate-admin-showcase-assets.ts
 */
import { access, readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { SOFTWARE_SEED_PRODUCTS } from '../src/features/software-showcase/seed/catalog';

const ROOT = path.join(process.cwd(), 'seed-assets/admin-systems');
const CARD_LIMIT = 50 * 1024;
const THUMB_LIMIT = 35 * 1024;

type Issue = { slug: string; file: string; message: string; level: 'FAIL' | 'WARN' };

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const issues: Issue[] = [];
  let covers = 0;
  let screens = 0;
  let cardBytes = 0;
  let over50 = 0;
  let largest = { file: '', size: 0 };

  for (const product of SOFTWARE_SEED_PRODUCTS) {
    const dir = path.join(ROOT, product.slug);
    if (!(await exists(dir))) {
      issues.push({ slug: product.slug, file: dir, message: 'missing project folder', level: 'FAIL' });
      continue;
    }

    const manifest = path.join(dir, 'design-manifest.json');
    if (!(await exists(manifest))) {
      issues.push({ slug: product.slug, file: 'design-manifest.json', message: 'missing', level: 'FAIL' });
    } else {
      try {
        JSON.parse(await readFile(manifest, 'utf8'));
      } catch {
        issues.push({ slug: product.slug, file: 'design-manifest.json', message: 'invalid JSON', level: 'FAIL' });
      }
    }

    const coverCard = path.join(dir, 'cover-card.avif');
    if (!(await exists(coverCard))) {
      issues.push({ slug: product.slug, file: 'cover-card.avif', message: 'missing', level: 'FAIL' });
    } else {
      covers += 1;
      const s = await stat(coverCard);
      cardBytes += s.size;
      if (s.size > largest.size) largest = { file: `${product.slug}/cover-card.avif`, size: s.size };
      if (s.size > CARD_LIMIT) {
        over50 += 1;
        issues.push({
          slug: product.slug,
          file: 'cover-card.avif',
          message: `${(s.size / 1024).toFixed(1)} KB > 50 KB`,
          level: 'FAIL',
        });
      }
      const meta = await sharp(coverCard).metadata();
      if (!meta.width || meta.width < 400) {
        issues.push({ slug: product.slug, file: 'cover-card.avif', message: 'width too small', level: 'WARN' });
      }
    }

    if (!(await exists(path.join(dir, 'cover-detail.avif')))) {
      issues.push({ slug: product.slug, file: 'cover-detail.avif', message: 'missing', level: 'WARN' });
    }

    if (product.screens.length < 10) {
      issues.push({
        slug: product.slug,
        file: 'screens',
        message: `only ${product.screens.length} screen defs`,
        level: 'FAIL',
      });
    }

    for (const screen of product.screens) {
      const preview = path.join(dir, `${screen.key}.avif`);
      const thumb = path.join(dir, `${screen.key}-thumb.avif`);
      if (!(await exists(preview))) {
        issues.push({ slug: product.slug, file: `${screen.key}.avif`, message: 'missing', level: 'FAIL' });
      } else {
        screens += 1;
        const s = await stat(preview);
        if (s.size > largest.size) largest = { file: `${product.slug}/${screen.key}.avif`, size: s.size };
      }
      if (!(await exists(thumb))) {
        issues.push({ slug: product.slug, file: `${screen.key}-thumb.avif`, message: 'missing', level: 'WARN' });
      } else {
        const s = await stat(thumb);
        if (s.size > THUMB_LIMIT) {
          issues.push({
            slug: product.slug,
            file: `${screen.key}-thumb.avif`,
            message: `${(s.size / 1024).toFixed(1)} KB > 35 KB`,
            level: 'WARN',
          });
        }
      }
    }

    // duplicate filename check within folder
    const files = await readdir(dir);
    const seen = new Set<string>();
    for (const f of files) {
      if (seen.has(f)) issues.push({ slug: product.slug, file: f, message: 'duplicate filename', level: 'FAIL' });
      seen.add(f);
    }
  }

  // crude hash duplicates across cover-cards
  const hashes = new Map<string, string>();
  for (const product of SOFTWARE_SEED_PRODUCTS) {
    const coverCard = path.join(ROOT, product.slug, 'cover-card.avif');
    if (!(await exists(coverCard))) continue;
    const buf = await readFile(coverCard);
    const hash = createHash('sha1').update(buf).digest('hex');
    const prev = hashes.get(hash);
    if (prev) {
      issues.push({
        slug: product.slug,
        file: 'cover-card.avif',
        message: `duplicate bytes with ${prev}`,
        level: 'FAIL',
      });
    } else {
      hashes.set(hash, product.slug);
    }
  }

  const fails = issues.filter((i) => i.level === 'FAIL');
  const warns = issues.filter((i) => i.level === 'WARN');

  console.log('=== Admin Showcase Asset Validation ===');
  console.log(`Products: ${SOFTWARE_SEED_PRODUCTS.length}`);
  console.log(`Covers found: ${covers}`);
  console.log(`Screen previews found: ${screens}`);
  console.log(`Avg cover-card size: ${covers ? (cardBytes / covers / 1024).toFixed(1) : 0} KB`);
  console.log(`Cover-cards >50KB: ${over50}`);
  console.log(`Largest asset: ${largest.file} (${(largest.size / 1024).toFixed(1)} KB)`);
  console.log(`FAIL: ${fails.length}  WARN: ${warns.length}`);
  for (const i of issues.slice(0, 40)) {
    console.log(`${i.level} ${i.slug}/${i.file}: ${i.message}`);
  }
  if (issues.length > 40) console.log(`... ${issues.length - 40} more`);
  process.exit(fails.length ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
