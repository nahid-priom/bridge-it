import Link from 'next/link';
import { buildPageMetadata } from '@/lib/metadata';
import { getSellerDashboardOrders } from '@/lib/db/seller-dashboard';
import { formatCurrency } from '@/types/admin';
import { ROUTES } from '@/lib/routes';
import { BrandedEmptyState } from '@/components/ui/BrandedEmptyState';

export const metadata = buildPageMetadata({
  title: 'Seller Orders',
  path: '/seller-dashboard/orders',
  noIndex: true,
});

const STATUS_GROUPS = [
  { key: 'active', label: 'Active', statuses: ['pending', 'paid', 'in_progress', 'delivered'] },
  { key: 'completed', label: 'Completed', statuses: ['completed'] },
  { key: 'other', label: 'Other', statuses: ['disputed', 'refunded', 'cancelled'] },
] as const;

export default async function SellerOrdersPage() {
  const ordersRes = await getSellerDashboardOrders(100);
  const orders = ordersRes.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black font-display text-text-primary">Orders</h1>
        <p className="text-sm text-text-secondary mt-1">Manage deliveries, revisions, and milestones.</p>
      </div>

      {orders.length === 0 ? (
        <BrandedEmptyState
          title="No orders yet"
          description="When buyers purchase your services or products, orders sync from marketplace_orders."
          actionLabel="Create a service"
          actionHref={ROUTES.sellerDashboardServicesNew}
        />
      ) : (
        STATUS_GROUPS.map((group) => {
          const filtered = orders.filter((o) => group.statuses.includes(o.status as never));
          if (!filtered.length) return null;
          return (
            <section key={group.key} className="rounded-2xl border border-border-subtle bg-surface/80 overflow-hidden">
              <div className="px-5 py-3 border-b border-border-subtle bg-slate-50/50 dark:bg-white/[0.02]">
                <h2 className="font-bold text-text-primary">{group.label}</h2>
              </div>
              <ul className="divide-y divide-border-subtle">
                {filtered.map((o) => (
                  <li key={o.id} className="px-5 py-4 flex flex-wrap justify-between gap-4">
                    <div>
                      <p className="font-semibold text-text-primary">{o.title}</p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {o.orderNumber} · {o.buyerLabel}
                      </p>
                      {o.deliveryDate && (
                        <p className="text-xs text-blue-600 mt-1">Due: {o.deliveryDate}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(o.amount)}</p>
                      <p className="text-xs capitalize text-bridge-primary mt-0.5">{o.status.replace('_', ' ')}</p>
                      <Link
                        href={ROUTES.sellerDashboardMessages}
                        className="text-xs font-semibold text-deshi-green hover:underline mt-2 inline-block"
                      >
                        Message buyer
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })
      )}
    </div>
  );
}
