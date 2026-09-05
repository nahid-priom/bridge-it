/**
 * Upload generated cover PNGs for software products missing covers.
 * Source: Cursor assets/cover-{slug}.png
 * Formula: encode card+detail AVIF → admin-showcase/software-showcase/{slug}/v{n}/cover/
 *
 * Run: npx tsx scripts/upload-generated-software-covers.ts
 */
import { config } from 'dotenv';
import { readFile } from 'fs/promises';
import { createClient } from '@supabase/supabase-js';
import { encodeCoverCard, encodeCoverDetail } from '../src/features/software-showcase/utils/image-pipeline';
import { SOFTWARE_BUCKET } from '../src/features/software-showcase/config/constants';
import {
  coverCardPath,
  coverDetailPath,
} from '../src/features/software-showcase/utils/storage-paths';

config({ path: '.env.local' });
config({ path: '.env' });

const ASSETS =
  '/home/priom/.cursor/projects/home-priom-Desktop-bridge-it-park-smart-it-park/assets';

const SLUGS = [
  'accounting-software',
  'ecommerce-admin-dashboard',
  'ecommerce-admin-operations',
  'ecommerce-management',
  'facility-management-software',
  'furniture-manufacturing-erp',
  'gym-management',
  'hotel-management',
  'jewelry-erp',
  'microfinance-software',
  'ngo-management',
  'procurement-software',
  'professional-services-erp',
  'rental-management',
  'security-services-software',
  'travel-tourism-software',
] as const;

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase env');

  const sb = createClient(url, key);

  for (const slug of SLUGS) {
    const sourcePath = `${ASSETS}/cover-${slug}.png`;
    const input = await readFile(sourcePath);

    const { data: project, error: projectError } = await sb
      .from('software_projects')
      .select('id, slug, asset_version, cover_card_path, cover_detail_path')
      .eq('slug', slug)
      .is('deleted_at', null)
      .maybeSingle();

    if (projectError || !project) {
      console.error('SKIP missing project', slug, projectError?.message);
      continue;
    }

    const version = Math.max(1, Number(project.asset_version ?? 1)) + 1;
    const [card, detail] = await Promise.all([
      encodeCoverCard(input),
      encodeCoverDetail(input),
    ]);

    const cardPath = coverCardPath(slug, version);
    const detailPath = coverDetailPath(slug, version);

    const [cardUp, detailUp] = await Promise.all([
      sb.storage.from(SOFTWARE_BUCKET).upload(cardPath, card.buffer, {
        contentType: card.contentType,
        upsert: true,
        cacheControl: '31536000, immutable',
      }),
      sb.storage.from(SOFTWARE_BUCKET).upload(detailPath, detail.buffer, {
        contentType: detail.contentType,
        upsert: true,
        cacheControl: '31536000, immutable',
      }),
    ]);

    if (cardUp.error || detailUp.error) {
      console.error(
        'UPLOAD FAIL',
        slug,
        cardUp.error?.message || detailUp.error?.message
      );
      continue;
    }

    const cardUrl = sb.storage.from(SOFTWARE_BUCKET).getPublicUrl(cardPath).data.publicUrl;
    const detailUrl = sb.storage.from(SOFTWARE_BUCKET).getPublicUrl(detailPath).data.publicUrl;

    const { error: updateError } = await sb
      .from('software_projects')
      .update({
        cover_card_path: cardPath,
        cover_card_url: cardUrl,
        cover_detail_path: detailPath,
        cover_detail_url: detailUrl,
        og_image_url: detailUrl,
        asset_version: version,
        updated_at: new Date().toISOString(),
      })
      .eq('id', project.id);

    if (updateError) {
      console.error('DB FAIL', slug, updateError.message);
      continue;
    }

    const obsolete = [project.cover_card_path, project.cover_detail_path].filter(
      (p): p is string => Boolean(p) && p !== cardPath && p !== detailPath
    );
    if (obsolete.length) {
      await sb.storage.from(SOFTWARE_BUCKET).remove(obsolete);
    }

    console.log('OK', slug, `v${version}`, `${card.buffer.byteLength}b card`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
