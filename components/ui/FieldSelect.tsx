'use client';

import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export const fieldControlClass =
  'w-full rounded-xl border border-border bg-popover px-3 py-2 text-sm text-popover-foreground disabled:opacity-60';

export const FieldSelect = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function FieldSelect({ className, children, ...props }, ref) {
    return (
      <select ref={ref} {...props} className={cn('field-select', fieldControlClass, className)}>
        {children}
      </select>
    );
  }
);
