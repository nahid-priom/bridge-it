/**
 * Validate local AI / seed assets for phase-1 registry products.
 *   npx tsx scripts/ai-software-showcase/validation/product-completeness.ts
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { ALL_PHASE1_HERO_PRODUCTS } from '../config/hero-registry';
import {
  MIN_AI_COVER_BYTES,
  MIN_AI_SCREEN_BYTES,
  SEED_ROOT,
  assertMinBytes,
  fileExists,
} from '../processing/normalize-image';

async function main() {
  const rows = [];
  for (const product of ALL_PHASE1_HERO_PRODUCTS) {
    const coverPath = path.join(SEED_ROOT, product.slug, 'cover', 'card.avif');
    const coverOk =
      (await fileExists(coverPath)) &&
      (await assertMinBytes(coverPath, MIN_AI_COVER_BYTES, `${product.slug}/cover`));
    const screenStatus: Record<string, boolean> = {};
    let aiScreens = 0;
    for (const hero of product.heroes) {
      const preview = path.join(SEED_ROOT, product.slug, 'screens', hero.key, 'preview.avif');
      const ok =
        (await fileExists(preview)) &&
        (await assertMinBytes(preview, MIN_AI_SCREEN_BYTES, `${product.slug}/${hero.key}`));
      screenStatus[hero.key] = ok;
      if (ok) aiScreens += 1;
    }
    rows.push({
      slug: product.slug,
      needsCoverUpgrade: !!product.needsCoverUpgrade,
      needsGallery: !!product.needsGallery,
      coverAi: coverOk,
      aiScreens,
      heroCount: product.heroes.length,
      screenStatus,
      ready: coverOk && aiScreens >= Math.min(5, product.heroes.length),
    });
  }

  const outDir = path.join(process.cwd(), 'tmp');
  await mkdir(outDir, { recursive: true });
  const out = path.join(outDir, 'ai-showcase-completeness.json');
  await writeFile(
    out,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        ready: rows.filter((r) => r.ready).length,
        pending: rows.filter((r) => !r.ready).length,
        products: rows,
      },
      null,
      2
    )
  );
  console.log(`Ready ${rows.filter((r) => r.ready).length}/${rows.length} → ${out}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
