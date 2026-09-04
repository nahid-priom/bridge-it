/**
 * Encode Creative & Marketing covers from premium cover.png → AVIF.
 * Also generates portfolio/dashboard gallery assets when missing.
 *
 * Usage: npx tsx scripts/generate-creative-marketing-assets.ts [--slug=...] [--force]
 *
 * Covers: prefers seed-assets/creative-marketing/{slug}/cover.png (Cursor-generated).
 * Never overwrites cover.png with SVG placeholders.
 */
import { mkdir, writeFile, access, readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { CREATIVE_MARKETING_SEED_PRODUCTS } from '../src/features/creative-marketing-showcase/seed/catalog';
import type { SeedCreativeMarketingProduct } from '../src/features/creative-marketing-showcase/types';

const ROOT = path.join(process.cwd(), 'seed-assets/creative-marketing');
const force = process.argv.includes('--force');
const slugArg = process.argv.find((a) => a.startsWith('--slug='))?.slice(7);

const CARD_WIDTH = 720;
const CARD_MAX_BYTES = 50 * 1024;
const DETAIL_WIDTH = 1200;

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function encodeAvifFromFile(
  inputPath: string,
  outPath: string,
  width: number,
  startQuality: number,
  maxBytes?: number
) {
  let quality = startQuality;
  let buf = await sharp(inputPath)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .avif({ quality, effort: 5 })
    .toBuffer();

  if (maxBytes) {
    while (buf.length > maxBytes && quality > 28) {
      quality -= 4;
      buf = await sharp(inputPath)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .avif({ quality, effort: 5 })
        .toBuffer();
    }
  }

  await writeFile(outPath, buf);
  return { bytes: buf.length, quality };
}

function assetSvg(product: SeedCreativeMarketingProduct, assetName: string, kind: string) {
  const isDash = kind === 'dashboard';
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="640" viewBox="0 0 1024 640">
  <rect width="1024" height="640" fill="#f1f5f9"/>
  <rect x="32" y="32" width="960" height="576" rx="18" fill="#ffffff" stroke="#e2e8f0"/>
  <rect x="32" y="32" width="960" height="64" fill="${product.theme.primary}"/>
  <text x="56" y="72" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="20" font-weight="700" fill="#ffffff">${esc(assetName)}</text>
  ${
    isDash
      ? [0, 1, 2, 3]
          .map((i) => {
            const x = 64 + (i % 2) * 450;
            const y = 130 + Math.floor(i / 2) * 200;
            const bars = [40, 70, 55, 90, 60, 80];
            return `<rect x="${x}" y="${y}" width="420" height="170" rx="14" fill="#f8fafc" stroke="#e2e8f0"/>
            <text x="${x + 20}" y="${y + 32}" font-size="14" font-weight="700" fill="#0f172a" font-family="Inter,Segoe UI,Arial,sans-serif">${esc(assetName)} panel</text>
            ${bars
              .map(
                (h, bi) =>
                  `<rect x="${x + 30 + bi * 55}" y="${y + 150 - h}" width="28" height="${h}" rx="5" fill="${product.theme.primary}" opacity="0.55"/>`
              )
              .join('')}`;
          })
          .join('')
      : `<rect x="80" y="140" width="864" height="400" rx="16" fill="#f8fafc" stroke="#e2e8f0"/>
         <rect x="120" y="180" width="780" height="220" rx="12" fill="${product.theme.primary}" opacity="0.18"/>
         <text x="512" y="300" text-anchor="middle" font-size="28" font-weight="800" fill="#0f172a" font-family="Inter,Segoe UI,Arial,sans-serif">${esc(assetName)}</text>
         <text x="512" y="340" text-anchor="middle" font-size="14" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif">${esc(product.title)} sample</text>`
  }
</svg>`;
}

async function svgToAvif(svg: string, outPath: string, width: number, quality: number) {
  const buf = await sharp(Buffer.from(svg))
    .resize({ width, withoutEnlargement: true })
    .avif({ quality, effort: 4 })
    .toBuffer();
  await writeFile(outPath, buf);
  return buf.length;
}

async function generateProduct(product: SeedCreativeMarketingProduct) {
  const dir = path.join(ROOT, product.slug);
  await mkdir(dir, { recursive: true });

  const coverPng = path.join(dir, 'cover.png');
  const coverCard = path.join(dir, 'cover-card.avif');
  const coverDetail = path.join(dir, 'cover-detail.avif');

  if (!(await exists(coverPng))) {
    throw new Error(
      `Missing premium cover.png for ${product.slug}. Add seed-assets/creative-marketing/${product.slug}/cover.png before generating.`
    );
  }

  // Never invent SVG covers when PNG exists
  if (force || !(await exists(coverCard))) {
    const result = await encodeAvifFromFile(coverPng, coverCard, CARD_WIDTH, 52, CARD_MAX_BYTES);
    console.log(
      `  cover-card ${(result.bytes / 1024).toFixed(1)}KB (q=${result.quality}${result.bytes > CARD_MAX_BYTES ? ' OVER' : ''})`
    );
  }
  if (force || !(await exists(coverDetail))) {
    const result = await encodeAvifFromFile(coverPng, coverDetail, DETAIL_WIDTH, 62);
    console.log(`  cover-detail ${(result.bytes / 1024).toFixed(1)}KB (q=${result.quality})`);
  }

  // Touch manifest presence for logging
  const manifest = path.join(dir, 'design-manifest.json');
  if (await exists(manifest)) {
    const raw = await readFile(manifest, 'utf8');
    try {
      const parsed = JSON.parse(raw) as { serviceName?: string };
      console.log(`  manifest: ${parsed.serviceName ?? product.title}`);
    } catch {
      console.warn(`  warning: invalid design-manifest.json`);
    }
  } else {
    console.warn(`  warning: missing design-manifest.json`);
  }

  for (const asset of product.assets) {
    const preview = path.join(dir, `${asset.key}.avif`);
    const thumb = path.join(dir, `${asset.key}-thumb.avif`);
    if (!force && (await exists(preview)) && (await exists(thumb))) continue;
    const svg = assetSvg(product, asset.name, asset.kind);
    const p = await svgToAvif(svg, preview, 960, 45);
    const t = await svgToAvif(svg, thumb, 480, 40);
    console.log(`  ${asset.key} ${(p / 1024).toFixed(1)}KB / ${(t / 1024).toFixed(1)}KB`);
  }
}

async function main() {
  await mkdir(ROOT, { recursive: true });
  const list = slugArg
    ? CREATIVE_MARKETING_SEED_PRODUCTS.filter((p) => p.slug === slugArg)
    : CREATIVE_MARKETING_SEED_PRODUCTS;
  if (slugArg && list.length === 0) {
    console.error(`Unknown slug: ${slugArg}`);
    process.exit(1);
  }
  console.log(`Encoding ${list.length} creative-marketing asset sets → ${ROOT}`);
  for (const product of list) {
    console.log(`\n${product.slug}`);
    await generateProduct(product);
  }
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
