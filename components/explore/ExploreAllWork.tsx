'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { ROUTES } from '@/lib/routes';
import { CATALOG_LISTING_GRID_CLASS } from '@/src/features/catalog/components/explore/types';
import {
  PortfolioCard,
  normalizeWebsiteProject,
  normalizeSoftwareProject,
  normalizeMarketingProject,
} from '@/src/features/catalog/components/portfolio-card';
import type { EcommerceProjectCard } from '@/src/features/ecommerce-showcase/types';
import type { SoftwareProjectCard } from '@/src/features/software-showcase/types';
import type { CreativeMarketingProjectCard } from '@/src/features/creative-marketing-showcase/types';

export type ExploreWorkItem =
  | { kind: 'website'; id: string; project: EcommerceProjectCard }
  | { kind: 'software'; id: string; project: SoftwareProjectCard }
  | { kind: 'marketing'; id: string; project: CreativeMarketingProjectCard };

type FilterId = 'all' | 'website' | 'software' | 'marketing';

const FILTERS: { id: FilterId; label: string; hubHref?: string }[] = [
  { id: 'all', label: 'All work' },
  { id: 'website', label: 'Websites', hubHref: ROUTES.websites },
  { id: 'software', label: 'Software', hubHref: ROUTES.softwareShowroom },
  { id: 'marketing', label: 'Marketing', hubHref: ROUTES.creativeMarketingShowroom },
];

function toCardData(item: ExploreWorkItem) {
  if (item.kind === 'website') return normalizeWebsiteProject(item.project);
  if (item.kind === 'software') return normalizeSoftwareProject(item.project);
  return normalizeMarketingProject(item.project);
}

export function ExploreAllWork({ items }: { items: ExploreWorkItem[] }) {
  const [filter, setFilter] = useState<FilterId>('all');

  const visible = useMemo(
    () => (filter === 'all' ? items : items.filter((item) => item.kind === filter)),
    [filter, items]
  );

  return (
    <div>
      <div
        className="mb-6 flex flex-wrap items-center gap-2 md:mb-8"
        role="navigation"
        aria-label="Portfolio categories"
      >
        {FILTERS.map((chip) => {
          const active = filter === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => setFilter(chip.id)}
              aria-pressed={active}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-colors sm:text-sm',
                active
                  ? 'border-[#0f2744]/90 bg-[#0f2744] text-white dark:border-white dark:bg-white dark:text-[#0f2744]'
                  : 'border-border-subtle bg-surface/80 text-text-secondary hover:border-[#2563eb]/35 hover:text-text-primary'
              )}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-border-subtle bg-surface/70 px-6 py-16 text-center">
          <p className="text-sm text-text-secondary">No projects in this category yet.</p>
          <Link href={ROUTES.websites} className="mt-4 inline-block text-sm font-semibold text-[#2563eb] hover:underline">
            Browse website templates
          </Link>
        </div>
      ) : (
        <ul className={CATALOG_LISTING_GRID_CLASS}>
          {visible.map((item, index) => (
            <li key={item.id} className="min-w-0 list-none">
              <PortfolioCard
                data={toCardData(item)}
                eager={index < 4}
                priority={index === 0}
              />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle/80 pt-8 md:mt-14">
        <p className="max-w-md text-sm text-text-secondary">
          Prefer a focused catalog? Open websites, software, or marketing showrooms.
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
          {FILTERS.filter((f) => f.hubHref).map((f) => (
            <Link key={f.id} href={f.hubHref!} className="text-[#2563eb] hover:underline">
              {f.label} →
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
