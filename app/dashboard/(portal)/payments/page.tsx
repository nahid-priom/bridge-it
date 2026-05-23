import { buildPageMetadata } from '@/lib/metadata';
import { DashboardCard } from '@/components/client-dashboard/ui/DashboardCard';
import { StatusBadge } from '@/components/client-dashboard/ui/StatusBadge';
import { getClientTransactionsData } from '@/lib/db/client-dashboard';

export const metadata = buildPageMetadata({
  title: 'Payments',
  description: 'Payment history and methods.',
  path: '/dashboard/payments',
  noIndex: true,
});

const methods = [
  { name: 'bKash', desc: 'Mobile wallet' },
  { name: 'Nagad', desc: 'Mobile wallet' },
  { name: 'SSLCommerz', desc: 'Cards & banking' },
  { name: 'Visa / Mastercard', desc: 'International cards' },
];

export default async function ClientPaymentsPage() {
  const transactions = await getClientTransactionsData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Payments</h1>
        <p className="text-sm text-text-muted mt-1">History, receipts, and payment methods.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {methods.map((m) => (
          <DashboardCard key={m.name} className="p-4">
            <p className="font-semibold text-sm">{m.name}</p>
            <p className="text-xs text-text-muted">{m.desc}</p>
          </DashboardCard>
        ))}
      </div>

      <DashboardCard className="overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-white/10">
          <h2 className="font-bold">Payment History</h2>
        </div>
        {transactions.length === 0 ? (
          <p className="p-6 text-sm text-text-muted">No transactions yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-white/10">
            {transactions.map((tx) => (
              <li key={tx.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-semibold">{tx.label}</p>
                  <p className="text-xs text-text-muted">
                    TX-{tx.id.slice(0, 8).toUpperCase()} · {tx.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold tabular-nums">
                    ৳{Math.abs(tx.amount).toLocaleString()}
                  </p>
                  <StatusBadge status={tx.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </DashboardCard>
    </div>
  );
}
