import 'server-only';

import { getAdminClient, getServerClient } from '@/lib/services/client';
import {
  type CatalogProductReview,
  type CatalogReviewKind,
} from '../types/reviews';

export type { CatalogProductReview, CatalogReviewKind };

function mapReview(row: Record<string, unknown>): CatalogProductReview {
  return {
    id: String(row.id),
    kind: row.kind === 'websites' ? 'websites' : 'software',
    product_id: String(row.product_id),
    client_name: String(row.client_name),
    company_name: (row.company_name as string | null) ?? null,
    rating: Number(row.rating ?? 0),
    review: String(row.review ?? ''),
    approved: Boolean(row.approved),
    featured: Boolean(row.featured),
    created_at: String(row.created_at ?? ''),
  };
}

export async function listApprovedReviews(
  kind: CatalogReviewKind,
  productId: string,
  limit = 12
): Promise<CatalogProductReview[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('catalog_product_reviews')
    .select('id, kind, product_id, client_name, company_name, rating, review, approved, featured, created_at')
    .eq('kind', kind)
    .eq('product_id', productId)
    .eq('approved', true)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[catalog-reviews] listApprovedReviews', error.message);
    return [];
  }

  return (data ?? []).map((row) => mapReview(row as Record<string, unknown>));
}

export async function submitCatalogReview(input: {
  kind: CatalogReviewKind;
  productId: string;
  clientName: string;
  companyName?: string;
  rating: number;
  review: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const name = input.clientName.trim();
  const text = input.review.trim();
  const rating = Math.round(input.rating);

  if (!name || name.length < 2) return { ok: false, error: 'Please enter your name.' };
  if (!text || text.length < 10) {
    return { ok: false, error: 'Please write a short review (at least 10 characters).' };
  }
  if (rating < 1 || rating > 5) return { ok: false, error: 'Rating must be between 1 and 5.' };
  if (input.kind !== 'software' && input.kind !== 'websites') {
    return { ok: false, error: 'Invalid product type.' };
  }

  const supabase = await getServerClient();
  if (!supabase) return { ok: false, error: 'Service unavailable.' };

  const table = input.kind === 'software' ? 'software_projects' : 'ecommerce_projects';
  const { data: product, error: productError } = await supabase
    .from(table)
    .select('id')
    .eq('id', input.productId)
    .eq('published', true)
    .is('deleted_at', null)
    .maybeSingle();

  if (productError || !product) {
    return { ok: false, error: 'Product not found.' };
  }

  const { error } = await supabase.from('catalog_product_reviews').insert({
    kind: input.kind,
    product_id: input.productId,
    client_name: name.slice(0, 80),
    company_name: input.companyName?.trim().slice(0, 120) || null,
    rating,
    review: text.slice(0, 2000),
    approved: false,
    featured: false,
  });

  if (error) {
    console.error('[catalog-reviews] submitCatalogReview', error.message);
    return { ok: false, error: 'Could not submit review. Please try again.' };
  }

  await recomputeProductRating(input.kind, input.productId);
  return { ok: true };
}

export async function recomputeProductRating(
  kind: CatalogReviewKind,
  productId: string
): Promise<void> {
  const admin = await getAdminClient();
  if (!admin) return;

  const { data, error } = await admin
    .from('catalog_product_reviews')
    .select('rating')
    .eq('kind', kind)
    .eq('product_id', productId)
    .eq('approved', true);

  if (error) {
    console.error('[catalog-reviews] recomputeProductRating', error.message);
    return;
  }

  const ratings = (data ?? []).map((row) => Number(row.rating)).filter((n) => n >= 1 && n <= 5);
  const table = kind === 'software' ? 'software_projects' : 'ecommerce_projects';

  if (ratings.length === 0) return;

  const avg = Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10;
  const { error: updateError } = await admin
    .from(table)
    .update({
      rating_avg: avg,
      review_count: ratings.length,
      updated_at: new Date().toISOString(),
    })
    .eq('id', productId);

  if (updateError) {
    console.error('[catalog-reviews] recompute update', updateError.message);
  }
}

export { fallbackRatingFromSlug } from '../types/reviews';
