import Link from 'next/link';
import { buildPageMetadata } from '@/lib/metadata';
import { BitpOrdersTable } from '@/components/client-dashboard/BitpOrdersTable';
import { getBitpClientOrders } from '@/lib/services/dashboard.service';
import { requireAuth } from '@/lib/auth/require-auth';
import { ROUTES } from '@/lib/routes';
import { listWebsiteOrdersForUser } from '@/src/features/ecommerce-showcase/api/orders';
import { WebsiteOrdersTable } from '@/src/features/ecommerce-showcase/public/WebsiteOrdersTable';

export const metadata = buildPageMetadata({
  title: 'Orders | Bridge IT Park',
  path: '/dashboard/orders',
  noIndex: true,
});

type Props = { searchParams: Promise<{ placed?: string }> };

export default async function ClientOrdersPage({ searchParams }: Props) {
  const profile = await requireAuth('/dashboard/orders');
  const { placed } = await searchParams;
  const [serviceOrders, websiteOrders] = await Promise.all([
    getBitpClientOrders(),
    listWebsiteOrdersForUser(profile.id),
  ]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Orders</h1>
          <p className="mt-1 text-sm text-text-muted">Website package orders and other service orders.</p>
        </div>
        <Link
          href={ROUTES.websites}
          className="deshi-btn-primary inline-flex items-center justify-center px-5 py-2.5 text-sm"
        >
          Order a website
        </Link>
      </div>

      {placed ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
          Order placed. We will contact you shortly to start your website.
        </p>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Website orders</h2>
        <WebsiteOrdersTable orders={websiteOrders} placedId={placed} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Service orders</h2>
        <BitpOrdersTable orders={serviceOrders} />
      </section>
    </div>
  );
}
