/**
 * Encode Creative & Marketing assets.
 * Prefers AI-generated PNG screens; never keeps tiny SVG placeholders when --force.
 *
 * Usage:
 *   npx tsx scripts/generate-creative-marketing-assets.ts [--slug=...] [--force]
 *
 * Covers: seed-assets/creative-marketing/{slug}/cover.png
 * Screens: seed-assets/creative-marketing/{slug}/{assetKey}.png → AVIF + thumb
 */
import { mkdir, writeFile, access, readFile, unlink, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { CREATIVE_MARKETING_SEED_PRODUCTS } from '../src/features/creative-marketing-showcase/seed/catalog';
import type { SeedCreativeMarketingProduct } from '../src/features/creative-marketing-showcase/types';
import { marketingAssetPrompt } from './creative-marketing-image-prompts';

const ROOT = path.join(process.cwd(), 'seed-assets/creative-marketing');
const force = process.argv.includes('--force');
const slugArg = process.argv.find((a) => a.startsWith('--slug='))?.slice(7);

const CARD_WIDTH = 720;
const CARD_MAX_BYTES = 50 * 1024;
const DETAIL_WIDTH = 1200;
const PREVIEW_WIDTH = 1280;
const THUMB_WIDTH = 480;

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

/** Premium fallback mockup when AI PNG is not yet available. */
function premiumAssetSvg(product: SeedCreativeMarketingProduct, assetName: string, kind: string) {
  const isDash = kind === 'dashboard';
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="900" viewBox="0 0 1440 900">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#07111f"/>
      <stop offset="55%" stop-color="#0f2744"/>
      <stop offset="100%" stop-color="#132f52"/>
    </linearGradient>
    <linearGradient id="panel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#152a45"/>
      <stop offset="100%" stop-color="#0d1c30"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${product.theme.primary}"/>
      <stop offset="100%" stop-color="${product.theme.accent}"/>
    </linearGradient>
  </defs>
  <rect width="1440" height="900" fill="url(#bg)"/>
  <circle cx="1180" cy="120" r="220" fill="${product.theme.primary}" opacity="0.18"/>
  <circle cx="180" cy="760" r="260" fill="${product.theme.accent}" opacity="0.12"/>
  <rect x="72" y="64" width="1296" height="772" rx="28" fill="url(#panel)" stroke="#2a4566"/>
  <rect x="72" y="64" width="1296" height="78" rx="28" fill="#0b1a2e"/>
  <rect x="72" y="118" width="1296" height="24" fill="#0b1a2e"/>
  <circle cx="118" cy="103" r="8" fill="#f87171"/><circle cx="144" cy="103" r="8" fill="#fbbf24"/><circle cx="170" cy="103" r="8" fill="#34d399"/>
  <text x="210" y="110" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="22" font-weight="700" fill="#e2e8f0">${esc(product.title)}</text>
  <text x="210" y="132" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="13" fill="#94a3b8">${esc(assetName)} · Premium preview</text>
  ${
    isDash
      ? [0, 1, 2, 3]
          .map((i) => {
            const x = 108 + (i % 4) * 310;
            const y = 180;
            return `<rect x="${x}" y="${y}" width="286" height="120" rx="18" fill="#10233b" stroke="#274060"/>
            <text x="${x + 22}" y="${y + 36}" font-size="13" fill="#94a3b8" font-family="Inter,Arial,sans-serif">KPI ${i + 1}</text>
            <text x="${x + 22}" y="${y + 72}" font-size="28" font-weight="800" fill="#f8fafc" font-family="Inter,Arial,sans-serif">${[48, 92, 31, 17][i]}%</text>
            <rect x="${x + 22}" y="${y + 92}" width="180" height="8" rx="4" fill="url(#accent)" opacity="0.85"/>`;
          })
          .join('') +
        `<rect x="108" y="330" width="1220" height="430" rx="22" fill="#10233b" stroke="#274060"/>
         <text x="140" y="372" font-size="18" font-weight="700" fill="#e2e8f0" font-family="Inter,Arial,sans-serif">${esc(assetName)}</text>
         ${[0, 1, 2, 3, 4, 5, 6, 7]
           .map((i) => {
             const h = 80 + ((i * 37) % 160);
             const x = 160 + i * 140;
             return `<rect x="${x}" y="${700 - h}" width="72" height="${h}" rx="10" fill="${product.theme.primary}" opacity="${0.45 + (i % 3) * 0.15}"/>`;
           })
           .join('')}`
      : `<rect x="140" y="180" width="520" height="560" rx="24" fill="#10233b" stroke="#274060"/>
         <rect x="170" y="210" width="460" height="320" rx="18" fill="url(#accent)" opacity="0.35"/>
         <text x="400" y="380" text-anchor="middle" font-size="26" font-weight="800" fill="#f8fafc" font-family="Inter,Arial,sans-serif">${esc(assetName)}</text>
         <text x="400" y="416" text-anchor="middle" font-size="14" fill="#cbd5e1" font-family="Inter,Arial,sans-serif">${esc(product.outcomeLine)}</text>
         <rect x="700" y="180" width="560" height="260" rx="22" fill="#10233b" stroke="#274060"/>
         <rect x="700" y="470" width="560" height="270" rx="22" fill="#10233b" stroke="#274060"/>
         <text x="732" y="230" font-size="16" font-weight="700" fill="#e2e8f0" font-family="Inter,Arial,sans-serif">Brand board</text>
         <text x="732" y="520" font-size="16" font-weight="700" fill="#e2e8f0" font-family="Inter,Arial,sans-serif">Deliverable set</text>
         <rect x="732" y="250" width="200" height="140" rx="14" fill="${product.theme.primary}" opacity="0.55"/>
         <rect x="960" y="250" width="250" height="140" rx="14" fill="${product.theme.accent}" opacity="0.45"/>
         <rect x="732" y="540" width="496" height="150" rx="14" fill="#1a3352"/>`
  }
</svg>`;
}

async function svgToAvif(svg: string, outPath: string, width: number, quality: number) {
  const buf = await sharp(Buffer.from(svg))
    .resize({ width, withoutEnlargement: true })
    .avif({ quality, effort: 5 })
    .toBuffer();
  await writeFile(outPath, buf);
  return buf.length;
}

async function removeStaleGalleryAvifs(dir: string, keepKeys: Set<string>) {
  const files = await readdir(dir);
  for (const file of files) {
    if (!file.endsWith('.avif')) continue;
    if (file.startsWith('cover-')) continue;
    const key = file.replace(/-thumb\.avif$/, '').replace(/\.avif$/, '');
    if (!keepKeys.has(key)) {
      await unlink(path.join(dir, file));
      console.log(`  removed stale ${file}`);
    }
  }
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

  const keepKeys = new Set(product.assets.map((a) => a.key));
  if (force) await removeStaleGalleryAvifs(dir, keepKeys);

  // Prompt manifest for AI generation workflow
  const prompts = product.assets.map((asset) => ({
    key: asset.key,
    name: asset.name,
    kind: asset.kind,
    prompt: marketingAssetPrompt(product, asset),
    png: `${asset.key}.png`,
  }));
  await writeFile(path.join(dir, 'ai-prompts.json'), JSON.stringify({ slug: product.slug, prompts }, null, 2));

  for (const asset of product.assets) {
    const png = path.join(dir, `${asset.key}.png`);
    const preview = path.join(dir, `${asset.key}.avif`);
    const thumb = path.join(dir, `${asset.key}-thumb.avif`);

    if (!force && (await exists(preview)) && (await exists(thumb))) {
      console.log(`  skip ${asset.key} (exists)`);
      continue;
    }

    if (await exists(png)) {
      const p = await encodeAvifFromFile(png, preview, PREVIEW_WIDTH, 58);
      const t = await encodeAvifFromFile(png, thumb, THUMB_WIDTH, 48);
      console.log(`  ${asset.key} from PNG ${(p.bytes / 1024).toFixed(1)}KB / ${(t.bytes / 1024).toFixed(1)}KB`);
      continue;
    }

    // Premium SVG fallback until AI PNGs are dropped in
    const svg = premiumAssetSvg(product, asset.name, asset.kind);
    const p = await svgToAvif(svg, preview, PREVIEW_WIDTH, 52);
    const t = await svgToAvif(svg, thumb, THUMB_WIDTH, 45);
    console.log(`  ${asset.key} premium-svg ${(p / 1024).toFixed(1)}KB / ${(t / 1024).toFixed(1)}KB`);
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
  console.log('\nDone. Drop AI PNGs as {assetKey}.png then re-run with --force to replace SVG fallbacks.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
