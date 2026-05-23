'use client';

import { Globe, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

type LanguageSelectorProps = {
  className?: string;
};

export function LanguageSelector({ className }: LanguageSelectorProps) {
  return (
    <div className={cn('relative hidden lg:block', className)}>
      <label htmlFor="nav-lang" className="sr-only">
        Language
      </label>
      <div className="relative flex items-center gap-1 pl-1">
        <Globe className="w-4 h-4 text-text-muted shrink-0" aria-hidden />
        <select
          id="nav-lang"
          defaultValue="en"
          className="appearance-none bg-transparent text-sm font-semibold text-text-secondary pr-7 py-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40 rounded-lg"
          aria-label="Select language"
        >
          <option value="en">EN</option>
          <option value="bn" disabled>
            BN (soon)
          </option>
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-text-muted absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden />
      </div>
    </div>
  );
}
