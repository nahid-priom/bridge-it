import { Suspense } from 'react';
import Link from 'next/link';
import { buildPageMetadata } from '@/lib/metadata';
import { requireSeller } from '@/lib/auth/require-seller';
import { hasUnreadSellerApprovalNotification } from '@/lib/auth/load-marketplace-access';
import {
  getSellerDashboardOrders,
  getSellerDashboardStats,
  getSellerDashboardReviews,
  getSellerDashboardConversations,
  getSellerProfileSnapshot,
  getSellerSetupSnapshot,
} from '@/lib/db/seller-dashboard';
import { formatCurrency } from '@/types/admin';
import { ROUTES } from '@/lib/routes';
import { SellerSetupProgress } from '@/components/seller-dashboard/SellerSetupProgress';
import { SellerKpiCards } from '@/components/seller-dashboard/SellerKpiCards';
import { SellerProfileSummary } from '@/components/seller-dashboard/SellerProfileSummary';
import { SellerDashboardActivation } from '@/components/seller/SellerDashboardActivation';

export const metadata = buildPageMetadata({
  title: 'Seller Dashboard',
  path: '/seller-dashboard',
  noIndex: true,
});

export default async function SellerDashboardOverviewPage() {
  const profile = await requireSeller();
  const [statsRes, ordersRes, setupRes, sellerProfileRes, reviewsRes, convosRes, showCelebration] =
    await Promise.all([
      getSellerDashboardStats(),
      getSellerDashboardOrders(8),
      getSellerSetupSnapshot(),
      getSellerProfileSnapshot(),
      getSellerDashboardReviews(),
      getSellerDashboardConversations(),
      hasUnreadSellerApprovalNotification(profile.id),
    ]);

  const stats = statsRes.data;
  const orders = ordersRes.data;
  const setup = setupRes.data;
  const sellerProfile = sellerProfileRes.data;
  const reviews = reviewsRes.data.slice(0, 3);
  const conversations = convosRes.data.slice(0, 4);

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <SellerDashboardActivation showCelebration={showCelebration} />
      </Suspense>

      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-display text-text-primary">
          Seller control center
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Welcome back, {profile.full_name ?? 'Seller'}. Manage orders, earnings, and growth in one place.
        </p>
      </div>

      {sellerProfile && <SellerProfileSummary profile={sellerProfile} />}

      <SellerSetupProgress percent={setup.percent} completedIds={setup.completedIds} compact />

      <SellerKpiCards stats={stats} />

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border-subtle bg-surface/80 overflow-hidden">
          <div className="px-5 py-4 border-b border-border-subtle flex justify-between items-center">
            <h2 className="font-bold text-text-primary">Active orders</h2>
            <Link href={ROUTES.sellerDashboardOrders} className="text-xs font-semibold text-deshi-green hover:underline">
              View all
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="p-6 text-sm text-text-secondary">No orders yet. New buyer orders appear here in real time.</p>
          ) : (
            <ul className="divide-y divide-border-subtle">
              {orders.map((o) => (
                <li key={o.id} className="px-5 py-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-text-primary">{o.title}</p>
                    <p className="text-xs text-text-secondary">
                      {o.orderNumber} · {o.buyerLabel}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-text-primary">{formatCurrency(o.amount)}</p>
                    <p className="text-xs capitalize text-bridge-primary">{o.status.replace('_', ' ')}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border-subtle bg-surface/80 overflow-hidden">
          <div className="px-5 py-4 border-b border-border-subtle flex justify-between items-center">
            <h2 className="font-bold text-text-primary">Messages</h2>
            <Link href={ROUTES.sellerDashboardMessages} className="text-xs font-semibold text-deshi-green hover:underline">
              Inbox
            </Link>
          </div>
          {conversations.length === 0 ? (
            <p className="p-6 text-sm text-text-secondary">No buyer conversations yet.</p>
          ) : (
            <ul className="divide-y divide-border-subtle">
              {conversations.map((c) => (
                <li key={c.id} className="px-5 py-3 flex justify-between gap-2">
                  <div>
                    <p className="font-medium text-text-primary">{c.subject ?? c.buyerLabel}</p>
                    <p className="text-xs text-text-secondary">{c.buyerLabel}</p>
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="text-xs font-bold bg-deshi-green text-white px-2 py-0.5 rounded-full h-fit">
                      {c.unreadCount}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-border-subtle bg-surface/80 p-5">
          <h2 className="font-bold text-text-primary mb-3">Revenue overview</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-emerald-500/10 p-4">
              <p className="text-xs text-text-secondary">Available</p>
              <p className="text-xl font-black mt-1">{formatCurrency(stats.walletBalance)}</p>
            </div>
            <div className="rounded-xl bg-blue-500/10 p-4">
              <p className="text-xs text-text-secondary">Pending</p>
              <p className="text-xl font-black mt-1">{formatCurrency(stats.pendingBalance)}</p>
            </div>
            <div className="rounded-xl bg-slate-500/10 p-4">
              <p className="text-xs text-text-secondary">Total earned</p>
              <p className="text-xl font-black mt-1">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
          <Link
            href={ROUTES.sellerDashboardAnalytics}
            className="inline-block mt-4 text-sm font-semibold text-deshi-green hover:underline"
          >
            Open analytics →
          </Link>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-surface/80 overflow-hidden">
          <div className="px-5 py-4 border-b border-border-subtle">
            <h2 className="font-bold text-text-primary">Recent reviews</h2>
          </div>
          {reviews.length === 0 ? (
            <p className="p-5 text-sm text-text-secondary">Reviews from buyers appear here.</p>
          ) : (
            <ul className="divide-y divide-border-subtle">
              {reviews.map((r) => (
                <li key={r.id} className="px-5 py-3">
                  <p className="text-sm font-semibold">{r.clientName} · {r.rating}★</p>
                  <p className="text-xs text-text-secondary line-clamp-2 mt-1">{r.reviewText}</p>
                </li>
              ))}
            </ul>
          )}
          <div className="px-5 py-3 border-t border-border-subtle">
            <Link href={ROUTES.sellerDashboardReviews} className="text-xs font-semibold text-deshi-green hover:underline">
              All reviews
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-blue-500/30 bg-gradient-to-r from-blue-500/5 to-emerald-500/5 p-5">
        <h3 className="font-bold text-text-primary">Growth tips</h3>
        <ul className="mt-2 space-y-1 text-sm text-text-secondary list-disc list-inside">
          <li>Respond to messages within 1 hour to improve your response rate.</li>
          <li>Publish at least one service and one product to appear in more searches.</li>
          <li>Add portfolio work to build trust with new buyers.</li>
        </ul>
      </div>
    </div>
  );
}
