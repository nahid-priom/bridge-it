
import 'dotenv/config';
import {
  bulkGenerateCovers,
  type CoverEntityType,
} from '../lib/services/solution-cover.service';

function parseArgs() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const entityIdx = args.indexOf('--entity');
  let entityTypes: CoverEntityType[] = [
    'bitp',
    'marketplace-service',
    'marketplace-product',
  ];

  if (entityIdx >= 0 && args[entityIdx + 1]) {
    const raw = args[entityIdx + 1];
    const map: Record<string, CoverEntityType> = {
      bitp: 'bitp',
      'marketplace-services': 'marketplace-service',
      'marketplace-service': 'marketplace-service',
      'marketplace-products': 'marketplace-product',
      'marketplace-product': 'marketplace-product',
    };
    const mapped = map[raw];
    if (!mapped) {
      console.error(`Unknown entity type: ${raw}`);
      process.exit(1);
    }
    entityTypes = [mapped];
  }

  return { force, entityTypes };
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is required. Set it in .env.local');
    process.exit(1);
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error('Supabase env vars are required (SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_URL)');
    process.exit(1);
  }

  const { force, entityTypes } = parseArgs();

  console.log(`Starting cover backfill (force=${force}, entities=${entityTypes.join(', ')})`);

  const progress = await bulkGenerateCovers({
    entityTypes,
    onlyMissing: !force,
    concurrency: 2,
    onProgress: (p) => {
      process.stdout.write(
        `\rGenerated ${p.generated} / ${p.total} · Failed ${p.failed} · Remaining ${p.remaining}   `
      );
    },
  });

  console.log('\n\n--- Summary ---');
  console.log(`Total: ${progress.total}`);
  console.log(`Generated: ${progress.generated}`);
  console.log(`Failed: ${progress.failed}`);

  if (progress.results.length > 0) {
    console.log('\nSample mappings:');
    for (const r of progress.results.slice(0, 10)) {
      console.log(`  ${r.slug} → solution-covers/${r.storagePath}`);
    }
  }

  if (progress.errors.length > 0) {
    console.log('\nFailures:');
    for (const e of progress.errors) {
      console.log(`  [${e.entityType}] ${e.slug}: ${e.error}`);
    }
  }

  process.exit(progress.failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
