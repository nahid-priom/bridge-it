'use client';

import { useMemo, useState } from 'react';
import { LayoutGrid, List, Search } from 'lucide-react';
import { DashboardCard } from '@/components/client-dashboard/ui/DashboardCard';
import { StatusBadge } from '@/components/client-dashboard/ui/StatusBadge';
import type { ClientOrder } from '@/types/client-dashboard';
import { cn } from '@/lib/cn';

export function OrdersTable({ orders }: { orders: ClientOrder[] }) {
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'newest' | 'amount'>('newest');

  const filtered = useMemo(() => {
    let list = orders.filter(
      (o) =>
        o.title.toLowerCase().includes(query.toLowerCase()) ||
        o.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
        o.sellerName.toLowerCase().includes(query.toLowerCase())
    );
    if (sort === 'amount') {
      list = [...list].sort((a, b) => b.amount - a.amount);
    } else {
      list = [...list].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return list;
  }, [orders, query, sort]);

  return (
    <DashboardCard className="overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-white/10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search orders..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-sm focus:outline-none focus:border-deshi-green/40"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as 'newest' | 'amount')}
            className="h-10 px-3 rounded-xl border border-slate-200/80 dark:border-white/10 text-sm bg-white dark:bg-white/5"
          >
            <option value="newest">Newest</option>
            <option value="amount">Amount</option>
          </select>
          <div className="flex rounded-xl border border-slate-200/80 dark:border-white/10 p-0.5">
            <button
              type="button"
              onClick={() => setView('table')}
              className={cn(
                'p-2 rounded-lg',
                view === 'table' ? 'bg-deshi-green/10 text-deshi-green' : 'text-text-muted'
              )}
              aria-label="Table view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setView('grid')}
              className={cn(
                'p-2 rounded-lg',
                view === 'grid' ? 'bg-deshi-green/10 text-deshi-green' : 'text-text-muted'
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {view === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted border-b border-slate-100 dark:border-white/10">
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Seller</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Delivery</th>
                <th className="px-5 py-3">Payment</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/10">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-text-primary">{order.title}</p>
                    <p className="text-xs text-text-muted">{order.orderNumber}</p>
                  </td>
                  <td className="px-5 py-3.5 text-text-secondary">{order.sellerName}</td>
                  <td className="px-5 py-3.5 font-semibold tabular-nums">
                    ৳{order.amount.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 text-text-muted text-xs">{order.deliveryDate}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={order.paymentStatus} />
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 p-5">
          {filtered.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-slate-200/80 dark:border-white/10 p-4 hover:border-deshi-green/30 transition-colors"
            >
              <p className="text-xs text-text-muted mb-1">{order.orderNumber}</p>
              <h3 className="font-semibold text-text-primary mb-2">{order.title}</h3>
              <p className="text-xs text-text-muted mb-3">{order.sellerName}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold">৳{order.amount.toLocaleString()}</span>
                <StatusBadge status={order.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
