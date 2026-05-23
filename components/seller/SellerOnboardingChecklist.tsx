'use client';

import Link from 'next/link';
import { CheckCircle2, Circle } from 'lucide-react';
import { SELLER_SETUP_TASKS, type SellerSetupTaskId } from '@/lib/seller/setup-progress';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/cn';

export function SellerOnboardingChecklist({ completedIds = [] }: { completedIds?: SellerSetupTaskId[] }) {
  const done = new Set(completedIds);

  return (
    <section className="rounded-2xl border border-border-subtle bg-surface/80 p-6">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg font-bold text-text-primary">Seller launch checklist</h2>
          <p className="text-sm text-text-secondary mt-1">
            All steps stay in your seller workspace — no buyer dashboard redirects.
          </p>
        </div>
        <Link
          href={ROUTES.sellerDashboardOnboarding}
          className="text-xs font-semibold text-deshi-green hover:underline shrink-0"
        >
          View guide
        </Link>
      </div>
      <ul className="space-y-2">
        {SELLER_SETUP_TASKS.map((step, index) => {
          const isDone = done.has(step.id);
          return (
            <li key={step.id}>
              <Link
                href={step.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors',
                  isDone
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : 'hover:bg-slate-100/80 dark:hover:bg-white/5'
                )}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-text-muted shrink-0" />
                )}
                <span className="text-sm font-medium">
                  <span className="text-text-muted mr-2">{index + 1}.</span>
                  {step.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
