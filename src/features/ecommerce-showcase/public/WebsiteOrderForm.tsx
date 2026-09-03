'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldSelect } from '@/components/ui/FieldSelect';
import { formatBdt } from '@/lib/format/currency';
import { ROUTES } from '@/lib/routes';
import { placeWebsiteOrderAction } from '@/app/actions/ecommerce-showcase';
import { websiteOrderFormSchema, type WebsiteOrderFormValues } from '../schemas/project';
import { formatShowcasePackagePrice } from './PackageCards';
import type { EcommercePackage } from '../types';

export function WebsiteOrderForm({
  projectId,
  projectSlug,
  packages,
  defaultPackageId,
  defaultName,
  defaultPhone,
}: {
  projectId: string;
  projectSlug: string;
  packages: EcommercePackage[];
  defaultPackageId?: string;
  defaultName?: string;
  defaultPhone?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<WebsiteOrderFormValues>({
    resolver: zodResolver(websiteOrderFormSchema),
    defaultValues: {
      customer_name: defaultName ?? '',
      phone: defaultPhone ?? '',
      business_name: '',
      package_id: defaultPackageId ?? packages[0]?.id ?? '',
      notes: '',
    },
  });

  const selectedId = form.watch('package_id');
  const selected = packages.find((pkg) => pkg.id === selectedId) ?? packages[0];

  const onSubmit = (values: WebsiteOrderFormValues) => {
    setServerError(null);
    startTransition(async () => {
      const result = await placeWebsiteOrderAction({
        project_id: projectId,
        package_id: values.package_id,
        customer_name: values.customer_name,
        phone: values.phone,
        business_name: values.business_name,
        notes: values.notes,
      });
      if (result && 'needsAuth' in result && result.needsAuth) {
        router.push(
          `/login?next=${encodeURIComponent(`/websites/${projectSlug}/order?package=${values.package_id}`)}`
        );
        return;
      }
      if (result.error) {
        setServerError(result.error);
        return;
      }
      if (result.data?.id) {
        router.push(`${ROUTES.clientOrders}?placed=${result.data.id}`);
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {serverError ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p> : null}

      <label className="block text-sm font-semibold">
        Package
        <FieldSelect {...form.register('package_id')} className="mt-1 py-2.5">
          {packages.map((pkg, index) => (
            <option key={pkg.id} value={pkg.id}>
              {pkg.name} — {formatShowcasePackagePrice(pkg, index)}
            </option>
          ))}
        </FieldSelect>
      </label>
      {selected ? (
        <p className="text-sm text-text-secondary">
          You are ordering <span className="font-semibold text-text-primary">{selected.name}</span>
          {selected.short_description ? ` — ${selected.short_description}` : null}. Catalog price{' '}
          {formatBdt(Number(selected.price))}.
        </p>
      ) : null}

      <label className="block text-sm font-semibold">
        Full name *
        <input
          {...form.register('customer_name')}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-white/10 dark:bg-white/5"
        />
      </label>
      {form.formState.errors.customer_name ? (
        <p className="text-xs text-red-600">{form.formState.errors.customer_name.message}</p>
      ) : null}

      <label className="block text-sm font-semibold">
        Phone *
        <input
          {...form.register('phone')}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-white/10 dark:bg-white/5"
        />
      </label>
      {form.formState.errors.phone ? (
        <p className="text-xs text-red-600">{form.formState.errors.phone.message}</p>
      ) : null}

      <label className="block text-sm font-semibold">
        Business name
        <input
          {...form.register('business_name')}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-white/10 dark:bg-white/5"
        />
      </label>

      <label className="block text-sm font-semibold">
        Notes
        <textarea
          {...form.register('notes')}
          rows={3}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-white/10 dark:bg-white/5"
          placeholder="Domain, branding, or timeline notes"
        />
      </label>

      <button
        type="submit"
        disabled={pending || packages.length === 0}
        className="w-full rounded-xl bg-[#2563eb] py-3 font-semibold text-white hover:bg-[#1d4ed8] disabled:opacity-60"
      >
        {pending ? 'Placing order…' : 'Place order'}
      </button>
    </form>
  );
}
