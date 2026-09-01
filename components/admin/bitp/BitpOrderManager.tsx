'use client';

import { useState } from 'react';
import { formatBdt } from '@/lib/format/currency';
import {
  adminConfirmOrderAction,
  adminCreateProjectFromOrderAction,
  adminUpdateOrderStatusAction,
} from '@/app/actions/bitp-admin-orders';
import type { BitpOrder } from '@/types/bitp';

type BitpOrderManagerProps = {
  orders: BitpOrder[];
  onRefresh: () => void;
};

const STATUS_OPTIONS = [
  'pending',
  'requirements_submitted',
  'confirmed',
  'in_progress',
  'waiting_client',
  'completed',
  'cancelled',
];

export function BitpOrderManager({ orders, onRefresh }: BitpOrderManagerProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  const run = async (id: string, fn: () => Promise<{ error?: string | null }>) => {
    setPending(id);
    const result = await fn();
    setPending(null);
    if (result.error) alert(result.error);
    else onRefresh();
  };

  if (orders.length === 0) {
    return <p className="text-text-secondary">No orders yet.</p>;
  }

  return (
    <div className="space-y-3">
      {orders.map((o) => {
        const canConfirm = !['confirmed', 'in_progress', 'completed', 'cancelled'].includes(o.order_status);
        const requirements = o.requirements ?? [];

        return (
          <div key={o.id} className="rounded-xl border border-white/10 overflow-hidden">
            <button
              type="button"
              onClick={() => setExpanded(expanded === o.id ? null : o.id)}
              className="w-full p-4 flex justify-between items-start gap-4 text-left hover:bg-white/[0.02]"
            >
              <div>
                <p className="font-mono text-xs text-white/60">{o.order_number}</p>
                <p className="font-medium text-white">{o.product?.name}</p>
                <p className="text-sm text-white/60">
                  {o.client?.full_name ?? o.client?.email ?? 'Client'} ·{' '}
                  <span className="capitalize">{o.payment_status}</span>
                </p>
                <p className="text-sm text-white/60 capitalize">{o.order_status.replace(/_/g, ' ')}</p>
              </div>
              <p className="font-bold text-white shrink-0">{formatBdt(Number(o.total))}</p>
            </button>

            {expanded === o.id && (
              <div className="border-t border-white/10 p-4 space-y-3 bg-black/20">
                {requirements.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-white/50 mb-2">Requirements</p>
                    <dl className="space-y-2">
                      {requirements.map((r) => (
                        <div key={r.id} className="text-sm">
                          <dt className="text-white/50">{r.label}</dt>
                          <dd className="text-white/90">{r.value ?? '—'}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {canConfirm && (
                    <button
                      type="button"
                      disabled={pending === o.id}
                      onClick={() => run(o.id, () => adminConfirmOrderAction(o.id))}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50"
                    >
                      Confirm Order
                    </button>
                  )}
                  {o.order_status !== 'cancelled' && (
                    <button
                      type="button"
                      disabled={pending === o.id}
                      onClick={() =>
                        run(o.id, () =>
                          adminCreateProjectFromOrderAction({
                            orderId: o.id,
                            clientId: o.client_id,
                            productId: o.product_id,
                            title: o.product?.name ?? 'Project',
                          })
                        )
                      }
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/20 text-white hover:bg-white/5 disabled:opacity-50"
                    >
                      Create Project
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-white/50">Update status:</span>
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={pending === o.id || o.order_status === s}
                      onClick={() => run(o.id, () => adminUpdateOrderStatusAction(o.id, s))}
                      className="px-2 py-1 rounded text-[10px] font-semibold capitalize border border-white/10 text-white/70 hover:text-white disabled:opacity-40"
                    >
                      {s.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
