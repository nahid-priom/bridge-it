import { buildPageMetadata } from '@/lib/metadata';
import { DashboardCard } from '@/components/client-dashboard/ui/DashboardCard';
import { StatusBadge } from '@/components/client-dashboard/ui/StatusBadge';
import { getClientPurchasedServicesData } from '@/lib/db/client-dashboard';

export const metadata = buildPageMetadata({
  title: 'Purchased Services',
  description: 'Active service orders and delivery timelines.',
  path: '/dashboard/services',
  noIndex: true,
});

export default async function ClientServicesPage() {
  const services = await getClientPurchasedServicesData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Purchased Services</h1>
        <p className="text-sm text-text-muted mt-1">Track revisions, deliverables, and milestones.</p>
      </div>
      {services.length === 0 ? (
        <p className="text-sm text-text-muted">No service orders yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {services.map((s) => (
            <DashboardCard key={s.id} hover className="p-5">
              <h3 className="font-semibold text-text-primary">{s.title}</h3>
              <p className="text-xs text-text-muted mb-3">{s.sellerName}</p>
              <StatusBadge status={s.status} />
              <p className="text-xs text-text-muted mt-3">Due {s.dueDate}</p>
            </DashboardCard>
          ))}
        </div>
      )}
    </div>
  );
}
