#!/usr/bin/env npx tsx
/**
 * One-shot: regenerate ALL software showcase screens locally, then force-upload
 * and replace Storage + DB URLs (bumps asset_version for cache bust).
 *
 * Prerequisites (.env.local or .env):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage:
 *   npm run software:force-refresh
 *   npm run software:force-refresh -- --slug=garments-erp
 *   npm run software:force-refresh -- --dry-run
 *   npm run software:force-refresh -- --screens-only
 *   npm run software:force-refresh -- --covers-too   # also regenerate missing covers only
 *
 * Default: force-regenerate screens (keeps existing lifestyle covers), then upload --force.
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { config } from 'dotenv';

config({ path: '.env.local' });
config({ path: '.env' });

const root = process.cwd();
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const screensOnly = args.includes('--screens-only') || !args.includes('--covers-too');
const slugArg = args.find((a) => a.startsWith('--slug='));

function run(label: string, scriptRel: string, scriptArgs: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`\n════════ ${label} ════════\n`);
    const child = spawn(
      process.execPath,
      [
        path.join(root, 'node_modules/tsx/dist/cli.mjs'),
        path.join(root, scriptRel),
        ...scriptArgs,
      ],
      {
        cwd: root,
        stdio: 'inherit',
        env: process.env,
      }
    );
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${label} exited with code ${code}`));
    });
  });
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!dryRun && (!url || !key)) {
    console.error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local\n' +
        'Add them, then re-run: npm run software:force-refresh'
    );
    process.exit(1);
  }

  console.log('Software force refresh');
  console.log(`  dry-run: ${dryRun}`);
  console.log(`  mode: ${screensOnly ? 'screens (covers preserved)' : 'screens + fill missing covers'}`);
  if (slugArg) console.log(`  slug: ${slugArg.slice(7)}`);

  const genArgs = ['--force'];
  if (screensOnly) genArgs.push('--screens-only');
  if (slugArg) genArgs.push(slugArg);

  await run('1/2 Generate local AVIF screens', 'scripts/generate-software-showcases.ts', genArgs);

  await run(
    '1b/2 Overlay generated dashboards (skip if PNGs missing)',
    'scripts/convert-generated-software-dashboards.ts',
    []
  );

  const uploadArgs = ['--force'];
  if (dryRun) uploadArgs.push('--dry-run');
  if (slugArg) uploadArgs.push(slugArg);

  await run('2/2 Upload + replace DB URLs', 'scripts/upload-software-assets.ts', uploadArgs);

  console.log('\n✓ Force refresh complete. Hard-refresh the site to see new images.\n');
}

main().catch((err) => {
  console.error('\n✗ Force refresh failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
