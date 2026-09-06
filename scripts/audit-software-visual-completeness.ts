/**
 * Full catalog visual completeness audit → tmp/software-visual-audit.json
 * Run: npx tsx scripts/audit-software-visual-completeness.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { SOFTWARE_SEED_PRODUCTS } from '../src/features/software-showcase/seed/catalog';

config({ path: '.env.local' });
config({ path: '.env' });

const ROOT = path.join(process.cwd(), 'seed-assets/software');
const MIN_AI_COVER = 18_000;
const SVG_MAX = 15_000;

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    console.error('Missing Supabase env');
    process.exit(1);
  }
  const sb = createClient(url, key, { auth: { persistSession: false } });

  const { data: products, error } = await sb
    .from('software_projects')
    .select('id, slug, title, published, asset_version, cover_card_url, cover_detail_url')
    .eq('published', true)
    .is('deleted_at', null)
    .order('slug');
  if (error) throw error;

  const seedSlugs = new Set(SOFTWARE_SEED_PRODUCTS.map((p) => p.slug));
  const rows = [];

  for (const p of products ?? []) {
    const dir = path.join(ROOT, p.slug);
    const card = path.join(dir, 'cover', 'card.avif');
    const coverBytes = existsSync(card) ? statSync(card).size : 0;
    const screenRoot = path.join(dir, 'screens');
    const localScreens = existsSync(screenRoot)
      ? readdirSync(screenRoot).filter((n) => existsSync(path.join(screenRoot, n, 'preview.avif')))
      : [];

    const { data: screens } = await sb
      .from('software_project_screens')
      .select('id, screen_key, image_url, thumbnail_url')
      .eq('project_id', p.id)
      .is('deleted_at', null);

    const dbScreens = screens ?? [];
    const missingUrl = dbScreens.filter((s) => !s.image_url).map((s) => s.screen_key);

    let coverClass: string = 'missing-local';
    if (coverBytes >= MIN_AI_COVER) coverClass = 'premium-ai';
    else if (coverBytes > 0 && coverBytes < SVG_MAX) coverClass = 'svg-fallback';
    else if (coverBytes > 0) coverClass = 'acceptable';
    else if (p.cover_card_url) coverClass = 'db-remote-only';

    let status: string = 'needs-work';
    if (coverClass === 'premium-ai' && localScreens.length >= 5 && missingUrl.length === 0) {
      status = 'fully-premium-local';
    } else if (coverClass === 'svg-fallback') status = 'cover-upgrade-needed';
    else if (localScreens.length === 0) status = 'screen-gallery-missing';
    else if (missingUrl.length) status = 'broken-db-image-url';

    rows.push({
      slug: p.slug,
      title: p.title,
      asset_version: p.asset_version,
      inSeedCatalog: seedSlugs.has(p.slug),
      coverClass,
      coverBytes,
      localScreens: localScreens.length,
      dbScreens: dbScreens.length,
      dbMissingImageUrl: missingUrl,
      hasCoverUrl: Boolean(p.cover_card_url),
      status,
    });
  }

  const byStatus = rows.reduce<Record<string, number>>((a, r) => {
    a[r.status] = (a[r.status] || 0) + 1;
    return a;
  }, {});
  const byCover = rows.reduce<Record<string, number>>((a, r) => {
    a[r.coverClass] = (a[r.coverClass] || 0) + 1;
    return a;
  }, {});

  const report = {
    generatedAt: new Date().toISOString(),
    publishedCount: rows.length,
    seedCatalogCount: SOFTWARE_SEED_PRODUCTS.length,
    byStatus,
    byCoverClass: byCover,
    svgFallbackActive: rows.filter((r) => r.coverClass === 'svg-fallback').map((r) => r.slug),
    missingLocalGalleries: rows.filter((r) => r.localScreens === 0).map((r) => r.slug),
    brokenDbImageUrls: rows
      .filter((r) => r.dbMissingImageUrl.length)
      .map((r) => ({ slug: r.slug, keys: r.dbMissingImageUrl })),
    publishedNotInSeed: rows.filter((r) => !r.inSeedCatalog).map((r) => r.slug),
    products: rows,
  };

  mkdirSync(path.join(process.cwd(), 'tmp'), { recursive: true });
  const out = path.join(process.cwd(), 'tmp/software-visual-audit.json');
  writeFileSync(out, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({
    publishedCount: report.publishedCount,
    byStatus: report.byStatus,
    byCoverClass: report.byCoverClass,
    svgFallbackActive: report.svgFallbackActive,
    missingLocalGalleries: report.missingLocalGalleries.length,
    brokenDbImageUrls: report.brokenDbImageUrls,
    publishedNotInSeed: report.publishedNotInSeed.length,
    wrote: out,
  }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
