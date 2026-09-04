/**
 * Alias for optimize step (re-encode with --force).
 * Prefer: npm run optimize:software-assets
 */
import { spawn } from 'node:child_process';

const child = spawn(
  'npx',
  ['tsx', 'scripts/generate-software-showcases.ts', '--force', ...process.argv.slice(2)],
  { stdio: 'inherit', shell: true }
);
child.on('exit', (code) => process.exit(code ?? 1));
