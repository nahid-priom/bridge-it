'use client';

import { Suspense, useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { submitConsultationAction } from '@/app/actions/bitp';
import { ConsultationAtmosphere } from '@/components/consultation/ConsultationAtmosphere';
import { heroTypography, sectionSpacing } from '@/lib/styles/design-tokens';
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
  business_name: string;
  service_interested_in: string;
  message: string;
  product_id: string;
};

const EMPTY: FormState = {
  name: '',
  phone: '',
  business_name: '',
  service_interested_in: '',
  message: '',
  product_id: '',
};

const FIELD_CLASS =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm dark:border-white/10 dark:bg-surface';

function ConsultationForm() {
  const searchParams = useSearchParams();
  const setNotification = useStore((s) => s.setNotification);
  const productPrefill = searchParams.get('product') ?? '';
  const intent = searchParams.get('intent') ?? 'demo';
  const kind = searchParams.get('kind') ?? '';
  const industry = searchParams.get('industry') ?? '';

  const kindService =
    kind === 'software'
      ? 'Software'
      : kind === 'websites'
        ? 'Websites'
        : kind === 'marketing'
          ? 'Creative & Marketing'
          : '';

  const intentLabel = intent === 'order' ? 'Order interest' : 'Free demo request';

  const initial = useMemo<FormState>(
    () => ({
      ...EMPTY,
      service_interested_in:
        kindService ||
        (productPrefill ? (productPrefill.length > 40 ? 'Other' : productPrefill) : ''),
      message: [
        productPrefill ? `${intentLabel}: ${productPrefill}` : '',
        industry ? `Industry: ${industry}` : '',
        kind ? `Catalog: ${kind}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
      product_id: searchParams.get('product_id') ?? '',
    }),
    [productPrefill, searchParams, kindService, intentLabel, industry, kind]
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
    setNotification('Just one step more');
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
      <div className="rounded-2xl border border-slate-200 bg-surface/80 p-6 text-center dark:border-white/10 md:p-8">
        <h2 className="mb-3 text-2xl font-black text-deshi-green">Thank You!</h2>
        <p className="mb-6 text-text-secondary">
          We received your consultation request and will contact you shortly.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href={ROUTES.dashboard} className="deshi-btn-primary inline-block px-6 py-3">
            Open Dashboard
          </Link>
          <Link
            href={ROUTES.home}
            className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold dark:border-white/10"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-200/80 bg-white/70 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-surface/75 dark:shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:p-6 md:p-7"
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
        <span className={cn(step === 1 ? 'text-bridge-primary' : 'text-deshi-green')}>
          1. Contact
        </span>
        <span aria-hidden>/</span>
        <span className={cn(step === 2 ? 'text-bridge-primary' : '')}>2. Need</span>
      </div>

      {error ? (
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-500/10">
          {error}
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {(
              [
                { key: 'name', label: 'Full Name', required: true, type: 'text' },
                { key: 'phone', label: 'Phone Number', required: true, type: 'tel' },
                { key: 'business_name', label: 'Business Name', required: false, type: 'text' },
              ] as const
            ).map((field) => (
              <div
                key={field.key}
                className={cn('min-w-0', field.key === 'business_name' && 'sm:col-span-2')}
              >
                <label htmlFor={field.key} className="mb-1 block text-sm font-semibold">
                  {field.label}
                  {field.required ? ' *' : ''}
                </label>
                <input
                  id={field.key}
                  type={field.type}
                  required={field.required}
                  value={form[field.key]}
                  onChange={(e) => update(field.key, e.target.value)}
                  className={FIELD_CLASS}
                />
              </div>
            ))}
          </div>
          <button type="button" onClick={goNext} className="deshi-btn-primary w-full py-3 font-bold">
            Continue
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label htmlFor="service_interested_in" className="mb-1 block text-sm font-semibold">
              Service interested in *
            </label>
            <select
              id="service_interested_in"
              required
              value={form.service_interested_in}
              onChange={(e) => update('service_interested_in', e.target.value)}
              className={FIELD_CLASS}
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
            <label htmlFor="message" className="mb-1 block text-sm font-semibold">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
              className={FIELD_CLASS}
            />
          </div>
          <p className="text-xs leading-relaxed text-text-muted">
            By submitting, you agree to our{' '}
            <Link href={ROUTES.terms} className="font-semibold text-[#2563eb] underline">
              Terms & Conditions
            </Link>{' '}
            and acknowledge our{' '}
            <Link href={ROUTES.privacy} className="font-semibold text-[#2563eb] underline">
              Privacy Policy
            </Link>
            . We use your details only to respond to this consultation request.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold dark:border-white/10"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="deshi-btn-primary inline-flex flex-1 items-center justify-center gap-2 py-3 font-bold disabled:opacity-60"
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

function ConsultationCopy() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h1
        id="consultation-heading"
        className={cn(
          'mb-2 font-display font-black tracking-tight',
          'text-[1.35rem] leading-tight sm:text-2xl md:text-[1.75rem]'
        )}
      >
        <span className={heroTypography.h1Ink}>Get a </span>
        <span className={heroTypography.h1Accent}>Free Consultation.</span>
      </h1>
      <p className="mx-auto max-w-md text-center text-sm leading-relaxed text-text-muted sm:text-[0.9375rem]">
        Tell us about your business and we&apos;ll recommend the right digital solution.
      </p>
    </div>
  );
}

export default function ConsultationPage() {
  return (
    <section
      className={cn('relative w-full overflow-x-hidden pb-12 md:pb-14', sectionSpacing.heroCompact)}
      aria-labelledby="consultation-heading"
    >
      <ConsultationAtmosphere />

      <div className="relative z-[1] mx-auto flex w-full max-w-xl flex-col items-center gap-5 px-4 sm:gap-6 sm:px-6 lg:px-8">
        <ConsultationCopy />

        <div className="w-full min-w-0">
          <Suspense
            fallback={
              <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/5" />
            }
          >
            <ConsultationForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
