'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import type { BitpProductDetail } from '@/types/bitp';
import { DynamicRequirementForm } from '@/components/order/DynamicRequirementForm';
import { PackageComparison } from '@/components/solutions/PackageComparison';
import { submitOrderAction } from '@/app/actions/bitp';
import { ROUTES } from '@/lib/routes';
import { formatPackagePrice } from '@/lib/format/currency';
import { getSolutionOrderPath } from '@/lib/solutions/product-routes';
import { cn } from '@/lib/cn';

type OrderPageClientProps = {
  product: BitpProductDetail;
  selectedPackageId?: string;
  solutionBasePath?: string;
  returnPath?: string;
};

type StoredOrderState = {
  formValues?: Record<string, string>;
  step?: 'package' | 'form' | 'review';
  packageId?: string;
};

function deriveDefaultReturnPath(product: BitpProductDetail, packageId?: string): string {
  return getSolutionOrderPath(product, packageId);
}

export function OrderPageClient({ product, selectedPackageId, solutionBasePath, returnPath }: OrderPageClientProps) {
  const orderReturnPath = returnPath ?? deriveDefaultReturnPath(product, selectedPackageId);
  const storageKey = `bitp-order:${orderReturnPath}`;
  const detailPath = solutionBasePath ?? `/solutions/${product.slug}`;

  const [localPackageId, setLocalPackageId] = useState<string | undefined>(selectedPackageId);
  const [step, setStep] = useState<'package' | 'form' | 'review'>('form');
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [hydrated, setHydrated] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const effectivePackageId = selectedPackageId ?? localPackageId;
  const selectedPackage = product.packages.find((p) => p.id === effectivePackageId) ?? product.packages[0];
  const needsPackagePick = product.packages.length > 1 && !effectivePackageId;

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredOrderState;
        if (parsed.formValues) setFormValues(parsed.formValues);
        if (parsed.packageId && !selectedPackageId) setLocalPackageId(parsed.packageId);
        if (parsed.step && !needsPackagePick) setStep(parsed.step === 'package' ? 'form' : parsed.step);
      }
    } catch {
      /* ignore */
    }
    if (needsPackagePick) setStep('package');
    setHydrated(true);
  }, [storageKey, needsPackagePick, selectedPackageId]);

  useEffect(() => {
    if (!hydrated) return;
    const payload: StoredOrderState = {
      formValues,
      step: needsPackagePick ? 'package' : step,
      packageId: effectivePackageId,
    };
    sessionStorage.setItem(storageKey, JSON.stringify(payload));
  }, [formValues, step, effectivePackageId, storageKey, hydrated, needsPackagePick]);

  const orderPathWithPackage = useMemo(() => {
    if (!effectivePackageId) return orderReturnPath;
    const base = orderReturnPath.split('?')[0];
    return `${base}?package=${effectivePackageId}`;
  }, [orderReturnPath, effectivePackageId]);

  const handleFormSubmit = (values: Record<string, string>) => {
    setFormValues(values);
    setStep('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmOrder = () => {
    setError(null);
    startTransition(async () => {
      const requirements = product.requirement_fields.map((field) => ({
        field_key: field.field_key,
        label: field.label,
        value: formValues[field.field_key] ?? '',
        field_id: field.id,
      }));

      const result = await submitOrderAction({
        product_id: product.id,
        package_id: selectedPackage?.id ?? null,
        requirements,
        return_path: orderPathWithPackage,
      });

      if (result?.error) {
        setError(result.error);
      }
    });
  };

  if (!hydrated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-text-secondary">
        Loading order form…
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-2xl">
      <nav className="text-sm text-text-secondary mb-6">
        <Link href={detailPath} className="hover:text-deshi-green">
          {product.name}
        </Link>
        <span className="mx-2">/</span>
        <span>Order</span>
      </nav>

      <h1 className="text-2xl font-black mb-2">
        {step === 'package'
          ? 'Choose Your Package'
          : step === 'form'
            ? 'Place Your Order'
            : 'Review Your Order'}
      </h1>
      {selectedPackage && step !== 'package' && (
        <p className="text-text-secondary mb-6">
          {selectedPackage.name} — {formatPackagePrice(Number(selectedPackage.price), selectedPackage.billing_type)}
        </p>
      )}

      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 text-sm">{error}</div>
      )}

      {step === 'package' ? (
        <div className="space-y-6">
          <p className="text-sm text-text-secondary">Select the package that fits your needs before continuing.</p>
          <div className="grid gap-3">
            {product.packages.map((pkg) => (
              <button
                key={pkg.id}
                type="button"
                onClick={() => {
                  setLocalPackageId(pkg.id);
                  setStep('form');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={cn(
                  'text-left rounded-2xl border p-5 transition-colors hover:border-deshi-green/40',
                  pkg.highlighted ? 'border-deshi-green bg-emerald-50/30 dark:bg-emerald-500/5' : 'border-slate-200 dark:border-white/10'
                )}
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <p className="font-bold">{pkg.name}</p>
                    {pkg.subtitle && <p className="text-sm text-text-secondary mt-1">{pkg.subtitle}</p>}
                  </div>
                  <p className="text-lg font-black shrink-0">{formatPackagePrice(Number(pkg.price), pkg.billing_type)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : step === 'form' ? (
        <>
          {product.packages.length > 1 && !selectedPackageId && (
            <button
              type="button"
              onClick={() => setStep('package')}
              className="text-sm text-deshi-green font-semibold mb-4 hover:underline"
            >
              ← Change package
            </button>
          )}
          {product.requirement_fields.length > 0 ? (
            <DynamicRequirementForm
              fields={product.requirement_fields}
              onSubmit={handleFormSubmit}
              submitting={false}
              initialValues={formValues}
              authReturnPath={orderPathWithPackage}
            />
          ) : (
            <button
              type="button"
              onClick={() => setStep('review')}
              className="deshi-btn-primary w-full py-3.5 font-bold"
            >
              Continue to Review
            </button>
          )}
        </>
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-5 space-y-4">
            <div>
              <p className="text-xs text-text-secondary">Solution</p>
              <p className="font-semibold">{product.name}</p>
            </div>
            {selectedPackage && (
              <div>
                <p className="text-xs text-text-secondary">Package</p>
                <p className="font-semibold">{selectedPackage.name}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-text-secondary">Total</p>
              <p className="text-xl font-black text-deshi-green">
                {formatPackagePrice(Number(selectedPackage?.price ?? product.starting_price), selectedPackage?.billing_type)}
              </p>
            </div>
            {product.requirement_fields.length > 0 && (
              <div>
                <p className="text-xs text-text-secondary mb-2">Requirements</p>
                <dl className="space-y-2">
                  {product.requirement_fields.map((field) => (
                    <div key={field.id} className="text-sm">
                      <dt className="text-text-secondary">{field.label}</dt>
                      <dd className="font-medium">{formValues[field.field_key] || '—'}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setStep('form')}
              className="deshi-btn-outline flex-1 py-3.5 font-semibold"
              disabled={isPending}
            >
              Edit Requirements
            </button>
            <button
              type="button"
              onClick={handleConfirmOrder}
              disabled={isPending}
              className="deshi-btn-primary flex-1 py-3.5 font-bold disabled:opacity-60"
            >
              {isPending ? 'Processing...' : 'Confirm Order'}
            </button>
          </div>
        </div>
      )}

      {step === 'form' && product.packages.length === 1 && product.packages[0] && (
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/10">
          <PackageComparison product={product} orderBasePath={detailPath} />
        </div>
      )}

      <p className="text-xs text-text-secondary text-center mt-6">
        You may need to log in to complete your order. Your form progress is saved in this browser.
      </p>
    </div>
  );
}
