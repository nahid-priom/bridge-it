'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Store, ShoppingBag } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { useDashboardModeStore } from '@/store/dashboardModeStore';
import { cn } from '@/lib/cn';

export function SellerModeSwitcher({ compact }: { compact?: boolean }) {
  const router = useRouter();
  const mode = useDashboardModeStore((s) => s.mode);
  const setMode = useDashboardModeStore((s) => s.setMode);

  const switchTo = (next: 'buyer' | 'seller') => {
    setMode(next);
    router.push(next === 'seller' ? ROUTES.sellerDashboard : ROUTES.dashboard);
    router.refresh();
  };

  if (compact) {
    return (
      <Link
        href={ROUTES.dashboard}
        onClick={() => setMode('buyer')}
        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-text-secondary hover:bg-slate-100 dark:hover:bg-white/5"
      >
        <ShoppingBag className="w-3.5 h-3.5" />
        Buyer mode
      </Link>
    );
  }

  return (
    <div className="flex rounded-xl border border-slate-200/80 dark:border-white/10 p-0.5 bg-slate-50/80 dark:bg-white/5">
      <button
        type="button"
        onClick={() => switchTo('buyer')}
        className={cn(
          'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all',
          mode === 'buyer'
            ? 'bg-white dark:bg-slate-800 text-text-primary shadow-sm'
            : 'text-text-muted hover:text-text-secondary'
        )}
      >
        <ShoppingBag className="w-3.5 h-3.5" />
        Buyer
      </button>
      <button
        type="button"
        onClick={() => switchTo('seller')}
        className={cn(
          'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all',
          mode === 'seller'
            ? 'bg-gradient-to-r from-emerald-500/20 to-violet-500/15 text-deshi-green border border-emerald-500/25 shadow-sm'
            : 'text-text-muted hover:text-text-secondary'
        )}
      >
        <Store className="w-3.5 h-3.5" />
        Seller
      </button>
    </div>
  );
}
