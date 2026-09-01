'use client';

import { useEffect, useState } from 'react';
import type { EcommerceDemoConfig, DemoOrder } from '@/types/bitp';
import { formatBdt } from '@/lib/format/currency';
import { getDemoSessionId } from '@/lib/ecommerce-demo/demo-session';

type DemoCustomerAccountProps = {
  config: EcommerceDemoConfig;
  demoSlug: string;
  onBack: () => void;
};

export function DemoCustomerAccount({ config, demoSlug, onBack }: DemoCustomerAccountProps) {
  const [orders, setOrders] = useState<DemoOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const sessionId = getDemoSessionId();
      const res = await fetch(`/api/demo/orders?demoSlug=${demoSlug}&sessionId=${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders ?? []);
      }
      setLoading(false);
    }
    load();
  }, [demoSlug]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-lg">
      <button type="button" onClick={onBack} className="text-sm text-emerald-600 font-semibold mb-4">← Back to store</button>
      <h2 className="text-xl font-black mb-2">My Account (Demo)</h2>
      <p className="text-sm text-text-secondary mb-6">Demo customer dashboard — sample order history.</p>

      {loading ? (
        <p className="text-text-secondary">Loading...</p>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-slate-200 dark:border-white/10 p-8 text-center">
          <p className="text-text-secondary">No demo orders yet. Place an order to see it here.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => (
            <li key={o.id} className="rounded-xl border border-slate-200 dark:border-white/10 p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-sm font-bold">{o.order_number}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${o.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {o.status}
                </span>
              </div>
              <p className="text-sm text-text-secondary">{new Date(o.created_at).toLocaleDateString()}</p>
              <p className="font-black mt-1">{formatBdt(Number(o.total))}</p>
              {o.courier_status && (
                <p className="text-xs text-emerald-600 mt-1">Courier: {o.courier_status}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
