import { BadgeCheck } from 'lucide-react';
import type { Product, ProductReview } from '@/types/product';
import { getAverageRating, getRatingDistribution } from '@/lib/products/reviews';
import { ProductStars } from './ProductStars';
interface ProductReviewsProps {
  product: Product;
  reviews: ProductReview[];
}

function ReviewerAvatar({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase();
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-bridge-primary to-bridge-secondary text-sm font-bold text-white"
      aria-hidden
    >
      {initial}
    </div>
  );
}

export function ProductReviews({ product, reviews }: ProductReviewsProps) {
  const average = reviews.length > 0 ? getAverageRating(reviews) : product.rating;
  const total = reviews.length > 0 ? reviews.length : product.reviews;
  const distribution = getRatingDistribution(reviews);
  const maxCount = Math.max(1, ...Object.values(distribution));

  return (
    <section aria-labelledby="customer-reviews-heading" className="scroll-mt-24">
      <h2 id="customer-reviews-heading" className="text-xl md:text-2xl font-bold font-display text-text-primary mb-6">
        Customer Reviews
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 mb-8">
        <div className="rounded-2xl border border-border-subtle bg-surface/80 p-6">
          <p className="text-4xl font-bold text-text-primary tabular-nums">{average}</p>
          <ProductStars rating={average} className="mt-2" label={`Average rating ${average} out of 5`} />
          <p className="text-sm text-text-muted mt-2">{total} reviews</p>
          <div className="mt-6 space-y-2">
            {([5, 4, 3, 2, 1] as const).map((star) => {
              const count = distribution[star];
              const pct = Math.round((count / maxCount) * 100);
              return (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-8 text-text-muted">{star}★</span>
                  <div className="flex-1 h-2 rounded-full bg-background-soft overflow-hidden">
                    <div
                      className="h-full rounded-full bg-bridge-primary/70"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-text-muted tabular-nums">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-subtle bg-surface/40 px-6 py-12 text-center">
            <p className="text-text-secondary font-medium">No reviews yet for this service.</p>
            <p className="text-sm text-text-muted mt-2">Be the first to share your experience after ordering.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li
                key={review.id}
                className="rounded-2xl border border-border-subtle bg-surface/80 p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <ReviewerAvatar name={review.reviewerName} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-text-primary text-sm">{review.reviewerName}</span>
                      {review.verified && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-bridge-primary">
                          <BadgeCheck className="w-3.5 h-3.5" aria-hidden />
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted mb-2">
                      <ProductStars rating={review.rating} size="sm" />
                      <time dateTime={review.date}>{review.date}</time>
                    </div>
                    <h3 className="text-sm font-semibold text-text-primary mb-2">{review.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{review.comment}</p>
                    {review.helpfulCount != null && review.helpfulCount > 0 && (
                      <p className="text-xs text-text-muted mt-3">
                        {review.helpfulCount} people found this helpful
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
