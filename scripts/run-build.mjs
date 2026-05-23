/**
 * Force production mode for `next build`.
 * A global NODE_ENV=development (common in some shells/IDEs) breaks 404 prerender
 * with: "<Html> should not be imported outside of pages/_document."
 */
import { spawnSync } from 'node:child_process';

const env = { ...process.env, NODE_ENV: 'production' };

const result = spawnSync('npx', ['next', 'build'], {
  stdio: 'inherit',
  shell: true,
  env,
});

process.exit(result.status ?? 1);
