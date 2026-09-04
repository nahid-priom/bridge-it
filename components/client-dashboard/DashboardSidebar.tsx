'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Crown, LifeBuoy, X } from 'lucide-react';
import { BridgeLogo } from '@/components/brand/BridgeLogo';
import { clientNavItems } from '@/lib/client-dashboard/config';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/cn';

export function DashboardSidebar({
  collapsed,
  onCollapsedChange,
  mobileOpen,
  onMobileClose,
}: {
  collapsed: boolean;
  onCollapsedChange: (v: boolean) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === ROUTES.dashboard) return pathname === ROUTES.dashboard;
    return pathname.startsWith(href);
  };

  const content = (
    <div className="flex flex-col h-full">
      <div
        className={cn(
          'flex items-center border-b border-slate-200/80 dark:border-white/10 p-4',
          collapsed ? 'justify-center' : 'justify-between gap-2'
        )}
      >
        {!collapsed && (
          <Link href={ROUTES.home} className="shrink-0">
            <BridgeLogo variant="nav" />
          </Link>
        )}
        {collapsed && (
          <Link href={ROUTES.home} className="shrink-0 mx-auto">
            <BridgeLogo variant="mark" />
          </Link>
        )}
        <button
          type="button"
          onClick={() => onCollapsedChange(!collapsed)}
          className="hidden lg:flex p-2 rounded-lg text-text-muted hover:bg-slate-100 dark:hover:bg-white/10"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
        <button
          type="button"
          onClick={onMobileClose}
          className="lg:hidden p-2 rounded-lg text-text-muted"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {clientNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={onMobileClose}
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 rounded-xl text-sm font-medium transition-all',
                collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5',
                active
                  ? 'bg-gradient-to-r from-emerald-500/15 to-blue-500/10 text-deshi-green border border-emerald-500/20 shadow-sm'
                  : 'text-text-secondary hover:bg-slate-100/80 dark:hover:bg-white/5 border border-transparent'
              )}
            >
              <Icon className={cn('w-4 h-4 shrink-0', active && 'text-deshi-green')} />
              {!collapsed && (
                <>
                  <span className="truncate flex-1">{item.label}</span>
                  {item.badge != null && item.badge > 0 && (
                    <span className="shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-deshi-green text-white text-[10px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      <div className={cn('p-3 border-t border-slate-200/80 dark:border-white/10 space-y-2', collapsed && 'px-2')}>
        {!collapsed && (
          <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-emerald-500/10 border border-blue-500/20 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-text-primary">Pro Client</span>
            </div>
            <p className="text-[10px] text-text-muted mb-2">Priority support & lower fees</p>
            <button
              type="button"
              className="w-full py-1.5 rounded-lg bg-blue-600 text-white text-[11px] font-semibold"
            >
              Upgrade
            </button>
          </div>
        )}
        <Link
          href={ROUTES.clientSupport}
          className={cn(
            'flex items-center gap-2 rounded-xl text-xs font-semibold text-text-secondary hover:bg-slate-100 dark:hover:bg-white/5',
            collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'
          )}
        >
          <LifeBuoy className="w-4 h-4 shrink-0" />
          {!collapsed && 'Get Support'}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          'hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 z-40',
          'border-r border-slate-200/80 dark:border-white/10',
          'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl',
          'transition-[width] duration-300',
          collapsed ? 'lg:w-[72px]' : 'lg:w-64 xl:w-72'
        )}
      >
        {content}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-white/10 shadow-2xl"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
