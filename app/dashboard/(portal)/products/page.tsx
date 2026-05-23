import { buildPageMetadata } from '@/lib/metadata';
import { DashboardCard } from '@/components/client-dashboard/ui/DashboardCard';
import { StatusBadge } from '@/components/client-dashboard/ui/StatusBadge';
import { getClientPurchasedProductsData } from '@/lib/db/client-dashboard';

export const metadata = buildPageMetadata({
  title: 'Purchased Products',
  description: 'Hardware, software, licenses, and delivery tracking.',
  path: '/dashboard/products',
  noIndex: true,
});

export default async function ClientProductsPage() {
  const products = await getClientPurchasedProductsData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Purchased Products</h1>
        <p className="text-sm text-text-muted mt-1">Licenses, warranties, and delivery tracking.</p>
      </div>
      {products.length === 0 ? (
        <p className="text-sm text-text-muted">No product orders yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <DashboardCard key={p.id} hover className="p-5">
              <div className="w-full h-28 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-white/10 dark:to-white/5 mb-4 flex items-center justify-center text-3xl">
                📦
              </div>
              <h3 className="font-semibold text-text-primary">{p.name}</h3>
              <p className="text-xs text-text-muted mb-3">{p.vendor}</p>
              <StatusBadge status={p.orderStatus} />
              {p.trackingId && (
                <p className="text-xs text-text-muted mt-3">Order: {p.trackingId}</p>
              )}
            </DashboardCard>
          ))}
        </div>
      )}
    </div>
  );
}
