'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useWebsiteSearchPlaceholder } from '@/hooks/useWebsiteSearchPlaceholder';

export function WebsiteSearch({
  id,
  value,
  onChange,
  className,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const typed = useWebsiteSearchPlaceholder(value.length === 0);

  return (
    <div className={cn('w-full', className)}>
      <label htmlFor={id} className="sr-only">
        Search website designs
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
          aria-hidden
        />
        <input
          id={id}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={typed.onFocus}
          onBlur={typed.onBlur}
          placeholder={typed.placeholder}
          autoComplete="off"
          className={cn(
            'w-full rounded-[18px] border border-slate-300 bg-white py-3 pl-10 pr-3 dark:border-white/40 dark:bg-[#0c1520]',
            'text-base text-text-primary outline-none placeholder:text-text-muted',
            'focus-visible:ring-2 focus-visible:ring-[#2563eb]/40'
          )}
        />
      </div>
    </div>
  );
}
