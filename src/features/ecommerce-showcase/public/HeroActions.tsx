import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { ROUTES } from '@/lib/routes';

export function HeroActions({ className }: { className?: string }) {
  return (
    <div className={cn('flex w-full flex-col gap-2 sm:flex-row lg:w-auto', className)}>
      <Link
        href={ROUTES.websites}
        className={cn(
          'inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-5 py-0 text-sm font-semibold text-white lg:w-auto lg:min-w-[10.5rem] lg:px-5',
          'bg-[#2563eb] shadow-[0_8px_24px_-8px_rgba(37,99,235,0.55)]',
          'transition-[background-color,box-shadow,transform] duration-200',
          'hover:bg-[#1d4ed8] hover:shadow-[0_10px_28px_-8px_rgba(37,99,235,0.65)]',
          'active:translate-y-px',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa]',
          'motion-reduce:transition-none motion-reduce:hover:shadow-none'
        )}
      >
        Explore Websites
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
      <Link
        href={ROUTES.softwareShowroom}
        className={cn(
          'inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border-subtle bg-surface px-5 py-0 text-sm font-semibold text-text-primary lg:w-auto lg:min-w-[10.5rem] lg:px-5',
          'transition-[border-color,background-color,transform] duration-200',
          'hover:border-[#2563eb]/40',
          'active:translate-y-px',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa]'
        )}
      >
        Explore Software
      </Link>
    </div>
  );
}
