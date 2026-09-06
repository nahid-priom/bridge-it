/**
 * Software showcase asset generator.
 *
 * Production visual path is AI-premium via scripts/ai-software-showcase/.
 * This script retains an emergency/dev SVG path only.
 *
 * Usage:
 *   npx tsx scripts/generate-software-showcases.ts [--slug=…] [--force]
 *     [--screens-only] [--covers-only] [--manifests-only]
 *     [--no-svg-covers] [--ai-primary] [--allow-svg-emergency]
 *
 * Default (AI-primary era): do NOT write new SVG covers; skip SVG screens
 * unless --allow-svg-emergency is set. Existing lifestyle/AI assets are kept.
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
const ASSET_VERSION = 6;
const force = process.argv.includes('--force');
const screensOnly = process.argv.includes('--screens-only');
const coversOnly = process.argv.includes('--covers-only');
const manifestsOnly = process.argv.includes('--manifests-only');
/** Prefer AI pipeline; SVG covers/screens only with --allow-svg-emergency */
const aiPrimary =
  process.argv.includes('--ai-primary') ||
  process.argv.includes('--no-svg-covers') ||
  !process.argv.includes('--allow-svg-emergency');
const allowSvgEmergency = process.argv.includes('--allow-svg-emergency');
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

  // Covers: preserve existing; SVG only as explicit emergency
  {
    const cardPath = path.join(coverDir, 'card.avif');
    const detailPath = path.join(coverDir, 'detail.avif');
    const missingCover = !(await exists(cardPath)) || !(await exists(detailPath));
    if (missingCover) {
      if (allowSvgEmergency || !aiPrimary) {
        const svg = coverSvg(product);
        if (!(await exists(cardPath))) {
          const card = await svgToAvif(svg, cardPath, CARD_W, 58, 80 * 1024);
          console.log(`  cover card ${(card / 1024).toFixed(1)}KB (svg emergency)`);
        }
        if (!(await exists(detailPath))) {
          const detail = await svgToAvif(svg, detailPath, DETAIL_W, 65);
          console.log(`  cover detail ${(detail / 1024).toFixed(1)}KB (svg emergency)`);
        }
      } else {
        console.log('  cover missing — use ai-software-showcase GenerateImage + ingest (SVG blocked)');
      }
    } else if (!screensOnly) {
      console.log('  covers preserved (lifestyle / AI / existing)');
    }
  }

  if (coversOnly) return;

  if (aiPrimary && !allowSvgEmergency) {
    console.log('  screens: SVG generation skipped (AI-primary). Use --allow-svg-emergency for emergency fill.');
    return;
  }

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
    console.log(`  ${screen.key} preview ${(p / 1024).toFixed(1)}KB thumb ${(th / 1024).toFixed(1)}KB${mobileNote} (svg emergency)`);
  }
}

async function main() {
  await mkdir(ROOT, { recursive: true });
  const list = slugArg ? SOFTWARE_SEED_PRODUCTS.filter((p) => p.slug === slugArg) : SOFTWARE_SEED_PRODUCTS;
  if (!list.length) {
    console.error(slugArg ? `No product matched --slug=${slugArg}` : 'No products');
    process.exit(1);
  }
  const mode = screensOnly
    ? 'screens-only'
    : coversOnly
      ? 'covers-only'
      : allowSvgEmergency
        ? 'manifest+covers+screens (svg emergency)'
        : 'manifest+covers (AI-primary; no new SVG screens)';
  console.log(`Generating v${ASSET_VERSION} assets for ${list.length} products → ${ROOT} (${mode})`);
  if (aiPrimary && !allowSvgEmergency) {
    console.log('AI-primary: SVG cover/screen generation disabled. Use scripts/ai-software-showcase/ or --allow-svg-emergency.');
  }
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
