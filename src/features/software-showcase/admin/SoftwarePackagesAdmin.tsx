'use client';

import { useState, useTransition } from 'react';
import type { SoftwarePackage } from '../types';
import {
  softDeleteSoftwarePackageAction,
  upsertSoftwarePackageAction,
} from './package-actions';
import { formatPackagePrice } from '../public/package-utils';

const TIERS = ['starter', 'basic', 'standard', 'professional', 'enterprise'] as const;

export function SoftwarePackagesAdmin({
  projectId,
  projectSlug,
  packages,
}: {
  projectId: string;
  projectSlug: string;
  packages: SoftwarePackage[];
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<SoftwarePackage | null>(packages[0] ?? null);

  const [form, setForm] = useState({
    name: editing?.name ?? 'Standard',
    tier: (editing?.tier as string) || 'standard',
    price: editing?.price ?? 0,
    short_description: editing?.short_description ?? '',
    target_business_size: editing?.target_business_size ?? 'growing',
    badge: editing?.badge ?? '',
    features: (editing?.features ?? []).join('\n'),
    is_recommended: editing?.is_recommended ?? false,
    is_popular: editing?.is_popular ?? false,
    sort_order: editing?.sort_order ?? 30,
  });

  const selectPkg = (pkg: SoftwarePackage) => {
    setEditing(pkg);
    setForm({
      name: pkg.name,
      tier: (pkg.tier as string) || 'standard',
      price: pkg.price,
      short_description: pkg.short_description ?? '',
      target_business_size: pkg.target_business_size ?? '',
      badge: pkg.badge ?? '',
      features: pkg.features.join('\n'),
      is_recommended: Boolean(pkg.is_recommended),
      is_popular: Boolean(pkg.is_popular),
      sort_order: pkg.sort_order,
    });
    setMessage(null);
    setError(null);
  };

  const save = () => {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await upsertSoftwarePackageAction({
        id: editing?.id,
        project_id: projectId,
        project_slug: projectSlug,
        name: form.name,
        tier: form.tier,
        price: Number(form.price) || 0,
        short_description: form.short_description,
        target_business_size: form.target_business_size,
        badge: form.badge,
        features: form.features
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean),
        is_recommended: form.is_recommended,
        is_popular: form.is_popular,
        sort_order: form.sort_order,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      setMessage('Package saved. Reload the page to refresh the list.');
    });
  };

  const remove = () => {
    if (!editing?.id) return;
    if (!window.confirm(`Soft-delete package "${editing.name}"?`)) return;
    startTransition(async () => {
      const result = await softDeleteSoftwarePackageAction({
        id: editing.id,
        project_slug: projectSlug,
      });
      if (result.error) setError(result.error);
      else setMessage('Package deleted. Reload to refresh.');
    });
  };

  return (
    <section className="mt-8 rounded-2xl border border-border-subtle bg-surface p-5">
      <h2 className="font-display text-lg font-black text-text-primary">Packages (Starter → Enterprise)</h2>
      <p className="mt-1 text-sm text-text-muted">
        Packages live on the product page only — they are not separate SEO URLs.
      </p>

      <div className="mt-4 grid gap-4 lg:grid-cols-[220px_1fr]">
        <ul className="space-y-1">
          {packages.map((pkg) => (
            <li key={pkg.id}>
              <button
                type="button"
                onClick={() => selectPkg(pkg)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                  editing?.id === pkg.id ? 'bg-[#0f2744] text-white' : 'hover:bg-background-soft'
                }`}
              >
                <span className="font-semibold">{pkg.name}</span>
                <span className="mt-0.5 block text-xs opacity-80">
                  {formatPackagePrice(pkg.price, pkg.currency)}
                </span>
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({
                  name: 'New Package',
                  tier: 'starter',
                  price: 0,
                  short_description: '',
                  target_business_size: 'small',
                  badge: '',
                  features: '',
                  is_recommended: false,
                  is_popular: false,
                  sort_order: 10,
                });
              }}
              className="w-full rounded-lg border border-dashed border-border-subtle px-3 py-2 text-left text-sm font-semibold text-[#2563eb]"
            >
              + Add package
            </button>
          </li>
        </ul>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-medium">Name</span>
            <input
              className="w-full rounded-xl border border-border-subtle bg-background px-3 py-2"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Tier</span>
            <select
              className="w-full rounded-xl border border-border-subtle bg-background px-3 py-2"
              value={form.tier}
              onChange={(e) => setForm((f) => ({ ...f, tier: e.target.value }))}
            >
              {TIERS.map((tier) => (
                <option key={tier} value={tier}>
                  {tier}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Price (BDT)</span>
            <input
              type="number"
              className="w-full rounded-xl border border-border-subtle bg-background px-3 py-2"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) || 0 }))}
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Business size</span>
            <input
              className="w-full rounded-xl border border-border-subtle bg-background px-3 py-2"
              value={form.target_business_size}
              onChange={(e) => setForm((f) => ({ ...f, target_business_size: e.target.value }))}
            />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="mb-1 block font-medium">Short description</span>
            <textarea
              rows={2}
              className="w-full rounded-xl border border-border-subtle bg-background px-3 py-2"
              value={form.short_description}
              onChange={(e) => setForm((f) => ({ ...f, short_description: e.target.value }))}
            />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="mb-1 block font-medium">Features (one per line, 4–6)</span>
            <textarea
              rows={5}
              className="w-full rounded-xl border border-border-subtle bg-background px-3 py-2"
              value={form.features}
              onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))}
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Badge</span>
            <input
              className="w-full rounded-xl border border-border-subtle bg-background px-3 py-2"
              value={form.badge}
              onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={form.is_recommended}
              onChange={(e) => setForm((f) => ({ ...f, is_recommended: e.target.checked }))}
            />
            Recommended
          </label>
          {error ? <p className="text-sm text-red-600 sm:col-span-2">{error}</p> : null}
          {message ? <p className="text-sm text-emerald-700 sm:col-span-2">{message}</p> : null}
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <button
              type="button"
              disabled={pending}
              onClick={save}
              className="inline-flex h-10 items-center rounded-xl bg-[#0f2744] px-4 text-sm font-semibold text-white disabled:opacity-60"
            >
              {pending ? 'Saving…' : 'Save package'}
            </button>
            {editing?.id ? (
              <button
                type="button"
                disabled={pending}
                onClick={remove}
                className="inline-flex h-10 items-center rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-700"
              >
                Delete
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
