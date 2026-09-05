'use client';

import { cn } from '@/lib/cn';
import { OrderButton, TalkToExpertButton } from './ProductCtaButtons';

export function StickyProductCTA({
  onOrder,
  onTalk,
  disabled,
  className,
}: {
  onOrder: () => void;
  onTalk: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-surface/95 px-4 py-3 backdrop-blur lg:hidden',
        'pb-[max(0.75rem,env(safe-area-inset-bottom))]',
        className
      )}
    >
      <div className="mx-auto flex max-w-lg gap-2">
        <OrderButton onClick={onOrder} disabled={disabled} className="min-h-11 flex-1 py-2.5" />
        <TalkToExpertButton
          onClick={onTalk}
          disabled={disabled}
          className="min-h-11 flex-1 py-2.5"
        />
      </div>
    </div>
  );
}
