'use client';

import {
  FolderKanban,
  ShoppingBag,
  Clock,
  Wallet,
  CheckCircle2,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { DashboardCard } from '@/components/client-dashboard/ui/DashboardCard';
import type { ClientDashboardStats } from '@/types/client-dashboard';
import { cn } from '@/lib/cn';

const icons: Record<string, LucideIcon> = {
  projects: FolderKanban,
  orders: ShoppingBag,
  payments: Clock,
  wallet: Wallet,
  completed: CheckCircle2,
  sellers: Users,
};

function formatBdt(amount: number) {
  return `৳${amount.toLocaleString('en-BD')}`;
}

export function ClientStatsCards({ stats }: { stats: ClientDashboardStats }) {
  const cards = [
    {
      key: 'projects',
      label: 'Active Projects',
      value: String(stats.activeProjects),
      sub: 'In delivery',
      gradient: 'from-sky-500/20 to-violet-500/10',
      iconColor: 'text-sky-600 dark:text-sky-400',
    },
    {
      key: 'orders',
      label: 'Total Orders',
      value: String(stats.totalOrders),
      sub: 'All time',
      gradient: 'from-violet-500/20 to-fuchsia-500/10',
      iconColor: 'text-violet-600 dark:text-violet-400',
    },
    {
      key: 'payments',
      label: 'Pending Payments',
      value: String(stats.pendingPayments),
      sub: 'Requires action',
      gradient: 'from-amber-500/20 to-orange-500/10',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      key: 'wallet',
      label: 'Wallet Balance',
      value: formatBdt(stats.walletBalance),
      sub: stats.currency,
      gradient: 'from-emerald-500/20 to-teal-500/10',
      iconColor: 'text-deshi-green dark:text-emerald-400',
    },
    {
      key: 'completed',
      label: 'Completed Projects',
      value: String(stats.completedProjects),
      sub: 'Delivered',
      gradient: 'from-emerald-500/15 to-cyan-500/10',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      key: 'sellers',
      label: 'Active Sellers',
      value: String(stats.activeSellers),
      sub: 'Hired freelancers',
      gradient: 'from-indigo-500/20 to-purple-500/10',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((card, i) => {
        const Icon = icons[card.key]!;
        return (
          <DashboardCard
            key={card.key}
            hover
            className={cn('p-4 sm:p-5', i > 0 && 'delay-[var(--delay)]')}
            {...({ style: { '--delay': `${i * 40}ms` } } as React.CSSProperties)}
          >
            <div
              className={cn(
                'w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3',
                card.gradient
              )}
            >
              <Icon className={cn('w-5 h-5', card.iconColor)} />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1">
              {card.label}
            </p>
            <p className="text-xl sm:text-2xl font-bold text-text-primary tabular-nums">{card.value}</p>
            <p className="text-xs text-text-muted mt-0.5">{card.sub}</p>
          </DashboardCard>
        );
      })}
    </div>
  );
}
