'use client';

import { useState, useTransition } from 'react';
import { cn, focusVisibleInput, focusVisibleRing } from '@/lib/cn';
import type { CatalogProductReview, CatalogReviewKind } from '../types/reviews';
import { StarRating } from './StarRating';

export function ProductReviews({
  kind,
  productId,
  ratingAvg,
  reviewCount,
  initialReviews,
}: {
  kind: CatalogReviewKind;
  productId: string;
  ratingAvg: number;
  reviewCount: number;
  initialReviews: CatalogProductReview[];
}) {
  const [reviews] = useState(initialReviews);
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const res = await fetch('/api/catalog/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind,
          productId,
          clientName,
          companyName,
          rating,
          review,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
      if (!res.ok) {
        setError(data.error || 'Could not submit review.');
        return;
      }
      setSuccess(data.message || 'Thanks — your review is pending approval.');
      setClientName('');
      setCompanyName('');
      setReview('');
      setRating(5);
    });
  };

  return (
    <section className="mt-10 max-w-3xl lg:mt-14" aria-labelledby="product-reviews-heading">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="product-reviews-heading"
            className="font-display text-xl font-black text-text-primary md:text-2xl"
          >
            Customer reviews
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            Real feedback from businesses exploring this solution.
          </p>
        </div>
        <StarRating rating={ratingAvg} reviewCount={reviewCount} size="md" />
      </div>

      {reviews.length > 0 ? (
        <ul className="space-y-3">
          {reviews.map((item) => (
            <li
              key={item.id}
              className="rounded-2xl border border-border-subtle bg-surface px-4 py-3.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-text-primary">{item.client_name}</p>
                  {item.company_name ? (
                    <p className="text-xs text-text-muted">{item.company_name}</p>
                  ) : null}
                </div>
                <StarRating rating={item.rating} showValue={false} />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.review}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-border-subtle px-4 py-6 text-sm text-text-secondary">
          Be the first to leave a review for this product.
        </p>
      )}

      <form
        onSubmit={onSubmit}
        className="mt-6 space-y-3 rounded-2xl border border-border-subtle bg-surface p-4 sm:p-5"
      >
        <h3 className="font-display text-base font-bold text-text-primary">Write a review</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="review-name" className="mb-1 block text-xs font-semibold text-text-secondary">
              Your name
            </label>
            <input
              id="review-name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
              className={cn(focusVisibleInput, 'h-10 w-full rounded-xl border border-border-subtle bg-background px-3 text-sm')}
            />
          </div>
          <div>
            <label htmlFor="review-company" className="mb-1 block text-xs font-semibold text-text-secondary">
              Company (optional)
            </label>
            <input
              id="review-company"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className={cn(focusVisibleInput, 'h-10 w-full rounded-xl border border-border-subtle bg-background px-3 text-sm')}
            />
          </div>
        </div>
        <fieldset>
          <legend className="mb-1 text-xs font-semibold text-text-secondary">Rating</legend>
          <div className="flex flex-wrap gap-2">
            {[5, 4, 3, 2, 1].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className={cn(
                  focusVisibleRing,
                  'rounded-lg border px-3 py-1.5 text-sm font-semibold',
                  rating === value
                    ? 'border-[#2563eb] bg-[#2563eb]/10 text-[#1d4ed8]'
                    : 'border-border-subtle text-text-secondary hover:bg-background-soft'
                )}
              >
                {value}★
              </button>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor="review-text" className="mb-1 block text-xs font-semibold text-text-secondary">
            Your review
          </label>
          <textarea
            id="review-text"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
            rows={4}
            className={cn(
              focusVisibleInput,
              'w-full rounded-xl border border-border-subtle bg-background px-3 py-2 text-sm'
            )}
          />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? <p className="text-sm text-emerald-700 dark:text-emerald-400">{success}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className={cn(
            focusVisibleRing,
            'inline-flex h-10 items-center justify-center rounded-xl bg-[#2563eb] px-4 text-sm font-semibold text-white hover:bg-[#1d4ed8] disabled:opacity-60'
          )}
        >
          {pending ? 'Submitting…' : 'Submit review'}
        </button>
      </form>
    </section>
  );
}
