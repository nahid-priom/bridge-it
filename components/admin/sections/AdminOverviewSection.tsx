'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Store,
  Users,
  ShoppingBag,
  DollarSign,
  ShieldCheck,
  Scale,
  Percent,
  Wallet,
  TrendingUp,
} from 'lucide-react';
import { AdminStatCard } from '../../../components/admin/AdminStatCard';
import { AdminChartCard } from '../../../components/admin/AdminChartCard';
import { AdminActivityFeed } from '../../../components/admin/AdminActivityFeed';
import {
  initialAdminStats,
  adminActivities,
  adminPendingActions,
  topCategories,
  topSellers,
  monthlyRevenueData,
  orderGrowthData,
  formatCurrency,
  type AdminSection,
  type AdminStats,
} from '@/data/adminData';

const monthLabels = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

interface AdminOverviewSectionProps {
  onNavigate: (section: AdminSection) => void;
}

export const AdminOverviewSection: React.FC<AdminOverviewSectionProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [stats] = useState<AdminStats>(initialAdminStats);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const statCards = [
    { label: 'Total Sellers', value: String(stats.totalSellers), icon: Store, accent: 'primary' as const, change: '+12' },
    { label: 'Total Customers', value: String(stats.totalCustomers), icon: Users, accent: 'cyan' as const, change: '+8%' },
    { label: 'Total Orders', value: stats.totalOrders.toLocaleString(), icon: ShoppingBag, accent: 'secondary' as const },
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: DollarSign, accent: 'gold' as const, change: '+23%' },
    { label: 'Pending Verification', value: String(stats.pendingVerification), icon: ShieldCheck, accent: 'gold' as const },
    { label: 'Active Disputes', value: String(stats.activeDisputes), icon: Scale, accent: 'accent' as const },
    { label: 'Platform Commission', value: formatCurrency(stats.platformCommission), icon: Percent, accent: 'primary' as const },
    { label: 'Escrow Balance', value: formatCurrency(stats.escrowBalance), icon: Wallet, accent: 'cyan' as const },
  ];

  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <AdminStatCard key={card.label} {...card} loading={loading} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AdminChartCard
          title="Monthly Revenue"
          subtitle="Last 12 months (৳ thousands)"
          icon={DollarSign}
          data={monthlyRevenueData}
          labels={monthLabels}
          color="primary"
          loading={loading}
        />
        <AdminChartCard
          title="Order Growth"
          subtitle="Monthly orders"
          icon={TrendingUp}
          data={orderGrowthData}
          labels={monthLabels}
          color="secondary"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <AdminActivityFeed activities={adminActivities} loading={loading} />
        </div>
        <div className="glass-card rounded-2xl border border-white/8 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Pending Admin Actions</h3>
          <div className="space-y-2">
            {adminPendingActions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => onNavigate(action.section)}
                className="w-full flex items-center justify-between p-3 rounded-xl glass border border-white/8 hover:border-bridge-primary/30 transition-all text-left cursor-pointer group"
              >
                <span className="text-sm text-bridge-gray group-hover:text-white">{action.label}</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    action.priority === 'high'
                      ? 'bg-bridge-accent/15 text-bridge-accent'
                      : action.priority === 'medium'
                        ? 'bg-bridge-gold/15 text-bridge-gold'
                        : 'bg-white/10 text-bridge-gray'
                  }`}
                >
                  {action.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl border border-white/8 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Top Categories</h3>
          <div className="space-y-3">
            {topCategories.map((cat, i) => (
              <div key={cat.id} className="flex items-center gap-3">
                <span className="w-6 text-xs text-bridge-gray font-mono">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{cat.name}</p>
                  <p className="text-xs text-bridge-gray">{cat.nameBn}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-white">{formatCurrency(cat.revenue)}</p>
                  <p className="text-xs text-bridge-secondary">{cat.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card rounded-2xl border border-white/8 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Top Sellers</h3>
          <div className="space-y-3">
            {topSellers.map((seller, i) => (
              <div key={seller.id} className="flex items-center gap-3">
                <span className="w-6 text-xs text-bridge-gray font-mono">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{seller.name}</p>
                  <p className="text-xs text-bridge-gray">{seller.company}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-white">{formatCurrency(seller.revenue)}</p>
                  <p className="text-xs text-bridge-gold">★ {seller.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
