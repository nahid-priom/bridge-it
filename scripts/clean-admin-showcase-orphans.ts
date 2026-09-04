import { readdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import { SOFTWARE_SEED_PRODUCTS } from '../src/features/software-showcase/seed/catalog';

const ROOT = path.join(process.cwd(), 'seed-assets/admin-systems');

async function main() {
  let removed = 0;
  for (const product of SOFTWARE_SEED_PRODUCTS) {
    const dir = path.join(ROOT, product.slug);
    const expected = new Set([
      'design-manifest.json',
      'cover.png',
      'cover-card.avif',
      'cover-detail.avif',
      ...product.screens.flatMap((s) => [`${s.key}.avif`, `${s.key}-thumb.avif`]),
    ]);
    const files = await readdir(dir);
    for (const f of files) {
      if (!expected.has(f) && (f.endsWith('.avif') || f.endsWith('.png'))) {
        await unlink(path.join(dir, f));
        removed += 1;
        console.log('removed', `${product.slug}/${f}`);
      }
    }
  }
  console.log('removed total', removed);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
