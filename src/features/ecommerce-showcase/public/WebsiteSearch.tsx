'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/cn';

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
  return (
    <div className={cn('w-full lg:w-[360px] xl:w-[400px]', className)}>
      <label htmlFor={id} className="sr-only">
        Search website designs
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
          aria-hidden
        />
        <input
          id={id}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search website designs..."
          autoComplete="off"
          className={cn(
            'w-full rounded-xl border border-border-subtle bg-surface py-2.5 pl-10 pr-3',
            'text-base text-text-primary outline-none placeholder:text-text-muted',
            'focus-visible:ring-2 focus-visible:ring-[#2563eb]/40'
          )}
        />
      </div>
    </div>
  );
}
