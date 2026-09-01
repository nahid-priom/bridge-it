import { notFound } from 'next/navigation';
import Link from 'next/link';
import { buildPageMetadata } from '@/lib/metadata';
import { getCurrentUser } from '@/lib/auth/get-current-user';
import { getOrderById, getOrderRequirements, getOrderStatusHistory } from '@/lib/services/orders.service';
import { getProjectByOrderId } from '@/lib/services/projects.service';
import { ProjectStageTimeline } from '@/components/client-dashboard/ProjectStageTimeline';
import { ROUTES } from '@/lib/routes';
import { formatBdt } from '@/lib/format/currency';
import { cn } from '@/lib/cn';

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  const order = user ? await getOrderById(id, user.id) : null;
  return buildPageMetadata({
    title: order ? `Order ${order.order_number}` : 'Order Details',
    path: `/dashboard/orders/${id}`,
    noIndex: true,
  });
}

const TIMELINE_STATUSES = [
  'pending',
  'requirements_submitted',
  'confirmed',
  'in_progress',
  'waiting_client',
  'completed',
];

export default async function ClientOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) notFound();

  const [order, requirements, history, project] = await Promise.all([
    getOrderById(id, user.id),
    getOrderRequirements(id),
    getOrderStatusHistory(id),
    getOrderById(id, user.id).then((o) => (o ? getProjectByOrderId(o.id) : null)),
  ]);

  if (!order) notFound();

  const currentIdx = TIMELINE_STATUSES.indexOf(order.order_status);

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <Link href={ROUTES.clientOrders} className="text-sm text-deshi-green hover:underline">← Back to Orders</Link>
        <h1 className="text-2xl font-bold mt-2">{order.product?.name ?? 'Order'}</h1>
        <p className="text-sm text-text-secondary font-mono">{order.order_number}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-white/10 p-4">
          <p className="text-xs text-text-secondary">Total</p>
          <p className="text-lg font-black">{formatBdt(Number(order.total))}</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-white/10 p-4">
          <p className="text-xs text-text-secondary">Payment</p>
          <p className="text-sm font-semibold capitalize">{order.payment_status}</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-white/10 p-4">
          <p className="text-xs text-text-secondary">Package</p>
          <p className="text-sm font-semibold">{order.package?.name ?? 'Standard'}</p>
        </div>
      </div>

      {project && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-900/10 p-4">
          <p className="text-sm font-semibold mb-1">Related Project</p>
          <Link href={ROUTES.clientProject(project.id)} className="text-deshi-green font-bold hover:underline">
            {project.title}
          </Link>
          {project.expected_delivery_date && (
            <p className="text-xs text-text-secondary mt-1">Expected delivery: {project.expected_delivery_date}</p>
          )}
        </div>
      )}

      {project?.stages && project.stages.length > 0 ? (
        <section>
          <h2 className="text-lg font-bold mb-4">Project Progress</h2>
          <ProjectStageTimeline stages={project.stages} />
        </section>
      ) : (
        <section>
          <h2 className="text-lg font-bold mb-4">Order Progress</h2>
          <ol className="space-y-3">
            {TIMELINE_STATUSES.map((status, idx) => {
              const done = idx <= currentIdx;
              const active = idx === currentIdx;
              return (
                <li key={status} className="flex items-center gap-3">
                  <span className={cn(
                    'w-3 h-3 rounded-full shrink-0',
                    done ? 'bg-deshi-green' : 'bg-slate-200 dark:bg-white/20',
                    active && 'ring-4 ring-deshi-green/20'
                  )} aria-hidden />
                  <span className={cn('text-sm capitalize', done ? 'text-text-primary font-medium' : 'text-text-secondary')}>
                    {status.replace(/_/g, ' ')}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {requirements.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-4">Your Requirements</h2>
          <dl className="space-y-3">
            {requirements.map((r) => (
              <div key={r.id} className="rounded-xl border border-slate-200 dark:border-white/10 p-4">
                <dt className="text-xs font-semibold text-text-secondary">{r.label}</dt>
                <dd className="text-sm mt-1 break-all">{r.value ?? '—'}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section>
        <h2 className="text-lg font-bold mb-4">Files</h2>
        <div className="rounded-xl border border-dashed border-slate-200 dark:border-white/10 p-6 text-center">
          <p className="text-sm text-text-secondary">Project deliverables will appear in your Files section when ready.</p>
          <Link href={ROUTES.clientFiles} className="text-sm text-deshi-green font-semibold hover:underline mt-2 inline-block">
            Go to Files
          </Link>
        </div>
      </section>

      {history.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-4">Status History</h2>
          <ul className="space-y-2 text-sm text-text-secondary">
            {history.map((h) => (
              <li key={h.id}>
                <span className="capitalize font-medium text-text-primary">{h.status.replace(/_/g, ' ')}</span>
                {' — '}
                {new Date(h.created_at).toLocaleString()}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
