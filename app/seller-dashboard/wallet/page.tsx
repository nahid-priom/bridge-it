import Link from 'next/link';
import { buildPageMetadata } from '@/lib/metadata';
import {
  getSellerDashboardStats,
  getSellerWalletTransactions,
} from '@/lib/db/seller-dashboard';
import { formatCurrency } from '@/types/admin';
import { ROUTES } from '@/lib/routes';

export const metadata = buildPageMetadata({
  title: 'Seller Wallet',
  path: '/seller-dashboard/wallet',
  noIndex: true,
});

export default async function SellerWalletPage() {
  const [statsRes, txRes] = await Promise.all([
    getSellerDashboardStats(),
    getSellerWalletTransactions(40),
  ]);
  const stats = statsRes.data;
  const transactions = txRes.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black font-display text-text-primary">Wallet</h1>
        <p className="text-sm text-text-secondary mt-1">Seller balance and transaction history.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 to-transparent p-6">
          <p className="text-xs font-semibold uppercase text-text-secondary">Available balance</p>
          <p className="text-3xl font-black mt-2">{formatCurrency(stats.walletBalance)}</p>
        </div>
        <div className="rounded-2xl border border-border-subtle bg-surface/80 p-6">
          <p className="text-xs font-semibold uppercase text-text-secondary">Pending</p>
          <p className="text-3xl font-black mt-2">{formatCurrency(stats.pendingBalance)}</p>
        </div>
      </div>

      <Link
        href={ROUTES.sellerDashboardPayouts}
        className="inline-flex rounded-xl bg-deshi-green px-4 py-2.5 text-sm font-bold text-white hover:bg-deshi-green-dark"
      >
        Withdraw to payout method
      </Link>

      <div className="rounded-2xl border border-border-subtle bg-surface/80 overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle">
          <h2 className="font-bold text-text-primary">Transactions</h2>
        </div>
        {transactions.length === 0 ? (
          <p className="p-6 text-sm text-text-secondary">No transactions yet.</p>
        ) : (
          <ul className="divide-y divide-border-subtle">
            {transactions.map((t) => (
              <li key={t.id} className="px-5 py-4 flex justify-between gap-4">
                <div>
                  <p className="font-semibold capitalize">{t.transactionType.replace('_', ' ')}</p>
                  <p className="text-xs text-text-secondary">{t.description ?? '—'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(t.amount)}</p>
                  <p className="text-xs text-text-muted">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
