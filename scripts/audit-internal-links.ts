/**
 * Scan key navigation sources for legacy / broken internal path patterns.
 * Run: npx tsx scripts/audit-internal-links.ts
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { LEGACY_REDIRECTS, PUBLIC_INDEXABLE_ROUTES } from '../lib/seo/config';
import { FOOTER_COLUMNS } from '../data/homeContent';
import { MAIN_NAV_LINKS } from '../components/navbar/constants';

const ROOT = process.cwd();

const LEGACY_HREF_PATTERNS = [
  /href=["']\/products(\/|"|'|\?)/,
  /href=["']\/services(\/|"|'|\?)/,
  /href=["']\/categories(\/|"|'|\?)/,
  /href=["']\/solutions(\/|"|'|\?)/,
  /href=["']\/cart["']/,
  /href=["']\/search(\?|"|')/,
  /href=["']\/contact["']/,
  /ROUTES\.products\b/,
  /ROUTES\.cart\b/,
];

const SCAN_DIRS = [
  'components/navbar',
  'components/Footer.tsx',
  'components/home',
  'data/homeContent.ts',
  'app/page.tsx',
];

function walk(path: string, out: string[] = []): string[] {
  const full = join(ROOT, path);
  let st;
  try {
    st = statSync(full);
  } catch {
    return out;
  }
  if (st.isFile()) {
    if (/\.(tsx|ts|jsx|js)$/.test(full)) out.push(full);
    return out;
  }
  for (const name of readdirSync(full)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    walk(join(path, name), out);
  }
  return out;
}

function main() {
  const files = SCAN_DIRS.flatMap((p) => walk(p));
  const hits: Array<{ file: string; pattern: string }> = [];

  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    for (const pattern of LEGACY_HREF_PATTERNS) {
      if (pattern.test(text)) {
        hits.push({ file: file.replace(ROOT + '/', ''), pattern: String(pattern) });
      }
    }
  }

  console.log('=== Nav / footer registry check ===');
  const navHrefs = MAIN_NAV_LINKS.map((l) => l.href);
  const footerHrefs = [
    ...FOOTER_COLUMNS.services.map((l) => l.href),
    ...FOOTER_COLUMNS.explore.map((l) => l.href),
    ...FOOTER_COLUMNS.popular.map((l) => l.href),
    ...FOOTER_COLUMNS.legal.map((l) => l.href),
  ];
  console.log('MAIN_NAV_LINKS:', navHrefs.join(', '));
  console.log('Footer links:', [...new Set(footerHrefs)].join(', '));

  const indexable = new Set(PUBLIC_INDEXABLE_ROUTES as readonly string[]);
  const uncovered = [...indexable].filter(
    (path) =>
      path !== '/' &&
      !navHrefs.includes(path) &&
      !footerHrefs.includes(path) &&
      path !== '/explore'
  );
  // /explore is in footer explore column
  if (uncovered.length) {
    console.warn('Indexable routes not in primary nav/footer (may still be linked elsewhere):', uncovered.join(', '));
  } else {
    console.log('All non-home indexable static routes appear in nav or footer.');
  }

  console.log(`\n=== Legacy redirect map (${LEGACY_REDIRECTS.length}) ===`);
  for (const rule of LEGACY_REDIRECTS.slice(0, 8)) {
    console.log(`${rule.source} → ${rule.destination}`);
  }
  if (LEGACY_REDIRECTS.length > 8) console.log(`… +${LEGACY_REDIRECTS.length - 8} more`);

  console.log(`\n=== Legacy href scan (${files.length} files) ===`);
  if (hits.length) {
    for (const hit of hits) {
      console.error(`LEGACY ${hit.file} matches ${hit.pattern}`);
    }
    process.exit(1);
  }

  console.log('No legacy href patterns found in scanned nav/home/footer sources.');
  console.log('\nPASS');
}

main();
