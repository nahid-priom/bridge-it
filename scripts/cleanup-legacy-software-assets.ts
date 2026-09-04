/**
 * Safe cleanup of legacy Software showcase Storage objects under projects/.
 *
 * Usage:
 *   npx tsx scripts/cleanup-legacy-software-assets.ts --dry-run
 *   npx tsx scripts/cleanup-legacy-software-assets.ts --execute
 *
 * NEVER deletes objects still referenced by active DB rows.
 * Does NOT touch ecommerce / creative-marketing buckets.
 */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { SOFTWARE_BUCKET } from '../src/features/software-showcase/config/constants';

config({ path: '.env.local' });
config({ path: '.env' });

const dryRun = !process.argv.includes('--execute');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function collectReferences() {
  const referenced = new Set<string>();
  const { data: projects } = await supabase
    .from('software_projects')
    .select('cover_card_path, cover_detail_path')
    .is('deleted_at', null);
  for (const p of projects ?? []) {
    if (p.cover_card_path) referenced.add(String(p.cover_card_path));
    if (p.cover_detail_path) referenced.add(String(p.cover_detail_path));
  }
  const { data: screens } = await supabase
    .from('software_project_screens')
    .select('image_path, thumbnail_path, mobile_image_path')
    .is('deleted_at', null);
  for (const s of screens ?? []) {
    if (s.image_path) referenced.add(String(s.image_path));
    if (s.thumbnail_path) referenced.add(String(s.thumbnail_path));
    if (s.mobile_image_path) referenced.add(String(s.mobile_image_path));
  }
  return referenced;
}

/** List one level of folders under projects/ (project UUIDs). */
async function listProjectFolders() {
  const { data, error } = await supabase.storage.from(SOFTWARE_BUCKET).list('projects', { limit: 1000 });
  if (error) throw error;
  return (data ?? []).map((d) => d.name).filter(Boolean);
}

async function listFolderFiles(prefix: string): Promise<string[]> {
  const out: string[] = [];
  const queue = [prefix];
  let steps = 0;
  while (queue.length && steps < 5000) {
    steps += 1;
    const current = queue.shift()!;
    const { data, error } = await supabase.storage.from(SOFTWARE_BUCKET).list(current, { limit: 1000 });
    if (error) {
      console.warn(`list ${current}:`, error.message);
      continue;
    }
    for (const item of data ?? []) {
      const full = `${current}/${item.name}`;
      const isFolder = item.id == null && (item.metadata == null || Object.keys(item.metadata).length === 0);
      if (isFolder) queue.push(full);
      else out.push(full);
    }
  }
  return out;
}

async function main() {
  console.log(dryRun ? 'DRY-RUN cleanup' : 'EXECUTE cleanup');
  const referenced = await collectReferences();
  const legacyRefs = [...referenced].filter((r) => r.startsWith('projects/'));
  const canonicalRefs = [...referenced].filter((r) => r.startsWith('software-showcase/'));

  console.log(`DB refs: ${referenced.size} (legacy projects/=${legacyRefs.length}, canonical=${canonicalRefs.length})`);

  const folders = await listProjectFolders();
  console.log(`Found ${folders.length} folders under projects/`);

  const toDelete: string[] = [];
  const preserved: string[] = [];

  for (const folder of folders) {
    const prefix = `projects/${folder}`;
    const stillNeeded = legacyRefs.some((r) => r === prefix || r.startsWith(`${prefix}/`));
    if (stillNeeded) {
      preserved.push(prefix);
      continue;
    }
    // Folder has zero active refs — list files for deletion report
    const files = await listFolderFiles(prefix);
    toDelete.push(...files);
    console.log(`  orphan folder ${folder}: ${files.length} objects`);
  }

  const report = {
    mode: dryRun ? 'dry-run' : 'execute',
    generated_at: new Date().toISOString(),
    bucket: SOFTWARE_BUCKET,
    db_references: referenced.size,
    legacy_active_refs: legacyRefs.length,
    canonical_active_refs: canonicalRefs.length,
    legacy_projects_prefix: {
      folders: folders.length,
      preserved_referenced_folders: preserved.length,
      delete_candidates: toDelete.length,
      sample_delete: toDelete.slice(0, 40),
      sample_preserved: preserved.slice(0, 20),
      sample_legacy_refs: legacyRefs.slice(0, 20),
    },
    safe_to_execute: legacyRefs.length === 0,
  };

  const reportPath = path.join(process.cwd(), 'scripts/software-assets-cleanup-report.json');
  await writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report.legacy_projects_prefix, null, 2));
  console.log(`Wrote ${reportPath}`);

  if (!dryRun) {
    if (legacyRefs.length > 0) {
      console.error(`ABORT: ${legacyRefs.length} active DB refs still point at projects/. Migrate first.`);
      process.exit(1);
    }
    for (let i = 0; i < toDelete.length; i += 40) {
      const chunk = toDelete.slice(i, i + 40);
      const { error } = await supabase.storage.from(SOFTWARE_BUCKET).remove(chunk);
      if (error) {
        console.error('delete error', error.message);
        process.exit(1);
      }
      console.log(`Deleted ${i + chunk.length}/${toDelete.length}`);
    }
  }

  console.log(dryRun ? 'Dry-run complete — no deletions.' : 'Cleanup execute complete.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
