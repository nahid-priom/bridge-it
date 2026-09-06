/**
 * AI Software Showcase CLI — prints prompts / plans generation batches.
 *
 * Actual image pixels come from Cursor GenerateImage (or external AI).
 * This CLI is the SSOT planner + prompt emitter + dry-run validator.
 *
 *   npx tsx scripts/ai-software-showcase/generation/generate-all.ts --missing-only --dry-run
 *   npx tsx scripts/ai-software-showcase/generation/generate-all.ts --slug=hotel-management --covers-only
 *   npx tsx scripts/ai-software-showcase/generation/generate-all.ts --validate-only
 *   npx tsx scripts/ai-software-showcase/generation/generate-all.ts --priority-screens --industry=garments
 */
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import {
  ALL_PHASE1_HERO_PRODUCTS,
  coverPngName,
  filterHeroProducts,
  screenPngName,
} from '../config/hero-registry';
import { buildCoverPrompt, buildScreenPrompt } from '../prompts/prompt-builder';
import { industryPromptBlock } from '../config/industries';
import {
  MIN_AI_COVER_BYTES,
  MIN_AI_SCREEN_BYTES,
  SEED_ROOT,
  assertMinBytes,
  fileExists,
} from '../processing/normalize-image';

const slugArg = process.argv.find((a) => a.startsWith('--slug='))?.slice('--slug='.length);
const industryArg = process.argv.find((a) => a.startsWith('--industry='))?.slice('--industry='.length);
const coversOnly = process.argv.includes('--covers-only');
const screensOnly = process.argv.includes('--screens-only');
const priorityScreens = process.argv.includes('--priority-screens');
const missingOnly = process.argv.includes('--missing-only');
const force = process.argv.includes('--force');
const dryRun = process.argv.includes('--dry-run');
const validateOnly = process.argv.includes('--validate-only');
const emitPrompts = process.argv.includes('--emit-prompts') || dryRun;

async function main() {
  const products = filterHeroProducts({
    slug: slugArg,
    industry: industryArg,
    missingOnly,
  });

  if (products.length === 0) {
    console.error('No products matched');
    process.exit(1);
  }

  const plan: Array<{
    slug: string;
    actions: Array<{ kind: 'cover' | 'screen'; key?: string; png: string; status: string; prompt?: string }>;
  }> = [];

  let needCover = 0;
  let needScreen = 0;
  let approved = 0;

  for (const product of products) {
    const actions: (typeof plan)[0]['actions'] = [];
    const coverPath = path.join(SEED_ROOT, product.slug, 'cover', 'card.avif');
    const coverOk =
      (await fileExists(coverPath)) &&
      (await assertMinBytes(coverPath, MIN_AI_COVER_BYTES, `${product.slug}/cover`));

    if (!screensOnly) {
      if (!coverOk || force || product.needsCoverUpgrade) {
        const prompt = `${buildCoverPrompt(product)} ${industryPromptBlock(product.industry)}`;
        actions.push({
          kind: 'cover',
          png: coverPngName(product.slug),
          status: coverOk && !force ? 'upgrade-recommended' : 'generate',
          prompt: emitPrompts ? prompt : undefined,
        });
        needCover += 1;
      } else {
        approved += 1;
        actions.push({ kind: 'cover', png: coverPngName(product.slug), status: 'approved-keep' });
      }
    }

    if (!coversOnly) {
      const heroes = priorityScreens ? product.heroes.slice(0, 5) : product.heroes;
      for (const hero of heroes) {
        const preview = path.join(SEED_ROOT, product.slug, 'screens', hero.key, 'preview.avif');
        const ok =
          (await fileExists(preview)) &&
          (await assertMinBytes(preview, MIN_AI_SCREEN_BYTES, `${product.slug}/${hero.key}`));
        if (!ok || force) {
          const prompt = `${buildScreenPrompt(product, hero)} ${industryPromptBlock(product.industry)}`;
          actions.push({
            kind: 'screen',
            key: hero.key,
            png: screenPngName(product.slug, hero.key),
            status: 'generate',
            prompt: emitPrompts ? prompt : undefined,
          });
          needScreen += 1;
        } else {
          approved += 1;
          actions.push({
            kind: 'screen',
            key: hero.key,
            png: screenPngName(product.slug, hero.key),
            status: 'approved-keep',
          });
        }
      }
    }

    plan.push({ slug: product.slug, actions });
  }

  if (validateOnly) {
    console.log(JSON.stringify({ products: products.length, needCover, needScreen, approved }, null, 2));
    for (const row of plan) {
      const pending = row.actions.filter((a) => a.status === 'generate' || a.status === 'upgrade-recommended');
      if (pending.length) console.log(`${row.slug}: ${pending.length} pending`);
    }
    process.exit(needCover + needScreen > 0 ? 2 : 0);
  }

  const outDir = path.join(process.cwd(), 'tmp');
  await mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, 'ai-showcase-generation-plan.json');
  await writeFile(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), needCover, needScreen, approved, plan }, null, 2));

  console.log(`Phase-1 products: ${products.length}`);
  console.log(`Need covers: ${needCover} | Need screens: ${needScreen} | Approved keep: ${approved}`);
  console.log(`Plan written: ${outPath}`);
  console.log('\nNext: GenerateImage each pending PNG filename, then:');
  console.log('  npx tsx scripts/ai-software-showcase/generation/ingest-ai-assets.ts --missing-only');
  console.log('  npm run upload:software-assets -- --force --slug=<slug>');

  if (emitPrompts) {
    for (const row of plan) {
      for (const a of row.actions) {
        if (a.status === 'generate' || a.status === 'upgrade-recommended') {
          console.log(`\n### ${a.png}\n${a.prompt?.slice(0, 400)}…`);
        }
      }
    }
  }

  console.log(`\nRegistry size (phase1): ${ALL_PHASE1_HERO_PRODUCTS.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
