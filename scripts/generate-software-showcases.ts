/**
 * Premium Software showcase asset generator (v4).
 * Screens use the componentized software-screen-engine.
 * Covers: prefer existing lifestyle assets; SVG cover only if missing.
 *
 * Usage:
 *   npx tsx scripts/generate-software-showcases.ts [--slug=…] [--force]
 *     [--screens-only] [--covers-only] [--manifests-only]
 */
import { mkdir, writeFile, access, rm } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { SOFTWARE_SEED_PRODUCTS } from '../src/features/software-showcase/seed/catalog';
import type { SeedSoftwareProduct } from '../src/features/software-showcase/types';
import {
  screenSvg,
  mobileSvg,
  coverSvg,
  buildManifest,
  visualFamily,
} from './software-screen-engine';

const ROOT = path.join(process.cwd(), 'seed-assets/software');
const ASSET_VERSION = 4;
const force = process.argv.includes('--force');
const screensOnly = process.argv.includes('--screens-only');
const coversOnly = process.argv.includes('--covers-only');
const manifestsOnly = process.argv.includes('--manifests-only');
const slugArg = process.argv.find((a) => a.startsWith('--slug='))?.slice(7);

const CARD_W = 800;
const DETAIL_W = 1200;
const PREVIEW_W = 1100;
const THUMB_W = 480;

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

function wantsMobile(product: SeedSoftwareProduct) {
  return (
    product.platformType === 'mobile' ||
    product.platformType === 'web-mobile' ||
    /sales-force|dealer|delivery|pos|field/i.test(product.slug)
  );
}

async function svgToAvif(svg: string, outPath: string, width: number, quality: number, maxBytes?: number) {
  let q = quality;
  let buf = await sharp(Buffer.from(svg)).resize({ width, withoutEnlargement: true }).avif({ quality: q, effort: 5 }).toBuffer();
  if (maxBytes) {
    while (buf.length > maxBytes && q > 36) {
      q -= 4;
      buf = await sharp(Buffer.from(svg)).resize({ width, withoutEnlargement: true }).avif({ quality: q, effort: 5 }).toBuffer();
    }
  }
  await writeFile(outPath, buf);
  return buf.length;
}

async function generateProduct(product: SeedSoftwareProduct) {
  const dir = path.join(ROOT, product.slug);
  const coverDir = path.join(dir, 'cover');
  const screensDir = path.join(dir, 'screens');
  await mkdir(coverDir, { recursive: true });
  await mkdir(screensDir, { recursive: true });

  await writeFile(path.join(dir, 'design-manifest.json'), JSON.stringify(buildManifest(product, ASSET_VERSION), null, 2));
  console.log(`  wrote design-manifest.json (v${ASSET_VERSION}, ${visualFamily(product)})`);

  if (manifestsOnly) return;

  if (!screensOnly) {
    const cardPath = path.join(coverDir, 'card.avif');
    const detailPath = path.join(coverDir, 'detail.avif');
    // Preserve lifestyle covers — only generate SVG covers when missing
    if (force && !(await exists(cardPath))) {
      const svg = coverSvg(product);
      const card = await svgToAvif(svg, cardPath, CARD_W, 58, 80 * 1024);
      const detail = await svgToAvif(svg, detailPath, DETAIL_W, 65);
      console.log(`  cover card ${(card / 1024).toFixed(1)}KB detail ${(detail / 1024).toFixed(1)}KB (svg fallback)`);
    } else if (!(await exists(cardPath)) || !(await exists(detailPath))) {
      const svg = coverSvg(product);
      if (!(await exists(cardPath))) {
        const card = await svgToAvif(svg, cardPath, CARD_W, 58, 80 * 1024);
        console.log(`  cover card ${(card / 1024).toFixed(1)}KB (svg fallback)`);
      }
      if (!(await exists(detailPath))) {
        const detail = await svgToAvif(svg, detailPath, DETAIL_W, 65);
        console.log(`  cover detail ${(detail / 1024).toFixed(1)}KB (svg fallback)`);
      }
    } else {
      console.log('  covers preserved (lifestyle / existing)');
    }
  }

  if (coversOnly) return;

  for (const screen of product.screens) {
    const sdir = path.join(screensDir, screen.key);
    await mkdir(sdir, { recursive: true });
    const preview = path.join(sdir, 'preview.avif');
    const thumb = path.join(sdir, 'thumb.avif');
    const mobile = path.join(sdir, 'mobile.avif');
    if (!force && (await exists(preview)) && (await exists(thumb))) continue;
    const svg = screenSvg(product, screen);
    const isDash = screen.category === 'dashboard' || screen.key.includes('dashboard');
    const p = await svgToAvif(svg, preview, PREVIEW_W, isDash ? 72 : 66, 90 * 1024);
    const th = await svgToAvif(svg, thumb, THUMB_W, 55, 35 * 1024);
    let mobileNote = '';
    if (wantsMobile(product) && (screen.category === 'dashboard' || screen.category === 'transaction' || screen.category === 'list')) {
      const m = await svgToAvif(mobileSvg(product, screen), mobile, 420, 58);
      mobileNote = ` mobile ${(m / 1024).toFixed(1)}KB`;
    }
    console.log(`  ${screen.key} preview ${(p / 1024).toFixed(1)}KB thumb ${(th / 1024).toFixed(1)}KB${mobileNote}`);
  }
}

async function main() {
  await mkdir(ROOT, { recursive: true });
  const list = slugArg ? SOFTWARE_SEED_PRODUCTS.filter((p) => p.slug === slugArg) : SOFTWARE_SEED_PRODUCTS;
  if (!list.length) {
    console.error(slugArg ? `No product matched --slug=${slugArg}` : 'No products');
    process.exit(1);
  }
  const mode = screensOnly ? 'screens-only' : coversOnly ? 'covers-only' : 'manifest+covers+screens';
  console.log(`Generating v${ASSET_VERSION} assets for ${list.length} products → ${ROOT} (${mode})`);
  if (force) console.log('Force: regenerating screens (covers preserved unless missing)');
  if (coversOnly) console.log('Covers-only: will NOT delete existing screens');
  if (screensOnly) console.log('Screens-only: will NOT delete existing covers');

  for (const product of list) {
    console.log(`\n${product.slug}`);
    if (force) {
      const dir = path.join(ROOT, product.slug);
      // Never wipe covers on screens-only / force — lifestyle covers must survive
      if (!coversOnly && !screensOnly && !manifestsOnly && (await exists(dir))) {
        // Full regen: wipe screens only, keep cover/
        const screensDir = path.join(dir, 'screens');
        if (await exists(screensDir)) await rm(screensDir, { recursive: true, force: true });
      } else if (coversOnly && (await exists(path.join(dir, 'cover')))) {
        // Explicit covers-only force may regenerate missing only; do not wipe lifestyle by default
        console.log('  covers-only: keeping existing cover files');
      } else if (screensOnly && (await exists(path.join(dir, 'screens')))) {
        await rm(path.join(dir, 'screens'), { recursive: true, force: true });
      }
    }
    await generateProduct(product);
  }
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
