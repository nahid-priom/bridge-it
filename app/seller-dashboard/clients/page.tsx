import { buildPageMetadata } from '@/lib/metadata';
import { getSellerDashboardClients } from '@/lib/db/seller-dashboard';
import { formatCurrency } from '@/types/admin';
import { BrandedEmptyState } from '@/components/ui/BrandedEmptyState';
import { ROUTES } from '@/lib/routes';

export const metadata = buildPageMetadata({
  title: 'Seller Clients',
  path: '/seller-dashboard/clients',
  noIndex: true,
});

export default async function SellerClientsPage() {
  const clientsRes = await getSellerDashboardClients();
  const clients = clientsRes.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black font-display text-text-primary">Clients</h1>
        <p className="text-sm text-text-secondary mt-1">Repeat buyers and top spenders on your gigs.</p>
      </div>

      {clients.length === 0 ? (
        <BrandedEmptyState
          title="No client history yet"
          description="As you complete orders, your top buyers and repeat clients appear here."
          actionLabel="View orders"
          actionHref={ROUTES.sellerDashboardOrders}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((c) => (
            <article
              key={c.id}
              className="rounded-2xl border border-border-subtle bg-surface/80 p-5"
            >
              <p className="font-bold text-text-primary">{c.clientName}</p>
              <p className="text-sm text-text-secondary mt-2">
                {c.orderCount} orders · {formatCurrency(c.totalSpent)} spent
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
