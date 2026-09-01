import sharp from 'sharp';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { buildSolutionCoverPrompt } from '@/lib/solutions/buildCoverPrompt';
import { buildCoverAltText } from '@/lib/solutions/coverAltText';
import { hasValidSolutionCover, SOLUTION_COVERS_BUCKET_NAME } from '@/lib/solutions/isLegacyCover';
import {
  getCoverStoragePath,
  type CoverEntityType,
  type CoverGenerationError,
  type CoverGenerationResult,
  type CoverRecord,
  type BulkCoverProgress,
} from '@/lib/solutions/coverTypes';
import { generateOpenAIImage } from '@/lib/services/openai-images.client';

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
        allowedMimeTypes: ['image/webp', 'image/jpeg', 'image/png'],
      });
      const retry = await supabase.storage
        .from(SOLUTION_COVERS_BUCKET_NAME)
        .upload(storagePath, buffer, {
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

  const { data: urlData } = supabase.storage
    .from(SOLUTION_COVERS_BUCKET_NAME)
    .getPublicUrl(storagePath);

  if (!urlData.publicUrl) {
    throw new Error('Failed to resolve public URL');
  }

  return { publicUrl: urlData.publicUrl, storagePath };
}

async function updateCoverInDatabase(
  record: CoverRecord,
  publicUrl: string,
  storagePath: string,
  alt: string,
  prompt: string
): Promise<void> {
  const supabase = getCoverAdminClient();
  if (!supabase) throw new Error('Supabase not configured');

  const now = new Date().toISOString();
  const metaFields = {
    cover_image_path: storagePath,
    cover_image_alt: alt,
    cover_image_prompt: prompt,
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
    const { error } = await supabase
      .from('marketplace_services')
      .update(fullPayload)
      .eq('id', record.id);

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

export async function generateAndStoreCover(
  record: CoverRecord,
  customPrompt?: string
): Promise<CoverGenerationResult> {
  const prompt =
    customPrompt?.trim() ||
    buildSolutionCoverPrompt({
      title: record.title,
      category: record.category,
      shortDescription: record.shortDescription,
      features: record.features,
      productType: record.productType,
      slug: record.slug,
    });

  const alt = buildCoverAltText({
    title: record.title,
    category: record.category,
    slug: record.slug,
  });

  const { buffer: rawBuffer } = await generateOpenAIImage(prompt);
  const webpBuffer = await optimizeCoverToWebp(rawBuffer);

  const storagePath = getCoverStoragePath(record.entityType, record.id);
  const { publicUrl } = await uploadCoverToStorage(storagePath, webpBuffer);

  await updateCoverInDatabase(record, publicUrl, storagePath, alt, prompt);

  return {
    entityType: record.entityType,
    id: record.id,
    slug: record.slug,
    publicUrl,
    storagePath,
    alt,
    prompt,
  };
}

export async function uploadCustomCover(
  record: CoverRecord,
  fileBuffer: Buffer,
  mimeType: string
): Promise<CoverGenerationResult> {
  const webpBuffer = await optimizeCoverToWebp(fileBuffer);
  const storagePath = getCoverStoragePath(record.entityType, record.id);
  const { publicUrl } = await uploadCoverToStorage(storagePath, webpBuffer);

  const alt = buildCoverAltText({
    title: record.title,
    category: record.category,
    slug: record.slug,
  });

  const prompt =
    record.coverPath && record.coverUrl
      ? `Custom uploaded cover (${mimeType})`
      : buildSolutionCoverPrompt({
          title: record.title,
          category: record.category,
          shortDescription: record.shortDescription,
          slug: record.slug,
        });

  await updateCoverInDatabase(record, publicUrl, storagePath, alt, prompt);

  return {
    entityType: record.entityType,
    id: record.id,
    slug: record.slug,
    publicUrl,
    storagePath,
    alt,
    prompt,
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

export async function fetchBitpCoverRecords(onlyMissing = true): Promise<CoverRecord[]> {
  const supabase = getCoverAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('products')
    .select(
      'id, slug, name, short_description, product_type, cover_image, thumbnail, cover_image_path, status, category:categories(name, slug)'
    )
    .eq('status', 'published');

  if (error) {
    console.error('[solution-cover] fetchBitpCoverRecords', error.message);
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('products')
      .select(
        'id, slug, name, short_description, product_type, cover_image, thumbnail, status, category:categories(name, slug)'
      )
      .eq('status', 'published');

    if (fallbackError) {
      console.error('[solution-cover] fetchBitpCoverRecords fallback', fallbackError.message);
      return [];
    }

    return (fallbackData ?? [])
      .filter((row) => {
        if (!onlyMissing) return true;
        return !hasValidSolutionCover(row.cover_image as string, null);
      })
      .map((row) => {
        const cat = Array.isArray(row.category) ? row.category[0] : row.category;
        return {
          entityType: 'bitp' as const,
          id: row.id as string,
          slug: row.slug as string,
          title: row.name as string,
          category: (cat as { name?: string })?.name ?? null,
          shortDescription: row.short_description as string | null,
          productType: row.product_type as string,
          coverUrl: row.cover_image as string | null,
          coverPath: null,
        };
      });
  }

  return (data ?? [])
    .filter((row) => {
      if (!onlyMissing) return true;
      return !hasValidSolutionCover(row.cover_image as string, row.cover_image_path as string);
    })
    .map((row) => {
      const cat = Array.isArray(row.category) ? row.category[0] : row.category;
      return {
        entityType: 'bitp' as const,
        id: row.id as string,
        slug: row.slug as string,
        title: row.name as string,
        category: (cat as { name?: string })?.name ?? null,
        shortDescription: row.short_description as string | null,
        productType: row.product_type as string,
        coverUrl: row.cover_image as string | null,
        coverPath: row.cover_image_path as string | null,
      };
    });
}

export async function fetchMarketplaceServiceCoverRecords(
  onlyMissing = true
): Promise<CoverRecord[]> {
  const supabase = getCoverAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('marketplace_services')
    .select(
      'id, slug, title, short_description, thumbnail_type, thumbnail_url, cover_image_path, marketplace_categories(name, slug)'
    );

  if (error) {
    console.error('[solution-cover] fetchMarketplaceServiceCoverRecords', error.message);
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('marketplace_services')
      .select(
        'id, slug, title, short_description, thumbnail_type, thumbnail_url, marketplace_categories(name, slug)'
      );

    if (fallbackError) {
      console.error('[solution-cover] fetchMarketplaceServiceCoverRecords fallback', fallbackError.message);
      return [];
    }

    return (fallbackData ?? [])
      .filter((row) => {
        if (!onlyMissing) return true;
        const url = row.thumbnail_url as string | null;
        const type = row.thumbnail_type as string;
        if (hasValidSolutionCover(url, null)) return false;
        if (type === 'image' && url && !url.startsWith('/')) return false;
        return true;
      })
      .map((row) => {
        const cat = Array.isArray(row.marketplace_categories)
          ? row.marketplace_categories[0]
          : row.marketplace_categories;
        return {
          entityType: 'marketplace-service' as const,
          id: row.id as string,
          slug: row.slug as string,
          title: row.title as string,
          category: (cat as { name?: string })?.name ?? null,
          shortDescription: row.short_description as string | null,
          coverUrl: row.thumbnail_url as string | null,
          coverPath: null,
        };
      });
  }

  return (data ?? [])
    .filter((row) => {
      if (!onlyMissing) return true;
      const url = row.thumbnail_url as string | null;
      const path = row.cover_image_path as string | null;
      const type = row.thumbnail_type as string;
      if (hasValidSolutionCover(url, path)) return false;
      if (type === 'image' && url && !url.startsWith('/')) return false;
      return true;
    })
    .map((row) => {
      const cat = Array.isArray(row.marketplace_categories)
        ? row.marketplace_categories[0]
        : row.marketplace_categories;
      return {
        entityType: 'marketplace-service' as const,
        id: row.id as string,
        slug: row.slug as string,
        title: row.title as string,
        category: (cat as { name?: string })?.name ?? null,
        shortDescription: row.short_description as string | null,
        coverUrl: row.thumbnail_url as string | null,
        coverPath: row.cover_image_path as string | null,
      };
    });
}

export async function fetchMarketplaceProductCoverRecords(
  onlyMissing = true
): Promise<CoverRecord[]> {
  const supabase = getCoverAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('marketplace_products')
    .select(
      'id, slug, name, short_description, thumbnail_url, cover_image_path, marketplace_product_categories(name, slug)'
    );

  if (error) {
    console.error('[solution-cover] fetchMarketplaceProductCoverRecords', error.message);
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('marketplace_products')
      .select(
        'id, slug, name, short_description, thumbnail_url, marketplace_product_categories(name, slug)'
      );

    if (fallbackError) {
      console.error('[solution-cover] fetchMarketplaceProductCoverRecords fallback', fallbackError.message);
      return [];
    }

    return (fallbackData ?? [])
      .filter((row) => {
        if (!onlyMissing) return true;
        return !hasValidSolutionCover(row.thumbnail_url as string, null);
      })
      .map((row) => {
        const cat = Array.isArray(row.marketplace_product_categories)
          ? row.marketplace_product_categories[0]
          : row.marketplace_product_categories;
        return {
          entityType: 'marketplace-product' as const,
          id: row.id as string,
          slug: row.slug as string,
          title: row.name as string,
          category: (cat as { name?: string })?.name ?? null,
          shortDescription: row.short_description as string | null,
          coverUrl: row.thumbnail_url as string | null,
          coverPath: null,
        };
      });
  }

  return (data ?? [])
    .filter((row) => {
      if (!onlyMissing) return true;
      return !hasValidSolutionCover(
        row.thumbnail_url as string,
        row.cover_image_path as string
      );
    })
    .map((row) => {
      const cat = Array.isArray(row.marketplace_product_categories)
        ? row.marketplace_product_categories[0]
        : row.marketplace_product_categories;
      return {
        entityType: 'marketplace-product' as const,
        id: row.id as string,
        slug: row.slug as string,
        title: row.name as string,
        category: (cat as { name?: string })?.name ?? null,
        shortDescription: row.short_description as string | null,
        coverUrl: row.thumbnail_url as string | null,
        coverPath: row.cover_image_path as string | null,
      };
    });
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

async function runWithConcurrency<T>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<void>
): Promise<void> {
  let index = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (index < items.length) {
      const current = items[index++];
      await fn(current);
    }
  });
  await Promise.all(workers);
}

export async function bulkGenerateCovers(options: {
  entityTypes?: CoverEntityType[];
  onlyMissing?: boolean;
  concurrency?: number;
  onProgress?: (progress: BulkCoverProgress) => void;
}): Promise<BulkCoverProgress> {
  const {
    entityTypes = ['bitp', 'marketplace-service', 'marketplace-product'],
    onlyMissing = true,
    concurrency = 2,
    onProgress,
  } = options;

  const records: CoverRecord[] = [];

  if (entityTypes.includes('bitp')) {
    records.push(...(await fetchBitpCoverRecords(onlyMissing)));
  }
  if (entityTypes.includes('marketplace-service')) {
    records.push(...(await fetchMarketplaceServiceCoverRecords(onlyMissing)));
  }
  if (entityTypes.includes('marketplace-product')) {
    records.push(...(await fetchMarketplaceProductCoverRecords(onlyMissing)));
  }

  const progress: BulkCoverProgress = {
    total: records.length,
    generated: 0,
    failed: 0,
    remaining: records.length,
    results: [],
    errors: [],
  };

  const report = () => {
    progress.remaining = progress.total - progress.generated - progress.failed;
    onProgress?.({ ...progress });
  };

  await runWithConcurrency(records, concurrency, async (record) => {
    try {
      const result = await generateAndStoreCover(record);
      progress.results.push(result);
      progress.generated += 1;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      progress.errors.push({
        entityType: record.entityType,
        id: record.id,
        slug: record.slug,
        error: message,
      });
      progress.failed += 1;
      console.error(`[solution-cover] failed for ${record.slug}`, message);
    }
    report();
  });

  progress.remaining = 0;
  report();
  return progress;
}

export type { CoverGenerationResult, CoverGenerationError, BulkCoverProgress, CoverRecord };
