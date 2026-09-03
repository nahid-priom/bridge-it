import { requireShowcaseViewer } from '@/src/features/ecommerce-showcase/api/auth';
import { adminListWebsiteOrders } from '@/src/features/ecommerce-showcase/api/orders';
import { ShowcaseAdminShell } from '@/src/features/ecommerce-showcase/admin/ShowcaseAdminShell';
import { WebsiteOrderInbox } from '@/src/features/ecommerce-showcase/admin/WebsiteOrderInbox';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'Website orders',
  path: '/admin/ecommerce-orders',
  noIndex: true,
});

export default async function EcommerceWebsiteOrdersPage() {
  const profile = await requireShowcaseViewer();
  const orders = await adminListWebsiteOrders();
  return (
    <ShowcaseAdminShell profile={profile}>
      <WebsiteOrderInbox orders={orders} profile={profile} />
    </ShowcaseAdminShell>
  );
}
