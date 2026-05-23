/**
 * Production build entrypoint (used by npm run build).
 */
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const nextBin = path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next');

const child = spawn(process.execPath, [nextBin, 'build'], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'production' },
});

child.on('error', (err) => {
  console.error('Failed to start Next.js build:', err.message);
  process.exit(1);
});

child.on('close', (code, signal) => {
  if (signal) {
    console.error(`Build terminated by signal: ${signal}`);
    process.exit(1);
  }
  process.exit(code ?? 1);
});
