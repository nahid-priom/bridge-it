'use client';

import { useState } from 'react';
import type { DemoFeatureFlags } from '@/types/bitp';
import { formatBdt } from '@/lib/format/currency';
import { useDemoCart } from '@/lib/ecommerce-demo/cart-store';
import { getDemoSessionId } from '@/lib/ecommerce-demo/demo-session';
import { submitDemoCartOrderAction } from '@/app/actions/ecommerce-demo';
import { hasFeature } from '@/lib/ecommerce-demo/feature-flags';

type DemoCheckoutProps = {
  flags: DemoFeatureFlags;
  demoSlug: string;
  onBack: () => void;
  onSuccess: (orderNumber: string) => void;
};

export function DemoCheckout({ flags, demoSlug, onBack, onSuccess }: DemoCheckoutProps) {
  const cart = useDemoCart();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const result = await submitDemoCartOrderAction({
      demoSlug,
      sessionId: getDemoSessionId(),
      customer_name: fd.get('name') as string,
      customer_phone: fd.get('phone') as string,
      customer_address: fd.get('address') as string,
      items: cart.items.map((i) => ({
        product_name: i.product.name,
        product_slug: i.product.slug,
        quantity: i.quantity,
        unit_price: Number(i.product.price),
        variant_label: i.variantLabel,
      })),
    });
    setPending(false);
    if (result.error) setError(result.error);
    else if (result.orderNumber) onSuccess(result.orderNumber);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-lg">
      <button type="button" onClick={onBack} className="text-sm text-emerald-600 font-semibold mb-4">← Back to cart</button>
      <h2 className="text-xl font-black mb-2">Checkout</h2>
      <p className="text-xs text-amber-600 font-semibold mb-6">Demo checkout — no real payment.</p>

      <div className="rounded-xl border border-slate-200 dark:border-white/10 p-4 mb-6 bg-slate-50 dark:bg-white/5">
        <p className="font-bold mb-2">Order Summary</p>
        {cart.items.map((i) => (
          <div key={i.product.id} className="flex justify-between text-sm py-1">
            <span>{i.product.name} × {i.quantity}</span>
            <span>{formatBdt(Number(i.product.price) * i.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between font-black mt-2 pt-2 border-t border-slate-200 dark:border-white/10">
          <span>Total</span>
          <span>{formatBdt(cart.total())}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label className="block text-sm font-semibold mb-1">Full Name *</label>
          <input name="name" required className="w-full rounded-xl border border-slate-200 dark:border-white/10 px-4 py-3 text-sm bg-white dark:bg-surface" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Phone *</label>
          <input name="phone" required type="tel" className="w-full rounded-xl border border-slate-200 dark:border-white/10 px-4 py-3 text-sm bg-white dark:bg-surface" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Delivery Address *</label>
          <textarea name="address" required rows={2} className="w-full rounded-xl border border-slate-200 dark:border-white/10 px-4 py-3 text-sm bg-white dark:bg-surface" />
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-white/10 p-4">
          <p className="font-semibold text-sm mb-2">Payment Method</p>
          <label className="flex items-center gap-2">
            <input type="radio" name="payment" defaultChecked disabled />
            <span>Cash on Delivery (COD)</span>
          </label>
          {hasFeature(flags, 'paymentGatewayUi') && (
            <p className="text-xs text-text-secondary mt-2">Payment gateway integration available in live deployment (Demo).</p>
          )}
        </div>
        {hasFeature(flags, 'fraudCheckerUi') && (
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-3 text-sm">
            ✓ Fraud checker passed (Demo simulation)
          </div>
        )}
        <button type="submit" disabled={pending} className="deshi-btn-primary w-full py-3.5 font-bold disabled:opacity-60">
          {pending ? 'Placing Demo Order...' : 'Place Demo Order'}
        </button>
      </form>
    </div>
  );
}
