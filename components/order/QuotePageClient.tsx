'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import type { BitpProductDetail } from '@/types/bitp';
import { submitConsultationAction } from '@/app/actions/bitp';
import { ROUTES } from '@/lib/routes';

type QuotePageClientProps = {
  product: BitpProductDetail;
};

export function QuotePageClient({ product }: QuotePageClientProps) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(null);

    startTransition(async () => {
      const result = await submitConsultationAction({
        name: form.get('name') as string,
        phone: form.get('phone') as string,
        business_name: form.get('business_name') as string,
        service_interested_in: product.name,
        message: form.get('message') as string,
        product_id: product.id,
      });

      if (result.error) setError(result.error);
      else setSuccess(true);
    });
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center">
        <h1 className="text-2xl font-black text-deshi-green mb-4">Quote Request Received!</h1>
        <p className="text-text-secondary mb-6">We will review your requirements and send you a quotation soon.</p>
        <Link href={ROUTES.dashboard} className="deshi-btn-primary px-6 py-3 inline-block">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-lg">
      <nav className="text-sm text-text-secondary mb-6">
        <Link href={ROUTES.solution(product.slug)} className="hover:text-deshi-green">{product.name}</Link>
        <span className="mx-2">/</span>
        <span>Request Quote</span>
      </nav>

      <h1 className="text-2xl font-black mb-2">Request a Custom Quote</h1>
      <p className="text-text-secondary mb-6">Tell us about your project and we will prepare a tailored quotation.</p>

      {error && <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {(['name', 'phone', 'business_name'] as const).map((field) => (
          <div key={field}>
            <label htmlFor={field} className="block text-sm font-semibold mb-1 capitalize">
              {field.replace('_', ' ')}{field === 'name' || field === 'phone' ? ' *' : ''}
            </label>
            <input
              id={field}
              name={field}
              required={field === 'name' || field === 'phone'}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 px-4 py-3 text-sm bg-white dark:bg-surface"
            />
          </div>
        ))}
        <div>
          <label htmlFor="message" className="block text-sm font-semibold mb-1">Project Requirements *</label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="w-full rounded-xl border border-slate-200 dark:border-white/10 px-4 py-3 text-sm bg-white dark:bg-surface"
          />
        </div>
        <button type="submit" disabled={isPending} className="deshi-btn-primary w-full py-3.5 font-bold disabled:opacity-60">
          {isPending ? 'Submitting...' : 'Submit Quote Request'}
        </button>
      </form>
    </div>
  );
}
