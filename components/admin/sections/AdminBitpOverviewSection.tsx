'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, FolderKanban, CreditCard, Package } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { formatBdt } from '@/lib/format/currency';
import type { AdminSection } from '@/types/admin';

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

  useEffect(() => {
    fetch('/api/admin/bitp/stats')
      .then((r) => r.json())
      .then((d) => {
        setStats(d.stats ?? null);
        setRecentOrders(d.recentOrders ?? []);
      })
      .catch(() => {});
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <button
            key={card.label}
            type="button"
            onClick={() => onNavigate(card.section)}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left hover:border-emerald-500/40 transition-colors"
          >
            <card.icon className="w-5 h-5 text-emerald-400 mb-2" aria-hidden />
            <p className="text-2xl font-black text-white">{card.value}</p>
            <p className="text-xs text-white/60 mt-1">{card.label}</p>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white">Recent Orders</h3>
          <button type="button" onClick={() => onNavigate('bitp-orders')} className="text-sm text-emerald-400 hover:underline">
            View all
          </button>
        </div>
        {recentOrders.length === 0 ? (
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
        Public catalog: <Link href={ROUTES.solutions} className="text-emerald-400 hover:underline">/solutions</Link>
      </p>
    </div>
  );
}
