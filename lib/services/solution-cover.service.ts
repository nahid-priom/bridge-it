import sharp from 'sharp';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { buildCoverAltText } from '@/lib/solutions/coverAltText';
import { hasValidSolutionCover, SOLUTION_COVERS_BUCKET_NAME } from '@/lib/solutions/isLegacyCover';
import {
  getCoverStoragePath,
  type CoverRecord,
  type CoverUploadResult,
} from '@/lib/solutions/coverTypes';

const WEBP_QUALITY = 82;
const TARGET_WIDTH = 1600;
const TARGET_HEIGHT = 900;

type CoverDb = SupabaseClient;

function getCoverAdminClient(): CoverDb | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function optimizeCoverToWebp(input: Buffer): Promise<Buffer> {
  return sharp(input)
    .resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: 'cover', position: 'centre' })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer();
}

export async function uploadCoverToStorage(
  storagePath: string,
  buffer: Buffer
): Promise<{ publicUrl: string; storagePath: string }> {
  const supabase = getCoverAdminClient();
  if (!supabase) throw new Error('Supabase not configured');

  const { error: uploadError } = await supabase.storage
    .from(SOLUTION_COVERS_BUCKET_NAME)
    .upload(storagePath, buffer, {
      contentType: 'image/webp',
      upsert: true,
      cacheControl: '31536000',
    });

  if (uploadError) {
    if (uploadError.message.includes('Bucket not found') || uploadError.message.includes('not found')) {
      await supabase.storage.createBucket(SOLUTION_COVERS_BUCKET_NAME, {
        public: true,
        fileSizeLimit: 5242880,
        allowedMimeTypes: ['image/webp', 'image/jpeg', 'image/png', 'image/avif'],
      });
      const retry = await supabase.storage.from(SOLUTION_COVERS_BUCKET_NAME).upload(storagePath, buffer, {
        contentType: 'image/webp',
        upsert: true,
        cacheControl: '31536000',
      });
      if (retry.error) {
        console.error('[solution-cover] upload retry failed', retry.error.message);
        throw new Error('Failed to upload cover image');
      }
    } else {
      console.error('[solution-cover] upload failed', uploadError.message);
      throw new Error('Failed to upload cover image');
    }
  }

  const { data: urlData } = supabase.storage.from(SOLUTION_COVERS_BUCKET_NAME).getPublicUrl(storagePath);

  if (!urlData.publicUrl) {
    throw new Error('Failed to resolve public URL');
  }

  return { publicUrl: urlData.publicUrl, storagePath };
}

async function updateCoverInDatabase(
  record: CoverRecord,
  publicUrl: string,
  storagePath: string,
  alt: string
): Promise<void> {
  const supabase = getCoverAdminClient();
  if (!supabase) throw new Error('Supabase not configured');

  const now = new Date().toISOString();
  const metaFields = {
    cover_image_path: storagePath,
    cover_image_alt: alt,
    cover_image_prompt: null,
    cover_image_updated_at: now,
  };

  if (record.entityType === 'bitp') {
    const fullPayload = {
      ...metaFields,
      cover_image: publicUrl,
      thumbnail: publicUrl,
    };
    const { error } = await supabase.from('products').update(fullPayload).eq('id', record.id);

    if (error?.message?.includes('cover_image_path')) {
      const { error: fallbackError } = await supabase
        .from('products')
        .update({ cover_image: publicUrl, thumbnail: publicUrl })
        .eq('id', record.id);
      if (fallbackError) {
        console.error('[solution-cover] DB update failed (bitp)', fallbackError.message);
        throw new Error('Failed to update product cover');
      }
      return;
    }

    if (error) {
      console.error('[solution-cover] DB update failed (bitp)', error.message);
      throw new Error('Failed to update product cover');
    }
    return;
  }

  if (record.entityType === 'marketplace-service') {
    const fullPayload = {
      ...metaFields,
      thumbnail_type: 'image',
      thumbnail_url: publicUrl,
    };
    const { error } = await supabase.from('marketplace_services').update(fullPayload).eq('id', record.id);

    if (error?.message?.includes('cover_image_path')) {
      const { error: fallbackError } = await supabase
        .from('marketplace_services')
        .update({ thumbnail_type: 'image', thumbnail_url: publicUrl })
        .eq('id', record.id);
      if (fallbackError) {
        console.error('[solution-cover] DB update failed (service)', fallbackError.message);
        throw new Error('Failed to update service cover');
      }
      return;
    }

    if (error) {
      console.error('[solution-cover] DB update failed (service)', error.message);
      throw new Error('Failed to update service cover');
    }
    return;
  }

  const fullPayload = {
    ...metaFields,
    thumbnail_url: publicUrl,
  };
  const { error } = await supabase.from('marketplace_products').update(fullPayload).eq('id', record.id);

  if (error?.message?.includes('cover_image_path')) {
    const { error: fallbackError } = await supabase
      .from('marketplace_products')
      .update({ thumbnail_url: publicUrl })
      .eq('id', record.id);
    if (fallbackError) {
      console.error('[solution-cover] DB update failed (product)', fallbackError.message);
      throw new Error('Failed to update marketplace product cover');
    }
    return;
  }

  if (error) {
    console.error('[solution-cover] DB update failed (product)', error.message);
    throw new Error('Failed to update marketplace product cover');
  }
}

