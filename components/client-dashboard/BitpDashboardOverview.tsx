import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, FolderKanban, CreditCard, MessageSquare } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { formatBdt } from '@/lib/format/currency';
import type { BitpOrder } from '@/types/bitp';

type BitpDashboardOverviewProps = {
  totalOrders: number;
  activeProjects: number;
  pendingPayments: number;
  completedProjects: number;
  recentOrders: BitpOrder[];
};

export function BitpDashboardOverview({
  totalOrders,
  activeProjects,
  pendingPayments,
  completedProjects,
  recentOrders,
}: BitpDashboardOverviewProps) {
  const stats = [
    { label: 'Total Orders', value: totalOrders, icon: ShoppingBag },
    { label: 'Active Projects', value: activeProjects, icon: FolderKanban },
    { label: 'Pending Payments', value: pendingPayments, icon: CreditCard },
    { label: 'Completed Projects', value: completedProjects, icon: LayoutDashboard },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome to Bridge IT Park</h1>
        <p className="text-sm text-text-secondary mt-1">Track your orders, projects, and payments.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 dark:border-white/10 p-4 md:p-5">
            <s.icon className="w-5 h-5 text-deshi-green mb-2" aria-hidden />
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs text-text-secondary mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Link href={ROUTES.solutions} className="deshi-btn-primary py-3 text-sm text-center">New Order</Link>
        <Link href={ROUTES.consultation} className="deshi-btn-outline py-3 text-sm text-center">Request Quote</Link>
        <Link href={ROUTES.clientProjects} className="deshi-btn-outline py-3 text-sm text-center">View Projects</Link>
        <Link href={ROUTES.clientSupport} className="deshi-btn-outline py-3 text-sm text-center inline-flex items-center justify-center gap-2">
          <MessageSquare className="w-4 h-4" aria-hidden /> Contact Support
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold">Recent Orders</h2>
          <Link href={ROUTES.clientOrders} className="text-sm text-deshi-green font-semibold hover:underline">View all</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-text-secondary">No orders yet.</p>
        ) : (
          <ul className="space-y-3">
            {recentOrders.map((order) => (
              <li key={order.id} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-white/5 last:border-0">
                <div>
                  <p className="text-sm font-semibold">{order.product?.name}</p>
                  <p className="text-xs text-text-secondary font-mono">{order.order_number}</p>
                </div>
                <p className="text-sm font-bold">{formatBdt(Number(order.total))}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
