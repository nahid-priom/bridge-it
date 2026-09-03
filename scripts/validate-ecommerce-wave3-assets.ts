/**
 * Validate wave-3 ecommerce seed assets before seeding.
 * Run: npx tsx scripts/validate-ecommerce-wave3-assets.ts
 */
import { createHash } from 'node:crypto';
import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { WAVE3_SEED_BRANDS } from '../src/features/ecommerce-showcase/seed/brands-wave3';

const ROOT = path.join(process.cwd(), 'seed-assets/ecommerce');
const REQUIRED = ['cover', 'homepage', 'landing', 'collection', 'product', 'cart', 'checkout', 'mobile'] as const;
const OPTIONAL = ['about'] as const;

async function exists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function resolveAsset(folder: string, base: string) {
  for (const ext of ['.png', '.webp', '.avif']) {
    const candidate = path.join(ROOT, folder, `${base}${ext}`);
    if (await exists(candidate)) return candidate;
  }
  return null;
}

async function main() {
  const failures: string[] = [];
  const coverHashes = new Map<string, string>();
  let okCount = 0;

  for (const brand of WAVE3_SEED_BRANDS) {
    const folder = brand.slug;
    const manifest = path.join(ROOT, folder, 'design-manifest.json');
    if (!(await exists(manifest))) failures.push(`${folder}: missing design-manifest.json`);

    for (const page of REQUIRED) {
      const file = await resolveAsset(folder, page);
      if (!file) failures.push(`${folder}: missing ${page}.{png|webp|avif}`);
      else if (page === 'cover') {
        const hash = createHash('sha1').update(await readFile(file)).digest('hex');
        const prior = coverHashes.get(hash);
        if (prior) failures.push(`${folder}: duplicate cover hash with ${prior}`);
        else coverHashes.set(hash, folder);
      }
    }

    for (const page of OPTIONAL) {
      await resolveAsset(folder, page);
    }

    const files = await readdir(path.join(ROOT, folder)).catch(() => []);
    if (REQUIRED.every(async () => true) && files.length >= REQUIRED.length) okCount += 1;
  }

  if (failures.length) {
    console.error('Wave-3 asset validation FAILED:\n' + failures.map((f) => `- ${f}`).join('\n'));
    process.exit(1);
  }

  console.log(`Wave-3 asset validation OK (${WAVE3_SEED_BRANDS.length} projects, ${coverHashes.size} unique covers).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
