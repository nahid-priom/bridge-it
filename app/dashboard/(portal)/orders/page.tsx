import { buildPageMetadata } from '@/lib/metadata';
import { OrdersTable } from '@/components/client-dashboard/OrdersTable';
import { getClientOrdersData } from '@/lib/db/client-dashboard';

export const metadata = buildPageMetadata({
  title: 'Orders',
  description: 'Manage your marketplace orders.',
  path: '/dashboard/orders',
  noIndex: true,
});

export default async function ClientOrdersPage() {
  const orders = await getClientOrdersData();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Orders</h1>
        <p className="text-sm text-text-muted mt-1">Track services and product purchases.</p>
      </div>
      <OrdersTable orders={orders} />
    </div>
  );
}
