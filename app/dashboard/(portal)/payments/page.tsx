import { buildPageMetadata } from '@/lib/metadata';
import { getBitpClientPayments } from '@/lib/services/dashboard.service';
import { formatBdt } from '@/lib/services/client';

export const metadata = buildPageMetadata({
  title: 'Payments | Bridge IT Park',
  path: '/dashboard/payments',
  noIndex: true,
});

export default async function ClientPaymentsPage() {
  const payments = await getBitpClientPayments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-sm text-text-secondary mt-1">Track payment requests and verification status.</p>
      </div>

      {payments.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-12 text-center">
          <p className="text-text-secondary">No payment records yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10">
                <th className="text-left p-4">Amount</th>
                <th className="text-left p-4">Method</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 dark:border-white/5">
                  <td className="p-4 font-semibold">{formatBdt(Number(p.amount))}</td>
                  <td className="p-4">{p.payment_method ?? '—'}</td>
                  <td className="p-4 capitalize">{p.payment_status}</td>
                  <td className="p-4 text-text-secondary">{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
