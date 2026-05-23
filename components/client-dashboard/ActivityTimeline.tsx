'use client';

import {
  FileUp,
  Flag,
  CreditCard,
  FileText,
  Headphones,
  MessageCircle,
} from 'lucide-react';
import { DashboardCard } from '@/components/client-dashboard/ui/DashboardCard';
import type { ClientActivity } from '@/types/client-dashboard';
import type { LucideIcon } from 'lucide-react';

const icons: Record<ClientActivity['type'], LucideIcon> = {
  file: FileUp,
  milestone: Flag,
  payment: CreditCard,
  invoice: FileText,
  support: Headphones,
  message: MessageCircle,
};

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString('en-BD', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

export function ActivityTimeline({
  activities,
  compact = false,
}: {
  activities: ClientActivity[];
  compact?: boolean;
}) {
  return (
    <DashboardCard className={compact ? 'p-4' : 'p-5 sm:p-6'}>
      {!compact && (
        <h3 className="text-base font-bold text-text-primary mb-4">Recent Activity</h3>
      )}
      {compact && (
        <h3 className="text-sm font-bold text-text-primary mb-3">Activity</h3>
      )}
      <ul className="space-y-3">
        {activities.map((act) => {
          const Icon = icons[act.type];
          return (
            <li key={act.id} className="flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-text-muted" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text-primary">{act.title}</p>
                <p className="text-xs text-text-muted line-clamp-2">{act.description}</p>
                <p className="text-[10px] text-text-muted mt-1">{formatTime(act.createdAt)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </DashboardCard>
  );
}
