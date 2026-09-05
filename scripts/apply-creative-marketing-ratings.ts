/**
 * Apply creative marketing rating columns + backfill (4.7–5.0).
 * Uses DATABASE_URL / DIRECT_URL when available.
 *
 *   npx tsx scripts/apply-creative-marketing-ratings.ts
 */
import { config } from 'dotenv';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import pg from 'pg';

config({ path: '.env.local' });
config({ path: '.env' });

const connectionString =
  process.env.DATABASE_URL?.trim() ||
  process.env.DIRECT_URL?.trim() ||
  process.env.POSTGRES_URL?.trim();

async function main() {
  if (!connectionString) {
    console.error(
      'Missing DATABASE_URL / DIRECT_URL. Apply supabase/migrations/20260923120000_creative_marketing_ratings.sql in the Supabase SQL editor, then re-run: npm run seed:creative-marketing -- --force'
    );
    process.exit(1);
  }

  const sqlPath = path.join(
    process.cwd(),
    'supabase/migrations/20260923120000_creative_marketing_ratings.sql'
  );
  const sql = await readFile(sqlPath, 'utf8');
  const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query(sql);
    console.log('Creative marketing ratings migration applied.');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
