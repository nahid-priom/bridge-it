'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldSelect } from '@/components/ui/FieldSelect';
import { submitShowcaseLeadAction } from '@/app/actions/ecommerce-showcase';
import { leadFormSchema, type LeadFormValues } from '../schemas/project';
import type { EcommercePackage } from '../types';
import { catalogTierForPackage, formatCatalogTierPrice } from '../utils/filters';

export function LeadForm({
  projectId,
  packages,
  defaultPackageId,
  source = 'project_page',
  onClose,
}: {
  projectId?: string;
  packages?: EcommercePackage[];
  defaultPackageId?: string;
  source?: string;
  onClose?: () => void;
}) {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      business_name: '',
      package_id: defaultPackageId ?? '',
      message: '',
    },
  });

  const onSubmit = (values: LeadFormValues) => {
    setServerError(null);
    startTransition(async () => {
      const result = await submitShowcaseLeadAction({
        ...values,
        project_id: projectId,
        source,
      });
      if (result.error) {
        setServerError(result.error);
        return;
      }
      setSuccess(true);
    });
  };

  if (success) {
    return (
      <div className="text-center py-6">
        <h3 className="font-display text-2xl font-bold text-emerald-700">Request received</h3>
        <p className="mt-2 text-sm text-text-secondary">
          আমরা শীঘ্রই আপনার সাথে কথা বলে এই Design অনুযায়ী Website নিয়ে আলোচনা করব।
        </p>
        {onClose ? (
          <button type="button" onClick={onClose} className="mt-5 text-sm font-semibold text-[#0f2744]">
            Close
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}
      <label className="block text-sm font-semibold">
        Name *
        <input
          {...form.register('name')}
          className="mt-1 w-full rounded-xl border border-slate-200 dark:border-white/10 px-3 py-2.5 bg-white dark:bg-white/5"
        />
      </label>
      {form.formState.errors.name ? (
        <p className="text-xs text-red-600">{form.formState.errors.name.message}</p>
      ) : null}
      <label className="block text-sm font-semibold">
        Phone *
        <input
          {...form.register('phone')}
          className="mt-1 w-full rounded-xl border border-slate-200 dark:border-white/10 px-3 py-2.5 bg-white dark:bg-white/5"
        />
      </label>
      {form.formState.errors.phone ? (
        <p className="text-xs text-red-600">{form.formState.errors.phone.message}</p>
      ) : null}
      <label className="block text-sm font-semibold">
        Business Name
        <input
          {...form.register('business_name')}
          className="mt-1 w-full rounded-xl border border-slate-200 dark:border-white/10 px-3 py-2.5 bg-white dark:bg-white/5"
        />
      </label>
      {packages && packages.length > 0 ? (
        <label className="block text-sm font-semibold">
          Preferred Package
          <FieldSelect {...form.register('package_id')} className="mt-1 py-2.5">
            <option value="">Select a package</option>
            {packages.map((pkg, index) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name} — {formatCatalogTierPrice(catalogTierForPackage(pkg, index))}
              </option>
            ))}
          </FieldSelect>
        </label>
      ) : null}
      <label className="block text-sm font-semibold">
        Message
        <textarea
          {...form.register('message')}
          rows={3}
          className="mt-1 w-full rounded-xl border border-slate-200 dark:border-white/10 px-3 py-2.5 bg-white dark:bg-white/5"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 disabled:opacity-60"
      >
        {pending ? 'Sending…' : 'Free Consultation'}
      </button>
    </form>
  );
}
