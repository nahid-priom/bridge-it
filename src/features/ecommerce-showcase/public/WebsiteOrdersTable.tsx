import Link from 'next/link';
import { formatBdt } from '@/lib/format/currency';
import { cn } from '@/lib/cn';
import type { WebsiteOrder } from '../types';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300',
  confirmed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
};

export function WebsiteOrdersTable({
  orders,
  placedId,
}: {
  orders: WebsiteOrder[];
  placedId?: string;
}) {
  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 p-10 text-center dark:border-white/10">
        <p className="mb-4 text-text-secondary">No website orders yet.</p>
        <Link href="/websites" className="text-sm font-semibold text-[#2563eb] hover:underline">
          Browse websites
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/50 dark:border-white/10 dark:bg-white/[0.02]">
            <th className="p-4 text-left font-semibold">Order</th>
            <th className="hidden p-4 text-left font-semibold sm:table-cell">Website</th>
            <th className="p-4 text-left font-semibold">Package</th>
            <th className="p-4 text-left font-semibold">Amount</th>
            <th className="p-4 text-left font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className={cn(
                'border-b border-slate-100 dark:border-white/5',
                placedId === order.id && 'bg-emerald-50/80 dark:bg-emerald-500/10'
              )}
            >
              <td className="p-4 font-mono text-xs">{order.order_number}</td>
              <td className="hidden p-4 sm:table-cell">
                {order.project_slug ? (
                  <Link href={`/websites/${order.project_slug}`} className="hover:underline">
                    {order.project_title}
                  </Link>
                ) : (
                  order.project_title
                )}
              </td>
              <td className="p-4">{order.package_name}</td>
              <td className="p-4 font-semibold">{formatBdt(order.amount)}</td>
              <td className="p-4">
                <span
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs font-semibold capitalize',
                    STATUS_COLORS[order.status] ?? 'bg-slate-100 text-slate-600'
                  )}
                >
                  {order.status.replace(/_/g, ' ')}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
