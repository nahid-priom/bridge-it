'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { ROUTES } from '@/lib/routes';
import { creativeServiceGroupLabel } from '../config/constants';
import type { CreativeMarketingAsset, CreativeMarketingProjectDetail } from '../types';
import { CreativeMarketingCard } from './CreativeMarketingCard';
import { formatCreativePackagePrice, formatCreativeStartingPrice } from './format-price';

function assetUrl(asset: CreativeMarketingAsset | null | undefined): string | null {
  if (!asset) return null;
  return asset.image_url || asset.thumbnail_url || null;
}

export function CreativeMarketingPreview({ project }: { project: CreativeMarketingProjectDetail }) {
  const assets = useMemo(
    () => project.assets.filter((a) => a.published).sort((a, b) => a.sort_order - b.sort_order),
    [project.assets]
  );
  const initial = assets.find((a) => a.is_featured) ?? assets.find((a) => assetUrl(a)) ?? assets[0];
  const [selectedKey, setSelectedKey] = useState(initial?.asset_key);
  const selected = assets.find((a) => a.asset_key === selectedKey) ?? initial ?? null;
  const imageUrl = assetUrl(selected);
  const cover = project.cover_detail_url ?? project.cover_card_url;
  const groupLabel = creativeServiceGroupLabel(project.service_group);

  useEffect(() => {
    if (!selectedKey && initial?.asset_key) setSelectedKey(initial.asset_key);
  }, [initial?.asset_key, selectedKey]);

  return (
    <div className="pb-28 lg:pb-16">
      <div className="mx-auto w-full max-w-[1480px] px-4 pt-[calc(var(--header-offset)+0.75rem)] sm:px-6 lg:px-8 lg:pt-[calc(var(--header-offset)+1rem)] xl:px-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.65fr)_minmax(280px,0.35fr)] lg:gap-8">
          <aside className="min-w-0 lg:order-2 lg:sticky lg:top-[calc(var(--header-offset)+0.75rem)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#2563eb] dark:text-[#60a5fa]">
              {groupLabel}
            </p>
            <h1 className="mt-2 font-display text-[1.75rem] font-black leading-tight text-text-primary sm:text-3xl">
              {project.title}
            </h1>
            {project.outcome_line ? (
              <p className="mt-2 text-sm text-text-secondary">{project.outcome_line}</p>
            ) : null}
            <p className="mt-3 text-lg font-semibold text-text-primary">
              {formatCreativeStartingPrice(project.starting_price, project.price_suffix, project.currency)}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wide text-text-muted">
              Pricing: {project.pricing_model.replace('_', ' ')}
            </p>
            {project.short_description ? (
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{project.short_description}</p>
            ) : null}
            <div className="mt-5 hidden flex-col gap-2.5 lg:flex">
              <Link
                href={ROUTES.consultation}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#2563eb] px-5 py-3 font-semibold text-white hover:bg-[#1d4ed8]"
              >
                Get Started
              </Link>
            </div>
          </aside>

          <section className="min-w-0 lg:order-1">
            {cover ? (
              <div className="mb-5 overflow-hidden rounded-2xl border border-border-subtle bg-background-soft">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cover}
                  alt={`${project.title} cover`}
                  width={1200}
                  height={750}
                  loading="eager"
                  decoding="async"
                  className="h-auto w-full object-cover object-top"
                />
              </div>
            ) : null}

            {assets.length > 0 ? (
              <>
                <h2 className="mb-3 font-display text-xl font-black">Portfolio / Preview</h2>
                <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                  {assets.map((asset) => {
                    const active = asset.asset_key === selected?.asset_key;
                    return (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={() => setSelectedKey(asset.asset_key)}
                        className={cn(
                          'shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold',
                          active
                            ? 'bg-[#0f2744] text-white'
                            : 'border border-border-subtle text-text-secondary hover:border-[#2563eb]/40'
                        )}
                      >
                        {asset.asset_name}
                      </button>
                    );
                  })}
                </div>
                <div className="overflow-hidden rounded-2xl border border-border-subtle bg-background-soft">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={imageUrl}
                      src={imageUrl}
                      alt={`${project.title} — ${selected?.asset_name ?? 'preview'}`}
                      width={960}
                      height={600}
                      loading="lazy"
                      className="h-auto w-full object-contain object-top"
                    />
                  ) : (
                    <div className="flex min-h-[240px] items-center justify-center text-sm text-text-muted">
                      Preview unavailable
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </section>
        </div>

        {project.full_description ? (
          <section className="mt-10 max-w-3xl lg:mt-14">
            <h2 className="mb-3 font-display text-xl font-black">About this service</h2>
            <p className="whitespace-pre-line leading-relaxed text-text-secondary">{project.full_description}</p>
          </section>
        ) : null}

        {project.packages.length > 0 ? (
          <section className="mt-10 lg:mt-14">
            <h2 className="mb-4 font-display text-xl font-black">Packages</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {project.packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={cn(
                    'rounded-2xl border p-4',
                    pkg.is_popular
                      ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-500/10'
                      : 'border-border-subtle'
                  )}
                >
                  <p className="font-display font-bold">{pkg.name}</p>
                  <p className="mt-2 text-xl font-black">
                    {formatCreativePackagePrice(pkg.price, pkg.currency, pkg.pricing_model)}
                  </p>
                  {pkg.short_description ? (
                    <p className="mt-1 text-sm text-text-secondary">{pkg.short_description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {project.related.length > 0 ? (
          <section className="mt-10 lg:mt-14">
            <h2 className="mb-4 font-display text-xl font-black">Related services</h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {project.related.slice(0, 3).map((related) => (
                <CreativeMarketingCard key={related.id} project={related} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-10 lg:mt-14">
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-border-subtle bg-surface px-6 py-8 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-xl font-black">Ready to get started?</h2>
              <p className="mt-1 text-sm text-text-secondary">
                Tell us about your brand — design and marketing can run together.
              </p>
            </div>
            <Link
              href={ROUTES.consultation}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#2563eb] px-6 text-sm font-semibold text-white hover:bg-[#1d4ed8]"
            >
              Free Consultation
            </Link>
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
        <Link
          href={ROUTES.consultation}
          className="flex w-full items-center justify-center rounded-xl bg-[#2563eb] py-3 font-semibold text-white"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
