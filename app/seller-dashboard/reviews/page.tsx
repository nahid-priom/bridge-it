import { buildPageMetadata } from '@/lib/metadata';
import { getSellerDashboardReviews, getSellerDashboardStats } from '@/lib/db/seller-dashboard';
import { BrandedEmptyState } from '@/components/ui/BrandedEmptyState';
import { ROUTES } from '@/lib/routes';

export const metadata = buildPageMetadata({
  title: 'Seller Reviews',
  path: '/seller-dashboard/reviews',
  noIndex: true,
});

export default async function SellerReviewsPage() {
  const [reviewsRes, statsRes] = await Promise.all([
    getSellerDashboardReviews(),
    getSellerDashboardStats(),
  ]);
  const reviews = reviewsRes.data;
  const stats = statsRes.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black font-display text-text-primary">Reviews</h1>
        <p className="text-sm text-text-secondary mt-1">
          {stats.rating.toFixed(1)} average · {stats.totalReviews} total reviews
        </p>
      </div>

      {reviews.length === 0 ? (
        <BrandedEmptyState
          title="No reviews yet"
          description="Deliver great work — buyer reviews from marketplace_seller_reviews appear here."
          actionLabel="View orders"
          actionHref={ROUTES.sellerDashboardOrders}
        />
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-2xl border border-border-subtle bg-surface/80 p-5">
              <div className="flex justify-between gap-2">
                <div>
                  <p className="font-bold text-text-primary">{r.clientName}</p>
                  <p className="text-xs text-text-secondary">{r.clientCountry}</p>
                </div>
                <span className="text-amber-600 font-black">{r.rating}★</span>
              </div>
              {r.projectTitle && (
                <p className="text-xs text-blue-600 mt-2 font-semibold">{r.projectTitle}</p>
              )}
              <p className="text-sm text-text-secondary mt-2">{r.reviewText}</p>
              <p className="text-xs text-text-muted mt-2">{r.createdAt}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
