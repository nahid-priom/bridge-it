'use client';

import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { SoftwareProductFeature } from '../types';
import { resolveFeatureIcon } from './feature-icons';
import { splitImportantFeatures, type DisplayFeature } from './important-features';

function FeatureItem({ feature }: { feature: DisplayFeature }) {
  const Icon = resolveFeatureIcon(feature.iconKey);
  return (
    <li className="flex h-full min-w-0 gap-2.5 rounded-xl border border-border-subtle bg-surface px-2.5 py-2.5 sm:gap-3 sm:rounded-2xl sm:px-3 sm:py-3">
      <span
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-bridge-primary/25 bg-bridge-primary/10 text-bridge-primary"
        aria-hidden
      >
        <Icon className="h-5 w-5" strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[0.8125rem] font-bold leading-snug text-text-primary sm:text-sm">
          {feature.title}
        </span>
        <span className="mt-0.5 block text-[0.6875rem] leading-snug text-text-muted line-clamp-2 sm:text-xs">
          {feature.shortDescription}
        </span>
      </span>
    </li>
  );
}

export function ImportantFeatureGrid({
  features,
  className,
  headingId = 'features-heading',
}: {
  features: SoftwareProductFeature[];
  className?: string;
  headingId?: string;
}) {
  const { initial, rest } = splitImportantFeatures(features);
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();
  const total = initial.length + rest.length;

  if (initial.length === 0) return null;

  return (
    <section className={cn('min-w-0', className)} aria-labelledby={headingId}>
      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 id={headingId} className="font-display text-xl font-black text-text-primary sm:text-2xl">
          Key Features
        </h2>
        {rest.length > 0 ? (
          <button
            type="button"
            className="shrink-0 text-sm font-semibold text-bridge-primary hover:underline"
            aria-expanded={expanded}
            aria-controls={panelId}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? 'Show less' : `View all (${total}) →`}
          </button>
        ) : null}
      </div>

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {initial.map((feature) => (
          <FeatureItem key={feature.id} feature={feature} />
        ))}
      </ul>

      {rest.length > 0 ? (
        <div
          id={panelId}
          className={cn(
            'grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none',
            expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          )}
          aria-hidden={!expanded}
        >
          <ul className="min-h-0 overflow-hidden">
            <li className="list-none pt-3">
              <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {rest.map((feature) => (
                  <FeatureItem key={feature.id} feature={feature} />
                ))}
              </ul>
            </li>
          </ul>
        </div>
      ) : null}

      {rest.length > 0 ? (
        <button
          type="button"
          className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-bridge-primary lg:hidden"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? 'Show less' : 'Show more features'}
          <ChevronDown
            className={cn('h-4 w-4 transition-transform duration-200', expanded && 'rotate-180')}
            aria-hidden
          />
        </button>
      ) : null}
    </section>
  );
}
