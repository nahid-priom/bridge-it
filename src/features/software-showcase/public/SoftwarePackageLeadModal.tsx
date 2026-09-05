'use client';

import { useEffect, useId, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { cn, focusVisibleRing } from '@/lib/cn';
import { ROUTES } from '@/lib/routes';
import { formatCatalogPrice } from '@/src/features/catalog/components/CatalogPrice';
import { WHATSAPP_CHANNEL } from '@/lib/config/social-links';
import type { SoftwarePackage } from '../types';
import { packageDisplayName, paymentTypeLabel } from './package-utils';
import { submitSoftwarePackageLeadAction } from '../admin/lead-actions';

type Intent = 'demo' | 'order';

export function SoftwarePackageLeadModal({
  open,
  onClose,
  intent,
  projectId,
  productSlug,
  productTitle,
  selectedPackage,
}: {
  open: boolean;
  onClose: () => void;
  intent: Intent;
  projectId: string;
  productSlug: string;
  productTitle: string;
  selectedPackage: SoftwarePackage | null;
}) {
  const titleId = useId();
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessLocation, setBusinessLocation] = useState('');
  const [requirement, setRequirement] = useState('');

  useEffect(() => {
    if (!open) return;
    setSuccess(false);
    setServerError(null);
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, selectedPackage?.id, intent]);

  if (!open) return null;

  const tierLabel = selectedPackage ? packageDisplayName(selectedPackage) : productTitle;
  const heading = intent === 'demo' ? 'Request Free Demo' : selectedPackage ? `Order ${tierLabel}` : 'Talk to Our Expert';

  const submit = () => {
    setServerError(null);
    startTransition(async () => {
      const result = await submitSoftwarePackageLeadAction({
        name,
        phone,
        business_name: businessName,
        business_location: businessLocation,
        requirement,
        software_project_id: projectId,
        package_id: selectedPackage?.id,
        product_slug: productSlug,
        product_title: productTitle,
        source_url: typeof window !== 'undefined' ? window.location.href : undefined,
        intent,
      });
      if (result.error) {
        setServerError(result.error);
        return;
      }
      if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'order_submit',
          category_root: 'software',
          product: productSlug,
          package: selectedPackage?.name,
          package_tier: selectedPackage?.tier,
          intent,
        });
      }
      setSuccess(true);
    });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center" role="presentation">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[1] max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl border border-border-subtle bg-surface p-5 shadow-xl sm:max-w-md sm:rounded-2xl sm:p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 id={titleId} className="font-display text-xl font-black text-text-primary">
            {success ? 'Request Submitted' : heading}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={cn(focusVisibleRing, 'rounded-lg p-1.5 text-text-muted hover:bg-background-soft')}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {success ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-text-secondary">
              Selected: <span className="font-semibold text-text-primary">{productTitle}</span>
              {' — '}
              <span className="font-semibold text-text-primary">{tierLabel}</span>
            </p>
            <p className="text-sm text-text-secondary">Our team will contact you shortly.</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <a
                href={WHATSAPP_CHANNEL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                WhatsApp Us
              </a>
              <Link
                href={ROUTES.softwareShowroom}
                className="inline-flex items-center justify-center rounded-xl border border-border-subtle px-4 py-2.5 text-sm font-semibold"
              >
                Back to Software
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-border-subtle bg-background-soft/80 px-4 py-3 text-sm">
              <p>
                <span className="text-text-muted">Software:</span>{' '}
                <span className="font-semibold">{productTitle}</span>
              </p>
              {selectedPackage ? (
                <>
                  <p className="mt-1">
                    <span className="text-text-muted">Package:</span>{' '}
                    <span className="font-semibold">{tierLabel}</span>
                  </p>
                  <p className="mt-1">
                    <span className="text-text-muted">Price:</span>{' '}
                    <span className="font-semibold tabular-nums">
                      {formatCatalogPrice(selectedPackage.price, {
                        currency: selectedPackage.currency,
                      })}
                    </span>
                  </p>
                  <p className="mt-1 text-text-muted">
                    {paymentTypeLabel(selectedPackage.payment_type)}
                  </p>
                </>
              ) : null}
            </div>

            {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}

            <label className="block text-sm font-semibold">
              Full Name *
              <input
                ref={firstFieldRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border-subtle bg-surface px-3 py-2.5"
                autoComplete="name"
                required
              />
            </label>
            <label className="block text-sm font-semibold">
              Phone Number *
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border-subtle bg-surface px-3 py-2.5"
                autoComplete="tel"
                required
              />
            </label>
            <label className="block text-sm font-semibold">
              Business Name
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border-subtle bg-surface px-3 py-2.5"
              />
            </label>
            <label className="block text-sm font-semibold">
              Business Location
              <input
                value={businessLocation}
                onChange={(e) => setBusinessLocation(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border-subtle bg-surface px-3 py-2.5"
              />
            </label>
            <label className="block text-sm font-semibold">
              Optional Requirement
              <textarea
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-xl border border-border-subtle bg-surface px-3 py-2.5"
              />
            </label>

            <button
              type="button"
              disabled={pending || !name.trim() || !phone.trim()}
              onClick={submit}
              className="w-full rounded-xl bg-[#0f2744] py-3 text-sm font-semibold text-white hover:bg-[#16375f] disabled:opacity-60 dark:bg-white dark:text-[#0f2744]"
            >
              {pending ? 'Submitting…' : intent === 'demo' ? 'Request Free Demo' : `Order ${tierLabel}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
