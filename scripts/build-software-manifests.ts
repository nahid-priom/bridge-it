/**
 * Thin alias: build manifests only for all 50 products.
 * Prefer: npm run build:software-manifests
 */
import { spawn } from 'node:child_process';

const child = spawn(
  'npx',
  ['tsx', 'scripts/generate-software-showcases.ts', '--manifests-only', ...process.argv.slice(2)],
  { stdio: 'inherit', shell: true }
);
child.on('exit', (code) => process.exit(code ?? 1));
