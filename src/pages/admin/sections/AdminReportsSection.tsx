import React from 'react';
import { motion } from 'framer-motion';
import { Download, TrendingUp, BarChart3 } from 'lucide-react';
import { AdminChartCard } from '../../../components/admin/AdminChartCard';
import { topCategories, topSellers, monthlyRevenueData, orderGrowthData } from '../../../data/adminData';
import { formatCurrency } from '../../../data/adminData';

export const AdminReportsSection: React.FC = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm text-bridge-gray">Platform analytics and export tools</p>
        <button
          type="button"
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-bridge-primary hover:bg-bridge-primary-light text-white text-sm font-medium rounded-xl cursor-pointer"
        >
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Refund Rate', value: '2.4%' },
          { label: 'Dispute Rate', value: '1.1%' },
          { label: 'Conversion', value: '4.8%' },
          { label: 'Avg Order Value', value: '৳7,560' },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-2xl p-4 border border-white/8">
            <p className="text-xs text-bridge-gray">{s.label}</p>
            <p className="text-xl font-bold text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AdminChartCard title="Revenue Overview" subtitle="Monthly (৳K)" icon={TrendingUp} data={monthlyRevenueData} color="primary" />
        <AdminChartCard title="Order Trends" icon={BarChart3} data={orderGrowthData} color="secondary" />
      </div>

      <div className="glass-card rounded-2xl p-6 border border-white/8 min-h-[200px] flex flex-col items-center justify-center text-center">
        <BarChart3 className="w-12 h-12 text-bridge-primary/40 mb-3" />
        <h3 className="text-sm font-semibold text-white">Conversion Funnel</h3>
        <p className="text-xs text-bridge-gray mt-2 max-w-sm">
          Placeholder for visit → browse → cart → checkout funnel. Connect analytics when backend is ready.
        </p>
        <div className="flex gap-2 mt-4 w-full max-w-md">
          {['Visits', 'Browse', 'Cart', 'Purchase'].map((step, i) => (
            <div key={step} className="flex-1">
              <div
                className="h-16 rounded-t-lg bg-gradient-to-t from-bridge-primary/40 to-bridge-secondary/20"
                style={{ height: `${(4 - i) * 24 + 40}px` }}
              />
              <p className="text-[10px] text-bridge-gray mt-1">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-white/8">
          <h3 className="text-sm font-semibold text-white mb-4">Best Categories</h3>
          {topCategories.map((c) => (
            <div key={c.id} className="flex justify-between py-2 border-b border-white/5 last:border-0 text-sm">
              <span className="text-white">{c.name}</span>
              <span className="text-bridge-secondary">{c.growth}</span>
            </div>
          ))}
        </div>
        <div className="glass-card rounded-2xl p-5 border border-white/8">
          <h3 className="text-sm font-semibold text-white mb-4">Top Sellers</h3>
          {topSellers.map((s) => (
            <div key={s.id} className="flex justify-between py-2 border-b border-white/5 last:border-0 text-sm">
              <span className="text-white">{s.name}</span>
              <span className="text-bridge-gray">{formatCurrency(s.revenue)}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
