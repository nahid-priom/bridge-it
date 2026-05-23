import type { ProductReview } from '@/types/product';

export function getAverageRating(reviews: ProductReview[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

export function getRatingDistribution(reviews: ProductReview[]): Record<1 | 2 | 3 | 4 | 5, number> {
  const starCounts: Record<1 | 2 | 3 | 4 | 5, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const r of reviews) {
    const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    starCounts[star] += 1;
  }
  return starCounts;
}