export async function uploadCustomCover(
  record: CoverRecord,
  fileBuffer: Buffer
): Promise<CoverUploadResult> {
  const webpBuffer = await optimizeCoverToWebp(fileBuffer);
  const storagePath = getCoverStoragePath(record.entityType, record.id);
  const { publicUrl } = await uploadCoverToStorage(storagePath, webpBuffer);

  const alt = buildCoverAltText({
    title: record.title,
    category: record.category,
  });

  await updateCoverInDatabase(record, publicUrl, storagePath, alt);

  return {
    entityType: record.entityType,
    id: record.id,
    slug: record.slug,
    publicUrl,
    storagePath,
    alt,
  };
}

export async function removeCover(record: CoverRecord): Promise<void> {
  const supabase = getCoverAdminClient();
  if (!supabase) throw new Error('Supabase not configured');

  const storagePath = record.coverPath ?? getCoverStoragePath(record.entityType, record.id);

  if (record.coverPath || hasValidSolutionCover(record.coverUrl, record.coverPath)) {
    const { error: deleteError } = await supabase.storage
      .from(SOLUTION_COVERS_BUCKET_NAME)
      .remove([storagePath]);

    if (deleteError) {
      console.error('[solution-cover] storage delete failed', deleteError.message);
    }
  }

  const clearFields = {
    cover_image_path: null,
    cover_image_alt: null,
    cover_image_prompt: null,
    cover_image_updated_at: null,
  };

  if (record.entityType === 'bitp') {
    await supabase
      .from('products')
      .update({ ...clearFields, cover_image: null, thumbnail: null })
      .eq('id', record.id);
    return;
  }

  if (record.entityType === 'marketplace-service') {
    await supabase
      .from('marketplace_services')
      .update({ ...clearFields, thumbnail_type: 'gradient', thumbnail_url: null })
      .eq('id', record.id);
    return;
  }

  await supabase
    .from('marketplace_products')
    .update({ ...clearFields, thumbnail_url: null })
    .eq('id', record.id);
}

export async function fetchBitpCoverRecordById(id: string): Promise<CoverRecord | null> {
  const supabase = getCoverAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('products')
    .select(
      'id, slug, name, short_description, product_type, cover_image, cover_image_path, category:categories(name)'
    )
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;

  const cat = Array.isArray(data.category) ? data.category[0] : data.category;

  return {
    entityType: 'bitp',
    id: data.id as string,
    slug: data.slug as string,
    title: data.name as string,
    category: (cat as { name?: string })?.name ?? null,
    shortDescription: data.short_description as string | null,
    productType: data.product_type as string,
    coverUrl: data.cover_image as string | null,
    coverPath: data.cover_image_path as string | null,
  };
}

export type { CoverUploadResult, CoverRecord };
