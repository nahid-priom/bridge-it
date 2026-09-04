'use client';

import { Suspense, useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { submitConsultationAction } from '@/app/actions/bitp';
import { PageHero } from '@/components/ui/PageHero';
import { ROUTES } from '@/lib/routes';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/cn';

const SERVICES = [
  { value: 'Websites', label: 'Websites' },
  { value: 'Software', label: 'Software' },
  { value: 'Creative & Marketing', label: 'Creative & Marketing' },
  { value: 'Other', label: 'Other' },
] as const;

type FormState = {
  name: string;
  phone: string;
  email: string;
  business_name: string;
  service_interested_in: string;
  message: string;
  product_id: string;
};

const EMPTY: FormState = {
  name: '',
  phone: '',
  email: '',
  business_name: '',
  service_interested_in: '',
  message: '',
  product_id: '',
};

function ConsultationForm() {
  const searchParams = useSearchParams();
  const setNotification = useStore((s) => s.setNotification);
  const productPrefill = searchParams.get('product') ?? '';

  const initial = useMemo<FormState>(
    () => ({
      ...EMPTY,
      service_interested_in: productPrefill
        ? productPrefill.length > 40
          ? 'Other'
          : productPrefill
        : '',
      message: productPrefill ? `Interested in: ${productPrefill}` : '',
      product_id: searchParams.get('product_id') ?? '',
    }),
    [productPrefill, searchParams]
  );

  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<FormState>(initial);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const goNext = () => {
    setError(null);
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Name and phone are required.');
      return;
    }
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.service_interested_in) {
      setError('Please select a service.');
      return;
    }

    startTransition(async () => {
      const result = await submitConsultationAction({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        business_name: form.business_name.trim() || undefined,
        service_interested_in: form.service_interested_in,
        message: form.message.trim() || undefined,
        product_id: form.product_id || undefined,
      });
      if (result.error) {
        setError(result.error);
        setNotification(result.error);
        return;
      }
      setSuccess(true);
      setNotification('Consultation request sent — we will contact you soon.');
    });
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-black text-deshi-green mb-4">Thank You!</h2>
        <p className="text-text-secondary mb-6">
          We received your consultation request and will contact you shortly.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href={ROUTES.dashboard} className="deshi-btn-primary px-6 py-3 inline-block">
            Open Dashboard
          </Link>
          <Link href={ROUTES.home} className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold dark:border-white/10">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 dark:border-white/10 p-6 md:p-8">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
        <span className={cn(step === 1 ? 'text-bridge-primary' : 'text-deshi-green')}>1. Contact</span>
        <span aria-hidden>/</span>
        <span className={cn(step === 2 ? 'text-bridge-primary' : '')}>2. Need</span>
      </div>

      {error ? <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm dark:bg-red-500/10">{error}</div> : null}

      {step === 1 ? (
        <div className="space-y-4">
          {(
            [
              { key: 'name', label: 'Full Name', required: true, type: 'text' },
              { key: 'phone', label: 'Phone Number', required: true, type: 'tel' },
              { key: 'email', label: 'Email', required: false, type: 'email' },
              { key: 'business_name', label: 'Business Name', required: false, type: 'text' },
            ] as const
          ).map((field) => (
            <div key={field.key}>
              <label htmlFor={field.key} className="block text-sm font-semibold mb-1">
                {field.label}
                {field.required ? ' *' : ''}
              </label>
              <input
                id={field.key}
                type={field.type}
                required={field.required}
                value={form[field.key]}
                onChange={(e) => update(field.key, e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 px-4 py-3 text-sm bg-white dark:bg-surface"
              />
            </div>
          ))}
          <button type="button" onClick={goNext} className="deshi-btn-primary w-full py-3.5 font-bold">
            Continue
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label htmlFor="service_interested_in" className="block text-sm font-semibold mb-1">
              Service interested in *
            </label>
            <select
              id="service_interested_in"
              required
              value={form.service_interested_in}
              onChange={(e) => update('service_interested_in', e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 px-4 py-3 text-sm bg-white dark:bg-surface"
            >
              <option value="">Select a service</option>
              {SERVICES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-semibold mb-1">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 px-4 py-3 text-sm bg-white dark:bg-surface"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 rounded-xl border border-slate-200 py-3.5 text-sm font-bold dark:border-white/10"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="deshi-btn-primary flex-1 py-3.5 font-bold disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                'Request Free Consultation'
              )}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

export default function ConsultationPage() {
  return (
    <div className="pb-16">
      <PageHero
        variant="marketing"
        title="Get a"
        highlightedText="Free Consultation."
        subtitle="Tell us about your business and we'll recommend the right digital solution."
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-lg">
        <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5" />}>
          <ConsultationForm />
        </Suspense>
      </div>
    </div>
  );
}
