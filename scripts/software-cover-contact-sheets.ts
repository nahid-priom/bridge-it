/**
 * Development-only contact sheets for Software showcase QA.
 * Writes to seed-assets/software/_qa/ — never publish.
 *
 * Usage: npx tsx scripts/software-cover-contact-sheets.ts
 */
import { mkdir, readdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { SOFTWARE_SEED_PRODUCTS } from '../src/features/software-showcase/seed/catalog';

const ROOT = path.join(process.cwd(), 'seed-assets/software');
const QA = path.join(ROOT, '_qa');

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  await mkdir(QA, { recursive: true });
  const cells: Buffer[] = [];
  const labels: string[] = [];

  for (const product of SOFTWARE_SEED_PRODUCTS) {
    const card = path.join(ROOT, product.slug, 'cover', 'card.avif');
    if (!(await exists(card))) {
      console.warn(`skip ${product.slug}: no cover`);
      continue;
    }
    const buf = await sharp(card).resize(240, 180, { fit: 'cover' }).png().toBuffer();
    cells.push(buf);
    labels.push(product.slug);
  }

  const cols = 5;
  const cellW = 240;
  const cellH = 200;
  const rows = Math.ceil(cells.length / cols);
  const composites = cells.map((input, i) => ({
    input,
    left: (i % cols) * cellW,
    top: Math.floor(i / cols) * cellH,
  }));

  // label strip via SVG overlays
  const labelSvgs = labels.map((slug, i) => {
    const x = (i % cols) * cellW;
    const y = Math.floor(i / cols) * cellH + 180;
    const svg = `<svg width="${cellW}" height="20"><rect width="100%" height="100%" fill="#0f172a"/><text x="8" y="14" font-size="11" fill="#fff" font-family="sans-serif">${slug}</text></svg>`;
    return { input: Buffer.from(svg), left: x, top: y };
  });

  const sheet = await sharp({
    create: {
      width: cols * cellW,
      height: rows * cellH,
      channels: 3,
      background: '#0f172a',
    },
  })
    .composite([...composites, ...labelSvgs])
    .png()
    .toFile(path.join(QA, 'software-cover-contact-sheet.png'));

  console.log(`Cover contact sheet → ${path.join(QA, 'software-cover-contact-sheet.png')} (${cells.length} covers)`);

  // Per-product screen sheets (sample first 12 products fully; all if small)
  for (const product of SOFTWARE_SEED_PRODUCTS) {
    const screensDir = path.join(ROOT, product.slug, 'screens');
    if (!(await exists(screensDir))) continue;
    const keys = (await readdir(screensDir)).filter((k) => !k.startsWith('.'));
    const thumbs: Buffer[] = [];
    for (const key of keys.slice(0, 12)) {
      const thumb = path.join(screensDir, key, 'thumb.avif');
      if (!(await exists(thumb))) continue;
      thumbs.push(await sharp(thumb).resize(200, 125, { fit: 'cover' }).png().toBuffer());
    }
    if (!thumbs.length) continue;
    const scols = Math.min(4, thumbs.length);
    const srows = Math.ceil(thumbs.length / scols);
    await sharp({
      create: {
        width: scols * 200,
        height: srows * 125,
        channels: 3,
        background: '#e2e8f0',
      },
    })
      .composite(
        thumbs.map((input, i) => ({
          input,
          left: (i % scols) * 200,
          top: Math.floor(i / scols) * 125,
        }))
      )
      .png()
      .toFile(path.join(QA, `${product.slug}-screens.png`));
  }
  console.log(`Screen contact sheets written under ${QA}`);
  void sheet;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
