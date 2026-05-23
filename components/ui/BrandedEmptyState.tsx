'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { PackageOpen } from 'lucide-react';
import { BRANDING } from '@/lib/config/branding';
import { heroTypography } from '@/lib/styles/design-tokens';
import { cn } from '@/lib/cn';

type BrandedEmptyStateProps = {
  title: string;
  highlightedText?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: ReactNode;
  className?: string;
};

export function BrandedEmptyState({
  title,
  highlightedText,
  description = `Nothing here yet — explore ${BRANDING.appName} to get started.`,
  actionLabel,
  actionHref,
  onAction,
  icon,
  className,
}: BrandedEmptyStateProps) {
  const action =
    actionLabel && actionHref ? (
      <Link
        href={actionHref}
        className="inline-flex items-center justify-center rounded-xl bg-deshi-green px-5 py-2.5 text-sm font-bold text-white hover:bg-deshi-green-dark transition-colors"
      >
        {actionLabel}
      </Link>
    ) : actionLabel && onAction ? (
      <button
        type="button"
        onClick={onAction}
        className="inline-flex items-center justify-center rounded-xl bg-deshi-green px-5 py-2.5 text-sm font-bold text-white hover:bg-deshi-green-dark transition-colors"
      >
        {actionLabel}
      </button>
    ) : null;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.02] px-6 py-14',
        className
      )}
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-deshi-green/10 text-deshi-green">
        {icon ?? <PackageOpen className="h-8 w-8" aria-hidden />}
      </div>
      <h3 className={cn(heroTypography.pageHeading, 'text-text-primary max-w-md')}>
        {title}
        {highlightedText && (
          <>
            {' '}
            <span className="text-deshi-green">{highlightedText}</span>
          </>
        )}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-text-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
