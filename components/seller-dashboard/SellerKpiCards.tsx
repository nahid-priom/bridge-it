import { formatCurrency } from '@/types/admin';
import type { SellerDashboardStats } from '@/lib/db/seller-dashboard';

const kpis = (stats: SellerDashboardStats) => [
  { label: 'Revenue', value: formatCurrency(stats.totalRevenue) },
  { label: 'Active orders', value: String(stats.activeOrders) },
  { label: 'Completed', value: String(stats.completedOrders) },
  { label: 'Rating', value: stats.rating.toFixed(1) },
  { label: 'Response rate', value: `${stats.responseRate}%` },
  { label: 'Impressions', value: String(stats.impressions) },
  { label: 'Clicks', value: String(stats.clicks) },
  { label: 'Conversion', value: `${stats.conversionRate}%` },
  { label: 'This month', value: formatCurrency(stats.earningsThisMonth) },
  { label: 'Pending clearance', value: formatCurrency(stats.pendingClearance) },
];

export function SellerKpiCards({ stats }: { stats: SellerDashboardStats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {kpis(stats).map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-border-subtle bg-surface/80 p-4 backdrop-blur-sm hover:border-emerald-500/20 transition-colors"
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary truncate">
            {card.label}
          </p>
          <p className="text-lg sm:text-xl font-black text-text-primary mt-1 truncate">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
