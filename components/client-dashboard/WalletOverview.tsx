'use client';

import { ArrowDownLeft, ArrowUpRight, Plus, Wallet } from 'lucide-react';
import { DashboardCard } from '@/components/client-dashboard/ui/DashboardCard';
import { StatusBadge } from '@/components/client-dashboard/ui/StatusBadge';
import type { ClientTransaction } from '@/types/client-dashboard';
import { cn } from '@/lib/cn';

export function WalletOverview({
  balance,
  pending,
  spent,
  transactions,
  currency = 'BDT',
}: {
  balance: number;
  pending: number;
  spent: number;
  transactions: ClientTransaction[];
  currency?: string;
}) {
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-4">
        <DashboardCard className="p-5 sm:p-6 bg-gradient-to-br from-emerald-500/10 via-white to-violet-500/5 dark:from-emerald-500/10 dark:via-slate-900/80 dark:to-violet-500/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-deshi-green/15 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-deshi-green" />
            </div>
            <span className="text-xs font-semibold uppercase text-text-muted">Available</span>
          </div>
          <p className="text-3xl font-bold text-text-primary tabular-nums">
            ৳{balance.toLocaleString()}
          </p>
          <p className="text-xs text-text-muted mt-1">{currency}</p>
        </DashboardCard>
        <DashboardCard className="p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase text-text-muted mb-2">Pending</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
            ৳{pending.toLocaleString()}
          </p>
        </DashboardCard>
        <DashboardCard className="p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase text-text-muted mb-2">Total Spent</p>
          <p className="text-2xl font-bold text-text-primary tabular-nums">
            ৳{spent.toLocaleString()}
          </p>
        </DashboardCard>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-deshi-green text-white text-sm font-semibold hover:brightness-105 transition"
        >
          <Plus className="w-4 h-4" /> Add Funds
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-white/5"
        >
          Withdraw Request
        </button>
      </div>

      <DashboardCard className="overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-white/10">
          <h3 className="font-bold text-text-primary">Transactions</h3>
        </div>
        <ul className="divide-y divide-slate-100 dark:divide-white/10">
          {transactions.map((tx) => {
            const isCredit = tx.amount > 0;
            return (
              <li
                key={tx.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                    isCredit
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15'
                      : 'bg-slate-100 text-slate-600 dark:bg-white/10'
                  )}
                >
                  {isCredit ? (
                    <ArrowDownLeft className="w-5 h-5" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary">{tx.label}</p>
                  <p className="text-xs text-text-muted">{tx.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <p
                    className={cn(
                      'text-sm font-bold tabular-nums',
                      isCredit ? 'text-emerald-600' : 'text-text-primary'
                    )}
                  >
                    {isCredit ? '+' : ''}৳{Math.abs(tx.amount).toLocaleString()}
                  </p>
                  <StatusBadge status={tx.status} className="mt-1" />
                </div>
              </li>
            );
          })}
        </ul>
      </DashboardCard>
    </div>
  );
}
