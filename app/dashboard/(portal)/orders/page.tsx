import Link from 'next/link';
import { buildPageMetadata } from '@/lib/metadata';
import { BitpOrdersTable } from '@/components/client-dashboard/BitpOrdersTable';
import { getBitpClientOrders } from '@/lib/services/dashboard.service';
import { ROUTES } from '@/lib/routes';

export const metadata = buildPageMetadata({
  title: 'Orders | Bridge IT Park',
  path: '/dashboard/orders',
  noIndex: true,
});

export default async function ClientOrdersPage() {
  const orders = await getBitpClientOrders();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Orders</h1>
          <p className="text-sm text-text-muted mt-1">Track your service orders and requirements.</p>
        </div>
        <Link href={ROUTES.solutions} className="deshi-btn-primary px-5 py-2.5 text-sm inline-flex items-center justify-center">
          New Order
        </Link>
      </div>
      <BitpOrdersTable orders={orders} />
    </div>
  );
}
