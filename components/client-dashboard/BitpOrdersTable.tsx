'use client';

import Link from 'next/link';
import type { BitpOrder } from '@/types/bitp';
import { ROUTES } from '@/lib/routes';
import { formatBdt } from '@/lib/format/currency';
import { cn } from '@/lib/cn';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300',
  requirements_submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
  confirmed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
};

type BitpOrdersTableProps = {
  orders: BitpOrder[];
};

export function BitpOrdersTable({ orders }: BitpOrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-12 text-center">
        <p className="text-text-secondary mb-4">No active orders yet.</p>
        <Link href={ROUTES.solutions} className="deshi-btn-primary px-6 py-2.5 inline-block text-sm">
          Browse Solutions
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
            <th className="text-left p-4 font-semibold">Order</th>
            <th className="text-left p-4 font-semibold hidden sm:table-cell">Solution</th>
            <th className="text-left p-4 font-semibold">Amount</th>
            <th className="text-left p-4 font-semibold">Status</th>
            <th className="text-right p-4 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/30 dark:hover:bg-white/[0.02]">
              <td className="p-4 font-mono text-xs">{order.order_number}</td>
              <td className="p-4 hidden sm:table-cell">{order.product?.name ?? '—'}</td>
              <td className="p-4 font-semibold">{formatBdt(Number(order.total))}</td>
              <td className="p-4">
                <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold capitalize', STATUS_COLORS[order.order_status] ?? 'bg-slate-100 text-slate-600')}>
                  {order.order_status.replace(/_/g, ' ')}
                </span>
              </td>
              <td className="p-4 text-right">
                <Link href={ROUTES.clientOrder(order.id)} className="text-deshi-green font-semibold hover:underline text-sm">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
