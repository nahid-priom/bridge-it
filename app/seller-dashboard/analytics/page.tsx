import { buildPageMetadata } from '@/lib/metadata';
import { getSellerDashboardStats } from '@/lib/db/seller-dashboard';
import { formatCurrency } from '@/types/admin';
import { SellerKpiCards } from '@/components/seller-dashboard/SellerKpiCards';

export const metadata = buildPageMetadata({
  title: 'Seller Analytics',
  path: '/seller-dashboard/analytics',
  noIndex: true,
});

export default async function SellerAnalyticsPage() {
  const statsRes = await getSellerDashboardStats();
  const stats = statsRes.data;

  const chartBars = [
    { label: 'Revenue', value: stats.totalRevenue, max: Math.max(stats.totalRevenue, 1) },
    { label: 'This month', value: stats.earningsThisMonth, max: Math.max(stats.earningsThisMonth, 1) },
    { label: 'Orders', value: stats.totalOrders, max: Math.max(stats.totalOrders, 1) },
    { label: 'Impressions', value: stats.impressions, max: Math.max(stats.impressions, 1) },
    { label: 'Clicks', value: stats.clicks, max: Math.max(stats.clicks, 1) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black font-display text-text-primary">Analytics</h1>
        <p className="text-sm text-text-secondary mt-1">Performance metrics synced from your marketplace activity.</p>
      </div>

      <SellerKpiCards stats={stats} />

      <div className="rounded-2xl border border-border-subtle bg-surface/80 p-6">
        <h2 className="font-bold text-text-primary mb-6">Performance snapshot</h2>
        <div className="flex items-end gap-4 h-48">
          {chartBars.map((bar) => (
            <div key={bar.label} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col justify-end h-36">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600 to-violet-500 min-h-[4px]"
                  style={{ height: `${Math.max(8, (bar.value / bar.max) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] font-bold uppercase text-text-muted text-center">{bar.label}</p>
              <p className="text-xs font-bold text-text-primary">
                {bar.label.includes('Revenue') || bar.label.includes('month')
                  ? formatCurrency(bar.value)
                  : bar.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border-subtle bg-surface/80 p-5">
          <p className="text-xs text-text-secondary">Order completion</p>
          <p className="text-3xl font-black mt-1">
            {stats.totalOrders > 0
              ? Math.round((stats.completedOrders / stats.totalOrders) * 100)
              : 0}
            %
          </p>
        </div>
        <div className="rounded-2xl border border-border-subtle bg-surface/80 p-5">
          <p className="text-xs text-text-secondary">Conversion rate</p>
          <p className="text-3xl font-black mt-1">{stats.conversionRate}%</p>
        </div>
      </div>
    </div>
  );
}
