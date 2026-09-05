'use client';

import { ShoppingCart, MessageCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

export function OrderButton({
  onClick,
  disabled,
  className,
  fullWidth = true,
}: {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-xl bg-bridge-primary px-4 py-3 text-sm font-semibold text-white',
        'hover:bg-bridge-primary-dark disabled:opacity-50',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]',
        fullWidth && 'w-full',
        className
      )}
    >
      <ShoppingCart className="h-4 w-4 shrink-0" aria-hidden />
      Order Now
      <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
    </button>
  );
}

export function TalkToExpertButton({
  onClick,
  disabled,
  className,
  fullWidth = true,
}: {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-xl border border-border-subtle bg-surface px-4 py-3 text-sm font-semibold text-text-primary',
        'hover:border-bridge-primary/40 disabled:opacity-50',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]',
        fullWidth && 'w-full',
        className
      )}
    >
      <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
      Talk to Expert
    </button>
  );
}
