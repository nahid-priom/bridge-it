/**
 * Compare PUBLIC_INDEXABLE_ROUTES + published dynamics against STATIC_SITEMAP_ROUTES coverage.
 * Run: npx tsx scripts/audit-sitemap.ts
 */
import { PUBLIC_INDEXABLE_ROUTES, STATIC_SITEMAP_ROUTES } from '../lib/seo/config';

function main() {
  const staticPaths = new Set(STATIC_SITEMAP_ROUTES.map((r) => r.path));
  const missingStatic = PUBLIC_INDEXABLE_ROUTES.filter((path) => !staticPaths.has(path));
  const extraStatic = STATIC_SITEMAP_ROUTES.filter(
    (r) => !(PUBLIC_INDEXABLE_ROUTES as readonly string[]).includes(r.path)
  );

  console.log('=== Sitemap static coverage ===');
  console.log(`Registry routes: ${PUBLIC_INDEXABLE_ROUTES.length}`);
  console.log(`STATIC_SITEMAP_ROUTES: ${STATIC_SITEMAP_ROUTES.length}`);

  if (missingStatic.length) {
    console.error('MISSING from sitemap config:', missingStatic.join(', '));
  } else {
    console.log('All PUBLIC_INDEXABLE_ROUTES are in STATIC_SITEMAP_ROUTES.');
  }

  if (extraStatic.length) {
    console.log(
      'Extra static sitemap entries (ok if intentional):',
      extraStatic.map((r) => r.path).join(', ')
    );
  }

  console.log('\nDynamic sources (runtime): ecommerce categories, websites, software, creative.');
  console.log('Use buildSitemapEntries() in a server context to count live URLs.');

  if (missingStatic.length) process.exit(1);
  console.log('\nPASS');
}

main();
