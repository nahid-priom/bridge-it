'use client';

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { DashboardCard } from '@/components/client-dashboard/ui/DashboardCard';

const PIE_COLORS = ['#10B981', '#6C3CE1', '#F59E0B'];

export function SpendingChart({
  spendingByMonth,
  projectCompletion,
}: {
  spendingByMonth: { month: string; amount: number }[];
  projectCompletion: { label: string; value: number }[];
}) {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <DashboardCard className="p-5 sm:p-6">
        <h3 className="text-sm font-bold text-text-primary mb-1">Spending Analytics</h3>
        <p className="text-xs text-text-muted mb-4">Monthly marketplace spend (BDT)</p>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spendingByMonth} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94A3B8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" tickFormatter={(v) => `৳${v / 1000}k`} />
              <Tooltip
                formatter={(value) => [
                  `৳${Number(value ?? 0).toLocaleString()}`,
                  'Spent',
                ]}
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid rgba(15,23,42,0.08)',
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#spendGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>

      <DashboardCard className="p-5 sm:p-6">
        <h3 className="text-sm font-bold text-text-primary mb-1">Project Completion</h3>
        <p className="text-xs text-text-muted mb-4">Portfolio breakdown</p>
        <div className="h-[220px] w-full flex items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={projectCompletion}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
              >
                {projectCompletion.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="hidden sm:flex flex-col gap-2 ml-2 shrink-0">
            {projectCompletion.map((item, i) => (
              <div key={item.label} className="flex items-center gap-2 text-xs">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                <span className="text-text-secondary">
                  {item.label}: <strong className="text-text-primary">{item.value}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}
