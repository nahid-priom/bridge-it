'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, FolderKanban, CreditCard, Package } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { formatBdt } from '@/lib/format/currency';
import type { AdminSection } from '@/types/admin';
import { KPISkeleton } from '@/src/components/skeletons/KPISkeleton';
import { ListSkeleton } from '@/src/components/skeletons/ListSkeleton';

type BitpStats = {
  pendingOrders: number;
  activeProjects: number;
  pendingPayments: number;
  publishedProducts: number;
};

type RecentOrder = {
  id: string;
  order_number: string;
  total: number;
  order_status: string;
  product?: { name: string } | null;
};

export function AdminBitpOverviewSection({ onNavigate }: { onNavigate: (section: AdminSection) => void }) {
  const [stats, setStats] = useState<BitpStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch('/api/admin/bitp/stats')
      .then((r) => r.json())
      .then((d) => {
        setStats(d.stats ?? null);
        setRecentOrders(d.recentOrders ?? []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        { label: 'Pending Orders', value: stats.pendingOrders, icon: ShoppingBag, section: 'bitp-orders' as AdminSection },
        { label: 'Active Projects', value: stats.activeProjects, icon: FolderKanban, section: 'bitp-projects' as AdminSection },
        { label: 'Pending Payments', value: stats.pendingPayments, icon: CreditCard, section: 'bitp-payments' as AdminSection },
        { label: 'Published Products', value: stats.publishedProducts, icon: Package, section: 'bitp-products' as AdminSection },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Bridge IT Park Operations</h2>
        <p className="text-sm text-white/60 mt-1">Live counts from orders, projects, and catalog.</p>
      </div>

      {loading ? (
        <KPISkeleton count={4} />
      ) : error ? (
        <p className="text-sm text-rose-300">Unable to load metrics.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <button
              key={card.label}
              type="button"
              onClick={() => onNavigate(card.section)}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition-colors hover:border-emerald-500/40"
            >
              <card.icon className="mb-2 h-5 w-5 text-emerald-400" aria-hidden />
              <p className="text-2xl font-black text-white">{card.value}</p>
              <p className="mt-1 text-xs text-white/60">{card.label}</p>
            </button>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-white/10 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-white">Recent Orders</h3>
          <button type="button" onClick={() => onNavigate('bitp-orders')} className="text-sm text-emerald-400 hover:underline">
            View all
          </button>
        </div>
        {loading ? (
          <ListSkeleton rows={3} />
        ) : recentOrders.length === 0 ? (
          <p className="text-sm text-white/50">No orders yet.</p>
        ) : (
          <ul className="space-y-2">
            {recentOrders.map((order) => (
              <li key={order.id} className="flex justify-between text-sm text-white/80">
                <span>{order.product?.name ?? order.order_number}</span>
                <span className="font-semibold">{formatBdt(Number(order.total))}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-sm text-white/50">
        Public catalog:{' '}
        <Link href={ROUTES.solutions} className="text-emerald-400 hover:underline">
          /solutions
        </Link>
      </p>
    </div>
  );
}
