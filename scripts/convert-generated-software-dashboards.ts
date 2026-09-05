/**
 * Convert Cursor-generated dashboard PNGs into seed-assets AVIF screens.
 * Missing source files are skipped (exit 0).
 * Run: npx tsx scripts/convert-generated-software-dashboards.ts
 */
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ASSETS =
  '/home/priom/.cursor/projects/home-priom-Desktop-bridge-it-park-smart-it-park/assets';
const ROOT = path.join(process.cwd(), 'seed-assets/software');

const PAIRS: Array<[string, string, string]> = [
  ['ecommerce-admin-dashboard', 'dashboard-overview', 'ecommerce-admin-dashboard-overview.png'],
  ['feed-mill-erp', 'dashboard', 'feed-mill-erp-dashboard.png'],
  ['garments-erp', 'dashboard', 'garments-erp-dashboard.png'],
];

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  let converted = 0;
  for (const [slug, key, file] of PAIRS) {
    const src = path.join(ASSETS, file);
    if (!(await exists(src))) {
      console.log(`skip ${slug}/${key} (missing ${file})`);
      continue;
    }
    const input = await readFile(src);
    const dir = path.join(ROOT, slug, 'screens', key);
    await mkdir(dir, { recursive: true });
    const preview = await sharp(input)
      .resize({ width: 1100, withoutEnlargement: true })
      .avif({ quality: 68, effort: 5 })
      .toBuffer();
    const thumb = await sharp(input)
      .resize({ width: 480, withoutEnlargement: true })
      .avif({ quality: 55, effort: 5 })
      .toBuffer();
    await writeFile(path.join(dir, 'preview.avif'), preview);
    await writeFile(path.join(dir, 'thumb.avif'), thumb);
    console.log(`${slug}/${key} preview ${(preview.length / 1024).toFixed(1)}KB`);
    converted += 1;
  }
  console.log(`Dashboard overlay done (${converted} converted).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
