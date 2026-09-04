'use client';

import { CheckCircle2, Circle } from 'lucide-react';
import { DashboardCard } from '@/components/client-dashboard/ui/DashboardCard';
import { StatusBadge } from '@/components/client-dashboard/ui/StatusBadge';
import type { ClientMilestone } from '@/types/client-dashboard';
import { cn } from '@/lib/cn';

export function MilestoneTracker({ milestones }: { milestones: ClientMilestone[] }) {
  return (
    <DashboardCard className="p-5 sm:p-6">
      <h3 className="text-base font-bold text-text-primary mb-4">Milestones</h3>
      <div className="space-y-4">
        {milestones.map((ms, i) => {
          const done = ms.status === 'paid' || ms.status === 'approved';
          return (
            <div key={ms.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                {done ? (
                  <CheckCircle2 className="w-6 h-6 text-deshi-green shrink-0" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-300 dark:text-white/20 shrink-0" />
                )}
                {i < milestones.length - 1 && (
                  <div
                    className={cn(
                      'w-0.5 flex-1 min-h-[2rem] mt-1',
                      done ? 'bg-deshi-green/40' : 'bg-slate-200 dark:bg-white/10'
                    )}
                  />
                )}
              </div>
              <div className="flex-1 pb-4 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm text-text-primary">{ms.title}</h4>
                  <StatusBadge status={ms.status} />
                </div>
                <p className="text-xs text-text-muted mb-2">
                  Due {ms.dueDate} · ৳{ms.amount.toLocaleString()}
                </p>
                <div className="h-1.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-deshi-green to-blue-500 rounded-full"
                    style={{ width: `${ms.progress}%` }}
                  />
                </div>
                {ms.status === 'in_review' && (
                  <button
                    type="button"
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-deshi-green text-white hover:brightness-105"
                  >
                    Approve milestone
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}
