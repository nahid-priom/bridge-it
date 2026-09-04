'use client';

import Link from 'next/link';
import { CheckCircle2, ChevronRight, Circle, Sparkles } from 'lucide-react';
import { SELLER_SETUP_TASKS, type SellerSetupTaskId } from '@/lib/seller/setup-progress';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/cn';

export function SellerSetupProgress({
  percent,
  completedIds,
  compact = false,
}: {
  percent: number;
  completedIds: SellerSetupTaskId[];
  compact?: boolean;
}) {
  const done = new Set(completedIds);
  const remaining = SELLER_SETUP_TASKS.filter((t) => !done.has(t.id)).slice(0, compact ? 3 : 5);

  if (percent >= 100) {
    return (
      <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-r from-emerald-500/10 to-blue-500/5 p-4 flex items-center gap-3">
        <CheckCircle2 className="w-8 h-8 text-emerald-500 shrink-0" />
        <div>
          <p className="font-bold text-text-primary">Profile strength: 100%</p>
          <p className="text-sm text-text-secondary">Your seller workspace is fully set up.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-border-subtle bg-surface/80 backdrop-blur-sm overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-border-subtle flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 shrink-0">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.5" fill="none" className="stroke-slate-200 dark:stroke-white/10" strokeWidth="3" />
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                className="stroke-deshi-green"
                strokeWidth="3"
                strokeDasharray={`${percent} 100`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-deshi-green">
              {percent}%
            </span>
          </div>
          <div>
            <p className="font-bold text-text-primary flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-500" />
              Profile strength
            </p>
            <p className="text-xs text-text-secondary">Complete setup to boost visibility</p>
          </div>
        </div>
        <Link
          href={ROUTES.sellerDashboardOnboarding}
          className="text-xs font-semibold text-deshi-green hover:underline inline-flex items-center gap-0.5"
        >
          Full setup guide
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {!compact && (
        <div className="h-1.5 bg-slate-100 dark:bg-white/5 mx-4 sm:mx-5 rounded-full overflow-hidden -mt-1 mb-3">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}

      <ul className={cn('px-2 pb-2', compact ? 'space-y-0.5' : 'space-y-0.5')}>
        {remaining.map((step) => {
          const isDone = done.has(step.id);
          return (
            <li key={step.id}>
              <Link
                href={step.href}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors text-sm',
                  isDone
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'hover:bg-slate-100/80 dark:hover:bg-white/5 text-text-primary'
                )}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-text-muted shrink-0" />
                )}
                <span className="font-medium truncate flex-1">{step.label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-text-muted shrink-0" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
