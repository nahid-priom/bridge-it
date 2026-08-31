'use client';

import { useTransition } from 'react';
import { acceptQuotationAction } from '@/app/actions/bitp';

export function AcceptQuotationButton({ quotationId }: { quotationId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await acceptQuotationAction(quotationId);
        });
      }}
      className="deshi-btn-primary px-5 py-2.5 text-sm font-bold disabled:opacity-60 shrink-0"
    >
      {isPending ? 'Processing...' : 'Accept Quotation'}
    </button>
  );
}
