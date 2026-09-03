/**
 * Extracts light/dark Bridge IT Park logos from the theme sheet
 * and writes transparent PNG assets used by BridgeLogo.
 *
 * Run: npx tsx scripts/process-brand-logos.ts
 */
import { execSync } from 'child_process';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

const ROOT = process.cwd();
const SHEET = join(ROOT, 'scripts/seed-assets/brand/logo-themes.png');
const BRAND = join(ROOT, 'public/brand');
const ICONS = join(ROOT, 'public/icons');

const DARK_CROP = { left: 18, top: 30, width: 376, height: 110 };
const LIGHT_CROP = { left: 16, top: 338, width: 380, height: 114 };

function keyPixel(r: number, g: number, b: number, mode: 'black' | 'white') {
  const maxc = Math.max(r, g, b);
  const minc = Math.min(r, g, b);
  const chroma = maxc - minc;
  const isBrand = chroma >= 12 || b - r >= 8;

  let outR = r;
  let outG = g;
  let outB = b;
  let a = 255;

  if (isBrand) {
    a = 255;
  } else if (mode === 'black') {
    outR = 255;
    outG = 255;
    outB = 255;
    a = maxc;
  } else {
    a = 255 - minc;
  }

  if (a < 22) a = 0;
  else if (a > 232) a = 255;

  return { r: outR, g: outG, b: outB, a };
}

