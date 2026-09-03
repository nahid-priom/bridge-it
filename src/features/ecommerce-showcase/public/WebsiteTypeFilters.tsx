import Link from 'next/link';
import { cn } from '@/lib/cn';
import { LISTING_VIEW_TABS } from '../config/constants';
import { websitesUrl } from '../utils/filters';

export function WebsiteTypeFilters({ className }: { className?: string }) {
  return (
    <div
      className={cn('-mx-4 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0', className)}
      role="navigation"
      aria-label="Browse by page type"
    >
      <div className="flex w-max gap-2">
        {LISTING_VIEW_TABS.map((tab) => {
          const href =
            tab.id === 'all' ? websitesUrl({}) : websitesUrl({ view: tab.id, page: tab.id });
          const active = tab.id === 'all';

          return (
            <Link
              key={tab.id}
              href={href}
              scroll={false}
              className={cn(
                'shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa]',
                active
                  ? 'border-[#2563eb] bg-[#2563eb] text-white'
                  : 'border-slate-200 bg-white text-text-secondary hover:border-[#2563eb]/50 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:border-[#2563eb]/40'
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
