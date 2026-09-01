'use client';

import { useState } from 'react';
import { formatBdt } from '@/lib/format/currency';
import { verifyPaymentAdminAction } from '@/app/actions/bitp-admin-payments';
import type { BitpPayment } from '@/types/bitp';

type BitpPaymentManagerProps = {
  payments: BitpPayment[];
  onRefresh: () => void;
};

export function BitpPaymentManager({ payments, onRefresh }: BitpPaymentManagerProps) {
  const [pending, setPending] = useState<string | null>(null);

  const verify = async (paymentId: string, status: 'verified' | 'rejected') => {
    setPending(paymentId);
    const result = await verifyPaymentAdminAction(paymentId, status);
    setPending(null);
    if (result.error) alert(result.error);
    else onRefresh();
  };

  if (payments.length === 0) {
    return <p className="text-text-secondary">No payments yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-white/60">
            <th className="p-3">Client</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Method</th>
            <th className="p-3">Status</th>
            <th className="p-3">Reference</th>
            <th className="p-3 w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
              <td className="p-3 text-white/80 font-mono text-xs">{p.client_id.slice(0, 8)}…</td>
              <td className="p-3 text-white font-bold">{formatBdt(Number(p.amount))}</td>
              <td className="p-3 text-white/70 capitalize">{p.payment_method}</td>
              <td className="p-3 capitalize text-emerald-400">{p.payment_status}</td>
              <td className="p-3 text-white/60 text-xs">{p.transaction_reference ?? '—'}</td>
              <td className="p-3">
                {p.payment_status === 'pending' && (
                  <div className="flex gap-1">
                    <button
                      type="button"
                      disabled={pending === p.id}
                      onClick={() => verify(p.id, 'verified')}
                      className="px-2 py-1 rounded text-[10px] font-semibold bg-emerald-600 text-white disabled:opacity-50"
                    >
                      Verify
                    </button>
                    <button
                      type="button"
                      disabled={pending === p.id}
                      onClick={() => verify(p.id, 'rejected')}
                      className="px-2 py-1 rounded text-[10px] font-semibold border border-red-500/40 text-red-400 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
