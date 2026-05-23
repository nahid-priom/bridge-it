'use client';

import { Star } from 'lucide-react';
import type { MarketplaceSellerReview } from '@/types/marketplaceSeller';
import { SellerAvatar } from '@/components/search/SellerAvatar';

type SellerReviewsProps = {
  reviews: MarketplaceSellerReview[];
};

export function SellerReviews({ reviews }: SellerReviewsProps) {
  if (reviews.length === 0) {
    return <p className="text-sm text-text-muted">No reviews yet.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <article
          key={review.id}
          className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-900/80 p-5 shadow-sm"
        >
          <div className="flex items-start gap-3 mb-3">
            <SellerAvatar name={review.clientName} size="md" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-bold text-text-primary text-sm">{review.clientName}</p>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < Math.round(review.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                      aria-hidden
                    />
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-text-muted">
                {review.clientCountry}
                {review.projectTitle && ` · ${review.projectTitle}`}
                {review.createdAt && ` · ${review.createdAt}`}
              </p>
            </div>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">{review.reviewText}</p>
        </article>
      ))}
    </div>
  );
}
