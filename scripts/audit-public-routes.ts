/**
 * Smoke-check canonical public routes for title/description/robots signals in HTML.
 * Run against a live base URL:
 *   SITE_URL=http://localhost:3000 npx tsx scripts/audit-public-routes.ts
 */
import { PUBLIC_INDEXABLE_ROUTES } from '../lib/seo/config';

const BASE = (process.env.SITE_URL || process.env.AUDIT_BASE_URL || 'https://www.bridgeitpark.com').replace(
  /\/$/,
  ''
);

async function check(path: string) {
  const url = `${BASE}${path === '/' ? '' : path}`;
  const res = await fetch(url, {
    redirect: 'manual',
    headers: { 'user-agent': 'bitp-audit-public-routes/1.0' },
  });
  const status = res.status;
  const html = status >= 200 && status < 400 ? await res.text() : '';
  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? '';
  const description =
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1] ??
    html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i)?.[1] ??
    '';
  const canonical =
    html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i)?.[1] ??
    html.match(/<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i)?.[1] ??
    '';
  const robots =
    html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i)?.[1] ??
    html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']robots["']/i)?.[1] ??
    '';
  const h1Count = (html.match(/<h1\b/gi) || []).length;

  const issues: string[] = [];
  if (status !== 200) issues.push(`status=${status}`);
  if (!title) issues.push('missing title');
  if (!description) issues.push('missing description');
  if (!canonical) issues.push('missing canonical');
  if (h1Count !== 1) issues.push(`h1_count=${h1Count}`);
  if (/noindex/i.test(robots)) issues.push(`robots=${robots}`);

  return { path, status, title, issues };
}

async function main() {
  console.log(`Auditing ${PUBLIC_INDEXABLE_ROUTES.length} routes against ${BASE}`);
  const results = [];
  for (const path of PUBLIC_INDEXABLE_ROUTES) {
    try {
      results.push(await check(path));
    } catch (error) {
      results.push({
        path,
        status: 0,
        title: '',
        issues: [error instanceof Error ? error.message : String(error)],
      });
    }
  }

  let failed = 0;
  for (const row of results) {
    if (row.issues.length) {
      failed += 1;
      console.error(`FAIL ${row.path}: ${row.issues.join('; ')}`);
    } else {
      console.log(`OK   ${row.path} — ${row.title.slice(0, 60)}`);
    }
  }

  console.log(`\n${results.length - failed}/${results.length} passed`);
  if (failed) process.exit(1);
}

main();
