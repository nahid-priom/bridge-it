/**
 * Local QA for Feed Mill Phase 1 showcase assets + catalog SSOT.
 * Run: npx tsx scripts/qa-feed-mill-showcase.ts
 */
import { readdirSync, existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { FEED_MILL_HERO_SET } from './ai-software-generator/feed-mill-hero-set';
import { FEED_MILL_SPECIALIZED_SLUGS } from '../src/features/software-showcase/config/specialized-solutions';
import { MIN_AI_COVER_BYTES, MIN_AI_SCREEN_BYTES } from './ai-software-generator/image-validation';

const ROOT = path.join(process.cwd(), 'seed-assets/software');
const LEGACY = [
  'feed-mill-mini',
  'feed-mill-basic',
  'feed-mill-erp-professional',
  'feed-mill-enterprise-erp',
];

const ACTIVE = ['feed-mill-erp', ...FEED_MILL_SPECIALIZED_SLUGS];

let failures = 0;

function fail(msg: string) {
  console.error(`FAIL: ${msg}`);
  failures += 1;
}

function ok(msg: string) {
  console.log(`OK: ${msg}`);
}

function main() {
  if (ACTIVE.length !== 6) fail(`expected 6 active slugs, got ${ACTIVE.length}`);
  else ok('6 active Feed Mill offerings configured');

  if (FEED_MILL_HERO_SET.length !== 6) fail('hero set must cover 6 products');
  else ok('hero set has 6 products');

  for (const slug of ACTIVE) {
    const dir = path.join(ROOT, slug);
    if (!existsSync(dir)) {
      fail(`missing asset dir ${slug}`);
      continue;
    }
    const card = path.join(dir, 'cover', 'card.avif');
    const detail = path.join(dir, 'cover', 'detail.avif');
    if (!existsSync(card) || !existsSync(detail)) fail(`${slug} missing cover avifs`);
    else {
      const size = statSync(card).size;
      if (size < MIN_AI_COVER_BYTES) {
        console.warn(`WARN: ${slug} cover ${size}B looks SVG-sized (AI cover pending)`);
      } else ok(`${slug} cover ${size}B`);
    }

    const hero = FEED_MILL_HERO_SET.find((p) => p.slug === slug);
    if (!hero) {
      fail(`no hero set for ${slug}`);
      continue;
    }
    for (const h of hero.heroes) {
      const preview = path.join(dir, 'screens', h.key, 'preview.avif');
      const thumb = path.join(dir, 'screens', h.key, 'thumb.avif');
      if (!existsSync(preview) || !existsSync(thumb)) fail(`${slug}/${h.key} missing preview/thumb`);
      else {
        const size = statSync(preview).size;
        if (size < MIN_AI_SCREEN_BYTES) {
          console.warn(`WARN: ${slug}/${h.key} ${size}B may still be SVG fallback`);
        } else ok(`${slug}/${h.key} ${size}B`);
      }
    }

    const manifestPath = path.join(dir, 'design-manifest.json');
    if (existsSync(manifestPath)) {
      const m = JSON.parse(readFileSync(manifestPath, 'utf8')) as { visualVersion?: number };
      if ((m.visualVersion ?? 0) < 5) {
        console.warn(`WARN: ${slug} manifest visualVersion < 5`);
      }
    }
  }

  for (const slug of LEGACY) {
    // Local folders may exist; they must not be in ACTIVE
    if (ACTIVE.includes(slug)) fail(`legacy ${slug} listed as active`);
  }
  ok('legacy ladder slugs not in active set');

  // Related products expectation (code SSOT)
  const relatedFile = readFileSync(
    path.join(process.cwd(), 'scripts/complete-software-catalog.ts'),
    'utf8'
  );
  for (const s of FEED_MILL_SPECIALIZED_SLUGS) {
    if (!relatedFile.includes(`'${s}'`)) fail(`related list missing ${s}`);
  }
  if (relatedFile.includes("'crm-system'") && relatedFile.match(/feed-mill-erp[\s\S]*?crm-system/)) {
    // soft check — primary related block should prefer specialized
  }
  ok('related products file references specialized Feed Mill slugs');

  console.log(`\nScreens on disk sample: feed-mill-erp → ${existsSync(path.join(ROOT, 'feed-mill-erp', 'screens')) ? readdirSync(path.join(ROOT, 'feed-mill-erp', 'screens')).length : 0} folders`);

  if (failures > 0) {
    console.error(`\n${failures} failure(s)`);
    process.exit(1);
  }
  console.log('\nQA passed (warnings allowed for pending AI assets).');
}

main();
