import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { ROUTES } from '@/lib/routes';
import { HeroSearch } from '@/src/features/ecommerce-showcase/public/HeroSearch';

export function HeroActions({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-3',
        className
      )}
    >
      <HeroSearch className="min-w-0 flex-1" />
      <Link
        href={`${ROUTES.explore}?type=websites`}
        className={cn(
          'inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white sm:w-auto sm:min-w-[11.5rem]',
          'bg-[#2563eb] shadow-[0_8px_24px_-8px_rgba(37,99,235,0.55)]',
          'transition-[background-color,box-shadow,transform] duration-200',
          'hover:bg-[#1d4ed8] hover:shadow-[0_10px_28px_-8px_rgba(37,99,235,0.65)]',
          'active:translate-y-px',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa]',
          'motion-reduce:transition-none motion-reduce:hover:shadow-none'
        )}
      >
        Explore Us
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}
