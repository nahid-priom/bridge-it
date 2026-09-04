/**
 * Premium quality audit for Software showcase (50 projects).
 * Usage: npx tsx scripts/audit-software-premium-quality.ts
 * Writes: scripts/software-premium-audit.json
 */
import { access, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { SOFTWARE_SEED_PRODUCTS } from '../src/features/software-showcase/seed/catalog';

config({ path: '.env.local' });
config({ path: '.env' });

const ROOT = path.join(process.cwd(), 'seed-assets/admin-systems');
const OUT = path.join(process.cwd(), 'scripts/software-premium-audit.json');
const CARD_LIMIT = 50 * 1024;
const THUMB_LIMIT = 35 * 1024;
const PLACEHOLDER_COVER_MAX = 12 * 1024; // SVG mockups land ~6–8KB

const RICH_MANIFEST_KEYS = [
  'productName',
  'businessType',
  'targetUser',
  'visualPersonality',
  'themeDirection',
  'navigationStyle',
  'dashboardLayout',
  'primaryKPIs',
  'quickActions',
  'businessModules',
  'tablePatterns',
  'chartPatterns',
  'mobileStrategy',
  'coverDirection',
  'screenList',
] as const;

type Status = 'pass' | 'needs_minor_upgrade' | 'needs_major_upgrade' | 'incomplete';
type FieldStatus = 'pass' | 'fail' | 'warn' | 'missing';

type ProjectAudit = {
  slug: string;
  title: string;
  premium_status: Status;
  screen_count: number;
  cover_status: FieldStatus;
  seo_status: FieldStatus;
  admin_status: FieldStatus;
  image_budget_status: FieldStatus;
  manifest_status: FieldStatus;
  screens_status: FieldStatus;
  pricing_status: FieldStatus;
  cover_card_bytes: number | null;
  has_cover_png: boolean;
  premium_upgrade_version: number | null;
  issues: string[];
};

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

function rank(status: Status): number {
  if (status === 'incomplete') return 3;
  if (status === 'needs_major_upgrade') return 2;
  if (status === 'needs_minor_upgrade') return 1;
  return 0;
}

function worst(...statuses: Status[]): Status {
  return statuses.reduce((a, b) => (rank(b) > rank(a) ? b : a), 'pass' as Status);
}

async function sha1File(filePath: string) {
  const buf = await readFile(filePath);
  return createHash('sha1').update(buf).digest('hex');
}

function genericKpi(kpi: string) {
  return /^(revenue|users|orders|growth|customers)$/i.test(kpi.trim());
}

async function main() {
  const seoTitles = new Map<string, string>();
  const seoDescs = new Map<string, string>();
  const coverHashes = new Map<string, string>();
  const screenHashes = new Map<string, string>();
  const projects: ProjectAudit[] = [];

  // Optional Supabase presence check
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const dbBySlug = new Map<
    string,
    { published: boolean; cover_card_url: string | null; screen_count: number | null }
  >();
  if (url && key) {
    try {
      const supabase = createClient(url, key, { auth: { persistSession: false } });
      const { data } = await supabase
        .from('software_project_cards')
        .select('slug, published, cover_card_url, screen_count')
        .is('deleted_at', null);
      for (const row of data ?? []) {
        dbBySlug.set(String(row.slug), {
          published: Boolean(row.published),
          cover_card_url: (row.cover_card_url as string | null) ?? null,
          screen_count: row.screen_count == null ? null : Number(row.screen_count),
        });
      }
    } catch (err) {
      console.warn('Supabase audit skipped:', err);
    }
  }

  for (const product of SOFTWARE_SEED_PRODUCTS) {
    const issues: string[] = [];
    const dir = path.join(ROOT, product.slug);
    let coverStatus: FieldStatus = 'pass';
    let seoStatus: FieldStatus = 'pass';
    let adminStatus: FieldStatus = 'pass';
    let imageBudget: FieldStatus = 'pass';
    let manifestStatus: FieldStatus = 'pass';
    let screensStatus: FieldStatus = 'pass';
    let pricingStatus: FieldStatus = 'pass';
    let coverBytes: number | null = null;
    let hasCoverPng = false;
    let premiumVersion: number | null = null;
    const statuses: Status[] = [];

    if (!(await exists(dir))) {
      issues.push('missing project folder');
      projects.push({
        slug: product.slug,
        title: product.title,
        premium_status: 'incomplete',
        screen_count: product.screens.length,
        cover_status: 'missing',
        seo_status: 'fail',
        admin_status: 'missing',
        image_budget_status: 'missing',
        manifest_status: 'missing',
        screens_status: 'missing',
        pricing_status: 'fail',
        cover_card_bytes: null,
        has_cover_png: false,
        premium_upgrade_version: null,
        issues,
      });
      continue;
    }

    // Manifest
    const manifestPath = path.join(dir, 'design-manifest.json');
    if (!(await exists(manifestPath))) {
      manifestStatus = 'missing';
      issues.push('missing design-manifest.json');
      statuses.push('incomplete');
    } else {
      try {
        const raw = JSON.parse(await readFile(manifestPath, 'utf8')) as Record<string, unknown>;
        premiumVersion =
          typeof raw.premiumUpgradeVersion === 'number' ? raw.premiumUpgradeVersion : null;
        const missingKeys = RICH_MANIFEST_KEYS.filter((k) => raw[k] == null);
        if (missingKeys.length > 0) {
          manifestStatus = 'fail';
          issues.push(`manifest missing DNA fields: ${missingKeys.slice(0, 6).join(', ')}`);
          statuses.push(missingKeys.length > 8 ? 'needs_major_upgrade' : 'needs_minor_upgrade');
        }
        if (!premiumVersion || premiumVersion < 2) {
          issues.push('manifest not marked premiumUpgradeVersion>=2 (procedural assets era)');
          statuses.push('needs_major_upgrade');
          if (manifestStatus === 'pass') manifestStatus = 'fail';
        }
      } catch {
        manifestStatus = 'fail';
        issues.push('invalid design-manifest.json');
        statuses.push('incomplete');
      }
    }

    hasCoverPng = await exists(path.join(dir, 'cover.png'));
    const coverCard = path.join(dir, 'cover-card.avif');
    const coverDetail = path.join(dir, 'cover-detail.avif');

    if (!(await exists(coverCard))) {
      coverStatus = 'missing';
      issues.push('missing cover-card.avif');
      statuses.push('incomplete');
    } else {
      const s = await stat(coverCard);
      coverBytes = s.size;
      if (s.size > CARD_LIMIT) {
        imageBudget = 'fail';
        issues.push(`cover-card ${(s.size / 1024).toFixed(1)}KB > 50KB`);
        statuses.push('needs_minor_upgrade');
      }
      const hash = await sha1File(coverCard);
      const prev = coverHashes.get(hash);
      if (prev) {
        coverStatus = 'fail';
        issues.push(`duplicate cover-card bytes with ${prev}`);
        statuses.push('needs_major_upgrade');
      } else {
        coverHashes.set(hash, product.slug);
      }
      if (!hasCoverPng && s.size <= PLACEHOLDER_COVER_MAX) {
        coverStatus = 'fail';
        issues.push('cover looks like procedural SVG placeholder (tiny AVIF, no cover.png)');
        statuses.push('needs_major_upgrade');
      } else if (!hasCoverPng) {
        coverStatus = 'fail';
        issues.push('missing premium cover.png source');
        statuses.push('needs_major_upgrade');
      }
    }
    if (!(await exists(coverDetail))) {
      issues.push('missing cover-detail.avif');
      statuses.push('incomplete');
      if (coverStatus === 'pass') coverStatus = 'warn';
    }

    // Screens
    if (product.screens.length < 10) {
      screensStatus = 'fail';
      issues.push(`only ${product.screens.length} screen defs (<10)`);
      statuses.push('incomplete');
    }
    let missingScreens = 0;
    for (const screen of product.screens) {
      const preview = path.join(dir, `${screen.key}.avif`);
      const thumb = path.join(dir, `${screen.key}-thumb.avif`);
      if (!(await exists(preview))) {
        missingScreens += 1;
        issues.push(`missing screen ${screen.key}.avif`);
      } else {
        const hash = await sha1File(preview);
        const key = `${hash}`;
        const prev = screenHashes.get(key);
        if (prev && !prev.startsWith(product.slug)) {
          issues.push(`screen ${screen.key} duplicates bytes from ${prev}`);
          statuses.push('needs_major_upgrade');
          screensStatus = 'fail';
        } else {
          screenHashes.set(key, `${product.slug}/${screen.key}`);
        }
      }
      if (!(await exists(thumb))) {
        issues.push(`missing thumb ${screen.key}-thumb.avif`);
        statuses.push('needs_minor_upgrade');
      } else {
        const ts = await stat(thumb);
        if (ts.size > THUMB_LIMIT) {
          imageBudget = 'warn';
          issues.push(`${screen.key}-thumb ${(ts.size / 1024).toFixed(1)}KB > 35KB`);
        }
      }
    }
    if (missingScreens > 0) {
      screensStatus = 'fail';
      statuses.push('incomplete');
    }
    if (!premiumVersion || premiumVersion < 2) {
      if (screensStatus === 'pass') screensStatus = 'fail';
      issues.push('screens not on enhanced premium generator (v2+)');
      statuses.push('needs_major_upgrade');
    }

    // SEO
    const titleKey = product.seoTitle.trim().toLowerCase();
    const descKey = product.seoDescription.trim().toLowerCase();
    if (!product.seoTitle || !product.seoDescription || product.seoKeywords.length < 2) {
      seoStatus = 'fail';
      issues.push('incomplete SEO fields');
      statuses.push('needs_minor_upgrade');
    }
    if (seoTitles.has(titleKey)) {
      seoStatus = 'fail';
      issues.push(`duplicate seoTitle with ${seoTitles.get(titleKey)}`);
      statuses.push('needs_minor_upgrade');
    } else seoTitles.set(titleKey, product.slug);
    if (seoDescs.has(descKey)) {
      seoStatus = 'fail';
      issues.push(`duplicate seoDescription with ${seoDescs.get(descKey)}`);
      statuses.push('needs_minor_upgrade');
    } else seoDescs.set(descKey, product.slug);

    // Pricing
    if (product.startingPrice < 20000 || product.startingPrice > 200000) {
      pricingStatus = 'fail';
      issues.push(`startingPrice ${product.startingPrice} outside 20k–200k band`);
      statuses.push('needs_minor_upgrade');
    }

    // Catalog DNA quality
    if (product.dashboardKPIs.filter(genericKpi).length >= 3) {
      issues.push('dashboard KPIs look generic (Revenue/Users/Orders)');
      statuses.push('needs_minor_upgrade');
    }
    if (product.terminology.length < 4) {
      issues.push('weak terminology list');
      statuses.push('needs_minor_upgrade');
    }

    // Admin / DB
    const db = dbBySlug.get(product.slug);
    if (dbBySlug.size > 0) {
      if (!db) {
        adminStatus = 'missing';
        issues.push('not found in Supabase software_project_cards');
        statuses.push('incomplete');
      } else {
        if (!db.cover_card_url) {
          adminStatus = 'fail';
          issues.push('DB missing cover_card_url');
          statuses.push('incomplete');
        }
        if (!db.published) {
          issues.push('DB published=false');
          statuses.push('needs_minor_upgrade');
        }
      }
    }

    // Orphans (local files not in catalog)
    const files = await readdir(dir);
    const expected = new Set([
      'design-manifest.json',
      'cover.png',
      'cover-card.avif',
      'cover-detail.avif',
      ...product.screens.flatMap((s) => [`${s.key}.avif`, `${s.key}-thumb.avif`]),
    ]);
    const orphans = files.filter((f) => !expected.has(f) && (f.endsWith('.avif') || f.endsWith('.png')));
    if (orphans.length > 0) {
      issues.push(`${orphans.length} orphan asset file(s)`);
      statuses.push('needs_minor_upgrade');
    }

    const premium_status = worst(...(statuses.length ? statuses : (['pass'] as Status[])));

    projects.push({
      slug: product.slug,
      title: product.title,
      premium_status,
      screen_count: product.screens.length,
      cover_status: coverStatus,
      seo_status: seoStatus,
      admin_status: adminStatus,
      image_budget_status: imageBudget,
      manifest_status: manifestStatus,
      screens_status: screensStatus,
      pricing_status: pricingStatus,
      cover_card_bytes: coverBytes,
      has_cover_png: hasCoverPng,
      premium_upgrade_version: premiumVersion,
      issues: [...new Set(issues)],
    });
  }

  const summary = {
    audited_at: new Date().toISOString(),
    total: projects.length,
    pass: projects.filter((p) => p.premium_status === 'pass').length,
    needs_minor_upgrade: projects.filter((p) => p.premium_status === 'needs_minor_upgrade').length,
    needs_major_upgrade: projects.filter((p) => p.premium_status === 'needs_major_upgrade').length,
    incomplete: projects.filter((p) => p.premium_status === 'incomplete').length,
    with_cover_png: projects.filter((p) => p.has_cover_png).length,
    avg_screen_count:
      projects.reduce((n, p) => n + p.screen_count, 0) / Math.max(1, projects.length),
    batches: {
      major: projects.filter((p) => p.premium_status === 'needs_major_upgrade').map((p) => p.slug),
      incomplete: projects.filter((p) => p.premium_status === 'incomplete').map((p) => p.slug),
      minor: projects.filter((p) => p.premium_status === 'needs_minor_upgrade').map((p) => p.slug),
      pass: projects.filter((p) => p.premium_status === 'pass').map((p) => p.slug),
    },
  };

  const report = { summary, projects };
  await writeFile(OUT, JSON.stringify(report, null, 2) + '\n');

  console.log('=== Software Premium Audit ===');
  console.log(`Total: ${summary.total}`);
  console.log(`PASS: ${summary.pass}`);
  console.log(`MINOR: ${summary.needs_minor_upgrade}`);
  console.log(`MAJOR: ${summary.needs_major_upgrade}`);
  console.log(`INCOMPLETE: ${summary.incomplete}`);
  console.log(`cover.png present: ${summary.with_cover_png}`);
  console.log(`Wrote ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
