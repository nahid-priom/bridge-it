'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { submitConsultationAction } from '@/app/actions/bitp';
import { PageHero } from '@/components/ui/PageHero';
import { ROUTES } from '@/lib/routes';

export default function ConsultationPage() {
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
        service_interested: form.get('service_interested') as string,
        message: form.get('message') as string,
      });
      if (result.error) setError(result.error);
      else setSuccess(true);
    });
  };

  return (
    <div className="pb-16">
      <PageHero
        variant="marketing"
        title="Get a"
        highlightedText="Free Consultation."
        subtitle="Tell us about your business and we'll recommend the right digital solution."
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-lg">
        {success ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-black text-deshi-green mb-4">Thank You!</h2>
            <p className="text-text-secondary mb-6">We received your consultation request and will contact you shortly.</p>
            <Link href={ROUTES.home} className="deshi-btn-primary px-6 py-3 inline-block">Back to Home</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 dark:border-white/10 p-6 md:p-8">
            {error && <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}
            {[
              { name: 'name', label: 'Full Name', required: true },
              { name: 'phone', label: 'Phone Number', required: true },
              { name: 'business_name', label: 'Business Name', required: false },
              { name: 'service_interested', label: 'Service Interested In', required: false },
            ].map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name} className="block text-sm font-semibold mb-1">
                  {field.label}{field.required ? ' *' : ''}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  required={field.required}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 px-4 py-3 text-sm bg-white dark:bg-surface"
                />
              </div>
            ))}
            <div>
              <label htmlFor="message" className="block text-sm font-semibold mb-1">Message</label>
              <textarea id="message" name="message" rows={4} className="w-full rounded-xl border border-slate-200 dark:border-white/10 px-4 py-3 text-sm bg-white dark:bg-surface" />
            </div>
            <button type="submit" disabled={isPending} className="deshi-btn-primary w-full py-3.5 font-bold disabled:opacity-60">
              {isPending ? 'Submitting...' : 'Request Free Consultation'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
