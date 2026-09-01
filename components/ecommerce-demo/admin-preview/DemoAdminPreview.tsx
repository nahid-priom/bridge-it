'use client';

import { useState, useEffect } from 'react';
import { Package, Truck, BarChart3, ShoppingBag, Users, CreditCard } from 'lucide-react';
import type { DemoOrder, EcommerceDemoConfig } from '@/types/bitp';
import { formatBdt } from '@/lib/format/currency';
import { getDemoSessionId } from '@/lib/ecommerce-demo/demo-session';

type DemoAdminPreviewProps = {
  config: EcommerceDemoConfig;
  demoSlug: string;
  onBack: () => void;
};

const COURIER_STEPS = ['New Order', 'Confirmed', 'Courier Ready', 'Shipped', 'Delivered'];

export function DemoAdminPreview({ config, demoSlug, onBack }: DemoAdminPreviewProps) {
  const modules = config.admin_modules ?? [];
  const [tab, setTab] = useState(modules[0] ?? 'orders');
  const [courierStep, setCourierStep] = useState(0);
  const [sessionOrders, setSessionOrders] = useState<DemoOrder[]>([]);
  const flags = config.feature_flags;

  useEffect(() => {
    const sessionId = getDemoSessionId();
    fetch(`/api/demo/orders?demoSlug=${encodeURIComponent(demoSlug)}&sessionId=${encodeURIComponent(sessionId)}`)
      .then((r) => r.json())
      .then((d) => setSessionOrders(d.orders ?? []))
      .catch(() => setSessionOrders([]));
  }, [demoSlug]);

  useEffect(() => {
    if (!flags.courierFlow) return;
    const timer = setInterval(() => {
      setCourierStep((s) => (s < COURIER_STEPS.length - 1 ? s + 1 : s));
    }, 3000);
    return () => clearInterval(timer);
  }, [flags.courierFlow]);

  const tabs = [
    { id: 'products', label: 'Products', icon: Package, show: modules.includes('products') },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, show: modules.includes('orders') },
    { id: 'customers', label: 'Customers', icon: Users, show: modules.includes('customers') },
    { id: 'inventory', label: 'Inventory', icon: Package, show: modules.includes('inventory') },
    { id: 'courier', label: 'Courier', icon: Truck, show: modules.includes('courier') || flags.courierFlow },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, show: modules.includes('analytics') || flags.analytics },
    { id: 'payments', label: 'Payments', icon: CreditCard, show: modules.includes('payments') },
    { id: 'reports', label: 'Reports', icon: BarChart3, show: modules.includes('reports') },
  ].filter((t) => t.show);

  const demoProducts = config.products ?? [];

  return (
    <div className="bg-slate-100 dark:bg-[#0a0e1a] min-h-[80vh]">
      <div className="bg-[#0f2744] text-white px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-emerald-400 font-semibold uppercase">Admin Preview (Demo)</p>
          <p className="font-bold">{config.product?.name ?? 'Store'} Dashboard</p>
        </div>
        <button type="button" onClick={onBack} className="text-sm text-white/70 hover:text-white">← Storefront</button>
      </div>

      <div className="flex flex-col md:flex-row min-h-[70vh]">
        <nav className="md:w-48 bg-white dark:bg-[#0f1424] border-r border-slate-200 dark:border-white/10 p-2 flex md:flex-col gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap ${tab === t.id ? 'bg-emerald-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-white/5'}`}
            >
              <t.icon className="w-4 h-4" aria-hidden />
              {t.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 p-4 md:p-6">
          {tab === 'products' && (
            <div>
              <h2 className="font-black mb-4">Product Management (Demo)</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {demoProducts.slice(0, 6).map((p) => (
                  <div key={p.id} className="rounded-xl border border-slate-200 dark:border-white/10 p-3 bg-white dark:bg-[#0f1424]">
                    <p className="font-semibold text-sm">{p.name}</p>
                    <p className="text-emerald-600 font-bold">{formatBdt(Number(p.price))}</p>
                    <p className="text-xs text-text-secondary">Stock: {p.stock} (Demo)</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'orders' && (
            <div>
              <h2 className="font-black mb-4">Order Management (Demo)</h2>
              <div className="rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden bg-white dark:bg-[#0f1424]">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-white/5">
                    <tr>
                      <th className="text-left p-3">Order</th>
                      <th className="text-left p-3 hidden sm:table-cell">Customer</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-right p-3">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessionOrders.length > 0 ? (
                      sessionOrders.map((o) => (
                        <tr key={o.id} className="border-t border-slate-100 dark:border-white/5">
                          <td className="p-3 font-mono text-xs">{o.order_number}</td>
                          <td className="p-3 hidden sm:table-cell">{o.customer_name ?? '—'}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 capitalize">
                              {o.status}
                            </span>
                          </td>
                          <td className="p-3 text-right font-bold">{formatBdt(Number(o.total))}</td>
                        </tr>
                      ))
                    ) : (
                      [
                        { id: 'DEMO-001', name: 'Rahim K.', status: 'Processing', total: 2490 },
                        { id: 'DEMO-002', name: 'Sadia M.', status: 'Shipped', total: 1890 },
                      ].map((o) => (
                        <tr key={o.id} className="border-t border-slate-100 dark:border-white/5">
                          <td className="p-3 font-mono text-xs">{o.id}</td>
                          <td className="p-3 hidden sm:table-cell">{o.name}</td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">{o.status}</span></td>
                          <td className="p-3 text-right font-bold">{formatBdt(o.total)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <p className="text-xs text-text-secondary p-3 border-t border-slate-100 dark:border-white/5">
                  {sessionOrders.length > 0
                    ? 'Showing demo orders from your current session.'
                    : 'Demo sample data — place a demo order to see session orders here.'}
                </p>
              </div>
            </div>
          )}

          {(tab === 'courier' || flags.courierFlow) && tab === 'courier' && (
            <div>
              <h2 className="font-black mb-4">Courier Workflow (Demo Simulation)</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {COURIER_STEPS.map((step, i) => (
                  <div
                    key={step}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold ${i <= courierStep ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-white/10 text-text-secondary'}`}
                  >
                    {step}
                  </div>
                ))}
              </div>
              <p className="text-sm text-text-secondary">Automated courier status progression (Demo — no real booking).</p>
            </div>
          )}

          {tab === 'analytics' && (
            <div>
              <h2 className="font-black mb-4">Sales Analytics (Demo)</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'Demo Revenue', value: '৳1.2L' },
                  { label: 'Demo Orders', value: '48' },
                  { label: 'Avg Order', value: '৳2,500' },
                  { label: 'Conversion', value: '3.2%' },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-slate-200 dark:border-white/10 p-4 bg-white dark:bg-[#0f1424]">
                    <p className="text-xs text-text-secondary">{s.label}</p>
                    <p className="text-xl font-black mt-1">{s.value}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-amber-600 font-semibold">All figures are labeled demo sample data.</p>
            </div>
          )}

          {(tab === 'customers' || tab === 'inventory' || tab === 'payments' || tab === 'reports') && (
            <div className="rounded-xl border border-slate-200 dark:border-white/10 p-8 text-center bg-white dark:bg-[#0f1424]">
              <p className="font-bold capitalize">{tab} Module</p>
              <p className="text-sm text-text-secondary mt-2">Preview available in live deployment. Demo simulation active.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
