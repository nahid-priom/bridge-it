'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { sellerSettingsNavItems } from '@/lib/seller-dashboard/config';
import { cn } from '@/lib/cn';

export function SellerSettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2">
      {sellerSettingsNavItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
              active
                ? 'bg-deshi-green text-white'
                : 'bg-surface border border-border-subtle text-text-secondary hover:text-text-primary'
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
