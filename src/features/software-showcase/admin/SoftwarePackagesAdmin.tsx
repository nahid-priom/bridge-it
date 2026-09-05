'use client';

import { useState, useTransition } from 'react';
import type { SoftwarePackage, SoftwarePackageFeature } from '../types';
import {
  replaceSoftwarePackageFeaturesAction,
  softDeleteSoftwarePackageAction,
  upsertSoftwarePackageAction,
} from './package-actions';
import { SOFTWARE_FEATURE_GROUP_ORDER } from '../public/package-features';
import { formatPackagePrice } from '../public/package-utils';

const TIERS = ['starter', 'basic', 'standard', 'professional', 'enterprise'] as const;

type FeatureDraft = {
  localId: string;
  feature_key: string;
  label: string;
  feature_group: string;
  is_included: boolean;
  is_highlighted: boolean;
  display_order: number;
};

function toFeatureDrafts(rows: SoftwarePackageFeature[]): FeatureDraft[] {
  return rows
    .slice()
    .sort((a, b) => a.display_order - b.display_order)
    .map((row, index) => ({
      localId: row.id || `row-${index}`,
      feature_key: row.feature_key,
      label: row.label,
      feature_group: row.feature_group || 'Operations',
      is_included: row.is_included,
      is_highlighted: row.is_highlighted,
      display_order: row.display_order ?? index,
    }));
}

function emptyFeature(order: number): FeatureDraft {
  return {
    localId: `new-${Date.now()}-${order}`,
    feature_key: '',
    label: '',
    feature_group: 'Operations',
    is_included: true,
    is_highlighted: false,
    display_order: order,
  };
}

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
  const [featureDrafts, setFeatureDrafts] = useState<FeatureDraft[]>(
    toFeatureDrafts(packages[0]?.feature_rows ?? [])
  );

  const [form, setForm] = useState({
    name: editing?.name ?? 'Standard',
    tier: (editing?.tier as string) || 'standard',
    price: editing?.price ?? 0,
    short_description: editing?.short_description ?? '',
    target_business_size: editing?.target_business_size ?? 'growing',
    badge: editing?.badge ?? '',
    is_recommended: editing?.is_recommended ?? false,
    is_popular: editing?.is_popular ?? false,
    sort_order: editing?.sort_order ?? 30,
    active: editing?.active ?? true,
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
      is_recommended: Boolean(pkg.is_recommended),
      is_popular: Boolean(pkg.is_popular),
      sort_order: pkg.sort_order,
      active: pkg.active !== false,
    });
    setFeatureDrafts(toFeatureDrafts(pkg.feature_rows ?? []));
    setMessage(null);
    setError(null);
  };

  const save = () => {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const includedLabels = featureDrafts
        .filter((f) => f.is_included && f.label.trim())
        .map((f) => f.label.trim());

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
        features: includedLabels,
        is_recommended: form.is_recommended,
        is_popular: form.is_popular,
        sort_order: form.sort_order,
        active: form.active,
      });
      if (result.error) {
        setError(result.error);
        return;
      }

      const packageId = result.id ?? editing?.id;
      if (packageId) {
        const featureResult = await replaceSoftwarePackageFeaturesAction({
          package_id: packageId,
          project_slug: projectSlug,
          features: featureDrafts.map((f, index) => ({
            feature_key: f.feature_key || undefined,
            label: f.label,
            feature_group: f.feature_group,
            is_included: f.is_included,
            is_highlighted: f.is_highlighted,
            display_order: index,
          })),
        });
        if (featureResult.error) {
          setError(featureResult.error);
          return;
        }
      }

      setMessage('Package and features saved. Reload the page to refresh the list.');
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
        Price, badge, recommended flag, and feature groups come from the database and drive the public product page.
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
                  is_recommended: false,
                  is_popular: false,
                  sort_order: 10,
                  active: true,
                });
                setFeatureDrafts([emptyFeature(0)]);
              }}
              className="w-full rounded-lg border border-dashed border-border-subtle px-3 py-2 text-left text-sm font-semibold text-[#2563eb]"
            >
              + Add package
            </button>
          </li>
        </ul>

        <div className="space-y-4">
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
            <label className="text-sm">
              <span className="mb-1 block font-medium">Badge</span>
              <input
                className="w-full rounded-xl border border-border-subtle bg-background px-3 py-2"
                value={form.badge}
                onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium">Sort order</span>
              <input
                type="number"
                className="w-full rounded-xl border border-border-subtle bg-background px-3 py-2"
                value={form.sort_order}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) || 0 }))}
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
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              />
              Active
            </label>
          </div>

          <div className="rounded-xl border border-border-subtle p-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-text-primary">Feature groups</h3>
              <button
                type="button"
                onClick={() => setFeatureDrafts((rows) => [...rows, emptyFeature(rows.length)])}
                className="text-sm font-semibold text-[#2563eb]"
              >
                + Add feature
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {featureDrafts.map((feature) => (
                <div
                  key={feature.localId}
                  className="grid gap-2 rounded-lg border border-border-subtle bg-background-soft/40 p-2 sm:grid-cols-[1fr_160px_auto]"
                >
                  <input
                    className="rounded-lg border border-border-subtle bg-background px-2 py-1.5 text-sm"
                    placeholder="Feature label"
                    value={feature.label}
                    onChange={(e) =>
                      setFeatureDrafts((rows) =>
                        rows.map((row) =>
                          row.localId === feature.localId ? { ...row, label: e.target.value } : row
                        )
                      )
                    }
                  />
                  <select
                    className="rounded-lg border border-border-subtle bg-background px-2 py-1.5 text-sm"
                    value={feature.feature_group}
                    onChange={(e) =>
                      setFeatureDrafts((rows) =>
                        rows.map((row) =>
                          row.localId === feature.localId
                            ? { ...row, feature_group: e.target.value }
                            : row
                        )
                      )
                    }
                  >
                    {SOFTWARE_FEATURE_GROUP_ORDER.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <label className="inline-flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={feature.is_included}
                        onChange={(e) =>
                          setFeatureDrafts((rows) =>
                            rows.map((row) =>
                              row.localId === feature.localId
                                ? { ...row, is_included: e.target.checked }
                                : row
                            )
                          )
                        }
                      />
                      Included
                    </label>
                    <label className="inline-flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={feature.is_highlighted}
                        onChange={(e) =>
                          setFeatureDrafts((rows) =>
                            rows.map((row) =>
                              row.localId === feature.localId
                                ? { ...row, is_highlighted: e.target.checked }
                                : row
                            )
                          )
                        }
                      />
                      Highlight
                    </label>
                    <button
                      type="button"
                      className="text-red-600"
                      onClick={() =>
                        setFeatureDrafts((rows) => rows.filter((row) => row.localId !== feature.localId))
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              {featureDrafts.length === 0 ? (
                <p className="text-sm text-text-muted">No features yet — add groups for this package.</p>
              ) : null}
            </div>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
          <div className="flex flex-wrap gap-2">
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
