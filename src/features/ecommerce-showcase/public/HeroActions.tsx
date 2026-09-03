import Link from 'next/link';
import { ArrowRight, Send } from 'lucide-react';
import { cn } from '@/lib/cn';

export function HeroActions({ className }: { className?: string }) {
  return (
    <div className={cn('flex w-full max-w-[540px] flex-col gap-3', className)}>
      <Link
        href="/websites"
        className={cn(
          'inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold text-white',
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
        href="/consultation"
        className={cn(
          'inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold',
          'border border-slate-300 bg-transparent text-text-primary',
          'dark:border-white/25 dark:text-white',
          'transition-[border-color,background-color,transform] duration-200',
          'hover:border-[#2563eb]/60 hover:bg-[#2563eb]/10',
          'active:translate-y-px',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa]',
          'motion-reduce:transition-none'
        )}
      >
        <Send className="h-4 w-4" aria-hidden />
        Free Demo
      </Link>
    </div>
  );
}
