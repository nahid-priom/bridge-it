'use client';

import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-6',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-violet-50 dark:from-emerald-500/10 dark:to-violet-500/10 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-deshi-green dark:text-emerald-400" />
      </div>
      <h3 className="text-lg font-bold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-muted max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}
