import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';

export type SkeletonProps = {
  className?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  style?: CSSProperties;
};

const roundedMap = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
} as const;

/**
 * Theme-aware base skeleton. Uses design tokens — not hard-coded gray.
 * Respects prefers-reduced-motion via motion-reduce:animate-none.
 */
export function Skeleton({ className, rounded = 'md', style }: SkeletonProps) {
  return (
    <div
      aria-hidden
      style={style}
      className={cn(
        'bg-background-soft dark:bg-white/10',
        'animate-pulse motion-reduce:animate-none',
        roundedMap[rounded],
        className
      )}
    />
  );
}
