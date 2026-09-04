/**
 * Phase 0 audit — maps every Software showcase asset source before rebuild.
 * Output: scripts/software-assets-before-rebuild.json
 *
 * Does NOT delete anything. Does NOT touch ecommerce / creative-marketing.
 */
import { access, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { SOFTWARE_SEED_PRODUCTS } from '../src/features/software-showcase/seed/catalog';
import { SOFTWARE_BUCKET } from '../src/features/software-showcase/config/constants';

config({ path: '.env.local' });
config({ path: '.env' });

const OUT = path.join(process.cwd(), 'scripts/software-assets-before-rebuild.json');
const LEGACY_LOCAL = path.join(process.cwd(), 'seed-assets/admin-systems');
const CANONICAL_LOCAL = path.join(process.cwd(), 'seed-assets/software');

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function listFiles(dir: string, prefix = ''): Promise<string[]> {
  if (!(await exists(dir))) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  const out: string[] = [];
  for (const e of entries) {
    const rel = prefix ? `${prefix}/${e.name}` : e.name;
    if (e.isDirectory()) {
      if (e.name === '_qa' || e.name.startsWith('.')) continue;
      out.push(...(await listFiles(path.join(dir, e.name), rel)));
    } else {
      out.push(rel);
    }
  }
  return out;
}

type ProductAudit = {
  productId: string | null;
  slug: string;
  title: string;
  published: boolean | null;
  currentCover: { cardUrl: string | null; detailUrl: string | null; cardPath: string | null; detailPath: string | null };
  currentScreens: Array<{
    key: string;
    name: string;
    imageUrl: string | null;
    imagePath: string | null;
    thumbnailUrl: string | null;
    thumbnailPath: string | null;
  }>;
  localPaths: { legacyDir: string; canonicalDir: string; legacyFiles: string[]; canonicalFiles: string[] };
  storagePaths: string[];
  dbReferences: string[];
  legacyReferences: string[];
  orphanedHint: string[];
  assetVersion: number | null;
};

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const supabase =
    url && serviceKey
      ? createClient(url, serviceKey, { auth: { persistSession: false } })
      : null;

  const products: ProductAudit[] = [];
  const dbBySlug = new Map<
    string,
    {
      id: string;
      published: boolean;
      cover_card_url: string | null;
      cover_detail_url: string | null;
      cover_card_path: string | null;
      cover_detail_path: string | null;
      asset_version?: number | null;
      screens: Array<Record<string, unknown>>;
    }
  >();

  if (supabase) {
    const { data: rows, error } = await supabase
      .from('software_projects')
      .select(
        'id, slug, title, published, cover_card_url, cover_detail_url, cover_card_path, cover_detail_path, asset_version'
      )
      .is('deleted_at', null);
    if (error) {
      console.warn('DB projects query failed (asset_version may be missing):', error.message);
      const { data: fallback } = await supabase
        .from('software_projects')
        .select(
          'id, slug, title, published, cover_card_url, cover_detail_url, cover_card_path, cover_detail_path'
        )
        .is('deleted_at', null);
      for (const row of fallback ?? []) {
        const { data: screens } = await supabase
          .from('software_project_screens')
          .select(
            'screen_key, screen_name, image_url, image_path, thumbnail_url, thumbnail_path'
          )
          .eq('project_id', row.id)
          .is('deleted_at', null);
        dbBySlug.set(row.slug, { ...row, asset_version: null, screens: screens ?? [] });
      }
    } else {
      for (const row of rows ?? []) {
        const { data: screens } = await supabase
          .from('software_project_screens')
          .select(
            'screen_key, screen_name, image_url, image_path, thumbnail_url, thumbnail_path'
          )
          .eq('project_id', row.id)
          .is('deleted_at', null);
        dbBySlug.set(row.slug, { ...row, screens: screens ?? [] });
      }
    }
  }

  const allSlugs = new Set([
    ...SOFTWARE_SEED_PRODUCTS.map((p) => p.slug),
    ...dbBySlug.keys(),
  ]);

  for (const slug of [...allSlugs].sort()) {
    const seed = SOFTWARE_SEED_PRODUCTS.find((p) => p.slug === slug);
    const db = dbBySlug.get(slug);
    const legacyDir = path.join(LEGACY_LOCAL, slug);
    const canonicalDir = path.join(CANONICAL_LOCAL, slug);
    const legacyFiles = await listFiles(legacyDir);
    const canonicalFiles = await listFiles(canonicalDir);

    const storagePaths = new Set<string>();
    const dbReferences: string[] = [];
    const legacyReferences: string[] = [];

    const pushRef = (v: string | null | undefined) => {
      if (!v) return;
      dbReferences.push(v);
      if (v.includes('/projects/') || v.includes('admin-systems') || v.includes('/showroom/')) {
        legacyReferences.push(v);
      }
      const m = v.match(/admin-showcase\/(.+)$/);
      if (m) storagePaths.add(m[1]);
      if (!v.startsWith('http') && v.includes('/')) storagePaths.add(v);
    };

    pushRef(db?.cover_card_url);
    pushRef(db?.cover_detail_url);
    pushRef(db?.cover_card_path);
    pushRef(db?.cover_detail_path);
    for (const s of db?.screens ?? []) {
      pushRef(s.image_url as string | null);
      pushRef(s.image_path as string | null);
      pushRef(s.thumbnail_url as string | null);
      pushRef(s.thumbnail_path as string | null);
    }

    const orphanedHint: string[] = [];
    if (legacyFiles.length && !canonicalFiles.length) {
      orphanedHint.push('legacy-local-only-no-canonical-tree');
    }
    if (legacyFiles.some((f) => f.endsWith('.avif') && !f.includes('/')) && legacyFiles.some((f) => f === 'cover.png')) {
      orphanedHint.push('flat-legacy-layout-cover-png-plus-screens');
    }
    if (dbReferences.some((r) => r.includes('/projects/'))) {
      orphanedHint.push('uuid-based-storage-paths');
    }
    if (!db && seed) orphanedHint.push('seed-product-missing-from-db');
    if (db && !seed) orphanedHint.push('db-product-not-in-seed-catalog');

    products.push({
      productId: db?.id ?? null,
      slug,
      title: seed?.title ?? (db as { title?: string } | undefined)?.title ?? slug,
      published: db?.published ?? null,
      currentCover: {
        cardUrl: db?.cover_card_url ?? null,
        detailUrl: db?.cover_detail_url ?? null,
        cardPath: db?.cover_card_path ?? null,
        detailPath: db?.cover_detail_path ?? null,
      },
      currentScreens: (db?.screens ?? []).map((s) => ({
        key: String(s.screen_key),
        name: String(s.screen_name),
        imageUrl: (s.image_url as string | null) ?? null,
        imagePath: (s.image_path as string | null) ?? null,
        thumbnailUrl: (s.thumbnail_url as string | null) ?? null,
        thumbnailPath: (s.thumbnail_path as string | null) ?? null,
      })),
      localPaths: {
        legacyDir: `seed-assets/admin-systems/${slug}`,
        canonicalDir: `seed-assets/software/${slug}`,
        legacyFiles,
        canonicalFiles,
      },
      storagePaths: [...storagePaths],
      dbReferences,
      legacyReferences,
      orphanedHint,
      assetVersion: db?.asset_version ?? null,
    });
  }

  // Hardcoded / public legacy software paths (do not delete ecommerce)
  const hardcodedLegacy = {
    publicShowroomSvgs: [
      'public/showroom/covers/software-basic-stock-management.svg',
      'public/showroom/covers/software-business-management-software.svg',
      'public/showroom/covers/software-advanced-business-erp.svg',
      'public/showroom/covers/software-manufacturing-production-erp.svg',
      'public/showroom/covers/software-enterprise-business-automation.svg',
    ],
    note: 'BITP /solutions/software flagships — separate from 50-product showcase; do not delete unless migrating that surface.',
    doNotTouch: [
      'seed-assets/ecommerce/',
      'seed-assets/creative-marketing/',
      'scripts/seed-assets/ecommerce-showcase/',
      'scripts/seed-assets/brand/',
      'ecommerce-showcase bucket',
      'creative-marketing-showcase bucket',
      'solution-covers bucket (legacy BITP)',
    ],
  };

  let storageListing: { prefix: string; count: number | null; sample: string[]; error?: string }[] = [];
  if (supabase) {
    for (const prefix of ['projects', 'software-showcase']) {
      try {
        const { data, error } = await supabase.storage.from(SOFTWARE_BUCKET).list(prefix, { limit: 100 });
        if (error) {
          storageListing.push({ prefix, count: null, sample: [], error: error.message });
        } else {
          storageListing.push({
            prefix,
            count: data?.length ?? 0,
            sample: (data ?? []).slice(0, 20).map((d) => `${prefix}/${d.name}`),
          });
        }
      } catch (e) {
        storageListing.push({
          prefix,
          count: null,
          sample: [],
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }
  }

  const report = {
    audited_at: new Date().toISOString(),
    phase: 0,
    bucket: SOFTWARE_BUCKET,
    seed_catalog_count: SOFTWARE_SEED_PRODUCTS.length,
    db_product_count: dbBySlug.size,
    products_audited: products.length,
    summary: {
      with_legacy_local: products.filter((p) => p.localPaths.legacyFiles.length > 0).length,
      with_canonical_local: products.filter((p) => p.localPaths.canonicalFiles.length > 0).length,
      with_db_row: products.filter((p) => p.productId).length,
      with_uuid_storage: products.filter((p) =>
        p.storagePaths.some((s) => s.startsWith('projects/'))
      ).length,
      published: products.filter((p) => p.published === true).length,
      missing_cover_in_db: products.filter(
        (p) => p.productId && !p.currentCover.cardUrl && !p.currentCover.detailUrl
      ).length,
      screens_under_10: products.filter((p) => p.currentScreens.length > 0 && p.currentScreens.length < 10)
        .length,
    },
    architecture_today: {
      tables: ['software_projects', 'software_project_screens'],
      local_legacy: 'seed-assets/admin-systems/{slug}/ (flat: cover-*.avif, {key}.avif)',
      local_canonical_target: 'seed-assets/software/{slug}/cover|screens/',
      storage_legacy: 'admin-showcase/projects/{uuid}/…',
      storage_canonical_target: 'admin-showcase/software-showcase/{slug}/v{n}/…',
      known_quality_gap:
        'Premium cover.png vs ~10KB SVG screen mockups — cover and Live Preview design systems diverge',
    },
    hardcodedLegacy,
    storageListing,
    products,
  };

  await writeFile(OUT, JSON.stringify(report, null, 2));
  console.log(`Wrote ${OUT}`);
  console.log(JSON.stringify(report.summary, null, 2));
  console.log(`Products: ${products.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
