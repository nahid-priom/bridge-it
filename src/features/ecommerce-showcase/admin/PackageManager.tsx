'use client';

import { useState, useTransition } from 'react';
import { upsertPackagesAction } from '@/app/actions/ecommerce-showcase';
import type { EcommercePackage } from '../types';
import { cmsInput, cmsSection } from './ui';

type Draft = {
  id?: string;
  name: string;
  price: number;
  short_description: string;
  featuresText: string;
  is_popular: boolean;
};

function toDraft(pkg: EcommercePackage): Draft {
  return {
    id: pkg.id,
    name: pkg.name,
    price: pkg.price,
    short_description: pkg.short_description ?? '',
    featuresText: pkg.features.join('\n'),
    is_popular: pkg.is_popular,
  };
}

export function PackageManager({
  projectId,
  packages,
  canEdit,
}: {
  projectId: string;
  packages: EcommercePackage[];
  canEdit: boolean;
}) {
  const [drafts, setDrafts] = useState<Draft[]>(
    packages.length
      ? packages.map(toDraft)
      : [
          { name: 'Landing Page', price: 10000, short_description: 'Premium single-page storefront', featuresText: 'Premium Landing Page\nProduct / Offer presentation\nCTA / Order action\nMobile Responsive\nLead / Order Form', is_popular: false },
          { name: 'E-commerce Website', price: 30000, short_description: 'Complete store with cart and checkout', featuresText: 'Homepage + Shop + Product + Cart + Checkout\nResponsive Design\nProduct Management\nBasic Admin\nSEO Setup', is_popular: true },
          { name: 'Premium Custom', price: 70000, short_description: 'Custom commerce with automations', featuresText: 'Fully Custom UI/UX\nInventory / Stock\nCourier Automation\nAdvanced Checkout & Analytics\nPOS / ERP integrations where required', is_popular: false },
        ]
  );
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <section className={cmsSection}>
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold">Packages</h2>
        {canEdit ? (
          <button
            type="button"
            onClick={() =>
              setDrafts((current) => [
                ...current,
                { name: 'New package', price: 0, short_description: '', featuresText: '', is_popular: false },
              ])
            }
            className="text-sm text-emerald-600"
          >
            Add package
          </button>
        ) : null}
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        {drafts.map((draft, index) => (
          <div key={draft.id ?? `new-${index}`} className="rounded-xl border border-border-subtle p-3 space-y-2">
            <input
              value={draft.name}
              disabled={!canEdit}
              onChange={(event) =>
                setDrafts((current) => current.map((item, i) => (i === index ? { ...item, name: event.target.value } : item)))
              }
              className={cmsInput}
            />
            <input
              type="number"
              value={draft.price}
              disabled={!canEdit}
              onChange={(event) =>
                setDrafts((current) =>
                  current.map((item, i) => (i === index ? { ...item, price: Number(event.target.value) } : item))
                )
              }
              className={cmsInput}
            />
            <textarea
              value={draft.featuresText}
              disabled={!canEdit}
              onChange={(event) =>
                setDrafts((current) =>
                  current.map((item, i) => (i === index ? { ...item, featuresText: event.target.value } : item))
                )
              }
              rows={5}
              className={cmsInput}
              placeholder="One feature per line"
            />
            <label className="text-xs flex items-center gap-2">
              <input
                type="checkbox"
                checked={draft.is_popular}
                disabled={!canEdit}
                onChange={(event) =>
                  setDrafts((current) =>
                    current.map((item, i) => (i === index ? { ...item, is_popular: event.target.checked } : item))
                  )
                }
              />
              Popular
            </label>
          </div>
        ))}
      </div>
      {canEdit ? (
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              setError(null);
              setSaved(false);
              const result = await upsertPackagesAction(
                projectId,
                drafts.map((draft, index) => ({
                  id: draft.id,
                  name: draft.name,
                  price: draft.price,
                  short_description: draft.short_description,
                  features: draft.featuresText.split('\n').map((line) => line.trim()).filter(Boolean),
                  is_popular: draft.is_popular,
                  sort_order: index,
                  active: true,
                }))
              );
              if (result.error) setError(result.error);
              else setSaved(true);
            })
          }
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold"
        >
          Save packages
        </button>
      ) : null}
      {saved ? <p className="text-sm text-emerald-600">Packages saved.</p> : null}
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </section>
  );
}
