export type CatalogReviewKind = 'software' | 'websites';

export type CatalogProductReview = {
  id: string;
  kind: CatalogReviewKind;
  product_id: string;
  client_name: string;
  company_name: string | null;
  rating: number;
  review: string;
  approved: boolean;
  featured: boolean;
  created_at: string;
};

/** Stable display rating when DB columns are missing (pre-migration). */
export function fallbackRatingFromSlug(slug: string): { rating_avg: number; review_count: number } {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  const rating_avg = Math.round((4.5 + (hash % 6) * 0.1) * 10) / 10;
  const review_count = 3 + (hash % 4);
  return { rating_avg, review_count };
}
