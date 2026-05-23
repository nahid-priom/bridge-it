import { buildPageMetadata } from '@/lib/metadata';
import { getSellerDashboardPayouts, getSellerPayoutMethods } from '@/lib/db/seller-dashboard';
import { formatCurrency } from '@/types/admin';
import { SellerPayoutMethodsForm } from '@/components/seller-dashboard/SellerPayoutMethodsForm';

export const metadata = buildPageMetadata({
  title: 'Seller Payouts',
  path: '/seller-dashboard/payouts',
  noIndex: true,
});

export default async function SellerPayoutsPage() {
  const [payoutsRes, methodsRes] = await Promise.all([
    getSellerDashboardPayouts(),
    getSellerPayoutMethods(),
  ]);
  const payouts = payoutsRes.data;
  const methods = methodsRes.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black font-display text-text-primary">Payouts</h1>
        <p className="text-sm text-text-secondary mt-1">
          Add bKash, Nagad, or bank account. PayPal support coming soon.
        </p>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-surface/80 p-6">
        <h2 className="font-bold text-text-primary mb-4">Payout method</h2>
        <SellerPayoutMethodsForm existingMethods={methods} />
      </div>

      <div className="rounded-2xl border border-border-subtle bg-surface/80 overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle">
          <h2 className="font-bold text-text-primary">Payout history</h2>
        </div>
        {payouts.length === 0 ? (
          <p className="p-6 text-sm text-text-secondary">No payout requests yet.</p>
        ) : (
          <ul className="divide-y divide-border-subtle">
            {payouts.map((p) => (
              <li key={p.id} className="px-5 py-4 flex justify-between gap-4">
                <div>
                  <p className="font-semibold">{formatCurrency(p.amount)}</p>
                  <p className="text-xs text-text-secondary capitalize">{p.payoutMethod ?? '—'}</p>
                </div>
                <span
                  className={`text-xs font-bold capitalize px-2 py-1 rounded-full ${
                    p.status === 'paid'
                      ? 'bg-emerald-500/15 text-emerald-700'
                      : p.status === 'failed'
                        ? 'bg-red-500/15 text-red-700'
                        : 'bg-amber-500/15 text-amber-700'
                  }`}
                >
                  {p.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
