import Link from 'next/link';
import { buildPageMetadata } from '@/lib/metadata';
import { getSellerDashboardStats, getSellerDashboardPayouts } from '@/lib/db/seller-dashboard';
import { formatCurrency } from '@/types/admin';
import { ROUTES } from '@/lib/routes';
import { BrandedEmptyState } from '@/components/ui/BrandedEmptyState';

export const metadata = buildPageMetadata({
  title: 'Seller Earnings',
  path: '/seller-dashboard/earnings',
  noIndex: true,
});

export default async function SellerEarningsPage() {
  const [statsRes, payoutsRes] = await Promise.all([
    getSellerDashboardStats(),
    getSellerDashboardPayouts(),
  ]);
  const stats = statsRes.data;
  const payouts = payoutsRes.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black font-display text-text-primary">Earnings</h1>
        <p className="text-sm text-text-secondary mt-1">Revenue, clearance, and withdrawal history.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Available', value: formatCurrency(stats.walletBalance) },
          { label: 'Pending clearance', value: formatCurrency(stats.pendingClearance) },
          { label: 'Total revenue', value: formatCurrency(stats.totalRevenue) },
          { label: 'This month', value: formatCurrency(stats.earningsThisMonth) },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-border-subtle bg-surface/80 p-6">
            <p className="text-xs font-semibold uppercase text-text-secondary">{card.label}</p>
            <p className="text-2xl font-black mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={ROUTES.sellerDashboardWallet}
          className="text-sm font-semibold text-deshi-green hover:underline"
        >
          Seller wallet →
        </Link>
        <Link
          href={ROUTES.sellerDashboardPayouts}
          className="text-sm font-semibold text-deshi-green hover:underline"
        >
          Payout methods →
        </Link>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-surface/80 overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle">
          <h2 className="font-bold text-text-primary">Recent withdrawals</h2>
        </div>
        {payouts.length === 0 ? (
          stats.totalRevenue <= 0 ? (
            <div className="p-4">
              <BrandedEmptyState
                title="Start selling to earn"
                description="Complete orders — earnings appear here and in your seller wallet."
                actionLabel="View orders"
                actionHref={ROUTES.sellerDashboardOrders}
              />
            </div>
          ) : (
            <p className="p-6 text-sm text-text-secondary">No withdrawals yet. Add a payout method to withdraw.</p>
          )
        ) : (
          <ul className="divide-y divide-border-subtle">
            {payouts.map((p) => (
              <li key={p.id} className="px-5 py-4 flex justify-between gap-4">
                <div>
                  <p className="font-semibold">{formatCurrency(p.amount)}</p>
                  <p className="text-xs text-text-secondary capitalize">{p.payoutMethod ?? 'Payout'}</p>
                </div>
                <span className="text-xs font-bold capitalize px-2 py-1 rounded-full bg-slate-100 dark:bg-white/10">
                  {p.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
