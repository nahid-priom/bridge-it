/**
 * Ingest Cursor GenerateImage / assets/*.png → seed-assets AVIF + manifest.
 *
 *   npx tsx scripts/ai-software-showcase/generation/ingest-ai-assets.ts
 *   npx tsx scripts/ai-software-showcase/generation/ingest-ai-assets.ts --slug=hotel-management
 *   npx tsx scripts/ai-software-showcase/generation/ingest-ai-assets.ts --covers-only --force
 *   npx tsx scripts/ai-software-showcase/generation/ingest-ai-assets.ts --missing-only
 */
import {
  ALL_PHASE1_HERO_PRODUCTS,
  coverPngName,
  filterHeroProducts,
  screenPngName,
} from '../config/hero-registry';
import {
  MIN_AI_COVER_BYTES,
  MIN_AI_SCREEN_BYTES,
  SEED_ROOT,
  assertMinBytes,
  encodeCover,
  encodeScreen,
  fileExists,
  patchManifest,
  resolvePng,
} from '../processing/normalize-image';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const slugArg = process.argv.find((a) => a.startsWith('--slug='))?.slice('--slug='.length);
const industryArg = process.argv.find((a) => a.startsWith('--industry='))?.slice('--industry='.length);
const coversOnly = process.argv.includes('--covers-only');
const screensOnly = process.argv.includes('--screens-only');
const missingOnly = process.argv.includes('--missing-only');
const force = process.argv.includes('--force');
const dryRun = process.argv.includes('--dry-run');

async function main() {
  const products = filterHeroProducts({
    slug: slugArg,
    industry: industryArg,
    missingOnly,
  });

  if (products.length === 0) {
    console.error('No products matched. Known:', ALL_PHASE1_HERO_PRODUCTS.map((p) => p.slug).join(', '));
    process.exit(1);
  }

  let covers = 0;
  let screens = 0;
  let skipped = 0;

  for (const product of products) {
    console.log(`\n── ${product.slug} ──`);
    const coverFile = coverPngName(product.slug);
    const coverSrc = await resolvePng(coverFile);
    let coverAi = false;
    const coverDir = path.join(SEED_ROOT, product.slug, 'cover');
    const cardPath = path.join(coverDir, 'card.avif');
    const cardExists = await fileExists(cardPath);
    const cardIsTiny = cardExists ? !(await assertMinBytes(cardPath, MIN_AI_COVER_BYTES, `${product.slug}/cover-check`)) : true;

    if (!screensOnly) {
      if (coverSrc && (force || !cardExists || cardIsTiny || product.needsCoverUpgrade)) {
        if (dryRun) {
          console.log(`  [dry-run] cover ← ${coverFile}`);
        } else {
          const buf = await readFile(coverSrc);
          const { cardBytes } = await encodeCover(buf, coverDir);
          coverAi = await assertMinBytes(cardPath, MIN_AI_COVER_BYTES, `${product.slug}/cover`);
          covers += 1;
          console.log(`  cover ← ${path.basename(coverSrc)} (${(cardBytes / 1024).toFixed(1)}KB)`);
        }
      } else if (!coverSrc) {
        console.log(`  cover skip (missing ${coverFile})`);
        skipped += 1;
        if (cardExists && !cardIsTiny) coverAi = true;
      } else {
        console.log('  cover preserved (use --force to overwrite)');
        coverAi = !cardIsTiny;
      }
    } else if (cardExists && !cardIsTiny) {
      coverAi = true;
    }

    const aiScreens: string[] = [];
    if (!coversOnly) {
      for (const hero of product.heroes) {
        const png = screenPngName(product.slug, hero.key);
        const src = await resolvePng(png);
        const outDir = path.join(SEED_ROOT, product.slug, 'screens', hero.key);
        const previewPath = path.join(outDir, 'preview.avif');
        const previewExists = await fileExists(previewPath);
        const previewOk =
          previewExists && (await assertMinBytes(previewPath, MIN_AI_SCREEN_BYTES, `${product.slug}/${hero.key}-check`));

        if (!src) {
          if (previewOk) {
            aiScreens.push(hero.key);
            console.log(`  ${hero.key} preserved (AI)`);
          } else {
            console.log(`  screen skip ${hero.key} (missing ${png})`);
            skipped += 1;
          }
          continue;
        }

        if (!force && previewOk) {
          aiScreens.push(hero.key);
          console.log(`  ${hero.key} skip (approved AI exists)`);
          continue;
        }

        if (dryRun) {
          console.log(`  [dry-run] ${hero.key} ← ${png}`);
          continue;
        }

        const buf = await readFile(src);
        const { previewBytes } = await encodeScreen(buf, outDir);
        const ok = await assertMinBytes(previewPath, MIN_AI_SCREEN_BYTES, `${product.slug}/${hero.key}`);
        if (ok) aiScreens.push(hero.key);
        screens += 1;
        console.log(`  ${hero.key} ← ${png} (${(previewBytes / 1024).toFixed(1)}KB)`);
      }
    }

    if (!dryRun) await patchManifest(product, aiScreens, coverAi, force);
  }

  console.log(`\nIngest done. covers=${covers} screens=${screens} skipped=${skipped}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
