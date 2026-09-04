import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function SectionContainer({
  children,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section';
}) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full max-w-[1480px] px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10',
        className
      )}
    >
      {children}
    </Tag>
  );
}

/** Shared vertical rhythm for portfolio category blocks. */
export const portfolioCategorySpacing =
  'scroll-mt-[calc(var(--header-offset)+0.75rem)] py-12 md:py-16 lg:py-20';
