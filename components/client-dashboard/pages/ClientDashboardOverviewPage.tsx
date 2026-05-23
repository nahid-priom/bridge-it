'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ClientStatsCards } from '@/components/client-dashboard/ClientStatsCards';
import { ActiveProjectsBoard } from '@/components/client-dashboard/ActiveProjectsBoard';
import { SpendingChart } from '@/components/client-dashboard/SpendingChart';
import { DashboardCard } from '@/components/client-dashboard/ui/DashboardCard';
import { StatusBadge } from '@/components/client-dashboard/ui/StatusBadge';
import { ROUTES } from '@/lib/routes';
import type { ClientDashboardOverview } from '@/types/client-dashboard';

export function ClientDashboardOverviewPage({ data }: { data: ClientDashboardOverview }) {
  return (
    <div className="space-y-6">
      <ClientStatsCards stats={data.stats} />
      <SpendingChart
        spendingByMonth={data.spendingByMonth}
        projectCompletion={data.projectCompletion}
      />

      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <ActiveProjectsBoard projects={data.projects} />
        </div>
        <DashboardCard className="p-5 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-text-primary">Recent Orders</h2>
            <Link
              href={ROUTES.clientOrders}
              className="text-xs font-semibold text-deshi-green hover:underline inline-flex items-center gap-1"
            >
              All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ul className="space-y-3">
            {data.orders.map((order) => (
              <li
                key={order.id}
                className="flex items-center justify-between gap-2 py-2 border-b border-slate-50 dark:border-white/5 last:border-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{order.title}</p>
                  <p className="text-xs text-text-muted">{order.orderNumber}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold tabular-nums">৳{order.amount.toLocaleString()}</p>
                  <StatusBadge status={order.status} />
                </div>
              </li>
            ))}
          </ul>
        </DashboardCard>
      </div>
    </div>
  );
}
