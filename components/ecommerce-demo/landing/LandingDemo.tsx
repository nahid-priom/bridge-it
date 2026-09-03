'use client';

import { useState } from 'react';
import { CheckCircle, MessageCircle, Star } from 'lucide-react';
import type { DemoStoreProduct, EcommerceDemoConfig } from '@/types/bitp';
import { formatBdt } from '@/lib/format/currency';
import { getDemoSessionId } from '@/lib/ecommerce-demo/demo-session';
import { submitDemoOrderAction } from '@/app/actions/ecommerce-demo';
import { whatsappUrl } from '@/lib/config/branding';

type LandingDemoProps = {
  config: EcommerceDemoConfig;
  productSlug: string;
};

export function LandingDemo({ config, productSlug }: LandingDemoProps) {
  const hero = config.products?.[0];
  const [submitted, setSubmitted] = useState(false);
  const [orderNum, setOrderNum] = useState('');
  const [pending, setPending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setSubmitError(null);
    const fd = new FormData(e.currentTarget);
    const result = await submitDemoOrderAction({
      demoSlug: config.product?.internal_demo_slug ?? productSlug,
      sessionId: getDemoSessionId(),
      customer_name: fd.get('name') as string,
      customer_phone: fd.get('phone') as string,
      customer_address: fd.get('address') as string,
      quantity: Number(fd.get('quantity') || 1),
      product_name: hero?.name ?? 'Demo Product',
      product_slug: hero?.slug,
      unit_price: Number(hero?.price ?? 1290),
    });
    setPending(false);
    if (result.error) {
      setSubmitError(result.error);
      return;
    }
    if (result.orderNumber) {
      setOrderNum(result.orderNumber);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-lg">
        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" aria-hidden />
        <h2 className="text-2xl font-black mb-2">Demo Order Placed!</h2>
        <p className="text-text-secondary mb-2">Order #{orderNum}</p>
        <p className="text-sm text-amber-600 dark:text-amber-400 font-semibold mb-6">
          This is a demo — no real order was created.
        </p>
        <a
          href={whatsappUrl(`Demo order ${orderNum}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="deshi-btn-outline inline-flex items-center gap-2 px-6 py-3"
        >
          <MessageCircle className="w-4 h-4" aria-hidden />
          WhatsApp CTA (Demo)
        </a>
      </div>
    );
  }

  return (
    <LandingContent hero={hero} onSubmit={handleSubmit} pending={pending} submitError={submitError} />
  );
}

function heroPlaceholder(vertical: string | null | undefined): string {
  if (vertical === 'gadget') return '🎧';
  if (vertical === 'fashion') return '👗';
  if (vertical === 'cosmetics') return '💄';
  return '🛍️';
}

function LandingContent({
  hero,
  onSubmit,
  pending,
  submitError,
}: {
  hero?: DemoStoreProduct;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  pending: boolean;
  submitError?: string | null;
}) {
  return (
    <div className="bg-white dark:bg-[#0f1424]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-12 md:py-20">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-emerald-200 text-sm font-semibold uppercase tracking-wide">Limited Offer</span>
            <h1 className="text-3xl md:text-5xl font-black mt-2 mb-4">{hero?.name ?? 'Premium Product'}</h1>
            <p className="text-emerald-100 text-lg mb-6">{hero?.description}</p>
            <p className="text-4xl font-black">{formatBdt(Number(hero?.price ?? 1290))}</p>
            <div className="flex items-center gap-1 mt-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" aria-hidden />
              ))}
              <span className="text-sm text-emerald-200 ml-2">Sample reviews (Demo)</span>
            </div>
          </div>
          <div className="relative aspect-square rounded-2xl bg-white/10 overflow-hidden flex items-center justify-center">
            {hero?.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={hero.image_url} alt={hero.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-8xl" aria-hidden>{heroPlaceholder(hero?.vertical)}</span>
            )}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-black mb-6 text-center">Why Choose This Product?</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {['Premium Quality', 'Fast COD Delivery', 'Easy Returns'].map((b) => (
            <div key={b} className="rounded-xl border border-slate-200 dark:border-white/10 p-5 text-center">
              <p className="font-bold">{b}</p>
              <p className="text-sm text-text-secondary mt-1">Demo benefit copy</p>
            </div>
          ))}
        </div>
      </section>

      {/* Order Form */}
      <section className="bg-slate-50 dark:bg-[#0a0e1a] py-12">
        <div className="container mx-auto px-4 max-w-md">
          <h2 className="text-xl font-black mb-6 text-center">Place COD Order</h2>
          {submitError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 text-sm">{submitError}</div>
          )}
          <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 dark:border-white/10 p-6 bg-white dark:bg-[#0f1424]">
            <div>
              <label className="block text-sm font-semibold mb-1">Name *</label>
              <input name="name" required className="w-full rounded-xl border border-slate-200 dark:border-white/10 px-4 py-3 text-sm bg-white dark:bg-surface" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Phone *</label>
              <input name="phone" required type="tel" className="w-full rounded-xl border border-slate-200 dark:border-white/10 px-4 py-3 text-sm bg-white dark:bg-surface" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Address *</label>
              <textarea name="address" required rows={2} className="w-full rounded-xl border border-slate-200 dark:border-white/10 px-4 py-3 text-sm bg-white dark:bg-surface" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Quantity</label>
              <input name="quantity" type="number" min={1} defaultValue={1} className="w-full rounded-xl border border-slate-200 dark:border-white/10 px-4 py-3 text-sm bg-white dark:bg-surface" />
            </div>
            <button type="submit" disabled={pending} className="deshi-btn-primary w-full py-3.5 font-bold disabled:opacity-60">
              {pending ? 'Placing Demo Order...' : 'Place Demo Order'}
            </button>
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-12 max-w-2xl">
        <h2 className="text-xl font-black mb-4">FAQ</h2>
        {[
          { q: 'Is COD available?', a: 'Yes, Cash on Delivery is available nationwide (Demo).' },
          { q: 'How fast is delivery?', a: '2–5 business days (Demo timeline).' },
        ].map((f) => (
          <details key={f.q} className="border-b border-slate-200 dark:border-white/10 py-3">
            <summary className="font-semibold cursor-pointer">{f.q}</summary>
            <p className="text-sm text-text-secondary mt-2">{f.a}</p>
          </details>
        ))}
      </section>
    </div>
  );
}
