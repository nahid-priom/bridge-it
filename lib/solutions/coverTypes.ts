export type CoverEntityType = 'bitp' | 'marketplace-service' | 'marketplace-product';

export type CoverRecord = {
  entityType: CoverEntityType;
  id: string;
  slug: string;
  title: string;
  category?: string | null;
  shortDescription?: string | null;
  features?: string[];
  productType?: string | null;
  coverUrl?: string | null;
  coverPath?: string | null;
};

export type CoverGenerationResult = {
  entityType: CoverEntityType;
  id: string;
  slug: string;
  publicUrl: string;
  storagePath: string;
  alt: string;
  prompt: string;
};

export type CoverGenerationError = {
  entityType: CoverEntityType;
  id: string;
  slug: string;
  error: string;
};

export type BulkCoverProgress = {
  total: number;
  generated: number;
  failed: number;
  remaining: number;
  results: CoverGenerationResult[];
  errors: CoverGenerationError[];
};

export function getCoverStoragePath(entityType: CoverEntityType, id: string): string {
  switch (entityType) {
    case 'bitp':
      return `bitp/${id}/cover.webp`;
    case 'marketplace-service':
      return `marketplace/services/${id}/cover.webp`;
    case 'marketplace-product':
      return `marketplace/products/${id}/cover.webp`;
  }
}

export function resolveCoverDisplayUrl(
  coverUrl: string | null | undefined,
  coverPath: string | null | undefined,
  supabaseUrl?: string
): string | null {
  if (coverUrl?.trim() && !coverUrl.startsWith('/showroom/covers/')) {
    return coverUrl;
  }
  if (coverPath?.trim() && supabaseUrl) {
    return `${supabaseUrl}/storage/v1/object/public/solution-covers/${coverPath}`;
  }
  return coverUrl ?? null;
}
