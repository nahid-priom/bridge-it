/**
 * Ingest Cursor GenerateImage PNGs into canonical seed-assets AVIF tree.
 *
 * Sources (first hit wins):
 *   1. Cursor assets: ~/.cursor/projects/.../assets/{file}.png
 *   2. Repo assets/: assets/{file}.png
 *
 * Run:
 *   npx tsx scripts/ai-software-generator/ingest-ai-assets.ts
 *   npx tsx scripts/ai-software-generator/ingest-ai-assets.ts --slug=feed-mill-erp
 *   npx tsx scripts/ai-software-generator/ingest-ai-assets.ts --replace-covers
 */
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { FEED_MILL_HERO_SET, screenPngName } from './feed-mill-hero-set';
import { FEED_MILL_DESIGN_SYSTEM } from './design-tokens';
import { assertMinBytes, fileExists, MIN_AI_COVER_BYTES, MIN_AI_SCREEN_BYTES } from './image-validation';
import { productBySlug } from './product-context';

const CURSOR_ASSETS =
  '/home/priom/.cursor/projects/home-priom-Desktop-bridge-it-park-smart-it-park/assets';
const REPO_ASSETS = path.join(process.cwd(), 'assets');
const ROOT = path.join(process.cwd(), 'seed-assets/software');

const slugFilter = process.argv.find((a) => a.startsWith('--slug='))?.slice('--slug='.length);
const replaceCovers = process.argv.includes('--replace-covers');

async function resolvePng(file: string): Promise<string | null> {
  for (const dir of [CURSOR_ASSETS, REPO_ASSETS]) {
    const p = path.join(dir, file);
    if (await fileExists(p)) return p;
  }
  return null;
}

async function encodeCover(input: Buffer, outDir: string) {
  await mkdir(outDir, { recursive: true });
  const card = await sharp(input)
    .resize({ width: 1200, height: 750, fit: 'cover' })
    .avif({ quality: 70, effort: 5 })
    .toBuffer();
  const detail = await sharp(input)
    .resize({ width: 1600, height: 1000, fit: 'cover' })
    .avif({ quality: 72, effort: 5 })
    .toBuffer();
  await writeFile(path.join(outDir, 'card.avif'), card);
  await writeFile(path.join(outDir, 'detail.avif'), detail);
  return { cardBytes: card.length, detailBytes: detail.length };
}

async function encodeScreen(input: Buffer, outDir: string) {
  await mkdir(outDir, { recursive: true });
  const preview = await sharp(input)
    .resize({ width: 1280, withoutEnlargement: true })
    .avif({ quality: 68, effort: 5 })
    .toBuffer();
  const thumb = await sharp(input)
    .resize({ width: 480, withoutEnlargement: true })
    .avif({ quality: 55, effort: 5 })
    .toBuffer();
  await writeFile(path.join(outDir, 'preview.avif'), preview);
  await writeFile(path.join(outDir, 'thumb.avif'), thumb);
  return { previewBytes: preview.length, thumbBytes: thumb.length };
}

async function patchManifest(
  slug: string,
  aiScreens: string[],
  coverAi: boolean
): Promise<void> {
  const manifestPath = path.join(ROOT, slug, 'design-manifest.json');
  let base: Record<string, unknown> = {};
  try {
    base = JSON.parse(await readFile(manifestPath, 'utf8')) as Record<string, unknown>;
  } catch {
    const product = productBySlug(slug);
    base = {
      productName: product?.title ?? slug,
      brandName: product?.brandName ?? slug,
    };
  }
  const next = {
    ...base,
    visualVersion: FEED_MILL_DESIGN_SYSTEM.visualVersion,
    generationMode: coverAi || aiScreens.length ? 'ai-premium' : 'svg-fallback',
    industry: 'feed-mill',
    theme: 'enterprise-red-blue',
    designSystem: FEED_MILL_DESIGN_SYSTEM.id,
    assetVersion: FEED_MILL_DESIGN_SYSTEM.visualVersion,
    qaApproved: coverAi || aiScreens.length > 0,
    aiHeroScreens: aiScreens,
    coverSource: coverAi ? 'ai' : (base.coverSource ?? 'svg-or-preserved'),
    generatedAt: new Date().toISOString(),
  };
  await writeFile(manifestPath, JSON.stringify(next, null, 2));
}

async function main() {
  const products = slugFilter
    ? FEED_MILL_HERO_SET.filter((p) => p.slug === slugFilter)
    : FEED_MILL_HERO_SET;

  if (products.length === 0) {
    console.error('No products matched');
    process.exit(1);
  }

  let covers = 0;
  let screens = 0;
  let skipped = 0;

  for (const product of products) {
    console.log(`\n── ${product.slug} ──`);
    const coverSrc = await resolvePng(product.coverFile);
    let coverAi = false;
    const coverDir = path.join(ROOT, product.slug, 'cover');
    const cardPath = path.join(coverDir, 'card.avif');
    const cardExists = await fileExists(cardPath);

    if (coverSrc && (replaceCovers || !cardExists)) {
      const buf = await readFile(coverSrc);
      const { cardBytes } = await encodeCover(buf, coverDir);
      const ok = await assertMinBytes(cardPath, MIN_AI_COVER_BYTES, `${product.slug}/cover`);
      coverAi = ok;
      covers += 1;
      console.log(`  cover ← ${path.basename(coverSrc)} (${(cardBytes / 1024).toFixed(1)}KB)`);
    } else if (!coverSrc) {
      console.log(`  cover skip (missing ${product.coverFile})`);
      skipped += 1;
    } else {
      console.log('  cover preserved (use --replace-covers to overwrite)');
      coverAi = await assertMinBytes(cardPath, MIN_AI_COVER_BYTES, `${product.slug}/cover`);
    }

    const aiScreens: string[] = [];
    for (const hero of product.heroes) {
      const png = screenPngName(product.slug, hero.key);
      const src = await resolvePng(png);
      if (!src) {
        console.log(`  screen skip ${hero.key} (missing ${png})`);
        skipped += 1;
        continue;
      }
      const outDir = path.join(ROOT, product.slug, 'screens', hero.key);
      const buf = await readFile(src);
      const { previewBytes } = await encodeScreen(buf, outDir);
      const previewPath = path.join(outDir, 'preview.avif');
      const ok = await assertMinBytes(previewPath, MIN_AI_SCREEN_BYTES, `${product.slug}/${hero.key}`);
      if (ok) aiScreens.push(hero.key);
      screens += 1;
      console.log(`  ${hero.key} ← ${png} (${(previewBytes / 1024).toFixed(1)}KB)`);
    }

    await patchManifest(product.slug, aiScreens, coverAi);
  }

  console.log(`\nIngest done. covers=${covers} screens=${screens} skipped=${skipped}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
