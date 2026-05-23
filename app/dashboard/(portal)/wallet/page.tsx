import { buildPageMetadata } from '@/lib/metadata';
import { WalletOverview } from '@/components/client-dashboard/WalletOverview';
import {
  getClientDashboardOverviewData,
  getClientTransactionsData,
} from '@/lib/db/client-dashboard';

export const metadata = buildPageMetadata({
  title: 'Wallet',
  description: 'Balance, transactions, and funds.',
  path: '/dashboard/wallet',
  noIndex: true,
});

export default async function ClientWalletPage() {
  const [overview, transactions] = await Promise.all([
    getClientDashboardOverviewData(),
    getClientTransactionsData(),
  ]);
  const spent = overview.orders.reduce((s, o) => s + o.amount, 0);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Wallet & Balance</h1>
        <p className="text-sm text-text-muted mt-1">Manage funds and transaction history.</p>
      </div>
      <WalletOverview
        balance={overview.stats.walletBalance}
        pending={0}
        spent={spent}
        transactions={transactions}
        currency={overview.stats.currency}
      />
    </div>
  );
}