async function extractKeyed(crop: sharp.Region, mode: 'black' | 'white') {
  const { data, info } = await sharp(SHEET).extract(crop).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });

  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    const p = i * info.channels;
    const { r, g, b, a } = keyPixel(data[p], data[p + 1], data[p + 2], mode);
    const o = i * 4;
    out[o] = r;
    out[o + 1] = g;
    out[o + 2] = b;
    out[o + 3] = a;
  }

  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 10 })
    .extend({
      top: 4,
      bottom: 4,
      left: 4,
      right: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png();
}

async function cropMark(input: Buffer) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });
  const { width, height } = info;

  const colCounts = new Array(width).fill(0);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 24) colCounts[x]++;
    }
  }

  let start = colCounts.findIndex((c) => c > 4);
  if (start < 0) start = 0;
  let gap = -1;
  let run = 0;
  for (let x = start + 8; x < width; x++) {
    if (colCounts[x] < 3) {
      run++;
      if (run >= 6) {
        gap = x - run + 1;
        break;
      }
    } else {
      run = 0;
    }
  }
  const end = gap > 0 ? gap : Math.min(width, start + Math.round(height * 1.05));

  let top = 0;
  let bottom = height - 1;
  for (let y = 0; y < height; y++) {
    let hit = false;
    for (let x = start; x < end; x++) {
      if (data[(y * width + x) * 4 + 3] > 24) {
        hit = true;
        break;
      }
    }
    if (hit) {
      top = y;
      break;
    }
  }
  for (let y = height - 1; y >= 0; y--) {
    let hit = false;
    for (let x = start; x < end; x++) {
      if (data[(y * width + x) * 4 + 3] > 24) {
        hit = true;
        break;
      }
    }
    if (hit) {
      bottom = y;
      break;
    }
  }

  const pad = 6;
  const left = Math.max(0, start - pad);
  const extractTop = Math.max(0, top - pad);
  const extractWidth = Math.min(width - left, end - start + pad * 2);
  const extractHeight = Math.min(height - extractTop, bottom - top + 1 + pad * 2);
  const side = Math.max(extractWidth, extractHeight);
  const extraX = Math.max(0, Math.floor((side - extractWidth) / 2));
  const extraY = Math.max(0, Math.floor((side - extractHeight) / 2));

  return sharp(input)
    .extract({
      left,
      top: extractTop,
      width: extractWidth,
      height: extractHeight,
    })
    .extend({
      top: extraY,
      bottom: side - extractHeight - extraY,
      left: extraX,
      right: side - extractWidth - extraX,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

async function writePng(path: string, image: sharp.Sharp | Buffer) {
  const buf = Buffer.isBuffer(image) ? image : await image.png().toBuffer();
  writeFileSync(path, buf);
  const meta = await sharp(buf).metadata();
  console.log('Wrote', path.replace(ROOT + '/', ''), `${meta.width}x${meta.height}`);
  return buf;
}

async function writeSquareIcon(
  mark: Buffer,
  size: number,
  path: string,
  background?: { r: number; g: number; b: number; alpha: number }
) {
  const inner = await sharp(mark)
    .resize(Math.round(size * 0.78), Math.round(size * 0.78), {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const padded = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: background ?? { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: inner, gravity: 'centre' }])
    .png()
    .toBuffer();
  writeFileSync(path, padded);
  console.log('Wrote', path.replace(ROOT + '/', ''));
}

async function main() {
  mkdirSync(BRAND, { recursive: true });
  mkdirSync(ICONS, { recursive: true });

  const lightRaw = await (await extractKeyed(LIGHT_CROP, 'white')).png().toBuffer();
  const darkRaw = await (await extractKeyed(DARK_CROP, 'black')).png().toBuffer();

  const lightMeta = await sharp(lightRaw).metadata();
  const darkMeta = await sharp(darkRaw).metadata();
  const wordmarkWidth = Math.max(lightMeta.width ?? 0, darkMeta.width ?? 0);
  const wordmarkHeight = Math.max(lightMeta.height ?? 0, darkMeta.height ?? 0);

  const contain = (input: Buffer) =>
    sharp(input)
      .resize({
        width: wordmarkWidth,
        height: wordmarkHeight,
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

  const light = await contain(lightRaw);
  const dark = await contain(darkRaw);
  const markLight = await cropMark(lightRaw);
  const markDark = await cropMark(darkRaw);

  await writePng(join(BRAND, 'bridge-it-park-logo-light.png'), light);
  await writePng(join(BRAND, 'bridge-it-park-logo-dark.png'), dark);
  await writePng(join(BRAND, 'bridge-it-park-logo-source.png'), light);
  await writePng(join(BRAND, 'bridge-it-park-logo-full.png'), light);
  await writePng(join(BRAND, 'bridge-it-park-logo-mark.png'), markLight);
  await writePng(join(ICONS, 'bridge-it-park-mark-transparent.png'), markLight);
  await writePng(join(ICONS, 'bridge-it-park-mark-dark.png'), markDark);

  const navy = { r: 15, g: 39, b: 68, alpha: 255 };
  await writeSquareIcon(markLight, 16, join(ICONS, 'favicon-16x16.png'));
  await writeSquareIcon(markLight, 32, join(ICONS, 'favicon-32x32.png'));
  await writeSquareIcon(markLight, 48, join(ICONS, 'favicon-48x48.png'));
  await writeSquareIcon(markDark, 180, join(ICONS, 'favicon-180x180.png'), navy);
  await writeSquareIcon(markDark, 192, join(ICONS, 'icon-192x192.png'), navy);
  await writeSquareIcon(markDark, 192, join(ICONS, 'favicon-192x192.png'), navy);
  await writeSquareIcon(markDark, 512, join(ICONS, 'icon-512x512.png'), navy);
  await writeSquareIcon(markDark, 180, join(ROOT, 'public/apple-touch-icon.png'), navy);

  try {
    const ico = join(ROOT, 'public/favicon.ico');
    execSync(
      `convert ${join(ICONS, 'favicon-16x16.png')} ${join(ICONS, 'favicon-32x32.png')} ${join(ICONS, 'favicon-48x48.png')} ${ico}`,
      { stdio: 'inherit' }
    );
    console.log('Wrote public/favicon.ico');
  } catch {
    console.warn('Skipping favicon.ico (ImageMagick convert unavailable)');
  }

  console.log('Brand logos processed.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
