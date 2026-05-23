'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { DeshiFiverrLogo } from '@/components/brand/DeshiFiverrLogo';
import { SellerModeSwitcher } from '@/components/seller-dashboard/SellerModeSwitcher';
import { sellerNavItems, isSellerNavActive } from '@/lib/seller-dashboard/config';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/cn';

const sections = [
  { key: 'main', label: 'Workspace' },
  { key: 'finance', label: 'Finance' },
  { key: 'growth', label: 'Growth' },
  { key: 'account', label: 'Account' },
] as const;

export function SellerSidebar({
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

  const content = (
    <div className="flex flex-col h-full">
      <div
        className={cn(
          'flex items-center border-b border-slate-200/80 dark:border-white/10 p-4',
          collapsed ? 'justify-center' : 'justify-between gap-2'
        )}
      >
        {!collapsed && (
          <Link href={ROUTES.sellerDashboard} className="shrink-0" onClick={onMobileClose}>
            <DeshiFiverrLogo size="nav" showText />
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

      {!collapsed && (
        <div className="px-3 pt-3">
          <SellerModeSwitcher />
        </div>
      )}

      <nav className="flex-1 overflow-y-auto p-2 space-y-4">
        {sections.map(({ key, label }) => {
          const items = sellerNavItems.filter((n) => n.section === key);
          if (!items.length) return null;
          return (
            <div key={key}>
              {!collapsed && (
                <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  {label}
                </p>
              )}
              <div className="space-y-0.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  const active = isSellerNavActive(pathname, item.href);
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
                          ? 'bg-gradient-to-r from-emerald-500/15 to-violet-500/10 text-deshi-green border border-emerald-500/20 shadow-sm'
                          : 'text-text-secondary hover:bg-slate-100/80 dark:hover:bg-white/5 border border-transparent'
                      )}
                    >
                      <Icon className={cn('w-4 h-4 shrink-0', active && 'text-deshi-green')} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {collapsed && (
        <div className="p-2 border-t border-slate-200/80 dark:border-white/10">
          <SellerModeSwitcher compact />
        </div>
      )}
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          'hidden lg:flex flex-col fixed inset-y-0 left-0 z-40 border-r border-slate-200/80 dark:border-white/10',
          'bg-white/95 dark:bg-slate-950/90 backdrop-blur-xl transition-[width] duration-300',
          collapsed ? 'w-[72px]' : 'w-64 xl:w-72'
        )}
      >
        {content}
      </aside>

      {mobileOpen && (
        <button
          type="button"
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm"
          aria-label="Close menu overlay"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 z-50 w-72 flex flex-col border-r border-slate-200/80 dark:border-white/10',
          'bg-white dark:bg-slate-950 transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {content}
      </aside>
    </>
  );
}
