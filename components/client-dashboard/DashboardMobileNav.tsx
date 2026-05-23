'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, MessageSquare, Wallet, Menu } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/cn';

const items = [
  { href: ROUTES.dashboard, icon: LayoutDashboard, label: 'Home' },
  { href: ROUTES.clientOrders, icon: ShoppingBag, label: 'Orders' },
  { href: ROUTES.clientMessages, icon: MessageSquare, label: 'Chat' },
  { href: ROUTES.clientWallet, icon: Wallet, label: 'Wallet' },
];

export function DashboardMobileNav({ onMenuOpen }: { onMenuOpen: () => void }) {
  const pathname = usePathname();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-white/10"
      aria-label="Dashboard mobile navigation"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {items.map(({ href, icon: Icon, label }) => {
          const active =
            href === ROUTES.dashboard ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-semibold min-w-[56px]',
                active ? 'text-deshi-green' : 'text-text-muted'
              )}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={onMenuOpen}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-semibold text-text-muted min-w-[56px]"
        >
          <Menu className="w-5 h-5" />
          More
        </button>
      </div>
    </nav>
  );
}
