'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Briefcase, CalendarCheck } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/cn';

type MobileQuickActionsProps = {
  cartCount?: number;
  messageCount?: number;
  onNavigate?: () => void;
  className?: string;
};

function QuickActionCard({
  href,
  label,
  icon,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        'flex items-center gap-2.5 px-3 py-2.5 rounded-xl',
        'bg-slate-50/90 dark:bg-white/[0.06]',
        'border border-slate-100/80 dark:border-white/[0.08]',
        'text-sm font-medium text-text-primary',
        'active:scale-[0.98] transition-transform'
      )}
    >
      {icon}
      <span className="flex-1 truncate">{label}</span>
    </Link>
  );
}

export function MobileQuickActions({
  cartCount: _cartCount = 0,
  messageCount: _messageCount = 0,
  onNavigate,
  className,
}: MobileQuickActionsProps) {
  void _cartCount;
  void _messageCount;

  return (
    <div className={cn('grid grid-cols-2 gap-2', className)}>
      <QuickActionCard
        href={ROUTES.explore}
        label="Portfolio"
        icon={<Briefcase className="w-4 h-4 text-[#2563eb] shrink-0" aria-hidden />}
        onNavigate={onNavigate}
      />
      <QuickActionCard
        href={ROUTES.consultation}
        label="Consultation"
        icon={<CalendarCheck className="w-4 h-4 text-deshi-green shrink-0" aria-hidden />}
        onNavigate={onNavigate}
      />
    </div>
  );
}
