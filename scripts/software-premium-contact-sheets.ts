/**
 * Dev-only contact sheets for Software showcase covers (and optional screens).
 * Usage:
 *   npx tsx scripts/software-premium-contact-sheets.ts
 *   npx tsx scripts/software-premium-contact-sheets.ts --screens --slugs=garments-erp,feed-mill-erp
 * Output under: seed-assets/admin-systems/_qa/ (gitignored recommended; not published)
 */
import { access, mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { SOFTWARE_SEED_PRODUCTS } from '../src/features/software-showcase/seed/catalog';

const ROOT = path.join(process.cwd(), 'seed-assets/admin-systems');
const OUT = path.join(ROOT, '_qa');
const withScreens = process.argv.includes('--screens');
const slugsArg = process.argv.find((a) => a.startsWith('--slugs='))?.slice(8);
const slugFilter = slugsArg
  ? new Set(slugsArg.split(',').map((s) => s.trim()).filter(Boolean))
  : null;

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const products = SOFTWARE_SEED_PRODUCTS.filter((p) => !slugFilter || slugFilter.has(p.slug));

  const tiles: Buffer[] = [];
  const labels: string[] = [];
  for (const product of products) {
    const cover = path.join(ROOT, product.slug, 'cover-card.avif');
    if (!(await exists(cover))) continue;
    const tile = await sharp(cover).resize(240, 150, { fit: 'cover' }).png().toBuffer();
    tiles.push(tile);
    labels.push(product.slug);
  }

  const cols = 5;
  const rows = Math.ceil(tiles.length / cols);
  const cellW = 248;
  const cellH = 178;
  const width = cols * cellW;
  const height = rows * cellH;
  const composites: sharp.OverlayOptions[] = [];
  for (let i = 0; i < tiles.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * cellW + 4;
    const y = row * cellH + 4;
    composites.push({ input: tiles[i], left: x, top: y });
    const labelSvg = Buffer.from(`<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" width="240" height="22">
  <rect width="240" height="22" fill="#0f172a"/>
  <text x="8" y="15" font-family="Arial,sans-serif" font-size="11" fill="#f8fafc">${labels[i]}</text>
</svg>`);
    composites.push({
      input: await sharp(labelSvg).png().toBuffer(),
      left: x,
      top: y + 150,
    });
  }

  const sheet = await sharp({
    create: { width, height, channels: 3, background: '#e2e8f0' },
  })
    .composite(composites)
    .png()
    .toFile(path.join(OUT, 'covers-contact-sheet.png'));

  console.log(`Wrote covers contact sheet (${tiles.length} tiles) → ${OUT}/covers-contact-sheet.png`, sheet);

  if (withScreens) {
    for (const product of products) {
      const dir = path.join(ROOT, product.slug);
      const files = (await readdir(dir)).filter(
        (f) => f.endsWith('.avif') && !f.includes('cover') && !f.includes('-thumb')
      );
      const screenTiles: Buffer[] = [];
      for (const f of files.slice(0, 12)) {
        screenTiles.push(await sharp(path.join(dir, f)).resize(200, 125, { fit: 'cover' }).png().toBuffer());
      }
      if (!screenTiles.length) continue;
      const sc = 4;
      const sr = Math.ceil(screenTiles.length / sc);
      const comps: sharp.OverlayOptions[] = screenTiles.map((t, i) => ({
        input: t,
        left: (i % sc) * 208 + 4,
        top: Math.floor(i / sc) * 133 + 4,
      }));
      await sharp({
        create: {
          width: sc * 208,
          height: sr * 133,
          channels: 3,
          background: '#e2e8f0',
        },
      })
        .composite(comps)
        .png()
        .toFile(path.join(OUT, `${product.slug}-screens.png`));
      console.log(`  screens sheet ${product.slug}`);
    }
  }

  await writeFile(
    path.join(OUT, 'README.txt'),
    'Dev-only QA contact sheets. Do not publish or seed to production.\n'
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
